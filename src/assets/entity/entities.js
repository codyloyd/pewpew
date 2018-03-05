import Colors from "../colors";
import {
  InventoryHolder,
  PlayerActor,
  Movable,
  Destructible,
  Sight,
  TaskActor,
  Attacker,
  Equipper,
  TimedStatusEffects
} from "./entityMixins";

export const PlayerTemplate = {
  name: "ME",
  char: "@",
  fg: Colors.white,
  sightRadius: 6,
  strength: 6,
  mixins: [
    Destructible,
    Movable,
    PlayerActor,
    InventoryHolder,
    Attacker,
    Equipper,
    Sight,
    TimedStatusEffects
  ]
};

export const MonsterTemplate = {
  name: "Monster",
  char: "m",
  fg: Colors.green,
  mixins: [Movable, TaskActor, Destructible, Sight, Attacker]
};
