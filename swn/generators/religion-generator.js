let ReligionGenerator = {};

ReligionGenerator.evolutions = [
	"New Book",
	"New Prophet",
	"Syncretic",
	"Neofundamentalist",
	"Quietist",
	"Sacrificial",
	"Schism",
	"Holy Family"
];

ReligionGenerator.origins = [
	"Paganism",
	"Roman Catholicism",
	"Eastern Orthodoxy",
	"Protestantism",
	"Buddism",
	"Judaism",
	"Islam",
	"Taoism",
	"Hinduism",
	"Zoroasterism",
	"Confucanism",
	"Ideology"
];

ReligionGenerator.leaderships = [
	"Patriarchy/Matriarchy",
	"Patriarchy/Matriarchy",
	"Council",
	"Council",
	"Democracy",
	"Regional"
];

ReligionGenerator.doctrines = [
	"gender",
	"age",
	"psionics",
	"diet",
	"clothing",
	"wealth",
	"prayer",
	"meditation",
	"knowledge",
	"the afterlife",
	"eschatology",
	"symbolism",
	"purification",
	"violence",
	"marriage",
	"missionary work",
	"aliens",
	"work",
	"charity",
	"technology",
	"icons",
	"relics",
	"art",
	"music",
	"rituals",
	"nature",
	"death",
	"places of worship",
	"nonbelievers",
	"ancestors",
	"pilgrammage",
	"scripture"
];

ReligionGenerator.generate = function() {
	let count = GenUtil.randInt(8,16);
	console.log(count);
	let religions = [];
	
	let originShuffle = new GenUtil.Shuffler(this.origins.concat(this.origins));

	for (let i = 0; i < count; i++) {
		let evolution = GenUtil.pickRandom(ReligionGenerator.evolutions);
		let origin = originShuffle.next();
		
		if (evolution == "Syncretic") {
			origin += "/"+originShuffle.next();
		}
		
		let name = evolution + " " + origin;
		
		let leadership = GenUtil.pickRandom(ReligionGenerator.leaderships);
		
		if (leadership == "Regional") {
			let leadership2 = GenUtil.pickRandom(ReligionGenerator.leaderships);
			
			if (leadership2 == leadership) {
				leadership = "No Hierarchy"
			} else {
				leadership += " " + GenUtil.pluralize(leadership2);
			}
		}
		
		let doctrineShuffle = new GenUtil.Shuffler(this.doctrines);
		doctrine = doctrineShuffle.next() + " & " + doctrineShuffle.next();
		
		religions.push({
			name:name,
			leadership:leadership,
			doctrine:doctrine
		});
	}

	return religions;
}