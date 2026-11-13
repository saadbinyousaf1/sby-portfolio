// © https://saadbinyousaf.dev/ © //
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const config = require("./site.config.js");

const SRC = __dirname;
const ROOT = path.resolve(__dirname, "..");
const SITE = config.site;

// © https://saadbinyousaf.dev/ © //
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// © https://saadbinyousaf.dev/ © //
const slugify = (s) =>
  String(s).toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// © https://saadbinyousaf.dev/ © //
const stripTags = (s) => String(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// © https://saadbinyousaf.dev/ © //
const formatDate = (iso) => {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
};

// © https://saadbinyousaf.dev/ © //
const abs = (p) => SITE.url.replace(/\/$/, "") + p;

// © https://saadbinyousaf.dev/ © //
function parseFile(file) {
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^<!--\s*([\s\S]*?)\s*-->/);
  if (!match) throw new Error(`Missing front matter in ${file}`);
  return { meta: JSON.parse(match[1]), body: raw.slice(match[0].length).trim() };
}

// © https://saadbinyousaf.dev/ © //
function affiliateAttrs(linkKey, placement, ctaKey) {
  const url = config.links[linkKey];
  if (!url) throw new Error(`Unknown affiliate link key "${linkKey}"`);
  return `href="${esc(url)}" target="_blank" rel="sponsored noopener" data-track="cta" data-link="${linkKey}" data-cta="${ctaKey || linkKey}" data-placement="${placement}"`;
}

// © https://saadbinyousaf.dev/ © //
function ctaBlock(key, placement) {
  const cta = config.ctas[key];
  if (!cta) throw new Error(`Unknown CTA "${key}"`);
  return `<aside class="b-cta" aria-label="${esc(cta.title)}">
  <div class="b-cta-text">
    <p class="b-cta-title">${esc(cta.title)}</p>
    <p>${esc(cta.body)}</p>
  </div>
  <div class="b-cta-action">
    <a class="btn btn-solid" ${affiliateAttrs(cta.link, placement, key)}>${esc(cta.button)}</a>
    <p class="b-cta-note">${esc(config.disclosureShort)}</p>
  </div>
</aside>`;
}

// © https://saadbinyousaf.dev/ © //
function renderShortcodes(html, placement) {
  return html
    .replace(/\{\{cta:([a-z]+)\}\}/g, (_, key) => ctaBlock(key, placement))
    .replace(/\{\{aff:([a-z]+)\|([^}]+)\}\}/g, (_, key, text) =>
      `<a ${affiliateAttrs(key, placement + ":inline")}>${text}</a><span class="b-paid">(I earn a commission)</span>`)
    .replace(/\{\{checked\}\}/g, formatDate(config.factsChecked));
}

// © https://saadbinyousaf.dev/ © //
function withHeadingIds(html) {
  const toc = [];
  const used = new Set();
  const out = html.replace(/<h2(?:\s+id="([^"]+)")?>([\s\S]*?)<\/h2>/g, (_, id, inner) => {
    let slug = id || slugify(inner);
    while (used.has(slug)) slug += "-2";
    used.add(slug);
    toc.push({ id: slug, text: stripTags(inner) });
    return `<h2 id="${slug}">${inner}</h2>`;
  });
  return { html: out, toc };
}

