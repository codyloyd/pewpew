import DynamicGlyph from "../dynamicGlyph";

class Item extends DynamicGlyph {
  constructor({ name = "item", canPickUp = true, description="" }) {
    super(...arguments);
    this.name = name;
    this.canPickUp = canPickUp;
    this.description = description;
  }
}

export default Item;
