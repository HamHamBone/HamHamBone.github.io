let SWNNameGen = (function() {
	let SWNNameGen = {};
	
	let data = {
		arabic:'arabic',
		chinese:'chinese',
		english:'english',
		indian:'indian',
		japanese:'japanese',
		nigerian:'nigerian',
		russian:'russian',
		spanish:'spanish',
		unitedStates:'united-states'
	};
	
	let cultures = [];
	
	for (property in data) {
		let name = data[property];
		data[property] = {};
		(function(property) {
			TextLoad.load('generators/data/cultures/'+name+'.txt', function(returnData) {
				data[property].lastNames = returnData;
			});
			TextLoad.load('generators/data/first-names/'+name+'.txt', function(returnData) {
				data[property].firstNames = returnData;
			});
		}) (property);
	}
	
	TextLoad.onAllLoad(function() {
		for (property in data) {
			cultures.push(data[property]);
		}
	});

	SWNNameGen.getName = function() {
		let culture = GenUtil.pickRandom(cultures);
		return GenUtil.pickRandom(culture.lastNames);
	}
	
	SWNNameGen.generateFullName = function() {
		let culture1 = GenUtil.pickRandom(cultures);
		let culture2 = Math.random() < 0.1 ? GenUtil.pickRandom(cultures) : culture1;
		
		return GenUtil.pickRandom(culture1.firstNames) + ' ' + GenUtil.pickRandom(culture2.lastNames);
	}
	
	return SWNNameGen;
}) ();