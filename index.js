var models = {
  transactions: require('./lib/transactions'),
  plans: require('./lib/plans'),
};

function PagarMe (key) {
  if (!(this instanceof PagarMe)) {
    return new PagarMe(key);
  }

  this._api = {
      key: key,
      endpoint: 'https://api.pagar.me',
      version: '1'
  };

  this._loadModels();
};

PagarMe.prototype = {
  baseUrl: function() {
    return this._api.endpoint;
  },

  buildPath: function(path) {
    if (path[0] !== '/') path = '/' + path;

    return '/' + this._api.version + path;
  },

  fullUrl: function(path){
    return this.baseUrl() + '/' + this._api.version + path;
  },

  getApiKey: function() {
    return this._api.key;
  },

  _loadModels: function() {
    for (var model in models) this[model] = new models[model](this);
  }
};

module.exports = PagarMe;
