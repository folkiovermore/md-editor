// Network first, cached copy when offline.
// Change the version (manuscript-v3, -v4…) whenever you upload new files.
const C='manuscript-v3', FILES=['./','index.html','convert.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys()
  .then(ks=>Promise.all(ks.filter(k=>k!==C&&(k.startsWith('manuscript-')||k.startsWith('convert-'))).map(k=>caches.delete(k))))
  .then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(C).then(c=>c.put(e.request,k));return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
