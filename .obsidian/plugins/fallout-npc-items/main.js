const { Plugin, MarkdownRenderChild, MarkdownRenderer, parseYaml } = require("obsidian");

// Bundled resolver. All note access is read-only and requested on view.
async function resolveWeapon({ app, obsidian, entry, sourcePath = "", readItem }) {
  if (!entry || typeof entry.item !== "string") {
    throw new Error("An inventory entry needs an item wikilink.");
  }
  if (entry.mods != null && !Array.isArray(entry.mods)) {
    throw new Error("mods must be a list.");
  }

  const target = entry.item.trim().replace(/^\[\[/, "").replace(/\]\]$/, "")
    .split("|")[0].split("#")[0].trim();
  const file = app.metadataCache.getFirstLinkpathDest(target, sourcePath);
  if (!file || file.extension !== "md") {
    throw new Error(`Cannot find weapon note: ${target}. Use a full vault path if needed.`);
  }
  const data = await readItem(file);
  const diceMatch = String(data.damage_rating ?? "").trim().match(/^(\d+)\s*d6$/i);
  if (!diceMatch) throw new Error(`Unsupported damage_rating in ${file.path}: ${data.damage_rating}`);

  const numeric = key => {
    const value = data[key];
    if (value == null || String(value).trim() === "") return null;
    const number = value === "-" || value === "<1" ? 0 : Number(value);
    if (!Number.isFinite(number)) throw new Error(`Invalid ${key} in ${file.path}.`);
    return number;
  };

  const weapon = {
    id: entry.id,
    item: entry.item,
    sourcePath: file.path,
    name: entry.name || data.name || file.basename,
    quantity: entry.quantity ?? 1,
    equipped: entry.equipped === true,
    mods: [],
    skill: data.type,
    damage: Number(diceMatch[1]),
    damageEffects: data.damage_effects || "",
    damageQualities: data.qualities || "",
    damageType: data.damage_type || "",
    fireRate: numeric("fire_rate"),
    range: data.range || "",
    ammo: data.ammo || "",
    weight: numeric("weight"),
    cost: numeric("cost"),
    rarity: data.rarity,
    gameEffects: data.gameEffects || "",
    // Preserve the full parsed source for future tools.
    data
  };
  const usedSlots = new Set(), usedFiles = new Set(), installedMods = [];
  const prefixes = [];
  let generatedName = data.name || file.basename;
  for (const installed of entry.mods ?? []) {
    const slotKey = normalize(installed.slot);
    if (!slotKey) throw new Error("Each mod needs a slot.");
    const modTarget = linkTarget(installed.item);
    const modFile = app.metadataCache.getFirstLinkpathDest(modTarget, file.path);
    if (!modFile || modFile.extension !== "md") throw new Error(`Cannot find mod: ${modTarget}`);
    if (usedFiles.has(modFile.path)) throw new Error(`Duplicate installed mod: ${modTarget}`);
    usedFiles.add(modFile.path);
    const legendary = ["Weapons", "CustomWeapons"].some(folder =>
      modFile.path.startsWith("Fallout-RPG/Items/Mods/Legendary Mods/" + folder + "/"));
    if (legendary) {
      if (!["legendary", "legendary mod", "legendary mods"].includes(slotKey)) throw new Error("Use slot Legendary for legendary weapon properties.");
    } else {
      if (usedSlots.has(slotKey)) throw new Error(`More than one mod in slot: ${installed.slot}`);
      usedSlots.add(slotKey);
      const slot = (data.mods ?? []).find(s => normalize(s.name) === slotKey);
      if (!slot) throw new Error(`Unknown mod slot: ${installed.slot}`);
      const allowed = [...String(slot.desc ?? "").matchAll(/\[\[([^\]]+)\]\]/g)]
        .some(m => app.metadataCache.getFirstLinkpathDest(linkTarget(m[0]), file.path)?.path === modFile.path);
      if (!allowed) throw new Error(`${installed.item} is not allowed in ${installed.slot}.`);
    }
    const mod = await readItem(modFile);
    installedMods.push(mod);
    weapon.mods.push({ slot: installed.slot, item: installed.item, name: mod.mod || modFile.basename });
    const prefix = String(mod.prefix ?? mod["name prefix"] ?? (legendary ? mod.mod || modFile.basename : "")).trim();
    if (prefix && prefix !== "-") prefixes.push({ slot: slotKey, text: prefix, legendary });
    for (const rule of data.modNaming ?? []) {
      if (normalize(rule.slot) === slotKey && rule.replace) {
        generatedName = generatedName.replace(String(rule.replace), String(rule.with ?? ""));
      }
    }
  }
  applyWeaponMods(weapon, installedMods);
  // Use base weapon slot order so inventory list order does not change naming.
  const slots = (data.mods ?? []).map(s => normalize(s.name));
  prefixes.sort((a, b) => Number(b.legendary) - Number(a.legendary) || slots.indexOf(a.slot) - slots.indexOf(b.slot));
  weapon.name = entry.name || [...prefixes.map(p => p.text), generatedName].join(" ");
  return weapon;
}

function makeWeaponAttack(weapon, { attribute, skill = weapon.skill, name = weapon.name }) {
  if (!attribute || !skill) throw new Error("An attack needs an attribute and skill.");
  return {
    name,
    inventoryId: weapon.id,
    attribute,
    skill,
    damage: weapon.damage,
    damageEffects: weapon.damageEffects,
    damageQualities: weapon.damageQualities,
    damageType: weapon.damageType,
    ...(weapon.fireRate !== null ? { fireRate: weapon.fireRate } : {}),
    range: weapon.range
  };
}


