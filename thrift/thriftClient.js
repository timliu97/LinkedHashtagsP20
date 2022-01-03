//For thrift client
import {Meteor} from "meteor/meteor";

if (Meteor.isServer) {
  var thrift = require('thrift');
  var assert = require('assert');
  var linkedHashtagsService = require('./gen-nodejs/LinkedHashtagsService');
  var ttypes = require('./gen-nodejs/service_types');

  var transport = thrift.TBufferedTransport;
  var protocol = thrift.TBinaryProtocol;
  // Creat the connection and then reuse it
  var connection = thrift.createConnection("127.0.0.1", 9091, {
    transport: transport,
    protocol: protocol
  });

  connection.on('error', function(err) {
    assert(false, err);
  });
  exports.thriftGenerateGraphData = function(_listTweet, _oldGraph, _freewordList) {
    var client = thrift.createClient(linkedHashtagsService, connection);
    /*
    oldOutput={
      hasOldGraph:false
    };
    */
    const thriftClient = Meteor.wrapAsync(function(_listTweet, _oldGraph, _freewordList, callback) {
      return client.thriftGenerateGraphData(_listTweet, _oldGraph, _freewordList, callback);
    });
    const tData = thriftClient(_listTweet, _oldGraph, _freewordList);

    return tData;
  }

  exports.thriftCreatStream = function(id, _freewordList) {
    var client = thrift.createClient(linkedHashtagsService, connection);
    const thriftClient = Meteor.wrapAsync(function(id, _freewordList, callback) {
      return client.thriftCreatStream(id, _freewordList, callback);
    });

    thriftClient(id, _freewordList);
  }

  exports.thriftAddNewTweets = function(id, _listTweet) {
    var client = thrift.createClient(linkedHashtagsService, connection);
    const thriftClient = Meteor.wrapAsync(function(id, _listTweet, callback) {
      return client.thriftAddNewTweets(id, _listTweet, callback);
    });

    thriftClient(id, _listTweet);
  }

  exports.thriftStreamDone = function(id) {
    var client = thrift.createClient(linkedHashtagsService, connection);
    const thriftClient = Meteor.wrapAsync(function(id, callback) {
      return client.thriftStreamDone(id, callback);
    });

    thriftClient(id);
  }
};
