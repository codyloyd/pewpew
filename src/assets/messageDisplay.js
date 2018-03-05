import Colors from "./colors";

class MessageDisplay {
  constructor(width = "800px") {
    this.messages = [];
    this.messageScreen = document.createElement("div");
    Object.assign(this.messageScreen.style, {
      width: width,
      "font-size": "15px",
      "letter-spacing": "1px",
      background: Colors.black,
      color: Colors.white,
      "font-family": "Courier, monospace",
      height: "88px",
      overflow: "hidden",
      "margin-top": "-8px",
      "border-top": "8px solid " + Colors.black
    });

    this.messageScreen.textContent = "  ";
  }
  getDisplay() {
    return this.messageScreen;
  }

  add(message) {
    this.messages.push(message);
    this.render();
  }

  clear() {
    this.messages = [];
    this.render();
  }

  render() {
    this.messageScreen.innerHTML = "";
    this.messages
      .slice(Math.max(this.messages.length - 5, 0))
      .forEach(message => {
        let color = "gray";
        if (typeof message == "object") {
          color = message.color;
          message = message.text;
        }
        this.messageScreen.innerHTML += `<div class="${color}">${message}</div>`;
      });
  }
}

export default MessageDisplay;
