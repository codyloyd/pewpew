import ROT from "rot-js";
import Colors from "../colors";
import Entity from "../entity/entity";
import gameOverScreen from "./gameOverScreen";
import WinScreen from "./winScreen";
import ItemListDialog from "./itemListDialog";
import PickUpDialog from "./pickUpDialog";
import Confirmation from "./confirmation";
import StoryScreen from "./storyScreen";
import HelpScreen from "./helpScreen";
import PlayerStatusScreen from "./playerStatusScreen";
import { WeaponRepository, ItemRepository } from "../item/items";
import { MonsterTemplate, PlayerTemplate } from "../entity/entities";
import GameWorld from "../gameWorld";
import { stairsUpTile, stairsDownTile } from "../tile";
import text from "../text";

class playScreen {
  constructor(Game) {
    this.game = Game;
    this.gameWorld = new GameWorld(this.game);
    this.level = this.gameWorld.getCurrentLevel();
    this.map = this.level.getMap();
    this.subscreen = null;
    this.closing = false;
    this.foundShip = false;
    this.gameOver = false;
    this.win = false;

    this.game.player = new Entity(
      Object.assign(PlayerTemplate, { map: this.map, Game: this.game })
    );
    this.player = this.game.player;
    this.level.player = this.game.player;

    this.game.messageDisplay.clear();

    const position = this.level.playerStartPosition;
    this.player.setPosition(position.x, position.y);
    this.game.getScheduler().add(this.player, true);
    this.game.getEngine().start();

    this.enterSubscreen(new StoryScreen(this, text.introduction));
  }

  exit() {
    console.log("exit play screen");
  }

