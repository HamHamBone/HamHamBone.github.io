let StarSystemGenerator = {};

StarSystemGenerator.STAR_CLASSES = [
	"Black Hole",
	"blue supergiant",
	"blue giant",
	"brown dwarf",
	"red dwarf",
	"yellow dwarf",
	"yellow dwarf",
	"red giant",
	"red supergiant",
	"white dwarf",
	"neutron star"
];

StarSystemGenerator.BODIES = [
	{type:"construct", bodyClass:'N'},
	{type:"asteroid belt", bodyClass:'N'},
	{type:"asteroid belt", bodyClass:'N'},
	{type:"gas giant", bodyClass:'P'},
	{type:"gas giant", bodyClass:'P'},
	{type:"planet", bodyClass:'P'},
	{type:"planet", bodyClass:'P'},
	{type:"planetoid", bodyClass:'P'},
	{type:"planetoid", bodyClass:'P'},
	{type:"companion star", bodyClass:'S'},
	{type:"anomaly", bodyClass:'N'}
];

StarSystemGenerator.generate = function(minBodies=0) {
	let bodies = [];
	let stars = [];
	
	let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y'];
	
	let bodyCount = GenUtil.randInt(minBodies+1,13);
	
	let starCount = 0;
	
	for (let i = 0; i < bodyCount; i++) {
		let body = null;
		
		if (i != 0) {
			body = this.pickRandom2d6(this.BODIES);
		} else {
			body = {name:"companion star", bodyClass:'S'};
		}
		
		if (body.bodyClass == 'S') {
			starCount ++;
		}
		
		bodies.push(body);
	}
	
	let starIndex = -1;
	
	for (let i = 0; i < bodyCount; i++) {
		let body = bodies[i];
		
		let type = body.type;
		let bodyClass = body.bodyClass;
		
		let moonCount = 0;
		
		if (type == "gas giant") {
			if (Math.random() < 0.8) {
				moonCount = Math.floor(Math.pow(Math.random(), 2) * 12)+1;
			}
		} else if (type == "planet") {
			if (Math.random() < 0.5) {
				moonCount = Math.floor(Math.pow(Math.random(), 2) * 8)+1;

			}
		} else if (type == "planetoid") {
			if (Math.random() < 0.25) {
				moonCount = Math.floor(Math.pow(Math.random(), 2) * 6)+1;
			}
		}
		
		if (moonCount > 0) {
			type += ", " + moonCount + " moon";
			if (moonCount > 1) type += "s";
		}
		
		let name = '';
		
		if (body.bodyClass == 'S') {
			starIndex++;
			planetIndex = 0
			
			type = this.pickRandom2d6(this.STAR_CLASSES);
			name = (starCount > 1 ? ' ' + letters[starIndex] : '');
			
			type = type.toUpperCase();
		} else {
			if (body.bodyClass == 'N') {
				name = '';
			} else {
				planetIndex++;
				name = (starCount > 1 ? ' ' + letters[starIndex] : '') + ' ' + this.romanize(planetIndex);
			}
		}
		
		bodies[i] = {type:type, name:name};
	}
	
	return bodies;
}

StarSystemGenerator.pickRandom2d6 = function(array) {
	var random = Math.floor(6*Math.random()) + Math.floor(6*Math.random());
	return array[random];
}

StarSystemGenerator.romanize = function(num) {
  var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},roman = '',i;
  for ( i in lookup ) {
    while ( num >= lookup[i] ) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}