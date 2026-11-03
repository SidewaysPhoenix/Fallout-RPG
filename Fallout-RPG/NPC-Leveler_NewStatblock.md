# NPC Leveler

> [!info] Equipment editor 1.4.1
> Uses your existing JS Engine and Fantasy Statblocks setup, plus Fallout NPC Items 0.6.3 and its current callbacks for equipment rendering. Replace your existing Leveler note with this note; no additional helper note or layout JSON is needed.

- Use **Refresh NPC folders** after adding source notes. Successful saves refresh the collection automatically. The cog opens the staged equipment workbench. Custom names are cosmetic and free; skill TAG toggles require bypass. **Changes** lists edits and upgrade spending before export.
- Equipment browsing has category filters, rarity labels, 40-note pages and a selected-item stat preview. Equipment contents are read for the displayed NPC or while browsing, not bulk-loaded at startup. Mod previews use the plugin’s shared calculations. Unchanged stats display once; changed stats show Was/New. Collapsed slots show the selected mod. Rename is tucked behind its button, and Wealth has a dedicated bypass-only value editor. Cancel discards staged changes.
- Set the target level, choose an NPC, then **Load NPC**. Changes affect the working copy and live preview.
- Every two levels gained grants separate weapon and armor upgrades. Use **Replace** for a higher-rarity item or **Mods** for a compatible modification. A stacked piece is split so the upgrade affects one item.
- **Bypass leveling limits** permits stat changes beyond normal allowances, lower-rarity replacements, adding/removing gear, equipment toggles, quantities, manual attack editing and custom scalar fields. Mod choices remain compatible with the source item. If bypass is disabled while off-book edits remain, export/save explains what needs resetting.
- **Undo last equipment/custom edit** restores the previous equipment/custom-field state. **Reset Upgrades** restores the loaded NPC's draft. Attribute/skill adjustments use their own minus controls.
- **Export Upgraded YAML** copies a complete statblock. **Save as new custom note** creates a new note and optional subfolders, refusing to overwrite existing files.
- Preview, clipboard export and saved statblocks always start with `layout: Fallout_2d20_NPC_Statblock_Parsed`.
- Creatures omit Gear Upgrades. Attacks have a structured bypass editor for custom attacks and human inventory-linked weapons; linked weapons use automatic combinations unless explicitly overridden. Custom fields have their own section.
- Ordinary items use a bypass-only quantity control (0 removes the item), without equipment/mod controls.
- Equipped weapon/armor `gameEffects`, including installed mod text, are regenerated into a standard `special_abilities` entry named **Equipment abilities**. This name is reserved for generated gear text; other abilities are preserved. Export/save waits for the current build. Each item’s text is capped at 400 characters; its linked name opens the full rules. Change `EQUIPMENT_ABILITY_LIMIT` to adjust the cap. Rules text is displayed, not mechanically applied.
- Default save root: `Fallout-RPG/Creatures and NPCs/Custom/2.0 Statblocks`. Loading roots are listed in `NPC_PATHS`; all their subfolders are collected. Change `CUSTOM_NPC_ROOT` near the top of the script if your vault uses a different directory.
- SPECIAL traits, skill tags, nested inventory/mods, manual attacks and creature scavenge rules are retained. Armor changes clear listed DR in the working copy/export so the rendering plugin derives protection. Frame strength remains equipment-derived; base SPECIAL stays in exported YAML.
- Existing promotion, creature forms and legendary ability features remain. This update does not add a new ability database or interpret narrative item effects.

