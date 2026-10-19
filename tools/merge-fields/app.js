// © https://saadbinyousaf.dev/ © //
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var esc = SBY.esc;

  // © https://saadbinyousaf.dev/ © //
  function when() {
    var v = $('#sWhen').value;
    var d = new Date(v);
    if (isNaN(d)) d = new Date(2026, 2, 10, 10, 0);
    return d;
  }
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function fmtDate(d) { return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); }
  function fmtTime(d) { var h = d.getHours(), m = d.getMinutes(); return ((h % 12) || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h < 12 ? 'AM' : 'PM'); }
  function plus(d, mins) { return new Date(d.getTime() + mins * 60000); }
  function slug(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ''); }
  function v(id) { return $('#' + id).value.trim(); }

  // © https://saadbinyousaf.dev/ © //
  var FIELDS = [
    ['Contact', 'contact.first_name', 'First name', function () { return v('sFirst'); }],
    ['Contact', 'contact.last_name', 'Last name', function () { return v('sLast'); }],
    ['Contact', 'contact.name', 'Full name', function () { return (v('sFirst') + ' ' + v('sLast')).trim(); }],
    ['Contact', 'contact.email', 'Email', function () { return (slug(v('sFirst')) || 'contact') + '@example.com'; }],
    ['Contact', 'contact.phone', 'Phone', function () { return '+15555550123'; }],
    ['Contact', 'contact.company_name', 'Company name', function () { return v('sCompany'); }],
    ['Contact', 'contact.address1', 'Street address', function () { return '123 Main Street'; }],
    ['Contact', 'contact.city', 'City', function () { return 'Austin'; }],
    ['Contact', 'contact.state', 'State / region', function () { return 'TX'; }],
    ['Contact', 'contact.postal_code', 'Postal code', function () { return '78701'; }],
    ['Contact', 'contact.country', 'Country', function () { return 'US'; }],
    ['Contact', 'contact.date_of_birth', 'Date of birth', function () { return '1990-04-12'; }],
    ['Contact', 'contact.source', 'Lead source', function () { return 'Facebook Lead Form'; }],
    ['Contact', 'contact.website', 'Website', function () { return 'example.com'; }],
    ['Contact', 'contact.id', 'Contact ID', function () { return 'aB3dE5fG7hJ9'; }],
    ['Business', 'location.name', 'Business name', function () { return v('sBiz'); }],
    ['Business', 'location.full_address', 'Full address', function () { return '500 Commerce Ave, Austin, TX 78701'; }],
    ['Business', 'location.address', 'Street address', function () { return '500 Commerce Ave'; }],
    ['Business', 'location.city', 'City', function () { return 'Austin'; }],
    ['Business', 'location.state', 'State / region', function () { return 'TX'; }],
    ['Business', 'location.postal_code', 'Postal code', function () { return '78701'; }],
    ['Business', 'location.country', 'Country', function () { return 'US'; }],
    ['Business', 'location.phone', 'Business phone', function () { return '+15555550100'; }],
    ['Business', 'location.email', 'Business email', function () { return 'hello@' + (slug(v('sBiz')) || 'business') + '.com'; }],
    ['Business', 'location.website', 'Business website', function () { return (slug(v('sBiz')) || 'business') + '.com'; }],
    ['Assigned user', 'user.name', 'Full name', function () { return v('sUser'); }],
    ['Assigned user', 'user.first_name', 'First name', function () { return v('sUser').split(/\s+/)[0] || ''; }],
    ['Assigned user', 'user.last_name', 'Last name', function () { return v('sUser').split(/\s+/).slice(1).join(' '); }],
    ['Assigned user', 'user.email', 'Email', function () { return (slug(v('sUser').split(/\s+/)[0]) || 'team') + '@' + (slug(v('sBiz')) || 'business') + '.com'; }],
    ['Assigned user', 'user.phone', 'Phone', function () { return '+15555550111'; }],
    ['Assigned user', 'user.email_signature', 'Email signature', function () { return v('sUser') + '\n' + v('sBiz'); }],
    ['Appointment', 'appointment.title', 'Appointment title', function () { return 'Consultation'; }],
    ['Appointment', 'appointment.start_time', 'Start date & time', function () { var d = when(); return DAYS[d.getDay()] + ', ' + fmtDate(d) + ' ' + fmtTime(d); }],
    ['Appointment', 'appointment.only_start_date', 'Start date only', function () { return fmtDate(when()); }],
    ['Appointment', 'appointment.only_start_time', 'Start time only', function () { return fmtTime(when()); }],
    ['Appointment', 'appointment.end_time', 'End date & time', function () { var d = plus(when(), 30); return DAYS[d.getDay()] + ', ' + fmtDate(d) + ' ' + fmtTime(d); }],
    ['Appointment', 'appointment.only_end_date', 'End date only', function () { return fmtDate(plus(when(), 30)); }],
    ['Appointment', 'appointment.only_end_time', 'End time only', function () { return fmtTime(plus(when(), 30)); }],
    ['Appointment', 'appointment.day_of_week', 'Day of week', function () { return DAYS[when().getDay()]; }],
    ['Appointment', 'appointment.month_name', 'Month name', function () { return MONTHS[when().getMonth()]; }],
    ['Appointment', 'appointment.timezone', 'Timezone', function () { return 'America/Chicago'; }],
    ['Appointment', 'appointment.meeting_location', 'Meeting location / link', function () { return '500 Commerce Ave, Suite 2'; }],
    ['Appointment', 'appointment.reschedule_link', 'Reschedule link', function () { return 'https://link.example.com/r/a1b2'; }],
    ['Appointment', 'appointment.cancellation_link', 'Cancellation link', function () { return 'https://link.example.com/c/a1b2'; }],
    ['Appointment', 'appointment.add_to_google_calendar', 'Add to Google Calendar link', function () { return 'https://link.example.com/g/a1b2'; }],
    ['Appointment', 'appointment.add_to_ical_outlook', 'Add to iCal / Outlook link', function () { return 'https://link.example.com/i/a1b2'; }],
    ['Appointment', 'calendar.name', 'Calendar name', function () { return 'Consultations'; }],
    ['Custom', 'contact.your_field_key', 'Custom contact field (template)', function () { return '[custom field value]'; }],
    ['Custom', 'custom_values.your_value_key', 'Custom value (template)', function () { return '[custom value]'; }]
  ];
  var KNOWN = {};
  FIELDS.forEach(function (f) { KNOWN[f[1]] = f; });
  var GROUPS = ['All'].concat(FIELDS.map(function (f) { return f[0]; }).filter(function (g, i, a) { return a.indexOf(g) === i; }));

  // © https://saadbinyousaf.dev/ © //
  var NORM = {};
  FIELDS.forEach(function (f) { if (f[0] !== 'Custom') NORM[f[1].toLowerCase().replace(/[_\s]/g, '')] = f[1]; });
  function suggest(key) {
    var n = key.toLowerCase().replace(/[_\s]/g, '').replace(/^contacts\./, 'contact.').replace(/^users\./, 'user.').replace(/^appointments\./, 'appointment.');
    var hit = NORM[n];
    return hit && hit !== key ? hit : null;
  }

  var state = { group: 'All', channel: 'sms' };
  var compose = $('#compose');

  // © https://saadbinyousaf.dev/ © //
  function renderList() {
    var q = $('#q').value.trim().toLowerCase();
    var rows = FIELDS.filter(function (f) {
      if (state.group !== 'All' && f[0] !== state.group) return false;
      return !q || (f[1] + ' ' + f[2] + ' ' + f[0]).toLowerCase().indexOf(q) > -1;
    });
    $('#fieldCount').textContent = rows.length + ' field' + (rows.length === 1 ? '' : 's');
    if (!rows.length) { $('#fieldList').innerHTML = '<div class="mf-empty">No standard field matches “' + esc(q) + '”. If it is your own data, it is probably a custom field: <code>{{contact.' + esc(q.replace(/[^a-z0-9]+/g, '_')) + '}}</code></div>'; return; }
    var html = '', last = '';
    rows.forEach(function (f) {
      if (f[0] !== last) { html += '<div class="mf-group">' + esc(f[0]) + '</div>'; last = f[0]; }
      html += '<div class="mf-row" role="button" tabindex="0" data-key="' + f[1] + '"><div class="t"><b>' + esc(f[2]) + '</b><code>{{' + f[1] + '}}</code></div><span class="ins">Insert</span><button type="button" class="copy-btn" data-copytext="{{' + f[1] + '}}">Copy</button></div>';
    });
    $('#fieldList').innerHTML = html;
  }

  // © https://saadbinyousaf.dev/ © //
  function insert(key) {
    var token = '{{' + key + '}}';
    var s = compose.selectionStart, e = compose.selectionEnd, val = compose.value;
    if (typeof s !== 'number' || document.activeElement !== compose && s === 0 && e === 0 && val.length) { s = e = val.length; }
    var before = val.slice(0, s), after = val.slice(e);
    var pad = before && !/\s$/.test(before) ? ' ' : '';
    compose.value = before + pad + token + after;
    var pos = (before + pad + token).length;
    compose.focus();
    compose.setSelectionRange(pos, pos);
    update();
    SBY.toast('Inserted {{' + key + '}}');
  }

  // © https://saadbinyousaf.dev/ © //
  function update() {
    var text = compose.value;
    var issues = [];
    var unknown = {}, custom = {};
    var html = '';
    var plain = '';
    var re = /\{\{\s*([^{}]*?)\s*\}\}/g, m, idx = 0;
    while ((m = re.exec(text))) {
      html += esc(text.slice(idx, m.index));
      plain += text.slice(idx, m.index);
      var key = m[1];
      var k = KNOWN[key];
      if (k && k[0] !== 'Custom') {
        var val = k[3]();
        html += esc(val);
        plain += val;
        if (!val) issues.push(['warn', 'Sample value for <code>{{' + esc(key) + '}}</code> is empty. Check the message still reads well — see the guide below for fallbacks.']);
      } else if (!suggest(key) && (/^contact\.[a-z0-9_]+$/.test(key) || /^custom_values\.[a-z0-9_]+$/.test(key))) {
        custom[key] = 1;
        html += '<mark class="custom">' + esc('[' + key.split('.')[1] + ']') + '</mark>';
        plain += '[' + key.split('.')[1] + ']';
      } else {
        unknown[key] = 1;
        html += '<mark>' + esc(m[0]) + '</mark>';
        plain += m[0];
      }
      idx = re.lastIndex;
    }
    html += esc(text.slice(idx));
    plain += text.slice(idx);
    $('#preview').innerHTML = html || '<span style="color:var(--dim)">Your preview appears here.</span>';

    Object.keys(unknown).forEach(function (k) {
      var hint = '';
      var sug = suggest(k);
      if (sug) hint = ' Did you mean <code>{{' + sug + '}}</code>?';
      else if (/^(first_?name|name)$/i.test(k.replace(/\s+/g, ''))) hint = ' Add the prefix: <code>{{contact.first_name}}</code>.';
      issues.push(['bad', '<code>{{' + esc(k) + '}}</code> is not a standard field and will likely be sent as typed.' + hint]);
    });
    Object.keys(custom).forEach(function (k) {
      issues.push(['', '<code>{{' + esc(k) + '}}</code> looks like a ' + (k.indexOf('custom_values.') === 0 ? 'custom value' : 'custom field') + '. Make sure that exact key exists in your account.']);
    });
    var singles = text.replace(/\{\{[^{}]*\}\}/g, '').match(/\{[a-z_]+\.[a-z_]+\}/gi);
    if (singles) issues.push(['bad', 'Single braces like <code>' + esc(singles[0]) + '</code> are not replaced. Merge fields need double braces and lowercase keys: <code>{' + esc(singles[0].toLowerCase()) + '}</code>.']);
    var opens = (text.match(/\{\{/g) || []).length, closes = (text.match(/\}\}/g) || []).length;
    if (opens !== closes) issues.push(['bad', 'There are ' + opens + ' opening <code>{{</code> but ' + closes + ' closing <code>}}</code>. One merge field is not closed.']);
    if (/\b(hi|hey|hello|dear)\s*\{\{\s*contact\.(first_name|name)\s*\}\}/i.test(text)) issues.push(['', 'Greeting uses the contact\'s name. If the name is blank, this reads “Hi ,”. Use a workflow If/Else on “First Name is empty” to send a version without it.']);

    var a = SBY.smsAnalyze(plain);
    var badge = $('#segBadge');
    if (state.channel === 'sms') {
      badge.hidden = false;
      badge.textContent = a.segments + ' segment' + (a.segments === 1 ? '' : 's') + ' · ' + a.length + ' chars';
      badge.className = 'badge ' + (a.segments > 2 || a.unicode ? 'bad' : a.segments === 2 ? 'warn' : 'ok');
      if (a.unicode) issues.push(['warn', 'The preview contains Unicode characters, so each SMS segment holds only 70 characters. <a href="/tools/sms-segment-calculator/">Check it in the SMS calculator</a>.']);
    } else badge.hidden = true;

    $('#lint').innerHTML = issues.length ? issues.map(function (i) { return '<div class="notice ' + i[0] + '">' + i[1] + '</div>'; }).join('')
      : '<div class="notice">No problems found. All merge fields are standard and correctly formatted.</div>';
    SBY.store.set('merge-compose', text);
  }

  // © https://saadbinyousaf.dev/ © //
  $('#groups').innerHTML = GROUPS.map(function (g) { return '<button type="button" data-g="' + esc(g) + '" aria-pressed="' + (g === 'All') + '">' + esc(g) + '</button>'; }).join('');
  $('#groups').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.group = b.getAttribute('data-g');
    this.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    renderList();
  });
  $('#channel').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.channel = b.getAttribute('data-ch');
    this.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    update();
  });
  $('#fieldList').addEventListener('click', function (e) {
    var c = e.target.closest('[data-copytext]');
    if (c) { e.stopPropagation(); SBY.copy(c.getAttribute('data-copytext'), c); return; }
    var r = e.target.closest('.mf-row'); if (r) insert(r.getAttribute('data-key'));
  });
  $('#fieldList').addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('mf-row')) { e.preventDefault(); insert(e.target.getAttribute('data-key')); }
  });
  $('#q').addEventListener('input', renderList);
  compose.addEventListener('input', update);
  document.querySelectorAll('[data-sample]').forEach(function (i) { i.addEventListener('input', update); });
  $('#clearBtn').addEventListener('click', function () { compose.value = ''; update(); compose.focus(); });

  var saved = SBY.store.get('merge-compose', null);
  if (typeof saved === 'string' && saved.length) compose.value = saved;
  renderList();
  update();
})();
// © https://saadbinyousaf.dev/ © //
