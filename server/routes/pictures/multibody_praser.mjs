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
    // console.log("chunk", chunk)
    bufferChunks.push(chunk)
  })

  req.on("end", () => {
    //store chunk
    let buffer = Buffer.from(Buffer.concat(bufferChunks), "utf8")
    let currentIndex = 0
    for (let i = 0; i < 4; i++) {
      currentIndex = buffer.indexOf("\n", currentIndex) + 1
    }
    console.log(currentIndex)
    let [header, content] = splitString(buffer, currentIndex);
    console.log(header.toString())
    const filename = header.toString().match(/filename="([a-zA-Z0-9\-]*)(.*)"/g)
    const extention = filename.toString().match(/(\.)(?!.*\.)\w*/g).toString();
    // console.log(req.body.fileType)



    // after the 4th line break
    logger(content, `chuck${extention}`)
  })
  logger(requestString, "logger.txt")
}

function splitString(string, index) {
  const substring1 = string.slice(0, index);
  const substring2 = string.slice(index, string.length);
  return [substring1, substring2]
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
