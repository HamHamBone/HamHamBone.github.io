let NameGen = (function() {
	let NameGen = {};
	
	const VOWELS = [
		'a', 'a', 'a', 'a', 'a', 'a',
		'ae', 'ai', 'au',
		'e', 'e', 'e', 'e', 'e', 'e',
		'ea', 'ei', 'eu',
		'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i',
		'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
		'oo', 'oi', 'ou',
		'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u',
		'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y'
	];
	const CONSONANTS = ['b','c','ch','d','f','g','h','k','l','m','n','p','r','s','sh','t','th','v','w','x','y','z','-','\'', ' '];

	const FREQ_VOWELS = [
		'a', 'a', 'a', 'a', 'a', 'a',
		'e', 'e', 'e', 'e', 'e', 'e',
		'i', 'i', 'i', 'i', 'i', 'i',
		'o', 'o', 'o', 'o', 'o', 'o',
		'u', 'u', 'u', 'u', 'u', 'u',
		'y'
	];
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
			length = GenUtil.randInt(3, 7);
		}
		var name = '';
		
		var vowelType = Math.random() < 0.1;
		
		for (var i = 0; i < length; i++) {
			if (Math.random() < language.otherChance) {
				name += GenUtil.pickRandom(language.others);
			}
			
			if (vowelType) {
				name += GenUtil.pickRandom(language.vowels);
				if (Math.random() < 0.25) name += GenUtil.pickRandom(language.vowels);
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