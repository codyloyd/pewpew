import ROT from "rot-js";
import { h, app } from "hyperapp";
import Colors from "../colors";
import ItemDetailDialog from "./itemDetailDialog";

class ItemListDialog {
  constructor(items, masterScreen) {
    this.items = items;
    this.masterScreen = masterScreen;
    this.subscreen = null;
    this.display = document.createElement("div");
    this.display.classList.add("item-list-dialog");
    this.actions = {
      inc: this.incSelectedItem.bind(this),
      dec: this.decSelectedItem.bind(this),
      getIndex: value => state => state.selectedItemIndex
    };
    this.state = { items: this.items, selectedItemIndex: 0 };
    this.functions = app(this.state, this.actions, this.view, this.display);
  }

  view({ items, selectedItemIndex }, actions) {
    return (
      <div>
        <div style={{ borderBottom: "1px solid " + Colors.white }}>
          INVENTORY
        </div>
        {items.map((item, i) => {
          return (
            <div class={i == selectedItemIndex ? "selected" : ""}>
              {item.name}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    document.body.appendChild(this.display);
  }

  incSelectedItem() {
    return ({ selectedItemIndex }) => ({
      selectedItemIndex: (selectedItemIndex + 1) % this.items.length
    });
  }
  decSelectedItem() {
    return ({ selectedItemIndex }) => {
      let newValue = selectedItemIndex - 1;
      if (newValue < 0) {
        newValue = this.items.length - 1;
      }

      return {
        selectedItemIndex: newValue
      };
    };
  }

  handleInput(inputData) {
    if (inputData.keyCode === ROT.VK_ESCAPE) {
      this.masterScreen.exitSubscreen();
      this.display.remove();
    } else if (inputData.keyCode === ROT.VK_RETURN) {
      // view selected item
      const item = this.items[this.functions.getIndex()];
      const detailDialog = new ItemDetailDialog(item)
      this.display.innerHTML = ''
      this.display.appendChild(detailDialog.display)
    } else if ( inputData.keyCode == ROT.VK_Q ) {
      this.functions = app(this.state, this.actions, this.view, this.display);
    } else if (
      inputData.keyCode === ROT.VK_J ||
      inputData.keyCode === ROT.VK_DOWN ||
      inputData.keyCode === ROT.VK_2
    ) {
      this.functions.inc();
    } else if (
      inputData.keyCode === ROT.VK_K ||
      inputData.keyCode ||
      ROT.VK_UP ||
      inputData.keyCode === ROT.VK_8
    ) {
      this.functions.dec();
    }
  }
}

export default ItemListDialog;
