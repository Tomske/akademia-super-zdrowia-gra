const stage = document.getElementById("stage") || document.getElementById("etap");

const ASSET_PATH = "assets/";

const assets = {
  startBg: "cz1_bg_start_szkola_alarm.png",
  teamStart: "KANON_TEAM_START_GROUP_ETAP1.png",
  glutonShadow: "cz1_enemy_gluton_shadow_start.png",

  e01Bg: "cz1_bg_e01_klasa_bez_energii.png",
  e01Mozgus: "cz1_char_e01_mozgus_analiza.png",
  e01ChildSleeping: "cz1_obj_e01_dziecko_spiace.png",
  e01ChildGaming: "cz1_obj_e01_dziecko_nocne_granie.png",

  trapTelefon: "shared_trap_telefon.png",
  trapSlodycze: "shared_trap_slodycze.png",
  trapEnergetyk: "shared_trap_energetyk.png",
  trapChipsy: "shared_trap_chipsy.png",

  e02Bg: "cz1_bg_e02_stolowka_szkolna.png",
  e02Witaminka: "cz1_char_e02_witaminka_stolowka.png",

  foodJajka: "shared_food_jajka.png",
  foodMieso: "shared_food_mieso.png",
  foodRyby: "shared_food_ryby.png",
  foodWarzywa: "shared_food_warzywa.png",
  foodOwoce: "shared_food_owoce.png",
  drinkWoda: "shared_drink_woda.png",

  e03Bg: "cz1_bg_e03_laboratorium_mozgusia.png",
  e03Mozgus: "cz1_char_e03_mozgus_laboratorium.png",
  e03Sleep: "cz1_obj_e01_dziecko_spiace.png",
  e03Ruch: "cz1_obj_e08_pilka.png",

  e04Bg: "cz1_bg_e04_szkolny_alarm_druzyny.png",
  e04SceneConfused: "cz1_obj_e01_dziecko_nocne_granie.png",
  e04SceneSweets: "cz1_obj_e04_scenka_dziecko_po_slodyczach.png",
  e04SceneNoMove: "cz1_obj_e08_pilka.png",
  e04SceneSleep: "cz1_obj_e04_scenka_dziecko_zasypia.png",

  e05Bg: "cz1_bg_e04_szkolny_alarm_druzyny.png",
  e05EkranatorA: "shared_trap_telefon.png",
  e05EkranatorB: "shared_trap_energetyk.png",
  e05SenekMozgus: "cz1_char_e05_senek_mozgus_reakcja.png",

  e06Bg: "cz1_bg_e06_spiaca_klasa.png",
  e06Senek: "cz1_char_e06_senek_rutyna.png",

  e07Bg: "cz1_bg_e07_scena_witaminki_jedzenie.png",
  e07Witaminka: "cz1_char_e07_witaminka_przy_jedzeniu.png",

  e08Bg: "cz1_bg_e08_boisko_ruch.png",
  e08EnergusStart: "cz1_char_e08_energus_tylem_do_bramki.png",
  e08EnergusWarmup: "cz1_char_e08_energus_start.png",
  e08EnergusJump: "cz1_char_e08_energus_skok.png",
  e08EnergusRun: "cz1_char_e08_energus_bieg.png",
  e08EnergusShot: "cz1_char_e08_energus_pilka.png",
  e08Kids: "cz1_char_e08_dzieci_dolaczaja.png",
  e08Ball: "cz1_obj_e08_pilka.png",

  e09Bg: "cz1_bg_e09_atak_mega_energetyka.png",
  e09MegaFull: "cz1_enemy_mega_e09_pelna_moc.png",
  e09MegaWeak: "cz1_enemy_mega_e09_oslabiony.png",
  e09Team: "cz1_char_e09_druzyna_przed_energetykiem.png",

  e10Bg: "cz1_bg_e10_final_walka.png",
  e10GlutonAttack: "cz1_enemy_gluton_e10_f1_atak.png",
  e10GlutonEscape: "cz1_enemy_gluton_e10_f4_ucieka.png",

  rewardBg: "cz1_bg_reward_prawdziwa_energia.png"
};

const gameState = {
  currentScreen: "start",
  healthPower: 0,
  e01: {},
  e02: {},
  e03: {},
  e04: {},
  e05: {},
  e06: {},
  e07: {},
  e08: {},
  e09: {},
  e10: {}
};

function assetUrl(fileName) {
  return ASSET_PATH + fileName;
}

function clearStage() {
  stage.innerHTML = "";
  stage.onclick = null;
}

function createImg(className, fileName, alt = "") {
  const img = document.createElement("img");
  img.className = className;
  img.src = assetUrl(fileName);
  img.alt = alt;
  img.draggable = false;
  return img;
}

function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function createHealthCounter() {
  const counter = document.createElement("div");
  counter.className = "health-counter";
  counter.id = "healthCounter";
  counter.textContent = `Zdrowomoc: ${gameState.healthPower}`;
  return counter;
}

function updateHealthCounter() {
  const counter = document.getElementById("healthCounter");
  if (counter) counter.textContent = `Zdrowomoc: ${gameState.healthPower}`;
}

function addHealthPoint() {
  gameState.healthPower += 1;
  updateHealthCounter();
}

function createBubble(text) {
  const bubble = document.createElement("div");
  bubble.className = "ui-bubble";
  bubble.textContent = text;
  return bubble;
}

function createProgressBox(text) {
  const progress = document.createElement("div");
  progress.className = "progress-box";
  progress.id = "progressBox";
  progress.textContent = text;
  return progress;
}

function updateProgress(text) {
  const progress = document.getElementById("progressBox");
  if (progress) progress.textContent = text;
}

function showFeedback(text) {
  let feedback = document.getElementById("feedback");

  if (!feedback) {
    feedback = document.createElement("div");
    feedback.className = "feedback";
    feedback.id = "feedback";
    stage.appendChild(feedback);
  }

  feedback.textContent = text;
}

function removeFeedback() {
  const feedback = document.getElementById("feedback");
  if (feedback) feedback.remove();
}

