import { randomInt, randomUUID } from 'crypto';
import EventEmitter from 'events';
import fs from 'fs';
import { stringify } from 'querystring';

export function multibodyParser(req, res, id, emitter) {
  // handle emptry file here
  let requestString = stringify(req);
  requestString = requestString.replace(/\&/g, '\n');
  const bufferChunks = [];
  console.log(req.rawHeaders);
  req.on('data', (chunk) => {
    bufferChunks.push(chunk);
  });
  req.on('end', () => {
    // store chunk
    const buffer = Buffer.from(Buffer.concat(bufferChunks), 'utf8');
    let currentIndex = 0;
    for (let i = 0; i < 4; i++) {
      currentIndex = buffer.indexOf('\n', currentIndex) + 1;
    }
    // split buffer into content and header
    const [header, content] = splitString(buffer, currentIndex);
    // regex to extract filename
    const filename = header.toString().match(/filename="([a-zA-Z0-9\-]*)(.*)"/g);
    const extention = filename.toString().match(/(\.)(?!.*\.)\w*/g).toString();
    // save file
    const URL = `${import.meta.dirname}/../../photos/${id}${extention}`;
    fs.writeFile(URL, content, () => { });
    emitter.emit('upload-success', URL);
  });
}

function splitString(string, index) {
  const substring1 = string.slice(0, index);
  const substring2 = string.slice(index, string.length);
  return [substring1, substring2];
}

