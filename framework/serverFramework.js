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
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework > frameworkStart.js
 */
coreTraceMethods.TRACE('Loading fragment: frameworkStart.js');
Jaxer.lastLoadedFragment = 'frameworkStart.js';
/*
 * This is the beginning of the Jaxer server framework JavaScript code.
 */

/**
 * @overview The Jaxer server framework contains functions and code that run only on the server.
 * 
 */

/**
 * @namespace {Jaxer.Config} Holds various configuration settings for Jaxer.
 * See config.js for the default settings, which may be overridden by settings
 * in the corresponding file in the local folder specified by Jaxer.Config.LOCAL_CONF_DIR.
 */

try
{

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > Utilities.js
 */
coreTraceMethods.TRACE('Loading fragment: Utilities.js');
Jaxer.lastLoadedFragment = 'Utilities.js';
include('resource:///framework/src/Utilities.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > String.js
 */
coreTraceMethods.TRACE('Loading fragment: String.js');
Jaxer.lastLoadedFragment = 'String.js';
include('resource:///framework/src/String.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > DateTime.js
 */
coreTraceMethods.TRACE('Loading fragment: DateTime.js');
Jaxer.lastLoadedFragment = 'DateTime.js';
include('resource:///framework/src/DateTime.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > Math.js
 */
coreTraceMethods.TRACE('Loading fragment: Math.js');
Jaxer.lastLoadedFragment = 'Math.js';
include('resource:///framework/src/Math.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > MultiHash.js
 */
coreTraceMethods.TRACE('Loading fragment: MultiHash.js');
Jaxer.lastLoadedFragment = 'MultiHash.js';
include('resource:///framework/src/MultiHash.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > Url.js
 */
coreTraceMethods.TRACE('Loading fragment: Url.js');
Jaxer.lastLoadedFragment = 'Url.js';
include('resource:///framework/src/Url.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > CRC32.js
 */
coreTraceMethods.TRACE('Loading fragment: CRC32.js');
Jaxer.lastLoadedFragment = 'CRC32.js';
include('resource:///framework/src/CRC32.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > Crypto.js
 */
coreTraceMethods.TRACE('Loading fragment: Crypto.js');
Jaxer.lastLoadedFragment = 'Crypto.js';
include('resource:///framework/src/Crypto.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > DOM.js
 */
coreTraceMethods.TRACE('Loading fragment: DOM.js');
Jaxer.lastLoadedFragment = 'DOM.js';
include('resource:///framework/src/DOM.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > Cookie.js
 */
coreTraceMethods.TRACE('Loading fragment: Cookie.js');
Jaxer.lastLoadedFragment = 'Cookie.js';
include('resource:///framework/src/Cookie.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > Certificate.js
 */
coreTraceMethods.TRACE('Loading fragment: Certificate.js');
Jaxer.lastLoadedFragment = 'Certificate.js';
include('resource:///framework/src/Certificate.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > Overrides.js
 */
coreTraceMethods.TRACE('Loading fragment: Overrides.js');
Jaxer.lastLoadedFragment = 'Overrides.js';
include('resource:///framework/src/Overrides.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > Both.js
 */
coreTraceMethods.TRACE('Loading fragment: Both.js');
Jaxer.lastLoadedFragment = 'Both.js';
include('resource:///framework/src/Both.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Utilities > Stopwatch.js
 */
coreTraceMethods.TRACE('Loading fragment: Stopwatch.js');
Jaxer.lastLoadedFragment = 'Stopwatch.js';
include('resource:///framework/src/Stopwatch.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Logging > Log.js
 */
coreTraceMethods.TRACE('Loading fragment: Log.js');
Jaxer.lastLoadedFragment = 'Log.js';
include('resource:///framework/src/Log.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Logging > Level.js
 */
coreTraceMethods.TRACE('Loading fragment: Level.js');
Jaxer.lastLoadedFragment = 'Level.js';
include('resource:///framework/src/Level.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Logging > ModuleLogger.js
 */
coreTraceMethods.TRACE('Loading fragment: ModuleLogger.js');
Jaxer.lastLoadedFragment = 'ModuleLogger.js';
include('resource:///framework/src/ModuleLogger.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Logging > Appender.js
 */
coreTraceMethods.TRACE('Loading fragment: Appender.js');
Jaxer.lastLoadedFragment = 'Appender.js';
include('resource:///framework/src/Appender.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Logging > FileAppender.js
 */
coreTraceMethods.TRACE('Loading fragment: FileAppender.js');
Jaxer.lastLoadedFragment = 'FileAppender.js';
include('resource:///framework/src/FileAppender.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Logging > CoreAppender.js
 */
coreTraceMethods.TRACE('Loading fragment: CoreAppender.js');
Jaxer.lastLoadedFragment = 'CoreAppender.js';
include('resource:///framework/src/CoreAppender.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Logging > LogInit.js
 */
coreTraceMethods.TRACE('Loading fragment: LogInit.js');
Jaxer.lastLoadedFragment = 'LogInit.js';
include('resource:///framework/src/LogInit.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Comm > XHR.js
 */
coreTraceMethods.TRACE('Loading fragment: XHR.js');
Jaxer.lastLoadedFragment = 'XHR.js';
include('resource:///framework/src/XHR.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/IO > jslib_namespace_import.js
 */
coreTraceMethods.TRACE('Loading fragment: jslib_namespace_import.js');
Jaxer.lastLoadedFragment = 'jslib_namespace_import.js';
include('resource:///framework/src/jslib_namespace_import.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/IO > File.js
 */
coreTraceMethods.TRACE('Loading fragment: File.js');
Jaxer.lastLoadedFragment = 'File.js';
include('resource:///framework/src/File.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/IO > Dir.js
 */
coreTraceMethods.TRACE('Loading fragment: Dir.js');
Jaxer.lastLoadedFragment = 'Dir.js';
include('resource:///framework/src/Dir.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/IO > Includer.js
 */
coreTraceMethods.TRACE('Loading fragment: Includer.js');
Jaxer.lastLoadedFragment = 'Includer.js';
include('resource:///framework/src/Includer.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/IO > Web.js
 */
coreTraceMethods.TRACE('Loading fragment: Web.js');
Jaxer.lastLoadedFragment = 'Web.js';
include('resource:///framework/src/Web.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/IO > Socket.js
 */
coreTraceMethods.TRACE('Loading fragment: Socket.js');
Jaxer.lastLoadedFragment = 'Socket.js';
include('resource:///framework/src/Socket.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/IO > BinarySocket.js
 */
coreTraceMethods.TRACE('Loading fragment: BinarySocket.js');
Jaxer.lastLoadedFragment = 'BinarySocket.js';
include('resource:///framework/src/BinarySocket.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/IO > SMTP.js
 */
coreTraceMethods.TRACE('Loading fragment: SMTP.js');
Jaxer.lastLoadedFragment = 'SMTP.js';
include('resource:///framework/src/SMTP.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Exception > Exception.js
 */
coreTraceMethods.TRACE('Loading fragment: Exception.js');
Jaxer.lastLoadedFragment = 'Exception.js';
include('resource:///framework/src/Exception.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Exception > ClientError.js
 */
coreTraceMethods.TRACE('Loading fragment: ClientError.js');
Jaxer.lastLoadedFragment = 'ClientError.js';
include('resource:///framework/src/ClientError.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/DB > DB.js
 */
coreTraceMethods.TRACE('Loading fragment: DB.js');
Jaxer.lastLoadedFragment = 'DB.js';
include('resource:///framework/src/DB.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/DB > ResultSet.js
 */
coreTraceMethods.TRACE('Loading fragment: ResultSet.js');
Jaxer.lastLoadedFragment = 'ResultSet.js';
include('resource:///framework/src/ResultSet.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/DB > DB_MySQL.js
 */
coreTraceMethods.TRACE('Loading fragment: DB_MySQL.js');
Jaxer.lastLoadedFragment = 'DB_MySQL.js';
include('resource:///framework/src/DB_MySQL.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/DB > DB_SQLite.js
 */
coreTraceMethods.TRACE('Loading fragment: DB_SQLite.js');
Jaxer.lastLoadedFragment = 'DB_SQLite.js';
include('resource:///framework/src/DB_SQLite.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/System > System.js
 */
coreTraceMethods.TRACE('Loading fragment: System.js');
Jaxer.lastLoadedFragment = 'System.js';
include('resource:///framework/src/System.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/System > Process.js
 */
coreTraceMethods.TRACE('Loading fragment: Process.js');
Jaxer.lastLoadedFragment = 'Process.js';
include('resource:///framework/src/Process.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Threading > Thread.js
 */
coreTraceMethods.TRACE('Loading fragment: Thread.js');
Jaxer.lastLoadedFragment = 'Thread.js';
include('resource:///framework/src/Thread.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Cache > CacheManager.js
 */
coreTraceMethods.TRACE('Loading fragment: CacheManager.js');
Jaxer.lastLoadedFragment = 'CacheManager.js';
include('resource:///framework/src/CacheManager.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Container > Container.js
 */
coreTraceMethods.TRACE('Loading fragment: Container.js');
Jaxer.lastLoadedFragment = 'Container.js';
include('resource:///framework/src/Container.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Container > DBPersistor.js
 */
coreTraceMethods.TRACE('Loading fragment: DBPersistor.js');
Jaxer.lastLoadedFragment = 'DBPersistor.js';
include('resource:///framework/src/DBPersistor.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Container > SessionManager.js
 */
coreTraceMethods.TRACE('Loading fragment: SessionManager.js');
Jaxer.lastLoadedFragment = 'SessionManager.js';
include('resource:///framework/src/SessionManager.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/CoreEvents > Request.js
 */
coreTraceMethods.TRACE('Loading fragment: Request.js');
Jaxer.lastLoadedFragment = 'Request.js';
include('resource:///framework/src/Request.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/CoreEvents > Response.js
 */
coreTraceMethods.TRACE('Loading fragment: Response.js');
Jaxer.lastLoadedFragment = 'Response.js';
include('resource:///framework/src/Response.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/CoreEvents > CoreEvents.js
 */
coreTraceMethods.TRACE('Loading fragment: CoreEvents.js');
Jaxer.lastLoadedFragment = 'CoreEvents.js';
include('resource:///framework/src/CoreEvents.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/CoreEvents > ServerStart.js
 */
coreTraceMethods.TRACE('Loading fragment: ServerStart.js');
Jaxer.lastLoadedFragment = 'ServerStart.js';
include('resource:///framework/src/ServerStart.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/CoreEvents > RequestStart.js
 */
coreTraceMethods.TRACE('Loading fragment: RequestStart.js');
Jaxer.lastLoadedFragment = 'RequestStart.js';
include('resource:///framework/src/RequestStart.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/CoreEvents > InitHead.js
 */
coreTraceMethods.TRACE('Loading fragment: InitHead.js');
Jaxer.lastLoadedFragment = 'InitHead.js';
include('resource:///framework/src/InitHead.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/CoreEvents > NewElement.js
 */
coreTraceMethods.TRACE('Loading fragment: NewElement.js');
Jaxer.lastLoadedFragment = 'NewElement.js';
include('resource:///framework/src/NewElement.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/CoreEvents > ParseComplete.js
 */
coreTraceMethods.TRACE('Loading fragment: ParseComplete.js');
Jaxer.lastLoadedFragment = 'ParseComplete.js';
include('resource:///framework/src/ParseComplete.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/CoreEvents > ParseStart.js
 */
coreTraceMethods.TRACE('Loading fragment: ParseStart.js');
Jaxer.lastLoadedFragment = 'ParseStart.js';
include('resource:///framework/src/ParseStart.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/CoreEvents > HandlePage.js
 */
coreTraceMethods.TRACE('Loading fragment: HandlePage.js');
Jaxer.lastLoadedFragment = 'HandlePage.js';
include('resource:///framework/src/HandlePage.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/CoreEvents > HandleCallback.js
 */
coreTraceMethods.TRACE('Loading fragment: HandleCallback.js');
Jaxer.lastLoadedFragment = 'HandleCallback.js';
include('resource:///framework/src/HandleCallback.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/CoreEvents > HandleService.js
 */
coreTraceMethods.TRACE('Loading fragment: HandleService.js');
Jaxer.lastLoadedFragment = 'HandleService.js';
include('resource:///framework/src/HandleService.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/CoreEvents > RequestComplete.js
 */
coreTraceMethods.TRACE('Loading fragment: RequestComplete.js');
Jaxer.lastLoadedFragment = 'RequestComplete.js';
include('resource:///framework/src/RequestComplete.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Sandbox > Sandbox.js
 */
coreTraceMethods.TRACE('Loading fragment: Sandbox.js');
Jaxer.lastLoadedFragment = 'Sandbox.js';
include('resource:///framework/src/Sandbox.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/App > App.js
 */
coreTraceMethods.TRACE('Loading fragment: App.js');
Jaxer.lastLoadedFragment = 'App.js';
include('resource:///framework/src/App.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Extend > Extend.js
 */
coreTraceMethods.TRACE('Loading fragment: Extend.js');
Jaxer.lastLoadedFragment = 'Extend.js';
include('resource:///framework/src/Extend.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Serialization > Serialization.js
 */
coreTraceMethods.TRACE('Loading fragment: Serialization.js');
Jaxer.lastLoadedFragment = 'Serialization.js';
include('resource:///framework/src/Serialization.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Parsing > FunctionInfo.js
 */
coreTraceMethods.TRACE('Loading fragment: FunctionInfo.js');
Jaxer.lastLoadedFragment = 'FunctionInfo.js';
include('resource:///framework/src/FunctionInfo.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Parsing > TextParser.js
 */
coreTraceMethods.TRACE('Loading fragment: TextParser.js');
Jaxer.lastLoadedFragment = 'TextParser.js';
include('resource:///framework/src/TextParser.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Parsing > RunatConstants.js
 */
coreTraceMethods.TRACE('Loading fragment: RunatConstants.js');
Jaxer.lastLoadedFragment = 'RunatConstants.js';
include('resource:///framework/src/RunatConstants.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Parsing > ScriptInfo.js
 */
coreTraceMethods.TRACE('Loading fragment: ScriptInfo.js');
Jaxer.lastLoadedFragment = 'ScriptInfo.js';
include('resource:///framework/src/ScriptInfo.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Parsing > ScriptProcessor.js
 */
coreTraceMethods.TRACE('Loading fragment: ScriptProcessor.js');
Jaxer.lastLoadedFragment = 'ScriptProcessor.js';
include('resource:///framework/src/ScriptProcessor.js')

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/Parsing > CallbackManager.js
 */
coreTraceMethods.TRACE('Loading fragment: CallbackManager.js');
Jaxer.lastLoadedFragment = 'CallbackManager.js';
include('resource:///framework/src/CallbackManager.js')

/*
 * Please note this exists only to add documentation for the "runat" and
 * "proxy" attributes. This documentation will drive content assist in
 * Aptana Studio by making these properties available on all JS functions
 */

/**
 * @classDescription {Function} A collection of Jaxer extensions for the JavaScript
 * Function object
 */

/**
 * Use the runat property inside of a "script" tag to specify whether to run the JavaScript on the server-side, 
 * client-side, or both. Use this property to inject proxies into the client. Valid values are "client", "server," "both",
 * "server-proxy", "server-nocache", "both-proxy", and "both-nocache".
 * 
 * @alias Function.prototype.runat
 * @property {String}
 */

/**
 * Use the proxy property to specify if this function should be callable
 * from the client. If a function is not marked for proxy, it will not be callable on the server.
 * Valid values are "true" or "false".
 * 
 * @alias Function.prototype.proxy
 * @property {Boolean}
 */

 /*
 * Please note this exists only to add documentation for the top-level Jaxer
 * object. Many of these properties are defined in the JavaScript bridge code
 * needed to handle events from the Jaxer engine itself
 */

/**
 * @namespace {Jaxer} The Jaxer namespace.
 */

/**
 * This property exposes the current build number of the Jaxer engine
 * 
 * @alias Jaxer.buildNumber
 * @property {String}
 */

/**
 * This gives read-only access to the Jaxer Core's preferences, each of which
 * become a property on this object.
 * 
 * @alias Jaxer.corePreferences
 * @property {Object}
 */

/**
 * This is the global execution context for JavaScript code you define in 
 * (or load into) a page on the server. It's aliased as window in the page,
 * so it behaves just like the window global object on the client (browser).
 * 
 * @advanced
 * @alias Jaxer.pageWindow
 * @property {ChromeWindow}
 */

/**
 * Loads and evaluates JavaScript from the given location against the given global
 * execution context.
 * This is a low-level wrapper around "@mozilla.org/moz/jssubscript-loader;1" and
 * mozIJSSubScriptLoader.loadSubScript.
 * It's best to use the higher-level Jaxer.Includer.load(src, global, runat)
 * which is also conveniently available as Jaxer.load(src, global, runat) inside
 * any Jaxer server-side page (where global is defaulted to window).
 * 
 * @advanced
 * @alias Jaxer.include
 * @param {String} url
 * 		The url of the file to include, either as an absolute URL in the form
 * 		"file:///..." or relative to the current executable's folder (with
 * 		or without the "resource:///" prefix.
 * @param {Object} [global]
 * 		An optional global context in which to evaluate the script.
 */

/**
 * True on the server side, false on the client (browser).
 * 
 * @alias Jaxer.isOnServer
 * @property {Boolean}
 */

/**
 * The value of the runat attribute of the last script block encountered.
 * 
 * @advanced
 * @alias Jaxer.lastScriptRunat
 * @property {String}
 */

/**
 * Notifies the framework that a fatal error has occurred, one which
 * will require fixing and restarting Jaxer.
 * How this is handled is then determined by the Jaxer.Config settings.
 * 
 * @advanced
 * @alias Jaxer.notifyFatal
 * @param {Object} error
 * 	The error describing what happened. If the framework has already been notified
 * 	of an error, this error is not used.
 */

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework > frameworkEnd.js
 */
coreTraceMethods.TRACE('Loading fragment: frameworkEnd.js');
Jaxer.lastLoadedFragment = 'frameworkEnd.js';
Jaxer.frameworkLoaded = true;
}
catch (e)
{
	Jaxer.fatalError = e;
}

/*
 * This is the end of the Jaxer server framework JavaScript code.
 */