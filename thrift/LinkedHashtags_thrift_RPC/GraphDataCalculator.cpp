#include "GraphDataCalculator.h"

inline bool GraphDataCalculator::compareNodes(Node *i, Node *j)
{
	return (i->size > j->size);
}

bool GraphDataCalculator::compareByValue(pair<string, int>& lhs, pair<string, int>& rhs)
{
	return (lhs.second > rhs.second);
}

GraphDataCalculator::GraphDataCalculator(const FreewordList& freewordList)
{
	if (freewordList.hasFreewordList)
	{
		this->isAddFreeword = true;
		this->fwList = freewordList.ListFreeword;
		this->fwListLength = this->fwList.size();
	}
	else
	{
		this->isAddFreeword = false;
		this->fwListLength = 0;
	}
		
	node_id = 0;
	edge_id = 0;
}


GraphDataCalculator::~GraphDataCalculator()
{
	int32_t i = 0;
	//edges
	int32_t edge_length = tedges.size();
	for (i = 0; i < edge_length; i++)
	{
		if (tedges[i] != NULL)
		{
			delete tedges[i];
			tedges[i] = NULL;
		}
	}

	//nodes
	int32_t node_length = tnodes.size();
	for (i = 0; i < node_length; i++)
	{
		if (tnodes[i] != NULL)
		{
			delete tnodes[i];
			tnodes[i] = NULL;
		}
	}
}

void GraphDataCalculator::Calculate(const Input& tweets, Output& __outPut, bool buildTweets, int32_t nbTweets, EventManager* em, bool buildGraph)
{
	clock_t begin_c = clock();
	int32_t i = 0, j = 0, k = 0;
	int32_t length = tweets.size();
	Edges _outEdges;
	Nodes _outNodes;
	UserTweetCounts _outTopUsers;
	
	srand(static_cast<unsigned int>(time(NULL)));

	vector<int32_t> hashtag_nodeid;

	for (i = 0; i < length; i++)
	{
		vector<string> pt = tweets[i].hashtags;
		if (isAddFreeword)
		{
			string text = tweets[i]._text;
			for (j = 0; j < fwListLength; j++)
			{
				if (text.find(fwList[j]) != string::npos)
				{
					pt.push_back(fwList[j]);
				}
			}
			
		}
		int32_t length_hashtag = pt.size();

		// For Top users
		string screen_name = tweets[i].user.screen_name;
		if ((it_user = userHashTable.find(screen_name)) == userHashTable.end()) 
		{
			tusers.push_back(make_pair<string, int>(static_cast<string>(screen_name), 1));
			userHashTable.insert(make_pair<string, int>(static_cast<string>(screen_name), tusers.size()));
		}
		else
		{
			++tusers[it_user->second].second;
		}
		
		hashtag_nodeid.clear();
		//For node
		for (j = 0; j < length_hashtag; j++)
		{
			const string &pts = pt[j];
			if ((it_node = nodeHashTable.find(pts)) == nodeHashTable.end())
			{
				Node *new_node = new Node();
				new_node->__set_id(node_id);
				new_node->__set_label(pts);
				new_node->__set_size(1);
				new_node->__set_weight(1);
				new_node->__set_x(sin(rand()) *((i + 1) % 45));
				new_node->__set_y(cos(rand())*((i + 1) % 45));
				
				hashtag_nodeid.push_back(node_id);
				nodeHashTable.insert(make_pair<const string, Node*>(static_cast<string>(pts), static_cast<Node*>(new_node)));
				tnodes.push_back(new_node);
				++node_id;
			}
			else
			{
				++it_node->second->size;
				++it_node->second->weight;
				hashtag_nodeid.push_back(it_node->second->id);
			}
		}

		//For edge
		for (j = 0; j < length_hashtag; j++)
		{
			for (k = j + 1; k < length_hashtag; k++)
			{
				edgeDirect temp1;
				temp1.source = hashtag_nodeid[j];
				temp1.target = hashtag_nodeid[k];
				if (temp1.source != temp1.target)
				{
					if ((it_edge = edgeHashTable.find(temp1)) == edgeHashTable.end())
					{
						vector<string> tidlist;
						tidlist.push_back(tweets[i].id);
						Edge *new_edge = new Edge();
						new_edge->__set_id(edge_id);
						new_edge->__set_tweets(tidlist);
						new_edge->__set_source(hashtag_nodeid[j]);
						new_edge->__set_target(hashtag_nodeid[k]);
						new_edge->__set_size(1);
						new_edge->__set_weight(1);
						new_edge->__set_label("");

						//Add event
						if (em != NULL)
						{
							em->addEvent(edge_id, pt[j], pt[k], tweets[i].created_at, tweets[i].id);
						}

						edgeHashTable.insert(make_pair<edgeDirect, Edge*>(static_cast<edgeDirect>(temp1), static_cast<Edge*>(new_edge)));
						tedges.push_back(new_edge);
						++edge_id;
					}
					else
					{
						it_edge->second->tweets.push_back(tweets[i].id);
						++it_edge->second->size;
						++it_edge->second->weight;

						//Add tweets in event
						if (em != NULL)
						{
							em->addTweetsInEvent(it_edge->second->id, tweets[i].id);
						}
					}
				}
			}
		}
	}

	GraphMetadata _outGraphMetadata;
	int32_t node_length = tnodes.size();
	int32_t edge_length = tedges.size();
	if (buildTweets)
	{
		_tlist.insert(_tlist.end(), tweets.begin(), tweets.end());
		_outGraphMetadata.__set_numberOfTweets(_tlist.size());
	}
	else
		_outGraphMetadata.__set_numberOfTweets(nbTweets);
	_outGraphMetadata.__set_numberOfNodes(node_length);
	_outGraphMetadata.__set_numberOfEdges(edge_length);

	if (buildGraph)
	{
		//Sort users
		sort(tusers.begin(), tusers.end(), GraphDataCalculator::compareByValue);

		//Construct TopUsers (Only top 5)
		int32_t user_length = tusers.size();
		int32_t get_user_count = user_length < 5 ? user_length : 5;
		for (i = 0; i < get_user_count; i++)
		{
			UserTweetCount temp_user_tweet_count;
			temp_user_tweet_count.__set_username(tusers[i].first);
			temp_user_tweet_count.__set_tweetCount(tusers[i].second);
			_outTopUsers.push_back(temp_user_tweet_count);
		}

		//Sort nodes
		sort(tnodes.begin(), tnodes.end(), compareNodes);

		//Construct nodes
		for (i = 0; i < node_length; i++)
		{
			_outNodes.push_back(*tnodes[i]);
		}

		//Construct edges
		for (i = 0; i < edge_length; i++)
		{
			tedges[i]->label = to_string(tedges[i]->weight);
			_outEdges.push_back(*tedges[i]);
		}

		GraphData _outGraphData;
		_outGraphData.__set_edges(_outEdges);
		_outGraphData.__set_nodes(_outNodes);

		Output _outPut;
		_outPut.__set_graphData(_outGraphData);
		_outPut.__set_tweets(_tlist);
		_outPut.__set_graphMetadata(_outGraphMetadata);
		_outPut.__set_topUsers(_outTopUsers);
		_outGraphMetadata.printTo(cout);

		__outPut = _outPut;
	}
	else
	{
		_outGraphMetadata.printTo(cout);
		cout << endl << "Don't return the graph.";
	}

	clock_t end_c = clock();

	double sum_time = (end_c - begin_c) / double(CLOCKS_PER_SEC);
	cout << endl;
	cout << "Time used: " << sum_time << " s" << endl;
}

