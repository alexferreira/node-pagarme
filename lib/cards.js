var Request = require('./request');

module.exports = Request.extend({
  path: '/cards',

  create: Request.method({
    method: 'POST',
  }),
  
});
