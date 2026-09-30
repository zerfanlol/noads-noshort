(() => {
  const nns = window.__nns;
  if (!nns || nns.modules.shorts) return;

  const SELECTOR = [
    "ytd-rich-shelf-renderer",
    "ytd-guide-entry-renderer",
    "ytd-mini-guide-entry-renderer",
    "ytd-reel-shelf-renderer",
    "ytd-reel-video-renderer"
  ].join(",");

  let observer = null;
  let timer = null;

  function isShorts(el) {
    switch (el.localName) {
      case "ytd-rich-shelf-renderer": {
        const title = el.getAttribute("title") || "";
        const label = el.getAttribute("aria-label") || "";
        return (
          title === "Shorts" ||
          label.includes("Shorts") ||
          el.hasAttribute("is-shorts") ||
          !!el.querySelector('a[href^="/shorts/"]')
        );
      }
      case "ytd-guide-entry-renderer":
      case "ytd-mini-guide-entry-renderer":
        return !!el.querySelector('a[href^="/shorts"]');
      default:
        return true;
    }
  }

  function hide(el) {
    const wrapper =
      el.localName === "ytd-rich-shelf-renderer" || el.localName === "ytd-reel-shelf-renderer"
        ? el.closest("ytd-rich-section-renderer")
        : null;
    const target = wrapper || el;
    if (target.dataset.nnsHidden === "1") return;
    target.dataset.nnsDisplay = target.style.getPropertyValue("display");
    target.dataset.nnsPriority = target.style.getPropertyPriority("display");
    target.dataset.nnsHidden = "1";
    target.style.setProperty("display", "none", "important");
  }

  function hideShorts() {
    try {
      for (const el of document.querySelectorAll(SELECTOR)) {
        if (isShorts(el)) hide(el);
      }
    } catch {}
  }

  function restore() {
    try {
      for (const el of document.querySelectorAll('[data-nns-hidden="1"]')) {
        const display = el.dataset.nnsDisplay;
        if (display) {
          el.style.setProperty("display", display, el.dataset.nnsPriority || "");
        } else {
          el.style.removeProperty("display");
        }
        delete el.dataset.nnsHidden;
        delete el.dataset.nnsDisplay;
        delete el.dataset.nnsPriority;
      }
    } catch {}
  }

  function schedule() {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      hideShorts();
    }, 100);
  }

  function enable() {
    try {
      if (observer) return;
      hideShorts();
      observer = new MutationObserver(schedule);
      observer.observe(document.body, { subtree: true, childList: true });
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
      restore();
    } catch {}
  }

  nns.modules.shorts = { enable, disable };
})();
