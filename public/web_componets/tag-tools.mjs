import { ACTIVTIES_KEY } from "./activity-tools.mjs";
import { isLocalStorageEmpty, user } from "./utilities.mjs";
import { PLAYLIST_KEY } from "./playlist-tools.mjs";
export const TAG_KEY = 'tag';

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
    if (cachedTags[tag].length === 0) {
      // delete tag
      cachedTags[tag] === null
    }
  }
  localStorage[TAG_KEY] = JSON.stringify(cachedTags);
  // save it locally here
}
