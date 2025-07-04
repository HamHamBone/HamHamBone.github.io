'use strict';

let Main = (function() {
	let Main = {};
	
	// ============================================================== //
	
	let loadCount = 0;
	
	let waveImages = [];
	
	for (let i = 1; i <= 23; i++) {
		let img = new Image();
		img.src = 'waves/frame ('+i+').gif';
		loadCount++;
		console.log(loadCount, img.src);
		img.addEventListener('load', imageLoadReady());
		//img.addEventListener('error', imageLoadReady());
		waveImages.push(img);
	}
	console.log(loadCount);
	
	function imageLoadReady() {
		loadCount--;
		console.log(loadCount);
	}
	
	// ============================================================== //
	
	let imgLogo = new Image();
	imgLogo.src = 'egress_logo.png';
	
	let abScript = [
		[1,1],
		[1,1],
		[1,1],
		[1,1],
		[1,1],
		[1,1],
		[1,1],
		[1,1],
		
		[2,1],
		[3,1],
		[2,3],
		[3,4],
		[1,2],
		[1,3],
		[3,2],
		[4,3],
		
		[6,7],
		[8,2],
		[11,10],
		[1,6],
		[3,2],
		[5,8],
		[9,4],
		[4,5],
		
		[1,1],
		[1,2],
		[1,3],
		[1,4],
		[1,5],
		[1,6],
		[1,7],
		[1,8],
		
		[1,1],
		[2,1],
		[3,1],
		[4,1],
		[5,1],
		[6,1],
		[7,1],
		[8,1],
		
		[2,1],
		[6,7],
		[2,5],
		[3,7],
		[1,2],
		[7,6],
		[5,2],
		[7,3],
		
		[6,7],
		[9,2],
		[11,10],
		[1,6],
		[8,3],
		[5,8],
		[9,4],
		[4,5],
		
		[7,8]
	]
	
	let a = 1;
	let b = 1;
	let sigma = Math.PI/2;
	let i_step = 0.01;
	let radius = 25;
	let alpha = 1.0;
	let logoAlpha = 0.0;
	let waveAlpha = 0.0;
	
	let startTime = 0
	
	let backColor = '#19122D';
	let lineColor = '#00D0FF';
	
	function main() {
		let canvas = document.getElementById('canvas');
		canvas.width = 900;
		canvas.height = 500;
		
		let ctx = canvas.getContext('2d');
		ctx.lineJoin = 'round';
		ctx.lineWidth = 3;
		
		ctx.fillStyle = backColor;
		ctx.strokeStyle = lineColor;
		
		let music;
		
		let t = 0;
		
		ctx.fillStyle = backColor;
		ctx.fillRect(0,0,canvas.width, canvas.height);
		
		ctx.save()
			ctx.translate(canvas.width/2, canvas.height/2);
			ctx.lineWidth = 3;
			ctx.strokeStyle = lineColor;
			ctx.globalAlpha = alpha;
			drawSymbol(ctx);
			
			ctx.beginPath()
			ctx.moveTo(radius*0.8,0);
			ctx.lineTo(radius*0.8*Math.cos(Math.PI*2/3), radius*0.8*Math.sin(Math.PI*2/3))
			ctx.lineTo(radius*0.8*Math.cos(-Math.PI*2/3), radius*0.8*Math.sin(-Math.PI*2/3))
			ctx.closePath();
			ctx.stroke();
		ctx.restore();
		
		let clickFlag = false;
		let musicFlag = false;
		canvas.addEventListener('click', function() {
			if (clickFlag) {
				return;
			}
			clickFlag = true;
			
			music = new Howl({
				src: ['under_c.mp3']
			});
			
			music.once('load', function() {
				musicFlag = true;
			})
			
			waitForLoad();
		});
		
		let startFlag = false;
		let initFlag = false;
		function waitForLoad() {
			ctx.fillStyle = backColor;
			ctx.fillRect(0,0,canvas.width, canvas.height);
			
			if (startFlag) {
				startTime = Date.now();
				step();
				return;
			}
			
			t++;
			sigma += (Math.PI / 40);
			ctx.save()
				ctx.translate(canvas.width/2, canvas.height/2);
				ctx.lineWidth = 3;
				ctx.strokeStyle = lineColor;
				ctx.globalAlpha = alpha;
				drawSymbol(ctx);
			ctx.restore();
			
			if (!initFlag && musicFlag && loadCount == 0 && t % 80 == 0) {
				music.play();
				initFlag = true;
				
				music.once('play', function() {
					startFlag = true;
				});
			}
			
			window.requestAnimationFrame(waitForLoad);
		}
		
		function step() {
			let curTime = Date.now();
			t = (curTime - startTime) * 60 / 1000;
			
			let abScriptIndex = Math.floor(t / 80);
			if (abScriptIndex < abScript.length) {
				a = abScript[abScriptIndex][0];
				b = abScript[abScriptIndex][1];
			} else {
			}
			
			if (t < 80*6) {
				radius = 25 + (150-25) * (t / (80*6))
			} else {
				radius = 150;
			}
			
			let fadeStart = 80*8*7.25;
			let fadeEnd = 80*8*7.6;
			if (t > fadeStart && t < fadeEnd) {
				alpha = 1 - (t-fadeStart) / (fadeEnd - fadeStart)
			} else if (t > fadeEnd) {
				alpha = 0;
			}
			
			fadeStart = 80*8*7.5;
			fadeEnd = 80*8*7.65;
			if (t > fadeStart && t < fadeEnd) {
				logoAlpha = (t-fadeStart) / (fadeEnd - fadeStart)
				logoAlpha *= 1 - 0.333 * (0.5+0.5*Math.sin(0.5*t))*(Math.pow(Math.sin(Math.PI * 2 * t / 640), 4));
			} else if (t > fadeEnd) {
				logoAlpha = 1;
				logoAlpha *= 1 - 0.333 * (0.5+0.5*Math.sin(0.5*t))*(Math.pow(Math.sin(Math.PI * 2 * t / 640), 4));

			}
			
			fadeEnd = 80*4;
			if (t < fadeEnd) {
				waveAlpha = t/fadeEnd;
			} else {
				waveAlpha = 1;
			}
			
			ctx.fillRect(0,0,canvas.width,canvas.height);
			draw(ctx, t);
			sigma += 1 * ((Math.min(a,b))/lcm(a,b)) * Math.PI / 40;
			window.requestAnimationFrame(step);
		}
	}
	
	function draw(ctx, t) {
		ctx.save();
			ctx.translate(canvas.width/2,canvas.height/2);
			
			ctx.save();
				ctx.rotate((Math.PI*t/640));
				ctx.scale(2.1, -2.1);
				ctx.globalAlpha = alpha * waveAlpha;
				ctx.drawImage(waveImages[Math.floor(t/3)%waveImages.length], -waveImages[0].width/2, 0)
				ctx.drawImage(waveImages[Math.floor(t/3)%waveImages.length], -waveImages[0].width/2, -2*waveImages[0].height)
				ctx.scale(1, -1);
				ctx.drawImage(waveImages[Math.floor(t/3)%waveImages.length], -waveImages[0].width/2, 0)
				ctx.drawImage(waveImages[Math.floor(t/3)%waveImages.length], -waveImages[0].width/2, -2*waveImages[0].height)
			ctx.restore();
			
			ctx.globalAlpha = 1;
			ctx.fillStyle = lineColor
			ctx.strokeStyle = lineColor
			if (t < 80*8*7) {
				ctx.strokeRect(-200,200,400,10);
			}
			ctx.globalAlpha = alpha;
			ctx.fillRect(-200,200,Math.min(400,400*t/(80*8*7)),10)
			
			ctx.lineWidth = 3;
			ctx.strokeStyle = lineColor;
			ctx.globalAlpha = alpha;
			drawSymbol(ctx);
			
			ctx.fillStyle = backColor;

			if (t%80 < 10) {
				ctx.lineWidth = 4;
				ctx.strokeStyle = 'white';
				ctx.globalAlpha = alpha * Math.sqrt((10-t%80) / 10);
				drawSymbol(ctx);
			}
			
			ctx.globalAlpha = logoAlpha;
			ctx.translate(-imgLogo.width/2,-imgLogo.height/2);
			ctx.drawImage(imgLogo,0,0);
		ctx.restore();
	}
	
	function drawSymbol(ctx) {
		ctx.beginPath();
		ctx.moveTo(getX(0), getY(0));
		for (let i = i_step; i <= 5*Math.PI; i+=i_step) {
			ctx.lineTo(getX(i), getY(i))
		}
		ctx.stroke();		
	}
	
	function getX(i) {
		let x = Math.sin(a*i+sigma);
		let sign = Math.sign(x);
		x = Math.abs(Math.pow(Math.abs(x), 1));
		x *= sign;
		x *= radius;
		return x;
	}
	
	function getY(i) {
		let x = Math.sin(b*i);
		let sign = Math.sign(x);
		x = Math.abs(Math.pow(Math.abs(x), 1));
		x *= sign;
		x *= radius;
		return x;
	}
	
	function toTarget(current, target, step) {
		if (Math.abs(current - target) > step) {
			if (target > current) {current += step;}
			if (target < current) {current -= step;}
		} else {
			current = target;
		}
		return current;
	}
	
	function gcd(a, b) {
        return !b ? a : gcd(b, a % b);
    }

    function lcm(a, b) {
        return (a * b) / gcd(a, b);   
    }
	
	main();
	
	// ============================================================ //
	
	return Main;
}) ();