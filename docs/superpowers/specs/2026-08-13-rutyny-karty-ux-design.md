# Zdrowe Rutyny: redesign kart rutyn (UX v3)

**Data:** 13.08.2026 · **Trigger:** feedback Tomka: "nie podoba mi sie ze trzeba kliknac aby sie
dana rutyna pokazala z wiekszym obrazkiem i te 3 checkboxy ponizej, duzo klikania i scrollowania,
na pewno to mozna zrobic ladniej, lepiej, bardziej user engaging/friendly."

## Diagnoza obecnego stanu

Karta rutyny (`RoutineCard.tsx`) jest zwijana: nagłówek (klik = rozwiń) + podsumowanie
(miniatura + polecenie + pasek postępu) + ukryta sekcja (obrazek DRUGI raz w pełnym rozmiarze,
3 checkboxy, wskazówka). Żeby odhaczyć jeden krok: klik w kartę, scroll przez wielki obrazek,
klik w checkbox. Przy 10 rutynach x 3 kroki to kilkadziesiąt klików i ekrany scrollowania.
Rozwinięta karta ma ~800 px wysokości, obrazek jest zdublowany.

## Rozważone warianty

**A. Karty zawsze otwarte (WYBRANE).** Zero rozwijania: kroki widoczne od razu jako duże
tapowalne chipy, ilustracja jako miniatura z lupką (tap = lightbox na pełny ekran), postęp jako
3 kropki, karta ukończona dostaje stan "Wykonana!" zamiast wskazówki. Na desktopie siatka 2
kolumny. Zalety: zero klików do odhaczenia, karta niższa niż dzisiejsza ROZWINIĘTA, ilustracje
zostają widoczne, małe ryzyko regresji. Wady: strona dłuższa niż lista samych zwiniętych
nagłówków (ale i tak każdą kartę trzeba było rozwijać, więc realny scroll spada).

**B. Tryb misji (wizard, jedna rutyna na ekran, swipe).** Najbardziej "gamified", ale duży
rework, gorszy dla rodzica (brak szybkiego przeglądu dnia), więcej klików żeby dojść do
konkretnej rutyny. Odrzucone teraz; do rozważenia jako osobny tryb w przyszłości.

**C. Kompaktowa checklista bez obrazków (obrazek tylko w lightbox).** Minimalny scroll, ale
ilustracje to główny asset produktu i główny nośnik "engaging" dla dzieci. Odrzucone.

## Design (wariant A)

### Karta (nowy layout, bez stanu open/close)

```
[ miniatura 🔍 ] [ 1 · rano                    ●●○ ]
[   (tap =    ] [ Zacznij od wody                 ]
[  lightbox)  ] [ Po przebudzeniu wypij...        ]
[ Wypiłem wodę rano.                        (chip) ]
[ Piłem spokojnie, małymi łykami.           (chip) ]
[ Przygotowałem wodę na później.            (chip) ]
[ 💡 Kropelka: Trzymaj wodę blisko...  /  ⭐ Wykonana! ]
```

- **Miniatura**: przycisk (aria-label "Powiększ planszę: <tytuł>"), `object-fit:contain` na
  jasnym tle (plansze są pionowe, crop odpada), ikona lupki w rogu jako affordance. Tap otwiera
  lightbox.
- **Kropki postępu** zamiast paska: 3 kropki przy nagłówku karty (wypełnione = zrobione kroki),
  `aria-label="X z 3 kroków"`. Pasek postępu całego dnia zostaje w hero bez zmian.
- **Kroki**: 3 chipy pełnej szerokości (min 52 px wysokości, cały wiersz klikalny, label+input
  checkbox jak dotąd, więc dostępność bez zmian), zaznaczenie = zielone tło chipa + pop animacja
  znacznika. Istniejące nagrody (dźwięk, "+1", celebracje) działają bez zmian.
- **Dół karty**: dopóki rutyna niepełna, jedna zwięzła linia wskazówki ("💡 Kropelka: ...");
  po 3/3 zamiast niej "⭐ Rutyna wykonana. Super!" + złota obwódka całej karty. Wskazówka znika,
  bo już niepotrzebna, a wymiana treści jest małą nagrodą samą w sobie.
- **Bez chevrona, bez aria-expanded, bez zdublowanego obrazka.** Komponent traci stan `open`,
  zostaje tylko lokalny stan lightboxa.

### Lightbox (nowy mały komponent `Lightbox.tsx`)

Overlay `position:fixed`, ciemne tło, plansza wyśrodkowana `max-height:92vh` `object-fit:contain`,
przycisk zamknięcia (X, 44 px) + zamykanie tapnięciem w tło i klawiszem Esc, `role="dialog"`
`aria-modal="true"`, focus na przycisku zamknięcia po otwarciu, blokada scrolla body na czas
otwarcia. Zero bibliotek.

### Siatka i szerokość

- `.routine-list`: mobile 1 kolumna; od 900 px `repeat(auto-fill, minmax(420px, 1fr))` = 2 kolumny
  na desktopie (mniej scrollowania, zgodne z feedbackiem "strony budowane za wąsko").
- `main`: `min(100% - 2rem, 1200px)` zamiast 1000 px.

### Pora dnia

Wartości `poraDnia` to sytuacyjne etykiety ("po dłuższym siedzeniu", "przed nauką"), nie sloty
czasowe, więc BEZ grupowania sekcjami; etykieta zostaje na karcie jako "N · pora".

### Poza zakresem

Tryb misji/wizard (wariant B), zmiany w Historii i Strefie Rodzica, jakiekolwiek zmiany danych.

## Testy

- Nowy `RoutineCard.test.tsx`: 3 checkboxy widoczne bez żadnego rozwijania; klik w krok woła
  `onCheck(index, true)`; klik w miniaturę otwiera lightbox, Esc/X zamyka; przy 3/3 badge
  "Wykonana" widoczny, wskazówka ukryta.
- `App.test.tsx`: usunąć krok rozwijania karty (checkboxy są od razu).
- Reszta suity bez zmian funkcjonalnych.
