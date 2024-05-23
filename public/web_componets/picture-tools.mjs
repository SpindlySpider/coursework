export async function uploadPhoto(activityID, photoContent, altText = "none") {
  const photoResponse = await fetch(`picture/${activityID}/${altText}`, {
    method: 'POST',
    body: photoContent,
  });
  if (photoResponse.ok) {
    return "success"
  }
  else {
    return "error"
  }
}

export async function getPhotos(activityID) {
  const photoResponse = await fetch(`picture/activity/${activityID}`).then((response) => response.json()
  );
  console.log("getphoto:", photoResponse)
  const list = []
  for (let photo of photoResponse.picture_ids) {
    console.log(photo)
    list.push(photo)
  }
  return list
}

export async function getPhotoFromID(pictureID) {
  const photoResponse = await fetch(`picture/${pictureID}`);
  if (photoResponse.ok) {
    console.log("photos", photoResponse)
    return await fetch(photoResponse.url)
  }
  else {
    return { status: "error couldnt get photo" }
  }
}
