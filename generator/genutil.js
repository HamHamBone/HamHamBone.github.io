var GenUtil = {};

GenUtil.pickRandom = function(array) {
	return array[Math.floor(Math.random()*array.length)];	
}

GenUtil.generatePattern = function(pattern, data) {
	for (name in data) {
		var regexp = new RegExp("{" + name + "}");
		while (pattern.search(regexp) > -1) {
			pattern = pattern.replace(regexp, function() { return GenUtil.pickRandom(data[name]); });
		}
	}
	
	// pluralize tag
	var regexp = /(\w+)~s/g; // matches any word ending with the special ~s sequence
	pattern = pattern.replace(regexp, function(match, word) { return GenUtil.pluralize(word);  });
	
	// annify tag
	var regexp = /~n ([aeiouAEIOU])/g; // matches ~n followed by a space then a vowel
	pattern = pattern.replace(regexp, function(match, vowel) { return "n " + vowel} );
	
	var regexp = /~n/g; // matches ~n
	pattern = pattern.replace(regexp, "");
	
	return pattern;	
}

GenUtil._textToArray = function(text) {
	return text.split(/[\n\r]+/);	
}

GenUtil.loadTextFile = function(filename) {
	var request = new XMLHttpRequest();
	request.open("GET", filename, false);
	request.overrideMimeType("text/plain");
	
	request.send();

	return GenUtil._textToArray(request.responseText);	
}

GenUtil.loadTextFiles = function(data, onAllLoad) {
	var keys = Object.keys(data);
	var requestCount = keys.length;
	var loadedData = {};
	
	function makeRequest(key, filename) {
		var request = new XMLHttpRequest();
		request.addEventListener("load", function(e) { onLoad(e, key) });
		request.open("GET", filename);
		request.overrideMimeType("text/plain");
		request.send();		
	}
	
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var filename = data[key];
		makeRequest(key, filename);
	}
	
	function onLoad(e, key) {
		loadedData[key] = GenUtil._textToArray(e.target.responseText);
		
		requestCount--;
		if (requestCount <= 0) {
			onAllLoad(loadedData);
		}
	}
}

GenUtil.capitalize = function(string) {
	var name = "";
	
	for (var i = 0; i < string.length; i++) {
		var prevChar = string[i-1];
		if (i == 0 || prevChar == " " || prevChar == "'") {
			name += string[i].toUpperCase();
		} else {
			name += string[i].toLowerCase();
		}
	}
	
	return name;
}

GenUtil._isVowel = function(string) {
	string = string.toLowerCase();
	return (string == "a" || string == "e" || string == "i" || string == "o" || string == "u");
}

GenUtil.pluralize = function(string) {
	if (string.length > 2 && (string.slice(-1) == "s" || string.slice(-2) == "ch" || string.slice(-2) == "sh")) {
		return string + "es";
	} else if (string.slice(-1) == "y" && !GenUtil._isVowel(string.slice(-2,-2))) {
		return string.slice(0, -1) + "ies";
	} else if (string.slice(-2) == "lf") {
		return string.slice(0, -2) + "lves";
	} else if (string.slice(-2) == "rf") {
		return string.slice(0, -2) + "rves";
	} else {
		return string + "s";
	}
}

GenUtil.mashup = function(stringA, stringB) {
	var fraction = 0.25 + 0.5 * Math.random();
	
	stringA = stringA.slice(0, Math.floor(stringA.length * fraction));
	stringB = stringB.slice(Math.floor(stringB.length * fraction));
	
	return stringA + stringB;
}