var Request = require('./request'),
    ursa    = require('ursa'),
    Promise = require('bluebird'),
    utils   = require('./utils');


module.exports = Request.extend({
  path: '/transactions',

  _publicKey: Request.method({
    method: 'GET',
    urlData: '/card_hash_key'
  }),

  _get: function (body) {
    var that = this;
    
    return utils.validateCreditCard(body).then(function(body){
      return that._publicKey().then(function(data){
        var key = ursa.createPublicKey(new Buffer(data.public_key));
        var cardObj = {
          card_number: body.card_number,
          card_holder_name: body.card_holder_name,
          card_expiration_date: body.card_expiration_date,
          card_cvv: body.card_cvv
        };

        var cardData = utils.stringfyBody(cardObj);
        var encoded = key.encrypt(new Buffer(cardData, 'utf8'), 'utf8', 'base64', ursa.RSA_PKCS1_PADDING);
        body.card_hash = data.id + '_' + encoded;
        
        delete body.card_number;
        delete body.card_expiration_date;
        delete body.card_holder_name;
        delete body.card_cvv;
        
        return body;
      });
    });
  }

});