// © https://saadbinyousaf.dev/ © //
function visual(kind) {
  const open = `<svg viewBox="0 0 320 180" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">`;
  const bg = `<rect width="320" height="180" fill="var(--v-bg)"/>`;
  if (kind === "pipeline") {
    const cols = [0, 1, 2, 3].map((i) => {
      const x = 34 + i * 66;
      const cards = [[0, 1, 2], [0, 1], [0], [0, 1]][i]
        .map((r) => {
          const hot = i === 2 && r === 0;
          return `<rect x="${x}" y="${52 + r * 30}" width="54" height="22" rx="5" fill="${hot ? "var(--v-hi-soft)" : "var(--v-card)"}" stroke="${hot ? "var(--v-hi)" : "var(--v-line)"}"/>`;
        })
        .join("");
      return `<rect x="${x}" y="34" width="54" height="5" rx="2.500" fill="var(--v-hi)" opacity="${0.25 + i * 0.25}"/>${cards}`;
    });
    return `${open}${bg}${cols.join("")}</svg>`;
  }
  if (kind === "ladder") {
    const bars = [{ h: 28, label: "$97" }, { h: 70, label: "$297" }, { h: 112, label: "$497" }]
      .map((b, i) => {
        const x = 62 + i * 72;
        const hot = i === 1;
        return `<rect x="${x}" y="${150 - b.h}" width="52" height="${b.h}" rx="6" fill="${hot ? "var(--v-hi-soft)" : "var(--v-card)"}" stroke="${hot ? "var(--v-hi)" : "var(--v-line)"}"/><text x="${x + 26}" y="${150 - b.h - 9}" text-anchor="middle" font-size="13" font-weight="700" fill="${hot ? "var(--v-hi)" : "var(--v-fg)"}" font-family="Satoshi, sans-serif">${b.label}</text>`;
      })
      .join("");
    return `${open}${bg}${bars}<line x1="44" y1="150.500" x2="276" y2="150.500" stroke="var(--v-line)" stroke-width="1"/></svg>`;
  }
  if (kind === "checklist") {
    const rows = [0, 1, 2, 3]
      .map((i) => {
        const y = 40 + i * 30;
        const done = i < 3;
        return `<circle cx="78" cy="${y}" r="9" fill="${done ? "var(--v-hi)" : "var(--v-card)"}" stroke="${done ? "var(--v-hi)" : "var(--v-line)"}"/>${done ? `<path d="M73.500 ${y} l3.200 3.400 l6 -6.800" stroke="var(--v-bg)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : ""}<rect x="100" y="${y - 5}" width="${[132, 104, 148, 86][i]}" height="10" rx="5" fill="${i === 3 ? "var(--v-hi-soft)" : "var(--v-card)"}" stroke="${i === 3 ? "var(--v-hi)" : "var(--v-line)"}"/>`;
      })
      .join("");
    return `${open}${bg}${rows}</svg>`;
  }
  return `${open}${bg}<circle cx="140" cy="90" r="44" fill="var(--v-card)" stroke="var(--v-line)"/><circle cx="184" cy="90" r="44" fill="var(--v-hi-soft)" stroke="var(--v-hi)"/></svg>`;
}

// © https://saadbinyousaf.dev/ © //
function loadArticles() {
  const dir = path.join(SRC, "articles");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => {
      const { meta, body } = parseFile(path.join(dir, f));
      if (!config.categories.includes(meta.category)) {
        throw new Error(`${f}: category "${meta.category}" is not listed in site.config.js`);
      }
      const url = `/blog/${meta.slug}/`;
      const { html, toc } = withHeadingIds(renderShortcodes(body, `article:${meta.slug}`));
      if (meta.faq && meta.faq.length) toc.push({ id: "faq", text: "Common questions" });
      toc.push({ id: "sources", text: "Sources" });
      const faqWords = (meta.faq || []).map((q) => q.q + " " + q.a).join(" ");
      const words = stripTags(html + " " + faqWords).split(" ").length;
      return { ...meta, url, html, toc, words, minutes: Math.max(1, Math.round(words / 220)) };
    })
    .sort((a, b) => (a.order || 99) - (b.order || 99) || b.published.localeCompare(a.published));
}

// © https://saadbinyousaf.dev/ © //
function card(a, variant) {
  const search = esc([a.title, a.description, a.category, ...(a.keywords || []), ...a.toc.map((t) => t.text)].join(" ").toLowerCase());
  return `<article class="b-card${variant ? " b-card-" + variant : ""}" data-card data-category="${esc(a.category)}" data-search="${search}">
  <a class="b-card-visual" href="${a.url}" tabindex="-1" aria-hidden="true">${visual(a.visual)}</a>
  <div class="b-card-body">
    <p class="b-card-meta"><span class="b-tag">${esc(a.category)}</span><span>${a.minutes} min read</span></p>
    <h3 class="b-card-title"><a href="${a.url}">${esc(a.title)}</a></h3>
    <p class="b-card-desc">${esc(a.description)}</p>
  </div>
</article>`;
}

