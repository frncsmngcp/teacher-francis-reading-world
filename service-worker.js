const CACHE_VERSION = "teacher-francis-reading-world-pwa-v1.4.6";
const CORE_CACHE = CACHE_VERSION + "-core";
const CONTENT_CACHE = CACHE_VERSION + "-content";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./offline.html", "./shared/pwa-compat.js", "./shared/pwa-register.js", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./shared/startup-prompt-approved.png"];
const OFFLINE_INVENTORY = ["./assets/6806525f87e3fb199b29.wav", "./assets/5f0394d784f7895d1c08.wav", "./assets/3e8b5202503bf390973a.wav", "./assets/0f29196a3ff1851f30a4.webp", "./assets/deb6439e38c574145459.wav", "./assets/fcef2acc9a773ac628ca.webp", "./assets/66d5e6b2a0423578c2c9.webp", "./assets/85b101e9a15e667434be.webp", "./assets/bc6b257b8d74b64528e3.webp", "./assets/459e62e51c95db058893.webp", "./assets/54e8427761753f46daf4.wav", "./assets/1e79b0ec5627196a4ba6.webp", "./assets/9ce2f38b9715ca082967.webp", "./assets/096e82b156f50e969f8f.webp", "./assets/91d59155ca17e4a083f6.webp", "./assets/3ec4630298d52f3e9586.webp", "./assets/52aa55ded68edc01905a.wav", "./assets/97f2fb3493a49ecbd933.webp", "./assets/37bc59310acbd4178b33.png", "./assets/4ae4216da6299e1738da.wav", "./assets/eb2bfe170fb8b4971b7c.webp", "./assets/ad01c92f8bc433643afb.webp", "./assets/98d63bfea42692ff4ec2.png", "./assets/6f90beeab863fd679a68.webp", "./assets/ea3bd04e11c69e1a9c66.wav", "./assets/eb073ae6a2851c329579.webp", "./assets/31aa952a6f494fe721cb.webp", "./assets/604171418f734de40c59.webp", "./assets/4270aef95257979c634f.webp", "./assets/c8c5a4796729b045f8e8.wav", "./assets/9399e37dcb5185db8dc0.wav", "./assets/637fd932ebc71d841ac2.wav", "./assets/823521a18f0ab0ab31bc.webp", "./assets/e1bf8393b231410ea701.wav", "./assets/9730601d0baccb61bbf5.webp", "./assets/7c4e92506eb2d7d008c8.wav", "./assets/1a0a1781b3f55790dc48.wav", "./assets/de2725ff752b1cdf553e.webp", "./assets/fdd94a73f8640858ef73.wav", "./assets/2cef6380dc6d26f108cd.wav", "./assets/713e03da4c46e817271a.webp", "./assets/78bc537343f7dd96f6d6.wav", "./assets/f1851e4c3db1183b62a1.wav", "./assets/b2a9a23223245bc98f50.wav", "./assets/05bcd7fee3987bb292cb.webp", "./assets/1b7b067802b2813dbbcd.wav", "./assets/a680001f2a32b685e297.wav", "./assets/aad08217c396583aaeba.webp", "./assets/28ac6dc14b0d05ae83a3.png", "./assets/41c5f48b16ce7ec55b0d.webp", "./assets/2b2f26ea9c0650ca099a.wav", "./assets/64f809530a889e806604.webp", "./assets/07fbc6d3f50e84b940ef.wav", "./assets/ae698da8e737cb869e50.webp", "./assets/75e9bb7bfe8e053d4d60.wav", "./assets/0b12d0b640d869377b0b.webp", "./assets/973800a120c188712597.webp", "./assets/6eac4ac6aee0c863fdbe.wav", "./assets/4a388f5888a6f67cd60a.webp", "./assets/5bf899910f5eba62d07b.webp", "./assets/5e1a0ec95f148cb4a86e.png", "./assets/994a0cfcbae1b99d23dc.wav", "./assets/1687f72029f345b7c7c3.webp", "./assets/640ab29be5e20e34893e.webp", "./assets/e02a2f773c52a1989fa9.webm", "./assets/9cb7148b3e0956fb6b91.webp", "./assets/99dff4196d3d159fcaf4.webp", "./assets/03c18c2c532aa452fccd.wav", "./assets/5e3d382db4dd83d59aa5.png", "./assets/b72959e16e88a89e35fc.wav", "./assets/1c1202ba996ca83203bc.wav", "./assets/2a54a3a93bdad2a045f1.png", "./assets/0fbb7646b62ae58b0a6b.webp", "./assets/7649405c03574249a06a.wav", "./assets/0e4641389f3c0ae993d2.wav", "./assets/98219ebff0e63010fe87.wav", "./assets/5c5aa8fdc461303ebe92.png", "./assets/97b87f9cfcf4b5232f35.wav", "./assets/75375cebf695e63646c8.webp", "./assets/b19d6b1a9f776485b067.webp", "./assets/f0c8676d7c1b18e8c835.webp", "./assets/0f64402fb5a2e4b0f574.wav", "./assets/6f5e90d1fb113c867d08.wav", "./assets/30b51582ce69a797a49c.wav", "./assets/938b1e0b2f425342a9f9.wav", "./assets/8444ac1ce5abed70b688.wav", "./assets/69c0e06d3605f7e2483c.webp", "./assets/27d76109e401b578b1c8.webp", "./assets/ee1111c50eed2c645d85.webp", "./assets/70de08d3843d504d8af1.wav", "./assets/0ee3e0f352e730e650f4.png", "./assets/daf6ff4bfa49cbaf1654.webp", "./assets/3a4b0cf5057411a2dbd1.wav", "./assets/0a84e891d5b24de10d25.wav", "./assets/7dd830dc2c9e7804a34b.wav", "./assets/b7dddef5721f2338ebd8.png", "./assets/822462614eeb037d5aaa.webp", "./assets/91fabb9dcbc5bd5bfa46.webp", "./assets/582630cb1fe390069309.wav", "./assets/6caa1a84826ed96f6b6d.webp", "./assets/821ef685270e0d82a283.webp", "./assets/fbd5fd93237762087a19.png", "./assets/b085e076fa5e1092a09e.webp", "./assets/cf6802d589ce91ee70f1.webp", "./assets/5c3992c221f8737679be.wav", "./assets/adfde7c3d02dbaadf385.wav", "./assets/bedc6b935e367d2eb20c.wav", "./assets/bbafbd09caf3c2a7ee1e.webp", "./assets/c087b855c25b8c0aedb4.png", "./assets/30a0a310893a414f5bbd.wav", "./assets/9361c520dc3f00f484bd.webp", "./assets/84841d7e5f45b6a737a8.wav", "./assets/44cdcce76b0a595dfa0d.png", "./assets/27329e14710b9d14e6ce.webp", "./assets/f24a1615ef9b21797485.wav", "./assets/d6f963bddedd6b61549a.ttf", "./assets/0b7e54570ed9ce1be11c.png", "./assets/3af378426e6e40757a17.webp", "./assets/247d5e65bb8442715931.webp", "./assets/8cfa832aad12e5ae95a9.webp", "./assets/b0f66202dee7785e9969.webp", "./assets/c9c6577c23367f89352f.webp", "./assets/dc70ff74c5177b3f6f27.wav", "./assets/86f0e7c6ead453699c71.wav", "./assets/8455fa672ce042681105.webp", "./assets/f9e4de20562ab15852ba.png", "./assets/444fd02a26a6ecee7b4a.wav", "./assets/5e397f0effef1e57d8eb.wav", "./assets/91c96e84111cf4eda1d2.wav", "./assets/0da19d14837a284b5f70.webp", "./assets/d97acc7e0547d9a62411.wav", "./assets/04f995215c8b95633b39.png", "./assets/deb5891c25b2ca1e608e.wav", "./assets/523275d6ea3903db427e.webp", "./assets/e2b3898d83bb83b7e679.png", "./assets/563f844fc6d316fc5478.webp", "./assets/48abd5a8276b967fb8f6.wav", "./assets/0c3708328f64d60b40e1.webp", "./assets/c5a6f1c18e96a137fc9e.wav", "./assets/8b52fe00a2708ce97daa.wav", "./assets/96271706d7242774a080.wav", "./assets/dcb63305a562db8b73a9.webp", "./assets/987db95084de8250d146.wav", "./assets/8b4cff75e1cb9c6efca6.png", "./assets/8c3f354134d3bc98f13e.webp", "./assets/60e4ca09b9a3847b90da.webp", "./assets/823367c489d1b781088c.webp", "./assets/f4662c253d97722bf481.wav", "./assets/634e7b80e7f2bf0e957c.webp", "./assets/cac47f39e4df512f4939.wav", "./assets/647a1447b79eb15bc929.png", "./assets/e30e8f14d197bf2492ea.wav", "./assets/23b7abaff00fae400dde.webp", "./assets/0866e669cb7019887033.wav", "./assets/9ced74d2a9bf1dcf9bcb.wav", "./assets/8b26a8788b77fd7d2946.wav", "./assets/734344085663a9cd7c35.webp", "./assets/42ab16bfe5f700fa12b6.webp", "./assets/ed2de061a79a87afec4e.wav", "./assets/26f2cc6f30ed2f9c8078.wav", "./assets/4d6634e2f89f30f86411.webp", "./assets/4e116f82f617efb88ab3.wav", "./assets/56eb72bfefd0ce9b4534.wav", "./assets/1c5e9f7039da5a1feffa.wav", "./assets/19d71489c16533516bd5.webp", "./assets/e3efafa8cf2576b7f977.wav", "./assets/6c6285c130d6ab5d64f4.webp", "./assets/61bbf9d9ed6ea2b250a5.wav", "./assets/335b66e49a8c8689fb07.webp", "./assets/c40a9b87fe563b593cd3.webp", "./assets/c01ca33c57f016ea64e6.wav", "./assets/ca5d04cb80b2b0db8782.webp", "./assets/94dee3a9173e970e86e2.wav", "./assets/4980860eb17b17d6e2b3.wav", "./assets/affe5412a5772a7f2a85.png", "./assets/93962936aa084dec63b6.webp", "./assets/dac6942cd45df0300353.webp", "./assets/4b39af8d776cbf5696cc.png", "./assets/d4c12db619557011a944.wav", "./assets/8d8ef9a028f300cdb003.webp", "./assets/c4ce1523bdc3ba691e1e.webp", "./assets/a6d129504c348082ab55.webp", "./assets/b8497650bc3a94c62bc2.webp", "./assets/78db2c584d396264aa2b.webp", "./assets/9b3bb7897e7102050ccd.webp", "./assets/a796fa177e0ff477a6d4.wav", "./assets/8950917c86d282fafa04.webp", "./assets/04dfc8e1a6e59e36a3a3.avif", "./assets/1a1e20df4d63402e939d.wav", "./assets/fc5d00caa241f4ca78d6.wav", "./assets/2fd3e5d79e7bbdf3ebdc.webp", "./assets/653de77d9e921261504e.wav", "./assets/b06f5ea4a463e3cf4a3b.webp", "./assets/07bb52a3e61516fdb460.wav", "./assets/6433f7eca74246c2b67d.wav", "./assets/e51cb891556075588a6e.webp", "./assets/508515f0d14b5a96cbb1.webp", "./assets/14190c16af849806ce1d.wav", "./assets/52dc24c0429ea6ccc5b5.webp", "./assets/550cb53ddb0396240b90.wav", "./assets/797634a298ea6a94ed0d.webp", "./assets/1f470514a0155c8553cd.webp", "./assets/37070403ad4ca564266b.webp", "./assets/f49d514f83e3b869cbd5.wav", "./assets/052c181a1799e90f8a9c.webp", "./assets/2367e05f9e7b34e90d1e.webp", "./assets/d5576ff1f1c37e15d00a.js", "./assets/1825443918a7de6d2e0a.webp", "./modules/basa-tayo.html", "./modules/letter-slide.html", "./modules/fluency-pyramid.html", "./modules/basa-bata-basa.html", "./modules/kuwento-tayo.html", "./modules/awad.html"];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CORE_CACHE);
    await cache.addAll(CORE);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keep = new Set([CORE_CACHE, CONTENT_CACHE]);
    for (const key of await caches.keys()) { if (!keep.has(key)) await caches.delete(key); }
    await self.clients.claim();
  })());
});

