// © https://saadbinyousaf.dev/ © //
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };

  // © https://saadbinyousaf.dev/ © //
  var PRESETS = {
    'HVAC & plumbing': { calls: 320, missed: 25, lead: 55, close: 45, value: 450 },
    'Roofing': { calls: 140, missed: 30, lead: 65, close: 25, value: 9000 },
    'Dental': { calls: 420, missed: 22, lead: 40, close: 55, value: 900 },
    'Med spa': { calls: 260, missed: 28, lead: 50, close: 35, value: 450 },
    'Law firm': { calls: 160, missed: 25, lead: 60, close: 20, value: 4000 },
    'Real estate': { calls: 110, missed: 30, lead: 60, close: 5, value: 8000 },
    'Salon': { calls: 300, missed: 30, lead: 35, close: 60, value: 90 },
    'Auto repair': { calls: 260, missed: 25, lead: 45, close: 50, value: 420 },
    'Home cleaning': { calls: 200, missed: 30, lead: 55, close: 45, value: 200 },
    'Agency': { calls: 70, missed: 25, lead: 50, close: 20, value: 2500 }
  };
  var DEFAULT = 'HVAC & plumbing';
  var PAIRS = ['calls', 'missed', 'lead', 'close', 'recover'];

  // © https://saadbinyousaf.dev/ © //
  function val(id) { return Math.max(0, parseFloat($('#' + id).value) || 0); }
  function setPair(id, v) { $('#' + id).value = v; $('#' + id + 'N').value = v; }

  function animate(el, to, fmt) {
    var from = parseFloat(el.getAttribute('data-v')) || 0;
    el.setAttribute('data-v', to);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt(to); return; }
    var start = null, dur = 600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // © https://saadbinyousaf.dev/ © //
  function update() {
    var cur = $('#currency').value;
    var money = function (n) { return SBY.money(Math.round(n), cur, 0); };
    var calls = val('calls'), missedPct = val('missed') / 100, leadPct = val('lead') / 100;
    var closePct = val('close') / 100, value = val('value'), recPct = val('recover') / 100, cost = val('cost');

    var missed = calls * missedPct;
    var leads = missed * leadPct;
    var customers = leads * closePct;
    var lostM = customers * value;
    var lostY = lostM * 12;
    var recM = lostM * recPct;
    var recY = recM * 12;
    var net = recY - cost * 12;

    animate($('#bigLost'), lostY, money);
    $('#bigNote').textContent = SBY.num(calls) + ' calls × ' + Math.round(missedPct * 100) + '% missed × ' + Math.round(leadPct * 100) + '% new leads × ' + Math.round(closePct * 100) + '% close rate × ' + money(value) + ' per customer × 12 months.';
    $('#rMissed').textContent = SBY.num(missed);
    $('#rLeads').textContent = SBY.num(leads);
    $('#rCust').textContent = SBY.num(customers, 1);
    $('#rMonth').textContent = money(lostM);
    $('#rRecM').textContent = money(recM);
    $('#rRecY').textContent = money(recY);
    $('#rNet').textContent = money(net);
    $('#rNet').className = 'v' + (net < 0 ? ' bad' : '');
    $('#barLostV').textContent = money(lostY);
    $('#barRecV').textContent = money(recY);
    $('#barLost').style.width = lostY > 0 ? '100%' : '0%';
    $('#barRec').style.width = lostY > 0 ? Math.round(recY / lostY * 100) + '%' : '0%';
    var b = $('#roiBadge');
    if (cost > 0) { var x = recY / (cost * 12); b.textContent = (x >= 10 ? Math.round(x) : x.toFixed(1)) + '× return'; b.className = 'badge ' + (x >= 1 ? 'ok' : 'bad'); }
    else { b.textContent = Math.round(recPct * 100) + '% recovered'; b.className = 'badge ok'; }

    var save = { currency: cur, value: value, cost: cost };
    PAIRS.forEach(function (p) { save[p] = val(p); });
    SBY.store.set('missed-call', save);
  }

  // © https://saadbinyousaf.dev/ © //
  function templates() {
    var T = [
      ['Friendly', 'Hi, this is {{location.name}}. Sorry we missed your call! How can we help? Reply here and we will get right back to you.'],
      ['With booking link', 'Sorry we missed your call! This is {{location.name}}. Reply with how we can help, or book a time that suits you: {{custom_values.booking_link}}'],
      ['After hours', 'Thanks for calling {{location.name}}! We are closed right now but will call you back first thing tomorrow. Reply here if you would like to share details in the meantime.']
    ];
    $('#templates').innerHTML = T.map(function (t, i) {
      var a = SBY.smsAnalyze(t[1].replace(/\{\{[^}]+\}\}/g, 'xxxxxxxxxxxxxxxxxx'));
      return '<div class="out-block"><div class="out-head"><span class="label">' + t[0] + ' <span style="color:var(--dim);letter-spacing:0.06em;">~' + a.segments + ' seg</span></span><button type="button" class="copy-btn" data-copy="#tpl' + i + '">Copy</button></div><div class="out-body" id="tpl' + i + '">' + SBY.esc(t[1]) + '</div></div>';
    }).join('');
  }

  // © https://saadbinyousaf.dev/ © //
  function applyPreset(name) {
    var p = PRESETS[name];
    ['calls', 'missed', 'lead', 'close'].forEach(function (k) { setPair(k, p[k]); });
    $('#value').value = p.value;
    document.querySelectorAll('#presets button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-p') === name ? 'true' : 'false'); });
    update();
  }

  $('#presets').innerHTML = Object.keys(PRESETS).map(function (k) { return '<button type="button" data-p="' + k + '" aria-pressed="false">' + k + '</button>'; }).join('');
  $('#presets').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) applyPreset(b.getAttribute('data-p')); });

  PAIRS.forEach(function (p) {
    $('#' + p).addEventListener('input', function () { $('#' + p + 'N').value = this.value; update(); });
    $('#' + p + 'N').addEventListener('input', function () {
      var r = $('#' + p);
      if (parseFloat(this.value) > parseFloat(r.max)) r.max = this.value;
      r.value = this.value;
      update();
    });
  });
  ['value', 'cost', 'currency'].forEach(function (id) { $('#' + id).addEventListener('input', update); $('#' + id).addEventListener('change', update); });
  ['calls', 'missed', 'lead', 'close'].concat(['value']).forEach(function (id) {
    $('#' + id).addEventListener('input', function () { document.querySelectorAll('#presets button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); });
  });

  templates();
  setPair('recover', 30);
  var saved = SBY.store.get('missed-call', null);
  if (saved && saved.calls != null) {
    PAIRS.forEach(function (p) { if (saved[p] != null) { if (saved[p] > parseFloat($('#' + p).max)) $('#' + p).max = saved[p]; setPair(p, saved[p]); } });
    $('#value').value = saved.value;
    $('#cost').value = saved.cost || 0;
    if (saved.currency) $('#currency').value = saved.currency;
    update();
  } else applyPreset(DEFAULT);
})();
// © https://saadbinyousaf.dev/ © //
