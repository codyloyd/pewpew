import ROT from "rot-js";
import { h, app } from "hyperapp";
import Colors from "../colors";

class ItemDetailDialog {
  constructor(item) {
    this.item = item;
    this.display = document.createElement("div");
    this.display.classList.add('item-detail-dialog')
    this.actions = {
    };
    this.state = { item: this.item };
    this.functions = app(this.state, this.actions, this.view, this.display);
  }

  view({item}, actions) {
    return (
      <div>
        <div>{item.description}</div>
        <div>Press key to use, press 'q' to go back</div>
      </div>
    )
  }
}

export default ItemDetailDialog;
