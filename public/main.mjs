import { displayCategoryPage } from './script/category_page.mjs';
import { displayPlaylistPage } from './script/playlist_page.mjs';
function displayNewActivityMenu() {
  document.querySelector('#activtyList').remove();
  const main = document.querySelector('#main-content');
  const menu = document.createElement('new-activty-menu');
  main.appendChild(menu);
}
function displayNewPlaylistMenu() {
  document.querySelector('#activtyList').remove();
  const main = document.querySelector('#main-content');
  const menu = document.createElement('new-playlist-menu');
  main.appendChild(menu);
}
function displayNewEntryOptions() {
  if (document.querySelector('#activtyList') == null) {
    const activtyList = document.createElement('ul');
    activtyList.id = 'activtyList';
    activtyList.classList.add('right-floating-notification');
    const newActivty = document.createElement('li');
    newActivty.id = 'newActivtyPopup';
    newActivty.textContent = 'create new activity';

    const newPlaylist = document.createElement('li');
    newPlaylist.id = 'newPlaylistPopup';
    newPlaylist.textContent = 'create new playlist';
    newPlaylist.style.transform;

    const container = document.querySelector('#app-container');
    container.append(activtyList);
    activtyList.append(newActivty);
    activtyList.append(newPlaylist);
    document
      .querySelector('#newActivtyPopup')
      .addEventListener('click', displayNewActivityMenu);
    document
      .querySelector('#newPlaylistPopup')
      .addEventListener('click', displayNewPlaylistMenu);
  } else {
    // document.querySelector('#newActivtyPopup').remove();
    document.querySelector('#activtyList').remove();
  }
}

document
  .querySelector('#new-entry')
  .addEventListener('click', displayNewEntryOptions);
document
  .querySelector('#catagories')
  .addEventListener('click', displayCategoryPage);
document
  .querySelector('#workout-playlist')
  .addEventListener('click', displayPlaylistPage);
