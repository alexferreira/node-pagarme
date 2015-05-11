//card_hash.test.js
'use strict';

var should = require('should');
var Promise = require('bluebird');
var _ = require('lodash');
var utils = require('./utils');
var PagarMe = utils.pagarMe;
var card = PagarMe.card_hash;

var info = {};

describe('Card Hash', function () {
  
  it('should not be able to create a card hash without a card number', function (done) {
    card._get(
      {
        card_holder_name: 'Alex Ferreira',
        card_expiration_date: '0319',
        card_cvv: '123'
      })
      .catch(function (err) {
        should.exist(_.find(err, {parameter_name: 'card_number'}));
        done();
      });
  });

  it('should not be able to create a card hash without a card holder name', function (done) {
    card._get(
      {
        card_number: '5453010000066167', 
        card_expiration_date: '0319',
        card_cvv: '123'
      })
      .catch(function (err) {
        should.exist(_.find(err, {parameter_name: 'card_holder_name'}));
        done();
      });
  });

  it('should not be able to create a card hash without a card expiration date', function (done) {
    card._get(
      {
        card_number: '5453010000066167', 
        card_holder_name: 'Alex Ferreira',
        card_cvv: '123'
      })
      .catch(function (err) {
        should.exist(_.find(err, {parameter_name: 'card_expiration_date'}));
        done();
      });
  });

  it('should not be able to create a card hash without a card cvv', function (done) {
    card._get(
      {
        card_number: '5453010000066167',
        card_holder_name: 'Alex Ferreira',
        card_expiration_date: '0319',
      })
      .catch(function (err) {
        should.exist(_.find(err, {parameter_name: 'card_cvv'}));
        done();
      });
  });

  it('should not be able to create with no card parameters', function (done) {
    card._get({ })
      .catch(function (err) {
        err.length.should.be.equal(5);
        done();
      });
  });


  it('should be able to create a card hash', function (done) {
    card._get(
      {
        card_number: '5453010000066167',
        card_holder_name: 'Alex Ferreira',
        card_expiration_date: '0319',
        card_cvv: '123'
      })
    .then(function (result) {
      should.exist(result.card_hash);
      done();
    });
  });

});
