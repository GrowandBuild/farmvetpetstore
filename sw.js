const CACHE_NAME = 'farmvet-cache-v3';
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

// Fallback para quando offline
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
  console.log('Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log('Erro no cache:', error);
        // Se falhar, pelo menos cachear a página offline
        return caches.open(CACHE_NAME).then(cache => {
          return cache.put('/offline.html', new Response(offlineFallback, {
            headers: { 'Content-Type': 'text/html' }
          }));
        });
      })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker ativando...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Não interceptar requisições de API ou recursos dinâmicos
  if (event.request.url.includes('/api/') || 
      event.request.method !== 'GET' ||
      event.request.headers.get('cache-control') === 'no-cache' ||
      event.request.url.includes('chrome-extension') ||
      event.request.url.includes('extension')) {
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
              })
              .catch(function(error) {
                console.log('Erro ao cachear:', error);
              });

            return response;
          })
          .catch(function(error) {
            console.log('Erro na requisição:', error);
            
            // Se for uma página HTML, retorna a página offline
            if (event.request.destination === 'document' || 
                event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            // Para outros recursos, retorna uma resposta vazia
            if (event.request.destination === 'image') {
              return new Response('', { status: 404 });
            }
            
            return new Response('', { status: 503 });
          });
      })
      .catch(function(error) {
        console.log('Erro geral no fetch:', error);
        // Fallback final
        if (event.request.destination === 'document') {
          return new Response(offlineFallback, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
      })
  );
});

// Mensagem para debug
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 