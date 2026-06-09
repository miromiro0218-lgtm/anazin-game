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

/* =====================
   キャラ取得
===================== */

const selectedCharacterId =
  localStorage.getItem("selectedCharacterId");

const character =
  CHARA_DATA.find(c => c.id === selectedCharacterId);

if(!character){
  alert("キャラデータが見つかりません");
  location.href = "character_box.html";
}

/* =====================
   共通
===================== */

function setText(id, text){
  const el = document.getElementById(id);
  if(el) el.textContent = text;
}

function setImage(id, src){
  const el = document.getElementById(id);
  if(el) el.src = src;
}

/* =====================
   表示
===================== */

function renderCharacterDetail(){
  if(!character) return;

  const level = getCharacterLevel(character.id);
  const exp = getCharacterExp(character.id);
  const needExp = getCharacterNeedExp(level);
  const stats = getCharacterBattleStats(character);

  setText("character-name", character.name);
  setText("character-rarity", character.rarity);
  setText("character-role", character.role || "");
  setText("character-attribute", character.attribute || "-");

  setImage("character-image", character.image);

  setText("character-level", `Lv ${level}`);
  setText("character-exp", `${exp} / ${needExp}`);

  const expFill = document.getElementById("exp-fill");
  if(expFill){
    expFill.style.width =
      `${Math.min(100, exp / needExp * 100)}%`;
  }

  setText("stat-hp", stats.hp);
  setText("stat-atk", stats.atk);
  setText("stat-def", stats.def);
  setText("stat-spd", stats.spd);
  setText("stat-sp", stats.sp);
  setText("stat-eva", stats.eva);

  renderCommands();
  renderAbilities();
}

function renderCommands(){
  const list = document.getElementById("command-list");
  if(!list) return;

  list.innerHTML = "";

  character.commands.forEach(cmd => {
    const div = document.createElement("div");
    div.className = "detail-card";

    div.innerHTML = `
      <div class="detail-title">${cmd.name}</div>
      <div>タイプ：${cmd.type}</div>
      <div>威力：${cmd.power ?? "-"}</div>
      <div>消費SP：${cmd.sp_cost ?? cmd.spCost ?? 0}</div>
      <div>対象：${cmd.target ?? "-"}</div>
    `;

    list.appendChild(div);
  });
}

function renderAbilities(){
  const list = document.getElementById("ability-list");
  if(!list) return;

  list.innerHTML = "";

  const level = getCharacterLevel(character.id);

  character.abilities.forEach((ab, index) => {
    const unlockLv =
      index === 0 ? 25 :
      index === 1 ? 50 :
      index === 2 ? 75 : 999;

    const unlocked = level >= unlockLv;

    const div = document.createElement("div");
    div.className = `detail-card ${unlocked ? "" : "locked"}`;

    div.innerHTML = `
      <div class="detail-title">
        ${ab.name}
        ${unlocked ? "" : `<span class="lock-label">Lv${unlockLv}解放</span>`}
      </div>

      <div>
        ${unlocked ? ab.description : "まだ解放されていません"}
      </div>
    `;

    list.appendChild(div);
  });
}

/* =====================
   ボタン
===================== */

const backButton =
  document.getElementById("back-button");

if(backButton){
  backButton.onclick = () => {
    location.href = "character_box.html";
  };
}

window.addEventListener("load", () => {
  scaleScreen();
  renderCharacterDetail();
});

window.addEventListener("resize", scaleScreen);