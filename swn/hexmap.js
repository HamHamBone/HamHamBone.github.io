var Hexmap = {};

Hexmap._STYLE = window.getComputedStyle(document.body);
Hexmap.getStyle = function(style) {
	return this._STYLE.getPropertyValue(style);
}

Hexmap.draw = function(canvasElement, sector, selectedStar = null) {
	canvasElement.width = HEX_X * HEX_RADIUS * (MAP_WIDTH+0.333333) * 3 + 2;
	canvasElement.height = HEX_Y * HEX_RADIUS * (MAP_HEIGHT+0.5) * 2 + 2;
	
	var context = canvasElement.getContext('2d');
	
	context.clearRect(0, 0, canvasElement.width, canvasElement.height);
	
	var systems = sector.systems;
	
	if (selectedStar) {
		var starCoords = getHexCenter({x:selectedStar.x, y:selectedStar.y});
		
		context.fillStyle = this.getStyle('--hexmap-selection-color');
		context.beginPath();
			context.arc(starCoords.x,starCoords.y,HEX_RADIUS*0.75,0,Math.PI*2);
		context.fill();		
	}
	
	draw(context);
	
	for (var i = 0; i < systems.length; i++) {
		var system = systems[i];
		
		var starCoords = getHexCenter({x:system.x, y:system.y});
		
		context.fillStyle = this.getStyle('--hexmap-system-marker-color');
		context.beginPath();
			context.arc(starCoords.x,starCoords.y,4,0,Math.PI*2);
		context.fill();
		for (var j = 0; j < system.planets.length; j++) {
			context.fillStyle = this.getStyle('--hexmap-system-marker-color');
			context.beginPath();
				context.arc(starCoords.x + 8 + 6*j,starCoords.y,2,0,Math.PI*2);
			context.fill();
			
			var offset = 10*((system.planets.length-1)/2) + HEX_Y*HEX_RADIUS*0.5*(1 - (system.planets.length-1)/2)
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.font = 'italic 11px "Verdana","Segoe UI"';
			context.fillStyle = this.getStyle('--hexmap-planet-name-color');
			context.fillText(system.planets[j].name, starCoords.x, starCoords.y + offset + 11*j);		
		}
		
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.font = '12px "Verdana","Segoe UI"';
		context.fillStyle = this.getStyle('--hexmap-system-name-color');
		context.fillText(system.name, starCoords.x, starCoords.y - HEX_Y*HEX_RADIUS*0.37);
	}
}

Hexmap.onClickHex = function(canvas, sector, callback) {
	canvas.addEventListener('click', function(event) {
		var canvasBox = this.getBoundingClientRect();
		
		var mx = event.clientX - canvasBox.left;
		var my = event.clientY - canvasBox.top;
		
		var systemPick = null;
		var minDistance = null;
		for (var i = 0; i < sector.systems.length; i++) {
			var system = sector.systems[i];
			
			var starLoc = getHexCenter({x:system.x, y:system.y});
			
			var dx = mx - starLoc.x;
			var dy = my - starLoc.y;
			
			var distance = Math.sqrt(dx*dx + dy*dy);
			
			if (minDistance === null || distance < minDistance) {
				if (distance < HEX_RADIUS) {
					minDistance = distance;
					systemPick = system;
				}
			}
		}
		
		if (systemPick) {
			Hexmap.draw(canvas, sector, systemPick);
			callback(systemPick);
		}
	});
}

var HEX_X = Math.cos(Math.PI * (1.0 / 3.0));
var HEX_Y = Math.sin(Math.PI * (1.0 / 3.0));

var HEX_RADIUS = 42;

var MAP_WIDTH = 8;
var MAP_HEIGHT = 10;

// ===========================================

function setHex(hexes, x, y, data) {
	hexes.set("x"+x+"y"+y, {x:x, y:y, data:data});
}

function getHex(hexes, x, y) {
	hexes.get("x"+mouseHex.x+"y"+mouseHex.y);
}

function draw(context) {
	//canvas.width = HEX_RADIUS * (MAP_WIDTH+1) * HEX_X*3;
	//canvas.height = HEX_RADIUS * (MAP_HEIGHT+1) * HEX_Y*2;
	
	context.lineWidth = 0;
	
	//context.translate(100, 100);
	//context.clearRect(0,0,canvas.width, canvas.height);
	drawHexes(context);
}

