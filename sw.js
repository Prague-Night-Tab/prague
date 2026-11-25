const C='pnt-app-v369',IMG='pnt-img-v1',MAXIMG=400,A=['./','index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(A.map(u=>c.add(u).catch(()=>0)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==IMG).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* Google venue photos: kept on the phone in their own cache (never wiped by an app update). Key has no API key. */
function pk(u){return new Request(u.origin+u.pathname+'?w='+(u.searchParams.get('maxWidthPx')||''))}
function isPh(u){return u.hostname==='places.googleapis.com'&&/\/media$/.test(u.pathname)}
async function trim(c){try{const k=await c.keys();if(k.length>MAXIMG)for(const x of k.slice(0,k.length-MAXIMG))await c.delete(x)}catch(_){}}
async function photo(e,u){const key=pk(u),c=await caches.open(IMG);const hit=await c.match(key);if(hit)return hit;
try{const r=await fetch(new Request(e.request.url,{mode:'cors',credentials:'omit',referrerPolicy:'no-referrer-when-downgrade'}));
if(r&&r.ok&&r.status===200){await c.put(key,r.clone());trim(c);return r}return r}catch(_){return fetch(e.request)}}
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);
if(isPh(u)){e.respondWith(photo(e,u));return}
if(u.origin!==location.origin)return;
e.respondWith(fetch(e.request).then(r=>{if(!r||!r.ok||r.status!==200)return caches.match(e.request).then(m=>m||r);const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))});
