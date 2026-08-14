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

  // iPad/iPhone gesture bridge. This does not change module visuals; it maps
  // natural swipes to the same navigation actions the modules already expose
  // through keyboard controls.
  const moduleName = (location.pathname.split('/').pop() || '').replace(/\.html$/i, '');
  const interactiveSelector = [
    'button','a','input','textarea','select','option','label','audio','video',
    '[contenteditable="true"]','[role="button"]','[role="slider"]','[data-no-swipe]'
  ].join(',');

  let gesture = null;
  const minDistance = () => Math.max(42, Math.min(innerWidth || 1024, innerHeight || 768) * 0.055);

  function overlayOpen() {
    return !!document.querySelector(
      '.modal-layer.open,.modal-shade.show,.overlay.open,.tf-dialog-layer.open,' +
      '#settingsOverlay.open,#customOverlay.open,#wordManagerOverlay.open,#celebration.open'
    );
  }

  function keyboard(key, {shiftKey=false}={}) {
    const code = key.startsWith('Arrow') ? key : key;
    const down = new KeyboardEvent('keydown', {
      key, code, shiftKey, bubbles:true, cancelable:true
    });
    document.dispatchEvent(down);
    // Letter Slide uses its own held-key timer, so always issue keyup as well.
    setTimeout(() => {
      document.dispatchEvent(new KeyboardEvent('keyup', {
        key, code, shiftKey, bubbles:true, cancelable:true
      }));
    }, 28);
  }

  function performSwipe(dx, dy) {
    const horizontal = Math.abs(dx) > Math.abs(dy) * 1.18;
    const vertical = Math.abs(dy) > Math.abs(dx) * 1.18;
    if (!horizontal && !vertical) return false;

    if (horizontal) {
      // Finger moves left = advance; finger moves right = go back.
      if (moduleName === 'kuwento-tayo') {
        // Kuwento's unmodified ArrowLeft/Right steps syllables. A page swipe
        // should turn the story page, which the app already maps to Shift+Arrow.
        keyboard(dx < 0 ? 'ArrowRight' : 'ArrowLeft', {shiftKey:true});
      } else {
        keyboard(dx < 0 ? 'ArrowRight' : 'ArrowLeft');
      }
      return true;
    }

    // Fluency Pyramid already has meaningful up/down movement in both its
    // level map and reading run. Other modules intentionally keep vertical
    // gestures free so a swipe cannot accidentally mark an answer correct.
    if (vertical && moduleName === 'fluency-pyramid') {
      keyboard(dy < 0 ? 'ArrowUp' : 'ArrowDown');
      return true;
    }
    return false;
  }

  document.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || overlayOpen()) { gesture = null; return; }
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(interactiveSelector)) { gesture = null; return; }
    const t = event.touches[0];
    gesture = { x:t.clientX, y:t.clientY, lastX:t.clientX, lastY:t.clientY, time:performance.now(), locked:false };
  }, {passive:true, capture:true});

  document.addEventListener('touchmove', event => {
    if (!gesture || event.touches.length !== 1) return;
    const t = event.touches[0];
    gesture.lastX=t.clientX; gesture.lastY=t.clientY;
    const dx=t.clientX-gesture.x, dy=t.clientY-gesture.y;
    const dist=Math.hypot(dx,dy);
    if (dist > 16) gesture.locked=true;
    // Once a deliberate app swipe begins, stop Safari from turning it into
    // browser/page panning. Button taps and form controls were excluded above.
    if (gesture.locked && event.cancelable) event.preventDefault();
  }, {passive:false, capture:true});

  document.addEventListener('touchend', event => {
    if (!gesture) return;
    const g=gesture; gesture=null;
    const t=event.changedTouches?.[0];
    const endX=t?.clientX ?? g.lastX, endY=t?.clientY ?? g.lastY;
    const dx=endX-g.x, dy=endY-g.y;
    const elapsed=performance.now()-g.time;
    if (elapsed > 1100 || Math.hypot(dx,dy) < minDistance()) return;
    const handled=performSwipe(dx,dy);
    if (handled && event.cancelable) event.preventDefault();
  }, {passive:false, capture:true});

  document.addEventListener('touchcancel', () => { gesture=null; }, {passive:true, capture:true});
})();
