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

REWIZJA 1 po feedbacku Tomka (2026-08-13): krainy nie są nazwane od mechanik, tylko od
tematów zdrowego stylu życia, każda z bohaterem-gospodarzem z ebooka.

REWIZJA 2 po feedbacku Tomka (2026-08-13, "trochę mało, jedna kraina dla każdej postaci,
ładniejsze grafiki"): świat rozbudowany do SZEŚCIU krain, po jednej dla każdego bohatera
(Mózguś jako przewodnik prowadzi Turniej). Wszystkie kafelki poza Krainą Witamin dostały
generowane ilustracje (Higgsfield, model Recraft V4.1, jeden styl: malarska ilustracja
dziecięca, ciepłe złote światło, granatowe tło #1B2A5E, kwadratowe kafle 1:1, konwersja
do WebP 512px w `pamiec/assets/img/`, ~45 plików po ok. 15 KB). Proste SVG buźki i ikony
kreskowe z Rewizji 1 zostały zastąpione ilustracjami.

Jedna przewijana mapa świata, "dzień z Akademią od rana do wieczora", 6 krain po 5 poziomów
oraz finałowy Turniej:

1. **Kraina Energii** (Energuś, typ `znikanie`): plecak pełen prawdziwej energii, Gluton
   podkrada zapasy. 9 ilustracji: owsianka, banan, orzechy, jogurt, kanapka, miód, poranne
   słońce, spacer, pełna bateria.
2. **Kraina Witamin** (Witaminka, typ `znikanie`): stół z jedzeniem, ilustracje itemów
   z Misji (jedyny zestaw wielokrotnego użytku, już malarski).
3. **Kraina Kropelki** (Kropelka, typ `pary`): pary tego, co nawadnia. 10 ilustracji:
   szklanka wody, bidon, arbuz, ogórek, pomarańcza, zupa, mleko, kompot, ziołowa herbatka,
   kokos.
4. **Kraina Ruchu** (Sprintix, typ `wzory`): tor przeszkód Sprintixa do powtórzenia.
   8 ilustracji: skakanka, piłka, rower, hulajnoga, trampolina, buty sportowe, pływanie,
   latawiec.
5. **Kraina Emocji** (Uśmiechanka, typ `pary`): pary takich samych emocji, nauka ich
   nazywania. 10 ilustrowanych buziek: radość, smutek, złość, strach, spokój, zdziwienie,
   zmęczenie, miłość, nieśmiałość, duma.
6. **Kraina Snu** (Senek, typ `wzory`, mechanika z Rytuału Senka): wieczorny rytuał.
   8 ilustracji: odłóż telefon, umyj zęby, kąpiel, piżama, poczytaj, przygaś światło,
   przytulanka, śpij smacznie.
7. **Turniej Mistrza Pamięci** (Mózguś, typ `turniej`): tryb bez końca, kafelki losowane
   ze WSZYSTKICH krain (54 treści), rekord długości sekwencji, odznaki Brązowy / Srebrny /
   Złoty Mistrz przy 6 / 9 / 12. Odblokowany od 24 gwiazdek łącznie (z 90).

Razem 30 poziomów + turniej. Wszystkie krainy otwarte od startu, poziomy wewnątrz krainy
odblokowywane po kolei (min. 1 gwiazdka na poprzednim). Na mapie każda kraina ma portret
gospodarza i własny kolor tła (bursztyn energii, zieleń witamin, błękit kropelki, pomarańcz
ruchu, róż emocji, fiolet snu), turniej ma złote trofeum. Mechaniki: po dwie krainy na
mechanikę (znikanie x2, pary x2, wzory x2).

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

## Poziomy (konfiguracja startowa po rewizji, do strojenia po testach z dziećmi)

- Kraina Snu (wzory): W1 4 kafelki, rundy 2-4; W2 4 kafelki, rundy 3-5; W3 5 kafelków,
  rundy 3-6; W4 5 kafelków, rundy 4-7; W5 6 kafelków, rundy 4-8. 3 iskry, błąd powtarza
  sekwencję.
- Kraina Emocji (pary): 3, 4, 6, 8, 10 par z puli 10 buziek. 3 gwiazdki przy ruchach
  do 160 procent liczby par w zaokrągleniu w górę plus 1, 2 gwiazdki do 250 procent.
- Kraina Witamin (znikanie): przedmioty 3/4/5/6/6, podgląd 6/5/5/4/3 s, rundy 3/3/3/3/4,
  tasowanie od poziomu 3, opcje odpowiedzi 4, 3 iskry. Pula 9 itemów ogranicza planszę
  do 6 przy 4 opcjach (dystraktory muszą być spoza planszy).
- Turniej: 6 kafelków z połączonej puli 27 treści, start od sekwencji 3, rekord =
  najdłuższa powtórzona sekwencja.

## Rewizja 3: portrety gospodarzy z plakatów A3 (2026-08-13)

Feedback Tomka: wygenerowane portrety gospodarzy (ciepłe, ale płaskie ilustracje z tej samej
partii co kafelki) wyglądały "smutno" na tle nowych plakatów promocyjnych A3
(`OS/clients/akademia-superzdrowia/04-website/plakaty/plakaty format a3/`), które mają dużo
bardziej dynamiczny, komiksowy/superbohaterski styl (ChatGPT, ostre kontury, świecące tła,
akcja). Portrety siedmiu gospodarzy (Mózguś, Energuś, Witaminka, Senek, Kropelka, Sprintix,
Uśmiechanka) zostały wycięte z tych plakatów (kadr biustu 640x640, WebP) i zastąpiły
generowane portrety wszędzie w Krainie Pamięci: karty krain na mapie (`ASZP.CHARS`), ekran
wyboru gracza, ekran wyniku, oraz kafelek Krainy Pamięci w hubie. Tło z poświaty/efektów
plakatu zostało celowo zachowane (nie przycinane do samej twarzy na czystym tle) bo koloruje
się zgodnie z tematem krainy i wygląda jak mały medalion, nie sztuczna naklejka. Ósma postać
z plakatów, Doktor Bańka (higiena), nie ma odpowiadającej krainy w v1, świadomie pominięta
(potencjalna 7. kraina na przyszłość). Tile-content (jedzenie, emocje, itd.) NIE zostało
tknięte, zostaje przy generowanym stylu Recraft z Rewizji 2.

## Rewizja 4: siódma kraina, Doktor Bańka / Higiena (2026-08-13)

Tomasz zauważył ósmą postać na plakatach A3, Doktora Bańkę (temat: higiena i profilaktyka),
i poprosił o dodanie jej krainy. **Kraina Higieny**, gospodarz Doktor Bańka, mechanika `pary`
(wybrana zamiast `wzory`, żeby nie powielać koncepcji "sekwencja rytuału" z Krainy Snu; też
wyrównuje bilans mechanik do pary=3, znikanie=2, wzory=2). Wstawiona jako 2. kraina w kolejności
mapy (po Energii, przed Witaminami: rano dziecko najpierw się myje, potem je). 10 kafelków
(mydło, żel do dezynfekcji, ręcznik, grzebień, chusteczki, plaster, szampon, bańki mydlane,
termometr, apteczka), wygenerowane tym samym Recraft V4.1 w tym samym stylu co pozostałe
kafelki. Portret Doktora Bańki wycięty z plakatu tak samo jak pozostałych siedmiu gospodarzy.
5 poziomów (h1-h5, 3/4/6/8/10 par), razem 35 poziomów + turniej. Próg turnieju podniesiony
proporcjonalnie z 24/90 do **30/105** gwiazdek. Turniej (`ASZP.ALL_KEYS`) automatycznie objął
też kafelki higieny, bez zmian w kodzie silnika.

## Poza zakresem v1

- Konkurs FB (jak przy Rutynach: tylko UI wyniku jest gotowe, konkurs to decyzja produktowa).
- PWA / offline dla `/pamiec/`.
- Przenoszenie profili między Rutynami a Krainą Pamięci (osobne zapisy, świadomie).
- Nowe ilustracje AI (najpierw akcept kierunku, potem ewentualnie dorobimy dedykowane grafiki
  krain: wieża, ogród, jaskinia).
