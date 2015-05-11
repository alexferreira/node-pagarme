"use strict";

var should        = require('should'),
    _             = require('lodash'),
    utils         = require('./utils'),
    PagarMe       = utils.pagarMe,
    subscriptions = PagarMe.subscriptions,
    plans         = PagarMe.plans,
    card          = PagarMe.card_hash;

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

  it('should be able to create a subscription with a card', function (done) {
    var planCreateP = plans.create(utils.getPlanObj());

    var cardP = card._get(_.omit(utils.getTransactionObj(), 'amount'));

    var subscriptionCreateP =  cardP.then(function (result) {
      return planCreateP.then(function(plan){
        var obj = {
          plan_id: plan.id,
          customer: {email: 'test@test.com'},
          card_hash: result.card_hash
          };
        return subscriptions.create(obj);
      });
    });
    
    return subscriptionCreateP.then(function(subscription){
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
    });
  });
});
