```js-engine
const VENDOR_SERVER_URL_KEY = "vaultkit_vendor_server_url";
const DEFAULT_VENDOR_SERVER_URL = "http://localhost:3000";

const WEAPON_MOD_FOLDERS = [
  "Fallout-RPG/Items/Mods/Weapon Mods"
];

const LEGENDARY_WEAPON_FOLDER =
  "Fallout-RPG/Legendary Item Creation/Legendary Weapons/Legendary Weapon Properties";

const ARMOR_MOD_FOLDERS = [
  "Fallout-RPG/Items/Mods/Apparel Mods",
  "Fallout-RPG/Items/Mods/Armor Mods",
  "Fallout-RPG/Items/Mods/Robot Mods"
];

const POWER_ARMOR_MOD_FOLDERS = [
  "Fallout-RPG/Items/Mods/Power Armor Mods"
];

const LEGENDARY_ARMOR_FOLDER =
  "Fallout-RPG/Legendary Item Creation/Legendary Armor Creation/Legendary Armor Properties";


const VENDOR_GENERATOR_PROFILES = [
  {
    id: "general_store",
    label: "General Store",
    categoryWeights: { FOOD: 20, CHEMS: 15, AMMO: 15, APPAREL: 15, WEAPONS: 15, MISC: 20 },
    guarantees: []
  },
  {
    id: "weapons_dealer",
    label: "Weapons Dealer",
    categoryWeights: { WEAPONS: 55, AMMO: 45, APPAREL: 0, FOOD: 0, CHEMS: 0, MISC: 0 },
    guarantees: ["WEAPONS", "AMMO"]
  },
  {
    id: "doctor",
    label: "Doctor / Clinic",
    categoryWeights: { FOOD: 0, CHEMS: 70, MISC: 15, APPAREL: 5, AMMO: 5, WEAPONS: 5 },
    guarantees: ["CHEMS"]
  },
  {
    id: "armorer_outfitter",
    label: "Armorer / Outfitter",
    categoryWeights: { APPAREL: 55, WEAPONS: 15, MISC: 15, FOOD: 5, CHEMS: 5, AMMO: 5 },
    guarantees: ["APPAREL"]
  },
  {
    id: "mechanic",
    label: "Mechanic / Utility",
    categoryWeights: { MISC: 55, WEAPONS: 15, APPAREL: 10, FOOD: 5, CHEMS: 5, AMMO: 10 },
    guarantees: ["MISC"]
  },
  {
    id: "cook",
    label: "Cook",
    categoryWeights: { MISC: 0, WEAPONS: 0, APPAREL: 0, FOOD: 95, CHEMS: 5, AMMO: 0 },
    guarantees: ["FOOD"]
  }
];

const VENDOR_GENERATOR_TIERS = [
  { id: "poor", label: "Poor", capsMin: 50, capsMax: 75, itemsMin: 8, itemsMax: 14 },
  { id: "average", label: "Average", capsMin: 150, capsMax: 450, itemsMin: 12, itemsMax: 35 },
  { id: "well_stocked", label: "Well Stocked", capsMin: 300, capsMax: 900, itemsMin: 16, itemsMax: 55 },
  { id: "elite", label: "Elite", capsMin: 600, capsMax: 1600, itemsMin: 20, itemsMax: 100 }
];

const VENDOR_GENERATOR_RARITY = [
  { id: "scarce", label: "Mostly Common", weights: { 0: 46, 1: 28, 2: 14, 3: 7, 4: 5, 5: 0, 6: 0 } },
  { id: "normal", label: "Balanced", weights: { 0: 34, 1: 24, 2: 18, 3: 12, 4: 7, 5: 3, 6: 2 } },
  { id: "generous", label: "Rare-Favored", weights: { 0: 24, 1: 20, 2: 18, 3: 14, 4: 10, 5: 8, 6: 3 } }
];

const VENDOR_GENERATOR_QTY_CLASSES = {
  single:       { min: 1,  max: 2,   cap: 3 },
  small_stack:  { min: 1,  max: 6,   cap: 12 },
  medium_stack: { min: 3,  max: 15,  cap: 30 },
  bulk:         { min: 20, max: 100, cap: 200 },
  charged_unit: { min: 1,  max: 4,   cap: 6 }
};

const VENDOR_GENERATOR_TIER_QTY = {
  poor: 0.45,
  average: 0.75,
  well_stocked: 1.0,
  elite: 1.25
};

const VENDOR_GENERATOR_RARITY_QTY = {
  0: 1.15, 1: 1.00, 2: 0.90, 3: 0.75, 4: 0.60, 5: 0.45, 6: 0.30
};

const VENDOR_LEGENDARY_RATES = {
  off: 0,
  rare: 0.02,
  normal: 0.05,
  frequent: 0.10
};

const LEGENDARY_WEAPON_TABLE_1 = {
  "Small Guns": {
    1:"Assassin's Weapon", 2:"Crippling", 3:"Deadeye", 4:"Defiant", 5:"Enraging",
    6:"Explosive", 7:"Exterminator's (Weapon)", 8:"Freezing", 9:"Ghoul Slayer's (Weapon)",
    10:"Hitman's", 11:"Hunter's Weapon", 12:"Incendiary (Weapon)", 13:"Instigating",
    14:"Irradiated", 15:"Junkie's", 16:"Kneecapper", 17:"Lucky (Weapon)"
  },
  "Energy Weapons": {
    1:"Assassin's Weapon", 2:"Crippling", 3:"Deadeye", 4:"Defiant", 5:"Enraging",
    6:"Exterminator's (Weapon)", 7:"Freezing", 8:"Ghoul Slayer's (Weapon)", 9:"Hitman's",
    10:"Hunter's Weapon", 11:"Instigating", 12:"Irradiated", 13:"Junkie's",
    14:"Kneecapper", 15:"Lucky (Weapon)"
  },
  "Big Guns": {
    1:"Assassin's Weapon", 2:"Crippling", 3:"Deadeye", 4:"Defiant", 5:"Enraging",
    6:"Exterminator's (Weapon)", 7:"Freezing", 8:"Ghoul Slayer's (Weapon)", 9:"Hitman's",
    10:"Hunter's Weapon", 11:"Instigating", 12:"Irradiated", 13:"Junkie's",
    14:"Kneecapper", 15:"Lucky (Weapon)"
  },
  "Melee Weapons": {
    1:"Assassin's Weapon", 2:"Berserker's", 3:"Blazing", 4:"Bloodied", 5:"Cavalier's (Weapon)",
    6:"Charged", 7:"Crippling", 8:"Duelist's (Weapon)", 9:"Enraging", 10:"Exterminator's (Weapon)",
    11:"Freezing", 12:"Frigid", 13:"Furious", 14:"Ghoul Slayer's (Weapon)", 15:"Hunter's Weapon",
    16:"Instigating", 17:"Irradiated", 18:"Junkie's", 19:"Kneecapper", 20:"Lucky (Weapon)"
  },
  "Unarmed Weapons": {
    1:"Assassin's Weapon", 2:"Berserker's", 3:"Bloodied", 4:"Cavalier's (Weapon)",
    5:"Crippling", 6:"Duelist's (Weapon)", 7:"Enraging", 8:"Exterminator's (Weapon)",
    9:"Freezing", 10:"Furious", 11:"Ghoul Slayer's (Weapon)", 12:"Hunter's Weapon",
    13:"Instigating", 14:"Irradiated", 15:"Junkie's", 16:"Kneecapper", 17:"Lucky (Weapon)"
  }
};

const LEGENDARY_WEAPON_TABLE_2 = {
  "Small Guns": {
    1:"Mutant Slayer's (Weapon)", 2:"Nimble", 3:"Nocturnal", 4:"Penetrating",
    5:"Plasma Infused", 6:"Poisoner's (Weapon)", 7:"Powerful Weapon", 8:"Quickdraw",
    9:"Rapid", 10:"Relentless", 11:"Staggering", 12:"Stalker's", 13:"Steadfast",
    14:"Troubleshooter's (Weapon)", 15:"Two-Shot", 16:"Violent", 17:"Wounding"
  },
  "Energy Weapons": {
    1:"Mutant Slayer's (Weapon)", 2:"Nimble", 3:"Nocturnal", 4:"Penetrating",
    5:"Poisoner's (Weapon)", 6:"Powerful Weapon", 7:"Quickdraw", 8:"Rapid",
    9:"Relentless", 10:"Staggering", 11:"Stalker's", 12:"Steadfast",
    13:"Troubleshooter's (Weapon)", 14:"Two-Shot", 15:"Wounding"
  },
  "Big Guns": {
    1:"Mutant Slayer's (Weapon)", 2:"Nimble", 3:"Nocturnal", 4:"Penetrating",
    5:"Poisoner's (Weapon)", 6:"Powerful Weapon", 7:"Quickdraw", 8:"Rapid",
    9:"Relentless", 10:"Staggering", 11:"Stalker's", 12:"Steadfast",
    13:"Troubleshooter's (Weapon)", 14:"Two-Shot", 15:"Wounding"
  },
  "Melee Weapons": {
    1:"Mighty", 2:"Mutant Slayer's (Weapon)", 3:"Nocturnal", 4:"Penetrating",
    5:"Poisoner's (Weapon)", 6:"Quickdraw", 7:"Relentless", 8:"Sentinel's (Weapon)",
    9:"Staggering", 10:"Troubleshooter's (Weapon)", 11:"Wounding"
  },
  "Unarmed Weapons": {
    1:"Mighty", 2:"Mutant Slayer's (Weapon)", 3:"Nocturnal", 4:"Penetrating",
    5:"Poisoner's (Weapon)", 6:"Quickdraw", 7:"Relentless", 8:"Sentinel's (Weapon)",
    9:"Staggering", 10:"Troubleshooter's (Weapon)", 11:"Wounding"
  }
};

const LEGENDARY_ARMOR_TABLE = {
  Head: {
    1:"Assassin's", 2:"Cloaking", 3:"Cryogenic", 4:"Cunning", 5:"Duelist's (Armor)",
    6:"Exterminator's (Armor)", 7:"Ghoul Slayer's (Armor)", 8:"Hunter's (Armor)",
    9:"Incendiary (Armor)", 10:"Lucky (Armor)", 11:"Martyr's", 12:"Mutant Slayer's (Armor)",
    13:"Poisoner's (Armor)", 14:"Powered", 15:"Rad Powered", 16:"Sharp Armor",
    17:"Sprinter's", 18:"Troubleshooter's (Armor)"
  },
  Arm: {
    1:"Assassin's", 2:"Cavalier's (Armor)", 3:"Champion", 4:"Cloaking", 5:"Cryogenic",
    6:"Duelist's (Armor)", 7:"Exterminator's (Armor)", 8:"Ghoul Slayer's (Armor)",
    9:"Hunter's (Armor)", 10:"Incendiary (Armor)", 11:"Lucky (Armor)", 12:"Martyr's",
    13:"Mutant Slayer's (Armor)", 14:"Poisoner's (Armor)", 15:"Powered", 16:"Rad Powered",
    17:"Safecracker's", 18:"Sentinel's (Armor)", 19:"Sharp Armor", 20:"Troubleshooter's (Armor)"
  },
  Torso: {
    1:"Assassin's", 2:"Auto Stim", 3:"Bolstering", 4:"Chameleon", 5:"Cloaking",
    6:"Cryogenic", 7:"Duelist's (Armor)", 8:"Exterminator's (Armor)",
    9:"Ghoul Slayer's (Armor)", 10:"Hunter's (Armor)", 11:"Incendiary (Armor)",
    12:"Lucky (Armor)", 13:"Martyr's", 14:"Mutant Slayer's (Armor)",
    15:"Poisoner's (Armor)", 16:"Punishing", 17:"Rad Powered", 18:"Sharp Armor",
    19:"Troubleshooter's (Armor)", 20:"Unyielding"
  },
  Leg: {
    1:"Acrobat's", 2:"Assassin's", 3:"Cloaking", 4:"Cryogenic", 5:"Cunning",
    6:"Duelist's (Armor)", 7:"Exterminator's (Armor)", 8:"Ghoul Slayer's (Armor)",
    9:"Hunter's (Armor)", 10:"Incendiary (Armor)", 11:"Lucky (Armor)", 12:"Martyr's",
    13:"Mutant Slayer's (Armor)", 14:"Poisoner's (Armor)", 15:"Powered", 16:"Punishing",
    17:"Rad Powered", 18:"Sharp Armor", 19:"Sprinter's", 20:"Troubleshooter's (Armor)"
  }
};

const VENDOR_GENERATOR_EXCLUDED_FOLDERS = [

  "Fallout-RPG/Items/Weapons/Unique",
  "Fallout-RPG/Items/Weapons/Custom",
  "Fallout-RPG/Items/Apparel/Unique",
  "Fallout-RPG/Items/Consumables/Quest",
  "Fallout-RPG/Items/Tools and Utilities/Books and Magazines"
];

function normalizeUrl(value) {
  return String(value || DEFAULT_VENDOR_SERVER_URL).trim().replace(/\/+$/, "");
}

function parseIntSafe(value, fallback = 0) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function stripWikiLink(value) {
  return String(value || "").trim().replace(/^\[\[/, "").replace(/\]\]$/, "").trim();
}

function normalizeInstanceName(value) {
  return String(value ?? "")
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1")
    .trim();
}

function appendVendorSourceLink(container, payload, aliasText = "") {
  const sourcePath = String(payload?.sourcePath || "").trim();
  const raw = String(
    payload?.name ||
    (payload?.yamlName ? `[[${payload.yamlName}]]` : "")
  ).trim();

  const target = sourcePath
    ? sourcePath.replace(/\.md$/i, "")
    : stripWikiLink(raw);

  if (!target) return;

  const sourceName = stripWikiLink(raw || payload?.yamlName || target.split("/").pop() || "Item");
  const visibleName = String(aliasText || "").trim() || sourceName;

  const a = document.createElement("a");
  a.className = "internal-link";
  a.textContent = visibleName;
  a.setAttribute("data-href", target);
  a.href = target;
  a.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    app.workspace.openLinkText(target, "", false);
  };
  container.appendChild(a);
}

function makeInstanceId(prefix = "inv") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function recognizedItemCategory(path) {
  const p = String(path || "");

  if (p.startsWith("Fallout-RPG/Items/Weapons/")) return "WEAPONS";
  if (p.startsWith("Fallout-RPG/Items/Apparel/")) return "APPAREL";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Food/")) return "FOOD";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Beverages/")) return "FOOD";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Chems/")) return "CHEMS";
  if (p.startsWith("Fallout-RPG/Items/Ammo/")) return "AMMO";
  if (p.startsWith("Fallout-RPG/Items/Tools and Utilities/")) return "MISC";

  return null;
}


function vendorModKind(payload) {
  const path = String(payload?.sourcePath || "");
  const category = String(payload?.category || "").toUpperCase();

  if (category === "WEAPONS" || path.startsWith("Fallout-RPG/Items/Weapons/")) {
    return "weapon";
  }

  if (category === "APPAREL" || path.startsWith("Fallout-RPG/Items/Apparel/")) {
    return path.includes("/Power Armor/") ? "powerArmor" : "armor";
  }

  return null;
}

function cleanQuotedValue(value) {
  return String(value ?? "").trim().replace(/^["']|["']$/g, "");
}

function parseSignedNumber(value) {
  const match = String(value ?? "").match(/[+-]?\d+(?:\.\d+)?/);
  if (!match) return 0;
  const n = Number(match[0]);
  return Number.isFinite(n) ? n : 0;
}


function normalizeVendorRarity(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 3;
  return Math.min(6, Math.max(0, Math.round(n)));
}

function xmur3Vendor(str) {
  let h = 1779033703 ^ String(str).length;
  for (let i = 0; i < String(str).length; i++) {
    h = Math.imul(h ^ String(str).charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32Vendor(a) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeVendorRng(seed) {
  return mulberry32Vendor(xmur3Vendor(String(seed))());
}

function vendorRollInt(rng, min, max) {
  return Math.min(min, max) + Math.floor(rng() * (Math.abs(max - min) + 1));
}

function vendorWeightedPick(rng, entries) {
  const total = entries.reduce((sum, entry) => sum + Math.max(0, Number(entry.w) || 0), 0);
  if (total <= 0) return null;

  let cursor = rng() * total;
  for (const entry of entries) {
    cursor -= Math.max(0, Number(entry.w) || 0);
    if (cursor <= 0) return entry.key;
  }

  return entries[entries.length - 1]?.key ?? null;
}

function isVendorGeneratorExcluded(sourcePath) {
  const path = String(sourcePath || "");
  return VENDOR_GENERATOR_EXCLUDED_FOLDERS.some(prefix => path.startsWith(prefix));
}


function normalizeVendorWeaponType(value) {
  const raw = String(value || "").toLowerCase();
  if (raw.includes("small gun")) return "Small Guns";
  if (raw.includes("energy")) return "Energy Weapons";
  if (raw.includes("big gun")) return "Big Guns";
  if (raw.includes("melee")) return "Melee Weapons";
  if (raw.includes("unarmed")) return "Unarmed Weapons";
  return "";
}

function getVendorCoreKind(item) {
  const name = String(item?.name || item?.yamlName || "").trim().toLowerCase();
  if (name === "fusion core") return "fusion";
  if (name === "plasma core") return "plasma";
  return "";
}

function inferVendorQuantityClass(item) {
  if (item?.vendorQtyClass && VENDOR_GENERATOR_QTY_CLASSES[item.vendorQtyClass]) {
    return item.vendorQtyClass;
  }

  if (getVendorCoreKind(item)) return "charged_unit";

  switch (String(item?.category || "").toUpperCase()) {
    case "WEAPONS":
    case "APPAREL":
      return "single";
    case "AMMO":
      return "bulk";
    case "CHEMS":
      return "small_stack";
    case "FOOD":
      return "medium_stack";
    case "MISC":
    default:
      return "small_stack";
  }
}

function rollFalloutCombatDie(rng) {
  const face = vendorRollInt(rng, 1, 6);
  return [0, 1, 2, 0, 0, 1, 1][face];
}

function rollFalloutCombatDice(rng, count) {
  const dice = Math.max(0, Math.floor(Number(count) || 0));
  let total = 0;
  for (let i = 0; i < dice; i++) total += rollFalloutCombatDie(rng);
  return total;
}

function rollAmmoQtyFound(rng, rawFormula) {
  let expr = String(rawFormula || '').trim();
  if (!expr) return null;

  expr = cleanQuotedValue(expr)
    .replace(/\s+/g, '')
    .replace(/[×X]/g, 'x');

  const rollTerm = term => {
    const value = String(term || '').replace(/^\(|\)$/g, '');

    if (/^\d+$/.test(value)) return Number(value);

    const simpleDice = value.match(/^(\d*)D6$/i);
    if (simpleDice) {
      const count = simpleDice[1] ? Number(simpleDice[1]) : 1;
      return rollFalloutCombatDice(rng, count);
    }

    const addDice = value.match(/^(\d+)\+(\d*)D6$/i);
    if (addDice) {
      const base = Number(addDice[1]);
      const count = addDice[2] ? Number(addDice[2]) : 1;
      return base + rollFalloutCombatDice(rng, count);
    }

    return null;
  };

  const multiply = expr.match(/^(\d+)x\((.+)\)$/i);
  if (multiply) {
    const multiplier = Number(multiply[1]);
    const inner = rollTerm(multiply[2]);
    if (inner === null) return null;
    return Math.max(1, Math.round(multiplier * inner));
  }

  const value = rollTerm(expr);
  return value === null ? null : Math.max(1, Math.round(value));
}

function rollVendorQuantity(rng, item, tier) {
  if (item?.category === 'AMMO' && item?.qtyFound) {
    const ammoQty = rollAmmoQtyFound(rng, item.qtyFound);
    if (Number.isFinite(ammoQty) && ammoQty >= 1) return ammoQty;
  }

  const qtyClass = inferVendorQuantityClass(item);
  const rule = VENDOR_GENERATOR_QTY_CLASSES[qtyClass] || VENDOR_GENERATOR_QTY_CLASSES.single;

  const min = Number.isFinite(item?.vendorQtyMin) ? item.vendorQtyMin : rule.min;
  const max = Number.isFinite(item?.vendorQtyMax) ? item.vendorQtyMax : rule.max;

  let qty = vendorRollInt(rng, Math.max(1, min), Math.max(1, max));
  qty = Math.round(
    qty *
    (VENDOR_GENERATOR_TIER_QTY[tier.id] ?? 1) *
    (VENDOR_GENERATOR_RARITY_QTY[item.rarity] ?? 1)
  );

  if (!Number.isFinite(qty) || qty < 1) qty = 1;
  qty = Math.min(qty, rule.cap);
  return qty;
}

function rollFusionCoreCharge(rng) {
  return vendorWeightedPick(rng, [
    { key: 10, w: 18 }, { key: 11, w: 18 }, { key: 12, w: 18 },
    { key: 13, w: 16 }, { key: 14, w: 14 }, { key: 15, w: 10 },
    { key: 16, w: 6 }
  ]);
}

function rollPlasmaCoreCharge(rng) {
  const entries = [];
  for (let charge = 100; charge <= 500; charge += 10) {
    let w = 1;
    if (charge <= 200) w = 2.2;
    else if (charge <= 350) w = 4.0;
    else if (charge <= 450) w = 2.0;
    else if (charge < 500) w = 0.9;
    else w = 0.25;
    entries.push({ key: charge, w });
  }
  return vendorWeightedPick(rng, entries);
}

function coreEffectiveValue(baseValue, charges, maxCharges) {
  const base = Math.max(0, Number(baseValue) || 0);
  return Math.max(0, Math.round(base * (charges / maxCharges)));
}

function makeGeneratedCoreUnits(item, qty, rng) {
  const kind = getVendorCoreKind(item);
  if (!kind) return [];

  const maxCharges = kind === "fusion" ? 16 : 500;
  const units = [];

  for (let i = 0; i < qty; i++) {
    const charges = kind === "fusion"
      ? rollFusionCoreCharge(rng)
      : rollPlasmaCoreCharge(rng);

    const value = coreEffectiveValue(item.cost, charges, maxCharges);
    const unitId = makeInstanceId(kind === "fusion" ? "fusion-core" : "plasma-core");

    units.push({
      name: `[[${item.yamlName}]]`,
      yamlName: item.yamlName,
      sourcePath: item.sourcePath,
      category: item.category,
      qty: "1",
      baseCost: value,
      cost: String(value),
      sourceBaseCost: Number(item.cost) || 0,
      weight: item.weight || "",
      selected: false,
      addons: [],
      chargeUnits: [{
        instanceId: unitId,
        charges,
        maxCharges
      }]
    });
  }

  return units;
}

function isLegendaryArmorEligible(item) {
  const path = String(item?.sourcePath || "");
  return path.includes("/Items/Apparel/Armor/") ||
    path.includes("/Items/Apparel/Power Armor/");
}

function legendaryArmorLocations(item) {
  const raw = String(item?.locations || "").toLowerCase();
  const out = [];

  if (raw.includes("head")) out.push("Head");
  if (raw.includes("arm")) out.push("Arm");
  if (raw.includes("torso") || raw.includes("body") || raw.includes("main body")) out.push("Torso");
  if (raw.includes("leg")) out.push("Leg");

  return [...new Set(out)];
}

function legendaryDisplayPrefix(propertyName) {
  return String(propertyName || "")
    .replace(/\s*\((?:Weapon|Armor)\)\s*$/i, "")
    .replace(/\s+Weapon\s*$/i, "")
    .replace(/\s+Armor\s*$/i, "")
    .trim();
}

function makeLegendaryAddon(propertyName, kind) {
  const folder = kind === "weapon" ? LEGENDARY_WEAPON_FOLDER : LEGENDARY_ARMOR_FOLDER;
  return {
    id: `${folder}/${propertyName}.md`,
    link: `[[${propertyName}]]`,
    type: "legendary"
  };
}

function rollLegendaryWeaponProperty(rng, weaponType) {
  if (!weaponType) return "";

  // A d20 chooses which of the two weapon tables is used:
  // 1-10 = Table 1, 11-20 = Table 2.
  const tableRoll = vendorRollInt(rng, 1, 20);
  const table = tableRoll <= 10 ? LEGENDARY_WEAPON_TABLE_1 : LEGENDARY_WEAPON_TABLE_2;
  const typeTable = table[weaponType];
  if (!typeTable) return "";

  for (let attempts = 0; attempts < 50; attempts++) {
    const result = typeTable[vendorRollInt(rng, 1, 20)];
    if (result) return result; // "No Result" is rerolled.
  }
  return "";
}

function rollLegendaryArmorProperty(rng, item) {
  const locations = legendaryArmorLocations(item);
  if (!locations.length) return "";

  const location = locations[vendorRollInt(rng, 0, locations.length - 1)];
  const table = LEGENDARY_ARMOR_TABLE[location];
  if (!table) return "";

  for (let attempts = 0; attempts < 50; attempts++) {
    const result = table[vendorRollInt(rng, 1, 20)];
    if (result) return result;
  }
  return "";
}

function maybeMakeLegendary(rng, item, basePayload, weaponRate, armorRate) {
  const weaponType = normalizeVendorWeaponType(item?.weaponType);
  const canWeaponLegendary = item.category === "WEAPONS" && !!weaponType;
  const canArmorLegendary = item.category === "APPAREL" && isLegendaryArmorEligible(item);

  let property = "";
  let kind = "";

  if (canWeaponLegendary && rng() < weaponRate) {
    property = rollLegendaryWeaponProperty(rng, weaponType);
    kind = "weapon";
  } else if (canArmorLegendary && rng() < armorRate) {
    property = rollLegendaryArmorProperty(rng, item);
    kind = "armor";
  }

  if (!property) return null;

  const payload = {
    ...basePayload,
    qty: "1",
    instanceId: makeInstanceId("legendary"),
    instanceName: `${legendaryDisplayPrefix(property)} ${item.name}`.trim(),
    addons: [makeLegendaryAddon(property, kind)]
  };

  return payload;
}

function makeGeneratedBasePayload(item, qty) {
  return {
    name: `[[${item.yamlName}]]`,
    yamlName: item.yamlName,
    sourcePath: item.sourcePath,
    category: item.category,
    qty: String(qty),
    baseCost: Number(item.cost) || 0,
    cost: String(Number(item.cost) || 0),
    weight: item.weight || "",
    selected: false,
    addons: []
  };
}

function incidentalHealingChance(profileId) {
  const chances = {
    general_store: 0.45,
    weapons_dealer: 0.35,
    armorer_outfitter: 0.35,
    mechanic: 0.30,
    cook: 0.20
  };
  return chances[profileId] ?? 0;
}

function findGeneratorItemByNames(names) {
  const wanted = names.map(x => String(x).toLowerCase());
  return itemDefinitions.find(item => {
    const candidates = [item.name, item.yamlName].map(x => String(x || "").toLowerCase());
    return candidates.some(x => wanted.includes(x));
  }) || null;
}


function parseVendorFilterList(value) {
  return String(value || "")
    .split(",")
    .map(x => x.trim())
    .filter(Boolean);
}

function vendorPathDirectories(sourcePath) {
  const parts = String(sourcePath || "")
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean);

  // Exclude the filename; everything else is treated as directory segments.
  return parts.slice(0, -1);
}

function vendorFileBaseName(item) {
  const explicit = String(item?.yamlName || "").trim();
  if (explicit) return explicit.replace(/\.md$/i, "");

  const path = String(item?.sourcePath || "").replace(/\\/g, "/");
  const file = path.split("/").pop() || "";
  return file.replace(/\.md$/i, "");
}

function vendorItemPassesAdvancedFilters(item, filters = {}) {
  const includeDirectories = parseVendorFilterList(filters.includeDirectories);
  const excludeDirectories = parseVendorFilterList(filters.excludeDirectories);
  const includeFileNames = parseVendorFilterList(filters.includeFileNames);
  const excludeFileNames = parseVendorFilterList(filters.excludeFileNames);

  const directories = vendorPathDirectories(item?.sourcePath)
    .map(x => x.toLowerCase());

  const fileName = vendorFileBaseName(item).toLowerCase();

  // Include-directory matching is exact against directory path segments.
  if (includeDirectories.length) {
    const passes = includeDirectories.some(term =>
      directories.includes(term.toLowerCase())
    );
    if (!passes) return false;
  }

  // Include-filename matching is case-insensitive substring matching.
  if (includeFileNames.length) {
    const passes = includeFileNames.some(term =>
      fileName.includes(term.toLowerCase())
    );
    if (!passes) return false;
  }

  // Exclusions always win.
  if (excludeDirectories.some(term =>
    directories.includes(term.toLowerCase())
  )) {
    return false;
  }

  if (excludeFileNames.some(term =>
    fileName.includes(term.toLowerCase())
  )) {
    return false;
  }

  return true;
}

function generateVendorInventory({
  profileId,
  tierId,
  rarityBiasId,
  seed,
  vendorName,
  legendaryWeaponRateId = "rare",
  legendaryArmorRateId = "rare",
  includeDirectories = "",
  excludeDirectories = "",
  includeFileNames = "",
  excludeFileNames = ""
}) {
  const profile = VENDOR_GENERATOR_PROFILES.find(x => x.id === profileId) || VENDOR_GENERATOR_PROFILES[0];
  const tier = VENDOR_GENERATOR_TIERS.find(x => x.id === tierId) || VENDOR_GENERATOR_TIERS[1];
  const rarityBias = VENDOR_GENERATOR_RARITY.find(x => x.id === rarityBiasId) || VENDOR_GENERATOR_RARITY[1];
  const resolvedSeed = String(seed || `vendor:${vendorName}:${Date.now()}`);
  const rng = makeVendorRng(resolvedSeed);
  const weaponLegendaryRate = VENDOR_LEGENDARY_RATES[legendaryWeaponRateId] ?? VENDOR_LEGENDARY_RATES.rare;
  const armorLegendaryRate = VENDOR_LEGENDARY_RATES[legendaryArmorRateId] ?? VENDOR_LEGENDARY_RATES.rare;

  const advancedFilters = {
    includeDirectories,
    excludeDirectories,
    includeFileNames,
    excludeFileNames
  };

  const pool = itemDefinitions.filter(item =>
    !isVendorGeneratorExcluded(item.sourcePath) &&
    vendorItemPassesAdvancedFilters(item, advancedFilters)
  );
  if (!pool.length) {
    throw new Error("No items match the current Advanced Filters.");
  }

  const targetLines = vendorRollInt(rng, tier.itemsMin, tier.itemsMax);
  const caps = vendorRollInt(rng, tier.capsMin, tier.capsMax);
  const used = new Set();
  const inventory = [];

  const addGeneratedItem = item => {
    if (!item) return false;

    const qty = rollVendorQuantity(rng, item, tier);
    used.add(item.sourcePath);

    if (getVendorCoreKind(item)) {
      inventory.push(...makeGeneratedCoreUnits(item, qty, rng));
      return true;
    }

    const basePayload = makeGeneratedBasePayload(item, qty);
    const legendary = maybeMakeLegendary(
      rng, item, basePayload, weaponLegendaryRate, armorLegendaryRate
    );

    if (legendary) {
      inventory.push(legendary);
      if (qty > 1) inventory.push(makeGeneratedBasePayload(item, qty - 1));
    } else {
      inventory.push(basePayload);
    }

    return true;
  };

  const pickCategoryDefinition = category => {
    const candidates = pool.filter(item =>
      item.category === category &&
      !used.has(item.sourcePath)
    );
    if (!candidates.length) return null;

    const rarityEntries = Object.entries(rarityBias.weights)
      .map(([key, w]) => ({ key: Number(key), w }));
    const wantedRarity = vendorWeightedPick(rng, rarityEntries);

    let rarityCandidates = candidates.filter(item => item.rarity === wantedRarity);
    if (!rarityCandidates.length) {
      const order = [0,1,2,3,4,5,6]
        .sort((a,b) => Math.abs(a - wantedRarity) - Math.abs(b - wantedRarity));
      for (const rarity of order) {
        rarityCandidates = candidates.filter(item => item.rarity === rarity);
        if (rarityCandidates.length) break;
      }
    }

    if (!rarityCandidates.length) return null;
    return rarityCandidates[Math.floor(rng() * rarityCandidates.length)] || null;
  };

  for (const category of (profile.guarantees || [])) {
    addGeneratedItem(pickCategoryDefinition(category));
  }

  const categoryEntries = Object.entries(profile.categoryWeights)
    .map(([key, w]) => ({ key, w }));

  let attempts = 0;
  while (used.size < targetLines && attempts < 5000) {
    attempts += 1;
    const category = vendorWeightedPick(rng, categoryEntries) || "MISC";
    addGeneratedItem(pickCategoryDefinition(category));
  }

  // Non-doctor specialists sometimes carry a tiny amount of basic medicine.
  if (profile.id !== "doctor" && rng() < incidentalHealingChance(profile.id)) {
    const stimpak = findGeneratorItemByNames(["stimpak", "stimpack"]);
    if (stimpak && !used.has(stimpak.sourcePath)) {
      used.add(stimpak.sourcePath);
      inventory.push(makeGeneratedBasePayload(stimpak, vendorRollInt(rng, 1, 3)));
    }

    if (rng() < 0.35) {
      const radAway = findGeneratorItemByNames(["radaway", "rad away"]);
      if (radAway && !used.has(radAway.sourcePath)) {
        used.add(radAway.sourcePath);
        inventory.push(makeGeneratedBasePayload(radAway, vendorRollInt(rng, 1, 2)));
      }
    }
  }

  return {
    caps,
    inventory,
    targetLines,
    randomConfig: {
      profileId: profile.id,
      tierId: tier.id,
      rarityBiasId: rarityBias.id,
      legendaryWeaponRateId,
      legendaryArmorRateId,
      includeDirectories: String(includeDirectories || ""),
      excludeDirectories: String(excludeDirectories || ""),
      includeFileNames: String(includeFileNames || ""),
      excludeFileNames: String(excludeFileNames || ""),
      seed: resolvedSeed,
      excludedFolders: [...VENDOR_GENERATOR_EXCLUDED_FOLDERS]
    }
  };
}

function addonDisplayName(addon) {
  return stripWikiLink(
    addon?.link ||
    String(addon?.id || "").split("/").pop()?.replace(/\.md$/i, "") ||
    "Mod"
  );
}

let vendorAddonCache = {
  weapon: null,
  armor: null,
  powerArmor: null
};

async function loadVendorAddonDefinitions(kind) {
  if (!kind) return [];
  if (vendorAddonCache[kind]) return vendorAddonCache[kind];

  const allFiles = app.vault.getMarkdownFiles();
  let folders = [];
  let legendaryFolder = "";

  if (kind === "weapon") {
    folders = WEAPON_MOD_FOLDERS;
    legendaryFolder = LEGENDARY_WEAPON_FOLDER;
  } else if (kind === "powerArmor") {
    folders = POWER_ARMOR_MOD_FOLDERS;
    legendaryFolder = LEGENDARY_ARMOR_FOLDER;
  } else {
    folders = ARMOR_MOD_FOLDERS;
    legendaryFolder = LEGENDARY_ARMOR_FOLDER;
  }

  const files = allFiles.filter(file =>
    folders.some(folder => file.path.startsWith(folder)) ||
    file.path.startsWith(legendaryFolder)
  );

  const defs = [];

  for (const file of files) {
    const isLegendary = file.path.startsWith(legendaryFolder);

    if (isLegendary) {
      defs.push({
        id: file.path,
        basename: file.basename,
        link: `[[${file.basename}]]`,
        type: "legendary",
        costDelta: 0
      });
      continue;
    }

    const content = await app.vault.read(file);
    const match = content.match(/```statblock([\s\S]*?)```/i);
    if (!match) continue;

    const block = match[1];
    const costMatch = block.match(/^\s*cost:\s*(.+)$/im);

    defs.push({
      id: file.path,
      basename: file.basename,
      link: `[[${file.basename}]]`,
      type: "mod",
      costDelta: costMatch ? parseSignedNumber(cleanQuotedValue(costMatch[1])) : 0
    });
  }

  vendorAddonCache[kind] = defs.sort((a, b) =>
    (a.type === "mod" ? 0 : 1) - (b.type === "mod" ? 0 : 1) ||
    a.basename.localeCompare(b.basename)
  );

  return vendorAddonCache[kind];
}

function sourceDefinitionForPayload(payload) {
  const sourcePath = String(payload?.sourcePath || "");
  return itemDefinitions.find(item => item.sourcePath === sourcePath) || null;
}

function getCoreType(payload) {
  const name = stripWikiLink(payload?.name || payload?.yamlName || "").toLowerCase();
  if (name === "fusion core") return "fusion";
  if (name === "plasma core") return "plasma";
  return null;
}

function getTradeBaseIdentity(item) {
  const source = String(item?.sourcePath || item?.path || item?.yamlName || "").trim().toLowerCase();
  const name = stripWikiLink(item?.name || item?.yamlName || "").toLowerCase();
  const category = String(item?.category || "").trim().toUpperCase();
  return `${source}::${name}::${category}`;
}

function getItemId(item, unit = null) {
  const coreId = String(unit?.instanceId || "").trim();
  if (coreId) return `core::${coreId}`;

  const instanceId = String(item?.instanceId || "").trim();
  if (instanceId) return `instance::${instanceId}`;

  return `stack::${getTradeBaseIdentity(item)}`;
}

function displayItemName(payload) {
  return normalizeInstanceName(payload?.instanceName) ||
    stripWikiLink(payload?.name || payload?.yamlName || "Item");
}

function vendorRows(vendor) {
  const rows = [];

  for (const payload of (Array.isArray(vendor?.inventory) ? vendor.inventory : [])) {
    const coreType = getCoreType(payload);

    if (coreType && Array.isArray(payload.chargeUnits)) {
      for (const unit of payload.chargeUnits) {
        rows.push({
          id: getItemId(payload, unit),
          name: displayItemName(payload),
          qty: 1,
          cost: Math.max(0, parseIntSafe(payload.cost ?? payload.baseCost, 0)),
          detail: coreType === "fusion"
            ? `${parseIntSafe(unit.charges, 0)}/${parseIntSafe(unit.maxCharges, 100)}`
            : `${parseIntSafe(unit.charges, 0)}/500`,
          addons: [],
          unique: true,
          core: true,
          payload
        });
      }
      continue;
    }

    const unique = !!String(payload?.instanceId || "").trim()
      || (Array.isArray(payload?.addons) && payload.addons.length > 0)
      || !!payload?.powerArmorState;

    const addons = (Array.isArray(payload?.addons) ? payload.addons : [])
      .map(addon => ({
        id: addon?.id || "",
        name: addonDisplayName(addon),
        link: String(
          addon?.link ||
          `[[${String(addon?.id || "").split("/").pop()?.replace(/\.md$/i, "") || "Mod"}]]`
        )
      }))
      .filter(addon => addon.name);

    rows.push({
      id: getItemId(payload),
      name: displayItemName(payload),
      qty: unique ? 1 : Math.max(1, parseIntSafe(payload.qty, 1)),
      cost: Math.max(0, parseIntSafe(payload.cost ?? payload.baseCost, 0)),
      addons,
      unique,
      core: false,
      payload
    });
  }

  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

const root = document.createElement("div");
root.style.cssText = `
  width:100%;
  max-width:1280px;
  margin:0 auto;
  padding:14px;
  box-sizing:border-box;
  font-family:inherit;
  color:#f4ead5;
  background:
    radial-gradient(circle at top right, rgba(44,87,119,.18), transparent 28rem),
    linear-gradient(180deg, #0e1821, #0b1219);
  border:1px solid rgba(69,111,140,.30);
  border-radius:14px;
`;

function buttonStyle(btn, primary = false) {
  btn.style.cssText = primary
    ? `background:#f3c64d;color:#142c3f;border:1px solid #f3c64d;padding:7px 11px;cursor:pointer;border-radius:7px;font-weight:800;`
    : `background:#172a3b;color:#efdd6f;border:1px solid rgba(243,198,77,.48);padding:7px 11px;cursor:pointer;border-radius:7px;font-weight:700;`;
}

