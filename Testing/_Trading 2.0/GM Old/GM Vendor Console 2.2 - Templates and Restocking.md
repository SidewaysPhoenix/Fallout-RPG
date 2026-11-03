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
  { id: "well_stocked", label: "Well-Stocked", capsMin: 300, capsMax: 900, itemsMin: 16, itemsMax: 55 },
  { id: "elite", label: "Elite", capsMin: 600, capsMax: 1600, itemsMin: 20, itemsMax: 100 }
];

const VENDOR_GENERATOR_RARITY = [
  { id: "scarce", label: "Scarce", weights: { 0: 46, 1: 28, 2: 14, 3: 7, 4: 5, 5: 0, 6: 0 } },
  { id: "normal", label: "Normal", weights: { 0: 34, 1: 24, 2: 18, 3: 12, 4: 7, 5: 3, 6: 2 } },
  { id: "generous", label: "Generous", weights: { 0: 24, 1: 20, 2: 18, 3: 14, 4: 10, 5: 8, 6: 3 } }
];

const VENDOR_GENERATOR_QTY_RULES = {
  AMMO: { min: 1, max: 150 },
  CHEMS: { min: 1, max: 25 },
  FOOD: { min: 1, max: 25 },
  WEAPONS: { min: 1, max: 10 },
  APPAREL: { min: 1, max: 3 },
  MISC: { min: 1, max: 4 }
};

const VENDOR_GENERATOR_TIER_QTY = {
  poor: 0.15,
  average: 0.40,
  well_stocked: 0.8,
  elite: 1.0
};

const VENDOR_GENERATOR_RARITY_QTY = {
  0: 1.15, 1: 1.00, 2: 0.80, 3: 0.65, 4: 0.45, 5: 0.25, 6: 0.10
};

