const STATIC_CACHE_NAME = 'static-v1'
const DYNAMIC_CACHE_NAME = 'dynamic-v1'

self.addEventListener('install', event => {
    console.log('Installing service worker', event)
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
        .then(cache => {
            cache.addAll([
                '/',
                '/index.html',
                '/js/bundle.js',
                '/css/styles.css',
                '/assets/images/food-30x30.png',
                '/assets/images/background.jpg'
            ])
        })
    )
})

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if(response){
                return response
            } else{
                return fetch(event.request).then(res => {
                    return caches.open(DYNAMIC_CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, res.clone())
                            return res;
                        })
                })

            }
        })
    )
})