// © https://saadbinyousaf.dev/ © //
function chrome() {
  const html = fs.readFileSync(path.join(ROOT, "tools/index.html"), "utf8");
  const header = html.match(/<div class="sh" id="nav">[\s\S]*?<\/nav>\s*<\/div>/);
  const footer = html.match(/<footer class="ft">[\s\S]*?<\/footer>/);
  if (!header || !footer) throw new Error("Could not find the site header or footer in tools/index.html");
  return {
    header: header[0].replace(/\s+aria-current="page"/g, ""),
    footer: footer[0]
  };
}

// © https://saadbinyousaf.dev/ © //
function markCurrent(header, href) {
  return header.replace(`class="sh-link" href="${href}"`, `class="sh-link" href="${href}" aria-current="page"`);
}

// © https://saadbinyousaf.dev/ © //
function widget() {
  const w = config.widget;
  const options = w.options
    .map(
      (o) => `<a class="b-gs-option" ${affiliateAttrs(o.link, "widget")} data-track="widget-choice">
        <span class="b-gs-option-title">${esc(o.title)}</span>
        <span class="b-gs-option-body">${esc(o.body)}</span>
      </a>`
    )
    .join("\n      ");
  return `<div class="b-gs" data-widget>
  <button class="b-gs-tab" type="button" aria-expanded="false" aria-controls="b-gs-panel">
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false"><path d="M10 2.500v15M2.500 10h15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    <span>${esc(w.label)}</span>
  </button>
  <section id="b-gs-panel" class="b-gs-panel" role="dialog" aria-labelledby="b-gs-title" hidden>
    <div class="b-gs-head">
      <h2 id="b-gs-title">${esc(w.title)}</h2>
      <button class="b-gs-close" type="button" aria-label="Close">
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>
    <p class="b-gs-intro">${esc(w.intro)}</p>
    <div class="b-gs-options">
      ${options}
    </div>
    <a class="b-gs-secondary" href="${w.secondary.href}" data-track="widget-secondary">${esc(w.secondary.text)}</a>
    <p class="b-gs-note">${esc(config.disclosureShort.replace("this link", "these links"))}</p>
  </section>
</div>`;
}

