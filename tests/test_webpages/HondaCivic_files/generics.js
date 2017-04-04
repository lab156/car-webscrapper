/*******************************************************************************\
*                                                                               *
*  WebChat Integration Sample © 2012 Avaya, All rights reserved.            *
*                                                                               *
\*******************************************************************************/





/**
 * collection of generic common purpose functions
 */

var comergo_jsgenerics_util = {

	/**
	 * trims the given string
	 * all whitespace characters at the beginning and the end will be deleted
	 *
	 * @param str the string to trim
	 * @returns the trimmed string
	 */
	trim : function(str) {
		str = str.replace(/^[\s]*/,'').replace(/[\s]*$/,'');
		return str;
	},


	/**
	 * escapes HTML control chars
	 * 
	 * @param the HTML code to escape
	 * @returns the escaped string
	 */
	escapeHTML : function(string)
	{
	    var pre = document.createElement('pre');
	    var text = document.createTextNode(string);
	    pre.appendChild(text);
	    return pre.innerHTML;
	}
};


var comergo_jsgenerics_ajax = {

		/**
		 * creates a new XMLHttpRequest Object
		 *
		 * the method respects different browser types
		 *
		 * @returns the new XMLHttpRequest or null of there is an error
		 */
		createXMLHttpRequestObject : function()
		{
			var xmlHttp = null;
			try {
			    // Mozilla, Opera, Safari sowie Internet Explorer (since v7)
			    xmlHttp = new XMLHttpRequest();
			} catch(e) {
			    try {
			        // MS Internet Explorer (ab v6)
			        xmlHttp  = new ActiveXObject("Microsoft.XMLHTTP");
			    } catch(e) {
			        try {
			            // MS Internet Explorer (ab v5)
			            xmlHttp  = new ActiveXObject("Msxml2.XMLHTTP");
			        } catch(e) {
			            xmlHttp  = null;
			        }
			    }
			}
			return xmlHttp;
		},


		post : function (url, body, responseCallback, errorCallback) {
			this.request(url, responseCallback, errorCallback, "POST", body);
		},


		request : function (url, responseCallback, errorCallback, method, body)
		{
			// first ensure that we have valid parameters
			// this may help in the rest of the code
			if (!url || url == null) {
				return;
			}
			if (!responseCallback || responseCallback == null) {
				return;
			}

			var http = this.createXMLHttpRequestObject();
			if (http === null) {
				return;
			}

			if (http.overrideMimeType) {
				http.overrideMimeType('text/xml');
			}

			if (!method || method == null) {
				http.open("GET", url, true);
			} else {
				http.open(method, url, true);
			}

			http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			http.setRequestHeader("Pragma", "no-cache");
			http.setRequestHeader("Cache-Control", "no-cache");

			http.onreadystatechange = function () {
				// this is a inline function declaration
				// we use this this way, as we can save functions and
				// the code here located where it fits best
				if (http.readyState == 4) {
					try {
						if (http.status == 200) {
							var result = "";
							if (http.responseText) {
								result = http.responseText;
							}
							responseCallback(result);
						} else {
							if (errorCallback || errorCallback != null) {
								errorCallback(http);
							}
						}
					} catch (e) {}
				}
			};
			if (!body || body == null) {
				http.send(null);
			} else {
				http.send(body);
			}

		}
};




