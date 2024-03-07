const isLocalStorageEmpty = (keyName) => localStorage[keyName] === undefined;
const ACTIVTIES_KEY = 'activites';
export function saveActivty(UUID, title, description, duration) {
  // can be used to save over an entry, or add a new one to local db
  // duration should be in ms
  const loggedIn = false; // implement later
  if (loggedIn) {
    // execute server authentication here? and send the event to the server
  }
  if (isLocalStorageEmpty('activites')) {
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
  if (isLocalStorageEmpty('activites')) {
    // create new JSON for local localStorage
    throw new Error('local storage is empty');
  }
  const cachedActivites = JSON.parse(localStorage.activites);
  try {
    return JSON.parse(cachedActivites[UUID]);
  } catch (e) {
    throw new Error('no activity matching ID within local storage');
  }
}