function normalize(value) {
  return String(value ?? "").trim().replace(/:$/, "").toLowerCase();
}
function linkTarget(value) {
  if (typeof value !== "string" || !value.trim()) throw new Error("A mod needs an item link.");
  return value.trim().replace(/^\[\[/, "").replace(/\]\]$/, "").split("|")[0].split("#")[0].trim();
}
function qualityKey(value) {
  return normalize(String(value).replace(/\[\[([^|\]]+)(?:\|[^\]]+)?\]\]/g, "$1"));
}
// Sheet-compatible structured weapon modifiers; unknown mechanics fail visibly.
function weaponToken(raw) {
  const value = String(raw ?? "").trim(), link = value.match(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/);
  return (link ? link[1].split("/").pop().split("#")[0] : value)
    .replace(/\.md$/i, "").replace(/\s*\(-?\d+\).*$/, "").replace(/\s+(?:-?\d+|x)$/i, "").trim().toLowerCase();
}
function weaponList(raw) {
  const map = new Map();
  for (const text of String(raw ?? "").split(/,(?![^\[]*\]\])/).map(s => s.trim())) {
    if (!text || /^(?:-|—|none|n\/a)$/i.test(text)) continue;
    const key = weaponToken(text);
    const linkAlias = text.match(/\[\[[^\]|]+\|([^\]]+)\]\]/)?.[1];
    const number = text.match(/(?:\((-?\d+)\)|\s+(-?\d+))\s*$/) ||
      linkAlias?.match(/(?:\((-?\d+)\)|\s+(-?\d+))\s*$/);
    const entry = { text, number: number ? Number(number[1] ?? number[2]) : null };
    if (key === "piercing" && map.has(key)) map.get(key).number = (map.get(key).number ?? 1) + (entry.number ?? 1);
    else if (!map.has(key)) map.set(key, entry);
  }
  return map;
}
function weaponOperation(map, raw) {
  const match = raw.trim().match(/^(Gain|Remove)\s+(.+)$/i);
  if (!match) throw new Error("Unsupported weapon list operation: " + raw);
  const parsed = weaponList(match[2]), key = [...parsed.keys()][0], entry = parsed.get(key);
  if (!entry) return;
  const old = map.get(key), gain = match[1].toLowerCase() === "gain";
  if (!gain) {
    if (old && key === "piercing" && entry.number != null) {
      old.number = (old.number ?? 1) - entry.number;
      if (old.number <= 0) map.delete(key);
    } else map.delete(key);
    return;
  }
  if (old) { if (key === "piercing") old.number = (old.number ?? 1) + (entry.number ?? 1); return; }
  const opposite = { accurate:"inaccurate", inaccurate:"accurate", reliable:"unreliable", unreliable:"reliable" }[key];
  if (opposite && map.has(opposite)) { map.delete(opposite); return; }
  if (key === "piercing") entry.number ??= 1;
  map.set(key, entry);
}
function weaponListText(map) {
  return [...map].map(([key, entry]) => key === "piercing"
    ? entry.text.replace(/(\[\[[^\]|]+\|)([^\]]+)(\]\])/g, (_, start, alias, end) =>
        start + alias.replace(/\s*(?:\(-?\d+\)|\s+-?\d+)\s*$/, "") + end)
      .replace(/\s*(?:\(-?\d+\)|\s+-?\d+)\s*$/, "") + " (" + (entry.number ?? 1) + ")" : entry.text).join(", ");
}
function applyWeaponMods(weapon, mods) {
  const qualities = weaponList(weapon.damageQualities), effects = weaponList(weapon.damageEffects);
  let damageBase = weapon.damage, rateDelta = 0, rangeDelta = 0;
  const damageDeltas = [];
  for (const mod of mods) {
    for (const effect of mod.effects ?? []) {
      const kind = normalize(effect.name), value = String(effect.desc ?? "").trim();
      if (!kind) continue;
      if (kind === "change base damage to" || kind === "damage") {
        const match = value.replace(/\s/g, "").match(kind === "damage" ? /^([+-]\d+)d6$/i : /^(\d+)d6$/i);
        if (!match) throw new Error("Invalid weapon damage modifier: " + value);
        if (kind === "damage") damageDeltas.push(Number(match[1])); else damageBase = Number(match[1]);
      } else if (kind === "fire rate" || kind === "range") {
        if (!/^[+-]?\d+$/.test(value)) throw new Error("Invalid " + kind + ": " + value);
        if (kind === "fire rate") rateDelta += Number(value); else rangeDelta += Number(value);
      } else if (kind === "change ammo type") weapon.ammo = value;
      else if (["change damage type", "change damage type to", "damage type"].includes(kind)) weapon.damageType = value;
      else if (kind === "weapon qualities" || kind === "weapon damage effects") {
        for (const op of value.split(/,(?![^\[]*\]\])/)) weaponOperation(kind === "weapon qualities" ? qualities : effects, op);
      } else throw new Error("Unsupported weapon mod effect: " + effect.name);
    }
    for (const key of ["weight", "cost"]) {
      const value = String(mod[key] ?? "").trim();
      if (!value || value === "-") continue;
      if (!/^[+-]?\d+(?:\.\d+)?$/.test(value)) throw new Error("Invalid mod " + key + ": " + value);
      weapon[key] = (weapon[key] ?? 0) + Number(value);
    }
    if (mod.gameEffects && mod.gameEffects !== "-") weapon.gameEffects = [weapon.gameEffects, mod.gameEffects].filter(Boolean).join("\n\n");
  }
  weapon.damage = damageDeltas.reduce((n, delta) => Math.max(0, n + delta), damageBase);
  weapon.fireRate = Math.max(0, (weapon.fireRate ?? (Number(weapon.data?.rate) || 0)) + rateDelta);
  const ladder = ["", "C", "M", "L", "X"], start = Math.max(0, ladder.indexOf(String(weapon.range).toUpperCase()));
  weapon.range = ladder[Math.max(0, Math.min(ladder.length - 1, start + rangeDelta))];
  for (const [a,b] of [["reliable","unreliable"],["accurate","inaccurate"]]) if (qualities.has(a) && qualities.has(b)) { qualities.delete(a); qualities.delete(b); }
  weapon.damageQualities = weaponListText(qualities);
  weapon.damageEffects = weaponListText(effects);
}

