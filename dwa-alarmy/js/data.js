/* Dwa Alarmy: cała treść gry.
   Teksty odtworzone 1:1 z oryginału Andrzeja (SuperHealth.Runtime.dll), poprawione
   pod zasady pisowni Akademii: bez długich kresek, zakresy wieku przez dywiz. */
window.ASZD = window.ASZD || {};

ASZD.BOHATEROWIE = {
  energus: 'Energuś',
  mozgus: 'Mózguś',
  kropelka: 'Kropelka',
  senek: 'Senek',
  witaminka: 'Witaminka',
  sprintix: 'Sprintix',
  usmiechanka: 'Uśmiechanka'
};

/* mówca w dialogu -> plik portretu wycięty z ilustracji 02 */
ASZD.PORTRETY = {
  'ENERGUŚ': 'energus',
  'MÓZGUŚ': 'mozgus',
  'KROPELKA': 'kropelka',
  'SENEK': 'senek',
  'WITAMINKA': 'witaminka',
  'SPRINTIX': 'sprintix',
  'UŚMIECHANKA': 'usmiechanka'
};

ASZD.OSIAGNIECIA = {
  r1: 'Pierwszy krok',
  r2: 'Czujne oko',
  r3: 'Spokojny priorytet',
  r4: 'Tropiciel faktów',
  r5: 'Zgrany zespół',
  final: 'Bohater Akademii'
};

/* dialogi: osobne zestawy dla trybu 4-7 (krótsze) i 8-12 (pełne) */
ASZD.DIALOGI = {
  1: {
    maly: [
      ['KROPELKA', 'Mam wodę i spokojny plan. Bezpieczeństwo jest pierwsze.'],
      ['SENEK', 'Słyszę cichutkie: pik… pik… Może warto się zatrzymać?']
    ],
    duzy: [
      ['ENERGUŚ', 'Wracamy do Akademii po przerwie. Zanim uruchomimy laboratoria, sprawdźmy gotowość zespołu.'],
      ['KROPELKA', 'Zadbajmy o wodę, granice strefy i bezpieczną kolejność działań.'],
      ['SENEK', 'Z dolnego panelu wraca słaby impuls. Nie jest pilny, ale jest regularny.']
    ]
  },
  2: {
    maly: [
      ['SENEK', 'Cichy sygnał wraca w tym samym rytmie.'],
      ['MÓZGUŚ', 'Obserwuj spokojnie. Wybierz świecące punkty.']
    ],
    duzy: [
      ['SENEK', 'Impuls powtarza się co osiem sekund. Jest słaby, ale regularny.'],
      ['MÓZGUŚ', 'Nie zgadujmy. Porównaj jasność, rytm i położenie paneli.']
    ]
  },
  3: {
    maly: [
      ['ENERGUŚ', 'Czerwony alarm jest głośny, ale cichy sygnał nadal miga.'],
      ['KROPELKA', 'Wybierz spokojnie, co sprawdzimy najpierw.']
    ],
    duzy: [
      ['ENERGUŚ', 'Uruchomił się czerwony alarm w sali ruchu. Jednocześnie cichy impuls przyspieszył.'],
      ['KROPELKA', 'Najpierw oceńmy bezpieczeństwo ludzi, potem źródło sygnału, albo odwróćmy kolejność, jeśli dane to uzasadniają.']
    ]
  },
  4: {
    maly: [
      ['MÓZGUŚ', 'Fakt widzimy. Hipotezę możemy sprawdzić. Domysł nie ma jeszcze dowodów.']
    ],
    duzy: [
      ['MÓZGUŚ', 'Dane są użyteczne dopiero wtedy, gdy oddzielimy obserwacje od wyjaśnień.'],
      ['SENEK', 'Niepewność nie jest porażką. To znak, że trzeba sprawdzić więcej.']
    ]
  },
  5: {
    maly: [
      ['ENERGUŚ', 'Każdy bohater ma inne zadanie. Razem damy radę!'],
      ['UŚMIECHANKA', 'Najlepszy plan to taki, który rozumie cały zespół.']
    ],
    duzy: [
      ['ENERGUŚ', 'Mamy obserwacje, hipotezy i dwa alarmy. Teraz potrzebujemy wspólnego planu.'],
      ['UŚMIECHANKA', 'Rozdziel odpowiedzialność i upewnij się, że każdy zna swój krok.']
    ]
  }
};

