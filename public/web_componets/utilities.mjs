const isLocalStorageEmpty = (keyName) => localStorage[keyName] === undefined;
const ACTIVTIES_KEY = 'activites';
const PLAYLIST_KEY = 'playlist';
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

export function getActivtyFromID(UUID) {
  const loggedIn = false; // implement later
  if (loggedIn) {
    // execute server authentication here? and get event from server
  }
  if (isLocalStorageEmpty(ACTIVTIES_KEY)) {
    // create new JSON for local localStorage
    throw new Error('local storage is empty');
  }
  const cachedActivites = JSON.parse(localStorage.activites);
  try {
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

export function getAllCustomActivites() {
  if (isLocalStorageEmpty(ACTIVTIES_KEY)) {
    return null;
  }
  const customActivites = JSON.parse(localStorage[ACTIVTIES_KEY]);
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
