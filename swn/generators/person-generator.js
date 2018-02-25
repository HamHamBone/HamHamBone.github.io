let PersonGenerator = (function() {
	let PersonGenerator = {};
	
	PersonGenerator.generate = function() {
		let people = [];
		let personCount = 50;
		
		for (let i = 0; i < personCount; i++) {
			let person = {};
			
			person.name = SWNNameGen.generateFullName();
			
			people.push(person);
			
			console.log(people);
		}
		
		console.log(people);
		
		return people;
	}
	
	return PersonGenerator;
}) ();