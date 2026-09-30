# noads-noshort

Minimal browser extension that hides YouTube Shorts, shows reading time, and replaces ad banners with cats.

![License](https://img.shields.io/badge/license-MIT-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)

![Screenshot](./docs/screenshot.png)

## Features

**Hide YouTube Shorts** — removes the Shorts shelf from homepage, subscriptions, and sidebar, plus the menu entry.

**Reading Time** — injects a small "~N min read" badge on article pages, calculated at 200 words/min.

**Cats instead of ads** — swaps elements matching ad/banner/sponsored patterns for random cat photos.

## Install

### Chrome / Edge / Brave
1. Download the latest release from Releases and unzip.
2. Open chrome://extensions and enable Developer mode.
3. Click "Load unpacked" and select the unzipped folder.

### Firefox
1. Open about:debugging#/runtime/this-firefox.
2. Click "Load Temporary Add-on" and select manifest.json.

## Development

No build step, no dependencies. Edit files in src/ and reload the extension.

Settings are stored in chrome.storage.sync (browser.storage on Firefox):

- hideShorts — default true
- readingTime — default true
- catAds — default false

To create a release zip manually:

```
zip -r noads-noshort.zip manifest.json src icons
```

Pushing a tag v* triggers the GitHub Action that builds and publishes a release.

## Structure

```
manifest.json
src/content/    youtube-shorts, reading-time, cat-ads, injector
src/popup/      popup.html, popup.css, popup.js
src/background/ service worker
src/shared/     storage wrapper
icons/          SVG icons
```

## License

MIT — see LICENSE.
