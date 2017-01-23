var provinces = {
	A:{x:370, y:556},
	B:{x:351, y:466},
	C:{x:320, y:520},
	
	D:{x:271, y:469},
	E:{x:350, y:394},
	F:{x:224, y:383},
	G:{x:279, y:383},
	H:{x:332, y:319},
	I:{x:155, y:341},
	J:{x:236, y:334},
	K:{x:284, y:275},
	L:{x:403, y:280},
	M:{x:93, y:230},
	N:{x:123, y:303},
	O:{x:210, y:278},
	P:{x:255, y:210},
	Q:{x:334, y:230},
	R:{x:406, y:222},
	S:{x:167, y:162},
	T:{x:234, y:163},
	U:{x:302, y:151},
	V:{x:356, y:118},
	W:{x:212, y:140},
	X:{x:300, y:85},
	Y:{x:117, y:94},
	Z:{x:226, y:81}
};

var sides = [
	{name:"melchezidaens", color:"#FCB711"},
	{name:"fiefdom of mook", color:"#CC004C"},
	{name:"coco village", color:"#0DB14B"},
	{name:"absurdium Confoundium", color:"#6460AA"},
	{name:"wizard u", color:"#DB00BA"},
	{name:"insectoids", color:"#0089D0"},
	{name:"the doomed ones", color:"#70A399"},
	{name:"we are groot", color:"#F37021"}
]

var canvasElement, context;
var mapImage;
var inputElement;

initialize();


function initialize() {
	mapImage = document.getElementById("map-image");
	canvasElement = document.getElementById("canvas");
	inputElement = document.getElementById("input");
	
	context = canvas.getContext("2d");
	
	updateMap();
	
	inputElement.addEventListener("input", function(event) {
		updateMap();
	});
}

function updateMap() {
	canvasElement.width = mapImage.width;
	canvasElement.height = mapImage.height;
	context.drawImage(mapImage, 0,0);
	
	var textData = inputElement.value;
	console.log(textData);
	var textDataLines = textData.split("\n");
	console.log(textDataLines);
	
	for (var i = 0; i < textDataLines.length; i++) {
		var textDataLine = textDataLines[i];
		
		drawProvince(textDataLine);
	}
}

function drawProvince(textData) {
	textData = textData.toUpperCase();
	
	var provinceId = textData.split(/\s+/, 1);
	if (provinceId.length == 0) {
		return;
	};
	provinceId = provinceId[0];
	
	if (!provinces.hasOwnProperty(provinceId)) {
		return;
	}
	
	var province = provinces[provinceId];
	var string = "";
	
	var goldString = "";
	var troopCount = textData.match(/[0-9]+/g);
	console.log(troopCount);
	if (troopCount != null) {
		string += troopCount[0];
		if (troopCount.length > 1) {
			goldString = "$" + troopCount[1];
		}
	}
	
	var specialString = "";
	
	if (textData.match("YES")) {
		specialString += "C";
	}
	
	if (textData.match("RULER")) {
		specialString += "R";
	}
	
	if (textData.match("HEIR")) {
		specialString += "H";
	}
	
	if (specialString != "") {
		string += " " + specialString;
	}
	
	if (goldString != "") {
		string += " " + goldString;
	}
	
	if (string == "") {
		return;
	}
	
	var textColor = getSideColor(textData.replace(/.\s+/, ""));
	
	context.font = "16px Gentium Basic";
	context.fontWeight = "bold";
	context.textAlign = "center";
	context.textBaseline = "middle";
	
	var textMeasurement = context.measureText(string);
	var textWidth = textMeasurement.width;
	var textHeight = 16;
	
	context.fillStyle = "#fff";
	context.globalAlpha = 0.75;
	context.fillRect(province.x - textWidth/2 - 2, province.y - textHeight/2 - 2, textWidth + 4, textHeight + 4);
	
	context.strokeStyle = "#000";
	context.lineWidth = 2;
	context.globalAlpha = .5;
	
	context.strokeText(string, province.x, province.y+1);	
	
	context.fillStyle = textColor;
	context.globalAlpha = 1;
	
	context.fillText(string, province.x, province.y);
	

}

function getSideColor(text) {
	var maxCount = 0;
	var maxCount = 0;
	var maxColor = "#555";
		
	for (var i = 0; i < sides.length; i++) {
		var count = getStringMatch(text, sides[i].name);
		if (count > maxCount) {
			maxCount = count;
			maxColor = sides[i].color;
		}
	}
	
	return maxColor;
}

function getStringMatch(s1, s2) {
	s1 = s1.toUpperCase();
	s2 = s2.toUpperCase();
	
	var count = 0;
	var minLength = Math.min(s1.length, s2.length);
	for (var i = 0; i < minLength; i++) {
		if (s1[i] == s2[i]) {
			count++;
		} else {
				console.log(count);

			return count;
		}
	}
	
	
	return count;
}