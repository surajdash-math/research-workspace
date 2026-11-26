const CACHE="research-shell-03e7e7a2-a0bc-4208-9646-604213ee0edc", FILES=["./","./index.html","./index-03e7e7a2-a0bc-4208-9646-604213ee0edc.html","./app-config.json","./app-icon-256.png","./app-icon-512.png","./bibliotheca-banner.png","./manifest.webmanifest","./workspace-263b256523c5d1c7.css","./workspace-55c8cc77652b7182.js"];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(file=>new Request(new URL(file,self.registration.scope),{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('research-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 const known=FILES.map(file=>new URL(file,self.registration.scope).pathname);
 const isCover=url.pathname.startsWith(new URL('reader-covers/',self.registration.scope).pathname);
 const isTexRuntime=url.pathname.startsWith(new URL('tex-runtime/',self.registration.scope).pathname);
 if(request.mode==='navigate'){event.respondWith((async()=>{try{const response=await fetch(new Request(request,{cache:'no-store'}));if(response.ok)return response;const cached=await caches.match(new URL('index.html',self.registration.scope));return cached||response;}catch(error){const cached=await caches.match(new URL('index.html',self.registration.scope));if(cached)return cached;throw error;}})());return;}
 if(!known.includes(url.pathname)&&!isCover&&!isTexRuntime)return;
 if(isCover||isTexRuntime){event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(request);if(cached)return cached;const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response;}));return;}
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});