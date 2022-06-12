import database from './database.js';
import { createMusicTab } from './js/UI.js';

window.addEventListener('load', () => {
	loadSongs();
});

function loadSongs() {
	const songList = document.getElementById('songList');
	database.songs.forEach((song) => {
		songList.appendChild(createMusicTab(song.name, song.author, song.thumbnail));
	});
}
