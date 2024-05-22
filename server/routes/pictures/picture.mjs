import express from 'express';
import * as picture from '../../database/picture.mjs';
import EventEmitter from "events";
import { multibodyParser } from './multibody_praser.mjs';
import path from 'path';
export const router = express.Router();

async function sendActivityPictures(req, res) {
  const picsIDs = await picture.getPicturesOfActivity(req.params.id)
  const idList = []
  for (let picID of picsIDs) {
    idList.push(picID.picture_id)
  }
  res.status(200).send({ picture_ids: idList })
}
async function getPictureFromPicID(req, res) {
  try {
    let pictureURL = await picture.getPictureFromID(req.params.id)
    res.set("pictureID", req.params.id)
    await res.sendFile(path.resolve(pictureURL.url))

  }
  catch{
    res.status(404).send({"status":"cannot find resource"})
  }
}

async function postPicture(req, res) {
  // MAKE SURE THAT YOU CAN ONLY UPLOAD JPG PNG AND THAT
  // payload should be {altText, filetype, file}
  const emitter = new EventEmitter()
  const id = crypto.randomUUID()
  await multibodyParser(req, res, id, emitter)
  emitter.on("upload-success", (url) => {
    picture.uploadPicture(id, url, req.params.altText, req.params.id)
    res.sendStatus(200)
  })
}
async function deletePictureFromActivity(req, res) {
  await picture.deletePictureFromActivity(req.params.picture_id, req.params.activity_id)
  res.sendStatus(200)

}

router.get('/activity/:id', sendActivityPictures);
router.get('/:id', getPictureFromPicID);
router.post('/:id/:altText', postPicture);
// router.get("/pictures")
router.delete("/:activity_id/:picture_id", deletePictureFromActivity)

