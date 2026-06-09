const DEFAULT_PLAYER_DATA = {
  name: "プレイヤー",
  rank: 1,
  exp: 0,

  gold: 1000,
  stone: 3000,
  friendPoint: 0,

  party: [
    "chara_001",
    "chara_002",
    "chara_003"
  ],

  ownedCharacters: [
    "chara_001",
    "chara_002",
    "chara_003"
  ],

  characterLevels: {},
  characterExp: {},
  characterAwaken: {},
  characterFragments: {},

  unlockedStories: ["1_1"],
  clearedStories: [],

  totalGachaCount: 0,

  items: {},

  missions: [],
  missionProgress: {},
  achievements: [],

  discoveredCharacters: [
    "chara_001",
    "chara_002",
    "chara_003"
  ],

  discoveredEnemies: [],

  bgmVolume: 80,
  seVolume: 80,
  textSpeed: 2,
  autoMode: false,
  skipReadOnly: true,

  tutorialFinished: false
};

/* =====================
   読み込み・保存
===================== */

function loadPlayerData(){
  let data =
    JSON.parse(localStorage.getItem("playerData"));

  if(!data){
    data = structuredClone(DEFAULT_PLAYER_DATA);
  }

  if(!data.characterLevels) data.characterLevels = {};
  if(!data.characterExp) data.characterExp = {};
  if(!data.characterAwaken) data.characterAwaken = {};
  if(!data.characterFragments) data.characterFragments = {};
  if(!data.ownedCharacters) data.ownedCharacters = [];
  if(!data.discoveredCharacters) data.discoveredCharacters = [];
  if(!data.party) data.party = [];
  if(!data.unlockedStories) data.unlockedStories = ["1_1"];
  if(!data.clearedStories) data.clearedStories = [];
  if(!data.items) data.items = {};

  /* 開発用：全キャラ所持 */
  if(typeof CHARA_DATA !== "undefined"){
    data.ownedCharacters =
      CHARA_DATA.map(c => c.id);

    data.discoveredCharacters =
      CHARA_DATA.map(c => c.id);

    CHARA_DATA.forEach(c => {
      if(!data.characterLevels[c.id]){
        data.characterLevels[c.id] = 1;
      }

      if(!data.characterExp[c.id]){
        data.characterExp[c.id] = 0;
      }
    });
  }

  while(data.party.length < 3){
    data.party.push(null);
  }

  savePlayerData(data);
  return data;
}

function savePlayerData(data){
  localStorage.setItem(
    "playerData",
    JSON.stringify(data)
  );
}

function resetPlayerData(){
  const data =
    structuredClone(DEFAULT_PLAYER_DATA);

  savePlayerData(data);

  location.reload();

  return data;
}

const PLAYER = loadPlayerData();

/* =====================
   通貨
===================== */

function addGold(amount){
  PLAYER.gold =
    (PLAYER.gold || 0) + amount;

  savePlayerData(PLAYER);
}

function addStone(amount){
  PLAYER.stone =
    (PLAYER.stone || 0) + amount;

  savePlayerData(PLAYER);
}

function useStone(amount){
  if((PLAYER.stone || 0) < amount){
    return false;
  }

  PLAYER.stone -= amount;

  savePlayerData(PLAYER);

  return true;
}

/* =====================
   プレイヤーEXP
===================== */

function addPlayerExp(amount){
  PLAYER.exp =
    (PLAYER.exp || 0) + amount;

  while(
    PLAYER.exp >= getNeedExp(PLAYER.rank)
  ){
    PLAYER.exp -= getNeedExp(PLAYER.rank);
    PLAYER.rank++;
  }

  savePlayerData(PLAYER);
}

function getNeedExp(rank){
  return rank * 100;
}

/* =====================
   キャラ所持
===================== */

function ownCharacter(characterId){
  return PLAYER.ownedCharacters.includes(characterId);
}

