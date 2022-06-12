import database from './database.js';
import { createMusicTab } from './js/UI.js';

window.addEventListener('load', () => {
	loadSongs();
	addEvents();
});

function loadSongs() {
	const songList = document.getElementById('songList');
	database.songs.forEach((song) => {
		songList.appendChild(createMusicTab(song.id, song.name, song.author, song.thumbnail));
	});
}

function addEvents() {
	const songList = document.getElementById('songList');
	songList.addEventListener('click', (e) => {
		if (e.target.dataset.id) {
			database.songs.forEach((song) => {
				if (e.target.dataset.id == song.id) {
					playAudio(song.path);
					return;
				}
			});
		}
	});
}
function playAudio(source) {
	var audio = new Audio(source);
	audio.play();
}