function inputStyle(input) {
  input.style.cssText = `
    background:#10283a;
    color:#f4ead5;
    border:1px solid rgba(74,118,146,.68);
    border-radius:7px;
    padding:7px 9px;
    box-sizing:border-box;
    outline:none;
  `;
}

const masthead = document.createElement("div");
masthead.style.cssText = `
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  align-items:end;
  gap:18px;
  padding:18px 20px;
  margin-bottom:10px;
  border:1px solid rgba(74,118,146,.65);
  border-left:5px solid #f3c64d;
  border-radius:10px;
  background:linear-gradient(135deg, #142536 0%, #1d3d57 62%, #183149 100%);
  box-shadow:0 10px 28px rgba(0,0,0,.22);
`;
const mastText = document.createElement("div");
const mastKicker = document.createElement("div");
mastKicker.textContent = "VAULT-KIT • MERCHANT OPERATIONS";
mastKicker.style.cssText = `color:#f3c64d;font-size:.72rem;font-weight:800;letter-spacing:.20em;text-transform:uppercase;`;
const mastTitle = document.createElement("div");
mastTitle.textContent = "GM Vendor Console";
mastTitle.style.cssText = `color:#f4ead5;font-size:clamp(1.5rem,3vw,2.25rem);font-weight:850;line-height:1.05;margin-top:4px;`;
const mastSub = document.createElement("div");
mastSub.textContent = "Manage merchants, inventory, reservations, and live trade activity";
mastSub.style.cssText = `color:#c5c5c5;font-size:.9rem;margin-top:5px;`;
mastText.append(mastKicker, mastTitle, mastSub);
const mastBadge = document.createElement("div");
mastBadge.textContent = "GM CONTROL";
mastBadge.style.cssText = `padding:9px 12px;border:1px solid rgba(243,198,77,.72);border-radius:999px;color:#f3c64d;background:rgba(8,18,27,.46);font-size:.82rem;font-weight:800;letter-spacing:.06em;`;
masthead.append(mastText, mastBadge);

