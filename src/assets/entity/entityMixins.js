import ROT from "rot-js";
import Colors from "../colors";
import { closedDoorTile } from "../tile";

export class PlayerActor {
  constructor() {
    this.name = "PlayerActor";
    this.groupName = "Actor";
    this.act = this._act;
  }
  _act() {
    const Game = this.getGame();
    this.incrementTimedStatusEffects();
    Game.refresh();
    Game.getEngine().lock();
  }
}

export class Destructible {
  constructor({ maxHp = 10, hp, defenseValue = 0 }) {
    this.name = "Destructible";
    this.maxHp = maxHp;
    this.hp = hp || this.maxHp;
    this.defenseValue = defenseValue;
    this.takeDamage = this._takeDamage;
    this.addHp = this._addHp;
    this.getDefenseValue = this._getDefenseValue;
    this.hit = false;
  }

  _getDefenseValue() {
    let mod = 0;
    if (this.hasMixin("TimedStatusEffects")) {
      this.getTimedStatusEffects().forEach(s => {
        if (s.property == "defense") {
          mod += s.value;
        }
      });
    }
    if (this.armor) {
      this.armor.forEach(a => {
        mod += a.defenseValue;
      });
    }
    return this.defenseValue + mod;
  }

  _addHp(value) {
    this.hp = Math.min(this.hp + value, this.maxHp);
  }

  _takeDamage(damage, color = Colors.red) {
    this.hp -= damage;
    this.hit = color;
    if (this.hp <= 0) {
      if (this.hasMixin("PlayerActor")) {
        this.game.messageDisplay.add({ text: `You DIE`, color: "red" });
      } else {
        this.game.messageDisplay.add({
          color: "white",
          text: `You kill the ${this.name}.`
        });
      }
      this.kill();
    }
  }
}

export class Sight {
  constructor({ sightRadius = 15 }) {
    this.name = "Sight";
    this.sightRadius = sightRadius;
    this.canSee = this._canSee;
    this.getSightRadius = this._getSightRadius;
  }

  _getSightRadius() {
    let mod = 0;
    if (this.hasMixin("TimedStatusEffects")) {
      this.getTimedStatusEffects().forEach(s => {
        if (s.property == "sight") {
          mod += s.value;
        }
      });
    }

    if (this.armor) {
      this.armor.forEach(a => {
        mod += a.sightBoost;
      });
    }

    return this.sightRadius + mod;
  }

  _canSee(entity) {
    const otherX = entity.getX();
    const otherY = entity.getY();
    if (
      (otherX - this.getX()) * (otherX - this.getX()) +
        (otherY - this.getY()) * (otherY - this.getY()) >
      this.sightRadius * this.sightRadius
    ) {
      return false;
    }
    let found = false;
    const fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
      if (this.level.map.getTile(x, y)) {
        return !this.level.map.getTile(x, y).blocksLight;
      }
      return false;
    });

    fov.compute(this.getX(), this.getY(), this.sightRadius, function(
      x,
      y,
      radius,
      visibility
    ) {
      if (x === otherX && y === otherY) {
        found = true;
      }
    });
    return found;
    return true;
  }
}

