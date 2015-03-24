'use strict';

var _ = require('lodash');

var utils = module.exports = {
  pagarMe: require('../index')('ak_test_P2Oa5d0z96j8O84QBia8A8jbphmWi6'),

  getApiKey: function () {
    return 'ak_test_P2Oa5d0z96j8O84QBia8A8jbphmWi6';
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

  getSubscriptionObj: function(params){
    return _.extend({
      customer: {
        email: 'alex@dsol.com.br',
      },
      card_hash: '123754_kBeJDCMuXteI8z8kAeSktRsbmm1WElYgqJ2N6KjQ0PltT71yNJSxOjvp9X526o/Ex3ns0NtgghL8e30G97kto3jQENnyPVer7pqJSyrIHP+Z3fo5DT83N+5BPBfoqMFIbPitTAD32KRqkbeXpus5lfQ6S662oejnwcGkMQtIpiBrEd57olFC8hLKNTwtQFR6wtXv5/8fODLS+GLkAkuqDtKpzgpgsJEavH2J4G+AvIV1vtKDX7uL9utUWWbtBgtZfJ8/GV3kJ0DNlfjoZgLETT13ODYoJYX+nexuBSlJxE6A8I5NLCEeYGIRusf2RZPG5Dtze1OWZwEDx7tqhEmS0Q=='
    }, params);
  }

};



