!function(){

	var   Class 		= require('ee-class')
		, type 			= require('ee-types')
		, log 			= require('ee-log');




	var Rule = module.exports = new Class({
				
		init: function() {
			Class.define(this, '_rules', Class([]).Enumerable().Writable());

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

						case 'parameter':
						case 'parameters':
							if (!type.object(value)) throw new Error('the options parameter has to be an object!');
							Object.keys(value).forEach(function(key) {
								this.parameter(key, value[key]);
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
							throw new Error('parameters key «'+key+'» unrecognized!');
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
			return this._rules.filter(function(rule){
				return rule.path !== undefined && rule.domain !== undefined;
			});
		}


		, inherit: function(rule, pathname) {
			if (rule._domain)  						this._domain = rule._domain;
			if (!this._pathname && rule._pathname !== undefined) 	this._pathname = rule._pathname;

			if (pathname) this.pathname(pathname);

			rule.getRules().forEach(function(currentRule){
				var copiedRule = this._getRule();

				copiedRule.field = currentRule.field;
				copiedRule.value = currentRule.value;
				copiedRule.name = currentRule.name;

				this._rules.push(copiedRule);
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


		, method: function(method, ifMethod) {
			var rule = this._getRule();
			
			rule.value  = method;
			rule.field 	= ifMethod || '';
			rule.name  	= 'method';

			this._rules.push(rule);
			return this;
		}


		, parameter: function(key, value) {
			var rule = this._getRule();
			
			rule.value  = value;
			rule.field 	= key;
			rule.name  	= 'parameter';

			this._rules.push(rule);
			return this;
		}


		, path: function(path) {
			var rule = this._getRule();

			rule.value	= path;
			rule.name  	= 'path';

			// filter all existin gpath rules, there can be only one
			this._rules = this._rules.filter(function(rule) {return rule.name !== 'path'});

			this._rules.push(rule);
			return this;
		}


		, template: function(template, field) {
			var rule = this._getRule();

			rule.value  = template;
			rule.name  	= 'template';
			rule.field 	= field;

			this._rules.push(rule);
			return this;
		}


		, ensure: function(header, value) {
			this._setHeader('ensure', header, value);
			return this;
		}


		, override: function(header, value) {
			this._setHeader('override', header, value);
			return this;
		}


		, append: function(header, value) {
			this._setHeader('append', header, value);
			return this;
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