// © https://saadbinyousaf.dev/ © //
function layout(page, parts, version) {
  const title = page.seoTitle || `${page.title} | ${SITE.name}`;
  const canonical = abs(page.path);
  const jsonld = (page.jsonld || []).map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<!-- © https://saadbinyousaf.dev/ © -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="${page.type === "article" ? "article" : "website"}">
<meta property="og:site_name" content="Saad Bin Yousaf — HighLevel guides">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs("/blog/assets/og.png")}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#07080a">
<meta name="google-adsense-account" content="ca-pub-6774293162106493">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%2307080a'/%3E%3Ctext x='50%25' y='56%25' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-weight='700' font-size='34' fill='%23aac86b'%3ES%3C/text%3E%3C/svg%3E">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6774293162106493" crossorigin="anonymous"></script>
<link rel="preload" href="/assets/fonts/satoshi-500.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/satoshi-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/tools/assets/tools.css?v=${version}">
<link rel="stylesheet" href="/css/footer.css?v=${version}">
<link rel="stylesheet" href="/blog/assets/blog.css?v=${version}">
${jsonld}
</head>
<body class="b-page b-type-${page.type}">
<a class="b-skip" href="#main">Skip to content</a>
${markCurrent(parts.header, page.nav || "/blog/")}
<div class="b-progress" aria-hidden="true"><span></span></div>
<main id="main" data-route="${page.path}" data-type="${page.type}"${page.slug ? ` data-slug="${page.slug}"` : ""}>
${page.body}
</main>
${parts.footer}
${page.type === "article" || page.type === "library" ? widget() : ""}
<script src="/tools/assets/tools.js?v=${version}"></script>
<script src="/js/ads.js?v=${version}"></script>
<script src="/blog/assets/blog.js?v=${version}"></script>
</body>
</html>
`;
}

// © https://saadbinyousaf.dev/ © //
const personLd = () => ({ "@type": "Person", name: SITE.author, url: abs("/"), jobTitle: SITE.authorRole });

// © https://saadbinyousaf.dev/ © //
function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) }))
  };
}

// © https://saadbinyousaf.dev/ © //
function blogPage(articles) {
  const used = config.categories.filter((c) => articles.some((a) => a.category === c));
  const featured = articles.find((a) => a.featured) || articles[0];
  const bySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));
  const paths = [
    { slug: "what-is-gohighlevel", who: "I keep hearing about HighLevel", what: "What it is, who it suits and where it falls short." },
    { slug: "gohighlevel-pricing-guide", who: "I'm working out what it would cost", what: "The three plans, the usage charges and the trial options." },
    { slug: "gohighlevel-setup-guide", who: "I have an account and a blank screen", what: "Domains, messaging, a pipeline and a first workflow, in order." }
  ].filter((p) => bySlug[p.slug]);
  const body = `<header class="wrap t-hero b-hero">
  <div class="crumbs"><a href="/">Home</a><span aria-hidden="true">/</span><span>Guides</span></div>
  <h1>HighLevel guides from someone who builds on it daily.</h1>
  <p class="t-lead">Plain-English guides to HighLevel (GoHighLevel): what it does, what it really costs and how to set it up without the usual mistakes. Every guide is checked against HighLevel's own documentation and dated.</p>
  <p class="b-hero-note">I earn a commission if you sign up for HighLevel through links in these guides. <a href="/disclosure/">How that works</a>.</p>
</header>

<section class="wrap b-section" aria-labelledby="paths-title">
  <h2 id="paths-title" class="b-section-title">Start from where you are</h2>
  <ul class="b-paths">
    ${paths
      .map((p) => {
        const a = bySlug[p.slug];
        return `<li><a href="${a.url}"><span class="b-path-who">${esc(p.who)}</span><span class="b-path-what">${esc(p.what)}</span><span class="b-path-read">${esc(a.shortTitle || a.title)}, ${a.minutes} min</span></a></li>`;
      })
      .join("\n    ")}
  </ul>
</section>

<section class="wrap b-section" aria-labelledby="library-title">
  <h2 id="library-title" class="b-section-title">The library</h2>
  <form class="b-tools" role="search" data-library>
    <label class="b-search">
      <span class="sr-only">Search guides</span>
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 14l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <input type="search" name="q" placeholder="Search guides, for example pricing or workflows" autocomplete="off" data-search-input>
    </label>
    <div class="seg" role="group" aria-label="Filter by category">
      <button type="button" aria-pressed="true" data-filter="">All</button>
      ${used.map((c) => `<button type="button" aria-pressed="false" data-filter="${esc(c)}">${esc(c)}</button>`).join("\n      ")}
    </div>
  </form>
  <div class="b-featured" data-featured>
    ${card(featured, "featured")}
  </div>
  <div class="b-list-head">
    <h3 class="b-sub-title">All guides</h3>
    <p class="b-count" data-count aria-live="polite"></p>
  </div>
  <div class="b-grid" data-grid>
    ${articles.map((a) => card(a)).join("\n")}
  </div>
  <div class="b-empty" data-empty hidden>
    <p><strong>No guides match that search.</strong> Try a broader word such as "pricing", "setup" or "automation".</p>
    <button type="button" class="btn btn-ghost" data-reset>Clear search and filters</button>
  </div>
</section>