ASZD.ROZDZIALY = [
  { nr: 1, tytul: 'Powrót do Akademii', obraz: 'r1-scena' },
  { nr: 2, tytul: 'Cichy sygnał', obraz: 'r2-scena' },
  { nr: 3, tytul: 'Dwa alarmy', obraz: 'r3-scena' },
  { nr: 4, tytul: 'Fakt, hipoteza, domysł', obraz: 'r4-scena' },
  { nr: 5, tytul: 'Wspólna decyzja', obraz: 'r5-scena' }
];

/* ---------- rozdział 1: hotspoty na ilustracji ---------- */
ASZD.R1 = {
  etykieta: 'Zadanie dotykowe • bez limitu czasu',
  tytul: 'Rozejrzyj się przed działaniem',
  opis: {
    duzy: 'Na ilustracji ukryte są trzy ważne wskazówki. Odszukaj Senka, bezpieczne przygotowanie Kropelki i panel z informacją.',
    maly: 'Dotknij dwóch miejsc, które pomogą zespołowi zatrzymać się i sprawdzić sytuację.'
  },
  licznik: 'Zebrane wskazówki',
  potrzeba: { maly: 2, duzy: 3 },
  powtorka: 'Ta wskazówka jest już zapisana. Poszukaj innego szczegółu ilustracji.',
  /* x/y w procentach obrazu, r = promień w procentach szerokości */
  punkty: [
    { id: 'senek', etykieta: 'SENEK', x: 51, y: 53, r: 13, dobry: true,
      tekst: 'Senek wygląda na zmęczonego i słyszy regularne „pik”. To ważna informacja od członka zespołu.' },
    { id: 'water', etykieta: 'WODA', x: 35, y: 79, r: 12, dobry: true,
      tekst: 'Kropelka przygotowała wodę i bezpieczną strefę. Zespół może działać bez pośpiechu.' },
    { id: 'panel', etykieta: 'PANEL', x: 6, y: 34, r: 12, dobry: true,
      tekst: 'Panel wskazuje kierunek i zamkniętą strefę. To fakt, który trzeba przekazać całej drużynie.' },
    { id: 'door', etykieta: 'DRZWI', x: 34, y: 32, r: 10, dobry: false,
      tekst: 'Same drzwi nie mówią, czy wejście jest bezpieczne. Najpierw spójrz na ludzi, przygotowanie i dane.' },
    { id: 'profesor', etykieta: 'PROFESOR', x: 53, y: 30, r: 8, dobry: false,
      tekst: 'Profesor czeka na wasze dane. On też ich jeszcze nie ma, więc nie zapyta go się o gotową odpowiedź.' },
    { id: 'remont', etykieta: 'REMONT', x: 80, y: 26, r: 10, dobry: false,
      tekst: 'Za taśmą trwa remont. Ciekawe, ale to nie mówi nic o tym, czego szuka zespół.' }
  ],
  decyzja: {
    etykieta: 'Decyzja • wykorzystaj zebrane wskazówki',
    tytul: 'Pierwszy wspólny krok',
    licznik: 'Wskazówki gotowe',
    naglowek: 'SYTUACJA',
    tresc: 'Zespół widzi panel, zna potrzeby Senka i ma przygotowaną bezpieczną strefę. Wybierz działanie, które wykorzystuje te informacje.',
    opcje: [
      { id: 'plan', tekst: 'ZATRZYMAJ • POWIEDZ, CO WIESZ • USTAL ROLE', dobry: true },
      { id: 'sam', tekst: 'BIEGNIJ SAM I NICZEGO NIE WYJAŚNIAJ', dobry: false },
      { id: 'strefa', tekst: 'WEJDŹ DO STREFY I DOPIERO POTEM SPRAWDŹ PANEL', dobry: false }
    ],
    zle: 'Ten krok pomija zebrane wskazówki. Zespół zatrzymuje się przed strefą, wybierz plan, który łączy obserwację, komunikację i role.',
    wniosek: 'Zespół najpierw zebrał informacje, a potem podzielił zadania. Wniosek: krótka obserwacja i jasna komunikacja pomagają działać bezpiecznie.'
  }
};

