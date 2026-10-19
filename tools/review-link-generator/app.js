// © https://saadbinyousaf.dev/ © //
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var esc = SBY.esc;
  var BASE = 'https://search.google.com/local/writereview?placeid=';
  var SAMPLE = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
  var THEMES = {
    light: { fg: '#17202C', bg: '#FFFFFF', accent: '#F4B400', sub: '#5A6676' },
    dark: { fg: '#F2F1EA', bg: '#0B0C0A', accent: '#D6F077', sub: '#8A8D80' }
  };
  var state = { theme: 'light' };

  // © https://saadbinyousaf.dev/ © //
  function parsePid(raw) {
    var s = (raw || '').trim();
    var m = s.match(/place_?id[=:]([A-Za-z0-9_-]+)/i);
    if (m) return m[1];
    return s.replace(/\s+/g, '');
  }

  function colors() {
    if (state.theme !== 'custom') return THEMES[state.theme];
    var fg = $('#fg').value, bg = $('#bg').value;
    return { fg: fg, bg: bg, accent: fg, sub: fg };
  }

  function qrColors() {
    var c = colors();
    if (state.theme === 'dark') return { fg: '#0B0C0A', bg: '#FFFFFF', note: '' };
    if (SBY.contrast(c.fg, c.bg) < 3) return { fg: '#000000', bg: '#FFFFFF', note: 'low' };
    var inverted = SBY.contrast(c.bg, '#000000') < SBY.contrast(c.fg, '#000000');
    return { fg: c.fg, bg: c.bg, note: inverted ? 'inverted' : '' };
  }

  // © https://saadbinyousaf.dev/ © //
  function wrap(ctx, text, maxW) {
    var words = text.split(/\s+/), lines = [], line = '';
    words.forEach(function (w) {
      var t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
    });
    if (line) lines.push(line);
    if (lines.length > 1 && lines[lines.length - 1].indexOf(' ') === -1) {
      var prev = lines[lines.length - 2].split(' ');
      if (prev.length > 2) {
        var moved = prev.pop();
        var cand = moved + ' ' + lines[lines.length - 1];
        if (ctx.measureText(cand).width <= maxW) { lines[lines.length - 2] = prev.join(' '); lines[lines.length - 1] = cand; }
      }
    }
    return lines;
  }

  function star(ctx, cx, cy, r) {
    ctx.beginPath();
    for (var i = 0; i < 10; i++) {
      var rad = i % 2 ? r * 0.45 : r;
      var a = -Math.PI / 2 + i * Math.PI / 5;
      ctx[i ? 'lineTo' : 'moveTo'](cx + rad * Math.cos(a), cy + rad * Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // © https://saadbinyousaf.dev/ © //
  function drawCard(link, c) {
    var cv = $('#card'), ctx = cv.getContext('2d'), W = 1080, H = 1350;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = c.fg;
    ctx.beginPath(); ctx.arc(W, 0, 420, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, H, 360, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '700 64px "Space Grotesk", sans-serif';
    var head = wrap(ctx, $('#caption').value.trim() || 'Leave us a review', 860).slice(0, 3);
    ctx.font = '700 46px "Space Grotesk", sans-serif';
    var biz = wrap(ctx, $('#biz').value.trim() || 'Your business', 900).slice(0, 2);
    var sub = $('#sub').value.trim();

    var m = SBY.qrMatrix(link, 'M');
    var px = m ? Math.floor(520 / (m.size + 8)) : 0;
    var size = m ? (m.size + 8) * px : 0;
    var boxPad = 30;
    var total = 60 + 70 + head.length * 76 + 30 + (m ? size + boxPad * 2 : 0) + 80 + biz.length * 56 + (sub ? 50 : 0);
    var y = Math.round(Math.max(70, (H - total) / 2));

    ctx.fillStyle = c.accent;
    for (var i = 0; i < 5; i++) star(ctx, W / 2 - 160 + i * 80, y + 30, 30);
    y += 60 + 70 + 52;

    ctx.fillStyle = c.fg;
    ctx.font = '700 64px "Space Grotesk", sans-serif';
    head.forEach(function (l) { ctx.fillText(l, W / 2, y); y += 76; });
    y += 30 - 52;

    if (m) {
      var bx = Math.round((W - size) / 2), by = Math.round(y + boxPad);
      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, bx - boxPad, by - boxPad, size + boxPad * 2, size + boxPad * 2, 36);
      ctx.fill();
      var qrFg = SBY.contrast(c.fg, '#FFFFFF') > 3 ? c.fg : '#111111';
      SBY.qrDraw(ctx, m, bx, by, px, qrFg, '#FFFFFF', 4);
      y = by + size + boxPad;
    }
    y += 80;

    ctx.fillStyle = c.fg;
    ctx.font = '700 46px "Space Grotesk", sans-serif';
    biz.forEach(function (l) { ctx.fillText(l, W / 2, y); y += 56; });
    if (sub) {
      ctx.fillStyle = c.sub;
      ctx.font = '400 30px "Space Grotesk", sans-serif';
      ctx.fillText(sub, W / 2, y + 8);
    }
  }

  // © https://saadbinyousaf.dev/ © //
  function templates(link, biz) {
    var T = [
      ['SMS request', 'Hi {{contact.first_name}}, thanks for choosing ' + biz + '! If you have a minute, we would love a quick Google review: ' + link, true],
      ['SMS follow-up (2–3 days later)', 'Hi {{contact.first_name}}, a friendly follow-up from ' + biz + '. Your Google review would mean a lot to our team: ' + link, true],
      ['Email subject', 'How did we do, {{contact.first_name}}?', false],
      ['Email body', 'Hi {{contact.first_name}},\n\nThank you for choosing ' + biz + '. Reviews help other people find us, and we read every single one.\n\nWould you share a quick review on Google? It takes less than a minute:\n' + link + '\n\nThank you,\n{{user.name}}\n' + biz, false]
    ];
    $('#templates').innerHTML = T.map(function (t, i) {
      var meta = '';
      if (t[2]) {
        var a = SBY.smsAnalyze(t[1].replace('{{contact.first_name}}', 'Christopher'));
        meta = ' <span style="color:var(--dim);letter-spacing:0.06em;">' + a.segments + ' seg' + (a.segments > 1 ? 's' : '') + '</span>';
      }
      return '<div class="out-block"><div class="out-head"><span class="label">' + t[0] + meta + '</span><button type="button" class="copy-btn" data-copy="#tp' + i + '">Copy</button></div><div class="out-body" id="tp' + i + '">' + esc(t[1]) + '</div></div>';
    }).join('') + '<div class="notice">The full Google link is long, so SMS requests usually take 2 segments. A short path on your own domain that redirects to it, such as <code>yourbusiness.com/review</code>, keeps the text to one segment.</div>';
  }

  // © https://saadbinyousaf.dev/ © //
  function update() {
    var pid = parsePid($('#pid').value);
    var status = $('#pidStatus');
    var badge = $('#linkBadge');
    if (!pid) {
      status.innerHTML = '<div class="notice warn">Paste your Place ID to create your link.</div>';
      badge.textContent = 'Waiting'; badge.className = 'badge warn';
    } else if (pid === SAMPLE) {
      status.innerHTML = '<div class="notice warn">This is an example Place ID (Google\'s Sydney office). Replace it with your own.</div>';
      badge.textContent = 'Example'; badge.className = 'badge warn';
    } else if (!/^[A-Za-z0-9_-]{16,}$/.test(pid)) {
      status.innerHTML = '<div class="notice bad">That doesn\'t look like a Place ID. It should be one long code with no spaces, usually starting with <code>ChIJ</code>.</div>';
      badge.textContent = 'Check ID'; badge.className = 'badge bad';
    } else if (pid.indexOf('ChIJ') !== 0) {
      status.innerHTML = '<div class="notice warn">Most Place IDs start with <code>ChIJ</code>. Yours might still be right — use “Test the link” to make sure the review box opens.</div>';
      badge.textContent = 'Test it'; badge.className = 'badge warn';
    } else {
      status.innerHTML = '<div class="notice">Looks like a valid Place ID. Test the link once to confirm it opens your business.</div>';
      badge.textContent = 'Ready'; badge.className = 'badge ok';
    }
    var link = pid ? BASE + encodeURIComponent(pid) : '';
    $('#link').textContent = link || '—';
    $('#testLink').href = link || '#';

    var c = colors(), qc = qrColors();
    var m = SBY.qrCanvas($('#qr'), link, { size: 720, fg: qc.fg, bg: qc.bg });
    var info = $('#qrInfo');
    if (qc.note === 'low') { info.textContent = 'Low contrast — using black'; info.className = 'badge bad'; }
    else if (qc.note === 'inverted') { info.textContent = 'Inverted — test scan'; info.className = 'badge warn'; }
    else { info.textContent = m ? m.size + '×' + m.size + ' modules' : '—'; info.className = 'badge ok'; }

    drawCard(link || BASE, c);
    templates(link || '[your review link]', $('#biz').value.trim() || 'our business');
    SBY.store.set('review-link', { biz: $('#biz').value, pid: $('#pid').value, theme: state.theme, fg: $('#fg').value, bg: $('#bg').value, caption: $('#caption').value, sub: $('#sub').value });
  }

  // © https://saadbinyousaf.dev/ © //
  function fileBase() { return ($('#biz').value.trim() || 'business').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  $('#dlPng').addEventListener('click', function () {
    var link = $('#link').textContent;
    if (!/^https/.test(link)) return SBY.toast('Add your Place ID first');
    var cv = document.createElement('canvas');
    var qc = qrColors();
    SBY.qrCanvas(cv, link, { size: 1024, fg: qc.fg, bg: qc.bg });
    cv.toBlob(function (b) { SBY.download(fileBase() + '-review-qr.png', b); });
  });
  $('#dlSvg').addEventListener('click', function () {
    var link = $('#link').textContent;
    if (!/^https/.test(link)) return SBY.toast('Add your Place ID first');
    var qc = qrColors();
    SBY.download(fileBase() + '-review-qr.svg', SBY.qrSvg(link, { fg: qc.fg, bg: qc.bg }), 'image/svg+xml');
  });
  $('#dlCard').addEventListener('click', function () {
    $('#card').toBlob(function (b) { SBY.download(fileBase() + '-review-card.png', b); });
  });

  document.querySelectorAll('#theme button').forEach(function (b) {
    b.addEventListener('click', function () {
      state.theme = b.getAttribute('data-t');
      document.querySelectorAll('#theme button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $('#customColors').hidden = state.theme !== 'custom';
      update();
    });
  });
  ['biz', 'pid', 'fg', 'bg', 'caption', 'sub'].forEach(function (id) { $('#' + id).addEventListener('input', SBY.debounce(update, 80)); });

  var saved = SBY.store.get('review-link', null);
  if (saved) {
    ['biz', 'pid', 'fg', 'bg', 'caption', 'sub'].forEach(function (k) { if (saved[k] != null) $('#' + k).value = saved[k]; });
    if (saved.theme) {
      state.theme = saved.theme;
      document.querySelectorAll('#theme button').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-t') === state.theme ? 'true' : 'false'); });
      $('#customColors').hidden = state.theme !== 'custom';
    }
  }
  update();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
})();
// © https://saadbinyousaf.dev/ © //
