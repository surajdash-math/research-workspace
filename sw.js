const CACHE="research-shell-3ab9d7cc-39fa-464c-a0c7-3019ba6bb149", FILES=["./","./index.html","./index-3ab9d7cc-39fa-464c-a0c7-3019ba6bb149.html","./app-config.json","./app-icon-256.png","./app-icon-512.png","./bibliotheca-banner.png","./manifest.webmanifest","./workspace-16fdc65bf728e316.css","./workspace-e0673c9b96f687d0.js"];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(file=>new Request(new URL(file,self.registration.scope),{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('research-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 const known=FILES.map(file=>new URL(file,self.registration.scope).pathname);
 const isCover=url.pathname.startsWith(new URL('reader-covers/',self.registration.scope).pathname);
 if(request.mode==='navigate'){event.respondWith((async()=>{try{const response=await fetch(new Request(request,{cache:'no-store'}));if(response.ok)return response;const cached=await caches.match(new URL('index.html',self.registration.scope));return cached||response;}catch(error){const cached=await caches.match(new URL('index.html',self.registration.scope));if(cached)return cached;throw error;}})());return;}
 if(!known.includes(url.pathname)&&!isCover)return;
 if(isCover){event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(request);if(cached)return cached;const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response;}));return;}
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});