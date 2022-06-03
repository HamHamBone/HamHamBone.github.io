'use strict';

let GenUtil = (function() {
	let GenUtil = {};
	
	// ***************************************************************************
	// RANDOM DISTRIBUTIONS
	
	GenUtil.randInt = function(min, max) {
		return min + Math.floor(Math.random() * (1 + max - min));
	}
	
	// ***************************************************************************
	// ARRAY FUNCTIONS
	
	GenUtil.pickRandom = function(array) {
		return array[Math.floor(Math.random()*array.length)];	
	}

	GenUtil.probArray = function(array) {
		let result = [];
		for (let entry of array) {
			result = result.concat(new Array(entry[0]).fill(entry[1]));
		}
		return result;
	}
	
	// in place shuffle the given array
	// fisher-yates shuffle
	GenUtil.shuffle = function(array) {
		for (let i = 0; i < array.length; i++) {
			let swapIndex = GenUtil.randInt(i, array.length-1);
			let temp = array[i];
			array[i] = array[swapIndex];
			array[swapIndex] = temp;
		}
		
		return array;
	}
	
	// ***************************************************************************
	// Shuffler
	
	GenUtil.Shuffler = function(array) {
		this._index = 0;
		this._array = array.slice(array);
	}

	GenUtil.Shuffler.prototype.next = function() {
		let array = this._array;
		
		if (this._index < this._array.length - 1) {
			let swapIndex = GenUtil.randInt(this._index, this._array.length-1);
			
			let swap = this._array[swapIndex];
			this._array[swapIndex] = this._array[this._index];
			this._array[this._index] = swap;
		}
		
		let result = this._array[this._index];
		
		this._index++;
		
		if (this._index >= this._array.length) {
			this._index = 0;
		}
		
		return result;
	}	
	
	// ***************************************************************************
	// PATTERNS
	
	GenUtil.generatePattern = function(pattern, data) {
		let done = false;
		while (!done) {
			done = true;
			for (name in data) {
				let regexp = new RegExp("{" + name + "}");
				while (pattern.search(regexp) > -1) {
					done = false;
					pattern = pattern.replace(regexp, function() {
						if (typeof data[name] === 'function') {
							return data[name]();
						} else {
							return GenUtil.pickRandom(data[name]);
						}					
					});
				}
			}
		}
		
		// pluralize tag
		let regexp = /(\w+)~s/g; // matches any word ending with the special ~s sequence
		pattern = pattern.replace(regexp, function(match, word) { return GenUtil.pluralize(word);  });
		
		// annify tag
		regexp = /~n ([aeiouAEIOU])/g; // matches ~n followed by a space then a vowel
		pattern = pattern.replace(regexp, function(match, vowel) { return "n " + vowel} );
		
		regexp = /~n/g; // matches ~n
		pattern = pattern.replace(regexp, "");
		
		return pattern;	
	}	
	
	return GenUtil;
}) ();

GenUtil.capitalize = function(string) {
	let name = "";
	
	for (let i = 0; i < string.length; i++) {
		let prevChar = string[i-1];
		if (i == 0 || prevChar == " ") {
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
	} else if (string.slice(-3) == 'man') {
		return string.slice(0,-3) + 'men';
	} else if (string.slice(-4) == 'folk') {
		return string;
	} else {
		return string + "s";
	}
}

GenUtil.VOWELS = ['a', 'e', 'i', 'o', 'u'];
GenUtil.CONSONANTS = ['b','c','ch','d','f','g','h','k','l','m','n','p','r','s','sh','t','th','v','w','x','y','z'];

GenUtil.mashup = function(stringA, stringB) {
	let fraction = 0.33333 + 0.33333 * Math.random();
	
	stringA = stringA.slice(0, Math.round(stringA.length * fraction));
	stringB = stringB.slice(Math.round(stringB.length * fraction));

	let consA = stringA.match(/[^aeiouAEIOU]+$/);
	if (consA != null) {
		consA = consA[0];
		stringA = stringA.slice(0, -1 * consA.length);
	} else {
		consA = '';
	}
	
	let consB = stringB.match(/^[^aeiouAEIOU]+/);
	if (consB != null) {
		consB = consB[0];
		stringB = stringB.slice(consB.length);
	} else {
		consB = '';
	}
	
	let result = '';
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

GenUtil.cleanup = function(string) {
	let orig = string;
	
	string = string.replace(/^ck/g, 'k');
	string = string.replace(/tth|tht/g, 'th');
	string = string.replace(/chsh|shch/g, 'ch');
	string = string.replace(/yu[aeio]+/g, 'yu');
	string = string.replace(/dt|td/g, Math.random()<0.5 ? 't' : 'd')
	string = string.replace(/gc|cg/g, Math.random()<0.5 ? 'g' : 'c');
	string = string.replace(/q!u/g, 'qu');
	string = string.replace(/f([aeou])c?k/g, GenUtil.pickRandom(GenUtil.CONSONANTS) + '$1' + GenUtil.pickRandom(GenUtil.CONSONANTS));
	string = string.replace(/c[aeiou]ch/g, 'kech');
	string = string.replace(/kic/g, 'kik');
	string = string.replace(/xsk|skx/g, Math.random()<0.5 ? 'x' : 'sk');
	string = string.replace(/ic([aeiou])/g, Math.random()<0.5 ? 'is$1' : 'ick$1');
	string = string.replace(/ci/g, Math.random()<0.5 ? 'si' : 'ki');
	string = string.replace(/vf|fv/g, Math.random()<0.5 ? 'f' : 'v');
	string = string.replace(/bp|pb/g, Math.random()<0.5 ? 'b' : 'p');
	
	if (orig != string) {
		console.log(orig, string);
	}
	
	return string;
}

GenUtil.unique = function(array) {
	return Array.from(new Set(array));
}