import DynamicGlyph from "../dynamicGlyph";

class Item extends DynamicGlyph {
  constructor({
    name = "item",
    canPickUp = true,
    description = "",
    level = 1
  }) {
    super(...arguments);
    this.level = level;
    this.name = name;
    this.canPickUp = canPickUp;
    this.description = description;
  }
}

export default Item;
