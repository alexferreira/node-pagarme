var _ = require('lodash')
  , Request = require('./request')
  , utils = require('./utils')
  , ursa = require('ursa')
  , Promise = require('bluebird');

var unsetCreditCardInformation = function (obj) {
  delete obj.card_number;
  delete obj.card_expiration_date;
  delete obj.card_holder_name;
  delete obj.card_cvv;
}

var processBoletoOrCard = function (body) {
  var that = this;

  return new Promise(function (resolve, reject) {
    if (body.payment_method == 'boleto') return resolve(body);
    utils.validateCreditCard(body).then(function(body){
      that._cardHash().then(function(data){
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

        resolve(body);
      });
    }).catch(reject);
  });
};

var beforeCreate = function (body) {
  body.payment_method = body.payment_method || 'credit_card';
  body.installments = body.installments || 1;
  body.status = body.status || 'local';

  return processBoletoOrCard.call(this, body).then(function(body){
    if (body.payment_method == 'credit_card') unsetCreditCardInformation(body);
    return body;
  });
};

module.exports = Request.extend({
  path: '/transactions',

  create: Request.method({
    method: 'POST',
    before: beforeCreate
  }),

  refund: Request.method({
    method: 'POST',
    urlData: '/{id}/refund'
  }),

  _cardHash: Request.method({
    method: 'GET',
    urlData: '/card_hash_key'
  })
});
