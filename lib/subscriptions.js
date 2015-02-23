var _ = require('lodash')
  , Request = require('./request')
  , utils = require('./utils')
  , Promise = require('bluebird');

module.exports = Request.extend({
  path: '/subscriptions',

  create: Request.method({
    method: 'POST'
  }),

  cancel: Request.method({
    method: 'POST',
    urlData: '/{id}/cancel'
  })
});
