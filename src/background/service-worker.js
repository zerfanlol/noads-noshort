const api = typeof browser !== "undefined" && browser && browser.storage ? browser : chrome;

const DEFAULTS = { hideShorts: true, readingTime: true, catAds: false };

api.runtime.onInstalled.addListener(async () => {
  try {
    const current = await api.storage.sync.get(Object.keys(DEFAULTS));
    const missing = {};
    for (const key of Object.keys(DEFAULTS)) {
      if (current[key] === undefined) missing[key] = DEFAULTS[key];
    }
    if (Object.keys(missing).length > 0) {
      await api.storage.sync.set(missing);
    }
  } catch {}
});
