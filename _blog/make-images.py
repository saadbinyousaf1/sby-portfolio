# © https://saadbinyousaf.dev/ © #
import glob, html, json, os, re
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_blog")
FONT = f"""@font-face{{font-family:Satoshi;font-weight:400 500;src:url(file://{ROOT}/assets/fonts/satoshi-500.woff2)}}
@font-face{{font-family:Satoshi;font-weight:600 900;src:url(file://{ROOT}/assets/fonts/satoshi-700.woff2)}}"""
BASE = """*{box-sizing:border-box;margin:0}body{font-family:Satoshi,sans-serif;background:#07080a;color:#f4f4f5;
background-image:linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);background-size:60px 60px}
.brand{display:flex;align-items:center;gap:14px;font-weight:700;letter-spacing:.14em}
.mark{border-radius:12px;background:#aac86b;color:#07080a;display:grid;place-items:center;font-weight:900;letter-spacing:0}
.brand i{font-style:normal;color:#aac86b}.dim{color:#9c9c9d;font-weight:500;letter-spacing:0}
.chip{display:inline-block;border-radius:999px;border:1px solid rgba(170,200,107,.4);background:rgba(170,200,107,.12);color:#aac86b;font-weight:600}
.thumb{border-radius:22px;overflow:hidden;border:1px solid #2a2b2f;box-shadow:0 30px 80px -30px #000}.thumb svg{display:block;width:100%;height:100%}"""

# © https://saadbinyousaf.dev/ © #
def page(css, body, w, h):
    return f"<html><head><style>{FONT}{BASE}body{{width:{w}px;height:{h}px}}{css}</style></head><body>{body}</body></html>"

# © https://saadbinyousaf.dev/ © #
def og_guide(a):
    size = 58 if len(a["title"]) < 52 else 50
    css = f".w{{display:flex;height:100%;padding:64px 60px;gap:48px;align-items:center}}.l{{flex:1;display:flex;flex-direction:column;justify-content:space-between;height:100%}}.brand{{font-size:22px}}.mark{{width:42px;height:42px;font-size:22px}}.chip{{font-size:20px;padding:7px 18px}}h1{{font-size:{size}px;line-height:1.08;letter-spacing:-.03em;margin-top:22px}}.foot{{font-size:22px;color:#9c9c9d}}.thumb{{width:460px;height:345px;flex:none}}"
    body = f"<div class='w'><div class='l'><div class='brand'><span class='mark'>S</span><span>SBY<i>.DEV</i></span><span class='dim'>/ Guides</span></div><div><span class='chip'>{html.escape(a['category'])}</span><h1>{html.escape(a['title'])}</h1></div><div class='foot'>{a['minutes']} min read &nbsp;&bull;&nbsp; {html.escape(a['stat'])}</div></div><div class='thumb'>{a['svg']}</div></div>"
    return page(css, body, 1200, 630)

# © https://saadbinyousaf.dev/ © #
def pin_guide(a):
    css = ".w{display:flex;flex-direction:column;height:100%;padding:60px}.thumb{width:880px;height:660px}.chip{font-size:28px;padding:10px 24px;margin-top:50px;align-self:flex-start}h1{font-size:74px;line-height:1.05;letter-spacing:-.035em;margin-top:26px}p{font-size:35px;line-height:1.4;color:#c9c9cc;margin-top:28px}.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:center}.brand{font-size:28px}.mark{width:54px;height:54px;font-size:28px}.cta{background:#aac86b;color:#07080a;font-weight:700;font-size:28px;padding:16px 30px;border-radius:999px}"
    body = f"<div class='w'><div class='thumb'>{a['svg']}</div><span class='chip'>{html.escape(a['category'])}</span><h1>{html.escape(a['title'])}</h1><p>{html.escape(a['teaser'])}</p><div class='foot'><div class='brand'><span class='mark'>S</span><span>SBY<i>.DEV</i></span></div><span class='cta'>Read the free guide</span></div></div>"
    return page(css, body, 1000, 1500)

