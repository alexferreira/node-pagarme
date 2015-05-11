//card.test.js
'use strict';

var should = require('should');
var Promise = require('bluebird');
var _ = require('lodash');
var utils = require('./utils');
var PagarMe = utils.pagarMe;
var transaction = PagarMe.transactions;
var card = PagarMe.cards;

var info = {};

describe('Card', function () {
  
  // it('should not be able to create a card without a card number', function (done) {
  //   card.create(
  //     {
  //       card_holder_name: 'John Doe',
  //       card_expiration_date: '0319',
  //     })
  //     .catch(function (err) {
  //       should.exist(err);
  //       done();
  //     });
  // });

  // it('should not be able to create a card without a card holder name', function (done) {
  //   card.create(
  //     {
  //       card_number: '5453010000066167',
  //       card_expiration_date: '0319',
  //     })
  //     .catch(function (err) {
  //       should.exist(err);
  //       done();
  //     });
  // });

  // it('should not be able to create a card without a card expiration date', function (done) {
  //   card.create(
  //     {
  //       card_number: '5453010000066167',
  //       card_holder_name: 'John Doe',
  //     })
  //     .catch(function (err) {
  //       should.exist(err);
  //       done();
  //     });
  // });

  // it('should not be able to create with no card parameters', function (done) {
  //   card.create({ })
  //     .catch(function (err) {
  //       should.exist(err);
  //       done();
  //     });
  // });

  it('should be able to create a card', function (done) {
    card.create(
      {
        card_number: '5453010000066167',
        card_holder_name: 'Gandalf the White',
        card_expiration_date: '0319',
        card_cvv: '123'
      })
    .then(function (result) {
      info.cardId = result.id;
      should.exist(result.id);
      should.exist(result.brand);
      should.exist(result.holder_name);
      done();
    });
  });

  it('should be able to find a card by Id', function (done) {
    card.findById(info.cardId).then(function (card) {
        should.exist(card.id);
        should.exist(card.brand);
        should.exist(card.holder_name);
        done();
      });
  });

  it('shout create a transaction with card_id', function (done) {
  transaction.create({amount: 300, card_id: info.cardId, card_cvv: '123'})
    .then(function (transaction) {
      should.exist(transaction);
      done();
    });
  });
});
