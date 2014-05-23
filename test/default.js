
	
	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert');



	var RuleManager = require('../')
		, manager
		, Rule
		, rule;



	describe('The RuleManager', function(){
		it ('should not crash when instantiated', function(){
			manager = new RuleManager();
			Rule = manager.Rule;
		});	
	});
	

	describe('A Rule', function(){
		it ('should accept a ruleset via its constructor', function(){
			rule = new Rule({
				  domain 	: 'j.b'
				, pathname 	: /e-(\d+)$/gi
				, path 		: '/event'
				, parameters : {
					tenant: 1
				}
				, ensure: {
					'api-version' : 1
				}
				, override: {
					range: '0-60'
				}
			});

			assert.equal(JSON.stringify(manager.getRules()), '[{"domain":"j.b","path":{},"field":"","value":"/event","name":"path"},{"domain":"j.b","path":{},"field":"tenant","value":1,"name":"parameter"},{"domain":"j.b","path":{},"field":"api-version","value":1,"name":"ensure"},{"domain":"j.b","path":{},"field":"range","value":"0-60","name":"override"}]');
		});	


		it('should be able to inherits from other rule', function(){
			var rules = new Rule(rule)
				.template('detail.html')
				.ensure('select', '*')
				.getRules();

			assert.equal(JSON.stringify(rules), '[{"domain":"j.b","path":{},"field":"","value":"/event","name":"path"},{"domain":"j.b","path":{},"field":"tenant","value":1,"name":"parameter"},{"domain":"j.b","path":{},"field":"api-version","value":1,"name":"ensure"},{"domain":"j.b","path":{},"field":"range","value":"0-60","name":"override"},{"domain":"j.b","path":{},"field":"","value":"detail.html","name":"template"},{"domain":"j.b","path":{},"field":"select","value":"*","name":"ensure"}]');
		});
	});
	