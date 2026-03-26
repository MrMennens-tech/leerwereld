# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LeerZone** (`leerzone.nl`) is a stimulus-reduced educational game platform for children in special primary education (SBO). It is a vanilla JavaScript PWA with no build system, no npm, no bundler — all files are served directly from the root.

**Language**: All UI text, variable names, comments, and commit messages are in **Dutch**.

## Development

There is no build step. Open `index.html` directly in a browser or serve it with any static server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

No linting, no test suite. Manual browser testing is the only verification method.

**PWA cache**: When making changes, the service worker will serve cached old files. Force-refresh with `Ctrl+Shift+R` or open DevTools → Application → Service Workers → "Skip waiting". The cache name is `leerzone-v4` in `service-worker.js` — bump it when deploying breaking changes.

## Architecture

Everything lives in the root directory. The entry point is `index.html`, which loads `app.js` as an ES module (`type="module"`).

### Module structure

| File | Role |
|---|---|
| `app.js` | All core logic: `Settings`, `Navigation`, `TTS`, `SoundController`, `ThemeSelector`, `GameController`, `Games`, `ButtonMapping`, `Accessibility`, `PWAInstaller`, `initApp()` |
| `themes.js` | Built-in theme definitions (`sea`, `jungle`, `farm`, `space`, `winter`, `halloween`, `sports`, `music`, `rainbow`) |
| `theme-store.js` | `CustomThemeStore` — CRUD for user-created themes in `localStorage` |
| `theme-editor.js` | Full theme editor UI: emoji picker, icon upload, background builder, per-item audio (builtin/Mixkit/record/upload) |
| `mixkit-sounds.js` | Curated list of Mixkit sound IDs with verified URLs. Format: `https://assets.mixkit.co/active_storage/sfx/{id}/{id}-preview.mp3` |
| `audio-engines.js` | `jsfxr` (8-bit synth), `AudioEngine` (Web Audio API synthesis), `createSoundController()` |
| `service-worker.js` | PWA offline caching |
| `styles.css` | All styles — no preprocessor, uses CSS custom properties for theming |

### Key architectural patterns

**`Utils.themes` is a getter**, not a static object. It calls `CustomThemeStore.getAllThemes()` which merges built-in themes with user-created ones from `localStorage`. Always access themes via `Utils.themes[id]` or `CustomThemeStore.getAllThemes()`.

**Custom sound playback** is done by monkey-patching `SoundController.play()` after factory creation (in `app.js` lines ~224–244). The override checks `SoundController.customAudio[soundName]`; if found it plays a Mixkit URL or base64 data URI, otherwise falls through to the original synthesizer.

**Navigation** uses named view IDs. All `.view` divs in the HTML are hidden; `Navigation.showView(viewId)` shows the target and hides others. `ThemeEditor.init()` receives a `navigateFn` callback to break circular dependency.

**Cross-module events** use `CustomEvent` on `document`:
- `leerzone:themes-changed` — fired after saving/deleting/importing a custom theme; causes `ThemeSelector` to re-render
- `leerzone:play-sound` — fired with `detail = soundName`; `SoundController` listens and plays

**Theme items** have the shape `{ i: emoji/dataUrl, n: name, s: soundKey, _audio?: audioData }`. When `_audio` is present and `s` starts with `lz_custom_item_N`, the custom audio overrides the synthesizer.

**Audio data structure** for custom themes:
- Builtin: `{ type: 'builtin', value: 'plons' }`
- Mixkit: `{ type: 'mixkit', id: '78' }` — use `MixkitSounds.getUrl(id)` to resolve
- Custom (recorded/uploaded): `{ type: 'custom', data: 'data:audio/...' }`

### Games

All games live in `app.js` under the `Games` object, keyed by game ID:
- `interactive-scene` — Ontdek en Tik (tap appearing items)
- `moving-targets` — Beweeg en Raak (tap moving targets)
- `same-or-different` — Hetzelfde of Anders (match/reject)
- `counting` — Tellen
- `math` — Rekenen
- `memory` — Geheugen (memory card game)

Each game implements `create(level)` and `destroy()`.

### Accessibility features

`Accessibility` object in `app.js` handles three input modes: touch, one-button scan, and two-button scan. `ButtonMapping` maps keyboard/gamepad buttons to button1/button2 actions. Scanning uses `setInterval`-based highlight cycling through `.scannable` elements.

### Mixkit sounds

IDs must be verified via F12 on mixkit.co — inspect a play button and read `data-audio-player-item-id-value`. The only user-confirmed ID is `54` (medium angry dog bark). All other IDs in `mixkit-sounds.js` should be treated as unverified until tested. Do not invent IDs.
