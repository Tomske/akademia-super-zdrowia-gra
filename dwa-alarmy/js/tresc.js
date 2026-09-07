/* Treść poza kampanią: bohaterowie i ich moce, Gluton X, Album Kart Faktów,
   sytuacje do Dyżuru, misje na dziś, pytania dla rodzica.
   Zasada dla faktów: liczba tylko tam, gdzie stoi za nią źródło (lista w ANALIZA-KODU.md).
   Bez źródła zdanie jest opisowe, bez liczby. */
window.ASZD = window.ASZD || {};

/* ---------- bohaterowie do wyboru i ich moce ---------- */
ASZD.BOHATEROWIE_LISTA = [
  { id: 'energus', imie: 'Energuś', moc: 'Iskra', opis: 'Gdy się potkniesz, Energuś pokaże jeden zły trop.' },
  { id: 'mozgus', imie: 'Mózguś', moc: 'Lupa', opis: 'Gdy się potkniesz, Mózguś podświetli właściwą kategorię.' },
  { id: 'kropelka', imie: 'Kropelka', moc: 'Spokój', opis: 'Gdy się potkniesz, Kropelka przygasi jedną mylną wskazówkę.' },
  { id: 'senek', imie: 'Senek', moc: 'Czujne ucho', opis: 'Gdy się potkniesz, Senek wskaże jeden panel z rytmem.' },
  { id: 'witaminka', imie: 'Witaminka', moc: 'Witaminowy zastrzyk', opis: 'Gdy się potkniesz, Witaminka usunie jedną złą odpowiedź.' },
  { id: 'sprintix', imie: 'Sprintix', moc: 'Szybki zwiad', opis: 'Gdy się potkniesz, Sprintix odsłoni jeden trop.' },
  { id: 'usmiechanka', imie: 'Uśmiechanka', moc: 'Dobre słowo', opis: 'Gdy się potkniesz, Uśmiechanka podpowie właściwy krok.' }
];

/* ---------- Gluton X: rama fabularna, mechaniki bez zmian ---------- */
ASZD.GLUTON = {
  imie: 'Gluton X',
  menu: 'Gluton X wrócił. Tym razem działa po cichu.',
  intro: 'W Akademii zaczęły się dziać dziwne rzeczy: w stołówce owoce znikają, a w ich miejsce pojawiają się słodycze. Nikt nie widział, kto to robi. Senek mówi, że słyszy cichy sygnał. Drużyna wraca sprawdzić, co się dzieje.',
  rozdzial3: 'Głośny alarm wyje w sali ruchu. Ale Kropelka zauważa: cichy impuls przyspieszył dokładnie wtedy, gdy alarm się włączył. Jakby ktoś chciał, żeby wszyscy pobiegli w jedną stronę.',
  demaskacja: 'To był Gluton X. Głośny alarm był jego wabikiem. Kiedy wszyscy mieli biec do sali ruchu, on chciał po cichu podmienić owoce w stołówce. Zespół, który sprawdził oba sygnały, zobaczył go pierwszy.',
  finalCzysty: 'Gluton X uciekł bez łupu, bo ktoś zauważył cichy sygnał, zanim zaczął krzyczeć. Owoce zostały w stołówce. Akademia znów pracuje spokojnie.',
  finalPoprawka: 'Gluton X zdążył podmienić część owoców, ale zespół zatrzymał się, zebrał informacje i naprawił plan. Następnym razem cichy sygnał sprawdzicie pierwszy.',
  tytulKarty: 'POSZUKIWANY'
};

/* ---------- Album Kart Faktów ----------
   kat: 'zdrowie' (ciało), 'glowa' (myślenie i emocje), 'zespol' (ludzie).
   zrodlo: skrót, pełna lista w dokumentacji. Brak zrodlo = zdanie bez liczby. */
