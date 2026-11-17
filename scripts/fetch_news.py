#!/usr/bin/env python3
"""C22 news fetcher. Sirf standard library. Chalao: python scripts/fetch_news.py [--feeds feeds.json] [--out news/news.json]
feeds.json ki feeds padhta hai, news/news.json mein merge karta hai (dedupe, tags, Confirmed/Rumor label, score).
Naye facts nahi banata: sirf headline + chhota summary + link."""
import json, sys, os, re, hashlib, html, argparse, urllib.request, datetime as dt
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "Mozilla/5.0 (compatible; CricketNewsTracker/1.0)"
TAGW = {"Retention": 5, "Release": 5, "Auction": 4, "Trade": 4, "India Match": 3, "Team News": 2, "Other": 0}

def now():
    return dt.datetime.now(dt.timezone.utc)

def local(tag):
    return tag.rsplit("}", 1)[-1].lower()

def clean(s, n=None):
    s = html.unescape(re.sub(r"<[^>]+>", " ", s or ""))
    s = re.sub(r"\s+", " ", s).strip()
    return s[:n].rstrip() if n and len(s) > n else s

def parse_date(s):
    if not s:
        return None
    s = s.strip()
    try:
        d = parsedate_to_datetime(s)
    except Exception:
        try:
            d = dt.datetime.fromisoformat(s.replace("Z", "+00:00"))
        except Exception:
            return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=dt.timezone.utc)
    return d.astimezone(dt.timezone.utc)

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read()

def parse_feed(data):
    root = ET.fromstring(data)
    out = []
    nodes = [e for e in root.iter() if local(e.tag) in ("item", "entry")]
    for e in nodes:
        f = {"title": "", "link": "", "date": "", "summary": "", "source": ""}
        for c in e:
            t = local(c.tag)
            if t == "title":
                f["title"] = c.text or ""
            elif t == "link":
                f["link"] = (c.get("href") or c.text or "").strip() or f["link"]
            elif t in ("pubdate", "published", "updated", "date"):
                f["date"] = f["date"] or (c.text or "")
            elif t in ("description", "summary", "content"):
                f["summary"] = f["summary"] or (c.text or "")
            elif t == "source":
                f["source"] = (c.text or "").strip()
        out.append(f)
    return out

def tokens(title):
    return set(w for w in re.findall(r"\w+", title.lower()) if len(w) > 2)

def jac(a, b):
    return len(a & b) / len(a | b) if a and b else 0.0

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--feeds", default=os.path.join(ROOT, "feeds.json"))
    ap.add_argument("--out", default=os.path.join(ROOT, "news", "news.json"))
    a = ap.parse_args()
    cfg = json.load(open(a.feeds, encoding="utf-8"))
    max_age = dt.timedelta(days=cfg.get("max_age_days", 14))
    rules = cfg.get("tag_rules", {})
    rumor = [w.lower() for w in cfg.get("rumor_words", [])]
    blocked = [w.lower() for w in cfg.get("blocked_words", [])]
    t_now = now()

    old = {}
    if os.path.exists(a.out):
        try:
            for it in json.load(open(a.out, encoding="utf-8")).get("items", []):
                old[it["id"]] = it
        except Exception as ex:
            print("WARN: purani news.json padh nahi payi:", ex)

    ok, fail, new_n, dropped = [], [], 0, 0
    for fd in cfg.get("feeds", []):
        if not fd.get("enabled", True):
            continue
        try:
            rows = parse_feed(fetch(fd["url"]))
        except Exception as ex:
            fail.append({"name": fd.get("name"), "err": str(ex)[:120]})
            print("FAIL", fd.get("name"), ex)
            continue
        ok.append(fd.get("name"))
        for r in rows:
            title = clean(r["title"])
            link = r["link"]
            if not title or not link:
                continue
            src = r["source"] or fd.get("name", "")
            if r["source"] and title.endswith(" - " + r["source"]):
                title = title[: -len(" - " + r["source"])].strip()
            summ = clean(r["summary"], 220)
            if summ.startswith(title[:40]):
                summ = ""
            low = (title + " " + summ).lower()
            if any(w in low for w in blocked):
                dropped += 1
                continue
            d = parse_date(r["date"]) or t_now
            if t_now - d > max_age:
                continue
            iid = hashlib.sha1(link.encode("utf-8")).hexdigest()[:12]
            tags = [t for t, kws in rules.items() if any(k.lower() in low for k in kws)] or ["Other"]
            is_rumor = any(w in low for w in rumor)
            label = "Confirmed" if (fd.get("official") and not is_rumor) else "Rumor"
            if iid not in old:
                new_n += 1
            old[iid] = {"id": iid, "title": title, "link": link, "source": src, "published": d.isoformat(),
                        "summary": summ, "tags": tags, "label": label}

    items = [i for i in old.values() if t_now - parse_date(i["published"]) <= max_age]
    items.sort(key=lambda i: i["published"], reverse=True)
    items = items[:600]

    # same story ke cluster (title milte-julte) -> kitne alag sources ne chhapa
    reps = []
    for it in items:
        tk = tokens(it["title"])
        it["_tk"] = tk
        for rep in reps:
            if jac(tk, rep["_tk"]) >= 0.5:
                it["cluster"] = rep["id"]
                rep.setdefault("_srcs", {rep["source"]}).add(it["source"])
                break
        else:
            it["cluster"] = it["id"]
            it["_srcs"] = {it["source"]}
            reps.append(it)
    cs = {r["id"]: len(r["_srcs"]) for r in reps}
    for it in items:
        age_h = (t_now - parse_date(it["published"])).total_seconds() / 3600
        n = cs.get(it["cluster"], 1)
        it["sources_n"] = n
        it["score"] = round(max(TAGW.get(t, 0) for t in it["tags"]) + 2 * (n - 1)
                            + (3 if it["label"] == "Confirmed" else 0) + max(0.0, 3 - age_h / 12), 2)
        it.pop("_tk", None)
        it.pop("_srcs", None)

    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    json.dump({"updated": t_now.isoformat(), "feeds_ok": ok, "feeds_fail": fail, "items": items},
              open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("OK: %d items (%d naye), %d feeds ok, %d fail, %d blocked" % (len(items), new_n, len(ok), len(fail), dropped))
    return 0

if __name__ == "__main__":
    sys.exit(main())
