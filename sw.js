const CACHE_NAME = 'farmvet-cache-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/SVG/LOGOPRETA.svg',
  '/SVG/LOGOPBRANCA.svg',
  '/img/logo.png'
];

// Fallback simples para quando offline
const offlineFallback = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FarmVet - Offline</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
        .offline-message { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .icon { font-size: 48px; color: #8b7355; margin-bottom: 20px; }
        h1 { color: #2c2c2c; margin-bottom: 15px; }
        p { color: #6b7280; line-height: 1.6; }
        .retry-btn { background: #2c2c2c; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="offline-message">
        <div class="icon">📱</div>
        <h1>Sem conexão</h1>
        <p>Você está offline. Verifique sua conexão com a internet e tente novamente.</p>
        <button class="retry-btn" onclick="window.location.reload()">Tentar novamente</button>
    </div>
</body>
</html>
`;

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
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
  // Não interceptar requisições suspeitas
  if (event.request.url.includes('/api/') || 
      event.request.method !== 'GET' ||
      event.request.url.includes('chrome-extension') ||
      event.request.url.includes('extension') ||
      event.request.url.includes('avast') ||
      event.request.url.includes('antivirus')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(function(response) {
            if (!response || response.status !== 200) {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              })
              .catch(function(error) {
                console.log('Erro ao cachear:', error);
              });

            return response;
          })
          .catch(function(error) {
            if (event.request.destination === 'document') {
              return new Response(offlineFallback, {
                headers: { 'Content-Type': 'text/html' }
              });
            }
            return new Response('', { status: 404 });
          });
      })
  );
});

// Mensagem para debug
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 