/* Misja: Prawdziwa Energia — dane gry (postacie wg ebooka, itemy, misje, dialogi) */
window.ASZ = window.ASZ || {};

ASZ.VERSION = '2.0.0';
ASZ.SHOP_URL = 'https://payhip.com/AkademiaSuperZdrowia'; // TODO: podmienić na własną domenę po starcie

ASZ.CHARS = {
  energus:     { name: 'Energuś',     img: 'assets/img/portrait-energus.webp' },
  mozgus:      { name: 'Mózguś',      img: 'assets/img/portrait-mozgus.webp' },
  witaminka:   { name: 'Witaminka',   img: 'assets/img/portrait-witaminka.webp' },
  senek:       { name: 'Senek',       img: 'assets/img/portrait-senek.webp' },
  kropelka:    { name: 'Kropelka',    img: 'assets/img/portrait-kropelka.webp' },
  sprintix:    { name: 'Sprintix',    img: 'assets/img/portrait-sprintix.webp' },
  usmiechanka: { name: 'Uśmiechanka', img: 'assets/img/portrait-usmiechanka.webp' },
  gluton:      { name: 'Gluton X',    img: 'assets/img/gluton.webp' }
};

/* itemy: good = daje energię, junk = pułapka Glutona */
ASZ.ITEMS = {
  owoce:     { img: 'assets/img/item-owoce.webp',     name: 'Owoce',           good: true },
  warzywa:   { img: 'assets/img/item-warzywa.webp',   name: 'Warzywa',         good: true },
  woda:      { img: 'assets/img/item-woda.webp',      name: 'Woda',            good: true },
  jajka:     { img: 'assets/img/item-jajka.webp',     name: 'Jajka',           good: true },
  ryby:      { img: 'assets/img/item-ryby.webp',      name: 'Ryba',            good: true },
  chipsy:    { img: 'assets/img/item-chipsy.webp',    name: 'Chipsy',          good: false },
  slodycze:  { img: 'assets/img/item-slodycze.webp',  name: 'Góra słodyczy',   good: false },
  energetyk: { img: 'assets/img/item-energetyk.webp', name: 'Energetyk',       good: false },
  telefon:   { img: 'assets/img/item-telefon.webp',   name: 'Telefon w nocy',  good: false }
};
ASZ.GOOD_KEYS = ['owoce', 'warzywa', 'woda', 'jajka', 'ryby'];
ASZ.JUNK_KEYS = ['chipsy', 'slodycze', 'energetyk', 'telefon'];

ASZ.INTRO = [
  { img: 'assets/img/scene-corridor.webp', text: 'W szkole dzieje się coś dziwnego. Dzieci ziewają na lekcjach, nikomu nie chce się biegać, a na przerwach słychać tylko szuranie kapci…' },
  { img: 'assets/img/scene-hq.webp',       text: 'W Akademii Super Zdrowia rozbrzmiewa alarm! Kryształ Prawdziwej Energii zgasł. To sprawka Glutona X, który karmi szkołę chipsami, słodyczami i nocnym graniem.' },
  { img: 'assets/img/scene-run.webp',      text: 'Drużyna rusza do akcji. Każda misja ładuje jeden segment Kryształu. Gdy zaświeci cały, staniecie do pojedynku z Glutonem X. Powodzenia!' }
];

ASZ.OUTRO_SCENE = { img: 'assets/img/scene-victory.webp', text: 'Miasto znów tętni życiem, a drużyna świętuje. Gluton X uciekł, ale obiecał wrócić… Ta historia czeka na Ciebie w komiksie!' };

