/* Kraina Pamięci: dane świata (6 krain bohaterów, poziomy, treści kafelków, teksty) */
window.ASZP = window.ASZP || {};

ASZP.VERSION = '2.0.0';
ASZP.IMG = '../misja-energia/assets/img/';   /* ilustracje wielokrotnego użytku z Misji */
ASZP.PIMG = 'assets/img/';                   /* ilustracje wygenerowane dla Krainy Pamięci */

/* portrety bohaterów (gospodarze krain i przewodnik Mózguś): kadry z plakatów A3, styl komiksowy */
ASZP.CHARS = {
  energus:     { img: 'host-energus.webp',     name: 'Energuś' },
  mozgus:      { img: 'host-mozgus.webp',      name: 'Mózguś' },
  witaminka:   { img: 'host-witaminka.webp',   name: 'Witaminka' },
  senek:       { img: 'host-senek.webp',       name: 'Senek' },
  kropelka:    { img: 'host-kropelka.webp',    name: 'Kropelka' },
  sprintix:    { img: 'host-sprintix.webp',    name: 'Sprintix' },
  usmiechanka: { img: 'host-usmiechanka.webp', name: 'Uśmiechanka' },
  doktorbanka: { img: 'host-doktorbanka.webp', name: 'Doktor Bańka' }
};

