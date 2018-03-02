import Colors from "../colors";
import {
  InventoryHolder,
  PlayerActor,
  Movable,
  Destructible,
  Sight,
  TaskActor,
  Attacker,
  Equipper
} from "./entityMixins";

export const PlayerTemplate = {
  name: "ME",
  char: "@",
  fg: Colors.white,
  strength: 6,
  mixins: [
    Destructible,
    Movable,
    PlayerActor,
    InventoryHolder,
    Attacker,
    Equipper
  ]
};

export const MonsterTemplate = {
  name: "Monster",
  char: "m",
  fg: Colors.green,
  mixins: [Movable, TaskActor, Destructible, Sight, Attacker]
};