function toColorCode(r, g, b) {
	return "rgb("+Math.floor(r*255)+","+Math.floor(g*255)+","+Math.floor(b*255)+")"
}

function getHexCenter(coords) {
	var x = coords.x;
	var y = coords.y;
	
	x = x * HEX_X * HEX_RADIUS * 3;
	y = (y + 0.5 * (coords.x%2)) * HEX_Y * HEX_RADIUS * 2;
	
	x += HEX_X * HEX_RADIUS * 2;
	y += HEX_Y * HEX_RADIUS;
	
	return {x:x, y:y};
}

function pickHex(mx, my) {
	var hx = Math.floor(mx / (HEX_X * HEX_RADIUS * 3));
	var hy = Math.floor((my-0.5*(mx%2)) / (HEX_Y * HEX_RADIUS * 2));
	
	return {x:hx, y:hy};
}

function drawHexes(context) {
	for (var x = 0; x < MAP_WIDTH; x++) {
	
		for (var y = 0; y < MAP_HEIGHT; y++) {
		
			context.save();
				context.strokeStyle = Hexmap.getStyle('--hexmap-grid-color');
				context.lineWidth = 1;
				
				var coords = getHexCenter({x:x, y:y});
				context.translate(coords.x, coords.y);
				
				//context.fillStyle = value.data;
				
				context.textAlign = "center";
				context.textBaseline = "hanging";
				context.font = 'bold 10px "Segoe UI"';
				//context.font = '12px "Consolas"';
				//context.font = '12px "Gentium Basic"';
				context.fillStyle = Hexmap.getStyle('--hexmap-xxyy-color');
				
				var gridX = x + 1;
				//gridX = gridX.toString(36);
				//gridX = gridX.toUpperCase();
				//gridX = letterCode(gridX);
				gridX = gridX.toString().padStart(2, '0');
				var gridY = y + 1;
				//gridY = gridY.toString(36);
				//gridY = gridY.toUpperCase();
				//gridY = codeLetter(gridY);
				gridY = gridY.toString().padStart(2, '0');
				
				var hexString = gridX + '' + gridY;
				
				//context.fillText(hexString, 0, -HEX_RADIUS * HEX_Y + 6);
				
				//context.fillText(String.fromCharCode(65+x)+""+(y+1), 0, -HEX_RADIUS * HEX_Y + 4);
				//context.fillText(letterCode(x+1)+""+(y+1), 0, -HEX_RADIUS * HEX_Y + 4);
				//context.fillText(((x+1).toString(36).padStart(1,'0')+""+(y+1).toString(36).padStart(1,'0')).toUpperCase(), 0, -HEX_RADIUS * HEX_Y + 4);
				context.fillText(x.toString().padStart(2,'0')+y.toString().padStart(2,'0'), 0, -HEX_RADIUS * HEX_Y + 2);
				//context.fillText(codeLetter(x)+codeLetter(y), 0, -HEX_RADIUS * HEX_Y + 4);
				//context.lineWidth = 3;
				
				context.beginPath();
					drawHex(context, HEX_RADIUS);
				context.stroke();
			context.restore();
		}
	}		
}

function drawHex(context, r) {
	var hx = HEX_X * r;
	var hy = HEX_Y * r;

	context.moveTo(r,0);
	context.lineTo(hx, -hy);
	context.lineTo(-hx, -hy);
	context.lineTo(-r,0);
	context.lineTo(-hx, hy);
	context.lineTo(hx, hy);
	context.lineTo(r, 0);
}

function zeroPad(num, digits) {
	var zeroCount = digits-Math.log10(num)-1;
	
	for (var i = 0; i < zeroCount; i++) {
		num = "0" + num;
	}
	
	num = "" + num;
	
	return num;
}

function letterCode(num) {		
	var result = "";
	
	if (num < 0) {
		num = "-";
	}
	
	do {
		var rem = num%26;
		var num = Math.floor(num/26);
		
		result = String.fromCharCode(65+rem) + result;
	} while(num > 0);
	
	return result;
}

function codeLetter(num) {		
	var result = "";
	
	if (num < 0) {
		num = "-";
	}
	
	var number = (num % 10);
	var numberString = (number+1).toString();
	var letterIndex = Math.floor(num / 10) % 26;
	var letter = String.fromCharCode(65+letterIndex);
	
	var result =   letter + numberString;
	
	return result;
}