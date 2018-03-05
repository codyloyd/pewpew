import DungeonMap from "./dungeonMap";
import Entity from "./entity/entity";
import { WeaponRepository, ItemRepository } from "./item/items";
import { MonsterTemplate, PlayerTemplate } from "./entity/entities";
import { floorTile, wallTile, stairsUpTile, stairsDownTile } from "./tile";

class Level {
  constructor({ Game, gameWorld, topLevel = false, bottomLevel = false }) {
    this.game = Game;
    this.gameWorld = gameWorld;
    this.width = this.game.getScreenWidth();
    this.height = this.game.getScreenHeight();
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

    // add Entities to Map
    for (let i = 0; i < 10; i++) {
      this.addEntityAtRandomPosition(
        new Entity(
          Object.assign(MonsterTemplate, { level: this, Game: this.game })
        )
      );
    }

    for (let i = 0; i < 2; i++) {
      this.addItemAtRandomPosition(ItemRepository.createRandom());
    }

    if (topLevel) {
      let firstRoomPosition = this.getRandomRoomPosition(this.firstRoom);
      this.addItem(
        WeaponRepository.createRandom(1),
        firstRoomPosition.x,
        firstRoomPosition.y
      );

      firstRoomPosition = this.getRandomRoomPosition(this.firstRoom);
      this.addItem(
        ItemRepository.create("night-vision goggles"),
        // ItemRepository.createRandom(),
        firstRoomPosition.x,
        firstRoomPosition.y
      );
      this.addItem(
        ItemRepository.create("backpack"),
        // ItemRepository.createRandom(),
        firstRoomPosition.x,
        firstRoomPosition.y
      );
      this.addItem(
        ItemRepository.create("techno chain mail shirt"),
        // ItemRepository.createRandom(),
        firstRoomPosition.x,
        firstRoomPosition.y
      );

      const otherRoomPosition = this.getRandomRoomPosition();
      const ship = ItemRepository.create("Space Ship");
      this.addItem(ship, otherRoomPosition.x, otherRoomPosition.y);
    }
    if (topLevel) {
      this.addItemAtRandomPosition(ItemRepository.create("keys"));
    }
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
