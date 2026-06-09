const STATUS_DATA = {
  burn: {
    name: "やけど",
    label: "火",
    icon: "🔥",
    defaultTurn: 3,
    type: "bad",
    description: "毎ターン最大HPの5%ダメージ。ATKが10%低下"
  },

  poison: {
    name: "毒",
    label: "毒",
    icon: "☠️",
    defaultTurn: 4,
    type: "bad",
    description: "毎ターン最大HPの8%ダメージ"
  },

  paralyze: {
    name: "麻痺",
    label: "痺",
    icon: "⚡",
    defaultTurn: 2,
    type: "bad",
    description: "30%の確率で行動できない"
  },

  freeze: {
    name: "凍結",
    label: "凍",
    icon: "❄️",
    defaultTurn: 1,
    type: "bad",
    description: "行動できない。ダメージを受けると解除"
  },

  sleep: {
    name: "睡眠",
    label: "眠",
    icon: "💤",
    defaultTurn: 2,
    type: "bad",
    description: "行動できない。ダメージを受けると解除"
  },

  fear: {
    name: "恐怖",
    label: "怖",
    icon: "👁",
    defaultTurn: 2,
    type: "bad",
    description: "20%の確率で行動できない。ATKが15%低下"
  },

  bleed: {
    name: "出血",
    label: "血",
    icon: "🩸",
    defaultTurn: 3,
    type: "bad",
    description: "行動するたび最大HPの6%ダメージ"
  },

  confusion: {
    name: "混乱",
    label: "乱",
    icon: "🌀",
    defaultTurn: 2,
    type: "bad",
    description: "行動対象がランダムになる"
  },

  attack_seal: {
    name: "攻撃不可",
    label: "攻封",
    icon: "⚔️",
    defaultTurn: 2,
    type: "bad",
    description: "通常攻撃が使えない"
  },

  skill_seal: {
    name: "能力不可",
    label: "能封",
    icon: "✖",
    defaultTurn: 2,
    type: "bad",
    description: "能力・スキルが使えない"
  },

  guard_seal: {
    name: "防御不可",
    label: "防封",
    icon: "🛡️",
    defaultTurn: 2,
    type: "bad",
    description: "防御コマンドが使えない"
  },

  evade_seal: {
    name: "回避不可",
    label: "避封",
    icon: "🚫",
    defaultTurn: 2,
    type: "bad",
    description: "EVAが0扱いになる"
  },

  time_stop: {
    name: "時間停止",
    label: "時",
    icon: "⏰",
    defaultTurn: 1,
    type: "special",
    description: "行動できない"
  },

  judgment: {
    name: "裁判",
    label: "裁",
    icon: "⚖️",
    defaultTurn: 3,
    type: "special",
    description: "毎ターンランダムで弱体効果を受ける"
  },

  taunt: {
    name: "挑発",
    label: "挑",
    icon: "🎯",
    defaultTurn: 2,
    type: "special",
    description: "敵の攻撃を引きつける"
  },

  status_immunity: {
    name: "状態異常無効",
    label: "免",
    icon: "🛡",
    defaultTurn: 3,
    type: "good",
    description: "状態異常を受けない"
  },

  status_resist: {
    name: "状態異常耐性",
    label: "耐",
    icon: "◇",
    defaultTurn: 99,
    type: "good",
    description: "状態異常にかかりにくくなる"
  },

  atk_up: {
    name: "ATK上昇",
    label: "攻↑",
    icon: "▲",
    defaultTurn: 2,
    type: "buff",
    stat: "atk",
    value: 0.25,
    description: "ATKが上昇"
  },

  def_up: {
    name: "DEF上昇",
    label: "防↑",
    icon: "▲",
    defaultTurn: 2,
    type: "buff",
    stat: "def",
    value: 0.25,
    description: "DEFが上昇"
  },

  spd_up: {
    name: "SPD上昇",
    label: "速↑",
    icon: "▲",
    defaultTurn: 2,
    type: "buff",
    stat: "spd",
    value: 0.25,
    description: "SPDが上昇"
  },

  eva_up: {
    name: "EVA上昇",
    label: "避↑",
    icon: "▲",
    defaultTurn: 2,
    type: "buff",
    stat: "eva",
    value: 0.25,
    description: "EVAが上昇"
  },

  atk_down: {
    name: "ATK低下",
    label: "攻↓",
    icon: "▼",
    defaultTurn: 2,
    type: "debuff",
    stat: "atk",
    value: -0.2,
    description: "ATKが低下"
  },

  def_down: {
    name: "DEF低下",
    label: "防↓",
    icon: "▼",
    defaultTurn: 2,
    type: "debuff",
    stat: "def",
    value: -0.2,
    description: "DEFが低下"
  },

  spd_down: {
    name: "SPD低下",
    label: "速↓",
    icon: "▼",
    defaultTurn: 2,
    type: "debuff",
    stat: "spd",
    value: -0.2,
    description: "SPDが低下"
  },

  eva_down: {
    name: "EVA低下",
    label: "避↓",
    icon: "▼",
    defaultTurn: 2,
    type: "debuff",
    stat: "eva",
    value: -0.2,
    description: "EVAが低下"
  }
};