function createNextButton(text, onClick) {
  const button = document.createElement("button");
  button.className = "next-button";
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

function playFlash(callback) {
  const flash = document.createElement("div");
  flash.className = "flash active";
  stage.appendChild(flash);
  setTimeout(callback, 420);
}

function makeTitle(text) {
  const title = document.createElement("div");
  title.className = "screen-title";
  title.textContent = text;
  return title;
}

/* START */

function renderStart() {
  gameState.currentScreen = "start";
  clearStage();

  if (!document.getElementById("premiumStartCSS")) {
    const style = document.createElement("style");
    style.id = "premiumStartCSS";
    style.textContent = `
      @keyframes premiumStartButtonPulse {
        0%, 100% { transform: scale(1); filter: brightness(1); }
        50% { transform: scale(1.045); filter: brightness(1.12); }
      }

      @keyframes premiumHeroGlow {
        0%, 100% { filter: drop-shadow(0 14px 18px rgba(0,0,0,.48)) drop-shadow(0 0 18px rgba(126,255,114,.48)); }
        50% { filter: drop-shadow(0 16px 22px rgba(0,0,0,.55)) drop-shadow(0 0 34px rgba(126,255,114,.9)); }
      }

      @keyframes premiumEnemyFloat {
        0%, 100% { transform: translateY(0) scale(1); opacity: .9; }
        50% { transform: translateY(-8px) scale(1.04); opacity: 1; }
      }

      @keyframes premiumAlarmGlow {
        0%, 100% { opacity: .32; }
        50% { opacity: .58; }
      }

      @keyframes premiumEnergyMove {
        0% { transform: translateX(-10%) scaleX(.88); opacity: .55; }
        50% { transform: translateX(5%) scaleX(1); opacity: 1; }
        100% { transform: translateX(-10%) scaleX(.88); opacity: .55; }
      }
    `;
    document.head.appendChild(style);
  }

  const bg = document.createElement("div");
  bg.className = "bg";
  bg.style.position = "absolute";
  bg.style.inset = "0";
  bg.style.zIndex = "1";
  bg.style.overflow = "hidden";
  bg.style.background = `
    radial-gradient(circle at 21% 73%, rgba(126,255,114,.48), transparent 28%),
    radial-gradient(circle at 78% 20%, rgba(255,232,82,.38), transparent 31%),
    radial-gradient(circle at 14% 17%, rgba(255,65,65,.28), transparent 27%),
    linear-gradient(135deg, #203d7a 0%, #14275a 28%, #0d2635 62%, #173c24 100%)
  `;

  const comicRays = document.createElement("div");
  comicRays.style.position = "absolute";
  comicRays.style.inset = "0";
  comicRays.style.zIndex = "2";
  comicRays.style.pointerEvents = "none";
  comicRays.style.opacity = ".34";
  comicRays.style.background = `
    conic-gradient(
      from 210deg at 74% 28%,
      rgba(255,241,95,.38) 0deg,
      transparent 12deg,
      rgba(126,255,114,.25) 24deg,
      transparent 38deg,
      rgba(255,80,80,.22) 54deg,
      transparent 70deg,
      rgba(255,241,95,.28) 86deg,
      transparent 108deg,
      rgba(126,255,114,.22) 130deg,
      transparent 160deg,
      rgba(255,241,95,.25) 190deg,
      transparent 230deg,
      rgba(255,80,80,.18) 270deg,
      transparent 320deg,
      rgba(255,241,95,.30) 360deg
    )
  `;

  const darkVignette = document.createElement("div");
  darkVignette.style.position = "absolute";
  darkVignette.style.inset = "0";
  darkVignette.style.zIndex = "3";
  darkVignette.style.pointerEvents = "none";
  darkVignette.style.background = `
    radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,.36) 100%)
  `;

  const alarmGlow = document.createElement("div");
  alarmGlow.style.position = "absolute";
  alarmGlow.style.right = "2%";
  alarmGlow.style.top = "4%";
  alarmGlow.style.width = "38%";
  alarmGlow.style.height = "42%";
  alarmGlow.style.zIndex = "4";
  alarmGlow.style.pointerEvents = "none";
  alarmGlow.style.background = "radial-gradient(circle at 68% 30%, rgba(255,231,78,.72), transparent 48%)";
  alarmGlow.style.animation = "premiumAlarmGlow 1.45s ease-in-out infinite";

  const heroGround = document.createElement("div");
  heroGround.style.position = "absolute";
  heroGround.style.left = "5%";
  heroGround.style.bottom = "6%";
  heroGround.style.width = "48%";
  heroGround.style.height = "23%";
  heroGround.style.zIndex = "5";
  heroGround.style.pointerEvents = "none";
  heroGround.style.background = "radial-gradient(ellipse at 36% 52%, rgba(126,255,114,.78), rgba(126,255,114,.24) 44%, transparent 72%)";
  heroGround.style.filter = "blur(1px)";

  const energyLine = document.createElement("div");
  energyLine.style.position = "absolute";
  energyLine.style.left = "45%";
  energyLine.style.bottom = "16%";
  energyLine.style.width = "40%";
  energyLine.style.height = "16px";
  energyLine.style.zIndex = "15";
  energyLine.style.border = "4px solid #111";
  energyLine.style.borderRadius = "999px";
  energyLine.style.background = "linear-gradient(90deg,#fff36f,#89f078,#72d8ff,#fff36f)";
  energyLine.style.boxShadow = "0 6px 0 rgba(0,0,0,.24), 0 0 28px rgba(126,255,114,.84)";
  energyLine.style.pointerEvents = "none";
  energyLine.style.animation = "premiumEnergyMove 2.2s ease-in-out infinite";

  const shadow = createImg("asset gluton-shadow", assets.glutonShadow, "Cień Glutona X");
  shadow.style.position = "absolute";
  shadow.style.right = "5.5%";
  shadow.style.top = "13%";
  shadow.style.width = "18%";
  shadow.style.maxHeight = "23%";
  shadow.style.objectFit = "contain";
  shadow.style.zIndex = "22";
  shadow.style.opacity = ".95";
  shadow.style.filter = "drop-shadow(0 0 28px rgba(148,72,255,.95))";
  shadow.style.pointerEvents = "none";
  shadow.style.animation = "premiumEnemyFloat 2.6s ease-in-out infinite";

  const team = createImg("asset team-start", assets.teamStart, "Akademia Super Zdrowia");
  team.style.position = "absolute";
  team.style.left = "6%";
  team.style.bottom = "8%";
  team.style.width = "35%";
  team.style.maxHeight = "48%";
  team.style.objectFit = "contain";
  team.style.zIndex = "32";
  team.style.pointerEvents = "none";
  team.style.animation = "premiumHeroGlow 2.5s ease-in-out infinite";

  const title = document.createElement("div");
  title.textContent = "Alarm! Gluton X kradnie energię!";
  title.style.position = "absolute";
  title.style.left = "50%";
  title.style.top = "7%";
  title.style.transform = "translateX(-50%) rotate(-1deg)";
  title.style.width = "58%";
  title.style.padding = "15px 24px";
  title.style.border = "7px solid #111";
  title.style.borderRadius = "34px";
  title.style.background = "linear-gradient(180deg,#fff9c9 0%,#ffe66d 72%,#ffd748 100%)";
  title.style.boxShadow = "0 10px 0 rgba(0,0,0,.28), 0 0 30px rgba(255,230,80,.7)";
  title.style.fontWeight = "1000";
  title.style.fontSize = "clamp(27px, 2.85vw, 50px)";
  title.style.lineHeight = "1.05";
  title.style.textAlign = "center";
  title.style.color = "#111";
  title.style.zIndex = "50";
  title.style.pointerEvents = "none";

  const subtitle = document.createElement("div");
  subtitle.textContent = "Kliknij START i uratuj szkołę!";
  subtitle.style.position = "absolute";
  subtitle.style.right = "10%";
  subtitle.style.bottom = "31%";
  subtitle.style.width = "33%";
  subtitle.style.padding = "10px 17px";
  subtitle.style.border = "5px solid #111";
  subtitle.style.borderRadius = "999px";
  subtitle.style.background = "linear-gradient(180deg,#fff,#f2fff0)";
  subtitle.style.boxShadow = "0 7px 0 rgba(0,0,0,.24), 0 0 18px rgba(126,255,114,.55)";
  subtitle.style.fontWeight = "1000";
  subtitle.style.fontSize = "clamp(16px,1.35vw,24px)";
  subtitle.style.lineHeight = "1.08";
  subtitle.style.textAlign = "center";
  subtitle.style.color = "#111";
  subtitle.style.zIndex = "51";
  subtitle.style.pointerEvents = "none";

  const startWrap = document.createElement("div");
  startWrap.style.position = "absolute";
  startWrap.style.right = "15%";
  startWrap.style.bottom = "8%";
  startWrap.style.zIndex = "70";
  startWrap.style.animation = "premiumStartButtonPulse 1.35s ease-in-out infinite";

  const start = document.createElement("button");
  start.className = "big-button";
  start.textContent = "START";
  start.style.position = "relative";
  start.style.transform = "none";
  start.style.minWidth = "292px";
  start.style.minHeight = "120px";
  start.style.fontSize = "clamp(46px,4vw,74px)";
  start.style.fontWeight = "1000";
  start.style.border = "8px solid #111";
  start.style.borderRadius = "40px";
  start.style.background = "linear-gradient(180deg,#fff36f 0%,#ffd34f 45%,#ffad35 100%)";
  start.style.boxShadow = "0 12px 0 rgba(0,0,0,.32), 0 0 38px rgba(126,255,114,.9)";
  start.style.cursor = "pointer";
  start.style.color = "#111";

  start.addEventListener("click", () => {
    playFlash(renderScreen1);
  });

  startWrap.appendChild(start);

  stage.appendChild(bg);
  stage.appendChild(comicRays);
  stage.appendChild(darkVignette);
  stage.appendChild(alarmGlow);
  stage.appendChild(heroGround);
  stage.appendChild(energyLine);
  stage.appendChild(shadow);
  stage.appendChild(team);
  stage.appendChild(title);
  stage.appendChild(subtitle);
  stage.appendChild(createHealthCounter());
  stage.appendChild(startWrap);
}

/* EKRAN 1 */

function renderScreen1() {
  gameState.currentScreen = "screen1";
  gameState.e01 = {
    foundTelefon: false,
    foundSlodycze: false,
    foundEnergetyk: false,
    foundCount: 0,
    completed: false
  };

  clearStage();

  const bg = createImg("bg", assets.e01Bg, "Klasa bez energii");
  const mozgus = createImg("asset character-mozgus-e01", assets.e01Mozgus, "Mózguś analizuje klasę");
  const sleepingChild = createImg("asset e01-child-sleeping", assets.e01ChildSleeping, "Śpiące dziecko");
  const gamingChild = createImg("asset e01-child-gaming", assets.e01ChildGaming, "Dziecko po nocnym graniu");

  const title = makeTitle("Ekran 1 — Klasa bez energii");
  const bubble = createBubble("Znajdź 3 pułapki energii!");
  const progress = createProgressBox("Pułapki: 0/3");

  const telefon = createClickableTrapE01({
    className: "e01-phone",
    fileName: assets.trapTelefon,
    alt: "Telefon",
    foundKey: "foundTelefon",
    successMessage: "Ekran podkrada sen!"
  });

  const slodycze = createClickableTrapE01({
    className: "e01-sweets",
    fileName: assets.trapSlodycze,
    alt: "Słodycze",
    foundKey: "foundSlodycze",
    successMessage: "Cukier daje krótką moc!"
  });

  const energetyk = createClickableTrapE01({
    className: "e01-energy",
    fileName: assets.trapEnergetyk,
    alt: "Energetyk",
    foundKey: "foundEnergetyk",
    successMessage: "To fałszywa energia!"
  });

  stage.appendChild(bg);
  stage.appendChild(sleepingChild);
  stage.appendChild(gamingChild);
  stage.appendChild(mozgus);
  stage.appendChild(title);
  stage.appendChild(bubble);
  stage.appendChild(createHealthCounter());
  stage.appendChild(progress);
  stage.appendChild(telefon);
  stage.appendChild(slodycze);
  stage.appendChild(energetyk);

  stage.onclick = handleScreen1BackgroundClick;
}

function createClickableTrapE01(config) {
  const trap = createImg(`clickable-asset ${config.className}`, config.fileName, config.alt);

  trap.addEventListener("click", (event) => {
    event.stopPropagation();

    if (gameState.e01[config.foundKey]) {
      showFeedback("Ta pułapka już znaleziona!");
      return;
    }

    gameState.e01[config.foundKey] = true;
    gameState.e01.foundCount += 1;

    trap.classList.add("found", "trap-pop");

    showFeedback(config.successMessage);
    updateProgress(`Pułapki: ${gameState.e01.foundCount}/3`);

    if (gameState.e01.foundCount === 3) completeScreen1();
  });

  return trap;
}

function handleScreen1BackgroundClick(event) {
  if (gameState.currentScreen !== "screen1") return;

  const clickedClickable = event.target.closest(".clickable-asset");
  const clickedNext = event.target.closest(".next-button");

  if (!clickedClickable && !clickedNext) {
    showFeedback("Szukaj podejrzanych rzeczy!");
  }
}

function completeScreen1() {
  if (gameState.e01.completed) return;

  gameState.e01.completed = true;
  addHealthPoint();

  showFeedback("Brawo! Zdobywasz punkt Zdrowomocy!");

  stage.appendChild(createNextButton("Dalej", () => {
    playFlash(renderScreen2);
  }));
}

/* EKRAN 2 */

function renderScreen2() {
  gameState.currentScreen = "screen2";
  gameState.e02 = { count: 0, picked: {}, completed: false };
  clearStage();

  const bg = createImg("bg", assets.e02Bg, "Stołówka");
  const witaminka = createImg("asset character-witaminka-e02", assets.e02Witaminka, "Witaminka");

  const items = shuffleArray([
    { id: "jajka", label: "Jajka", file: assets.foodJajka, good: true },
    { id: "mieso", label: "Mięso", file: assets.foodMieso, good: true },
    { id: "ryby", label: "Ryby", file: assets.foodRyby, good: true },
    { id: "warzywa", label: "Warzywa", file: assets.foodWarzywa, good: true },
    { id: "owoce", label: "Owoce", file: assets.foodOwoce, good: true },
    { id: "woda", label: "Woda", file: assets.drinkWoda, good: true },
    { id: "chipsy", label: "Chipsy", file: assets.trapChipsy, good: false },
    { id: "slodycze", label: "Słodycze", file: assets.trapSlodycze, good: false },
    { id: "energetyk", label: "Energetyk", file: assets.trapEnergetyk, good: false }
  ]);

  const slots = [
    ["19.5%", "48.6%"], ["30.5%", "47.9%"], ["41.4%", "48.6%"], ["52.3%", "47.9%"], ["63.3%", "48.6%"],
    ["25.0%", "65.3%"], ["35.9%", "64.6%"], ["46.9%", "65.3%"], ["57.8%", "64.6%"]
  ];

  stage.appendChild(bg);
  stage.appendChild(witaminka);
  stage.appendChild(makeTitle("Ekran 2 — Stołówka szkolna"));
  stage.appendChild(createBubble("Wybierz prawdziwe jedzenie!"));
  stage.appendChild(createHealthCounter());
  stage.appendChild(createProgressBox("Dobre wybory: 0/6"));

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.style.position = "absolute";
    card.style.left = slots[index][0];
    card.style.top = slots[index][1];
    card.style.width = "9.4%";
    card.style.zIndex = "35";
    card.style.textAlign = "center";
    card.style.cursor = "pointer";

    const img = createImg("", item.file, item.label);
    img.style.maxWidth = "72%";
    img.style.height = "auto";
    img.style.objectFit = "contain";
    img.style.filter = "drop-shadow(0 7px 7px rgba(0,0,0,.35))";

    const label = document.createElement("div");
    label.className = "e02-label";
    label.textContent = item.label;

    card.appendChild(img);
    card.appendChild(label);

    card.addEventListener("click", (event) => {
      event.stopPropagation();

      if (!item.good) {
        card.classList.remove("bad-shake");
        void card.offsetWidth;
        card.classList.add("bad-shake");
        showFeedback("Przeciwnik próbuje Cię zmylić!");
        return;
      }

      if (gameState.e02.picked[item.id]) return;

      gameState.e02.picked[item.id] = true;
      gameState.e02.count += 1;

      card.classList.add("trap-pop");
      card.style.filter = "drop-shadow(0 0 24px rgba(126,255,114,.95))";

      showFeedback("Brawo! Dobry wybór!");
      updateProgress(`Dobre wybory: ${gameState.e02.count}/6`);

      if (gameState.e02.count === 6) completeScreen2();
    });

    stage.appendChild(card);
  });
}

