// Import with JS-Engine's engine.importJs(). No vault files are modified.
export async function resolveWeapon({ app, obsidian, entry, sourcePath = "" }) {
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
  const text = await app.vault.read(file);
  const match = text.match(/^```statblock[^\r\n]*\r?\n([\s\S]*?)^```\s*$/m);
  if (!match) throw new Error(`No statblock code fence in ${file.path}.`);
  const data = obsidian.parseYaml(match[1]);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`Invalid weapon YAML in ${file.path}.`);
  }
  const diceMatch = String(data.damage_rating ?? "").trim().match(/^(\d+)\s*d6$/i);
  if (!diceMatch) throw new Error(`Unsupported damage_rating in ${file.path}: ${data.damage_rating}`);

  const numeric = key => {
    const value = data[key];
    if (value == null || String(value).trim() === "") return null;
    const number = Number(value);
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
  const usedSlots = new Set();
  const prefixes = [];
  let generatedName = data.name || file.basename;
  for (const installed of entry.mods ?? []) {
    const slotKey = normalize(installed.slot);
    if (!slotKey) throw new Error("Each mod needs a slot.");
    if (usedSlots.has(slotKey)) throw new Error(`More than one mod in slot: ${installed.slot}`);
    usedSlots.add(slotKey);
    const slot = (data.mods ?? []).find(s => normalize(s.name) === slotKey);
    if (!slot) throw new Error(`Unknown mod slot: ${installed.slot}`);
    const modTarget = linkTarget(installed.item);
    const modFile = app.metadataCache.getFirstLinkpathDest(modTarget, file.path);
    if (!modFile) throw new Error(`Cannot find mod: ${modTarget}`);
    const allowed = [...String(slot.desc ?? "").matchAll(/\[\[([^\]]+)\]\]/g)]
      .some(m => app.metadataCache.getFirstLinkpathDest(linkTarget(m[0]), file.path)?.path === modFile.path);
    if (!allowed) throw new Error(`${installed.item} is not allowed in ${installed.slot}.`);
    const modText = await app.vault.read(modFile);
    const block = modText.match(/^```statblock[^\r\n]*\r?\n([\s\S]*?)^```\s*$/m);
    if (!block) throw new Error(`No statblock code fence in ${modFile.path}.`);
    const mod = obsidian.parseYaml(block[1]);
    applyMod(weapon, mod);
    weapon.mods.push({ slot: installed.slot, item: installed.item, name: mod.mod || modFile.basename });
    const prefix = String(mod.prefix ?? mod["name prefix"] ?? "").trim();
    if (prefix && prefix !== "-") prefixes.push({ slot: slotKey, text: prefix });
    for (const rule of data.modNaming ?? []) {
      if (normalize(rule.slot) === slotKey && rule.replace) {
        generatedName = generatedName.replace(String(rule.replace), String(rule.with ?? ""));
      }
    }
  }
  // Use base weapon slot order so inventory list order does not change naming.
  const slots = (data.mods ?? []).map(s => normalize(s.name));
  prefixes.sort((a, b) => slots.indexOf(a.slot) - slots.indexOf(b.slot));
  weapon.name = entry.name || [...prefixes.map(p => p.text), generatedName].join(" ");
  return weapon;
}

export function makeWeaponAttack(weapon, { attribute, skill = weapon.skill, name = weapon.name }) {
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
// Deliberately limited to the fields demonstrated by the supplied two mods.
// Unsupported mechanical effects fail explicitly instead of yielding partial stats.
export function applyMod(weapon, mod) {
  for (const effect of mod.effects ?? []) {
    const kind = normalize(effect.name);
    const value = String(effect.desc ?? "").trim();
    if (kind === "range") {
      const ranges = ["C", "M", "L", "E"];
      const index = ranges.indexOf(String(weapon.range).toUpperCase());
      if (index < 0 || !/^[+-]\d+$/.test(value)) throw new Error(`Unsupported range effect: ${value}`);
      const next = index + Number(value);
      if (next < 0 || next >= ranges.length) throw new Error(`Range effect exceeds supported range: ${value}`);
      weapon.range = ranges[next];
    } else if (kind === "weapon qualities") {
      let qualities = String(weapon.damageQualities || "").split(/,\s*(?![^[]*\]\])/).map(s => s.trim()).filter(Boolean);
      for (const operation of value.split(/,\s*(?=(?:Gain|Remove)\s)/i)) {
        const match = operation.match(/^(Gain|Remove)\s+(.+)$/i);
        if (!match) throw new Error(`Unsupported quality effect: ${operation}`);
        const key = qualityKey(match[2]);
        if (match[1].toLowerCase() === "remove") qualities = qualities.filter(q => qualityKey(q) !== key);
        else if (!qualities.some(q => qualityKey(q) === key)) qualities.push(match[2].trim());
      }
      weapon.damageQualities = qualities.join(", ");
    } else {
      throw new Error(`Unsupported mod effect in this test: ${effect.name}`);
    }
  }
  for (const key of ["weight", "cost"]) {
    const value = String(mod[key] ?? "").trim();
    if (!value || value === "-") continue;
    if (!/^[+-]\d+(?:\.\d+)?$/.test(value) || weapon[key] == null) {
      throw new Error(`Unsupported mod ${key}: ${value}`);
    }
    weapon[key] += Number(value);
  }
  if (mod.gameEffects && mod.gameEffects !== "-") {
    weapon.gameEffects = [weapon.gameEffects, mod.gameEffects].filter(Boolean).join("\n\n");
  }
}

// Human skill defaults. Manual attacks retain their explicit attribute/skill.
export const SKILL_ATTRIBUTES = Object.freeze({
  Athletics: "STR", Barter: "CHA", "Big Guns": "END",
  "Energy Weapons": "PER", Explosives: "PER", Lockpick: "PER",
  Medicine: "INT", "Melee Weapons": "STR", Pilot: "PER", Repair: "INT",
  Science: "INT", "Small Guns": "AGI", Sneak: "AGI", Speech: "CHA",
  Survival: "END", Throwing: "AGI", Unarmed: "STR"
});

// Produce a detached render model; never mutate the supplied NPC or vault notes.
// Only inventory entries referenced by attacks are loaded in this phase.
export async function resolveNpcAttacks({ app, obsidian, npc, sourcePath = "" }) {
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
        const weapon = await resolveWeapon({ app, obsidian, entry, sourcePath });
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

