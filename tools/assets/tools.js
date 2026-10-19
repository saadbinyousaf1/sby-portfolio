// © https://saadbinyousaf.dev/ © //
(function () {
  'use strict';

  var SBY = window.SBY = window.SBY || {};

  // © https://saadbinyousaf.dev/ © //
  var GSM_BASIC = '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà';
  var GSM_EXT = '^{}\\[~]|€\f';
  var basicSet = {}, extSet = {};
  for (var i = 0; i < GSM_BASIC.length; i++) basicSet[GSM_BASIC[i]] = 1;
  for (var j = 0; j < GSM_EXT.length; j++) extSet[GSM_EXT[j]] = 1;

  var SMART = {
    '‘': "'", '’': "'", '‚': "'", '′': "'",
    '“': '"', '”': '"', '„': '"', '″': '"',
    '–': '-', '—': '-', '−': '-', '‐': '-', '‑': '-',
    '…': '...', ' ': ' ', ' ': ' ', '​': '', '•': '-', '·': '-',
    'á': 'a', 'í': 'i', 'ó': 'o', 'ú': 'u', 'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u', 'ç': 'c'
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.smsAnalyze = function (text) {
    text = text || '';
    var chars = Array.from(text);
    var unicode = false, gsmUnits = 0, ext = 0, culprits = {};
    chars.forEach(function (ch) {
      if (basicSet[ch]) gsmUnits += 1;
      else if (extSet[ch]) { gsmUnits += 2; ext++; }
      else { unicode = true; culprits[ch] = (culprits[ch] || 0) + 1; }
    });
    var single = unicode ? 70 : 160;
    var multi = unicode ? 67 : 153;
    var units = unicode ? text.length : gsmUnits;
    var segments = units === 0 ? 0 : (units <= single ? 1 : Math.ceil(units / multi));
    var per = segments > 1 ? multi : single;
    var left = segments === 0 ? single : (segments === 1 ? single - units : segments * multi - units);
    var parts = [], cur = '', curUnits = 0;
    if (segments > 1) {
      chars.forEach(function (ch) {
        var u = unicode ? ch.length : (extSet[ch] ? 2 : 1);
        if (curUnits + u > multi) { parts.push(cur); cur = ''; curUnits = 0; }
        cur += ch; curUnits += u;
      });
      if (cur) parts.push(cur);
    } else if (text) parts.push(text);
    return {
      encoding: unicode ? 'Unicode (UCS-2)' : 'GSM-7',
      unicode: unicode,
      units: units,
      length: chars.length,
      segments: segments,
      perSegment: per,
      left: left,
      extended: ext,
      culprits: Object.keys(culprits).map(function (c) { return { ch: c, count: culprits[c], fix: SMART.hasOwnProperty(c) ? SMART[c] : null }; }),
      parts: parts
    };
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.smsFix = function (text) {
    return Array.from(text || '').map(function (ch) { return SMART.hasOwnProperty(ch) ? SMART[ch] : ch; }).join('');
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  // © https://saadbinyousaf.dev/ © //
  var toastEl, toastTimer;
  SBY.toast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.copy = function (text, btn) {
    function done() {
      SBY.toast('Copied to clipboard');
      if (btn) {
        var old = btn.textContent;
        btn.classList.add('done');
        btn.textContent = 'Copied';
        setTimeout(function () { btn.classList.remove('done'); btn.textContent = old; }, 1400);
      }
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else fallback();
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { SBY.toast('Press Ctrl+C to copy'); }
      document.body.removeChild(ta);
    }
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.download = function (filename, content, mime) {
    var blob = content instanceof Blob ? content : new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.store = {
    get: function (k, d) { try { var v = localStorage.getItem('sby:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('sby:' + k, JSON.stringify(v)); } catch (e) {} }
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.debounce = function (fn, ms) {
    var t;
    return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms || 120); };
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.money = function (n, symbol, digits) {
    if (!isFinite(n)) n = 0;
    var d = digits == null ? (Math.abs(n) < 10 && n % 1 !== 0 ? 2 : 0) : digits;
    var s = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    return (n < 0 ? '-' : '') + (symbol || '$') + s;
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.num = function (n, digits) {
    if (!isFinite(n)) n = 0;
    return n.toLocaleString('en-US', { maximumFractionDigits: digits == null ? 0 : digits });
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.qrMatrix = function (text, level) {
    if (!window.qrcode || !text) return null;
    var qr = window.qrcode(0, level || 'M');
    qr.addData(text);
    qr.make();
    var n = qr.getModuleCount(), rows = [];
    for (var r = 0; r < n; r++) {
      var row = [];
      for (var c = 0; c < n; c++) row.push(qr.isDark(r, c));
      rows.push(row);
    }
    return { size: n, rows: rows };
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.qrDraw = function (ctx, m, x, y, px, fg, bg, quiet) {
    var q = quiet == null ? 4 : quiet;
    var total = (m.size + q * 2) * px;
    if (bg) { ctx.fillStyle = bg; ctx.fillRect(x, y, total, total); }
    ctx.fillStyle = fg;
    for (var r = 0; r < m.size; r++) {
      for (var c = 0; c < m.size; c++) {
        if (m.rows[r][c]) ctx.fillRect(x + (c + q) * px, y + (r + q) * px, px, px);
      }
    }
    return total;
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.qrCanvas = function (canvas, text, opts) {
    opts = opts || {};
    var m = SBY.qrMatrix(text, opts.level);
    var ctx = canvas.getContext('2d');
    if (!m) { ctx.clearRect(0, 0, canvas.width, canvas.height); return null; }
    var q = opts.quiet == null ? 4 : opts.quiet;
    var px = Math.max(1, Math.floor((opts.size || 1024) / (m.size + q * 2)));
    var total = (m.size + q * 2) * px;
    canvas.width = total;
    canvas.height = total;
    SBY.qrDraw(ctx, m, 0, 0, px, opts.fg || '#000000', opts.bg || '#FFFFFF', q);
    return m;
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.qrSvg = function (text, opts) {
    opts = opts || {};
    var m = SBY.qrMatrix(text, opts.level);
    if (!m) return '';
    var q = opts.quiet == null ? 4 : opts.quiet, n = m.size + q * 2, d = '';
    for (var r = 0; r < m.size; r++) {
      for (var c = 0; c < m.size; c++) if (m.rows[r][c]) d += 'M' + (c + q) + ' ' + (r + q) + 'h1v1h-1z';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + ' ' + n + '" width="1024" height="1024" shape-rendering="crispEdges">' +
      '<rect width="' + n + '" height="' + n + '" fill="' + (opts.bg || '#FFFFFF') + '"/><path d="' + d + '" fill="' + (opts.fg || '#000000') + '"/></svg>';
  };

  // © https://saadbinyousaf.dev/ © //
  SBY.contrast = function (a, b) {
    function lum(h) {
      h = h.replace('#', '');
      if (h.length === 3) h = h.split('').map(function (x) { return x + x; }).join('');
      var rgb = [0, 2, 4].map(function (i) {
        var v = parseInt(h.substr(i, 2), 16) / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }
    var l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  // © https://saadbinyousaf.dev/ © //
  function initChrome() {
    var btn = document.querySelector('.t-menu');
    var links = document.querySelector('.t-links');
    if (btn && links) {
      btn.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-copy]');
      if (!b) return;
      var src = document.querySelector(b.getAttribute('data-copy'));
      if (!src) return;
      SBY.copy(src.value != null && src.tagName !== 'DIV' ? src.value : src.textContent, b);
    });

    document.querySelectorAll('.tool-card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    var reveals = document.querySelectorAll('.reveal-up');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    } else reveals.forEach(function (el) { el.classList.add('in'); });

    var tocLinks = document.querySelectorAll('.toc a');
    if (tocLinks.length && 'IntersectionObserver' in window) {
      var map = {};
      tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && map[en.target.id]) {
            tocLinks.forEach(function (a) { a.classList.remove('active'); });
            map[en.target.id].classList.add('active');
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      document.querySelectorAll('.guide h2[id]').forEach(function (h) { spy.observe(h); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initChrome);
  else initChrome();
})();
// © https://saadbinyousaf.dev/ © //
