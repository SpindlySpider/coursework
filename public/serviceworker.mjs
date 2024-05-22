const staticCacheName = "static"
const dynamicCacheName = "dynamic"
self.addEventListener("install", async event => install())
self.addEventListener("activate", activate)
self.addEventListener("fetch", fetchHandle)


// make a fall back https://youtu.be/KLQELCvb-B0?list=PL4cUxeGkcC9gTxqJBcDmoi5Q2pzDusSL7

async function activate(event) {
  console.log("activated sw")
  // add removal of old cache here
}

async function install() {
  const staticCache = await caches.open(staticCacheName)
  staticCache.addAll(["./", "./main.css"])
  // add all static things here
  console.log("install")
}

async function fetchHandle(event) {
  // network first 
  const request = event.request.clone()
  event.respondWith(caches.match(request).then(
    async res => await fetchResource(event) || res
  ))
}

async function fetchResource(event) {
  // get reasource from server and save it 
  try {
    const response = await fetch(event.request.clone())
    const dynamicCache = await caches.open(dynamicCacheName)
    dynamicCache.put(event.request.url, response.clone())
    return response.clone()
  }
  catch {
    return undefined
  }
}