/* rejestr treści kafelków: klucz -> nazwa + plik (misja: true = ilustracja z Misji) */
ASZP.CONTENT = {
  /* Kraina Energii (Energuś): co ładuje prawdziwe baterie */
  owsianka: { name: 'Owsianka',       img: 'ene-owsianka.webp' },
  banan:    { name: 'Banan',          img: 'ene-banan.webp' },
  orzechy:  { name: 'Orzechy',        img: 'ene-orzechy.webp' },
  jogurt:   { name: 'Jogurt',         img: 'ene-jogurt.webp' },
  kanapka:  { name: 'Kanapka',        img: 'ene-kanapka.webp' },
  miod:     { name: 'Miód',           img: 'ene-miod.webp' },
  slonce:   { name: 'Poranne słońce', img: 'ene-slonce.webp' },
  spacer:   { name: 'Spacer',         img: 'ene-spacer.webp' },
  bateria:  { name: 'Pełna bateria',  img: 'ene-bateria.webp' },

  /* Kraina Witamin (Witaminka): stół z jedzeniem, ilustracje z Misji */
  owoce:     { name: 'Owoce',     img: 'item-owoce.webp',     misja: true },
  warzywa:   { name: 'Warzywa',   img: 'item-warzywa.webp',   misja: true },
  woda:      { name: 'Woda',      img: 'item-woda.webp',      misja: true },
  jajka:     { name: 'Jajka',     img: 'item-jajka.webp',     misja: true },
  ryby:      { name: 'Ryba',      img: 'item-ryby.webp',      misja: true },
  chipsy:    { name: 'Chipsy',    img: 'item-chipsy.webp',    misja: true },
  slodycze:  { name: 'Słodycze',  img: 'item-slodycze.webp',  misja: true },
  energetyk: { name: 'Energetyk', img: 'item-energetyk.webp', misja: true },
  telefon:   { name: 'Telefon',   img: 'item-telefon.webp',   misja: true },

  /* Kraina Kropelki: co nawadnia */
  szklanka:   { name: 'Szklanka wody',   img: 'kro-szklanka.webp' },
  bidon:      { name: 'Bidon',           img: 'kro-bidon.webp' },
  arbuz:      { name: 'Arbuz',           img: 'kro-arbuz.webp' },
  ogorek:     { name: 'Ogórek',          img: 'kro-ogorek.webp' },
  pomarancza: { name: 'Pomarańcza',      img: 'kro-pomarancza.webp' },
  zupa:       { name: 'Zupa',            img: 'kro-zupa.webp' },
  mleko:      { name: 'Mleko',           img: 'kro-mleko.webp' },
  kompot:     { name: 'Kompot',          img: 'kro-kompot.webp' },
  herbatka:   { name: 'Ziołowa herbatka', img: 'kro-herbatka.webp' },
  kokos:      { name: 'Kokos',           img: 'kro-kokos.webp' },

  /* Kraina Ruchu (Sprintix): zabawy i sprzęt do ruszania się */
  skakanka:   { name: 'Skakanka',    img: 'spr-skakanka.webp' },
  pilka:      { name: 'Piłka',       img: 'spr-pilka.webp' },
  rower:      { name: 'Rower',       img: 'spr-rower.webp' },
  hulajnoga:  { name: 'Hulajnoga',   img: 'spr-hulajnoga.webp' },
  trampolina: { name: 'Trampolina',  img: 'spr-trampolina.webp' },
  buty:       { name: 'Buty sportowe', img: 'spr-buty.webp' },
  plywanie:   { name: 'Pływanie',    img: 'spr-plywanie.webp' },
  latawiec:   { name: 'Latawiec',    img: 'spr-latawiec.webp' },

  /* Kraina Emocji (Uśmiechanka): buźki emocji */
  radosc:      { name: 'Radość',      img: 'emo-radosc.webp' },
  smutek:      { name: 'Smutek',      img: 'emo-smutek.webp' },
  zlosc:       { name: 'Złość',       img: 'emo-zlosc.webp' },
  strach:      { name: 'Strach',      img: 'emo-strach.webp' },
  spokoj:      { name: 'Spokój',      img: 'emo-spokoj.webp' },
  zdziwienie:  { name: 'Zdziwienie',  img: 'emo-zdziwienie.webp' },
  zmeczenie:   { name: 'Zmęczenie',   img: 'emo-zmeczenie.webp' },
  milosc:      { name: 'Miłość',      img: 'emo-milosc.webp' },
  niesmialosc: { name: 'Nieśmiałość', img: 'emo-niesmialosc.webp' },
  duma:        { name: 'Duma',        img: 'emo-duma.webp' },

  /* Kraina Snu (Senek): wieczorny rytuał */
  odloz_telefon:   { name: 'Odłóż telefon',   img: 'sen-telefon.webp' },
  umyj_zeby:       { name: 'Umyj zęby',       img: 'sen-zeby.webp' },
  kapiel:          { name: 'Kąpiel',          img: 'sen-kapiel.webp' },
  pizama:          { name: 'Piżama',          img: 'sen-pizama.webp' },
  poczytaj:        { name: 'Poczytaj',        img: 'sen-ksiazka.webp' },
  przygas_swiatlo: { name: 'Przygaś światło', img: 'sen-lampka.webp' },
  przytulanka:     { name: 'Przytulanka',     img: 'sen-mis.webp' },
  spij:            { name: 'Śpij smacznie',   img: 'sen-ksiezyc.webp' },

  /* Kraina Higieny (Doktor Bańka): czystość i profilaktyka */
  mydlo:      { name: 'Mydło',                img: 'hig-mydlo.webp' },
  zel:        { name: 'Żel do dezynfekcji',   img: 'hig-zel.webp' },
  recznik:    { name: 'Ręcznik',              img: 'hig-recznik.webp' },
  grzebien:   { name: 'Grzebień',             img: 'hig-grzebien.webp' },
  chusteczki: { name: 'Chusteczki',           img: 'hig-chusteczki.webp' },
  plaster:    { name: 'Plaster',              img: 'hig-plaster.webp' },
  szampon:    { name: 'Szampon',              img: 'hig-szampon.webp' },
  banki:      { name: 'Bańki mydlane',        img: 'hig-banki.webp' },
  termometr:  { name: 'Termometr',            img: 'hig-termometr.webp' },
  apteczka:   { name: 'Apteczka',             img: 'hig-apteczka.webp' }
};

ASZP.SETS = {
  energia:  ['owsianka', 'banan', 'orzechy', 'jogurt', 'kanapka', 'miod', 'slonce', 'spacer', 'bateria'],
  jedzenie: ['owoce', 'warzywa', 'woda', 'jajka', 'ryby', 'chipsy', 'slodycze', 'energetyk', 'telefon'],
  woda:     ['szklanka', 'bidon', 'arbuz', 'ogorek', 'pomarancza', 'zupa', 'mleko', 'kompot', 'herbatka', 'kokos'],
  ruch:     ['skakanka', 'pilka', 'rower', 'hulajnoga', 'trampolina', 'buty', 'plywanie', 'latawiec'],
  emocje:   ['radosc', 'smutek', 'zlosc', 'strach', 'spokoj', 'zdziwienie', 'zmeczenie', 'milosc', 'niesmialosc', 'duma'],
  sen:      ['odloz_telefon', 'umyj_zeby', 'kapiel', 'pizama', 'poczytaj', 'przygas_swiatlo', 'przytulanka', 'spij'],
  higiena:  ['mydlo', 'zel', 'recznik', 'grzebien', 'chusteczki', 'plaster', 'szampon', 'banki', 'termometr', 'apteczka']
};
ASZP.ALL_KEYS = Object.values(ASZP.SETS).flat();