  handleInput(inputData) {
    if (this.subscreen) {
      this.subscreen.handleInput(inputData);
      return;
    }
    if (inputData.keyCode === ROT.VK_ESCAPE) {
      const exitFunction = () => {
        this.game.switchScreen(gameOverScreen);
      };
      this.enterSubscreen(
        new Confirmation(
          "Are you SURE you want to INSTA-LOSE?",
          exitFunction,
          this
        )
      );
    }
    //movement
    const move = function(dX, dY) {
      this.player.tryMove(
        this.player.getX() + dX,
        this.player.getY() + dY,
        this.level
      );
      this.game.getEngine().unlock();
    }.bind(this);

    const closeDoor = function(dX, dY) {
      this.level
        .getMap()
        .closeDoor(this.player.getX() + dX, this.player.getY() + dY);
      this.closing = false;
      this.game.getEngine().unlock();
    }.bind(this);

    if (
      inputData.keyCode === ROT.VK_H ||
      inputData.keyCode == ROT.VK_4 ||
      inputData.keyCode == ROT.VK_LEFT
    ) {
      if (this.closing) {
        closeDoor(-1, 0);
        return;
      }
      move(-1, 0);
    } else if (
      inputData.keyCode === ROT.VK_L ||
      inputData.keyCode == ROT.VK_6 ||
      inputData.keyCode == ROT.VK_RIGHT
    ) {
      if (this.closing) {
        closeDoor(1, 0);
        return;
      }
      move(1, 0);
    } else if (
      inputData.keyCode === ROT.VK_K ||
      inputData.keyCode == ROT.VK_8 ||
      inputData.keyCode == ROT.VK_UP
    ) {
      if (this.closing) {
        closeDoor(0, -1);
        return;
      }
      move(0, -1);
    } else if (
      inputData.keyCode === ROT.VK_J ||
      inputData.keyCode == ROT.VK_2 ||
      inputData.keyCode == ROT.VK_DOWN
    ) {
      if (this.closing) {
        closeDoor(0, 1);
        return;
      }
      move(0, 1);
    } else if (
      inputData.keyCode === ROT.VK_Y ||
      inputData.keyCode == ROT.VK_7
    ) {
      if (this.closing) {
        closeDoor(-1, -1);
        return;
      }
      move(-1, -1);
    } else if (
      inputData.keyCode === ROT.VK_U ||
      inputData.keyCode == ROT.VK_9
    ) {
      if (this.closing) {
        closeDoor(1, -1);
        return;
      }
      move(1, -1);
    } else if (
      inputData.keyCode === ROT.VK_B ||
      inputData.keyCode == ROT.VK_1
    ) {
      if (this.closing) {
        closeDoor(-1, 1);
        return;
      }
      move(-1, 1);
    } else if (
      inputData.keyCode === ROT.VK_N ||
      inputData.keyCode == ROT.VK_3
    ) {
      if (this.closing) {
        closeDoor(1, 1);
        return;
      }
      move(1, 1);
    } else if (
      inputData.keyCode === ROT.VK_5 ||
      inputData.keyCode === ROT.VK_PERIOD
    ) {
      if (inputData.shiftKey) {
        // go down level
        if (
          this.level
            .getMap()
            .getTile(this.player.getX(), this.player.getY()) !== stairsDownTile
        ) {
          return false;
        }
        const newLevel = this.gameWorld.goDownLevel();
        if (newLevel) {
          this.level = newLevel;
          this.player.setPosition(this.level.stairsUp.x, this.level.stairsUp.y);
          this.level.player = this.player;
          this.map = this.level.getMap();
          this.game.refresh();
        }
        return;
      }

      // if no shift key, then wait
      this.game.getEngine().unlock();
    } else if (inputData.keyCode === ROT.VK_COMMA && inputData.shiftKey) {
      // go up level
      if (
        this.level.getMap().getTile(this.player.getX(), this.player.getY()) !==
        stairsUpTile
      ) {
        return false;
      }
      const newLevel = this.gameWorld.goUpLevel();
      if (newLevel) {
        this.level = newLevel;
        this.player.setPosition(
          this.level.stairsDown.x,
          this.level.stairsDown.y
        );
        this.level.player = this.player;
        this.map = this.level.getMap();
        this.game.refresh();
        return;
      }
    } else if (inputData.keyCode == ROT.VK_C) {
      this.game.messageDisplay.add({ text: "Close where?", color: "white" });
      this.closing = true;
      return;
    }
    if (this.closing) {
      this.game.messageDisplay.add("Nevermind");
      this.closing = false;
    }
    // pick up item
    if (inputData.keyCode === ROT.VK_G || inputData.keyCode == ROT.VK_COMMA) {
      const item = this.level.getItems()[
        this.player.getX() + "," + this.player.getY()
      ];
      if (
        item.length == 1 &&
        item[0].canPickUp &&
        this.player.addItem(item[0])
      ) {
        this.level.setItemsAt(this.player.getX(), this.player.getY(), []);
        this.game.messageDisplay.add("you pick up " + item[0].describeA());
      }
      if (item.length > 1) {
        this.enterSubscreen(new PickUpDialog(item, this, this.player));
      }
    }
    // subscreens
    if (inputData.keyCode == ROT.VK_I) {
      this.enterSubscreen(
        new ItemListDialog(this.player.inventory, this, this.player)
      );
    }
    if (inputData.keyCode == ROT.VK_SLASH) {
      this.enterSubscreen(new HelpScreen(this));
    }
    if (inputData.keyCode == ROT.VK_P) {
      this.enterSubscreen(new PlayerStatusScreen(this));
    }
  }

  enterSubscreen(subscreen) {
    this.subscreen = subscreen;
    this.game.refresh();
  }

  exitSubscreen() {
    this.subscreen = null;
    this.game.refresh();
  }