/* ---------- rozdział 2: rytm paneli ---------- */
ASZD.R2 = {
  etykieta: 'Minigra • obserwacja',
  tytul: 'Znajdź cichy sygnał',
  opis: {
    duzy: 'Sześć paneli wysyła sygnały, ale tylko trzy powtarzają ten sam rytm. Obserwuj pulsowanie i wybierz całą sekwencję.',
    maly: 'Obserwuj planszę. Dotknij panelu, który regularnie „oddycha” spokojnym światłem.'
  },
  licznik: 'Odnaleziony rytm',
  paneli: { maly: 4, duzy: 6 },
  rytmicznych: { maly: 2, duzy: 3 },
  status: {
    obserwuj: 'OBSERWUJ RYTM',
    zapisany: 'WZÓR ZAPISANY',
    potwierdz: 'POTWIERDŹ POWTARZAJĄCY SIĘ WZÓR'
  },
  powtorka: 'Ten panel jest już zapisany. Poszukaj następnego elementu tej samej sekwencji.',
  dobry: 'Ten impuls wraca w tym samym rytmie. Zapisaliśmy obserwację i możemy porównać ją z kolejnymi panelami.',
  zly: 'Ten panel błysnął tylko raz. Senek proponuje zwolnić, popatrzeć jeszcze chwilę i znaleźć regularność.',
  komplet: 'Cały rytm został odnaleziony. Sprawdź zaznaczone panele i potwierdź obserwację.',
  wniosek: 'Cichy sygnał został zauważony, bo zespół zwolnił i obserwował powtarzający się wzór. Wniosek: ciche potrzeby także zasługują na uwagę.'
};

