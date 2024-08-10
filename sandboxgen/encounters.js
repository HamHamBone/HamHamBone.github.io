'use strict';

let Encounters = (function() {
	let Encounters = {};
	
	Encounters.MAJOR_TOWN = {img:'imgTileMajorTown'};
	Encounters.MAJOR_FORTRESS = {img:'imgTileMajorFortress'};
	Encounters.MAJOR_TEMPLE = {img:'imgTileMajorTemple'};
	Encounters.MAJOR_RUIN = {img:'imgTileMajorRuin'};
	Encounters.MAJOR_WILDERNESS = {img:'imgTileMajorWilderness'};
	
	Encounters.majorDistribution = [
		Encounters.MAJOR_TOWN, Encounters.MAJOR_TOWN, Encounters.MAJOR_TOWN,
		Encounters.MAJOR_FORTRESS, Encounters.MAJOR_FORTRESS,
		Encounters.MAJOR_TEMPLE,
		Encounters.MAJOR_RUIN, Encounters.MAJOR_RUIN, Encounters.MAJOR_RUIN,
		Encounters.MAJOR_WILDERNESS, Encounters.MAJOR_WILDERNESS, Encounters.MAJOR_WILDERNESS
	];
	
	return Encounters;
}) ();