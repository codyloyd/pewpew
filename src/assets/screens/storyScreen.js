import { h, app } from "hyperapp";
import ROT from "rot-js";

class StoryScreen {
  constructor(masterScreen, text, func) {
    this.func = func;
    this.masterScreen = masterScreen;
    this.text = text;
    this.display = document.createElement("div");
    this.display.classList.add("story-screen");
    this.actions = {};
    this.app = app(
      { text: this.text },
      this.actions,
      this.view.bind(this),
      this.display
    );
  }

  view({ text }) {
    return (
      <div>
        {text.map(p => <p>{p}</p>)}
        <p>Press [Enter] to continue</p>
      </div>
    );
  }

  render() {
    this.display.remove();
    document.body.appendChild(this.display);
  }

  handleInput(inputData) {
    if (
      inputData.keyCode === ROT.VK_ESCAPE ||
      inputData.keyCode === ROT.VK_RETURN
    ) {
      this.masterScreen.exitSubscreen();
      this.display.remove();
      if (this.func) {
        this.func();
      }
    }
  }
}

export default StoryScreen;
