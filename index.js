// import express from "express";
const express = require('express');
const app = express();
const port = 8080;
app.get('/', (request, response) => {
  app.use(express.static(__dirname + '/public/'));
  response.sendFile(__dirname + '/public/templates/bottomsheet.html');
  // response.sendFile(__dirname + '/public/index.html');
  // response.sendFile(__dirname + '/public/new_activity.html');
});
app.listen(port, function () {
  console.log('Server started at http://localhost:' + port);
});
