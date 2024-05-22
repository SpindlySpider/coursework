const staticCacheName = "static"
const dynamicCacheName = "dynamic"
self.addEventListener("install", install)
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
  event.respondWith(
    caches.match(event.request).then(
      res => res || fetchResource(event)
    )
  )
}

function fetchResource(event) {
  // get reasource from server and save it 
  const response = fetch(event.request.url).then((res) => {
    caches.open(dynamicCacheName).then(cache => cache.put(event.request.url, res.clone()))
  })
  return response
}
