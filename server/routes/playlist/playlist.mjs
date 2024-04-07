// created with the help of this video https://www.youtube.com/watch?v=0Hu27PoloYw
import express from 'express';
import * as playlist from '../../database/playlist.mjs';
export const router = express.Router();

async function getPlaylists(req, res) {
  // gets data
  const playlists = await playlist.getPlaylists();
  res.send({ data: playlists });
}

async function getPlaylist(req, res) {
  // gets data
  const playlistTitle = await playlist.getPlaylistFromID(req.params.id);
  const activites = await playlist.getPlaylistActivities(req.params.id);
  res.send({ title: playlistTitle, activites });
}

async function addActivity(req, res) {
  await playlist.addActivityPlaylist(req.params.id, req.params.activityID);
  res.status(200).send('success');
}
async function removeActivity(req, res) {
  await playlist.removeActivity(req.params.playlistID, req.params.activityID);
  res.status(200).send('success');
}

async function createPlaylist(req, res) {
  // creates data
  await playlist.newPlaylist(req.body.title, req.body.userID);
  res.status(200).send('success');
}
async function deletePlaylist(req, res) {
  // delete data
  await playlist.deletePlaylist(req.params.id);
  res.sendStatus(200);
}

router.get('/', getPlaylists);
router.get('/:id', getPlaylist);
router.put('/:playlistID/:activityID', express.json(), addActivity);
router.post('/:id', createPlaylist);
router.delete('/:playlistID/:activityID', express.json(), removeActivity);
router.delete('/:id', deletePlaylist);
