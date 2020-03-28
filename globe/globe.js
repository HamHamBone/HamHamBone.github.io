'use strict';

let Globe = (function() {
	let Globe = {};
	
	Globe.SIDE_MIN_X = {index:0, transform:function(u,v) { return [-0.5, -u, v]}};
	Globe.SIDE_MAX_X = {index:1, transform:function(u,v) { return [0.5, u, v]}};
	Globe.SIDE_MIN_Y = {index:2, transform:function(u,v) { return [u, -0.5, v]}};
	Globe.SIDE_MAX_Y = {index:3, transform:function(u,v) { return [-u, 0.5, v]}};
	Globe.SIDE_MIN_Z = {index:4, transform:function(u,v) { return [u, -v, -0.5]}};
	Globe.SIDE_MAX_Z = {index:5, transform:function(u,v) { return [u, v, 0.5]}};
	
	Globe.SIDES = [
		Globe.SIDE_MIN_X,
		Globe.SIDE_MAX_X,
		Globe.SIDE_MIN_Y,
		Globe.SIDE_MAX_Y,
		Globe.SIDE_MIN_Z,
		Globe.SIDE_MAX_Z
	];
	
	Globe.sphereCoordinates = function(side, u, v) {
		let coords = Globe.sphericalize(u, v);
		u = coords.x;
		v = coords.y;
		
		u -= 0.5;
		v -= 0.5;
		
		let vec = side.transform(u, v);
		
		let d = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2]);
		
		vec[0] = vec[0] / d;
		vec[1] = vec[1] / d;
		vec[2] = vec[2] / d;
		
		return vec;
	}
	
	// https://ntrs.nasa.gov/archive/nasa/casi.ntrs.nasa.gov/19810002572.pdf
	let R0 = 1 / Math.sqrt(3);
	let GAMMA = Math.sqrt(Math.PI/6);
	const SIGMA = 0.7904864491208
	const OMEGA = -1.225441487984
	
	let C_LIST = [
		{i:0,j:0,value:-2.7217053661814},
		{i:1,j:0,value:-5.5842168305430},
		{i:0,j:1,value:2.1711174809423},
		{i:2,j:0,value:-3.4578627473390},
		{i:1,j:1,value:-6.4160151526783},
		{i:0,j:2,value:1.9736265758872},
	];
	
	let D_LIST = [
		1.4833129294187,
		1.1199726069742,
		6.0515382161464
	];
	
	Globe.sphericalize = function(x, y) {
		x -= 0.5;
		y -= 0.5;
		
		x *= R0 / 0.5;
		y *= R0 / 0.5;
		
		let xNew = sphericalize(x, y);
		let yNew = sphericalize(y, x);
		
		x = xNew;
		y = yNew;
		
		x *= 0.5 / R0;
		y *= 0.5 / R0;
		
		x += 0.5;
		y += 0.5;
		
		return {x:x, y:y};
	}
	
	function sphericalize(x, y) {
		let alpha = (R0*R0 - x*x);
		let beta = (R0*R0 - y*y);
		
		let cSum = 0;
		for (let c of C_LIST) {
			cSum += c.value * Math.pow(x, 2*c.i) * Math.pow(y, 2*c.j);
		}
		
		let dSum = 0;
		for (let i = 0; i < D_LIST.length; i++) {
			let d = D_LIST[i];
			dSum += d * Math.pow(x, 2*i);
		}
		
		let res = GAMMA*x + (1-GAMMA)*x*x*x/(R0*R0);
		res += x*y*y*alpha * ( SIGMA + beta*cSum );
		res += x*x*x*alpha * ( OMEGA + alpha*dSum );
		
		return res;
	}
	
	return Globe;
}) ();