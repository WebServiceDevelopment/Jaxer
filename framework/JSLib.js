/* ***** LICENSE BLOCK *****
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The original developers of this code are the contributors to the 
 * JSLib project at http://jslib.mozdev.org.
 * Portions created by the original developers are Copyright (C) 2000-2007.
 * All Rights Reserved.
 *
 * This code is derived from a subset of the JSLib code and has been
 * modified by Aptana, Inc. in 2008. The portions modified by Aptana, Inc.
 * are Copyright (C) 2007-2008 Aptana, Inc. All Rights Reserved.
 *
 * This file is distributed by Aptana, Inc. as part of its Jaxer program.
 * A copy of the MPL, and related compliance information in a file titled 
 * license-jslib.html, are provided in the main distribution folder of this program.
 *
 * ***** END LICENSE BLOCK ***** */

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/JSLIB > jslib.js
 */
coreTraceMethods.TRACE('Loading fragment: jslib.js');
Jaxer.lastLoadedFragment = 'jslib.js';
(function()
{

    /**
     * @namespace {JSLib} 
     * 		This is the namespace that holds XPCOM functions and variables
     */
    
	
	//noformat
	
	JSLib = {}; // Should be global
	
	JSLib.OK							= 0;
	JSLib.VOID 							= void(null)
	
	JSLib.DIR_DIRECTORY               	= 0x01;  // 1
	JSLib.DIR_DEFAULT_PERMS           	= 0755;
	
	JSLib.DIRUTILS_FILE_DIR_CID 		= "@mozilla.org/file/directory_service;1";
	JSLib.DIRUTILS_I_PROPS	  			= "nsIProperties";
	
	JSLib.FILE_LOCAL 					= "@mozilla.org/file/local;1";

	JSLib.NETWORK_URL 					= "@mozilla.org/network/standard-url;1";
	JSLib.URL_COMP 						= "nsIURL";
	
	JSLib.FILE_IOSERVICE_CID			= "@mozilla.org/network/io-service;1";
	JSLib.FILEUTILS_IO_SERVICE_CID 		= '@mozilla.org/network/io-service;1'; //dupe
	
	JSLib.FILE_I_STREAM_CID	 			= "@mozilla.org/scriptableinputstream;1";
	JSLib.SOCKET_I_STREAM_CID 			= "@mozilla.org/scriptableinputstream;1" //dupe
	
	JSLib.FILE_INSTREAM_CID				= "@mozilla.org/network/file-input-stream;1";	
	JSLib.FILE_OUTSTREAM_CID			= "@mozilla.org/network/file-output-stream;1";
	JSLib.FILE_BINOUTSTREAM_CID 		= "@mozilla.org/binaryoutputstream;1";
	
	JSLib.FILE_BININSTREAM_CID			= "@mozilla.org/binaryinputstream;1";
	JSLib.SOCKET_BININSTREAM_CID 		= "@mozilla.org/binaryinputstream;1" //dupe
	
	JSLib.FILEUTILS_PROCESS_CID			= "@mozilla.org/process/util;1";
	JSLib.FILEUTILS_FILEPROTOCOL_CID	= "@mozilla.org/network/protocol;1?name=file"
	
	JSLib.FILEUTILS_CHROME_REG_PROGID 	= '@mozilla.org/chrome/chrome-registry;1';
	
	JSLib.NETUTILS_URIFIXUP 			= "@mozilla.org/docshell/urifixup;1";
	JSLib.NETUTILS_URICHECK 			= "@mozilla.org/network/urichecker;1";
	
	JSLib.SOCKET_TRANSPORT_CID 			= "@mozilla.org/network/socket-transport-service;1";
	JSLib.SOCKET_INPUT_STREAM_PUMP 		= "@mozilla.org/network/input-stream-pump;1" 
	
	JSLib.ZIP_CID 						= "@mozilla.org/libjar/zip-reader;1";
	JSLib.ZIP_I_ZIP_READER 				= "nsIZipReader";
	
	JSLib.File_nsIFile 					= new Components.Constructor(JSLib.FILE_LOCAL, "nsILocalFile", "initWithPath");
	JSLib.URL 							= new Components.Constructor(JSLib.NETWORK_URL, JSLib.URL_COMP);
	JSLib.FILEUTILS_nsIFile				= new Components.Constructor(JSLib.FILE_LOCAL, "nsILocalFile", "initWithPath");
	
	JSLib.FILE_I_SCRIPTABLE_IN_STREAM	= "nsIScriptableInputStream";
	JSLib.FILE_I_BINARY_OUT_STREAM		= "nsIBinaryOutputStream";
	JSLib.FILE_I_BINARY_IN_STREAM		= "nsIBinaryInputStream";
	
	JSLib.FILE_INTL_SCR_UNI_CONV_CID	= "@mozilla.org/intl/scriptableunicodeconverter";
	JSLib.FILE_INTL_I_SCR_UNI_CONV		= "nsIScriptableUnicodeConverter";
	
	JSLib.FILE_READ_MODE	 			= "r";
	JSLib.FILE_WRITE_MODE				= "w";
	JSLib.FILE_APPEND_MODE	 			= "a";
	JSLib.FILE_BINARY_MODE	 			= "b";
	
	JSLib.FILE_FILE_TYPE	 			= 0x00;	// 0
	JSLib.FILE_CHUNK		 			= 1024;	// buffer for readline => set to 1k
	JSLib.FILE_DEFAULT_PERMS 			= 0644;
	

	JSLib.DIRUTILS_NSIFILE	  			= Components.interfaces.nsIFile;
	JSLib.FILE_I_IOSERVICE				= Components.interfaces.nsIIOService;
	JSLib.FILE_I_FILE_OUT_STREAM		= Components.interfaces.nsIFileOutputStream;
	
	/* 
	 * Useful OS System Dirs
	 * /usr/src/mozilla/dist/bin
	 */
	JSLib.NS_OS_CURRENT_PROCESS_DIR 	= "CurProcD"; 
	JSLib.NS_OS_DESKTOP_DIR 			= "Desk";
	JSLib.NS_OS_HOME_DIR				= "Home"; 
	JSLib.NS_OS_TEMP_DIR 				= "TmpD"; 
	
	/*
	 * Possible values for the ioFlags parameter 
	 * From: 
	 * http://lxr.mozilla.org/seamonkey/source/nsprpub/pr/include/prio.h#601
	 */
	JSLib.FILE_NS_RDONLY				= 0x01;
	JSLib.FILE_NS_WRONLY				= 0x02;
	JSLib.FILE_NS_RDWR					= 0x04;
	JSLib.FILE_NS_CREATE_FILE			= 0x08;
	JSLib.FILE_NS_APPEND				= 0x10;
	JSLib.FILE_NS_TRUNCATE				= 0x20;
	JSLib.FILE_NS_SYNC					= 0x40;
	JSLib.FILE_NS_EXCL					= 0x80;
	
	//format
    
    /**
     * typeIsObj
     * 
     * A boolean indicator for whether the param is an object. 
     * 
     * @private
     * @param {Object} aType
     * @return {Boolean} 
     * 		true if object otherwise false
     */
	JSLib.typeIsObj = function(aType)
    {
        return (aType && typeof(aType) == "object");
    };
    
	/**
	 * typeIsNum
	 * 
     * @private
	 * @param {Object} aType
	 * 	the item to test
	 * @return {Boolean} 
	 * 		true if number otherwise false
	 */
    JSLib.typeIsNum = function(aType)
    {
        return (aType && typeof(aType) == "number");
    };
    
	/**
	 * typeIsStr
	 * 
     * @private
	 * @param {Object} aType
	 * 	the item to test
	 * @return {Boolean} 
	 * 		true if String otherwise false
	 */
    JSLib.typeIsStr = function(aType)
    {
        return (aType && typeof(aType) == "string");
    };
    
	/**
	 * typeIsFunc
	 * 
     * @private
	 * @param {Object} aType
	 * 	the item to test
	 * @return {Boolean} 
	 * 		true if function otherwise false
	 */
    JSLib.typeIsFunc = function(aType)
    {
        return (aType && typeof(aType) == "function");
    };
    
	/**
	 * Tests whether the object is an instance of the XPCOM interface provided
	 * 
     * @private
	 * @param {Object} aObj
	 * 		the object to be tested
	 * @param {Object} aInterface
	 * 		the interface name as a string
	 * @return {Boolean} 
	 * 		true if the object is an instance of the requested type, false otherwise
	 */
    JSLib.instanceOf = function(aObj, aInterface)
    {
        return (aObj instanceof Components.interfaces[aInterface]);
    };
    
	/**
	 * Wrapper for the XPCOM function createinstance
	 * 
     * @private
	 * @param {Object} aURL
	 * 	the URL 
	 * @param {Object} aInterface
	 * 	the named interface to instantiate
	 * @return {Object} 
	 * 	an instance of the XPCOM object
	 */
    JSLib.createInstance = function(aURL, aInterface)
    {
        try 
        {
            return Components.classes[aURL].createInstance(Components.interfaces[aInterface]);
        } 
        catch (e) 
        {
            throw new Exception(e);
        }
    };
    
    /**
     * Wrapper for the XPCOM function getService
     * @private
     * @param {Object} aURL
     * 		the URL
     * @param {Object} aInterface
     * 		the named interface to instantiate
     * @return {Object}
     * 		an instance of the XPCOM object
     */
	JSLib.getService = function(aURL, aInterface)
    {
        try 
        {
            // determine how 'aInterface' is passed and handle accordingly
            switch (typeof(aInterface))
            {
                case "object":
                    return Components.classes[aURL].getService(aInterface);
                    break;
                    
                case "string":
                    return Components.classes[aURL].getService(Components.interfaces[aInterface]);
                    break;
                    
                default:
                    return Components.classes[aURL].getService();
                    break;
            }
        } 
        catch (e) 
        {
            throw new Exception(e);
        }
    };
    
    /**
     * Wrapper for the XPCOM function QueryInterface
     * 
     * @private
     * @param {Object} aURL
     * @param {Object} aInterface
     * 		the named interface to instantiate
     * @return {Object}
     * 		an instance of the XPCOM objects query interface
     */
	JSLib.QI = function(aObj, aInterface)
    {
        try 
        {
            return aObj.QueryInterface(Components.interfaces[aInterface]);
        } 
        catch (e) 
        {
            throw new Exception(e);
        }
    }
    
    try 
    {
        JSLib.FILE_InputStream = new Components.Constructor(JSLib.FILE_I_STREAM_CID, JSLib.FILE_I_SCRIPTABLE_IN_STREAM);
        JSLib.FILE_IOSERVICE = JSLib.getService(JSLib.FILE_IOSERVICE_CID, JSLib.FILE_I_IOSERVICE);
    } 
    catch (e) 
    {
        throw new Exception(e);
    };
    
    /**
     * Init the base exception handler
     * @private
     * @param {Object} e
     * 		The exception to throw
     */
	JSLib.ExceptionHandler = function ExceptionHandler(e) { 
		throw "Exception thrown from JSLib: " + e; 
	}; 
	
    /**
     * Register an exceptionHandler to deal with any JSLib exceptions
     * @private
     * @param {Function} fn
     * 		The function to process any exceptions thrown
     */
	JSLib.setExceptionHandler = function(fn){
		JSLib.ExceptionHandler = fn;
	}
	
	/**
     * Exception handler that ships with core jslib
     * @private
     */
    JSLib.defaultExceptionHandler = function(e)
    {
		var errMsg = "\n-----======[ jsLib ERROR ]=====-----\n";
		
        if (JSLib.typeIsStr(e)) 
		{
			throw e;
		}
        
        if (/^TypeError/.test(e)) 
		{
			throw e;
		}
        
        if (JSLib.typeIsObj(e)) 
		{
			var m, n, r, l, ln, fn = "";
			try 
			{
				rv = -e.result;
				m = e.message;
				fn = e.filename;
				l = e.location;
				ln = l.lineNumber;
			} 
			catch (e) 
			{
			}
			errMsg += "FileName:          " + fn + "\n" ;
			errMsg += "Result:            " + rv + "\n" ;
			errMsg += "Message:           " + m + "\n" ;
			errMsg += "LineNumber:        " +ln +"\n";
		} else {
			errMsg += uneval(e);
		}
              
        throw errMsg;

    }

	JSLib.ExceptionHandler = JSLib.defaultExceptionHandler;
	
    /**
     * @private
     * Throws the provided exception via the currently registered exception handler.
     * @param {Boolean} assertion
     * 		a true/false condition to indicate whether the assertion is true
     * @param {Object} message
     * 		the object to throw as an exception
     */
    JSLib.raiseIfTrue = function(assertion, message)
    {
        if (assertion) 
        {
            JSLib.ExceptionHandler(message);
        }
    }
        
})();