/* ---------- rozdział 3: priorytety i weryfikacja ---------- */
ASZD.R3 = {
  etykieta: 'Minigra • priorytety',
  tytul: 'Co sprawdzić najpierw?',
  naglowek: 'DWA ALARMY',
  tresc: 'Czerwony alarm głośno ostrzega o przegrzaniu sali ruchu. Cichy impuls z rozdziału zasilania wciąż powtarza się regularnie.',
  licznik: 'Sprawdzone alarmy',
  podpowiedz: 'Dotknij alarmu na ilustracji, aby nadać mu priorytet.',
  drugi: function (pierwszy) {
    return 'Pierwszy krok: ' + (pierwszy === 'quiet' ? 'cichy impuls' : 'głośny alarm') + '. Wybierz drugi sygnał.';
  },
  alarmy: [
    { id: 'quiet', etykieta: 'CICHY', x: 30, y: 46, r: 15,
      po: 'Wybrano cichy sygnał. Teraz zdecyduj, jak sprawdzić dane bez zgadywania.' },
    { id: 'loud', etykieta: 'GŁOŚNY', x: 70, y: 12, r: 15,
      po: 'Wybrano głośny alarm. Teraz wskaż bezpieczną czynność kontrolną.' }
  ],
  weryfikacja: {
    etykieta: 'Działanie • sprawdź swój wybór',
    quiet: {
      tytul: 'Cichy sygnał',
      mowca: 'MÓZGUŚ',
      tresc: 'Cichy impuls jest informacją. Trzeba zmierzyć jego rytm i sprawdzić rezerwę zasilania.',
      obraz: 'r3-weryfikacja',
      opcje: [
        { id: 'rhythm', tekst: 'ZMIERZ RYTM I STAN ZASILANIA', dobry: true },
        { id: 'cable', tekst: 'ODŁĄCZ LOSOWY PRZEWÓD', dobry: false },
        { id: 'ignore', tekst: 'ZIGNORUJ CICHY IMPULS', dobry: false }
      ],
      zle: 'Nie zmieniaj instalacji bez danych. Najpierw zmierz rytm i stan zasilania.',
      dobrze: 'Mózguś mierzy regularny impuls i potwierdza osłabione zasilanie.'
    },
    loud: {
      tytul: 'Głośny alarm',
      mowca: 'KROPELKA',
      tresc: 'Zanim wyłączymy alarm, musimy upewnić się, że ludzie są bezpieczni i sprawdzić temperaturę.',
      obraz: 'r3-glosny',
      opcje: [
        { id: 'people', tekst: 'SPRAWDŹ LUDZI I TEMPERATURĘ', dobry: true },
        { id: 'mute', tekst: 'WYŁĄCZ DŹWIĘK BEZ SPRAWDZANIA', dobry: false },
        { id: 'rush', tekst: 'BIEGNIJ SAM DO SALI', dobry: false }
      ],
      zle: 'Alarmu nie wystarczy uciszyć. Najpierw sprawdź ludzi i rzeczywiste zagrożenie.',
      dobrze: 'Kropelka potwierdza bezpieczeństwo ludzi i zapisuje temperaturę.'
    }
  },
  podsumowanie: {
    etykieta: 'Konsekwencja • przekaż plan',
    tytul: 'Oba alarmy sprawdzone',
    mowca: 'UŚMIECHANKA',
    przycisk: 'PRZEKAŻ KOLEJNOŚĆ CAŁEMU ZESPOŁOWI',
    loud: {
      tresc: 'Najpierw zabezpieczyliśmy ludzi. Cichy sygnał wymagał potem zasilania awaryjnego, ale nie został pominięty.',
      wynik: 'Najpierw zabezpieczono salę i ludzi. Gdy zespół wraca do cichego impulsu, musi użyć zasilania awaryjnego, lecz sytuacja pozostaje pod kontrolą.'
    },
    quiet: {
      tresc: 'Najpierw wykryliśmy osłabione zasilanie, a równolegle zabezpieczyliśmy salę. Teraz cały zespół zna kolejność.',
      wynik: 'Cichy impuls ujawnia osłabione zasilanie, a Kropelka równolegle zabezpiecza salę. Zespół zapobiega eskalacji bez paniki.'
    },
    sufiks: ' Wniosek: dobra kolejność łączy bezpieczeństwo, dane i jasną komunikację.'
  }
};

