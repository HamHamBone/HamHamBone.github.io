var WorldGenerator = {};

WorldGenerator.generate = function() {
	var targetPlanetCount = 20 + Math.floor(1 + Math.random() * 10);
	
	var systems = [];
	
	var occupiedHexes = new Set();
	
	var totalPlanetCount = 0;
	
	while (totalPlanetCount < targetPlanetCount) {
		var systemName = WorldGenerator.generateSystemName();
		
		var systemLocation = "";
		var loopCount = 0;
		do {
			var sysX = 0, sysY = 0;
			if (loopCount == 0 && Math.random() < 0.75) {
				sysX = GenUtil.randInt(1,6);
				sysY = GenUtil.randInt(1,8);				
			} else {
				sysX = GenUtil.randInt(0,7);
				sysY = GenUtil.randInt(0,9);
			}
				
			systemLocation = "0"+sysX+"0"+sysY;
			loopCount++;
		} while (occupiedHexes.has(systemLocation));
		occupiedHexes.add(systemLocation);
	
		var planetCount = GenUtil.pickRandom([
			0,0,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			2,2,2,2,2,
			3
		]);
		
		var system = {
			x:sysX,
			y:sysY,
			name:systemName,
			planets:[]
		};
		
		let poiCount = null; // poi = point of interest
		
		for (var i = 0; i < planetCount; i++) {
			var planet = {};
			
			let planetName = this.generatePlanetName();
			
			let populationClass = this.pickRandom2d6(this.populations);
			let techLevelClass = this.pickRandom2d6(this.techlevels);
			
			let planetPoiCount = populationClass.outpostCount + techLevelClass.outpostCount;
			
			if (poiCount === null || planetPoiCount < poiCount) {
				poiCount = Math.max(planetPoiCount, poiCount);
			}
			
			var atmosphere = this.pickRandom2d6(this.atmospheres);
			var temperature = this.pickRandom2d6(this.temperatures);
			var biosphere = this.pickRandom2d6(this.biospheres);
			var gravity = this.pickRandom2d6(this.gravities);
			var population = populationClass.name;
			var techLevel = techLevelClass.value;
			
			let tagShuffler = new GenUtil.Shuffler(this.tags);
			var tag1 = tagShuffler.next().name;
			var tag2 = tagShuffler.next().name;
			
			var planet = {
				name:planetName,
				atmosphere:atmosphere,
				temperature:temperature,
				biosphere:biosphere,
				gravity:gravity,
				population:population,
				techLevel:techLevel,
				tag1:tag1,
				tag2:tag2
			}
			
			system.planets.push(planet);
			totalPlanetCount++;
		}
		poiCount = GenUtil.randInt(0,3) + poiCount;
		if (poiCount < 0) { poiCount = 0; }
		
		system.pointsOfInterest = [];
		
		for (let i = 0; i < poiCount; i++) {
			system.pointsOfInterest.push(this.generatePointOfInterest());
		}
		
		system.bodies = StarSystemGenerator.generate(system.planets.length);
		
		systems.push(system);
	}
	
	// create star name clusters
	let starPool = systems.slice(0);
	let clusterCount = GenUtil.pickRandom(GenUtil.probArray([
			[16,0],
			[16,1],
			[8,2],
			[4,3],
			[2,4],
			[1,5]
		]));
	for (let i = 0; i < clusterCount; i++) {
		let primaryStar = GenUtil.pickRandom(starPool);
		starPool.splice(starPool.indexOf(primaryStar), 1);
		let baseName = primaryStar.name;
		
		let clusterSize = GenUtil.pickRandom(GenUtil.probArray([
			[32,1],
			[16,2],
			[8,3],
			[4,4],
			[2,5],
			[1,6]
		]));
		
		let prefixList = WorldGenerator.greekLetters;
		if (clusterSize == 1 && Math.random() < 2) {
			prefixList = ['Major', 'Minor'];
		}
		
		primaryStar.name = baseName + ' ' + prefixList[0];
		
		for (let j = 0; j < clusterSize; j++) {
			let closestStar = null;
			let closestDistance = null;
			for (star of starPool) {	
				let distance = Math.abs(primaryStar.x - star.x) + Math.abs(primaryStar.y - star.y);
				
				if (closestStar == null || distance < closestDistance) {
					closestStar = star;
					closestDistance = distance;
				}
			}
			
			let picks = [];
			let minDistance = closestDistance;
			
			for (star of starPool) {
				let distance = Math.abs(primaryStar.x - star.x) + Math.abs(primaryStar.y - star.y);
				
				if (distance <= minDistance) {
					picks.push(star);
				}
			}
			
			let nextStar = GenUtil.pickRandom(picks);
			
			nextStar.name = baseName + ' ' + prefixList[j+1];
			starPool.splice(starPool.indexOf(nextStar), 1);
			
			primaryStar = nextStar;
		}
	}
	
	for (let system of systems) {
		if (system.planets.length > 0) {
			if (Math.random() < (1/60)) {
				system.planets[0].name = system.name + ' Prime';
			}
		}
	}
	
	return systems;
}

WorldGenerator.generatePlanet = function() {
	let planetName = this.generatePlanetName();
	
	let population = this.pickRandom2d6(this.populations).name;
	let techLevel = this.pickRandom2d6(this.techlevels).value;
	var atmosphere = this.pickRandom2d6(this.atmospheres);
	var temperature = this.pickRandom2d6(this.temperatures);
	var biosphere = this.pickRandom2d6(this.biospheres);
	var gravity = this.pickRandom2d6(this.gravities);
	
	let tagShuffler = new GenUtil.Shuffler(this.tags);
	var tag1 = tagShuffler.next().name;
	var tag2 = tagShuffler.next().name;
	
	var planet = {
		name:planetName,
		atmosphere:atmosphere,
		temperature:temperature,
		biosphere:biosphere,
		gravity:gravity,
		population:population,
		techLevel:techLevel,
		tag1:tag1,
		tag2:tag2
	}
	
	return planet;
}

WorldGenerator.pickRandom2d6 = function(list) {
	var random = Math.floor(6*Math.random()) + Math.floor(6*Math.random());
	return list[random];	
}

WorldGenerator.generateSuffix = function(string) {
	var suffixes = ['a', 'ia', 'io', 'o', 'i'];
	var endings = ['', '', 's', 's', 'x', 't', 'k', 'l', 'r', 'r', 'n'];
	
	if (string.match(/[aio]$/)) {
		return GenUtil.pickRandom(endings);
	} else {
		return GenUtil.pickRandom(suffixes) + GenUtil.pickRandom(endings);
	}
}

