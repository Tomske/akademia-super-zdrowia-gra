# Akademia Super Zdrowia — hub gier + "Misja: Prawdziwa Energia" (v2)

Od 08.2026 to repo serwuje CALA subdomene gra.akademiasuperzdrowia.pl:

- `/` — hub serii gier (statyczna strona, kafelki do poszczegolnych gier)
- `/misja-energia/` — gra "Misja: Prawdziwa Energia" (przeniesiona z roota)
- `/rutyny/` — apka "Zdrowe Rutyny" (PWA React/Vite): ZBUDOWANY output, commitowany do repo
- `rutyny-src/` — zrodla apki Zdrowe Rutyny (Vite + React + vitest); NIE jest serwowane

Zdrowe Rutyny: po zmianie w `rutyny-src/` przebuduj i commituj output:
`cd rutyny-src && pnpm install && pnpm test && pnpm build` (build pisze do `../rutyny`).
Projekt Vercel jest czysto statyczny i NICZEGO nie buduje. Plansze rutyn: WebP 1400px
generowane skryptem `rutyny-src/scripts/convert-illustrations.mjs` z oryginalow PNG
w folderze klienta Hadron OS (`08-aplikacja rutyny/asz aplikacja/public/illustrations`).
Repo `Tomske/asz-rutyny` bylo krotko osobnym domem apki i jest do skasowania.

Gra: przegladarkowa PWA, mapa misji, 4 mini-gry + walka z Glutonem X, gwiazdki, zapis
postepu, nagroda = komiks czesc 1 (PDF). Bez logowania, bez reklam, bez zbierania danych.

- Live: https://gra.akademiasuperzdrowia.pl (Vercel, auto-deploy z brancha `main`)
- Uruchomienie lokalne: dowolny serwer statyczny w roocie repo (`npx serve .`),
  gra pod `/misja-energia/`. Uwaga: gra ma `<base href="/misja-energia/">`, wiec
  otwieranie `misja-energia/index.html` przez `file://` juz NIE dziala poprawnie.
- Instalacja jako aplikacja: przycisk "Zainstaluj aplikacje" (Android/desktop) lub
  Udostepnij -> "Dodaj do ekranu poczatkowego" (iOS). Po instalacji gra dziala offline.

## Migracja root -> /misja-energia/ (08.2026): rzeczy nieoczywiste

- `sw.js` w roocie to KILL-SWITCH, nie service worker huba: zastepuje starego SW gry
  (scope `/`, cache-first), czysci cache, wyrejestrowuje sie i przeladowuje karty.
  Hub nie rejestruje zadnego SW. Nie usuwac tego pliku, dopoki realnie istnieja
  urzadzenia ze stara instalacja (bez niego utkna na starym cache na zawsze).
- Hub w naglowku sprawdza `localStorage['asz_save_v1']` i przekierowuje do gry TYLKO
  uruchomienia standalone (zainstalowana ikonka PWA celujaca w `/`); zwykle wejscia
  przegladarka widza hub, takze na urzadzeniach, ktore graly.
- `trailingSlash: true` w vercel.json jest CELOWE: SW apki Rutyny ma scope `/rutyny/`,
  a przy trailingSlash false kanoniczny URL bylby `/rutyny` (poza scope) i offline by nie
  dzialalo. Gra i komiks maja `<base href="/misja-energia/">`, wiec slash im nie szkodzi.
- `vercel.json` przekierowuje stare publiczne URL-e: `/komiks`, `/manifest.webmanifest`,
  `/assets/*`, `/css/*`, `/js/*` -> `/misja-energia/...`. NIE dodawac redirectu dla
  `/sw.js` (przegladarki odrzucaja skrypty SW serwowane przez redirect).
- Gra ma `<base href="/misja-energia/">` w `index.html`, bo przy `trailingSlash: false`
  dokument laduje sie pod `/misja-energia` (bez slasha) i wzgledne sciezki bez base
  rozwiazywalyby sie od roota.

## Struktura gry (`misja-energia/`)

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
- `sw.js` + `manifest.webmanifest` - PWA gry (offline, instalacja; scope `/misja-energia/`)
- `assets/img/` - grafiki WebP (tla z gry v1, sceny i portrety z ebooka, itemy, sprite'y)
- `assets/komiks/` - komiks czesc 1 (nagroda po pokonaniu bossa)
- `assets/icons/`, `assets/fonts/` - ikony PWA, font Baloo 2 (licencja OFL; hub uzywa
  tych samych woff2)

## Aktualizacja

Po kazdej zmianie plikow GRY podbij `VERSION` w `misja-energia/sw.js` (inaczej
zainstalowane PWA beda trzymac stara wersje w cache). Hub nie ma SW, wiec zmiany
huba nie wymagaja niczego.

Zrodla grafik i pipeline konwersji: repo Hadron OS,
`clients/akademia-superzdrowia/05-gra/GAME-DESIGN.md`; plan tej migracji:
`clients/akademia-superzdrowia/05-gra/HUB-DESIGN.md`.

(c) Akademia Super Zdrowia / Consulting Blaszczynski. Kod i assety projektu partnerskiego.