ASZP.iconHtml = function (key) {
  const it = ASZP.CONTENT[key];
  const base = it.misja ? ASZP.IMG : ASZP.PIMG;
  return `<img class="icon" src="${base + it.img}" alt="" draggable="false" />`;
};
ASZP.nameOf = function (key) { return ASZP.CONTENT[key].name; };

/* trofeum turnieju: inline SVG */
ASZP.TROPHY = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M18 10 h28 v10 c0 10 -6 16 -14 18 c-8 -2 -14 -8 -14 -18 Z" fill="#FFC300"/><path d="M18 14 H8 c0 10 4 16 12 18 Z" fill="#FFC300" opacity=".7"/><path d="M46 14 h10 c0 10 -4 16 -12 18 Z" fill="#FFC300" opacity=".7"/><rect x="28" y="38" width="8" height="8" fill="#FFC300"/><rect x="20" y="46" width="24" height="8" rx="2" fill="#FFC300"/><polygon points="32,15 34,21 40,21 35,25 37,31 32,27 27,31 29,25 24,21 30,21" fill="#131f4a"/></svg>`;

/* krainy: dzień z Akademią od rana do wieczora, każda postać ma swoją krainę */
ASZP.ZONES = [
  {
    id: 'energia',
    host: 'energus',
    game: 'znikanie',
    set: 'energia',
    name: 'Kraina Energii',
    desc: 'Energuś pakuje plecak pełen prawdziwej energii, ale Gluton podkrada zapasy. Zapamiętaj, co gdzie leży!',
    tip: 'Energuś radzi: powiedz sobie po kolei, co widzisz, wtedy nic Ci nie umknie.',
    howto: 'Najpierw dobrze przyjrzyj się rzeczom na planszy. Potem jedna zniknie. Wskaż na dole, czego brakuje. Pomyłka gasi iskrę, masz 3 iskry.'
  },
  {
    id: 'higiena',
    host: 'doktorbanka',
    game: 'pary',
    set: 'higiena',
    name: 'Kraina Higieny',
    desc: 'Doktor Bańka pilnuje czystości i profilaktyki. Odkrywaj karty i łącz je w pary.',
    tip: 'Doktor Bańka radzi: powtórz nazwę przedmiotu, kiedy go odkrywasz, pamięć lubi słowa!',
    howto: 'Odkrywaj po dwie karty. Jeśli obrazki są takie same, para zostaje odkryta. Im mniej ruchów, tym więcej gwiazdek!'
  },
  {
    id: 'jedzenie',
    host: 'witaminka',
    game: 'znikanie',
    set: 'jedzenie',
    name: 'Kraina Witamin',
    desc: 'Witaminka nakrywa stół, ale Gluton podkrada rzeczy po kryjomu. Zapamiętaj, co gdzie leży!',
    tip: 'Witaminka radzi: powiedz sobie po kolei, co widzisz na stole, zanim Gluton coś schowa.',
    howto: 'Najpierw dobrze przyjrzyj się rzeczom na stole. Potem jedna zniknie. Wskaż na dole, czego brakuje. Pomyłka gasi iskrę, masz 3 iskry.'
  },
  {
    id: 'woda',
    host: 'kropelka',
    game: 'pary',
    set: 'woda',
    name: 'Kraina Kropelki',
    desc: 'Kropelka zbiera wszystko, co nawadnia. Odkrywaj karty i łącz je w pary.',
    tip: 'Kropelka radzi: zapamiętuj, gdzie leżała odkryta karta. Wróci Ci to z nawiązką!',
    howto: 'Odkrywaj po dwie karty. Jeśli obrazki są takie same, para zostaje odkryta. Im mniej ruchów, tym więcej gwiazdek!'
  },
  {
    id: 'ruch',
    host: 'sprintix',
    game: 'wzory',
    set: 'ruch',
    name: 'Kraina Ruchu',
    desc: 'Sprintix układa tor przeszkód. Zapamiętaj kolejność zabaw i powtórz cały trening.',
    tip: 'Sprintix radzi: powtarzaj kolejność w głowie jak okrzyk drużyny. A potem rusz się naprawdę!',
    howto: 'Patrz, w jakiej kolejności zapalają się kafelki treningu, a potem klikaj je w tej samej kolejności. Masz 3 iskry, pomyłka gasi jedną, ale Sprintix pokaże trening jeszcze raz.'
  },
  {
    id: 'emocje',
    host: 'usmiechanka',
    game: 'pary',
    set: 'emocje',
    name: 'Kraina Emocji',
    desc: 'Uśmiechanka uczy rozpoznawać uczucia. Odkrywaj karty i znajdź pary takich samych emocji.',
    tip: 'Uśmiechanka radzi: nazwij głośno emocję z odkrytej karty, wtedy łatwiej ją zapamiętasz!',
    howto: 'Odkrywaj po dwie karty i szukaj takich samych emocji. Jeśli buźki do siebie pasują, para zostaje odkryta. Im mniej ruchów, tym więcej gwiazdek!'
  },
  {
    id: 'sen',
    host: 'senek',
    game: 'wzory',
    set: 'sen',
    name: 'Kraina Snu',
    desc: 'Senek prowadzi wieczorny rytuał. Zapamiętaj kolejność jego kroków, a sen będzie słodki.',
    tip: 'Senek radzi: powtarzaj kroki rytuału w głowie. A potem wypróbuj je dziś wieczorem!',
    howto: 'Patrz, w jakiej kolejności zapalają się kroki rytuału, a potem klikaj je w tej samej kolejności. Masz 3 iskry, pomyłka gasi jedną, ale Senek pokaże rytuał jeszcze raz.'
  }
];