  render(Game) {
    const playerStatusDisplay = Game.playerStatusDisplay;
    const display = Game.getDisplay();
    const map = this.level.getMap();

    playerStatusDisplay.render({
      name: this.player.name,
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      statusEffects: this.player.getTimedStatusEffects()
    });

    const items = this.level.getItems();
    if (items[this.player.getX() + "," + this.player.getY()]) {
      const item = items[this.player.getX() + "," + this.player.getY()];
      if (
        !this.foundShip &&
        item.filter(i => i.name == "Space Ship").length > 0
      ) {
        this.foundShip = true;
        this.enterSubscreen(
          new StoryScreen(this, text.foundShipNoKeys, () => {
            this.player.addItem(WeaponRepository.create("crowbar"));
            this.game.messageDisplay.add(
              "You have found your rig, don't forget where it is!"
            );
            this.game.messageDisplay.add({
              text:
                "crowbar added to inventory (go wield it. or don't. whatever)",
              color: "blue"
            });
          })
        );
        return;
      }
      if (!this.foundKeys && item.filter(i => i.name == "keys").length > 0) {
        this.foundKeys = true;
        this.enterSubscreen(new StoryScreen(this, text.foundKeys));
        return;
      }
      if (
        !this.win &&
        this.player.hasItem("keys") &&
        item.filter(i => i.name == "Space Ship").length > 0
      ) {
        this.win = true;
        this.enterSubscreen(
          new StoryScreen(this, text.foundKeysAndShip, () => {
            this.game.switchScreen(WinScreen);
          })
        );
        return;
      }
      if (item.length == 1) {
        this.game.messageDisplay.add({
          text: "you see " + item[0].describeA(),
          color: "light-gray"
        });
      } else {
        this.game.messageDisplay.add({
          text: "you see several items here",
          color: "light-gray"
        });
      }
    }

    const screenWidth = Game.getScreenWidth();
    const screenHeight = Game.getScreenHeight();
    let topLeftX = Math.max(0, this.player.getX() - screenWidth / 2);
    topLeftX = Math.min(topLeftX, this.level.width - screenWidth);

    let topLeftY = Math.max(0, this.player.getY() - screenHeight / 2);
    topLeftY = Math.min(topLeftY, this.level.height - screenHeight);

    const fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
      if (map.getTile(x, y)) {
        return !map.getTile(x, y).blocksLight;
      }

      return false;
    });

    const visibleTiles = {};
    const exploredTiles = this.level.exploredTiles;
    fov.compute(
      this.player.getX(),
      this.player.getY(),
      this.player.getSightRadius(),
      function(x, y, r, visibility) {
        visibleTiles[x + "," + y] = true;
        exploredTiles[x + "," + y] = true;
      }
    );

    for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
      for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
        const tile = map.getTile(x, y);
        if (visibleTiles[x + "," + y]) {
          display.draw(
            x - topLeftX,
            y - topLeftY,
            tile.getChar(),
            tile.getFg(),
            tile.getBg()
          );
        } else if (this.level.exploredTiles[x + "," + y]) {
          display.draw(
            x - topLeftX,
            y - topLeftY,
            tile.getChar(),
            Colors.darkBlue,
            Colors.black
          );
        }
      }
    }

    Object.keys(items).forEach(itemKey => {
      const [x, y] = itemKey.split(",");
      const item = items[itemKey];
      if (visibleTiles[x + "," + y]) {
        display.draw(
          parseInt(x) - topLeftX,
          parseInt(y) - topLeftY,
          item[0].getChar(),
          item[0].getFg(),
          item[0].getBg()
        );
      }
    });

    const entities = this.level.getEntities();
    Object.values(entities).forEach(entity => {
      if (visibleTiles[entity.getX() + "," + entity.getY()]) {
        display.draw(
          entity.getX() - topLeftX,
          entity.getY() - topLeftY,
          entity.getChar(),
          entity.getFg(),
          entity.getBg()
        );
      }
    });
    display.draw(
      this.player.getX() - topLeftX,
      this.player.getY() - topLeftY,
      this.player.getChar(),
      this.player.getFg(),
      this.player.getBg()
    );
    if (this.subscreen) {
      this.subscreen.render(Game);
      return;
    }

    if (this.win) {
      // this.game.switchScreen(WinScreen);
    }
  }
}

export default playScreen;
