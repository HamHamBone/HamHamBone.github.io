var CorporationGenerator = {};

CorporationGenerator.generate = function() {
	var output = document.getElementById("planet-data");
	
	var unusedMarkets = new Set();
	for (var i = 0; i < this.markets.length; i++) {
		unusedMarkets.add(this.markets[i]);
	}
	
	var corpCount = 30;
	var corps = [];
	
	for (var i = 0; i < corpCount; i++) {
		var interestCount = GenUtil.pickRandom([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3,3,4])
		var interests = [];
		for (var j = 0; j < interestCount; j++) {
			var market = GenUtil.pickRandom(this.markets)
			interests.push(market);
			unusedMarkets.delete(market);
		}
		
		var title;
		var titleRand= Math.random();
		if (titleRand < 0.333) {
			title = GenUtil.pickRandom(interests[0].titles);
			if (Math.random() < 0.15) {
				title += " " + GenUtil.pickRandom(this.titles);
			}
		} else {
			title = GenUtil.pickRandom(this.titles);
		}
		
		var name = ""
		var nameCount = GenUtil.pickRandom([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2]);
		for (var j = 0; j < nameCount; j++) {
			var nameRand = Math.random();
			if (nameRand < 0.05) {
				name += GenUtil.capitalize(GenUtil.pickRandom(this.legends));
			} else if (nameRand < 0.1) {
				name += GenUtil.pickRandom(this.poeticWords);
			} else if (nameRand < 0.15) {
				name += GenUtil.capitalize(BuzzwordGenerator.generate());
			} else if (nameRand < 0.5) {
				name += SWNNameGen.getName();
			} else {
				name += GenUtil.pickRandom(this.names);
			}
			if (j < nameCount-1) {
				name += '-';
			}
		}
	
		var interestsName = "";
		for (var j = 0; j < interests.length; j++) {
			interestsName += (j!=0?", ":"") + interests[j].name;
		}
		
		var corp = {
			name:name + ' ' + title,
			markets:interestsName,
			ownership:GenUtil.pickRandom(this.ownerships),
			strategy:GenUtil.pickRandom(this.growthStrategies)
		}
		
		corps.push(corp);
	}
	
	unusedMarkets.forEach(function(market) {
		GenUtil.pickRandom(corps).markets += ', ' + market.name;
	});
	
	return corps;
	
	function pickRandom2d6(array) {
		var random = Math.floor(6*Math.random()) + Math.floor(6*Math.random());
		return array[random];
	}
}

CorporationGenerator.legends = null;
TextLoad.load('generators/data/legends.txt', function(data) {CorporationGenerator.legends = data; });

CorporationGenerator.names = [
	"Ad Astra",
	"Colonial",
	"Compass",
	"Daybreak",
	"Frontier",
	"Guo Yin",
	"Highbeam",
	"Imani",
	"Magnus",
	"Meteor",
	"Neogen",
	"New Dawn",
	"Omnitech",
	"Outertech",
	"Overwatch",
	"Panstellar",
	"Shogun",
	"Silverlight",
	"Spiker",
	"Stella",
	"Striker",
	"Sunbeam",
	"Terra Prime",
	"Wayfarer",
	"West Wind",
	"Nano",
	"Spectral",
	"Planetary",
	"Universal",
	"General",
	"United",
	"Spinward",
	"Federal",
	"Imperial",
	"Dimensional",
	"Galactic",
	"Viking",
	"Synergy",
	"Nebula",
	"White Dwarf",
	"Orbital",
	"Sunside",
	"Dynamic",
	"Starfire",
	"Captain's Choice",
	"Ultraviolet",
	"Mandate",
	"SubTek",
	"Epic",
	"Garnet",
	"Hornet",
	"Crimson",
	"Cyclotron",
	"Fourth Wave",
	"Factorial",
	"Zero-Point",
	"Catylist",
	"Crysalis",
	"Zeus",
	"Polytron-6",
	"Royal",
	"Meson",
	"Zero-G",
	"Tactical",
	"Splinesoft"
];

CorporationGenerator.poeticWords = [
	"Amorphous",
	"Beguile",
	"Caprice",
	"Cascade",
	"Cashmere",
	"Chrysalis",
	"Cinnamon",
	"Coalesce",
	"Crepuscular",
	"Crystalline",
	"Diaphanous",
	"Dulcet",
	"Ebullient",
	"Effervescent",
	"Elision",
	"Enchanted",
	"Encompass",
	"Enrapture",
	"Ephemeral",
	"Epiphany",
	"Epitome",
	"Ethereal",
	"Etiquette",
	"Evanescent",
	"Evocative",
	"Exuberant",
	"Felicity",
	"Filament",
	"Halcyon",
	"Idyllic",
	"Incorporeal",
	"Incandescent",
	"Ineffable",
	"Inexorable",
	"Insouciance",
	"Iridescent",
	"Languid",
	"Lassitude",
	"Lilt",
	"Lithe",
	"Lullaby",
	"Luminescence",
	"Mellifluous",
	"Mist",
	"Murmur",
	"Myriad",
	"Nebulous",
	"Opulent",
	"Penumbra",
	"Plethora",
	"Quiescent",
	"Quintessential",
	"Radiant",
	"Redolent",
	"Resonant",
	"Resplendent",
	"Rhapsodic",
	"Sapphire",
	"Scintilla",
	"Serendipitous",
	"Serene",
	"Somnolent",
	"Sonorous",
	"Spherical",
	"Sublime",
	"Succulent",
	"Suffuse",
	"Susurration",
	"Symphony",
	"Talisman",
	"Tessellated",
	"Tranquility",
	"Vestige",
	"Zenith"
];

