import express from 'express';
import * as picture from '../../database/picture.mjs';
import EventEmitter from "events";
import { multibodyParser } from './multibody_praser.mjs';
import path from 'path';
export const router = express.Router();

async function sendActivityPictures(req, res) {
  const picsIDs = await picture.getPicturesOfActivity(req.params.id)
  // console.log(picsIDs)
  for (let picID of picsIDs) {
    let pictureURL = await picture.getPictureFromID(picID.picture_id)
    // router.use(express.static(`${import.meta.dirname}/../../photos`))
    res.sendFile(path.resolve(pictureURL.url))
    console.log(import.meta.dirname)
  }
}

async function postPicture(req, res) {
  // MAKE SURE THAT YOU CAN ONLY UPLOAD JPG PNG AND THAT
  // payload should be {altText, filetype, file}
  const emitter = new EventEmitter()
  const id = crypto.randomUUID()
  console.log("body", req)
  await multibodyParser(req, res, id, emitter)
  emitter.on("upload-success", (url) => {
    picture.uploadPicture(id, url, req.params.altText, req.params.id)
    res.status(200).send("file successfully uploaded")
  })
}
async function deletePictureFromActivity(req,res){
  
}

router.get('/activity/:id', sendActivityPictures);
router.post('/:id/:altText', postPicture);
router.get("/pictures")
router.delete("/:pictureID",deletePictureFromActivity)

