import express from 'express';
import * as picture from '../../database/picture.mjs';
import { generateUUID } from '../../server_utilities.js';
import { multibodyParser } from './multibody_praser.mjs';
export const router = express.Router();

async function sendActivityPictures(req, res) {
  const picsIDs = picture.getPicturesOfActivity(req.params.id)
  for (let picID of picsIDs) {
    let pictureURL = picture.getPictureFromID(picID)
    res.sendFile(pictureURL)
    console.log(import.meta.dirname)
  }
}

async function postPicture(req, res) {
  // MAKE SURE THAT YOU CAN ONLY UPLOAD JPG PNG AND THAT
  // SEND THE FILETYPE
  // payload should be {altText, filetype, file}
  // if (!req.files) {
  //   res.status(400).send("no file")
  //   console.log("recieved bad request")
  //   return
  // }
  // const pictureID = generateUUID()
  // const pictureURL = `${import.meta.dirname}/activity_pictures/${pictureID}${req.body.fileType}`
  console.log(req.files)
  multibodyParser(req, res)

  res.send(200)
  // req.file.mv()
  // await picture.uploadPicture(pictureID,pictureURL,req.body.altText,req.params.id)

}

router.get('/activity/:id', sendActivityPictures);
router.post('/:id', postPicture);

