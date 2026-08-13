/* Kraina Pamięci: dane świata (krainy tematyczne, poziomy, treści kafelków, teksty) */
window.ASZP = window.ASZP || {};

ASZP.VERSION = '1.1.0';
ASZP.IMG = '../misja-energia/assets/img/';

/* portrety bohaterów (gospodarze krain i przewodnik Mózguś) */
ASZP.CHARS = {
  energus:     { img: 'portrait-energus.webp',     name: 'Energuś' },
  mozgus:      { img: 'portrait-mozgus.webp',      name: 'Mózguś' },
  witaminka:   { img: 'portrait-witaminka.webp',   name: 'Witaminka' },
  senek:       { img: 'portrait-senek.webp',       name: 'Senek' },
  kropelka:    { img: 'portrait-kropelka.webp',    name: 'Kropelka' },
  sprintix:    { img: 'portrait-sprintix.webp',    name: 'Sprintix' },
  usmiechanka: { img: 'portrait-usmiechanka.webp', name: 'Uśmiechanka' }
};

/* buźki emocji: inline SVG, złota twarz + granatowe rysy (spójne z herbem ASZ) */
function face(inner) {
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="#FFC300"/>${inner}</svg>`;
}
const N = '#131f4a';
const EMO = {
  radosc: face(`<circle cx="24" cy="26" r="3.4" fill="${N}"/><circle cx="40" cy="26" r="3.4" fill="${N}"/><path d="M19 37 Q32 50 45 37" fill="none" stroke="${N}" stroke-width="4" stroke-linecap="round"/>`),
  smutek: face(`<circle cx="24" cy="26" r="3.4" fill="${N}"/><circle cx="40" cy="26" r="3.4" fill="${N}"/><path d="M21 46 Q32 37 43 46" fill="none" stroke="${N}" stroke-width="4" stroke-linecap="round"/><path d="M20 32 q-4 8 0 10 q5 -2 0 -10" fill="#4FC3F7"/>`),
  zlosc: face(`<path d="M18 19 L29 24 M46 19 L35 24" stroke="${N}" stroke-width="4" stroke-linecap="round"/><circle cx="25" cy="30" r="3.2" fill="${N}"/><circle cx="39" cy="30" r="3.2" fill="${N}"/><path d="M22 46 Q32 41 42 46" fill="none" stroke="${N}" stroke-width="4" stroke-linecap="round"/>`),
  strach: face(`<circle cx="24" cy="27" r="5.5" fill="#fff" stroke="${N}" stroke-width="2.4"/><circle cx="40" cy="27" r="5.5" fill="#fff" stroke="${N}" stroke-width="2.4"/><circle cx="24" cy="27" r="2.2" fill="${N}"/><circle cx="40" cy="27" r="2.2" fill="${N}"/><ellipse cx="32" cy="45" rx="6" ry="7" fill="${N}"/>`),
  spokoj: face(`<path d="M20 27 q4 4.5 8 0 M36 27 q4 4.5 8 0" fill="none" stroke="${N}" stroke-width="3.4" stroke-linecap="round"/><path d="M24 41 Q32 47 40 41" fill="none" stroke="${N}" stroke-width="4" stroke-linecap="round"/>`),
  zdziwienie: face(`<path d="M19 18 q5 -5 10 0 M35 18 q5 -5 10 0" fill="none" stroke="${N}" stroke-width="3.2" stroke-linecap="round"/><circle cx="24" cy="28" r="3.4" fill="${N}"/><circle cx="40" cy="28" r="3.4" fill="${N}"/><circle cx="32" cy="45" r="5.5" fill="${N}"/>`),
  zmeczenie: face(`<path d="M20 29 q4 3 8 0 M36 29 q4 3 8 0" fill="none" stroke="${N}" stroke-width="3.4" stroke-linecap="round"/><ellipse cx="32" cy="46" rx="4.5" ry="5.5" fill="${N}"/><path d="M44 10 h8 l-8 8 h8" fill="none" stroke="${N}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`),
  milosc: face(`<path d="M24 22 c-3 -4 -9 -2 -9 3 c0 4 5 7 9 10 c4 -3 9 -6 9 -10 c0 -5 -6 -7 -9 -3 Z" fill="${N}" transform="translate(-4 0) scale(.82)" transform-origin="24 27"/><path d="M40 22 c-3 -4 -9 -2 -9 3 c0 4 5 7 9 10 c4 -3 9 -6 9 -10 c0 -5 -6 -7 -9 -3 Z" fill="${N}" transform="translate(4 0) scale(.82)" transform-origin="40 27"/><path d="M23 42 Q32 49 41 42" fill="none" stroke="${N}" stroke-width="4" stroke-linecap="round"/>`),
  niesmialosc: face(`<circle cx="24" cy="27" r="3.2" fill="${N}"/><circle cx="40" cy="27" r="3.2" fill="${N}"/><circle cx="18" cy="37" r="4.5" fill="#FF8A80" opacity=".85"/><circle cx="46" cy="37" r="4.5" fill="#FF8A80" opacity=".85"/><path d="M27 45 Q32 48 37 45" fill="none" stroke="${N}" stroke-width="3.6" stroke-linecap="round"/>`),
  duma: face(`<path d="M20 26 q4 -4.5 8 0 M36 26 q4 -4.5 8 0" fill="none" stroke="${N}" stroke-width="3.4" stroke-linecap="round"/><path d="M21 40 Q32 50 43 40" fill="none" stroke="${N}" stroke-width="4" stroke-linecap="round"/><polygon points="50,8 52,13 57,13 53,16 54,21 50,18 46,21 47,16 43,13 48,13" fill="${N}"/>`)
};

