const CACHE_NAME = 'v25_pwa_cache';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js'
];

// Instala o Service Worker e guarda os arquivos no cache
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Serve os arquivos do cache quando o usuÃ¡rio estiver offline
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});

// Atualiza o cache antigo quando houver nova versao dos arquivos
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
});
























