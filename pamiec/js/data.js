/* Kraina Pamięci: dane świata (krainy, poziomy, itemy, teksty Mózgusia) */
window.ASZP = window.ASZP || {};

ASZP.VERSION = '1.0.0';
ASZP.IMG = '../misja-energia/assets/img/';

/* ilustracje wielokrotnego użytku z Misji: Prawdziwa Energia (spójny brand, zero nowych plików) */
ASZP.ITEMS = {
  owoce:     { img: 'item-owoce.webp',     name: 'Owoce' },
  warzywa:   { img: 'item-warzywa.webp',   name: 'Warzywa' },
  woda:      { img: 'item-woda.webp',      name: 'Woda' },
  jajka:     { img: 'item-jajka.webp',     name: 'Jajka' },
  ryby:      { img: 'item-ryby.webp',      name: 'Ryba' },
  chipsy:    { img: 'item-chipsy.webp',    name: 'Chipsy' },
  slodycze:  { img: 'item-slodycze.webp',  name: 'Słodycze' },
  energetyk: { img: 'item-energetyk.webp', name: 'Energetyk' },
  telefon:   { img: 'item-telefon.webp',   name: 'Telefon' }
};

ASZP.CHARS = {
  energus:     { img: 'portrait-energus.webp',     name: 'Energuś' },
  mozgus:      { img: 'portrait-mozgus.webp',      name: 'Mózguś' },
  witaminka:   { img: 'portrait-witaminka.webp',   name: 'Witaminka' },
  senek:       { img: 'portrait-senek.webp',       name: 'Senek' },
  kropelka:    { img: 'portrait-kropelka.webp',    name: 'Kropelka' },
  sprintix:    { img: 'portrait-sprintix.webp',    name: 'Sprintix' },
  usmiechanka: { img: 'portrait-usmiechanka.webp', name: 'Uśmiechanka' }
};

ASZP.ITEM_KEYS = Object.keys(ASZP.ITEMS);
ASZP.CHAR_KEYS = Object.keys(ASZP.CHARS);
/* kafelki wzorów: tylko pozytywne obrazki (zdrowe itemy + bohaterowie), bez pułapek Glutona */
ASZP.SEQ_POOL = ['owoce', 'warzywa', 'woda', 'jajka', 'ryby', ...ASZP.CHAR_KEYS];

ASZP.imgOf = function (key) {
  const it = ASZP.ITEMS[key] || ASZP.CHARS[key];
  return ASZP.IMG + it.img;
};
ASZP.nameOf = function (key) {
  const it = ASZP.ITEMS[key] || ASZP.CHARS[key];
  return it.name;
};

/* emblematy krain: proste inline SVG w brandowych kolorach */
const EMBLEMS = {
  wieza: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="20" y="18" width="24" height="38" rx="3" fill="#FFC300"/><rect x="16" y="12" width="8" height="10" rx="2" fill="#FFC300"/><rect x="28" y="12" width="8" height="10" rx="2" fill="#FFC300"/><rect x="40" y="12" width="8" height="10" rx="2" fill="#FFC300"/><rect x="26" y="42" width="12" height="14" rx="2" fill="#131f4a"/><circle cx="32" cy="30" r="5" fill="#131f4a"/><circle cx="32" cy="30" r="2" fill="#FFC300"/></svg>`,
  ogrod: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 56 V30" stroke="#FFC300" stroke-width="4" stroke-linecap="round"/><path d="M32 40 C 20 38 14 30 14 20 C 26 20 32 26 32 36 C 32 26 38 20 50 20 C 50 30 44 38 32 40 Z" fill="#FFC300"/><circle cx="32" cy="16" r="7" fill="#FFC300"/><circle cx="32" cy="16" r="3" fill="#131f4a"/></svg>`,
  jaskinia: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 56 C 8 30 20 12 32 12 C 44 12 56 30 56 56 Z" fill="#FFC300"/><path d="M22 56 C 22 42 26 34 32 34 C 38 34 42 42 42 56 Z" fill="#131f4a"/><circle cx="32" cy="24" r="3" fill="#131f4a"/></svg>`,
  turniej: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M18 10 h28 v10 c0 10 -6 16 -14 18 c-8 -2 -14 -8 -14 -18 Z" fill="#FFC300"/><path d="M18 14 H8 c0 10 4 16 12 18 Z" fill="#FFC300" opacity=".7"/><path d="M46 14 h10 c0 10 -4 16 -12 18 Z" fill="#FFC300" opacity=".7"/><rect x="28" y="38" width="8" height="8" fill="#FFC300"/><rect x="20" y="46" width="24" height="8" rx="2" fill="#FFC300"/><polygon points="32,15 34,21 40,21 35,25 37,31 32,27 27,31 29,25 24,21 30,21" fill="#131f4a"/></svg>`
};
ASZP.EMBLEMS = EMBLEMS;

