(() => {
  const KEYS = ["hideShorts", "readingTime", "catAds"];
  const saved = document.getElementById("saved");
  let hideTimer = null;

  function flashSaved() {
    try {
      saved.classList.add("show");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => saved.classList.remove("show"), 800);
    } catch {}
  }

  async function init() {
    try {
      const nns = window.__nns;
      const settings = await nns.get(KEYS);
      for (const key of KEYS) {
        const input = document.getElementById(`t-${key}`);
        if (!input) continue;
        input.checked = Boolean(settings[key]);
        input.addEventListener("change", async () => {
          try {
            await nns.set({ [key]: input.checked });
            flashSaved();
          } catch {}
        });
      }
    } catch {}
  }

  init();
})();
