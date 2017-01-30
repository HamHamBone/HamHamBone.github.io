var URLParam = {};

// creates a string 
URLParam.encode = function(values) {
	var result = "";
	
	var keys = Object.keys(values);
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var val = values[key];
		
		result += encodeURI(key) + "=" + encodeURI(val);
		
		if (i < keys.length - 1) { result += "&"; }
	}
	
	return window.location.protocol + '//' + window.location.host + window.location.pathname + "?" + result + window.location.hash;
}

URLParam.decode = function() {
	var paramURL = window.location.search;
	paramURL = paramURL.replace("?", "");
	
	var pairs = paramURL.split("&");
	
	var values = {};
	
	for (var i = 0; i < pairs.length; i++) {
		var splitPair = pairs[i].split("=",2);
		
		var key = splitPair[0];
		var val = "";
		
		if (splitPair.length > 1) {
			val = splitPair[1];
		}
		
		values[decodeURI(key)] = decodeURI(val);
	}
	
	return values;
}