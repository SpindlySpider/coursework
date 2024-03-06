const checkLocalStorageEmpty = (keyName) => localStorage[keyName] != null;

function saveActivty() {
  // can be used to save over an entry, or add a new one to local db
  const empty = checkLocalStorageEmpty('activties');

  const title = this.shadow.querySelector('#activityNameInput').value;
  const description = this.shadow.querySelector('#descriptionInput').value;
  const duration = this.shadow.querySelector('#timeInput').value;
  const UUID = crypto.randomUUID();
  if (empty) {
    // create new JSON for local localStorage
    localStorage.activites = JSON.stringify({});
  }
  const newActivty = {
    UUID: {
      title,
      description,
      duration,
    },
  };
  const cachedActivites = JSON.parse(localStorage.activites);
  if (Object.keys(cachedActivites).includes(UUID)) {
    // might need to make a new cache if empty but logic should be the same
    cachedActivites[UUID] = newActivty;
  }
  cachedActivites[UUID] = newActivty;
  // save in local cache then send to the server
  // must request UUID from server
  // fall back if server is not reachable is service worker gerneates new UUID
  // create JSON object to store
  // must implment error checking
  localStorage.activites = JSON.stringify(cachedActivites);
}
