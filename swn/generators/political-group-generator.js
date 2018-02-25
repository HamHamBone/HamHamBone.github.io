let PoliticalGroupGenerator = (function() {
	let PoliticalGroupGenerator = {};
	
	var data = {};

	data.firstNames = [
		"People's",
		"Freedom",
		"National",
		"Unified",
		"Democratic",
		"Royal",
		"Social",
		"Progressive",
		"Popular",
		"Republican",
		"{colors}",
		"{colors}",
		"{colors}",
		"{colors}",
		"Federal",
		"Liberty",
		"Homeland",
		"Conservative",
		"{directions}",
		"Liberal",
		"Victory",
		"{metals}",
		"{metals}",
		"Anarchic",
		"Worker's",
		"Imperial",
		"Commercial",
		"{ideals}",
		"{ideals}",
		"{ideals}",
		"{ideals}",
		"Radical",
		"Moderate",
		"Centrist",
		"Partisan",
		"Majority",
		"Popular",
		"Minority",
		"Conservation",
		"Technical",
		"Action",
		"Revolutionary",
		"Perpetual",
		"{times}",
		"{times}",
		"Secret",
		"Women's",
		"Men's",
		"Holy"
	];
	
	data.ideals = [
		"Strength",
		"Wealth",
		"Purity",
		"Industry",
		"Honor",
		"Duty",
		"Joy",
		"Health",
		"Logic",
		"Order",
		"Virtue",
		"Justice",
		"Freedom",
		"Liberty",
		"Victory",
		"Unity",
		"Truth",
		"Retribution",
		"Pride",
		"Humanity",
		"Glory",
		"Prosperity",
		"Salvation",
		"Charity"
	];
	
	data.times = [
		"Spring",
		"Spring",
		"Summer",
		"Summer",
		"Autumn",
		"Autumn",
		"Winter",
		"Winter",
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	
	data.metals = [
		"Iron",
		"Iron",
		"Iron",
		"Iron",
		"Iron",
		"Golden",
		"Uranium",
		"Titanium",
		"Copper",
		"Aluminum",
		"Silver",
		"Bronze",
		"Chromatic"
	];
	
	data.colors = [
		"Red",
		"Crimson",
		"Scarlet",
		"Orange",
		"Sienna",
		"Yellow",
		"Saffron",
		"Green",
		"Viridian",
		"Turquois",
		"Teal",
		"Aquamarine",
		"Blue",
		"Azure",
		"Cerulean",
		"Cyan",
		"Violet",
		"Purple",
		"Lavender",
		"White",
		"Pale",
		"Grey",
		"Black",
		"Shadow",
		"Onyx"
	];
	
	data.directions = [
		"Northern",
		"Northeastern",
		"Northwestern",
		"Southern",
		"Southeastern",
		"Southwestern",
		"Eastern",
		"Western",
		"Poleward",
		"Equatorial",
		"Spaceside",
		"Groundside",
		"Spinward",
		"Antispinward",
		"Coreward",
		"Rimward"
	];
	
	data.shapes = [
		"Star",
		"Ring",
		"Circle",
		"Diamond",
		"Triangle",
		"Arrow",
		"Line"
	];
	
	data.bodyparts = [
		"Hand",
		"Voice",
		"Eyes",
		"Arm",
		"Head"
	];
	
	data.animals = [
		"Serpents",
		"Wolves",
		"Lions",
		"Eagles",
		"Doves",
		"Beetles",
		"Bears",
		"Sharks",
		"Deers",
		"Camels",
		"Dragons",
		"Horses"
	];
	
	data.lastNames = [
		"Front",
		"Party",
		"Faction",
		"Group",
		"Element",
		"Consensus",
		"Council",
		"Banner",
		"Union",
		"Combine",
		"Society",
		"Sodality",
		"Brotherhood",
		"Sisterhood",
		"Commune",
		"Pact",
		"Foundation",
		"Fellowship",
		"Guild",
		"Federation",
		"Alliance",
		"{bodyparts}",
		"League",
		"Initiative",
		"Institute",
		"Collective",
		"Coalition",
		"{shapes}",
		"{animals}",
		"House",
		"Guard",
		"Alliance",
		"Bureau",
		"Division",
		"Committee",
		"Company",
		"Order",
		"Knights",
		"Resistance",
		"Club",
		"Army",
		"Revolution",
		"Conspiracy",
		"{weapons}",
		"Gang",
		"Family",
		"Peerage"
	];
	
	data.weapons = [
		'Arrow',
		'Sword',
		'Hammer',
		'Knife',
		'Staff',
		'Shield'
	];
	
	var leaderships = [
		"Social Elite",
		"Outcasts",
		"Bourgeoisie",
		"Proletariat",
		"Urban Dwellers",
		"Rural Dwellers",
		"Pious",
		"Intellectuals",
		"Military"
	];
	
	data.personName = SWNNameGen.getName;

	let namePatterns = [
		"{firstNames} {lastNames}",
		"{firstNames} {lastNames}",
		"{firstNames} {lastNames}",
		"{firstNames} {lastNames}",
		"{firstNames} {lastNames}",
		"{firstNames} {firstNames} {lastNames}",
		"{lastNames} of {ideals}",
		"{firstNames} {lastNames} of {ideals}",
		"{personName} {lastNames}",
		"{personName}'s {lastNames}",
		"{legends} {lastNames}",
		"{placeName} {lastNames}"
	];
	
	TextLoad.load('generators/data/swnPlaceNames.txt', function(loadedData) { data.placeName = loadedData; });
	TextLoad.load('generators/data/legends.txt', function(loadedData) { data.legends = loadedData; });

	PoliticalGroupGenerator.generate = function() {
	
		var count = 20;
		
		let groups = [];
		
		for (var i = 0; i < count; i++) {
			var pattern = "";

			var pattern = GenUtil.pickRandom(namePatterns);
			
			name = GenUtil.generatePattern(pattern, data);
			name = GenUtil.generatePattern(name, data);
			
			name = GenUtil.capitalize(name);
			
			var leadership = GenUtil.pickRandom(leaderships);
			
			groups.push({name:name, leadership:leadership});
		}
		
		return groups;
	}
	
	return PoliticalGroupGenerator;
}) ();