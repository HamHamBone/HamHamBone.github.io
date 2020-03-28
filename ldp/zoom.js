let images = document.querySelectorAll('.portimg');

let fullscreen = document.getElementById('fullscreen');
let bigImage = document.getElementById('bigimage');

fullscreen.style.display = 'none';

console.log(images);

for (let image of images) {
	
	//(function(image) {
		image.addEventListener('click', function() {
			fullscreen.style.display = 'flex';
			bigImage.src = image.src;
		});
	//}) (image);
}

bigimage.addEventListener('click', function() {
	fullscreen.style.display = 'none';
});