// Human skill defaults. Manual attacks retain their explicit attribute/skill.
const SKILL_ATTRIBUTES = Object.freeze({
  Athletics: "STR", Barter: "CHA", "Big Guns": "END",
  "Energy Weapons": "PER", Explosives: "PER", Lockpick: "PER",
  Medicine: "INT", "Melee Weapons": "STR", Pilot: "PER", Repair: "INT",
  Science: "INT", "Small Guns": "AGI", Sneak: "AGI", Speech: "CHA",
  Survival: "END", Throwing: "AGI", Unarmed: "STR"
});

// Produce a detached render model; never mutate the supplied NPC or vault notes.
// Only inventory entries referenced by attacks are loaded in this phase.
async function resolveNpcAttacks({ app, obsidian, npc, sourcePath = "", readItem }) {
  if (!npc || typeof npc !== "object" || Array.isArray(npc)) {
    throw new Error("NPC data must be an object.");
  }
  const copy = JSON.parse(JSON.stringify(npc));
  if (copy.attacks != null && !Array.isArray(copy.attacks)) {
    throw new Error("NPC attacks must be a list.");
  }
  if (copy.inventory != null && !Array.isArray(copy.inventory)) {
    throw new Error("NPC inventory must be a list.");
  }
  const entries = new Map();
  for (const entry of copy.inventory ?? []) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error("Each inventory entry must be an object.");
    }
    if (entry.id == null) continue;
    if (entries.has(entry.id)) throw new Error(`Duplicate inventory id: ${entry.id}`);
    entries.set(entry.id, entry);
  }
  const resolved = new Map();
  const attacks = [];
  for (const attack of copy.attacks ?? []) {
    if (!attack || typeof attack !== "object" || Array.isArray(attack)) {
      throw new Error("Each attack must be an object.");
    }
    if (attack.inventoryId == null) {
      attacks.push(attack);
      continue;
    }
    const entry = entries.get(attack.inventoryId);
    if (!entry) throw new Error(`Attack ${attack.id ?? ""}: inventory id not found: ${attack.inventoryId}`);
    if (!resolved.has(entry.id)) {
      try {
        const weapon = await resolveWeapon({ app, obsidian, entry, sourcePath, readItem });
        // The parsed source's allowed-mod catalogue is not part of the render model.
        delete weapon.data;
        resolved.set(entry.id, weapon);
      } catch (error) {
        throw new Error(`Attack ${attack.id ?? attack.inventoryId}: ${error.message ?? error}`);
      }
    }
    const weapon = resolved.get(entry.id);
    const skill = attack.skill ?? weapon.skill;
    const creatureSkill = {
      meleeskill: "meleeSkill", gunsskill: "gunsSkill", otherskill: "otherSkill"
    }[normalize(skill)];
    const attribute = attack.attribute ?? (creatureSkill ? "bodyAttribute" :
      Object.entries(SKILL_ATTRIBUTES).find(([name]) => normalize(name) === normalize(skill))?.[1]);
    if (!attribute) throw new Error(`No default attribute for skill: ${skill}. Set attack.attribute explicitly.`);
    const generated = makeWeaponAttack(weapon, {
      attribute, skill, name: attack.name ?? weapon.name
    });
    // Explicit attack fields can override the generated profile, including zero/empty values.
    // A legacy desc would bypass the structured callback, so cannot be used here.
    const { desc, ...overrides } = attack;
    if (desc != null) throw new Error(`Inventory attack ${attack.id ?? attack.inventoryId} cannot also have desc. Use a manual attack for descriptive profiles.`);
    attacks.push({ ...generated, ...overrides });
  }
  copy.attacks = attacks;
  return { npc: copy, resolvedWeapons: [...resolved.values()] };
}


// Fantasy Statblocks encodes wikilinks before passing data to callbacks.
function restoreLinks(value) {
  if (typeof value === "string") return value
    .replace(/<STATBLOCK-WIKI-LINK>([\s\S]*?)<STATBLOCK-WIKI-LINK>/g, "[[$1]]")
    .replace(/<STATBLOCK-MARKDOWN-LINK>([^|<>]+)(?:\|([^<>]*))?<STATBLOCK-MARKDOWN-LINK>/g,
      (_, path, alias) => `[${alias ?? ""}](${path})`);
  if (Array.isArray(value)) return value.map(restoreLinks);
  if (value && typeof value === "object") return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, restoreLinks(item)]));
  return value;
}