ASZD.KARTY = [
  /* z kampanii, odblokowywane konkretnym trafieniem */
  { id: 'cichy-sygnal', kat: 'glowa', tytul: 'Cichy sygnał', tekst: 'Zmęczenie nie krzyczy. Częściej ziewa, milczy albo się złości. Ciche sygnały zasługują na uwagę tak samo jak głośne.' },
  { id: 'woda-najpierw', kat: 'zdrowie', tytul: 'Woda przed pośpiechem', tekst: 'Zanim biegniesz, weź wodę. Gdy jest gorąco albo dużo się ruszasz, ciało potrzebuje jej więcej.' },
  { id: 'fakt-panel', kat: 'glowa', tytul: 'Fakt to coś, co widzisz', tekst: 'Fakt można pokazać palcem: panel świeci, drzwi są zamknięte. Domysł to zdanie bez dowodu.' },
  { id: 'zatrzymaj-powiedz', kat: 'zespol', tytul: 'Zatrzymaj, powiedz, ustal', tekst: 'Najpierw zatrzymaj się. Potem powiedz, co wiesz. Na końcu ustalcie, kto co robi. W tej kolejności działa się bezpiecznie.' },
  { id: 'rytm', kat: 'glowa', tytul: 'Regularność to wskazówka', tekst: 'Coś, co wraca w tym samym rytmie, ma przyczynę. Żeby ją zauważyć, trzeba popatrzeć dłużej niż sekundę.' },
  { id: 'ciche-potrzeby', kat: 'zespol', tytul: 'Ciche potrzeby', tekst: 'Osoba, która nic nie mówi, też może czegoś potrzebować. Zwolnij i popatrz, zanim zapytasz.' },
  { id: 'zmierz-zanim', kat: 'glowa', tytul: 'Zmierz, zanim zmienisz', tekst: 'Nie odłączaj, nie wyłączaj, nie naprawiaj na oślep. Najpierw sprawdź, co pokazują dane.' },
  { id: 'ludzie-najpierw', kat: 'zespol', tytul: 'Ludzie przed alarmem', tekst: 'Uciszenie alarmu nie usuwa zagrożenia. Najpierw sprawdź, czy ludzie są bezpieczni.' },
  { id: 'kolejnosc-laczy', kat: 'zespol', tytul: 'Dobra kolejność', tekst: 'Dobra kolejność łączy trzy rzeczy: bezpieczeństwo, dane i jasną wiadomość dla wszystkich.' },
  { id: 'fakt', kat: 'glowa', tytul: 'FAKT', tekst: 'Fakt można zobaczyć, usłyszeć albo zmierzyć. "Czerwone światło pulsuje" to fakt.' },
  { id: 'hipoteza', kat: 'glowa', tytul: 'HIPOTEZA', tekst: 'Hipoteza to możliwe wyjaśnienie, które da się sprawdzić. "Może przewód się poluzował" to hipoteza.' },
  { id: 'domysl', kat: 'glowa', tytul: 'DOMYSŁ', tekst: 'Domysł to zdanie bez dowodu. "Na pewno zrobił to wiatr" to domysł, dopóki ktoś tego nie sprawdzi.' },
  { id: 'nie-wiemy-jeszcze', kat: 'glowa', tytul: 'Nie wiemy jeszcze', tekst: 'Powiedzenie "nie wiemy jeszcze" nie jest porażką. Pomaga podjąć lepszą decyzję niż zgadywanie.' },
  { id: 'moc-do-zadania', kat: 'zespol', tytul: 'Właściwa osoba do zadania', tekst: 'Każdy jest w czymś dobry. Dobry plan daje ludziom zadania pasujące do ich mocy.' },
  { id: 'zabezpiecz-sprawdz', kat: 'zespol', tytul: 'Zabezpiecz, sprawdź, powiedz', tekst: 'Trzy kroki dobrego planu: najpierw zabezpiecz, potem sprawdź dane, potem powiedz zespołowi.' },
  { id: 'odpoczynek-w-planie', kat: 'zdrowie', tytul: 'Odpoczynek jest w planie', tekst: 'Dobry plan ma w sobie przerwę. Zmęczony zespół popełnia więcej błędów.' },
  { id: 'bohater-akademii', kat: 'zespol', tytul: 'Bohater Akademii', tekst: 'Bohater to nie ten, kto biegnie najszybciej. To ten, kto zauważa, sprawdza i mówi zespołowi.' },

  /* z dyżurów i treningu: fakty o zdrowiu, liczby tylko ze źródłem */
  { id: 'sen-9-12', kat: 'zdrowie', tytul: 'Sen 9 do 12 godzin', tekst: 'Dziecko w wieku 6 do 12 lat potrzebuje 9 do 12 godzin snu na dobę. To wtedy mózg porządkuje wszystko, czego się uczyłeś.', zrodlo: 'AASM 2016' },
  { id: 'sen-10-13', kat: 'zdrowie', tytul: 'Sen 10 do 13 godzin', tekst: 'Dziecko w wieku 3 do 5 lat potrzebuje 10 do 13 godzin snu na dobę, razem z drzemką.', zrodlo: 'AASM 2016' },
  { id: 'ekran-przed-snem', kat: 'zdrowie', tytul: 'Ekran przed snem', tekst: 'Jasny ekran wieczorem mówi mózgowi, że jest dzień. Trudniej wtedy zasnąć. Odłóż go, zanim położysz się do łóżka.' },
  { id: 'ruch-60', kat: 'zdrowie', tytul: 'Ruch 60 minut', tekst: 'Dzieci i nastolatki potrzebują co najmniej 60 minut ruchu dziennie. Nie musi być naraz: bieganie na przerwie też się liczy.', zrodlo: 'WHO 2020' },
  { id: 'rece-20', kat: 'zdrowie', tytul: 'Ręce 20 sekund', tekst: 'Mycie rąk z mydłem powinno trwać około 20 sekund. Tyle, co dwa razy "Sto lat".', zrodlo: 'WHO' },
  { id: 'zeby-2x2', kat: 'zdrowie', tytul: 'Zęby 2 razy po 2 minuty', tekst: 'Zęby myje się dwa razy dziennie, po dwie minuty. Wieczorne mycie jest ważniejsze, bo w nocy ślina płynie wolniej.', zrodlo: 'FDI' },
  { id: 'piec-porcji', kat: 'zdrowie', tytul: 'Pięć porcji', tekst: 'Warzywa i owoce najlepiej jeść pięć razy dziennie, w różnych kolorach. Każdy kolor to inne witaminy.', zrodlo: 'WHO' },
  { id: 'pragnienie', kat: 'zdrowie', tytul: 'Głód czy pragnienie?', tekst: 'Czasem to, co czujesz jako głód, jest pragnieniem. Wypij wodę i poczekaj chwilę, zanim sięgniesz po przekąskę.' },
  { id: 'sniadanie', kat: 'zdrowie', tytul: 'Śniadanie i skupienie', tekst: 'Po śniadaniu łatwiej skupić się w szkole. Głodny mózg myśli o jedzeniu, nie o zadaniu.' },
  { id: 'slodycze-czasem', kat: 'zdrowie', tytul: 'Słodycze są na czasem', tekst: 'Słodycze są na czasem, nie na codziennie. Gluton X chciałby, żebyś o tym zapomniał.' },
  { id: 'nazwij-emocje', kat: 'glowa', tytul: 'Nazwij, co czujesz', tekst: 'Gdy nazwiesz emocję ("boję się", "jestem zły"), staje się trochę mniejsza. Nazwanie to pierwszy krok do spokoju.' },
  { id: 'dlugi-wydech', kat: 'glowa', tytul: 'Długi wydech', tekst: 'Powolny, długi wydech uspokaja ciało. Wdech przez nos, wydech dłuższy niż wdech, trzy razy.' },
  { id: 'pros-o-pomoc', kat: 'zespol', tytul: 'Prośba o pomoc', tekst: 'Poproszenie o pomoc to umiejętność, nie słabość. Najlepsze zespoły robią to bez wstydu.' },
  { id: 'zmeczenie-zlosc', kat: 'glowa', tytul: 'Zmęczenie udaje złość', tekst: 'Zmęczone dziecko bywa rozdrażnione. Zanim uznasz, że ktoś jest zły, sprawdź, czy nie jest po prostu zmęczony.' }
];

