import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {generateGraphData} from "../lib/helpers";
import {FullTweets} from "./tweets"
var thrift = require('../../thrift/thriftClient');
var spawn = require('await-spawn');

export const Graphs = new Mongo.Collection('graphs');
export const Tweets = new Mongo.Collection('tweets');
export const Events = new Mongo.Collection('events');
export const GeoHeatmap = new Mongo.Collection('geo');
export const EventsStatus = new Mongo.Collection('eventsStatus');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish graphs that are public or belong to the current user
  Meteor.publish('graphs', function Publication(id) {
    return Graphs.find({"_id": id});
  });
  Meteor.publish('geoHeatmap', function Publication(id) {
    return GeoHeatmap.find({"gid": id});
  });
  Meteor.publish('events', function Publication(id, eventQuery, hashtagLists, fuzzyMatch) {
    const res = EventsStatus.findOne({"_id": id, "query": eventQuery});
    if (res) {
      EventsStatus.upsert({
        "_id": id
      }, {
        "$set": {
          "query": eventQuery,
          "hList": hashtagLists,
          "isFuzzy": fuzzyMatch
        }
      });
    } else {
      EventsStatus.upsert({
        "_id": id
      }, {
        "query": eventQuery,
        "hList": hashtagLists,
        "isFuzzy": fuzzyMatch
      });
    }

    const lenLists = hashtagLists.length;
    let i = 0;
    let j = 0;
    let addCons = [];
    for (i = 0; i < lenLists; i++) {

      if (fuzzyMatch) {
        let lenList = hashtagLists[i][0].length;
        for (j = 0; j < lenList; j++) {
          let regValue = '.*' + hashtagLists[i][0][j] + '.*';
          hashtagLists[i][0][j] = new RegExp(regValue, 'i');
        }
        lenList = hashtagLists[i][1].length;
        for (j = 0; j < lenList; j++) {
          let regValue = '.*' + hashtagLists[i][1][j] + '.*';
          hashtagLists[i][1][j] = new RegExp(regValue, 'i');
        }
      }

      if (hashtagLists[i][1].length == 0) {
        addCons.push({
          "$and": [
            {
              "hashtag1": {
                "$in": hashtagLists[i][0]
              }
            }, {
              "hashtag2": {
                "$nin": hashtagLists[i][0]
              }
            }
          ]
        });
      } else {
        addCons.push({
          "$and": [
            {
              "hashtag1": {
                "$in": hashtagLists[i][0]
              }
            }, {
              "hashtag1": {
                "$nin": hashtagLists[i][1]
              }
            }, {
              "hashtag2": {
                "$nin": hashtagLists[i][0]
              }
            }, {
              "hashtag2": {
                "$in": hashtagLists[i][1]
              }
            }
          ]
        });
        addCons.push({
          "$and": [
            {
              "hashtag1": {
                "$nin": hashtagLists[i][0]
              }
            }, {
              "hashtag1": {
                "$in": hashtagLists[i][1]
              }
            }, {
              "hashtag2": {
                "$in": hashtagLists[i][0]
              }
            }, {
              "hashtag2": {
                "$nin": hashtagLists[i][1]
              }
            }
          ]
        });
      }
    }
    let find_cons = {
      "$and": [
        {
          "id": id
        }, {
          "$or": addCons
        }
      ]
    };
    return Events.find(find_cons, {
      sort: {
        "seq": -1
      }
    });
  });
}

