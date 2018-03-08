import DungeonMap from "./dungeonMap";
import Entity from "./entity/entity";
import {
  WeaponRepository,
  ItemRepository,
  ArmorRepository
} from "./item/items";
import { Bug, EnemyRepository, PlayerTemplate } from "./entity/entities";
import { floorTile, wallTile, stairsUpTile, stairsDownTile } from "./tile";

class Level {
  constructor({ Game, gameWorld, topLevel = false, bottomLevel = false }) {
    this.game = Game;
    this.gameWorld = gameWorld;
    this.width = this.game.getScreenWidth();
    this.height = this.game.getScreenHeight() * 1.5;
    this.entities = {};
    this.map = new DungeonMap({
      width: this.width,
      height: this.height,
      Game: this.game
    });
    this.exploredTiles = {};
    this.items = {};
    this.player = null;

    this.firstRoom = this.map.getRooms()[0];

    if (topLevel) {
      this.playerStartPosition = this.getRandomRoomPosition(this.firstRoom);
    }

    if (!topLevel) {
      this.stairsUp = this.getRandomFloorPosition();
      this.map.setTile(this.stairsUp.x, this.stairsUp.y, stairsUpTile);
    }
    if (!bottomLevel) {
      this.stairsDown = this.getRandomFloorPosition();
      this.map.setTile(this.stairsDown.x, this.stairsDown.y, stairsDownTile);
    }

    for (let i = 0; i < 8; i++) {
      const alien = EnemyRepository.createRandom();
      this.addEntityAtRandomPosition(alien);
    }
    if (!topLevel) {
      for (let i = 0; i < 15; i++) {
        const alien = EnemyRepository.createRandom();
        this.addEntityAtRandomPosition(alien);
      }
    }

    if (!topLevel && Math.random < 0.8) {
      const bugRoom = this.map.getRooms()[1];
      for (let i = 0; i < 10; i++) {
        const roomPosition = this.getRandomRoomPosition(bugRoom);
        const bug = EnemyRepository.create("Flying Insect");
        bug.setPosition(roomPosition.x, roomPosition.y);
        this.addEntity(bug);
      }
    }

    for (let i = 0; i < 5; i++) {
      this.addItemAtRandomPosition(ItemRepository.createRandom());
    }

    const weaponOrArmor =
      Math.random() > 0.5 ? ArmorRepository : WeaponRepository;

    this.addItemAtRandomPosition(weaponOrArmor.createRandom());

    if (topLevel) {
      let firstRoomPosition = this.getRandomRoomPosition(this.firstRoom);
      this.addItem(
        // WeaponRepository.createRandom(1),
        WeaponRepository.create("small blaster"),
        firstRoomPosition.x,
        firstRoomPosition.y
      );

      this.addItem(
        // WeaponRepository.createRandom(1),
        WeaponRepository.create("mean blaster"),
        firstRoomPosition.x,
        firstRoomPosition.y
      );

      this.addItem(
        // WeaponRepository.createRandom(1),
        WeaponRepository.create("light plasma cannon"),
        firstRoomPosition.x,
        firstRoomPosition.y
      );

      const otherRoomPosition = this.getRandomRoomPosition();
      const ship = ItemRepository.create("Space Ship");
      this.addItem(ship, otherRoomPosition.x, otherRoomPosition.y);
    }
    if (bottomLevel) {
      this.addItemAtRandomPosition(ItemRepository.create("keys"));
    }
  }

  getSurroundingTiles(originX, originY, range = 2) {
    // returns an array of all the surrounding tiles with an optional range
    const coords = [];
    for (let i = -range; i < range + 1; i++) {
      for (let j = -range; j < range + 1; j++) {
        const x = originX + i;
        const y = originY + j;
        if (this.getEntityAt(x, y)) {
          coords.push(this.getEntityAt(x, y));
        } else if (this.map.getTile(x, y)) {
          coords.push({ x, y, tile: this.map.getTile(x, y) });
        }
      }
    }
    return coords;
  }

  lookInDirection(xMod, yMod, entity = this.player, range = 25) {
    const coords = [];
    for (let i = 0; i < range + 1; i++) {
      const x = entity.getX() + xMod * i;
      const y = entity.getY() + yMod * i;
      if (this.getEntityAt(x, y)) {
        coords.push(this.getEntityAt(x, y));
      } else if (this.map.getTile(x, y)) {
        coords.push({ x, y, blocksLight: this.map.getTile(x, y).blocksLight });
      }
    }
    return { coords, xMod, yMod };
  }

  getRandomRoomPosition(room = this.map.getRooms().random()) {
    return {
      y:
        Math.floor(Math.random() * (room.getBottom() - room.getTop())) +
        room.getTop(),
      x:
        Math.floor(Math.random() * (room.getLeft() - room.getRight())) +
        room.getRight()
    };
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
    if (!this.getEntityAt(entity.getX(), entity.getY())) {
      this.entities[entity.getX() + "," + entity.getY()] = entity;
      entity.setLevel(this);
      entity.setGame(this.game);
      if (entity.hasMixin("Actor")) {
        this.game.getScheduler().add(entity, true);
      }
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
