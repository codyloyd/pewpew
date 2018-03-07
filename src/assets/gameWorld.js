import Level from "./level";

class GameWorld {
  constructor(Game) {
    const topLevel = new Level({ Game, gameWorld: this, topLevel: true });
    const bottomLevel = new Level({ Game, gameWorld: this, bottomLevel: true });
    const middleLevels = [];
    for (let i = 0; i < 3; i++) {
      middleLevels.push(new Level({ Game, gameWorld: this }));
    }
    this.levels = [topLevel, ...middleLevels, bottomLevel];
    this.currentLevel = this.levels[0];
  }

  getCurrentLevel() {
    return this.currentLevel;
  }

  goDownLevel() {
    const index = this.levels.indexOf(this.currentLevel);
    if (index < this.levels.length) {
      this.currentLevel = this.levels[index + 1];
      return this.currentLevel;
    }
    return false;
  }

  goUpLevel() {
    const index = this.levels.indexOf(this.currentLevel);
    if (index > 0) {
      this.currentLevel = this.levels[index - 1];
      return this.currentLevel;
    }
    return false;
  }
}

export default GameWorld;
