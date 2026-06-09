function scaleScreen(){
  const scale = Math.min(
    window.innerWidth / 1920,
    window.innerHeight / 1080
  );

  const screen = document.querySelector(".screen");

  if(screen){
    screen.style.transform =
      `translate(-50%, -50%) scale(${scale})`;
  }
}

window.addEventListener("resize", scaleScreen);
scaleScreen();

/* ================= データ ================= */

const battleId =
  localStorage.getItem("selectedBattleId") || "battle_1_1";

const battleData =
  BATTLE_ENEMY_DATA[battleId] || BATTLE_ENEMY_DATA.battle_1_1;

let savedParty =
  JSON.parse(localStorage.getItem("party"));

if(!savedParty || savedParty.length === 0){
  savedParty = CHARA_DATA.slice(0, 3);
}

const party =
  savedParty.map(makeBattleCharacter);

const enemies =
  battleData.enemies.map(makeBattleEnemy);

function makeBattleCharacter(c){
  return {
    ...c,

    hp: c.hp ?? c.stats.hp,
    maxHp: c.maxHp ?? c.stats.hp,

    sp: c.sp ?? c.stats.sp,
    maxSp: c.maxSp ?? c.stats.sp,

    atk: c.atk ?? c.stats.atk,
    def: c.def ?? c.stats.def,
    spd: c.spd ?? c.stats.spd,
    eva: c.eva ?? c.stats.eva,

    attribute: c.attribute || c.element || "red",

    guard:false,
    buffs:[],
    status:{},

    copiedCommand:null,
    surviveCount:0
  };
}

function makeBattleEnemy(e){
  return {
    ...e,

    hp: e.hp ?? e.stats?.hp,
    maxHp: e.maxHp ?? e.hp ?? e.stats?.hp,

    sp: e.sp ?? e.stats?.sp ?? 100,
    maxSp: e.maxSp ?? e.sp ?? e.stats?.sp ?? 100,

    atk: e.atk ?? e.stats?.atk ?? 100,
    def: e.def ?? e.stats?.def ?? 0,
    spd: e.spd ?? e.stats?.spd ?? 100,
    eva: e.eva ?? e.stats?.eva ?? 0,

    attribute: e.attribute || e.element || "red",

    guard:false,
    buffs:[],
    status:{},

    copiedCommand:null,
    surviveCount:0,

    commands:e.commands || [
      {
        name:"攻撃",
        type:"attack",
        power:1.0,
        target:"enemy_single"
      }
    ]
  };
}

/* ================= DOM ================= */

const bg =
  document.getElementById("battle-bg");

const battleBgm =
  document.getElementById("battle-bgm");

const partyArea =
  document.getElementById("party-area");

const enemyArea =
  document.getElementById("enemy-area");

const commandButtons =
  document.getElementById("command-buttons");

const commandCharacterName =
  document.getElementById("command-character-name");

const currentActorName =
  document.getElementById("current-actor-name");

const battleNotice =
  document.getElementById("battle-notice");

const turnBanner =
  document.getElementById("turn-banner");

const turnStartButton =
  document.getElementById("turn-start-button");

const skillTooltip =
  document.getElementById("skill-tooltip");

if(bg && battleData.bg){
  bg.src = battleData.bg;
}

const characterTooltip =
  document.getElementById("character-tooltip");

if(battleData.bgm && battleBgm){
  battleBgm.src = battleData.bgm;
  battleBgm.volume = 0.45;
}

/* ==============キャラのやつ ================= */



function getStatMark(c, stat){
  const base = getBaseStat(c, stat);
  const now = getStat(c, stat);

  if(now > base){
    return `<span class="stat-up">▲</span>`;
  }

  if(now < base){
    return `<span class="stat-down">▼</span>`;
  }

  return "";
}

function showCharacterTooltip(c, x, y){

  if(!characterTooltip) return;

  characterTooltip.style.left = `${x - 180}px`;
  characterTooltip.style.top  = `${y - 260}px`;

  characterTooltip.innerHTML = `
    <h3>${c.name}</h3>

    <div>HP：${c.hp} / ${c.maxHp}</div>
    <div>SP：${c.sp} / ${c.maxSp}</div>

    <div>
      ATK：${getStat(c,"atk")}
      ${getStatMark(c,"atk")}
    </div>

    <div>
      DEF：${getStat(c,"def")}
      ${getStatMark(c,"def")}
    </div>

    <div>
      SPD：${getStat(c,"spd")}
      ${getStatMark(c,"spd")}
    </div>

    <div>
      EVA：${getStat(c,"eva")}
      ${getStatMark(c,"eva")}
    </div>

    <div>状態：${getStatusText(c)}</div>
  `;

  characterTooltip.classList.remove("hidden");
}


