import ItemListDialog from "./itemListDialog";
import ItemDetailDialog from "./itemDetailDialog";
import ROT from "rot-js";

class VisibleThingsDialog extends ItemListDialog {
  constructor() {
    super(...arguments, "Visible Creatures and Items");
    this.title = "Visible Creatures and Items";
  }

  handleInput(inputData) {
    if (
      inputData.keyCode == ROT.VK_D ||
      inputData.keyCode == ROT.VK_W ||
      inputData.keyCode == ROT.VK_A
    ) {
      return;
    }
    if (inputData.keyCode == ROT.VK_RETURN) {
      const item = this.functions.getSelectedItem();
      const detailDialog = new ItemDetailDialog(item, true);
      this.display.innerHTML = "";
      this.display.appendChild(detailDialog.display);
      return;
    }
    super.handleInput(inputData);
  }
}

export default VisibleThingsDialog;
