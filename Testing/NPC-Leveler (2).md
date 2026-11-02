# NPC Leveler

> [!info] Equipment editor 1.1.1
> Uses your existing JS Engine and Fantasy Statblocks setup, plus Fallout NPC Items 0.6.2 and its current callbacks for equipment rendering. Replace your existing Leveler note with this note; no additional helper note or layout JSON is needed.

- Use **Refresh NPC folders** after adding source notes. Successful saves refresh the collection automatically. Custom names are cosmetic and free; skill TAG toggles require bypass. **Changes** lists edits and upgrade spending before export.
- Equipment browsing has category filters, rarity labels, 40-note pages and a selected-item stat preview. Item contents are read only when browsing, not while initializing the Leveler.
- Set the target level, choose an NPC, then **Load NPC**. Changes affect the working copy and live preview.
- Every two levels gained grants separate weapon and armor upgrades. Use **Replace** for a higher-rarity item or **Mods** for a compatible modification. A stacked piece is split so the upgrade affects one item.
- **Bypass leveling limits** permits stat changes beyond normal allowances, lower-rarity replacements, adding/removing gear, equipment toggles, quantities, manual attack editing and custom scalar fields. Mod choices remain compatible with the source item. If bypass is disabled while off-book edits remain, export/save explains what needs resetting.
- **Undo last equipment/custom edit** restores the previous equipment/custom-field state. **Reset Upgrades** restores the loaded NPC's draft. Attribute/skill adjustments use their own minus controls.
- **Export Upgraded YAML** copies a complete statblock. **Save as new custom note** creates a new note and optional subfolders, refusing to overwrite existing files.
- Preview, clipboard export and saved statblocks always start with `layout: Fallout_2d20_NPC_Statblock_Parsed`.
- Default save root: `Fallout-RPG/Creatures and NPCs/Custom/2.0 Statblocks`. Loading roots are listed in `NPC_PATHS`; all their subfolders are collected. Change `CUSTOM_NPC_ROOT` near the top of the script if your vault uses a different directory.
- SPECIAL traits, skill tags, nested inventory/mods, manual attacks and creature scavenge rules are retained. Armor changes clear listed DR in the working copy/export so the rendering plugin derives protection. Frame strength remains equipment-derived; base SPECIAL stays in exported YAML.
- Existing promotion, creature forms and legendary ability features remain. This update does not add a new ability database or interpret narrative item effects.

