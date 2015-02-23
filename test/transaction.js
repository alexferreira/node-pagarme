'use strict';

var should = require('should');
var Promise = require('bluebird');
var _ = require('lodash');
var utils = require('./utils');
var PagarMe = utils.pagarMe;
var transactions = PagarMe.transactions;

var testTransactionResponse = function (transaction) {
    transaction.id.should.be.ok;
    transaction.card_holder_name.should.be.ok;
    transaction.card_holder_name.should.equal('Alex Ferreira');
    transaction.date_created.should.be.ok;
    transaction.amount.should.equal(1000);
    parseInt(transaction.installments).should.equal(1);
    transaction.payment_method.should.equal('credit_card');
    transaction.status.should.equal('paid');
    should.equal(transaction.refuse_reason, null);
};

var testCustomerResponse = function (customer) {
    customer.id.should.be.ok;
    customer.document_type.should.equal('cpf');
    customer.name.should.equal('Alex Ferreira');
    customer.born_at.should.be.ok;
};

describe('Transaction', function () {
  it('should be able to charge anything', function (done) {
    transactions.create(utils.getTransactionObj())
      .then(function (transaction) {
        testTransactionResponse(transaction);
        done();
      });
  });

  it('should be able to refund', function (done) {
    var createTransactionP = transactions.create(utils.getTransactionObj());

    var refundTransactionP = createTransactionP.then(function(transaction){
      testTransactionResponse(transaction);
      return transactions.refund(transaction.id);
    });

    refundTransactionP.then(function (transaction) {
      transaction.status.should.equal('refunded');
        done();
    });
  });

  it('should be able to find by anything', function (done) {
    var criteria = {
      customer: {
        document_number: 21676667482
      }
    };
    transactions.findBy(criteria).then(function (transactions) {
        // transactions.should.have.lengthOf(10);
        _.each(transactions, function (transaction) {
            transaction.customer.document_number.should.equal('21676667482')
        });
        done();
    });
  });

  it('should be able to create transaction with boleto', function (done) {
      transactions.create({ payment_method: 'boleto', amount: 1000 })
        .then(function(transaction){
          transaction.payment_method.should.equal('boleto');
          transaction.status.should.equal('waiting_payment');
          transaction.amount.should.equal(1000);
          done();
        });
  });

  it('should be able to send metadata', function (done) {
    var createTransactionMetaP = transactions
      .create(
        utils.getTransactionObj({
          metadata: {
            event: {
              name: 'Evento foda',
              id: 335
            }
          }
        })
      );

    var transactionFindByIdP = createTransactionMetaP.then(function(transaction){
      transaction.metadata.should.be.ok;
      return transactions.findById(transaction.id);
    });

    transactionFindByIdP.then(function (transaction) {
      transaction.metadata.event.id.should.equal(335);
      transaction.metadata.event.name.should.equal('Evento foda');
      done();
    });
  });

  it('should be able to find transaction by id', function (done) {
    var transactionCreateP = transactions.create(utils.getTransactionObj());

    var transactionFindByIdP = transactionCreateP.then(function(transaction){
      testTransactionResponse(transaction);
      return transactions.findById(transaction.id);
    });

    transactionFindByIdP.then(function(transaction){
      transaction.id.should.equal(transaction.id);
      done();
    });
  });

  // it('should be able to create transaction with customer', function (done) {
  //     var transactionObj = utils.getTransactionWithCustomerObj();
  //     transactions.create(transactionObj).then(function(transaction) {
  //       testTransactionResponse(transaction);
  //       transaction.address.street.should.equal(transactionObj.customer.address.street);
  //       testCustomerResponse(transaction.customer);
  //       done();
  //     });
  // });

  // it('should be able to refund transaction with customer', function (done) {
  //   var createWithCustomerP = transactions.create(utils.getTransactionWithCustomerObj()).then(function (transaction) {
  //     testTransactionResponse(transaction);
  //     testCustomerResponse(transaction.customer);
  //     next(null, transaction);
  //   });

  //   var refundWithCustomerP = createWithCustomerP.then(function(transaction){
  //     testTransactionResponse(transaction);
  //     testCustomerResponse(transaction.customer);
  //     return transactions.refund(transaction.id);
  //   })

  //   refundWithCustomerP.then(function(transaction){
  //     transaction.status.should.equal('refunded');
  //     done();
  //   });
  // });
});
