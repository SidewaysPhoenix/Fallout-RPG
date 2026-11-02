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
    const mod = await readItem(modFile);
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
// Deliberately limited to the fields demonstrated by the supplied two mods.
// Unsupported mechanical effects fail explicitly instead of yielding partial stats.
function applyMod(weapon, mod) {
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

// Resolve weapons for inventory display; ordinary gear remains a linked row.
// Armor effects and DR are intentionally outside this phase.
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
    const lines = [first, mods ? `Mods: ${mods}` : ""];
    if (row.error) lines.push(`Item could not be resolved: ${safe(row.error).replace(/[\r\n]+/g, " ")}`);
    return lines.filter(Boolean).join("  \n");
  }).join("\n\n");
}

const BODY_LOCATIONS = ["Head", "Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg"];
const DR_FIELDS = { phys_dr: "Physical", energy_dr: "Energy", rad_dr: "Radiation", poison_dr: "Poison" };
function locationNames(text) {
  const parts = String(text ?? "").split(/[,;/]/).map(value => normalize(value).replace(/\s+/g, " ")).filter(Boolean);
  const result = new Set();
  for (const part of parts) {
    const names = {
      all: BODY_LOCATIONS, head: ["Head"], torso: ["Torso"], chest: ["Torso"],
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
async function resolveNpcArmor({ app, npc, sourcePath, readItem }) {
  const values = Object.fromEntries(Object.keys(DR_FIELDS).map(field => [field,
    Object.fromEntries(BODY_LOCATIONS.map(location => [location, 0]))]));
  const sources = [];
  const notices = [];
  const occupied = new Set();
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
    if (/power\s*armor|robot/i.test(String(data.category ?? ""))) {
      throw new Error(`Power/robot armor is not supported yet: ${entry.name ?? data.name ?? entry.item}`);
    }
    if (!Array.isArray(data["dmg resistances"])) throw new Error(`Invalid dmg resistances in ${file?.path ?? entry.item}`);
    if (entry.mods != null && !Array.isArray(entry.mods)) throw new Error("Installed armor mods must be a list.");
    if (entry.mods?.length) throw new Error(`Armor mods are not supported yet: ${entry.name ?? data.name ?? entry.item}`);
    const quantity = Number(entry.quantity ?? 1);
    if (!Number.isInteger(quantity) || quantity < 0) throw new Error(`Invalid armor quantity: ${entry.quantity}`);
    if (quantity === 0) continue;
    let locations = locationNames(data.locations);
    const locationKey = normalize(data.locations);
    const clothing = /clothing|outfit/i.test(String(data.category ?? ""));
    // A singular Arm/Leg denotes one piece; quantity 2 supplies the pair.
    if (!clothing && (locationKey === "arm" || locationKey === "leg")) {
      const available = locations.filter(location => !occupied.has(location));
      locations = available.slice(0, quantity);
      if (locations.length < quantity) notices.push(`Extra ${data.name ?? entry.item} pieces exceed the available ${locationKey} locations and were not counted.`);
    }
    if (!clothing) locations.forEach(location => occupied.add(location));
    const itemValues = { phys_dr: 0, energy_dr: 0, rad_dr: 0, poison_dr: 0 };
    for (const resistance of data["dmg resistances"]) {
      const field = Object.keys(DR_FIELDS).find(key => normalize(DR_FIELDS[key]) === normalize(resistance.name));
      if (!field) throw new Error(`Unsupported damage resistance type: ${resistance.name}`);
      itemValues[field] = resistanceNumber(resistance.desc);
    }
    for (const field of Object.keys(DR_FIELDS)) for (const location of locations) {
      values[field][location] = Math.max(values[field][location], itemValues[field]);
    }
    sources.push({ name: entry.name ?? data.name ?? file?.basename ?? entry.item, locations, values: itemValues });
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
    ...result.sources.map(source => `${source.name}: ${source.values[field] === Infinity ? "Immune" : source.values[field]} (${source.locations.join(", ")})`),
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
