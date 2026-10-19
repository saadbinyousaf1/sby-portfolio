// © https://saadbinyousaf.dev/ © //
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var esc = SBY.esc;

  // © https://saadbinyousaf.dev/ © //
  var COUNTRIES = [
    ['US', 'United States / Canada (+1)', '1', false, 10, 10, true],
    ['GB', 'United Kingdom (+44)', '44', true, 9, 10],
    ['AU', 'Australia (+61)', '61', true, 9, 9],
    ['NZ', 'New Zealand (+64)', '64', true, 8, 10],
    ['IE', 'Ireland (+353)', '353', true, 7, 9],
    ['PK', 'Pakistan (+92)', '92', true, 9, 10],
    ['IN', 'India (+91)', '91', true, 10, 10],
    ['AE', 'United Arab Emirates (+971)', '971', true, 8, 9],
    ['SA', 'Saudi Arabia (+966)', '966', true, 8, 9],
    ['ZA', 'South Africa (+27)', '27', true, 9, 9],
    ['NG', 'Nigeria (+234)', '234', true, 10, 10],
    ['PH', 'Philippines (+63)', '63', true, 10, 10],
    ['SG', 'Singapore (+65)', '65', false, 8, 8],
    ['MX', 'Mexico (+52)', '52', false, 10, 10],
    ['DE', 'Germany (+49)', '49', true, 7, 11],
    ['FR', 'France (+33)', '33', true, 9, 9],
    ['ES', 'Spain (+34)', '34', false, 9, 9]
  ];

  var TARGETS = [
    ['first', 'First Name', ['firstname', 'first', 'fname', 'givenname', 'forename', 'contactfirstname']],
    ['last', 'Last Name', ['lastname', 'last', 'lname', 'surname', 'familyname', 'contactlastname']],
    ['full', 'Full Name (to split)', ['name', 'fullname', 'contactname', 'customername', 'clientname', 'leadname', 'contact']],
    ['email', 'Email', ['email', 'emailaddress', 'mail', 'email1', 'primaryemail', 'contactemail', 'emails']],
    ['phone', 'Phone', ['phone', 'phonenumber', 'mobile', 'mobilephone', 'mobilenumber', 'cell', 'cellphone', 'cellnumber', 'telephone', 'tel', 'contactnumber', 'phone1', 'primaryphone', 'whatsapp', 'number']],
    ['company', 'Company Name', ['company', 'companyname', 'business', 'businessname', 'organization', 'organisation', 'org', 'account', 'accountname']],
    ['address', 'Address', ['address', 'address1', 'streetaddress', 'street', 'addressline1', 'mailingaddress']],
    ['city', 'City', ['city', 'town', 'suburb']],
    ['state', 'State', ['state', 'province', 'region', 'county', 'stateprovince']],
    ['postal', 'Postal Code', ['postalcode', 'postcode', 'zip', 'zipcode']],
    ['country', 'Country', ['country', 'countrycode']],
    ['website', 'Website', ['website', 'url', 'web', 'site', 'websiteurl', 'homepage']],
    ['source', 'Source', ['source', 'leadsource']],
    ['tags', 'Tags', ['tags', 'tag', 'labels', 'label']]
  ];
  var LOOSE_SKIP = ['number', 'contact', 'label', 'labels'];
  var OUT = TARGETS.filter(function (t) { return t[0] !== 'full'; });

  var TYPOS = {
    'gmial.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gnail.com': 'gmail.com',
    'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'gmail.cm': 'gmail.com', 'gmail.om': 'gmail.com', 'gmail.cmo': 'gmail.com',
    'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmil.com': 'hotmail.com', 'hotmail.co': 'hotmail.com', 'hotmail.con': 'hotmail.com',
    'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yhoo.com': 'yahoo.com', 'yahoo.co': 'yahoo.com', 'yahoo.con': 'yahoo.com',
    'outlok.com': 'outlook.com', 'outllok.com': 'outlook.com', 'otlook.com': 'outlook.com', 'outlook.co': 'outlook.com', 'outlook.con': 'outlook.com',
    'iclod.com': 'icloud.com', 'iclould.com': 'icloud.com', 'icloud.co': 'icloud.com', 'icloud.con': 'icloud.com',
    'aol.co': 'aol.com', 'aol.con': 'aol.com'
  };

  var SAMPLE = 'Name,E-mail Address,Mobile Phone,Company,City,Notes\n' +
    'JOHN SMITH,John.Smith@Gmial.com,(555) 201-4455,smith plumbing,austin,Met at expo\n' +
    'maria garcia,maria@garcialaw.com,555.201.7788,,Dallas,\n' +
    '"O\'BRIEN, KATE",kate.obrien@yahoo.co,+1 555 201 9921,O\'Brien Realty,Houston,VIP\n' +
    'Ahmed Khan,ahmed@khanautos,0300 1234567,Khan Autos,Karachi,Pakistan number\n' +
    'john smith,john.smith@gmail.com,555-201-4455,Smith Plumbing,Austin,Same person as row 1\n' +
    'LEE WONG,,(555) 201-3344 ext 12,Wong Dental,San Antonio,\n' +
    'Priya Patel,priya.patel@outlok.com,,Patel Consulting,Austin,\n' +
    ',no-contact@,,,,\n' +
    'Carlos Ruiz,carlos@ruizroofing.com,15552019087,Ruiz Roofing,El Paso,\n' +
    'DEBORAH MCDONALD,debbie@mcdonaldspa.com,555 201 6612 / 555 201 6613,McDonald Med Spa,Austin,\n' +
    'Sam Taylor,sam@taylorfit.com,123,,Austin,Bad phone\n';

  var data = { headers: [], rows: [], name: '' };
  var mapping = {};
  var result = null;

  // © https://saadbinyousaf.dev/ © //
  function detectDelim(text) {
    var line = text.split(/\r?\n/)[0] || '';
    var best = ',', max = -1;
    [',', ';', '\t', '|'].forEach(function (d) {
      var n = 0, q = false;
      for (var i = 0; i < line.length; i++) { if (line[i] === '"') q = !q; else if (!q && line[i] === d) n++; }
      if (n > max) { max = n; best = d; }
    });
    return best;
  }

  function parseCSV(text) {
    text = text.replace(/^﻿/, '');
    var d = detectDelim(text), rows = [], row = [], f = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) {
        if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
        else f += ch;
      } else if (ch === '"') q = true;
      else if (ch === d) { row.push(f); f = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(f); f = '';
        if (row.some(function (c) { return c.trim() !== ''; })) rows.push(row);
        row = [];
      } else f += ch;
    }
    if (f !== '' || row.length) { row.push(f); if (row.some(function (c) { return c.trim() !== ''; })) rows.push(row); }
    return rows;
  }

  function toCSV(rows) {
    return rows.map(function (r) {
      return r.map(function (v) {
        v = v == null ? '' : String(v);
        return /[",\r\n]/.test(v) || /^\s|\s$/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
      }).join(',');
    }).join('\n') + '\n';
  }

  // © https://saadbinyousaf.dev/ © //
  function norm(h) { return (h || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }

  function autoMap() {
    mapping = {};
    var used = {};
    var nh = data.headers.map(norm);
    TARGETS.forEach(function (t) {
      var idx = -1;
      for (var i = 0; i < nh.length && idx < 0; i++) if (!used[i] && t[2].indexOf(nh[i]) > -1) idx = i;
      mapping[t[0]] = idx;
      if (idx > -1) used[idx] = 1;
    });
    TARGETS.forEach(function (t) {
      if (mapping[t[0]] > -1) return;
      for (var i = 0; i < nh.length; i++) {
        if (used[i]) continue;
        if (t[2].some(function (a) { return a.length > 4 && LOOSE_SKIP.indexOf(a) === -1 && nh[i].indexOf(a) > -1; })) { mapping[t[0]] = i; used[i] = 1; break; }
      }
    });
  }

  function renderMap() {
    var opts = '<option value="-1">— not in my file —</option>' + data.headers.map(function (h, i) { return '<option value="' + i + '">' + esc(h || 'Column ' + (i + 1)) + '</option>'; }).join('');
    $('#mapGrid').innerHTML = TARGETS.map(function (t) {
      return '<div class="field"><label for="m_' + t[0] + '">' + esc(t[1]) + '</label><select id="m_' + t[0] + '" data-target="' + t[0] + '">' + opts + '</select></div>';
    }).join('');
    TARGETS.forEach(function (t) {
      var s = $('#m_' + t[0]);
      s.value = String(mapping[t[0]]);
      s.classList.toggle('matched', mapping[t[0]] > -1);
      s.addEventListener('change', function () { mapping[t[0]] = parseInt(s.value, 10); s.classList.toggle('matched', mapping[t[0]] > -1); run(); });
    });
    var n = TARGETS.filter(function (t) { return mapping[t[0]] > -1; }).length;
    $('#mapNote').textContent = n + ' of your ' + data.headers.length + ' columns matched automatically. Adjust anything that looks wrong.';
    $('#mapPanel').hidden = false;
  }

  // © https://saadbinyousaf.dev/ © //
  function titleCase(s) {
    return s.toLowerCase()
      .replace(/(^|[\s\-'’.])([a-zà-ÿ])/g, function (m, p, c) { return p + c.toUpperCase(); })
      .replace(/\bMc([a-z])/g, function (m, c) { return 'Mc' + c.toUpperCase(); });
  }
  function smartCase(s) {
    if (!/[a-zA-Z]/.test(s)) return s;
    if (s === s.toUpperCase() || s === s.toLowerCase()) return titleCase(s);
    return s;
  }

  function country() {
    var code = $('#country').value;
    for (var i = 0; i < COUNTRIES.length; i++) if (COUNTRIES[i][0] === code) return COUNTRIES[i];
    return COUNTRIES[0];
  }

  // © https://saadbinyousaf.dev/ © //
  function normPhone(raw, C) {
    var s = (raw || '').trim();
    if (!s) return { v: '', st: '' };
    var note = '';
    var parts = s.split(/\s*(?:\/|;|,|\bor\b|&)\s*/i).filter(function (p) { return p.replace(/\D/g, '').length >= 7; });
    if (parts.length > 1) { s = parts[0]; note = 'Several numbers — kept the first'; }
    s = s.replace(/\s*(?:ext\.?|extension|x|#)\s*\d{1,6}\s*$/i, '');
    var plus = /^\s*\+/.test(s);
    var d = s.replace(/\D/g, '');
    if (!plus && /^00/.test(d)) { plus = true; d = d.slice(2); }
    if (!plus && C[6] && /^011/.test(d)) { plus = true; d = d.slice(3); }
    var out = null;
    if (plus) {
      if (d.length >= 8 && d.length <= 15) out = '+' + d;
    } else if (C[6]) {
      var n = d.length === 11 && d[0] === '1' ? d.slice(1) : d;
      if (n.length === 10 && /[2-9]/.test(n[0]) && /[2-9]/.test(n[3])) out = '+1' + n;
    } else {
      var cc = C[2], min = C[4], max = C[5];
      var inR = function (l) { return l >= min && l <= max; };
      if (d.indexOf(cc) === 0 && inR(d.length - cc.length) && !(C[3] && d[0] === '0')) out = '+' + d;
      else {
        var n2 = C[3] && d[0] === '0' ? d.slice(1) : d;
        if (inR(n2.length)) out = '+' + cc + n2;
      }
    }
    if (!out) return { v: raw.trim(), st: 'err', note: 'Phone number could not be formatted' };
    return { v: out, st: note ? 'flag' : (out === raw.trim() ? '' : 'fixed'), note: note };
  }

  function normEmail(raw, fix) {
    var s = (raw || '').trim().replace(/^mailto:/i, '').replace(/\s+/g, '').replace(/[.,;]+$/, '');
    if (!s) return { v: '', st: '' };
    var orig = raw.trim();
    if (fix) {
      s = s.toLowerCase();
      var at = s.lastIndexOf('@');
      if (at > -1) { var dom = s.slice(at + 1); if (TYPOS[dom]) s = s.slice(0, at + 1) + TYPOS[dom]; }
    }
    var ok = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(s);
    if (!ok) return { v: s, st: 'err', invalid: true, note: 'Invalid email' };
    return { v: s, st: s === orig ? '' : 'fixed' };
  }

  function splitTags(s) { return (s || '').split(/[,;|]/).map(function (t) { return t.trim(); }).filter(Boolean); }

  // © https://saadbinyousaf.dev/ © //
  function run() {
    if (!data.rows.length) return;
    var C = country();
    var o = {
      names: $('#optNames').checked, split: $('#optSplit').checked, email: $('#optEmail').checked,
      badEmail: $('#optBadEmail').checked, empty: $('#optEmpty').checked, extra: $('#optExtra').checked,
      dedupe: $('#dedupe').value, tag: splitTags($('#addTag').value)
    };
    var mappedIdx = {};
    TARGETS.forEach(function (t) { if (mapping[t[0]] > -1) mappedIdx[mapping[t[0]]] = 1; });
    var extras = o.extra ? data.headers.map(function (h, i) { return i; }).filter(function (i) { return !mappedIdx[i]; }) : [];

    var stats = { loaded: data.rows.length, phones: 0, emails: 0, names: 0, dupes: 0, review: 0, removed: 0 };
    var clean = [], issues = [];
    var byEmail = {}, byPhone = {};

    data.rows.forEach(function (r, ri) {
      var get = function (k) { return mapping[k] > -1 ? (r[mapping[k]] || '').trim() : ''; };
      var rec = { v: {}, st: {}, notes: [], row: ri + 2, raw: r, tags: [] };
      OUT.forEach(function (t) { rec.v[t[0]] = get(t[0]); rec.st[t[0]] = ''; });

      if (o.split && !rec.v.first && !rec.v.last && get('full')) {
        var full = get('full').replace(/\s+/g, ' ');
        if (full.indexOf(',') > -1) { rec.v.last = full.split(',')[0].trim(); rec.v.first = full.split(',').slice(1).join(',').trim(); }
        else { var w = full.split(' '); rec.v.first = w[0]; rec.v.last = w.slice(1).join(' '); }
        rec.st.first = rec.st.last = 'fixed';
      }
      if (o.names) ['first', 'last'].forEach(function (k) {
        var c = smartCase(rec.v[k]);
        if (c !== rec.v[k]) { rec.v[k] = c; rec.st[k] = 'fixed'; stats.names++; }
      });
      if (o.names && rec.v.company) { var cc = smartCase(rec.v.company); if (cc !== rec.v.company) { rec.v.company = cc; rec.st.company = 'fixed'; } }
      if (o.names && rec.v.city) { var ct = smartCase(rec.v.city); if (ct !== rec.v.city) { rec.v.city = ct; rec.st.city = 'fixed'; } }

      var em = normEmail(rec.v.email, o.email);
      rec.v.email = em.v; rec.st.email = em.st;
      if (em.st === 'fixed') stats.emails++;
      if (em.invalid) {
        rec.notes.push('Invalid email "' + em.v + '"' + (o.badEmail ? ' removed' : ''));
        if (o.badEmail) { rec.v.email = ''; rec.st.email = 'flag'; }
      }
      var ph = normPhone(rec.v.phone, C);
      rec.v.phone = ph.v; rec.st.phone = ph.st;
      if (ph.st === 'fixed' || ph.st === 'flag') stats.phones++;
      if (ph.note) rec.notes.push(ph.note);

      rec.tags = splitTags(rec.v.tags).concat(o.tag);
      rec.extra = extras.map(function (i) { return (r[i] || '').trim(); });

      var hasEmail = rec.v.email && !em.invalid;
      var hasPhone = rec.v.phone && ph.st !== 'err';
      if (o.empty && !hasEmail && !hasPhone) {
        stats.removed++;
        issues.push([rec.row, 'Removed: no valid email or phone' + (rec.notes.length ? ' (' + rec.notes.join('; ') + ')' : '')].concat(r));
        return;
      }

      var ek = hasEmail ? rec.v.email.toLowerCase() : null, pk = hasPhone ? rec.v.phone : null;
      var hit = null;
      if (o.dedupe !== 'off') {
        if ((o.dedupe === 'both' || o.dedupe === 'email') && ek && byEmail[ek]) hit = byEmail[ek];
        else if ((o.dedupe === 'both' || o.dedupe === 'phone') && pk && byPhone[pk]) hit = byPhone[pk];
      }
      if (hit) {
        OUT.forEach(function (t) { if (!hit.v[t[0]] && rec.v[t[0]]) { hit.v[t[0]] = rec.v[t[0]]; hit.st[t[0]] = 'fixed'; } });
        rec.tags.forEach(function (t) { if (hit.tags.indexOf(t) === -1) hit.tags.push(t); });
        rec.extra.forEach(function (v, i) { if (!hit.extra[i] && v) hit.extra[i] = v; });
        stats.dupes++;
        issues.push([rec.row, 'Merged into row ' + hit.row + ' (duplicate)'].concat(r));
        if (ek && !byEmail[ek]) byEmail[ek] = hit;
        if (pk && !byPhone[pk]) byPhone[pk] = hit;
        return;
      }
      if (ek) byEmail[ek] = rec;
      if (pk) byPhone[pk] = rec;
      if (rec.notes.length || ph.st === 'err') { stats.review++; issues.push([rec.row, 'Kept, needs a look: ' + rec.notes.join('; ')].concat(r)); }
      clean.push(rec);
    });

    clean.forEach(function (rec) { rec.v.tags = rec.tags.filter(function (t, i, a) { return a.indexOf(t) === i; }).join(', '); });
    result = { clean: clean, issues: issues, extras: extras, stats: stats };
    renderResult();
  }

  // © https://saadbinyousaf.dev/ © //
  function outputColumns() {
    var cols = OUT.filter(function (t) { return result.clean.some(function (r) { return r.v[t[0]]; }); });
    if (!cols.length) cols = OUT.slice(0, 4);
    return cols;
  }

  function renderResult() {
    var s = result.stats;
    var tiles = [
      [s.loaded, 'Rows loaded', 'plain'], [result.clean.length, 'Ready to import', ''], [s.dupes, 'Duplicates merged', s.dupes ? 'warn' : 'plain'],
      [s.phones, 'Phones formatted', 'plain'], [s.emails, 'Emails fixed', 'plain'], [s.review, 'Need a look', s.review ? 'warn' : 'plain'], [s.removed, 'Removed', s.removed ? 'bad' : 'plain']
    ];
    $('#stats').innerHTML = tiles.map(function (t) { return '<div class="stat"><div class="v ' + t[2] + '">' + SBY.num(t[0]) + '</div><div class="k">' + t[1] + '</div></div>'; }).join('');
    var cols = outputColumns();
    var extraHeads = result.extras.map(function (i) { return data.headers[i] || ('Column ' + (i + 1)); });
    var head = '<thead><tr><th>#</th>' + cols.map(function (c) { return '<th>' + esc(c[1]) + '</th>'; }).join('') + extraHeads.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead>';
    var body = result.clean.slice(0, 100).map(function (r) {
      return '<tr><td style="color:var(--dim)">' + r.row + '</td>' + cols.map(function (c) {
        var st = r.st[c[0]];
        return '<td class="' + (st || '') + '" title="' + esc(r.v[c[0]]) + '">' + esc(r.v[c[0]]) + '</td>';
      }).join('') + r.extra.map(function (v) { return '<td title="' + esc(v) + '">' + esc(v) + '</td>'; }).join('') + '</tr>';
    }).join('');
    $('#preview').innerHTML = head + '<tbody>' + body + '</tbody>';
    $('#previewNote').textContent = result.clean.length > 100 ? 'Showing the first 100 of ' + SBY.num(result.clean.length) + ' rows. The download includes all of them.' : 'Row numbers refer to the line in your original file.';
    $('#dlIssues').disabled = !result.issues.length;
    $('#resultPanel').hidden = false;
  }

  // © https://saadbinyousaf.dev/ © //
  function load(text, name) {
    var rows = parseCSV(text);
    if (rows.length < 2) { $('#loadInfo').innerHTML = '<div class="notice bad">We could not find a header row and at least one contact. Check that the file is a CSV.</div>'; return; }
    var width = Math.max.apply(null, rows.map(function (r) { return r.length; }));
    data.headers = rows[0].map(function (h, i) { return h.trim() || ('Column ' + (i + 1)); });
    while (data.headers.length < width) data.headers.push('Column ' + (data.headers.length + 1));
    data.rows = rows.slice(1);
    data.name = name || 'contacts';
    $('#loadInfo').innerHTML = '<div class="notice">Loaded <strong>' + SBY.num(data.rows.length) + '</strong> contacts and ' + data.headers.length + ' columns' + (name ? ' from <code>' + esc(name) + '</code>' : '') + '.</div>';
    autoMap();
    renderMap();
    run();
    document.getElementById('mapPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function readFile(f) {
    if (!f) return;
    if (/\.(xlsx?|numbers)$/i.test(f.name)) { $('#loadInfo').innerHTML = '<div class="notice warn">That is a spreadsheet file. In Excel or Google Sheets, choose File → Download / Save As → CSV, then load the CSV here.</div>'; return; }
    var rd = new FileReader();
    rd.onload = function () { load(String(rd.result), f.name); };
    rd.onerror = function () { $('#loadInfo').innerHTML = '<div class="notice bad">The file could not be read.</div>'; };
    rd.readAsText(f);
  }

  function stamp() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function base() { return data.name.replace(/\.(csv|tsv|txt)$/i, '').replace(/[^a-z0-9_-]+/gi, '-').toLowerCase() || 'contacts'; }

  // © https://saadbinyousaf.dev/ © //
  $('#country').innerHTML = COUNTRIES.map(function (c) { return '<option value="' + c[0] + '">' + esc(c[1]) + '</option>'; }).join('');
  $('#country').value = SBY.store.get('csv-country', 'US');
  $('#file').addEventListener('change', function () { readFile(this.files[0]); this.value = ''; });
  var drop = $('#drop');
  ['dragenter', 'dragover'].forEach(function (e) { drop.addEventListener(e, function (ev) { ev.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (e) { drop.addEventListener(e, function (ev) { ev.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function (ev) { readFile(ev.dataTransfer.files[0]); });
  $('#loadPaste').addEventListener('click', function () { var t = $('#paste').value; if (t.trim()) load(t, 'pasted-contacts'); else SBY.toast('Paste some CSV first'); });
  $('#loadSample').addEventListener('click', function () { $('#paste').value = SAMPLE; load(SAMPLE, 'sample-contacts'); });
  ['optNames', 'optSplit', 'optEmail', 'optBadEmail', 'optEmpty', 'optExtra', 'dedupe', 'country'].forEach(function (id) {
    $('#' + id).addEventListener('change', function () { if (id === 'country') SBY.store.set('csv-country', this.value); run(); });
  });
  $('#addTag').addEventListener('input', SBY.debounce(run, 250));

  $('#dlClean').addEventListener('click', function () {
    if (!result) return;
    var cols = outputColumns();
    var heads = cols.map(function (c) { return c[1]; }).concat(result.extras.map(function (i) { return data.headers[i]; }));
    var rows = [heads].concat(result.clean.map(function (r) { return cols.map(function (c) { return r.v[c[0]]; }).concat(r.extra); }));
    SBY.download(base() + '-clean-' + stamp() + '.csv', toCSV(rows), 'text/csv;charset=utf-8');
    SBY.toast('Clean CSV downloaded');
  });
  $('#dlIssues').addEventListener('click', function () {
    if (!result || !result.issues.length) return;
    var rows = [['Original row', 'What happened'].concat(data.headers)].concat(result.issues);
    SBY.download(base() + '-removed-and-flagged-' + stamp() + '.csv', toCSV(rows), 'text/csv;charset=utf-8');
  });
})();
// © https://saadbinyousaf.dev/ © //
