# Kraina Pamięci, świat gier pamięciowych w hubie gra.akademiasuperzdrowia.pl

Data: 2026-08-13. Status: ZBUDOWANE NA BRANCHU `pamiec`, czeka na akcept Tomka przed merge do `main` (main = produkcja przez Vercel).

Sesja autonomiczna: pytania doprecyzowujące z procesu brainstormingu zostały rozstrzygnięte
decyzjami własnymi (zgodnie z globalną zasadą "internal work: make judgment calls"). Wszystkie
decyzje są spisane niżej, każdą można cofnąć przed merge.

## Cel

Prośba Tomka: mini-gra z Misji: Prawdziwa Energia, w której trzeba powtórzyć pattern
(Misja 3 "Wieczorny Rytuał", `misja-energia/js/game-sleep.js`), jest dobra na trening pamięci.
Zrobić z tego pełną grę i podobne gry, dodać do huba, z rysunkami, ikonkami, planszami,
levelami lub całym światem, tak aby dzieci trenowały pamięć i mogły zapisać wyniki.

## Kształt rozwiązania (wybrany wariant)

Jedna nowa aplikacja "Kraina Pamięci" pod `gra.akademiasuperzdrowia.pl/pamiec/`, jako trzeci
kafelek huba. Przewodnikiem jest Mózguś (postać-mózg z ebooka, idealny patron treningu pamięci).

Rozważone warianty:
1. Osobna aplikacja-świat z kilkoma grami pamięciowymi i mapą poziomów (WYBRANY).
2. Dobudowanie trybu "trening pamięci" wewnątrz Misji: Prawdziwa Energia. Odrzucone: miesza
   fabułę misji z treningiem, utrudnia zapis wyników per dziecko i rozbudowę o kolejne gry.
3. Trzy osobne małe gry jako trzy kafelki huba. Odrzucone: brak wspólnego zapisu wyników,
   brak poczucia "świata" i progresji, zaśmieca hub.

## Świat i gry

Jedna przewijana mapa świata z trzema krainami po 5 poziomów oraz finałowym Turniejem:

1. **Wieża Wzorów** (typ `wzory`, mechanika Simon jak w Rytuale Senka): kafelki podświetlają
   się w kolejności, dziecko powtarza. Poziomy zwiększają liczbę kafelków (4 do 6), długość
   sekwencji (do 8) i tempo.
2. **Ogród Par** (typ `pary`, klasyczne memory): odkrywanie par kart z ilustracjami itemów
   i bohaterów ASZ. Poziomy od 3 do 8 par, gwiazdki zależą od liczby ruchów.
3. **Jaskinia Zniknięć** (typ `znikanie`): plansza przedmiotów do zapamiętania, po chwili
   jeden znika, dziecko wskazuje który. Poziomy zwiększają liczbę przedmiotów (3 do 8)
   i skracają czas podglądu. Każdy poziom to 3 rundy.
4. **Turniej Mistrza Pamięci** (typ `turniej`): tryb bez końca na mechanice wzorów, sekwencja
   rośnie aż do porażki, zapisywany jest rekord długości. Odznaki: Brązowy / Srebrny / Złoty
   Mistrz przy rekordzie 6 / 9 / 12. Odblokowany od 15 gwiazdek łącznie.

Razem 15 poziomów + turniej. Wszystkie trzy krainy otwarte od startu (dziecko wybiera, co
lubi), poziomy wewnątrz krainy odblokowywane po kolei (min. 1 gwiazdka na poprzednim).

## Punkty, gwiazdki, zapis wyników

- Gwiazdki 1-3 za poziom (wzory i znikanie: wg pozostałych żyć-iskier; pary: wg liczby ruchów).
- Punkty Pamięci: wynik poziomu dolicza się do sumy gracza, najlepszy wynik poziomu zapamiętany.
- Zapis: localStorage, klucz `asz_pamiec_v1`, bez kont i bez wysyłania danych (jak w Misji).
- Profile graczy jak w Zdrowych Rutynach, ale lżejsze: imię + kolorowy awatar, przełącznik
  w nagłówku, wyniki per gracz. Usuwanie gracza za potwierdzeniem. Ekran "Kto trenuje?" przy
  pierwszym uruchomieniu.
- Suma punktów i rekord turnieju nadają się do screenshotowych konkursów FB (ten sam format
  co planowany konkurs punktów z Rutyn).

## Grafika i plansze

- Ilustracje: ponownie użyte istniejące WebP z `/misja-energia/assets/img/` (9 itemów,
  7 portretów bohaterów, Gluton). Zero nowych binariów w repo, spójny brand.
- Ikony, herb, emblematy krain, gwiazdki, kłódki, ścieżka mapy: inline SVG.
- Kolory i typografia jak hub i Misja: granat `#131f4a` / `#14213D`, złoto `#FFC300`,
  nagłówki Baloo 2 (woff2 z `/misja-energia/assets/fonts/`).
- Krainy różnią się tłem (gradienty + dekoracje), mapa jest jednym pionowym światem.

## Technika

- Vanilla JS bez bundlera, wzorzec z Misji: globalny namespace `ASZP`, pliki
  `pamiec/js/{data,save,audio,ui,main,game-wzory,game-pary,game-znikanie,game-turniej}.js`,
  jeden `pamiec/index.html`, style w `pamiec/css/pamiec.css`. Deploy = commit (Vercel static).
- Kontrakt gry jak w Misji: `ASZP.games[typ].start(api)` z `api = { arena, level, audio,
  status(), lives(), progress(), onEnd({success, stars, score}) }`, zwraca `{ stop() }`.
- Dźwięki syntetyczne WebAudio (adaptacja `misja-energia/js/audio.js`), przełącznik
  zapamiętywany w zapisie.
- Bez service workera w v1 (root `sw.js` to kill-switch starej gry, nie dotyka `/pamiec/`;
  unikamy problemów z cache przy iteracjach). PWA-instalację można dodać później.
- Dostępność: elementy klikalne to `<button>`, focus-visible w złocie, `prefers-reduced-motion`
  wyłącza animacje ozdobne, obrazki dekoracyjne z pustym `alt`.
- Hub `index.html`: trzeci kafelek z portretem Mózgusia, tekst bez zbierania danych bez zmian.

## Poziomy (konfiguracja startowa, do strojenia po testach z dziećmi)

- Wzory: W1 4 kafelki, rundy 2-4; W2 4 kafelki, rundy 3-5; W3 5 kafelków, rundy 3-6;
  W4 5 kafelków, rundy 4-7; W5 6 kafelków, rundy 4-8. 3 iskry, błąd powtarza sekwencję.
- Pary: 3, 4, 6, 8, 8 par (P5 miesza itemy i portrety). 3 gwiazdki przy ruchach
  do 160 procent liczby par w zaokrągleniu w górę plus 1, 2 gwiazdki do 250 procent.
- Znikanie: przedmioty 3/4/5/6/8, podgląd 6/6/5/5/4 s, po 3 rundy, 3 iskry.
- Turniej: 6 kafelków, start od sekwencji 3, rekord = najdłuższa powtórzona sekwencja.

## Poza zakresem v1

- Konkurs FB (jak przy Rutynach: tylko UI wyniku jest gotowe, konkurs to decyzja produktowa).
- PWA / offline dla `/pamiec/`.
- Przenoszenie profili między Rutynami a Krainą Pamięci (osobne zapisy, świadomie).
- Nowe ilustracje AI (najpierw akcept kierunku, potem ewentualnie dorobimy dedykowane grafiki
  krain: wieża, ogród, jaskinia).
