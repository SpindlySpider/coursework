// created with the help of this video https://www.youtube.com/watch?v=0Hu27PoloYw
import express from 'express';
import {
  addUser,
  deleteUser,
  getUserFromID,
  getUsers,
  updateUsername,
} from '../../database/users.mjs';
export const router = express.Router();

router.get('/', async (req, res) => {
  // gets data
  const users = await getUsers();
  res.send({ data: users });
});

router.get('/:id', async (req, res) => {
  // gets data
  const username = await getUserFromID(req.params.id);
  res.send({ data: username });
});

router.put('/:id', express.json(), async (req, res) => {
  try {
    await updateUsername(req.params.id, req.body);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(404);
  }
  // updates data
});

router.post('/', async (req, res) => {
  // creates data
  await addUser(req.body.username);
  res.sendStatus(500);
});

router.delete('/:id', async (req, res) => {
  // delete data
  await deleteUser(req.params.id);
  res.sendStatus(200);
});
