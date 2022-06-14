function createMusicTab(id, name, author, thumbnail, index) {
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

	tab.dataset.id = id;
	tab.dataset.order = index;

	return tab;
}
function createComment(comment) {
	const commentElement = document.createElement('li');
	commentElement.classList.add('comment');
	const textContainer = document.createElement('div');
	const userImg = document.createElement('img');
	userImg.src = '../resources/icons/account-circle.png';
	const userName = document.createElement('p');
	userName.classList.add('userName');
	userName.textContent = 'User';
	const userComment = document.createElement('p');
	userComment.classList.add('userComment');
	userComment.textContent = comment;

	textContainer.append(userName, userComment);
	commentElement.append(userImg, textContainer);

	return commentElement;
}

export { createMusicTab, createComment };
