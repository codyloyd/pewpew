import game from "../game";
import { wallTile, floorTile, closedDoorTile, openDoorTile } from "../tile";
import Colors from "../colors";

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
  constructor({ hpUp = 0, statusEffect = null, weaponRecharge = 0 }) {
    this.name = "StatusBooster";
    this.groupName = "Usable";
    this.hpUp = hpUp;
    this.weaponRecharge = weaponRecharge;
    this.use = this._use;
    this.statusEffect = statusEffect;
  }

  _use(entity) {
    if (entity.weapon && entity.weapon.charges) {
      entity.weapon.recharge(this.weaponRecharge);
    }
    entity.addHp(this.hpUp);
    if (this.statusEffect) {
      entity.addTimedStatusEffect(this.statusEffect);
    }
  }
}

export class Fireable {
  constructor({
    chargesPerShot = 1,
    charges,
    maxCharges = 20,
    rangeDamage = 10,
    blastRadius = 0
  }) {
    this.name = "Fireable";
    this.maxCharges = maxCharges;
    this.charges = charges || this.maxCharges;
    this.rangeDamage = rangeDamage;
    this.recharge = this._recharge;
    this.fire = this._fire;
    this.blastRadius = blastRadius;
    this.chargesPerShot = chargesPerShot;
  }

  _recharge(charges) {
    this.charges = Math.min(this.charges + charges, this.maxCharges);
  }

  _fire(targetObj) {
    if (this.charges - this.chargesPerShot <= 0) {
      game.messageDisplay.add({
        color: "blue",
        text: "Your weapon does not have enough charges to fire"
      });
      return;
    }
    this.charges -= this.chargesPerShot;
    const targetArray = targetObj.coords;
    const displayArray = [];
    for (let i = 1; i < targetArray.length; i++) {
      const target = targetArray[i];
      const shooter = targetArray[0];
      console.log(targetArray[i]);
      if (
        targetArray[i] &&
        (targetArray[i].blocksLight ||
          targetArray[i].constructor.name == "Entity")
      ) {
        if (this.blastRadius > 0) {
          // cause explosion
          const explosionDisplay = [];
          const level = game.currentScreen.gameWorld.currentLevel;
          const area = level.getSurroundingTiles(
            target.x,
            target.y,
            this.blastRadius
          );
          area.forEach(tile => {
            if (tile.tile) {
              explosionDisplay.push(tile.x + "," + tile.y);
              if (tile.tile.blocksLight || tile.tile == openDoorTile) {
                level.map.setTile(tile.x, tile.y, floorTile);
              }
            } else if (tile.hasMixin && tile.hasMixin("Destructible")) {
              console.log("hit the" + tile.name);
              const attack = this.rangeDamage;
              const defense = tile.getDefenseValue();
              const damage = Math.max(attack - defense, 0);
              if (shooter.name == "ME" && tile.name !== "ME") {
                game.messageDisplay.add({
                  color: "white",
                  text: `The ${tile.name} is caught in the explosion for ${damage} damage.`
                });
                tile.takeDamage(damage, Colors.orange);
              } else if (tile.name == "ME") {
                game.messageDisplay.add({
                  color: "red",
                  text: `You are caught in the explosion!  Ouch!`
                });
                tile.takeDamage(damage, Colors.orange);
              }
            }
          });
          game.explosionDisplay = explosionDisplay;
          break;
        }
        if (target.hasMixin && target.hasMixin("Destructible")) {
          const attack = this.rangeDamage;
          const defense = target.getDefenseValue();
          const damage = Math.max(attack - defense, 0);
          if (shooter.name == "ME") {
            game.messageDisplay.add({
              color: "white",
              text: `You hit the ${target.name} for ${damage} damage.`
            });
            target.takeDamage(damage, this.fg);
            break;
          } else if (target.name == "ME") {
            game.messageDisplay.add({
              color: "red",
              text: `The ${shooter.name} shoots you for ${damage} damage!`
            });
            target.takeDamage(damage, this.fg);
            break;
          }
        }
        break;
      } else if (!target.blocksLight) {
        displayArray.push(target.x + "," + target.y);
      } else {
        break;
      }
    }
    return { coords: displayArray, xMod: targetObj.xMod, yMod: targetObj.yMod };
  }
}