ASZD.KARTY_KAT = {
  zdrowie: { nazwa: 'Ciało', kolor: '#81C784' },
  glowa: { nazwa: 'Głowa', kolor: '#7fd4ff' },
  zespol: { nazwa: 'Zespół', kolor: '#ffd54d' }
};

/* ---------- Dyżur: sytuacje z życia, w mechanikach z kampanii ----------
   typ: hotspoty | wybor | karty | kolejnosc | role. Każda daje jedną kartę. */
ASZD.DYZUR = [
  {
    id: 'korytarz', typ: 'hotspoty', obraz: 'menu', karta: 'zmeczenie-zlosc',
    tytul: 'Kto potrzebuje uwagi na przerwie?',
    opis: 'Na korytarzu jest głośno. Znajdź trzy osoby, które wysyłają cichy sygnał.',
    potrzeba: 3, licznik: 'Zauważone osoby', powtorka: 'Tę osobę już zauważyłeś. Poszukaj kogoś innego.',
    punkty: [
      { id: 'senek', etykieta: 'SENEK', x: 10, y: 40, r: 10, dobry: true, tekst: 'Senek zasłania ziewnięcie. Zmęczenie to cichy sygnał, łatwo go przegapić w hałasie.' },
      { id: 'usmiechanka', etykieta: 'UŚMIECHANKA', x: 89, y: 42, r: 10, dobry: true, tekst: 'Uśmiechanka stoi z założonymi rękami i patrzy w dół. Coś ją gryzie, choć nic nie mówi.' },
      { id: 'kropelka', etykieta: 'KROPELKA', x: 22, y: 56, r: 9, dobry: true, tekst: 'Kropelka pokazuje bidon. Na przerwie też trzeba pić, nie tylko biegać.' },
      { id: 'zegar', etykieta: 'ZEGAR', x: 44, y: 5, r: 7, dobry: false, tekst: 'Zegar mówi, że przerwa się kończy. To fakt, ale nie o ludziach.' },
      { id: 'plakat', etykieta: 'PLAKAT', x: 5, y: 16, r: 7, dobry: false, tekst: 'Ładny plakat. Ale plakat nie potrzebuje twojej uwagi, ludzie tak.' },
      { id: 'nauczyciel', etykieta: 'NAUCZYCIEL', x: 20, y: 22, r: 8, dobry: false, tekst: 'Nauczyciel obserwuje korytarz. Możesz go poprosić o pomoc, ale najpierw zauważ, komu.' }
    ]
  },
  {
    id: 'pokoj', typ: 'hotspoty', obraz: 'final', karta: 'ekran-przed-snem',
    tytul: 'Co pomaga zasnąć?',
    opis: 'Senek kończy dzień. Znajdź trzy rzeczy w pokoju, które pomagają dobrze spać.',
    potrzeba: 3, licznik: 'Znalezione pomocniki', powtorka: 'To już masz. Poszukaj innego szczegółu.',
    punkty: [
      { id: 'budzik', etykieta: 'BUDZIK', x: 50, y: 42, r: 8, dobry: true, tekst: 'Budzik nastawiony na stałą porę. Ciało lubi rytm: kładzenie się o tej samej godzinie ułatwia zasypianie.' },
      { id: 'woda', etykieta: 'WODA', x: 58, y: 43, r: 7, dobry: true, tekst: 'Szklanka wody przy łóżku. Wieczorem łyk, nie cały bidon, żeby nie wstawać w nocy.' },
      { id: 'lista', etykieta: 'LISTA', x: 50, y: 56, r: 9, dobry: true, tekst: 'Lista wieczornych kroków. Ta sama kolejność co wieczór uspokaja i mówi ciału: idzie sen.' },
      { id: 'okno', etykieta: 'OKNO', x: 74, y: 22, r: 9, dobry: false, tekst: 'Za oknem jasno. Zasłona pomaga, ale zadanie jest o tym, co Senek robi, nie o pogodzie.' },
      { id: 'plecak', etykieta: 'PLECAK', x: 8, y: 82, r: 7, dobry: false, tekst: 'Plecak na jutro. Dobry nawyk, ale to przygotowanie do szkoły, nie do snu.' },
      { id: 'kapcie', etykieta: 'KAPCIE', x: 40, y: 80, r: 7, dobry: false, tekst: 'Kapcie. Wygodne, ale nic nie mówią o zasypianiu.' }
    ]
  },
  {
    id: 'zbiorka', typ: 'hotspoty', obraz: 'dyzur-zbiorka', karta: 'ciche-potrzeby',
    tytul: 'Kto stoi z boku?',
    opis: 'Zbiórka przed wyjściem. Znajdź trzy osoby, do których warto podejść.',
    potrzeba: 3, licznik: 'Zauważone osoby', powtorka: 'Tę osobę już zauważyłeś.',
    punkty: [
      { id: 'senek', etykieta: 'SENEK', x: 70, y: 40, r: 9, dobry: true, tekst: 'Senek stoi z boku i patrzy w dół. Cichy sygnał w środku tłumu.' },
      { id: 'sam', etykieta: 'CHŁOPIEC', x: 91, y: 44, r: 8, dobry: true, tekst: 'Chłopiec stoi sam, z rękami przy sobie. Nikt do niego nie mówi. Wystarczy podejść i zapytać.' },
      { id: 'usmiechanka', etykieta: 'UŚMIECHANKA', x: 68, y: 66, r: 9, dobry: true, tekst: 'Uśmiechanka kuca przy młodszej dziewczynce i słucha. Tak wygląda uwaga: na wysokości oczu.' },
      { id: 'nauczycielka', etykieta: 'NAUCZYCIELKA', x: 85, y: 20, r: 8, dobry: false, tekst: 'Nauczycielka liczy uczniów. Ważne, ale to ona pilnuje listy, ty pilnujesz ludzi.' },
      { id: 'sprintix', etykieta: 'SPRINTIX', x: 6, y: 30, r: 7, dobry: false, tekst: 'Sprintix gotów do biegu. Ale dokąd? Najpierw zobacz, kto potrzebuje pomocy.' },
      { id: 'mozgus', etykieta: 'MÓZGUŚ', x: 20, y: 30, r: 8, dobry: false, tekst: 'Mózguś już notuje. Przyda się później. Teraz szukaj tych, do których nikt nie podszedł.' }
    ]
  },
  {
    id: 'kolega-cicho', typ: 'wybor', obraz: 'menu', karta: 'cichy-sygnal',
    tytul: 'Głośno czy cicho?',
    sytuacja: { naglowek: 'PRZERWA', tresc: 'Dwóch kolegów głośno się kłóci o piłkę. W tym samym czasie Kuba, który zwykle gada bez przerwy, siedzi sam pod ścianą i nic nie mówi. Co sprawdzisz najpierw?' },
    opcje: [
      { id: 'kuba', tekst: 'PODEJDĘ DO KUBY I ZAPYTAM, CO SIĘ DZIEJE', dobry: true },
      { id: 'klotnia', tekst: 'ROZDZIELĘ KŁÓCĄCYCH SIĘ, BO SĄ GŁOŚNI', dobry: false },
      { id: 'nic', tekst: 'NIC, KAŻDY MA PRAWO POSIEDZIEĆ SAM', dobry: false }
    ],
    zle: { klotnia: 'Kłótnia o piłkę jest głośna, ale kłócący się mają się nawzajem. Kuba nie ma nikogo. Głośny sygnał nie zawsze jest ważniejszy.', nic: 'Ma prawo. Ale Kuba zwykle gada, a dziś milczy. Zmiana zachowania to cichy sygnał. Zapytanie nic nie kosztuje.' },
    dobrze: 'Zauważyłeś zmianę: gadatliwy kolega milczy. To cichy sygnał, który łatwo przegapić przy głośnej kłótni.'
  },
  {
    id: 'nie-glodny', typ: 'karty', obraz: 'pauza', karta: 'sniadanie',
    tytul: 'Przed sprawdzianem',
    instrukcja: function (i, n) { return 'Zdanie ' + i + ' z ' + n + '. Fakt, hipoteza czy domysł?'; },
    naglowekKarty: 'CO POWIEDZIAŁ SENEK', licznik: 'Uporządkowane zdania',
    zle: 'Zastanów się: czy to widać albo da się zmierzyć, czy to wyjaśnienie do sprawdzenia, czy zdanie bez dowodu?',
    karty: [
      { id: 'brzuch', tekst: 'Boli mnie brzuch.', kat: 'fakt' },
      { id: 'sniadanie', tekst: 'Nie jadłem śniadania.', kat: 'fakt' },
      { id: 'stres', tekst: 'Może brzuch boli, bo się denerwuję przed sprawdzianem.', kat: 'hipoteza' },
      { id: 'glod', tekst: 'Może to głód, nie choroba.', kat: 'hipoteza' },
      { id: 'zawsze', tekst: 'Na pewno dostanę jedynkę.', kat: 'domysl' },
      { id: 'nikt', tekst: 'Wszyscy inni na pewno wszystko umieją.', kat: 'domysl' }
    ]
  },
  {
    id: 'wieczor', typ: 'kolejnosc', obraz: 'final', karta: 'sen-9-12',
    tytul: 'Wieczór krok po kroku',
    opis: 'Ułóż wieczorny rytuał w kolejności, która pomaga zasnąć. Jedna rzecz do niego nie pasuje.',
    licznik: 'Ułożone kroki', tablica: 'WIECZORNY PLAN • UPUŚĆ TUTAJ', pusto: 'Zacznij od tego, co robisz najwcześniej.',
    kroki: [
      { id: 'ekran', tekst: 'ODŁÓŻ EKRAN', krotki: 'EKRAN' },
      { id: 'zeby', tekst: 'UMYJ ZĘBY', krotki: 'ZĘBY' },
      { id: 'swiatlo', tekst: 'PRZYGAŚ ŚWIATŁO', krotki: 'ŚWIATŁO' },
      { id: 'ksiazka', tekst: 'CHWILA Z KSIĄŻKĄ', krotki: 'KSIĄŻKA' }
    ],
    pulapki: [{ id: 'gra', tekst: 'JESZCZE JEDNA GRA NA TELEFONIE' }],
    zlaPulapka: 'Telefon przed snem mówi mózgowi, że jest dzień. To nie należy do wieczornego planu.',
    zlaKolejnosc: function (t) { return 'Ten krok jest w planie, ale później. Najpierw: ' + t + '.'; },
    zapisany: function (t) { return 'Krok zapisany: ' + t; }
  },
  {
    id: 'zastrzyk', typ: 'role', obraz: 'dyzur-plac', karta: 'nazwij-emocje',
    tytul: 'Koleżanka boi się zastrzyku',
    instrukcja: 'Zosia czeka na szczepienie i jest blada ze strachu. Kto z drużyny pomoże w każdym kroku?',
    licznik: 'Przydzielone zadania', ilu: 3,
    krok: function (i) { return 'KROK ' + i + ' Z 3'; },
    zadania: [
      { id: 'nazwij', tekst: 'Pomóż Zosi nazwać, co czuje, i powiedz, że strach jest w porządku', bohater: 'Uśmiechanka' },
      { id: 'oddech', tekst: 'Pokaż jej spokojny oddech: wdech nosem, długi wydech', bohater: 'Kropelka' },
      { id: 'fakty', tekst: 'Wytłumacz krótko, co się wydarzy i jak długo to potrwa', bohater: 'Mózguś' }
    ],
    dystraktory: ['Energuś', 'Sprintix', 'Witaminka', 'Senek'],
    dobrze: function (imie) { return imie + ' bierze ten krok. Zosia oddycha spokojniej.'; },
    zle: function (imie) { return imie + ' chętnie pomoże, ale do tego kroku lepiej pasuje ktoś inny. Pomyśl, czyja to moc.'; }
  },
  {
    id: 'upadek', typ: 'wybor', obraz: 'r3-glosny', karta: 'ludzie-najpierw',
    tytul: 'Upadek na boisku',
    sytuacja: { naglowek: 'BOISKO', tresc: 'Kolega upadł i trzyma się za kolano. Wokół zbiera się tłum, wszyscy krzyczą różne rady. Co robisz najpierw?' },
    opcje: [
      { id: 'zapytaj', tekst: 'KUCAM I PYTAM, CO GO BOLI I CZY MOŻE RUSZYĆ NOGĄ', dobry: true },
      { id: 'podnies', tekst: 'PODNOSZĘ GO SZYBKO, ŻEBY WSTAŁ', dobry: false },
      { id: 'biegne', tekst: 'BIEGNĘ PO NAUCZYCIELA, NIC NIE MÓWIĄC', dobry: false }
    ],
    zle: { podnies: 'Podnoszenie kogoś, kto nie wie, co go boli, może pogorszyć sprawę. Najpierw zapytaj i popatrz.', biegne: 'Pomoc dorosłego jest ważna, ale ktoś musi zostać z kolegą i powiedzieć mu, co się dzieje. Poproś kogoś, żeby pobiegł.' },
    dobrze: 'Najpierw człowiek, potem działanie. Zapytałeś, co boli, zamiast zgadywać. Teraz wiesz, czy wołać dorosłego.'
  },
  {
    id: 'tablet-noc', typ: 'karty', obraz: 'final', karta: 'ekran-przed-snem',
    tytul: 'Dlaczego nie mogę zasnąć?',
    instrukcja: function (i, n) { return 'Zdanie ' + i + ' z ' + n + '. Fakt, hipoteza czy domysł?'; },
    naglowekKarty: 'MYŚL PRZED SNEM', licznik: 'Uporządkowane zdania',
    zle: 'Czy to widzisz albo mierzysz? Czy to wyjaśnienie do sprawdzenia? Czy to zdanie bez dowodu?',
    karty: [
      { id: 'tablet', tekst: 'Grałem na tablecie do 21:30.', kat: 'fakt' },
      { id: 'lezy', tekst: 'Leżę już pół godziny i nie śpię.', kat: 'fakt' },
      { id: 'ekran', tekst: 'Może jasny ekran mnie rozbudził.', kat: 'hipoteza' },
      { id: 'kakao', tekst: 'Może słodkie kakao przed snem dodało mi energii.', kat: 'hipoteza' },
      { id: 'nigdy', tekst: 'Już nigdy nie zasnę.', kat: 'domysl' },
      { id: 'wszyscy', tekst: 'Wszyscy inni śpią od dawna.', kat: 'domysl' }
    ]
  },
  {
    id: 'sniadanie-kolejnosc', typ: 'kolejnosc', obraz: 'pauza', karta: 'piec-porcji',
    tytul: 'Poranek bez pośpiechu',
    opis: 'Ułóż poranek tak, żeby zdążyć zjeść. Jedna rzecz kradnie czas.',
    licznik: 'Ułożone kroki', tablica: 'PORANNY PLAN • UPUŚĆ TUTAJ', pusto: 'Co robisz zaraz po obudzeniu?',
    kroki: [
      { id: 'woda', tekst: 'SZKLANKA WODY', krotki: 'WODA' },
      { id: 'ubranie', tekst: 'UBIERZ SIĘ', krotki: 'UBRANIE' },
      { id: 'sniadanie', tekst: 'ZJEDZ ŚNIADANIE', krotki: 'ŚNIADANIE' },
      { id: 'zeby', tekst: 'UMYJ ZĘBY', krotki: 'ZĘBY' }
    ],
    pulapki: [{ id: 'telefon', tekst: 'SPRAWDŹ TELEFON W ŁÓŻKU' }],
    zlaPulapka: 'Telefon w łóżku zjada czas na śniadanie. Rano najpierw ciało, potem ekran.',
    zlaKolejnosc: function (t) { return 'Ten krok jest w planie, ale nie teraz. Najpierw: ' + t + '.'; },
    zapisany: function (t) { return 'Krok zapisany: ' + t; }
  },
  {
    id: 'rece', typ: 'wybor', obraz: 'r1-koniec', karta: 'rece-20',
    tytul: 'Ile trwa mycie rąk?',
    sytuacja: { naglowek: 'PRZED OBIADEM', tresc: 'Sprintix wpadł do łazienki, opłukał ręce w dwie sekundy i już biegnie do stołówki. Co mu powiesz?' },
    opcje: [
      { id: 'dwadziescia', tekst: 'MYDŁO I OKOŁO 20 SEKUND, TYLE CO DWA RAZY "STO LAT"', dobry: true },
      { id: 'wystarczy', tekst: 'WYSTARCZY, WODA SPŁUKAŁA BRUD', dobry: false },
      { id: 'godzina', tekst: 'TRZEBA SZOROWAĆ PRZEZ PIĘĆ MINUT', dobry: false }
    ],
    zle: { wystarczy: 'Sama woda w dwie sekundy nie zmywa zarazków. Potrzebne jest mydło i czas.', godzina: 'Pięć minut to za dużo, skóra by ucierpiała. Wystarczy około 20 sekund z mydłem.' },
    dobrze: 'Około 20 sekund z mydłem. Sprintix zdąży zanucić "Sto lat" dwa razy i i tak będzie pierwszy w stołówce.'
  },
  {
    id: 'ruch', typ: 'wybor', obraz: 'dyzur-plac', karta: 'ruch-60',
    tytul: 'Ile ruchu dziennie?',
    sytuacja: { naglowek: 'PO SZKOLE', tresc: 'Energuś pyta: ile ruchu potrzebuje dziecko każdego dnia, żeby mieć prawdziwą energię?' },
    opcje: [
      { id: 'godzina', tekst: 'CO NAJMNIEJ GODZINĘ, MOŻE BYĆ W KAWAŁKACH', dobry: true },
      { id: 'piec', tekst: 'PIĘĆ MINUT WYSTARCZY', dobry: false },
      { id: 'tylko-trening', tekst: 'LICZY SIĘ TYLKO TRENING W KLUBIE', dobry: false }
    ],
    zle: { piec: 'Pięć minut to rozgrzewka, nie ruch na cały dzień. Ciało potrzebuje więcej.', 'tylko-trening': 'Bieganie na przerwie, rower, schody, taniec w pokoju, wszystko się liczy.' },
    dobrze: 'Co najmniej 60 minut dziennie, w dowolnych kawałkach. Przerwa na boisku plus droga rowerem to już sporo.'
  },
  {
    id: 'zlosc', typ: 'role', obraz: 'r5-scena', karta: 'dlugi-wydech',
    tytul: 'Brat jest wściekły',
    instrukcja: 'Młodszy brat przegrał w grę i krzyczy. Kto z drużyny pomoże w każdym kroku?',
    licznik: 'Przydzielone zadania', ilu: 3,
    krok: function (i) { return 'KROK ' + i + ' Z 3'; },
    zadania: [
      { id: 'oddech', tekst: 'Pomóż mu zrobić trzy długie wydechy, zanim cokolwiek powiesz', bohater: 'Kropelka' },
      { id: 'nazwa', tekst: 'Powiedz: "widzę, że jesteś zły, bo przegrałeś", żeby wiedział, że go rozumiesz', bohater: 'Uśmiechanka' },
      { id: 'ruch', tekst: 'Zaproponuj wyjście na podwórko, żeby złość wyszła przez nogi', bohater: 'Sprintix' }
    ],
    dystraktory: ['Energuś', 'Mózguś', 'Witaminka', 'Senek'],
    dobrze: function (imie) { return imie + ' bierze ten krok. Krzyk cichnie.'; },
    zle: function (imie) { return imie + ' pomoże w czym innym. Pomyśl, czyja moc pasuje do tego kroku.'; }
  },
  {
    id: 'slodycze', typ: 'wybor', obraz: 'r4-koniec', karta: 'slodycze-czasem',
    tytul: 'Podarunek od Glutona',
    sytuacja: { naglowek: 'STOŁÓWKA', tresc: 'Na stole leży torba słodyczy z karteczką "Częstujcie się codziennie! G.X.". Witaminka marszczy brwi. Co proponujesz drużynie?' },
    opcje: [
      { id: 'czasem', tekst: 'SŁODYCZE SĄ NA CZASEM. DZIŚ OWOC, SŁODYCZ W SOBOTĘ', dobry: true },
      { id: 'wszystko', tekst: 'ZJADAMY WSZYSTKO TERAZ, ŻEBY GLUTON NIE MIAŁ', dobry: false },
      { id: 'zakaz', tekst: 'SŁODYCZE SĄ ZŁE, NIGDY WIĘCEJ ŻADNYCH', dobry: false }
    ],
    zle: { wszystko: 'Gluton X właśnie na to liczy. Cała torba naraz to jego plan, nie twój.', zakaz: 'Zakazywanie wszystkiego nie działa. Słodycze mogą być, ale na czasem, nie na codziennie.' },
    dobrze: 'Słodycze są na czasem, nie na codziennie. Gluton X przegrał, bo drużyna nie dała się ani skusić, ani wystraszyć.'
  },
  {
    id: 'przed-sprawdzianem', typ: 'kolejnosc', obraz: 'r2-koniec', karta: 'sen-9-12',
    tytul: 'Wieczór przed sprawdzianem',
    opis: 'Mózguś ma jutro sprawdzian. Ułóż jego wieczór tak, żeby mózg zapamiętał najwięcej.',
    licznik: 'Ułożone kroki', tablica: 'PLAN NA WIECZÓR • UPUŚĆ TUTAJ', pusto: 'Od czego zaczyna?',
    kroki: [
      { id: 'powtorka', tekst: 'KRÓTKA POWTÓRKA', krotki: 'POWTÓRKA' },
      { id: 'plecak', tekst: 'SPAKUJ PLECAK', krotki: 'PLECAK' },
      { id: 'spokoj', tekst: 'COŚ SPOKOJNEGO BEZ EKRANU', krotki: 'SPOKÓJ' },
      { id: 'sen', tekst: 'SEN O STAŁEJ PORZE', krotki: 'SEN' }
    ],
    pulapki: [{ id: 'nocka', tekst: 'NAUKA DO PÓŁNOCY' }],
    zlaPulapka: 'Nauka do północy zabiera sen, a to podczas snu mózg porządkuje to, czego się uczyłeś. Krótka powtórka i spać.',
    zlaKolejnosc: function (t) { return 'To jest w planie, ale nie teraz. Najpierw: ' + t + '.'; },
    zapisany: function (t) { return 'Krok zapisany: ' + t; }
  },
  {
    id: 'pomoc', typ: 'wybor', obraz: 'r5-koniec', karta: 'pros-o-pomoc',
    tytul: 'Nie rozumiem zadania',
    sytuacja: { naglowek: 'LEKCJA', tresc: 'Senek nie rozumie zadania z matematyki. Wszyscy wokół piszą. Co robi bohater Akademii?' },
    opcje: [
      { id: 'pyta', tekst: 'PODNOSI RĘKĘ I MÓWI: NIE ROZUMIEM, MOŻE PANI POWTÓRZYĆ?', dobry: true },
      { id: 'udaje', tekst: 'UDAJE, ŻE PISZE, ŻEBY NIKT NIE ZAUWAŻYŁ', dobry: false },
      { id: 'sciaga', tekst: 'PRZEPISUJE OD SĄSIADA', dobry: false }
    ],
    zle: { udaje: 'Udawanie nie pomaga zrozumieć. Za godzinę zadanie będzie tak samo niejasne, tylko czasu będzie mniej.', sciaga: 'Przepisany wynik nie zostaje w głowie. Pytanie zostaje.' },
    dobrze: 'Prośba o pomoc to umiejętność. Bohater Akademii pyta, zamiast udawać. Zwykle okazuje się, że nie tylko on nie zrozumiał.'
  }
];

