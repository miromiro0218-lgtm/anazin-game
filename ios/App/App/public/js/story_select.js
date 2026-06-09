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
   DOM
===================== */

const storyList = document.getElementById("story-list");
const startButton = document.getElementById("start-button");
const chapterTitle = document.getElementById("chapter-title");
const storyImage = document.getElementById("story-image");
const storyTitle = document.getElementById("story-title");
const storySubtitle = document.getElementById("story-subtitle");
const storyLevel = document.getElementById("story-level");
const prevChapterButton = document.getElementById("prev-chapter");
const nextChapterButton = document.getElementById("next-chapter");

/* =====================
   データ確認
===================== */

if(typeof STORY_DATA === "undefined"){
  alert("STORY_DATA が読み込まれていません。storyData.js を確認してください。");
}

if(typeof PLAYER === "undefined"){
  alert("PLAYER が読み込まれていません。playerData.js を確認してください。");
}

/* =====================
   状態
===================== */

let currentChapterIndex = 0;
let currentChapter = STORY_DATA[currentChapterIndex];
let currentStory = getFirstSelectableStory(currentChapter);

/* =====================
   解放・クリア判定
===================== */

function isUnlocked(story){
  return (
    story.unlocked === true ||
    PLAYER.unlockedStories.includes(story.id)
  );
}

function isCleared(story){
  return (
    story.cleared === true ||
    PLAYER.clearedStories.includes(story.id)
  );
}

/* =====================
   最初に選べる話
===================== */

function getFirstSelectableStory(chapter){
  return (
    chapter.stories.find(story => isUnlocked(story)) ||
    chapter.stories[0]
  );
}

/* =====================
   編成へ
===================== */

function goPartyFromStory(){
  localStorage.setItem("returnPage", "story_select.html");
  location.href = "party.html";
}

/* =====================
   章切り替え
===================== */

function changeChapter(direction){
  const nextIndex = currentChapterIndex + direction;

  if(nextIndex < 0) return;
  if(nextIndex >= STORY_DATA.length) return;

  currentChapterIndex = nextIndex;
  currentChapter = STORY_DATA[currentChapterIndex];
  currentStory = getFirstSelectableStory(currentChapter);

  renderAll();
}

if(prevChapterButton){
  prevChapterButton.onclick = () => {
    changeChapter(-1);
  };
}

if(nextChapterButton){
  nextChapterButton.onclick = () => {
    changeChapter(1);
  };
}

/* =====================
   描画
===================== */

function renderAll(){
  renderChapter();
  renderStoryList();
  updateStoryInfo();
}

function renderChapter(){
  if(chapterTitle){
    chapterTitle.textContent = currentChapter.chapter;
  }

  if(prevChapterButton){
    prevChapterButton.disabled = currentChapterIndex <= 0;
  }

  if(nextChapterButton){
    nextChapterButton.disabled =
      currentChapterIndex >= STORY_DATA.length - 1;
  }
}

function renderStoryList(){
  if(!storyList){
    alert("story-list が見つかりません");
    return;
  }

  storyList.innerHTML = "";

  currentChapter.stories.forEach((story, index) => {
    const unlocked = isUnlocked(story);
    const cleared = isCleared(story);

    const button = document.createElement("button");
    button.className = "story-button";

    if(currentStory && story.id === currentStory.id){
      button.classList.add("selected");
    }

    if(!unlocked){
      button.classList.add("lock");
    }

    button.innerHTML = `
      <span class="story-number">
        ${index + 1}話
      </span>

      <span class="story-clear-mark">
        ${cleared ? "★★★★★" : "○○○○○"}
      </span>
    `;

    button.onclick = () => {
      if(!unlocked) return;

      currentStory = story;
      renderStoryList();
      updateStoryInfo();
    };

    storyList.appendChild(button);
  });
}

/* =====================
   右側情報
===================== */

function updateStoryInfo(){
  if(!currentStory) return;

  const unlocked = isUnlocked(currentStory);

  if(storyImage){
    storyImage.src = currentStory.image || "";
  }

  if(storyTitle){
    storyTitle.textContent = currentStory.title || "";
  }

  if(storySubtitle){
    storySubtitle.textContent =
      unlocked
        ? currentStory.subtitle || ""
        : "未解放";
  }

  if(storyLevel){
    storyLevel.textContent =
      unlocked
        ? `推奨Lv ${currentStory.recommend ?? 1}`
        : "LOCKED";
  }

  if(startButton){
    startButton.disabled = !unlocked;
  }
}

/* =====================
   スタート
===================== */

if(startButton){
  startButton.onclick = () => {
    if(!currentStory || !isUnlocked(currentStory)) return;

    localStorage.setItem("selectedStoryId", currentStory.id);
    localStorage.setItem("selectedStoryFile", currentStory.file);
    localStorage.setItem("selectedBattleId", currentStory.battleId || "");
    localStorage.setItem("nextStoryId", currentStory.nextStoryId || "");

    PLAYER.currentChapter = currentChapter.chapter;
    PLAYER.currentStory = currentStory.id;

    savePlayerData(PLAYER);

    location.href = "story.html";
  };
}

/* =====================
   スクロール補助
===================== */

storyList?.addEventListener("wheel", e => {
  const container = document.querySelector(".story-side");
  if(!container) return;

  container.scrollTop += e.deltaY;
});

/* =====================
   起動
===================== */

window.addEventListener("load", () => {
  scaleScreen();
  renderAll();
});

window.addEventListener("resize", scaleScreen);