const APP_PREFIX ='BudgetTracker-'
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
    '../../',
    '../index.html',
    '../css/styles.css',
    'idb.js',
    'index.js'
];

self.addEventListener('install',(e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('installing: ' + CACHE_NAME);
                return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then((keyList) => {
                let cacheKeepList = keyList.filter((key) => {
                    return key.indexOf(APP_PREFIX)
                });
                cacheKeepList.push(CACHE_NAME);

                return Promise.all(
                    keyList.map((key, i) => {
                        if (cacheKeepList.indexOf(key) === -1) {
                            console.group('deleting: ' + keyList[i]);
                            return caches.delete(keyList[i]);
                        }
                    })
                )
            })
    )
});

self.addEventListener('fetch', (e) => {
    console.log('fetch: ' + e.request.url)
    e.respondWith(
        caches.match(e.request)
            .then((request) => {
                if(request) {
                    console.log('responding with: ' + e.request.url);
                    return request;
                } else {
                    console.log('file is not cached: ' + e.request.url);
                    return fetch(e.request);
                }
            })
    )
})