import { newPlaylistMenu } from '../web_componets/new_playlist_menu.mjs';
import { getActivtyFromID, getPlaylist } from '../web_componets/utilities.mjs';

export function displayPlaylistPage() {
  // const dummyPlaylist = {
  //   UUID: { title: 'basic workout', list: ['UUID1', 'UUID2'] },
  // };
  // localStorage['playlist'] = JSON.stringify(dummyPlaylist);
  console.log('playlist');
  const main = document.querySelector('#main-content');
  main.textContent = '';
  const menu = document.createElement('ul');
  const customActivties = document.createElement('h1');
  customActivties.textContent = 'playlist page';
  main.appendChild(menu);
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
  const playlist = getPlaylist(entry.dataset.id);
  console.log(playlist);
  console.log(playlist.items);
  let editMenu = document.createElement('new-playlist-menu');
  const main = document.querySelector('#main-content');
  main.append(editMenu);
  editMenu.nameInput.value = playlist.title;
  editMenu.activityItems = playlist.items;
  editMenu.playlistCreationTool();
  editMenu.UUID = entry.dataset.id;
  editMenu.setTitle(`edit ${playlist.title}`);
}
