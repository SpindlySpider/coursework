import { ACTIVTIES_KEY, getActivtyFromID } from "./activity-tools.mjs";
import { PLAYLIST_KEY, getPlaylist } from "./playlist-tools.mjs";

export const user = () => localStorage.getItem(USER_KEY) ?? null;
export const isLocalStorageEmpty = (keyName) => localStorage[keyName] === undefined;
export const USER_KEY = 'account';

export function createButton(name) {
  const button = document.createElement('button');
  button.textContent = name;
  return button
}

export async function deleteFromLocal(UUID, KEY) {
  if (localStorage[KEY] != null) {
    const tempStore = JSON.parse(localStorage[KEY]);
    if (KEY === ACTIVTIES_KEY) {
      // aslo delete this event from playlists that include it
      const playlistStorage = JSON.parse(localStorage[PLAYLIST_KEY]);
      for (let item of Object.keys(playlistStorage)) {
        if (playlistStorage[item].items.includes(UUID)) {
          console.log('includes', UUID);
          playlistStorage[item].items = playlistStorage[item].items.filter(
            (activity) => {
              return activity !== UUID;
            },
          );
        }
      }
      console.log(playlistStorage);
      localStorage[PLAYLIST_KEY] = JSON.stringify(playlistStorage);
      await fetch(`activities/${UUID}`, {
        method: 'DELETE',
      });
    } else if (KEY === PLAYLIST_KEY) {
      await fetch(`playlist/${UUID}`, {
        method: 'DELETE',
      });
    }
    delete tempStore[UUID];
    localStorage[KEY] = JSON.stringify(tempStore);
  } else {
    throw Error("event doesnt exist")
    // event doesnt exist
  }
}

export async function getUUID() {
  const newUUID = await fetch('/api/get_uuid').then((response) => {
    return response.json();
  });
  return newUUID.uuid;
}

export async function fetchTemplate(shadow, templateURL) {
  // taken from SSMB
  const res = await fetch(import.meta.resolve(templateURL));
  shadow.innerHTML = await res.text();
  shadow.append(shadow.querySelector('template').content.cloneNode(true));
}

export function formatedSeconds(seconds) {
  const hour = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hour * 3600) / 60);
  seconds = seconds - (hour * 3600 + minutes * 60);
  return { hour, minutes, seconds };
}

export function stringTimeToSeconds(str) {
  // takes stirng of value 00:00:00
  const timeArr = str.split(":")
  // [hour, mins , secs]
  let multipler = 3600
  let seconds = 0
  for (let time of timeArr) {
    seconds += time * multipler
    multipler = multipler / 60
  }
  return seconds
}

export function changeSelectedNavbar(navButtonSelector) {
  const lastNavSelected = document.querySelector('.nav-selected');
  const navCategories = document.querySelector(navButtonSelector);
  const main = document.querySelector('#main-content');
  if (lastNavSelected != null) {
    const icons = lastNavSelected.querySelectorAll(".icon")
    for (let item of icons) {
      item.classList.toggle("hidden")
    }
    lastNavSelected.classList.remove('nav-selected');
    lastNavSelected.classList.add('nav-unselected');
  }
  const icons = navCategories.querySelectorAll(".icon")
  for (let item of icons) {
    item.classList.toggle("hidden")
  }
  navCategories.classList.add('nav-selected');
  navCategories.classList.remove('nav-unselected');
  main.textContent = '';
}

export async function popuplateLocal() {
  if (!(user())) {
    return
  }
  const activities = await fetch(`users/${user()}/activities`).then((res) =>res.json());
  // popuplates all activities
  for (let item of activities.data) {
    await getActivtyFromID(item.activity_id);
  } // popuplates local storage with upto date sever infromation
  const playlists = await fetch(`users/${user()}/playlists`).then((res) =>res.json());
  // populates playlists
  for (let item of playlists.data) {
    await getPlaylist(item.playlist_id)
  }

}

export function getStringTimeFrom(seconds) {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
}