function hideCharacterTooltip(){
  if(!characterTooltip) return;
  characterTooltip.classList.add("hidden");
}

function getStatusText(c){
  if(!c.status) return "なし";

  const list = Object.entries(c.status)
    .filter(([key,value]) => value)
    .map(([key,value]) => {
      const name =
        typeof getStatusName === "function"
          ? getStatusName(key)
          : jpStatus(key);

      return `${name}${typeof value === "number" ? `(${value})` : ""}`;
    });

  return list.length ? list.join(" / ") : "なし";
}

function setupCharacterLongPress(div, character){
  let timer = null;

  div.addEventListener("mousedown", e => {
    timer = setTimeout(() => {
      showCharacterTooltip(character, e.clientX, e.clientY);
    }, 500);
  });

  div.addEventListener("mouseup", () => {
    clearTimeout(timer);
  });

  div.addEventListener("mouseleave", () => {
    clearTimeout(timer);
    hideCharacterTooltip();
  });

  div.addEventListener("touchstart", e => {
    const touch = e.touches[0];

    timer = setTimeout(() => {
      showCharacterTooltip(character, touch.clientX, touch.clientY);
    }, 500);
  });

  div.addEventListener("touchend", () => {
    clearTimeout(timer);
    hideCharacterTooltip();
  });
}

/* ================= 効果音 ================= */

const SFX = {
  click: document.getElementById("sfx-click"),
  attack: document.getElementById("sfx-attack"),
  hit: document.getElementById("sfx-hit"),
  skill: document.getElementById("sfx-skill"),
  guard: document.getElementById("sfx-guard"),
  win: document.getElementById("sfx-win"),
  lose: document.getElementById("sfx-lose")
};

function playSfx(name){
  const sfx = SFX[name];

  if(!sfx) return;

  sfx.currentTime = 0;
  sfx.volume = 0.65;

  sfx.play().catch(() => {});
}

/* ================= 状態 ================= */

let selectedEnemy =
  enemies[0]?.id;

let selectedAlly =
  party[0]?.id;

let commandQueue = [];
let battleLog = [];

let battleEnd = false;
let turnCount = 1;

/* ================= 状態異常日本語 ================= */

const STATUS_LABELS = {
  burn: "火",
  paralyze: "痺",
  freeze: "凍",
  time_stop: "時",
  shock: "電",
  taunt: "挑",
  poison: "毒",
  status_immunity: "免",
  status_resist: "耐",
  damage_transfer: "転"
};

const STATUS_NAMES = {
  burn: "やけど",
  paralyze: "麻痺",
  freeze: "凍結",
  time_stop: "時間停止",
  shock: "感電",
  taunt: "挑発",
  poison: "毒",
  status_immunity: "状態異常無効",
  status_resist: "状態異常耐性",
  damage_transfer: "ダメージ転移"
};


function jpStatus(name){
  if(typeof getStatusName === "function"){
    return getStatusName(name);
  }

  return name;
}


function getStatusIcons(character){
  if(!character.status) return "";

  return Object.entries(character.status)
    .filter(([key,value]) => value)
    .map(([key,value]) => `
      <div
        class="status-icon ${key}"
        title="${getStatusName(key)}：${getStatusDescription(key)}"
      >
        ${getStatusIcon(key)}

        ${
          typeof value === "number"
          ? `<span class="status-turn">${value}</span>`
          : ""
        }
      </div>
    `)
    .join("");
}

/* ================= コンテキスト ================= */

const battleContext = {
  party,
  enemies,

  get selectedEnemy(){
    return selectedEnemy;
  },

  addLog,
  abilityLog,
  addBuff,
  getStat,
  damage,
  runAbilities,
  jpStatus,
  playSfx,

  addStatus,
  removeStatus,
  clearBadStatuses,
  hasStatus,
  cannotActByStatus,
  applyStatusTurnStart,
  applyStatusBeforeAction,

  getTargets(cmd, targetEnemy){
    if(cmd.target === "enemy_all"){
      return enemies.filter(e => e.hp > 0);
    }

    if(cmd.target === "ally_all"){
      return party.filter(p => p.hp > 0);
    }

    if(cmd.target === "ally_single"){
      const target =
        party.find(p => p.id === selectedAlly && p.hp > 0) ||
        party.find(p => p.hp > 0);

      return target ? [target] : [];
    }

    if(cmd.target === "self"){
      return [];
    }

    const target =
      enemies.find(e => e.id === targetEnemy && e.hp > 0) ||
      enemies.find(e => e.hp > 0);

    return target ? [target] : [];
  }
};

