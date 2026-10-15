// 파일을 고친 뒤 다시 올릴 때는 아래 버전 숫자를 올려 주세요 (예: v2 → v3).
const CACHE = 'tabata-v5';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './fonts/big-shoulders-display-latin-700-normal.woff2',
  './fonts/big-shoulders-display-latin-900-normal.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 저장해 둔 파일을 먼저 쓰고, 없을 때만 인터넷에서 가져옵니다.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit || fetch(e.request).catch(() => caches.match('./index.html'))
    )
  );
});
