import ROT from "rot-js";
import { h, app } from "hyperapp";
import Colors from "../colors";

class ItemDetailDialog {
  constructor(item) {
    this.item = item;
    this.display = document.createElement("div");
    this.display.classList.add("item-detail-dialog");
    this.actions = {};
    this.state = { item: this.item };
    this.functions = app(this.state, this.actions, this.view, this.display);
  }

  view({ item }, actions) {
    return (
      <div>
        <h1>{item.name}</h1>
        <p>{item.description}</p>
        <div>Actions:</div>
        <div>(d)rop</div>
        <div>
          {item.equipped
            ? "(u)nequip"
            : item.wieldable
              ? "(w)ield"
              : item.wearable
                ? "(w)ear"
                : item.hasMixin("Usable") ? "(a)pply" : ""}
        </div>
        <p>Press key to use, press 'q' to go back</p>
        <p>
          hint: you can use the letter shortcuts above from the main inventory
          screen
        </p>
      </div>
    );
  }
}

export default ItemDetailDialog;
