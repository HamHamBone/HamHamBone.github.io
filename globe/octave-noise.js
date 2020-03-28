let OctaveNoise = (function () {
	function OctaveNoise(seed, scale, count) {
		this.seed = seed;
		this.scale = scale;
		
		this.count = count;
		
		this.noises = new Array(count);
		for (let i = 0; i < count; i++) {
			this.noises[i] = new SimplexNoise(seed+(i.toString()));
		}
	}
	
	OctaveNoise.prototype.sample = function(x=0, y=0, z=0) {
		x /= this.scale;
		y /= this.scale;
		z /= this.scale;
		
		let multiplier = 1;
		
		let sum = 0;
		let max = 0;
		
		for (let i = 0; i < this.count; i++) {
			sum += (0.5 + 0.5*this.noises[i].noise3D(x/multiplier, y/multiplier, z/multiplier)) * multiplier;
			max += multiplier;
			
			multiplier *= 0.5;
		}
		
		return sum / max;
	}
	
	return OctaveNoise;
}) ();