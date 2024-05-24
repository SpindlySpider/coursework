import { isLocalStorageEmpty, user } from "./utilities.mjs";

export const ACTIVTIES_KEY = 'activites';
const online = navigator.onLine; // implement later
export async function saveActivty(
  UUID,
  title,
  description,
  duration,
  fromServer,
  createdBy = null
) {
  // can be used to save over an entry, or add a new one to local db
  if (user() && online && !fromServer) {
    // checks if the user is logged in to an account
    const payload = {
      UUID,
      title,
      description,
      duration,
      createdBy: createdBy || user(),
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
    created_by: createdBy
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
          created_by: activity.created_by || user()
        };
        // save the activity locally
        await saveActivty(
          UUID,
          activityJSON.title,
          activityJSON.description,
          activityJSON.duration,
          true,
          activityJSON.created_by
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
    if (user() && online) {
      const payload = {
        UUID,
        title: cachedActivites[UUID].title,
        description: cachedActivites[UUID].description,
        duration: cachedActivites[UUID].duration,
        createdBy: cachedActivites[UUID].created_by ,
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
