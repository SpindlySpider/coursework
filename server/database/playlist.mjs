import { generateUUID } from '../server_utilities.js';
import {
  databaseConnect,
  uniqueID,
  uniqueOrderNumber,
} from './database_utlilites.mjs';
import { deleteUserPlaylist } from './users.mjs';
// used for accessing user releated fields in the db

export async function getPlaylists() {
  const db = await databaseConnect;
  return db.all('SELECT * FROM Playlist');
}

export async function getPlaylistFromID(UUID) {
  const db = await databaseConnect;
  return db.get('SELECT * FROM Playlist WHERE playlist_id = ?', UUID);
}

export async function updatePlaylist(
  UUID,
  title,
  items = null,
  createdByID = null,
  sets,
  restDuration,
  setRestDuration
) {
  const db = await databaseConnect;
  const statement = await db.run(
    'UPDATE Playlist SET title = ?, created_by = ? , sets = ? , exercise_rest_time =?,rest_sets_time = ? WHERE playlist_id = ?',
    [
      title,
      createdByID,
      sets,
      restDuration,
      setRestDuration, UUID],
  );
  await deletePlaylistActivities(UUID);
  if (items) {
    let index = 0;
    for (let item of items) {
      addActivityPlaylist(UUID, item, index);
      index++;
    }
  }
  if (statement.changes === 0) throw new Error('playlist not found');
}

export async function newPlaylist(
  UUID,
  title,
  items = null,
  createdByID = null,
  sets,
  restDuration,
  setRestDuration
) {
  const db = await databaseConnect;
  await db.run('INSERT INTO Playlist VALUES (?,?,?,?,?,?)', [
    UUID,
    title,
    createdByID,
    sets,
    restDuration,
    setRestDuration
  ]);
  if (items[0] !== null) {
    let index = 0;
    for (let item of items) {
      addActivityPlaylist(UUID, item, index);
      index++;
    }
  }
  // put activities into playlist relational database
}

export async function addActivityPlaylist(playlistID, activityID, orderNumber) {
  const db = await databaseConnect;
  if (await uniqueOrderNumber(playlistID, orderNumber)) {
    await db.run('INSERT INTO PlaylistActivityRelation VALUES (?,?,?)', [
      playlistID,
      activityID,
      orderNumber,
    ]);
  } else {
    await db.run(
      'UPDATE PlaylistActivityRelation SET playlist_id = ?, activity_id = ?, orderNumber = ? ',
      [playlistID, activityID, orderNumber],
    );
  }
}
export async function deletePlaylist(playlistID) {
  const db = await databaseConnect;
  await deletePlaylistActivities(playlistID);
  await db.run('DELETE FROM Playlist WHERE playlist_id = ?', playlistID);
  await deleteUserPlaylist(playlistID);
}
export async function deletePlaylistActivities(playlistID) {
  const db = await databaseConnect;
  await db.run(
    'DELETE FROM PlaylistActivityRelation WHERE playlist_id = ?',
    playlistID,
  );
}
export async function getPlaylistActivities(PlaylistID) {
  const db = await databaseConnect;
  // send all the data in correct order of order number
  return await db.all(
    'SELECT activity_id,orderNumber FROM PlaylistActivityRelation WHERE playlist_id = ? ORDER BY orderNumber ASC',
    [PlaylistID],
  );
}

export async function deleteActivityFromPlaylist(playlistID, activityID) {
  const db = await databaseConnect;
  await db.run(
    'DELETE FROM PlaylistActivityRelation WHERE playlist_id = ? AND activity_id = ?',
    [playlistID, activityID],
  );
}
