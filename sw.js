const CACHE="research-shell-9c38b7a1-db75-494c-b53f-8652444b8154", FILES=["./","./index.html","./app-config.json","./app-icon-256.png","./app-icon-512.png","./manifest.webmanifest","./workspace-6229124386e432b1.js","./workspace-7fb17be873f54be0.css"];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('research-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 const known=FILES.map(file=>new URL(file,self.registration.scope).pathname);
 if(!known.includes(url.pathname))return;
 if(request.mode==='navigate')event.respondWith(fetch(request).catch(()=>caches.match(new URL('index.html',self.registration.scope))));
 else event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});