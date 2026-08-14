(() => {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;

  async function registerReadingWorld() {
    try {
      const reg = await navigator.serviceWorker.register('./service-worker.js', { scope: './' });
      await navigator.serviceWorker.ready;

      // Prompt a waiting worker to activate immediately so GitHub Pages updates
      // do not leave the iPad stuck on an old app shell.
      if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });

      const target = navigator.serviceWorker.controller || reg.active || reg.waiting;
      target?.postMessage({ type: 'PRECACHE_READING_WORLD' });
      try { await navigator.storage?.persist?.(); } catch (_) {}
    } catch (err) {
      console.warn('Reading World offline cache was not registered:', err);
    }
  }

  if (document.readyState === 'complete') registerReadingWorld();
  else window.addEventListener('load', registerReadingWorld, { once: true });
})();