function completeScreen2() {
  if (gameState.e02.completed) return;

  gameState.e02.completed = true;
  addHealthPoint();

  showFeedback("Brawo! Zdobywasz punkt Zdrowomocy!");

  stage.appendChild(createNextButton("Dalej", () => playFlash(renderScreen3)));
}

/* EKRAN 3 */

function renderScreen3() {
  gameState.currentScreen = "screen3";
  gameState.e03 = { count: 0, picked: {}, completed: false };
  clearStage();

  const bg = createImg("bg", assets.e03Bg, "Laboratorium");
  const mozgus = createImg("asset character-mozgus-e03", assets.e03Mozgus, "Mózguś");

  const cards = shuffleArray([
    { id: "ekran", label: "Za dużo ekranu", file: assets.trapTelefon, bad: true },
    { id: "cukier", label: "Słodycze", file: assets.trapSlodycze, bad: true },
    { id: "energetyk", label: "Energetyk", file: assets.trapEnergetyk, bad: true },
    { id: "brakSnu", label: "Brak snu", file: assets.e03Sleep, bad: true },
    { id: "woda", label: "Woda", file: assets.drinkWoda, bad: false },
    { id: "warzywa", label: "Warzywa", file: assets.foodWarzywa, bad: false },
    { id: "ruch", label: "Ruch", file: assets.e03Ruch, bad: false },
    { id: "owoce", label: "Owoce", file: assets.foodOwoce, bad: false }
  ]);

  const grid = document.createElement("div");
  grid.className = "e03-grid";

  stage.appendChild(bg);
  stage.appendChild(mozgus);
  stage.appendChild(makeTitle("Ekran 3 — Misja Mózgusia"));
  stage.appendChild(createBubble("Zaznacz złodziei energii!"));
  stage.appendChild(createHealthCounter());
  stage.appendChild(createProgressBox("Złodzieje: 0/4"));
  stage.appendChild(grid);

  cards.forEach((item) => {
    const card = document.createElement("div");
    card.className = "e03-card";

    const img = createImg("", item.file, item.label);
    const label = document.createElement("div");
    label.className = "e03-card-title";
    label.textContent = item.label;

    card.appendChild(img);
    card.appendChild(label);

    card.addEventListener("click", (event) => {
      event.stopPropagation();

      if (!item.bad) {
        card.classList.remove("wrong-choice");
        void card.offsetWidth;
        card.classList.add("wrong-choice");
        showFeedback("To pomaga odzyskać energię!");
        return;
      }

      if (gameState.e03.picked[item.id]) return;

      gameState.e03.picked[item.id] = true;
      gameState.e03.count += 1;

      card.classList.add("selected-bad");
      showFeedback("Złodziej energii wykryty!");
      updateProgress(`Złodzieje: ${gameState.e03.count}/4`);

      if (gameState.e03.count === 4) completeScreen3();
    });

    grid.appendChild(card);
  });
}

function completeScreen3() {
  if (gameState.e03.completed) return;

  gameState.e03.completed = true;
  addHealthPoint();

  showFeedback("Brawo! Mózg odzyskuje jasność!");

  stage.appendChild(createNextButton("Dalej", () => playFlash(renderScreen4)));
}

/* EKRAN 4 */

function renderScreen4() {
  gameState.currentScreen = "screen4";
  gameState.e04 = { selected: null, matched: {}, count: 0, completed: false };
  clearStage();

  const bg = createImg("bg", assets.e04Bg, "Alarm drużyny");
  const board = document.createElement("div");
  board.className = "e04-board";

  stage.appendChild(bg);
  stage.appendChild(makeTitle("Ekran 4 — Alarm drużyny"));
  stage.appendChild(createBubble("Dopasuj problem do bohatera!"));
  stage.appendChild(createHealthCounter());
  stage.appendChild(createProgressBox("Dopasowania: 0/4"));
  stage.appendChild(board);

  const sceneCards = [
    { id: "glowa", label: "Zdezorientowanie", file: assets.e04SceneConfused, hero: "Mózguś" },
    { id: "cukier", label: "Po słodyczach", file: assets.e04SceneSweets, hero: "Witaminka" },
    { id: "ruch", label: "Bez ruchu", file: assets.e04SceneNoMove, hero: "Energuś" },
    { id: "sen", label: "Zasypianie", file: assets.e04SceneSleep, hero: "Senek" }
  ];

  const heroCards = ["Mózguś", "Witaminka", "Energuś", "Senek"].map((hero) => ({
    type: "hero",
    hero
  }));

  const mixed = shuffleArray([
    ...sceneCards.map((scene) => ({ type: "scene", ...scene })),
    ...heroCards
  ]);

  mixed.forEach((item) => {
    const card = document.createElement("div");
    card.className = item.type === "scene" ? "e04-card" : "e04-hero-card";

    if (item.type === "scene") {
      const img = createImg("", item.file, item.label);
      const label = document.createElement("div");
      label.className = "e04-label";
      label.textContent = item.label;

      card.appendChild(img);
      card.appendChild(label);

      card.addEventListener("click", () => {
        if (card.classList.contains("e04-matched")) return;

        document.querySelectorAll(".e04-card").forEach((el) => el.classList.remove("e04-selected"));
        card.classList.add("e04-selected");

        gameState.e04.selected = { id: item.id, hero: item.hero, element: card };
        showFeedback("Wybierz bohatera!");
      });
    } else {
      const label = document.createElement("div");
      label.className = "e04-label";
      label.textContent = item.hero;
      card.appendChild(label);

      card.addEventListener("click", () => {
        if (!gameState.e04.selected) {
          showFeedback("Najpierw wybierz problem!");
          return;
        }

        if (item.hero !== gameState.e04.selected.hero) {
          card.classList.remove("wrong-choice");
          void card.offsetWidth;
          card.classList.add("wrong-choice");
          showFeedback("Spróbuj jeszcze raz!");
          return;
        }

        gameState.e04.selected.element.classList.add("e04-matched");
        card.classList.add("e04-matched");
        gameState.e04.count += 1;
        gameState.e04.selected = null;

        showFeedback("Brawo! To właściwy bohater!");
        updateProgress(`Dopasowania: ${gameState.e04.count}/4`);

        if (gameState.e04.count === 4) completeScreen4();
      });
    }

    board.appendChild(card);
  });
}

function completeScreen4() {
  if (gameState.e04.completed) return;

  gameState.e04.completed = true;
  addHealthPoint();

  showFeedback("Brawo! Drużyna wie, jak pomóc!");

  stage.appendChild(createNextButton("Dalej", () => playFlash(renderScreen5)));
}

/* EKRAN 5 */

function renderScreen5() {
  gameState.currentScreen = "screen5";
  gameState.e05 = { active: false, completed: false };
  clearStage();

  const bg = createImg("bg", assets.e05Bg, "Pułapki");
  const heroes = createImg("asset character-senek-mozgus-e05", assets.e05SenekMozgus, "Senek i Mózguś");

  heroes.style.left = "1.5%";
  heroes.style.bottom = "2.5%";
  heroes.style.width = "30%";
  heroes.style.maxHeight = "46%";
  heroes.style.objectFit = "contain";
  heroes.style.zIndex = "18";

  const phone = createImg("ekranator", assets.e05EkranatorA, "Telefon");
  phone.style.position = "absolute";
  phone.style.left = "34%";
  phone.style.top = "40%";
  phone.style.width = "10%";
  phone.style.zIndex = "30";
  phone.style.cursor = "pointer";

  const energy = createImg("ekranator", assets.e05EkranatorB, "Energetyk");
  energy.style.position = "absolute";
  energy.style.right = "20%";
  energy.style.top = "38%";
  energy.style.width = "10%";
  energy.style.zIndex = "30";
  energy.style.cursor = "pointer";

  stage.appendChild(bg);
  stage.appendChild(heroes);
  stage.appendChild(phone);
  stage.appendChild(energy);
  stage.appendChild(makeTitle("Ekran 5 — Pułapka wyboru"));
  stage.appendChild(createBubble("Kliknij pułapkę. Podejmij decyzję!"));
  stage.appendChild(createHealthCounter());
  stage.appendChild(createProgressBox("Decyzja: 0/1"));

  phone.addEventListener("click", () => showDecisionE05("Odkładam ekran", "Jeszcze chwilę patrzę", "Brawo! Chronisz sen!"));
  energy.addEventListener("click", () => showDecisionE05("Wybieram wodę i sen", "Biorę szybką moc", "Brawo! Nie dajesz się oszukać!"));
}

function showDecisionE05(goodText, badText, successMessage) {
  if (gameState.e05.completed) return;

  const old = document.getElementById("decisionE05");
  if (old) old.remove();

  const panel = document.createElement("div");
  panel.id = "decisionE05";
  panel.style.position = "absolute";
  panel.style.left = "50%";
  panel.style.bottom = "6%";
  panel.style.transform = "translateX(-50%)";
  panel.style.width = "65%";
  panel.style.display = "grid";
  panel.style.gridTemplateColumns = "1fr 1fr";
  panel.style.gap = "24px";
  panel.style.zIndex = "80";

  const bad = makeBigChoice(badText, "bad");
  const good = makeBigChoice(goodText, "good");

  bad.addEventListener("click", () => {
    bad.classList.remove("bad-shake");
    void bad.offsetWidth;
    bad.classList.add("bad-shake");
    showFeedback("Przeciwnik próbuje Cię zmylić!");
  });

  good.addEventListener("click", () => completeScreen5(successMessage));

  panel.appendChild(bad);
  panel.appendChild(good);
  stage.appendChild(panel);
}

