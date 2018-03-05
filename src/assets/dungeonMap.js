import ROT from "rot-js";
import { floorTile, wallTile, openDoorTile, closedDoorTile } from "./tile";

class DungeonMap {
  constructor({ width = 40, height = 20, Game }) {
    this.game = Game;
    this.width = width;
    this.height = height;
    this.tiles = new Array(width);

    for (let w = 0; w < width; w++) {
      this.tiles[w] = new Array(height);
    }

    const maxRoomWidth = Math.random() > 0.3 ? 10 : 22;
    const maxRoomHeight = maxRoomWidth !== 32 && Math.random() > 0.8 ? 22 : 12;

    const generator = new ROT.Map.Digger(width, height, {
      roomWidth: [6, maxRoomWidth],
      roomHeight: [6, maxRoomHeight],
      dugPercentage: 0.3
    });

    generator.create(
      function(x, y, value) {
        this.tiles[x][y] = value == 1 ? wallTile : floorTile;
      }.bind(this)
    );
    this.rooms = generator.getRooms();
    this.rooms.forEach((room, i) => {
      room.getDoors((x, y) => {
        this.tiles[x][y] =
          i == 0
            ? closedDoorTile
            : Math.random() > 0.8
              ? openDoorTile
              : Math.random() > 0.8 ? closedDoorTile : floorTile;
      });
    });
  }

  openDoor(x, y) {
    if (this.tiles[x][y] === closedDoorTile) {
      this.tiles[x][y] = openDoorTile;
    }
  }
  closeDoor(x, y) {
    if (this.tiles[x][y] === openDoorTile) {
      this.tiles[x][y] = closedDoorTile;
      this.game.messageDisplay.add("You close the door");
    }
  }

  getRooms() {
    return this.rooms;
  }

  getTiles() {
    return this.tiles;
  }

  setTile(x, y, tile) {
    try {
      this.tiles[x][y] = tile;
      return tile;
    } catch (e) {
      return false;
    }
  }

  getTile(x, y) {
    try {
      return this.tiles[x][y];
    } catch (e) {}
  }
}

export default DungeonMap;
