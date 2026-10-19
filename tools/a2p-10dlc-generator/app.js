// © https://saadbinyousaf.dev/ © //
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var esc = SBY.esc;

  // © https://saadbinyousaf.dev/ © //
  var IND = {
    home: { label: 'Home services (HVAC, plumbing, roofing, cleaning)', who: 'customers', what: 'service appointments and estimates',
      reminder: '{b}: Hi [Name], reminder that your technician is scheduled for [Date] between [Time Window]. Reply C to confirm or call us to reschedule. Reply STOP to opt out.',
      care: '{b}: Hi [Name], thanks for reaching out! Your estimate is ready to review at {s}/estimate. Questions? Just reply to this text. Reply STOP to opt out.',
      promo: '{b}: Seasonal tune-up special - $20 off any service booked this month. Book at {s}/book. Reply STOP to opt out.' },
    dental: { label: 'Dental practice', who: 'patients', what: 'dental appointments',
      reminder: '{b}: Hi [Name], reminder of your appointment on [Date] at [Time]. Reply C to confirm or call us to reschedule. Reply STOP to opt out.',
      care: '{b}: Hi [Name], your new patient forms are ready at {s}/forms. Please complete them before your visit. Reply STOP to opt out.',
      promo: '{b}: It has been 6 months since your last cleaning. Book your next visit at {s}/book. Reply STOP to opt out.' },
    medical: { label: 'Medical / healthcare clinic', who: 'patients', what: 'clinic appointments',
      reminder: '{b}: Hi [Name], reminder of your appointment on [Date] at [Time]. Reply C to confirm or call our office to reschedule. Reply STOP to opt out.',
      care: '{b}: Hi [Name], our office will be closed on [Date] for the holiday. For urgent needs, please call our main line. Reply STOP to opt out.',
      promo: '{b}: Seasonal flu shots are now available. Walk in Mon-Fri 9-5 or book at {s}/book. Reply STOP to opt out.' },
    beauty: { label: 'Med spa / salon / beauty', who: 'clients', what: 'beauty and wellness appointments',
      reminder: '{b}: Hi [Name], see you on [Date] at [Time]. Need to reschedule? Book at {s}/book. Reply STOP to opt out.',
      care: '{b}: Hi [Name], thanks for visiting today! Your aftercare instructions are at {s}/aftercare. Reply STOP to opt out.',
      promo: '{b}: This week only - 15% off all facials for returning clients. Book at {s}/book. Reply STOP to opt out.' },
    fitness: { label: 'Gym / fitness studio', who: 'members', what: 'classes and memberships',
      reminder: '{b}: Hi [Name], you are booked for [Class] on [Date] at [Time]. Reply STOP to opt out.',
      care: '{b}: Hi [Name], your membership renews on [Date]. Questions? Reply here or visit {s}. Reply STOP to opt out.',
      promo: '{b}: Bring a friend free this Saturday! Reserve their spot at {s}/guest. Reply STOP to opt out.' },
    realestate: { label: 'Real estate', who: 'clients', what: 'property showings and inquiries',
      reminder: '{b}: Hi [Name], confirming your showing at [Address] on [Date] at [Time]. Reply C to confirm. Reply STOP to opt out.',
      care: '{b}: Hi [Name], thanks for your inquiry about [Address]. When is a good time for a quick call? Reply STOP to opt out.',
      promo: '{b}: New listings just came on the market in your area. See them at {s}/listings. Reply STOP to opt out.' },
    legal: { label: 'Law firm', who: 'clients', what: 'consultations and case updates',
      reminder: '{b}: Hi [Name], reminder of your consultation on [Date] at [Time]. Reply C to confirm. Reply STOP to opt out.',
      care: '{b}: Hi [Name], we received your documents. Your case manager will follow up within 2 business days. Reply STOP to opt out.',
      promo: '{b}: Free estate planning workshop on [Date]. Reserve your seat at {s}/events. Reply STOP to opt out.' },
    insurance: { label: 'Insurance agency', who: 'clients', what: 'quotes and policy reviews',
      reminder: '{b}: Hi [Name], your policy review call is scheduled for [Date] at [Time]. Reply STOP to opt out.',
      care: '{b}: Hi [Name], your quote is ready. Review it at {s}/quote or reply with any questions. Reply STOP to opt out.',
      promo: '{b}: Open enrollment starts [Date]. Book a free coverage review at {s}/book. Reply STOP to opt out.' },
    restaurant: { label: 'Restaurant / food & beverage', who: 'guests', what: 'reservations and orders',
      reminder: '{b}: Hi [Name], your table for [Party Size] is confirmed for [Date] at [Time]. Reply STOP to opt out.',
      care: '{b}: Hi [Name], your order is ready for pickup. Reply STOP to opt out.',
      promo: '{b}: Happy hour is back - half-price appetizers 4-6 PM on weekdays. See the menu at {s}/menu. Reply STOP to opt out.' },
    auto: { label: 'Auto repair / dealership', who: 'customers', what: 'vehicle service appointments',
      reminder: '{b}: Hi [Name], your vehicle service is booked for [Date] at [Time]. Reply C to confirm. Reply STOP to opt out.',
      care: '{b}: Hi [Name], your vehicle is ready for pickup. We are open until 6 PM today. Reply STOP to opt out.',
      promo: '{b}: Oil change special - $10 off this month. Book at {s}/service. Reply STOP to opt out.' },
    coaching: { label: 'Coaching / consulting', who: 'clients', what: 'coaching sessions and programs',
      reminder: '{b}: Hi [Name], reminder of your session on [Date] at [Time]. Join here: {s}/session. Reply STOP to opt out.',
      care: '{b}: Hi [Name], your materials for this week are ready at {s}/portal. Reply STOP to opt out.',
      promo: '{b}: Free live training on [Date] - save your seat at {s}/training. Reply STOP to opt out.' },
    ecommerce: { label: 'E-commerce / retail', who: 'customers', what: 'orders and support',
      reminder: '{b}: Hi [Name], your order #[Order] has shipped. Track it at {s}/track. Reply STOP to opt out.',
      care: '{b}: Hi [Name], thanks for contacting support. Your ticket #[Ticket] is open and we will reply within 24 hours. Reply STOP to opt out.',
      promo: '{b}: New arrivals are here. Shop the collection at {s}/new. Reply STOP to opt out.' },
    agency: { label: 'Marketing agency', who: 'clients', what: 'client projects and meetings',
      reminder: '{b}: Hi [Name], reminder of our strategy call on [Date] at [Time]. Reply STOP to opt out.',
      care: '{b}: Hi [Name], your monthly report is ready at {s}/reports. Reply STOP to opt out.',
      promo: '{b}: Free website audit this month for local businesses. Request yours at {s}/audit. Reply STOP to opt out.' },
    other: { label: 'Other / general business', who: 'customers', what: 'appointments and inquiries',
      reminder: '{b}: Hi [Name], reminder of your appointment on [Date] at [Time]. Reply C to confirm. Reply STOP to opt out.',
      care: '{b}: Hi [Name], thanks for reaching out! A team member will reply shortly. Reply STOP to opt out.',
      promo: '{b}: Special offer for our text subscribers this week. Details at {s}/offer. Reply STOP to opt out.' }
  };

  var FOLLOWUP = '{b}: Hi [Name], we just tried to reach you about your request. Reply here or call us when it is convenient. Reply STOP to opt out.';

  var USE = {
    mixed: { desc: 'appointment reminders, service updates, replies to customer questions and occasional promotional offers', terms: 'appointments, account updates, customer support and promotions' },
    reminders: { desc: 'appointment reminders, booking confirmations and service notifications', terms: 'appointments and account notifications' },
    care: { desc: 'replies to customer questions, service updates and account notifications', terms: 'customer support and account updates' },
    marketing: { desc: 'promotional offers, seasonal specials and company news', terms: 'promotions and company news' }
  };

  var CHECKS = [
    ['site', 'Website is live on HTTPS and shows the same business name you are registering'],
    ['ein', 'Legal name and tax ID (EIN) match your IRS records exactly, or you are registering as a sole proprietor'],
    ['privacy', 'Privacy policy includes the text-messaging clause above'],
    ['terms', 'Terms page includes SMS terms: frequency, rates, STOP and HELP'],
    ['checkbox', 'Every form that collects phone numbers has an unchecked, optional SMS consent checkbox'],
    ['samples', 'Every sample message names your brand and includes opt-out wording'],
    ['links', 'Sample links use your own domain, not public shorteners like bit.ly or tinyurl'],
    ['email', 'Business email is on your own domain, not Gmail or Yahoo (strongly recommended)'],
    ['flow', 'Message flow explains exactly where and how people opt in'],
    ['match', 'Use case matches the samples (no promotions under a reminders-only campaign)']
  ];

  var state = { use: 'mixed' };
  var inputs = ['legal', 'brand', 'site', 'ind', 'kw', 'freq', 'support', 'privacyUrl', 'termsUrl'];

  // © https://saadbinyousaf.dev/ © //
  function cleanSite(v) {
    return (v || '').trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  }

  function fill(t, d) {
    return t.replace(/\{b\}/g, d.brand).replace(/\{s\}/g, d.siteUrl);
  }

  function block(id, title, text, sms) {
    var meta = '';
    if (sms) {
      var a = SBY.smsAnalyze(text);
      meta = '<span class="seg-badge">' + a.length + ' chars · ' + a.segments + ' segment' + (a.segments === 1 ? '' : 's') + '</span>';
    }
    return '<div class="out-block"><div class="out-head"><span class="label">' + esc(title) + ' ' + meta + '</span>' +
      '<button type="button" class="copy-btn" data-copy="#' + id + '">Copy</button></div>' +
      '<div class="out-body" id="' + id + '">' + esc(text) + '</div></div>';
  }

  function joinList(arr) {
    if (arr.length <= 1) return arr.join('');
    return arr.slice(0, -1).join(', ') + (arr.length > 2 ? ',' : '') + ' and ' + arr[arr.length - 1];
  }

  // © https://saadbinyousaf.dev/ © //
  function data() {
    var d = {};
    inputs.forEach(function (k) { d[k] = ($('#' + k).value || '').trim(); });
    d.brand = d.brand || 'Your Business';
    d.legal = d.legal || d.brand;
    d.site = cleanSite(d.site) || 'yourbusiness.com';
    d.siteUrl = 'https://' + d.site;
    d.kw = (d.kw || 'JOIN').toUpperCase().replace(/\s+/g, '');
    d.support = d.support || ('hello@' + d.site);
    d.privacyUrl = d.privacyUrl || (d.siteUrl + '/privacy-policy');
    d.termsUrl = d.termsUrl || (d.siteUrl + '/terms');
    d.optin = Array.prototype.filter.call(document.querySelectorAll('[data-optin]'), function (c) { return c.checked; }).map(function (c) { return c.getAttribute('data-optin'); });
    if (!d.optin.length) d.optin = ['form'];
    d.ind = IND[d.ind] || IND.other;
    d.use = USE[state.use];
    d.marketing = state.use === 'mixed' || state.use === 'marketing';
    return d;
  }

  // © https://saadbinyousaf.dev/ © //
  function render() {
    var d = data();
    $('#kwField').hidden = d.optin.indexOf('keyword') === -1;

    var methodsShort = d.optin.map(function (m) {
      return { form: 'the opt-in form on ' + d.site, keyword: 'texting ' + d.kw + ' to our business number', paper: 'a signed consent form at our location', phone: 'giving verbal consent on a call with our team' }[m];
    });

    var consentCare = 'I agree to receive ' + (state.use === 'marketing' ? 'text messages' : 'appointment reminders and account updates by text message') + ' from ' + d.brand + ' at the phone number provided. ' + d.freq + '. Msg & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. See our Privacy Policy and Terms.';
    var consentMkt = 'I agree to receive marketing and promotional text messages from ' + d.brand + ' at the phone number provided. ' + d.freq + '. Msg & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase.';
    var confirm = d.brand + ': Thanks for subscribing to text updates! ' + d.freq + '. Msg & data rates may apply. Reply HELP for help, STOP to opt out.';
    var help = d.brand + ': For help, contact us at ' + d.support + ' or visit ' + d.siteUrl + '. Msg & data rates may apply. Reply STOP to opt out.';
    var stop = d.brand + ': You have been unsubscribed and will not receive any more messages. Reply START to resubscribe.';

    var description = d.brand + ' (' + d.legal + ') sends text messages to ' + d.ind.who + ' who have opted in through ' + joinList(methodsShort) + '. Messages relate to ' + d.ind.what + ' and include ' + d.use.desc + '. ' + d.freq + '. Recipients can reply STOP at any time to opt out or HELP for help.';

    var flowParts = [];
    if (d.optin.indexOf('form') > -1) flowParts.push('Website: ' + d.ind.who.charAt(0).toUpperCase() + d.ind.who.slice(1) + ' enter their phone number on the form at ' + d.siteUrl + ' and tick a separate, unchecked SMS consent checkbox that reads: "' + consentCare + '" The checkbox is optional and consent is not required to submit the form or make a purchase.');
    if (d.optin.indexOf('keyword') > -1) flowParts.push('Keyword: ' + d.ind.who.charAt(0).toUpperCase() + d.ind.who.slice(1) + ' text ' + d.kw + ' to our business number, which is advertised on our website and printed materials alongside the message frequency, rates and STOP/HELP instructions.');
    if (d.optin.indexOf('paper') > -1) flowParts.push('In person: ' + d.ind.who.charAt(0).toUpperCase() + d.ind.who.slice(1) + ' complete a signed paper or tablet intake form at our location that includes an optional SMS consent section with the same disclosure. Signed forms are kept on file.');
    if (d.optin.indexOf('phone') > -1) flowParts.push('Phone: during a call, our team asks if the caller would like to receive text messages, reads the disclosure (frequency, rates, STOP/HELP), and records the consent with a date and time in our CRM.');
    flowParts.push('After opting in, they receive a confirmation text: "' + confirm + '" Our Privacy Policy (' + d.privacyUrl + ') and Terms (' + d.termsUrl + ') are linked next to the opt-in and describe our SMS program. Mobile numbers are never shared with third parties for marketing.');
    var flow = flowParts.join('\n\n');

    var s1 = fill(d.ind.reminder, d), s2 = fill(d.ind.care, d), s3 = d.marketing ? fill(d.ind.promo, d) : fill(FOLLOWUP, d);
    if (state.use === 'marketing') { s1 = fill(d.ind.promo, d); s3 = fill(d.ind.care, d); }

    $('#outCampaign').innerHTML =
      block('oDesc', 'Campaign description', description) +
      block('oS1', 'Sample message 1', s1, true) +
      block('oS2', 'Sample message 2', s2, true) +
      block('oS3', 'Sample message 3', s3, true) +
      block('oFlow', 'Message flow / call to action', flow) +
      '<div class="notice">Replace [Name], [Date] and similar placeholders only if the form asks for a literal example. Brackets are the standard way to show template fields to reviewers.</div>';

    $('#outOptin').innerHTML =
      block('oCk1', d.marketing && state.use !== 'marketing' ? 'Consent checkbox — reminders & updates' : 'Consent checkbox text', consentCare) +
      (d.marketing && state.use !== 'marketing' ? block('oCk2', 'Consent checkbox — marketing (separate, optional)', consentMkt) : '') +
      block('oConf', 'Opt-in confirmation message', confirm, true) +
      block('oHelp', 'HELP reply', help, true) +
      block('oStop', 'STOP reply', stop, true) +
      (d.optin.indexOf('keyword') > -1 ? block('oKw', 'Opt-in keywords', d.kw + ', START, SUBSCRIBE') : '');

    var privacy = 'Text messaging (SMS)\nWhen you opt in to receive text messages from ' + d.brand + ', we collect your mobile phone number and use it only to send the messages you agreed to receive. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties. You can opt out at any time by replying STOP.';
    var terms = 'SMS terms\nBy opting in, you agree to receive text messages from ' + d.brand + ' about ' + d.use.terms + '. ' + d.freq + '. Message and data rates may apply. Reply STOP to cancel at any time, or HELP for help. You can also reach us at ' + d.support + '. Carriers are not liable for delayed or undelivered messages. Consent is not a condition of purchase. See our Privacy Policy at ' + d.privacyUrl + '.';
    $('#outLegal').innerHTML = block('oPriv', 'Add to your privacy policy', privacy) + block('oTerms', 'Add to your terms & conditions', terms);

    var warns = [];
    if (/@(gmail|yahoo|hotmail|outlook|aol|icloud)\./i.test(d.support)) warns.push(['warn', 'A free email address (Gmail, Yahoo, etc.) is allowed, but an address on <code>' + esc(d.site) + '</code> makes your brand look more established to reviewers.']);
    try {
      var host = new URL(/^https?:/i.test(d.privacyUrl) ? d.privacyUrl : 'https://' + d.privacyUrl).hostname.replace(/^www\./, '');
      if (host !== d.site.split('/')[0].replace(/^www\./, '')) warns.push(['warn', 'Your privacy policy is on a different domain than your website. Reviewers expect both on the business website.']);
    } catch (e) { warns.push(['bad', 'The privacy policy URL does not look like a valid link.']); }
    if (/\b(bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly)\b/i.test(d.site)) warns.push(['bad', 'Use your own domain. Public link shorteners are a common reason for rejection.']);
    if (state.use === 'reminders' || state.use === 'care') warns.push(['', 'You chose a non-marketing use case. Do not send promotions on this campaign — register a mixed or marketing campaign if you plan to.']);
    $('#formWarn').innerHTML = warns.map(function (w) { return '<div class="notice ' + w[0] + '">' + w[1] + '</div>'; }).join('');

    var save = {};
    inputs.forEach(function (k) { save[k] = $('#' + k).value; });
    save.use = state.use;
    save.optin = d.optin;
    SBY.store.set('a2p-kit', save);
  }

  // © https://saadbinyousaf.dev/ © //
  function renderChecklist() {
    var done = SBY.store.get('a2p-checks', {});
    $('#checklist').innerHTML = CHECKS.map(function (c) {
      return '<label class="check"><input type="checkbox" data-check="' + c[0] + '"' + (done[c[0]] ? ' checked' : '') + '> <span>' + esc(c[1]) + '</span></label>';
    }).join('');
    function score() {
      var n = 0;
      document.querySelectorAll('[data-check]').forEach(function (c) { done[c.getAttribute('data-check')] = c.checked; if (c.checked) n++; });
      SBY.store.set('a2p-checks', done);
      var b = $('#scoreBadge');
      b.textContent = n + ' / ' + CHECKS.length;
      b.className = 'badge ' + (n === CHECKS.length ? 'ok' : n >= 7 ? 'warn' : 'bad');
      $('#scoreMeter').style.width = Math.round(n / CHECKS.length * 100) + '%';
    }
    document.querySelectorAll('[data-check]').forEach(function (c) { c.addEventListener('change', score); });
    score();
  }

  // © https://saadbinyousaf.dev/ © //
  var sel = $('#ind');
  sel.innerHTML = Object.keys(IND).map(function (k) { return '<option value="' + k + '">' + esc(IND[k].label) + '</option>'; }).join('');
  sel.value = 'dental';

  var saved = SBY.store.get('a2p-kit', null);
  if (saved) {
    inputs.forEach(function (k) { if (saved[k] != null && saved[k] !== '') $('#' + k).value = saved[k]; });
    if (saved.use && USE[saved.use]) state.use = saved.use;
    if (saved.optin) document.querySelectorAll('[data-optin]').forEach(function (c) { c.checked = saved.optin.indexOf(c.getAttribute('data-optin')) > -1; });
  }
  document.querySelectorAll('#use button').forEach(function (b) {
    b.setAttribute('aria-pressed', b.getAttribute('data-use') === state.use ? 'true' : 'false');
    b.addEventListener('click', function () {
      state.use = b.getAttribute('data-use');
      document.querySelectorAll('#use button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      render();
    });
  });
  var deb = SBY.debounce(render, 120);
  inputs.forEach(function (k) { $('#' + k).addEventListener('input', deb); $('#' + k).addEventListener('change', render); });
  document.querySelectorAll('[data-optin]').forEach(function (c) { c.addEventListener('change', render); });

  $('#copyAll').addEventListener('click', function (e) {
    var parts = [];
    document.querySelectorAll('#outCampaign .out-block, #outOptin .out-block, #outLegal .out-block').forEach(function (b) {
      var title = b.querySelector('.out-head .label').childNodes[0].textContent.trim();
      parts.push(title.toUpperCase() + '\n' + b.querySelector('.out-body').textContent);
    });
    SBY.copy(parts.join('\n\n----------\n\n'), e.currentTarget);
  });

  render();
  renderChecklist();
})();
// © https://saadbinyousaf.dev/ © //
