# Guides source

Source for `/blog/` and `/disclosure/`. Vercel skips this folder (`.vercelignore`); only the generated pages are served.

```
node _blog/build.js
```

Run it from the repo root after any change, then commit the regenerated `blog/`, `disclosure/` and `sitemap.xml` with your edits. The build reuses the header and footer from `tools/index.html`, so change navigation there first and rebuild.

## Files

| File | Purpose |
|---|---|
| `site.config.js` | Affiliate links, CTA wording, widget options, categories, facts-checked date |
| `articles/*.html` | One file per guide: JSON block at the top, HTML body below |
| `disclosure.html` | Affiliate disclosure page |
| `blog.css`, `blog.js` | Guide styles and behaviour (search, filters, table of contents, widget, events) |
| `og.png` | Social share image |

## Affiliate links

All six links live in `site.config.js` under `links`. In an article:

- `{{cta:trial}}` places a call-to-action block (`trial`, `bootcamp`, `plans`, `annual`, `founder`, `upgrade`)
- `{{aff:founder|link text}}` places an inline paid link with its commission note
- `{{checked}}` prints the facts-checked date

## Add a guide

Copy an article file, rename it and edit the JSON block: `slug`, `title`, `seoTitle`, `description`, `category` (must be in `categories`), `visual` (`pipeline`, `ladder`, `checklist`), `published`, `updated`, `keywords`, optional `faq`, `next`, `sources`, `order`, `featured`. Every `<h2>` becomes a table-of-contents entry. Cards, related links, sitemap entries and structured data are generated.

## Events

`blog.js` records `article_view`, `search`, `filter`, `article_nav`, `cta_click`, `widget_open`, `widget_close`, `widget_choice`, `widget_secondary`. Each is pushed to `window.sbyEvents`, fired as an `sby:track` DOM event, and forwarded to `gtag` or `plausible` if either is on the page.

## Share images and SEO fields

`python3 _blog/make-images.py` (needs Playwright and Chrome) renders a 1200×630 share image and a 1000×1500 Pinterest pin for every guide into `_blog/og/` and `_blog/pins/`, and share images for the tools and main pages into `assets/og/`. Run `node _blog/build.js` first so `og-data.json` is current, then the image script, then the build again to copy the images into `blog/assets/`.

Extra front-matter fields: `seoTitle` (60 characters or fewer), `description` (155 or fewer), `takeaways` (three short facts shown as "The short answer"), `tools` (related free tools), `teaser`, `stat`, `stage`, `thumb`, `theme`, `thumbData`.

`blog/feed.xml` is an RSS feed of the guides. Pinterest and other schedulers can publish from it automatically.
