#include "StreamManager.h"



StreamManager::StreamManager(string id, const FreewordList& freewordList)
{
	// Save id and get a new calculator
	this->id = id;
	calculator = new GraphDataCalculator(freewordList);
	conn = mongocxx::client{ mongocxx::uri{ "mongodb://127.0.0.1:27017" } };
	//conn = mongocxx::client{ mongocxx::uri{ "mongodb://192.168.1.26:27017" } };
	countTweets = 0;
	//event
	eventManager = new EventManager(id);
	// graphSize
	graphTooLarge = false;
}


StreamManager::~StreamManager()
{
	if (graphTooLarge)
	{
		Output result;
		calculator->GetGraphData(result, countTweets);
		Input tweets;
		graphTransferToBson(result, true);
	}

	delete calculator;
	delete eventManager;
	eventManager = nullptr;
	calculator = nullptr;
}

bool StreamManager::addTweets(const Input & tweets)
{
	countTweets += tweets.size();
	writeTweets(tweets);
	Output result;
	calculator->Calculate(tweets, result, false, countTweets, eventManager, !graphTooLarge);
	bool res = graphTransferToBson(result);
	return res;
}

bool StreamManager::graphTransferToBson(const Output & graph, bool isFinallyWrite)
{
	int32_t i = 0, j = 0;

	// If graph is too large, we will not build the edges and nodes until stream done
	if (!graphTooLarge || isFinallyWrite)
	{
		int32_t nodeLength = graph.graphMetadata.numberOfNodes;
		int32_t edgeLength = graph.graphMetadata.numberOfEdges;
		int32_t topusersLength = graph.topUsers.size();

		// build edges document
		bsoncxx::builder::basic::array edges_array;
		
		for (i = 0; i < edgeLength; i++)
		{
			// build tweets
			bsoncxx::builder::basic::array tweets_array;
			int32_t lent = graph.graphData.edges[i].tweets.size();
			for (j = 0; j < lent; j++)
			{
				tweets_array.append(graph.graphData.edges[i].tweets[j]);
			}
			// build edge
			document edge_builder;
			auto edge = edge_builder
				<< "id" << graph.graphData.edges[i].id
				<< "tweets" << concatenate(tweets_array.view())
				<< "source" << graph.graphData.edges[i].source
				<< "target" << graph.graphData.edges[i].target
				<< "size" << graph.graphData.edges[i].size
				<< "weight" << graph.graphData.edges[i].weight
				<< "label" << graph.graphData.edges[i].label << finalize;
			edges_array.append(edge);
		}

		// build nodes document
		bsoncxx::builder::basic::array nodes_array;
		for (i = 0; i < nodeLength; i++)
		{
			// build node
			document node_builder;
			auto node = node_builder
				<< "id" << graph.graphData.nodes[i].id
				<< "label" << graph.graphData.nodes[i].label
				<< "size" << graph.graphData.nodes[i].size
				<< "weight" << graph.graphData.nodes[i].weight
				<< "x" << graph.graphData.nodes[i].x
				<< "y" << graph.graphData.nodes[i].y << finalize;
			nodes_array.append(node);
		}

		// build top users document
		bsoncxx::builder::basic::array topusers_array;
		for (i = 0; i < topusersLength; i++)
		{
			// build node
			document topuser_builder;
			auto topuser = topuser_builder
				<< "username" << graph.topUsers[i].username
				<< "tweetCount" << graph.topUsers[i].tweetCount << finalize;
			topusers_array.append(topuser);
		}

		document topLevel_builder;
		auto topLevel = topLevel_builder
			<< "_id" << id
			<< "graphData"
			<< open_document
			<< "edges" << concatenate(edges_array.view())
			<< "nodes" << concatenate(nodes_array.view())
			<< close_document
			<< "graphMetadata"
			<< open_document
			<< "numberOfTweets" << countTweets
			<< "numberOfNodes" << nodeLength
			<< "numberOfEdges" << edgeLength
			<< close_document
			<< "topUsers" << topusers_array
			<< "writeInGridFS" << graphTooLarge
			<< finalize;

		size_t graphSize = topLevel.view().length();

		if (isFinallyWrite)
		{
			auto db_meteor = conn["meteor"];
			auto gfs_uploader = db_meteor.gridfs_bucket().open_upload_stream(id);
			gfs_uploader.write(topLevel.view().data(), graphSize);
			gfs_uploader.close();

			auto collection_graphs = conn["meteor"]["graphs"];
			collection_graphs.update_one(
				document() << "_id" << this->id << finalize,
				document() << "$set"
				<< open_document
				<< "writeInGridFS" << true
				<< close_document
				<< finalize);
			cout << "Added file for stream: " << id << endl;
			return true;
		}
		
		// Document of graph is lager than the limitation of the mongodb
		/* Because if a graph is lager than 16Mb, it's also imposible to
		/* display it by browser, the better method is keep it in the memory
		/* of server and when the stream done, write it in the GridFS of Mongodb,
		/* user can download it as a file.
		*/
		// 16Mb = 16777216 bytes
		if (graphSize > 16777216)
		{
			cout << "Graph reach a limitation of 16Mb, will not upadte it until finish the stream" << endl;
			graphTooLarge = true;
		}
		else
		{
			bsoncxx::stdx::optional<mongocxx::result::insert_one> res_insert;
			bsoncxx::stdx::optional<mongocxx::result::delete_result> res_delete;
			auto collection_graphs = conn["meteor"]["graphs"];
			res_delete = collection_graphs.delete_one(document() << "_id" << this->id << finalize);
			res_insert = collection_graphs.insert_one(topLevel.view());
			if (res_insert->result().inserted_count() == 1) return true; else return false;
		}
	}
}