function makeBigChoice(text, type) {
  const button = document.createElement("button");
  button.textContent = text;
  button.style.padding = "24px";
  button.style.border = "6px solid #111";
  button.style.borderRadius = "30px";
  button.style.fontFamily = "inherit";
  button.style.fontWeight = "1000";
  button.style.fontSize = "clamp(20px, 2vw, 34px)";
  button.style.cursor = "pointer";
  button.style.background = type === "good"
    ? "linear-gradient(180deg,#fff7a8,#89f078)"
    : "linear-gradient(180deg,#fff,#ffd6a1)";
  button.style.boxShadow = "0 8px 0 rgba(0,0,0,.25)";
  return button;
}

function completeScreen5(message) {
  if (gameState.e05.completed) return;

  gameState.e05.completed = true;
  addHealthPoint();
  updateProgress("Decyzja: 1/1");

  const panel = document.getElementById("decisionE05");
  if (panel) panel.remove();

  showFeedback(message);

  stage.appendChild(createNextButton("Dalej", () => playFlash(renderScreen6)));
}

/* EKRAN 6 */

function renderScreen6() {
  gameState.currentScreen = "screen6";
  gameState.e06 = {
    picked: {},
    count: 0,
    completed: false,
    sequence: ["ekran-off", "zeby", "cisza", "spanie"]
  };

  clearStage();

  const bg = createImg("bg", assets.e06Bg, "Rutyna Senka");
  const senek = createImg("asset character-senek-e06", assets.e06Senek, "Senek");

  senek.style.position = "absolute";
  senek.style.left = "2%";
  senek.style.bottom = "4%";
  senek.style.width = "20%";
  senek.style.maxHeight = "40%";
  senek.style.objectFit = "contain";
  senek.style.zIndex = "35";
  senek.style.filter = "drop-shadow(0 12px 16px rgba(0,0,0,.45))";
  senek.style.pointerEvents = "none";

  stage.appendChild(bg);
  stage.appendChild(senek);
  stage.appendChild(makeTitle("Ekran 6 — Rutyna Senka"));
  stage.appendChild(createBubble("Wybierz dobrą kolejność wieczoru!"));
  stage.appendChild(createHealthCounter());
  stage.appendChild(createProgressBox("Krok rutyny: 0/4"));

  const helper = document.createElement("div");
  helper.id = "screen6Helper";
  helper.textContent = "Co najpierw pomaga zasnąć?";
  helper.style.position = "absolute";
  helper.style.left = "50%";
  helper.style.top = "27%";
  helper.style.transform = "translateX(-50%) rotate(-1deg)";
  helper.style.zIndex = "50";
  helper.style.padding = "10px 18px";
  helper.style.border = "5px solid #111";
  helper.style.borderRadius = "999px";
  helper.style.background = "rgba(255, 248, 190, .96)";
  helper.style.fontWeight = "1000";
  helper.style.fontSize = "clamp(16px, 1.45vw, 24px)";
  helper.style.boxShadow = "0 6px 0 rgba(0,0,0,.24)";
  helper.style.pointerEvents = "none";
  stage.appendChild(helper);

  const zone = document.createElement("div");
  zone.id = "screen6CardsZone";
  zone.style.position = "absolute";
  zone.style.left = "25%";
  zone.style.top = "36%";
  zone.style.width = "69%";
  zone.style.height = "47%";
  zone.style.zIndex = "45";
  zone.style.display = "grid";
  zone.style.gridTemplateColumns = "repeat(4, 1fr)";
  zone.style.gridTemplateRows = "repeat(2, 1fr)";
  zone.style.gap = "16px";
  zone.style.padding = "8px";
  zone.style.boxSizing = "border-box";
  stage.appendChild(zone);

  const cards = shuffleArray([
    { id: "ekran-off", text: "Odkładam ekran", good: true },
    { id: "zeby", text: "Myję zęby", good: true },
    { id: "cisza", text: "Wyciszam się", good: true },
    { id: "spanie", text: "Kładę się spać", good: true },
    { id: "telefon", text: "Gram w telefonie", good: false },
    { id: "slodycze", text: "Jem słodycze", good: false },
    { id: "energetyk", text: "Piję energetyk", good: false },
    { id: "halas", text: "Robię hałas", good: false }
  ]);

  cards.forEach((cardData, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.textContent = cardData.text;
    card.dataset.id = cardData.id;

    card.style.width = "100%";
    card.style.height = "100%";
    card.style.minHeight = "90px";
    card.style.padding = "10px";
    card.style.border = "6px solid #111";
    card.style.borderRadius = "26px";
    card.style.background = "linear-gradient(180deg, rgba(255,255,255,.98), rgba(230,244,255,.96))";
    card.style.fontFamily = "inherit";
    card.style.fontWeight = "1000";
    card.style.fontSize = "clamp(15px, 1.32vw, 23px)";
    card.style.lineHeight = "1.12";
    card.style.cursor = "pointer";
    card.style.boxShadow = "0 8px 0 rgba(0,0,0,.25)";
    card.style.transform = `rotate(${index % 2 === 0 ? "-2deg" : "2deg"})`;
    card.style.transition = "transform .15s ease, box-shadow .15s ease, background .15s ease, filter .15s ease";
    card.style.color = "#111";

    card.addEventListener("click", (event) => {
      event.stopPropagation();

      if (gameState.e06.completed) return;

      const expectedId = gameState.e06.sequence[gameState.e06.count];

      if (!cardData.good) {
        markWrongScreen6(card);
        showFeedback("Przeciwnik próbuje Cię zmylić!");
        return;
      }

      if (cardData.id !== expectedId) {
        markWrongScreen6(card);
        showFeedback("To dobra rzecz, ale wybierz właściwy moment!");
        return;
      }

      if (gameState.e06.picked[cardData.id]) return;

      gameState.e06.picked[cardData.id] = true;
      gameState.e06.count += 1;

      card.style.background = "linear-gradient(180deg,#fff7a8,#89f078)";
      card.style.boxShadow = "0 8px 0 rgba(0,0,0,.22), 0 0 28px rgba(126,255,114,.85)";
      card.style.pointerEvents = "none";
      card.style.transform = `rotate(${index % 2 === 0 ? "-2deg" : "2deg"}) scale(1.04)`;

      updateProgress(`Krok rutyny: ${gameState.e06.count}/4`);
      updateScreen6Helper();

      showFeedback("Brawo! Dobry krok rutyny.");

      if (gameState.e06.count === 4) completeScreen6();
    });

    zone.appendChild(card);
  });

  stage.onclick = handleScreen6BackgroundClick;
}

function markWrongScreen6(card) {
  card.classList.remove("bad-shake");
  void card.offsetWidth;
  card.classList.add("bad-shake");

  card.style.background = "linear-gradient(180deg, #ffdede, #ff9d9d)";
  card.style.boxShadow = "0 8px 0 rgba(0,0,0,.25), 0 0 22px rgba(255,80,80,.65)";

  setTimeout(() => {
    if (!gameState.e06.completed) {
      card.style.background = "linear-gradient(180deg, rgba(255,255,255,.98), rgba(230,244,255,.96))";
      card.style.boxShadow = "0 8px 0 rgba(0,0,0,.25)";
    }
  }, 450);
}

function updateScreen6Helper() {
  const helper = document.getElementById("screen6Helper");
  if (!helper) return;

  const texts = [
    "Co najpierw pomaga zasnąć?",
    "Co robisz po odłożeniu ekranu?",
    "Co pomaga wyciszyć ciało?",
    "Co kończy spokojny wieczór?",
    "Spokojny wieczór gotowy!"
  ];

  helper.textContent = texts[gameState.e06.count] || "Spokojny wieczór gotowy!";
}

function handleScreen6BackgroundClick(event) {
  if (gameState.currentScreen !== "screen6") return;

  const clickedCard = event.target.closest("#screen6CardsZone button");
  const clickedNext = event.target.closest(".next-button");

  if (!clickedCard && !clickedNext && !gameState.e06.completed) {
    showFeedback("Wybierz kolejny krok rutyny!");
  }
}

function completeScreen6() {
  if (gameState.e06.completed) return;

  gameState.e06.completed = true;
  addHealthPoint();

  showFeedback("Brawo! Senek wzmacnia energię!");

  const next = createNextButton("Dalej", () => playFlash(renderScreen7));
  next.style.right = "5%";
  next.style.bottom = "5%";
  next.style.zIndex = "95";

  stage.appendChild(next);
}

/* EKRAN 7 */

function renderScreen7() {
  gameState.currentScreen = "screen7";
  gameState.e07 = { placed: {}, count: 0, completed: false };
  clearStage();

  const bg = createImg("bg", assets.e07Bg, "Talerz");
  const witaminka = createImg("asset character-witaminka-e07", assets.e07Witaminka, "Witaminka");

  witaminka.style.position = "absolute";
  witaminka.style.left = "1.3%";
  witaminka.style.bottom = "2.8%";
  witaminka.style.width = "22%";
  witaminka.style.maxHeight = "47%";
  witaminka.style.objectFit = "contain";
  witaminka.style.zIndex = "58";
  witaminka.style.pointerEvents = "none";

  const plate = document.createElement("div");
  plate.id = "plateE07";
  plate.style.position = "absolute";
  plate.style.left = "52%";
  plate.style.top = "56%";
  plate.style.transform = "translate(-50%,-50%) rotate(-1deg)";
  plate.style.width = "34%";
  plate.style.height = "19%";
  plate.style.zIndex = "22";
  plate.style.border = "7px solid #111";
  plate.style.borderRadius = "50%";
  plate.style.background = "radial-gradient(circle,#fff,#fff4be 52%,#ffc84b 84%)";
  plate.style.boxShadow = "0 12px 0 rgba(0,0,0,.24),0 0 38px rgba(255,230,90,.85)";
  plate.style.pointerEvents = "none";

  stage.appendChild(bg);
  stage.appendChild(witaminka);
  stage.appendChild(plate);
  stage.appendChild(makeTitle("Ekran 7 — Talerz prawdziwej energii"));
  stage.appendChild(createBubble("Zbuduj talerz Zdrowomocy!"));
  stage.appendChild(createHealthCounter());
  stage.appendChild(createProgressBox("Na talerzu: 0/5"));

  const food = [
    { id: "owoce", file: assets.foodOwoce, good: true, x: "23.0%", y: "59.0%", s: "8.2%" },
    { id: "warzywa", file: assets.foodWarzywa, good: true, x: "32.8%", y: "58.3%", s: "8.8%" },
    { id: "jajka", file: assets.foodJajka, good: true, x: "43.0%", y: "58.0%", s: "8.4%" },
    { id: "mieso", file: assets.foodMieso, good: true, x: "54.3%", y: "58.3%", s: "8.8%" },
    { id: "ryby", file: assets.foodRyby, good: true, x: "41.8%", y: "74.3%", s: "9.4%" },
    { id: "chipsy", file: assets.trapChipsy, good: false, x: "25.8%", y: "74.3%", s: "7.4%" },
    { id: "slodycze", file: assets.trapSlodycze, good: false, x: "66.4%", y: "59.7%", s: "7.0%" },
    { id: "energetyk", file: assets.trapEnergetyk, good: false, x: "61.3%", y: "74.3%", s: "7.2%" }
  ];

  food.forEach((item) => stage.appendChild(createDragFoodE07(item)));
}

