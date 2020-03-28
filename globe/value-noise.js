// 48-bit linear congruential generator: http://nuclear.llnl.gov/CNP/rng/rngman/node5.html
// not the "most random" but fast and good enough (maybe, this is not exactly what it was designed
const RAND_A = 44485709377909;
const RAND_B = 11863279;
const RAND_MAX = Math.pow(2,48);
function randomize(k) {
	return (RAND_A * k + RAND_B) % RAND_MAX;
}

// map integer number line to natural number line (positive, nonzero) for cantor function
function interleave(k) {
	if (k < 0) {
		return -2*k;
	} else {
		return 2*k + 1;
	}
}

// cantor pairing function -- map two integers to a single natural number
// http://en.wikipedia.org/wiki/Cantor_pairing_function#Cantor_pairing_function
function cantorPairing(k1, k2) {
	return ((((k1+k2) * (k1+k2+1)) / 2) + k2);
}

// http://dmauro.com/post/77011214305/a-hashing-function-for-x-y-z-coordinates
function cantorPairing3D(k1, k2, k3) {
	let max = Math.max(k1, k2, k3);
	let hash = max*max*max + (2*max*k3) + k3;
	if (max == k3) {
		let maxK1K2 = Math.max(k1, k2);
		hash += maxK1K2
	}
	if (k2 >= k1) {
		hash += k1+k2;
	} else {
		hash += k2;
	}
	return hash;
}

function noise(seed, x, y, z=0) {
	x = interleave(x);
	y = interleave(y);
	z = interleave(z);
	
	return randomize(Math.abs((cantorPairing3D(x,y,z)*(x+y+z))^seed)) / RAND_MAX;
}

function newSeed(seed, string) {
	if (!seed || !string) {
		return Math.floor(Math.random()*RAND_MAX);
	}
	
	var hash = 0;
	
	for (var i = 0; i < string.length; i++) {
		var code = string.charCodeAt(i);
		hash = ((hash << 5) - hash) + code;
		hash |= 0;
	}
	
	return noise(seed, hash, 0);
}

function interpolate(x) {
	if (x < 0.0) return 1.0;
	else if (x < 0.5) return 1 - 2.0 * x * x;
	else if (x < 1.0) return (2.0 * (1.0 - x) * (1.0 - x));
	else return 0.0;
}

function ValueNoise(seed, period) {
	this.seed = seed;
	this.period = period;
	
	this.cacheX = null;
	this.cacheY = null;
	this.cacheZ = null;
	
	this.cacheAAA = 0;
	this.cacheAAB = 0;
	this.cacheABA = 0;
	this.cacheABB = 0;
	this.cacheBAA = 0;
	this.cacheBAB = 0;
	this.cacheBBA = 0;
	this.cacheBBB = 0;
}

ValueNoise.prototype.sample = function(x, y, z) {
	var pX = Math.floor(x / this.period);
	var pY = Math.floor(y / this.period);
	let pZ = Math.floor(z / this.period);
	
	if (this.cacheX == null || (this.cacheX != pX || this.cacheY != pY) || this.cacheZ != pZ) {
		this.cacheX = pX;
		this.cacheY = pY;
		this.cacheZ = pZ;
		
		this.cacheAAA = noise(this.seed, pX, pY, pZ);
		this.cacheAAB = noise(this.seed, pX, pY, pZ+1);
		this.cacheABA = noise(this.seed, pX, pY+1, pZ);
		this.cacheABB = noise(this.seed, pX, pY+1, pZ+1);
		this.cacheBAA = noise(this.seed, pX+1, pY, pZ);
		this.cacheBAB = noise(this.seed, pX+1, pY, pZ+1);
		this.cacheBBA = noise(this.seed, pX+1, pY+1, pZ);
		this.cacheBBB = noise(this.seed, pX+1, pY+1, pZ+1);
	}
	
	let gx = ((x / this.period) % 1)
	if (gx < 0) { gx += 1; }
	let gy = ((y / this.period) % 1)
	if (gy < 0) { gy += 1; }
	let gz = ((z / this.period) % 1)
	if (gz < 0) { gz += 1; }
	
	var interpXA = interpolate(gx);
	var interpXB = 1 - interpXA;
	var interpYA = interpolate(gy);
	var interpYB = 1 - interpYA;
	var interpZA = interpolate(gz);
	var interpZB = 1 - interpZA;
	
	//return bb;
	
	return interpXA*(interpYA*(interpZA*this.cacheAAA + interpZB*this.cacheAAB) + interpYB*(interpZA*this.cacheABA + interpZB*this.cacheABB)) +
		interpXB*(interpYA*(interpZA*this.cacheBAA + interpZB*this.cacheBAB) + interpYB*(interpZA*this.cacheBBA + interpZB*this.cacheBBB));
}

function OctaveNoise(seed, maxPeriod, octaveCount, transformFunction) {
	this.octaveCount = octaveCount;
	this.noises = new Array(octaveCount)
	for (var i = 0; i < octaveCount; i++) {
		this.noises[i] = new ValueNoise(Math.floor(Math.random()*RAND_MAX), maxPeriod);
		seed = randomize(seed);
		maxPeriod /= 2;
	}
	this.transformFunction = transformFunction;
	if (!transformFunction) {
		this.transformFunction = null;
	}
}

OctaveNoise.prototype.sample = function(x,y,z) {
	var sum = 0;
	var count = 0;
	var multiplier = 1;
	for (var i = 0; i < this.octaveCount; i++) {
		var value = this.noises[i].sample(x, y, z);
		//value = 1-Math.abs(1-2*value);
		if (this.transformFunction != null) {
			value = this.transformFunction(value);
		}
		sum += multiplier * value;
		count += multiplier;
		multiplier /= 2;
	}
	
	return sum/count;
}

function clamp(value, min, max) {
	if (value < min) value = min;
	if (value > max) value = max;
	return value;
}