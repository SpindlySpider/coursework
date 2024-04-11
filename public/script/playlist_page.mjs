import { newPlaylistMenu } from '../web_componets/new-playlist-menu/new_playlist_menu.mjs';
import {
  PLAYLIST_KEY,
  USER_KEY,
  changeSelectedNavbar,
  getActivtyFromID,
  getAllCustomActivites,
  getPlaylist,
  user,
} from '../web_componets/utilities.mjs';
const el = {};
function prepareHandles() {
  el.main = document.querySelector('#main-content');
  el.navbar = document.querySelector('#navbar');
}

export async function displayPlaylistPage() {
  changeSelectedNavbar('#workout-playlist');
  if (document.querySelector('bottom-sheet-menu')) {
    // already have a menu on display
    return;
  }
  const menu = document.createElement('ul');
  menu.id = 'playlist-items';
  const customActivties = document.createElement('h1');
  customActivties.classList.add('menu-title');
  customActivties.textContent = 'playlist page';
  el.main.appendChild(menu);
  menu.append(customActivties);

  // need to see from local storage incase your offline
  const playlists = await fetch(`/users/${user()}/playlists`).then((res) => {
    return res.json();
  });
  console.log(playlists);
  for (let item of playlists.data) {
    // extract out the playlist feature to error check
    const playlistDetails = await fetch(`playlist/${item.playlist_id}`).then(
      (res) => {
        return res.json();
      },
    );
    console.log(playlistDetails, item);
    const container = document.createElement('li');
    container.classList.add('category-item');
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    const entry = document.createElement('h2');
    entry.textContent = playlistDetails.title[0].title;
    entry.dataset.id = item.playlist_id;
    entry.classList.add('menu-item');

    entry.addEventListener('click', async () => {
      await editPlaylist(entry);
    });

    menu.append(container);
    container.append(entry);
  }
}
function startTimer(entry) {
  const main = document.querySelector('#main-content');
  main.textContent = '';

  const timer = document.createElement('timer-component');
  const playlist = getPlaylist(entry.dataset.id);
  const workoutItems = [];
  for (let id of playlist.items) {
    workoutItems.push(getActivtyFromID(id));
  }
  timer.timerList = workoutItems;
  timer.customTile = playlist.title;
  main.append(timer);
  console.log(workoutItems);
  console.log(timer.timerList);
}

async function editPlaylist(entry) {
  console.log(`edit ${entry.dataset.id}`);
  let editMenu = document.createElement('new-playlist-menu');
  await editMenu.attachTemplate();
  el.main.append(editMenu);
  const playlist = await getPlaylist(entry.dataset.id);
  // since the on connect call back is async it ensure all of it is connected
  console.log('playlist', playlist.title.title);
  editMenu.activityItems = playlist.items;
  editMenu.nameInput.value = playlist.title.title;
  editMenu.UUID = entry.dataset.id;
  editMenu.playlistCreationTool();
  editMenu.setTitle(`edit ${playlist.title.title}`);
}
prepareHandles();