function createDragFoodE07(item) {
  const el = createImg("e07-food", item.file, item.id);
  el.dataset.good = item.good ? "true" : "false";
  el.dataset.id = item.id;
  el.style.position = "absolute";
  el.style.left = item.x;
  el.style.top = item.y;
  el.style.width = item.s;
  el.style.height = "auto";
  el.style.objectFit = "contain";
  el.style.zIndex = item.good ? "46" : "47";
  el.style.cursor = "grab";
  el.style.touchAction = "none";
  el.style.filter = "drop-shadow(0 8px 8px rgba(0,0,0,.32))";

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let originLeft = 0;
  let originTop = 0;

  el.addEventListener("pointerdown", (event) => {
    if (el.classList.contains("placed")) return;

    dragging = true;
    el.setPointerCapture(event.pointerId);
    el.style.zIndex = "90";

    const rect = el.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();

    startX = event.clientX;
    startY = event.clientY;
    originLeft = rect.left - stageRect.left;
    originTop = rect.top - stageRect.top;
  });

  el.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    el.style.left = `${originLeft + event.clientX - startX}px`;
    el.style.top = `${originTop + event.clientY - startY}px`;
  });

  el.addEventListener("pointerup", (event) => {
    if (!dragging) return;

    dragging = false;
    el.releasePointerCapture(event.pointerId);

    const plate = document.getElementById("plateE07");
    const a = el.getBoundingClientRect();
    const b = plate.getBoundingClientRect();

    const cx = a.left + a.width / 2;
    const cy = a.top + a.height / 2;

    const over = cx >= b.left && cx <= b.right && cy >= b.top && cy <= b.bottom;

    if (!over) {
      el.style.left = item.x;
      el.style.top = item.y;
      el.style.zIndex = item.good ? "46" : "47";
      return;
    }

    if (!item.good) {
      el.classList.remove("bad-shake");
      void el.offsetWidth;
      el.classList.add("bad-shake");
      el.style.left = item.x;
      el.style.top = item.y;
      showFeedback("Przeciwnik próbuje Cię zmylić!");
      return;
    }

    if (gameState.e07.placed[item.id]) return;

    gameState.e07.placed[item.id] = true;
    gameState.e07.count += 1;

    const pos = getPlateSlotE07(gameState.e07.count);

    el.classList.add("placed");
    el.style.left = `${pos.left}px`;
    el.style.top = `${pos.top}px`;
    el.style.width = `${pos.size}px`;
    el.style.height = `${pos.size}px`;
    el.style.zIndex = "75";
    el.style.pointerEvents = "none";
    el.style.filter = "drop-shadow(0 0 22px rgba(126,255,114,.95))";

    showFeedback("Brawo! Dobry składnik.");
    updateProgress(`Na talerzu: ${gameState.e07.count}/5`);

    if (gameState.e07.count === 5) completeScreen7();
  });

  return el;
}

function getPlateSlotE07(index) {
  const plate = document.getElementById("plateE07");
  const stageRect = stage.getBoundingClientRect();
  const rect = plate.getBoundingClientRect();

  const centerX = rect.left - stageRect.left + rect.width / 2;
  const centerY = rect.top - stageRect.top + rect.height / 2;

  const slots = [
    [-58, -22, 72],
    [4, -28, 74],
    [66, -18, 74],
    [-34, 30, 76],
    [42, 28, 76]
  ];

  const slot = slots[index - 1] || slots[0];

  return {
    left: centerX + slot[0] - slot[2] / 2,
    top: centerY + slot[1] - slot[2] / 2,
    size: slot[2]
  };
}

function completeScreen7() {
  if (gameState.e07.completed) return;

  gameState.e07.completed = true;
  addHealthPoint();

  showFeedback("Talerz Zdrowomocy gotowy!");

  stage.appendChild(createNextButton("Dalej", () => playFlash(renderScreen8)));
}

/* EKRAN 8 */

function renderScreen8() {
  gameState.currentScreen = "screen8";
  gameState.e08 = {
    step: 0,
    completed: false,
    sequence: ["rozgrzewka", "skok", "zwrot", "strzal"],
    picked: {}
  };

  clearStage();

  const bg = createImg("bg", assets.e08Bg, "Boisko");
  const energus = createImg("asset character-energus-e08", assets.e08EnergusStart, "Energuś");
  const kids = createImg("asset e08-kids", assets.e08Kids, "Dzieci");
  const ball = createImg("e08-ball", assets.e08Ball, "Piłka");

  energus.id = "energusE08";
  energus.style.position = "absolute";
  energus.style.left = "3.6%";
  energus.style.bottom = "6%";
  energus.style.width = "31%";
  energus.style.maxHeight = "58%";
  energus.style.objectFit = "contain";
  energus.style.zIndex = "38";
  energus.style.pointerEvents = "none";
  energus.style.transition = "transform .25s ease, filter .25s ease";
  energus.style.filter = "drop-shadow(0 12px 15px rgba(0,0,0,.42))";

  kids.id = "kidsE08";
  kids.style.position = "absolute";
  kids.style.right = "3.2%";
  kids.style.bottom = "4.8%";
  kids.style.width = "25%";
  kids.style.maxHeight = "36%";
  kids.style.objectFit = "contain";
  kids.style.zIndex = "36";
  kids.style.opacity = "0";
  kids.style.pointerEvents = "none";
  kids.style.transition = "opacity .35s ease, transform .35s ease";
  kids.style.transform = "translateY(16px)";

  stage.appendChild(bg);
  stage.appendChild(energus);
  stage.appendChild(kids);
  stage.appendChild(makeTitle("Ekran 8 — Strzał Energusia"));
  stage.appendChild(createBubble("Wybierz ruchy i strzel do bramki!"));
  stage.appendChild(createHealthCounter());
  stage.appendChild(createProgressBox("Ruchy: 0/4"));

  const goal = document.createElement("div");
  goal.id = "goalE08";
  goal.style.position = "absolute";
  goal.style.right = "7.5%";
  goal.style.top = "31%";
  goal.style.width = "23%";
  goal.style.height = "26%";
  goal.style.zIndex = "30";
  goal.style.border = "8px solid #111";
  goal.style.borderBottom = "12px solid #111";
  goal.style.borderRadius = "20px 20px 12px 12px";
  goal.style.background =
    "repeating-linear-gradient(90deg, rgba(255,255,255,.78) 0 10px, rgba(210,245,255,.5) 10px 20px), repeating-linear-gradient(0deg, rgba(255,255,255,.42) 0 10px, rgba(120,210,255,.28) 10px 20px)";
  goal.style.boxShadow = "0 12px 0 rgba(0,0,0,.25), 0 0 32px rgba(255,245,120,.72)";
  goal.style.pointerEvents = "none";

  const goalLabel = document.createElement("div");
  goalLabel.textContent = "BRAMKA MOCY";
  goalLabel.style.position = "absolute";
  goalLabel.style.left = "50%";
  goalLabel.style.bottom = "-25px";
  goalLabel.style.transform = "translateX(-50%) rotate(-1deg)";
  goalLabel.style.padding = "5px 13px";
  goalLabel.style.border = "4px solid #111";
  goalLabel.style.borderRadius = "999px";
  goalLabel.style.background = "#fff7b8";
  goalLabel.style.fontWeight = "1000";
  goalLabel.style.fontSize = "clamp(12px,1vw,18px)";
  goalLabel.style.whiteSpace = "nowrap";
  goalLabel.style.boxShadow = "0 5px 0 rgba(0,0,0,.22)";
  goal.appendChild(goalLabel);

  stage.appendChild(goal);

  const route = document.createElement("div");
  route.id = "routeE08";
  route.style.position = "absolute";
  route.style.left = "26%";
  route.style.top = "50%";
  route.style.width = "48%";
  route.style.height = "26%";
  route.style.zIndex = "20";
  route.style.pointerEvents = "none";
  stage.appendChild(route);

  const trail = document.createElement("div");
  trail.style.position = "absolute";
  trail.style.left = "0";
  trail.style.top = "45%";
  trail.style.width = "100%";
  trail.style.height = "18px";
  trail.style.transform = "rotate(-9deg)";
  trail.style.border = "4px solid #111";
  trail.style.borderRadius = "999px";
  trail.style.background = "linear-gradient(90deg,#fff6a8,#8df27a,#7edcff,#fff6a8)";
  trail.style.boxShadow = "0 6px 0 rgba(0,0,0,.22),0 0 28px rgba(126,255,114,.72)";
  trail.style.opacity = ".86";
  route.appendChild(trail);

  const points = [
    { id: "p0", label: "START", left: "28%", top: "58%" },
    { id: "p1", label: "SKOK", left: "42%", top: "46%" },
    { id: "p2", label: "ZWROT", left: "57%", top: "58%" },
    { id: "p3", label: "STRZAŁ", left: "72%", top: "44%" }
  ];

  points.forEach((point, index) => {
    const marker = document.createElement("div");
    marker.className = "e08-marker";
    marker.id = `e08Marker${index}`;
    marker.textContent = point.label;
    marker.style.position = "absolute";
    marker.style.left = point.left;
    marker.style.top = point.top;
    marker.style.transform = "translate(-50%,-50%)";
    marker.style.width = "82px";
    marker.style.height = "82px";
    marker.style.border = "6px solid #111";
    marker.style.borderRadius = "50%";
    marker.style.background = "radial-gradient(circle,#fff,#fff3a4 56%,#8df27a)";
    marker.style.display = "grid";
    marker.style.placeItems = "center";
    marker.style.fontWeight = "1000";
    marker.style.fontSize = "clamp(11px,1vw,16px)";
    marker.style.boxShadow = "0 7px 0 rgba(0,0,0,.24)";
    marker.style.opacity = index === 0 ? "1" : ".42";
    marker.style.zIndex = "26";
    marker.style.pointerEvents = "none";
    stage.appendChild(marker);
  });

  ball.id = "ballE08";
  ball.style.position = "absolute";
  ball.style.left = "25%";
  ball.style.top = "55%";
  ball.style.width = "74px";
  ball.style.height = "74px";
  ball.style.objectFit = "contain";
  ball.style.zIndex = "70";
  ball.style.pointerEvents = "none";
  ball.style.transition = "left .42s ease, top .42s ease, transform .3s ease, filter .2s ease";
  ball.style.filter = "drop-shadow(0 0 22px rgba(255,235,70,.95))";
  stage.appendChild(ball);

  const helper = document.createElement("div");
  helper.id = "helperE08";
  helper.textContent = "Zacznij od rozgrzewki.";
  helper.style.position = "absolute";
  helper.style.right = "4%";
  helper.style.top = "20.5%";
  helper.style.width = "30%";
  helper.style.zIndex = "62";
  helper.style.padding = "13px 18px";
  helper.style.border = "6px solid #111";
  helper.style.borderRadius = "28px";
  helper.style.background = "rgba(255,255,255,.94)";
  helper.style.fontWeight = "1000";
  helper.style.fontSize = "clamp(16px,1.45vw,25px)";
  helper.style.textAlign = "center";
  helper.style.boxShadow = "0 8px 0 rgba(0,0,0,.24)";
  helper.style.pointerEvents = "none";
  stage.appendChild(helper);

  const actionZone = document.createElement("div");
  actionZone.id = "actionsE08";
  actionZone.style.position = "absolute";
  actionZone.style.left = "28%";
  actionZone.style.bottom = "4.2%";
  actionZone.style.width = "50%";
  actionZone.style.height = "20%";
  actionZone.style.zIndex = "82";
  actionZone.style.display = "grid";
  actionZone.style.gridTemplateColumns = "repeat(4, 1fr)";
  actionZone.style.gridTemplateRows = "repeat(2, 1fr)";
  actionZone.style.gap = "9px";
  stage.appendChild(actionZone);

  const actions = shuffleArray([
    { id: "rozgrzewka", text: "Rozgrzewka", good: true },
    { id: "skok", text: "Skok", good: true },
    { id: "zwrot", text: "Zwrot", good: true },
    { id: "strzal", text: "Strzał", good: true },
    { id: "bezruch", text: "Siedzę bez ruchu", good: false },
    { id: "ekran", text: "Tylko ekran", good: false },
    { id: "niechce", text: "Nie chce mi się", good: false },
    { id: "chipsy", text: "Chipsy na ławce", good: false }
  ]);

  actions.forEach((action, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = action.text;
    btn.dataset.id = action.id;
    btn.style.width = "100%";
    btn.style.height = "100%";
    btn.style.border = "5px solid #111";
    btn.style.borderRadius = "22px";
    btn.style.background = "linear-gradient(180deg,#fff,#fff5ae 52%,#91f27c)";
    btn.style.fontFamily = "inherit";
    btn.style.fontWeight = "1000";
    btn.style.fontSize = "clamp(12px,1.05vw,18px)";
    btn.style.lineHeight = "1.08";
    btn.style.cursor = "pointer";
    btn.style.color = "#111";
    btn.style.boxShadow = "0 6px 0 rgba(0,0,0,.25)";
    btn.style.transform = `rotate(${index % 2 === 0 ? "-2deg" : "2deg"})`;
    btn.style.transition = "transform .15s ease, box-shadow .15s ease, background .15s ease";

    btn.addEventListener("click", () => handleActionE08(action, btn, index));

    actionZone.appendChild(btn);
  });

  updateBoiskoStateE08();
}

