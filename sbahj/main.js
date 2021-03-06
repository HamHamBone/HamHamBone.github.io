'use strict';

let synth = new beepbox.Synth('6n31s6k7l00e0rt8m0a7g0vjfi0r1o3210T0w8f2d1c2h0v1T0w1f1d1c0h8v0T0w2f2d2c0h0v2T2w1d1v1b000000000y2c8wz288M00000x2400y8c8y30000y8c8y328wM0248gy288My2c8wz288My2c8wz288gx288wy288w0008wy288w0008wx24p25BGsX3O2FPGY0FzPlkVRZg705et7WQQZ7ttA_wnkgQ1E3m6IdcBg6weJceacz8EOcyz8OacP8EM7dEOcyz8Oa00mpN3jddCsxa1ipznuNEuXujejdTr0mPUuFEXcQP0FpcJdd4ZcDN2u9D8O1iUKSqb7rcXJUCszrKUKSqH2ftLypOpwuU1PyLXmYjehZCsnrd6zZCswBIPjdtQO5COwDQR-bOuCBdfHDVtaoZQwFzW5c-0FEYo26Adfq3A1Sc13i6DIxO0X611G3lSG0FxNl0Rp50qa0V5llmhg402C1MG192m795gaw50cAeibgawmi795gaw50cAd54qoD4q2d16wct16wzg7oE3A100');

console.log(synth);

// -----------------------------------------------------------------------------

let imgRoom = document.getElementById('imgRoom');
let imgLight = document.getElementById('imgLight');
let imgOutside = document.getElementById('imgOutside');
let imgVignette = document.getElementById('imgVignette');

let canvas = document.getElementById('canvas');
let message = document.getElementById('message');

// -----------------------------------------------------------------------------

let forceStart = false;

canvas.width = 800;
canvas.height = 600;

let ctx = canvas.getContext('2d');

let gradient = ctx.createRadialGradient(400,300,0, 400,300,600);
gradient.addColorStop(0, 'transparent');
gradient.addColorStop(1, '#0C0B16');

let imgVignetteFake = document.createElement('canvas');
imgVignetteFake.width = 800;
imgVignetteFake.height = 600;
let vCtx = imgVignetteFake.getContext('2d');
vCtx.fillStyle = gradient;
vCtx.fillRect(0,0,800,600);

let lightLevel = Math.random();
let t = Math.random()*100;

let globalTime = 0;

let snowflakes = [];

for (let i = 0; i < 50; i++) {
	let snowflake = makeSnowflake();
	snowflake.y = Math.random()*300;
	snowflakes.push(snowflake);
}

draw();
mainLoop();

// =============================================================================

canvas.addEventListener('click', function(event) {
	//if (synth.audioCtx.state != 'running') {
		if (doneLoading()) {
			forceStart = true;
			synth.play();
		}
	//}
});

function doneLoading() {
	return imgRoom.complete && imgLight.complete && imgOutside.complete;
}

function makeSnowflake() {
	let snowflake = {};
	
	snowflake.distance = Math.random();
	snowflake.size = Math.min(Math.random(),Math.random());
	
	snowflake.x = 300 + Math.random() * 400;
	snowflake.y = 0;
	
	snowflake.dx = (2*Math.random()-1) * 0.25 - 0.1;
	snowflake.dy = 0.35*Math.random() + 0.15;

	return snowflake;	
}

function draw() {
	ctx.clearRect(0,0,800,600);
	
	if (!forceStart) {
		
		
		if (!doneLoading()) {
			ctx.save();
				ctx.fillStyle = 'white';
				ctx.globalAlpha = 0.25 + 0.05*Math.sin(globalTime / 10);
				
				ctx.font = '16px "Segoe UI"';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				
				ctx.fillText('Loading...', 400, 300);
			ctx.restore();

			canvas.style.cursor = 'default';
			
			return;
		}
		
		ctx.save();
			ctx.fillStyle = 'white';
			ctx.globalAlpha = 0.25;
			
			ctx.beginPath();
				ctx.moveTo(300,200);
				ctx.lineTo(300,400);
				ctx.lineTo(500,300);
				ctx.closePath();
			ctx.fill();
		ctx.restore();
		
		canvas.style.cursor = 'pointer';
		
		return;
	} else {
		canvas.style.cursor = 'default';
	}
	
	ctx.drawImage(imgOutside, 0, 0);
	
	ctx.save();
		for (let i = 0; i < snowflakes.length; i++) {
			
			let snowflake = snowflakes[i];
			
			snowflake.x += snowflake.dx * (0.75+0.25*snowflake.size);
			snowflake.y += snowflake.dy * (0.75+0.25*snowflake.size);
			
			if (snowflake.y > 300 || snowflake.x < 300) {
				snowflakes[i] = makeSnowflake();
			}
			
			ctx.save();
				ctx.globalAlpha = 0.2+0.3*snowflake.size;
				ctx.fillStyle = 'white';
				ctx.beginPath();
					ctx.arc(snowflake.x,snowflake.y,snowflake.size*2+1,0,Math.PI*2);
				ctx.fill();
			ctx.restore();
		}
	ctx.restore();
	
	ctx.drawImage(imgRoom, 0, 0);
	
	ctx.save();
	
		ctx.globalAlpha = 0.5 + lightLevel*0.5 - 0.035*(Math.sin(t*0.5));
		ctx.drawImage(imgLight, 0, 0);
	
	ctx.restore();
	
	ctx.drawImage(imgVignette.complete ? imgVignette : imgVignetteFake, 0, 0);	
}

function mainLoop() {
	t--;
	
	if (t < 0) {
		lightLevel = Math.random();
		t = 20 + Math.max(Math.random(),Math.random()) * 600;
	}
	
	globalTime ++;
	
	let opacity = 1 - (globalTime - 300) / 300;
	
	if (opacity < 0) opacity = 0;
	if (opacity > 1) opacity = 1;
	
	message.style.opacity = opacity;
	
	draw();
	
	window.requestAnimationFrame(mainLoop);
}