import ROT from "rot-js";

export class PlayerActor {
  constructor() {
    this.name = "PlayerActor";
    this.groupName = "Actor";
    this.act = this._act;
  }
  _act() {
    const Game = this.getGame();
    Game.refresh();
    Game.getEngine().lock();
  }
}

export class Destructible {
  constructor({ maxHp = 10, hp }) {
    this.name = "Destructible";
    this.maxHp = maxHp;
    this.hp = hp || this.maxHp;
    this.takeDamage = this._takeDamage;
  }

  _takeDamage(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      if (this.hasMixin("PlayerActor")) {
        this.game.messageDisplay.add(`You DIE`);
      } else {
        this.game.messageDisplay.add(`You kill the ${this.name}.`);
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
    } else if (task === "wander") {
      return true;
    } else {
      throw new Error("tried to perform undefined task");
    }
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
      },
      { topology: 4 }
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
    if (this.level.player && this.canSee(this.level.player)) {
      this.tryMove(this.getX() + dX, this.getY() + dY, this.getLevel());
    }
  }
}

export class InventoryHolder {
  constructor({ inventorySize = 10 }) {
    this.name = "InventoryHolder";
    this.inventorySize = inventorySize;
    this.inventory = [];
    this.addItem = this._addItem;
    this.removeItem = this._removeItem;
  }
  _addItem(item) {
    if (this.inventory.length < this.inventorySize) {
      this.inventory.push(item);
      return true;
    }
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
    return this.strength + mod;
  }
  _attack(target) {
    const game = this.getGame();
    if (target.hasMixin("PlayerActor")) {
      const damage = this.getAttackValue();
      if (game) {
        game.messageDisplay.add(
          `The ${this.name} hits you for ${damage} damage.`
        );
      }
      target.takeDamage(damage);
    }
    if (this.hasMixin("PlayerActor") && target.hasMixin("Destructible")) {
      const damage = this.getAttackValue();
      if (game && this.hasMixin("PlayerActor")) {
        game.messageDisplay.add(
          `You hit the ${target.name} for ${damage} damage.`
        );
      }
      target.takeDamage(damage);
    }
  }
}

export class Equipper {
  constructor({ weapon = null, armor = null }) {
    this.name = "Equipper";
    this.weapon = weapon;
    this.armor = armor;
    this.wield = this._wield;
    this.unwield = this._unwield;
    this.wear = this._wear;
    this.takeOff = this._takeOff;
    this.unequip = this._unequip;
  }

  _wield(weapon) {
    this.weapon = weapon;
  }
  _unwield() {
    this.weapon = null;
  }
  _wear(armor) {
    this.armor = armor;
  }
  _takeOff() {
    this.armor = null;
  }
  _unequip(item) {
    if (item === this.armor) {
      this.takeOff();
    }
    if (item === this.weapon) {
      this.unwield();
    }
  }
}
