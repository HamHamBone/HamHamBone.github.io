'use strict';

function check(str) {
	str = str.toUpperCase(str);
	
	for (let word of words) {
		word = word.toUpperCase();
		if (str.includes(word)) {
			return false;
		}
	}
	return true;
}

let words = [
	'I hate',
	'Union',
	'Fire',
	'fired',
	'Terminated',
	'Compensation',
	'Pay Raise',
	'Bullying',
	'Harassment',
	'I don’t care',
	'Rude',
	'This is concerning',
	'Stupid',
	'This is dumb',
	'Prison',
	'Threat',
	'Petition',
	'Grievance',
	'Injustice',
	'Diversity',
	'Ethics',
	'Fairness',
	'Accessibility',
	'Vaccine',
	'Living Wage',
	'Representation',
	'Unfair',
	'Favoritism',
	'Rate',
	'Unite',
	'Unity',
	'Plantation',
	'Slave',
	'Slave labor',
	'Master',
	'Concerned',
	'Freedom',
	'Restrooms',
	'Robots',
	'Trash',
	'Committee',
	'Coalition'	
]