void StreamManager::writeTweets(const Input & tweets)
{
	int32_t i, j;
	// build tweets
	int32_t tweetsLength = tweets.size();
	auto collection_tweets = conn["meteor"]["tweets"];
	auto collection_geo = conn["meteor"]["geo"];
	for (i = 0; i < tweetsLength; i++)
	{
		// build hashtags
		bsoncxx::builder::basic::array hashtags_array;
		int32_t lenh = tweets[i].hashtags.size();
		for (j = 0; j < lenh; j++)
		{
			hashtags_array.append(tweets[i].hashtags[j]);
		}

		// geoInfo
		bool hasGeoinfo = tweets[i].geoInfo.hasGeoinfo;
		document geoInfo_builder;
		auto geoInfo = geoInfo_builder
			<< "hasGeoinfo" << false
			<< finalize;

		if (hasGeoinfo)
		{
			geoInfo = geoInfo_builder
				<< "hasGeoinfo" << true
				<< "isPoint" << tweets[i].geoInfo.isPoint
				<< "location" 
				<< open_document
				<< "type" << "Point"
				<< "coordinates"
				<< open_array
				<< tweets[i].geoInfo.x
				<< tweets[i].geoInfo.y
				<< close_array
				<< close_document
				<< finalize;
			
			// For heatmap display
			document geoHeatmap_builder;
			auto geoHeatmap = geoHeatmap_builder
				<< "gid" << id
				<< "tid" << tweets[i].id
				<< "location"
				<< open_document
				<< "type" << "Point"
				<< "coordinates"
				<< open_array
				<< tweets[i].geoInfo.x
				<< tweets[i].geoInfo.y
				<< close_array
				<< close_document
				<< "hashtags" << concatenate(hashtags_array.view())
				<< finalize;
			try
			{
				collection_geo.insert_one(geoHeatmap.view());
			}
			catch (const std::exception& err)
			{
				cout << err.what() << endl;
				cout << "Tweet id " << tweets[i].id << " has Geoinfo but there is an error when insert into database." << endl;
			}
		}

		// build tweet
		document tweet_builder;
		auto tweet = tweet_builder
			<< "_id" << tweets[i].id
			<< "id" << tweets[i].id
			<< "gid" << id
			<< "created_at" << tweets[i].created_at
			<< "text" << tweets[i].text
			<< "user"
			<< open_document
			<< "name" << tweets[i].user.name
			<< "screen_name" << tweets[i].user.screen_name
			<< "verified" << tweets[i].user.verified
			<< "profile_image_url_https" << tweets[i].user.profile_image_url_https
			<< close_document
			<< "retweet_count" << tweets[i].retweet_count
			<< "favorite_count" << tweets[i].favorite_count
			<< "lang" << tweets[i].lang
			<< "hashtags" << concatenate(hashtags_array.view())
			<< "geoInfo" << concatenate(geoInfo.view()) << finalize;
		
		try
		{
			collection_tweets.insert_one(tweet.view());
		}
		catch (const std::exception& err)
		{
			cout << err.what() << endl;
			cout << "Tweet id " << tweets[i].id << " is already in the database" << endl;
		}
	}
}
