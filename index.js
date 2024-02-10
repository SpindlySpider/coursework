const express = require("express");
const path = require('path');
let app = express();
const port = 3000;

app.use(express.static("./src/pages/"));
app.listen(port, function(){
  console.log("started application");
  console.log('Server started at http://localhost:' + port);
})
