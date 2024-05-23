import { isLocalStorageEmpty, user } from "./utilities.mjs";
const online = navigator.onLine
export const PLAYLIST_KEY = 'playlist';
export async function getPlaylist(UUID) {
  if (user() && online) {
    // checks if the user is logged in to an account
    const response = await fetch(`playlist/${UUID}`);
    if (response.ok) {
      const playlist = await response.json();
      console.log("playlist", playlist)
      if (playlist.playlistDetails !== undefined) {
        // if the activity is on the server
        console.log("fetched from server for localdb update", playlist);
        // create playlist JSON HERE
        // SQL playlist always makes sure its in ascending order
        const itemsArray = playlist.activites.map((item) => item.activity_id);
        console.log(itemsArray);
        const playlistJSON = {
          title: playlist.playlistDetails.title,
          items: itemsArray,
          sets: playlist.playlistDetails.sets,
          exercise_rest_time: playlist.playlistDetails.exercise_rest_time,
          rest_sets_time: playlist.playlistDetails.rest_sets_time,
          duration_string: playlist.playlistDetails.duration_string
        };

        // save/update the playlist locally
        await savePlaylist(UUID, playlistJSON.title, playlistJSON.items, playlistJSON.sets, playlistJSON.exercise_rest_time, playlistJSON.rest_sets_time, true, playlistJSON.duration_string);
        return playlistJSON;
      }
    }
  }
  if (isLocalStorageEmpty(PLAYLIST_KEY)) {
    // create new JSON for local localStorage
    throw new Error('local storage is empty');
  }
  const cachedActivites = JSON.parse(localStorage[PLAYLIST_KEY]);
  try {
    getTags(this.entryID, ACTIVTIES_KEY)
    return cachedActivites[UUID];
  } catch (e) {
    throw new Error(` no activity matching ${UUID} ID within local storage`);
  }
}

export async function savePlaylist(UUID, title, items, sets, restDuration, setRestDuration, fromServer, durationString = "", finishedNumber = 0) {
  if (user() && online && !fromServer) {
    // checks if the user is logged in to an account
    const payload = {
      UUID,
      title,
      items,
      createdBy: user(),
      sets,
      exercise_rest_time: restDuration,
      rest_sets_time: setRestDuration,
      duration_string: durationString
    };
    console.log('playload', payload);

    const playlistResponse = await fetch('playlist/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('running next');

    const attachUserResponse = await fetch(`users/${user()}/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playlist_id: UUID, finished_number : finishedNumber }),
    });
  } else {
    // queue it for upload when you go online/sign in
    // mark the activity as not server saved maybe
  }
  if (isLocalStorageEmpty(PLAYLIST_KEY)) {
    // create new JSON for local localStorage
    localStorage[PLAYLIST_KEY] = JSON.stringify({});
  }
  const newPlaylist = {
    title,
    items,
    durationString,
    finishedNumber
  };
  const cachedPlaylists = JSON.parse(localStorage[PLAYLIST_KEY]);
  cachedPlaylists[UUID] = newPlaylist;
  localStorage[PLAYLIST_KEY] = JSON.stringify(cachedPlaylists);
}
