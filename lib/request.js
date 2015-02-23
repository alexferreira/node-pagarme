'use strict';

var _ = require('lodash')
  , superagent = require('superagent-as-promised')
  , utils = require('./utils')
  , Promise = require('bluebird');

function Request(pagarme) {
  this._pagarme = pagarme;
  var exclude = this.exclude || [];

  //Add the basic built in methods
  for (var name in builtInMethods) {
    if (exclude.indexOf(name) == -1 && !this[name]) this[name] = builtInMethods[name];
  }
};

Request.method = function (obj) {
  var reqMethod = obj.method.toLowerCase();
  var urlData = obj.urlData || '';
  var params = urlData.match(/\{(\w+)\}/g) || [];

  return function () {
    var args = Array.prototype.slice.call(arguments);
    var body = args.length > params.length && args.pop() || {};
    var path = urlData;
    var that = this;

    if (args.length < params.length) {
      var expectedArgs = [];

      _.each(params, function (arg) {
        expectedArgs.push(arg.substr(1, arg.length - 2));
      });

      throw {name: 'MissingArguments', message: 'This function expects the following parameters: ' + expectedArgs.join(', ')};
      return;
    }

    _.each(params, function (param) {
      path = urlData.replace(param, args[0]);
      args = args.slice(1);
    });

    return Promise.try(function() {
      if (obj.before) {
        obj.before.call(that, body);
      }
      return body;
    }).then(function(body){
      body['api_key'] = that._pagarme.getApiKey();
      
      if(reqMethod === 'get') body=utils.stringfyBody(body);

      var url =  that._pagarme.fullUrl(that.path + path);
      
      return superagent[reqMethod](url)
        .send(body)
        .then(utils.getBody)
        .catch(utils.getErrors);
    });
  };
};

var builtInMethods = {
  create: Request.method({
    method: 'POST'
  }),

  all: Request.method({
    method: 'GET'
  }),

  findById: Request.method({
    method: 'GET',
    urlData: '/{id}'
  }),

  update: Request.method({
    method: 'PUT',
    urlData: '/{id}'
  }),

  findBy: Request.method({
    method: 'GET'
  })
};

Request.extend = function (sub) {
  var _super = this;
  var _constructor = function () {
    _super.apply(this, arguments);
  };

  _constructor.prototype = Object.create(_super.prototype);

  for (var i in sub) {
    if (sub.hasOwnProperty(i)) _constructor.prototype[i] = sub[i];
  }

  return _constructor;
};

module.exports = Request;
