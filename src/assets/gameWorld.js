import Level from "./level";

class GameWorld {
  constructor(Game) {
    const firstLevel = new Level({ Game, gameWorld: this, topLevel: true });
    const secondLevel = new Level({ Game, gameWorld: this });
    const thirdLevel = new Level({ Game, gameWorld: this, bottomLevel: true });
    this.levels = [firstLevel, secondLevel, thirdLevel];
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
