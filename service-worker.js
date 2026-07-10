const CACHE_NAME = 'noisescope-v6.3';
const CORE_ASSETS = [
  './',
  './NoiseScope_Web_V6_3_PWA.html',
  './manifest.json',
  './favicon.png',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE_ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('sites.json')) {
    e.respondWith(fetch(e.request).then(net => {
      const copy = net.clone();
      caches.open(CACHE_NAME).then(c => { try { c.put(e.request, copy); } catch(_){} });
      return net;
    }).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(net => {
    const copy = net.clone();
    caches.open(CACHE_NAME).then(c => { try { c.put(e.request, copy); } catch(_){} });
    return net;
  }).catch(()=>caches.match('./NoiseScope_Web_V6_3_PWA.html'))));
});
