import { h, app } from "hyperapp";
import ROT from "rot-js";

class HelpScreen {
  constructor(masterScreen) {
    this.masterScreen = masterScreen;
    this.display = document.createElement("div");
    this.display.classList.add("subscreen");
    this.screens = [
      "otherKeys",
      "movement",
      "inventory",
      "weaponsAndArmor",
      "blasters"
    ];
    this.actions = {
      switchScreen: value => state => ({
        screen: value
      })
    };
    this.app = app(
      { screen: this.screens[0] },
      this.actions,
      this.view.bind(this),
      this.display
    );
  }

  view({ screen }) {
    switch (screen) {
      case "movement":
        return <this.movementScreen />;
      case "otherKeys":
        return <this.otherKeys />;
      case "inventory":
        return <this.inventory />;
      case "weaponsAndArmor":
        return <this.weaponsAndArmor />;
      case "blasters":
        return <this.blasters />;
      default:
        return <div>error</div>;
    }
  }

  weaponsAndArmor() {
    return (
      <div>
        <h1>HELP - WEAPONS AND ARMOR</h1>
        <p>
          You can wield or wear certain items from the inventory screen. Weapons
          and Armor items can give you stat boosts or special abilities. Check
          your player status (press 'p') to see how various weapons and armor
          affect your attack and defense values.
        </p>
        <p>
          You may only wield one weapon at a time, but wielding weapons does not
          use up a turn, so feel free to switch often during combat.
        </p>
        <p>
          Multiple pieces of Armor may be worn, but wearing more than one piece
          will negatively affect your speed... so use with care!
        </p>
        <p class="gray">(press &lt; or &gt; to view more help topics)</p>
      </div>
    );
  }

  blasters() {
    return (
      <div>
        <h1>HELP - BLASTERS</h1>
        <p>
          Blasters can be fired by pressing 'f' and then one of the direction
          keys while wielding the weapon. Blasters can only be fired in one of
          the 8 movement directions and may or may not have a limited range.
          Blasters have a limited amount of charges and once they have run out
          will no longer fire. It is possible to find "blaster chargers"
          throughout the game that can recharge the wielded weapon.
        </p>
        <p class="gray">(press &lt; or &gt; to view more help topics)</p>
      </div>
    );
  }

  inventory() {
    return (
      <div>
        <h1>HELP - INVENTORY</h1>
        <p>
          Press 'i' to interact with you inventory. On the inventory screen, the
          various items can be selected using "up" or "down" from any set of
          movement keys (see HELP-MOVEMENT).
        </p>
        <p>
          Be aware that you can only carry a few items at a time, and this
          includes items that you might be wearing or wielding. It <em>may</em>{" "}
          be possible to find items that increase your inventory size... but
          whether or not that happens lies in the hands of the Gods of RNG.
        </p>
        <p>
          Items can be examined by pressing enter, and can be used by pressing
          any of the keys shown on the details view. You do not need to go to
          the details view to use an item. Simply pressing the correct key from
          the main inventory screen will perform the action specified. For
          example, pressing 'd' from the main inventory screen will drop the
          selected item.
        </p>
        <p class="gray">(press &lt; or &gt; to view more help topics)</p>
      </div>
    );
  }

  otherKeys() {
    return (
      <div>
        <h1>HELP - KEYS</h1>
        <div>i - inventory</div>
        <div>g - pick up item</div>
        <div>v - inspect visible creatures and items</div>
        <div>p - view player status</div>
        <div>c - close door</div>
        <div>f - fire weapon</div>
        <p class="gray">(press &lt; or &gt; to view more help topics)</p>
      </div>
    );
  }

  movementScreen() {
    const movement = `
  y k u    7 8 9
   \\|/      \\|/
  h- -l    4- -6
   /|\\      /|\\
  b j m    1 2 3
 `;
    return (
      <div>
        <h1>HELP - MOVEMENT</h1>
        <div>
          You can move your character with the arrow-keys, numpad or "vi-keys"
          as seen below
        </div>
        <pre style={{ margin: 0 }}>{movement}</pre>
        <div>press 5 or . to wait for one turn</div>
        <p class="gray">(press &lt; or &gt; to view more help topics)</p>
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
    if (inputData.keyCode === ROT.VK_PERIOD) {
      this.screens.push(this.screens.shift());
      this.app.switchScreen(this.screens[0]);
    }
    if (inputData.keyCode === ROT.VK_COMMA) {
      this.screens.unshift(this.screens.pop());
      this.app.switchScreen(this.screens[0]);
    }
  }
}

export default HelpScreen;
