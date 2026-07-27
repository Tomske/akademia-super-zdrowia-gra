# Akademia Super Zdrowia — gra "Misja: Prawdziwa Energia" (v2)

Gra przegladarkowa PWA: mapa misji, 4 mini-gry + walka z Glutonem X, gwiazdki, zapis postepu,
nagroda = komiks czesc 1 (PDF). Bez logowania, bez reklam, bez zbierania danych.

- Live: https://tomske.github.io/akademia-super-zdrowia-gra/ (GitHub Pages, branch `main`, root)
- Uruchomienie lokalne: dowolny serwer statyczny (`npx serve .`) albo podwojne klikniecie
  `index.html` (dziala, ale bez PWA/offline - service worker wymaga http/https).
- Instalacja jako aplikacja: przycisk "Zainstaluj aplikacje" (Android/desktop) lub
  Udostepnij -> "Dodaj do ekranu poczatkowego" (iOS). Po instalacji gra dziala offline.

## Struktura

- `index.html` + `css/game.css` - shell aplikacji (ekrany: tytul, fabula, mapa, gra, nagroda)
- `js/data.js` - postacie (kanon: ebook "Sekrety Bohaterow i Zloczyncow"), itemy, misje, dialogi
- `js/save.js` - zapis postepu w localStorage (`asz_save_v1`)
- `js/audio.js` - dzwieki syntetyczne WebAudio (zero plikow audio)
- `js/ui.js` - ekrany, mapa misji, dialogi, wyniki, konfetti, pomocnik canvas
- `js/game-catch.js` - misja 1: Zdrowa Stolowka (lapanie, Witaminka)
- `js/game-sort.js` - misja 2: Laboratorium (sortowanie, Mozgus)
- `js/game-sleep.js` - misja 3: Wieczorny Rytual (sekwencja pamieciowa, Senek)
- `js/game-run.js` - misja 4: Tor Przeszkod (runner, Energus)
- `js/game-boss.js` - misja 5: Pojedynek z Glutonem X (boss)
- `sw.js` + `manifest.webmanifest` - PWA (offline, instalacja)
- `assets/img/` - grafiki WebP (tla z gry v1, sceny i portrety z ebooka, itemy, sprite'y)
- `assets/komiks/` - komiks czesc 1 (nagroda po pokonaniu bossa)
- `assets/icons/`, `assets/fonts/` - ikony PWA, font Baloo 2 (licencja OFL)

## Aktualizacja

Po kazdej zmianie plikow podbij `VERSION` w `sw.js` (inaczej zainstalowane PWA
beda trzymac stara wersje w cache).

Zrodla grafik i pipeline konwersji: repo Hadron OS,
`clients/akademia-superzdrowia/05-gra/GAME-DESIGN.md`.

(c) Akademia Super Zdrowia / Consulting Blaszczynski. Kod i assety projektu partnerskiego.
