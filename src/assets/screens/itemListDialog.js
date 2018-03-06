import ROT from "rot-js";
import { h, app } from "hyperapp";
import Colors from "../colors";
import ItemDetailDialog from "./itemDetailDialog";

class ItemListDialog {
  constructor(items, masterScreen, player, title = "INVENTORY") {
    this.items = items;
    this.masterScreen = masterScreen;
    this.player = player;
    this.subscreen = null;
    this.display = document.createElement("div");
    this.display.classList.add("subscreen");
    this.display.classList.add("item-list-dialog");
    this.title = title;
    this.actions = {
      inc: this.incSelectedItem.bind(this),
      dec: this.decSelectedItem.bind(this),
      getIndex: value => state => state.selectedItemIndex,
      getItems: valie => state => state.items,
      getState: value => state => state,
      getSelectedItem: value => state => state.items[state.selectedItemIndex],
      removeItem: itemToRemove => state => {
        const items = state.items.filter(item => item !== itemToRemove);
        let selectedItemIndex = Math.min(
          state.selectedItemIndex,
          items.length - 1
        );
        return { items, selectedItemIndex };
      }
    };
    this.state = {
      player: this.player,
      title: this.title,
      items: this.items,
      selectedItemIndex: 0
    };
    this.functions = app(this.state, this.actions, this.view, this.display);
  }

  view({ player, items, selectedItemIndex, title }, actions) {
    return (
      <div>
        <h1>
          {title}
          {title == "INVENTORY"
            ? `- ${items.length}/${player.getInventorySize()}`
            : ""}
        </h1>
        {items.map((item, i) => {
          return (
            <div class={i == selectedItemIndex ? "selected" : ""}>
              {item.name}
              {item == player.weapon ? " (wielding)" : ""}
              {player.isWearing(item) ? " (wearing)" : ""}
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
    return ({ selectedItemIndex, items }) => ({
      selectedItemIndex: (selectedItemIndex + 1) % items.length
    });
  }
  decSelectedItem() {
    return ({ selectedItemIndex, items }) => {
      let newValue = selectedItemIndex - 1;
      if (newValue < 0) {
        newValue = items.length - 1;
      }

      return {
        selectedItemIndex: newValue
      };
    };
  }
  exit() {
    this.masterScreen.exitSubscreen();
    this.display.remove();
  }

  renderItemList() {
    this.functions = app(
      this.functions.getState(),
      this.functions,
      this.view,
      this.display
    );
  }

  handleInput(inputData) {
    const item = this.functions.getSelectedItem();

    if (inputData.keyCode === ROT.VK_ESCAPE) {
      this.exit();
    }

    if (!item) {
      return;
    }

    if (inputData.keyCode === ROT.VK_RETURN) {
      // view selected item
      const equipped = item == this.player.armor || item == this.player.weapon;
      const detailDialog = new ItemDetailDialog(
        Object.assign(item, { equipped })
      );
      this.display.innerHTML = "";
      this.display.appendChild(detailDialog.display);
    } else if (inputData.keyCode == ROT.VK_Q) {
      this.display.innerHTML = "";
      this.renderItemList();
    } else if (
      inputData.keyCode === ROT.VK_J ||
      inputData.keyCode === ROT.VK_DOWN ||
      inputData.keyCode === ROT.VK_2
    ) {
      this.functions.inc();
    } else if (
      inputData.keyCode === ROT.VK_K ||
      inputData.keyCode === ROT.VK_UP ||
      inputData.keyCode === ROT.VK_8
    ) {
      this.functions.dec();
    } else if (inputData.keyCode === ROT.VK_W) {
      if (item.wieldable) {
        this.player.wield(item);
        this.player.getGame().messageDisplay.add(`You wield the ${item.name}`);
        this.exit();
      }
      if (item.wearable) {
        this.player.wear(item);
        this.player.getGame().messageDisplay.add(`You put on the ${item.name}`);
        this.exit();
      }
    } else if (inputData.keyCode === ROT.VK_A) {
      if (item.hasMixin("Usable")) {
        item.use(this.player);
        this.player.removeItem(item);
        this.functions.removeItem(item);
        this.player.getGame().messageDisplay.add(`You apply the ${item.name}`);
        this.exit();
      }
    } else if (inputData.keyCode === ROT.VK_U) {
      this.player.unequip(item);
      this.renderItemList();
    } else if (inputData.keyCode === ROT.VK_D) {
      this.player.removeItem(item);
      this.functions.removeItem(item);
      this.masterScreen.level.addItem(
        item,
        this.player.getX(),
        this.player.getY()
      );
      this.renderItemList();
    }
  }
}

export default ItemListDialog;
