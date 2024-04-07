// created with the help of this video https://www.youtube.com/watch?v=0Hu27PoloYw
import express from 'express';
import * as activity from '../../database/activity.mjs';
export const router = express.Router();

async function getActivites(req, res) {
  // gets data
  const activities = await activity.getActivites();
  res.send({ data: activities });
}

async function getActivity(req, res) {
  // gets data
  const activityName = await activity.getActivitiesFromID(req.params.id);
  res.send({ data: activityName });
}

async function updateActivites(req, res) {
  // update data
  try {
    await activity.updateActivity(
      req.params.id,
      req.body.title,
      req.body.description,
      req.body.duration,
      req.body.createdBy,
    );
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(404);
  }
}
async function postActivity(req, res) {
  // creates data
  await activity.newActivites(req.body.title, req.body.createdBy);
  res.sendStatus(500);
}
async function removeActivity(req, res) {
  // delete data
  await activity.deleteActivity(req.params.id);
  res.sendStatus(200);
}

router.get('/', getActivites);
router.get('/:id', getActivity);
router.put('/:id', express.json(), updateActivites);
router.post('/', postActivity);
router.delete('/:id', removeActivity);
