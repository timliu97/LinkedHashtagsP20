#pragma once
#include <iostream>

#include <bsoncxx/json.hpp>
#include <bsoncxx/builder/stream/array.hpp>
#include <bsoncxx/builder/stream/document.hpp>
#include <bsoncxx/builder/stream/helpers.hpp>
#include <bsoncxx/types.hpp>

#include <mongocxx/client.hpp>


#include "LinkedHashtagsService.h"
#include "GraphDataCalculator.h"
#include "EventManager.h"

using namespace ::thriftService;
using namespace std;

using bsoncxx::builder::stream::close_array;
using bsoncxx::builder::stream::close_document;
using bsoncxx::builder::stream::document;
using bsoncxx::builder::stream::finalize;
using bsoncxx::builder::stream::open_array;
using bsoncxx::builder::stream::open_document;
using bsoncxx::builder::stream::array;
using bsoncxx::builder::basic::kvp;
using bsoncxx::builder::concatenate;

class StreamManager
{
private:
	GraphDataCalculator *calculator;
	EventManager *eventManager;
	string id;
	mongocxx::client conn;
	int32_t countTweets;
	bool graphTooLarge;
public:
	StreamManager(string id, const FreewordList& freewordList);
	~StreamManager();
	bool addTweets(const Input& tweets);
	bool graphTransferToBson(const Output& graph, bool isFinallyWrite = false);
	void writeTweets(const Input & tweets);
};

