#!/usr/bin/env python3
"""Build the site into _site/. No dependencies - just `python3 build.py`.

pages/*.html   page bodies. First line is a JSON comment with page settings:
               <!-- {"title": "work", "nav": "work", "scripts": ["home.js"]} -->
               Bodies can embed data-driven blocks with {{ name key=value ... }}.
data/*.json    the lists: talks, videos, projects, writing, press, site stats.
templates/     the shared layout.
static/        copied as-is (css, js, favicon).
"""
import html
import json
import re
import shutil
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent
OUT = ROOT / "_site"
SITE_URL = "https://tanisha-byte.github.io"

NAV = [("me", "/me"), ("work", "/work"), ("talks", "/talks"), ("writing", "/writing"), ("play", "/play")]


def load(name):
    return json.loads((ROOT / "data" / f"{name}.json").read_text())


SITE = load("site")
TALKS = load("talks")
VIDEOS = load("videos")
PROJECTS = load("projects")
WRITING = load("writing")
PRESS = load("press")

MONTHS = "jan feb mar apr may jun jul aug sep oct nov dec".split()


def month(ym):
    """'2026-08' -> 'aug 2026'."""
    y, m = ym.split("-")[:2]
    return f"{MONTHS[int(m) - 1]} {y}"


def link(text, url):
    return f'<a href="{html.escape(url)}">{text}</a>' if url else text


def tags(items):
    return '<div class="tag-row">' + "".join(f'<span class="tag">{t}</span>' for t in items) + "</div>"


# ---------- blocks usable in pages as {{ name key=value }} ----------

def block_stats(**_):
    cells = "".join(
        f'<div class="stat"><span class="num">{s["num"]}</span><span class="what">{s["what"]}</span></div>'
        for s in SITE["stats"]
    )
    return f'<div class="stats">{cells}</div>'


def block_talks(limit=None, featured=None, **_):
    talks = sorted(TALKS, key=lambda t: t["date"], reverse=True)
    if featured:
        talks = [t for t in talks if t.get("featured")]
    if limit:
        talks = talks[: int(limit)]
    rows = []
    for t in talks:
        extras = []
        if t.get("video"):
            extras.append(f'<a class="pill" href="https://youtu.be/{t["video"]}">▶ watch</a>')
        if t.get("upcoming"):
            extras.append('<span class="pill pill-soon">upcoming</span>')
        title = f'<span class="talk-title">{link(t["title"], t.get("url"))}</span>' if t.get("title") else ""
        rows.append(
            f'<li><span class="when">{month(t["date"])}</span>'
            f'<div class="talk-body"><span class="talk-event">{t["event"]}</span>'
            f'<span class="talk-where">{t.get("where", "")}</span>{title}'
            f'<span class="talk-note">{t.get("note", "")}</span></div>'
            f'<div class="talk-extras">{"".join(extras)}</div></li>'
        )
    return f'<ul class="talk-list">{"".join(rows)}</ul>'


def block_videos(group, limit=None, **_):
    vids = VIDEOS[group][: int(limit)] if limit else VIDEOS[group]
    cards = []
    for v in vids:
        cards.append(
            f'<a class="card video-card" href="https://youtu.be/{v["id"]}" target="_blank" rel="noopener">'
            f'<div class="video-thumb" style="background-image:url(\'https://i.ytimg.com/vi/{v["id"]}/hqdefault.jpg\')">'
            f'<span class="stamp">{v["stamp"]}</span><span class="play">▶</span></div>'
            f'<div class="video-body"><h3>{v["title"]}</h3><p>{v.get("desc", "")}</p></div></a>'
        )
    return f'<div class="card-grid">{"".join(cards)}</div>'


def block_projects(group, **_):
    cards = []
    for p in PROJECTS[group]:
        cards.append(
            f'<article class="card"><p class="meta">{p["meta"]}</p>'
            f'<h3>{link(p["name"], p.get("url"))}</h3><p>{p["desc"]}</p>{tags(p.get("tags", []))}</article>'
        )
    return f'<div class="card-grid">{"".join(cards)}</div>'


def block_posts(group, limit=None, **_):
    posts = WRITING[group][: int(limit)] if limit else WRITING[group]
    items = "".join(
        f'<li><span class="date">{p["label"]}</span>'
        f'<a class="title-link" href="{html.escape(p["url"])}">{p["title"]}</a>'
        f'<p class="excerpt">{p.get("desc", "")}</p></li>'
        for p in posts
    )
    return f'<ul class="post-list">{items}</ul>'


def block_press(**_):
    items = "".join(
        f'<li><span class="mini-tag">{p["kind"]}</span>{link(p["title"], p.get("url"))}'
        f' <span class="dim">- {p["desc"]}</span></li>'
        for p in PRESS
    )
    return f'<ul class="mini-list">{items}</ul>'


def block_count(what, **_):
    return {"talks": SITE["talks_count"], "recorded": str(sum(1 for t in TALKS if t.get("video")))}[what]


BLOCKS = {name[6:]: fn for name, fn in globals().items() if name.startswith("block_")}
BLOCK_RE = re.compile(r"\{\{\s*(\w+)((?:\s+\w+=[\w-]+)*)\s*\}\}")


def render_blocks(body):
    def sub(m):
        args = dict(a.split("=") for a in m.group(2).split())
        return BLOCKS[m.group(1)](**args)

    return BLOCK_RE.sub(sub, body)


# ---------- pages ----------

def build_page(src, layout):
    first, body = src.read_text().split("\n", 1)
    meta = json.loads(first.strip()[4:-3])
    slug = src.stem
    nav = "".join(
        f'<a class="nav-link{" active" if meta.get("nav") == key else ""}" href="{href}">{key}/</a>'
        for key, href in NAV
    )
    scripts = "".join(f'<script src="/assets/js/{s}" defer></script>' for s in meta.get("scripts", []))
    title = "tanisha sharma" if slug == "index" else f'{meta["title"]} | tanisha sharma'
    page = (
        layout.replace("{{title}}", title)
        .replace("{{description}}", html.escape(meta.get("description", SITE["description"])))
        .replace("{{canonical}}", SITE_URL + ("/" if slug == "index" else f"/{slug}"))
        .replace("{{nav}}", nav)
        .replace("{{scripts}}", scripts)
        .replace("{{year}}", str(datetime.now().year))
        .replace("{{content}}", render_blocks(body))
    )
    (OUT / f"{slug}.html").write_text(page)


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(ROOT / "static", OUT)
    layout = (ROOT / "templates" / "layout.html").read_text()
    for src in sorted((ROOT / "pages").glob("*.html")):
        build_page(src, layout)
    (OUT / ".nojekyll").write_text("")
    pages = [p.stem for p in (ROOT / "pages").glob("*.html") if p.stem != "404"]
    urls = "".join(f"<url><loc>{SITE_URL}{'/' if p == 'index' else '/' + p}</loc></url>" for p in sorted(pages))
    (OUT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>'
    )
    print(f"built {len(pages) + 1} pages -> {OUT.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
