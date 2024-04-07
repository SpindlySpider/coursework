import { generateUUID } from '../server_utilities.js';
import { databaseConnect } from './database_utlilites.mjs';
// used for accessing user releated fields in the db
export async function getActivites() {
  const db = await databaseConnect;
  return db.all('SELECT * FROM Activities');
}

export async function getActivitiesFromID(UUID) {
  const db = await databaseConnect;
  return db.all('SELECT title FROM Activities WHERE activity_id = ?', UUID);
}

export async function newActivites(title, createdByID) {
  const db = await databaseConnect;
  const UUID = generateUUID();
  await db.run('INSERT INTO Activities VALUES (?,?,?)', [
    UUID,
    title,
    createdByID,
  ]);
}

export async function deleteActivity(UUID) {
  const db = await databaseConnect;
  await db.run('DELETE FROM Activities WHERE activity_id = ?', UUID);
}

export async function updateActivity(
  UUID,
  title,
  description,
  duration,
  createdBy,
) {
  const db = await databaseConnect;
  const statement = await db.run(
    'UPDATE Activities SET title = ?, description = ? , duration = ?, created_by = ? WHERE activity_id = ?',
    title,
    description,
    duration,
    createdBy,
    UUID,
  );
  if (statement.changes === 0) throw new Error('activity not found');
}
