/* DailyAdventureBox: site-wide notice pop-up.
 *
 * Everything about this pop-up lives in this one file: the wording, the look
 * and the moment it stops showing. Each page loads it with one line:
 *   <script src="assets/notice.js"></script>
 *
 * To move the end date, edit NOTICE_ENDS_AT below.
 * To take it down early, set NOTICE_ENDS_AT to a time in the past
 * (or delete this file and the <script> lines that load it).
 *
 * It needs nothing from the page around it, so it also works inside the
 * full-screen frames on dailyadventurebox.com.
 */
(function () {
  'use strict';

  /* ======== EDIT HERE ======== */
  /* The pop-up stops appearing at this moment: 8:00 AM Eastern, November 14, 2026. */
  var NOTICE_ENDS_AT = '2026-11-14T13:00:00Z';
  /* =========================== */

  /* Shown once per browser session. This key remembers that it was shown;
     give it a new name to show a new notice to everyone again. */
  var SEEN_KEY = 'dab-notice-update-2026-11-14';

  var TITLE = 'Business-wide update in progress';
  var PARAGRAPHS = [
    'Daily Adventure Box is updating its software and hardware across the business. Our locations will not be operational until November 14, 2026. Once everything is updated, we will reopen locations one at a time.',
    'At the same time, we are completing our annual safety inspections on all gear, equipment, and locks to keep quality and safety at the highest standards.'
  ];
  var CONTACT_LABEL = 'Questions? Email ';
  var CONTACT_EMAIL = 'support@dailyadventurebox.com'; /* plain text on purpose: no link, no button */

  var w = window, d = document;
  if (w.__dabNotice) return;
  w.__dabNotice = true;

  if (!(Date.now() < Date.parse(NOTICE_ENDS_AT))) return;

  function wasShown() {
    try { return w.sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) { return false; }
  }
  function markShown() {
    try { w.sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* storage blocked: it just shows again next page */ }
  }
  function isFramed() {
    try { return w.self !== w.top; } catch (e) { return true; }
  }
  /* The terms pages stretch their frame to the full length of the document, so the
     middle of the frame can be far below the screen. Then pin the pop-up to the top. */
  function frameIsTall() {
    var sh = (w.screen && w.screen.height) || 0;
    return isFramed() && sh > 0 && w.innerHeight > sh + 40;
  }

  var CSS = [
    '#dab-notice{position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;margin:0;',
    'padding:16px;padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));',
    'background:rgba(11,37,69,.72);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;',
    'box-sizing:border-box;opacity:0;transition:opacity .25s ease;}',
    '#dab-notice.dabn-in{opacity:1}',
    '#dab-notice.dabn-tall{align-items:flex-start}',
    '#dab-notice *{box-sizing:border-box}',
    '#dab-notice .dabn-dialog{position:relative;width:100%;max-width:520px;margin:auto;padding:38px 28px 28px;background:#fff;color:#16202A;border-radius:20px;',
    'box-shadow:0 30px 80px rgba(11,37,69,.35);overflow:hidden;text-align:left;font-family:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;',
    'font-size:16px;line-height:1.6;transform:translateY(12px);transition:transform .35s cubic-bezier(.16,1,.3,1)}',
    '#dab-notice.dabn-in .dabn-dialog{transform:none}',
    '#dab-notice.dabn-tall .dabn-dialog{margin:8px auto auto}',
    '#dab-notice .dabn-dialog::before{content:"";position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#74B93F,#5BBDD4)}',
    '#dab-notice .dabn-title{margin:0 40px 14px 0;padding:0;border:0;outline:none;font-family:"Montserrat","Inter",system-ui,-apple-system,"Segoe UI",Arial,sans-serif;',
    'font-weight:800;font-size:24px;line-height:1.2;letter-spacing:0;text-transform:none;color:#0B2545;background:none;text-wrap:balance}',
    '#dab-notice .dabn-p{margin:0 0 12px;padding:0;font-size:16px;line-height:1.6;color:#16202A;font-weight:400}',
    '#dab-notice .dabn-contact{margin:18px 0 22px;padding:14px 16px;border-radius:12px;background:#F7F3EC;font-size:15px;line-height:1.5;color:#5B6770;overflow-wrap:anywhere;word-break:break-word}',
    '#dab-notice .dabn-email{font-weight:700;color:#16202A}',
    '#dab-notice .dabn-ok{display:flex;align-items:center;justify-content:center;width:100%;min-height:48px;margin:0;padding:14px 28px;border:0;border-radius:999px;',
    'background:#74B93F;color:#0B2545;font-family:"Montserrat","Inter",system-ui,-apple-system,"Segoe UI",Arial,sans-serif;font-weight:800;font-size:14px;',
    'letter-spacing:.08em;text-transform:uppercase;cursor:pointer;box-shadow:0 10px 30px rgba(116,185,63,.35);transition:background .2s}',
    '#dab-notice .dabn-ok:hover{background:#86C656}',
    '#dab-notice .dabn-x{position:absolute;top:14px;right:12px;display:flex;align-items:center;justify-content:center;width:44px;height:44px;margin:0;padding:0;border:0;',
    'border-radius:50%;background:transparent;color:#16202A;font-family:Arial,sans-serif;font-size:30px;line-height:1;cursor:pointer}',
    '#dab-notice .dabn-x:hover{background:#F7F3EC}',
    '#dab-notice button:focus-visible{outline:3px solid #2E8FA8;outline-offset:3px}',
    /* small phones: keep the email address on one line */
    '@media (max-width:380px){#dab-notice .dabn-dialog{padding:34px 18px 18px}#dab-notice .dabn-title{font-size:21px}#dab-notice .dabn-p{font-size:15px}',
    '#dab-notice .dabn-contact{padding:12px}#dab-notice .dabn-email{font-size:13.5px}}',
    '@media (max-width:300px){#dab-notice .dabn-email{font-size:11.5px}}',
    /* short portrait screens: tighten spacing so the whole card fits */
    '@media (max-height:640px) and (orientation:portrait){#dab-notice{padding:10px}#dab-notice .dabn-dialog{padding-top:30px;padding-bottom:16px}',
    '#dab-notice .dabn-title{font-size:20px;margin-bottom:10px}#dab-notice .dabn-p{font-size:14.5px;line-height:1.5;margin-bottom:8px}',
    '#dab-notice .dabn-contact{margin:12px 0 14px;padding:10px 12px;font-size:14px}#dab-notice .dabn-ok{min-height:44px;padding:10px 24px}}',
    '@media (max-height:500px) and (orientation:landscape){#dab-notice .dabn-dialog{max-width:680px;padding:26px 24px 18px}',
    '#dab-notice .dabn-title{font-size:20px;margin-bottom:8px}#dab-notice .dabn-p{font-size:14.5px;line-height:1.5;margin-bottom:8px}',
    '#dab-notice .dabn-contact{margin:10px 0 14px;padding:10px 14px;font-size:14px}#dab-notice .dabn-ok{min-height:44px;padding:10px 24px}}',
    '@media (prefers-reduced-motion:reduce){#dab-notice,#dab-notice .dabn-dialog{transition:none;transform:none}}'
  ].join('');

  function el(tag, cls, text) {
    var e = d.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function show() {
    var style = el('style');
    style.id = 'dab-notice-style';
    style.textContent = CSS;
    (d.head || d.documentElement).appendChild(style);

    var overlay = el('div');
    overlay.id = 'dab-notice';

    var dialog = el('div', 'dabn-dialog');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'dabn-title');
    dialog.setAttribute('aria-describedby', 'dabn-body dabn-contact');

    var closeX = el('button', 'dabn-x', '×');
    closeX.type = 'button';
    closeX.setAttribute('aria-label', 'Close');

    var title = el('h2', 'dabn-title', TITLE);
    title.id = 'dabn-title';
    title.tabIndex = -1;

    var body = el('div', 'dabn-body');
    body.id = 'dabn-body';
    for (var i = 0; i < PARAGRAPHS.length; i++) body.appendChild(el('p', 'dabn-p', PARAGRAPHS[i]));

    var contact = el('p', 'dabn-contact', CONTACT_LABEL);
    contact.id = 'dabn-contact';
    contact.appendChild(el('strong', 'dabn-email', CONTACT_EMAIL));

    var ok = el('button', 'dabn-ok', 'Got it');
    ok.type = 'button';

    dialog.appendChild(closeX);
    dialog.appendChild(title);
    dialog.appendChild(body);
    dialog.appendChild(contact);
    dialog.appendChild(ok);
    overlay.appendChild(dialog);

    var lastFocus = d.activeElement;
    var savedOverflow = null;

    /* Stop the page behind from scrolling, except in a stretched frame (nothing to scroll there). */
    function lockScroll(on) {
      var root = d.documentElement;
      if (on && savedOverflow === null) { savedOverflow = root.style.overflow; root.style.overflow = 'hidden'; }
      else if (!on && savedOverflow !== null) { root.style.overflow = savedOverflow; savedOverflow = null; }
    }
    function fit() {
      var tall = frameIsTall();
      if (tall) overlay.className = overlay.className.replace(/\s*dabn-tall/g, '') + ' dabn-tall';
      else overlay.className = overlay.className.replace(/\s*dabn-tall/g, '');
      lockScroll(!tall);
    }
    function close() {
      if (!overlay.parentNode) return;
      d.removeEventListener('keydown', onKey, true);
      w.removeEventListener('resize', fit);
      lockScroll(false);
      overlay.parentNode.removeChild(overlay);
      if (lastFocus && lastFocus !== d.body && lastFocus.focus && d.documentElement.contains(lastFocus)) {
        try { lastFocus.focus(); } catch (e) { /* nothing to return to */ }
      }
    }
    function onKey(e) {
      var key = e.key || '';
      if (key === 'Escape' || key === 'Esc' || e.keyCode === 27) { e.preventDefault(); close(); return; }
      if (key === 'Tab' || e.keyCode === 9) {
        var inside = dialog.contains(d.activeElement);
        if (e.shiftKey && (!inside || d.activeElement === closeX)) { e.preventDefault(); ok.focus(); }
        else if (!e.shiftKey && (!inside || d.activeElement === ok)) { e.preventDefault(); closeX.focus(); }
      }
    }

    closeX.addEventListener('click', close);
    ok.addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    d.addEventListener('keydown', onKey, true);
    w.addEventListener('resize', fit);

    d.body.appendChild(overlay);
    fit();
    markShown();
    try { title.focus({ preventScroll: true }); } catch (e) { title.focus(); }
    var raf = w.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
    raf(function () { raf(function () { overlay.className += ' dabn-in'; }); });
  }

  function init() {
    if (wasShown() || !d.body || d.getElementById('dab-notice')) return;
    /* On a dailyadventurebox.com page that frames this site, the framed page shows it; don't show it twice. */
    if (!isFramed() && d.querySelector('iframe[src*="dailyadventurebox-owner.github.io/Main-Website"]')) return;
    show();
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();
})();
