!function(){

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, Rule 			= require('./Rule');



	module.exports = new Class({

		init: function(options) {
			var thisContext = this;

			Class.define(this, '_rules', Class([]));

			Class.define(this, 'Rule', Class(function(option1, option2, option3){
				var rule = new Rule(option1, option2, option3);
				thisContext._rules.push(rule);
				return rule;
			}.bind(this)).Enumerable());
		}



		, getRules: function() {
			var rules = [];

			this._rules.forEach(function(rule){
				rules = rules.concat(rule.getRules());
			}.bind(this));

			return rules;
		}
	});
}();