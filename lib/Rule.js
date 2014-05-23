!function(){

	var   Class 		= require('ee-class')
		, type 			= require('ee-types')
		, log 			= require('ee-log');




	var Rule = module.exports = new Class({
				
		init: function() {
			Class.define(this, '_rules', Class([]).Enumerable());

			Array.prototype.slice.call(arguments).forEach(function(arg) {
				if (type.array(arg)) arg.forEach(this._processArgument.bind(this));
				else if (type.object(arg)) this._processArgument(arg);
				else if (type.string(arg)) this.pathname(arg);
			}.bind(this));
		}


		, _processArgument: function(arg) {
			if (arg instanceof Rule) this.inherit(arg);
			else {
				Object.keys(arg).forEach(function(key){
					var value = arg[key];

					switch (key) {
						case 'inherit':
						case 'inherits':
							this.inherit(value);
							break;

						case 'pathname':
							this.pathname(value);
							break;

						case 'domain':
							this.domain(value);
							break;

						case 'path':
							this.path(value);
							break;

						case 'option':
						case 'options':
							if (!type.object(value)) throw new Error('the options options has to be an object!');
							Object.keys(value).forEach(function(key) {
								this.option(key, value[key]);
							}.bind(this));
							break;

						case 'ensure':
							if (type.array(value)) value.forEach(this.ensure.bind(this));
							else this.ensure(value);
							break;

						case 'append':
							if (type.array(value)) value.forEach(this.append.bind(this));
							else this.append(value);
							break;

						case 'override':
							if (type.array(value)) value.forEach(this.override.bind(this));
							else this.override(value);
							break;

						default:
							throw new Error('Options key «'+key+'» unrecognized!');
					}
				}.bind(this));
			}
		}



		, _getRule: function() {
			return {
				  domain 	: this._domain
				, path 	 	: this._pathname
				, field 	: ''
				, value 	: ''
				, name 		: ''
			};
		}


		, getRules: function() {
			return this._rules;
		}


		, inherit: function(rule) {
			if (rule._domain)  		this._domain = rule._domain;
			if (rule._pathname) 	this._pathname = rule._pathname;

			rule.getRules().forEach(function(currentRule){
				this._rules.push(currentRule);
			}.bind(this));
			return this;
		}


		, domain: function(domain) {
			this._domain = domain;
			return this;
		}


		, pathname: function(pathname) {
			this._pathname = pathname;
			return this;
		}


		, option: function(key, value) {
			var rule = this._getRule();
			
			rule.value  = value;
			rule.field 	= key;
			rule.name  	= 'option';

			this._rules.push(rule);
			return this;
		}


		, path: function(path) {
			var rule = this._getRule();

			rule.value	= path;
			rule.name  	= 'path';

			this._rules.push(rule);
			return this;
		}


		, template: function(template) {
			var rule = this._getRule();

			rule.value  = template;
			rule.name  	= 'template';

			this._rules.push(rule);
			return this;
		}


		, ensure: function(header, value) {
			return this._setHeader('ensure', header, value);
		}


		, override: function(header, value) {
			return this._setHeader('override', header, value);
		}


		, append: function(header, value) {
			return this._setHeader('append', header, value);
		}


		, _setHeader: function(id, header, value) {
			var rule;

			if (type.object(header)) {
				Object.keys(header).forEach(function(key){
					return this._setHeader(id, key, header[key]);
				}.bind(this));
			}
			else {
				rule  		= this._getRule();
				rule.value  = value;
				rule.field 	= header;
				rule.name  	= id;

				this._rules.push(rule);
			}
			
			return this;
		}
	});
}();