/* ================= コマンド説明 ================= */

function getCommandDescription(cmd){
  const descriptions = {
    attack: "敵にダメージを与える",
    guard: "被ダメージを50%軽減する",
    heal: "味方のHPを回復する",
    taunt: "敵の攻撃を自身へ向ける",
    cleanse: "状態異常を解除する",
    buff: "能力を上昇させる",
    debuff: "敵の能力を低下させる",
    multi_attack: "複数回攻撃する",
    skill_attack: "特殊攻撃を行う",
    status_attack: "状態異常を付与する",
    copy_last_received_attack: "最後に受けた攻撃を再現する"
  };

  return descriptions[cmd.type] || "特殊能力";
}

function jpTarget(target){
  const targets = {
    enemy_single: "敵単体",
    enemy_all: "敵全体",
    ally_single: "味方単体",
    ally_all: "味方全体",
    self: "自分"
  };

  return targets[target] || target || "-";
}

function showSkillTooltip(cmd, x, y){
  if(!skillTooltip) return;

  skillTooltip.style.left = `${x + 20}px`;
  skillTooltip.style.top = `${y - 20}px`;

  skillTooltip.innerHTML = `
    <h3>${cmd.name}</h3>

    <div class="skill-row">
      威力：${cmd.power ?? "-"}
    </div>

    <div class="skill-row">
      消費SP：${cmd.sp_cost ?? cmd.spCost ?? 0}
    </div>

    <div class="skill-row">
      対象：${jpTarget(cmd.target)}
    </div>

    ${
      cmd.effect
      ? `<div class="skill-row">効果：${jpStatus(cmd.effect)}</div>`
      : ""
    }

    <div class="skill-desc">
      ${getCommandDescription(cmd)}
    </div>
  `;

  skillTooltip.classList.remove("hidden");
}

function hideSkillTooltip(){
  if(!skillTooltip) return;

  skillTooltip.classList.add("hidden");
}

/* ================= ログ ================= */

function addLog(text){
  battleLog.push(text);
  battleNotice.textContent = text;

  const logList = document.getElementById("log-list");

  if(logList){
    logList.innerHTML = battleLog.map(l => `<div>・${l}</div>`).join("");
    logList.scrollTop = logList.scrollHeight;
  }
}

document.getElementById("log-button").onclick = () => {
  playSfx("click");
  document.getElementById("log-modal").classList.remove("hidden");
};

document.getElementById("close-log-button").onclick = () => {
  playSfx("click");
  document.getElementById("log-modal").classList.add("hidden");
};

/* ================= BGM ================= */

function playBattleBgm(){
  if(!battleBgm || !battleBgm.src) return;

  battleBgm.play().catch(() => {
    addLog("BGM再生には画面クリックが必要です");
  });
}

function stopBattleBgm(){
  if(!battleBgm) return;

  battleBgm.pause();
  battleBgm.currentTime = 0;
}

/* ================= アビリティ演出 ================= */

function showAbilityEffect(character, abilityName){
  const chars = document.querySelectorAll(".battle-character");
  const all = [...party, ...enemies];

  const index = all.indexOf(character);
  if(index < 0) return;

  const target = chars[index];
  if(!target) return;

  const rect = target.getBoundingClientRect();

  const popup = document.createElement("div");
  popup.className = "ability-popup";
  popup.textContent = `✨ ${abilityName}`;
  popup.style.left = rect.left + rect.width / 2 - 70 + "px";
  popup.style.top = rect.top - 35 + "px";
  document.body.appendChild(popup);

  const flash = document.createElement("div");
  flash.className = "ability-flash";
  flash.style.left = rect.left + rect.width / 2 - 95 + "px";
  flash.style.top = rect.top + rect.height / 2 - 95 + "px";
  document.body.appendChild(flash);

  const ring = document.createElement("div");
  ring.className = "ability-ring";
  ring.style.left = rect.left + rect.width / 2 - 110 + "px";
  ring.style.top = rect.top + rect.height / 2 - 110 + "px";
  document.body.appendChild(ring);

  playSfx("skill");

  setTimeout(() => popup.remove(), 1250);
  setTimeout(() => flash.remove(), 850);
  setTimeout(() => ring.remove(), 900);
}