function handleActionE08(action, button, index) {
  if (gameState.e08.completed) return;

  const expected = gameState.e08.sequence[gameState.e08.step];

  if (!action.good) {
    button.classList.remove("bad-shake");
    void button.offsetWidth;
    button.classList.add("bad-shake");
    button.style.background = "linear-gradient(180deg,#ffdede,#ff9d9d)";
    showFeedback("Gluton próbuje zatrzymać ruch!");
    wobbleBallE08();

    setTimeout(() => {
      if (!gameState.e08.completed && !gameState.e08.picked[action.id]) {
        button.style.background = "linear-gradient(180deg,#fff,#fff5ae 52%,#91f27c)";
      }
    }, 420);

    return;
  }

  if (action.id !== expected) {
    button.classList.remove("bad-shake");
    void button.offsetWidth;
    button.classList.add("bad-shake");
    showFeedback("To dobry ruch, ale nie teraz!");
    wobbleBallE08();
    return;
  }

  if (gameState.e08.picked[action.id]) return;

  gameState.e08.picked[action.id] = true;
  gameState.e08.step += 1;

  button.style.background = "linear-gradient(180deg,#fff7a8,#89f078)";
  button.style.boxShadow = "0 6px 0 rgba(0,0,0,.22),0 0 22px rgba(126,255,114,.8)";
  button.style.pointerEvents = "none";
  button.style.transform = `rotate(${index % 2 === 0 ? "-2deg" : "2deg"}) scale(1.04)`;

  moveBallE08(gameState.e08.step);
  animateEnergusE08(gameState.e08.step);
  updateProgress(`Ruchy: ${gameState.e08.step}/4`);
  updateBoiskoStateE08();

  const messages = [
    "Brawo! Ciało się rozgrzewa!",
    "Brawo! Energuś skacze!",
    "Brawo! Szybki zwrot!",
    "Strzał! Piłka leci do bramki!"
  ];

  showFeedback(messages[gameState.e08.step - 1] || "Ruch dodaje energii!");

  if (gameState.e08.step === 4) {
    setTimeout(completeScreen8, 520);
  }
}

function updateBoiskoStateE08() {
  const helper = document.getElementById("helperE08");
  const goal = document.getElementById("goalE08");

  const helperTexts = [
    "Zacznij od rozgrzewki.",
    "Teraz wybierz skok.",
    "Teraz wykonaj zwrot.",
    "Na końcu strzel do bramki!",
    "Gol! Ruch budzi energię!"
  ];

  if (helper) {
    helper.textContent = helperTexts[gameState.e08.step] || "Gol! Ruch budzi energię!";
  }

  document.querySelectorAll(".e08-marker").forEach((marker, index) => {
    if (index < gameState.e08.step) {
      marker.style.opacity = "1";
      marker.style.background = "radial-gradient(circle,#fff,#8df27a 65%,#50d848)";
      marker.style.boxShadow = "0 7px 0 rgba(0,0,0,.22),0 0 28px rgba(126,255,114,.82)";
      marker.style.transform = "translate(-50%,-50%) scale(.96)";
    } else if (index === gameState.e08.step) {
      marker.style.opacity = "1";
      marker.style.background = "radial-gradient(circle,#fff,#fff3a4 56%,#8df27a)";
      marker.style.boxShadow = "0 7px 0 rgba(0,0,0,.24),0 0 34px rgba(255,235,70,.95)";
      marker.style.transform = "translate(-50%,-50%) scale(1.12)";
    } else {
      marker.style.opacity = ".42";
      marker.style.transform = "translate(-50%,-50%) scale(.88)";
      marker.style.boxShadow = "0 7px 0 rgba(0,0,0,.18)";
    }
  });

  if (goal && gameState.e08.step >= 3) {
    goal.style.boxShadow = "0 12px 0 rgba(0,0,0,.25), 0 0 46px rgba(255,245,120,.96)";
    goal.style.transform = "scale(1.03)";
  }
}

function moveBallE08(step) {
  const ball = document.getElementById("ballE08");
  if (!ball) return;

  const positions = [
    { left: "25%", top: "55%", rotate: 0, scale: 1 },
    { left: "39%", top: "48%", rotate: 85, scale: 1.02 },
    { left: "54%", top: "57%", rotate: 170, scale: 1.04 },
    { left: "68%", top: "44%", rotate: 250, scale: 1.08 },
    { left: "80.5%", top: "39%", rotate: 360, scale: 1.16 }
  ];

  const pos = positions[step] || positions[0];

  ball.style.left = pos.left;
  ball.style.top = pos.top;
  ball.style.transform = `rotate(${pos.rotate}deg) scale(${pos.scale})`;
}

function wobbleBallE08() {
  const ball = document.getElementById("ballE08");
  if (!ball) return;

  ball.style.filter = "drop-shadow(0 0 26px rgba(255,70,70,.95))";
  ball.style.transform += " translateX(-5px)";

  setTimeout(() => {
    if (ball) {
      ball.style.filter = "drop-shadow(0 0 22px rgba(255,235,70,.95))";
      ball.style.transform = ball.style.transform.replace(" translateX(-5px)", "");
    }
  }, 260);
}

function animateEnergusE08(step) {
  const energus = document.getElementById("energusE08");
  if (!energus) return;

  const poseImages = [
    assets.e08EnergusStart,
    assets.e08EnergusWarmup,
    assets.e08EnergusJump,
    assets.e08EnergusRun,
    assets.e08EnergusShot
  ];

  energus.src = assetUrl(poseImages[step] || poseImages[0]);

  const poses = [
    "translateX(0) translateY(0) rotate(0deg)",
    "translateX(16px) translateY(-4px) rotate(-2deg)",
    "translateX(28px) translateY(-15px) rotate(4deg)",
    "translateX(45px) translateY(-4px) rotate(-3deg)",
    "translateX(65px) translateY(-8px) rotate(5deg)"
  ];

  energus.style.transform = poses[step] || poses[0];
  energus.style.filter = "drop-shadow(0 14px 18px rgba(0,0,0,.45)) drop-shadow(0 0 18px rgba(126,255,114,.6))";
}

function completeScreen8() {
  if (gameState.e08.completed) return;

  gameState.e08.completed = true;
  addHealthPoint();

  const kids = document.getElementById("kidsE08");
  const goal = document.getElementById("goalE08");

  if (kids) {
    kids.style.opacity = "1";
    kids.style.transform = "translateY(0)";
  }

  if (goal) {
    goal.style.boxShadow = "0 12px 0 rgba(0,0,0,.25), 0 0 58px rgba(126,255,114,.95)";
    goal.style.background =
      "repeating-linear-gradient(90deg, rgba(255,255,255,.9) 0 10px, rgba(210,255,220,.7) 10px 20px), repeating-linear-gradient(0deg, rgba(255,255,255,.5) 0 10px, rgba(130,255,170,.34) 10px 20px)";
  }

  showFeedback("Gol! Ruch budzi prawdziwą energię!");

  const next = createNextButton("Dalej", () => playFlash(renderScreen9));
  next.style.right = "5%";
  next.style.bottom = "5%";
  next.style.zIndex = "95";
  stage.appendChild(next);
}

