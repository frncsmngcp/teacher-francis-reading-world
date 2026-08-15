(() => {
  'use strict';

  const DISMISS_KEY = 'tfReadingWorldInstallAssistantDismissedAt';
  const DISMISS_FOR_MS = 3 * 24 * 60 * 60 * 1000;
  const homeScreen = document.getElementById('home-screen');
  if (!homeScreen) return;

  let deferredPrompt = null;
  let modal = null;
  let launcher = null;
  let autoShown = false;
  let installedDetected = false;
  let installCheckInFlight = null;
  let lastInstallCheckAt = 0;
  const INSTALL_RECHECK_MS = 10000;

  const isStandalone = () => {
    try {
      return window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        navigator.standalone === true ||
        document.referrer.startsWith('android-app://');
    } catch (_) {
      return navigator.standalone === true;
    }
  };

  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const isIOS = /iPad|iPhone|iPod/i.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isEdge = /Edg\//i.test(ua);
  const isChrome = /Chrome\//i.test(ua) && !isEdge;
  const isFirefox = /Firefox\//i.test(ua);
  const isSafari = /Safari\//i.test(ua) && !/Chrome|CriOS|Edg|EdgiOS|FxiOS|OPR|OPiOS/i.test(ua);
  const isMobile = isIOS || isAndroid || /Mobile/i.test(ua);

  function recentlyDismissed() {
    try {
      const value = Number(localStorage.getItem(DISMISS_KEY) || 0);
      return value > 0 && (Date.now() - value) < DISMISS_FOR_MS;
    } catch (_) {
      return false;
    }
  }

  function rememberDismissal() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (_) {}
  }

  function clearDismissal() {
    try { localStorage.removeItem(DISMISS_KEY); } catch (_) {}
  }

  function installCopy() {
    if (deferredPrompt) {
      return {
        eyebrow: isMobile ? 'QUICK INSTALL' : 'DESKTOP APP',
        title: 'Install Reading World',
        body: 'Keep all six reading adventures one tap away. The full library continues downloading quietly in the background so it can still work when the connection becomes weak or unavailable.',
        steps: [
          'Tap “Install Reading World” below.',
          'Confirm the browser’s install message.',
          isMobile ? 'Open Reading World from your Home Screen.' : 'Open Reading World from your desktop, Start menu, Dock, or app launcher.'
        ],
        native: true,
        action: 'Install Reading World'
      };
    }

    if (isIOS) {
      return {
        eyebrow: 'IPHONE / IPAD',
        title: 'Add Reading World to Home Screen',
        body: 'Apple requires one short confirmation from you. After that, Reading World opens like an app and the downloaded library remains available for offline reading.',
        steps: [
          'Tap the Share button (the square with the ↑ arrow).',
          'Choose “Add to Home Screen”. If you do not see it, scroll down in the Share menu.',
          'Tap “Add”. Then open Reading World from the new Home Screen icon.'
        ],
        tip: isSafari ? 'You are already in Safari — perfect.' : 'If “Add to Home Screen” is not offered in this browser, open this same page in Safari and use Share → Add to Home Screen.',
        native: false,
        action: 'Got it'
      };
    }

    if (isAndroid) {
      return {
        eyebrow: 'ANDROID',
        title: 'Install Reading World',
        body: 'Your browser has not exposed the one-tap install prompt yet, but you can still install Reading World from its menu.',
        steps: [
          'Open the browser menu (usually ⋮).',
          'Tap “Install app” or “Add to Home screen”.',
          'Confirm, then open Reading World from your Home Screen.'
        ],
        native: false,
        action: 'Got it'
      };
    }

    if (isSafari) {
      return {
        eyebrow: 'MAC',
        title: 'Install Reading World on your Mac',
        body: 'You can keep Reading World in the Dock so it opens in its own app window.',
        steps: [
          'From Safari, open the File menu.',
          'Choose “Add to Dock…” and confirm.',
          'Open Reading World from the Dock or Applications.'
        ],
        native: false,
        action: 'Got it'
      };
    }

    if (isEdge) {
      return {
        eyebrow: 'MICROSOFT EDGE',
        title: 'Install Reading World on this laptop',
        body: 'Reading World can open in its own app window and stay easy to find.',
        steps: [
          'Open the Edge menu (⋯).',
          'Choose “Apps”, then “Install this site as an app”.',
          'Confirm the installation.'
        ],
        native: false,
        action: 'Got it'
      };
    }

    if (isChrome) {
      return {
        eyebrow: 'GOOGLE CHROME',
        title: 'Install Reading World on this laptop',
        body: 'Reading World can open in its own app window and stay easy to find.',
        steps: [
          'Open the Chrome menu (⋮).',
          'Choose the install option, such as “Install page as app” or “Install Reading World”.',
          'Confirm the installation.'
        ],
        native: false,
        action: 'Got it'
      };
    }

    if (isFirefox) {
      return {
        eyebrow: 'LAPTOP / DESKTOP',
        title: 'Install Reading World',
        body: 'This browser does not currently provide Reading World’s normal app-install prompt.',
        steps: [
          'For the simplest app installation, open this page in Chrome or Microsoft Edge.',
          'Choose “Install Reading World” when the install button appears.',
          'You can continue using Reading World in this browser in the meantime.'
        ],
        native: false,
        action: 'Got it'
      };
    }

    return {
      eyebrow: 'LAPTOP / DESKTOP',
      title: 'Install Reading World',
      body: 'Use your browser’s Install app / Add to Dock option to keep Reading World one click away.',
      steps: [
        'Open your browser menu.',
        'Look for “Install app”, “Install page as app”, or “Add to Dock”.',
        'Confirm the installation.'
      ],
      native: false,
      action: 'Got it'
    };
  }

  function injectStyle() {
    if (document.getElementById('tf-install-assistant-style')) return;
    const style = document.createElement('style');
    style.id = 'tf-install-assistant-style';
    style.textContent = `
      #tf-install-launcher{
        position:absolute;left:1.45%;top:2.0%;z-index:40;
        min-width:10.6%;height:6.2%;padding:0 1.15%;
        display:flex;align-items:center;justify-content:center;gap:.48cqw;
        border:.16cqw solid rgba(255,238,165,.92);border-radius:999px;
        color:#fff7d4;background:linear-gradient(180deg,rgba(82,45,126,.96),rgba(50,22,91,.97));
        box-shadow:0 .42cqw 0 rgba(25,9,50,.75),0 .7cqw 1.3cqw rgba(0,0,0,.3),inset 0 .1cqw .16cqw rgba(255,255,255,.38);
        font:900 clamp(10px,1.14cqw,19px)/1 system-ui,-apple-system,"Segoe UI",sans-serif;
        letter-spacing:.01em;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation;
        transition:transform .16s ease,filter .16s ease,opacity .18s ease;
      }
      #tf-install-launcher::before{content:"↓";display:grid;place-items:center;width:1.85cqw;height:1.85cqw;min-width:16px;min-height:16px;border-radius:50%;background:#ffd85b;color:#532372;font-weight:1000;box-shadow:inset 0 -.12cqw .2cqw rgba(134,81,0,.25)}
      #tf-install-launcher:hover,#tf-install-launcher:focus-visible{outline:none;filter:brightness(1.13);transform:translateY(-2%)}
      #tf-install-launcher:active{transform:translateY(1%) scale(.98)}
      #tf-install-launcher[hidden]{display:none!important}

      #tf-install-modal{position:fixed;inset:auto;left:0;top:0;width:var(--tf-usable-width,100vw);height:var(--tf-usable-height,100vh);z-index:12000;display:none;place-items:center;padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));background:rgba(2,15,25,.7);backdrop-filter:blur(13px) saturate(.9);-webkit-backdrop-filter:blur(13px) saturate(.9)}
      #tf-install-modal.open{display:grid}
      .tf-install-card{position:relative;width:min(92vw,640px);max-height:min(88vh,720px);overflow:auto;overscroll-behavior:contain;padding:clamp(22px,4vw,38px);border-radius:30px;border:2px solid rgba(255,239,165,.92);color:#3f2a18;background:linear-gradient(180deg,#fff8db 0%,#f8e8bc 100%);box-shadow:0 30px 90px rgba(0,0,0,.48),inset 0 0 0 5px rgba(185,116,32,.14);-webkit-overflow-scrolling:touch}
      .tf-install-card::before{content:"";position:absolute;left:-12%;right:-12%;top:-95px;height:190px;pointer-events:none;background:radial-gradient(circle,rgba(255,214,75,.44),rgba(255,214,75,0) 68%)}
      .tf-install-close{position:absolute;top:14px;right:14px;width:42px;height:42px;border:0;border-radius:50%;background:#9d4b20;color:white;font:900 24px/1 system-ui;cursor:pointer;touch-action:manipulation}
      .tf-install-icon{position:relative;width:76px;height:76px;margin:0 auto 12px;display:grid;place-items:center;border-radius:24px;background:linear-gradient(160deg,#6f3cac,#3b1d77);border:4px solid #ffe38b;box-shadow:0 8px 0 #2f155f,0 14px 28px rgba(52,23,98,.28);font-size:38px}
      .tf-install-eyebrow{position:relative;margin:0 0 8px;text-align:center;color:#916019;font:900 12px/1.2 system-ui;letter-spacing:.13em}
      .tf-install-title{position:relative;margin:0;text-align:center;color:#5d2d19;font:950 clamp(28px,5vw,40px)/1.05 system-ui,-apple-system,"Segoe UI",sans-serif}
      .tf-install-body{position:relative;margin:14px auto 17px;max-width:520px;text-align:center;color:#5b4934;font:650 clamp(15px,2.5vw,18px)/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
      .tf-install-steps{position:relative;display:grid;gap:10px;margin:18px 0;padding:0;counter-reset:tfstep;list-style:none}
      .tf-install-steps li{counter-increment:tfstep;display:grid;grid-template-columns:36px 1fr;align-items:center;gap:11px;padding:11px 13px;border-radius:16px;background:rgba(255,255,255,.58);border:1px solid rgba(151,100,36,.18);font:750 15px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;color:#4e3824}
      .tf-install-steps li::before{content:counter(tfstep);width:32px;height:32px;display:grid;place-items:center;border-radius:50%;color:white;background:#7540a8;font-weight:950;box-shadow:0 3px 0 #492365}
      .tf-install-tip{position:relative;margin:12px 0 0;padding:11px 13px;border-radius:14px;background:#e6f5ff;border:1px solid #a9d6ef;color:#36546a;font:700 13px/1.35 system-ui}
      .tf-install-actions{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.7fr);gap:10px;margin-top:20px}
      .tf-install-actions button{min-height:50px;border-radius:16px;padding:10px 16px;font:900 15px/1 system-ui;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
      #tf-install-later{border:2px solid #b99358;background:rgba(255,255,255,.55);color:#694925}
      #tf-install-action{border:2px solid #542277;background:linear-gradient(180deg,#8d51bf,#633090);color:#fff9de;box-shadow:0 5px 0 #3c175b}
      #tf-install-action:active{transform:translateY(3px);box-shadow:0 2px 0 #3c175b}
      #tf-install-action:disabled{opacity:.65;cursor:default}
      .tf-install-success{text-align:center;padding:18px 8px 5px;color:#365b28;font:850 18px/1.4 system-ui}
      @media(max-width:560px){.tf-install-card{border-radius:24px;padding:24px 18px 20px}.tf-install-actions{grid-template-columns:1fr}.tf-install-actions #tf-install-action{grid-row:1}.tf-install-icon{width:64px;height:64px;font-size:32px}.tf-install-close{width:38px;height:38px}.tf-install-steps li{font-size:14px}}
      @media(max-height:520px) and (orientation:landscape){.tf-install-card{width:min(90vw,760px);max-height:90vh;padding:18px 24px}.tf-install-icon{width:48px;height:48px;margin-bottom:6px;font-size:25px;border-radius:16px}.tf-install-title{font-size:25px}.tf-install-body{font-size:13px;margin:8px auto}.tf-install-steps{grid-template-columns:repeat(3,1fr);gap:7px;margin:10px 0}.tf-install-steps li{grid-template-columns:26px 1fr;padding:8px;font-size:11px}.tf-install-steps li::before{width:24px;height:24px}.tf-install-actions{margin-top:10px}.tf-install-actions button{min-height:42px}.tf-install-tip{font-size:11px;padding:7px}}
    `;
    document.head.appendChild(style);
  }

  function ensureUI() {
    if (modal && launcher) return;
    injectStyle();

    launcher = document.createElement('button');
    launcher.id = 'tf-install-launcher';
    launcher.type = 'button';
    launcher.textContent = 'Install App';
    launcher.hidden = true;
    launcher.setAttribute('aria-label', 'Install Teacher Francis Reading World');
    homeScreen.appendChild(launcher);

    modal = document.createElement('div');
    modal.id = 'tf-install-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'tf-install-title');
    modal.innerHTML = `
      <section class="tf-install-card">
        <button class="tf-install-close" type="button" aria-label="Close install guide">×</button>
        <div class="tf-install-icon" aria-hidden="true">📚</div>
        <div class="tf-install-eyebrow" id="tf-install-eyebrow"></div>
        <h2 class="tf-install-title" id="tf-install-title"></h2>
        <p class="tf-install-body" id="tf-install-body"></p>
        <ol class="tf-install-steps" id="tf-install-steps"></ol>
        <div class="tf-install-tip" id="tf-install-tip" hidden></div>
        <div class="tf-install-actions">
          <button id="tf-install-later" type="button">Maybe later</button>
          <button id="tf-install-action" type="button"></button>
        </div>
      </section>`;
    document.body.appendChild(modal);
    try { window.tfApplySafeViewport?.(); } catch (_) {}

    launcher.addEventListener('click', () => { void openModal(true); });
    modal.querySelector('.tf-install-close').addEventListener('click', () => closeModal(true));
    modal.querySelector('#tf-install-later').addEventListener('click', () => closeModal(true));
    modal.addEventListener('pointerdown', event => {
      if (event.target === modal) closeModal(true);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('open')) closeModal(true);
    });
    modal.querySelector('#tf-install-action').addEventListener('click', handlePrimaryAction);
  }

  function renderModal() {
    ensureUI();
    const copy = installCopy();
    modal.querySelector('#tf-install-eyebrow').textContent = copy.eyebrow;
    modal.querySelector('#tf-install-title').textContent = copy.title;
    modal.querySelector('#tf-install-body').textContent = copy.body;
    const steps = modal.querySelector('#tf-install-steps');
    steps.replaceChildren(...copy.steps.map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
    const tip = modal.querySelector('#tf-install-tip');
    tip.hidden = !copy.tip;
    tip.textContent = copy.tip || '';
    const action = modal.querySelector('#tf-install-action');
    action.textContent = copy.action;
    action.dataset.native = copy.native ? '1' : '0';
    action.disabled = false;
  }

  async function openModal(manual = false) {
    if (await refreshInstallState({ force: true })) return;
    renderModal();
    modal.classList.add('open');
    modal.dataset.manual = manual ? '1' : '0';
    setTimeout(() => modal.querySelector('#tf-install-action')?.focus({ preventScroll: true }), 50);
  }

  function closeModal(remember = false) {
    if (!modal) return;
    modal.classList.remove('open');
    if (remember) rememberDismissal();
    try { launcher?.focus({ preventScroll: true }); } catch (_) {}
  }

  async function handlePrimaryAction() {
    const action = modal.querySelector('#tf-install-action');
    if (!deferredPrompt || action.dataset.native !== '1') {
      closeModal(true);
      return;
    }

    action.disabled = true;
    action.textContent = 'Opening install…';
    try {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result?.outcome === 'accepted') {
        clearDismissal();
        modal.querySelector('.tf-install-card').innerHTML = '<div class="tf-install-success">✓ Reading World is being installed.<br>You can open it from your app list or Home Screen.</div>';
        setTimeout(() => modal.classList.remove('open'), 1600);
      } else {
        rememberDismissal();
        modal.classList.remove('open');
      }
    } catch (_) {
      action.disabled = false;
      action.textContent = 'Install Reading World';
    } finally {
      deferredPrompt = null;
    }
  }

  function applyInstallVisibility(installed) {
    installedDetected = !!installed;
    if (launcher) launcher.hidden = installedDetected;
    if (installedDetected) modal?.classList.remove('open');
  }

  async function detectInstalledPWA() {
    if (isStandalone()) return true;

    // Chromium can query whether this same-scope PWA is installed when the
    // manifest declares itself in related_applications. This also lets the
    // browser notice a later uninstall without relying on a stale saved flag.
    if (typeof navigator.getInstalledRelatedApps === 'function') {
      try {
        const apps = await navigator.getInstalledRelatedApps();
        return Array.isArray(apps) && apps.some(app => app?.platform === 'webapp');
      } catch (_) {}
    }

    // On browsers without an installed-app query (notably iOS Safari), the
    // reliable signal is whether this page is currently running as the
    // Home-Screen/standalone app. We deliberately do not persist an
    // "installed" flag because it would remain stale after an uninstall.
    return false;
  }

  async function refreshInstallState({ force = false } = {}) {
    ensureUI();

    if (isStandalone()) {
      applyInstallVisibility(true);
      return true;
    }

    const now = Date.now();
    if (!force && installCheckInFlight) return installCheckInFlight;
    if (!force && now - lastInstallCheckAt < 1200) return installedDetected;

    lastInstallCheckAt = now;
    installCheckInFlight = (async () => {
      // Avoid a brief flash of the install button while a supported browser is
      // checking the device-level installed state.
      if (typeof navigator.getInstalledRelatedApps === 'function' && launcher) launcher.hidden = true;
      const installed = await detectInstalledPWA();
      applyInstallVisibility(installed);
      return installed;
    })().finally(() => { installCheckInFlight = null; });

    return installCheckInFlight;
  }

  function updateVisibility() {
    void refreshInstallState({ force: true });
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    applyInstallVisibility(false);
    void refreshInstallState({ force: true });
    if (modal?.classList.contains('open')) renderModal();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    clearDismissal();
    applyInstallVisibility(true);
    setTimeout(() => { void refreshInstallState({ force: true }); }, 1500);
  });

  try {
    window.matchMedia('(display-mode: standalone)').addEventListener('change', updateVisibility);
  } catch (_) {}

  async function maybeAutoShow() {
    if (autoShown || recentlyDismissed()) return;
    if (!homeScreen.classList.contains('active')) return;
    if (window.__TF_STARTUP_OVERLAY__ && !window.__TF_STARTUP_OVERLAY__.dismissed()) return;
    if (await refreshInstallState()) return;

    autoShown = true;
    setTimeout(async () => {
      if (!homeScreen.classList.contains('active') || recentlyDismissed()) return;
      if (await refreshInstallState({ force: true })) return;
      await openModal(false);
    }, 900);
  }

  ensureUI();
  void refreshInstallState({ force: true });

  // Wait until the existing welcome card has been dismissed so the two guides
  // never stack on top of one another.
  const autoTimer = setInterval(() => {
    void maybeAutoShow();
    if (autoShown || installedDetected || isStandalone()) clearInterval(autoTimer);
  }, 500);
  setTimeout(() => {
    void maybeAutoShow();
    if (autoShown || installedDetected || isStandalone()) clearInterval(autoTimer);
  }, 1200);

  // Re-check while the site is open. On browsers that implement
  // getInstalledRelatedApps(), uninstalling the PWA makes the Install button
  // return automatically on the next check. Event-driven checks make this
  // nearly immediate when the user switches back to the browser.
  setInterval(() => {
    if (!document.hidden) void refreshInstallState({ force: true });
  }, INSTALL_RECHECK_MS);
  window.addEventListener('focus', () => { void refreshInstallState({ force: true }); });
  window.addEventListener('pageshow', () => { void refreshInstallState({ force: true }); });
  window.addEventListener('online', () => { void refreshInstallState({ force: true }); });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) void refreshInstallState({ force: true });
  });

  // If a user returns to All Apps later, keep the install launcher state fresh.
  new MutationObserver(() => {
    void refreshInstallState({ force: true });
    void maybeAutoShow();
  }).observe(homeScreen, { attributes: true, attributeFilter: ['class'] });
})();
