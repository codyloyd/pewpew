import game from "../game";
import Colors from "../colors";
import { hit00, hit01, hit02, blip } from "../sounds/sounds";

export class Equippable {
  constructor({
    attackValue = 0,
    defenseValue = 0,
    sightBoost = 0,
    inventoryBoost = 0,
    wieldable = false,
    wearable = false
  }) {
    this.attackValue = attackValue;
    this.defenseValue = defenseValue;
    this.wieldable = wieldable;
    this.wearable = wearable;
    this.sightBoost = sightBoost;
    this.inventoryBoost = inventoryBoost;
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

export class Fireable {
  constructor({ charges, maxCharges = 20, rangeDamage = 10 }) {
    this.name = "Fireable";
    this.maxCharges = maxCharges;
    this.charges = charges || this.maxCharges;
    this.rangeDamage = rangeDamage;
    this.fire = this._fire;
  }

  _fire(targetObj) {
    if (this.charges <= 0) {
      game.messageDisplay.add({
        color: "blue",
        text: "Your weapon is out of charges"
      });
      return;
    }
    const sound = hit00;
    sound.play();
    this.charges -= 1;
    const targetArray = targetObj.coords;
    const displayArray = [];
    for (let i = 0; i < targetArray.length; i++) {
      const target = targetArray[i];
      if (targetArray[i] && targetArray[i].constructor.name == "Entity") {
        if (target.hasMixin("Destructible")) {
          const attack = this.rangeDamage;
          const defense = target.getDefenseValue();
          const damage = Math.max(attack - defense, 0);
          game.messageDisplay.add({
            color: "white",
            text: `You hit the ${target.name} for ${damage} damage.`
          });
          target.takeDamage(damage, this.fg);
          break;
        }
      } else if (!target.blocksLight) {
        console.log(target);
        displayArray.push(target.x + "," + target.y);
      } else {
        break;
      }
    }
    return { coords: displayArray, xMod: targetObj.xMod, yMod: targetObj.yMod };
  }
}
