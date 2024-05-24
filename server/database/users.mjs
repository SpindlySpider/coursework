import { generateUUID } from '../server_utilities.js';
import { databaseConnect } from './database_utlilites.mjs';
// used for accessing user releated fields in the db

export async function getUsers() {
  const db = await databaseConnect;
  return db.all('SELECT * FROM Users');
}

export async function getUserFromID(UUID) {
  const db = await databaseConnect;
  return db.all('SELECT username FROM users WHERE user_id = ?', UUID);
}

export async function addUser(userName) {
  const db = await databaseConnect;
  const UUID = generateUUID();
  await db.run('INSERT INTO users VALUES (?,?)', [UUID, userName]);
}

export async function updateUsername(UUID, username) {
  const db = await databaseConnect;
  const statement = await db.run(
    'UPDATE Users SET username = ? WHERE user_id = ?',
    [username, UUID],
  );
  if (statement.changes === 0) throw new Error('user not found');
}
export async function getUserPlaylist(UUID) {
  const db = await databaseConnect;
  return db.all(
    'SELECT playlist_id FROM UserPlaylistRelation WHERE user_id = ?',
    UUID,
  );
}

export async function getUserActivties(UUID) {
  const db = await databaseConnect;
  return db.all(
    'SELECT activity_id FROM UserActivityRelation WHERE user_id = ?',
    UUID,
  );
}

export async function deleteUser(id) {
  const db = await databaseConnect;
  db.run('DELETE FROM users WHERE id = ?', id);
}
export async function removeUserPlaylist(id, playlistID) {
  const db = await databaseConnect;
  db.run(
    'DELETE FROM UserPlaylistRelation WHERE user_id = ? AND playlist_id = ?',
    id,
    playlistID,
  );
}
export async function postUserActivties(userID, activityID) {
  const db = await databaseConnect;

  const unique = await db.all(
    'SELECT * FROM UserActivityRelation WHERE user_id = ? AND activity_id = ?',
    [userID, activityID],
  );

  if (unique.length !== 0) {
    return;
  }
  await db.run('INSERT INTO UserActivityRelation VALUES (?,?)', [
    userID,
    activityID,
  ]);
}

export async function postUserPlaylist(userID, playlistID) {
  const db = await databaseConnect;

  const unique = await db.all(
    'SELECT * FROM UserPlaylistRelation WHERE user_id = ? AND playlist_id = ?',
    [userID, playlistID],
  );

  if (unique.length !== 0) {
    return;
  }
  await db.run('INSERT INTO UserPlaylistRelation VALUES (?,?)', [
    userID,
    playlistID,
  ]);
}

export async function updateExerciseTime(userID, time, finishedNumber = 0) {
  const db = await databaseConnect;
  await db.run('UPDATE Users SET exercise_time = ? WHERE user_id = ?', [
    time,
    userID,
  ]);
}
export async function updateWorkoutsFinished(userID, number) {
  const db = await databaseConnect;
  await db.run('UPDATE Users SET workouts_finished = ? WHERE user_id = ?', [
    number,
    userID,
  ]);
}

export async function deleteUserPlaylist(playlistID) {
  const db = await databaseConnect;
  await db.run(
    'DELETE FROM UserPlaylistRelation WHERE playlist_id = ?',
    playlistID,
  );
}
