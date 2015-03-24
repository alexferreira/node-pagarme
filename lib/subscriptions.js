var Request = require('./request');

module.exports = Request.extend({
  path: '/subscriptions',

  create: Request.method({
    method: 'POST',
  }),

  cancel: Request.method({
    method: 'POST',
    urlData: '/{id}/cancel'
  })
});
