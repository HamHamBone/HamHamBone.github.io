let RegionGenerator = (function() {
	let RegionGenerator = {};
	
	let data = {};
	data.dungeons = "location-locations.txt";
	data.nouns = "location-nouns.txt";
	data.adjectives = "location-adjectives.txt";
	data.titles = "location-titles.txt";
	data.regions = "location-geography.txt";
	data.civQualities = 'region-civqualities.txt';
	
	TextLoad.massLoad(data);	
	TextLoad.onAllLoad(onLoad);
	
	function onLoad() {
		data.towns = [
			'Village',
			'Village',
			'Town',
			'Town',
			'City',
			'City',
			'Keep'
		];
		data.locationPatterns = [
			"The {nouns} {locations}",
			"The {nouns} {nouns} {locations}",
			"The {nouns} {nouns} {locations}",
			"The {nouns} {nouns} {locations}",
			"The {nouns} {nouns} {locations}",
			"The {adjectives} {nouns} {locations}",
			"The {adjectives} {nouns} {locations}",
			"The {adjectives} {nouns} {locations}",
			"The {adjectives} {nouns} {locations}",
			"The {nouns} {titles}'s {locations}",
			"The {locations} of the {adjectives} {nouns}",
			"The {locations} of {nouns}~s and {nouns}~s",
			"The {adjectives} {locations}",
			"The {locations} of {nouns}~s",
			"The {adjectives} {locations} of the {nouns} {titles}",
			"The {adjectives} {locations} of {nouns}~s",
			"The {adjectives} {locations} of the {nouns}",
			"The {locations} of {adjectives} {nouns}~s",
		];
		data.monsterRelations = [
			'Their largest problem is the {monster}',
			'Their largest problem is the {monster}',
			'They often have problems with the {monster}',
			'They often have problems with the {monster}',
			'They are menaced by {monster}',
			'They are menaced by {monster}',
			'They avoid the {monster}',
			'They avoid the {monster}',
			'They are at war with the {monster}',
			'They fear the {monster}',
			'They have a rivalry with the {monster}',
			'Unbenownst to them, a plot is brewing by the {monster}',
			'The {monster} have not been seen for generations',
			'Legends are told about the {monster}'
		];
		data.civRelations = [
			'They have good relations with the {civilization}',
			'They have good relations with the {civilization}',
			'They have good relations with the {civilization}',
			'They have neutral relations with the {civilization}',
			'They have an alliance with the {civilization}',
			'They are ruled by the {civilization}',
			'They have a friendly rivalry with the {civilization}',
			'They know little of the {civilization}',
			'They lord over the {civilization}'
		];
		data.beastMonsters = [
			'Hell Hound',
			'Hippogriff',
			'Griffons',
			'Wyverns',
			'Pegasus',
			'Stirges',
			'Hydra',
			'Wolves',
			'Giant Eagles',
			'Displacer Beasts',
			'Dinosaurs',
			'Giant Turtle',
			'Giant Ape',
			'Chimera',
			'Bulette',
			'Purple Worm',
			'Slimes',
			'Manticore',
			'Unicorn',
			'Yeti',
			'Axe-Beaks',
			'Bears',
			'Vampire Bats',
			'Boars',
			'Giant Boar',
			'Death Dog',
			'Crocodiles',
			'Flying Snakes',
			'Fire Beetles',
			'Giant Spiders',
			'Giant Rats',
			'Mammoth',
			'Flameskull',
			'Troglodyte'
		];
		data.intelligentSoloMonsters = [
			'{werebeasts}',
			'{dragons}',
			'Centaur',
			'Bugbear',
			'Vampire',
			'Lich',
			'Djinni',
			'Oni',
			'Golem',
			'Ogre',
			'Troll',
			'Hag',
			'Sphinx',
			'Lamia',
			'{giants}',
			'Devil',
			'Ghost',
			'Elemental',
			'Death Knight',
			'Beholder',
			'Basilisk',
			'Naga',
			'Mummy',
			'Minotaur',
			'Medusa',
			'Ogre',
			'Troll',
		];
		data.monsterTribes = [
			'Orc',
			'Lizardman',
			'Harpy',
			'Goblin',
			'Hobgoblin',
			'Skeleton',
			'Zombie',
			'Kobold',
			'Birdman',
			'Frogman',
			'Ent',
			'Satyr',
			'Merfolk',
			'Ettercap',
			'Demon',
			'Fairy'
		];
		
		data.giants = [
			'Hill Giant',
			'Hill Giant',
			'Hill Giant',
			'Ettin',
			'Cyclops',
			'Cyclops',
			'Stone Giant',
			'Stone Giant',
			'Frost Giant',
			'Fire Giant',
			'Cloud Giant',
			'Storm Giant'
		];
		
		data.werebeasts = [
			'Werewolf',
			'Werewolf',
			'Werewolf',
			'Werewolf',
			'Werewolf',
			'Wererat',
			'Wereboar',
			'Weretiger',
			'Werebear'
		];
		
		data.dragons = [
			'Dracolich',
			'Faerie Dragon',
			'Dragon Turtle',
			'Shadow Dragon',
			'Black Dragon',
			'Blue Dragon',
			'Green Dragon',
			'Red Dragon',
			'White Dragon',
			'Brass Dragon',
			'Bronze Dragon',
			'Copper Dragon',
			'Gold Dragon',
			'Silver Dragon',
			
		];
		
		data.amounts = [
			'Moderately',
			'Rarely',
			'Somewhat',
			'Unpredictably',
			'Questionably',
			'Comically',
			'Very',
			'Weirdly',
			'Extremely',
			'Solidly',
			'Excessively'
		];
		data.moods = [
			'Absent-minded',
			'Adventurous',
			'Apathetic',
			'Amiable',
			'Dramatic',
			'Inspiring',
			'Childlike',
			'Maternal/Paternal',
			'Cowardly',
			'Cool-headed',
			'Paranoid',
			'Egotistical',
			'Energetic',
			'Gloomy',
			'Hypercritical',
			'Snobby',
			'Illogical',
			'Jovial',
			'Tranquil',
			'Stoic'
		];
		data.civPatterns = [
			'{adjectives}',
			'{amounts} {civQualities}',
			'{civQualities}',
			'{civQualities} and {civQualities}'
		];
		data.commonRaces = [
			'Human',
			'Elf',
			'Dwarf',
			'Halfling',
			'Gnome',
			'Dragonborn',
			'Orc',
			'{monsterTribes}',
			'{monsterTribes}',
			'{intelligentSoloMonsters}'
		];
		data.typicalRaces = [
			'Human',
			'Human',
			'Human',
			'Human',
			'Human',
			'Human',
			'Human',
			'Human',
			'Human',
			'Human',
			'Human',
			'Human',
			'Human',
			'Human',
			'Human',
			'Elf',
			'Elf',
			'Elf',
			'Dwarf',
			'Dwarf',
			'Dwarf',
			'Halfling',
			'Halfling',
			'Gnome',
			'Dragonborn',
			'Half-Elf',
			'Half-Orc',
			'Orc',
			'{monsterTribes}',
			'{monsterTribes}',
			'{intelligentSoloMonsters}'
		];
		data.classes = [
			'Barbarian',
			'Bard',
			'Cleric',
			'Druid',
			'Fighter',
			'Monk',
			'Paladin',
			'Ranger',
			'Rogue',
			'Sorcerer',
			'Wizard'
		];
		data.dungeonPatterns = [
			'The {dungeon} may be found',
			'They fear the {dungeon}, found',
			'They use {dungeon}'
		];
		
		console.log(data);
	}
	
	function generatePerson(supressRace=false) {
		let str = '';
		
		str += GenUtil.generatePattern(GenUtil.pickRandom(['{moods}','{adjectives}']), data);
		str += ' ';
		
		if (!supressRace) {
			str += GenUtil.pickRandom(data.typicalRaces) + ' ';
		}
		
		if (Math.random() < 0.5) {
			str += GenUtil.pickRandom(data.classes);
		} else {
			str += GenUtil.pickRandom(data.titles);
		}
		
		return str;
	}
	
	RegionGenerator.generate = function() {
		let nsew = new GenUtil.Shuffler(['North', 'South', 'East', 'West']);
		
		let str = '';
		
		let dungeonIndex = Math.floor(Math.random()*5);
		
		data.locations = data.towns;
		
		str += GenUtil.generatePattern(GenUtil.pickRandom(data.locationPatterns), data);
		
		data.locations = data.regions;

		str += ' can be found in the ';
		str += GenUtil.generatePattern(GenUtil.pickRandom(data.locationPatterns), data);
		str += '. ';
		
		str += 'Its people are ';
		str += GenUtil.generatePattern(GenUtil.pickRandom(data.civPatterns), data);
		str += ', and their leader is a ';
		str += generatePerson() + '.';
		
		if (dungeonIndex == 0) {
			data.locations = data.dungeons;
			str += ' ' + GenUtil.generatePattern(GenUtil.pickRandom(data.locationPatterns), data);
			str += ' can be found here.'
			data.locations = data.regions;
		}
		
		str += '<br>';
		str += '<br>';
		
		str += 'To the ' + nsew.next() + ' is ';
		str += GenUtil.generatePattern(GenUtil.pickRandom(data.locationPatterns), data);
		str += '.';
		
		if (dungeonIndex == 1) {
			data.locations = data.dungeons;
			str += ' ' + GenUtil.generatePattern(GenUtil.pickRandom(data.locationPatterns), data);
			str += ' can be found here.'
			data.locations = data.regions;
		}
		
		str += '<br>';
		str += '<br>';
		
		str += 'To the ' + nsew.next() + ' is ';
		str += GenUtil.generatePattern(GenUtil.pickRandom(data.locationPatterns), data);
		str += '.';
		
		if (dungeonIndex == 2) {
			data.locations = data.dungeons;
			str += ' ' + GenUtil.generatePattern(GenUtil.pickRandom(data.locationPatterns), data);
			str += ' can be found here.'
			data.locations = data.regions;
		}
		
		str += '<br>';
		str += '<br>';
		
		let monsterIndex = Math.random();
		
		let monster = GenUtil.pickRandom(data.civQualities) + ' ';
		
		if (monsterIndex < 0.4) {
			monster += GenUtil.pluralize(GenUtil.pickRandom(data.monsterTribes));
		} else if (monsterIndex < 0.8) {
			monster += GenUtil.pickRandom(data.beastMonsters);
		} else {
			monster += GenUtil.pickRandom(data.intelligentSoloMonsters);
		}
		
		monster += ' of ';
		
		monster += GenUtil.generatePattern(GenUtil.pickRandom(data.locationPatterns), data);
		monster += ' to the ' + nsew.next();
		
		monster = GenUtil.generatePattern(monster, data);
		
		data.monster = [monster];
		
		str += GenUtil.generatePattern(GenUtil.pickRandom(data.monsterRelations), data);
		str += '.';
		if (Math.random() < 0.5) {
			str += ' They are working with (or being led by) a ' + generatePerson();
			str += '.';
		}
		
		if (dungeonIndex == 3) {
			data.locations = data.dungeons;
			str += ' They ' + GenUtil.pickRandom(['inhabit', 'avoid', 'have recently arrived at', 'live near']) + ' ' + GenUtil.generatePattern(GenUtil.pickRandom(data.locationPatterns), data);
			str += '.'
			data.locations = data.regions;
		}
		
		str += '<br>';
		str += '<br>';

		let civilization = GenUtil.generatePattern('{civQualities} ' + (Math.random() < 0.75 ? '{commonRaces}~s' : '{monsterTribes}'), data);
		
		data.civilization = [civilization];
		
		str += GenUtil.generatePattern(GenUtil.pickRandom(data.civRelations), data);
		str += ' of ' + GenUtil.generatePattern(GenUtil.pickRandom(data.locationPatterns), data) + ' to the ' + nsew.next() + ',';
		str += ' who are led by a ' + generatePerson(true) + '.';
		
		if (dungeonIndex == 4) {
			data.locations = data.dungeons;
			str += ' They ' + GenUtil.pickRandom(['inhabit', 'avoid', 'have recently arrived at', 'live near']) + ' ' + GenUtil.generatePattern(GenUtil.pickRandom(data.locationPatterns), data);
			str += '.'
			data.locations = data.regions;
		}
		
		str = GenUtil.generatePattern(str, data);
		
		return str;
	}
	
	return RegionGenerator;
}) ();