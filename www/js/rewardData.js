function generateStoryReward(
  story,
  chapter,
  firstClear = true
){
  const lv = story.recommend || 1;

  const chapterBonus =
    1 + (chapter - 1) * 0.25;

  if(firstClear){
    return {
      exp: Math.floor(lv * 100 * chapterBonus),
      gold: Math.floor(lv * 50 * chapterBonus),
      stone: Math.floor(lv * 10 * chapterBonus),
      charaExp: Math.floor(lv * 80 * chapterBonus)
    };
  }

  return {
    exp: Math.floor(lv * 50 * chapterBonus),
    gold: Math.floor(lv * 30 * chapterBonus),
    stone: 0,
    charaExp: Math.floor(lv * 40 * chapterBonus)
  };
}