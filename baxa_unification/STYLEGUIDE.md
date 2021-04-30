# Coding Conventions
## Variable Declaration
**1.** All variables should be declared before used.
**2.** Implied global variables should never be used.
**3.** The var statement should be the first statements in the function body.
**4.** The var statement should follow the single var pattern.
	// Pattern 1:
	var level = 5,
		size = 10,
		width = 30;

	// Pattern 2:
	var level, size, width;

	level = 5;
	size = 10;
	width = 30;

# Equality
Strict equality checks (===) should be used in favor of == wherever possible.

## Indentation
**1.** All code should be indented using tabs.
**2.** Anything with curly braces {} should be indented.

	function (a, b) {
		var c = 1,
			d = 2,
			inner;
		if (a > b) {
			inner = function () {
				return {
					r: c - d
				};
			};
		} else {
			inner = function () {
				return {
					r: c + d
				};
			};
		}
		return inner;
	}

## Curly Braces
**1.** Curly braces {} should always be used, even when they are optional.

	// Poor practice.
	if (true)
		console.log(1);
	else
		console.log(2);

	// Best practice.
	if (true) {
		console.log(1);
	} else {
		console.log(2);
	}

## Curly Brace Location
**1.** The opening curly brace should always appear on the same code line.

	// Poor practice.
	if (true)
	{
		console.log(1);
	}

	// Best practice.
	if (true) {
		console.log(1);
	}

## White Space
**1.** As a general rule, white space, should be added after list-like expressions, before and after operators and with curly braces used with function statements and object literal syntax. The below syntax passes JSLint and JSHint defaults for white space settings.
**2.** Be sure to use liberal spacing in your code.

	// After semicolons in loop statements.
	for (var i = 0; i < 10; i += 1) {
		// do stuff.
	}

	// After commas that delimit array items.
	var arr = [1, 2, 3, 4, 5];

	// After commas in object properties and after colons that divide property names and their values.
	var obj = {a: 1, b: 2, c: 3, d: 4};

	// Delimiting function arguments.
	myFunc(a, b, c);

	// Before curly braces in function declarations.
	function myFunc() {
		// do stuff.
	};

	// After {{function}} in anonymous function expressions.
	var myFunc = function () {
		// do stuff.
	};

	// Before opening curly braces.
	// Before and after curly braces in if-else cases.
	if (true) {
		// do something.
	} else {
		// do something else.
	}


## Naming Conventions
### Markup Classes & Ids
**1. Class names** should be lowercase and separated by a dash when appropriate.

	<div class="class-name"></div>

**2. Id's** should be camelcased with the first word being lowercased.

	<div id="myIdentifier"></div>

### Files
**1. Markup (html) files** should be lowercase and separated by a dash when appropriate.

	index.html
	recent-comments.html

**2. CSS/Less files** should be lowercase and separated by a dash when appropriate.

	layout.css
	base.css
	timer-module.css

**3. JavaScript Class Files** should be camelcased with the first word being uppercased. Controllers, Directives, Filters, Resources and Services are all JavaScript Classes.

	ClassroomCtrl.js
	ConferenceCtrl.js

**4. JavaScript Files** that are not considered class files should be lowercase and separated by a dash when appropriate.

	router.js
	constants.js
	main.js

**5. Image Files** should be lowercase and separated by a hyphen when appropriate.

	spinner.gif
	core-logo.png


## Comments
Comment blocks should use [yuidoc](http://yui.github.com/yuidoc/syntax/index.html) syntax. Be generous with comments. It is useful to leave information that will be read at a later time by people (possibly yourself) who will need to understand what you have done. The comments should be well-written and clear.

**1. JavaScript Classes** should receive a class level comment block.

	/**
	* A utility that brokers HTTP requests...
	*
	* @class IO
	* @constructor
	*/
	function IO (config) {}

**2. JavaScript Methods** should receive a method level comment block.

	/**
	* Returns this model's attributes as...
	*
	* @method toJSON
	* @param {Object} value Value to copy
	* @return {Object} copy Copy of ...
	*/
	toJSON: function (value, copy) {}

**3. JavaScript Properties** should receive a property level comment block.

	/**
	* Template for this view's container...
	*
	* @property containerTemplate
	* @type String
	* @default "<div/>"
	**/
	containerTemplate: '<div/>'

## Formatting JavaScript Class Files
All JavaScript Class files should be formatted in the same way. Class files include **controllers**, **directives**, **services**, **filters** and **resources**. If a Class file needs to deviate from the described format, please add a comment to the Class document block stating the reason.

It is important to provide the @submodule definition **AFTER** the @class definition, and to use "-" syntax for naming submodules.

### Controller Format

    /*jshint nomen:false */
    /*global define:true */

    define(
        [
    		'app',
    		'angular',
    		'underscore',
    		'debug'
    	],
    	function (app, angular, _, debug) {
    		'use strict';

    		/**
    		* The Class level comment...
    		* @class ControllerNameCtrl
    		* @submodule core-controller
    		* @constructor
    		*/
    		app.core.controller(
	    		'ControllerName',
	    		[
	    			'$scope',
	    			'$rootScope',
	    			'$route',
	    			function ($scope, $rootScope, $route) {
	    				// Controller implementation.
	    			}
	    		]
    		);
    	}
    );

### Directive Format

    /*jshint nomen:false */
    /*global define:true */

    define(
    	[
    		'app',
    		'angular',
    		'jquery',
    		'underscore'
    	],
    	function (app, angular, $, _) {
    		'use strict';

    		/**
    		* Class level comment...
			*
    		* This is where Class level dependency parameters
    		* should be documented, as well as a description
    		* on how the Angular.js directive was implemented.
			*
    		* @class DirectiveName
    		* @submodule core-directive
    		* @param {Service} $serviceName Angular.js service
    		* @param {Service} ServiceName Custom service name
    		* @param {String} CONSTANT Defined constant
    		* @constructor
    		*/
    		app.core.directive(
	    		'coreDirectiveName',
	    		[
	    			function () {
	    				// Directive implementation.
	    				/**
			    		* Method level comment...
						*
			    		* This is where directive parameters should be documented.
			    		* (Including DOM attributes used by directive)
						*
			    		* @method coreDirectiveName
			    		* @param {Object} paramName Attribute defined in dom used by directive.
			    		*/

			    		return {
			    			link: function () {
			    				// Implementation (not required to be link function, this is simply an example)
			    			}
			    		}
	    			}
	    		]
    		);
    	}
    );

### Service Format

    /*jshint nomen:false */
    /*global define:true */

    define(
    	[
    		'app',
    		'angular',
    		'jquery',
    		'underscore'
    	],
    	function (app, angular, $, _) {
    		'use strict';

    		/**
    		* Class level comment...
			*
    		* @class ServiceNameSvc
    		* @submodule core-service
    		* @constructor
    		*/
    		app.core.service(
    			'ServiceNameSvc',
    			[
    				function () {
    					// Service implementation.
    				}
    			]
    		);
    	}
    );

### Filter Format

    /*jshint nomen:false */
    /*global define:true */

    define(
    	[
    		'app',
    		'angular',
    		'jquery',
    		'underscore'
    	],
    	function (app, angular, $, _) {
    		'use strict';

    		/**
    		* Class level comment...
			*
    		* @class FilterName
    		* @submodule core-filter
    		* @constructor
    		**/
    		app.core.filter(
    			'FilterName',
    			[
    				function () {
    					// Filter implementation.
    					// In documentation, this block should contain an @method definition with @param definitions for filter parameters.
    				}
    			]
    		);
    	}
    );
