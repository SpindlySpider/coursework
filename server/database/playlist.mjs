import { generateUUID } from '../server_utilities.js';
import { databaseConnect } from './database_utlilites.mjs';
// used for accessing user releated fields in the db

export async function getPlaylists() {
  const db = await databaseConnect;
  return db.all('SELECT * FROM Playlist');
}

export async function getPlaylistFromID(UUID) {
  const db = await databaseConnect;
  return db.all('SELECT title FROM Playlist WHERE playlist_id = ?', UUID);
}

export async function newPlaylist(title, createdByID) {
  const db = await databaseConnect;
  const UUID = generateUUID();
  await db.run('INSERT INTO Playlist VALUES (?,?,?)', [
    UUID,
    title,
    createdByID,
  ]);
}

export async function addActivityPlaylist(playlistID, activityID) {
  const db = await databaseConnect;
  await db.run(
    'INSERT INTO PlaylistActivityRelation VALUES (?,?)',
    playlistID,
    activityID,
  );
}
export async function deletePlaylist(playlistID) {
  const db = await databaseConnect;
  await db.run('DELETE FROM Playlist WHERE playlist_id = ?', playlistID);
}
export async function getPlaylistActivities(PlaylistID) {
  const db = await databaseConnect;
  return await db.all(
    'SELECT activity_id FROM PlaylistActivityRelation WHERE playlist_id = ?',
    PlaylistID,
  );
}

export async function deleteActivityFromPlaylist(playlistID, activityID) {
  const db = await databaseConnect;
  await db.run(
    'DELETE FROM PlaylistActivityRelation WHERE playlist_id = ? AND activity_id = ?',
    playlistID,
    activityID,
  );
}