```js-engine
return await (async function () {
// Vault-Kit NPC Leveler — Equipment Editor 1.4.1
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

container.style.borderRadius = "8px";
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.gap = "12px";

container.style.maxWidth = "none";
container.classList.add("vk-npc-leveler");

const levelerStyle = document.createElement("style");
levelerStyle.textContent = ".vk-npc-leveler {box-sizing:border-box;width:100%;padding:14px!important;color:var(--vk-text,#dce6eb)!important;background:var(--vk-panel,#172a3b)!important;font-family:var(--vk-font-family-body,var(--font-interface));font-size:var(--vk-font-size-body,14px)}\n.vk-npc-leveler * {box-sizing:border-box}\n.vk-npc-leveler :is(.vk-selection,.vk-controls,.vk-preview-panel,.vk-section,.vk-change-summary) {min-width:0;border:1px solid var(--vk-edge,#365d78);border-radius:var(--vk-radius,10px);background:var(--vk-recessed,#102434);padding:12px}\n.vk-npc-leveler .vk-selection {display:grid;grid-template-columns:minmax(90px,.6fr) minmax(160px,1fr) minmax(180px,1.3fr) auto;gap:10px;align-items:end}\n.vk-npc-leveler .vk-field {display:grid;gap:5px;min-width:0}\n.vk-npc-leveler :is(label,.vk-panel-heading,h4,summary) {color:var(--vk-accent,#ffc200)}\n.vk-npc-leveler .vk-main {display:grid;grid-template-columns:minmax(340px,2fr) minmax(400px,3fr);gap:14px;align-items:start}\n.vk-npc-leveler .vk-panel-heading {font-size:16px;font-weight:700;margin-bottom:10px}\n.vk-npc-leveler :is(.vk-controls-scroll,.vk-preview-scroll) {max-height:min(78vh,920px);overflow:auto;scrollbar-gutter:stable}\n.vk-npc-leveler .vk-preview-scroll .statblock {width:100%!important;max-width:100%!important;margin:0!important}\n.vk-npc-leveler :is(.vk-section,.vk-change-summary) {margin:9px 0;padding:0;overflow:hidden;background:var(--vk-panel,#172a3b)}\n.vk-npc-leveler summary {padding:10px 12px;cursor:pointer;font-weight:650}\n.vk-npc-leveler .vk-section-body {padding:8px 12px 12px}\n.vk-npc-leveler .vk-section-status {float:right;color:var(--vk-muted,#aebdca);font-size:11px;margin-left:8px}\n.vk-npc-leveler .vk-pending {color:var(--vk-accent,#ffc200)}\n.vk-npc-leveler .vk-section[open]>summary .vk-section-status {display:none}\n.vk-npc-leveler :is(.vk-summary,.vk-attr-grid,.vk-skill-grid) {display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;min-width:0}\n.vk-npc-leveler .vk-summary {grid-template-columns:repeat(3,minmax(0,1fr))!important;margin-bottom:12px}\n.vk-npc-leveler .vk-summary-item {border:1px solid var(--vk-edge,#365d78);border-radius:var(--vk-radius-sm,7px);padding:8px;background:var(--vk-panel-raised,#1b3347)}\n.vk-npc-leveler .vk-summary-item span {display:block;font-size:11px;color:var(--vk-muted,#aebdca)}\n.vk-npc-leveler .vk-summary-item strong {display:block;color:var(--vk-accent,#ffc200);font-size:17px}\n.vk-npc-leveler :is(.vk-attr-cell,.vk-skill-row) {display:flex;align-items:center;justify-content:space-between;flex-direction:row!important;gap:6px;min-width:0;border:0;border-bottom:1px solid var(--vk-edge,#365d78)!important;padding:6px 0!important}\n.vk-npc-leveler :is(.vk-attr-buttons,.vk-skill-buttons,.vk-editor-actions,.vk-preview-actions) {display:flex;gap:8px!important;align-items:center;flex-wrap:wrap}\n.vk-npc-leveler :is(.vk-attr-buttons,.vk-skill-buttons) {flex-shrink:0;width:auto!important;margin:0!important}\n.vk-npc-leveler .vk-skill-label {font-size:12px;min-width:0;overflow-wrap:anywhere}\n.vk-npc-leveler .vk-skill-buttons .vk-editor-field {font-size:10px;gap:4px;margin:0}\n.vk-npc-leveler button {height:auto!important;min-height:var(--vk-button-height,32px);width:auto!important;max-width:none!important;min-width:0;padding:var(--vk-button-padding,6px 10px)!important;margin:0!important;color:var(--vk-button-text,var(--vk-text,#dce6eb))!important;background:var(--vk-button-bg,var(--vk-panel-raised,#1b3347))!important;border:1px solid var(--vk-button-border,var(--vk-edge,#365d78))!important;border-radius:var(--vk-button-radius,6px)!important;box-shadow:none!important;font-family:inherit!important;cursor:pointer}\n.vk-npc-leveler button:hover {border-color:var(--vk-accent,#ffc200)!important;color:var(--vk-accent,#ffc200)!important}\n.vk-npc-leveler button:disabled {opacity:.45;cursor:default}\n.vk-npc-leveler :is(.vk-attr-buttons,.vk-skill-buttons)>button {min-width:26px;padding:3px 6px!important}\n.vk-npc-leveler :is(input:not([type=checkbox]):not([type=radio]),select,textarea) {max-width:100%;min-width:0;background:var(--vk-recessed,#102434)!important;color:var(--vk-text,#dce6eb)!important;border:1px solid var(--vk-edge,#365d78)!important;border-radius:var(--vk-radius-sm,7px);padding:7px;font:inherit}\n.vk-npc-leveler :is(input[type=checkbox],input[type=radio]) {accent-color:var(--vk-accent,#ffc200)}\n.vk-npc-leveler .vk-editor-field {display:flex;justify-content:space-between;align-items:center;gap:10px;margin:8px 0;font-size:12px}\n.vk-npc-leveler :is(.vk-editor-field input:not([type=checkbox]),.vk-field input,.vk-field select) {width:100%}\n.vk-npc-leveler .vk-editor-field input[type=checkbox] {flex:0 0 auto}\n.vk-npc-leveler .vk-editor-status {color:var(--vk-accent,#ffc200);font-size:12px;white-space:pre-wrap}\n.vk-npc-leveler .vk-preview-actions {position:sticky;top:0;z-index:3;padding:6px 0;background:var(--vk-recessed,#102434);margin-bottom:10px}\n.vk-npc-leveler .vk-save-options {width:100%;font-size:12px}\n.vk-npc-leveler .vk-equipment-row {border-bottom:1px solid var(--vk-edge,#365d78);padding:10px 0}\n.vk-npc-leveler .vk-equipment-heading {display:flex;align-items:center;justify-content:space-between;gap:10px}\n.vk-npc-leveler .vk-equipment-title {min-width:0;font-weight:650}\n.vk-npc-leveler .vk-equipment-mods {font-size:12px;color:var(--vk-muted,#aebdca);margin-top:5px}\n.vk-npc-leveler .vk-equipment-state {color:var(--vk-muted,#aebdca);font-size:11px}\n.vk-npc-leveler .vk-npc-markdown {overflow-wrap:anywhere}\n.vk-npc-leveler .vk-npc-markdown p {margin:0;display:inline}\n.vk-npc-leveler .vk-npc-markdown a.internal-link {color:var(--vk-accent,#ffc200)}\n.vk-npc-leveler .vk-equipment-editor>button {margin:10px 8px 8px 0!important}\n.vk-npc-leveler .vk-equipment-editor textarea {width:100%;font-family:var(--font-monospace)}\n.vk-npc-leveler :is(.vk-embedded-card,.vk-form-section,.vk-major-tag-section) {background:transparent!important;border:0!important;padding:2px 0!important;box-shadow:none!important}\n.vk-npc-leveler .vk-hidden-empty {display:none!important}\n.vk-npc-leveler .vk-editor-overlay {position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:#0009;padding:20px}\n.vk-npc-leveler :is(.vk-editor-dialog,.vk-npc-workbench) {background:var(--vk-panel,#172a3b);color:var(--vk-text,#dce6eb);border:1px solid var(--vk-edge,#365d78);border-top:3px solid var(--vk-accent,#ffc200);border-radius:var(--vk-radius,10px);box-shadow:var(--vk-shadow,0 10px 28px #0005);width:min(960px,95vw);max-height:85vh;overflow:auto}\n.vk-npc-leveler .vk-editor-dialog {padding:18px;width:min(700px,95vw)}\n.vk-npc-leveler .vk-editor-dialog>strong {display:block;color:var(--vk-accent,#ffc200);font-size:17px;margin-bottom:12px}\n.vk-npc-leveler .vk-editor-dialog button {margin:8px 8px 8px 0!important}\n.vk-npc-leveler .vk-editor-dialog select {width:100%;margin:8px 0}\n.vk-npc-leveler .vk-editor-dialog select[size] {display:block;height:260px!important;min-height:260px!important;padding:5px!important;background-image:none!important}\n.vk-npc-leveler .vk-editor-dialog option {padding:7px 10px}\n.vk-npc-leveler :is(.vk-item-preview,.vk-change-row) {border-top:1px solid var(--vk-edge,#365d78);padding:10px;font-size:12px}\n.vk-npc-leveler .vk-item-preview:empty {display:none}\n.vk-npc-leveler .vk-item-metric {display:flex;justify-content:space-between;gap:12px;padding:4px}\n.vk-npc-leveler .vk-change-list {max-height:280px;overflow:auto}\n.vk-npc-leveler .vk-change-row {white-space:pre-wrap;overflow-wrap:anywhere}\n.vk-npc-leveler .vk-npc-workbench {display:flex;flex-direction:column;overflow:hidden;background:linear-gradient(180deg,var(--vk-bg-soft,#101d28),var(--vk-panel,#172a3b))}\n.vk-npc-leveler :is(.vk-npc-workbench-header,.vk-npc-workbench-footer) {display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;flex:0 0 auto;background:var(--vk-panel-header,#1b3a52)}\n.vk-npc-leveler .vk-npc-workbench-header small {color:var(--vk-muted,#aebdca);font-size:10px;letter-spacing:.1em}\n.vk-npc-leveler .vk-npc-workbench-title {font-size:20px;margin-top:4px}\n.vk-npc-leveler .vk-npc-workbench-layout {display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;padding:16px;overflow:auto;min-height:0}\n.vk-npc-leveler :is(.vk-npc-workbench-edit,.vk-npc-workbench-review) {min-width:0}\n.vk-npc-leveler .vk-npc-slot {border:1px solid var(--vk-edge,#365d78);border-radius:var(--vk-radius-sm,7px);padding:8px;margin:8px 0;background:var(--vk-recessed,#102434)}\n.vk-npc-leveler .vk-npc-slot select {width:100%;margin:10px 0}\n.vk-npc-leveler .vk-npc-stat {border:1px solid var(--vk-edge,#365d78);border-radius:var(--vk-radius-sm,7px);padding:10px;margin:8px 0;background:var(--vk-panel,#172a3b);font-size:12px}\n.vk-npc-leveler .vk-npc-stat.is-changed {border-color:var(--vk-accent,#ffc200)}\n.vk-npc-leveler .vk-npc-stat strong {display:block;margin-bottom:4px;color:var(--vk-muted,#aebdca)}\n.vk-npc-leveler .vk-npc-stat.is-changed strong {color:var(--vk-accent,#ffc200)}\n.vk-npc-leveler .vk-npc-workbench-footer .vk-editor-status {margin-right:auto}\n.vk-npc-leveler .vk-npc-icon {display:inline-flex;align-items:center;justify-content:center;width:32px!important;height:32px!important;padding:6px!important}\n.vk-npc-leveler .vk-npc-icon svg {width:18px;height:18px}\n@container vk-leveler (max-width:950px) {.vk-npc-leveler .vk-main{grid-template-columns:1fr}.vk-npc-leveler .vk-selection{grid-template-columns:repeat(2,minmax(0,1fr))}.vk-npc-leveler :is(.vk-controls-scroll,.vk-preview-scroll){max-height:none}}\n@container vk-leveler (max-width:600px) {.vk-npc-leveler :is(.vk-attr-grid,.vk-skill-grid){grid-template-columns:1fr!important}}\n@media(max-width:700px) {.vk-npc-leveler .vk-npc-workbench-layout{grid-template-columns:1fr}.vk-npc-leveler .vk-npc-workbench-footer{flex-wrap:wrap}}\n\n.vk-npc-leveler.vk-editor-overlay {position:absolute;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:#0009!important;padding:20px!important}\n\n.vk-npc-leveler .vk-npc-stat-grid {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}\n.vk-npc-leveler .vk-npc-stat-grid .vk-npc-stat {margin:0;min-width:0}\n.vk-npc-leveler .vk-npc-stat.is-wide {grid-column:1/-1}\n.vk-npc-leveler .vk-npc-stat-value {font-size:16px;line-height:1.4}\n.vk-npc-leveler .vk-npc-name-editor[hidden] {display:none!important}\n.vk-npc-leveler .vk-npc-name-editor .vk-editor-field {display:grid;grid-template-columns:auto minmax(0,1fr)}\n.vk-npc-leveler .vk-npc-name-editor label>span {white-space:nowrap}\n.vk-npc-leveler .vk-npc-name-editor p {font-size:12px;color:var(--vk-muted,#aebdca)}\n.vk-npc-leveler .vk-npc-slot>summary {font-size:13px;padding:7px 4px;overflow-wrap:anywhere}\n.vk-npc-leveler .vk-npc-slot-value {float:right;max-width:65%;margin-left:10px;font-size:12px;font-weight:400;color:var(--vk-muted,#aebdca)}\n.vk-npc-leveler .vk-npc-slot>summary::after {content:\"\";display:block;clear:both}\n.vk-npc-leveler .vk-npc-effects {border:1px solid var(--vk-edge,#365d78);border-left:3px solid var(--vk-accent,#ffc200);border-radius:var(--vk-radius-sm,7px);background:var(--vk-recessed,#102434);padding:12px;margin-top:12px}\n.vk-npc-leveler .vk-npc-effects h4 {margin:0 0 8px}\n.vk-npc-leveler .vk-npc-effects .vk-npc-markdown p {display:block;margin:6px 0}\n.vk-npc-leveler .vk-npc-wealth {display:flex;align-items:center;gap:10px;flex-wrap:wrap}\n.vk-npc-leveler .vk-npc-wealth .vk-editor-field {margin:0 0 0 auto;max-width:190px}\n.vk-npc-leveler .vk-npc-wealth input {max-width:70px}\n.vk-npc-leveler .vk-npc-wealth .vk-editor-status {width:100%}\n@media(max-width:700px){.vk-npc-leveler .vk-npc-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}\n\n.vk-npc-leveler .vk-main {grid-template-columns:minmax(340px,1fr) minmax(440px,544px)}\n.vk-npc-leveler .vk-preview-panel {width:100%;max-width:544px}\n.vk-npc-leveler .vk-preview-scroll .statblock {max-width:520px!important}\n.vk-npc-leveler .vk-npc-ordinary {display:flex;align-items:center;gap:10px;flex-wrap:wrap}\n.vk-npc-leveler .vk-npc-ordinary .vk-equipment-title {flex:1 1 130px}\n.vk-npc-leveler .vk-npc-ordinary .vk-editor-field {margin:0;max-width:150px}\n.vk-npc-leveler .vk-npc-ordinary input {max-width:65px}\n.vk-npc-leveler .vk-npc-ordinary .vk-editor-status {width:100%}\n@container vk-leveler (max-width:950px){.vk-npc-leveler .vk-main{grid-template-columns:minmax(0,1fr)}}\n";
levelerStyle.textContent += "\n.vk-npc-leveler .vk-attack-fields {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0 0 12px}\n.vk-npc-leveler .vk-attack-form {padding:14px;border:1px solid var(--vk-edge,#365d78);border-radius:var(--vk-radius-sm,7px);background:var(--vk-recessed,#102434);margin-top:12px}\n.vk-npc-leveler .vk-attack-form h4 {margin:0 0 14px}\n.vk-npc-leveler .vk-attack-form .vk-editor-field {display:grid!important;grid-template-columns:minmax(0,1fr);align-items:start;justify-content:stretch;gap:5px;margin:0;min-width:0}\n.vk-npc-leveler .vk-attack-form .vk-editor-field :is(input:not([type=checkbox]),select) {width:100%;max-width:100%;min-width:0}\n.vk-npc-leveler .vk-attack-form .vk-editor-field span {white-space:normal}\n.vk-npc-leveler .vk-attack-form [hidden] {display:none!important}\n.vk-npc-leveler .vk-attack-wide,.vk-npc-leveler .vk-attack-description {grid-column:1/-1}\n.vk-npc-leveler .vk-attack-description summary {padding:6px 0;font-size:12px}\n.vk-npc-leveler .vk-attack-description p,.vk-npc-leveler .vk-attack-help {font-size:12px;color:var(--vk-muted,#aebdca);margin:6px 0 12px;line-height:1.5}\n.vk-npc-leveler .vk-attack-form textarea {width:100%;margin-top:6px}\n.vk-npc-leveler .vk-attack-form .vk-editor-actions {margin-top:12px}\n.vk-npc-leveler .vk-attack-editor > button {margin-top:10px}\n";
container.style.containerType="inline-size";container.style.containerName="vk-leveler";


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
let wealthOverride = null;
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
  openNpcWorkbench?.();
  equipmentDraft = clone(npc.inventory ?? []);
  attackDraft = clone(npc.attacks ?? []);
  equipmentHistory = []; armorEdited = false; offBookEdits = 0; manualFields = {}; tagOverrides = {}; wealthOverride = null;
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
    weapons:characterWeaponUpgrades, armor:characterArmorUpgrades, offBookEdits, manualFields:clone(manualFields), tags:clone(tagOverrides), wealth:wealthOverride, attackDamageUpgrades:clone(creatureDamageUpgrades)});
}
function gearUndo() {
  const state=equipmentHistory.pop();if(!state)return;
  equipmentDraft=state.inventory;attackDraft=state.attacks;armorEdited=state.armorEdited;
  characterWeaponUpgrades=state.weapons;characterArmorUpgrades=state.armor;offBookEdits=state.offBookEdits;manualFields=state.manualFields;tagOverrides=state.tags??{};wealthOverride=state.wealth??null;
  if(state.attackDamageUpgrades)creatureDamageUpgrades=state.attackDamageUpgrades;
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
let equipmentMarkdownOwner = null, openNpcWorkbench = null;
if(typeof MutationObserver!=="undefined"){
  let attached=false;
  const lifecycle=new MutationObserver(()=>{
    if(container.isConnected){attached=true;return;}
    if(attached){equipmentMarkdownOwner?.unload();openNpcWorkbench?.();previewComponent?.unload();lifecycle.disconnect();}
  });
  lifecycle.observe(document.body,{childList:true,subtree:true});
}
function markdownLabel(raw, alias) {
  const value=String(raw??"");
  const target=linkName(value);
  if(!target)return alias??"—";
  if(!/^\[\[.*\]\]$/.test(value) && !app.metadataCache.getFirstLinkpathDest(target,loadedSourcePath))return alias??value;
  return alias ? "[["+target+"|"+String(alias).replace(/[\]|]/g,"")+"]]" : /^\[\[/.test(value)?value:"[["+target+"]]";
}
function renderEditorMarkdown(target,text,owner,sourcePath=loadedSourcePath) {
  const previous=target._npcMarkdown;
  if(previous)previous.parent.removeChild(previous.child);
  const child=owner.addChild(new Component()),state={parent:owner,child,active:true};
  child.register(()=>state.active=false);target._npcMarkdown=state;
  target.classList.add("vk-npc-markdown");target.dataset.vkSourcePath=sourcePath;
  const rendered=editorNode("div");
  Promise.resolve(MarkdownRenderer.render(app,String(text??""),rendered,sourcePath,child)).then(()=>{
    if(state.active&&target._npcMarkdown===state)target.replaceChildren(...rendered.childNodes);
  }).catch(()=>{if(state.active&&target._npcMarkdown===state)target.textContent=equipmentDisplayName({item:text});});
}
function npcIcon(name,label,handler) {
  const button=editorButton("",handler);button.classList.add("vk-npc-icon");
  button.title=label;button.setAttribute("aria-label",label);
  const setIcon=engine.getObsidianModule().setIcon;
  if(setIcon)setIcon(button,name);else button.textContent=name==="settings"?"⚙":"×";
  return button;
}
function syncNpcTheme() {
  const source=document.querySelector?.("#fallout-sheet-root");
  if(!source || typeof getComputedStyle!=="function")return;
  const theme=getComputedStyle(source);
  for(const property of theme)if(property.startsWith("--vk-")){
    const value=theme.getPropertyValue(property).trim();if(value)container.style.setProperty(property,value);
  }
}
function modIdentity(mod,context) {
  return app.metadataCache.getFirstLinkpathDest(linkName(mod.item),context)?.path ?? linkName(mod.item);
}
function workbenchChanges(before,draft,context) {
  const original=before.mods??[],next=draft.mods??[];
  const legendary=mod=>/\/Legendary Mods\//.test(modIdentity(mod,context)) || cleanKey(mod.slot)==="legendary";
  const standard=mods=>new Map(mods.filter(m=>!legendary(m)).map(m=>[cleanKey(m.slot),modIdentity(m,context)]));
  const a=standard(original),b=standard(next);
  let applications=0,removed=false;
  for(const key of new Set([...a.keys(),...b.keys()]))if(a.get(key)!==b.get(key)){
    if(b.has(key))applications++;else removed=true;
  }
  const oldLegend=original.filter(legendary).map(m=>modIdentity(m,context));
  const newLegend=next.filter(legendary).map(m=>modIdentity(m,context));
  applications+=newLegend.filter(id=>!oldLegend.includes(id)).length;
  removed ||= oldLegend.some(id=>!newLegend.includes(id));
  const controls=before.equipped!==draft.equipped || Number(before.quantity??1)!==Number(draft.quantity??1);
  return {applications,removed,controls,mods:JSON.stringify(original)!==JSON.stringify(next)};
}
function profileMetrics(profile) {
  if(!profile)return {};
  const number=value=>value===Infinity?"Immune":value??"—";
  return {
    Name:profile.name, ...(profile.kind==="weapon"?{
      Damage:profile.damage+" D6", "Damage type":profile.damageType, "Fire rate":profile.fireRate,
      Range:profile.range, Ammo:profile.ammo, Effects:profile.damageEffects, Qualities:profile.damageQualities
    }:{}),
    ...(profile.values?Object.fromEntries(Object.entries(profile.values).map(([key,value])=>[
      ({phys_dr:"Physical DR",energy_dr:"Energy DR",rad_dr:"Radiation DR",poison_dr:"Poison DR"})[key]??key,number(value)])):{}),
    ...(profile.powerArmor?{"Maximum piece HP":profile.maxHp}:{}),
    Weight:profile.weight,Cost:profile.cost
  };
}
function openEquipmentWorkbench(index) {
  openNpcWorkbench?.();
  syncNpcTheme();
  const original=clone(equipmentDraft[index]),draft=clone(original),sourcePath=loadedSourcePath;
  const session=equipmentDraft;
  const owner=new Component();owner.load();
  const overlay=editorNode("div",null,"vk-editor-overlay vk-npc-workbench-overlay");
  const card=editorNode("section",null,"vk-npc-workbench"),header=editorNode("header",null,"vk-npc-workbench-header");
  card.setAttribute("role","dialog");card.setAttribute("aria-modal","true");card.setAttribute("aria-label","Equipment workbench");
  card.tabIndex=-1;
  const title=editorNode("div"),heading=editorNode("div",null,"vk-npc-workbench-title");
  title.append(editorNode("small","VAULT-KIT // EQUIPMENT WORKBENCH"),heading);
  const body=editorNode("div",null,"vk-npc-workbench-layout"),edit=editorNode("div",null,"vk-npc-workbench-edit"),review=editorNode("div",null,"vk-npc-workbench-review");
  const status=editorNode("div","Loading equipment…","vk-editor-status"),footer=editorNode("footer",null,"vk-npc-workbench-footer");
  let closed=false,version=0,previewOwner=null,currentProfile=null,source=null,valid=false,applying=false;
  let focusBefore=document.activeElement;
  const pane=container.closest?.(".view-content") || container;
  const panePosition=pane.style.position,positionChanged=typeof getComputedStyle==="function"&&getComputedStyle(pane).position==="static";
  if(positionChanged)pane.style.position="relative";
  if(pane!==container){
    overlay.classList.add("vk-npc-leveler");overlay.style.position="absolute";
    if(typeof getComputedStyle==="function"){const theme=getComputedStyle(container);for(const key of theme)if(key.startsWith("--vk-"))overlay.style.setProperty(key,theme.getPropertyValue(key));}
  }
  const hoverParent=app.workspace.getLeavesOfType?.("markdown")?.find(leaf=>leaf.containerEl?.contains(container))?.view || {hoverPopover:null};
  card.addEventListener("mouseover",event=>{
    const link=event.target?.closest?.("a.internal-link");if(!link)return;
    const linktext=link.getAttribute("data-href")||link.getAttribute("href");if(!linktext)return;
    app.workspace.trigger?.("hover-link",{event,source:"fallout-npc-leveler",hoverParent,targetEl:link,linktext,sourcePath:link.closest("[data-vk-source-path]")?.dataset.vkSourcePath||sourcePath});
  });
  card.addEventListener("click",event=>{if(event.target?.closest?.("a.internal-link")){event.preventDefault();event.stopPropagation();}},true);
  const close=()=>{if(closed)return;closed=true;++version;owner.unload();overlay.remove();if(positionChanged)pane.style.position=panePosition;document.removeEventListener?.("keydown",keyHandler,true);if(openNpcWorkbench===close)openNpcWorkbench=null;focusBefore?.focus?.();};
  const requestClose=()=>{
    if(JSON.stringify(original)===JSON.stringify(draft)){close();return;}
    status.replaceChildren(editorNode("span","Discard staged changes?"),editorButton("Discard",close),editorButton("Keep editing",()=>status.textContent="Unapplied changes"));
  };
  const keyHandler=event=>{if(event.key==="Escape"){event.preventDefault();requestClose();}};
  document.addEventListener?.("keydown",keyHandler,true);openNpcWorkbench=close;
  header.append(title,npcIcon("x","Close workbench",requestClose));
  const apply=editorButton("Apply changes",async()=>{
    if(!valid||closed||applying)return;
    try{
      if(equipmentDraft!==session||loadedSourcePath!==sourcePath)throw new Error("The NPC changed. Close and reopen this workbench.");
      const change=workbenchChanges(original,draft,source.file.path),kind=currentProfile.kind;
      if(!bypassLimits && (change.removed||change.controls))throw new Error("Enable bypass to remove mods or change quantity/equipped state.");
      if(!bypassLimits&&change.applications+(kind==="weapon"?characterWeaponUpgrades:characterArmorUpgrades)>equipmentAllowance())throw new Error("Not enough "+kind+" upgrades remain.");
      if(JSON.stringify(original)===JSON.stringify(draft))return;
      applying=true;gearCheckpoint();
      let final=clone(draft);
      if(change.mods && Number(draft.quantity??1)>1){
        equipmentDraft[index].quantity=Number(draft.quantity??1);
        onePiece(index);final.quantity=1;
      }
      equipmentDraft[index]=final;
      if(change.mods){
        if(kind==="weapon")characterWeaponUpgrades+=change.applications;
        else if(kind==="armor")characterArmorUpgrades+=change.applications;
        if(kind==="weapon")refreshLinkedAttack(final);
      }
      if(original.name!==draft.name)for(const attack of attackDraft.filter(a=>a.inventoryId===original.id))delete attack.name;
      if(change.removed||change.controls)offBookEdits++;
      if(kind==="armor"&&(change.mods||change.controls))armorEdited=true;
      if(kind==="weapon"&&draft.equipped)linkWeapon(final);
      close();renderUpgrades();
    }catch(e){applying=false;editorMessage(status,e);}
  });
  apply.disabled=true;
  footer.append(status,editorButton("Cancel",requestClose),apply);
  body.append(edit,review);card.append(header,body,footer);overlay.append(card);pane.append(overlay);card.focus?.();
  const preview=async()=>{
    const request=++version;valid=false;apply.disabled=true;status.textContent="Calculating preview…";
    try{
      const calculate=window.FalloutNpcItems?.resolveEquipment;
      if(!calculate)throw new Error("Update Fallout NPC Items to 0.6.3 for workbench stat previews.");
      const next=source?.custom?{kind:"other",name:draft.name||draft.item}:await calculate(draft,sourcePath);
      if(closed||request!==version)return;
      const change=workbenchChanges(original,draft,source?.file.path??sourcePath);
      if(!bypassLimits&&(change.removed||change.controls))throw new Error("Enable bypass for removals or quantity/equipped changes.");
      const spent=next.kind==="weapon"?characterWeaponUpgrades:characterArmorUpgrades;
      if(!bypassLimits&&spent+change.applications>equipmentAllowance())throw new Error("Not enough "+next.kind+" upgrades remain.");
      if(previewOwner)owner.removeChild(previewOwner);
      previewOwner=owner.addChild(new Component());
      const grid=editorNode("div",null,"vk-npc-stat-grid");
      review.replaceChildren(editorNode("h4","Stat preview"),grid);
      const before=profileMetrics(currentProfile),after=profileMetrics(next);
      const compact=new Set(["Damage","Damage type","Fire rate","Range","Weight","Cost","Physical DR","Energy DR","Radiation DR","Poison DR","Maximum piece HP"]);
      for(const label of new Set([...Object.keys(before),...Object.keys(after)])){
        const a=before[label]??"—",b=after[label]??"—";if(a===""&&b==="")continue;
        const changed=String(a)!==String(b);
        if(label==="Name"&&!changed)continue;
        const row=editorNode("div",null,"vk-npc-stat"+(changed?" is-changed":"")+(!compact.has(label)?" is-wide":""));
        row.append(editorNode("strong",label));
        if(changed){
          const was=editorNode("div"),now=editorNode("div");
          renderEditorMarkdown(was,"Was: "+a,previewOwner,sourcePath);
          renderEditorMarkdown(now,"New: "+b,previewOwner,sourcePath);
          row.append(was,now);
          if(Number.isFinite(Number(a))&&Number.isFinite(Number(b)))row.append(editorNode("small","Difference: "+(Number(b)-Number(a)>=0?"+":"")+(Number(b)-Number(a))));
        }else{
          const value=editorNode("div",null,"vk-npc-stat-value");renderEditorMarkdown(value,b,previewOwner,sourcePath);row.append(value);
        }
        grid.append(row);
      }
      if(next.gameEffects){
        const panel=editorNode("section",null,"vk-npc-effects"),effects=editorNode("div");
        renderEditorMarkdown(effects,next.gameEffects,previewOwner,sourcePath);
        panel.append(editorNode("h4","Special"),effects);review.append(panel);
      }
      renderEditorMarkdown(heading,markdownLabel(original.item,next.name),owner,sourcePath);
      valid=true;const dirty=JSON.stringify(original)!==JSON.stringify(draft);
      apply.disabled=!dirty;status.textContent=dirty?"Unapplied changes · "+change.applications+" upgrade"+(change.applications===1?"":"s"):"No changes staged";
    }catch(e){if(!closed&&request===version){editorMessage(status,e);review.replaceChildren(editorNode("p","Preview unavailable. No changes have been applied."));}}
  };
  (async()=>{
    try{source=await readEditorItem(original.item);}catch(error){if(/^\[\[/.test(original.item))throw error;source={file:{path:sourcePath},data:{},custom:true};}
    if(closed)return;
    const calculate=window.FalloutNpcItems?.resolveEquipment;
    if(!calculate)throw new Error("Update Fallout NPC Items to 0.6.3 for workbench previews.");
    currentProfile=source.custom?{kind:"other",name:original.name||original.item}:await calculate(original,sourcePath);
    if(closed)return;
    const rename=editorInput("Custom name",draft.name??"");
    rename.input.oninput=()=>{const value=rename.input.value.trim();if(value)draft.name=value;else delete draft.name;void preview();};
    const nameEditor=editorNode("div",null,"vk-npc-name-editor");nameEditor.hidden=true;
    nameEditor.append(rename.wrap,editorNode("p","Leave blank to use the generated name."));
    edit.append(editorButton("Rename item",()=>{nameEditor.hidden=!nameEditor.hidden;if(!nameEditor.hidden)rename.input.focus?.();}),nameEditor);
    const controls=editorNode("details");controls.append(editorNode("summary","Quantity and equipped state"));
    const qty=editorInput("Quantity",draft.quantity??1,"number"),equipped=editorInput("Equipped",draft.equipped===true,"checkbox");
    qty.input.min=1;qty.input.disabled=equipped.input.disabled=!bypassLimits;
    qty.input.onchange=()=>{const value=Number(qty.input.value);if(!Number.isInteger(value)||value<1){status.textContent="Quantity must be a positive integer.";valid=false;apply.disabled=true;return;}draft.quantity=value;void preview();};
    equipped.input.onchange=()=>{draft.equipped=equipped.input.checked;void preview();};
    controls.append(qty.wrap,equipped.wrap);edit.append(controls,editorNode("h4","Installed modifications"));
    const slots=currentProfile.kind!=="other"&&Array.isArray(source.data.mods)?source.data.mods:[];
    for(const slot of slots){
      const section=editorNode("details",null,"vk-npc-slot"),summary=editorNode("summary",slot.name?String(slot.name).replace(/:$/,""):"Other mods");
      const select=editorNode("select"),current=editorNode("div");
      select.setAttribute("aria-label",slot.name||"Unnamed mod slot");select.append(new Option("None",""));
      const options=[];
      for(const match of String(slot.desc??"").matchAll(/\[\[([^\]]+)\]\]/g)){
        const file=app.metadataCache.getFirstLinkpathDest(linkName(match[0]),source.file.path);if(!file)continue;
        const ref=editorItemReference(file,source.file.path);options.push({ref,file,label:match[1].split("|")[1]||file.basename});
      }
      const installed=(draft.mods??[]).find(m=>cleanKey(m.slot)===cleanKey(slot.name));
      if(installed&&!options.some(o=>o.file.path===modIdentity(installed,source.file.path)))options.push({ref:installed.item,file:{path:modIdentity(installed,source.file.path)},label:equipmentDisplayName({item:installed.item})+" (installed)"});
      for(const option of options)select.append(new Option(option.label,option.ref));
      select.value=installed?options.find(o=>o.file.path===modIdentity(installed,source.file.path))?.ref??"":"";
      const selectedLink=editorNode("div"),summaryValue=editorNode("span",null,"vk-npc-slot-value");
      summary.append(summaryValue);
      const sync=()=>{selectedLink.replaceChildren();const choice=options.find(o=>o.ref===select.value);
        if(choice){
          renderEditorMarkdown(selectedLink,choice.ref,owner,source.file.path);
          renderEditorMarkdown(summaryValue,choice.ref,owner,source.file.path);
        }else{selectedLink.textContent="No mod selected.";summaryValue.textContent="None";}};
      sync();
      select.onchange=()=>{draft.mods=(draft.mods??[]).filter(m=>cleanKey(m.slot)!==cleanKey(slot.name));if(select.value)draft.mods.push({slot:String(slot.name??"").replace(/:$/,""),item:select.value});sync();void preview();};
      renderEditorMarkdown(current,"Installed: "+(installed?markdownLabel(installed.item):"None"),owner,source.file.path);
      section.append(summary,current,select,selectedLink);edit.append(section);
    }
    const roots=currentProfile.kind==="weapon"?["Weapons","CustomWeapons"]:["Apparel","CustomApparel"];
    const legendFiles=currentProfile.kind==="other"?[]:app.vault.getMarkdownFiles().filter(file=>roots.some(root=>file.path.startsWith(EDITOR_ITEMS+"Mods/Legendary Mods/"+root+"/")));
    if(legendFiles.length){
      const legends=editorNode("details",null,"vk-npc-slot"),legendSummary=editorNode("summary","Legendary properties"),legendCount=editorNode("span",null,"vk-npc-slot-value");
      const updateLegendCount=()=>legendCount.textContent=(draft.mods??[]).filter(m=>/\/Legendary Mods\//.test(modIdentity(m,source.file.path))).length+" selected";
      updateLegendCount();legendSummary.append(legendCount);legends.append(legendSummary);
      const search=editorInput("Search properties",""),list=editorNode("div");
      const fill=()=>{
        list.replaceChildren();
        for(const file of legendFiles.filter(f=>f.basename.toLowerCase().includes(search.input.value.toLowerCase())).slice(0,40)){
          const ref=editorItemReference(file,source.file.path),label=editorNode("label",null,"vk-editor-field"),check=editorNode("input"),name=editorNode("span");
          check.type="checkbox";check.checked=(draft.mods??[]).some(m=>modIdentity(m,source.file.path)===file.path);
          renderEditorMarkdown(name,ref,owner,source.file.path);
          check.onchange=()=>{draft.mods=(draft.mods??[]).filter(m=>modIdentity(m,source.file.path)!==file.path);if(check.checked)draft.mods.push({slot:"Legendary",item:ref});updateLegendCount();void preview();};
          label.append(name,check);list.append(label);
        }
      };
      search.input.oninput=fill;fill();legends.append(search.wrap,list);edit.append(legends);
    }
    edit.append(editorButton("Replace base item…",()=>{requestClose();if(closed)openEquipmentDialog(index,"replace");}));
    await preview();
  })().catch(e=>{if(!closed)editorMessage(status,e);});
}

function openEquipmentDialog(index, mode) {
  if(mode==="mod"){openEquipmentWorkbench(index);return;}
  const entry=index==null?null:equipmentDraft[index];
  const overlay=editorNode("div",null,"vk-editor-overlay"),card=editorNode("div",null,"vk-editor-dialog");
  const heading=editorNode("strong",mode==="mod"?"Modify equipment":mode==="replace"?"Replace one item":"Add equipment");
  const status=editorNode("div","", "vk-editor-status"),body=editorNode("div");
  const close=()=>overlay.remove();
  card.append(heading,body,status,editorButton("Close",close));overlay.append(card);container.append(overlay);
  (async()=>{
    let source=entry?await readEditorItem(entry.item):null;
    const kind=source?itemKind(source.data,source.file):null;
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
let generatedBuild=Promise.resolve(null),generatedBuildRevision=0,generatedBuildError=null;
const EQUIPMENT_ABILITY_NAME="Equipment abilities";
const EQUIPMENT_ABILITY_LIMIT=400;
function equipmentAbilityExcerpt(value) {
  const text=String(value??"").trim();
  if(text.length<=EQUIPMENT_ABILITY_LIMIT)return text;
  // Flatten formatting before shortening, so the excerpt cannot leave open Markdown.
  const plain=text.replace(/<!--[^]*?-->/g,"")
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,(_,target,alias)=>alias||target)
    .replace(/\[([^\]]+)\]\([^)]+\)/g,"$1")
    .replace(/<[^>]+>/g,"").replace(/[*_`]/g,"")
    .replace(/&(?:nbsp|#xA0|#160);/gi," ").replace(/\s+/g," ").trim();
  if(plain.length<=EQUIPMENT_ABILITY_LIMIT)return plain;
  const cut=plain.slice(0,EQUIPMENT_ABILITY_LIMIT-1);
  const boundary=cut.lastIndexOf(" ");
  return cut.slice(0,boundary>cut.length-50?boundary:cut.length).trimEnd()+"…";
}

function equipmentEntryCandidate(entry,model) {
  if(Number(entry.quantity??1)<=0)return false;
  const linked=(model.attacks??[]).some(attack=>attack.inventoryId!=null&&attack.inventoryId===entry.id);
  if(entry.equipped!==true&&!linked)return false;
  const file=app.metadataCache.getFirstLinkpathDest(linkName(entry.item),loadedSourcePath);
  return linked || /\/(Weapons|Apparel|Armor)\//i.test(file?.path??"") || entry["dmg resistances"]!=null;
}
async function injectEquipmentAbilities(model,sourcePath) {
  const result=clone(model);
  const candidates=(result.inventory??[]).filter(entry=>equipmentEntryCandidate(entry,result));
  const existing=Array.isArray(result.special_abilities)?result.special_abilities:[];
  result.special_abilities=existing.filter(entry=>entry.name!==EQUIPMENT_ABILITY_NAME);
  const calculate=window.FalloutNpcItems?.resolveEquipment;
  if(candidates.length&&!calculate)throw new Error("Enable Fallout NPC Items 0.6.3 to resolve equipment abilities.");
  const resolved=await Promise.all(candidates.map(async entry=>({entry,profile:await calculate(entry,sourcePath)})));
  const sections=[],seen=new Set();
  for(const {entry,profile}of resolved){
    const text=String(profile.gameEffects??"").trim();if(!text||text==="-")continue;
    const key=profile.sourcePath+"\n"+text;if(seen.has(key))continue;seen.add(key);
    sections.push("**"+markdownLabel(entry.item,profile.name)+"**\n"+equipmentAbilityExcerpt(text));
  }
  if(sections.length)result.special_abilities.push({name:EQUIPMENT_ABILITY_NAME,desc:sections.join("\n\n")});
  if(!result.special_abilities.length&&!Object.hasOwn(model,"special_abilities"))delete result.special_abilities;
  return result;
}
function scheduleGeneratedBuild(model) {
  const revision=++generatedBuildRevision,sourcePath=loadedSourcePath;
  ++previewRequest;generatedBuildError=null;
  equipmentAbilityStatus.textContent="Updating equipment abilities…";
  generatedBuild=injectEquipmentAbilities(model,sourcePath).then(result=>{
    if(revision!==generatedBuildRevision)return null;
    upgradedNPC=result;
    equipmentAbilityStatus.textContent="";
    renderChangeSummary();
    void renderStatblockPreview(viewOriginal?original:result);
    return result;
  }).catch(error=>{
    if(revision===generatedBuildRevision){
      generatedBuildError=error;
      equipmentAbilityStatus.textContent="Equipment abilities could not be updated: "+String(error.message??error);
      // Keep the ordinary preview available, but never export a partial ability build.
      void renderStatblockPreview(viewOriginal?original:model);
    }
    return null;
  });
}
async function readyGeneratedNpc() {
  while(true){
    const pending=generatedBuild,result=await pending;if(pending!==generatedBuild)continue;
    if(!result)throw generatedBuildError??new Error("Load an NPC and wait for its equipment abilities to finish.");
    return clone(result);
  }
}
function ordinaryInventoryEntry(entry,profile) {
  if(entry["dmg resistances"]!=null || (attackDraft??[]).some(a=>a.inventoryId!=null&&a.inventoryId===entry.id))return false;
  const file=app.metadataCache.getFirstLinkpathDest(linkName(entry.item),loadedSourcePath);
  if(/\/(Weapons|Apparel|Armor)\//i.test(profile?.sourcePath??file?.path??""))return false;
  return !profile || profile.kind==="other";
}
function paintInventoryRow(row,entry,index,owner,profile) {
  row.replaceChildren();
  const name=editorNode("div",null,"vk-equipment-title"),status=editorNode("div","", "vk-editor-status");
  renderEditorMarkdown(name,markdownLabel(entry.item,entry.name||profile?.name),owner);
  if(ordinaryInventoryEntry(entry,profile)){
    row.className="vk-equipment-row vk-npc-ordinary";
    const quantity=editorInput("Quantity",entry.quantity??1,"number");quantity.input.min=0;quantity.input.disabled=!bypassLimits;
    quantity.input.title="Set quantity to 0 to remove this item.";
    const apply=editorButton("Apply quantity",()=>{
      try{
        const value=Number(quantity.input.value);if(!Number.isInteger(value)||value<0)throw new Error("Quantity must be a nonnegative integer.");
        if(value===Number(entry.quantity??1))return;
        bypassEdit(()=>{if(value===0)equipmentDraft.splice(index,1);else entry.quantity=value;});
      }catch(error){editorMessage(status,error);}
    });apply.disabled=!bypassLimits;
    row.append(name,quantity.wrap,apply,status);return;
  }
  row.className="vk-equipment-row";
  const header=editorNode("div",null,"vk-equipment-heading"),state=editorNode("span",(entry.quantity??1)+" × · "+(entry.equipped?"Equipped":"Carried"),"vk-equipment-state");
  const actions=editorNode("div",null,"vk-editor-actions");
  actions.append(npcIcon("settings","Open equipment workbench",()=>openEquipmentWorkbench(index)),
    npcIcon("trash-2","Remove item",async()=>{try{
      const data=await readEditorItem(entry.item).catch(()=>null);
      bypassEdit(()=>{equipmentDraft.splice(index,1);attackDraft=attackDraft.filter(a=>a.inventoryId!==entry.id);},data&&itemKind(data.data,data.file)==="armor");
    }catch(error){editorMessage(status,error);}}));
  const identity=editorNode("div");identity.append(name,state);header.append(identity,actions);row.append(header);
  if(entry.mods?.length){
    const mods=editorNode("div",null,"vk-equipment-mods");
    renderEditorMarkdown(mods,"Mods: "+entry.mods.map(m=>(m.slot?m.slot+": ":"")+markdownLabel(m.item)).join(" · "),owner);row.append(mods);
  }
  row.append(status);
}

const ATTACK_ATTRIBUTES={strength:"STR",per:"PER",end:"END",cha:"CHA",int:"INT",agi:"AGI",lck:"LCK",bodyAttribute:"BODY",mindAttribute:"MIND"};
const ATTACK_SKILLS=["Athletics","Barter","Big Guns","Energy Weapons","Explosives","Lockpick","Medicine","Melee Weapons","Pilot","Repair","Science","Small Guns","Sneak","Speech","Survival","Throwing","Unarmed"];
const ATTACK_DEFAULTS={"Melee Weapons":"strength","Small Guns":"agi","Big Guns":"end","Energy Weapons":"per",Throwing:"agi",Unarmed:"strength",Explosives:"per"};
function attackSelect(label,value,options){
  const wrap=editorNode("label",null,"vk-editor-field"),input=editorNode("select");
  for(const [key,text]of options){const option=editorNode("option",text);option.value=key;input.append(option);}
  if(value!=null&&!options.some(([key])=>key===value)){const option=editorNode("option",value);option.value=value;input.append(option);}
  input.value=value??options[0]?.[0]??"";wrap.append(editorNode("span",label),input);return {wrap,input};
}
function attackScore(model,attribute,skill,isCreature){
  const number=value=>{const s=String(value??"").trim();return s==="-"?0:/^\d+/.test(s)?Number(s.match(/^\d+/)[0]):null;};
  const attributeLabel=ATTACK_ATTRIBUTES[attribute]??attribute;
  const special=(model.special??[]).find(e=>String(e.name).toLowerCase()===attributeLabel.toLowerCase());
  let av=number(model[attribute]??model[Object.keys(fieldMap).find(k=>fieldMap[k]===attribute)]??model[Object.keys(creatureMap).find(k=>creatureMap[k]===attribute)]??special?.desc);
  if(!isCreature&&["strength","STR"].includes(attribute)&&(model.inventory??[]).some(e=>e.equipped&&/power armor frame/i.test(linkName(e.item))))av=11;
  let rank,tagged=false;
  if(isCreature){const old=Object.keys(creatureMap).find(k=>creatureMap[k]===skill);rank=number(model[skill]??model[old]);}
  else {const entry=(model.skills??[]).find(e=>String(e.name).toLowerCase()===skill.toLowerCase());rank=entry?number(entry.desc):ATTACK_SKILLS.includes(skill)?0:null;tagged=!!entry&&(entry.tagged===true||String(entry.desc??"").includes("⬛"));}
  const crit=rank==null?"?":isCreature||tagged?rank:1;
  return "TN "+(av==null||rank==null?"?":av+rank)+" · Crit "+(crit===0?"None":typeof crit==="number"&&crit>1?"1–"+crit:crit)+(tagged?" · TAG":"");
}
function renderAttackEditor(model,isCreature){
  upgradeArea.append(editorNode("div","Attacks"));
  const panel=editorNode("div",null,"vk-attack-editor"),owner=equipmentMarkdownOwner;
  panel.append(editorNode("p",isCreature?"Creature attacks use BODY or MIND plus Melee, Guns or Other. Enable bypass to add, edit or remove attacks.":"Inventory weapons calculate their stats automatically. Enable bypass to add, edit or remove attacks.","vk-attack-help"));
  const formHost=editorNode("div"),list=editorNode("div");
  const openForm=(index=null)=>{
    formHost.replaceChildren();
    const source=index==null?{}:clone(attackDraft[index]);
    const form=editorNode("div",null,"vk-equipment-row vk-attack-form"),status=editorNode("div","","vk-editor-status");
    const kind=attackSelect("Attack source",source.inventoryId!=null?"weapon":"manual",isCreature?[["manual","Custom attack"]]:[["manual","Custom attack"],["weapon","Inventory weapon"]]);
    const name=editorInput("Name",source.name??""),attribute=attackSelect("Attribute",source.attribute??(isCreature?"bodyAttribute":"strength"),Object.entries(ATTACK_ATTRIBUTES).filter(([key])=>isCreature?["bodyAttribute","mindAttribute"].includes(key):!["bodyAttribute","mindAttribute"].includes(key)));
    const skill=attackSelect("Skill",source.skill??(isCreature?"meleeSkill":"Unarmed"),(isCreature?["meleeSkill","gunsSkill","otherSkill"]:ATTACK_SKILLS).map(s=>[s,({meleeSkill:"Melee",gunsSkill:"Guns",otherSkill:"Other"})[s]??s]));
    const override=editorInput("Override standard combination",source.inventoryId!=null&&(source.attribute!=null||source.skill!=null),"checkbox");
    const weapon=attackSelect("Inventory weapon",source.inventoryId??"",[["","Choose a weapon…"]]);
    const grid=editorNode("div",null,"vk-attack-fields"),manual=editorNode("div",null,"vk-attack-fields"),combo=editorNode("div",null,"vk-attack-fields");
    const inputs={};
    for(const [key,label,type]of [["damage","Damage (D6)","number"],["damageType","Damage type","text"],["damageEffects","Damage effects","text"],["damageQualities","Qualities","text"],["range","Range","text"],["fireRate","Fire rate","number"]]){
      if(isCreature&&key==="fireRate")continue;
      const field=editorInput(label,source[key]??"",type);if(type==="number")field.input.min=0;inputs[key]=field.input;manual.append(field.wrap);
    }
    const desc=editorNode("textarea");desc.rows=3;desc.value=source.desc??"";
    const description=editorNode("details",null,"vk-attack-description");description.open=!!source.desc;
    description.append(editorNode("summary","Description override (optional)"),editorNode("p","Replaces the calculated attack display."),desc);manual.append(description);
    const preview=editorNode("div","","vk-editor-status"),profiles=new Map();
    kind.wrap.hidden=isCreature;
    if(isCreature)name.wrap.classList.add("vk-attack-wide");
    combo.append(attribute.wrap,skill.wrap);grid.append(kind.wrap,weapon.wrap,name.wrap,override.wrap);form.append(editorNode("h4",index==null?"New attack":"Edit attack"),grid,combo,manual,preview,status);
    const update=()=>{
      const linked=kind.input.value==="weapon",profile=profiles.get(weapon.input.value);
      weapon.wrap.hidden=!linked;override.wrap.hidden=!linked;manual.hidden=linked;combo.hidden=linked&&!override.input.checked;
      const sk=linked&&!override.input.checked?profile?.skill:skill.input.value;
      const attr=linked&&!override.input.checked?ATTACK_DEFAULTS[sk]:attribute.input.value;
      preview.textContent=sk&&attr?attackScore(model,attr,sk,isCreature)+(profile?" · "+profile.damage+" D6 "+(profile.damageType??""):""):"Select a weapon to calculate its attack.";
    };
    for(const el of [kind.input,weapon.input,override.input,attribute.input,skill.input])el.onchange=update;
    if(!isCreature)for(const entry of equipmentDraft??[]){
      if(Number(entry.quantity??1)<=0)continue;
      window.FalloutNpcItems?.resolveEquipment(entry,loadedSourcePath).then(profile=>{
        if(equipmentMarkdownOwner!==owner||profile.kind!=="weapon")return;
        profiles.set(entry.id,profile);const option=editorNode("option",profile.name);option.value=entry.id;weapon.input.append(option);
        if(source.inventoryId===entry.id)weapon.input.value=entry.id;update();
      }).catch(()=>{});
    }
    const apply=editorButton("Apply attack",()=>{try{
      let next={...source};
      if(kind.input.value==="weapon"){
        if(!profiles.has(weapon.input.value))throw new Error("Choose a resolved inventory weapon.");
        next={...(source.id?{id:source.id}:{}),inventoryId:weapon.input.value};
        if(name.input.value.trim())next.name=name.input.value.trim();
        if(override.input.checked){next.attribute=attribute.input.value;next.skill=skill.input.value;}
      }else{
        delete next.inventoryId;if(!name.input.value.trim())throw new Error("Enter an attack name.");
        next.name=name.input.value.trim();next.attribute=attribute.input.value;next.skill=skill.input.value;
        for(const [key,input]of Object.entries(inputs)){
          const value=input.value.trim();if(!value){delete next[key];continue;}
          if(["damage","fireRate"].includes(key)){if(!Number.isInteger(Number(value))||Number(value)<0)throw new Error(key+" must be a nonnegative integer.");next[key]=Number(value);}else next[key]=value;
        }
        if(isCreature)delete next.fireRate;
        if(desc.value.trim())next.desc=desc.value;else delete next.desc;
      }
      bypassEdit(()=>{if(index==null)attackDraft.push(next);else attackDraft[index]=next;});
    }catch(error){editorMessage(status,error);}});apply.disabled=!bypassLimits;
    const actions=editorNode("div",null,"vk-editor-actions");actions.append(apply,editorButton("Cancel attack edit",()=>formHost.replaceChildren()));form.append(actions);formHost.append(form);update();
  };
  for(const [index,attack]of attackDraft.entries()){
    const row=editorNode("div",null,"vk-equipment-row"),title=editorNode("div"),entry=(equipmentDraft??[]).find(e=>e.id===attack.inventoryId);
    renderEditorMarkdown(title,"**"+(attack.name??entry?.name??linkName(entry?.item)??"Custom attack")+"**",owner);row.append(title);
    const status=editorNode("div",attack.inventoryId!=null?"Inventory weapon · automatic stats":attack.desc?"Description override":attackScore(model,attack.attribute,attack.skill,isCreature),"vk-editor-status");row.append(status);
    const actions=editorNode("div",null,"vk-editor-actions"),edit=editorButton("Edit attack",()=>openForm(index)),remove=editorButton("Remove attack",()=>bypassEdit(()=>{attackDraft.splice(index,1);creatureDamageUpgrades=Object.fromEntries(Object.entries(creatureDamageUpgrades).filter(([i])=>Number(i)!==index).map(([i,value])=>[Number(i)>index?Number(i)-1:Number(i),value]));}));
    edit.disabled=remove.disabled=!bypassLimits;actions.append(edit,remove);row.append(actions);list.append(row);
  }
  const add=editorButton("Add attack",()=>openForm());add.disabled=!bypassLimits;
  panel.append(list,add,formHost,editorButton("Undo last attack/custom edit",gearUndo));upgradeArea.append(panel);
}

function renderEquipmentEditor(temp,isCreature) {
  equipmentMarkdownOwner?.unload();
  equipmentMarkdownOwner=new Component();equipmentMarkdownOwner.load();
  syncNpcTheme();
  if(!isCreature)upgradeArea.append(editorNode("div","Gear Upgrades"));
  const panel=editorNode("div",null,"vk-equipment-editor");
  if(!isCreature) {
    panel.append(editorNode("p",`Weapon: ${characterWeaponUpgrades}/${equipmentAllowance()} · Armor: ${characterArmorUpgrades}/${equipmentAllowance()}`));
    for(const [i,entry]of equipmentDraft.entries()){
      if(String(entry.item??"").replace(/[*_]/g,"").trim().toLowerCase()==="wealth")continue;
      const row=editorNode("div",null,"vk-equipment-row"),generation=equipmentMarkdownOwner;
      paintInventoryRow(row,entry,i,generation);panel.append(row);
      if(window.FalloutNpcItems?.resolveEquipment)window.FalloutNpcItems.resolveEquipment(entry,loadedSourcePath).then(profile=>{
        if(equipmentMarkdownOwner===generation)paintInventoryRow(row,entry,i,generation,profile);
      }).catch(()=>{});

    }
    const wealthRow=editorNode("div",null,"vk-equipment-row vk-npc-wealth"),wealthStatus=editorNode("div","", "vk-editor-status");
    const value=num((temp.inventory??[]).find(e=>String(e.item??"").replace(/[*_]/g,"").trim().toLowerCase()==="wealth")?.quantity);
    const wealthHeading=editorNode("strong","Wealth "+value),wealthField=editorInput("Wealth value",value,"number");
    wealthField.input.min=0;wealthField.input.disabled=!bypassLimits;
    const applyWealth=editorButton("Apply value",()=>{
      try{const next=Number(wealthField.input.value);if(!Number.isInteger(next)||next<0)throw new Error("Wealth must be a nonnegative integer.");
        if(next===value)return;bypassEdit(()=>wealthOverride=next);
      }catch(e){editorMessage(wealthStatus,e);}
    });applyWealth.disabled=!bypassLimits;
    wealthRow.append(wealthHeading,wealthField.wrap,applyWealth,wealthStatus);panel.append(wealthRow);
    panel.append(editorButton("Add equipment / custom gear",()=>openEquipmentDialog(null,"add")));
  }
  if(!isCreature){panel.append(editorButton("Undo last equipment/custom edit",gearUndo));upgradeArea.append(panel);}
  renderAttackEditor(temp,isCreature);
  upgradeArea.append(editorNode("div","Custom fields"));
  const manual=editorNode("div"),status=editorNode("div","","vk-editor-status");
  manual.append(editorNode("p","Enable bypass to edit off-book fields."));
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
  upgradeArea.append(manual);
}
async function saveCustomNpc(folder,name) {
  const ready=await readyGeneratedNpc();
  validateEditorExport();
  const root=CUSTOM_NPC_ROOT,parts=String(folder??"").replace(/\\/g,"/").split("/").filter(Boolean);
  if(parts.some(p=>p==="."||p===".."||/[<>:"|?*]/.test(p)))throw new Error("Use a relative subfolder without . or ..");
  const stem=String(name??"").trim().replace(/\.md$/i,"");
  if(!stem||/[\\/<>:"|?*]/.test(stem)||stem==="."||stem==="..")throw new Error("Enter a valid note name.");
  const dir=[root,...parts].join("/"),path=dir+"/"+stem+".md";
  if(path===loadedSourcePath||app.vault.getAbstractFileByPath(path))throw new Error("That note already exists. Choose another name; source notes are never overwritten.");
  let current="";
  for(const part of dir.split("/")){current=current?current+"/"+part:part;const existing=app.vault.getAbstractFileByPath(current);if(existing && !Array.isArray(existing.children))throw new Error("A file blocks folder "+current);if(!existing)await app.vault.createFolder(current);}
  return app.vault.create(path,"```statblock\n"+yamlify(ready)+"\n```\n");
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
    let ready;
    try { ready=await readyGeneratedNpc();validateEditorExport(); } catch (e) { new (engine.getObsidianModule().Notice)(e.message); return; }
    const upgradedYAML = "```statblock\n" + yamlify(ready) + "\n```";
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

const equipmentAbilityStatus=editorNode("div","", "vk-editor-status");
yamlDiv.append(equipmentAbilityStatus);
const changeSummary=editorNode("details",null,"vk-change-summary");
yamlDiv.append(changeSummary);
const previewScroll = document.createElement("div");
previewScroll.className = "vk-preview-scroll";
previewScroll.append(resultBlock);
yamlDiv.append(previewHeading, previewActions, equipmentAbilityStatus, changeSummary, previewScroll);

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
      { key:"attacks", label:"Attacks", elements:[] },
      { key:"custom", label:"Custom fields", elements:[] },
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
        else if (title === "Attacks") mode = "attacks";
        else if (title === "Custom fields") mode = "custom";
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
        if (["damage", "dr", "gear", "attacks", "custom"].includes(section.key)) {
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
      else if (derived.wealth > 0 || wealthOverride !== null) (temp.inventory ??= []).push({id:"wealth", item:"Wealth", quantity:derived.wealth});
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
    scheduleGeneratedBuild(temp);
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
		    wealth = wealthOverride ?? (baseWealth + wealthGain);
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