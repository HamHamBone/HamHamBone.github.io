(function() {
	
	let songElements = document.getElementsByClassName('song');

	let preloadPause = new Image();
	preloadPause.src = 'pause.png';

	console.log(songElements.length);

	let buttons = []
	let songs = [];

	let synth = new beepbox.Synth();

	for (songElement of songElements) {
		let playButton = new Image();
		playButton.src = 'play.png';
		playButton.className = 'playbutton'
		
		let title = document.createElement('span');
		title.innerHTML = ' ' + songElement.innerHTML;
		
		songElement.innerHTML = '';
		
		songElement.appendChild(playButton);
		songElement.appendChild(title);
		
		console.log(songElement);
		
		buttons.push(playButton);
		songs.push(songElement);
		
		songElement.__isPlaying = false;
		
		(function(playButton, songElement) {
			playButton.addEventListener('click', function() {

				for (let bttn of buttons) {
					bttn.src = 'play.png';
				}
			
				if (!songElement.__isPlaying) {
					synth.setSong(songElement.dataset.song);
					synth.snapToBar(0);
					synth.play();
					
					playButton.src = 'pause.png';
					songElement.__isPlaying = true;
				} else {
					synth.pause();
					playButton.src = 'play.png';
					songElement.__isPlaying = false;
				}
				
				for (let song of songs) {
					if (song != songElement) {
						song.__isPlaying = false;
					}
				}
			});
		}) (playButton, songElement);
		
	}
	
}) ();