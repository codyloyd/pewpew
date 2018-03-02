import DungeonMap from "./dungeonMap";
import Entity from "./entity/entity";
import { WeaponRepository, ItemRepository } from "./item/items";
import { MonsterTemplate, PlayerTemplate } from "./entity/entities";
import { floorTile, wallTile } from "./tile";

class Level {
  constructor(Game) {
    this.game = Game;
    this.width = this.game.getScreenWidth();
    this.height = this.game.getScreenHeight() * 1.5;
    this.entities = {};
    this.map = new DungeonMap({
      width: this.width,
      height: this.height
    });
    this.exploredTiles = {};
    this.items = {};
    this.player = null;

    // add Entities to Map
    for (let i = 0; i < 40; i++) {
      this.addEntityAtRandomPosition(
        new Entity(
          Object.assign(MonsterTemplate, { level: this, Game: this.game })
        )
      );
    }

    for (let i = 0; i < 25; i++) {
      this.addItemAtRandomPosition(ItemRepository.createRandom());
    }
    for (let i = 0; i < 25; i++) {
      this.addItemAtRandomPosition(WeaponRepository.createRandom());
    }
    this.addItemAtRandomPosition(ItemRepository.create("Space Ship"));
  }

  getItems() {
    return this.items;
  }

  getEntities() {
    return this.entities;
  }

  getRandomFloorPosition() {
    const x = Math.floor(Math.random() * this.width);
    const y = Math.floor(Math.random() * this.height);
    if (this.map.getTile(x, y) === floorTile && !this.getEntityAt(x, y)) {
      return { x, y };
    } else {
      return this.getRandomFloorPosition();
    }
  }

  addItemAtRandomPosition(item) {
    const coords = this.getRandomFloorPosition();
    this.addItem(item, coords.x, coords.y);
  }

  addItem(item, x, y) {
    const key = x + "," + y;
    if (this.items[key]) {
      this.items[key].push(item);
    } else {
      this.items[key] = [item];
    }
  }

  getItemsAt(x, y) {
    const key = x + "," + y;
    return this.items[key];
  }

  setItemsAt(x, y, items) {
    const key = `${x},${y}`;
    if (items.length === 0) {
      if (this.items[key]) {
        delete this.items[key];
      }
    } else {
      this.items[key] = items;
    }
  }

  addEntityAtRandomPosition(entity) {
    const coords = this.getRandomFloorPosition();
    entity.setPosition(coords.x, coords.y);
    this.addEntity(entity);
  }

  getEntityAt(x, y) {
    if (this.player && this.player.getX() == x && this.player.getY() == y) {
      return this.player;
    }
    return this.entities[x + "," + y];
  }

  updateEntityPosition(oldX, oldY, newX, newY) {
    this.entities[newX + "," + newY] = this.entities[oldX + "," + oldY];
    delete this.entities[oldX + "," + oldY];
  }

  addEntity(entity) {
    this.entities[entity.getX() + "," + entity.getY()] = entity;
    if (entity.hasMixin("Actor")) {
      this.game.getScheduler().add(entity, true);
    }
  }

  removeEntity(entityToRemove) {
    const key = entityToRemove.getX() + "," + entityToRemove.getY();
    if (this.entities[key] == entityToRemove) {
      delete this.entities[key];
      if (entityToRemove.hasMixin("Actor")) {
        this.game.getScheduler().remove(entityToRemove);
      }
    }
  }

  getMap() {
    return this.map;
  }
}

export default Level;