// Resolve weapon and apparel names for inventory; ordinary gear remains a linked row.
async function resolveNpcInventory({ app, npc, sourcePath, readItem }) {
  if (!Array.isArray(npc.inventory)) throw new Error("NPC inventory must be a list.");
  const weaponIds = new Set((npc.attacks ?? []).map(a => a.inventoryId).filter(id => id != null));
  const rows = [];
  for (const entry of npc.inventory) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error("Each inventory entry must be an object.");
    }
    const row = JSON.parse(JSON.stringify(entry));
    try {
      const linked = typeof entry.item === "string" && /^\[\[.*\]\]$/.test(entry.item.trim());
      if (linked) {
        const target = linkTarget(entry.item);
        const file = app.metadataCache.getFirstLinkpathDest(target, sourcePath);
        const isWeapon = weaponIds.has(entry.id) || /(?:^|\/)weapons(?:\/|$)/i.test(file?.path ?? "");
        if (isWeapon) {
          const weapon = await resolveWeapon({ app, obsidian: { parseYaml }, entry, sourcePath, readItem });
          row.displayItem = `[[${weapon.sourcePath}|${weapon.name}]]`;
          row.mods = weapon.mods;
        } else if (file && (/(?:^|\/)(?:apparel|armor)(?:\/|$)/i.test(file.path) || entry.mods?.length)) {
          const data = await readItem(file);
          if (data["dmg resistances"] != null) {
            const armor = await resolveArmorItem({ app, entry, sourcePath, readItem, data, file });
            row.displayItem = `[[${file.path}|${armor.name}]]`;
            row.mods = armor.mods;
            if (armor.powerArmor) row.armorHp = `HP: ${armor.hp}/${armor.maxHp}`;
          } else if (entry.name) row.displayItem = `[[${file.path}|${entry.name}]]`;
        } else if (entry.name && file) {
          row.displayItem = `[[${file.path}|${entry.name}]]`;
        }
      }
    } catch (error) {
      // Isolate resolution failures to the affected row.
      row.error = String(error.message ?? error);
    }
    rows.push(row);
  }
  return rows;
}

function formatInventory(rows) {
  if (!rows.length) return "-";
  const safe = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return rows.map(row => {
    const item = row.displayItem ?? row.name ?? row.item ?? "Unnamed item";
    const quantity = row.quantity ?? 1;
    const wealth = String(row.item ?? row.name ?? "").replace(/[*_]/g, "").trim().toLowerCase() === "wealth";
    const first = wealth
      ? `Wealth ${quantity}`
      : `${quantity} × ${safe(item)}${row.equipped === true ? " (Equipped)" : ""}`;
    const mods = Array.isArray(row.mods) ? row.mods.map(mod => {
      const slot = String(mod.slot ?? "").trim();
      const name = mod.item ?? mod.name ?? "Unknown mod";
      return `${slot ? safe(slot) + ": " : ""}${safe(name)}`;
    }).join(" · ") : "";
    const lines = [first, mods ? `Mods: ${mods}` : "", row.armorHp ?? ""];
    if (row.error) lines.push(`Item could not be resolved: ${safe(row.error).replace(/[\r\n]+/g, " ")}`);
    return lines.filter(Boolean).join("  \n");
  }).join("\n\n");
}

