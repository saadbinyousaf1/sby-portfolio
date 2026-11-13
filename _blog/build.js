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
const THEMES = {
  hub: { bg: "#0d1220", panel: "#141b2e", line: "#2a3552", hi: "#8fb4ff", soft: "rgba(143,180,255,0.16)" },
  plans: { bg: "#0e140b", panel: "#151d11", line: "#2c3a22", hi: "#aac86b", soft: "rgba(170,200,107,0.16)" },
  setup: { bg: "#17120a", panel: "#1f180e", line: "#3d3020", hi: "#f0b35a", soft: "rgba(240,179,90,0.16)" },
  violet: { bg: "#120f1f", panel: "#1a162c", line: "#342c55", hi: "#b79cff", soft: "rgba(183,156,255,0.16)" },
  teal: { bg: "#0a1516", panel: "#0f1e20", line: "#1f3b3e", hi: "#5fd4c8", soft: "rgba(95,212,200,0.16)" },
  rose: { bg: "#1a0e12", panel: "#24141a", line: "#47262f", hi: "#ff8fa6", soft: "rgba(255,143,166,0.16)" }
};
THEMES.blue = THEMES.hub;
THEMES.lime = THEMES.plans;
THEMES.amber = THEMES.setup;

// © https://saadbinyousaf.dev/ © //
function thumbnail(a) {
  const d = a.thumbData;
  if (!d) return thumbLegacy(a.thumb);
  const t = THEMES[a.theme] || THEMES.plans;
  const id = `g-${a.slug}`;
  const font = `font-family="Satoshi, system-ui, sans-serif"`;
  const T = (x, y, txt, o = {}) =>
    `<text x="${x}" y="${y}" font-size="${o.size || 12.500}" font-weight="${o.weight || 500}" fill="${o.fill || "#e9ecf1"}" text-anchor="${o.anchor || "start"}" ${font}>${esc(txt)}</text>`;
  const open = `<svg viewBox="0 0 400 300" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="${id}" cx="0.500" cy="0.500" r="0.700"><stop offset="0" stop-color="${t.hi}" stop-opacity=".14"/><stop offset="1" stop-color="${t.hi}" stop-opacity="0"/></radialGradient></defs><rect width="400" height="300" fill="${t.bg}"/><rect width="400" height="300" fill="url(#${id})"/>`;
  let inner = "";
  if (a.thumb === "map") {
    const wf = d.workflows.map((w, i) => ({ ...w, ...[{ x: 30, y: 64 }, { x: 148, y: 128 }, { x: 266, y: 64 }, { x: 266, y: 196 }][i] }));
    const as = d.assets.map((w, i) => ({ ...w, ...[{ x: 30, y: 150 }, { x: 30, y: 222 }, { x: 150, y: 226 }][i] }));
    const c = (n, w, h) => [n.x + w / 2, n.y + h / 2];
    const line = (p, q, dash) => `<path d="M${p[0]} ${p[1]}L${q[0]} ${q[1]}" stroke="${dash ? t.line : t.hi}" stroke-opacity="${dash ? 1 : 0.55}" stroke-width="1.500"${dash ? ' stroke-dasharray="3 4"' : ""}/>`;
    inner += line(c(wf[0], 104, 34), c(wf[1], 104, 34)) + line(c(wf[1], 104, 34), c(wf[2], 104, 34)) + line(c(wf[1], 104, 34), c(wf[3], 104, 34));
    inner += line(c(as[0], 84, 26), c(wf[0], 104, 34), 1) + line(c(as[1], 84, 26), c(wf[1], 104, 34), 1) + line(c(as[2], 84, 26), c(wf[1], 104, 34), 1);
    inner += wf.map((w) => `<rect x="${w.x}" y="${w.y}" width="104" height="34" rx="9" fill="${w.hot ? t.soft : t.panel}" stroke="${w.hot ? t.hi : t.line}"/>${T(w.x + 52, w.y + 21.500, w.l, { size: 11.500, weight: 600, anchor: "middle" })}${w.err ? `<circle cx="${w.x + 100}" cy="${w.y + 2}" r="9" fill="#ff7b7b"/>${T(w.x + 100, w.y + 6.500, "!", { size: 12, weight: 700, fill: "#1a0606", anchor: "middle" })}` : ""}`).join("");
    inner += as.map((w) => `<rect x="${w.x}" y="${w.y}" width="84" height="26" rx="13" fill="${t.bg}" stroke="${t.line}"/>${T(w.x + 42, w.y + 17, w.l, { size: 10.500, fill: t.hi, anchor: "middle" })}`).join("");
  } else if (a.thumb === "video") {
    inner += `<rect x="50" y="52" width="300" height="168" rx="14" fill="${t.panel}" stroke="${t.line}"/><circle cx="200" cy="128" r="27" fill="${t.soft}" stroke="${t.hi}" stroke-width="1.500"/><path d="M192 115l22 13-22 13z" fill="${t.hi}"/>`;
    inner += `<rect x="290" y="64" width="48" height="22" rx="11" fill="${t.bg}" stroke="${t.line}"/>${T(314, 79, d.length, { size: 11, weight: 600, anchor: "middle" })}`;
    inner += `<rect x="110" y="186" width="180" height="20" rx="6" fill="${t.bg}" opacity=".85"/>${T(200, 200, d.caption, { size: 11, anchor: "middle" })}`;
    const w = (300 - (d.scenes.length - 1) * 7) / d.scenes.length;
    inner += d.scenes.map((sc, i) => `<rect x="${50 + i * (w + 7)}" y="236" width="${w}" height="26" rx="7" fill="${i === 1 ? t.soft : t.panel}" stroke="${i === 1 ? t.hi : t.line}"/>${T(50 + i * (w + 7) + w / 2, 253, sc, { size: 10.500, anchor: "middle", fill: i === 1 ? t.hi : "#c9cdd6" })}`).join("");
  } else if (a.thumb === "chat") {
    let y = 58;
    inner += d.bubbles
      .map((b) => {
        const h = b.lines.length * 17 + 15;
        const w = Math.max(...b.lines.map((l) => l.length)) * 6.400 + 26;
        const x = b.side === "r" ? 368 - w : 32;
        const out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${b.side === "r" ? t.soft : t.panel}" stroke="${b.side === "r" ? t.hi : t.line}"/>${b.lines.map((l, i) => T(x + 13, y + 22 + i * 17, l, { size: 12, fill: b.side === "r" ? "#ffffff" : "#d9dde6" })).join("")}`;
        y += h + 10;
        return out;
      })
      .join("");
  } else if (a.thumb === "voice") {
    const bars = [14, 26, 40, 22, 52, 34, 18, 44, 28, 12];
    inner += bars.map((h, i) => `<rect x="${44 + i * 11}" y="${116 - h / 2}" width="5" height="${h}" rx="2.500" fill="${t.hi}" opacity="${0.35 + (i % 3) * 0.2}"/><rect x="${250 + i * 11}" y="${116 - bars[9 - i] / 2}" width="5" height="${bars[9 - i]}" rx="2.500" fill="${t.hi}" opacity="${0.35 + (i % 3) * 0.2}"/>`).join("");
    inner += `<circle cx="200" cy="116" r="36" fill="${t.soft}" stroke="${t.hi}" stroke-width="1.500"/><path d="M188 102c-2 0-4 2-4 4 0 14 12 26 26 26 2 0 4-2 4-4v-5l-8-3-3 4c-4-2-7-5-9-9l4-3-3-8z" fill="${t.hi}"/>`;
    const cw = 108;
    const sx = 200 - (d.chips.length * cw + (d.chips.length - 1) * 8) / 2;
    inner += d.chips.map((c, i) => `<rect x="${sx + i * (cw + 8)}" y="182" width="${cw}" height="30" rx="15" fill="${t.panel}" stroke="${t.line}"/>${T(sx + i * (cw + 8) + cw / 2, 201.500, c, { size: 11, anchor: "middle" })}`).join("");
    inner += T(200, 248, d.caption, { size: 12, fill: t.hi, anchor: "middle", weight: 600 });
  } else if (a.thumb === "cards") {
    inner += T(28, 76, d.title, { size: 15, weight: 700, fill: "#ffffff" });
    inner += d.tiles
      .map((tile, i) => {
        const x = i % 2 ? 206 : 28;
        const y = 94 + Math.floor(i / 2) * 58;
        return `<rect x="${x}" y="${y}" width="166" height="46" rx="11" fill="${tile.hot ? t.soft : t.panel}" stroke="${tile.hot ? t.hi : t.line}"/><circle cx="${x + 16}" cy="${y + 23}" r="3.500" fill="${t.hi}"/>${T(x + 28, y + (tile.sub ? 20 : 27.500), tile.l, { size: 12, weight: 600 })}${tile.sub ? T(x + 28, y + 35, tile.sub, { size: 10.500, fill: "#9aa0ab" }) : ""}`;
      })
      .join("");
  } else if (a.thumb === "plans") {
    const n = d.plans.length;
    const w = (356 - (n - 1) * 14) / n;
    inner += d.plans
      .map((p, i) => {
        const x = 22 + i * (w + 14);
        const cx = x + w / 2;
        const y = p.hot ? 50 : 64;
        const h = p.hot ? 204 : 178;
        const top = y + (p.hot ? 32 : 26);
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${p.hot ? t.soft : t.panel}" stroke="${p.hot ? t.hi : t.line}" stroke-width="${p.hot ? 1.500 : 1}"/>${T(cx, top, p.name, { size: 12, weight: 600, fill: p.hot ? t.hi : "#a9afba", anchor: "middle" })}${T(cx, top + 40, p.price, { size: n > 2 ? 29 : 34, weight: 700, fill: "#ffffff", anchor: "middle" })}${T(cx, top + 57, p.sub, { size: 10.500, fill: "#8d939e", anchor: "middle" })}<path d="M${x + 16} ${top + 72}h${w - 32}" stroke="${t.line}"/>${[p.a, p.b].map((f, k) => `<circle cx="${x + 18}" cy="${top + 91 + k * 22}" r="3" fill="${t.hi}"/>${T(x + 27, top + 95 + k * 22, f, { size: 10.500, fill: "#dfe3ea" })}`).join("")}`;
      })
      .join("");
    if (d.note) inner += T(200, 282, d.note, { size: 11.500, fill: "#8d939e", anchor: "middle" });
  } else {
    const done = d.rows.filter((r) => r[1]).length;
    inner += `<rect x="40" y="48" width="320" height="236" rx="16" fill="${t.panel}" stroke="${t.line}"/><circle cx="60" cy="66" r="4" fill="${t.line}"/><circle cx="74" cy="66" r="4" fill="${t.line}"/><circle cx="88" cy="66" r="4" fill="${t.line}"/>${T(340, 70, d.title, { size: 11, fill: "#9aa0ab", anchor: "end" })}<path d="M40 82h320" stroke="${t.line}"/>${T(60, 104, `${done} of ${d.rows.length} done`, { size: 11, weight: 600, fill: t.hi })}<rect x="150" y="98" width="190" height="6" rx="3" fill="${t.bg}"/><rect x="150" y="98" width="${(190 * done) / d.rows.length}" height="6" rx="3" fill="${t.hi}"/>`;
    inner += d.rows
      .map(([label, ok], i) => {
        const y = 128 + i * 25;
        return `<circle cx="70" cy="${y}" r="8" fill="${ok ? t.hi : "none"}" stroke="${ok ? t.hi : "#6b7280"}" stroke-width="1.500"/>${ok ? `<path d="M66.500 ${y}l2.500 2.600 4.500 -5.200" stroke="${t.bg}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : ""}${T(88, y + 4, label, { size: 12.500, weight: ok ? 500 : 600, fill: ok ? "#aab0bb" : "#ffffff" })}`;
      })
      .join("");
  }
  return `${open}${inner}</svg>`;
}

