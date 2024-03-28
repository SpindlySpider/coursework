import {
  fetchTemplate,
  getActivtyFromID,
} from '../web_componets/utilities.mjs';

export function displayPlaylistPage() {
  // const dummyPlaylist = {
  //   UUID: { title: 'basic workout', list: ['UUID1', 'UUID2'] },
  // };
  // localStorage['playlist'] = JSON.stringify(dummyPlaylist);
  console.log('playlist');
  const main = document.querySelector('#main-content');
  const menu = document.createElement('ul');
  const customActivties = document.createElement('h1');
  customActivties.textContent = 'playlist page';
  main.appendChild(menu);
  menu.append(customActivties);
  const localPlaylists = JSON.parse(localStorage['playlist']);
  for (let item of Object.keys(JSON.parse(localStorage['playlist']))) {
    //extract out the playlist feature to error check
    const entry = document.createElement('li');
    entry.textContent = localPlaylists[item].title;
    entry.classList.add('bottomsheet-content-item');
    menu.append(entry);
  }
  // put the web componenet here
}
