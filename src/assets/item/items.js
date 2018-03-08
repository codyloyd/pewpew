import Repository from "../repository";
import Colors from "../colors";
import Item from "./item";
import { Fireable, Equippable, StatusBooster } from "./itemMixins";

export const ItemRepository = new Repository({ name: "Items", ctor: Item });

ItemRepository.define({
  name: "med pack",
  description: "Will restore a small amount of health.  Single use.",
  char: "†",
  fg: Colors.pink,
  hpUp: 10,
  rngWeight: 10,
  rank: 1,
  mixins: [StatusBooster]
});

ItemRepository.define({
  name: "health generator",
  description:
    "Using this item will increase you maxHP by 15 points, but installing it hurts and will decrease your health points by 15.. you might want to have a medpack handy.",
  fg: Colors.orange,
  char: "‡",
  hpUp: -15,
  maxHpUp: 10,
  rngWeight: 3,
  rank: 3,
  mixins: [StatusBooster]
});

ItemRepository.define({
  name: "big med pack",
  description: "Will restore a moderate amount of health.  Single use.",
  char: "†",
  fg: Colors.red,
  hpUp: 25,
  rngWeight: 5,
  rank: 2,
  mixins: [StatusBooster]
});

ItemRepository.define({
  name: "blaster charges",
  description: "Will add 50 charges the wielded weapon.  Single use.",
  weaponRecharge: 50,
  char: "*",
  fg: Colors.blue,
  rngWeight: 5,
  rank: 1,
  mixins: [StatusBooster]
});

ItemRepository.define({
  name: "strength stim syringe",
  description:
    "A syringe filled with a thick, dark liquid.  Will temporarily increase your strength. May reduce HP.",
  char: "!",
  fg: Colors.darkPurple,
  hpDown: 3,
  rngWeight: 5,
  rank: 1,
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
  rank: 1,
  rngWeight: 5,
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
  rngWeight: 5,
  rank: 1,
  statusEffect: {
    property: "defense",
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

export const ArmorRepository = new Repository({ name: "Items", ctor: Item });

ArmorRepository.define({
  name: "backpack",
  description:
    "Increases your inventory size and provides a teeny-tiny amount of defense, might slow you down a bit though.",
  char: "[",
  fg: Colors.blue,
  wearable: true,
  defenseValue: 2,
  inventoryBoost: 5,
  rngWeight: 3,
  mixins: [Equippable]
});

ArmorRepository.define({
  name: "night-vision goggles",
  char: "[",
  fg: Colors.green,
  description:
    "Increases your sight-radius while worn, and offers a small amount of protection. Could be useful in these caverns.",
  wearable: true,
  sightBoost: 8,
  defenseValue: 3,
  rngWeight: 5,
  mixins: [Equippable]
});

ArmorRepository.define({
  name: "techno chain mail shirt",
  char: "[",
  fg: Colors.indigo,
  description:
    "Huh... why do these aliens have bits of armor just randomly strewn about their weirdo cave system?  No matter, I guess I'll take the defense boost.",
  wearable: true,
  defenseValue: 8,
  rngWeight: 1,
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
  rank: 1,
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
  rank: 1,
  mixins: [Equippable]
});

WeaponRepository.define({
  name: "lazer sword",
  char: "(",
  description: "Now we're talking, this thing will really mess up some aliens.",
  fg: Colors.pink,
  wieldable: true,
  attackValue: 15,
  rank: 2,
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
  rank: 1,
  mixins: [Equippable]
});

WeaponRepository.define({
  name: "small blaster",
  char: "┌",
  description:
    "doesn't pack much punch, but only costs 1 charge to shoot... not bad!",
  fg: Colors.green,
  wieldable: true,
  maxCharges: 30,
  chargesPerShot: 1,
  attackValue: 0,
  rangeDamage: 4,
  rank: 1,
  mixins: [Equippable, Fireable]
});

WeaponRepository.define({
  name: "turret blaster",
  char: "┌",
  description: "a blaster ripped off of a turret",
  fg: Colors.darkPurple,
  wieldable: true,
  maxCharges: 30,
  chargesPerShot: 5,
  attackValue: 0,
  rangeDamage: 6,
  rank: 1,
  mixins: [Equippable, Fireable]
});

WeaponRepository.define({
  name: "mean blaster",
  char: "┌",
  description: "Holds 30 charges, takes 5 to shoot... but packs a mean punch",
  fg: Colors.blue,
  wieldable: true,
  maxCharges: 30,
  chargesPerShot: 3,
  attackValue: 0,
  rangeDamage: 15,
  rank: 2,
  mixins: [Equippable, Fireable]
});

WeaponRepository.define({
  name: "light plasma cannon",
  char: "┌",
  description: "Uses up 15 charges per shot. This one really leaves a mark.",
  fg: Colors.red,
  wieldable: true,
  maxCharges: 50,
  chargesPerShot: 10,
  attackValue: 0,
  blastRadius: 1,
  rangeDamage: 25,
  rank: 2,
  mixins: [Equippable, Fireable]
});

WeaponRepository.define({
  name: "heavy plasma cannon",
  char: "┌",
  description: "stand back",
  fg: Colors.white,
  wieldable: true,
  maxCharges: 150,
  chargesPerShot: 25,
  attackValue: 0,
  blastRadius: 2,
  rangeDamage: 20,
  rank: 2,
  mixins: [Equippable, Fireable]
});
