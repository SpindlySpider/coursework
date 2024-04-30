import fs from "fs"
import { stringify } from "querystring";
export async function multibodyParser(req, res) {
  let requestString = stringify(req)
  requestString = requestString.replace(/\&/g, '\n')
  let bufferChunks = []
  let receivedFirstChunk = false
  console.log(req.rawHeaders)
  // const header = createHeadersFromRaw(req.rawHeaders)
  // const bounaries = getBoundary(header)


  req.on("data", (chunk) => {
    console.log("chunk", chunk)
    if (!receivedFirstChunk) {
      receivedFirstChunk = true
      console.log("got first chunck")
      // get filetype info out here
      // return
    }
    // console.log("chunk")
    bufferChunks.push(chunk)
  })

  req.on("end", () => {
    //store chunk
    const buffer = Buffer.from(Buffer.concat(bufferChunks),"utf8")
    // after the 4th line break
    logger(buffer, "chunk.txt")
  })
  logger(requestString, "logger.txt")
}

// function createHeadersFromRaw(rawHeaders) {
//   let headerJSON = {}
//   const keyList = []
//   const attributeList = []
//   // filter list into two things, headers and content
//   for (let i = 0; i < rawHeaders.length; i++) {
//     if (i % 2 === 0) {
//       keyList.push(rawHeaders[i].toUpperCase())
//     }
//     else {
//       attributeList.push(rawHeaders[i])
//     }
//   }
//   for (let i = 0; i < rawHeaders.length / 2; i++) {
//     headerJSON[keyList[i]] = attributeList[i]
//   }
//   return headerJSON
// }
//
// function getBoundary(header) {
//   const contentType = header["CONTENT-TYPE"]
//   const bounaries = contentType.split("boundary=");
//   console.log("bounding string", bounaries[1])
//   return bounaries[1]
//
// }

async function logger(string, filename) {
  fs.writeFile(`${import.meta.dirname}/${filename}`, string, () => { })
  // fs.appendFile(`${import.meta.dirname}/logger.txt`, string, () => {

}