Meteor.methods({
  'graphs.checkTweet' (id, tweetChecked, tweetCheckedCount) {
    EventsStatus.update({
      "_id": id
    }, {
      "$set": {
        "tweetChecked": tweetChecked,
        "tweetCheckedCount": tweetCheckedCount
      }
    });
    return true;
  },
  'graphs.getEventStatus' (id) {
    return EventsStatus.findOne({"_id": id});
  },
  'graphs.gettweets' (tids) {
    const tids_len = tids.length;
    let res = [];
    for (i = 0; i < tids_len; i++) {
      let t = Tweets.findOne({'_id': tids[i]});
      res.push(t);
    }
    return res;
  },
  async 'graphs.getFullTweets' (gid) {
    if(Meteor.isServer) {
      const unique_id = Random.id();
      const temp_collection = 'temp_download_' + unique_id;
      const tid = Tweets.findOne({
        'gid': gid
      }, {
        'fields': {
          '_id': 1
        }
      });
      const testTweet = FullTweets.findOne({
        '_id': tid['_id']
      }, {
        'fields': {
          '_id': 1
        }
      });
      if (testTweet === undefined) {
        await Tweets.rawCollection().aggregate([
          {
            $match: {
              "gid": gid
            }
          }, {
            $out: temp_collection
          }
        ], {allowDiskUse: true}).toArray();
      } else {
        await Tweets.rawCollection().aggregate([
          {
            $match: {
              "gid": gid
            }
          }, {
            $project: {
              "_": 1
            }
          }, {
            $lookup: {
              from: "fullTweets",
              localField: "_id",
              foreignField: "_id",
              as: "tweet"
            }
          }, {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: ["$tweet"]
              }
            }
          }, {
            $out: temp_collection
          }
        ], {allowDiskUse: true}).toArray();
      }
      const exportJson = await spawn('mongoexport', [
        '--db',
        'meteor',
        '--collection',
        temp_collection,
        '--out',
        '/download/' + unique_id + '.json'
      ]);
      Tweets.rawDatabase().collection(temp_collection).drop();
      await spawn('tar', [
        '-czf', '/download/' + unique_id + '.tar',
        '/download/' + unique_id + '.json'
      ]);
      spawn('rm', [
        '-f', '/download/' + unique_id + '.json'
      ]);
      return unique_id;
    } else {
      return '';
    }
  },
  'graphs.fetch' () {
    return Graphs.find().fetch();
  },
  'graphs.insert' (dataList, streamData, id, query_array) {
    const track = streamData.track;
    console.log('id', id);
    responseList = [dataList];
    let ts = [];
    responseList.forEach(function(response) {
      let statuses = response["statuses"];
      statuses.forEach(function(status) {

        // Store the original tweet into database
        FullTweets.upsert({
          "_id": status['id_str']
        }, status);

        let hashtags = [];
        const org_hashtags = status["entities"]["hashtags"];
        org_hashtags.forEach(function(h) {
          const has = h.text.toLowerCase();
          if (hashtags.indexOf(has) == -1) {
            hashtags.push(has);
          }
        });
        const length = hashtags.length;
        for (i = 0; i < length; i++) {
          if (query_array.indexOf(hashtags[i]) > -1) {
            break;
          }
        }
        if (i == length) {
          const length_query_array = query_array.length;
          for (j = 0; j < length_query_array; j++) {
            hashtags.push(query_array[j]);
          }
        }

        const cod = status['coordinates'];
        const place = status['place'];

        let geoInfo = {
          hasGeoinfo: false
        };
        if (cod) {
          geoInfo = {
            hasGeoinfo: true,
            isPoint: true,
            x: cod.coordinates[0],
            y: cod.coordinates[1]
          };
        } else {
          if (place) {
            const points = place.bounding_box.coordinates[0];
            const xy1 = points[0];
            const xy3 = points[2];

            geoInfo = {
              hasGeoinfo: true,
              isPoint: false,
              x: (xy1[0] + xy3[0]) / 2,
              y: (xy1[1] + xy3[1]) / 2
            };
          }
        }

        let full_text_t = '';
        let tweet_get = status;
        if (status['retweeted_status']) {
          tweet_get = status['retweeted_status'];
          full_text_t = 'RT: ';
        }

        full_text_t += tweet_get['extended_tweet']
          ? tweet_get['extended_tweet']['full_text']
          : tweet_get['full_text']
            ? tweet_get['full_text']
            : tweet_get['text'];

        const tweet = {
          id: status['id_str'],
          created_at: status['created_at'],
          text: full_text_t,
          _text: full_text_t.toLowerCase(),
          user: {
            name: status['user']['name'],
            screen_name: status['user']['screen_name'],
            verified: status['user']['verified'],
            profile_image_url_https: status['user']['profile_image_url_https']
          },
          retweet_count: status['retweet_count'],
          favorite_count: status['favorite_count'],
          lang: status['lang'],
          hashtags: hashtags,
          geoInfo: geoInfo
        };
        ts.push(tweet);
      });
    });

    thrift.thriftAddNewTweets(id, ts);
    let newGraphData = {};
    newGraphData['streamData'] = streamData;
    return Graphs.upsert(id, {$set: newGraphData});
  },
  'graphs.remove' (id) {
    Tweets.remove({gid: id});
    Events.remove({id: id});
    GeoHeatmap.remove({gid: id});
    EventsStatus.remove({_id: id});
    return Graphs.remove(id);
  }
});
