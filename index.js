import { router as userRouter } from './server/routes/users/users.mjs';
import { router as playlistRouter } from './server/routes/playlist/playlist.mjs';
import { router as activtiyRouter } from './server/routes/activity/activity.mjs';
import { router as tagRouter } from './server/routes/tags/tags.mjs';
import { generateUUID } from './server/server_utilities.js';
import { router as pictureRouter } from "./server/routes/pictures/picture.mjs"
import express from 'express';
const app = express();
const port = 8080;

app.use(express.static('public'));

app.use('/tags', tagRouter);
app.use('/users', userRouter);
app.use('/playlist', playlistRouter);
app.use('/activities', activtiyRouter);
app.use('/picture', pictureRouter);
app.get('/api/get_uuid', (request, response) => {
  response.setHeader("Cache-Control", "no-store")
  response.send({ uuid: generateUUID() });
});

app.listen(port, function() {
  console.log('Server started at http://localhost:' + port);
});
