/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is mozilla.org code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 1998
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/*
 * JavaScript test library shared functions file for running the tests
 * in the browser.  Overrides the shell's print function with document.write
 * and make everything HTML pretty.
 *
 * To run the tests in the browser, use the mkhtml.pl script to generate
 * html pages that include the shell.js, browser.js (this file), and the
 * test js file in script tags.
 *
 * The source of the page that is generated should look something like this:
 *      <script src="./../shell.js"></script>
 *      <script src="./../browser.js"></script>
 *      <script src="./mytest.js"></script>
 */

function htmlesc(str) { 
  if (str == '<') 
    return '&lt;'; 
  if (str == '>') 
    return '&gt;'; 
  if (str == '&') 
    return '&amp;'; 
  return str; 
}

function DocumentWrite(s)
{
  try
  {
    var msgDiv = document.createElement('div');
    msgDiv.innerHTML = s;
    document.body.appendChild(msgDiv);
    msgDiv = null;
  }
  catch(excp)
  {
    document.write(s + '<br>\n');
  }
}

function print() { 
  var s = ''; 
  var a;
  for (var i = 0; i < arguments.length; i++) 
  { 
    a = arguments[i]; 
    s += String(a) + ' '; 
  } 

  if (typeof dump == 'function')
  {
    dump( s + '\n');
  }

  s = s.replace(/[<>&]/g, htmlesc);

  DocumentWrite(s);
}

var testcases = new Array();
var tc = testcases.length;
var bug = '';
var summary = '';
var description = '';
var expected = '';
var actual = '';
var msg = '';

function TestCase(n, d, e, a)
{
  this.path = (typeof gTestPath == 'undefined') ? '' : gTestPath;
  this.name = n;
  this.description = d;
  this.expect = e;
  this.actual = a;
  this.passed = ( e == a );
  this.reason = '';
  this.bugnumber = typeof(bug) != 'undefined' ? bug : '';
  testcases[tc++] = this;
}

var gInReportCompare = false;

var _reportCompare = reportCompare;

reportCompare = function(expected, actual, description)
{
  gInReportCompare = true;

  var testcase = new TestCase(gTestName, description, expected, actual);
  testcase.passed = _reportCompare(expected, actual, description);

  gInReportCompare = false;
};

var _reportFailure = reportFailure;
reportFailure = function (msg, page, line)
{
  var testcase;
  var jsOptions = new JavaScriptOptions();

  jsOptions.setOption('strict', false);
  jsOptions.setOption('werror', false);

  if (gInReportCompare)
  {
    testcase = testcases[tc - 1];
    testcase.passed = false;
  }
  else 
  {
    if (typeof(summary) == "undefined")
    {
      summary = "unknown";
    }
    if (typeof(expect) == "undefined")
    {
      expect = "unknown";
    }
    testcase = new TestCase(gTestName, summary, expect, "error");
    if (document.location.href.indexOf('-n.js') != -1)
    {
      // negative test
      testcase.passed = true;
    }
  }

  testcase.reason += msg;

  if (typeof(page) != 'undefined')
  {
    testcase.reason += ' Page: ' + page;
  }
  if (typeof(line) != 'undefined')
  {
    testcase.reason += ' Line: ' + line;
  }
  if (!testcase.passed)
  {
    _reportFailure(msg);
  }

  gDelayTestDriverEnd = false;
  jsTestDriverEnd();

};

function quit()
{
}

window.onerror = reportFailure;

function gc()
{
  // Thanks to igor.bukanov@gmail.com
  var tmp = Math.PI * 1e500, tmp2;
  for (var i = 0; i != 1 << 15; ++i) 
  {
    tmp2 = tmp * 1.5;
  }
}

function jsdgc()
{
  try
  {
    // Thanks to dveditz
    netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
    var jsdIDebuggerService = Components.interfaces.jsdIDebuggerService;
    var service = Components.classes['@mozilla.org/js/jsd/debugger-service;1'].
      getService(jsdIDebuggerService);
    service.GC();
  }
  catch(ex)
  {
    print('gc: ' + ex);
  }
}
