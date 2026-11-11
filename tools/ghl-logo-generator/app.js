// © https://saadbinyousaf.dev/ © //
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var els = {
    name: $('name'), lid: $('lid'), url: $('url'), height: $('height'), range: $('heightRange'),
    lidMsg: $('lid-msg'), urlMsg: $('url-msg'), logo: $('sb-logo'), initial: $('initial'), frame: $('frame'),
    meta: $('preview-meta'), code: $('code'), copy: $('copy'), badge: $('statusBadge'),
    lidCount: $('lidCount'), hVal: $('hVal'), reset: $('reset')
  };
  if (!els.code) return;
  var state = { imgOk: null, imgW: 0, imgH: 0, token: 0 };
  var KEY = 'sby-logo-gen';
  var stepOf = function (input) { return input.closest('.lg-step'); };

  // © https://saadbinyousaf.dev/ © //
  function setMsg(el, type, text) {
    el.className = 'lg-msg' + (type ? ' show ' + type : '');
    el.textContent = text || '';
  }
  function setStep(input, s) {
    var st = stepOf(input);
    st.classList.toggle('done', s === 'done');
    st.classList.toggle('err', s === 'err');
  }
  function setBadge(type, text) {
    els.badge.className = 'badge' + (type ? ' ' + type : '');
    els.badge.textContent = text;
  }
  function extractId(raw) {
    var v = raw.trim();
    var m = v.match(/location\/([A-Za-z0-9]+)/);
    if (m) return { id: m[1], fromLink: true };
    return { id: v.replace(/[^A-Za-z0-9]/g, ''), fromLink: false };
  }
  function cleanName(v) { return v.replace(/\*\//g, '').replace(/[\r\n]+/g, ' ').trim(); }
  function cleanUrl(v) { return v.trim().replace(/\s/g, '%20').replace(/'/g, '%27'); }
  function clampHeight() {
    var n = parseInt(els.height.value, 10);
    if (isNaN(n)) return 100;
    return Math.min(200, Math.max(40, n));
  }

  // © https://saadbinyousaf.dev/ © //
  function checkName() {
    var n = cleanName(els.name.value);
    setStep(els.name, n ? 'done' : '');
    var words = n.split(/\s+/).filter(Boolean);
    els.initial.textContent = words.length ? (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase() : '?';
    return n;
  }
  function checkId() {
    var raw = els.lid.value;
    els.lidCount.textContent = '';
    if (!raw.trim()) { setMsg(els.lidMsg, '', ''); els.lid.removeAttribute('aria-invalid'); setStep(els.lid, ''); return null; }
    var r = extractId(raw);
    if (r.fromLink && r.id) els.lid.value = r.id;
    els.lidCount.textContent = r.id.length + ' / 20';
    if (r.id.length < 10) {
      setMsg(els.lidMsg, 'bad', "That doesn't look like a location ID. Copy the part after /location/ in the address bar.");
      els.lid.setAttribute('aria-invalid', 'true');
      setStep(els.lid, 'err');
      return null;
    }
    els.lid.removeAttribute('aria-invalid');
    setStep(els.lid, 'done');
    if (r.id.length !== 20) setMsg(els.lidMsg, 'warn', 'Location IDs are usually 20 characters. This one has ' + r.id.length + ', so double-check it.');
    else if (r.fromLink) setMsg(els.lidMsg, 'ok', 'Picked the ID out of the link.');
    else setMsg(els.lidMsg, '', '');
    return r.id;
  }
  function checkUrl() {
    var raw = els.url.value.trim();
    if (!raw) { setMsg(els.urlMsg, '', ''); els.url.removeAttribute('aria-invalid'); setStep(els.url, ''); return null; }
    if (!/^https:\/\//i.test(raw)) {
      setMsg(els.urlMsg, 'bad', 'The link must start with https://');
      els.url.setAttribute('aria-invalid', 'true');
      setStep(els.url, 'err');
      return null;
    }
    els.url.removeAttribute('aria-invalid');
    setStep(els.url, state.imgOk === false ? 'err' : 'done');
    return cleanUrl(raw);
  }

  // © https://saadbinyousaf.dev/ © //
  var imgTimer;
  function loadPreview(url) {
    clearTimeout(imgTimer);
    var token = ++state.token;
    if (!url) {
      state.imgOk = null;
      els.logo.style.backgroundImage = '';
      els.logo.classList.remove('has-img');
      renderMeta();
      return;
    }
    imgTimer = setTimeout(function () {
      var img = new Image();
      img.onload = function () {
        if (token !== state.token) return;
        state.imgOk = true; state.imgW = img.naturalWidth; state.imgH = img.naturalHeight;
        els.logo.style.backgroundImage = "url('" + url + "')";
        els.logo.classList.add('has-img');
        setMsg(els.urlMsg, 'ok', 'Logo loaded.');
        update({ target: null });
      };
      img.onerror = function () {
        if (token !== state.token) return;
        state.imgOk = false;
        els.logo.style.backgroundImage = '';
        els.logo.classList.remove('has-img');
        setMsg(els.urlMsg, 'bad', "This image didn't load. Use the direct file link from Media Library and check it opens in a private window.");
        update({ target: null });
      };
      img.src = url;
    }, 350);
  }

  // © https://saadbinyousaf.dev/ © //
  function renderMeta() {
    var h = clampHeight();
    els.hVal.textContent = h;
    els.logo.style.height = Math.round(Math.min(120, h * 0.8)) + 'px';
    document.querySelectorAll('.lg-presets button').forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-h') === h); });
    els.meta.innerHTML = '';
    var add = function (tag, text) { var n = document.createElement(tag); n.textContent = text; els.meta.appendChild(n); };
    if (state.imgOk) {
      add('strong', 'Logo looks good.');
      add('span', state.imgW + ' × ' + state.imgH + ' px, shown at ' + h + ' px tall.');
      if (state.imgW && state.imgW / state.imgH < 1.2) add('span', 'Square logos can look small. A wide version usually fits better.');
    } else if (state.imgOk === false) {
      add('strong', 'Logo not loading.');
      add('span', 'Fix the link before pasting the code.');
    } else {
      add('span', 'Fill in the details and the preview updates as you type.');
    }
  }

  // © https://saadbinyousaf.dev/ © //
  function buildCode(name, id, url, h) {
    var sel = '[class*="' + id + '"]';
    var box = ':is(.hl_navbar--logo, .agency-logo-container)';
    return [
      '/* ' + name + ' */',
      '/* © https://saadbinyousaf.dev/ © */',
      sel + ' ' + box + ' :is(img, svg) {',
      '  display: none !important;',
      '}',
      sel + ' ' + box + '::before,',
      sel + ' ' + box + '::after {',
      '  content: none !important;',
      '  display: none !important;',
      '  background: none !important;',
      '}',
      sel + ' ' + box + ' {',
      '  height: ' + h + 'px;',
      '  width: auto;',
      "  background-image: url('" + url + "') !important;",
      '  background-size: contain !important;',
      '  background-repeat: no-repeat !important;',
      '  background-position: center !important;',
      '}'
    ].join('\n');
  }
  function highlight(text) {
    return text.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; })
      .replace(/(\/\*.*?\*\/)/g, '<span class="c">$1</span>')
      .replace(/(!important)/g, '<span class="k">$1</span>')
      .replace(/(url\(')(.*?)('\))/g, '$1<span class="s">$2</span>$3')
      .replace(/^(\s+)([a-z-]+)(:)/gm, '$1<span class="p">$2</span>$3');
  }

  // © https://saadbinyousaf.dev/ © //
  function update(e) {
    var name = checkName();
    var id = checkId();
    var url = checkUrl();
    var h = clampHeight();
    setStep(els.height, 'done');
    if (e && e.target === els.url) loadPreview(url);
    renderMeta();
    if (name && id && url) {
      var text = buildCode(name, id, url, h);
      els.code.classList.remove('empty');
      els.code.dataset.text = text;
      els.code.innerHTML = highlight(text);
      els.copy.disabled = false;
      if (state.imgOk === false) setBadge('bad', 'Check logo');
      else setBadge('ok', 'Ready');
    } else {
      var missing = [];
      if (!name) missing.push('name');
      if (!id) missing.push('location ID');
      if (!url) missing.push('logo link');
      els.code.classList.add('empty');
      els.code.dataset.text = '';
      els.code.textContent = 'Still needed: ' + missing.join(', ') + '.';
      els.copy.disabled = true;
      setBadge('', 'Waiting');
    }
    try { localStorage.setItem(KEY, JSON.stringify({ name: els.name.value, url: els.url.value, height: els.height.value })); } catch (_) {}
  }

  // © https://saadbinyousaf.dev/ © //
  function copyCode() {
    var text = els.code.dataset.text || '';
    var label = els.copy.querySelector('span');
    var done = function (ok) {
      label.textContent = ok ? 'Copied' : 'Select and copy manually';
      els.copy.classList.toggle('copied', ok);
      setTimeout(function () { label.textContent = 'Copy code'; els.copy.classList.remove('copied'); }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallback(text)); });
    } else done(fallback(text));
  }
  function fallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
    ta.remove();
    return ok;
  }

  // © https://saadbinyousaf.dev/ © //
  function setHeight(v) { els.height.value = v; els.range.value = clampHeight(); update({ target: els.height }); }
  document.querySelectorAll('.lg-presets button').forEach(function (b) {
    b.addEventListener('click', function () { setHeight(b.getAttribute('data-h')); });
  });
  document.querySelectorAll('.lg-toggle button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.lg-toggle button').forEach(function (x) { x.classList.toggle('on', x === b); });
      els.frame.classList.toggle('before', b.getAttribute('data-view') === 'before');
    });
  });
  els.reset.addEventListener('click', function () {
    els.name.value = ''; els.lid.value = ''; els.url.value = '';
    try { localStorage.removeItem(KEY); } catch (_) {}
    setHeight(100);
    update({ target: els.url });
    els.name.focus();
  });

  // © https://saadbinyousaf.dev/ © //
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved) { els.name.value = saved.name || ''; els.url.value = saved.url || ''; els.height.value = saved.height || 100; els.range.value = els.height.value; }
  } catch (_) {}
  ['input', 'change'].forEach(function (ev) {
    els.name.addEventListener(ev, update);
    els.lid.addEventListener(ev, update);
    els.url.addEventListener(ev, update);
    els.height.addEventListener(ev, function (e) { els.range.value = clampHeight(); update(e); });
    els.range.addEventListener(ev, function (e) { els.height.value = els.range.value; update(e); });
  });
  els.copy.addEventListener('click', copyCode);
  update({ target: els.url });
})();
