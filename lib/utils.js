var _ = require('lodash')
  , Promise = require('bluebird')
  , CreditCard = require('credit-card')

module.exports = {
  PagarMeError: function(errors) {
    var errorMessages = [];
    this.name = 'PagarMeError';

    for (var i = 0; i < errors.length; i++) {
      errorMessages.push(errors[i].message);
    }

    this.message = errorMessages.join("\n");
    this.errors = errors;
    return Promise.reject(this);
  }, 

  getBody: function(response) {
    return response.body;  
  },

  getErrors: function(err) {
    console.log(err)
    err = JSON.parse(err.text);
    return new this.PagarMeError(err.errors);
  },

  stringfyBody: function(body, parent) {
    var ret = [];

    for (var k in body) {
      var current_key = parent ? parent + "[" + encodeURIComponent(k) + "]" : encodeURIComponent(k);

      if (body[k] instanceof Array) {
        ret.push(this.stringfyArray(body[k], current_key));
      } else if (body[k] instanceof Object) {
        ret.push(this.stringfyBody(body[k], current_key));
      } else {
        ret.push(current_key + '=' + body[k]);
      }
    }

    return ret.join('&');
  },

  stringfyArray: function(array, parent) {
    var ret = [];

    for (var i = 0; i < array.length; i++) {
      if (array[i] instanceof Array) {
        ret.push(this.stringfyArray(array[i], parent));
      } else if (array[i] instanceof Object) {
        ret.push(this.stringfyBody(array[i], parent));
      } else {
        ret.push(parent + '[]=' + array[i]);
      }
    }

    return ret.join('&');
  },

  createParameterError: function (field, message) {
    return {
      parameter_name: field,
      type: 'invalid_parameter',
      message: message
    };
  },

  getCardType: function (number) {
    var cards = {
      VISA: /^4[0-9]{12}(?:[0-9]{3})?$/,
      MASTERCARD: /^5[1-5][0-9]{14}$/,
      AMERICANEXPRESS: /^3[47][0-9]{13}$/,
      DINERSCLUB: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
      DISCOVER: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      JCB: /^(?:2131|1800|35\d{3})\d{11}$/
    };
    for (var card in cards) {
      if (cards[card].test(number)) return card;
    }
  },

  validateCreditCard: function (body) {
    var createParameterError = this.createParameterError
      , getCardType = this.getCardType;

    return new Promise(function (resolve,reject) { 
      var errors = []
        , expirationMonth = body.card_expiration_date && parseInt(body.card_expiration_date.substr(0, 2))
        , expirationYear = body.card_expiration_date && parseInt(body.card_expiration_date.substr(2, 2))
        , cardType = getCardType(body.card_number);

      var card = {
        cardType: cardType,
        number: body.card_number,
        expiryMonth: expirationMonth,
        expiryYear: expirationYear+2000,
        cvv: body.card_cvv
      };

      var validation = CreditCard.validate(card);
      validation = _.omit(validation, 'card', 'customValidation');

      if(!validation.validCardNumber) errors.push(createParameterError('card_number', 'Número do cartão inválido.'));
      if(!body.card_holder_name) errors.push(createParameterError('card_holder_name', 'Nome do portador inválido.'));
      if(!validation.validExpiryMonth) errors.push(createParameterError('card_expiration_date', 'Mês de expiração inválido.'));
      if(!validation.validExpiryYear) errors.push(createParameterError('card_expiration_date', 'Ano de expiração inválido.'));
      if(!validation.validCvv) errors.push(createParameterError('card_cvv', 'Código de segurança inválido.'));

      return errors.length > 0 ? reject(errors): resolve(body);
    });
  }


};
