(function () {
  "use strict";

  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var status = document.getElementById("search-status");
  if (!input || !results || !status) return;

  var docs = [];
  var loading = false;

  function normalize(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[\u200c\u200b\u0640]/g, "")
      .replace(/ي/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/[۰-۹]/g, function (c) {
        return c.charCodeAt(0) - 0x06f0;
      })
      .replace(/[٠-٩]/g, function (c) {
        return c.charCodeAt(0) - 0x0660;
      })
      .replace(/[«»"'‘’“”(),;:.!؟?]/g, " ")
      .replace(/[-_/\\+]+/g, " ");
  }

  function tokenize(s) {
    return normalize(s)
      .split(/\s+/)
      .filter(function (t) {
        return t.length >= 2;
      });
  }

  function countMatches(text, tokens) {
    var n = 0;
    for (var i = 0; i < tokens.length; i++) {
      var idx = text.indexOf(tokens[i]);
      while (idx !== -1) {
        n++;
        idx = text.indexOf(tokens[i], idx + tokens[i].length);
      }
    }
    return n;
  }

  function snippet(body, tokens) {
    var norm = normalize(body);
    var pos = -1;
    for (var i = 0; i < tokens.length; i++) {
      pos = norm.indexOf(tokens[i]);
      if (pos !== -1) break;
    }
    if (pos === -1) return "";
    var start = Math.max(0, pos - 60);
    var end = Math.min(body.length, pos + 90);
    var pre = start > 0 ? "…" : "";
    var post = end < body.length ? "…" : "";
    return pre + body.slice(start, end).replace(/\s+/g, " ") + post;
  }

  function search(query) {
    var tokens = tokenize(query);
    if (!tokens.length) return [];

    var scored = [];
    for (var i = 0; i < docs.length; i++) {
      var d = docs[i];
      if (!d.body || d.body.length < 20) continue;
      var tTitle = normalize(d.title);
      var tDesc = normalize(d.description);
      var tBody = normalize(d.body);
      var present = true;
      for (var j = 0; j < tokens.length; j++) {
        if (
          tTitle.indexOf(tokens[j]) === -1 &&
          tDesc.indexOf(tokens[j]) === -1 &&
          tBody.indexOf(tokens[j]) === -1
        ) {
          present = false;
          break;
        }
      }
      if (!present) continue;
      var score =
        5 * countMatches(tTitle, tokens) +
        2 * countMatches(tDesc, tokens) +
        1 * countMatches(tBody, tokens);
      scored.push({ doc: d, score: score });
    }

    scored.sort(function (a, b) {
      return b.score - a.score;
    });
    return scored.slice(0, 10);
  }

  function render(items, query) {
    results.innerHTML = "";
    if (!items.length) {
      status.textContent = "نتیجه‌ای پیدا نشد";
      return;
    }
    status.textContent = items.length + " نتیجه برای «" + query + "»";
    for (var i = 0; i < items.length; i++) {
      var d = items[i].doc;
      var li = document.createElement("li");
      var link = document.createElement("a");
      link.className = "search__link";
      link.href = d.path;
      link.textContent = d.title || d.path;
      li.appendChild(link);
      var sn = snippet(d.body, tokenize(query));
      if (sn) {
        var p = document.createElement("p");
        p.className = "search__snippet";
        p.textContent = sn;
        li.appendChild(p);
      }
      var meta = document.createElement("span");
      meta.className = "search__path";
      meta.textContent = d.path;
      meta.setAttribute("dir", "ltr");
      li.appendChild(meta);
      results.appendChild(li);
    }
  }

  function load() {
    if (loading) return;
    loading = true;
    fetch(window.SEARCH_URL)
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        docs = data;
        loading = false;
        if (input.value.trim()) run(input.value.trim());
      })
      .catch(function () {
        loading = false;
        status.textContent = "بارگذاری ایندکس جستجو ناموفق بود";
      });
  }

  var timer = null;
  function run(query) {
    render(search(query), query);
  }

  input.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var q = input.value.trim();
      if (!q) {
        results.innerHTML = "";
        status.textContent = "";
        return;
      }
      run(q);
    }, 160);
  });

  input.addEventListener("focus", load);
  load();
})();
