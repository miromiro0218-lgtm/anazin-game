function scaleScreen(){
  const baseW = 1980;
  const baseH = 1080;

  const scale = Math.min(
    window.innerWidth / baseW,
    window.innerHeight / baseH
  );

  const screen = document.querySelector(".screen");

  if(screen){
    screen.style.transform =
      `translate(-50%, -50%) scale(${scale})`;
  }
}

window.addEventListener("resize", scaleScreen);

/* ================= プレイヤーデータ ================= */

const DEFAULT_PLAYER_DATA = {
  name: "プレイヤー",
  rank: 1,
  money: 0,
  stone: 3000
};

let playerData =
  JSON.parse(localStorage.getItem("playerData")) ||
  DEFAULT_PLAYER_DATA;

function savePlayerData(){
  localStorage.setItem(
    "playerData",
    JSON.stringify(playerData)
  );
}

function updateStoneUI(){
  document.getElementById("stone-count").textContent =
    playerData.stone;
}

/* ================= 所持キャラ ================= */

function getOwnedCharacters(){
  return JSON.parse(
    localStorage.getItem("ownedCharacters")
  ) || [];
}

function saveOwnedCharacters(list){
  localStorage.setItem(
    "ownedCharacters",
    JSON.stringify(list)
  );
}

function addOwnedCharacter(character){
  const owned = getOwnedCharacters();

  const alreadyOwned =
    owned.includes(character.id);

  if(!alreadyOwned){
    owned.push(character.id);
    saveOwnedCharacters(owned);
  }

  return !alreadyOwned;
}

/* ================= ガチャ抽選 ================= */

const RATES = [
  { rarity: "SSR", rate: 5 },
  { rarity: "SR", rate: 20 },
  { rarity: "R", rate: 75 }
];

function rollRarity(){
  const r = Math.random() * 100;

  let total = 0;

  for(const item of RATES){
    total += item.rate;

    if(r < total){
      return item.rarity;
    }
  }

  return "R";
}

function rollCharacter(){
  const rarity = rollRarity();

  const candidates =
    CHARA_DATA.filter(c => c.rarity === rarity);

  if(candidates.length === 0){
    return CHARA_DATA[Math.floor(Math.random() * CHARA_DATA.length)];
  }

  return candidates[
    Math.floor(Math.random() * candidates.length)
  ];
}

function rollGacha(count){
  const results = [];

  for(let i = 0; i < count; i++){
    const character = rollCharacter();
    const isNew = addOwnedCharacter(character);

    results.push({
      character,
      isNew
    });
  }

  return results;
}

/* ================= 結果表示 ================= */

function showResults(results){
  const modal = document.getElementById("result-modal");
  const list = document.getElementById("result-list");

  list.innerHTML = "";

  results.forEach(result => {
    const c = result.character;

    const card = document.createElement("div");
    card.className = `result-card ${c.rarity}`;

    card.innerHTML = `
      <div class="result-rarity ${c.rarity}">
        ${c.rarity}
      </div>

      ${
        result.isNew
        ? `<div class="new-label">NEW</div>`
        : ""
      }

      <img src="${c.image}" alt="${c.name}">

      <div class="result-name">
        ${c.name}
      </div>
    `;

    list.appendChild(card);
  });

  modal.classList.remove("hidden");
}

/* ================= 実行 ================= */

function canUseStone(cost){
  return playerData.stone >= cost;
}

function doGacha(count){
  const cost = count * 100;

  if(!canUseStone(cost)){
    alert("ガチャ石が足りません");
    return;
  }

  playerData.stone -= cost;
  savePlayerData();
  updateStoneUI();

  const results = rollGacha(count);

  showResults(results);
}

document.getElementById("single-button").onclick = () => {
  doGacha(1);
};

document.getElementById("ten-button").onclick = () => {
  doGacha(10);
};

document.getElementById("close-result-button").onclick = () => {
  document
    .getElementById("result-modal")
    .classList.add("hidden");
};

/* ================= 起動 ================= */

window.addEventListener("load", () => {
  scaleScreen();
  updateStoneUI();
  savePlayerData();

  const owned = getOwnedCharacters();

  if(owned.length === 0){
    const starterIds = ["chara_001", "chara_002", "chara_003"];
    saveOwnedCharacters(starterIds);
  }
});