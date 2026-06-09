const SKILL_EFFECTS = {
  attack(ctx, actor, cmd, action) {
    const targets = ctx.getTargets(cmd, action.targetEnemy);
    targets.forEach(t => ctx.damage(actor, t, cmd.power || 1.0, cmd));
  },

  multi_attack(ctx, actor, cmd, action) {
    const targets = ctx.getTargets(cmd, action.targetEnemy);
    targets.forEach(t => {
      for(let i = 0; i < (cmd.hit || 1); i++){
        if(t.hp <= 0) break;
        ctx.damage(actor, t, cmd.power || 1.0, cmd);
      }
    });
  },

  guard(ctx, actor, cmd) {
    actor.guard = true;
    ctx.addLog(`${actor.name} は防御した`);
    ctx.runAbilities("guard", actor, null, cmd);
  },

  buff(ctx, actor, cmd) {
    if(cmd.effect === "atk_up"){
      ctx.addBuff(actor, "atk", cmd.value ?? 0.5, cmd.turn || 2, cmd.name);
    }

    if(cmd.effect === "def_up"){
      ctx.addBuff(actor, "def", cmd.value ?? 0.5, cmd.turn || 2, cmd.name);
    }

    if(cmd.effect === "eva_up"){
      const value = cmd.value > 1 ? cmd.value / 100 : cmd.value;
      ctx.addBuff(actor, "eva", value, cmd.turn || 2, cmd.name);
    }

    if(cmd.effect === "skill_power_up"){
      ctx.addBuff(actor, "atk", 0.25, cmd.turn || 3, cmd.name);
    }
  },

  debuff(ctx, actor, cmd) {
    const targets = cmd.target === "enemy_all"
      ? ctx.enemies.filter(e => e.hp > 0)
      : ctx.getTargets(cmd, ctx.selectedEnemy);

    targets.forEach(t => {
      if(cmd.effect === "atk_down"){
        ctx.addBuff(t, "atk", -(cmd.value || 0.25), cmd.turn || 2, `${actor.name}の${cmd.name}`);
      }
    });
  },

  heal(ctx, actor, cmd) {
    const targets = cmd.target === "ally_all"
      ? ctx.party.filter(c => c.hp > 0)
      : [actor];

    targets.forEach(t => {
      const heal = Math.floor(t.maxHp * (cmd.power || 0.3));
      t.hp = Math.min(t.maxHp, t.hp + heal);
      ctx.addLog(`${t.name} は ${heal} 回復した`);
    });
  },

  cleanse(ctx, actor, cmd, action) {
    const target =
      ctx.party.find(c => c.id === action.targetAlly) || actor;

    target.status = {};
    ctx.addLog(`${actor.name} は ${target.name} の状態異常を解除した`);
  },

  skill_attack(ctx, actor, cmd, action) {
    const targets = ctx.getTargets(cmd, action.targetEnemy);
    targets.forEach(t => ctx.damage(actor, t, cmd.power || 1.0, cmd));
  },

  status_attack(ctx, actor, cmd, action) {
    const targets = ctx.getTargets(cmd, action.targetEnemy);

    targets.forEach(t => {
      ctx.damage(actor, t, 1.0, cmd);

      if(Math.random() < (cmd.chance || 0)){
        t.status[cmd.effect] = 1;
        ctx.addLog(`${t.name} は ${cmd.effect} 状態になった`);
      }
    });
  },

  copy_last_received_attack(ctx, actor, cmd, action) {
    const copy = actor.copiedCommand || {
      name: "コピー失敗",
      type: "attack",
      power: 1.0,
      target: "enemy_single"
    };

    const targets = ctx.getTargets(copy, action.targetEnemy);
    targets.forEach(t => ctx.damage(actor, t, copy.power || 1.0, copy));
  }
};