export class TaskActor {
  constructor({ tasks = ["hunt", "wander"] }) {
    this.huntingTarget = null;
    this.tasks = tasks;
    this.name = "TaskActor";
    this.groupName = "Actor";
    this.act = this._act;
    this.canDoTask = this._canDoTask;
    this.wander = this._wander;
    this.hunt = this._hunt;
    this.flee = this._flee;
    this.shoot = this._shoot;
  }
  _act() {
    if (this.level.gameWorld.currentLevel !== this.level) {
      return false;
    }
    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks[i];
      if (this.canDoTask(task)) {
        this[task]();
        break;
      }
    }
  }

  _canDoTask(task) {
    if (task === "hunt") {
      return (
        this.hasMixin("Sight") &&
        (this.canSee(this.getLevel().player) || this.huntingTarget)
      );
    } else if (task === "shoot") {
      const player = this.getLevel().player;
      const xOffset = this.getX() - player.getX();
      const yOffset = this.getY() - player.getY();
      if (this.canSee(player)) {
        if (
          Math.abs(xOffset) == Math.abs(yOffset) ||
          xOffset == 0 ||
          yOffset == 0
        ) {
          return true;
        }
      }
      return false;
    } else if (task === "flee") {
      const player = this.getLevel().player;
      const otherX = player.getX();
      const otherY = player.getY();
      if (
        (otherX - this.getX()) * (otherX - this.getX()) +
          (otherY - this.getY()) * (otherY - this.getY()) <
        9
      ) {
        return true;
      }
      return false;
    } else if (task === "wander") {
      return true;
    } else {
      throw new Error("tried to perform undefined task");
    }
  }

  _shoot() {
    const player = this.getLevel().player;
    const xOffset = this.getX() - player.getX();
    const yOffset = this.getY() - player.getY();
    const dX = xOffset == 0 ? 0 : xOffset > 0 ? -1 : 1;
    const dY = yOffset == 0 ? 0 : yOffset > 0 ? -1 : 1;
    const fireArray = this.getLevel().lookInDirection(dX, dY, this);
    this.game.rangeWeaponDisplay = Object.assign(this.weapon.fire(fireArray), {
      color: this.weapon.fg
    });
  }

  _flee() {
    const player = this.getLevel().player;
    const xOffset = this.getX() - player.getX();
    const yOffset = this.getY() - player.getY();
    const dX = xOffset == 0 ? 0 : xOffset > 0 ? 1 : -1;
    const dY = yOffset == 0 ? 0 : yOffset > 0 ? 1 : -1;
    this.tryMove(this.getX() + dX, this.getY() + dY, this.getLevel());
  }

  _hunt() {
    const player = this.getLevel().player;
    const offsets =
      Math.abs(player.getX() - this.getX()) +
      Math.abs(player.getY() - this.getY());
    if (offsets === 1 && this.hasMixin("Attacker")) {
      this.attack(player);
      return;
    }

    if (this.canSee(player)) {
      this.huntingTarget = { x: player.getX(), y: player.getY() };
    }

    const source = this;
    const path = new ROT.Path.AStar(
      this.huntingTarget.x,
      this.huntingTarget.y,
      function(x, y) {
        var entity = source.getLevel().getEntityAt(x, y);
        if (entity && entity !== player && entity !== source) {
          return false;
        }
        return source
          .getLevel()
          .getMap()
          .getTile(x, y).isWalkable;
      }
    );
    let count = 0;
    path.compute(source.getX(), source.getY(), function(x, y) {
      if (count == 1) {
        source.tryMove(x, y, source.getLevel());
      }
      count++;
    });
  }

  _wander() {
    const dX = Math.floor(Math.random() * 3) - 1;
    const dY = Math.floor(Math.random() * 3) - 1;
    if (this.level.player) {
      this.tryMove(this.getX() + dX, this.getY() + dY, this.getLevel());
    }
  }
}

export class InventoryHolder {
  constructor({ inventorySize = 8 }) {
    this.name = "InventoryHolder";
    this.inventorySize = inventorySize;
    this.inventory = [];
    this.addItem = this._addItem;
    this.removeItem = this._removeItem;
    this.hasItem = this._hasItem;
    this.getInventorySize = this._getInventorySize;
  }

  _getInventorySize() {
    let mod = 0;
    if (this.armor) {
      this.armor.forEach(a => {
        mod += a.inventoryBoost;
      });
    }
    return this.inventorySize + mod;
  }
  _hasItem(item) {
    return this.inventory.filter(i => i.name == item).length > 0;
  }
  _addItem(item) {
    if (this.inventory.length < this.getInventorySize()) {
      this.inventory.push(item);
      return true;
    }
    this.game.messageDisplay.add({
      color: "blue",
      text: "Your inventory seems to be full!"
    });
    return false;
  }
  _removeItem(itemToRemove) {
    this.unequip(itemToRemove);
    this.inventory = this.inventory.filter(item => item !== itemToRemove);
  }
}

export class MonsterActor {
  constructor() {
    this.name = "MonsterActor";
    this.groupName = "Actor";
    this.act = this._act;
  }
  _act() {
    const dX = Math.floor(Math.random() * 3) - 1;
    const dY = Math.floor(Math.random() * 3) - 1;
    if (this.level.player && this.canSee(this.level.player)) {
      this.tryMove(this.getX() + dX, this.getY() + dY, this.getLevel());
    }
  }
}

