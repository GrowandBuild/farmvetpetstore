const CACHE_NAME = 'farmvet-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/SVG/LOGOPRETA.svg',
  '/SVG/LOGOPBRANCA.svg',
  '/img/logo.png',
  '/img/planta.webp',
  '/img/planta2.png',
  '/img/imagemdedog1.png',
  '/img/imagemde_dog2.png',
  '/img/imagemde_dog3.png',
  '/videos/videohero.mp4'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log('Erro no cache:', error);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Não cachear requisições de API ou recursos dinâmicos
  if (event.request.url.includes('/api/') || 
      event.request.method !== 'GET' ||
      event.request.headers.get('cache-control') === 'no-cache') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retorna do cache se disponível
        if (response) {
          return response;
        }

        // Se não estiver no cache, busca da rede
        return fetch(event.request)
          .then(function(response) {
            // Não cachear respostas que não são válidas
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para cache
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(function() {
            // Se falhar, retorna uma resposta padrão para recursos críticos
            if (event.request.destination === 'image') {
              return new Response('', { status: 404 });
            }
          });
      })
  );
}); 