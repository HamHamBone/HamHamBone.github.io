'use strict';

let Terrain = (function() {
	let Terrain = {};
	
	Terrain.NONE = {img:["imgTileNone"], name:"No Terrain", habitabilty:-10};
	
	Terrain.WATER = {img:["imgTileSea"], name:"Sea", habitabilty:-10};
	
	Terrain.GRASSLAND = {img:["imgTileGrassland", "imgTileNone"], name:"Grassland", habitabilty:4};
	Terrain.FOREST = {img:["imgTileForest"], name:"Forest", habitabilty:2};
	Terrain.HILLS = {img:["imgTileHills"], name:"Hills", habitabilty:4};
	Terrain.MOUNTAINS = {img:["imgTileMountains"], name:"Mountains", habitabilty:3};
	Terrain.SWAMP = {img:["imgTileSwamp"], name:"Swamp", habitabilty:1};
	Terrain.DESERT = {img:["imgTileDesert"], name:"Desert", habitabilty:2};
	
	Terrain.ALL_TERRAINS = [
		Terrain.WATER,
		Terrain.GRASSLAND,
		Terrain.FOREST,
		Terrain.SWAMP,
		Terrain.HILLS,
		Terrain.MOUNTAINS,
		Terrain.DESERT
	];
	
	Terrain.MAJOR_TERRAINS = [
		Terrain.FOREST,
		Terrain.SWAMP,
		Terrain.HILLS,
		Terrain.MOUNTAINS,
		Terrain.DESERT
	];
	
	Terrain.EASY_TERRAINS = [
		Terrain.GRASSLAND
	];
	
	return Terrain;
}) ();