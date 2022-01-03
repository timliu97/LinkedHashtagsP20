import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {buildParams, parseCustomParams} from "../lib/helpers";
import Twit from 'twit';
var thrift = require('../../thrift/thriftClient');
var spawn = require('await-spawn');

export const HistoryJobs = new Mongo.Collection('historyJobs');
export const HistoryGraphs = new Mongo.Collection('historyGraphs');
export const FullTweets = new Mongo.Collection('fullTweets');

if (Meteor.isServer) {
  Meteor.publish('historyJobs', function Publication() {
    let user_id = this.userId;
    let dbQuery = {};
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      dbQuery = {
        "userid": user_id
      };
    }
    return HistoryJobs.find(dbQuery);
  });
}

Meteor.methods({
  'tweets.deleteHistory' (id) {
    HistoryJobs.remove(id);
    HistoryGraphs.remove(id);
    console.log(id + ' history has been deleted.');
  },
  'tweets.getHistory' (id) {
    console.log('Get history id: ' + id);
    return HistoryGraphs.findOne(id);
  },
  async 'tweets.getFullTweets' (id) {
    if(Meteor.isServer) {
      const unique_id = Random.id();
      const temp_collection = 'temp_download_' + unique_id;
      const tid = HistoryGraphs.findOne({
        '_id': id
      }, {
        'fields': {
          'data.tweets.id': 1
        }
      });
      const testTweet = FullTweets.findOne({
        '_id': tid.data.tweets[0].id
      }, {
        'fields': {
          '_id': 1
        }
      });
      if (testTweet === undefined) {
        await HistoryGraphs.rawCollection().aggregate([
          {
            $match: {
              "_id": id
            }
          }, {
            $project: {
              "data.tweets": 1
            }
          }, {
            $out: temp_collection
          }
        ], {allowDiskUse: true}).toArray();
      } else {
        await HistoryGraphs.rawCollection().aggregate([
          {
            $match: {
              "_id": id
            }
          }, {
            $project: {
              "data.tweets.id": 1,
              "_id": 0
            }
          }, {
            $unwind: "$data.tweets"
          }, {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: ["$data.tweets"]
              }
            }
          }, {
            $lookup: {
              from: "fullTweets",
              localField: "id",
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
      HistoryGraphs.rawDatabase().collection(temp_collection).drop();
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
  'tweets.fetchHistory' (query, searchParams) {

    let _errorMessage = "";
    let isError = false;

    const twitterApiKeys = Meteor.settings["twitter_api"];
    const maxCount = Meteor.settings["public"]["search"]["count_limit"];

    const user = Meteor.user();
    if (!user) 
      return {query: query, params: {}, error: true, errorMessage: 'You must log in.', data: null};
    const prof = user
      ? user.profile
      : {};
    const twit_settings = {
      consumer_key: (prof.consumer_key && prof.consumer_key != '')
        ? prof.consumer_key
        : twitterApiKeys.consumer_key,
      consumer_secret: (prof.consumer_secret && prof.consumer_secret != '')
        ? prof.consumer_secret
        : twitterApiKeys.consumer_secret,
      access_token: (prof.access_token && prof.access_token != '')
        ? prof.access_token
        : twitterApiKeys.access_token,
      access_token_secret: (prof.access_token_secret && prof.access_token_secret != '')
        ? prof.access_token_secret
        : twitterApiKeys.access_token_secret,
      timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    }
    let T = new Twit(twit_settings);

    const getTweets = Meteor.wrapAsync(T.get, T);

    // params from https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets#parameters
    const paramsMapping = {
      location: 'geocode',
      language: 'lang',
      locale: 'locale',
      resultType: 'result_type',
      count: 'count',
      until: 'until',
      since_id: 'since_id',
      max_id: 'max_id',
      include_entities: 'include_entities'
    };

    let mappedParams = buildParams(searchParams, paramsMapping);
    mappedParams['tweet_mode'] = 'extended';

    console.log(mappedParams);

    let maxTweets = 100; // default if no count param
    let tweetsPerQry = 100; // this is the max the API permits
    let userRoles = false;
    if (user) {
      userRoles = user.roles;
    }
    if (!userRoles || userRoles == ['guest']) {
      maxTweets = mappedParams['count'] < maxCount
        ? mappedParams['count']
        : maxCount; // max tweets 2000
    } else {
      maxTweets = mappedParams['count'];
    }

    // If results from a specific ID onwards are read, set since_id to that ID.
    // else default to no lower limit, go as far back as API allows
    let sinceId = mappedParams['since_id']
      ? mappedParams['since_id']
      : null;

    // If results only below a specific ID are, set max_id to that ID.
    // else default to no upper limit, start from the most recent tweet matching the search query.
    let max_id = mappedParams['max_id']
      ? mappedParams['max_id']
      : null;
    const result_type = mappedParams['result_type']
      ? mappedParams['result_type']
      : 'mixed';
    let tweetCount = 0;

    let responseList = [];
    console.log("Downloading max", maxTweets, "tweets");
    // Find all the freewords
    const qBackup = query;
    query = query.toLowerCase();
    let fwList = [];
    freewordList = {
      hasFreewordList: false
    };
    if (query.search(/\|/) != -1) {
      const hf = query.split('|');
      query = hf[0];
      fwList = hf[1].replace(/ /g, '').split(',');
      freewordList.hasFreewordList = true;
      freewordList.ListFreeword = fwList;
    }

    let ts = [];
    const query_tl = query.replace(/#/g, '');
    const query_array_t = query_tl.split(/[ ,]/);
    const query_array_len = query_array_t.length;
    let query_array = [];
    for (i = 0; i < query_array_len; i++) {
      if (query_array_t[i] != 'or' && query_array_t[i] != '-rt' && query_array_t[i][0] != '-') {
        query_array.push(query_array_t[i]);
      }
    }

    while (tweetCount < maxTweets) {
      const tweetCountDiff = maxTweets - tweetCount;
      tweetsPerQry = tweetCountDiff < 100
        ? tweetCountDiff
        : 100; // How many tweets to search per query (max 100)
      console.log('tweetsPerQry', tweetsPerQry);

      let new_tweets = null;
      try {
        if (!max_id) {
          if (!sinceId) {
            new_tweets = getTweets('search/tweets', {
              q: query,
              ...mappedParams,
              count: tweetsPerQry
            });
          } else {
            new_tweets = getTweets('search/tweets', {
              q: query,
              ...mappedParams,
              count: tweetsPerQry,
              since_id: sinceId
            });
          }
        } else {
          if (!sinceId) {
            new_tweets = getTweets('search/tweets', {
              q: query,
              ...mappedParams,
              count: tweetsPerQry,
              max_id: max_id
            });
          } else {
            new_tweets = getTweets('search/tweets', {
              q: query,
              ...mappedParams,
              count: tweetsPerQry,
              max_id: max_id,
              since_id: sinceId
            });
          }
        }
        if (!new_tweets) {
          console.log("No more tweets found!");
          break;
        }

        let statuses = new_tweets["statuses"];

        const length_sts = statuses.length;
        for (i = 0; i < length_sts; i++) {
          const status = statuses[i];

          // Store the original tweet into database
          FullTweets.upsert({
            "_id": status['id_str']
          }, status);

          let hashtags = []

          const org_hashtags = status["entities"]["hashtags"];
          org_hashtags.forEach(function(h) {
            const has = h.text.toLowerCase();
            if (hashtags.indexOf(has) == -1) {
              hashtags.push(has);
            }
          });

          const length = hashtags.length;
          for (j = 0; j < length; j++) {
            if (query_array.indexOf(hashtags[j]) > -1) {
              break;
            }
          }
          if (j == length) {
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
          tweetCount += 1;
        }

        const statusesLength = new_tweets.statuses.length;
        //tweetCount += statusesLength;
        if (statusesLength > 0) {
          const last_tid_str = new_tweets.statuses[statusesLength - 1].id_str;
          const l_tid_len = last_tid_str.length;
          let count_d = l_tid_len - 1;
          let now_d = last_tid_str.substring(count_d);

          while (count_d > 0 && (now_d == '0' || (count_d != l_tid_len - 1 && now_d == 1))) {
            --count_d;
            now_d = last_tid_str.substring(count_d, count_d + 1);
          }
          max_id = last_tid_str.substring(0, count_d) + (Number(last_tid_str.substring(count_d, l_tid_len)) - 1).toString();
          //console.log(last_tid_str);
          //console.log(max_id);
        } else {
          if (tweetCount > 0) {
            // All of the tweets have been retrieved
            _errorMessage = 'No more tweets!'
            isError = true;
            break;
          } else {
            // No result found!
            _errorMessage = 'No result found!'
            isError = true;
            break;
          }
        }
        console.log("Downloaded", tweetCount, "tweets for", qBackup);
      } catch (e) {
        // wait if any error
        console.log("Some error : " + e);
        console.log("Downloaded", tweetCount, "tweets");
        _errorMessage = e;
        isError = true;
        break;
      }
    }

    oldOutput = {
      hasOldGraph: false
    };

    const tData = thrift.thriftGenerateGraphData(ts, oldOutput, freewordList);

    const res = {
      query: qBackup,
      params: mappedParams,
      fwList: fwList,
      error: isError,
      errorMessage: _errorMessage,
      data: tData, // responses of all queries
    };
    const thisuser = Meteor.user().profile;
    const username = thisuser.firstname + ' ' + thisuser.lastname;
    const historyJob = {
      userid: Meteor.user()._id,
      username: username,
      created: new Date(),
      freewords: fwList,
      query: qBackup,
      count: mappedParams.count,
      params: mappedParams,
      fwList: fwList
    }
    HistoryJobs.insert(historyJob, function(err, id) {
      if (!err) {
        res._id = id;
        HistoryGraphs.insert(res);
      }
    });
    return res;
  }
});
