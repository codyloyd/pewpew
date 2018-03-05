import { h, app } from "hyperapp";
import ROT from "rot-js";

class PlayerStatusScreen {
  constructor(masterScreen) {
    this.masterScreen = masterScreen;
    this.display = document.createElement("div");
    this.display.classList.add("subscreen");
    this.actions = {};
    this.app = app(
      { player: this.masterScreen.player },
      this.actions,
      this.view.bind(this),
      this.display
    );
  }

  view({ player }) {
    return (
      <div>
        <h1>player status</h1>
        <p>name: {player.name}</p>
        <p>attack: {player.getAttackValue()}</p>
        <p>defense: {player.getDefenseValue()}</p>
        <p>speed: {player.getSpeed() / 10}%</p>
      </div>
    );
  }

  render() {
    this.display.remove();
    document.body.appendChild(this.display);
  }

  handleInput(inputData) {
    if (inputData.keyCode === ROT.VK_ESCAPE) {
      this.masterScreen.exitSubscreen();
      this.display.remove();
    }
  }
}

export default PlayerStatusScreen;
