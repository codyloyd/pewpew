import Colors from "./colors";

class PlayerStatusDisplay {
  constructor(width = 800) {
    this.playerStatus = document.createElement("div");
    this.playerStatus.classList.add("player-status");
    Object.assign(this.playerStatus.style, {
      width: "800px",
      "font-size": "15px",
      "letter-spacing": "1px",
      background: Colors.black,
      color: Colors.white,
      "font-family": "Courier, monospace",
      height: "18px",
      overflow: "hidden",
      display: "flex"
    });

    this.playerStatus.textContent = "  ";
  }
  getDisplay() {
    return this.playerStatus;
  }

  render({ name = "Player Name", hp, maxHp, statusEffects, weapon, x, y }) {
    const hpColor = hp <= 10 ? "red" : "";
    this.playerStatus.innerHTML = "";
    this.playerStatus.innerHTML = `<div class="${hpColor}" style="flex: 1">HEALTH ♥${hp}/${maxHp}<span>${weapon
      ? weapon.name
      : "NO WEAPON"}</span></div>`;
    this.playerStatus.innerHTML += "<div>";
    statusEffects.forEach(s => {
      this.playerStatus.innerHTML += `${s.label}/${s.timer} `;
    });
    if (weapon && (weapon.charges == 0 || weapon.charges)) {
      this.playerStatus.innerHTML += ` Weapon charges remaining: ${weapon.charges}`;
    }
    this.playerStatus.innerHTML += "</div>";
  }
}

export default PlayerStatusDisplay;
