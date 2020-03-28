'use strict';

let Noise = (function() {
	const VALUE_LENGTH = 128;
	
	let Noise = function(scale=1) {
		this.xValues = new Array(VALUE_LENGTH);
		this.yValues = new Array(VALUE_LENGTH);
		this.zValues = new Array(VALUE_LENGTH);
		
		for (let i = 0; i < VALUE_LENGTH; i++) {
			this.xValues[i] = Math.random();
			this.yValues[i] = Math.random();
			this.zValues[i] = Math.random();
		}
		
		this.scale = scale;
		
		this.bumpX = Math.random() - 0.5;
		this.bumpY = Math.random() - 0.5;
		this.bumpZ = Math.random() - 0.5;
	}
	
	Noise.prototype.sampleGrid = function(x=0, y=0, z=0) {
		x = x%VALUE_LENGTH;
		if (x < 0) { x += VALUE_LENGTH; }
		y = y%VALUE_LENGTH;
		if (y < 0) { y += VALUE_LENGTH; }
		z = z%VALUE_LENGTH;
		if (z < 0) { z += VALUE_LENGTH; }
		
		let vx = this.xValues[x];
		let vy = this.yValues[y];
		let vz = this.zValues[z];
		
		let result = (vx * (vy + 10) * (vz + 100) * 100000) % 1;
		
		return result;
	}
	
	Noise.prototype.sample = function(x=0, y=0, z=0) {
		x = x / this.scale + this.bumpX;
		y = y / this.scale + this.bumpY;
		z = z / this.scale + this.bumpZ;
		
		let gx = Math.floor(x);
		let gy = Math.floor(y);
		let gz = Math.floor(z);
		
		let dx = 1 - (x - gx);
		let dy = 1 - (y - gy);
		let dz = 1 - (z - gz);
		
		let dxMinus = 1 - dx;
		let dyMinus = 1 - dy;
		let dzMinus = 1 - dz;
		
		let mXmYmZ = this.sampleGrid(gx, gy, gz);
		let mXmYpZ = this.sampleGrid(gx, gy, gz+1);
		let mXpYmZ = this.sampleGrid(gx, gy+1, gz);
		let mXpYpZ = this.sampleGrid(gx, gy+1, gz+1);
		let pXmYmZ = this.sampleGrid(gx+1, gy, gz);
		let pXmYpZ = this.sampleGrid(gx+1, gy, gz+1);
		let pXpYmZ = this.sampleGrid(gx+1, gy+1, gz);
		let pXpYpZ = this.sampleGrid(gx+1, gy+1, gz+1);
		
		let mXmY = mXmYmZ * dz + mXmYpZ * dzMinus;
		let mXpY = mXpYmZ * dz + mXpYpZ * dzMinus;
		let pXmY = pXmYmZ * dz + pXmYpZ * dzMinus;
		let pXpY = pXpYmZ * dz + pXpYpZ * dzMinus;
		
		let mX = mXmY * dy + mXpY * dyMinus;
		let pX = pXmY * dy + pXpY * dyMinus;
		
		let result = mX * dx + pX *dxMinus;
		
		return result;
	}
	
	return Noise;
}) ();