WorldGenerator.generatePointOfInterest = function() {
	let type = GenUtil.pickRandom(WorldGenerator.pointsOfInterest);
	let occupants = GenUtil.pickRandom(type.occupants);
	let situation = GenUtil.pickRandom(type.situations);
	
	let name = '';
	
	let nameRandom = Math.random();
	if (nameRandom < 0.25) {
		name = GenUtil.pickRandom(this.placeNames);
	} else if (nameRandom < 0.5) {
		name = GenUtil.pickRandom(this.legends);
	} else if (nameRandom < 0.65) {
		name = NameGen.generate(GenUtil.pickRandom([4,4,4,5,6]));
	} else {
		name = SWNNameGen.getName();
	}
	
	name = GenUtil.capitalize(name);
	
	let stationNameRandom = Math.random();
	if (stationNameRandom < 0.4) {
		let prefix = GenUtil.pickRandom(type.names);
		if (prefix[0] == '$') {
			name = prefix.slice(1) + ' ' + name;
		} else {
			name = name + ' ' + prefix;
		}
	} else if (stationNameRandom < 0.6) {
		name = name + ' ' + GenUtil.pickRandom(['Zero', 'One', 'One', 'One','Two', 'Two', 'Two', 'Three', 'Three', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']);
	} else {
		let prefix = GenUtil.pickRandom(type.names);
		if (prefix[0] == '$') {
			prefix = prefix.slice(1);
		}	
		name = prefix + ' ' + this.generateDesignation()
	}
	
	return {name:name, type:type.name, occupants:occupants, situation:situation};
}

/* ************************************************************************** */

WorldGenerator.generateDesignation = function() {
	let result = '';
	result += this.generateSequence(this.letters, GenUtil.pickRandom([1,1,2,2,2,2,3]));
	result += '-';
	result += this.generateSequence(this.numbers, GenUtil.pickRandom([1,1,2,2,2,2,3,3,4]));
	
	return result;
}

WorldGenerator.generateSequence = function(array, count) {
	let result = '';
	for (let i = 0; i < count; i++) {
		result += GenUtil.pickRandom(array);
	}
	return result;
}

WorldGenerator.generateSystemName = function() {
	let nameLengths = GenUtil.probArray([
		[3,1],
		[24,2],
		[12,3],
		[1,4]
	]);
	let name = systemName = '';
	if (Math.random() < 0.75) {
		if (Math.random() < 0.5) {
			systemName = NameGen.generate(GenUtil.pickRandom(nameLengths));
			systemName += this.generateSuffix(systemName);
		} else {
			systemName = WorldGenerator.generateStarlikeName();
		}
		systemName = GenUtil.cleanup(systemName.toLowerCase());
		systemName = GenUtil.capitalize(systemName);
	} else {
		systemName = this.generateDesignation();
	}
	return systemName;
}

WorldGenerator.generateStarlikeName = function() {
	let nameLengths = GenUtil.probArray([
		[3,1],
		[24,2],
		[12,3],
		[1,4]
	]);
	return GenUtil.mashup(Math.random() < 0.5 ? GenUtil.pickRandom(this.starNames) : NameGen.generate(GenUtil.pickRandom(nameLengths)), GenUtil.pickRandom(this.starNames));
}

WorldGenerator.generatePlanetName = function() {
	let nameLengths = GenUtil.probArray([
		[3,1],
		[24,2],
		[12,3],
		[1,4]
	]);
	//return NameGen.generate(GenUtil.pickRandom(nameLengths));
	
	planetName = ""
	var planetNameRandom = Math.random();
	
	if (planetNameRandom < 0.01) {
		planetName = this.generateDesignation();
	} else if (planetNameRandom < 0.06) {
		planetName = NameGen.generate(GenUtil.pickRandom(nameLengths), NameGen.LANGUAGE_ALIEN);
		if (Math.random() < 0.5) {
			planetName += this.generateSuffix(planetName); 
		}
	} else if (planetNameRandom < 0.25) {
		planetName = WorldGenerator.generateStarlikeName();
	} else if (planetNameRandom < 0.6) {
		if (Math.random() < 0.5) {
			planetName = NameGen.generate(GenUtil.pickRandom(nameLengths));
		} else {
			planetName = NameGen.generate(Math.max(1, GenUtil.pickRandom(nameLengths)-1));
			planetName += this.generateSuffix(planetName); 
		}
	} else {
		var placeName = GenUtil.pickRandom(this.placeNames);
		if (Math.random() < 0.5) {
			var randomName = NameGen.generate(GenUtil.pickRandom(nameLengths));
			planetName = GenUtil.mashup(randomName, placeName);
		} else {
			if (Math.random() < 0.5) {
				randomName = NameGen.generate(GenUtil.pickRandom(nameLengths));
				planetName = GenUtil.mashup(placeName, randomName);
			} else {
				randomName = NameGen.generate(Math.max(1, GenUtil.pickRandom(nameLengths)-1));
				planetName = GenUtil.mashup(placeName, randomName);
				planetName += this.generateSuffix(planetName);
			}
		}
	}
	
	planetName = GenUtil.cleanup(planetName.toLowerCase());
	
	if (Math.random() < (1/30)) {
		let secondaryName = NameGen.generate(GenUtil.randInt(1,2));
		secondaryName = GenUtil.cleanup(secondaryName.toLowerCase());
		planetName = secondaryName + ' ' + planetName;
		if (Math.random() < (1/10)) {
			let secondaryName = NameGen.generate(GenUtil.randInt(1,2));
			secondaryName = GenUtil.cleanup(secondaryName.toLowerCase());
			planetName = secondaryName + ' ' + planetName;
		}
	}
	
	if (Math.random() < (1/30)) {
		planetName = SWNNameGen.getName();
		
		if (Math.random() < 0.5) {
			planetName += GenUtil.pickRandom(['world', '\'s Planet']);
		}
	}
	
	planetName = GenUtil.capitalize(planetName);
	
	if (Math.random() < (1/30)) {
		if (Math.random() < 0.2) {
			planetName = GenUtil.pickRandom(WorldGenerator.placeNames);
		}
		let newPrefix = GenUtil.pickRandom(WorldGenerator.news);
		planetName = newPrefix.replace('{name}', GenUtil.capitalize(planetName));
	}
	
	return planetName;
}

WorldGenerator.placeNames = null;
WorldGenerator.starNames = null;
WorldGenerator.legends = null;
TextLoad.load('generators/data/swnPlaceNames.txt', (data) => {WorldGenerator.placeNames = data;} );
TextLoad.load('generators/data/stars.txt', (data) => {WorldGenerator.starNames = data;} );
TextLoad.load('generators/data/legends.txt', (data) => {WorldGenerator.legends = data;} );

//WorldGenerator.greekLetters = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];
WorldGenerator.greekLetters = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
WorldGenerator.numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
WorldGenerator.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];

WorldGenerator.news = ['New {name}', 'New {name}', 'New {name}', 'New {name}', 'New {name}', 'New {name}', 'Neo {name}', 'Novo {name}', 'Nuevo {name}'];

WorldGenerator.atmospheres = [
	"corrosive",
	"inert gas",
	"airless or thin",
	"breathable",
	"breathable",
	"breathable",
	"breathable",
	"breathable",
	"thick",
	"invasive",
	"corrosive and invasive",
];

WorldGenerator.temperatures = [
	"frozen",
	"cold (variable)",
	"cold (variable)",
	"cold",
	"temperate",
	"temperate",
	"temperate",
	"warm",
	"warm (variable)",
	"warm (variable)",
	"burning"
];

WorldGenerator.biospheres = [
	"remnant",
	"microbial",
	"none native",
	"none native",
	"human-miscible",
	"human-miscible",
	"human-miscible",
	"immiscible",
	"immiscible",
	"hybrid",
	"engineered"
];

WorldGenerator.gravities = [
	"zero",
	"nil",
	"low",
	"low",
	"standard",
	"standard",
	"standard",
	"standard",
	"standard",
	"high",
	"high"
];

WorldGenerator.populations = [
	{name:"failed colony", outpostCount:0},
	{name:"outpost", outpostCount:0},
	{name:"K 10+", outpostCount:0},
	{name:"K 100+", outpostCount:0},
	{name:"M 1+", outpostCount:1},
	{name:"M 1+", outpostCount:1},
	{name:"M 10+", outpostCount:1},
	{name:"M 10+", outpostCount:1},
	{name:"M 100+", outpostCount:2},
	{name:"B 1+", outpostCount:2},
	{name:"alien civ.", outpostCount:0}
];

WorldGenerator.techlevels = [
	{value:"0", outpostCount:-2},
	{value:"1", outpostCount:-2},
	{value:"2", outpostCount:-2},
	{value:"4", outpostCount:0},
	{value:"4", outpostCount:0},
	{value:"4", outpostCount:0},
	{value:"4",outpostCount:0},
	{value:"3",outpostCount:-1},
	{value:"3",outpostCount:-1},
	{value:"4+",outpostCount:0},
	{value:"5", outpostCount:0}
];

WorldGenerator.starClasses = [
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

WorldGenerator.bodies = [
	"construct",
	"debris",
	"asteroid/comet belt",
	"methane giant",
	"hydrogen giant",
	"rocky planet",
	"rocky planet",
	"planetoid",
	"planetoid",
	"companion star",
	"anomaly"
];

WorldGenerator.pointsOfInterest = [
	{
		name:'Deep-space station',
		names:['Outpost', 'Station', '$Starbase', 'Point', '$Deep-Space', 'Base', 'Platform'],
		occupants:['Dangerously odd transhumans', 'Freeze-dried ancient corpses', 'Secretive military observers', 'Eccentric oligarch and minions', 'Deranged but brilliant scientist'],
		situations:['Systems breaking down', 'Foreign sabatage attempt', 'Black market for the elite', 'Vault for dangerous pretech', 'Supply base for pirates']
	},
	{
		name:'Asteroid Base',
		names:['Outpost', 'Rock', 'Base', 'Station', 'Mine', '$Asteroid Base'],
		occupants:['Zealous religious sectarians', 'Failed rebels from another world', 'Wage-slave corporate miners', 'Independent asteroid prospectors', 'Pirates masquerading as otherwise'],
		situations:['Life support is threatened', 'Base needs a new asteroid', 'Dug out something nasty', 'Fighting another asteroid', 'Hit a priceless vein of ore']
	},
	{
		name:'Remote moon base',
		names:['Outpost', '$Lunar Base', 'Base', 'Station', '$Moon Base', 'Habitat'],
		occupants:['Unloucky corporate researchers', 'Reclusive hermit genius', 'Remnants of a failed colony', 'Military listening post', 'Lonely overseers and robot miners'],
		situations:['Something dark has awoken', 'Criminals trying to take over', 'Moon plague breaking out', 'Desperate for vital supplies', 'Rich but badly-protected']
		
	},
	{
		name:'Ancient orbital ruin',
		names:['Outpost', 'Station', 'Ruins', 'Construct', 'Ring', 'Station', 'Object', 'Platform', '$TMS'],
		occupants:['Robots of dubious sentience', 'Trigger-happy scavengers', 'Government researchers', 'Military quarantine enforcers', 'Heirs of the original alien builders'],
		situations:['Trying to stop it awakening', 'Meddling with strange tech', 'Impending tech calamity', 'A terrible secret is unearthed', 'Fighting outside interlopers']
	},
	{
		name:'Research base',
		names:['Outpost', 'Laboratory', 'Science Center', 'Observatory', 'Station', 'Habitat', 'Platform', 'Array'],
		occupants:['Experiments that have gotten loose', 'Scientists from a major local corp', 'Black-ops governmental researchers', 'Secret employees of a foreign power', 'Aliens studying the human locals'],
		situations:['Perlious research underway', 'Hideously immoral research', 'Held hostage by outsiders', 'Science monsters run amok', 'Selling black-market tech']
	},
	{
		name:'Asteroid Belt',
		names:['Asteroid Belt', 'Belt', 'Cluster', 'Cloud', 'Ring'],
		occupants:['Grizzled belter mine laborers', 'Ancient automated guardian drones', 'Survivors of destroyed asteroid base', 'Pirates hiding out among the rocks', 'Lonely military patrol staff'],
		situations:['Ruptured rock released a peril', 'Foreign spy ships hide here', 'Gold rush for new minerals', 'Ancient ruins dot the rocks', 'War between rival rocks']
	},
	{
		name:'Gas Giant Mine',
		names:['Outpost', 'Mine', 'Refinery', '$Gas Mine', 'Platform'],
		occupants:['Miserable gas-miner slaves or serfs', 'Strange robots and their overseers', 'Scientists studying the native life', 'Scrappers in the ruined old mine', 'Impoverished seperatist group'],
		situations:['Things are emerging below', 'They need vital supplies', 'The workers are in revolt', 'Pirates secretly fuel here', 'Alien remains were found']
	},
	{
		name:'Refueling Station',
		names:['Station', 'Outpost', '$Supply Base', '$Fuel Stop', 'Trading Post', 'Platform', 'Depot', '$Port'],
		occupants:['Half-crazed hermit caretaker', 'Sordid purveyors of decadent fun', 'Extortionate corporate minions', 'Religious missionaries to travellers', 'Brainless automated vendors'],
		situations:['A ship is in severe distress', 'Pirates have taken over', 'Has corrupt customs agents', 'Foreign saboteurs are active', 'Deep space alien signal']
	},
	{
		name:'Military Base',
		names:['$Fort', 'Array', '$Defense Base', 'Depot', 'Outpost', 'Emplacement', 'Fortress', 'Base'],
		occupants:['Bored servicemen at a "dead-end" assignment', 'Unscrupulous commander extorts local settlements', 'Training academy', 'Hypervigilant Military AI', 'Blustering, overbearing commander'],
		situations:['A superweapon is secretly being developed here', 'Besieged, cut off from supplies', 'Half-destroyed patrol ship limps home, the first sign of a terrible threat', 'The commander has been subverted', 'Defences have critical weakness']
	}
];

WorldGenerator.tags = [
	{
		name: 'Abandoned Colony',
		description: 'The world once hosted a colony, whether human or otherwise, until some crisis or natural disaster drove the inhabitants away or killed them off. The colony might have been mercantile in nature, an expedition to extract valuable local resources, or it might have been a reclusive cabal of zealots. The remains of the colony are usually in ruins, and might still be dangerous from the aftermath of whatever destroyed it in the first place.',
		enemies: [
			'Crazed survivors',
			'Ruthless plunderers of the ruins',
			'Automated defense system',
		],
		friends: [
			'Inquisitive stellar archaeologist',
			'Heir to the colony’s property',
			'Local wanting the place cleaned out and made safe',
		],
		complications: [
			'The local government wants the ruins to remain a secret',
			'The locals claim ownership of it',
			'The colony is crumbling and dangerous to navigate',
		],
		things: [
			'Long-lost property deeds',
			'Relic stolen by the colonists when they left',
			'Historical record of the colonization attempt',
		],
		places: [
			'Decaying habitation block',
			'Vine-covered town square',
			'Structure buried by an ancient landslide',
		]
	},
	{
		name: 'Alien Ruins',
		description: 'The world has significant alien ruins present. The locals may or may not permit others to investigate the ruins, and may make it difficult to remove any objects of value without substantial payment. Any surviving ruins with worthwhile salvage almost certainly have some defense or hazard to explain their unplundered state.',
		enemies: [
			'Customs inspector',
			'Worshipper of the ruins',
			'Hidden alien survivor',
		],
		friends: [
			'Curious scholar',
			'Avaricious local resident',
			'Interstellar smuggler',
		],
		complications: [
			'Traps in the ruins',
			'Remote location',
			'Paranoid customs officials',
		],
		things: [
			'Precious alien artifacts',
			'Objects left with the remains of a prior unsuccessful expedition',
			'Untranslated alien texts',
			'Untouched hidden ruins',
		],
		places: [
			'Undersea ruin',
			'Orbital ruin',
			'Perfectly preserved alien building',
			'Alien mausoleum',
		]
	},
	{
		name: 'Altered Humanity',
		description: 'The humans on this world are visibly and drastically different from normal humanity. They may have additional limbs, new sensory organs, or other significant changes. Were these from ancestral eugenic manipulation, strange stellar mutations, or from an environmental toxin unique to this world?',
		enemies: [
			'Biochauvinist local',
			'Local experimenter',
			'Mentally unstable mutant',
		],
		friends: [
			'Local seeking a “cure”',
			'Curious xenophiliac',
			'Anthropological researcher',
		],
		complications: [
			'Alteration is contagious',
			'Alteration is necessary for long-term survival',
			'Locals fear and mistrust non-local humans',
		],
		things: [
			'Original pretech mutagenic equipment',
			'Valuable biological byproduct from the mutants',
			'“Cure” for the altered genes',
			'Record of the original colonial genotypes',
		],
		places: [
			'Abandoned eugenics laboratory',
			'An environment requiring the mutation for survival',
			'A sacred site where the first local was transformed',
		]
	},
	{
		name: 'Anarchists',
		description: 'Rather than being an incidental anarchy of struggling tribes and warring factions, this world actually has a functional society with no centralized authority. Authority might be hyper-localized to extended families, specific religious parishes, or voluntary associations. Some force is preventing an outside group or internal malcontents from coalescing into a power capable of imposing its rule on the locals; this force might be an ancient pretech defense system, a benevolent military AI, or the sheer obscurity and isolation of the culture.',
		enemies: [
			'Offworlder imperialist',
			'Reformer seeking to impose “good government”',
			'Exploiter taking advantage of the lack of centralized resistance',
		],
		friends: [
			'Proud missionary for anarchy',
			'Casual local free spirit',
			'Curious offworlder political scientist',
		],
		complications: [
			'The anarchistic structure is compelled by an external power',
			'The anarchy is enabled by currently abundant resources',
			'The protecting force that shelters the anarchy is waning',
		],
		things: [
			'A macguffin that would let the possessor enforce their rule on others',
			'A vital resource needed to preserve general liberty',
			'Tech forbidden as disruptive to the social order',
		],
		places: [
			'Community of similar-sized homes',
			'Isolated clan homestead',
			'Automated mining site',
		]
	},
	{
		name: 'Anthropomorphs',
		description: 'The locals were originally human, but at some point became anthropomorphic, either as an ancient furry colony, a group of animal-worshiping sectarians, or gengineers who just happened to find animal elements most convenient for surviving on the world. Depending on the skill of the original gengineers, their feral forms may or may not work as well as their original human bodies, or may come with drawbacks inherited from their animal elements.',
		enemies: [
			'Anthro-supremacist local',
			'Native driven by feral urges',
			'Outside exploiter who sees the locals as subhuman creatures',
		],
		friends: [
			'Fascinated genetic researcher',
			'Diplomat trained to deal with normals',
			'Local needing outside help',
		],
		complications: [
			'The locals consider their shapes a curse from their foolish ancestors',
			'Society is ordered according to animal forms',
			'The locals view normal humans as repulsive or inferior',
		],
		things: [
			'Pretech gengineering tech',
			'A “cure” that may not be wanted',
			'Sacred feral totem',
		],
		places: [
			'Shrine to a feral deity',
			'Nature preserve suited to an animal type',
			'Living site built to take advantage of animal traits',
		],
	},
	{
		name: 'Area 51',
		description: 'The world’s government is fully aware of their local stellar neighbors, but the common populace has no idea about it- and the government means to keep it that way. Trade with government officials in remote locations is possible, but any attempt to clue the commoners in on the truth will be met with lethal reprisals.',
		enemies: [
			'Suspicious government minder',
			'Free merchant who likes his local monopoly',
			'Local who wants a specimen for dissection',
		],
		friends: [
			'Crusading offworld investigator',
			'Conspiracy- theorist local',
			'Idealistic government reformer',
		],
		complications: [
			'The government has a good reason to keep the truth concealed',
			'The government ruthlessly oppresses the natives',
			'The government is actually composed of offworlders',
		],
		things: [
			'Elaborate spy devices',
			'Memory erasure tech',
			'Possessions of the last offworlder who decided to spread the truth',
		],
		places: [
			'Desert airfield',
			'Deep subterranean bunker',
			'Hidden mountain valley',
		]
	},
	{
		name: 'Badlands World',
		description: 'Whatever the original climate and atmosphere type, something horrible happened to this world. Biological, chemical, or nanotechnical weaponry has reduced it to a wretched hellscape. Some local life might still be able to survive on its blasted surface, usually at some dire cost in health or humanity.',
		enemies: [
			'Mutated badlands fauna',
			'Desperate local',
			'Badlands raider chief',
		],
		friends: [
			'Native desperately wishing to escape the world',
			'Scientist researching ecological repair methods',
			'Ruin scavenger',
		],
		complications: [
			'Radioactivity',
			'Bioweapon traces',
			'Broken terrain',
			'Sudden local plague',
		],
		things: [
			'Maltech research core',
			'Functional pretech weaponry',
			'An uncontaminated well',
		],
		places: [
			'Untouched oasis',
			'Ruined city',
			'Salt flat',
		]
	},
	{
		name: 'Battleground',
		description: 'The world is a battleground for two or more outside powers. They may be interstellar rivals, or groups operating out of orbitals or other system bodies. Something about the planet is valuable enough for them to fight over, but the natives are too weak to be anything but animate obstacles to the fight.',
		enemies: [
			'Ruthless military commander',
			'Looter pack chieftain',
			'Traitorous collaborator',
		],
		friends: [
			'Native desperately seeking protection',
			'Pragmatic military officer',
			'Hapless war orphan',
		],
		complications: [
			'The war just ended as both sides are leaving',
			'The natives somehow brought this on themselves',
			'A small group of natives profit tremendously from the fighting',
		],
		things: [
			'A cache of the resource the invaders seek',
			'Abandoned prototype military gear',
			'Precious spy intelligence lost by someone',
		],
		places: [
			'Artillery-pocked wasteland',
			'Reeking refugee camp',
			'Burnt-out shell of a city',
		]
	},
	{
		name: 'Beastmasters',
		description: 'The natives have extremely close bonds with the local fauna, possibly having special means of communication and control through tech or gengineering. Local animal life plays a major role in their society, industry, or warfare, and new kinds of beasts may be bred to suit their purposes.',
		enemies: [
			'Half-feral warlord of a beast swarm',
			'Coldly inhuman scientist',
			'Altered beast with human intellect and furious malice',
		],
		friends: [
			'Native bonded with an adorable animal',
			'Herder of very useful beasts',
			'Animal-revering mystic',
		],
		complications: [
			'The “animals” are very heavily gengineered humans',
			'The animals actually run the society',
			'The animals have the same rights as humans',
		],
		things: [
			'Tech used to alter animal life',
			'A plague vial that could wipe out the animals',
			'A pretech device that can perform a wonder if operated by a beast',
		],
		places: [
			'Park designed as a comfortable home for beasts',
			'Public plaza designed to accommodate animal companions',
			'Factory full of animal workers',
		]
	},
	{
		name: 'Bubble Cities',
		description: 'Whether due to a lack of atmosphere or an uninhabitable climate, the world’s cities exist within domes or pressurized buildings. In such sealed environments, techniques of surveillance and control can grow baroque and extreme.',
		enemies: [
			'Native dreading outsider contamination',
			'Saboteur from another bubble city',
			'Local official hostile to outsider ignorance of laws',
		],
		friends: [
			'Local rebel against the city officials',
			'Maintenance chief in need of help',
			'Surveyor seeking new building sites',
		],
		complications: [
			'Bubble rupture',
			'Failing atmosphere reprocessor',
			'Native revolt against officials',
			'All-seeing surveillance cameras',
		],
		things: [
			'Pretech habitat technology',
			'Valuable industrial products',
			'Master key codes to a city’s security system',
		],
		places: [
			'City power core',
			'Surface of the bubble',
			'Hydroponics complex',
			'Warren-like hab block',
		]
	},
	{
		name: 'Cheap Life',
		description: 'Human life is near-worthless on this world. Ubiquitous cloning, local conditions that ensure early death, a culture that reveres murder, or a social structure that utterly discounts the value of most human lives ensures that death is the likely outcome for any action that irritates someone consequential.',
		enemies: [
			'Master assassin',
			'Bloody-handed judge',
			'Overseer of disposable clones',
		],
		friends: [
			'Endearing local whose life the PCs accidentally bought',
			'Escapee from death seeking outside help',
			'Reformer trying to change local mores',
		],
		complications: [
			'Radiation or local diseases ensure all locals die before twenty-five years of age',
			'Tech ensures that death is just an annoyance',
			'Locals are totally convinced of a blissful afterlife',
		],
		things: [
			'Device that revives or re-embodies the dead',
			'Maltech engine fueled by human life',
			'Priceless treasure held by a now-dead owner',
		],
		places: [
			'Thronging execution ground',
			'extremely cursory cemetery',
			'Factory full of lethal dangers that could be corrected easily',
		]
	},
	{
		name: 'Civil War',
		description: 'The world is currently torn between at least two opposing factions, all of which claim legitimacy. The war may be the result of a successful rebel uprising against tyranny, or it might just be the result of schemers who plan to be the new masters once the revolution is complete.',
		enemies: [
			'Faction commissar',
			'Angry native',
			'Conspiracy theorist who blames offworlders for the war',
			'Deserter looking out for himself',
			'Guerrilla bandit chieftain',
		],
		friends: [
			'Faction loyalist seeking aid',
			'Native caught in the crossfire',
			'Offworlder seeking passage off the planet',
		],
		complications: [
			'The front rolls over the group',
			'Famine strikes',
			'Bandit infestations are in the way',
		],
		things: [
			'Ammo dump',
			'Military cache',
			'Treasure buried for after the war',
			'Secret war plans',
		],
		places: [
			'Battle front',
			'Bombed-out town',
			'Rear-area red light zone',
			'Propaganda broadcast tower',
		]
	},
	{
		name: 'Cold War',
		description: 'Two or more great powers control the planet, and they have a hostility to each other that’s just barely less than open warfare. The hostility might be ideological in nature, or it might revolve around control of some local resource.',
		enemies: [
			'Suspicious chief of intelligence',
			'Native who thinks the outworlders are with the other side',
			'Femme fatale',
		],
		friends: [
			'Apolitical information broker',
			'Spy for the other side',
			'Unjustly accused innocent',
			'“He’s a bastard, but he’s our bastard” official',
		],
		complications: [
			'Police sweep',
			'Low-level skirmishing',
			'“Red scare”',
		],
		things: [
			'List of traitors in government',
			'secret military plans',
			'Huge cache of weapons built up in preparation for war',
		],
		places: [
			'Seedy bar in a neutral area',
			'Political rally',
			'Isolated area where fighting is underway',
		]
	},
	{
		name: 'Colonized Population',
		description: 'A neighboring world has successfully colonized this less-advanced or less-organized planet, and the natives aren’t happy about it. A puppet government may exist, but all real decisions are made by the local viceroy.',
		enemies: [
			'Suspicious security personnel',
			'Offworlder-hating natives',
			'Local crime boss preying on rich offworlders',
		],
		friends: [
			'Native resistance leader',
			'Colonial official seeking help',
			'Native caught between the two sides',
		],
		complications: [
			'Natives won’t talk to offworlders',
			'Colonial repression',
			'Misunderstood local customs',
		],
		things: [
			'Relic of the resistance movement',
			'List of collaborators',
			'Precious substance extracted by colonial labor',
		],
		places: [
			'Deep wilderness resistance camp',
			'City district off-limits to natives',
			'Colonial labor site',
		]
	},
	{
		name: 'Cultural Power',
		description: 'The world is a considerable cultural power in the sector, producing music, art, philosophy, or some similar intangible that their neighbors find irresistibly attractive. Other worlds might have a profound degree of cultural cachet as the inheritor of some venerable artistic tradition.',
		enemies: [
			'Murderously eccentric artist',
			'Crazed fan',
			'Failed artist with an obsessive grudge',
			'Critic with a crusade to enact',
		],
		friends: [
			'Struggling young artist',
			'Pupil of the artistic tradition',
			'Scholar of the art',
			'Offworlder hating the source of corrupting alien ways',
		],
		complications: [
			'The art is slowly lethal to its masters',
			'The art is mentally or physically addictive',
			'The art is a fragment of ancient technical or military science',
		],
		things: [
			'The instrument of a legendary master',
			'The only copy of a dead master’s opus',
			'Proof of intellectual property ownership',
		],
		places: [
			'Recording or performance studio',
			'Public festival choked with tourists',
			'Monument to a dead master of the art',
		]
	},
	{
		name: 'Cybercommunists',
		description: 'On this world communism actually works, thanks to pretech computing devices and greater or lesser amounts of psychic precognition. Central planning nodes direct all production and employment on the world. Citizens in good standing have access to ample amounts of material goods for all needs and many wants. Instead of strife over wealth, conflicts erupt over political controls, cultural precepts, or control over the planning nodes. Many cybercommunist worlds show a considerable bias toward the private interests of those who run the planning nodes.',
		enemies: [
			'Embittered rebel against perceived unfairness',
			'Offworlder saboteur',
			'Aspiring Stalin-figure',
		],
		friends: [
			'Idealistic planning node tech',
			'Cynical anti-corruption cop',
			'Precognitive economist',
		],
		complications: [
			'The pretech planning computers are breaking down',
			'The planning only works because the locals have been mentally or physically altered',
			'The planning computers can’t handle the increasing population within the system',
		],
		things: [
			'Planning node computer',
			'Wildly destabilizing commodity that can’t be factored into plans',
			'A tremendous store of valuables made by accident',
		],
		places: [
			'Humming factory',
			'Apartment block of perfectly equal flats',
			'Mass demonstration of unity',
		]
	},
	{
		name: 'Cyborgs',
		description: 'The planet’s population makes heavy use of cybernetics, with many of the inhabitants possessing at least a cosmetic amount of chrome. This may be the result of a strong local cyber tech base, a religious injunction, or simply a necessary measure to survive the local conditions.',
		enemies: [
			'Ambitious hacker of cyber implants',
			'Cybertech oligarch',
			'Researcher craving fresh offworlders',
			'Cybered-up gang boss',
		],
		friends: [
			'Charity-working implant physician',
			'Idealistic young cyber researcher',
			'Avant-garde activist',
		],
		complications: [
			'The powerful and dangerous come here often for cutting-edge implants',
			'The cyber has some universal negative side-effect',
			'Cyber and those implanted with it are forbidden to leave the planet as a tech security measure',
		],
		things: [
			'Unique prototype cyber implant',
			'Secret research files',
			'A virus that debilitates cyborgs',
			'A cache of critically-needed therapeutic cyber',
		],
		places: [
			'Grimy slum chop-shop',
			'Bloody lair of implant rippers',
			'Stark plaza where everyone is seeing things through their augmented-reality cyber',
		]
	},
	{
		name: 'Cyclical Doom',
		description: 'The world regularly suffers some apocalyptic catastrophe that wipes out organized civilization on it. The local culture is aware of this cycle and has traditions to ensure a fragment of civilization survives into the next era, but these traditions don’t always work properly, and sometimes dangerous fragments of the past emerge.',
		enemies: [
			'Offworlder seeking to trigger the apocalypse early for profit',
			'Local recklessly taking advantage of preparation stores',
			'Demagogue claiming the cycle is merely a myth of the authorities',
		],
		friends: [
			'Harried official working to prepare',
			'Offworlder studying the cycles',
			'Local threatened by perils of the cycle’s initial stages',
		],
		complications: [
			'The cycles really are a myth of the authorities',
			'The cycles are controlled by alien constructs',
			'An outside power is interfering with preparation',
		],
		things: [
			'A lost cache of ancient treasures',
			'Tech or archives that will pinpoint the cycle’s timing',
			'Keycodes to bypass an ancient vault’s security',
		],
		places: [
			'Lethally-defended vault of forgotten secrets',
			'Starport crowded with panicked refugees',
			'Town existing in the shadow of some monstrous monument to a former upheaval',
		]
	},
	{
		name: 'Desert World',
		description: 'The world may have a breathable atmosphere and a human-tolerable temperature range, but it is an arid, stony waste outside of a few places made habitable by human effort. The deep wastes are largely unexplored and inhabited by outcasts and worse.',
		enemies: [
			'Raider chieftain',
			'Crazed hermit',
			'Angry isolationists',
			'Paranoid mineral prospector',
			'Strange desert beast',
		],
		friends: [
			'Native guide',
			'Research biologist',
			'Aspiring terraformer',
		],
		complications: [
			'Sandstorms',
			'Water supply failure',
			'Native warfare over water rights',
		],
		things: [
			'Enormous water reservoir',
			'Map of hidden wells',
			'Pretech rainmaking equipment',
		],
		places: [
			'Oasis',
			'“The Empty Quarter” of the desert',
			'Hidden underground cistern',
		]
	},
	{
		name: 'Doomed World',
		description: 'The world is doomed, and the locals may or may not know it. Some cosmic catastrophe looms before them, and the locals have no realistic way to get everyone to safety. To the extent that the public is aware, society is disintegrating into a combination of religious fervor, abject hedonism, and savage violence.',
		enemies: [
			'Crazed prophet of a false salvation',
			'Ruthless leader seeking to flee with their treasures',
			'Cynical ship captain selling a one-way trip into hard vacuum as escape to another world',
		],
		friends: [
			'Appealing waif or family head seeking escape',
			'Offworld relief coordinator',
			'Harried law officer',
		],
		complications: [
			'The doom is false or won’t actually kill everyone',
			'The doom was intentionally triggered by someone',
			'Mass escape is possible if warring groups can somehow be brought to cooperate',
		],
		things: [
			'Clearance for a ship to leave the planet',
			'A cache of priceless cultural artifacts',
			'The life savings of someone trying to buy passage out',
			'Data that would prove to the public the end is nigh',
		],
		places: [
			'Open square beneath a sky angry with a foretaste of th impending ruin',
			'Orgiastic celebration involving sex and murder in equal parts',
			'Holy site full of desperate petitioners to the divine',
		]
	},
	{
		name: 'Dying Race',
		description: 'The inhabitants of this world are dying out, and they know it. Through environmental toxins, hostile bio-weapons, or sheer societal despair, the culture cannot replenish its numbers. Members seek meaning in their own strange goals or peculiar faiths, though a few might struggle to find some way to reverse their slow yet inevitable doom.',
		enemies: [
			'Hostile outsider who wants the locals dead',
			'Offworlder seeking to take advantage of their weakened state',
			'Invaders eager to push the locals out of their former lands',
		],
		friends: [
			'One of the few youth among the population',
			'Determined and hopeful reformer',
			'Researcher seeking a new method of reproduction',
		],
		complications: [
			'The dying culture’s values were monstrous',
			'The race’s death is somehow necessary to prevent some grand catastrophe',
			'The race is somehow convinced they deserve this fate',
		],
		things: [
			'Extremely valuable reproductive tech',
			'Treasured artifacts of the former age',
			'Bioweapon used on the race',
		],
		places: [
			'City streets devoid of pedestrians',
			'Mighty edifice now crumbling with disrepair',
			'Small dwelling full of people in a town now otherwise empty',
		]
	},
	{
		name: 'Eugenic Cult',
		description: 'Even in the days before the Silence, major improvement of the human genome always seemed to come with unacceptable side-effects. Some worlds host secret cults that perpetuate these improvements regardless of the cost, and a few planets have been taken over entirely by the cults.',
		enemies: [
			'Eugenic superiority fanatic',
			'Mentally unstable homo superior',
			'Mad eugenic scientist',
		],
		friends: [
			'Eugenic propagandist',
			'Biotechnical investigator',
			'Local seeking revenge on cult',
		],
		complications: [
			'The altered cultists look human',
			'The locals are terrified of any unusual physical appearance',
			'The genetic modifications- and drawbacks- are contagious with long exposure',
		],
		things: [
			'Serum that induces the alteration',
			'Elixir that reverses the alteration',
			'Pretech biotechnical databanks',
			'List of secret cult sympathizers',
		],
		places: [
			'Eugenic breeding pit',
			'Isolated settlement of altered humans',
			'Public place infiltrated by cult sympathizers',
		]
	},
	{
		name: 'Exchange Consulate',
		description: 'The Exchange of Light once served as the largest, most trusted banking and diplomatic service in human space. Even after the Silence, some worlds retain a functioning Exchange Consulate where banking services and arbitration can be arranged.',
		enemies: [
			'Corrupt Exchange official',
			'Indebted native who thinks the players are Exchange agents',
			'Exchange official dunning the players for debts incurred',
		],
		friends: [
			'Consul in need of offworld help',
			'Local banker seeking to hurt his competition',
			'Exchange diplomat',
		],
		complications: [
			'The local Consulate has been corrupted',
			'the Consulate is cut off from its funds',
			'A powerful debtor refuses to pay',
		],
		things: [
			'Exchange vault codes',
			'Wealth hidden to conceal it from a bankruptcy judgment',
			'Location of forgotten vault',
		],
		places: [
			'Consulate meeting chamber',
			'Meeting site between fractious disputants',
			'Exchange vault',
		]
	},
	{
		name: 'Fallen Hegemon',
		description: 'At some point in the past, this world was a hegemonic power over some or all of the sector, thanks to superior tech, expert diplomacy, the weakness of their neighbors, or inherited Mandate legitimacy. Some kind of crash or revolt broke their power, however, and now the world is littered with the wreckage of former glory.',
		enemies: [
			'Bitter pretender to a meaningless throne',
			'Resentful official dreaming of empire',
			'Vengeful offworlder seeking to punish their old rulers',
		],
		friends: [
			'Realistic local leader trying to hold things together',
			'Scholar of past glories',
			'Refugee from an overthrown colonial enclave',
		],
		complications: [
			'The hegemon’s rule was enlightened and fair',
			'It collapsed due to its own internal strife rather than external resistance',
			'It pretends that nothing has happened to its power',
			'It’s been counter-colonized by vengeful outsiders',
		],
		things: [
			'Precious insignia of former rule',
			'Relic tech important to its power',
			'Plundered colonial artifact',
		],
		places: [
			'Palace far too grand for its current occupant',
			'Oversized spaceport now in disrepair',
			'Boulevard lined with monuments to past glories',
		]
	},
	{
		name: 'Feral World',
		description: 'In the long, isolated night of the Silence, some worlds have experienced total moral and cultural collapse. Whatever remains has been twisted beyond recognition into assorted death cults, xenophobic fanaticism, horrific cultural practices, or other behavior unacceptable on more enlightened worlds. These worlds are almost invariably quarantined by other planets.',
		enemies: [
			'Decadent noble',
			'Mad cultist',
			'Xenophobic local',
			'Cannibal chief',
			'Maltech researcher',
		],
		friends: [
			'Trapped outworlder',
			'Aspiring reformer',
			'Native wanting to avoid traditional flensing',
		],
		complications: [
			'Horrific local “celebration”',
			'Inexplicable and repugnant social rules',
			'Taboo zones and people',
		],
		things: [
			'Terribly misused piece of pretech',
			'Wealth accumulated through brutal evildoing',
			'Valuable possession owned by luckless outworlder victim',
		],
		places: [
			'Atrocity amphitheater',
			'Traditional torture parlor',
			'Ordinary location twisted into something terrible.',
		]
	},
	{
		name: 'Flying Cities',
		description: 'Perhaps the world is a gas giant, or plagued with unendurable storms at lower levels of the atmosphere. For whatever reason, the cities of this world fly above the surface of the planet. Perhaps they remain stationary, or perhaps they move from point to point in search of resources.',
		enemies: [
			'Rival city pilot',
			'Tech thief attempting to steal outworld gear',
			'Saboteur or scavenger plundering the city’s tech',
		],
		friends: [
			'Maintenance tech in need of help',
			'City defense force pilot',
			'Meteorological researcher',
		],
		complications: [
			'Sudden storms',
			'Drastic altitude loss',
			'Rival city attacks',
			'Vital machinery breaks down',
		],
		things: [
			'Precious refined atmospheric gases',
			'Pretech grav engine plans',
			'Meteorological codex predicting future storms',
		],
		places: [
			'Underside of the city',
			'The one calm place on the planet’s surface',
			'Catwalks stretching over unimaginable gulfs below.',
		]
	},
	{
		name: 'Forbidden Tech',
		description: 'Some group on this planet fabricates or uses maltech. Unbraked AIs doomed to metastasize into insanity, nation-destroying nanowarfare particles, slow-burn DNA corruptives, genetically engineered slaves, or something worse still. The planet’s larger population may or may not be aware of the danger in their midst.',
		enemies: [
			'Mad scientist',
			'Maltech buyer from offworld',
			'Security enforcer',
		],
		friends: [
			'Victim of maltech',
			'Perimeter agent',
			'Investigative reporter',
			'Conventional arms merchant',
		],
		complications: [
			'The maltech is being fabricated by an unbraked AI',
			'The government depends on revenue from maltech sales to offworlders',
			'Citizens insist that it’s not really maltech',
		],
		things: [
			'Maltech research data',
			'The maltech itself',
			'Precious pretech equipment used to create it',
		],
		places: [
			'Horrific laboratory',
			'Hellscape sculpted by the maltech’s use',
			'Government building meeting room',
		]
	},
	{
		name: 'Former Warriors',
		description: 'The locals of this world were once famed for their martial prowess. They may have simply had a very militaristic culture, or were genetically engineered for combat, or developed high-tech weaponry, or had brilliant leadership. Those days are past, however, either due to crushing defeat, external restrictions, or a cultural turn toward peace.',
		enemies: [
			'Unreformed warlord leader',
			'Bitter mercenary chief',
			'Victim of their warfare seeking revenge',
		],
		friends: [
			'Partisan of the new peaceful ways',
			'Outsider desperate for military aid',
			'Martial genius repressed by the new dispensation',
		],
		complications: [
			'Neighboring worlds want them pacified or dead',
			'They only ever used their arts in self-defense',
			'The source of their gifts has been “turned off” in a reversible way',
		],
		things: [
			'War trophy taken from a defeated foe',
			'Key to re-activating their martial ways',
			'Secret cache of high-tech military gear',
		],
		places: [
			'Cemetery of dead heroes',
			'Memorial hall now left to dust and silence',
			'Monument plaza dedicated to the new culture',
		]
	},
	{
		name: 'Freak Geology',
		description: 'The geology or geography of this world is simply freakish. Perhaps it’s composed entirely of enormous mountain ranges, or regular bands of land and sea, or the mineral structures all fragment into perfect cubes. The locals have learned to deal with it and their culture will be shaped by its requirements.',
		enemies: [
			'Crank xenogeologist',
			'Cultist who believes it the work of aliens',
		],
		friends: [
			'Research scientist',
			'Prospector',
			'Artist',
		],
		complications: [
			'Local conditions that no one remembers to tell outworlders about',
			'Lethal weather',
			'Seismic activity',
		],
		things: [
			'Unique crystal formations',
			'Hidden veins of a major precious mineral strike',
			'Deed to a location of great natural beauty',
		],
		places: [
			'Atop a bizarre geological formation',
			'Tourist resort catering to offworlders',
		]
	},
	{
		name: 'Freak Weather',
		description: 'The planet is plagued with some sort of bizarre or hazardous weather pattern. Perhaps city-flattening storms regularly scourge the surface, or the world’s sun never pierces its thick banks of clouds.',
		enemies: [
			'Criminal using the weather as a cover',
			'Weather cultists convinced the offworlders are responsible for some disaster',
			'Native predators dependent on the weather',
		],
		friends: [
			'Meteorological researcher',
			'Holodoc crew wanting shots of the weather',
		],
		complications: [
			'The weather itself',
			'Malfunctioning pretech terraforming engines that cause the weather',
		],
		things: [
			'Wind-scoured deposits of precious minerals',
			'Holorecords of a spectacularly and rare weather pattern',
			'Naturally-sculpted objects of intricate beauty',
		],
		places: [
			'Eye of the storm',
			'The one sunlit place',
			'Terraforming control room',
		]
	},
	{
		name: 'Friendly Foe',
		description: 'Some hostile alien race or malevolent cabal has a branch or sect on this world that is actually quite friendly toward outsiders. For whatever internal reason, they are willing to negotiate and deal honestly with strangers, and appear to lack the worst impulses of their fellows.',
		enemies: [
			'Driven hater of all their kind',
			'Internal malcontent bent on creating conflict',
			'Secret master who seeks to lure trust',
		],
		friends: [
			'Well-meaning bug-eyed monster',
			'Principled eugenics cultist',
			'Suspicious investigator',
		],
		complications: [
			'The group actually is as harmless and benevolent as they seem',
			'The group offers a vital service at the cost of moral compromise',
			'The group still feels bonds of affiliation with their hostile brethren',
		],
		things: [
			'Forbidden xenotech',
			'Eugenic biotech template',
			'Evidence to convince others of their kind that they are right',
		],
		places: [
			'Repurposed maltech laboratory',
			'Alien conclave building',
			'Widely-feared starship interior',
		]
	},
	{
		name: 'Gold Rush',
		description: 'Gold, silver, and other conventional precious minerals are common and cheap now that asteroid mining is practical for most worlds. But some minerals and compounds remain precious and rare, and this world has recently been discovered to have a supply of them. People from across the sector have come to strike it rich.',
		enemies: [
			'Paranoid prospector',
			'Aspiring mining tycoon',
			'Rapacious merchant',
		],
		friends: [
			'Claim-jumped miner',
			'Native alien',
			'Curious tourist',
		],
		complications: [
			'The strike is a hoax',
			'The strike is of a dangerous toxic substance',
			'Export of the mineral is prohibited by the planetary government',
			'The native aliens live around the strike’s location',
		],
		things: [
			'Cases of the refined element',
			'Pretech mining equipment',
			'A dead prospector’s claim deed',
		],
		places: [
			'Secret mine',
			'Native alien village',
			'Processing plant',
			'Boom town',
		]
	},
	{
		name: 'Great Work',
		description: 'The locals are obsessed with completing a massive project, one that has consumed them for generations. It might be the completion of a functioning spaceyard, a massive solar power array, a network of terraforming engines, or the universal conversion of their neighbors to their own faith. The purpose of their entire civilization is to progress and some day complete the work.',
		enemies: [
			'Local planning to sacrifice the PCs for the work',
			'Local who thinks the PCs threaten the work',
			'Obsessive zealot ready to destroy someone or something important to the PCs for the sake of the work',
		],
		friends: [
			'Outsider studying the work',
			'Local with a more temperate attitude',
			'Supplier of work materials',
		],
		complications: [
			'The work is totally hopeless',
			'Different factions disagree on what the work is',
			'An outside power is determined to thwart the work',
		],
		things: [
			'Vital supplies for the work',
			'Plans that have been lost',
			'Tech that greatly speeds the work',
		],
		places: [
			'A bustling work site',
			'Ancestral worker housing',
			'Local community made only semi-livable by the demands of the work',
		]
	},
	{
		name: 'Hatred',
		description: 'For whatever reason, this world’s populace has a burning hatred for the inhabitants of a neighboring system. Perhaps this world was colonized by exiles, or there was a recent interstellar war, or ideas of racial or religious superiority have fanned the hatred. Regardless of the cause, the locals view their neighbor and any sympathizers with loathing.',
		enemies: [
			'Native convinced that the offworlders are agents of Them',
			'Cynical politician in need of scapegoats',
		],
		friends: [
			'Intelligence agent needing catspaws',
			'Holodoc producers needing “an inside look”',
			'Unlucky offworlder from the hated system',
		],
		complications: [
			'The characters are wearing or using items from the hated world',
			'The characters are known to have done business there',
			'The characters “look like” the hated others',
		],
		things: [
			'Proof of Their evildoing',
			'Reward for turning in enemy agents',
			'Relic stolen by Them years ago',
		],
		places: [
			'War crimes museum',
			'Atrocity site',
			'Captured and decommissioned spaceship kept as a trophy',
		]
	},
	{
		name: 'Heavy Industry',
		description: 'With interstellar transport so limited in the bulk it can move, worlds have to be largely self-sufficient in industry. Some worlds are more sufficient than others, however, and this planet has a thriving manufacturing sector capable of producing large amounts of goods appropriate to its tech level. The locals may enjoy a correspondingly higher lifestyle, or the products might be devoted towards vast projects for the aggrandizement of the rulers.',
		enemies: [
			'Tycoon monopolist',
			'Industrial spy',
			'Malcontent revolutionary',
		],
		friends: [
			'Aspiring entrepreneur',
			'Worker union leader',
			'Ambitious inventor',
		],
		complications: [
			'The factories are toxic',
			'The resources extractable at their tech level are running out',
			'The masses require the factory output for survival',
			'The industries’ major output is being obsoleted by offworld tech',
		],
		things: [
			'Confidential industrial data',
			'Secret union membership lists',
			'Ownership shares in an industrial complex',
		],
		places: [
			'Factory floor',
			'Union meeting hall',
			'Toxic waste dump',
			'R&D complex',
		]
	},
	{
		name: 'Heavy Mining',
		description: 'This world has large stocks of valuable minerals, usually necessary for local industry, life support, or refinement into loads small enough to export offworld. Major mining efforts are necessary to extract the minerals, and many natives work in the industry.',
		enemies: [
			'Mine boss',
			'Tunnel saboteur',
			'Subterranean predators',
		],
		friends: [
			'Hermit prospector',
			'Offworld investor',
			'Miner’s union representative',
		],
		complications: [
			'The refinery equipment breaks down',
			'Tunnel collapse',
			'Silicate life forms growing in the miners’ lungs',
		],
		things: [
			'The mother lode',
			'Smuggled case of refined mineral',
			'Faked crystalline mineral samples',
		],
		places: [
			'Vertical mine face',
			'Tailing piles',
			'Roaring smelting complex',
		]
	},
	{
		name: 'Hivemind',
		description: 'Natives of this world exist in a kind of mental gestalt, sharing thoughts and partaking of a single identity. Powerful pretech, exotic psionics, alien influence, or some other cause has left the world sharing one identity. Individual members may have greater or lesser degrees of effective coordination with the whole.',
		enemies: [
			'A hivemind that wants to assimilate outsiders',
			'A hivemind that has no respect for unjoined life',
			'A hivemind that fears and hates unjoined life',
		],
		friends: [
			'A scholar studying the hivemind',
			'A person severed from the gestalt',
			'A relative of someone who has been assimilated',
		],
		complications: [
			'The hivemind only functions on this world',
			'The hivemind has strict range limits',
			'The hivemind has different personality factions',
			'The hivemind only happens at particular times',
			'The world is made of semi-sentient drones and a single AI',
		],
		things: [
			'Vital tech for maintaining the mind',
			'Precious treasure held by now-assimilated outsider',
			'Tech that “blinds” the hivemind to the tech’s users',
		],
		places: [
			'Barely tolerable living cells for individuals',
			'Workside where individuals casually die in their labors',
			'Community with absolutely no social or group-gathering facilities',
		]
	},
	{
		name: 'Holy War',
		description: 'A savage holy war is raging on this world, either between factions of locals or as a united effort against the pagans of some neighboring world. This war might involve a conventional religion, or it might be the result of a branding campaign, political ideology, artistic movement, or any other cause that people use as a substitute for traditional religion.',
		enemies: [
			'Blood-mad pontiff',
			'Coldly cynical secular leader',
			'Totalitarian political demagogue',
		],
		friends: [
			'Desperate peacemaker',
			'Hard-pressed refugee of the fighting',
			'Peaceful religious leader who lost the internal debate',
		],
		complications: [
			'The targets of the war really are doing something diabolically horrible',
			'The holy war is just a mask for a very traditional casus belli',
			'The leaders don’t want the war won but only prolonged',
			'Both this world and the target of the war are religion-obsessed',
		],
		things: [
			'Sacred relic of the faith',
			'A captured blasphemer under a death sentence',
			'Plunder seized in battle',
		],
		places: [
			'Massive holy structure',
			'Razed community of infidels',
			'Vast shrine to the martyrs dead in war',
		]
	},
	{
		name: 'Hostile Biosphere',
		description: 'The world is teeming with life, and it hates humans. Perhaps the life is xenoallergenic, forcing filter masks and tailored antiallergens for survival. It could be the native predators are huge and fearless, or the toxic flora ruthlessly outcompetes earth crops.',
		enemies: [
			'Local fauna',
			'Nature cultist',
			'Native aliens',
			'Callous labor overseer',
		],
		friends: [
			'Xenobiologist',
			'Tourist on safari',
			'Grizzled local guide',
		],
		complications: [
			'Filter masks fail',
			'Parasitic alien infestation',
			'Crop greenhouses lose bio-integrity',
		],
		things: [
			'Valuable native biological extract',
			'Abandoned colony vault',
			'Remains of an unsuccessful expedition',
		],
		places: [
			'Deceptively peaceful glade',
			'Steaming polychrome jungle',
			'Nightfall when surrounded by Things',
		]
	},
	{
		name: 'Hostile Space',
		description: 'The system in which the world exists is a dangerous neighborhood. Something about the system is perilous to inhabitants, either through meteor swarms, stellar radiation, hostile aliens in the asteroid belt, or periodic comet clouds.',
		enemies: [
			'Alien raid leader',
			'Meteor-launching terrorists',
			'Paranoid local leader',
		],
		friends: [
			'Astronomic researcher',
			'Local defense commander',
			'Early warning monitor agent',
		],
		complications: [
			'The natives believe the danger is divine chastisement',
			'The natives blame outworlders for the danger',
			'The native elite profit from the danger in some way',
		],
		things: [
			'Early warning of a raid or impact',
			'Abandoned riches in a disaster zone',
			'Key to a secure bunker',
		],
		places: [
			'City watching an approaching asteroid',
			'Village burnt in an alien raid',
			'Massive ancient crater',
		]
	},
	{
		name: 'Immortals',
		description: 'Natives of this world are effectively immortal. They may have been gengineered for tremendous lifespans, or have found some local anagathic, or be cyborg life forms, or be so totally convinced of reincarnation that death is a cultural irrelevance. Any immortality technique is likely applicable only to them, or else it’s apt to be a massive draw to outside imperialists.',
		enemies: [
			'Outsider determined to steal immortality',
			'Smug local convinced of their immortal wisdom to rule all',
			'Offworlder seeking the world’s ruin before it becomes a threat to all',
		],
		friends: [
			'Curious longevity researcher',
			'Thrill-seeking local,',
		],
		complications: [
			'Immortality requires doing something that outsiders can’t or won’t willingly do',
			'The immortality ends if they leave the world',
			'Death is the punishment for even minor crimes',
			'Immortals must die or go offworld after a certain span',
			'Immortality has brutal side-effects',
		],
		things: [
			'Immortality drug',
			'Masterwork of an ageless artisan',
			'Toxin that only affects immortals',
		],
		places: [
			'Community with no visible children',
			'Unchanging structure of obvious ancient age',
			'Cultural performance relying on a century of in-jokes',
		]
	},
	{
		name: 'Local Specialty',
		description: 'The world may be sophisticated or barely capable of steam engines, but either way it produces something rare and precious to the wider galaxy. It might be some pharmaceutical extract produced by a secret recipe, a remarkably popular cultural product, or even gengineered humans uniquely suited for certain work.',
		enemies: [
			'Monopolist',
			'Offworlder seeking prohibition of the specialty',
			'Native who views the specialty as sacred',
		],
		friends: [
			'Spy searching for the source',
			'Artisan seeking protection',
			'Exporter with problems',
		],
		complications: [
			'The specialty is repugnant in nature',
			'The crafters refuse to sell to offworlders',
			'The specialty is made in a remote',
			'dangerous place',
			'The crafters don’t want to make the specialty any more',
		],
		things: [
			'The specialty itself',
			'The secret recipe',
			'Sample of a new improved variety',
		],
		places: [
			'Secret manufactory',
			'Hidden cache',
			'Artistic competition for best artisan',
		]
	},
	{
		name: 'Local Tech',
		description: 'The locals can create a particular example of extremely high tech, possibly even something that exceeds pretech standards. They may use unique local resources to do so, or have stumbled on a narrow scientific breakthrough, or still have a functional experimental manufactory.',
		enemies: [
			'Keeper of the tech',
			'Offworld industrialist',
			'Automated defenses that suddenly come alive',
			'Native alien mentors',
		],
		friends: [
			'Curious offworld scientist',
			'Eager tech buyer',
			'Native in need of technical help',
		],
		complications: [
			'The tech is unreliable',
			'The tech only works on this world',
			'The tech has poorly-understood side effects',
			'The tech is alien in nature.',
		],
		things: [
			'The tech itself',
			'An unclaimed payment for a large shipment',
			'The secret blueprints for its construction',
			'An ancient alien R&D database',
		],
		places: [
			'Alien factory',
			'Lethal R&D center',
			'Tech brokerage vault',
		]
	},
	{
		name: 'Major Spaceyard',
		description: 'Most worlds of tech level 4 or greater have the necessary tech and orbital facilities to build spike drives and starships. This world is blessed with a major spaceyard facility, either inherited from before the Silence or painstakingly constructed in more recent decades. It can build even capital-class hulls, and do so more quickly and cheaply than its neighbors.',
		enemies: [
			'Enemy saboteur',
			'Industrial spy',
			'Scheming construction tycoon',
			'Aspiring ship hijacker',
		],
		friends: [
			'Captain stuck in drydock',
			'Maintenance chief',
			'Mad innovator',
		],
		complications: [
			'The spaceyard is an alien relic',
			'The spaceyard is burning out from overuse',
			'The spaceyard is alive',
			'The spaceyard relies on maltech to function',
		],
		things: [
			'Intellectual property-locked pretech blueprints',
			'Override keys for activating old pretech facilities',
			'A purchased but unclaimed spaceship.',
		],
		places: [
			'Hidden shipyard bay',
			'Surface of a partially-completed ship',
			'Ship scrap graveyard',
		]
	},
	{
		name: 'Mandarinate',
		description: 'The planet is ruled by an intellectual elite chosen via ostensibly neutral examinations or tests. The values this system selects for may or may not have anything to do with actual practical leadership skills, and the examinations may be more or less corruptible.',
		enemies: [
			'Corrupt test administrator',
			'Incompetent but highly-rated graduate',
			'Ruthless leader of a clan of high-testing relations',
		],
		friends: [
			'Crusader for test reform',
			'Talented but poorly- connected graduate',
			'Genius who tests badly',
		],
		complications: [
			'The test is totally unrelated to necessary governing skills',
			'The test was very pertinent in the past but tech or culture has changed',
			'The test is for a skill that is vital to maintaining society but irrelevant to day-to-day governance',
			'The test is a sham and passage is based on wealth or influence',
		],
		things: [
			'Answer key to the next test',
			'Lost essay of incredible merit',
			'Proof of cheating',
		],
		places: [
			'Massive structure full of test-taking cubicles',
			'School filled with desperate students',
			'Ornate government building decorated with scholarly quotes and academic images',
		]
	},
	{
		name: 'Mandate Base',
		description: 'The Terran Mandate retained its control over this world for much longer than usual, and the world may still consider itself a true inheritor of Mandate legitimacy. Most of these worlds have or had superior technology, but they may still labor under the burden of ancient restrictive tech or monitoring systems designed to prevent them from rebelling.',
		enemies: [
			'Deranged Mandate monitoring AI',
			'Aspiring sector ruler',
			'Demagogue preaching local superiority over “traitorous rebel worlds”.',
		],
		friends: [
			'Idealistic do-gooder local',
			'Missionary for advanced Mandate tech',
			'Outsider seeking lost data from Mandate records',
		],
		complications: [
			'The monitoring system forces the locals to behave in aggressive ways toward “rebel” worlds',
			'The monitoring system severely hinders offworld use of their tech',
			'The original colonists are all dead and have been replaced by outsiders who don’t understand all the details',
		],
		things: [
			'Ultra-advanced pretech',
			'Mandate military gear',
			'Databank containing precious tech schematics',
		],
		places: [
			'Faded Mandate offices still in use',
			'Vault containing ancient pretech',
			'Carefully-maintained monument to Mandate glory',
		]
	},
	{
		name: 'Maneaters',
		description: 'The locals are cannibals, either out of necessity or out of cultural preference. Some worlds may actually eat human flesh, while others simply require the rendering of humans into important chemicals or pharmaceutical compounds, perhaps to prolong the lives of ghoul overlords. This cannibalism plays a major role in their society.',
		enemies: [
			'Ruthless ghoul leader',
			'Chieftain of a ravenous tribe',
			'Sophisticated degenerate preaching the splendid authenticity of cannibalism',
		],
		friends: [
			'Sympathetic local fleeing the fork',
			'Escapee from a pharmaceutical rendering plant',
			'Outsider chosen for dinner',
			'Reformer seeking to break the custom or its necessity',
		],
		complications: [
			'Local food or environmental conditions make human consumption grimly necessary',
			'The locals farm human beings',
			'Outsiders are expected to join in the custom',
			'The custom is totally unnecessary but jealously maintained by the people',
		],
		things: [
			'Belongings of a recent meal',
			'An offworlder VIP due for the menu',
			'A toxin that makes human flesh lethal to consumers',
		],
		places: [
			'Hideous human abattoir',
			'Extremely civilized restaurant',
			'Funeral-home-cum-kitchen',
		]
	},
	{
		name: 'Megacorps',
		description: 'The world is dominated by classic cyberpunk-esque megacorporations, each one far more important than the vestigial national remnants that encompass them. These megacorps are usually locked in a cold war, trading and dealing with each other even as they try to strike in deniable ways. An over-council of corporations usually acts to bring into line any that get excessively overt in their activities.',
		enemies: [
			'Megalomaniacal executive',
			'Underling looking to use the PCs as catspaws',
			'Ruthless mercenary who wants what the PCs have',
		],
		friends: [
			'Victim of megacorp scheming',
			'Offworlder merchant in far over their head',
			'Local reformer struggling to cope with megacorp indifference',
		],
		complications: [
			'The megacorps are the only source of something vital to life on this world',
			'An autonomous Mandate system acts to punish excessively overt violence',
			'The megacorps are struggling against much more horrible national governments',
		],
		things: [
			'Blackmail on a megacorp exec',
			'Keycodes to critical corp secrets',
			'Proof of corp responsibility for a heinously unacceptable public atrocity',
			'Data on a vital new product line coming out soon',
		],
		places: [
			'A place plastered in megacorp ads',
			'A public plaza discreetly branded',
			'Private corp military base',
		]
	},
	{
		name: 'Mercenaries',
		description: 'The world is either famous for its mercenary bands or it is plagued by countless groups of condottieri in service to whatever magnate can afford to pay or bribe them adequately.',
		enemies: [
			'Amoral mercenary leader',
			'Rich offworlder trying to buy rule of the world',
			'Mercenary press gang chief forcing locals into service',
		],
		friends: [
			'Young and idealistic mercenary chief',
			'Harried leader of enfeebled national army',
			'Offworlder trying to hire help for a noble cause',
		],
		complications: [
			'The mercenaries are all that stand between the locals and a hungry imperial power',
			'The mercenaries are remnants of a former official army',
			'The mercenaries hardly ever actually fight as compared to taking bribes to walk away',
		],
		things: [
			'Lost mercenary payroll shipment',
			'Forbidden military tech',
			'Proof of a band’s impending treachery against their employers',
		],
		places: [
			'Shabby camp of undisciplined mercs',
			'Burnt-out village occupied by mercenaries',
			'Luxurious and exceedingly well-defended merc leader villa',
		]
	},
	{
		name: 'Minimal Contact',
		description: 'The locals refuse most contact with offworlders. Only a small, quarantined treaty port is provided for offworld trade, and ships can expect an exhaustive search for contraband. Local governments may be trying to keep the very existence of interstellar trade a secret from their populations, or they may simply consider offworlders too dangerous or repugnant to be allowed among the population.',
		enemies: [
			'Customs official',
			'Xenophobic natives',
			'Existing merchant who doesn’t like competition',
		],
		friends: [
			'Aspiring tourist',
			'Anthropological researcher',
			'Offworld thief',
			'Religious missionary',
		],
		complications: [
			'The locals carry a disease harmless to them and lethal to outsiders',
			'The locals hide dark purposes from offworlders',
			'The locals have something desperately needed but won’t bring it into the treaty port',
		],
		things: [
			'Contraband trade goods',
			'Security perimeter codes',
			'Black market local products',
		],
		places: [
			'Treaty port bar',
			'Black market zone',
			'Secret smuggler landing site',
		]
	},
	{
		name: 'Misandry/Misogyny',
		description: 'The culture on this world holds a particular gender in contempt. Members of that gender are not permitted positions of formal power, and may be restricted in their movements and activities. Some worlds may go so far as to scorn both traditional genders, using gengineering techniques to hybridize or alter conventional human biology.',
		enemies: [
			'Cultural fundamentalist',
			'Cultural missionary to outworlders',
			'Local rebel driven to pointless and meaningless violence',
		],
		friends: [
			'Oppressed native',
			'Research scientist',
			'Offworld emancipationist',
			'Local reformer',
		],
		complications: [
			'The oppressed gender is restive against the customs',
			'The oppressed gender largely supports the customs',
			'The customs relate to some physical quality of the world',
			'The oppressed gender has had maltech gengineering done to “tame” them.',
		],
		things: [
			'Aerosol reversion formula for undoing gengineered docility',
			'Hidden history of the world',
			'Pretech gengineering equipment',
		],
		places: [
			'Shrine to the virtues of the favored gender',
			'Security center for controlling the oppressed',
			'Gengineering lab',
		]
	},
	{
		name: 'Night World',
		description: 'The world is plunged into eternal darkness. The only life on this planet derives its energy from other sources, such as geothermal heat, extremely volatile chemical reactions in the planet’s soil, or light in a non-visible spectrum. Most flora and fauna is voraciously eager to consume other life.',
		enemies: [
			'Monstrous thing from the night',
			'Offworlder finding the obscurity of the world convenient for dark purposes',
			'Mad scientist experimenting with local life',
		],
		friends: [
			'Curious offworlder researcher',
			'Hard-pressed colony leader',
			'High priest of a sect that finds religious significance in the night',
		],
		complications: [
			'Daylight comes as a cataclysmic event at very long intervals',
			'Light causes very dangerous reactions in native life or chemicals here',
			'The locals have been gengineered to exist without sight',
		],
		things: [
			'Rare chemicals created in the darkness',
			'Light source usable on this world',
			'Smuggler cache hidden here in ages past',
		],
		places: [
			'Formlessly pitch-black wilderness',
			'Sea without a sun',
			'Location defined by sounds or smells',
		]
	},
	{
		name: 'Nomads',
		description: 'Most of the natives of this world are nomadic, usually following a traditional cycle of movement through the lands they possess. Promises of rich plunder or local environmental perils can force these groups to strike out against neighbors. Other groups are forced to move constantly due to unpredictable dangers that crop up on the planet.',
		enemies: [
			'Desperate tribal leader who needs what the PCs have',
			'Ruthless raider chieftain',
			'Leader seeking to weld the nomads into an army',
		],
		friends: [
			'Free-spirited young nomad',
			'Dreamer imagining a stable life',
			'Offworlder enamored of the life',
		],
		complications: [
			'An irresistibly lethal swarm of native life forces locals to move regularly',
			'Ancient defense systems destroy too-long-stationary communities',
			'Local chemical patches require careful balancing of exposure times to avoid side effects',
		],
		things: [
			'Cache of rare and precious resource',
			'Plunder seized by a tribal raid',
			'Tech that makes a place safe for long-term inhabitation',
		],
		places: [
			'Temporary nomad camp',
			'Oasis or resource reserve',
			'Trackless waste that kills the unprepared',
		]
	},
	{
		name: 'Oceanic World',
		description: 'The world is entirely or almost entirely covered with liquid water. Habitations might be floating cities, or might cling precariously to the few rocky atolls jutting up from the waves, or are planted as bubbles on promontories deep beneath the stormy surface. Survival depends on aquaculture. Planets with inedible alien life rely on gengineered Terran sea crops.',
		enemies: [
			'Pirate raider',
			'Violent “salvager” gang',
			'Tentacled sea monster',
		],
		friends: [
			'Daredevil fisherman',
			'Sea hermit',
			'Sapient native life',
		],
		complications: [
			'The liquid flux confuses grav engines too badly for them to function on this world',
			'Sea is corrosive or toxic',
			'The seas are wracked by regular storms',
		],
		things: [
			'Buried pirate treasure',
			'Location of enormous schools of fish',
			'Pretech water purification equipment',
		],
		places: [
			'The only island on the planet',
			'Floating spaceport',
			'Deck of a storm-swept ship',
			'Undersea bubble city',
		]
	},
	{
		name: 'Out of Contact',
		description: 'The natives have been entirely out of contact with the greater galaxy for centuries or longer. Perhaps the original colonists were seeking to hide from the rest of the universe, or the Silence destroyed any means of communication. It may have been so long that human origins on other worlds have regressed into a topic for legends. The players might be on the first offworld ship to land since the First Wave of colonization a thousand years ago.',
		enemies: [
			'Fearful local ruler',
			'Zealous native cleric',
			'Sinister power that has kept the world isolated',
		],
		friends: [
			'Scheming native noble',
			'Heretical theologian',
			'UFO cultist native',
		],
		complications: [
			'Automatic defenses fire on ships that try to take off',
			'The natives want to stay out of contact',
			'The natives are highly vulnerable to offworld diseases',
			'The native language is completely unlike any known to the group',
		],
		things: [
			'Ancient pretech equipment',
			'Terran relic brought from Earth',
			'Logs of the original colonists',
		],
		places: [
			'Long-lost colonial landing site',
			'Court of the local ruler',
			'Ancient defense battery controls',
		]
	},
	{
		name: 'Outpost World',
		description: 'The world is only a tiny outpost of human habitation planted by an offworld corporation or government. Perhaps the staff is there to serve as a refueling and repair stop for passing ships, or to oversee an automated mining and refinery complex. They might be there to study ancient ruins, or simply serve as a listening and monitoring post for traffic through the system. The outpost is likely well-equipped with defenses against casual piracy.',
		enemies: [
			'Space-mad outpost staffer',
			'Outpost commander who wants it to stay undiscovered',
			'Undercover saboteur',
		],
		friends: [
			'Lonely staffer',
			'Fixated researcher',
			'Overtaxed maintenance chief',
		],
		complications: [
			'The alien ruin defense systems are waking up',
			'Atmospheric disturbances trap the group inside the outpost for a month',
			'Pirates raid the outpost',
			'The crew have become converts to a strange set of beliefs',
		],
		things: [
			'Alien relics',
			'Vital scientific data',
			'Secret corporate exploitation plans',
		],
		places: [
			'Grimy recreation room',
			'Refueling station',
			'The only building on the planet',
			'A “starport” of swept bare rock.',
		]
	},
	{
		name: 'Perimeter Agency',
		description: 'Before the Silence, the Perimeter was a Terran-sponsored organization charged with rooting out use of maltech, technology banned in human space as too dangerous for use or experimentation. Unbraked AIs, gengineered slave species, nanotech replicators, weapons of planetary destruction… the Perimeter hunted down experimenters with a great indifference to planetary laws. Most Perimeter Agencies collapsed during the Silence, but a few managed to hold on to their mission, though modern Perimeter agents often find more work as conventional spies.',
		enemies: [
			'Renegade Agency Director',
			'Maltech researcher',
			'Paranoid intelligence chief',
		],
		friends: [
			'Agent in need of help',
			'Support staffer',
			'“Unjustly” targeted researcher',
		],
		complications: [
			'The local Agency has gone rogue and now uses maltech',
			'The Agency archives have been compromised',
			'The Agency has been targeted by a maltech-using organization',
			'The Agency’s existence is unknown to the locals',
		],
		things: [
			'Agency maltech research archives',
			'Agency pretech spec-ops gear',
			'File of blackmail on local politicians',
		],
		places: [
			'Interrogation room',
			'Smoky bar',
			'Maltech laboratory',
			'Secret Agency base',
		]
	},
	{
		name: 'Pilgrimage Site',
		description: 'The world is noted for an important spiritual or historical location, and might be the sector headquarters for a widespread religion or political movement. The site attracts wealthy pilgrims from throughout nearby space, and those with the money necessary to manage interstellar travel can be quite generous to the site and its keepers. The locals tend to be fiercely protective of the place and its reputation, and some places may forbid the entrance of those not suitably pious or devout.',
		enemies: [
			'Saboteur devoted to a rival belief',
			'Bitter reformer who resents the current leadership',
			'Swindler conning the pilgrims',
		],
		friends: [
			'Protector of the holy site',
			'Naive offworlder pilgrim',
			'Outsider wanting to learn the sanctum’s inner secrets',
		],
		complications: [
			'The site is actually a fake',
			'The site is run by corrupt and venal keepers',
			'A natural disaster threatens the site',
		],
		things: [
			'Ancient relic guarded at the site',
			'Proof of the site’s inauthenticity',
			'Precious offering from a pilgrim',
		],
		places: [
			'Incense-scented sanctum',
			'Teeming crowd of pilgrims',
			'Imposing holy structure',
		]
	},
	{
		name: 'Pleasure World',
		description: 'This world provides delights either rare or impermissible elsewhere. Matchless local beauty, stunningly gengineered natives, a wide variety of local drugs, carnal pleasures unacceptable on other worlds, or some other rare delight is readily available here. Most worlds are fully aware of the value of their offerings, and the prices they demand can be in credits or in less tangible recompense.',
		enemies: [
			'Purveyor of evil delights',
			'Local seeking to control others with addictions',
			'Offworlder exploiter of native resources',
		],
		friends: [
			'Tourist who’s in too deep',
			'Native seeking a more meaningful life elsewhere',
			'Offworld entertainer looking for training here',
		],
		complications: [
			'A deeply repugnant pleasure is offered here by a culture that sees nothing wrong with it',
			'Certain pleasures here are dangerously addictive',
			'The prices here can involve enslavement or death',
			'The world has been seized and exploited by an imperial power',
		],
		things: [
			'Forbidden drug',
			'A contract for some unspeakable payment',
			'Powerful tech repurposed for hedonistic ends',
		],
		places: [
			'Breathtaking natural feature',
			'Artful but decadent salon',
			'Grimy den of desperate vice',
		]
	},
	{
		name: 'Police State',
		description: 'The world is a totalitarian police state. Any sign of disloyalty to the planet’s rulers is punished severely, and suspicion riddles society. Some worlds might operate by Soviet-style informers and indoctrination, while more technically sophisticated worlds might rely on omnipresent cameras or braked AI “guardian angels”. Outworlders are apt to be treated as a necessary evil at best, and “disappeared” if they become troublesome.',
		enemies: [
			'Secret police chief',
			'Scapegoating official',
			'Treacherous native informer',
		],
		friends: [
			'Rebel leader',
			'Offworld agitator',
			'Imprisoned victim',
			'Crime boss',
		],
		complications: [
			'The natives largely believe in the righteousness of the state',
			'The police state is automated and its “rulers” can’t shut it off',
			'The leaders foment a pogrom against “offworlder spies”.',
		],
		things: [
			'List of police informers',
			'Wealth taken from “enemies of the state”',
			'Dear Leader’s private stash',
		],
		places: [
			'Military parade',
			'Gulag',
			'Gray concrete housing block',
			'Surveillance center',
		]
	},
	{
		name: 'Post-Scarcity',
		description: 'The locals have maintained sufficient Mandate-era tech to be effectively post-scarcity in their economic structure. Everyone has all the necessities and most of the desires they can imagine. Conflict now exists over the apportionment of services and terrestrial space, since anything else can be had in abundance. Military goods and items of mass destruction may still be restricted, and there is probably some reason that the locals do not export their vast wealth.',
		enemies: [
			'Frenzied ideologue fighting over an idea',
			'Paranoid local fearing offworlder influence',
			'Grim reformer seeking the destruction of the “enfeebling” productive tech',
		],
		friends: [
			'Offworlder seeking something available only here',
			'Local struggling to maintain the production tech',
			'Native missionary seeking to bring abundance to other worlds',
		],
		complications: [
			'The tech causes serious side-effects on those who take advantage of it',
			'The tech is breaking down',
			'The population is growing too large',
			'The tech produces only certain things in abundance',
		],
		things: [
			'A cornucopia device',
			'A rare commodity that cannot be duplicated',
			'Contract for services',
		],
		places: [
			'Tiny but richly-appointed private quarters',
			'Market for services',
			'Hushed non-duped art salon',
		]
	},
	{
		name: 'Preceptor Archive',
		description: 'The Preceptors of the Great Archive were a pre-Silence organization devoted to ensuring the dissemination of human culture, history, and basic technology to frontier worlds that risked losing this information during the human expansion. Most frontier planets had an Archive where natives could learn useful technical skills in addition to human history and art. Those Archives that managed to survive the Silence now strive to send their missionaries of knowledge to new worlds in need of their lore.',
		enemies: [
			'Luddite native',
			'Offworld merchant who wants the natives kept ignorant',
			'Religious zealot',
			'Corrupted First Speaker who wants to keep a monopoly on learning',
		],
		friends: [
			'Preceptor Adept missionary',
			'Offworld scholar',
			'Reluctant student',
			'Roving Preceptor Adept',
		],
		complications: [
			'The local Archive has taken a very religious and mystical attitude toward their teaching',
			'The Archive has maintained some replicable pretech science',
			'The Archive has been corrupted and their teaching is incorrect',
		],
		things: [
			'Lost Archive database',
			'Ancient pretech teaching equipment',
			'Hidden cache of unacceptable tech',
		],
		places: [
			'Archive lecture hall',
			'Experimental laboratory',
			'Student-local riot',
		]
	},
	{
		name: 'Pretech Cultists',
		description: 'The capacities of human science before the Silence vastly outmatch the technology available since the Scream. The Jump Gates alone were capable of crossing hundreds of light years in a moment, and they were just one example of the results won by blending psychic artifice with pretech science. Some worlds outright worship the artifacts of their ancestors, seeing in them the work of more enlightened and perfect humanity. These cultists may or may not understand the operation or replication of these devices, but they seek and guard them jealously.',
		enemies: [
			'Cult leader',
			'Artifact supplier',
			'Pretech smuggler',
		],
		friends: [
			'Offworld scientist',
			'Robbed collector',
			'Cult heretic',
		],
		complications: [
			'The cultists can actually replicate certain forms of pretech',
			'The cultists abhor use of the devices as “presumption on the holy”',
			'The cultists mistake the party’s belongings for pretech',
		],
		things: [
			'Pretech artifacts both functional and broken',
			'Religious-jargon laced pretech replication techniques',
			'Waylaid payment for pretech artifacts',
		],
		places: [
			'Shrine to nonfunctional pretech',
			'Smuggler’s den',
			'Public procession showing a prized artifact',
		]
	},
	{
		name: 'Primitive Aliens',
		description: 'The world is populated by a large number of sapient aliens that have yet to develop advanced technology. The human colonists may have a friendly or hostile relationship with the aliens, but a certain intrinsic tension is likely. Small human colonies might have been enslaved or otherwise subjugated.',
		enemies: [
			'Hostile alien chief',
			'Human firebrand',
			'Dangerous local predator',
			'Alien religious zealot',
		],
		friends: [
			'Colonist leader',
			'Peace-faction alien chief',
			'Planetary frontiersman',
			'Xenoresearcher',
		],
		complications: [
			'The alien numbers are huge and can overwhelm the humans whenever they so choose',
			'One group is trying to use the other to kill their political opponents',
			'The aliens are incomprehensibly strange',
			'One side commits an atrocity',
		],
		things: [
			'Alien religious icon',
			'Ancient alien-human treaty',
			'Alien technology',
		],
		places: [
			'Alien village',
			'Fortified human settlement',
			'Massacre site',
		]
	},
	{
		name: 'Prison Planet',
		description: 'This planet is or was intended as a prison. Some such prisons were meant for specific malefactors of the Terran Mandate, while others were to contain entire “dangerous” ethnic groups or alien races. Some may still have warden AIs or automatic systems to prevent any unauthorized person from leaving, and any authorization permits have long since expired.',
		enemies: [
			'Crazed warden AI',
			'Brutal heir to gang leadership',
			'Offworlder who’s somehow acquired warden powers and exploits the locals',
		],
		friends: [
			'Innocent local born here',
			'Native technician forced to maintain the very tech that imprisons them',
			'Offworlder trapped here by accident',
		],
		complications: [
			'Departure permits are a precious currency',
			'The prison industry still makes valuable pretech devices',
			'Gangs have metamorphosed into governments',
			'The local nobility descended from the prison staff',
		],
		things: [
			'A pass to get offworld',
			'A key to bypass ancient security devices',
			'Contraband forbidden by the security scanners',
		],
		places: [
			'Mandate-era prison block converted to government building',
			'Industrial facility manned by mandatory numbers of prisoners',
			'Makeshift shop where contraband is assembled',
		]
	},
	{
		name: 'Psionics Academy',
		description: 'This world is one of the few that have managed to redevelop the basics of psychic training. Without this education, a potential psychic is doomed to either madness or death unless they refrain from using their abilities. Psionic academies are rare enough that offworlders are often sent there to study by wealthy patrons. The secrets of psychic mentorship, the protocols and techniques that allow a psychic to successfully train another, are carefully guarded at these academies. Most are closely affiliated with the planetary government.',
		enemies: [
			'Corrupt psychic instructor',
			'Renegade student',
			'Mad psychic researcher',
			'Resentful townie',
		],
		friends: [
			'Offworld researcher',
			'Aspiring student',
			'Wealthy tourist',
		],
		complications: [
			'The academy curriculum kills a significant percentage of students',
			'The faculty use students as research subjects',
			'The students are indoctrinated as sleeper agents',
			'The local natives hate the academy',
			'The academy is part of a religion.',
		],
		things: [
			'Secretly developed psitech',
			'A runaway psychic mentor',
			'Psychic research prize',
		],
		places: [
			'Training grounds',
			'Experimental laboratory',
			'School library',
			'Campus hangout',
		]
	},
	{
		name: 'Psionics Fear',
		description: 'The locals are terrified of psychics. Perhaps their history is studded with feral psychics who went on murderous rampages, or perhaps they simply nurse an unreasoning terror of those “mutant freaks”. Psychics demonstrate their powers at risk of their lives.',
		enemies: [
			'Mental purity investigator',
			'Suspicious zealot',
			'Witch-finder',
		],
		friends: [
			'Hidden psychic',
			'Offworlder psychic trapped here',
			'Offworld educator',
		],
		complications: [
			'Psychic potential is much more common here',
			'Some tech is mistaken as psitech',
			'Natives believe certain rituals and customs can protect them from psychic powers',
		],
		things: [
			'Hidden psitech cache',
			'Possessions of convicted psychics',
			'Reward for turning in a psychic',
		],
		places: [
			'Inquisitorial chamber',
			'Lynching site',
			'Museum of psychic atrocities',
		]
	},
	{
		name: 'Psionics Worship',
		description: 'These natives view psionic powers as a visible gift of god or sign of superiority. If the world has a functional psychic training academy, psychics occupy almost all major positions of power and are considered the natural and proper rulers of the world. If the world lacks training facilities, it is likely a hodgepodge of demented cults, with each one dedicated to a marginally- coherent feral prophet and their psychopathic ravings.',
		enemies: [
			'Psychic inquisitor',
			'Haughty mind-noble',
			'Psychic slaver',
			'Feral prophet',
		],
		friends: [
			'Offworlder psychic researcher',
			'Native rebel',
			'Offworld employer seeking psychics',
		],
		complications: [
			'The psychic training is imperfect, and the psychics all show significant mental illness',
			'The psychics have developed a unique discipline',
			'The will of a psychic is law',
			'Psychics in the party are forcibly kidnapped for “enlightening”.',
		],
		things: [
			'Ancient psitech',
			'Valuable psychic research records',
			'Permission for psychic training',
		],
		places: [
			'Psitech-imbued council chamber',
			'Temple to the mind',
			'Sanitarium-prison for feral psychics',
		]
	},
	{
		name: 'Quarantined World',
		description: 'The world is under a quarantine, and space travel to and from it is strictly forbidden. This may be enforced by massive ground batteries that burn any interlopers from the planet’s sky, or it may be that a neighboring world runs a persistent blockade.',
		enemies: [
			'Defense installation commander',
			'Suspicious patrol leader',
			'Crazed asteroid hermit',
		],
		friends: [
			'Relative of a person trapped on the world',
			'Humanitarian relief official',
			'Treasure hunter',
		],
		complications: [
			'The natives want to remain isolated',
			'The quarantine is enforced by an ancient alien installation',
			'The world is rife with maltech abominations',
			'The blockade is meant to starve everyone on the barren world.',
		],
		things: [
			'Defense grid key',
			'Bribe for getting someone out',
			'Abandoned alien tech',
		],
		places: [
			'Bridge of a blockading ship',
			'Defense installation control room',
			'Refugee camp',
		]
	},
	{
		name: 'Radioactive World',
		description: 'Whether due to a legacy of atomic warfare unhindered by nuke snuffers or a simple profusion of radioactive elements, this world glows in the dark. Even heavy vacc suits can filter only so much of the radiation, and most natives suffer a wide variety of cancers, mutations and other illnesses without the protection of advanced medical treatments.',
		enemies: [
			'Bitter mutant',
			'Relic warlord',
			'Desperate wouldbe escapee',
		],
		friends: [
			'Reckless prospector',
			'Offworld scavenger',
			'Biogenetic variety seeker',
		],
		complications: [
			'The radioactivity is steadily growing worse',
			'The planet’s medical resources break down',
			'The radioactivity has inexplicable effects on living creatures',
			'The radioactivity is the product of a malfunctioning pretech manufactory.',
		],
		things: [
			'Ancient atomic weaponry',
			'Pretech anti-radioactivity drugs',
			'Untainted water supply',
		],
		places: [
			'Mutant-infested ruins',
			'Scorched glass plain',
			'Wilderness of bizarre native life',
			'Glowing barrens',
		]
	},
	{
		name: 'Refugees',
		description: 'The world teems with refugees, either exiles from another planet who managed to get here, or the human detritus of some local conflict that have fled to the remaining stable states. The natives usually regard the refugees with hostility, an attitude returned by many among their unwilling guests.',
		enemies: [
			'Xenophobic native leader',
			'Refugee chief aspiring to seize the host nation',
			'Politician seeking to use the refugees as a weapon',
		],
		friends: [
			'Sympathetic refugee waif',
			'Local hard-pressed by refugee gangs',
			'Clergy seeking peace',
		],
		complications: [
			'The xenophobes are right that the refugees are taking over',
			'The refugees are right that the xenophobes want them out or dead',
			'Both are right',
			'Outside powers are using the refugees to destabilize an enemy government',
			'Refugee and local cultures are extremely incompatible',
		],
		things: [
			'Treasures brought out by fleeing refugees',
			'Citizenship papers',
			'Cache of vital refugee supplies',
			'Hidden arms for terrorists',
		],
		places: [
			'Hopeless refugee camp',
			'City swarming with confused strangers',
			'Festival full of angry locals',
		]
	},
	{
		name: 'Regional Hegemon',
		description: 'This world has the technological sophistication, natural resources, and determined polity necessary to be a regional hegemon for the sector. Nearby worlds are likely either directly subservient to it or tack carefully to avoid its anger. It may even be the capital of a small stellar empire.',
		enemies: [
			'Ambitious general',
			'Colonial official',
			'Contemptuous noble',
		],
		friends: [
			'Diplomat',
			'Offworld ambassador',
			'Foreign spy',
		],
		complications: [
			'The hegemon’s influence is all that’s keeping a murderous war from breaking out on nearby worlds',
			'The hegemon is decaying and losing its control',
			'The government is riddled with spies',
			'The hegemon is genuinely benign',
		],
		things: [
			'Diplomatic carte blanche',
			'Deed to an offworld estate',
			'Foreign aid grant',
		],
		places: [
			'Palace or seat of government',
			'Salon teeming with spies',
			'Protest rally',
			'Military base',
		]
	},
	{
		name: 'Restrictive Laws',
		description: 'A myriad of laws, customs, and rules constrain the inhabitants of this world, and even acts that are completely permissible elsewhere are punished severely here. The locals may provide lists of these laws to offworlders, but few non-natives can hope to master all the important intricacies.',
		enemies: [
			'Law enforcement officer',
			'Outraged native',
			'Native lawyer specializing in peeling offworlders',
			'Paid snitch',
		],
		friends: [
			'Frustrated offworlder',
			'Repressed native',
			'Reforming crusader',
		],
		complications: [
			'The laws change regularly in patterns only natives understand',
			'The laws forbid some action vital to the party',
			'The laws forbid the simple existence of some party members',
			'The laws are secret to offworlders',
		],
		things: [
			'Complete legal codex',
			'Writ of diplomatic immunity',
			'Fine collection vault contents',
		],
		places: [
			'Courtroom',
			'Mob scene of outraged locals',
			'Legislative chamber',
			'Police station',
		]
	},
	{
		name: 'Revanchists',
		description: 'The locals formerly owned another world, or a major nation on the planet formerly owned an additional region of land. Something happened to take away this control or drive out the former rulers, and they’ve never forgotten it. The locals are obsessed with reclaiming their lost lands, and will allow no questions of practicality to interfere with their cause.',
		enemies: [
			'Demagogue whipping the locals on to a hopeless war',
			'Politician seeking to use the resentment for their own ends',
			'Local convinced the PCs are agents of the “thieving” power',
			'Refugee from the land bitterly demanding it be reclaimed',
		],
		friends: [
			'Realist local clergy seeking peace',
			'Politician trying to calm the public',
			'Third-party diplomat trying to stamp out the fire',
		],
		complications: [
			'The revanchists’ claim is completely just and reasonable',
			'The land is now occupied entirely by heirs of the conquerors',
			'Both sides have seized lands the other thinks are theirs',
		],
		things: [
			'Stock of vital resource produced by the taken land',
			'Relic carried out of it',
			'Proof that the land claim is justified or unjustified',
		],
		places: [
			'Memorial monument to the loss',
			'Cemetery of those who died in the conquest',
			'Public ceremony commemorating the disaster',
		]
	},
	{
		name: 'Revolutionaries',
		description: 'The world is convulsed by one or more bands of revolutionaries, with some nations perhaps in the grip of a current revolution. Most of these upheavals can be expected only to change the general flavor of problems in the polity, but the process of getting there usually produces a tremendous amount of suffering.',
		enemies: [
			'Blood-drenched revolutionary leader',
			'Blooddrenched secret police chief',
			'Hostile foreign agent seeking further turmoil',
		],
		friends: [
			'Sympathetic victim accused of revolutionary sympathies or government collaboration',
			'Revolutionary or state agent who now repents',
			'Agent of a neutral power that wants peace',
		],
		complications: [
			'The revolutionaries actually do seem likely to put in better rulers',
			'The revolutionaries are client groups that got out of hand',
			'The revolutionaries are clearly much worse than the government',
			'The revolutionaries have no real ideals beyond power and merely pretend to ideology',
		],
		things: [
			'List of secret revolutionary sympathizers',
			'Proof of rebel hypocrisy',
			'Confiscated wealth',
		],
		places: [
			'Festival that explodes into violence',
			'Heavily- fortified police station',
			'Revolutionary base hidden in the wilderness',
		]
	},
	{
		name: 'Rigid Culture',
		description: 'The local culture is extremely rigid. Certain forms of behavior and belief are absolutely mandated, and any deviation from these principles is punished, or else society may be strongly stratified by birth with limited prospects for change. Anything which threatens the existing social order is feared and shunned.',
		enemies: [
			'Rigid reactionary',
			'Wary ruler',
			'Regime ideologue',
			'Offended potentate',
		],
		friends: [
			'Revolutionary agitator',
			'Ambitious peasant',
			'Frustrated merchant',
		],
		complications: [
			'The cultural patterns are enforced by technological aids',
			'The culture is run by a secret cabal of manipulators',
			'The culture has explicit religious sanction',
			'The culture evolved due to important necessities that have since been forgotten',
		],
		things: [
			'Precious traditional regalia',
			'Peasant tribute',
			'Opulent treasures of the ruling class',
		],
		places: [
			'Time-worn palace',
			'Low-caste slums',
			'Bandit den',
			'Reformist temple',
		]
	},
	{
		name: 'Rising Hegemon',
		description: 'This world is not yet a dominant power in the sector, but it’s well on its way there. Whether through newly-blossoming economic, military, or cultural power, they’re extending their influence over their neighbors and forging new arrangements between their government and the rulers of nearby worlds.',
		enemies: [
			'Jingoistic supremacist',
			'Official bent on glorious success',
			'Foreign agent saboteur',
		],
		friends: [
			'Friendly emissary to the benighted',
			'Hardscrabble local turned great success',
			'Foreign visitor seeking contacts or knowledge',
		],
		complications: [
			'They’re only strong because their neighbors have been weakened',
			'Their success is based on a fluke resource or pretech find',
			'They bitterly resent their neighbors as former oppressors',
		],
		things: [
			'Tribute shipment',
			'Factory or barracks emblematic of their power source',
			'Tech or data that will deal a blow to their rise',
		],
		places: [
			'Rustic town being hurled into prosperity',
			'Government building being expanded',
			'Starport struggling under the flow of new ships',
		]
	},
	{
		name: 'Ritual Combat',
		description: 'The locals favor some form of stylized combat to resolve disputes, provide entertainment, or settle religious differences. This combat is probably not normally lethal unless it’s reserved for a specific disposable class of slaves or professionals. Some combat may involve mastery of esoteric weapons and complex arenas, while other forms might require nothing more than a declaration in the street and a drawn gun.',
		enemies: [
			'Bloodthirsty local champion',
			'Ambitious gladiator stable owner',
			'Xenophobic master fighter',
		],
		friends: [
			'Peace-minded foreign missionary',
			'Temperate defender of the weak',
			'Local eager to learn of offworld fighting styles',
		],
		complications: [
			'The required weapons are strange pretech artifacts',
			'Certain classes are forbidden from fighting and require champions',
			'Loss doesn’t mean death but it does mean ritual scarring or property loss',
		],
		things: [
			'Magnificent weapon',
			'Secret book of martial techniques',
			'Token signifying immunity to ritual combat challenges',
			'Prize won in bloody battle',
		],
		places: [
			'Area full of cheering spectators',
			'Dusty street outside a saloon',
			'Memorial for fallen warriors',
		]
	},
	{
		name: 'Robots',
		description: 'The world has a great many robots on it. Most bots are going to be non-sentient expert systems, though an AI with enough computing resources can control many bots at once, and some worlds may have developed VIs to a degree that individual bots can seem (or be) sentient. Some worlds might even be ruled by metal overlords, ones which do not need to be sentient so long as they have overwhelming force.',
		enemies: [
			'Hostile robot master',
			'Robot greedy to seize offworld tech',
			'Robot fallen in love with the PC’s ship',
			'Oligarch whose factories build robots',
		],
		friends: [
			'Data-seeking robot',
			'Plucky young robot tech',
			'Local being pushed out of a job by robots',
		],
		complications: [
			'The robots are only partially controlled',
			'The robots are salvaged and originally meant for a much darker use',
			'The robots require a rare material that the locals fight over',
			'The robots require the planet’s specific infrastructure so cannot be exported',
		],
		things: [
			'Prototype robot',
			'Secret robot override codes',
			'Vast cache of robot-made goods',
			'Robot-destroying pretech weapon',
		],
		places: [
			'Humming robotic factory',
			'Stark robotic “barracks”',
			'House crowded with robot servants and only one human owner',
		]
	},
	{
		name: 'Seagoing Cities',
		description: 'Either the world is entirely water or else the land is simply too dangerous for most humans. Human settlement on this world consists of a number of floating cities that follow the currents and the fish. These city-ships might have been purpose-built for their task, or they could be jury-rigged conglomerations of ships and structures thrown together when the need for seagoing life become apparent to the locals.',
		enemies: [
			'Pirate city lord',
			'Mer-human raider chieftain',
			'Hostile landsman noble',
			'Enemy city saboteur',
		],
		friends: [
			'City navigator',
			'Scout captain',
			'Curious mer-human',
			'Hard-pressed ship-city engineer',
		],
		complications: [
			'The seas are not water',
			'The fish schools have vanished and the city faces starvation',
			'Terrible storms drive the city into the glacial regions',
			'Suicide ships ram the city’s hull',
		],
		things: [
			'Giant pearls with mysterious chemical properties',
			'Buried treasure',
			'Vital repair materials',
		],
		places: [
			'Bridge of the city',
			'Storm-tossed sea',
			'A bridge fashioned of many small boats.',
		]
	},
	{
		name: 'Sealed Menace',
		description: 'Something on this planet has the potential to create enormous havoc for the inhabitants if it is not kept safely contained by its keepers. Whether a massive seismic fault line suppressed by pretech terraforming technology, a disease that has to be quarantined within hours of discovery, or an ancient alien relic that requires regular upkeep in order to prevent planetary catastrophe, the menace is a constant shadow on the fearful populace.',
		enemies: [
			'Hostile outsider bent on freeing the menace',
			'Misguided fool who thinks he can use it',
			'Reckless researcher who thinks he can fix it',
		],
		friends: [
			'Keeper of the menace',
			'Student of its nature',
			'Victim of the menace',
		],
		complications: [
			'The menace would bring great wealth along with destruction',
			'The menace is intelligent',
			'The natives don’t all believe in the menace',
		],
		things: [
			'A key to unlock the menace',
			'A precious byproduct of the menace',
			'The secret of the menace’s true nature',
		],
		places: [
			'Guarded fortress containing the menace',
			'Monitoring station',
			'Scene of a prior outbreak of the menace',
		]
	},
	{
		name: 'Secret Masters',
		description: 'The world is actually run by a hidden cabal, acting through their catspaws in the visible government. For one reason or another, this group finds it imperative that they not be identified by outsiders, and in some cases even the planet’s own government may not realize that they’re actually being manipulated by hidden masters.',
		enemies: [
			'An agent of the cabal',
			'Government official who wants no questions asked',
			'Willfully blinded local',
		],
		friends: [
			'Paranoid conspiracy theorist',
			'Machiavellian gamesman within the cabal',
			'Interstellar investigator',
		],
		complications: [
			'The secret masters have a benign reason for wanting secrecy',
			'The cabal fights openly amongst itself',
			'The cabal is recruiting new members',
		],
		things: [
			'A dossier of secrets on a government official',
			'A briefcase of unmarked credit notes',
			'The identity of a cabal member',
		],
		places: [
			'Smoke-filled room',
			'Shadowy alleyway',
			'Secret underground bunker',
		]
	},
	{
		name: 'Sectarians',
		description: 'The world is torn by violent disagreement between sectarians of a particular faith. Each views the other as a damnable heresy in need of extirpation. Local government may be able to keep open war from breaking out, but the poisonous hatred divides communities. The nature of the faith may be religious, or it may be based on some secular ideology.',
		enemies: [
			'Paranoid believer',
			'Native convinced the party is working for the other side',
			'Absolutist ruler',
		],
		friends: [
			'Reformist clergy',
			'Local peacekeeping official',
			'Offworld missionary',
			'Exhausted ruler',
		],
		complications: [
			'The conflict has more than two sides',
			'The sectarians hate each other for multiple reasons',
			'The sectarians must cooperate or else life on this world is imperiled',
			'The sectarians hate outsiders more than they hate each other',
			'The differences in sects are incomprehensible to an outsider',
		],
		things: [
			'Ancient holy book',
			'Incontrovertible proof',
			'Offering to a local holy man',
		],
		places: [
			'Sectarian battlefield',
			'Crusading temple',
			'Philosopher’s salon',
			'Bitterly divided village',
		]
	},
	{
		name: 'Seismic Instability',
		description: 'The local land masses are remarkably unstable, and regular earthquakes rack the surface. Local construction is either advanced enough to sway and move with the vibrations or primitive enough that it is easily rebuilt. Severe volcanic activity may be part of the instability.',
		enemies: [
			'Earthquake cultist',
			'Hermit seismologist',
			'Burrowing native life form',
			'Earthquake-inducing saboteur',
		],
		friends: [
			'Experimental construction firm owner',
			'Adventurous volcanologist',
			'Geothermal prospector',
		],
		complications: [
			'The earthquakes are caused by malfunctioning pretech terraformers',
			'They’re caused by alien technology',
			'They’re restrained by alien technology that is being plundered by offworlders',
			'The earthquakes are used to generate enormous amounts of energy.',
		],
		things: [
			'Earthquake generator',
			'Earthquake suppressor',
			'Mineral formed at the core of the world',
			'Earthquake- proof building schematics',
		],
		places: [
			'Volcanic caldera',
			'Village during an earthquake',
			'Mud slide',
			'Earthquake opening superheated steam fissures',
		]
	},
	{
		name: 'Shackled World',
		description: 'This world is being systematically contained by an outside power. Some ancient autonomous defense grid, robot law enforcement, alien artifact, or other force is preventing the locals from developing certain technology, or using certain devices, or perhaps from developing interstellar flight. This limit may or may not apply to offworlders; in the former case, the PCs may have to figure out a way to beat the shackles simply to escape the world.',
		enemies: [
			'Passionless jailer-AI',
			'Paranoid military grid AI',
			'Robot overlord',
			'Enigmatic alien master',
		],
		friends: [
			'Struggling local researcher',
			'Offworlder trapped here',
			'Scientist with a plan to break the chains',
		],
		complications: [
			'The shackles come off for certain brief windows of time',
			'The locals think the shackles are imposed by God',
			'An outside power greatly profits from the shackles',
			'The rulers are exempt from the shackles',
		],
		things: [
			'Keycode to bypass the shackle',
			'Tech shielded from the shackle',
			'Exportable version of the shackle that can affect other worlds',
		],
		places: [
			'Grim high-tech control center',
			'Factory full of workaround tech',
			'Temple to the power or entity that imposed the shackle',
		]
	},
	{
		name: 'Societal Despair',
		description: 'The world’s dominant society has lost faith in itself. Whether through some all-consuming war, great catastrophe, overwhelming outside culture, or religious collapse, the natives no longer believe in their old values, and search desperately for something new. Fierce conflict often exists between the last believers in the old dispensation and the nihilistic or searching disciples of the new age.',
		enemies: [
			'Zealot who blames outsiders for the decay',
			'Nihilistic warlord',
			'Offworlder looking to exploit the local despair',
		],
		friends: [
			'Struggling messenger of a new way',
			'Valiant paragon of a fading tradition',
			'Local going through the motions of serving a now-irrelevant role',
		],
		complications: [
			'A massive war discredited all the old values',
			'Outside powers are working to erode societal confidence for their own benefit',
			'A local power is profiting greatly from the despair',
			'The old ways were meant to aid survival on this world and their passing is causing many new woes',
		],
		things: [
			'Relic that would inspire a renaissance',
			'Art that would inspire new ideas',
			'Priceless artifact of a now-scorned belief',
		],
		places: [
			'Empty temple',
			'Crowded den of obliviating vice',
			'Smoky hall full of frantic speakers',
		]
	},
	{
		name: 'Sole Supplier',
		description: 'Some extremely important resource is exported from this world and this world alone. It’s unlikely that the substance is critical for building spike drives unless this world is also the first to begin interstellar flight, but it may be critical to other high-tech processes or devices. The locals make a large amount of money off this trade and control of it is of critical importance to the planet’s rulers, and potentially to outside powers.',
		enemies: [
			'Resource oligarch',
			'Ruthless smuggler',
			'Resource- controlling warlord',
			'Foreign agent seeking to subvert local government',
		],
		friends: [
			'Doughty resource miner',
			'Researcher trying to synthesize the stuff',
			'Small-scale resource producer',
			'Harried starport trade overseer',
		],
		complications: [
			'The substance is slow poison to process',
			'The substance is created by hostile alien natives',
			'The substance is very easy to smuggle in usable amounts',
			'Only the natives have the genes or tech to extract it effectively',
		],
		things: [
			'Cache of processed resource',
			'Trade permit to buy a load of it',
			'A shipment of nigh-undetectably fake substance',
		],
		places: [
			'Bustling resource extraction site',
			'Opulent palace built with resource money',
			'Lazy town square where everyone lives on resource payments',
		]
	},
	{
		name: 'Taboo Treasure',
		description: 'The natives here produce something that is both fabulously valuable and strictly forbidden elsewhere in the sector. It may be a lethally addictive drug, forbidden gengineering tech, vat-grown “perfect slaves”, or a useful substance that can only be made through excruciating human suffering. This treasure is freely traded on the world, but bringing it elsewhere is usually an invitation to a long prison stay or worse.',
		enemies: [
			'Maker of a vile commodity',
			'Smuggler for a powerful offworlder',
			'Depraved offworlder here for “fun”',
			'Local warlord who controls the treasure',
		],
		friends: [
			'Reformer seeking to end its use',
			'Innovator trying to repurpose the treasure in innocent ways',
			'Wretched addict unwillingly prey to the treasure',
		],
		complications: [
			'The treasure is extremely hard to smuggle',
			'Its use visibly marks a user',
			'The natives consider it for their personal use only,',
		],
		things: [
			'Load of the forbidden good',
			'Smuggling tech that could hide the good perfectly',
			'Blackmail data on offworld buyers of the good',
		],
		places: [
			'Den where the good is used',
			'Market selling the good to locals and a few outsiders',
			'Factory or processing area where the good is created',
		]
	},
	{
		name: 'Terraform Failure',
		description: 'This world was marginal for human habitation when it was discovered, but the Mandate or the early government put in pretech terraforming engines to correct its more extreme qualities. The terraforming did not entirely work, either failing of its own or suffering the destruction of the engines during the Silence. The natives are only partly adapted to the world’s current state, and struggle with the environment.',
		enemies: [
			'Brutal ruler who cares only for their people',
			'Offworlder trying to loot the damaged engines',
			'Warlord trying to seize limited habitable land',
		],
		friends: [
			'Local trying to fix the engines',
			'Offworlder student of the engines',
			'World-wise native survivor',
		],
		complications: [
			'The engines produced too much of something instead of too little',
			'The engines were hijacked by aliens with different preferences',
			'It was discovered that an Earth-like environment would eventually cause a catastrophic disaster',
		],
		things: [
			'Parts to repair or restore the engines',
			'Lootable pretech fragments',
			'Valuable local tech devised to cope with the world',
		],
		places: [
			'Zone of tolerable gravity or temperature',
			'Native settlement built to cope with the environment',
			'Massive ruined terraforming engine',
		]
	},
	{
		name: 'Theocracy',
		description: 'The planet is ruled by the priesthood of the predominant religion or ideology. The rest of the locals may or may not be terribly pious, but the clergy have the necessary military strength, popular support or control of resources to maintain their rule. Alternative faiths or incompatible ideologies are likely to be both illegal and socially unacceptable.',
		enemies: [
			'Decadent priest-ruler',
			'Zealous inquisitor',
			'Relentless proselytizer',
			'True Believer',
		],
		friends: [
			'Heretic',
			'Offworld theologian',
			'Atheistic merchant',
			'Desperate commoner',
		],
		complications: [
			'The theocracy actually works well',
			'The theocracy is decadent and hated by the common folk',
			'The theocracy is divided into mutually hostile sects',
			'The theocracy is led by aliens',
		],
		things: [
			'Precious holy text',
			'Martyr’s bones',
			'Secret church records',
			'Ancient church treasures',
		],
		places: [
			'Glorious temple',
			'Austere monastery',
			'Academy for ideological indoctrination',
			'Decadent pleasure- cathedral',
		]
	},
	{
		name: 'Tomb World',
		description: 'Tomb worlds are planets that were once inhabited by humans before the Silence. The sudden collapse of the jump gate network and the inability to bring in the massive food supplies required by the planet resulted in starvation, warfare, and death. Most tomb worlds are naturally hostile to human habitation and could not raise sufficient crops to maintain life. The few hydroponic facilities were usually destroyed in the fighting, and all that is left now are ruins, bones, and silence.',
		enemies: [
			'Demented survivor tribe chieftain',
			'Avaricious scavenger',
			'Automated defense system',
			'Native predator',
		],
		friends: [
			'Scavenger Fleet captain',
			'Archaeologist',
			'Salvaging historian',
			'Xenophilic native survivor',
		],
		complications: [
			'The ruins are full of booby-traps left by the final inhabitants',
			'The world’s atmosphere quickly degrades anything in an opened building',
			'A handful of desperate natives survived the Silence',
			'The structures are unstable and collapsing',
		],
		things: [
			'Lost pretech equipment',
			'Tech caches',
			'Stores of unused munitions',
			'Ancient historical data',
		],
		places: [
			'Crumbling hive-city',
			'City square carpeted in bones',
			'Ruined hydroponic facility',
			'Cannibal tribe’s lair',
			'Dead orbital jump gate',
		]
	},
	{
		name: 'Trade Hub',
		description: 'This world is a major crossroads for local interstellar trade. It is well-positioned at the nexus of several short-drill trade routes, and has facilities for easy transfer of valuable cargoes and the fueling and repairing of starships. The natives are accustomed to outsiders, and a polyglot mass of people from every nearby world can be found trading here.',
		enemies: [
			'Cheating merchant',
			'Thieving dockworker',
			'Commercial spy',
			'Corrupt customs official',
		],
		friends: [
			'Rich tourist',
			'Hardscrabble free trader',
			'Merchant prince in need of catspaws',
			'Friendly spaceport urchin',
		],
		complications: [
			'An outworlder faction schemes to seize the trade hub',
			'Saboteurs seek to blow up a rival’s warehouses',
			'Enemies are blockading the trade routes',
			'Pirates lace the hub with spies',
		],
		things: [
			'Voucher for a warehouse’s contents',
			'Insider trading information',
			'Case of precious offworld pharmaceuticals',
			'Box of legitimate tax stamps indicating customs dues have been paid.',
		],
		places: [
			'Raucous bazaar',
			'Elegant restaurant',
			'Spaceport teeming with activity',
			'Foggy street lined with warehouses',
		]
	},
	{
		name: 'Tyranny',
		description: 'The local government is brutal and indifferent to the will of the people. Laws may or may not exist, but the only one that matters is the whim of the rulers on any given day. Their minions swagger through the streets while the common folk live in terror of their appetites. The only people who stay wealthy are friends and servants of the ruling class.',
		enemies: [
			'Debauched autocrat',
			'Sneering bully-boy',
			'Soulless government official',
			'Occupying army officer',
		],
		friends: [
			'Conspiring rebel',
			'Oppressed merchant',
			'Desperate peasant',
			'Inspiring religious leader',
		],
		complications: [
			'The tyrant rules with vastly superior technology',
			'The tyrant is a figurehead for a cabal of powerful men and women',
			'The people are resigned to their suffering',
			'The tyrant is hostile to “meddlesome outworlders”.',
		],
		things: [
			'Plundered wealth',
			'Beautiful toys of the elite',
			'Regalia of rulership',
		],
		places: [
			'Impoverished village',
			'Protest rally massacre',
			'Decadent palace',
			'Religious hospital for the indigent',
		]
	},
	{
		name: 'Unbraked AI',
		description: 'Artificial intelligences are costly and difficult to create, requiring a careful sequence of “growth stages” in order to bring them to sentience before artificial limits on cognition speed and learning development are installed. These “brakes” prevent runaway cognition metastasis. This world has an “unbraked AI” on it, probably with a witting or unwitting corps of servants. Unbraked AIs are quite insane, but they learn and reason with a speed impossible for humans, and can demonstrate a truly distressing subtlety.',
		enemies: [
			'AI Cultist',
			'Maltech researcher',
			'Government official dependent on the AI',
		],
		friends: [
			'Perimeter agent',
			'AI researcher',
			'Braked AI',
		],
		complications: [
			'The AI’s presence is unknown to the locals',
			'The locals depend on the AI for some vital service',
			'The AI appears to be harmless',
			'The AI has fixated on the group’s ship’s computer',
			'The AI wants transport offworld',
		],
		things: [
			'The room-sized AI core itself',
			'Maltech research files',
			'Perfectly tabulated blackmail on government officials',
			'Pretech computer circuitry',
		],
		places: [
			'Municipal computing banks',
			'Cult compound',
			'Repair center',
			'Ancient hardcopy library',
		]
	},
	{
		name: 'Urbanized Surface',
		description: 'The world’s land area is covered with buildings that extend downward for multiple levels. Such worlds either have a population in the trillions, extremely little land area, or are largely-abandoned due to some past catastrophe. Agriculture and resource extraction are part of the urban complex, and there may be an advanced maintenance system that may not be entirely under the control of present natives.',
		enemies: [
			'Maintenance AI that hates outsiders',
			'Tyrant of a habitation block',
			'Deep-dwelling prophet who considers “the sky” a blasphemy to be quelled',
		],
		friends: [
			'Local yearning for wild spaces',
			'Grubby urchin of the underlevels',
			'Harried engineer trying to maintain ancient works',
			'Grizzled hab cop',
		],
		complications: [
			'The urban blocks are needed to survive the environment',
			'The blocks were part of an ancient device of world-spanning size',
			'The blocks require constant maintenance to avoid dangerous types of decay',
		],
		things: [
			'Massively efficient power source',
			'Map of the secret ways of a zone',
			'Passkey into restricted hab block areas',
		],
		places: [
			'Giant hab block now devoid of inhabitants',
			'Chemical-reeking underway',
			'Seawater mine full of salt and massive flowing channels',
		]
	},
	{
		name: 'Utopia',
		description: 'Natural and social conditions on this world have made it a paradise for its inhabitants, a genuine utopia of happiness and fulfillment. This is normally the result of drastic human engineering, including brain-gelding, neurochemical control, personality curbs, or complete “humanity” redefinitions. Even so, the natives are extremely happy with their lot, and may wish to extend that joy to poor, sad outsiders.',
		enemies: [
			'Compassionate neurotherapist',
			'Proselytizing native missionary to outsiders',
			'Brutal tyrant who rules through inexorable happiness',
		],
		friends: [
			'Deranged malcontent',
			'Bloody-handed guerrilla leader of a rebellion of madmen',
			'Outsider trying to find a way to reverse the utopian changes',
		],
		complications: [
			'The natives really are deeply and contentedly happy with their altered lot',
			'The utopia produces something that attracts others',
			'The utopia works on converting outsiders through persuasion and generosity',
			'The utopia involves some sacrifice that’s horrifying to non-members',
		],
		things: [
			'Portable device that applies the utopian change',
			'Plans for a device that would destroy the utopia',
			'Goods created joyfully by the locals',
		],
		places: [
			'Plaza full of altered humans',
			'Social ritual site',
			'Secret office where “normal” humans rule',
		]
	},
	{
		name: 'Warlords',
		description: 'The world is plagued by warlords. Numerous powerful men and women control private armies sufficiently strong to cow whatever local government may exist. On the lands they claim, their word is law. Most spend their time oppressing their own subjects and murderously pillaging those of their neighbors. Most like to wrap themselves in the mantle of ideology, religious fervor, or an ostensibly legitimate right to rule.',
		enemies: [
			'Warlord',
			'Avaricious lieutenant',
			'Expensive assassin',
			'Aspiring minion',
		],
		friends: [
			'Vengeful commoner',
			'Government military officer',
			'Humanitarian aid official',
			'Village priest',
		],
		complications: [
			'The warlords are willing to cooperate to fight mutual threats',
			'The warlords favor specific religions or races over others',
			'The warlords are using substantially more sophisticated tech than others',
			'Some of the warlords are better rulers than the government',
		],
		things: [
			'Weapons cache',
			'Buried plunder',
			'A warlord’s personal battle harness',
			'Captured merchant shipping',
		],
		places: [
			'Gory battlefield',
			'Burnt-out village',
			'Barbaric warlord palace',
			'Squalid refugee camp',
		]
	},
	{
		name: 'Xenophiles',
		description: 'The natives of this world are fast friends with a particular alien race. The aliens may have saved the planet at some point in the past, or awed the locals with superior tech or impressive cultural qualities. The aliens might even be the ruling class on the planet.',
		enemies: [
			'Offworld xenophobe',
			'Suspicious alien leader',
			'Xenocultural imperialist',
		],
		friends: [
			'Benevolent alien',
			'Native malcontent',
			'Gone-native offworlder',
		],
		complications: [
			'The enthusiasm is due to alien psionics or tech',
			'The enthusiasm is based on a lie',
			'The aliens strongly dislike their “groupies”',
			'The aliens feel obliged to rule humanity for its own good',
			'Humans badly misunderstand the aliens',
		],
		things: [
			'Hybrid alien-human tech',
			'Exotic alien crafts',
			'Sophisticated xenolinguistic and xenocultural research data',
		],
		places: [
			'Alien district',
			'Alien-influenced human home',
			'Cultural festival celebrating alien artist',
		]
	},
	{
		name: 'Xenophobes',
		description: 'The natives are intensely averse to dealings with outworlders. Whether through cultural revulsion, fear of tech contamination, or a genuine immunodeficiency, the locals shun foreigners from offworld and refuse to have anything to do with them beyond the bare necessities of contact. Trade may or may not exist on this world, but if it does, it is almost certainly conducted by a caste of untouchables and outcasts.',
		enemies: [
			'Revulsed local ruler',
			'Native convinced some wrong was done to him',
			'Cynical demagogue',
		],
		friends: [
			'Curious native',
			'Exiled former ruler',
			'Local desperately seeking outworlder help',
		],
		complications: [
			'The natives are symptomless carriers of a contagious and dangerous disease',
			'The natives are exceptionally vulnerable to offworld diseases',
			'The natives require elaborate purification rituals after speaking to an offworlder or touching them',
			'The local ruler has forbidden any mercantile dealings with outworlders',
		],
		things: [
			'Jealously-guarded precious relic',
			'Local product under export ban',
			'Esoteric local technology',
		],
		places: [
			'Sealed treaty port',
			'Public ritual not open to outsiders',
			'Outcaste slum home',
		]
	},
	{
		name: 'Zombies',
		description: 'This menace may not take the form of shambling corpses, but some disease, alien artifact, or crazed local practice produces men and women with habits similar to those of murderous cannibal undead. These outbreaks may be regular elements in local society, either provoked by some malevolent creators or the consequence of some local condition.',
		enemies: [
			'Soulless maltech biotechnology cult',
			'Sinister governmental agent',
			'Crazed zombie cultist',
		],
		friends: [
			'Survivor of an outbreak',
			'Doctor searching for a cure',
			'Rebel against the secret malefactors',
		],
		complications: [
			'The zombies retain human intelligence',
			'The zombies can be cured',
			'The process is voluntary among devotees',
			'The condition is infectious',
		],
		things: [
			'Cure for the condition',
			'Alien artifact that causes it',
			'Details of the cult’s conversion process',
		],
		places: [
			'House with boarded-up windows',
			'Dead city',
			'Fortified bunker that was overrun from within',
		]
	}
];

WorldGenerator.tagDictionary = new Map();
for (var i = 0; i < WorldGenerator.tags.length; i++) {
	WorldGenerator.tagDictionary.set(WorldGenerator.tags[i].name, WorldGenerator.tags[i]);
}

WorldGenerator.planetTemplate = {
	lists:{
		atmosphere:WorldGenerator.atmospheres,
		temperature:WorldGenerator.temperatures,
		biosphere:WorldGenerator.biospheres,
		gravity:WorldGenerator.gravities,
		population:WorldGenerator.populations.map(pop => pop.name),
		techLevel:WorldGenerator.techlevels.map(tl => tl.value),
		tag1:WorldGenerator.tags.map(tag => tag.name),
		tag2:WorldGenerator.tags.map(tag => tag.name)		
	},
	generators:{
		name:() => WorldGenerator.generatePlanetName(),
		atmosphere:() => WorldGenerator.pickRandom2d6(WorldGenerator.atmospheres),
		temperature:() => WorldGenerator.pickRandom2d6(WorldGenerator.temperatures),
		biosphere:() => WorldGenerator.pickRandom2d6(WorldGenerator.biospheres),
		gravity:() => WorldGenerator.pickRandom2d6(WorldGenerator.gravities),
		population:() => WorldGenerator.pickRandom2d6(WorldGenerator.populations).name,
		techLevel:() => WorldGenerator.pickRandom2d6(WorldGenerator.techlevels).value,
		tag1:() => GenUtil.pickRandom(WorldGenerator.tags).name,
		tag2:() => GenUtil.pickRandom(WorldGenerator.tags).name		
	}
}

WorldGenerator.systemTemplate = {
	lists:{},
	generators:{
		name:() => WorldGenerator.generateSystemName()
	}
}