(() => {
  if (window.__nns) return;

  const DEFAULTS = Object.freeze({ hideShorts: true, readingTime: true, catAds: false });

  const ext =
    typeof browser !== "undefined" && browser && browser.storage
      ? browser
      : typeof chrome !== "undefined"
        ? chrome
        : null;

  const area = () => (ext && ext.storage && ext.storage.sync) || null;

  async function get(keys) {
    const list = keys == null ? Object.keys(DEFAULTS) : [].concat(keys);
    const query = {};
    for (const key of list) query[key] = DEFAULTS[key];
    try {
      const storage = area();
      if (!storage) return query;
      const result = await storage.get(query);
      return { ...query, ...result };
    } catch {
      return query;
    }
  }

  async function set(obj) {
    try {
      const storage = area();
      if (!storage) return false;
      await storage.set(obj);
      return true;
    } catch {
      return false;
    }
  }

  function onChange(cb) {
    try {
      ext.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== "sync") return;
        const out = {};
        let changed = false;
        for (const key of Object.keys(DEFAULTS)) {
          if (key in changes) {
            out[key] = changes[key].newValue;
            changed = true;
          }
        }
        if (!changed) return;
        try {
          cb(out);
        } catch {}
      });
    } catch {}
  }

  window.__nns = { DEFAULTS, get, set, onChange, modules: {} };
})();