const top = document.createElement("div");
top.style.cssText = `
  display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;
  padding:9px 10px;background:rgba(23,42,59,.74);border:1px solid rgba(74,118,146,.50);border-radius:7px;
`;

const serverInput = document.createElement("input");
serverInput.value = normalizeUrl(
  localStorage.getItem(VENDOR_SERVER_URL_KEY) || DEFAULT_VENDOR_SERVER_URL
);
serverInput.placeholder = "http://192.168.1.50:3000";
serverInput.style.width = "250px";
inputStyle(serverInput);

const connectBtn = document.createElement("button");
connectBtn.textContent = "Connect / Refresh";
buttonStyle(connectBtn);

const status = document.createElement("span");
status.textContent = "Not connected";
status.style.cssText = `font-size:12px;opacity:.9;`;

top.append("Server:", serverInput, connectBtn, status);


function makeConsoleCollapsibleSection(titleText, open = true) {
  const details = document.createElement("details");
  details.open = open;
  details.style.cssText = `
    margin-bottom:10px;
    border:1px solid rgba(74,118,146,.55);
    border-radius:10px;
    background:#101d28;
    overflow:hidden;
    box-shadow:0 8px 24px rgba(0,0,0,.16);
  `;

  const summary = document.createElement("summary");
  summary.textContent = titleText;
  summary.style.cssText = `
    cursor:pointer;
    min-height:42px;
    display:flex;
    align-items:center;
    padding:10px 14px;
    border-left:5px solid #f3c64d;
    background:linear-gradient(135deg,#142536 0%,#1d3d57 62%,#183149 100%);
    color:#f3c64d;
    font-size:12px;
    font-weight:850;
    letter-spacing:.07em;
    text-transform:uppercase;
    user-select:none;
  `;

  const body = document.createElement("div");
  body.style.cssText = `
    padding:12px;
    background:linear-gradient(180deg,rgba(24,45,61,.76),rgba(14,27,37,.72));
  `;

  details.append(summary, body);
  return { details, summary, body };
}