function abilityLog(character, abilityName){
  addLog(`${character.name}：${abilityName} 発動！`);
  showAbilityEffect(character, abilityName);
}

function getCommandDescription(cmd){

  const descriptions = {

    attack: "敵にダメージを与える",

    guard: "被ダメージを50%軽減する",

    heal: "味方のHPを回復する",

    taunt: "敵の攻撃を自身へ向ける",

    cleanse: "状態異常を解除する",

    buff: "能力を上昇させる",

    debuff: "敵の能力を低下させる",

    multi_attack: "複数回攻撃する",

    skill_attack: "特殊攻撃を行う",

    status_attack: "状態異常を付与する",

    copy_last_received_attack: "最後に受けた攻撃を再現する"

  };

  return descriptions[cmd.type] || "特殊能力";
}

function showSkillTooltip(cmd,x,y){

  if(!skillTooltip) return;

  skillTooltip.style.left = `${x + 20}px`;
  skillTooltip.style.top = `${y - 20}px`;

  skillTooltip.innerHTML = `
    <h3>${cmd.name}</h3>

    <div class="skill-row">
      威力：${cmd.power ?? "-"}
    </div>

    <div class="skill-row">
      消費SP：${cmd.sp_cost ?? cmd.spCost ?? 0}
    </div>

    <div class="skill-row">
      対象：${cmd.target ?? "-"}
    </div>

    <div class="skill-desc">
      ${getCommandDescription(cmd)}
    </div>
  `;

  skillTooltip.classList.remove("hidden");
}

function hideSkillTooltip(){

  if(!skillTooltip) return;

  skillTooltip.classList.add("hidden");
}

/* ================= 描画 ================= */

function renderParty(){
  partyArea.innerHTML = "";

  party.forEach(c => {
    const div = document.createElement("div");
    div.className = "battle-character";

    if(c.hp <= 0) div.classList.add("dead");
    if(selectedAlly === c.id) div.classList.add("selected");

    div.onclick = () => {

      setupCharacterLongPress(div, c);

      setupCharacterLongPress(div, e);

      if(c.hp <= 0) return;

      playSfx("click");

      selectedAlly = c.id;
      addLog(`${c.name} を対象に選択`);
      renderParty();
    };

    const characterTooltip =
  document.getElementById("character-tooltip");

function getBaseStat(c, stat){
  return c[stat] ?? c.stats?.[stat] ?? 0;
}

function getStatMark(c, stat){
  const base = getBaseStat(c, stat);
  const now = getStat(c, stat);

  if(now > base) return `<span class="stat-up">▲</span>`;
  if(now < base) return `<span class="stat-down">▼</span>`;

  return "";
}

function getStatusText(c){
  if(!c.status) return "なし";

  const list = Object.entries(c.status)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      const name =
        typeof getStatusName === "function"
          ? getStatusName(key)
          : key;

      return `${name}${typeof value === "number" ? `(${value})` : ""}`;
    });

  return list.length ? list.join(" / ") : "なし";
}

function showCharacterTooltip(c, div){
  if(!characterTooltip) return;

  const rect = div.getBoundingClientRect();

  characterTooltip.style.left =
    `${rect.left + rect.width / 2 - 180}px`;

  characterTooltip.style.top =
    `${rect.top - 260}px`;

  characterTooltip.innerHTML = `
    <h3>${c.name}</h3>

    <div>HP：${c.hp} / ${c.maxHp}</div>
    <div>SP：${c.sp} / ${c.maxSp}</div>

    <div>ATK：${getStat(c,"atk")} ${getStatMark(c,"atk")}</div>
    <div>DEF：${getStat(c,"def")} ${getStatMark(c,"def")}</div>
    <div>SPD：${getStat(c,"spd")} ${getStatMark(c,"spd")}</div>
    <div>EVA：${getStat(c,"eva")} ${getStatMark(c,"eva")}</div>

    <div>状態：${getStatusText(c)}</div>
  `;

  characterTooltip.classList.remove("hidden");
}

function hideCharacterTooltip(){
  if(!characterTooltip) return;
  characterTooltip.classList.add("hidden");
}

function setupCharacterLongPress(div, character){
  let timer = null;

  div.addEventListener("mousedown", () => {
    timer = setTimeout(() => {
      showCharacterTooltip(character, div);
    }, 500);
  });

  div.addEventListener("mouseup", () => {
    clearTimeout(timer);
  });

  div.addEventListener("mouseleave", () => {
    clearTimeout(timer);
    hideCharacterTooltip();
  });

  div.addEventListener("touchstart", () => {
    timer = setTimeout(() => {
      showCharacterTooltip(character, div);
    }, 500);
  });

  div.addEventListener("touchend", () => {
    clearTimeout(timer);
    hideCharacterTooltip();
  });
}

    div.innerHTML = `
      <div class="status-icons">${getStatusIcons(c)}</div>

      <img src="${c.image}">

      <div class="hp-bar">
        <div class="hp-fill" style="width:${Math.max(0, c.hp / c.maxHp * 100)}%"></div>
      </div>

      <div class="sp-bar">
        <div class="sp-fill" style="width:${Math.max(0, c.sp / c.maxSp * 100)}%"></div>
      </div>
    `;

    partyArea.appendChild(div);
  });
}

