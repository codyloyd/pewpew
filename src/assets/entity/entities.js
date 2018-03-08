import Colors from "../colors";
import Repository from "../repository";
import Entity from "./entity";
import { ItemRepository, WeaponRepository } from "../item/items";
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
  maxHp: 50,
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

export const EnemyRepository = new Repository({
  name: "Enemies",
  ctor: Entity
});

EnemyRepository.define({
  name: "Small Alien",
  char: "a",
  fg: Colors.indigo,
  speed: 800,
  strength: 3,
  maxHp: 10,
  rngWeight: 10,
  inventory: [ItemRepository.createRandom()],
  mixins: [Movable, InventoryHolder, TaskActor, Destructible, Sight, Attacker]
});

// EnemyRepository.define({
//   name: "Thieving Alien",
//   char: "a",
//   fg: Colors.indigo,
//   speed: 800,
//   strength: 3,
//   maxHp: 10,
//   rngWeight: 10,
//   tasks: ["steal", "flee", "wander"],
//   mixins: [Movable, InventoryHolder, TaskActor, Destructible, Sight, Attacker]
// });

EnemyRepository.define({
  name: "Flying Insect",
  char: "b",
  fg: Colors.darkGreen,
  speed: 1500,
  strength: 2,
  maxHp: 8,
  sightRadius: 15,
  rngWeight: 7,
  mixins: [Movable, TaskActor, Destructible, Sight, Attacker]
});

EnemyRepository.define({
  name: "Big Alien",
  char: "A",
  fg: Colors.pink,
  speed: 600,
  maxHp: 32,
  sightRadius: 10,
  strength: 7,
  rngWeight: 4,
  mixins: [Movable, TaskActor, Destructible, Sight, Attacker]
});

EnemyRepository.define({
  name: "Tough Alien",
  char: "A",
  fg: Colors.red,
  speed: 900,
  maxHp: 52,
  sightRadius: 10,
  strength: 9,
  rngWeight: 3,
  mixins: [Movable, TaskActor, Destructible, Sight, Attacker]
});

EnemyRepository.define({
  name: "Shooter",
  char: "s",
  fg: Colors.orange,
  speed: 1000,
  maxHp: 15,
  sightRadius: 10,
  strength: 3,
  rngWeight: 4,
  tasks: ["shoot", "flee", "wander"],
  inventory: [WeaponRepository.create("small blaster")],
  weapon: WeaponRepository.create("small blaster"),
  mixins: [
    Movable,
    TaskActor,
    Equipper,
    InventoryHolder,
    Destructible,
    Sight,
    Attacker
  ]
});

EnemyRepository.define({
  name: "Bomber",
  char: "S",
  fg: Colors.red,
  speed: 800,
  maxHp: 25,
  sightRadius: 15,
  strength: 3,
  rngWeight: 2,
  tasks: ["shoot", "flee", "wander"],
  inventory: [WeaponRepository.create("light plasma cannon")],
  weapon: WeaponRepository.create("light plasma cannon"),
  mixins: [
    Movable,
    TaskActor,
    Equipper,
    InventoryHolder,
    Destructible,
    Sight,
    Attacker
  ]
});

EnemyRepository.define({
  name: "Alien with huge gun",
  char: "s",
  fg: Colors.pink,
  speed: 800,
  maxHp: 25,
  sightRadius: 25,
  strength: 3,
  rngWeight: 1,
  tasks: ["shoot", "flee", "wander"],
  inventory: [WeaponRepository.create("heavy plasma cannon")],
  weapon: WeaponRepository.create("heavy plasma cannon"),
  mixins: [
    Movable,
    TaskActor,
    Equipper,
    InventoryHolder,
    Destructible,
    Sight,
    Attacker
  ]
});
