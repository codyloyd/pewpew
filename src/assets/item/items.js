import Repository from "../repository";
import Colors from "../colors";
import Item from "./item";

export const ItemRepository = new Repository({ name: "Items", ctor: Item });

ItemRepository.define({
  name: "med pack",
  description:  "Will restore a moderate amount of health.  Single use.",
  char: "+",
  fg: Colors.pink
});

ItemRepository.define({
  name: "Space Ship",
  char: "§",
  description: "Your personal mining rig, large enough for one person and a handful of tools. Equipped with heavy blasters meant for breaking rock.",
  fg: Colors.blue,
  canPickUp: false,
  disableRandomCreation: true
});

export const WeaponRepository = new Repository({ name: "Weapons", ctor: Item });

WeaponRepository.define({
  name: "crowbar",
  char: "(",
  description: "Not the best weapon, but it'll get the job done.",
  fg: Colors.blue
});

WeaponRepository.define({
  name: "small blaster",
  char: "(",
  description: "doesn't pack much punch, but holds 100 charges... not bad!",
  fg: Colors.blue
});
