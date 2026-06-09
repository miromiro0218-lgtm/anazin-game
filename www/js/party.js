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

/* =====================
   DOM
===================== */

const backButton =
  document.getElementById("back-button");

const characterList =
  document.getElementById("character-list");

const partySlots =
  document.querySelectorAll(".party-slot");

const saveButton =
  document.getElementById("save-party-button");

const autoButton =
  document.getElementById("auto-party-button");

const powerText =
  document.getElementById("party-power");

const searchInput =
  document.getElementById("search-character");

/* =====================
   状態
===================== */

let selectedParty =
  [...(PLAYER.party || [])];

while(selectedParty.length < 3){
  selectedParty.push(null);
}

/* =====================
   戻る
===================== */

if(backButton){
  backButton.onclick = () => {
    const returnPage =
      localStorage.getItem("returnPage");

    location.href =
      returnPage || "index.html";
  };
}

/* =====================
   キャラ取得
===================== */

function getOwnedCharacterData(){
  return CHARA_DATA.filter(c =>
    PLAYER.ownedCharacters.includes(c.id)
  );
}

function getCharacterById(id){
  return CHARA_DATA.find(c => c.id === id);
}

function getCharacterLevelSafe(id){
  if(typeof getCharacterLevel === "function"){
    return getCharacterLevel(id);
  }

  return PLAYER.characterLevels?.[id] || 1;
}

function getCharacterStatsSafe(character){
  if(typeof getCharacterBattleStats === "function"){
    return getCharacterBattleStats(character);
  }

  return character.stats;
}

function calcCharacterPower(character){
  const s = getCharacterStatsSafe(character);

  return Math.floor(
    s.hp / 5 +
    s.atk * 4 +
    s.def * 3 +
    s.spd * 2 +
    s.sp * 1.5 +
    s.eva * 20
  );
}

function calcPartyPower(){
  return selectedParty.reduce((sum, id) => {
    if(!id) return sum;

    const c = getCharacterById(id);
    if(!c) return sum;

    return sum + calcCharacterPower(c);
  }, 0);
}

/* =====================
   編成スロット
===================== */

function renderPartySlots(){
  partySlots.forEach((slot, index) => {
    const charaId = selectedParty[index];
    const c = charaId ? getCharacterById(charaId) : null;

    slot.innerHTML = "";

    if(!c){
      slot.classList.remove("filled");
      slot.innerHTML = `
        <div class="empty-slot">
          EMPTY
        </div>
      `;
      return;
    }

    slot.classList.add("filled");

    slot.innerHTML = `
      <img src="${c.image}" class="slot-img" alt="${c.name}">

      <div class="slot-info">
        <div class="slot-name">${c.name}</div>
        <div class="slot-rarity">${c.rarity}</div>
        <div class="slot-level">
          Lv ${getCharacterLevelSafe(c.id)}
        </div>
      </div>

      <button class="remove-slot-button">
        ×
      </button>
    `;

    const removeButton =
      slot.querySelector(".remove-slot-button");

    removeButton.onclick = e => {
      e.stopPropagation();

      selectedParty[index] = null;

      renderAll();
    };
  });

  if(powerText){
    powerText.textContent =
      calcPartyPower();
  }
}

/* =====================
   キャラ一覧
===================== */

function isInParty(id){
  return selectedParty.includes(id);
}

function getFilteredCharacters(){
  const word =
    searchInput ? searchInput.value.trim() : "";

  return getOwnedCharacterData().filter(c => {
    if(!word) return true;

    return c.name.includes(word);
  });
}

function renderCharacterList(){
  if(!characterList) return;

  characterList.innerHTML = "";

  const list = getFilteredCharacters();

  list.forEach(c => {
    const div = document.createElement("div");

    div.className = "party-character-card";

    if(isInParty(c.id)){
      div.classList.add("selected");
    }

    div.innerHTML = `
      <img src="${c.image}" class="party-card-img" alt="${c.name}">

      <div class="party-card-info">
        <div class="party-card-name">${c.name}</div>
        <div class="party-card-sub">
          ${c.rarity} / Lv ${getCharacterLevelSafe(c.id)}
        </div>
        <div class="party-card-power">
          戦力 ${calcCharacterPower(c)}
        </div>
      </div>
    `;

    div.onclick = () => {
      selectCharacter(c.id);
    };

    characterList.appendChild(div);
  });
}

/* =====================
   選択処理
===================== */

function selectCharacter(characterId){
  const alreadyIndex =
    selectedParty.indexOf(characterId);

  if(alreadyIndex !== -1){
    selectedParty[alreadyIndex] = null;
    renderAll();
    return;
  }

  const emptyIndex =
    selectedParty.findIndex(id => !id);

  if(emptyIndex === -1){
    alert("編成は3人までです");
    return;
  }

  selectedParty[emptyIndex] = characterId;

  renderAll();
}

/* =====================
   自動編成
===================== */

function autoParty(){
  const sorted =
    getOwnedCharacterData()
      .slice()
      .sort((a,b) =>
        calcCharacterPower(b) - calcCharacterPower(a)
      );

  selectedParty =
    sorted
      .slice(0,3)
      .map(c => c.id);

  while(selectedParty.length < 3){
    selectedParty.push(null);
  }

  renderAll();
}

if(autoButton){
  autoButton.onclick = () => {
    autoParty();
  };
}

/* =====================
   保存
===================== */

if(saveButton){
  saveButton.onclick = () => {
    const party =
      selectedParty.filter(id => id);

    if(party.length === 0){
      alert("最低1人は編成してください");
      return;
    }

    if(typeof setParty === "function"){
      setParty(party);
    }else{
      PLAYER.party = party;
      savePlayerData(PLAYER);
    }

    alert("編成を保存しました");
  };
}

/* =====================
   検索
===================== */

if(searchInput){
  searchInput.addEventListener("input", () => {
    renderCharacterList();
  });
}

/* =====================
   全描画
===================== */

function renderAll(){
  renderPartySlots();
  renderCharacterList();
}

/* =====================
   起動
===================== */

window.addEventListener("load", () => {
  scaleScreen();
  renderAll();
});