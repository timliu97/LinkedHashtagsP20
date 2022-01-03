//
// Autogenerated by Thrift Compiler (0.12.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
"use strict";

var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;


var ttypes = module.exports = {};
var Cod = module.exports.Cod = function(args) {
  this.hasGeoinfo = null;
  this.isPoint = null;
  this.x = null;
  this.y = null;
  if (args) {
    if (args.hasGeoinfo !== undefined && args.hasGeoinfo !== null) {
      this.hasGeoinfo = args.hasGeoinfo;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field hasGeoinfo is unset!');
    }
    if (args.isPoint !== undefined && args.isPoint !== null) {
      this.isPoint = args.isPoint;
    }
    if (args.x !== undefined && args.x !== null) {
      this.x = args.x;
    }
    if (args.y !== undefined && args.y !== null) {
      this.y = args.y;
    }
  }
};
Cod.prototype = {};
Cod.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.BOOL) {
        this.hasGeoinfo = input.readBool();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.BOOL) {
        this.isPoint = input.readBool();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.DOUBLE) {
        this.x = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.DOUBLE) {
        this.y = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Cod.prototype.write = function(output) {
  output.writeStructBegin('Cod');
  if (this.hasGeoinfo !== null && this.hasGeoinfo !== undefined) {
    output.writeFieldBegin('hasGeoinfo', Thrift.Type.BOOL, 1);
    output.writeBool(this.hasGeoinfo);
    output.writeFieldEnd();
  }
  if (this.isPoint !== null && this.isPoint !== undefined) {
    output.writeFieldBegin('isPoint', Thrift.Type.BOOL, 2);
    output.writeBool(this.isPoint);
    output.writeFieldEnd();
  }
  if (this.x !== null && this.x !== undefined) {
    output.writeFieldBegin('x', Thrift.Type.DOUBLE, 3);
    output.writeDouble(this.x);
    output.writeFieldEnd();
  }
  if (this.y !== null && this.y !== undefined) {
    output.writeFieldBegin('y', Thrift.Type.DOUBLE, 4);
    output.writeDouble(this.y);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var User = module.exports.User = function(args) {
  this.name = null;
  this.screen_name = null;
  this.verified = null;
  this.profile_image_url_https = null;
  if (args) {
    if (args.name !== undefined && args.name !== null) {
      this.name = args.name;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field name is unset!');
    }
    if (args.screen_name !== undefined && args.screen_name !== null) {
      this.screen_name = args.screen_name;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field screen_name is unset!');
    }
    if (args.verified !== undefined && args.verified !== null) {
      this.verified = args.verified;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field verified is unset!');
    }
    if (args.profile_image_url_https !== undefined && args.profile_image_url_https !== null) {
      this.profile_image_url_https = args.profile_image_url_https;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field profile_image_url_https is unset!');
    }
  }
};
User.prototype = {};
User.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.name = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.screen_name = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.BOOL) {
        this.verified = input.readBool();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.profile_image_url_https = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

User.prototype.write = function(output) {
  output.writeStructBegin('User');
  if (this.name !== null && this.name !== undefined) {
    output.writeFieldBegin('name', Thrift.Type.STRING, 1);
    output.writeString(this.name);
    output.writeFieldEnd();
  }
  if (this.screen_name !== null && this.screen_name !== undefined) {
    output.writeFieldBegin('screen_name', Thrift.Type.STRING, 2);
    output.writeString(this.screen_name);
    output.writeFieldEnd();
  }
  if (this.verified !== null && this.verified !== undefined) {
    output.writeFieldBegin('verified', Thrift.Type.BOOL, 3);
    output.writeBool(this.verified);
    output.writeFieldEnd();
  }
  if (this.profile_image_url_https !== null && this.profile_image_url_https !== undefined) {
    output.writeFieldBegin('profile_image_url_https', Thrift.Type.STRING, 4);
    output.writeString(this.profile_image_url_https);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var Tweet = module.exports.Tweet = function(args) {
  this.id = null;
  this.created_at = null;
  this.text = null;
  this._text = null;
  this.user = null;
  this.retweet_count = null;
  this.favorite_count = null;
  this.lang = null;
  this.hashtags = null;
  this.geoInfo = null;
  if (args) {
    if (args.id !== undefined && args.id !== null) {
      this.id = args.id;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field id is unset!');
    }
    if (args.created_at !== undefined && args.created_at !== null) {
      this.created_at = args.created_at;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field created_at is unset!');
    }
    if (args.text !== undefined && args.text !== null) {
      this.text = args.text;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field text is unset!');
    }
    if (args._text !== undefined && args._text !== null) {
      this._text = args._text;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field _text is unset!');
    }
    if (args.user !== undefined && args.user !== null) {
      this.user = new ttypes.User(args.user);
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field user is unset!');
    }
    if (args.retweet_count !== undefined && args.retweet_count !== null) {
      this.retweet_count = args.retweet_count;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field retweet_count is unset!');
    }
    if (args.favorite_count !== undefined && args.favorite_count !== null) {
      this.favorite_count = args.favorite_count;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field favorite_count is unset!');
    }
    if (args.lang !== undefined && args.lang !== null) {
      this.lang = args.lang;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field lang is unset!');
    }
    if (args.hashtags !== undefined && args.hashtags !== null) {
      this.hashtags = Thrift.copyList(args.hashtags, [null]);
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field hashtags is unset!');
    }
    if (args.geoInfo !== undefined && args.geoInfo !== null) {
      this.geoInfo = new ttypes.Cod(args.geoInfo);
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field geoInfo is unset!');
    }
  }
};
Tweet.prototype = {};
Tweet.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.id = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.created_at = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.text = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this._text = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.STRUCT) {
        this.user = new ttypes.User();
        this.user.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.I32) {
        this.retweet_count = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.I32) {
        this.favorite_count = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 8:
      if (ftype == Thrift.Type.STRING) {
        this.lang = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 9:
      if (ftype == Thrift.Type.LIST) {
        this.hashtags = [];
        var _rtmp31 = input.readListBegin();
        var _size0 = _rtmp31.size || 0;
        for (var _i2 = 0; _i2 < _size0; ++_i2) {
          var elem3 = null;
          elem3 = input.readString();
          this.hashtags.push(elem3);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 10:
      if (ftype == Thrift.Type.STRUCT) {
        this.geoInfo = new ttypes.Cod();
        this.geoInfo.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Tweet.prototype.write = function(output) {
  output.writeStructBegin('Tweet');
  if (this.id !== null && this.id !== undefined) {
    output.writeFieldBegin('id', Thrift.Type.STRING, 1);
    output.writeString(this.id);
    output.writeFieldEnd();
  }
  if (this.created_at !== null && this.created_at !== undefined) {
    output.writeFieldBegin('created_at', Thrift.Type.STRING, 2);
    output.writeString(this.created_at);
    output.writeFieldEnd();
  }
  if (this.text !== null && this.text !== undefined) {
    output.writeFieldBegin('text', Thrift.Type.STRING, 3);
    output.writeString(this.text);
    output.writeFieldEnd();
  }
  if (this._text !== null && this._text !== undefined) {
    output.writeFieldBegin('_text', Thrift.Type.STRING, 4);
    output.writeString(this._text);
    output.writeFieldEnd();
  }
  if (this.user !== null && this.user !== undefined) {
    output.writeFieldBegin('user', Thrift.Type.STRUCT, 5);
    this.user.write(output);
    output.writeFieldEnd();
  }
  if (this.retweet_count !== null && this.retweet_count !== undefined) {
    output.writeFieldBegin('retweet_count', Thrift.Type.I32, 6);
    output.writeI32(this.retweet_count);
    output.writeFieldEnd();
  }
  if (this.favorite_count !== null && this.favorite_count !== undefined) {
    output.writeFieldBegin('favorite_count', Thrift.Type.I32, 7);
    output.writeI32(this.favorite_count);
    output.writeFieldEnd();
  }
  if (this.lang !== null && this.lang !== undefined) {
    output.writeFieldBegin('lang', Thrift.Type.STRING, 8);
    output.writeString(this.lang);
    output.writeFieldEnd();
  }
  if (this.hashtags !== null && this.hashtags !== undefined) {
    output.writeFieldBegin('hashtags', Thrift.Type.LIST, 9);
    output.writeListBegin(Thrift.Type.STRING, this.hashtags.length);
    for (var iter4 in this.hashtags) {
      if (this.hashtags.hasOwnProperty(iter4)) {
        iter4 = this.hashtags[iter4];
        output.writeString(iter4);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.geoInfo !== null && this.geoInfo !== undefined) {
    output.writeFieldBegin('geoInfo', Thrift.Type.STRUCT, 10);
    this.geoInfo.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var UserTweetCount = module.exports.UserTweetCount = function(args) {
  this.username = null;
  this.tweetCount = null;
  if (args) {
    if (args.username !== undefined && args.username !== null) {
      this.username = args.username;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field username is unset!');
    }
    if (args.tweetCount !== undefined && args.tweetCount !== null) {
      this.tweetCount = args.tweetCount;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field tweetCount is unset!');
    }
  }
};
UserTweetCount.prototype = {};
UserTweetCount.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.username = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I32) {
        this.tweetCount = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

UserTweetCount.prototype.write = function(output) {
  output.writeStructBegin('UserTweetCount');
  if (this.username !== null && this.username !== undefined) {
    output.writeFieldBegin('username', Thrift.Type.STRING, 1);
    output.writeString(this.username);
    output.writeFieldEnd();
  }
  if (this.tweetCount !== null && this.tweetCount !== undefined) {
    output.writeFieldBegin('tweetCount', Thrift.Type.I32, 2);
    output.writeI32(this.tweetCount);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var Edge = module.exports.Edge = function(args) {
  this.id = null;
  this.tweets = null;
  this.source = null;
  this.target = null;
  this.size = null;
  this.weight = null;
  this.label = null;
  if (args) {
    if (args.id !== undefined && args.id !== null) {
      this.id = args.id;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field id is unset!');
    }
    if (args.tweets !== undefined && args.tweets !== null) {
      this.tweets = Thrift.copyList(args.tweets, [null]);
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field tweets is unset!');
    }
    if (args.source !== undefined && args.source !== null) {
      this.source = args.source;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field source is unset!');
    }
    if (args.target !== undefined && args.target !== null) {
      this.target = args.target;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field target is unset!');
    }
    if (args.size !== undefined && args.size !== null) {
      this.size = args.size;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field size is unset!');
    }
    if (args.weight !== undefined && args.weight !== null) {
      this.weight = args.weight;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field weight is unset!');
    }
    if (args.label !== undefined && args.label !== null) {
      this.label = args.label;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field label is unset!');
    }
  }
};
Edge.prototype = {};
Edge.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.I32) {
        this.id = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.LIST) {
        this.tweets = [];
        var _rtmp36 = input.readListBegin();
        var _size5 = _rtmp36.size || 0;
        for (var _i7 = 0; _i7 < _size5; ++_i7) {
          var elem8 = null;
          elem8 = input.readString();
          this.tweets.push(elem8);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.I32) {
        this.source = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.I32) {
        this.target = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.I32) {
        this.size = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.I32) {
        this.weight = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.STRING) {
        this.label = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Edge.prototype.write = function(output) {
  output.writeStructBegin('Edge');
  if (this.id !== null && this.id !== undefined) {
    output.writeFieldBegin('id', Thrift.Type.I32, 1);
    output.writeI32(this.id);
    output.writeFieldEnd();
  }
  if (this.tweets !== null && this.tweets !== undefined) {
    output.writeFieldBegin('tweets', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.STRING, this.tweets.length);
    for (var iter9 in this.tweets) {
      if (this.tweets.hasOwnProperty(iter9)) {
        iter9 = this.tweets[iter9];
        output.writeString(iter9);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.source !== null && this.source !== undefined) {
    output.writeFieldBegin('source', Thrift.Type.I32, 3);
    output.writeI32(this.source);
    output.writeFieldEnd();
  }
  if (this.target !== null && this.target !== undefined) {
    output.writeFieldBegin('target', Thrift.Type.I32, 4);
    output.writeI32(this.target);
    output.writeFieldEnd();
  }
  if (this.size !== null && this.size !== undefined) {
    output.writeFieldBegin('size', Thrift.Type.I32, 5);
    output.writeI32(this.size);
    output.writeFieldEnd();
  }
  if (this.weight !== null && this.weight !== undefined) {
    output.writeFieldBegin('weight', Thrift.Type.I32, 6);
    output.writeI32(this.weight);
    output.writeFieldEnd();
  }
  if (this.label !== null && this.label !== undefined) {
    output.writeFieldBegin('label', Thrift.Type.STRING, 7);
    output.writeString(this.label);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var Node = module.exports.Node = function(args) {
  this.id = null;
  this.label = null;
  this.size = null;
  this.weight = null;
  this.x = null;
  this.y = null;
  if (args) {
    if (args.id !== undefined && args.id !== null) {
      this.id = args.id;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field id is unset!');
    }
    if (args.label !== undefined && args.label !== null) {
      this.label = args.label;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field label is unset!');
    }
    if (args.size !== undefined && args.size !== null) {
      this.size = args.size;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field size is unset!');
    }
    if (args.weight !== undefined && args.weight !== null) {
      this.weight = args.weight;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field weight is unset!');
    }
    if (args.x !== undefined && args.x !== null) {
      this.x = args.x;
    }
    if (args.y !== undefined && args.y !== null) {
      this.y = args.y;
    }
  }
};
Node.prototype = {};
Node.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.I32) {
        this.id = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.label = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.I32) {
        this.size = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.I32) {
        this.weight = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.DOUBLE) {
        this.x = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.DOUBLE) {
        this.y = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Node.prototype.write = function(output) {
  output.writeStructBegin('Node');
  if (this.id !== null && this.id !== undefined) {
    output.writeFieldBegin('id', Thrift.Type.I32, 1);
    output.writeI32(this.id);
    output.writeFieldEnd();
  }
  if (this.label !== null && this.label !== undefined) {
    output.writeFieldBegin('label', Thrift.Type.STRING, 2);
    output.writeString(this.label);
    output.writeFieldEnd();
  }
  if (this.size !== null && this.size !== undefined) {
    output.writeFieldBegin('size', Thrift.Type.I32, 3);
    output.writeI32(this.size);
    output.writeFieldEnd();
  }
  if (this.weight !== null && this.weight !== undefined) {
    output.writeFieldBegin('weight', Thrift.Type.I32, 4);
    output.writeI32(this.weight);
    output.writeFieldEnd();
  }
  if (this.x !== null && this.x !== undefined) {
    output.writeFieldBegin('x', Thrift.Type.DOUBLE, 5);
    output.writeDouble(this.x);
    output.writeFieldEnd();
  }
  if (this.y !== null && this.y !== undefined) {
    output.writeFieldBegin('y', Thrift.Type.DOUBLE, 6);
    output.writeDouble(this.y);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var GraphData = module.exports.GraphData = function(args) {
  this.edges = null;
  this.nodes = null;
  if (args) {
    if (args.edges !== undefined && args.edges !== null) {
      this.edges = Thrift.copyList(args.edges, [ttypes.Edge]);
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field edges is unset!');
    }
    if (args.nodes !== undefined && args.nodes !== null) {
      this.nodes = Thrift.copyList(args.nodes, [ttypes.Node]);
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field nodes is unset!');
    }
  }
};
GraphData.prototype = {};
GraphData.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.LIST) {
        this.edges = [];
        var _rtmp311 = input.readListBegin();
        var _size10 = _rtmp311.size || 0;
        for (var _i12 = 0; _i12 < _size10; ++_i12) {
          var elem13 = null;
          elem13 = new ttypes.Edge();
          elem13.read(input);
          this.edges.push(elem13);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.LIST) {
        this.nodes = [];
        var _rtmp315 = input.readListBegin();
        var _size14 = _rtmp315.size || 0;
        for (var _i16 = 0; _i16 < _size14; ++_i16) {
          var elem17 = null;
          elem17 = new ttypes.Node();
          elem17.read(input);
          this.nodes.push(elem17);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

GraphData.prototype.write = function(output) {
  output.writeStructBegin('GraphData');
  if (this.edges !== null && this.edges !== undefined) {
    output.writeFieldBegin('edges', Thrift.Type.LIST, 1);
    output.writeListBegin(Thrift.Type.STRUCT, this.edges.length);
    for (var iter18 in this.edges) {
      if (this.edges.hasOwnProperty(iter18)) {
        iter18 = this.edges[iter18];
        iter18.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.nodes !== null && this.nodes !== undefined) {
    output.writeFieldBegin('nodes', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.STRUCT, this.nodes.length);
    for (var iter19 in this.nodes) {
      if (this.nodes.hasOwnProperty(iter19)) {
        iter19 = this.nodes[iter19];
        iter19.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var GraphMetadata = module.exports.GraphMetadata = function(args) {
  this.numberOfTweets = null;
  this.numberOfNodes = null;
  this.numberOfEdges = null;
  if (args) {
    if (args.numberOfTweets !== undefined && args.numberOfTweets !== null) {
      this.numberOfTweets = args.numberOfTweets;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field numberOfTweets is unset!');
    }
    if (args.numberOfNodes !== undefined && args.numberOfNodes !== null) {
      this.numberOfNodes = args.numberOfNodes;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field numberOfNodes is unset!');
    }
    if (args.numberOfEdges !== undefined && args.numberOfEdges !== null) {
      this.numberOfEdges = args.numberOfEdges;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field numberOfEdges is unset!');
    }
  }
};
GraphMetadata.prototype = {};
GraphMetadata.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.I32) {
        this.numberOfTweets = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I32) {
        this.numberOfNodes = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.I32) {
        this.numberOfEdges = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

GraphMetadata.prototype.write = function(output) {
  output.writeStructBegin('GraphMetadata');
  if (this.numberOfTweets !== null && this.numberOfTweets !== undefined) {
    output.writeFieldBegin('numberOfTweets', Thrift.Type.I32, 1);
    output.writeI32(this.numberOfTweets);
    output.writeFieldEnd();
  }
  if (this.numberOfNodes !== null && this.numberOfNodes !== undefined) {
    output.writeFieldBegin('numberOfNodes', Thrift.Type.I32, 2);
    output.writeI32(this.numberOfNodes);
    output.writeFieldEnd();
  }
  if (this.numberOfEdges !== null && this.numberOfEdges !== undefined) {
    output.writeFieldBegin('numberOfEdges', Thrift.Type.I32, 3);
    output.writeI32(this.numberOfEdges);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var Output = module.exports.Output = function(args) {
  this.graphData = null;
  this.tweets = null;
  this.graphMetadata = null;
  this.topUsers = null;
  if (args) {
    if (args.graphData !== undefined && args.graphData !== null) {
      this.graphData = new ttypes.GraphData(args.graphData);
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field graphData is unset!');
    }
    if (args.tweets !== undefined && args.tweets !== null) {
      this.tweets = Thrift.copyList(args.tweets, [ttypes.Tweet]);
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field tweets is unset!');
    }
    if (args.graphMetadata !== undefined && args.graphMetadata !== null) {
      this.graphMetadata = new ttypes.GraphMetadata(args.graphMetadata);
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field graphMetadata is unset!');
    }
    if (args.topUsers !== undefined && args.topUsers !== null) {
      this.topUsers = Thrift.copyList(args.topUsers, [ttypes.UserTweetCount]);
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field topUsers is unset!');
    }
  }
};
Output.prototype = {};
Output.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.graphData = new ttypes.GraphData();
        this.graphData.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.LIST) {
        this.tweets = [];
        var _rtmp321 = input.readListBegin();
        var _size20 = _rtmp321.size || 0;
        for (var _i22 = 0; _i22 < _size20; ++_i22) {
          var elem23 = null;
          elem23 = new ttypes.Tweet();
          elem23.read(input);
          this.tweets.push(elem23);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRUCT) {
        this.graphMetadata = new ttypes.GraphMetadata();
        this.graphMetadata.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.LIST) {
        this.topUsers = [];
        var _rtmp325 = input.readListBegin();
        var _size24 = _rtmp325.size || 0;
        for (var _i26 = 0; _i26 < _size24; ++_i26) {
          var elem27 = null;
          elem27 = new ttypes.UserTweetCount();
          elem27.read(input);
          this.topUsers.push(elem27);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Output.prototype.write = function(output) {
  output.writeStructBegin('Output');
  if (this.graphData !== null && this.graphData !== undefined) {
    output.writeFieldBegin('graphData', Thrift.Type.STRUCT, 1);
    this.graphData.write(output);
    output.writeFieldEnd();
  }
  if (this.tweets !== null && this.tweets !== undefined) {
    output.writeFieldBegin('tweets', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.STRUCT, this.tweets.length);
    for (var iter28 in this.tweets) {
      if (this.tweets.hasOwnProperty(iter28)) {
        iter28 = this.tweets[iter28];
        iter28.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.graphMetadata !== null && this.graphMetadata !== undefined) {
    output.writeFieldBegin('graphMetadata', Thrift.Type.STRUCT, 3);
    this.graphMetadata.write(output);
    output.writeFieldEnd();
  }
  if (this.topUsers !== null && this.topUsers !== undefined) {
    output.writeFieldBegin('topUsers', Thrift.Type.LIST, 4);
    output.writeListBegin(Thrift.Type.STRUCT, this.topUsers.length);
    for (var iter29 in this.topUsers) {
      if (this.topUsers.hasOwnProperty(iter29)) {
        iter29 = this.topUsers[iter29];
        iter29.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var IOutput = module.exports.IOutput = function(args) {
  this.hasOldGraph = null;
  this.oldOutput = null;
  if (args) {
    if (args.hasOldGraph !== undefined && args.hasOldGraph !== null) {
      this.hasOldGraph = args.hasOldGraph;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field hasOldGraph is unset!');
    }
    if (args.oldOutput !== undefined && args.oldOutput !== null) {
      this.oldOutput = new ttypes.Output(args.oldOutput);
    }
  }
};
IOutput.prototype = {};
IOutput.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.BOOL) {
        this.hasOldGraph = input.readBool();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRUCT) {
        this.oldOutput = new ttypes.Output();
        this.oldOutput.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

IOutput.prototype.write = function(output) {
  output.writeStructBegin('IOutput');
  if (this.hasOldGraph !== null && this.hasOldGraph !== undefined) {
    output.writeFieldBegin('hasOldGraph', Thrift.Type.BOOL, 1);
    output.writeBool(this.hasOldGraph);
    output.writeFieldEnd();
  }
  if (this.oldOutput !== null && this.oldOutput !== undefined) {
    output.writeFieldBegin('oldOutput', Thrift.Type.STRUCT, 2);
    this.oldOutput.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var FreewordList = module.exports.FreewordList = function(args) {
  this.hasFreewordList = null;
  this.ListFreeword = null;
  if (args) {
    if (args.hasFreewordList !== undefined && args.hasFreewordList !== null) {
      this.hasFreewordList = args.hasFreewordList;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field hasFreewordList is unset!');
    }
    if (args.ListFreeword !== undefined && args.ListFreeword !== null) {
      this.ListFreeword = Thrift.copyList(args.ListFreeword, [null]);
    }
  }
};
FreewordList.prototype = {};
FreewordList.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.BOOL) {
        this.hasFreewordList = input.readBool();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.LIST) {
        this.ListFreeword = [];
        var _rtmp331 = input.readListBegin();
        var _size30 = _rtmp331.size || 0;
        for (var _i32 = 0; _i32 < _size30; ++_i32) {
          var elem33 = null;
          elem33 = input.readString();
          this.ListFreeword.push(elem33);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

FreewordList.prototype.write = function(output) {
  output.writeStructBegin('FreewordList');
  if (this.hasFreewordList !== null && this.hasFreewordList !== undefined) {
    output.writeFieldBegin('hasFreewordList', Thrift.Type.BOOL, 1);
    output.writeBool(this.hasFreewordList);
    output.writeFieldEnd();
  }
  if (this.ListFreeword !== null && this.ListFreeword !== undefined) {
    output.writeFieldBegin('ListFreeword', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.STRING, this.ListFreeword.length);
    for (var iter34 in this.ListFreeword) {
      if (this.ListFreeword.hasOwnProperty(iter34)) {
        iter34 = this.ListFreeword[iter34];
        output.writeString(iter34);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

