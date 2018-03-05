export class Equippable {
  constructor({
    attackValue = 0,
    defenseValue = 0,
    wieldable = false,
    wearable = false
  }) {
    this.attackValue = attackValue;
    this.defenseValue = defenseValue;
    this.wieldable = wieldable;
    this.wearable = wearable;
    this.name = "Equippable";
  }
}

export class StatusBooster {
  constructor({ hpUp = 0, statusEffect = null }) {
    this.name = "StatusBooster";
    this.groupName = "Usable";
    this.hpUp = hpUp;
    this.use = this._use;
    this.statusEffect = statusEffect;
  }

  _use(entity) {
    entity.addHp(this.hpUp);
    if (this.statusEffect) {
      entity.addTimedStatusEffect(this.statusEffect);
    }
  }
}
