Teacher Francis Reading World — PWA v1.1 iPad Touch Fix

WHAT THIS FIXES
1. Removes the malformed nested <script> that caused JavaScript source code to appear visibly above the Reading World dashboard in Safari.
2. Restores working dashboard module cards/taps.
3. Adds touch gestures without changing the six module visuals:
   - Swipe LEFT = next / forward
   - Swipe RIGHT = previous / backward
   - Kuwento Tayo: left/right swipe turns the STORY PAGE.
   - Fluency Pyramid: vertical swipes also map to its existing up/down navigation.
4. Bumps the offline cache to v1.1 and uses network-first page loading so GitHub Pages updates are less likely to remain stuck behind an older iPad cache.

HOW TO UPDATE GITHUB PAGES
- Replace the old repository files with ALL files from this folder.
- Commit and push the changes.
- Wait for GitHub Pages to finish deployment.
- On iPad Safari, reload the site. If the previous broken PWA was already added to the Home Screen, remove that old Home Screen copy and add the site again after verifying Safari shows the corrected dashboard.

IMPORTANT
Do not upload only index.html. The modules, assets, shared folder, manifest, service worker, icons and .nojekyll must stay together with the same folder structure.
