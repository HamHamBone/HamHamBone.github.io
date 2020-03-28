'use strict';

let Data = {};
Data.dungeons = "location-locations.txt";
Data.nouns = "location-nouns.txt";
Data.adjectives = "location-adjectives.txt";
Data.titles = "location-titles.txt";
Data.regions = "location-geography.txt";

let Main = (function() {
	let Main = {};
	
	let WIDTH = 1200;
	let HEIGHT = 800;
	
	let CENTER_X = 0.5;
	let CENTER_Y = 0.5;
	let RADIUS = 1.0
	
	let mapCanvas = document.createElement('canvas');
	mapCanvas.width = WIDTH;
	mapCanvas.height = HEIGHT;
	let mapCtx = mapCanvas.getContext('2d');
	
	let locations = [];
	
	let canvas = document.createElement('canvas');
	canvas.width = 1000;
	canvas.height = 700;
	document.body.appendChild(canvas);
	canvas.addEventListener('mousemove', mouseMove);
	
	let ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	
	let output = document.createElement('p');
	document.body.appendChild(output);
	
	let camera = new Camera(canvas, 0.5, 5, 2, WIDTH/2, HEIGHT/2, 1);
	
	Main.init = function() {
		
		let patterns = [
			"The {titles} {titles}'s {locations}",
			"The {titles} {titles}'s {locations}",
			"The {titles}'s {locations}",
			"The {titles}'s {locations}",
			"The {titles}'s {locations}",
			"The {locations} of {titles}~s",
			"The {locations} of {titles}~s",
			"The {locations} of {titles} {titles}~s",
			"The {adjectives} {locations}",
			"The {adjectives} {locations}",
			"The {adjectives} {locations}",
			"The {adjectives} {locations}",
			"The {adjectives} {locations}",
			"The {adjectives} {locations}",
			"The {locations} of {nouns}",
			"The {locations} of {nouns}",
			"The {locations} of {nouns}",
			"The {locations} of {nouns}",
			"The {locations} of {nouns}",
			"The {nouns} {locations}",
			"The {nouns} {locations}",
			"The {nouns} {locations}",
			"The {adjectives} {locations} of {nouns}",
			"The {adjectives} {locations} of {nouns}",
			"The {adjectives} {locations} of the {titles}",
			"The {adjectives} {locations} of the {titles}",
			"The {locations} of {adjectives} {nouns}",
			"The {locations} of the {adjectives} {titles}",
			"The {locations} of the {titles} {titles}",
		];			
		
		let seed = Math.random().toString();
		let elevationNoise = new OctaveNoise(seed+'elevation', 800, 7);
		
		let locationScale = 150;
		
		for (let x = 0; x < WIDTH; x += locationScale) {
			for (let y = 0; y < HEIGHT; y+= locationScale) {
				let locX = Math.random()*locationScale + x - 0;
				let locY = Math.random()*locationScale + y - 0;
				
				if (getElevation(locX, locY) < 0.5) {
					continue;
				}
				
				if (Math.random() < 0.5) {
					Data.locations = Data.regions;
				} else {
					Data.locations = Data.dungeons;
				}
				
				let name = GenUtil.generatePattern(GenUtil.pickRandom(patterns), Data);
				
				locations.push({x:locX, y:locY, name:name});
			}
		}
		
		console.log(locations);
		
		for (let x = 0; x < WIDTH; x++) {
			for (let y = 0; y < HEIGHT; y++) {
				let elevation = getElevation(x, y);
				
				let color = 'white';
				if (elevation < 0.5) {
					color = '#C4D5FE'
					//color = Main.toColor(0.25 + 0.75 * Math.pow(1 - elevation * 2, 0.1)); 
				} else {
					color = 'white';
				}

				mapCtx.fillStyle = color;
				
				mapCtx.fillRect(x, y, 1, 1);
			}
		}
		
		console.log('ok, done');
		draw();
		
		function getElevation(x, y) {
			let dx = 2 * ((x/WIDTH) - CENTER_X) / RADIUS;
			let dy = 2 * ((y/HEIGHT) - CENTER_Y) / RADIUS;
			
			let d = Math.sqrt(dx*dx + dy*dy);
			
			//let side = Math.max(0, x/WIDTH - 0.5);
			
			d /= 1.0;
			
			if (d > 1) { return 0.0001; }
			
			let multiplier = 0.5 + Math.pow(1 - d, 0.5) * 1.0;
			
			//multiplier += side*2;
			
			let elevation = elevationNoise.sample(x, y);
			
			elevation *= multiplier;
			
			return elevation;
		}
	}
	
	function mouseMove(event) {
		let x = event.pageX - this.offsetLeft; 
    let y = event.pageY - this.offsetTop; 	
		
		output.innerText = 'x: ' + x + ', y:' + y;
	}
	
	Main.toColor = function(r, g=null, b=null) {
		if (g === null) { g = r; }
		if (b === null) { b = r; }
		
		r = r % 1 + (r < 0 ? 1 : 0);
		g = g % 1 + (g < 0 ? 1 : 0);
		b = b % 1 + (b < 0 ? 1 : 0);
		
		r = Math.floor(r * 256);
		g = Math.floor(g * 256);
		b = Math.floor(b * 256);
		
		r = r.toString(16).padStart(2, '0');
		g = g.toString(16).padStart(2, '0');
		b = b.toString(16).padStart(2, '0');
		
		return '#' + r + g + b;
	}
	

	
	function draw() {
		camera.step();
		
		ctx.fillStyle = 'white';
		ctx.fillRect(0,0,WIDTH,HEIGHT);
		
		ctx.save();
			camera.transformContext(ctx);
			
			ctx.drawImage(mapCanvas, 0, 0);
			
		ctx.restore();
		
		ctx.font = '12px "Gentium Basic"';
			
		for (let i = 0; i < locations.length; i++) {
			let pos = camera.viewToScreen(locations[i].x, locations[i].y);
			
			ctx.fillStyle = 'black';
			ctx.fillRect(pos.x-2, pos.y-2, 4, 4);
			
			ctx.fillText(locations[i].name, pos.x, pos.y);
		}
		
		window.requestAnimationFrame(draw);
	}
	
	return Main;
}) ();

//GenUtil.loadTextFiles(Data, onLoad);

	TextLoad.massLoad(Data);	
	TextLoad.onAllLoad(onLoad);

function onLoad() {
	//Data = loadedData;
	
	//console.log(Data);
	
	Data.dungeonsAndRegions = Data.regions.concat(Data.dungeons);
	
	Data.locations = Data.dungeons;
	
	Main.init();
};