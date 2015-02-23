'use strict';

var should = require('should');
var Promise = require('bluebird');
var _ = require('lodash');
var utils = require('./utils');
var PagarMe = utils.pagarMe;
var subscriptions = PagarMe.subscriptions;
var plans = PagarMe.plans;

var info = {};

describe('Subscription', function () {
  it('should be able to create a subscription with boleto', function (done) {
    var planCreateP = plans.create(utils.getPlanObj());

    var subscriptionCreateP = planCreateP.then(function(plan){
      var obj = utils.getSubscriptionObj({
        plan_id: plan.id,
        payment_method: 'boleto'
      });
      obj = _.omit(obj, 'card_hash');

      return subscriptions.create(obj);
    });

    subscriptionCreateP.then(function(subscription){
      subscription.id.should.be.ok;
      subscription.status.should.be.equal('trialing');
      info.subscription = subscription;
      done();
    });
  });

  it('should be able to cancel a subscription', function (done) {
    subscriptions.cancel(info.subscription.id).then(function(subscription){
      subscription.id.should.be.ok;
      parseInt(subscription.id).should.equal(info.subscription.id);
      subscription.status.should.be.equal('canceled');
      done();
    })
  });
});
