const CACHE="research-shell-9469c3dd-eb60-4161-9ff9-bf60fce4df13", FILES=["./","./index.html","./index-9469c3dd-eb60-4161-9ff9-bf60fce4df13.html","./app-config.json","./app-icon-256.png","./app-icon-512.png","./bibliotheca-banner.png","./manifest.webmanifest","./workspace-39a90f4d7bb249cd.js","./workspace-52141e60c6244823.css"];
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