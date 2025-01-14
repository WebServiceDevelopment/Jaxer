/* ***** LICENSE BLOCK *****
 * Version: GPL 3
 *
 * This program is Copyright (C) 2007-2008 Aptana, Inc. All Rights Reserved
 * This program is licensed under the GNU General Public license, version 3 (GPL).
 *
 * This program is distributed in the hope that it will be useful, but
 * AS-IS and WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE, TITLE, or
 * NONINFRINGEMENT. Redistribution, except as permitted by the GPL,
 * is prohibited.
 *
 * You can redistribute and/or modify this program under the terms of the GPL, 
 * as published by the Free Software Foundation.  You should
 * have received a copy of the GNU General Public License, Version 3 along
 * with this program; if not, write to the Free Software Foundation, Inc., 51
 * Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 * 
 * Aptana provides a special exception to allow redistribution of this file
 * with certain other code and certain additional terms
 * pursuant to Section 7 of the GPL. You may view the exception and these
 * terms on the web at http://www.aptana.com/legal/gpl/.
 * 
 * You may view the GPL, and Aptana's exception and additional terms in the file
 * titled license-jaxer.html in the main distribution folder of this program.
 * 
 * Any modifications to this file must keep this entire header intact.
 *
 * ***** END LICENSE BLOCK ***** */

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework > clientConfig.js
 */
(function() {
	
var config = // for future use
{
};

if (typeof window.Jaxer == "undefined") { window.Jaxer = {}; }

/**
 * True on the server side, false on the client (browser).
 * 
 * @alias Jaxer.isOnServer
 * @property {Boolean}
 */
Jaxer.isOnServer = false;

/**
 * Holds the proxy functions for calling server functions that were designated
 * with runat="both-proxy" (or equivalent), to prevent function name collisions.
 * So e.g. if a function getName() is defined with runat="both-proxy", in the
 * browser you can call getName() to use the client-side function or
 * Jaxer.Server.getName() to use the server-side function. Jaxer.Server holds
 * both the synchronous and asynchronous versions of the proxies (e.g.
 * Jaxer.Server.getName() and Jaxer.Server.getName.async()).
 * 
 * @alias Jaxer.Server
 */
if (typeof Jaxer.Config == "undefined") { Jaxer.Config = {}; }
if (typeof Jaxer.Server == "undefined") { Jaxer.Server = {}; }

for (var prop in config)
{
	Jaxer.Config[prop] = config[prop];
}

if (typeof Jaxer.Log == "undefined")
{
	function ModuleLogger()
	{
		this.trace = this.debug = this.info = this.warn = this.error = this.fatal = function() {};
	}
	var genericModuleLogger = new ModuleLogger();
	Jaxer.Log = genericModuleLogger;
	Jaxer.Log.forModule = function() { return genericModuleLogger; }
}

})();

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Serialization > Serialization.js
 */

// NOTE! This is a server- and client-side, *compressible* module -- be sure to
// end each assignment of function literals with a semicolon

/*
 * Based on original code from Douglas Crockford's json.js, 2007-04-30
 */