async function cacheOne(cache, url) {
  try {
    const req = new Request(url, {cache:'reload'});
    const res = await fetch(req);
    if (res && res.ok) await cache.put(url, res.clone());
    return true;
  } catch (_) { return false; }
}

async function precacheReadingWorld() {
  const cache = await caches.open(CONTENT_CACHE);
  // Sequential caching is intentionally gentler on iPad memory than addAll on the full app.
  for (const url of OFFLINE_INVENTORY) {
    if (await cache.match(url)) continue;
    await cacheOne(cache, url);
  }
}

self.addEventListener('message', event => {
  if (event.data?.type === 'PRECACHE_READING_WORLD') event.waitUntil(precacheReadingWorld());
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    // For pages, network-first prevents an old GitHub Pages app shell from
    // staying stuck on iPad after an update. Assets remain cache-first.
    if (req.mode === 'navigate') {
      try {
        const res = await fetch(req, {cache:'no-cache'});
        if (res && res.ok) {
          const cache = await caches.open(CONTENT_CACHE);
          cache.put(req, res.clone());
        }
        return res;
      } catch (_) {
        return (await caches.match(req, {ignoreSearch:true})) ||
               (await caches.match('./index.html')) ||
               (await caches.match('./offline.html')) || Response.error();
      }
    }
    const cached = await caches.match(req, {ignoreSearch:true});
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && res.ok) {
        const cache = await caches.open(CONTENT_CACHE);
        cache.put(req, res.clone());
      }
      return res;
    } catch (_) {
      return Response.error();
    }
  })());
});
