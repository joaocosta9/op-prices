const CACHE='cards-20260921084147'
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png']
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))
})
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))
})
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    if(hit){e.waitUntil(fetch(e.request).then(r=>r&&r.ok&&caches.open(CACHE).then(c=>c.put(e.request,r.clone()))).catch(()=>{}));return hit}
    return fetch(e.request).then(r=>{
      if(r&&r.ok){const cl=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cl))}
      return r
    }).catch(()=>caches.match('./index.html'))
  }))
})
