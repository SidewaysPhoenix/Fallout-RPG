```js-engine


function showConfirm(message, onYes, onNo) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.classList.add("vk-modal-overlay");
    overlay.style = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;
        background:rgba(30,40,50,0.46);z-index:9999;display:flex;align-items:center;justify-content:center;`;

    const modal = document.createElement('div');
    modal.classList.add("vk-modal");
    modal.style = `
        background:#172a3b;padding:24px 22px;border-radius:14px;
        box-shadow:0 8px 44px #111b2d88;border:3px solid #ffc200;
        display:flex;flex-direction:column;align-items:center;min-width:340px;max-width:95vw;`;

    const label = document.createElement('div');
    label.textContent = message;
    label.style = "color:#ffc200;font-weight:bold;margin-bottom:16px;text-align:center;";
    modal.appendChild(label);

    // Buttons
    const buttonsRow = document.createElement('div');
    buttonsRow.style = "display:flex;gap:18px;justify-content:center;width:100%;";

    const yesBtn = document.createElement('button');
    yesBtn.textContent = "Yes";
    yesBtn.style = "background:#ffc200;color:#214a72;font-weight:bold;padding:6px 24px;border-radius:6px;border:none;cursor:pointer;font-size:1.1em;";

    const noBtn = document.createElement('button');
    noBtn.textContent = "Cancel";
    noBtn.style = "background:#172a3b;color:#ffc200;font-weight:bold;padding:6px 18px;border-radius:6px;border:2px solid #ffc200;cursor:pointer;font-size:1em;";

    yesBtn.onclick = () => {
        document.body.removeChild(overlay);
        onYes && onYes();
    };
    noBtn.onclick = () => {
        document.body.removeChild(overlay);
        onNo && onNo();
    };

    buttonsRow.appendChild(yesBtn);
    buttonsRow.appendChild(noBtn);
    modal.appendChild(buttonsRow);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

function showSheetNotice(message, duration = 2000) {
    const note = document.createElement('div');
    note.textContent = message;
    note.style = `
        position:fixed;bottom:30px;left:50%;transform:translateX(-50%);
        background:#ffc200;color:#142c3f;font-weight:bold;
        padding:13px 38px;border-radius:9px;z-index:99999;
        font-size:1.25em;box-shadow:0 2px 18px #0003;
        border:2px solid #142c3f;text-align:center;
        transition:opacity 0.3s;opacity:1;
    `;
    document.body.appendChild(note);
    setTimeout(() => {
        note.style.opacity = 0;
        setTimeout(() => document.body.removeChild(note), 350);
    }, duration);
}
 

function renderImportExportBar() {
    const KEYS = [
        'falloutRPGCharacterSheet',
        'fallout_weapon_table',
        'fallout_equipped_weapon_instance_id',
        'fallout_ammo_table',
        'fallout_gear_table',
        'fallout_perk_table',
        'fallout_armor_data_Head',
        'fallout_armor_data_Torso',
        'fallout_armor_data_Left Arm',
        'fallout_armor_data_Right Arm',
        'fallout_armor_data_Left Leg',
        'fallout_armor_data_Right Leg',
        'fallout_armor_data_Outfit',
        'fallout_power_armor_data_Helmet',
        'fallout_power_armor_data_Torso',
        'fallout_power_armor_data_Left Arm',
        'fallout_power_armor_data_Right Arm',
        'fallout_power_armor_data_Left Leg',
        'fallout_power_armor_data_Right Leg',
        'fallout_power_armor_data_Frame',
        'fallout_Caps',
        'fallout_poison_dr',
        'fallout_terminal_notes',
        'fallout_injury_data',
        'fallout_active_effects'
    ]; 

    const bar = document.createElement('div');
    bar.className = 'vk-toolbar';
	bar.style.display = "flex"
	bar.style.justifyContent = "space-between"
	bar.style.gap = "8px"
	bar.style.alignItems = "center"
	bar.style.background = "#172a3b"
	bar.style.padding = "6px 10px 6px 10px"
	bar.style.marginBottom = "18px"
	bar.style.borderRadius = "7px"
	bar.style.border = "1px solid #ffc200"
	bar.style.width = "auto"
	
    // --- Export Button ---
    const exportBtn = document.createElement('button');
    exportBtn.textContent = "Export Character";
    exportBtn.style = "font-weight:bold;color:#142c3f;background:#ffc200;border-radius:5px;padding:6px 16px;cursor:pointer";
    exportBtn.onclick = () => {
        let out = {};
        KEYS.forEach(key => {
            let val = localStorage.getItem(key);
            if (val !== null) out[key] = val;
        });
        navigator.clipboard.writeText(JSON.stringify(out, null, 2))
            .then(() => alert("Character exported to clipboard!"))
            .catch(() => alert("Clipboard error. Copy failed."));
    };

    // --- Import Button ---
    const importBtn = document.createElement('button');
    importBtn.textContent = "Import Character";
    importBtn.style = "font-weight:bold;color:#ffc200;background:#142c3f;border-radius:5px;padding:6px 16px;cursor:pointer";
    importBtn.onclick = () => {
    // Build modal elements
    const overlay = document.createElement('div');
    overlay.classList.add("vk-modal-overlay");
    overlay.style = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;
        background:rgba(30,40,50,0.86);z-index:9999;display:flex;align-items:center;justify-content:center;`;

    const modal = document.createElement('div');
    modal.classList.add("vk-modal");
    modal.style = `
        background:#172a3b;padding:24px 22px;border-radius:14px;
        box-shadow:0 8px 44px #111b2d88;border:3px solid #ffc200;
        display:flex;flex-direction:column;align-items:center;min-width:340px;max-width:95vw;`;
        

    const label = document.createElement('div');
    label.textContent = "Paste your exported character data below:";
    label.style = "color:#ffc200;font-weight:bold;margin-bottom:8px;text-align:center;";
    modal.appendChild(label);

    const textarea = document.createElement('textarea');
    textarea.rows = 9;
    textarea.style = `
        width:300px;max-width:72vw;background:#fde4c9;color:#222;font-size:1em;
        border-radius:6px;border:1.5px solid #ffc200;padding:7px;margin-bottom:14px;resize:vertical;caret-color:black;`;
    modal.appendChild(textarea);

    // Buttons
    const buttonsRow = document.createElement('div');
    buttonsRow.style = "display:flex;gap:18px;justify-content:center;width:100%;";

    const importConfirm = document.createElement('button');
    importConfirm.textContent = "Import";
    importConfirm.style = "background:#ffc200;color:#214a72;font-weight:bold;padding:6px 20px;border-radius:6px;border:none;cursor:pointer;font-size:1.1em;";

    const importCancel = document.createElement('button');
    importCancel.textContent = "Cancel";
    importCancel.style = "background:#172a3b;color:#ffc200;font-weight:bold;padding:6px 16px;border-radius:6px;border:2px solid #ffc200;cursor:pointer;font-size:1em;";
    
    buttonsRow.appendChild(importConfirm);
    buttonsRow.appendChild(importCancel);
    modal.appendChild(buttonsRow);

    // --- Import logic ---
    importConfirm.onclick = () => {
	    let data = textarea.value.trim();
	    if (!data) return;
	    let parsed;
	    try {
	        parsed = JSON.parse(data);
	    } catch {
	        label.textContent = "Invalid JSON! Please check your export text.";
	        label.style.color = "red";
	        return;
	    } 
	    for (let [key, val] of Object.entries(parsed)) {
	        localStorage.setItem(key, val);
	    }
	    document.body.removeChild(overlay);
	    setTimeout(() => {
	        if (typeof sheetcontainer !== "undefined") {
	            refreshSheet();
	        }
	        showSheetNotice("Character imported! Your sheet should now be updated.");
	    }, 100);
	};


    importCancel.onclick = () => {
        document.body.removeChild(overlay);
    };

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    textarea.focus();
};

const clearBtn = document.createElement("button");
	clearBtn.textContent = "Clear Sheet";
	clearBtn.classList.add("vk-danger-button");
	clearBtn.style.background = "#e94f4f";
	clearBtn.style.color = "#fff";
	clearBtn.style.margin = "0 10px";
	clearBtn.style.padding = "7px 14px";
	clearBtn.style.border = "none";
	clearBtn.style.borderRadius = "6px";
	clearBtn.style.fontWeight = "bold";
	clearBtn.style.cursor = "pointer";
	
	clearBtn.onclick = () => {
    showConfirm(
        "Are you sure you want to clear this character sheet? This cannot be undone.",
        () => {
	
	    // List ALL relevant storage keys for your sheet!
		    const keysToClear = [
		        "falloutRPGCharacterSheet",       // main char info
		        "fallout_weapon_table",
		        "fallout_ammo_table",
		        "fallout_gear_table",
		        "fallout_perk_table",
		        "fallout_armor_data_Head",
		        "fallout_armor_data_Torso",
		        "fallout_armor_data_Left Arm",
		        "fallout_armor_data_Right Arm",
		        "fallout_armor_data_Left Leg",
		        "fallout_armor_data_Right Leg",
		        "fallout_armor_data_Outfit",
		        "fallout_power_armor_data_Helmet",
		        "fallout_power_armor_data_Torso",
		        "fallout_power_armor_data_Left Arm",
		        "fallout_power_armor_data_Right Arm",
		        "fallout_power_armor_data_Left Leg",
		        "fallout_power_armor_data_Right Leg",
		        "fallout_power_armor_data_Frame",
		        "fallout_poison_dr",
		        "fallout_Caps",
		        "fallout_terminal_notes",
		        "fallout_injury_data",
		        "fallout_active_effects"
		    ];
		    keysToClear.forEach(key => localStorage.removeItem(key));
		
		    // --- REFRESH ALL UI SECTIONS ---
	            keysToClear.forEach(key => localStorage.removeItem(key));
	            refreshSheet();
	            showSheetNotice("Character sheet cleared!");
	        },
	        () => { /* Do nothing on cancel */ }
	    );
	};
	const exportimportRow = document.createElement("div");
		exportimportRow.style.display = "flex";
	    exportimportRow.style.gridTemplateColumns = "1fr 1fr";
	    exportimportRow.style.gap = "8px";
	    exportimportRow.style.width = "auto"
	    exportimportRow.style.flexWrap = "wrap"
    
    exportimportRow.appendChild(exportBtn);
    exportimportRow.appendChild(importBtn);
    
    
    bar.appendChild(exportimportRow);
    bar.appendChild(clearBtn);
    return bar;
}

const oldSheet = document.getElementById("fallout-sheet-root");
if (oldSheet) { oldSheet._disposeWeaponView?.(); oldSheet._disposeApparelView?.(); oldSheet._disposeSpecialEffects?.(); oldSheet.remove(); }

 
const sheetcontainer = document.createElement("div");
sheetcontainer.id = "fallout-sheet-root";

// ============================================================================
// VAULT-KIT UI SYSTEM
// Styles are scoped to #fallout-sheet-root and the <style> element lives inside
// the rendered sheet. Removing/re-rendering the sheet removes the styles too.
// ============================================================================
function installVaultKitTheme() {
    // Presentation lives in the dedicated scoped Vault-Kit stylesheet.
    // This no-op remains so the render pipeline does not change behavior.
}

function renderVaultKitMasthead() {
    let data = {};
    try { data = JSON.parse(localStorage.getItem("falloutRPGCharacterSheet") || "{}"); } catch {}

    const mast = document.createElement("div");
    mast.className = "vk-masthead";

    const left = document.createElement("div");
    const kicker = document.createElement("div");
    kicker.className = "vk-kicker";
    kicker.textContent = "VAULT-KIT // PERSONAL DATA";

    const name = document.createElement("div");
    name.className = "vk-character-name";
    name.textContent = String(data.Name || "Character Dossier");

    const subtitle = document.createElement("div");
    subtitle.className = "vk-character-subtitle";
    const origin = String(data.Origin || "").trim();
    subtitle.textContent = origin ? origin : "Fallout 2d20 Character Record";

    left.append(kicker, name, subtitle);

    const level = document.createElement("div");
    level.className = "vk-level-badge";
    level.textContent = `Level ${String(data.Level || "—")}`;

    mast.append(left, level);
    return mast;
}


// Equipment Workbench 6.18: shared theme, on-demand naming, and compact change review.
// Workbench crafting requirements. Complexity is independent for every new mod.
const VK_CRAFT_MATERIALS = {1:[2,0,0],2:[3,0,0],3:[4,2,0],4:[5,3,0],5:[6,4,2],6:[7,5,3]};
const VK_MATERIAL_NAMES = ["Common Material", "Uncommon Material", "Rare Material"];
function vkComplexity(value) {
  const raw = String(value ?? "").trim();
  if (/^\d+$/.test(raw)) return Number(raw);
  // Wiki-link alias is the visible complexity, e.g. [[Crafting Complexity|5]].
  const alias = raw.match(/\[\[[^\]]+\|(\d+)\]\]/);
  if (alias) return Number(alias[1]);
  const heading = raw.match(/Crafting Complexity#(?:\^)?(\d+)/i);
  return heading ? Number(heading[1]) : null;
}
function vkHasNoComplexity(value) {
  return /^(?:|—|-|none|null|n\/a)$/i.test(String(value ?? "").trim());
}
function vkMaterialCost(value) {
  // Missing complexity means this modification has no material cost.
  // A supplied but unreadable complexity remains unresolved.
  if (vkHasNoComplexity(value)) return [0,0,0];
  const n = vkComplexity(value);
  if (n === 0) return [0,0,0];
  if (n === null || n < 0) return null;
  return VK_CRAFT_MATERIALS[Math.min(n,7)] || [8,6,4];
}
function vkModIdentity(mod) {
  return String(mod?.id || mod?.basename || "").replace(/\\/g,"/").split("/").pop().replace(/\.md$/i,"").toLowerCase();
}
function vkNewCraftMods(before, after) {
  const originals = Array.isArray(before) ? before : [];
  return (Array.isArray(after) ? after : []).filter(mod => !originals.some(old =>
    (old.id && mod.id ? old.id === mod.id : old.type === mod.type && vkModIdentity(old) === vkModIdentity(mod))));
}
function vkInventoryMaterialRow(row, materialName) {
  const path = String(row.sourcePath || "").replace(/\\/g,"/");
  const key = String(row.yamlName || "").trim();
  return (key === materialName && (!path || path.endsWith("/" + materialName + ".md"))) ||
    path.endsWith("/" + materialName + ".md") ||
    (!path && String(row.name || "").replace(/^\[\[|\]\]$/g,"") === materialName);
}
function vkMaterialInventory(rows) {
  return VK_MATERIAL_NAMES.map(name => rows.reduce((sum,row) => sum + (vkInventoryMaterialRow(row,name) ? Math.max(0,Number(row.qty)||0) : 0),0));
}
function vkSpendMaterials(rows, costs) {
  const copy = structuredClone(rows);
  if (vkMaterialInventory(copy).some((count,i) => count < costs[i])) return null;
  VK_MATERIAL_NAMES.forEach((name,i) => {
    let remaining = costs[i];
    for (const row of copy) {
      if (!remaining) break;
      if (!vkInventoryMaterialRow(row,name)) continue;
      const available = Math.max(0,Number(row.qty)||0);
      const spent = Math.min(available,remaining);
      row.qty = String(available-spent);
      remaining -= spent;
    }
  });
  return copy;
}
let openVaultKitWorkbench = null;

function openEquipmentWorkbench({ item, kind = "weapon", title = "Equipment", saveItem = null, inventoryWeapon = false } = {}) {
  if (!item || typeof item !== "object") return;
  // The workbench belongs to the Markdown pane containing the sheet, rather
  // than being an app-wide Obsidian Modal. Reuse one workbench at a time.
  openVaultKitWorkbench?.forceClose();
  const draft = structuredClone(item);
  const originalName = normalizeInstanceName(item.instanceName || "");
  let dirty = false;
  let modsDirty = false;
  const isApparel = kind === "armor" || kind === "powerArmor";
  const isPowerArmor = kind === "powerArmor";
  const canEditMods = isApparel || (kind === "weapon" && (inventoryWeapon || getPreparedWeapons().some(w => String(w.instanceId) === String(item.instanceId) && !!item.instanceId)));
  const originalAddons = structuredClone(Array.isArray(item.addons) ? item.addons : []);
  const markdownOwner = new obsidian.Component();
  markdownOwner.load();
  let closed = false;
  // Each rendered region owns a child Component; dispose it before replacing
  // dynamic content so Obsidian previews and Markdown processors are cleaned up.
  const markdownRegions = new Map();
  const clearWorkbenchMarkdown = container => {
    for (const [target, state] of markdownRegions) {
      if (target === container || container.contains(target)) {
        markdownRegions.delete(target);
        markdownOwner.removeChild(state.owner);
      }
    }
  };
  const renderWorkbenchMarkdown = (target, value, sourcePath = item.sourcePath || "", block = false) => {
    clearWorkbenchMarkdown(target);
    const markdown = String(value ?? "");
    target.textContent = markdown;
    target.classList.add("vk-workbench-markdown");
    target.classList.toggle("vk-workbench-inline-markdown", !block);
    target.dataset.vkSourcePath = sourcePath;
    // Plain scalar values do not need a Markdown renderer.
    if (!block && !/\[\[|\*|`|\[[^\]]+\]\(/.test(markdown)) return;
    const owner = markdownOwner.addChild(new obsidian.Component());
    const state = { owner };
    markdownRegions.set(target, state);
    // Render off-DOM, then commit only the current version of this region.
    // Fast selector changes must not restore stale values or links.
    const rendered = document.createElement("div");
    Promise.resolve().then(() => {
      if (closed || markdownRegions.get(target) !== state) return;
      return renderMarkdownInto(rendered, markdown, sourcePath, owner);
    }).then(() => {
      if (closed || markdownRegions.get(target) !== state) return;
      target.replaceChildren(...rendered.childNodes);
    }).catch(err => {
      console.warn("Vault-Kit: workbench Markdown render failed", err);
      if (!closed && markdownRegions.get(target) === state) target.textContent = markdown;
    });
  };
  const plainWorkbenchLabel = value => String(value ?? "").replace(/\[\[([^\]]+)\]\]/g,
    (_, inner) => inner.split("|").pop());
  let confirmOpen = false;
  let confirmation = null;
  let dismiss = () => {};

  // Prefer the view-content area: it is the visible character-sheet pane and
  // doesn't scroll with the much taller contents of the Markdown document.
  const paneHost = sheetcontainer.closest(".view-content") ||
    sheetcontainer.closest(".workspace-leaf-content") || sheetcontainer.parentElement;
  if (!paneHost) { markdownOwner.unload(); return; }
  const oldInlinePosition = paneHost.style.position;
  const changedHostPosition = getComputedStyle(paneHost).position === "static";
  if (changedHostPosition) paneHost.style.position = "relative";
  paneHost.classList.add("vk-workbench-pane-host");
  const overlay = document.createElement("div");
  overlay.className = "vk-workbench-pane-overlay";
  overlay.setAttribute("role", "presentation");
  // The pane overlay is a sibling of the sheet root, so it cannot inherit
  // root-scoped custom properties directly. Bridge the existing theme tokens.
  const themeSource = sheetcontainer.closest("#fallout-sheet-root") || sheetcontainer;
  const syncWorkbenchTheme = () => {
    const theme = getComputedStyle(themeSource);
    // Reuse the sheet's actual backdrop and font, including theme/snippet overrides.
    overlay.style.setProperty("--vk-sheet-background", theme.backgroundImage !== "none" ? theme.backgroundImage : "linear-gradient(180deg, var(--vk-bg-soft), var(--vk-bg))");
    overlay.style.setProperty("--vk-font-family-body", theme.fontFamily);
    for (const property of theme) {
      if (property.startsWith("--vk-")) overlay.style.setProperty(property, theme.getPropertyValue(property));
    }
  };
  syncWorkbenchTheme();
  const themeObserver = new MutationObserver(syncWorkbenchTheme);
  themeObserver.observe(themeSource, { attributes: true, attributeFilter: ["style", "class"] });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });
  paneHost.appendChild(overlay);

  // A hover-link event needs a HoverParent, not a DOM node. Using the view
  // when possible keeps page previews associated with the correct pane.
  const viewLeaf = app.workspace.getLeavesOfType("markdown")
    .find(leaf => leaf.containerEl?.contains(sheetcontainer));
  const hoverParent = viewLeaf?.view || { hoverPopover: null };
  const closeConfirmation = () => {
    if (!confirmation) return;
    confirmation.remove();
    confirmation = null;
    confirmOpen = false;
    if (!closed) panel.focus({ preventScroll: true });
  };
  const workbench = {
    forceClose() {
      if (closed) return;
      closed = true;
      closeConfirmation();
      themeObserver.disconnect();
      markdownOwner.unload();
      markdownRegions.clear();
      // Do not hide another view's hover popover when a shared view owns it.
      if (hoverParent !== viewLeaf?.view) hoverParent.hoverPopover?.hide?.();
      overlay.remove();
      document.removeEventListener("keydown", onWorkbenchKeyDown, true);
      paneHost.classList.remove("vk-workbench-pane-host");
      if (changedHostPosition) paneHost.style.position = oldInlinePosition;
      if (openVaultKitWorkbench === workbench) openVaultKitWorkbench = null;
    }
  };
  openVaultKitWorkbench = workbench;
  const panel = document.createElement("section");
  panel.className = "vk-workbench vk-modal" + (isApparel ? " is-apparel" : "");
  // 6.16: keep the header/footer outside the scrolling content area.
  const body = document.createElement("div");
  body.className = "vk-workbench-body";
  const layout = document.createElement("div");
  layout.className = "vk-workbench-layout";
  const editColumn = document.createElement("div");
  editColumn.className = "vk-workbench-edit-column";
  const reviewColumn = document.createElement("div");
  reviewColumn.className = "vk-workbench-review-column";
  layout.append(editColumn, reviewColumn);
  const header = document.createElement("div");
  header.className = "vk-workbench-header";
  const heading = document.createElement("div");
  heading.className = "vk-workbench-heading";
  const kicker = document.createElement("div");
  kicker.textContent = "VAULT-KIT // EQUIPMENT WORKBENCH";
  kicker.className = "vk-workbench-kicker";
  // Markdown-rendered headings use the sheet's shared renderer rather than a
  // hand-built anchor with its own click/hover handlers.
  const name = document.createElement("div");
  name.className = "vk-workbench-title";
  name.setAttribute("role", "heading");
  name.setAttribute("aria-level", "3");
  const sourceLabel = String(item.yamlName || item.name || item.link || item.apparel || title).replace(/\[\[|\]\]/g, "").split("|").pop();
  const initialName = kind === "weapon" ? vkWeaponDisplayName(item) : String(item.instanceName || item.yamlName || item.name || item.link || item.apparel || title).replace(/\[\[|\]\]/g, "");
  const sourceTarget = noteTargetFromSource({
    sourcePath: item.sourcePath || "",
    yamlName: item.yamlName || "",
    rawLink: item.link || item.name || item.apparel || "",
    fallbackName: sourceLabel
  });
  const setWorkbenchHeading = value => {
    const visibleName = String(value ?? "").trim() || sourceLabel;
    if (!sourceTarget) { name.textContent = visibleName; return; }
    const alias = visibleName.replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\]/g, "\\]");
    renderWorkbenchMarkdown(name, `[[${sourceTarget}|${alias}]]`);
    name.classList.add("vk-workbench-source-heading");
  };
  const workbenchLink = event => {
    const link = event.target?.closest?.("a.internal-link");
    if (!link || !panel.contains(link)) return null;
    const linktext = link.getAttribute("data-href") || link.getAttribute("href");
    if (!linktext) return null;
    const sourcePath = link.closest("[data-vk-source-path]")?.dataset.vkSourcePath ||
      item.sourcePath || app.workspace.getActiveFile()?.path || "";
    return { link, linktext, sourcePath };
  };
  panel.addEventListener("mouseover", event => {
    if (closed) return;
    const field = event.target?.closest?.("select[data-vk-hover-target]");
    const result = field && panel.contains(field)
      ? { link: field, linktext: field.dataset.vkHoverTarget,
          sourcePath: field.dataset.vkSourcePath || item.sourcePath || "" }
      : workbenchLink(event);
    if (!result) return;
    if (result.link.contains(event.relatedTarget)) return;
    app.workspace.trigger("hover-link", {
      event, source: "preview", hoverParent, targetEl: result.link,
      linktext: result.linktext, sourcePath: result.sourcePath
    });
  });
  panel.addEventListener("click", event => {
    if (closed) return;
    const result = workbenchLink(event);
    if (!result) return;
    event.preventDefault(); event.stopPropagation();
    const newLeaf = obsidian.Keymap?.isModEvent?.(event) || false;
    dismiss(() => app.workspace.openLinkText(result.linktext, result.sourcePath, newLeaf));
  });
  setWorkbenchHeading(initialName);
  const titleRow = document.createElement("div");
  titleRow.className = "vk-workbench-title-row";
  const rename = document.createElement("button");
  rename.type = "button";
  rename.textContent = "Rename";
  rename.className = "vk-workbench-rename";
  rename.setAttribute("aria-expanded", "false");
  titleRow.append(name, rename);
  heading.append(kicker, titleRow);
  const close = document.createElement("button");
  styleEquipmentActionIcon(close,"close");
  close.type = "button";
  close.setAttribute("aria-label", "Close equipment workbench");
  close.title = "Close workbench (Escape)";
  close.className = "vk-workbench-close";
  styleEquipmentActionIcon(close,"close");
  const removeOverlay = () => workbench.forceClose();
  dismiss = (afterClose = null) => {
    if (closed || confirmOpen) return;
    if (!(dirty || modsDirty)) {
      removeOverlay();
      if (typeof afterClose === "function") afterClose();
      return;
    }
    confirmOpen = true;
    confirmation = document.createElement("div");
    confirmation.className = "vk-workbench-confirm-overlay";
    confirmation.setAttribute("role", "presentation");
    const dialog = document.createElement("div");
    dialog.className = "vk-workbench-confirm-panel vk-modal";
    dialog.setAttribute("role", "alertdialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-label", "Discard workbench changes?");
    const question = document.createElement("p");
    question.textContent = "Discard unapplied workbench changes?";
    const buttons = document.createElement("div");
    buttons.className = "vk-workbench-confirm-actions";
    const keep = document.createElement("button");
    keep.textContent = "Keep editing";
    keep.onclick = closeConfirmation;
    const discard = document.createElement("button");
    discard.textContent = "Discard changes";
    discard.className = "vk-workbench-discard-button";
    discard.onclick = () => {
      closeConfirmation();
      removeOverlay();
      if (typeof afterClose === "function") afterClose();
    };
    buttons.append(keep, discard);
    dialog.append(question, buttons);
    confirmation.appendChild(dialog);
    confirmation.addEventListener("pointerdown", e => { if (e.target === confirmation) closeConfirmation(); });
    overlay.appendChild(confirmation);
    keep.focus({ preventScroll: true });
  };
  // Capturing is intentional: Obsidian normally handles Escape for native
  // dialogs, but this panel must only close inside its own Markdown pane.
  const onWorkbenchKeyDown = event => {
    if (event.key !== "Escape" || closed) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.repeat) return;
    if (confirmOpen) closeConfirmation();
    else dismiss();
  };
  document.addEventListener("keydown", onWorkbenchKeyDown, true);
  overlay.addEventListener("pointerdown", event => {
    if (event.target === overlay) dismiss();
  });
  close.onclick = dismiss;
  header.append(heading, close);
  panel.appendChild(header);
  const info = document.createElement("p");
  info.className = "vk-workbench-intro";
  info.textContent = canEditMods
    ? "Select modifications, review changes and crafting costs, then Apply."
    : `Preview your equipment name here. ${kind === "weapon" ? "Weapon" : "Apparel"} modifications use the sheet’s existing controls.`;
  body.appendChild(info);
  const nameEditor = document.createElement("div");
  nameEditor.className = "vk-workbench-section vk-workbench-name-editor";
  nameEditor.hidden = true;
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Custom equipment name";
  nameLabel.className = "vk-workbench-field-label";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = originalName;
  nameInput.placeholder = "Use generated equipment name";
  nameInput.className = "vk-workbench-name-input";
  // Wrap the input below so the name field is labelled without global IDs.
  // Stop Obsidian's editor handlers without cancelling the browser's
  // native focus behavior. preventDefault on pointerdown blocks text focus.
  nameInput.addEventListener("pointerdown", e => e.stopPropagation());
  nameInput.addEventListener("mousedown", e => e.stopPropagation());
  nameInput.addEventListener("click", e => e.stopPropagation());
  const baseLabel = String(item.yamlName || item.name || item.link || item.apparel || title).replace(/\[\[|\]\]/g, "");
  const nameInputRow = document.createElement("div");
  nameInputRow.className = "vk-workbench-name-row";
  nameLabel.appendChild(nameInput);
  nameInputRow.appendChild(nameLabel);
  nameEditor.appendChild(nameInputRow);
  body.appendChild(nameEditor);
  const setNameEditorOpen = open => {
    nameEditor.hidden = !open;
    rename.setAttribute("aria-expanded", String(open));
    if (open) {
      nameInput.focus({ preventScroll: true });
      nameInput.select();
      nameEditor.scrollIntoView({ block: "nearest" });
    } else rename.focus({ preventScroll: true });
  };
  rename.onclick = () => setNameEditorOpen(nameEditor.hidden);
  nameInput.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    event.preventDefault(); event.stopPropagation();
    setNameEditorOpen(false);
  });
  const actions = document.createElement("div");
  actions.className = "vk-workbench-actions";
  const clearName = document.createElement("button");
  clearName.textContent = "Reset name";
  clearName.type = "button";
  clearName.title = "Use the generated equipment name";
  const doneName = document.createElement("button");
  doneName.type = "button";
  doneName.textContent = "Done";
  doneName.onclick = () => setNameEditorOpen(false);
  const apply = document.createElement("button");
  apply.textContent = "Apply changes";
  apply.type = "button";
  apply.className = "vk-workbench-apply";
  const changeStatus = document.createElement("span");
  changeStatus.className = "vk-workbench-change-status";
  changeStatus.setAttribute("role", "status");
  const syncChangeStatus = () => {
    changeStatus.textContent = dirty || modsDirty ? "Unapplied changes" : "No changes staged";
    changeStatus.classList.toggle("is-changed", dirty || modsDirty);
    apply.disabled = typeof saveItem !== "function" || !(dirty || modsDirty);
    apply.title = typeof saveItem !== "function" ? "This item cannot be saved from the workbench yet" : "";
  };
  apply.onclick = async () => {
    if (typeof saveItem !== "function") {
      showSheetNotice("This item cannot be saved from the workbench yet.");
      return;
    }
    if (!dirty && !modsDirty) { removeOverlay(); return; }
    if (canEditMods) draft.generatedName = generatedName();
    if (canEditMods && consumeBox.checked) {
      if (!craftingResolvable) { showSheetNotice("Cannot consume materials: a new modification has unresolved complexity."); return; }
      const costs = craftingCost.slice();
      const result = inventoryWeapon || isApparel ? await saveItem(draft, costs) : saveWorkbenchTableItem("fallout_weapon_table", item, draft, costs);
      if (result === false) { showSheetNotice("Insufficient crafting materials or equipment changed. No changes applied."); return; }
      dirty = false; modsDirty = false; removeOverlay();
      if (typeof refreshSheet === "function") refreshSheet();
      return;
    }
    const result = await saveItem(draft);
    if (result === false) { showSheetNotice("Equipment changed while editing. Reopen the workbench."); return; }
    dirty = false;
    removeOverlay();
    if (typeof refreshSheet === "function") refreshSheet();
  };
  nameInputRow.append(clearName, doneName);
  actions.append(apply);
  // One authoritative stat display: the cards update with staged values.
  const stats = document.createElement("div");
  stats.className = "vk-workbench-stats";
  const statSection = document.createElement("section");
  statSection.className = "vk-workbench-section vk-workbench-stat-section";
  const statTitle = document.createElement("h4");
  statTitle.className = "vk-workbench-section-title";
  statTitle.textContent = "Stat preview";
  const statHint = document.createElement("p");
  statHint.className = "vk-workbench-hint";
  statHint.textContent = "Changed values show their previous value.";
  statSection.append(statTitle, statHint, stats);
  const statKeys = kind === "weapon"
    ? [["DMG","damage"], ["Rate","rate"], ["Range","range"], ["Weight","weight"], ["Cost","cost"], ["Ammo","ammo"], ["Qualities","qualities"], ["Damage effects","damage_effects"]]
    : [["Physical DR","physdr"], ["Energy DR","endr"], ["Radiation DR","raddr"], ...(isPowerArmor ? [["Maximum HP","maxHp"]] : []), ["Weight","weight"], ["Cost","value"]];
  const renderStats = () => {
    clearWorkbenchMarkdown(stats);
    stats.replaceChildren();
    statKeys.forEach(([label,key]) => {
      const oldValue = item[key], newValue = draft[key];
      if ((oldValue == null || oldValue === "") && (newValue == null || newValue === "")) return;
      const changed = String(oldValue ?? "") !== String(newValue ?? "");
      const box = document.createElement("div");
      box.className = "vk-workbench-stat" + (changed ? " is-changed" : "");
      box.dataset.statKey = key;
      if (key === "ammo" || key === "qualities" || key === "damage_effects") box.classList.add("is-wide");
      const small = document.createElement("div");
      small.textContent = label; small.className = "vk-workbench-stat-label";
      const big = document.createElement("div");
      big.className = "vk-workbench-stat-value";
      renderWorkbenchMarkdown(big, String(newValue ?? "").trim() ? newValue : "None");
      box.append(small,big);
      if (changed) {
        const prior = document.createElement("div");
        prior.className = "vk-workbench-stat-prior";
        renderWorkbenchMarkdown(prior, `Was: ${String(oldValue ?? "").trim() ? oldValue : "None"}`);
        const difference = document.createElement("div");
        difference.className = "vk-workbench-stat-difference";
        // Compare scalar values and combat dice; categorical changes stay textual.
        const oldNumber = Number(oldValue), newNumber = Number(newValue);
        const numeric = key !== "ammo" && String(oldValue ?? "").trim() !== "" && String(newValue ?? "").trim() !== "" && Number.isFinite(oldNumber) && Number.isFinite(newNumber);
        const oldDice = String(oldValue ?? "").trim().match(/^(-?\d+(?:\.\d+)?)\s*d6$/i);
        const newDice = String(newValue ?? "").trim().match(/^(-?\d+(?:\.\d+)?)\s*d6$/i);
        const delta = key === "ammo" ? null : numeric ? newNumber - oldNumber : oldDice && newDice ? Number(newDice[1]) - Number(oldDice[1]) : null;
        difference.textContent = delta == null || delta === 0 ? "Changed" : `${delta > 0 ? "+" : ""}${Math.round(delta * 100) / 100}${!numeric && oldDice && newDice ? " D6" : ""}`;
        box.append(prior,difference);
      }
      stats.appendChild(box);
    });
  };
  reviewColumn.appendChild(statSection);
  renderStats();
  // Name lookup must exist before rendering already-installed addons.
  // Previously this was declared inside the editing controls after renderInstalled(),
  // causing a ReferenceError for weapons that already had modifications.
  const knownModNames = new Map();
  const displayMod = mod => mod.displayName || mod.basename || mod.name || mod.id || "Modification";
  const normalized = value => String(value || "").trim().toLowerCase();
  const modStem = mod => String(mod?.basename || mod?.id?.split("/").pop() || "").replace(/\.md$/i,"");
  const knownDefinitions = new Map();
  const findDefinition = mod => knownDefinitions.get(mod.id) ||
    (!String(mod.id || "").includes("/") ? [...knownDefinitions.values()].find(def => normalized(modStem(def)) === normalized(modStem(mod)) && def.type === mod.type) : null);
  const labelFor = mod => findDefinition(mod)?.displayName || knownModNames.get(mod.id) || displayMod(mod);
  let allowedSlots = [];
  let namingRules = [];
  const baseWeaponLabel = baseLabel;
  const generatedName = () => {
    if (isApparel) {
      const prefixes = (draft.addons || []).filter(mod => mod.type === "legendary").map(mod => {
        const def = findDefinition(mod) || mod;
        return String(def.namePrefix || def.displayName || def.basename || "").trim();
      }).filter(Boolean);
      return [...prefixes,baseWeaponLabel].join(" ");
    }
    if (kind !== "weapon") return baseWeaponLabel;
    const addons = Array.isArray(draft.addons) ? draft.addons : [];
    const legends = addons.filter(a => a.type === "legendary");
    const standards = addons.filter(a => a.type !== "legendary");
    const slotIndex = mod => {
      const stem = normalized(modStem(mod));
      const index = allowedSlots.findIndex(a => normalized(a.target) === stem);
      return index < 0 ? Number.MAX_SAFE_INTEGER : allowedSlots[index].group;
    };
    standards.sort((a,b) => slotIndex(a)-slotIndex(b));
    const prefix = [...legends,...standards].map(a => {
      const definition = findDefinition(a);
      return String(definition?.namePrefix || a.namePrefix || "").trim();
    }).filter(Boolean);
    return [...prefix,applyWeaponNamingRules(baseWeaponLabel,namingRules,addons,allowedSlots)].join(" ");
  };
  const refreshNamePreview = () => {
    const custom = normalizeInstanceName(nameInput.value);
    const result = custom || generatedName();
    setWorkbenchHeading(result);
    syncChangeStatus();
  };
  nameInput.addEventListener("input", () => {
    const custom = normalizeInstanceName(nameInput.value);
    if (custom) draft.instanceName = custom; else delete draft.instanceName;
    dirty = custom !== originalName;
    refreshNamePreview();
  });
  clearName.onclick = () => {
    nameInput.value = "";
    nameInput.dispatchEvent(new Event("input"));
  };
  const mods = document.createElement("section");
  mods.className = "vk-workbench-section";
  const modTitle = document.createElement("h4");
  modTitle.textContent = "Installed modifications"; modTitle.className = "vk-workbench-section-title";
  mods.appendChild(modTitle);
  const installed = document.createElement("div");
  mods.appendChild(installed);
  const renderInstalled = () => {
    clearWorkbenchMarkdown(installed);
    installed.replaceChildren();
    if (!(draft.addons || []).length) { installed.textContent = "None"; return; }
    (draft.addons || []).forEach(mod => {
      const line = document.createElement("div");
      line.className = "vk-workbench-installed-mod";
      renderWorkbenchMarkdown(line, labelFor(mod), findDefinition(mod)?.id || item.sourcePath || "");
      installed.appendChild(line);
    });
  };
  renderInstalled();
  // Installed modifications are reflected in the selectors; retain this summary for read-only apparel.
  if (!canEditMods) editColumn.appendChild(mods);
  let craftingCost = [0,0,0];
  let craftingResolvable = true;
  const crafting = document.createElement("section");
  crafting.className = "vk-workbench-section vk-workbench-crafting";
  const craftingTitle = document.createElement("h4");
  craftingTitle.textContent = "Crafting requirements";
  craftingTitle.className = "vk-workbench-section-title";
  const craftingDetails = document.createElement("div");
  craftingDetails.className = "vk-workbench-craft-list";
  const craftingTotal = document.createElement("div");
  craftingTotal.className = "vk-workbench-materials";
  const consumeLabel = document.createElement("label");
  consumeLabel.className = "vk-workbench-consume";
  const consumeBox = document.createElement("input");
  consumeBox.type = "checkbox";
  ["pointerdown","mousedown","click"].forEach(t => consumeBox.addEventListener(t,e=>e.stopPropagation()));
  const consumeText = document.createElement("span");
  consumeText.textContent = "Consume crafting materials on Apply";
  consumeLabel.append(consumeBox,consumeText);
  const inventoryStatus = document.createElement("div");
  inventoryStatus.className = "vk-workbench-hint";
  inventoryStatus.setAttribute("role", "status");
  crafting.append(craftingTitle,craftingTotal,consumeLabel,inventoryStatus,craftingDetails);
  crafting.hidden = true;
  // Crafting summary follows the selectors, so costs are reviewed after choosing mods.
  const showCrafting = () => {
    if (!canEditMods) return;
    const expanded = new Set([...craftingDetails.querySelectorAll("details[open]")].map(detail => detail.dataset.modId));
    clearWorkbenchMarkdown(craftingDetails);
    craftingDetails.replaceChildren();
    craftingCost = [0,0,0];
    craftingResolvable = true;
    const newlyAdded = vkNewCraftMods(originalAddons,draft.addons);
    crafting.hidden = newlyAdded.length === 0;
    newlyAdded.forEach(mod => {
      const def = findDefinition(mod) || mod;
      const cost = vkMaterialCost(def.complexity);
      if (!cost) craftingResolvable = false;
      else cost.forEach((qty,i) => craftingCost[i] += qty);
      const block = document.createElement("details");
      block.className = "vk-workbench-craft-mod";
      block.dataset.modId = String(mod.id || vkModIdentity(mod));
      block.open = expanded.has(block.dataset.modId);
      const title = document.createElement("summary");
      title.className = "vk-workbench-craft-mod-title";
      Promise.resolve(renderWorkbenchMarkdown(title, labelFor(mod), def.id || item.sourcePath || "")).then(()=>vkDisclosureIcon(title));
      const requirements = document.createElement("div");
      const clean = v => { const x=String(v||"").trim(); return x && x !== "-" ? x : "None"; };
      requirements.className = "vk-workbench-craft-requirements";
      const complexityLabel = vkHasNoComplexity(def.complexity) ? "Not required" : String(def.complexity);
      renderWorkbenchMarkdown(requirements, `Complexity: ${complexityLabel} · Skill: ${clean(def.skill)} · Perks: ${clean(def.perks)} · Rarity: ${clean(def.rarity)}`, def.id || item.sourcePath || "");
      const materials = document.createElement("div");
      materials.className = "vk-workbench-craft-materials";
      materials.textContent = cost
        ? cost.every(qty => qty === 0) ? "Materials: None required" : `Materials: ${cost[0]} Common, ${cost[1]} Uncommon, ${cost[2]} Rare`
        : "Materials: unknown (consumption unavailable)";
      block.append(title,requirements,materials); craftingDetails.appendChild(block);
    });
    craftingTotal.replaceChildren();
    let rows = [];
    try { rows = JSON.parse(localStorage.getItem("fallout_gear_table") || "[]"); } catch (_) {}
    const owned = vkMaterialInventory(rows);
    ["Common", "Uncommon", "Rare"].forEach((label, i) => {
      const cell = document.createElement("div");
      cell.className = "vk-workbench-material";
      const shortage = owned[i] < craftingCost[i];
      cell.classList.toggle("is-short", shortage);
      const name = document.createElement("span"); name.textContent = label;
      const required = document.createElement("strong"); required.textContent = craftingResolvable ? String(craftingCost[i]) : `${craftingCost[i]}+`;
      const available = document.createElement("small"); available.textContent = `${owned[i]} owned${shortage ? " · short " + (craftingCost[i] - owned[i]) : ""}`;
      cell.append(name, required, available); craftingTotal.appendChild(cell);
    });
    inventoryStatus.textContent = !craftingResolvable
      ? "Complexity unresolved: totals are incomplete and material consumption is unavailable."
      : owned.some((qty, i) => qty < craftingCost[i])
        ? "Not enough materials to consume on Apply."
        : newlyAdded.length ? "Materials available. Only new modifications are counted." : "Only new modifications require materials.";
    inventoryStatus.classList.toggle("is-warning", !craftingResolvable || owned.some((qty, i) => qty < craftingCost[i]));
  };
  const specialDetails = document.createElement("details");
  specialDetails.className = "vk-workbench-section vk-workbench-effects";
  const specialSummary = document.createElement("summary"); specialSummary.textContent = "Special";vkDisclosureIcon(specialSummary);
  const specialContent = document.createElement("div");specialDetails.append(specialSummary,specialContent);
  let specialRenderVersion = 0;
  const renderSpecial = async () => {
    const version = ++specialRenderVersion;
    clearWorkbenchMarkdown(specialContent);specialContent.replaceChildren();
    const sources = isApparel
      ? [{label:baseWeaponLabel,text:item.gameEffects,id:item.sourcePath}]
      : await loadWeaponSpecialSources({...item,addons:draft.addons});
    if (closed || version !== specialRenderVersion) return;
    if (isApparel) (draft.addons || []).forEach(mod => {
      const def = findDefinition(mod) || mod;
      sources.push({label:labelFor(mod),text:def.gameEffects,id:def.id});
    });
    const nonempty = sources.filter(source => hasCombatDisplayValue(source.text));
    specialDetails.hidden = nonempty.length === 0;
    nonempty.forEach(source => {
      const region = document.createElement("div");region.className="vk-workbench-special-source";
      {
        const label = document.createElement("div");label.className="vk-workbench-special-title";
        renderWorkbenchMarkdown(label,source.label,source.id || item.sourcePath || "");region.appendChild(label);
      }
      const text = document.createElement("div");renderWorkbenchMarkdown(text,String(source.text),source.id || item.sourcePath || "",true);
      region.appendChild(text);specialContent.appendChild(region);
    });
  };
  const matchesSlotEntry = (mod,entry) => {
    const target = String(entry.target || "").replace(/\.md$/i, "");
    return target.includes("/") ? normalized(String(mod.id || "").replace(/\.md$/i,"")) === normalized(target)
      : normalized(modStem(mod)) === normalized(target);
  };
  if (canEditMods) {
    const controls = document.createElement("div");
    controls.className = "vk-workbench-section vk-workbench-mod-controls";
    const headingMods = document.createElement("h4");
    headingMods.textContent = isApparel ? "Armor modification slots" : "Weapon modification slots";
    headingMods.className = "vk-workbench-section-title";
    const slotList = document.createElement("div");
    slotList.className = "vk-workbench-slots";
    const legendaryHeading = document.createElement("h4");
    legendaryHeading.textContent = "Legendary modifications";
    legendaryHeading.className = "vk-workbench-section-title vk-workbench-legendary-heading";
    const legendaryList = document.createElement("div");
    legendaryList.className = "vk-workbench-legendary-list";
    const legendSearch = document.createElement("input");
    legendSearch.placeholder = "Search legendary modifications…";
    legendSearch.className = "vk-workbench-legendary-search";
    legendSearch.setAttribute("aria-label", "Search legendary modifications");
    slotList.textContent = "Loading modification slots…";
    ["pointerdown","mousedown","click"].forEach(type => legendSearch.addEventListener(type,e => e.stopPropagation()));
    let available = [];
    const sameMod = (a,b) => a.id && b.id ? a.id === b.id : (normalized(modStem(a)) === normalized(modStem(b)) && a.type === b.type);
    const insertLegendary = mod => {
      draft.addons = Array.isArray(draft.addons) ? draft.addons : [];
      if (draft.addons.some(a => sameMod(a,mod))) return;
      // Restore an original mod in its original relative order. Undoing the last
      // change must return to an unchanged draft, including its addon ordering.
      const originalIndex = originalAddons.findIndex(a => sameMod(a,mod));
      const nextOriginal = originalIndex < 0 ? null : originalAddons.slice(originalIndex + 1)
        .find(old => draft.addons.some(a => sameMod(a,old)));
      const index = nextOriginal ? draft.addons.findIndex(a => sameMod(a,nextOriginal)) : draft.addons.length;
      draft.addons.splice(index, 0, structuredClone(originalIndex < 0 ? mod : originalAddons[originalIndex]));
    };
    const recalculate = () => {
      if (isApparel) recalcArmorFromAddons(draft,isPowerArmor); else recalcWeaponFromAddons(draft);
      modsDirty = JSON.stringify(draft.addons || []) !== JSON.stringify(originalAddons);
      renderStats();
      renderInstalled();
      refreshNamePreview();
      showCrafting();
      renderSpecial();
    };
    const setSlot = (group,id) => {
      const groupEntries = allowedSlots.filter(a => a.group === group);
      draft.addons = (draft.addons || []).filter(a => a.type === "legendary" || !groupEntries.some(entry => matchesSlotEntry(a,entry)));
      if (id) {
        const def = available.find(a => a.id === id);
        if (def) draft.addons.push(structuredClone(def));
      }
      recalculate(); renderSelectors();
    };
    const renderSelectors = () => {
      clearWorkbenchMarkdown(slotList);
      slotList.replaceChildren();
      const groups = [...new Set(allowedSlots.map(a => a.group))];
      groups.forEach(group => {
        const entries = allowedSlots.filter(a => a.group === group);
        const slotName = entries[0]?.slot && entries[0].slot !== "Modification"
          ? entries[0].slot : (groups.length === 1 ? "Modification" : `Modification ${group+1}`);
        const line = document.createElement("div");
        line.className = "vk-workbench-slot";
        const label = document.createElement("label");
        label.className = "vk-workbench-slot-label";
        const slotCaption = document.createElement("span");
        renderWorkbenchMarkdown(slotCaption, slotName);
        label.appendChild(slotCaption);
        const select = document.createElement("select");
        select.className = "vk-workbench-mod-select";
        select.setAttribute("aria-label", plainWorkbenchLabel(slotName));
        const none = document.createElement("option");
        none.value = ""; none.textContent = "None"; select.appendChild(none);
        const seen = new Set();
        entries.forEach(entry => {
          const def = available.find(mod => mod.type !== "legendary" &&
            matchesSlotEntry(mod,entry));
          if (!def) return;
          const key = normalized(displayMod(def));
          if (seen.has(key)) return;
          seen.add(key);
          const option = document.createElement("option");
          option.value = def.id; option.textContent = plainWorkbenchLabel(displayMod(def));
          select.appendChild(option);
        });
        const installedMod = (draft.addons || []).find(a => a.type !== "legendary" &&
          entries.some(e => matchesSlotEntry(a,e)));
        if (installedMod) {
          const matching = [...select.options].find(opt => opt.value &&
            available.some(def => def.id === opt.value && sameMod(def,installedMod)));
          if (matching) select.value = matching.value;
          else {
            const retained = document.createElement("option");
            retained.value = "__retained__";
            retained.textContent = `${plainWorkbenchLabel(labelFor(installedMod))} (installed; source not found)`;
            select.appendChild(retained); select.value = retained.value;
          }
        }
        select.onchange = () => {
          if (select.value === "__retained__") return;
          setSlot(group,select.value);
        };
        const initialMod = originalAddons.find(a => a.type !== "legendary" &&
          entries.some(e => matchesSlotEntry(a,e)));
        const slotChanged = Boolean(installedMod) !== Boolean(initialMod) || (installedMod && initialMod && !sameMod(installedMod, initialMod));
        line.classList.toggle("is-changed", !!slotChanged);
        label.appendChild(select);
        line.appendChild(label);
        if (slotChanged) {
          const prior = document.createElement("div");
          prior.className = "vk-workbench-slot-prior";
          renderWorkbenchMarkdown(prior, `Was: ${initialMod ? labelFor(initialMod) : "None"}`, (initialMod && findDefinition(initialMod)?.id) || item.sourcePath || "");
          line.appendChild(prior);
        }
        if (installedMod) {
          const def = findDefinition(installedMod) || installedMod;
          const link = String(def.link || (String(def.id || "").endsWith(".md") ? `[[${def.id.replace(/\.md$/i, "")}]]` : ""));
          const target = link.match(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/)?.[1];
          // Preview the selected source from the field itself; clicks retain
          // native select behavior and never navigate to the source note.
          const hoverTarget = target || String(labelFor(installedMod)).match(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/)?.[1];
          if (hoverTarget) {
            select.dataset.vkHoverTarget = hoverTarget;
            select.dataset.vkSourcePath = def.id || item.sourcePath || "";
          }
        }
        slotList.appendChild(line);
      });
      if (!groups.length) slotList.textContent = "No standard modification slots found in the source.";
      clearWorkbenchMarkdown(legendaryList);
      legendaryList.replaceChildren();
      const q = normalized(legendSearch.value);
      const seen = new Set();
      const options = available.filter(mod => {
        if (mod.type !== "legendary") return false;
        const key = normalized(displayMod(mod));
        if (seen.has(key)) return false;
        seen.add(key);
        return !q || key.includes(q) || normalized(modStem(mod)).includes(q);
      });
      const picker = document.createElement("select");
      picker.className = "vk-workbench-mod-select";
      picker.setAttribute("aria-label", "Add legendary modification");
      const prompt = document.createElement("option");
      prompt.value = ""; prompt.textContent = "Select legendary modification…";
      picker.appendChild(prompt);
      options.filter(mod => !(draft.addons || []).some(a => sameMod(a,mod))).forEach(mod => {
        const option = document.createElement("option");
        option.value = mod.id; option.textContent = plainWorkbenchLabel(displayMod(mod));
        picker.appendChild(option);
      });
      picker.onchange = () => {
        const mod = available.find(a => a.id === picker.value);
        if (!mod) return;
        insertLegendary(mod);
        recalculate(); renderSelectors();
      };
      picker.disabled = picker.options.length === 1;
      if (picker.disabled) prompt.textContent = q ? "No matching modifications to add" : "No legendary modifications available to add";
      legendaryList.appendChild(picker);
      (draft.addons || []).filter(a => a.type === "legendary").forEach(mod => {
        const row = document.createElement("div");
        row.className = "vk-workbench-legendary-row";
        row.classList.toggle("is-changed", !originalAddons.some(a => sameMod(a,mod)));
        const label = document.createElement("div");
        label.className = "vk-workbench-legendary-label";
        renderWorkbenchMarkdown(label, labelFor(mod), findDefinition(mod)?.id || item.sourcePath || "");
        const remove = document.createElement("button");
        remove.type = "button"; remove.textContent = "Remove";
        remove.setAttribute("aria-label", `Remove ${plainWorkbenchLabel(labelFor(mod))}`);
        remove.onclick = () => {
          draft.addons = (draft.addons || []).filter(a => a !== mod);
          recalculate(); renderSelectors();
        };
        row.append(label,remove); legendaryList.appendChild(row);
      });
      originalAddons.filter(mod => mod.type === "legendary" &&
        !(draft.addons || []).some(a => sameMod(a,mod))).forEach(mod => {
        const row = document.createElement("div");
        row.className = "vk-workbench-legendary-row is-removed";
        const description = document.createElement("div");
        description.className = "vk-workbench-removed-description";
        const label = document.createElement("div");
        label.className = "vk-workbench-legendary-label";
        renderWorkbenchMarkdown(label, labelFor(mod), findDefinition(mod)?.id || item.sourcePath || "");
        const status = document.createElement("span");
        status.className = "vk-workbench-pending-removal";
        status.textContent = "Pending removal";
        const undo = document.createElement("button");
        undo.type = "button"; undo.textContent = "Undo";
        undo.setAttribute("aria-label", `Undo removal of ${plainWorkbenchLabel(labelFor(mod))}`);
        undo.onclick = () => { insertLegendary(mod); recalculate(); renderSelectors(); };
        description.append(label,status); row.append(description,undo);
        legendaryList.appendChild(row);
      });
    };
    legendSearch.addEventListener("input",renderSelectors);
    const modHint = document.createElement("p");
    modHint.className = "vk-workbench-hint";
    modHint.textContent = "Choose one modification per slot. Select None to remove it.";
    controls.append(headingMods,modHint,slotList,legendaryHeading,legendSearch,legendaryList);
    editColumn.appendChild(controls);
    reviewColumn.appendChild(crafting);
    recalculate();
    Promise.all([isApparel ? fetchArmorAddonData(isPowerArmor) : fetchWeaponAddonData(),fetchWeaponAllowedMods({...item,link:item.link || item.apparel || ""}),isApparel ? Promise.resolve([]) : fetchWeaponNamingRules(item)])
      .then(([allMods,slots,rules]) => {
        if (!overlay.isConnected) return;
        available = allMods; allowedSlots = slots; namingRules = rules;
        allMods.forEach(mod => { knownModNames.set(mod.id,displayMod(mod)); knownDefinitions.set(mod.id,mod); });
        recalculate(); renderSelectors();
      })
      .catch(err => { slotList.textContent = `Could not load modifications: ${err.message}`; });
  }
  refreshNamePreview();
  renderSpecial(); editColumn.appendChild(specialDetails);
  if (isApparel && item.locations) {
    const coverage = document.createElement("div");coverage.className="vk-workbench-item-meta";
    coverage.textContent = `${isPowerArmor ? "Power Armor" : "Apparel"} · ${item.locations}`;
    heading.appendChild(coverage);
  }
  actions.className = "vk-workbench-actions";
  const cancelWorkbench = document.createElement("button");
  cancelWorkbench.textContent = "Cancel"; cancelWorkbench.type = "button"; cancelWorkbench.onclick = dismiss;
  actions.prepend(changeStatus, cancelWorkbench);
  body.appendChild(layout);
  panel.append(body, actions);
  // Sheet-scoped popup: visible only within the character-sheet pane.
  overlay.appendChild(panel);
  panel.tabIndex = -1;
  panel.focus({ preventScroll: true });
}
// Apparel source data stays in memory; instances retain selections and state.
function vkParseApparelSource(content) {
  const block = (String(content).match(/```statblock\s*([\s\S]*?)```/i) || [])[1];
  if (!block) throw new Error("The apparel source has no statblock.");
  return { block, data: obsidian.parseYaml(block) || {} };
}
function vkApparelSourceFile(item) {
  const path = String(item.sourcePath || "");
  const direct = path && app.vault.getAbstractFileByPath(path);
  if (direct?.extension === "md") return direct;
  const target = String(item.apparel || item.name || item.link || "").replace(/^\[\[|\]\]$/g, "").split("|")[0];
  return app.metadataCache.getFirstLinkpathDest(target, "");
}
async function loadApparelWorkbenchItem(item, isPowerArmor) {
  const file = vkApparelSourceFile(item);
  if (!file) throw new Error("The apparel source file could not be found.");
  const { block, data } = vkParseApparelSource(await app.vault.read(file));
  const defs = await fetchArmorAddonData(isPowerArmor, true);
  const baseDR = parseArmorModStatblock(block);
  const editable = structuredClone(item);
  editable.sourcePath = file.path;
  editable.yamlName = String(data.name || file.basename);
  editable.apparel = item.apparel || item.name || `[[${file.path.replace(/\.md$/i, "")}]]`;
  editable.locations = String(data.locations || "");
  editable.rarity = data.rarity ?? null;
  editable.gameEffects = typeof data.gameEffects === "string" ? data.gameEffects.trim() : "";
  editable.base = {physdr:String(baseDR.phys),endr:String(baseDR.en),raddr:String(baseDR.rad),weight:String(data.weight ?? "0"),value:String(item.baseCostOverride ?? data.cost ?? "0")};
  if (isPowerArmor) editable.base.hp = String(data.hp ?? "0");
  editable.addons = (item.addons || []).map(addon => structuredClone(defs.find(def => def.id === addon.id) || addon));
  recalcArmorFromAddons(editable, isPowerArmor);
  // Modification capacity changes never repair a damaged power armor piece.
  if (isPowerArmor && item.hp != null) editable.hp = String(item.hp);
  return editable;
}
function vkApparelStoredAddons(addons) {
  return (addons || []).map(addon => ({id:addon.id,link:addon.link,type:addon.type,deltas:structuredClone(addon.deltas || {})}));
}
function vkApparelFingerprint(item) {
  return JSON.stringify([item.sourcePath,item.apparel || item.name,item.instanceId,item.instanceName,item.addons,item.baseCostOverride,item.qty]);
}
function vkCommitApparelWrites(writes) {
  const before = writes.map(([key]) => [key,localStorage.getItem(key)]);
  try { for (const [key,value] of writes) localStorage.setItem(key,JSON.stringify(value)); }
  catch (error) {
    for (const [key,value] of before) {
      if (value === null) localStorage.removeItem(key); else localStorage.setItem(key,value);
    }
    console.warn("Vault-Kit: apparel changes could not be saved",error);
    return false;
  }
  window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
  if (typeof updateCarryWeightDisplay === "function") updateCarryWeightDisplay();
  return true;
}
function vkApparelMaterialWrite(costs) {
  if (!costs) return [];
  const rows = JSON.parse(localStorage.getItem("fallout_gear_table") || "[]");
  const spent = vkSpendMaterials(rows,costs);
  return spent ? [["fallout_gear_table",spent]] : null;
}
async function openEquippedApparelWorkbench(original, isPowerArmor, section) {
  const prefix = isPowerArmor ? POWER_ARMOR_STORAGE_KEY : ARMOR_STORAGE_KEY;
  const sections = isPowerArmor ? PA_ARMOR_SECTIONS : ARMOR_SECTIONS;
  const key = `${prefix}_${section}`;
  const live = JSON.parse(localStorage.getItem(key) || "null");
  if (!live || vkApparelFingerprint(live) !== vkApparelFingerprint(original)) {
    showSheetNotice("Equipment changed. Reopen the workbench."); return;
  }
  const targetSections = sections.filter(candidate => {
    if (candidate === section) return true;
    const row = JSON.parse(localStorage.getItem(`${prefix}_${candidate}`) || "null");
    return !!live.instanceId && row?.instanceId === live.instanceId && row.sourcePath === live.sourcePath;
  });
  const originals = new Map(targetSections.map(candidate => [candidate,JSON.parse(localStorage.getItem(`${prefix}_${candidate}`))]));
  const editable = await loadApparelWorkbenchItem(live,isPowerArmor);
  openEquipmentWorkbench({item:editable,kind:isPowerArmor ? "powerArmor" : "armor",saveItem:(draft,costs=null) => {
    const writes = [];
    for (const [candidate,before] of originals) {
      const storageKey = `${prefix}_${candidate}`;
      const current = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (!current || vkApparelFingerprint(current) !== vkApparelFingerprint(before)) return false;
      const updated = {...current,sourcePath:draft.sourcePath,base:structuredClone(draft.base),addons:vkApparelStoredAddons(draft.addons),generatedName:draft.generatedName || ""};
      if (draft.instanceName) updated.instanceName=draft.instanceName; else delete updated.instanceName;
      recalcArmorFromAddons(updated,isPowerArmor);
      if (isPowerArmor) {
        const remaining = Number(current.hp),maximum = Number(updated.maxHp);
        updated.hp = Number.isFinite(remaining) && Number.isFinite(maximum) ? String(Math.min(remaining,maximum)) : current.hp;
        updated.hpManual = current.hpManual;
      }
      // Never copy source Special strings or mod descriptions into saved state.
      writes.push([storageKey,updated]);
    }
    const materials = vkApparelMaterialWrite(costs);
    if (!materials) return false;
    return vkCommitApparelWrites([...writes,...materials]);
  }});
}
async function openInventoryApparelWorkbench(original, isPowerArmor) {
  const gearKey = "fallout_gear_table";
  const initial = JSON.parse(localStorage.getItem(gearKey) || "[]");
  const index = original.instanceId
    ? initial.findIndex(row => row.instanceId === original.instanceId)
    : initial.findIndex(row => !row.instanceId && row.sourcePath === original.sourcePath && row.name === original.name);
  if (index < 0) { showSheetNotice("Equipment changed. Reopen the workbench."); return; }
  const selected = initial[index],fingerprint = vkApparelFingerprint(selected);
  const draftSource = {...selected,hp:selected.powerArmorState?.hp};
  const editable = await loadApparelWorkbenchItem(draftSource,isPowerArmor);
  openEquipmentWorkbench({item:editable,kind:isPowerArmor ? "powerArmor" : "armor",saveItem:async (draft,costs=null) => {
    const before = localStorage.getItem(gearKey);
    const rows = JSON.parse(before || "[]");
    const target = selected.instanceId ? rows.findIndex(row => row.instanceId === selected.instanceId) : index;
    if (target < 0 || vkApparelFingerprint(rows[target]) !== fingerprint) return false;
    const current = rows[target],count = Math.max(1,Number(current.qty) || 1);
    const modified = {...current,qty:"1",instanceId:count > 1 || !current.instanceId ? makeInventoryInstanceId() : current.instanceId,addons:lightweightInventoryAddons(draft.addons),generatedName:draft.generatedName || ""};
    if (draft.instanceName) modified.instanceName=draft.instanceName; else delete modified.instanceName;
    if (isPowerArmor && current.powerArmorState) {
      modified.powerArmorState=structuredClone(current.powerArmorState);
      const remaining=Number(current.powerArmorState.hp),maximum=Number(draft.maxHp);
      if (Number.isFinite(remaining) && Number.isFinite(maximum)) modified.powerArmorState.hp=String(Math.min(remaining,maximum));
    }
    await recalcInventoryItemFromSources(modified);
    if (localStorage.getItem(gearKey) !== before) return false;
    if (count > 1) { rows[target]={...current,qty:String(count-1)};rows.splice(target+1,0,modified); }
    else rows[target]=modified;
    const spent = costs ? vkSpendMaterials(rows,costs) : rows;
    return spent ? vkCommitApparelWrites([[gearKey,spent]]) : false;
  }});
}

function saveWorkbenchTableItem(storageKey, original, draft, materialCosts = null) {
  const rows = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const index = rows.findIndex(row => row.instanceId && String(row.instanceId) === String(original.instanceId));
  if (index < 0) return false;
  // Commit only staged workbench fields; preserve live ammo and other row state.
  if (storageKey === "fallout_weapon_table" && Array.isArray(draft.addons)) {
    rows[index].addons = structuredClone(draft.addons);
    if (typeof draft.generatedName === "string") rows[index].generatedName = draft.generatedName;
    recalcWeaponFromAddons(rows[index]);
  }
  if (draft.instanceName) rows[index].instanceName = draft.instanceName;
  else delete rows[index].instanceName;
  if (materialCosts) {
    const gearKey = "fallout_gear_table";
    const originalGear = localStorage.getItem(gearKey);
    let gear;
    try { gear = JSON.parse(originalGear || "[]"); } catch (_) { return false; }
    const updatedGear = vkSpendMaterials(gear,materialCosts);
    if (!updatedGear) return false;
    const originalWeapons = localStorage.getItem(storageKey);
    try {
      localStorage.setItem(storageKey, JSON.stringify(rows));
      localStorage.setItem(gearKey, JSON.stringify(updatedGear));
    } catch (err) {
      // localStorage has no multi-key transactions: restore both keys on failure.
      if (originalWeapons === null) localStorage.removeItem(storageKey);
      else localStorage.setItem(storageKey, originalWeapons);
      if (originalGear === null) localStorage.removeItem(gearKey);
      else localStorage.setItem(gearKey, originalGear);
      return false;
    }
  } else localStorage.setItem(storageKey, JSON.stringify(rows));
  return true;
}
function styleEquipmentActionIcon(element, kind) {
  for (const name of [...element.classList]) if (name.startsWith("vk-equipment-action-")) element.classList.remove(name);
  element.classList.add("vk-equipment-action-icon", "vk-equipment-action-" + kind);
  element.style.cssText = "";
  const icons={modify:"settings",equip:"arrow-up-from-line",unequip:"arrow-down-to-line",prepare:"list-plus",unprepare:"list-minus",remove:"trash-2",repair:"wrench",condition:"triangle-alert",add:"plus",edit:"pencil",save:"check",close:"x",transfer:"arrow-right-left"};
  const label=element.getAttribute("aria-label") || element.title || ({remove:"Delete",modify:"Modify",transfer:"Transfer"}[kind]) || kind.charAt(0).toUpperCase()+kind.slice(1);
  element.setAttribute("aria-label",label);
  if (element.tagName === "BUTTON") element.type="button";
  else {
    element.setAttribute("role","button");element.tabIndex=0;
    if (!element._vkIconKeyboard) {
      element._vkIconKeyboard=true;
      element.addEventListener("keydown",event=>{if(event.key==="Enter" || event.key===" "){event.preventDefault();event.stopPropagation();element.click();}});
    }
  }
  obsidian.setIcon(element,icons[kind] || "circle-help");
  const icon=element.querySelector("svg");
  if(icon){icon.setAttribute("aria-hidden","true");icon.setAttribute("focusable","false");}
}
function vkDisclosureIcon(summary) {
  if (!summary || summary.querySelector(":scope > .vk-disclosure-icon")) return;
  summary.classList.add("vk-disclosure-summary");
  const icon=document.createElement("span");icon.className="vk-disclosure-icon";icon.setAttribute("aria-hidden","true");
  obsidian.setIcon(icon,"chevron-right");summary.prepend(icon);
}
// Repairs restore an apparel instance; compendium definitions remain read-only.
const VK_REPAIR_COSTS = [[1,0,0],[2,0,0],[2,1,0],[2,2,0],[2,2,1],[3,3,1]];
function vkRepairRarity(value) {
  const raw=String(value ?? "").trim();
  const match=raw.match(/^(\d+)\+?$/) || raw.match(/\|(\d+)\+?\]\]$/);
  return match ? Number(match[1]) : null;
}
function vkRepairDonorToken(row) {
  if (row.instanceId) return `instance:${row.instanceId}`;
  const copy={...row};delete copy.qty;delete copy.selected;
  return `stack:${JSON.stringify(copy)}`;
}
function vkRepairDonors(rows, target, sourcePath) {
  return rows.filter(row=>{
    if ((Number(row.qty)||0)<1 || ((target.instanceId && row.instanceId===target.instanceId) || (target.consumableInventoryId && row.instanceId===target.consumableInventoryId))) return false;
    return vkApparelSourceFile(row)?.path===sourcePath;
  });
}
async function openApparelRepair(section,isPower=false,weaponId="") {
  const isWeapon=!!weaponId;
  const prefix=isWeapon?"":isPower ? POWER_ARMOR_STORAGE_KEY : ARMOR_STORAGE_KEY;
  const sections=isWeapon?[]:isPower ? PA_ARMOR_SECTIONS : ARMOR_SECTIONS;
  const key=isWeapon?"fallout_weapon_table":`${prefix}_${section}`,before=localStorage.getItem(key);
  const item=isWeapon?JSON.parse(before||"[]").find(w=>String(w.instanceId)===weaponId):JSON.parse(before || "null");
  if (isWeapon ? !item : !item?.apparel) return;
  const source=isWeapon?await loadWeaponRepairSource(item):await loadApparelWorkbenchItem(item,isPower);
  const allowedMods=await fetchWeaponAllowedMods(source);
  if (localStorage.getItem(key)!==before) {showSheetNotice("Equipment changed. Reopen Repair.");return;}
  const originals=new Map([[key,before]]);
  for(const candidate of isWeapon?[]:sections) {
    const otherKey=`${prefix}_${candidate}`,raw=localStorage.getItem(otherKey);
    if(otherKey===key || !raw || !item.instanceId)continue;
    const other=JSON.parse(raw);
    if(other.instanceId===item.instanceId && other.sourcePath===item.sourcePath)originals.set(otherKey,raw);
  }
  const rarity=vkRepairRarity(source.rarity),costs=rarity===null ? null : VK_REPAIR_COSTS[Math.min(5,rarity)];
  const mods=(source.addons || []).length;
  const complication=mods ? `${Math.max(1,20-mods)}–20` : "20";
  const host=sheetcontainer.closest(".view-content") || sheetcontainer.closest(".workspace-leaf-content") || sheetcontainer.parentElement;
  if(!host)return;
  openVaultKitWorkbench?.forceClose();
  const oldPosition=host.style.position,positionChanged=getComputedStyle(host).position==="static";
  if(positionChanged)host.style.position="relative";
  const hadHostClass=host.classList.contains("vk-workbench-pane-host");host.classList.add("vk-workbench-pane-host");
  const overlay=document.createElement("div");overlay.className="vk-workbench-pane-overlay";
  const panel=document.createElement("section");panel.className="vk-modal vk-workbench vk-repair";panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-label",`Repair ${section}`);panel.tabIndex=-1;
  const syncTheme=()=>{
    const theme=getComputedStyle(sheetcontainer);
    for(const name of theme)if(name.startsWith("--vk-"))overlay.style.setProperty(name,theme.getPropertyValue(name));
    overlay.style.setProperty("--vk-font-family-body",theme.fontFamily);
    overlay.style.setProperty("--vk-sheet-background",theme.backgroundImage!=="none" ? theme.backgroundImage : "linear-gradient(180deg,var(--vk-bg-soft),var(--vk-bg))");
  };
  syncTheme();const themeObserver=new MutationObserver(syncTheme);
  themeObserver.observe(sheetcontainer,{attributes:true,attributeFilter:["style","class"]});themeObserver.observe(document.body,{attributes:true,attributeFilter:["style","class"]});
  let closed=false,applying=false;
  const previousFocus=document.activeElement;
  const close=()=>{
    if(closed)return;closed=true;themeObserver.disconnect();lifetimeObserver.disconnect();
    window.removeEventListener("fallout:gear-updated",renderRequirements);overlay.remove();
    if(positionChanged)host.style.position=oldPosition;if(!hadHostClass)host.classList.remove("vk-workbench-pane-host");
    if(openVaultKitWorkbench===api)openVaultKitWorkbench=null;
    if(previousFocus?.isConnected)previousFocus.focus();
  };
  const api={forceClose:close};openVaultKitWorkbench=api;
  const lifetimeObserver=new MutationObserver(()=>{if(!sheetcontainer.isConnected || !host.isConnected)close();});
  lifetimeObserver.observe(document.body,{childList:true,subtree:true});
  const node=(tag,className,text)=>{const element=document.createElement(tag);if(className)element.className=className;if(text!==undefined)element.textContent=text;return element;};
  const header=node("div","vk-repair-header");header.append(node("div","vk-repair-kicker","Repair"));
  header.append(node("h2","",normalizeInstanceName(item.instanceName) || source.generatedName || source.yamlName || stripWikiLink(item.apparel)));
  header.append(node("div","vk-repair-muted",`Equipped · ${isWeapon?"Weapon":section} · Rarity ${rarity ?? "unknown"} · ${mods} installed mod${mods===1 ? "" : "s"}`));
  const body=node("div","vk-repair-body"),guide=node("div","vk-repair-guide");
  const difficulty=node("span","vk-repair-value");
  for(const [label,value] of [["Test",difficulty],["Time","30 minutes"],["Complication range",`+${mods} from mods (${complication})`]]) {
    const cell=node("div","");cell.append(node("span","vk-repair-label",label));
    if(label==="Complication range"){
      const text=node("span","vk-repair-value",`+${mods} from mods `);text.appendChild(node("span","vk-repair-range",`(${complication})`));cell.appendChild(text);
    }else cell.append(typeof value==="string" ? node("span","vk-repair-value",value) : value);
    guide.appendChild(cell);
  }
  body.appendChild(guide);
  body.append(node("p","vk-repair-help","Requires an appropriate workbench. On success, spend 2 AP to reduce the time to 15 minutes. Complications may add 15 minutes or waste extra materials."));
  const methodRow=node("label","vk-repair-method","Repair using"),method=node("select","");method.setAttribute("aria-label","Repair using");
  for(const [value,text] of [["materials","Materials"],["donor","Matching item · difficulty −1"]]){const option=node("option","",text);option.value=value;method.appendChild(option);}methodRow.appendChild(method);body.appendChild(methodRow);
  const donorRow=node("label","vk-repair-method","Item to sacrifice"),donor=node("select","");donor.setAttribute("aria-label","Item to sacrifice");donorRow.appendChild(donor);body.appendChild(donorRow);
  const methodNote=node("p","vk-repair-help");body.appendChild(methodNote);
  const requirements=node("div","vk-repair-requirements");requirements.append(node("h3","","Requirements"));
  const makeTable=(label,columns)=>{const table=node("table","");table.setAttribute("aria-label",label);const head=node("thead",""),row=node("tr","");for(const text of columns)row.appendChild(node("th","",text));head.appendChild(row);const content=node("tbody","");table.append(head,content);return {table,content};};
  const requirementTable=makeTable("Repair requirements",["Use","Needed","In Inventory"]);requirements.appendChild(requirementTable.table);
  const consumeRow=node("label","vk-repair-consume"),consume=node("input","");consume.type="checkbox";consumeRow.append(consume,node("span","","Consume requirements from Inventory"));requirements.appendChild(consumeRow);
  const inventoryNote=node("p","vk-repair-help vk-repair-inventory-note");requirements.appendChild(inventoryNote);body.appendChild(requirements);
  const changes=node("div","vk-repair-changes");changes.append(node("h3","","Successful repair"));
  const preview=makeTable("Repair stat preview",[isWeapon?"Weapon":`${section} piece`,"Current","After repair"]);
  const losses=isWeapon?{phys:0,en:0,rad:0}:vkArmorBreaking(item);
  const keys=[["physdr","Physical DR"],["endr","Energy DR"],["raddr","Radiation DR"]];
  const currentDR=isWeapon?[]:keys.map(([key,target])=>vkArmorResistance({...source,breaking:losses},key,target).remaining);
  const repairedDR=isWeapon?[]:keys.map(([key,target])=>vkArmorResistance({...source,breaking:{phys:0,en:0,rad:0}},key,target).remaining);
  const maxHp=Math.max(0,Number(source.maxHp)||0);
  const rows=isWeapon ? [["Condition",vkWeaponCondition(item).status,"Normal"],...Object.keys(vkWeaponConditionView(item)._vkCondition.contributions).map(key=>[VK_WEAPON_CONDITION_FIELDS[key].label,String(vkWeaponConditionView(item)[key]||"None"),String(item[key]??(key==="ammoPerShot"?1:"None"))])] : [["Breaking · Physical / Energy / Rad",[losses.phys,losses.en,losses.rad].join(" / "),"0 / 0 / 0"],["DR · Physical / Energy / Rad",currentDR.join(" / "),repairedDR.join(" / ")]];
  if(isPower)rows.push(["Power armor HP",`${item.hp ?? 0} / ${maxHp}`,`${maxHp} / ${maxHp}`]);
  for(const values of rows){const row=node("tr","");values.forEach((text,index)=>row.appendChild(node("td",index===2 ? "vk-repair-after" : "",text)));preview.content.appendChild(row);}changes.appendChild(preview.table);
  if(originals.size>1)changes.append(node("p","vk-repair-help",`This physical item is linked across ${originals.size} equipped slots; all its linked slots will be restored.`));
  body.appendChild(changes);
  const footer=node("div","vk-repair-footer"),status=node("div","vk-repair-status");status.setAttribute("role","status");status.setAttribute("aria-live","polite");
  const cancel=node("button","","Cancel"),apply=node("button","vk-repair-apply","Apply successful repair");cancel.type=apply.type="button";cancel.onclick=close;footer.append(status,cancel,apply);
  let donors=[];
  const hasDamage=isWeapon?vkWeaponCondition(item).status!=="normal":Object.values(losses).some(n=>n>0) || (isPower && Number(item.hp)!==maxHp);
  function renderRequirements() {
    if(closed)return;
    const inventory=getGearRows(),selected=donor.value;
    donors=vkRepairDonors(inventory,item,source.sourcePath);
    donor.replaceChildren();
    const placeholder=node("option","","Select an inventory item…");placeholder.value="";donor.appendChild(placeholder);
    const outside=node("option","","Handle outside Inventory");outside.value="outside";donor.appendChild(outside);
    for(const row of donors){const name=normalizeInstanceName(row.instanceName) || row.generatedName || stripWikiLink(row.name);const count=Math.max(0,Math.floor(Number(row.qty)||0));const option=node("option","",`${name} · ${count} available · ${row.addons?.length ? row.addons.map(addon=>{
      const file=vkApparelSourceFile({sourcePath:addon.id,name:addon.link});
      const match=allowedMods.find(entry=>app.metadataCache.getFirstLinkpathDest(entry.target,source.sourcePath)?.path===file?.path && file);
      return match?.name || sourceDisplayName({rawLink:addon.link,sourcePath:addon.id,fallbackName:"Mod"});
    }).join(", ") : "Unmodded"}`);option.value=vkRepairDonorToken(row);donor.appendChild(option);}
    donor.value=selected==="outside" || donors.some(row=>vkRepairDonorToken(row)===selected) ? selected : "";
    const usingDonor=method.value==="donor",chosen=donors.find(row=>vkRepairDonorToken(row)===donor.value);
    donorRow.hidden=!usingDonor;consumeRow.hidden=usingDonor;difficulty.textContent=`INT + Repair · Difficulty ${rarity===null ? "unknown" : Math.max(0,rarity-(usingDonor ? 1 : 0))}`;
    methodNote.textContent=usingDonor ? "Scrap one other item of the same type instead of paying the material cost. Any mods on the scrapped item are consumed with it." : `Repair cost is based on the item's rarity${rarity===null ? "; check its source note" : ` (${rarity})`}.`;
    const available=vkMaterialInventory(inventory);
    const needs=usingDonor ? [[source.yamlName || "Matching item",1,donors.reduce((total,row)=>total+Math.max(0,Math.floor(Number(row.qty)||0)),0)]] : VK_MATERIAL_NAMES.map((name,index)=>[name,costs?.[index] ?? "?",available[index]]).filter(([,needed])=>needed!==0);
    requirementTable.content.replaceChildren();for(const values of needs){const row=node("tr","");values.forEach(text=>row.appendChild(node("td","",String(text))));requirementTable.content.appendChild(row);}
    const enough=usingDonor ? !!chosen : !!costs && costs.every((cost,index)=>available[index]>=cost);
    const requirementsMissing=usingDonor ? !chosen && donor.value!=="outside" : consume.checked&&!enough;
    inventoryNote.textContent=usingDonor
      ? (chosen ? "Remove 1 selected matching item, including its mods, when the repair is applied." : donor.value==="outside" ? "Sacrifice handled outside Inventory. Inventory will stay unchanged." : "Choose which item to sacrifice.")
      : consume.checked ? "Remove the listed materials when the repair is applied." : "Inventory will stay unchanged.";
    status.textContent=rarity===null ? "Source rarity is missing or unreadable. Check the item note and reopen Repair." : !hasDamage ? "No repairs needed." : requirementsMissing ? (usingDonor ? "Choose which item to sacrifice, or handle it outside Inventory." : "Requirements are unavailable in Inventory.") : "Apply after resolving the repair test.";
    apply.disabled=applying || rarity===null || !hasDamage || requirementsMissing;
  }
  method.onchange=consume.onchange=donor.onchange=renderRequirements;
  window.addEventListener("fallout:gear-updated",renderRequirements);
  apply.onclick=()=>{
    if(apply.disabled || applying)return;
    for(const [storageKey,raw] of originals)if(localStorage.getItem(storageKey)!==raw){status.textContent="Equipment changed. Cancel and reopen Repair.";apply.disabled=true;return;}
    const writes=[];
    for(const [storageKey,raw] of originals){const repaired=JSON.parse(raw);if(isWeapon){const target=repaired.find(w=>String(w.instanceId)===weaponId);delete target.weaponCondition;writes.push([storageKey,repaired]);continue;}repaired.breaking={phys:0,en:0,rad:0};if(isPower){repaired.hp=String(maxHp);repaired.hpManual=false;}writes.push([storageKey,repaired]);}
    if(method.value==="donor" ? donor.value!=="outside" : consume.checked){
      const inventory=getGearRows();let spent;
      if(method.value==="donor"){
        const chosen=vkRepairDonors(inventory,item,source.sourcePath).find(row=>vkRepairDonorToken(row)===donor.value);
        if(!chosen){renderRequirements();return;}
        spent=structuredClone(inventory);const index=inventory.indexOf(chosen),qty=Math.floor(Number(chosen.qty)||0);
        if(qty<=1)spent.splice(index,1);else spent[index].qty=String(qty-1);
      }else spent=costs ? vkSpendMaterials(inventory,costs) : null;
      if(!spent){renderRequirements();return;}
      writes.push(["fallout_gear_table",spent]);
    }
    if(isWeapon && item.consumableRef && item.consumableInventoryId){
      const gearWrite=writes.find(([key])=>key==="fallout_gear_table"),gear=gearWrite?gearWrite[1]:getGearRows();
      const owned=gear.find(row=>row.instanceId===item.consumableInventoryId);if(owned)delete owned.weaponCondition;
      if(!gearWrite)writes.push(["fallout_gear_table",gear]);
    }
    applying=true;apply.disabled=true;
    if(!vkCommitApparelWrites(writes)){applying=false;status.textContent="Repair could not be saved. Nothing was consumed. Try again.";apply.disabled=false;return;}
    close();if(isWeapon)updateWeaponTableDOM();else refreshSheet();showSheetNotice("Repair applied.");
  };
  panel.addEventListener("keydown",event=>{
    if(event.key==="Escape"){event.preventDefault();event.stopPropagation();close();}
    if(event.key==="Tab"){
      const focusable=[...panel.querySelectorAll("button,input,select")].filter(el=>!el.disabled&&el.getClientRects().length),first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey && (document.activeElement===first || document.activeElement===panel)){event.preventDefault();last?.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus();}
    }
  });
  overlay.addEventListener("click",event=>{if(event.target===overlay)close();});
  panel.append(header,body,footer);overlay.appendChild(panel);host.appendChild(overlay);renderRequirements();panel.focus({preventScroll:true});
}


function createWorkbenchButton(item, kind, label = "Inspect / Workbench", saveItem = null, iconOnly = false, apparelSection = "") {
  // Shared native icon buttons in Inventory, Weapons and Apparel.
  const btn = document.createElement("button");
  if (!iconOnly) btn.type = "button";
  btn.textContent = label;
  if (iconOnly) {
    btn.setAttribute("role", "button");
    btn.tabIndex = 0;
    btn.className = "vk-inventory-action-icon";
    styleEquipmentActionIcon(btn, "modify");
  } else {
    btn.style.cssText = "background:#102434;color:#ffc200;border:1px solid #527c96;border-radius:5px;padding:3px 9px;cursor:pointer;margin-left:8px;";
  }
  btn.title = iconOnly ? ((kind === "armor" || kind === "powerArmor" || (kind === "equipment" && getInventoryModKind(item) !== "weapon")) ? "Modify apparel" : "Modify weapon") : "Inspect equipment in the unified workbench";
  if (iconOnly) btn.setAttribute("aria-label", btn.title);
  guardObsidianClick(btn);
  if (iconOnly && btn.tagName!=="BUTTON") btn.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); btn.click(); }
  });
  btn.onclick = e => {
    e.stopPropagation();
    if (kind === "armor" || kind === "powerArmor") {
      openEquippedApparelWorkbench(item,kind === "powerArmor",apparelSection).catch(error => { console.error(error);showSheetNotice(error.message); });
      return;
    }
    if (kind === "equipment" && ["armor","powerArmor"].includes(getInventoryModKind(item))) {
      openInventoryApparelWorkbench(item,getInventoryModKind(item) === "powerArmor").catch(error => { console.error(error);showSheetNotice(error.message); });
      return;
    }
    const storageKey = kind === "weapon" ? "fallout_weapon_table" : kind === "equipment" ? "fallout_gear_table" : null;
    const commit = saveItem || (storageKey ? draft => saveWorkbenchTableItem(storageKey, item, draft) : null);
    if (kind === "equipment" && getInventoryModKind(item) === "weapon") {
      (async () => {
        const source = (await fetchWeaponData()).find(w => w.sourcePath === item.sourcePath);
        if (!source) { showSheetNotice("Weapon source file could not be found."); return; }
        const editable = structuredClone(source);
        editable.sourcePath = item.sourcePath;
        editable.link = item.name || source.link;
        editable.name = stripWikiLink(item.name || source.link || source.name || "Weapon");
        editable.instanceId = item.instanceId || makeInventoryInstanceId();
        editable.instanceName = item.instanceName || "";
        editable.generatedName = item.generatedName || "";
        editable.addons = await fullWeaponAddonsFromInventory(item.addons);
        if (item.baseCostOverride !== undefined) editable.baseCostOverride = item.baseCostOverride;
        ensureWeaponBaseSnapshot(editable);
        recalcWeaponFromAddons(editable);
        const commitInventory = async (updated, costs = null) => {
          const originalGear = localStorage.getItem("fallout_gear_table");
          let gear;
          try { gear = JSON.parse(originalGear || "[]"); } catch (_) { return false; }
          const idx = gear.findIndex(r => item.instanceId && String(r.instanceId) === String(item.instanceId));
          const targetIndex = idx >= 0 ? idx : gear.findIndex(r => r.sourcePath === item.sourcePath && !r.instanceId && !hasInventoryMods(r));
          if (targetIndex < 0) return false;
          const existing = gear[targetIndex];
          const count = Math.max(1, Number(existing.qty) || 1);
          const newItem = structuredClone(existing);
          newItem.instanceId = updated.instanceId;
          newItem.qty = "1";
          newItem.addons = lightweightInventoryAddons(updated.addons);
          if (updated.instanceName) newItem.instanceName = updated.instanceName;
          else delete newItem.instanceName;
          newItem.generatedName = updated.generatedName || "";
          await recalcInventoryItemFromSources(newItem);
          // If a stack is being modified, isolate one unit without changing the rest.
          if (count > 1 && !existing.instanceId) {
            existing.qty = String(count - 1);
            gear.splice(targetIndex + 1, 0, newItem);
          } else gear[targetIndex] = newItem;
          const spent = costs ? vkSpendMaterials(gear, costs) : gear;
          if (!spent) return false;
          try { localStorage.setItem("fallout_gear_table", JSON.stringify(spent)); }
          catch (_) { return false; }
          window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
          if (typeof updateCarryWeightDisplay === "function") updateCarryWeightDisplay();
          return true;
        };
        openEquipmentWorkbench({item:editable,kind:"weapon",saveItem:commitInventory,inventoryWeapon:true});
      })().catch(err => { console.error(err); showSheetNotice(`Cannot open weapon workbench: ${err.message}`); });
      return;
    }
    openEquipmentWorkbench({item,kind,saveItem:commit});
  };
  return btn;
}

// Prepared weapons remain in fallout_weapon_table. Only one may be in hand.
// Separate key avoids migrating existing saved characters.
const EQUIPPED_WEAPON_ID_KEY = "fallout_equipped_weapon_instance_id";

function getPreparedWeapons() {
  try {
    const rows = JSON.parse(localStorage.getItem("fallout_weapon_table") || "[]");
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    console.warn("Could not read prepared weapons", err);
    return [];
  }
}

function ensurePreparedWeaponIds() {
  const rows = getPreparedWeapons();
  let changed = false;
  const seen = new Set();
  for (const weapon of rows) {
    if (!weapon.instanceId || seen.has(String(weapon.instanceId))) {
      weapon.instanceId = makeInventoryInstanceId();
      changed = true;
    }
    seen.add(String(weapon.instanceId));
  }
  if (changed) localStorage.setItem("fallout_weapon_table", JSON.stringify(rows));
  return rows;
}

function getEquippedWeaponId() {
  const id = localStorage.getItem(EQUIPPED_WEAPON_ID_KEY) || "";
  if (!id) return "";
  if (!getPreparedWeapons().some(w => String(w.instanceId) === id)) {
    localStorage.removeItem(EQUIPPED_WEAPON_ID_KEY);
    return "";
  }
  return id;
}

function getEquippedWeapon() {
  const id = getEquippedWeaponId();
  return id ? getPreparedWeapons().find(w => String(w.instanceId) === id) || null : null;
}

function setEquippedWeaponId(id) {
  if (!id) {
    localStorage.removeItem(EQUIPPED_WEAPON_ID_KEY);
  } else {
    const normalized = String(id);
    if (!getPreparedWeapons().some(w => String(w.instanceId) === normalized)) {
      throw new Error("Cannot equip a weapon that is not prepared.");
    }
    localStorage.setItem(EQUIPPED_WEAPON_ID_KEY, normalized);
  }
  if (typeof updateWeaponTableDOM === "function") updateWeaponTableDOM();
}

function clearEquippedWeaponIfRemoved(weapon) {
  if (weapon?.instanceId && String(weapon.instanceId) === getEquippedWeaponId()) {
    localStorage.removeItem(EQUIPPED_WEAPON_ID_KEY);
  }
}

const weaponTableContainer = document.createElement('div');
weaponTableContainer.id = 'weapon-table-container';
const equippedWeaponContainer = document.createElement('div');
equippedWeaponContainer.id = 'equipped-weapon-container';
let weaponViewOwner = null;
let weaponViewVersion = 0;
const weaponCardExpansion = new Map();
const preparedWeaponSort = { key: null, ascending: true };
const pendingWeaponTransfers = new Set();

function updateWeaponTableDOM() {
    ensurePreparedWeaponIds();
    migratePreparedConsumables();
    // Close quantity editors before replacing their DOM; avoid retaining stale controls.
    for (const api of openCompactPMs) {
      if (weaponTableContainer.contains(api.wrap) || equippedWeaponContainer.contains(api.wrap)) api.hideEditor();
    }
    const previousCard = equippedWeaponContainer.querySelector("[data-weapon-instance]");
    if (previousCard) weaponCardExpansion.set(previousCard.dataset.weaponInstance,
      new Set([...previousCard.querySelectorAll("details[open]")].map(detail => detail.dataset.weaponDetail)));
    weaponViewOwner?.unload();
    weaponViewOwner = new obsidian.Component();
    weaponViewOwner.load();
    weaponViewVersion++;
    equippedWeaponContainer.replaceChildren(renderEquippedWeaponArea());
    window.dispatchEvent(new CustomEvent("fallout:equipment-special-updated"));
    weaponTableContainer.replaceChildren(renderWeaponTableSection());
    if (typeof updateCarryWeightDisplay === "function") updateCarryWeightDisplay();
}
const onWeaponGearUpdated = () => {
  // Quantity controls update themselves while open. Replacing them mid-click
  // would collapse the editor after every shot; refresh external changes when idle.
  const editingAmmo = [...openCompactPMs].some(api => equippedWeaponContainer.contains(api.wrap));
  if (sheetcontainer.isConnected) {
    if (!editingAmmo) updateWeaponTableDOM();
    else weaponTableContainer.replaceChildren(renderWeaponTableSection());
  }
};
window.addEventListener("fallout:gear-updated", onWeaponGearUpdated);
sheetcontainer._disposeWeaponView = () => {
  window.removeEventListener("fallout:gear-updated", onWeaponGearUpdated);
  weaponViewOwner?.unload();
  weaponViewOwner = null;
};

// ---- TABLE UTILITIES: DRY Table & Cell Helpers ----

// --- DRY Section Header Utility ---
function createSectionHeader(text, size = "2em", color = "#ffc200", extraStyles = {}) {
    const header = document.createElement("div");
    header.className = "vk-section-title";
    header.textContent = text;
    header.style.fontWeight = "bold";
    header.style.fontSize = size;
    header.style.color = color;
    header.style.margin = "18px 0 6px 0";
    Object.assign(header.style, extraStyles);
    return header;
}

// --- Collapsible major section helpers ---
// UI preference only; intentionally kept separate from exported character data.
const COLLAPSED_SECTIONS_KEY = "fallout_collapsed_sections";

function loadCollapsedSections() {
    try {
        const parsed = JSON.parse(localStorage.getItem(COLLAPSED_SECTIONS_KEY) || "{}");
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}

function setSectionCollapsed(sectionKey, collapsed) {
    const state = loadCollapsedSections();
    state[sectionKey] = !!collapsed;
    localStorage.setItem(COLLAPSED_SECTIONS_KEY, JSON.stringify(state));
}

function appendCollapsibleSection(parent, title, sectionKey, content, options = {}) {
    const header = createSectionHeader(title);
    const body = document.createElement("div");
    body.className = "fallout-collapsible-section-body vk-section-body";

    // content may be an already-built element or a factory function. Factory
    // mode lets heavier sections (such as Terminal Notes) avoid doing any work
    // until the player actually expands them.
    let contentMounted = false;
    const mountContent = () => {
        if (contentMounted) return;
        const node = typeof content === "function" ? content() : content;
        if (node) body.appendChild(node);
        contentMounted = true;
        if (typeof options.onMount === "function") options.onMount(node, body);
    };

    // Preserve the existing header layout. The toggle is positioned over the
    // unused right edge so it does not move or resize the title.
    header.style.position = "relative";
    header.style.cursor = "pointer";
    header.style.userSelect = "none";
    header.setAttribute("role", "button");
    header.tabIndex = 0;

    const toggle = document.createElement("span");
    toggle.className = "fallout-section-collapse-toggle";
    toggle.style.position = "absolute";
    toggle.style.right = "4px";
    toggle.style.top = "50%";
    toggle.style.transform = "translateY(-50%)";
    toggle.style.fontSize = "0.72em";
    toggle.style.fontWeight = "bold";
    toggle.style.color = "inherit";
    toggle.style.lineHeight = "1";
    toggle.style.pointerEvents = "none";
    header.appendChild(toggle);

    const saved = loadCollapsedSections();
    let collapsed = saved[sectionKey] === true;

    // Normal sections mount immediately, preserving their existing behavior.
    // Lazy sections only mount when first opened.
    if (!options.lazy || !collapsed) mountContent();

    const applyState = () => {
        if (!collapsed && !contentMounted) mountContent();
        body.style.display = collapsed ? "none" : "";
        toggle.textContent = collapsed ? "▸" : "▾";
        header.setAttribute("aria-expanded", collapsed ? "false" : "true");
        header.title = collapsed ? `Expand ${title}` : `Collapse ${title}`;
    };

    const toggleSection = () => {
        collapsed = !collapsed;
        setSectionCollapsed(sectionKey, collapsed);
        applyState();
    };

    header.addEventListener("click", toggleSection);
    header.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleSection();
        }
    });

    applyState();

    const shell = document.createElement("section");
    shell.className = "vk-section";
    shell.dataset.sectionKey = sectionKey;
    shell.append(header, body);
    parent.appendChild(shell);
    return { shell, header, body };
}



// 1. Creates a full editable table, with optional search bar to add new rows
function createEditableTable({ columns, storageKey, fetchItems, cellOverrides = {}, rowFilter = null }) {
    let data = JSON.parse(localStorage.getItem(storageKey) || "[]");

    // --- Sorting State ---
    let sortKey = null;
    let sortAsc = true;
    let sortMode = "unit"; // "unit" or "total" for columns that support stack totals

    function getColumnSortValue(row, col) {
        if (sortMode === "total" && typeof col.totalSortValue === "function") {
            return col.totalSortValue(row);
        }
        return row?.[col.key];
    }

    function makeSortableHeaderCell(col) {
        const th = document.createElement('th');
        th.style.textAlign = 'center';
        th.style.cursor = 'pointer';
        th.style.userSelect = 'none';

        const supportsStackTotal = typeof col.totalSortValue === "function";
        const isActive = sortKey === col.key;
        const isTotalMode = isActive && sortMode === "total" && supportsStackTotal;

        th.title = supportsStackTotal
            ? `Sort ${col.label}: unit descending, unit ascending, total descending, total ascending`
            : `Sort by ${col.label}`;

        const label = document.createElement('span');
        label.textContent = isTotalMode ? `${col.label} (Total)` : col.label;
        th.appendChild(label);

        th.onclick = () => {
            if (supportsStackTotal) {
                // Four-state cycle:
                // Unit ▼ -> Unit ▲ -> Total ▼ -> Total ▲ -> Unit ▼
                if (sortKey !== col.key) {
                    sortKey = col.key;
                    sortMode = "unit";
                    sortAsc = false;
                } else if (sortMode === "unit" && sortAsc === false) {
                    sortAsc = true;
                } else if (sortMode === "unit" && sortAsc === true) {
                    sortMode = "total";
                    sortAsc = false;
                } else if (sortMode === "total" && sortAsc === false) {
                    sortAsc = true;
                } else {
                    sortMode = "unit";
                    sortAsc = false;
                }
            } else {
                const sameSort = sortKey === col.key;
                sortKey = col.key;
                sortMode = "unit";
                sortAsc = sameSort ? !sortAsc : true;
            }
            saveAndRender();
        };

        if (isActive) {
            const indicator = document.createElement('span');
            indicator.textContent = sortAsc ? " ▲" : " ▼";
            indicator.style.color = "#ffc200";
            indicator.style.fontWeight = "bold";
            th.appendChild(indicator);
        }

        return th;
    }

    // DOM setup
    const tablecontainer = document.createElement('div');
    tablecontainer.className = 'vk-table-panel';
    tablecontainer.style.padding = '15px';
    tablecontainer.style.border = '3px solid #142c3f';
    tablecontainer.style.borderRadius = '8px';
    tablecontainer.style.backgroundColor = '#172a3b';
    tablecontainer.style.marginBottom = '20px';
    tablecontainer.style.overflowX = 'auto';

    // Search bar (optional)
    let searchBar;
    if (fetchItems) {
	    searchBar = createSearchBar({
	        fetchItems,
	        onSelect: (item) => {
    // Only for weapon table: set TN/Tag if missing
			    if (storageKey === "fallout_weapon_table" && typeof calculateWeaponStats === "function") {
			        if (item.TN === undefined || item.TN === null) {
			            item.TN = calculateWeaponStats(item.type).TN;
			        }
			        if (item.Tag === undefined || item.Tag === null) {
			            item.Tag = calculateWeaponStats(item.type).Tag;
			        }
			        if (storageKey === "fallout_weapon_table") {
					  ensureWeaponBaseSnapshot(item);
					}
			    }
                if (storageKey === "fallout_gear_table" && isChargeTrackedCore(item)) {
                  item.chargeUnits = [];
                  showCoreChargeEditor({
                    rowData: item,
                    onSave: (newUnit) => {
                      item.chargeUnits.push(newUnit);
                      syncChargeTrackedCoreQty(item);
                      data.push(item);
                      saveAndRender();
                    }
                  });
                  return;
                }

                if (storageKey === "fallout_weapon_table" && getWeaponChargedCoreType(item)) {
                  (async () => {
                    const selection = await showWeaponCorePicker(item, { actionLabel: "Create", allowNone: true });
                    if (selection.cancelled) return;
                    item.loadedCore = selection.loadedCore;
                    data.push(item);
                    saveAndRender();
                  })();
                  return;
                }

                data.push(item);
                saveAndRender();
			}

	    });
	    tablecontainer.appendChild(searchBar);
	}

    // Table and header
    const table = document.createElement('table');
    table.classList.add('vk-table', 'vk-data-table');
    table.style.width = '100%';
    table.style.marginBottom = '10px';
    
    if (storageKey === "fallout_weapon_table") {
      table.classList.add("fallout-weapon-table");
    } else if (storageKey === "fallout_gear_table") {
      table.classList.add("fallout-gear-table");
    } else if (storageKey === "fallout_perk_table") {
      table.classList.add("fallout-perk-table");
    } else if (storageKey === "fallout_ammo_table") {
      table.classList.add("fallout-ammo-table");
    }


    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // --- Header + Sorting ---
    columns.forEach(col => {
        if (col.hidden) return;
        headerRow.appendChild(makeSortableHeaderCell(col));
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    tablecontainer.appendChild(table);

    function save() {
        localStorage.setItem(storageKey, JSON.stringify(data));
    }

    function render() {
        tbody.innerHTML = "";
        data = JSON.parse(localStorage.getItem(storageKey) || "[]");

        // Sort if requested
        if (sortKey) {
            const sortColumn = columns.find(col => col.key === sortKey);
            data.sort((a, b) => {
              let vA = sortColumn ? getColumnSortValue(a, sortColumn) : a[sortKey];
              let vB = sortColumn ? getColumnSortValue(b, sortColumn) : b[sortKey];
			
			  let result = 0;
			
			  // --- Primary sort ---
			  if (!isNaN(Number(vA)) && !isNaN(Number(vB))) {
			    result = Number(vA) - Number(vB);
			  } else {
			    result = String(vA ?? "").localeCompare(String(vB ?? ""), undefined, {
			      numeric: true,
			      sensitivity: "base"
			    });
			  }
			
			  if (!sortAsc) result *= -1;
			
			  // --- Secondary sort: Name ---
			  if (result === 0) {
			    const nameA = String(a.name ?? "").toLowerCase();
			    const nameB = String(b.name ?? "").toLowerCase();
			    result = nameA.localeCompare(nameB);
			  }
			
			  return result;
			});
        }

        let visibleWeaponGroupIndex = 0;

        data.forEach((rowData, rowIdx) => {
          if (typeof rowFilter === "function" && !rowFilter(rowData)) return;

          const weaponGroupClass = storageKey === "fallout_weapon_table"
            ? (visibleWeaponGroupIndex % 2 === 0 ? "vk-weapon-group-a" : "vk-weapon-group-b")
            : "";

		  // ----- main weapon row -----
		  const row = document.createElement('tr');
		  if (storageKey === "fallout_weapon_table") row.classList.add("weapon-main-row", weaponGroupClass);
		  // Ensure mods array exists for weapons
		  if (storageKey === "fallout_weapon_table" && !Array.isArray(rowData.addons)) {
		    rowData.addons = [];
		  }
		
		  columns.forEach(col => {
			if (col.hidden) return;
		    if (cellOverrides[col.key]) {
		      row.appendChild(cellOverrides[col.key]({
		        rowData, col, rowIdx, data, saveAndRender, save, render,
		      }));
		    } else {
		      row.appendChild(
		        createEditableCell({
		          rowData,
		          col,
		          onChange: (val) => {
		            if (col.type === "remove") {
		              data.splice(rowIdx, 1);
		            } else if (col.type === "checkbox") {
		              rowData[col.key] = val;
		            } else {
		              rowData[col.key] = val;
		            }
		            saveAndRender();
		          }
		        })
		      );
		    }
		  });
		  
		  tbody.appendChild(row);

          // ----- charge-unit secondary row (Fusion Core / Plasma Core only) -----
          if (storageKey === "fallout_gear_table" && isChargeTrackedCore(rowData)) {
            syncChargeTrackedCoreQty(rowData);
            const visibleColumnCount = columns.filter(col => !col.hidden).length;
            tbody.appendChild(renderChargeUnitsRow(rowData, visibleColumnCount, saveAndRender));
          }

          // ----- inventory mods secondary row (weapons / apparel) -----
          if (storageKey === "fallout_gear_table" && isInventoryModdableItem(rowData)) {
            const visibleColumnCount = columns.filter(col => !col.hidden).length;
            tbody.appendChild(renderInventoryModsRow(rowData, rowIdx, data, visibleColumnCount, saveAndRender));
          }

		  // ----- effects secondary row (weapon table only; now ALWAYS shown) -----
		  if (storageKey === "fallout_weapon_table") {
		    const effectsRaw = ""; // Special is rendered from source gameEffects in the combat card.
		
		    const effectsRow = document.createElement("tr");
		    effectsRow.classList.add("weapon-effects-row", "vk-secondary-detail-row", weaponGroupClass);
		
		    // 1) AMMO CELL (first cell)
			const ammoCell = document.createElement("td");
			ammoCell.classList.add("vk-weapon-ammo-cell", "vk-weapon-detail-rail");
			ammoCell.style.width = "1%";
			ammoCell.style.background = "#06080c60";
			ammoCell.style.padding = "6px 8px";
			ammoCell.style.whiteSpace = "nowrap";
			
			const ammoInfo = (() => {
			  const weaponPath = String(rowData.sourcePath ?? "");
			  const weaponName = stripWikiLink(rowData.link);
			
			  // Exclusion folders: show nothing for melee/unique (unless special-included)
			  if (isExcludedWeaponPath(weaponPath) && !AMMO_SPECIAL_INCLUSION_PATHS.has(weaponPath)) {
			    return { mode: "none" };
			  }
			
			  // Special handling for Throwing/Explosives: match by weapon item name
			  const matchByWeaponName = isThrowingOrExplosiveWeaponPath(weaponPath);
			
			  // "Anything" => infinity (only for normal ammo mode)
			  const rawAmmo = String(rowData.ammo ?? "").trim();
			  if (!matchByWeaponName && rawAmmo.toLowerCase() === "anything") {
			    return { mode: "infinite" };
			  }
			
			  const options = matchByWeaponName ? [weaponName] : parseAmmoOptions(rawAmmo);
			  if (!options.length) return { mode: "none" };
			
			  return { mode: "list", matchByWeaponName, options };
			})();
			
            const chargedCoreType = getWeaponChargedCoreType(rowData);
            if (chargedCoreType) {
              const coreName = chargedCoreType === "fusion" ? "Fusion Core" : "Plasma Core";
              const loaded = findLoadedCoreUnit(rowData.loadedCore);
              const ammoState = getLoadedCoreAmmoState(rowData);
              const coreWrap = document.createElement("div");
              coreWrap.style = "display:flex;align-items:center;gap:7px;white-space:nowrap;";

              if (loaded && ammoState) {
                let ammoRow;
                ammoRow = createCompactPlusMinusRow({
                  labelText: `${coreName}:`,
                  initialValue: ammoState.currentShots,
                  min: 0,
                  max: ammoState.maxShots,
                  step: 10,
                  valueTitle: chargedCoreType === "fusion"
                    ? `${loaded.displayName} — 1 fusion-core charge = 50 Gatling-laser shots; expend in 10-shot increments.`
                    : `${loaded.displayName} — expend Plasma Core ammunition in 10-shot increments.`,
                  onChange: (val) => {
                    setLoadedCoreAmmoShots(rowData, val);
                    const amount = ammoRow?.wrap?.querySelector(".vk-weapon-ammo-count");
                    if (amount) amount.classList.toggle("is-empty", Number(val) <= 0);
                  },
                });
                ammoRow.wrap.classList.add("vk-weapon-ammo-row");
                const ammoSpans = ammoRow.wrap.querySelectorAll(":scope > span");
                ammoSpans[0]?.classList.add("vk-weapon-ammo-label");
                ammoRow.valueSpan?.classList.add("vk-weapon-ammo-count");
                ammoRow.valueSpan?.classList.toggle("is-empty", Number(ammoState.currentShots) <= 0);


                const shotsLabel = document.createElement("span");
                shotsLabel.textContent = "shots";
                shotsLabel.style = "color:#c5c5c5;font-size:.85em;";
                ammoRow.wrap.appendChild(shotsLabel);
                coreWrap.appendChild(ammoRow.wrap);
              } else {
                const status = document.createElement("span");
                if (rowData.loadedCore?.instanceId) {
                  status.textContent = `${coreName}: Missing`;
                  status.title = "The selected core is no longer in this character's inventory.";
                  status.style.color = "#ff9b8f";
                } else {
                  status.textContent = `${coreName}: None`;
                  status.style.color = "#c5c5c5";
                }
                coreWrap.appendChild(status);
              }

              const swap = document.createElement("span");
              swap.textContent = loaded ? "Swap" : "Load";
              swap.title = `Select a ${coreName}`;
              swap.style = "color:#ffc200;cursor:pointer;font-size:.9em;text-decoration:underline;text-underline-offset:2px;";
              guardObsidianClick(swap);
              swap.onclick = async e => {
                e.stopPropagation();
                const selection = await showWeaponCorePicker(rowData, { actionLabel: "Keep Weapon", allowNone: true });
                if (selection.cancelled) return;
                rowData.loadedCore = selection.loadedCore;
                saveAndRender();
              };

              coreWrap.appendChild(swap);
              ammoCell.appendChild(coreWrap);
            } else if (ammoInfo.mode === "none") {
			  // leave cell empty
			} else if (ammoInfo.mode === "infinite") {
			  const inf = document.createElement("span");
			  inf.textContent = "Anything";
			  inf.classList.add("vk-weapon-ammo-anything");
			  inf.style.fontWeight = "normal";
			  ammoCell.appendChild(inf);
			} else {
			  // One line per ammo option
			  const list = document.createElement("div");
			  list.style.display = "flex";
			  list.style.flexDirection = "column";
			  list.style.gap = "4px";
			
			  ammoInfo.options.forEach((opt) => {
			    const stacks = findStacksForAmmoLabel({ label: opt, matchByWeaponName: ammoInfo.matchByWeaponName });
			
			    // TOTAL across all stacks (this is what enables rollover)
			     const startQty = getTotalQtyForStacks(stacks);
			
			    let row;
			    row = createCompactPlusMinusRow({
			      labelText: `${opt}:`,
			      initialValue: startQty,
			      min: 0,
			      max: 9999, // total cap shown in UI; stack caps handled inside helper
			      valueTitle: "Click to edit ammo quantity",
			      onChange: (val) => {
			        setAmmoTotalAcrossStacks({
			          label: opt,
			          matchByWeaponName: ammoInfo.matchByWeaponName,
			          newTotal: val,
			          rowMax: 9999, // per-stack cap
			        });
			        const amount = row?.wrap?.querySelector(".vk-weapon-ammo-count");
			        if (amount) amount.classList.toggle("is-empty", Number(val) <= 0);
			      },
			    });
			    row.wrap.classList.add("vk-weapon-ammo-row");
			    const ammoSpans = row.wrap.querySelectorAll(":scope > span");
			    ammoSpans[0]?.classList.add("vk-weapon-ammo-label");
			    row.valueSpan?.classList.add("vk-weapon-ammo-count");
			    row.valueSpan?.classList.toggle("is-empty", Number(startQty) <= 0);

			
			    row.wrap.style.gap = "8px";
			    row.wrap.style.justifyContent = "space-between";
			
			    list.appendChild(row.wrap);
			  });
			  ammoCell.appendChild(list);
			}
		
		    // 2) EFFECTS CELL (middle)
		    const effectsCell = document.createElement("td");
		    effectsCell.colSpan = Math.max(1, columns.length - 1); //set to columns.length - 2 for spacer
		    effectsCell.style.textAlign = "left";
		    effectsCell.style.padding = "6px 10px";
		    effectsCell.style.background = "#06080c60";
		
		    const label = document.createElement("span");
		    label.textContent = "Effects: ";
		    label.style.fontWeight = "normal";
		    label.style.color = "#efdd6f";
		
		    const effectsWrap = document.createElement("span");
		    effectsWrap.style.display = "inline-flex";
		    effectsWrap.style.flexWrap = "wrap";
		    effectsWrap.style.gap = "6px";
		    effectsWrap.style.marginLeft = "6px";
		    effectsWrap.style.alignItems = "center";
		
		    const renderInternalLinks = (s) =>
			  String(s ?? "").replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
		
		    const parts = effectsRaw ? effectsRaw.split(/\n+/).map(s => s.trim()).filter(Boolean) : [];
		    if (!parts.length) {
			  const none = document.createElement("span");
			  none.textContent = "None";
			  none.style.color = "#c5c5c5";
			  none.style.opacity = "0.6";
			  none.style.marginLeft = "6px";
			  effectsWrap.appendChild(none);
		    } else {
			  parts.forEach((txt) => {
			    const chip = document.createElement("span");
			    chip.style.display = "inline-flex";
			    chip.style.alignItems = "center";
			    chip.style.padding = "2px 8px";
			    chip.style.borderRadius = "999px";
			    chip.style.color = "#c5c5c5";
			    chip.style.lineHeight = "1.2";
			    chip.innerHTML = renderInternalLinks(txt);
			    effectsWrap.appendChild(chip);
			  });
		    }
		
		    effectsCell.append(label, effectsWrap);
		
		    // 3) RIGHT SPACER CELL turn on above if needed
		    //const spacer = document.createElement("td");
		    //spacer.textContent = "";
		    //spacer.style.width = "1%";
		    //spacer.style.background = "#383838ab";
		
		    effectsRow.append(ammoCell, effectsCell); //add spacer here for blank cell
		    tbody.appendChild(effectsRow);
		  }


		  
		  // ----- mods secondary row (weapon table only) -----
		  if (storageKey === "fallout_weapon_table") {
		    const modsRow = document.createElement("tr");
			modsRow.classList.add("weapon-mods-row", "vk-secondary-detail-row", weaponGroupClass);
			
		    // 3-cell layout: | (blank) | Mods list | add button | // turn on below
		    //const blank = document.createElement("td");
		    //blank.textContent = "";
		    //blank.style.width = "1%"; // keeps it tight
		    //blank.style.background = "#06080c60";
		    //blank.style.background = "#383838ab";
		    //blank.style.background = "#172a3b";
		
		    const modsCell = document.createElement("td");
            modsCell.className = "vk-weapon-addons-cell";
            modsCell.colSpan = Math.max(1, columns.length - 1); //set to columns.length - 2 to enable blank cell
            modsCell.style.textAlign = "left";
            modsCell.style.padding = "6px 10px";

            const addonsLayout = document.createElement("div");
            addonsLayout.className = "vk-weapon-addons-layout";

            const label = document.createElement("span");
            label.className = "vk-weapon-addons-label";
            label.textContent = "Addons:";
            label.style.fontWeight = "normal";
            label.style.color = "#efdd6f";

            const modsWrap = document.createElement("span");
            modsWrap.className = "vk-weapon-addons";

            // Render mods as internal links + remove buttons
		    const addons = Array.isArray(rowData.addons) ? rowData.addons : [];
		    if (!addons.length) {
		      const empty = document.createElement("span");
		      empty.textContent = "None";
		      empty.style.color = "#c5c5c5";
		      empty.style.opacity = "0.6";
		      empty.style.marginLeft = "6px";
		      modsWrap.appendChild(empty);
		    } else {
		      addons.forEach((m, i) => {
		        const chip = document.createElement("span");
                chip.className = "vk-weapon-addon-chip";
		
		        // Use your existing internal link rendering style
                appendSourceWikiLink(
                  chip,
                  m.link || "",
                  "Mod",
                  String(m.id || "").endsWith(".md") ? String(m.id) : "",
                  "",
                  ""
                );
                vkApplyWeaponModAlias(chip, rowData, m);
		
		        const rm = document.createElement("button");
		        styleEquipmentActionIcon(rm, "remove");
		        rm.style.cursor = "pointer";
		        rm.style.textShadow = "2px 2px 5px black";
		        rm.title = "Remove mod";
		        rm.onclick = (e) => {
				  e.stopPropagation();
				  rowData.addons = rowData.addons.filter(a => a.id !== m.id);
				  recalcWeaponFromAddons(rowData);
				  saveAndRender();
				};

		
		        chip.appendChild(rm);
		        modsWrap.appendChild(chip);
		      });
		    }
		
		    addonsLayout.append(label, modsWrap);
            modsCell.appendChild(addonsLayout);
		
		    const addCell = document.createElement("td");
		    addCell.style.textAlign = "center";
		    addCell.style.padding = "6px";
		    //addCell.style.background = "#06080c60";
			addCell.style.background = "#383838ab";
			
		    const addBtn = document.createElement("span");
		    addBtn.textContent = "+";

		    addBtn.title = "Add mod";
		    addBtn.style = "color:#ffc200; font-weight:bold; border:none; border-radius:6px; padding:4px 12px; cursor:pointer; text-shadow:2px 2px 5px black;";
		    addBtn.onclick = () => {
		      openWeaponModPicker({
		        rowData,
		        onAdded: () => saveAndRender()
		      });
		    };
			
			
		    addCell.appendChild(addBtn);
		
		    modsCell.appendChild(createWorkbenchButton(rowData, "weapon"));
		    modsRow.append(addCell, modsCell); //add blank here for spacer
		    tbody.appendChild(modsRow);
                visibleWeaponGroupIndex += 1;
		  }
		});

        

        // Update headers to show the current unit/total sort mode after rerender.
        thead.innerHTML = '';
        const sortedHeaderRow = document.createElement('tr');
        columns.forEach(col => {
            if (col.hidden) return;
            sortedHeaderRow.appendChild(makeSortableHeaderCell(col));
        });
        thead.appendChild(sortedHeaderRow);
    }

    function saveAndRender() {
	  save();
	  render();
	  if (typeof updateCarryWeightDisplay === "function") updateCarryWeightDisplay();
	
	  // NEW: if gear changed, refresh weapon table so ammo cells update live
	  if (String(storageKey).includes("fallout_gear_table")) {
	    if (typeof updateWeaponTableDOM === "function") updateWeaponTableDOM();
        window.dispatchEvent(new CustomEvent("fallout:gear-updated", { detail: { source: tablecontainer } }));
	  }
	}
	
	// ---- external refresh hook (used for ammo->gear live updates and categorized inventory sync) ----
	if (String(storageKey).includes("fallout_gear_table") && !tablecontainer.dataset.extRefreshHook) {
	  tablecontainer.dataset.extRefreshHook = "1";
	  window.addEventListener("fallout:gear-updated", (event) => {
        if (event?.detail?.source === tablecontainer) return;
	    // Re-render this category/table UI from localStorage
	    render();
	  });
	}
    // Initial render
    render();

    return tablecontainer;
}


// 2. Renders an editable table cell (supports text, number, checkbox, links, remove)
function createEditableCell({ rowData, col, onChange }) {
    const td = document.createElement('td');
    td.style.textAlign = 'center';



	
    if (col.key === "qty") {
      td.appendChild(createPlusMinusDisplay({value:rowData[col.key] ?? 1,min:1,max:Infinity,
        label:"Inventory quantity",commitOnBlur:true,onChange:next=>onChange(String(Math.max(1,Number(next)||1)))}));
      return td;
    }

    // --- Remove Button (as before) ---
    if (col.type === "remove") {
	    const btn = document.createElement("button");
	    styleEquipmentActionIcon(btn, "remove");
	    btn.style.textShadow = "2px 2px 5px black"
	    btn.style.cursor = "pointer";
	
	    guardObsidianClick(btn);
	
	    btn.onclick = (e) => {
	      e.stopPropagation();
	      onChange();
	    };
	
	    td.appendChild(btn);
	    return td;
	}


    // --- Checkbox, generic ---
    if (col.type === "checkbox") {
	    const checkbox = document.createElement('input');
	    checkbox.type = "checkbox";
	    checkbox.checked = !!rowData[col.key];
	
	    guardObsidianClick(checkbox);
	
	    checkbox.onchange = (e) => onChange(e.target.checked);
	    td.appendChild(checkbox);
	    return td;
	}


    // --- Link or Text (generic editable) ---
    let span = document.createElement('span');
    if (col.type === "link") {
        span.innerHTML = (rowData[col.key] || "").replace(
            /\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>'
        );
    } else {
        span.textContent = rowData[col.key] || "";
    }
    span.style.cursor = "pointer";
    span.style.display = "inline-block";
    span.addEventListener("mouseenter", () => (span.style.textDecoration = "underline"));
  span.addEventListener("mouseleave", () => (span.style.textDecoration = "none"))
    guardObsidianClick(td);
	guardObsidianClick(span);
    td.onclick = (event) => {
        if (event.target.tagName === "A" || event.target.tagName === "INPUT") return;
        if (td.querySelector('input')) return;
        const input = document.createElement('input');
        input.type = col.type === "number" ? "number" : "text";
        input.value = rowData[col.key] || "";
        input.style.width = "95%";
        input.style.backgroundColor = "#fde4c9";
        input.style.color = "black";
        input.style.caretColor = "black";
        guardObsidianClick(input);
        input.onblur = () => {
		  const v = input.value.trim();
		  onChange(v);
		
		  // restore display immediately (prevents “blank cell” / re-render dependency)
		  td.innerHTML = "";
		  span = document.createElement("span");
		  if (col.type === "link") {
		    span.innerHTML = (v || "").replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
		  } else {
		    span.textContent = v;
		  }
		  span.style.cursor = "pointer";
		  span.style.display = "inline-block";
		  guardObsidianClick(span);
		  td.appendChild(span);
		};

        input.onkeydown = (e) => {
            if (e.key === "Enter" || e.key === "Escape") input.blur();
        };
        td.innerHTML = "";
        td.appendChild(input);
        input.focus();
    };
    td.appendChild(span);
    return td;
}


function debounce(fn, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    }
}


// 3. Optional: Search bar utility for adding new rows
function createSearchBar({ fetchItems, onSelect, portalResults = false }) {
    const wrapper = document.createElement('div');
    wrapper.className = 'vk-search';
    wrapper.style.marginBottom = "10px";
    wrapper.style.position = "relative";

    const input = document.createElement('input');
    input.type = "text";
    input.placeholder = "Search...";
    input.classList.add('vk-search-input');
    input.style.width = "100%";
    input.style.padding = "5px";
    input.style.backgroundColor = "#fde4c9";
    input.style.color = "black";
    input.style.borderRadius = "5px";
    input.style.caretColor = 'black';
    wrapper.appendChild(input);

    const results = document.createElement('div');
    results.className = 'vk-search-results';
    results.style.backgroundColor = "#10283a";
    results.style.color = "#f4ead5";
    results.style.width = "100%";
    results.style.border = "1px solid rgba(255,194,0,.45)";
    results.style.borderRadius = "6px";
    results.style.boxShadow = "0 6px 18px rgba(0,0,0,0.42)";
    results.style.display = "none";
    results.style.maxHeight = "220px";
    results.style.overflowY = "auto";
    results.style.zIndex = 100000;

    const positionPortalResults = () => {
        if (!portalResults || !wrapper.isConnected) return;
        const rect = input.getBoundingClientRect();
        results.style.left = `${Math.round(rect.left)}px`;
        results.style.top = `${Math.round(rect.bottom + 4)}px`;
        results.style.width = `${Math.round(rect.width)}px`;
    };

    if (portalResults) {
        // Inventory uses a body-level floating dropdown so an empty/short
        // inventory panel cannot clip it and it does not consume layout height.
        document.querySelectorAll(".vk-inventory-search-portal").forEach(el => el.remove());
        results.classList.add("vk-inventory-search-portal");
        results.style.position = "fixed";
        results.style.marginTop = "0";
        document.body.appendChild(results);

        const keepPortalAligned = () => {
            if (!wrapper.isConnected) {
                results.style.display = "none";
                return;
            }
            if (results.style.display !== "none") positionPortalResults();
        };
        window.addEventListener("resize", keepPortalAligned);
        window.addEventListener("scroll", keepPortalAligned, true);
    } else {
        // Other table searches remain in normal flow.
        results.style.position = "relative";
        results.style.marginTop = "4px";
        wrapper.appendChild(results);
    }

    input.addEventListener('input', debounce(async () => {
        const query = input.value.toLowerCase();
        if (!query) {
            results.style.display = "none";
            results.innerHTML = "";
            return;
        }
        const items = await fetchItems();
        const matches = items.filter(item =>
            (item.name || item.link || "").toLowerCase().includes(query)
        );
        results.innerHTML = "";
        matches.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'vk-search-result';
            // Display: remove [[...]]
            let label = (item.name || item.link || "").replace(/\[\[(.*?)\]\]/g, "$1");
            div.textContent = label;
            div.style.cursor = "pointer";
            div.style.padding = "7px 12px";
            div.style.borderBottom = (i < matches.length - 1) ? "1px solid rgba(244,234,213,.14)" : "";
            div.onmouseover = () => div.style.background = "#203d55";
            div.onmouseout = () => div.style.background = "inherit";
            div.addEventListener('mousedown', (e) => {
			  e.preventDefault(); // stops blur until after we add
			  if (item && typeof item === "object" && (item.name || item.link)) {
			    onSelect({ ...item });
			  }
			  input.value = "";
			  results.style.display = "none";
			});


            results.appendChild(div);
        });
        if (matches.length) {
            if (portalResults) positionPortalResults();
            results.style.display = "block";
        } else {
            results.style.display = "none";
        }
    }, 150));

    input.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            results.style.display = "none";
            input.value = "";
        }
        if (e.key === "Enter") {
            let first = results.querySelector('div');
            if (first) first.click();
        }
    });

    input.addEventListener('focusout', (e) => {
	  const next = e.relatedTarget;
	  if (next && results.contains(next)) return; // keep open if focus moves to dropdown
	  setTimeout(() => { results.style.display = "none"; }, 150);
	});

    return wrapper;
}

function getGearStorageKey() {
  // Your gear uses getStorageKey("fallout_gear_table") :contentReference[oaicite:15]{index=15}
  // but we may call this from weapon table; use the same variable.
  return GEAR_STORAGE_KEY;
}

function getTotalQtyForStacks(stacks) {
  return (stacks || []).reduce((sum, s) => sum + (parseInt(s.qty ?? 0, 10) || 0), 0);
}

// Applies a delta across stacks in ascending qty order.
// delta < 0 => consume to 0, then roll into next smallest stack
// delta > 0 => add to smallest stacks first
function applyDeltaAcrossStacks(gearRows, stacks, delta, rowMax = 9999) {
  if (!delta) return;

  // Ensure sorted least-first
  const ordered = [...stacks].sort((a, b) => (a.qty - b.qty));

  // Track gearRow indices that should be removed after consumption
  const removeIdx = new Set();

  if (delta < 0) {
    let need = -delta;

    for (const s of ordered) {
      if (need <= 0) break;

      const idx = s.gearIndex;
      const cur = Math.max(0, parseInt(gearRows[idx]?.qty ?? 0, 10) || 0);
      if (cur <= 0) continue;

      const take = Math.min(cur, need);
      const next = cur - take;

      gearRows[idx].qty = String(next);
      need -= take;

      // If this stack is now empty, mark it for removal
      if (next <= 0) removeIdx.add(idx);
    }

    // Remove empty stacks (descending indices so splices are safe)
    const toRemove = Array.from(removeIdx).sort((a, b) => b - a);
    for (const idx of toRemove) {
      gearRows.splice(idx, 1);
    }
  } else {
    // Increase: add to smallest stacks first
    let add = delta;

    for (const s of ordered) {
      if (add <= 0) break;

      const idx = s.gearIndex;
      const cur = Math.max(0, parseInt(gearRows[idx]?.qty ?? 0, 10) || 0);
      const cap = Math.max(0, rowMax - cur);
      if (cap <= 0) continue;

      const give = Math.min(cap, add);
      gearRows[idx].qty = String(cur + give);
      add -= give;
    }
  }
}


// Sets total ammo quantity across all matching stacks with rollover consumption.
function setAmmoTotalAcrossStacks({ label, matchByWeaponName, newTotal, rowMax = 9999 }) {
  const opt = String(label ?? "").trim();
  if (!opt) return;

  const gearRows = readGearRows();

  // Recompute stacks live from storage (important)
  const stacks = findStacksForAmmoLabel({ label: opt, matchByWeaponName });

  if (!stacks.length) return; // next pass: auto-create a gear row

  const currentTotal = getTotalQtyForStacks(stacks);
  const desired = Math.max(0, parseInt(newTotal ?? 0, 10) || 0);
  const delta = desired - currentTotal;

  applyDeltaAcrossStacks(gearRows, stacks, delta, rowMax);
  writeGearRows(gearRows);

  // Update gear UI, but do NOT rerender weapons mid-click
  window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
}

function swallowEditorPointer(e) {
  // Prevent Obsidian from treating the interaction as “enter edit/source”
  e.preventDefault();
  e.stopPropagation();
}
function guardObsidianClick(el) {
  if (!el) return;
  el.addEventListener("pointerdown", swallowEditorPointer, true);
  // some builds still key off mousedown
  el.addEventListener("mousedown", swallowEditorPointer, true);
}


let compactPmCloserInstalled = false;
const openCompactPMs = new Set();

function installGlobalCompactPmCloser() {
  if (compactPmCloserInstalled) return;
  compactPmCloserInstalled = true;

  document.addEventListener("pointerdown", (e) => {
    for (const api of openCompactPMs) {
      if (!api.wrap.contains(e.target)) {
        api.hideEditor();
      }
    }
  }, true);
}


function readGearRows() {
  const k = getGearStorageKey();
  return JSON.parse(localStorage.getItem(k) || "[]");
}

function writeGearRows(rows) {
  const k = getGearStorageKey();
  localStorage.setItem(k, JSON.stringify(rows));
}

function findStacksForAmmoLabel({ label, matchByWeaponName }) {
  const opt = String(label ?? "").trim();
  if (!opt) return [];

  const gear = readGearRows();
  const stacks = [];

  for (let i = 0; i < gear.length; i++) {
    const g = gear[i];
    const gQty = Math.max(0, parseInt(g.qty ?? "0", 10) || 0);

    const gYaml = String(g.yamlName ?? "").trim();
    const gName = stripWikiLink(g.name);

    const matches = matchByWeaponName
      ? (gName === opt)
      : (gYaml ? (gYaml === opt) : (gName === opt));

    if (matches) stacks.push({ gearIndex: i, qty: gQty });
  }

  stacks.sort((a, b) => a.qty - b.qty); // least qty first
  return stacks;
}


function findAmmoStacksForWeapon(rowData) {
  const weaponPath = String(rowData.sourcePath ?? "");
  const weaponName = stripWikiLink(rowData.link);

  // Exclusion folders: show nothing for melee/unique (unless special-included)
  if (isExcludedWeaponPath(weaponPath) && !AMMO_SPECIAL_INCLUSION_PATHS.has(weaponPath)) {
    return { mode: "none" };
  }

  // Special handling for Throwing/Explosives: match by item name
  const matchByWeaponName = isThrowingOrExplosiveWeaponPath(weaponPath);

  const ammoOptions = matchByWeaponName
    ? [weaponName] // match stack by item name
    : parseAmmoOptions(rowData.ammo);

  // "Anything" => infinity
  if (!matchByWeaponName && String(rowData.ammo ?? "").trim().toLowerCase() === "anything") {
    return { mode: "infinite" };
  }

  if (!ammoOptions.length) return { mode: "none" };

  const gear = readGearRows();

  // For standard ammo: match against gear.yamlName primarily; fall back to link basename if yamlName missing
  const stacks = [];
  for (let i = 0; i < gear.length; i++) {
    const g = gear[i];
    const gQty = Math.max(0, parseInt(g.qty ?? "0", 10) || 0);

    const gYaml = String(g.yamlName ?? "").trim();
    const gName = stripWikiLink(g.name);

    const matches = ammoOptions.some(opt => {
      const o = String(opt).trim();
      if (matchByWeaponName) return gName === o;
      if (gYaml) return gYaml === o;
      return gName === o;
    });

    if (matches) stacks.push({ gearIndex: i, qty: gQty });
  }

  stacks.sort((a, b) => a.qty - b.qty); // “least qty first”
  return { mode: ammoOptions.length > 1 ? "choose" : "single", ammoOptions, stacks };
}

function setStackQty(gearIndex, newQty) {
  const rows = readGearRows();
  if (!rows[gearIndex]) return;

  rows[gearIndex].qty = String(Math.max(0, parseInt(newQty ?? 0, 10) || 0));
  writeGearRows(rows);

  // IMPORTANT: do NOT rerender the weapon table here, or the editor will reset after 1 click.
  // Instead, tell the gear table to refresh so it reflects the new qty.
  window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
}



// One hover/focus arrow treatment for play resources and item counters.
function attachHoverNumberArrows(value, {getValue,setValue,min=0,max=Infinity,step=1,label="Value",disabled=()=>false}) {
  const wrap=document.createElement("div");wrap.className="vk-number-control";
  const arrows=document.createElement("div");arrows.className="vk-number-arrows";
  const up=document.createElement("button"),down=document.createElement("button");
  const bound=limit=>typeof limit==="function" ? limit() : limit;
  const refresh=()=>{
    const amount=Number(getValue())||0,locked=disabled();
    up.disabled=locked || amount>=bound(max);down.disabled=locked || amount<=bound(min);
  };
  const change=direction=>{
    if (disabled()) return;
    const next=Math.min(bound(max),Math.max(bound(min),(Number(getValue())||0)+direction*step));
    setValue(next);refresh();
  };
  for (const [button,direction,glyph,verb] of [[up,1,"▴","Increase"],[down,-1,"▾","Decrease"]]) {
    button.type="button";obsidian.setIcon(button,direction>0 ? "chevron-up" : "chevron-down");button.title=`${verb} ${label}`;
    button.setAttribute("aria-label",`${verb} ${label}`);button.tabIndex=-1;
    guardObsidianClick(button);
    button.onclick=event=>{event.preventDefault();event.stopPropagation();change(direction);};
  }
  arrows.append(up,down);wrap.append(value,arrows);
  wrap.addEventListener("mouseenter",refresh);wrap.addEventListener("focusin",refresh);
  wrap.addEventListener("keydown",event=>{
    if (event.target.tagName==="INPUT" || event.target.tagName==="SELECT") return;
    if (event.key==="ArrowUp" || event.key==="ArrowDown") {
      event.preventDefault();event.stopPropagation();change(event.key==="ArrowUp" ? 1 : -1);
    }
  });
  refresh();return wrap;
}
function attachInputHoverArrows(input) {
  input.classList.add("vk-number-input");
  return attachHoverNumberArrows(input,{
    label:input.getAttribute("aria-label") || "Value",getValue:()=>input.value,
    min:()=>input.min==="" ? 0 : Number(input.min),max:()=>input.max==="" ? Infinity : Number(input.max),
    step:Number(input.step)||1,disabled:()=>input.disabled || input.readOnly,
    setValue:next=>{input.value=String(next);input.dispatchEvent(new Event("input",{bubbles:true}));input.dispatchEvent(new Event("change",{bubbles:true}));}
  });
}
function createPlusMinusDisplay({value=0,min=0,max=999,step=1,onChange,label="Value",commitOnBlur=false}) {
  const num=document.createElement("span");num.className="plusminus-num";num.textContent=String(value ?? min);
  num.tabIndex=0;num.setAttribute("role","spinbutton");num.setAttribute("aria-label",label);
  num.setAttribute("aria-valuemin",String(min));if(Number.isFinite(max))num.setAttribute("aria-valuemax",String(max));
  num.title="Click to edit; use the arrows to adjust";guardObsidianClick(num);
  let editor=null;
  const setValue=next=>{
    const amount=next==="" ? "" : Math.min(max,Math.max(min,Math.round(Number(next)||0)));
    num.textContent=String(amount);num.setAttribute("aria-valuenow",String(amount));
    if (editor) editor.value=String(amount);
    onChange?.(amount);
  };
  const container=attachHoverNumberArrows(num,{getValue:()=>editor ? editor.value : num.textContent,setValue,min,max,step,label});
  container.classList.add("vk-resource-number");num.setAttribute("aria-valuenow",num.textContent);
  const beginEdit=()=>{
    if(editor)return;
    const input=document.createElement("input");input.type="number";input.className="vk-number-input vk-number-editor";
    input.min=String(min);if(Number.isFinite(max))input.max=String(max);input.step=String(step);input.value=num.textContent;
    input.setAttribute("aria-label",`Edit ${label}`);input.addEventListener("pointerdown",event=>event.stopPropagation());
    let finished=false;
    const close=apply=>{
      if(finished)return;finished=true;
      const next=input.value;editor=null;if(input.parentNode===container)input.replaceWith(num);
      if(apply)setValue(next);
    };
    input.onblur=()=>close(commitOnBlur);
    input.onkeydown=event=>{
      if(event.key==="Enter" || event.key==="Escape") {event.preventDefault();event.stopPropagation();close(event.key==="Enter");num.focus();}
    };
    editor=input;num.replaceWith(input);input.focus();input.select();
  };
  num.onclick=event=>{event.stopPropagation();beginEdit();};
  num.addEventListener("keydown",event=>{if(event.key==="Enter" || event.key===" "){event.preventDefault();beginEdit();}});
  return container;
}
function createCompactPlusMinusRow({labelText,initialValue=0,min=0,max=9999,step=1,valueTitle="Click to edit",onChange}) {
  installGlobalCompactPmCloser();
  const wrap=document.createElement("div");wrap.className="vk-resource-row";
  const label=document.createElement("span");label.className="vk-resource-label";label.textContent=labelText;
  const field=createPlusMinusDisplay({value:initialValue,min,max,step,label:String(labelText).replace(/:$/,""),onChange});
  const valueSpan=field.querySelector(".plusminus-num");valueSpan.title=valueTitle;
  const api={wrap,hideEditor:()=>openCompactPMs.delete(api)};
  const showEditor=()=>openCompactPMs.add(api),hideEditor=api.hideEditor;
  field.addEventListener("pointerdown",showEditor,true);
  field.addEventListener("keydown",event=>{if(event.key==="Enter" || event.key==="Escape")hideEditor();});
  wrap.append(label,field);
  return {wrap,valueSpan,field,showEditor,hideEditor};
}


// 4. For later: helper for multi-character storage keys
function getStorageKey(base, character) {
    return character ? `${base}_${character}` : base;
}



const skillToSpecial = { 
    "Athletics": "STR", "Barter": "CHA", "Big Guns": "END", 
    "Energy Weapons": "PER", "Explosives": "PER", "Lockpick": "PER", 
    "Medicine": "INT", "Melee Weapons": "STR", "Pilot": "PER", 
    "Repair": "INT", "Science": "INT", "Small Guns": "AGI", 
    "Sneak": "AGI", "Speech": "CHA", "Survival": "END", 
    "Throwing": "AGI", "Unarmed": "STR" 
};


// ============================================================================
// ACTIVE EFFECTS
// Temporary/current bonuses are stored separately from the character's base
// values. The engine resolves an effective value at read time instead of
// rewriting falloutRPGCharacterSheet.
// ============================================================================

const ACTIVE_EFFECTS_STORAGE_KEY = "fallout_active_effects";

const ACTIVE_EFFECT_TARGET_GROUPS = {
  "SPECIAL": ["STR", "PER", "END", "CHA", "INT", "AGI", "LCK"],
  "Skills": Object.keys(skillToSpecial),
  "Derived Stats": ["Maximum HP", "Initiative", "Defense", "Carry Weight", "Melee Damage", "Luck Points"],
  "Damage Resistance": ["Physical DR", "Energy DR", "Radiation DR", "Poison DR"],
  // Dynamic: populated through the searchable perk picker in the Active Effect editor.
  "Perks": []
};

const ACTIVE_EFFECT_PERK_OPERATIONS = [
  { value: "perk_add", label: "Add Perk" },
  { value: "perk_remove", label: "Remove Perk" },
  { value: "perk_set", label: "Set Rank" }
];

function normalizePerkName(value) {
  return String(value ?? "")
    .replace(/^\[\[/, "")
    .replace(/\]\]$/, "")
    .replace(/^["']|["']$/g, "")
    .trim();
}

function loadStoredPerks() {
  try {
    const parsed = JSON.parse(localStorage.getItem("fallout_perk_table") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getStoredPerkRow(perkName) {
  const wanted = normalizePerkName(perkName).toLowerCase();
  return loadStoredPerks().find(row =>
    normalizePerkName(row?.name).toLowerCase() === wanted
  ) || null;
}

function getPermanentPerkRank(perkName) {
  const row = getStoredPerkRow(perkName);
  if (!row) return 0;
  const rank = Number(row.qty);
  return Number.isFinite(rank) ? Math.max(0, Math.round(rank)) : 0;
}

function getPerkMaxRank(perkName, fallback = 1) {
  const row = getStoredPerkRow(perkName);
  const storedRank = Number(row?.qty);
  const storedMax = Number(row?.maxRank);
  const safeStoredRank = Number.isFinite(storedRank) && storedRank >= 1
    ? Math.round(storedRank)
    : 1;

  // Once source definitions are loaded, the perk file is authoritative for
  // maxRank. The character's owned rank is preserved independently.
  const wanted = normalizePerkName(perkName).toLowerCase();
  if (Array.isArray(cachedPerkData)) {
    const def = cachedPerkData.find(item =>
      normalizePerkName(item?.name).toLowerCase() === wanted
    );
    const sourceMax = Number(def?.maxRank);
    if (Number.isFinite(sourceMax) && sourceMax >= 1) {
      return Math.max(Math.round(sourceMax), safeStoredRank);
    }
  }

  // Before definitions are available, preserve legacy metadata rather than
  // lowering anything.
  if (Number.isFinite(storedMax) && storedMax >= 1) {
    return Math.max(Math.round(storedMax), safeStoredRank);
  }

  const safeFallback = Number(fallback);
  return Math.max(
    safeStoredRank,
    Number.isFinite(safeFallback) && safeFallback >= 1
      ? Math.round(safeFallback)
      : 1
  );
}

function getActivePerkModifiers(perkName) {
  const wanted = normalizePerkName(perkName).toLowerCase();
  const out = [];

  loadActiveEffects().forEach(effect => {
    if (!effect || effect.active === false) return;

    (Array.isArray(effect.modifiers) ? effect.modifiers : []).forEach(modifier => {
      if (modifier?.group !== "Perks") return;
      if (normalizePerkName(modifier?.target).toLowerCase() !== wanted) return;

      out.push({
        effectId: effect.id,
        effectName: String(effect.name || "Unnamed Effect"),
        operation: String(modifier.operation || "perk_add"),
        value: Number(modifier.value) || 0,
        maxRank: Number(modifier.maxRank) || 1
      });
    });
  });

  return out;
}

function getEffectivePerkRank(perkName, permanentRank = null, maxRank = null) {
  const baseRank = permanentRank === null
    ? getPermanentPerkRank(perkName)
    : Math.max(0, Math.round(Number(permanentRank) || 0));

  const modifiers = getActivePerkModifiers(perkName);
  const knownMax = Math.max(
    1,
    Number(maxRank) || 0,
    getPerkMaxRank(perkName, 1),
    ...modifiers.map(mod => Number(mod.maxRank) || 1)
  );

  let rank = baseRank;

  // Set rank first, then grants, then removal. Remove intentionally wins.
  modifiers.forEach(mod => {
    if (mod.operation === "perk_set") {
      rank = Math.max(1, Math.min(knownMax, Math.round(Number(mod.value) || 1)));
    }
  });

  modifiers.forEach(mod => {
    if (mod.operation === "perk_add" && rank <= 0) rank = 1;
  });

  if (modifiers.some(mod => mod.operation === "perk_remove")) rank = 0;

  return {
    base: baseRank,
    effective: Math.max(0, Math.min(knownMax, rank)),
    maxRank: knownMax,
    modifiers
  };
}

const ACTIVE_EFFECT_OPERATIONS = [
  { value: "add", label: "Add" },
  { value: "subtract", label: "Subtract" },
  { value: "multiply", label: "Multiply" },
  { value: "divide", label: "Divide" },
  { value: "set", label: "Set" },
  { value: "minimum", label: "Minimum" },
  { value: "maximum", label: "Maximum" }
];

function makeActiveEffectId() {
  return `effect-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadActiveEffects() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ACTIVE_EFFECTS_STORAGE_KEY) || "[]");
    const effects = Array.isArray(parsed) ? parsed : [];
    let migrated = false;

    effects.forEach(effect => {
      const modifiers = Array.isArray(effect?.modifiers) ? effect.modifiers : [];
      modifiers.forEach(modifier => {
        if (
          String(modifier?.group || "") === "Resources" &&
          String(modifier?.target || "") === "Luck Points"
        ) {
          modifier.group = "Derived Stats";
          migrated = true;
        }
      });
    });

    if (migrated) {
      localStorage.setItem(ACTIVE_EFFECTS_STORAGE_KEY, JSON.stringify(effects));
    }

    return effects;
  } catch {
    return [];
  }
}

function saveActiveEffects(effects) {
  localStorage.setItem(ACTIVE_EFFECTS_STORAGE_KEY, JSON.stringify(Array.isArray(effects) ? effects : []));
}

function getActiveEffectModifiers(target) {
  const wanted = String(target ?? "");
  const out = [];

  loadActiveEffects().forEach(effect => {
    if (!effect || effect.active === false) return;
    const modifiers = Array.isArray(effect.modifiers) ? effect.modifiers : [];

    modifiers.forEach(modifier => {
      if (String(modifier?.target ?? "") !== wanted) return;
      const value = Number(modifier?.value);
      if (!Number.isFinite(value)) return;
      out.push({
        effectId: effect.id,
        effectName: String(effect.name || "Unnamed Effect"),
        source: String(effect.source || ""),
        operation: String(modifier.operation || "add"),
        value
      });
    });
  });

  return out;
}

function applyActiveEffectModifiers(baseValue, target) {
  const base = Number(baseValue);
  const safeBase = Number.isFinite(base) ? base : 0;
  const modifiers = getActiveEffectModifiers(target);

  let value = safeBase;

  // Phase 1: establish bounds/overrides.
  modifiers.forEach(mod => {
    if (mod.operation === "set") value = mod.value;
    else if (mod.operation === "minimum") value = Math.max(value, mod.value);
    else if (mod.operation === "maximum") value = Math.min(value, mod.value);
  });

  // Phase 2: scale.
  modifiers.forEach(mod => {
    if (mod.operation === "multiply") value *= mod.value;
    else if (mod.operation === "divide" && mod.value !== 0) value /= mod.value;
  });

  // Phase 3: ordinary bonuses/penalties.
  modifiers.forEach(mod => {
    if (mod.operation === "add") value += mod.value;
    else if (mod.operation === "subtract") value -= mod.value;
  });

  return {
    base: safeBase,
    effective: value,
    modifiers
  };
}

function getStoredCharacterData() {
  try {
    return JSON.parse(localStorage.getItem("falloutRPGCharacterSheet") || "{}");
  } catch {
    return {};
  }
}

function getBaseNumericCharacterValue(target) {
  const live = document.getElementById(target);
  if (live && live.dataset?.baseValue !== undefined && String(live.dataset.baseValue).trim() !== "") {
    const n = Number(live.dataset.baseValue);
    if (Number.isFinite(n)) return n;
  }

  const stored = getStoredCharacterData();
  const n = Number(stored[target]);
  return Number.isFinite(n) ? n : 0;
}

function getEffectivePrimaryValue(target) {
  return applyActiveEffectModifiers(getBaseNumericCharacterValue(target), target).effective;
}

function isEffectManagedField(target) {
  return [
    ...ACTIVE_EFFECT_TARGET_GROUPS.SPECIAL,
    ...ACTIVE_EFFECT_TARGET_GROUPS.Skills,
    "Luck Points",
    "Maximum HP",
    "Initiative",
    "Defense",
    "MeleeDamage"
  ].includes(String(target ?? ""));
}

function showBaseEffectValuesForPanel(panel) {
  if (!panel) return;

  panel.querySelectorAll("input[id]").forEach(input => {
    if (!isEffectManagedField(input.id)) return;
    if (input.dataset?.baseValue === undefined) return;
    input.value = input.dataset.baseValue;
  });

  panel.querySelectorAll("[data-effect-modified='true']").forEach(host => {
    delete host.dataset.effectModified;
    host.removeAttribute("title");
  });
}

function getBaseDerivedValue(target) {
  const level = getBaseNumericCharacterValue("Level");

  if (target === "Maximum HP") {
    return getBaseNumericCharacterValue("END") + getBaseNumericCharacterValue("LCK") + level - 1;
  }

  if (target === "Initiative") {
    return getBaseNumericCharacterValue("PER") + getBaseNumericCharacterValue("AGI");
  }

  if (target === "Defense") {
    return getBaseNumericCharacterValue("AGI") >= 9 ? 2 : 1;
  }

  if (target === "Carry Weight") {
    return 150 + (getBaseNumericCharacterValue("STR") * 10);
  }

  return getBaseNumericCharacterValue(target);
}

function getEffectiveDerivedValue(target) {
  const level = getBaseNumericCharacterValue("Level");
  let base;

  if (target === "Maximum HP") {
    base = getEffectivePrimaryValue("END") + getEffectivePrimaryValue("LCK") + level - 1;
  } else if (target === "Initiative") {
    base = getEffectivePrimaryValue("PER") + getEffectivePrimaryValue("AGI");
  } else if (target === "Defense") {
    base = getEffectivePrimaryValue("AGI") >= 9 ? 2 : 1;
  } else if (target === "Carry Weight") {
    base = 150 + (getEffectivePrimaryValue("STR") * 10);
  } else {
    base = getBaseNumericCharacterValue(target);
  }

  return applyActiveEffectModifiers(base, target).effective;
}

function meleeDamageDiceFromStrength(str) {
  const n = Number(str) || 0;
  if (n >= 11) return 3;
  if (n >= 9) return 2;
  if (n >= 7) return 1;
  return 0;
}

function meleeDamageDisplayFromDice(dice) {
  const n = Math.max(0, Math.round(Number(dice) || 0));
  return n > 0 ? `+${n}d6` : "-";
}

function getBaseMeleeDamageDice() {
  return meleeDamageDiceFromStrength(getBaseNumericCharacterValue("STR"));
}

function getEffectiveMeleeDamage() {
  const startingDice = meleeDamageDiceFromStrength(getEffectivePrimaryValue("STR"));
  const effected = applyActiveEffectModifiers(startingDice, "Melee Damage").effective;
  return meleeDamageDisplayFromDice(effected);
}

function getEffectSnapshot(target) {
  if (ACTIVE_EFFECT_TARGET_GROUPS.SPECIAL.includes(target) || ACTIVE_EFFECT_TARGET_GROUPS.Skills.includes(target)) {
    const base = getBaseNumericCharacterValue(target);
    const effective = getEffectivePrimaryValue(target);
    return { base, effective };
  }

  if (target === "MeleeDamage") {
    return {
      base: String(document.getElementById("MeleeDamage")?.value ?? "-"),
      effective: getEffectiveMeleeDamage()
    };
  }

  if (["Maximum HP", "Initiative", "Defense", "Carry Weight"].includes(target)) {
    return {
      base: getBaseDerivedValue(target),
      effective: getEffectiveDerivedValue(target)
    };
  }

  return { base: 0, effective: 0 };
}

function formatEffectNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value ?? "");
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}

function getEffectIndicatorHost(target) {
  const statsSection = document.getElementById("stats-section");
  if (!statsSection) return null;
  return [...statsSection.querySelectorAll("[data-effect-target]")]
    .find(el => el.dataset.effectTarget === target) || null;
}

function buildActiveEffectTooltip(target, base, effective) {
  const lines = [`Base: ${formatEffectNumber(base)}`];

  const directModifiers = getActiveEffectModifiers(target);
  directModifiers.forEach(mod => {
    const op = mod.operation === "add" ? `+${formatEffectNumber(mod.value)}`
      : mod.operation === "subtract" ? `-${formatEffectNumber(mod.value)}`
      : mod.operation === "multiply" ? `×${formatEffectNumber(mod.value)}`
      : mod.operation === "divide" ? `÷${formatEffectNumber(mod.value)}`
      : mod.operation === "set" ? `Set ${formatEffectNumber(mod.value)}`
      : mod.operation === "minimum" ? `Minimum ${formatEffectNumber(mod.value)}`
      : mod.operation === "maximum" ? `Maximum ${formatEffectNumber(mod.value)}`
      : `${activeEffectOperationLabel(mod.operation)} ${formatEffectNumber(mod.value)}`;

    lines.push(`${mod.effectName}: ${op}`);
  });

  // Derived stats can also change because a SPECIAL feeding the calculation is modified.
  if (!directModifiers.length && ["Maximum HP", "Initiative", "Defense", "Carry Weight", "Melee Damage"].includes(target)) {
    const dependencyMap = {
      "Maximum HP": ["END", "LCK"],
      "Initiative": ["PER", "AGI"],
      "Defense": ["AGI"],
      "Carry Weight": ["STR"],
      "Melee Damage": ["STR"]
    };

    (dependencyMap[target] || []).forEach(dep => {
      getActiveEffectModifiers(dep).forEach(mod => {
        const op = mod.operation === "add" ? `+${formatEffectNumber(mod.value)}`
          : mod.operation === "subtract" ? `-${formatEffectNumber(mod.value)}`
          : mod.operation === "multiply" ? `×${formatEffectNumber(mod.value)}`
          : mod.operation === "divide" ? `÷${formatEffectNumber(mod.value)}`
          : mod.operation === "set" ? `Set ${formatEffectNumber(mod.value)}`
          : mod.operation === "minimum" ? `Minimum ${formatEffectNumber(mod.value)}`
          : mod.operation === "maximum" ? `Maximum ${formatEffectNumber(mod.value)}`
          : `${activeEffectOperationLabel(mod.operation)} ${formatEffectNumber(mod.value)}`;
        lines.push(`${mod.effectName} (${dep}): ${op}`);
      });
    });
  }

  lines.push(`Effective: ${formatEffectNumber(effective)}`);
  return lines.join("\n");
}

function refreshArmorEffectVisuals() {
  document.querySelectorAll("#fallout-sheet-root .vk-apparel-card").forEach(vkRefreshArmorCard);

  const poisonHost = document.querySelector(
    '#fallout-sheet-root .vk-poison-dr[data-effect-target="Poison DR"]'
  );
  const poisonInput = poisonHost?.querySelector(".vk-poison-dr-value");
  if (poisonHost && poisonInput && document.activeElement !== poisonInput) {
    poisonHost.removeAttribute("data-effect-modified");
    poisonHost.removeAttribute("title");

    const base = Number(localStorage.getItem(POISON_DR_KEY) || 0) || 0;
    const effective = applyActiveEffectModifiers(base, "Poison DR").effective;
    const modified = String(base) !== String(effective);

    poisonInput.value = formatEffectNumber(effective);
    poisonInput.style.setProperty(
      "color",
      modified ? "var(--vk-accent, #f3c64d)" : "var(--vk-text, #f4ead5)",
      "important"
    );

    if (modified) {
      poisonHost.dataset.effectModified = "true";
      poisonHost.title = buildActiveEffectTooltip("Poison DR", base, effective);
    }
  }
}

function refreshActiveEffectVisuals() {
  const statsSection = document.getElementById("stats-section");
  if (!statsSection) {
    refreshArmorEffectVisuals();
    return;
  }

  const isEditingHost = (host) =>
    host?.closest?.(".vk-stats-panel")?.dataset?.editing === "true";

  // Always clear the prior visual state first. This is what guarantees an
  // effect removal immediately returns a value to normal white.
  statsSection.querySelectorAll("[data-effect-target]").forEach(host => {
    delete host.dataset.effectModified;
    host.removeAttribute("title");
  });

  // SPECIAL
  ACTIVE_EFFECT_TARGET_GROUPS.SPECIAL.forEach(target => {
    const host = getEffectIndicatorHost(target);
    const input = document.getElementById(target);
    if (!host || !input || isEditingHost(host)) return;

    const base = getBaseNumericCharacterValue(target);
    const effective = getEffectivePrimaryValue(target);
    input.value = formatEffectNumber(effective);

    if (String(base) !== String(effective)) {
      host.dataset.effectModified = "true";
      host.title = buildActiveEffectTooltip(target, base, effective);
    }
  });

  // Skills
  ACTIVE_EFFECT_TARGET_GROUPS.Skills.forEach(target => {
    const host = getEffectIndicatorHost(target);
    const input = document.getElementById(target);
    if (!host || !input || isEditingHost(host)) return;

    const baseData = getStoredCharacterData();
    const base = Number(input.dataset.baseValue ?? baseData[target] ?? input.value ?? 0) || 0;
    const effective = applyActiveEffectModifiers(base, target).effective;
    input.value = formatEffectNumber(effective);

    if (String(base) !== String(effective)) {
      host.dataset.effectModified = "true";
      host.title = buildActiveEffectTooltip(target, base, effective);
    }
  });

  // Luck Points resource.
  {
    const host = getEffectIndicatorHost("Luck Points");
    const hidden = document.getElementById("LuckPoints");
    const display = host?.querySelector(".plusminus-num");

    if (host && hidden && display) {
      const base = Number(hidden.dataset?.baseValue ?? hidden.value ?? 0) || 0;
      const effective = applyActiveEffectModifiers(base, "Luck Points").effective;
      display.textContent = formatEffectNumber(effective);

      if (String(base) !== String(effective)) {
        host.dataset.effectModified = "true";
        host.title = buildActiveEffectTooltip("Luck Points", base, effective);
      }
    }
  }

  // Numeric derived stats.
  ["Maximum HP", "Initiative", "Defense"].forEach(target => {
    const host = getEffectIndicatorHost(target);
    const input = document.getElementById(target);
    if (!host || !input || isEditingHost(host)) return;

    const base = getBaseDerivedValue(target);
    const effective = getEffectiveDerivedValue(target);
    input.value = formatEffectNumber(effective);

    // Maximum HP uses a hidden persistence input plus a visible compact value.
    if (target === "Maximum HP") {
      const visible = host.querySelector(".vk-status-value");
      if (visible) visible.textContent = formatEffectNumber(effective);
    }

    if (String(base) !== String(effective)) {
      host.dataset.effectModified = "true";
      host.title = buildActiveEffectTooltip(target, base, effective);
    }
  });

  // Melee Damage: compare the true BASE-derived dice to effective dice.
  {
    const host = getEffectIndicatorHost("MeleeDamage");
    const input = document.getElementById("MeleeDamage");
    if (host && input && !isEditingHost(host)) {
      const baseDisplay = meleeDamageDisplayFromDice(getBaseMeleeDamageDice());
      const effective = getEffectiveMeleeDamage();
      input.value = effective;

      if (baseDisplay !== effective) {
        host.dataset.effectModified = "true";
        host.title = buildActiveEffectTooltip(
          "Melee Damage",
          baseDisplay,
          effective
        );
      }
    }
  }

  // Carry Weight: current / effective maximum.
  {
    const maxHost = getEffectIndicatorHost("Carry Weight");
    const maxDisplay = document.getElementById("MaxCarryWeightDisplay");

    const rawBase = getBaseDerivedValue("Carry Weight");
    const effectiveMax = getEffectiveDerivedValue("Carry Weight");

    if (maxDisplay) maxDisplay.textContent = formatWeightNumber(effectiveMax);

    if (maxHost && String(rawBase) !== String(effectiveMax)) {
      maxHost.dataset.effectModified = "true";
      maxHost.title = buildActiveEffectTooltip(
        "Carry Weight",
        rawBase,
        effectiveMax
      );
    }
  }

  refreshArmorEffectVisuals();
}

function refreshActiveEffectsGameplay() {
  // Re-establish base-derived fields from base SPECIAL first. updateDerivedStats
  // finishes by repainting the effective view.
  if (typeof updateDerivedStats === "function") updateDerivedStats();
  else refreshActiveEffectVisuals();

  if (typeof updateCarryWeightDisplay === "function") updateCarryWeightDisplay();
  if (typeof updateWeaponStats === "function") updateWeaponStats();
  if (typeof updateWeaponTableDOM === "function") updateWeaponTableDOM();

  const statsSection = document.getElementById("stats-section");
  if (typeof statsSection?._refreshActiveEffects === "function") {
    statsSection._refreshActiveEffects();
  }

  refreshArmorEffectVisuals();
}

function notifyActiveEffectsChanged() {
  refreshActiveEffectsGameplay();
  window.dispatchEvent(new CustomEvent("fallout:active-effects-updated"));
}

function activeEffectOperationLabel(operation) {
  return ACTIVE_EFFECT_OPERATIONS.find(x => x.value === operation)?.label || operation;
}

function activeEffectModifierSummary(mod) {
  const value = formatEffectNumber(mod.value);

  if (mod.group === "Perks") {
    const perkName = normalizePerkName(mod.target) || "Perk";
    if (mod.operation === "perk_add") return `Add ${perkName}`;
    if (mod.operation === "perk_remove") return `Remove ${perkName}`;
    if (mod.operation === "perk_set") return `${perkName} = Rank ${Math.max(1, Number(mod.value) || 1)}`;
  }

  if (mod.operation === "add") return `${mod.target} +${value}`;
  if (mod.operation === "subtract") return `${mod.target} -${value}`;
  if (mod.operation === "multiply") return `${mod.target} ×${value}`;
  if (mod.operation === "divide") return `${mod.target} ÷${value}`;
  if (mod.operation === "set") return `${mod.target} = ${value}`;
  if (mod.operation === "minimum") return `${mod.target} min ${value}`;
  if (mod.operation === "maximum") return `${mod.target} max ${value}`;
  return `${mod.target} ${value}`;
}

function showActiveEffectEditor(existingEffect, onSave) {
  const editing = !!existingEffect;
  const draft = existingEffect
    ? JSON.parse(JSON.stringify(existingEffect))
    : {
        id: makeActiveEffectId(),
        name: "",
        source: "",
        active: true,
        durationUnit: "manual",
        durationLength: "",
        notes: "",
        modifiers: [{
          group: "SPECIAL",
          target: "STR",
          operation: "add",
          value: 1
        }]
      };

  if (!Array.isArray(draft.modifiers) || !draft.modifiers.length) {
    draft.modifiers = [{ group: "SPECIAL", target: "STR", operation: "add", value: 1 }];
  }

  const overlay = document.createElement("div");
  overlay.className = "vk-modal-overlay";

  const modal = document.createElement("div");
  modal.className = "vk-modal vk-effect-editor-modal";

  const title = document.createElement("div");
  title.className = "vk-effect-editor-title";
  title.textContent = editing ? "Edit Active Effect" : "Add Active Effect";

  const form = document.createElement("div");
  form.className = "vk-effect-editor-form";

  function makeField(labelText, control) {
    const wrap = document.createElement("label");
    wrap.className = "vk-effect-editor-field";
    const label = document.createElement("span");
    label.textContent = labelText;
    wrap.append(label, control);
    return wrap;
  }

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = draft.name || "";
  nameInput.placeholder = "e.g. Buffout, Power Armor Frame";

  const durationSelect = document.createElement("select");
  [
    ["manual", "Manual"],
    ["round", "Rounds"],
    ["scene", "Scene"],
    ["permanent", "Permanent"]
  ].forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    durationSelect.appendChild(option);
  });
  durationSelect.value = draft.durationUnit || "manual";

  const durationLengthInput = document.createElement("input");
  durationLengthInput.type = "number";
  durationLengthInput.min = "1";
  durationLengthInput.value = draft.durationLength ?? "";
  durationLengthInput.placeholder = "Length";

  const durationRow = document.createElement("div");
  durationRow.className = "vk-effect-duration-row";
  durationRow.append(durationSelect, durationLengthInput);

  const notesInput = document.createElement("textarea");
  notesInput.rows = 3;
  notesInput.value = draft.notes || "";
  notesInput.placeholder = "Optional notes or conditions";

  form.append(
    makeField("Effect Name", nameInput),
    makeField("Duration", durationRow)
  );

  const modifierSection = document.createElement("div");
  modifierSection.className = "vk-effect-modifier-section";

  const modifierHeader = document.createElement("div");
  modifierHeader.className = "vk-effect-modifier-header";
  modifierHeader.textContent = "Modifiers";

  const modifierList = document.createElement("div");
  modifierList.className = "vk-effect-modifier-list";

  function renderModifierRows() {
    modifierList.innerHTML = "";

    draft.modifiers.forEach((modifier, index) => {
      const row = document.createElement("div");
      row.className = "vk-effect-modifier-edit-row";

      const groupSelect = document.createElement("select");
      Object.keys(ACTIVE_EFFECT_TARGET_GROUPS).forEach(group => {
        const option = document.createElement("option");
        option.value = group;
        option.textContent = group;
        groupSelect.appendChild(option);
      });

      if (!ACTIVE_EFFECT_TARGET_GROUPS.hasOwnProperty(modifier.group)) {
        modifier.group = "SPECIAL";
      }
      groupSelect.value = modifier.group;

      const targetHost = document.createElement("div");
      targetHost.style.cssText = "min-width:0;";

      const operationSelect = document.createElement("select");
      const valueHost = document.createElement("div");
      valueHost.style.cssText = "min-width:72px;";

      function populateOperations() {
        operationSelect.innerHTML = "";
        const operations = modifier.group === "Perks"
          ? ACTIVE_EFFECT_PERK_OPERATIONS
          : ACTIVE_EFFECT_OPERATIONS;

        operations.forEach(op => {
          const option = document.createElement("option");
          option.value = op.value;
          option.textContent = op.label;
          operationSelect.appendChild(option);
        });

        const valid = operations.some(op => op.value === modifier.operation);
        if (!valid) {
          modifier.operation = modifier.group === "Perks" ? "perk_add" : "add";
        }
        operationSelect.value = modifier.operation;
      }

      function renderValueControl() {
        valueHost.innerHTML = "";

        if (modifier.group === "Perks") {
          if (modifier.operation !== "perk_set") {
            const placeholder = document.createElement("span");
            placeholder.textContent = "—";
            placeholder.style.cssText = "display:block;text-align:center;opacity:.55;";
            valueHost.appendChild(placeholder);
            return;
          }

          const maxRank = Math.max(1, Number(modifier.maxRank) || getPerkMaxRank(modifier.target, 1));
          modifier.maxRank = maxRank;

          const rankSelect = document.createElement("select");
          for (let rank = 1; rank <= maxRank; rank++) {
            const option = document.createElement("option");
            option.value = String(rank);
            option.textContent = `Rank ${rank}`;
            rankSelect.appendChild(option);
          }

          const safeRank = Math.max(1, Math.min(maxRank, Number(modifier.value) || 1));
          modifier.value = safeRank;
          rankSelect.value = String(safeRank);
          rankSelect.onchange = () => {
            modifier.value = Number(rankSelect.value) || 1;
          };

          valueHost.appendChild(rankSelect);
          return;
        }

        const valueInput = document.createElement("input");
        valueInput.type = "number";
        valueInput.step = "1";
        valueInput.value = Number.isFinite(Number(modifier.value)) ? String(modifier.value) : "0";
        valueInput.oninput = () => modifier.value = Number(valueInput.value || 0);
        valueHost.appendChild(valueInput);
      }

      function renderTargetControl() {
        targetHost.innerHTML = "";

        if (modifier.group === "Perks") {
          const selected = document.createElement("div");
          selected.style.cssText = `
            min-height:30px;
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            padding:5px 8px;
            margin-bottom:5px;
            border:1px solid rgba(83,127,155,.42);
            border-radius:6px;
            background:#10283a;
          `;

          const selectedName = document.createElement("span");
          selectedName.textContent = modifier.target
            ? normalizePerkName(modifier.target)
            : "No perk selected";
          selectedName.style.cssText = modifier.target
            ? "color:#f4ead5;font-weight:700;"
            : "color:#aebdca;";

          const rankMeta = document.createElement("span");
          rankMeta.textContent = modifier.target
            ? `Max ${Math.max(1, Number(modifier.maxRank) || getPerkMaxRank(modifier.target, 1))}`
            : "";
          rankMeta.style.cssText = "color:#aebdca;font-size:11px;";

          selected.append(selectedName, rankMeta);

          const perkSearch = createSearchBar({
            fetchItems: fetchPerkData,
            onSelect: item => {
              const perkName = normalizePerkName(item?.name);
              if (!perkName) return;

              modifier.target = perkName;
              modifier.maxRank = Math.max(1, Number(item?.maxRank) || 1);

              if (modifier.operation === "perk_set") {
                modifier.value = Math.max(
                  1,
                  Math.min(modifier.maxRank, Number(modifier.value) || 1)
                );
              } else {
                modifier.value = 0;
              }

              renderModifierRows();
            }
          });

          const perkSearchInput = perkSearch.querySelector("input");
          if (perkSearchInput) perkSearchInput.placeholder = "Search perks...";

          targetHost.append(selected, perkSearch);
          return;
        }

        const targetSelect = document.createElement("select");
        const targets = ACTIVE_EFFECT_TARGET_GROUPS[modifier.group] || [];

        targets.forEach(target => {
          const option = document.createElement("option");
          option.value = target;
          option.textContent = target;
          targetSelect.appendChild(option);
        });

        if (!targets.includes(modifier.target)) modifier.target = targets[0] || "";
        targetSelect.value = modifier.target;
        targetSelect.onchange = () => modifier.target = targetSelect.value;
        targetHost.appendChild(targetSelect);
      }

      populateOperations();
      renderTargetControl();
      renderValueControl();

      groupSelect.onchange = () => {
        modifier.group = groupSelect.value;

        if (modifier.group === "Perks") {
          modifier.target = "";
          modifier.operation = "perk_add";
          modifier.value = 0;
          modifier.maxRank = 1;
        } else {
          const targets = ACTIVE_EFFECT_TARGET_GROUPS[modifier.group] || [];
          modifier.target = targets[0] || "";
          modifier.operation = "add";
          modifier.value = 1;
          delete modifier.maxRank;
        }

        renderModifierRows();
      };

      operationSelect.onchange = () => {
        modifier.operation = operationSelect.value;
        if (modifier.group === "Perks") {
          modifier.value = modifier.operation === "perk_set"
            ? Math.max(1, Number(modifier.value) || 1)
            : 0;
        }
        renderValueControl();
      };

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "vk-effect-remove-modifier";
      styleEquipmentActionIcon(removeBtn,"remove");
      removeBtn.title = "Remove modifier";
      removeBtn.disabled = draft.modifiers.length <= 1;
      removeBtn.onclick = () => {
        if (draft.modifiers.length <= 1) return;
        draft.modifiers.splice(index, 1);
        renderModifierRows();
      };

      row.append(groupSelect, targetHost, operationSelect, valueHost, removeBtn);
      modifierList.appendChild(row);
    });
  }

  const addModifierBtn = document.createElement("button");
  addModifierBtn.type = "button";
  addModifierBtn.className = "vk-effect-add-modifier";
  addModifierBtn.textContent = "+ Add Modifier";
  addModifierBtn.onclick = () => {
    const previousGroup = draft.modifiers[draft.modifiers.length - 1]?.group || "SPECIAL";
    const targets = ACTIVE_EFFECT_TARGET_GROUPS[previousGroup] || ACTIVE_EFFECT_TARGET_GROUPS.SPECIAL;
    draft.modifiers.push({
      group: previousGroup,
      target: targets[0],
      operation: "add",
      value: 1
    });
    renderModifierRows();
  };

  modifierSection.append(modifierHeader, modifierList, addModifierBtn);
  form.append(modifierSection, makeField("Notes", notesInput));

  const actions = document.createElement("div");
  actions.className = "vk-effect-editor-actions";

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.textContent = "Save Effect";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Cancel";

  cancelBtn.onclick = () => overlay.remove();

  saveBtn.onclick = () => {
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      return;
    }

    draft.name = name;
    draft.durationUnit = durationSelect.value;
    draft.durationLength = durationLengthInput.value === ""
      ? ""
      : Math.max(1, parseInt(durationLengthInput.value, 10) || 1);
    draft.notes = notesInput.value.trim();
    draft.active = draft.active !== false;

    draft.modifiers = draft.modifiers
      .filter(mod => mod.group !== "Perks" || normalizePerkName(mod.target))
      .map(mod => {
        const saved = {
          group: mod.group,
          target: mod.group === "Perks" ? normalizePerkName(mod.target) : mod.target,
          operation: mod.operation,
          value: Number(mod.value) || 0
        };

        if (mod.group === "Perks") {
          saved.maxRank = Math.max(1, Number(mod.maxRank) || getPerkMaxRank(mod.target, 1));
        }

        return saved;
      });

    overlay.remove();
    onSave(draft);
  };

  actions.append(cancelBtn, saveBtn);
  modal.append(title, form, actions);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  renderModifierRows();
  durationLengthInput.style.display = ["round", "scene"].includes(durationSelect.value) ? "" : "none";
  durationSelect.onchange = () => {
    durationLengthInput.style.display = ["round", "scene"].includes(durationSelect.value) ? "" : "none";
  };

  setTimeout(() => nameInput.focus(), 0);
}

// Read-only equipment rules: source text stays in the vault, outside stored stat modifiers.
function vkEquippedSpecialGroups() {
  const groups=[], weapon=getEquippedWeapon();
  if(weapon)groups.push({key:`weapon:${weapon.instanceId}`,kind:"weapon",slots:["Equipped weapon"],item:weapon});
  for(const [isPower,sections] of [[false,ARMOR_SECTIONS],[true,PA_ARMOR_SECTIONS]]) {
    const instances=new Map();
    for(const section of sections) {
      const item=isPower?loadPowerArmorData(section):loadArmorData(section);
      if(!String(item.apparel || "").trim())continue;
      const key=item.instanceId ? `${isPower}:${item.instanceId}` : `${isPower}:${section}`;
      const existing=instances.get(key);
      if(existing){existing.slots.push(section);continue;}
      const group={key:`apparel:${key}`,kind:isPower?"power":"armor",slots:[section],item};instances.set(key,group);groups.push(group);
    }
  }
  return groups;
}
async function vkReadApparelSpecialSources(item, trackedPaths) {
  const file=vkApparelSourceFile(item), sources=[];
  const read=async(file,label)=>{
    if(!file)return;
    trackedPaths.add(file.path);
    try {
      const text=readWeaponGameEffects(await app.vault.read(file));
      if(hasCombatDisplayValue(text))sources.push({label,text,id:file.path});
    }catch(error){console.warn("Vault-Kit: could not read equipped apparel Special",error);}
  };
  await read(file,sourceDisplayName({sourcePath:file?.path,rawLink:item.apparel,fallbackName:"Apparel"}));
  for(const addon of item.addons || []) {
    const path=String(addon.id || "");if(path)trackedPaths.add(path);
    const target=noteTargetFromSource({rawLink:addon.link,fallbackName:addon.basename || "Modification"});
    const modFile=(path && app.vault.getAbstractFileByPath(path)) || app.metadataCache?.getFirstLinkpathDest?.(target,file?.path || "");
    await read(modFile,sourceDisplayName({sourcePath:modFile?.path,rawLink:addon.link,fallbackName:addon.basename || "Modification"}));
  }
  return sources;
}
function renderEquipmentSpecialEffectsCard() {
  const card=document.createElement("section");card.className="vk-equipment-specials vk-content-card";
  const heading=document.createElement("h3");heading.className="vk-effects-card-heading";heading.textContent="Special Effects";
  const list=document.createElement("div");list.className="vk-equipment-specials-list";list.setAttribute("aria-label","Special effects from equipped equipment");
  card.append(heading,list);weaponViewLinks(card);
  let disposed=false,version=0,owner=null,fingerprint="",queued=false,forceQueued=false,trackedPaths=new Set();
  const expanded=new Map(), vaultRefs=[];
  const refresh=async(force=false)=>{
    if(disposed)return;
    const groups=vkEquippedSpecialGroups();
    const next=JSON.stringify(groups.map(({key,slots,item})=>[key,slots,item.sourcePath,item.apparel,item.link,item.instanceName,item.generatedName,item.selectedAmmoPath,(item.addons || []).map(a=>[a.id,a.link])]));
    if(!force && next===fingerprint)return;
    fingerprint=next;const current=++version,paths=new Set();
    try {
      const entries=await Promise.all(groups.map(async group=>{
        if(group.item.sourcePath)paths.add(group.item.sourcePath);
        for(const addon of group.item.addons || [])if(addon.id)paths.add(addon.id);
        if(group.item.selectedAmmoPath)paths.add(group.item.selectedAmmoPath);
        const sources=group.kind==="weapon" ? await loadWeaponSpecialSources(group.item,{includeAmmo:true}) : await vkReadApparelSpecialSources(group.item,paths);
        for(const source of sources)if(source.id)paths.add(source.id);
        return {...group,sources};
      }));
      if(disposed || current!==version)return;
      const stagedOwner=new obsidian.Component();stagedOwner.load();
      try {
        const fragment=document.createDocumentFragment();
        for(const entry of entries.filter(entry=>entry.sources.length)) {
          const details=document.createElement("details");details.className="vk-equipment-special-group";details.dataset.specialGroup=entry.key;details.open=expanded.get(entry.key) ?? false;
          details.ontoggle=()=>{if(details.isConnected)expanded.set(entry.key,details.open);};
          const summary=document.createElement("summary");vkDisclosureIcon(summary);
          const title=document.createElement("span");title.className="vk-equipment-special-name";
          const item=entry.item, path=item.sourcePath || entry.sources[0]?.id || "";
          const name=entry.kind==="weapon"?vkWeaponDisplayName(item):String(item.instanceName || item.generatedName || sourceDisplayName({sourcePath:item.sourcePath,rawLink:item.apparel,fallbackName:"Apparel"}));
          appendSourceWikiLink(title,item.link || item.apparel || "",name,path,"",name);
          const slot=document.createElement("span");slot.className="vk-equipment-special-slot";slot.textContent=entry.kind==="weapon"?"Equipped weapon":`${entry.kind==="power"?"Power armor":"Armor"} · ${entry.slots.join(", ")}`;
          summary.append(title,slot);details.append(summary);
          const body=document.createElement("div");body.className="vk-equipment-special-body";
          for(const source of entry.sources) {
            const region=document.createElement("div");region.className="vk-equipment-special-source";region.dataset.weaponSourcePath=source.id || path;
            if(source.id!==path){
              const label=document.createElement("div");label.className="vk-equipment-special-source-name";
              appendSourceWikiLink(label,"",source.label,source.id,"",source.label);region.append(label);
            }
            const text=document.createElement("div");await renderMarkdownInto(text,source.text,source.id || path,stagedOwner);region.append(text);body.append(region);
          }
          details.append(body);fragment.append(details);
        }
        if(!fragment.childNodes.length){const empty=document.createElement("div");empty.className="vk-active-effects-empty";empty.textContent="No Special effects from equipped equipment.";fragment.append(empty);}
        if(disposed || current!==version){stagedOwner.unload();return;}
        owner?.unload();owner=stagedOwner;trackedPaths=paths;list.replaceChildren(fragment);
      }catch(error){stagedOwner.unload();throw error;}
    }catch(error){
      if(!disposed && current===version){fingerprint="";console.warn("Vault-Kit: could not refresh equipment Special effects",error);list.textContent="Equipment Special effects could not be loaded.";}
    }
  };
  const schedule=(force=false)=>{forceQueued=forceQueued || force;if(queued || disposed)return;queued=true;queueMicrotask(()=>{queued=false;const force=forceQueued;forceQueued=false;refresh(force);});};
  const onEquipment=()=>schedule();
  window.addEventListener("fallout:equipment-special-updated",onEquipment);window.addEventListener("fallout:gear-updated",onEquipment);
  if(app.vault.on)for(const event of ["modify","delete","rename"])vaultRefs.push(app.vault.on(event,(file,oldPath)=>{if(trackedPaths.has(file?.path)||trackedPaths.has(oldPath))schedule(true);}));
  const dispose=()=>{
    if(disposed)return;disposed=true;version++;owner?.unload();owner=null;
    window.removeEventListener("fallout:equipment-special-updated",onEquipment);window.removeEventListener("fallout:gear-updated",onEquipment);
    for(const ref of vaultRefs)app.vault.offref?.(ref);observer.disconnect();
  };
  let connected=false;
  const observer=new MutationObserver(()=>{if(card.isConnected)connected=true;else if(connected)dispose();});observer.observe(document.body,{childList:true,subtree:true});
  sheetcontainer._disposeSpecialEffects?.();sheetcontainer._disposeSpecialEffects=dispose;
  schedule(true);return card;
}

function renderActiveEffectsSection() {
  const panel = document.createElement("div");
  panel.className = "vk-active-effects-panel vk-content-card";
  const heading=document.createElement("h3");heading.className="vk-effects-card-heading";heading.textContent="Stat Modifiers";panel.append(heading);

  const toolbar = document.createElement("div");
  toolbar.className = "vk-active-effects-toolbar";

  const hint = document.createElement("div");
  hint.className = "vk-active-effects-hint";
  hint.textContent = "Active effects modify effective values without changing the character's stored base stats.";

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "vk-active-effect-add";
  addBtn.textContent = "+ Add Effect";

  toolbar.append(hint, addBtn);

  const list = document.createElement("div");
  list.className = "vk-active-effects-list";

  function render() {
    const effects = loadActiveEffects();
    list.innerHTML = "";

    if (!effects.length) {
      const empty = document.createElement("div");
      empty.className = "vk-active-effects-empty";
      empty.textContent = "No active effects.";
      list.appendChild(empty);
      return;
    }

    effects.forEach((effect, index) => {
      const card = document.createElement("div");
      card.className = "vk-active-effect-card";
      card.dataset.active = effect.active === false ? "false" : "true";

      const head = document.createElement("div");
      head.className = "vk-active-effect-head";

      const identity = document.createElement("div");
      identity.className = "vk-active-effect-identity";

      const name = document.createElement("div");
      name.className = "vk-active-effect-name";
      name.textContent = effect.name || "Unnamed Effect";

      const meta = document.createElement("div");
      meta.className = "vk-active-effect-meta";
      const metaParts = [];

      const durationUnit = String(effect.durationUnit || "manual");
      if (durationUnit === "round") metaParts.push(`${effect.durationLength || "?"} Round${Number(effect.durationLength) === 1 ? "" : "s"}`);
      else if (durationUnit === "scene") {
        metaParts.push(effect.durationLength ? `${effect.durationLength} Scene${Number(effect.durationLength) === 1 ? "" : "s"}` : "Scene");
      } else if (durationUnit === "permanent") metaParts.push("Permanent");
      else metaParts.push("Manual");

      meta.textContent = metaParts.join(" • ");
      identity.append(name, meta);

      const controls = document.createElement("div");
      controls.className = "vk-active-effect-controls";

      const activeLabel = document.createElement("label");
      activeLabel.className = "vk-active-effect-toggle";

      const activeCheckbox = document.createElement("input");
      activeCheckbox.type = "checkbox";
      activeCheckbox.checked = effect.active !== false;

      const activeText = document.createElement("span");
      activeText.textContent = "Active";

      activeCheckbox.onchange = () => {
        const current = loadActiveEffects();
        if (!current[index]) return;
        current[index].active = activeCheckbox.checked;
        saveActiveEffects(current);
        render();
        notifyActiveEffectsChanged();
      };

      activeLabel.append(activeCheckbox, activeText);

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      styleEquipmentActionIcon(editBtn,"edit");
      editBtn.onclick = () => {
        showActiveEffectEditor(effect, updated => {
          const current = loadActiveEffects();
          const matchIndex = current.findIndex(x => x.id === effect.id);
          if (matchIndex >= 0) current[matchIndex] = updated;
          saveActiveEffects(current);
          render();
          notifyActiveEffectsChanged();
        });
      };

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "vk-active-effect-delete";
      styleEquipmentActionIcon(removeBtn,"remove");
      removeBtn.onclick = () => {
        showConfirm(
          `Delete active effect "${effect.name || "Unnamed Effect"}"?`,
          () => {
            const current = loadActiveEffects().filter(x => x.id !== effect.id);
            saveActiveEffects(current);
            render();
            notifyActiveEffectsChanged();
          }
        );
      };

      controls.append(activeLabel, editBtn, removeBtn);

      const modifiers = document.createElement("div");
      modifiers.className = "vk-active-effect-modifiers";

      (effect.modifiers || []).forEach(mod => {
        const chip = document.createElement("span");
        chip.className = "vk-active-effect-modifier-chip";
        chip.textContent = activeEffectModifierSummary(mod);
        modifiers.appendChild(chip);
      });

      head.append(identity, modifiers, controls);
      card.append(head);

      if (effect.notes) {
        const notes = document.createElement("div");
        notes.className = "vk-active-effect-notes";
        notes.textContent = effect.notes;
        card.appendChild(notes);
      }

      list.appendChild(card);
    });
  }

  addBtn.onclick = () => {
    showActiveEffectEditor(null, effect => {
      const effects = loadActiveEffects();
      effects.push(effect);
      saveActiveEffects(effects);
      render();
      notifyActiveEffectsChanged();
    });
  };

  panel.append(toolbar, list);
  render();
  const section=document.createElement("div");section.className="vk-active-effects-cards";
  section.append(renderEquipmentSpecialEffectsCard(),panel);return section;
}



//--------------------------------------------------------------------------------------------

const NORMAL_ARMOR_SECTIONS = ["Head", "Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Outfit"];

function calculateInventoryWeight() {
  let rows = [];
  try { rows = JSON.parse(localStorage.getItem("fallout_gear_table") || "[]"); } catch {}
  return rows.reduce((sum, item) => {
    const qty = isChargeTrackedCore(item)
      ? (Array.isArray(item.chargeUnits) ? item.chargeUnits.length : 0)
      : Math.max(1, parseInt(item.qty ?? "1", 10) || 1);
    return sum + (parseItemWeight(vkWeaponConditionView(item).weight) * qty);
  }, 0);
}

function calculateEquippedWeaponWeight() {
  let rows = [];
  try { rows = JSON.parse(localStorage.getItem("fallout_weapon_table") || "[]"); } catch {}
  return rows.reduce((sum, item) => sum + (item.consumableRef ? 0 : parseItemWeight(vkWeaponConditionView(item).weight)), 0);
}

function calculateEquippedArmorWeight() {
  return NORMAL_ARMOR_SECTIONS.reduce((sum, section) => {
    try {
      const stored = JSON.parse(localStorage.getItem(`fallout_armor_data_${section}`) || "{}");
      if (!String(stored.apparel ?? "").trim()) return sum;
      return sum + parseItemWeight(stored.weight);
    } catch {
      return sum;
    }
  }, 0);
}

function calculateCurrentCarryWeight() {
  return calculateInventoryWeight() + calculateEquippedWeaponWeight() + calculateEquippedArmorWeight();
}

function updateCarryWeightDisplay() {
  const baseStrength = typeof getBaseNumericCharacterValue === "function"
    ? getBaseNumericCharacterValue("STR")
    : (parseInt(document.getElementById("STR")?.value, 10) || 0);

  const rawBase = 150 + (baseStrength * 10);
  const max = typeof getEffectiveDerivedValue === "function"
    ? getEffectiveDerivedValue("Carry Weight")
    : rawBase;
  const current = calculateCurrentCarryWeight();

  const maxEl = document.getElementById("MaxCarryWeightDisplay");
  const currentEl = document.getElementById("CurrentCarryWeightDisplay");
  const blockEl = document.getElementById("CarryWeightBlock");
  const penaltyEl = document.getElementById("CarryWeightPenalty");

  if (maxEl) maxEl.textContent = formatWeightNumber(max);
  if (currentEl) currentEl.textContent = formatWeightNumber(current);

  const over = Math.max(0, current - max);
  const overEncumbered = over > 0;
  const immobile = max > 0 && current >= (max * 2);

  if (blockEl) {
    blockEl.style.borderColor = overEncumbered ? "#ff665c" : "#efdd6f";
    blockEl.style.backgroundColor = overEncumbered ? "#4f2525" : "transparent";
  }

  if (currentEl) {
    currentEl.style.color = overEncumbered ? "#ff8b80" : "#f4ead5";
  }

  if (penaltyEl) {
    if (!overEncumbered) {
      penaltyEl.style.display = "none";
      penaltyEl.textContent = "";
    } else {
      penaltyEl.style.display = "block";

      if (immobile) {
        penaltyEl.innerHTML = `<strong>Over by ${formatWeightNumber(over)} lbs.</strong><br>` +
          `At twice your carry weight: you cannot move, automatically fail Strength- or Agility-based skill tests, and your Initiative is 0.`;
      } else {
        const penaltyLevel = 1 + Math.floor(over / 50);
        penaltyEl.innerHTML = `<strong>Over by ${formatWeightNumber(over)} lbs.</strong><br>` +
          `Strength- and Agility-based tests are +${penaltyLevel} difficulty; you cannot Sprint; Initiative is reduced by ${penaltyLevel}.`;
      }
    }
  }
}

const builder = engine.markdown.createBuilder();
const STORAGE_KEY = 'falloutRPGCharacterSheet'; 
const inputs = {};

const saveInputs = () => {
  // Start from what is already saved so we don't "wipe" keys that are temporarily missing
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  for (const key of Object.keys(inputs)) {
    const el = inputs[key];
    if (!el) continue; // don't delete prior saved values just because element isn't present right now

    if (el.type === "checkbox") {
      existing[key] = !!el.checked;
    } else {
      const effectManagedTargets = new Set([
        "STR", "PER", "END", "CHA", "INT", "AGI", "LCK",
        ...Object.keys(skillToSpecial),
        "Maximum HP", "Initiative", "MeleeDamage", "Defense"
      ]);

      existing[key] = effectManagedTargets.has(key) && el.dataset?.baseValue !== undefined
        ? el.dataset.baseValue
        : (el.value ?? "");
    }
  }

  // Preserve your LuckPoints manual flag behavior
  if (inputs.LuckPoints && inputs.LuckPoints.dataset.manual === "true") {
    existing.LuckPointsManual = true;
  } else {
    delete existing.LuckPointsManual;
  }
  // Derived stats are formula-only. Remove all legacy manual override flags.
  delete existing.MaximumHPManual;
  delete existing.InitiativeManual;
  delete existing.DefenseManual;
  delete existing.MeleeDamageManual;
	
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};


const loadInputs = () => { 
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    const legacyDerivedManualFlags = [
        "MaximumHPManual",
        "InitiativeManual",
        "DefenseManual",
        "MeleeDamageManual"
    ];
    let cleanedLegacyDerivedFlags = false;
    legacyDerivedManualFlags.forEach(flag => {
        if (data[flag] !== undefined) {
            delete data[flag];
            cleanedLegacyDerivedFlags = true;
        }
    });
    if (cleanedLegacyDerivedFlags) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    Object.entries(inputs).forEach(([key, input]) => { 
        if (input.type === "checkbox") input.checked = data[key] ?? false;
        else {
            input.value = data[key] ?? "";
            input.dataset.baseValue = input.value;
        }
        ["Maximum HP", "Initiative", "Defense", "MeleeDamage"].forEach(id => {
            if (inputs[id]) delete inputs[id].dataset.manual;
        });
    });
    sheetcontainer.querySelectorAll(".vk-skills").forEach(panel => syncSkillTagBadges(panel));
    // --- Luck Points manual flag ---
    if (inputs.LuckPoints) {
        if (data.LuckPointsManual) {
            inputs.LuckPoints.dataset.manual = "true";
        } else {
            delete inputs.LuckPoints.dataset.manual;
        }
    }
    // Force HP UI + bar to refresh after values are loaded
	setTimeout(() => {
	  document.getElementById("Maximum HP")?.dispatchEvent(new Event("input", { bubbles: true }));
	  document.getElementById("RadDMG")?.dispatchEvent(new Event("input", { bubbles: true }));
	  document.getElementById("CurrentHP")?.dispatchEvent(new Event("input", { bubbles: true }));
	}, 0);

    updateDerivedStats();
};


const updateDerivedStats = () => { 
    const baseNumber = (id) => {
        const el = inputs[id];
        if (!el) return 0;
        const raw = el.dataset?.baseValue !== undefined && el.dataset.baseValue !== ""
            ? el.dataset.baseValue
            : el.value;
        return parseInt(raw, 10) || 0;
    };

    const end = baseNumber("END");
    const lck = baseNumber("LCK");
    const per = baseNumber("PER");
    const agi = baseNumber("AGI");
    const str = baseNumber("STR");
    const level = baseNumber("Level");

    // Luck Points remains a play resource. Keep its existing manual behavior,
    // but derive it from BASE LCK rather than an effect-painted display value.
    if (inputs["LuckPoints"] && (!inputs["LuckPoints"].dataset?.manual || inputs["LuckPoints"].value === "")) {
        inputs["LuckPoints"].value = String(lck);
        inputs["LuckPoints"].dataset.baseValue = String(lck);
    }

    if (inputs["Maximum HP"]) {
        const computed = end + lck + level - 1;
        delete inputs["Maximum HP"].dataset.manual;
        inputs["Maximum HP"].dataset.baseValue = String(computed);
        inputs["Maximum HP"].value = String(computed);
    }

    if (inputs["Initiative"]) {
        const computed = per + agi;
        delete inputs["Initiative"].dataset.manual;
        inputs["Initiative"].dataset.baseValue = String(computed);
        inputs["Initiative"].value = String(computed);
    }

    if (inputs["Defense"]) {
        const computed = agi >= 9 ? 2 : 1;
        delete inputs["Defense"].dataset.manual;
        inputs["Defense"].dataset.baseValue = String(computed);
        inputs["Defense"].value = String(computed);
    }

    if (inputs["MeleeDamage"]) {
        const meleeDamage = meleeDamageDisplayFromDice(meleeDamageDiceFromStrength(str));
        delete inputs["MeleeDamage"].dataset.manual;
        inputs["MeleeDamage"].dataset.baseValue = meleeDamage;
        inputs["MeleeDamage"].value = meleeDamage;
    }

    saveInputs();
    updateCarryWeightDisplay();

    if (typeof refreshActiveEffectVisuals === "function") {
        refreshActiveEffectVisuals();
    }
};


// --- Helper: read effective SPECIAL & skills from DOM
function getCharacterStats() { 
    let stats = {}; 
    ["STR", "PER", "END", "CHA", "INT", "AGI", "LCK"].forEach(stat => { 
        const baseValue = parseInt(document.getElementById(stat)?.value) || 0;
        stats[stat] = typeof getEffectivePrimaryValue === "function"
            ? getEffectivePrimaryValue(stat)
            : baseValue;
    }); 
    let skills = {}; 
    Object.keys(skillToSpecial).forEach(skill => { 
        const baseSkillValue = parseInt(document.getElementById(skill)?.value) || 0;
        const skillValue = typeof getEffectivePrimaryValue === "function"
            ? getEffectivePrimaryValue(skill)
            : baseSkillValue;
        let tagged = document.getElementById(`${skill}Tag`)?.checked || false; 
        skills[skill] = { 
            value: skillValue, 
            tagged: tagged 
        };
    }); 
    return { stats, skills }; 
}

// --- Helper: calculate TN & Tag for a skill
window.calculateWeaponStats = function(weaponSkill) {
    let { stats, skills } = getCharacterStats();

    if (!skills[weaponSkill]) return { TN: "N/A", Tag: false };

    let skillValue = skills[weaponSkill].value;
    let specialStat = skillToSpecial[weaponSkill];
    let specialValue = stats[specialStat] || 0;

    let calculatedTN = skillValue + specialValue;
    let calculatedTag = skills[weaponSkill].tagged;
    const baseTN = getBaseNumericCharacterValue(weaponSkill) + getBaseNumericCharacterValue(specialStat);
    const tnModified = Number(calculatedTN) !== Number(baseTN);

    return {
        TN: calculatedTN,
        baseTN,
        tnModified,
        skill: weaponSkill,
        special: specialStat,
        skillRank: skillValue,
        baseSkillRank: getBaseNumericCharacterValue(weaponSkill),
        Tag: calculatedTag
    };
};




function updateWeaponStats() {
    let weapons = JSON.parse(localStorage.getItem("fallout_weapon_table") || "[]");

    weapons.forEach((weapon, index) => {
        let calculatedStats = calculateWeaponStats(weapon.type);

        // TN is derived from the current skill and SPECIAL; there is no manual override.
        weapon.TN = calculatedStats.TN;
        delete weapon.manualTN;

        weapon.Tag = calculatedStats.Tag;
    });

    localStorage.setItem("fallout_weapon_table", JSON.stringify(weapons));
    // Do NOT update DOM here!
    // Leave DOM updating to updateWeaponTableDOM
}



function normalizePerkName(v) {
  return String(v ?? "")
    .trim()
    .replace(/^\[\[/, "")
    .replace(/\]\]$/, "")
    .trim()
    .toUpperCase();
}




function createSkillTagBadge() {
  const badge = document.createElement("span");
  badge.className = "vk-tag-badge";
  badge.textContent = "TAG";
  return badge;
}
function syncSkillTagBadges(panel, editing = panel.dataset.editing === "true") {
  panel.querySelectorAll(".stats-skill-tag-badge").forEach(badge => {
    const cb = [...panel.querySelectorAll("input")].find(el => el.id === badge.dataset.checkboxId);
    const checked = !!cb?.checked;
    badge.style.setProperty("display", editing || checked ? "inline-flex" : "none", "important");
    badge.style.setProperty("opacity", editing && !checked ? ".42" : "1", "important");
    badge.style.cursor = editing ? "pointer" : "default";
    badge.style.pointerEvents = editing ? "auto" : "none";
    badge.tabIndex = editing ? 0 : -1;
    badge.setAttribute("aria-pressed", checked ? "true" : "false");
    badge.title = editing ? (checked ? "Tagged skill — click to remove TAG" : "Click to tag this skill") : "Tagged skill";
  });
}

function renderStatsSection() {	

    // --- Root container ---
    const section = document.createElement("div");
    section.id = "stats-section";
    section.style.padding = "15px";
    section.style.borderRadius = "8px";
    //section.style.background = "#172a3b";
    section.style.background = "#142c3f";
    section.style.border = "3px solid #142c3f";
    section.style.marginBottom = "20px";
    section.style.display = "grid";
    section.style.gridTemplateColumns = "1fr 1fr";
    section.style.gap = "20px";
    section.style.minWidth = "0";
    section.style.width = "100%";
    section.style.boxSizing = "border-box";
    section.style.alignItems = "start";

    // --- Local subsection edit/view controller (no global CSS injection) ---
    const subsectionEditors = [];

    function makeSubsectionEditable({ panel, titleEl, titleText, fieldIds, onModeChange }) {
        titleEl.textContent = "";
        titleEl.classList.add("vk-editable-title");

        const titleLabel = document.createElement("span");
        titleLabel.className = "vk-title-label";
        titleLabel.textContent = titleText;
        titleEl.appendChild(titleLabel);

        const actions = document.createElement("div");
        actions.className = "vk-title-actions";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "vk-edit-icon";
        styleEquipmentActionIcon(editBtn,"edit");
        editBtn.title = `Edit ${titleText}`;
        editBtn.style.background = "rgba(0,39,87,0.65)";
        editBtn.style.border = "1px solid rgba(255,194,0,0.35)";
        editBtn.style.borderRadius = "7px";
        editBtn.style.color = "#ffc200";
        editBtn.style.fontSize = "17px";
        editBtn.style.fontWeight = "bold";
        editBtn.style.cursor = "pointer";
        editBtn.style.width = "32px";
        editBtn.style.height = "32px";
        editBtn.style.display = "grid";
        editBtn.style.placeItems = "center";
        editBtn.style.padding = "0";
        editBtn.style.lineHeight = "1";

        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.textContent = "Cancel";
        cancelBtn.style.display = "none";
        cancelBtn.style.background = "transparent";
        cancelBtn.style.border = "1px solid #7d8da3";
        cancelBtn.style.borderRadius = "5px";
        cancelBtn.style.color = "#c5c5c5";
        cancelBtn.style.fontSize = "11px";
        cancelBtn.style.cursor = "pointer";
        cancelBtn.style.height = "32px";
        cancelBtn.style.padding = "0 10px";

        actions.append(editBtn, cancelBtn);
        titleEl.appendChild(actions);

        let editing = false;
        let snapshot = null;

        function getFields() {
            const wanted = new Set(fieldIds);
            return [...panel.querySelectorAll("input, select, textarea")]
                .filter(el => wanted.has(el.id));
        }

        function capture() {
            return getFields().map(input => ({
                input,
                value: input.value,
                checked: input.checked,
                manual: input.dataset?.manual === "true",
                baseValue: input.dataset?.baseValue
            }));
        }

        function applyStandardFieldMode(input, isEditing) {
            if (!input || input.type === "hidden") return;

            if (!input.dataset.statsOriginalStyle) {
                input.dataset.statsOriginalStyle = input.style.cssText || " ";
            }

            if (isEditing) {
                input.style.cssText = input.dataset.statsOriginalStyle === " " ? "" : input.dataset.statsOriginalStyle;
                input.readOnly = false;
                if (input.type === "checkbox") input.disabled = false;
                return;
            }

            if (input.type === "checkbox") {
                input.disabled = true;
                return;
            }

            input.readOnly = true;
            input.style.background = "transparent";
            input.style.border = "1px solid transparent";
            input.style.borderBottom = "1px solid rgba(253,228,201,0.22)";
            input.style.boxShadow = "none";
            input.style.color = "#fde4c9";
            input.style.fontWeight = "700";
            input.style.caretColor = "transparent";
            input.style.padding = "3px 5px";
        }

        function setMode(next) {
            editing = !!next;
            panel.dataset.editing = editing ? "true" : "false";
            styleEquipmentActionIcon(editBtn, editing ? "save" : "edit");
            editBtn.setAttribute("aria-label",editing ? `Finish editing ${titleText}` : `Edit ${titleText}`);
            editBtn.setAttribute("aria-pressed",String(editing));
            editBtn.title = editing ? `Finish editing ${titleText}` : `Edit ${titleText}`;
            editBtn.style.fontSize = editing ? "11px" : "17px";
            if (editing) {
                editBtn.style.width = "auto";
                editBtn.style.minWidth = "48px";
                editBtn.style.height = "32px";
                editBtn.style.border = "1px solid #ffc200";
                editBtn.style.borderRadius = "7px";
                editBtn.style.background = "rgba(255,194,0,0.10)";
                editBtn.style.padding = "0 10px";
            } else {
                editBtn.style.width = "32px";
                editBtn.style.minWidth = "32px";
                editBtn.style.height = "32px";
                editBtn.style.border = "1px solid rgba(255,194,0,0.35)";
                editBtn.style.background = "rgba(0,39,87,0.65)";
                editBtn.style.padding = "0";
            }
            cancelBtn.style.display = editing ? "" : "none";

            getFields().forEach(input => applyStandardFieldMode(input, editing));

            if (editing) {
                // Effective values are a view-mode presentation only.
                // Editing always exposes the stored/base values.
                showBaseEffectValuesForPanel(panel);
            }

            if (typeof onModeChange === "function") onModeChange(editing);

            if (!editing && typeof refreshActiveEffectVisuals === "function") {
                refreshActiveEffectVisuals();
            }
        }

        editBtn.addEventListener("click", () => {
            if (!editing) {
                snapshot = capture();
                setMode(true);
                return;
            }
            if (typeof saveInputs === "function") saveInputs();
            snapshot = null;
            setMode(false);
        });

        cancelBtn.addEventListener("click", () => {
            (snapshot || []).forEach(({ input, value, checked, manual, baseValue }) => {
                input.value = value;
                if (input.type === "checkbox") input.checked = checked;
                if (manual) input.dataset.manual = "true";
                else delete input.dataset.manual;
                if (baseValue !== undefined) input.dataset.baseValue = baseValue;
            });
            if (typeof saveInputs === "function") saveInputs();
            if (typeof updateDerivedStats === "function") updateDerivedStats();
            if (typeof updateWeaponStats === "function") updateWeaponStats();
            if (typeof updateWeaponTableDOM === "function") updateWeaponTableDOM();
            if (typeof updateCarryWeightDisplay === "function") updateCarryWeightDisplay();
            snapshot = null;
            setMode(false);
        });

        const api = { setMode, isEditing: () => editing };
        subsectionEditors.push(api);
        setMode(false);
        return api;
    }

	// === Character Info ===
    const charInfo = document.createElement("div");
    charInfo.className = "vk-stats-panel vk-character-info";
    //charInfo.style.border = "2px solid #ffc200";
    charInfo.style.padding = "15px";
    charInfo.style.borderRadius = "8px";
    charInfo.style.background = "#1f3a57";
    charInfo.style.display = "flex";
    charInfo.style.flexDirection = "column";
    charInfo.style.gap = "16px";
    charInfo.style.alignSelf = "start";
    charInfo.style.minWidth = "0";

    const charTitle = document.createElement("div");
    charTitle.className = "vk-stats-panel-title";
    charTitle.textContent = "Character Info";
    charTitle.style.fontWeight = "bold";
    charTitle.style.fontSize = "16px";
    charTitle.style.color = "#efdd6f";
    charTitle.style.textAlign = "center";
    charTitle.style.borderBottom = "1px solid #ffc200";
    charTitle.style.marginBottom = "0";
    charTitle.style.borderRadius = "8px";
    charTitle.style.background = "#002757";
    charInfo.appendChild(charTitle);

    const infoGrid = document.createElement("div");
    infoGrid.style.display = "grid";
    infoGrid.style.gridTemplateColumns = "auto minmax(0, 1fr)";
    infoGrid.style.gap = "8px 14px";
    infoGrid.style.alignItems = "center";

	// input fields
    let infoRow = 1;
    function addRow(labelText, inputId, type="text", width="100%", spanWide=false) {
        const row = infoRow++;

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.color = "#FFC200";
        label.style.gridColumn = "1";
        label.style.gridRow = String(row);
        infoGrid.appendChild(label);

        const input = document.createElement("input");
        input.type = type;
        input.id = inputId;
        input.style.width = width;
        input.style.backgroundColor = "#fde4c9";
        input.style.borderRadius = "5px";
        input.style.color = "black";
        input.style.caretColor = 'black';
        input.style.gridColumn = "2";
        input.style.gridRow = String(row);
        infoGrid.appendChild(input);
    }
    addRow("Name:", "Name", "text", "100%", true);
    addRow("Origin:", "Origin", "text", "100%", true);
    addRow("Level:", "Level", "number", "50px");
    addRow("XP Earned:", "XPEarned", "number", "80px");
    addRow("XP to Next Level:", "XPNext", "number", "80px");

    // Carry Weight is rendered in Derived Stats below.
    const carryColumn = document.createElement("div");
    carryColumn.style.display = "flex";
    carryColumn.style.flexDirection = "column";
    carryColumn.style.gap = "5px";
    carryColumn.style.width = "100%";

    const carryWrap = document.createElement("div");
    carryWrap.id = "CarryWeightBlock";
    carryWrap.style.border = "1px solid #efdd6f";
    carryWrap.style.borderRadius = "5px";
    carryWrap.style.padding = "7px";
    carryWrap.style.display = "block";
    carryWrap.style.transition = "border-color 0.15s, background-color 0.15s";

    const carrySummary = document.createElement("div");
    carrySummary.className = "vk-carry-summary";

    const carryLabel = document.createElement("span");
    carryLabel.className = "vk-carry-summary-label";
    carryLabel.textContent = "Carry Weight:";

    const carryValues = document.createElement("span");
    carryValues.className = "vk-carry-summary-values";

    const currentCarryValue = document.createElement("span");
    currentCarryValue.id = "CurrentCarryWeightDisplay";
    currentCarryValue.className = "vk-status-value vk-carry-current";

    const carryDivider = document.createElement("span");
    carryDivider.className = "vk-carry-divider";
    carryDivider.textContent = "/";

    const maxCarryValue = document.createElement("span");
    maxCarryValue.id = "MaxCarryWeightDisplay";
    maxCarryValue.className = "vk-status-value vk-carry-max";
    maxCarryValue.dataset.effectTarget = "Carry Weight";

    carryValues.append(currentCarryValue, carryDivider, maxCarryValue);
    carrySummary.append(carryLabel, carryValues);
    carryWrap.appendChild(carrySummary);

    const carryPenalty = document.createElement("div");
    carryPenalty.id = "CarryWeightPenalty";
    carryPenalty.style.display = "none";
    carryPenalty.style.padding = "6px 8px";
    carryPenalty.style.borderRadius = "5px";
    carryPenalty.style.background = "#5b2424";
    carryPenalty.style.border = "1px solid #ff7b68";
    carryPenalty.style.color = "#ffe4df";
    carryPenalty.style.fontSize = "0.82em";
    carryPenalty.style.lineHeight = "1.25";

    carryColumn.append(carryWrap, carryPenalty);

    charInfo.appendChild(infoGrid);
    section.appendChild(charInfo);
	
	// === Derived Stats ===
    const derivedStats = document.createElement("div");
    derivedStats.className = "vk-stats-panel vk-derived-stats";
    //derivedStats.style.border = "2px solid #ffc200";
    derivedStats.style.padding = "15px";
    derivedStats.style.borderRadius = "8px";
    derivedStats.style.background = "#1f3a57";
    derivedStats.style.alignSelf = "start";
    derivedStats.style.minWidth = "0";

    const derivedTitle = document.createElement("div");
    derivedTitle.className = "vk-stats-panel-title";
    derivedTitle.textContent = "Derived Stats";
    derivedTitle.style.fontWeight = "bold";
    derivedTitle.style.fontSize = "16px";
    derivedTitle.style.color = "#efdd6f";
    derivedTitle.style.textAlign = "center";
    derivedTitle.style.borderBottom = "1px solid #ffc200";
    derivedTitle.style.marginBottom = "8px";
    derivedTitle.style.borderRadius = "8px";
    derivedTitle.style.background = "#002757"
    derivedStats.appendChild(derivedTitle);

	// Two-column grid for derived stats and HP/Luck
    const derivedGrid = document.createElement("div");
    derivedGrid.className = "vk-derived-grid";
    derivedGrid.style.display = "grid";
    derivedGrid.style.gridTemplateColumns = "0.9fr 1.4fr";
    derivedGrid.style.gap = "12px";
    derivedGrid.style.alignItems = "start";

    // Moon button
	const restBtn = document.createElement("span");
    restBtn.className = "vk-action-chip";
	restBtn.innerHTML = `New Scene 🌙`;
	restBtn.style.display = "flex"
	restBtn.title = "Long Rest: Reset Luck Points and Current HP";
	restBtn.style.padding = "0 4px";
	restBtn.style.cursor = "pointer";
	restBtn.style.fontSize = "1.4em";
	restBtn.style.verticalAlign = "middle";
	restBtn.style.marginBottom = "5px"
	restBtn.style.marginRight = "10px"
	restBtn.style.transition = "transform 0.15s";
	restBtn.style.justifyContent = "left"
	restBtn.style.textShadow = "2px 2px 5px navy"
	restBtn.style.color = "#ffc200"
	restBtn.onmouseover = () => { restBtn.style.transform = "scale(1.05)"; };
	restBtn.onmouseout = () => { restBtn.style.transform = "scale(1)"; };
	
	restBtn.onclick = () => {
	    const lck = typeof getBaseNumericCharacterValue === "function"
          ? getBaseNumericCharacterValue("LCK")
          : (parseInt(document.getElementById("LCK")?.value, 10) || 0);
		
	    const luckInput = document.getElementById("LuckPoints");
	
	    if (luckInput) {
	        luckInput.value = String(lck);
            luckInput.dataset.baseValue = String(lck);
            delete luckInput.dataset.manual;
		
	        luckInput.dispatchEvent(new Event("input", { bubbles: true }));
	    }
		
	    // For Luck Points
	    const luckNum = luckWrapper.querySelector('.plusminus-num');
	    if (luckNum) luckNum.textContent = String(lck);
		
	    if (typeof renderHPBar === "function") renderHPBar();
	
	    if (typeof loadInputs === "function") loadInputs();
	    if (typeof updateDerivedStats === "function") updateDerivedStats();
        if (typeof refreshActiveEffectVisuals === "function") refreshActiveEffectVisuals();
	};
	
	// Left column: Derived Stats
    const leftCol = document.createElement("div");
    leftCol.style.display = "grid";
    leftCol.style.gap = "8px";

    function addDerived(labelText, inputId, type="text") {
        const row = document.createElement("div");
        row.className = "vk-display-row";
        row.dataset.effectTarget = inputId;
        row.style.display = "grid";
        row.style.gridTemplateColumns = "1fr auto";
        row.style.alignItems = "center";
        row.style.gap = "8px";
        row.style.padding = "8px 10px";
        row.style.background = "#142c3f";
        row.style.border = "1px solid #223657";
        row.style.borderRadius = "7px";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.color = "#FFC200";
        label.style.fontWeight = "700";
        row.appendChild(label);

        const input = document.createElement("input");
        input.type = type;
        input.id = inputId;
        input.style.width = type === "number" ? "70px" : "90px";
        input.style.textAlign = "center";
        input.readOnly = true;
        input.tabIndex = -1;
        input.style.background = "transparent";
        input.style.border = "1px solid transparent";
        input.style.borderBottom = "1px solid rgba(253,228,201,0.22)";
        input.style.borderRadius = "5px";
        input.style.color = "#fde4c9";
        input.style.fontWeight = "700";
        input.style.caretColor = "transparent";
        input.style.padding = "3px 5px";
        row.appendChild(input);
        leftCol.appendChild(row);
    }
    // (Add your derived fields)
	addDerived("Melee Damage:", "MeleeDamage");
	addDerived("Defense:", "Defense", "number");
	addDerived("Initiative:", "Initiative", "number");


	
	

    

	// Right column: Luck Points + HP
    const rightCol = document.createElement("div");

	// Luck Points
    const luckWrapper = document.createElement("div");
    luckWrapper.className = "vk-luck-row vk-display-row";
    luckWrapper.dataset.effectTarget = "Luck Points";
    luckWrapper.style.border = "1px solid #efdd6f";
    luckWrapper.style.padding = "5px";
    luckWrapper.style.display = "grid";
    luckWrapper.style.gridTemplateColumns = "auto 1fr";
    luckWrapper.style.alignItems = "center";
    luckWrapper.style.marginBottom = "0";
    luckWrapper.style.flex = "1";
    luckWrapper.style.borderRadius = "7px";
    luckWrapper.style.background = "#142c3f";

    const luckLabel = document.createElement("label");
    luckLabel.className = "vk-luck-label";
    luckLabel.textContent = "Luck Points:";
    luckLabel.style.color = "#FFC200";
    luckWrapper.appendChild(luckLabel);

    const luckInitial = (() => {
    let d = localStorage.getItem("falloutRPGCharacterSheet");
    if (d) try {
	    let v = JSON.parse(d).LuckPoints;
	    return (v === undefined || v === "") ? undefined : v;
	} catch {}
	return undefined;

})();
const luckHiddenInput = document.createElement("input");
luckHiddenInput.type = "hidden";
luckHiddenInput.id = "LuckPoints";
luckHiddenInput.value = luckInitial;
luckWrapper.appendChild(luckHiddenInput);

const luckField = createPlusMinusDisplay({
    label: "Luck Points",
    value: luckInitial,
    min: 0,
    onChange: (val) => {
        const currentBase = Number(
          luckHiddenInput.dataset?.baseValue ??
          luckHiddenInput.value ??
          0
        ) || 0;

        const currentEffective = typeof applyActiveEffectModifiers === "function"
          ? applyActiveEffectModifiers(currentBase, "Luck Points").effective
          : currentBase;

        const desiredEffective = Number(val);
        const delta = Number.isFinite(desiredEffective)
          ? desiredEffective - currentEffective
          : 0;

        const newBase = Math.max(0, currentBase + delta);
        luckHiddenInput.value = String(newBase);
        luckHiddenInput.dataset.baseValue = String(newBase);

        const lckBase = typeof getBaseNumericCharacterValue === "function"
          ? getBaseNumericCharacterValue("LCK")
          : (parseInt(document.getElementById("LCK")?.value, 10) || 0);

        if (val === "" || Number(newBase) === Number(lckBase)) {
            delete luckHiddenInput.dataset.manual;
        } else {
            luckHiddenInput.dataset.manual = "true";
        }

        luckHiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
        if (typeof refreshActiveEffectVisuals === "function") refreshActiveEffectVisuals();
    }
});
const luckValueDisplay = luckField.querySelector(".plusminus-num");
if (luckValueDisplay) luckValueDisplay.classList.add("vk-status-value");
luckWrapper.appendChild(luckField);

const derivedActionRow = document.createElement("div");
derivedActionRow.className = "vk-resource-actions";
restBtn.classList.add("vk-new-scene-action");
derivedActionRow.style.display = "flex";
derivedActionRow.style.alignItems = "stretch";
derivedActionRow.style.gap = "8px";
derivedActionRow.style.marginBottom = "8px";
restBtn.style.alignItems = "center";
restBtn.style.justifyContent = "center";
restBtn.style.margin = "0";
restBtn.style.padding = "6px 10px";
restBtn.style.fontSize = "1.05em";
restBtn.style.background = "#142c3f";
restBtn.style.border = "1px solid #efdd6f";
restBtn.style.borderRadius = "7px";
restBtn.style.whiteSpace = "nowrap";
derivedActionRow.append(luckWrapper, restBtn);
rightCol.appendChild(derivedActionRow);

	// HP
	const maxHPBlock = document.createElement("div");
	maxHPBlock.style.borderBottom = "2px solid #ffc200"
	maxHPBlock.style.padding = "0px 5px"
	maxHPBlock.style.gridColumn = "1 / span 2";
	maxHPBlock.style.display = "flex";
	maxHPBlock.style.justifyContent = "center";
	
	
    const hpWrapper = document.createElement("div");
    hpWrapper.className = "vk-hp-panel";
    hpWrapper.style.border = "1px solid #efdd6f";
    hpWrapper.style.padding = "0px 5px 0px 5px";
    hpWrapper.style.display = "grid";
    hpWrapper.style.gridTemplateColumns = "auto auto";
    hpWrapper.style.minHeight = "100px";
    
    // HP Title Row (HP left, Rad DMG right)
	const hpHeader = document.createElement("div");
	hpHeader.style.gridColumn = "1 / span 2";
	hpHeader.style.display = "flex";
	hpHeader.style.alignItems = "center";
	hpHeader.style.justifyContent = "space-between";
	//hpHeader.style.borderBottom = "2px solid #ffc200";
	//hpHeader.style.marginBottom = "2px";
	//hpHeader.style.paddingBottom = "2px";
	hpHeader.style.marginTop = "2px";
	
	// Right: Rad DMG controls (inline)
	const radWrap = document.createElement("div");
	radWrap.style.display = "flex";
	radWrap.style.alignItems = "center";
	radWrap.style.gap = "5px";
	
	//const radLabel = document.createElement("span");
	//radLabel.textContent = "Rads:";
	//radLabel.style.color = "#FFC200";
	//radLabel.style.fontSize = "12px";
	
	// Load persisted RadDMG (defaults to 0)  ✅ handles "", null, undefined, NaN
	const radInitial = (() => {
	  let d = localStorage.getItem("falloutRPGCharacterSheet");
	  if (d) {
	    try {
	      const raw = JSON.parse(d).RadDMG;
	      const n = parseInt(raw, 10);
	      return Number.isFinite(n) ? n : 0;
	    } catch {}
	  }
	  return 0;
	})();

	
	// Hidden input so your existing save/load logic can persist it
	const radHiddenInput = document.createElement("input");
	radHiddenInput.type = "hidden";
	radHiddenInput.id = "RadDMG";
	radHiddenInput.value = radInitial;
	hpWrapper.appendChild(radHiddenInput);
	
	radHiddenInput.addEventListener("input", () => {
	  const effMax = getEffectiveMaxHP();
	  const cur = parseInt(currentHpHiddenInput.value, 10) || 0;
	
	  if (cur >= effMax || cur === 0) {
	    currentHpHiddenInput.value = String(effMax);
	    syncCurrentHPUI(effMax);
	  }
	
	  clampCurrentHPToEffectiveMax();
	  renderHPBar();
	});
	
	// Assemble
	hpHeader.appendChild(radWrap);
	maxHPBlock.appendChild(hpHeader);
	//radWrap.appendChild(radLabel);
	radWrap.appendChild(radHiddenInput); // optional if you want it visible (usually you do NOT)
	
		// Max HP
    // ---- Max HP (hidden input for persistence + span UI for clean display) ----
	
	// Load persisted Maximum HP (defaults to 0)
	const maxHpInitial = (() => {
	  let d = localStorage.getItem("falloutRPGCharacterSheet");
	  if (d) try { return JSON.parse(d)["Maximum HP"] ?? 0; } catch {}
	  return 0;
	})();
	
	// Hidden input so your existing save/load logic can persist it (ID must remain "Maximum HP")
	const maxHpInput = document.createElement("input");
	maxHpInput.type = "hidden";
	maxHpInput.id = "Maximum HP";
	maxHpInput.value = String(maxHpInitial);
	hpWrapper.appendChild(maxHpInput);
	// Visible formula-driven Max HP display.
	const maxHpCompact = createCompactPlusMinusRow({
	  labelText: "Max HP:",
	  initialValue: maxHpInitial,
	  min: 0,
	  max: 9999,
	  valueTitle: "Maximum HP is derived from END + LCK + Level - 1",
	  onChange: () => {
        if (typeof updateDerivedStats === "function") updateDerivedStats();
      },
	});
	
	// Make it sit where your old label/input lived
	maxHpCompact.wrap.dataset.effectTarget = "Maximum HP";
    maxHpCompact.valueSpan.classList.add("vk-status-value");
    maxHpCompact.valueSpan.style.pointerEvents = "none";
    maxHpCompact.valueSpan.style.cursor = "default";
    maxHpCompact.valueSpan.style.textDecoration = "none";
    maxHpCompact.hideEditor();
    maxHpCompact.field.classList.add("vk-number-readonly");
    maxHpCompact.valueSpan.tabIndex = -1;
    maxHpCompact.valueSpan.setAttribute("aria-readonly", "true");
	maxHPBlock.appendChild(maxHpCompact.wrap);
	
	// Keep the compact UI synced if anything else updates maxHpInput (e.g., derived stat calc, scene change)
	function syncMaxHPUI(val) {
	  maxHpCompact.valueSpan.textContent = String(val ?? 0);
	  const n = maxHpCompact.field.querySelector(".plusminus-num");
	  if (n) n.textContent = String(val ?? 0);
	}
	
	maxHpInput.addEventListener("input", () => {
	  syncMaxHPUI(maxHpInput.value);
	  clampCurrentHPToEffectiveMax();
	  renderHPBar();
	});

	
	hpWrapper.appendChild(maxHPBlock);
	
	// --- HP / Rad Bar (replaces the old yellow underline behavior) ---
	const hpBarOuter = document.createElement("div");
	hpBarOuter.style.gridColumn = "1 / span 2";
	hpBarOuter.style.height = "10px";
	hpBarOuter.style.border = "2px solid black";
	hpBarOuter.style.borderRadius = "0px";
	hpBarOuter.style.background = "transparent";
	hpBarOuter.style.overflow = "hidden";
	hpBarOuter.style.margin = "4px 0px 2px 0px";
	hpBarOuter.style.position = "relative";
	hpBarOuter.style.boxShadow = "#000 0px 2px 12px";
	hpBarOuter.style.alignSelf = "end";
	
	// Green = current HP
	const hpBarGreen = document.createElement("div");
	hpBarGreen.style.position = "absolute";
	hpBarGreen.style.left = "0";
	hpBarGreen.style.top = "0";
	hpBarGreen.style.bottom = "0";
	hpBarGreen.style.width = "0%";
	hpBarGreen.style.background = "#1bff80"; // terminal green
	hpBarGreen.style.opacity = "0.95";
	
	// Red = rad blocked portion (right side)
	const hpBarRed = document.createElement("div");
	hpBarRed.style.position = "absolute";
	hpBarRed.style.right = "0";
	hpBarRed.style.top = "0";
	hpBarRed.style.bottom = "0";
	hpBarRed.style.width = "0%";
	hpBarRed.style.background = "#d43417";
	hpBarRed.style.opacity = "0.95";
	
	hpBarOuter.appendChild(hpBarGreen);
	hpBarOuter.appendChild(hpBarRed);
	hpWrapper.appendChild(hpBarOuter);
	
	// --- Footer row under the bar: Current HP (left) + Rads (right) ---
	const hpFooter = document.createElement("div");
	hpFooter.style.gridColumn = "1 / span 2";
	hpFooter.style.display = "flex";
	hpFooter.style.alignItems = "center";
	hpFooter.style.justifyContent = "space-between";
	//hpFooter.style.marginTop = "2px";
	hpFooter.style.padding = "0px 5px 0px 5px";
	
	// ---- Current HP hidden input (persisted) ----
	const currentHpInitial = (() => {
	  let d = localStorage.getItem("falloutRPGCharacterSheet");
	  if (d) try { return JSON.parse(d).CurrentHP ?? 0; } catch {}
	  return 0;
	})();
	
	const currentHpHiddenInput = document.createElement("input");
	currentHpHiddenInput.type = "hidden";
	currentHpHiddenInput.id = "CurrentHP";
	currentHpHiddenInput.value = currentHpInitial;
	maxHPBlock.appendChild(currentHpHiddenInput);
	
	// ---- Current HP compact editor ----
	const currentHpCompact = createCompactPlusMinusRow({
	  labelText: "HP:",
	  initialValue: currentHpInitial,
	  min: 0,
	  max: 9999,
	  valueTitle: "Click to edit Current HP",
	  onChange: (val) => {
		  // If cleared, revert to effective max = baseMax - rads
		  if (val === "" || val === null) {
		    const eff = getEffectiveMaxHP();
		    currentHpHiddenInput.value = String(eff);
		    currentHpHiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
		    syncCurrentHPUI(eff);
		    clampCurrentHPToEffectiveMax();
		    renderHPBar();
		    return;
		  }
		
		  currentHpHiddenInput.value = String(val);
		  currentHpHiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
		  syncCurrentHPUI(val);
		  clampCurrentHPToEffectiveMax();
		  renderHPBar();
	 },

	});
	function syncCurrentHPUI(val) {
	  // Update the visible compact display (the one normally shown)
	  currentHpCompact.valueSpan.textContent = String(val ?? 0);
	
	  // Update the editor number too (in case it gets opened later)
	  const hpNum = currentHpCompact.field.querySelector(".plusminus-num");
	  if (hpNum) hpNum.textContent = String(val ?? 0);
	}
    currentHpCompact.valueSpan.classList.add("vk-status-value");
	currentHpCompact.field.dataset.pm = "CurrentHP";
	
	// Ensure RadDMG is never blank
	if (radHiddenInput.value === "" || !Number.isFinite(parseInt(radHiddenInput.value, 10))) {
	  radHiddenInput.value = "0";
	}

	// ---- Rads compact editor (use your existing radHiddenInput) ----
	// You already have radHiddenInput earlier in the HP block. :contentReference[oaicite:7]{index=7}
	const radCompact = createCompactPlusMinusRow({
	  labelText: "Rads:",
	  initialValue: radHiddenInput.value ?? 0,
	  min: 0,
	  max: 9999,
	  valueTitle: "Click to edit Radiation Damage",
	  onChange: (val) => {
		  // If cleared, revert to 0
		  if (val === "" || val === null) val = 0;
		
		  radHiddenInput.value = String(val);
		  radHiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
		
		  // Sync the visible span and the editor number (you do NOT have syncRadUI)
		  radCompact.valueSpan.textContent = String(val);
		  const n = radCompact.field.querySelector(".plusminus-num");
		  if (n) n.textContent = String(val);
		
		  clampCurrentHPToEffectiveMax();
		  renderHPBar();
	 },

	});
    radCompact.valueSpan.classList.add("vk-status-value");
	radCompact.field.dataset.pm = "RadDMG";
	
	// Assemble footer
	hpFooter.appendChild(currentHpCompact.wrap);
	hpFooter.appendChild(radCompact.wrap);
	hpWrapper.appendChild(hpFooter);
	
	// Ensure bar reflects stored values on initial render
	setTimeout(() => {
	  clampCurrentHPToEffectiveMax();
	  renderHPBar();
	}, 0);
		
	function clampInt(v, min, max) {
	  const n = parseInt(v, 10);
	  if (Number.isNaN(n)) return min;
	  return Math.max(min, Math.min(max, n));
	}
	
	function getBaseMaxHP() {
	  const base = clampInt(maxHpInput?.value ?? 0, 0, 9999);
	  if (typeof getEffectiveDerivedValue === "function") {
	    return clampInt(getEffectiveDerivedValue("Maximum HP"), 0, 9999);
	  }
	  return base;
	}
	
	function getRadDMG() {
	  // radHiddenInput must exist from the earlier step
	  return clampInt(radHiddenInput?.value ?? 0, 0, 9999);
	}
	
	function getEffectiveMaxHP() {
	  return Math.max(0, getBaseMaxHP() - getRadDMG());
	}
	
	function clampCurrentHPToEffectiveMax() {
	  const eff = getEffectiveMaxHP();
	  const cur = clampInt(currentHpHiddenInput?.value ?? 0, 0, 9999);
	
	  if (cur > eff) {
	    currentHpHiddenInput.value = String(eff);
	    currentHpHiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
	    syncCurrentHPUI(eff);
	  }
	}
	
	function renderHPBar() {
	  const baseMax = getBaseMaxHP();
	  const rad = getRadDMG();
	  const effMax = Math.max(0, baseMax - rad);
	
	  const curRaw = clampInt(currentHpHiddenInput?.value ?? 0, 0, 9999);
	  const cur = Math.min(curRaw, effMax);
	
	  // Scale bar to baseMax so red always occupies the right portion
	  const denom = Math.max(1, baseMax);
	
	  const greenPct = baseMax > 0 ? (cur / denom) * 100 : 0;
	  const redPct = baseMax > 0 ? (rad / denom) * 100 : 0;
	
	  hpBarGreen.style.width = `${greenPct}%`;
	  hpBarRed.style.width = `${redPct}%`;
	
	  if (baseMax <= 0) {
	    hpBarGreen.style.width = "0%";
	    hpBarRed.style.width = "0%";
	  }
	}


    rightCol.appendChild(hpWrapper);
    
    derivedGrid.appendChild(leftCol);
    derivedGrid.appendChild(rightCol);

    carryColumn.style.gridColumn = "1 / -1";
    carryWrap.style.background = "#142c3f";
    carryWrap.style.borderColor = "#223657";
    carryWrap.style.padding = "9px 12px";
    derivedGrid.appendChild(carryColumn);

    derivedStats.appendChild(derivedGrid);
    section.appendChild(derivedStats);

	// === S.P.E.C.I.A.L. Stats ===
    const specialDiv = document.createElement("div");
    specialDiv.className = "vk-stats-panel vk-special-stats";
    //specialDiv.style.border = "2px solid #ffc200";
    specialDiv.style.padding = "14px";
    specialDiv.style.borderRadius = "8px";
    specialDiv.style.textAlign = "center";
    specialDiv.style.marginTop = "6px";
    specialDiv.style.background = "#17324b";
    specialDiv.style.border = "1px solid #223657";

    const specialTitle = document.createElement("div");
    specialTitle.className = "vk-stats-panel-title";
    specialTitle.textContent = "S.P.E.C.I.A.L.";
    specialTitle.style.fontWeight = "bold";
    specialTitle.style.fontSize = "16px";
    specialTitle.style.color = "#efdd6f";
    specialTitle.style.textAlign = "center";
    specialTitle.style.borderBottom = "1px solid #ffc200";
    specialTitle.style.marginBottom = "12px";
    specialTitle.style.borderRadius = "8px";
    specialTitle.style.background = "#002757"
    specialDiv.appendChild(specialTitle);

    const specialRow = document.createElement("div");
    specialRow.className = "vk-special-row";
    specialRow.style.display = "flex";
    specialRow.style.justifyContent = "space-between";
    specialRow.style.gap = "10px";
    specialRow.style.flexWrap = "wrap";
	specialRow.style.borderRadius = "8px";
	specialRow.style.padding = "4px 0 0";
	specialRow.style.background = "transparent";


    ["STR", "PER", "END", "CHA", "INT", "AGI", "LCK"].forEach(stat => {
        const statBox = document.createElement("div");
        statBox.className = "vk-special-stat";
        statBox.dataset.effectTarget = stat;
        statBox.style.display = "flex";
        statBox.style.flexDirection = "column";
        statBox.style.alignItems = "center";
        statBox.style.minWidth = "70px";
        statBox.style.padding = "8px 10px";
        statBox.style.background = "#142c3f";
        statBox.style.border = "1px solid #223657";
        statBox.style.borderRadius = "8px";

        const statLabel = document.createElement("label");
        statLabel.textContent = stat;
        statLabel.style.color = "#FFC200";
        statLabel.style.fontWeight = "bold";
        statBox.appendChild(statLabel);

        const statInput = document.createElement("input");
        statInput.type = "number";
        statInput.id = stat;
        statInput.style.width = "40px";
        statInput.style.textAlign = "center";
        statInput.style.backgroundColor = "#fde4c9";
        statInput.style.color = "black";
        statInput.style.borderRadius = "5px";
        statInput.style.border = "1px solid #000";
        statInput.style.caretColor = 'black';
        statBox.appendChild(statInput);

        specialRow.appendChild(statBox);
    });

    specialDiv.appendChild(specialRow);
    charInfo.appendChild(specialDiv);

	// === Skills Section ===
    const skillsDiv = document.createElement("div");
    skillsDiv.className = "vk-stats-panel vk-skills";
    skillsDiv.style.gridColumn = "span 2";
    //skillsDiv.style.border = "2px solid #ffc200";
    skillsDiv.style.padding = "15px";
    skillsDiv.style.borderRadius = "8px";
    skillsDiv.style.textAlign = "left";
    skillsDiv.style.marginTop = "10px";
    skillsDiv.style.background = "#1f3a57";

    const skillsTitle = document.createElement("div");
    skillsTitle.className = "vk-stats-panel-title";
    skillsTitle.textContent = "Skills";
    skillsDiv.appendChild(skillsTitle);

    const skillsGrid = document.createElement("div");
    skillsGrid.className = "vk-skills-grid";

    const skillToSpecial = { 
        "Athletics": "STR", "Barter": "CHA", "Big Guns": "END", 
        "Energy Weapons": "PER", "Explosives": "PER", "Lockpick": "PER", 
        "Medicine": "INT", "Melee Weapons": "STR", "Pilot": "PER", 
        "Repair": "INT", "Science": "INT", "Small Guns": "AGI", 
        "Sneak": "AGI", "Speech": "CHA", "Survival": "END", 
        "Throwing": "AGI", "Unarmed": "STR" 
    };

    Object.keys(skillToSpecial).forEach(skill => {
        const skillRow = document.createElement("div");
        skillRow.className = "vk-skill-row";
        skillRow.dataset.effectTarget = skill;

        const skillLabel = document.createElement("label");
        skillLabel.className = "vk-skill-name";
        skillLabel.textContent = skill;
        skillRow.appendChild(skillLabel);

        const specialTag = document.createElement("span");
        specialTag.textContent = `[${skillToSpecial[skill]}]`;
        specialTag.className = "vk-skill-special";
        skillRow.appendChild(specialTag);

        const tagCheckbox = document.createElement("input");
        tagCheckbox.type = "checkbox";
        tagCheckbox.id = `${skill}Tag`;
        tagCheckbox.className = "vk-tag-source-checkbox";
        tagCheckbox.checked = !!getStoredCharacterData()[`${skill}Tag`];
        tagCheckbox.addEventListener("change", () => syncSkillTagBadges(skillsDiv));
        tagCheckbox.style.display = "none";
        skillRow.appendChild(tagCheckbox);

        const tagBadge = createSkillTagBadge();
        tagBadge.classList.add("stats-skill-tag-badge");
        tagBadge.dataset.checkboxId = `${skill}Tag`;
        tagBadge.textContent = "TAG";
        tagBadge.style.display = "none";
        tagBadge.setAttribute("role", "button");
        tagBadge.tabIndex = -1;
        tagBadge.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (skillsDiv.dataset.editing !== "true") return;

            tagCheckbox.checked = !tagCheckbox.checked;
            tagCheckbox.dispatchEvent(new Event("change", { bubbles: true }));

            tagBadge.style.opacity = tagCheckbox.checked ? "1" : ".42";
            tagBadge.setAttribute("aria-pressed", tagCheckbox.checked ? "true" : "false");
            tagBadge.title = tagCheckbox.checked
                ? `Tagged skill — click to remove TAG from ${skill}`
                : `Click to tag ${skill}`;
        });
        tagBadge.addEventListener("keydown", (event) => {
            if (skillsDiv.dataset.editing !== "true") return;
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                tagBadge.click();
            }
        });
        skillRow.appendChild(tagBadge);

        const skillInput = document.createElement("input");
        skillInput.type = "number";
        skillInput.id = skill;
        skillInput.className = "vk-skill-rank";
        skillRow.appendChild(skillInput);

        skillsGrid.appendChild(skillRow);
    });

    skillsDiv.appendChild(skillsGrid);
    syncSkillTagBadges(skillsDiv);
    section.appendChild(skillsDiv);

    // Responsive Stats layout:
    // - Desktop / wide panes: Character Info and Derived Stats side-by-side.
    // - Narrow laptop / tablet panes: stack those panels instead of squeezing them.
    // - Very narrow Derived Stats panels also stack their internal two-column layout.
    function updateStatsResponsiveLayout() {
        const width = section.getBoundingClientRect().width || section.clientWidth || 0;
        const stacked = width < 900;

        section.style.gridTemplateColumns = stacked ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 1fr)";
        section.style.gap = stacked ? "12px" : "20px";

        charInfo.style.gridColumn = stacked ? "1 / -1" : "auto";
        derivedStats.style.gridColumn = stacked ? "1 / -1" : "auto";
        skillsDiv.style.gridColumn = "1 / -1";

        const derivedWidth = derivedStats.getBoundingClientRect().width || derivedStats.clientWidth || 0;
        const derivedStacked = derivedWidth > 0 && derivedWidth < 640;

        derivedGrid.style.gridTemplateColumns = derivedStacked
            ? "minmax(0, 1fr)"
            : "minmax(0, 0.9fr) minmax(0, 1.4fr)";
        derivedGrid.style.gap = derivedStacked ? "8px" : "12px";

        leftCol.style.minWidth = "0";
        rightCol.style.minWidth = "0";
        carryColumn.style.gridColumn = "1 / -1";
    }

    updateStatsResponsiveLayout();

    if (typeof ResizeObserver !== "undefined") {
        const statsResizeObserver = new ResizeObserver(() => {
            updateStatsResponsiveLayout();
        });
        statsResizeObserver.observe(section);

        if (typeof ctx !== "undefined" && ctx?.onunload) {
            ctx.onunload(() => statsResizeObserver.disconnect());
        }
    } else {
        window.addEventListener("resize", updateStatsResponsiveLayout);
    }

    const characterInfoEditor = makeSubsectionEditable({
        panel: charInfo,
        titleEl: charTitle,
        titleText: "Character Info",
        fieldIds: ["Name", "Origin", "Level", "XPEarned", "XPNext"]
    });

    const specialEditor = makeSubsectionEditable({
        panel: specialDiv,
        titleEl: specialTitle,
        titleText: "S.P.E.C.I.A.L.",
        fieldIds: ["STR", "PER", "END", "CHA", "INT", "AGI", "LCK"],
        onModeChange: (editing) => {
            ["STR", "PER", "END", "CHA", "INT", "AGI", "LCK"].forEach(id => {
                const input = [...specialDiv.querySelectorAll("input")].find(el => el.id === id);
                if (!input) return;
                if (!editing) {
                    input.style.fontSize = "1.45em";
                    input.style.fontWeight = "800";
                    input.style.textAlign = "center";
                    input.style.borderBottom = "none";
                    input.style.width = "52px";
                    input.style.padding = "2px";
                }
            });
        }
    });

    const skillsEditor = makeSubsectionEditable({
        panel: skillsDiv,
        titleEl: skillsTitle,
        titleText: "Skills",
        fieldIds: [
            ...Object.keys(skillToSpecial),
            ...Object.keys(skillToSpecial).map(skill => `${skill}Tag`)
        ],
        onModeChange: (editing) => {
            syncSkillTagBadges(skillsDiv, editing);

            Object.keys(skillToSpecial).forEach(skill => {
                const cb = [...skillsDiv.querySelectorAll("input")].find(el => el.id === `${skill}Tag`);
                if (cb) cb.style.setProperty("display", "none", "important");

                const rank = [...skillsDiv.querySelectorAll("input")].find(el => el.id === skill);
                if (rank && !editing) {
                    rank.style.borderBottom = "none";
                    rank.style.width = "38px";
                    rank.style.textAlign = "center";
                    rank.style.fontWeight = "800";
                    rank.style.padding = "2px";
                }
            });
        }
    });

    section._syncViewMode = () => {
        subsectionEditors.forEach(editor => {
            if (!editor.isEditing()) editor.setMode(false);
        });
    };

    section._refreshActiveEffects = () => {
        clampCurrentHPToEffectiveMax();
        renderHPBar();
        refreshActiveEffectVisuals();
    };

	//End of Stats Section Container
    return section;
}






function setupStatsSection() {
    // 1. Clear and re-map the inputs object
    Object.keys(inputs).forEach(key => delete inputs[key]);

    // 2. Map all input fields by their ID (after rendering stats)
    const statsSection = document.getElementById("stats-section");
    if (!statsSection) return; // Safety in case section is missing

    statsSection.querySelectorAll("input").forEach(input => {
        const key = input.getAttribute("id");
        if (key) {
            inputs[key] = input;
            input.addEventListener("input", () => {
                // When an effect-managed field is being edited, the typed value
                // is the new BASE value. Capture it before any derived/effect
                // refresh has a chance to repaint the visible effective value.
                if (isEffectManagedField(key)) {
                    const panel = input.closest(".vk-stats-panel");
                    if (panel?.dataset?.editing === "true") {
                        input.dataset.baseValue = input.value;
                    }
                }
                saveInputs();
            });
            if (input.type === "checkbox") input.addEventListener("change", saveInputs);
        }
    });

    // 3. SPECIAL stat listeners for derived stats and weapons
    ["STR", "PER", "END", "CHA", "INT", "AGI", "LCK"].forEach(stat => {
    const input = document.getElementById(stat);
    if (input) {
        input.addEventListener("input", () => {
            console.log(`[DEBUG] SPECIAL changed: ${stat}, value now: ${input.value}`);
            updateDerivedStats();
            saveInputs();
            updateWeaponStats();
            updateWeaponTableDOM();
        });
    }
    const levelInput = document.getElementById("Level");
	if (levelInput) {
	  levelInput.addEventListener("input", () => {
	    updateDerivedStats();
	    saveInputs();
	    updateWeaponStats();
	    updateWeaponTableDOM();
	  });
	}
});


    // 4. Skill & Tag listeners
    Object.keys(skillToSpecial).forEach(skill => {
        let skillInput = document.getElementById(skill);
        let skillTagInput = document.getElementById(`${skill}Tag`);
        if (skillInput) {
            skillInput.addEventListener("input", () => {
                saveInputs();
                updateWeaponStats();
                updateWeaponTableDOM();
            });
        }
        if (skillTagInput) {
            skillTagInput.addEventListener("change", () => {
                saveInputs();
                updateWeaponStats();
                updateWeaponTableDOM();
            });
        }
    });

    // 5. Derived stats are formula-only; Active Effects are the override mechanism.

    // 6. Load data and trigger initial calculation
    loadInputs();
    updateDerivedStats();
    updateWeaponStats();
    updateWeaponTableDOM();
    updateCarryWeightDisplay();
    if (typeof statsSection._syncViewMode === "function") statsSection._syncViewMode();
    if (typeof refreshActiveEffectVisuals === "function") refreshActiveEffectVisuals();
}



//--------------------------------------------------------------------------------------------

function renderCapsContainer() {
  const wrap=document.createElement("div");wrap.className="vk-caps";
  const label=document.createElement("strong");label.textContent="Caps";
  const field=createPlusMinusDisplay({value:localStorage.getItem("fallout_Caps") || 0,min:0,max:Infinity,label:"Caps",commitOnBlur:true,
    onChange:value=>localStorage.setItem("fallout_Caps",String(Math.max(0,Number(value)||0)))});
  field.querySelector(".plusminus-num").classList.add("vk-status-value");wrap.append(label,field);return wrap;
}

//____________________________________________________________________________________________

// Prepared weapons are a read-only combat summary; changes use the workbench.
const weaponColumns = [
  { label: "Weapon", key: "weapon" },
  { label: "Ammo", key: "ammo" },
  { label: "DMG", key: "damage" },
  { label: "Rate", key: "rate" },
  { label: "Range", key: "range" },
  { label: "Actions", key: "actions" }
];

// ---------------- Ammo Linking Rules ----------------
const THROWING_WEAPONS_FOLDER = "Fallout-RPG/Items/Weapons/Throwing";
const EXPLOSIVE_WEAPONS_FOLDER = "Fallout-RPG/Items/Weapons/Explosives";

const AMMO_SPECIAL_INCLUSION_PATHS = new Set([
  "Fallout-RPG/Items/Weapons/Unique Items/Handy Rock.md",
  "Fallout-RPG/Items/Weapons/Unique Items/Lightweight Mini-Nuke.md",
]);

const AMMO_EXCLUSION_PREFIXES = [
  "Fallout-RPG/Items/Weapons/Melee",
  "Fallout-RPG/Items/Weapons/Unique Items",
];

function stripWikiLink(s) {
  return String(s ?? "").replace(/^\[\[|\]\]$/g, "").trim();
}

function normalizeInstanceName(value) {
  return String(value ?? "")
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1")
    .trim();
}

// Shared display-name priority for prepared, equipped and inventory weapons.
// Source links remain unchanged; generatedName is only presentation metadata.
function vkWeaponDisplayName(row, sourceName = "") {
  return normalizeInstanceName(row?.instanceName) ||
    normalizeInstanceName(row?.generatedName) ||
    sourceName || sourceDisplayName({
      sourcePath: row?.sourcePath || "",
      yamlName: row?.yamlName || "",
      rawLink: row?.link || row?.name || "",
      fallbackName: "Weapon"
    });
}
function vkWeaponBaseName(row) {
  return sourceDisplayName({
    sourcePath: row?.sourcePath || "",
    yamlName: row?.baseWeapon?.link ? stripWikiLink(row.baseWeapon.link) : row?.yamlName || "",
    rawLink: row?.link || row?.name || "",
    fallbackName: "Weapon"
  });
}
function readWeaponNamingRules(noteText) {
  const block = (String(noteText || "").match(/```statblock\s*\n([\s\S]*?)```/i) || [])[1] || "";
  const field = block.match(/^modNaming[ \t]*:[ \t]*([^\n]*(?:\n(?![A-Za-z_][\w -]*[ \t]*:)[^\n]*)*)/m);
  if (!field) return [];
  let rules;
  try { rules = obsidian.parseYaml?.(field[0])?.modNaming; } catch {}
  if (!Array.isArray(rules)) {
    rules = []; let rule;
    field[1].split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*(-\s*)?(slot|replace|with):\s*["']?(.*?)["']?\s*$/);
      if (!match) return;
      if (match[1]) { rule = {}; rules.push(rule); }
      if (rule) rule[match[2]] = match[3];
    });
  }
  return rules.filter(rule => rule && String(rule.slot || "").trim() && String(rule.replace || "")).map(rule => ({slot:String(rule.slot).trim(),replace:String(rule.replace),with:String(rule.with ?? "")}));
}
async function fetchWeaponNamingRules(weapon) {
  const file = app.vault?.getAbstractFileByPath?.(String(weapon.sourcePath || ""));
  if (!file) return [];
  return readWeaponNamingRules(await app.vault.read(file));
}
function applyWeaponNamingRules(baseName, rules, addons, slots) {
  const stem = value => String(value || "").split("/").pop().replace(/\.md$/i, "").trim().toLowerCase();
  let name = String(baseName || "");
  for (const rule of rules) {
    const targets = slots.filter(slot => String(slot.slot || "").replace(/:$/, "").trim().toLowerCase() === rule.slot.toLowerCase());
    const installed = addons.some(mod => mod.type !== "legendary" && targets.some(slot => stem(slot.target) === stem(mod.id || mod.basename || mod.name)));
    if (!installed) continue;
    const literal = rule.replace.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match a word, so Gun never rewrites the end of Shotgun.
    name = name.replace(new RegExp(`\\b${literal}\\b`, "gi"), () => rule.with);
  }
  return name;
}

// Refresh a generated name from the actual mod definitions when transferring
// between inventory and prepared weapons (including older lightweight addons).
async function vkRefreshWeaponGeneratedName(row) {
  if (!row || !Array.isArray(row.addons)) return;
  const [definitions, namingRules, slots] = await Promise.all([fetchWeaponAddonData(),fetchWeaponNamingRules(row),fetchWeaponAllowedMods(row)]);
  const byId = new Map(definitions.map(d => [d.id, d]));
  const additions = row.addons.map((a, order) => {
    const stem = String(a.id || a.basename || "").split("/").pop().replace(/\.md$/i, "").toLowerCase();
    const def = byId.get(a.id) || definitions.find(d =>
      String(d.basename || d.id || "").split("/").pop().replace(/\.md$/i, "").toLowerCase() === stem && d.type === a.type);
    return { mod: def || a, order };
  });
  // Keep the existing installed order within normal and legendary groups.
  additions.sort((a,b) => (a.mod.type === "legendary" ? 0 : 1) - (b.mod.type === "legendary" ? 0 : 1) || a.order-b.order);
  const prefixes = additions.map(({mod}) => String(mod.namePrefix || "").trim()).filter(Boolean);
  row.generatedName = [...prefixes, applyWeaponNamingRules(vkWeaponBaseName(row),namingRules,additions.map(a=>a.mod),slots)].join(" ");
}

function noteTargetFromSource({ sourcePath = "", yamlName = "", rawLink = "", fallbackName = "Item" } = {}) {
  const path = String(sourcePath || "").trim();
  if (path) return path.replace(/\.md$/i, "");

  const yaml = String(yamlName || "").trim();
  if (yaml) return yaml.replace(/\.md$/i, "");

  const raw = String(rawLink || "").trim();
  const aliasMatch = raw.match(/^\[\[([^\]|]+)(?:\|[^\]]+)?\]\]$/);
  if (aliasMatch) return aliasMatch[1].trim();

  return stripWikiLink(raw || fallbackName);
}

function sourceDisplayName({ sourcePath = "", yamlName = "", rawLink = "", fallbackName = "Item" } = {}) {
  const raw = String(rawLink || "").trim();
  const aliasMatch = raw.match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]$/);
  if (aliasMatch) {
    // Keep the full vault path for navigation, but show only the note title.
    // Explicit wikilink aliases still take precedence.
    return String(aliasMatch[2] || aliasMatch[1].split("/").pop()).trim();
  }

  const yaml = String(yamlName || "").trim();
  if (yaml) return yaml.replace(/\.md$/i, "");

  const path = String(sourcePath || "").trim();
  if (path) return path.split("/").pop()?.replace(/\.md$/i, "") || fallbackName;

  return stripWikiLink(raw || fallbackName);
}

// Use the alias from the weapon's own allowed-mod wikilink, when available.
// Match the exact note target, never the potentially duplicated visible name.
function vkApplyWeaponModAlias(linkContainer, weapon, addon) {
  if (!linkContainer || !weapon || !addon) return;
  fetchWeaponAllowedMods(weapon).then(allowed => {
    if (!linkContainer.isConnected) return;
    const target = String(addon.id || addon.link || "")
      .replace(/^\[\[|\]\]$/g, "").split("|")[0]
      .replace(/\\/g, "/").replace(/\.md$/i, "");
    const match = allowed.find(entry => {
      const expected = String(entry.target || "").replace(/\\/g, "/").replace(/\.md$/i, "");
      return target === expected || target.endsWith("/" + expected);
    });
    const explicitAlias = String(addon.link || "").match(/^\[\[[^|\]]+\|([^\]]+)\]\]$/)?.[1];
    const alias = match?.name || explicitAlias;
    const link = linkContainer.querySelector("a.internal-link");
    if (alias && link) link.textContent = alias;
  }).catch(() => {});
}

function appendSourceWikiLink(container, rawLink, fallbackName = "Item", sourcePath = "", yamlName = "", aliasText = "") {
  const target = noteTargetFromSource({ sourcePath, yamlName, rawLink, fallbackName });
  if (!target) return;

  const display = String(aliasText || "").trim() ||
    sourceDisplayName({ sourcePath, yamlName, rawLink, fallbackName });

  const a = document.createElement("a");
  a.className = "internal-link";
  a.textContent = display;
  a.setAttribute("data-href", target);
  a.href = target;
  a.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    app.workspace.openLinkText(target, "", false);
  };
  container.appendChild(a);
}

function parseAmmoOptions(ammoStr) {
  let raw = String(ammoStr ?? "").trim();
  if (!raw || raw.toLowerCase() === "n/a") return [];

  // Strip wrapping quotes if present: "A/B" -> A/B
  raw = raw.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1").trim();

  // If someone ever stored "A or B", normalize to delimiter as well (optional hardening)
  // This prevents labels like "A or B:" from appearing as one option.
  raw = raw.replace(/\s+or\s+/gi, "/");

  // Split on slash into separate options
  return raw
    .split("/")
    .map(s => s.trim())
    .filter(Boolean);
}


function isExcludedWeaponPath(path) {
  const p = String(path ?? "");
  return AMMO_EXCLUSION_PREFIXES.some(prefix => p.startsWith(prefix));
}

function isThrowingOrExplosiveWeaponPath(path) {
  const p = String(path ?? "");
  if (AMMO_SPECIAL_INCLUSION_PATHS.has(p)) return true;
  return p.startsWith(THROWING_WEAPONS_FOLDER) || p.startsWith(EXPLOSIVE_WEAPONS_FOLDER);
}


// Read just the item's gameEffects field, including quoted and block YAML text.
function readWeaponGameEffects(noteText) {
  const match = String(noteText || "").match(/```statblock\s*\n([\s\S]*?)```/i);
  if (!match) return "";
  const block = match[1].replace(/\r\n/g, "\n");
  const field = block.match(/^gameEffects[ \t]*:[ \t]*([^\n]*(?:\n(?![A-Za-z_][\w -]*[ \t]*:)[^\n]*)*)/im);
  if (!field) return "";
  if (typeof obsidian.parseYaml === "function") {
    // Parse the isolated field so unrelated YAML-ish statblock fields cannot break it.
    try {
      const parsed = obsidian.parseYaml(field[0]);
      const value = parsed?.gameEffects ?? Object.entries(parsed || {}).find(([key]) => key.toLowerCase() === "gameeffects")?.[1];
      if (typeof value === "string" || typeof value === "number") return String(value).trim();
      if (value == null) return "";
    } catch (err) { console.warn("Vault-Kit: could not parse weapon gameEffects", err); }
  }
  const raw = field[1].trim();
  if (/^[|>]/.test(raw)) return raw.replace(/^[|>][+-]?[^\n]*\n?/, "").split("\n").map(line => line.replace(/^\s+/, "")).join(raw.startsWith(">") ? " " : "\n").trim();
  if (raw.startsWith('"') && raw.endsWith('"')) {
    try { return JSON.parse(raw).trim(); } catch {}
  }
  return raw.replace(/^["']|["']$/g, "").replace(/\\n/g, "\n").trim();
}
async function loadWeaponGameEffects(weapon) {
  const path = String(weapon.sourcePath || "");
  const file = path ? app.vault?.getAbstractFileByPath?.(path) : null;
  if (!file) return String(weapon.gameEffects || "");
  try {
    // Read the current source on card load. This descriptive text is never persisted.
    return readWeaponGameEffects(await app.vault.read(file));
  } catch (err) {
    console.warn("Vault-Kit: could not read weapon Special", err);
    return "";
  }
}

// Keep descriptive mod text transient and resolve relative Markdown from its own note.
async function loadWeaponSpecialSources(weapon, {includeAmmo=false} = {}) {
  const sources = [];
  const base = await loadWeaponGameEffects(weapon);
  if (hasCombatDisplayValue(base)) sources.push({label:vkWeaponBaseName(weapon),text:base,id:weapon.sourcePath || ""});
  const mods = await Promise.all((weapon.addons || []).map(async addon => {
    const direct = addon.id && app.vault?.getAbstractFileByPath?.(addon.id);
    const target = String(addon.link || "").replace(/^\[\[|\]\]$/g, "").split("|")[0];
    const file = direct || (target && app.metadataCache?.getFirstLinkpathDest?.(target, weapon.sourcePath || ""));
    if (!file) return null;
    try {
      const text = readWeaponGameEffects(await app.vault.read(file));
      return hasCombatDisplayValue(text) ? {label:addon.displayName || sourceDisplayName({sourcePath:file.path,rawLink:addon.link,fallbackName:addon.basename || "Modification"}),text,id:file.path} : null;
    } catch (error) { console.warn("Vault-Kit: could not read modification Special", error); return null; }
  }));
  if(includeAmmo && vkIsSyringer(weapon)) {
    const path=vkSyringePath({sourcePath:weapon.selectedAmmoPath});
    const file=path && app.vault?.getAbstractFileByPath?.(path);
    if(file)try {
      const text=readWeaponGameEffects(await app.vault.read(file));
      if(hasCombatDisplayValue(text))sources.push({label:`Ammunition · ${vkSyringeLabel(path)}`,text,id:path});
    } catch(error) {console.warn("Vault-Kit: could not read syringe Special",error);}
  }
  return [...sources,...mods.filter(Boolean)];
}

// --- Fetch and Parse Weapons ---
let cachedWeaponData = null;
async function fetchWeaponData() {
    if (cachedWeaponData) return cachedWeaponData;
    const WEAPONS_FOLDER = "Fallout-RPG/Items/Weapons";
    let allFiles = await app.vault.getFiles();
    let weaponFiles = allFiles.filter(file => file.path.startsWith(WEAPONS_FOLDER));
    let weapons = await Promise.all(weaponFiles.map(async (file) => {
        let content = await app.vault.read(file);
        let stats = {
		  link: `[[${file.basename}]]`,
		  sourcePath: file.path,  // NEW
		  type: "N/A",
		  damage: "N/A",
		  damage_effects: "N/A",
		  dmgtype: "Unknown",
		  fire_rate: "N/A",
		  range: "N/A",
		  qualities: "N/A",
		  ammo: "N/A",
		  weight: "N/A",
		  cost: "N/A",
		  rate: "N/A"
		};
        let statblockMatch = content.match(/```statblock([\s\S]*?)```/);
        if (!statblockMatch) return stats;
        let statblockContent = statblockMatch[1].trim();
        const patterns = {
            name: /name:\s*(.+)/i,
            type: /type:\s*(.+)/i,
            damage: /damage_rating:\s*(.+)/i,
            damage_effects: /damage_effects:\s*(.+)/i,
            dmgtype: /damage_type:\s*(.+)/i,
            fire_rate: /fire_rate:\s*(.+)/i,
            range: /range:\s*(.+)/i,
            qualities: /qualities:\s*(.+)/i,
            ammo: /ammo:\s*(.+)/i,
            weight: /weight:\s*(.+)/i,
            cost: /cost:\s*(.+)/i,
            rate: /rate:\s*(.+)/i
        };
        for (const [key, pattern] of Object.entries(patterns)) {
            let result = statblockContent.match(pattern);
            if (result) stats[key] = result[1].trim().replace(/"/g, '');
        }
        return stats;
    }));
    cachedWeaponData = weapons.filter(w => w);
    return cachedWeaponData;
}

// ---------------- Weapon Mods (FULL STATS via effects schema) ----------------

// IMPORTANT: Set this to your actual mods folder(s)
const WEAPON_MOD_FOLDERS = [
  "Fallout-RPG/Items/Mods/Weapon Mods"
];

const LEGENDARY_PROP_FOLDER =
  "Fallout-RPG/Items/Mods/Legendary Mods/Weapons";

let cachedWeaponModData = null;

// ---------- basic helpers ----------
function extractFirstInt(s) {
  if (s == null) return NaN;
  const m = String(s).match(/-?\d+/);
  return m ? parseInt(m[0], 10) : NaN;
}

function parseSignedInt(s) {
  const n = extractFirstInt(s);
  return Number.isNaN(n) ? 0 : n;
}

function stripQuotes(s) {
  return String(s ?? "").trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
}

// ---------- damage helpers (normalize "7 D6" + mod "-1d6") ----------
function parseNd6(raw) {
  // Accept: "7 D6", "7d6", "7 d6"
  const m = String(raw ?? "").trim().match(/^(\d+)\s*[dD]\s*6$/) || String(raw ?? "").trim().match(/^(\d+)\s*[dD]\s*6$/);
  if (!m) return null;
  return { n: parseInt(m[1], 10) };
}

function normalizeNd6(raw) {
  const p = parseNd6(String(raw ?? "").replace(/\s+/g, " ").trim().replace(/^(\d+)\s*[dD]\s*6$/i, "$1d6"));
  if (!p) return "";
  return `${p.n}d6`;
}

function toDisplayNd6(norm) {
  const p = String(norm ?? "").match(/^(\d+)d6$/i);
  if (!p) return String(norm ?? "");
  return `${parseInt(p[1], 10)} D6`;
}

function applyDamageDelta(baseNorm, deltaRaw) {
  // delta: "+1d6" or "-2d6"
  const dm = String(deltaRaw ?? "").trim().replace(/\s+/g, "").match(/^([+-])(\d+)d6$/i);
  if (!dm) return baseNorm;

  const sign = dm[1];
  const dn = parseInt(dm[2], 10);

  const bm = String(baseNorm ?? "").trim().match(/^(\d+)d6$/i);
  if (!bm) return baseNorm;

  const bn = parseInt(bm[1], 10);
  const out = sign === "+" ? (bn + dn) : (bn - dn);
  return `${Math.max(0, out)}d6`;
}

// ---------- range ladder ----------
const RANGE_LADDER = ["", "C", "M", "L", "X"];

function shiftRange(baseRange, delta) {
  const r = String(baseRange ?? "").trim().toUpperCase();
  const idx = RANGE_LADDER.indexOf(r);
  const start = idx >= 0 ? idx : 0;
  const end = Math.max(0, Math.min(RANGE_LADDER.length - 1, start + (delta || 0)));
  return RANGE_LADDER[end];
}

// ---------- parsing & applying Qualities / Damage Effects ----------
function splitCommaList(s) {
  return String(s ?? "")
    .split(",")
    .map(x => x.trim())
    .filter(Boolean);
}

function parseBracketEntry(token) {
  // token examples:
  // "[[Recoil]] (9)"
  // "[[Inaccurate]]"
  // "[[Piercing]] (1) some trailing text"
  // "[[Piercing]] (2) 2"   <-- bad legacy form we normalize
  const t = String(token ?? "").trim();
  const m = t.match(/^\[\[([^\]]+)\]\](?:\s*\((\-?\d+)\))?(.*)$/);
  if (!m) return null;

  const name = m[1].trim();
  let num = m[2] != null ? parseInt(m[2], 10) : null;

  // Anything after the optional "(n)" is extra text
  let extra = (m[3] ?? "").trim();

  // --- Normalize numeric "extra" like " 2" that duplicates num, or supplies num when missing ---
  // If extra starts with a number, e.g. "2", "2 something"
  const em = extra.match(/^(\-?\d+)\b(.*)$/);
  if (em) {
    const extraNum = parseInt(em[1], 10);
    const rest = (em[2] ?? "").trim();

    if (num == null) {
      // No "(n)" present, so treat leading numeric extra as the number
      num = extraNum;
      extra = rest;
    } else if (extraNum === num) {
      // "(n) n" duplication -> remove the duplicate number
      extra = rest;
    }
  }

  return { name, num, extra };
}


function entryToString(e) {
  if (!e) return "";
  const base = `[[${e.name}]]`;
  const withNum = (e.num != null) ? `${base} (${e.num})` : base;
  return e.extra ? `${withNum} ${e.extra}` : withNum;
}

function listToMap(listStr) {
  const map = new Map();
  for (const tok of splitCommaList(listStr)) {
    const e = parseBracketEntry(tok);
    if (!e) continue;
    map.set(e.name.toLowerCase(), e);
  }
  return map;
}

function mapToListString(map) {
  return Array.from(map.values()).map(entryToString).join(", ");
}

function applyGainRemove(map, opLine) {
  // Supports:
  // - "Gain [[Piercing]] (1)"
  // - "Remove [[Inaccurate]]"
  // - "Gain Accurate"
  // - "Remove Reliable"
  // - "Gain [[Accurate]]"
  // - plus optional "(n)" and trailing text
  const raw = String(opLine ?? "").trim();
  if (!raw) return;

  // Simple tick so we can enforce mutual-exclusion with last-write-wins
  applyGainRemove._tick = (applyGainRemove._tick || 0) + 1;
  const tick = applyGainRemove._tick;

  // 1) Bracketed form
  let m = raw.match(/^(Gain|Remove)\s+\[\[([^\]]+)\]\](?:\s*\((\-?\d+)\))?(.*)$/i);

  // 2) Plain-text form (no brackets)
  if (!m) {
    m = raw.match(/^(Gain|Remove)\s+(.+?)(?:\s*\((\-?\d+)\))?(.*)$/i);
  }

  if (!m) return;

  const verb = String(m[1]).toLowerCase();

  // namePart may be "[[Accurate]]" or "Accurate" or "Gain Accurate" (dirty)
  let namePart = String(m[2] ?? "").trim();
  const num = m[3] != null ? parseInt(m[3], 10) : null;
  const extra = String(m[4] ?? "").trim();

  // Strip accidental wrapping [[...]]
  const bracket = namePart.match(/^\[\[([^\]]+)\]\]$/);
  if (bracket) namePart = bracket[1].trim();

  // Strip accidental "Gain " / "Remove " prefixes if they got embedded
  namePart = namePart.replace(/^(gain|remove)\s+/i, "").trim();

  const name = namePart;
  if (!name) return;

  const key = name.toLowerCase();
  const existing = map.get(key);

  if (verb === "gain") {
    if (!existing) {
      map.set(key, { name, num, extra, _t: tick });
      return;
    }

    // compound numeric if provided
    if (num != null) {
      const cur = (existing.num != null) ? existing.num : 0;
      existing.num = cur + num;
    }

    // preserve extra; only set if missing
    if (!existing.extra && extra) existing.extra = extra;

    existing._t = tick;
    map.set(key, existing);
    return;
  }

  // remove
  if (!existing) return;

  if (num == null) {
    map.delete(key);
    return;
  }

  // numeric remove: subtract if existing has numeric; otherwise remove entirely
  if (existing.num == null) {
    map.delete(key);
    return;
  }

  const out = existing.num - num;
  if (out <= 0) map.delete(key);
  else {
    existing.num = out;
    existing._t = tick;
    map.set(key, existing);
  }
}

function enforceMutualExclusive(map) {
  const pairs = [
    ["reliable", "unreliable"],
    ["accurate", "inaccurate"],
  ];

  for (const [a, b] of pairs) {
    const ea = map.get(a);
    const eb = map.get(b);
    if (!ea || !eb) continue;

    // last-write-wins based on the _t tick we set in applyGainRemove
    const ta = ea._t || 0;
    const tb = eb._t || 0;

    if (ta >= tb) map.delete(b);
    else map.delete(a);
  }
}


// ---------- weapon base snapshot ----------
function ensureWeaponBaseSnapshot(rowData) {
  if (!rowData) return;
  if (!rowData.baseWeapon) {
    rowData.baseWeapon = {
      damage: rowData.damage ?? "",
      damage_effects: rowData.damage_effects ?? "",
      qualities: rowData.qualities ?? "",
      ammo: rowData.ammo ?? "",
      dmgtype: rowData.dmgtype ?? "",
      range: rowData.range ?? "",
      fire_rate: rowData.fire_rate ?? "",
      rate: rowData.rate ?? "",
      weight: rowData.weight ?? "",
      cost: rowData.cost ?? "",
      type: rowData.type ?? "",
      link: rowData.link ?? ""
    };
  }

  // Keep these for compatibility with older logic
  if (rowData.baseCost === undefined) rowData.baseCost = rowData.baseWeapon.cost ?? "";
  if (rowData.baseWeight === undefined) rowData.baseWeight = rowData.baseWeapon.weight ?? "";
}

// ---------- the main recompute ----------
function recalcWeaponFromAddons(rowData) {
  ensureWeaponBaseSnapshot(rowData);

  const base = rowData.baseWeapon || {};
  const addons = Array.isArray(rowData.addons) ? rowData.addons : [];

  // --- last-write-wins SET operations ---
  let setBaseDamageTo = null;   // "Change Base Damage To"
  let setAmmoTo = null;         // "Change Ammo Type"
  let setDamageTypeTo = null;   // "Change Damage Type"

  // --- deltas / mutations ---
  const damageDeltas = [];      // list of "+1d6" / "-1d6"
  let fireRateDelta = 0;        // sum of +/- ints
  let rangeDelta = 0;           // sum of +/- ints
  let weightDelta = 0;          // sum of +/- ints (your weight is "+2" style)

  // For qualities + damage effects (compounding)
  const qualitiesMap = listToMap(base.qualities);
  const dmgEffectsMap = listToMap(base.damage_effects);

  // Cost is always additive like your prior behavior
  const baseCostNum = extractFirstInt(base.cost);
  const baseWeightNum = extractFirstInt(base.weight);

  // Walk all addon effects in order: last-write-wins naturally means "overwrite on later"
  for (const a of addons) {
    // Additive cost & weight from addon lines
    // (Even if effects also contain changes, your statblock already has weight/cost fields)
    weightDelta += parseSignedInt(a.weight);
    // costDelta is computed later from addon.cost so it remains aligned with your existing behavior

    const effs = Array.isArray(a.effects) ? a.effects : [];
    for (const eff of effs) {
      const name = String(eff?.name ?? "").trim().toLowerCase();
      const desc = String(eff?.desc ?? "").trim();

      if (!name) continue;

      // SET ops (last-write-wins)
      if (name === "change base damage to") {
        setBaseDamageTo = desc;
        continue;
      }
      if (name === "change ammo type") {
        setAmmoTo = desc;
        continue;
      }
      if (
		name === "change damage type" ||
		name === "change damage type to" ||
		name === "damage type"
	  ) {
		setDamageTypeTo = desc;
		continue;
	  }



      // DELTAS / mutations
      if (name === "damage") {
        // expect "+1d6" / "-1d6"
        damageDeltas.push(desc);
        continue;
      }
      if (name === "fire rate") {
        fireRateDelta += parseSignedInt(desc);
        continue;
      }
      if (name === "range") {
        rangeDelta += parseSignedInt(desc);
        continue;
      }
      if (name === "weapon qualities") {
	    for (const op of splitCommaList(desc)) applyGainRemove(qualitiesMap, op);
		continue;
	  }
	  if (name === "weapon damage effects") {
		for (const op of splitCommaList(desc)) applyGainRemove(dmgEffectsMap, op);
		continue;
	  }

      // If you later add more schema keys, handle them here
    }
  }

  // --- Apply SET ops first (base damage first) ---
  // Damage base
  let damageNorm = normalizeNd6(base.damage);

  if (setBaseDamageTo) {
    const over = normalizeNd6(setBaseDamageTo);
    if (over) damageNorm = over;
  }

  // Ammo and damage type base (last-write-wins)
  let ammo = base.ammo ?? "";
  if (setAmmoTo) ammo = setAmmoTo;

  let dmgtype = base.dmgtype ?? "";
  if (setDamageTypeTo) dmgtype = setDamageTypeTo;

  // --- Now apply deltas on top ---
  for (const d of damageDeltas) {
    // normalize delta to "+1d6" format
    const cleaned = String(d ?? "").trim().replace(/\s+/g, "");
    damageNorm = applyDamageDelta(damageNorm, cleaned);
  }

  // Fire Rate numeric adjust (stored field; not currently a column, but you parse it)
  let fire_rate_num = extractFirstInt(base.fire_rate);
  if (Number.isNaN(fire_rate_num)) fire_rate_num = extractFirstInt(rowData.fire_rate);
  if (Number.isNaN(fire_rate_num)) fire_rate_num = 0;
  const fire_rate = String(Math.max(0, fire_rate_num + fireRateDelta));

  // Range ladder adjust
  const range = shiftRange(base.range, rangeDelta);

  // Cost additive (preserve your existing behavior)
  if (!Number.isNaN(baseCostNum)) {
    const costDelta = addons.reduce((sum, x) => sum + (extractFirstInt(x.cost) || 0), 0);
    rowData.cost = String(baseCostNum + costDelta);
  }

  // Weight additive
  if (!Number.isNaN(baseWeightNum)) {
    rowData.weight = String(baseWeightNum + weightDelta);
  }

  // Write back the computed weapon fields
  rowData.damage = toDisplayNd6(damageNorm) || rowData.damage;
  rowData.ammo = ammo;
  rowData.dmgtype = dmgtype;
  rowData.fire_rate = fire_rate;
  rowData.rate = fire_rate;
  rowData.range = range;
  enforceMutualExclusive(qualitiesMap);
  rowData.qualities = mapToListString(qualitiesMap);
  rowData.damage_effects = mapToListString(dmgEffectsMap);

  // Special text comes from current source gameEffects, never cached narrative effects.
  delete rowData.effects_note;
}

// ---------- parse mods from statblock (your new schema) ----------
function parseWeaponModStatblock(blockRaw) {
  const block = String(blockRaw ?? "").replace(/\r\n/g, "\n");

  const getTopLevel = (key) => {
    // matches: key: "value"  OR  key: value
    const re = new RegExp(`^${key}\\s*:\\s*(.+)$`, "im");
    const m = block.match(re);
    return m ? stripQuotes(m[1].trim()) : "";
  };

  const cost = getTopLevel("cost") || "+0";
  const weight = getTopLevel("weight") || "+0";

  // Parse YAML-ish effects list:
  // effects:
  //  - name: "Damage"
  //    desc: "-1d6"
  const effects = [];
  const lines = block.split("\n");

  const startIdx = lines.findIndex(l => l.trim().toLowerCase() === "effects:");
  if (startIdx >= 0) {
    let cur = null;

    for (let i = startIdx + 1; i < lines.length; i++) {
      const line = lines[i];

      // Stop when we hit another top-level key (no leading spaces) like "weight:" or "cost:"
      if (/^[A-Za-z0-9_\- ]+\s*:\s*/.test(line) && !/^\s/.test(line)) break;

      const nameMatch = line.match(/^\s*-\s*name:\s*(.+)\s*$/i);
      if (nameMatch) {
        if (cur && cur.name) effects.push(cur);
        cur = { name: stripQuotes(nameMatch[1]), desc: "" };
        continue;
      }

      const descMatch = line.match(/^\s*desc:\s*(.+)\s*$/i);
      if (descMatch && cur) {
        cur.desc = stripQuotes(descMatch[1]);
        continue;
      }
    }

    if (cur && cur.name) effects.push(cur);
  }

  return { cost, weight, effects, displayName: getTopLevel("mod"), namePrefix: getTopLevel("name prefix"), complexity: getTopLevel("complexity"), skill: getTopLevel("skill"), perks: getTopLevel("perks") || getTopLevel("perk"), rarity: getTopLevel("rarity") };
}

// Read compatible mod names and slot order directly from the weapon source.
// A source without a readable mods block is treated as having no standard slots.
async function fetchWeaponAllowedMods(weapon) {
  const path = String(weapon.sourcePath || "");
  let file = path ? app.vault.getAbstractFileByPath(path) : null;
  // Older character exports may retain a link but not a valid sourcePath.
  if (!file || file.extension !== "md") {
    const target = String(weapon.link || weapon.name || "").replace(/^\[\[|\]\]$/g, "").split("|")[0];
    file = app.metadataCache.getFirstLinkpathDest(target, "");
  }
  if (!file || file.extension !== "md") return [];
  const content = await app.vault.read(file);
  const block = (content.match(/```statblock\s*([\s\S]*?)```/i) || [])[1] || "";
  const lines = block.split(/\r?\n/);
  const start = lines.findIndex(line => /^mods:\s*$/i.test(line.trim()));
  if (start < 0) return [];
  const allowed = [];
  let slot = "";
  let group = -1;
  for (const line of lines.slice(start + 1)) {
    if (line.trim() && !/^\s/.test(line)) break;
    // Empty name is valid YAML: name: "".
    const heading = line.match(/^\s*-\s*name:\s*(.*?)\s*$/i);
    if (heading) {
      slot = heading[1].replace(/^[\"']|[\"']$/g, "").replace(/:$/, "").trim();
      group++;
      continue;
    }
    const desc = line.match(/^\s*desc:\s*(.*)$/i);
    if (!desc || group < 0) continue;
    for (const match of desc[1].matchAll(/\[\[([^\]]+)\]\]/g)) {
      const [target,alias] = match[1].split("|");
      const display = (alias || target).trim();
      allowed.push({slot:slot || "Modification",group,name:display,target:target.trim().replace(/\.md$/i, "")});
    }
  }
  return allowed;
}

// ---------- fetch addon data (mods + legendary) ----------
async function fetchWeaponAddonData() {
  if (cachedWeaponModData) return cachedWeaponModData;

  const allFiles = await app.vault.getFiles();

  const addonFiles = allFiles.filter(f => {
    const isMod = WEAPON_MOD_FOLDERS.some(folder => f.path.startsWith(folder + "/"));
    const isLegendary = f.path.startsWith(LEGENDARY_PROP_FOLDER + "/");
    return isMod || isLegendary;
  });

  const addons = await Promise.all(addonFiles.map(async (file) => {
    const isLegendary = file.path.startsWith(LEGENDARY_PROP_FOLDER + "/");

    // Parse standard and legendary mods through the same statblock pipeline.
    // Legendary files may contain mechanical effects, cost, and weight too.
    // Mod: parse statblock including effects schema
    const content = await app.vault.read(file);
    const statblockMatch = content.match(/```statblock([\s\S]*?)```/);
    if (!statblockMatch) return null;

    const block = statblockMatch[1].trim();
    const parsed = parseWeaponModStatblock(block);

    return {
      id: file.path,
      basename: file.basename,
      displayName: parsed.displayName || file.basename,
      namePrefix: parsed.namePrefix,
      complexity: parsed.complexity,
      skill: parsed.skill,
      perks: parsed.perks,
      rarity: parsed.rarity,
      // Use the full vault path: different weapon families can share a mod name.
      link: `[[${file.path.replace(/\.md$/i, "")}]]`,
      cost: parsed.cost || "+0",
      weight: parsed.weight || "+0",
      effects: parsed.effects || [],
      type: isLegendary ? "legendary" : "mod",
      isLegendary
    };
  }));

  cachedWeaponModData = addons.filter(Boolean);
  return cachedWeaponModData;
}



// Simple picker modal (search + click to add)
function openWeaponModPicker({ rowData, onAdded }) {
  const overlay = document.createElement("div");
    overlay.classList.add("vk-modal-overlay");
  overlay.style = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    background:rgba(30,40,50,0.70);z-index:99999;display:flex;
    align-items:center;justify-content:center;`;

  const modal = document.createElement("div");
    modal.classList.add("vk-modal");
  modal.style = `
    background:#172a3b;padding:16px;border-radius:12px;
    border:3px solid #ffc200;min-width:340px;max-width:92vw;`;

  const title = document.createElement("div");
  title.textContent = "Add Weapon Mod";
  title.style = "color:#ffc200;font-weight:bold;margin-bottom:10px;text-align:center;";
  modal.appendChild(title);

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search mods...";
  input.style = `
    width:100%;padding:7px;border-radius:6px;border:1.5px solid #ffc200;
    background:#fde4c9;color:#000;caret-color:#000;margin-bottom:10px;`;
  modal.appendChild(input);

  const results = document.createElement("div");
  results.style.background = '#10283a';
  results.style.borderRadius = '8px';
  results.style.maxHeight = '260px';
  results.style.overflow = 'auto';
  results.style.border = '1px solid rgba(255,194,0,.32)';
  results.style.color = '#f4ead5';
  modal.appendChild(results);

  const btnRow = document.createElement("div");
  btnRow.style = "display:flex;justify-content:center;margin-top:10px;";
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.style = "background:#172a3b;color:#ffc200;font-weight:bold;padding:6px 16px;border-radius:6px;border:2px solid #ffc200;cursor:pointer;";
  closeBtn.onclick = () => document.body.removeChild(overlay);
  btnRow.appendChild(closeBtn);
  modal.appendChild(btnRow);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  input.focus();

  const renderResults = async () => {
    const q = input.value.trim().toLowerCase();
    const mods = await fetchWeaponAddonData();
    const filtered = !q
      ? mods
      : mods.filter(m => (m.basename || "").toLowerCase().includes(q));
    
    
    filtered.sort((a, b) => {
	  const rank = (x) => (x.type === "mod" ? 0 : 1); // mods first
	  const r = rank(a) - rank(b);
	  if (r !== 0) return r;
	  return (a.basename || "").localeCompare(b.basename || "", undefined, { sensitivity: "base" });
	});


    
    
    results.innerHTML = "";
    filtered.forEach((m, idx) => {
      const row = document.createElement("div");
      row.className = "vk-modal-result";
      row.style = `
        padding:8px 10px;cursor:pointer;display:flex;justify-content:space-between;
        border-bottom:${idx < filtered.length - 1 ? "1px solid rgba(244,234,213,.12)" : "none"};`;
      const left = document.createElement("div");
      left.textContent = m.displayName || m.basename;
      const right = document.createElement("div");
      right.textContent = m.cost ? `Cost ${m.cost}` : "";
      right.style.color = "#c8d6df";
      right.style.opacity = "0.9";

      row.onmouseover = () => row.style.background = "#203d55";
      row.onmouseout = () => row.style.background = "";

      row.onclick = () => {
        if (!Array.isArray(rowData.addons)) rowData.addons = [];

        // prevent duplicates by id (path)
        if (rowData.addons.some(x => x.id === m.id)) return;

        rowData.addons.push({
		  id: m.id,
		  link: m.link,
		  cost: m.cost,
		  weight: m.weight,
		  effects: m.effects,
		  type: m.type,
		});


        // cost-only recalculation
        recalcWeaponFromAddons(rowData);

        onAdded && onAdded();
        document.body.removeChild(overlay);
      };

      row.append(left, right);
      results.appendChild(row);
    });
  };

  const debounced = debounce(renderResults, 150);
  input.addEventListener("input", debounced);
  renderResults();
}


// --- Equipped combat card and compact prepared list (6.19) ---
function weaponViewMarkdown(target, value, sourcePath = "") {
  const owner = weaponViewOwner, version = weaponViewVersion;
  const request = Symbol(); target._vkWeaponMarkdownRequest = request;
  target.dataset.weaponSourcePath = sourcePath;
  target.classList.add("vk-combat-markdown");
  target.textContent = String(value ?? "");
  const rendered = document.createElement("div");
  Promise.resolve().then(() => {
    if (!owner || owner !== weaponViewOwner || version !== weaponViewVersion || target._vkWeaponMarkdownRequest !== request) return;
    return renderMarkdownInto(rendered, String(value ?? ""), sourcePath, owner);
  }).then(() => {
    if (owner !== weaponViewOwner || version !== weaponViewVersion || target._vkWeaponMarkdownRequest !== request) return;
    target.replaceChildren(...rendered.childNodes);
  }).catch(err => console.warn("Vault-Kit: weapon view Markdown render failed", err));
}
function weaponViewName(target, weapon) {
  weaponViewMarkdown(target, weaponSourceMarkdown(weapon), weapon.sourcePath || "");
  if (weapon.instanceName || !(weapon.addons || []).length) return;
  const version = weaponViewVersion;
  const copy = structuredClone(weapon);
  vkRefreshWeaponGeneratedName(copy).then(() => {
    if (version !== weaponViewVersion || !target.isConnected) return;
    weaponViewMarkdown(target, weaponSourceMarkdown(copy), weapon.sourcePath || "");
  }).catch(err => console.warn("Vault-Kit: could not refresh weapon name",err));
}
function weaponViewLinks(container) {
  const leaf = app.workspace.getLeavesOfType("markdown").find(l => l.containerEl?.contains(sheetcontainer));
  const hoverParent = leaf?.view || { hoverPopover: null };
  const getLink = event => {
    const link = event.target?.closest?.("a.internal-link");
    if (!link || !container.contains(link)) return null;
    return { link, target: link.getAttribute("data-href") || link.getAttribute("href"),
      sourcePath: link.closest("[data-weapon-source-path]")?.dataset.weaponSourcePath || "" };
  };
  container.addEventListener("mouseover", event => {
    const result = getLink(event);
    if (!result?.target || result.link.contains(event.relatedTarget)) return;
    app.workspace.trigger("hover-link", { event, source: "preview", hoverParent,
      targetEl: result.link, linktext: result.target, sourcePath: result.sourcePath });
  });
  container.addEventListener("click", event => {
    const result = getLink(event);
    if (!result?.target) return;
    event.preventDefault(); event.stopPropagation();
    app.workspace.openLinkText(result.target, result.sourcePath, obsidian.Keymap?.isModEvent?.(event) || false);
  });
}
function weaponSourceMarkdown(weapon) {
  const target = noteTargetFromSource({ sourcePath: weapon.sourcePath, yamlName: weapon.yamlName,
    rawLink: weapon.link || weapon.name, fallbackName: "Weapon" });
  const label = vkWeaponDisplayName(weapon).replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\]/g, "\\]");
  return target ? `[[${target}|${label}]]` : label;
}
function combatButton(label, action, title = label) {
  const button = document.createElement("button");
  button.type = "button"; button.textContent = label;
  if (typeof obsidian.setTooltip === "function") obsidian.setTooltip(button, title);
  button.setAttribute("aria-label", title);
  button.className = "vk-combat-button";
  button.addEventListener("pointerdown", event => event.stopPropagation());
  button.onclick = event => { event.stopPropagation(); action(event); };
  return button;
}
function mutatePreparedWeapon(instanceId, mutate) {
  const rows = getPreparedWeapons();
  const live = rows.find(w => String(w.instanceId) === String(instanceId));
  if (!live) { showSheetNotice("Weapon is no longer prepared."); updateWeaponTableDOM(); return false; }
  mutate(live);
  localStorage.setItem("fallout_weapon_table", JSON.stringify(rows));
  updateWeaponTableDOM();
  return true;
}
function modifyPreparedWeapon(instanceId) {
  const live = getPreparedWeapons().find(w => String(w.instanceId) === String(instanceId));
  if (!live) { showSheetNotice("Weapon is no longer prepared."); return; }
  openEquipmentWorkbench({ item: live, kind: "weapon", inventoryWeapon:!!live.consumableRef,
    saveItem: live.consumableRef
      ? (draft,costs) => saveConsumableWorkbench(live,draft,costs)
      : draft => saveWorkbenchTableItem("fallout_weapon_table", live, draft) });
}
async function unprepareWeapon(instanceId) {
  const id = String(instanceId);
  if (pendingWeaponTransfers.has(id)) return;
  const live = getPreparedWeapons().find(w => String(w.instanceId) === id);
  if (!live) return;
  pendingWeaponTransfers.add(id); updateWeaponTableDOM();
  try {
    if (!live.consumableRef) await unequipWeaponToInventory(live);
    clearEquippedWeaponIfRemoved(live);
    const rows = getPreparedWeapons().filter(w => String(w.instanceId) !== id);
    localStorage.setItem("fallout_weapon_table", JSON.stringify(rows));
    window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
    showSheetNotice(`Unprepared ${vkWeaponDisplayName(live)}${live.consumableRef ? "" : " to inventory"}.`);
  } catch (err) {
    console.error("Vault-Kit: could not unprepare weapon", err);
    showSheetNotice("Could not return weapon to inventory.");
  } finally { pendingWeaponTransfers.delete(id); updateWeaponTableDOM(); }
}
function isConsumableWeapon(weapon) {
  const path = String(weapon?.sourcePath || "");
  const explosive = path.startsWith(EXPLOSIVE_WEAPONS_FOLDER + "/");
  const skill = String(weapon?.type || "").replace(/^['"]|['"]$/g, "").trim();
  return !!weapon?.consumableRef || explosive || (skill.toLowerCase() === "throwing" && hasCombatDisplayValue(weapon?.range));
}
async function saveConsumableWorkbench(original, draft, costs) {
  if (JSON.stringify(original.addons || []) === JSON.stringify(draft.addons || [])) {
    return saveWorkbenchTableItem("fallout_weapon_table",original,draft,costs);
  }
  const originalGear = localStorage.getItem(getGearStorageKey());
  const originalWeapons = localStorage.getItem("fallout_weapon_table");
  const gear = readGearRows(), weapons = getPreparedWeapons();
  const reference = weapons.find(row=>String(row.instanceId)===String(original.instanceId));
  const stack = getConsumableStacks(original,gear).filter(row=>row.qty>0).sort((a,b)=>a.qty-b.qty)[0];
  if (!reference || !stack) return false;
  const existing = gear[stack.gearIndex];
  const item = structuredClone(existing);
  item.instanceId = stack.qty > 1 || !existing.instanceId ? makeInventoryInstanceId() : existing.instanceId;
  item.qty = "1"; item.addons = lightweightInventoryAddons(draft.addons);
  if (draft.instanceName) item.instanceName = draft.instanceName; else delete item.instanceName;
  item.generatedName = draft.generatedName || "";
  await recalcInventoryItemFromSources(item);
  if (stack.qty > 1) { existing.qty=String(stack.qty-1);gear.splice(stack.gearIndex+1,0,item); }
  else gear[stack.gearIndex]=item;
  const spent = costs ? vkSpendMaterials(gear,costs) : gear;
  if (!spent) return false;
  reference.consumableInventoryId = item.instanceId;
  reference.addons = structuredClone(draft.addons || []);
  reference.generatedName = draft.generatedName || "";
  if (draft.instanceName) reference.instanceName = draft.instanceName; else delete reference.instanceName;
  recalcWeaponFromAddons(reference);
  try { writeGearRows(spent);localStorage.setItem("fallout_weapon_table",JSON.stringify(weapons)); }
  catch (err) {
    if(originalGear===null)localStorage.removeItem(getGearStorageKey());else localStorage.setItem(getGearStorageKey(),originalGear);
    if(originalWeapons===null)localStorage.removeItem("fallout_weapon_table");else localStorage.setItem("fallout_weapon_table",originalWeapons);
    return false;
  }
  window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
  return true;
}
function consumableModKey(row) {
  return (row.addons || []).map(mod=>String(mod.id || mod.link || mod.name || "")).sort().join("|");
}
function consumableInventoryMatches(weapon, item) {
  if (weapon.consumableInventoryId) return String(item.instanceId || "") === String(weapon.consumableInventoryId);
  if (item.instanceId || consumableModKey(weapon) !== consumableModKey(item)) return false;
  const path = String(weapon.sourcePath || "");
  if (path && item.sourcePath) return path === String(item.sourcePath);
  const target = row => noteTargetFromSource({sourcePath:row.sourcePath,rawLink:row.link || row.name,yamlName:row.yamlName}).split("/").pop().replace(/\.md$/i, "");
  return target(weapon) === target(item);
}
function getConsumableStacks(weapon, rows = readGearRows()) {
  return rows.map((item,gearIndex)=>({item,gearIndex,qty:Math.max(0,parseInt(item.qty || "0",10)||0)})).filter(stack=>consumableInventoryMatches(weapon,stack.item)).map(({gearIndex,qty})=>({gearIndex,qty}));
}
function getConsumableQuantity(weapon) { return getTotalQtyForStacks(getConsumableStacks(weapon)); }
function useConsumableWeapon(instanceId) {
  const weapon = getPreparedWeapons().find(row=>String(row.instanceId)===String(instanceId));
  if (!weapon || !isConsumableWeapon(weapon) || vkWeaponCondition(weapon).status==="broken") return;
  const rows = readGearRows(), stacks = getConsumableStacks(weapon,rows);
  const count=vkWeaponConditionView(weapon).ammoPerShot;
  if (getTotalQtyForStacks(stacks) < count) { updateWeaponTableDOM(); return; }
  applyDeltaAcrossStacks(rows,stacks,-count);
  writeGearRows(rows);
  window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
}
function migratePreparedConsumables() {
  const originalWeapons = localStorage.getItem("fallout_weapon_table");
  const originalGear = localStorage.getItem(getGearStorageKey());
  const weapons = getPreparedWeapons(), gear = readGearRows(); let changed = false;
  for (const weapon of weapons) {
    if (!isConsumableWeapon(weapon) || weapon.consumableRef) continue;
    // Legacy prepared rows represent one owned unit that was removed from Inventory.
    weapon.consumableRef = true;
    const unique = !!weapon.instanceName || (weapon.addons || []).length > 0;
    if (unique) weapon.consumableInventoryId = String(weapon.instanceId);
    const existing = gear.find(item=>consumableInventoryMatches(weapon,item));
    if (existing) existing.qty = String((parseInt(existing.qty || "0",10)||0)+1);
    else {
      const item = {name:weapon.link || `[[${vkWeaponBaseName(weapon)}]]`,sourcePath:weapon.sourcePath || "",yamlName:vkWeaponBaseName(weapon),qty:"1",category:"WEAPONS",cost:String(weapon.cost || "0"),weight:String(weapon.weight || "0"),addons:lightweightInventoryAddons(weapon.addons)};
      if (unique) { item.instanceId = weapon.consumableInventoryId; if (weapon.instanceName) item.instanceName = weapon.instanceName; }
      gear.push(item);
    }
    changed = true;
  }
  if (!changed) return;
  try { writeGearRows(gear);localStorage.setItem("fallout_weapon_table",JSON.stringify(weapons)); }
  catch (err) {
    if(originalGear===null)localStorage.removeItem(getGearStorageKey());else localStorage.setItem(getGearStorageKey(),originalGear);
    if(originalWeapons===null)localStorage.removeItem("fallout_weapon_table");else localStorage.setItem("fallout_weapon_table",originalWeapons);
    throw err;
  }
}

// Syringer selections reference ammo notes; quantities stay in inventory.
function vkIsSyringer(weapon) {
  return parseAmmoOptions(weapon?.ammo).some(name => stripWikiLink(name).trim().toLowerCase() === "syringer ammo");
}
function vkSyringePath(item) {
  let path = String(item?.sourcePath || "");
  if (!path) {
    const target = noteTargetFromSource({rawLink:item?.name || item?.link || item?.yamlName});
    path = app.metadataCache?.getFirstLinkpathDest?.(target, "")?.path || "";
  }
  return /(?:^|\/)Items\/Ammo\/Syringer Ammo\/.+\.md$/i.test(path) ? path : "";
}
function vkSyringeLabel(path) { return String(path).split("/").pop().replace(/\.md$/i, ""); }
function vkSyringeStacks(path, rows = readGearRows()) {
  return rows.map((item,gearIndex)=>({item,gearIndex,qty:Math.max(0,parseInt(item.qty || "0",10)||0)}))
    .filter(stack=>vkSyringePath(stack.item) === path && !!path)
    .map(({gearIndex,qty})=>({gearIndex,qty}));
}
function vkSyringeChoices(weapon) {
  const rows=readGearRows(), paths=new Set(rows.filter(item=>(Number(item.qty)||0)>0).map(vkSyringePath).filter(Boolean));
  const selected=vkSyringePath({sourcePath:weapon.selectedAmmoPath});
  if(selected)paths.add(selected);
  return [...paths].map(path=>({path,label:vkSyringeLabel(path),qty:getTotalQtyForStacks(vkSyringeStacks(path,rows))})).sort((a,b)=>a.label.localeCompare(b.label));
}
function vkSetSyringeQuantity(weaponId,path,total) {
  const live=getPreparedWeapons().find(row=>String(row.instanceId)===String(weaponId));
  if(!live || !vkIsSyringer(live) || live.selectedAmmoPath!==path)return;
  const desired=Number(total);if(!Number.isSafeInteger(desired)||desired<0||desired>9999)return;
  const rows=readGearRows(),stacks=vkSyringeStacks(path,rows);
  if(!stacks.length){updateWeaponTableDOM();return;}
  applyDeltaAcrossStacks(rows,stacks,desired-getTotalQtyForStacks(stacks),9999);
  writeGearRows(rows);window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
}
function renderSyringerAmmo(weapon) {
  const wrap=document.createElement("div");wrap.className="vk-syringer-ammo";
  const select=document.createElement("select");select.className="vk-syringer-select";select.setAttribute("aria-label","Syringer ammunition type");
  const empty=document.createElement("option");empty.value="";empty.textContent="Select syringe…";select.append(empty);
  const choices=vkSyringeChoices(weapon);
  for(const choice of choices){const option=document.createElement("option");option.value=choice.path;option.textContent=choice.label;select.append(option);}
  select.value=weapon.selectedAmmoPath || "";
  select.addEventListener("pointerdown",event=>event.stopPropagation());
  select.onchange=()=>mutatePreparedWeapon(weapon.instanceId,live=>{
    if(select.value && !vkSyringeChoices(live).some(choice=>choice.path===select.value && choice.qty>0))return;
    if(select.value)live.selectedAmmoPath=select.value;else delete live.selectedAmmoPath;
  });
  wrap.append(select);
  const selected=choices.find(choice=>choice.path===weapon.selectedAmmoPath);
  if(selected && selected.qty>0){
    const counter=createCompactPlusMinusRow({labelText:"Available",initialValue:selected.qty,min:0,max:9999,valueTitle:`Edit ${selected.label} quantity`,onChange:total=>vkSetSyringeQuantity(weapon.instanceId,selected.path,total)});
    counter.wrap.classList.add("vk-weapon-ammo-row");counter.valueSpan?.classList.add("vk-weapon-ammo-count");counter.wrap.prepend(counter.field);wrap.append(counter.wrap);
  } else {
    const status=document.createElement("span");status.className=selected?"vk-combat-warning":"vk-combat-muted";
    status.textContent=selected?"0 available · Out of stock":choices.length?"Choose an ammunition type":"No syringer ammunition in inventory";wrap.append(status);
  }
  return wrap;
}

function getCombatAmmoInfo(rowData) {
  if (vkIsSyringer(rowData)) return {mode:"syringer"};
  if (isConsumableWeapon(rowData)) return {mode:"consumable"};
  const weaponPath = String(rowData.sourcePath ?? "");
			  const weaponName = stripWikiLink(rowData.link);
			
			  // Exclusion folders: show nothing for melee/unique (unless special-included)
			  if (isExcludedWeaponPath(weaponPath) && !AMMO_SPECIAL_INCLUSION_PATHS.has(weaponPath)) {
			    return { mode: "none" };
			  }
			
			  // Consumables returned above; all other weapons use their ammo field.
			  const matchByWeaponName = false;
			
			  // "Anything" => infinity (only for normal ammo mode)
			  const rawAmmo = String(rowData.ammo ?? "").trim();
			  if (!matchByWeaponName && rawAmmo.toLowerCase() === "anything") {
			    return { mode: "infinite" };
			  }
			
			  const options = matchByWeaponName ? [weaponName] : parseAmmoOptions(rawAmmo);
			  if (!options.length) return { mode: "none" };
			
			  return { mode: "list", matchByWeaponName, options };
}
function getPreparedAmmoSummary(weapon) {
  if(vkIsSyringer(weapon)) {
    const choices=vkSyringeChoices(weapon),selected=choices.find(choice=>choice.path===weapon.selectedAmmoPath);
    return selected ? [{label:selected.label,value:selected.qty}] : [{label:"Syringer ammo",value:choices.reduce((sum,choice)=>sum+choice.qty,0),unit:" available"}];
  }
  if (isConsumableWeapon(weapon)) return [{label:"",value:getConsumableQuantity(weapon),unit:" available"}];
  const coreType = getWeaponChargedCoreType(weapon);
  if (coreType) {
    const label = coreType === "fusion" ? "Fusion Core" : "Plasma Core";
    const state = getLoadedCoreAmmoState(weapon);
    const units = getAvailableChargeUnits(coreType, weapon.loadedCore?.instanceId || "");
    const usable = units.filter(unit => {
      const ammo = getLoadedCoreAmmoState({ ...weapon, loadedCore: { instanceId: unit.instanceId } });
      return ammo ? Number(ammo.currentShots) > 0 : Number(unit.charges) > 0;
    }).length;
    const lines = [{ label, value: usable, unit: " usable" }];
    if (state) lines.push({ label: "Loaded", value: state.currentShots, unit: " shots" });
    return lines;
  }
  const info = getCombatAmmoInfo(weapon);
  if (info.mode === "none") return [{ label: "", value: "—" }];
  if (info.mode === "infinite") return [{ label: "Anything", value: "∞" }];
  return info.options.map(label => ({ label, value: getTotalQtyForStacks(findStacksForAmmoLabel({label, matchByWeaponName: info.matchByWeaponName})) }));
}
function renderPreparedAmmo(weapon) {
  const cell = document.createElement("td"); cell.className = "vk-prepared-ammo";
  getPreparedAmmoSummary(weapon).forEach(({label,value,unit = ""}) => {
    const line = document.createElement("div");
    line.className="vk-prepared-ammo-line";
    line.classList.toggle("is-unlabeled",!label);
    const caption = document.createElement("span"); caption.className = "vk-combat-muted";
    caption.textContent = label || "";
    const count = document.createElement("strong");count.className="vk-ammo-quantity";
    count.textContent = String(value) + unit;
    count.classList.toggle("is-empty", typeof value === "number" && value <= 0);
    line.append(caption,count);cell.appendChild(line);
  });
  return cell;
}
function weaponIcon(label, action, title, kind) {
  const button = combatButton(label, action, title);
  button.classList.add("vk-weapon-action-icon", "is-" + kind);
  styleEquipmentActionIcon(button, kind);
  return button;
}
function applyCombatTooltips(root) {
  root.querySelectorAll("[title]").forEach(element => {
    const text = element.getAttribute("title"); element.removeAttribute("title");
    if (text && typeof obsidian.setTooltip === "function") obsidian.setTooltip(element, text);
  });
}
function renderEquippedWeaponAmmo(rowData) {
  const ammoCell = document.createElement("div");
  ammoCell.className = "vk-combat-ammo-controls";
  const ammoInfo = getCombatAmmoInfo(rowData);
  if(ammoInfo.mode === "syringer") {ammoCell.append(renderSyringerAmmo(rowData));return ammoCell;}
  if (ammoInfo.mode === "consumable") {
    const count = getConsumableQuantity(rowData);
    const remaining = document.createElement("strong"); remaining.className="vk-weapon-ammo-count"; remaining.textContent=String(count);
    remaining.classList.toggle("is-empty",count===0);
    const use = combatButton(`Use ${rowData.ammoPerShot||1}`,()=>useConsumableWeapon(rowData.instanceId),`Use ${rowData.ammoPerShot||1} ${vkWeaponDisplayName(rowData)}`); use.disabled=count<(rowData.ammoPerShot||1) || rowData._vkCondition?.status==="broken";
    ammoCell.append(remaining,use);
    if (!count) { const empty=document.createElement("span");empty.className="vk-combat-warning";empty.textContent="Out of stock";ammoCell.appendChild(empty); }
    return ammoCell;
  }

            const chargedCoreType = getWeaponChargedCoreType(rowData);
            if (chargedCoreType) {
              const coreName = chargedCoreType === "fusion" ? "Fusion Core" : "Plasma Core";
              const loaded = findLoadedCoreUnit(rowData.loadedCore);
              const ammoState = getLoadedCoreAmmoState(rowData);
              const coreWrap = document.createElement("div");
              coreWrap.className = "vk-combat-core-controls";

              if (loaded && ammoState) {
                let ammoRow;
                ammoRow = createCompactPlusMinusRow({
                  labelText: `${coreName}:`,
                  initialValue: ammoState.currentShots,
                  min: 0,
                  max: ammoState.maxShots,
                  step: 10,
                  valueTitle: chargedCoreType === "fusion"
                    ? `${loaded.displayName} — 1 fusion-core charge = 50 Gatling-laser shots; expend in 10-shot increments.`
                    : `${loaded.displayName} — expend Plasma Core ammunition in 10-shot increments.`,
                  onChange: (val) => {
                    setLoadedCoreAmmoShots(rowData, val);
                    const amount = ammoRow?.wrap?.querySelector(".vk-weapon-ammo-count");
                    if (amount) amount.classList.toggle("is-empty", Number(val) <= 0);
                  },
                });
                ammoRow.wrap.classList.add("vk-weapon-ammo-row");
                const ammoSpans = ammoRow.wrap.querySelectorAll(":scope > span");
                ammoSpans[0]?.classList.add("vk-weapon-ammo-label");
                ammoRow.valueSpan?.classList.add("vk-weapon-ammo-count");
                ammoRow.valueSpan?.classList.toggle("is-empty", Number(ammoState.currentShots) <= 0);
                if (ammoSpans[0]) ammoSpans[0].textContent = coreName;
                ammoRow.wrap.prepend(ammoRow.field);

                const shotsLabel = document.createElement("span");
                shotsLabel.textContent = "shots";
                shotsLabel.className = "vk-combat-muted";
                ammoRow.wrap.appendChild(shotsLabel);
                coreWrap.appendChild(ammoRow.wrap);
              } else {
                const status = document.createElement("span");
                if (rowData.loadedCore?.instanceId) {
                  status.textContent = `${coreName}: Missing`;
                  status.title = "The selected core is no longer in this character's inventory.";
                  status.className = "vk-combat-warning";
                } else {
                  status.textContent = `${coreName}: None`;
                  status.className = "vk-combat-muted";
                }
                coreWrap.appendChild(status);
              }

              const swap = document.createElement("button");
              swap.type = "button";
              swap.textContent = loaded ? "Swap" : "Load";
              swap.title = `Select a ${coreName}`;
              swap.className = "vk-combat-button";
              
              swap.onclick = async e => {
                e.stopPropagation();
                const selection = await showWeaponCorePicker(rowData, { actionLabel: "Keep Weapon", allowNone: true });
                if (selection.cancelled) return;
                mutatePreparedWeapon(rowData.instanceId, live => { live.loadedCore = selection.loadedCore; });
              };

              coreWrap.appendChild(swap);
              ammoCell.appendChild(coreWrap);
            } else if (ammoInfo.mode === "none") {
              ammoCell.textContent = "No tracked ammunition.";
			} else if (ammoInfo.mode === "infinite") {
			  const inf = document.createElement("span");
			  inf.textContent = "Anything";
			  inf.classList.add("vk-weapon-ammo-anything");
			  inf.style.fontWeight = "normal";
			  ammoCell.appendChild(inf);
			} else {
			  // One line per ammo option
			  const list = document.createElement("div");
			  list.style.display = "flex";
			  list.style.flexDirection = "column";
			  list.style.gap = "4px";
			
			  ammoInfo.options.forEach((opt) => {
			    const stacks = findStacksForAmmoLabel({ label: opt, matchByWeaponName: ammoInfo.matchByWeaponName });
			
			    // TOTAL across all stacks (this is what enables rollover)
			     const startQty = getTotalQtyForStacks(stacks);
			
			    let row;
			    row = createCompactPlusMinusRow({
			      labelText: `${opt}:`,
			      initialValue: startQty,
			      min: 0,
			      max: 9999, // total cap shown in UI; stack caps handled inside helper
			      valueTitle: "Click to edit ammo quantity",
			      onChange: (val) => {
			        setAmmoTotalAcrossStacks({
			          label: opt,
			          matchByWeaponName: ammoInfo.matchByWeaponName,
			          newTotal: val,
			          rowMax: 9999, // per-stack cap
			        });
			        const amount = row?.wrap?.querySelector(".vk-weapon-ammo-count");
			        if (amount) amount.classList.toggle("is-empty", Number(val) <= 0);
			      },
			    });
			    row.wrap.classList.add("vk-weapon-ammo-row");
			    const ammoSpans = row.wrap.querySelectorAll(":scope > span");
			    ammoSpans[0]?.classList.add("vk-weapon-ammo-label");
			    row.valueSpan?.classList.add("vk-weapon-ammo-count");
			    row.valueSpan?.classList.toggle("is-empty", Number(startQty) <= 0);
            if (ammoSpans[0]) ammoSpans[0].textContent = opt;
            row.wrap.prepend(row.field);
			
			    row.wrap.style.gap = "8px";
			    row.wrap.style.justifyContent = "space-between";
			
			    list.appendChild(row.wrap);
			  });
			  ammoCell.appendChild(list);
			}
		

  applyCombatTooltips(ammoCell);
  return ammoCell;
}
function hasCombatDisplayValue(value) {
  const text = String(value ?? "").trim().replace(/^["']|["']$/g, "");
  return text !== "" && !/^(?:none|n\/a|—|-)$/i.test(text);
}
// Per-instance weapon condition. Effective views and contribution explanations are transient.
const VK_WEAPON_CONDITION_FIELDS = {
  damage:{label:"Damage",kind:"number"}, rate:{label:"Fire rate",kind:"number"}, range:{label:"Range",kind:"range"},
  ammoPerShot:{label:"Ammo per shot",kind:"number"}, qualities:{label:"Qualities",kind:"list"}, damage_effects:{label:"Damage effects",kind:"list"},
  dmgtype:{label:"Damage type",kind:"text"}, ammo:{label:"Ammunition type",kind:"text"}, type:{label:"Weapon skill",kind:"text"},
  weight:{label:"Weight",kind:"number"},cost:{label:"Cost",kind:"number"},effects_note:{label:"Special note",kind:"text"}
};
let weaponConditionEditorState = null;
function vkWeaponCondition(item) {
  const data=item?.weaponCondition;
  const status=["damaged","broken"].includes(data?.status) ? data.status : "normal";
  return {status,faults:status!=="damaged" ? [] : (Array.isArray(data?.faults) ? data.faults : []).filter(f=>VK_WEAPON_CONDITION_FIELDS[f.stat]).map(f=>({...f}))};
}
function vkConditionEntryName(value) {
  return String(value||"").replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,(_,target,alias)=>alias||target.split('/').pop()).replace(/[*_`]/g,"").trim().toLowerCase();
}
function vkWeaponConditionView(item, condition=vkWeaponCondition(item)) {
  const view=structuredClone(item),contributions={};
  delete view.effects_note; // Only a current damage fault may supply this field.
  view.ammoPerShot=1;
  for(const fault of condition.status!=="damaged" ? [] : condition.faults) {
    const definition=VK_WEAPON_CONDITION_FIELDS[fault.stat];if(!definition)continue;
    const key=fault.stat,before=view[key] ?? (key==="rate" ? view.fire_rate : ""),raw=String(fault.value??""),amount=Number(raw);
    if(definition.kind==="list") {
      let entries=String(before||"").split(/,(?![^\[]*\]\])/).map(x=>x.trim()).filter(Boolean);
      if(fault.operation==="remove") entries=entries.filter(entry=>vkConditionEntryName(entry)!==vkConditionEntryName(raw));
      else if(fault.operation==="add" && raw.trim() && !entries.some(entry=>vkConditionEntryName(entry)===vkConditionEntryName(raw)))entries.push(raw.trim());
      else if(fault.operation==="set")entries=raw.trim()?[raw]:[];
      view[key]=entries.join(", ");
    } else if(definition.kind==="text")view[key]=raw;
    else if(definition.kind==="range") {
      const bands=["C","M","L","E"],aliases={close:"C",medium:"M",long:"L",extreme:"E"};
      const token=String(before||"").trim().toUpperCase(),index=bands.indexOf(aliases[token.toLowerCase()]||token);
      view[key]=fault.operation==="set" ? (aliases[raw.toLowerCase()]||raw.toUpperCase()) : index<0 ? before : bands[Math.min(3,Math.max(0,index+(fault.operation==="subtract"?-amount:amount)))];
    } else if(Number.isFinite(amount)) {
      const number=Number(String(before).match(/-?\d+(?:\.\d+)?/)?.[0]||0);
      const next=Math.max(key==="ammoPerShot"?1:0,fault.operation==="set"?amount:number+(fault.operation==="subtract"?-amount:amount));
      view[key]=key==="damage"?`${next} D6`:key==="ammoPerShot"?next:String(next);
    }
    const after=view[key];
    if(String(before)!==String(after)) (contributions[key]??=[]).push({source:"Weapon damage",reason:String(fault.reason||"Weapon fault"),before:String(before||"None"),after:String(after||"None")});
  }
  if(condition.status!=="normal" && view.ammoPerShot!==1)view.ammoPerShot=Math.max(1,Math.trunc(view.ammoPerShot));
  Object.defineProperty(view,"_vkCondition",{value:{...condition,contributions},enumerable:false});
  return view;
}
function vkMarkWeaponStat(element, view, stat, additional=[]) {
  // A single contribution list can accept other effect sources without replacing damage explanations.
  const contributions=[...(view._vkCondition?.contributions[stat]||[]),...additional];
  if(!contributions.length)return;
  element.dataset.effectModified="true";element.classList.add("vk-weapon-stat-affected");
  const text=contributions.map(c=>`${c.source} — ${c.reason}\n${VK_WEAPON_CONDITION_FIELDS[stat]?.label||stat}: ${c.before} → ${c.after}`).join("\n\n");
  obsidian.setTooltip?.(element,[element.dataset.vkExistingExplanation,text].filter(Boolean).join("\n\n"));
}
function vkValidateWeaponCondition(condition) {
  if(condition.status!=="damaged")return "";
  for(const fault of condition.faults) {
    const field=VK_WEAPON_CONDITION_FIELDS[fault.stat];if(!field)return "Choose an affected stat.";
    const numeric=field.kind==="number" || field.kind==="range"&&fault.operation!=="set";
    if(numeric && (String(fault.value).trim()==="" || !Number.isFinite(Number(fault.value))))return "Enter a numeric value for each adjustment.";
    if((fault.stat==="ammoPerShot" || field.kind==="range")&&numeric&&!Number.isInteger(Number(fault.value)))return "Ammo per shot and range adjustments must use whole numbers.";
    if(field.kind==="range"&&fault.operation==="set"&&!/^(C|M|L|E)$/i.test(String(fault.value)))return "Set range to C, M, L or E.";
    if(fault.stat==="ammoPerShot"&&fault.operation==="set"&&Number(fault.value)<1)return "Ammo per shot must be at least 1.";
  }
  return "";
}
function vkWeaponConditionHint(status) {
  return status==="broken" ? "This weapon is unusable until repaired." : status==="normal" ? "This weapon has no damage faults." : "Changes apply to this weapon only.";
}
function vkConditionDraftFor(item) {
  return weaponConditionEditorState?.id===String(item.instanceId) ? weaponConditionEditorState.draft : vkWeaponCondition(item);
}
function vkStartWeaponCondition(instanceId) {
  const item=getPreparedWeapons().find(w=>String(w.instanceId)===String(instanceId));if(!item)return;
  if(weaponConditionEditorState?.id===String(instanceId)){weaponConditionEditorState=null;updateWeaponTableDOM();return;}
  const draft=vkWeaponCondition(item);
  if(draft.status==="damaged" && !draft.faults.length)draft.faults.push({reason:"",stat:"damage",operation:"subtract",value:"1"});
  weaponConditionEditorState={id:String(instanceId),before:JSON.stringify(item),draft};updateWeaponTableDOM();
}
function vkRefreshWeaponConditionPreview() {
  const card=equippedWeaponContainer.querySelector('.vk-equipped-weapon-card');if(!card)return;
  weaponViewOwner?.unload();weaponViewOwner=new obsidian.Component();weaponViewOwner.load();weaponViewVersion++;
  card.replaceWith(renderEquippedWeaponCard());
  const panel=equippedWeaponContainer.querySelector('.vk-weapon-condition-editor');
  if(panel){const error=vkValidateWeaponCondition(weaponConditionEditorState.draft);panel.querySelector('[data-condition-save]').disabled=!!error;panel.querySelector('[role="status"]').textContent=error||vkWeaponConditionHint(weaponConditionEditorState.draft.status);}
}
function renderWeaponConditionEditor() {
  const state=weaponConditionEditorState,panel=document.createElement('section');panel.className='vk-weapon-condition-editor';panel.setAttribute('aria-label','Weapon condition editor');
  const node=(tag,className,text)=>{const el=document.createElement(tag);el.className=className;if(text!==undefined)el.textContent=text;return el;};
  const field=(label,input)=>{const wrap=node('label','vk-condition-field',label);wrap.append(input);return wrap;};
  const select=(options,value,label)=>{const el=node('select','');el.setAttribute('aria-label',label);for(const [value,text]of options){const opt=node('option','',text);opt.value=value;el.append(opt);}el.value=value;return el;};
  const rerender=()=>{const label=document.activeElement?.getAttribute('aria-label'),next=renderWeaponConditionEditor();panel.replaceWith(next);const control=[...next.querySelectorAll('[aria-label]')].find(el=>el.getAttribute('aria-label')===label);(control||next.querySelector('select')).focus();vkRefreshWeaponConditionPreview();};
  const header=node('div','vk-condition-header');header.append(node('h3','','Weapon condition'),node('span','vk-condition-muted','Preview'));panel.append(header);
  const body=node('div','vk-condition-body'),condition=select([['normal','Normal'],['damaged','Damaged'],['broken','Broken']],state.draft.status,'Weapon condition');condition.onchange=()=>{state.draft.status=condition.value;if(condition.value==='damaged' && !state.draft.faults.length)state.draft.faults.push({reason:'',stat:'damage',operation:'subtract',value:'1'});rerender();};body.append(field('Condition',condition));
  (state.draft.status==="damaged" ? state.draft.faults : []).forEach((fault,index)=>{
    const box=node('div','vk-condition-fault'),top=node('div','vk-condition-fault-header'),remove=node('button','','');remove.title=`Remove fault ${index+1}`;styleEquipmentActionIcon(remove,'remove');remove.onclick=()=>{state.draft.faults.splice(index,1);rerender();};top.append(node('span','',`Fault ${index+1}`),remove);box.append(top);
    const reason=node('input','');reason.value=fault.reason||'';reason.setAttribute('aria-label',`Fault ${index+1} description`);reason.oninput=()=>{fault.reason=reason.value;vkRefreshWeaponConditionPreview();};box.append(field('What happened?',reason));
    const stat=select(Object.entries(VK_WEAPON_CONDITION_FIELDS).map(([key,value])=>[key,value.label]),fault.stat,`Fault ${index+1} stat`);
    stat.onchange=()=>{fault.stat=stat.value;const kind=VK_WEAPON_CONDITION_FIELDS[fault.stat].kind;fault.operation=kind==='text'?'set':kind==='list'?'remove':fault.stat==='ammoPerShot'?'set':'subtract';fault.value=kind==='text'?'':kind==='list'?'':fault.stat==='ammoPerShot'?'2':'1';rerender();};box.append(field('Affected stat',stat));
    const kind=VK_WEAPON_CONDITION_FIELDS[fault.stat].kind,operations=kind==='text'?[['set','Set to']]:kind==='list'?[['remove','Remove'],['add','Add'],['set','Replace with']]:[['subtract','Reduce by'],['add','Increase by'],['set','Set to']];
    const change=node('div','vk-condition-change'),operation=select(operations,fault.operation,`Fault ${index+1} adjustment`),value=node('input','');value.type=kind==='number'||kind==='range'&&fault.operation!=='set'?'number':'text';value.value=fault.value??'';value.setAttribute('aria-label',`Fault ${index+1} value`);value.oninput=()=>{fault.value=value.value;vkRefreshWeaponConditionPreview();};operation.onchange=()=>{fault.operation=operation.value;if(kind==='range'&&fault.operation==='set')fault.value='M';rerender();};
    change.append(field('Change',operation),field(kind==='list'?'Entry':'Value',value));box.append(change);
    if(state.draft.status==='normal')box.querySelectorAll('input,select,button').forEach(el=>el.disabled=true);body.append(box);
  });
  const add=node('button','vk-condition-add','Add fault');add.type='button';add.hidden=state.draft.status!=='damaged';add.onclick=()=>{state.draft.faults.push({reason:'',stat:'damage',operation:'subtract',value:'1'});rerender();};body.append(add);
  const status=node('div','vk-condition-muted');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.textContent=vkValidateWeaponCondition(state.draft)||vkWeaponConditionHint(state.draft.status);body.append(status);panel.append(body);
  const footer=node('div','vk-condition-footer'),cancel=node('button','','Cancel'),save=node('button','vk-condition-save','Save');cancel.type=save.type='button';save.dataset.conditionSave='true';save.disabled=!!vkValidateWeaponCondition(state.draft);
  cancel.onclick=()=>{weaponConditionEditorState=null;updateWeaponTableDOM();};
  save.onclick=()=>{
    const rows=getPreparedWeapons(),item=rows.find(w=>String(w.instanceId)===state.id);
    if(!item || JSON.stringify(item)!==state.before){status.textContent='Weapon changed. Cancel and reopen Condition.';save.disabled=true;return;}
    if(vkValidateWeaponCondition(state.draft))return;
    if(state.draft.status==='normal')delete item.weaponCondition;else item.weaponCondition=vkWeaponCondition({weaponCondition:state.draft});
    const writes=[];
    if(item.consumableRef){
      const gear=getGearRows(),stack=getConsumableStacks(item,gear).find(stack=>stack.qty>0);
      if(!stack){status.textContent="This weapon is no longer in Inventory.";save.disabled=true;return;}
      const original=gear[stack.gearIndex],owned=structuredClone(original);
      if(stack.qty>1){original.qty=String(stack.qty-1);owned.qty="1";owned.instanceId=makeInventoryInstanceId();gear.splice(stack.gearIndex+1,0,owned);}
      else owned.instanceId=owned.instanceId||makeInventoryInstanceId();
      if(stack.qty===1)gear[stack.gearIndex]=owned;
      if(state.draft.status==="normal")delete owned.weaponCondition;else owned.weaponCondition=vkWeaponCondition({weaponCondition:state.draft});
      item.consumableInventoryId=owned.instanceId;writes.push(["fallout_gear_table",gear]);
    }
    writes.unshift(["fallout_weapon_table",rows]);
    if(!vkCommitApparelWrites(writes)){status.textContent='Condition could not be saved. Try again.';return;}
    weaponConditionEditorState=null;updateWeaponTableDOM();
  };
  footer.append(cancel,save);panel.append(footer);panel.addEventListener("keydown",event=>{if(event.key==="Escape"){event.preventDefault();event.stopPropagation();cancel.click();}});queueMicrotask(()=>{if(panel.isConnected&&!panel.contains(document.activeElement))condition.focus();});return panel;
}
function renderEquippedWeaponArea() {
  const area=document.createElement('div');area.className='vk-equipped-weapon-area';
  if(weaponConditionEditorState?.id!==getEquippedWeaponId())weaponConditionEditorState=null;
  area.append(renderEquippedWeaponCard());
  if(weaponConditionEditorState){area.classList.add('has-condition-editor');area.append(renderWeaponConditionEditor());}
  return area;
}
async function loadWeaponRepairSource(item) {
  const file=vkApparelSourceFile(item);if(!file)throw new Error('Weapon source file could not be found.');
  const {data}=vkParseApparelSource(await app.vault.read(file));
  return {...structuredClone(item),sourcePath:file.path,yamlName:String(data.name||file.basename),rarity:data.rarity??null};
}
function openWeaponRepair(instanceId) {
  return openApparelRepair('',false,String(instanceId));
}

function renderEquippedWeaponCard() {
  const card = document.createElement("article");
  card.className = "vk-equipped-weapon-card vk-equipment-card";
  weaponViewLinks(card);
  const storedWeapon = getEquippedWeapon();
  const weapon = storedWeapon ? vkWeaponConditionView(storedWeapon,vkConditionDraftFor(storedWeapon)) : null;
  if (!weapon) {
    card.classList.add("is-empty");
    const title = document.createElement("strong"); title.textContent = "No weapon equipped";
    const hint = document.createElement("p"); hint.className = "vk-combat-muted";
    hint.textContent = "Equip a weapon from Prepared Weapons below. Prepared weapons stay ready until you return them to inventory.";
    card.append(title,hint); return card;
  }
  card.dataset.weaponInstance = String(weapon.instanceId);
  const header = document.createElement("div"); header.className = "vk-combat-header";
  const heading = document.createElement("div"); heading.className = "vk-combat-heading";
  const name = document.createElement("div"); name.className = "vk-combat-title";
  weaponViewName(name,weapon);
  const type = document.createElement("div"); type.className = "vk-combat-damage-type";
  const typeLabel = document.createElement("span"); typeLabel.className = "vk-combat-muted"; typeLabel.textContent = "Damage type";
  const typeValue = document.createElement("div"); typeValue.className = "vk-combat-weapon-type";
  weaponViewMarkdown(typeValue, weapon.dmgtype || "—", weapon.sourcePath || "");
  vkMarkWeaponStat(typeValue,weapon,"dmgtype");
  type.append(typeLabel,typeValue);
  const equippedLabel = document.createElement("span"); equippedLabel.className = "vk-weapon-subheading"; equippedLabel.textContent = "Equipped";
  heading.append(equippedLabel,name);
  const actions = document.createElement("div"); actions.className = "vk-combat-actions";
  actions.append(weaponIcon("", () => modifyPreparedWeapon(weapon.instanceId), `Modify ${vkWeaponDisplayName(weapon)}`, "modify"),
    weaponIcon("", () => setEquippedWeaponId(""), "Unequip active weapon (keep prepared)", "unequip"));
  const conditionButton=weaponIcon("",()=>vkStartWeaponCondition(weapon.instanceId),"Weapon condition","condition");
  conditionButton.setAttribute("aria-expanded",String(!!weaponConditionEditorState));
  if(weapon._vkCondition.status!=="normal")conditionButton.setAttribute("aria-pressed","true");
  const repairButton=weaponIcon("",()=>openWeaponRepair(weapon.instanceId).catch(error=>{console.error(error);showSheetNotice(error.message);}),"Repair weapon","repair");
  repairButton.disabled=!!weaponConditionEditorState || weapon._vkCondition.status==="normal";
  actions.prepend(conditionButton,repairButton);
  if(weapon._vkCondition.status!=="normal"){
    const badge=document.createElement("span");badge.className="vk-weapon-condition-badge";badge.textContent=weapon._vkCondition.status==="broken"?"Broken · cannot use":"Damaged";heading.append(badge);
  }
  header.append(heading,actions); card.appendChild(header);
  const body = document.createElement("div"); body.className = "vk-combat-body";
  const combat = document.createElement("section"); combat.className = "vk-combat-stat-panel";
  combat.setAttribute("aria-label", "Combat statistics and ammunition");
  const support = document.createElement("section"); support.className = "vk-combat-support";
  support.setAttribute("aria-label", "Damage type, damage effects and qualities");
  const metrics = document.createElement("div"); metrics.className = "vk-combat-metrics";
  let calculated = {};
  if (typeof calculateWeaponStats === "function" && weapon.type) calculated = calculateWeaponStats(weapon.type);
  const tn = calculated.TN ?? "N/A";
  const melee = /melee|unarmed/i.test(String(weapon.type || "")) || /\/(?:melee|unarmed)\//i.test(String(weapon.sourcePath || ""));
  const rate = weapon.rate ?? weapon.fire_rate;
  const shownMetrics = [["Damage",weapon.damage],["TN",tn]];
  if (!(melee && (!hasCombatDisplayValue(rate) || Number(rate) === 0))) shownMetrics.push(["Rate",rate]);
  if (hasCombatDisplayValue(weapon.range)) shownMetrics.push(["Range",weapon.range]);
  shownMetrics.forEach(([label,value]) => {
    const box = document.createElement("div"); box.className = "vk-combat-metric";
    box.dataset.metric = label.toLowerCase();
    box.classList.add(label === "Damage" || label === "TN" ? "is-primary" : "is-secondary");
    const caption = document.createElement("span"); caption.className = "vk-combat-metric-label"; caption.textContent = label;
    const content = document.createElement("div"); content.className = "vk-combat-metric-value";
    if (label !== "TN") weaponViewMarkdown(content,value ?? "—",weapon.sourcePath || "");
    else {
      const number = document.createElement("span");
      number.className = "vk-status-value";
      number.textContent = String(value ?? "—");
      content.appendChild(number);
      if (calculated.tnModified) {
        content.dataset.effectModified = "true";
        const targets = [calculated.skill, calculated.special].filter(Boolean);
        const explanations = targets.map(target => `${target}:\n${buildActiveEffectTooltip(target, getBaseNumericCharacterValue(target), getEffectivePrimaryValue(target))}`);
        const tooltip = [`TN — Base: ${calculated.baseTN}; Effective: ${tn}`, ...explanations].join("\n\n");
        content.dataset.vkExistingExplanation=tooltip;
        if (typeof obsidian.setTooltip === "function") obsidian.setTooltip(content, tooltip);
      }
      const skill = document.createElement("span"); skill.className = "vk-combat-skill-name";
      skill.textContent = String(calculated.skill || weapon.type || "");
      vkMarkWeaponStat(skill,weapon,"type");
      box.appendChild(skill);
      if (calculated.Tag ?? weapon.Tag) {
      box.appendChild(createSkillTagBadge());
      const rank = document.createElement("span"); rank.className = "vk-status-value vk-combat-skill-rank";
      rank.textContent = String(calculated.skillRank ?? "—");
      rank.setAttribute("aria-label", `${calculated.skill || weapon.type || "Skill"} rank: ${calculated.skillRank ?? "unavailable"}`);
      const rankHost = document.createElement("span");
      if (calculated.skillRank !== undefined && Number(calculated.skillRank) !== Number(calculated.baseSkillRank)) {
        rankHost.dataset.effectModified = "true";
        if (typeof obsidian.setTooltip === "function") obsidian.setTooltip(rankHost, buildActiveEffectTooltip(calculated.skill, calculated.baseSkillRank, calculated.skillRank));
      }
      rankHost.appendChild(rank);box.appendChild(rankHost);
      }
    }
    if(label!=="TN")vkMarkWeaponStat(content,weapon,label==="Damage"?"damage":label.toLowerCase());
    else vkMarkWeaponStat(content,weapon,"type");
    box.prepend(caption,content);
    if (label === "TN") {
      box.classList.add("vk-combat-skill-tn");
      box.classList.remove("is-primary");
      heading.appendChild(box);
    } else metrics.appendChild(box);
  });
  combat.appendChild(metrics); support.appendChild(type);
  if (getWeaponChargedCoreType(weapon) || getCombatAmmoInfo(weapon).mode !== "none") {
  const ammunition = document.createElement("section"); ammunition.className = "vk-combat-ammunition";
  const ammoTitle = document.createElement("h4"); ammoTitle.textContent = isConsumableWeapon(weapon) ? "Remaining" : "Ammunition";
  ammunition.append(ammoTitle,renderEquippedWeaponAmmo(weapon));
  if(weapon._vkCondition.contributions.ammoPerShot){const perShot=document.createElement("div");perShot.className="vk-weapon-ammo-per-shot";perShot.textContent=`${weapon.ammoPerShot} ammo per shot`;vkMarkWeaponStat(perShot,weapon,"ammoPerShot");ammunition.append(perShot);}
  vkMarkWeaponStat(ammoTitle,weapon,"ammo");combat.appendChild(ammunition);
  }
  const traits = document.createElement("div"); traits.className = "vk-combat-traits";
  [["Damage effects",weapon.damage_effects],["Qualities",weapon.qualities]].filter(([label,value]) => hasCombatDisplayValue(value) || weapon._vkCondition.contributions[label==="Qualities"?"qualities":"damage_effects"]).forEach(([label,value]) => {
    const row=document.createElement("div");const caption=document.createElement("span");caption.className="vk-combat-muted";caption.textContent=label;
    const text=document.createElement("div");weaponViewMarkdown(text,String(value || "None"),weapon.sourcePath || "");vkMarkWeaponStat(text,weapon,label==="Qualities"?"qualities":"damage_effects");row.append(caption,text);traits.appendChild(row);
  });
  if (traits.childElementCount) support.appendChild(traits);
  for(const key of ["weight","cost"])if(weapon._vkCondition.contributions[key]){
    const line=document.createElement("div");line.className="vk-weapon-condition-meta";line.textContent=`${VK_WEAPON_CONDITION_FIELDS[key].label}: ${weapon[key]}`;vkMarkWeaponStat(line,weapon,key);support.append(line);
  }
  body.append(combat,support); card.appendChild(body);
  const effects = [weapon.effects_note].map(value => String(value || "").trim()).filter(hasCombatDisplayValue).filter((value,index,array)=>array.indexOf(value)===index).join("\n\n");
  const effectDetails=document.createElement("details"),effectSummary=document.createElement("summary");effectSummary.textContent="Special";vkDisclosureIcon(effectSummary);
  effectDetails.className="vk-combat-special";
  effectDetails.classList.toggle("has-special",hasCombatDisplayValue(effects));
  const effectBody=document.createElement("div");weaponViewMarkdown(effectBody,effects || "None",weapon.sourcePath || "");effectDetails.append(effectSummary,effectBody);vkMarkWeaponStat(effectSummary,weapon,"effects_note");
  const specialVersion = weaponViewVersion;
  loadWeaponSpecialSources(weapon,{includeAmmo:true}).then(sources => {
    if (specialVersion !== weaponViewVersion || !effectBody.isConnected) return;
    effectBody.replaceChildren();
    const faultNote = String(weapon.effects_note || "").trim();
    effectDetails.classList.toggle("has-special",sources.length > 0 || hasCombatDisplayValue(faultNote));
    sources.forEach(source => {
      const region=document.createElement("div");
      const label=document.createElement("strong");label.textContent=source.label;
      const text=document.createElement("div");weaponViewMarkdown(text,source.text,source.id);
      region.append(label,text);effectBody.append(region);
    });
    if(hasCombatDisplayValue(faultNote)){
      const text=document.createElement("div");weaponViewMarkdown(text,faultNote,weapon.sourcePath || "");effectBody.append(text);
    }
    if(!effectBody.childElementCount)weaponViewMarkdown(effectBody,"None",weapon.sourcePath || "");
  }).catch(err => console.warn("Vault-Kit: could not render weapon Special", err));
  const modDetails=document.createElement("details"),modSummary=document.createElement("summary");modSummary.textContent="Installed Modifications";modDetails.appendChild(modSummary);
  const addons=Array.isArray(weapon.addons)?weapon.addons:[];
  modSummary.textContent = `Installed Modifications · ${addons.length}`;vkDisclosureIcon(modSummary);
  if (!addons.length) { const empty=document.createElement("p");empty.className="vk-combat-muted";empty.textContent="None";modDetails.appendChild(empty); }
  addons.forEach(mod=>{
    const line=document.createElement("div");line.className="vk-combat-mod";
    const target=String(mod.id || "").endsWith(".md")?String(mod.id).replace(/\.md$/i,""):noteTargetFromSource({rawLink:mod.link,fallbackName:mod.basename || mod.name || "Modification"});
    const label=String(mod.displayName || sourceDisplayName({rawLink:mod.link,sourcePath:mod.id || "",fallbackName:mod.basename || mod.name || "Modification"}));
    const markdown=label.includes("[[")?label:`[[${target}|${label.replace(/\|/g,"\\|").replace(/\]/g,"\\]")}]]`;
    weaponViewMarkdown(line,markdown,String(mod.id || weapon.sourcePath || ""));modDetails.appendChild(line);
  });
  effectDetails.dataset.weaponDetail="effects";modDetails.dataset.weaponDetail="mods";
  const expanded=weaponCardExpansion.get(String(weapon.instanceId));
  effectDetails.open=expanded?.has("effects") || false;modDetails.open=expanded?.has("mods") || false;
  const details=document.createElement("div");details.className="vk-combat-details";details.append(effectDetails,modDetails);card.appendChild(details);
  return card;
}
function renderWeaponTableSection() {
  const wrapper=document.createElement("div");wrapper.className="vk-prepared-weapons vk-equipment-card";weaponViewLinks(wrapper);
  const rows=getPreparedWeapons().filter(w => String(w.instanceId) !== getEquippedWeaponId());
  const label=document.createElement("div");label.className="vk-weapon-subheading";label.textContent="Prepared";wrapper.appendChild(label);
  if (!rows.length) { const empty=document.createElement("p");empty.className="vk-combat-muted";empty.textContent=getEquippedWeaponId()?"No other weapons prepared.":"No prepared weapons. Prepare a weapon from Inventory to add it here.";wrapper.appendChild(empty);return wrapper; }
  const scroll=document.createElement("div");scroll.className="vk-prepared-scroll";
  const table=document.createElement("table");table.className="vk-table vk-data-table vk-prepared-weapon-table";
  const thead=document.createElement("thead"),header=document.createElement("tr");
  weaponColumns.forEach(col=>{
    const th=document.createElement("th");th.scope="col";
    if(col.key==="actions") th.textContent=col.label;
    else {
      if(preparedWeaponSort.key===col.key)th.setAttribute("aria-sort",preparedWeaponSort.ascending?"ascending":"descending");
      const sort=combatButton(col.label,()=>{preparedWeaponSort.ascending=preparedWeaponSort.key===col.key?!preparedWeaponSort.ascending:true;preparedWeaponSort.key=col.key;updateWeaponTableDOM();},`Sort prepared weapons by ${col.label}`);
      sort.classList.add("vk-prepared-sort");
      if (preparedWeaponSort.key === col.key) sort.append(document.createTextNode(preparedWeaponSort.ascending ? " ↑" : " ↓"));
      th.appendChild(sort);
    }
    header.appendChild(th);
  });
  thead.appendChild(header);table.appendChild(thead);
  const tbody=document.createElement("tbody"),equippedId=getEquippedWeaponId();
  const sortValue=weapon=>preparedWeaponSort.key==="weapon"?vkWeaponDisplayName(weapon):preparedWeaponSort.key==="ammo"?getPreparedAmmoSummary(weapon).map(line=>String(line.value)).join(" "):String(weapon[preparedWeaponSort.key] ?? "");
  if(preparedWeaponSort.key)rows.sort((a,b)=>String(sortValue(a)).localeCompare(String(sortValue(b)),undefined,{numeric:true,sensitivity:"base"})*(preparedWeaponSort.ascending?1:-1));
  rows.forEach(storedWeapon=>{
    const weapon=vkWeaponConditionView(storedWeapon);
    const row=document.createElement("tr"),active=String(weapon.instanceId)===equippedId;
    row.dataset.instanceId=weapon.instanceId;row.classList.toggle("is-equipped",active);
    const name=document.createElement("td");
    if(!active)weaponViewName(name,weapon);
    if(active){const badge=document.createElement("span");badge.className="vk-prepared-equipped-badge";badge.textContent="Equipped";const holder=document.createElement("div");holder.className="vk-prepared-name";name.replaceChildren(holder,badge);weaponViewMarkdown(holder,weaponSourceMarkdown(weapon),weapon.sourcePath || "");}
    if(weapon._vkCondition.status!=="normal"){const badge=document.createElement("span");badge.className="vk-weapon-condition-badge";badge.textContent=weapon._vkCondition.status==="broken"?"Broken":"Damaged";name.append(badge);}
    row.append(name,renderPreparedAmmo(weapon));
    ["damage","rate","range"].forEach(key=>{const td=document.createElement("td");td.textContent=String(weapon[key] ?? (key==="rate"?weapon.fire_rate:"—"));vkMarkWeaponStat(td,weapon,key);row.appendChild(td);});
    const actionCell=document.createElement("td"),actions=document.createElement("div");actions.className="vk-prepared-actions";
    const equip=combatButton(active?"Unequip":"Equip",()=>{setEquippedWeaponId(active?"":weapon.instanceId);showSheetNotice(`${active?"Unequipped":"Equipped"} ${vkWeaponDisplayName(weapon)}${active?" (still prepared)":" as active weapon"}.`);},`${active?"Unequip":"Equip"} ${vkWeaponDisplayName(weapon)}`);
    equip.setAttribute("aria-pressed",String(active));
    styleEquipmentActionIcon(equip,active ? "unequip" : "equip");
    const modify=weaponIcon("",()=>modifyPreparedWeapon(weapon.instanceId),`Modify ${vkWeaponDisplayName(weapon)}`,"modify");
    const unprepare=weaponIcon("⇧",()=>unprepareWeapon(weapon.instanceId),`Unprepare ${vkWeaponDisplayName(weapon)} to Inventory`,"unprepare");
    const remove=weaponIcon("🗑️",()=>{const current=getPreparedWeapons();const live=current.find(w=>String(w.instanceId)===String(weapon.instanceId));if(!live)return;clearEquippedWeaponIfRemoved(live);localStorage.setItem("fallout_weapon_table",JSON.stringify(current.filter(w=>String(w.instanceId)!==String(weapon.instanceId))));updateWeaponTableDOM();},`${weapon.consumableRef ? "Remove prepared" : "Delete"} ${vkWeaponDisplayName(weapon)}`,"remove");
    [equip,modify,unprepare,remove].forEach(button=>{button.disabled=pendingWeaponTransfers.has(String(weapon.instanceId));});
    actions.append(equip,modify,unprepare,remove);actionCell.appendChild(actions);row.appendChild(actionCell);tbody.appendChild(row);
  });
  table.appendChild(tbody);scroll.appendChild(table);wrapper.appendChild(scroll);return wrapper;
}


//--------------------------------------------------------------------------------------------

// --- AMMO SECTION (DRY TABLE VERSION) ---

const AMMO_STORAGE_KEY = getStorageKey("fallout_ammo_table"); // use your helper if multi-char
const AMMO_SEARCH_FOLDERS = ["Fallout-RPG/Items/Ammo"];
const AMMO_DESCRIPTION_LIMIT = 100;

let cachedAmmoData = null;
async function fetchAmmoData() {
    if (cachedAmmoData) return cachedAmmoData;
    let allFiles = await app.vault.getFiles();
    let ammoFiles = allFiles.filter(file => AMMO_SEARCH_FOLDERS.some(folder => file.path.startsWith(folder)));
    let ammoItems = await Promise.all(ammoFiles.map(async (file) => {
        let content = await app.vault.read(file);
        let stats = {
            name: `[[${file.basename}]]`,
            qty: "1",
            description: "No description available",
            cost: "0"
        };
        let statblockMatch = content.match(/```statblock([\s\S]*?)```/);
        if (!statblockMatch) return stats;
        let statblockContent = statblockMatch[1].trim();
        //let descMatch = statblockContent.match(/(?:description:|desc:)\s*(.+)/i);
        //if (descMatch) {
            //stats.description = descMatch[1].trim().replace(/\"/g, '');
            //if (stats.description.length > AMMO_DESCRIPTION_LIMIT)
                //stats.description = stats.description.substring(0, AMMO_DESCRIPTION_LIMIT) + "...";
        //}
        let costMatch = statblockContent.match(/cost:\s*(.+)/i);
        if (costMatch) {
		  stats.cost = costMatch[1].trim().replace(/"/g, "");
		}
        return stats;
    }));
    cachedAmmoData = ammoItems.filter(g => g);
    return cachedAmmoData;
}

// ---- Table columns for ammo ----
const ammoColumns = [
    { label: "Name", key: "name", type: "link" },
    { label: "Qty", key: "qty", type: "number" },
    { label: "Cost", key: "cost", type: "link" },
    { label: "Remove", type: "remove" }
];

// ---- AMMO TABLE SECTION ----
function renderAmmoTableSection() {
    return createEditableTable({
        columns: ammoColumns,
        storageKey: AMMO_STORAGE_KEY,
        fetchItems: fetchAmmoData   // <--- THIS automatically gives you the DRY search bar!
    });
}
//--------------------------------------------------------------------------------------------

// ---- ARMOR SECTION (DRY CARD GRID, MOBILE-FIRST, FLEXIBLE FOR DESKTOP LAYOUT) ----

const ARMOR_STORAGE_KEY = "fallout_armor_data";
const ARMOR_FOLDERS = [
    "Fallout-RPG/Items/Apparel/Armor",
    "Fallout-RPG/Items/Apparel/Clothing",
    "Fallout-RPG/Items/Apparel/Headgear",
    "Fallout-RPG/Items/Apparel/Outfits",
    "Fallout-RPG/Items/Apparel/Robot Armor",
];


const ARMOR_MOD_FOLDERS = [
  "Fallout-RPG/Items/Mods/Apparel Mods",
  "Fallout-RPG/Items/Mods/Armor Mods",
  "Fallout-RPG/Items/Mods/Robot Mods",
];

const POWER_ARMOR_MOD_FOLDERS = [
	"Fallout-RPG/Items/Mods/Power Armor Mods",
]

const LEGENDARY_ARMOR_PROP_FOLDER =
  "Fallout-RPG/Items/Mods/Legendary Mods/Apparel";
  
  
const ARMOR_SECTIONS = ["Head", "Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Outfit"];
const POISON_DR_KEY = "fallout_poison_dr";

// Mapping to match “locations” fields from YAML to display slots
function matchesSection(locations, section) {
    const mapping = {
        "Arms": ["Left Arm", "Right Arm"], "Arm": ["Left Arm", "Right Arm"],
        "Legs": ["Left Leg", "Right Leg"], "Leg": ["Left Leg", "Right Leg"],
        "Torso": ["Torso"], "Main Body": ["Torso"],
        "Head": ["Head"], "Optics": ["Head"],
        "Thruster": ARMOR_SECTIONS, "All": ARMOR_SECTIONS,
        "Arms, Legs, Torso": ["Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Outfit"],
        "Head, Arms, Legs, Torso": ARMOR_SECTIONS
    };
    if (typeof locations !== "string") return false;
    if (mapping.hasOwnProperty(locations.trim()))
        return mapping[locations.trim()].includes(section);
    return false;
}

// Async fetch & parse all armor items, filter for a given slot/section
let cachedArmorData = {};
async function fetchArmorData(section) {
    if (cachedArmorData[section]) return cachedArmorData[section];
    let allFiles = await app.vault.getFiles();
    let armorFiles = allFiles.filter(file =>
        ARMOR_FOLDERS.some(folder => file.path.startsWith(folder) || file.path === folder)
    );
    let armors = await Promise.all(armorFiles.map(async (file) => {
        let content = await app.vault.read(file);
		let stats = { link: file.basename, sourcePath: file.path, physdr: "0", raddr: "0", endr: "0", hp: "0", locations: "Unknown", value: "0", weight: "0" };
        let statblockMatch = content.match(/```statblock([\s\S]*?)```/);
        if (!statblockMatch) return stats;
        let statblockContent = statblockMatch[1].trim();
        // Parse base Value from cost:
		const costMatch = statblockContent.match(/cost:\s*([^\n\r]+)/i);
		if (costMatch) stats.value = costMatch[1].trim().replace(/"/g, "");
		const weightMatch = statblockContent.match(/weight:\s*([^\n\r]+)/i);
		if (weightMatch) stats.weight = weightMatch[1].trim().replace(/"/g, "");
        function extract(pattern) {
            let m = statblockContent.match(pattern);
            return m ? m[1].trim() : "0";
        }
        stats.hp = extract(/hp:\s*(\d+)/i);
        stats.locations = extract(/locations:\s*"([^"]+)"/i);

        // Extract DRs
        let lines = statblockContent.split("\n"), inside = false, curr = "";
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith("dmg resistances:")) { inside = true; continue; }
            if (inside) {
                let name = line.match(/- name:\s*"?(Physical|Energy|Radiation)"?/i);
                if (name) { curr = name[1]; continue; }
                let desc = line.match(/desc:\s*"?(.*?)"?$/i);
                if (desc && curr) {
                    let val = desc[1].trim() || "0";
                    if (curr === "Physical") stats.physdr = val;
                    if (curr === "Energy") stats.endr = val;
                    if (curr === "Radiation") stats.raddr = val;
                    curr = "";
                }
            }
        }
        return stats;
    }));
    cachedArmorData[section] = armors.filter(a => matchesSection(a.locations, section));
    return cachedArmorData[section];
}

// LocalStorage helpers
function saveArmorData(section, data) {
    localStorage.setItem(`${ARMOR_STORAGE_KEY}_${section}`, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("fallout:equipment-special-updated"));
    if (typeof updateCarryWeightDisplay === "function") updateCarryWeightDisplay();
    setTimeout(() => {
      if (typeof refreshArmorEffectVisuals === "function") refreshArmorEffectVisuals();
    }, 0);
}
function loadArmorData(section) {
  let d = localStorage.getItem(`${ARMOR_STORAGE_KEY}_${section}`);
  return d ? JSON.parse(d) : {
    physdr: "", raddr: "", endr: "", hp: "", apparel: "",
    value: "", weight: "", sourcePath: "", instanceId: "", base: null, addons: []
  };
}


let cachedArmorAddonData = { normal: null, power: null };

function extractFirstInt(s) {
  if (s == null) return NaN;
  const m = String(s).match(/-?\d+/);
  return m ? parseInt(m[0], 10) : NaN;
}

function parseDelta(s) {
  // "+2" => 2, "-1" => -1, "-" or "" => 0
  if (!s || String(s).trim() === "-") return 0;
  const n = extractFirstInt(s);
  return Number.isNaN(n) ? 0 : n;
}

function parseArmorModStatblock(statblockContent) {
  // Reads:
  // dmg resistances: -> desc: "+2" etc
  // cost: "+30"
  // hp: "+1" (PA mods)
  const out = { phys: 0, en: 0, rad: 0, cost: 0, hp: 0, weight: 0 };

  // cost
  const costMatch = statblockContent.match(/^cost:\s*([^\n\r]+)/im);
  if (costMatch) out.cost = parseDelta(costMatch[1].replace(/"/g, ""));

  // hp (mods may have hp: "+1")
  const hpMatch = statblockContent.match(/^hp:\s*([^\n\r]+)/im);
  if (hpMatch) out.hp = parseDelta(hpMatch[1].replace(/"/g, ""));

  const weightMatch = statblockContent.match(/^weight:\s*([^\n\r]+)/im);
  if (weightMatch) {
    const raw = weightMatch[1].replace(/"/g, "").trim();
    const m = raw.match(/-?\d+(?:\.\d+)?/);
    out.weight = m ? Number(m[0]) : 0;
  }

  // DRs from dmg resistances
  const lines = statblockContent.split("\n");
  let inside = false;
  let curr = "";
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith("dmg resistances:")) { inside = true; continue; }
    if (!inside) continue;

    const name = line.match(/- name:\s*"?(Physical|Energy|Radiation)"?/i);
    if (name) { curr = name[1]; continue; }

    const desc = line.match(/desc:\s*"?(.*?)"?$/i);
    if (desc && curr) {
      const val = desc[1].trim().replace(/"/g, "");
      if (curr === "Physical") out.phys = parseDelta(val);
      if (curr === "Energy") out.en = parseDelta(val);
      if (curr === "Radiation") out.rad = parseDelta(val);
      curr = "";
    }
  }

  return out;
}

async function fetchArmorAddonData(isPowerArmor, refresh = false) {
  const cacheKey = isPowerArmor ? "power" : "normal";
  if (!refresh && cachedArmorAddonData[cacheKey]) return cachedArmorAddonData[cacheKey];
  const modFolders = isPowerArmor ? POWER_ARMOR_MOD_FOLDERS : ARMOR_MOD_FOLDERS;
  const files = app.vault.getFiles().filter(file => file.extension === "md" &&
    (modFolders.some(folder => file.path.startsWith(folder + "/")) || file.path.startsWith(LEGENDARY_ARMOR_PROP_FOLDER + "/")));
  const addons = await Promise.all(files.map(async file => {
    const content = await app.vault.read(file);
    if (!/```statblock/i.test(content)) return null;
    const {block,data} = vkParseApparelSource(content);
    const isLegendary = file.path.startsWith(LEGENDARY_ARMOR_PROP_FOLDER + "/");
    const displayName = String(data["mod name"] || data.mod || file.basename);
    return {id:file.path,basename:file.basename,displayName,link:`[[${file.path.replace(/\.md$/i, "")}]]`,
      type:isLegendary ? "legendary" : "mod",isLegendary,
      namePrefix:isLegendary ? String(data["name prefix"] || displayName) : "",
      deltas:parseArmorModStatblock(block),complexity:data.complexity ?? "",skill:data.skill ?? "",
      perks:data.perks ?? data.perk ?? "",rarity:data.rarity ?? "",
      gameEffects:typeof data.gameEffects === "string" ? data.gameEffects.trim() : ""};
  }));
  cachedArmorAddonData[cacheKey] = addons.filter(Boolean);
  return cachedArmorAddonData[cacheKey];
}

function ensureArmorBase(stored, isPowerArmor) {
  const hasSelectedItem = typeof stored.apparel === "string" && stored.apparel.trim() !== "";

  if (!stored.base) {
    stored.base = {
      physdr: stored.physdr ?? "",
      endr: stored.endr ?? "",
      raddr: stored.raddr ?? "",
      value: stored.value ?? "",
      weight: stored.weight ?? ""
    };

    if (isPowerArmor) {
      // Only snapshot HP as base if an item is selected
      stored.base.hp = hasSelectedItem ? (stored.hp ?? "") : "";
    }
  }

  if (!Array.isArray(stored.addons)) stored.addons = [];
}

function getLegendaryArmorUniversalBonus(addons, statKey) {
  const isLegendary = (Array.isArray(addons) ? addons : [])
    .some(addon => addon?.type === "legendary");

  if (!isLegendary) return 0;
  return statKey === "phys" || statKey === "en" ? 1 : 0;
}

function getArmorAddonDelta(stored, statKey) {
  const addons = Array.isArray(stored?.addons) ? stored.addons : [];
  const addonDelta = addons.reduce(
    (sum, addon) => sum + (addon?.deltas?.[statKey] || 0),
    0
  );

  // Legendary Armor always grants this once, regardless of property.
  return addonDelta + getLegendaryArmorUniversalBonus(addons, statKey);
}

function recalcArmorFromAddons(stored, isPowerArmor) {
  ensureArmorBase(stored, isPowerArmor);

  const bPhys = extractFirstInt(stored.base.physdr);
  const bEn   = extractFirstInt(stored.base.endr);
  const bRad  = extractFirstInt(stored.base.raddr);

  const mods = stored.addons || [];
  const dPhys = getArmorAddonDelta(stored, "phys");
  const dEn   = getArmorAddonDelta(stored, "en");
  const dRad  = getArmorAddonDelta(stored, "rad");
  const dCost = mods.reduce((s,a) => s + (a?.deltas?.cost || 0), 0);
  const dHP   = mods.reduce((s,a) => s + (a?.deltas?.hp   || 0), 0);
  const dWeight = mods.reduce((s,a) => s + (a?.deltas?.weight || 0), 0);

  if (!Number.isNaN(bPhys)) stored.physdr = String(bPhys + dPhys);
  if (!Number.isNaN(bEn))   stored.endr   = String(bEn + dEn);
  if (!Number.isNaN(bRad))  stored.raddr  = String(bRad + dRad);

  const bVal = extractFirstInt(stored.base.value);
  if (!Number.isNaN(bVal)) stored.value = String(bVal + dCost);

  const bWeight = parseItemWeight(stored.base.weight);
  stored.weight = formatWeightNumber(Math.max(0, bWeight + dWeight));

  if (isPowerArmor) {
	  const bHp = extractFirstInt(stored.base.hp);
	  if (!Number.isNaN(bHp)) {
	    const maxHp = String(bHp + dHP);
	
	    // Store computed "max" HP separately (recommended)
	    stored.maxHp = maxHp;
	
	    // If player has not manually changed current HP, keep it synced to max
	    if (!stored.hpManual) stored.hp = maxHp;
	  }
	}


  if (String(stored.apparel || "").trim()) {
    const definitions = cachedArmorAddonData[isPowerArmor ? "power" : "normal"] || [];
    const prefixes = mods.filter(mod => mod.type === "legendary").map(mod => {
      const def = definitions.find(definition => definition.id === mod.id) || mod;
      return def.namePrefix || def.displayName || def.basename || String(def.id || "").split("/").pop().replace(/\.md$/i, "");
    }).filter(Boolean);
    const baseName = sourceDisplayName({sourcePath:stored.sourcePath || "",rawLink:stored.apparel,fallbackName:"Apparel"});
    stored.generatedName = [...prefixes,baseName].join(" ");
  }

}

function openArmorAddonPicker({ stored, isPowerArmor, onAdded }) {
  const overlay = document.createElement("div");
    overlay.classList.add("vk-modal-overlay");
  overlay.style = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    background:rgba(30,40,50,0.70);z-index:99999;display:flex;
    align-items:center;justify-content:center;`;

  const modal = document.createElement("div");
    modal.classList.add("vk-modal");
  modal.style = `
    background:#172a3b;padding:16px;border-radius:12px;
    border:3px solid #ffc200;min-width:340px;max-width:92vw;`;

  const title = document.createElement("div");
  title.textContent = "Add Addon";
  title.style = "color:#ffc200;font-weight:bold;margin-bottom:10px;text-align:center;";
  modal.appendChild(title);

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search mods / legendary...";
  input.style = `
    width:100%;padding:7px;border-radius:6px;border:1.5px solid #ffc200;
    background:#fde4c9;color:#000;caret-color:#000;margin-bottom:10px;`;
  modal.appendChild(input);

  const results = document.createElement("div");
  results.style.background = '#10283a';
  results.style.borderRadius = '8px';
  results.style.maxHeight = '260px';
  results.style.overflow = 'auto';
  results.style.border = '1px solid rgba(255,194,0,.32)';
  results.style.color = '#f4ead5';
  modal.appendChild(results);

  const closeRow = document.createElement("div");
  closeRow.style = "display:flex;justify-content:center;margin-top:10px;";
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.style = "background:#172a3b;color:#ffc200;font-weight:bold;padding:6px 16px;border-radius:6px;border:2px solid #ffc200;cursor:pointer;";
  closeBtn.onclick = () => document.body.removeChild(overlay);
  closeRow.appendChild(closeBtn);
  modal.appendChild(closeRow);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  input.focus();

  const renderResults = async () => {
    const q = input.value.trim().toLowerCase();
    const list = await fetchArmorAddonData(isPowerArmor);
    const filtered = !q ? list : list.filter(x => x.basename.toLowerCase().includes(q));
    filtered.sort((a, b) => {
	  const rank = (x) => (x.type === "mod" ? 0 : 1); // mods first, legendary second
	  const r = rank(a) - rank(b);
	  if (r !== 0) return r;
	  return (a.basename || "").localeCompare(b.basename || "", undefined, { sensitivity: "base" });
	});


    results.innerHTML = "";
    filtered.forEach((a, idx) => {
      const row = document.createElement("div");
      row.style = `
        padding:8px 10px;cursor:pointer;display:flex;justify-content:space-between;
        border-bottom:${idx < filtered.length - 1 ? "1px solid rgba(244,234,213,.12)" : "none"};`;
      row.onmouseover = () => row.style.background = "#203d55";
      row.onmouseout = () => row.style.background = "";

      const left = document.createElement("div");
      left.textContent = a.displayName || a.basename;

      const right = document.createElement("div");
      if (a.type === "mod") {
        const d = a.deltas;
        right.textContent = `DR +${d.phys}/+${d.en}/+${d.rad}  Val ${d.cost>=0?"+":""}${d.cost}  Wt ${d.weight>=0?"+":""}${d.weight}${isPowerArmor && d.hp ? `  HP ${d.hp>=0?"+":""}${d.hp}` : ""}`;
      } else {
        right.textContent = "Legendary";
      }
      right.style.color = "#c8d6df";
      right.style.opacity = "0.9";

      row.onclick = () => {
        ensureArmorBase(stored, isPowerArmor);

        if (stored.addons.some(x => x.id === a.id)) return;

        stored.addons.push({
          id: a.id,
          link: a.link,
          type: a.type,
          deltas: a.deltas
        });

        recalcArmorFromAddons(stored, isPowerArmor);
        onAdded && onAdded();
        document.body.removeChild(overlay);
      };

      row.append(left, right);
      results.appendChild(row);
    });
  };

  input.addEventListener("input", debounce(renderResults, 150));
  renderResults();
}

function openArmorItemPicker({ section, isPowerArmor, onPick }) {
  const overlay = document.createElement("div");
    overlay.classList.add("vk-modal-overlay");
  overlay.style = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    background:rgba(30,40,50,0.70);z-index:99999;display:flex;
    align-items:center;justify-content:center;`;

  const modal = document.createElement("div");
    modal.classList.add("vk-modal");
  modal.style = `
    background:#172a3b;padding:16px;border-radius:12px;
    border:3px solid #ffc200;min-width:360px;max-width:92vw;`;

  const title = document.createElement("div");
  title.textContent = isPowerArmor ? "Select Power Armor" : "Select Armor";
  title.style = "color:#ffc200;font-weight:bold;margin-bottom:10px;text-align:center;";
  modal.appendChild(title);

  const input = document.createElement("input");
  input.className = "vk-modal-search-input";
  input.type = "text";
  input.placeholder = "Search items...";
  input.style = `
    width:100%;padding:7px;border-radius:6px;border:1.5px solid #ffc200;
    background:#fde4c9;color:#000;caret-color:#000;margin-bottom:10px;`;
  modal.appendChild(input);

  const results = document.createElement("div");
  results.className = "vk-modal-results";
  results.style.background = "#10283a";
  results.style.borderRadius = "8px";
  results.style.maxHeight = "300px";
  results.style.overflow = "auto";
  results.style.border = "1px solid rgba(0,0,0,0.2)";
  results.style.color = "black";
  modal.appendChild(results);

  const closeRow = document.createElement("div");
  closeRow.style = "display:flex;justify-content:center;margin-top:10px;";
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.style = "background:#172a3b;color:#ffc200;font-weight:bold;padding:6px 16px;border-radius:6px;border:2px solid #ffc200;cursor:pointer;";
  closeBtn.onclick = () => document.body.removeChild(overlay);
  closeRow.appendChild(closeBtn);
  modal.appendChild(closeRow);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  input.focus();

  const fetchItems = async () => {
    return isPowerArmor ? await fetchPowerArmorData(section) : await fetchArmorData(section);
  };

  const renderResults = async () => {
    const q = input.value.trim().toLowerCase();
    const list = await fetchItems();
    const filtered = !q ? list : list.filter(x => (x.link || x.basename || "").toLowerCase().includes(q));
    filtered.sort((a, b) => {
	  const rank = (x) => (x.type === "mod" ? 0 : 1); // mods first, legendary second
	  const r = rank(a) - rank(b);
	  if (r !== 0) return r;
	  return (a.basename || "").localeCompare(b.basename || "", undefined, { sensitivity: "base" });
	});

    results.innerHTML = "";
    filtered.forEach((item, idx) => {
      const row = document.createElement("div");
      row.style = `
        padding:8px 10px;cursor:pointer;display:flex;justify-content:space-between;
        border-bottom:${idx < filtered.length - 1 ? "1px solid rgba(0,0,0,0.15)" : "none"};`;
      row.onmouseover = () => row.style.background = "#203d55";
      row.onmouseout = () => row.style.background = "";

      const left = document.createElement("div");
      left.textContent = item.link || item.basename || "Unknown";

      const right = document.createElement("div");
      right.style.opacity = "0.8";
      right.textContent = isPowerArmor
        ? `DR ${item.physdr}/${item.endr}/${item.raddr}  HP ${item.hp}  Val ${item.value ?? "0"}`
        : `DR ${item.physdr}/${item.endr}/${item.raddr}  Val ${item.value ?? "0"}  Wt ${item.weight ?? "0"}`;

      row.onclick = () => {
        onPick && onPick(item);
        document.body.removeChild(overlay);
      };

      row.append(left, right);
      results.appendChild(row);
    });
  };

  input.addEventListener("input", debounce(renderResults, 150));
  renderResults();
}


// --- Card rendering for a single slot (head, torso, etc) ---

// Breaking is item state, never a change to the item's source DR or mod deltas.
function vkArmorBreaking(item) {
  return Object.fromEntries(["phys", "en", "rad"].map(key => [key,
    Math.max(0, Math.trunc(Number(item?.breaking?.[key]) || 0))]));
}
function vkArmorHasBreaking(item) {
  return Object.values(vkArmorBreaking(item)).some(value => value > 0);
}
function vkArmorResistance(item, key, target) {
  const full = Math.max(0, Number(item?.[key]) || 0);
  const effective = Math.max(0, Number(applyActiveEffectModifiers(full, target).effective) || 0);
  const lossKey = {physdr:"phys", endr:"en", raddr:"rad"}[key];
  const loss = vkArmorBreaking(item)[lossKey];
  return {full, effective, loss, remaining:Math.max(0, effective - loss)};
}
const vkApparelMarkdownOwners = new Map();
let vkApparelMarkdownObserver = null;
function vkReleaseApparelMarkdown() {
  for (const [card,owner] of vkApparelMarkdownOwners) {
    if (!card.isConnected) {owner.unload();vkApparelMarkdownOwners.delete(card);}
  }
  if (!vkApparelMarkdownOwners.size) {vkApparelMarkdownObserver?.disconnect();vkApparelMarkdownObserver=null;}
}
function vkOwnApparelMarkdown(card) {
  const owner=new obsidian.Component();owner.load();vkApparelMarkdownOwners.set(card,owner);
  if (!vkApparelMarkdownObserver) {
    vkApparelMarkdownObserver=new MutationObserver(vkReleaseApparelMarkdown);
    vkApparelMarkdownObserver.observe(document.body,{childList:true,subtree:true});
  }
  queueMicrotask(vkReleaseApparelMarkdown);
  return owner;
}
sheetcontainer._disposeApparelView = () => {
  vkApparelMarkdownObserver?.disconnect();vkApparelMarkdownObserver=null;
  for (const owner of vkApparelMarkdownOwners.values()) owner.unload();
  vkApparelMarkdownOwners.clear();
};
function vkRefreshArmorCard(card) {
  const isPower=card.classList.contains("vk-power-armor-card");
  const section=isPower ? card.dataset.powerArmorSection : card.dataset.section;
  if (!section) return;
  const live=isPower ? loadPowerArmorData(section) : loadArmorData(section);
  const item={...(card._vkArmorView || live),breaking:vkArmorBreaking(live)};
  card.querySelectorAll(".vk-apparel-dr[data-effect-target]").forEach(host=>{
    const target=host.dataset.effectTarget;
    const key=({"Physical DR":"physdr","Energy DR":"endr","Radiation DR":"raddr"})[target];
    const {full,effective,loss,remaining}=vkArmorResistance(item,key,target);
    host.querySelector("output").textContent=formatEffectNumber(remaining);
    host.dataset.effectModified=String(full!==effective);
    host.dataset.breaking=String(loss>0);
    host.title=[full!==effective ? buildActiveEffectTooltip(target,full,effective) : `${target}: ${full}`,loss ? `Breaking: −${loss}; remaining DR: ${remaining}` : ""].filter(Boolean).join("\n");
  });
  card.querySelectorAll(".vk-apparel-breaking").forEach(input=>{
    const [key,target]=({phys:["physdr","Physical DR"],en:["endr","Energy DR"],rad:["raddr","Radiation DR"]})[input.dataset.resistance];
    const {effective,loss}=vkArmorResistance(item,key,target);
    input.max=String(effective);
    input.disabled=effective===0 && loss===0;
  });
}
function renderArmorCard(section) { return renderCompactApparelCard(section, false); }
function renderPowerArmorCard(section) { return renderCompactApparelCard(section, true); }
function renderCompactApparelCard(section, isPower) {
  const load = () => isPower ? loadPowerArmorData(section) : loadArmorData(section);
  const save = item => isPower ? savePowerArmorData(section,item) : saveArmorData(section,item);
  const initial = load();
  const card = document.createElement("div");
  card.className = `armor-card vk-armor-card vk-apparel-card${isPower ? " vk-power-armor-card" : ""}`;
  if (isPower) card.dataset.powerArmorSection = section; else card.dataset.section = section;
  card.dataset.bodySlot = ({Outfit:"base",Frame:"base",Head:"head",Helmet:"head"})[section] || section.toLowerCase().replace(/ /g,"-");
  const occupied = !!String(initial.apparel || "").trim();
  card.classList.toggle("vk-apparel-empty", !occupied);
  let view = structuredClone(initial);
  if (occupied) recalcArmorFromAddons(view,isPower);
  card._vkArmorView = view;
  const header = document.createElement("div");header.className = "vk-apparel-header";
  const location = document.createElement("span");location.className = "vk-apparel-location";location.textContent = section;
  const actions = document.createElement("div");actions.className = "vk-apparel-actions";
  const identity=document.createElement("div");identity.className="vk-apparel-identity";
  const name = document.createElement("div");name.className = "vk-apparel-name";
  identity.append(location,name);header.append(identity,actions);card.appendChild(header);
  const paintName = () => {
    name.replaceChildren();
    if (!occupied) { name.textContent = "Empty · equip from Inventory";return; }
    appendSourceWikiLink(name,view.apparel,"Apparel",view.sourcePath || "","",
      normalizeInstanceName(view.instanceName) || normalizeInstanceName(view.generatedName) || view.yamlName || stripWikiLink(view.apparel));
  };
  paintName();
  if (!occupied) return card;
  const markdownOwner=vkOwnApparelMarkdown(card);
  let markdownRegions=[];
  const modify = document.createElement("button");modify.type="button";
  styleEquipmentActionIcon(modify,"modify");modify.title="Modify apparel";modify.setAttribute("aria-label",`Modify ${section}`);
  modify.onclick = () => openEquippedApparelWorkbench(load(),isPower,section).catch(error => {console.error(error);showSheetNotice(error.message);});
  const unequip = document.createElement("button");unequip.type="button";
  styleEquipmentActionIcon(unequip,"unequip");unequip.title="Unequip to Inventory";unequip.setAttribute("aria-label",`Unequip ${section}`);
  unequip.onclick = async () => {
    if (unequip.disabled) return;
    modify.disabled=unequip.disabled=true;
    try {
      const moved = isPower ? await unequipPowerArmorSectionToInventory(section) : await unequipArmorSectionToInventory(section);
      if (moved) card.replaceWith(renderCompactApparelCard(section,isPower));
    } catch (error) {console.error(error);showSheetNotice(error.message);}
    finally {modify.disabled=unequip.disabled=false;}
  };
  guardObsidianClick(modify);guardObsidianClick(unequip);
  const repair=document.createElement("button");repair.type="button";
  styleEquipmentActionIcon(repair,"repair");
  repair.querySelector("svg")?.setAttribute("aria-hidden","true");
  repair.title="Repair apparel";repair.setAttribute("aria-label",`Repair ${section}`);guardObsidianClick(repair);
  repair.onclick=()=>openApparelRepair(section,isPower).catch(error=>{console.error(error);showSheetNotice(error.message);});
  actions.append(modify,repair,unequip);
  const band = document.createElement("div");band.className="vk-apparel-band";
  for (const label of ["Type","DR","Breaking"]) {
    const cell=document.createElement("span");cell.className="vk-apparel-band-label";cell.textContent=label;band.appendChild(cell);
  }
  const breakingInputs = [];
  // Every edit merges into live instance state; opening cards does not write storage.
  const updateState = change => {
    const live=load();
    if (vkApparelFingerprint(live)!==vkApparelFingerprint(initial)) {
      showSheetNotice("Equipment changed. Reopen this armor section.");return false;
    }
    live.breaking=vkArmorBreaking(live);
    if (!live.instanceId) live.instanceId=makeInventoryInstanceId();
    change(live);
    try { save(live); }
    catch (error) { console.error(error);showSheetNotice("Armor state could not be saved. Try again.");return false; }
    initial.instanceId=live.instanceId;
    view.breaking=vkArmorBreaking(live);
    view.hp=live.hp;view.hpManual=live.hpManual;
    vkRefreshArmorCard(card);
    return true;
  };
  for (const [label,key,lossKey,target] of [["Phys","physdr","phys","Physical DR"],["Energy","endr","en","Energy DR"],["Rad","raddr","rad","Radiation DR"]]) {
    const type=document.createElement("span");type.className="vk-apparel-type";type.textContent=label;
    const metric=document.createElement("div");metric.className="vk-apparel-metric";metric.dataset.resistance=lossKey;
    const host=document.createElement("span");host.className="vk-armor-stat vk-apparel-dr";host.dataset.effectTarget=target;
    const output=document.createElement("output");output.setAttribute("aria-label",`${section} ${target}`);host.appendChild(output);
    const input=document.createElement("input");input.type="number";input.min="0";input.step="1";input.className="vk-apparel-breaking";
    input.setAttribute("aria-label",`${section} ${label} Breaking`);
    input.dataset.resistance=lossKey;
    input.value=String(vkArmorBreaking(initial)[lossKey]);
    input.addEventListener("change",() => {
      const capacity=vkArmorResistance(view,key,target).effective;
      const amount=Math.min(capacity,Math.max(0,Math.trunc(Number(input.value)||0)));
      if (updateState(live=>{live.breaking[lossKey]=amount;})) input.value=String(amount);
    });
    metric.append(type,host);breakingInputs.push([input,key,target]);
    const counter=attachInputHoverArrows(input);counter.classList.add("vk-apparel-breaking-control");counter.dataset.resistance=lossKey;band.append(metric,counter);
  }
  card.appendChild(band);
  let hpInput,maxHp;
  if (isPower) {
    const hp=document.createElement("div");hp.className="vk-apparel-hp";
    const label=document.createElement("label");label.textContent="HP";
    hpInput=document.createElement("input");hpInput.type="number";hpInput.min="0";hpInput.step="1";hpInput.setAttribute("aria-label",`${section} current HP`);
    hpInput.value=String(initial.hp ?? view.maxHp ?? 0);label.appendChild(attachInputHoverArrows(hpInput));
    maxHp=document.createElement("span");hp.append(label,maxHp);card.appendChild(hp);
    hpInput.addEventListener("change",()=>{
      const amount=Math.min(Math.max(0,Number(view.maxHp)||0),Math.max(0,Math.trunc(Number(hpInput.value)||0)));
      if (updateState(live=>{live.hp=String(amount);live.hpManual=true;})) hpInput.value=String(amount);
    });
  }
  const footer=document.createElement("div");footer.className="vk-apparel-folds";card.appendChild(footer);
  const special=document.createElement("details");special.className="vk-apparel-special";special.hidden=true;
  const specialSummary=document.createElement("summary");specialSummary.textContent="Special";vkDisclosureIcon(specialSummary);
  const effects=document.createElement("div");effects.className="vk-apparel-effects";special.append(specialSummary,effects);
  const details=document.createElement("details");details.className="vk-apparel-details";
  const summary=document.createElement("summary");const meta=document.createElement("div");meta.className="vk-apparel-meta";
  const mods=document.createElement("div");mods.className="vk-apparel-mods";details.append(summary,mods,meta);footer.append(special,details);
  const paint = () => {
    card._vkArmorView=view;paintName();
    for (const [input,key,target] of breakingInputs) input.max=String(vkArmorResistance(view,key,target).effective);
    if (maxHp) { maxHp.textContent=`/ ${view.maxHp ?? "0"}`;hpInput.max=String(view.maxHp ?? 0); }
    summary.textContent=`Mods · ${(view.addons || []).length}`;vkDisclosureIcon(summary);
    meta.textContent=`Weight ${view.weight ?? "0"} · Cost ${view.value ?? "0"}`;
    mods.replaceChildren();
    for (const addon of view.addons || []) {
      const chip=document.createElement("span");
      appendSourceWikiLink(chip,addon.link || "","Mod",String(addon.id || "").endsWith(".md") ? addon.id : "","","");mods.appendChild(chip);
      vkApplyWeaponModAlias(chip,{...view,link:view.apparel},addon);
    }
    if (!mods.childElementCount) mods.textContent="No installed mods";
    const sources=[{label:view.yamlName || stripWikiLink(view.apparel),text:view.gameEffects,path:view.sourcePath || ""},...(view.addons || []).map(a=>({label:sourceDisplayName({rawLink:a.link,sourcePath:a.id,fallbackName:"Mod"}),text:a.gameEffects,path:a.id || view.sourcePath || ""}))].filter(a=>String(a.text || "").trim());
    for (const owner of markdownRegions) markdownOwner.removeChild(owner);
    markdownRegions=[];
    special.hidden=!sources.length;effects.replaceChildren();
    for (const source of sources) {
      const entry=document.createElement("div"),title=document.createElement("strong"),text=document.createElement("div");
      const owner=markdownOwner.addChild(new obsidian.Component());markdownRegions.push(owner);
      title.textContent=source.label;entry.append(title,text);effects.appendChild(entry);
      const rendered=document.createElement("div");text.textContent=source.text;
      renderMarkdownInto(rendered,source.text,source.path,owner).then(()=>{
        if (vkApparelMarkdownOwners.get(card)===markdownOwner && markdownRegions.includes(owner)) text.replaceChildren(...rendered.childNodes);
      }).catch(error=>console.warn("Vault-Kit: apparel Markdown render failed",error));
    }
    vkRefreshArmorCard(card);
  };
  paint();
  loadApparelWorkbenchItem(initial,isPower).then(loaded=>{
    if (!card.isConnected) return;
    const live=load();
    if (vkApparelFingerprint(live)!==vkApparelFingerprint(initial)) return;
    view=loaded;view.breaking=vkArmorBreaking(live);view.hp=live.hp;view.hpManual=live.hpManual;paint();
  }).catch(error=>{ console.warn("Vault-Kit: apparel source could not be refreshed",error);card.title="Source could not be refreshed; showing saved stats."; });
  return card;
}



function renderPoisonDRBar() {
    let wrap = document.createElement('div');
    wrap.className = "vk-compact-panel vk-poison-dr";
    wrap.dataset.effectTarget = "Poison DR";
    wrap.style.display = "flex";
    wrap.style.alignItems = "center";
    wrap.style.background = "#172a3b";
    wrap.style.border = "2px solid #142c3f";
    wrap.style.borderRadius = "8px";
    wrap.style.padding = "1px 12px 1px 12px";
    wrap.style.margin = "8px";
    wrap.style.maxWidth = "200px";
    
    let label = document.createElement('span');
    label.textContent = "Poison DR";
    label.className = "vk-poison-dr-label";
    label.style.display = "flex";
    label.style.flexWrap = "wrap";
    label.style.color = "#ffe974";
    label.style.fontWeight = "bold";
    label.style.marginRight = "10px";
	label.style.fontSize = "1.15em";
    label.style.borderRadius = "8px";
    label.style.padding = "6px 0px 6px 6px";
    label.style.textAlign = "center";
    
    let input = document.createElement('input');
    input.type = "text";
    input.className = "vk-poison-dr-value";
    input.value = localStorage.getItem(POISON_DR_KEY) || "";
    input.dataset.baseValue = input.value;
    input.style.background = "#fde4c9";
    input.style.color = "black";
    input.style.textAlign = "center";
    input.style.borderRadius = "5px";
    input.style.padding = "2px 12px";
    input.style.maxWidth = "50px"
    input.style.maxHeight = "25px"
    input.style.caretColor = 'black';
    input.addEventListener('focus', () => {
        input.value = localStorage.getItem(POISON_DR_KEY) || "";
        input.style.setProperty("color", "var(--vk-text, #f4ead5)", "important");
        wrap.removeAttribute("data-effect-modified");
        wrap.removeAttribute("title");
    });
    input.addEventListener('input', () => {
        input.dataset.baseValue = input.value;
        localStorage.setItem(POISON_DR_KEY, input.value);
    });
    input.addEventListener('blur', () => {
        if (typeof refreshArmorEffectVisuals === "function") refreshArmorEffectVisuals();
    });
    wrap.appendChild(label);
    wrap.appendChild(input);
    return wrap;
}

// --- FULL ARMOR SECTION GRID ---
function renderApparelGrid(isPower) {
  const wrap=document.createElement("div");wrap.className="vk-apparel-grid-wrap";
  const grid=document.createElement("div");grid.className="armor-cards-grid vk-apparel-grid";
  (isPower ? PA_ARMOR_SECTIONS : ARMOR_SECTIONS).forEach(section=>grid.appendChild(renderCompactApparelCard(section,isPower)));
  wrap.appendChild(grid);return wrap;
}
function renderArmorSectionGrid() { return renderApparelGrid(false); }
function renderPowerArmorSectionGrid() { return renderApparelGrid(true); }
function renderArmorTabsSection() {
  const container=document.createElement("div");container.className="vk-armor-shell vk-apparel-shell";
  const toolbar=document.createElement("div");toolbar.className="vk-armor-toolbar";
  const tabs=document.createElement("div");tabs.className="vk-armor-tabs";
  const layouts=document.createElement("div");layouts.className="vk-apparel-layouts";layouts.setAttribute("role","group");layouts.setAttribute("aria-label","Armor layout");
  const normal=renderArmorSectionGrid(),power=renderPowerArmorSectionGrid();
  let mode=localStorage.getItem("fallout_armor_view_mode")==="power" ? "power" : "normal";
  let layout=localStorage.getItem("fallout_armor_layout")==="compact" ? "compact" : "body";
  const modeButtons=[],layoutButtons=[];
  const apply=()=>{
    normal.hidden=mode!=="normal";power.hidden=mode!=="power";container.dataset.armorLayout=layout;
    modeButtons.forEach(([button,value])=>button.setAttribute("aria-pressed",String(value===mode)));
    layoutButtons.forEach(([button,value])=>button.setAttribute("aria-pressed",String(value===layout)));
  };
  for (const [label,value] of [["Normal Armor","normal"],["Power Armor","power"]]) {
    const button=document.createElement("button");button.type="button";button.textContent=label;
    button.onclick=()=>{mode=value;localStorage.setItem("fallout_armor_view_mode",mode);apply();};modeButtons.push([button,value]);tabs.appendChild(button);
  }
  for (const [label,value] of [["Body","body"],["Compact","compact"]]) {
    const button=document.createElement("button");button.type="button";button.textContent=label;
    button.onclick=()=>{layout=value;localStorage.setItem("fallout_armor_layout",layout);apply();};layoutButtons.push([button,value]);layouts.appendChild(button);
  }
  const equipmentControls=document.createElement("div");equipmentControls.className="vk-apparel-equipment-controls";
  equipmentControls.append(renderPoisonDRBar(),tabs);
  toolbar.append(equipmentControls,layouts);container.append(toolbar,normal,power);apply();return container;
}


// List the power armor sections you want. Edit as needed!
const PA_ARMOR_SECTIONS = [
    "Helmet", "Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Frame"
];

const POWER_ARMOR_STORAGE_KEY = "fallout_power_armor_data";
const POWER_ARMOR_FOLDERS = [
    "Fallout-RPG/Items/Apparel/Power Armor"
];

// Adjusted matchesSection for Power Armor if needed
function matchesPowerArmorSection(locations, section) {
    // Simple mapping. Adjust if your YAML has different names!
    const mapping = {
        "Helmet": ["Head"],
        "Torso": ["Torso"],
        "Left Arm": ["Arm"],
        "Right Arm": ["Arm"],
        "Left Leg": ["Leg"],
        "Right Leg": ["Leg"],
        "Frame": ["Frame", "Chassis", "Body", "All"]
    };
    if (typeof locations !== "string") return false;
    if (mapping.hasOwnProperty(section))
        return mapping[section].includes(locations.trim());
    return false;
}

// Async fetch Power Armor items for a given slot
let cachedPowerArmorData = {};
async function fetchPowerArmorData(section) {
    if (cachedPowerArmorData[section]) return cachedPowerArmorData[section];
    let allFiles = await app.vault.getFiles();
    let powerArmorFiles = allFiles.filter(file =>
        POWER_ARMOR_FOLDERS.some(folder => file.path.startsWith(folder))
    );
    let armors = await Promise.all(powerArmorFiles.map(async (file) => {
        let content = await app.vault.read(file);
        let stats = { link: file.basename, sourcePath: file.path, physdr: "0", raddr: "0", endr: "0", hp: "0", locations: "Unknown", value: "0", weight: "0" };
        let statblockMatch = content.match(/```statblock([\s\S]*?)```/);
        if (!statblockMatch) return stats;
        let statblockContent = statblockMatch[1].trim();
        // Parse base Value from cost:
		const costMatch = statblockContent.match(/cost:\s*([^\n\r]+)/i);
		if (costMatch) stats.value = costMatch[1].trim().replace(/"/g, "");
        const weightMatch = statblockContent.match(/weight:\s*([^\n\r]+)/i);
        if (weightMatch) stats.weight = weightMatch[1].trim().replace(/"/g, "");
		
        function extract(pattern) {
            let m = statblockContent.match(pattern);
            return m ? m[1].trim() : "0";
        }
        stats.hp = extract(/hp:\s*(\d+)/i);
        stats.locations = extract(/locations:\s*"([^"]+)"/i);
        // Extract DRs
        let lines = statblockContent.split("\n"), inside = false, curr = "";
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith("dmg resistances:")) { inside = true; continue; }
            if (inside) {
                let name = line.match(/- name:\s*"?(Physical|Energy|Radiation)"?/i);
                if (name) { curr = name[1]; continue; }
                let desc = line.match(/desc:\s*"?(.*?)"?$/i);
                if (desc && curr) {
                    let val = desc[1].trim() || "0";
                    if (curr === "Physical") stats.physdr = val;
                    if (curr === "Energy") stats.endr = val;
                    if (curr === "Radiation") stats.raddr = val;
                    curr = "";
                }
            }
        }
        return stats;
    }));
    cachedPowerArmorData[section] = armors.filter(a => matchesPowerArmorSection(a.locations, section));
    return cachedPowerArmorData[section];
}

// Save/load helpers for this section
function savePowerArmorData(section, data) {
    localStorage.setItem(`${POWER_ARMOR_STORAGE_KEY}_${section}`, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("fallout:equipment-special-updated"));
    setTimeout(() => {
      if (typeof refreshArmorEffectVisuals === "function") refreshArmorEffectVisuals();
    }, 0);
}
function loadPowerArmorData(section) {
    let d = localStorage.getItem(`${POWER_ARMOR_STORAGE_KEY}_${section}`);
    return d ? JSON.parse(d) : {
	  physdr: "", raddr: "", endr: "", hp: "", apparel: "",
	  value: "", base: null, addons: []
	};


}

// Card renderer—same style as your normal armor, just for power armor


//--------------------------------------------------------------------------------------------

// ---- CHARGE-TRACKED CORE HELPERS ----

function getChargeTrackedCoreType(itemOrName) {
  if (typeof itemOrName !== "object") {
    const clean = stripWikiLink(String(itemOrName ?? "")).trim().toLowerCase();
    if (clean === "fusion core") return "fusion";
    if (clean === "plasma core") return "plasma";
    return null;
  }

  const candidates = [
    itemOrName?.yamlName,
    String(itemOrName?.sourcePath || "").split("/").pop()?.replace(/\.md$/i, ""),
    itemOrName?.name,
    itemOrName?.link,
  ];

  for (const raw of candidates) {
    const clean = stripWikiLink(String(raw ?? "")).trim().toLowerCase();
    if (clean === "fusion core") return "fusion";
    if (clean === "plasma core") return "plasma";
  }
  return null;
}

function isChargeTrackedCore(itemOrName) {
  return !!getChargeTrackedCoreType(itemOrName);
}

function makeChargeUnitInstanceId() {
  return `core-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function syncChargeTrackedCoreQty(rowData) {
  if (!isChargeTrackedCore(rowData)) return false;
  if (!Array.isArray(rowData.chargeUnits)) rowData.chargeUnits = [];
  let changed = false;
  rowData.chargeUnits.forEach(unit => {
    if (unit && !String(unit.instanceId || "").trim()) {
      unit.instanceId = makeChargeUnitInstanceId();
      changed = true;
    }
  });
  const nextQty = String(rowData.chargeUnits.length);
  if (String(rowData.qty ?? "") !== nextQty) {
    rowData.qty = nextQty;
    changed = true;
  }
  return changed;
}

function getWeaponChargedCoreType(weapon) {
  const options = parseAmmoOptions(weapon?.ammo);
  for (const option of options) {
    const type = getChargeTrackedCoreType(option);
    if (type) return type;
  }
  return null;
}

function ensureStoredChargeUnitIds() {
  const rows = getGearRows();
  let changed = false;
  rows.forEach(row => {
    if (isChargeTrackedCore(row) && syncChargeTrackedCoreQty(row)) changed = true;
  });
  if (changed) {
    localStorage.setItem(GEAR_STORAGE_KEY, JSON.stringify(rows));
  }
  return rows;
}

function getAvailableChargeUnits(coreType, currentLoadedId = "") {
  const rows = ensureStoredChargeUnitIds();
  let weapons = [];
  try { weapons = JSON.parse(localStorage.getItem("fallout_weapon_table") || "[]"); } catch {}

  const reserved = new Set();
  weapons.forEach(w => {
    const id = String(w?.loadedCore?.instanceId || "").trim();
    if (id && id !== String(currentLoadedId || "")) reserved.add(id);
  });

  const units = [];
  rows.forEach((row, rowIndex) => {
    if (getChargeTrackedCoreType(row) !== coreType) return;
    const displayName = stripWikiLink(row.name || row.yamlName || (coreType === "fusion" ? "Fusion Core" : "Plasma Core"));
    (row.chargeUnits || []).forEach((unit, unitIndex) => {
      const instanceId = String(unit?.instanceId || "").trim();
      if (!instanceId || reserved.has(instanceId)) return;
      const maxCharges = coreType === "plasma" ? 500 : Number(unit.maxCharges ?? 0);
      units.push({
        instanceId,
        coreType,
        charges: Number(unit.charges ?? 0),
        maxCharges,
        sourcePath: row.sourcePath || "",
        displayName,
        rowIndex,
        unitIndex
      });
    });
  });
  return units;
}

function findLoadedCoreUnit(loadedCore) {
  const id = String(loadedCore?.instanceId || "").trim();
  if (!id) return null;
  const rows = ensureStoredChargeUnitIds();
  for (const row of rows) {
    if (!isChargeTrackedCore(row)) continue;
    const coreType = getChargeTrackedCoreType(row);
    const displayName = stripWikiLink(row.name || row.yamlName || (coreType === "fusion" ? "Fusion Core" : "Plasma Core"));
    for (const unit of (row.chargeUnits || [])) {
      if (String(unit?.instanceId || "") === id) {
        return {
          instanceId: id,
          coreType,
          charges: Number(unit.charges ?? 0),
          maxCharges: coreType === "plasma" ? 500 : Number(unit.maxCharges ?? 0),
          weaponShotsRemaining: Number.isFinite(Number(unit.weaponShotsRemaining))
            ? Number(unit.weaponShotsRemaining)
            : null,
          sourcePath: row.sourcePath || "",
          displayName
        };
      }
    }
  }
  return null;
}


function getLoadedCoreAmmoState(weapon) {
  const coreType = getWeaponChargedCoreType(weapon);
  if (!coreType) return null;

  const loaded = findLoadedCoreUnit(weapon?.loadedCore);
  if (!loaded) return null;

  if (coreType === "fusion") {
    const maxShots = Math.max(0, Number(loaded.maxCharges || 0) * 50);
    const derivedShots = Math.max(0, Number(loaded.charges || 0) * 50);

    // Older Fusion Core records do not have weaponShotsRemaining yet.
    // IMPORTANT: Number(null) === 0, so only treat this as a real stored
    // shot count when the value is actually present. Otherwise derive the
    // weapon ammo from the core's current charges.
    const rawStoredShots = loaded.weaponShotsRemaining;
    const hasStoredShots = rawStoredShots !== null && rawStoredShots !== undefined && rawStoredShots !== "";
    const storedShots = hasStoredShots ? Number(rawStoredShots) : NaN;
    const currentShots = Number.isFinite(storedShots)
      ? Math.max(0, Math.min(maxShots, storedShots))
      : Math.min(maxShots, derivedShots);

    return { coreType, loaded, currentShots, maxShots, step: 10 };
  }

  const maxShots = 500;
  const currentShots = Math.max(0, Math.min(maxShots, Number(loaded.charges || 0)));
  return { coreType, loaded, currentShots, maxShots, step: 10 };
}

function setLoadedCoreAmmoShots(weapon, newShots) {
  const loadedId = String(weapon?.loadedCore?.instanceId || "").trim();
  const coreType = getWeaponChargedCoreType(weapon);
  if (!loadedId || !coreType) return;

  const rows = ensureStoredChargeUnitIds();
  let changed = false;

  for (const row of rows) {
    if (getChargeTrackedCoreType(row) !== coreType) continue;

    for (const unit of (row.chargeUnits || [])) {
      if (String(unit?.instanceId || "") !== loadedId) continue;

      if (coreType === "fusion") {
        const maxCharges = Math.max(0, Number(unit.maxCharges || 0));
        const maxShots = maxCharges * 50;
        const shots = Math.max(0, Math.min(maxShots, Math.round(Number(newShots) || 0)));

        // Keep exact Gatling-laser ammunition separately so a partially-used
        // 50-shot fusion-core charge is not lost between refreshes/swaps.
        unit.weaponShotsRemaining = shots;
        unit.charges = shots <= 0 ? 0 : Math.ceil(shots / 50);
      } else {
        const shots = Math.max(0, Math.min(500, Math.round(Number(newShots) || 0)));
        unit.charges = shots;
      }

      changed = true;
      break;
    }
    if (changed) break;
  }

  if (changed) {
    localStorage.setItem(GEAR_STORAGE_KEY, JSON.stringify(rows));
    window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
  }
}

function showWeaponCorePicker(weapon, { actionLabel = "Equip", allowNone = true } = {}) {
  return new Promise(resolve => {
    const coreType = getWeaponChargedCoreType(weapon);
    if (!coreType) { resolve({ cancelled: false, loadedCore: null }); return; }

    const currentId = String(weapon?.loadedCore?.instanceId || "");
    const units = getAvailableChargeUnits(coreType, currentId);
    const coreName = coreType === "fusion" ? "Fusion Core" : "Plasma Core";

    const overlay = document.createElement("div");
    overlay.classList.add("vk-modal-overlay");
    overlay.style = "position:fixed;inset:0;background:rgba(30,40,50,.86);z-index:99999;display:flex;align-items:center;justify-content:center;";
    const modal = document.createElement("div");
    modal.classList.add("vk-modal");
    modal.style = "background:#172a3b;padding:20px;border-radius:12px;border:3px solid #ffc200;min-width:340px;max-width:92vw;max-height:80vh;overflow:auto;";

    const title = document.createElement("div");
    title.textContent = `Select ${coreName}`;
    title.style = "color:#ffc200;font-weight:bold;font-size:1.15em;text-align:center;margin-bottom:5px;";
    const subtitle = document.createElement("div");
    subtitle.textContent = `${stripWikiLink(weapon.link || weapon.name || "Weapon")} uses a charged ${coreName}.`;
    subtitle.style = "color:#fde4c9;text-align:center;font-size:.9em;margin-bottom:12px;";
    modal.append(title, subtitle);

    const finish = result => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      resolve(result);
    };

    const list = document.createElement("div");
    list.style = "display:flex;flex-direction:column;gap:7px;";

    if (!units.length) {
      const empty = document.createElement("div");
      empty.textContent = `No available ${coreName}s are currently in inventory.`;
      empty.style = "color:#fde4c9;text-align:center;padding:8px;opacity:.85;";
      list.appendChild(empty);
    } else {
      units.forEach(unit => {
        const btn = document.createElement("button");
        const current = unit.instanceId === currentId ? "  • currently loaded" : "";
        if (coreType === "fusion") {
          const rawStoredShots = unit.weaponShotsRemaining;
          const hasStoredShots = rawStoredShots !== null && rawStoredShots !== undefined && rawStoredShots !== "";
          const storedShots = hasStoredShots ? Number(rawStoredShots) : NaN;
          const shots = Number.isFinite(storedShots) ? storedShots : Number(unit.charges || 0) * 50;
          btn.textContent = `${unit.displayName} — ${shots} shots (${unit.charges} / ${unit.maxCharges} charges)${current}`;
        } else {
          btn.textContent = `${unit.displayName} — ${unit.charges} / 500 shots${current}`;
        }
        btn.style = "background:#fde4c9;color:#214a72;border:1px solid #ffc200;border-radius:6px;padding:8px 12px;cursor:pointer;font-weight:bold;text-align:left;";
        btn.onclick = () => finish({
          cancelled: false,
          loadedCore: {
            instanceId: unit.instanceId,
            coreType: unit.coreType,
            sourcePath: unit.sourcePath
          }
        });
        list.appendChild(btn);
      });
    }

    modal.appendChild(list);

    const buttons = document.createElement("div");
    buttons.style = "display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap;";
    if (allowNone) {
      const none = document.createElement("button");
      none.textContent = `${actionLabel} Without Core`;
      none.style = "background:#142c3f;color:#ffc200;border:2px solid #ffc200;border-radius:6px;padding:6px 12px;cursor:pointer;font-weight:bold;";
      none.onclick = () => finish({ cancelled: false, loadedCore: null });
      buttons.appendChild(none);
    }
    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    cancel.style = "background:#172a3b;color:#fde4c9;border:1px solid #fde4c9;border-radius:6px;padding:6px 12px;cursor:pointer;";
    cancel.onclick = () => finish({ cancelled: true, loadedCore: weapon?.loadedCore ?? null });
    buttons.appendChild(cancel);
    modal.appendChild(buttons);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  });
}

function showCoreChargeEditor({ rowData, unit = null, quantity = 1, onSave }) {
  const coreType = getChargeTrackedCoreType(rowData);
  if (!coreType) return;

  const isFusion = coreType === "fusion";
  const editing = !!unit;

  const overlay = document.createElement("div");
    overlay.classList.add("vk-modal-overlay");
  overlay.style = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    background:rgba(30,40,50,0.86);z-index:9999;
    display:flex;align-items:center;justify-content:center;`;

  const modal = document.createElement("div");
    modal.classList.add("vk-modal");
  modal.style = `
    background:#172a3b;padding:24px 22px;border-radius:14px;
    box-shadow:0 8px 44px #111b2d88;border:3px solid #ffc200;
    display:flex;flex-direction:column;gap:12px;min-width:320px;max-width:95vw;`;

  const title = document.createElement("div");
  title.textContent = `${editing ? "Edit" : "Add"} ${isFusion ? "Fusion Core" : "Plasma Core"}`;
  title.style = "color:#ffc200;font-weight:bold;font-size:1.2em;text-align:center;";
  modal.appendChild(title);
  if (!editing && quantity > 1) {
    const hint = document.createElement("div");
    hint.textContent = `Adding ${quantity} cores. These charge values apply to each core; you can edit them individually afterward.`;
    hint.style = "color:var(--vk-muted,#98aab5);max-width:340px;line-height:1.5;";
    modal.appendChild(hint);
  }

  function makeNumberField(labelText, value, max = null) {
    const row = document.createElement("label");
    row.style = "display:flex;align-items:center;justify-content:space-between;gap:12px;color:#fff;";
    const label = document.createElement("span");
    label.textContent = labelText;
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    if (max !== null) input.max = String(max);
    input.value = String(value ?? "");
    input.style = "width:90px;background:#fde4c9;color:#222;border:1.5px solid #ffc200;border-radius:5px;padding:5px;text-align:center;";
    // Preserve native focus/selection while shielding the input from Obsidian.
    input.addEventListener("pointerdown", event => event.stopPropagation());
    input.addEventListener("mousedown", event => event.stopPropagation());
    row.append(label, input);
    modal.appendChild(row);
    return input;
  }

  const currentInput = makeNumberField("Current Charge", unit?.charges ?? (isFusion ? "" : 500), isFusion ? null : 500);

  let maxInput = null;
  if (isFusion) {
    maxInput = makeNumberField("Maximum Charge", unit?.maxCharges ?? "");
  } else {
    const fixed = document.createElement("div");
    fixed.textContent = "Maximum Charge: 500";
    fixed.style = "color:#efdd6f;text-align:center;font-size:0.95em;";
    modal.appendChild(fixed);
  }

  const error = document.createElement("div");
  error.style = "color:#ffb3b3;font-weight:bold;text-align:center;min-height:1.2em;";
  modal.appendChild(error);

  const buttons = document.createElement("div");
  buttons.style = "display:flex;gap:12px;justify-content:center;margin-top:4px;";
  const saveBtn = document.createElement("button");
  saveBtn.textContent = editing ? "Save" : quantity > 1 ? `Add ${quantity} Cores` : "Add Core";
  saveBtn.style = "background:#ffc200;color:#214a72;font-weight:bold;padding:6px 18px;border-radius:6px;border:none;cursor:pointer;";
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style = "background:#172a3b;color:#ffc200;font-weight:bold;padding:6px 18px;border-radius:6px;border:2px solid #ffc200;cursor:pointer;";

  saveBtn.onclick = () => {
    const charges = Number(currentInput.value);
    const maxCharges = isFusion ? Number(maxInput.value) : 500;
    if (!Number.isFinite(charges) || charges < 0) { error.textContent = "Current charge must be 0 or greater."; return; }
    if (!Number.isFinite(maxCharges) || maxCharges <= 0) { error.textContent = "Maximum charge must be greater than 0."; return; }
    if (charges > maxCharges) { error.textContent = "Current charge cannot exceed maximum charge."; return; }
    document.body.removeChild(overlay);
    const instanceId = String(unit?.instanceId || "").trim() || makeChargeUnitInstanceId();
    onSave?.(isFusion
      ? { instanceId, charges, maxCharges, weaponShotsRemaining: charges * 50 }
      : { instanceId, charges });
  };
  cancelBtn.onclick = () => document.body.removeChild(overlay);
  buttons.append(saveBtn, cancelBtn);
  modal.appendChild(buttons);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  currentInput.focus();
  currentInput.select();
}

function renderChargeUnitsRow(rowData, visibleColumnCount, saveAndRender) {
  syncChargeTrackedCoreQty(rowData);
  const row = document.createElement("tr");
  row.classList.add("gear-charge-row", "vk-secondary-detail-row");
  const cell = document.createElement("td");
  cell.classList.add("vk-secondary-detail-cell");
  cell.colSpan = Math.max(1, visibleColumnCount);
  cell.style.background = "#06080c60";
  cell.style.padding = "7px 10px";
  cell.style.textAlign = "left";
  const wrap = document.createElement("div");
  wrap.className = "vk-core-units";
  const label = document.createElement("span");
  label.textContent = "Charges:";
  label.className = "vk-core-label";
  wrap.appendChild(label);

  const units = rowData.chargeUnits;
  const coreType = getChargeTrackedCoreType(rowData);
  if (!units.length) {
    const empty = document.createElement("span");
    empty.textContent = "No cores";
    empty.style = "color:#c5c5c5;opacity:0.6;";
    wrap.appendChild(empty);
  }

  units.forEach((unit, index) => {
    const group = document.createElement("span");
    group.className = "vk-core-unit";
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "vk-core-charge";
    const max = coreType === "plasma" ? 500 : Number(unit.maxCharges ?? 0);
    chip.textContent = `${Number(unit.charges ?? 0)} / ${max}`;
    chip.title = "Edit core charges";
    chip.setAttribute("aria-label", `Edit core ${index + 1} charges: ${Number(unit.charges ?? 0)} of ${max}`);
    guardObsidianClick(chip);
    chip.onclick = (e) => {
      e.stopPropagation();
      showCoreChargeEditor({ rowData, unit, onSave: (updated) => {
        rowData.chargeUnits[index] = updated;
        syncChargeTrackedCoreQty(rowData);
        saveAndRender();
      }});
    };

    const remove = document.createElement("button");
    remove.title = "Remove this core";
    remove.setAttribute("aria-label", `Remove core ${index + 1}`);
    styleEquipmentActionIcon(remove, "remove");
    guardObsidianClick(remove);
    remove.onclick = (e) => {
      e.stopPropagation();
      rowData.chargeUnits.splice(index, 1);
      syncChargeTrackedCoreQty(rowData);
      saveAndRender();
    };
    group.append(chip, remove);
    wrap.appendChild(group);
  });

  const add = document.createElement("button");
  add.title = "Add core";
  styleEquipmentActionIcon(add, "add");
  guardObsidianClick(add);
  add.onclick = (e) => {
    e.stopPropagation();
    showCoreChargeEditor({ rowData, onSave: (newUnit) => {
      rowData.chargeUnits.push(newUnit);
      syncChargeTrackedCoreQty(rowData);
      saveAndRender();
    }});
  };
  wrap.appendChild(add);
  cell.appendChild(wrap);
  row.appendChild(cell);
  return row;
}

// ---- GEAR SECTION (DRY TABLE VERSION) ----

const GEAR_STORAGE_KEY = getStorageKey("fallout_gear_table");
const GEAR_SEARCH_FOLDERS = [
    "Fallout-RPG/Items/Apparel",
    "Fallout-RPG/Items/Consumables",
    "Fallout-RPG/Items/Tools and Utilities",
    "Fallout-RPG/Items/Weapons",
    "Fallout-RPG/Items/Ammo",
    "Fallout-RPG/Perks/Book Perks"
];
const GEAR_DESCRIPTION_LIMIT = 100;

let cachedGearData = null;

function categoryKeyFromPath(path) {
  const p = String(path || "");
  if (p.startsWith("Fallout-RPG/Items/Weapons")) return "WEAPONS";
  if (p.startsWith("Fallout-RPG/Items/Apparel")) return "APPAREL";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Food")) return "FOOD";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Beverages")) return "FOOD";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Chems")) return "CHEMS";
  if (p.startsWith("Fallout-RPG/Items/Ammo")) return "AMMO";
  if (p.startsWith("Fallout-RPG/Perks/Book Perks")) return "MISC";
  if (p.startsWith("Fallout-RPG/Items/Tools and Utilities")) return "MISC";
  return "MISC";
}


function parseItemWeight(value) {
  const text = String(value ?? "").trim();
  if (!text) return 0;
  if (text === "<1") return 0.1;
  const match = text.match(/-?\d+(?:\.\d+)?/);
  if (!match) return 0;
  const weight = Number(match[0]);
  return Number.isFinite(weight) ? weight : 0;
}

function formatWeightNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}

async function fetchGearData() {
    if (cachedGearData) return cachedGearData;
    let allFiles = await app.vault.getFiles();
    const excludedNames = new Set(["_books and magazines roll table.md", "rare books.md"]);
    let gearFiles = allFiles.filter(file =>
        file.extension === "md" &&
        !excludedNames.has(String(file.name || file.path.split("/").pop()).toLowerCase()) &&
        GEAR_SEARCH_FOLDERS.some(folder => file.path.startsWith(folder + "/"))
    );
    let gearItems = await Promise.all(gearFiles.map(async (file) => {
        let content = await app.vault.read(file);
        let stats = {
		  name: `[[${file.basename}]]`,
		  yamlName: "",            // NEW (hidden field for matching)
		  sourcePath: file.path,   // NEW (lets us reason about folder rules)
		  qty: "1",
		  cost: "",
		  weight: "",
		  selected: false,
		  category: categoryKeyFromPath(file.path)
		};
		
		let statblockMatch = content.match(/```statblock([\s\S]*?)```/);
		if (!statblockMatch) return stats;
		let statblockContent = statblockMatch[1].trim();
		
		// NEW: capture YAML name
		let yamlNameMatch = statblockContent.match(/^\s*name:\s*(.+)\s*$/im);
		if (yamlNameMatch) stats.yamlName = yamlNameMatch[1].trim().replace(/"/g, "");

        let costMatch = statblockContent.match(/cost:\s*(.+)/i);
        if (costMatch) {
            stats.cost = costMatch[1].trim().replace(/\"/g, '');
        }
        let weightMatch = statblockContent.match(/weight:\s*(.+)/i);
        if (weightMatch) {
            stats.weight = weightMatch[1].trim().replace(/\"/g, '');
        }
        return stats;
    }));
    cachedGearData = gearItems.filter(g => g);
    return cachedGearData;
}


// ---- INVENTORY MOD HELPERS ----

function getInventoryModKind(item) {
  const path = String(item?.sourcePath || "");
  const category = String(item?.category || "").toUpperCase();
  if (category === "WEAPONS" || path.startsWith("Fallout-RPG/Items/Weapons")) return "weapon";
  if (category === "APPAREL" || path.startsWith("Fallout-RPG/Items/Apparel")) {
    return path.includes("/Power Armor/") ? "powerArmor" : "armor";
  }
  return null;
}

function isInventoryModdableItem(item) {
  return !!getInventoryModKind(item) && !!String(item?.sourcePath || "").trim();
}

function hasInventoryMods(item) {
  return Array.isArray(item?.addons) && item.addons.length > 0;
}

function makeInventoryInstanceId() {
  return `inv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

async function readBaseInventoryCostWeight(rowData) {
  const path = String(rowData?.sourcePath || "").trim();
  if (!path) return { cost: String(rowData?.cost ?? ""), weight: String(rowData?.weight ?? "") };

  const file = app.vault.getFiles().find(f => f.path === path);
  if (!file) return { cost: String(rowData?.cost ?? ""), weight: String(rowData?.weight ?? "") };

  const content = await app.vault.read(file);
  const match = content.match(/```statblock([\s\S]*?)```/);
  if (!match) return { cost: String(rowData?.cost ?? ""), weight: String(rowData?.weight ?? "") };

  const block = match[1];
  const costMatch = block.match(/^\s*cost:\s*(.+)$/im);
  const weightMatch = block.match(/^\s*weight:\s*(.+)$/im);
  return {
    cost: costMatch ? costMatch[1].trim().replace(/"/g, "") : String(rowData?.cost ?? ""),
    weight: weightMatch ? weightMatch[1].trim().replace(/"/g, "") : String(rowData?.weight ?? "")
  };
}

async function recalcInventoryItemFromSources(rowData) {
  if (!rowData || !isInventoryModdableItem(rowData)) return;

  const base = await readBaseInventoryCostWeight(rowData);
  const kind = getInventoryModKind(rowData);
  const addons = Array.isArray(rowData.addons) ? rowData.addons : [];

  const effectiveBaseCost = (
    rowData.baseCostOverride !== undefined &&
    rowData.baseCostOverride !== null &&
    String(rowData.baseCostOverride).trim() !== ""
  ) ? rowData.baseCostOverride : base.cost;

  const baseCostNum = parseFirstNumber(effectiveBaseCost);
  const baseWeightNum = parseItemWeight(base.weight);
  let costDelta = 0;
  let weightDelta = 0;

  if (kind === "weapon") {
    const defs = await fetchWeaponAddonData();
    for (const addon of addons) {
      const def = defs.find(x => x.id === addon.id);
      if (!def) continue;
      costDelta += parseFirstNumber(def.cost) || 0;
      weightDelta += parseItemWeight(def.weight);
      // Keep only lightweight instance metadata current.
      addon.link = def.link;
      addon.type = def.type;
    }
  } else {
    const defs = await fetchArmorAddonData(kind === "powerArmor");
    const prefixes = addons.filter(mod => mod.type === "legendary").map(mod => {
      const def = defs.find(definition => definition.id === mod.id) || mod;
      return def.namePrefix || def.displayName || def.basename || String(def.id || "").split("/").pop().replace(/\.md$/i, "");
    }).filter(Boolean);
    const baseName = sourceDisplayName({sourcePath:rowData.sourcePath || "",yamlName:rowData.yamlName || "",rawLink:rowData.name || "",fallbackName:"Apparel"});
    rowData.generatedName = [...prefixes,baseName].join(" ");
    for (const addon of addons) {
      const def = defs.find(x => x.id === addon.id);
      if (!def) continue;
      costDelta += Number(def.deltas?.cost || 0);
      weightDelta += Number(def.deltas?.weight || 0);
      addon.link = def.link;
      addon.type = def.type;
    }
  }

  if (baseCostNum !== null) rowData.cost = formatWeightNumber(baseCostNum + costDelta);
  else rowData.cost = base.cost;

  if (!addons.length) {
    rowData.weight = base.weight;
    if (!rowData.powerArmorState && !vkArmorHasBreaking(rowData) && !rowData.instanceName) delete rowData.instanceId;
    else if (!rowData.instanceId) rowData.instanceId = makeInventoryInstanceId();
  } else {
    rowData.weight = formatWeightNumber(Math.max(0, baseWeightNum + weightDelta));
    if (!rowData.instanceId) rowData.instanceId = makeInventoryInstanceId();
    rowData.qty = "1";
  }
}

function splitInventoryItemForMod(rowData, rowIdx, data) {
  const qty = Math.max(1, parseInt(rowData?.qty ?? "1", 10) || 1);
  if (qty <= 1) {
    if (!rowData.instanceId) rowData.instanceId = makeInventoryInstanceId();
    rowData.qty = "1";
    if (!Array.isArray(rowData.addons)) rowData.addons = [];
    return rowData;
  }

  rowData.qty = String(qty - 1);
  const target = JSON.parse(JSON.stringify(rowData));
  target.qty = "1";
  target.addons = [];
  target.instanceId = makeInventoryInstanceId();
  data.splice(rowIdx + 1, 0, target);
  return target;
}

function makeInventoryAddonLink(linkText) {
  const span = document.createElement("span");
  span.innerHTML = String(linkText || "").replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
  return span;
}

function openInventoryModPicker({ rowData, rowIdx, data, saveAndRender }) {
  const kind = getInventoryModKind(rowData);
  if (!kind) return;

  const overlay = document.createElement("div");
    overlay.classList.add("vk-modal-overlay");
  overlay.style = `position:fixed;inset:0;background:rgba(30,40,50,0.70);z-index:99999;display:flex;align-items:center;justify-content:center;`;
  const modal = document.createElement("div");
    modal.classList.add("vk-modal");
  modal.style = `background:#172a3b;padding:16px;border-radius:12px;border:3px solid #ffc200;min-width:360px;max-width:92vw;`;
  const title = document.createElement("div");
  title.textContent = kind === "weapon" ? "Add Inventory Weapon Mod" : "Add Inventory Armor Mod";
  title.style = "color:#ffc200;font-weight:bold;margin-bottom:10px;text-align:center;";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search mods / legendary...";
  input.style = `width:100%;padding:7px;border-radius:6px;border:1.5px solid #ffc200;background:#fde4c9;color:#000;caret-color:#000;margin-bottom:10px;`;
  const results = document.createElement("div");
  results.style = "background:#10283a;border-radius:8px;max-height:280px;overflow:auto;border:1px solid rgba(255,194,0,.32);color:#f4ead5;";
  const close = document.createElement("button");
  close.textContent = "Close";
  close.style = "display:block;margin:10px auto 0;background:#172a3b;color:#ffc200;font-weight:bold;padding:6px 16px;border-radius:6px;border:2px solid #ffc200;cursor:pointer;";
  close.onclick = () => document.body.removeChild(overlay);
  modal.append(title, input, results, close);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  input.focus();

  const renderResults = async () => {
    const q = input.value.trim().toLowerCase();
    const defs = kind === "weapon"
      ? await fetchWeaponAddonData()
      : await fetchArmorAddonData(kind === "powerArmor");
    const filtered = defs
      .filter(x => !q || String(x.basename || "").toLowerCase().includes(q))
      .sort((a,b) => ((a.type === "mod" ? 0 : 1) - (b.type === "mod" ? 0 : 1)) || String(a.basename).localeCompare(String(b.basename)));

    results.innerHTML = "";
    filtered.forEach((def, idx) => {
      const r = document.createElement("div");
      r.style = `padding:8px 10px;cursor:pointer;display:flex;justify-content:space-between;gap:16px;border-bottom:${idx < filtered.length - 1 ? "1px solid rgba(244,234,213,.12)" : "none"};`;
      const left = document.createElement("div"); left.textContent = def.displayName || def.basename;
      const right = document.createElement("div"); right.style.color = "#c8d6df"; right.style.opacity = ".9"; right.style.textAlign = "right";
      if (kind === "weapon") right.textContent = `Cost ${def.cost || "+0"}  Wt ${def.weight || "+0"}`;
      else if (def.type === "legendary") right.textContent = "Legendary";
      else right.textContent = `Val ${Number(def.deltas?.cost || 0) >= 0 ? "+" : ""}${Number(def.deltas?.cost || 0)}  Wt ${Number(def.deltas?.weight || 0) >= 0 ? "+" : ""}${Number(def.deltas?.weight || 0)}`;
      r.onmouseover = () => r.style.background = "#203d55";
      r.onmouseout = () => r.style.background = "";
      r.onclick = async () => {
        let target = rowData;
        if (!hasInventoryMods(rowData) && (parseInt(rowData.qty ?? "1", 10) || 1) > 1) {
          target = splitInventoryItemForMod(rowData, rowIdx, data);
        } else {
          if (!target.instanceId) target.instanceId = makeInventoryInstanceId();
          target.qty = "1";
          if (!Array.isArray(target.addons)) target.addons = [];
        }
        if (target.addons.some(x => x.id === def.id)) return;
        target.addons.push({ id: def.id, link: def.link, type: def.type });
        await recalcInventoryItemFromSources(target);
        saveAndRender();
        document.body.removeChild(overlay);
      };
      r.append(left, right);
      results.appendChild(r);
    });
  };

  input.addEventListener("input", debounce(renderResults, 150));
  renderResults();
}

function renderInventoryModsRow(rowData, rowIdx, data, visibleColumnCount, saveAndRender) {
  const tr = document.createElement("tr");
  tr.classList.add("inventory-mods-row", "vk-secondary-detail-row");
  const td = document.createElement("td");
  td.classList.add("vk-secondary-detail-cell");
  td.colSpan = visibleColumnCount;
  td.style = "padding:6px 10px;background:#383838ab;text-align:left;";

  const label = document.createElement("span");
  label.textContent = "Mods: ";
  label.style.color = "#efdd6f";
  // Workbench action lives in the inventory Actions column.
  const wrap = document.createElement("span");
  wrap.style = "display:inline-flex;flex-wrap:wrap;gap:8px;align-items:center;";

  const addons = Array.isArray(rowData.addons) ? rowData.addons : [];
  if (!addons.length) {
    const none = document.createElement("span");
    none.textContent = "None";
    none.style = "color:#c5c5c5;opacity:.6;";
    wrap.appendChild(none);
  } else {
    addons.forEach(addon => {
      const chip = document.createElement("span");
      chip.style = "display:inline-flex;align-items:center;gap:4px;";
      {
        const modHolder = document.createElement("span");
        appendSourceWikiLink(
          modHolder,
          addon.link || "",
          "Mod",
          String(addon.id || "").endsWith(".md") ? String(addon.id) : "",
          "",
          ""
        );
        vkApplyWeaponModAlias(modHolder, rowData, addon);
        chip.appendChild(modHolder);
      }
      wrap.appendChild(chip);
    });
  }

  label.textContent = "Mods: ";
  td.append(label,wrap);
  tr.appendChild(td);
  return tr;
}


// ---- EQUIP / UNEQUIP HELPERS ----

function lightweightInventoryAddons(addons) {
  return (Array.isArray(addons) ? addons : []).map(a => ({
    id: a.id,
    link: a.link,
    type: a.type
  })).filter(a => a.id);
}

function getGearRows() {
  try { return JSON.parse(localStorage.getItem(GEAR_STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function saveGearRows(rows) {
  localStorage.setItem(GEAR_STORAGE_KEY, JSON.stringify(rows));
  window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
  if (typeof updateCarryWeightDisplay === "function") updateCarryWeightDisplay();
}

function mergeInventoryRecord(rows, item) {
  const copy = JSON.parse(JSON.stringify(item));
  const unique = vkWeaponCondition(copy).status!=="normal" || !!copy.instanceId || hasInventoryMods(copy) || isChargeTrackedCore(copy) || !!copy.powerArmorState || vkArmorHasBreaking(copy);
  if (unique) {
    copy.qty = isChargeTrackedCore(copy) ? String((copy.chargeUnits || []).length) : "1";
    rows.push(copy);
    return;
  }
  const id = getItemIdentity(copy);
  const existing = rows.find(r => !r.instanceId && !hasInventoryMods(r) && !isChargeTrackedCore(r) && !r.powerArmorState && !vkArmorHasBreaking(r) && getItemIdentity(r) === id);
  if (existing) existing.qty = String((parseInt(existing.qty ?? 0, 10) || 0) + 1);
  else { copy.qty = "1"; rows.push(copy); }
}

async function fullWeaponAddonsFromInventory(addons) {
  const defs = await fetchWeaponAddonData();
  return lightweightInventoryAddons(addons).map(a => {
    const def = defs.find(d => d.id === a.id);
    return def ? JSON.parse(JSON.stringify(def)) : a;
  });
}

async function equipWeaponFromInventory(rowData) {
  const sourcePath = String(rowData?.sourcePath || "").trim();
  const defs = await fetchWeaponData();
  const base = defs.find(w => w.sourcePath === sourcePath);
  if (!base) throw new Error("Could not find the weapon source file.");

  const equipped = JSON.parse(JSON.stringify(base));
  equipped.link = rowData.name || base.link;
  equipped.name = stripWikiLink(rowData.name || base.link || base.name || "Weapon");
  equipped.sourcePath = sourcePath;
  equipped.instanceId = rowData.instanceId || makeInventoryInstanceId();
  if (rowData.instanceName) equipped.instanceName = normalizeInstanceName(rowData.instanceName);
  if (rowData.baseCostOverride !== undefined) equipped.baseCostOverride = rowData.baseCostOverride;
  equipped.addons = await fullWeaponAddonsFromInventory(rowData.addons);
  if(rowData.selectedAmmoPath)equipped.selectedAmmoPath=rowData.selectedAmmoPath;
  if(vkWeaponCondition(rowData).status!=="normal")equipped.weaponCondition=structuredClone(rowData.weaponCondition);
  ensureWeaponBaseSnapshot(equipped);
  if (equipped.baseCostOverride !== undefined && equipped.baseWeapon) {
    equipped.baseWeapon.cost = String(equipped.baseCostOverride);
  }
  recalcWeaponFromAddons(equipped);
  await vkRefreshWeaponGeneratedName(equipped);

  if (typeof calculateWeaponStats === "function" && equipped.type) {
    const stats = calculateWeaponStats(equipped.type);
    equipped.TN = stats.TN;
    equipped.Tag = stats.Tag;
  }

  if (getWeaponChargedCoreType(equipped)) {
    const selection = await showWeaponCorePicker(equipped, { actionLabel: "Prepare", allowNone: true });
    if (selection.cancelled) return false;
    equipped.loadedCore = selection.loadedCore;
  } else {
    delete equipped.loadedCore;
  }

  const weapons = JSON.parse(localStorage.getItem("fallout_weapon_table") || "[]");
  const consumable = isConsumableWeapon(equipped);
  if (consumable) {
    equipped.consumableRef = true;
    if (rowData.instanceId) equipped.consumableInventoryId = String(rowData.instanceId);
    if (weapons.some(w=>w.consumableRef && String(w.sourcePath || "")===sourcePath && String(w.consumableInventoryId || "")===String(equipped.consumableInventoryId || "") && consumableModKey(w)===consumableModKey(equipped))) return "consumable";
  }
  weapons.push(equipped);
  localStorage.setItem("fallout_weapon_table", JSON.stringify(weapons));
  if (typeof updateWeaponTableDOM === "function") updateWeaponTableDOM();
  return consumable ? "consumable" : true;
}

async function unequipWeaponToInventory(rowData) {
  const addons = lightweightInventoryAddons(rowData.addons);
  const item = {
    name: rowData.link || `[[${rowData.name || "Weapon"}]]`,
    yamlName: rowData.baseWeapon?.link ? stripWikiLink(rowData.baseWeapon.link) : stripWikiLink(rowData.link || rowData.name || ""),
    sourcePath: rowData.sourcePath || "",
    qty: "1",
    cost: String(rowData.cost ?? ""),
    weight: String(rowData.weight ?? ""),
    selected: false,
    category: "WEAPONS",
    addons
  };
  if(rowData.selectedAmmoPath)item.selectedAmmoPath=rowData.selectedAmmoPath;
  if (rowData.instanceId) item.instanceId = rowData.instanceId;
  else if (addons.length || vkWeaponCondition(rowData).status!=="normal") item.instanceId = makeInventoryInstanceId();
  if(vkWeaponCondition(rowData).status!=="normal")item.weaponCondition=structuredClone(rowData.weaponCondition);
  if (rowData.instanceName) item.instanceName = normalizeInstanceName(rowData.instanceName);
  await vkRefreshWeaponGeneratedName(item);
  if (rowData.baseCostOverride !== undefined) item.baseCostOverride = rowData.baseCostOverride;
  await recalcInventoryItemFromSources(item);
  const rows = getGearRows();
  mergeInventoryRecord(rows, item);
  saveGearRows(rows);
}

async function findArmorDefinitionForInventory(rowData, section) {
  const sourcePath = String(rowData?.sourcePath || "").trim();
  const defs = await fetchArmorData(section);
  let def = defs.find(a => a.sourcePath === sourcePath);
  if (def) return def;
  const sourceBase = sourcePath.split("/").pop()?.replace(/\.md$/i, "");
  return defs.find(a => a.link === sourceBase || a.link === stripWikiLink(rowData?.name || "")) || null;
}

async function getCompatibleArmorSections(rowData) {
  const sourcePath = String(rowData?.sourcePath || "").trim();
  if (!sourcePath || sourcePath.includes("/Power Armor/")) return [];
  const file = app.vault.getFiles().find(f => f.path === sourcePath);
  if (!file) return [];
  const content = await app.vault.read(file);
  const match = content.match(/```statblock([\s\S]*?)```/);
  if (!match) return [];
  const loc = match[1].match(/^\s*locations:\s*["']?([^\n\r"']+)["']?\s*$/im);
  const locations = loc ? loc[1].trim() : "";
  return ARMOR_SECTIONS.filter(section => matchesSection(locations, section));
}

async function fullArmorAddonsFromInventory(addons) {
  const defs = await fetchArmorAddonData(false);
  return vkApparelStoredAddons(lightweightInventoryAddons(addons).map(a => {
    const def = defs.find(d => d.id === a.id);
    return def ? JSON.parse(JSON.stringify(def)) : a;
  }));
}

async function armorStoredToInventory(stored, section) {
  if (!stored || !String(stored.apparel || "").trim()) return null;
  let sourcePath = String(stored.sourcePath || "").trim();
  if (!sourcePath) {
    const displayed = stripWikiLink(stored.apparel || "");
    const file = app.vault.getFiles().find(f =>
      f.path.startsWith("Fallout-RPG/Items/Apparel") && f.basename === displayed
    );
    sourcePath = file?.path || "";
  }
  const addons = lightweightInventoryAddons(stored.addons);
  const item = {
    name: stored.apparel,
    yamlName: sourcePath.split("/").pop()?.replace(/\.md$/i, "") || stripWikiLink(stored.apparel),
    sourcePath,
    qty: "1",
    cost: String(stored.value ?? ""),
    weight: String(stored.weight ?? ""),
    selected: false,
    category: "APPAREL",
    breaking: vkArmorBreaking(stored),
    addons
  };
  if (stored.instanceId) item.instanceId = stored.instanceId;
  else if (addons.length || vkArmorHasBreaking(stored)) item.instanceId = makeInventoryInstanceId();
  if (stored.instanceName) item.instanceName = stored.instanceName;
  if (stored.generatedName) item.generatedName = stored.generatedName;
  if (stored.baseCostOverride !== undefined) item.baseCostOverride = stored.baseCostOverride;
  await recalcInventoryItemFromSources(item);
  return item;
}

async function unequipArmorSectionToInventory(section) {
  const stored = loadArmorData(section);
  const item = await armorStoredToInventory(stored, section);
  if (!item) return false;
  const rows = getGearRows();
  mergeInventoryRecord(rows, item);
  saveGearRows(rows);
  const blank = { physdr:"", raddr:"", endr:"", hp:"", apparel:"", value:"", weight:"", sourcePath:"", instanceId:"", base:null, addons:[] };
  saveArmorData(section, blank);
  return true;
}

function showArmorSlotPicker(rowData, sections, onPick) {
  const overlay = document.createElement("div");
    overlay.classList.add("vk-modal-overlay");
  overlay.style = "position:fixed;inset:0;background:rgba(30,40,50,.82);z-index:99999;display:flex;align-items:center;justify-content:center;";
  const modal = document.createElement("div");
    modal.classList.add("vk-modal");
  modal.style = "background:#172a3b;padding:18px;border-radius:12px;border:3px solid #ffc200;min-width:320px;max-width:92vw;";
  const title = document.createElement("div");
  title.textContent = `Equip ${stripWikiLink(rowData.name || "Armor")}`;
  title.style = "color:#ffc200;font-weight:bold;text-align:center;margin-bottom:12px;";
  modal.appendChild(title);
  const list = document.createElement("div");
  list.style = "display:flex;flex-direction:column;gap:7px;";
  sections.forEach(section => {
    const btn = document.createElement("button");
    const occupied = !!String(loadArmorData(section).apparel || "").trim();
    btn.textContent = occupied ? `${section} (replace equipped item)` : section;
    btn.style = "background:#fde4c9;color:#214a72;border:1px solid #ffc200;border-radius:6px;padding:7px 12px;cursor:pointer;font-weight:bold;";
    btn.onclick = async () => {
      document.body.removeChild(overlay);
      await onPick(section);
    };
    list.appendChild(btn);
  });
  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.style = "display:block;margin:12px auto 0;background:#172a3b;color:#ffc200;border:2px solid #ffc200;border-radius:6px;padding:6px 16px;cursor:pointer;";
  cancel.onclick = () => document.body.removeChild(overlay);
  modal.append(list, cancel);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

async function equipArmorFromInventory(rowData, section) {
  const def = await findArmorDefinitionForInventory(rowData, section);
  if (!def) throw new Error("Could not find the armor source file for that slot.");

  const occupied = loadArmorData(section);
  const displacedItem = String(occupied.apparel || "").trim()
    ? await armorStoredToInventory(occupied, section)
    : null;

  const stored = {
    breaking: vkArmorBreaking(rowData),
    physdr: def.physdr,
    raddr: def.raddr,
    endr: def.endr,
    apparel: rowData.name || `[[${def.link}]]`,
    sourcePath: rowData.sourcePath || def.sourcePath || "",
    instanceId: rowData.instanceId || (hasInventoryMods(rowData) ? makeInventoryInstanceId() : ""),
    instanceName: rowData.instanceName || "",
    generatedName: rowData.generatedName || "",
    baseCostOverride: rowData.baseCostOverride,
    value: rowData.baseCostOverride !== undefined ? String(rowData.baseCostOverride) : (def.value ?? "0"),
    weight: def.weight ?? "0",
    base: { physdr:def.physdr, endr:def.endr, raddr:def.raddr, value:def.value ?? "0", weight:def.weight ?? "0" },
    addons: await fullArmorAddonsFromInventory(rowData.addons)
  };
  recalcArmorFromAddons(stored, false);
  saveArmorData(section, stored);
  const oldCard = document.querySelector(`.armor-card[data-section="${section}"]`);
  if (oldCard) oldCard.replaceWith(renderArmorCard(section));

  return displacedItem;
}


async function findPowerArmorDefinitionForInventory(rowData, section) {
  const sourcePath = String(rowData?.sourcePath || "").trim();
  const defs = await fetchPowerArmorData(section);
  let def = defs.find(a => a.sourcePath === sourcePath);
  if (def) return def;
  const sourceBase = sourcePath.split("/").pop()?.replace(/\.md$/i, "");
  return defs.find(a => a.link === sourceBase || a.link === stripWikiLink(rowData?.name || "")) || null;
}

async function getCompatiblePowerArmorSections(rowData) {
  const sourcePath = String(rowData?.sourcePath || "").trim();
  if (!sourcePath || !sourcePath.includes("/Power Armor/")) return [];
  const file = app.vault.getFiles().find(f => f.path === sourcePath);
  if (!file) return [];
  const content = await app.vault.read(file);
  const match = content.match(/```statblock([\s\S]*?)```/);
  if (!match) return [];
  const loc = match[1].match(/^\s*locations:\s*["']?([^\n\r"']+)["']?\s*$/im);
  const locations = loc ? loc[1].trim() : "";
  return PA_ARMOR_SECTIONS.filter(section => matchesPowerArmorSection(locations, section));
}

async function fullPowerArmorAddonsFromInventory(addons) {
  const defs = await fetchArmorAddonData(true);
  return vkApparelStoredAddons(lightweightInventoryAddons(addons).map(a => {
    const def = defs.find(d => d.id === a.id);
    return def ? JSON.parse(JSON.stringify(def)) : a;
  }));
}

async function powerArmorStoredToInventory(stored, section) {
  if (!stored || !String(stored.apparel || "").trim()) return null;

  let sourcePath = String(stored.sourcePath || "").trim();
  if (!sourcePath) {
    const displayed = stripWikiLink(stored.apparel || "");
    const file = app.vault.getFiles().find(f =>
      f.path.startsWith("Fallout-RPG/Items/Apparel/Power Armor") && f.basename === displayed
    );
    sourcePath = file?.path || "";
  }

  const addons = lightweightInventoryAddons(stored.addons);
  const item = {
    name: stored.apparel,
    yamlName: sourcePath.split("/").pop()?.replace(/\.md$/i, "") || stripWikiLink(stored.apparel),
    sourcePath,
    qty: "1",
    cost: String(stored.value ?? ""),
    weight: String(stored.weight ?? ""),
    selected: false,
    category: "APPAREL",
    breaking: vkArmorBreaking(stored),
    addons,
    powerArmorState: { hp: String(stored.hp ?? "") }
  };

  if (stored.instanceId) item.instanceId = stored.instanceId;
  else item.instanceId = makeInventoryInstanceId();
  if (stored.instanceName) item.instanceName = stored.instanceName;
  if (stored.generatedName) item.generatedName = stored.generatedName;
  if (stored.baseCostOverride !== undefined) item.baseCostOverride = stored.baseCostOverride;

  await recalcInventoryItemFromSources(item);
  return item;
}

async function unequipPowerArmorSectionToInventory(section) {
  const stored = loadPowerArmorData(section);
  const item = await powerArmorStoredToInventory(stored, section);
  if (!item) return false;

  const rows = getGearRows();
  mergeInventoryRecord(rows, item);
  saveGearRows(rows);

  savePowerArmorData(section, {
    physdr:"", raddr:"", endr:"", hp:"", apparel:"", value:"", weight:"",
    sourcePath:"", instanceId:"", base:null, addons:[], hpManual:false, maxHp:null
  });
  return true;
}

function showPowerArmorSlotPicker(rowData, sections, onPick) {
  const overlay = document.createElement("div");
    overlay.classList.add("vk-modal-overlay");
  overlay.style = "position:fixed;inset:0;background:rgba(30,40,50,.82);z-index:99999;display:flex;align-items:center;justify-content:center;";
  const modal = document.createElement("div");
    modal.classList.add("vk-modal");
  modal.style = "background:#172a3b;padding:18px;border-radius:12px;border:3px solid #ffc200;min-width:320px;max-width:92vw;";
  const title = document.createElement("div");
  title.textContent = `Equip ${stripWikiLink(rowData.name || "Power Armor")}`;
  title.style = "color:#ffc200;font-weight:bold;text-align:center;margin-bottom:12px;";
  modal.appendChild(title);

  const list = document.createElement("div");
  list.style = "display:flex;flex-direction:column;gap:7px;";
  sections.forEach(section => {
    const btn = document.createElement("button");
    const occupied = !!String(loadPowerArmorData(section).apparel || "").trim();
    btn.textContent = occupied ? `${section} (replace equipped item)` : section;
    btn.style = "background:#fde4c9;color:#214a72;border:1px solid #ffc200;border-radius:6px;padding:7px 12px;cursor:pointer;font-weight:bold;";
    btn.onclick = async () => {
      document.body.removeChild(overlay);
      await onPick(section);
    };
    list.appendChild(btn);
  });

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.style = "display:block;margin:12px auto 0;background:#172a3b;color:#ffc200;border:2px solid #ffc200;border-radius:6px;padding:6px 16px;cursor:pointer;";
  cancel.onclick = () => document.body.removeChild(overlay);
  modal.append(list, cancel);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

async function equipPowerArmorFromInventory(rowData, section) {
  const def = await findPowerArmorDefinitionForInventory(rowData, section);
  if (!def) throw new Error("Could not find the Power Armor source file for that slot.");

  const occupied = loadPowerArmorData(section);
  const displacedItem = String(occupied.apparel || "").trim()
    ? await powerArmorStoredToInventory(occupied, section)
    : null;

  const hasSavedHp = rowData?.powerArmorState && rowData.powerArmorState.hp !== undefined && rowData.powerArmorState.hp !== null;
  const savedHp = hasSavedHp ? String(rowData.powerArmorState.hp) : String(def.hp ?? "");

  const stored = {
    breaking: vkArmorBreaking(rowData),
    physdr: def.physdr,
    raddr: def.raddr,
    endr: def.endr,
    hp: savedHp,
    apparel: rowData.name || `[[${def.link}]]`,
    sourcePath: rowData.sourcePath || def.sourcePath || "",
    instanceId: rowData.instanceId || makeInventoryInstanceId(),
    instanceName: rowData.instanceName || "",
    generatedName: rowData.generatedName || "",
    baseCostOverride: rowData.baseCostOverride,
    value: rowData.baseCostOverride !== undefined ? String(rowData.baseCostOverride) : (def.value ?? "0"),
    weight: def.weight ?? "0",
    base: {
      physdr: def.physdr,
      endr: def.endr,
      raddr: def.raddr,
      hp: def.hp ?? "",
      value: def.value ?? "0",
      weight: def.weight ?? "0"
    },
    addons: await fullPowerArmorAddonsFromInventory(rowData.addons),
    hpManual: hasSavedHp,
    maxHp: null
  };

  recalcArmorFromAddons(stored, true);
  if (hasSavedHp) stored.hp = savedHp;
  savePowerArmorData(section, stored);

  // Refresh the visible Power Armor card immediately after equipping/swapping.
  const visibleCard = Array.from(document.querySelectorAll(".armor-card"))
    .find(el => el.dataset.powerArmorSection === section);
  if (visibleCard) visibleCard.replaceWith(renderPowerArmorCard(section));

  return displacedItem;
}


function removeEquippedInventoryUnit(data, rowData, rowIdx) {
  const qty = Math.max(1, parseInt(rowData?.qty ?? 1, 10) || 1);
  const isStack = qty > 1 && !rowData?.instanceId && !hasInventoryMods(rowData) && !rowData?.powerArmorState && !vkArmorHasBreaking(rowData);

  if (isStack) {
    rowData.qty = String(qty - 1);
    return;
  }

  // Prefer object identity because async slot selection can allow the table to
  // rerender/sort before the user picks the destination slot.
  let index = data.indexOf(rowData);

  if (index < 0 && rowData?.instanceId) {
    index = data.findIndex(item =>
      String(item?.instanceId || "") === String(rowData.instanceId)
    );
  }

  if (index < 0) {
    const identity = getItemIdentity(rowData);
    index = data.findIndex(item => getItemIdentity(item) === identity);
  }

  if (index < 0 && rowIdx >= 0 && rowIdx < data.length) {
    index = rowIdx;
  }

  if (index >= 0) data.splice(index, 1);
}

async function equipInventoryItem(rowData, rowIdx, data, saveAndRender) {
  const kind = getInventoryModKind(rowData);
  if (kind === "weapon") {
    const didEquip = await equipWeaponFromInventory(rowData);
    if (!didEquip) return;
    if (didEquip !== "consumable") removeEquippedInventoryUnit(data, rowData, rowIdx);
    saveAndRender();
    showSheetNotice(`Prepared ${vkWeaponDisplayName(rowData)}.`);
    return;
  }
  if (kind === "armor") {
    const sections = await getCompatibleArmorSections(rowData);
    if (!sections.length) { showSheetNotice("No compatible armor slot found for this item.", 3000); return; }
    showArmorSlotPicker(rowData, sections, async section => {
      try {
        const displacedItem = await equipArmorFromInventory(rowData, section);

        removeEquippedInventoryUnit(data, rowData, rowIdx);
        if (displacedItem) mergeInventoryRecord(data, displacedItem);

        saveAndRender();
        showSheetNotice(`Equipped ${stripWikiLink(rowData.name || "armor")} to ${section}.`);
      } catch (err) {
        console.error(err);
        showSheetNotice(String(err?.message || err), 3500);
      }
    });
    return;
  }
  if (kind === "powerArmor") {
    const sections = await getCompatiblePowerArmorSections(rowData);
    if (!sections.length) { showSheetNotice("No compatible Power Armor slot found for this item.", 3000); return; }
    showPowerArmorSlotPicker(rowData, sections, async section => {
      try {
        const displacedItem = await equipPowerArmorFromInventory(rowData, section);

        removeEquippedInventoryUnit(data, rowData, rowIdx);
        if (displacedItem) mergeInventoryRecord(data, displacedItem);

        saveAndRender();
        showSheetNotice(`Equipped ${stripWikiLink(rowData.name || "Power Armor")} to ${section}.`);
      } catch (err) {
        console.error(err);
        showSheetNotice(String(err?.message || err), 3500);
      }
    });
  }
}

// ---- VEHICLE TRANSFER HELPERS ----

function getItemIdentity(item) {
  const instanceId = String(item?.instanceId || "").trim();
  if (instanceId) return `instance::${instanceId}`;
  const source = String(item?.sourcePath || item?.yamlName || "").trim().toLowerCase();
  const displayName = stripWikiLink(item?.name || item?.link || item?.yamlName || "").trim().toLowerCase();
  return `${source}::${displayName}`;
}

function findVehicleSheets() {
  return app.vault.getMarkdownFiles().filter(file => {
    const fm = app.metadataCache.getFileCache(file)?.frontmatter;
    return String(fm?.Sheet_Type ?? "").trim().toLowerCase() === "vehicle";
  });
}

function getVehicleCargo(file) {
  const fm = app.metadataCache.getFileCache(file)?.frontmatter ?? {};
  return Array.isArray(fm.Vehicle_Cargo) ? JSON.parse(JSON.stringify(fm.Vehicle_Cargo)) : [];
}

async function setVehicleCargo(file, cargo) {
  await app.fileManager.processFrontMatter(file, fm => {
    fm.Vehicle_Cargo = cargo;
  });
}

function mergeItemIntoCargo(cargo, sourceItem, qtyOrUnits) {
  const id = getItemIdentity(sourceItem);
  let existing = cargo.find(item => getItemIdentity(item) === id);
  const core = isChargeTrackedCore(sourceItem);

  if (!existing) {
    existing = JSON.parse(JSON.stringify(sourceItem));
    existing.selected = false;
    if (core) {
      existing.chargeUnits = [];
      existing.qty = "0";
    } else {
      existing.qty = "0";
    }
    cargo.push(existing);
  }

  if (core) {
    if (!Array.isArray(existing.chargeUnits)) existing.chargeUnits = [];
    existing.chargeUnits.push(...JSON.parse(JSON.stringify(qtyOrUnits)));
    existing.qty = String(existing.chargeUnits.length);
  } else {
    existing.qty = String((parseInt(existing.qty ?? 0, 10) || 0) + Number(qtyOrUnits || 0));
  }
}

function showVehicleTransferDialog({ rowData, onTransfer }) {
  const vehicles = findVehicleSheets();
  if (!vehicles.length) {
    showSheetNotice("No vehicle sheets found. Add Sheet_Type: Vehicle to a vehicle note.", 3000);
    return;
  }

  const overlay = document.createElement("div");
    overlay.classList.add("vk-modal-overlay");
  overlay.style = `position:fixed;inset:0;background:rgba(30,40,50,0.86);z-index:9999;display:flex;align-items:center;justify-content:center;`;
  const modal = document.createElement("div");
    modal.classList.add("vk-modal");
  modal.style = `background:#172a3b;padding:22px;border-radius:14px;box-shadow:0 8px 44px #111b2d88;border:3px solid #ffc200;min-width:340px;max-width:95vw;color:#fff;`;

  const title = document.createElement("div");
  title.textContent = `Transfer ${stripWikiLink(rowData.name || rowData.link || "Item")}`;
  title.style = "color:#ffc200;font-weight:bold;font-size:1.2em;text-align:center;margin-bottom:14px;";
  modal.appendChild(title);

  const vehicleRow = document.createElement("label");
  vehicleRow.style = "display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;";
  const vehicleLabel = document.createElement("span");
  vehicleLabel.textContent = "Vehicle:";
  const select = document.createElement("select");
  select.style = "min-width:190px;background:#fde4c9;color:#222;border:1.5px solid #ffc200;border-radius:5px;padding:5px;";
  vehicles.forEach(file => {
    const opt = document.createElement("option");
    opt.value = file.path;
    opt.textContent = file.basename;
    select.appendChild(opt);
  });
  vehicleRow.append(vehicleLabel, select);
  modal.appendChild(vehicleRow);

  let qtyInput = null;
  const selectedCoreIndexes = new Set();
  if (isChargeTrackedCore(rowData)) {
    syncChargeTrackedCoreQty(rowData);
    const help = document.createElement("div");
    help.textContent = "Select the cores to transfer:";
    help.style = "color:#efdd6f;margin-bottom:8px;";
    modal.appendChild(help);
    const unitsWrap = document.createElement("div");
    unitsWrap.style = "display:flex;flex-direction:column;gap:6px;max-height:250px;overflow:auto;margin-bottom:12px;";
    const type = getChargeTrackedCoreType(rowData);
    rowData.chargeUnits.forEach((unit, index) => {
      const label = document.createElement("label");
      label.style = "display:flex;align-items:center;gap:8px;background:#142c3f;padding:6px 8px;border-radius:6px;cursor:pointer;";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.onchange = () => cb.checked ? selectedCoreIndexes.add(index) : selectedCoreIndexes.delete(index);
      const max = type === "plasma" ? 500 : Number(unit.maxCharges ?? 0);
      const txt = document.createElement("span");
      txt.textContent = `${Number(unit.charges ?? 0)} / ${max}`;
      label.append(cb, txt);
      unitsWrap.appendChild(label);
    });
    modal.appendChild(unitsWrap);
  } else {
    const qtyRow = document.createElement("label");
    qtyRow.style = "display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;";
    const qtyLabel = document.createElement("span");
    qtyLabel.textContent = "Quantity:";
    qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = "1";
    qtyInput.max = String(Math.max(1, parseInt(rowData.qty ?? 1, 10) || 1));
    qtyInput.value = "1";
    qtyInput.style = "width:90px;background:#fde4c9;color:#222;border:1.5px solid #ffc200;border-radius:5px;padding:5px;text-align:center;";
    qtyRow.append(qtyLabel, qtyInput);
    modal.appendChild(qtyRow);
  }

  const error = document.createElement("div");
  error.style = "color:#ffb3b3;font-weight:bold;text-align:center;min-height:1.2em;margin-bottom:8px;";
  modal.appendChild(error);

  const buttons = document.createElement("div");
  buttons.style = "display:flex;gap:12px;justify-content:center;";
  const transfer = document.createElement("button");
  transfer.textContent = "Transfer";
  transfer.style = "background:#ffc200;color:#214a72;font-weight:bold;padding:6px 18px;border-radius:6px;border:none;cursor:pointer;";
  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.style = "background:#172a3b;color:#ffc200;font-weight:bold;padding:6px 18px;border-radius:6px;border:2px solid #ffc200;cursor:pointer;";

  transfer.onclick = async () => {
    const vehicle = vehicles.find(v => v.path === select.value);
    if (!vehicle) return;
    if (isChargeTrackedCore(rowData)) {
      if (!selectedCoreIndexes.size) { error.textContent = "Select at least one core."; return; }
      await onTransfer(vehicle, { coreIndexes: [...selectedCoreIndexes].sort((a,b) => a-b) });
    } else {
      const qty = Math.floor(Number(qtyInput.value));
      const max = Math.max(1, parseInt(rowData.qty ?? 1, 10) || 1);
      if (!Number.isFinite(qty) || qty < 1 || qty > max) { error.textContent = `Enter a quantity from 1 to ${max}.`; return; }
      await onTransfer(vehicle, { qty });
    }
    document.body.removeChild(overlay);
  };
  cancel.onclick = () => document.body.removeChild(overlay);
  buttons.append(transfer, cancel);
  modal.appendChild(buttons);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// ---- Table columns for gear ----
function getGearStackQty(rowData) {
  if (isChargeTrackedCore(rowData)) {
    return Math.max(0, Array.isArray(rowData?.chargeUnits) ? rowData.chargeUnits.length : 0);
  }
  return Math.max(1, parseInt(rowData?.qty ?? "1", 10) || 1);
}

function getGearStackCost(rowData) {
  const unitCost = parseFirstNumber(rowData?.cost);
  if (unitCost === null) return null;
  return unitCost * getGearStackQty(rowData);
}

function getGearStackWeight(rowData) {
  return parseItemWeight(rowData?.weight) * getGearStackQty(rowData);
}

const gearColumns = [
  { label: "Name", key: "name", type: "link" },
  { label: "Qty", key: "qty", type: "number" },
  { label: "Cost", key: "cost", type: "text", totalSortValue: getGearStackCost },
  { label: "Weight", key: "weight", type: "text", totalSortValue: getGearStackWeight },
  { label: "Category", key: "category", type: "text" },

  // NEW hidden field
  { label: "yamlName", key: "yamlName", type: "text", hidden: true },

  { label: "Actions", key: "actions", type: "actions" },
];

function parseFirstNumber(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const m = s.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

function formatGearCostDisplay(rowData) {
  const conditionView=vkWeaponConditionView(rowData);rowData=conditionView;
  const baseRaw = String(rowData?.cost ?? "").trim();
  const qty = Math.max(1, parseInt(rowData?.qty ?? "1", 10) || 1);

  const baseNum = parseFirstNumber(baseRaw);
  if (baseNum === null) {
    const span = document.createElement("span");
    span.textContent = baseRaw;
    return span;
  }

  const total = baseNum * qty;

  const container = document.createElement("span");

  const baseSpan = document.createElement("span");
  baseSpan.textContent = baseNum;
  container.appendChild(baseSpan);

  const totalSpan = document.createElement("span");
  totalSpan.textContent = ` (${total})`;

  // 👇 THIS is the equivalent of input.style.color
  totalSpan.style.color = "#9fb0bb";
  totalSpan.style.fontSize = "0.90em";
  totalSpan.style.opacity = "0.8";
  totalSpan.style.marginLeft = "2px";

  container.appendChild(totalSpan);
  vkMarkWeaponStat(container,conditionView,"cost");
  return container;
}


function formatGearWeightDisplay(rowData) {
  const conditionView=vkWeaponConditionView(rowData);rowData=conditionView;
  const baseRaw = String(rowData?.weight ?? "").trim();
  const qty = isChargeTrackedCore(rowData)
    ? Math.max(0, Array.isArray(rowData?.chargeUnits) ? rowData.chargeUnits.length : 0)
    : Math.max(1, parseInt(rowData?.qty ?? "1", 10) || 1);
  const total = parseItemWeight(baseRaw) * qty;
  const container = document.createElement("span");
  const baseSpan = document.createElement("span");
  baseSpan.textContent = baseRaw || "0";
  container.appendChild(baseSpan);
  const totalSpan = document.createElement("span");
  totalSpan.textContent = ` (${formatWeightNumber(total)})`;
  totalSpan.style.color = "#9fb0bb";
  totalSpan.style.fontSize = "0.90em";
  totalSpan.style.opacity = "0.8";
  totalSpan.style.marginLeft = "2px";
  container.appendChild(totalSpan);
  vkMarkWeaponStat(container,conditionView,"weight");
  return container;
}



// ---- GEAR TABLE SECTION ----
function renderGearCategoryTable(rowFilter, showCategory = false) {
  return createEditableTable({
    columns: showCategory ? gearColumns : gearColumns.filter(col => col.key !== "category"),
    storageKey: GEAR_STORAGE_KEY,
    fetchItems: null,
    rowFilter,
    cellOverrides: {
      name: ({ rowData, col, saveAndRender }) => {
        const td = document.createElement("td");
        td.style.textAlign = "center";
        td.style.cursor = "text";

        const sourceRaw = rowData?.name || "";
        const sourceName = sourceDisplayName({
          sourcePath: rowData?.sourcePath || "",
          yamlName: rowData?.yamlName || "",
          rawLink: sourceRaw,
          fallbackName: "Item"
        });
        const customName = normalizeInstanceName(rowData?.instanceName || "");
        let visibleName = getInventoryModKind(rowData) === "weapon" ? vkWeaponDisplayName(rowData, sourceName) : customName || normalizeInstanceName(rowData.generatedName) || sourceName;

        const linkWrap = document.createElement("span");
        appendSourceWikiLink(
          linkWrap,
          sourceRaw,
          sourceName,
          rowData?.sourcePath || "",
          rowData?.yamlName || "",
          visibleName
        );
        if (getInventoryModKind(rowData) === "weapon" && !customName && (rowData.addons || []).length) {
          const copy = structuredClone(rowData);
          vkRefreshWeaponGeneratedName(copy).then(() => {
            const link = linkWrap.querySelector("a");
            if (link && linkWrap.isConnected) { visibleName=vkWeaponDisplayName(copy,sourceName);link.textContent=visibleName; }
          }).catch(err=>console.warn("Vault-Kit: could not refresh inventory weapon name",err));
        }

        const beginEdit = () => {
          if (td.querySelector("input")) return;

          const input = document.createElement("input");
          input.type = "text";
          input.value = visibleName;
          input.style.width = "95%";
          input.style.backgroundColor = "#fde4c9";
          input.style.color = "black";
          input.style.caretColor = "black";

          const saveName = () => {
            const next = normalizeInstanceName(input.value);
            if (next && next !== sourceName) rowData.instanceName = next;
            else delete rowData.instanceName;
            saveAndRender();
          };

          input.onblur = saveName;
          input.onkeydown = (e) => {
            if (e.key === "Enter" || e.key === "Escape") input.blur();
          };

          td.innerHTML = "";
          td.appendChild(input);
          input.focus();
          input.select();
        };

        td.onclick = (event) => {
          if (event.target.closest?.("a.internal-link") || event.target.tagName === "INPUT") return;
          beginEdit();
        };

        td.title = "Click the name to open its source note; click empty space in this cell to rename it.";
        td.appendChild(linkWrap);
        return td;
      },

      qty: ({ rowData, col, saveAndRender }) => {
        if (hasInventoryMods(rowData) || rowData.instanceId) {
          rowData.qty = "1";
          const td = document.createElement("td");
          td.style.textAlign = "center";
          const qty = document.createElement("span");
          qty.textContent = "1";
          qty.style.fontWeight = "bold";
          qty.style.color = "#dce6eb";
          qty.title = "Modded inventory items are tracked individually";
          td.appendChild(qty);
          return td;
        }

        if (!isChargeTrackedCore(rowData)) {
          return createEditableCell({
            rowData,
            col,
            onChange: (val) => {
              rowData[col.key] = val;
              saveAndRender();
            }
          });
        }

        syncChargeTrackedCoreQty(rowData);
        const td = document.createElement("td");
        td.style.textAlign = "center";
        const qty = document.createElement("span");
        qty.textContent = String(rowData.chargeUnits.length);
        qty.style.fontWeight = "bold";
        qty.style.color = "#dce6eb";
        qty.title = "Quantity is determined by the number of tracked cores";
        td.appendChild(qty);
        return td;
      },

      cost: ({ rowData, col, saveAndRender }) => {
        const td = document.createElement("td");
        td.style.textAlign = "center";

        const span = document.createElement("span");
        span.style.cursor = "pointer";
        span.style.display = "inline-block";
        span.addEventListener("mouseenter", () => (span.style.textDecoration = "underline"));
        span.addEventListener("mouseleave", () => (span.style.textDecoration = "none"));

        function renderSpan() {
          span.innerHTML = "";
		  span.appendChild(formatGearCostDisplay(rowData));
        }
        renderSpan();

        guardObsidianClick(td);
        guardObsidianClick(span);

        td.onclick = (event) => {
          if (event.target.tagName === "A" || event.target.tagName === "INPUT") return;
          if (td.querySelector("input")) return;

          const input = document.createElement("input");
          input.type = "text";

          // IMPORTANT: edit ONLY the base cost (stored value), not the computed display
          input.value = String(rowData[col.key] ?? "");

          input.style.width = "95%";
          input.style.backgroundColor = "#fde4c9";
          input.style.color = "black";
          input.style.caretColor = "black";

          guardObsidianClick(input);

          input.onblur = () => {
            const v = input.value.trim();
            rowData[col.key] = v;
            saveAndRender(); // re-renders so qty changes / cost changes update the (total)
          };

          input.onkeydown = (e) => {
            if (e.key === "Enter" || e.key === "Escape") input.blur();
          };

          td.innerHTML = "";
          td.appendChild(input);
          input.focus();
          input.select();
        };

        td.appendChild(span);
        return td;
      },

      weight: ({ rowData, col, saveAndRender }) => {
        const td = document.createElement("td");
        td.style.textAlign = "center";
        const span = document.createElement("span");
        span.style.cursor = "pointer";
        span.style.display = "inline-block";
        span.addEventListener("mouseenter", () => (span.style.textDecoration = "underline"));
        span.addEventListener("mouseleave", () => (span.style.textDecoration = "none"));
        span.appendChild(formatGearWeightDisplay(rowData));
        guardObsidianClick(td);
        guardObsidianClick(span);
        td.onclick = (event) => {
          if (event.target.tagName === "A" || event.target.tagName === "INPUT") return;
          if (td.querySelector("input")) return;
          const input = document.createElement("input");
          input.type = "text";
          input.value = String(rowData[col.key] ?? "");
          input.style.width = "95%";
          input.style.backgroundColor = "#fde4c9";
          input.style.color = "black";
          input.style.caretColor = "black";
          guardObsidianClick(input);
          input.onblur = () => { rowData[col.key] = input.value.trim(); saveAndRender(); };
          input.onkeydown = (e) => { if (e.key === "Enter" || e.key === "Escape") input.blur(); };
          td.innerHTML = "";
          td.appendChild(input);
          input.focus();
          input.select();
        };
        td.appendChild(span);
        return td;
      },

      actions: ({ rowData, rowIdx, data, saveAndRender }) => {
        const td = document.createElement("td");
        td.style.textAlign = "center";
        td.classList.add("vk-inventory-action-cell");
        const wrap = document.createElement("div");
        wrap.className="vk-inventory-actions";

        const equipKind = getInventoryModKind(rowData);
        if (equipKind === "weapon" || equipKind === "armor" || equipKind === "powerArmor") {
          const equip = document.createElement("button");
          equip.textContent = "⇧";
          equip.title = equipKind === "weapon" ? "Prepare weapon" : "Equip item";
          styleEquipmentActionIcon(equip, equipKind === "weapon" ? "prepare" : "equip");
          guardObsidianClick(equip);
          equip.onclick = async (e) => {
            e.stopPropagation();
            try { await equipInventoryItem(rowData, rowIdx, data, saveAndRender); }
            catch (err) { console.error(err); showSheetNotice(String(err?.message || err), 3500); }
          };
          wrap.appendChild(equip);
        }
        if (equipKind === "weapon" || equipKind === "armor" || equipKind === "powerArmor") {
          const modify = createWorkbenchButton(rowData, "equipment", "", null, true);
          wrap.appendChild(modify);
        }

        const transfer = document.createElement("button");
        transfer.textContent = "⇄";
        transfer.title = "Transfer to vehicle";
        styleEquipmentActionIcon(transfer, "transfer");
        guardObsidianClick(transfer);
        transfer.onclick = (e) => {
          e.stopPropagation();
          showVehicleTransferDialog({
            rowData,
            onTransfer: async (vehicleFile, selection) => {
              const cargo = getVehicleCargo(vehicleFile);
              if (isChargeTrackedCore(rowData)) {
                const indexes = selection.coreIndexes || [];
                const movedUnits = indexes.map(i => rowData.chargeUnits[i]).filter(Boolean);
                mergeItemIntoCargo(cargo, rowData, movedUnits);
                const removeSet = new Set(indexes);
                rowData.chargeUnits = rowData.chargeUnits.filter((_, i) => !removeSet.has(i));
                syncChargeTrackedCoreQty(rowData);
                if (!rowData.chargeUnits.length) data.splice(rowIdx, 1);
              } else {
                const qty = Number(selection.qty || 0);
                mergeItemIntoCargo(cargo, rowData, qty);
                const remaining = (parseInt(rowData.qty ?? 0, 10) || 0) - qty;
                if (remaining <= 0) data.splice(rowIdx, 1);
                else rowData.qty = String(remaining);
              }
              await setVehicleCargo(vehicleFile, cargo);
              saveAndRender();
              showSheetNotice(`Transferred to ${vehicleFile.basename}.`);
            }
          });
        };

        const remove = document.createElement("button");
        remove.title = "Remove item";
        styleEquipmentActionIcon(remove, "remove");
        guardObsidianClick(remove);
        remove.onclick = (e) => {
          e.stopPropagation();
          data.splice(rowIdx, 1);
          saveAndRender();
        };

        wrap.append(transfer, remove);
        td.appendChild(wrap);
        return td;
      },
    },
  });
}


//--------------------------------------------------------------------------------------------

const PERK_STORAGE_KEY = "fallout_perk_table";
const PERK_SEARCH_FOLDERS = [
    "Fallout-RPG/Perks/Core Rulebook",
    "Fallout-RPG/Perks/Settlers",
    "Fallout-RPG/Perks/Wanderers",
    "Fallout-RPG/Perks/Weapons",
    "Fallout-RPG/Perks/Book Perks",
    "Fallout-RPG/Perks/Traits"
];
const PERK_DESCRIPTION_LIMIT = 999999;
function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isMarkdownTable(block) {
  const lines = block.split("\n").map(l => l.trim());
  if (lines.length < 2) return false;
  if (!lines[0].includes("|")) return false;
  if (!/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(lines[1])) return false;
  return true;
}

function renderMarkdownTable(block, container) {
  const lines = block.split("\n").map(l => l.trim()).filter(Boolean);

  const table = document.createElement("table");
  //table.style.borderCollapse = "collapse";
  //table.style.margin = "6px 0";
  //table.style.width = "100%";
  //table.style.fontSize = "0.95em";

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const parseRow = (line) =>
    line.replace(/^\||\|$/g, "").split("|").map(c => c.trim());

  // Header
  const headerCells = parseRow(lines[0]);
  const trh = document.createElement("tr");
  for (const cell of headerCells) {
    const th = document.createElement("th");
    //th.style.borderBottom = "1px solid #666";
    //th.style.textAlign = "left";
    //th.style.padding = "4px 6px";
    th.innerHTML = renderInlinePerkMarkdown(cell);
    trh.appendChild(th);
  }
  thead.appendChild(trh);

  // Body
  for (let i = 2; i < lines.length; i++) {
    const rowCells = parseRow(lines[i]);
    const tr = document.createElement("tr");
    for (const cell of rowCells) {
      const td = document.createElement("td");
      //td.style.padding = "4px 6px";
     //td.style.verticalAlign = "top";
      td.innerHTML = renderInlinePerkMarkdown(cell);
      
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}

function renderPerkMarkdown(mdText, container) {
  const raw = String(mdText ?? "");
  container.innerHTML = "";

  // Split into blocks by blank lines
  const blocks = raw.replace(/\r\n/g, "\n").split(/\n\s*\n/g);

  for (const block of blocks) {
	  if (isMarkdownTable(block)) {
	    renderMarkdownTable(block, container);
	    continue;
	  }
	
	  const lines = block.replace(/\r\n/g, "\n").split("\n");
	
	  let paraBuf = [];
	  let ul = null;
	
	  function flushParagraph() {
	    if (!paraBuf.length) return;
	    const p = document.createElement("p");
	    p.style.margin = "6px 0";
	    p.innerHTML = renderInlinePerkMarkdown(paraBuf.join("\n")).replace(/\n/g, "<br>");
	    container.appendChild(p);
	    paraBuf = [];
	  }
	
	  function flushList() {
	    if (!ul) return;
	    container.appendChild(ul);
	    ul = null;
	  }
	
	  for (const line of lines) {
	    const trimmed = line.trim();
	
	    // treat empty line as paragraph/list boundary within the block
	    if (!trimmed) {
	      flushParagraph();
	      flushList();
	      continue;
	    }
	
	    // Bullet line? Support "*" and "-" bullets.
	    const m = trimmed.match(/^([*-])\s+(.+)$/);
	    if (m) {
	      flushParagraph();
	      if (!ul) {
	        ul = document.createElement("ul");
	        ul.style.margin = "4px 0 4px 18px";
	        ul.style.padding = "0";
	      }
	
	      const li = document.createElement("li");
	      li.innerHTML = renderInlinePerkMarkdown(m[2]);
	      ul.appendChild(li);
	    } else {
	      flushList();
	      paraBuf.push(line);
	    }
	  }
	
	  flushParagraph();
	  flushList();
	}
}

function renderInlinePerkMarkdown(text) {
  // Escape first to avoid HTML injection
  let s = escapeHtml(text);

  // Internal links: [[Page]] or [[Page|Alias]]
  s = s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '<a class="internal-link" href="$1">$2</a>');
  s = s.replace(/\[\[([^\]]+)\]\]/g, '<a class="internal-link" href="$1">$1</a>');

  // Bold: **text**
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic: *text* (simple, avoids bullets because bullet lines are handled separately)
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");

  return s;
}

async function renderMarkdownInto(containerEl, mdText, sourcePath = "", ownerComponent = null) {
  containerEl.innerHTML = "";

  const md = String(mdText ?? "");

  try {
    // Modal content needs a real Obsidian component owner for renderer lifecycle.
    // Normal sheet callers continue using the existing JS-Engine behavior.
    if (ownerComponent && obsidian?.MarkdownRenderer?.render) {
      await obsidian.MarkdownRenderer.render(app, md, containerEl, sourcePath, ownerComponent);
      return;
    }
    // JS-Engine style 1: returns an element
    if (engine?.markdown?.create) {
      const maybeEl = engine.markdown.create(md);

      // If it returned a node/element, append it
      if (maybeEl && (maybeEl.nodeType === 1 || maybeEl.nodeType === 11)) {
        containerEl.appendChild(maybeEl);
        return;
      }

      // JS-Engine style 2: some builds render into the second arg
      // (If your build supports it, this will populate containerEl.)
      engine.markdown.create(md, containerEl);
      // If it worked, container is no longer empty:
      if (containerEl.childNodes.length) return;
    }

    // Fallback: Obsidian MarkdownRenderer (very reliable)
    if (window?.MarkdownRenderer?.render) {
      await window.MarkdownRenderer.render(app, md, containerEl, sourcePath, null);
      return;
    }
  } catch (e) {
    console.error("Markdown render failed:", e);
  }

  // Last resort
  containerEl.textContent = md;
}


let cachedPerkData = null;
async function fetchPerkData() {
    if (cachedPerkData) return cachedPerkData;

    let allFiles = await app.vault.getFiles();
    let perkFiles = allFiles.filter(file => PERK_SEARCH_FOLDERS.some(folder => file.path.startsWith(folder)));

    let perkItems = await Promise.all(perkFiles.map(async (file) => {
        let content = await app.vault.read(file);

        let stats = {
            name: `[[${file.basename}]]`,
            qty: "1",      // Character-owned rank always starts at 1.
            maxRank: 1,    // Source perk's maximum available rank.
            sourcePath: file.path,
            description: "No description available"
        };

        let rankMatch = content.match(/(?:\*\*)?\s*Ranks?\s*:\s*(?:\*\*)?\s*(\d+)/i);
        if (rankMatch) {
          const parsedMax = Math.max(1, parseInt(rankMatch[1], 10) || 1);
          stats.maxRank = parsedMax;
        }
		
        // --- Prefer YAML block scalars for description (supports markdown tables, lists, paragraphs) ---
		const blockDesc = content.match(/^\s*(?:description|desc):\s*[|>]\s*\n([\s\S]*?)(?=^\s*\w+:\s|^\S|\Z)/m);
		
		if (blockDesc) {
		  stats.description = blockDesc[1]
		    .replace(/\r\n/g, "\n")
		    .trim()
		    .replace(/\n{3,}/g, "\n\n");
		} else {
		  // Single-line description/desc
		  let descMatch = content.match(/(?:description:|desc:)\s*["']?([^"\n]+)["']?/i);
		  if (descMatch) {
		    stats.description = descMatch[1].trim();
		  } else {
		    // Fallback: get everything after "Ranks:" and preserve line breaks (markdown)
		    const descStart = content.indexOf("Ranks:");
		    if (descStart !== -1) {
		      let descContent = content
		        .substring(descStart)
		        .split("\n")
		        .slice(1)
		        .join("\n")
		        .trim();
		
		      descContent = descContent.replace(/\n{3,}/g, "\n\n");
		      stats.description = descContent;
		    }
		  }
		}



        return stats;
    }));

    cachedPerkData = perkItems.filter(g => g);
    return cachedPerkData;
}

const perkColumns = [
    { label: "Name", key: "name", type: "link" },         // Read-only source link
    { label: "Rank", key: "qty", type: "number" },         // Editable
    { label: "Description", key: "description", type: "text" }, // Read-only rendered text
    { label: "Remove", type: "remove" }                    // Remove button
];

const INVENTORY_CATEGORIES = [
  { key: "WEAPONS", label: "Weapons" },
  { key: "APPAREL", label: "Apparel" },
  { key: "CHEMS", label: "Chems" },
  { key: "FOOD", label: "Food" },
  { key: "MISC", label: "Misc" },
  { key: "AMMO", label: "Ammo" },
  { key: "ALL", label: "All" },
];

const INVENTORY_VIEW_KEY = "fallout_inventory_category_view";

function normalizedInventoryCategory(rowData) {
  const explicit = String(rowData?.category ?? "").trim().toUpperCase();
  if (INVENTORY_CATEGORIES.some(c => c.key !== "ALL" && c.key === explicit)) return explicit;
  return categoryKeyFromPath(rowData?.sourcePath || "");
}

function saveGearRowsAndRefresh(rows) {
  localStorage.setItem(GEAR_STORAGE_KEY, JSON.stringify(rows));
  if (typeof updateCarryWeightDisplay === "function") updateCarryWeightDisplay();
  if (typeof updateWeaponTableDOM === "function") updateWeaponTableDOM();
  window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
}

// Only plain source-identical items with matching owned metadata may share a stack.
function vkPlainInventoryStackKey(item) {
  if (!item || item.instanceId || String(item.instanceName||'').trim() || String(item.generatedName||'').trim() ||
      hasInventoryMods(item) || isChargeTrackedCore(item) || item.powerArmorState || vkArmorHasBreaking(item) ||
      vkWeaponCondition(item).status!=='normal' || item.baseCostOverride!==undefined) return null;
  const quantity=Number(item.qty??1);
  if(!Number.isSafeInteger(quantity)||quantity<0)return null;
  let path=String(item.sourcePath||'').trim().replace(/\\/g,'/');
  if(!path){
    const target=String(item.name||item.link||'').replace(/^\[\[|\]\]$/g,'').split('|')[0];
    path=app.metadataCache?.getFirstLinkpathDest?.(target,'')?.path||'';
  }
  if(!path)return null;
  const ignored=new Set(['name','link','yamlName','sourcePath','qty','selected','category','cost','weight','instanceId','instanceName','generatedName','addons','breaking','weaponCondition']);
  const extra=Object.fromEntries(Object.keys(item).filter(key=>!ignored.has(key)).sort().map(key=>[key,item[key]]));
  return JSON.stringify([path,normalizedInventoryCategory({...item,sourcePath:path}),String(item.cost??'').trim(),String(item.weight??'').trim(),extra]);
}
function vkConsolidatePlainInventoryStacks(rows) {
  const result=[],stacks=new Map();let changed=false;
  for(const original of rows){
    const row={...original},key=vkPlainInventoryStackKey(row),existing=key===null?null:stacks.get(key);
    if(existing && Number.isSafeInteger(Number(existing.qty??1)+Number(row.qty??1))){
      existing.qty=String(Number(existing.qty??1)+Number(row.qty??1));
      existing.selected=!!existing.selected||!!row.selected;changed=true;
    } else {result.push(row);if(key!==null)stacks.set(key,row);}
  }
  return {rows:result,changed};
}

function addGearSearchItem(sourceItem, quantity=1, onAdded=null) {
  const item=structuredClone(sourceItem);
  item.qty=String(quantity);item.selected=false;
  if (isChargeTrackedCore(item)) {
    item.chargeUnits=[];
    showCoreChargeEditor({rowData:item,quantity,onSave:newUnit=>{
      item.chargeUnits=Array.from({length:quantity},()=>({...structuredClone(newUnit),instanceId:makeInventoryInstanceId()}));
      syncChargeTrackedCoreQty(item);
      const rows=getGearRows();rows.push(item);saveGearRowsAndRefresh(vkConsolidatePlainInventoryStacks(rows).rows);onAdded?.(item,quantity);
    }});
    return;
  }
  const rows=getGearRows();rows.push(item);saveGearRowsAndRefresh(vkConsolidatePlainInventoryStacks(rows).rows);onAdded?.(item,quantity);
}

// Source previews are ephemeral; only the owned row and its selected quantity are saved.
async function openInventoryItemPicker({onAdded=null,initialCategory="ALL"}={}) {
  openVaultKitWorkbench?.forceClose();
  const host=sheetcontainer.closest('.view-content')||sheetcontainer.closest('.workspace-leaf-content')||sheetcontainer.parentElement;
  const priorFocus=document.activeElement,oldPosition=host.style.position,changedPosition=getComputedStyle(host).position==='static',hadClass=host.classList.contains('vk-workbench-pane-host');
  if(changedPosition)host.style.position='relative';host.classList.add('vk-workbench-pane-host');
  const overlay=document.createElement('div');overlay.className='vk-workbench-pane-overlay';
  const panel=document.createElement('section');panel.className='vk-modal vk-workbench vk-inventory-picker';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
  const headingId=`vk-picker-title-${makeInventoryInstanceId()}`;panel.setAttribute('aria-labelledby',headingId);
  let closed=false,items=[],selected=null,previewVersion=0,previewOwner=null;
  const bridgeTheme=()=>{const theme=getComputedStyle(sheetcontainer);for(let i=0;i<theme.length;i++){const key=theme[i];if(key.startsWith('--vk-'))overlay.style.setProperty(key,theme.getPropertyValue(key));}overlay.style.fontFamily=theme.fontFamily;};bridgeTheme();
  const themeObserver=new MutationObserver(bridgeTheme);themeObserver.observe(sheetcontainer,{attributes:true,attributeFilter:['style','class']});themeObserver.observe(document.body,{attributes:true,attributeFilter:['style','class']});
  const close=()=>{if(closed)return;closed=true;previewVersion++;previewOwner?.unload();themeObserver.disconnect();lifetimeObserver.disconnect();overlay.remove();if(changedPosition)host.style.position=oldPosition;if(!hadClass)host.classList.remove('vk-workbench-pane-host');if(openVaultKitWorkbench===api)openVaultKitWorkbench=null;if(priorFocus?.isConnected)priorFocus.focus();};
  const api={forceClose:close};openVaultKitWorkbench=api;
  const lifetimeObserver=new MutationObserver(()=>{if(!sheetcontainer.isConnected||!host.isConnected)close();});lifetimeObserver.observe(document.body,{childList:true,subtree:true});
  const node=(tag,className,text)=>{const el=document.createElement(tag);el.className=className;if(text!==undefined)el.textContent=text;return el;};
  const field=(label,input)=>{const el=node('label','vk-picker-field',label);el.append(input);return el;};
  const header=node('header','vk-picker-header'),heading=node('h2','','Add to Inventory');heading.id=headingId;header.append(heading,node('div','vk-picker-muted','Choose an item from the vault'));
  weaponViewLinks(panel);
  const body=node('div','vk-picker-body'),filters=node('div','vk-picker-filters'),search=node('input',''),category=node('select','');search.type='search';search.placeholder='Search items…';search.setAttribute('aria-label','Search items');category.setAttribute('aria-label','Item category');
  for(const entry of [{key:'ALL',label:'All items'},...INVENTORY_CATEGORIES.filter(c=>c.key!=='ALL')]){const option=node('option','',entry.label);option.value=entry.key;category.append(option);}category.value=INVENTORY_CATEGORIES.some(c=>c.key===initialCategory)?initialCategory:'ALL';
  filters.append(field('Search',search),field('Category',category));body.append(filters);
  const count=node('div','vk-picker-muted','Loading items…'),results=node('div','vk-picker-results');results.setAttribute('aria-label','Matching items');results.setAttribute('role','group');
  const preview=node('section','vk-picker-preview');preview.setAttribute('aria-label','Selected item preview');preview.setAttribute('aria-live','polite');preview.textContent='Select an item to preview.';body.append(count,results,preview);
  const footer=node('footer','vk-picker-footer'),qty=node('input','');qty.type='number';qty.min='1';qty.step='1';qty.value='1';qty.setAttribute('aria-label','Quantity to add');
  const cancel=node('button','','Cancel'),add=node('button','vk-picker-add','Add to Inventory');cancel.type=add.type='button';cancel.onclick=close;add.disabled=true;
  footer.append(field('Quantity',qty),cancel,add);const status=node('div','vk-picker-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  panel.append(header,body,footer,status);overlay.append(panel);host.append(overlay);
  const displayName=item=>sourceDisplayName({sourcePath:item.sourcePath,yamlName:item.yamlName,fallbackName:stripWikiLink(item.name||'Item')});
  const validQuantity=()=>Number.isSafeInteger(Number(qty.value))&&Number(qty.value)>0&&Number(qty.value)<=9999;
  const updateAdd=()=>{add.disabled=!selected||!validQuantity();status.textContent=qty.value&&!validQuantity()?'Enter a whole quantity from 1 to 9999.':selected&&isChargeTrackedCore(selected)?'Set core charges in the next step. The selected quantity will use those charges.':'';};
  async function showPreview(item) {
    const version=++previewVersion;previewOwner?.unload();previewOwner=new obsidian.Component();previewOwner.load();const owner=previewOwner;preview.replaceChildren();
    if(!item){preview.textContent='No item selected.';return;}
    preview.dataset.weaponSourcePath=item.sourcePath;
    preview.append(node('div','vk-picker-muted','Selected item'));const title=node('div','vk-picker-name');appendSourceWikiLink(title,item.name,'Item',item.sourcePath,item.yamlName,displayName(item));preview.append(title);
    const stats=node('div','vk-picker-stats');preview.append(stats);
    const showStats=entries=>{stats.replaceChildren();for(const [label,value]of entries){if(value===undefined||value===null||String(value).trim()==='')continue;const cell=node('div','vk-picker-stat'),text=node('span','',String(value));cell.append(node('span','vk-picker-muted',label),text);stats.append(cell);if(String(value).includes('[['))renderMarkdownInto(text,String(value),item.sourcePath,owner);}};
    const common=[['Weight',item.weight],['Cost',item.cost]];showStats(common);
    try {
      const file=app.vault.getAbstractFileByPath(item.sourcePath);if(!file)throw new Error('Source note is missing');
      const content=await app.vault.read(file),block=content.match(/```statblock\s*([\s\S]*?)```/i)?.[1]||'';
      if(closed||version!==previewVersion||owner!==previewOwner)return;
      let data={};try{data=obsidian.parseYaml(block)||{};}catch(_){}
      const top=key=>data[key]??block.match(new RegExp('^'+key+':[ \\t]*([^\\n]+)','im'))?.[1]?.trim().replace(/^["']|["']$/g,'');
      const specifics=[];
      if(normalizedInventoryCategory(item)==='WEAPONS')specifics.push(['Damage',top('damage_rating')],['Rate',top('fire_rate')],['Range',top('range')],['Damage type',top('damage_type')],['Skill',top('type')],['Ammo',top('ammo')]);
      if(normalizedInventoryCategory(item)==='APPAREL'){
        if(/dmg resistances\s*:/i.test(block)){const dr=parseArmorModStatblock(block);specifics.push(['Physical / Energy / Rad DR',`${dr.phys} / ${dr.en} / ${dr.rad}`]);}
        specifics.push(['Locations',top('locations')],['HP',top('hp')]);
      }
      showStats([...specifics,...common]);
      const special=typeof data.gameEffects==='string'?data.gameEffects:readWeaponGameEffects(content);
      if(special){const section=node('div','vk-picker-special');section.append(node('div','vk-picker-muted','Special'));const text=node('div','');section.append(text);preview.append(section);await renderMarkdownInto(text,special,item.sourcePath,owner);}
    }catch(error){console.warn('Vault-Kit: item preview could not be loaded',error);if(!closed&&version===previewVersion)preview.append(node('div','vk-picker-muted','Additional details could not be loaded.'));}
  }
  function renderResults() {
    if(closed)return;
    const query=search.value.trim().toLocaleLowerCase();
    const matches=items.filter(item=>(category.value==='ALL'||normalizedInventoryCategory(item)===category.value)&&`${displayName(item)} ${item.sourcePath}`.toLocaleLowerCase().includes(query));
    results.replaceChildren();count.textContent=`${matches.length} matching item${matches.length===1?'':'s'}`;
    const next=matches.find(item=>item===selected)||matches[0]||null,selectionChanged=next!==selected;selected=next;
    const nameCounts=new Map();for(const item of matches){const name=displayName(item);nameCounts.set(name,(nameCounts.get(name)||0)+1);}
    for(const item of matches){
      const row=node('button','vk-picker-result');row.type='button';row.setAttribute('aria-pressed',String(item===selected));
      const name=node('span','vk-picker-result-name',displayName(item)),meta=node('span','vk-picker-muted',INVENTORY_CATEGORIES.find(c=>c.key===normalizedInventoryCategory(item))?.label||'Misc');
      if(nameCounts.get(displayName(item))>1){const folder=node('small','vk-picker-source',String(item.sourcePath).split('/').slice(-3,-1).join(' / '));name.append(folder);}
      row.append(name,meta);row.onclick=()=>{selected=item;results.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button===row)));showPreview(item);updateAdd();};
      row.onkeydown=event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();(event.key==='ArrowDown'?row.nextElementSibling:row.previousElementSibling)?.focus();}};results.append(row);
    }
    if(!matches.length)results.append(node('p','vk-picker-empty','No matching items.'));
    if(selectionChanged)showPreview(selected);updateAdd();
  }
  search.oninput=category.onchange=renderResults;qty.oninput=updateAdd;
  search.onkeydown=event=>{if(event.key==='ArrowDown'){event.preventDefault();results.querySelector('button')?.focus();}};
  add.onclick=()=>{
    if(add.disabled||closed)return;
    const item=selected,quantity=Number(qty.value);
    if(!app.vault.getAbstractFileByPath(item.sourcePath)){status.textContent='This source note is no longer available.';return;}
    add.disabled=true;
    try {
      if(isChargeTrackedCore(item))close();
      addGearSearchItem(item,quantity,(added,count)=>{if(sheetcontainer.isConnected)onAdded?.(added,count);showSheetNotice(`Added ${count} × ${displayName(added)} to Inventory.`);});
      close();
    }catch(error){status.textContent='The item could not be added. Try again.';add.disabled=false;console.error(error);}
  };
  panel.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
    if(event.key==='Tab'){const controls=[...panel.querySelectorAll('button,input,select,a[href]')].filter(el=>!el.disabled&&el.getClientRects().length);const first=controls[0],last=controls[controls.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}
  });overlay.onclick=event=>{if(event.target===overlay)close();};search.focus();
  try{items=(await fetchGearData()).slice().sort((a,b)=>displayName(a).localeCompare(displayName(b)));if(!closed)renderResults();}
  catch(error){if(!closed){count.textContent='Items could not be loaded.';status.textContent='Close and reopen Add Item to try again.';}}
}

function loadInventoryViewIndex() {
  const saved = String(localStorage.getItem(INVENTORY_VIEW_KEY) || "WEAPONS").toUpperCase();
  const idx = INVENTORY_CATEGORIES.findIndex(category => category.key === saved);
  return idx >= 0 ? idx : 0;
}

function renderGearTableSection() {
  const consolidated=vkConsolidatePlainInventoryStacks(getGearRows());
  if(consolidated.changed)localStorage.setItem(GEAR_STORAGE_KEY,JSON.stringify(consolidated.rows));
  const outer = document.createElement("div");
  outer.className = "vk-inventory-panel vk-content-card";
  outer.style.padding = "12px 15px 15px 15px";
  outer.style.border = "3px solid #142c3f";
  outer.style.borderRadius = "8px";
  outer.style.backgroundColor = "#172a3b";
  outer.style.marginBottom = "20px";

  const controls = document.createElement("div");
  controls.className = "vk-inventory-controls";
  controls.style.display = "flex";
  controls.style.alignItems = "center";
  controls.style.justifyContent = "space-between";
  controls.style.gap = "14px";
  controls.style.flexWrap = "wrap";
  controls.style.marginBottom = "10px";

  const switcher = document.createElement("div");
  switcher.className = "vk-inventory-switcher";
  switcher.style.display = "flex";
  switcher.style.alignItems = "center";
  switcher.style.justifyContent = "center";
  switcher.style.gap = "10px";
  switcher.style.minWidth = "210px";
  switcher.style.padding = "4px 8px";
  switcher.style.border = "1px solid #223657";
  switcher.style.borderRadius = "6px";
  switcher.style.background = "#142c3f";
  switcher.style.userSelect = "none";

  const left = document.createElement("span");
  left.textContent = "‹";
  left.title = "Previous inventory category";
  left.style = "cursor:pointer;color:#ffc200;font-size:1.55em;font-weight:bold;line-height:1;";

  const categoryLabel = document.createElement("span");
  categoryLabel.style.color = "#ffc200";
  categoryLabel.style.fontWeight = "bold";
  categoryLabel.style.fontSize = "1.15em";
  categoryLabel.style.textAlign = "center";
  categoryLabel.style.minWidth = "110px";

  const right = document.createElement("span");
  right.textContent = "›";
  right.title = "Next inventory category";
  right.style = "cursor:pointer;color:#ffc200;font-size:1.55em;font-weight:bold;line-height:1;";

  switcher.append(left, categoryLabel, right);

  const addButton=document.createElement("button");addButton.type="button";addButton.className="vk-inventory-add-item";addButton.textContent="Add Item";
  addButton.onclick=()=>openInventoryItemPicker({onAdded:item=>{
    const next=INVENTORY_CATEGORIES.findIndex(category=>category.key===normalizedInventoryCategory(item));
    if(next>=0)activeIndex=next;renderActiveTable();
  }});
  controls.append(switcher,addButton);
  outer.appendChild(controls);

  const tableHost = document.createElement("div");
  outer.appendChild(tableHost);

  let activeIndex = loadInventoryViewIndex();

  const renderActiveTable = () => {
    const category = INVENTORY_CATEGORIES[activeIndex];
    categoryLabel.textContent = category.label;
    localStorage.setItem(INVENTORY_VIEW_KEY, category.key);

    tableHost.innerHTML = "";
    const isAll = category.key === "ALL";
    const table = renderGearCategoryTable(
      isAll ? null : row => normalizedInventoryCategory(row) === category.key,
      isAll
    );
    table.classList.toggle("vk-inventory-all-container", isAll);
    const actualInventoryTable = table.querySelector("table.fallout-gear-table");
    if (actualInventoryTable) {
      actualInventoryTable.classList.toggle("vk-inventory-all-view", isAll);
    }

    // The inventory already has one outer panel. Flatten the generic table's
    // own panel styling so the switcher, Add Item field, and table read as one
    // continuous Pip-Boy-style inventory surface.
    table.style.padding = "0";
    table.style.border = "0";
    table.style.borderRadius = "0";
    table.style.backgroundColor = "transparent";
    table.style.marginBottom = "0";
    tableHost.appendChild(table);
  };

  const moveCategory = direction => {
    activeIndex = (activeIndex + direction + INVENTORY_CATEGORIES.length) % INVENTORY_CATEGORIES.length;
    renderActiveTable();
  };

  left.addEventListener("click", () => moveCategory(-1));
  right.addEventListener("click", () => moveCategory(1));

  left.tabIndex = 0;
  right.tabIndex = 0;
  left.setAttribute("role", "button");
  right.setAttribute("role", "button");
  left.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); moveCategory(-1); }
  });
  right.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); moveCategory(1); }
  });

  renderActiveTable();
  return outer;
}


function createPerkRankCell({ rowData, saveAndRender }) {
  const td = document.createElement("td");
  td.style.textAlign = "center";
  td.style.verticalAlign = "middle";

  const perkName = normalizePerkName(rowData?.name);
  const savedRank = Math.max(1, Math.round(Number(rowData?.qty) || 1));

  // Never let max-rank metadata destroy an existing character rank.
  // Older sheets stored only qty, so the saved rank itself is also a
  // minimum-known max until the source definition is confirmed.
  const maxRank = Math.max(
    1,
    savedRank,
    Number(rowData?.maxRank) || 0,
    getPerkMaxRank(perkName, savedRank)
  );
  rowData.maxRank = maxRank;

  const baseRank = savedRank;

  const effectiveInfo = getEffectivePerkRank(perkName, baseRank, maxRank);

  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;align-items:center;justify-content:center;gap:6px;";



  const value = document.createElement("span");
  value.textContent = effectiveInfo.effective > 0 ? String(effectiveInfo.effective) : "—";
  value.style.cssText = `
    min-width:26px;
    text-align:center;
    font-weight:850;
    cursor:pointer;
    color:${effectiveInfo.effective !== baseRank ? "#f3c64d" : "#efdd6f"};
  `;

  if (effectiveInfo.effective !== baseRank) {
    const effectNames = effectiveInfo.modifiers.map(mod => mod.effectName).filter(Boolean);
    value.title = `Permanent rank: ${baseRank}\nEffective rank: ${effectiveInfo.effective}` +
      (effectNames.length ? `\nActive Effects: ${effectNames.join(", ")}` : "");
  } else {
    value.title = `Permanent rank ${baseRank} of ${maxRank}`;
  }



  const setBaseRank = next => {
    const rank = Math.max(1, Math.min(maxRank, Math.round(Number(next) || 1)));
    rowData.qty = String(rank);
    rowData.maxRank = maxRank;
    saveAndRender();
  };



  value.onclick = e => {
    e.stopPropagation();

    const select = document.createElement("select");
    for (let rank = 1; rank <= maxRank; rank++) {
      const option = document.createElement("option");
      option.value = String(rank);
      option.textContent = `Rank ${rank}`;
      select.appendChild(option);
    }
    select.value = String(baseRank);
    select.onchange = () => setBaseRank(select.value);
    select.onblur = () => {
      if (select.isConnected) control.replaceChild(value, select);
    };

    control.replaceChild(select, value);
    select.focus();
  };

  const control=attachHoverNumberArrows(value,{getValue:()=>baseRank,setValue:setBaseRank,min:1,max:maxRank,label:"permanent perk rank"});
  value.tabIndex=0;value.setAttribute("role","spinbutton");value.setAttribute("aria-label","Perk rank");
  value.setAttribute("aria-valuemin","1");value.setAttribute("aria-valuemax",String(maxRank));value.setAttribute("aria-valuenow",String(baseRank));
  value.addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();value.click();}});
  wrap.appendChild(control);
  td.appendChild(wrap);
  return td;
}

function renderActiveEffectGrantedPerks() {
  const permanentNames = new Set(
    loadStoredPerks().map(row => normalizePerkName(row?.name).toLowerCase())
  );

  const candidateNames = new Map();

  loadActiveEffects().forEach(effect => {
    if (!effect || effect.active === false) return;
    (Array.isArray(effect.modifiers) ? effect.modifiers : []).forEach(mod => {
      if (mod?.group !== "Perks") return;
      const name = normalizePerkName(mod.target);
      if (!name) return;
      candidateNames.set(name.toLowerCase(), {
        name,
        maxRank: Math.max(1, Number(mod.maxRank) || 1)
      });
    });
  });

  const granted = [...candidateNames.values()]
    .filter(perk => !permanentNames.has(perk.name.toLowerCase()))
    .map(perk => ({
      ...perk,
      effective: getEffectivePerkRank(perk.name, 0, perk.maxRank)
    }))
    .filter(perk => perk.effective.effective > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!granted.length) return null;

  const panel = document.createElement("div");
  panel.className = "vk-active-effect-granted-perks";
  panel.style.cssText = `
    margin:0 0 10px;
    padding:10px 12px;
    border:1px solid rgba(243,198,77,.28);
    border-radius:8px;
    background:#102434;
  `;

  const title = document.createElement("div");
  title.textContent = "Temporary Perks";
  title.style.cssText = `
    color:#f3c64d;
    font-size:.78rem;
    font-weight:850;
    letter-spacing:.06em;
    text-transform:uppercase;
    margin-bottom:7px;
  `;

  const list = document.createElement("div");
  list.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;";

  granted.forEach(perk => {
    const chip = document.createElement("span");
    chip.style.cssText = `
      display:inline-flex;
      gap:5px;
      align-items:center;
      padding:5px 8px;
      border:1px solid rgba(83,127,155,.36);
      border-radius:7px;
      background:#172a3b;
      color:#f4ead5;
    `;

    const name = document.createElement("span");
    name.textContent = perk.name;
    name.style.fontWeight = "750";

    const rank = document.createElement("span");
    rank.textContent = `Rank ${perk.effective.effective}`;
    rank.style.cssText = "color:#f3c64d;font-size:.85em;";

    chip.append(name, rank);
    list.appendChild(chip);
  });

  panel.append(title, list);
  return panel;
}

function syncStoredPerkDefinitions(definitions) {
  const rows = loadStoredPerks();
  let changed = false;

  rows.forEach(row => {
    const name = normalizePerkName(row?.name).toLowerCase();
    const def = definitions.find(item =>
      normalizePerkName(item?.name).toLowerCase() === name
    );
    if (!def) return;

    const currentRank = Math.max(1, Math.round(Number(row.qty) || 1));
    const sourceMaxRank = Math.max(1, Math.round(Number(def.maxRank) || 1));

    // The definition controls the maximum. The existing owned rank is never
    // reduced; this also protects unusual legacy data above the source max.
    const authoritativeMax = Math.max(sourceMaxRank, currentRank);

    if (Number(row.maxRank) !== authoritativeMax) {
      row.maxRank = authoritativeMax;
      changed = true;
    }

    if (row.sourcePath !== def.sourcePath) {
      row.sourcePath = def.sourcePath;
      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem(PERK_STORAGE_KEY, JSON.stringify(rows));
  }

  return changed;
}

function renderPerkTableSection() {
  const outer = document.createElement("div");
  outer.className = "vk-perks-panel vk-content-card";
  let definitionsReady = false;

  const renderTable = () => {
    outer.innerHTML = "";

    const temporary = renderActiveEffectGrantedPerks();
    if (temporary) outer.appendChild(temporary);

    const table = createEditableTable({
      columns: perkColumns,
      storageKey: PERK_STORAGE_KEY,
      fetchItems: fetchPerkData,
      cellOverrides: {
        qty: createPerkRankCell,
        name: ({rowData}) => {
          const td=document.createElement("td");
          appendSourceWikiLink(td,rowData.name || "","Perk",rowData.sourcePath || "");
          return td;
        },
        description: ({ rowData, col, saveAndRender }) => {
          const td = document.createElement("td");
          td.style.textAlign = "left";
          td.style.verticalAlign = "top";
          td.style.whiteSpace = "normal";
          td.style.color = "#c5c5c5";
          td.style.fontSize = "12px";

          const view = document.createElement("div");
          view.style.whiteSpace = "normal";
          view.style.cursor = "default";

          function render() {
            renderPerkMarkdown(rowData.description ?? "", view);
          }
          render();

          td.appendChild(view);
          return td;
        }
      }
    });

    // Keep the compact action columns usable on smaller screens.
    // The generic table panel already provides horizontal scrolling, so once
    // this minimum width is reached the table scrolls instead of crushing
    // Rank / Remove into unreadable columns.
    const perkTable = table.querySelector("table.fallout-perk-table");
    if (perkTable) {
      perkTable.style.width = "100%";
      perkTable.style.minWidth = "900px";
      perkTable.style.tableLayout = "fixed";

      const colgroup = document.createElement("colgroup");
      [
        "175px", // Name
        "110px", // Rank controls
        "auto",  // Description absorbs remaining width
        "72px"   // Remove
      ].forEach(width => {
        const col = document.createElement("col");
        if (width !== "auto") col.style.width = width;
        colgroup.appendChild(col);
      });
      perkTable.insertBefore(colgroup, perkTable.firstChild);

      const headers = perkTable.querySelectorAll("thead th");
      if (headers[0]) {
        headers[0].style.minWidth = "175px";
      }
      if (headers[1]) {
        headers[1].style.width = "110px";
        headers[1].style.minWidth = "110px";
        headers[1].style.whiteSpace = "nowrap";
      }
      if (headers[2]) {
        headers[2].style.minWidth = "500px";
      }
      if (headers[3]) {
        headers[3].style.width = "72px";
        headers[3].style.minWidth = "72px";
        headers[3].style.whiteSpace = "nowrap";
        headers[3].textContent = "Remove";
      }
    }

    outer.appendChild(table);
  };

  // Do not build the perk rank controls until perk definitions have been read.
  // This prevents stale legacy maxRank metadata (for example Gun Nut maxRank 2)
  // from temporarily becoming the controlling cap.
  const loading = document.createElement("div");
  loading.textContent = "Loading perk definitions…";
  loading.style.cssText = "padding:10px 12px;color:#aebdca;font-size:.9em;";
  outer.appendChild(loading);

  fetchPerkData()
    .then(definitions => {
      syncStoredPerkDefinitions(definitions);
      definitionsReady = true;
      renderTable();
    })
    .catch(() => {
      // Fall back to stored data if a vault read fails.
      definitionsReady = true;
      renderTable();
    });

  const onPerkEffectsChanged = () => {
    if (!outer.isConnected) {
      window.removeEventListener("fallout:active-effects-updated", onPerkEffectsChanged);
      return;
    }
    if (definitionsReady) renderTable();
  };
  window.addEventListener("fallout:active-effects-updated", onPerkEffectsChanged);

  return outer;
}




//--------------------------------------------------------------------------------------------


// Terminal state survives refreshSheet() rerenders during this sheet session.
let falloutTerminalHasBooted = false;
let falloutTerminalBootTimer = null;

function renderTerminalNotesSection() {
    // --- Only add style once ---
    if (!document.getElementById("fallout-terminal-css")) {
        const style = document.createElement('style');
        style.id = "fallout-terminal-css";
        style.textContent = `
.fallout-terminal-container {
    background: #181818;
    border: 3px solid #38ff88;
    border-radius: 11px;
    padding: 18px 14px 22px 18px;
    margin: 30px 0 25px 0;
    font-family: 'VT323', 'Fira Mono', 'Consolas', 'Courier New', monospace;
    color: #38ff88;
    box-shadow: 0 0 30px 2px #18ff55b0;
    position: relative;
    overflow: hidden;
}
.fallout-terminal-title {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 2px;
    color: #8fffbe;
    text-shadow: 0 0 12px #38ff88, 0 0 4px #fff;
    letter-spacing: 2px;
    font-family: inherit;
    text-align: left;
    padding-left: 3px;
    margin-top: 0;
}
.fallout-terminal-boot {
    font-size: 1.18em;
    color: #4cf386;
    letter-spacing: 1.2px;
    margin-bottom: 6px;
    padding-left: 2px;
    min-height: 45px;
    font-family: inherit;
    white-space: pre-line;
    animation: terminalBoot 1.6s steps(16, end) 1;
}
@keyframes terminalBoot {
    from { opacity: 0; }
    25% { opacity: 1; }
    to { opacity: 1; }
}
.fallout-terminal-textarea {
    width: 100%;
    min-height: 135px;
    resize: vertical;
    background: #181818;
    color: #38ff88;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: 1.2em;
    line-height: 1.42em;
    box-shadow: 0 0 8px #14ff55a0;
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 7px;
    z-index: 3;
    position: relative;
}
.fallout-terminal-prompt {
    font-size: 1.13em;
    color: #38ff88;
    font-family: inherit;
    display: flex;
    align-items: center;
    margin-left: 2px;
    margin-top: 3px;
    opacity: 0.7;
}
.fallout-terminal-cursor {
    display: inline-block;
    width: 12px;
    height: 1.12em;
    background: #38ff88;
    margin-left: 6px;
    animation: blink 1s step-end infinite;
    vertical-align: bottom;
    border-radius: 1px;
}
@keyframes blink {
    0%, 60% { opacity: 1; }
    61%, 100% { opacity: 0; }
}
.fallout-terminal-scanlines {
    pointer-events: none;
    position: absolute;
    top: -18px; left: 0; width: 100%; height: calc(100% + 18px);
    z-index: 99;
    opacity: 0.17;
    background: repeating-linear-gradient(
        to bottom,
        #18ff55 0px, #18ff5508 2px,
        transparent 3px, transparent 7px
    );
    transform: translateY(0);
    will-change: transform;
    animation: scanlinesMove 5s linear infinite;
}
@keyframes scanlinesMove {
    from { transform: translateY(0); }
    to { transform: translateY(18px); }
}
@media (prefers-reduced-motion: reduce) {
    .fallout-terminal-scanlines,
    .fallout-terminal-cursor,
    .fallout-terminal-boot {
        animation: none !important;
    }
}
.fallout-terminal-power {
    position: absolute;
    top: 11px; right: 17px;
    width: 16px; height: 16px;
    background: radial-gradient(circle at 8px 8px, #38ff88 70%, #163f1c 95%);
    border-radius: 50%;
    box-shadow: 0 0 14px 2px #38ff88b7, 0 0 3px 2px #7cffb9;
    border: 2px solid #38ff88b3;
    z-index: 50;
}
        `;
        document.head.appendChild(style);
    }

    // --- Boot Animation Text ---
    const bootLines = [
        "Initializing Vault-Tec Personal Terminal...",
        "-----------------------------------------",
        "ACCESS GRANTED: Welcome, user.",
        "Vault 111 // Journal Subsystem Online.",
        "",
    ];

    // Main Container
    let container = document.createElement('div');
    container.className = "fallout-terminal-container";

    // Power Light
    const power = document.createElement('div');
    power.className = "fallout-terminal-power";
    container.appendChild(power);

    // Title
    const title = document.createElement('div');
    title.className = "fallout-terminal-title";
    title.textContent = "Personal Terminal Notes";
    container.appendChild(title);

    // Boot/Intro Lines (with animation)
    const bootDiv = document.createElement('div');
    bootDiv.className = "fallout-terminal-boot";
    bootDiv.textContent = ""; // Animate this in below
    container.appendChild(bootDiv);

    // Textarea for notes
    const NOTES_KEY = "fallout_terminal_notes";
    const textarea = document.createElement('textarea');
    textarea.className = "fallout-terminal-textarea";
    textarea.placeholder = ">> ENTER NOTE TEXT";
    textarea.value = localStorage.getItem(NOTES_KEY) || "";

    // Save after the user pauses typing instead of writing the entire note
    // to localStorage on every keystroke.
    let notesSaveTimer = null;
    const saveNotesNow = () => {
        if (notesSaveTimer !== null) {
            clearTimeout(notesSaveTimer);
            notesSaveTimer = null;
        }
        localStorage.setItem(NOTES_KEY, textarea.value);
    };

    textarea.addEventListener("input", () => {
        if (notesSaveTimer !== null) clearTimeout(notesSaveTimer);
        notesSaveTimer = setTimeout(saveNotesNow, 300);
    });

    // Blinking prompt
    const prompt = document.createElement('div');
    prompt.className = "fallout-terminal-prompt";
    prompt.innerHTML = '>> <span class="fallout-terminal-cursor"></span>';
    prompt.style.display = "none";

    // Show prompt when textarea is not focused
    textarea.addEventListener("blur", () => {
        saveNotesNow();
        prompt.style.display = "";
    });
    textarea.addEventListener("focus", () => {
        prompt.style.display = "none";
    });

    // --- Scanlines overlay ---
    const scanlines = document.createElement('div');
    scanlines.className = "fallout-terminal-scanlines";

    // Boot only once per sheet session. refreshSheet() may rebuild this DOM many
    // times, but later renders skip the timed sequence and show the terminal ready.
    if (falloutTerminalHasBooted) {
        bootDiv.textContent = bootLines.join("\n");
        container.appendChild(textarea);
        container.appendChild(prompt);
    } else {
        falloutTerminalHasBooted = true;

        // Cancel a stale timer if the terminal was replaced mid-boot.
        if (falloutTerminalBootTimer !== null) {
            clearTimeout(falloutTerminalBootTimer);
            falloutTerminalBootTimer = null;
        }

        let bootIndex = 0;
        function showBootLine() {
            if (!container.isConnected && bootIndex > 0) {
                falloutTerminalBootTimer = null;
                return;
            }

            if (bootIndex < bootLines.length) {
                bootDiv.textContent += bootLines[bootIndex] + "\n";
                bootIndex++;
                falloutTerminalBootTimer = setTimeout(showBootLine, 420);
            } else {
                falloutTerminalBootTimer = null;
                container.appendChild(textarea);
                container.appendChild(prompt);
            }
        }
        showBootLine();
    }

    container.appendChild(scanlines);

    return container;
}

//--------------------------------------------------------------------------------------------

async function backfillSavedWeights() {
  let gearChanged = false;
  let gearRows = [];
  try { gearRows = JSON.parse(localStorage.getItem("fallout_gear_table") || "[]"); } catch {}

  if (gearRows.length) {
    const definitions = await fetchGearData();
    for (const row of gearRows) {
      const rowName = stripWikiLink(row.name || row.link || "");
      const match = definitions.find(def =>
        (row.sourcePath && def.sourcePath === row.sourcePath) ||
        stripWikiLink(def.name || def.link || "") === rowName
      );

      if (match) {
        if (!row.sourcePath && match.sourcePath) { row.sourcePath = match.sourcePath; gearChanged = true; }
        if (!row.yamlName && match.yamlName) { row.yamlName = match.yamlName; gearChanged = true; }
        if (!row.category && match.category) { row.category = match.category; gearChanged = true; }
        if (String(row.weight ?? "").trim() === "" && String(match.weight ?? "").trim() !== "") {
          row.weight = match.weight;
          gearChanged = true;
        }
      }

      if (hasInventoryMods(row) && isInventoryModdableItem(row)) {
        const before = JSON.stringify({ cost: row.cost, weight: row.weight, addons: row.addons, instanceId: row.instanceId, qty: row.qty });
        await recalcInventoryItemFromSources(row);
        const after = JSON.stringify({ cost: row.cost, weight: row.weight, addons: row.addons, instanceId: row.instanceId, qty: row.qty });
        if (before !== after) gearChanged = true;
      }
    }

    if (gearChanged) {
      localStorage.setItem("fallout_gear_table", JSON.stringify(gearRows));
      window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
    }
  }

  const armorAddons = await fetchArmorAddonData(false);
  for (const section of NORMAL_ARMOR_SECTIONS) {
    const stored = loadArmorData(section);
    if (!String(stored.apparel ?? "").trim()) continue;

    let changed = false;
    ensureArmorBase(stored, false);

    if (String(stored.base?.weight ?? "").trim() === "") {
      const armorName = stripWikiLink(stored.apparel);
      const choices = await fetchArmorData(section);
      const match = choices.find(item => String(item.link ?? "") === armorName);
      if (match && String(match.weight ?? "").trim() !== "") {
        stored.base.weight = match.weight;
        stored.weight = match.weight;
        changed = true;
      }
    }

    if (Array.isArray(stored.addons)) {
      for (const addon of stored.addons) {
        if (addon?.deltas && addon.deltas.weight !== undefined) continue;
        const match = armorAddons.find(def => def.id === addon.id);
        if (match?.deltas) {
          if (!addon.deltas) addon.deltas = {};
          addon.deltas.weight = match.deltas.weight || 0;
          changed = true;
        }
      }
    }

    if (changed) {
      recalcArmorFromAddons(stored, false);
      saveArmorData(section, stored);
      const oldCard = document.querySelector(`.armor-card[data-section="${section}"]`);
      if (oldCard) oldCard.replaceWith(renderArmorCard(section));
    }
  }

  updateCarryWeightDisplay();
}



// ============================================================================
// INJURIES & ADDICTIONS
// ============================================================================

const INJURY_STORAGE_KEY = "fallout_injury_data";
const INJURY_LOCATIONS = ["Head", "Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg"];
const INJURY_STATES = ["None", "Injured", "Treated"];

function defaultInjuryData() {
  const locations = {};
  INJURY_LOCATIONS.forEach(loc => locations[loc] = "None");
  return { locations, addictions: [] };
}

function loadInjuryData() {
  let data = defaultInjuryData();
  try {
    const raw = JSON.parse(localStorage.getItem(INJURY_STORAGE_KEY) || "null");
    if (raw && typeof raw === "object") {
      if (raw.locations && typeof raw.locations === "object") {
        INJURY_LOCATIONS.forEach(loc => {
          const state = String(raw.locations[loc] ?? "None");
          data.locations[loc] = INJURY_STATES.includes(state) ? state : "None";
        });
      }
      if (Array.isArray(raw.addictions)) {
        data.addictions = raw.addictions
          .map(x => {
            // Migrate older string-only addictions into the new object format.
            if (typeof x === "string") {
              const name = String(x ?? "").trim();
              return name ? { name, sourcePath: "" } : null;
            }
            if (x && typeof x === "object") {
              const name = String(x.name ?? "").trim();
              const sourcePath = String(x.sourcePath ?? "").trim();
              return name ? { name, sourcePath } : null;
            }
            return null;
          })
          .filter(Boolean);
      }
    }
  } catch (err) {
    console.warn("Could not parse injury data; using defaults.", err);
  }
  return data;
}

function saveInjuryData(data) {
  localStorage.setItem(INJURY_STORAGE_KEY, JSON.stringify(data));
}

function makeInjuryInfoBox(titleText, bodyText, accent = "#efdd6f") {
  const box = document.createElement("div");
  box.style.background = "#142c3f";
  box.style.border = `1px solid ${accent}`;
  box.style.borderRadius = "7px";
  box.style.padding = "10px 12px";
  box.style.marginTop = "8px";

  const title = document.createElement("div");
  title.textContent = titleText;
  title.style.color = accent;
  title.style.fontWeight = "bold";
  title.style.marginBottom = "5px";

  const body = document.createElement("div");
  body.textContent = bodyText;
  body.style.color = "#fde4c9";
  body.style.fontSize = "0.92em";
  body.style.lineHeight = "1.4";

  box.append(title, body);
  return box;
}

function renderInjurySection() {
  const section = document.createElement("div");
  section.className = "vk-injury-panel vk-content-card";
  section.id = "injury-section";
  section.style.background = "#172a3b";
  section.style.border = "3px solid #142c3f";
  section.style.borderRadius = "8px";
  section.style.padding = "15px";
  section.style.marginBottom = "20px";

  let data = loadInjuryData();

  // ----- Injury location controls -----
  const injuryTitle = document.createElement("div");
  injuryTitle.textContent = "Injuries";
  injuryTitle.className = "vk-injury-subtitle";
  injuryTitle.style.color = "#ffc200";
  injuryTitle.style.fontWeight = "bold";
  injuryTitle.style.fontSize = "1.05em";
  injuryTitle.style.marginBottom = "10px";
  section.appendChild(injuryTitle);

  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(170px, 1fr))";
  grid.style.gap = "8px 12px";

  const guidanceWrap = document.createElement("div");

  function renderGuidance() {
    guidanceWrap.innerHTML = "";

    const states = Object.values(data.locations);
    const anyTreated = states.includes("Treated");
    const anyInjury = states.some(x => x === "Treated" || x === "Injured");
    const untreatedCount = states.filter(x => x === "Injured").length;

    if (anyTreated) {
      guidanceWrap.appendChild(makeInjuryInfoBox(
        "Treated Injury",
        "Whenever a character suffers any damage to a location which has a treated injury, roll 1 D6. If you roll an Effect, the damage has re-opened that wound and the character is injured again. Completely recovering from an injury takes time."
      ));
    }

    if (anyInjury) {
      const recovery = makeInjuryInfoBox(
        "Injury Recovery",
        "When you sleep, if you have any injuries (treated or otherwise), make an END + Survival test with a difficulty of 1. The complication range on this test increases by +1 for each injury that has not been treated. If you succeed, you may recover from one of those injuries, plus an additional injury for every 2 AP spent. The difficulty of this test varies based on how active you were during the preceding day:"
      );

      const complication = document.createElement("div");
      complication.style.marginTop = "8px";
      complication.style.color = untreatedCount > 0 ? "#ffb199" : "#c5c5c5";
      complication.style.fontWeight = "bold";
      complication.textContent = `Untreated injuries: ${untreatedCount} — complication range increases by +${untreatedCount}.`;
      recovery.appendChild(complication);

      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.marginTop = "10px";
      table.style.borderCollapse = "collapse";
      table.style.fontSize = "0.9em";

      const thead = document.createElement("thead");
      const hr = document.createElement("tr");
      ["Activity", "Difficulty"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        th.style.color = "#ffc200";
        th.style.borderBottom = "1px solid #efdd6f";
        th.style.padding = "4px 6px";
        th.style.textAlign = text === "Difficulty" ? "center" : "left";
        hr.appendChild(th);
      });
      thead.appendChild(hr);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      [
        ["Restful (no strenuous activity all day)", "1"],
        ["Light (only a small amount of travel or similar)", "2"],
        ["Moderate (travel, but no combat)", "3"],
        ["Heavy (travel and combat)", "4"]
      ].forEach(([activity, difficulty]) => {
        const tr = document.createElement("tr");
        const tdA = document.createElement("td");
        const tdD = document.createElement("td");
        tdA.textContent = activity;
        tdD.textContent = difficulty;
        tdA.style.color = "#fde4c9";
        tdD.style.color = "#fde4c9";
        tdA.style.padding = "4px 6px";
        tdD.style.padding = "4px 6px";
        tdD.style.textAlign = "center";
        tr.append(tdA, tdD);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      recovery.appendChild(table);
      guidanceWrap.appendChild(recovery);
    }
  }

  INJURY_LOCATIONS.forEach(location => {
    const row = document.createElement("div");
    row.className = "vk-injury-row";
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr minmax(95px, 110px)";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.style.background = "#142c3f";
    row.style.border = "1px solid #223657";
    row.style.borderRadius = "6px";
    row.style.padding = "6px 8px";

    const label = document.createElement("span");
    label.textContent = location;
    label.style.color = "#fde4c9";
    label.style.fontWeight = "bold";

    const select = document.createElement("select");
    select.className = "vk-injury-state";
    select.style.background = "#fde4c9";
    select.style.color = "#000";
    select.style.borderRadius = "5px";
    select.style.padding = "3px 5px";
    select.style.cursor = "pointer";

    INJURY_STATES.forEach(state => {
      const opt = document.createElement("option");
      opt.value = state;
      opt.textContent = state;
      select.appendChild(opt);
    });
    select.value = data.locations[location] || "None";

    const applyStateStyle = () => {
      select.dataset.state = select.value;
    };
    applyStateStyle();

    select.addEventListener("change", () => {
      data.locations[location] = select.value;
      saveInjuryData(data);
      applyStateStyle();
      renderGuidance();
    });

    row.append(label, select);
    grid.appendChild(row);
  });

  section.appendChild(grid);
  section.appendChild(guidanceWrap);
  renderGuidance();

  // ----- Addictions -----
  const divider = document.createElement("div");
  divider.style.height = "1px";
  divider.style.background = "#223657";
  divider.style.margin = "18px 0 12px";
  section.appendChild(divider);

  const addictionHeader = document.createElement("div");
  addictionHeader.textContent = "Addictions";
  addictionHeader.className = "vk-injury-subtitle";
  addictionHeader.style.color = "#ffc200";
  addictionHeader.style.fontWeight = "bold";
  addictionHeader.style.fontSize = "1.05em";
  addictionHeader.style.marginBottom = "8px";
  section.appendChild(addictionHeader);

  // Addiction choices come only from the Chem compendium folder.
  const CHEM_ADDICTION_FOLDER = "Fallout-RPG/Items/Consumables/Chems";
  let addictionChemCache = null;

  async function fetchAddictionChems() {
    if (addictionChemCache) return addictionChemCache;
    const files = app.vault.getFiles().filter(file =>
      file.path.startsWith(`${CHEM_ADDICTION_FOLDER}/`) &&
      String(file.extension ?? "").toLowerCase() === "md"
    );

    addictionChemCache = files
      .map(file => ({
        name: `[[${file.basename}]]`,
        displayName: file.basename,
        sourcePath: file.path
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" }));

    return addictionChemCache;
  }

  function addictionIdentity(item) {
    const path = String(item?.sourcePath ?? "").trim().toLowerCase();
    if (path) return `path:${path}`;
    return `name:${stripWikiLink(String(item?.name ?? "")).trim().toLowerCase()}`;
  }

  const pickerWrap = document.createElement("div");
  pickerWrap.style.position = "relative";
  pickerWrap.style.marginBottom = "10px";

  const chemInput = document.createElement("input");
  chemInput.type = "text";
  chemInput.placeholder = "Search chems...";
  chemInput.autocomplete = "off";
  chemInput.style.width = "100%";
  chemInput.style.boxSizing = "border-box";
  chemInput.style.background = "#fde4c9";
  chemInput.style.color = "#000";
  chemInput.style.caretColor = "#000";
  chemInput.style.borderRadius = "5px";
  chemInput.style.padding = "6px 8px";

  // Render addiction results at body level so parent section overflow cannot
  // clip the dropdown.
  document.getElementById("vk-addiction-search-results")?.remove();

  const searchResults = document.createElement("div");
  searchResults.id = "vk-addiction-search-results";
  searchResults.style.position = "fixed";
  searchResults.style.zIndex = "100000";
  searchResults.style.background = "#10283a";
  searchResults.style.color = "#f4ead5";
  searchResults.style.border = "1px solid #d3b65d";
  searchResults.style.borderRadius = "5px";
  searchResults.style.boxShadow = "0 8px 24px #0008";
  searchResults.style.maxHeight = "260px";
  searchResults.style.overflowY = "auto";
  searchResults.style.display = "none";
  searchResults.style.boxSizing = "border-box";
  document.body.appendChild(searchResults);

  function positionAddictionSearchResults() {
    if (!chemInput.isConnected || !searchResults.isConnected) return;
    const rect = chemInput.getBoundingClientRect();
    searchResults.style.left = `${rect.left}px`;
    searchResults.style.top = `${rect.bottom + 3}px`;
    searchResults.style.width = `${rect.width}px`;

    // Keep the panel inside the visible window when the search box is low on
    // the page. In that case, open it upward instead.
    const availableBelow = window.innerHeight - rect.bottom - 8;
    const desiredHeight = Math.min(260, searchResults.scrollHeight || 260);
    if (availableBelow < Math.min(140, desiredHeight) && rect.top > availableBelow) {
      searchResults.style.top = "auto";
      searchResults.style.bottom = `${window.innerHeight - rect.top + 3}px`;
    } else {
      searchResults.style.bottom = "auto";
    }
  }

  const addictionTableWrap = document.createElement("div");

  function createInternalLink(linkText, sourcePath = "") {
    const target = stripWikiLink(String(linkText ?? "")).trim();
    const link = document.createElement("a");
    link.className = "internal-link";
    link.textContent = target;
    link.href = target;
    link.style.cursor = "pointer";
    link.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const openTarget = sourcePath || target;
      app.workspace.openLinkText(openTarget, app.workspace.getActiveFile()?.path || "", false);
    };
    return link;
  }

  function renderAddictions() {
    addictionTableWrap.innerHTML = "";

    if (!data.addictions.length) {
      const empty = document.createElement("div");
      empty.textContent = "No current addictions.";
      empty.style.color = "#c5c5c5";
      empty.style.fontStyle = "italic";
      empty.style.padding = "5px 0";
      addictionTableWrap.appendChild(empty);
      return;
    }

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    const thead = document.createElement("thead");
    const hr = document.createElement("tr");
    const chemTh = document.createElement("th");
    const actionTh = document.createElement("th");
    chemTh.textContent = "Chem";
    actionTh.textContent = "Actions";
    chemTh.style.textAlign = "left";
    actionTh.style.textAlign = "center";
    actionTh.style.width = "80px";
    chemTh.style.color = actionTh.style.color = "#ffc200";
    chemTh.style.padding = actionTh.style.padding = "4px 6px";
    hr.append(chemTh, actionTh);
    thead.appendChild(hr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    data.addictions.forEach((chem, index) => {
      const tr = document.createElement("tr");
      const nameTd = document.createElement("td");
      const actionTd = document.createElement("td");
      nameTd.style.color = "#fde4c9";
      nameTd.style.padding = "5px 6px";
      actionTd.style.textAlign = "center";

      nameTd.appendChild(createInternalLink(chem.name, chem.sourcePath));

      const remove = document.createElement("button");
      styleEquipmentActionIcon(remove, "remove");
      remove.title = "Remove addiction";
      remove.style.cursor = "pointer";
      remove.style.textShadow = "2px 2px 5px black";
      remove.onclick = () => {
        data.addictions.splice(index, 1);
        saveInjuryData(data);
        renderAddictions();
      };

      actionTd.appendChild(remove);
      tr.append(nameTd, actionTd);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    addictionTableWrap.appendChild(table);
  }

  async function addAddiction(chem) {
    const id = addictionIdentity(chem);
    if (data.addictions.some(existing => addictionIdentity(existing) === id)) {
      showSheetNotice(`${chem.displayName} is already listed as an addiction.`);
      return;
    }

    data.addictions.push({
      name: chem.name,
      sourcePath: chem.sourcePath
    });
    saveInjuryData(data);
    chemInput.value = "";
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
    renderAddictions();
    showSheetNotice(`Added ${chem.displayName} addiction.`);
  }

  async function renderChemSearch() {
    const query = chemInput.value.trim().toLowerCase();
    searchResults.innerHTML = "";

    if (!query) {
      searchResults.style.display = "none";
      return;
    }

    const chems = await fetchAddictionChems();
    const matches = chems
      .filter(chem => chem.displayName.toLowerCase().includes(query))
      .filter(chem => !data.addictions.some(existing => addictionIdentity(existing) === addictionIdentity(chem)))
      .slice(0, 30);

    if (!matches.length) {
      const none = document.createElement("div");
      none.textContent = "No matching available chems.";
      none.style.padding = "7px 9px";
      none.style.color = "#aebdca";
      searchResults.appendChild(none);
      searchResults.style.display = "block";
      positionAddictionSearchResults();
      return;
    }

    matches.forEach((chem, idx) => {
      const row = document.createElement("div");
      row.textContent = chem.displayName;
      row.style.padding = "7px 9px";
      row.style.cursor = "pointer";
      row.style.color = "#f4ead5";
      row.style.background = "#10283a";
      row.style.borderBottom = idx < matches.length - 1 ? "1px solid rgba(91,136,164,.22)" : "none";
      row.onmouseenter = () => {
        row.style.background = "#203d55";
        row.style.color = "#ffc200";
      };
      row.onmouseleave = () => {
        row.style.background = "#10283a";
        row.style.color = "#f4ead5";
      };
      row.onclick = () => addAddiction(chem);
      searchResults.appendChild(row);
    });

    searchResults.style.display = "block";
    positionAddictionSearchResults();
  }

  chemInput.addEventListener("input", debounce(renderChemSearch, 120));
  chemInput.addEventListener("focus", () => {
    if (chemInput.value.trim()) renderChemSearch();
  });
  chemInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const query = chemInput.value.trim().toLowerCase();
    if (!query) return;
    const chems = await fetchAddictionChems();
    const exact = chems.find(chem => chem.displayName.toLowerCase() === query);
    if (exact) addAddiction(exact);
  });

  const closeAddictionSearch = (e) => {
    if (!chemInput.isConnected) {
      searchResults.remove();
      document.removeEventListener("pointerdown", closeAddictionSearch, true);
      window.removeEventListener("resize", positionAddictionSearchResults);
      window.removeEventListener("scroll", positionAddictionSearchResults, true);
      return;
    }

    if (pickerWrap.contains(e.target) || searchResults.contains(e.target)) return;
    searchResults.style.display = "none";
  };

  document.addEventListener("pointerdown", closeAddictionSearch, true);
  window.addEventListener("resize", positionAddictionSearchResults);
  window.addEventListener("scroll", positionAddictionSearchResults, true);

  pickerWrap.append(chemInput);
  section.append(pickerWrap, addictionTableWrap);
  renderAddictions();

  return section;
}

function refreshSheet() {
    const oldStats = document.getElementById("stats-section");
		if (oldStats) oldStats.remove();

    sheetcontainer.innerHTML = "";
    installVaultKitTheme();
    sheetcontainer.appendChild(renderVaultKitMasthead());

    // --- 1. Utility controls ---
    const utilityRow = document.createElement("div");
    utilityRow.className = "vk-utility-row";
    utilityRow.append(renderImportExportBar(), renderCapsContainer());
    sheetcontainer.appendChild(utilityRow);

    // Terminal Notes is lazy-mounted. If a player keeps it collapsed, the
    // terminal DOM, boot sequence, and animations are not created at all.
    appendCollapsibleSection(
        sheetcontainer,
        "Terminal Notes",
        "terminal-notes",
        renderTerminalNotesSection,
        { lazy: true }
    );

    // --- 2. Stats section
    // Keep the current stats styling intact; the collapsible header simply
    // controls visibility of the existing stats container.
    appendCollapsibleSection(
        sheetcontainer,
        "Stats",
        "stats",
        renderStatsSection()
    );
	setTimeout(setupStatsSection, 0);
	
    // --- 3. Injuries & Addictions
    appendCollapsibleSection(
        sheetcontainer,
        "Injuries & Addictions",
        "injuries-addictions",
        renderInjurySection()
    );

    // --- 4. Active Effects
    appendCollapsibleSection(
        sheetcontainer,
        "Active Effects",
        "active-effects",
        renderActiveEffectsSection()
    );

    // --- 5. Render weapons, then update DOM for table
    // Build the table first, then place its existing container inside the
    // collapsible body. This keeps all weapon styling and refresh behavior intact.
    updateWeaponTableDOM();
    const weaponsBody = document.createElement("div");
    weaponsBody.className = "vk-weapons-section";
    weaponsBody.append(equippedWeaponContainer, weaponTableContainer);
    appendCollapsibleSection(sheetcontainer, "Weapons", "equipped-weapons", weaponsBody);

    // --- 6. Render Ammo table (no extra listeners needed if all logic inside table function)
    //sheetcontainer.appendChild(createSectionHeader("Ammo"));
    //sheetcontainer.appendChild(renderAmmoTableSection());

    // --- 7. Armor section
    appendCollapsibleSection(
        sheetcontainer,
        "Armor",
        "armor",
        renderArmorTabsSection()
    );

    // --- 8. Gear
    appendCollapsibleSection(
        sheetcontainer,
        "Inventory",
        "inventory",
        renderGearTableSection()
    );

    // --- 9. Perks
    appendCollapsibleSection(
        sheetcontainer,
        "Perks",
        "perks",
        renderPerkTableSection()
    );
	
    // --- (If you need to re-attach listeners to other dynamic elements, do it here!)
    setTimeout(() => { backfillSavedWeights(); }, 0);
    
}





refreshSheet();
return sheetcontainer;


```
