(() => {
  const nns = window.__nns;
  if (!nns || !/^https?:$/.test(location.protocol)) return;

  const isYouTube = /(^|\.)youtube\.com$/i.test(location.hostname);

  function toggle(module, enabled) {
    try {
      if (!module) return;
      if (enabled) {
        module.enable();
      } else {
        module.disable();
      }
    } catch {}
  }

  function apply(settings) {
    if (isYouTube) {
      toggle(nns.modules.shorts, settings.hideShorts);
      return;
    }
    toggle(nns.modules.readingTime, settings.readingTime);
    toggle(nns.modules.catAds, settings.catAds);
  }

  async function refresh() {
    try {
      apply(await nns.get());
    } catch {}
  }

  refresh();
  nns.onChange(refresh);
})();
