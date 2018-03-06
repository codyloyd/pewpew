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
    PlayerActor,
    Destructible,
    Movable,
    InventoryHolder,
    Attacker,
    Equipper,
    Sight,
    TimedStatusEffects
  ]
};

export const MonsterTemplate = {
  name: "Small Alien",
  char: "a",
  fg: Colors.indigo,
  speed: 800,
  mixins: [Movable, TaskActor, Destructible, Sight, Attacker]
};
