/* ==========================================================================
   BASANTANI GROUP LLP — main.js
   All site interactions and animations. No dependencies, no build step.
   --------------------------------------------------------------------------
   01. Helpers
   02. Preloader
   03. Custom cursor
   04. Scroll progress + back to top
   05. Navigation (sticky, mobile menu, active link)
   06. Scroll reveal (IntersectionObserver)
   07. Number counters
   08. Hero parallax
   09. Project filters
   10. Testimonial slider
   11. Lightbox
   12. Family tree (connectors + bio panel)
   13. Contact form validation
   14. Footer year
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     01. HELPERS
     ==================================================================== */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function on(el, evt, fn, opts) { if (el) el.addEventListener(evt, fn, opts); }

  /* ========================================================================
     02. PRELOADER
     ==================================================================== */
  (function preloader() {
    const pre = $('#preloader');
    if (!pre) return;

    const bar = $('.preloader-bar span', pre);
    const pct = $('.preloader-pct', pre);
    let progress = 0;

    const tick = setInterval(() => {
      progress += Math.random() * 18 + 6;
      if (progress >= 100) progress = 100;
      if (bar) bar.style.width = progress + '%';
      if (pct) pct.textContent = String(Math.floor(progress)).padStart(3, '0');
      if (progress === 100) {
        clearInterval(tick);
        setTimeout(() => {
          pre.classList.add('done');
          document.body.classList.remove('no-scroll');
          // Kick reveals for anything already in view
          window.dispatchEvent(new Event('scroll'));
        }, 320);
      }
    }, 130);

    document.body.classList.add('no-scroll');
    // Hard safety net so the site never stays locked behind the loader
    setTimeout(() => {
      clearInterval(tick);
      pre.classList.add('done');
      document.body.classList.remove('no-scroll');
    }, 3500);
  })();

  /* ========================================================================
     03. CUSTOM CURSOR
     ==================================================================== */
  (function cursor() {
    if (window.matchMedia('(pointer: coarse)').matches || reduceMotion) return;

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = 0, my = 0, rx = 0, ry = 0;

    on(window, 'mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    const hoverables = 'a, button, .btn, .node, .gallery-item, .filter-btn, .tst-dot, input, textarea, select';
    on(document, 'mouseover', (e) => {
      if (e.target.closest(hoverables)) ring.classList.add('grow');
    });
    on(document, 'mouseout', (e) => {
      if (e.target.closest(hoverables)) ring.classList.remove('grow');
    });
  })();

  /* ========================================================================
     04. SCROLL PROGRESS + BACK TO TOP
     ==================================================================== */
  const progressBar = $('#scroll-progress');
  const toTop = $('#to-top');

  function onScrollUI() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (toTop) toTop.classList.toggle('show', y > 600);

    const nav = $('.nav');
    if (nav) nav.classList.toggle('scrolled', y > 60);
  }

  on(window, 'scroll', onScrollUI, { passive: true });
  onScrollUI();

  on(toTop, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ========================================================================
     05. NAVIGATION
     ==================================================================== */
  (function nav() {
    const burger = $('.burger');
    const menu = $('.mobile-menu');
    if (!burger || !menu) return;

    function toggle(force) {
      const open = force !== undefined ? force : !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      document.body.classList.toggle('no-scroll', open);

      // Stagger the menu links in
      $$('a', menu).forEach((a, i) => {
        a.style.transitionDelay = open ? `${0.18 + i * 0.06}s` : '0s';
      });
    }

    on(burger, 'click', () => toggle());
    $$('a', menu).forEach((a) => on(a, 'click', () => toggle(false)));
    on(document, 'keydown', (e) => { if (e.key === 'Escape') toggle(false); });
  })();

  // Highlight the current page in the nav
  (function activeLink() {
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $$('.nav-links a, .mobile-menu a').forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === here || (here === '' && href === 'index.html')) a.classList.add('active');
    });
  })();

  /* ========================================================================
     06. SCROLL REVEAL
     ==================================================================== */
  (function reveal() {
    const items = $$('[data-reveal], [data-stagger]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('in'), delay * 1000);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach((el) => io.observe(el));
  })();

  /* ========================================================================
     07. NUMBER COUNTERS
     Usage: <span class="stat-num" data-count="120" data-suffix="+">0</span>
     ==================================================================== */
  (function counters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;

    function run(el) {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = (el.dataset.count.split('.')[1] || '').length;
      const dur = 1900;
      const start = performance.now();

      function frame(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (!('IntersectionObserver' in window) || reduceMotion) {
      nums.forEach((el) => {
        el.textContent = (el.dataset.prefix || '') + el.dataset.count + (el.dataset.suffix || '');
      });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });

    nums.forEach((el) => io.observe(el));
  })();

  /* ========================================================================
     08. HERO PARALLAX
     ==================================================================== */
  (function parallax() {
    if (reduceMotion) return;
    const layers = $$('[data-parallax]');
    if (!layers.length) return;

    let ticking = false;
    function update() {
      const y = window.scrollY;
      layers.forEach((l) => {
        const speed = parseFloat(l.dataset.parallax) || 0.25;
        l.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    }
    on(window, 'scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

  /* ========================================================================
     09. PROJECT FILTERS
     ==================================================================== */
  (function filters() {
    const bar = $('.filter-bar');
    const grid = $('#project-grid');
    if (!bar || !grid) return;

    const cards = $$('[data-cat]', grid);
    const empty = $('#no-results');

    on(bar, 'click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      $$('.filter-btn', bar).forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      let shown = 0;

      cards.forEach((card, i) => {
        const match = cat === 'all' || card.dataset.cat.split(' ').includes(cat);
        if (match) shown++;
        card.classList.toggle('filter-hidden', !match);
        if (match) {
          card.classList.remove('in');
          setTimeout(() => card.classList.add('in'), 40 + i * 55);
        }
      });

      if (empty) empty.style.display = shown === 0 ? 'block' : 'none';
    });
  })();

  /* ========================================================================
     10. TESTIMONIAL SLIDER
     ==================================================================== */
  (function slider() {
    const wrap = $('.tst-wrap');
    if (!wrap) return;

    const slides = $$('.tst-slide', wrap);
    const dots = $$('.tst-dot', wrap);
    if (slides.length < 2) return;

    let idx = 0;
    let timer;

    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function play() { timer = setInterval(() => go(idx + 1), 6500); }
    function stop() { clearInterval(timer); }

    dots.forEach((d, i) => on(d, 'click', () => { stop(); go(i); play(); }));
    on(wrap, 'mouseenter', stop);
    on(wrap, 'mouseleave', play);
    go(0);
    play();
  })();

  /* ========================================================================
     11. LIGHTBOX
     Any element with [data-lightbox] opens its inner image full-screen.
     ==================================================================== */
  (function lightbox() {
    const triggers = $$('[data-lightbox]');
    if (!triggers.length) return;

    const box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = `
      <div class="lightbox-close" aria-label="Close">&#10005;</div>
      <div class="lightbox-stage"></div>
      <div class="lightbox-cap"></div>`;
    document.body.appendChild(box);

    const stage = $('.lightbox-stage', box);
    const cap = $('.lightbox-cap', box);

    function open(trigger) {
      const inner = trigger.querySelector('img, .img-fallback');
      stage.innerHTML = '';
      if (inner) stage.appendChild(inner.cloneNode(true));
      cap.textContent = trigger.dataset.lightbox || '';
      box.classList.add('open');
      document.body.classList.add('no-scroll');
    }
    function close() {
      box.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }

    triggers.forEach((t) => on(t, 'click', () => open(t)));
    on(box, 'click', (e) => { if (e.target === box || e.target.closest('.lightbox-close')) close(); });
    on(document, 'keydown', (e) => { if (e.key === 'Escape') close(); });
  })();

  /* ========================================================================
     12. FAMILY TREE
     ==================================================================== */
  (function familyTree() {
    const tree = $('#family-tree');
    if (!tree) return;

    /* --- 12a. Draw SVG connectors between nodes ---------------------- */
    const svg = $('#tree-lines', tree);

    function centerOf(el, host) {
      const a = el.getBoundingClientRect();
      const b = host.getBoundingClientRect();
      return {
        x: a.left - b.left + a.width / 2,
        top: a.top - b.top,
        bottom: a.bottom - b.bottom + b.height
      };
    }

    function drawLines() {
      if (!svg) return;
      svg.innerHTML = '';
      const rect = tree.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
      svg.setAttribute('width', rect.width);
      svg.setAttribute('height', rect.height);

      // Each connector is declared on a node via data-parent="<id of parent node>"
      $$('[data-parent]', tree).forEach((child) => {
        const parent = $(`#${child.dataset.parent}`, tree);
        if (!parent) return;

        const p = centerOf(parent.querySelector('.node-photo') || parent, tree);
        const c = centerOf(child.querySelector('.node-photo') || child, tree);
        const pBottom = parent.getBoundingClientRect().bottom - rect.top;
        const cTop = child.getBoundingClientRect().top - rect.top;
        const mid = pBottom + (cTop - pBottom) / 2;

        const d = `M ${p.x} ${pBottom} V ${mid} H ${c.x} V ${cTop}`;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        svg.appendChild(path);
        const len = path.getTotalLength();
        path.style.setProperty('--len', len);
      });

      requestAnimationFrame(() => svg.classList.add('drawn'));
    }

    // Draw once laid out, and again on resize
    window.addEventListener('load', () => setTimeout(drawLines, 260));
    setTimeout(drawLines, 700);
    let rt;
    on(window, 'resize', () => { clearTimeout(rt); rt = setTimeout(drawLines, 220); });

    /* --- 12b. Bio side panel ----------------------------------------- */
    const panel = $('#bio-panel');
    const backdrop = $('#bio-backdrop');
    if (!panel) return;

    const elName  = $('#bio-name', panel);
    const elRole  = $('#bio-role', panel);
    const elText  = $('#bio-text', panel);
    const elPhoto = $('#bio-photo', panel);
    const elFacts = $('#bio-facts', panel);

    function openBio(node) {
      $$('.node', tree).forEach((n) => n.classList.remove('is-open'));
      node.classList.add('is-open');

      elName.textContent = node.dataset.name || '';
      elRole.textContent = node.dataset.role || '';
      elText.textContent = node.dataset.bio || 'Biography coming soon.';

      const media = node.querySelector('.node-photo img, .node-photo .img-fallback');
      elPhoto.innerHTML = '';
      if (media) elPhoto.appendChild(media.cloneNode(true));

      elFacts.innerHTML = '';
      const facts = [
        ['Relation', node.dataset.relation],
        ['Generation', node.dataset.generation],
        ['Focus', node.dataset.focus]
      ].filter(([, v]) => v);

      facts.forEach(([k, v]) => {
        const d = document.createElement('div');
        d.innerHTML = `<span class="k">${k}</span><span class="v">${v}</span>`;
        elFacts.appendChild(d);
      });

      panel.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
    }

    function closeBio() {
      panel.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      $$('.node', tree).forEach((n) => n.classList.remove('is-open'));
    }

    $$('.node', tree).forEach((n) => {
      n.setAttribute('tabindex', '0');
      on(n, 'click', () => openBio(n));
      on(n, 'keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBio(n); } });
    });

    on($('#bio-close'), 'click', closeBio);
    on(backdrop, 'click', closeBio);
    on(document, 'keydown', (e) => { if (e.key === 'Escape') closeBio(); });
  })();

  /* ========================================================================
     13. CONTACT FORM VALIDATION
     Front-end only — no backend yet. See README for wiring it to email.
     ==================================================================== */
  (function contactForm() {
    const form = $('#contact-form');
    if (!form) return;

    const success = $('#form-success');

    function setError(field, on) {
      field.closest('.field').classList.toggle('error', on);
    }

    function validate() {
      let ok = true;
      $$('[required]', form).forEach((f) => {
        const empty = !f.value.trim();
        const badEmail = f.type === 'email' && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value);
        const badPhone = f.type === 'tel' && f.value && !/^[\d\s+()-]{8,}$/.test(f.value);
        const bad = empty || badEmail || badPhone;
        setError(f, bad);
        if (bad) ok = false;
      });
      return ok;
    }

    $$('input, textarea, select', form).forEach((f) => {
      on(f, 'input', () => { if (f.closest('.field').classList.contains('error')) validate(); });
    });

    on(form, 'submit', (e) => {
      e.preventDefault();
      if (!validate()) {
        const first = $('.field.error', form);
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const btn = $('button[type="submit"]', form);
      const label = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Demo behaviour. Replace with a real endpoint (see README).
      setTimeout(() => {
        form.reset();
        btn.textContent = label;
        btn.disabled = false;
        if (success) {
          success.classList.add('show');
          setTimeout(() => success.classList.remove('show'), 7000);
        }
      }, 1100);
    });
  })();

  /* ========================================================================
     14. FOOTER YEAR
     ==================================================================== */
  $$('.year').forEach((el) => { el.textContent = new Date().getFullYear(); });

})();
