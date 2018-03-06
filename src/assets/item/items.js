import Repository from "../repository";
import Colors from "../colors";
import Item from "./item";
import { Fireable, Equippable, StatusBooster } from "./itemMixins";

export const ItemRepository = new Repository({ name: "Items", ctor: Item });

ItemRepository.define({
  name: "med pack",
  description: "Will restore a moderate amount of health.  Single use.",
  char: "+",
  fg: Colors.pink,
  hpUp: 5,
  mixins: [StatusBooster]
});

ItemRepository.define({
  name: "strength stim syringe",
  description:
    "A syringe filled with a thick, dark liquid.  Will temporarily increase your strength. May reduce HP.",
  char: "!",
  fg: Colors.darkPurple,
  hpDown: 3,
  statusEffect: {
    property: "strength",
    value: 10,
    label: "Strength boost",
    timer: 25
  },
  mixins: [StatusBooster]
});

ItemRepository.define({
  name: "speed-boost syringe",
  description:
    "A syringe filled with a dark liquid that smells of coffee.  Will temporarily increase your speed.",
  char: "!",
  fg: Colors.darkGreen,
  statusEffect: {
    property: "speed",
    value: 1000,
    label: "Speed boost",
    timer: 25
  },
  mixins: [StatusBooster]
});

ItemRepository.define({
  name: "armor-boost syringe",
  description:
    "No clue how this tech is supposed to work.. but shooting this baby up will temporarily increase your defense value.  It's a game, get over it.",
  char: "!",
  fg: Colors.darkGreen,
  statusEffect: {
    property: "speed",
    value: 10,
    label: "Armor boost",
    timer: 25
  },
  mixins: [StatusBooster]
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
  name: "keys",
  char: '"',
  description: "Your keys!  You can't get off this rock without them!",
  fg: Colors.blue,
  disableRandomCreation: true
});

ItemRepository.define({
  name: "backpack",
  description:
    "Increases your inventory size and provides a teeny-tiny amount of defense, might slow you down a bit though.",
  char: "[",
  fg: Colors.blue,
  wearable: true,
  defenseValue: 2,
  inventoryBoost: 5,
  mixins: [Equippable]
});

ItemRepository.define({
  name: "night-vision goggles",
  char: "[",
  fg: Colors.green,
  description:
    "Increases your sight-radius while worn, and offers a small amount of protection. Could be useful in these caverns.",
  wearable: true,
  sightBoost: 8,
  defenseValue: 3,
  mixins: [Equippable]
});

ItemRepository.define({
  name: "techno chain mail shirt",
  char: "[",
  fg: Colors.indigo,
  description:
    "Huh... why do these aliens have bits of armor just randomly strewn about their weirdo cave system?  No matter, I guess I'll take the defense boost.",
  wearable: true,
  defenseValue: 8,
  mixins: [Equippable]
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
  level: 1,
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
  level: 1,
  mixins: [Equippable]
});

WeaponRepository.define({
  name: "lazer sword",
  char: "(",
  description: "Now we're talking, this thing will really mess up some aliens.",
  fg: Colors.pink,
  wieldable: true,
  attackValue: 15,
  level: 2,
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
  level: 1,
  mixins: [Equippable]
});

WeaponRepository.define({
  name: "small blaster",
  char: "(",
  description: "doesn't pack much punch, but holds 100 charges... not bad!",
  fg: Colors.green,
  wieldable: true,
  maxCharges: 100,
  attackValue: 1,
  rangeDamage: 3,
  level: 1,
  mixins: [Equippable, Fireable]
});
