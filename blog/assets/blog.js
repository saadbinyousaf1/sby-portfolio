// © https://saadbinyousaf.dev/ © //
(function () {
  "use strict";

  // © https://saadbinyousaf.dev/ © //
  var BLOG = (window.SBYBlog = window.SBYBlog || {});
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var main = document.getElementById("main");
  var type = main ? main.getAttribute("data-type") : "";
  window.sbyEvents = window.sbyEvents || [];

  // © https://saadbinyousaf.dev/ © //
  BLOG.track = function (name, props) {
    var detail = { event: name, props: props || {}, path: location.pathname, at: Date.now() };
    window.sbyEvents.push(detail);
    try {
      document.dispatchEvent(new CustomEvent("sby:track", { detail: detail }));
      if (typeof window.plausible === "function") window.plausible(name, { props: detail.props });
      if (typeof window.gtag === "function") window.gtag("event", name, detail.props);
    } catch (e) {}
  };

  // © https://saadbinyousaf.dev/ © //
  function scrollToId(id) {
    var target = document.getElementById(id);
    if (!target) return false;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    return true;
  }

  // © https://saadbinyousaf.dev/ © //
  function initWidget() {
    var root = document.querySelector("[data-widget]");
    if (!root) return;
    var tab = root.querySelector(".b-gs-tab");
    var panel = root.querySelector(".b-gs-panel");
    var closeBtn = root.querySelector(".b-gs-close");
    var isOpen = false;

    var open = function () {
      isOpen = true;
      panel.hidden = false;
      root.classList.add("is-open");
      tab.setAttribute("aria-expanded", "true");
      closeBtn.focus({ preventScroll: true });
      BLOG.track("widget_open");
    };
    var close = function (returnFocus) {
      if (!isOpen) return;
      isOpen = false;
      panel.hidden = true;
      root.classList.remove("is-open");
      tab.setAttribute("aria-expanded", "false");
      if (returnFocus) tab.focus({ preventScroll: true });
      BLOG.track("widget_close");
    };

    tab.addEventListener("click", open);
    closeBtn.addEventListener("click", function () {
      close(true);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) close(true);
    });
    document.addEventListener("pointerdown", function (e) {
      if (isOpen && !root.contains(e.target)) close(false);
    });
    panel.addEventListener("click", function (e) {
      var choice = e.target.closest('[data-track="widget-choice"]');
      if (choice) BLOG.track("widget_choice", { link: choice.getAttribute("data-link") });
      if (e.target.closest(".b-gs-secondary")) BLOG.track("widget_secondary");
    });
  }

  // © https://saadbinyousaf.dev/ © //
  function initTracking() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      if (a.getAttribute("data-track") === "cta") {
        BLOG.track("cta_click", {
          cta: a.getAttribute("data-cta"),
          link: a.getAttribute("data-link"),
          placement: a.getAttribute("data-placement")
        });
        return;
      }
      var href = a.getAttribute("href") || "";
      if (type === "article" && main.contains(a) && /^\/blog\/[^/]+\//.test(href)) {
        BLOG.track("article_nav", { from: main.getAttribute("data-slug"), to: href.split("#")[0] });
      }
    });
  }

  // © https://saadbinyousaf.dev/ © //
  function initLibrary() {
    var form = document.querySelector("[data-library]");
    if (!form) return;
    var input = form.querySelector("[data-search-input]");
    var filters = Array.prototype.slice.call(form.querySelectorAll("[data-filter]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-grid] [data-card]"));
    var featured = document.querySelector("[data-featured]");
    var empty = document.querySelector("[data-empty]");
    var count = document.querySelector("[data-count]");
    var reset = document.querySelector("[data-reset]");
    var category = "";
    var timer;

    var apply = function (announce) {
      var terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      var shown = 0;
      cards.forEach(function (card) {
        var hay = card.getAttribute("data-search");
        var match =
          (!category || card.getAttribute("data-category") === category) &&
          terms.every(function (t) {
            return hay.indexOf(t) !== -1;
          });
        card.hidden = !match;
        if (match) shown += 1;
      });
      var active = terms.length > 0 || category !== "";
      if (featured) featured.hidden = active;
      empty.hidden = shown !== 0;
      count.textContent = active
        ? shown + (shown === 1 ? " guide matches" : " guides match")
        : cards.length + (cards.length === 1 ? " guide" : " guides");
      if (announce && terms.length) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          BLOG.track("search", { query: terms.join(" ").slice(0, 60), results: shown });
        }, 900);
      }
    };

    var setCategory = function (value) {
      category = value;
      filters.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === value));
      });
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
    });
    input.addEventListener("input", function () {
      apply(true);
    });
    filters.forEach(function (b) {
      b.addEventListener("click", function () {
        setCategory(b.getAttribute("data-filter"));
        apply(false);
        if (category) BLOG.track("filter", { category: category });
      });
    });
    reset.addEventListener("click", function () {
      input.value = "";
      setCategory("");
      apply(false);
      input.focus();
    });
    apply(false);
  }

  // © https://saadbinyousaf.dev/ © //
  function initArticle() {
    if (type !== "article") return null;
    var links = Array.prototype.slice.call(document.querySelectorAll("[data-toc] a"));
    var headings = links
      .map(function (a) {
        return document.getElementById(a.getAttribute("href").slice(1));
      })
      .filter(Boolean);

    main.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href").slice(1);
      if (id && scrollToId(id)) {
        e.preventDefault();
        var mobile = a.closest(".b-toc-mobile");
        if (mobile) mobile.open = false;
        if (history.replaceState) history.replaceState(null, "", "#" + id);
      }
    });

    BLOG.track("article_view", { slug: main.getAttribute("data-slug") });

    return function () {
      var current = headings[0];
      headings.forEach(function (h) {
        if (h.getBoundingClientRect().top - 140 <= 0) current = h;
      });
      links.forEach(function (a) {
        a.classList.toggle("is-active", !!current && a.getAttribute("href") === "#" + current.id);
      });
    };
  }

  // © https://saadbinyousaf.dev/ © //
  function initScroll(spy) {
    var bar = document.querySelector(".b-progress span");
    var gs = document.querySelector("[data-widget]");
    var body = document.querySelector(".b-article-main");
    var ticking = false;
    var update = function () {
      ticking = false;
      if (gs) gs.classList.toggle("is-compact", window.scrollY > 240);
      if (!body) return;
      var rect = body.getBoundingClientRect();
      var total = rect.height - window.innerHeight * 0.6;
      var done = Math.min(1, Math.max(0, -rect.top / (total > 0 ? total : 1)));
      if (bar) bar.style.transform = "scaleX(" + done + ")";
      if (spy) spy();
    };
    var request = function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    request();
  }

  // © https://saadbinyousaf.dev/ © //
  function start() {
    initWidget();
    initTracking();
    initLibrary();
    initScroll(initArticle());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
