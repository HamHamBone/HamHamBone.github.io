let URLParam = {};

URLParam._hashCache = '';
URLParam.onChange = null;

URLParam.encode = function(values) {
	parent.location.hash = URLParam.createHash(values);
	URLParam._hashCache = parent.location.hash;
}

URLParam.createHash = function(values) {
	let result = "";
	
	let keys = Object.keys(values);
	for (let i = 0; i < keys.length; i++) {
		let key = keys[i];
		let val = values[key];
		
		result += encodeURIComponent(key) + "=" + encodeURIComponent(val);
		
		if (i < keys.length - 1) { result += "&"; }
	}

	return result;	
}

URLParam.createURL = function(values) {
	let url = parent.location.href;
	let hash = parent.location.hash;
	
	let baseURL = url.slice(0, url.length - hash.length);
	
	return baseURL + '#' + URLParam.createHash(values)
}

URLParam.clear = function() {
	parent.location.hash = '';
	URLParam._hashCache = parent.location.hash;
}

URLParam.decode = function() {
	let paramURL = parent.location.hash;
	paramURL = paramURL.slice(1);
	
	let pairs = paramURL.split("&");
	
	let values = {};
	
	for (let i = 0; i < pairs.length; i++) {
		let splitPair = pairs[i].split("=",2);
		
		let key = splitPair[0];
		let val = "";
		
		if (splitPair.length > 1) {
			val = splitPair[1];
		}
		
		values[decodeURIComponent(key)] = decodeURIComponent(val);
	}
	
	return values;
}

window.addEventListener("hashchange", function(event) {
	if (URLParam.onChange !== null && URLParam._hashCache != parent.location.hash) {
		URLParam.onChange();
	}
});