import Glyph from "./glyph";
import Colors from "./colors";

class Tile extends Glyph {
  constructor({ isWalkable = false, blocksLight = false }) {
    super(...arguments);
    this.isWalkable = isWalkable;
    this.blocksLight = blocksLight;
  }
}

export const stairsUpTile = new Tile({
  char: "<",
  fg: Colors.gray,
  isWalkable: true
});

export const stairsDownTile = new Tile({
  char: ">",
  fg: Colors.gray,
  isWalkable: true
});

export const floorTile = new Tile({
  char: ".",
  fg: Colors.darkGray,
  isWalkable: true
});

export const wallTile = new Tile({
  char: "#",
  fg: Colors.brown,
  blocksLight: true
});

export const closedDoorTile = new Tile({
  char: "+",
  fg: Colors.peach,
  blocksLight: true,
  isWalkable: false
});

export const openDoorTile = new Tile({
  char: "-",
  fg: Colors.peach,
  blocksLight: false,
  isWalkable: true
});
