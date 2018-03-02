import ItemListDialog from "./itemListDialog";
import ROT from "rot-js";

class PickUpScreen extends ItemListDialog {
  constructor() {
    super(...arguments, "Pick Up What?");
    this.title = "Pick up what?";
  }

  handleInput(inputData) {
    if (inputData.keyCode == ROT.VK_D || inputData.keyCode == ROT.VK_W) {
      return;
    }
    if (inputData.keyCode == ROT.VK_RETURN) {
      const item = this.functions.getSelectedItem();
      this.player.addItem(item);
      this.functions.removeItem(item);
      const items = this.functions.getItems();
      this.masterScreen.level.setItemsAt(
        this.player.getX(),
        this.player.getY(),
        items
      );
      if (items.length == 0) {
        this.exit();
      }
      return;
    }
    super.handleInput(inputData);
  }
}

export default PickUpScreen;
