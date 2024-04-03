import { newPlaylistMenu } from '../web_componets/new-playlist-menu/new_playlist_menu.mjs';
import {
  PLAYLIST_KEY,
  getActivtyFromID,
  getAllCustomActivites,
  getPlaylist,
} from '../web_componets/utilities.mjs';
const el = {};
function prepareHandles() {
  el.main = document.querySelector('#main-content');
  el.navbar = document.querySelector('#navbar');
}

export function displayPlaylistPage() {
  el.main.textContent = '';
  const menu = document.createElement('ul');
  const customActivties = document.createElement('h1');
  customActivties.classList.add('menu-title');
  customActivties.textContent = 'playlist page';
  el.main.appendChild(menu);
  menu.append(customActivties);

  const playlists = getAllCustomActivites(PLAYLIST_KEY);
  if (playlists == null || Object.keys(playlists).length == 0) {
    let emptyMessage = document.createElement('p');
    emptyMessage.textContent =
      'press the + at the bottom to make a new playlist';
    menu.append(emptyMessage);
    return;
  }

  const localPlaylists = JSON.parse(localStorage['playlist']);
  for (let item of Object.keys(JSON.parse(localStorage['playlist']))) {
    //extract out the playlist feature to error check
    const container = document.createElement('li');
    container.classList.add('category-item');
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    const entry = document.createElement('h2');
    entry.textContent = localPlaylists[item].title;
    entry.dataset.id = item;
    entry.classList.add('menu-item');

    entry.addEventListener('click', () => {
      edit_playlist(entry);
    });

    menu.append(container);
    container.append(entry);

    if (localPlaylists[item].items.length != 0) {
      const play = document.createElement('button');
      play.textContent = 'start';
      container.append(play);
      play.addEventListener('click', () => {
        startTimer(entry);
      });
    }
  }
}
function startTimer(entry) {
  const main = document.querySelector('#main-content');
  main.textContent = '';

  let timer = document.createElement('timer-component');
  const playlist = getPlaylist(entry.dataset.id);
  let workoutItems = [];
  for (let id of playlist.items) {
    workoutItems.push(getActivtyFromID(id));
  }
  timer.timerList = workoutItems;
  timer.customTile = playlist.title;
  main.append(timer);
  console.log(workoutItems);
  console.log(timer.timerList);
}

async function edit_playlist(entry) {
  console.log(`edit ${entry.dataset.id}`);
  let editMenu = document.createElement('new-playlist-menu');
  await editMenu.attachTemplate();
  el.main.append(editMenu);
  const playlist = await getPlaylist(entry.dataset.id);
  // since the on connect call back is async it ensure all of it is connected
  editMenu.activityItems = playlist.items;
  editMenu.nameInput.value = playlist.title;
  editMenu.UUID = entry.dataset.id;
  editMenu.playlistCreationTool();
  editMenu.setTitle(`edit ${playlist.title}`);
}
prepareHandles();
