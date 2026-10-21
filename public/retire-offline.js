(() => {
 if (!('serviceWorker' in navigator)) return;
 navigator.serviceWorker.getRegistrations().then(items => Promise.all(items.filter(item => {
  const script = item.active?.scriptURL || item.waiting?.scriptURL || item.installing?.scriptURL;
  return script && new URL(script).origin === location.origin && new URL(script).pathname === '/sw.js';
 }).map(item => item.update().catch(() => {})))).catch(() => {});
 if ('caches' in window) caches.keys().then(names => Promise.all(names.filter(name => /^dp-v\d+-(pages|assets)$/.test(name)).map(name => caches.delete(name)))).catch(() => {});
})();
