(() => {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;

  let cacheTarget = null;
  let warmupScheduled = false;

  function startFullLibraryWarmup() {
    if (!cacheTarget || !navigator.onLine) return;
    cacheTarget.postMessage({ type: 'PRECACHE_READING_WORLD' });
  }

  function scheduleFullLibraryWarmup() {
    if (!cacheTarget || warmupScheduled) return;
    warmupScheduled = true;

    // Keep first paint and app controls responsive, then complete the entire Reading World library quietly in the background for offline use.
    // On updates, unchanged content-hashed media is reused from local storage.
    const run = () => {
      warmupScheduled = false;
      startFullLibraryWarmup();
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 6000 });
    } else {
      setTimeout(run, 3500);
    }
  }

  async function registerReadingWorld() {
    try {
      const reg = await navigator.serviceWorker.register('./service-worker.js', { scope: './' });
      await navigator.serviceWorker.ready;
      if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });

      cacheTarget = navigator.serviceWorker.controller || reg.active || reg.waiting;
      scheduleFullLibraryWarmup();

      // Check GitHub Pages for a newer service worker on launch and whenever
      // the user returns to the app. This does not force-refresh an active
      // lesson; the new shell is used naturally on the next navigation/reopen.
      const checkForAppUpdate = async () => {
        if (!navigator.onLine) return;
        try {
          await reg.update();
          if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        } catch (_) {}
      };
      setTimeout(checkForAppUpdate, 1200);
      window.addEventListener('focus', checkForAppUpdate);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForAppUpdate();
      });
      setInterval(checkForAppUpdate, 60 * 60 * 1000);

      // Ask for persistent storage where the browser supports it so the fully
      // downloaded offline library is less likely to be evicted under pressure.
      try { await navigator.storage?.persist?.(); } catch (_) {}

      // If the connection drops during the background download, resume filling
      // any missing files automatically when connectivity returns.
      window.addEventListener('online', () => {
        setTimeout(startFullLibraryWarmup, 800);
        setTimeout(checkForAppUpdate, 1000);
      });

      // A newly activated controller should also continue the warmup.
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        cacheTarget = navigator.serviceWorker.controller || reg.active || reg.waiting;
        setTimeout(startFullLibraryWarmup, 500);
      });
    } catch (err) {
      console.warn('Reading World cache was not registered:', err);
    }
  }

  if (document.readyState === 'complete') registerReadingWorld();
  else window.addEventListener('load', registerReadingWorld, { once: true });
})();