const VENDOR_GENERATOR_QTY_CAP = {
  AMMO: 200,
  CHEMS: 40,
  FOOD: 40,
  WEAPONS: 3,
  APPAREL: 3,
  MISC: 3
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

function generateVendorInventory({ profileId, tierId, rarityBiasId, seed, vendorName }) {
  const profile = VENDOR_GENERATOR_PROFILES.find(x => x.id === profileId) || VENDOR_GENERATOR_PROFILES[0];
  const tier = VENDOR_GENERATOR_TIERS.find(x => x.id === tierId) || VENDOR_GENERATOR_TIERS[1];
  const rarityBias = VENDOR_GENERATOR_RARITY.find(x => x.id === rarityBiasId) || VENDOR_GENERATOR_RARITY[1];
  const resolvedSeed = String(seed || `vendor:${vendorName}:${Date.now()}`);
  const rng = makeVendorRng(resolvedSeed);

  const pool = itemDefinitions.filter(item => !isVendorGeneratorExcluded(item.sourcePath));
  const targetLines = vendorRollInt(rng, tier.itemsMin, tier.itemsMax);
  const caps = vendorRollInt(rng, tier.capsMin, tier.capsMax);
  const used = new Set();
  const inventory = [];

  const pickCategoryItem = category => {
    const candidates = pool.filter(item =>
      item.category === category &&
      !used.has(item.sourcePath)
    );
    if (!candidates.length) return null;

    const rarityEntries = Object.entries(rarityBias.weights).map(([key, w]) => ({ key: Number(key), w }));
    const wantedRarity = vendorWeightedPick(rng, rarityEntries);

    let rarityCandidates = candidates.filter(item => item.rarity === wantedRarity);
    if (!rarityCandidates.length) {
      const order = [0,1,2,3,4,5,6].sort((a,b) => Math.abs(a - wantedRarity) - Math.abs(b - wantedRarity));
      for (const rarity of order) {
        rarityCandidates = candidates.filter(item => item.rarity === rarity);
        if (rarityCandidates.length) break;
      }
    }

    if (!rarityCandidates.length) return null;
    const item = rarityCandidates[Math.floor(rng() * rarityCandidates.length)];
    if (!item) return null;

    const rule = VENDOR_GENERATOR_QTY_RULES[category] || { min: 1, max: 1 };
    let qty = vendorRollInt(rng, rule.min, rule.max);
    qty = Math.round(
      qty *
      (VENDOR_GENERATOR_TIER_QTY[tier.id] ?? 1) *
      (VENDOR_GENERATOR_RARITY_QTY[item.rarity] ?? 1)
    );

    if (!Number.isFinite(qty) || qty < 1) return null;
    const cap = VENDOR_GENERATOR_QTY_CAP[category];
    if (Number.isFinite(cap)) qty = Math.min(qty, cap);

    used.add(item.sourcePath);

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
  };

  for (const category of (profile.guarantees || [])) {
    const item = pickCategoryItem(category);
    if (item) inventory.push(item);
  }

  const categoryEntries = Object.entries(profile.categoryWeights).map(([key, w]) => ({ key, w }));
  let attempts = 0;
  while (inventory.length < targetLines && attempts < 5000) {
    attempts += 1;
    const category = vendorWeightedPick(rng, categoryEntries) || "MISC";
    const item = pickCategoryItem(category);
    if (item) inventory.push(item);
  }

  return {
    caps,
    inventory,
    targetLines,
    randomConfig: {
      profileId: profile.id,
      tierId: tier.id,
      rarityBiasId: rarityBias.id,
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
  max-width:1100px;
  margin:0 auto;
  background:#021509ad;
  color:#1AFF80;
  border:2px solid #1AFF80;
  padding:14px;
  box-sizing:border-box;
  font-family:inherit;
`;

function buttonStyle(btn) {
  btn.style.cssText = `
    background:#021509ad;
    color:#1AFF80;
    border:1px solid #1AFF80;
    padding:6px 10px;
    cursor:pointer;
  `;
}

function inputStyle(input) {
  input.style.cssText = `
    background:#021509ad;
    color:#1AFF80;
    border:1px solid #1AFF80;
    padding:6px 8px;
    box-sizing:border-box;
  `;
}

const top = document.createElement("div");
top.style.cssText = `
  display:flex;
  gap:8px;
  align-items:center;
  flex-wrap:wrap;
  margin-bottom:14px;
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

const vendorBar = document.createElement("div");
vendorBar.style.cssText = `
  display:flex;
  align-items:end;
  gap:8px;
  flex-wrap:wrap;
  padding:10px 0 12px;
  margin-bottom:12px;
  border-bottom:1px solid rgba(26,255,128,.35);
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

const deleteVendorBtn = document.createElement("button");
deleteVendorBtn.textContent = "Delete Vendor";
buttonStyle(deleteVendorBtn);

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

vendorBar.append(
  vendorSelectWrap,
  newVendorBtn,
  saveTemplateBtn,
  restockBtn,
  resetVendorBtn,
  regenerateVendorBtn,
  deleteVendorBtn
);

const settings = document.createElement("div");
settings.style.cssText = `
  display:grid;
  grid-template-columns:repeat(4,minmax(140px,1fr)) auto;
  gap:10px;
  align-items:end;
  margin-bottom:16px;
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
buttonStyle(saveBtn);

settings.append(
  nameField.wrap,
  capsField.wrap,
  buyField.wrap,
  sellField.wrap,
  saveBtn
);

const addSection = document.createElement("div");
addSection.style.cssText = `
  border-top:1px solid rgba(26,255,128,.4);
  border-bottom:1px solid rgba(26,255,128,.4);
  padding:12px 0;
  margin-bottom:14px;
`;

const addTitle = document.createElement("div");
addTitle.textContent = "Add Item";
addTitle.style.cssText = `font-weight:bold;margin-bottom:8px;`;

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
  background:#021509;
  border:1px solid #1AFF80;
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
buttonStyle(addBtn);

addFields.append(
  customNameField.wrap,
  customValueField.wrap,
  addQtyField.wrap,
  addBtn
);

addSection.append(addTitle, pickerWrap, selectedLabel, addFields);

const table = document.createElement("div");
table.style.cssText = `display:flex;flex-direction:column;gap:3px;`;

root.append(top, vendorBar, settings, addSection, table);

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
    width:min(720px,96vw);max-height:90vh;overflow:auto;
    background:#021509;color:#1AFF80;border:2px solid #1AFF80;
    padding:16px;box-sizing:border-box;
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
  tierLabel.textContent = "Tier / Wealth";
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
  rarityLabel.textContent = "Rarity Bias";
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

  const seedField = field("Seed (optional)");
  seedField.input.placeholder = "Blank = new random vendor";

  const preview = document.createElement("div");
  preview.style.cssText = `
    margin-top:12px;padding:10px;border:1px solid rgba(26,255,128,.4);
    max-height:300px;overflow:auto;font-size:12px;
  `;
  preview.textContent = "Choose Generate Preview to inspect the result before creating it.";

  let generated = null;

  const renderGeneratedPreview = () => {
    preview.innerHTML = "";
    if (!generated) return;

    const summary = document.createElement("div");
    summary.style.cssText = `font-weight:bold;margin-bottom:8px;`;
    summary.textContent = `${generated.inventory.length} item lines • ${generated.caps} caps`;
    preview.appendChild(summary);

    for (const item of generated.inventory) {
      const row = document.createElement("div");
      row.style.cssText = `display:grid;grid-template-columns:minmax(0,1fr) 55px 70px;gap:8px;padding:2px 0;`;

      const name = document.createElement("span");
      appendVendorSourceLink(name, item, item.yamlName || stripWikiLink(item.name));

      const qty = document.createElement("span");
      qty.textContent = `x${item.qty}`;
      qty.style.textAlign = "right";

      const category = document.createElement("span");
      category.textContent = item.category;
      category.style.textAlign = "right";
      category.style.opacity = ".75";

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

  grid.append(vendorName.wrap, profileWrap, tierWrap, rarityWrap, seedField.wrap);
  buttonRow.append(cancel, blank, generatePreview, createGenerated);
  modal.append(heading, grid, preview, buttonRow);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  vendorName.input.focus();
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
      profileId: cfg.profileId, tierId: cfg.tierId, rarityBiasId: cfg.rarityBiasId, seed: "", vendorName: vendor.name || id
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
    background:#021509;
    color:#1AFF80;
    border:2px solid #1AFF80;
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
    border:1px solid #1AFF80;
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
        border-bottom:1px solid rgba(26,255,128,.12);
      `;

      const left = document.createElement("span");
      left.textContent = def.basename;

      const right = document.createElement("span");
      right.textContent = def.type === "legendary"
        ? "Legendary"
        : `Value ${def.costDelta >= 0 ? "+" : ""}${def.costDelta}`;
      right.style.opacity = ".75";

      option.onmouseenter = () => option.style.background = "rgba(26,255,128,.12)";
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
    border-bottom:1px solid #1AFF80;
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
      border-bottom:1px solid rgba(26,255,128,.15);
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

    if (!rawName) continue;

    out.push({
      name: rawName,
      yamlName: file.basename,
      sourcePath: file.path,
      category,
      cost: Math.max(0, cost),
      weight,
      rarity
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
      border-bottom:1px solid rgba(26,255,128,.12);
    `;

    option.textContent = `${item.name}  •  ${item.cost}`;

    option.onmouseenter = () => {
      option.style.background = "rgba(26,255,128,.12)";
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
saveTemplateBtn.onclick = saveCurrentVendorTemplate;
restockBtn.onclick = restockMissingVendorStock;
resetVendorBtn.onclick = resetVendorToTemplate;
regenerateVendorBtn.onclick = regenerateVendorStock;
deleteVendorBtn.onclick = deleteActiveVendor;

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