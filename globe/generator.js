let Generator = (function() {
	const SEA_LEVEL = 0.56;
	
	let pallet = new ImagePallet('pallet.png');
	
	function Generator(size) {
		this.size = size;
		
		this.level = 64;
		this.x = 0;
		this.y = 0;
		
		let seed = Math.random().toString();
		
		this.wiggleXNoise = new OctaveNoise(seed+'noise', 0.05, 2);
		this.wiggleYNoise = new OctaveNoise(seed+'noise', 0.05, 2);
		this.wiggleZNoise = new OctaveNoise(seed+'noise', 0.05, 2);
		
		this.noise = new OctaveNoise(seed+'noise', 0.5, 1);
		this.octave = new OctaveNoise(seed+'octave', 1.3, 6);
		this.octave2 = new OctaveNoise(seed+'octave2', 0.5, 5);
		
		this.rainfallNoise = new OctaveNoise(seed+'rainfall',0.8, 4);
		this.temperatureNoise = new OctaveNoise(seed+'temperature',0.8, 3);
		
		this.miniMountainNoise = new OctaveNoise(seed+'miniMountain',0.25, 2);
		this.mountainNoise = new OctaveNoise(seed+'mountain',1.0, 4);
		this.mountainHeightNoise = new OctaveNoise(seed+'mountainHeight',0.2, 3);
		this.mountainPeakNoise = new OctaveNoise(seed+'mountainPeak',0.03, 2);
		
		let canvas = document.createElement('canvas');
		canvas.width = size*2;
		canvas.height = size*1;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		
		let specularCanvas = document.createElement('canvas');
		specularCanvas.width = size*2;
		specularCanvas.height = size*1;
		this.specularCanvas =	specularCanvas;
		this.specularCtx = specularCanvas.getContext('2d');
		
		let bumpCanvas = document.createElement('canvas');
		bumpCanvas.width = size*2;
		bumpCanvas.height = size*1;
		this.bumpCanvas = bumpCanvas;
		this.bumpCtx = bumpCanvas.getContext('2d');
	}
	
	Generator.prototype.getMapImage = function() {
		return this.canvas;
	}
	
	Generator.prototype.getSpecularImage = function() {
		return this.specularCanvas;
	}
	
	Generator.prototype.getBumpImage = function() {
		return this.bumpCanvas;
	}
	
	Generator.prototype.draw = function(count) {
		if (this.level < 1) {
			return;
		}
		
		while (this.level >= 1 && count > 0) {
			let mx = this.x / (this.size*2);
			let my = this.y / (this.size*1);
			
			let rz = -Math.cos(my*Math.PI);
			let ry = Math.sin(my*Math.PI) * Math.sin(mx*Math.PI*2);
			let rx = Math.sin(my*Math.PI) * Math.cos(mx*Math.PI*2);
			
			let sample = this.sample(rx, ry, rz, this.y/this.size, this.x/this.size);
			
			this.ctx.fillStyle = toColor(sample.r, sample.g, sample.b);
			this.ctx.fillRect(this.x, this.y, this.level, this.level);
			
			this.specularCtx.fillStyle = toColor(sample.specular, sample.specular, sample.specular);
			this.specularCtx.fillRect(this.x, this.y, this.level, this.level);
			
			this.bumpCtx.fillStyle = toColor(sample.bump, sample.bump, sample.bump);
			this.bumpCtx.fillRect(this.x, this.y, this.level, this.level);
			
			this.x += this.level;
			if (this.x > this.size*2) {
				this.x = 0;
				this.y += this.level;
				if (this.y > this.size) {
					this.y = 0;
					this.level /= 2;
				}
			}
			
			count--
		}
	}
	
	Generator.prototype.isDone = function() {
		return this.level < 1;
	}
	
	Generator.prototype.sample = function(x, y, z, latitude, longitude) {
		latitude = 1.0 - (Math.acos(z) / Math.PI);
		
		let wiggleX = this.wiggleXNoise.sample(x,y,z);
		let wiggleY = this.wiggleYNoise.sample(x,y,z);
		let wiggleZ = this.wiggleZNoise.sample(x,y,z);
		
		x += 0.05*(wiggleX-0.5);
		y += 0.05*(wiggleY-0.5);
		z += 0.05*(wiggleZ-0.5);
		
		let shift = this.noise.sample(x, y, z);
		let continent = this.octave.sample(x, y, z);
		let island = this.octave2.sample(x, y, z);
		
		let rain = this.rainfallNoise.sample(x, y, z);
		let temp = this.temperatureNoise.sample(x, y, z);
		
		island = Math.abs(island*2 - 1);
		island = 0.4 + 0.6*island;
		
		shift = 0.5 - 0.5 * Math.cos(Math.PI * shift);
		shift = 0.5 + 0.5*shift;
		
		let val = continent*shift + island*(1-shift);
		
		let mountainMult = 0;
		if (val > SEA_LEVEL) {
			let oversea = (val - SEA_LEVEL) / (1 - SEA_LEVEL);
			mountainMult = Math.pow(oversea, (1/3));
		} else {
			mountainMult = 0;
		}
		
		mountainMult = 0.025+0.975*mountainMult;
		
		let mountainHeight = this.mountainHeightNoise.sample(x, y, z);
		mountainHeight = Math.pow(mountainHeight, 2);
		
		let mountain = this.mountainNoise.sample(x, y, z);
		mountain = 1 - Math.abs(mountain*2 - 1);
		mountain = 0.8*clamp(12*mountain - 11) + 0.2*clamp(5*mountain - 4);
		
		let miniMountain = this.miniMountainNoise.sample(x, y, z);
		miniMountain = clamp(miniMountain*2 - 1);
		
		mountain = 0.5*miniMountain+mountain;
		
		let mountainPeak = this.mountainPeakNoise.sample(x, y, z);
		mountainPeak = Math.abs(mountainPeak*2.5 - 1.5);
		
		mountain = (mountain*1.0) * mountainMult * mountainHeight * (0.3 + 0.7*mountainPeak);
		
		val += mountain * 10.0;
		
		let icecap = 0;
		let icelat = 2*Math.abs(latitude-0.5)
		if (icelat > 0.75) {
			icecap = mountainPeak + (icelat - 0.75)/0.1 - 1;
		}
		icecap *= 10;
		icecap = Math.max(0, icecap);
		icecap*=0.98;
		
		if (Math.floor(this.y/(this.size/12)) != Math.floor((this.y+this.level)/(this.size/12))) {
			icecap = 0.1;
		} else if (Math.floor(this.x/(this.size/12)) != Math.floor((this.x+this.level)/(this.size/12))) {
			icecap = 0.1;
		}
		
		if (val > SEA_LEVEL) {
			val = (val - SEA_LEVEL) / (1 - SEA_LEVEL);
			
			let temperature = 1 - 2*Math.abs(latitude-0.5);
			temperature = temperature + (0.4*temp - 0.2);
			temperature = temperature - val*0.25;
			
			let rainfall = (1-val);
			rainfall = clamp(rainfall*5 - 4);
			rainfall = Math.pow(rainfall, 2);
			rainfall = rainfall * 0.2 + (rain*2.0 - 0.5);
			
			let color = pallet.palletColor(temperature, rainfall);
			
			
			let shadow = 1 - Math.sqrt(mountain*4);
			shadow = 0.0 + 1.0*shadow;
			shadow = 1;
			//shadow = 1;
			
			mountain = mountain * (10.0 + Math.random()*1);
			mountain = 0;
			
			//mountain = 0;
			//shadow = 1
			
			return {
				r:shadow*color.r+Math.random()*0.02+mountain+icecap,
				g:shadow*color.g+Math.random()*0.02+mountain+icecap,
				b:shadow*color.b+Math.random()*0.02+mountain+icecap,
				specular:0,
				bump:val*0.1
			}
		} else {
			val = val/SEA_LEVEL;

			val = 0.75 * Math.pow(0.5 - 0.5*Math.cos(Math.PI * Math.max(val*2-1,0)), 3) + 0.25*val;
			
			return {
				r:0.1+0.2*val+icecap,
				g:0.3+0.4*val+icecap,
				b:0.4+0.6*val+icecap,
				specular:1-icecap,
				bump:0
			}
		}
	}
	
	function clamp(x) {
		if (x > 1) return 1;
		if (x < 0) return 0;
		return x;		
	}
	
	function toColor(r, g, b) {
		r = Math.round(r * 255);
		g = Math.round(g * 255);
		b = Math.round(b * 255);
		
		r = clampc(r).toString(16).padStart(2, '0');
		g = clampc(g).toString(16).padStart(2, '0');
		b = clampc(b).toString(16).padStart(2, '0');
		
		return '#' + r + g + b;
		
		function clampc(x) {
			if (x > 0xff) return 0xff;
			if (x < 0) return 0;
			return x;
			
		}
	}
	
	return Generator;
}) ()