import { displayCategoryPage } from './pages/category-page/category.mjs';
import { displayDashboardPage } from './pages/dashboard/dashboard.mjs';
import { displayPlaylistPage } from './pages/playlist-page/playlist.mjs';
import { displayProfiles } from './pages/profile-page/profile.mjs';

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
    const background = document.createElement('main');
    background.classList.add('popup-background');
    background.id = 'background';

    const activtyList = document.createElement('ul');
    activtyList.id = 'activtyList';
    activtyList.classList.add('create-popup');
    const newActivty = document.createElement('li');
    newActivty.id = 'newActivtyPopup';
    newActivty.classList.add('popup-item');
    newActivty.textContent = 'create new activity';

    const newPlaylist = document.createElement('li');
    newPlaylist.id = 'newPlaylistPopup';
    newPlaylist.classList.add('popup-item');
    newPlaylist.textContent = 'create new playlist';

    const container = document.querySelector('body');

    container.prepend(background);
    background.append(activtyList);
    activtyList.append(newActivty);
    activtyList.append(newPlaylist);

    document
      .querySelector('#newActivtyPopup')
      .addEventListener('click', displayNewActivityMenu);
    document
      .querySelector('#newPlaylistPopup')
      .addEventListener('click', displayNewPlaylistMenu);
    document.querySelector('#background').addEventListener('click', () => {
      document.querySelector('#background').remove();
    });
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
document.querySelector('#profile').addEventListener('click', displayProfiles);

// document.querySelector("#dashboard").addEventListener("click", displayDashboardPage) no dashboard

if ("serviceWorker" in navigator) {
  //https://www.youtube.com/watch?v=WbbAPfDVqfY
  navigator.serviceWorker.register("serviceworker.mjs").then(registration => {
    console.log("registered service worker")
  }).catch(error => {
    console.log("service worker registration failed")
    console.log(error)
  })
}

await displayCategoryPage()
