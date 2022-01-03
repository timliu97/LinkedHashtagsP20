#pragma once
#include <iostream>

#include <cerrno>
#include <chrono>
#include <cmath>
#include <cstdint>
#include <ctime>
#include <iomanip>
#include <sstream>
#include <stdexcept>
#include <string>

#include <bsoncxx/json.hpp>
#include <bsoncxx/builder/stream/array.hpp>
#include <bsoncxx/builder/stream/document.hpp>
#include <bsoncxx/builder/stream/helpers.hpp>
#include <bsoncxx/types.hpp>

#include <mongocxx/client.hpp>
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

class EventManager
{
private:
	mongocxx::client conn;
	string id;
public:
	EventManager(string id);
	~EventManager();
	void addEvent(const int32_t eid, const string& hashtag1, const string& hashtag2, const string& time, const string& tid);
	void addTweetsInEvent(const int32_t eid, const string& tid);
};