<section class="wrap b-section b-hire" aria-labelledby="hire-title">
  <div>
    <h2 id="hire-title" class="b-section-title">Rather have it built for you?</h2>
    <p>I build HighLevel systems for agencies and service businesses: white-labelled portals, automations, funnels and custom code. The guides are free either way.</p>
  </div>
  <a class="btn btn-ghost" href="/#contact">Talk to me about a build</a>
</section>`;
  return {
    path: "/blog/",
    title: "HighLevel guides: setup, pricing and how it works",
    seoTitle: "HighLevel (GoHighLevel) Guides: Setup, Pricing & Tutorials | Saad Bin Yousaf",
    description: "Independent HighLevel (GoHighLevel) guides by a HighLevel systems builder: what it is, what it costs and how to set it up. Checked against official documentation.",
    type: "library",
    body,
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "HighLevel guides",
        url: abs("/blog/"),
        author: personLd(),
        hasPart: articles.map((a) => ({ "@type": "Article", headline: a.title, url: abs(a.url) }))
      },
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/blog/" }])
    ]
  };
}

// © https://saadbinyousaf.dev/ © //
function articlePage(a, articles) {
  const others = articles.filter((o) => o.slug !== a.slug);
  const related = [...others.filter((o) => o.category === a.category), ...others.filter((o) => o.category !== a.category)].slice(0, 3);
  const tocLinks = a.toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join("\n        ");
  const faq = a.faq && a.faq.length
    ? `<section class="b-faq"><h2 id="faq">Common questions</h2>${a.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</section>`
    : "";
  const sources = `<section class="b-sources"><h2 id="sources">Sources</h2><p>Facts in this guide were checked on ${formatDate(config.factsChecked)} against these pages. HighLevel changes prices, limits and menus often, so treat the official pages as the final word.</p><ul>${a.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul></section>`;
  const next = a.next && a.next.length
    ? `<section class="b-next" aria-labelledby="next-${a.slug}"><h2 id="next-${a.slug}" class="b-sub-title">Where to go next</h2><ul>${a.next
        .map((n) => {
          const t = articles.find((o) => o.slug === n.slug);
          return t ? `<li><a href="${t.url}"><span>${esc(n.reason)}</span><b>${esc(t.shortTitle || t.title)}</b></a></li>` : "";
        })
        .join("")}</ul></section>`
    : "";
  const author = `<aside class="b-author" aria-label="About the author">
        <span class="b-author-mark" aria-hidden="true">S</span>
        <div>
          <p class="b-author-name">Written by ${esc(SITE.author)}</p>
          <p>I build HighLevel systems for agencies and service businesses: CRM setups, white-labelled portals, automations and custom JavaScript. If you'd rather have your account set up for you, <a href="/#contact">get in touch</a>.</p>
        </div>
      </aside>`;
  const body = `<article class="wrap b-article">
  <header class="b-article-head">
    <div class="crumbs"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/blog/">Guides</a><span aria-hidden="true">/</span><span>${esc(a.category)}</span></div>
    <h1 class="b-title">${esc(a.title)}</h1>
    <p class="b-dek">${esc(a.description)}</p>
    <p class="b-meta"><span>By <a href="/#about">${esc(SITE.author)}</a></span><span>${a.minutes} min read</span><span>Published <time datetime="${a.published}">${formatDate(a.published)}</time></span><span>Facts checked ${formatDate(config.factsChecked)}</span></p>
    <p class="b-disclosure"><strong>Disclosure:</strong> ${esc(config.disclosureArticle)} <a href="/disclosure/">How this works</a></p>
  </header>
  <div class="b-article-grid">
    <div class="b-article-main">
      <details class="b-toc-mobile">
        <summary>On this page</summary>
        <ol>
        ${tocLinks}
        </ol>
      </details>
      <div class="b-prose">
${a.html}
${faq}
${sources}
      </div>
      ${author}
      ${next}
    </div>
    <aside class="b-toc" aria-label="On this page">
      <p class="b-toc-head">On this page</p>
      <ol data-toc>
        ${tocLinks}
      </ol>
    </aside>
  </div>
</article>
<section class="wrap b-related" aria-labelledby="related-${a.slug}">
  <h2 id="related-${a.slug}" class="b-section-title">Keep reading</h2>
  <div class="b-grid">
    ${related.map((r) => card(r)).join("\n")}
  </div>
</section>`;
  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.description,
      datePublished: a.published,
      dateModified: a.updated || a.published,
      articleSection: a.category,
      keywords: (a.keywords || []).join(", "),
      wordCount: a.words,
      mainEntityOfPage: abs(a.url),
      image: abs("/blog/assets/og.png"),
      author: personLd(),
      publisher: personLd()
    },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/blog/" }, { name: a.title, path: a.url }])
  ];
  if (a.faq && a.faq.length) {
    jsonld.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: a.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
    });
  }
  return { path: a.url, title: a.title, seoTitle: a.seoTitle, description: a.description, type: "article", slug: a.slug, body, jsonld };
}

// © https://saadbinyousaf.dev/ © //
function disclosurePage() {
  const { meta, body } = parseFile(path.join(SRC, "disclosure.html"));
  return {
    path: `/${meta.slug}/`,
    title: meta.title,
    seoTitle: meta.seoTitle,
    description: meta.description,
    type: "page",
    nav: "/none/",
    body: `<article class="wrap b-static"><div class="crumbs"><a href="/">Home</a><span aria-hidden="true">/</span><span>${esc(meta.title)}</span></div><h1 class="b-title">${esc(meta.title)}</h1><p class="b-meta"><span>Last updated ${formatDate(config.factsChecked)}</span></p><div class="b-prose">${body}</div></article>`,
    jsonld: [breadcrumbLd([{ name: "Home", path: "/" }, { name: meta.title, path: `/${meta.slug}/` }])]
  };
}

// © https://saadbinyousaf.dev/ © //
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

// © https://saadbinyousaf.dev/ © //
function updateSitemap(pages) {
  const file = path.join(ROOT, "sitemap.xml");
  let xml = fs.readFileSync(file, "utf8");
  xml = xml.replace(/\s*<url><loc>[^<]*\/(blog|disclosure)\/[^<]*<\/loc>.*?<\/url>/g, "");
  const entries = pages
    .map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${p.lastmod}</lastmod><priority>${p.type === "page" ? "0.3" : p.type === "library" ? "0.9" : "0.8"}</priority></url>`)
    .join("\n");
  xml = xml.replace(/\n?<\/urlset>/, `\n${entries}\n</urlset>`);
  fs.writeFileSync(file, xml);
}

