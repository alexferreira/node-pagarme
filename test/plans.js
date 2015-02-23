'use strict';

var should = require('should');
var Promise = require('bluebird');
var _ = require('lodash');
var utils = require('./utils');
var PagarMe = utils.pagarMe;
var plans = PagarMe.plans;

var info = {};

var testPlanResponse = function (plan) {
  plan.id.should.be.ok;
  plan.name.should.be.ok;
  plan.name.should.equal('Basico');
  plan.amount.should.equal(2990);
  parseInt(plan.days).should.equal(30);
  parseInt(plan.trial_days).should.equal(10);
  parseInt(plan.charges).should.equal(4);
  parseInt(plan.installments).should.equal(1);
};

var testPlanUpdateResponse = function (plan) {
  plan.id.should.be.ok;
  plan.name.should.be.ok;
  plan.name.should.equal('Avançado');
  plan.amount.should.equal(2990);
  parseInt(plan.days).should.equal(30);
  parseInt(plan.trial_days).should.equal(0);
  parseInt(plan.charges).should.equal(4);
  parseInt(plan.installments).should.equal(1);
};

describe('Plan', function () {
  it('should be able to create a plan', function (done) {
    plans.create(utils.getPlanObj())
      .then(function (plan) {
        testPlanResponse(plan);
        info.plan = plan;
        done();
      });
  });

  it('should be able to update a plan', function (done) {
    var planCreateP = plans.create(utils.getPlanObj());

    var planUpdatedP = planCreateP.then(function(plan){
      testPlanResponse(plan);
      return plans.update(plan.id, { name: 'Avançado' });
    });

    planUpdatedP.then(function(plan){
      testPlanUpdateResponse(plan);
      done();
    })
  });

  it('should be able to destroy a plan', function (done) {
    plans.destroy(info.plan.id).then(function(plan){
      delete info.plan;
      done();
    })
  });

  it('should be able clear all plan', function (done) {
    plans.all().then(function(results){
      return Promise.map(results, function(plan){
        return plans.destroy(plan.id)
      });
    }).then(function(){
      done();
    })
  });

  it('should be able count zero plans', function (done) {
    plans.all().then(function(results){
      parseInt(results.length).should.equal(0);
      done();
    })
  });
});
