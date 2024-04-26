import {
  changeSelectedNavbar,
  createButton,
  getActivtyFromID,
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
      (res) => res.json(),
    );
    console.log(playlistDetails, item);
    const container = document.createElement('li');
    container.style.display = 'flex';
    container.style.overflowWrap = "anywhere"
    container.style.flexDirection = 'row';
    container.style.width = '90vw';
    container.style.border = "0.5vw solid var(--border-colour)"
    container.style.borderRadius = "1vw"
    container.style.padding = "2vw"
    const entry = document.createElement('h2');
    entry.textContent = playlistDetails.title[0].title;
    entry.style.width = "75%";
    entry.dataset.id = item.playlist_id;
    entry.classList.add('menu-item');
    const edit = createButton("edit");

    menu.append(container);
    container.append(entry);
    container.append(edit);
    edit.addEventListener('click', async () => {
      await editPlaylist(entry);
    });
    if (playlistDetails.activites.length !== 0) {
      const play = createButton("start");
      container.append(play);
      play.addEventListener('click', async () => {
        await startTimer(entry);
      });
    }
  }
}
async function startTimer(entry) {
  const main = document.querySelector('#main-content');
  main.textContent = '';

  const timer = document.createElement('timer-component');
  const playlist = await getPlaylist(entry.dataset.id);
  // const playlist = await fetch(`playlist/${entry.dataset.id}`).then((res) =>
  //   res.json(),
  // );
  // console.log(playlist.activites);
  console.log(playlist);

  const workoutItems = [];
  for (let id of playlist.items) {
    workoutItems.push(await getActivtyFromID(id));
  }
  timer.timerList = workoutItems;
  timer.customTile = playlist.title.title;
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
