// Service worker disabled for development
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('active', (event) => {
    event.waitUntil(self.clients.claim());
});