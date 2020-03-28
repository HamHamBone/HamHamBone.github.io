let NameGenerator = (function() {
	let NameGenerator = {};
	
	let vowels = ['a', 'a', 'a', 'e', 'e', 'e', 'i', 'i', 'o', 'o', 'u', 'u', 'y'];
	let consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
	
	NameGenerator.generate = function() {
		let vowelMode = Math.random() < 0.25;
		
		let length = GenUtil.pickRandom([
			2,
			3,3,
			4,4,4,
			5,5,5,
			6,6,
			7
		])
		
		let string = "";
		
		for (let i = 0; i < length; i++) {
			let list = vowelMode ? vowels : consonants;
			
			string += GenUtil.pickRandom(list);
			
			if (Math.random() < 0.9) {
				vowelMode = !vowelMode;
			}
		}
		
		return string;
	}
	
	return NameGenerator;
}) ();