function getStatusData(statusId){
  return STATUS_DATA[statusId] || null;
}

function getStatusName(statusId){
  return STATUS_DATA[statusId]?.name || statusId;
}

function getStatusIcon(statusId){
  return STATUS_DATA[statusId]?.icon || "?";
}

function getStatusLabel(statusId){
  return STATUS_DATA[statusId]?.label || "?";
}

function getStatusDescription(statusId){
  return STATUS_DATA[statusId]?.description || "";
}

function getStatusDefaultTurn(statusId){
  return STATUS_DATA[statusId]?.defaultTurn || 1;
}

function isBadStatus(statusId){
  const type = STATUS_DATA[statusId]?.type;
  return type === "bad" || type === "special" || type === "debuff";
}

function hasStatus(character, statusId){
  return !!character.status?.[statusId];
}

function addStatus(target, statusId, turn = null, chance = 1){
  if(!target || target.hp <= 0) return false;

  if(!target.status){
    target.status = {};
  }

  if(isBadStatus(statusId) && target.status.status_immunity){
    return false;
  }

  const finalTurn =
    turn || getStatusDefaultTurn(statusId);

  if(Math.random() > chance){
    return false;
  }

  target.status[statusId] = finalTurn;
  return true;
}

function removeStatus(target, statusId){
  if(!target || !target.status) return;
  delete target.status[statusId];
}

function clearBadStatuses(target){
  if(!target || !target.status) return;

  Object.keys(target.status).forEach(statusId => {
    if(isBadStatus(statusId)){
      delete target.status[statusId];
    }
  });
}

function cannotActByStatus(character){
  if(!character.status) return null;

  if(character.status.time_stop) return "時間停止";
  if(character.status.freeze) return "凍結";
  if(character.status.sleep) return "睡眠";

  if(character.status.paralyze){
    if(Math.random() < 0.3){
      return "麻痺";
    }
  }

  if(character.status.fear){
    if(Math.random() < 0.2){
      return "恐怖";
    }
  }

  return null;
}

function applyStatusTurnStart(character, ctx){
  if(!character || character.hp <= 0) return;

  if(character.status.burn){
    const dmg = Math.floor(character.maxHp * 0.05);
    character.hp = Math.max(0, character.hp - dmg);
    ctx.addLog(`${character.name} はやけどで ${dmg} ダメージ`);
  }

  if(character.status.poison){
    const dmg = Math.floor(character.maxHp * 0.08);
    character.hp = Math.max(0, character.hp - dmg);
    ctx.addLog(`${character.name} は毒で ${dmg} ダメージ`);
  }

  if(character.status.judgment){
    applyJudgment(character, ctx);
  }
}

function applyStatusBeforeAction(character, ctx){
  if(!character || character.hp <= 0) return;

  if(character.status.bleed){
    const dmg = Math.floor(character.maxHp * 0.06);
    character.hp = Math.max(0, character.hp - dmg);
    ctx.addLog(`${character.name} は出血で ${dmg} ダメージ`);
  }
}

function applyJudgment(character, ctx){
  const effects = ["atk_down", "def_down", "spd_down", "skill_seal"];
  const picked = effects[Math.floor(Math.random() * effects.length)];

  addStatus(character, picked, 1, 1);

  ctx.addLog(`${character.name} に裁判の効果：${getStatusName(picked)}`);
}

function reduceStatusTurns(character){
  if(!character.status) return;

  Object.keys(character.status).forEach(statusId => {
    if(typeof character.status[statusId] === "number"){
      character.status[statusId]--;

      if(character.status[statusId] <= 0){
        delete character.status[statusId];
      }
    }
  });
}

function applyStatusDamageReaction(target, statusId){
  if(!target || !target.status) return;

  if(statusId === "freeze"){
    delete target.status.freeze;
  }

  if(statusId === "sleep"){
    delete target.status.sleep;
  }
}