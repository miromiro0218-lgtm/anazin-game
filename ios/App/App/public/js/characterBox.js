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

const grid = document.getElementById("character-grid");
const searchInput = document.getElementById("search");

let currentFilter = "ALL";

const FILTERS = {
  "全員": "ALL",
  "R": "R",
  "SR": "SR",
  "SSR": "SSR"
};

function getElement(character){
  return character.attribute || character.element || "red";
}

function getCardFrame(character){
  return `images/ui/cards/${getElement(character)}_${character.rarity}.png`;
}

function getFilteredCharacters(){
  const word = searchInput.value.trim();

  return CHARA_DATA.filter(character => {
    const rarityOK =
      currentFilter === "ALL" ||
      character.rarity === currentFilter;

    const nameOK =
      word === "" ||
      character.name.includes(word);

    return rarityOK && nameOK;
  });
}

function renderCharacters(){
  const list = getFilteredCharacters();

  grid.innerHTML = "";

  if(list.length === 0){
    grid.innerHTML = `
      <div class="empty-message">
        キャラが見つかりません
      </div>
    `;
    return;
  }

  list.forEach(character => {
    const card = document.createElement("div");
    card.className = "character";

    card.innerHTML = `
      <img
        class="card-frame"
        src="${getCardFrame(character)}"
        alt=""
      >

      <img
        class="char-img"
        src="${character.image}"
        alt="${character.name}"
        onerror="console.log('キャラ画像が見つからない:', this.src)"
      >

      <div class="name">
        ${character.name}
      </div>

      <div class="rarity ${character.rarity}">
        ${character.rarity}
      </div>
    `;

    card.onclick = () => {
      localStorage.setItem(
        "selectedCharacterId",
        character.id
      );

      location.href = "characterDetail.html";
    };

    grid.appendChild(card);
  });
}

function setupFilterButtons(){
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach(button => {
    button.onclick = () => {
      const text = button.textContent.trim();

      currentFilter = FILTERS[text] || "ALL";

      buttons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      renderCharacters();
    };
  });
}

function setupSearch(){
  searchInput.addEventListener("input", () => {
    renderCharacters();
  });
}

window.addEventListener("load", () => {
  searchInput.value = "";

  setupFilterButtons();
  setupSearch();

  const firstButton = document.querySelector(".filter-btn");

  if(firstButton){
    firstButton.classList.add("active");
  }

  scaleScreen();
  renderCharacters();
});

window.addEventListener("resize", scaleScreen);