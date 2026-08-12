/* Kill-switch: zastępuje starego Service Workera gry (scope "/", cache-first).
   Czyści cache, wyrejestrowuje się i przeładowuje otwarte karty, żeby klienci
   z zainstalowaną starą wersją dostali nową strukturę (hub w /, gra w /misja-energia/).
   Nowi odwiedzający nigdy go nie rejestrują - hub nie rejestruje żadnego SW. */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => { clients.forEach((client) => client.navigate(client.url)); })
  );
});
