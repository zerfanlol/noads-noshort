(() => {
  const nns = window.__nns;
  if (!nns || nns.modules.readingTime) return;

  const BADGE_ID = "nns-reading-time";
  const WORDS_PER_MINUTE = 200;
  const MIN_WORDS = 100;
  const BADGE_STYLE =
    "position:fixed;top:16px;right:16px;z-index:2147483647;padding:6px 10px;" +
    "border-radius:6px;background:rgba(0,0,0,0.75);color:#fff;font:13px system-ui;" +
    "pointer-events:none";

  let observer = null;
  let timer = null;

  function countWords(text) {
    const matches = text.match(/\S+/g);
    return matches ? matches.length : 0;
  }

  function largest(list) {
    let best = null;
    let bestLength = -1;
    for (const el of list) {
      const length = el.textContent.length;
      if (length > bestLength) {
        best = el;
        bestLength = length;
      }
    }
    return best;
  }

  function findContainer() {
    const articles = document.querySelectorAll("article");
    if (articles.length > 0) return largest(articles);

    const main = document.querySelector("main");
    if (main) return main;

    // У внешней обёртки текста всегда больше всех, поэтому выбираем div
    // с максимальным объёмом текста в собственных абзацах.
    let best = null;
    let bestScore = 0;
    for (const div of document.querySelectorAll("div")) {
      let score = 0;
      for (const child of div.children) {
        if (child.localName === "p") score += child.textContent.length;
      }
      if (score > bestScore) {
        best = div;
        bestScore = score;
      }
    }
    return best;
  }

  function showReadingTime() {
    try {
      const container = findContainer();
      const words = container ? countWords(container.innerText || container.textContent || "") : 0;
      let badge = document.getElementById(BADGE_ID);

      if (words < MIN_WORDS) {
        if (badge) badge.remove();
        return;
      }

      const text = `~${Math.ceil(words / WORDS_PER_MINUTE)} мин чтения`;
      if (badge) {
        if (badge.textContent !== text) badge.textContent = text;
        return;
      }

      badge = document.createElement("div");
      badge.id = BADGE_ID;
      badge.style.cssText = BADGE_STYLE;
      badge.textContent = text;
      (document.body || document.documentElement).appendChild(badge);
    } catch {}
  }

  function schedule(records) {
    try {
      const badge = document.getElementById(BADGE_ID);
      if (badge && records.every((record) => badge.contains(record.target))) return;
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        showReadingTime();
      }, 1500);
    } catch {}
  }

  function enable() {
    try {
      if (observer) return;
      showReadingTime();
      observer = new MutationObserver(schedule);
      observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    } catch {}
  }

  function disable() {
    try {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      const badge = document.getElementById(BADGE_ID);
      if (badge) badge.remove();
    } catch {}
  }

  nns.modules.readingTime = { enable, disable };
})();
