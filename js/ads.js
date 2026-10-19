// © https://saadbinyousaf.dev/ © //
(function () {
  'use strict';

  // © https://saadbinyousaf.dev/ © //
  var ADSENSE = {
    client: 'ca-pub-6774293162106493',
    productionHost: 'saadbinyousaf.dev',
    slots: {
      afterServices: '',
      afterWork: '',
      hubMain: '',
      toolTop: '',
      toolArticle: ''
    }
  };

  // © https://saadbinyousaf.dev/ © //
  function onProduction() {
    var h = location.hostname;
    return h === ADSENSE.productionHost || h.slice(-(ADSENSE.productionHost.length + 1)) === '.' + ADSENSE.productionHost;
  }

  // © https://saadbinyousaf.dev/ © //
  function ensureLibrary() {
    if (document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE.client;
    document.head.appendChild(s);
  }

  // © https://saadbinyousaf.dev/ © //
  function init() {
    var prod = onProduction();
    var queued = 0;
    document.querySelectorAll('[data-ad]').forEach(function (slot) {
      var id = ADSENSE.slots[slot.getAttribute('data-ad')];
      if (!id || /^0+$/.test(id)) {
        slot.classList.add(prod ? 'is-hidden' : 'is-placeholder');
        return;
      }
      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', ADSENSE.client);
      ins.setAttribute('data-ad-slot', id);
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');
      slot.querySelector('.ad-box').appendChild(ins);
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      queued++;
    });
    if (queued) ensureLibrary();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
// © https://saadbinyousaf.dev/ © //