const vendorSection = makeConsoleCollapsibleSection("Vendor", true);

const vendorBar = document.createElement("div");
vendorBar.style.cssText = `
  display:flex;
  align-items:flex-end;
  gap:12px;
  flex-wrap:wrap;
  padding:0 0 12px;
  margin-bottom:12px;
  border-bottom:1px solid rgba(83,127,155,.24);
`;

const vendorSelectWrap = document.createElement("label");
vendorSelectWrap.style.cssText = `display:flex;flex-direction:column;gap:4px;min-width:260px;`;

const vendorSelectLabel = document.createElement("span");
vendorSelectLabel.textContent = "Active Vendor";
vendorSelectLabel.style.cssText = `font-size:12px;font-weight:bold;`;

const vendorSelect = document.createElement("select");
inputStyle(vendorSelect);
vendorSelect.style.minWidth = "260px";

vendorSelectWrap.append(vendorSelectLabel, vendorSelect);

const newVendorBtn = document.createElement("button");
newVendorBtn.textContent = "New Vendor";
buttonStyle(newVendorBtn);

const duplicateVendorBtn = document.createElement("button");
duplicateVendorBtn.textContent = "Duplicate Vendor";
duplicateVendorBtn.title = "Copy the current vendor, including live stock, saved template, and generator settings.";
buttonStyle(duplicateVendorBtn);

const deleteVendorBtn = document.createElement("button");
deleteVendorBtn.textContent = "Delete Vendor";
buttonStyle(deleteVendorBtn);
deleteVendorBtn.style.background = "rgba(118,43,43,.48)";
deleteVendorBtn.style.color = "#ffd8d2";
deleteVendorBtn.style.borderColor = "rgba(239,129,117,.52)";
deleteVendorBtn.title = "Permanently delete the currently selected vendor.";

const saveTemplateBtn = document.createElement("button");
saveTemplateBtn.textContent = "Save Template";
saveTemplateBtn.title = "Make the vendor's current caps, settings, and inventory the new restock baseline.";
buttonStyle(saveTemplateBtn);

const restockBtn = document.createElement("button");
restockBtn.textContent = "Restock Missing";
restockBtn.title = "Restore template stock that was purchased, without removing items sold to this vendor.";
buttonStyle(restockBtn);

const resetVendorBtn = document.createElement("button");
resetVendorBtn.textContent = "Reset to Template";
resetVendorBtn.title = "Replace the live vendor state with the saved template.";
buttonStyle(resetVendorBtn);

const regenerateVendorBtn = document.createElement("button");
regenerateVendorBtn.textContent = "Regenerate Stock";
regenerateVendorBtn.title = "Generate new stock using this vendor's saved generator profile, tier, and rarity settings.";
buttonStyle(regenerateVendorBtn);

const vendorActions = document.createElement("div");
vendorActions.style.cssText = `
  display:flex;
  align-items:center;
  gap:7px;
  flex-wrap:wrap;
`;
vendorActions.append(newVendorBtn, duplicateVendorBtn, deleteVendorBtn);

vendorBar.append(
  vendorSelectWrap,
  vendorActions
);

const settings = document.createElement("div");
settings.style.cssText = `
  display:grid;
  grid-template-columns:repeat(4,minmax(140px,1fr)) auto;
  gap:10px;
  align-items:end;
`;

function field(label, type = "text", step = null) {
  const wrap = document.createElement("label");
  wrap.style.cssText = `display:flex;flex-direction:column;gap:4px;`;

  const span = document.createElement("span");
  span.textContent = label;
  span.style.cssText = `font-size:12px;font-weight:bold;`;

  const input = document.createElement("input");
  input.type = type;
  if (step) input.step = step;
  inputStyle(input);

  wrap.append(span, input);
  return { wrap, input };
}

const nameField = field("Vendor Name");
const capsField = field("Caps", "number");
const buyField = field("Buy Multiplier", "number", "0.01");
const sellField = field("Sell Multiplier", "number", "0.01");

const saveBtn = document.createElement("button");
saveBtn.textContent = "Save Settings";
buttonStyle(saveBtn, true);

settings.append(
  nameField.wrap,
  capsField.wrap,
  buyField.wrap,
  sellField.wrap,
  saveBtn
);

vendorSection.body.append(vendorBar, settings);

const addSection = makeConsoleCollapsibleSection("Add Item", true);

const pickerWrap = document.createElement("div");
pickerWrap.style.cssText = `position:relative;margin-bottom:8px;`;

const searchInput = document.createElement("input");
searchInput.placeholder = "Search item...";
searchInput.style.width = "100%";
inputStyle(searchInput);

const dropdown = document.createElement("div");
dropdown.style.cssText = `
  display:none;
  position:absolute;
  z-index:1000;
  left:0;
  right:0;
  top:100%;
  max-height:260px;
  overflow-y:auto;
  background:#172a3b;
  border:1px solid #f3c64d;
  box-shadow:0 5px 18px rgba(0,0,0,.5);
`;

pickerWrap.append(searchInput, dropdown);

const selectedLabel = document.createElement("div");
selectedLabel.textContent = "No item selected";
selectedLabel.style.cssText = `font-size:12px;opacity:.8;margin-bottom:8px;`;

const addFields = document.createElement("div");
addFields.style.cssText = `
  display:grid;
  grid-template-columns:minmax(180px,2fr) minmax(120px,1fr) 90px auto;
  gap:8px;
  align-items:end;
`;

const customNameField = field("Display Name (optional)");
const customValueField = field("Base Value", "number");
const addQtyField = field("Quantity", "number");
addQtyField.input.min = "1";
addQtyField.input.value = "1";

const addBtn = document.createElement("button");
addBtn.textContent = "Add to Vendor";
buttonStyle(addBtn, true);

addFields.append(
  customNameField.wrap,
  customValueField.wrap,
  addQtyField.wrap,
  addBtn
);

addSection.body.append(pickerWrap, selectedLabel, addFields);

const stockToolbar = document.createElement("div");
stockToolbar.style.cssText = `
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
  margin:12px 0 8px;
  padding:10px 12px;
  background:#172a3b;
  border:1px solid rgba(74,118,146,.50);
  border-radius:10px;
`;

const stockToolbarTitle = document.createElement("div");
stockToolbarTitle.textContent = "Stock";
stockToolbarTitle.style.cssText = `
  color:#f3c64d;
  font-size:12px;
  font-weight:850;
  letter-spacing:.07em;
  text-transform:uppercase;
`;

const stockActions = document.createElement("div");
stockActions.style.cssText = `
  display:flex;
  align-items:center;
  gap:7px;
  flex-wrap:wrap;
`;
stockActions.append(saveTemplateBtn, restockBtn, resetVendorBtn, regenerateVendorBtn);

stockToolbar.append(stockToolbarTitle, stockActions);

const table = document.createElement("div");
table.style.cssText = `display:flex;flex-direction:column;gap:3px;`;

const activityGrid = document.createElement("div");
activityGrid.style.cssText = `display:grid;grid-template-columns:minmax(320px,.8fr) minmax(420px,1.2fr);gap:12px;margin-top:16px;`;

