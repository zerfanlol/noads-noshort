(() => {
  const nns = window.__nns;
  if (!nns || nns.modules.catAds) return;

  const MAX_REPLACEMENTS = 20;
  const MIN_WIDTH = 100;
  const MIN_HEIGHT = 50;
  const INTERVAL_MS = 2000;
  const WORDS = /\b(?:ad|ads|advert|banner|sponsored|promo)\b/i;
  const TERMS = ["ad", "advert", "banner", "sponsored", "promo"];
  const ATTRIBUTES = ["class", "id", "aria-label"];
  const SELECTOR = ATTRIBUTES.flatMap((attr) => TERMS.map((term) => `[${attr}*="${term}" i]`))
    .concat("iframe[src]")
    .join(",");

  // id -> данные для восстановления; в dataset элемента лежит только id.
  const store = new Map();
  let sequence = 0;
  let timer = null;

  function matches(el) {
    if (el.id && el.id.startsWith("nns-")) return false;
    const parts = [el.getAttribute("class"), el.id, el.getAttribute("aria-label")];
    if (el.localName === "iframe") parts.push(el.getAttribute("src"));
    return parts.some((part) => part && WORDS.test(part));
  }

  function createCat(width, height, id) {
    const img = document.createElement("img");
    img.src = `https://cataas.com/cat?width=${width}&height=${height}&r=${id}${Date.now().toString(36)}`;
    img.alt = "";
    img.decoding = "async";
    img.style.cssText = "width:100%;height:100%;object-fit:cover";
    return img;
  }

  function replace(el) {
    const rect = el.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    if (width < MIN_WIDTH || height < MIN_HEIGHT) return;
    if (width * height > window.innerWidth * window.innerHeight * 0.6) return;
    if (el.localName !== "iframe" && el.querySelector("main, article")) return;

    const id = String(++sequence);
    const img = createCat(width, height, id);

    if (el.localName === "iframe") {
      const wrap = document.createElement("div");
      wrap.style.cssText = `display:block;width:${width}px;height:${height}px;overflow:hidden`;
      wrap.appendChild(img);
      store.set(id, {
        el,
        wrap,
        display: el.style.getPropertyValue("display"),
        priority: el.style.getPropertyPriority("display")
      });
      el.dataset.nnsReplaced = id;
      el.style.setProperty("display", "none", "important");
      el.insertAdjacentElement("afterend", wrap);
      return;
    }

    store.set(id, {
      el,
      nodes: Array.from(el.childNodes),
      style: el.getAttribute("style")
    });
    el.dataset.nnsReplaced = id;
    if (getComputedStyle(el).display === "inline") el.style.display = "inline-block";
    el.style.boxSizing = "border-box";
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.overflow = "hidden";
    el.replaceChildren(img);
  }

  function replaceAds() {
    try {
      if (document.hidden || store.size >= MAX_REPLACEMENTS) return;
      for (const el of document.querySelectorAll(SELECTOR)) {
        if (store.size >= MAX_REPLACEMENTS) break;
        if (!el.isConnected) continue;
        if (el === document.body || el === document.documentElement) continue;
        if (el.dataset.nnsReplaced) continue;
        if (el.closest('[id^="nns-"]')) continue;
        if (!matches(el)) continue;
        try {
          replace(el);
        } catch {}
      }
    } catch {}
  }

  function restoreAll() {
    for (const record of store.values()) {
      try {
        if (record.wrap) {
          record.wrap.remove();
          if (record.display) {
            record.el.style.setProperty("display", record.display, record.priority);
          } else {
            record.el.style.removeProperty("display");
          }
        } else {
          record.el.replaceChildren(...record.nodes);
          if (record.style === null) {
            record.el.removeAttribute("style");
          } else {
            record.el.setAttribute("style", record.style);
          }
        }
        delete record.el.dataset.nnsReplaced;
      } catch {}
    }
    store.clear();
  }

  function enable() {
    try {
      if (timer) return;
      replaceAds();
      timer = setInterval(replaceAds, INTERVAL_MS);
    } catch {}
  }

  function disable() {
    try {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      restoreAll();
    } catch {}
  }

  nns.modules.catAds = { enable, disable };
})();
