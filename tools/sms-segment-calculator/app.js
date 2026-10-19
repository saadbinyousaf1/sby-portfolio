// © https://saadbinyousaf.dev/ © //
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var esc = SBY.esc;

  var EXAMPLES = {
    reminder: 'Hi {{contact.first_name}}, your appointment with Bright Smile Dental is tomorrow at 10:00 AM. Reply C to confirm or R to reschedule.',
    promo: '🎉 Flash sale at Glow Med Spa! 20% off all facials this weekend only — book now at glowmedspa.com/book',
    review: 'Hi {{contact.first_name}}, thanks for choosing Apex Roofing! Would you take 30 seconds to share your experience? https://apexroofing.com/review',
    docs: 'Hi {{contact.first_name}}, we’re running a little behind today… your tech will arrive between 2–4 PM. Thanks for your patience!'
  };
  var OPT_OUT = '\nReply STOP to opt out';
  var MERGE = /\{\{\s*([^{}]+?)\s*\}\}/g;

  var msg = $('#msg'), footer = $('#footer'), mergeLen = $('#mergeLen');
  var recips = $('#recips'), rate = $('#rate'), fee = $('#fee');

  // © https://saadbinyousaf.dev/ © //
  function expandMerge(text, n) {
    var count = 0;
    var out = text.replace(MERGE, function (m, key) {
      count++;
      if (n === 0) return '';
      var name = key.split('.').pop();
      var token = ('<' + name + '>');
      if (token.length >= n) return token.slice(0, Math.max(n - 1, 1)) + (n > 1 ? '>' : '');
      return token + new Array(n - token.length + 1).join('_');
    });
    return { text: out, count: count };
  }

  // © https://saadbinyousaf.dev/ © //
  function renderViz(a) {
    var viz = $('#viz');
    if (!a.parts.length) { viz.innerHTML = '<span class="empty">Start typing to see how your message is split.</span>'; return; }
    var badSet = {};
    a.culprits.forEach(function (c) { badSet[c.ch] = 1; });
    viz.innerHTML = a.parts.map(function (p, i) {
      var inner = Array.from(p).map(function (ch) {
        var e = esc(ch);
        return badSet[ch] ? '<span class="bad" title="Unicode character">' + (ch === ' ' ? '&middot;' : e) + '</span>' : e;
      }).join('');
      var tag = a.parts.length > 1 ? '<span class="tag">Part ' + (i + 1) + '</span>' : '';
      return '<span class="part p' + (i % 4) + '">' + tag + inner + '</span>';
    }).join('');
  }

  // © https://saadbinyousaf.dev/ © //
  function renderCulprits(a) {
    var box = $('#culprits');
    if (!a.unicode) {
      box.innerHTML = '<div class="notice">Every character is in the standard GSM-7 set, so you get the full ' + a.perSegment + ' characters per segment.</div>';
      return;
    }
    var fixable = a.culprits.some(function (c) { return c.fix !== null; });
    var list = a.culprits.map(function (c) {
      var shown = c.ch === ' ' ? 'non-breaking space' : (c.ch === '​' ? 'zero-width space' : c.ch);
      return '<span>' + esc(shown) + (c.fix !== null ? '<b>→ ' + esc(c.fix === ' ' ? 'space' : (c.fix || 'remove')) + '</b>' : '') + '</span>';
    }).join('');
    box.innerHTML = '<div class="notice bad">These characters switch the whole message to Unicode, cutting each segment to ' + (a.segments > 1 ? 67 : 70) + ' characters:</div>' +
      '<div class="cul">' + list + '</div>' +
      (fixable ? '<button type="button" class="btn btn-solid btn-sm" id="fixBtn">Replace smart characters</button>' : '') +
      '<p class="panel-note" style="margin-top:0.7rem;">Emojis and letters outside GSM-7 have no plain equivalent. Remove them if cost matters more than style.</p>';
    var fb = $('#fixBtn');
    if (fb) fb.addEventListener('click', function () {
      msg.value = SBY.smsFix(msg.value);
      update();
      SBY.toast('Smart characters replaced');
    });
  }

  // © https://saadbinyousaf.dev/ © //
  function update() {
    var raw = msg.value + (footer.checked ? OPT_OUT : '');
    var n = Math.max(0, parseInt(mergeLen.value, 10) || 0);
    var ex = expandMerge(raw, n);
    var a = SBY.smsAnalyze(ex.text);

    $('#rawCount').textContent = Array.from(msg.value).length + ' characters typed';
    var mf = $('#mergeFound');
    mf.textContent = ex.count ? ex.count + ' × ' + n + ' chars' : 'None';
    mf.className = 'badge ' + (ex.count ? 'warn' : 'ok');

    var enc = $('#encBadge');
    enc.textContent = a.encoding;
    enc.className = 'badge ' + (a.unicode ? 'bad' : 'ok');

    $('#sSegments').textContent = a.segments;
    $('#sSegments').className = 'v' + (a.segments > 2 ? ' bad' : a.segments === 2 ? ' warn' : '');
    $('#sChars').textContent = a.units;
    $('#sLeft').textContent = a.left;
    $('#sPer').textContent = a.perSegment;

    var used = a.segments === 0 ? 0 : (a.segments === 1 ? a.units / a.perSegment : (a.units - (a.segments - 1) * a.perSegment) / a.perSegment);
    $('#meter').style.width = Math.min(100, Math.round(used * 100)) + '%';

    var why;
    if (a.segments === 0) why = 'Type or paste a message to begin.';
    else if (a.segments === 1) why = 'Fits in a single segment. A ' + (a.unicode ? 'Unicode' : 'GSM-7') + ' message can hold ' + a.perSegment + ' characters before it splits.';
    else why = 'Longer than one segment, so carriers split it into ' + a.segments + ' parts of up to ' + a.perSegment + ' characters each. A few characters per part are used to stitch the pieces back together on the phone.';
    if (a.extended) why += ' ' + a.extended + ' character' + (a.extended > 1 ? 's' : '') + ' like { } [ ] ~ € or | count double in GSM-7.';
    if (ex.count) why += ' Merge fields are estimated — a long name or company can push a message into the next segment.';
    $('#explain').textContent = why;

    renderViz(a);
    renderCulprits(a);

    var r = Math.max(0, parseFloat(recips.value) || 0);
    var price = Math.max(0, parseFloat(rate.value) || 0) + Math.max(0, parseFloat(fee.value) || 0);
    var per = a.segments * price;
    $('#cPer').textContent = SBY.money(per, '$', per < 1 ? 4 : 2);
    $('#cTotal').textContent = SBY.money(per * r, '$', per * r < 100 ? 2 : 0);

    SBY.store.set('sms-calc', { msg: msg.value, footer: footer.checked, mergeLen: n, recips: r, rate: rate.value, fee: fee.value });
  }

  // © https://saadbinyousaf.dev/ © //
  var saved = SBY.store.get('sms-calc', null);
  if (saved) {
    if (typeof saved.msg === 'string' && saved.msg.length) msg.value = saved.msg;
    footer.checked = saved.footer !== false;
    if (saved.mergeLen != null) mergeLen.value = saved.mergeLen;
    if (saved.recips != null) recips.value = saved.recips;
    if (saved.rate) rate.value = saved.rate;
    if (saved.fee) fee.value = saved.fee;
  }

  [msg, footer, mergeLen, recips, rate, fee].forEach(function (el) {
    el.addEventListener('input', update);
    el.addEventListener('change', update);
  });
  document.querySelectorAll('#examples button').forEach(function (b) {
    b.addEventListener('click', function () {
      msg.value = EXAMPLES[b.getAttribute('data-ex')];
      document.querySelectorAll('#examples button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      update();
      msg.focus();
    });
  });
  update();
})();
// © https://saadbinyousaf.dev/ © //
