//Thrift file for this project

namespace cpp thriftService

//For tweet

struct Cod
{
  1: required bool hasGeoinfo;
  2: optional bool isPoint;
  3: optional double x;
  4: optional double y;
}

struct User
{
  1: required string name;
  2: required string screen_name;
  3: required bool verified;
  4: required string profile_image_url_https;
}

struct Tweet
{
  1: required string id;
  2: required string created_at;
  3: required string text;
  4: required string _text;
  5: required User user;
  6: required i32 retweet_count;
  7: required i32 favorite_count;
  8: required string lang;
  9: required list<string> hashtags;
  10: required Cod geoInfo;
}

typedef list<Tweet> TweetList;

// For Dashboard

struct UserTweetCount
{
  1: required string username;
  2: required i32 tweetCount;
}

typedef list<UserTweetCount> UserTweetCounts

//For graph

struct Edge
{
  1: required i32 id;
  2: required list<string> tweets;
  3: required i32 source;
  4: required i32 target;
  5: required i32 size;
  6: required i32 weight;
  7: required string label;
}

struct Node
{
  1: required i32 id;
  2: required string label;
  3: required i32 size;
  4: required i32 weight;
  5: optional double x;
  6: optional double y;
}

typedef list<Edge> Edges;
typedef list<Node> Nodes;

struct GraphData
{
  1: required Edges edges;
  2: required Nodes nodes;
}

struct GraphMetadata
{
  1: required i32 numberOfTweets
  2: required i32 numberOfNodes
  3: required i32 numberOfEdges
}

//For input output
struct Output
{
  1: required GraphData graphData;
  2: required TweetList tweets;
  3: required GraphMetadata graphMetadata;
  4: required UserTweetCounts topUsers;
}

struct IOutput
{
  1: required bool hasOldGraph;
  2: optional Output oldOutput;
}

typedef TweetList Input;

//For freewords
struct FreewordList
{
  1: required bool hasFreewordList;
  2: optional list<string> ListFreeword;
}

//For service
service LinkedHashtagsService
{
  Output thriftGenerateGraphData(1:Input tweetList, 2:IOutput oldGraph, 3:FreewordList freewordList);
  bool thriftCreatStream(1:string id, 2:FreewordList freewordList);
  bool thriftAddNewTweets(1:string id, 2:Input tweetList);
  bool thriftStreamDone(1:string id)
}