CorporationGenerator.titles = [
	"Alliance",
	"Association",
	"Band",
	"Circle",
	"Clan",
	"Combine",
	"Company",
	"Cooperative",
	"Corporation",
	"Enterprises",
	"Faction",
	"Group",
	"Megacorp",
	"Multistellar",
	"Organization",
	"Outfit",
	"Pact",
	"Partnership",
	"Ring",
	"Society",
	"Sodality",
	"Syndicate",
	"Union",
	"Unity",
	"Zaibatsu",
	"Systems",
	"Network",
	"Services",
	"Trading Company",
	"Acquisitions",
	"Operations",
	"Laboratories",
	"Scientific",
	"Industries",
	"Authority",
	"Incorporated",
	"Limited",
	"Corp.",
	"Holdings",
	"Institute",
	"Foundation",
	"Guild"
];

CorporationGenerator.markets = [
	{name:"Aeronautics", titles:["Aeronautics", "Airflight", "Atmospheric", "Navigation"], names:["wing", "blue", "silver", "wind", "prop", "jet"]},
	{name:"Agriculture", titles:["Agriculture", "Farms", "Terraforming", "Hydroponics"], names:["agri", "food", "fresh", "grain", "green", "sweet", "corn", "scythe", "field"]},
	{name:"Art", titles:["Art", "Fashion", "Auctions", "Restoration"], names:["elite", "cool", ""]},
	{name:"Assasination", titles:["Assasinations", "Security", "Operations"], names:["special", "covert", "shadow", "dark", "ninja"]},
	{name:"Asteroid Mining", titles:["Asteroids", "Zero-G", "Mining"], names:[]},
	{name:"Astrotech", titles:["Astrotech", "Space Systems", "Propulsion", "Driveyards", "Mechanics", "Atomics"], names:[]},
	{name:"Biotech", titles:["Biotech", "Genetics", "Medicine", "Laboratories", "Wetware", "Biologics", "Evolutionary"], names:[]},
	{name:"Bootlegging", titles:["Runners", "Shipping", "Exchange", "Transporation"], names:[]},
	{name:"Computer Hardware", titles:["Computers", "Logic", "Machines", "Business Machines", "Terminals"], names:[]},
	{name:"Construction", titles:["Construction", "Habitations", "Terrascaping", "Stations"], names:[]},
	{name:"Cybernetics", titles:["Cybernetics", "Prosthetics", "Augments", "Atomics"], names:[]},
	{name:"Electronics", titles:["Electric", "Electronics", "Circuits", "Controls"], names:[]},
	{name:"Engineering", titles:["Engineering", "Industrial", "Technical", "Atomics"], names:[]},
	{name:"Energy Weapons", titles:["Energy", "Blasters", "Plasmonics", "Lasars", "Armaments", "Arms", "Weapons"], names:[]},
	{name:"Entertainment", titles:["Entertainment", "Spaceball League", "Studios", "Media"], names:[]},
	{name:"Espionage", titles:["Informants", "Espionage", "Agency", "Bureau"], names:[]},
	{name:"Exploration", titles:["Company", "Exploration", "Surveying", "Trading Company", "Navigation", "Geographic"], names:[]},
	{name:"Fishing", titles:["Fishing", "Fish", "Whaling", "Oceanics"], names:[]},
	{name:"Fuel Refining", titles:["Refining", "Fuel", "Gas"], names:[]},
	{name:"Gambling", titles:["Gambling", "Gaming", "Games", "Casino", "House"], names:[]},
	{name:"Gemstones", titles:["Jewelers", "Jewelry", "Gems", "Appraisal"], names:[]},
	{name:"Grav Vehicles", titles:["Gravitonics", "Gravtech", "Anti-Gravity", "Armored", "Motors"], names:[]},
	{name:"Heavy Weapons", titles:["Weapons", "Heavy Weapons", "Heavy", "Armaments", "Emplacements"], names:[]},
	{name:"Ideology", titles:["Ideology", "Spiritual", "Propaganda", "Memetics", "Psychometrics", "Advertising", "Synergistics", "Management"], names:[]},
	{name:"Illicit Drugs", titles:["Drugs", "Genetics", "Medical", "Pharmaceuticals", "Pain Management", "Dealers", "Stimulants", "Gang", "Psychotropics"], names:[]},
	{name:"Journalism", titles:["News", "News Network", "Investigational", "Insights", "Journal"], names:[]},
	{name:"Law Enforcement", titles:["Enforcement", "Security", "Monitors", "Legal", "Collections", "Policing"], names:[]},
	{name:"Liquor", titles:["Liquor", "Beer", "Distillary", "Wineries", "Alchohol", "Brewing"], names:[]},
	{name:"Livestock", titles:["Terraforming", "Livestock", "Ranch", "Cattle", "Zoology", "Meats"], names:[]},
	{name:"Maltech", titles:["Maltech", "Laboratories", "Nanotech", "Atomics", "Intelligence", "Genetics", "Memetics", "Scientific", "Technology"], names:[]},
	{name:"Mercenary Work", titles:["Mecenaries", "Division", "Squadron", "Firepower", "Wing", "Military", "Killers", "Boys"], names:[]},
	{name:"Metallurgy", titles:["Metals", "Industries", "Alloys", "Ferrous", "Metallurgy", "Chemicals"], names:[]},
	{name:"Pharmaceuticals", titles:["Medical", "Genetics", "Pharmaceuticals", "Pillworks", "Chemicals"], names:[]},
	{name:"Piracy", titles:["Crew", "Racketeering", "Pirates", "Starlines", "Collections", "Fleet", "Wing"], names:[]},
	{name:"Planetary Mining", titles:["Mining", "Coreworks", "Planetary"], names:[]},
	{name:"Plastics", titles:["Plastics", "Materials", "Chemical", "Polymers"], names:[]},
	{name:"Pretech", titles:["Pretech", "Technology", "Metadimensional", "Mandate", "Recovery", "Scientific", "Laboratories"], names:[]},
	{name:"Prisons", titles:["Prisons", "Lockup", "Jails", "Security", "Vaults", "Cryogenics", "Psychology"], names:[]},
	{name:"Programming", titles:["Software", "Infomatics", "Systems", "Intelligence", "Logic", "Interactive", "Digital"], names:[]},
	{name:"Projectile Guns", titles:["projectiles", "Arms", "Armaments", "Mechanical"], names:[]},
	{name:"Prostitution", titles:["Prostitution", "Sexwork", "Escorts"], names:[]},
	{name:"Psionics", titles:["Psionics", "Metadimensional", "Academy", "Mindworks", "University", "Institute"], names:[]},
	{name:"Psitech", titles:["Psitech", "Laboratories", "Mindtech", "Psionics"], names:[]},
	{name:"Robotics", titles:["Robotics", "Mechanical", "Autonomous", "Drones", "Androids"], names:[]},
	{name:"Security", titles:["Security", "Protection", "Gaurdians"], names:[]},
	{name:"Shipyards", titles:["Shipyards", "Spaceyards", "Naval Yards", "Hullsworks", "Space Construction"], names:[]},
	{name:"Snacks", titles:["Snacks", "Soda", "Cola", "Genetics", "Additives", "Flavors", "Chips", "Restraunts"], names:[]},
	{name:"Telecoms", titles:["Telecoms", "Communications", "Couriers", "Network"], names:[]},
	{name:"Transport", titles:["Transportation", "Postal Service", "Parcel Service", "Spacelines", "Network", "Exchange", "Express", "Starlines", "Shipping", "Logistics"], names:["fast", "express", "ship", "quick"]},
	{name:"Xenotech", titles:["Xenotech", "Archeaology", "Excavations", "Technology", "Exchange"], names:[]},
];

CorporationGenerator.ownerships = [
	"family",
	"family",
	"founder(s)",
	"founder(s)",
	"single majority stockholder",
	"single majority stockholder",
	"publicly traded",
	"publicly traded",
	"publicly traded",
	"publicly traded",
	"consortium/cartel",
	"consortium/cartel",
	"state-owned",
	"state-owned",
	"subsidiary",
	"subsidiary",
	"worker-owned",
	"cooperative"
	];

CorporationGenerator.marketFocuses = [
	"General",
	"Niche"
];

CorporationGenerator.growthStrategies = [
	"market discovery",
	"racketeering",
	"marketing",
	"emerging market",
	"cartel formation",
	"undercutting",
	"R&D",
	"quality",
	"market manipulation",
	"rent-seeking",
	"production investment",
	"hostile takeovers",
	"litigation",
	"resource monopolization",
	"shell/front"
];

CorporationGenerator.valuations = [
	"crashing",
	"crashing",
	"shrinking",
	"shrinking",
	"steady",
	"steady",
	"steady",
	"growing",
	"growing",
	"booming",
	"booming"
];