import ROT from "rot-js";
import startScreen from "./startScreen";

class WinScreen {
  constructor(Game) {
    this.game = Game;
  }
  exit() {}
  handleInput(inputData) {
    if (inputData.keyCode == ROT.VK_RETURN) {
      this.game.switchScreen(startScreen);
    }
  }
  render(Game) {
    const display = Game.getDisplay();
    display.drawText(0, 0, "YOU WIN.  CONGRATZ");
  }
}
export default WinScreen;