function renderEnemies(){
  enemyArea.innerHTML = "";

  enemies.forEach(e => {
    const div = document.createElement("div");
    div.className = "battle-character enemy";

    if(e.hp <= 0) div.classList.add("dead");
    if(selectedEnemy === e.id) div.classList.add("selected");

    div.onclick = () => {
      if(e.hp <= 0 || battleEnd) return;

      playSfx("click");

      selectedEnemy = e.id;
      addLog(`${e.name} をターゲット`);
      renderEnemies();
    };

    div.innerHTML = `
      <div class="status-icons">${getStatusIcons(e)}</div>

      <img src="${e.image}">

      <div class="hp-bar">
        <div class="hp-fill" style="width:${Math.max(0, e.hp / e.maxHp * 100)}%"></div>
      </div>

      <div class="sp-bar">
        <div class="sp-fill" style="width:${Math.max(0, e.sp / e.maxSp * 100)}%"></div>
      </div>
    `;

    enemyArea.appendChild(div);
  });
}

/* ================= 演出 ================= */

function showBattleStart(){
  const start = document.getElementById("battle-start");

  start.classList.remove("hidden");

  setTimeout(() => {
    start.classList.add("hidden");

    playBattleBgm();

    runTeamAbilities("battle_start", party);
    runTeamAbilities("passive", party);

    startCommandSelect();
  }, 2000);
}

function showTurnBanner(text){
  turnBanner.textContent = text;
  turnBanner.classList.remove("hidden");

  turnBanner.style.animation = "none";
  void turnBanner.offsetWidth;
  turnBanner.style.animation = "turnAnim 1.5s forwards";

  setTimeout(() => {
    turnBanner.classList.add("hidden");
  }, 1500);
}

