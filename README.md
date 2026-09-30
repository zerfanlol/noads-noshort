# noads-noshort

Минималистичное расширение для браузера: скрывает YouTube Shorts, показывает время чтения и заменяет рекламные баннеры котами.

![License](https://img.shields.io/badge/license-MIT-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)

![Screenshot](./docs/screenshot.png)

## Возможности

**Hide YouTube Shorts** — убирает раздел Shorts с главной, из подписок и боковой панели рекомендаций, а также пункт в левом меню.

**Reading Time** — добавляет на страницы статей небольшую плашку «~N мин чтения», считая по 200 слов в минуту.

**Cats instead of ads** — заменяет элементы, похожие на рекламу (ad, banner, sponsored и т. п.), случайными фотографиями котов.

## Установка

### Chrome / Edge / Brave
1. Скачайте последний релиз из раздела Releases и распакуйте архив.
2. Откройте chrome://extensions и включите режим разработчика.
3. Нажмите «Загрузить распакованное расширение» и выберите распакованную папку.

### Firefox
1. Откройте about:debugging#/runtime/this-firefox.
2. Нажмите «Загрузить временное дополнение» и выберите manifest.json.

## Разработка

Без сборки и зависимостей. Правьте файлы в src/ и перезагружайте расширение.

Настройки хранятся в chrome.storage.sync (в Firefox — browser.storage):

- hideShorts — по умолчанию true
- readingTime — по умолчанию true
- catAds — по умолчанию false

Чтобы вручную собрать zip для релиза:

```
zip -r noads-noshort.zip manifest.json src icons
```

Пуш тега v* запускает GitHub Action, который собирает и публикует релиз.

## Структура

```
manifest.json
src/content/    youtube-shorts, reading-time, cat-ads, injector
src/popup/      popup.html, popup.css, popup.js
src/background/ service worker
src/shared/     обёртка над storage
icons/          SVG-иконки
```

## Лицензия

MIT — см. файл LICENSE.