/* kroki wieczornego rytuału: styl kreskowy jak w misji Senka (currentColor = biały na kafelku) */
const SEN = {
  odloz_telefon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="3" y1="3" x2="21" y2="21" stroke="#ff8a80" stroke-width="2.6"/></svg>`,
  umyj_zeby: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3 L7 14 a3 3 0 0 0 6 0 L13 3"/><path d="M7 6 h6"/><path d="M16 8 c3 0 4 2 4 5 s-1 8-3 8-2-5-2-8"/></svg>`,
  kapiel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 13 h16 v3 a4 4 0 0 1 -4 4 h-8 a4 4 0 0 1 -4 -4 Z"/><path d="M6 13 V6 a2.5 2.5 0 0 1 5 0"/><circle cx="15" cy="7" r="1.3"/><circle cx="18" cy="4.5" r="1"/><path d="M6 20 l-1 2 M18 20 l1 2"/></svg>`,
  pizama: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3 L3 7 l3 3 2 -2 v13 h8 V8 l2 2 3 -3 -5 -4 a4 4 0 0 1 -8 0 Z"/><path d="M12 12 v2 M12 17 v2"/></svg>`,
  poczytaj: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5 a2 2 0 0 1 2-2 h5 v16 h-5 a2 2 0 0 0-2 2 z"/><path d="M21 5 a2 2 0 0 0-2-2 h-5 v16 h5 a2 2 0 0 1 2 2 z"/></svg>`,
  przygas_swiatlo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="5"/><path d="M9 15 h6 M10 18 h4 M11 21 h2"/><path d="M12 2 v1 M4 10 h-1 M21 10 h-1"/></svg>`,
  przytulanka: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="9" r="4.5"/><circle cx="7.5" cy="5" r="2"/><circle cx="16.5" cy="5" r="2"/><path d="M8 13 a5.5 5.5 0 0 0 8 0 l2 5 a2 2 0 0 1 -2 3 h-8 a2 2 0 0 1 -2 -3 Z"/><circle cx="10.5" cy="9" r=".6" fill="currentColor"/><circle cx="13.5" cy="9" r=".6" fill="currentColor"/></svg>`,
  spij: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13 A8 8 0 1 1 11 4 a6.5 6.5 0 0 0 9 9 z"/><path d="M14 3 h4 l-4 4 h4" stroke-width="1.6"/></svg>`
};

/* rejestr treści: klucz -> obrazek WebP albo inline SVG */
ASZP.CONTENT = {
  /* jedzenie: ilustracje z Misji (spójny brand, zero nowych plików) */
  owoce:     { name: 'Owoce',      img: 'item-owoce.webp' },
  warzywa:   { name: 'Warzywa',    img: 'item-warzywa.webp' },
  woda:      { name: 'Woda',       img: 'item-woda.webp' },
  jajka:     { name: 'Jajka',      img: 'item-jajka.webp' },
  ryby:      { name: 'Ryba',       img: 'item-ryby.webp' },
  chipsy:    { name: 'Chipsy',     img: 'item-chipsy.webp' },
  slodycze:  { name: 'Słodycze',   img: 'item-slodycze.webp' },
  energetyk: { name: 'Energetyk',  img: 'item-energetyk.webp' },
  telefon:   { name: 'Telefon',    img: 'item-telefon.webp' },
  /* emocje */
  radosc:      { name: 'Radość',       svg: EMO.radosc },
  smutek:      { name: 'Smutek',       svg: EMO.smutek },
  zlosc:       { name: 'Złość',        svg: EMO.zlosc },
  strach:      { name: 'Strach',       svg: EMO.strach },
  spokoj:      { name: 'Spokój',       svg: EMO.spokoj },
  zdziwienie:  { name: 'Zdziwienie',   svg: EMO.zdziwienie },
  zmeczenie:   { name: 'Zmęczenie',    svg: EMO.zmeczenie },
  milosc:      { name: 'Miłość',       svg: EMO.milosc },
  niesmialosc: { name: 'Nieśmiałość',  svg: EMO.niesmialosc },
  duma:        { name: 'Duma',         svg: EMO.duma },
  /* wieczorny rytuał */
  odloz_telefon:   { name: 'Odłóż telefon',   svg: SEN.odloz_telefon },
  umyj_zeby:       { name: 'Umyj zęby',       svg: SEN.umyj_zeby },
  kapiel:          { name: 'Kąpiel',          svg: SEN.kapiel },
  pizama:          { name: 'Piżama',          svg: SEN.pizama },
  poczytaj:        { name: 'Poczytaj',        svg: SEN.poczytaj },
  przygas_swiatlo: { name: 'Przygaś światło', svg: SEN.przygas_swiatlo },
  przytulanka:     { name: 'Przytulanka',     svg: SEN.przytulanka },
  spij:            { name: 'Śpij smacznie',   svg: SEN.spij }
};