function wait(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ================= コマンド選択 ================= */

function startCommandSelect(){
  if(checkEnd()) return;

  party.forEach(c => c.guard = false);
  enemies.forEach(e => e.guard = false);

  [...party, ...enemies].forEach(c => {
    applyStatusTurnStart(c, battleContext);
  });

  if(checkEnd()) return;

  runTeamAbilities("turn_start", party);
  runTeamAbilities("hp_over", party);
  runTeamAbilities("hp_under", party);

  renderParty();
  renderEnemies();

  commandQueue = [];
  turnStartButton.classList.add("hidden");

  addLog(`ターン${turnCount}：コマンド選択開始`);

  nextCommandSelect();
}

function nextCommandSelect(){
  const aliveParty = party.filter(c => c.hp > 0);

  if(commandQueue.length >= aliveParty.length){
    commandButtons.innerHTML = "";
    commandCharacterName.textContent = "全員選択完了";
    currentActorName.textContent = "行動開始待ち";
    turnStartButton.classList.remove("hidden");
    return;
  }

  const actor = aliveParty[commandQueue.length];

  currentActorName.textContent = actor.name;
  commandCharacterName.textContent = actor.name;

  commandButtons.innerHTML = "";

  getCommands(actor).forEach(cmd => {
    createCommandButton(cmd, actor);
  });
}

function getCommands(actor){
  let commands = actor.commands || [];

  if(actor.copiedCommand){
    commands = commands.map(c => {
      if(c.type === "copy_last_received_attack"){
        return actor.copiedCommand;
      }

      return c;
    });
  }

  return commands;
}

function createCommandButton(cmd, actor){

  const button = document.createElement("button");

  button.className =
    `command-button ${getCommandClass(cmd)}`;

  button.textContent = cmd.name;

  const cost =
    cmd.sp_cost || cmd.spCost || 0;

  if(actor.sp < cost){
    button.disabled = true;
  }

  let pressTimer = null;

  button.addEventListener("mousedown", e => {

    pressTimer = setTimeout(() => {

      showSkillTooltip(
        cmd,
        e.clientX,
        e.clientY
      );

    },500);

  });

  button.addEventListener("mouseup", () => {

    clearTimeout(pressTimer);

  });

  button.addEventListener("mouseleave", () => {

    clearTimeout(pressTimer);
    hideSkillTooltip();

  });

  button.addEventListener("touchstart", e => {

    const touch = e.touches[0];

    pressTimer = setTimeout(() => {

      showSkillTooltip(
        cmd,
        touch.clientX,
        touch.clientY
      );

    },500);

  });

  button.addEventListener("touchend", () => {

    clearTimeout(pressTimer);
    hideSkillTooltip();

  });

  button.onclick = () => {

    playSfx("click");

    commandQueue.push({
      actor,
      cmd,
      targetEnemy:selectedEnemy,
      targetAlly:selectedAlly
    });

    nextCommandSelect();
  };

  commandButtons.appendChild(button);
}

function getCommandClass(cmd){
  if(cmd.type === "guard") return "guard";

  if(cmd.type === "attack" || cmd.type === "multi_attack"){
    return "attack";
  }

  return "skill";
}

/* ================= ターン処理 ================= */

function getTeamSpd(team){
  return team
    .filter(c => {
      if(c.hp <= 0) return false;

      if(
        typeof cannotActByStatus === "function" &&
        c.status?.time_stop
      ){
        return false;
      }

      return true;
    })
    .reduce((sum, c) => {
      return sum + getStat(c, "spd");
    }, 0);
}

turnStartButton.onclick = async () => {
  playSfx("click");

  turnStartButton.classList.add("hidden");
  commandButtons.innerHTML = "";

  const playerSpd = getTeamSpd(party);
  const enemySpd = getTeamSpd(enemies);

  addLog(`味方SPD:${playerSpd} / 敵SPD:${enemySpd}`);

  if(playerSpd >= enemySpd){
    showTurnBanner("PLAYER FIRST");
    await wait(1500);

    await executePlayerTurn();
    if(checkEnd()) return;

    showTurnBanner("ENEMY TURN");
    await wait(1500);

    await executeEnemyTurn();
  }else{
    showTurnBanner("ENEMY FIRST");
    await wait(1500);

    await executeEnemyTurn();
    if(checkEnd()) return;

    showTurnBanner("PLAYER TURN");
    await wait(1500);

    await executePlayerTurn();
  }

  if(checkEnd()) return;

  reduceBuffTurns();
  turnCount++;

  startCommandSelect();
};

async function executePlayerTurn(){
  for(const action of commandQueue){
    const actor = action.actor;

    if(actor.hp <= 0){
      continue;
    }

    const cannotReason = cannotActByStatus(actor);

    if(cannotReason){
      addLog(`${actor.name} は${cannotReason}で動けない`);
      continue;
    }

    applyStatusBeforeAction(actor, battleContext);

    if(checkEnd()) return;

    await executeCommand(actor, action.cmd, action);

    renderParty();
    renderEnemies();

    if(checkEnd()) return;

    await wait(900);
  }
}

async function executeEnemyTurn(){
  for(const enemy of enemies){

    if(enemy.hp <= 0){
      continue;
    }

    const cannotReason =
      cannotActByStatus(enemy);

    if(cannotReason){
      addLog(
        `${enemy.name} は${cannotReason}で動けない`
      );
      continue;
    }

    applyStatusBeforeAction(
      enemy,
      battleContext
    );

    if(checkEnd()) return;

    const targets =
      party.filter(c => c.hp > 0);

    if(targets.length === 0){
      return;
    }

    const target =
      chooseEnemyTarget(targets);

    const cmd =
      enemy.commands[0];

    playSfx("attack");

    damage(
      enemy,
      target,
      cmd.power || 1,
      cmd
    );

    renderParty();
    renderEnemies();

    if(checkEnd()) return;

    await wait(900);
  }
}

/* ================= コマンド実行 ================= */

async function executeCommand(actor, cmd, action){
  const cost = cmd.sp_cost || cmd.spCost || 0;

  if(cost > 0){
    actor.sp -= cost;
  }

  if(cmd.type === "guard"){
    playSfx("guard");
  }else if(cmd.type === "attack" || cmd.type === "multi_attack"){
    playSfx("attack");
  }else{
    playSfx("skill");
  }

  const effect = SKILL_EFFECTS[cmd.type];

  if(effect){
    effect(battleContext, actor, cmd, action);
  }else{
    addLog(`${cmd.name} は未実装`);
  }

  const target = getEnemyTarget(action.targetEnemy);

  runAbilities("attack", actor, target, cmd);
  runAbilities("skill_hit", actor, target, cmd);
  runAbilities("action_hp_under", actor, target, cmd);
}

/* ================= ターゲット ================= */

function getEnemyTarget(id){
  return (
    enemies.find(e => e.id === id && e.hp > 0) ||
    enemies.find(e => e.hp > 0)
  );
}

function chooseEnemyTarget(targets){
  if(!targets || targets.length === 0){
    return null;
  }

  // 挑発優先
  const taunts = targets.filter(t =>
    t.status?.taunt &&
    t.hp > 0
  );

  if(taunts.length > 0){
    return taunts[
      Math.floor(Math.random() * taunts.length)
    ];
  }

  return targets[
    Math.floor(Math.random() * targets.length)
  ];
}

function isEvade(target){
  if(!target) return false;

  if(target.status?.evade_seal){
    return false;
  }

  let eva = getStat(target, "eva") || 0;

  // EVAが5なら5%
  if(eva > 1){
    eva = eva / 100;
  }

  return Math.random() < eva;
}

/* ================= ダメージ ================= */

function damage(actor, target, power, cmd = {}){
  if(!target || target.hp <= 0) return;

  if(isEvade(target)){
    addLog(`${target.name} は回避した！`);
    runAbilities("dodge_success", target, actor, cmd);
    return;
  }

  if(target.status?.damage_transfer){
    if(Math.random() < 0.15){
      addLog(`${target.name} は${jpStatus("damage_transfer")}した`);
      return;
    }
  }

  const guardRate = target.guard ? 0.5 : 1;
  const attrRate = getAttributeRate(actor.attribute, target.attribute);

 const shockRate =
  target.status?.shock ? 1.1 : 1;

const dmg = Math.floor(
  Math.max(1, getStat(actor, "atk") * power - getStat(target, "def")) *
  guardRate *
  attrRate *
  shockRate
);

  target.hp -= dmg;

  applyStatusDamageReaction(target, "freeze");
  applyStatusDamageReaction(target, "sleep");

  playSfx("hit");

  if(target.hp <= 0){
    const survived = runFatalAbilities(target);

    if(!survived){
      target.hp = 0;
    }
  }

  if(target.hp < 0){
    target.hp = 0;
  }

  addLog(`${actor.name} → ${target.name} に ${dmg} ダメージ`);

  runAbilities("receive_attack", target, actor, cmd);
  runAbilities("damage_taken", target, actor, cmd);

  if(target.hp <= 0){
    runAbilities("enemy_defeat", actor, target, cmd);
  }
}



function getAttributeRate(a, b){
  if(a === "red" && b === "blue") return 1.3;
  if(a === "blue" && b === "green") return 1.3;
  if(a === "green" && b === "red") return 1.3;

  if(a === "red" && b === "green") return 0.75;
  if(a === "blue" && b === "red") return 0.75;
  if(a === "green" && b === "blue") return 0.75;

  return 1;
}

/* ================= ステータス ================= */

function getStat(c, stat){
  const base = c[stat] ?? c.stats?.[stat] ?? 0;

  let rate = 1;

  c.buffs.forEach(b => {
    if(b.stat === stat){
      rate += b.value;
    }
  });

  return Math.floor(base * rate);
}

function addBuff(target, stat, value, turn, name){
  target.buffs.push({ stat, value, turn, name });
  abilityLog(target, name);
}

function reduceBuffTurns(){
  [...party, ...enemies].forEach(c => {
    if(c.buffs){
      c.buffs.forEach(b => b.turn--);
      c.buffs = c.buffs.filter(b => b.turn > 0);
    }

    reduceStatusTurns(c);
  });
}

/* ================= アビリティ ================= */

function getAbilities(character){
  return character.abilities || [];
}

function runTeamAbilities(trigger, team){
  team.forEach(c => {
    if(c.hp > 0){
      runAbilities(trigger, c);
    }
  });
}

function runAbilities(trigger, owner, target = null, cmd = null){
  getAbilities(owner).forEach(ability => {
    if(ability.trigger !== trigger) return;
    if(!checkAbilityCondition(owner, ability)) return;

    const effect = ABILITY_EFFECTS[ability.effect];

    if(effect){
      effect(battleContext, owner, ability, target, cmd);
    }
  });
}

function runFatalAbilities(owner){
  let survived = false;

  getAbilities(owner).forEach(ability => {
    if(ability.trigger !== "fatal_damage") return;

    const effect = ABILITY_EFFECTS[ability.effect];

    if(effect){
      const result = effect(battleContext, owner, ability);

      if(result === true){
        survived = true;
      }
    }
  });

  return survived;
}

function checkAbilityCondition(owner, ability){
  const hpRate = owner.hp / owner.maxHp;

  if(ability.trigger === "hp_over"){
    return hpRate >= ability.condition_value;
  }

  if(ability.trigger === "hp_under"){
    return hpRate <= ability.condition_value;
  }

  if(ability.trigger === "skill_attack_hp_under"){
    return hpRate <= ability.condition_value;
  }

  if(ability.trigger === "action_hp_under"){
    return hpRate <= ability.condition_value;
  }

  if(ability.chance !== undefined){
    return Math.random() < ability.chance;
  }

  return true;
}
function checkEnd(){
  if(battleEnd) return true;

  /* ================= 勝利 ================= */
if(enemies.every(e => e.hp <= 0)){
  battleEnd = true;

  stopBattleBgm();
  playSfx("win");

  addLog("勝利！");

  const clearedStoryId = localStorage.getItem("selectedStoryId");
  const nextStoryId = localStorage.getItem("nextStoryId");

  if(clearedStoryId){
    clearStory(clearedStoryId);
  }

  if(nextStoryId){
    unlockStory(nextStoryId);
  }

  localStorage.setItem("battleRewardExp", "100");
  localStorage.setItem("battleRewardGold", "50");
  localStorage.setItem("battleRewardStone", "10");
  localStorage.setItem("battleRewardCharacterExp", "80");

  savePlayerData(PLAYER);

  setTimeout(() => {
    location.href = "victory.html";
  }, 1200);

  return true;
}

  /* ================= 敗北 ================= */

  if(party.every(c => c.hp <= 0)){
    battleEnd = true;

    stopBattleBgm();
    playSfx("lose");

    addLog("敗北...");

    setTimeout(() => {
      location.href = "defeat.html";
    }, 1200);

    return true;
  }

  return false;
}

/* ================= 起動 ================= */

renderParty();
renderEnemies();
showBattleStart();

const menuButton = document.getElementById("menu-button");
const battleMenu = document.getElementById("battle-menu");
const menuClose = document.getElementById("menu-close");
const resumeButton = document.getElementById("resume-button");
const retireButton = document.getElementById("retire-button");

function openBattleMenu(){
  battleMenu.classList.remove("hidden");
}

function closeBattleMenu(){
  battleMenu.classList.add("hidden");
}

menuButton.onclick = openBattleMenu;
menuClose.onclick = closeBattleMenu;
resumeButton.onclick = closeBattleMenu;

retireButton.onclick = () => {
  const ok = confirm("バトルを中断しますか？");

  if(!ok) return;

  stopBattleBgm?.();

  location.href = "story_select.html";
};

function loadBattleVolumes(){
  const bgm = localStorage.getItem("bgmVolume") || PLAYER?.bgmVolume || 80;
  const se = localStorage.getItem("seVolume") || PLAYER?.seVolume || 80;

  bgmVolumeSlider.value = bgm;
  seVolumeSlider.value = se;

  bgmValue.textContent = `${bgm}%`;
  seValue.textContent = `${se}%`;

  if(typeof bgmAudio !== "undefined" && bgmAudio){
    bgmAudio.volume = bgm / 100;
  }
}

bgmVolumeSlider.oninput = () => {
  const value = Number(bgmVolumeSlider.value);

  bgmValue.textContent = `${value}%`;
  localStorage.setItem("bgmVolume", value);

  if(typeof PLAYER !== "undefined"){
    PLAYER.bgmVolume = value;
    savePlayerData(PLAYER);
  }

  if(typeof bgmAudio !== "undefined" && bgmAudio){
    bgmAudio.volume = value / 100;
  }
};

seVolumeSlider.oninput = () => {
  const value = Number(seVolumeSlider.value);

  seValue.textContent = `${value}%`;
  localStorage.setItem("seVolume", value);

  if(typeof PLAYER !== "undefined"){
    PLAYER.seVolume = value;
    savePlayerData(PLAYER);
  }
};

loadBattleVolumes();