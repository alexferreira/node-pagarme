'use strict';

var _ = require('underscore');

var utils = module.exports = {
  pagarMe: require('../index')('ak_test_wk9GE9OuuXKNd9o7H3u1RxFCFsApw8'),

  getApiKey: function () {
    return 'ak_test_wk9GE9OuuXKNd9o7H3u1RxFCFsApw8';
  },

  getTransactionObj: function (params) {
    params = params || {};

    return _.extend({
      card_number: '5453010000066167',
      card_holder_name: 'Alex Ferreira',
      card_expiration_date: '0319',
      card_cvv: '123',
      amount: 1000
    }, params);
  },

  getTransactionWithCustomerObj: function (params) {
    params = params || {};

    return _.extend(this.getTransactionObj(), {
      customer: {
        name: 'Alex Ferreira',
        document_number: '21676667482',
        email: 'alex@dsol.com.br',
        address: {
          street: 'Rua Presidente Castelo Branco',
          neighborhood: 'São Francisco de Assis',
          zipcode: '85660-000',
          street_number: 71,
        },
        phone: {
          ddd: 46,
          number: '88052219',
        },
        sex: 'M',
        born_at: '1984-10-12'
      }
    }, params);
  },

  getPlanObj: function (params) {
    params = params || {};

    return _.extend({
      name: 'Basico',
      amount: 2990,
      days: 30,
      trial_days: 10,
      payment_methods: ['credit_card', 'boleto'],
      charges: 4,
      installments: 1
    }, params);
  },

};



