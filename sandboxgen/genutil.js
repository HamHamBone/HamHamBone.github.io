'use strict';

let GenUtil = (function() {
	let GenUtil = {};
	
	GenUtil.die = function(size) {
		return 1+Math.floor(Math.random()*size)
	}
	
	GenUtil.pickRandom = function(list) {
		return list[Math.floor(Math.random()*list.length)];
	}
	
	GenUtil.generatePattern = function(pattern, data) {
		for (name in data) {
			var regexp = new RegExp("{" + name + "}");
			while (pattern.search(regexp) > -1) {
				pattern = pattern.replace(regexp, function() { return GenUtil.pickRandom(data[name]); });
			}
		}
		
		return pattern;
	}
	
	GenUtil.pickList = function(list, count = -1) {
			if (count == -1) {
				count = list.length;
			}
		
			let copy = list.slice(0,list.length);
			
			for (let i = 0; i < count; i++) {
				let k = i+Math.floor(Math.random()*(copy.length-i));
				let v = copy[k];
				copy[k] = copy[i];
				copy[i] = v;
			}
			
			return copy.slice(0,count);
	}
	
	GenUtil.halton = function(index, base) {
		let fraction = 1;
		let result = 0;
		while (index > 0) {
			fraction /= base;
			result += fraction * (index % base);
			index = Math.floor(index / base);
		}
		return result;
	}
	
	GenUtil.mashup = function(stringA, stringB) {
		var fraction = 0.33333 + 0.33333 * Math.random();
		
		stringA = stringA.slice(0, Math.round(stringA.length * fraction));
		stringB = stringB.slice(Math.round(stringB.length * fraction));

		var consA = stringA.match(/[^aeiouAEIOU]+$/);
		if (consA != null) {
			consA = consA[0];
			stringA = stringA.slice(0, -1 * consA.length);
		} else {
			consA = '';
		}
		
		var consB = stringB.match(/^[^aeiouAEIOU]+/);
		if (consB != null) {
			consB = consB[0];
			stringB = stringB.slice(consB.length);
		} else {
			consB = '';
		}
		
		var result = '';
		if (consA.length + consB.length > 2) {
			//console.log(stringA + '-' + consA + '-' + consB + '-' + stringB);
			if (consA < consB) {
				result = stringA + consA + stringB;
			} else {
				result = stringA + consB + stringB;
			}
			//console.log(result);
		} else {
			result = stringA + consA + consB + stringB;
		}
		
		return result;
	}
	
	return GenUtil;
}) ();