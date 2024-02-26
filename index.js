// import express from "express";
const express = require("express");
let app = express();
const port = 8080;
app.use(express.static(__dirname + "/public/"));
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});
app.listen(port, function () {
  console.log('Server started at http://localhost:' + port);
});
