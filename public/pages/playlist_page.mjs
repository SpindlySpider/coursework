import { getActivtyFromID } from '../web_componets/activity-tools.mjs';
import {
  getPlaylist,
} from '../web_componets/playlist-tools.mjs';
import { getStringTimeFrom, user, createButton, changeSelectedNavbar } from '../web_componets/utilities.mjs';


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
    const response = await fetch(`playlist/${item.playlist_id}`).then(
      (res) => res.json(),
    );
    const playlistDetails = response.playlistDetails
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
    console.log("title", playlistDetails)
    entry.textContent = playlistDetails.title;
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
    if (response.activites.length !== 0) {
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
  console.log("timerdata", playlist)
  const workoutItems = [];
  if (playlist.sets < 1) {
    playlist.sets = 1
  }
  let rest = { title: "rest", description: "rest between excerise", duration: playlist.exercise_rest_time }
  if (playlist.exercise_rest_time < 1) {
    rest = null
  }
  for (let i = 0; i < playlist.sets; i++) {
    for (let id of playlist.items) {
      let item = await getActivtyFromID(id)
      item["UUID"] = id
      workoutItems.push(item);
      if (rest != null) {
        // probbay a more efficent way of doing this as it checkes very time if rest is null

        workoutItems.push(rest)
      }
    }
    if (playlist.exercise_rest_time > 0) {
      // make sure that rest and rest are not next to each other
      workoutItems.pop()
    }
    if (playlist.rest_sets_time > 0 && i != playlist.sets - 1) {
      // add set rests unless it is the final set
      workoutItems.push({ title: "set rest", description: "rest between set", duration: playlist.rest_sets_time })
    }
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
  editMenu.nameInput.value = playlist.title;
  editMenu.setInput.value = playlist.sets
  editMenu.restTimer.value = getStringTimeFrom(playlist.exercise_rest_time)
  editMenu.setRestTimer.value = getStringTimeFrom(playlist.rest_sets_time)
  editMenu.UUID = entry.dataset.id;
  console.log("playlist title", playlist.title)
  editMenu.headerTitle = `edit ${playlist.title}`
  editMenu.playlistCreationTool();
}
prepareHandles();