```js-engine
return await (async function () {
// Vault-Kit NPC Leveler — Equipment Editor 1.1.1
const NPC_PATHS = [
  "Fallout-RPG/Creatures and NPCs/Statblocks",
  "Fallout-RPG/Creatures and NPCs/Custom/2.0 Statblocks"
];
const CUSTOM_NPC_ROOT = "Fallout-RPG/Creatures and NPCs/Custom/2.0 Statblocks";
const injectedFormAbilities = new WeakSet(); // Track generated entries without exporting comments.
let creatureDamageUpgrades = {};  // attackIndex → number of D6 upgrades
let characterWeaponUpgrades = 0;
let characterArmorUpgrades = 0;
const SPECIAL_KEYS = ["strength","per","end","cha","int","agi","lck"];

// === Legendary Abilities (Phase 2) ===
const LEGENDARY_ABILITIES_PATH = "Fallout-RPG/Creatures and NPCs/Forms/Legendary Abilities"; // change if your folder differs

let legendaryEnabled = false;                 // checkbox state
let selectedLegendaryAbilityId = "";          // no auto-select
let legendaryAbilities = [];                  // loaded from .md files
let legendaryAbilityById = {};                // id -> ability object

// === Phase 3: Legendary Creature Promotion (tie-case points) ===
let legendaryPromoAttrPoints = 0;   // only used for Mighty creature tie (Body == Mind)
let legendaryPromoBodySpent = 0;
let legendaryPromoMindSpent = 0;

// === Phase 3B: Major Character promotion state ===
let majorPromoAttrPoints = 0;               // points remaining to spend
let majorPromoSpent = {                     // spent per SPECIAL
  strength: 0, per: 0, end: 0, cha: 0, int: 0, agi: 0, lck: 0
};

let majorTagPicksNeeded = 0;                // 2 for Normal->Major, 1 for Notable->Major
let majorTagSelections = [];                // array of skill names (Title Case)

// === Phase 4: Creature Forms ===
let availableForms = [];
let formsById = {};
let selectedFormId = null;

// === Phase 4.1: Form choice state (per loaded NPC session) ===
let formChoiceState = {
  // alpha: { attr: "body_attr" | "mind", skill: "melee"|"guns"|"other", mode: "dr"|"attack", drType: "phys"|"energy"|"rad", attackIndex: 0 }
  alpha: {
    attr: "",
    skill: "",
    mode: "dr",
    drType: "phys",
    attackIndex: 0
  }
};


// == UI Setup ==
const container = document.createElement("div");
container.style.padding = "10px";
container.style.backgroundColor = "#325886";
container.style.borderRadius = "8px";
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.gap = "12px";
container.style.color = "#EFDD6F";
container.style.maxWidth = "none";
container.classList.add("vk-npc-leveler");

const levelerStyle = document.createElement("style");
levelerStyle.textContent = `
.vk-npc-leveler { width:100%; box-sizing:border-box; background:#172a3b !important; color:#f4ead5 !important; padding:14px !important; }
.vk-npc-leveler * { box-sizing:border-box; }
.vk-npc-leveler .vk-selection { display:grid; grid-template-columns:minmax(100px,.6fr) minmax(180px,1fr) minmax(210px,1.3fr) auto; gap:10px; align-items:end; background:#102434; padding:12px; border:1px solid #365d78; border-radius:8px; }
.vk-npc-leveler .vk-field { display:flex; flex-direction:column; gap:5px; min-width:0; }
.vk-npc-leveler .vk-field label { color:#f3c64d; font-weight:600; }
.vk-npc-leveler .vk-field input, .vk-npc-leveler .vk-field select { width:100%; min-width:0; max-width:100%; }
.vk-npc-leveler .vk-main { display:grid; grid-template-columns:minmax(350px, 2fr) minmax(420px, 3fr); gap:14px; align-items:start; min-width:0; }
.vk-npc-leveler .vk-controls, .vk-npc-leveler .vk-preview-panel { min-width:0; background:#102434; border:1px solid #365d78; border-radius:8px; padding:12px; }
.vk-npc-leveler .vk-panel-heading { color:#f3c64d; font-size:16px; font-weight:700; margin:0 0 10px; }
.vk-npc-leveler .vk-controls-scroll, .vk-npc-leveler .vk-preview-scroll { overflow:auto; max-height:min(78vh, 920px); scrollbar-gutter:stable; }
.vk-npc-leveler .vk-section { border:1px solid rgba(91,136,164,.5); border-radius:7px; background:#172a3b; margin:0 0 9px; overflow:hidden; }
.vk-npc-leveler .vk-section > summary { cursor:pointer; color:#f3c64d; padding:10px 12px; font-weight:700; background:#1b3347; }
.vk-npc-leveler .vk-section > summary:hover { background:#25445d; }
.vk-npc-leveler .vk-section-body { padding:10px 12px; }
.vk-npc-leveler .vk-section-body > :first-child { margin-top:0 !important; }
.vk-npc-leveler .vk-section-body > :last-child { margin-bottom:0 !important; }
.vk-npc-leveler .vk-section-body button { flex-shrink:0; }
.vk-npc-leveler .vk-summary { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; margin-bottom:12px; }
.vk-npc-leveler .vk-summary-item { border:1px solid rgba(91,136,164,.5); border-radius:6px; background:#1b3347; padding:8px; }
.vk-npc-leveler .vk-summary-item span { display:block; font-size:11px; color:#aebdca; }
.vk-npc-leveler .vk-summary-item strong { display:block; font-size:17px; color:#f3c64d; margin-top:3px; }
.vk-npc-leveler .vk-preview-actions { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px; position:sticky; top:0; z-index:3; background:#102434; padding:6px 0; }
.vk-npc-leveler .vk-preview-actions button { width:auto !important; max-width:none !important; margin:0 !important; padding:8px 12px; }
.vk-npc-leveler .vk-preview-scroll .statblock { max-width:100% !important; width:100% !important; margin:0 !important; }
 .vk-npc-leveler .vk-preview-scroll .statblock .statblock-content { max-width:100%; }
.vk-npc-leveler .vk-attr-grid { display:grid !important; grid-template-columns:repeat(4,minmax(0,1fr)) !important; gap:8px !important; align-items:stretch !important; justify-items:stretch !important; }
.vk-npc-leveler .vk-attr-cell { min-width:0; background:#102434; border:1px solid #365d78; border-radius:6px; padding:8px 3px; }
.vk-npc-leveler .vk-attr-cell > div:first-child { text-align:center; min-height:20px; font-size:12px; }
.vk-npc-leveler .vk-attr-cell .vk-attr-buttons { margin:3px 0 0 !important; gap:4px !important; }
.vk-npc-leveler .vk-attr-buttons button, .vk-npc-leveler .vk-skill-buttons button { margin:0 !important; min-width:25px; width:25px !important; padding:4px 3px !important; }
.vk-npc-leveler .vk-skill-grid { display:grid !important; grid-template-columns:repeat(2,minmax(0,1fr)) !important; gap:7px !important; }
.vk-npc-leveler .vk-skill-row { min-width:0; gap:6px; background:#102434; border:1px solid rgba(91,136,164,.3); border-radius:5px; padding:7px 8px !important; }
.vk-npc-leveler .vk-skill-label { min-width:0; overflow-wrap:anywhere; font-size:12px; }
.vk-npc-leveler .vk-skill-buttons { flex-shrink:0; }
.vk-npc-leveler .vk-section-body > .vk-embedded-card { border:0 !important; border-radius:0 !important; padding:0 !important; margin:0 !important; background:transparent !important; }
.vk-npc-leveler .vk-section-body .vk-hidden-empty { display:none !important; }
@container vk-leveler (max-width: 1100px) and (min-width: 851px) {
 .vk-npc-leveler .vk-attr-grid { grid-template-columns:repeat(3,minmax(0,1fr)) !important; }
 .vk-npc-leveler .vk-skill-grid { grid-template-columns:1fr !important; }
}
@container vk-leveler (max-width: 600px) {
 .vk-npc-leveler .vk-attr-grid { grid-template-columns:repeat(3,minmax(0,1fr)) !important; }
 .vk-npc-leveler .vk-skill-grid { grid-template-columns:1fr !important; }
}

@container vk-leveler (max-width: 850px) {
  .vk-npc-leveler .vk-main { grid-template-columns:1fr; }
  .vk-npc-leveler .vk-controls-scroll, .vk-npc-leveler .vk-preview-scroll { max-height:none; }
  .vk-npc-leveler .vk-selection { grid-template-columns:repeat(2,minmax(0,1fr)); }
}
@media (max-width:700px) {
  .vk-npc-leveler .vk-main { grid-template-columns:1fr; }
  .vk-npc-leveler .vk-controls-scroll, .vk-npc-leveler .vk-preview-scroll { max-height:none; }
  .vk-npc-leveler .vk-selection { grid-template-columns:1fr; }
}

/* Minimal control surface: one panel, quiet dividing lines instead of nested cards. */
.vk-npc-leveler .vk-section { background:transparent; border:0; border-bottom:1px solid rgba(91,136,164,.28); border-radius:0; margin:0; }
.vk-npc-leveler .vk-section > summary { background:transparent; padding:10px 2px; border-radius:0; font-size:13px; }
.vk-npc-leveler .vk-section > summary:hover { background:rgba(91,136,164,.10); }
/* Only display section status while collapsed; preserve the native disclosure arrow. */
.vk-npc-leveler .vk-section > summary { position:relative; padding-right:8px; }
.vk-npc-leveler .vk-section-status { float:right; font-size:11px; font-weight:500; margin-left:12px; color:#aebdca; font-variant-numeric:tabular-nums; }
.vk-npc-leveler .vk-section-status.vk-pending { color:#f3c64d; }
.vk-npc-leveler .vk-section[open] > summary .vk-section-status { display:none; }
.vk-npc-leveler .vk-section > summary::after { content:""; display:block; clear:both; }

.vk-npc-leveler .vk-section-body { padding:2px 4px 12px; }
.vk-npc-leveler .vk-attribute-container, .vk-npc-leveler .vk-skill-container { margin-top:2px !important; }
.vk-npc-leveler .vk-attr-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; gap:0 14px !important; margin-top:5px !important; }
.vk-npc-leveler .vk-attr-cell { background:transparent; border:0; border-bottom:1px solid rgba(91,136,164,.22); border-radius:0; padding:6px 0; flex-direction:row !important; justify-content:space-between !important; gap:5px !important; }
.vk-npc-leveler .vk-attr-cell > div:first-child { text-align:left; min-height:0; font-size:12px; }
.vk-npc-leveler .vk-attr-cell .vk-attr-buttons { width:auto !important; flex:0 0 auto; margin:0 !important; }
.vk-npc-leveler .vk-skill-grid { gap:0 14px !important; margin-top:4px !important; }
.vk-npc-leveler .vk-skill-row { background:transparent; border:0; border-bottom:1px solid rgba(91,136,164,.22) !important; border-radius:0; padding:6px 0 !important; min-height:35px; }
.vk-npc-leveler .vk-attr-buttons button, .vk-npc-leveler .vk-skill-buttons button, .vk-npc-leveler .vk-section-body button { width:25px; min-width:25px; min-height:25px; padding:2px 5px !important; margin:0 !important; background:#21394e !important; border:1px solid rgba(91,136,164,.45) !important; border-radius:4px !important; box-shadow:none !important; color:#f3c64d !important; }
.vk-npc-leveler .vk-section-body button:hover { background:#30506b !important; }
.vk-npc-leveler .vk-section-body .vk-embedded-card, .vk-npc-leveler .vk-section-body .vk-form-section, .vk-npc-leveler .vk-section-body .vk-major-tag-section { border:0 !important; background:transparent !important; padding:2px 0 !important; border-radius:0 !important; box-shadow:none !important; margin:0 !important; }
.vk-npc-leveler .vk-section-body .vk-legendary-options button, .vk-npc-leveler .vk-section-body .vk-major-tag-section button { width:auto !important; min-width:0 !important; padding:5px 9px !important; }
.vk-npc-leveler .vk-ability-details { border-top:1px solid rgba(91,136,164,.25); margin-top:10px; padding-top:8px; }
.vk-npc-leveler .vk-ability-details > summary { cursor:pointer; color:#f3c64d; font-size:12px; padding:4px 0 8px; }
.vk-npc-leveler .vk-ability-details > div { background:rgba(10,25,35,.38) !important; color:#f4ead5 !important; border-left:2px solid #527c96; padding:8px 10px !important; margin:6px 0 !important; font-size:12px; line-height:1.5; }
.vk-npc-leveler .vk-section-body select { max-width:100%; }
@container vk-leveler (max-width:1050px) {
 .vk-npc-leveler .vk-attr-grid, .vk-npc-leveler .vk-skill-grid { grid-template-columns:1fr !important; }
}
`;
// Container queries respond to the actual width of the Obsidian pane.
container.style.containerType = "inline-size";
container.style.containerName = "vk-leveler";
levelerStyle.textContent += "\n/* Vault-Kit editor cards and equipment workbench */\n.vk-npc-leveler .vk-section {background:#142a3a;border:1px solid #365569;border-radius:9px;margin:9px 0;overflow:hidden}\n.vk-npc-leveler .vk-section>summary {padding:12px;color:#ffc200;font-weight:650;letter-spacing:.04em}\n.vk-npc-leveler .vk-section-body {padding:8px 12px 12px}\n.vk-npc-leveler .vk-equipment-row {padding:12px;margin:9px 0;background:#102434;border:1px solid #365569;border-left:3px solid #527c96;border-radius:9px;overflow-wrap:anywhere}\n.vk-npc-leveler .vk-editor-actions {display:flex;gap:7px;flex-wrap:wrap;margin:8px 0}\n.vk-npc-leveler .vk-equipment-editor button,.vk-npc-leveler .vk-editor-dialog button,.vk-npc-leveler .vk-save-options button {width:auto!important;min-width:0!important;padding:7px 10px!important;border:1px solid #527c96!important;background:#21394e!important;color:#ffc200!important;border-radius:6px!important}\n.vk-npc-leveler .vk-editor-field {display:flex;gap:10px;align-items:center;justify-content:space-between;margin:8px 0;font-size:12px;color:#d8e3ec}\n.vk-npc-leveler .vk-editor-field input:not([type=checkbox]),.vk-npc-leveler .vk-editor-dialog select,.vk-npc-leveler textarea {background:#102434!important;color:#e5edf3!important;border:1px solid #365d78!important;border-radius:6px;padding:7px;min-width:0;max-width:100%}\n.vk-npc-leveler .vk-editor-field input[type=checkbox]{accent-color:#ffc200}\n.vk-npc-leveler .vk-equipment-editor textarea {width:100%;font-family:var(--font-monospace);font-size:12px}\n.vk-npc-leveler .vk-editor-overlay {position:fixed;inset:0;z-index:1000;background:#0009;display:flex;align-items:center;justify-content:center;padding:24px}\n.vk-npc-leveler .vk-editor-dialog {background:#172a3b;color:#e5edf3;border:1px solid #527c96;border-radius:12px;padding:18px;width:min(650px,95vw);max-height:85vh;overflow:auto;box-shadow:0 12px 40px #0008}\n.vk-npc-leveler .vk-editor-dialog>strong {display:block;color:#ffc200;font-size:17px;margin-bottom:12px}\n.vk-npc-leveler .vk-editor-dialog select {width:100%;margin-bottom:10px}\n.vk-npc-leveler .vk-editor-status {color:#f3c64d;font-size:12px;white-space:pre-wrap;margin:6px 0}\n.vk-npc-leveler .vk-save-options {width:100%;font-size:12px}\n.vk-npc-leveler .vk-save-options summary {color:#ffc200;cursor:pointer}\n";
levelerStyle.textContent += "\n/* Editor spacing and full-height native search list */\n.vk-npc-leveler .vk-skill-buttons,\n.vk-npc-leveler .vk-attr-buttons {gap:8px !important}\n.vk-npc-leveler .vk-equipment-editor > button {display:block;margin:10px 0 !important}\n.vk-npc-leveler .vk-equipment-editor details button,\n.vk-npc-leveler .vk-editor-dialog button {margin:8px 8px 8px 0 !important}\n.vk-npc-leveler .vk-editor-dialog select[size] {\n  display:block !important;\n  height:260px !important;\n  min-height:260px !important;\n  max-height:45vh !important;\n  padding:5px !important;\n  line-height:1.5 !important;\n  background-image:none !important;\n}\n.vk-npc-leveler .vk-editor-dialog select[size] option {padding:7px 10px;white-space:nowrap}\n";
levelerStyle.textContent += "\n.vk-npc-leveler .vk-change-summary {border:1px solid #365569;border-radius:8px;padding:10px;margin:10px 0;color:#e5edf3}\n.vk-npc-leveler .vk-change-summary>summary {cursor:pointer;color:#ffc200;font-weight:600}\n.vk-npc-leveler .vk-change-list {max-height:280px;overflow:auto}\n.vk-npc-leveler .vk-change-row {border-top:1px solid #365569;padding:8px 0;font-size:12px;white-space:pre-wrap;overflow-wrap:anywhere}\n.vk-npc-leveler .vk-item-preview {border:1px solid #365569;border-radius:8px;padding:12px;margin:10px 0}\n.vk-npc-leveler .vk-item-preview:empty {display:none}\n.vk-npc-leveler .vk-item-preview>strong {color:#ffc200;display:block;margin-bottom:8px}\n.vk-npc-leveler .vk-item-metric {display:flex;justify-content:space-between;gap:14px;padding:4px 0;border-bottom:1px solid #365569;font-size:12px}\n.vk-npc-leveler .vk-skill-buttons .vk-editor-field {margin:0;font-size:10px;gap:4px}\n.vk-npc-leveler .vk-equipment-row>button {margin:6px 0!important}\n";
container.appendChild(levelerStyle);

const levelInput = createLabeledNumber("Player Level", 1);
	levelInput.input.style.borderRadius = "5px";
	levelInput.input.style.caretColor = "black";
const folderSelect = createLabeledDropdown("NPC Category");
const fileSelect = createLabeledDropdown("Choose NPC File");

const upgradeArea = document.createElement("div");
upgradeArea.style.display = "none";
// Render the generated statblock in memory (no write to NPC Leveler.md).
const { MarkdownRenderer, Component } = engine.getObsidianModule();
const resultBlock = document.createElement("div");
resultBlock.classList.add("npc-leveler-preview", "markdown-rendered");
let previewComponent = null;
let previewRequest = 0;

async function renderStatblockPreview(data) {
    const request = ++previewRequest;
    const markdown = "```statblock\n" + yamlify(data) + "\n```";
    const sourcePath = loadedSourcePath || fileSelect.input.value || app.workspace.getActiveFile()?.path || "";
    const nextComponent = new Component();
    nextComponent.load();
    const nextEl = document.createElement("div");
    nextEl.classList.add("markdown-preview-view", "markdown-rendered");

    try {
        await MarkdownRenderer.render(app, markdown, nextEl, sourcePath, nextComponent);
        if (request !== previewRequest) {
            nextComponent.unload();
            return;
        }
        if (previewComponent) previewComponent.unload();
        previewComponent = nextComponent;
        resultBlock.replaceChildren(nextEl);
    } catch (error) {
        nextComponent.unload();
        if (request !== previewRequest) return;
        if (previewComponent) previewComponent.unload();
        previewComponent = null;
        const fallback = document.createElement("pre");
        fallback.textContent = markdown;
        fallback.style.cssText = "white-space:pre-wrap;background:#012300;color:#4ee44a;padding:10px;border-radius:6px;";
        resultBlock.replaceChildren(fallback);
        console.error("NPC Leveler statblock preview failed:", error);
    }
}

let npc = null;
let upgradedNPC = null;
let original = null;
let upgrades = {};
let skillUpgrades = {};
let availableAttributePoints = 0;
let availableSkillPoints = 0;
let creatureDRUpgrades = {
    phys: 0,
    energy: 0,
    rad: 0
};


function titleCase(str) {
    return str.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function extractWealthFromScavenge(npc) {
    if (!String(npc.type ?? "").toLowerCase().includes("creature")) {
      return num((npc.inventory ?? []).find(entry => String(entry.item ?? "").replace(/[*_]/g, "").trim().toLowerCase() === "wealth")?.quantity);
    }
    for (const rule of npc.scavenge_rules ?? []) { const match=rule.desc?.match(/Wealth\s*(\d+)/i);if(match)return Number(match[1]); }
    return 0;
}

const validSkillNames = [
    "athletics", "barter", "big guns", "energy weapons", "explosives",
    "lockpick", "medicine", "melee weapons", "pilot", "repair", "science",
    "small guns", "sneak", "speech", "survival", "throwing", "unarmed"
];

// Equipment editor session state. None of these controls are exported.
let bypassLimits = false;
let equipmentDraft = null, attackDraft = null, armorEdited = false;
let equipmentHistory = [], offBookEdits = 0, manualFields = {};
let sourceShape = {};
let tagOverrides = {};
let loadedSourcePath = "";
const EDITOR_ITEMS = "Fallout-RPG/Items/";

const clone = value => structuredClone(value);
const num = value => String(value ?? "").trim() === "-" ? 0 : (Number.parseInt(value, 10) || 0);
const linkName = value => String(value ?? "").replace(/^\[\[|\]\]$/g, "").split("|")[0].split("#")[0].trim();
const cleanKey = value => String(value ?? "").trim().replace(/:$/, "").toLowerCase();
const fieldMap = {strength:"STR",per:"PER",end:"END",cha:"CHA",int:"INT",agi:"AGI",lck:"LCK"};
const creatureMap = {body_attr:"bodyAttribute",mind:"mindAttribute",melee:"meleeSkill",guns:"gunsSkill",other:"otherSkill"};
function importNpc(data) {
  sourceShape = clone(data);
  const result = clone(data);
  for (const [field, label] of Object.entries(fieldMap)) {
    const trait = result.special?.find(entry => cleanKey(entry.name) === label.toLowerCase());
    if (trait) result[field] = String(trait.desc ?? "-");
  }
  for (const [old, current] of Object.entries(creatureMap)) if (result[current] != null) result[old] = String(result[current]);
  for (const key of [...Object.keys(fieldMap),...Object.keys(creatureMap),"level","hp"]) if (result[key] != null) result[key] = String(result[key]);
  for (const entry of result.skills ?? []) entry.desc = String(entry.desc ?? "-") + (entry.tagged === true && !String(entry.desc).includes("⬛") ? " ⬛" : "");
  return result;
}
function exportNpc(data) {
  const result = clone(data);
  if (String(result.type??"").toLowerCase().includes("creature") && !Object.hasOwn(sourceShape,"skills") && result.skills?.length===0) delete result.skills;
  if (Array.isArray(sourceShape.special)) {
    result.special = clone(result.special ?? sourceShape.special);
    for (const [field,label] of Object.entries(fieldMap)) {
      const trait = result.special.find(e => cleanKey(e.name) === label.toLowerCase());
      if (trait && result[field] != null) trait.desc = String(result[field]);
      if (!Object.hasOwn(sourceShape,field)) delete result[field];
    }
  }
  for (const [old,current] of Object.entries(creatureMap)) if (Object.hasOwn(sourceShape,current)) {
    result[current] = result[old];
    if (!Object.hasOwn(sourceShape,old)) delete result[old];
  }
  if (Array.isArray(sourceShape.special)) for (const skill of result.skills ?? []) {
    skill.tagged = skill.tagged === true || String(skill.desc ?? "").includes("⬛");
    skill.desc = String(skill.desc ?? "-").replace(/\s*⬛/g,"").trim();
    delete skill.rank;
  }
  const { layout: oldLayout, ...fields } = result;
  return { layout: "Fallout_2d20_NPC_Statblock_Parsed", ...fields };
}
function beginEquipmentSession() {
  equipmentDraft = clone(npc.inventory ?? []);
  attackDraft = clone(npc.attacks ?? []);
  equipmentHistory = []; armorEdited = false; offBookEdits = 0; manualFields = {}; tagOverrides = {};
}
function equipmentAllowance() { return Math.floor(Math.max(0,num(levelInput.input.value)-num(original?.level))/2); }
function validateEditorExport() {
  if (!bypassLimits && (getUsedNormalAttributePoints()>availableAttributePoints || getUsedSkillPoints()>availableSkillPoints ||
      Object.values(upgrades).some(n=>n<0) || Object.values(skillUpgrades).some(n=>n<0)))
    throw new Error("Stat edits exceed normal limits. Enable bypass or reset the upgrades.");
  if (!upgradedNPC) throw new Error("Load an NPC first.");
  if (!bypassLimits && (Object.values(creatureDamageUpgrades).reduce((a,b)=>a+b,0)>equipmentAllowance() || Object.values(creatureDRUpgrades).reduce((a,b)=>a+b,0)>equipmentAllowance() || offBookEdits || characterWeaponUpgrades > equipmentAllowance() || characterArmorUpgrades > equipmentAllowance()))
    throw new Error("These edits exceed normal leveling rules. Enable Bypass leveling limits or undo/reset the edits.");
}
function gearCheckpoint() {
  equipmentHistory.push({inventory:clone(equipmentDraft), attacks:clone(attackDraft), armorEdited,
    weapons:characterWeaponUpgrades, armor:characterArmorUpgrades, offBookEdits, manualFields:clone(manualFields), tags:clone(tagOverrides)});
}
function gearUndo() {
  const state=equipmentHistory.pop();if(!state)return;
  equipmentDraft=state.inventory;attackDraft=state.attacks;armorEdited=state.armorEdited;
  characterWeaponUpgrades=state.weapons;characterArmorUpgrades=state.armor;offBookEdits=state.offBookEdits;manualFields=state.manualFields;tagOverrides=state.tags??{};
  renderUpgrades();
}
function spendEquipment(kind, action) {
  const used=kind==="weapon"?characterWeaponUpgrades:characterArmorUpgrades;
  if (!bypassLimits && used>=equipmentAllowance()) throw new Error("No "+kind+" upgrades remain.");
  gearCheckpoint();action();
  if(kind==="weapon") characterWeaponUpgrades++; else characterArmorUpgrades++;
  if(kind==="armor") armorEdited=true;
  renderUpgrades();
}
function uniqueInventoryId() {
  let id;do{id="item-"+Math.random().toString(36).slice(2,10);}while(equipmentDraft.some(e=>e.id===id));return id;
}
function onePiece(index) {
  const entry=equipmentDraft[index],quantity=Number(entry.quantity ?? 1);
  if(!Number.isInteger(quantity)||quantity<1)throw new Error("Item quantity must be a positive integer.");
  if(quantity>1) { const remaining=clone(entry);remaining.id=uniqueInventoryId();remaining.quantity=quantity-1;equipmentDraft.push(remaining);entry.quantity=1; }
  return entry;
}
// Prefer note names when they identify the same file in both editor and item context.
function editorItemReference(file, context = loadedSourcePath || fileSelect.input.value) {
  const paths=[loadedSourcePath || fileSelect.input.value,context];
  const unique=paths.every(path=>app.metadataCache.getFirstLinkpathDest(file.basename,path)?.path===file.path);
  return "[["+(unique?file.basename:file.path.replace(/\.md$/i,""))+"]]";
}
async function readEditorItem(item) {
  const file = app.metadataCache.getFirstLinkpathDest(linkName(item),loadedSourcePath || fileSelect.input.value);
  if(!file || file.extension!=="md") throw new Error("Cannot resolve item: "+item);
  const content=await app.vault.cachedRead(file), block=content.match(/```statblock\s*([\s\S]*?)```/i)?.[1];
  if(!block) throw new Error("No statblock in "+file.path);
  return {file,data:engine.getObsidianModule().parseYaml(block) ?? {}};
}
function itemKind(data,file) {
  if(data.damage_rating!=null || /\/Weapons\//i.test(file?.path ?? ""))return "weapon";
  if(data["dmg resistances"]!=null || /\/Apparel\//i.test(file?.path ?? ""))return "armor";
  return "other";
}
function editorNode(tag,text,cls) {const el=document.createElement(tag);if(text!=null)el.textContent=text;if(cls)el.className=cls;return el;}
function editorButton(label,action) {
  const b=editorNode("button",label);b.type="button";b.onclick=action;return b;
}
function editorInput(label,value,type="text") {
  const wrap=editorNode("label",null,"vk-editor-field"),caption=editorNode("span",label),input=editorNode("input");
  input.type=type;if(type==="checkbox")input.checked=!!value;else input.value=value ?? "";
  wrap.append(caption,input);return {wrap,input};
}
function editorMessage(host,error) {host.textContent=String(error?.message ?? error);}
function bypassEdit(action,armor=false) {
  if(!bypassLimits)throw new Error("Enable Bypass leveling limits for this edit.");
  gearCheckpoint();action();offBookEdits++;armorEdited ||= armor;renderUpgrades();
}
function linkWeapon(entry,data) {
  if(!attackDraft.some(a=>a.inventoryId===entry.id)) attackDraft.push({id:entry.id+"-attack",inventoryId:entry.id});
}
function refreshLinkedAttack(entry) {
  for(const attack of attackDraft.filter(a=>a.inventoryId===entry.id)) {
    for(const field of ["desc","name","damage","damageEffects","damageQualities","damageType","range","fireRate","skill","attribute"])delete attack[field];
  }
}
function openEquipmentDialog(index, mode) {
  const entry=index==null?null:equipmentDraft[index];
  const overlay=editorNode("div",null,"vk-editor-overlay"),card=editorNode("div",null,"vk-editor-dialog");
  const heading=editorNode("strong",mode==="mod"?"Modify equipment":mode==="replace"?"Replace one item":"Add equipment");
  const status=editorNode("div","", "vk-editor-status"),body=editorNode("div");
  const close=()=>overlay.remove();
  card.append(heading,body,status,editorButton("Close",close));overlay.append(card);container.append(overlay);
  (async()=>{
    let source=entry?await readEditorItem(entry.item):null;
    const kind=source?itemKind(source.data,source.file):null;
    if(mode==="mod") {
      if(kind==="other")throw new Error("This item has no supported equipment profile.");
      if(kind==="weapon" && entry.equipped!==true && !attackDraft.some(a=>a.inventoryId===entry.id) && !bypassLimits)throw new Error("Normal weapon upgrades apply to a wielded weapon.");
      const slots=Array.isArray(source.data.mods)?source.data.mods:[];
      const choices=[];
      for(const [group,slot] of slots.entries())for(const match of String(slot.desc??"").matchAll(/\[\[([^\]]+)\]\]/g)) {
        const file=app.metadataCache.getFirstLinkpathDest(linkName(match[0]),source.file.path);if(!file)continue;
        choices.push({slot:String(slot.name??"").replace(/:$/,""),item:editorItemReference(file,source.file.path),file,
          label:(slot.name||"Other mods")+": "+(match[1].split("|")[1]||file.basename),group});
      }
      const roots=kind==="weapon"?["Weapons","CustomWeapons"]:["Apparel","CustomApparel"];
      for(const file of app.vault.getMarkdownFiles().filter(f=>roots.some(root=>f.path.startsWith(EDITOR_ITEMS+"Mods/Legendary Mods/"+root+"/"))))
        choices.push({slot:"Legendary",item:editorItemReference(file,source.file.path),file,label:"Legendary: "+file.basename,legendary:true});
      const slotSelect=editorNode("select"),select=editorNode("select");
      slotSelect.setAttribute("aria-label","Mod slot");select.setAttribute("aria-label","Compatible mod");
      for(const [group,slot]of slots.entries())slotSelect.append(new Option(slot.name?String(slot.name).replace(/:$/,""):"Other mods (unnamed slot)","standard:"+group));
      if(choices.some(c=>c.legendary))slotSelect.append(new Option("Legendary properties","legendary"));
      const installedNote=editorNode("p","", "vk-editor-status");
      const fillMods=()=>{
        select.replaceChildren();
        for(const [i,c]of choices.entries())if(slotSelect.value==="legendary"?c.legendary:!c.legendary&&"standard:"+c.group===slotSelect.value)
          select.append(new Option(c.label.replace(/^[^:]+:\s*/,""),String(i)));
        const chosen=choices.find(c=>slotSelect.value==="legendary"?c.legendary:!c.legendary&&"standard:"+c.group===slotSelect.value);
        const current=(entry.mods??[]).filter(m=>chosen&&cleanKey(m.slot)===cleanKey(chosen.slot));
        installedNote.textContent=current.length?"Installed: "+current.map(m=>equipmentDisplayName({item:m.item})).join(", "):"No installed mod in this slot.";
        if(!select.children.length)installedNote.textContent="No resolvable compatible mods in this slot.";
      };
      slotSelect.onchange=fillMods;fillMods();
      body.append(editorNode("label","Mod slot"),slotSelect,editorNode("label","Compatible mod"),select,installedNote,editorButton("Apply one mod",()=>{
        try {
          const choice=select.value===""?null:choices[Number(select.value)];if(!choice)throw new Error("No compatible mods are listed.");
          const current=entry.mods??[];
          const target=app.metadataCache.getFirstLinkpathDest(linkName(choice.item),source.file.path)?.path;
          if(current.some(m=>app.metadataCache.getFirstLinkpathDest(linkName(m.item),source.file.path)?.path===target))throw new Error("That mod is already installed.");
          // Replacing a compatible mod in its slot is one application.
          spendEquipment(kind,()=>{
            const piece=onePiece(index);piece.mods=(piece.mods??[]).filter(m=>choice.legendary||cleanKey(m.slot)!==cleanKey(choice.slot));
            piece.mods.push({slot:choice.slot,item:choice.item});
            if(kind==="weapon")refreshLinkedAttack(piece);
          });close();
        }catch(e){editorMessage(status,e);}
      }));
      const installed=editorNode("div");
      for(const [mi,mod]of (entry.mods??[]).entries())installed.append(editorButton("Remove "+(mod.slot?mod.slot+": ":"")+linkName(mod.item),()=>{
        try{bypassEdit(()=>{const piece=onePiece(index);piece.mods.splice(mi,1);if(kind==="weapon")refreshLinkedAttack(piece);},kind==="armor");close();}catch(e){editorMessage(status,e);}
      }));
      body.append(installed);
      return;
    }
    const search=editorInput("Search item notes",""),select=editorNode("select");select.size=9;
    const category=editorNode("select");category.setAttribute("aria-label","Equipment category");
    const filters=kind==="weapon"?[["weapon","Weapons"]]:kind==="armor"?[["all","Armor and clothing"],["armor","Armor"],["clothing","Clothing"]]:[["all","All equipment"],["weapon","Weapons"],["armor","Armor"],["clothing","Clothing"],["other","Other gear"]];
    for(const [value,label]of filters)category.append(new Option(label,value));
    const files=app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(EDITOR_ITEMS)&&!f.path.startsWith(EDITOR_ITEMS+"Mods/")).sort((a,b)=>a.basename.localeCompare(b.basename));
    const paging=editorNode("div",null,"vk-editor-actions"),pageStatus=editorNode("div","", "vk-editor-status");
    const preview=editorNode("div",null,"vk-item-preview");let page=0,listVersion=0,selectedVersion=0;
    const previewSelected=async()=>{const version=++selectedVersion;preview.replaceChildren();if(!select.value)return;status.textContent="";try{
      const selected=await readEditorItem("[["+select.value+"]]");
      if(version===selectedVersion)showEquipmentPreview(source,selected,preview);
    }catch(e){if(version===selectedVersion)editorMessage(status,e);}};
    const candidates=()=>files.filter(file=>file.basename.toLowerCase().includes(search.input.value.toLowerCase()) &&
      (!kind || (kind==="weapon" ? equipmentCategory(file)==="weapon" : ["armor","clothing"].includes(equipmentCategory(file)))) &&
      (category.value==="all" || category.value===equipmentCategory(file)));
    const fill=async()=>{
      const version=++listVersion;++selectedVersion;select.replaceChildren();preview.replaceChildren();
      const matching=candidates(),pages=Math.max(1,Math.ceil(matching.length/40));page=Math.min(page,pages-1);
      pageStatus.textContent="Loading page "+(page+1)+" of "+pages+" · "+matching.length+" matching notes";
      const batch=matching.slice(page*40,page*40+40),results=new Array(batch.length);let cursor=0;
      await Promise.all(Array.from({length:Math.min(4,batch.length)},async()=>{
        while(cursor<batch.length){const index=cursor++,file=batch[index];
          try{const item=await readEditorItem("[["+file.path+"]]");
            results[index]={file,label:"[Rarity "+(item.data.rarity??"—")+"] "+file.basename+" — "+equipmentCategory(file,item.data)};
          }catch(e){results[index]={file,label:file.basename+" — unreadable statblock"};}
        }
      }));
      if(version!==listVersion)return;
      for(const result of results)select.append(new Option(result.label,result.file.path));
      pageStatus.textContent="Page "+(page+1)+" of "+pages+" · "+matching.length+" matching notes";
      await previewSelected();
    };
    let searchTimer;
    search.input.oninput=()=>{clearTimeout(searchTimer);page=0;searchTimer=setTimeout(()=>void fill(),150);};
    category.onchange=()=>{page=0;void fill();};select.onchange=previewSelected;
    paging.append(editorButton("Previous",()=>{if(page>0){page--;void fill();}}),editorButton("Next",()=>{if((page+1)*40<candidates().length){page++;void fill();}}));
    body.append(search.wrap,category,pageStatus,select,paging,preview);await fill();
    body.append(editorButton(mode==="replace"?"Replace one piece":"Add selected item",async()=>{
      try{
        if(!select.value)throw new Error("Choose an item.");
        const selected=await readEditorItem("[["+select.value+"]]");
        const nextKind=itemKind(selected.data,selected.file);
        if(mode==="replace") {
          if(kind!==nextKind)throw new Error("Replacement must be the same equipment type.");
          if(kind==="other")throw new Error("Use bypass to remove/add custom or miscellaneous gear instead.");
          if(kind==="weapon" && entry.equipped!==true && !attackDraft.some(a=>a.inventoryId===entry.id) && !bypassLimits)throw new Error("Normal upgrades apply to a wielded weapon.");
          const oldRarity=/^\d+$/.test(String(source.data.rarity??""))?Number(source.data.rarity):NaN,newRarity=/^\d+$/.test(String(selected.data.rarity??""))?Number(selected.data.rarity):NaN;
          if(!bypassLimits&&(!Number.isFinite(oldRarity)||!Number.isFinite(newRarity)||newRarity<=oldRarity))throw new Error("Choose an item with higher numeric rarity, or enable bypass.");
          spendEquipment(kind,()=>{const piece=onePiece(index);piece.item=editorItemReference(selected.file);piece.mods=[];delete piece.name;delete piece.hp;delete piece.breaking;
            if(kind==="weapon"){refreshLinkedAttack(piece);linkWeapon(piece,selected.data);}
          });
        }else bypassEdit(()=>{const piece={id:uniqueInventoryId(),item:editorItemReference(selected.file),quantity:1,equipped:nextKind!=="other",mods:[]};equipmentDraft.push(piece);if(nextKind==="weapon")linkWeapon(piece,selected.data);},nextKind==="armor");
        close();
      }catch(e){editorMessage(status,e);}
    }));
    if(mode==="add"){
      const custom=editorInput("Custom item name","");
      body.append(custom.wrap,editorButton("Add custom item",()=>{try{if(!custom.input.value.trim())throw new Error("Enter a name.");bypassEdit(()=>equipmentDraft.push({id:uniqueInventoryId(),item:custom.input.value.trim(),quantity:1,equipped:false,mods:[]}));close();}catch(e){editorMessage(status,e);}}));
    }
  })().catch(e=>editorMessage(status,e));
}
function renderEquipmentEditor(temp,isCreature) {
  const title=editorNode("div","Gear Upgrades");upgradeArea.append(title);
  const panel=editorNode("div",null,"vk-equipment-editor");
  if(!isCreature) {
    panel.append(editorNode("p",`Weapon: ${characterWeaponUpgrades}/${equipmentAllowance()} · Armor: ${characterArmorUpgrades}/${equipmentAllowance()}`));
    for(const [i,entry]of equipmentDraft.entries()){
      const row=editorNode("div",null,"vk-equipment-row"),status=editorNode("div","", "vk-editor-status");
      row.append(editorNode("strong",`${entry.quantity??1} × ${entry.name||String(entry.item??"Unnamed")}`));
      if(entry.mods?.length)row.append(editorNode("div","Mods: "+entry.mods.map(m=>(m.slot?m.slot+": ":"")+m.item).join(" · ")));
      const equipped=editorInput("Equipped",entry.equipped===true,"checkbox");
      equipped.input.onchange=async()=>{try{
        const data=await readEditorItem(entry.item).catch(()=>null);
        bypassEdit(()=>{entry.equipped=equipped.input.checked;if(data&&itemKind(data.data,data.file)==="weapon"&&entry.equipped)linkWeapon(entry,data.data);},data&&itemKind(data.data,data.file)==="armor");
      }catch(e){equipped.input.checked=entry.equipped===true;editorMessage(status,e);}};
      const qty=editorInput("Quantity",entry.quantity??1,"number");qty.input.min=1;
      qty.input.onchange=async()=>{try{const value=Number(qty.input.value);if(!Number.isInteger(value)||value<1)throw new Error("Quantity must be a positive integer.");const data=await readEditorItem(entry.item).catch(()=>null);bypassEdit(()=>entry.quantity=value,data&&itemKind(data.data,data.file)==="armor");}catch(e){editorMessage(status,e);}};
      const actions=editorNode("div",null,"vk-editor-actions");
      actions.append(editorButton("Replace",()=>openEquipmentDialog(i,"replace")),editorButton("Mods",()=>openEquipmentDialog(i,"mod")),editorButton("Remove",async()=>{try{const data=await readEditorItem(entry.item).catch(()=>null);bypassEdit(()=>{equipmentDraft.splice(i,1);attackDraft=attackDraft.filter(a=>a.inventoryId!==entry.id);},data&&itemKind(data.data,data.file)==="armor");}catch(e){editorMessage(status,e);}}));
      const customName=editorInput("Custom name",entry.name??"");
      const rename=editorButton("Apply name",()=>{
        const name=customName.input.value.trim();if(name===String(entry.name??""))return;
        gearCheckpoint();if(name)entry.name=name;else delete entry.name;
        for(const attack of attackDraft.filter(a=>a.inventoryId===entry.id))delete attack.name;
        renderUpgrades();
      });
      row.append(customName.wrap,rename,equipped.wrap,qty.wrap,actions,status);panel.append(row);
    }
    panel.append(editorButton("Add equipment / custom gear",()=>openEquipmentDialog(null,"add")));
  }
  panel.append(editorButton("Undo last equipment/custom edit",gearUndo));
  const manual=editorNode("details");manual.append(editorNode("summary","Custom attacks and off-book fields"));
  const note=editorNode("p","Enable bypass to edit these fields. Manual attacks are separate from inventory-linked weapon attacks.");
  const text=editorNode("textarea");text.rows=8;text.value=engine.getObsidianModule().stringifyYaml(attackDraft.filter(a=>a.inventoryId==null));
  const status=editorNode("div","", "vk-editor-status");
  manual.append(note,text,editorButton("Apply manual attacks",()=>{try{
    const data=engine.getObsidianModule().parseYaml(text.value);if(!Array.isArray(data)||data.some(a=>!a||typeof a!=="object"||Array.isArray(a)||a.inventoryId!=null))throw new Error("Enter a YAML list of manual attacks.");
    bypassEdit(()=>attackDraft=[...clone(data),...attackDraft.filter(a=>a.inventoryId!=null)]);
  }catch(e){editorMessage(status,e);}}));
  const fields=editorNode("textarea");fields.rows=5;fields.value=engine.getObsidianModule().stringifyYaml(Object.fromEntries(Object.entries(manualFields).map(([key,value])=>[creatureMap[key]??key,value])));
  manual.append(editorNode("p","Off-book fields (YAML mapping): name, desc, level, hp, initiative, defense, meleeSkill, gunsSkill, otherSkill."),fields,
    editorButton("Apply custom fields",()=>{try{
      const data=engine.getObsidianModule().parseYaml(fields.value);
      const allowed=["name","desc","level","hp","initiative","defense","meleeSkill","gunsSkill","otherSkill"];
      if(!data||Array.isArray(data)||typeof data!=="object"||Object.keys(data).some(k=>!allowed.includes(k)))throw new Error("Use only the listed custom fields.");
      if(Object.entries(data).some(([k,v])=>v!==null&&typeof v==="object"))throw new Error("Custom fields must be scalars.");
      for(const [key,value]of Object.entries(data))if(!["name","desc"].includes(key)&&String(value)!=="-"&&(!Number.isFinite(Number(value))||Number(value)<0))throw new Error(key+" must be a nonnegative number or -.");
      const translated=clone(data);
      for(const [old,current]of Object.entries(creatureMap))if(Object.hasOwn(translated,current)){translated[old]=translated[current];delete translated[current];}
      bypassEdit(()=>manualFields=translated);
    }catch(e){editorMessage(status,e);}}),status);
  panel.append(manual);upgradeArea.append(panel);
}
async function saveCustomNpc(folder,name) {
  validateEditorExport();
  const root=CUSTOM_NPC_ROOT,parts=String(folder??"").replace(/\\/g,"/").split("/").filter(Boolean);
  if(parts.some(p=>p==="."||p===".."||/[<>:"|?*]/.test(p)))throw new Error("Use a relative subfolder without . or ..");
  const stem=String(name??"").trim().replace(/\.md$/i,"");
  if(!stem||/[\\/<>:"|?*]/.test(stem)||stem==="."||stem==="..")throw new Error("Enter a valid note name.");
  const dir=[root,...parts].join("/"),path=dir+"/"+stem+".md";
  if(path===loadedSourcePath||app.vault.getAbstractFileByPath(path))throw new Error("That note already exists. Choose another name; source notes are never overwritten.");
  let current="";
  for(const part of dir.split("/")){current=current?current+"/"+part:part;const existing=app.vault.getAbstractFileByPath(current);if(existing && !Array.isArray(existing.children))throw new Error("A file blocks folder "+current);if(!existing)await app.vault.createFolder(current);}
  return app.vault.create(path,"```statblock\n"+yamlify(upgradedNPC)+"\n```\n");
}

// Refreshable NPC collections. Match directory boundaries, including overlapping roots.
function npcRoots() {
  return [...new Set(NPC_PATHS.map(path=>String(path).replace(/\\/g,"/").replace(/^\/+|\/+$/g,"")).filter(Boolean))];
}
function npcCollectionRoot(path) {
  return npcRoots().filter(root=>path.startsWith(root+"/")).sort((a,b)=>b.length-a.length)[0];
}
function npcFolderLabel(folder) {
  const root=npcCollectionRoot(folder+"/") ?? folder;
  const relative=folder===root?"":folder.slice(root.length+1);
  return root.split("/").slice(-2).join("/")+(relative?" › "+relative:"");
}
async function refreshNpcSources(preferredPath) {
  const previousFolder=folderSelect.input.value,previousFile=preferredPath || fileSelect.input.value;
  allFiles=app.vault.getFiles();
  const folders=[...new Set(allFiles.filter(file=>file.extension==="md"&&npcCollectionRoot(file.path))
    .map(file=>file.path.split("/").slice(0,-1).join("/")))].sort((a,b)=>npcFolderLabel(a).localeCompare(npcFolderLabel(b)));
  folderSelect.input.replaceChildren();
  for(const folder of folders){const option=new Option(npcFolderLabel(folder),folder);option.title=folder;folderSelect.input.append(option);}
  const preferredFolder=previousFile?.split("/").slice(0,-1).join("/");
  if(folders.includes(preferredFolder))folderSelect.input.value=preferredFolder;
  else if(folders.includes(previousFolder))folderSelect.input.value=previousFolder;
  await updateFileDropdown(previousFile);
}
function equipmentDisplayName(entry) {
  const value=String(entry?.name || entry?.item || "Unnamed item");
  return value.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,(_,target,alias)=>alias||target.split("/").pop().replace(/\.md$/i,""));
}
function equipmentDescription(entry) {
  if(!entry)return "—";
  return [equipmentDisplayName(entry),"×"+(entry.quantity??1),entry.equipped?"equipped":"carried",
    entry.mods?.length?"Mods: "+entry.mods.map(m=>(m.slot?m.slot+": ":"")+equipmentDisplayName({item:m.item})).join(", "):""].filter(Boolean).join(" · ");
}
function renderChangeSummary() {
  if(!original||!upgradedNPC)return;
  const before=exportNpc(original),after=exportNpc(upgradedNPC),rows=[];
  const value=v=>v==null?"—":typeof v==="object"?JSON.stringify(v):String(v);
  const add=(label,a,b)=>{if(JSON.stringify(a)!==JSON.stringify(b))rows.push([label,value(a),value(b)]);};
  const named=(label,a=[],b=[])=>{
    a=Array.isArray(a)?a:[];b=Array.isArray(b)?b:[];
    const keys=[...new Set([...a,...b].map(e=>e.name))];
    for(const key of keys){const x=a.find(e=>e.name===key),y=b.find(e=>e.name===key);
      add(label+" · "+key,x?String(x.desc??"—")+(x.tagged?" · TAG":""):undefined,y?String(y.desc??"—")+(y.tagged?" · TAG":""):undefined);}
  };
  named("SPECIAL",before.special,after.special);named("Skill",before.skills,after.skills);
  const inventoryKeys=[...new Set([...(before.inventory??[]),...(after.inventory??[])].map((e,i)=>e.id??"row-"+i))];
  const locate=(array,key)=>(array??[]).find((e,i)=>(e.id??"row-"+i)===key);
  for(const key of inventoryKeys){const x=locate(before.inventory,key),y=locate(after.inventory,key);
    add("Equipment",x?equipmentDescription(x):undefined,y?equipmentDescription(y):undefined);}
  for(const key of new Set([...Object.keys(before),...Object.keys(after)])){
    if(["layout","special","skills","inventory"].includes(key))continue;
    const label=({hp:"HP",level:"Level",name:"Name",desc:"Description",initiative:"Initiative",defense:"Defense",phys_dr:"Physical DR",energy_dr:"Energy DR",rad_dr:"Radiation DR",poison_dr:"Poison DR",attacks:"Attacks",special_abilities:"Special abilities",scavenge_rules:"Scavenge rules"})[key] ?? key;
    add(label,before[key],after[key]);
  }
  changeSummary.replaceChildren(editorNode("summary","Changes ("+rows.length+")"));
  const body=editorNode("div",null,"vk-change-list");
  body.append(editorNode("p",`Upgrades spent — Weapon: ${characterWeaponUpgrades}/${equipmentAllowance()} · Armor: ${characterArmorUpgrades}/${equipmentAllowance()}${bypassLimits?" · Bypass enabled":""}`));
  if(!rows.length)body.append(editorNode("p","No changes."));
  for(const [label,oldValue,newValue]of rows){
    const row=editorNode("div",null,"vk-change-row");
    row.append(editorNode("strong",label),editorNode("div","Was: "+oldValue),editorNode("div","Now: "+newValue));body.append(row);
  }
  changeSummary.append(body);
}
function equipmentCategory(file,data={}) {
  if(data.damage_rating!=null||/\/Weapons\//i.test(file.path))return "weapon";
  if(/clothing|outfit/i.test(String(data.category??""))||/\/(Clothing|Outfits?)\//i.test(file.path))return "clothing";
  if(data["dmg resistances"]!=null||/\/(Apparel|Armor)\//i.test(file.path))return "armor";
  return "other";
}
function showEquipmentPreview(source,selected,host) {
  host.replaceChildren(editorNode("strong",selected.data.name||selected.file.basename));
  const old=source?.data??{},data=selected.data;
  const dr=record=>(record["dmg resistances"]??[]).map(e=>e.name+": "+e.desc).join(" · ");
  const metrics=[["Rarity",old.rarity,data.rarity],["Damage",old.damage_rating,data.damage_rating],
    ["Fire rate",old.fire_rate,data.fire_rate],["Range",old.range,data.range],["Damage type",old.damage_type,data.damage_type],
    ["Ammo",old.ammo,data.ammo],["Locations",old.locations,data.locations],["DR",dr(old),dr(data)],
    ["Piece HP",old.hp,data.hp],["Weight",old.weight,data.weight],["Cost",old.cost,data.cost]];
  for(const [label,a,b]of metrics){if(b==null||b==="")continue;const row=editorNode("div",null,"vk-item-metric");
    row.append(editorNode("span",label),editorNode("span",source?String(a??"—")+" → "+b:String(b)));host.append(row);}
  if(data.gameEffects)host.append(editorNode("p",equipmentDisplayName({item:data.gameEffects})));
}

// === INIT ===
let allFiles = [];
await refreshNpcSources();
	folderSelect.input.onchange = updateFileDropdown;
	folderSelect.input.style.backgroundColor = "#fde4c9";
	folderSelect.input.style.color = "black";
	folderSelect.input.style.borderRadius = "5px";
	
	await loadLegendaryAbilities();
	await loadCreatureForms();
	await updateFileDropdown();
	

const compareButton = createButton("Load NPC", async () => {
    const path = fileSelect.input.value;
    const file = app.vault.getAbstractFileByPath(path);
    const content = await app.vault.read(file);
    const statMatch = content.match(/```statblock([\s\S]*?)```/);
    if (!statMatch) return resultBlock.textContent = "No statblock found.";

    const yaml = statMatch[1].trim();
    npc = importNpc(parseYAML(yaml));
    loadedSourcePath = path;
    original = structuredClone(npc);
    beginEquipmentSession();
    viewOriginal = false;
    legendaryEnabled = isAlreadyLegendaryOrMajor(npc);
	selectedLegendaryAbilityId = ""; // per your rule: checkbox ON does not auto-select
    upgrades = {};
	skillUpgrades = {};
	selectedFormId = null;
	formChoiceState = {
	  alpha: { attr: "", skill: "", mode: "dr", drType: "phys", attackIndex: 0 }
	};
    creatureDamageUpgrades = {};
    creatureDRUpgrades = { phys: 0, energy: 0, rad: 0 };
    characterWeaponUpgrades = 0;
	characterArmorUpgrades = 0;
    applyUpgradePlan();
    resetButton.style.display = "";
	upgradeArea.style.display = "";
	yamlDiv.style.display = "";

});
compareButton.style.backgroundColor = "#ffc200";
compareButton.style.color = "black";
compareButton.style.alignSelf = "center";
compareButton.style.width = "60%";

const exportButton = createButton("📋 Export Upgraded YAML", async () => {
    if (!upgradedNPC) {
        exportButton.textContent = "❌ No NPC Loaded";
        return;
    }
    try { validateEditorExport(); } catch (e) { new (engine.getObsidianModule().Notice)(e.message); return; }
    const upgradedYAML = "```statblock\n" + yamlify(upgradedNPC) + "\n```";
    try {
        await navigator.clipboard.writeText(upgradedYAML);
        exportButton.textContent = "✅ Copied!";
        setTimeout(() => {
            exportButton.textContent = "📋 Export Upgraded YAML";
        }, 1500);
    } catch (err) {
        exportButton.textContent = "❌ Failed to Copy";
    }
});
exportButton.style.maxWidth = "40%";
exportButton.style.marginBottom = "1"
exportButton.style.backgroundColor = "#ffc200"
exportButton.style.color = "black";

const toggleView = createButton("Toggle View", () => {
    viewOriginal = !viewOriginal;
    renderUpgrades();
});
toggleView.style.backgroundColor = "#ffc200";
toggleView.style.color = "black";
toggleView.style.maxWidth = "20%";
toggleView.style.marginLeft = "0";

const resetButton = createButton("Reset Upgrades", () => {
    beginEquipmentSession();
    upgrades = {};
    skillUpgrades = {};
    creatureDamageUpgrades = {};
    creatureDRUpgrades = {
        phys: 0,
        energy: 0,
        rad: 0
    };
    characterWeaponUpgrades = 0;
    characterArmorUpgrades = 0;
    renderUpgrades();
});
resetButton.style.marginTop = "10px"
resetButton.style.color = "black";
resetButton.style.maxWidth = "40%";
resetButton.style.display = "none";
resetButton.style.justifySelf = "right";
resetButton.style.marginLeft = "0";
resetButton.style.backgroundColor = "#b6b6b6";
resetButton.style.border = "1px transparent #ccc";
resetButton.style.marginBottom = "10px";

const yamlDiv = document.createElement("div");
yamlDiv.style.display = "none";
yamlDiv.className = "vk-preview-panel";
const previewHeading = document.createElement("div");
previewHeading.className = "vk-panel-heading";
previewHeading.textContent = "Live NPC Preview";
const previewActions = document.createElement("div");
previewActions.className = "vk-preview-actions";
previewActions.append(toggleView, exportButton);
const saveOptions=editorNode("details",null,"vk-save-options");
saveOptions.append(editorNode("summary","Save as new custom note"));
const saveFolder=editorInput("Subfolder (optional)",""),saveName=editorInput("Note name","");
const saveStatus=editorNode("div","", "vk-editor-status");
saveOptions.append(editorNode("p","Destination: "+CUSTOM_NPC_ROOT),saveFolder.wrap,saveName.wrap,editorButton("Create new note",async()=>{
  try { const file=await saveCustomNpc(saveFolder.input.value,saveName.input.value||upgradedNPC?.name);await refreshNpcSources(file.path);saveStatus.textContent="Created "+file.path; }
  catch(e){editorMessage(saveStatus,e);}
}),saveStatus);
previewActions.append(saveOptions);

const changeSummary=editorNode("details",null,"vk-change-summary");
yamlDiv.append(changeSummary);
const previewScroll = document.createElement("div");
previewScroll.className = "vk-preview-scroll";
previewScroll.append(resultBlock);
yamlDiv.append(previewHeading, previewActions, changeSummary, previewScroll);

const selection = document.createElement("div");
selection.className = "vk-selection";
function makeField(label, input) {
    const wrapper = document.createElement("div");
    wrapper.className = "vk-field";
    wrapper.append(label, input);
    return wrapper;
}
selection.append(makeField(levelInput.label, levelInput.input),
    makeField(folderSelect.label, folderSelect.input),
    makeField(fileSelect.label, fileSelect.input), compareButton);
const bypassControl = editorInput("Bypass leveling limits", false, "checkbox");
bypassControl.input.onchange = () => { bypassLimits=bypassControl.input.checked; if(npc)renderUpgrades(); };
selection.append(bypassControl.wrap,createButton("Refresh NPC folders",()=>refreshNpcSources()));
levelInput.input.onchange = () => { if(npc)applyUpgradePlan(); };
compareButton.style.width = "auto";
compareButton.style.maxWidth = "none";
compareButton.style.margin = "0";

const mainLayout = document.createElement("div");
mainLayout.className = "vk-main";
const controlsPanel = document.createElement("div");
controlsPanel.className = "vk-controls";
const controlsHeading = document.createElement("div");
controlsHeading.className = "vk-panel-heading";
controlsHeading.textContent = "Leveling Controls";
const summaryBar = document.createElement("div");
summaryBar.className = "vk-summary";
const controlsScroll = document.createElement("div");
controlsScroll.className = "vk-controls-scroll";
controlsScroll.append(upgradeArea);
controlsPanel.append(controlsHeading, summaryBar, controlsScroll);
mainLayout.append(controlsPanel, yamlDiv);
container.append(selection, mainLayout);

// Preserve user-opened sections when the UI is rebuilt after every edit.
const sectionState = new Map();
// Read from the same point pools used by the existing upgrade controls.
function levelerSectionStatus(key, isCreature, originalNpc) {
    const requested = Number.parseInt(levelInput.input.value, 10) || 0;
    const base = Number.parseInt(originalNpc.level, 10) || 0;
    const gain = Math.max(0, requested - base);
    const spent = values => Object.values(values).reduce((a, b) => a + (Number(b) || 0), 0);
    const remaining = n => Math.max(0, n);
    const points = (n, unit) => n > 0
        ? { text: `${n} ${unit} remaining`, pending: true }
        : { text: "Complete", pending: false };

    switch (key) {
        case "attributes": {
            const promo = legendaryPromoAttrPoints + legendaryPromoBodySpent + legendaryPromoMindSpent
                + majorPromoAttrPoints + spent(majorPromoSpent);
            return points(remaining(availableAttributePoints + promo - spent(upgrades)), "points");
        }
        case "skills":
            return points(remaining(availableSkillPoints - spent(skillUpgrades)), "points");
        case "damage":
            return points(remaining(Math.floor(gain / 2) - spent(creatureDamageUpgrades)), "D6");
        case "dr":
            return points(remaining(Math.floor(gain / 2) - spent(creatureDRUpgrades)), "upgrades");
        case "gear": {
            const perType = Math.floor(gain / 2);
            return points(remaining(perType - characterWeaponUpgrades)
                + remaining(perType - characterArmorUpgrades), "upgrades");
        }
        case "forms": {
            const form = selectedFormId && formsById[selectedFormId];
            return { text: form?.name || "None selected", pending: false };
        }
        case "promotion": {
            if (!legendaryEnabled) return { text: "Disabled", pending: false };
            const ability = legendaryAbilityById[selectedLegendaryAbilityId];
            if (isCreature && !ability) return { text: "Ability not selected", pending: true };
            const remainingTags = isMajorPromoActive(originalNpc)
                ? remaining(majorTagPicksNeeded - majorTagSelections.length) : 0;
            if (remainingTags) return points(remainingTags, "tag picks");
            return { text: ability?.name || "Enabled", pending: false };
        }
        default: return { text: "", pending: false };
    }
}

function groupLevelerControls(isCreature, temp, originalNpc) {
    const all = Array.from(upgradeArea.children);
    const sections = [
      { key:"attributes", label:"Attributes", elements:[] },
      { key:"skills", label:"Skills", elements:[] },
      { key:"damage", label:"Damage Upgrades", elements:[] },
      { key:"dr", label:"DR Upgrades", elements:[] },
      { key:"gear", label:"Gear Upgrades", elements:[] },
      { key:"forms", label:"Creature Forms", elements:[] },
      { key:"promotion", label:"Legendary / Major", elements:[] },
    ];
    const byKey = Object.fromEntries(sections.map(s=>[s.key,s]));
    let mode = "promotion";
    for (const el of all) {
        const title = (el.textContent || "").trim();
        // These stand-alone elements are reliable boundaries from renderUpgrades().
        if (el.classList.contains("vk-ignore-section")) continue;
        if (el === resetButton) {
            controlsPanel.appendChild(el);
            el.style.display = "";
            el.style.margin = "10px 0 0";
            continue;
        }
        if (el === levelerDerivedBlock) continue;
        if (title === "Damage Upgrades") mode = "damage";
        else if (title === "DR Upgrades") mode = "dr";
        else if (title === "Gear Upgrades") mode = "gear";
        else if (el === levelerFormSection) mode = "forms";
        else if (el === levelerAttrContainer) mode = "attributes";
        else if (el === levelerSkillContainer) mode = "skills";
        byKey[mode].elements.push(el);
    }
    upgradeArea.replaceChildren();
    for (const section of sections) {
        if (!section.elements.length) continue;
        const details = document.createElement("details");
        details.className = "vk-section";
        details.open = sectionState.has(section.key)
          ? sectionState.get(section.key)
          : (section.key === "attributes" || section.key === "damage" || (!isCreature && section.key === "skills"));
        const heading = document.createElement("summary");
        heading.textContent = section.label;
        const status = levelerSectionStatus(section.key, isCreature, originalNpc);
        if (status.text) {
            const statusEl = document.createElement("span");
            statusEl.className = "vk-section-status" + (status.pending ? " vk-pending" : "");
            statusEl.textContent = status.text;
            heading.appendChild(statusEl);
        }
        const body = document.createElement("div");
        body.className = "vk-section-body";
        body.append(...section.elements);
        // Drop duplicate headings generated by the original control builders.
        if (section.key === "attributes") {
            const attr = body.querySelector(".vk-attribute-container");
            if (attr?.firstElementChild?.textContent?.trim() === "Attributes") attr.firstElementChild.remove();
        }
        if (section.key === "skills") {
            const skill = body.querySelector(".vk-skill-container");
            if (skill?.firstElementChild?.textContent?.trim() === "Skills") skill.firstElementChild.remove();
        }
        if (["damage", "dr", "gear"].includes(section.key)) {
            const first = body.firstElementChild;
            if (first?.textContent?.trim() === section.label) first.remove();
        }
        details.append(heading, body);
        details.addEventListener("toggle", () => sectionState.set(section.key, details.open));
        upgradeArea.append(details);
    }
    const stat = (label, value, base) => {
        const item = document.createElement("div");
        item.className = "vk-summary-item";
        const caption = document.createElement("span");
        caption.textContent = label;
        const number = document.createElement("strong");
        number.textContent = String(value ?? "—");
        const baseText = document.createElement("span");
        baseText.textContent = `Base ${base ?? "—"}`;
        item.append(caption, number, baseText);
        return item;
    };
    summaryBar.replaceChildren(
      stat("HP", temp.hp, originalNpc.hp),
      stat("Initiative", temp.initiative, originalNpc.initiative),
      stat("Defense", temp.defense, originalNpc.defense)
    );
}

let levelerDerivedBlock = null;
let levelerFormSection = null;
let levelerAttrContainer = null;
let levelerSkillContainer = null;

let viewOriginal = false;
return container;

// === Functions ===

function parseYAML(text) {
    const data = engine.getObsidianModule().parseYaml(text);
    if (!data || Array.isArray(data) || typeof data !== "object") throw new Error("NPC statblock must be a YAML mapping.");
    return data;
}

function updateAttackTN(attack, stats) {
    const name = String(attack.name || "");
    const match = name.match(/:\s*(STR|PER|END|CHA|INT|AGI|LCK|BODY|MIND)\s*\+\s*([^()]+?)\s*\(TN\s*\d+\)/i);
    if (!match) return;
    const attrFields = { STR: "strength", PER: "per", END: "end", CHA: "cha",
        INT: "int", AGI: "agi", LCK: "lck", BODY: "body_attr", MIND: "mind" };
    const attr = Number.parseInt(stats[attrFields[match[1].toUpperCase()]], 10);
    const skillKey = match[2].trim().toLowerCase();
    const creature = String(stats.type || "").toLowerCase().includes("creature");
    const skillObj = (Array.isArray(stats.skills) ? stats.skills : [])
        .find(s => String(s.name || "").trim().toLowerCase() === skillKey);
    const skillValue = creature && ["melee", "guns", "other"].includes(skillKey)
        ? stats[skillKey] : skillObj?.desc;
    const skill = Number.parseInt(String(skillValue ?? "0").match(/\d+/)?.[0] || "0", 10);
    if (!Number.isFinite(attr)) return;
    attack.name = name.replace(/\(TN\s*\d+\)/i, `(TN ${attr + skill})`);
}




function applyUpgradePlan() {
    const playerLevel = parseInt(levelInput.input.value);
    const npcLevel = parseInt(npc.level || 0);
    const rawDiff = playerLevel - npcLevel;
	const diff = Math.max(0, rawDiff); // never allow negative "upgrade" points
	
	availableAttributePoints = Math.floor((diff + 1) / 2);
	availableSkillPoints = npc.type?.toLowerCase().includes("character") ? diff : 0;
    renderUpgrades();
}


// Parse a DR field
function parseDR(raw) {
    if (raw == null) return { value: 0, isImmune: false };
    const str = raw.toString().trim().toLowerCase();

    if (str === "immune") return { value: 0, isImmune: true };
    if (str === "-" || str === "") return { value: 0, isImmune: false };

    return { value: 1, isImmune: false };
}


// Upgrade a DR field
function upgradeDRString(drStr, amount) {
    if (!drStr || drStr.trim() === "-" || drStr.trim() === "") {
        return `${amount} (All)`; // ✅ Upgrade from "-" or blank to "1 (All)"
    }
    if (drStr.toLowerCase().includes("immune")) {
        return drStr; // No change for immune
    }

    return drStr.replace(/(\d+)/g, (_, num) => `${parseInt(num) + amount}`);
}

function applyLegendaryCreaturePromotion(temp, originalNpc) {
  // Applies ONLY if:
  // - legendaryEnabled is ON
  // - NPC is a creature
  // - original type is NOT already legendary (so we don't re-promote baked statblocks)

  const originalType = (originalNpc.type || "").toLowerCase();
  const isCreature = originalType.includes("creature");
  const alreadyLegendary = originalType.includes("legendary");
  const isMighty = originalType.includes("mighty");

  // Default: no multipliers
  let hpMult = 1;
  let xpMult = 1;

  // If promotion not active/applicable, clear tie promo pool & spent so it can't linger
  if (!legendaryEnabled || !isCreature || alreadyLegendary) {
    legendaryPromoAttrPoints = 0;
    legendaryPromoBodySpent = 0;
    legendaryPromoMindSpent = 0;
    return { hpMult, xpMult };
  }

  // Apply the promotion "type" label
  temp.type = "Legendary Creature";

  // Multipliers by Normal vs Mighty
  hpMult = isMighty ? 1.5 : 3;
  xpMult = isMighty ? 1.5 : 3;

  // Base attributes come from ORIGINAL (not temp) so upgrades remain upgrades
  const body0 = parseInt(originalNpc.body_attr || "0");
  const mind0 = parseInt(originalNpc.mind || "0");

  let autoBody = 0;
  let autoMind = 0;

  if (!isMighty) {
    // Normal Creature: +2 Body, +2 Mind
    autoBody = 2;
    autoMind = 2;

    // No tie-pool in this branch
    legendaryPromoAttrPoints = 0;
    legendaryPromoBodySpent = 0;
    legendaryPromoMindSpent = 0;
  } else {
    // Mighty Creature: +2 to the lower of Body/Mind; if tie, allocate via promo points
    if (body0 < mind0) {
      autoBody = 2;
      legendaryPromoAttrPoints = 0;
      legendaryPromoBodySpent = 0;
      legendaryPromoMindSpent = 0;
    } else if (mind0 < body0) {
      autoMind = 2;
      legendaryPromoAttrPoints = 0;
      legendaryPromoBodySpent = 0;
      legendaryPromoMindSpent = 0;
    } else {
      // Tie case: grant 2 promo points to spend ONLY on Body/Mind via your steppers
      const spent = legendaryPromoBodySpent + legendaryPromoMindSpent;
      legendaryPromoAttrPoints = Math.max(0, 2 - spent);

      // No auto adds in tie case
      autoBody = 0;
      autoMind = 0;
    }
  }

  // Apply auto promo + tie promo spent + your normal upgrades already applied elsewhere
  // Important: we are setting these to base+auto+promoSpent; your loop later adds "upgrades[stat]"
  temp.body_attr = body0 + autoBody + legendaryPromoBodySpent;
  temp.mind = mind0 + autoMind + legendaryPromoMindSpent;

  // XP multiplier
  const baseXp = parseInt(originalNpc.xp || "0");
  if (!Number.isNaN(baseXp) && baseXp > 0) {
    temp.xp = Math.round(baseXp * xpMult).toString();
  }

  return { hpMult, xpMult };
}

function applyMajorCharacterPromotion(temp, originalNpc) {
  const originalType = (originalNpc.type || "").toLowerCase();
  const isCreature = originalType.includes("creature");
  const alreadyMajor = originalType.includes("major");
  const isNormalChar = originalType.includes("normal") && originalType.includes("character");
  const isNotableChar = originalType.includes("notable") && originalType.includes("character");

  // Defaults (no-op)
  let xpMult = 1;
  let initBonus = 0;
  let hpBonusMode = "none"; // "lck" or "2lck"
  majorTagPicksNeeded = 0;

  // If not applicable, clear promo pools so nothing lingers
  if (!legendaryEnabled || isCreature || alreadyMajor || (!isNormalChar && !isNotableChar)) {
    majorPromoAttrPoints = 0;
    majorPromoSpent = Object.fromEntries(SPECIAL_KEYS.map(k => [k, 0]));
    majorTagPicksNeeded = 0;
    majorTagSelections = [];
    return { xpMult, initBonus, hpBonusMode };
  }

  // Set type label
  temp.type = "Major Character";

  if (isNormalChar) {
    xpMult = 3;
    initBonus = 4;
    hpBonusMode = "2lck";
    majorTagPicksNeeded = 2;

    const spent = Object.values(majorPromoSpent).reduce((a,b)=>a+b,0);
    majorPromoAttrPoints = Math.max(0, 14 - spent);
  } else {
    xpMult = 1.5;
    initBonus = 2;
    hpBonusMode = "lck";
    majorTagPicksNeeded = 1;

    const spent = Object.values(majorPromoSpent).reduce((a,b)=>a+b,0);
    majorPromoAttrPoints = Math.max(0, 7 - spent);
  }

  // XP multiplier
  const baseXp = parseInt(originalNpc.xp || "0");
  if (!Number.isNaN(baseXp) && baseXp > 0) {
    temp.xp = Math.round(baseXp * xpMult).toString();
  }

  // Luck Points = LCK (you may need to adjust this key if your YAML uses a different field)
  temp.luck_points = parseInt(temp.lck || "0");

  return { xpMult, initBonus, hpBonusMode };
}

function isMajorPromoActive(originalNpc) {
  const t = (originalNpc?.type || "").toLowerCase();
  const isCreature = t.includes("creature");
  const alreadyMajor = t.includes("major");
  const eligibleChar = (t.includes("normal") && t.includes("character")) || (t.includes("notable") && t.includes("character"));
  return legendaryEnabled && !isCreature && !alreadyMajor && eligibleChar;
}

function ensureTagSkill(tempNpc, skillKeyLower) {
  if (!tempNpc.skills || !Array.isArray(tempNpc.skills)) tempNpc.skills = [];

  const key = (skillKeyLower || "").trim().toLowerCase();
  const displayName = titleCase(key);

  let existing = tempNpc.skills.find(s => (s.name || "").trim().toLowerCase() === key);

  if (!existing) {
    tempNpc.skills.push({ name: displayName, desc: "2 ⬛" });
    return;
  }

  const baseNum = parseInt((existing.desc || "0").match(/\d+/)?.[0] || "0");
  const newNum = Math.max(baseNum, 2);

  // Always ensure tag marker is present
  existing.desc = `${newNum} ⬛`;
}

function isFormEligible(form, originalNpc) {
  const { typeStr, keywords } = getNpcMeta(originalNpc);

  // Applies-to gates still based on type
  if (form.applies_to === "creature" && !typeStr.includes("creature")) return false;
  if (form.applies_to === "creature_or_character") {
    if (!(typeStr.includes("creature") || typeStr.includes("character"))) return false;
  }

  // Requirements: exclude should match EITHER type OR keywords
  if (form.requirements?.exclude) {
    for (const exRaw of form.requirements.exclude) {
      const ex = (exRaw || "").toString().trim().toLowerCase();
      if (!ex) continue;

      if (typeStr.includes(ex)) return false;
      if (keywords.has(ex)) return false;
    }
  }

  return true;
}


function removeInjectedForm(tempNpc) {
  if (!tempNpc.special_abilities || !Array.isArray(tempNpc.special_abilities)) return;

  tempNpc.special_abilities = tempNpc.special_abilities.filter(sa => {
    const desc = (sa?.desc || "");
    return !injectedFormAbilities.has(sa) && !desc.includes("<!-- form_id:");
  });
}


function injectForm(tempNpc, form) {
  if (!Array.isArray(tempNpc.special_abilities)) tempNpc.special_abilities = [];
  removeInjectedForm(tempNpc);

  const raw = (form.effectText || "").replace(/\r\n/g, "\n").replace(/\\n/g, "\n").trim();
  const title = (form?.spec?.injection?.title || form?.injection?.title || form?.name || form?.id || "FORM")
    .replace(/:$/, "").trim();

  // Scorched's template contains instructions for applying mechanical changes.
  // Those changes are already performed by the leveler. Only inject the actual ability.
  let text = raw;
  if (form.id === "scorched") {
    const match = raw.match(/(?:^|\n)\s*(?:>\s*)?(?:\*{1,2})?Scorched:(?:\*{1,2})?\s*([\s\S]*)/i);
    if (match) text = match[1].trim();
  }

  // Strip old quote formatting without changing the wording of the ability.
  text = text.split("\n").map(line => line.replace(/^\s*>+\s?/, "")).join("\n").trim();
  // Store actual line breaks; the YAML exporter escapes them exactly once.
  const ability = {
    name: (form.id === "scorched" ? "SCORCHED" : title).toUpperCase() + ":",
    desc: text.replace(/<!--\s*form_id:[\s\S]*?-->/g, "").trim()
  };
  injectedFormAbilities.add(ability);
  tempNpc.special_abilities.unshift(ability);
}

function removeRedundantImmuneToRadiationForGlowing(tempNpc) {
  if (!tempNpc?.special_abilities || !Array.isArray(tempNpc.special_abilities)) return;

  tempNpc.special_abilities = tempNpc.special_abilities.filter(sa => {
    const name = (sa?.name || "").toString().trim().toLowerCase();
    const desc = (sa?.desc || "").toString().trim().toLowerCase();

    // Remove ONLY a standalone "immune to radiation" special ability.
    // Match by name (broad) OR by content (fallback).
    const nameLooksLikeImmuneRad =
      name.includes("immune") && name.includes("radiation");

    const descLooksLikeImmuneRad =
      desc.includes("radiation") &&
      (desc.includes("reduces all") || desc.includes("reduce all") || desc.includes("suffered to 0") || desc.includes("cannot suffer")) &&
      (desc.includes("damage") || desc.includes("effects"));

    if (nameLooksLikeImmuneRad || descLooksLikeImmuneRad) return false;

    return true;
  });
}



function applyAlphaMechanicalEffects(tempNpc, originalNpc) {
  const st = formChoiceState?.alpha;
  if (!st) return;

  // Level: +1
  const baseLevel = parseInt(tempNpc.level || originalNpc.level || "0");
  tempNpc.level = String(baseLevel + 1);

  // +1 to Body or Mind
  if (st.attr === "body_attr" || st.attr === "mind") {
    const v = parseInt(tempNpc[st.attr] || "0");
    tempNpc[st.attr] = String(v + 1);
  }

  // +1 to one creature skill (melee/guns/other)
  if (st.skill && ["melee", "guns", "other"].includes(st.skill)) {
    const v = parseInt(tempNpc[st.skill] || "0");
    tempNpc[st.skill] = String(v + 1);
  }

  // HP: +1, or +2 if Body increased
  // IMPORTANT: your tool later overwrites hp using calculateDerived(), so we store a temp bonus.
  tempNpc.__formHpBonus = (st.attr === "body_attr") ? 2 : 1;

  // DR +1 (one type all locations) OR +1D6 to one attack
  tempNpc.__formDrBonus = null;
  tempNpc.__formAttackBonus = null;

  if (st.mode === "dr") {
    if (["phys", "energy", "rad"].includes(st.drType)) {
      tempNpc.__formDrBonus = { type: st.drType, amount: 1 };
    }
  } else if (st.mode === "attack") {
    const idx = Number.isFinite(st.attackIndex) ? st.attackIndex : 0;
    tempNpc.__formAttackBonus = { attackIndex: idx, d6: 1 };
  }
}

function applyBonusD6ToAttack(attackObj, bonusD6) {
  const atk = { ...attackObj };
  if (!Number.isFinite(bonusD6) || bonusD6 <= 0) return atk;
  if (atk.damage != null) { atk.damage = num(atk.damage) + bonusD6; }
  else if (typeof atk.desc === "string" && atk.desc.trim()) {
    // Read ordinary damage text, including nonbreaking spaces, without changing links.
    const damage = /\b(\d+)(\s*d6)\b/i;
    if (damage.test(atk.desc)) {
      atk.desc = atk.desc.replace(damage, (_, count, suffix) =>
        `${Number.parseInt(count, 10) + bonusD6}${suffix}`);
    } else {
      atk.desc = atk.desc.trim() + ` (+${bonusD6}D6)`;
    }
  } else if (typeof atk.dice === "string" && atk.dice.trim()) {
    atk.dice = atk.dice.trim() + ` (+${bonusD6}d6)`;
  }
  return atk;
}

function getFormStatDelta(statKey) {
  if (selectedFormId !== "alpha") return 0;
  const chosen = formChoiceState?.alpha?.attr;
  return (chosen === statKey) ? 1 : 0;
}

function applyFormOperations(tempNpc, operations) {
  for (const op of operations) {
    if (!op || !op.op) continue;

    if (op.op === "set_dr") {
      const t = (op.dr_type || "").toLowerCase();
      const value = op.value ?? "";
      const field =
        t === "phys" ? "phys_dr" :
        t === "energy" ? "energy_dr" :
        t === "rad" ? "rad_dr" :
        null;

      if (field) {
        tempNpc[field] = String(value);
      }
    }
  }
}

// === Phase 4.X: Scorched (Character) mechanics ===
function normalizeSkillKey(name) {
  return (name || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function stripTagMarker(desc) {
  // Your project uses a tag marker in skill text (commonly "⬛").
  // Make this resilient: remove any of these if present.
  return (desc || "")
    .toString()
    .replace(/⬛/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function ensureTagMarker(desc) {
  const cleaned = stripTagMarker(desc);
  // Keep existing number text, just append tag marker
  return cleaned ? `${cleaned} ⬛` : `0 ⬛`;
}

function applyScorchedCharacterMechanicalEffects(tempNpc, originalNpc) {
  // Scorched template rules (Characters Only)
  // - CHA/INT reduced to 1
  // - Luck Points = 0
  // - Lose all ranks in skills except: Athletics, Melee Weapons, Sneak, Survival, Unarmed
  // - Must have exactly one Tag skill (choose from remaining set)

  // If this NPC isn't a character, do nothing
  const isCreature = (tempNpc?.type || "").toString().toLowerCase().includes("creature");
  if (isCreature) return;

  // Attributes
  tempNpc.cha = "1";
  tempNpc.int = "1";

  // Luck Points must be forced to 0 (we also re-force later after Major logic)
  tempNpc.luck_points = 0;

  // Skills
  if (!Array.isArray(tempNpc.skills)) return;

  const allowed = new Set([
    "athletics",
    "meleeweapons",
    "sneak",
    "survival",
    "unarmed",
  ]);

  // Keep allowed skills as-is (ranks preserved), nuke others to 0 and remove tag markers
  for (const s of tempNpc.skills) {
    const key = normalizeSkillKey(s?.name);
    if (!key) continue;

    if (allowed.has(key)) {
      // preserve numeric, but we’ll normalize tag later
      s.desc = (s.desc ?? "").toString();
    } else {
      s.desc = "0";
    }

    // Remove any tag marker from every skill for now
    s.desc = stripTagMarker(s.desc);
  }

  // Enforce EXACTLY ONE tagged skill among the allowed set.
  // Preference order:
  // 1) If original had a tagged allowed skill, keep the first one tagged.
  // 2) Else default to Athletics.
  let preferredTagKey = null;

  // Try to find an original tagged allowed skill
  if (Array.isArray(originalNpc?.skills)) {
    for (const s of originalNpc.skills) {
      const key = normalizeSkillKey(s?.name);
      if (!allowed.has(key)) continue;
      const desc = (s?.desc || "").toString();
      if (desc.includes("⬛")) {
        preferredTagKey = key;
        break;
      }
    }
  }

  if (!preferredTagKey) preferredTagKey = "meleeweapons";

  let taggedSet = false;

  for (const s of tempNpc.skills) {
    const key = normalizeSkillKey(s?.name);
    if (!allowed.has(key)) continue;

    if (!taggedSet && key === preferredTagKey) {
      s.desc = ensureTagMarker(s.desc);
      taggedSet = true;
    } else {
      s.desc = stripTagMarker(s.desc);
    }
  }

  // Fallback: if we somehow didn’t tag anything (missing Athletics, etc.), tag first allowed present
  if (!taggedSet) {
    for (const s of tempNpc.skills) {
      const key = normalizeSkillKey(s?.name);
      if (!allowed.has(key)) continue;
      s.desc = ensureTagMarker(s.desc);
      break;
    }
  }
}


function normalizeKeywords(raw) {
  const set = new Set();

  if (!raw) return set;

  // If YAML ever becomes a list, support it
  const parts = Array.isArray(raw) ? raw : [raw];

  for (const p of parts) {
    const s = (p || "").toString().trim().toLowerCase();
    if (!s) continue;

    // Store the full phrase
    set.add(s);

    // Also store tokens (so "Super Mutant Robot" matches "robot")
    const words = s.split(/[^a-z0-9]+/g).filter(Boolean);
    for (const w of words) set.add(w);

    // Also store adjacent pairs (so "super mutant" can be matched if you ever need it)
    for (let i = 0; i < words.length - 1; i++) {
      set.add(`${words[i]} ${words[i + 1]}`);
    }
  }

  return set;
}

function getNpcMeta(npcObj) {
  const typeStr = (npcObj?.type || "").toString().toLowerCase();
  return {
    typeStr,
    keywords: normalizeKeywords(npcObj?.keywords),
  };
}




function renderUpgrades() {
	const isCreature = npc.type?.toLowerCase().includes("creature");


	const statLabels = {
    strength: "STR",
    per: "PER",
    end: "END",
    cha: "CHA",
    int: "INT",
    agi: "AGI",
    lck: "LCK",
    body_attr: "BODY",
    mind: "MIND"
	};
	



    if (!npc) return;

    const temp = structuredClone(npc);
    if (!isCreature && equipmentDraft) temp.inventory = clone(equipmentDraft);
    if (attackDraft) temp.attacks = clone(attackDraft);
    upgradedNPC = temp;
    
    const promo = applyLegendaryCreaturePromotion(temp, original);
    const majorPromo = applyMajorCharacterPromotion(temp, original);
    // === Phase 4.1: Mechanical effects for selected form (Alpha first) ===
	if (selectedFormId === "alpha") {
	  applyAlphaMechanicalEffects(temp, original);
	} else {
	  // Clear any transient bonuses if not alpha
	  delete temp.__formHpBonus;
	  delete temp.__formDrBonus;
	  delete temp.__formAttackBonus;
	}
	
	// === Phase 4.X: Scorched (Character) mechanics ===
	if (selectedFormId === "scorched") {
	  applyScorchedCharacterMechanicalEffects(temp, original);
	}
    
    const stats = ["strength", "per", "end", "cha", "int", "agi", "lck", "body_attr", "mind"];
    const attrContainer = document.createElement("div");
    attrContainer.classList.add("vk-attribute-container");
		attrContainer.style.marginTop = "20px";
		
	const attrLabel = document.createElement("div");
	attrLabel.innerHTML = `<strong style = "font-size:14px; color:#FFC200;">Attributes</strong>`;
	attrContainer.appendChild(attrLabel);
	
	const used = getUsedAttributePoints();
	
	// Promo totals are CONSTANT pools (remaining + spent), so Total - Used works cleanly.
	const legendaryPromoTotal =
	  legendaryPromoAttrPoints + legendaryPromoBodySpent + legendaryPromoMindSpent;
	
	const majorPromoTotal =
	  majorPromoAttrPoints + Object.values(majorPromoSpent).reduce((a, b) => a + b, 0);
	
	// Total spendable attribute points right now:
	const totalAvailableAttributePoints =
	  availableAttributePoints + legendaryPromoTotal + majorPromoTotal;
	
	// Remaining points (never negative)
	const attrPointsLeft = Math.max(0, totalAvailableAttributePoints - used);
	
	const attrPointsNote = document.createElement("div");
	attrPointsNote.innerHTML = `<em style="color:#FFC200">Points Left: ${attrPointsLeft}</em>`;
	attrContainer.appendChild(attrPointsNote);


	
	// 💠 Grid wrapper
	const attrGrid = document.createElement("div");
	attrGrid.style.display = "grid";
	attrGrid.classList.add("vk-attr-grid");
	attrGrid.style.gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
	attrGrid.style.gap = "8px";
	attrGrid.style.marginTop = "8px";
	attrGrid.style.alignItems = "center";
	attrGrid.style.justifyItems = "center";



    for (let stat of stats) {
    if (temp[stat] !== undefined) {
        const base = num(temp[stat] ?? original[stat]);
		const added = upgrades[stat] || 0;
		const current = base + added;
        const label = statLabels[stat] || stat.toUpperCase();

        // Create grid cell
        const cell = document.createElement("div");
        cell.classList.add("vk-attr-cell");
        cell.style.display = "flex";
        cell.style.flexDirection = "column";
        cell.style.alignItems = "center";
        cell.style.justifyContent = "center";
        cell.style.gap = "4px";
        cell.style.justifySelf = "center";
        
        // Label text
        const labelDiv = document.createElement("div");
        labelDiv.innerHTML = (added > 0)
            ? `<strong style="color:#FFC200">${label}: ${base} → ${current}</strong>`
            : `${label}: ${current}`;

        // Buttons in row
        const buttonRow = document.createElement("div");
        buttonRow.classList.add("vk-attr-buttons");
        buttonRow.style.display = "flex";
        buttonRow.style.gap = "8px";
        buttonRow.style.marginBottom = "20px";
        buttonRow.style.justifyContent = "center"; 
        buttonRow.style.width = "100%";
        

        const plus = createButton("+", () => {
            if (bypassLimits) { upgrades[stat]=(upgrades[stat]||0)+1; renderUpgrades(); return; }
			const used = getUsedAttributePoints();
			
			// No points left at all (normal + promo)
			if (used >= totalAvailableAttributePoints) return;
			
			// Spend NORMAL points first (computed excluding promo spending)
			const normalUsed = getUsedNormalAttributePoints();
			const normalRemaining = Math.max(0, availableAttributePoints - normalUsed);
			
			if (normalRemaining > 0) {
			  upgrades[stat] = (upgrades[stat] || 0) + 1;
			  renderUpgrades();
			  return;
			}

		
		  // Otherwise we're in promo territory.
		  // Promo points may ONLY be spent on BODY/MIND.
		  if (legendaryPromoAttrPoints > 0 && (stat === "body_attr" || stat === "mind")) {
		    legendaryPromoAttrPoints--;
		    upgrades[stat] = (upgrades[stat] || 0) + 1;
		
		    if (stat === "body_attr") legendaryPromoBodySpent++;
		    else legendaryPromoMindSpent++;
		
		    renderUpgrades();
		  }
		  
		  // === Major Character promo (SPECIAL only) ===
		  const oType = (original?.type || "").toLowerCase();
		  const isCreature = oType.includes("creature");
		  const alreadyMajor = oType.includes("major");
		
		  const isSpecial = SPECIAL_KEYS.includes(stat);
		
		  // Major promo can only be spent when:
		  // - checkbox enabled
		  // - character (not creature)
		  // - source statblock is not already Major (avoid re-promoting baked statblocks)
		  // - stat is a SPECIAL stat
		  // - promo points remain
		  if (legendaryEnabled && !isCreature && !alreadyMajor && isSpecial && majorPromoAttrPoints > 0) {
		    majorPromoAttrPoints--;
		    majorPromoSpent[stat] = (majorPromoSpent[stat] || 0) + 1;
		
		    upgrades[stat] = (upgrades[stat] || 0) + 1;
		    renderUpgrades();
		    return;
		  }
		  
		});
		plus.style.marginLeft = "0";
		plus.style.width = "24px"
		
        const minus = createButton("-", () => {
          if (bypassLimits) { if (current > 0) upgrades[stat]=(upgrades[stat]||0)-1; renderUpgrades(); return; }
		  if ((upgrades[stat] || 0) <= 0) return;
		
		  upgrades[stat]--;
		
		  // Refund Legendary creature tie promo if applicable
		  if (stat === "body_attr" && legendaryPromoBodySpent > 0) {
		    legendaryPromoBodySpent--;
		    legendaryPromoAttrPoints++;
		    renderUpgrades();
		    return;
		  } else if (stat === "mind" && legendaryPromoMindSpent > 0) {
		    legendaryPromoMindSpent--;
		    legendaryPromoAttrPoints++;
		    renderUpgrades();
		    return;
		  }
		
		  // Refund Major Character promo if applicable (SPECIAL only)
		  const isSpecial = ["strength", "per", "end", "cha", "int", "agi", "lck"].includes(stat);
		  if (isSpecial && (majorPromoSpent[stat] || 0) > 0) {
		    majorPromoSpent[stat]--;
		    majorPromoAttrPoints++;
		    renderUpgrades();
		    return;
		  }
		
		  renderUpgrades();
		});

		
		minus.style.marginLeft = "0";
		minus.style.width = "24px"
	
        buttonRow.append(plus, minus);
        cell.append(labelDiv, buttonRow);
        attrGrid.appendChild(cell);
        temp[stat] = current;
    }

        attrContainer.appendChild(attrGrid);
    }

    const skillContainer = document.createElement("div");
    skillContainer.classList.add("vk-skill-container");
    skillContainer.style.marginTop = "20px";
    skillContainer.innerHTML = `<strong style = "font-size:14px; color:#FFC200;">Skills</strong>`;

	const skillPointsLeft = availableSkillPoints - getUsedSkillPoints();
		if (skillPointsLeft > 0) {
		    const skillPointsNote = document.createElement("div");
		    skillPointsNote.innerHTML = `<em style="color:#FFC200">Points Left: ${skillPointsLeft}</em>`;
		    skillContainer.appendChild(skillPointsNote);
		}
    
    if (original.skills && Array.isArray(original.skills)) {
	    const skillGrid = document.createElement("div");
		skillGrid.style.display = "grid";
		skillGrid.classList.add("vk-skill-grid");
		skillGrid.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
		skillGrid.style.gap = "8px";
		skillGrid.style.marginTop = "8px";
		skillGrid.style.alignItems = "center";
		
		// Mapping existing skills
		const skillMap = Object.fromEntries(
		    (original.skills || []).map(s => [s.name?.toLowerCase(), s])
		);
		
		for (let skillKey of validSkillNames) {
		    const s = skillMap[skillKey] || { name: titleCase(skillKey), desc: "0" };
		    const base = parseInt((s.desc || "").match(/\d+/)?.[0] || "0");
		    const added = skillUpgrades[skillKey] || 0;
		    const total = base + added;
		
		    // Skill row container
		    const row = document.createElement("div");
		    row.classList.add("vk-skill-row");
		    row.style.display = "flex";
		    row.style.justifyContent = "space-between";
		    row.style.alignItems = "center";
		    row.style.borderBottom = "2px solid rgba(255,255,255,0.2)";
		    row.style.padding = "5px 15px"; 
		
		    const labelText = (added > 0)
		        ? `<strong style="color:#FFC200">${s.name}: ${base} → ${total}</strong>`
		        : `${s.name}: ${total}`;
		
		    const labelDiv = document.createElement("div");
		    labelDiv.classList.add("vk-skill-label");
		    labelDiv.innerHTML = labelText;
		
		    const buttonRow = document.createElement("div");
		    buttonRow.classList.add("vk-skill-buttons");
		    buttonRow.style.display = "flex";
		    buttonRow.style.gap = "1px";
		
		    const tag=editorInput("TAG",tagOverrides[skillKey] ?? (s.tagged===true || String(s.desc).includes("⬛")),"checkbox");
            tag.input.disabled=!bypassLimits;
            tag.input.onchange=()=>{try{bypassEdit(()=>tagOverrides[skillKey]=tag.input.checked);}catch(e){new (engine.getObsidianModule().Notice)(e.message);}};
            buttonRow.append(tag.wrap);
    const plus = createButton("+", () => {
		        if (bypassLimits || (getUsedSkillPoints() < availableSkillPoints && total < 6)) {
		            skillUpgrades[skillKey] = (skillUpgrades[skillKey] || 0) + 1;
		            renderUpgrades();
		        }
		    });
			plus.style.width = "24px"
		
		    const minus = createButton("-", () => {
		        if ((bypassLimits && total > 0) || (skillUpgrades[skillKey] || 0) > 0) {
		            skillUpgrades[skillKey] = (skillUpgrades[skillKey] || 0) - 1;
		            renderUpgrades();
		        }
		    });
		    minus.style.width = "24px"
		
		    buttonRow.append(plus, minus);
		    row.append(labelDiv, buttonRow);
		    skillGrid.appendChild(row);
		}
		skillContainer.appendChild(skillGrid);
	}
	
	// Baseline derived (used for "from" values in the UI)
	const baselineNpc = structuredClone(original);
	const baselineDerived = calculateDerived(baselineNpc);


    const derived = calculateDerived(temp);  // includes isCreature
		const levelGain = derived.levelGain;
		temp.hp = derived.hp.total;
		// Phase 3: Legendary Creature HP multiplier (applies after derived HP calculation)
		if (promo?.hpMult && promo.hpMult !== 1) {
		  const hpNum = parseInt(temp.hp || "0");
		  if (!Number.isNaN(hpNum)) {
		    temp.hp = Math.round(hpNum * promo.hpMult).toString();
		  }
		}
		temp.initiative = derived.initiative;
		
		// === Step 6: Major Character derived bonuses ===
		if (isMajorPromoActive(original) && majorPromo) {
		  // Initiative bonus (+4 Normal->Major, +2 Notable->Major)
		  const ini = parseInt(temp.initiative || "0");
		  if (!Number.isNaN(ini)) temp.initiative = (ini + (majorPromo.initBonus || 0)).toString();
		
		  // Luck Points = LCK (kept in YAML live)
		  const lckNum = parseInt(temp.lck || "0");
		  if (!Number.isNaN(lckNum)) temp.luck_points = lckNum;
		  
		  // Scorched rule override: Luck Points must be 0
		  if (selectedFormId === "scorched") temp.luck_points = 0;
		
		  // HP bonus after derived (+2×LCK Normal->Major, +LCK Notable->Major)
		  const hpNum = parseInt(temp.hp || "0");
		  if (!Number.isNaN(hpNum) && !Number.isNaN(lckNum)) {
		    const add = (majorPromo.hpBonusMode === "2lck") ? (2 * lckNum)
		              : (majorPromo.hpBonusMode === "lck")  ? lckNum
		              : 0;
		    temp.hp = (hpNum + add).toString();
		  }
		}
		
		temp.defense = derived.defense;
		if (!derived.isCreature) {
		    if (Object.hasOwn(original,"melee_bonus")) temp.melee_bonus = derived.melee; else if (Object.hasOwn(original,"melee_damage")) temp.melee_damage = derived.melee;
		}
	const baseWealth = extractWealthFromScavenge(original); // ✅ Add this
	const derivedBlock = document.createElement("div");
		const hpFrom = baselineDerived.hp.base;
		const hpTo = parseInt(temp.hp || "0");
		
		const iniFrom = baselineDerived.initiative;
		const iniTo = parseInt(temp.initiative || "0");

		
		derivedBlock.innerHTML = `
		  <strong style="font-size:14px; color:#FFC200;">Derived Stats</strong><br>
		  <div style="margin-left:8px;">
		    HP: ${hpFrom} → ${hpTo}<br>
		    Initiative: ${iniFrom}${(iniTo !== iniFrom) ? ` → ${iniTo}` : ""}<br>
		    Defense: ${derived.defense}
		    ${!derived.isCreature ? `<br>Melee Damage: ${derived.melee}` : ""}
		    ${!derived.isCreature && derived.wealth !== undefined ? `<br>Wealth: ${baseWealth} → ${derived.wealth}` : ""}
		  </div>
		`;


		derivedBlock.style.marginTop = "20px"
		derivedBlock.style.border = "1px solid grey";
		derivedBlock.style.width = "150px";
		derivedBlock.style.borderRadius = "5px";
		derivedBlock.style.padding = "5px"
		derivedBlock.style.backgroundColor = "#2e4663"
		
		upgradeArea.innerHTML = "";
		// === Legendary UI (Phase 2) ===
		const legendarySection = document.createElement("div");
		legendarySection.classList.add("vk-embedded-card");
		legendarySection.style.border = "1px solid rgba(255,255,255,0.25)";
		legendarySection.style.borderRadius = "6px";
		legendarySection.style.padding = "10px";
		legendarySection.style.background = "#2e4663";
		
		const legendaryTitle = document.createElement("div");
		legendaryTitle.textContent = "Legendary / Major";
		legendaryTitle.style.fontWeight = "bold";
		legendaryTitle.style.marginBottom = "8px";
		
		const legendaryToggleRow = document.createElement("div");
		legendaryToggleRow.style.display = "flex";
		legendaryToggleRow.style.alignItems = "center";
		legendaryToggleRow.style.gap = "10px";
		
		const legendaryCheckbox = document.createElement("input");
		legendaryCheckbox.type = "checkbox";
		legendaryCheckbox.checked = !!legendaryEnabled;
		
		const legendaryCheckboxLabel = document.createElement("label");
		legendaryCheckboxLabel.textContent = "Make Legendary / Major";
		
		legendaryToggleRow.append(legendaryCheckbox, legendaryCheckboxLabel);
		
		// Dropdown
		const abilitySelect = document.createElement("select");
		abilitySelect.style.padding = "5px";
		abilitySelect.style.backgroundColor = "#fde4c9";
		abilitySelect.style.color = "black";
		abilitySelect.style.borderRadius = "5px";
		abilitySelect.style.marginTop = "8px";
		abilitySelect.style.width = "100%";
		
		// Default option
		abilitySelect.append(new Option("-- Select Legendary Ability --", ""));
		abilitySelect.value = selectedLegendaryAbilityId || "";
		
		// Fill options (filtered)
		const eligible = legendaryAbilities.filter(a => abilityEligibleForNpc(a, npc));
		for (const a of eligible) {
		  abilitySelect.append(new Option(a.name, a.id));
		}
		
		// Disable unless checkbox ON
		abilitySelect.disabled = !legendaryEnabled;
		abilitySelect.style.opacity = legendaryEnabled ? "1" : "0.5";
		
		// Random button
		const randomBtn = createButton("Random Eligible", () => {
		  if (!legendaryEnabled) return;
		
		  const eligibleAll = legendaryAbilities.filter(a => abilityEligibleForNpc(a, npc));
		  if (!eligibleAll.length) return;
		
		  // Prefer not to re-pick the current selection (so the UI visibly changes)
		  let pool = eligibleAll;
		  if (selectedLegendaryAbilityId && eligibleAll.length > 1) {
		    pool = eligibleAll.filter(a => a.id !== selectedLegendaryAbilityId);
		  }
		
		  const pick = pool[Math.floor(Math.random() * pool.length)];
		  selectedLegendaryAbilityId = pick.id;
		  renderUpgrades();
		});

		randomBtn.style.marginLeft = "0";
		randomBtn.style.marginTop = "8px";
		randomBtn.disabled = !legendaryEnabled;
		randomBtn.style.opacity = legendaryEnabled ? "1" : "0.5";
		
		const selectedAbility = selectedLegendaryAbilityId ? legendaryAbilityById[selectedLegendaryAbilityId] : null;
		
		const selectedNameLine = document.createElement("div");
		selectedNameLine.style.marginTop = "8px";
		selectedNameLine.style.fontWeight = "bold";
		
		selectedNameLine.textContent = selectedAbility
		  ? `Selected: ${selectedAbility.name}`
		  : "Selected: (none)";
		  
		// Effect/Mutation preview
		const effectBox = document.createElement("div");
		effectBox.style.marginTop = "8px";
		effectBox.style.padding = "8px";
		effectBox.style.borderRadius = "6px";
		effectBox.style.background = "#012300";
		effectBox.style.color = "#4ee44a";
		effectBox.style.whiteSpace = "pre-wrap";
		
		const mutationBox = document.createElement("div");
		mutationBox.style.marginTop = "8px";
		mutationBox.style.padding = "8px";
		mutationBox.style.borderRadius = "6px";
		mutationBox.style.background = "#012300";
		mutationBox.style.color = "#4ee44a";
		mutationBox.style.whiteSpace = "pre-wrap";
		
		effectBox.textContent = selectedAbility ? `Effect:\n${selectedAbility.effect}` : "Effect:\n";
		effectBox.style.display = selectedAbility ? "" : "none";
		mutationBox.textContent = selectedAbility ? `Mutation:\n${selectedAbility.mutation}` : "Mutation:\n";
		mutationBox.style.display = selectedAbility ? "" : "none";
		
		// Wire events
		legendaryCheckbox.onchange = () => {
		  legendaryEnabled = legendaryCheckbox.checked;
		
		  // If disabling: remove any injected legendary ability and clear selection
		  if (!legendaryEnabled) {
		    selectedLegendaryAbilityId = "";
		  }
		
		  renderUpgrades();
		};
		
		abilitySelect.onchange = () => {
		  selectedLegendaryAbilityId = abilitySelect.value;
		  renderUpgrades();
		};
		
        // Compact details, only visible when promotion and ability selection are active.
        const legendaryOptions = document.createElement("div");
        legendaryOptions.className = "vk-legendary-options";
        legendaryOptions.style.display = legendaryEnabled ? "" : "none";
        const abilityDetails = document.createElement("details");
        abilityDetails.className = "vk-ability-details";
        const abilitySummary = document.createElement("summary");
        abilitySummary.textContent = "Ability Details";
        abilityDetails.append(abilitySummary, effectBox, mutationBox);
        abilityDetails.style.display = selectedAbility ? "" : "none";
        legendaryOptions.append(abilitySelect, randomBtn, selectedNameLine, abilityDetails);
        legendarySection.append(legendaryToggleRow, legendaryOptions);
		
		upgradeArea.appendChild(legendarySection);
		
		// === Step 7 UI: Major Tag skill selection ===
		const majorTagSection = document.createElement("div");
		majorTagSection.style.border = "1px solid rgba(255,255,255,0.25)";
		majorTagSection.style.borderRadius = "6px";
		majorTagSection.style.padding = "10px";
		majorTagSection.style.background = "#2e4663";
		majorTagSection.style.marginTop = "10px";
        majorTagSection.classList.add("vk-major-tag-section");
		
        const showMajorTagSection = isMajorPromoActive(original);
		majorTagSection.style.display = showMajorTagSection ? "" : "none";
		
		const majorTagTitle = document.createElement("div");
		majorTagTitle.textContent = "Major Tag Skills";
		majorTagTitle.style.fontWeight = "bold";
		majorTagTitle.style.marginBottom = "8px";
		
		const majorActive = isMajorPromoActive(original);
		const picksRemaining = Math.max(0, majorTagPicksNeeded - (majorTagSelections?.length || 0));
		
		const majorTagInfo = document.createElement("div");
		majorTagInfo.innerHTML = `<em style="color:#FFC200">Picks Remaining: ${majorActive ? picksRemaining : 0}</em>`;
		
		const tagSelect = document.createElement("select");
		tagSelect.style.padding = "5px";
		tagSelect.style.backgroundColor = "#fde4c9";
		tagSelect.style.color = "black";
		tagSelect.style.borderRadius = "5px";
		tagSelect.style.width = "100%";
		tagSelect.style.marginTop = "8px";
		
		tagSelect.append(new Option("-- Select a skill to Tag --", ""));
		
		// options: valid skills, excluding already selected
		const selectedSet = new Set((majorTagSelections || []).map(s => s.toLowerCase()));
		for (const sk of validSkillNames) {
		  if (!selectedSet.has(sk)) tagSelect.append(new Option(titleCase(sk), sk));
		}
		
		tagSelect.disabled = !majorActive || picksRemaining <= 0;
		tagSelect.style.opacity = (!tagSelect.disabled) ? "1" : "0.5";
		
		const addBtn = createButton("Add Tag", () => {
		  if (!majorActive) return;
		  if (picksRemaining <= 0) return;
		  const val = tagSelect.value;
		  if (!val) return;
		
		  majorTagSelections = majorTagSelections || [];
		  if (!majorTagSelections.includes(val)) majorTagSelections.push(val);
		
		  renderUpgrades();
		});
		addBtn.style.marginLeft = "0";
		addBtn.style.marginTop = "8px";
		addBtn.disabled = !majorActive || picksRemaining <= 0;
		addBtn.style.opacity = (!addBtn.disabled) ? "1" : "0.5";
		
		const randomBtn2 = createButton("Random", () => {
		  if (!majorActive) return;
		  if (picksRemaining <= 0) return;
		
		  const pool = validSkillNames.filter(sk => !selectedSet.has(sk));
		  if (!pool.length) return;
		
		  const pick = pool[Math.floor(Math.random() * pool.length)];
		  majorTagSelections = majorTagSelections || [];
		  majorTagSelections.push(pick);
		
		  renderUpgrades();
		});
		randomBtn2.style.marginLeft = "8px";
		randomBtn2.style.marginTop = "8px";
		randomBtn2.disabled = !majorActive || picksRemaining <= 0;
		randomBtn2.style.opacity = (!randomBtn2.disabled) ? "1" : "0.5";
		
		// Selected list
		const selectedList = document.createElement("div");
		selectedList.style.marginTop = "8px";
		
		for (const sk of (majorTagSelections || [])) {
		  const row = document.createElement("div");
		  row.style.display = "flex";
		  row.style.justifyContent = "space-between";
		  row.style.alignItems = "center";
		  row.style.padding = "4px 0";
		  row.style.borderBottom = "1px solid rgba(255,255,255,0.15)";
		
		  const label = document.createElement("div");
		  label.textContent = titleCase(sk);
		
		  const removeBtn = createButton("🗑️", () => {
		    majorTagSelections = (majorTagSelections || []).filter(x => x !== sk);
		    renderUpgrades();
		  });
		  removeBtn.style.marginLeft = "0";
		  removeBtn.style.backgroundColor = "#2e4663";
		
		  row.append(label, removeBtn);
		  selectedList.appendChild(row);
		}
		
		majorTagSection.append(
		  majorTagTitle,
		  majorTagInfo,
		  tagSelect,
		  addBtn,
		  randomBtn2,
		  selectedList
		);
		
		upgradeArea.appendChild(majorTagSection);
		
		// === Phase 4 UI: Creature Form Selection ===
		const formSection = document.createElement("div");
        formSection.classList.add("vk-form-section");
		formSection.style.border = "1px solid rgba(255,255,255,0.25)";
		formSection.style.borderRadius = "6px";
		formSection.style.padding = "10px";
		formSection.style.background = "#2e4663";
		formSection.style.marginTop = "10px";
		
		const formTitle = document.createElement("div");
		formTitle.textContent = "Creature Form";
		formTitle.style.fontWeight = "bold";
		formTitle.style.marginBottom = "8px";
		
		const eligibleForms = availableForms.filter(f => isFormEligible(f, original));
		
		const formSelect = document.createElement("select");
		formSelect.style.width = "100%";
		formSelect.style.padding = "5px";
		formSelect.style.backgroundColor = "#fde4c9";
		formSelect.style.color = "black";
		formSelect.style.borderRadius = "5px";
		
		formSelect.append(new Option("-- None --", ""));
		for (const f of eligibleForms) {
		  const opt = new Option(f.name, f.id);
		  if (f.id === selectedFormId) opt.selected = true;
		  formSelect.append(opt);
		}
		
		formSelect.onchange = () => {
		  const prev = selectedFormId;
		  selectedFormId = formSelect.value || null;
		
		  // Reset Alpha-only choices when leaving Alpha, or when selecting Alpha fresh
		  if (prev !== selectedFormId) {
		    formChoiceState.alpha = {
		      attr: "",
		      skill: "",
		      mode: "dr",
		      drType: "phys",
		      attackIndex: 0
		    };
		  }
		
		  renderUpgrades();
		};
		
		const formPreview = document.createElement("div");
		formPreview.style.marginTop = "8px";
		formPreview.style.fontSize = "12px";
		formPreview.style.whiteSpace = "pre-wrap";
		
		if (selectedFormId && formsById[selectedFormId]) {
		  formPreview.textContent = formsById[selectedFormId].effectText;
		}
		
		// === Phase 4.1 UI: Alpha form options ===
		const alphaOptionsWrap = document.createElement("div");
		alphaOptionsWrap.style.marginTop = "10px";
		alphaOptionsWrap.style.padding = "10px";
		alphaOptionsWrap.style.border = "1px solid rgba(255,255,255,0.15)";
		alphaOptionsWrap.style.borderRadius = "6px";
		alphaOptionsWrap.style.background = "rgba(0,0,0,0.12)";
		
		const showAlpha = (selectedFormId === "alpha");
		alphaOptionsWrap.style.display = showAlpha ? "" : "none";
		
		if (showAlpha) {
		  const title = document.createElement("div");
		  title.textContent = "Alpha Options";
		  title.style.fontWeight = "bold";
		  title.style.marginBottom = "8px";
		
		  // Helper to make small labels
		  const mkLabel = (txt) => {
		    const d = document.createElement("div");
		    d.textContent = txt;
		    d.style.color = "#FFC200";
		    d.style.fontSize = "12px";
		    d.style.marginTop = "8px";
		    return d;
		  };
		
		  // 1) Body/Mind choice
		  alphaOptionsWrap.appendChild(mkLabel("Increase Attribute (+1):"));
		
		  const attrRow = document.createElement("div");
		  attrRow.style.display = "flex";
		  attrRow.style.gap = "10px";
		  attrRow.style.flexWrap = "wrap";
		
		  const mkRadio = (value, labelText) => {
		    const wrap = document.createElement("label");
		    wrap.style.display = "flex";
		    wrap.style.alignItems = "center";
		    wrap.style.gap = "6px";
		    wrap.style.cursor = "pointer";
		
		    const r = document.createElement("input");
		    r.type = "radio";
		    r.name = "alpha_attr_pick";
		    r.value = value;
		    r.checked = (formChoiceState.alpha.attr === value);
		    r.onchange = () => {
		      formChoiceState.alpha.attr = value;
		      renderUpgrades();
		    };
		
		    const t = document.createElement("span");
		    t.textContent = labelText;
		
		    wrap.append(r, t);
		    return wrap;
		  };
		
		  attrRow.append(
		    mkRadio("body_attr", "BODY"),
		    mkRadio("mind", "MIND")
		  );
		
		  alphaOptionsWrap.appendChild(attrRow);
		
		  // 2) Skill choice (+1)
		  alphaOptionsWrap.appendChild(mkLabel("Increase Skill (+1):"));
		
		  const skillSelect = document.createElement("select");
		  skillSelect.style.width = "100%";
		  skillSelect.style.padding = "5px";
		  skillSelect.style.backgroundColor = "#fde4c9";
		  skillSelect.style.color = "black";
		  skillSelect.style.borderRadius = "5px";
		
		  // For creatures, skills are typically melee/guns/other in your attack parsing logic:contentReference[oaicite:6]{index=6}
		  const creatureSkillKeys = ["melee", "guns", "other"];
		  skillSelect.append(new Option("-- Choose --", ""));
		  for (const sk of creatureSkillKeys) {
		    const opt = new Option(titleCase(sk), sk);
		    if (formChoiceState.alpha.skill === sk) opt.selected = true;
		    skillSelect.append(opt);
		  }
		  skillSelect.onchange = () => {
		    formChoiceState.alpha.skill = skillSelect.value;
		    renderUpgrades();
		  };
		
		  alphaOptionsWrap.appendChild(skillSelect);
		
		  // 3) DR or Attack upgrade
		  alphaOptionsWrap.appendChild(mkLabel("Bonus:"));
		
		  const modeRow = document.createElement("div");
		  modeRow.style.display = "flex";
		  modeRow.style.gap = "10px";
		  modeRow.style.flexWrap = "wrap";
		
		  const mkModeRadio = (value, labelText) => {
		    const wrap = document.createElement("label");
		    wrap.style.display = "flex";
		    wrap.style.alignItems = "center";
		    wrap.style.gap = "6px";
		    wrap.style.cursor = "pointer";
		
		    const r = document.createElement("input");
		    r.type = "radio";
		    r.name = "alpha_mode_pick";
		    r.value = value;
		    r.checked = (formChoiceState.alpha.mode === value);
		    r.onchange = () => {
		      formChoiceState.alpha.mode = value;
		      renderUpgrades();
		    };
		
		    const t = document.createElement("span");
		    t.textContent = labelText;
		
		    wrap.append(r, t);
		    return wrap;
		  };
		
		  modeRow.append(
		    mkModeRadio("dr", "DR +1 (one type, all locations)"),
		    mkModeRadio("attack", "Attack +1D6 (one attack)")
		  );
		
		  alphaOptionsWrap.appendChild(modeRow);
		
		  // DR type select
		  const drSelect = document.createElement("select");
		  drSelect.style.width = "100%";
		  drSelect.style.marginTop = "6px";
		  drSelect.style.padding = "5px";
		  drSelect.style.backgroundColor = "#fde4c9";
		  drSelect.style.color = "black";
		  drSelect.style.borderRadius = "5px";
		  drSelect.style.display = (formChoiceState.alpha.mode === "dr") ? "" : "none";
		
		  const drOpts = [
		    { v: "phys",   t: "Physical DR" },
		    { v: "energy", t: "Energy DR" },
		    { v: "rad",    t: "Radiation DR" }
		  ];
		  for (const o of drOpts) {
		    const opt = new Option(o.t, o.v);
		    if (formChoiceState.alpha.drType === o.v) opt.selected = true;
		    drSelect.append(opt);
		  }
		  drSelect.onchange = () => {
		    formChoiceState.alpha.drType = drSelect.value;
		    renderUpgrades();
		  };
		
		  // Attack select (by index)
		  const atkSelect = document.createElement("select");
		  atkSelect.style.width = "100%";
		  atkSelect.style.marginTop = "6px";
		  atkSelect.style.padding = "5px";
		  atkSelect.style.backgroundColor = "#fde4c9";
		  atkSelect.style.color = "black";
		  atkSelect.style.borderRadius = "5px";
		  atkSelect.style.display = (formChoiceState.alpha.mode === "attack") ? "" : "none";
		
		  atkSelect.append(new Option("-- Choose Attack --", ""));
		  const attacks = Array.isArray(original.attacks) ? original.attacks : [];
		  attacks.forEach((a, idx) => {
		    const name = (a?.name || `Attack ${idx + 1}`).toString();
		    const opt = new Option(name, String(idx));
		    if (String(formChoiceState.alpha.attackIndex) === String(idx)) opt.selected = true;
		    atkSelect.append(opt);
		  });
		  atkSelect.onchange = () => {
		    formChoiceState.alpha.attackIndex = parseInt(atkSelect.value || "0");
		    renderUpgrades();
		  };
		
		  alphaOptionsWrap.append(drSelect, atkSelect);
		
		  // Keep the selects in sync on rerender
		  if (formChoiceState.alpha.mode === "dr") {
		    drSelect.style.display = "";
		    atkSelect.style.display = "none";
		  } else {
		    drSelect.style.display = "none";
		    atkSelect.style.display = "";
		  }
		
		  alphaOptionsWrap.prepend(title);
		}
		
		formSection.classList.add("vk-embedded-card");
		formSection.appendChild(alphaOptionsWrap);
		
		formSection.append(formTitle, formSelect, formPreview);
		levelerFormSection = formSection;
		upgradeArea.appendChild(formSection);

		
		levelerAttrContainer = attrContainer;
		upgradeArea.appendChild(attrContainer);
		
		if (!isCreature) {
		    levelerSkillContainer = skillContainer;
		    upgradeArea.appendChild(skillContainer);
		}
		
		upgradeArea.appendChild(resetButton);
		levelerDerivedBlock = derivedBlock;
		upgradeArea.appendChild(derivedBlock);

	if (!temp.skills) temp.skills = [];

	const skillMap = Object.fromEntries(
	    (temp.skills || []).map(s => [s.name?.toLowerCase(), s])
	);

	for (let skillKey of Object.keys(skillUpgrades)) {
	    const added = skillUpgrades[skillKey] || 0;
	    if (added === 0) continue;
	
	    const existing = skillMap[skillKey];
	    const base = existing ? parseInt((existing.desc || "0").match(/\d+/)?.[0] || "0") : 0;
	    const updatedDesc = `${base + added}` + (existing?.desc?.includes("⬛") ? " ⬛" : "");
	
	    if (existing) {
	        existing.desc = updatedDesc;
	    } else {
	        temp.skills.push({ name: titleCase(skillKey), desc: updatedDesc });
	    }
	}
	
	// === Step 7 injection: Major Tag skills as rank 2 ⬛ ===
	if (isMajorPromoActive(original) && (majorTagSelections || []).length) {
	  for (const sk of majorTagSelections) {
	    ensureTagSkill(temp, sk);
	  }
	}
	
    for(const [key,tagged]of Object.entries(tagOverrides)){
      let skill=temp.skills.find(e=>cleanKey(e.name)===key);
      if(!skill){skill={name:titleCase(key),desc:"0"};temp.skills.push(skill);}
      skill.tagged=tagged;skill.desc=String(skill.desc??"0").replace(/\s*⬛/g,"").trim()+(tagged?" ⬛":"");
    }
	if (Array.isArray(temp.attacks)) {
        for (const attack of temp.attacks) updateAttackTN(attack, temp);
    }
	
		if (isCreature && (bypassLimits || levelGain >= 2) && Array.isArray(temp.attacks)) {
	    const bonusDice = Math.floor(levelGain / 2);
	    const upgradeTitle = document.createElement("div");
upgradeTitle.innerHTML = `<strong style="font-size:14px; color:#FFC200;">Damage Upgrades</strong>`;
upgradeTitle.style.marginTop = "20px";
upgradeArea.appendChild(upgradeTitle);

// Remaining count
const usedDice = Object.values(creatureDamageUpgrades).reduce((a, b) => a + b, 0);
const remainingDice = bonusDice - usedDice;

if (remainingDice > 0) {
    const note = document.createElement("div");
    note.innerHTML = `<em style="color:#FFC200">D6s Left: ${remainingDice}</em>`;
    upgradeArea.appendChild(note);
}

	
	    temp.attacks.forEach((atk, i) => {
	        const row = document.createElement("div");
	        row.style.display = "flex";
	        row.style.justifyContent = "space-between";
	        row.style.alignItems = "center";
	        row.style.marginBottom = "4px";
	
	        const label = document.createElement("div");
			const atkName = String(atk.name || `Attack ${i + 1}`)
			    .replace(/^text\((.*)\)$/i, "$1")
			    .split(":")[0].trim();
			const bonus = creatureDamageUpgrades[i] || 0;
			
			label.innerHTML = bonus > 0
			    ? `<strong style="color:#FFC200">Upgrade "${atkName}" → +${bonus}D6</strong>`
			    : `Upgrade "${atkName}"`;

	
	        const buttonRow = document.createElement("div");
	        buttonRow.style.display = "flex";
	        buttonRow.style.gap = "4px";
	
	        const plus = createButton("+", () => {
	            const used = Object.values(creatureDamageUpgrades).reduce((a, b) => a + b, 0);
	            if (bypassLimits || used < bonusDice) {
	                creatureDamageUpgrades[i] = (creatureDamageUpgrades[i] || 0) + 1;
	                renderUpgrades();
	            }
	        });
	
	        const minus = createButton("-", () => {
	            if ((creatureDamageUpgrades[i] || 0) > 0) {
	                creatureDamageUpgrades[i]--;
	                renderUpgrades();
	            }
	        });
	
	        buttonRow.append(plus, minus);
	        row.append(label, buttonRow);
	        upgradeArea.appendChild(row);
	    });
	}
	if (isCreature && Array.isArray(temp.attacks)) {
        for (const [i, amount] of Object.entries(creatureDamageUpgrades)) {
            if (temp.attacks[i]) {
                temp.attacks[i] = applyBonusD6ToAttack(temp.attacks[i], amount);
            }
        }
    }

	if (isCreature && (bypassLimits || levelGain >= 2)) {
    const bonusDR = Math.floor(levelGain / 2);
    
    const upgradeTitle = document.createElement("div");
    upgradeTitle.innerHTML = `<strong style="font-size:14px; color:#FFC200;">DR Upgrades</strong>`;
    upgradeTitle.style.marginTop = "20px";
    upgradeArea.appendChild(upgradeTitle);

    const used = Object.values(creatureDRUpgrades).reduce((a, b) => a + b, 0);
    const remaining = bonusDR - used;

    if (remaining > 0) {
        const note = document.createElement("div");
        note.innerHTML = `<em style="color:#FFC200">Upgrades Left: ${remaining}</em>`;
        upgradeArea.appendChild(note);
    }

	    // DR types to upgrade
	    const drTypes = ["Physical", "Energy", "Radiation"];
		const keyMap = {
		    "Physical": "phys",
		    "Energy": "energy",
		    "Radiation": "rad"
		};
		
		drTypes.forEach(type => {
		    const typeKey = keyMap[type];
		
		    // ✅ Skip showing if Immune
		    const fieldName = typeKey === "phys" ? "phys_dr" :
		                      typeKey === "energy" ? "energy_dr" :
		                      "rad_dr";
		
		    const fieldValue = original[fieldName] ?? "-";
		    if (fieldValue.toString().toLowerCase().includes("immune")) {
		        return; // ⬅️ Skip creating buttons for Immune types
		    }
		
		    // 🔽 [Create the normal label/button UI as you already do]
		    const row = document.createElement("div");
		    row.style.display = "flex";
		    row.style.justifyContent = "space-between";
		    row.style.alignItems = "center";
		    row.style.marginBottom = "4px";
		
		    const label = document.createElement("div");
		    const bonus = creatureDRUpgrades[typeKey] || 0;
		    label.innerHTML = bonus > 0
		        ? `<strong style="color:#FFC200">${type} DR → +${bonus}</strong>`
		        : `${type} DR`;
		
		    const buttonRow = document.createElement("div");
		    buttonRow.style.display = "flex";
		    buttonRow.style.gap = "4px";
		
		    const plus = createButton("+", () => {
		        const used = Object.values(creatureDRUpgrades).reduce((a, b) => a + b, 0);
		        if (bypassLimits || used < bonusDR) {
		            creatureDRUpgrades[typeKey] = (creatureDRUpgrades[typeKey] || 0) + 1;
		            renderUpgrades();
		        }
		    });
		
		    const minus = createButton("-", () => {
		        if ((creatureDRUpgrades[typeKey] || 0) > 0) {
		            creatureDRUpgrades[typeKey]--;
		            renderUpgrades();
		        }
		    });
		
		    buttonRow.append(plus, minus);
		    row.append(label, buttonRow);
		    upgradeArea.appendChild(row);
		});
}

		if (isCreature) {
		    if (original.phys_dr !== undefined) {
		        temp.phys_dr = upgradeDRString(original.phys_dr, creatureDRUpgrades.phys || 0);
		    }
		    if (original.energy_dr !== undefined) {
		        temp.energy_dr = upgradeDRString(original.energy_dr, creatureDRUpgrades.energy || 0);
		    }
		    if (original.rad_dr !== undefined) {
		        temp.rad_dr = upgradeDRString(original.rad_dr, creatureDRUpgrades.rad || 0);
		    }
		}
		
		// === Phase 4.1: Alpha DR bonus (one type, all locations) ===
		if (selectedFormId === "alpha") {
		  const st = formChoiceState?.alpha;
		
		  if (st?.mode === "dr" && ["phys", "energy", "rad"].includes(st.drType)) {
		    const fieldName =
		      st.drType === "phys" ? "phys_dr" :
		      st.drType === "energy" ? "energy_dr" :
		      "rad_dr";
		
		    // If the creature doesn't have the field, treat it as "-" so upgradeDRString can create "1 (All)"
		    const current = (temp[fieldName] !== undefined) ? temp[fieldName] : "-";
		    temp[fieldName] = upgradeDRString(current, 1);
		  }
		}

	
    if (!isCreature && derived.wealth !== undefined) {
      const wealth = (temp.inventory ?? []).find(entry => String(entry.item ?? "").replace(/[*_]/g, "").trim().toLowerCase() === "wealth");
      if (wealth) wealth.quantity = derived.wealth;
      else if (derived.wealth > 0) (temp.inventory ??= []).push({id:"wealth", item:"Wealth", quantity:derived.wealth});
    }
	// === Legendary Injection (Phase 2) ===
	removeInjectedLegendaryAbility(temp);
	
	if (legendaryEnabled && selectedLegendaryAbilityId) {
	  const a = legendaryAbilityById[selectedLegendaryAbilityId];
	  if (a && abilityEligibleForNpc(a, temp)) {
	    injectLegendaryAbility(temp, a);
	  }
	}
	// === Phase 4.2: Apply form mechanics (Glowing, etc.) ===
	if (selectedFormId && formsById[selectedFormId]?.spec?.mechanics?.operations?.length) {
	  applyFormOperations(temp, formsById[selectedFormId].spec.mechanics.operations);
	}
	
	if (selectedFormId === "glowing") {
	  removeRedundantImmuneToRadiationForGlowing(temp);
	}
	// === Phase 4 injection ===
	if (selectedFormId && formsById[selectedFormId]) {
	  injectForm(temp, formsById[selectedFormId]);
	} else {
	  removeInjectedForm(temp);
	}
	// === Phase 4.1: Apply Alpha transient bonuses into final fields ===
	if (temp.__formHpBonus) {
	  const curHp = parseInt(temp.hp || "0");
	  temp.hp = String(curHp + parseInt(temp.__formHpBonus || "0"));
	}
	
	// DR bonus: stack onto your existing creature DR upgrade mechanism by directly bumping locations.
	// This assumes your creature statblocks use fields like phys_dr / energy_dr / rad_dr OR a per-location structure.
	// If you already have a DR-upgrade applicator elsewhere, route this into that instead.
	if (temp.__formDrBonus) {
	  const { type, amount } = temp.__formDrBonus;
	  // If your YAML uses top-level fields:
	  const keyMap = { phys: "phys_dr", energy: "energy_dr", rad: "rad_dr" };
	  const k = keyMap[type];
	  if (k && temp[k] !== undefined) {
	    temp[k] = String(parseInt(temp[k] || "0") + amount);
	  }
	  // If you have location-based DR, we’ll wire that in next once you confirm the exact field shape used in your creature statblocks.
	}
	
	// === Form attack bonus (ALPHA etc) - apply directly to temp.attacks WITHOUT touching creatureDamageUpgrades ===
	if (temp.__formAttackBonus && Array.isArray(temp.attacks)) {
	  const idx = temp.__formAttackBonus.attackIndex;
	  const d6 = temp.__formAttackBonus.d6 || 0;
	
	  if (temp.attacks[idx] && d6 > 0) {
	    temp.attacks[idx] = applyBonusD6ToAttack(temp.attacks[idx], d6);
	  }
	}

	
	// Cleanup transient keys so they don't leak into YAML
	delete temp.__formHpBonus;
	delete temp.__formDrBonus;
	delete temp.__formAttackBonus;
	
    // Level the NPC up to the requested player level without reducing a higher-level NPC.
    // Existing calculations use original.level, so updating this display/export field here
    // does not double count HP, DR, or damage upgrades. Preserve any extra form level.
    const requestedLevel = Number.parseInt(levelInput.input.value, 10);
    const baseLevel = Number.parseInt(original.level, 10);
    const formLevel = Number.parseInt(temp.level, 10);
    if (Number.isFinite(requestedLevel) && Number.isFinite(baseLevel)) {
      const upgradeLevels = Math.max(0, requestedLevel - baseLevel);
      const formExtra = Number.isFinite(formLevel) ? Math.max(0, formLevel - baseLevel) : 0;
      temp.level = String(Math.max(baseLevel + upgradeLevels, baseLevel + formExtra));
    }

    // Fantasy Statblocks renders the updated NPC within this page's interface.
    // No generated code is appended to the NPC Leveler note.
    if (!isCreature && armorEdited) for (const key of ["phys_dr","energy_dr","rad_dr","poison_dr"]) temp[key] = "";
    Object.assign(temp, clone(manualFields));
    renderEquipmentEditor(temp, isCreature);
    renderChangeSummary();
    groupLevelerControls(isCreature, temp, original);
    void renderStatblockPreview(viewOriginal ? original : temp);
}

	function calculateDerived(npc) {
	    const playerLevel = parseInt(levelInput.input.value);
		const npcLevel = parseInt(original.level || "0");
		const levelGain = Math.max(playerLevel - npcLevel, 0);
	
		const isCreature = npc.type?.toLowerCase().includes("creature");
		const hp = { base: parseInt(original.hp || "0"), total: 0 };
	
		if (isCreature) {
	    const body = parseInt(npc.body_attr || "0");
	    const baseHP = parseInt(original.hp || "0");
	    hp.base = baseHP;
	
	    // ✅ Re-check BIG/LITTLE on the original statblock
	    const specials = original.special_abilities || [];
	    const big = specials.some(e =>
	        e.name?.toLowerCase().trim().replace(":", "") === "big"
	    );
	    const little = specials.some(e =>
	        e.name?.toLowerCase().trim().replace(":", "") === "little"
	    );
	
	    const bonus = (big ? levelGain : 0) - (little ? levelGain : 0);
	    hp.total = baseHP + levelGain + bonus;
		
		} else {
		    const end = parseInt(npc.end || "0");
		    const baseHP = num(original.hp) + (end - num(original.end));
		    hp.base = baseHP;
		    hp.total = baseHP + levelGain;
		}

	    const initiative = isCreature
	        ? parseInt(npc.body_attr || "0") + parseInt(npc.mind || "0")
	        : num(original.initiative ?? (num(original.per)+num(original.agi))) + num(npc.per)-num(original.per) + num(npc.agi)-num(original.agi);
	
	    let def;

		if (npc.defense !== undefined && npc.defense !== "") {
		  def = parseInt(npc.defense, 10);
		} else if (!isCreature) {
		  def = parseInt(npc.agi || "0", 10) >= 9 ? 2 : 1; // character-only fallback
		} else {
		  def = 1; // creature fallback when missing from statblock
		}
		
	    const frameEquipped=(npc.inventory ?? []).some(entry=>entry.equipped===true && Number(entry.quantity??1)>0 && cleanKey(app.metadataCache.getFirstLinkpathDest(linkName(entry.item),loadedSourcePath || fileSelect.input.value)?.basename)==="power armor frame");
        const str = frameEquipped ? 11 : num(npc.strength ?? npc.body);
	    let melee = "";
	    if (str >= 11) melee = "+3D6";
	    else if (str >= 9) melee = "+2D6";
	    else if (str >= 7) melee = "+1D6";
	    else melee = "+0";
	    
	    
	    let wealth = undefined;

		if (!isCreature) {
		    const baseWealth = extractWealthFromScavenge(original);
		    const wealthGain = Math.floor(levelGain / 3);
		    wealth = baseWealth + wealthGain;
		}

	
	return { hp, initiative, defense: def, melee, isCreature, levelGain, wealth };
}




function getUsedAttributePoints() {
    return Object.values(upgrades).reduce((a, b) => a + b, 0);
}
function getPromoUsedAttributePoints() {
  const legendaryPromoUsed = (legendaryPromoBodySpent || 0) + (legendaryPromoMindSpent || 0);
  const majorPromoUsed = Object.values(majorPromoSpent || {}).reduce((a, b) => a + (b || 0), 0);
  return legendaryPromoUsed + majorPromoUsed;
}

function getUsedNormalAttributePoints() {
  const totalUsed = getUsedAttributePoints();
  const promoUsed = getPromoUsedAttributePoints();
  return Math.max(0, totalUsed - promoUsed);
}

function getUsedSkillPoints() {
    return Object.values(skillUpgrades).reduce((a, b) => a + b, 0);
}

function yamlify(obj) {
    return engine.getObsidianModule().stringifyYaml(exportNpc(obj)).trimEnd();
}

function quoteIfNeeded(value) {
    if (typeof value === "string") {
        // Always quote strings that aren't pure numbers or booleans
        const needsQuotes = /[^a-zA-Z0-9_]/.test(value) || value === "" || !isNaN(value);
        if (needsQuotes) {
            return JSON.stringify(value); // Preserve quotes, backslashes, and newlines in YAML.
        }
    }
    return value;
}


function createLabeledNumber(label, def = "") {
    const input = document.createElement("input");
    input.type = "number";
    input.value = def;
    input.style.padding = "5px";
    input.style.width = "60px";
    input.style.background = "#fde4c9";
    input.style.color = "black";
    const lbl = document.createElement("label");
    lbl.textContent = label;
    lbl.style.color = "#FFC200";
    return { label: lbl, input };
}

function createLabeledDropdown(label) {
    const select = document.createElement("select");
    select.style.padding = "5px";
    const lbl = document.createElement("label");
    lbl.textContent = label;
    lbl.style.color = "#FFC200";
    return { label: lbl, input: select };
}

async function updateFileDropdown(preferredFile) {
  const folder=folderSelect.input.value,previous=typeof preferredFile==="string"?preferredFile:fileSelect.input.value;
  fileSelect.input.replaceChildren();
  const options=allFiles.filter(file=>file.extension==="md"&&file.path.split("/").slice(0,-1).join("/")===folder)
    .sort((a,b)=>a.basename.localeCompare(b.basename));
  for(const file of options)fileSelect.input.append(new Option(file.basename,file.path));
  if(options.some(file=>file.path===previous))fileSelect.input.value=previous;
}


function createButton(text, handler) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.marginLeft = "8px";
    btn.style.backgroundColor = "#2e4663";
    btn.style.color = "#ffc200";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.style.border = "1px solid grey";
    btn.onclick = async (...args) => { try { return await handler(...args); } catch(error) { new (engine.getObsidianModule().Notice)(String(error.message ?? error)); } };
    return btn;
}

// == Functions for Legendary Abilities ==
async function loadLegendaryAbilities() {
  const files = app.vault.getFiles().filter(f =>
    f.path.startsWith(LEGENDARY_ABILITIES_PATH) && f.path.endsWith(".md")
  );

  const abilities = [];
  for (const f of files) {
    const content = await app.vault.read(f);
    const parsed = parseLegendaryAbilityMarkdown(content, f.path);
    if (parsed) abilities.push(parsed);
  }

  // Sort A–Z
  abilities.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  legendaryAbilities = abilities;
  legendaryAbilityById = Object.fromEntries(abilities.map(a => [a.id, a]));
}

async function loadCreatureForms() {
  const folder = "Fallout-RPG/Creatures and NPCs/Forms/Creature Forms";
  const files = app.vault.getFiles().filter(f =>
f.path.startsWith(folder) && f.extension === "md"
  );
  
  availableForms = [];
  formsById = {};

  for (const file of files) {

    const raw = await app.vault.read(file);

    const idMatch = raw.match(/<!--\s*id:\s*([a-z0-9_-]+)\s*-->/i);
    if (!idMatch) continue;

    const id = idMatch[1];

    const specMatch = raw.match(/```yaml[\s\r\n]*spec:\s*([\s\S]*?)```/i);
	if (!specMatch) console.log("[Forms] No spec block match:", file.path);

    if (!specMatch) continue;
	// DEBUG: confirm we matched the YAML block
	// console.log("Form file:", file.path, "id:", id, "specMatch len:", specMatch[1]?.length);

    let spec;
	try {
	  spec = parseFormSpec(specMatch[1] || "");
	} catch (e) {
	  console.error(`Failed to parse spec for form ${id} (${file.path})`, e);
	  continue;
	}


    const effectStart = raw.indexOf("### Effect");
    const effectText =
      effectStart !== -1
        ? raw.slice(effectStart + 10).split("```")[0].trim()
        : "";

    const form = {
      id,
      name: spec.name,
      applies_to: spec.applies_to,
      requirements: spec.requirements || {},
      injection: spec.injection,
      effectText,
      spec,
      filePath: file.path,
    };

    availableForms.push(form);
    formsById[id] = form;
  }

}

function parseFormSpec(specBlockText) {
  const lines = specBlockText
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, "  ")
    .split("\n");

  const spec = {
    requirements: {},
    injection: {},
    mechanics: { operations: [] }
  };

  let section = ""; // "", "requirements", "injection", "mechanics"
  let inOps = false;
  let currentOp = null;

  const stripQuotes = (s) => (s || "").trim().replace(/^"|"$/g, "");

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed) continue;

    // Section headers
    if (trimmed === "requirements:") { section = "requirements"; inOps = false; currentOp = null; continue; }
    if (trimmed === "injection:")    { section = "injection";    inOps = false; currentOp = null; continue; }
    if (trimmed === "mechanics:")    { section = "mechanics";    inOps = false; currentOp = null; continue; }

    if (section === "mechanics" && trimmed === "operations:") {
      inOps = true;
      currentOp = null;
      continue;
    }

    // Operations list items: "- op: set_dr"
    if (section === "mechanics" && inOps && trimmed.startsWith("- ")) {
      const kv = trimmed.slice(2).trim(); // "op: set_dr"
      const m = kv.match(/^([a-zA-Z0-9_]+)\s*:\s*(.*)$/);
      currentOp = {};
      if (m) currentOp[m[1]] = stripQuotes(m[2]);
      spec.mechanics.operations.push(currentOp);
      continue;
    }

    // Indented op fields under the current op
    if (section === "mechanics" && inOps && currentOp && raw.startsWith("  ")) {
      const m = trimmed.match(/^([a-zA-Z0-9_]+)\s*:\s*(.*)$/);
      if (m) currentOp[m[1]] = stripQuotes(m[2]);
      continue;
    }

    // Array item: "- something" for requirements.exclude
    if (trimmed.startsWith("- ")) {
      const item = stripQuotes(trimmed.slice(2));
      if (section === "requirements") {
        if (!Array.isArray(spec.requirements.exclude)) spec.requirements.exclude = [];
        spec.requirements.exclude.push(item.toLowerCase());
      }
      continue;
    }

    // Key: value
    const m = trimmed.match(/^([a-zA-Z0-9_]+)\s*:\s*(.*)$/);
    if (!m) continue;

    const key = m[1];
    const val = stripQuotes(m[2]);

    if (!section) {
      if (key === "name") spec.name = val;
      else if (key === "applies_to") spec.applies_to = val;
      else if (key === "id") spec.id = val;
      else if (key === "version") spec.version = val;
      continue;
    }

    if (section === "requirements") {
      // Ignore include for now; exclude is handled via "- " items
      continue;
    }

    if (section === "injection") {
      if (key === "name") spec.injection.name = val;
      else if (key === "title") spec.injection.title = val;
      // Other injection keys are fine to ignore for now
      continue;
    }
  }

  // Minimal validation
  if (!spec.name) throw new Error("spec.name missing");
  if (!spec.applies_to) throw new Error("spec.applies_to missing");
  if (!spec.injection?.name) throw new Error("spec.injection.name missing");
  if (!spec.injection?.title) throw new Error("spec.injection.title missing");

  // Normalize
  if (spec.requirements.exclude && Array.isArray(spec.requirements.exclude)) {
    spec.requirements.exclude = spec.requirements.exclude.map(x => (x || "").toLowerCase());
  }

  return spec;
}



// Parses your markdown template:
// <!-- id: xyz -->
// ###### NAME
// **Requirements:** ...
// **Description:** ...
// **Effect:** ...
// **Mutation:** ...
function parseLegendaryAbilityMarkdown(md, path) {
  const idMatch = md.match(/<!--\s*id:\s*([a-z0-9_ -]+)\s*-->/i);
  if (!idMatch) return null;
  const id = idMatch[1].trim().toLowerCase().replace(/\s+/g, "_");

  const nameMatch = md.match(/^\s*######\s+(.+?)\s*$/m);
  const name = (nameMatch?.[1] || "").trim();

  const requirements = extractSection(md, "**Requirements:**");
  const description  = extractSection(md, "**Description:**");
  const effect       = extractSection(md, "**Effect:**");
  const mutation     = extractSection(md, "**Mutation:**");

  // Effect/Mutation are required for your use-case
  if (!name || !effect || !mutation) return null;

  return { id, name, requirements, description, effect, mutation, path };
}

// Accept *Label:* and **Label:** in ability source notes.
function extractSection(md, label) {
  const plainLabel = label.replace(/\*/g, "").replace(/:$/, "");
  const escapedLabel = plainLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const heading = new RegExp(`^\\s*(?:>\\s*)?(\\*{1,2})${escapedLabel}:\\1[ \\t]*`, "im");
  const match = heading.exec(md);
  if (!match) return "";
  const after = md.slice(match.index + match[0].length);
  // Ability names inside an Effect are content, not metadata section boundaries.
  const stop = after.search(/\n\s*(?:>\s*)?(\*{1,2})(?:Requirements|Description|Effect|Mutation):\1/i);
  return (stop === -1 ? after : after.slice(0, stop)).trim();
}


function isCreatureNPC(npcObj) {
  return (npcObj.type || "").toLowerCase().includes("creature");
}

function isCharacterNPC(npcObj) {
  return (npcObj.type || "").toLowerCase().includes("character");
}

function isAlreadyLegendaryOrMajor(npcObj) {
  const t = (npcObj.type || "").toLowerCase();
  return t.includes("legendary") || t.includes("major");
}

// Requirements filtering: only enforce Characters vs Creatures for Phase 2.
function abilityEligibleForNpc(ability, npcObj) {
  const req = (ability.requirements || "").toLowerCase().trim();
  if (!req) return true;

  const { typeStr, keywords } = getNpcMeta(npcObj);

  if (req.includes("characters only")) return typeStr.includes("character");
  if (req.includes("creatures only"))  return typeStr.includes("creature");

  // Simple keyword patterns (covers your “Not Robot” style)
  // Examples matched:
  // "not robot", "not a robot", "not a mutant", "robots only"
  const notMatch = req.match(/\bnot\s+(?:a\s+|an\s+)?([a-z0-9_-]+)\b/);
  if (notMatch) {
    return !keywords.has(notMatch[1]);
  }

  const onlyMatch = req.match(/\b([a-z0-9_-]+)s?\s+only\b/);
  if (onlyMatch) {
    const kw = onlyMatch[1].endsWith("s") ? onlyMatch[1].slice(0, -1) : onlyMatch[1];
    return keywords.has(kw);
  }

  return true;
}


function removeInjectedLegendaryAbility(npcObj) {
  if (!npcObj.special_abilities || !Array.isArray(npcObj.special_abilities)) return;

  npcObj.special_abilities = npcObj.special_abilities.filter(sa => {
    const desc = (sa?.desc || "");
    return !desc.includes("<!-- id:");
  });
}

function buildLegendaryInjectedDesc(ability) {
  // Separate the legendary ability into a normal named trait, without blockquotes.
  // Keep real line breaks; JSON.stringify escapes them once for YAML.
  const parts = [];
  if (ability.description) parts.push(ability.description.trim());
  parts.push(`*Effect:* ${ability.effect.trim()}`);
  parts.push(`*Mutation:* ${ability.mutation.trim()}`);
  return parts.join("\n\n");
}

function injectLegendaryAbility(npcObj, ability) {
  if (!Array.isArray(npcObj.special_abilities)) npcObj.special_abilities = [];
  removeInjectedLegendaryAbility(npcObj);

  const title = isCreatureNPC(npcObj) ? "LEGENDARY CREATURE:" : "MAJOR CHARACTER:";
  // Keep the full original mutation rule text, rather than a shortened summary.
  const promotionDesc =
    `<!-- id: ${ability.id} -->\n` +
    "A Legendary creature or Major character mutates the first time they are reduced to below half of their maximum HP, at which point they immediately take an extra turn (this is in addition to the creature or character’s normal turn) and gain the **Mutation** effect of their Legendary Ability for the remainder of the scene.\n\n" +
    "If a creature mutates and then regains enough HP to go above half its maximum HP, the creature cannot mutate a second time.";

  npcObj.special_abilities.unshift(
    { name: title, desc: promotionDesc },
    { name: `${ability.name.replace(/:$/, "").toUpperCase()}:`,
      desc: `<!-- id: ${ability.id} -->\n` + buildLegendaryInjectedDesc(ability) }
  );
}


return container;
})();

```