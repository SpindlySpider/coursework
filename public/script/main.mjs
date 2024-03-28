import { displayCategoryPage } from './category_scripts/category_page.mjs';
import { displayPlaylistPage } from './playlist_page.mjs';
function displayNewActivityMenu() {
  document.querySelector('#newActivtyPopup').remove();
  const main = document.querySelector('#main-content');
  const menu = document.createElement('new-activty-menu');
  main.appendChild(menu);
}
function displayNewEntryOptions() {
  if (document.querySelector('#newActivtyPopup') == null) {
    const newActivty = document.createElement('li');
    newActivty.id = 'newActivtyPopup';
    newActivty.textContent = 'create new activity';
    newActivty.classList.add('right-floating-notification');
    const container = document.querySelector('#app-container');
    container.append(newActivty);
    document
      .querySelector('#newActivtyPopup')
      .addEventListener('click', displayNewActivityMenu);
  } else {
    document.querySelector('#newActivtyPopup').remove();
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
