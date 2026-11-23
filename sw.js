const CACHE="research-shell-f0139a12-f58e-4033-bbd8-897a159cb59f", FILES=["./","./index.html","./app-config.json","./app-icon-256.png","./app-icon-512.png","./bibliotheca-banner.png","./manifest.webmanifest","./workspace-2c13519d073de370.css","./workspace-2fa336196ed42022.js"];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('research-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 const known=FILES.map(file=>new URL(file,self.registration.scope).pathname);
 const isCover=url.pathname.startsWith(new URL('reader-covers/',self.registration.scope).pathname);
 if(!known.includes(url.pathname)&&!isCover)return;
 if(isCover){event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(request);if(cached)return cached;const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response;}));return;}
 if(request.mode==='navigate')event.respondWith(fetch(request).catch(()=>caches.match(new URL('index.html',self.registration.scope))));
 else event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});