/* DailyAdventureBox shared site nav.
 * Drop a single <script src="nav.js"></script> tag at the top of <body>
 * on any page that needs the global nav. Renders identical markup + styles
 * to the home page (index.html) — single source of truth. To update tabs
 * across the entire site, edit this file once and push.
 */
(function() {
  'use strict';

  // Skip if a nav is already on this page (e.g. the homepage which has it inline)
  if (document.getElementById('mainNav')) return;

  var css = '\
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 16px 0; transition: background 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease; }\
.nav.scrolled { background: rgba(26, 26, 26, 0.95); backdrop-filter: blur(12px); padding: 10px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }\
.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; }\
.nav-logo { height: 44px; }\
.nav-links { display: flex; align-items: center; gap: 28px; list-style: none; padding: 0; margin: 0; }\
.nav-links a { font-family: \'Montserrat\', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; color: rgba(255,255,255,0.85); text-decoration: none; transition: color 0.2s ease; }\
.nav-links a:hover { color: #ffffff; }\
.nav-dropdown { position: relative; }\
.nav-dropdown > a { cursor: pointer; }\
.nav-dropdown > a::after { content: \' \\25BE\'; font-size: 10px; }\
.nav-dropdown-menu { display: none; position: absolute; top: 100%; left: 0; padding-top: 12px; background: rgba(30,30,30,0.95); backdrop-filter: blur(10px); border-radius: 10px; padding: 10px 0; min-width: 200px; box-shadow: 0 12px 40px rgba(0,0,0,0.5); z-index: 100; list-style: none; margin: 0; }\
.nav-dropdown:hover .nav-dropdown-menu, .nav-dropdown.open .nav-dropdown-menu { display: block; }\
.nav-dropdown-menu li a { display: block; padding: 8px 20px; font-size: 13px; white-space: nowrap; }\
.nav-dropdown-menu li a:hover { background: rgba(116,185,63,0.15); }\
.nav-cta { background: #74B93F !important; color: #fff !important; padding: 10px 22px !important; border-radius: 999px !important; font-size: 12px !important; letter-spacing: 0.8px !important; text-transform: uppercase; transition: transform 0.15s ease, box-shadow 0.15s ease !important; }\
.nav-cta:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(116, 185, 63, 0.4); }\
.nav-hamburger { display: none; background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; }\
@media (max-width: 768px) {\
  .nav-links { display: none; position: absolute; top: 100%; left: 0; right: 0; background: rgba(26,26,26,0.97); backdrop-filter: blur(12px); flex-direction: column; padding: 16px 24px; gap: 4px; }\
  .nav-links.show { display: flex; }\
  .nav-links li { width: 100%; }\
  .nav-links li a { display: block; padding: 10px 0; font-size: 14px; }\
  .nav-dropdown-menu { position: static !important; background: transparent !important; box-shadow: none !important; padding: 0 0 0 16px !important; min-width: auto !important; }\
  .nav-dropdown.open .nav-dropdown-menu, .nav-dropdown:hover .nav-dropdown-menu { display: block; }\
  .nav-hamburger { display: block; }\
}\
';

  var html = '\
<nav class="nav" id="mainNav">\
  <div class="nav-inner">\
    <a href="https://www.dailyadventurebox.com/" target="_top" style="display:inline-flex;align-items:center;text-decoration:none;"><img class="nav-logo" src="img/dab-logo.png" alt="DailyAdventureBox" onerror="this.src=\'https://dailyadventurebox-owner.github.io/Main-Website/img/dab-logo.png\'"></a>\
    <ul class="nav-links">\
      <li class="nav-dropdown">\
        <a href="#" data-toggle-dropdown>Home Page</a>\
        <ul class="nav-dropdown-menu">\
          <li><a href="https://www.dailyadventurebox.com/" target="_top">Home</a></li>\
          <li><a href="https://www.dailyadventurebox.com/#how-it-works" target="_top">How It Works</a></li>\
          <li><a href="https://www.dailyadventurebox.com/#locations" target="_top">Locations</a></li>\
          <li><a href="https://www.dailyadventurebox.com/#about" target="_top">Our Story</a></li>\
        </ul>\
      </li>\
      <li class="nav-dropdown">\
        <a href="#" data-toggle-dropdown>Additional Pages</a>\
        <ul class="nav-dropdown-menu">\
          <li><a href="https://www.dailyadventurebox.com/experiences" target="_top">Experiences</a></li>\
          <li><a href="https://www.dailyadventurebox.com/have-a-location" target="_top">Have a Location?</a></li>\
          <li><a href="https://www.dailyadventurebox.com/partnership-advertismentopportunities" target="_top">Advertise on Boxes</a></li>\
        </ul>\
      </li>\
      <li><a href="https://www.dailyadventurebox.com/fund-adventure" target="_top">Fund Adventure Portal</a></li>\
      <li><a href="https://www.dailyadventurebox.com/contractor-portal" target="_top">Contractor Portal</a></li>\
      <li><a href="https://www.dailyadventurebox.com/download-app" target="_top" class="nav-cta">Get the App</a></li>\
    </ul>\
    <button class="nav-hamburger" aria-label="Menu">&#9776;</button>\
  </div>\
</nav>';

  // Inject styles
  var style = document.createElement('style');
  style.id = 'dab-nav-style';
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  // Inject HTML when body is available
  function mount() {
    if (!document.body) { setTimeout(mount, 10); return; }
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.insertBefore(wrap.firstElementChild, document.body.firstChild);
    wire();
  }

  function wire() {
    // Scroll-aware background
    var nav = document.getElementById('mainNav');
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Dropdown toggle (touch + click)
    document.querySelectorAll('[data-toggle-dropdown]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        var dd = a.parentElement;
        var open = dd.classList.contains('open');
        document.querySelectorAll('.nav-dropdown.open').forEach(function(x) { x.classList.remove('open'); });
        if (!open) dd.classList.add('open');
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown.open').forEach(function(x) { x.classList.remove('open'); });
      }
    });

    // Mobile hamburger
    var burger = document.querySelector('.nav-hamburger');
    var links = document.querySelector('.nav-links');
    if (burger && links) {
      burger.addEventListener('click', function() { links.classList.toggle('show'); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