// © https://saadbinyousaf.dev/ © //
function build() {
  const css = fs.readFileSync(path.join(SRC, "blog.css"), "utf8");
  const js = fs.readFileSync(path.join(SRC, "blog.js"), "utf8");
  const version = crypto.createHash("sha1").update(css + js).digest("hex").slice(0, 8);
  const parts = chrome();
  const articles = loadArticles();
  const pages = [blogPage(articles), ...articles.map((a) => articlePage(a, articles)), disclosurePage()];

  fs.rmSync(path.join(ROOT, "blog"), { recursive: true, force: true });
  fs.rmSync(path.join(ROOT, "disclosure"), { recursive: true, force: true });
  write(path.join(ROOT, "blog/assets/blog.css"), css);
  write(path.join(ROOT, "blog/assets/blog.js"), js);
  const og = path.join(SRC, "og.png");
  if (fs.existsSync(og)) fs.copyFileSync(og, path.join(ROOT, "blog/assets/og.png"));

  for (const page of pages) write(path.join(ROOT, page.path, "index.html"), layout(page, parts, version));

  const newest = articles.map((a) => a.updated || a.published).sort().pop();
  updateSitemap(pages.map((p) => {
    const a = articles.find((x) => x.url === p.path);
    return { ...p, lastmod: a ? a.updated || a.published : p.type === "library" ? newest : config.factsChecked };
  }));
  console.log(`Built ${pages.length} pages (${articles.map((a) => `${a.slug}: ${a.words} words`).join("; ")})`);
}

build();
