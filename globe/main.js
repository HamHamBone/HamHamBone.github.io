'use strict';

let Main = (function() {
	let Main = {};
	
	Main.init = function() {
		const SIZE = 64;
		const SEA_LEVEL = 0.5125;
		
		let canvas = document.createElement('canvas');
		document.body.appendChild(canvas);
		canvas.width = SIZE*4;
		canvas.height = SIZE*3;
		
		let ctx = canvas.getContext('2d');
		
		let generator = new Generator();
		
		draw(Globe.SIDE_MIN_X, 0, 1);
		draw(Globe.SIDE_MIN_Y, 1, 1);
		draw(Globe.SIDE_MAX_X, 2, 1);
		draw(Globe.SIDE_MAX_Y, 3, 1);	
		draw(Globe.SIDE_MIN_Z, 1, 0);
		draw(Globe.SIDE_MAX_Z, 1, 2);
		
		let mapCanvas = document.createElement('canvas');
		document.body.appendChild(mapCanvas);
		mapCanvas.width = SIZE*4;
		mapCanvas.height = SIZE*2;
		
		let mapCtx = mapCanvas.getContext('2d');
		
		for (let x = 0; x < SIZE*4; x++) {
			for (let y = 0; y < SIZE*2; y++) {
				let mx = (x+0.5) / (SIZE*4);
				let my = (y+0.5) / (SIZE*2);
				
				mx = (mx-0.5)/Math.sin(my*Math.PI);
				
				if (mx < -0.5 || mx > 0.5) {
					mapCtx.fillStyle = 'black';
				} else {
					let rz = -Math.cos(my*Math.PI);
					let ry = Math.sin(my*Math.PI) * Math.sin(mx*Math.PI*2);
					let rx = Math.sin(my*Math.PI) * Math.cos(mx*Math.PI*2);
					
					mapCtx.fillStyle = sample(rx, ry, rz);
				}
				
				mapCtx.fillRect(x, y, 1, 1);				
			}
		}
		
		function draw(side, ox, oy) {
			ox*=SIZE;
			oy*=SIZE;
			
			for (let x = 0; x < SIZE; x++) {
				for (let y = 0; y < SIZE; y++) {
					let u = x / SIZE;
					let v = y / SIZE;
					
					let coords = Globe.sphereCoordinates(side, u, v);
					
					ctx.fillStyle = sample(coords[0], coords[1], coords[2]);
					ctx.fillRect(ox+x, oy+y, 1, 1);
				}
			}
		}
		
		function sample(x, y, z) {
			return generator.sample(x, y, z);			
		}
	}
	
	Main.toColor = function(r, g, b) {
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
	
	return Main;
}) ();

window.setTimeout(Main.init, 20);