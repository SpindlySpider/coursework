import { isLocalStorageEmpty, user } from "./utilities.mjs";

const online = navigator.onLine; // implement later
export const ACTIVTIES_KEY = 'activites';
export async function saveActivty(
  UUID,
  title,
  description,
  duration,
  fromServer,
) {
  // can be used to save over an entry, or add a new one to local db
  if (user() && online && !fromServer) {
    // checks if the user is logged in to an account
    const payload = {
      UUID,
      title,
      description,
      duration,
      createdBy: user(),
    };
    const activityResponse = await fetch('activities/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!activityResponse.ok) {
      throw Error("cannot post activity to server")
    }
    const attachUserResponse = await fetch(`users/${user()}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activity_id: UUID }),
    });
    if (!attachUserResponse.ok) {
      throw Error("cannot post activity to server")
    }
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


export async function getActivtyFromID(UUID) {
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

export function getAllCustomActivites(KEY) {
  if (isLocalStorageEmpty(KEY)) {
    return null;
  }
  const customActivites = JSON.parse(localStorage[KEY]);
  return customActivites;
  // returns a list of activtites
}
