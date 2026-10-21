// Retire the guide's legacy offline cache without touching other origin caches.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil((async () => {
 const names = await caches.keys();
 await Promise.all(names.filter(name => /^dp-v\d+-(pages|assets)$/.test(name)).map(name => caches.delete(name)));
 await self.registration.unregister();
 await self.clients.claim();
})()));
