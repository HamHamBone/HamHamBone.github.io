let NameGen = (function() {
	let NameGen = {};
	
	const VOWELS = ['a','e','i','o','u','y'];
	const CONSONANTS = ['b','c','ch','d','f','g','h','k','l','m','n','p','r','s','sh','t','th','v','w','x','y','z','-','\'', ' '];
	
	const FREQ_VOWELS = ['e', 'e', 'e', 'a', 'a', 'i', 'i', 'o', 'o', 'u'];
	const FREQ_CONSONANTS = ['t', 't','t','t','th','th','t', 'n', 'n', 'n', 'n', 'n', 's', 's', 'st', 'sh', 'sh', 'h', 'h', 'h', 'h', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'd', 'd', 'd', 'l', 'l', 'l', 'l', 'c', 'ch', 'c', 'm', 'm', 'w', 'f', 'g', 'y', 'p', 'b', 'v', 'k', 'j', 'x', 'qu', 'z'];
	
	NameGen.LANGUAGE_ALIEN = {
		consonants:CONSONANTS,
		vowels:VOWELS,
		others:[' ', '\'', '-'],
		otherChance:0.03
	}
	
	NameGen.LANGUAGE_ENGLISH = {
		consonants:FREQ_CONSONANTS,
		vowels:FREQ_VOWELS,
		others:[],
		otherChance:0
	}
	
	NameGen.generate = function(length, language=NameGen.LANGUAGE_ENGLISH) {
		if (!length) {
			length = GenUtil.randInt(4, 7);
		}
		var name = '';
		
		var vowelType = Math.random() < 0.25;
		for (var i = 0; i < length; i++) {
			if (Math.random() < language.otherChance) {
				name += GenUtil.pickRandom(language.others);
			}
			
			if (vowelType) {
				name += GenUtil.pickRandom(language.vowels);
				if (Math.random() < 0.1) name += GenUtil.pickRandom(language.vowels);
			}
			
			if (!vowelType) {
				name += GenUtil.pickRandom(language.consonants);
				if (i != 0 && i != length-1 && Math.random() < 0.333333) {
					name += GenUtil.pickRandom(language.consonants);
				}
			}
			
			vowelType = ! vowelType;
		}
		
		name = name[0].toUpperCase() + name.slice(1);
		
		return name;			
	}
	
	return NameGen;
}) ();