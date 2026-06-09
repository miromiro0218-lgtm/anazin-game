const ABILITY_EFFECTS = {
  atk_up(ctx, owner, ability) {
    ctx.addBuff(owner, "atk", ability.value, 1, ability.name);
  },

  party_def_up(ctx, owner, ability) {
    ctx.party.forEach(p => {
      if(p.hp > 0){
        ctx.addBuff(p, "def", ability.value, 1, ability.name);
      }
    });
  },

  enemy_all_atk_down(ctx, owner, ability) {
    ctx.enemies.forEach(e => {
      if(e.hp > 0){
        ctx.addBuff(e, "atk", -ability.value, 1, ability.name);
      }
    });
  },

  eva_up(ctx, owner, ability) {
    const value = ability.value > 1 ? ability.value / 100 : ability.value;
    ctx.addBuff(owner, "eva", value, ability.turn || 2, ability.name);
  },

  spd_up(ctx, owner, ability) {
    ctx.addBuff(owner, "spd", ability.value, ability.turn || 1, ability.name);
  },

  status_immunity(ctx, owner, ability) {
    owner.status.status_immunity = ability.turn || 3;
    ctx.abilityLog(owner, ability.name);
  },

  cleanse_self(ctx, owner, ability) {
    owner.status = {};
    ctx.abilityLog(owner, ability.name);
  },

  party_status_resist_up(ctx, owner, ability) {
    ctx.party.forEach(p => {
      if(p.hp > 0){
        p.status.status_resist = ability.value || 0.3;
      }
    });

    ctx.abilityLog(owner, ability.name);
  },

  regen(ctx, owner, ability) {
    const heal = Math.floor(owner.maxHp * ability.value);
    owner.hp = Math.min(owner.maxHp, owner.hp + heal);

    ctx.abilityLog(owner, ability.name);
    ctx.addLog(`${owner.name} は ${heal} 回復した`);
  },

  survive(ctx, owner, ability) {
    owner.surviveCount = owner.surviveCount || 0;

    const limit = ability.limit || 1;

    if(owner.surviveCount >= limit) return false;

    owner.surviveCount++;

    if(ability.description && ability.description.includes("50％")){
      owner.hp = Math.floor(owner.maxHp * 0.5);
    }else{
      owner.hp = ability.hp_remain || 1;
    }

    ctx.abilityLog(owner, ability.name);
    return true;
  },

  taunt(ctx, owner, ability) {
    owner.status.taunt = ability.turn || 1;
    ctx.abilityLog(owner, ability.name);
  },

  extra_damage(ctx, owner, ability, target) {
    if(!target) return;
    if(Math.random() > (ability.chance || 1)) return;

    const extra = Math.floor(ctx.getStat(owner, "atk") * ability.value);
    target.hp = Math.max(0, target.hp - extra);

    ctx.abilityLog(owner, ability.name);
    ctx.addLog(`${target.name} に追加${extra}ダメージ`);
  },

  steal_buff(ctx, owner, ability, target) {
    if(!target) return;
    if(Math.random() > (ability.chance || 1)) return;
    if(target.buffs.length === 0) return;

    const stolen = target.buffs.pop();
    owner.buffs.push(stolen);

    ctx.abilityLog(owner, ability.name);
  },

  shock(ctx, owner, ability, target) {
    if(!target) return;
    if(Math.random() > (ability.chance || 1)) return;

    target.status.shock = 2;
    ctx.abilityLog(owner, ability.name);
    ctx.addLog(`${target.name} に感電`);
  },

  normal_attack_all(ctx, owner, ability) {
    ctx.abilityLog(owner, ability.name);
  },

  def_up_damage_cut(ctx, owner, ability) {
    ctx.addBuff(owner, "def", ability.value || 0.3, 1, ability.name);
    owner.guard = true;
  },

  save_received_attack(ctx, owner, ability, attacker, cmd) {
    if(owner.copiedCommand) return;

    owner.copiedCommand = {
      ...cmd,
      name: "コピー攻撃",
      type: "attack",
      target: "enemy_single"
    };

    ctx.abilityLog(owner, ability.name);
  },

  random_status(ctx, owner, ability, target) {
    if(!target) return;
    if(Math.random() > (ability.chance || 1)) return;

    const statuses = ["burn", "paralyze", "freeze", "time_stop"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    target.status[status] = 1;

    ctx.abilityLog(owner, ability.name);
    ctx.addLog(`${target.name} に ${status} 付与`);
  },

  damage_transfer(ctx, owner, ability) {
    if(Math.random() > (ability.chance || 1)) return;

    owner.status.damage_transfer = 1;
    ctx.abilityLog(owner, ability.name);
  },

  time_stop(ctx, owner, ability) {
    const targets = ctx.enemies.filter(e => e.hp > 0);
    if(targets.length === 0) return;

    const t = targets[Math.floor(Math.random() * targets.length)];
    t.status.time_stop = 1;

    ctx.abilityLog(owner, ability.name);
    ctx.addLog(`${t.name} が時間停止`);
  },

  skill_power_up(ctx, owner, ability) {
    ctx.addBuff(owner, "atk", ability.value || 0.05, 3, ability.name);
  },

    turn_order_reverse(ctx, owner, ability) {
    const enemyTeam = ctx.party.includes(owner)
      ? ctx.enemies
      : ctx.party;

    const aliveEnemies = enemyTeam.filter(c => c.hp > 0);
    if(aliveEnemies.length === 0) return;

    const fastestEnemySpd = Math.max(
      ...aliveEnemies.map(c => ctx.getStat(c, "spd"))
    );

    const mySpd = ctx.getStat(owner, "spd");

    if(mySpd < fastestEnemySpd){
      owner.priority = 9999;
      ctx.abilityLog(owner, `${ability.name}・先攻`);
    }else{
      owner.priority = -9999;
      ctx.abilityLog(owner, `${ability.name}・後攻`);
    }
  },

  justice_equalize(ctx, owner, ability) {
    const all = [...ctx.party, ...ctx.enemies].filter(c => c.hp > 0);

    const stats = ["atk", "def", "spd", "eva"];

    stats.forEach(stat => {
      const avg = Math.floor(
        all.reduce((sum, c) => sum + ctx.getStat(c, stat), 0) / all.length
      );

      all.forEach(c => {
        const base = c[stat] ?? c.stats?.[stat] ?? 0;
        if(base <= 0) return;

        const rate = avg / base - 1;

        ctx.addBuff(c, stat, rate, ability.turn || 2, ability.name);
      });
    });

    ctx.abilityLog(owner, ability.name);
  },

  def_up(ctx, owner, ability) {
    ctx.addBuff(
      owner,
      "def",
      ability.value || 0.3,
      ability.turn || 1,
      ability.name
    );
  },

  atk_down(ctx, owner, ability, target) {
    if(!target) return;

    ctx.addBuff(
      target,
      "atk",
      -(ability.value || 0.2),
      ability.turn || 2,
      ability.name
    );

    ctx.abilityLog(owner, ability.name);
  },

  counter(ctx, owner, ability, attacker) {
    if(!attacker || attacker.hp <= 0) return;
    if(Math.random() > (ability.chance || 1)) return;

    ctx.abilityLog(owner, ability.name);
    ctx.damage(owner, attacker, ability.power || 0.6, {
      name: ability.name,
      type: "attack",
      target: "enemy_single"
    });
  }
};