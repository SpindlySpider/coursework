import { generateUUID } from '../server_utilities.js';
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

export async function getPicturesOfActivity(UUID){
  const db = await databaseConnect;
  return db.all('SELECT picture_id FROM PictureActivitiesRelation WHERE activity_id = ?', UUID);

}

export async function deletePicture(UUID) {
  const db = await databaseConnect;
  await db.run(
    'DELETE FROM Pictures WHERE picture_id = ?',
    UUID,)
  await db.run(
    'DELETE FROM PictureActivitiesRelation WHERE picture_id = ?',
    UUID,)
}