/* poziomy: odblokowywane po kolei w obrębie krainy (1+ gwiazdka na poprzednim) */
ASZP.LEVELS = [
  { id: 'e1', zone: 'energia', nr: 1, cfg: { count: 3, view: 6, rounds: 3, options: 4, shuffle: false } },
  { id: 'e2', zone: 'energia', nr: 2, cfg: { count: 4, view: 5, rounds: 3, options: 4, shuffle: false } },
  { id: 'e3', zone: 'energia', nr: 3, cfg: { count: 5, view: 5, rounds: 3, options: 4, shuffle: true } },
  { id: 'e4', zone: 'energia', nr: 4, cfg: { count: 6, view: 4, rounds: 3, options: 4, shuffle: true } },
  { id: 'e5', zone: 'energia', nr: 5, cfg: { count: 6, view: 3, rounds: 4, options: 4, shuffle: true } },

  { id: 'h1', zone: 'higiena', nr: 1, cfg: { pairs: 3 } },
  { id: 'h2', zone: 'higiena', nr: 2, cfg: { pairs: 4 } },
  { id: 'h3', zone: 'higiena', nr: 3, cfg: { pairs: 6 } },
  { id: 'h4', zone: 'higiena', nr: 4, cfg: { pairs: 8 } },
  { id: 'h5', zone: 'higiena', nr: 5, cfg: { pairs: 10 } },

  { id: 'z1', zone: 'jedzenie', nr: 1, cfg: { count: 3, view: 6, rounds: 3, options: 4, shuffle: false } },
  { id: 'z2', zone: 'jedzenie', nr: 2, cfg: { count: 4, view: 5, rounds: 3, options: 4, shuffle: false } },
  { id: 'z3', zone: 'jedzenie', nr: 3, cfg: { count: 5, view: 5, rounds: 3, options: 4, shuffle: true } },
  { id: 'z4', zone: 'jedzenie', nr: 4, cfg: { count: 6, view: 4, rounds: 3, options: 4, shuffle: true } },
  { id: 'z5', zone: 'jedzenie', nr: 5, cfg: { count: 6, view: 3, rounds: 4, options: 4, shuffle: true } },

  { id: 'k1', zone: 'woda', nr: 1, cfg: { pairs: 3 } },
  { id: 'k2', zone: 'woda', nr: 2, cfg: { pairs: 4 } },
  { id: 'k3', zone: 'woda', nr: 3, cfg: { pairs: 6 } },
  { id: 'k4', zone: 'woda', nr: 4, cfg: { pairs: 8 } },
  { id: 'k5', zone: 'woda', nr: 5, cfg: { pairs: 10 } },

  { id: 's1', zone: 'ruch', nr: 1, cfg: { tiles: 4, rounds: [2, 3, 4] } },
  { id: 's2', zone: 'ruch', nr: 2, cfg: { tiles: 4, rounds: [3, 4, 5] } },
  { id: 's3', zone: 'ruch', nr: 3, cfg: { tiles: 5, rounds: [3, 4, 5, 6] } },
  { id: 's4', zone: 'ruch', nr: 4, cfg: { tiles: 5, rounds: [4, 5, 6, 7] } },
  { id: 's5', zone: 'ruch', nr: 5, cfg: { tiles: 6, rounds: [4, 5, 6, 7, 8] } },

  { id: 'p1', zone: 'emocje', nr: 1, cfg: { pairs: 3 } },
  { id: 'p2', zone: 'emocje', nr: 2, cfg: { pairs: 4 } },
  { id: 'p3', zone: 'emocje', nr: 3, cfg: { pairs: 6 } },
  { id: 'p4', zone: 'emocje', nr: 4, cfg: { pairs: 8 } },
  { id: 'p5', zone: 'emocje', nr: 5, cfg: { pairs: 10 } },

  { id: 'w1', zone: 'sen', nr: 1, cfg: { tiles: 4, rounds: [2, 3, 4] } },
  { id: 'w2', zone: 'sen', nr: 2, cfg: { tiles: 4, rounds: [3, 4, 5] } },
  { id: 'w3', zone: 'sen', nr: 3, cfg: { tiles: 5, rounds: [3, 4, 5, 6] } },
  { id: 'w4', zone: 'sen', nr: 4, cfg: { tiles: 5, rounds: [4, 5, 6, 7] } },
  { id: 'w5', zone: 'sen', nr: 5, cfg: { tiles: 6, rounds: [4, 5, 6, 7, 8] } }
];

