import Colors from "../colors";
import {
  InventoryHolder,
  PlayerActor,
  MonsterActor,
  Movable,
  Destructible,
  Sight,
  TaskActor
} from "./entityMixins";

export const PlayerTemplate = {
  name: "ME",
  char: "@",
  fg: Colors.white,
  mixins: [Destructible, Movable, PlayerActor, InventoryHolder]
};

export const MonsterTemplate = {
  name: "Monster",
  char: "m",
  fg: Colors.green,
  mixins: [Movable, TaskActor, Destructible, Sight]
};
