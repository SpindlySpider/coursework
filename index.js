// import express from "express";
const express = require("express");
let app = express();
const port = 8080;
app.get("/", (request, response) => {
  app.use(express.static(__dirname + "/public/"));
  response.sendFile(__dirname + "/public/new_activity.html");
});
app.listen(port, function () {
  console.log('Server started at http://localhost:' + port);
});
