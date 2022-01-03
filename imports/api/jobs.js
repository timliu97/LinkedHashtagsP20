///////////////////
// Server
import {Meteor} from "meteor/meteor";
import Twit from "twit";
import {buildParams} from "../lib/helpers";
var thrift = require('../../thrift/thriftClient');

export const myJobs = new JobCollection('jobQueue');

if (Meteor.isServer) {
  intervalManager = {};

  myJobs.allow({
    // Grant full permission to any authenticated user
    admin: function(userId, method, params) {
      return (!!userId);
    }
  });

  Meteor.startup(function() {
    // Normal Meteor publish call, the server always
    // controls what each client can see
    Meteor.publish('allJobs', function() {
      let user = Meteor.user();
      let userRoles = [];
      if (user) {
        userRoles = user.roles;
      }
      let dbQuery = {};
      if (!userRoles || userRoles.indexOf('superuser') == -1) {
        dbQuery = {
          'data.user_id': user
            ? user._id
            : false
        };
      }
      return myJobs.find(dbQuery, {
        fields: {
          'data.user_prof': 0,
          'data.user_id': 0
        }
      });
    });

    // Start the myJobs queue running
    return myJobs.startJobServer();
  });

  myJobs.processJobs('streamTweets', function(job, cb) {
    const jobId = job._doc._id;
    const jobData = job.data;
    const track = jobData.track;
    console.log('Starting streamTweets', jobId, jobData);
    // This will only be called if a
    // 'streamTweets' job is obtained

    // load settings from settings.json
    const twitterApiKeys = Meteor.settings["twitter_api"];
    const maxCount = Meteor.settings["public"]["stream"]["count_limit"];
    const insertEvery = Meteor.settings["public"]["stream"]["save_every"];
    const prof = jobData.user_prof;

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

    // params from https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets#parameters
    const paramsMapping = {
      track: 'track',
      location: 'geocode',
      language: 'lang',
      delimited: 'delimited',
      stall_warnings: 'stall_warnings'
    };

    let maxTweets = 100;

    if (job.data.isGuset) {
      maxTweets = job.data.count < maxCount
        ? job.data.count
        : maxCount;
    } else {
      maxTweets = job.data.count;
    }
    const mappedParams = buildParams(job.data, paramsMapping);
    mappedParams['tweet_mode'] = 'extended';
    var stream = null;
    if (track) {
      stream = T.stream('statuses/filter', mappedParams);
    } else {
      stream = T.stream('statuses/sample', {tweet_mode: 'extended'});
    }

    const streamOn = Meteor.wrapAsync(stream.on, stream);

    let query_array = [];
    if (track) {
      query_tl = track.toLowerCase().replace(/#/g, '')
      query_array = query_tl.split(/[ ,]/)
    }

    try {
      let count = 0;
      let countInsert = 0;
      let tweets = {
        statuses: []
      };
      const refreshGraph = Meteor.setInterval(function() {
        let tweetsAdd = {
          statuses: []
        };
        let tweetAddedCount = 0;
        console.log('count', count);
        tweetAddedCount = countInsert;
        if (tweetAddedCount > 0) {
          // save to graph database
          for (jj = 0; jj < tweetAddedCount; jj++) {
            tweetsAdd.statuses.push({
              ...tweets.statuses.shift()
            });
          }
          countInsert -= tweetAddedCount;
          const response = Meteor.call('graphs.insert', tweetsAdd, jobData, jobId, query_array);
          console.log('Tweets inserted:', tweetAddedCount, response);
        } else {
          // no tweet to save
          console.log('No new tweet from stream!');
        }
      }, 10000); // every X milliseconds

      intervalManager[jobId] = refreshGraph;

      streamOn('tweet', function(tweet) {
        count++;
        countInsert++;
        tweets.statuses.push(tweet); // +1
        if (count >= maxTweets) { // if count has reached limit
          stream.stop();
          Meteor.setTimeout(function() {
            Meteor.clearInterval(refreshGraph);
            job.done();
            thrift.thriftStreamDone(jobId);
            console.log("Job done!");
          }, 12000);
        }
      });
    } catch (error) {
      Meteor.clearInterval(refreshGraph);
      stream.stop();
      job.log("Streaming failed with error" + error, {level: 'warning'});
      job.fail("" + error);
    } finally {
      cb();
    }
  });

  Meteor.methods({
    'jobs.create' (type, data) {
      console.log('Creating new job');
      const user = Meteor.user();
      const prof = user
        ? user.profile
        : {};
      const isGuset = (!user.roles || user.roles == ['guest'])
      data.isGuset = isGuset;
      data.username = prof.lastname + ' ' + prof.firstname;

      let query = data.track;
      let fwList = [];
      freewordList = {
        hasFreewordList: false
      };
      if (query) {
        query = query.toLowerCase();
        if (query.search(/\|/) != -1) {
          const hf = query.split('|');
          query = hf[0];
          fwList = hf[1].split(',');
          freewordList.hasFreewordList = true;
          freewordList.ListFreeword = fwList;
        }
      }
      data.track = query;
      data.freewordList = fwList;
      data.user_prof = prof;
      data.user_id = user
        ? user._id
        : '';

      let job = new Job(myJobs, type, data);
      // Set some properties of the job and then submit it
      job.priority('normal').retry({
        retries: 0,
        wait: 15 * 60 * 1000
      }). // 15 minutes between attempts
      delay(5 * 1000). // Wait 5s before first try
      save(); // Commit it to the server

      thrift.thriftCreatStream(job._doc._id, freewordList);
      return job._doc._id; // return id
    },
    'jobs.control' (_id, action) {
      // Or a job can be fetched from the server by _id
      myJobs.getJob(_id, function(err, job) {
        if (err) 
          throw err;
        
        // If successful, job is a Job object corresponding to _id
        // With a job object, you can remotely control the
        // job's status (subject to server allow/deny rules)
        switch (action) {
          case 'pause':
            if (intervalManager[_id]) {
              Meteor.clearInterval(intervalManager[_id]);
              delete intervalManager._id;
            }
            thrift.thriftStreamDone(_id);
            job.pause();
            break;
          case 'cancel':
            if (intervalManager[_id]) {
              Meteor.clearInterval(intervalManager[_id]);
              delete intervalManager._id;
            }
            thrift.thriftStreamDone(_id);
            job.cancel();
            break;
          case 'resume':
            job.resume();
            break;
          case 'restart':
            job.restart();
            break;
          case 'rerun':
            job.rerun();
            break;
          case 'remove':
            if (intervalManager[_id]) {
              Meteor.clearInterval(intervalManager[_id]);
              delete intervalManager._id;
            }
            thrift.thriftStreamDone(_id);
            const result = Meteor.call('graphs.remove', job._doc._id);
            if (!result) {
              console.log('No graph related was found, deleted job only.')
            }
            job.remove();
            break;
        }
        return job;
      });
    }
  });
}
