```js-engine
/******************************************************************
 * VENDOR BUILDER (Exports vendorState JSON for Trade Menu Import)
 * - Five categories only: WEAPONS, AMMO, APPAREL, CONSUMABLES, MISC
 * - Rarity parsing supports:
 *      rarity: "1"
 *      item rarity: "1"
 *   numeric 1..6
 * - No duplicates ever
 * - Qty must be >= 1; otherwise item is excluded
 * - Excluded folders constant
 * - Exports: { version:1, vendorId, vendorState } to clipboard
 ******************************************************************/

/* =========================
   CONSTANTS (EDIT THESE)
   ========================= */

const BUILDER_VERSION = 1;

// Folder roots to scan. Keep these aligned with your vault structure.
const ITEM_SEARCH_FOLDERS = [
  "Fallout-RPG/Items/Weapons",
  "Fallout-RPG/Items/Ammo",
  "Fallout-RPG/Items/Apparel",
  "Fallout-RPG/Items/Consumables",
  "Fallout-RPG/Items/Tools and Utilities"
];

// Any paths starting with these prefixes will be excluded entirely.
const EXCLUDED_FOLDERS = [
  // Examples (edit freely)
  "Fallout-RPG/Items/Weapons/Unique",
  "Fallout-RPG/Items/Weapons/Custom",
  "Fallout-RPG/Items/Apparel/Unique",
  "Fallout-RPG/Items/Consumables/Quest",
   "Fallout-RPG/Items/Tools and Utilities/Books and Magazines"
];

// Storage for builder settings + cached index (builder-only).
const BUILDER_STORAGE_KEY = "trade_vendor_builder_settings_v1";
const INDEX_CACHE_KEY = "trade_vendor_builder_item_index_cache_v1";

// Safety limits
const MAX_FILES_TO_SCAN = 25000; // vault-wide cap; we still filter by folder
const MAX_GENERATION_ATTEMPTS = 5000; // prevents infinite loops if pool is too small

/* =========================
   PROFILES (EDIT/EXTEND)
   ========================= */

const PROFILES = [
  {
    id: "general_store",
    label: "General Store",
    categoryWeights: { FOOD: 20, CHEMS: 15, AMMO: 15, APPAREL: 15, WEAPONS: 15, MISC: 20 },
    guarantees: [],
  },
  {
    id: "weapons_dealer",
    label: "Weapons Dealer",
    categoryWeights: { WEAPONS: 55, AMMO: 35, APPAREL: 10, FOOD: 0, CHEMS: 0, MISC: 0 },
    guarantees: ["WEAPONS", "AMMO"],
  },
  {
    id: "doctor",
    label: "Doctor / Clinic",
    categoryWeights: { FOOD: 35, CHEMS: 35, MISC: 15, APPAREL: 5, AMMO: 5, WEAPONS: 5 },
    guarantees: ["CHEMS"],
  },
  {
    id: "armorer_outfitter",
    label: "Armorer / Outfitter",
    categoryWeights: { APPAREL: 55, WEAPONS: 15, MISC: 15, FOOD: 5, CHEMS: 5, AMMO: 5 },
    guarantees: ["APPAREL"],
  },
  {
    id: "mechanic",
    label: "Mechanic / Utility",
    categoryWeights: { MISC: 55, WEAPONS: 15, APPAREL: 10, FOOD: 5, CHEMS: 5, AMMO: 10 },
    guarantees: ["MISC"],
  },
  {
    id: "cook",
    label: "Cook",
    categoryWeights: { MISC: 0, WEAPONS: 5, APPAREL: 0, FOOD: 95, CHEMS: 5, AMMO: 0 },
    guarantees: ["FOOD"],
  }
];

const TIERS = [
  { id: "poor", label: "Poor", capsMin: 50, capsMax: 75, itemsMin: 8, itemsMax: 14 },
  { id: "average", label: "Average", capsMin: 150, capsMax: 450, itemsMin: 12, itemsMax: 20 },
  { id: "well_stocked", label: "Well-Stocked", capsMin: 300, capsMax: 900, itemsMin: 16, itemsMax: 26 },
  { id: "elite", label: "Elite", capsMin: 600, capsMax: 1600, itemsMin: 20, itemsMax: 34 },
];

// Rarity bias → weights for rarity 1..6
const RARITY_BIASES = [
  {
    id: "scarce",
    label: "Scarce",
    weights: { 1: 42, 2: 28, 3: 18, 4: 8, 5: 3, 6: 1 }
  },
  {
    id: "normal",
    label: "Normal",
    weights: { 1: 34, 2: 26, 3: 20, 4: 12, 5: 6, 6: 2 }
  },
  {
    id: "generous",
    label: "Generous",
    weights: { 1: 26, 2: 22, 3: 20, 4: 16, 5: 10, 6: 6 }
  }
];

// Quantity rules per category (lines are unique; qty is stack size)
const QTY_RULES = {
  AMMO:        { min: 3, max: 150 },
  CHEMS:       { min: 1,  max: 25 },
  FOOD:        { min: 1,  max: 25 },
  WEAPONS:     { min: 1,  max: 3 },
  APPAREL:     { min: 1,  max: 3 },
  MISC:        { min: 1,  max: 4 },
};

// Tier-based quantity scaling (breadth already handled by tier.itemsMin/itemsMax)
const TIER_QTY_MULT = {
  poor: 0.15,
  average: 0.35,
  well_stocked: 1.45,
  elite: 1.9,
};

// Rarity-based inverse quantity scaling (rarity 1..6)
// Higher rarity => fewer items
const RARITY_QTY_MULT = {
  1: 1.00,
  2: 0.80,
  3: 0.65,
  4: 0.45,
  5: 0.25,
  6: 0.10,
};

// Optional hard caps by category (prevents silly stacks even after multipliers)
const CATEGORY_QTY_CAP = {
  AMMO: 200,         // adjust as you like
  CHEMS: 40,
  FOOD: 40,
  WEAPONS: 3,
  APPAREL: 3,
  MISC: 3,
};

/* =========================
   UTILITIES
   ========================= */

const vault = app.vault;

function nowMs() { return Date.now(); }

function startsWithAny(path, prefixes) {
  return prefixes.some(p => path.startsWith(p));
}

function inAnyFolder(path, roots) {
  return roots.some(r => path.startsWith(r));
}

function normalizeCategoryFromPath(path) {
  // Deterministic mapping to your 5 categories.
  if (path.includes("/Items/Weapons/") || path.startsWith("Fallout-RPG/Items/Weapons")) return "WEAPONS";
  if (path.includes("/Items/Ammo/") || path.startsWith("Fallout-RPG/Items/Ammo")) return "AMMO";
  if (path.includes("/Items/Apparel/") || path.startsWith("Fallout-RPG/Items/Apparel")) return "APPAREL";
  if (path.includes("/Items/Consumables/") || path.startsWith("Fallout-RPG/Items/Food")) return "FOOD";
  if (path.includes("/Items/Consumables/") || path.startsWith("Fallout-RPG/Items/Beverages")) return "FOOD";
  if (path.includes("/Items/Consumables/") || path.startsWith("Fallout-RPG/Items/Chems")) return "CHEMS";
  if (path.includes("/Items/Tools and Utilities") || path.startsWith("Fallout-RPG/Items/Tools and Utilities"))return "MISC";
}

function normalizeRarity(value) {
  const r = Number(value);
  if (!Number.isFinite(r)) return 3;
  return Math.min(6, Math.max(1, Math.round(r)));
}

// Simple, deterministic PRNG (mulberry32). Seed from string.
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}
function mulberry32(a) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeRng(seedStr) {
  const seedFn = xmur3(String(seedStr ?? ""));
  return mulberry32(seedFn());
}
function rollInt(rng, min, max) {
  const a = Math.min(min, max);
  const b = Math.max(min, max);
  return a + Math.floor(rng() * (b - a + 1));
}

function weightedPick(rng, entries) {
  // entries: [{ key, w }]
  let total = 0;
  for (const e of entries) total += Math.max(0, Number(e.w) || 0);
  if (total <= 0) return null;
  let t = rng() * total;
  for (const e of entries) {
    t -= Math.max(0, Number(e.w) || 0);
    if (t <= 0) return e.key;
  }
  return entries[entries.length - 1]?.key ?? null;
}

async function setClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

function showNotice(text) {
  const host = document.body || document.documentElement;
  const n = document.createElement("div");
  n.textContent = text;
  n.style.cssText = `
    position:fixed; right:14px; bottom:14px; z-index:999999;
    background:#2e4663; color:#ffc200; border:1px solid #ffc200;
    padding:10px 12px; border-radius:10px; box-shadow:0 8px 28px rgba(0,0,0,0.35);
    max-width:360px;
  `;
  host.appendChild(n);
  setTimeout(() => n.remove(), 2200);
}



/* =========================
   PARSING (RARITY + COST)
   ========================= */

// Rarity parsing supports `item rarity:` and `rarity:`
// We parse from raw file text; your cost parsing should mirror Trade Menu.
// For cost: we assume your Trade Menu already has a robust parser.
// Below is a conservative parser that you can replace with your Trade Menu
// function verbatim if you paste it in later.

function parseRarityFromText(text) {
  // Prefer "item rarity" over "rarity"
  const m1 = text.match(/^\s*item rarity\s*:\s*"?(\d+)"?\s*$/im);
  if (m1) return normalizeRarity(m1[1]);

  const m2 = text.match(/^\s*rarity\s*:\s*"?(\d+)"?\s*$/im);
  if (m2) return normalizeRarity(m2[1]);

  return 3;
}

function parseCostFromText(content) {
  let cost = "0";

  const statblockMatch = content.match(/```statblock([\s\S]*?)```/);
  if (statblockMatch) {
    const block = statblockMatch[1].trim();
    const costMatch = block.match(/cost:\s*(.+)/i);
    if (costMatch) cost = costMatch[1].trim().replace(/"/g, "");
  }

  // Convert to int the same way Trade Menu ultimately does (parseCapsInt-equivalent)
  const n = Number.parseInt(String(cost).trim(), 10);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}


function toWikiLinkFromFile(file) {
  // Use Obsidian basename, match your Trade Menu convention: [[Name]]
  return `[[${file.basename}]]`;
}

/* =========================
   ITEM INDEX BUILD + CACHE
   ========================= */

async function buildItemIndex() {
  const allFiles = vault.getFiles();
  if (allFiles.length > MAX_FILES_TO_SCAN) {
    console.warn(`Vault has ${allFiles.length} files; scanning will still filter by folder roots.`);
  }

  const candidates = allFiles.filter(f => {
    const p = f.path;
    if (!inAnyFolder(p, ITEM_SEARCH_FOLDERS)) return false;
    if (startsWithAny(p, EXCLUDED_FOLDERS)) return false;
    // Only markdown notes
    if (!p.toLowerCase().endsWith(".md")) return false;
    return true;
  });

  const index = [];
  for (const f of candidates) {
    let text = "";
    try {
      text = await vault.read(f);
    } catch (e) {
      console.warn("Failed to read", f.path, e);
      continue;
    }

    const category = normalizeCategoryFromPath(f.path);
    const rarity = parseRarityFromText(text);
    const baseCost = parseCostFromText(text); // replace with Trade Menu logic if you want exact parity
    const name = toWikiLinkFromFile(f);

    index.push({
      name,
      category,
      rarity,
      baseCost,
      sourcePath: f.path
    });
  }

  return index;
}

function saveIndexCache(index) {
  const payload = {
    builtAt: nowMs(),
    count: index.length,
    index
  };
  localStorage.setItem(INDEX_CACHE_KEY, JSON.stringify(payload));
}

function loadIndexCache() {
  const raw = localStorage.getItem(INDEX_CACHE_KEY);
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    if (!obj || !Array.isArray(obj.index)) return null;
    return obj;
  } catch {
    return null;
  }
}

/* =========================
   GENERATION
   ========================= */

function getProfile(profileId) {
  return PROFILES.find(p => p.id === profileId) ?? PROFILES[0];
}
function getTier(tierId) {
  return TIERS.find(t => t.id === tierId) ?? TIERS[1];
}
function getRarityBias(biasId) {
  return RARITY_BIASES.find(b => b.id === biasId) ?? RARITY_BIASES[1];
}

function buildVendorStateRandom({ vendorId, cfg, itemIndex }) {
  const seed = String(cfg.seed || `vendor:${vendorId}:${nowMs()}`);
  const rng = makeRng(seed);

  const profile = getProfile(cfg.profileId);
  const tier = getTier(cfg.tierId);
  const bias = getRarityBias(cfg.rarityBiasId);

  const caps = rollInt(rng, tier.capsMin, tier.capsMax);
  const targetLines = rollInt(rng, tier.itemsMin, tier.itemsMax);

  // Candidate pool filtered only by categories (five categories already)
  // and optional player/world level cap if you later want it.
  const pool = itemIndex.slice(); // copy

  // Helper: produce weighted entries for category choice
  const categoryEntry = Object.entries(profile.categoryWeights).map(([key, w]) => ({ key, w }));

  // To enforce no duplicates:
  const usedNames = new Set();

  const inventory = [];

  // Guarantee pass (ensures certain categories appear if possible)
  const guarantees = Array.isArray(profile.guarantees) ? profile.guarantees : [];
  for (const cat of guarantees) {
    const picked = pickOneItemForCategory({ rng, pool, usedNames, category: cat, rarityWeights: bias.weights, tierId: tier.id });
    if (picked) inventory.push(picked);
  }

  let attempts = 0;
  while (inventory.length < targetLines && attempts < MAX_GENERATION_ATTEMPTS) {
    attempts++;

    // choose category to pull from
    const category = weightedPick(rng, categoryEntry) || "MISC";
    const picked = pickOneItemForCategory({ rng, pool, usedNames, category, rarityWeights: bias.weights, tierId: tier.id });
    if (!picked) continue;

    inventory.push(picked);
  }

  // Note: if pool exhausted, inventory may be < targetLines; this is acceptable and will be shown in UI.

  return {
    vendorId,
    caps,
    inventory,
    mode: "random",
    randomConfig: {
      profileId: profile.id,
      tierId: tier.id,
      rarityBiasId: bias.id,
      seed,
      excludedFolders: EXCLUDED_FOLDERS.slice()
    },
    lastBuiltAt: nowMs()
  };
}

function pickOneItemForCategory({ rng, pool, usedNames, category, rarityWeights, tierId }) {
  // Filter pool to category + not used
  const candidates = pool.filter(it => it.category === category && !usedNames.has(it.name));
  if (!candidates.length) return null;

  // Weighted rarity pick first (1..6), then pick an item of that rarity
  const rarityEntries = Object.entries(rarityWeights).map(([k, w]) => ({ key: Number(k), w }));
  const pickedRarity = weightedPick(rng, rarityEntries);

  // Prefer picked rarity, but gracefully fall back if none exist
  let byR = candidates.filter(it => it.rarity === pickedRarity);
  if (!byR.length) {
    // fallback: nearest rarities outward
    const order = [1,2,3,4,5,6].sort((a,b) => Math.abs(a - pickedRarity) - Math.abs(b - pickedRarity));
    for (const r of order) {
      byR = candidates.filter(it => it.rarity === r);
      if (byR.length) break;
    }
  }
  if (!byR.length) return null;

  const it = byR[Math.floor(rng() * byR.length)];
  if (!it) return null;

  // Roll quantity by category; enforce qty >= 1 (otherwise exclude)
  const rule = QTY_RULES[category] || { min: 1, max: 1 };

  // Base roll
  let qty = rollInt(rng, rule.min, rule.max);

  // Apply tier + rarity multipliers
  const tierMult = TIER_QTY_MULT[tierId] ?? 1.0;
  const rarityMult = RARITY_QTY_MULT[it.rarity] ?? 1.0;

  qty = Math.round(qty * tierMult * rarityMult);

  // Enforce qty >= 1 (otherwise exclude item)
  if (!Number.isFinite(qty) || qty < 1) return null;

  // Optional hard cap
  const cap = CATEGORY_QTY_CAP[category];
  if (Number.isFinite(cap)) qty = Math.min(qty, cap);


  usedNames.add(it.name);

  return {
    name: it.name,
    qty,
    baseCost: Number(it.baseCost) || 0,
    category: it.category
  };
}

/* =========================
   SETTINGS PERSISTENCE
   ========================= */

function loadSettings() {
  try {
    const raw = localStorage.getItem(BUILDER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function saveSettings(s) {
  localStorage.setItem(BUILDER_STORAGE_KEY, JSON.stringify(s));
}

/* =========================
   UI
   ========================= */

const root = document.createElement("div");
root.style.border = "2px solid #325886";
root.style.borderRadius = "12px";
root.style.padding = "12px";
root.style.background = "#325886";
root.style.color = "#fde4c9";
root.style.fontFamily = "inherit";

const title = document.createElement("div");
title.textContent = "Vendor Builder (Exports to Trade Menu Import)";
title.style.fontWeight = "800";
title.style.marginBottom = "10px";
root.appendChild(title);

function mkRow() {
  const row = document.createElement("div");
  row.style.display = "grid";
  row.style.gridTemplateColumns = "160px 1fr";
  row.style.gap = "8px";
  row.style.alignItems = "center";
  row.style.marginBottom = "8px";
  return row;
}

function mkLabel(text) {
  const l = document.createElement("div");
  l.textContent = text;
  l.style.fontWeight = "700";
  return l;
}

function mkInput() {
  const i = document.createElement("input");
  i.type = "text";
  i.style.width = "100%";
  i.style.padding = "6px 8px";
  i.style.borderRadius = "8px";
  i.style.border = "1px solid #325886";
  i.style.background = "#fde4c9";
  i.style.color = "#000";
  return i;
}

function mkSelect(options) {
  const s = document.createElement("select");
  s.style.width = "100%";
  s.style.padding = "6px 8px";
  s.style.borderRadius = "8px";
  s.style.border = "1px solid #325886";
  s.style.background = "#fde4c9";
  s.style.color = "#000";
  for (const opt of options) {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = opt.label;
    s.appendChild(o);
  }
  return s;
}

function mkBtn(text) {
  const b = document.createElement("button");
  b.textContent = text;
  b.style.padding = "8px 10px";
  b.style.borderRadius = "10px";
  b.style.border = "2px solid #325886";
  b.style.background = "#efdd6f";
  b.style.color = "#000";
  b.style.fontWeight = "800";
  b.style.cursor = "pointer";
  return b;
}

const settings = loadSettings() || {
  vendorId: "default_vendor",
  profileId: PROFILES[0].id,
  tierId: TIERS[1].id,
  rarityBiasId: RARITY_BIASES[1].id,
  seed: "",
};

const vendorIdRow = mkRow();
vendorIdRow.appendChild(mkLabel("Vendor Id"));
const vendorIdInput = mkInput();
vendorIdInput.value = settings.vendorId;
vendorIdRow.appendChild(vendorIdInput);
root.appendChild(vendorIdRow);

const profileRow = mkRow();
profileRow.appendChild(mkLabel("Profile"));
const profileSelect = mkSelect(PROFILES.map(p => ({ value: p.id, label: p.label })));
profileSelect.value = settings.profileId;
profileRow.appendChild(profileSelect);
root.appendChild(profileRow);

const tierRow = mkRow();
tierRow.appendChild(mkLabel("Tier / Wealth"));
const tierSelect = mkSelect(TIERS.map(t => ({ value: t.id, label: t.label })));
tierSelect.value = settings.tierId;
tierRow.appendChild(tierSelect);
root.appendChild(tierRow);

const biasRow = mkRow();
biasRow.appendChild(mkLabel("Rarity Bias"));
const biasSelect = mkSelect(RARITY_BIASES.map(b => ({ value: b.id, label: b.label })));
biasSelect.value = settings.rarityBiasId;
biasRow.appendChild(biasSelect);
root.appendChild(biasRow);

const seedRow = mkRow();
seedRow.appendChild(mkLabel("Seed (optional)"));
const seedInput = mkInput();
seedInput.placeholder = "Leave blank for random";
seedInput.value = settings.seed || "";
seedRow.appendChild(seedInput);
root.appendChild(seedRow);

const btnRow = document.createElement("div");
btnRow.style.display = "flex";
btnRow.style.gap = "8px";
btnRow.style.marginTop = "10px";
btnRow.style.marginBottom = "10px";

const rebuildIndexBtn = mkBtn("Rebuild Item Index");
const generateBtn = mkBtn("Generate Vendor");
const copyBtn = mkBtn("Copy Export JSON");

btnRow.appendChild(rebuildIndexBtn);
btnRow.appendChild(generateBtn);
btnRow.appendChild(copyBtn);
root.appendChild(btnRow);

const status = document.createElement("div");
status.style.marginBottom = "8px";
status.style.opacity = "0.9";
root.appendChild(status);

function createInternalLink(wikiText) {
  // wikiText like: [[Stimpak]] or [[Path/Note|Alias]]
  const m = String(wikiText || "").match(/^\s*\[\[([\s\S]+?)\]\]\s*$/);
  const inside = m ? m[1] : String(wikiText || "");
  const [targetRaw, aliasRaw] = inside.split("|");

  const target = (targetRaw || "").trim();
  const alias = (aliasRaw || targetRaw || "").trim();

  const a = document.createElement("a");
  a.className = "internal-link";
  a.setAttribute("data-href", target);
  a.setAttribute("href", target); // Obsidian uses data-href, but href helps too
  a.textContent = alias || target || wikiText;

  return a;
}

const preview = document.createElement("div");
preview.style.marginTop = "10px";
root.appendChild(preview);

let itemIndexCache = loadIndexCache();
let currentVendorState = null;

function setStatus(msg) {
  status.textContent = msg;
}

function renderPreview(vendorState, meta) {
  preview.innerHTML = "";

  if (!vendorState) return;

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.flexWrap = "wrap";
  header.style.gap = "12px";
  header.style.marginBottom = "8px";
  header.innerHTML = `
    <div><b>Vendor:</b> ${vendorState.vendorId}</div>
    <div><b>Caps:</b> ${vendorState.caps}</div>
    <div><b>Items:</b> ${vendorState.inventory.length}${meta?.targetLines ? ` / ${meta.targetLines}` : ""}</div>
    <div><b>Mode:</b> ${vendorState.mode}</div>
  `;
  preview.appendChild(header);

  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.background = "#111823";
  table.style.borderRadius = "10px";
  table.style.overflow = "hidden";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th style="text-align:left;padding:8px;border-bottom:1px solid #325886;">Item</th>
      <th style="text-align:right;padding:8px;border-bottom:1px solid #325886;">Qty</th>
      <th style="text-align:right;padding:8px;border-bottom:1px solid #325886;">Cost</th>
      <th style="text-align:left;padding:8px;border-bottom:1px solid #325886;">Category</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (const it of vendorState.inventory) {
    const tr = document.createElement("tr");

	const tdName = document.createElement("td");
	tdName.style.cssText = "padding:8px;border-bottom:1px solid rgba(50,88,134,0.35);";
	tdName.appendChild(createInternalLink(it.name));
	
	const tdQty = document.createElement("td");
	tdQty.style.cssText = "padding:8px;border-bottom:1px solid rgba(50,88,134,0.35);text-align:right;";
	tdQty.textContent = String(it.qty);
	
	const tdCost = document.createElement("td");
	tdCost.style.cssText = "padding:8px;border-bottom:1px solid rgba(50,88,134,0.35);text-align:right;";
	tdCost.textContent = String(it.baseCost);
	
	const tdCat = document.createElement("td");
	tdCat.style.cssText = "padding:8px;border-bottom:1px solid rgba(50,88,134,0.35);";
	tdCat.textContent = String(it.category);
	
	tr.append(tdName, tdQty, tdCost, tdCat);
	tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  preview.appendChild(table);

  const cfg = vendorState.randomConfig || {};
  const cfgBox = document.createElement("pre");
  cfgBox.style.marginTop = "10px";
  cfgBox.style.padding = "10px";
  cfgBox.style.border = "1px solid #325886";
  cfgBox.style.borderRadius = "10px";
  cfgBox.style.background = "#0b0f14";
  cfgBox.style.whiteSpace = "pre-wrap";
  cfgBox.textContent = JSON.stringify(cfg, null, 2);
  preview.appendChild(cfgBox);
}

async function ensureIndexLoaded() {
  if (itemIndexCache?.index?.length) {
    setStatus(`Using cached index (${itemIndexCache.count} items). Built at ${new Date(itemIndexCache.builtAt).toLocaleString()}.`);
    return itemIndexCache.index;
  }
  setStatus("No cached index found. Click 'Rebuild Item Index' first.");
  return null;
}

function persistSettings() {
  const s = {
    vendorId: vendorIdInput.value.trim() || "default_vendor",
    profileId: profileSelect.value,
    tierId: tierSelect.value,
    rarityBiasId: biasSelect.value,
    seed: seedInput.value
  };
  saveSettings(s);
}

rebuildIndexBtn.onclick = async () => {
  persistSettings();
  setStatus("Building item index (this may take a moment)...");
  const index = await buildItemIndex();
  saveIndexCache(index);
  itemIndexCache = loadIndexCache();
  setStatus(`Index built: ${index.length} items (excluded folders applied).`);
  showNotice(`Index built: ${index.length} items`);
};

generateBtn.onclick = async () => {
  persistSettings();
  const index = await ensureIndexLoaded();
  if (!index) return;

  const vendorId = vendorIdInput.value.trim() || "default_vendor";
  const cfg = {
    profileId: profileSelect.value,
    tierId: tierSelect.value,
    rarityBiasId: biasSelect.value,
    seed: seedInput.value.trim() || ""
  };

  // For preview meta: compute targetLines as the tier roll would be, but we keep it internal.
  const tier = getTier(cfg.tierId);
  const rng = makeRng(String(cfg.seed || `vendor:${vendorId}:${nowMs()}`));
  const targetLines = rollInt(rng, tier.itemsMin, tier.itemsMax);

  currentVendorState = buildVendorStateRandom({ vendorId, cfg, itemIndex: index });
  setStatus(`Generated vendor: ${vendorId} (${currentVendorState.inventory.length} items).`);
  renderPreview(currentVendorState, { targetLines });
};

copyBtn.onclick = async () => {
  persistSettings();
  if (!currentVendorState) {
    showNotice("Generate a vendor first.");
    return;
  }

  const payload = {
    version: BUILDER_VERSION,
    vendorId: currentVendorState.vendorId,
    vendorState: currentVendorState
    // session intentionally omitted
  };

  const ok = await setClipboard(JSON.stringify(payload, null, 2));
  showNotice(ok ? "Export copied to clipboard. Paste into Trade Menu Import." : "Clipboard failed. Try again.");
};

// Initial status
if (itemIndexCache?.index?.length) {
  setStatus(`Cached index found (${itemIndexCache.count} items). Ready to generate.`);
} else {
  setStatus("No index cache yet. Click 'Rebuild Item Index' to begin.");
}

/* ----------------------------- Mount in Note ------------------------------- */
return root;

```