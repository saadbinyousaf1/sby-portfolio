// © https://saadbinyousaf.dev/ © //
(function () {
  'use strict';

  // © https://saadbinyousaf.dev/ © //
  var PROJECTS = {
    civix: {
      eyebrow: '✦ White-label Login Portal',
      title: 'Civix CRM',
      img: 'assets/login-civix.jpg',
      url: 'https://app.civixcrm.net',
      tags: ['Full CRM Reskin', 'Custom Login', 'White-label', 'GHL'],
      desc: 'A full GoHighLevel white-label overhaul for Civix — custom branded login portal with aurora gradient backdrop, dark glassmorphic card, and a purple-to-magenta CTA. Every pixel of the GHL interface was replaced with Civix branding so their clients never see GoHighLevel.'
    },
    launchpad: {
      eyebrow: '✦ White-label Login Portal',
      title: 'The LaunchPad',
      img: 'assets/login-launchpad.jpg',
      url: 'https://app.launchpadonboarding.net',
      tags: ['Light Theme', 'Custom Login', 'Illustrated', 'GHL'],
      desc: 'Clean onboarding portal for The LaunchPad — a light paper-texture background with engineering gear motifs and a 3D rocket launch visual. Designed to make new sub-accounts feel welcomed from the very first login.'
    },
    wolfpack: {
      eyebrow: '✦ White-label Login Portal',
      title: 'Wolfpack Agency',
      img: 'assets/login-wolfpack.jpg',
      url: 'https://app.wolfpackagency.net',
      tags: ['Dark Glow', 'Brand Identity', 'Custom CSS', 'GHL'],
      desc: 'Aggressive dark brand identity for Wolfpack Agency — glowing red wolf emblem on near-black, neon red card border glow, and a crimson Sign In CTA. Unmistakably on-brand before anyone types a single character.'
    }
  };

  var root = document.documentElement;
  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var introDone = false;

  initHeader();
  initAutomation();
  initAIEmployee();

  if (!window.gsap) {
    root.classList.remove('js-anim');
    document.querySelectorAll('.reveal').forEach(function (el) { el.style.opacity = 1; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // © https://saadbinyousaf.dev/ © //
  function buildStars() {
    var counts = [420, 140, 60];
    var sizes = [1, 2, 3];
    var w = Math.max(innerWidth, 1200);
    var h = Math.max(innerHeight, 800) + 640;
    document.querySelectorAll('.star-layer').forEach(function (layer, i) {
      var shadows = [];
      for (var n = 0; n < counts[i]; n++) {
        var x = Math.floor(Math.random() * w);
        var y = Math.floor(Math.random() * h);
        var a = (0.22 + Math.random() * 0.6).toFixed(2);
        var c = Math.random() < 0.14 ? '214,240,119' : '242,241,234';
        shadows.push(x + 'px ' + y + 'px rgba(' + c + ',' + a + ')');
      }
      var dot = layer.querySelector('i');
      dot.style.width = sizes[i] + 'px';
      dot.style.height = sizes[i] + 'px';
      dot.style.boxShadow = shadows.join(',');
    });
  }

  // © https://saadbinyousaf.dev/ © //
  function initSkyScroll() {
    if (reduceMotion) return;
    document.querySelectorAll('.star-layer').forEach(function (layer) {
      gsap.to(layer, {
        y: parseFloat(layer.getAttribute('data-scroll')) || -200,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.8 }
      });
    });
  }

  // © https://saadbinyousaf.dev/ © //
  var title = document.getElementById('heroTitle');
  var stage = document.getElementById('collageStage');
  var cards = gsap.utils.toArray('.collage-card');
  var heroBits = ['#heroEyebrow', '#heroSub', '#heroCtas'];

  gsap.set(stage, { rotationY: -18, rotationX: 10 });
  cards.forEach(function (c) { gsap.set(c, { z: parseFloat(c.getAttribute('data-z')) || 0 }); });
  gsap.set(title, { transformPerspective: 900, transformOrigin: '50% 60%' });

  function drawUnderline(tl, at) {
    var stroke = document.getElementById('revStroke');
    if (!stroke) return;
    var len = stroke.getTotalLength();
    gsap.set(stroke, { strokeDasharray: len, strokeDashoffset: len });
    tl.to(stroke, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, at);
  }

  function finishIntro() {
    introDone = true;
    root.classList.remove('js-anim');
    gsap.set(title, { clearProps: 'filter' });
  }

  function runIntro() {
    if (reduceMotion) {
      gsap.set([title, cards, heroBits], { autoAlpha: 1, y: 0 });
      var s = document.getElementById('revStroke');
      if (s) s.style.strokeDashoffset = 0;
      finishIntro();
      return;
    }

    gsap.set(title, { autoAlpha: 0, y: 30, scale: 0.92, rotationX: 35, filter: 'blur(14px)' });
    gsap.set(heroBits, { autoAlpha: 0, y: 24 });
    gsap.set(cards, { autoAlpha: 0 });

    var tl = gsap.timeline({ onComplete: finishIntro });
    tl.fromTo('.nebula', { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.4, ease: 'power2.out' }, 0)
      .to('#heroEyebrow', { autoAlpha: 1, y: 0, duration: 0.5 }, 0.05)
      .to(title, {
        autoAlpha: 1, y: 0, scale: 1, rotationX: 0, filter: 'blur(0px)',
        duration: 0.9, ease: 'expo.out'
      }, 0.1)
      .to('#heroSub', { autoAlpha: 1, y: 0, duration: 0.6 }, 0.3)
      .to('#heroCtas', { autoAlpha: 1, y: 0, duration: 0.6 }, 0.4)
      .fromTo(cards,
        { autoAlpha: 0, rotationY: 40, yPercent: 30 },
        { autoAlpha: 1, rotationY: 0, yPercent: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out' },
        0.25);
    drawUnderline(tl, 0.5);
  }

  // © https://saadbinyousaf.dev/ © //
  function initCollage() {
    if (reduceMotion) return;
    cards.forEach(function (c, i) {
      gsap.to(c, {
        y: i % 2 ? 12 : -12,
        duration: 3.2 + i * 0.7,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.6
      });
    });
    gsap.to('.collage-scroll', {
      rotationX: -14, rotationY: 8, y: -80, z: -120,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
    gsap.to('.hero-left', {
      yPercent: -14, autoAlpha: 0.25,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  // © https://saadbinyousaf.dev/ © //
  function initPointer3D() {
    if (!finePointer || reduceMotion) return;
    var pars = gsap.utils.toArray('.par').map(function (el) {
      return {
        d: parseFloat(el.getAttribute('data-depth')) || 10,
        x: gsap.quickTo(el, 'x', { duration: 1.2 }),
        y: gsap.quickTo(el, 'y', { duration: 1.2 })
      };
    });
    var nebX = gsap.quickTo('.nebula', 'x', { duration: 2 });
    var nebY = gsap.quickTo('.nebula', 'y', { duration: 2 });
    var glow = document.querySelector('.cursor-glow');
    var glowIdle;
    var gx = gsap.quickTo(glow, 'x', { duration: 0.6 });
    var gy = gsap.quickTo(glow, 'y', { duration: 0.6 });
    var tX = gsap.quickTo(title, 'rotationX', { duration: 0.8 });
    var tY = gsap.quickTo(title, 'rotationY', { duration: 0.8 });
    var sX = gsap.quickTo(stage, 'rotationX', { duration: 1 });
    var sY = gsap.quickTo(stage, 'rotationY', { duration: 1 });
    var hero = document.querySelector('.hero');

    addEventListener('pointermove', function (e) {
      var nx = e.clientX / innerWidth - 0.5;
      var ny = e.clientY / innerHeight - 0.5;
      pars.forEach(function (p) { p.x(-nx * p.d); p.y(-ny * p.d); });
      nebX(nx * 60); nebY(ny * 60);
      gx(e.clientX); gy(e.clientY);
      gsap.to(glow, { autoAlpha: 1, duration: 0.4, overwrite: 'auto' });
      clearTimeout(glowIdle);
      glowIdle = setTimeout(function () { gsap.to(glow, { autoAlpha: 0, duration: 1.2 }); }, 1600);
      if (!introDone) return;
      var r = hero.getBoundingClientRect();
      if (e.clientY < r.bottom) {
        tY(nx * 10); tX(-ny * 8);
        sY(-18 + nx * 24); sX(10 - ny * 16);
      } else {
        tY(0); tX(0); sY(-18); sX(10);
      }
    });
    document.addEventListener('pointerleave', function () {
      gsap.to(glow, { autoAlpha: 0, duration: 0.4 });
    });
  }

  // © https://saadbinyousaf.dev/ © //
  function initTilt() {
    document.querySelectorAll('.tilt').forEach(function (el) {
      var g = document.createElement('span');
      g.className = 'glare';
      el.prepend(g);
      if (!finePointer || reduceMotion) return;
      gsap.set(el, { transformPerspective: 900 });
      var rx = gsap.quickTo(el, 'rotationX', { duration: 0.5 });
      var ry = gsap.quickTo(el, 'rotationY', { duration: 0.5 });
      var ty = gsap.quickTo(el, 'y', { duration: 0.5 });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        ry(px * 12); rx(-py * 12); ty(-8);
      });
      el.addEventListener('pointerleave', function () { rx(0); ry(0); ty(0); });
    });
  }

  // © https://saadbinyousaf.dev/ © //
  function initReveals() {
    if (reduceMotion) {
      gsap.set('.reveal', { autoAlpha: 1 });
      return;
    }
    gsap.utils.toArray('.reveal').forEach(function (el) {
      if (el.closest('.hero')) return;
      gsap.fromTo(el, { autoAlpha: 0, y: 32 }, {
        autoAlpha: 1, y: 0, duration: 0.85,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
    gsap.set('.tilt', { autoAlpha: 0, y: 50, rotationX: -14, transformPerspective: 900, transformOrigin: '50% 100%' });
    ScrollTrigger.batch('.tilt', {
      start: 'top 90%',
      once: true,
      onEnter: function (els) {
        gsap.to(els, { autoAlpha: 1, y: 0, rotationX: 0, duration: 1.1, stagger: 0.12, overwrite: true });
      }
    });
  }

  // © https://saadbinyousaf.dev/ © //
  function initCursor() {
    var ring = document.getElementById('cursorRing');
    if (!finePointer || !ring) return;
    var mx = 0, my = 0, rx = 0, ry = 0, started = false, idle;
    function wake() {
      ring.classList.add('on');
      clearTimeout(idle);
      idle = setTimeout(function () { ring.classList.remove('on'); }, 1800);
    }
    addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!started) { rx = mx; ry = my; started = true; }
      wake();
    }, { passive: true });
    document.addEventListener('pointerleave', function () { ring.classList.remove('on'); });
    addEventListener('pointerdown', function () { ring.classList.add('is-down'); });
    addEventListener('pointerup', function () { ring.classList.remove('is-down'); });
    (function loop() {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('pointerover', function (e) {
      var t = e.target;
      ring.classList.toggle('is-text', !!t.closest('input, textarea, select, [contenteditable="true"]'));
      ring.classList.toggle('is-hover', !!t.closest('a, button, .portal, .site, [role="button"], summary, label'));
    });
  }

  // © https://saadbinyousaf.dev/ © //
  function initTrail() {
    if (!finePointer || reduceMotion) return;
    var c = document.querySelector('.cursor-stars');
    var ctx = c.getContext('2d');
    var dpr = Math.min(devicePixelRatio || 1, 2);
    var parts = [];
    var lx = null, ly = null;
    function size() {
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    addEventListener('resize', size);
    addEventListener('pointermove', function (e) {
      if (lx !== null) {
        var dist = Math.hypot(e.clientX - lx, e.clientY - ly);
        var n = Math.min(3, Math.floor(dist / 14));
        for (var i = 0; i < n; i++) {
          var t = Math.random();
          parts.push({
            x: lx + (e.clientX - lx) * t + (Math.random() - 0.5) * 10,
            y: ly + (e.clientY - ly) * t + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5 - 0.15,
            s: 0.6 + Math.random() * 1.4,
            life: 1
          });
        }
      }
      lx = e.clientX; ly = e.clientY;
    });
    (function loop() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.018;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = '#D6F077';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s * p.life + 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    })();
  }

  // © https://saadbinyousaf.dev/ © //
  function initMagnetic() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      var bx = gsap.quickTo(btn, 'x', { duration: 0.4 });
      var by = gsap.quickTo(btn, 'y', { duration: 0.4 });
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        bx((e.clientX - r.left - r.width / 2) * 0.25);
        by((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener('pointerleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  // © https://saadbinyousaf.dev/ © //
  function initAutomation() {
    var sec = document.getElementById('automation');
    if (!sec) return;
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // © https://saadbinyousaf.dev/ © //
    var msg = document.getElementById('drsMsg');
    var typeEl = document.getElementById('drsType');
    var restart = document.getElementById('drsRestart');
    var reply = 'book.apexroofing.com/inspection';
    var typeTimer = null, loopTimer = null;
    function typeReply() {
      clearTimeout(typeTimer); clearTimeout(loopTimer);
      msg.classList.remove('done', 'sent');
      if (still) { typeEl.textContent = reply; msg.classList.add('done'); return; }
      var i = 0;
      typeEl.textContent = '';
      (function step() {
        typeEl.textContent = reply.slice(0, ++i);
        if (i < reply.length) { typeTimer = setTimeout(step, 34 + Math.random() * 40); return; }
        msg.classList.add('done');
        typeTimer = setTimeout(function () { msg.classList.add('sent'); }, 700);
        loopTimer = setTimeout(typeReply, 5200);
      })();
    }
    restart.addEventListener('click', typeReply);

    // © https://saadbinyousaf.dev/ © //
    var query = document.getElementById('drsQuery');
    var rows = sec.querySelectorAll('.drs-row');
    var word = 'missed', rowIdx = 0, rowTimer = null;
    function typeQuery() {
      if (still) { query.textContent = word; return; }
      var i = 0;
      query.textContent = '';
      (function step() {
        query.textContent = word.slice(0, ++i);
        if (i < word.length) setTimeout(step, 110);
        else rowTimer = setInterval(function () {
          rows[rowIdx].classList.remove('on');
          rowIdx = (rowIdx + 1) % rows.length;
          rows[rowIdx].classList.add('on');
        }, 1600);
      })();
    }

    // © https://saadbinyousaf.dev/ © //
    var combo = document.getElementById('drsCombo');
    var ico = {
      shift: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4 3.5 12.5H8V20h8v-7.5h4.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
      cmd: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 9V6.5A2.5 2.5 0 1 0 6.5 9H9zm0 0h6m-6 0v6m6-6V6.5A2.5 2.5 0 1 1 17.5 9H15zm0 0v6m0 0h2.5a2.5 2.5 0 1 1-2.5 2.5V15zm0 0H9m0 0v2.5A2.5 2.5 0 1 1 6.5 15H9z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
      opt: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 6h5l7 12h6M14 6h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      ctrl: '<svg viewBox="0 0 24 24" fill="none"><path d="m6 13 6-6 6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };
    var keys = {
      shift: '<div class="drs-key wide"><div class="pri">' + ico.shift + '</div></div>',
      cmd: '<div class="drs-key wide"><div class="alt">' + ico.cmd + '</div><div class="pri">command</div></div>',
      opt: '<div class="drs-key wide"><div class="alt">' + ico.opt + '</div><div class="pri">option</div></div>',
      ctrl: '<div class="drs-key wide"><div class="alt">' + ico.ctrl + '</div><div class="pri">control</div></div>'
    };
    var letter = function (l) { return '<div class="drs-key"><div class="stretch">' + l + '</div></div>'; };
    var plus = '<span class="drs-plus">+</span>';
    var combos = [['shift', 'cmd', 'S'], ['opt', 'cmd', 'K'], ['ctrl', 'shift', 'L']];
    var ci = 0;
    function renderCombo() {
      var c = combos[ci];
      combo.innerHTML = keys[c[0]] + plus + keys[c[1]] + plus + letter(c[2]);
    }
    function nextCombo() {
      combo.classList.add('exit');
      setTimeout(function () {
        ci = (ci + 1) % combos.length;
        renderCombo();
        combo.classList.remove('exit');
        combo.classList.add('enter');
        void combo.offsetWidth;
        combo.classList.remove('enter');
      }, 300);
    }
    renderCombo();

    // © https://saadbinyousaf.dev/ © //
    var started = false;
    function start() {
      if (started) return;
      started = true;
      typeReply();
      typeQuery();
      if (!still) setInterval(nextCombo, 2600);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { start(); obs.disconnect(); }
      }, { threshold: 0.25 }).observe(sec);
    } else start();
  }

  // © https://saadbinyousaf.dev/ © //
  function initAIEmployee() {
    var sec = document.getElementById('ai');
    if (!sec) return;
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var tools = sec.querySelectorAll('.aie-tool');
    var answer = sec.querySelector('.aie-answer');
    var lines = sec.querySelectorAll('#aieTranscript li');
    var timers = [];
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    // © https://saadbinyousaf.dev/ © //
    function runChat() {
      tools.forEach(function (t) { t.classList.remove('show', 'load'); });
      answer.classList.remove('show');
      tools.forEach(function (t, i) {
        later(function () { t.classList.add('show', 'load'); }, 500 + i * 1100);
        later(function () { t.classList.remove('load'); }, 1400 + i * 1100);
      });
      later(function () { answer.classList.add('show'); }, 700 + tools.length * 1100);
      later(runChat, 11000);
    }

    // © https://saadbinyousaf.dev/ © //
    function runCall() {
      lines.forEach(function (l) { l.classList.remove('show'); });
      lines.forEach(function (l, i) { later(function () { l.classList.add('show'); }, 400 + i * 1300); });
      later(runCall, 400 + lines.length * 1300 + 3500);
    }

    // © https://saadbinyousaf.dev/ © //
    if (still) {
      tools.forEach(function (t) { t.classList.add('show'); });
      answer.classList.add('show');
      lines.forEach(function (l) { l.classList.add('show'); });
      return;
    }
    var started = false;
    function start() { if (started) return; started = true; runChat(); runCall(); }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { start(); obs.disconnect(); }
      }, { threshold: 0.2 }).observe(sec);
    } else start();
  }

  // © https://saadbinyousaf.dev/ © //
  function initHeader() {
    var sh = document.querySelector('.sh');
    if (!sh) return;
    var bar = sh.querySelector('.sh-bar');
    var toggle = sh.querySelector('.sh-toggle');
    function setOpen(open) {
      sh.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      bar.style.height = open ? bar.scrollHeight + 'px' : '';
      document.documentElement.style.overflow = open ? 'hidden' : '';
    }
    toggle.addEventListener('click', function () { setOpen(!sh.classList.contains('open')); });
    sh.querySelectorAll('.sh-links a, .sh-sec a').forEach(function (a) {
      a.addEventListener('click', function () { if (sh.classList.contains('open')) setOpen(false); });
    });
    addEventListener('resize', function () { if (innerWidth >= 720 && sh.classList.contains('open')) setOpen(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && sh.classList.contains('open')) setOpen(false); });
    addEventListener('scroll', function () { sh.classList.toggle('scrolled', scrollY > 40); }, { passive: true });
  }

  // © https://saadbinyousaf.dev/ © //
  function initChrome() {
    var track = document.getElementById('tickerTrack');
    if (track) {
      track.innerHTML += track.innerHTML;
      if (!reduceMotion) gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
    }

    var statsBox = document.getElementById('stats');
    if (statsBox) {
      ScrollTrigger.create({
        trigger: statsBox, start: 'top 85%', once: true,
        onEnter: function () {
          statsBox.querySelectorAll('.num[data-count]').forEach(function (el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            var o = { v: 0 };
            gsap.to(o, {
              v: target, duration: reduceMotion ? 0.01 : 1.6, ease: 'power2.out',
              onUpdate: function () { el.textContent = Math.round(o.v) + suffix; }
            });
          });
        }
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // © https://saadbinyousaf.dev/ © //
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lbImg = document.getElementById('lbImg');
    var lbScroll = document.getElementById('lbScroll');

    function open(key) {
      var p = PROJECTS[key];
      if (!p) return;
      document.getElementById('lbEyebrow').textContent = p.eyebrow;
      document.getElementById('lbTitle').textContent = p.title;
      document.getElementById('lbUrl').textContent = p.url.replace(/^https?:\/\//, '');
      document.getElementById('lbDesc').textContent = p.desc;
      document.getElementById('lbLink').href = p.url;
      document.getElementById('lbTags').innerHTML = p.tags.map(function (t) {
        return '<span class="ptag hl">' + t + '</span>';
      }).join('');
      lbImg.classList.remove('zoomed');
      lbImg.src = p.img;
      lbImg.alt = p.title;
      lbScroll.scrollTop = 0;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.portal[data-project]').forEach(function (card) {
      card.addEventListener('click', function () { open(card.getAttribute('data-project')); });
    });
    lbImg.addEventListener('click', function (e) {
      e.stopPropagation();
      lbImg.classList.toggle('zoomed');
    });
    document.getElementById('lbClose').addEventListener('click', close);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // © https://saadbinyousaf.dev/ © //
  buildStars();
  initSkyScroll();
  initCollage();
  initPointer3D();
  initTilt();
  initReveals();
  initCursor();
  initTrail();
  initMagnetic();
  initChrome();
  initLightbox();

  runIntro();

})();
// © https://saadbinyousaf.dev/ © //