# © https://saadbinyousaf.dev/ © #
def og_page(eyebrow, title, sub, foot):
    size = 76 if len(title) < 34 else 62
    css = f".w{{display:flex;flex-direction:column;justify-content:space-between;height:100%;padding:64px 72px}}.brand{{font-size:24px}}.mark{{width:46px;height:46px;font-size:24px}}.chip{{font-size:21px;padding:8px 20px}}h1{{font-size:{size}px;line-height:1.05;letter-spacing:-.035em;margin-top:24px;max-width:1000px}}p{{font-size:28px;line-height:1.4;color:#c9c9cc;margin-top:20px;max-width:940px}}.foot{{font-size:23px;color:#9c9c9d}}"
    body = f"<div class='w'><div class='brand'><span class='mark'>S</span><span>SBY<i>.DEV</i></span></div><div><span class='chip'>{html.escape(eyebrow)}</span><h1>{html.escape(title)}</h1><p>{html.escape(sub)}</p></div><div class='foot'>{html.escape(foot)}</div></div>"
    return page(css, body, 1200, 630)

# © https://saadbinyousaf.dev/ © #
def text(pattern, s):
    m = re.search(pattern, s, re.S)
    return html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip() if m else ""

# © https://saadbinyousaf.dev/ © #
def main():
    guides = json.load(open(os.path.join(SRC, "og-data.json")))
    jobs = []
    for a in guides:
        jobs.append((og_guide(a), os.path.join(SRC, "og", a["slug"] + ".png"), 1200, 630))
        jobs.append((pin_guide(a), os.path.join(SRC, "pins", a["slug"] + ".png"), 1000, 1500))
    out = os.path.join(ROOT, "assets", "og")
    for f in sorted(glob.glob(os.path.join(ROOT, "tools", "*", "index.html"))):
        s = open(f).read()
        slug = os.path.basename(os.path.dirname(f))
        if slug == "assets":
            continue
        short = text(r'"@type": "WebApplication", "name": "(.*?)"', s) or text(r"<h1[^>]*>(.*?)</h1>", s)
        jobs.append((og_page("Free HighLevel tool", short, text(r'<meta name="description" content="(.*?)"', s), "Free. No signup. Runs in your browser."), os.path.join(out, f"tool-{slug}.png"), 1200, 630))
    jobs.append((og_page("8 free tools", "Free tools for HighLevel users", "SMS segment calculator, A2P 10DLC kit, CSV cleaner, review link generator, UTM builder and more.", "saadbinyousaf.dev/tools"), os.path.join(out, "tools.png"), 1200, 630))
    jobs.append((og_page("GoHighLevel expert", "I build HighLevel systems that turn traffic into revenue", "White-labeled CRM portals, automations, funnels and custom code for agencies and service businesses.", "Saad Bin Yousaf"), os.path.join(out, "home.png"), 1200, 630))
    jobs.append((og_page("Integrations", "The apps I connect to HighLevel", "Payments, ads, calendars, messaging, e-commerce, automation and AI, set up and synced end to end.", "saadbinyousaf.dev/integrations"), os.path.join(out, "integrations.png"), 1200, 630))
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get("CHROME", "/usr/bin/google-chrome"), args=["--no-sandbox"])
        for markup, dest, w, h in jobs:
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            pg = b.new_page(viewport={"width": w, "height": h})
            tmp = os.path.join(SRC, ".og-tmp.html")
            open(tmp, "w").write(markup)
            pg.goto("file://" + tmp)
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(150)
            pg.screenshot(path=dest)
            pg.close()
        b.close()
    tmp = os.path.join(SRC, ".og-tmp.html")
    if os.path.exists(tmp):
        os.remove(tmp)
    try:
        from PIL import Image
        for _, dest, _, _ in jobs:
            Image.open(dest).convert("P", palette=Image.ADAPTIVE, colors=128).save(dest, optimize=True)
    except ImportError:
        pass
    print(len(jobs), "images")

main()
