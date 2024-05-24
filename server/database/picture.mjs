import {
  databaseConnect,
} from './database_utlilites.mjs';

export async function getPictures() {
  const db = await databaseConnect;
  return db.all('SELECT * FROM Pictures');
}

export async function uploadPicture(UUID, pictureURL, altText, activityID) {
  const db = await databaseConnect;
  await db.run('INSERT INTO Pictures VALUES (?,?,?)', [
    UUID,
    pictureURL,
    altText,
  ]);
  await db.run('INSERT INTO PictureActivitiesRelation VALUES (?,?)', [
    UUID,
    activityID,
  ]);
}

export async function getPictureFromID(UUID) {
  const db = await databaseConnect;
  return db.get('SELECT url FROM pictures WHERE picture_id = ?', UUID);
}

export async function getPicturesOfActivity(UUID) {
  const db = await databaseConnect;
  return db.all('SELECT picture_id FROM PictureActivitiesRelation WHERE activity_id = ?', UUID);
}

export async function deletePictureFromActivity(pictureID, activityID) {
  const db = await databaseConnect;
  console.log(await getPicturesOfActivity(activityID));
  if (await getPicturesOfActivity(activityID).length === 0) {
    // the picture isnt realated to any activity
    await db.run(
      'DELETE FROM Pictures WHERE picture_id = ?',
      pictureID);
    return;
  }
  await db.run(
    'DELETE FROM PictureActivitiesRelation WHERE picture_id = ? AND activity_id = ? ',
    pictureID, activityID);
}
