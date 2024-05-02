// created with the help of this video https://www.youtube.com/watch?v=0Hu27PoloYw
import express from 'express';
import * as playlist from '../../database/playlist.mjs';
import { uniqueID } from '../../database/database_utlilites.mjs';
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
  res.send({ playlistDetails: playlistTitle, activites });
}

async function addActivity(req, res) {
  await playlist.addActivityPlaylist(
    req.params.id,
    req.params.activityID,
    req.body.orderNumber,
  );
  res.status(200).send('success');
}
async function removeActivity(req, res) {
  await playlist.removeActivity(req.params.playlistID, req.params.activityID);
  res.status(200).send('success');
}

async function createPlaylist(req, res) {
  // creates data
  let UUID = crypto.randomUUID();
  // find a way to check if a id is already taken
  if (req.body.UUID) {
    UUID = req.body.UUID;
  }
  console.log(req.body);
  if (await uniqueID('Playlist', 'playlist_id', UUID)) {
    await playlist.newPlaylist(
      UUID,
      req.body.title,
      req.body.items,
      req.body.createdBy,
      req.body.sets,
      req.body.exercise_rest_time,
      req.body.rest_sets_time
    );
  } else {
    await playlist.updatePlaylist(
      UUID,
      req.body.title,
      req.body.items,
      req.body.createdBy,
      req.body.sets,
      req.body.exercise_rest_time,
      req.body.rest_sets_time
    );
  }

  res.status(200).send('success');
}
async function updatePlaylistItems(req, res) {
  // find a way to check if a id is already taken
  const UUID = req.body.UUID;
  if (req.body.UUID) {
    UUID = req.body.UUID;
  }
  await playlist.updatePlaylist(
    UUID,
    req.body.title,
    req.body.items,
    req.body.createdBy,
  );
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
router.post('/', express.json(), createPlaylist);
router.put('/:playlistID', express.json(), updatePlaylistItems);
router.delete('/:playlistID/:activityID', express.json(), removeActivity);
router.delete('/:id', deletePlaylist);
