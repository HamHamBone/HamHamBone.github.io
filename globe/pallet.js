function ImagePallet(palletURL) {
	this.palletURL = palletURL;
	
	this.image = new Image();
	this.image.src = palletURL;
	
	let self = this;
	this.image.addEventListener('load', function() {
		self.canvas = document.createElement("canvas");
		self.canvas.width = self.image.width;
		self.canvas.height = self.image.height;
		self.context = self.canvas.getContext("2d");
		
		self.context.drawImage(self.image, 0, 0);
		self.width = self.image.width;
		self.height = self.image.height;
		
		self.data = self.context.getImageData(0, 0, self.image.width, self.image.height).data;
		
		console.log(self.width, self.height, self.data);
	});
}

// get the pixel data at the pixel coordinates provided
// RETURNS: {r, g, b, a}
ImagePallet.prototype.getColorData = function(pX, pY) {
	var offset = 4 * (pX + pY * this.width);
	
	var r = this._colorFromByte(this.data[offset + 0]);
	var g = this._colorFromByte(this.data[offset + 1]);
	var b = this._colorFromByte(this.data[offset + 2]);
	var a = this._colorFromByte(this.data[offset + 3]);
	
	var color = {r:r, g:g, b:b, a:a};
	
	//console.log(pX, pY, offset, r, g, b, a);
	
	return color;
}

ImagePallet.prototype.palletColor = function(x, y) {
	x = Math.floor(x * this.image.width);
	y = Math.floor(y * this.image.height);
	
	if (x < 0) { x = 0;};
	if (x >= this.image.width-1) { x = this.image.width-1; }
	if (y < 0) { y = 0; };
	if (y >= this.image.height-1) { y = this.image.height-1; }
	
	return this.getColorData(x, y);
}

ImagePallet.prototype._MAX_COLOR = 255;
ImagePallet.prototype._colorFromByte = function(x) {
	return x / this._MAX_COLOR;
}