/* ---------- Misja na dziś: jedno małe zadanie poza ekranem ---------- */
ASZD.MISJE = [
  { id: 'cichy-w-domu', tekst: 'Zauważ dziś jeden cichy sygnał u kogoś w domu (ziewnięcie, milczenie, westchnienie) i zapytaj tę osobę, jak się czuje.' },
  { id: 'woda-rano', tekst: 'Wypij jutro szklankę wody zaraz po obudzeniu, zanim cokolwiek zjesz.' },
  { id: 'fakt-domysl', tekst: 'Złap się dziś na jednym domyśle ("na pewno...") i zamień go na pytanie.' },
  { id: 'ekran-30', tekst: 'Odłóż dziś ekran pół godziny przed snem. Zamiast niego książka albo rozmowa.' },
  { id: 'podziel-role', tekst: 'Zaproponuj dziś w domu podział ról przy jednym zadaniu: kto co robi przy kolacji albo sprzątaniu.' },
  { id: 'trzy-wydechy', tekst: 'Gdy dziś coś cię zdenerwuje, zrób trzy długie wydechy, zanim odpowiesz.' },
  { id: 'nazwij', tekst: 'Nazwij dziś na głos jedną swoją emocję: "jestem zmęczony", "cieszę się", "boję się".' },
  { id: 'rece', tekst: 'Przy każdym myciu rąk dziś zanuć w głowie dwa razy "Sto lat". Tyle trwa porządne mycie.' },
  { id: 'kolor', tekst: 'Zjedz dziś warzywo albo owoc w kolorze, którego wczoraj nie było na twoim talerzu.' },
  { id: 'ruch', tekst: 'Znajdź dziś godzinę ruchu, w kawałkach: przerwa, droga, podwórko. Policz, czy się uda.' },
  { id: 'zapytaj-obok', tekst: 'Podejdź dziś do kogoś, kto stoi sam, i powiedz jedno zdanie.' },
  { id: 'pros-o-pomoc', tekst: 'Poproś dziś o pomoc w jednej rzeczy, z którą zwykle męczysz się sam.' },
  { id: 'stala-pora', tekst: 'Połóż się dziś o tej samej porze co wczoraj. Rytm pomaga zasnąć.' },
  { id: 'sprawdz-zanim', tekst: 'Zanim dziś coś naprawisz albo poprawisz, zadaj jedno pytanie sprawdzające.' },
  { id: 'powiedz-plan', tekst: 'Powiedz dziś komuś w domu swój plan na popołudnie w trzech krokach.' },
  { id: 'odpoczynek', tekst: 'Zaplanuj dziś świadomie jedną przerwę na nic. Pięć minut bez ekranu i bez zadania.' },
  { id: 'zeby-2min', tekst: 'Wieczorem umyj zęby przez pełne dwie minuty. Możesz odliczać piosenką.' },
  { id: 'sluchaj', tekst: 'Wysłuchaj dziś kogoś do końca, nie przerywając, choćby przez minutę.' },
  { id: 'sniadanie', tekst: 'Zjedz jutro śniadanie przed wyjściem z domu. Zwróć uwagę, jak ci się myśli na pierwszej lekcji.' },
  { id: 'glosny-cichy', tekst: 'Zauważ dziś jedną sytuację, w której głośna rzecz zagłuszyła ważną cichą.' }
];

