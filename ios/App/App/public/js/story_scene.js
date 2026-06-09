function scaleScreen(){
  const baseW = 1980;
  const baseH = 1080;

  const scale = Math.min(
    window.innerWidth / baseW,
    window.innerHeight / baseH
  );

  document.querySelector(".screen").style.transform =
    `translate(-50%, -50%) scale(${scale})`;
}

const storyList = document.getElementById("story-list");
const startButton = document.getElementById("start-button");

let currentChapter = STORY_DATA[0];

let currentStory =
  currentChapter.stories.find(story => isUnlocked(story)) ||
  currentChapter.stories[0];

function isUnlocked(story){
  return (
    story.unlocked === true ||
    localStorage.getItem(`story_unlocked_${story.id}`) === "true"
  );
}

function isCleared(story){
  return (
    story.cleared === true ||
    localStorage.getItem(`story_cleared_${story.id}`) === "true"
  );
}

function renderStoryList(){
  document.getElementById("chapter-title").textContent =
    currentChapter.chapter;

  storyList.innerHTML = "";

  currentChapter.stories.forEach(story => {
    const unlocked = isUnlocked(story);
    const cleared = isCleared(story);

    const button = document.createElement("button");
    button.className = "story-button";

    if(story.id === currentStory.id){
      button.classList.add("selected");
    }

    if(!unlocked){
      button.classList.add("lock");
    }

    button.textContent =
      `${story.title} ${cleared ? "★" : "○○○○"}`;

    button.onclick = () => {
      if(!unlocked) return;

      currentStory = story;

      renderStoryList();
      updateStoryInfo();
    };

    storyList.appendChild(button);
  });
}

function updateStoryInfo(){
  const unlocked = isUnlocked(currentStory);

  document.getElementById("story-image").src =
    currentStory.image;

  document.getElementById("story-title").textContent =
    currentStory.title;

  document.getElementById("story-subtitle").textContent =
    currentStory.subtitle;

  document.getElementById("story-level").textContent =
    `推奨Lv ${currentStory.recommend}`;

  startButton.disabled = !unlocked;
}

startButton.onclick = () => {
  if(!currentStory || !isUnlocked(currentStory)) return;

  localStorage.setItem("selectedStoryId", currentStory.id);
  localStorage.setItem("selectedStoryFile", currentStory.file);
  localStorage.setItem("selectedBattleId", currentStory.battleId || "");
  localStorage.setItem("nextStoryId", currentStory.nextStoryId || "");

  location.href = "story.html";
};

window.addEventListener("load", () => {
  scaleScreen();
  renderStoryList();
  updateStoryInfo();
});

window.addEventListener("resize", scaleScreen);