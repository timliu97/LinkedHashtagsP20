#pragma once
#include "LinkedHashtagsService.h"
#include "EventManager.h"

#include <iostream>
#include <unordered_map>
#include <math.h>
#include <algorithm>
#include <time.h>
using namespace ::thriftService;
using namespace std;

struct edgeDirect
{
	int32_t source;
	int32_t target;
};
namespace std
{
	template<> struct hash<edgeDirect>
	{
		size_t operator()(const edgeDirect& value) const
		{
			const size_t h1(hash<int32_t>{}(value.source));
			const size_t h2(hash<int32_t>{}(value.target));
			return h1 ^ h2;
		}
	};

	inline bool operator==(const edgeDirect _x, const edgeDirect _y)
	{
		return ((_x.source == _y.source) && (_x.target == _y.target) || 
			(_x.source == _y.target) && (_x.target == _y.source));
	}
};

class GraphDataCalculator
{
private:
	vector<Node*> tnodes;
	vector<Edge*> tedges;
	vector<pair<string, int>> tusers;
	unordered_map<const string, Node*, hash<string>> nodeHashTable;
	unordered_map<edgeDirect, Edge*, hash<edgeDirect>> edgeHashTable;
	unordered_map<string, int, hash<string>> userHashTable;
	unordered_map<string, int, hash<string>>::iterator it_user;
	unordered_map<const string, Node*, hash<string>>::iterator it_node;
	unordered_map<edgeDirect, Edge*, hash<edgeDirect>>::iterator it_edge;
	int32_t node_id = 0;
	int32_t edge_id = 0;
	TweetList _tlist;
	bool isAddFreeword;
	vector<string> fwList;
	int32_t fwListLength;
public:
	GraphDataCalculator(const FreewordList& freewordList);
	~GraphDataCalculator();
	void Calculate(const Input& tweets, Output& _outPut, bool buildTweets = true, int32_t nbTweets = 0, EventManager* em = nullptr, bool buildGraph = true);
	void LoadOldData(const IOutput& _oldData);
	static inline bool compareNodes(Node *i, Node *j);
	static bool compareByValue(pair<string, int>& lhs, pair<string, int>& rhs);
	void GetGraphData(Output& _outGraph, int32_t nbTweets);
};

