const isLocalStorageEmpty = (keyName) => localStorage[keyName] === undefined;
export const ACTIVTIES_KEY = 'activites';
export const PLAYLIST_KEY = 'playlist';
export const USER_KEY = 'account';
export const TAG_KEY = 'tag';



export function createButton(name) {
  const button = document.createElement('button');
  button.textContent = name;
  return button
}

export async function saveActivty(
  UUID,
  title,
  description,
  duration,
  fromServer,
) {
  // can be used to save over an entry, or add a new one to local db
  const online = true; // implement later
  if (user() && online && !fromServer) {
    // checks if the user is logged in to an account
    const payload = {
      UUID,
      title,
      description,
      duration,
      createdBy: user(),
    };
    console.log('palyload', payload);
    const activityResponse = await fetch('activities/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const attachUserResponse = await fetch(`users/${user()}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activity_id: UUID }),
    });
  } else {
    // queue it for upload when you go online/sign in
    // mark the activity as not server saved maybe
  }
  if (isLocalStorageEmpty(ACTIVTIES_KEY)) {
    // create new JSON for local localStorage
    localStorage[ACTIVTIES_KEY] = JSON.stringify({});
  }
  const newActivty = {
    title,
    description,
    duration,
  };
  const cachedActivites = JSON.parse(localStorage.activites);
  cachedActivites[UUID] = newActivty;
  localStorage.activites = JSON.stringify(cachedActivites);
}

export async function uploadPhoto(activityID, photoContent, altText) {
  const photoResponse = await fetch(`picture/${activityID}/${altText}`, {
    method: 'POST',
    body: photoContent,
  });
  if (photoResponse.ok) {
    return "success"
  }
  else {
    return "error"
  }
}

export async function getPhotos(activityID) {
  const photoResponse = await fetch(`picture/activity/${activityID}`).then((response) => response.json()
  );
  console.log("getphoto:", photoResponse)
  const list = []
  for (let photo of photoResponse.picture_ids) {
    console.log(photo)
    list.push(photo)
  }
  return list
}

