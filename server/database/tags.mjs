import { databaseConnect, uniqueID } from './database_utlilites.mjs';

export async function postTags(tagName, UUID, KEY) {
  const db = await databaseConnect;
  console.log('saving', tagName, 'to', UUID, 'under:');
  if (await uniqueID('Tags', 'tag_name', tagName)) {
    // if this tag doesnt exist
    await db.run('INSERT INTO Tags VALUES (?)', [tagName]);
    // make it
  }
  (await KEY) === 'playlist'
    ? await postTagPlaylist(tagName, UUID)
    : await postTagActivity(tagName, UUID);
  // attach the id of the playlist or activitiy
}
async function postTagPlaylist(tagName, UUID) {
  console.log('playlist');
  const db = await databaseConnect;
  await db.run('DELETE FROM PlaylistTagRelation WHERE playlist_id = ?', [UUID]);
  await db.run('INSERT INTO PlaylistTagRelation VALUES (?,?)', [tagName, UUID]);
}

async function postTagActivity(tagName, UUID) {
  console.log('activitiy');
  const db = await databaseConnect;
  // delete prevouis tags
  await db.run('DELETE FROM ActivityTagRelation WHERE activity_id = ?', [UUID]);
  // place the new tags
  await db.run('INSERT INTO ActivityTagRelation VALUES (?,?)', [tagName, UUID]);
}

export async function deleteTag(tagName) {
  const db = await databaseConnect;
  await db.run('DELETE FROM ActivityTagRelation WHERE tagName = ?', [tagName]);
  await db.run('DELETE FROM PlaylistTagRelation WHERE tagName = ?', [tagName]);
  await db.run('DELETE FROM Tags WHERE tag_name = ?', [tagName]);
}

export async function getTagPlaylist(UUID) {
  // get all tags assocaited with playlist
  const db = await databaseConnect;
  return await db.all(
    'SELECT * FROM PlaylistTagRelation WHERE playlist_id = "?"',
    [`"${UUID}"`],
  );
}

export async function getTags() {
  const db = await databaseConnect;
  return await db.all(
    'SELECT a.tag_name,activity_id , playlist_id FROM ActivityTagRelation as "a" INNER JOIN PlaylistTagRelation as "p" ON p.tag_name = a.tag_name',
  );
}

export async function getTagActivity(UUID) {
  // get all tags assocaited with acitivites
  console.log(UUID);
  const db = await databaseConnect;
  return await db.all(
    'SELECT * FROM ActivityTagRelation WHERE activity_id = ?',
    [`"${UUID}"`],
  );
}

export async function getActivityTag(tagName) {
  // get all activities assocaited with tag name
  const db = await databaseConnect;
  return await db.all('SELECT * FROM ActivityTagRelation WHERE tag_name = ?', [
    `"${tagName}"`,
  ]);
}

export async function getPlaylistTag(tagName) {
  // get all playlist assocaited with tag name
  const db = await databaseConnect;
  return await db.all('SELECT * FROM PlaylistTagRelation WHERE tag_name = ?', [
    `"${tagName}"`,
  ]);
}