const BODY_LOCATIONS = ["Head", "Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg"];
const DR_FIELDS = { phys_dr: "Physical", energy_dr: "Energy", rad_dr: "Radiation", poison_dr: "Poison" };
function locationNames(text) {
  const parts = (Array.isArray(text) ? text : String(text ?? "").split(/[,;/]/)).map(value => normalize(value).replace(/\s+/g, " ")).filter(Boolean);
  const result = new Set();
  for (const part of parts) {
    const names = {
      all: BODY_LOCATIONS, any: BODY_LOCATIONS, thruster: BODY_LOCATIONS, optics: ["Head"], "main body": ["Torso"], helmet: ["Head"], frame: BODY_LOCATIONS, chassis: BODY_LOCATIONS, body: BODY_LOCATIONS, head: ["Head"], torso: ["Torso"], chest: ["Torso"],
      arm: ["Left Arm", "Right Arm"], arms: ["Left Arm", "Right Arm"],
      leg: ["Left Leg", "Right Leg"], legs: ["Left Leg", "Right Leg"],
      "left arm": ["Left Arm"], "right arm": ["Right Arm"],
      "left leg": ["Left Leg"], "right leg": ["Right Leg"]
    }[part];
    if (!names) throw new Error(`Unsupported armor location: ${part || "(empty)"}`);
    names.forEach(name => result.add(name));
  }
  if (!result.size) throw new Error("Armor has no locations.");
  return [...result];
}
function resistanceNumber(value) {
  const text = String(value ?? "").trim();
  if (text === "-") return 0;
  if (/^immune$/i.test(text)) return Infinity;
  if (!/^\d+$/.test(text)) throw new Error(`Unsupported resistance value: ${text || "(empty)"}`);
  return Number(text);
}
// Adapted from Character-Sheet-6.84's apparel workbench parser/recalculator.
// Here only selected notes are loaded; crafting and character-sheet storage are not used.
const LEGENDARY_APPAREL_FOLDERS = [
  "Fallout-RPG/Items/Mods/Legendary Mods/Apparel/",
  "Fallout-RPG/Items/Mods/Legendary Mods/CustomApparel/"
];
function armorAdjustment(value, label, fractional = false) {
  const text = String(value ?? "").trim();
  if (!text || text === "-") return 0;
  if (!((fractional ? /^[+-]?\d+(?:\.\d+)?$/ : /^[+-]?\d+$/).test(text))) {
    throw new Error(`Unsupported armor ${label}: ${text}`);
  }
  return Number(text);
}
function armorResistanceFields(data, delta = false) {
  const result = { phys_dr: 0, energy_dr: 0, rad_dr: 0, poison_dr: 0 };
  const traits = data["dmg resistances"];
  if (traits == null || traits === "" || traits === "-") return result;
  if (!Array.isArray(traits)) throw new Error("Armor dmg resistances must be a list.");
  for (const trait of traits) {
    const field = Object.keys(DR_FIELDS).find(key => normalize(DR_FIELDS[key]) === normalize(trait.name));
    if (!field) throw new Error(`Unsupported damage resistance type: ${trait.name}`);
    result[field] = /^immune$/i.test(String(trait.desc ?? "").trim()) ? Infinity :
      delta ? armorAdjustment(trait.desc, trait.name + " DR") : resistanceNumber(trait.desc);
  }
  return result;
}
async function resolveArmorItem({ app, entry, sourcePath = "", readItem, data, file }) {
  if (!data) {
    file = app.metadataCache.getFirstLinkpathDest(linkTarget(entry.item), sourcePath);
    if (!file || file.extension !== "md") throw new Error(`Cannot find armor: ${entry.item}`);
    data = await readItem(file);
  }
  if (data["dmg resistances"] == null) throw new Error(`Item has no armor profile: ${entry.item}`);
  if (entry.mods != null && !Array.isArray(entry.mods)) throw new Error("Installed armor mods must be a list.");
  const baseValues = armorResistanceFields(data);
  const values = { ...baseValues };
  const multipliers = data["mod multipliers"] ?? {};
  const multiplier = key => {
    const value = Number(multipliers[key]);
    return Number.isFinite(value) && value > 0 ? value : 1;
  };
  const result = {
    name: entry.name || data.name || file?.basename || entry.item,
    sourcePath: file?.path ?? "", category: data.category,
    locations: data.locations, values, mods: [],
    weight: String(data.weight ?? "").trim() === "<1" ? 0 : armorAdjustment(data.weight, "weight", true),
    cost: armorAdjustment(data.cost, "cost"),
    hp: armorAdjustment(data.hp, "HP"),
    gameEffects: typeof data.gameEffects === "string" ? data.gameEffects.trim() : ""
  };
  const usedSlots = new Set(), usedFiles = new Set(), prefixes = [];
  let legendary = false;
  for (const installed of entry.mods ?? []) {
    if (!installed || typeof installed !== "object") throw new Error("Each installed armor mod must have a slot and item.");
    const target = linkTarget(installed.item);
    const modFile = app.metadataCache.getFirstLinkpathDest(target, file?.path ?? sourcePath);
    if (!modFile || modFile.extension !== "md") throw new Error(`Cannot find armor mod: ${target}`);
    if (usedFiles.has(modFile.path)) throw new Error(`Duplicate installed armor mod: ${target}`);
    usedFiles.add(modFile.path);
    const isLegendary = LEGENDARY_APPAREL_FOLDERS.some(folder => modFile.path.startsWith(folder));
    const slotKey = normalize(installed.slot);
    if (!slotKey) throw new Error(`Armor mod needs a slot: ${target}`);
    if (!isLegendary) {
      const slots = Array.isArray(data.mods) ? data.mods : [];
      const slot = slots.find(candidate => normalize(candidate.name) === slotKey);
      if (!slot) throw new Error(`Unknown armor mod slot: ${installed.slot}`);
      if (usedSlots.has(slotKey)) throw new Error(`More than one armor mod in slot: ${installed.slot}`);
      usedSlots.add(slotKey);
      // Match source targets via Obsidian, not a possibly duplicated alias/display name.
      const allowed = [...String(slot.desc ?? "").matchAll(/\[\[([^\]]+)\]\]/g)]
        .some(match => app.metadataCache.getFirstLinkpathDest(linkTarget(match[0]), file?.path ?? sourcePath)?.path === modFile.path);
      if (!allowed) throw new Error(`${installed.item} is not allowed in armor slot ${installed.slot}.`);
    } else {
      // Legendary properties are a separate multi-selection list in the sheet.
      if (!["legendary", "legendary mod", "legendary mods"].includes(slotKey)) {
        throw new Error(`Use slot Legendary for legendary armor mod: ${target}`);
      }
      legendary = true;
    }
    const mod = await readItem(modFile);
    const deltas = armorResistanceFields(mod, true);
    for (const field of Object.keys(DR_FIELDS)) {
      values[field] = values[field] === Infinity || deltas[field] === Infinity ? Infinity : values[field] + deltas[field];
    }
    const coverage = mod.locations == null || String(mod.locations).trim() === "" ? [] : locationNames(mod.locations);
    const torsoOnly = coverage.length === 1 && coverage[0] === "Torso";
    const cost = armorAdjustment(mod.cost, "mod cost") * (torsoOnly ? 1 : multiplier("cost"));
    const weight = armorAdjustment(mod.weight, "mod weight", true) * (torsoOnly ? 1 : multiplier("weight"));
    result.cost += cost;
    result.weight += weight;
    result.hp += armorAdjustment(mod.hp, "mod HP");
    const displayName = String(mod["mod name"] || mod.mod || modFile.basename);
    const prefix = String(mod["name prefix"] || (isLegendary ? displayName : "")).trim();
    if (prefix && prefix !== "-") prefixes.push({ legendary: isLegendary, text: prefix });
    const gameEffects = typeof mod.gameEffects === "string" ? mod.gameEffects.trim() : "";
    result.mods.push({ slot: installed.slot, item: installed.item, sourcePath: modFile.path,
      name: displayName, legendary: isLegendary, deltas, cost, weight, gameEffects });
    if (gameEffects && gameEffects !== "-") result.gameEffects = [result.gameEffects, gameEffects].filter(Boolean).join("\n\n");
  }
  if (legendary) for (const field of ["phys_dr", "energy_dr"]) {
    if (values[field] !== Infinity) values[field] += 1;
  }
  result.powerArmor = /power\s*armor/i.test(String(data.category ?? "")) || /power armor/i.test(file?.path ?? "");
  result.maxHp = Math.max(0, result.hp);
  result.hp = result.powerArmor && entry.hp != null && String(entry.hp).trim() !== "" ? armorAdjustment(entry.hp, "current HP") : result.maxHp;
  if (result.hp < 0 || result.hp > result.maxHp) throw new Error("Power armor HP must be between 0 and " + result.maxHp);
  for (const [field, key] of [["phys_dr","phys"],["energy_dr","en"],["rad_dr","rad"]]) {
    const loss = armorAdjustment(entry.breaking?.[key], "breaking");
    if (loss < 0) throw new Error("Breaking cannot be negative.");
    if (values[field] !== Infinity) values[field] = Math.max(0, values[field] - loss);
  }
  result.weight = Math.max(0, result.weight);
  prefixes.sort((a, b) => Number(b.legendary) - Number(a.legendary));
  result.name = entry.name || [...prefixes.map(prefix => prefix.text), data.name || file?.basename || entry.item].join(" ");
  return result;
}

