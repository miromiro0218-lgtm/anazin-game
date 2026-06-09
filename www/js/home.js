function scaleScreen(){
  const baseW = 1980;
  const baseH = 1080;
  const scale = Math.min(window.innerWidth / baseW, window.innerHeight / baseH);

  const screen = document.querySelector(".screen");
  if(screen){
    screen.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }
}

window.addEventListener("resize", scaleScreen);

const HOME_MESSAGES = [
  "今日も準備していこう！",
  "ストーリーを進める？",
  "編成を見直すのも大事だね。",
  "ガチャ石の使いすぎには注意だよ。",
  "ミッションも確認しておこう。",
  "今日も一歩ずつ進もう。"
];

function setText(id, text){
  const el = document.getElementById(id);
  if(el) el.textContent = text;
}

function openParty(){
  localStorage.setItem("returnPage", "index.html");
  location.href = "party.html";
}

function updateHomeUI(){
  setText("player-rank", PLAYER.rank ?? 1);
  setText("player-name", PLAYER.name ?? "プレイヤー");
  setText("gold-count", PLAYER.gold ?? 0);
  setText("stone-count", PLAYER.stone ?? 0);

  const message = HOME_MESSAGES[Math.floor(Math.random() * HOME_MESSAGES.length)];
  setText("home-message", message);
}

window.addEventListener("load", () => {
  scaleScreen();
  updateHomeUI();
});