(() => {
  const primeSpeech = () => {
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.getVoices();
      window.speechSynthesis.resume?.();
    } catch (_) {}
  };
  window.addEventListener('pageshow', primeSpeech, {passive:true});
  window.addEventListener('focus', primeSpeech, {passive:true});
  document.addEventListener('pointerdown', primeSpeech, {passive:true, once:false});
  document.addEventListener('touchstart', primeSpeech, {passive:true, once:false});
  document.addEventListener('click', primeSpeech, {passive:true, once:false});
  try { navigator.storage?.persist?.(); } catch (_) {}
})();