async function resolveNpcArmor({ app, npc, sourcePath, readItem }) {
  const values = Object.fromEntries(Object.keys(DR_FIELDS).map(field => [field,
    Object.fromEntries(BODY_LOCATIONS.map(location => [location, 0]))]));
  const sources = [];
  const profiles = [];
  const notices = [];
  const occupiedByMode = { normal: new Set(), power: new Set() };
  const weaponIds = new Set((npc.attacks ?? []).map(attack => attack.inventoryId).filter(id => id != null));
  const isCreature = npc.bodyAttribute != null || /creature/i.test(String(npc.type ?? ""));
  if (npc.inventory != null && !Array.isArray(npc.inventory)) throw new Error("NPC inventory must be a list.");
  for (const entry of npc.inventory ?? []) {
    if (entry.equipped !== true || weaponIds.has(entry.id)) continue;
    const inlineArmor = entry["dmg resistances"] != null;
    // Plain-text custom gear has no database armor profile to infer.
    if (!inlineArmor && (typeof entry.item !== "string" || !/^\[\[.*\]\]$/.test(entry.item.trim()))) continue;
    let file;
    let data;
    if (inlineArmor) data = entry;
    else {
      const target = linkTarget(entry.item);
      file = app.metadataCache.getFirstLinkpathDest(target, sourcePath);
      if (!file) throw new Error(`Cannot find equipped item: ${target}`);
      if (/(?:^|\/)weapons(?:\/|$)/i.test(file.path)) continue;
      data = await readItem(file);
    }
    if (data["dmg resistances"] == null) continue; // Equipped gear without armor data.
    if (!Array.isArray(data["dmg resistances"])) throw new Error(`Invalid dmg resistances in ${file?.path ?? entry.item}`);
    if (entry.mods != null && !Array.isArray(entry.mods)) throw new Error("Installed armor mods must be a list.");
    const armor = await resolveArmorItem({ app, entry, sourcePath, readItem, data, file });
    const quantity = Number(entry.quantity ?? 1);
    if (!Number.isInteger(quantity) || quantity < 0) throw new Error(`Invalid armor quantity: ${entry.quantity}`);
    if (quantity === 0) continue;
    let locations = locationNames(data.locations);
    const locationKey = normalize(data.locations);
    const occupied = occupiedByMode[armor.powerArmor ? "power" : "normal"];
    const clothing = /clothing|outfit/i.test(String(data.category ?? ""));
    // A singular Arm/Leg denotes one piece; quantity 2 supplies the pair.
    if (!clothing && (locationKey === "arm" || locationKey === "leg")) {
      const available = locations.filter(location => !occupied.has(location));
      locations = available.slice(0, quantity);
      if (locations.length < quantity) notices.push(`Extra ${data.name ?? entry.item} pieces exceed the available ${locationKey} locations and were not counted.`);
    }
    if (!clothing && !["frame", "chassis", "body", "all"].includes(locationKey)) locations.forEach(location => occupied.add(location));
    profiles.push({ armor, locations });
  }
  const powerMode = profiles.some(p => p.armor.powerArmor);
  for (const { armor, locations } of profiles.filter(p => !powerMode || p.armor.powerArmor)) {
    const itemValues = armor.values;
    for (const field of Object.keys(DR_FIELDS)) for (const location of locations) {
      values[field][location] = Math.max(values[field][location], itemValues[field]);
    }
    sources.push({ name: armor.name, locations, values: itemValues, mods: armor.mods });
  }
  return { values, sources, notices, skipComparison: isCreature && sources.length === 0 };
}
function summarizeDr(values) {
  const groups = new Map();
  for (const location of BODY_LOCATIONS) {
    const value = values[location];
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(location);
  }
  return [...groups].map(([value, locations]) => {
    let labels = [...locations];
    for (const limb of ["Arm", "Leg"]) if (labels.includes(`Left ${limb}`) && labels.includes(`Right ${limb}`)) {
      labels = labels.filter(name => name !== `Right ${limb}`).map(name => name === `Left ${limb}` ? `${limb}s` : name);
    }
    return `${value === Infinity ? "Immune" : value} (${locations.length === BODY_LOCATIONS.length ? "All" : labels.join(", ")})`;
  }).join("\n");
}
function parseListedDr(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const result = Object.fromEntries(BODY_LOCATIONS.map(location => [location, null]));
  const regex = /(Immune|-|\d+)\s*(?:\(([^)]*)\))?/gi;
  let end = 0, match, count = 0;
  while ((match = regex.exec(text))) {
    if (!/^[\s,;]*$/.test(text.slice(end, match.index))) throw new Error("Unrecognized listed DR format.");
    const number = resistanceNumber(match[1]);
    for (const location of locationNames(match[2] ?? "All")) result[location] = number;
    end = regex.lastIndex; count++;
  }
  if (!count || !/^[\s,;]*$/.test(text.slice(end)) || Object.values(result).some(v => v === null)) {
    throw new Error("Listed DR does not specify all locations in a supported format.");
  }
  return result;
}
function escapeDrHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function formatDr(result, npc, field) {
  const listed = npc[field];
  const hasListed = listed != null && String(listed).trim() !== "";
  if (result.skipComparison) return hasListed ? String(listed) : "-";
  const calculated = summarizeDr(result.values[field]);
  const details = [
    "Equipment DR uses the highest value per location and damage type; armor/clothing are not added together.",
    ...result.sources.map(source => `${source.name}${source.mods?.length ? " [" + source.mods.map(mod => mod.name).join(", ") + "]" : ""}: ${source.values[field] === Infinity ? "Immune" : source.values[field]} (${source.locations.join(", ")})`),
    ...result.notices,
    "Ability effects and intrinsic DR are not included."
  ].join("\n");
  if (!hasListed) return `<span title="${escapeDrHtml(details)}">${escapeDrHtml(calculated)}</span>`;
  let mismatch = false;
  let reason = "";
  try {
    const parsed = parseListedDr(listed);
    mismatch = BODY_LOCATIONS.some(location => parsed[location] !== result.values[field][location]);
  } catch (error) { mismatch = true; reason = "Could not fully compare the listed DR format. "; }
  const tooltip = [
    `Calculated: ${calculated}`,
    `Listed: ${listed}`,
    reason,
    details
  ].filter(Boolean).join("\n");
  const displayed = `<span title="${escapeDrHtml(tooltip)}">${escapeDrHtml(calculated)}</span>`;
  if (!mismatch && !result.notices.length) return displayed;
  return displayed + ` <span class="npc-dr-warning" tabindex="0" aria-label="Calculated and listed DR differ or need review" title="${escapeDrHtml(tooltip)}">⚠</span>`;
}

