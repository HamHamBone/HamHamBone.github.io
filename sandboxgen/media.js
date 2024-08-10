'use strict';

let Media = (function() {
	let Media = {};
	
	let loadCount = 0;
	let loadCallback = null;
	
	Media.onLoad = function(callback) {
		console.log(loadCount);
		if (loadCount == 0) {
			console.log("huh");
			callback();
		} else {
			loadCallback = callback;
		}
	}
	
	function loadImage(src) {
		
		let img = new Image();
		img.src = src;
		img.addEventListener('load', onLoad);
		
		loadCount++;
		
		console.log('loading image #', loadCount);
		
		return img;
	}
	
	function onLoad() {
		loadCount--;
		
		console.log('image loaded!', loadCount, 'left!');
		
		if (loadCount == 0) {
			processImages();
			if (loadCallback != null) {
				loadCallback();
				loadCallback = null;
			}
		}
	}
	
	// ==========================================================================
	
	console.log("beginning image loads");
	
	Media.imgTiles = loadImage('media/tiles.png');
	Media.imgClouds = loadImage('media/clouds.png');
	
	// -----
	
	function processImages() {
		let TileCutter = new GridCutter(Media.imgTiles, 4, 22, 71, 61, 34, 0);
		
		Media.imgTileNone = TileCutter.cut(3,0);
		
		Media.imgTileNone = TileCutter.cut(0,0);
		Media.imgTileGrassland = TileCutter.cut(0,1);
		Media.imgTileForest = TileCutter.cut(0,2);
		Media.imgTileSwamp = TileCutter.cut(0,3);
		Media.imgTileHills = TileCutter.cut(0,4);
		Media.imgTileMountains = TileCutter.cut(0,5);
		Media.imgTileDesert = TileCutter.cut(0,6);
		Media.imgTileSea = TileCutter.cut(0,7);
		
		Media.imgTileLair = TileCutter.cut(1,5);
		Media.imgTileWeird = TileCutter.cut(1,6);
		Media.imgTileVillage = TileCutter.cut(1,7);
		Media.imgTileFort = TileCutter.cut(1,8);
		Media.imgTileTown = TileCutter.cut(1,9);
		
		Media.imgCoastW0 = TileCutter.cut(2,1);
		Media.imgCoastW1 = TileCutter.cut(2,2);
		Media.imgCoastW2 = TileCutter.cut(2,3);
		Media.imgCoastSW0 = TileCutter.cut(2,4);
		Media.imgCoastSW1 = TileCutter.cut(2,5);
		Media.imgCoastSW2 = TileCutter.cut(2,6);
		Media.imgCoastSE0 = TileCutter.cut(2,7);
		Media.imgCoastSE1 = TileCutter.cut(2,8);
		Media.imgCoastSE2 = TileCutter.cut(2,9);
		Media.imgCoastE0 = TileCutter.cut(3,1);
		Media.imgCoastE1 = TileCutter.cut(3,2);
		Media.imgCoastE2 = TileCutter.cut(3,3);
		Media.imgCoastNE0 = TileCutter.cut(3,4);
		Media.imgCoastNE1 = TileCutter.cut(3,5);
		Media.imgCoastNE2 = TileCutter.cut(3,6);
		Media.imgCoastNW0 = TileCutter.cut(3,7);
		Media.imgCoastNW1 = TileCutter.cut(3,8);
		Media.imgCoastNW2 = TileCutter.cut(3,9);
	}
	
	// ==========================================================================

	function cutImage(imgSource, x, y, w, h) {
		let imgResult = document.createElement('canvas');
		imgResult.width = w;
		imgResult.height = h;
		
		let ctx = imgResult.getContext('2d');
		ctx.drawImage(imgSource, x, y, w, h, 0, 0, w, h);
		
		return imgResult;
	}
	
	// ==========================================================================
	
	function GridCutter(imgSource, x, y, w, h, dx, dy) {
		this.imgSource = imgSource;
		
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.dx = dx;
		this.dy = dy;
	}
	
	GridCutter.prototype.cut = function(ix, iy) {
		let x = this.x + ix*(this.w+this.dx);
		let y = this.y + iy*(this.h+this.dy);
		
		return cutImage(this.imgSource, x, y, this.w, this.h);
	}
	
	// =========================================================================
	
	Media.drawColorized = function(ctx, img, color, x, y) {
		ctx.save();
			if (!img.____colorVariants) {
				img.____colorVariants = {};
				
			}
			let canvas = img.____colorVariants[color];
			if (!canvas) {
				canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				let ctx2 = canvas.getContext('2d');
				ctx2.drawImage(img, 0, 0);
				ctx2.globalCompositeOperation = 'source-in';
				ctx2.fillStyle = color;
				ctx2.fillRect(0,0,img.width,img.height);
				
				img.____colorVariants[color] = canvas;
				if (img.____colorVariants.length > 100) {
					img.____colorVariants = null;
				}
			}
			
			ctx.drawImage(canvas, x, y);
		ctx.restore();
	}
	
	return Media;
}) ();