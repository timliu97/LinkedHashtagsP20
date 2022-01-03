#include "EventManager.h"



EventManager::EventManager(string id)
{
	this->id = id;
	conn = mongocxx::client{ mongocxx::uri{ "mongodb://127.0.0.1:27017" } };
	//conn = mongocxx::client{ mongocxx::uri{ "mongodb://192.168.1.26:27017" } };
}


EventManager::~EventManager()
{
}

void EventManager::addEvent(const int32_t eid, const string & hashtag1, const string & hashtag2, const string & time, const string & tid)
{
	document event_obj_builder;
	auto event_obj = event_obj_builder
		<< "id" << id
		<< "seq" << eid
		<< "hashtag1" << hashtag1
		<< "hashtag2" << hashtag2
		<< "time" << time
		<< "tid"
		<< open_array
		<< tid
		<< close_array
		<< finalize;
	auto collection_events = conn["meteor"]["events"];
	collection_events.insert_one(event_obj.view());
}

void EventManager::addTweetsInEvent(const int32_t eid, const string & tid)
{
	auto collection_events = conn["meteor"]["events"];
	collection_events.update_one(
		document() << "id" << id << "seq" << eid << finalize,
		document() << "$push" << open_document << "tid" << tid << close_document << finalize
	);
}
