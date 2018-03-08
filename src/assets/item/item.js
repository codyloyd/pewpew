import DynamicGlyph from "../dynamicGlyph";

class Item extends DynamicGlyph {
  constructor({ name = "item", canPickUp = true, description = "", rank = 1 }) {
    super(...arguments);
    this.rank = rank;
    this.name = name;
    this.canPickUp = canPickUp;
    this.description = description;
  }
}

export default Item;
