/* Service Worker: precache rdzenia gry, działanie offline; komiks PDF cache'owany przy pierwszym użyciu */
const VERSION = 'asz-v2.0.5';
const CORE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/game.css',
  'js/data.js',
  'js/save.js',
  'js/audio.js',
  'js/ui.js',
  'js/game-catch.js',
  'js/game-sort.js',
  'js/game-sleep.js',
  'js/game-run.js',
  'js/game-boss.js',
  'js/main.js',
  'assets/fonts/baloo-2-latin-ext-400-normal.woff2',
  'assets/fonts/baloo-2-latin-ext-700-normal.woff2',
  'assets/fonts/baloo-2-latin-ext-800-normal.woff2',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-192.png',
  'assets/icons/icon-maskable-512.png',
  'assets/img/bg-hub.webp',
  'assets/img/bg-canteen.webp',
  'assets/img/bg-lab.webp',
  'assets/img/bg-night.webp',
  'assets/img/bg-field.webp',
  'assets/img/bg-final.webp',
  'assets/img/bg-reward.webp',
  'assets/img/scene-corridor.webp',
  'assets/img/scene-run.webp',
  'assets/img/scene-hq.webp',
  'assets/img/scene-victory.webp',
  'assets/img/gluton.webp',
  'assets/img/energus-run.webp',
  'assets/img/energus-jump.webp',
  'assets/img/comic-cz1-cover.webp',
  'assets/img/portrait-energus.webp',
  'assets/img/portrait-mozgus.webp',
  'assets/img/portrait-witaminka.webp',
  'assets/img/portrait-senek.webp',
  'assets/img/portrait-kropelka.webp',
  'assets/img/portrait-sprintix.webp',
  'assets/img/portrait-usmiechanka.webp',
  'assets/img/item-owoce.webp',
  'assets/img/item-warzywa.webp',
  'assets/img/item-woda.webp',
  'assets/img/item-jajka.webp',
  'assets/img/item-ryby.webp',
  'assets/img/item-chipsy.webp',
  'assets/img/item-slodycze.webp',
  'assets/img/item-energetyk.webp',
  'assets/img/item-telefon.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith('/_vercel/')) return; // analityka: zawsze przez sieć

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(VERSION).then(c => c.put(req, clone));
        }
        return res;
      });
    })
  );
});
