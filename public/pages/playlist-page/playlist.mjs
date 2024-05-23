import { getActivtyFromID } from '/../../web_componets/activity-tools.mjs';
import {
  getPlaylist,
} from '../../../web_componets/playlist-tools.mjs';
import { getStringTimeFrom, user, createButton, changeSelectedNavbar, fetchFragment } from '../../web_componets/utilities.mjs';

const el = {};
function prepareHandles() {
  el.main = document.querySelector('#main-content');
  el.navbar = document.querySelector('#navbar');
}

export async function displayPlaylistPage() {
  changeSelectedNavbar('#workout-playlist');
  el.main.textContent = ""
  if (document.querySelector('bottom-sheet-menu')) {
    // already have a menu on display
    return;
  }
  const title = await fetchFragment(import.meta.resolve("./playlist-list.inc"))
  el.main.append(title);
  const menu = el.main.querySelector("#playlist-items")
  // need to see from local storage incase your offline
  const playlists = await fetch(`/users/${user()}/playlists/`).then(res => res.json());

  for (let item of playlists.data) {
    // extract out the playlist feature to error check
    const response = await fetch(`playlist/${item.playlist_id}`).then(
      (res) => res.json(),
    );
    const playlistDetails = response.playlistDetails
    // create a entry for each playlist entry
    const playlistItem = await fetchFragment(import.meta.resolve("./playlist-item.inc"))
    const entry = playlistItem.querySelector("h2")
    const edit = playlistItem.querySelector("button")
    const duration = playlistItem.querySelector("#duration")
    console.log(playlistDetails)
    let count = 0
    for (let item of response.activites) {
      item = await fetch(`activities/${item.activity_id}`).then(res => res.json())
      console.log(item.data[0].duration)
      count += item.data[0].duration
    }
    duration.textContent = getStringTimeFrom(count)
    entry.textContent = playlistDetails.title
    entry.dataset.id = item.playlist_id
    edit.addEventListener('click', async () => {
      await editPlaylist(entry);
    });
    if (response.activites.length !== 0) {
      const start = playlistItem.querySelector("#start");
      start.style.display = "flex"
      start.addEventListener('click', async () => {
        await startTimer(entry);
      });
    }
    menu.append(playlistItem);
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
}

async function editPlaylist(entry) {
  console.log(`edit ${entry.dataset.id}`);
  let editMenu = document.createElement('new-playlist-menu');
  await editMenu.attachTemplate();
  el.main.append(editMenu);
  const playlist = await getPlaylist(entry.dataset.id);
  // since the on connect call back is async it ensure all of it is connected
  console.log('playlist', playlist.title);
  editMenu.activityItems = playlist.items;
  editMenu.nameInput.value = playlist.title;
  editMenu.setInput.value = playlist.sets
  // editMenu.restTimer.value = getStringTimeFrom(playlist.exercise_rest_time)
  // editMenu.setRestTimer.value = getStringTimeFrom(playlist.rest_sets_time)
  editMenu.UUID = entry.dataset.id;
  console.log("playlist title", playlist.title)
  editMenu.headerTitle = `edit ${playlist.title}`
  await editMenu.playlistCreationTool();
  editMenu.setRestTimer.setDuration(playlist.rest_sets_time)
  editMenu.restTimer.setDuration(playlist.exercise_rest_time)
}
prepareHandles();
