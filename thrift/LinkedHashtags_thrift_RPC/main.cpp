/*
Debug build:
g++ -g -o ./bin/x64/Debug/LinkedHashtags_thrift_RPC.out -I/usr/local/include/thrift -I/usr/include/boost  -I/usr/local/include/mongocxx/v_noabi  -I/usr/local/include/bsoncxx/v_noabi  -L/usr/local/lib  -L/usr/local/lib  main.cpp ./service_types.cpp ./service_constants.cpp ./LinkedHashtagsService.cpp ./GraphDataCalculator.cpp ./StreamManager.cpp ./EventManager.cpp -lthrift -lthriftnb -lthriftz -lmongocxx -lbsoncxx -Wl,-rpath /usr/local/lib
Release build:
g++ -o ./bin/x64/Release/LinkedHashtags_thrift_RPC.out -I/usr/local/include/thrift -I/usr/include/boost  -I/usr/local/include/mongocxx/v_noabi  -I/usr/local/include/bsoncxx/v_noabi  -L/usr/local/lib  -L/usr/local/lib  main.cpp ./service_types.cpp ./service_constants.cpp ./LinkedHashtagsService.cpp ./GraphDataCalculator.cpp ./StreamManager.cpp ./EventManager.cpp -lthrift -lthriftnb -lthriftz -lmongocxx -lbsoncxx -Wl,-rpath /usr/local/lib
*/
//For server

#include <thrift/concurrency/ThreadManager.h>
#include <thrift/concurrency/PlatformThreadFactory.h>
#include <thrift/protocol/TBinaryProtocol.h>
#include <thrift/server/TSimpleServer.h>
#include <thrift/server/TThreadPoolServer.h>
#include <thrift/server/TThreadedServer.h>
#include <thrift/transport/TServerSocket.h>
#include <thrift/transport/TSocket.h>
#include <thrift/transport/TTransportUtils.h>
#include <thrift/TToString.h>
#include <thrift/stdcxx.h>

#include <mongocxx/instance.hpp>
#include <mongocxx/client.hpp>

#include <iostream>
#include <stdexcept>
#include <sstream>

#include "LinkedHashtagsService.h"
#include "GraphDataCalculator.h"
#include "StreamManager.h"

using namespace std;
using namespace apache::thrift;
using namespace apache::thrift::concurrency;
using namespace apache::thrift::protocol;
using namespace apache::thrift::transport;
using namespace apache::thrift::server;

using namespace ::thriftService;
map<string, StreamManager*> streamManagers;

class LinkedHashtagsServiceHandler : virtual public LinkedHashtagsServiceIf {
public:
	LinkedHashtagsServiceHandler() {
		// Your initialization goes here
	}

	void thriftGenerateGraphData(Output& _return, const Input& tweetList, const IOutput& oldGraph, const FreewordList& freewordList) {
		// Your implementation goes here
		printf("Call GenerateGraphData\n");
		GraphDataCalculator *calculator;
		calculator = new GraphDataCalculator(freewordList);
		if (calculator != NULL)
		{
			if (oldGraph.hasOldGraph)
			{
				calculator->LoadOldData(oldGraph);
			}
			calculator->Calculate(tweetList, _return);
			delete calculator;
			calculator = NULL;
		}
		else
			_return = Output();
	}

	bool thriftCreatStream(const std::string& id, const FreewordList& freewordList) {
		// Your implementation goes here
		printf("Call CreatStream\n");
		cout << "Created steam id: " << id << endl;
		if (streamManagers.find(id) != streamManagers.end()) return false;
		std::pair<map<string, StreamManager*>::iterator, bool> res;
		StreamManager* ptr = new StreamManager(id, freewordList);
		pair<string, StreamManager*> p = pair<string, StreamManager*>(id, ptr);
		res = streamManagers.insert(p);
		return res.second;
	}

	bool thriftAddNewTweets(const std::string& id, const Input& tweetList) {
		// Your implementation goes here
		cout << "Steam id: " << id << " ,";
		printf("Call AddNewTweets\n");
		if (streamManagers.find(id) == streamManagers.end()) return false;
		bool res = streamManagers[id]->addTweets(tweetList);
		return res;
	}

	bool thriftStreamDone(const std::string& id) {
		// Your implementation goes here
		printf("Call StreamDone\n");
		if (streamManagers.find(id) == streamManagers.end()) return false;
		delete streamManagers[id];
		streamManagers.erase(id);
		cout << "Deleted steam id: " << id << endl;
	}

};

class LinkedHashtagsServiceCloneFactory : virtual public LinkedHashtagsServiceIfFactory {
public:
	virtual ~LinkedHashtagsServiceCloneFactory() {}
	virtual LinkedHashtagsServiceIf* getHandler(const ::apache::thrift::TConnectionInfo& connInfo)
	{
		stdcxx::shared_ptr<TSocket> sock = stdcxx::dynamic_pointer_cast<TSocket>(connInfo.transport);
		cout << "Incoming connection\n";
		cout << "\tSocketInfo: " << sock->getSocketInfo() << "\n";
		cout << "\tPeerHost: " << sock->getPeerHost() << "\n";
		cout << "\tPeerAddress: " << sock->getPeerAddress() << "\n";
		cout << "\tPeerPort: " << sock->getPeerPort() << "\n";
		return new LinkedHashtagsServiceHandler;
	}
	virtual void releaseHandler(LinkedHashtagsServiceIf* handler) {
		delete handler;
	}
};

int main() {
	const int workerCount = 10;

	mongocxx::instance inst{};

	stdcxx::shared_ptr<ThreadManager> threadManager =
		ThreadManager::newSimpleThreadManager(workerCount);
	threadManager->threadFactory(
		stdcxx::make_shared<PlatformThreadFactory>());
	threadManager->start();

	// This server allows "workerCount" connection at a time, and reuses threads
	TThreadPoolServer server(
		stdcxx::make_shared<LinkedHashtagsServiceProcessorFactory>(stdcxx::make_shared<LinkedHashtagsServiceCloneFactory>()),
		stdcxx::make_shared<TServerSocket>(9091),
		stdcxx::make_shared<TBufferedTransportFactory>(),
		stdcxx::make_shared<TBinaryProtocolFactory>(),
		threadManager);

	cout << "Starting the server..." << endl;
	server.serve();
	cout << "Done." << endl;
	return 0;
}