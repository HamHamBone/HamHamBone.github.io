let TextLoad = (function() {
	let TextLoad = {};
	
	let loadedFileCache = new Map();
	let requestCount = 0;
	let callbacks = [];
	
	function textToArray(text) {
		return text.split(/[\n\r]+/);	
	}

	TextLoad.load = function(url, callback) {
		requestCount++;
		
		let request = new XMLHttpRequest();
		
		request.addEventListener("load", function(e) { onLoad(e, url, callback) });
		request.addEventListener("error", function(e) { onError(e, url, callback) });
		request.addEventListener("abort", function(e) { onError(e, url, callback) });
		
		request.open("GET", url);
		request.overrideMimeType("text/plain");
		
		request.send();
	}
	
	TextLoad.massLoad = function(data) {
		for (key in data) {
			(function(key) {
				TextLoad.load(data[key], function(result) {
					data[key] = result;
				});
			}) (key)
		}
	}
	
	function onLoad(event, url, callback) {
		let data = textToArray(event.target.responseText);
		if (callback) { callback(data) };
		
		onLoadEnd();
	}
	
	function onError(event, url, callback) {
		if (callback) { callback([]) };
		console.warn('Could not load text file: ' + url);
		
		onLoadEnd();
	}
	
	function onLoadEnd() {
		requestCount--;
		
		if (requestCount <= 0) {
			
			for (callback of callbacks) {
				callback();
			}
			
			callbacks = [];
			requestCount = 0;
		}		
	}
	
	TextLoad.onAllLoad = function(callback) {
		if (requestCount == 0) {
			callback();
			return;
		}
		
		callbacks.push(callback);
	}
	
	return TextLoad;
}) ();