function addCharacter(characterId){
  if(!PLAYER.ownedCharacters.includes(characterId)){
    PLAYER.ownedCharacters.push(characterId);

    PLAYER.characterLevels[characterId] = 1;
    PLAYER.characterExp[characterId] = 0;

    if(!PLAYER.discoveredCharacters.includes(characterId)){
      PLAYER.discoveredCharacters.push(characterId);
    }

    savePlayerData(PLAYER);

    return true;
  }

  addCharacterFragment(characterId);

  savePlayerData(PLAYER);

  return false;
}

function addCharacterFragment(characterId, amount = 1){
  PLAYER.characterFragments[characterId] =
    (PLAYER.characterFragments[characterId] || 0) + amount;

  savePlayerData(PLAYER);
}

/* =====================
   ストーリー
===================== */

function unlockStory(storyId){
  if(!storyId) return;

  if(!PLAYER.unlockedStories.includes(storyId)){
    PLAYER.unlockedStories.push(storyId);
  }

  savePlayerData(PLAYER);
}

function clearStory(storyId){
  if(!storyId) return;

  if(!PLAYER.clearedStories.includes(storyId)){
    PLAYER.clearedStories.push(storyId);
  }

  savePlayerData(PLAYER);
}

/* =====================
   編成
===================== */

function setParty(partyIds){
  PLAYER.party =
    partyIds
      .filter(id => id)
      .slice(0, 3);

  while(PLAYER.party.length < 3){
    PLAYER.party.push(null);
  }

  savePlayerData(PLAYER);
}

/* =====================
   キャラ育成
===================== */

function getCharacterLevel(characterId){
  return PLAYER.characterLevels[characterId] || 1;
}

function getCharacterExp(characterId){
  return PLAYER.characterExp[characterId] || 0;
}

function getCharacterNeedExp(level){
  return level * 80;
}

function addCharacterExp(characterId, amount){
  if(!characterId) return;

  if(!PLAYER.characterLevels[characterId]){
    PLAYER.characterLevels[characterId] = 1;
  }

  if(!PLAYER.characterExp[characterId]){
    PLAYER.characterExp[characterId] = 0;
  }

  PLAYER.characterExp[characterId] += amount;

  while(
    PLAYER.characterLevels[characterId] < 100 &&
    PLAYER.characterExp[characterId] >=
      getCharacterNeedExp(PLAYER.characterLevels[characterId])
  ){
    PLAYER.characterExp[characterId] -=
      getCharacterNeedExp(PLAYER.characterLevels[characterId]);

    PLAYER.characterLevels[characterId]++;
  }

  savePlayerData(PLAYER);
}

function addPartyCharacterExp(amount){
  PLAYER.party.forEach(characterId => {
    if(characterId){
      addCharacterExp(characterId, amount);
    }
  });

  savePlayerData(PLAYER);
}

/* =====================
   アビリティ解放
===================== */

function getUnlockedAbilities(character){
  const level =
    getCharacterLevel(character.id);

  if(!character.abilities) return [];

  return character.abilities.filter((ability, index) => {
    if(index === 0) return level >= 25;
    if(index === 1) return level >= 50;
    if(index === 2) return level >= 75;

    return false;
  });
}

function getLockedAbilityText(index){
  if(index === 0) return "Lv25で解放";
  if(index === 1) return "Lv50で解放";
  if(index === 2) return "Lv75で解放";

  return "未解放";
}

/* =====================
   レベル補正ステータス
===================== */

function getLevelBonus(level){
  return 1 + (level - 1) * 0.03;
}

function getCharacterBattleStats(character){
  const level =
    getCharacterLevel(character.id);

  const bonus =
    getLevelBonus(level);

  return {
    hp: Math.floor(character.stats.hp * bonus),
    atk: Math.floor(character.stats.atk * bonus),
    def: Math.floor(character.stats.def * bonus),
    spd: Math.floor(character.stats.spd * bonus),
    sp: Math.floor(character.stats.sp * bonus),
    eva: character.stats.eva
  };
}