/* ---------- Pokaż rodzicowi: trzy zdania do powiedzenia i jedno pytanie ---------- */
ASZD.RODZIC = {
  1: {
    powiedz: ['Zanim coś zrobisz, najpierw się rozejrzyj.', 'Ważne wskazówki są ciche: ktoś ziewa, ktoś przygotował wodę.', 'Najpierw zatrzymaj, powiedz, co wiesz, ustal role.'],
    pytanie: 'Zapytaj mnie: jaka jest różnica między drzwiami a panelem z informacją?'
  },
  2: {
    powiedz: ['Cichy sygnał wraca w tym samym rytmie.', 'Żeby go zauważyć, trzeba popatrzeć dłużej niż sekundę.', 'Ciche potrzeby też się liczą.'],
    pytanie: 'Zapytaj mnie: po czym poznałem, który panel jest prawdziwy?'
  },
  3: {
    powiedz: ['Głośny alarm nie zawsze jest ważniejszy.', 'Najpierw ludzie, potem urządzenia.', 'Zanim coś zmienisz, zmierz.'],
    pytanie: 'Zapytaj mnie: który alarm sprawdziłem pierwszy i dlaczego?'
  },
  4: {
    powiedz: ['Fakt można zobaczyć albo zmierzyć.', 'Hipotezę można sprawdzić.', 'Domysł nie ma dowodu, dopóki go nie sprawdzisz.'],
    pytanie: 'Powiedz mi jedno zdanie, a ja zgadnę: fakt, hipoteza czy domysł?'
  },
  5: {
    powiedz: ['Każdy w zespole ma inną moc.', 'Dobry plan: zabezpiecz, sprawdź, powiedz, odpocznij.', 'Plan można poprawiać.'],
    pytanie: 'Zapytaj mnie: kto z drużyny pilnuje przerw i dlaczego to ważne?'
  }
};