class AttackView extends MarkdownRenderChild {
  constructor(el, owner, request, sourcePath) {
    super(el);
    this.owner = owner;
    this.request = request;
    this.sourcePath = sourcePath;
    this.dependencies = new Set();
    this.version = 0;
    this.dead = false;
    this.paintQueue = Promise.resolve();
  }
  onload() { this.refresh(); }
  async paint(markdown, version) {
    // Serialize paints to prevent an old Markdown render finishing after a newer one.
    this.paintQueue = this.paintQueue.catch(() => {}).then(async () => {
      if (this.dead || version !== this.version) return;
      this.containerEl.replaceChildren();
      this.containerEl.removeAttribute("aria-busy");
      if (this.markdownOwner) this.removeChild(this.markdownOwner);
      this.markdownOwner = new MarkdownRenderChild(this.containerEl);
      this.addChild(this.markdownOwner);
      await MarkdownRenderer.render(this.owner.app, restoreLinks(markdown), this.containerEl,
        this.sourcePath, this.markdownOwner);
    });
    return this.paintQueue;
  }
  async refresh() {
    const version = ++this.version;
    const { npc, format, kind, field } = this.request;
    try {
      const manual = (npc.attacks ?? []).filter(a => a.inventoryId == null);
      const initial = kind === "dr" ? (npc[field] == null ? "" : escapeDrHtml(npc[field])) : kind === "inventory" ? "" : format(manual);
      await this.paint([initial, "Loading equipment…"].filter(Boolean).join("\n\n"), version);
      if (this.dead || version !== this.version) return;
      this.containerEl.setAttribute("aria-busy", "true");
      // Retain old dependencies until this pass completes so in-flight edits can invalidate it.
      const dependencies = new Set();
      const resolve = kind === "dr" ? resolveNpcArmor : kind === "inventory" ? resolveNpcInventory : resolveNpcAttacks;
      const result = await resolve({
        app: this.owner.app, obsidian: { parseYaml }, npc,
        sourcePath: this.sourcePath,
        readItem: file => {
          dependencies.add(file.path);
          this.dependencies.add(file.path);
          return this.owner.readItem(file);
        }
      });
      if (this.dead || version !== this.version) return;
      this.dependencies = dependencies;
      await this.paint(kind === "dr" ? formatDr(result, npc, field) : format(kind === "inventory" ? result : result.npc.attacks), version);
    } catch (error) {
      if (this.dead || version !== this.version) return;
      console.error("Fallout NPC weapon resolution:", error);
      const manual = (npc.attacks ?? []).filter(a => a.inventoryId == null);
      await this.paint(kind === "dr" ? escapeDrHtml(npc[field] ?? "-") : kind === "inventory" ? "" : format(manual), version);
      if (this.dead || version !== this.version) return;
      const warning = this.containerEl.ownerDocument.createElement("p");
      warning.textContent = (kind === "dr" ? "Armor calculation unavailable: " : kind === "inventory" ? "Inventory data unavailable: " : "Weapon data unavailable: ") + String(error.message ?? error);
      this.containerEl.appendChild(warning);
    }
  }
  onunload() {
    this.dead = true;
    this.version++;
    this.owner.views.delete(this);
  }
}

