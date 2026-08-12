# Akademia Super Zdrowia — Zdrowe Rutyny

Responsywna aplikacja PWA dla dzieci w wieku 6–12 lat. Działa bez konta i serwera, a dane przechowuje wyłącznie lokalnie w IndexedDB. Po pierwszym pełnym uruchomieniu wersji produkcyjnej działa także offline.

## Uruchomienie

Wymagany jest Node.js 20.19+ lub 22.12+.

```bash
npm install
npm run dev
```

Vite pokaże adres serwera deweloperskiego, zwykle `http://localhost:5173/`.

## Testy i wersja produkcyjna

```bash
npm run test
npm run build
npm run preview
```

Podgląd produkcyjny jest zwykle dostępny pod `http://localhost:4173/`. To wersja właściwa do testowania Service Workera i instalacji PWA.

## Test działania offline

1. Uruchom `npm run build`, a następnie `npm run preview`.
2. Otwórz aplikację i poczekaj, aż plansze zostaną wyświetlone.
3. W narzędziach deweloperskich przeglądarki otwórz **Application → Service Workers** i sprawdź, czy Service Worker jest aktywny.
4. W zakładce **Network** włącz **Offline**, a następnie odśwież stronę.
5. Aplikacja, wszystkie plansze i zapisane dane powinny pozostać dostępne; pojawi się komunikat „Działasz offline”.

## Instalacja na Windows

1. Otwórz produkcyjną aplikację w Microsoft Edge albo Google Chrome.
2. W Edge kliknij **… → Aplikacje → Zainstaluj Akademia Super Zdrowia**. W Chrome kliknij ikonę instalacji po prawej stronie paska adresu lub **⋮ → Przesyłaj, zapisuj i udostępniaj → Zainstaluj stronę jako aplikację**.
3. Potwierdź instalację. Aplikacja uruchomi się w osobnym oknie bez standardowego paska przeglądarki.

## Instalacja na Androidzie

1. Otwórz aplikację w Chrome przez adres HTTPS.
2. Wybierz **⋮ → Zainstaluj aplikację** albo zaakceptuj komunikat „Dodaj do ekranu głównego”.
3. Potwierdź. Ikona „Zdrowe Rutyny” pojawi się na ekranie aplikacji i uruchomi aplikację w trybie standalone.

## Instalacja na iPhone

1. Otwórz adres HTTPS w Safari.
2. Dotknij **Udostępnij → Do ekranu początkowego → Dodaj**.
3. Uruchamiaj aplikację z nowej ikony. Otworzy się bez paska adresu Safari.

## Instalacja PWA na telefonie

Udostępnij produkcyjny build przez HTTPS (lokalny `localhost` jest wyjątkiem tylko na tym samym urządzeniu), otwórz aplikację w Chrome/Edge lub Safari i wybierz „Dodaj do ekranu głównego” / „Zainstaluj aplikację”. Manifest zawiera nazwę, kolory i ikony instalacyjne.

## Ilustracje

Kopie plansz znajdują się w `public/illustrations` pod nazwami `rutyna-01.png`–`rutyna-10.png`. Oryginalne PNG w katalogu głównym nie są modyfikowane.

Aby wymienić planszę bez zmiany komponentów, zastąp odpowiedni plik w `public/illustrations`, zachowując jego nazwę. Obraz jest pokazywany w całości przez `object-fit: contain`; aplikacja go nie kadruje ani nie przetwarza. Po zmianie wykonaj ponownie build, aby Service Worker umieścił nowy plik w cache.

## Dane i kopie zapasowe

Każdy dzień ma osobny wpis `YYYY-MM-DD` według lokalnej daty urządzenia. W strefie rodzica (przycisk trzeba przytrzymać przez 3 sekundy) można zmieniać aktywność i kolejność rutyn, eksportować/importować JSON oraz usunąć dane po dwóch potwierdzeniach.
