# ee-soa-rule-manager

Rewriterule Generator for ee-soa

## installation

	npm install ee-soa-rule-manager

## build status

[![Build Status](https://travis-ci.org/eventEmitter/ee-soa-rule-manager.png?branch=master)](https://travis-ci.org/eventEmitter/ee-soa-rule-manager)


## usage


	var   RuleManager	 	= require('ee-soa-rule-manager')
		, rulesManager 	 	= new RuleManager()
		, Rule 				= rules.Rule;


	// configuring a rule via its contructor
	new Rule({
		  inherits: anotherRule
		, ensure: {
			range: '0-20'
		}
	});

	// inheritance
	var baseRule = new Rule().domain('j.b');

	var frontPage = new Rule(baseRule)
		.ensure('select', '*')
		.override('range', '0-10')
		.append('filter', 'x=3')
		.path('/event')
		.template('/index.html');

	var detailPage = new Rule()
		.inherit(frontPage)
		.template('/detail.html');


	// getting rules
	var rulesArray = detailPage.getRules();

	var allRules = rulesManager.getRules();