ASZP.levelById = function (id) { return ASZP.LEVELS.find(l => l.id === id); };
ASZP.zoneById = function (id) { return ASZP.ZONES.find(z => z.id === id); };
ASZP.levelsOf = function (zoneId) { return ASZP.LEVELS.filter(l => l.zone === zoneId); };
ASZP.MAX_STARS = ASZP.LEVELS.length * 3;

/* finał: turniej bez końca u Mózgusia, kafelki ze wszystkich krain, liczy się rekord */
ASZP.TURNIEJ = {
  id: 'turniej',
  name: 'Turniej Mistrza Pamięci',
  unlockStars: 30,
  tiles: 6,
  start: 3,
  desc: 'Mózguś miesza kafelki ze wszystkich krain. Wzór rośnie bez końca, a Twój rekord zostaje zapisany.',
  howto: 'Kafelki zapalają się w kolejności, którą powtarzasz. Sekwencja rośnie z każdą rundą i nigdy się nie kończy. Masz 3 iskry. Rekord to najdłuższy wzór, który udało się powtórzyć.',
  badges: [
    { at: 12, name: 'Złoty Mistrz Pamięci' },
    { at: 9,  name: 'Srebrny Mistrz Pamięci' },
    { at: 6,  name: 'Brązowy Mistrz Pamięci' }
  ]
};

/* kolory awatarów graczy */
ASZP.COLORS = ['#FFC300', '#4FC3F7', '#81C784', '#FF8A80', '#B39DDB', '#FFB74D'];

/* pochwały na ekranie wyniku */
ASZP.PRAISE = ['Brawo!', 'Super pamięć!', 'Mistrzowsko!', 'Mózguś jest dumny!', 'Ale trening!'];

/* tasowanie Fishera-Yatesa, zwraca nową tablicę */
ASZP.shuffle = function (arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