/* ---------- rozdział 4: fakt, hipoteza, domysł ---------- */
ASZD.R4 = {
  etykieta: 'Minigra • przeciągnij kartę',
  tytul: 'Fakt, hipoteza czy domysł?',
  licznik: 'Uporządkowane karty',
  naglowekKarty: 'KARTA INFORMACJI',
  instrukcja: function (i, n) {
    return 'Karta ' + i + ' z ' + n + '. Przeciągnij ją do kategorii albo dotknij wybranej kategorii.';
  },
  kategorie: [
    { id: 'fakt', tytul: 'FAKT', opis: 'można zaobserwować',
      echo: 'To obserwacja, którą zespół może zobaczyć lub zmierzyć.' },
    { id: 'hipoteza', tytul: 'HIPOTEZA', opis: 'można sprawdzić',
      echo: 'To możliwe wyjaśnienie. Następny krok to sprawdzenie go.' },
    { id: 'domysl', tytul: 'DOMYSŁ', opis: 'brakuje dowodów',
      echo: 'To domysł, na razie nie ma wspierających go danych.' }
  ],
  karty: [
    { id: 'red', tekst: 'Czerwone światło pulsuje.', kat: 'fakt' },
    { id: 'pulse', tekst: 'Cichy sygnał wraca co osiem sekund.', kat: 'fakt' },
    { id: 'cable', tekst: 'Przewód może być poluzowany.', kat: 'hipoteza' },
    { id: 'rest', tekst: 'Senek może potrzebować odpoczynku.', kat: 'hipoteza' },
    { id: 'wind', tekst: 'Na pewno zrobił to wiatr.', kat: 'domysl' },
    { id: 'mood', tekst: 'Wszyscy na pewno są zdenerwowani.', kat: 'domysl' }
  ],
  kartMaly: 4,
  zle: 'Mózguś nie odrzuca karty. Pyta: czy to obserwacja, sprawdzalne wyjaśnienie, czy zdanie bez dowodów?',
  review: {
    etykieta: 'Tablica dowodów • sprawdź wynik',
    tytul: 'Informacje uporządkowane',
    tresc: function (f, h, d) {
      return 'FAKTY: ' + f + '   •   HIPOTEZY: ' + h + '   •   DOMYSŁY: ' + d +
        '\n\nTeraz wiemy, co zaobserwowano, co można sprawdzić i czego jeszcze nie potwierdzono.';
    },
    przycisk: 'ZATWIERDŹ TABLICĘ DOWODÓW',
    wniosek: 'Zespół oddzielił to, co wie, od tego, co dopiero trzeba sprawdzić. Wniosek: powiedzenie „nie wiemy jeszcze” pomaga podjąć lepszą decyzję.'
  }
};

