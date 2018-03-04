import Repository from "../repository";
import Colors from "../colors";
import Item from "./item";
import { Equippable } from "./itemMixins";

export const ItemRepository = new Repository({ name: "Items", ctor: Item });

ItemRepository.define({
  name: "med pack",
  description: "Will restore a moderate amount of health.  Single use.",
  char: "+",
  fg: Colors.pink
});

ItemRepository.define({
  name: "Space Ship",
  char: "§",
  description:
    "Your personal mining rig, large enough for one person and a handful of tools. Equipped with heavy blasters meant for breaking rock.",
  fg: Colors.blue,
  canPickUp: false,
  disableRandomCreation: true
});

ItemRepository.define({
  name: "your keys",
  char: '"',
  description: "Your keys!  You can't get off this rock without them!",
  fg: Colors.blue,
  disableRandomCreation: true
});

export const WeaponRepository = new Repository({ name: "Weapons", ctor: Item });

WeaponRepository.define({
  name: "crowbar",
  char: "(",
  description: "Not the best weapon, but it'll get the job done.",
  fg: Colors.blue,
  wieldable: true,
  attackValue: 5,
  mixins: [Equippable]
});

WeaponRepository.define({
  name: "hammer",
  char: "(",
  description: "Not the best weapon, but it'll get the job done.",
  fg: Colors.gray,
  wieldable: true,
  attackValue: 3,
  mixins: [Equippable]
});

WeaponRepository.define({
  name: "monkey wrench",
  char: "(",
  description:
    "Heavy, rusty, not particularly useful as a tool anymore--but if you need to bash someone's brains in....",
  fg: Colors.gray,
  wieldable: true,
  attackValue: 3,
  mixins: [Equippable]
});

WeaponRepository.define({
  name: "lazer sword",
  char: "(",
  description: "Now we're talking, this thing will really mess up some aliens.",
  fg: Colors.pink,
  wieldable: true,
  attackValue: 15,
  mixins: [Equippable]
});

WeaponRepository.define({
  name: "pocket knife",
  description:
    "Old trusty pocket knife.. it's not worth much, but it's better than bare hands.",
  char: ")",
  fg: Colors.brown,
  wieldable: true,
  attackValue: 3,
  mixins: [Equippable]
});

// WeaponRepository.define({
//   name: "small blaster",
//   char: "(",
//   description: "doesn't pack much punch, but holds 100 charges... not bad!",
//   fg: Colors.blue,
//   wieldable: true,
//   attackValue: 1,
//   mixins: [Equippable]
// });
