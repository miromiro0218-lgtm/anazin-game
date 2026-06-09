const CHARA_DATA = [
  {
    id: "chara_001",
    name: "井口優斗",
    rarity: "R",
    attribute: "red",
    role: "高校生",
    image: "images/characters/yuto.png",

    stats: { hp: 1100, atk: 350, def: 180, spd: 220, sp: 120, eva: 8 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" },
      { name: "構え", type: "buff", effect: "atk_up", value: 0.4, turn: 2, target: "self" }
    ],

    abilities: [
      {
        name: "絶好調",
        trigger: "hp_over",
        condition_value: 0.75,
        effect: "atk_up",
        value: 0.75,
        description: "HP75%以上の時、ATKが75%上昇"
      }
    ]
  },

  {
    id: "chara_002",
    name: "明日木幸平",
    rarity: "R",
    attribute: "blue",
    role: "高校生",
    image: "images/characters/kohei.png",

    stats: { hp: 1000, atk: 160, def: 80, spd: 220, sp: 120, eva: 1 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" },
      { name: "構え", type: "buff", effect: "atk_up", value: 0.45, turn: 2, target: "self" }
    ],

    abilities: [
      {
        name: "渾身",
        trigger: "hp_under",
        condition_value: 0.25,
        effect: "atk_up",
        value: 0.75,
        description: "HP25%以下の時、ATKが75%上昇"
      }
    ]
  },

  {
    id: "chara_003",
    name: "海老原弥勒",
    rarity: "R",
    attribute: "green",
    role: "高校生",
    image: "images/characters/ebihara.png",

    stats: { hp: 1450, atk: 110, def: 120, spd: 200, sp: 120, eva: 1 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" },
      { name: "構え", type: "buff", effect: "def_up", value: 0.45, turn: 2, target: "self" }
    ],

    abilities: [
      {
        name: "かばう",
        trigger: "hp_over",
        condition_value: 0.5,
        effect: "party_def_up",
        value: 0.35,
        description: "HP50%以上の時、味方全体のDEFが35%上昇"
      }
    ]
  },

  {
    id: "chara_004",
    name: "金田（テレポート）",
    rarity: "SR",
    attribute: "red",
    role: "高校生能力者",
    image: "images/characters/kaneda_teleport.png",

    stats: { hp: 1600, atk: 125, def: 200, spd: 250, sp: 175, eva: 1 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" },
      { name: "テレポート", type: "buff", effect: "eva_up", value: 40, turn: 2, target: "self" }
    ],

    abilities: [
      {
        name: "瞬間移動",
        trigger: "battle_start",
        effect: "eva_up",
        value: 40,
        turn: 2,
        description: "戦闘開始から2ターン、EVAが大幅上昇"
      },
      {
        name: "残像回避",
        trigger: "dodge_success",
        effect: "spd_up",
        value: 0.25,
        turn: 1,
        description: "回避成功時、次のターンSPDが上昇"
      }
    ]
  },

  {
    id: "chara_005",
    name: "前田（スティールハント）",
    rarity: "SR",
    attribute: "green",
    role: "高校生能力者",
    image: "images/characters/maeda_stealhunt.png",

    stats: { hp: 1750, atk: 120, def: 120, spd: 250, sp: 140, eva: 1 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" },
      { name: "強奪", type: "debuff", effect: "atk_down", value: 0.25, turn: 2, target: "enemy_all" }
    ],

    abilities: [
      {
        name: "強奪（スティールハント）",
        trigger: "hp_over",
        condition_value: 0.5,
        effect: "enemy_all_atk_down",
        value: 0.2,
        description: "HP50%以上の時、敵全体のATKを20%下げる"
      },
      {
        name: "盗み癖",
        trigger: "attack",
        effect: "steal_buff",
        chance: 0.15,
        description: "攻撃時、低確率で敵のバフを奪う"
      }
    ]
  },

  {
    id: "chara_006",
    name: "明日木幸平（パージ）",
    rarity: "SSR",
    attribute: "blue",
    role: "高校生能力者",
    image: "images/characters/kohei_purge.png",

    stats: { hp: 2000, atk: 200, def: 150, spd: 175, sp: 325, eva: 7 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "浄化", type: "cleanse", sp_cost: 60, target: "ally_single" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "浄化（パージ）",
        trigger: "battle_start",
        effect: "status_immunity",
        turn: 3,
        description: "バトル開始から3ターン状態異常無効"
      },
      {
        name: "自己浄化",
        trigger: "turn_start",
        effect: "cleanse_self",
        description: "毎ターン開始時、自身の状態異常を解除"
      },
      {
        name: "無効領域",
        trigger: "passive",
        effect: "party_status_resist_up",
        value: 0.3,
        description: "味方全体の状態異常耐性を上げる"
      }
    ]
  },

  {
    id: "chara_007",
    name: "井口優斗（ブレイク）",
    rarity: "SSR",
    attribute: "red",
    role: "高校生能力者",
    image: "images/characters/yuto_break.png",

    stats: { hp: 1500, atk: 300, def: 100, spd: 285, sp: 340, eva: 6 },

    commands: [
      { name: "強攻撃", type: "attack", power: 1.7, sp_cost: 50, target: "enemy_single" },
      { name: "連撃", type: "multi_attack", power: 0.65, hit: 3, sp_cost: 70, target: "enemy_single" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "ブレイク",
        trigger: "attack",
        effect: "extra_damage",
        chance: 0.2,
        value: 0.45,
        description: "攻撃時、低確率で追加ダメージ"
      },
      {
        name: "破壊衝動",
        trigger: "enemy_defeat",
        effect: "atk_up",
        value: 0.25,
        description: "敵撃破時、ATKが上昇"
      },
      {
        name: "限界突破",
        trigger: "hp_under",
        condition_value: 0.3,
        effect: "atk_up",
        value: 0.75,
        description: "HP低下時、火力が大幅上昇"
      }
    ]
  },

  {
    id: "chara_008",
    name: "海老原弥勒（ヒューマン）",
    rarity: "SSR",
    attribute: "green",
    role: "高校生能力者",
    image: "images/characters/ebihara_human.png",

    stats: { hp: 2500, atk: 50, def: 300, spd: 250, sp: 300, eva: 4 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "回復", type: "heal", power: 0.25, sp_cost: 80, target: "ally_all" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "ヒューマン",
        trigger: "hp_under",
        condition_value: 0.5,
        effect: "regen",
        value: 0.25,
        description: "HP50%以下の時、毎ターンHPを25%回復"
      },
      {
        name: "回復術",
        trigger: "fatal_damage",
        effect: "survive",
        heal_ratio: 0.3,
        hp_remain: 1,
        limit: 2,
        description: "HPが0になった時、2回までHPを30%回復して復帰する"
      },
      {
        name: "挑発本能",
        trigger: "battle_start",
        effect: "taunt",
        turn: 1,
        description: "戦闘開始時、敵の攻撃を引きつける"
      }
    ]
  },

  {
    id: "chara_009",
    name: "尾形宗介",
    rarity: "SSR",
    attribute: "red",
    role: "黒服の能力者",
    image: "images/characters/ogata.png",

    stats: { hp: 1500, atk: 200, def: 200, spd: 280, sp: 325, eva: 5 },

    commands: [
      { name: "攻撃", type: "attack", power: 0.75, target: "enemy_all" },
      { name: "金属操作", type: "skill_attack", power: 1.3, sp_cost: 85, target: "enemy_all" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "メタルドミネーション",
        trigger: "skill_attack_hp_under",
        condition_value: 0.5,
        effect: "shock",
        chance: 0.2,
        description: "HP50%以下で攻撃スキルを使うと、20%の確率で感電を与える"
      },
      {
        name: "範囲支配",
        trigger: "passive",
        effect: "normal_attack_all",
        description: "通常攻撃が全体攻撃になる"
      },
      {
        name: "鉄壁操作",
        trigger: "guard",
        effect: "def_up_damage_cut",
        value: 0.3,
        description: "防御時、DEF上昇と被ダメージ軽減を得る"
      }
    ]
  },

  {
    id: "chara_010",
    name: "佐藤満里奈（コピー）",
    rarity: "SSR",
    attribute: "blue",
    role: "高校教師",
    image: "images/characters/marina_copy.png",

    stats: { hp: 1700, atk: 250, def: 200, spd: 225, sp: 320, eva: 6 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "コピー", type: "copy_last_received_attack", sp_cost: 120, target: "enemy_single" },
      { name: "ジャッジメント", type: "skill_attack", power: 1.25, sp_cost: 95, effect: "random_status", target: "enemy_single" }
    ],

    abilities: [
      {
        name: "模倣（コピー）",
        trigger: "receive_attack",
        effect: "save_received_attack",
        description: "最初に受けた攻撃をコピーし、コマンドで再使用できる"
      },
      {
        name: "裁判（ジャッジメント）",
        trigger: "skill_hit",
        effect: "random_status",
        chance: 0.25,
        description: "能力攻撃命中時、25%の確率でランダム状態異常を付与"
      },
      {
        name: "ダメージ転移",
        trigger: "damage_taken",
        effect: "damage_transfer",
        chance: 0.15,
        description: "受けたダメージを低確率で他の対象へ移す"
      }
    ]
  },

  {
    id: "chara_011",
    name: "宮館歌美",
    rarity: "SSR",
    attribute: "red",
    role: "研究者",
    image: "images/characters/miyadate.png",

    stats: { hp: 1550, atk: 270, def: 300, spd: 175, sp: 355, eva: 3 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "時間停止", type: "status_attack", sp_cost: 110, effect: "time_stop", chance: 0.3, target: "enemy_single" },
      { name: "分析", type: "buff", effect: "skill_power_up", value: 0.2, turn: 3, target: "self" }
    ],

    abilities: [
      {
        name: "タイムキープ",
        trigger: "action_hp_under",
        condition_value: 0.25,
        effect: "time_stop",
        chance: 0.1,
        description: "HP25%以下の時に行動すると、10%の確率でランダムな敵を時間停止にする"
      },
      {
        name: "時間停止",
        trigger: "status_success",
        effect: "skip_turn",
        description: "時間停止状態の敵は行動できない"
      },
      {
        name: "研究者",
        trigger: "turn_start",
        effect: "skill_power_up",
        value: 0.04,
        description: "戦闘中、ターン経過ごとに能力が徐々に強化される"
      }
    ]
  },
  
  {
    id: "chara_012",
    name: "五十嵐陵（リトライ）",
    rarity: "SR",
    attribute: "blue",
    role: "高校生能力者",
    image: "images/characters/igarashi_retry.png",

    stats: { hp: 1700, atk: 150, def: 250, spd: 300, sp: 200, eva: 4 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "再挑戦", type: "heal", power: 0.25, sp_cost: 60, target: "self" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "リトライ",
        trigger: "fatal_damage",
        effect: "survive",
        hp_remain: 1,
        limit: 1,
        description: "一度だけHP1で耐える"
      },
      {
        name: "諦めない",
        trigger: "hp_under",
        condition_value: 0.3,
        effect: "atk_up",
        value: 0.5,
        description: "HP30%以下でATKが50%上昇"
      }
    ]
  },

  {
    id: "chara_013",
    name: "音無健斗（クリア）",
    rarity: "R",
    attribute: "green",
    role: "高校生",
    image: "images/characters/otonashi_clear.png",

    stats: { hp: 1800, atk: 95, def: 275, spd: 150, sp: 100, eva: 1 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "応援", type: "buff", effect: "def_up", value: 0.3, turn: 2, target: "self" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "クリア",
        trigger: "battle_start",
        effect: "party_def_up",
        value: 0.2,
        description: "戦闘開始時、味方全体のDEFが20%上昇"
      }
    ]
  },

  {
    id: "chara_014",
    name: "宮舘郷（タイムストップ）",
    rarity: "SR",
    attribute: "red",
    role: "高校生能力者",
    image: "images/characters/miyadate_go.png",

    stats: { hp: 1250, atk: 150, def: 225, spd: 205, sp: 275, eva: 3 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "時間停止", type: "status_attack", effect: "time_stop", chance: 0.25, sp_cost: 80, target: "enemy_single" },
      { name: "観測", type: "buff", effect: "spd_up", value: 0.25, turn: 2, target: "self" }
    ],

    abilities: [
      {
        name: "停止領域",
        trigger: "battle_start",
        effect: "spd_up",
        value: 0.2,
        description: "戦闘開始時、SPDが20%上昇"
      },
      {
        name: "時間干渉",
        trigger: "skill_hit",
        effect: "atk_down",
        chance: 0.25,
        value: 0.2,
        description: "スキル命中時、25%の確率で敵のATKを下げる"
      }
    ]
  },

  {
    id: "chara_015",
    name: "音無健斗「暴走」（チェンジ）",
    rarity: "SSR",
    attribute: "red",
    role: "高校生能力者",
    image: "images/characters/otonashi_change.png",

    stats: { hp: 1850, atk: 300, def: 300, spd: 300, sp: 100, eva: 6 },

    commands: [
      { name: "暴走殴打", type: "attack", power: 1.35, target: "enemy_single" },
      { name: "暴走連撃", type: "multi_attack", power: 0.65, hit: 3, sp_cost: 70, target: "enemy_single" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "暴走",
        trigger: "battle_start",
        effect: "atk_up",
        value: 0.3,
        description: "戦闘開始時、ATKが30%上昇"
      },
      {
        name: "怒り",
        trigger: "damage_taken",
        effect: "atk_up",
        value: 0.1,
        description: "ダメージを受けるとATKが少し上昇"
      },
      {
        name: "チェンジ",
        trigger: "hp_under",
        condition_value: 0.5,
        effect: "spd_up",
        value: 0.4,
        description: "HP50%以下でSPDが40%上昇"
      }
    ]
  },
  
  {
    id: "chara_016",
    name: "明日木鉄平（リターン）",
    rarity: "SSR",
    attribute: "blue",
    role: "高校生能力者",
    image: "images/characters/teppei_return.png",

    stats: { hp: 1550, atk: 325, def: 250, spd: 255, sp: 125, eva: 4 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.15, target: "enemy_single" },
      { name: "リターン", type: "buff", effect: "def_up", value: 0.4, turn: 2, sp_cost: 60, target: "self" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
  {
    name: "逆襲",
    trigger: "hp_under",
    condition_value: 0.5,
    effect: "atk_up",
    value: 0.45,
    description: "HP50%以下でATKが45%上昇"
  },
  {
    name: "巻き戻し",
    trigger: "fatal_damage",
    effect: "survive",
    heal_ratio: 0.25,
    limit: 1,
    description: "一度だけ戦闘不能を防ぎ、HP25%で復帰する"
  },
  {
    name: "リターン",
    trigger: "turn_start",
    effect: "turn_order_reverse",
    description: "ターン開始時、自分よりSPDが高い相手がいる場合は先攻になる。自分が最速の場合は最後に行動する"
  }
]
  },
  
  {
    id: "chara_017",
    name: "佐藤由美（ジャスティス）",
    rarity: "SSR",
    attribute: "green",
    role: "高校生能力者",
    image: "images/characters/yumi_justice.png",

    stats: { hp: 1630, atk: 10, def: 275, spd: 280, sp: 280, eva: 3 },

    commands: [
      { name: "裁き", type: "skill_attack", power: 1.35, sp_cost: 70, target: "enemy_single" },
      { name: "判決", type: "status_attack", effect: "paralyze", chance: 0.35, sp_cost: 90, target: "enemy_single" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
  {
    name: "正義",
    trigger: "battle_start",
    effect: "justice_equalize",
    turn: 2,
    description: "バトル開始から2ターン、全キャラの能力値を平均化する"
  },
  {
    name: "断罪",
    trigger: "skill_hit",
    effect: "atk_down",
    chance: 0.3,
    value: 0.2,
    description: "スキル命中時、30%の確率で敵ATKを下げる"
  },
  {
    name: "絶対判決",
    trigger: "hp_under",
    condition_value: 0.25,
    effect: "skill_power_up",
    value: 0.4,
    description: "HP25%以下でスキル威力が上昇"
  }
    ]
  },

  {
    id: "chara_018",
    name: "清水誠一（爆弾）",
    rarity: "R",
    attribute: "red",
    role: "高校生",
    image: "images/characters/shimizu_bomb.png",

    stats: { hp: 1540, atk: 210, def: 100, spd: 255, sp: 200, eva: 2 },

    commands: [
      { name: "投擲", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "爆弾", type: "skill_attack", power: 1.25, sp_cost: 75, target: "enemy_all" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "爆破準備",
        trigger: "battle_start",
        effect: "skill_power_up",
        value: 0.15,
        description: "戦闘開始時、スキル威力が少し上昇"
      }
    ]
  },

  {
    id: "chara_019",
    name: "加世田富雄（オフショット）",
    rarity: "R",
    attribute: "blue",
    role: "高校生",
    image: "images/characters/kaseda_offshot.png",

    stats: { hp: 1275, atk: 300, def: 275, spd: 175, sp: 150, eva: 3 },

    commands: [
      { name: "撮影", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "オフショット", type: "status_attack", effect: "spd_down", chance: 0.4, sp_cost: 50, target: "enemy_single" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "シャッターチャンス",
        trigger: "battle_start",
        effect: "spd_up",
        value: 0.15,
        description: "戦闘開始時、SPDが15%上昇"
      }
    ]
  },

    {
    id: "chara_020",
    name: "海老原弥勒「大人」（人間）",
    rarity: "SSR",
    attribute: "green",
    role: "大人",
    image: "images/characters/ebihara_adult.png",

    stats: { hp: 2000, atk: 50, def: 200, spd: 155, sp: 275, eva: 2 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "人間回復", type: "heal", power: 0.3, sp_cost: 75, target: "ally_all" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "大人の判断",
        trigger: "battle_start",
        effect: "party_def_up",
        value: 0.25,
        description: "戦闘開始時、味方全体のDEFが25%上昇"
      },
      {
        name: "人間性",
        trigger: "hp_under",
        condition_value: 0.5,
        effect: "regen",
        value: 0.2,
        description: "HP50%以下の時、毎ターンHPを20%回復"
      },
      {
        name: "守護本能",
        trigger: "guard",
        effect: "def_up_damage_cut",
        value: 0.35,
        description: "防御時、DEF上昇と被ダメージ軽減を得る"
      }
    ]
  },

  {
    id: "chara_021",
    name: "佐藤総一（ホラー）",
    rarity: "SR",
    attribute: "blue",
    role: "高校生能力者",
    image: "images/characters/sato_horror.png",

    stats: { hp: 1430, atk: 185, def: 285, spd: 100, sp: 220, eva: 1 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "恐怖", type: "status_attack", effect: "atk_down", chance: 0.45, sp_cost: 65, target: "enemy_single" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "恐怖演出",
        trigger: "battle_start",
        effect: "enemy_all_atk_down",
        value: 0.15,
        description: "戦闘開始時、敵全体のATKを15%下げる"
      },
      {
        name: "ホラー耐性",
        trigger: "hp_under",
        condition_value: 0.5,
        effect: "def_up",
        value: 0.35,
        description: "HP50%以下でDEFが35%上昇"
      }
    ]
  },

  {
    id: "chara_022",
    name: "リトルKジェム（ミニチュア）",
    rarity: "SR",
    attribute: "green",
    role: "小型支援",
    image: "images/characters/little_k_gem.png",

    stats: { hp: 1350, atk: 120, def: 175, spd: 265, sp: 200, eva: 3 },

    commands: [
      { name: "小突く", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "ジェム支援", type: "buff", effect: "atk_up", value: 0.25, turn: 2, sp_cost: 55, target: "self" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "ミニチュア",
        trigger: "battle_start",
        effect: "spd_up",
        value: 0.2,
        description: "戦闘開始時、SPDが20%上昇"
      },
      {
        name: "小さな奇跡",
        trigger: "dodge_success",
        effect: "atk_up",
        value: 0.25,
        description: "回避成功時、ATKが上昇"
      }
    ]
  },

  {
    id: "chara_023",
    name: "井口悠人「大人」（ブレイク）",
    rarity: "SSR",
    attribute: "red",
    role: "大人",
    image: "images/characters/yuto_adult_break.png",

    stats: { hp: 1450, atk: 225, def: 175, spd: 200, sp: 200, eva: 5 },

    commands: [
      { name: "大人の一撃", type: "attack", power: 1.35, target: "enemy_single" },
      { name: "ブレイク", type: "skill_attack", power: 1.55, sp_cost: 80, target: "enemy_single" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "成熟した闘志",
        trigger: "battle_start",
        effect: "atk_up",
        value: 0.25,
        description: "戦闘開始時、ATKが25%上昇"
      },
      {
        name: "ブレイク衝動",
        trigger: "attack",
        effect: "extra_damage",
        chance: 0.18,
        value: 0.45,
        description: "攻撃時、低確率で追加ダメージ"
      },
      {
        name: "大人の限界突破",
        trigger: "hp_under",
        condition_value: 0.3,
        effect: "atk_up",
        value: 0.65,
        description: "HP30%以下でATKが大幅上昇"
      }
    ]
  },

  {
    id: "chara_024",
    name: "佐藤満里奈「2章」（コピー）",
    rarity: "R",
    attribute: "blue",
    role: "高校教師",
    image: "images/characters/marina_ch2_copy.png",

    stats: { hp: 1750, atk: 200, def: 235, spd: 250, sp: 200, eva: 4 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "コピー", type: "copy_last_received_attack", sp_cost: 100, target: "enemy_single" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "簡易コピー",
        trigger: "receive_attack",
        effect: "save_received_attack",
        description: "最初に受けた攻撃をコピーする"
      }
    ]
  },

  {
    id: "chara_025",
    name: "徳田波（ウォーター）",
    rarity: "SSR",
    attribute: "blue",
    role: "高校生能力者",
    image: "images/characters/tokuda_water.png",

    stats: { hp: 1900, atk: 50, def: 225, spd: 175, sp: 300, eva: 10 },

    commands: [
      { name: "水撃", type: "skill_attack", power: 1.25, sp_cost: 70, target: "enemy_single" },
      { name: "水の守り", type: "buff", effect: "def_up", value: 0.35, turn: 2, sp_cost: 70, target: "self" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "ウォーター",
        trigger: "battle_start",
        effect: "party_def_up",
        value: 0.2,
        description: "戦闘開始時、味方全体のDEFが20%上昇"
      },
      {
        name: "流水回避",
        trigger: "dodge_success",
        effect: "spd_up",
        value: 0.2,
        turn: 1,
        description: "回避成功時、SPDが上昇"
      },
      {
        name: "水流再生",
        trigger: "hp_under",
        condition_value: 0.4,
        effect: "regen",
        value: 0.2,
        description: "HP40%以下でHPを20%回復"
      }
    ]
  },

  {
    id: "chara_026",
    name: "宇佐美（オペレーション・人間）",
    rarity: "SSR",
    attribute: "green",
    role: "作戦指揮",
    image: "images/characters/usami_operation.png",

    stats: { hp: 2000, atk: 275, def: 250, spd: 300, sp: 320, eva: 7 },

    commands: [
      { name: "攻撃指令", type: "skill_attack", power: 1.3, sp_cost: 75, target: "enemy_single" },
      { name: "作戦展開", type: "buff", effect: "atk_up", value: 0.3, turn: 2, sp_cost: 85, target: "self" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "オペレーション",
        trigger: "battle_start",
        effect: "party_def_up",
        value: 0.25,
        description: "戦闘開始時、味方全体のDEFが25%上昇"
      },
      {
        name: "人間指揮",
        trigger: "turn_start",
        effect: "skill_power_up",
        value: 0.04,
        description: "ターン開始時、自身の能力が少し上昇"
      },
      {
        name: "勝利計画",
        trigger: "enemy_defeat",
        effect: "atk_up",
        value: 0.25,
        description: "敵撃破時、ATKが上昇"
      }
    ]
  },

  {
    id: "chara_027",
    name: "佐藤真里子（痛いの痛いの飛んでいけ）",
    rarity: "SR",
    attribute: "green",
    role: "回復支援",
    image: "images/characters/mariko_heal.png",

    stats: { hp: 1850, atk: 320, def: 100, spd: 75, sp: 375, eva: 1 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "痛いの飛んでいけ", type: "heal", power: 0.35, sp_cost: 90, target: "ally_all" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "看護",
        trigger: "turn_start",
        effect: "regen",
        value: 0.08,
        description: "ターン開始時、自身のHPを少し回復"
      },
      {
        name: "祈り",
        trigger: "hp_under",
        condition_value: 0.3,
        effect: "party_def_up",
        value: 0.25,
        description: "HP30%以下で味方全体のDEFを上げる"
      }
    ]
  },

  {
    id: "chara_028",
    name: "明日木幸平「大人」（パージ）",
    rarity: "SSR",
    attribute: "blue",
    role: "大人",
    image: "images/characters/kohei_adult_purge.png",

    stats: { hp: 1650, atk: 100, def: 350, spd: 305, sp: 275, eva: 4 },

    commands: [
      { name: "攻撃", type: "attack", power: 1.0, target: "enemy_single" },
      { name: "大浄化", type: "cleanse", sp_cost: 90, target: "ally_all" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "大人のパージ",
        trigger: "battle_start",
        effect: "status_immunity",
        turn: 3,
        description: "戦闘開始から3ターン状態異常無効"
      },
      {
        name: "完全浄化",
        trigger: "turn_start",
        effect: "cleanse_self",
        description: "ターン開始時、自身の状態異常を解除"
      },
      {
        name: "浄化領域",
        trigger: "passive",
        effect: "party_status_resist_up",
        value: 0.35,
        description: "味方全体の状態異常耐性を上げる"
      }
    ]
  },

  {
    id: "chara_029",
    name: "緒方宗介「2章」（オペレーション・無機物）",
    rarity: "SR",
    attribute: "red",
    role: "無機物操作",
    image: "images/characters/ogata_ch2_operation.png",

    stats: { hp: 1550, atk: 285, def: 320, spd: 285, sp: 350, eva: 3 },

    commands: [
      { name: "攻撃", type: "attack", power: 0.8, target: "enemy_all" },
      { name: "無機物操作", type: "skill_attack", power: 1.25, sp_cost: 90, target: "enemy_all" },
      { name: "防御", type: "guard", effect: "damage_cut", target: "self" }
    ],

    abilities: [
      {
        name: "無機物支配",
        trigger: "battle_start",
        effect: "def_up",
        value: 0.25,
        description: "戦闘開始時、DEFが25%上昇"
      },
      {
        name: "作戦制圧",
        trigger: "skill_hit",
        effect: "shock",
        chance: 0.2,
        description: "スキル命中時、20%の確率で感電を与える"
      }
    ]
  }
];