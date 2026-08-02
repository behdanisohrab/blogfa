(function () {
  "use strict";

  function flash(btn, ok) {
    var prev = btn.textContent;
    var cls = ok ? "is-copied" : "is-error";
    btn.classList.add(cls);
    btn.textContent = ok ? "کپی شد ✓" : "خطا";
    setTimeout(function () {
      btn.textContent = prev;
      btn.classList.remove(cls);
    }, 1600);
  }

  function fallbackCopy(text, btn) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    flash(btn, ok);
  }

  function copyText(text, btn) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () {
          flash(btn, true);
        },
        function () {
          fallbackCopy(text, btn);
        }
      );
    } else {
      fallbackCopy(text, btn);
    }
  }

  function codeText(code) {
    var lines = code.querySelectorAll(".giallo-l");
    if (lines.length) {
      var out = [];
      for (var i = 0; i < lines.length; i++) out.push(lines[i].textContent);
      return out.join("\n");
    }
    return code.innerText;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var pres = document.querySelectorAll(".post-content pre");
    for (var i = 0; i < pres.length; i++) {
      (function (pre) {
        var code = pre.querySelector("code");
        if (!code) return;
        var lang = (code.getAttribute("data-lang") || "").trim();
        pre.setAttribute("data-lang", lang);
        pre.classList.add("copy-ready");

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "copy-btn";
        btn.setAttribute("aria-label", "کپی کردن کد");
        btn.textContent = "کپی";
        btn.addEventListener("click", function () {
          copyText(codeText(code), btn);
        });
        pre.appendChild(btn);
      })(pres[i]);
    }
  });
})();