ASZP.SETS = {
  emocje: ['radosc', 'smutek', 'zlosc', 'strach', 'spokoj', 'zdziwienie', 'zmeczenie', 'milosc', 'niesmialosc', 'duma'],
  jedzenie: ['owoce', 'warzywa', 'woda', 'jajka', 'ryby', 'chipsy', 'slodycze', 'energetyk', 'telefon'],
  sen: ['odloz_telefon', 'umyj_zeby', 'kapiel', 'pizama', 'poczytaj', 'przygas_swiatlo', 'przytulanka', 'spij']
};
ASZP.ALL_KEYS = [...ASZP.SETS.emocje, ...ASZP.SETS.jedzenie, ...ASZP.SETS.sen];

ASZP.iconHtml = function (key) {
  const it = ASZP.CONTENT[key];
  if (it.img) return `<img class="icon" src="${ASZP.IMG + it.img}" alt="" draggable="false" />`;
  return `<span class="icon icon-svg" aria-hidden="true">${it.svg}</span>`;
};
ASZP.nameOf = function (key) { return ASZP.CONTENT[key].name; };

/* trofeum turnieju: inline SVG */
ASZP.TROPHY = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M18 10 h28 v10 c0 10 -6 16 -14 18 c-8 -2 -14 -8 -14 -18 Z" fill="#FFC300"/><path d="M18 14 H8 c0 10 4 16 12 18 Z" fill="#FFC300" opacity=".7"/><path d="M46 14 h10 c0 10 -4 16 -12 18 Z" fill="#FFC300" opacity=".7"/><rect x="28" y="38" width="8" height="8" fill="#FFC300"/><rect x="20" y="46" width="24" height="8" rx="2" fill="#FFC300"/><polygon points="32,15 34,21 40,21 35,25 37,31 32,27 27,31 29,25 24,21 30,21" fill="#131f4a"/></svg>`;

/* krainy: temat zdrowego stylu życia + bohater-gospodarz + jedna mechanika pamięciowa */
ASZP.ZONES = [
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
  { id: 'p1', zone: 'emocje', nr: 1, cfg: { pairs: 3 } },
  { id: 'p2', zone: 'emocje', nr: 2, cfg: { pairs: 4 } },
  { id: 'p3', zone: 'emocje', nr: 3, cfg: { pairs: 6 } },
  { id: 'p4', zone: 'emocje', nr: 4, cfg: { pairs: 8 } },
  { id: 'p5', zone: 'emocje', nr: 5, cfg: { pairs: 10 } },

  { id: 'z1', zone: 'jedzenie', nr: 1, cfg: { count: 3, view: 6, rounds: 3, options: 4, shuffle: false } },
  { id: 'z2', zone: 'jedzenie', nr: 2, cfg: { count: 4, view: 5, rounds: 3, options: 4, shuffle: false } },
  { id: 'z3', zone: 'jedzenie', nr: 3, cfg: { count: 5, view: 5, rounds: 3, options: 4, shuffle: true } },
  { id: 'z4', zone: 'jedzenie', nr: 4, cfg: { count: 6, view: 4, rounds: 3, options: 4, shuffle: true } },
  { id: 'z5', zone: 'jedzenie', nr: 5, cfg: { count: 6, view: 3, rounds: 4, options: 4, shuffle: true } },

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
  unlockStars: 15,
  tiles: 6,
  start: 3,
  desc: 'Mózguś miesza emocje, witaminy i rytuał snu. Wzór rośnie bez końca, a Twój rekord zostaje zapisany.',
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
