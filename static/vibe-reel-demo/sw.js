/* The demo's service worker: what the page's fetch() fakes can't answer,
 * because the browser loads it by itself — artwork in <img> and the video in
 * <video> — mapped onto the static files next to it.
 *
 *   <base>jf/Items/<id>/Images/<Primary|Backdrop|Thumb>[/<n>]?…  → img/<id>-<Type>.webp
 *   <base>jf/Videos/<id>/stream[.<ext>]?mediaSourceId=<trailer>    → media/<trailer>.mp4
 *
 * Any size the app asks for gets the one stored. A Range request goes through
 * as it is, so seeking works. Stateless: everything else (the API) never gets
 * here, and the page's own fetch patch (src/fake.js) answers it. */
const BASE = new URL('./', self.location.href).pathname;
const JF = BASE + 'jf/';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
// a page loaded with a hard reload is not controlled until it asks (boot.js)
self.addEventListener('message', (e) => {
  if (e.data === 'claim') e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (u.origin !== self.location.origin || !u.pathname.startsWith(JF)) return;
  const p = u.pathname.slice(JF.length - 1);
  let m = /^\/Items\/([0-9a-f]{32})\/Images\/(Primary|Backdrop|Thumb)(?:\/\d+)?$/i.exec(p);
  if (m) {
    e.respondWith(fetch(BASE + 'img/' + m[1].toLowerCase() + '-' + m[2] + '.webp'));
    return;
  }
  m = /^\/Videos\/[^/]+\/stream(?:\.\w+)?$/i.exec(p);
  const src = m && (u.searchParams.get('mediaSourceId') || u.searchParams.get('MediaSourceId'));
  if (src && /^[0-9a-f]{32}$/i.test(src)) {
    const headers = {};
    const range = e.request.headers.get('range');
    if (range) headers.range = range;
    e.respondWith(fetch(BASE + 'media/' + src.toLowerCase() + '.mp4', { headers }));
    return;
  }
  e.respondWith(new Response('Not in the demo', { status: 404 }));
});