function makeActivityPanel(titleText) {
  const panel = document.createElement("section");
  panel.style.cssText = `background:#172a3b;border:1px solid rgba(74,118,146,.55);border-radius:10px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.18);`;
  const head = document.createElement("div");
  head.style.cssText = `display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;background:linear-gradient(90deg,#203f57,#18354b);border-left:4px solid #f3c64d;border-bottom:1px solid rgba(243,198,77,.28);`;
  const title = document.createElement("div");
  title.textContent = titleText;
  title.style.cssText = `color:#f3c64d;font-weight:850;letter-spacing:.08em;text-transform:uppercase;font-size:.88rem;`;
  const body = document.createElement("div");
  body.style.cssText = `padding:10px 12px;max-height:360px;overflow:auto;`;
  head.append(title);
  panel.append(head, body);
  return { panel, head, body };
}

const reservationsPanel = makeActivityPanel("Active Reservations");
const clearAllReservationsBtn = document.createElement("button");
clearAllReservationsBtn.textContent = "Clear All";
buttonStyle(clearAllReservationsBtn);
clearAllReservationsBtn.style.padding = "4px 8px";
reservationsPanel.head.append(clearAllReservationsBtn);

const historyPanel = makeActivityPanel("Trade History");
const refreshActivityBtn = document.createElement("button");
refreshActivityBtn.textContent = "Refresh";
buttonStyle(refreshActivityBtn);
refreshActivityBtn.style.padding = "4px 8px";
historyPanel.head.append(refreshActivityBtn);

activityGrid.append(reservationsPanel.panel, historyPanel.panel);
const refreshActivityLayout = () => {
  activityGrid.style.gridTemplateColumns = window.innerWidth < 950
    ? "1fr"
    : "minmax(320px,.8fr) minmax(420px,1.2fr)";
};
refreshActivityLayout();
window.addEventListener("resize", refreshActivityLayout);

root.append(
  masthead,
  top,
  vendorSection.details,
  addSection.details,
  stockToolbar,
  table,
  activityGrid
);

let vendor = null;
let vendorList = [];
let activeVendorId = "";
let itemDefinitions = [];
let selectedDefinition = null;

async function request(path, options = {}) {
  const base = normalizeUrl(serverInput.value);
  serverInput.value = base;
  localStorage.setItem(VENDOR_SERVER_URL_KEY, base);

  const response = await fetch(`${base}${path}`, options);
  const data = await response.json().catch(() => null);

  if (!response.ok || data?.ok === false) {
    throw new Error(data?.reason || `HTTP ${response.status}`);
  }

  return data;
}



async function loadVendorList() {
  try {
    const result = await request("/api/vendors");
    vendorList = Array.isArray(result?.vendors) ? result.vendors : [];
    activeVendorId = String(result?.activeVendorId || "").trim();

    vendorSelect.innerHTML = "";

    for (const entry of vendorList) {
      const option = document.createElement("option");
      option.value = String(entry.vendorId || "");
      option.textContent = String(entry.name || entry.vendorId || "Vendor");
      option.selected = option.value === activeVendorId;
      vendorSelect.appendChild(option);
    }

    deleteVendorBtn.disabled = vendorList.length <= 1;
    deleteVendorBtn.style.opacity = deleteVendorBtn.disabled ? ".45" : "1";

    return true;
  } catch (err) {
    status.textContent = `Vendor list failed: ${String(err?.message || err)}`;
    return false;
  }
}

async function activateVendor(vendorId) {
  const id = String(vendorId || "").trim();
  if (!id || id === activeVendorId) return;

  try {
    status.textContent = "Switching vendor...";

    const result = await request(`/api/vendors/${encodeURIComponent(id)}/activate`, {
      method: "POST"
    });

    vendor = result.vendor;
    activeVendorId = String(result.activeVendorId || vendor?.vendorId || id);

    await loadVendorList();
    renderVendor();
    await refreshActivity();
    status.textContent = `Active: ${vendor?.name || "Vendor"}`;
  } catch (err) {
    status.textContent = `Switch failed: ${String(err?.message || err)}`;
    await loadVendorList();
  }
}

function openNewVendorModal() {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.72);
    display:flex;align-items:center;justify-content:center;padding:18px;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    width:min(720px,96vw);
    max-height:90vh;
    overflow:auto;
    background:#172a3b;
    color:#f3c64d;
    border:1px solid #355f7d;
    border-top:3px solid #f3c64d;
    border-radius:10px;
    padding:16px;
    box-sizing:border-box;
    box-shadow:0 18px 55px rgba(0,0,0,.48);
  `;

  const heading = document.createElement("div");
  heading.textContent = "New Vendor";
  heading.style.cssText = `font-size:1.15em;font-weight:bold;margin-bottom:12px;`;

  const grid = document.createElement("div");
  grid.style.cssText = `display:grid;grid-template-columns:1fr 1fr;gap:10px;`;

  const vendorName = field("Vendor Name");
  vendorName.input.placeholder = "e.g. Lucky Harith";

  const profileWrap = document.createElement("label");
  profileWrap.style.cssText = `display:flex;flex-direction:column;gap:4px;`;
  const profileLabel = document.createElement("span");
  profileLabel.textContent = "Profile";
  profileLabel.style.cssText = `font-size:12px;font-weight:bold;`;
  const profileSelect = document.createElement("select");
  inputStyle(profileSelect);
  for (const profile of VENDOR_GENERATOR_PROFILES) {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = profile.label;
    profileSelect.appendChild(option);
  }
  profileWrap.append(profileLabel, profileSelect);

  const tierWrap = document.createElement("label");
  tierWrap.style.cssText = `display:flex;flex-direction:column;gap:4px;`;
  const tierLabel = document.createElement("span");
  tierLabel.textContent = "Stock Level";
  tierLabel.style.cssText = `font-size:12px;font-weight:bold;`;
  const tierSelect = document.createElement("select");
  inputStyle(tierSelect);
  tierSelect.value = "average";
  for (const tier of VENDOR_GENERATOR_TIERS) {
    const option = document.createElement("option");
    option.value = tier.id;
    option.textContent = tier.label;
    if (tier.id === "average") option.selected = true;
    tierSelect.appendChild(option);
  }
  tierWrap.append(tierLabel, tierSelect);

  const rarityWrap = document.createElement("label");
  rarityWrap.style.cssText = `display:flex;flex-direction:column;gap:4px;`;
  const rarityLabel = document.createElement("span");
  rarityLabel.textContent = "Item Rarity";
  rarityLabel.style.cssText = `font-size:12px;font-weight:bold;`;
  const raritySelect = document.createElement("select");
  inputStyle(raritySelect);
  for (const rarity of VENDOR_GENERATOR_RARITY) {
    const option = document.createElement("option");
    option.value = rarity.id;
    option.textContent = rarity.label;
    if (rarity.id === "normal") option.selected = true;
    raritySelect.appendChild(option);
  }
  rarityWrap.append(rarityLabel, raritySelect);

  const legendaryWeaponWrap = document.createElement("label");
  legendaryWeaponWrap.style.cssText = `display:flex;flex-direction:column;gap:4px;`;
  const legendaryWeaponLabel = document.createElement("span");
  legendaryWeaponLabel.textContent = "Legendary Weapons";
  legendaryWeaponLabel.style.cssText = `font-size:12px;font-weight:bold;`;
  const legendaryWeaponSelect = document.createElement("select");
  inputStyle(legendaryWeaponSelect);

  const legendaryArmorWrap = document.createElement("label");
  legendaryArmorWrap.style.cssText = `display:flex;flex-direction:column;gap:4px;`;
  const legendaryArmorLabel = document.createElement("span");
  legendaryArmorLabel.textContent = "Legendary Armor";
  legendaryArmorLabel.style.cssText = `font-size:12px;font-weight:bold;`;
  const legendaryArmorSelect = document.createElement("select");
  inputStyle(legendaryArmorSelect);

  for (const [id, label] of [
    ["off", "Off"],
    ["rare", "Rare (2%)"],
    ["normal", "Normal (5%)"],
    ["frequent", "Frequent (10%)"]
  ]) {
    const w = document.createElement("option");
    w.value = id;
    w.textContent = label;
    if (id === "rare") w.selected = true;
    legendaryWeaponSelect.appendChild(w);

    const a = document.createElement("option");
    a.value = id;
    a.textContent = label;
    if (id === "rare") a.selected = true;
    legendaryArmorSelect.appendChild(a);
  }

  legendaryWeaponWrap.append(legendaryWeaponLabel, legendaryWeaponSelect);
  legendaryArmorWrap.append(legendaryArmorLabel, legendaryArmorSelect);

  const advancedFilters = document.createElement("details");
  advancedFilters.style.cssText = `
    grid-column:1 / -1;
    border:1px solid #365d78;
    border-radius:10px;
    background:#101d28;
    overflow:hidden;
    box-shadow:0 8px 24px rgba(0,0,0,.16);
  `;

  const advancedSummary = document.createElement("summary");
  advancedSummary.textContent = "Advanced Filters";
  advancedSummary.style.cssText = `
    cursor:pointer;
    min-height:42px;
    display:flex;
    align-items:center;
    padding:10px 14px;
    border-left:5px solid #f3c64d;
    background:linear-gradient(135deg,#142536 0%,#1d3d57 62%,#183149 100%);
    color:#f3c64d;
    font-weight:850;
    letter-spacing:.06em;
    text-transform:uppercase;
    user-select:none;
  `;

  const advancedGrid = document.createElement("div");
  advancedGrid.style.cssText = `
    display:grid;
    grid-template-columns:repeat(2,minmax(220px,1fr));
    gap:10px 12px;
    padding:12px 14px 14px;
    background:linear-gradient(180deg,rgba(24,45,61,.76),rgba(14,27,37,.72));
  `;

  const includeDirectoriesField = field("Include Directories");
  includeDirectoriesField.input.placeholder = "Weapons, Ammo";

  const excludeDirectoriesField = field("Exclude Directories");
  excludeDirectoriesField.input.placeholder = "Bows, Energy";

  const includeFileNamesField = field("Include File Names");
  includeFileNamesField.input.placeholder = "Laser, Plasma";

  const excludeFileNamesField = field("Exclude File Names");
  excludeFileNamesField.input.placeholder = "Alien, Institute";

  const advancedHelp = document.createElement("div");
  advancedHelp.style.cssText = `
    grid-column:1 / -1;
    color:#aebdca;
    font-size:11px;
    line-height:1.45;
    margin-top:-2px;
  `;
  advancedHelp.textContent =
    "Directories match exact folder names. File names use case-insensitive partial matches. " +
    "If Include fields are filled, an item must pass each populated Include field. Exclusions always win.";

  advancedGrid.append(
    includeDirectoriesField.wrap,
    excludeDirectoriesField.wrap,
    includeFileNamesField.wrap,
    excludeFileNamesField.wrap,
    advancedHelp
  );

  advancedFilters.append(advancedSummary, advancedGrid);

  const seedField = field("Seed (optional)");
  seedField.input.placeholder = "Blank = new random vendor";

  const previewShell = document.createElement("div");
  previewShell.style.cssText = `
    margin-top:12px;
    border:1px solid #365d78;
    border-radius:10px;
    overflow:hidden;
    background:#101d28;
    box-shadow:0 8px 24px rgba(0,0,0,.16);
  `;

  const previewTitle = document.createElement("div");
  previewTitle.textContent = "Generated Stock Preview";
  previewTitle.style.cssText = `
    min-height:40px;
    display:flex;
    align-items:center;
    padding:9px 14px;
    border-left:5px solid #f3c64d;
    background:linear-gradient(135deg,#142536 0%,#1d3d57 62%,#183149 100%);
    color:#f3c64d;
    font-size:12px;
    font-weight:850;
    letter-spacing:.07em;
    text-transform:uppercase;
  `;

  const preview = document.createElement("div");
  preview.style.cssText = `
    padding:10px 12px;
    min-height:54px;
    max-height:300px;
    overflow:auto;
    font-size:12px;
    background:#0c1c28;
    color:#f4ead5;
  `;
  preview.textContent = "Choose Generate Preview to inspect the result before creating it.";
  previewShell.append(previewTitle, preview);

  let generated = null;

  const renderGeneratedPreview = () => {
    preview.innerHTML = "";
    if (!generated) return;

    const summary = document.createElement("div");
    summary.style.cssText = `
      font-weight:800;
      color:#efdd6f;
      margin:-2px 0 8px;
      padding:0 0 8px;
      border-bottom:1px solid rgba(83,127,155,.34);
    `;
    summary.textContent = `${generated.inventory.length} item lines • ${generated.caps} caps`;
    preview.appendChild(summary);

    for (const item of generated.inventory) {
      const row = document.createElement("div");
      row.style.cssText = `
        display:grid;
        grid-template-columns:minmax(0,1fr) 55px 70px;
        gap:8px;
        align-items:center;
        padding:5px 4px;
        border-bottom:1px solid rgba(83,127,155,.16);
      `;

      const name = document.createElement("span");
      appendVendorSourceLink(name, item, item.yamlName || stripWikiLink(item.name));

      const qty = document.createElement("span");
      const coreUnit = Array.isArray(item.chargeUnits) ? item.chargeUnits[0] : null;
      qty.textContent = coreUnit
        ? `${coreUnit.charges}/${coreUnit.maxCharges}`
        : `x${item.qty}`;
      qty.style.cssText = `text-align:right;color:#f4ead5;font-variant-numeric:tabular-nums;`;

      const category = document.createElement("span");
      const legendary = Array.isArray(item.addons) && item.addons.some(a => a?.type === "legendary");
      category.textContent = legendary ? `${item.category} ★` : item.category;
      category.style.textAlign = "right";
      category.style.opacity = legendary ? "1" : ".72";
      category.style.fontSize = "11px";
      if (legendary) category.style.color = "#f3c64d";

      if (item.instanceName) {
        name.innerHTML = "";
        appendVendorSourceLink(name, item, item.instanceName);
      }

      row.append(name, qty, category);
      preview.appendChild(row);
    }
  };

  const buttonRow = document.createElement("div");
  buttonRow.style.cssText = `display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:14px;`;

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  buttonStyle(cancel);

  const blank = document.createElement("button");
  blank.textContent = "Create Blank";
  buttonStyle(blank);

  const generatePreview = document.createElement("button");
  generatePreview.textContent = "Generate Preview";
  buttonStyle(generatePreview);

  const createGenerated = document.createElement("button");
  createGenerated.textContent = "Create Generated Vendor";
  buttonStyle(createGenerated);
  createGenerated.disabled = true;
  createGenerated.style.opacity = ".45";

  const getName = () => String(vendorName.input.value || "").trim();

  generatePreview.onclick = () => {
    const name = getName();
    if (!name) {
      preview.textContent = "Enter a vendor name first.";
      vendorName.input.focus();
      return;
    }

    generated = generateVendorInventory({
      profileId: profileSelect.value,
      tierId: tierSelect.value,
      rarityBiasId: raritySelect.value,
      legendaryWeaponRateId: legendaryWeaponSelect.value,
      legendaryArmorRateId: legendaryArmorSelect.value,
      includeDirectories: includeDirectoriesField.input.value.trim(),
      excludeDirectories: excludeDirectoriesField.input.value.trim(),
      includeFileNames: includeFileNamesField.input.value.trim(),
      excludeFileNames: excludeFileNamesField.input.value.trim(),
      seed: seedField.input.value.trim(),
      vendorName: name
    });

    createGenerated.disabled = false;
    createGenerated.style.opacity = "1";
    renderGeneratedPreview();
  };

  blank.onclick = async () => {
    const name = getName();
    if (!name) {
      preview.textContent = "Enter a vendor name first.";
      vendorName.input.focus();
      return;
    }

    blank.disabled = true;
    try {
      const result = await request("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, makeActive: true })
      });

      vendor = result.vendor;
      activeVendorId = String(result.activeVendorId || vendor?.vendorId || "");
      await loadVendorList();
      renderVendor();
      status.textContent = `Created ${vendor?.name || "vendor"}`;
      overlay.remove();
    } catch (err) {
      preview.textContent = `Create failed: ${String(err?.message || err)}`;
      blank.disabled = false;
    }
  };

  createGenerated.onclick = async () => {
    const name = getName();
    if (!name || !generated) return;

    createGenerated.disabled = true;
    try {
      const result = await request("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          caps: generated.caps,
          buyMultiplier: 1,
          sellMultiplier: 0.5,
          inventory: generated.inventory,
          mode: "generated",
          randomConfig: generated.randomConfig,
          makeActive: true
        })
      });

      vendor = result.vendor;
      activeVendorId = String(result.activeVendorId || vendor?.vendorId || "");
      await loadVendorList();
      renderVendor();
      status.textContent = `Generated ${vendor?.name || "vendor"} with ${generated.inventory.length} item lines`;
      overlay.remove();
    } catch (err) {
      preview.textContent = `Create failed: ${String(err?.message || err)}`;
      createGenerated.disabled = false;
    }
  };

  cancel.onclick = () => overlay.remove();
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

  grid.append(
    vendorName.wrap,
    profileWrap,
    tierWrap,
    rarityWrap,
    legendaryWeaponWrap,
    legendaryArmorWrap,
    advancedFilters,
    seedField.wrap
  );
  buttonRow.append(cancel, blank, generatePreview, createGenerated);
  modal.append(heading, grid, previewShell, buttonRow);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  vendorName.input.focus();
}