ASZ.MISSIONS = [
  {
    id: 'stolowka',
    nr: 1,
    name: 'Zdrowa Stołówka',
    hero: 'witaminka',
    game: 'catch',
    bg: 'assets/img/bg-canteen.webp',
    stats: ['hearts', 'timer', 'score'],
    dialogIn: [
      { who: 'witaminka', text: 'Gluton X zamienił stołówkę w deszcz jedzenia! Łap na tacę to, co daje siłę na cały dzień.' },
      { who: 'kropelka',  text: 'Psst! Jak zobaczysz mój bidon, złap go. Woda zawsze pomaga!' },
      { who: 'witaminka', text: 'Chipsy, słodycze i energetyki zostawiamy Glutonowi. Gotowi? Start!' }
    ],
    dialogWin: [
      { who: 'witaminka', text: 'Pyszna robota! Widzisz? Kolorowy talerz to najlepsze paliwo.' },
      { who: 'energus',   text: 'Pierwszy segment Kryształu świeci! Lecimy dalej!' }
    ],
    wiedza: '<b>Wiedza SuperMocy:</b> kolorowy talerz (owoce, warzywa, jajka, ryby) i woda to paliwo, po którym chce się biegać i myśleć. Po chipsach i słodyczach energia szybko znika.',
    howto: 'Przesuwaj tacę palcem lub strzałkami. Łap zdrowe jedzenie, omijaj pułapki Glutona!'
  },
  {
    id: 'laboratorium',
    nr: 2,
    name: 'Laboratorium Mózgusia',
    hero: 'mozgus',
    game: 'sort',
    bg: 'assets/img/bg-lab.webp',
    stats: ['score', 'progress'],
    dialogIn: [
      { who: 'mozgus', text: 'Witaj w laboratorium. Zbudowałem dwa urządzenia: Reaktor Energii i Śmieciator.' },
      { who: 'mozgus', text: 'To ważna różnica: co innego smakuje przez minutę, a co innego daje moc na cały dzień.' },
      { who: 'mozgus', text: 'Przeciągaj produkty we właściwą stronę. Szybko i dokładnie. Zaczynamy analizę!' }
    ],
    dialogWin: [
      { who: 'mozgus',  text: 'Analiza zakończona. Twój mózg właśnie nauczył się rozpoznawać pułapki Glutona.' },
      { who: 'sprintix', text: 'Ekstra! Drugi segment Kryształu gotowy. Kto następny? Ja? Powiedzcie, że ja!' }
    ],
    wiedza: '<b>Wiedza SuperMocy:</b> zanim coś zjesz, zrób test Mózgusia: „Czy to doda mi mocy, czy tylko na chwilę smakuje?”. Twój mózg uwielbia znać odpowiedź.',
    howto: 'Przeciągnij kartę w prawo (Reaktor = daje energię) albo w lewo (Śmieciator = pułapka). Możesz też użyć strzałek.'
  },
  {
    id: 'sen',
    nr: 3,
    name: 'Wieczorny Rytuał',
    hero: 'senek',
    game: 'sleep',
    bg: 'assets/img/bg-night.webp',
    stats: ['moons', 'progress'],
    dialogIn: [
      { who: 'senek', text: '…yhm. Wybacz, ziewnąłem. Gluton X namawia dzieci do grania po nocach i wszyscy chodzą niewyspani.' },
      { who: 'senek', text: 'Mam na to sposób: wieczorny rytuał. Te same kroki, co wieczór, w tej samej kolejności.' },
      { who: 'senek', text: 'Zapamiętaj kolejność i powtórz ją. Spokojnie… krok po kroku…' }
    ],
    dialogWin: [
      { who: 'senek',       text: 'Widzisz? Kiedy rytuał jest zawsze taki sam, sen przychodzi sam. Dobranoc, Glutonie.' },
      { who: 'usmiechanka', text: 'Trzeci segment świeci! Wyspana drużyna to silna drużyna.' }
    ],
    wiedza: '<b>Wiedza SuperMocy:</b> sen to ładowarka mózgu. Wieczorem telefon odkładamy daleko od łóżka, a rytuał (mycie zębów, przygaszone światło, książka) mówi głowie: „czas spać”.',
    howto: 'Patrz, w jakiej kolejności zapalają się kafelki rytuału, i powtórz je w tej samej kolejności.'
  },
  {
    id: 'boisko',
    nr: 4,
    name: 'Tor Przeszkód',
    hero: 'energus',
    game: 'run',
    bg: 'assets/img/bg-field.webp',
    stats: ['hearts', 'progress', 'score'],
    dialogIn: [
      { who: 'energus', text: 'Nareszcie moja kolej! Gluton zastawił boisko pułapkami, ale my je po prostu PRZESKOCZYMY.' },
      { who: 'energus', text: 'Jedna zasada: nie zatrzymujemy się. Łap wodę i owoce w biegu, to turbo-doładowanie!' },
      { who: 'energus', text: 'Jesteśmy, działamy, pomożemy! Trzy… dwa… jeden… BIEG!' }
    ],
    dialogWin: [
      { who: 'energus', text: 'TAK! Czujesz to? Ruch to najlepszy energetyk świata i nie trzeba go kupować!' },
      { who: 'kropelka', text: 'Czwarty segment świeci! Kryształ prawie gotowy… czas na Glutona X.' }
    ],
    wiedza: '<b>Wiedza SuperMocy:</b> ruch to naturalny energetyk: działa za każdym razem i nie ma żadnych „skutków ubocznych”. Godzina zabawy w ruchu każdego dnia to supermoc.',
    howto: 'Klepnij ekran (albo spacja / strzałka w górę), żeby skakać nad pułapkami. Zbieraj wodę i owoce!'
  },
  {
    id: 'final',
    nr: 5,
    name: 'Pojedynek z Glutonem X',
    hero: 'gluton',
    boss: true,
    game: 'boss',
    bg: 'assets/img/bg-final.webp',
    stats: ['hearts', 'beam', 'bosshp'],
    dialogIn: [
      { who: 'gluton',  text: 'Hahaha! Myślicie, że kilka marchewek mnie powstrzyma? Zasypię was chipsami!' },
      { who: 'energus', text: 'Drużyna, razem! Tarcza Energii gotowa. Łap to, co zdrowe, a jego śmieciowe pociski po prostu omijaj!' },
      { who: 'mozgus',  text: 'Kiedy Promień Prawdziwej Energii się naładuje… wystrzel. Trzy trafienia i po Glutonie.' }
    ],
    dialogWin: [
      { who: 'gluton',    text: 'Niemożliwe! Ta wasza… prawdziwa energia… jest za silna! Jeszcze tu wrócę!' },
      { who: 'energus',   text: 'I to jest drużyna! Kryształ świeci pełnym blaskiem!' },
      { who: 'witaminka', text: 'A na Ciebie czeka nagroda: pierwsza część naszej komiksowej przygody. Czytaj śmiało!' }
    ],
    wiedza: '<b>Wiedza SuperMocy:</b> Prawdziwa Energia to drużyna czterech mocy: zdrowe jedzenie, woda, ruch i sen. Kiedy grają razem, żaden Gluton nie ma szans.',
    howto: 'Przesuwaj Tarczę Energii. Łap zdrowe produkty, aż naładujesz Promień, i wtedy strzelaj! Unikaj śmieciowych pocisków.'
  }
];

/* obrazy do preloadu przy starcie */
ASZ.PRELOAD = [
  'assets/img/scene-run.webp',
  'assets/img/scene-corridor.webp',
  'assets/img/scene-hq.webp',
  'assets/img/scene-victory.webp',
  'assets/img/bg-hub.webp',
  'assets/img/bg-canteen.webp',
  'assets/img/bg-lab.webp',
  'assets/img/bg-night.webp',
  'assets/img/bg-field.webp',
  'assets/img/bg-final.webp',
  'assets/img/bg-reward.webp',
  'assets/img/gluton.webp',
  'assets/img/energus-run.webp',
  'assets/img/energus-jump.webp',
  'assets/img/comic-cz1-cover.webp',
  ...Object.values(ASZ.CHARS).map(c => c.img),
  ...Object.values(ASZ.ITEMS).map(i => i.img)
];
