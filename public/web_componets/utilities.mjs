const isLocalStorageEmpty = (keyName) => localStorage[keyName] === undefined;
export const ACTIVTIES_KEY = 'activites';
export const PLAYLIST_KEY = 'playlist';
export const USER_KEY = 'account';
export function saveActivty(UUID, title, description, duration) {
  // can be used to save over an entry, or add a new one to local db
  // duration should be in ms
  const loggedIn = false; // implement later
  if (loggedIn) {
    // execute server authentication here? and send the event to the server
  }
  if (isLocalStorageEmpty(ACTIVTIES_KEY)) {
    // create new JSON for local localStorage
    localStorage.activites = JSON.stringify({});
  }
  const newActivty = {
    title,
    description,
    duration,
  };
  const cachedActivites = JSON.parse(localStorage.activites);
  cachedActivites[UUID] = newActivty;
  // save in local cache then send to the server
  // must request UUID from server
  // fall back if server is not reachable is service worker gerneates new UUID
  // create JSON object to store
  // must implment error checking
  localStorage.activites = JSON.stringify(cachedActivites);
}
export function deleteFromLocal(UUID, KEY) {
  if (localStorage[KEY] != null) {
    let tempStore = JSON.parse(localStorage[KEY]);
    if (KEY == ACTIVTIES_KEY) {
      // aslo delete this event from playlists that include it
      let playlistStorage = JSON.parse(localStorage[PLAYLIST_KEY]);
      for (let item of Object.keys(playlistStorage)) {
        if (playlistStorage[item].items.includes(UUID)) {
          console.log('includes', UUID);
          playlistStorage[item].items = playlistStorage[item].items.filter(
            (activity) => {
              return activity != UUID;
            },
          );
        }
      }
      console.log(playlistStorage);
      localStorage[PLAYLIST_KEY] = JSON.stringify(playlistStorage);
    }
    delete tempStore[UUID];
    localStorage[KEY] = JSON.stringify(tempStore);
  } else {
    // event doesnt exist
  }
}

export async function getActivtyFromID(UUID) {
  const online = true; // implement later
  if (user() && online) {
    // checks if the user is logged in to an account
    const response = await fetch(`activities/${UUID}`);
    if (response.ok) {
      let activity = await response.json();
      if (activity.data[0] !== undefined) {
        // if the activity is on the server
        activity = activity.data[0];
        const activityJSON = {
          title: activity.title,
          description: activity.description,
          duration: activity.duration,
        };
        // save the activity locally
        saveActivty(
          UUID,
          activityJSON.title,
          activityJSON.description,
          activityJSON.duration,
        );
        return activityJSON;
      }
    }
  }
  // fall back to local storage if you cant find it on server
  if (isLocalStorageEmpty(ACTIVTIES_KEY)) {
    // create new JSON for local localStorage
    throw new Error('local storage is empty');
  }
  const cachedActivites = JSON.parse(localStorage[ACTIVTIES_KEY]);
  try {
    // send the activity to the server
    if (online) {
      const payload = {
        UUID,
        title: cachedActivites[UUID].title,
        description: cachedActivites[UUID].description,
        duration: cachedActivites[UUID].duration,
        createdBy: user(),
      };
      await fetch('activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await fetch(`users/${user()}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity_id: UUID }),
      });
      // do a post request to userACTIVITYRelation to add it to the users accoutn
    }
    return cachedActivites[UUID];
  } catch (e) {
    throw new Error('no activity matching ID within local storage');
  }
}
export async function getUUID() {
  const newUUID = await fetch('/api/get_uuid').then((response) => {
    return response.json();
  });
  return newUUID.uuid;
}

export function getAllCustomActivites(KEY) {
  if (isLocalStorageEmpty(KEY)) {
    return null;
  }
  const customActivites = JSON.parse(localStorage[KEY]);
  return customActivites;
  // returns a list of activtites
}
export async function fetchTemplate(shadow, templateURL) {
  // taken from SSMB
  const res = await fetch(import.meta.resolve(templateURL));
  shadow.innerHTML = await res.text();
  shadow.append(shadow.querySelector('template').content.cloneNode(true));
}
export function savePlaylist(UUID, title, items) {
  if (isLocalStorageEmpty(PLAYLIST_KEY)) {
    // create new JSON for local localStorage
    localStorage[PLAYLIST_KEY] = JSON.stringify({});
  }
  const newPlaylist = {
    title,
    items,
  };
  const cachedPlaylists = JSON.parse(localStorage[PLAYLIST_KEY]);
  cachedPlaylists[UUID] = newPlaylist;
  localStorage[PLAYLIST_KEY] = JSON.stringify(cachedPlaylists);
}

export function getPlaylist(UUID) {
  const loggedIn = false; // implement later
  if (loggedIn) {
    // execute server authentication here? and get event from server
  }
  if (isLocalStorageEmpty(PLAYLIST_KEY)) {
    // create new JSON for local localStorage
    throw new Error('local storage is empty');
  }
  const cachedActivites = JSON.parse(localStorage[PLAYLIST_KEY]);
  try {
    return cachedActivites[UUID];
  } catch (e) {
    throw new Error('no activity matching ID within local storage');
  }
}
export function formatedSeconds(seconds) {
  const hour = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hour * 3600) / 60);
  seconds = seconds - (hour * 3600 + minutes * 60);
  return { hour, minutes, seconds };
}
export function changeSelectedNavbar(navButtonSelector) {
  const lastNavSelected = document.querySelector('.nav-selected');
  const navCategories = document.querySelector(navButtonSelector);
  const main = document.querySelector('#main-content');
  if (lastNavSelected != null) {
    lastNavSelected.classList.remove('nav-selected');
    lastNavSelected.classList.add('nav-unselected');
  }
  navCategories.classList.add('nav-selected');
  navCategories.classList.remove('nav-unselected');
  main.textContent = '';
}

export const user = () => localStorage.getItem(USER_KEY) ?? null;
