let WorldTerrainGenerator = {};

WorldTerrainGenerator._ROCKY = [
	'Jagged Peaks',
	'Scattered Chasms',
	'Bare Plain',
	'Gaping Caverns',
	'Towering Plateaus',
	'Jumbled Boulders',
	'Rolling Hills',
	'Yawning Canyon',
	'Atmosphere-Escaping Mountain',
	'Frequent Sinkholes'
];

WorldTerrainGenerator._VEGETATION = [
	'Thick Scrubland',
	'Shadowed Forest',
	'Mossy Carpet',
	'Tangling Vines',
	'Flowing Molds',
	'Waving Grassland',
	'Bulbous Fungi',
	'Hardy Cacti',
	'Cloud-Scraping Trees',
	'Rolling Meadows',
	'Idyllic Gardens',
	'Tubular Stalks'
];

WorldTerrainGenerator._FLUID = [
	'Coastal Tide Pools',
	'Scattered Archipelago',
	'Entrapping Mudflats',
	'Reefs and Atolls',
	'Stagnant Swamps',
	'Grand River',
	'Frequent Lakes',
	'Gushing Springs',
	'Extreme Tides',
	'Abyssal Oceanic Trench'
];

WorldTerrainGenerator._DESOLATE = [
	'Shifting Dunes',
	'Cinder and Shard Drifts',
	'Dry Mud Flats',
	'Wind-Worn Bluffs',
	'Sweeping Sandstone',
	'Salty Plain',
	'Sea of Dust',
	'Jagged Spires',
	'Cratered Fields',
	'Massive Impact Crater'
];

WorldTerrainGenerator._CRYSTALLINE = [
	'Forest of Shards',
	'Faceted Mountains',
	'Giant Gem Columns',
	'Mounds of Glassy Stones',
	'Smooth Glazed Plain',
	'Frozen Waveforms',
	'Cubic Boulders',
	'Fractal Branching Tunnels'
];

WorldTerrainGenerator._VOLCANIC = [
	'Smoke Shrouded Plain',
	'Quaking Hills',
	'Steaming Geysers',
	'Volcanic Craters',
	'Boiling Mud Pits',
	'Glowing Lava Flow',
	'Billowing Ash Fields',
	'Sulphurous Vents'
];

WorldTerrainGenerator._ASTRONOMICAL = [
	'Planetary Rings',
	'High Axial Tilt',
	'Zero Axial Tilt',
	'Elliptical Orbit',
	'Tidal Lock',
	'Double Planet',
	'Rapid Rotation',
	'Slow Rotation'
];

WorldTerrainGenerator._TYPES = [
	WorldTerrainGenerator._ROCKY,
	WorldTerrainGenerator._VEGETATION,
	WorldTerrainGenerator._FLUID,
	WorldTerrainGenerator._DESOLATE,
	WorldTerrainGenerator._CRYSTALLINE,
	WorldTerrainGenerator._VOLCANIC
];

WorldTerrainGenerator.generate = function() {
	let terrain1 = null, terrain2 = null;
	
	while (terrain1 == terrain2) {
		terrain1 = GenUtil.pickRandom(GenUtil.pickRandom(this._TYPES));
		terrain2 = GenUtil.pickRandom(GenUtil.pickRandom(this._TYPES));
	}
	
	let result = terrain1 + ' & ' + terrain2
	
	if (Math.random() < 0.15) {
		result += '; ' + GenUtil.pickRandom(this._ASTRONOMICAL);
	}
	
	return result;
}