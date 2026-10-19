// © https://saadbinyousaf.dev/ © //
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var esc = SBY.esc;

  // © https://saadbinyousaf.dev/ © //
  var PRESETS = [
    ['Facebook ads', 'facebook', 'paid_social', true],
    ['Instagram ads', 'instagram', 'paid_social', true],
    ['Google Ads', 'google', 'cpc'],
    ['Email', 'newsletter', 'email'],
    ['SMS', 'sms', 'text'],
    ['Google Business Profile', 'google', 'organic_gbp'],
    ['QR / print', 'qr', 'print'],
    ['LinkedIn', 'linkedin', 'social'],
    ['YouTube', 'youtube', 'video']
  ];
  var META = { campaign: '{{campaign.name}}', content: '{{ad.name}}', term: '{{adset.name}}' };
  var FIELDS = ['source', 'medium', 'campaign', 'content', 'term'];
  var state = { preset: -1 };

  // © https://saadbinyousaf.dev/ © //
  function tidy(v) {
    if (!$('#clean').checked || /^\{\{.*\}\}$/.test(v)) return v.trim();
    return v.trim().toLowerCase().replace(/\s+/g, '-').replace(/-{2,}/g, '-');
  }

  function enc(v) {
    if (/^\{\{[a-z_.]+\}\}$/.test(v)) return v;
    return encodeURIComponent(v).replace(/%20/g, '+');
  }

  function values() {
    var v = {};
    FIELDS.forEach(function (f) {
      var useMeta = $('#meta').checked && !$('#metaRow').hidden && META[f];
      v[f] = useMeta ? META[f] : tidy($('#' + f).value);
    });
    return v;
  }

  // © https://saadbinyousaf.dev/ © //
  function build() {
    var raw = $('#url').value.trim();
    var warn = [];
    var v = values();
    var parts = FIELDS.filter(function (f) { return v[f]; }).map(function (f) { return 'utm_' + f + '=' + enc(v[f]); });
    var params = parts.join('&');
    var finalUrl = '';
    if (!raw) warn.push(['bad', 'Add the page you want people to land on.']);
    else {
      var u = raw;
      if (!/^https?:\/\//i.test(u)) { u = 'https://' + u; warn.push(['', 'Added <code>https://</code> to the start of your URL.']); }
      try {
        var hashIdx = u.indexOf('#');
        var hash = hashIdx > -1 ? u.slice(hashIdx) : '';
        var noHash = hashIdx > -1 ? u.slice(0, hashIdx) : u;
        new URL(noHash);
        var q = noHash.indexOf('?');
        var path = q > -1 ? noHash.slice(0, q) : noHash;
        var existing = q > -1 ? noHash.slice(q + 1).split('&').filter(function (p) { return p && !/^utm_(source|medium|campaign|content|term)=/i.test(p); }) : [];
        if (q > -1 && existing.length !== noHash.slice(q + 1).split('&').filter(Boolean).length) warn.push(['warn', 'Your URL already had UTM parameters. They were replaced with the new ones.']);
        var all = existing.concat(parts);
        finalUrl = path + (all.length ? '?' + all.join('&') : '') + hash;
      } catch (e) { warn.push(['bad', 'That doesn\'t look like a valid web address.']); }
    }
    if (!v.source) warn.push(['warn', 'Source is required — where the click comes from, like <code>facebook</code> or <code>newsletter</code>.']);
    if (!v.medium) warn.push(['warn', 'Medium is required — the type of channel, like <code>paid_social</code>, <code>email</code> or <code>cpc</code>.']);
    if (!v.campaign) warn.push(['warn', 'Add a campaign name so you can compare promotions later.']);
    if (!$('#clean').checked && FIELDS.some(function (f) { return /[A-Z\s]/.test(v[f]); })) warn.push(['warn', 'Mixed capitals or spaces will show up as separate rows in reports. Turn on “Clean up values” to keep names consistent.']);
    if (/bit\.ly|tinyurl|t\.co\//i.test(raw)) warn.push(['bad', 'Tag your real landing page, not a shortened link.']);

    $('#final').textContent = finalUrl || '—';
    $('#params').textContent = params || '—';
    $('#open').href = finalUrl || '#';
    var len = finalUrl.length;
    var lb = $('#lenBadge');
    lb.textContent = len ? len + ' characters' : '—';
    lb.className = 'badge ' + (len > 160 ? 'warn' : 'ok');
    if (len > 100 && state.preset > -1 && PRESETS[state.preset][2] === 'text') warn.push(['warn', 'This link is ' + len + ' characters, which uses most of an SMS segment. Consider a HighLevel trigger link or a short path on your own domain for texts.']);
    $('#warn').innerHTML = warn.map(function (w) { return '<div class="notice ' + w[0] + '">' + w[1] + '</div>'; }).join('');
    if (!$('#qrWrap').hidden) SBY.qrCanvas($('#qr'), finalUrl, { size: 600 });
    return finalUrl;
  }

  // © https://saadbinyousaf.dev/ © //
  function renderHistory() {
    var h = SBY.store.get('utm-history', []);
    $('#history').innerHTML = h.length ? '<div class="hist">' + h.map(function (x, i) {
      return '<div class="hist-row"><div class="t"><b>' + esc(x.label) + '</b><small>' + esc(x.url) + '</small></div><button type="button" class="pill-btn" data-load="' + i + '">Load</button><button type="button" class="copy-btn" data-copytext="' + i + '">Copy</button></div>';
    }).join('') + '</div>' : '<p class="hist-empty">Links you save appear here, in this browser only.</p>';
  }

  function applyPreset(i) {
    state.preset = i;
    var p = PRESETS[i];
    $('#source').value = p[1];
    $('#medium').value = p[2];
    $('#metaRow').hidden = !p[3];
    if (!p[3]) $('#meta').checked = false;
    document.querySelectorAll('#presets button').forEach(function (b, j) { b.setAttribute('aria-pressed', i === j ? 'true' : 'false'); });
    build();
  }

  // © https://saadbinyousaf.dev/ © //
  $('#presets').innerHTML = PRESETS.map(function (p, i) { return '<button type="button" data-i="' + i + '" aria-pressed="false">' + p[0] + '</button>'; }).join('');
  $('#presets').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) applyPreset(parseInt(b.getAttribute('data-i'), 10)); });
  ['url'].concat(FIELDS).forEach(function (id) { $('#' + id).addEventListener('input', SBY.debounce(build, 60)); });
  ['clean', 'meta'].forEach(function (id) { $('#' + id).addEventListener('change', build); });
  ['source', 'medium'].forEach(function (id) {
    $('#' + id).addEventListener('input', function () {
      state.preset = -1;
      document.querySelectorAll('#presets button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    });
  });

  $('#save').addEventListener('click', function () {
    var url = build();
    if (!url) return SBY.toast('Build a link first');
    var v = values();
    var h = SBY.store.get('utm-history', []).filter(function (x) { return x.url !== url; });
    h.unshift({ url: url, label: [v.source, v.medium, v.campaign].filter(Boolean).join(' · '), raw: { url: $('#url').value, source: $('#source').value, medium: $('#medium').value, campaign: $('#campaign').value, content: $('#content').value, term: $('#term').value } });
    SBY.store.set('utm-history', h.slice(0, 12));
    renderHistory();
    SBY.toast('Saved to history');
  });
  $('#history').addEventListener('click', function (e) {
    var h = SBY.store.get('utm-history', []);
    var l = e.target.closest('[data-load]');
    var c = e.target.closest('[data-copytext]');
    if (l) {
      var x = h[parseInt(l.getAttribute('data-load'), 10)];
      if (x && x.raw) { Object.keys(x.raw).forEach(function (k) { $('#' + k).value = x.raw[k]; }); build(); SBY.toast('Loaded'); }
    } else if (c) {
      var y = h[parseInt(c.getAttribute('data-copytext'), 10)];
      if (y) SBY.copy(y.url, c);
    }
  });
  $('#clearHist').addEventListener('click', function () { SBY.store.set('utm-history', []); renderHistory(); });
  $('#qrBtn').addEventListener('click', function () {
    var w = $('#qrWrap');
    w.hidden = !w.hidden;
    this.textContent = w.hidden ? 'QR code' : 'Hide QR';
    build();
  });
  $('#qrDl').addEventListener('click', function () {
    var url = build();
    if (!url) return;
    var cv = document.createElement('canvas');
    SBY.qrCanvas(cv, url, { size: 1024 });
    cv.toBlob(function (b) { SBY.download('utm-qr-' + (values().campaign || 'link') + '.png', b); });
  });

  applyPreset(0);
  renderHistory();
})();
// © https://saadbinyousaf.dev/ © //
