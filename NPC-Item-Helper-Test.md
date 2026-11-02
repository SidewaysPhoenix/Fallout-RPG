# NPC item helper — mod test

Place `npc-item-helper.js` in `Fallout-RPG/Scripts/StatblockItemParsing/` in your vault. Put this note anywhere in the same vault and open it in Reading view. Keep the original Laser Gun note in its usual location.

This test uses your existing `Fallout_2d20_statblock_test` layout and its Attacks callback. If you renamed the layout, change `LAYOUT` below. If the weapon link is ambiguous, change `ITEM` to its full vault wikilink.

The wrapper reads the weapon note on each execution, builds a temporary NPC, and renders a generated statblock. It does not save generated stats into any note. This is a standalone proof before connecting it to your actual NPC notes.

```js-engine
const LAYOUT = "Fallout_2d20_statblock_test";
const ITEM = "[[Laser Gun]]";

try {
  const helper = await engine.importJs("Fallout-RPG/Scripts/StatblockItemParsing/npc-item-helper.js");
  const obsidian = engine.getObsidianModule();
  const sourcePath = context.file?.path ?? "";

  const inventory = [{
    id: "laser-gun-1",
    item: ITEM,
    quantity: 1,
    equipped: true,
    mods: [
      { slot: "Barrel", item: "[[Long Barrel (Energy Weapons)|Long Barrel]]" },
      { slot: "Stock", item: "[[Standard Stock]]" }
    ]
  }];

  const weapon = await helper.resolveWeapon({
    app, obsidian, entry: inventory[0], sourcePath
  });

  const attack = helper.makeWeaponAttack(weapon, {
    attribute: "per",
    skill: "Energy Weapons"
  });

  const npc = {
    layout: LAYOUT,
    name: "Knight — Item Helper Test",
    desc: "Weapon details below are loaded from the Laser Gun note, not entered in this NPC.",
    level: 13,
    type: "Normal Character",
    keywords: "Human",
    xp: 52,
    strength: 6, per: 6, end: 7, cha: 5, int: 5, agi: 6, lck: 4,
    skills: [{ name: "Energy Weapons", desc: "4 ⬛" }],
    hp: 20,
    initiative: 12,
    defense: 1,
    phys_dr: "2 (All)",
    energy_dr: "2 (All)",
    rad_dr: "1 (All)",
    poison_dr: 0,
    attacks: [attack],
    // Separate raw choices and resolved details from the current text display.
    equipment: inventory,
    resolvedInventory: [weapon],
    inventory: [
      `${weapon.quantity} × [[${weapon.sourcePath}|${weapon.name}]] (Equipped)`,
      `Mods: ${weapon.mods.map(m => m.item).join(", ")}`,
      `Ammo: ${weapon.ammo} · Weight: ${weapon.weight} · Cost: ${weapon.cost}`
    ].join("\n\n")
  };

  return engine.markdown.create(
    "```statblock\n" + obsidian.stringifyYaml(npc) + "```"
  );
} catch (error) {
  console.error("NPC item helper test:", error);
  return engine.markdown.create(
    "**NPC item helper test failed:** " + String(error.message ?? error)
  );
}
```

Expected attack: Long Laser Rifle; PER + Energy Weapons; TN 10; Crit 1–4; 4 D6 Piercing 1 Energy damage; Two-Handed; Fire Rate 2; Range M. Inventory: weight 7; cost 99; both installed mods listed.

Install the supplied Long Barrel (Energy Weapons) and Standard Stock notes in their usual vault locations. The helper validates each mod against the base weapon's allowed links and allows one mod per slot. It supports the Range and Weapon Qualities effects demonstrated by these files, signed weight/cost adjustments, prefixes, and the base weapon's modNaming replacement. Other mechanical effect types raise an explicit error until support is added. No crafting materials or prerequisites are consumed or enforced for this GM loading test.

To refresh after changing item data, rerun the JS-Engine block or reopen this note. This version does not watch for edits automatically. Reload Obsidian after replacing the helper to clear the imported module cache.

Local verification covers the supplied base weapon plus both mods, including naming, stats, mod order, custom names, and invalid inputs. Rendering still needs your in-vault test.
