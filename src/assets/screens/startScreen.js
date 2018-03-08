import playScreen from "./playScreen";
import { h, app } from "hyperapp";
import ROT from "rot-js";

class startScreen {
  constructor(Game) {
    this.game = Game;
    this.display = document.createElement("div");
    this.display.classList.add("start-screen");
    app({}, {}, this.view, this.display);
  }

  view({ text, confirm, cancel }) {
    return (
      <div>
        <h1>SPACE DUNGEON</h1>
        <h1 id="pew">PEW PEW</h1>
        <p>PRESS ENTER TO START</p>
      </div>
    );
  }

  exit() {
    this.display.remove();
  }

  render() {
    document.body.appendChild(this.display);
  }

  handleInput(inputData) {
    if (inputData.keyCode == ROT.VK_RETURN) {
      this.game.switchScreen(playScreen);
      this.display.remove();
    }
  }
}

export default startScreen;
