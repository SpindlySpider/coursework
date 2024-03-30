import { newPlaylistMenu } from '../web_componets/new-playlist-menu/new_playlist_menu.mjs';
import { getActivtyFromID, getPlaylist } from '../web_componets/utilities.mjs';
const el = {};
function prepareHandles() {
  el.main = document.querySelector('#main-content');
}
export function displayPlaylistPage() {
  console.log('playlist');
  el.main.textContent = '';
  const menu = document.createElement('ul');
  const customActivties = document.createElement('h1');
  customActivties.textContent = 'playlist page';
  el.main.appendChild(menu);
  menu.append(customActivties);
  const localPlaylists = JSON.parse(localStorage['playlist']);
  for (let item of Object.keys(JSON.parse(localStorage['playlist']))) {
    //extract out the playlist feature to error check
    const container = document.createElement('li');
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    const entry = document.createElement('p');
    const play = document.createElement('button');
    entry.textContent = localPlaylists[item].title;
    play.textContent = 'start';
    entry.dataset.id = item;
    entry.classList.add('bottomsheet-content-item');
    entry.addEventListener('click', () => {
      edit_playlist(entry);
    });
    play.addEventListener('click', () => {
      startTimer(entry);
    });
    menu.append(container);
    container.append(entry);
    container.append(play);
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
  el.main.append(editMenu);
  const playlist = await getPlaylist(entry.dataset.id);
  // since the on connect call back is async it ensure all of it is connected
  editMenu.activityItems = playlist.items;
  editMenu.nameInput.value = playlist.title;
  editMenu.UUID = entry.dataset.id;
  editMenu.setTitle(`edit ${playlist.title}`);
  editMenu.playlistCreationTool();
}
prepareHandles();