void GraphDataCalculator::GetGraphData(Output& _outGraph, int32_t nbTweets)
{
	Edges _outEdges;
	Nodes _outNodes;
	int32_t i;

	//Sort nodes
	sort(tnodes.begin(), tnodes.end(), compareNodes);

	//Construct nodes
	int32_t node_length = tnodes.size();
	for (i = 0; i < node_length; i++)
	{
		_outNodes.push_back(*tnodes[i]);
	}

	//Construct edges
	int32_t edge_length = tedges.size();
	for (i = 0; i < edge_length; i++)
	{
		tedges[i]->label = to_string(tedges[i]->weight);
		_outEdges.push_back(*tedges[i]);
	}

	GraphData _outGraphData;
	_outGraphData.__set_edges(_outEdges);
	_outGraphData.__set_nodes(_outNodes);

	GraphMetadata _outGraphMetadata;
	if (nbTweets == 0)
		_outGraphMetadata.__set_numberOfTweets(_tlist.size());
	else
		_outGraphMetadata.__set_numberOfTweets(nbTweets);
	_outGraphMetadata.__set_numberOfNodes(node_length);
	_outGraphMetadata.__set_numberOfEdges(edge_length);

	Output _outPut;
	_outPut.__set_graphData(_outGraphData);
	_outPut.__set_tweets(_tlist);
	_outPut.__set_graphMetadata(_outGraphMetadata);
	_outGraphMetadata.printTo(cout);

	_outGraph = _outPut;
}

void GraphDataCalculator::LoadOldData(const IOutput& _oldData)
{
	const Output &_oldOutput = _oldData.oldOutput;

	//Copy metadata
	node_id = _oldOutput.graphMetadata.numberOfNodes;
	edge_id = _oldOutput.graphMetadata.numberOfEdges;

	//Add tweets in to the _tlist
	_tlist.insert(_tlist.end(), _oldOutput.tweets.begin(), _oldOutput.tweets.end());

	//Add node in to the nodes
	int32_t i = 0;
	for (i = 0; i < node_id; i++)
	{
		Node *temp_node = new Node(_oldOutput.graphData.nodes[i]);
		nodeHashTable.insert(
			make_pair<const string, Node*>(
				static_cast<string>(_oldOutput.graphData.nodes[i].label),
				static_cast<Node*>(temp_node)
				)
		);
		tnodes.push_back(temp_node);
	}

	//Add edge in to the nodes
	for (i = 0; i < edge_id; i++)
	{
		Edge *temp_edge = new Edge(_oldOutput.graphData.edges[i]);
		edgeDirect temp_ed;

		temp_ed.source = temp_edge->source;
		temp_ed.target = temp_edge->target;

		edgeHashTable.insert(
			make_pair<edgeDirect, Edge*>(
				static_cast<edgeDirect>(temp_ed),
				static_cast<Edge*>(temp_edge)
				)
		);
		tedges.push_back(temp_edge);
	}
}
