/* ==========================================================================
   BASANTANI GROUP LLP — img-fallback.js
   Loaded in <head> so it is ready before any image finishes loading.

   Every <img> on this site carries onerror="imgFallback(this)".
   Until you drop a real photo into /images, a styled placeholder is shown
   with the exact filename that is expected. Once the file exists, the
   placeholder disappears automatically — no code changes needed.
   ========================================================================== */

function imgFallback(img) {
  if (img.dataset.fellBack) return;
  img.dataset.fellBack = '1';

  const div = document.createElement('div');
  div.className = 'img-fallback';

  const span = document.createElement('span');
  // .node-photo placeholders show initials instead of a filename
  span.textContent = img.dataset.initials || ('Add photo: ' + img.getAttribute('src'));
  div.appendChild(span);

  if (img.parentNode) img.parentNode.replaceChild(div, img);
}