(function(){

/**
 * @namespace {Jaxer.Serialization}
 * 
 * This is the namespace that contains Jaxer serialization methods.
 * 
 * The Jaxer serializer uses the familiar and popular JSON format. However,
 * additional functionality has been provided to allow for serialization of more
 * complex data structures. Specifically, this module supports cyclical data
 * structures, multiple references, and custom typeserializers. Each of these is
 * described below.
 * 
 * Cyclical data structures occur when an object (or array) contains a
 * descendent structure that also references that same object. For example, a
 * DOM node has references to its children and these children also have
 * references to the DOM node (their parentNode). In a traditional JSON
 * environment, if you were to try to serialize this structure, you would end up
 * in an infinite loop or an exception would occur as the serializer traversed
 * the parent node, its child nodes, and then back up to the parent node through
 * the child's parentNode property. Indeed, the serializer couldn't get past the
 * first child in this scenario. The Jaxer serializer bypasses this via the use
 * of marker properties and specially formatted strings referred to as
 * "references".
 * 
 * Multiple references are similar to cyclical data structures in that an object
 * is referenced two or more times. However, this does not necessarily create a
 * cycle. For example, say you have the following code:
 * 
 * 		<pre>var car = {
 * 			color: "blue",
 * 			price: 10000
 * 		};
 * 		var cars = [car, car];</pre>
 * 
 * As you can see, the same car object has been referenced twice in the array.
 * In a traditional JSON serializer, each instance of car would be serialized
 * separately. Unfortunately, that alters the data structure that will be
 * accessed after deserialization in a subtle way. You will end up with two
 * independent car objects which means that changing the price of one will not
 * change the price of the other as would have happened before the
 * serialization/deserialization cycle. In order to restore the same references,
 * Jaxer serializes the car only once and then leaves placeholders to point to
 * that single instance. During deserialization, the placeholders are replaced
 * with actual references to the deserialized object, thus restoring the
 * original data structure as it appeared before serialization.
 * 
 * Some data types cannot be expressed in JSON. For example, the Date type is
 * not listed as a valid type in JSON. So, in order to support this type and
 * potentially many others, the serializer allows the developer to register
 * custom serializers and associated deserializers for a given type. When the
 * serializer sees these types, the custom handlers are used to convert the item
 * to a string. It is then the responsibility of the custom deserializer to
 * restore the string to the original type. For example, Jaxer supports
 * XMLDocuments. The custom serializer creates an XML string which is specially
 * tagged so the deserializer can restore the XML string back to an XMLDocument.
 * 
 * Next, we briefly discuss how Jaxer recognizes cycles, multi-references, and
 * how it represents references and custom serialized objects.
 * 
 * The Jaxer serializer makes an initial pass over the data being serialized.
 * Each object, array, and custom serialization object is tagged with a unique
 * index. (Note that some objects do not allow properties to be added to them.
 * In this situation, the Jaxer serializer maintains an array of these items.
 * This array is searched when new items are encountered and serves the same
 * purpose as the id property). Before adding the index, we first check if we
 * have already indexed the item. If the tag already exists, then we've either
 * exposed a cycle or a multi-reference. At this point, the serializer knows to
 * switch to another JSON format that minimizes the amount of data to be
 * serialized.
 * 
 * References and custom serialization objects each make use of specially
 * formatted strings. To make this a bit clearer, we create an array of two
 * references to the same date object.
 * 
 * 		<pre>var d = new Date();
 * 		var items = [d, d];
 * 		var json = Jaxer.Serialization.toJSONString(items);</pre>
 * 
 * The resulting JSON string will look like the following:
 * 
 * 		<pre>[["~1~","~1~"], "~Date:2007-08-17T11:57:30~"]</pre>
 * 
 * This format always has a top-level array whose first element is the root
 * item that was originally being serialized. In this case, our top-most element
 * was an array. As an aside, the only top-level elements that can generate this
 * format are arrays, objects, and custom serialization objects. The first
 * special format  used for references and is defined with "~#~" where # is a
 * number. The number is the index into the top-level array. The element at that
 * index is the item that needs to be referenced where the reference string
 * lives. In this example, once deserialization has completed, both instances of
 * "~1~" will have been replaced with references to the deserialized date
 * object.
 * 
 * The next custom format, the date, shows how custom serializers emit text. The
 * first item after the ~ but before the : is the name of the type. This is the
 * fully-qualified type as you would have to type it in JavaScript to get to
 * that type's constructor. The string after the : is in a format as generated
 * by the type's custom serializer. The resulting string generated by the custom
 * serializer is in turn serialized as a string, so the deserializer does not
 * need to handle special characters or escape sequences. It is the
 * responsibility of the custom deserializer to consume that text and to return
 * effectively a clone of the original object.
 * 
 * This module also allows a developer to register alternate top-level
 * serialization and deserialization methods. The default method for
 * serialization is 'nativeJSON' which attempts to use the built-in JSON support
 * in the user agent, when available. In cases where 'nativeJSON' is not
 * supported, the 'JSON' mode will be used. The developer can also use 'JSON'
 * along with more options to customize serialization for special values like
 * 'undefined', and 'INFINITY', for example. Finally, there is a 'Jaxer' mode as
 * described above. This mode is used by Jaxer's framework and callback
 * mechanisms and is available to developers that may need this advanced
 * functionality. These serialization methods are specificed in a separate
 * optional parameter to the "toJSONString" and 'fromJSONString" functions. Note
 * that if the developer uses a non-default serialization method, then the
 * developer is also responsible for using this same method for deserialization.
 * Currenty, this implementation cannot detect which method was used for the
 * original serialization step
 * 
 * @see Jaxer.Serialization.toJSONString
 * @see Jaxer.Serialization.fromJSONString
 */

// create Serialization container
var Serialization = {};

// action enumeration
Serialization.SERIALIZE_ACTION = "serialize";
Serialization.THROW_ACTION = "throw";
Serialization.TRUNCATE_ACTION = "truncate";
Serialization.NULLIFY_ACTION = "nullify";
Serialization.RETURN_OBJECT_ACTION = "return object";

// message emitted by the truncate action
var TRUNCATION_MESSAGE = "__truncated__";

// public serialization option properties and default settings
var DEFAULT_MAX_DEPTH = 10;
var MAX_DEPTH_PROPERTY = "maxDepth";
var MAX_DEPTH_ACTION_PROPERTY = "maxDepthAction";
var DATE_SERIALIZATION_ACTION_PROPERTY = "dateSerializationAction";
var SPECIAL_NUMBER_SERIALIZATION_ACTION_PROPERTY = "specialNumberSerializationAction";
var UNDEFINED_SERIALIZATION_ACTION_PROPERTY = "undefinedSerializationAction";
var USE_CUSTOM_SERIALIZERS_PROPERTY = "useCustomSerializers";

// private property names used internally during serialization
var ID_PROPERTY = "$id";
var ITEMS_PROPERTY = "$items";

// our supported serializer method names
Serialization.JAXER_METHOD = "Jaxer";
Serialization.JSON_METHOD = "JSON";
Serialization.NATIVE_JSON_METHOD = "nativeJSON";

var JSON_SYNTAX_ERROR_NAME = "JSONSyntaxError";
var JSON_EVAL_ERROR_NAME = "JSONEvalError";

// default serialization result
var NO_RESULT = "undefined";

// patterns used to query text patterns for special string values
var VALID_TYPE_PATTERN = /^[a-zA-Z_$](?:[-a-zA-Z0-9_$]*)(?:\.[a-zA-Z_$](?:[-a-zA-Z0-9_$]*))*$/;
var DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;

// custom type handler, serializer, and deserializer hashes
var typeHandlers = {};
var serializers = {};
var deserializers = {};

/*
 * BEGIN: Private functions section
 */

/**
 * Convert an Array to a JSON string
 * 
 * @private
 * @param {Array} ary
 * 		The source Array to be serialized
 * @param {Object} options
 * 		This is the options object passed into the top-level toJSONString
 * 		function.
 * @return {String}
 * 		The resulting JSON string
 */
function ArrayToJSON(ary, options)
{
	// clone options object so as not to alter the original
	options = Jaxer.Util.protectedClone(options);
	
	// decrease recursion depth counter
	options[MAX_DEPTH_PROPERTY]--;
	
	// perform max-depth action if we've reached our maximum recursion depth
	if (options[MAX_DEPTH_PROPERTY] < 0)
	{
		var action = options[MAX_DEPTH_ACTION_PROPERTY] || Serialization.THROW_ACTION;
		
		switch (action)
		{
			case Serialization.TRUNCATE_ACTION:
				return '"' + TRUNCATION_MESSAGE + '"';
				
			case Serialization.THROW_ACTION:
				throw new Error("Maximum recursion depth has been exceeded");
				break;
		}
	}
	
	var result = [];
	var length = ary.length;
	
	// For each value in this array...
	for (var i = 0; i < length; i++)
	{
		var item = ary[i];
		
		// Note that we ignore elements that are not serializeable
		if (isSerializeable(item)) 
		{
			result.push(toCrockfordJSONString(item, options));
		}
	}

	// Join all of the fragments together and return.
	return "[" + result.join(",") + "]";
}

/**
 * Clear the lookup table used to match a type with its constructor. This needs
 * to be performed before serialization and deserialization since the global
 * context changes depending on when in the page life cycle serialization is
 * being performed.
 * 
 * @private
 */
function clearHandlerCache()
{
	for (var name in typeHandlers) 
	{
		typeHandlers[name].constructor = null;
	}
}

/**
 * Convert a date to a our special string format for later deserizliation
 * 
 * @private
 * @param {Date} data
 * 		The source Date to be serialized
 * @return {String}
 * 		The resulting JSON string
 */
function DateToJSON(data)
{
	// Format integers to have at least two digits.
	function pad(n)
	{
		return n < 10 ? '0' + n : n;
	}

	// Ultimately, this method will be equivalent to the date.toISOString
	// method.
	return '"' +
		data.getFullYear() + '-' +
		pad(data.getUTCMonth() + 1) + '-' +
		pad(data.getUTCDate()) + 'T' +
		pad(data.getUTCHours()) + ':' +
		pad(data.getUTCMinutes()) + ':' +
		pad(data.getUTCSeconds()) + '"';
}

/**
 * Traverse the resulting JSON object to perform any post-processing needed
 * to convert references and custom serialization objects to their proper
 * instances.
 * 
 * @private
 * @param {String} property
 * 		The name of the propery to visit
 * @param {Object} obj
 * 		The object whose property will be visited
 * @param {Function} filter
 * 		The function to apply to each element in the data graph
 * @return {Object}
 * 		The resulting filter property value
 */
function walk(property, obj, filter)
{
	if (obj && typeof obj === 'object')
	{
		for (var p in obj)
		{
			if (obj.hasOwnProperty(p))
			{
				obj[p] = walk(p, obj[p], filter);
			}
		}
	}
	
	return filter(property, obj);
}

/**
 * This is a shared function used by both the "jaxer" and the "json"
 * serialization methods. The options object is used to determine if special
 * numbers should be allowed in the source json string
 * 
 * @private
 * @param {Object} json
 * @param {Object} options
 * @return {Object}
 */
function evalJSONString(json, options)
{
	var result = NO_RESULT;
	var simpleValuePattern =
		(options[SPECIAL_NUMBER_SERIALIZATION_ACTION_PROPERTY] === Serialization.SERIALIZE_ACTION)
			?	/"[^"\\\n\r]*"|true|false|null|undefined|NaN|[-+]?Infinity|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g
			:	/"[^"\\\n\r]*"|true|false|null|undefined|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	
	// Run the text against a regular expression to look for non-JSON
	// characters. We are especially concerned with '()' and 'new' because they
	// can cause invocation, and '=' because it can cause mutation. But just to
	// be safe, we will reject all unexpected characters.

	// if (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+EINaefilnr-uy \n\r\t])+?$/.test(json))
	
	// We split the second stage into 4 regexp operations in order to work around
	// crippling inefficiencies in IE's and Safari's regexp engines. First we
	// replace all backslash pairs with '@' (a non-JSON character). Second, we
	// replace all simple value tokens with ']' characters. Third, we delete all
	// open brackets that follow a colon or comma or that begin the text. Finally,
	// we look to see that the remaining characters are only whitespace or ']' or
	// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
    if (
		/^[\],:{}\s]*$/.
			test
			(
				json.replace(/\\["\\\/bfnrtu]/g, '@').
					replace(simpleValuePattern, ']').
					replace(/(?:^|:|,)(?:\s*\[)+/g, '')
			)
	)
	{
		// We use the eval function to compile the text into a JavaScript
		// structure. The '{' operator is subject to a syntactic ambiguity in
		// JavaScript: it can begin a block or an object literal. We wrap the
		// text in parens to eliminate the ambiguity.

		try
		{
			result = eval('(' + json + ')');
		}
		catch (e)
		{
			var err = new Error("parseJSON: exception '" + e + "' when evaluating: " + json);
			err.name = JSON_EVAL_ERROR_NAME;
			throw err;
		}
	}
	else
	{
		var err = new Error("parseJSON: unexpected characters in: " + json);
		err.name = JSON_SYNTAX_ERROR_NAME;
		throw err;
	}
	
	return result;
}

/**
 * Find the type handler name for the specified object's type. If no handler
 * exists, then this function will return null.
 * 
 * @private
 * @param {Object} item
 * 		The item for which a custom serialization handler name is being queried.
 * @return {String}
 * 		If the item's type is not registered with a custom serialization
 * 		handler, then this function will return null; otherwise, the fully-
 * 		qualified type name will be returned. This type name is also the name
 * 		of the handler.
 */
function findHandlerName(item)
{
	var result = null;
	
	for (var name in typeHandlers)
	{
		if (typeHandlers[name].canSerialize(item))
		{
			result = name;
			break;
		}
	}
	
	return result;
}

/**
 * fromCrockfordJSONString
 * 
 * @private
 * @param {String} json
 * @param {Object} options
 * @return {Object}
 */
function fromCrockfordJSONString(json, options)
{
	/**
	 * For JSON strings that do not contain references, we make a
	 * post-processing step to replace all custom serialization string with
	 * their deserialized instances.
	 * 
	 * @private
	 * @param {String} property
	 * 		The property name to filter
	 * @param {Object} value
	 * 		The value of the property being filtered
	 */
	function filter(property, value)
	{
		var result = value;
		
		if (typeof value === "string")
		{
			var match;
			
			if (match = value.match(DATE_PATTERN))
			{
				var win = getWindow();
				
				result = new win.Date(Date.UTC(match[1], match[2] - 1, match[3], match[4], match[5], match[6]));
			}
		}
		
		return result;
	}
	
	var result = evalJSONString(json, options);
	
	if (result)
	{
		result = walk('', result, filter);
	}
	
	return result;
}

/**
 * fromJaxerJSONString
 * 
 * @private
 * @param {String} json
 * @param {Object} options
 * @return {Object}
 */
function fromJaxerJSONString(json, options)
{
	var REFERENCE_PATTERN = /^~(\d+)~$/;
	var REFERENCE_STRING = /('~\d+~'|"~\d+~")/;
	var CUSTOM_SERIALIZATION_PATTERN = /^~([a-zA-Z_$](?:[-a-zA-Z0-9_$]*)(?:\.[a-zA-Z_$](?:[-a-zA-Z0-9_$]*))*):([\s\S]+)~$/; // Use \s\S to match newlines too
	
	/**
	 * A reference constitutes an object and a property on the object. This
	 * class is used to specify a specific property on an object for later
	 * setting of that value.
	 *
	 * @private
	 * @constructor
	 * @param {Object} object
	 * 		The source object of this reference
	 * @param {String} property
	 * 		the property on the object representing this reference value
	 * @param {Number} index
	 * 		The reference ID that uniquely identifies this reference 
	 */
	function Reference(object, property, index)
	{
		this.object = object;
		this.property = property;
		this.index = index;
	}
	
	/**
	 * Walks the list of nodes passed in the method and sets all properties
	 * on this instance's underlying object to the values in the node list
	 *
	 * @private
	 * @param {Array} nodes
	 * 		A list of all nodes in the data graph. This array is used to
	 * 		extract the value of this reference via this reference's unique id.
	 */
	Reference.prototype.setValue = function(nodes)
	{
		var result = false;
		
		if (0 <= this.index && this.index < nodes.length)
		{
			this.object[this.property] = nodes[this.index];
			result = true;
		}
		
		return result;
	};
	
	/**
	 * This post-processing step replaces all reference strings with the actual
	 * object reference to which they refer.
	 * 
	 * @private
	 * @param {Array} input
	 * 		The source array created by the first step of eval'ing the JSON
	 * 		source string.
	 * @return {Object}
	 * 		The resulting object created by dereferencing all reference values
	 * 		and rewiring of the object graph
	 */
	function postProcess(input)
	{
		var result = input;
		
		if (input.length > 0)
		{
			var valid = true;
			
			inputLoop:
			for (var i = 0; i < input.length; i++)
			{
				var item = input[i];
				
				if (item === null || item === undefined)
				{
					valid = false;
					break;
				}
				
				var type = item.constructor;
				var itemGlobal = getWindow(item);
				
				// add any references
				switch (type)
				{
					case itemGlobal.Array:
						postProcessArray(item);
						break;
						
					case itemGlobal.Object:
						postProcessObject(item);
						break;

                    case itemGlobal.String:
                        postProcessMember(input, i);
                        break;
						
					default:
						valid = false;
						break inputLoop;
				}
			}

			if (valid)
			{
				if (references.length > 0)
				{
					result = input[0];
					
					for (var i = 0; i < references.length; i++)
					{
						var success = references[i].setValue(input);
						
						if (success === false)
						{
							result = input;
							break;
						}
					}
				}
			}
		}
		
		return result;
	}
	
	/**
	 * This post-processing step replaces all object references that are members
	 * of the specified array with actual references to the object to which they
	 * refer
	 * 
	 * @private
	 * @param {Array} ary
	 * 		The source array to process
	 * @return {Boolean}
	 * 		Returns true if the specified array was a valid reference array
	 */
	function postProcessArray(ary)
	{
		var result = true;
		
		for (var i = 0; i < ary.length; i++)
		{
			if (postProcessMember(ary, i) === false)
			{
				result = false;
				break;
			}
		}
		
		return result;
	}
	
	/**
	 * This post-processing step replaces all object references that are members
	 * of the specified object with actual references to the object to which
	 * they refer
	 * 
	 * @private
	 * @param {Object} obj
	 * 		The source object to process
	 * @param {Array} references
	 * 		An array of reference instances
	 * @return {Boolean}
	 * 		Returns true if the specified object was a valid reference object
	 */
	function postProcessObject(obj, references)
	{
		var result = true;
		
		for (var p in obj)
		{
			if (postProcessMember(obj, p) === false)
			{
				result = false;
				break;
			}
		}
		
		return result;
	}
	
	/**
	 * This post-processing steps replaces all reference strings with the actual
	 * object reference to which they refer. Also, custom deserializers are
	 * invoked for any matching custom serializer strings that are encountered.
	 * 
	 * @private
	 * @param {Object} obj
	 * 		The object to post-process
	 * @param {String|Number} property
	 * 		The name or index of the object to process.
	 * @return {Boolean}
	 * 		Returns true if the obj[property] value is a valid reference object
	 */
	function postProcessMember(obj, property)
	{
		var item = obj[property];
		var result = true;
		
		if (item !== null && item !== undefined)
		{
			var type = item.constructor;
			var itemGlobal = getWindow(item);
			
			switch (type)
			{
				case itemGlobal.Array:
					// we only allow empty arrays
					if (item.length > 0)
					{
						result = false;
					}
					break;

				case itemGlobal.Object:
					// we only allow empty objects
					for (var p in item)
					{
						result = false;
						break;
					}
					break;
											
				case itemGlobal.String:
					var match;
					
					if (match = item.match(REFERENCE_PATTERN))
					{
						var index = match[1] - 0;
						var ref = new Reference(obj, property, index);
						
						references.push(ref);
					}
					else if (match = item.match(CUSTOM_SERIALIZATION_PATTERN))
					{
						var name = match[1];
						var serializedString = match[2];
						var handler = typeHandlers[name];
						
						if (handler && handler.canDeserialize && handler.canDeserialize(serializedString))
						{
							obj[property] = handler.deserializer(serializedString);
						}
					}
					break;
			}
		}
		
		return result;
	}
	
	/**
	 * For JSON strings that do not contain references, we make a
	 * post-processing step to replace all custom serialization string with
	 * their deserialized instances.
	 * 
	 * @private
	 * @param {String} property
	 * 		The property name to filter
	 * @param {Object} value
	 * 		The value of the property being filtered
	 */
	function filter(property, value)
	{
		var result = value;
		
		if (typeof value === "string")
		{
			var match;
			
			if (match = value.match(CUSTOM_SERIALIZATION_PATTERN))
			{
				var name = match[1];
				var serializedString = match[2];
				var handler = typeHandlers[name];
				
				if (handler && handler.canDeserialize && handler.canDeserialize(serializedString))
				{
					result = handler.deserializer(serializedString);
				}
			}
		}
		
		return result;
	}
	
	var result = evalJSONString(json, options);
	var references = [];
	
	if (result)
	{
		var itemGlobal = getWindow(result);
		
		// if the result is an array, it may be in our format to support
		// cycles and multi-references
		if (result.constructor === itemGlobal.Array)
		{
			// It is an array, so next test for reference strings
			if (REFERENCE_STRING.test(json))
			{
				// found one, so process references
				result = postProcess(result);
			}
			else
			{
				// no references, so process custom serialization strings only
				result = walk('', result, filter);
			}
		}
		else
		{
			// not a "references" structure, so process custom serialization
			// strings only
			result = walk('', result, filter);
		}
	}
	
	return result;
}

/**
 * Find the window object that created the specified object. This returns the
 * correct global context when performing comparisons against the object's
 * constructor.
 * 
 * @private
 * @param {Object} object
 * 		The object from which determine the global context
 * @return {Object}
 * 		Returns the object's owning window
 */
function getWindow(object)
{
	var globalContext;

	var hasParent =
			object !== null
		&&	typeof(object) !== "undefined"
		&&	object.__parent__ !== null
		&&	typeof(object.__parent__) !== "undefined";
	
	if (hasParent)
	{
		var current = object;
		var parent = object.__parent__;
		while (parent && parent !== current)
		{
			current = parent;
			parent = parent.__parent__;
		}
		if (current != object)
		{
			globalContext = current;
		}
	}
	
	if (!globalContext) 
	{
		if (Jaxer.isOnServer) 
		{
			globalContext = Jaxer.pageWindow || Jaxer.frameworkGlobal;
		}
		else 
		{
			globalContext = window;
		}
	}
	
	return globalContext;
}

/**
 * Checks whether the given argument is JSON-serializable (i.e. JSON-
 * representible) or not (e.g. functions are not).
 * 
 * @private
 * @param {Object} obj
 * 		The object to test, which can be of any type or even undefined
 * @return {Boolean}
 * 		true if representable in JSON, false otherwise.
 */
function isSerializeable(obj)
{
	var result = false;
	
	if (obj === null || obj === undefined) 
	{
		result = true;
	}
	else 
	{
		switch (typeof obj)
		{
			case "string":
			case "number":
			case "boolean":
			case "object": // also includes Dates and Arrays
				result = true;
				break;
				
			case "function": // only RegExp "functions" are serializable
				result = (obj.constructor === getWindow(obj).RegExp);
				break;
		}
	}
	
	return result;
}

/**
 * Convert an object to a JSON string
 * 
 * @private
 * @param {Object} data
 * 		The source object to be serialized
 * @param {Object} options
 * 		This is the options object passed into the top-level toJSONString
 * 		function.
 * @return {String}
 * 		The resulting JSON string
 */
function ObjectToJSON(data, options)
{
	// clone options object so as not to alter the original
	options = Jaxer.Util.protectedClone(options);
	
	// decrease recursion depth counter
	options[MAX_DEPTH_PROPERTY]--;
	
	// perform max-depth action if we've reached our maximum recursion depth
	if (options[MAX_DEPTH_PROPERTY] < 0)
	{
		var action = options[MAX_DEPTH_ACTION_PROPERTY] || Serialization.THROW_ACTION;
		
		switch (action)
		{
			case Serialization.TRUNCATE_ACTION:
				return '"' + TRUNCATION_MESSAGE + '"';
				
			case Serialization.THROW_ACTION:
				throw new Error("Maximum recursion depth has been exceeded");
				break;
		}
	}
	
	var result = [];

	// Iterate through all of the keys in the object, ignoring the proto chain.
	for (var k in data)
	{
		var p = '"' + k + '":';
		var v = data[k];
		
		// Note that we ignore elements that are not serializeable
		if (isSerializeable(v)) 
		{
			result.push(p + toCrockfordJSONString(v, options));
		}
	}

	// Join all of the fragments together and return.
	return "{" + result.join(',') + "}";
}

/**
 * Convert a string to a JSON string
 * 
 * @private
 * @param {Object} data
 * 		The source string to be serialized
 * @param {Object} options
 * 		This is the options object passed into the top-level toJSONString
 * 		function.
 * @return {String}
 * 		The resulting JSON string
 */
function StringToJSON(data, options)
{
	// m is a table of character substitutions.
	var characterMap = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	};
	
	// If the string contains no control characters, no quote characters,
	// and no backslash characters, then we can simply slap some quotes
	// around it. Otherwise we must also replace the offending characters
	// with safe sequences.

	if (/["\\\x00-\x1f]/.test(data))
	{
		return '"' + data.replace(
			/([\x00-\x1f\\"])/g,
			function (a, b)
			{
				var c = characterMap[b];
				
				if (c)
				{
					return c;
				}
				
				c = b.charCodeAt();
				
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}
		) + '"';
	}
	
	return '"' + data + '"';
}

/**
 * Convert the specified object into a JSON string
 * 
 * @private
 * @param {Object} data
 * 		The Javascript value to be serialized
 * @param {Object} options
 * 		The options object
 * @return {String}
 * 		The resulting JSON string
 */
function toCrockfordJSONString(data, options)
{
	var result = NO_RESULT;
	
	if (isSerializeable(data)) 
	{
		if (data === null) 
		{
			result = "null";
		}
		else if (data === undefined) 
		{
			var action = options[UNDEFINED_SERIALIZATION_ACTION_PROPERTY] || Serialization.THROW_ACTION;
			
			switch (action)
			{
				case Serialization.SERIALIZE_ACTION:
					result = "undefined";
					break;
					
				case Serialization.NULLIFY_ACTION:
					result = "null";
					break;
					
				case Serialization.THROW_ACTION:
				default:
					throw new Error("Serialization of 'undefined' is not supported unless the undefinedSerializationAction option is set to 'serialize'");
			}
		}
		else 
		{
			var ctor = data.constructor;
			var dataGlobal = getWindow(data);
			
			switch (ctor)
			{
				case dataGlobal.Array:
					result = ArrayToJSON(data, options);
					break;
					
				case dataGlobal.Boolean:
					result = String(data, options);
					break;
					
				case dataGlobal.Number:
					if (isFinite(data) === false) 
					{
						var action = options[SPECIAL_NUMBER_SERIALIZATION_ACTION_PROPERTY] || Serialization.THROW_ACTION;
						
						switch (action)
						{
							case Serialization.SERIALIZE_ACTION:
								result = String(data, options);
								break;
								
							case Serialization.NULLIFY_ACTION:
								result = "null";
								break;
									
							case Serialization.THROW_ACTION:
							default:
								throw new Error("Serialization of special numbers is not supported unless the specialNumberSerializationAction option is set to 'serialize'");
						}
					}
					else 
					{
						result = String(data, options);
					}
					break;
					
				case dataGlobal.Object:
					result = ObjectToJSON(data, options);
					break;
					
				case dataGlobal.String:
					result = StringToJSON(data, options);
					break;
					
				case dataGlobal.Function:
					// should not get here because we've checked for being
					// serializable, but just in case
					break;
					
				default: // custom built-ins
					if (options[USE_CUSTOM_SERIALIZERS_PROPERTY]) 
					{
						var typeName = findHandlerName(data);
					
						if (typeName !== null) 
						{
							result = StringToJSON("~" + typeName + ":" + typeHandlers[typeName].serializer(data) + "~");
						}
						else 
						{
							// isSerializeable said we could serialize this object,
							// so treat it as a generic object
							result = ObjectToJSON(data, options);
						}
					}
					else if (ctor === dataGlobal.Date) 
					{
						var action = options[DATE_SERIALIZATION_ACTION_PROPERTY] || Serialization.THROW_ACTION;
						
						switch (action)
						{
							case Serialization.SERIALIZE_ACTION:
								result = DateToJSON(data);
								break;
								
							case Serialization.NULLIFY_ACTION:
								result = "null";
								break;
								
							case Serialization.RETURN_OBJECT_ACTION:
								result = "{}";
								break;
								
							case Serialization.THROW_ACTION:
							default:
								throw new Error("Serialization of Dates is not supported unless the dateSerializationAction option is set to 'serialize'");
						}
					}
					else 
					{
						// isSerializeable said we could serialize this object,
						// so treat it as a generic object
						result = ObjectToJSON(data, options);
					}
					break;
			}
		}
	}
	
	return result;
}

/**
 * toJaxerJSONString
 * 
 * @private
 * @param {Object} data
 * @param {Object} options
 */
function toJaxerJSONString(data, options)
{
	var result = NO_RESULT;
	var wrappedItems = [];
	
	/**
	 * A wrapped object is used to hold objects that are not expandable. We
	 * need to be able to add an id property to each object to find cycles and
	 * mult-references in the data graph. If that object doesn't allow new
	 * properties to be added to it (typically XPCOM wrapper objects), then we
	 * can use an instance of WrappedObject in its place. This object will
	 * serve only as a container for an object and its id. This later will be
	 * expanded back into the serialization stream as the underlying object so
	 * this will never appear in the final JSON string
	 * 
	 * @private
	 * @constructor
	 * @param {Object} id
	 * @param {Object} object
	 */
	function WrappedObject(id, object)
	{
		// set id
		this[ID_PROPERTY] = id;
		
		// save reference so we can test if this is exactly equivalent to other
		// references to this object
		this.object = object;
		
		// add to wrapped item list
		wrappedItems.push(this);
	}
	
	/**
	 * Since wrapped objects can't have properties added to them, we need to
	 * check the wrappedItems array to see if it exists there. This is
	 * equivalent to checking if the id property has been defined on an object
	 * that couldn't have that property added to it
	 * 
	 * @private
	 * @param {Object} object
	 * @return {Boolean}
	 */
	function isWrappedItem(object)
	{
		var length = wrappedItems.length;
		var result = false;
		
		for (var i = 0; i < length; i++)
		{
			var wrappedItem = wrappedItems[i];
			
			if (wrappedItem.object === object)
			{
				result = true;
				break;
			}
		}
		
		return result;
	}
	
	/**
	 * This function will return either a WrappedItem instance or the object
	 * passed into the function. If the object has been wrapped, then its
	 * wrapper is returned; othewise, we return the object itself
	 * 
	 * @private
	 * @param {Object} object
	 * @return {Object}
	 */
	function getWrappedItem(object)
	{
		var length = wrappedItems.length;
		var result = object;
		
		for (var i = 0; i < length; i++)
		{
			var wrappedItem = wrappedItems[i];
			
			if (wrappedItem.object === object)
			{
				result = wrappedItem;
				break;
			}
		}
		
		return result;
	}
	
	/**
	 * Walk the object graph and tag all items in the graph. Note that cycles
	 * and multi-references are detected in this process and all special
	 * properties used for this discovery process are later removed.
	 * 
	 * @private
	 * @return {Boolean}
	 * 		Return true if this specifed object contains references; otherwise,
	 * 		return false. This value can be used to decide if this object needs
	 * 		to be represented as standard JSON or in our extended format.
	 */
	function tagReferences()
	{
		var result = false;
		
		var index = 0;
		var queue = [data];
		
		while (queue.length > 0)
		{
			var item = queue.shift();
			
			if (item !== null && item !== undefined)
			{
				if (!item.hasOwnProperty || (item.hasOwnProperty(ID_PROPERTY) === false && isWrappedItem(item) === false))
				{
					// NOTE: In some browsers, such as Safari 3 and possibly
					// Firefox 2, RegExp's yield "function" here, and there are
					// other such examples
					if (typeof(item) === "object" || typeof(item) === "function") 
					{
						var type = item.constructor;
						var itemGlobal = getWindow(item);
						
						if (type === itemGlobal.Array) 
						{
							if (item.length > 0) 
							{
								item[ID_PROPERTY] = index;
								options[ITEMS_PROPERTY][index] = item;
								index++;
								
								for (var i = 0; i < item.length; i++) 
								{
									// We only need to process elements that
									// are serializeable since non-serializeable
									// elements will be skipped later
									if (isSerializeable(item[i])) 
									{
										queue.push(item[i]);
									}
								}
							}
						}
						else 
						{
							var handlerName = findHandlerName(item);
							
							if (type === itemGlobal.Object || handlerName !== null) 
							{
								try 
								{
									item[ID_PROPERTY] = index;
									options[ITEMS_PROPERTY][index] = item;
								} 
								catch (e) 
								{
									// Some objects, like XPCOM objects, don't
									// allow properties to be added to them, so,
									// we wrap these objects in WrappedObjects
									// for later special processing
									options[ITEMS_PROPERTY][index] = new WrappedObject(index, item);
								}
								
								index++;
							}
							
							// only process child properties for objects that
							// don't have custom serialization
							if (handlerName === null) 
							{
								for (var p in item) 
								{
									// no need to process id properties that were just added
									if (p !== ID_PROPERTY) 
									{
										try 
										{
											// We only need to process elements that
											// are serializeable since non-serializeable
											// elements will be skipped later
											if (isSerializeable(item[p])) 
											{
												queue.push(item[p]);
											}
										} 
										catch (e) 
										{
											Jaxer.Log.debug("During serialization, could not access property " + p + " so it will be ignored");
										}
									}
								}
							}
						}
					}
				}
				else
				{
					// found multiple references to the same object or array
					result = true;
				}
			}
		}
		
		return result;
	}
	
	/**
	 * Convert the specified items into a JSON string emitting special
	 * string values for references
	 * 
	 * @private
	 * @return {String}
	 * 		The resulting JSON string
	 */
	function toJSONWithReferences()
	{
		var items = options[ITEMS_PROPERTY];
		var references = [];
			
		for (var i = 0; i < items.length; i++)
		{
			var item = items[i];
			
			// grab stand-in object if this is a WrappedObject
			if (item.constructor === WrappedObject)
			{
				item = item.object;
			}
			
			var type = item.constructor;
			var itemGlobal = getWindow(item);

			switch (type)
			{
				case itemGlobal.Array:
					var parts = [];
					
					for (var j = 0; j < item.length; j++)
					{
						var elem = getWrappedItem(item[j]);
						
						if (elem !== undefined && elem !== null && elem.hasOwnProperty && elem.hasOwnProperty(ID_PROPERTY))
						{
							parts.push('"~' + elem[ID_PROPERTY] + '~"');
						}
						else
						{
							parts.push(toCrockfordJSONString(elem, options));
						}
					}
					
					references.push("[" + parts.join(",") + "]");
					break;
					
				case itemGlobal.Object:
					var parts = [];
					
					for (var p in item)
					{
						if (p !== ID_PROPERTY)
						{
							var elem = getWrappedItem(item[p]);
							var k = '"' + p + '":';
							
							if (elem !== undefined && elem !== null && elem.hasOwnProperty && elem.hasOwnProperty(ID_PROPERTY))
							{
								parts.push(k + '"~' + elem[ID_PROPERTY] + '~"');
							}
							else
							{
								parts.push(k + toCrockfordJSONString(elem, options));
							}
						}
					}
					
					references.push("{" + parts.join(",") + "}");
					break;
					
				default:
					var typeHandler = findHandlerName(item);
					
					if (typeHandler !== null)
					{
						references.push(toCrockfordJSONString(item, options));
					}
					else
					{
						// log and/or throw exception?
					}
					break;
			}
		}
		
		return "[" + references.join(",") + "]";
	}
	
	/**
	 * Remove id properties used to detect cycles and multi-references
	 */
	function untagReferences()
	{
		var items = options[ITEMS_PROPERTY];
		
		for (var i = 0; i < items.length; i++) 
		{
			var item = items[i];
			
			// only non-wrapped objects were able to have the id property added to them
			if (item.constructor !== WrappedObject) 
			{
				delete item[ID_PROPERTY];
			}
		}
	}
	
	// start of function body
	
	if (data !== undefined)
	{
		if (tagReferences() === false)
		{
			// we didn't find any cycles or multi-references, so remove the
			// properties we used to identify those structures
			untagReferences();
			
			// and then serialize the data as standard JSON
			result = toCrockfordJSONString(data, options);
		}
		else
		{
			// we did find a cycle or multi-reference, so emit our semantically
			// special JSON structure
			result = toJSONWithReferences();
			
			// we're done with our object tags, so remove those
			untagReferences();
		}
	}

	return result;
}

/*
 * BEGIN: Public Serialization functions section
 */

/**
 * Add a top-level JSON serializer
 * 
 * @alias Jaxer.Serialization.addDeserializer
 * @param {String} name
 * 		The unique name of the deserializer. This name can be specified in the
 * 		options object provided to the fromJSONString function. That will select
 * 		this deserializer as the top-level function to deserialize the specified
 * 		object. Note that case is not significant
 * @param {Function} deserializer
 * 		The function used to deserialized the JSON string created by the
 * 		associated serializer.
 * @param {Function} [beforeDeserialization]
 * 		An optional function that will be called before the top-level
 * 		deserialization process begins. This function should take a single
 * 		parameter which will be the options object provided to the
 * 		fromJSONString function. Note that the options object will be an
 * 		inherited clone of the object sent to fromJSONString. This allows this
 * 		function to initialize any data structures needed by the deserializer
 * 		without altering the original options object passed into fromJSONString
 * @param {Function} [afterDeserialization]
 * 		An optional function that will be called after the top-level
 * 		deserialization process ends. This function should take a single
 * 		parameter which will be the options object provided to the
 * 		fromJSONString function. Note that the options object will be an
 * 		inherited clone of the object sent to the fromJSONString.
 */
Serialization.addDeserializer = function(name, deserializer, beforeDeserialization, afterDeserialization)
{
	if (typeof(name) === "string" && typeof(deserializer) === "function")
	{
		name = name.toLocaleLowerCase();
		
		// Only allow "jaxer" to be registered once
		if (name !== Serialization.JAXER_METHOD || deserializers.hasOwnProperty(Serialization.JAXER_METHOD) === false)
		{
			var handler = {
				deserializer: deserializer,
				beforeDeserialization: (typeof(beforeDeserialization) === "function") ? beforeDeserialization : function() {},
				afterDeserialization: (typeof(afterDeserialization) === "function") ? afterDeserialization : function() {}
			};
			
			deserializers[name] = handler;
		}
	}
};

/**
 * Add a top-level JSON serializer
 * 
 * @alias Jaxer.Serialization.addSerializer
 * @param {String} name
 * 		The unique name of the serializer. This name can be specified in the
 * 		options object provided to the toJSONString function. That will select
 * 		this serializer as the top-level function to serialize the specified
 * 		object. Note that case is not significant
 * @param {Function} serializer
 * 		The function used to serialize data. This function should take two
 * 		arguments: the actual data to serialize and an options object
 * @param {Function} [beforeSerialization]
 * 		An optional function that will be called before the top-level
 * 		serialization process begins. This function should take a single
 * 		parameter which will be the options object provided to the toJSONString
 * 		function. Note that the options object will be an inherited clone of
 * 		the object sent to the toJSONString. This allows this function to
 * 		initialize any data structures needed by the serializer without altering
 * 		the original options object passed into toJSONString
 * @param {Function} [afterSerialization]
 * 		An optional function that will be called after the top-level
 * 		serialization process ends. This function should take a single
 * 		parameter which will be the options object provided to the toJSONString
 * 		function. Note that the options object will be an inherited clone of
 * 		the object sent to the toJSONString.
 */
Serialization.addSerializer = function(name, serializer, beforeSerialization, afterSerialization)
{
	if (typeof(name) === "string" && typeof(serializer) === "function")
	{
		name = name.toLocaleLowerCase();
		
		// Only allow "jaxer" to be registered once
		if (name !== Serialization.JAXER_METHOD || serializers.hasOwnProperty(Serialization.JAXER_METHOD) === false)
		{
			var handler = {
				serializer: serializer,
				deserializer: (typeof(deserializer) === "function") ? deserializer : function() {},
				beforeSerialization: (typeof(beforeSerialization) === "function") ? beforeSerialization : function() {},
				afterSerialization: (typeof(afterSerialization) === "function") ? afterSerialization : function() {}
			};
			
			serializers[name] = handler;
		}
	}
};

/**
 * Add handlers for custom serialization/deserialization
 * 
 * @alias Jaxer.Serialization.addTypeHandler
 * @param {String} name
 * 		The fully-qualified name of the type. This should reflect the full,
 * 		potentially dotted, notation you would need to use to access this type's
 * 		constructor from the global context.
 * @param {Function} serializer
 * 		A function that takes an instance of the type it serializes and that
 * 		returns a string representation of the type suitable as input into
 * 		the deserializer
 * @param {Function} deserializer
 * 		A function that takes a string produced by the custom serializer and
 * 		that returns a new instance of the custom supported type.
 * @param {Function} [canSerialize]
 * 		An optional function that takes an object instance and returns a
 * 		boolean. This function should return true if it the current handler is
 * 		able to serialize the object passed to it.
 * @param {Function} [canDeserialize]
 * 		An optional function that takes an object instance and returns a
 * 		boolean. This function should return true if it the current handler is
 * 		able to deserialize the string passed to it.
 */
Serialization.addTypeHandler = function(name, serializer, deserializer, canSerialize, canDeserialize)
{
	if
	(
			typeof(name) === "string"
		&&	VALID_TYPE_PATTERN.test(name)
		&&	typeof(serializer) === "function"
		&&	typeof(deserializer) === "function"
	)
	{
		// add handlers
		var handler = {
			constructor: null,
			serializer: serializer,
			deserializer: deserializer
		};
		
		// set serialization test function
		if (typeof(canSerialize) === "function")
		{
			handler.canSerialize = canSerialize;
		}
		else
		{
			handler.canSerialize = function(item)
			{
//				var candidate = handler.constructor;
				var result = false;
				
//				// We have to do lazy loading of constructors so we have references
//				// from the correct global
//				if (candidate === null) 
//				{
					// look up constructor
					var parts = name.split(/\./);
					
					// start at global
					var candidate = getWindow(item);
					
					// and traverse each segment of the type
					for (var i = 0; i < parts.length; i++) 
					{
						var part = parts[i];
						
						if (candidate && ((candidate.hasOwnProperty && candidate.hasOwnProperty(part)) || (part in candidate)))
						{
							candidate = candidate[part];
						}
						else 
						{
							candidate = null;
							break;
						}
					}
					
//					if (candidate !== null) 
//					{
//						handler.constructor = candidate;
//					}
//					else 
//					{
//						handler.constructor = undefined;
//					}
//				}
				
				if (candidate !== null) 
				{
					result = candidate === item.constructor;
				}
				
				return result;
			}
		}
		
		// set deserialization test function
		if (typeof(canDeserialize) === "function")
		{
			handler.canDeserialize = canDeserialize;
		}
		else
		{
			handler.canDeserialize = function(str)
			{
				return true; // By default we should be able to handle any string we've serialized
			}
		}
		
		typeHandlers[name] = handler;
	}
};

/**
 * Reconstructs a Javascript data structure from a JSON string. Note that the
 * serialization mode ('Jaxer', 'JSON', or 'nativeJSON') can be specified in
 * the "options" parameter with the 'as' property. This will default to
 * 'nativeJSON' when either no options are passed in or if the 'as' property is
 * not defined. See Jaxer.Serialization.toJSONString for more details.
 * 
 * @alias Jaxer.Serialization.fromJSONString
 * @param {String} json
 * 		A string in the JSON format
 * @param {Object} options
 * 		The options objecct which can be used to control deserialization
 * @return {Object}
 * 		The resulting object graph after converting the JSON string to the
 * 		equivalent Javascript data structure
 * @see Jaxer.Serialization.toJSONString
 */
Serialization.fromJSONString = function fromJSONString(json, options)
{
	var result = NO_RESULT;
	
	// setup default values
	if (options && typeof(options) === "object")
	{
		// prevent changes to the original options object
		var clone = Jaxer.Util.protectedClone(options);
		
		// add properties to our clone when the original options object does
		// not contain them
		
		if (options.hasOwnProperty("as") === false)
		{
			clone.as = Serialization.NATIVE_JSON_METHOD;
		}
		
		// make sure we use the clone from here on
		options = clone;
	}
	else
	{
		// create a new object with default values
		options = {
			as: Serialization.NATIVE_JSON_METHOD
		};
	}
	
	// get the name of the serializer we're supposed to use	
	var deserializerName = options.as.toLocaleLowerCase();
	
	// grab appropriate serializer
	if (serializers.hasOwnProperty(deserializerName))
	{
		// grab handler functions for this serialization method
		var handler = deserializers[deserializerName];
		
		// allow serializer to perform any initialization it needs
		handler.beforeDeserialization(options);
		
		// deserialize
		result = handler.deserializer(json, options);
		
		// allow serializer to perform any cleanup it needs
		handler.afterDeserialization(options);
	}
	else
	{
		throw new Error("Unknown deserialization method: '" + options.as + "'");
	}
	
	return result;
};

/**
 * Remove support for the custom JSON serializer
 * 
 * @alias Jaxer.Serialization.removeSerializer
 * @param {String} name
 * 		The name of the serializer to remove. Note that case is not significant
 * @return {Boolean}
 * 		Returns true if the serializer was successfully removed. Note that this
 * 		function will return false if you attempt to remove a handler that is
 * 		not already registered or if it is a built-in serializer like "jaxer".
 */
Serialization.removeSerializer = function(name)
{
	var result = false;
	
	if (typeof(name) === "string")
	{
		name = name.toLocaleLowerCase();
		
		if (name !== Serialization.JAXER_METHOD) 
		{
			result = delete serializers[name];
		}
	}
	
	return result;
};

/**
 * Remove support for custom serialization/deserialization for the specified
 * type
 * 
 * @alias Jaxer.Serialization.removeTypeHandler
 * @param {String} name
 * 		The fully qualified name of the type to remove
 * @return {Boolean}
 * 		Returns true if the handler was successfully removed. Note that this
 * 		function will return false if you attempt to remove a handler that is
 * 		not already registered.
 */
Serialization.removeTypeHandler = function(name)
{
	var result = false;
	
	if (typeof(name) === "string") 
	{
		result = delete typeHandlers[name];
	}
	
	return result;
};

/**
 * Convert the specified object into a JSON representation. Note that we have
 * modified JSON to support object references (cycles) and to convert Dates into
 * a special format that will be recognized by our code during deserialization.
 * 
 * This function includes an optional second parameter which can be used to
 * control how the data is serialized. If the options parameter defines an 'as'
 * property, that will be used to select the serialization format. Currently,
 * the values 'Jaxer', 'JSON', and 'nativeJSON' are supported. 'Jaxer' includes
 * support for cycles, multi-refs, and custom type serializers. 'JSON' and
 * 'nativeJSON' follow the serialization format and semantics as defined by
 * Douglas Crockford on the json.org website.
 * 
 * When specifying the 'Jaxer' serializer, additional options are available. The
 * "useCustomSerializers" has a boolean value which defaults to true. When this
 * property is true, any type serializers that have been registered via
 * addTypeHandler will be used in the serialization process. When this value is
 * false, items needing custom serialization will be ignored as they would be in
 * the "JSON" format. The "undefinedSerializationAction" property determines how
 * the 'undefined' value is handled. The action defaults to 'serialize', but
 * 'throw' is also supported which will throw an exception when trying to
 * serialize 'undefined'.
 * 
 * When specifying the 'JSON' serializer, additional options are available. The
 * 'maxDepth' property, which defaults to 10, is used to prevent deep recursion.
 * If the recursion level is encountered, the 'maxDepthAction' property
 * determines the serializer's action. 'truncate' will emit a "__truncated__"
 * string in place of the object that would cause the recursion level to be
 * exceeded. 'throw' will throw an exception. The 'dateSerializationAction'
 * property is used to determine how dates are processed. A value of 'serialize'
 * will convert the date to a specially formatted string as described in the
 * json.org example code. A value of 'throw' will throw an exception when a date
 * is encountered. Finally, a value of "return object" will return an empty
 * object in place of the Date itself. The 'undefinedSerializationAction'
 * property is used to determine how 'undefined' is processed. A value of
 * 'serialize' will convert the value to 'undefined'. 'throw' will throw an
 * exception and 'nullify' will return 'null'. The
 * 'specialNumberSerializationAction' property is used to determine how
 * Infinity, -Infinity, and NaN are processed. A value of 'serialize' will
 * convert the value to their text representation which is the same as the
 * identifier used to represent them. 'throw' will throw an exception and
 * 'nullify' will return null.
 * 
 * When specifying the 'nativeJSON' serializer, the built-in native support for
 * JSON serialization will be used, when available. This serialization does not
 * support any custom options. In the case where 'nativeJSON' is specified but
 * is not available, this mode will fallback to the 'JSON' mode with options
 * specified in that mode to match the behavior of the native JSON
 * implementation as specificed in the ECMAScript 3.1 specification.
 * 
 * Note that other serializers can be registered with Jaxer. Most likely those
 * serializers will define their own set of options. You will need to refer to
 * the implementors documentation to determine those properties, their values,
 * and their associated semantics.
 * 
 * @alias Jaxer.Serialization.toJSONString
 * @param {Object} data
 * 		The source object to convert to a JSON string
 * @param {Object} [options]
 * 		An optional object used to specify configuration info to the selected
 * 		serializer
 * @return {String}
 * 		The resulting JSON string which can be reversed back into the source
 * 		object via Serialization.fromJSONString
 */
Serialization.toJSONString = function(data, options)
{
	var result = NO_RESULT;
	
	// setup default values
	if (options && typeof(options) === "object")
	{
		// prevent changes to the original options object
		var clone = Jaxer.Util.protectedClone(options);
		
		// add properties to our clone when the original options object does
		// not contain them
		
		if (options.hasOwnProperty("as") === false)
		{
			clone.as = Serialization.NATIVE_JSON_METHOD;
		}
		
		// make sure we use the clone from here on
		options = clone;
	}
	else
	{
		// create a new object with default values
		options = {
			as: Serialization.NATIVE_JSON_METHOD
		};
	}
	
	// get the name of the serializer we're supposed to use	
	var serializerName = options.as.toLocaleLowerCase();
	
	// grab appropriate serializer
	if (serializers.hasOwnProperty(serializerName))
	{
		// grab handler functions for this serialization method
		var handler = serializers[serializerName];
		
		// allow serializer to perform any initialization it needs
		handler.beforeSerialization(options);
		
		// serialize
		result = handler.serializer(data, options);
		
		// allow serializer to perform any cleanup it needs
		handler.afterSerialization(options);
	}
	else
	{
		throw new Error("Unknown serialization method: '" + options.as + "'");
	}
	
	return result;
};

/*
 * BEGIN: Serializer registration section
 */

// register Jaxer-style serialization which supports cycles, multi-references
// and customer serialization by type
(function() {
	// common options handling
	function initOptions(options)
	{
		// make sure the following values are defined
		var defaults = {};
		
		// NOTE: These properties are not used by the "jaxer" serializer proper,
		// but in cases where there are no cycles or multi-refs, we simply call
		// the "json" serializer which does use these properties.
		defaults[MAX_DEPTH_PROPERTY] = DEFAULT_MAX_DEPTH;
		defaults[MAX_DEPTH_ACTION_PROPERTY] = Serialization.TRUNCATE_ACTION;
		
		defaults[USE_CUSTOM_SERIALIZERS_PROPERTY] = true;
		defaults[UNDEFINED_SERIALIZATION_ACTION_PROPERTY] = Serialization.SERIALIZE_ACTION;
		defaults[SPECIAL_NUMBER_SERIALIZATION_ACTION_PROPERTY] = Serialization.SERIALIZE_ACTION;
		
		Jaxer.Util.safeSetValues(options, defaults);
		
		// clear custom serializer cache
		clearHandlerCache();
	}
	
	Serialization.addSerializer(
		Serialization.JAXER_METHOD,
		toJaxerJSONString,
		function beforeJaxerSerialization(options)
		{
			// do common options setup
			initOptions(options);
			
			// make sure "items" array exists
			options[ITEMS_PROPERTY] = [];
		},
		function afterJaxerSerialization(options)
		{
			// release any references we might have in the "items" array
			delete options[ITEMS_PROPERTY];
		}
	);
	
	Serialization.addDeserializer(
		Serialization.JAXER_METHOD,
		fromJaxerJSONString,
		initOptions
	);
})();

// register Crockford-style serialization
(function() {
	function initOptions(options)
	{
		// make sure the following values are defined
		var defaults = {};
		
		defaults[MAX_DEPTH_PROPERTY] = DEFAULT_MAX_DEPTH;
		defaults[MAX_DEPTH_ACTION_PROPERTY] = Serialization.THROW_ACTION;
		defaults[DATE_SERIALIZATION_ACTION_PROPERTY] = Serialization.SERIALIZE_ACTION;
		defaults[UNDEFINED_SERIALIZATION_ACTION_PROPERTY] = Serialization.NULLIFY_ACTION;
		defaults[SPECIAL_NUMBER_SERIALIZATION_ACTION_PROPERTY] = Serialization.NULLIFY_ACTION;
		
		Jaxer.Util.safeSetValues(options, defaults);
		
		// make sure we don't use our custom serializers in "Crockford" mode
		options[USE_CUSTOM_SERIALIZERS_PROPERTY] = false;
	}
	
	Serialization.addSerializer(
		Serialization.JSON_METHOD,
		toCrockfordJSONString,
		initOptions
	);
	
	Serialization.addDeserializer(
		Serialization.JSON_METHOD,
		fromCrockfordJSONString,
		initOptions
	);
})();

// register native JSON serialization
(function() {
	// These defaults cause the JS-based serialization to match the native
	// implementation. These are used when the native code is not available
	var defaults = {};
	
	defaults[MAX_DEPTH_PROPERTY] = DEFAULT_MAX_DEPTH;
	defaults[MAX_DEPTH_ACTION_PROPERTY] = Serialization.THROW_ACTION;
	defaults[DATE_SERIALIZATION_ACTION_PROPERTY] = Serialization.RETURN_OBJECT_ACTION;
	defaults[UNDEFINED_SERIALIZATION_ACTION_PROPERTY] = Serialization.NULLIFY_ACTION;
	defaults[SPECIAL_NUMBER_SERIALIZATION_ACTION_PROPERTY] = Serialization.NULLIFY_ACTION;
	
	function hasNativeJSON()
	{
		var window = getWindow();
		var result = false;
				
		if (window && "JSON" in window)
		{
			if ("stringify" in window.JSON)
			{
				result = true;
			}
		}
		
		return result;
	}
	
	Serialization.addSerializer(
		Serialization.NATIVE_JSON_METHOD,
		function(data, options)
		{
			if (hasNativeJSON())
			{
				return JSON.stringify(data);
			}
			else
			{
				return toCrockfordJSONString(data, defaults);
			}
		}
	);
	
	Serialization.addDeserializer(
		Serialization.NATIVE_JSON_METHOD,
		function(json, options)
		{
			if (hasNativeJSON())
			{
				return JSON.parse(json);
			}
			else
			{
				return fromCrockfordJSONString(json, defaults);
			}
		}
	);
})();

/*
 * BEGIN: Custom serialization handlers section
 */

// register Date serializer/deserializer
Serialization.addTypeHandler(
	"Date",
	function serializeDate(date)
	{
		// Format integers to have at least two digits.
		function pad(n)
		{
			return n < 10 ? '0' + n : n;
		}
	
		return date.getUTCFullYear() + '-' +
			pad(date.getUTCMonth() + 1) + '-' +
			pad(date.getUTCDate()) + 'T' +
			pad(date.getUTCHours()) + ':' +
			pad(date.getUTCMinutes()) + ':' +
			pad(date.getUTCSeconds());
	},
	function deserializeDate(serializedDate)
	{
		var match = serializedDate.match(DATE_PATTERN);
		var result = null;
						
		if (match !== null)
		{
			var win = getWindow();
			result = new win.Date(Date.UTC(match[1], match[2] - 1, match[3], match[4], match[5], match[6]));
		}
		
		return result;
	}
);

// register RegExp serializer/deserializer
Serialization.addTypeHandler(
	"RegExp",
	function serializeRegExp(regex)
	{
		return regex.toString();
	},
	function deserializeRegExp(serializedRegex)
	{
		// NOTE: Some browsers add custom regex flags. Since we can't know what
		// all of those might be at any given point in time, we allow any
		// character to serve as a flag as opposed to simply [img]
		var match = serializedRegex.match(/^\/(.+)\/([a-zA-Z]+)?$/);
		var result = serializedRegex;
		
		if (match !== null)
		{
			var win = getWindow();
			result = new win.RegExp(match[1], match[2]);
		}
		
		return result;
	}
);

// NOTE: If this is set to false, we won't bother trying to use the type handler
// client-side
var tryXMLDocument = true;

// register XMLDocument serializer/deserializer
Serialization.addTypeHandler(
	"XMLDocument",
	function serializeXMLDocument(doc)
	{
		var win = getWindow();
		var result = null;
		
		if (win.XMLSerializer) 
		{
			var serializer = new win.XMLSerializer();
			result = serializer.serializeToString(doc);
		}
		else
		{
			result = doc.xml;
		}
		
		return result;
	},
	function deserializeXMLDocument(xml)
	{
		var win = getWindow();
		var result = null;
		
		if (win.DOMParser) 
		{
			var parser = new win.DOMParser();
			result = parser.parseFromString(xml, "application/xml");
		}
		else if (win.ActiveXObject) 
		{
			try 
			{
				var doc = new win.ActiveXObject("Microsoft.XMLDOM");
				doc.async = false;
				doc.loadXML(xml);
				result = doc;
			} 
			catch (e) 
			{
				if (!Jaxer.isOnServer) tryXMLDocument = false;
			}
		}
		
		return result;
	},
	function canSerializeXMLDocument(data)
	{
		if (!Jaxer.isOnServer && !tryXMLDocument) return false;
		var win = getWindow(data);
		if (data && win.XMLSerializer && data.constructor == win.XMLDocument) return true;
		if (data && win.ActiveXObject && (typeof data.constructor == "undefined") && (typeof data.xml == "string")) return true;
		if (!Jaxer.isOnServer) tryXMLDocument = false;
		return false;
	},
	function canDeserializeXMLDocument(str)
	{
		if (!Jaxer.isOnServer && !tryXMLDocument) return false;
		var win = getWindow();
		if (win.DOMParser) return true;
		if (win.ActiveXObject) return true; // There's no way to know more without trying: if it turns out we can't actually deserialize, we'll find out the first time we try to do so. 
		if (!Jaxer.isOnServer) tryXMLDocument = false;
		return false;
	}
);

/*
 * END: Custom serialization handlers section
 */

// expose Serialization in Jaxer namespace
Jaxer.Serialization = Serialization;

if (Jaxer.isOnServer)
{
	frameworkGlobal.Serialization = Jaxer.Serialization;
}

})();

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Comm > XHR.js
 */

(function() {

// This is a server- and client-side, compressible module -- be sure to end each function declaration with a semicolon

var log = Jaxer.Log.forModule("XHR");

function getWindow()
{
	if (Jaxer.isOnServer)
	{
		return Jaxer.pageWindow || this.__parent__;
	}
	else
	{
		return window;
	}
};

/**
 * @namespace {Jaxer.XHR} Namespace to hold the Jaxer client-side cross-browser
 * wrapper around XMLHttpRequest.
 */
var XHR = {};

/**
 * The value of the "reason" property that indicates a timeout has occurred.
 * This property is set on the Error object that's thrown by XHR.send() during
 * synchronous requests that don't use the onsuccess function but rather just
 * return a response or throw an Error.
 * 
 * @advanced
 * @alias Jaxer.XHR.REASON_TIMEOUT
 * @property {String}
 */
XHR.REASON_TIMEOUT = "timeout";

/**
 * The value of the "reason" property that indicates a communication failure has
 * occurred. This property is set on the Error object that's thrown by
 * XHR.send() during synchronous requests that don't use the onsuccess function
 * but rather just return a response or throw an Error.
 * 
 * @advanced
 * @alias Jaxer.XHR.REASON_FAILURE
 * @property {String}
 */
XHR.REASON_FAILURE = "failure";

XHR.asyncRequests = {}; // Holds identifier codes for the pending async requests so you can call XHR.cancel() on them

/**
 * The default client-side function used to handle any errors that occur during
 * XMLHttpRequest processing by throwing an error describing them
 * 
 * @advanced
 * @alias Jaxer.XHR.onfailure
 * @param {Object} error
 * 		An error object describing the error, if one was thrown. Otherwise this
 * 		is null.
 * @param {Object} extra
 * 		Any extra information passed into Jaxer.XHR.send(), e.g. to make error
 * 		messages more informative.
 * @param {XMLHttpRequest} xhr
 * 		The XMLHttpRequest object that contains the information received from
 * 		the server,	e.g. in xhr.status and xhr.responseText. It may be null if
 * 		an error was encountered creating it.
 */
XHR.onfailure = function onfailure(error, extra, xhr)
{
	if (xhr) 
	{
		var status;
		try
		{
			status = xhr.status;
		}
		catch (e) {}
		throw new Error("XMLHttpRequest: Received status " + String(xhr.status) + " from the server\n" +
			"Response from server: " + xhr.responseText);
	}
	else if (error)
	{
		throw error;
	}
};

/**
 * The default client-side function used to handle any timeout errors that occur
 * during XMLHttpRequest processing by throwing an error describing them
 * 
 * @advanced
 * @alias Jaxer.XHR.ontimeout
 * @param {Error} timeout
 * 		The timeout error object encountered, having a "timeout" property with
 * 		its value indicating the timeout (in milliseconds) used in this request.
 * @param {Object} extra
 * 		Any extra information passed into Jaxer.XHR.send(), e.g. to make error
 * 		messages more informative.
 * @param {XMLHttpRequest} xhr
 * 		The XMLHttpRequest object that contains the information received from
 * 		the server, e.g. in xhr.status and xhr.responseText. It may be null if
 * 		an error was encountered creating it.
 */
XHR.ontimeout = function ontimeout(error, extra, xhr)
{
	throw new Error("XMLHttpRequest: Request timed out after " + (error.timeout/1000) + " seconds");
};

/**
 * Returns an XMLHttpRequest object by calling the platform-specific API for it.
 * On the server side of Jaxer, the XPCOM version of XMLHttpRequest is used.
 * 
 * @advanced
 * @alias Jaxer.XHR.getTransport
 * @return {XMLHttpRequest}
 */
XHR.getTransport = function getTransport()
{
	var xhr, e, win;
	win = getWindow();
	try
	{
		// On IE use the most common/standard ActiveX call to minimize version bugs/weirdnesses
		xhr = win.ActiveXObject ? new win.ActiveXObject("Microsoft.XMLHTTP") : new win.XMLHttpRequest();
	}
	catch (e) {} // May be needed on older versions of IE to prevent "automation error" notifications
	if (!xhr)
	{
		throw new Error("Could not create XMLHttpRequest" + (e ? '\n' + e : ''));
	}
	return xhr;
};

/**
 * The default function used to test whether the XMLHttpRequest got a successful
 * response or not, in particular using xhr.status, location.protocol and some
 * browser sniffing.
 * 
 * @advanced
 * @alias Jaxer.XHR.testSuccess
 * @param {XMLHttpRequest} xhr
 * 		The XMLHttpRequest object that got the response
 * @return {Boolean}
 * 		true if successful, false otherwise
 */
XHR.testSuccess = function testSuccess(xhr)
{
	var success = false;
	var win = getWindow();
	try
	{
		success =
			(!xhr.status && win.location && win.location.protocol == "file:") ||
			(xhr.status >= 200 && xhr.status < 300) || 
			(xhr.status == 304) ||
			(win.navigator && win.navigator.userAgent.match(/webkit/) && xhr.status == undefined);
	}
	catch(e) { }
	return success;
};

/**
 * The generic function used to send requests via XMLHttpRequest objects. Each
 * request gets its own XMLHttpRequest object, and async requests hold onto that
 * object until they're finished or timed out or canceled. On the server side of
 * Jaxer, only synchronous requests are supported.
 * <br><br>
 * For async requests, this returns a key that can be used to abort the request
 * via Jaxer.XHR.cancel().
 * <br><br>
 * For synchronous requests, returns the response of the server or throws an
 * exception if an error occurred, unless an onsuccess function was specified in
 * the options, in which case it passes the response to that function and also
 * handles any errors through the onfailure function if specified in the
 * options.
 * <br><br>
 * In any case, the response can be a text string or an XML DOM. To force one or
 * the other, set the "as" property on the options argument, e.g. if as="text"
 * it will definitely be a text string, if as="xml" it will definitely be an
 * XML DOM, and if as="e4x" it will be an E4X DOM (if E4X is supported -- 
 * which is always the case server-side but may not be client-side).
 * 
 * @alias Jaxer.XHR.send
 * @param {String} message
 * 		The message to send, usually as a query string
 * 		("name1=value&name2=value2...")
 * @param {Jaxer.XHR.SendOptions|Object} [options]
 * 		A JavaScript object (hashmap) of name: value property pairs specifying
 * 		how to handle this request.
 * @param {Object} extra
 * 		Any extra information that might be useful e.g. in the error handlers on
 * 		this request. This object is simply passed on to them if/when they're
 * 		called. E.g. Jaxer.Callback uses this information to pass the name of
 * 		the function being called remotely, so error messages can be more
 * 		informative.
 * @return {Object}
 * 		For async requests, a key to the XHR object; for synchronous requests
 * 		(with no onsuccess handler in the options), a text string or an XML DOM,
 * 		or an object containing detailed information about the response (if
 * 		the options specified extendedResponse=true)
 */
XHR.send = function send(message, options, extra)
{
	
	var win = getWindow();
	var xmlSerializer = (typeof win.XMLSerializer == "function") ? new win.XMLSerializer() : null;
	var e4xConstructor = (typeof win.XML == "function") ? win.XML : null;

	if (typeof message != "string")
	{
		if ((message == null) || (message == undefined) || (typeof message.toString != "function"))
		{
			message = '';
		}
		else
		{
			message = message.toString();
		}
	}
	options = options || {};
	var as = options.as || XHR.defaults.as || '';
	as = as.toLowerCase();
	var url = options.url || XHR.defaults.url || Jaxer.CALLBACK_URI;
	url = url.replace(/#.*$/, ''); // strip off any fragment
	var cacheBuster = (typeof options.cacheBuster == "undefined") ? XHR.defaults.cacheBuster : options.cacheBuster;
	if (cacheBuster) url += (url.match(/\?/) ? "&" : "?") + "_rnd" + ((new Date()).getTime()) + "=" + Math.random();
	var method = String(options.method || XHR.defaults.method || "GET").toUpperCase();
	if ((method == "GET") && (message != ''))
	{
		url += (url.match(/\?/) ? "&" : "?") + message;
		message = ''; // prevent submitting this twice in IE
	}
	var async = (typeof options.async == "undefined") ? XHR.defaults.async : options.async;
	var username = options.username || XHR.defaults.username || null;
	var password = options.password || XHR.defaults.password || null;
	var onsuccess = options.onsuccess || XHR.defaults.onsuccess;
	var onfailure = options.onfailure || XHR.defaults.onfailure;
	var onsslcerterror = options.onsslcerterror || XHR.defaults.onsslcerterror;
	var timeout = options.timeout || XHR.defaults.timeout || 0;
	var ontimeout = timeout ? (options.ontimeout || XHR.defaults.ontimeout) : null;
	var headers = options.headers || XHR.defaults.headers;
	var overrideMimeType = as ? ((as == 'xml' || as == 'e4x') ? 'application/xml' : 'text/plain') : options.overrideMimeType || XHR.defaults.overrideMimeType || null;
	var onreadytosend = options.onreadytosend || XHR.defaults.onreadytosend;
	var onfinished = options.onfinished || XHR.defaults.onfinished;
	var contentType = options.contentType || XHR.defaults.contentType;
	var testSuccess = options.testSuccess || XHR.defaults.testSuccess;
	if (typeof testSuccess != "function") testSuccess = XHR.testSuccess;
	var responseType = as ? ((as == 'xml' || as == 'e4x') ? as : 'text') : options.responseType || XHR.defaults.responseType || 'text';
	var extendedResponse = options.extendedResponse || XHR.defaults.extendedResponse;
	var pollingPeriod = options.pollingPeriod || XHR.defaults.pollingPeriod || 11;
	var getTransport = options.getTransport || XHR.defaults.getTransport;
	if (typeof getTransport != "function") getTransport = XHR.getTransport;

	var useOnFunctions = (typeof onsuccess == "function"); // otherwise, return a value or throw an error
	var error = null;

	var xhr = getTransport();
	
	// Open the transport:
	try
	{
		xhr.open(method, url, async, username, password);
	}
	catch (e)
	{
		error = new Error("xhr.open error: " + e + "\n\n" + "typeof xhr: " + (typeof xhr) + "\n\nparams: " + [method, url, async]);
		if (useOnFunctions) 
		{
			if (typeof onfailure == "function") onfailure(error, extra, xhr);
			return;
		}
		else 
		{
			throw error;
		}
	}
	
	// Get ready to send:
	if (headers && (typeof headers == "object")) // array or actual object
	{
		if (typeof headers.length == "number") // assume it's an array
		{
			for (var iHeader = 0, lenHeaders = headers.length; iHeader < lenHeaders; iHeader++) 
			{
				xhr.setRequestHeader(headers[iHeader][0], headers[iHeader][1]);
			}
		}
		else // assume it's an object of name => value pairs
		{
			for (var headerName in headers)
			{
				xhr.setRequestHeader(headerName, headers[headerName]);
			}
		}
	}
	else 
	{
		if (contentType != '') xhr.setRequestHeader("Content-Type", contentType);
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	}
	if (overrideMimeType && (typeof xhr.overrideMimeType == "function"))
	{
		xhr.overrideMimeType(overrideMimeType);
	}
	if (typeof onreadytosend == "function") onreadytosend(xhr, extra);
	
	// Get ready to receive: (modeled after jQuery)
	var finished = false;
	var pollId, asyncKey;
	var finish = function finish(cancelCode)
	{
		var response;
		if (!finished && xhr && ((xhr.readyState == 4) || (cancelCode == "timedout") || (cancelCode == "canceled")))
		{
			// prevent firing more than once
			finished = true; 

			// stop polling
			if (pollId)
			{
				asyncKey = 'id_' + pollId;
				win.clearInterval(pollId);
				delete XHR.asyncRequests[asyncKey];
			}
			
			var err = null;
			var msgIdentifier = (async ? "Asynchronous" : "Synchronous") + " request " +
				(asyncKey ? asyncKey + " " : "") + "to url " + url;
			
			if (cancelCode == "timedout")
			{
				log.trace(msgIdentifier + " timed out");
				err = new Error(msgIdentifier + " timed out");
				err.reason = XHR.REASON_TIMEOUT;
				err.timeout = timeout;
				if (useOnFunctions && (typeof ontimeout == "function")) 
				{
					ontimeout(err, extra, xhr);
				}
			}
			else if (cancelCode == "canceled")
			{
				log.trace(msgIdentifier + " canceled");
			}
			else
			{
				if (testSuccess(xhr)) // succeeded
				{
					var useXml;
					switch (responseType)
					{
						case "xml":
						case "e4x":
							useXml = true;
							break;
						case "auto":
							var autoType = "text";
							try 
							{
								autoType = xhr.getResponseHeader("content-type");
							} 
							catch (e) {}
							useXml = Boolean(autoType.match(/xml/i));
							break;
						default: // "text" and anything else
							useXml = false;
					}
					response = useXml ? xhr.responseXML : xhr.responseText;
					if (responseType == 'e4x' && xmlSerializer && e4xConstructor) 
					{
						var xmlRootString = xmlSerializer.serializeToString(response.documentElement);
						response = new e4xConstructor(xmlRootString);
					}
					var responseAsText = useXml ? xhr.responseText : response;
					log.trace(msgIdentifier + " received " + (useXml ? "XML" : "text") + " response: " +
						responseAsText.substr(0, 100) + (responseAsText.length > 100 ? '...' : ''));
					if (extendedResponse)
					{
						var responseHeadersString = xhr.getAllResponseHeaders();
						var responseHeaders = {};
						if (responseHeadersString)
						{
							responseHeadersString.split(/[\r\n]+/).forEach(function (headerString)
							{
								var matchedHeaders = /^([^\:]+)\: (.*)$/.exec(headerString);
								if (matchedHeaders && matchedHeaders.length == 3) 
								{
									var headerName = matchedHeaders[1];
									var headerValue = matchedHeaders[2];
									if (headerName in responseHeaders)
									{
										if (typeof responseHeaders[headerName] == "string")
										{
											responseHeaders[headerName] = [responseHeaders[headerName], headerValue];
										}
										else
										{
											responseHeaders[headerName].push(headerValue);
										}
									}
									else
									{
										responseHeaders[headerName] = headerValue;
									}
								}
							});
						}
						var setCookieHeaders = responseHeaders["Set-Cookie"];
						var setCookieStrings = setCookieHeaders ? (typeof setCookieHeaders == "string" ? [setCookieHeaders] : setCookieHeaders) : [];
						response = new XHR.ResponseData({
							  response: response
							, text: xhr.responseText
							, xml: xhr.responseXML
							, xhr: xhr
							, extra: extra
							, headers: responseHeaders
							, status: xhr.status
							, statusText: xhr.statusText
							, cookies: Jaxer.Util.Cookie.parseSetCookieHeaders(setCookieStrings)
							, certInfo: certInfo
						});
					}
					if (useOnFunctions) 
					{
						onsuccess(response, extra);
					}
				}
				else  // failed
				{
					log.trace(msgIdentifier + " failed");
					err = new Error(msgIdentifier + " failed");
					err.reason = XHR.REASON_FAILURE;
					err.status = xhr.status;
					if (useOnFunctions && (typeof onfailure == "function")) 
					{
						onfailure(err, extra, xhr);
					}
				}
			}
			
			// finish and clean up
			if (typeof onfinished == "function") onfinished(xhr, cancelCode, extra);
			pollId = asyncKey = xhr = url = undefined;
			
			if (!useOnFunctions && err) 
			{
				throw err;
			}
		}
		
		if (!useOnFunctions) return response;
	};

	// For async requests, look for received data, and timeout if requested and needed
	if (async)
	{
		// Poll for receiving data, instead of subscribing to onreadystatechange - modeled after jQuery
		pollId = win.setInterval(finish, pollingPeriod);
		asyncKey = 'id_' + pollId;
		XHR.asyncRequests[asyncKey] = {url: url, message: message, timeout: timeout, timestamp: new Date(), finish: finish};
		
		if (timeout)
		{
			win.setTimeout(function xhrTimeout()
				{
					if (!xhr) return; 					// we've already finished
					xhr.abort();						// otherwise, abort
					if (!finished) finish("timedout");	// and finish with a timeout if we haven't already finished
				}, timeout);
		}
	}

	// Handle SSL certificate errors -- server-side only
	var certInfo = null;
	if (Jaxer.isOnServer)
	{
		xhr.onsslcerterror = function(socketInfo, sslStatus, targetSite)
		{
			var cert = sslStatus.serverCert; /* nsIX509Cert */
			certInfo = new Util.Certificate.CertInfo(socketInfo, sslStatus, targetSite);
			var ignore = false; // by default, we abort on SSL errors
			if (typeof onsslcerterror == "function")
			{
				ignore = onsslcerterror(certInfo, cert, socketInfo, sslStatus, targetSite);
			}
			return ignore; // true - ignore, false - abort
		}
	}
	
	// Now actually send the request
	log.trace("Sending " + (async ? "asynchronous " : "synchronous ") + method +
		" request to url " + url + " with " + (message == '' ? "no data" : "data: " + message));
	xhr.send((message == '') ? null : message);
	log.trace("Sent");
	
	if (async) // For async requests, return an id by which requests may be aborted or prematurely timed out
	{
		log.trace("Response will be received asynchronously with key: " + asyncKey);
		return asyncKey;
	}
	else // And for synchronous requests, force the receiving. Timeout is not possible.
	{
		var response = finish(false);
		if ((typeof(response) == "object") && ("documentElement" in response))
		{
			var docElement = response.documentElement;
			if (docElement && docElement.nodeName == "parsererror")
			{
				error = new Error("Error reading returned XML: " + docElement.firstChild.data + "\nXHR params: " + [method, url, async]);
				if (useOnFunctions) 
				{
					if (typeof onfailure == "function") onfailure(error, extra, xhr);
				}
				else 
				{
					throw error;
				}
			}
		}
		if (!useOnFunctions)
		{
			return response;
		}
	}
	
};

/**
 * Cancels the pending async XMLHttpRequest if its response has not yet been
 * received and if it has not yet timed out.
 * 
 * @alias Jaxer.XHR.cancel
 * @param {Number} asyncKey
 * 		The key that Jaxer.XHR.send() returned when the request was created.
 * @return {Boolean}
 * 		true if the request was found and canceled, false if it was not found 
 * 		(i.e. was not in the pending queue)
 */
XHR.cancel = function cancel(asyncKey)
{
	if (typeof XHR.asyncRequests[asyncKey] != "undefined")
	{
		log.trace("Canceling request " + asyncKey);
		XHR.asyncRequests[asyncKey].finish("canceled");
		return true;
	}
	else
	{
		return false; // nothing to cancel
	}
};

/**
 * @classDescription {Jaxer.XHR.ResponseData} A hashmap containing detaild information
 * about the response from an XHR.send.
 */

/**
 * A hashmap containing detailed information about the response from an XHR.send.
 * This is returned as the response of XHR.send when the SendOptions specify
 * extendedResponse=true.
 * 
 * @constructor
 * @alias Jaxer.XHR.ResponseData
 * @return {Jaxer.XHR.ResponseData}
 * 		Returns an instance of ResponseData.
 */
XHR.ResponseData = function ResponseData(values)
{
	/**
	 * The responseText string or responseXML XMLDocument of the response,
	 * depending on the SendOptions and the returned content type
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.response
	 * @property {Object}
	 */
	this.response = values.response;
	
	/**
	 * The responseText of the response, or null if none
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.text
	 * @property {String}
	 */
	this.text = values.text;
	
	/**
	 * The responseXML of the response, or null if none
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.xml
	 * @property {XMLDocument}
	 */
	this.xml = values.xml;
	
	/**
	 * The XMLHttpRequest object used in the request-response
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.xhr
	 * @property {XMLHttpRequest}
	 */
	this.xhr = values.xhr;
	
	/**
	 * Information about the SSL certificate used in this request-response.
	 * This is only available server-side.
	 * NOTE: currently this is only available when an SSL certificate error
	 * was encountered, and the onsslcerterror function was set and
	 * returned true.
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.certInfo
	 * @property {Jaxer.Util.Certificate.CertInfo}
	 * @see Jaxer.XHR.SendOptions.prototype.onsslcerterror
	 */
	this.certInfo = values.certInfo;
	
	/**
	 * The value of the "extra" parameter, if any, passed into XHR.send.
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.extra
	 * @property {Object}
	 */
	this.extra = values.extra;
	
	/**
	 * A hashmap containing properties corresponding to the names of the
	 * response headers. For each property, if the header name was present
	 * multiple times in the response, the value of the property is an
	 * array of the corresponding header values; otherwise, the value
	 * of the property is the value of the header.
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.headers
	 * @property {Object}
	 */
	this.headers = values.headers;
	
	/**
	 * The HTTP status code of the response (e.g. 200)
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.status
	 * @property {Number}
	 */
	this.status = values.status;
	
	/**
	 * The HTTP status text of the response (e.g. "OK")
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.statusText
	 * @property {String}
	 */
	this.statusText = values.statusText;
	
	/**
	 * An array of cooky directives indicated in the response via the
	 * "Set-Cookie" header. Each cookie is represented by
	 * an object with properties corresponding to its 
 	 * name, value, expires, path, and domain.
	 *
	 * @see Jaxer.Util.Cookie.parseSetCookieHeaders
	 * @alias Jaxer.XHR.ResponseData.prototype.cookies
	 * @property {Array}
	 */
	this.cookies = values.cookies;
	
};

/**
 * @classDescription {Jaxer.XHR.SendOptions} Options used to define the behavior
 * of Jaxer.XHR.send.
 */

/**
 * Options used to define the behavior of Jaxer.XHR.send. Create a new Jaxer.XHR.SendOptions()
 * to get the default options, then modify its properties as needed before
 * passing it to Jaxer.XHR.send.
 * 
 * @constructor
 * @alias Jaxer.XHR.SendOptions
 * @return {Jaxer.XHR.SendOptions}
 * 		Returns an instance of SendOptions.
 */
XHR.SendOptions = function SendOptions()
{
	/**
	 * The URL to which the XMLHttpRequest is to be sent. On the client side,
	 * defaults to Jaxer.CALLBACK_URI which is used to handle function callbacks
	 * from client-side proxies to their server-side counterparts.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.url
	 * @property {String}
	 */
	this.url = Jaxer.CALLBACK_URI;
	
	/**
	 * If true (default, client-side), a random name and value query pair will be appended to
	 * the URL on each call
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.cacheBuster
	 * @property {Boolean}
	 */
	this.cacheBuster = Jaxer.isOnServer ? false : true;
	
	/**
	 * Should be "GET" (default, server-side) or "POST" (default, client-side)
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.method
	 * @property {String}
	 */
	this.method = Jaxer.isOnServer ? "GET" : "POST";
	
	/**
	 * Set to true for asynchronous, false for synchronous. By default it's
	 * true client-side and false server-side. To use it server-side, see also
	 * Jaxer.Thread.waitFor.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.async
	 * @property {Boolean}
	 * @see Jaxer.Thread.waitFor
	 */
	this.async = Jaxer.isOnServer ? false : true;
	
	/**
	 * If the target URL requires authentication, specify this username, 
	 * otherwise leave this as null.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.username
	 * @property {String}
	 */
	this.username = null;
	
	/**
	 * If the target URL requires authentication, specify this password, 
	 * otherwise leave this as null.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.password
	 * @property {String}
	 */
	this.password = null;
	
	/**
	 * Set to a function to call if successful. Its arguments are the response
	 * received back from the server, and any "extra" information passed in when
	 * calling send(). For synchronous calls, you can optionally set onsuccess
	 * to null to have XHR.send() return a value directly (and throw errors on
	 * failure/timeout).
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.onsuccess
	 * @property {Function}
	 */
	this.onsuccess = null;
	
	/**
	 * Set to a custom callback function to call if unsuccessful (by default set
	 * to Jaxer.XHR.onfailure client-side). Its arguments are the error
	 * encountered, the "extra" information from the caller, and the XHR
	 * instance.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.onfailure
	 * @property {Function}
	 */
	this.onfailure = Jaxer.isOnServer ? null : XHR.onfailure;
	
	/**
	 * Set to a custom callback function to call if an SSL request fails
	 * due to a certificate error. Its arguments are the certInfo (an object
	 * containing properties describing the certificate and its status), the
	 * cert, and the XHR's socketInfo,
	 * sslStatus, and targetSite. It should return true to ignore the error,
	 * or false to abort the request. This is only available server-side.
	 * If (and only if) this is set to a function that returns true, 
	 * information about the failure can be retrieved from the extended 
	 * response's certInfo property.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.onsslcerterror
	 * @property {Function}
	 * @see Jaxer.XHR.ResponseData.prototype.certInfo
	 * @see Jaxer.Util.Certificate.CertInfo
	 */
	this.onsslcerterror = null;
	
	/**
	 * For async (client-side) requests, set to number of milliseconds before
	 * timing out, or 0 to wait indefinitely
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.timeout
	 * @property {Number}
	 * @see Jaxer.XHR.defaults.timeout
	 * @see Jaxer.XHR.SendOptions.DEFAULT_TIMEOUT
	 */
	this.timeout = XHR.SendOptions.DEFAULT_TIMEOUT;
	
	/**
	 * Set to a custom timeout function to call if timeout is used and the async
	 * request has timed out. Its arguments are the timeout error encountered, 
	 * the "extra" information from the caller, and the XHR instance.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.ontimeout
	 * @property {Function}
	 */
	this.ontimeout = null;
	
	/**
	 * Set to null to use default headers; set to an array of [name, value]
	 * arrays to use custom headers instead, or to an object containing
	 * properties to use as the headers
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.headers
	 * @property {Object|Array}
	 */
	this.headers = null;
	
	/**
	 * Set to "text" to force interpreting the response as text regardless of
	 * mimetype. Set to "xml" to force interpreting the response as XML
	 * regardless of mimetype and returning the XML as an XML (DOM) object via
	 * XMLHttpRequest.responseXML. Set to null to not force anything - see
	 * overrideMimeType and responseType for finer control.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.as
	 * @property {String}
	 */
	this.as = null;
	
	/**
	 * Set to null to use whatever mimetype the server sends in the response;
	 * set to a mimetype string (e.g. "text/plain") to force the response to be
	 * interpreted using the given mimetype
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.overrideMimeType
	 * @property {String}
	 */
	this.overrideMimeType = null;
	
	/**
	 * Set to a custom function to call just before sending (e.g. to set custom
	 * headers, mimetype, keep reference to xhr object, etc.)
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.onreadytosend
	 * @property {Function}
	 */
	this.onreadytosend = null;
	
	/**
	 * Set to a custom function to call when done receiving (or timed out),
	 * usually to abort()
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.onfinished
	 * @property {Function}
	 */
	this.onfinished = null;
	
	/**
	 * The content type of the request being sent (by default
	 * "application/x-www-form-urlencoded")
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.contentType
	 * @property {String}
	 */
	this.contentType = "application/x-www-form-urlencoded";
	
	/**
	 * If this is set to true, the response returned directly
	 * or passed to an onsuccess handler will contain detailed
	 * information about the response, in the form of a
	 * Jaxer.XHR.ResponseData object.
	 * 
	 * @see Jaxer.XHR.ResponseData
	 * @alias Jaxer.XHR.SendOptions.extendedResponse
	 * @property {Boolean}
	 */
	this.extendedResponse = false;
	
	/**
	 * Set to a custom function that receives the XMLHttpRequest (after
	 * readyState == 4) and tests whether it succeeded (by default
	 * Jaxer.XHR.testSuccess)
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.testSuccess
	 * @property {Function}
	 */
	this.testSuccess = XHR.testSuccess;
	
	/**
	 * Set to "text" (default) to use the responseText, to "xml" to use the
	 * responseXML, or "auto" to use the response's content-type to choose
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.responseText
	 * @property {String}
	 */
	this.responseType = "text";
	
	/**
	 * For async requests, the number of milliseconds between
	 * polling for onreadystatechange, by default 11
	 *
	 * @advanced
	 * @alias Jaxer.XHR.SendOptions.prototype.pollingPeriod
	 * @property {Number}
	 */
	this.pollingPeriod = 11;
	
	/**
	 * The function to use to create the XMLHttpRequest, by default
	 * XHR.getTransport
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.getTransport
	 * @property {Function}
	 */
	this.getTransport = XHR.getTransport;
};

/**
 * The default value to use when creating new Jaxer.XHR.SendOptions() objects,
 * in milliseconds. It's only used for async requests.
 * It defaults to 30 seconds (30000) on the server, and 0 on the client.
 * 0 means no timeout.
 * 
 * NOTE: To set the the default timeout to use when creating new XHR()s
 * (i.e. XMLHttpRequests), set Jaxer.XHR.defaults.timeout instead.
 * 
 * @alias Jaxer.SendOptions.DEFAULT_TIMEOUT
 * @property {Number}
 */
XHR.SendOptions.DEFAULT_TIMEOUT = Jaxer.isOnServer ? 30000 : 0;

/**
 * The default SendOptions which new calls to Jaxer.XHR.send(message, options,
 * extra) will use, unless overridden by the options argument. This is slightly
 * different for client-side and server-side requests (e.g. server-side requests
 * are by default synchronous).
 * 
 * @alias Jaxer.XHR.defaults
 * @property {Jaxer.XHR.SendOptions}
 */
XHR.defaults = new XHR.SendOptions();

/**
 * The default value to use when creating new Jaxer.XHR (XMLHttpRequest) requests,
 * in milliseconds. This also applies to anything that uses XHRs, such as Jaxer.Web.get.
 * It's only used for async requests.
 * It defaults to 30 seconds (30000) on the server, and 0 on the client.
 * 0 means no timeout.
 * 
 * NOTE: To set the the default timeout to use when creating new XHR.SendOptions()
 * objects, set Jaxer.XHR.SendOptions.timeout instead.
 * 
 * @alias Jaxer.defaults.timeout
 * @property {Number}
 */

Jaxer.XHR = XHR;

})();

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Comm > Callback.js
 */

(function(){
	
// This is a client-side, compressible module -- be sure to end each function declaration with a semicolon

var log = Jaxer.Log.forModule("Callback");
	
// private constants
var EXCEPTION = "exception";
var IS_CLIENT_ERROR = "isClientError";
var CLIENT_ERROR_OPTIONS = "options";
var CLIENT_ERROR_INFO = "info";
var CLIENT_ERROR_WRAPPED = "wrapped";
var PAGE_SIGNATURE = "pageSignature";
var PAGE_NAME = "pageName";
var CALLING_PAGE = "callingPage";
var METHOD_NAME = "methodName";
var NAME = "name";
var MESSAGE = "message";
var PARAMS = "params";
var RETURN_VALUE = "returnValue";
var UID = "uid";

// create placeholder for Callback

/**
 * @namespace {Jaxer.Callback} Callback namespace for remote functions.
 */
var Callback = {};

/**
 * The default HTTP method to use for callback function requests. Initially set
 * to "POST".
 * 
 * @alias Jaxer.Callback.METHOD
 * @property {String}
 */
Callback.METHOD = "POST";

/**
 * The default number of milliseconds to wait before timing out an async
 * callback function request. Initially set to 10 * 1000 (10 seconds).
 * 
 * @alias Jaxer.Callback.TIMEOUT
 * @property {Number}
 */
Callback.TIMEOUT = 10 * 1000;

/**
 * The default polling interval used to see whether the XMLHttpRequest for an
 * async callback function call has returned. Initially set to 11.
 * 
 * @advanced
 * @alias Jaxer.Callback.POLLING_PERIOD
 * @property {Number}
 */
Callback.POLLING_PERIOD = 11;

/**
 * Creates a query string for calling a remote function with the given arguments
 * 
 * @alias Jaxer.Callback.createQuery 
 * @param {String} functionName
 * 		The name of the remote function
 * @param {Object} args
 * 		The arguments of the remote function. This can be a single (primitive)
 * 		object or an array of (primitive) objects
 * @param {Number} [initialNumberToSkip]
 * 		Optionally, how many of the arguments (counting from the beginning) to
 * 		not pass to the remote function
 * @return {String}
 * 		The query string
 */
Callback.createQuery = function createQuery(functionName, args, initialNumberToSkip)
{
	// move Arguments into a real Javascript Array
	var argsArray = [];
	initialNumberToSkip = initialNumberToSkip || 0;
	
	for (var i=initialNumberToSkip; i<args.length; i++)
	{
		argsArray.push(args[i]);
	}
	
	var queryParts = Callback.getQueryParts(functionName, argsArray);
	return Callback.hashToQuery(queryParts);
};

/**
 * Converts a javascript object (hash) into a http query string.
 * 
 * @alias Jaxer.Callback.hashToQuery
 * @param {Object} hash
 * 		Hash of name value pairs to be converted.
 * @return {String}
 * 		The query string
 */
Callback.hashToQuery = function hashToQuery(hash)
{
	var queryStrings = [];
	
	for (var p in hash)
	{
		var name = Callback.formUrlEncode(p);
		var value = ((typeof hash[p] == "undefined") || (hash[p] == null) || (typeof hash[p].toString != "function")) ? "" : Callback.formUrlEncode(hash[p].toString());
		
		queryStrings.push([name, value].join("="));
	}
	
	return queryStrings.join("&");
};

/**
 * URL Encode a query string.
 * 
 * @alias Jaxer.Callback.formUrlEncode
 * @param {String} str
 * 		Query string to be converted.
 * @return {String}
 * 		A URL-encoding string
 */
Callback.formUrlEncode = function formUrlEncode(str)
{
	return encodeURIComponent(str);
};

/**
 * Transforms the raw result data from the XHR call into the expected data
 * format.
 * 
 * @advanced
 * @alias Jaxer.Callback.processReturnValue
 * @param {String} functionName
 * 		The name of the function that was called
 * @param {String} rawResult
 * 		The raw (text) data returned from the XHR call
 * @return {Object}
 * 		The returned data in the format the remote function returned it
 */
Callback.processReturnValue = function processReturnValue(functionName, rawResult)
{
	log.trace("Received for function " + functionName + ": rawResult = " + rawResult.substr(0, 100) + (rawResult.length > 100 ? '...' : ''));
	try
	{
		var content = Jaxer.Serialization.fromJSONString(rawResult, {as: Jaxer.Serialization.JAXER_METHOD});
	}
	catch (e)
	{
		var desc, showError, likelyServerError;
		if (e.name == Jaxer.Serialization.JSONSyntaxErrorName) 
		{
			desc = "Received a response with an unexpected (non-JSON) syntax";
			showError = false;
			likelyServerError = true;
		}
		else if (e.name == Jaxer.Serialization.JSONEvalErrorName)
		{
			desc = "Error when evaluating the JSON-like response received from the server";
			showError = true;
			likelyServerError = true;
		}
		else
		{
			desc = "Error when processing the JSON response received from the server";
			showError = true;
			likelyServerError = false;
		}
		e.message = 
			desc + " " +
			"while calling server function '" + functionName + "'.\n\n" +
			(showError ? "Error: " + e + "\n\n" : "") +
			"Response:\n" + rawResult.substr(0, 200) + ((rawResult.length > 200) ? "..." : "") +
			(likelyServerError ? "\n\n(Perhaps an error occured on the server?)" : "");
		if (Jaxer.ALERT_CALLBACK_ERRORS)
		{
			alert(e.message);
		}
		throw e;
	}
	
	var result = null;

	if (content !== null && content != undefined)
	{
		if (content.hasOwnProperty(EXCEPTION))
		{
			var eFromServer, eToClient;
			
			if (content[EXCEPTION]) 
			{
				if (content[IS_CLIENT_ERROR]) 
				{
					var clientError = content[EXCEPTION];
					var clientErrorOptions = clientError[CLIENT_ERROR_OPTIONS];
					var clientErrorInfo = clientError[CLIENT_ERROR_INFO];
					if (clientErrorOptions && 
						(CLIENT_ERROR_WRAPPED in clientErrorOptions) && 
							!clientErrorOptions[CLIENT_ERROR_WRAPPED])
					{
						eFromServer = clientErrorInfo;
					}
					else
					{
						var clientErrorMessage = (clientErrorInfo && (clientErrorInfo.message)) ? String(clientErrorInfo.message) : String(clientErrorInfo);
						eFromServer = new Error(clientErrorMessage);
						if (clientErrorInfo && (typeof clientErrorInfo == "object") )
						{
							for (var p in clientErrorInfo) 
							{
								eFromServer[p] = clientErrorInfo[p];
							}
						}
					}
				}
				else 
				{
					eFromServer = content[EXCEPTION];
				}
			}
			else
			{
				eFromServer = "Unspecified server error";
			}
			
			if (eFromServer.hasOwnProperty(NAME))
			{
				var eName = eFromServer[NAME];
				
				try
				{
					eToClient = new window[eName];
								
					for (var p in eFromServer)
					{
						eToClient[p] = eFromServer[p];
					}
				}
				catch(e)
				{
					eToClient = eFromServer;
				}
			}
			else
			{
				eToClient = eFromServer;
			}
			
			if (typeof eToClient.toString != "function")
			{
				eToClient.toString = function toString()
				{
					var name = eToClient.hasOwnProperty(NAME) ? eToClient[NAME] : "server error";
					var message = eToClient.hasOwnProperty(MESSAGE) ? eToClient[MESSAGE] : "(unspecified)";
					return [name, message].join(": ");
				}
			}
			
			if (Jaxer.ALERT_CALLBACK_ERRORS)
			{
				alert("The server function '" + functionName + "' returned an error: " + 
					((typeof eToClient.message == "undefined") ? eToClient.toString() : eToClient.message));
			}
			
			throw eToClient;
		}
		else if (content.hasOwnProperty(RETURN_VALUE))
		{
			result = content[RETURN_VALUE];
		}
		else
		{
			result = undefined;
		}
	}
	
	return result;
};

/**
 * The default method used to handle errors when calling remote functions
 * asynchronously. It alerts the error message if Jaxer.ALERT_CALLBACK_ERRORS is
 * true, and in any case throws an error
 * 
 * @advanced
 * @alias Jaxer.Callback.onfailureAsync
 * @param {Object} error
 * 		If an error was thrown during the request, it would be here.
 * @param {Object} extra
 * 		Any extra information passed in during the call to Jaxer.XHR.send() to
 * 		help identify the request. Currently, there is one String-valued
 * 		property on this object: functionName. 
 * @param {XMLHttpRequest} xhr
 * 		The XMLHttpRequest object that encountered the error. This might be
 * 		null, if an error was encountered in creating the XMLHttpRequest.
 */
Callback.onfailureAsync = function onfailure(error, extra, xhr)
{
	var message = "Error while contacting server to (asynchronously) call server function '" + extra.functionName + "':\n";
	if (xhr) 
	{
		var status;
		try
		{
			status = xhr.status;
		}
		catch (e) {}
		message += "Received status " + String(xhr.status) + " from the server\n" +
			"Response from server: " + xhr.responseText;
	}
	else if (error)
	{
		message += error;
	}
	if (Jaxer.ALERT_CALLBACK_ERRORS)
	{
		alert(message);
	}
	throw new Error(message);
};

/**
 * The default method used to handle timeouts when calling remote functions
 * asynchronously. It alerts the error message if Jaxer.ALERT_CALLBACK_ERRORS is
 * true, and in any case throws an error
 * 
 * @advanced
 * @alias Jaxer.Callback.ontimeoutAsync
 * @param {Error} error
 * 		The timeout error object encountered, having a "timeout" property with
 * 		its value indicating the timeout (in milliseconds) used in this request.
 * @param {Object} extra
 * 		Any extra information passed in during the call to Jaxer.XHR.send() to
 * 		help identify the request. Currently, there is one String-valued
 * 		property on this object: functionName. 
 * @param {XMLHttpRequest} xhr
 * 		The XMLHttpRequest object that encountered the error.
 */
Callback.ontimeoutAsync = function ontimeout(error, extra, xhr)
{
	var message = "Error while contacting server to (asynchronously) call server function '" + extra.functionName + "':\n";
	message += "Request timed out after " + (error.timeout/1000) + " seconds";
	if (Jaxer.ALERT_CALLBACK_ERRORS)
	{
		alert(message);
	}
	throw new Error(message);
};

/**
 * This method invokes an asynchronous call to a proxied javascript function on
 * the server from the client side javascript. A callback function needs to be
 * provided and is called once the XHR request completes or times out.
 * 
 * @alias Jaxer.Callback.invokeFunctionAsync
 * @param {Object} callback
 * 		If this is a function, this is the function to call upon a successful
 * 		return from the remote invocation. Its arguments are what the remote
 * 		function on the server returned.
 * 		<br><br>
 * 		If this is an array, its elements are as follows (each may be null):
 * 		<ol>
 * 			<li>
 * 				the callback function;
 *			</li>
 * 			<li>
 * 				a function to call on an error, with arguments being the error,
 * 				the "extra" information object that has the functionName as its
 * 				one property, and the XMLHttpRequest object used for the call if
 * 				the call itself encountered an error;
 * 			</li>
 * 			<li>
 * 				the timeout to use, in milliseconds (defaults to
 * 				Jaxer.Callback.TIMEOUT). Use 0 to wait indefinitely.</li>
 * 		</ol> 
 * 		<br><br>
 * 		If this is an object, its "callback", "errorHandler", and timeout
 * 		properties will be used, if any.
 * @param {String} functionName
 * 		The name of the remote function
 * @param {Object} args
 * 		A single argument, or an array of arguments, to be passed to the remote
 * 		function on the server
 */
Callback.invokeFunctionAsync = function invokeFunctionAsync(callback, functionName, args)
{
	var message = Callback.createQuery(functionName, args, 1); // skip encoding the callback itself
	log.trace("Invoking function " + functionName + " asynchronously with arguments encoded as: " + message);
	
	var extra = {functionName: functionName}; // this will be passed back to error handling methods
	
	var callbackFunction, errorHandler, timeout;
	if (typeof callback == "function")
	{
		callbackFunction = callback;
	}
	else if (typeof callback == "object")
	{
		if (typeof callback.length == "number") // assume it's array-like
		{
			callbackFunction = (callback.length > 0 && typeof callback[0] == "function") ? callback[0] : undefined;
			if (callback.length > 1 && typeof callback[1] == "function") errorHandler = callback[1];
			if (callback.length > 2 && typeof callback[2] == "number") timeout = callback[2];
		}
		else
		{
			callbackFunction = (typeof callback["callback"] == "function") ? callback["callback"] : undefined;
			if (typeof callback["errorHandler"] == "function") errorHandler = callback["errorHandler"];
			if (typeof callback["timeout"] == "number") timeout = callback["timeout"];
		}
	}
	
	var onsuccess = function onsuccess(rawResult, extra)
	{
		try
		{
			var processedResult = Callback.processReturnValue(functionName, rawResult);
			if (callbackFunction)
			{
				callbackFunction(processedResult);
			}
		}
		catch (e) // to do something meaningful with async exceptions, you'll need an errorHandler
		{
			if (errorHandler)
			{
				errorHandler(e, extra);
			}
		}
	};

	var options = 
	{
		url: Jaxer.CALLBACK_URI,
		cacheBuster: false,
		method: Callback.METHOD,
		async: true,
		onsuccess: onsuccess,
		onfailure: errorHandler || Callback.onfailureAsync,
		timeout: (typeof timeout == "number") ? timeout : Callback.TIMEOUT,
		ontimeout: errorHandler || Callback.ontimeoutAsync,
		headers: null,
		onreadytosend: null,
		onfinished: null,
		contentType: "application/x-www-form-urlencoded",
		testSuccess: Jaxer.XHR.testSuccess,
		as: "text",
		pollingPeriod: Callback.POLLING_PERIOD
	};

	var pollId = Jaxer.XHR.send(message, options, extra);
	
	return pollId;
	
};

/**
 * This method invokes a synchronous call to a proxied JavaScript function on
 * the server from the client side javascript.
 * 
 * @alias Jaxer.Callback.invokeFunction
 * @param {String} functionName
 * 		The name of the remote function to call on the server
 * @param {Object} args
 * 		A single argument, or an array of arguments, to be passed to the remote
 * 		function on the server
 * @return {Object}
 * 		The value returned by the remote function on the server
 */
Callback.invokeFunction = function invokeFunction(functionName, args)
{
	var message = Callback.createQuery(functionName, args);
	log.trace("Invoking function " + functionName + " synchronously with arguments encoded as: " + message);
	
	var extra = {functionName: functionName}; // this will be passed back to error handling methods
	
	var options = 
	{
		url: Jaxer.CALLBACK_URI,
		cacheBuster: false,
		method: Callback.METHOD,
		async: false,
		onsuccess: null, // we'll use the return value of XHR.send() and any errors it throws
		onfailure: null,
		timeout: Callback.TIMEOUT,
		ontimeout: null,
		headers: null,
		onreadytosend: null,
		onfinished: null,
		contentType: "application/x-www-form-urlencoded",
		testSuccess: Jaxer.XHR.testSuccess,
		as: "text",
		pollingPeriod: Callback.POLLING_PERIOD
	};
	
	try
	{
		var response = Jaxer.XHR.send(message, options, extra);
	}
	catch (e)
	{
		if (Jaxer.ALERT_CALLBACK_ERRORS)
		{
			alert("Error while contacting server to call server function '" + functionName + "': " + e);
		}
		throw e;
	}
	
	return Callback.processReturnValue(functionName, response);
};

/**
 * Returns the URL that can be used as a GET request to call a JavaScript
 * function on the server. 
 * <br><br>
 * The server listens for two special properties: "resultAs" and "paramsAs". 
 * <br><br>
 * If present, resultAs specifies how the result of functionToCall is to be
 * returned to the client. Valid values for resultAs are "text", "object", and
 * "wrappedObject" (default), which return the result of the callback as a
 * single string, JSON object literal, or JSON object literal with metadata,
 * respectively. 
 * <br><br>
 * If present, "paramsAs" specifies how the request is to be translated into
 * arguments for the functionToCall. Valid values for "paramsAs" are "text",
 * "object", and "default", which hands the GET or POST data to functionToCall
 * as a single string, a single hash (object literal) of name-value pairs, or as
 * regular JavaScript arguments with values extracted from paramsToPass,
 * respectively.
 * 
 * @alias Jaxer.Callback.getUrl
 * @param {Object}	functionToCall 
 * 		Name of the function (or the function itself) to call server-side
 * @param {Object}	paramsToPass 
 * 		An array of parameters (or the single parameter) to pass to the function
 * @param {String, Object} ...
 * 		Optional parameter(s) to append to the end of the URL as part of the
 * 		query string. Strings will be appended to the end of the URL separated
 * 		by a "&". Hashes will be appended as &name1=value&name2=value2...
 * @return {String}
 * 		The URL that can be called (via a GET) to invoke the function
 */
Callback.getUrl = function getUrl()
{
	var queryParts = Callback.getQueryParts.apply(this, arguments);
	return (Callback.getBaseUrl() + "?" + Callback.hashToQuery(queryParts));
};

/**
 * Returns the URL for use in callbacks, without any parameters
 * 
 * @advanced
 * @alias Jaxer.Callback.getBaseUrl
 * @return {String}
 * 		The URL to GET or POST to
 */
Callback.getBaseUrl = function getBaseUrl()
{
	return Jaxer.CALLBACK_URI;
};

/**
 * Returns a hash of the "form-like" name-value pairs needed to call a
 * JavaScript function on the server. These can be submitted to the server as a
 * GET request (but see Callback.getUrl which wraps this in a Url for you) or as
 * a POST request, and usually via an XMLHttpRequest mechanism.
 * <br><br>
 * The server listens for two special name-value pairs: "resultAs" and
 * "paramsAs". 
 * <br><br>
 * If present, resultAs specifies how the result of functionToCall is to be
 * returned to the client. Valid values for resultAs are "text", "object", and
 * "wrappedObject" (default), which return the result of the callback as a
 * single string, a JSON object literal, or a JSON object literal with metadata,
 * respectively. 
 * <br><br>
 * If present, "paramsAs" specifies how the request is to be translated into
 * arguments for the functionToCall. Valid values for "paramsAs" are "text",
 * "object", and "default", which hands the GET or POST data to functionToCall
 * as a single string, a single hash (object literal) of name-value pairs, or as
 * regular JavaScript arguments with values extracted from paramsToPass,
 * respectively.
 * 
 * @alias Jaxer.Callback.getQueryParts
 * @param {Object} functionToCall
 * 		Name of the function (or the function itself) to be called server-side
 * @param {Object} paramsToPass
 * 		An array of parameters (or the single parameter) to pass to the function
 * @param {String, Object} ...
 * 		Optional parameter(s) to append to the end of the URL as part of the
 * 		query string. String arguments should be "name=value" pairs joined by
 * 		"&" characters. If arguments are a hash, their properties are added to
 * 		the hash.
 * @return {Object}
 * 		The hash of the information needed to invoke the function
 */
Callback.getQueryParts = function getQueryParts(functionToCall, paramsToPass)
{
	var parts = {};
	// First normalize all the input arguments
	var functionName = (typeof functionToCall == "function") ? functionToCall.name : functionToCall; // Allows passing in a function or its name
	if (paramsToPass == null) paramsToPass = [];
	if (paramsToPass.constructor != Array) // Allows passing in a single parameter without wrapping it in an array
	{
		paramsToPass = [paramsToPass];
	}
	var serializedParams = [];
	for (var i=0; i<paramsToPass.length; i++)
	{
		var param = paramsToPass[i];
		var serializedParam = Jaxer.Serialization.toJSONString(param, { as: Jaxer.Serialization.JAXER_METHOD });
		if (serializedParam == undefined && param != undefined)
		{
			throw new Error("When calling function " + functionName + ", parameter #" + i + " cannot be sent because it is not serializable: " + param);
		}
		serializedParams.push(serializedParam);
	}
	// Any remaining arguments should be strings or hashes of options to be appended to the url
	for (var i=2; i<arguments.length; i++)
	{
		var arg = arguments[i];
		if (typeof arg == "string")
		{
			var argParts = arg.split("&");
			for (var j=0; j<argParts.length; j++)
			{
				var argPart = argParts[j].split("=");
				parts[argPart[0]] = (argPart.length > 1) ? argPart[1] : null;
			}
		}
		else
		{
			for (var p in arg)
			{
				parts[p] = arg[p];
			}
		}
	}
	parts[PAGE_SIGNATURE] = Jaxer.Callback[PAGE_SIGNATURE];
	parts[PAGE_NAME] = Jaxer.Callback[PAGE_NAME];
	parts[CALLING_PAGE] = Jaxer.Callback[CALLING_PAGE];
	parts[METHOD_NAME] = functionName;
	parts[PARAMS] = "[" + serializedParams.join(",") + "]";
	parts[UID] = "" + new Date().getTime() + "_" + Math.round(Math.random() * 1000000);
	
	return parts;
};

/**
 * A short convenience function to call a remote function, synchronously or
 * asynchronously based on whether or not you specify a callback function as the
 * third argument.
 * 
 * @alias Jaxer.Callback.remote
 * @param {String} functionName
 * 		The name of the remote function to call
 * @param {Object} args
 * 		A single argument, or an array of arguments, to pass to the remote
 * 		function
 * @param {Object} [callback]
 * 		If this is not specified, the call will be synchronous.
 * 		<br>
 * 		If this is specified, the call will be asynchronous.
 * 		<br><br>
 * 		If this is a function, this is the function to call upon a successful
 * 		return from the remote invocation. Its arguments are what the remote
 * 		function on the server returned.
 * 		<br><br>
 * 		If this is an array, its elements are as follows (each may be null):
 * 		<ol>
 * 			<li>
 * 				the callback function;
 * 			</li>
 * 			<li>
 * 				a function to call on an error, with arguments being the error,
 * 				the "extra" information object that has the functionName as its
 * 				one property, and the XMLHttpRequest object used for the call if
 * 				the call itself encountered an error;
 * 			</li>
 * 			<li>
 * 				the timeout to use, in milliseconds (defaults to
 * 				Jaxer.Callback.TIMEOUT). Use 0 to wait indefinitely.
 * 			</li>
 * 		</ol> 
 * 		<br><br>
 * 		If this is an object, its "callback", "errorHandler", and timeout
 * 		properties will be used, if any.
 * @return {Object}
 * 		If synchronous, the value returned by the remote function; if
 * 		asynchronous, an id by which the remote call can be canceled via
 * 		Jaxer.XHR.cancel()
 */
Jaxer.remote = function remote(functionName, args, callback)
{
	if (arguments.length == 3)
	{
		return Callback.invokeFunctionAsync(callback, functionName, args);
	}
	else
	{
		return Callback.invokeFunction(functionName, args);
	}
};

/**
 * Dynamically (at run time) creates proxies on the client from an array of names and an optional
 * namespace on which the function names will become properties.
 * 
 * @private
 * @alias Jaxer.Callback.createProxies
 * @param {String[]} proxyNames
 * 		The names of the functions to create proxies for
 * @param {Object} [namespace]
 * 		An optional namespace object. If given, the proxy foo will be accessible as <namespace>.foo;
 * 		if omitted, the procy foo will be accessible off the global ("window") as simply foo.
 */
Callback.createProxies = function createProxies(proxyNames, namespace)
{
	var js = [];
	for (var iName=0, lenNames = proxyNames.length; iName<lenNames; iName++)
	{
		var name = proxyNames[iName];
		var prop = namespace ? (namespace + "." + name) : name;
		js.push(prop + " = function " + name + "() { return Jaxer.remote('" + name + "', arguments); }");
		js.push(prop + ".async = function " + name + "_async(callback) { return Jaxer.remote('" + name + "', arguments, callback); }");
		js.push(prop + ".getUrl = function " + name + "_getUrl() { return Jaxer.Callback.getUrl.apply(this, Jaxer.Util.concatArrays(['" + name + "'], arguments)); }");
	}
	return js.join("\n");
};

Jaxer.Callback = Callback;

})();

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > Both.js
 */

/*
 * The functions below are used in both the client and the server Jaxer frameworks,
 * to offer common APIs for some frequently-needed tasks that need to be implemented
 * differently on client and server.
 */

if (!Jaxer.Util) Jaxer.Util = {};

/**
 * Used to set events on DOM elements such that they "do the right thing" both
 * client-side and server-side. On the client, this acts as expected, setting a
 * property with the name eventName (e.g. onclick) on the DOM element. On the
 * server, the eventName attribute is set on the DOM element so it can be
 * serialized with the DOM before sending to the client. If the handler is a
 * (server side) function with a name, the attribute's value is handler.name +
 * "()". 
 * 
 * @alias Jaxer.setEvent
 * @param {Object} domElement
 * 		The element on which to set the event
 * @param {String} eventName
 * 		The name of the event to set
 * @param {Object} handler
 * 		The handler function, or the body (as a string)
 */
Jaxer.setEvent = function setEvent(domElement, eventName, handler)
{
	if (Jaxer.isOnServer)
	{
		var attribute;
		if (typeof handler == "function")
		{
			if (handler.name == "")
			{
				attribute = "(" + handler.toSource() + ")()";
			}
			else
			{
				attribute = handler.name + "()";
			}
		}
		else // handler should be a string (the handler function's body)
		{
			attribute = handler;
		}
		domElement.setAttribute(eventName, attribute);
	}
	else
	{
		var func;
		if (typeof handler == "function")
		{
			func = handler;
		}
		else // handler should be a string (the handler function's body)
		{
			func = new Function(handler);
		}
		domElement[eventName] = func;
	}
};

/**
 * Sets the title of the document and works on either the server or the client.
 * 
 * @alias Jaxer.setTitle
 * @param {String} title
 * 		The text of the title
 */
Jaxer.setTitle = function setTitle(title)
{
	if (Jaxer.isOnServer)
	{
		if (!Jaxer.pageWindow)
		{
			throw new Exception("Jaxer.pageWindow is not available for some reason");
		}
		var doc = Jaxer.pageWindow.document;
		if (!doc)
		{
			throw new Exception("Jaxer.pageWindow.document is not available for some reason");
		}
		var titleElement = doc.getElementsByTagName("title")[0];
		if (!titleElement)
		{
			var head = doc.getElementsByTagNames("head")[0];
			if (head)
			{
				titleElement = doc.createElement("title");
				head.appendChild(titleElement);
			}
		}
		if (titleElement)
		{
			titleElement.firstChild.data = title;
		}
	}
	else
	{
		document.title = title;
	}
};

/**
 * Returns an array whose elements consist of the elements of all the arrays or
 * array-like objects passed in as arguments. If any of the arguments is null
 * or undefined (i.e. is equivalent to false) it is skipped.
 * 
 * @alias Jaxer.Util.concatArrays
 * @param {Object} [...]
 * 		Any number of arrays or array-like objects (e.g. a function's arguments meta-array).
 * 		Note that, unlike Array.concat, the arguments here need to be arrays or array-like
 * 		objects that have a length property and an indexer (i.e. obj[i] is defined)
 * @return {Array}
 * 		The concatenated array
 */
Jaxer.Util.concatArrays = function concatArrays()
{
	var all = [];
	for (var iArg = 0, lenArgs = arguments.length; iArg < lenArgs; iArg++) 
	{
		var arr = arguments[iArg];
		if (arr) 
		{
			for (iArr=0, lenArr=arr.length; iArr<lenArr; iArr++) 
			{
				all.push(arr[iArr]);
			}
		}
	}
	return all;
};

/**
 * Creates a new object whose private prototype (the one used when looking up
 * property values) will be set to the object passed into this function. This
 * allows for the resulting clone object to add new properties and to redefine
 * property values without affecting the master object. If access to the master
 * object is required, the cloned object contains a '$parent' property which
 * can be used for that purpose.
 * 
 * @param {Object} master
 * @return {Object}
 * 		Returns a new object that effectively inherits all properties of the
 * 		passed in object via JavaScript's prototype inheritance mechanism.
 */
Jaxer.Util.protectedClone = function(master)
{
	// anonymous object creator
	var f = function() {};
	
	// attach original object to prototype
	f.prototype = master;
	
	// create a new object whose [proto] now points to the original object
	var result = new f();
	
	// make a local reference to the master in cases where we need to unroll
	// the prototype chain
	result.$parent = master;
	
	// return result;
	return result;
};

/**
 * If a property on "values" is not defined on the target object, then add
 * that property and associated value to the target object. Note that the target
 * object's [proto] chain is included in the search for each property.
 * 
 * @param {Object} targetObject
 * @param {Object} values
 */
Jaxer.Util.safeSetValues = function(targetObject, values)
{
	for (var p in values)
	{
		if (!targetObject[p])
		{
			targetObject[p] = values[p];
		}
	}
};

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > Cookie.js
 */

/*
 * The functions below are used in both the client and the server Jaxer frameworks
 */

(function() {

if (!Jaxer.Util) Jaxer.Util = {};

/**
 * @namespace {Jaxer.Util.Cookie} Namespace object holding functions and members
 * for working with client (browser) cookies on the server side.
 */
Jaxer.Util.Cookie = {};

/**
 * Set a cookie name/value pair
 * 
 * @alias Jaxer.Util.Cookie.set
 * @param {String} name
 * 		The name of the cookie to set
 * @param {String} value
 * 		The value of the cookie
 */
Jaxer.Util.Cookie.set = function set(name, value)
{
	var cookieString = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; path=/";
	if (Jaxer.isOnServer) 
	{
		Jaxer.response.addHeader("Set-Cookie", cookieString, false);
	}
	else
	{
		document.cookie = cookieString;
	}
};

/**
 * Get a cookie key value
 * 
 * @alias Jaxer.Util.Cookie.get
 * @param {String} name
 * 		The name of the cookie to retrieve
 * @return {String}
 * 		Returns the value of the specified cookie or null if the value does not
 * 		exist.
 */
Jaxer.Util.Cookie.get = function get(name)
{
	var value = null;
	var cookies = Jaxer.Util.Cookie.getAll();
	
	if (typeof cookies[name] != "undefined")
	{
		value = cookies[name];
	}
	
	return value;
};

// specials, if given, is a hashmap that gives, for each special index, the property names to
// use for that indexed element's LHS and RHS
function parseHeaderString(str, specials)
{
	var data = {};
	var fragments = str.split(/\s*;\s*/);
	for (var i=0; i<fragments.length; i++)
	{
		var fragment = fragments[i];
		var matched = /^([^\=]+?)\s*\=\s*(.*?)$/.exec(fragment);
		if (matched && matched.length == 3) 
		{
			var lhs, rhs;
			try
			{
				lhs = decodeURIComponent(matched[1]);
			}
			catch (e)
			{
				lhs = matched[1];
				if (Jaxer.isOnServer) Jaxer.Log.debug("Malformed cookie name: name = " + lhs);
			}
			try
			{
				rhs = decodeURIComponent(matched[2]);
			}
			catch (e)
			{
				rhs = matched[2];
				if (Jaxer.isOnServer) Jaxer.Log.debug("Malformed cookie value: name = " + lhs + ", value = " + rhs);
			}
			if (specials && specials[i])
			{
				data[specials[i][0]] = lhs;
				data[specials[i][1]] = rhs;
			}
			else
			{
				data[lhs] = rhs;
			}
		}
	};
	return data;
};

/**
 * Get an object containing all cookie keys and values from the current request. 
 * Each cookie name will become a property on the object and each cookie value 
 * will become that property's value.
 * 
 * @alias Jaxer.Util.Cookie.getAll
 * @return {Object}
 * 		The resulting object of all cookie key/value pairs
 */
Jaxer.Util.Cookie.getAll = function getAll()
{
	var cookieString = Jaxer.isOnServer ? Jaxer.request.headers.Cookie : document.cookie;
	return (typeof cookieString == "string") ?
		parseHeaderString(cookieString) :
		{};
};

/**
 * Parses a given array of an HTTP response's "Set-Cookie" header strings to extract
 * the cookie fields
 * 
 * @alias Jaxer.Util.Cookie.parseSetCookieHeaders
 * @param {Array} setCookieStrings
 * 		An array of the (string) values of the HTTP response's Set-Cookie headers
 * @return {Array}
 * 		An array of objects, one per Set-Cookie header, with properties corresponding to the 
 * 		name, value, expires, path, and domain values in the header
 */
Jaxer.Util.Cookie.parseSetCookieHeaders = function parseSetCookieHeaders(setCookieStrings)
{
	if (typeof setCookieStrings == "string") setCookieStrings = [setCookieStrings];
	var cookies = [];
	for (var i=0; i<setCookieStrings.length; i++)
	{
		cookies.push(parseHeaderString(setCookieStrings[i], {0: ['name', 'value']}));
	};
	return cookies;
};

})();