/* EKRAN 9 */

function renderScreen9() {
  gameState.currentScreen = "screen9";
  gameState.e09 = { matched: {}, count: 0, quizShown: false, completed: false };
  clearStage();

  const bg = createImg("bg", assets.e09Bg, "Mega Energetyk");
  const team = createImg("asset character-team-e09", assets.e09Team, "Drużyna");
  const mega = createImg("asset enemy-mega-e09", assets.e09MegaFull, "Mega Energetyk");

  team.style.position = "absolute";
  team.style.left = "2.8%";
  team.style.bottom = "6%";
  team.style.width = "24%";
  team.style.maxHeight = "38%";
  team.style.objectFit = "contain";
  team.style.zIndex = "32";

  mega.id = "megaE09";
  mega.style.position = "absolute";
  mega.style.right = "3.5%";
  mega.style.bottom = "13%";
  mega.style.width = "29%";
  mega.style.maxHeight = "58%";
  mega.style.objectFit = "contain";
  mega.style.zIndex = "34";
  mega.style.filter = "drop-shadow(0 0 26px rgba(170,60,255,.92))";

  stage.appendChild(bg);
  stage.appendChild(team);
  stage.appendChild(mega);
  stage.appendChild(makeTitle("Ekran 9 — Rozbrajanie Mega Energetyka"));
  stage.appendChild(createBubble("Rozbrój Mega Energetyka!"));
  stage.appendChild(createHealthCounter());
  stage.appendChild(createProgressBox("Rozbrojone: 0/3"));

  const instruction = document.createElement("div");
  instruction.id = "instructionE09";
  instruction.innerHTML = `
    <div style="font-size:clamp(14px,1.15vw,20px); font-weight:1000; line-height:1.12;">
      Przeciągnij tarcze na świecące rdzenie.
    </div>
    <div style="font-size:clamp(12px,0.95vw,16px); font-weight:900; margin-top:3px; line-height:1.1;">
      Dopasuj je do obrazków pułapek.
    </div>
  `;
  instruction.style.position = "absolute";
  instruction.style.left = "3.2%";
  instruction.style.bottom = "28%";
  instruction.style.width = "23%";
  instruction.style.zIndex = "64";
  instruction.style.padding = "10px 12px";
  instruction.style.border = "5px solid #111";
  instruction.style.borderRadius = "24px";
  instruction.style.background = "linear-gradient(180deg, rgba(255,255,255,.95), rgba(255,246,178,.95))";
  instruction.style.boxShadow = "0 7px 0 rgba(0,0,0,.24), 0 0 18px rgba(255,235,90,.45)";
  instruction.style.textAlign = "center";
  instruction.style.color = "#111";
  instruction.style.pointerEvents = "none";
  instruction.style.transform = "rotate(-1deg)";
  stage.appendChild(instruction);

  const sockets = [
    { id: "cukier", need: "jedzenie", icon: assets.trapSlodycze, left: "47%", top: "32%" },
    { id: "kofeina", need: "woda", icon: assets.trapEnergetyk, left: "47%", top: "49%" },
    { id: "sen", need: "sen", icon: assets.e03Sleep, left: "47%", top: "66%" }
  ];

  sockets.forEach((data) => {
    const socket = document.createElement("div");
    socket.className = "e09-trap-socket";
    socket.id = `socket-${data.id}`;
    socket.dataset.id = data.id;
    socket.dataset.need = data.need;
    socket.style.position = "absolute";
    socket.style.left = data.left;
    socket.style.top = data.top;
    socket.style.width = "142px";
    socket.style.height = "82px";
    socket.style.transform = "translate(-50%,-50%)";
    socket.style.zIndex = "48";
    socket.style.border = "6px solid #111";
    socket.style.borderRadius = "34px";
    socket.style.background = "radial-gradient(circle,#fff,rgba(190,105,255,.94) 58%,rgba(133,45,230,.96))";
    socket.style.display = "grid";
    socket.style.placeItems = "center";
    socket.style.boxShadow = "0 8px 0 rgba(0,0,0,.25),0 0 24px rgba(170,70,255,.88)";
    socket.style.pointerEvents = "none";

    const icon = createImg("", data.icon, "");
    icon.style.maxWidth = "72px";
    icon.style.maxHeight = "56px";
    icon.style.objectFit = "contain";

    socket.appendChild(icon);
    stage.appendChild(socket);

    const wire = document.createElement("div");
    wire.style.position = "absolute";
    wire.style.left = "46%";
    wire.style.top = data.top;
    wire.style.width = "29%";
    wire.style.height = "12px";
    wire.style.transform = "translateY(-50%)";
    wire.style.border = "4px solid #111";
    wire.style.borderRadius = "999px";
    wire.style.background = "linear-gradient(90deg,rgba(150,55,255,.92),rgba(255,80,220,.92))";
    wire.style.zIndex = "20";

    stage.appendChild(wire);
  });

  const shields = [
    { id: "jedzenie", label: "JEDZENIE", x: "27.3%", y: "70.1%" },
    { id: "woda", label: "WODA", x: "42.2%", y: "71.5%" },
    { id: "sen", label: "SEN", x: "57.0%", y: "70.1%" }
  ];

  shields.forEach((data) => {
    const shield = document.createElement("div");
    shield.className = "e09-shield";
    shield.dataset.id = data.id;
    shield.textContent = data.label;
    shield.style.position = "absolute";
    shield.style.left = data.x;
    shield.style.top = data.y;
    shield.style.width = "13.1%";
    shield.style.height = "13.9%";
    shield.style.zIndex = "72";
    shield.style.border = "6px solid #111";
    shield.style.borderRadius = "30px 30px 40px 40px";
    shield.style.background = "linear-gradient(180deg,#fff,#fff2a8 46%,#87f27a)";
    shield.style.display = "grid";
    shield.style.placeItems = "center";
    shield.style.fontWeight = "1000";
    shield.style.fontSize = "clamp(20px,1.7vw,28px)";
    shield.style.letterSpacing = "-1px";
    shield.style.cursor = "grab";
    shield.style.userSelect = "none";
    shield.style.touchAction = "none";
    shield.style.boxShadow = "0 8px 0 rgba(0,0,0,.25),0 0 22px rgba(126,255,114,.72)";
    shield.style.color = "#111";
    shield.style.textAlign = "center";

    stage.appendChild(shield);
    prepareShieldDragE09(shield, { left: data.x, top: data.y });
  });
}

function prepareShieldDragE09(shield, home) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function point(event) {
    if (event.touches && event.touches.length) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }

    return { x: event.clientX, y: event.clientY };
  }

  function start(event) {
    if (shield.classList.contains("done")) return;

    event.preventDefault();
    event.stopPropagation();

    dragging = true;

    const p = point(event);
    const rect = shield.getBoundingClientRect();

    offsetX = p.x - rect.left;
    offsetY = p.y - rect.top;

    shield.style.zIndex = "120";
    shield.style.cursor = "grabbing";

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", end);
  }

  function move(event) {
    if (!dragging) return;

    event.preventDefault();

    const p = point(event);
    const rect = stage.getBoundingClientRect();

    shield.style.left = `${p.x - rect.left - offsetX}px`;
    shield.style.top = `${p.y - rect.top - offsetY}px`;
  }

  function end() {
    if (!dragging) return;

    dragging = false;

    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", end);
    document.removeEventListener("touchmove", move);
    document.removeEventListener("touchend", end);

    const shieldRect = shield.getBoundingClientRect();
    const cx = shieldRect.left + shieldRect.width / 2;
    const cy = shieldRect.top + shieldRect.height / 2;

    const sockets = Array.from(document.querySelectorAll(".e09-trap-socket"));
    let matched = null;

    sockets.forEach((socket) => {
      const r = socket.getBoundingClientRect();

      if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
        matched = socket;
      }
    });

    if (!matched) {
      shield.style.left = home.left;
      shield.style.top = home.top;
      shield.style.zIndex = "72";
      return;
    }

    if (shield.dataset.id !== matched.dataset.need) {
      shield.classList.remove("bad-shake");
      void shield.offsetWidth;
      shield.classList.add("bad-shake");

      shield.style.left = home.left;
      shield.style.top = home.top;
      shield.style.zIndex = "72";

      showFeedback("Spróbuj jeszcze raz!");
      return;
    }

    completeTrapMatchE09(shield, matched);
  }

  shield.addEventListener("mousedown", start);
  shield.addEventListener("touchstart", start, { passive: false });
}

function completeTrapMatchE09(shield, socket) {
  if (gameState.e09.matched[socket.dataset.id]) return;

  gameState.e09.matched[socket.dataset.id] = true;
  gameState.e09.count += 1;

  const stageRect = stage.getBoundingClientRect();
  const rect = socket.getBoundingClientRect();

  shield.classList.add("done");
  shield.style.left = `${rect.left - stageRect.left + rect.width / 2 - 70}px`;
  shield.style.top = `${rect.top - stageRect.top + rect.height / 2 - 42}px`;
  shield.style.width = "140px";
  shield.style.height = "84px";
  shield.style.pointerEvents = "none";
  shield.style.zIndex = "84";
  shield.style.background = "linear-gradient(180deg,#fff,#aaff91)";
  socket.style.background = "radial-gradient(circle,#fff,#8df27a 58%,#50c848)";

  const mega = document.getElementById("megaE09");
  if (mega && gameState.e09.count === 3) {
    mega.src = assetUrl(assets.e09MegaWeak);
  }

  updateProgress(`Rozbrojone: ${gameState.e09.count}/3`);
  showFeedback("Brawo! Rdzeń osłabiony!");

  if (gameState.e09.count === 3) {
    setTimeout(showQuizE09, 450);
  }
}

