const CACHE_NAME = 'noisescope-v6.2';
const CORE_ASSETS = [
  './',
  './NoiseScope_Web_V6_2_PWA.html',
  './manifest.json',
  './favicon.png',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(CORE_ASSETS.map(u => new Request(u, {cache: 'reload'}))))
      .then(() => self.skipWaiting())
      .catch(err => console.log('Install cache error:', err))
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(net => {
        const copy = net.clone();
        caches.open(CACHE_NAME).then(c => { try { c.put(e.request, copy); } catch(_){} });
        return net;
      }).catch(() => caches.match('./NoiseScope_Web_V6_2_PWA.html'));
    })
  );
});