function openDuplicateVendorModal() {
  if (!vendor) return;

  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.72);
    display:flex;align-items:center;justify-content:center;padding:18px;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    width:min(460px,96vw);
    background:#172a3b;color:#f3c64d;border:2px solid #f3c64d;
    padding:16px;box-sizing:border-box;
  `;

  const heading = document.createElement("div");
  heading.textContent = "Duplicate Vendor";
  heading.style.cssText = `font-size:1.15em;font-weight:bold;margin-bottom:12px;`;

  const note = document.createElement("div");
  note.textContent =
    "Copies the current live inventory, caps, pricing, saved template, and generator settings into a new independent vendor.";
  note.style.cssText = `font-size:12px;opacity:.8;margin-bottom:12px;line-height:1.4;`;

  const name = field("New Vendor Name");
  name.input.value = `${String(vendor.name || "Vendor").trim()} Copy`;

  const actions = document.createElement("div");
  actions.style.cssText = `display:flex;gap:8px;justify-content:flex-end;margin-top:14px;`;

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  buttonStyle(cancel);

  const duplicate = document.createElement("button");
  duplicate.textContent = "Duplicate";
  buttonStyle(duplicate);

  cancel.onclick = () => overlay.remove();
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) overlay.remove();
  });

  duplicate.onclick = async () => {
    const newName = String(name.input.value || "").trim();
    if (!newName) {
      name.input.focus();
      return;
    }

    const sourceId = String(activeVendorId || vendor?.vendorId || "").trim();
    if (!sourceId) return;

    duplicate.disabled = true;

    try {
      const result = await request(
        `/api/vendors/${encodeURIComponent(sourceId)}/duplicate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newName,
            makeActive: true
          })
        }
      );

      vendor = result.vendor;
      activeVendorId = String(result.activeVendorId || vendor?.vendorId || "");

      await loadVendorList();
      renderVendor();
      status.textContent = `Duplicated as ${vendor?.name || "vendor"}`;
      overlay.remove();
    } catch (err) {
      status.textContent = `Duplicate failed: ${String(err?.message || err)}`;
      duplicate.disabled = false;
    }
  };

  actions.append(cancel, duplicate);
  modal.append(heading, note, name.wrap, actions);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  setTimeout(() => {
    name.input.focus();
    name.input.select();
  }, 0);
}

async function saveCurrentVendorTemplate() {
  const id = String(activeVendorId || vendor?.vendorId || "").trim();
  if (!id || !vendor) return;
  const confirmed = window.confirm(`Save the current state of ${vendor.name || "this vendor"} as its new template?\n\nFuture Restock and Reset operations will use this inventory, caps, and vendor settings.`);
  if (!confirmed) return;
  try {
    const result = await request(`/api/vendors/${encodeURIComponent(id)}/template/save`, { method: "POST" });
    vendor = result.vendor; renderVendor(); status.textContent = "Vendor template saved";
  } catch (err) { status.textContent = `Template save failed: ${String(err?.message || err)}`; }
}

async function restockMissingVendorStock() {
  const id = String(activeVendorId || vendor?.vendorId || "").trim();
  if (!id || !vendor) return;
  try {
    const result = await request(`/api/vendors/${encodeURIComponent(id)}/restock`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "missing" })
    });
    vendor = result.vendor; renderVendor(); status.textContent = "Missing template stock restored";
  } catch (err) { status.textContent = `Restock failed: ${String(err?.message || err)}`; }
}

async function resetVendorToTemplate() {
  const id = String(activeVendorId || vendor?.vendorId || "").trim();
  if (!id || !vendor) return;
  const confirmed = window.confirm(`Reset ${vendor.name || "this vendor"} to its saved template?\n\nThis replaces the current inventory, caps, pricing, and generator state. Items players sold to the vendor after the template was saved will be removed.`);
  if (!confirmed) return;
  try {
    const result = await request(`/api/vendors/${encodeURIComponent(id)}/restock`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "reset" })
    });
    vendor = result.vendor; renderVendor(); status.textContent = "Vendor reset to template";
  } catch (err) { status.textContent = `Reset failed: ${String(err?.message || err)}`; }
}

async function regenerateVendorStock() {
  const id = String(activeVendorId || vendor?.vendorId || "").trim();
  if (!id || !vendor) return;
  const cfg = vendor?.template?.randomConfig || vendor?.randomConfig;
  if (!cfg || !cfg.profileId || !cfg.tierId || !cfg.rarityBiasId) {
    status.textContent = "This vendor has no saved generator settings.";
    return;
  }
  const confirmed = window.confirm(`Regenerate ${vendor.name || "this vendor"} using its saved generator settings?\n\nThis creates fresh inventory and a fresh caps roll using the same profile, wealth tier, and rarity bias, then saves that result as the new template.`);
  if (!confirmed) return;
  try {
    const generated = generateVendorInventory({
      profileId: cfg.profileId,
      tierId: cfg.tierId,
      rarityBiasId: cfg.rarityBiasId,
      legendaryWeaponRateId: cfg.legendaryWeaponRateId || "rare",
      legendaryArmorRateId: cfg.legendaryArmorRateId || "rare",
      includeDirectories: cfg.includeDirectories || "",
      excludeDirectories: cfg.excludeDirectories || "",
      includeFileNames: cfg.includeFileNames || "",
      excludeFileNames: cfg.excludeFileNames || "",
      seed: "",
      vendorName: vendor.name || id
    });
    const result = await request(`/api/vendors/${encodeURIComponent(id)}/regenerate`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caps: generated.caps, inventory: generated.inventory, randomConfig: generated.randomConfig })
    });
    vendor = result.vendor; renderVendor(); status.textContent = `Regenerated ${vendor.name || "vendor"} with ${generated.inventory.length} item lines`;
  } catch (err) { status.textContent = `Regeneration failed: ${String(err?.message || err)}`; }
}

