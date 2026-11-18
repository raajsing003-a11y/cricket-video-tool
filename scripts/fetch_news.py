#!/usr/bin/env python3
"""C22 news fetcher (C142: story-wise cluster, union-find). Sirf standard library. Chalao: python scripts/fetch_news.py [--feeds feeds.json] [--out news/news.json]
feeds.json ki feeds padhta hai, news/news.json mein merge karta hai (dedupe, tags, Confirmed/Rumor label, score).
Naye facts nahi banata: sirf headline + chhota summary + link."""
import json, sys, os, re, hashlib, html, argparse, time, urllib.request, datetime as dt
from concurrent.futures import ThreadPoolExecutor
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

def fetch(url, tries=2):
    """C145: ek baar retry (feed kabhi kabhi atak jaati hai), timeout 20s."""
    last = None
    for k in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=20) as r:
                return r.read()
        except Exception as ex:
            last = ex
            time.sleep(1.0)
    raise last

def get_rows(fd):
    """C145: ek feed fetch + parse (thread mein chalta hai). Return (fd, rows, err, seconds)."""
    t0 = time.time()
    try:
        return fd, parse_feed(fetch(fd["url"])), None, round(time.time() - t0, 1)
    except Exception as ex:
        return fd, None, str(ex)[:120], round(time.time() - t0, 1)

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

STOP = set("the and for with from that this has have had was were are will its his her their about after before over into out against says said say amid ahead new news latest live updates update cricket match vs ipl 2026 2027 odi t20 t20i test series team teams player tour ke ki ka ko se me mein par hai hain के की का को से में पर है हैं और ने भी तो लिए गए गया रहे".split())
ALIAS = {}  # feeds.json "aliases" se bharta hai (team short form / Hindi naam -> English shabd)
SYN = {"retention": "retain", "retentions": "retain", "retained": "retain", "retains": "retain", "retaining": "retain",
       "released": "release", "releases": "release", "releasing": "release", "traded": "trade", "trades": "trade",
       "trading": "trade", "signs": "sign", "signed": "sign", "joins": "join", "joined": "join", "appointed": "appoint",
       "named": "appoint", "names": "appoint", "players": "player", "रिटेन": "retain", "रिटेंशन": "retain", "रिलीज": "release"}
WORD = re.compile(r"[\w\u0900-\u097F]+")

def tokens(title):
    out = set()
    for w in WORD.findall(title.lower()):
        w = ALIAS.get(w, w)
        w = SYN.get(w, w)
        if not w or len(w) <= 2 or w in STOP or w.isdigit():
            continue
        if w.endswith("s") and len(w) > 4:
            w = w[:-1]
        out.add(w)
    return out

def jac(a, b):
    return len(a & b) / len(a | b) if a and b else 0.0

TEAMS = {"rajasthan", "lucknow", "chennai", "bengaluru", "mumbai", "kolkata", "hyderabad", "delhi", "punjab", "gujarat"}

def same_story(ta, tb):
    """Milti-julti headline = ek hi story. Conservative: galat jod se behtar hai ki alag rahe."""
    sh = len(ta & tb)
    if not sh:
        return False
    xa, xb = ta & TEAMS, tb & TEAMS
    if xa and xb and not (xa & xb):
        return False  # alag-alag teams ki khabar (MI list vs CSK list) kabhi ek nahi
    j = sh / len(ta | tb)
    ov = sh / min(len(ta), len(tb))
    return j >= 0.5 or (sh >= 3 and ov >= 0.6) or (sh >= 2 and ov >= 0.85 and min(len(ta), len(tb)) >= 3)

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
    ALIAS.clear()
    ALIAS.update({k.lower(): v.lower() for k, v in cfg.get("aliases", {}).items()})

    old = {}
    if os.path.exists(a.out):
        try:
            for it in json.load(open(a.out, encoding="utf-8")).get("items", []):
                old[it["id"]] = it
        except Exception as ex:
            print("WARN: purani news.json padh nahi payi:", ex)

    ok, fail, new_n, dropped, timing = [], [], 0, 0, {}
    todo = [fd for fd in cfg.get("feeds", []) if fd.get("enabled", True)]
    t_all = time.time()
    with ThreadPoolExecutor(max_workers=8) as ex:  # C145: saari feeds ek saath (pehle ek-ek karke)
        results = list(ex.map(get_rows, todo))
    print("fetch time: %.1fs (%d feeds)" % (time.time() - t_all, len(todo)))
    for fd, rows, err, secs in results:
        timing[fd.get("name")] = secs
        if err:
            fail.append({"name": fd.get("name"), "err": err})
            print("FAIL", fd.get("name"), err)
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
            seen = old[iid].get("seen") if iid in old else t_now.isoformat()  # C145: pehli baar kab dikhi
            if iid not in old:
                new_n += 1
            old[iid] = {"id": iid, "seen": seen, "title": title, "link": link, "source": src, "published": d.isoformat(),
                        "summary": summ, "tags": tags, "label": label}

    items = [i for i in old.values() if t_now - parse_date(i["published"]) <= max_age]
    items.sort(key=lambda i: i["published"], reverse=True)
    items = items[:600]

    # same story ke cluster: union-find, 72 ghante ke andar ki headlines. Cluster id = sabse purani item ka id (naye item aane par badalta nahi).
    n_it = len(items)
    for it in items:
        it["_tk"] = tokens(it["title"])
        it["_t"] = parse_date(it["published"])
    par = list(range(n_it))

    def find(x):
        while par[x] != x:
            par[x] = par[par[x]]
            x = par[x]
        return x

    win = dt.timedelta(hours=72)
    for i in range(n_it):
        for j in range(i + 1, n_it):
            if items[i]["_t"] - items[j]["_t"] > win:
                break  # items naye->purane sorted hain
            if items[i]["_tk"] and items[j]["_tk"] and same_story(items[i]["_tk"], items[j]["_tk"]):
                ri, rj = find(i), find(j)
                if ri != rj:
                    par[ri] = rj
    groups = {}
    for i in range(n_it):
        groups.setdefault(find(i), []).append(items[i])
    cs = {}
    for g in groups.values():
        oldest = min(g, key=lambda x: x["_t"])
        srcs = set(x["source"].strip().lower() for x in g)
        for x in g:
            x["cluster"] = oldest["id"]
        for x in g:
            cs[x["id"]] = len(srcs)
    # C145: trending = pichle 3 ghante mein kitni alag sites ne is story par likha
    recent = {}
    for g in groups.values():
        rs = set(x["source"].strip().lower() for x in g if (t_now - x["_t"]).total_seconds() <= 3 * 3600)
        for x in g:
            recent[x["id"]] = len(rs)
    for it in items:
        age_h = (t_now - it["_t"]).total_seconds() / 3600
        n = cs.get(it["id"], 1)
        it["recent_n"] = recent.get(it["id"], 0)
        it["sources_n"] = n
        it["score"] = round(max(TAGW.get(t, 0) for t in it["tags"]) + 2 * (n - 1)
                            + (3 if it["label"] == "Confirmed" else 0) + max(0.0, 3 - age_h / 12), 2)
        it.pop("_tk", None)
        it.pop("_t", None)

    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    json.dump({"updated": t_now.isoformat(), "feeds_ok": ok, "feeds_fail": fail, "feed_secs": timing, "items": items},
              open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("OK: %d items (%d naye), %d feeds ok, %d fail, %d blocked" % (len(items), new_n, len(ok), len(fail), dropped))
    return 0

if __name__ == "__main__":
    sys.exit(main())
