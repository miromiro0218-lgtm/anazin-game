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

const bgImage =
  document.getElementById("bg-image");

const leftCharacter =
  document.getElementById("left-character");

const rightCharacter =
  document.getElementById("right-character");

const speakerName =
  document.getElementById("speaker-name");

const messageText =
  document.getElementById("message-text");

const messageBox =
  document.getElementById("message-box");

const logButton =
  document.getElementById("log-button");

const autoButton =
  document.getElementById("auto-button");

const skipButton =
  document.getElementById("skip-button");

const hideButton =
  document.getElementById("hide-button");

const logModal =
  document.getElementById("log-modal");

const logList =
  document.getElementById("log-list");

const closeLog =
  document.getElementById("close-log");

/* =====================
   データ
===================== */

const selectedStoryId =
  localStorage.getItem("selectedStoryId");

const selectedStoryFile =
  localStorage.getItem("selectedStoryFile");

const selectedBattleId =
  localStorage.getItem("selectedBattleId");

let scenes = [];
let currentIndex = 0;

let isTyping = false;
let fullText = "";
let typingTimer = null;

let isAuto = false;
let autoTimer = null;

let storyLog = [];

/* =====================
   設定
===================== */

function getTextSpeed(){
  if(typeof PLAYER !== "undefined"){
    return PLAYER.textSpeed || 2;
  }

  return 2;
}

function getTypingDelay(){
  const speed = getTextSpeed();

  if(speed <= 1) return 45;
  if(speed === 2) return 28;
  if(speed === 3) return 15;

  return 28;
}

/* =====================
   読み込み
===================== */

async function loadStory(){
  if(!selectedStoryFile){
    alert("ストーリーファイルが選択されていません");
    location.href = "story_select.html";
    return;
  }

  try{
    const res = await fetch(selectedStoryFile);

    if(!res.ok){
      throw new Error("story json load failed");
    }

    scenes = await res.json();

    if(!Array.isArray(scenes)){
      throw new Error("story json is not array");
    }

    currentIndex = 0;
    showScene();

  }catch(error){
    console.error(error);
    alert("ストーリーを読み込めませんでした");
    location.href = "story_select.html";
  }
}

/* =====================
   表示
===================== */

function showScene(){
  clearTyping();
  clearAuto();

  if(currentIndex >= scenes.length){
    finishStory();
    return;
  }

  const scene = scenes[currentIndex];

  applySceneVisual(scene);

  fullText = scene.text || "";
  messageText.textContent = "";
  speakerName.textContent = scene.speaker || "";

  addStoryLog(scene);

  typeText(fullText);
}

function applySceneVisual(scene){
  if(bgImage){
    bgImage.src = scene.bg || "";
  }

  setCharacterImage(leftCharacter, scene.left);
  setCharacterImage(rightCharacter, scene.right);

  leftCharacter.classList.remove("inactive");
  rightCharacter.classList.remove("inactive");

  if(scene.active === "left"){
    rightCharacter.classList.add("inactive");
  }

  if(scene.active === "right"){
    leftCharacter.classList.add("inactive");
  }

  if(!scene.left){
    leftCharacter.classList.add("hidden-char");
  }else{
    leftCharacter.classList.remove("hidden-char");
  }

  if(!scene.right){
    rightCharacter.classList.add("hidden-char");
  }else{
    rightCharacter.classList.remove("hidden-char");
  }
}

function setCharacterImage(el, src){
  if(!el) return;

  if(src){
    el.src = src;
  }else{
    el.src = "";
  }
}

/* =====================
   文字送り
===================== */

function typeText(text){
  isTyping = true;

  let i = 0;
  const delay = getTypingDelay();

  function step(){
    if(i >= text.length){
      isTyping = false;

      if(isAuto){
        startAutoNext();
      }

      return;
    }

    messageText.textContent += text[i];
    i++;

    typingTimer = setTimeout(step, delay);
  }

  step();
}

function clearTyping(){
  if(typingTimer){
    clearTimeout(typingTimer);
    typingTimer = null;
  }

  isTyping = false;
}

function completeText(){
  clearTyping();
  messageText.textContent = fullText;

  if(isAuto){
    startAutoNext();
  }
}

/* =====================
   次へ
===================== */

function nextScene(){
  if(isTyping){
    completeText();
    return;
  }

  currentIndex++;
  showScene();
}

if(messageBox){
  messageBox.onclick = () => {
    nextScene();
  };
}

/* =====================
   ログ
===================== */

function addStoryLog(scene){
  if(!scene.text) return;

  storyLog.push({
    speaker: scene.speaker || "",
    text: scene.text || ""
  });

  renderLog();
}

function renderLog(){
  if(!logList) return;

  logList.innerHTML = "";

  storyLog.forEach(log => {
    const div = document.createElement("div");
    div.className = "log-line";

    div.innerHTML = `
      <span class="log-speaker">
        ${log.speaker}
      </span>
      ：${log.text}
    `;

    logList.appendChild(div);
  });

  logList.scrollTop = logList.scrollHeight;
}

if(logButton){
  logButton.onclick = () => {
    clearAuto();
    logModal.classList.remove("hidden");
  };
}

if(closeLog){
  closeLog.onclick = () => {
    logModal.classList.add("hidden");

    if(isAuto && !isTyping){
      startAutoNext();
    }
  };
}

/* =====================
   AUTO
===================== */

function startAutoNext(){
  clearAuto();

  autoTimer = setTimeout(() => {
    if(!logModal.classList.contains("hidden")) return;

    nextScene();
  }, 1300);
}

function clearAuto(){
  if(autoTimer){
    clearTimeout(autoTimer);
    autoTimer = null;
  }
}

if(autoButton){
  autoButton.onclick = () => {
    isAuto = !isAuto;

    autoButton.classList.toggle("active", isAuto);

    if(isAuto && !isTyping){
      startAutoNext();
    }else{
      clearAuto();
    }
  };
}

/* =====================
   SKIP
===================== */

if(skipButton){
  skipButton.onclick = () => {
    const ok = confirm("ストーリーをスキップしますか？");

    if(!ok) return;

    finishStory();
  };
}

/* =====================
   HIDE
===================== */

if(hideButton){
  hideButton.onclick = () => {
    document
      .querySelector(".screen")
      .classList
      .toggle("story-hide");
  };
}

/* =====================
   終了処理
===================== */

function finishStory(){
  clearTyping();
  clearAuto();

  if(selectedStoryId && typeof PLAYER !== "undefined"){
    PLAYER.currentStory = selectedStoryId;
    savePlayerData(PLAYER);
  }

  if(selectedBattleId){
    location.href = "battle.html";
  }else{
    location.href = "story_select.html";
  }
}

/* =====================
   起動
===================== */

window.addEventListener("load", () => {
  scaleScreen();
  loadStory();
});