import { router as userRouter } from './server/routes/users/users.mjs';
import { generateUUID } from './server/server_utilities.js';
import express from 'express';
const app = express();
const port = 8080;

app.get('/', (request, response) => {
  app.use(express.static('public'));
  response.sendFile(`${import.meta.dirname}/public`);
});

app.use('/users', userRouter);
app.get('/api/get_uuid', (request, response) => {
  response.send({ uuid: generateUUID() });
});

app.listen(port, function () {
  console.log('Server started at http://localhost:' + port);
});