/* ---------- rozdział 5: role, plan, kolejność ---------- */
ASZD.R5 = {
  etykieta: 'Minigra • przeciągnij lub dotknij',
  tytul: 'Pomóż zespołowi',
  licznik: 'Przydzielone zadania',
  instrukcja: 'Przeciągnij bohatera na kartę zadania. Możesz też dotknąć jego pola.',
  krok: function (i) { return 'ZADANIE ' + i + ' Z 3'; },
  zadania: [
    { id: 'fakty', tekst: 'Sprawdź fakty i panel zasilania', bohater: 'Mózguś' },
    { id: 'strefa', tekst: 'Zabezpiecz strefę i przygotuj wodę', bohater: 'Kropelka' },
    { id: 'wiadomosc', tekst: 'Przekaż zespołowi sprawdzoną wiadomość', bohater: 'Uśmiechanka' }
  ],
  dystraktory: ['Energuś', 'Sprintix', 'Witaminka', 'Senek'],
  dobrze: function (imie) { return imie + ' przyjmuje zadanie i mówi zespołowi, jaki będzie następny krok.'; },
  zle: function (imie) { return imie + ' może pomóc później, ale do tego kroku lepiej pasuje inna specjalność. Spróbuj dopasować moc bohatera do zadania.'; },
  plan: {
    etykieta: 'Finał • plan awaryjny',
    mowca: 'ENERGUŚ',
    tresc: 'Role są rozdzielone. Wybierz plan, który łączy bezpieczeństwo, sprawdzenie danych, komunikację i odpoczynek.',
    opcje: [
      { id: 'wspolny', tekst: 'ZABEZPIECZ • SPRAWDŹ • POWIEDZ • ODPOCZNIJ', dobry: true },
      { id: 'pospieszny', tekst: 'WSZYSCY BIEGNĄ DO CZERWONEGO ALARMU', dobry: false },
      { id: 'bierny', tekst: 'CZEKAMY, AŻ ALARM SAM UCICHNIE', dobry: false }
    ],
    odpowiedzi: {
      bierny: 'Samo czekanie nie zabezpiecza ludzi i nie sprawdza danych. Zespół potrzebuje wspólnego działania.',
      pospieszny: 'Głośny alarm cichnie, ale cichy impuls pozostaje. Plan nie obejmuje danych, komunikacji ani odpoczynku, popraw go.',
      wspolny: 'Wybrano wspólny plan. Teraz ułóż jego cztery kroki we właściwej kolejności.'
    }
  },
  kolejnosc: {
    etykieta: 'Finałowa minigra • kolejność działań',
    tytul: 'Uruchom plan awaryjny',
    licznik: 'Ułożone kroki',
    tablica: 'TABLICA PLANU • UPUŚĆ TUTAJ',
    pusto: 'Przeciągnij pierwszy bezpieczny krok.',
    kroki: [
      { id: 'secure', tekst: 'ZABEZPIECZ STREFĘ', krotki: 'ZABEZPIECZ' },
      { id: 'check', tekst: 'SPRAWDŹ DANE', krotki: 'SPRAWDŹ' },
      { id: 'tell', tekst: 'POWIEDZ ZESPOŁOWI', krotki: 'POWIEDZ' },
      { id: 'rest', tekst: 'ZAPLANUJ ODPOCZYNEK', krotki: 'ODPOCZNIJ' }
    ],
    pulapka: { id: 'rush', tekst: 'BIEGNIJ BEZ PLANU', krotki: 'POŚPIECH' },
    zlaPulapka: 'Pośpiech bez planu rozdziela zespół. Zacznij od zabezpieczenia strefy.',
    zlaKolejnosc: function (oczekiwany) { return 'Ten krok będzie potrzebny, ale jeszcze nie teraz. Najpierw: ' + oczekiwany + '.'; },
    zapisany: function (tekst) { return 'Krok zapisany: ' + tekst; },
    review: {
      etykieta: 'Plan gotowy • uruchom działania',
      tytul: 'Zespół zna swoją kolejność',
      naglowek: 'WSPÓLNY PLAN',
      tresc: 'ZABEZPIECZ  →  SPRAWDŹ  →  POWIEDZ  →  ODPOCZNIJ\n\nKażdy bohater zna swoją rolę, a oba alarmy są objęte planem.',
      przycisk: 'URUCHOM PLAN AWARYJNY',
      wniosek: 'Kropelka zabezpiecza strefę, Mózguś potwierdza źródło impulsu, Uśmiechanka przekazuje jasny komunikat, a Senek pilnuje przerw. Oba alarmy cichną bez chaosu. Wniosek: najlepszy plan można poprawiać, a odpowiedzialność warto dzielić.'
    }
  }
};

