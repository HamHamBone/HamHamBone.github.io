function Camera(canvas, minScale, maxScale, scaleExponent, x, y, scale) {
	this.minScale = minScale;
	this.maxScale = maxScale;
	this.scaleExponent = scaleExponent;
	
	this.x = x;
	this.y = y;
	this.scale = scale;
	
	this.xTarget = x;
	this.yTarget = y;
	this.scaleTarget = scale;
	
	this.canvas = canvas;
	
	canvas.addEventListener("wheel", onWheelEvent);
	canvas.addEventListener("mousemove", onMouseMoveEvent);
	
	var self = this;
	function onWheelEvent(event) {
		self.scaleTarget -= event.deltaY*0.03;
		if (self.scaleTarget < 0) self.scaleTarget = 0;
		if (self.scaleTarget > 1) self.scaleTarget = 1;
	}
	
	function onMouseMoveEvent(event) {
		var scale = self.getScaleFactor();
	
		scale *= 0.8;
		
		if (event.buttons > 0) {
			self.xTarget -= event.movementX/scale;
			self.yTarget -= event.movementY/scale;				
		}
	}
}

Camera.prototype.transformContext = function(context) {
	var exponent = this.getScaleFactor();
	
	context.translate(this.canvas.width/2, this.canvas.height/2);
	//context.scale(exponent, exponent*(0.75 + Math.min((1-this.scale) * 1.5, 1) * 0.25));
	context.scale(exponent, exponent);
	context.translate(-this.x, -this.y);
}

Camera.prototype.getScaleFactor = function() {
	var exponent = Math.pow(this.scaleExponent, this.scale);
	
	exponent = (exponent - 1) / (this.scaleExponent - 1);
	exponent = this.minScale + (this.maxScale - this.minScale) * exponent;
	//return this.minScale + (this.maxScale - this.minScale) * scale;
	
	return exponent;
}

Camera.prototype.viewToScreen = function(x, y) {
	let scale = this.getScaleFactor();
	
	x = scale*(x - this.x) + this.canvas.width/2;
	y = scale*(y - this.y) + this.canvas.height/2;
	
	return {x:x, y:y};
}

Camera.prototype.step = function() {
	this.scale = (3*this.scale + this.scaleTarget) / 4;
	this.x = (3*this.x + this.xTarget) / 4;
	this.y = (3*this.y + this.yTarget) / 4;	
}

Camera.prototype.getBounds = function() {
	var scale = this.getScaleFactor();
	
	var scaleWidth = this.canvas.width / scale;
	var scaleHeight = this.canvas.height / scale;
	
	var xMin = this.x - scaleWidth / 2;
	var xMax = this.x + scaleWidth / 2;
	var yMin = this.y - scaleHeight / 2;
	var yMax = this.y + scaleHeight / 2;
	
	return {xMin:xMin, xMax:xMax, yMin:yMin, yMax:yMax};
}