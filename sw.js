var V="cashly-v1",CDN="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js",SHELL=["./","index.html","manifest.webmanifest","icon.svg","icon-180.png","icon-192.png","icon-512.png","icon-maskable-512.png"];
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(V).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){})}).concat([c.add(new Request(CDN,{mode:"cors"})).catch(function(){})]))}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){var r=e.request;if(r.method!=="GET")return;var u=new URL(r.url);
if(u.href===CDN){e.respondWith(caches.match(r).then(function(h){return h||fetch(r).then(function(x){var c=x.clone();caches.open(V).then(function(k){k.put(r,c)});return x})}));return}
if(u.origin!==self.location.origin)return;
e.respondWith((function(){var net=fetch(r).then(function(x){if(x.ok){var c=x.clone();caches.open(V).then(function(k){k.put(r,c)})}return x});
return Promise.race([net,new Promise(function(ok){setTimeout(function(){ok(null)},4000)})]).then(function(x){return x||caches.match(r,{ignoreSearch:true}).then(function(h){return h||net})}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(h){return h||(r.mode==="navigate"?caches.match("index.html"):Response.error())})})})())});
self.addEventListener("notificationclick",function(e){e.notification.close();e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(l){return l.length?l[0].focus():self.clients.openWindow("./")}))});
