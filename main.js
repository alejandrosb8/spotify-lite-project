import database from './database.js';
import { createMusicTab, createComment } from './js/UI.js';

const audio = document.getElementById('audio');
let isPause = true;

let currentSong = null;
let playlistLength = 0;
let idCurrentSong = null;
let repeatCurrentSong = false;

window.addEventListener('load', () => {
	loadSongs();
	addEvents();
});

function loadSongs() {
	const songList = document.getElementById('songList');
	database.songs.forEach((song, index) => {
		songList.appendChild(
			createMusicTab(song.id, song.name, song.author, song.thumbnail, index)
		);
		playlistLength++;
	});
}

function addEvents() {
	const songList = document.getElementById('songList');
	const playBtn = document.getElementById('play');
	const progressBar = document.getElementById('progressBar');
	const volumeBar = document.getElementById('volumeBar');
	const volumeBtn = document.getElementById('volume');
	const nextBtn = document.getElementById('next');
	const prevBtn = document.getElementById('prev');
	const likeBtn = document.getElementById('like');
	const repeatBtn = document.getElementById('repeat');
	const moreButton = document.getElementById('more');
	const addCommentInput = document.getElementById('addComment');
	const addCommentBtn = document.getElementById('addCommentBtn');
	const blacker = document.getElementsByClassName('blacker')[0];
	const timeText = document.getElementsByClassName('timeText')[0];

	progressBar.value = 0;

	songList.addEventListener('click', (e) => {
		playAudio(e.target);
		repeatCurrentSong = false;
		repeatBtn.classList.remove('blue');
	});

	playBtn.addEventListener('click', (e) => {
		pauseAndPlayAudio();
	});

	progressBar.addEventListener('input', (e) => {
		let getTime = (progressBar.value * audio.duration) / progressBar.max;
		getTime = getTime >= audio.duration ? audio.duration : getTime;
		audio.currentTime = getTime;
		audio.play();
	});
	audio.addEventListener('timeupdate', (e) => {
		let getTime = (audio.currentTime * progressBar.max) / audio.duration;
		getTime = getTime >= progressBar.max ? progressBar.max : getTime;
		progressBar.value = getTime;

		let minutes = Math.floor(audio.currentTime / 60);
		let seconds = Math.floor(audio.currentTime - minutes * 60);
		let newSecond = '';
		let newSecondMax = '';

		if (seconds.toString().length <= 1) {
			newSecond = '0' + seconds.toString();
		} else {
			newSecond = seconds.toString();
		}

		let minutesMax = Math.floor(audio.duration / 60);
		let secondsMax = Math.floor(audio.duration - minutesMax * 60);

		if (!minutesMax) {
			minutesMax = 0;
		}
		if (!secondsMax) {
			secondsMax = 0;
		}

		if (secondsMax.toString().length <= 1) {
			newSecondMax = '0' + secondsMax.toString();
		} else {
			newSecondMax = secondsMax.toString();
		}

		timeText.textContent = minutes + ':' + newSecond + '/' + minutesMax + ':' + newSecondMax;
	});
	audio.addEventListener('ended', (e) => {
		if (repeatCurrentSong == false) {
			currentSong++;
			currentSong = currentSong >= playlistLength ? 0 : currentSong;
		}
		changeSong(currentSong);
	});
	volumeBar.addEventListener('input', (e) => {
		audio.volume = volumeBar.value / 100;
	});
	volumeBtn.addEventListener('click', (e) => {
		const volumeDiv = document.getElementsByClassName('player__volume-popup')[0];
		volumeDiv.classList.toggle('visible');
	});
	nextBtn.addEventListener('click', (e) => {
		currentSong++;
		currentSong = currentSong >= playlistLength ? 0 : currentSong;
		changeSong(currentSong);
	});
	prevBtn.addEventListener('click', (e) => {
		if (audio.currentTime < 20) {
			currentSong--;
			currentSong = currentSong < 0 ? playlistLength - 1 : currentSong;
			changeSong(currentSong);
		} else {
			audio.currentTime = 0;
		}
	});
	likeBtn.addEventListener('click', (e) => {
		if (idCurrentSong) {
			database.songs.forEach((song) => {
				if (song.id == idCurrentSong) {
					if (likeBtn.classList.contains('blue')) {
						song.liked = false;
						likeBtn.classList.remove('blue');
					} else {
						song.liked = true;
						likeBtn.classList.add('blue');
					}
					return;
				}
			});
		}
	});
	repeatBtn.addEventListener('click', (e) => {
		if (idCurrentSong) {
			if (repeatBtn.classList.contains('blue')) {
				repeatBtn.classList.remove('blue');
				repeatCurrentSong = false;
			} else {
				repeatBtn.classList.add('blue');
				repeatCurrentSong = true;
			}
		}
	});
	moreButton.addEventListener('click', (e) => {
		if (idCurrentSong) {
			const mainPlayer = document.getElementsByClassName('main__player')[0];
			const thumbnail = document.getElementById('thumb');
			mainPlayer.classList.toggle('maximixed');
			thumbnail.classList.toggle('img-maximixed');
			blacker.classList.toggle('blackerVisible');
			const volumeDiv = document.getElementsByClassName('player__volume-popup')[0];
			if (mainPlayer.classList.contains('maximixed')) {
				volumeDiv.classList.add('visible');
			} else {
				volumeDiv.classList.remove('visible');
			}
		}
	});
	addCommentInput.addEventListener('input', (e) => {
		let getStringLength = addCommentInput.value.trim().length;
		if (addCommentInput.value && getStringLength > 0) {
			if (addCommentBtn.classList.contains('btnVisible') == false) {
				addCommentBtn.classList.add('btnVisible');
			}
		} else {
			if (addCommentBtn.classList.contains('btnVisible')) {
				addCommentBtn.classList.remove('btnVisible');
			}
		}
	});
	addCommentBtn.addEventListener('click', (e) => {
		database.songs.forEach((song) => {
			if (idCurrentSong == song.id) {
				song.comments.push(addCommentInput.value);
				const commentList = document.getElementById('commentList');
				commentList.appendChild(createComment(addCommentInput.value));
				addCommentInput.value = '';
				addCommentBtn.classList.remove('btnVisible');
			}
		});
	});
	blacker.addEventListener('click', (e) => {
		const mainPlayer = document.getElementsByClassName('main__player')[0];
		const thumbnail = document.getElementById('thumb');
		mainPlayer.classList.toggle('maximixed');
		thumbnail.classList.toggle('img-maximixed');
		blacker.classList.toggle('blackerVisible');
		const volumeDiv = document.getElementsByClassName('player__volume-popup')[0];
		if (mainPlayer.classList.contains('maximixed')) {
			volumeDiv.classList.add('visible');
		} else {
			volumeDiv.classList.remove('visible');
		}
	});
}
function changeSong(currentSong) {
	const songList = document.getElementsByClassName('main__tab');
	Array.from(songList).forEach((song) => {
		if (song.dataset.order == currentSong) {
			playAudio(song);
		}
	});
}
function playAudio(tab) {
	if (tab.dataset.id) {
		database.songs.forEach((song) => {
			if (tab.dataset.id == song.id) {
				loadAudio(song.path);
				const stopImg = document.getElementsByClassName('playing');
				Array.from(stopImg).forEach((element) => {
					element.classList.remove('playing');
				});
				const takeOffBlue = document.getElementsByClassName('songPlaying');
				Array.from(takeOffBlue).forEach((element) => {
					element.classList.remove('songPlaying');
				});
				tab.firstChild.classList.add('playing');
				tab.childNodes[1].firstChild.classList.add('songPlaying');
				currentSong = tab.dataset.order;
				idCurrentSong = tab.dataset.id;

				//player
				const thumbnail = document.getElementById('thumb');
				thumbnail.src = song.thumbnail;
				thumbnail.classList.add('showThumb');
				const playerName = document.getElementsByClassName('player__songName')[0];
				const playerAuthor = document.getElementsByClassName('player__songAuthor')[0];
				playerName.textContent = song.name;
				playerAuthor.textContent = song.author;

				const likedBtn = document.getElementById('like');

				if (song.liked == true) {
					likedBtn.classList.add('blue');
				} else {
					if (likedBtn.classList.contains('blue')) {
						likedBtn.classList.remove('blue');
					}
				}

				const commentList = document.getElementById('commentList');

				const comments = document.getElementsByClassName('comment');

				Array.from(comments).forEach((comment) => {
					comment.remove();
				});

				song.comments.forEach((comment) => {
					commentList.appendChild(createComment(comment));
				});

				const mainSection = document.getElementsByClassName('main__songs')[0];
				const playerSection = document.getElementsByClassName('main__player')[0];

				mainSection.style.marginBottom = getComputedStyle(playerSection).height;

				return;
			}
		});
	}
}

function loadAudio(source) {
	const playBtn = document.getElementById('play');
	const progressBar = document.getElementById('progressBar');
	audio.pause();
	audio.setAttribute('src', source);
	playBtn.classList.remove('btnPlay');
	playBtn.classList.add('btnPause');
	isPause = false;
	progressBar.value = 0;
	audio.play();
}
function pauseAndPlayAudio() {
	if (audio.getAttribute('src')) {
		const playBtn = document.getElementById('play');
		if (isPause) {
			audio.play();
			playBtn.classList.remove('btnPlay');
			playBtn.classList.add('btnPause');
			isPause = false;
		} else {
			audio.pause();
			playBtn.classList.add('btnPlay');
			playBtn.classList.remove('btnPause');
			isPause = true;
		}
	}
}
