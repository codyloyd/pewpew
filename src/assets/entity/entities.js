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
  rank: 1,
  speed: 800,
  strength: 3,
  maxHp: 10,
  rngWeight: 10,
  inventoryConstructor: () => ItemRepository.maybeCreateRandom(1, 0.5),
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
  rank: 1,
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
  rank: 2,
  speed: 600,
  maxHp: 32,
  sightRadius: 10,
  strength: 7,
  rngWeight: 4,
  inventoryConstructor: () => ItemRepository.maybeCreateRandom(3, 0.5),
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
  rank: 3,
  inventoryConstructor: () => WeaponRepository.createRandom(),
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
  rank: 2,
  tasks: ["shoot", "flee", "wander"],
  inventoryConstructor: () => WeaponRepository.create("small blaster"),
  weapon: "inventory",
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
  rank: 3,
  tasks: ["shoot", "flee", "wander"],
  inventoryConstructor: () => WeaponRepository.create("light plasma cannon"),
  weapon: "inventory",
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
  rank: 4,
  tasks: ["shoot", "flee", "wander"],
  inventoryConstructor: () => WeaponRepository.create("heavy plasma cannon"),
  weapon: "inventory",
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
