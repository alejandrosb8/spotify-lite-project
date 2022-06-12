function createMusicTab(name, author, thumbnail) {
	const tab = document.createElement('div');
	tab.classList.add('main__tab');

	const songThumbnail = document.createElement('img');
	songThumbnail.src = thumbnail;

	const flexDiv = document.createElement('div');
	const songName = document.createElement('p');
	songName.classList.add('songName');
	songName.textContent = name;

	const songAuthor = document.createElement('p');
	songAuthor.classList.add('songAuthor');
	songAuthor.textContent = author;

	flexDiv.append(songName, songAuthor);
	tab.append(songThumbnail, flexDiv);

	return tab;
}

export { createMusicTab };