ASZP.ZONES = [
  {
    id: 'wieza',
    game: 'wzory',
    name: 'Wieża Wzorów',
    desc: 'Kafelki zapalają się w tajemnym rytmie. Zapamiętaj kolejność i powtórz ją bez pomyłki.',
    tip: 'Mózguś radzi: powtarzaj wzór w głowie, kiedy się zapala. Możesz też cicho nazywać obrazki!',
    howto: 'Patrz, w jakiej kolejności zapalają się kafelki, a potem klikaj je w tej samej kolejności. Masz 3 iskry, pomyłka gasi jedną, ale Mózguś pokaże wzór jeszcze raz.'
  },
  {
    id: 'ogrod',
    game: 'pary',
    name: 'Ogród Par',
    desc: 'W ogrodzie ukryły się bliźniacze obrazki. Odkrywaj karty i łącz je w pary.',
    tip: 'Mózguś radzi: zapamiętuj, gdzie leżała odkryta karta. Wróci ci to z nawiązką!',
    howto: 'Odkrywaj po dwie karty. Jeśli obrazki są takie same, para zostaje odkryta. Im mniej ruchów, tym więcej gwiazdek!'
  },
  {
    id: 'jaskinia',
    game: 'znikanie',
    name: 'Jaskinia Zniknięć',
    desc: 'Psotny cień Glutona chowa przedmioty. Zapamiętaj planszę i odkryj, co zniknęło.',
    tip: 'Mózguś radzi: policz przedmioty i ułóż z nich w głowie krótką historyjkę.',
    howto: 'Najpierw dobrze przyjrzyj się przedmiotom na planszy. Potem jeden zniknie. Wskaż na dole, którego brakuje. Masz 3 iskry i 3 rundy.'
  }
];

/* poziomy: odblokowywane po kolei w obrębie krainy (1+ gwiazdka na poprzednim) */
ASZP.LEVELS = [
  { id: 'w1', zone: 'wieza', nr: 1, cfg: { tiles: 4, rounds: [2, 3, 4] } },
  { id: 'w2', zone: 'wieza', nr: 2, cfg: { tiles: 4, rounds: [3, 4, 5] } },
  { id: 'w3', zone: 'wieza', nr: 3, cfg: { tiles: 5, rounds: [3, 4, 5, 6] } },
  { id: 'w4', zone: 'wieza', nr: 4, cfg: { tiles: 5, rounds: [4, 5, 6, 7] } },
  { id: 'w5', zone: 'wieza', nr: 5, cfg: { tiles: 6, rounds: [4, 5, 6, 7, 8] } },

  { id: 'p1', zone: 'ogrod', nr: 1, cfg: { pairs: 3, mix: false } },
  { id: 'p2', zone: 'ogrod', nr: 2, cfg: { pairs: 4, mix: false } },
  { id: 'p3', zone: 'ogrod', nr: 3, cfg: { pairs: 6, mix: false } },
  { id: 'p4', zone: 'ogrod', nr: 4, cfg: { pairs: 8, mix: false } },
  { id: 'p5', zone: 'ogrod', nr: 5, cfg: { pairs: 8, mix: true } },

  { id: 'z1', zone: 'jaskinia', nr: 1, cfg: { count: 3, view: 6, rounds: 3, options: 4, shuffle: false } },
  { id: 'z2', zone: 'jaskinia', nr: 2, cfg: { count: 4, view: 6, rounds: 3, options: 4, shuffle: false } },
  { id: 'z3', zone: 'jaskinia', nr: 3, cfg: { count: 5, view: 5, rounds: 3, options: 4, shuffle: true } },
  { id: 'z4', zone: 'jaskinia', nr: 4, cfg: { count: 6, view: 5, rounds: 3, options: 6, shuffle: true } },
  { id: 'z5', zone: 'jaskinia', nr: 5, cfg: { count: 8, view: 4, rounds: 3, options: 6, shuffle: true } }
];

ASZP.levelById = function (id) { return ASZP.LEVELS.find(l => l.id === id); };
ASZP.zoneById = function (id) { return ASZP.ZONES.find(z => z.id === id); };
ASZP.levelsOf = function (zoneId) { return ASZP.LEVELS.filter(l => l.zone === zoneId); };
ASZP.MAX_STARS = ASZP.LEVELS.length * 3;

/* finał: turniej bez końca na mechanice wzorów, liczy się rekord sekwencji */
ASZP.TURNIEJ = {
  id: 'turniej',
  name: 'Turniej Mistrza Pamięci',
  unlockStars: 15,
  tiles: 6,
  start: 3,
  desc: 'Wzór rośnie bez końca. Jak długą sekwencję zapamiętasz? Twój rekord zostaje zapisany.',
  howto: 'Zasady jak w Wieży Wzorów, ale sekwencja wydłuża się z każdą rundą i nigdy się nie kończy. Masz 3 iskry. Rekord to najdłuższy wzór, który udało się powtórzyć.',
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
