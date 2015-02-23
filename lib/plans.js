var _ = require('lodash')
  , Request = require('./request')
  , utils = require('./utils')
  , Promise = require('bluebird');

module.exports = Request.extend({
  path: '/plans',

  create: Request.method({
    method: 'POST'
  }),

  destroy: Request.method({
    method: 'DEL',
    urlData: '/{id}'
  })
});
