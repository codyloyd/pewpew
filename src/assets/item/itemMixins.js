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
