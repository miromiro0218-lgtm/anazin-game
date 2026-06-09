/* ======================
   報酬取得
====================== */

const exp =
  Number(localStorage.getItem("battleRewardExp") || 0);

const gold =
  Number(localStorage.getItem("battleRewardGold") || 0);

const stone =
  Number(localStorage.getItem("battleRewardStone") || 0);

const charaExp =
  Number(localStorage.getItem("battleRewardCharacterExp") || 0);

/* ======================
   表示
====================== */

document.getElementById("reward-exp").textContent =
  exp;

document.getElementById("reward-gold").textContent =
  gold;

document.getElementById("reward-stone").textContent =
  stone;

document.getElementById("reward-character-exp").textContent =
  charaExp;

/* ======================
   報酬反映
====================== */

const oldRank =
  PLAYER.rank || 1;

/* プレイヤー経験値 */

if(typeof addPlayerExp === "function"){
  addPlayerExp(exp);
}else{
  PLAYER.exp =
    (PLAYER.exp || 0) + exp;
}

/* ゴールド */

PLAYER.gold =
  (PLAYER.gold || 0) + gold;

/* 石 */

PLAYER.stone =
  (PLAYER.stone || 0) + stone;

/* 編成キャラ経験値 */

if(typeof addPartyCharacterExp === "function"){
  addPartyCharacterExp(charaExp);
}

/* ======================
   ランクアップ表示
====================== */

const rankUpText =
  document.getElementById("rank-up-text");

if(
  rankUpText &&
  PLAYER.rank > oldRank
){
  rankUpText.textContent =
    `RANK UP！ ${oldRank} → ${PLAYER.rank}`;
}

/* ======================
   ストーリー解放表示
====================== */

const unlockText =
  document.getElementById("unlock-text");

const nextStoryId =
  localStorage.getItem("nextStoryId");

if(
  unlockText &&
  nextStoryId &&
  PLAYER.unlockedStories?.includes(nextStoryId)
){
  unlockText.textContent =
    `${nextStoryId} が解放された！`;
}

/* ======================
   保存
====================== */

savePlayerData(PLAYER);

/* ======================
   次へボタン
====================== */

const nextButton =
  document.getElementById("next-button");

nextButton.onclick = () => {

  localStorage.removeItem(
    "battleRewardExp"
  );

  localStorage.removeItem(
    "battleRewardGold"
  );

  localStorage.removeItem(
    "battleRewardStone"
  );

  localStorage.removeItem(
    "battleRewardCharacterExp"
  );

  location.href =
    "story_select.html";
};