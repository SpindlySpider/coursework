// created with the help of this video https://www.youtube.com/watch?v=0Hu27PoloYw
import express from 'express';
import * as user from '../../database/users.mjs';
export const router = express.Router();

async function sendUsersList(req, res) {
  // gets data
  const users = await user.getUsers();
  res.send({ data: users });
}

async function getUser(req, res) {
  // gets data
  const username = await user.getUserFromID(req.params.id);
  res.send({ data: username });
}
async function getUserPlaylists(req, res) {
  const playlists = await user.getUserPlaylist(req.params.id);
  res.send({ data: playlists });
}

async function updateUser(req, res) {
  // update data
  try {
    console.log("updating user line 25 user.mjs")
    await user.updateExerciseTime(req.params.id, req.body.exercise_time);
    await user.updateWorkoutsFinished(req.params.id, req.body.workouts_finished);
    res.sendStatus(200);
  } catch (error) {
    console.log("error on line 30",error)
    res.sendStatus(404);
  }
}

async function removeUser(req, res) {
  // delete data
  await user.deleteUser(req.params.id);
  res.sendStatus(200);
}
async function removePlaylist(req, res) {
  await user.deleteUser(req.params.id, req.params.playlist_id);
  res.sendStatus(200);
}
async function getUserActivities(req, res) {
  const activities = await user.getUserActivties(req.params.id);
  res.send({ data: activities });
}

async function postUserActivities(req, res) {
  // console.log(req.params.id, req.body.activity_id);
  await user.postUserActivties(req.params.id, req.body.activity_id);
  res.sendStatus(200);
}
async function postUserPlaylists(req, res) {
  // console.log(req.params.id, req.body.activity_id);
  await user.postUserPlaylist(req.params.id, req.body.playlist_id);
  res.sendStatus(200);
}

async function postUser(req, res) {
  // creates data
  await user.addUser(req.body.username);
  res.sendStatus(200)
}

router.get('/', sendUsersList);
router.get('/:id', getUser);
router.get('/:id/playlists', getUserPlaylists);
router.get('/:id/activities', getUserActivities);
router.put('/:id/update', express.json(), updateUser);
router.post('/:id/activities', express.json(), postUserActivities);
router.post('/:id/playlists', express.json(), postUserPlaylists);
router.post('/', postUser);
router.delete('/:id', removeUser);
router.delete('/:id/:playlist_id', removePlaylist);