// © https://saadbinyousaf.dev/ © //
function thumbLegacy(kind) {
  const t = THEMES[kind] || THEMES.plans;
  const font = `font-family="Satoshi, system-ui, sans-serif"`;
  const open = `<svg viewBox="0 0 400 300" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="${t.bg}"/><path d="M0 0H400V300H0z" fill="url(#g-${kind})" opacity=".9"/><defs><radialGradient id="g-${kind}" cx="0.500" cy="0.500" r="0.700"><stop offset="0" stop-color="${t.hi}" stop-opacity=".14"/><stop offset="1" stop-color="${t.hi}" stop-opacity="0"/></radialGradient></defs>`;
  if (kind === "hub") {
    const tiles = [
      { x: 26, y: 60, label: "Contacts", icon: "person" },
      { x: 278, y: 60, label: "Inbox", icon: "chat" },
      { x: 14, y: 130, label: "Calendars", icon: "cal" },
      { x: 290, y: 130, label: "Workflows", icon: "flow" },
      { x: 26, y: 206, label: "Funnels", icon: "funnel" },
      { x: 278, y: 206, label: "Reviews", icon: "star" }
    ];
    const icon = (k, x, y) => {
      const c = t.hi;
      if (k === "person") return `<circle cx="${x + 10}" cy="${y + 7}" r="4" fill="${c}"/><path d="M${x + 3} ${y + 18}a7 6 0 0 1 14 0z" fill="${c}"/>`;
      if (k === "chat") return `<path d="M${x + 2} ${y + 3}h16a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-9l-5 4v-4h-2a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2z" fill="${c}"/>`;
      if (k === "cal") return `<rect x="${x + 2}" y="${y + 3}" width="16" height="15" rx="3" fill="none" stroke="${c}" stroke-width="2"/><path d="M${x + 2} ${y + 8}h16" stroke="${c}" stroke-width="2"/><rect x="${x + 6}" y="${y + 11}" width="3" height="3" fill="${c}"/>`;
      if (k === "flow") return `<circle cx="${x + 4}" cy="${y + 10}" r="3" fill="${c}"/><circle cx="${x + 16}" cy="${y + 4}" r="3" fill="${c}"/><circle cx="${x + 16}" cy="${y + 16}" r="3" fill="${c}"/><path d="M${x + 6} ${y + 9}L${x + 14} ${y + 5}M${x + 6} ${y + 11}L${x + 14} ${y + 15}" stroke="${c}" stroke-width="1.600"/>`;
      if (k === "funnel") return `<path d="M${x + 1} ${y + 3}h18l-7 8v7l-4 2v-9z" fill="${c}"/>`;
      return `<path d="M${x + 10} ${y + 1}l2.700 5.600 6.100 .9 -4.400 4.300 1 6.100 -5.400 -2.900 -5.400 2.900 1 -6.100 -4.400 -4.300 6.100 -.9z" fill="${c}"/>`;
    };
    const lines = tiles.map((tl) => `<path d="M${tl.x + 48} ${tl.y + 20}L200 150" stroke="${t.line}" stroke-width="1.500" stroke-dasharray="3 4"/>`).join("");
    const boxes = tiles
      .map((tl) => `<rect x="${tl.x}" y="${tl.y}" width="96" height="40" rx="10" fill="${t.panel}" stroke="${t.line}"/>${icon(tl.icon, tl.x + 10, tl.y + 10)}<text x="${tl.x + 38}" y="${tl.y + 25}" font-size="12.500" font-weight="600" fill="#e8ebf2" ${font}>${tl.label}</text>`)
      .join("");
    return `${open}${lines}${boxes}<rect x="136" y="120" width="128" height="60" rx="16" fill="${t.soft}" stroke="${t.hi}" stroke-width="1.500"/><text x="200" y="147" text-anchor="middle" font-size="16" font-weight="700" fill="#ffffff" ${font}>One login</text><text x="200" y="165" text-anchor="middle" font-size="11" fill="${t.hi}" ${font}>all tools connected</text></svg>`;
  }
  if (kind === "plans") {
    const plans = [
      { x: 22, y: 64, h: 178, name: "Starter", price: "$97", a: "3 accounts", b: "Core tools" },
      { x: 146, y: 48, h: 206, name: "Unlimited", price: "$297", a: "No account cap", b: "Rebilling", hot: true },
      { x: 270, y: 64, h: 178, name: "Founder", price: "$497", a: "SaaS mode", b: "Resell" }
    ];
    const cards = plans
      .map((p) => {
        const cx = p.x + 54;
        const top = p.y + (p.hot ? 34 : 26);
        return `<rect x="${p.x}" y="${p.y}" width="108" height="${p.h}" rx="14" fill="${p.hot ? t.soft : t.panel}" stroke="${p.hot ? t.hi : t.line}" stroke-width="${p.hot ? 1.500 : 1}"/>
<text x="${cx}" y="${top}" text-anchor="middle" font-size="12" font-weight="600" fill="${p.hot ? t.hi : "#a9b3a0"}" ${font}>${p.name}</text>
<text x="${cx}" y="${top + 40}" text-anchor="middle" font-size="31" font-weight="700" fill="#ffffff" ${font}>${p.price}</text>
<text x="${cx}" y="${top + 57}" text-anchor="middle" font-size="10.500" fill="#8d9686" ${font}>per month</text>
<path d="M${p.x + 16} ${top + 72}h76" stroke="${t.line}"/>
<circle cx="${p.x + 20}" cy="${top + 91}" r="3" fill="${t.hi}"/><text x="${p.x + 30}" y="${top + 95}" font-size="11" fill="#dfe5d8" ${font}>${p.a}</text>
<circle cx="${p.x + 20}" cy="${top + 113}" r="3" fill="${t.hi}"/><text x="${p.x + 30}" y="${top + 117}" font-size="11" fill="#dfe5d8" ${font}>${p.b}</text>`;
      })
      .join("");
    return `${open}${cards}<text x="200" y="280" text-anchor="middle" font-size="11.500" fill="#8d9686" ${font}>+ usage for texts, calls, email and AI</text></svg>`;
  }
  const rows = [
    ["Business profile", 1],
    ["Domain connected", 1],
    ["Email sending verified", 1],
    ["A2P registration", 1],
    ["Pipeline and calendar", 0],
    ["First workflow live", 0]
  ]
    .map(([label, done], i) => {
      const y = 128 + i * 25;
      return `<circle cx="70" cy="${y}" r="8" fill="${done ? t.hi : "none"}" stroke="${done ? t.hi : "#6e604a"}" stroke-width="1.500"/>${done ? `<path d="M66.500 ${y}l2.500 2.600 4.500 -5.200" stroke="${t.bg}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : ""}<text x="88" y="${y + 4}" font-size="12.500" font-weight="${done ? 500 : 600}" fill="${done ? "#b9ab92" : "#ffffff"}" ${font}>${label}</text>`;
    })
    .join("");
  return `${open}<rect x="40" y="48" width="320" height="236" rx="16" fill="${t.panel}" stroke="${t.line}"/><circle cx="60" cy="66" r="4" fill="${t.line}"/><circle cx="74" cy="66" r="4" fill="${t.line}"/><circle cx="88" cy="66" r="4" fill="${t.line}"/><text x="340" y="70" text-anchor="end" font-size="11" fill="#9c8f78" ${font}>Account setup</text><path d="M40 82h320" stroke="${t.line}"/><text x="60" y="104" font-size="11" fill="${t.hi}" font-weight="600" ${font}>4 of 6 done</text><rect x="150" y="98" width="190" height="6" rx="3" fill="${t.bg}"/><rect x="150" y="98" width="127" height="6" rx="3" fill="${t.hi}"/>${rows}</svg>`;
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
const clockIcon = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="6.200" fill="none" stroke="currentColor" stroke-width="1.500"/><path d="M8 4.800V8l2.200 1.400" stroke="currentColor" stroke-width="1.500" fill="none" stroke-linecap="round"/></svg>`;
const listIcon = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M5.500 4.500h8M5.500 8h8M5.500 11.500h8" stroke="currentColor" stroke-width="1.500" stroke-linecap="round"/><circle cx="2.600" cy="4.500" r="1" fill="currentColor"/><circle cx="2.600" cy="8" r="1" fill="currentColor"/><circle cx="2.600" cy="11.500" r="1" fill="currentColor"/></svg>`;

// © https://saadbinyousaf.dev/ © //
function card(a) {
  const search = esc([a.title, a.description, a.teaser, a.category, a.stage, ...(a.keywords || []), ...a.toc.map((t) => t.text)].join(" ").toLowerCase());
  return `<article class="b-shot" data-card data-category="${esc(a.category)}" data-stage="${esc(a.stage || "")}" data-order="${a.order || 99}" data-published="${a.published}" data-minutes="${a.minutes}" data-search="${search}">
  <a class="b-shot-media" href="${a.url}" aria-label="${esc(a.title)}">
    ${thumbnail(a)}
    <span class="b-shot-label">${esc(a.category)}</span>
    <span class="b-shot-over" aria-hidden="true"><span class="b-shot-teaser">${esc(a.teaser || a.description)}</span><span class="b-shot-go">Read the guide</span></span>
  </a>
  <div class="b-shot-info">
    <h3 class="b-shot-title"><a href="${a.url}">${esc(a.title)}</a></h3>
    <div class="b-shot-meta">
      <span class="b-shot-by"><span class="b-ava" aria-hidden="true">S</span>${esc(SITE.author)}</span>
      <span class="b-shot-stats"><span title="Reading time">${clockIcon}${a.minutes} min</span>${a.stat ? `<span>${listIcon}${esc(a.stat)}</span>` : ""}</span>
    </div>
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
  const cats = config.categories.filter((c) => articles.some((a) => a.category === c));
  const stages = config.stages.filter((st) => articles.some((a) => a.stage === st));
  const count = (pred) => articles.filter(pred).length;
  const body = `<header class="wrap b-lib-hero">
  <h1>HighLevel guides from someone who builds on it daily.</h1>
  <p class="b-lib-lead">Practical guides to what HighLevel does, what it really costs and how to set it up properly. Each one is checked against HighLevel's own documentation.</p>
  <form class="b-lib-search" role="search" data-library>
    <label class="b-search">
      <span class="sr-only">Search guides</span>
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 14l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <input type="search" name="q" placeholder="What do you want to learn?" autocomplete="off" data-search-input>
    </label>
  </form>
  <div class="b-topics"><span>Popular:</span>${config.popularTopics.map((t) => `<button type="button" data-topic="${esc(t)}">${esc(t)}</button>`).join("")}</div>
  <p class="b-hero-note">I earn a commission if you sign up for HighLevel through links in these guides. <a href="/disclosure/">How that works</a></p>
</header>

<section class="wrap b-lib" aria-labelledby="library-title">
  <h2 id="library-title" class="sr-only">All guides</h2>
  <div class="b-bar">
    <label class="b-sort">
      <span class="sr-only">Sort guides</span>
      <select data-sort>
        <option value="order">Suggested order</option>
        <option value="newest">Newest</option>
        <option value="shortest">Quickest read</option>
      </select>
      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false"><path d="M3 4.500l3 3 3-3" stroke="currentColor" stroke-width="1.500" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </label>
    <div class="b-tabs" role="group" aria-label="Filter by category">
      <button type="button" aria-pressed="true" data-filter="">All guides</button>
      ${cats.map((c) => `<button type="button" aria-pressed="false" data-filter="${esc(c)}">${esc(c)}</button>`).join("\n      ")}
    </div>
    <button type="button" class="b-filters-btn" aria-expanded="false" aria-controls="b-filters" data-filters-toggle>
      <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false"><path d="M2 4h12M4.500 8h7M7 12h2" stroke="currentColor" stroke-width="1.600" stroke-linecap="round"/></svg>
      Filters<span class="b-filters-dot" data-filters-dot hidden></span>
    </button>
  </div>
  <div class="b-filters" id="b-filters" hidden>
    <p class="b-filters-label">Where are you with HighLevel?</p>
    <div class="b-chips" role="group" aria-label="Filter by stage">
      <button type="button" aria-pressed="true" data-stage-filter="">Any stage</button>
      ${stages.map((st) => `<button type="button" aria-pressed="false" data-stage-filter="${esc(st)}">${esc(st)} <span>${count((a) => a.stage === st)}</span></button>`).join("\n      ")}
    </div>
  </div>
  <p class="b-count" data-count aria-live="polite"></p>
  <div class="b-shots" data-grid>
    ${articles.map((a) => card(a)).join("\n")}
  </div>
  <div class="b-empty" data-empty hidden>
    <p><strong>No guides match that.</strong> Try a broader word such as "pricing", "setup" or "automation".</p>
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
  <div class="b-shots">
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