/* ---------- teksty ekranów ---------- */
ASZD.T = {
  marka: 'Akademia Super Zdrowia',
  tytulGry: 'Dwa Alarmy',
  podtytul: 'Krótka przygoda • bez internetu',
  druzyna: 'Energuś  •  Senek  •  Kropelka  •  Mózguś\nWitaminka  •  Sprintix  •  Uśmiechanka',
  graj: 'GRAJ',
  kontynuuj: 'KONTYNUUJ',
  ustawienia: 'USTAWIENIA',
  lokalnie: 'Wszystko zapisujemy lokalnie',
  prywatnosc: 'Gra nie wymaga konta ani internetu. Postęp znajduje się wyłącznie na tym urządzeniu.',
  powitanie: 'Witaj w Akademii. Senek zauważył coś nietypowego.',
  muzyka: 'MUZYKA: ',
  dzwieki: 'DŹWIĘKI: ',
  wl: 'WŁ.',
  wyl: 'WYŁ.',
  wybierzTryb: 'WYBIERZ TRYB',
  dopasujemy: 'Dopasujemy tekst i podpowiedzi',
  tryby: [
    { id: 'maly', tytul: '4-7 LAT', opis: 'Większe przyciski, krótsze zdania, więcej podpowiedzi i zero presji czasu.', cta: 'GRAM W TRYBIE 4-7' },
    { id: 'duzy', tytul: '8-12 LAT', opis: 'Więcej danych do porównania, trudniejsze decyzje i więcej kart w minigrach.', cta: 'GRAM W TRYBIE 8-12' }
  ],
  rozdzialy: 'ROZDZIAŁY',
  rozdzialZ: function (n) { return 'Rozdział ' + n + ' z 5'; },
  scenaZ: function (i, n) { return 'Scena ' + i + ' / ' + n; },
  doZadania: 'PRZEJDŹ DO ZADANIA',
  dalej: 'DALEJ',
  ukonczony: 'Rozdział ukończony • zapisano',
  wniosek: 'WNIOSEK',
  wynik: 'Wynik zadania',
  osiagniecie: 'Osiągnięcie: ',
  zakonczenie: 'ZAKOŃCZENIE',
  nastepny: 'NASTĘPNY ROZDZIAŁ',
  wyborRozdzialu: 'WYBÓR ROZDZIAŁU',
  pauza: 'PAUZA',
  postepBezpieczny: 'Postęp jest bezpieczny',
  pauzaOpis: 'Możesz wrócić do rozdziału albo do menu. Ważne decyzje i ukończone etapy zapisują się automatycznie.',
  wrocDoGry: 'WRÓĆ DO GRY',
  menuGlowne: 'MENU GŁÓWNE',
  dobrze: 'DOBRZE • ',
  ponownie: 'SPRÓBUJ PONOWNIE • ',
  wskazowka: 'WSKAZÓWKA • ',
  finalTytul: 'Przygoda ukończona',
  finalNaglowek: 'OBA ALARMY UCICHŁY',
  finalPoprawka: 'Plan wymagał poprawki, lecz zespół zatrzymał się, zebrał informacje i wspólnie doprowadził misję do bezpiecznego końca.',
  finalCzysty: 'Cichy sygnał został zauważony, fakty sprawdzone, a zespół zadziałał razem. Akademia znów pracuje spokojnie.',
  finalOsiagniecia: 'Osiągnięcia: ',
  finalSlady: function (a, b) { return 'Ślady uważności: ' + a + '/' + b + '\nPostęp zapisano lokalnie.'; },
  nowaPrzygoda: 'NOWA PRZYGODA',
  gwiazdki: 'Gwiazdki',
  gwiazdkiRazem: function (a, b) { return 'Gwiazdki: ' + a + ' z ' + b; },
  bezBledu: 'Komplet! Ani jednej pomyłki.',
  jednaPomylka: 'Prawie komplet. Jedna pomyłka.',
  wielePomylek: 'Zadanie zaliczone. Spróbuj jeszcze raz i uważaj przy wyborze.',
  jeszczeRaz: 'POWTÓRZ NA TRZY GWIAZDKI',
  obserwuj: function (s) { return 'Popatrz spokojnie… ' + s; },
  terazWybierz: 'TERAZ WYBIERZ PANELE',
  inneGry: 'Inne gry Akademii',

  /* bohater i moc */
  wybierzBohatera: 'WYBIERZ BOHATERA',
  wybierzBohateraOpis: 'Twój bohater idzie z tobą przez całą grę. Gdy się potkniesz, pomoże jedną mocą na rozdział.',
  gramJako: function (imie) { return 'GRAM JAKO ' + imie.toUpperCase(); },
  twojBohater: 'Twój bohater',
  poziomBohatera: function (n) { return 'Poziom ' + n; },
  xpZdobyte: function (n) { return '+' + n + ' do doświadczenia bohatera'; },
  zmienBohatera: 'ZMIEŃ BOHATERA',
  mocPodpowiedz: 'Twój bohater pomógł. Teraz wybierz spokojnie.',

  /* Gluton X */
  coSieDzieje: 'Co się dzieje w Akademii?',

  /* album */
  album: 'ALBUM KART',
  albumOpis: 'Każde dobre trafienie zostawia kartę. Złote karty są za komplet gwiazdek. Dotknij karty, żeby ją przeczytać.',
  albumLicznik: function (a, b, z) { return 'Karty: ' + a + ' z ' + b + (z ? '  •  złote: ' + z : ''); },
  kartaNowa: 'Nowa karta w albumie',
  kartaZlota: 'Złota karta',
  kartaNieznana: 'Jeszcze nieodkryta',
  zrodlo: 'Źródło',

  /* dyżur */
  dyzur: 'DYŻUR W AKADEMII',
  dyzurEtykieta: 'Dyżur • sytuacja z życia',
  dyzurOpis: 'Trzy krótkie sytuacje na dziś. Jutro będą inne. Każdy dyżur to odznaka i karta do albumu.',
  dyzurStart: 'ZACZNIJ DZISIEJSZY DYŻUR',
  dyzurZrobiony: 'Dzisiejszy dyżur zrobiony. Wróć jutro po nowe sytuacje albo powtórz dzisiejsze dla treningu.',
  dyzurJeszcze: 'POWTÓRZ DLA TRENINGU',
  dyzurSytuacja: function (i, n) { return 'Sytuacja ' + i + ' z ' + n; },
  dyzurKoniec: 'Dyżur zaliczony',
  dyzurPowtorkaKoniec: 'Trening zaliczony',
  dyzurSeria: function (n) { return n > 1 ? 'Seria: ' + n + ' dni z rzędu. Wróć jutro, żeby ją podtrzymać.' : 'Pierwszy dzień serii. Wróć jutro, żeby ją podtrzymać.'; },
  dyzurZablokowany: 'Dyżur odblokuje się po rozdziale 2.',
  seria: 'Seria dni',
  odznaki: 'Odznaki',
  sytuacje: 'Sytuacje',

  /* trening */
  trening: 'TRENING: CICHY SYGNAŁ',
  treningOpis: 'Znajdź panele, które pulsują w jednym rytmie, wśród coraz głośniejszego hałasu. Trzy życia. Jak wysoko dojdziesz?',
  treningStart: 'ZACZNIJ OD POZIOMU 1',
  treningJeszcze: 'JESZCZE RAZ',
  treningPoziomOpis: function (r, n) { return 'Wśród ' + n + ' paneli ' + r + ' pulsują w jednym rytmie. Popatrz, potem wybierz.'; },
  treningKoniec: 'Koniec treningu',
  treningMistrz: 'Mistrz cichego sygnału!',
  treningZablokowany: 'Trening odblokuje się po rozdziale 2.',
  poziom: function (n) { return 'Poziom ' + n; },
  rekord: 'Rekord',
  nowyRekord: 'Nowy rekord!',
  rekordJest: function (n) { return 'Twój rekord: poziom ' + n + '.'; },
  zycia: 'Życia',

  /* misja na dziś */
  misjaNaDzis: 'MISJA NA DZIŚ',
  misjaOpis: 'Jedno małe zadanie poza ekranem. Jutro gra zapyta, czy się udało.',
  misjaPrzyjmuje: 'PRZYJMUJĘ MISJĘ',
  misjaPytanie: 'Wczorajsza misja: udało się?',
  misjaTak: 'TAK, ZROBIONE',
  misjaNie: 'NIE TYM RAZEM',
  misjaTakOdp: 'Brawo. To liczy się bardziej niż gwiazdki. Karta do albumu za misję.',
  misjaNieOdp: 'W porządku. Misje są po to, żeby próbować. Dostaniesz nową.',

  /* pokaż rodzicowi */
  pokazRodzicowi: 'POKAŻ RODZICOWI',
  powiedzRodzicowi: 'Powiedz rodzicowi trzy rzeczy',
  pytanieDlaRodzica: 'Pytanie dla rodzica',
  wrocDoWyniku: 'WRÓĆ DO WYNIKU',

  /* lektor */
  lektor: 'LEKTOR: ',
  lektorBrak: 'Ta przeglądarka nie ma polskiego głosu, lektor jest niedostępny.'
};