async function deleteActiveVendor() {
  const id = String(activeVendorId || vendor?.vendorId || "").trim();
  if (!id) return;

  const displayName = String(vendor?.name || "this vendor").trim();
  const confirmed = window.confirm(`Delete ${displayName}? This cannot be undone.`);
  if (!confirmed) return;

  try {
    const result = await request(`/api/vendors/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });

    vendor = result.vendor;
    activeVendorId = String(result.activeVendorId || vendor?.vendorId || "");

    await loadVendorList();
    renderVendor();
    status.textContent = `Deleted ${displayName}`;
  } catch (err) {
    status.textContent = `Delete failed: ${String(err?.message || err)}`;
  }
}

async function openVendorItemEditor(row) {
  const payload = JSON.parse(JSON.stringify(row.payload || {}));
  const kind = vendorModKind(payload);
  const sourceDef = sourceDefinitionForPayload(payload);
  const sourceBaseCost = Math.max(
    0,
    parseIntSafe(
      sourceDef?.cost ??
      payload.baseCostOverride ??
      payload.cost ??
      payload.baseCost,
      0
    )
  );

  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;
    inset:0;
    z-index:99999;
    background:rgba(0,0,0,.72);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:18px;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    width:min(680px,96vw);
    max-height:90vh;
    overflow:auto;
    background:#172a3b;
    color:#f3c64d;
    border:2px solid #f3c64d;
    padding:16px;
    box-sizing:border-box;
  `;

  const title = document.createElement("div");
  title.textContent = `Edit ${row.name}`;
  title.style.cssText = `font-weight:bold;font-size:1.1em;margin-bottom:12px;`;

  const editorGrid = document.createElement("div");
  editorGrid.style.cssText = `
    display:grid;
    grid-template-columns:1fr 160px;
    gap:10px;
    margin-bottom:14px;
  `;

  const editName = field("Display Name (optional)");
  editName.input.value = normalizeInstanceName(payload.instanceName || "");

  const editBase = field("Base Price");
  editBase.input.type = "number";
  editBase.input.min = "0";
  editBase.input.value = String(
    payload.baseCostOverride !== undefined
      ? payload.baseCostOverride
      : sourceBaseCost
  );

  editorGrid.append(editName.wrap, editBase.wrap);

  const modsTitle = document.createElement("div");
  modsTitle.textContent = kind ? "Mods" : "Mods — not applicable";
  modsTitle.style.cssText = `font-weight:bold;margin:4px 0 8px;`;

  const installed = document.createElement("div");
  installed.style.cssText = `
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    min-height:28px;
    margin-bottom:10px;
  `;

  let workingAddons = (Array.isArray(payload.addons) ? payload.addons : [])
    .map(a => ({ id: a.id, link: a.link, type: a.type }))
    .filter(a => a.id);

  const modSearch = document.createElement("input");
  modSearch.placeholder = "Search mods / legendary...";
  modSearch.style.width = "100%";
  inputStyle(modSearch);

  const modResults = document.createElement("div");
  modResults.style.cssText = `
    display:none;
    max-height:220px;
    overflow:auto;
    border:1px solid #f3c64d;
    margin-top:4px;
  `;

  const pricePreview = document.createElement("div");
  pricePreview.style.cssText = `margin:12px 0;font-weight:bold;`;

  let defs = kind ? await loadVendorAddonDefinitions(kind) : [];

  function currentCostDelta() {
    return workingAddons.reduce((sum, addon) => {
      const def = defs.find(x => x.id === addon.id);
      return sum + Number(def?.costDelta || 0);
    }, 0);
  }

  function renderPreview() {
    const base = Math.max(0, parseIntSafe(editBase.input.value, sourceBaseCost));
    const final = Math.max(0, base + currentCostDelta());
    pricePreview.textContent = `Effective item value: ${final}`;
    return final;
  }

  function renderInstalled() {
    installed.innerHTML = "";

    if (!workingAddons.length) {
      const none = document.createElement("span");
      none.textContent = "None";
      none.style.opacity = ".65";
      installed.append(none);
    } else {
      for (const addon of workingAddons) {
        const chip = document.createElement("span");
        chip.style.cssText = `
          border:1px solid rgba(26,255,128,.5);
          padding:4px 7px;
          display:inline-flex;
          align-items:center;
          gap:6px;
        `;

        const text = document.createElement("span");
        appendVendorSourceLink(text, {
          name: addon.link || `[[${addonDisplayName(addon)}]]`,
          yamlName: addonDisplayName(addon),
          sourcePath: String(addon.id || "").endsWith(".md") ? String(addon.id) : ""
        }, addonDisplayName(addon));

        const rm = document.createElement("span");
        rm.textContent = "×";
        rm.title = "Remove mod";
        rm.style.cssText = `cursor:pointer;font-weight:bold;`;
        rm.onclick = () => {
          workingAddons = workingAddons.filter(x => x.id !== addon.id);
          renderInstalled();
          renderPreview();
          renderModResults();
        };

        chip.append(text, rm);
        installed.append(chip);
      }
    }
  }

  function renderModResults() {
    if (!kind) {
      modResults.style.display = "none";
      return;
    }

    const q = modSearch.value.trim().toLowerCase();
    const matches = defs
      .filter(def => !workingAddons.some(a => a.id === def.id))
      .filter(def => !q || def.basename.toLowerCase().includes(q))
      .slice(0, 60);

    modResults.innerHTML = "";

    for (const def of matches) {
      const option = document.createElement("div");
      option.style.cssText = `
        padding:7px 9px;
        cursor:pointer;
        display:flex;
        justify-content:space-between;
        gap:12px;
        border-bottom:1px solid rgba(243,198,77,.10);
      `;

      const left = document.createElement("span");
      left.textContent = def.basename;

      const right = document.createElement("span");
      right.textContent = def.type === "legendary"
        ? "Legendary"
        : `Value ${def.costDelta >= 0 ? "+" : ""}${def.costDelta}`;
      right.style.opacity = ".75";

      option.onmouseenter = () => option.style.background = "rgba(243,198,77,.10)";
      option.onmouseleave = () => option.style.background = "transparent";

      option.onclick = () => {
        workingAddons.push({
          id: def.id,
          link: def.link,
          type: def.type
        });
        modSearch.value = "";
        renderInstalled();
        renderPreview();
        renderModResults();
      };

      option.append(left, right);
      modResults.append(option);
    }

    modResults.style.display = "block";
  }

  if (!kind) {
    modSearch.disabled = true;
    modSearch.style.opacity = ".45";
  } else {
    modSearch.addEventListener("focus", renderModResults);
    modSearch.addEventListener("input", renderModResults);
  }

  editBase.input.addEventListener("input", renderPreview);

  const buttons = document.createElement("div");
  buttons.style.cssText = `display:flex;justify-content:flex-end;gap:8px;margin-top:14px;`;

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  buttonStyle(cancel);

  const save = document.createElement("button");
  save.textContent = row.unique ? "Save Item" : "Customize 1";
  buttonStyle(save);

  cancel.onclick = () => document.body.removeChild(overlay);

  save.onclick = async () => {
    const enteredBase = Math.max(0, parseIntSafe(editBase.input.value, sourceBaseCost));
    const baseCostOverride = enteredBase !== sourceBaseCost ? enteredBase : null;
    const effectiveCost = Math.max(0, enteredBase + currentCostDelta());

    try {
      const result = await request("/api/vendor/inventory/customize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: row.id,
          instanceName: normalizeInstanceName(editName.input.value),
          baseCostOverride,
          addons: workingAddons,
          cost: effectiveCost,
          baseCost: effectiveCost
        })
      });

      vendor = result.vendor;
      document.body.removeChild(overlay);
      renderVendor();
      status.textContent = row.unique ? "Item updated" : "Customized 1 item from stack";
    } catch (err) {
      status.textContent = `Edit failed: ${String(err?.message || err)}`;
    }
  };

  buttons.append(cancel, save);
  modal.append(title, editorGrid, modsTitle, installed, modSearch, modResults, pricePreview, buttons);
  overlay.append(modal);
  document.body.append(overlay);

  renderInstalled();
  renderPreview();
}


function formatReservationTime(expiresAt) {
  const ms = Math.max(0, Number(expiresAt || 0) - Date.now());
  const seconds = Math.ceil(ms / 1000);
  if (seconds <= 0) return "expiring";
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

function tradePayloadName(payload) {
  return normalizeInstanceName(payload?.instanceName) ||
    stripWikiLink(payload?.name || payload?.yamlName || "Item");
}

function summarizeTradeLines(lines) {
  const list = Array.isArray(lines) ? lines : [];
  if (!list.length) return "None";
  return list.map(row => `${tradePayloadName(row?.payload)} ×${Math.max(1, parseIntSafe(row?.qty, 1))}`).join(", ");
}

function renderReservations(rows) {
  reservationsPanel.body.innerHTML = "";
  const list = Array.isArray(rows) ? rows : [];
  clearAllReservationsBtn.disabled = !list.length;
  clearAllReservationsBtn.style.opacity = list.length ? "1" : ".45";

  if (!list.length) {
    const empty = document.createElement("div");
    empty.textContent = "No active reservations.";
    empty.style.cssText = `color:#c5c5c5;font-size:13px;padding:4px 0;`;
    reservationsPanel.body.append(empty);
    return;
  }

  for (const reservation of list) {
    const row = document.createElement("div");
    row.style.cssText = `display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:9px 0;border-bottom:1px solid rgba(74,118,146,.28);`;

    const info = document.createElement("div");
    const who = document.createElement("div");
    who.textContent = String(reservation.playerName || "Player");
    who.style.cssText = `color:#f4ead5;font-weight:800;`;
    const items = document.createElement("div");
    items.textContent = (reservation.items || []).map(item => `${item.name} ×${item.qty}`).join(", ");
    items.style.cssText = `color:#c5c5c5;font-size:12px;margin-top:2px;line-height:1.35;`;
    const expires = document.createElement("div");
    expires.textContent = `Expires in ${formatReservationTime(reservation.expiresAt)}`;
    expires.style.cssText = `color:#e5c96e;font-size:11px;margin-top:3px;`;
    info.append(who, items, expires);

    const clear = document.createElement("button");
    clear.textContent = "Clear";
    buttonStyle(clear);
    clear.style.cssText += `align-self:center;padding:4px 8px;`;
    clear.onclick = async () => {
      try {
        const result = await request("/api/reservations/admin/clear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId: activeVendorId, clientId: reservation.clientId })
        });
        renderReservations(result.reservations);
        status.textContent = `Cleared ${reservation.playerName || "player"}'s reservation`;
      } catch (err) {
        status.textContent = `Clear failed: ${String(err?.message || err)}`;
      }
    };

    row.append(info, clear);
    reservationsPanel.body.append(row);
  }
}

const openHistoryTransactions = new Set();

function historyEntryKey(trade, index) {
  return String(
    trade?.transactionId ||
    `${trade?.completedAt || "unknown"}::${trade?.playerName || "Player"}::${index}`
  );
}

function renderHistory(rows) {
  historyPanel.body.innerHTML = "";
  const list = Array.isArray(rows) ? rows : [];

  if (!list.length) {
    const empty = document.createElement("div");
    empty.textContent = "No completed trades recorded for this vendor yet.";
    empty.style.cssText = `color:#c5c5c5;font-size:13px;padding:4px 0;`;
    historyPanel.body.append(empty);
    return;
  }

  list.forEach((trade, index) => {
    const key = historyEntryKey(trade, index);
    const details = document.createElement("details");
    details.open = openHistoryTransactions.has(key);
    details.style.cssText = `padding:8px 0;border-bottom:1px solid rgba(74,118,146,.28);`;

    details.addEventListener("toggle", () => {
      if (details.open) openHistoryTransactions.add(key);
      else openHistoryTransactions.delete(key);
    });

    const summary = document.createElement("summary");
    summary.style.cssText = `cursor:pointer;color:#f4ead5;font-weight:750;`;
    const when = trade.completedAt ? new Date(trade.completedAt).toLocaleString() : "Unknown time";
    summary.textContent = `${trade.playerName || "Player"} • ${when}`;

    const meta = document.createElement("div");
    meta.style.cssText = `margin:7px 0 0 18px;color:#c5c5c5;font-size:12px;line-height:1.5;`;
    const bought = summarizeTradeLines(trade.purchases);
    const sold = summarizeTradeLines(trade.sales);
    meta.innerHTML = `
      <div><strong style="color:#efdd6f">Bought:</strong> ${bought}</div>
      <div><strong style="color:#efdd6f">Sold:</strong> ${sold}</div>
      <div><strong style="color:#efdd6f">Paid:</strong> ${Math.max(0, parseIntSafe(trade.buyTotal, 0))} caps</div>
      <div><strong style="color:#efdd6f">Received:</strong> ${Math.max(0, parseIntSafe(trade.vendorPayout, 0))} caps</div>
    `;
    details.append(summary, meta);
    historyPanel.body.append(details);
  });
}

async function refreshActivity() {
  if (!activeVendorId) return;
  try {
    const [reservations, history] = await Promise.all([
      request(`/api/reservations/admin?vendorId=${encodeURIComponent(activeVendorId)}`),
      request(`/api/history?vendorId=${encodeURIComponent(activeVendorId)}&limit=50`)
    ]);
    renderReservations(reservations.reservations);
    renderHistory(history.history);
  } catch (err) {
    reservationsPanel.body.textContent = "Could not load reservation data.";
    historyPanel.body.textContent = "Could not load trade history.";
  }
}

function renderVendor() {
  if (!vendor) return;

  nameField.input.value = String(vendor.name || "");
  capsField.input.value = String(Math.max(0, parseIntSafe(vendor.caps, 0)));
  buyField.input.value = String(Number(vendor.buyMultiplier ?? 1));
  sellField.input.value = String(Number(vendor.sellMultiplier ?? 1));

  const generatorConfig = vendor?.template?.randomConfig || vendor?.randomConfig;
  const canRegenerate = !!(generatorConfig?.profileId && generatorConfig?.tierId && generatorConfig?.rarityBiasId);
  regenerateVendorBtn.disabled = !canRegenerate;
  regenerateVendorBtn.style.opacity = canRegenerate ? "1" : ".45";

  table.innerHTML = "";

  const header = document.createElement("div");
  header.style.cssText = `
    display:grid;
    grid-template-columns:minmax(0,1fr) 90px 90px 300px;
    gap:8px;
    padding:6px 8px;
    border-bottom:1px solid #f3c64d;
    font-weight:bold;
  `;
  header.innerHTML = `
    <div>Name</div>
    <div style="text-align:right">Qty</div>
    <div style="text-align:right">Base</div>
    <div></div>
  `;
  table.append(header);

  const rows = vendorRows(vendor);

  for (const row of rows) {
    const el = document.createElement("div");
    el.style.cssText = `
      display:grid;
      grid-template-columns:minmax(0,1fr) 90px 90px 300px;
      gap:8px;
      align-items:center;
      padding:5px 8px;
      border-bottom:1px solid rgba(243,198,77,.12);
    `;

    const name = document.createElement("div");
    name.style.cssText = `
      display:flex;
      flex-direction:column;
      min-width:0;
      gap:2px;
    `;

    const customName = normalizeInstanceName(row.payload?.instanceName || "");
    const visibleName = customName || stripWikiLink(
      row.payload?.name ||
      row.payload?.yamlName ||
      "Item"
    );

    const source = document.createElement("div");
    appendVendorSourceLink(source, row.payload, visibleName);
    name.appendChild(source);

    if (row.detail) {
      const detail = document.createElement("div");
      detail.textContent = row.detail;
      detail.style.cssText = `font-size:12px;opacity:.7;white-space:normal;`;
      name.appendChild(detail);
    }

    if (Array.isArray(row.addons) && row.addons.length) {
      const mods = document.createElement("div");
      mods.style.cssText = `
        display:flex;
        flex-wrap:wrap;
        gap:4px 8px;
        font-size:12px;
        opacity:.78;
      `;

      for (const addon of row.addons) {
        const holder = document.createElement("span");
        appendVendorSourceLink(holder, {
          name: addon.link,
          yamlName: addon.name,
          sourcePath: String(addon.id || "").endsWith(".md") ? String(addon.id) : ""
        }, addon.name);
        mods.appendChild(holder);
      }

      name.appendChild(mods);
    }

    const qty = document.createElement("div");
    qty.textContent = String(row.qty);
    qty.style.textAlign = "right";

    const cost = document.createElement("div");
    cost.textContent = String(row.cost);
    cost.style.textAlign = "right";

    const actions = document.createElement("div");
    actions.style.cssText = `
      display:flex;
      gap:5px;
      justify-content:flex-end;
      flex-wrap:wrap;
    `;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    buttonStyle(editBtn);

    const setQtyBtn = document.createElement("button");
    setQtyBtn.textContent = "Set Qty";
    buttonStyle(setQtyBtn);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    buttonStyle(removeBtn);

    if (row.core) {
      editBtn.disabled = true;
      editBtn.style.opacity = ".45";
      editBtn.title = "Use core charge controls instead.";
    }

    if (row.unique) {
      setQtyBtn.disabled = true;
      setQtyBtn.style.opacity = ".45";
      setQtyBtn.title = "Unique items and charged cores have quantity 1.";
    }

    editBtn.onclick = async () => {
      await openVendorItemEditor(row);
    };

    setQtyBtn.onclick = async () => {
      const raw = window.prompt(
        `Set quantity for ${row.name}`,
        String(row.qty)
      );

      if (raw === null) return;

      const next = Math.max(0, parseIntSafe(raw, row.qty));
      await setQuantity(row.id, next);
    };

    removeBtn.onclick = async () => {
      await setQuantity(row.id, 0);
    };

    actions.append(editBtn, setQtyBtn, removeBtn);
    el.append(name, qty, cost, actions);
    table.append(el);
  }

  if (!rows.length) {
    const empty = document.createElement("div");
    empty.textContent = "Vendor inventory is empty.";
    empty.style.cssText = `padding:10px;opacity:.75;`;
    table.append(empty);
  }
}

