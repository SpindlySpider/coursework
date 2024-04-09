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

export async function deleteUser(id) {
  const db = await databaseConnect;
  db.run('DELETE FROM users WHERE id = ?', id);
}
export async function removeUserPlaylist(id, playlistID) {
  const db = await databaseConnect;
  db.run(
    'DELETE FROM UserPlaylistRelation WHERE user_id = ? , playlist_id = ?',
    id,
    playlistID,
  );
}