export async function getPhotoFromID(pictureID) {
  const photoResponse = await fetch(`picture/${pictureID}`);
  if (photoResponse.ok) {
    console.log("photos", photoResponse)
    return await fetch(photoResponse.url)
  }
  else {
    return { status: "error couldnt get photo" }
  }
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
        await saveActivty(
          UUID,
          activityJSON.title,
          activityJSON.description,
          activityJSON.duration,
          true,
        );
        return activityJSON;
        cachedTags;
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
    if (user() && online) {
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
export async function savePlaylist(UUID, title, items, sets, restDuration, setRestDuration, fromServer) {
  const online = true; // implement later
  if (user() && online && !fromServer) {
    // checks if the user is logged in to an account
    const payload = {
      UUID,
      title,
      items,
      createdBy: user(),
      sets,
      exercise_rest_time: restDuration,
      rest_sets_time: setRestDuration
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
      body: JSON.stringify({ playlist_id: UUID }),
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
  };
  const cachedPlaylists = JSON.parse(localStorage[PLAYLIST_KEY]);
  cachedPlaylists[UUID] = newPlaylist;
  localStorage[PLAYLIST_KEY] = JSON.stringify(cachedPlaylists);
}

export async function getPlaylist(UUID) {
  const online = true; // implement later
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
          rest_sets_time: playlist.playlistDetails.rest_sets_time
        };

        // save/update the playlist locally
        await savePlaylist(UUID, playlistJSON.title, playlistJSON.items, playlistJSON.sets, playlistJSON.exercise_rest_time, playlistJSON.rest_sets_time, true);
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
  const online = true
  if (user() && online) {
    return
  }
  const activities = await fetch(`users/${user()}/activities`).then((res) => {
    return res.json();
  });
  for (let item of activities.data) {
    await getActivtyFromID(item.activity_id);
  } // popuplates local storage with upto date sever infromation
}
function getTagKey(KEY) {
  // this is for the get tags function to get the fetch destiontion
  if (KEY === ACTIVTIES_KEY) {
    return "activity"
  }
  else if (KEY === PLAYLIST_KEY) {
    return "playlist"
  }
  else {
    return "tag"
  }
}

export async function getTags(UUID, KEY) {
  // if the key is playist or activities it will fetch all tags or them
  const online = true
  const fetchDestination = getTagKey(KEY)
  if (user() && online) {
    if (fetchDestination === "tag") {
      // get all the activities and playlists for this tagname 
      const response = await fetch(`tags/${UUID}`)
      if (response.ok) {
        const playlistActivities = await response.json()
        const activities = []
        const playlists = []
        for (let tag of playlistActivities) {
          if (tag.activity_id === null) {
            //playlist
            playlists.push(tag.playlist_id)
            //update local
            saveTags(tag.playlist_id, PLAYLIST_KEY, [UUID], true)
          }
          else {
            // activitiy
            activities.push(tag.activity_id)
            //update local
            saveTags(tag.activity_id, ACTIVTIES_KEY, [UUID], true)
          }
        }
        const tagJSON = { tag_name: UUID, activities, playlists }
        return tagJSON
      }
      else {
        throw new Error(`couldnt get acitivities and playlists for tag : ${UUID}`)
      }
    }
    else if (fetchDestination === "activity") {
      // activitiy
      // update local storage with tags from server
      const response = await fetch(`tags/${UUID}/activity/get-tags`)
      if (response.ok) {
        const activities = await response.json()
        saveTags(UUID, ACTIVTIES_KEY, activities.data, true)
        return activities.data
      }
    }
    else {
      // plalist
      const response = await fetch(`tags/${UUID}/activity/get-tags`)
      const playlist = await response.json()
      console.log(playlist.data)
      saveTags(UUID, ACTIVTIES_KEY, playlist.data, true)
      return playlist.data
    }

    // fall back to getting from local storage
    // const response = await(fetch(`tags/`))
  }
}

export async function saveTags(UUID, KEY, tags, fromServer) {
  const online = true; // implement later
  const saveDestination = KEY === ACTIVTIES_KEY ? 'activity' : 'playlist';
  if (user() && online && !fromServer) {
    // checks if the user is logged in to an account
    const payload = { tag_list: tags };
    const response = await fetch(`tags/${UUID}/${saveDestination}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }
  for (let tagName of tags) {
    if (isLocalStorageEmpty(TAG_KEY)) {
      // create new JSON for local localStorage
      localStorage[TAG_KEY] = JSON.stringify({});
    }
    const cachedTags = JSON.parse(localStorage[TAG_KEY]);
    if (cachedTags[tagName] === undefined) {
      const newTag = {
        [ACTIVTIES_KEY]: [],
        [PLAYLIST_KEY]: [],
      };
      cachedTags[tagName] = newTag;
    }
    cachedTags[tagName][KEY].push(UUID);
    localStorage[TAG_KEY] = JSON.stringify(cachedTags);
    // save it locally here
  }

}
export function getStringTimeFrom(seconds) {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
}

export function cleanLocalTag(UUID, KEY) {
  // removes this UUID from all instances of tags
  const cleanDestination = KEY === ACTIVTIES_KEY ? ACTIVTIES_KEY : PLAYLIST_KEY;
  if (isLocalStorageEmpty(TAG_KEY)) {
    // create new JSON for local localStorage
    localStorage[TAG_KEY] = JSON.stringify({});
    return;
  }
  const cachedTags = JSON.parse(localStorage[TAG_KEY]);
  for (let tag of Object.keys(cachedTags)) {
    console.log('key', tag);
    console.log('local', cachedTags[tag][cleanDestination]);
    cachedTags[tag][cleanDestination] = cachedTags[tag][
      cleanDestination
    ].filter((item) => item !== UUID);
  }
  localStorage[TAG_KEY] = JSON.stringify(cachedTags);
  // save it locally here
}
export const user = () => localStorage.getItem(USER_KEY) ?? null;