module.exports = class FalloutNpcItems extends Plugin {
  onload() {
    this.cache = new Map();
    this.pending = new Map();
    this.requests = new Map();
    this.contexts = new WeakMap();
    this.views = new Set();
    this.serial = 0;
    this.stopped = false;
    this.refreshTimer = null;
    const requestView = (npc, format, kind, field) => {
      const token = String(++this.serial);
      this.requests.set(token, { npc: restoreLinks(JSON.parse(JSON.stringify(npc))), format, kind, field });
      while (this.requests.size > 128) this.requests.delete(this.requests.keys().next().value);
      return `<div class="fallout-npc-${kind === "dr" ? "dr" : kind === "inventory" ? "inventory" : "attack"}-output" data-fallout-npc-request="${token}" aria-live="polite">Loading equipment…</div>`;
    };
    const bridge = {
      renderAttacks: (npc, format) => requestView(npc, format, "attacks"),
      renderInventory: npc => requestView(npc, formatInventory, "inventory"),
      renderDr: (npc, field) => {
        if (!Object.hasOwn(DR_FIELDS, field)) throw new Error("Unknown DR field: " + field);
        return requestView(npc, null, "dr", field);
      }
    };
    window.FalloutNpcItems = bridge;
    this.registerMarkdownPostProcessor((el, ctx) => {
      this.contexts.set(el, ctx);
      this.mount(el);
    });
    // Fantasy Statblocks inserts its rendered Markdown asynchronously.
    // Observe only added markers; no vault scan and no whole-page replacement.
    const observer = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) {
        if (node.nodeType === 1) this.mount(node);
      }
      for (const view of this.views) {
        if (!view.containerEl.isConnected) view.unload();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    this.register(() => {
      this.stopped = true;
      observer.disconnect();
      clearTimeout(this.refreshTimer);
      for (const view of [...this.views]) view.unload();
      this.requests.clear(); this.cache.clear(); this.pending.clear();
      if (window.FalloutNpcItems === bridge) delete window.FalloutNpcItems;
    });
    const invalidate = (file, oldPath) => {
      this.cache.delete(file.path);
      this.pending.delete(file.path);
      if (oldPath) { this.cache.delete(oldPath); this.pending.delete(oldPath); }
      // Debounce affected open views. Events themselves perform no file reads.
      for (const view of this.views) {
        if (view.dependencies.has(file.path) || (oldPath && view.dependencies.has(oldPath))) {
          view.needsRefresh = true;
        }
      }
      clearTimeout(this.refreshTimer);
      this.refreshTimer = setTimeout(() => {
        if (this.stopped) return;
        for (const view of this.views) if (view.needsRefresh && !view.dead) {
          view.needsRefresh = false;
          view.refresh();
        }
      }, 100);
    };
    this.registerEvent(this.app.vault.on("modify", file => invalidate(file)));
    this.registerEvent(this.app.vault.on("delete", file => invalidate(file)));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => invalidate(file, oldPath)));
  }

  mount(root) {
    const selector = "[data-fallout-npc-request]";
    const markers = [...(root.matches?.(selector) ? [root] : []), ...(root.querySelectorAll?.(selector) ?? [])];
    for (const marker of markers) {
      const request = this.requests.get(marker.dataset.falloutNpcRequest);
      if (!request || !marker.isConnected) continue;
      this.requests.delete(marker.dataset.falloutNpcRequest);
      delete marker.dataset.falloutNpcRequest;
      let ctx;
      for (let node = marker; node && !ctx; node = node.parentElement) ctx = this.contexts.get(node);
      const view = new AttackView(marker, this, request, ctx?.sourcePath ?? "");
      this.views.add(view);
      if (ctx?.addChild) ctx.addChild(view);
      else this.addChild(view);
    }
  }

  async readItem(file) {
    const path = file.path;
    const stamp = `${file.stat?.mtime ?? ""}:${file.stat?.size ?? ""}`;
    const cached = this.cache.get(path);
    if (cached?.stamp === stamp) {
      this.cache.delete(path); this.cache.set(path, cached);
      return JSON.parse(JSON.stringify(cached.data));
    }
    let record = this.pending.get(path);
    if (!record || record.stamp !== stamp) {
      record = { stamp };
      record.promise = (async () => {
        const text = await this.app.vault.cachedRead(file);
        const block = text.match(/^```statblock[^\r\n]*\r?\n([\s\S]*?)^```\s*$/m);
        if (!block) throw new Error(`No statblock code fence in ${path}.`);
        const data = parseYaml(block[1]);
        if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error(`Invalid item YAML in ${path}.`);
        if (!this.stopped && this.pending.get(path) === record) {
          this.cache.delete(path);
          this.cache.set(path, { stamp, data });
          // Bounded, in-memory LRU; raw note text is not retained.
          while (this.cache.size > 128) this.cache.delete(this.cache.keys().next().value);
        }
        return data;
      })();
      this.pending.set(path, record);
    }
    try { return JSON.parse(JSON.stringify(await record.promise)); }
    finally { if (this.pending.get(path) === record) this.pending.delete(path); }
  }
};