async function refreshVendor() {
  status.textContent = "Connecting...";

  try {
    vendor = await request("/api/vendor");
    activeVendorId = String(vendor?.vendorId || "").trim();

    await loadVendorList();

    status.textContent = "Connected";
    renderVendor();
    await refreshActivity();
  } catch (err) {
    status.textContent = `Offline: ${String(err?.message || err)}`;
  }
}

async function saveSettings() {
  try {
    const result = await request("/api/vendor/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameField.input.value.trim(),
        caps: Math.max(0, parseIntSafe(capsField.input.value, 0)),
        buyMultiplier: Math.max(0, Number(buyField.input.value || 0)),
        sellMultiplier: Math.max(0, Number(sellField.input.value || 0))
      })
    });

    vendor = result.vendor;
    activeVendorId = String(vendor?.vendorId || activeVendorId);
    await loadVendorList();
    status.textContent = "Settings saved";
    renderVendor();
  } catch (err) {
    status.textContent = `Save failed: ${String(err?.message || err)}`;
  }
}

async function setQuantity(itemId, quantity) {
  try {
    const result = await request("/api/vendor/inventory/set-quantity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity })
    });

    vendor = result.vendor;
    renderVendor();
  } catch (err) {
    status.textContent = `Quantity update failed: ${String(err?.message || err)}`;
  }
}

async function loadItemDefinitions() {
  const out = [];

  for (const file of app.vault.getMarkdownFiles()) {
    const category = recognizedItemCategory(file.path);
    if (!category) continue;

    const content = await app.vault.read(file);

    // Your item definitions store their data inside ```statblock fences, not
    // ordinary YAML frontmatter. Requiring frontmatter was why 1.1 found zero
    // items.
    const statblockMatch = content.match(/```statblock([\s\S]*?)```/i);
    if (!statblockMatch) continue;

    const block = statblockMatch[1];

    const costMatch = block.match(/^\s*cost:\s*(.+)$/im);
    if (!costMatch) continue;

    const rawCost = costMatch[1].trim().replace(/^["']|["']$/g, "");
    const cost = parseIntSafe(rawCost, NaN);
    if (!Number.isFinite(cost)) continue;

    const nameMatch = block.match(/^\s*name:\s*(.+)$/im);
    const rawName = nameMatch
      ? nameMatch[1].trim().replace(/^["']|["']$/g, "")
      : file.basename;

    const weightMatch = block.match(/^\s*weight:\s*(.+)$/im);
    const weight = weightMatch
      ? weightMatch[1].trim().replace(/^["']|["']$/g, "")
      : "";

    const rarityMatch =
      block.match(/^\s*item rarity\s*:\s*(.+)$/im) ||
      block.match(/^\s*rarity\s*:\s*(.+)$/im);
    const rarity = normalizeVendorRarity(
      rarityMatch ? cleanQuotedValue(rarityMatch[1]) : 3
    );

    const qtyFoundMatch =
      block.match(/^\s*qty[_ ]found\s*:\s*(.+)$/im) ||
      block.match(/^\s*quantity[_ ]found\s*:\s*(.+)$/im);
    const qtyFound = qtyFoundMatch
      ? cleanQuotedValue(qtyFoundMatch[1])
      : '';

    if (!rawName) continue;

    const typeMatch = block.match(/^\s*type:\s*(.+)$/im);
    const weaponType = typeMatch ? cleanQuotedValue(typeMatch[1]) : "";

    const locationsMatch = block.match(/^\s*locations:\s*(.+)$/im);
    const locations = locationsMatch ? cleanQuotedValue(locationsMatch[1]) : "";

    const vendorQtyClassMatch =
      block.match(/^\s*vendor[_ ]qty[_ ]class:\s*(.+)$/im) ||
      block.match(/^\s*vendorQuantityClass:\s*(.+)$/im);
    const vendorQtyMinMatch =
      block.match(/^\s*vendor[_ ]qty[_ ]min:\s*(.+)$/im) ||
      block.match(/^\s*vendorMinQty:\s*(.+)$/im);
    const vendorQtyMaxMatch =
      block.match(/^\s*vendor[_ ]qty[_ ]max:\s*(.+)$/im) ||
      block.match(/^\s*vendorMaxQty:\s*(.+)$/im);

    const vendorQtyClass = vendorQtyClassMatch
      ? cleanQuotedValue(vendorQtyClassMatch[1]).toLowerCase()
      : "";
    const vendorQtyMin = vendorQtyMinMatch
      ? parseIntSafe(cleanQuotedValue(vendorQtyMinMatch[1]), NaN)
      : NaN;
    const vendorQtyMax = vendorQtyMaxMatch
      ? parseIntSafe(cleanQuotedValue(vendorQtyMaxMatch[1]), NaN)
      : NaN;

    out.push({
      name: rawName,
      yamlName: file.basename,
      sourcePath: file.path,
      category,
      cost: Math.max(0, cost),
      weight,
      rarity,
      qtyFound,
      weaponType,
      locations,
      vendorQtyClass,
      vendorQtyMin,
      vendorQtyMax
    });
  }

  itemDefinitions = out.sort((a, b) => a.name.localeCompare(b.name));
  status.textContent = `Connected • ${itemDefinitions.length} items available`;
}

function closeDropdown() {
  dropdown.style.display = "none";
}

function renderDropdown() {
  const q = searchInput.value.trim().toLowerCase();
  dropdown.innerHTML = "";

  const matches = itemDefinitions
    .filter(item => !q || item.name.toLowerCase().includes(q))
    .slice(0, 50);

  if (!matches.length) {
    const none = document.createElement("div");
    none.textContent = "No matching items";
    none.style.cssText = `padding:8px;opacity:.7;`;
    dropdown.append(none);
    dropdown.style.display = "block";
    return;
  }

  for (const item of matches) {
    const option = document.createElement("div");
    option.style.cssText = `
      padding:7px 9px;
      cursor:pointer;
      border-bottom:1px solid rgba(243,198,77,.10);
    `;

    option.textContent = `${item.name}  •  ${item.cost}`;

    option.onmouseenter = () => {
      option.style.background = "rgba(243,198,77,.10)";
    };

    option.onmouseleave = () => {
      option.style.background = "transparent";
    };

    option.onclick = () => {
      selectedDefinition = item;
      searchInput.value = item.name;
      customNameField.input.value = "";
      customValueField.input.value = String(item.cost);
      selectedLabel.textContent = `${item.name} — ${item.sourcePath}`;
      closeDropdown();
    };

    dropdown.append(option);
  }

  dropdown.style.display = "block";
}

async function addSelectedItem() {
  if (!selectedDefinition) {
    status.textContent = "Select an item first.";
    return;
  }

  const qty = Math.max(1, parseIntSafe(addQtyField.input.value, 1));
  const baseValue = Math.max(
    0,
    parseIntSafe(customValueField.input.value, selectedDefinition.cost)
  );
  const customName = normalizeInstanceName(customNameField.input.value);

  const isSpecialty =
    !!customName ||
    baseValue !== selectedDefinition.cost;

  const payload = {
    name: `[[${selectedDefinition.yamlName}]]`,
    yamlName: selectedDefinition.yamlName,
    sourcePath: selectedDefinition.sourcePath,
    category: selectedDefinition.category,
    cost: baseValue,
    baseCost: baseValue,
    weight: selectedDefinition.weight,
    qty: String(qty)
  };

  // A specialty name or manual value represents a distinct physical instance.
  // Multiple requested copies become separate specialty instances server-side.
  if (isSpecialty) {
    payload.instanceId = makeInstanceId("vendor");
    if (customName) payload.instanceName = customName;
    if (baseValue !== selectedDefinition.cost) {
      payload.baseCostOverride = baseValue;
    }
  }

  const coreType = getCoreType(payload);

  if (coreType) {
    const maxCharge = coreType === "fusion" ? 100 : 500;
    const raw = window.prompt(
      `${selectedDefinition.name} charge (0-${maxCharge})`,
      String(maxCharge)
    );

    if (raw === null) return;

    const charge = Math.max(
      0,
      Math.min(maxCharge, parseIntSafe(raw, maxCharge))
    );

    payload.chargeUnits = [];

    for (let i = 0; i < qty; i++) {
      if (coreType === "fusion") {
        payload.chargeUnits.push({
          instanceId: makeInstanceId("core"),
          charges: charge,
          maxCharges: 100,
          weaponShotsRemaining: charge * 50
        });
      } else {
        payload.chargeUnits.push({
          instanceId: makeInstanceId("core"),
          charges: charge
        });
      }
    }

    delete payload.instanceId;
    payload.qty = String(payload.chargeUnits.length);
  }

  try {
    const result = await request("/api/vendor/inventory/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, qty })
    });

    vendor = result.vendor;
    status.textContent = "Item added";

    selectedDefinition = null;
    searchInput.value = "";
    selectedLabel.textContent = "No item selected";
    customNameField.input.value = "";
    customValueField.input.value = "";
    addQtyField.input.value = "1";

    renderVendor();
  } catch (err) {
    status.textContent = `Add failed: ${String(err?.message || err)}`;
  }
}

connectBtn.onclick = refreshVendor;
saveBtn.onclick = saveSettings;
addBtn.onclick = addSelectedItem;

vendorSelect.addEventListener("change", async () => {
  await activateVendor(vendorSelect.value);
});

newVendorBtn.onclick = openNewVendorModal;
duplicateVendorBtn.onclick = openDuplicateVendorModal;
saveTemplateBtn.onclick = saveCurrentVendorTemplate;
restockBtn.onclick = restockMissingVendorStock;
resetVendorBtn.onclick = resetVendorToTemplate;
regenerateVendorBtn.onclick = regenerateVendorStock;
deleteVendorBtn.onclick = deleteActiveVendor;

clearAllReservationsBtn.onclick = async () => {
  if (!activeVendorId) return;
  const confirmed = window.confirm("Clear every active reservation for this vendor?");
  if (!confirmed) return;
  try {
    const result = await request("/api/reservations/admin/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorId: activeVendorId })
    });
    renderReservations(result.reservations);
    status.textContent = "All reservations cleared";
  } catch (err) {
    status.textContent = `Clear failed: ${String(err?.message || err)}`;
  }
};

refreshActivityBtn.onclick = refreshActivity;

const activityPollTimer = window.setInterval(() => {
  if (!root.isConnected) {
    window.clearInterval(activityPollTimer);
    return;
  }
  refreshActivity();
}, 5000);

searchInput.addEventListener("focus", renderDropdown);
searchInput.addEventListener("input", () => {
  selectedDefinition = null;
  selectedLabel.textContent = "No item selected";
  renderDropdown();
});

document.addEventListener("click", (e) => {
  if (!pickerWrap.contains(e.target)) closeDropdown();
});

await loadItemDefinitions();
await refreshVendor();

return root;
```