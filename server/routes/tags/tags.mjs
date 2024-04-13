import express from 'express';
import * as tag from '../../database/tags.mjs';
export const router = express.Router();

async function getTagActivity(req, res) {
  const tags = await tag.getTagActivity(req.params.activity_id);
  res.send({ data: tags });
}

async function getActivityTag(req, res) {
  const activities = await tag.getActivityTag(req.params.tag_name);
  res.send({ data: activities });
}

async function getTagPlaylist(req, res) {
  const tags = await tag.getTagPlaylist(req.params.playlist_id);
  res.send({ data: tags });
}

async function getPlaylistTag(req, res) {
  const playlist = await tag.getPlaylistTag(req.params.tag_name);
  res.send({ data: playlist });
}

async function postPlaylist(req, res) {
  await tag.postTags(req.body.tag_name, req.params.id, 'playlist');
  res.status(200).send('tagged this playlist');
}

async function postActivity(req, res) {
  await tag.postTags(req.body.tag_name, req.params.id, 'activity');
  res.status(200).send('tagged this activity');
}
async function deleteTag(req, res) {
  await tag.deleteTag(req.params.tag_name);
  res.status(200).send('deleted tag');
}
async function getTags(req, res) {
  const state = await tag.getTags();
  res.send({ data: state });
}

router.get('/:activity_id/activity/get-tags', express.json(), getTagActivity);
router.get('/', getTags);
router.get('/:tag_name/get-activities', express.json(), getActivityTag);
router.get('/:playlist_id/playlist/get-tags', express.json(), getTagPlaylist);
router.get('/:tag_name/get-playlist', express.json(), getPlaylistTag);
router.post('/:id/playlist', express.json(), postPlaylist);
router.post('/:id/activity', express.json(), postActivity);
router.delete('/:tag_name', deleteTag);