function showQuizE09() {
  if (gameState.e09.quizShown) return;

  gameState.e09.quizShown = true;
  removeFeedback();

  const quiz = document.createElement("div");
  quiz.style.position = "absolute";
  quiz.style.left = "50%";
  quiz.style.bottom = "10%";
  quiz.style.transform = "translateX(-50%)";
  quiz.style.width = "48%";
  quiz.style.zIndex = "92";
  quiz.style.padding = "14px";
  quiz.style.border = "6px solid #111";
  quiz.style.borderRadius = "30px";
  quiz.style.background = "linear-gradient(180deg,#fff,#fff6b4)";
  quiz.style.boxShadow = "0 10px 0 rgba(0,0,0,.25)";

  const q = document.createElement("div");
  q.textContent = "Dlaczego energetyk to fałszywa energia?";
  q.style.fontWeight = "1000";
  q.style.fontSize = "clamp(17px,1.55vw,26px)";
  q.style.textAlign = "center";
  q.style.marginBottom = "10px";
  quiz.appendChild(q);

  [
    { text: "A. Bo zastępuje sen", ok: false },
    { text: "B. Bo udaje energię, ale zabiera sen", ok: true },
    { text: "C. Bo jest jak woda", ok: false }
  ].forEach((ans) => {
    const btn = document.createElement("button");
    btn.textContent = ans.text;
    btn.style.display = "block";
    btn.style.width = "100%";
    btn.style.margin = "7px 0";
    btn.style.padding = "10px";
    btn.style.border = "4px solid #111";
    btn.style.borderRadius = "20px";
    btn.style.background = "#fff";
    btn.style.fontFamily = "inherit";
    btn.style.fontWeight = "1000";
    btn.style.fontSize = "clamp(13px,1.05vw,18px)";
    btn.style.cursor = "pointer";

    btn.addEventListener("click", () => {
      if (!ans.ok) {
        btn.classList.remove("wrong-choice");
        void btn.offsetWidth;
        btn.classList.add("wrong-choice");
        showFeedback("Spróbuj jeszcze raz!");
        return;
      }

      completeScreen9();
    });

    quiz.appendChild(btn);
  });

  stage.appendChild(quiz);
}

function completeScreen9() {
  if (gameState.e09.completed) return;

  gameState.e09.completed = true;
  addHealthPoint();

  showFeedback("Brawo! Mega Energetyk słabnie!");

  stage.appendChild(createNextButton("Dalej", () => playFlash(renderScreen10)));
}

/* EKRAN 10 */

function renderScreen10() {
  gameState.currentScreen = "screen10";
  gameState.e10 = { selectedAttack: null, matched: {}, count: 0, completed: false };
  clearStage();

  const bg = createImg("bg", assets.e10Bg, "Finał");
  const team = createImg("asset character-final-team-e10", assets.teamStart, "Drużyna");
  const gluton = createImg("asset enemy-gluton-e10", assets.e10GlutonAttack, "Gluton X");

  team.style.position = "absolute";
  team.style.left = "3.5%";
  team.style.bottom = "6%";
  team.style.width = "31%";
  team.style.maxHeight = "48%";
  team.style.objectFit = "contain";
  team.style.zIndex = "34";
  team.style.pointerEvents = "none";

  gluton.id = "glutonE10";
  gluton.style.position = "absolute";
  gluton.style.right = "3.5%";
  gluton.style.bottom = "10%";
  gluton.style.width = "26%";
  gluton.style.maxHeight = "50%";
  gluton.style.objectFit = "contain";
  gluton.style.zIndex = "34";
  gluton.style.filter = "drop-shadow(0 0 26px rgba(180,60,255,.9))";
  gluton.style.pointerEvents = "none";

  stage.appendChild(bg);
  stage.appendChild(team);
  stage.appendChild(gluton);
  stage.appendChild(makeTitle("Ekran 10 — Finał: Prawdziwa Energia"));
  stage.appendChild(createBubble("Dobierz bohatera do ataku!"));
  stage.appendChild(createHealthCounter());
  stage.appendChild(createProgressBox("Ataki rozbrojone: 0/4"));

  const attacks = shuffleArray([
    { id: "cukier", text: "Cukrowy skok mocy", hero: "Witaminka" },
    { id: "glowa", text: "Zamglona głowa", hero: "Mózguś" },
    { id: "ruch", text: "Zastój ciała", hero: "Energuś" },
    { id: "sen", text: "Nocny chaos", hero: "Senek" }
  ]);

  const attackZone = document.createElement("div");
  attackZone.style.position = "absolute";
  attackZone.style.left = "38%";
  attackZone.style.top = "29%";
  attackZone.style.width = "28%";
  attackZone.style.zIndex = "60";
  attackZone.style.display = "grid";
  attackZone.style.gridTemplateColumns = "1fr";
  attackZone.style.gap = "8px";

  attacks.forEach((attack) => {
    const card = document.createElement("button");
    card.type = "button";
    card.textContent = attack.text;
    card.dataset.id = attack.id;
    card.dataset.hero = attack.hero;
    card.style.minHeight = "46px";
    card.style.padding = "8px 12px";
    card.style.border = "5px solid #111";
    card.style.borderRadius = "22px";
    card.style.background = "linear-gradient(180deg,#ffeaff,#bb72ff)";
    card.style.fontFamily = "inherit";
    card.style.fontWeight = "1000";
    card.style.fontSize = "clamp(14px,1.15vw,20px)";
    card.style.cursor = "pointer";
    card.style.boxShadow = "0 6px 0 rgba(0,0,0,.25)";
    card.style.color = "#111";
    card.style.textAlign = "center";

    card.addEventListener("click", () => {
      if (card.classList.contains("done")) return;

      document.querySelectorAll(".e10-attack").forEach((el) => {
        el.style.outline = "none";
        el.style.transform = "scale(1)";
      });

      card.style.outline = "6px solid rgba(255,235,90,.95)";
      card.style.transform = "scale(1.03)";

      gameState.e10.selectedAttack = {
        id: attack.id,
        hero: attack.hero,
        element: card
      };

      showFeedback("Teraz wybierz bohatera!");
    });

    card.className = "e10-attack";
    attackZone.appendChild(card);
  });

  const heroZone = document.createElement("div");
  heroZone.style.position = "absolute";
  heroZone.style.left = "39%";
  heroZone.style.bottom = "5%";
  heroZone.style.width = "26%";
  heroZone.style.height = "24%";
  heroZone.style.zIndex = "62";
  heroZone.style.display = "grid";
  heroZone.style.gridTemplateColumns = "1fr 1fr";
  heroZone.style.gridTemplateRows = "1fr 1fr";
  heroZone.style.gap = "10px";

  shuffleArray(["Witaminka", "Mózguś", "Energuś", "Senek"]).forEach((hero) => {
    const card = document.createElement("button");
    card.type = "button";
    card.textContent = hero;
    card.style.padding = "8px 10px";
    card.style.border = "6px solid #111";
    card.style.borderRadius = "24px";
    card.style.background = "linear-gradient(180deg,#fff,#fff2a8 52%,#89f078)";
    card.style.fontFamily = "inherit";
    card.style.fontWeight = "1000";
    card.style.fontSize = "clamp(17px,1.45vw,25px)";
    card.style.cursor = "pointer";
    card.style.boxShadow = "0 7px 0 rgba(0,0,0,.25)";
    card.style.color = "#111";
    card.style.textAlign = "center";

    card.addEventListener("click", () => {
      const selected = gameState.e10.selectedAttack;

      if (!selected) {
        showFeedback("Najpierw wybierz atak Glutona!");
        return;
      }

      if (selected.hero !== hero) {
        card.classList.remove("bad-shake");
        void card.offsetWidth;
        card.classList.add("bad-shake");
        showFeedback("Spróbuj jeszcze raz!");
        return;
      }

      completeAttackE10(selected, card);
    });

    heroZone.appendChild(card);
  });

  stage.appendChild(attackZone);
  stage.appendChild(heroZone);
}

function completeAttackE10(selected, heroCard) {
  if (gameState.e10.matched[selected.id]) return;

  gameState.e10.matched[selected.id] = true;
  gameState.e10.count += 1;

  selected.element.classList.add("done");
  selected.element.style.background = "linear-gradient(180deg,#fff,#89f078)";
  selected.element.style.outline = "none";
  selected.element.style.pointerEvents = "none";
  selected.element.style.opacity = "0.82";

  heroCard.style.background = "linear-gradient(180deg,#fff7a8,#89f078)";
  heroCard.style.boxShadow = "0 7px 0 rgba(0,0,0,.22),0 0 24px rgba(126,255,114,.85)";

  gameState.e10.selectedAttack = null;

  const gluton = document.getElementById("glutonE10");

  if (gluton) {
    gluton.style.opacity = String(1 - gameState.e10.count * 0.12);
    gluton.style.filter = `drop-shadow(0 0 ${Math.max(10, 30 - gameState.e10.count * 5)}px rgba(180,60,255,.8))`;
  }

  updateProgress(`Ataki rozbrojone: ${gameState.e10.count}/4`);
  showFeedback("Brawo! Atak osłabiony!");

  if (gameState.e10.count === 4) completeScreen10();
}

function completeScreen10() {
  if (gameState.e10.completed) return;

  gameState.e10.completed = true;
  addHealthPoint();

  const gluton = document.getElementById("glutonE10");

  if (gluton) {
    gluton.src = assetUrl(assets.e10GlutonEscape);
    gluton.style.opacity = "1";
    gluton.classList.add("escape");
  }

  removeFeedback();

  const stamp = document.createElement("div");
  stamp.className = "e10-victory-stamp";
  stamp.textContent = "MISJA UKOŃCZONA!";
  stage.appendChild(stamp);

  const message = document.createElement("div");
  message.className = "e10-final-message";
  message.textContent = "Drużyna pokonała Glutona X dzięki prawdziwej energii!";
  stage.appendChild(message);

  stage.appendChild(createNextButton("Nagroda", () => playFlash(renderReward)));
}

/* NAGRODA */

function renderReward() {
  gameState.currentScreen = "reward";
  clearStage();

  const bg = createImg("bg", assets.rewardBg, "Nagroda");
  const team = createImg("asset reward-team", assets.teamStart, "Drużyna");

  const title = document.createElement("div");
  title.className = "reward-title";
  title.textContent = "Odznaka: Prawdziwa Energia!";

  const badge = document.createElement("div");
  badge.className = "reward-badge-wrap";
  badge.innerHTML = `
    <div class="reward-badge-fallback">
      <div class="reward-badge-star">★</div>
      <div class="reward-badge-text">PRAWDZIWA<br>ENERGIA</div>
    </div>
  `;

  const message = document.createElement("div");
  message.className = "reward-message";
  message.textContent =
    "Misja domowa: przez 7 dni wybierz wodę, prawdziwe jedzenie, ruch i sen. Codziennie zdobywasz Zdrowomoc!";

  stage.appendChild(bg);
  stage.appendChild(team);
  stage.appendChild(badge);
  stage.appendChild(title);
  stage.appendChild(createHealthCounter());
  stage.appendChild(message);

  const replay = createNextButton("Zagraj jeszcze raz", () => {
    gameState.healthPower = 0;
    playFlash(renderStart);
  });
  replay.style.left = "5%";
  replay.style.right = "auto";
  replay.style.bottom = "5%";
  replay.style.zIndex = "95";
  stage.appendChild(replay);
}

renderStart();