/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/JSLIB > filesystem.js
 */
coreTraceMethods.TRACE('Loading fragment: filesystem.js');
Jaxer.lastLoadedFragment = 'filesystem.js';
(function() {

    /* TODO
     * add copious log.trace / log.debug messages
     */
	
	/**
	 * @classDescription {JSLib.Filesystem} File System Object contains methods useful for accessing the basic file and directory objects.
	 */
	
    /**
     * 
     * File System Object. This object is used as a functional wrapper
     * to the file system. It can represent, folders, files, symlinks
     * 
     * @constructor
     * @alias JSLib.Filesystem
     * @param {Object} fsPath
     * 		The path to the filesystem object
     * @return {JSLib.Filesystem} Returns an instance of Filesystem.
     */
    function Filesystem(fsPath)
    {
    
        JSLib.raiseIfTrue((fsPath < 0), "Provided Path Argument is invalid");
        
        // support nsIFile method names

        this.initWithPath = this.initPath;
        this.moveTo = this.move;
        this.copyTo = this.copy;
        
        return (fsPath ? this.initPath(arguments) : JSLib.VOID);
        
    }
    
    Filesystem.prototype = 
    {
        _path: null,
        _nsIFile: null,
        
        /**
         * This method will initialize the file system object with the provided path information (or will attempt to derive the path if an object is provided).
         * An existing File object can be 'repointed' to a new physical file sytem object by invoking this method.
         * 
         * @method
         * @alias JSLib.Filesystem.prototype.initPath
         * @param {Array} a set of arguments
         * @exception {Error} 
         * 		Throws a Exception containing the error code.
         * @return {String} 
         * 		the file extension of the referenced filesystem object
         */
        initPath: function initPath(args)
        {
            // check if the argument is a file:// url
            var fileURL;
            
            function getFileURL(spec)
            {
                fileURL = new JSLib.URL;
                fileURL.spec = spec;
                return fileURL.path;
            }
            
            if (JSLib.typeIsObj(args)) 
            {
                for (var i = 0; i < args.length; i++) 
                {
                    if (args[i].search(/^file:/i) == 0) 
					{
						args[i] = getFileURL(args[i]);
					}
                }
            }
            else 
            {
                if (args.search(/^file:/i) == 0) 
				{
					args = getFileURL(args);
				}
            }
            
            /* 
             * If you are wondering what all this extra cruft is, well
             * this is here so you can reinitialize 'this' with a new path
             */
            var pathToFile = null;
            try 
            {
                if (typeof(args.path) == "string") 
                {
                    JSLib.raiseIfTrue(typeof(args.isDirectory) == "function" && args.isDirectory(), "NS_ERROR_FS_FILE_IS_DIRECTORY");
                    
                    this._nsIFile = new JSLib.File_nsIFile(args.path);
                    pathToFile = this._nsIFile.path;
                }
                else 
                    if (JSLib.typeIsObj(args)) 
                    {
                        this._nsIFile = new JSLib.File_nsIFile(args[0] ? args[0] : this._path);
                        if (args.length > 1) 
                        {
                            for (i = 1; i < args.length; i++) 
                            {
                                this._nsIFile.append(args[i]);
                            }
                        }
                        pathToFile = (args[0] || this._path) ? this._path = this._nsIFile.path : null;
                    }
                    else 
                    {
                        this._nsIFile = new JSLib.File_nsIFile(args ? args : this._path);
                        pathToFile = (this._nsIFile.path ? this._nsIFile.path : null);
                    }
            } 
            catch (e) 
            {
                JSLib.ExceptionHandler(e)
            }
            
            this._path = pathToFile
            return pathToFile;
        }
    };
    
    /**
     * A helper function that will first check to see if the current filesystem instance is correctly initialised and then perform the
     * provided test.
     * 
     * @private
     * @alias JSLib.Filesystem.prototype.check
     * @param {Function}
     * 		A function to be run that returns true/false
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {Boolean} 
     * 		results of running the function which was passed as parameter
     */
    Filesystem.prototype.check = function check(is)
    {
    
        //TODO verify this test is sufficient.
        JSLib.raiseIfTrue(!this._nsIFile && this._path, "File System Object must be Initialized before use");
        
        return (is) ? is() : true;
    };
    
    /**
     * Truncates the file referenced by the filesystem object.
     * 
     * @method
     * @alias JSLib.Filesystem.prototype.resetCache
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {Boolean} 
     * 		true indicates success
     */
    Filesystem.prototype.resetCache = function resetCache()
    {
    
        this.check();
        
        if (this._path) 
        {
            delete this._nsIFile;
            this._nsIFile = new JSLib.File_nsIFile(this._path);
            return true;
        }
        else 
        {
            return false;
        }
    };
    
    /**
     * Evaluates whether the current filesystem object refers to the same file as the one provided as a parameter
     * 
     * @method
     * @alias JSLib.Filesystem.prototype.equals
     * @param {Object} 
     * 		a file system object to be compared
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {Boolean} 
     * 		true if object refers to same filesystem object, false otherwise
     */
    Filesystem.prototype.equals = function equals(aFileObj)
    {
		
		this.check();

        var fo;
        if (typeof(aFileObj.nsIFile) == "object") 
		{
			fo = aFileObj.nsIFile;
		}
		else 
		{
			fo = aFileObj;
		}
        
        return this._nsIFile.equals(fo);
    
    };
    
    /**
     * A boolean indicator of whether the referenced object physically exists on the filesystem.
     * 
     * @alias JSLib.Filesystem.prototype.exists
     * @property {Boolean} 
     * 		true if file exists otherwise false
     */
    Filesystem.prototype.__defineGetter__('exists', function()
    {
        this.check();
        return this._nsIFile.exists();
    });
    
    /**
     * A boolean indicator of whether the referenced object is a folder/directory
     * 
     * @alias JSLib.Filesystem.prototype.isDir
     * @property {Boolean} 
     * 		true if item a folder
     */
    Filesystem.prototype.__defineGetter__('isDir', function()
    {
        this.check();
        return this._nsIFile.isDirectory();
    });

    /**
     * A boolean indicator of whether the referenced object is a folder/directory
     * an alias of as isDir
     * 
     * @alias JSLib.Filesystem.prototype.isFolder
     * @property {Boolean} 
     * 		true if item a folder
     */
    Filesystem.prototype.__defineGetter__('isFolder', function()
    {
        this.check();
        return this.isDir;
    });

    Filesystem.prototype.isDirectory = function isDirectory()
    {
        return this.isDir;
    };

    /**
     * A boolean indicator of whether the referenced object is a file
     * 
     * @alias JSLib.Filesystem.prototype.isFile
     * @property {Boolean} 
     * 		true if item is a file
     */
    Filesystem.prototype.__defineGetter__('isFile', function()
    {
        this.check();
        return this._nsIFile.isFile();
    });
    
    /**
     * A boolean indicator of whether the referenced object is an executable
     * 
     * @alias JSLib.Filesystem.prototype.isExec
     * @property {Boolean} 
     * 		true if item executable
     */
    Filesystem.prototype.__defineGetter__('isExec', function()
    {
        this.check();
		
		if (Jaxer.System.OS == 'Darwin')
		{
			// manually check file permissions on mac as it returns
			// a strange format for permissions
			var p = this.permissions.toString();
			return ( (parseInt(p.substr(-1) & 1) + parseInt(p.substr(-2,1) & 1) + parseInt(p.substr(-3,1) & 1) ) > 0 );
		}
        return this._nsIFile.isExecutable();
    });
	
    Filesystem.prototype.isExecutable = function isExecutable()
    {
        return this.isExec;
    };
    
    /**
     * A boolean indicator of whether the referenced object is a symlink
     * 
     * @alias JSLib.Filesystem.prototype.isSymlink
     * @property {Boolean} 
     * 		true if item symbolic link
     */
    Filesystem.prototype.__defineGetter__('isSymlink', function()
    {
        this.check();
        return this._nsIFile.isSymlink();
    });

    /**
     * A boolean indicator of whether the referenced object is writable
     * 
     * @alias JSLib.Filesystem.prototype.isWritable
     * @property {Boolean} 
     * 		true if item is writable
     */
    Filesystem.prototype.__defineGetter__('isWritable', function()
    {
        this.check();
        return this._nsIFile.isWritable();
    });
    
    /**
     * A boolean indicator of whether the referenced object is readable
     * 
     * @alias JSLib.Filesystem.prototype.isReadable
     * @property {Boolean} 
     * 		true if item is readable
     */
    Filesystem.prototype.__defineGetter__('isReadable', function()
    {
        this.check()
        return this._nsIFile.isReadable();
    });
    
    /**
     * A boolean indicator of whether the referenced object is hidden
     * 
     * @alias JSLib.Filesystem.prototype.isHidden
     * @property {Boolean} 
     * 		true if item is hidden
     */
    Filesystem.prototype.__defineGetter__('isHidden', function()
    {
        this.check()
        return this._nsIFile.isHidden();
    });
    
    /**
     * A boolean indicator of whether the referenced object is special.
     * NOTE: Not implemented on Mac and possibly other systems.
     * 
     * @alias JSLib.Filesystem.prototype.isSpecial
     * @property {Boolean} 
     * 		true if item a special file
     */
    Filesystem.prototype.__defineGetter__('isSpecial', function()
    {
        this.check();
        return this._nsIFile.isSpecial();
    });
    
    /**
     * An indicator of whether the provided permissions value is valid
     * 
     * @private
     * @alias JSLib.Filesystem.prototype.validatePermissions
     * @param {Number} 
     * 		a chmod style permission value
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {Boolean} 
     * 		return value indicates success or fail
     */
    Filesystem.prototype.validatePermissions = function validatePermissions(aNum)
    {
        return (!(typeof(aNum) != 'number' || parseInt(aNum.toString(10).length) < 3));
    };
    
    /**
     * Move the referenced file to a new filesystem location provided as a parameter
     * NOTE: after a move, 'this' will be reinitialized to reference the moved file!
     * 
     * @alias JSLib.Filesystem.prototype.move
     * @param {String} 
     * 		destination path
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     *
     */
    Filesystem.prototype.move = function move(aDest)
    {
    
        JSLib.raiseIfTrue(!aDest, "NS_ERROR_FS_INVALID_ARG");
        
        this.check();
        
        if (typeof(aDest) == "object") 
		{
			if (typeof(aDest.path) != "string") 
			{
				throw new Exception("NS_ERROR_FS_INVALID_ARG");
			}
			else 
			{
				aDest = aDest.path;
			}
		}
        
        var newName = null;
        
        try 
        {
            var f = new JSLib.File_nsIFile(aDest);
            
            JSLib.raiseIfTrue(f.exists() && !f.isDirectory(), "NS_ERROR_FS_FILE_ALREADY_EXISTS "+ f._path);
            JSLib.raiseIfTrue(f.equals(this._nsIFile), "NS_ERROR_FS_FILE_COPY_OR_MOVE_FAILED "+ f._path);
            
            if (!f.exists() && f.parent.exists()) 
			{
				newName = f.leafName;
			}
            
            JSLib.raiseIfTrue(f.equals(this._nsIFile.parent) && !newName, "NS_ERROR_FS_FILE_IS_DIRECTORY "+ f._path);
            
            var dir = f.parent;
            
            if (dir.exists() && dir.isDirectory()) 
            {
                this._nsIFile.moveTo(dir, newName);
                this._path = f.path;
                this.resetCache();
                delete dir;
            }
            else 
            {
                throw new Exception("NS_ERROR_FS_INVALID_ARG");
            }
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * Changes the path of the filesystem object by appending the provided leaf value.
     * 
     * @alias JSLib.Filesystem.prototype.append
     * @param {String}  leafname
     * 		The leafname to be appended
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {String} 
     * 		The appended directory and leafname
     */
    Filesystem.prototype.append = function append(aLeaf)
    {
    
        JSLib.raiseIfTrue(!aLeaf, "NS_ERROR_FS_INVALID_ARG");
        
        this.check();
        this._nsIFile.append(aLeaf);
        this._path = this._nsIFile.path;
        
    };
    
    /**
     * This method is used for appending a relative path to the current filesystem object
     * 
     * @alias JSLib.Filesystem.prototype.appendRelativePath
     * @method
     * @param {String}  
     * 		relative path
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     */
    Filesystem.prototype.appendRelativePath = function appendRelativePath(aRelPath)
    {
    
        JSLib.raiseIfTrue(!aRelPath, "NS_ERROR_FS_INVALID_ARG");
        
        this.check()
        this._nsIFile.appendRelativePath(aRelPath);
        this._path = this._nsIFile.path;
        
    };
    
    /**
     * As of Mozilla 1.7, the underlying XPCOM method is only implemented
     * under UNIX builds (except for Mac OSX).
     * This method will fail if the path does not exist.
     * 
     * @alias JSLib.Filesystem.prototype.normalize
     * @exception	{Error} 
     * 		Throws a Exception containing the error code.
     */
    Filesystem.prototype.normalize = function normalize()
    {
    
        JSLib.raiseIfTrue(!this.exists, "NS_ERROR_FS_FILE_NOT_FOUND "+ this._path);
        
        try 
        {
            this._nsIFile.normalize();
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    };
    
    /**
     * Get/Set the file permissions for the File object.
     * 
     * this may be ignored/misreported by some versions of windows.
     * 
     * on Windows, you can only set the Read/Write bits of a file. And User/Group/Other will have the SAME 
     * settings based on the most-relaxed setting (Read 04, 040, 0400, Write 02, 020, 0200). When a file is created, 
     * by default it has both Read and Write permissions. Also, you cannot set the file permission to WRITE-ONLY, doing 
     * so would set it to read-write
     * 
     * @alias JSLib.Filesystem.prototype.permissions
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @property {String} 
     * 		the chmod style permissions of the file
     */
    Filesystem.prototype.__defineGetter__('permissions', function()
    {
        JSLib.raiseIfTrue(!this.exists, "NS_ERROR_FS_FILE_NOT_FOUND "+ this._path);
        return parseInt(this._nsIFile.permissions.toString(8));
        
    });
	    
    Filesystem.prototype.__defineSetter__('permissions', function(aPermission)
    {
    
        JSLib.raiseIfTrue(!aPermission, "NS_ERROR_FS_INVALID_ARG ");
        JSLib.raiseIfTrue(!this.exists, "NS_ERROR_FS_FILE_NOT_FOUND "+ this._path);
        JSLib.raiseIfTrue(!this.validatePermissions(aPermission), "NS_ERROR_FS_INVALID_ARG "+ this._path);
        
        this._nsIFile.permissions = aPermission;
    });
	  
    /**
     * The last modified timestamp as reported by the OS.
     * 
     * @alias JSLib.Filesystem.prototype.dateModified
     * @exception	{Error} 
     * 		Throws a Exception containing the error code.
     * @property {Object} 
     * 		a date object representing the last modified timestamp of the file
     */
    Filesystem.prototype.__defineGetter__('dateModified', function()
    {
    
        JSLib.raiseIfTrue(!this.exists, "NS_ERROR_FS_FILE_NOT_FOUND "+ this._path);
        
        try 
        {
            return (new Date(this._nsIFile.lastModifiedTime));
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    });
        
    /**
     * Returns a clone of the underlying nsIFile object.
     * 
     * @alias JSLib.Filesystem.prototype.nsIFile
     * @param {String} aPermissions
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @property {Object} 
     * 		clone of the contained nsIFile
     */
    Filesystem.prototype.__defineGetter__('nsIFile', function()
    {
        return this._nsIFile.clone();
    });
   
    /**
     * Returns the path of the refererenced filesystem object.
     * 
     * @alias JSLib.Filesystem.prototype.path
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @property {String} 
     * 		path to nsIFile
     */
    Filesystem.prototype.__defineGetter__('path', function()
    {
        return this._nsIFile.path;
    });
    
    /**
     * Return the path of the referenced object as a file URL
     * 
     * 
     * @method
     * @alias JSLib.Filesystem.prototype.URL
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @property {String} 
     * 		the file path as a URL
     */
    Filesystem.prototype.__defineGetter__('URL', function()
    {
        //this.check(function(){
        var ph = JSLib.createInstance("@mozilla.org/network/protocol;1?name=file", "nsIFileProtocolHandler");
        return ph.getURLSpecFromFile(this._nsIFile);
        //});
    });
        
	/**
     * Get/Set the leaf (filename + extension) portion of the file path.
     *   
     * @method
	 * @alias JSLib.Filesystem.prototype.leaf
	 * @property {String}
	 * 		The derived URL spec from the file
	 */
    Filesystem.prototype.__defineGetter__('leaf', function()
    {
    
        this.check();
        try 
        {
            return this._nsIFile.leafName;
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    });
    
    Filesystem.prototype.__defineSetter__('leaf', function(aLeaf)
    {
    
        this.check();
        JSLib.raiseIfTrue(!aLeaf, "NS_ERROR_INVALID_ARG");
        
        try 
        {
            return (this._nsIFile.leafName = aLeaf);
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    });
        
	/**
     * Returns the path of the parent filesystem object.
     * if called on the root filesystem object an exception
     * will be thrown. 
	 * @alias JSLib.Filesystem.prototype.leaf
	 * @property {String}
	 * 		The path of the parent file system object
	 */
    Filesystem.prototype.__defineGetter__('parentPath', function()
    {
    
        this.check();
        
        try 
        {
            return (this._nsIFile.parent.path);
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    });
            
    JSLib.Filesystem = Filesystem;

})();

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/JSLIB > file.js
 */
coreTraceMethods.TRACE('Loading fragment: file.js');
Jaxer.lastLoadedFragment = 'file.js';
(function(){

    /**
     * @classDescription {JSLib.File} 
     * 		This is the class that wraps the XPCOM file handling
     */
	
    /**
     * Creates a new File handle for performing filesystem file operations.
     * 
     * @example
     * <pre>
     *		 var p = '/tmp/foo.dat';
     *		 var f = new Jaxer.File(p);
     * </pre>
     * @constructor
	 * @extends {JSLib.Filesystem}
     * @alias JSLib.File
     * @param {String} aPath 
     *  	an argument of string local file path
     * @exception {Error} 
     *  	Throws a Exception containing the error code upon failure.
     *  @return {JSLib.File} Returns an instance of File.
     */
    function File(aPath)
    {
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FILE_INVALID_ARG");
        
        // if the argument is a File or nsIFile object	
        return this.initPath((JSLib.typeIsObj(aPath)) ? aPath.path : arguments);   
    }
    
    File.prototype = new JSLib.Filesystem;
    
    // member vars
    File.prototype._mode = null;
    File.prototype._isBinary = false;
    File.prototype._fileChannel = null;
    File.prototype._transport = null;
    File.prototype._URI = null;
    File.prototype._outStream = null;
    File.prototype._inputStream = null;
    File.prototype._lineBuffer = null;
    File.prototype._position = 0;
	
	// Create a private singleton converter to reuse
	var converter = JSLib.createInstance(JSLib.FILE_INTL_SCR_UNI_CONV_CID, JSLib.FILE_INTL_I_SCR_UNI_CONV);
	converter.charset = "UTF-8";
    
    /** 
     * Opens the file for reading or writing. The provided file mode can be one or two characters the 
     * using 'rb','ab','wb' will cause the file to be opened in binary safe mode.
     * 
     * NOTE: This implementation doesn't support file locking so will allow multiple open handles to 
     * the same file.
     * @alias JSLib.File.prototype.open
     * @example
     * <pre>
     *		 var p='/tmp/foo.dat';
     *		 var f=new Jaxer.File(p);
     *		 f.open();
     * </pre>
     * @param {String} aMode 
     *  an argument of string 'w', 'a', 'r', 'b'
     * @param {Number} aPermissions 
     *  a number containing the unix style chmod value for the permissions
     * @exception {Error} 
     *  Throws a Exception containing the error code.
     */
    File.prototype.open = function(aMode, aPerms)
    {
        this.check();
        
        
        // close any existing file handles
        this.close();
        
        JSLib.raiseIfTrue(this._mode, "NS_ERROR_FILE_NOT_INITIALIZED_ON_OPEN "+ this._path);
        
        if (!this._URI) 
        {
            if (!this.exists) 
			{
				this.create();
			}
			
            this._URI = JSLib.FILE_IOSERVICE.newFileURI(this._nsIFile);
        }
        
        JSLib.raiseIfTrue(this.exists && this._nsIFile.isDirectory(), "NS_ERROR_FILE_IS_DIRECTORY "+ this._path);

        if (!aMode) 
            aMode = JSLib.FILE_READ_MODE;
        
        this.resetCache();
        
        this._isBinary = false;
        var access;
        while (aMode.length > 0) 
        {
            switch (aMode[0])
            {
                case JSLib.FILE_WRITE_MODE:
                case JSLib.FILE_APPEND_MODE:
                case JSLib.FILE_READ_MODE:
                {
                    access = aMode[0];
                    break;
                }
                case JSLib.FILE_BINARY_MODE:
                {
                    this._isBinary = true;
                    break;
                }
                default:
                    throw new Exception("NS_ERROR_FILE_INVALID_ARG");
            }
            aMode = aMode.substring(1);
        }
        aMode = access;
        
        switch (aMode)
        {
            case JSLib.FILE_WRITE_MODE:
            case JSLib.FILE_APPEND_MODE:
            {
                try 
                {
                    if (!this._fileChannel) 
					{
						this._fileChannel = JSLib.FILE_IOSERVICE.newChannelFromURI(this._URI);
					}
                    
                } 
                catch (e) 
                {
                    JSLib.ExceptionHandler(e)
                }
                
                if (aPerms && this.validatePermissions(aPerms)) 
				{
					this._nsIFile.permissions = aPerms;
				}
                
                if (!aPerms) 
				{
					aPerms = JSLib.FILE_DEFAULT_PERMS;
				}
                
                try 
                {
                    var offSet = 0;
                    this._mode = aMode;
                    // create a filestream
                    var fs = JSLib.createInstance(JSLib.FILE_OUTSTREAM_CID, JSLib.FILE_I_FILE_OUT_STREAM);
                    
                    if (aMode == JSLib.FILE_WRITE_MODE) 
					{
						fs.init(this._nsIFile, JSLib.FILE_NS_TRUNCATE | JSLib.FILE_NS_WRONLY, aPerms, null);
					}
					else 
					{
						fs.init(this._nsIFile, JSLib.FILE_NS_RDWR | JSLib.FILE_NS_APPEND, aPerms, null);
					}
                    
                    this._outStream = fs;
                    if (this._isBinary) 
                    {
                        // wrap a nsIBinaryOutputStream around the actual file
                        var binstream = JSLib.createInstance(JSLib.FILE_BINOUTSTREAM_CID, JSLib.FILE_I_BINARY_OUT_STREAM);
                        binstream.setOutputStream(this._outStream);
                        this._outStream = binstream;
                    }
                } 
                catch (e) 
                {
                    JSLib.ExceptionHandler(e)
                }
                break;
            }
            
            case JSLib.FILE_READ_MODE:
            {
                JSLib.raiseIfTrue(!this.exists, "NS_ERROR_FILE_NOT_FOUND "+ this._path);
                
                this._mode = JSLib.FILE_READ_MODE;
                
                try 
                {
                    this._fileChannel = JSLib.FILE_IOSERVICE.newChannelFromURI(this._URI);
                    this._lineBuffer = new Array();
                    if (this._isBinary) 
                    {
                        // wrap a nsIBinaryInputStream around the nsIInputStream
                        this._inputStream = JSLib.createInstance(JSLib.FILE_BININSTREAM_CID, JSLib.FILE_I_BINARY_IN_STREAM);
                        this._inputStream.setInputStream(this._fileChannel.open());
                    }
                    else 
                    {
                        // wrap a nsIScriptableInputStream around the nsIInputStream
                        this._inputStream = new JSLib.FILE_InputStream();
                        this._inputStream.init(this._fileChannel.open());
                    }
                } 
                catch (e) 
                {
                    JSLib.ExceptionHandler(e)
                }
                
                break;
            }
            
            default:
                throw new Exception("NS_ERROR_FILE_INVALID_ARG "+ this._path);
        }
    }
    
    /**
     * Reads a file (that's already been opened) and returns its contents.
     * Returns a null on failure.
     * 
     * @method
     * @alias JSLib.File.prototype.read
     * @param {Number} [aSize]
     *  	optional: the number of bytes to read from the file. If it is omitted the read will 
     *  	return the entire contents of the file.
     * @example
     * <pre>
     *		 var p='/tmp/foo.dat';
     *		 var f=new Jaxer.File(p);
     *		 f.open();
     *		 myContent = f.read();
     *		 f.close();
     * </pre>
     * @exception {Error} 
     *  	Throws a Exception containing the error code.
     * @return {String, Number[]} 
     * 		If the file is text-based, returns the contents as a string; if it's
     * 		binary, returns it as an Array of bytes (numbers between 0 and 255).
     */
    File.prototype.read = function(aSize)
    {
        this.check();
        
        JSLib.raiseIfTrue(!this._inputStream, "NS_ERROR_FILE_NOT_INPUT_STREAM "+ this._path);
        
        if (this._mode != JSLib.FILE_READ_MODE) 
		{
			this.close("NS_ERROR_FILE_NOT_AVAILABLE "+ this._path);
		}
        
        try 
        {
            if (!aSize) 
			{
				aSize = this._nsIFile.fileSize;
			}
            
            var streamData;
            
            if (this._isBinary) 
			{
				streamData = this._inputStream.readByteArray(aSize);
			}
			else 
			{
				streamData = converter.ConvertToUnicode(this._inputStream.read(aSize));
			}
            
	   		this._position = this._position + streamData.length;

            return streamData;
            
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    };
    
    /**
     * Reads a single line from an open file, takes no arguments but needs an open read mode filehandle
     * returns string containing the data read on success, null on failure
     * 
     * @method
     * @alias JSLib.File.prototype.readline
     * @example
     * <pre>
     *		 var p='/tmp/foo.dat';
     *		 var f=new Jaxer.File(p);
     *		 f.open();
     *		 while(!f.EOF)
     *			 dump("line: "+f.readline()+"\n");
     * </pre>
     * @exception {Error} 
     *  	Throws a Exception containing the error code.
     * @return {String} 
     * 		<string line of foo.dat>
     */
    File.prototype.readline = function()
    {
        this.check();
        
        if (!this._inputStream) 
		{
			this.close("NS_ERROR_FILE_OBJECT_NOT_INITIALIZED_ON_READLINE "+ this._path);
		}
        
        var buf = null;
        var tmp = null;
        
        try 
        {
            if (this._lineBuffer.length < 2) 
            {
                buf = this._inputStream.read(JSLib.FILE_CHUNK);
                this._position = this._position + JSLib.FILE_CHUNK;
                
                
                if (this._position > this._nsIFile.fileSize) 
                {
                    this._position = this._nsIFile.fileSize;
                }
                
                if (buf) 
                {
                    if (this._lineBuffer.length == 1) 
                    {
                        tmp = this._lineBuffer.shift();
                        buf = tmp + buf;
                    }
//                  this._lineBuffer = buf.split(/[\n\r]/);
					this._lineBuffer = buf.split(/(\r\n|\r|\n)/);
                }
            }
            return converter.ConvertToUnicode(this._lineBuffer.shift());
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * Returns an array of individual lines read from the file on success, 
     * throws an Exception on failure
     * 
     * @method
     * @alias JSLib.File.prototype.readAllLines
     * @example
     * <pre>
     *		 var p='/tmp/foo.dat';
     *		 var f=new Jaxer.File(p);
     *		 var lines = f.readAllLines();
     * </pre>
     * @exception {Error} 
     *  Throws a Exception containing the error code.
     * @return {String} 
     *  <string array of foo.dat>
     */
    File.prototype.readAllLines = function()
    {
        this.check()
        
        try 
        {
            var fis = JSLib.createInstance(JSLib.FILE_INSTREAM_CID, "nsIFileInputStream");
            
            fis.init(this._nsIFile, -1, -1, false);
            
            var lis = JSLib.QI(fis, "nsILineInputStream");
            var line = 
            {
                value: ""
            };
            var more = false;
            var lines = [];
            
            do 
            {
                more = lis.readLine(line);
                lines.push(converter.ConvertToUnicode(line.value));
            }
            while (more);
            
            fis.close();
            return lines;
            
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    };
    
    /**
     * Checks 'end of file' status and returns boolean to indicate whether the end of file has been reached.
     * This function takes no arguments but needs an open read mode filehandle.
     * 
     * @alias JSLib.File.prototype.EOF
     * @example
     * <pre>
     *		 var p='/tmp/foo.dat';
     *		 var f=new Jaxer.File(p);
     *		 f.open();
     *		 while(!f.EOF)
     *			 dump("line: "+f.readline()+"\n");
     * </pre>
     * @exception {Error} 
     *  	Throws a Exception containing the error code.
     * @property {Boolean} 
     * 		Returns true on eof, false when not at eof
     */
    File.prototype.__defineGetter__('EOF', function()
    {
        this.check();
        
        if (!this._inputStream) 
		{
			this.close("NS_ERROR_FILE_NOT_INITIALIZED_EOF "+ this._path);
		}
        
        return (!((this._lineBuffer.length > 0) || (this._inputStream.available() > 0)))
    });
	    
    /**
     * Write provided data to a file.
     * 
     * @method
     * @alias JSLib.File.prototype.write
     * @example
     * <pre>
     *		 var p='/tmp/foo.dat';
     *		 var f=new Jaxer.File(p);
     *		 f.open("w");
     *		 f.write("some data to be written");
     * </pre>
     * @param {String|Array} 
     *  a Buffer to be written to a file, if the file is Binary then the buffer should be an array.
     * @exception {Error} 
     *  Throws a Exception containing the error code.
     */
    File.prototype.write = function(aBuffer)
    {
        this.check()
        
        if (this._mode == JSLib.FILE_READ_MODE) 
            this.close("NS_ERROR_FILE_READ_ONLY "+ this._path);
        
        if (!aBuffer) 
		{
			aBuffer = "";
		}
        
        try 
        {
            if (this._isBinary && aBuffer.constructor == Array) 
			{
				this._outStream.writeByteArray(aBuffer, aBuffer.length);
			}
			else 
			{
				var chunk = converter.ConvertFromUnicode(aBuffer);
				this._outStream.write(chunk, chunk.length);
			}
            
            this._outStream.flush();
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    /**
     * Copy to file to another location.
     * 
     * @method
     * @alias JSLib.File.prototype.copy
     * @example
     * <pre>
     *		 var p='/tmp/foo.dat';
     *		 var f=new Jaxer.File(p);
     *		 f.copy("/tmp/foo_copy.dat");
     * </pre>
     * @param {String} aDest 
     *  	the path to copy the file to.
     */
    File.prototype.copy = function(aDest)
    {
        JSLib.raiseIfTrue(!aDest, "NS_ERROR_FILE_INVALID_ARG ");
        
        this.check();
        
        JSLib.raiseIfTrue(!this.exists, "NS_ERROR_FILE_NOT_FOUND "+ this._path);
 
        try 
        {
            var dest = new JSLib.File_nsIFile(aDest);
            var copyName, dir = null;
            
            JSLib.raiseIfTrue(dest.equals(this._nsIFile), "NS_ERROR_FILE_COPY_OR_MOVE_FAILED "+ dest._path);
            JSLib.raiseIfTrue(dest.exists(), "NS_ERROR_FILE_ALREADY_EXISTS "+ dest._path);
            JSLib.raiseIfTrue(this._nsIFile.isDirectory(), "NS_ERROR_FILE_IS_DIRECTORY "+ dest._path);
            
            if (!dest.exists()) 
            {
                copyName = dest.leafName;
                dir = dest.parent;
                
                JSLib.raiseIfTrue(!dir.exists(), "NS_ERROR_FILE_NOT_FOUND "+ dir._path);
                JSLib.raiseIfTrue(!dir.isDirectory(), "NS_ERROR_FILE_DESTINATION_NOT_DIR "+ dir._path);
                
            }
            
            if (!dir) 
            {
                dir = dest;
                JSLib.raiseIfTrue(dest.equals(this._nsIFile), "NS_ERROR_FILE_COPY_OR_MOVE_FAILED "+ this._path);
                
            }
            this._nsIFile.copyTo(dir, copyName);
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * Closes an open file stream, takes a single parameter Object which will be thrown as a 
     * Exception after the close and cleanup of the file stream.
     * 
	 * @method
     * @alias JSLib.File.prototype.close
     * @example
     * <pre>
     *		 var p='/tmp/foo.dat';
     *		 var f=new Jaxer.File(p);
     *		 f.open();
     *		 f.close();
     * </pre>
     * @param {Object} exception 
     *  	the object to raise as an exception.
     */
    File.prototype.close = function(exception)
    {
    
        if (this._fileChannel) 
		{
			delete this._fileChannel;
		}
    
        if (this._transport) 
		{
			delete this._transport;
		}
        
        if (this._mode) 
		{
			this._mode = null;
		}
        
        if (this._outStream) 
        {
            this._outStream.close();
            delete this._outStream;
        }
        
        if (this._inputStream) 
        {
            this._inputStream.close();
            delete this._inputStream;
        }
        
        if (this._lineBuffer) 
		{
			this._lineBuffer = null;
		}
        
        this._position = 0;
        
        if (this._URI) 
        {
            delete this._URI;
            this._URI = null;
        }
        
        JSLib.raiseIfTrue(!!exception, exception);
    };
    
    /**
     * Creates a new file under the referenced path of the object
     * 
     * @alias JSLib.File.prototype.create
     * @exception {Error} 
     *  	Throws a Exception containing the error code.
     */
    File.prototype.create = function()
    {
        // We can probably implement this so that it can create a 
        // file or dir if a long non-existent mPath is present
        
        this.check();
        JSLib.raiseIfTrue(this.exists, "NS_ERROR_FILE_ALREADY_EXISTS "+ this._path);
 
        try 
        {
            this._nsIFile.create(JSLib.FILE_FILE_TYPE, JSLib.FILE_DEFAULT_PERMS);
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * Creates a new unique file under the referenced path of the object.
     * 
     * @alias JSLib.File.prototype.createUnique
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     */
    File.prototype.createUnique = function()
    {
        this.check();
        
        try 
        {
            this._nsIFile.createUnique(JSLib.FILE_FILE_TYPE, JSLib.FILE_DEFAULT_PERMS);
            this._path = this._nsIFile.path;
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * Return a new instance of a JSLib File object referencing the same path
     * 
     * @alias JSLib.File.prototype.clone
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {JSLib.File} 
     * 		A File object created from the path of the original file
     */
    File.prototype.clone = function()
    {
        this.check();
        return new File(this._path);
    };
    
    /**
     * Removes the referenced file object from the file system. Throws an exception is the action fails.
     * 
     * @alias JSLib.File.prototype.remove
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     */
    File.prototype.remove = function()
    {
        this.check();
        
        JSLib.raiseIfTrue(!this._path, "NS_ERROR_FILE_INVALID_PATH "+ this._path);
        JSLib.raiseIfTrue(!this.exists, "NS_ERROR_FILE_NOT_FOUND "+ this._path);
 
        this.close();
        
        try 
        {
	        JSLib.raiseIfTrue(this._nsIFile.isDirectory(), "NS_ERROR_FILE_IS_DIRECTORY "+ this._path);
            this._nsIFile.remove(false);
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    };
    
    /**
     * Truncates the file. Throws an exception if the action fails.
     * 
     * @alias JSLib.File.prototype.truncate
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     */
    File.prototype.truncate = function()
    {
        this.check();
        
        JSLib.raiseIfTrue(!this._path, "NS_ERROR_FILE_INVALID_PATH "+ this._path);
        JSLib.raiseIfTrue(!this.exists, "NS_ERROR_FILE_NOT_FOUND "+ this._path);

        JSLib.raiseIfTrue(this._mode in ['r','rb'], "NS_ERROR_FILE_MODE_IS_READ "+ this._path);

        try 
        {
	        JSLib.raiseIfTrue(this._nsIFile.isDirectory(), "NS_ERROR_FILE_IS_DIRECTORY "+ this._path);
            this._nsIFile.remove(false);
            this._nsIFile.create(JSLib.FILE_FILE_TYPE, JSLib.FILE_DEFAULT_PERMS);
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    };
    
    /**
     * Returns the current byte position in the referenced file.
     * 
	 * This method is only applicable when using the File.read() method. 
	 * If used with the File.readline() method it will return the internal 
	 * read ahead buffer position, which is unlikely to be what was expected.
 	 * 
     * @alias JSLib.File.prototype.pos
     * @example
     * <pre>
     *		 var p='/tmp/foo.dat';
     *		 var f=new Jaxer.File(p);
     *		 f.open();
     *		 while(!f.EOF){
     *			 dump("pos: "+f.pos+"\n");
     *			 dump("line: "+f.readline()+"\n");
     *		 }
     * </pre>
     * @property {Number} 
     * 		the current byte position in the referenced file
     */
    File.prototype.__defineGetter__('pos', function()
    {
        return this._position;
    });
        
    /**
     * Returns the size in bytes of the referenced file system object as reported by the OS.
     * 
     * @alias JSLib.File.prototype.size
     * @example
     * <pre>
     *		 var p='/tmp/foo.dat';
     *		 var f=new Jaxer.File(p);
     *		 f.size;
     * </pre>
     *	 outputs: int 16
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @property {Number} 
     * 		The size in bytes of the referenced file system object as reported by the OS
     */
    File.prototype.__defineGetter__('size', function()
    {
        this.check()
        
        JSLib.raiseIfTrue(!this._path, "NS_ERROR_FILE_INVALID_PATH "+ this._path);
        JSLib.raiseIfTrue(!this.exists, "NS_ERROR_FILE_NOT_FOUND "+ this._path);
        
        this.resetCache();
        
        try 
        {
			JSLib.raiseIfTrue(this.exists && this._nsIFile.isDirectory(), "NS_ERROR_FILE_IS_DIRECTORY "+ this._path);
            return this._nsIFile.fileSize;
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    }); 
        
    /**
     * Returns the extension of the file object
     * 
     * @alias JSLib.File.prototype.ext
     * @example
     * <pre>
     *		 var p='/tmp/foo.dat';
     *		 var f=new Jaxer.File(p);
     *		 alert(f.ext);
     * </pre>
     *	 outputs: dat
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @property {String} 
     * 		the file extension of the referenced filesytem object
     */
    File.prototype.__defineGetter__('ext', function()
    {
        this.check();
        
        JSLib.raiseIfTrue(!this._path, "NS_ERROR_FILE_INVALID_PATH "+ this._path);
        JSLib.raiseIfTrue(!this.exists, "NS_ERROR_FILE_NOT_FOUND "+ this._path);
        
        try 
        {
			JSLib.raiseIfTrue(this.exists && this._nsIFile.isDirectory(), "NS_ERROR_FILE_IS_DIRECTORY "+ this._path);
            var leafName = this._nsIFile.leafName;
            var dotIndex = leafName.lastIndexOf('.');
            return (dotIndex >= 0) ? leafName.substring(dotIndex + 1) : "";
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    }); 

    JSLib.File = File;

})();

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/JSLIB > fileUtils.js
 */
coreTraceMethods.TRACE('Loading fragment: fileUtils.js');
Jaxer.lastLoadedFragment = 'fileUtils.js';
(function() {

    /**
     * @classDescription {JSLib.FileUtils} This is a general class that wraps XPCOM filesystem functionality and from which File and Dir objects are derived.
     */
	
    /**
     * A helper object for filesystem access
     * 
     * @constructor
     * @alias JSLib.FileUtils
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {JSLib.FileUtils} Returns an instance of FileUtils.
     */
    function FileUtils()
    {
        this._dirUtils = new JSLib.DirUtils;
        
        // make compatible w/ nsIFile API
        this.leafName = this.leaf;
        this.fileSize = this.size;
        this.copyTo = this.copy;
    }
    
    FileUtils.prototype._dirUtils = null;
    
    /**
     * Convert a chrome path to a filesystem path
     * 
     * @alias JSLib.FileUtils.prototype.chromeToPath
     * @param {String} a chrome path
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {String} 
     * 		the chrome path as a filesystem path
     */
    FileUtils.prototype.chromeToPath = function chromeToPath(aPath)
    {
    
        JSLib.raiseIfTrue(!aPath || !/^chrome:/.test(aPath), "NS_ERROR_FTL_INVALID_ARG");
        
        var rv;
        
        try 
        {
            var ios = JSLib.getService(JSLib.FILEUTILS_IO_SERVICE_CID, "nsIIOService");
            var uri = ios.newURI(aPath, "UTF-8", null);
            var cr = JSLib.getService(JSLib.FILEUTILS_CHROME_REG_PROGID, "nsIChromeRegistry");
            rv = cr.convertChromeURL(uri);
            
            if (!JSLib.typeIsString(rv)) 
			{
				rv = cr.convertChromeURL(uri).spec;
			}
            
            // preserve the zip entry path "!/browser/content/browser.xul"
            // because urlToPath will flip the "/" on Windows to "\"
            var jarPath = "";
            if (/jar:/.test(rv)) 
            {
                rv = rv.replace(/jar:/, "");
                var split = rv.split("!");
                rv = split[0];
                jarPath = "!" + split[1];
            }
            
            if (/resource:/.test(rv)) //TODO check case specific scan
			{
				rv = rv.replace(/.*resource:/, this._dirUtils.getCurProcDir());
			}
            
            if (/^file:/.test(rv)) //TODO check case specific scan 
			{
				rv = this.urlToPath(rv);
			}
			else 
			{
				rv = this.urlToPath("file://" + rv);
			}
            
            rv += jarPath;
            
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
        return rv;
    };
    
    
    /**
     * Convert a file protocol URL to a filesystem path
     * 
     * @alias JSLib.FileUtils.prototype.urlToPath
     * @param {String} a URL
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {String} 
     * 		the URL as a filesystem path
     */
    FileUtils.prototype.urlToPath = function urlToPath(aPath)
    {
        JSLib.raiseIfTrue(!aPath || !/^file:/.test(aPath), "NS_ERROR_FTL_INVALID_ARG");
        
        try 
        {
            var ph = JSLib.createInstance(JSLib.FILEUTILS_FILEPROTOCOL_CID, "nsIFileProtocolHandler");
            return ph.getFileFromURLSpec(aPath).path;
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * Convert a filesystem path to a file protocol URL
     * 
     * @alias JSLib.FileUtils.prototype.pathToURL
     * @param {String} a path
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {String} 
     * 		the filesystem path as a URL
     */
    FileUtils.prototype.pathToURL = function pathToUrl(aPath)
    {
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FTL_INVALID_ARG");
        try 
        {
            var ph = JSLib.createInstance(JSLib.FILEUTILS_FILEPROTOCOL_CID, "nsIFileProtocolHandler");
            return ph.getURLSpecFromFile(this.nsIFile(aPath));
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * A boolean indicator of whether the referenced object physically exists on the filesystem.
     * 
     * @method
     * @alias JSLib.FileUtils.prototype.exists
     * @exception	{Error} 
     * 		Throws a Exception containing the error code.
     * @return {Boolean} 
     * 		true if file exists otherwise false
     */
   FileUtils.prototype.exists = function exists(aPath)
    {
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FTL_INVALID_ARG");
        
        try 
        {
            return (new JSLib.FILEUTILS_nsIFile(aPath)).exists();
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * Removes the referenced object physically from the filesystem.
     * 
     * @method
     * @alias JSLib.FileUtils.prototype.remove
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     */
    FileUtils.prototype.remove = function remove(aPath)
    {
    
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FTL_INVALID_ARG");
        JSLib.raiseIfTrue(!this.exists(aPath), "NS_ERROR_FTL_FILE_TARGET_DOES_NOT_EXIST");
        
        try 
        {
            var nsIFile = new JSLib.FILEUTILS_nsIFile(aPath);
            JSLib.raiseIfTrue(nsIFile.isDirectory(), "NS_ERROR_FTL_FILE_IS_DIRECTORY");
            nsIFile.remove(false);
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * Copies the source path to the destination path
     * @alias JSLib.FileUtils.prototype.copy
     * @param {String}  source path
     * 		The source path
     * @param {String}  destination path
     * 		The destination apth
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     */
    FileUtils.prototype.copy = function copy(aSource, aDest)
    {
    
        JSLib.raiseIfTrue(!aSource || !aDest, "NS_ERROR_FTL_INVALID_ARG");
        JSLib.raiseIfTrue(!this.exists(aSource), "NS_ERROR_FTL_UNEXPECTED");
        
        try 
        {
            var nsIFile = new JSLib.FILEUTILS_nsIFile(aSource);
            var dir = new JSLib.FILEUTILS_nsIFile(aDest);
            var copyName = nsIFile.leafName;
            
            JSLib.raiseIfTrue(nsIFile.isDirectory(), "NS_ERROR_FTL_FILE_IS_DIRECTORY");
            
            if (!this.exists(aDest) || !dir.isDirectory()) 
            {
                copyName = dir.leafName;
                dir = new JSLib.FILEUTILS_nsIFile(dir.path.replace(copyName, ''));
                
                JSLib.raiseIfTrue(!this.exists(dir.path), "NS_ERROR_FTL_FILE_ALREADY_EXISTS");
                JSLib.raiseIfTrue(!dir.isDirectory(), "NS_ERROR_FTL_FILE_INVALID_PATH");
            }
            
            JSLib.raiseIfTrue(this.exists(this.append(dir.path, copyName)), "NS_ERROR_FTL_FILE_ALREADY_EXISTS");
            
            nsIFile.copyTo(dir, copyName);
            
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    };
    
 	/**
     * Returns the leaf (filename + extension) portion of the file path
     *  
     * @method
     * @alias JSLib.FileUtils.prototype.leaf
     * @param {String} 
     * 		a filesystem path
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {String} 
     * 		The leaf name
     */
    FileUtils.prototype.leaf = function leaf(aPath)
    {
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FTL_INVALID_ARG");
        
        try 
        {
            var nsIFile = new JSLib.FILEUTILS_nsIFile(aPath);
            return nsIFile.leafName;
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    };
    
    /**
     * Changes the path of the filesystem object by appending the provided leaf value.
     * 
     * @alias JSLib.FileUtils.prototype.append
     * @param {String}  leafname
     * 		The leafname to be appended
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {String} 
     * 		The appended directory and leafname
     */
    FileUtils.prototype.append = function append(aDirPath, aFileName)
    {
    
        JSLib.raiseIfTrue(!aDirPath || !aFileName, "NS_ERROR_FTL_INVALID_ARG");
        JSLib.raiseIfTrue(!this.exists(aDirPath), "NS_ERROR_FTL_FILE_NOT_FOUND");
        
        try 
        {
            var nsIFile = new JSLib.FILEUTILS_nsIFile(aDirPath);
            
            JSLib.raiseIfTrue(nsIFile.exists() && !nsIFile.isDirectory(), "NS_ERROR_FTL_INVALID_ARG");
            
            nsIFile.append(aFileName);
            var rv = nsIFile.path;
            delete nsIFile;
            return rv;
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * This function will validate the numeric permissions value provided, if true
     * the permissions value is valid, if false the value is invalid.
     * 
     * @alias JSLib.FileUtils.prototype.validatePermissions
     * @param {Number} the chmod style permission (0777,0622 etc)
     * @exception	{Error} Throws a Exception containing the error code.
     * @return {Boolean} indicates whether the permissions are valid
     */
    FileUtils.prototype.validatePermissions = function(aNum)
    {
        return (parseInt(aNum.toString(10).length) >= 3)
    };
    
    /**
     * Get the file permissions for the File object
     * 
     * @method
     * @alias JSLib.FileUtils.prototype.permissions
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {String} 
     * 		the chmod style permissions of the file
     */
    FileUtils.prototype.permissions = function permissions(aPath)
    {
    
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FTL_INVALID_ARG");
        JSLib.raiseIfTrue(!this.exists(aPath), "NS_ERROR_FTL_FILE_NOT_FOUND");
        
        try 
        {
            return (new JSLib.FILEUTILS_nsIFile(aPath)).permissions.toString(8);
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    };
    
    /**
     * The last modified timestamp as reported by the OS
     * 
     * @method
     * @alias JSLib.FileUtils.prototype.dateModified
     * @exception	{Error} 
     * 		Throws a Exception containing the error code.
     * @return {Object} 
     * 		a date object representing the last modified timestamp of the file
     */
    FileUtils.prototype.dateModified = function dateModified(aPath)
    {
    
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FTL_INVALID_ARG");
        JSLib.raiseIfTrue(!this.exists(aPath), "NS_ERROR_FTL_FILE_NOT_FOUND");
        
        try 
        {
            return new Date((new JSLib.FILEUTILS_nsIFile(aPath)).lastModifiedTime).toLocaleString();
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * Returns the size in bytes as reported by the OS
     * 
     * @alias JSLib.FileUtils.prototype.size
     * @param {String}  source path
     * 		The path to the filesystem object
     * @exception	{Error} 
     * 		Throws a Exception containing the error code.
     * @return {Number} 
     * 		the size of the file in bytes
     */
    FileUtils.prototype.size = function size(aPath)
    {
    
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FTL_INVALID_ARG");
        JSLib.raiseIfTrue(!this.exists(aPath), "NS_ERROR_FTL_FILE_NOT_FOUND");
        
        try 
        {
            return (new JSLib.FILEUTILS_nsIFile(aPath)).fileSize;
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * Returns the extension of the file object
     * 
     * @alias JSLib.FileUtils.prototype.ext
     * @example
     * <pre>
     *		 var p='/tmp/foo.dat';
     *		 var f=new File(p);
     *		 alert(f.ext);
     * </pre>
     *	 outputs: dat
     * @param {String} aPath
     * 		The path to the filesystem object 
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {String} 
     * 		the file extension of the referenced filesytem object
     */
    FileUtils.prototype.ext = function ext(aPath)
    {
    
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FTL_INVALID_ARG");
        JSLib.raiseIfTrue(!this.exists(aPath), "NS_ERROR_FTL_FILE_NOT_FOUND");
        
        try 
        {
            var leafName = (new JSLib.FILEUTILS_nsIFile(aPath)).leafName;
            var dotIndex = leafName.lastIndexOf('.');
            return (dotIndex >= 0) ? leafName.substring(dotIndex + 1) : "";
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
	/**
     * Returns the path of the parent filesystem object
     *  
     * @method
	 * @alias JSLib.FileUtils.prototype.parent
     * @param {String} aPath
     * 		The path to the filesystem object 
	 * @return {String}
	 * 		The path of the parent file system object
	 */
    FileUtils.prototype.parent = function parent(aPath)
    {
    
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FTL_INVALID_ARG");
        
        try 
        {
            var nsIFile = new JSLib.FILEUTILS_nsIFile(aPath);
            
            JSLib.raiseIfTrue(!nsIFile.exists(), "NS_ERROR_FTL_FILE_NOT_FOUND");
            
            if (nsIFile.isFile()) 
			{
				return nsIFile.parent.path;
			}
			else 
			{
				return (nsIFile.isDirectory()) ? nsIFile.path : null;
			}
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * Trys to execute the requested file as a separate
     * *non-blocking* process.
     * Passes the supplied *array* of arguments on the command line if
     * the OS supports it.
     * 
     * @alias JSLib.FileUtils.prototype.run
     * @param {String} aPath
     * 		a filesystem path
     * @param {Array}  aArgs
     * 		a set of arguments passed to the command to be run
     * @exception	{Error} 
     * 		Throws a Exception containing the error code.
     * @return {Number} 
     * 		the exit code of the process
     */
    FileUtils.prototype.run = function run(aPath, aArgs)
    {
    
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FTL_INVALID_ARG");
        JSLib.raiseIfTrue(!this.exists(aPath), "NS_ERROR_FTL_FILE_NOT_FOUND");
        
        var len = 0;
        if (aArgs) 
		{
			len = aArgs.length;
		}
		else 
		{
			aArgs = null;
		}
        
        try 
        {
            var nsIFile = new JSLib.FILEUTILS_nsIFile(aPath);
            
            // XXX commenting out this check as it fails on OSX 
            // if (!nsIFile.isExecutable()) 
            // throw new Exception("NS_ERROR_FTL_INVALID_ARG");
            
            JSLib.raiseIfTrue(nsIFile.isDirectory(), "NS_ERROR_FTL_FILE_IS_DIRECTORY");
            
            /* 
             * Create and execute the process ...
             *
             * NOTE: The first argument of the process instance's 'run' method
             *			 below specifies the blocking state (false = non-blocking).
             *			 The last argument, in theory, contains the process ID (PID)
             *			 on return if a variable is supplied--not sure how to implement
             *			 this with JavaScript though.
             */
            var theProcess = JSLib.createInstance(JSLib.FILEUTILS_PROCESS_CID, "nsIProcess");
            theProcess.init(nsIFile);
            return theProcess.run(false, aArgs, len);
            
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * Creates a file on the filesystem with the default permissions
     * 
     * @alias JSLib.FileUtils.prototype.create
     * @param {String} aPath
     * 		a file system path
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     */
    FileUtils.prototype.create = function create(aPath)
    {
    
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FTL_INVALID_ARG");
        
        try 
        {
            var f = new JSLib.FILEUTILS_nsIFile(aPath);
            f.create(f.NORMAL_FILE_TYPE, 0644);
            rv = JSLib.OK;
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    /**
     * Returns a boolean indicator that is true for a valid path and false otherwise
     * 
     * @alias JSLib.FileUtils.prototype.isValidPath
     * @param {String}  aPath
     * 		a file system path
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {Boolean} 
     * 		true if valid path was requested
     */
    FileUtils.prototype.isValidPath = function isValidPath(aPath)
    {
    
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FTL_INVALID_ARG");
        
        try 
        {
            var f = new JSLib.FILEUTILS_nsIFile(aPath);
            return true;
        } 
        catch (e) 
        {
            return false;
        }
    };
    
    /**
     * Returns an nsIFIle object for the specified path
     * 
     * @alias JSLib.FileUtils.prototype.nsIFile
     * @param {String}  aPath
     * 		a file system path
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     * @return {Object} 
     * 		nsIFile
     */
    FileUtils.prototype.nsIFile = function nsIFile(aPath)
    {
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_FTL_INVALID_ARG");
        
        try 
        {
            return new JSLib.FILEUTILS_nsIFile(aPath);
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    JSLib.FileUtils = FileUtils;
   
})();

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/JSLIB > dir.js
 */
coreTraceMethods.TRACE('Loading fragment: dir.js');
Jaxer.lastLoadedFragment = 'dir.js';
(function(){  
	
    // TODO FIX - permissions seems to be ignored on folder objects
    
    /**
     * @classDescription {JSLib.Dir} This is the class that wraps the XPCOM directory/folder handling
     */
    
	/**
     * Creates a new Directory handle for performing filesystem directory operations.
     * 
     * @constructor
	 * @extends {JSLib.Filesystem}
     * @alias JSLib.Dir
     * @param {String} aPath 
     *  	a java style path object where double backslash is used as a folder hierarchy delimiter
     * @exception {Error} 
     * 		Throws an exception containing the error code.
     * @return {JSLib.Dir} 
     * 		a Dir object reference initialized to the provided path.
     */
    function Dir(aPath)
    {
        JSLib.raiseIfTrue(!aPath, "NS_ERROR_DIR_XPC_NOT_ENOUGH_ARGS");
        return this.initPath((JSLib.typeIsObj(aPath) ? aPath.path : arguments));
    }
    
    Dir.prototype = new JSLib.Filesystem;
	Dir.prototype._nsIFile = null;
        
    /**
     * Creates a new folder under the referenced path of the directory object
     * 
	 * The format of the permissions is a unix style numeric chmod i.e. 0777 or 444
	 * 
	 * on Windows, you can only set the Read/Write bits of a file. And User/Group/Other will have the SAME 
     * settings based on the most-relaxed setting (Read 04, 040, 0400, Write 02, 020, 0200). When a file is created, 
     * by default it has both Read and Write permissions. Also, you cannot set the file permission to WRITE-ONLY, doing 
     * so would set it to read-write
	 *		
     * @method
     * @alias JSLib.Dir.prototype.create
     * @param {String} aPermissions
     * 		The permissions used to create the filesystem object.
     * 
     * @exception {Error} 
     * 		Throws a Exception containing the error code if filesytem object is unable to be created.
     */
    Dir.prototype.create = function(aPermissions)
    {
        JSLib.raiseIfTrue(this.exists, "NS_ERROR_DIR_FILE_ALREADY_EXISTS : " + this._path);
        
        var checkedPerms;
        
        if (JSLib.typeIsNum(aPermissions)) 
        {
            checkedPerms = this.validatePermissions(aPermissions);
            JSLib.raiseIfTrue(!checkedPerms, "NS_ERROR_DIR_INVALID_ARG "+ this._path);
            checkedPerms = aPermissions;
        }
        else 
        {
            var p = this._nsIFile.parent;
            while (p && !p.exists()) 
			{
				p = p.parent;
			}
            
            checkedPerms = p.permissions;
        }
        
        if (!checkedPerms) 
		{
			checkedPerms = JSLib.DIR_DEFAULT_PERMS;
		}
		
        try 
        {
            this._nsIFile.create(JSLib.DIR_DIRECTORY, checkedPerms);
         } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e);
        }
        
    };
	
	/**
	 * Creates a hierarchy of folders as needed to contain the current folder's path.
	 * The format of the permissions is the same as for the create method.
	 * 
     * @method
     * @alias JSLib.Dir.prototype.createHierarchy
     * @param {String} aPermissions
     * 		The permissions used to create al the filesystem objects
     * 
     * @exception {Error} 
     * 		Throws a Exception containing the error code if any filesytem object is unable to be created.
	 */
	Dir.prototype.createHierarchy = function(aPermissions)
	{
		var current = this._nsIFile;
		var toCreate = [];
		// First walk up until we find something that exists, accumulating directories to create
		while (current && !current.exists())
		{
			try
			{
				toCreate.unshift(new Dir(current.path));
				current = current.parent;
			}
			catch (e)
			{
				JSLib.ExceptionHandler(e);
			}
		}
		// Then walk back down, creating as we go along
		toCreate.forEach(function(dir)
		{
			dir.create(aPermissions);
		});
	}
    
    /**
     * Create a new unique folder under the referenced path of the directory object
     * 
	 * The format of the permissions is a unix style numeric chmod i.e. 0777 or 444
	 * 
	 * on Windows, you can only set the Read/Write bits of a file. And User/Group/Other will have the SAME 
     * settings based on the most-relaxed setting (Read 04, 040, 0400, Write 02, 020, 0200). When a file is created, 
     * by default it has both Read and Write permissions. Also, you cannot set the file permission to WRITE-ONLY, doing 
     * so would set it to read-write

     * @method
     * @alias JSLib.Dir.prototype.createUnique
     * @param {String} aPermissions
     * 		The permissions used to create the filesystem object, this may be ignored by some versions of windows.
     * @exception {Error} 
     * 		Throws an Exception containing the error code.
     */
    Dir.prototype.createUnique = function(aPermissions)
    {
        this.check();
        
        var checkedPerms;
        if (JSLib.typeIsNum(aPermissions)) 
        {
            checkedPerms = this.validatePermissions(aPermissions);
            
            if (!checkedPerms) 
			{
				throw new Exception("NS_ERROR_DIR_INVALID_ARG"+ this._path);
			}
			
            checkedPerms = aPermissions;
        }
        else 
        {
            var p = this._nsIFile.parent;
            while (p && !p.exists()) 
			{
				p = p.parent;
			}
            checkedPerms = p.permissions;
        }
        
        if (!checkedPerms) 
		{
			checkedPerms = JSLib.DIR_DEFAULT_PERMS;
		}
        
        try 
        {
            this._nsIFile.createUnique(JSLib.DIR_DIRECTORY, checkedPerms);
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    };
    
    /**
     * Read the contents of a directory
     * 
     * @method
     * @alias JSLib.Dir.prototype.readDir
     * @exception {Error} 
     * 		Throws an Exception containing the error code.
     * @return {Jaxer.Filesystem[]} 
     * 		an Array of Filesystem Objects, with no sort order explicitly set.
     */
    Dir.prototype.readDir = function()
    {
        JSLib.raiseIfTrue(!this.exists, "NS_ERROR_DIR_FILE_TARGET_DOES_NOT_EXIST "+ this._path);
        
        try 
        {
            JSLib.raiseIfTrue(!this.isDir, "NS_ERROR_DIR_FILE_NOT_DIRECTORY "+ this._path);
            
            var files = this._nsIFile.directoryEntries;
            var listings = new Array();
            var file;
            
            while (files.hasMoreElements()) 
            {
                file = files.getNext().QueryInterface(Components.interfaces.nsILocalFile);
				
                if (file.isFile()) 
				{
					listings.push(new JSLib.Filesystem(file.path));
				}
				
                if (file.isDirectory()) 
				{
					listings.push(new JSLib.Dir(file.path));
				}
            }
            
            return listings;
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    };
    
    /**
     * Clone a directory object
     * 
     * @method
     * @alias JSLib.Dir.prototype.clone
     * @exception {Error} 
     * 		Throws an Exception containing the error code.
     * @return {JSLib.Dir} 
     * 		an new Dir Object cloned from the original
     */
    Dir.prototype.clone = function()
    {
        this.check();
        return new JSLib.Dir(this._path);
    };
    
    /**
     * Tests whether a file Object exists in the Physical directory referenced by the Dir object
     * 
     * @method
     * @alias JSLib.Dir.prototype.contains
     * @param {Object} aFileObj
     * 		the aFileObj parameter may be either a JSLib file object or a string containing the name of the object.
     * @exception {Error} 
     * 		Throws an Exception containing the error code.
     * @return {Boolean} 
     * 		True/False indicates whether the file was found;
     */
    Dir.prototype.contains = function(aFileObj)
    {
        JSLib.raiseIfTrue(!aFileObj, "NS_ERROR_DIR_INVALID_ARG "+ this._path);
        
        this.check();
        
        try 
        {
            var fo = (typeof(aFileObj.nsIFile) == "object") ? aFileObj.nsIFile : fo = aFileObj;
            return this._nsIFile.contains(fo, true);
        } 
        catch (e) 
        {
            return false;
        }
    };
    
    /**
     * Removes specified folder from the file system
     * 
     * @method
     * @alias JSLib.Dir.prototype.remove
     * @param {Boolean} aRecursive
     * 		True/False value to indicate whether the removal includes subfolders.
     * @exception {Error} 
     * 		Throws a Exception containing the error code.
     */
    Dir.prototype.remove = function(aRecursive)
    {
        if (typeof(aRecursive) != 'boolean') 
		{
			aRecursive = false;
		}
        
        JSLib.raiseIfTrue(!this._path,    "NS_ERROR_DIR_INVALID_ARG "+ this._path);
        JSLib.raiseIfTrue(!this.exists, "NS_ERROR_DIR_FILE_TARGET_DOES_NOT_EXIST "+ this._path);
        JSLib.raiseIfTrue(!this.isDir,  "NS_ERROR_DIR_FILE_NOT_DIRECTORY "+ this._path);
        
        try 
        {
            this._nsIFile.remove(aRecursive);
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
    };
    
    JSLib.Dir = Dir;

})();

/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/JSLIB > dirUtils.js
 */
coreTraceMethods.TRACE('Loading fragment: dirUtils.js');
Jaxer.lastLoadedFragment = 'dirUtils.js';

(function(){

    /**
     * @namespace {JSLib.DirUtils} This is a utility class that wraps XPCOM directory/folder utility functions
     */
	
    /**
     * Directory Utility helper object
     * 
     * @constructor
     * @alias JSLib.DirUtils
     * @return {JSLib.DirUtils} Returns an instance of DirUtils.
     * 
     */
    function DirUtils() { }
    
    DirUtils.prototype.useObj = false;
    
    /**
     * Resolve the path for the requested folder.
     * 
     * @private
     * @alias JSLib.DirUtils.prototype.getPath
     * 
     */
    DirUtils.prototype.getPath = function(aAppID)
    {
    
        JSLib.raiseIfTrue(!aAppID, "NS_ERROR_DU_INVALID_ARG");
        
        var rv;
        
        try 
        {
            rv = JSLib.getService(JSLib.DIRUTILS_FILE_DIR_CID, JSLib.DIRUTILS_I_PROPS).get(aAppID, JSLib.DIRUTILS_NSIFILE);
            if (this.useObj) 
            {
                if (rv.isFile()) 
                {
                    rv = new JSLib.File(rv.path);
                }
                else 
                    if (rv.isDirectory()) 
                    {
                        rv = new JSLib.Dir(rv.path);
                    }
            }
            else 
            {
                rv = rv.path;
            }
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        return rv;
    };
        
    /**
     * Return the path to the current folder the process is running from.
     *  
     * @alias JSLib.DirUtils.prototype.current
     * @property {String}
     * 		the path to the current folder the process is running from
     * 
     */
    DirUtils.prototype.__defineGetter__('current', function()
    {
        return this.getPath(JSLib.NS_OS_CURRENT_PROCESS_DIR);
    });
		
    /**
     * Returns the home folder of the current user.
     * 
     * @alias JSLib.DirUtils.prototype.getHome
     * @property {String}
     * 		the home folder of the current user
     */
	DirUtils.prototype.getHome = function () { return this.getPath(JSLib.NS_OS_HOME_DIR); }
    
    /**
     * Returns the deskTop Folder of the current user.
     * 
     * @alias JSLib.DirUtils.prototype.desktopDir
     * @property {String}
     * 		the deskTop Folder of the current user
     */
    DirUtils.prototype.__defineGetter__('desktop', function()
    {
        return this.getPath(JSLib.NS_OS_DESKTOP_DIR);
    });
	
    /**
     * Returns the Jaxer temp Folder.
     * 
     * @alias JSLib.DirUtils.prototype.temp
     * @property {String}
     * 		the jaxer temp 
     */
    DirUtils.prototype.__defineGetter__('temp', function()
    {
        return this.getPath(JSLib.NS_OS_TEMP_DIR);
    });
	   
    JSLib.DirUtils = DirUtils;
    
})();


/*
 * fragment : /opt/emrajs/server/src/mozilla/aptana/../../../framework/JSLIB > networkUtils.js
 */
coreTraceMethods.TRACE('Loading fragment: networkUtils.js');
Jaxer.lastLoadedFragment = 'networkUtils.js';
(function() {

    /**
     * @classDescription {JSLib.NetworkUtils} This is a utility class that wraps XPCOM Network utility functions
     */
	
    /**
     * Network Utility helper object
     * 
     * @constructor
     * @alias JSLib.NetworkUtils
     * @return {JSLib.NetworkUtils}
     */
    function NetworkUtils()
    {
    }
    
    NetworkUtils.prototype = 
    {
        _CallBack: null,
        _ValidateURI: null,
    }
    
    NetworkUtils.prototype._callback = function()
    {
        JSLib.raiseIfTrue(JSLib.typeIsFunc(this.callback), "callback is not a function ...");
        this.callback();
    };
    
    NetworkUtils.prototype.__defineGetter__('callback', function()
    {
        return this._CallBack;
    });
    
    NetworkUtils.prototype.__defineGetter__('callback', function(aVal)
    {
        this._CallBack = aVal;
    });
    
    /**
     * Invokes the XPCOM nsIURIFixup method and return a 'fixed' URI
     * 
     * @alias JSLib.NetworkUtils.prototype.fixupURI
     * @param {Object} aURI
     * 		The URI to process
     * @return {String} 
     * 		The fixed URI as a string
     */
	NetworkUtils.prototype.fixupURI = function(aURI)
    {
    
        JSLib.raiseIfTrue(!aURI, "NS_ERROR_XPC_NOT_ENOUGH_ARGS");
        try 
        {
            var fixupURI = JSLib.createInstance(JSLib.NETUTILS_URIFIXUP, "nsIURIFixup");
            
            // FIXUP_FLAG_NONE = 0
            var uri = fixupURI.createFixupURI(aURI, 0);
            
            if (uri) 
			{
				return uri;
			}
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        return null;
        
    };
    
    /**
     * Validates the provided URI using XPCOM and returns JSLib.Ok if successful
     * 
     * @alias JSLib.NetworkUtils.prototype.validateURI
     * @param {Object} aURI
     * 		The	URI to validate
     */
	NetworkUtils.prototype.validateURI = function(aURI)
    {
        JSLib.raiseIfTrue(!aURI, "NS_ERROR_XPC_NOT_ENOUGH_ARGS");
        
        var uri = aURI;
        
        if (JSLib.instanceOf(aURI, "nsIURI")) 
		{
			uri = aURI.spec;
		}
        
        this._ValidateURI = uri;
        
        try 
        {
            uri = this.fixupURI(uri);
            
            var checker = JSLib.createInstance(JSLib.NETUTILS_URICHECK, "nsIURIChecker");
            checker.init(uri);
            checker.loadFlags = Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
            
            checker.asyncCheck(this, null);
            return JSLib.OK;
            
        } 
        catch (e) 
        {
            JSLib.ExceptionHandler(e)
        }
        
    };
    
    /**
     * Returns a QueryInterface for the provided XPCOM Interface ID
     * 
     * @alias JSLib.NetworkUtils.prototype.QueryInterface
     * @param {Object} iid
     * 		the requested XPCOM Interface ID
     */
	NetworkUtils.prototype.QueryInterface = function(iid)
    {
        JSLib.raiseIfTrue(!iid.equals(Components.interfaces.nsIRequestObserver) && !iid.equals(Components.interfaces.nsISupports) && !iid.equals(Components.interfaces.nsIInterfaceRequestor), Components.results.NS_ERROR_NO_INTERFACE);
        return this;
    };
    
    /**
     * A stub function to be overridden 
     * 
     * @alias JSLib.NetworkUtils.prototype.onStartRequest
     * @param {Object} aRequest
     * 	 	request object
     * @param {Object} aContext
     * 		the contextual object for this request
     */
	NetworkUtils.prototype.onStartRequest = function(aRequest, aContext)
    {
    };
    
    /**
     * Invokes the callback function for completed requests
     * 
     * @alias JSLib.NetworkUtils.prototype.onStopRequest
     * @param {Object} aRequest
     * 		the request object
     * @param {Object} aContext
     * 		the current context of the request context
     * @param {Object} aStatus
     * 		the current status of the request object
     */
	NetworkUtils.prototype.onStopRequest = function(aRequest, aContext, aStatus)
    {
        var cb = this.callback;
        if (aStatus == 0) 
        {
            if (JSLib.typeIsFunc(this.callback)) 
			{
				setTimeout(cb, 1, true);
			}
        }
        else 
        {
            if (JSLib.typeIsFunc(this.callback)) 
			{
				setTimeout(cb, 1, false);
			}
        }
        aRequest.cancel(Components.results.NS_ERROR_ABORT);
    };
    
    JSLib.NetworkUtils = NetworkUtils;
    
})();