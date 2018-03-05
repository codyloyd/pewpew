import { h, app } from "hyperapp";
import ROT from "rot-js";

class Confirmation {
  constructor(text, func, masterScreen) {
    this.text = text;
    this.masterScreen = masterScreen;
    this.function = func;
    this.display = document.createElement("div");
    this.display.classList.add("subscreen");
    this.display.classList.add("confirmation");
    app(
      {
        text: this.text,
        confirm: this.confirm.bind(this),
        cancel: this.cancel.bind(this)
      },
      {},
      this.view,
      this.display
    );
  }

  view({ text, confirm, cancel }) {
    return (
      <div>
        {text}
        <div>
          <button onclick={confirm}>YES (ENTER)</button>
          <button onclick={cancel}>NO (ESCAPE)</button>
        </div>
      </div>
    );
  }

  render() {
    document.body.appendChild(this.display);
  }

  confirm() {
    this.masterScreen.exitSubscreen();
    this.display.remove();
    this.function();
  }

  cancel() {
    this.masterScreen.exitSubscreen();
    this.display.remove();
  }

  handleInput(inputData) {
    if (inputData.keyCode === ROT.VK_ESCAPE) {
      this.cancel();
    }
    if (inputData.keyCode === ROT.VK_RETURN) {
      this.confirm();
    }
  }
}

export default Confirmation;