export class Movable {
  constructor() {
    this.name = "Movable";
    this.tryMove = this._tryMove;
  }
  _tryMove(x, y, level) {
    const tile = level.getMap().getTile(x, y);

    const target = level.getEntityAt(x, y);
    if (target) {
      if (this.hasMixin("Attacker")) {
        this.attack(target);
      }
      return false;
    }

    if (tile.isWalkable) {
      this.setPosition(x, y);
      return true;
    }

    if (tile == closedDoorTile) {
      level.getMap().openDoor(x, y);
    }
    return false;
  }
}

export class Attacker {
  constructor({ strength = 1 }) {
    this.name = "Attacker";
    this.strength = strength;
    this.attack = this._attack;
    this.getAttackValue = this._getAttackValue;
  }
  _getAttackValue() {
    let mod = 0;
    if (this.hasMixin("Equipper")) {
      if (this.weapon) {
        mod += this.weapon.attackValue;
      }
    }
    if (this.hasMixin("TimedStatusEffects")) {
      this.getTimedStatusEffects().forEach(s => {
        if (s.property == "strength") {
          mod += s.value;
        }
      });
    }
    return this.strength + mod;
  }
  _attack(target) {
    const game = this.getGame();
    if (target.hasMixin("PlayerActor")) {
      const dieRoll = parseInt(Math.random() * 3) - 1;
      const attack = this.getAttackValue() + dieRoll;
      const defense = target.getDefenseValue();
      const damage = Math.max(attack - defense, 1);
      if (game) {
        game.messageDisplay.add({
          color: "red",
          text: `The ${this.name} hits you for ${damage} damage.`
        });
      }
      target.takeDamage(damage);
    }
    if (this.hasMixin("PlayerActor") && target.hasMixin("Destructible")) {
      const attack = this.getAttackValue();
      const defense = target.getDefenseValue();
      const damage = Math.max(attack - defense, 0);
      if (game && this.hasMixin("PlayerActor")) {
        game.messageDisplay.add({
          color: "white",
          text: `You hit the ${target.name} for ${damage} damage.`
        });
      }
      target.takeDamage(damage);
    }
  }
}

export class Equipper {
  constructor({ weapon = null, armor = [] }) {
    this.name = "Equipper";
    this.weapon = weapon;
    this.armor = armor;
    this.wield = this._wield;
    this.unwield = this._unwield;
    this.wear = this._wear;
    this.takeOff = this._takeOff;
    this.unequip = this._unequip;
    this.isWearing = this._isWearing;
  }

  _isWearing(item) {
    return this.armor.includes(item);
  }

  _wield(weapon) {
    this.weapon = weapon;
  }
  _unwield() {
    this.weapon = null;
  }
  _wear(armor) {
    this.armor.push(armor);
  }
  _takeOff(item) {
    this.armor.splice(this.armor.indexOf(item), 1);
  }
  _unequip(item) {
    if (item === this.armor) {
      this.takeOff(item);
    }
    if (item === this.weapon) {
      this.unwield();
    }
  }
}

export class TimedStatusEffects {
  constructor() {
    this.name = "TimedStatusEffects";
    //array of objects
    // {property, label, value, timer}
    this.statusEffects = [
      // { property: "speed", label: "Speed up", value: 1000, timer: 135 }
    ];
    this.incrementTimedStatusEffects = this._incrementTimedStatusEffects;
    this.getTimedStatusEffects = this._getTimedStatusEffects;
    this.addTimedStatusEffect = this._addTimedStatusEffect;
  }

  _addTimedStatusEffect(effect) {
    this.statusEffects.push(effect);
  }

  _getTimedStatusEffects() {
    return this.statusEffects;
  }

  _incrementTimedStatusEffects() {
    this.statusEffects.forEach(s => {
      s.timer -= 1;
      if (s.timer <= 0) {
        const i = this.statusEffects.indexOf(s);
        this.statusEffects.splice(i, 1);
      }
    });
  }
}
