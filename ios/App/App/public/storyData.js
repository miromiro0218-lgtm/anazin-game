const STORY_DATA = [
  {
    chapter: "第1章",
    stories: [

      {
        id: "1_1",
        title: "1話",
        subtitle: "始まり",
        image: "images/bg/school_evening.jpg",
        recommend: 1,

        file: "data/story/1_1.json",

        battleId: "battle_1_1",
        nextStoryId: "1_2",

        unlocked: true,
        cleared: false
      },

      {
        id: "1_2",
        title: "2話",
        subtitle: "違和感",
        image: "images/bg/school_evening.jpg",
        recommend: 3,

        file: "data/story/1_2.json",

        battleId: "battle_1_2",
        nextStoryId: "1_3",

        unlocked: false,
        cleared: false
      },

      {
        id: "1_3",
        title: "3話",
        subtitle: "出口",
        image: "images/bg/school_evening.jpg",
        recommend: 5,

        file: "data/story/1_3.json",

        battleId: "battle_1_3",
        nextStoryId: "1_4",

        unlocked: false,
        cleared: false
      },

      {
        id: "1_4",
        title: "4話",
        subtitle: "合流",
        image: "images/bg/school_evening.jpg",
        recommend: 7,

        file: "data/story/1_4.json",

        battleId: "battle_1_4",
        nextStoryId: "1_5",

        unlocked: false,
        cleared: false
      },

      {
        id: "1_5",
        title: "5話",
        subtitle: "戦闘開始",
        image: "images/bg/school_evening.jpg",
        recommend: 10,

        file: "data/story/1_5.json",

        battleId: "battle_1_5",
        nextStoryId: null,

        unlocked: false,
        cleared: false
      }

    ]
  }
];