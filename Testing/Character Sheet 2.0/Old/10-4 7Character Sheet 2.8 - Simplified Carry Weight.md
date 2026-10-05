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
if (oldSheet) oldSheet.remove();

 
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


const weaponTableContainer = document.createElement('div');
weaponTableContainer.id = 'weapon-table-container';


function updateWeaponTableDOM() {
    weaponTableContainer.innerHTML = '';
    weaponTableContainer.appendChild(renderWeaponTableSection());
    if (typeof updateCarryWeightDisplay === "function") updateCarryWeightDisplay();
}

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
    body.className = "fallout-collapsible-section-body";

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
		    const effectsRaw = String(rowData.effects_note ?? "").trim();
		
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
                ammoSpans[1]?.classList.add("vk-weapon-ammo-count");
                ammoSpans[1]?.classList.toggle("is-empty", Number(ammoState.currentShots) <= 0);

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
			    ammoSpans[1]?.classList.add("vk-weapon-ammo-count");
			    ammoSpans[1]?.classList.toggle("is-empty", Number(startQty) <= 0);
			
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
		        chip.innerHTML = (m.link || "").replace(
		          /\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>'
		        );
		
		        const rm = document.createElement("span");
		        rm.textContent = " 🗑️";
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
      const qtyContainer = document.createElement("div");
      qtyContainer.style.display = "flex";
      qtyContainer.style.alignItems = "center";
      qtyContainer.style.justifyContent = "center";
      qtyContainer.style.gap = "6px";

      // Minus icon (unstyled)
      const decreaseIcon = document.createElement("span");
      decreaseIcon.textContent = "−";
      decreaseIcon.style.cursor = "pointer";
      decreaseIcon.style.fontSize = "1.15em";
      decreaseIcon.style.padding = "2px 6px";
      decreaseIcon.style.userSelect = "none";
      decreaseIcon.style.color = "cyan";
      decreaseIcon.style.textShadow = "2px 2px 6px black";

      // Plus icon (unstyled)
      const increaseIcon = document.createElement("span");
      increaseIcon.textContent = "+";
      increaseIcon.style.cursor = "pointer";
      increaseIcon.style.fontSize = "1.15em";
      increaseIcon.style.padding = "2px 6px";
      increaseIcon.style.userSelect = "none";
	  increaseIcon.style.color = "tomato";
	  increaseIcon.style.textShadow = "2px 2px 6px black";
	
      // Qty text (unstyled, editable on click)
      const qtyText = document.createElement("span");
      qtyText.textContent = rowData[col.key] ?? 1;
      qtyText.style.cursor = "pointer";
      qtyText.style.minWidth = "22px";
      qtyText.style.textAlign = "center";
      qtyText.style.fontWeight = "bold";
      qtyText.style.color = "#efdd6f";
      qtyText.title = "Click to edit";
      qtyText.addEventListener("mouseenter", () => (qtyText.style.textDecoration = "underline"));
	  qtyText.addEventListener("mouseleave", () => (qtyText.style.textDecoration = "none"))
      
      guardObsidianClick(decreaseIcon);
	  guardObsidianClick(increaseIcon);
	  guardObsidianClick(qtyText);
	  guardObsidianClick(qtyContainer);

      function updateQty(newValue) {
          onChange(newValue);
          qtyText.textContent = newValue;
      }

      decreaseIcon.onclick = (e) => {
          e.stopPropagation();
          let newValue = parseInt(qtyText.textContent, 10) - 1;
          if (newValue < 1) newValue = 1;
          updateQty(newValue);
      };

      increaseIcon.onclick = (e) => {
          e.stopPropagation();
          let newValue = parseInt(qtyText.textContent, 10) + 1;
          updateQty(newValue);
      };

      qtyText.onclick = (e) => {
        e.stopPropagation();
        const input = document.createElement("input");
        input.type = "number";
        input.value = qtyText.textContent;
        input.style.width = "45px";
        input.style.textAlign = "center";
        input.style.backgroundColor = "#fde4c9";
        input.style.color = "#172a3b";
        input.style.border = "1px solid #efdd6f";
        input.style.fontWeight = "bold";
        guardObsidianClick(input);

        const originalValue = qtyText.textContent;

        function saveAndExit() {
            let newValue = parseInt(input.value, 10);
            if (isNaN(newValue) || newValue < 1) newValue = 1;
            updateQty(newValue);
            qtyContainer.replaceChild(qtyText, input);
        }

        function cancelAndExit() {
            qtyContainer.replaceChild(qtyText, input);
        }

        input.addEventListener("blur", saveAndExit);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") saveAndExit();
            if (e.key === "Escape") {
                qtyText.textContent = originalValue;
                cancelAndExit();
            }
        });

        qtyContainer.replaceChild(input, qtyText);
        input.focus();
      };

      qtyContainer.appendChild(decreaseIcon);
      qtyContainer.appendChild(qtyText);
      qtyContainer.appendChild(increaseIcon);
      td.appendChild(qtyContainer);
      return td;
    }

    // --- Remove Button (as before) ---
    if (col.type === "remove") {
	    const btn = document.createElement('span');
	    btn.textContent = "🗑️";
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
function createSearchBar({ fetchItems, onSelect }) {
    const wrapper = document.createElement('div');
    wrapper.className = 'vk-search';
    wrapper.style.marginBottom = "10px";
    wrapper.style.position = "relative"; // For dropdown positioning

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
    results.style.color = "black";
    results.style.position = "absolute";
    results.style.left = 0;
    results.style.top = "110%";
    results.style.width = "100%";
    results.style.border = "1px solid #ccc";
    results.style.borderRadius = "0 0 6px 6px";
    results.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
    results.style.display = "none";
    results.style.maxHeight = "200px";
    results.style.overflowY = "auto";
    results.style.zIndex = 999;
    wrapper.appendChild(results);

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
            div.style.borderBottom = (i < matches.length - 1) ? "1px solid #ccc" : "";
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
        results.style.display = matches.length ? "block" : "none";
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



function createPlusMinusDisplay({ value = 0, min = 0, max = 999, step = 1, onChange }) {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.gap = "6px";
    container.addEventListener("pointerdown", swallowEditorPointer, true);

    // Minus
    const minus = document.createElement("span");
    minus.textContent = "−";
    minus.style.cursor = "pointer";
    minus.style.fontSize = "1.15em";
    minus.style.padding = "2px 6px";
    minus.style.userSelect = "none";
    minus.style.color = "cyan";
    minus.style.textShadow = "2px 2px 4px black";
    minus.addEventListener("pointerdown", swallowEditorPointer, true);

    // Plus
    const plus = document.createElement("span");
    plus.textContent = "+";
    plus.style.cursor = "pointer";
    plus.style.fontSize = "1.15em";
    plus.style.padding = "2px 6px";
    plus.style.userSelect = "none";
	plus.style.color = "tomato";
	plus.style.textShadow = "2px 2px 4px black";
	plus.addEventListener("pointerdown", swallowEditorPointer, true);

    // Value display (click to edit)
    const num = document.createElement("span");
    num.className = "plusminus-num";
    num.textContent = value ?? min;
    num.style.cursor = "pointer";
    num.style.minWidth = "22px";
    num.style.textAlign = "center";
    num.style.fontWeight = "bold";
    num.style.color = "#efdd6f";
    num.title = "Click to edit";
    num.addEventListener("pointerdown", swallowEditorPointer, true);
    num.addEventListener("mouseenter", () => (num.style.textDecoration = "underline"));
    num.addEventListener("mouseleave", () => (num.style.textDecoration = "none"))
    
    onChange: (val) => {
	    if (inputs.LuckPoints) {
	        inputs.LuckPoints.value = val;
	        let lck = parseInt(inputs.LCK?.value) || 0;
	        // If blank or equals LCK, remove manual; else, set manual
	        if (val === "" || Number(val) === lck) {
	            delete inputs.LuckPoints.dataset.manual;
	        } else {
	            inputs.LuckPoints.dataset.manual = "true";
	        }
	        let evt = new Event("input", { bubbles: true });
	        inputs.LuckPoints.dispatchEvent(evt);
	    }
	}
	
	
    function setValue(newValue) {
	    // Allow true blank value
	    let v = (newValue === "" || newValue === null) ? "" : Math.max(min, Math.min(max, Number(newValue)));
	    num.textContent = v === "" ? "" : v;
	    if (typeof onChange === "function") onChange(v);
	}


    minus.onclick = (e) => {
        e.stopPropagation();
        setValue(Number(num.textContent) - step);
    };

    plus.onclick = (e) => {
        e.stopPropagation();
        setValue(Number(num.textContent) + step);
    };

    num.onclick = (e) => {
        e.stopPropagation();
        const input = document.createElement("input");
        input.type = "text";
        input.value = num.textContent;
        input.style.width = "45px";
        input.style.textAlign = "center";
        input.style.backgroundColor = "#fde4c9";
        input.style.color = "#172a3b";
        input.style.border = "1px solid #efdd6f";
        input.style.fontWeight = "bold";
        input.addEventListener("pointerdown", swallowEditorPointer, true);

        let finished = false;
		const origVal = num.textContent;
		
		function closeEditor({ apply }) {
		  if (finished) return;
		  finished = true;
		
		  if (apply) {
		    let val = input.value.trim();
		
		    // Apply to display immediately
		    num.textContent = val;
		
		    // Notify caller (your compact row onChange handles defaults)
		    if (typeof onChange === "function") onChange(val);
		  } else {
		    // Discard changes
		    num.textContent = origVal;
		  }
		
		  // Only replace if input is still inside the container
		  if (input.parentNode === container) {
		    container.replaceChild(num, input);
		  }
		}
		
		// IMPORTANT: blur no longer saves; it cancels
		input.addEventListener("blur", () => closeEditor({ apply: false }), { once: true });
		
		input.addEventListener("keydown", (e) => {
		  if (e.key === "Enter") {
		    e.preventDefault();
		    closeEditor({ apply: true });
		  } else if (e.key === "Escape") {
		    e.preventDefault();
		    closeEditor({ apply: false });
		  }
		});


        container.replaceChild(input, num);
        input.focus();
    };

    container.appendChild(minus);
    container.appendChild(num);
    container.appendChild(plus);

    return container;
}

function createCompactPlusMinusRow({
  labelText,
  initialValue = 0,
  min = 0,
  max = 9999,
  step = 1,
  valueTitle = "Click to edit",
  onChange,
}) {
  const wrap = document.createElement("div");
  wrap.style.display = "flex";
  wrap.style.alignItems = "center";
  wrap.style.gap = "6px";

  // MUST be one global closer, installed once
  installGlobalCompactPmCloser();

  const label = document.createElement("span");
  label.textContent = labelText;
  label.style.color = "#FFC200";
  label.style.fontSize = "12px";

  const valueSpan = document.createElement("span");
  valueSpan.textContent = String(initialValue ?? 0);
  valueSpan.style.minWidth = "18px";
  valueSpan.style.textAlign = "center";
  valueSpan.style.cursor = "pointer";
  valueSpan.style.color = "#efdd6f";
  valueSpan.style.fontWeight = "bold";
  valueSpan.title = valueTitle;

  valueSpan.addEventListener("mouseenter", () => (valueSpan.style.textDecoration = "underline"));
  valueSpan.addEventListener("mouseleave", () => (valueSpan.style.textDecoration = "none"));

  const field = createPlusMinusDisplay({
    value: initialValue ?? 0,
    min,
    max,
    step,
    onChange: (val) => {
      valueSpan.textContent = String(val ?? 0);
      if (typeof onChange === "function") onChange(val);
    },
  });

  field.style.display = "none";

  // API object must exist BEFORE you reference it
  const api = {
    wrap,
    hideEditor: null, // will be set below
  };

  function showEditor() {
    // keep editor number synced
    const n = field.querySelector(".plusminus-num");
    if (n) n.textContent = String(valueSpan.textContent ?? 0);

    valueSpan.style.display = "none";
    field.style.display = "flex";

    // REGISTER as open (so global closer can close it)
    openCompactPMs.add(api);
  }

  function hideEditor() {
    field.style.display = "none";
    valueSpan.style.display = "inline-block";

    // UNREGISTER as open
    openCompactPMs.delete(api);
  }

  // now that hideEditor exists, attach it to api
  api.hideEditor = hideEditor;

  valueSpan.addEventListener("click", (e) => {
    e.stopPropagation();
    showEditor();
    // DO NOT delete here (that defeats the whole point)
  });

  field.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Enter") hideEditor();
  });

  wrap.appendChild(label);
  wrap.appendChild(valueSpan);
  wrap.appendChild(field);

  // Return the full API if you want it
  return { wrap, valueSpan, field, showEditor, hideEditor };
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
  "Resources": ["Luck Points"],
  "Derived Stats": ["Maximum HP", "Initiative", "Defense", "Carry Weight", "Melee Damage"],
  "Damage Resistance": ["Physical DR", "Energy DR", "Radiation DR", "Poison DR"]
};

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
    return Array.isArray(parsed) ? parsed : [];
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

function isDerivedStatManual(target) {
  const input = document.getElementById(target);
  if (input?.dataset?.manual === "true") return true;

  const data = getStoredCharacterData();
  const flagKey = String(target).replace(/\s+/g, "") + "Manual";
  return !!data[flagKey];
}

function getEffectiveDerivedValue(target) {
  const data = getStoredCharacterData();
  const level = getBaseNumericCharacterValue("Level");

  let base;

  if (target === "Maximum HP") {
    base = isDerivedStatManual(target)
      ? getBaseNumericCharacterValue(target)
      : getEffectivePrimaryValue("END") + getEffectivePrimaryValue("LCK") + level - 1;
  } else if (target === "Initiative") {
    base = isDerivedStatManual(target)
      ? getBaseNumericCharacterValue(target)
      : getEffectivePrimaryValue("PER") + getEffectivePrimaryValue("AGI");
  } else if (target === "Defense") {
    base = isDerivedStatManual(target)
      ? getBaseNumericCharacterValue(target)
      : (getEffectivePrimaryValue("AGI") >= 9 ? 2 : 1);
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
  if (isDerivedStatManual("MeleeDamage")) {
    const raw = String(
      document.getElementById("MeleeDamage")?.dataset?.baseValue ??
      getStoredCharacterData().MeleeDamage ??
      "-"
    );
    const match = raw.match(/(\d+)d6/i);
    return match ? Number(match[1]) : 0;
  }
  return meleeDamageDiceFromStrength(getBaseNumericCharacterValue("STR"));
}

function getEffectiveMeleeDamage() {
  const startingDice = isDerivedStatManual("MeleeDamage")
    ? getBaseMeleeDamageDice()
    : meleeDamageDiceFromStrength(getEffectivePrimaryValue("STR"));

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

  if (["Maximum HP", "Initiative", "Defense"].includes(target)) {
    return {
      base: getBaseNumericCharacterValue(target),
      effective: getEffectiveDerivedValue(target)
    };
  }

  if (target === "Carry Weight") {
    const base = 150 + (getBaseNumericCharacterValue("STR") * 10);
    return {
      base,
      effective: getEffectiveDerivedValue("Carry Weight")
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
  const targetToKey = {
    "Physical DR": "physdr",
    "Energy DR": "endr",
    "Radiation DR": "raddr"
  };

  document.querySelectorAll("#fallout-sheet-root .vk-armor-card").forEach(card => {
    const isPower = card.classList.contains("vk-power-armor-card");
    const section = isPower
      ? card.dataset.powerArmorSection
      : card.dataset.section;
    if (!section) return;

    const stored = isPower
      ? loadPowerArmorData(section)
      : loadArmorData(section);

    card.querySelectorAll(".vk-armor-stat[data-effect-target]").forEach(host => {
      const target = host.dataset.effectTarget;
      const key = targetToKey[target];
      const input = host.querySelector("input");
      if (!key || !input || document.activeElement === input) return;

      host.removeAttribute("data-effect-modified");
      host.removeAttribute("title");

      const base = Number(stored?.[key]) || 0;
      const effective = applyActiveEffectModifiers(base, target).effective;
      input.value = formatEffectNumber(effective);

      if (String(base) !== String(effective)) {
        host.dataset.effectModified = "true";
        host.title = buildActiveEffectTooltip(target, base, effective);
      }
    });
  });

  const poisonHost = document.querySelector(
    '#fallout-sheet-root .vk-poison-dr[data-effect-target="Poison DR"]'
  );
  const poisonInput = poisonHost?.querySelector(".vk-poison-dr-value");
  if (poisonHost && poisonInput && document.activeElement !== poisonInput) {
    poisonHost.removeAttribute("data-effect-modified");
    poisonHost.removeAttribute("title");

    const base = Number(localStorage.getItem(POISON_DR_KEY) || 0) || 0;
    const effective = applyActiveEffectModifiers(base, "Poison DR").effective;
    poisonInput.value = formatEffectNumber(effective);

    if (String(base) !== String(effective)) {
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

    const base = getBaseNumericCharacterValue(target);
    const effective = getEffectiveDerivedValue(target);
    input.value = formatEffectNumber(effective);

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

    const rawBase = 150 + (getBaseNumericCharacterValue("STR") * 10);
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

      if (!ACTIVE_EFFECT_TARGET_GROUPS[modifier.group]) modifier.group = "SPECIAL";
      groupSelect.value = modifier.group;

      const targetSelect = document.createElement("select");

      function populateTargets() {
        const targets = ACTIVE_EFFECT_TARGET_GROUPS[groupSelect.value] || [];
        targetSelect.innerHTML = "";
        targets.forEach(target => {
          const option = document.createElement("option");
          option.value = target;
          option.textContent = target;
          targetSelect.appendChild(option);
        });

        if (!targets.includes(modifier.target)) modifier.target = targets[0] || "";
        targetSelect.value = modifier.target;
      }

      populateTargets();

      groupSelect.onchange = () => {
        modifier.group = groupSelect.value;
        modifier.target = (ACTIVE_EFFECT_TARGET_GROUPS[modifier.group] || [])[0] || "";
        populateTargets();
      };
      targetSelect.onchange = () => modifier.target = targetSelect.value;

      const operationSelect = document.createElement("select");
      ACTIVE_EFFECT_OPERATIONS.forEach(op => {
        const option = document.createElement("option");
        option.value = op.value;
        option.textContent = op.label;
        operationSelect.appendChild(option);
      });
      operationSelect.value = modifier.operation || "add";
      operationSelect.onchange = () => modifier.operation = operationSelect.value;

      const valueInput = document.createElement("input");
      valueInput.type = "number";
      valueInput.step = "1";
      valueInput.value = Number.isFinite(Number(modifier.value)) ? String(modifier.value) : "0";
      valueInput.oninput = () => modifier.value = Number(valueInput.value || 0);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "vk-effect-remove-modifier";
      removeBtn.textContent = "×";
      removeBtn.title = "Remove modifier";
      removeBtn.disabled = draft.modifiers.length <= 1;
      removeBtn.onclick = () => {
        if (draft.modifiers.length <= 1) return;
        draft.modifiers.splice(index, 1);
        renderModifierRows();
      };

      row.append(groupSelect, targetSelect, operationSelect, valueInput, removeBtn);
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

    draft.modifiers = draft.modifiers.map(mod => ({
      group: mod.group,
      target: mod.target,
      operation: mod.operation,
      value: Number(mod.value) || 0
    }));

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

function renderActiveEffectsSection() {
  const panel = document.createElement("div");
  panel.className = "vk-active-effects-panel";

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
      editBtn.textContent = "Edit";
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
      removeBtn.textContent = "Delete";
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
  return panel;
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
    return sum + (parseItemWeight(item.weight) * qty);
  }, 0);
}

function calculateEquippedWeaponWeight() {
  let rows = [];
  try { rows = JSON.parse(localStorage.getItem("fallout_weapon_table") || "[]"); } catch {}
  return rows.reduce((sum, item) => sum + parseItemWeight(item.weight), 0);
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
  // --- Derived stat manual flags (explicit) ---
	const DERIVED_MANUAL_IDS = ["Maximum HP", "Initiative", "MeleeDamage", "Defense"];
	
	DERIVED_MANUAL_IDS.forEach(id => {
	  const el = inputs[id];
	  const flagKey = id.replace(/\s+/g, "") + "Manual"; // "MaximumHPManual", etc.
	  if (el?.dataset?.manual === "true") existing[flagKey] = true;
	  else delete existing[flagKey];
	});
	
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};


const loadInputs = () => { 
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    Object.entries(inputs).forEach(([key, input]) => { 
        if (input.type === "checkbox") input.checked = data[key] ?? false;
        else {
            input.value = data[key] ?? "";
            input.dataset.baseValue = input.value;
        }
        // --- Derived stat manual flags (explicit) ---
		const DERIVED_MANUAL_IDS = ["Maximum HP", "Initiative", "MeleeDamage", "Defense"];
		
		DERIVED_MANUAL_IDS.forEach(id => {
		  const el = inputs[id];
		  if (!el) return;
		  const flagKey = id.replace(/\s+/g, "") + "Manual";
		  if (data[flagKey]) el.dataset.manual = "true";
		  else delete el.dataset.manual;
		});
    });
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

    if (inputs["Maximum HP"] && !inputs["Maximum HP"].dataset?.manual) {
        const computed = end + lck + level - 1;
        inputs["Maximum HP"].dataset.baseValue = String(computed);
        inputs["Maximum HP"].value = String(computed);
    }

    if (inputs["Initiative"] && !inputs["Initiative"].dataset?.manual) {
        const computed = per + agi;
        inputs["Initiative"].dataset.baseValue = String(computed);
        inputs["Initiative"].value = String(computed);
    }

    if (inputs["Defense"] && !inputs["Defense"].dataset?.manual) {
        const computed = agi >= 9 ? 2 : 1;
        inputs["Defense"].dataset.baseValue = String(computed);
        inputs["Defense"].value = String(computed);
    }

    if (inputs["MeleeDamage"] && !inputs["MeleeDamage"].dataset?.manual) {
        let meleeDamage = "-";
        if (str >= 7 && str <= 8) meleeDamage = "+1d6";
        else if (str >= 9 && str <= 10) meleeDamage = "+2d6";
        else if (str >= 11) meleeDamage = "+3d6";
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

    return {
        TN: calculatedTN,
        Tag: calculatedTag
    };
};




function updateWeaponStats() {
    let weapons = JSON.parse(localStorage.getItem("fallout_weapon_table") || "[]");

    weapons.forEach((weapon, index) => {
        let calculatedStats = calculateWeaponStats(weapon.type);

        // Only update TN if it has not been manually entered
        if (weapon.manualTN === undefined) {
            weapon.TN = calculatedStats.TN;
        }

        weapon.Tag = calculatedStats.Tag;
    });

    localStorage.setItem("fallout_weapon_table", JSON.stringify(weapons));
    // Do NOT update DOM here!
    // Leave DOM updating to updateWeaponTableDOM
}

// Helper for manual override handling
const attachManualOverride = (id) => {
  if (!inputs[id]) return;

  inputs[id].addEventListener("input", (e) => {
    // Ignore programmatic updates (like updateDerivedStats dispatchEvent)
    if (!e.isTrusted) return;

    const v = String(e.target.value ?? "").trim();

    if (v === "") {
      delete inputs[id].dataset.manual;
      updateDerivedStats();
    } else {
      inputs[id].dataset.manual = "true";
    }

    saveInputs();
  });
};


function normalizePerkName(v) {
  return String(v ?? "")
    .trim()
    .replace(/^\[\[/, "")
    .replace(/\]\]$/, "")
    .trim()
    .toUpperCase();
}

function hasGiftedPerk() {
  const raw = localStorage.getItem("fallout_perk_table");
  if (!raw) return false;

  try {
    const perks = JSON.parse(raw);
    if (!Array.isArray(perks)) return false;

    return perks.some(p => normalizePerkName(p.name ?? p.Name) === "GIFTED");
  } catch {
    return false;
  }
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
    section.style.minWidth = "700px";
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
        editBtn.textContent = "✎";
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
            editBtn.textContent = editing ? "Done" : "✎";
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
	    const lck = parseInt(document.getElementById("LCK")?.value, 10) || 0;
		
	    // GIFTED trait reduces starting Luck by 1 (minimum 0)
	    const startingLuck = hasGiftedPerk()
	      ? Math.max(0, lck - 1)
	      : lck;
		
	    const luckInput = document.getElementById("LuckPoints");
	
	    if (luckInput) {
	        luckInput.value = startingLuck;
            luckInput.dataset.baseValue = String(startingLuck);
		
	        // Prevent derived stat recalcs from overwriting GIFTED behavior
	        if (hasGiftedPerk()) {
	            luckInput.dataset.manual = "true";
	        } else {
	            delete luckInput.dataset.manual;
	        }
		
	        luckInput.dispatchEvent(new Event("input", { bubbles: true }));
	    }
		
	    // For Luck Points
	    const luckNum = luckWrapper.querySelector('.plusminus-num');
	    if (luckNum) luckNum.textContent = startingLuck;
		
	    if (typeof renderHPBar === "function") renderHPBar();
	
	    if (typeof loadInputs === "function") loadInputs();
	    if (typeof updateDerivedStats === "function") updateDerivedStats();
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
        input.style.backgroundColor = "#fde4c9";
        input.style.borderRadius = "5px";
        input.style.color = "black";
        input.style.caretColor = 'black';
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
	
	// Visible compact span editor (click value to edit)
	const maxHpCompact = createCompactPlusMinusRow({
	  labelText: "Max HP:",
	  initialValue: maxHpInitial,
	  min: 0,
	  max: 9999,
	  valueTitle: "Click to edit Maximum HP",
	  onChange: (val) => {
		  // If cleared: revert to calculated Max HP (derived), not blank/0
		  if (val === "" || val === null) {
		    // Allow derived stats to set it (your derived code already respects dataset.manual patterns elsewhere)
		    delete maxHpInput.dataset.manual;
		
		    // Trigger your derived stat recalculation (this should repopulate "Maximum HP")
		    if (typeof updateDerivedStats === "function") updateDerivedStats();
		
		    // After update, use whatever is now in the hidden input; if still blank, fall back safely
		    const computed = parseInt(maxHpInput.value, 10);
		    const finalVal = Number.isFinite(computed) ? computed : 0;
		
		    maxHpInput.value = String(finalVal);
		    maxHpInput.dispatchEvent(new Event("input", { bubbles: true }));
		    return;
		  }
		
		  // Non-blank: manual value
		  maxHpInput.dataset.manual = "true";
		  maxHpInput.value = String(val);
		  maxHpInput.dispatchEvent(new Event("input", { bubbles: true }));
	  },
	});
	
	// Make it sit where your old label/input lived
	maxHpCompact.wrap.dataset.effectTarget = "Maximum HP";
    maxHpCompact.valueSpan.classList.add("vk-status-value");
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
        tagCheckbox.style.display = "none";
        skillRow.appendChild(tagCheckbox);

        const tagBadge = document.createElement("span");
        tagBadge.className = "stats-skill-tag-badge";
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
    section.appendChild(skillsDiv);

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

    const derivedEditor = makeSubsectionEditable({
        panel: derivedStats,
        titleEl: derivedTitle,
        titleText: "Derived Stats",
        fieldIds: ["MeleeDamage", "Defense", "Initiative", "Maximum HP"],
        onModeChange: (editing) => {
            // Maximum HP is displayed through the compact control. Current HP,
            // Rads, Luck Points, and New Scene remain usable during normal play.
            maxHpCompact.valueSpan.style.pointerEvents = editing ? "auto" : "none";
            maxHpCompact.valueSpan.style.cursor = editing ? "pointer" : "default";
            maxHpCompact.valueSpan.style.textDecoration = "none";
            if (!editing) maxHpCompact.hideEditor();
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
            skillsDiv.querySelectorAll(".stats-skill-tag-badge").forEach(badge => {
                const cb = [...skillsDiv.querySelectorAll("input")].find(el => el.id === badge.dataset.checkboxId);
                const checked = !!cb?.checked;

                // The stylesheet normally hides TAG badges while editing. Inline
                // !important intentionally overrides that rule so the badge itself
                // becomes the edit control without exposing the source checkbox.
                badge.style.setProperty(
                    "display",
                    (editing || checked) ? "inline-flex" : "none",
                    "important"
                );
                badge.style.setProperty("opacity", editing && !checked ? ".42" : "1", "important");
                badge.style.cursor = editing ? "pointer" : "default";
                badge.style.pointerEvents = editing ? "auto" : "none";
                badge.tabIndex = editing ? 0 : -1;
                badge.setAttribute("aria-pressed", checked ? "true" : "false");
                badge.title = editing
                    ? (checked
                        ? `Tagged skill — click to remove TAG`
                        : `Click to tag this skill`)
                    : "Tagged skill";
            });

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
        [characterInfoEditor, specialEditor, derivedEditor, skillsEditor].forEach(editor => {
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

    // 5. Manual override listeners for derived stats
    ["Maximum HP", "Initiative", "Defense", "MeleeDamage"].forEach(id => attachManualOverride(id));

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
    const CAPS_KEY = 'fallout_Caps'; // Future: use getStorageKey('fallout_Caps', currentCharacter)
    let storedValue = localStorage.getItem(CAPS_KEY) || '0';

    const CapsContainer = document.createElement('div');
    CapsContainer.className = 'vk-caps';
    CapsContainer.style = "padding:10px;border:3px solid #142c3f;border-radius:8px;background:#172a3b;display:flex;align-items:center;margin-bottom:10px;max-width:200px;gap:15px;justify-self:right;";

    const CapsLabel = document.createElement('strong');
    CapsLabel.textContent = 'Caps';
    CapsLabel.style.color = '#EFDD6F';
    CapsLabel.style.fontSize = "1.25em"

    const decreaseIcon = document.createElement('span');
    decreaseIcon.textContent = "−";
    decreaseIcon.style = "cursor:pointer;color:cyan;font-size:15px;margin-left:15px; text-shadow:2px 2px 5px black";

    const increaseIcon = document.createElement('span');
    increaseIcon.textContent = "+";
    increaseIcon.style = "cursor:pointer;color:tomato;font-size:15px; text-shadow:2px 2px 5px black";

    const CapsDisplay = document.createElement('span');
    CapsDisplay.className = "vk-status-value";
    CapsDisplay.textContent = storedValue;
    CapsDisplay.style = "text-align:center;color:#f4ead5;cursor:pointer;fontWeight:bold;font-size:15px;";
    CapsDisplay.addEventListener("mouseenter", () => (CapsDisplay.style.textDecoration = "underline"));
    CapsDisplay.addEventListener("mouseleave", () => (CapsDisplay.style.textDecoration = "none"))

    const CapsInput = document.createElement('input');
    CapsInput.type = 'number';
    CapsInput.style = "width:50px;text-align:center;background:#fde4c9;border:1px solid #fbb4577e;display:none;caret-color:black;color:black;";

    function updateCaps(value) {
        let newValue = Math.max(0, parseInt(value, 10) || 0);
        localStorage.setItem(CAPS_KEY, newValue);
        CapsDisplay.textContent = newValue;
        CapsInput.value = newValue;
    }

    CapsDisplay.onclick = () => {
        CapsInput.value = CapsDisplay.textContent;
        CapsDisplay.style.display = "none";
        CapsInput.style.display = "inline-block";
        CapsInput.focus();
    };
    function exitEditMode(save) {
        if (save) updateCaps(CapsInput.value);
        CapsInput.style.display = "none";
        CapsDisplay.style.display = "inline-block";
    }
    CapsInput.addEventListener("blur", () => exitEditMode(true));
    CapsInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") exitEditMode(true);
        if (e.key === "Escape") exitEditMode(false);
    });

    decreaseIcon.onclick = () => updateCaps(parseInt(CapsDisplay.textContent, 10) - 1);
    increaseIcon.onclick = () => updateCaps(parseInt(CapsDisplay.textContent, 10) + 1);

    CapsContainer.append(CapsLabel, decreaseIcon, CapsDisplay, CapsInput, increaseIcon);

    return CapsContainer;
}
//____________________________________________________________________________________________

// --- Weapon Table Columns ---
const weaponColumns = [
    { label: "Name", key: "link", type: "link" },
    { label: "TN", key: "TN", type: "number" },
    { label: "Tag", key: "Tag", type: "checkbox" },
    { label: "Damage", key: "damage", type: "text" },
    { label: "Rate", key: "rate", type: "text" },
    { label: "Effects", key: "damage_effects", type: "link" },
    { label: "Qualities", key: "qualities", type: "link" },
    { label: "Ammo", key: "ammo", type: "text" },
    { label: "Type", key: "type", type: "text" },
    { label: "Damage Type", key: "dmgtype", type: "text" },
    { label: "Range", key: "range", type: "text" },
    { label: "Weight", key: "weight", type: "text" },
    { label: "Cost", key: "cost", type: "text" },
    { label: "Actions", key: "actions", type: "actions" }
];

// --- Custom Cell Overrides for TN and Tag ---
function weaponCellOverrides() {
    return {
        TN: ({ rowData, col, rowIdx, data, saveAndRender }) => {
    // Always show the saved value, not a live call!
    let value = rowData.TN ?? "";
    const td = document.createElement('td');
    td.style.textAlign = "center";
    td.textContent = value;

    td.onclick = (event) => {
        if (td.querySelector('input')) return;
        const input = document.createElement('input');
        input.type = "number";
        input.value = value;
        input.style.width = "95%";
        input.style.backgroundColor = "#fde4c9";
        input.style.color = "black";
        input.style.caretColor = "black";
        input.onblur = saveInput;
        input.onkeydown = (e) => { if (e.key === "Enter" || e.key === "Escape") input.blur(); };

        function saveInput() {
            let newValue = input.value.trim();
            if (newValue !== "" && newValue !== String(value)) {
                rowData.TN = Number(newValue);
                rowData.manualTN = true; // lock future auto-update
            } else if (newValue === "") {
                delete rowData.manualTN; // unlock
            }
            saveAndRender();
        }
        td.innerHTML = "";
        td.appendChild(input);
        input.focus();
    };
    return td;
},

        Tag: ({ rowData }) => {
            const value = (typeof calculateWeaponStats === "function" && rowData.type)
                ? !!calculateWeaponStats(rowData.type).Tag
                : !!rowData.Tag;

            const td = document.createElement('td');
            td.style.textAlign = "center";
            td.className = "vk-tag-cell";

            if (value) {
                const badge = document.createElement("span");
                badge.className = "vk-tag-badge";
                badge.textContent = "TAG";
                td.appendChild(badge);
            } else {
                const empty = document.createElement("span");
                empty.className = "vk-tag-empty";
                empty.textContent = "—";
                td.appendChild(empty);
            }
            return td;
        },

        actions: ({ rowData, rowIdx, data, saveAndRender }) => {
            const td = document.createElement("td");
            td.style.textAlign = "center";
            const wrap = document.createElement("div");
            wrap.style = "display:flex;align-items:center;justify-content:center;gap:10px;white-space:nowrap;";

            const unequip = document.createElement("span");
            unequip.textContent = "⇩";
            unequip.title = "Unequip to inventory";
            unequip.className = "vk-table-icon-action vk-unequip-action";
            guardObsidianClick(unequip);
            unequip.onclick = async (e) => {
              e.stopPropagation();
              await unequipWeaponToInventory(rowData);
              data.splice(rowIdx, 1);
              saveAndRender();
              window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
              if (typeof updateCarryWeightDisplay === "function") updateCarryWeightDisplay();
              showSheetNotice(`Unequipped ${stripWikiLink(rowData.link || rowData.name || "weapon")}.`);
            };

            const remove = document.createElement("span");
            remove.textContent = "🗑️";
            remove.title = "Remove weapon";
            remove.className = "vk-table-icon-action vk-remove-action";
            guardObsidianClick(remove);
            remove.onclick = (e) => {
              e.stopPropagation();
              data.splice(rowIdx, 1);
              saveAndRender();
            };

            wrap.append(unequip, remove);
            td.appendChild(wrap);
            return td;
        }
    }
}

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
  "Fallout-RPG/Legendary Item Creation/Legendary Weapons/Legendary Weapon Properties";

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
  const effectsAppend = [];     // freeform "Effects" desc lines

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

      if (name === "effects") {
        if (desc) effectsAppend.push(desc);
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

  // Effects are append-only and likely do not overlap
  // Store them in a dedicated field so you can add a column later if desired.
  // (This does NOT overwrite weapon's damage_effects.)
  const baseEffects = String(base.effects_note ?? "").trim();
  const appended = effectsAppend.filter(Boolean);
  const finalEffects = appended.length
	  ? (baseEffects ? [baseEffects, ...appended].join(" , ") : appended.join(" , "))
	  : baseEffects;


  rowData.effects_note = finalEffects;
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

  return { cost, weight, effects };
}

// ---------- fetch addon data (mods + legendary) ----------
async function fetchWeaponAddonData() {
  if (cachedWeaponModData) return cachedWeaponModData;

  const allFiles = await app.vault.getFiles();

  const addonFiles = allFiles.filter(f => {
    const isMod = WEAPON_MOD_FOLDERS.some(folder => f.path.startsWith(folder));
    const isLegendary = f.path.startsWith(LEGENDARY_PROP_FOLDER);
    return isMod || isLegendary;
  });

  const addons = await Promise.all(addonFiles.map(async (file) => {
    const isLegendary = file.path.startsWith(LEGENDARY_PROP_FOLDER);

    // Legendary: keep behavior, but include empty effects so engine is stable
    if (isLegendary) {
      return {
        id: file.path,
        basename: file.basename,
        link: `[[${file.basename}]]`,
        cost: "+0",
        weight: "+0",
        effects: [],
        type: "legendary",
        isLegendary: true
      };
    }

    // Mod: parse statblock including effects schema
    const content = await app.vault.read(file);
    const statblockMatch = content.match(/```statblock([\s\S]*?)```/);
    if (!statblockMatch) return null;

    const block = statblockMatch[1].trim();
    const parsed = parseWeaponModStatblock(block);

    return {
      id: file.path,
      basename: file.basename,
      link: `[[${file.basename}]]`,
      cost: parsed.cost || "+0",
      weight: parsed.weight || "+0",
      effects: parsed.effects || [],
      type: "mod",
      isLegendary: false
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
  results.style.border = '1px solid rgba(0,0,0,0.2)';
  results.style.color = 'black';
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
        border-bottom:${idx < filtered.length - 1 ? "1px solid rgba(0,0,0,0.15)" : "none"};`;
      const left = document.createElement("div");
      left.textContent = m.basename;
      const right = document.createElement("div");
      right.textContent = m.cost ? `Cost ${m.cost}` : "";
      right.style.opacity = "0.8";

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


// --- DRY Weapon Table Section ---
function renderWeaponTableSection() {

    return createEditableTable({
        columns: weaponColumns,
        storageKey: "fallout_weapon_table",
        // Equipping is inventory-driven now; this section only shows equipped weapons.
        fetchItems: null,
        cellOverrides: weaponCellOverrides()
    });
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
  "Fallout-RPG/Legendary Item Creation/Legendary Armor Creation/Legendary Armor Properties";
  
  
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
  const costMatch = statblockContent.match(/cost:\s*([^\n\r]+)/i);
  if (costMatch) out.cost = parseDelta(costMatch[1].replace(/"/g, ""));

  // hp (mods may have hp: "+1")
  const hpMatch = statblockContent.match(/hp:\s*([^\n\r]+)/i);
  if (hpMatch) out.hp = parseDelta(hpMatch[1].replace(/"/g, ""));

  const weightMatch = statblockContent.match(/weight:\s*([^\n\r]+)/i);
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

async function fetchArmorAddonData(isPowerArmor) {
  const cacheKey = isPowerArmor ? "power" : "normal";
  if (cachedArmorAddonData[cacheKey]) return cachedArmorAddonData[cacheKey];

  const allFiles = await app.vault.getFiles();
  
  const modFolders = isPowerArmor ? POWER_ARMOR_MOD_FOLDERS : ARMOR_MOD_FOLDERS;

  const addonFiles = allFiles.filter(f => {
  const isMod = modFolders.some(folder => f.path.startsWith(folder));
  const isLegendary = f.path.startsWith(LEGENDARY_ARMOR_PROP_FOLDER);
	  return isMod || isLegendary;
  });


  const addons = await Promise.all(addonFiles.map(async (file) => {
    const isLegendary = file.path.startsWith(LEGENDARY_ARMOR_PROP_FOLDER);

    if (isLegendary) {
      return {
        id: file.path,
        basename: file.basename,
        link: `[[${file.basename}]]`,
        type: "legendary",
        deltas: { phys: 0, en: 0, rad: 0, cost: 0, hp: 0, weight: 0 }
      };
    }

    const content = await app.vault.read(file);
    const statblockMatch = content.match(/```statblock([\s\S]*?)```/);
    if (!statblockMatch) return null;

    const statblockContent = statblockMatch[1].trim();
    const deltas = parseArmorModStatblock(statblockContent);

    return {
      id: file.path,
      basename: file.basename,
      link: `[[${file.basename}]]`,
      type: "mod",
      deltas
    };
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

function recalcArmorFromAddons(stored, isPowerArmor) {
  ensureArmorBase(stored, isPowerArmor);

  const bPhys = extractFirstInt(stored.base.physdr);
  const bEn   = extractFirstInt(stored.base.endr);
  const bRad  = extractFirstInt(stored.base.raddr);

  const mods = stored.addons || [];
  const dPhys = mods.reduce((s,a) => s + (a?.deltas?.phys || 0), 0);
  const dEn   = mods.reduce((s,a) => s + (a?.deltas?.en   || 0), 0);
  const dRad  = mods.reduce((s,a) => s + (a?.deltas?.rad  || 0), 0);
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
  results.style.border = '1px solid rgba(0,0,0,0.2)';
  results.style.color = 'black';
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
        border-bottom:${idx < filtered.length - 1 ? "1px solid rgba(0,0,0,0.15)" : "none"};`;
      row.onmouseover = () => row.style.background = "#203d55";
      row.onmouseout = () => row.style.background = "";

      const left = document.createElement("div");
      left.textContent = a.basename;

      const right = document.createElement("div");
      if (a.type === "mod") {
        const d = a.deltas;
        right.textContent = `DR +${d.phys}/+${d.en}/+${d.rad}  Val ${d.cost>=0?"+":""}${d.cost}  Wt ${d.weight>=0?"+":""}${d.weight}${isPowerArmor && d.hp ? `  HP ${d.hp>=0?"+":""}${d.hp}` : ""}`;
      } else {
        right.textContent = "Legendary";
      }
      right.style.opacity = "0.8";

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
function renderArmorCard(section) {
    // Container card
    let card = document.createElement('div');
    card.className = "armor-card vk-armor-card"; // shared Vault-Kit armor card
    card.dataset.section = section;
    card.style.background = "#172a3b";
    card.style.border = '3px solid #142c3f';
    card.style.borderRadius = "8px";
    card.style.padding = "10px";
    card.style.margin = "8px";
    card.style.boxShadow = "0 2px 12px rgba(0,0,0,0.14)";
    card.style.minWidth = "250px";
	card.style.marginBottom = '10px';
    card.style.alignItems = 'left';
    card.style.caretColor = 'black';
    
    // Title
    let title = document.createElement("div");
    title.className = "vk-armor-card-header";
    title.textContent = section;
	title.style.display = "flex";
	title.style.justifyContent = "center";
    title.style.color = '#ffe974';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1.7em';
    title.style.textAlign = 'center';
    title.style.borderBottom = "1px solid #ffc200";
    title.style.marginBottom = "15px";
    title.style.borderRadius = "8px";
    title.style.background = "#002757";
    title.style.padding = "5px 1px 5px 15px";
    title.style.display = 'grid';
    title.style.gridTemplateColumns = '85%  15%';
    card.appendChild(title);

    // DR + HP grid
    let statGrid = document.createElement('div');
    statGrid.className = "vk-armor-stats";
    statGrid.style.display = 'grid';
    statGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
    statGrid.style.background = "#172a3b";
    statGrid.style.padding = "10px 0";
    statGrid.style.borderRadius = "5px 5px 0 0";
    statGrid.style.border = '2px solid #223657'
    statGrid.style.justifyContent = "center";
    
    const resetBtn = document.createElement("span");
    resetBtn.className = "vk-card-clear";
	resetBtn.textContent = "Clear Card";
	resetBtn.title = "Reset this card to blank";
	resetBtn.style.alignSelf = "center"
	resetBtn.style.textWrap = "auto";
	resetBtn.style.textShadow = "1px 1px 1px black";
	// Remove all default button styles:
	resetBtn.style.background = "none";
	resetBtn.style.border = "none";
	resetBtn.style.outline = "none";
	resetBtn.style.boxShadow = "none";

	resetBtn.style.fontSize = ".4em";
	resetBtn.style.color = "#ffc200";
	resetBtn.style.cursor = "pointer";
	resetBtn.style.transition = "color 0.2s";
	// Optional: color highlight on hover
	resetBtn.onmouseover = () => { resetBtn.style.color = "tomato"; };
	resetBtn.onmouseout = () => { resetBtn.style.color = "#ffc200"; };
	
	let valueInputRef = null;
	let rerenderAddonsRef = null;
	
	function syncValueUIFromStorage() {
	  const s = loadArmorData(section);
	  if (valueInputRef) valueInputRef.value = s.value ?? "";
	  if (rerenderAddonsRef) rerenderAddonsRef();
	}

	
	// ---- Reset logic ----
	resetBtn.onclick = () => {
	    // Clear the stored data for this section
	    const blankData = {
		  physdr: "",
		  raddr: "",
		  endr: "",
		  hp: "",
		  apparel: "",
		  value: "",
		  weight: "",
		  sourcePath: "",
		  instanceId: "",
		  base: null,
		  addons: []
		};
		saveArmorData(section, blankData);
		
		card.replaceWith(renderArmorCard(section));
		return;
		
		const valueInput = card.querySelector('input[placeholder="Value"]');
		if (valueInput) valueInput.value = "";

		
	    // Clear input fields
	    Object.keys(blankData).forEach((k) => {
	        if (inputs[k]) inputs[k].value = "";
	    });
	    // Clear apparel display/input
	    if (typeof updateApparelDisplay === "function") updateApparelDisplay();
	    // Force card UI to reset to show the blank state
	    // (Optional: call refreshSheet() if you want the entire sheet to refresh)
	    card.querySelectorAll('input[type="text"]').forEach(inp => inp.value = "");
	    if (apparelInput) {
	        apparelInput.value = "";
	        apparelDisplay.innerHTML = "";
	    }
	};
	// Clear Card retained internally as a recovery helper, but no longer exposed in normal UI.
    

    // Field mapping
    let labels = [ ['Phys. DR','physdr'], ['En. DR','endr'], ['Rad. DR','raddr']];
    let inputs = {};

    labels.forEach(([label, key]) => {
        let c = document.createElement('div');
        c.className = "vk-armor-stat";
        const effectTargetByKey = {
          physdr: "Physical DR",
          endr: "Energy DR",
          raddr: "Radiation DR"
        };
        if (effectTargetByKey[key]) c.dataset.effectTarget = effectTargetByKey[key];
        c.style.display = "flex";
        c.style.flexDirection = "column";
        c.style.alignItems = "center";
        c.style.justifyContent = "center";
        let l = document.createElement('span');
        l.className = "vk-field-label";
        l.textContent = label;
        l.style.color = "#ffc200";
        l.style.fontWeight = "bold";
        l.style.marginBottom = "2px";
        l.style.fontSize = "1em";
        let input = document.createElement('input');
        input.className = "vk-field-input";
        input.type = 'text';
        input.style.width = "75%";
        input.style.textAlign = "center";
        input.style.background = "#fde4c9";
        input.style.border = "1px solid #e5c96e";
        input.style.borderRadius = "4px";
        input.style.color = "black";
        inputs[key] = input;
        if (["physdr", "endr", "raddr"].includes(key)) {
          input.addEventListener("focus", () => {
            const fresh = loadArmorData(section);
            input.value = fresh[key] ?? "";
            c.removeAttribute("data-effect-modified");
            c.removeAttribute("title");
          });
          input.addEventListener("blur", () => {
            if (typeof refreshArmorEffectVisuals === "function") refreshArmorEffectVisuals();
          });
        }
        c.appendChild(l); c.appendChild(input);
        statGrid.appendChild(c);
    });

    card.appendChild(statGrid);

    // Apparel/armor markdown field (click-to-edit)
	const apparelBar = document.createElement("div");
    apparelBar.className = "vk-armor-item-row";
	apparelBar.style.background = "#142c3f";
	apparelBar.style.color = "#ffe974";
	apparelBar.style.fontWeight = "bold";
	apparelBar.style.padding = "6px";
	apparelBar.style.margin = "0 0 6px 0";
	apparelBar.style.borderRadius = "0 0 7px 7px";
	apparelBar.style.fontSize = "1.13em";
	apparelBar.style.display = "grid";
	apparelBar.style.gridTemplateColumns = "1fr auto";
	apparelBar.style.alignItems = "center";
	
	const apparelName = document.createElement("div");
    apparelName.className = "vk-armor-item-name";
	apparelName.style.textAlign = "center";
	apparelName.style.cursor = "text"; // keep your click-to-edit behavior
	apparelName.innerHTML = '(Click to edit)';
	
	const armorActions = document.createElement("div");
    armorActions.className = "vk-card-actions";
	armorActions.style = "display:flex;align-items:center;gap:4px;";

	const unequipBtn = document.createElement("button");
    unequipBtn.className = "vk-icon-button vk-unequip-button";
	unequipBtn.textContent = "⇩";
	unequipBtn.title = "Unequip armor to inventory";
	unequipBtn.style.background = "none";
	unequipBtn.style.border = "none";
	unequipBtn.style.cursor = "pointer";
	unequipBtn.style.fontSize = "large";
	unequipBtn.style.color = "#7ee787";
	unequipBtn.style.padding = "0 4px";
	unequipBtn.style.textShadow = "2px 2px 3px black";
	unequipBtn.onclick = async (e) => {
	  e.preventDefault();
	  e.stopPropagation();
	  const current = loadArmorData(section);
	  if (!String(current.apparel || "").trim()) return;
	  const itemName = stripWikiLink(current.apparel || "armor");
	  const moved = await unequipArmorSectionToInventory(section);
	  if (moved) {
	    card.replaceWith(renderArmorCard(section));
	    showSheetNotice(`Unequipped ${itemName}.`);
	  }
	};

	const searchBtn = document.createElement("button");
    searchBtn.className = "vk-icon-button vk-search-button";
	searchBtn.textContent = "⌕";
	searchBtn.title = "Search armor";
	searchBtn.style.background = "none";
	searchBtn.style.border = "none";
	searchBtn.style.outline = "none";
	searchBtn.style.boxShadow = "none";
	searchBtn.style.cursor = "pointer";
	searchBtn.style.fontSize = "large";
	searchBtn.style.color = "#ffc200";
	searchBtn.style.padding = "0 6px";
	searchBtn.style.textShadow = "2px 2px 3px black"
	
    let apparelInput = document.createElement("input");
    apparelInput.type = "text";
    apparelInput.style.width = "100%";
    apparelInput.style.display = "none";
    apparelInput.style.background = "#fde4c9";
    apparelInput.style.textAlign = "center";
    apparelInput.style.color = "black";
    apparelInput.style.borderRadius = "7px";
	
	armorActions.append(unequipBtn);
	apparelBar.append(apparelName, armorActions);
	card.appendChild(apparelBar);
	
	
    function updateApparelDisplay() {
	  let fresh = loadArmorData(section);
	  let val = (typeof fresh.apparel === "string" ? fresh.apparel : "");
	  apparelName.innerHTML = val.trim() !== ""
	    ? val.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>')
	    : '<span class="vk-empty-equipped">Empty — equip from Inventory</span>';
	  apparelInput.value = val;
	}

    // Equipped item names are display-only. Change equipment through Inventory.
    apparelName.style.cursor = "default";
	
	// Direct armor selection removed; equip from Inventory instead.


 


	// ---- Addons + Value container (Normal Armor) ----
	(() => {
	  let stored = loadArmorData(section);
	  ensureArmorBase(stored, false);
	
	  const wrap = document.createElement("div");
      wrap.className = "vk-armor-details";
	  wrap.style.background = "#142c3f";
	  wrap.style.border = "2px solid #223657";
	  wrap.style.borderRadius = "8px";
	  wrap.style.padding = "8px";
	  wrap.style.marginTop = "8px";
	  wrap.style.color = "#ffe974";
	
	  // Row 1: Addons
	  const row1 = document.createElement("div");
      row1.className = "vk-addon-row";
	  row1.style.display = "grid";
	  row1.style.gridTemplateColumns = "auto 1fr auto";
	  row1.style.gap = "8px";
	
	  const lbl = document.createElement("div");
      lbl.className = "vk-field-label";
	  lbl.textContent = "Addons:";
	  lbl.style.fontWeight = "bold";
	  lbl.style.color = "#ffc200";
	
	  const list = document.createElement("div");
      list.className = "vk-addon-list";
	  list.style.display = "flex";
	  list.style.flexWrap = "wrap";
	  list.style.gap = "6px";
	
	  const addBtn = document.createElement("button");
      addBtn.className = "vk-icon-button vk-add-button";
	  addBtn.textContent = "+";
	  addBtn.title = "Add addon";
	  addBtn.style.textShadow = "1px 1px 2px black";
	  addBtn.style.background = '#172a3b';
	  addBtn.style.color = '#ffc200';
	  addBtn.style.fontWeight = 'bold';
	  addBtn.style.border = '1px solid #0000007a';
	  addBtn.style.borderRadius = '6px';
	  addBtn.style.padding = '6px 10px';
	  addBtn.style.cursor = 'pointer';
	
	  const renderList = () => {
	    list.innerHTML = "";
	    stored = loadArmorData(section);
	    ensureArmorBase(stored, false);
	
	    const addons = stored.addons || [];
	    if (!addons.length) {
	      const empty = document.createElement("span");
	      empty.textContent = "None";
	      empty.style.opacity = "0.7";
	      list.appendChild(empty);
	      return;
	    }
	
	    addons.forEach((a) => {
	      const chip = document.createElement("span");
          chip.className = "vk-addon-chip";
	      chip.style = "background:#172a3b;border:1px solid #223657;border-radius:10px;padding:3px 8px;display:inline-flex;align-items:center;gap:6px;";
	      chip.innerHTML = (a.link || "").replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
	
	      const rm = document.createElement("span");
	      rm.textContent = "🗑️";
	      rm.style.textShadow = "2px 2px 5px black"
	      rm.style.cursor = "pointer";
	      rm.title = "Remove addon";
	      rm.onclick = (e) => {
		    e.preventDefault();
	        e.stopPropagation();
	        
	        stored = loadArmorData(section);
	        ensureArmorBase(stored, false);
	        
	        stored.addons = (stored.addons || []).filter(x => x.id !== a.id);
	        recalcArmorFromAddons(stored, false);
	        saveArmorData(section, stored);
	        
	        inputs["physdr"].value = stored.physdr || "";
	        inputs["endr"].value = stored.endr || "";
	        inputs["raddr"].value = stored.raddr || "";

	        valueInput.value = stored.value ?? "";
	        weightInput.value = stored.weight ?? "";
	        // sync UI inputs to computed

	        chip.remove();
	        renderList();
	      };
		  
	      chip.appendChild(rm);
	      list.appendChild(chip);
	    });
	  };
	
	  addBtn.onclick = () => {
	    stored = loadArmorData(section);
	    ensureArmorBase(stored, false);
	    openArmorAddonPicker({
	      stored,
	      isPowerArmor: false,
	      onAdded: () => {
	        saveArmorData(section, stored);
	        const refreshed = loadArmorData(section);
			valueInputRef.value = refreshed.value ?? "";
			weightInput.value = refreshed.weight ?? "";
	        inputs["physdr"].value = refreshed.physdr || "";
	        inputs["endr"].value = refreshed.endr || "";
	        inputs["raddr"].value = refreshed.raddr || "";
	        renderList();
	      }
	    });
	  };
	
	  row1.append(lbl, list, addBtn);
	
	  // Row 2: Value
	  const row2 = document.createElement("div");
      row2.className = "vk-armor-meta";
	  row2.style.display = "grid";
	  row2.style.gridTemplateColumns = "auto 70px auto 70px 1fr";
	  row2.style.alignItems = "center";
	  row2.style.gap = "8px";
	  row2.style.marginTop = "8px";
	
	  const vLbl = document.createElement("div");
      vLbl.className = "vk-field-label";
	  vLbl.textContent = "Value:";
	  vLbl.style.fontWeight = "bold";
	  vLbl.style.color = "#ffc200";
	
	  const valueInput = document.createElement("input");
	  valueInput.type = "text";
      valueInput.className = "vk-field-input";
	  valueInput.placeholder = "Value";
	  valueInput.style.background = '#fde4c9';
	  valueInput.style.color = '#000';
	  valueInput.style.borderRadius = '6px';
	  valueInput.style.border = '1px solid #e5c96e';
	  valueInput.style.padding = '4px 8px';
	  valueInput.style.textAlign = 'center';
	  valueInput.style.maxHeight = '25px';
	  valueInput.style.maxWidth = '55px';
	  valueInput.value = stored.value ?? "";
	
	  const weightLbl = document.createElement("div");
      weightLbl.className = "vk-field-label";
	  weightLbl.textContent = "Weight:";
	  weightLbl.style.fontWeight = "bold";
	  weightLbl.style.color = "#ffc200";

	  const weightInput = document.createElement("input");
	  weightInput.type = "text";
      weightInput.className = "vk-field-input";
	  weightInput.placeholder = "Weight";
	  weightInput.style.background = '#fde4c9';
	  weightInput.style.color = '#000';
	  weightInput.style.borderRadius = '6px';
	  weightInput.style.border = '1px solid #e5c96e';
	  weightInput.style.padding = '4px 8px';
	  weightInput.style.textAlign = 'center';
	  weightInput.style.maxHeight = '25px';
	  weightInput.style.maxWidth = '55px';
	  weightInput.value = stored.weight ?? "";

	  const valueTotal = document.createElement("div");
	  valueTotal.style.opacity = "0.9";
	
	  valueInput.addEventListener("input", () => {
	    stored = loadArmorData(section);
	    ensureArmorBase(stored, false);
	    stored.base.value = valueInput.value.trim();
		recalcArmorFromAddons(stored, false);
		saveArmorData(section, stored); // or savePowerArmorData
		valueInput.value = stored.value ?? "";
	  });
	  
	  valueInputRef = valueInput;
	  rerenderAddonsRef = renderList;
	  
	  weightInput.addEventListener("input", () => {
	    stored = loadArmorData(section);
	    ensureArmorBase(stored, false);
	    stored.base.weight = weightInput.value.trim();
	    recalcArmorFromAddons(stored, false);
	    saveArmorData(section, stored);
	    weightInput.value = stored.weight ?? "";
	  });

	  row2.append(vLbl, valueInput, weightLbl, weightInput, valueTotal);
	
	  wrap.append(row1, row2);
	  card.appendChild(wrap);
	
	  // initial draw
	  renderList();
	})();



    // Initial load
        let stored = loadArmorData(section);
		ensureArmorBase(stored, false);
		recalcArmorFromAddons(stored, false);
		saveArmorData(section, stored); // persist any normalization
		
		labels.forEach(([_, key]) => { inputs[key].value = stored[key] || ""; });
		updateApparelDisplay();

   

    // Storage sync
    // DR inputs show the FINAL value (base + equipped armor mods).
    // When the player manually edits a DR while mods are equipped, store the
    // underlying base as: entered final value - active mod bonus. This prevents
    // the same mod bonus from being applied again after a page refresh.
    labels.forEach(([_, key]) => {
	  inputs[key].addEventListener('input', () => {
	    let stored = loadArmorData(section);
	    ensureArmorBase(stored, false);

	    const entered = inputs[key].value.trim();
	    stored[key] = entered;

	    const deltaKey = {
	      physdr: "phys",
	      endr: "en",
	      raddr: "rad"
	    }[key];

	    if (deltaKey) {
	      const enteredNumber = extractFirstInt(entered);
	      const modDelta = (stored.addons || []).reduce(
	        (sum, addon) => sum + (addon?.deltas?.[deltaKey] || 0),
	        0
	      );

	      if (!Number.isNaN(enteredNumber)) {
	        stored.base[key] = String(enteredNumber - modDelta);
	      } else {
	        // Preserve blank/non-numeric manual entries without trying arithmetic.
	        stored.base[key] = entered;
	      }
	    }

	    saveArmorData(section, stored);
	  });
	});

    apparelInput.addEventListener('input', () => {
        let stored = loadArmorData(section);
        stored.apparel = apparelInput.value;
        apparelDisplay.innerHTML = stored.apparel.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
        saveArmorData(section, stored);
    });
	
	
   

    return card;
}

// --- Poison DR bar (always top of armor section) ---
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
function renderArmorSectionGrid() {
    let container = document.createElement('div');
    container.style.display = "flex";
    container.style.flexDirection = "column";
    
    container.style.gap = "8px";
    // The cards grid (future: wrap with a desktop-positioning container)
    let grid = document.createElement('div');
    grid.className = "armor-cards-grid";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(270px, 1fr))";
    grid.style.gap = "10px";
    ARMOR_SECTIONS.forEach(section => grid.appendChild(renderArmorCard(section)));
    container.appendChild(grid);
    return container;
}


function renderArmorTabsSection() {
    // ---- Main Section Container ----
    const container = document.createElement('div');
    container.className = "vk-armor-shell";
    container.style.marginBottom = "25px";
    container.style.border = "3px solid #142c3f";
    container.style.borderRadius = "8px";
    container.style.padding = "8px 0 0 0";
    container.style.background = "#223657";
	container.style.width = "auto";
	
    // ---- Tabs + Poison DR Row ----
    const topRow = document.createElement('div');
    topRow.className = "vk-armor-toolbar";
    topRow.style.display = "flex";
    topRow.style.alignItems = "center";
    topRow.style.justifyContent = "space-between";
    topRow.style.gap = "10px";
    topRow.style.padding = "0 8px 0 8px";
	topRow.style.width = "auto"
	topRow.style.flexWrap = "wrap";
    // Tabs Bar
    const tabBar = document.createElement('div');
    tabBar.className = "vk-armor-tabs";
    tabBar.style.display = "flex";
    tabBar.style.gap = "2px";

    // Tab buttons
    const normalTab = document.createElement('button');
    normalTab.textContent = "Normal Armor";
    normalTab.style.background = "#FFC200";
    normalTab.style.borderRadius = "6px";
    normalTab.style.border = "1px solid black";
    normalTab.style.fontWeight = "bold";
    normalTab.style.fontSize = "1.25em";
    normalTab.style.color = "#142c3f";
    normalTab.style.cursor = "pointer";
    normalTab.style.padding = "7px 20px 7px 20px";
    normalTab.style.marginRight = "2px";

    const powerTab = document.createElement('button');
    powerTab.textContent = "Power Armor";
    powerTab.style.background = "#172a3b";
    powerTab.style.borderRadius = "6px";
    powerTab.style.border = "1px solid black";
    powerTab.style.fontWeight = "bold";
    powerTab.style.fontSize = "1.25em";
    powerTab.style.color = "#efdd6f";
    powerTab.style.cursor = "pointer";
    powerTab.style.padding = "7px 20px 7px 20px";

    tabBar.appendChild(normalTab);
    tabBar.appendChild(powerTab);

    // Poison DR
    const poisonDRBar = renderPoisonDRBar();
    poisonDRBar.style.margin = "0";
    poisonDRBar.style.maxWidth = "none";
    poisonDRBar.style.flex = "0 0 auto";
    poisonDRBar.style.alignItems = "center";

    // Top row: Tabs left, Poison DR right
    topRow.appendChild(poisonDRBar);
    topRow.appendChild(tabBar);
    

    // ---- Main content: Grids ----
    const normalGrid = renderArmorSectionGrid();
    const powerGrid = renderPowerArmorSectionGrid();
    powerGrid.style.display = "none"; // Hide power by default

    // ---- Tab Switch Logic ----
    normalTab.onclick = () => {
        normalGrid.style.display = "block";
        powerGrid.style.display = "none";
        normalTab.style.background = "#ffc200";
        powerTab.style.background = "#172a3b";
        normalTab.style.color = "#142c3f";
        powerTab.style.color = "#ffc200";
    };
    powerTab.onclick = () => {
        normalGrid.style.display = "none";
        powerGrid.style.display = "block";
        normalTab.style.background = "#172a3b";
        powerTab.style.background = "#ffc200";
        normalTab.style.color = "#ffc200";
        powerTab.style.color = "#142c3f";
    };

    // ---- Assemble Section ----
    container.appendChild(topRow);   // Tabs + Poison DR, same row
    container.appendChild(normalGrid);
    container.appendChild(powerGrid);

    return container;
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
function renderPowerArmorCard(section) {
    let card = document.createElement('div');
    card.className = "armor-card vk-armor-card vk-power-armor-card";
    card.dataset.powerArmorSection = section;
    card.style.background = "#172a3b";
    card.style.border = '3px solid #142c3f';
    card.style.borderRadius = "8px";
    card.style.padding = "10px";
    card.style.margin = "8px";
    card.style.boxShadow = "0 2px 12px rgba(0,0,0,0.14)";
    card.style.minWidth = "250px";
    card.style.marginBottom = '10px';
    card.style.alignItems = 'left';
    card.style.caretColor = 'black';

    // Title
    let title = document.createElement("div");
    title.className = "vk-armor-card-header";
    title.textContent = section;
	title.style.display = "flex";
	title.style.justifyContent = "center";
    title.style.color = '#ffe974';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1.7em';
    title.style.textAlign = 'center';
    title.style.borderBottom = "1px solid #ffc200";
    title.style.marginBottom = "15px";
    title.style.borderRadius = "8px";
    title.style.background = "#002757";
    title.style.padding = "5px 1px 5px 15px";
    title.style.display = 'grid';
    title.style.gridTemplateColumns = '85%  15%';
    card.appendChild(title);

    // DR + HP grid
    let statGrid = document.createElement('div');
    statGrid.className = "vk-armor-stats vk-power-armor-stats";
    statGrid.style.display = 'grid';
    statGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
    statGrid.style.background = "#172a3b";
    statGrid.style.padding = "10px 0";
    statGrid.style.borderRadius = "5px 5px 0 0";
    statGrid.style.border = '2px solid #223657'
    statGrid.style.justifyContent = "center";
    
    // ---- RESET BUTTON ----
	const resetBtn = document.createElement("span");
    resetBtn.className = "vk-card-clear";
	resetBtn.textContent = "Clear Card";
	resetBtn.title = "Reset this card to blank";
	resetBtn.style.alignSelf = "center"
	resetBtn.style.textWrap = "auto";
	resetBtn.style.textShadow = "1px 1px 1px black";
	// Remove all default button styles:
	resetBtn.style.background = "none";
	resetBtn.style.border = "none";
	resetBtn.style.outline = "none";
	resetBtn.style.boxShadow = "none";
	
	resetBtn.style.fontSize = ".4em";
	resetBtn.style.color = "#ffc200";
	resetBtn.style.cursor = "pointer";
	resetBtn.style.transition = "color 0.2s";
	// Optional: color highlight on hover
	resetBtn.onmouseover = () => { resetBtn.style.color = "tomato"; };
	resetBtn.onmouseout = () => { resetBtn.style.color = "#ffc200"; };

	
	// ---- Reset logic ----
	resetBtn.onclick = () => {
	    const blankData = {
		  physdr: "", raddr: "", endr: "", hp: "", apparel: "",
		  value: "", base: null, addons: []
		};

	    savePowerArmorData(section, blankData); // Always use the Power Armor save!
	    
	    card.replaceWith(renderPowerArmorCard(section));
		return;
	    
	    const valueInput = card.querySelector('input[placeholder="Value"]');
		if (valueInput) valueInput.value = "";
	    // Reset input fields
	    labels.forEach(([_, key]) => {
	        if (inputs[key]) inputs[key].value = "";
	    });
	    // Reset apparel
	    if (apparelInput) {
	        apparelInput.value = "";
	        apparelDisplay.innerHTML = "";
	    }
	};

	// Clear Card retained internally as a recovery helper, but no longer exposed in normal UI.

    

    let labels = [ ['Phys. DR','physdr'], ['En. DR','endr'], ['Rad. DR','raddr'], ['HP','hp'] ];
    let inputs = {};

    labels.forEach(([label, key]) => {
        let c = document.createElement('div');
        c.className = "vk-armor-stat";
        const effectTargetByKey = {
          physdr: "Physical DR",
          endr: "Energy DR",
          raddr: "Radiation DR"
        };
        if (effectTargetByKey[key]) c.dataset.effectTarget = effectTargetByKey[key];
        c.style.display = "flex";
        c.style.flexDirection = "column";
        c.style.alignItems = "center";
        c.style.justifyContent = "center";
        
        let l = document.createElement('span');
        l.className = "vk-field-label";
		l.style.display = "inline-flex";
		l.style.alignItems = "center";
		l.style.gap = "6px";
		l.style.color = "#ffc200";
		l.style.fontWeight = "bold";
		l.style.marginBottom = "2px";
		l.style.fontSize = "1em";
		
		const labelText = document.createElement("span");
		labelText.textContent = label;
		l.appendChild(labelText);
		
		// Add repair button for HP only
		if (key === "hp") {
		  const repairBtn = document.createElement("span");
          repairBtn.className = "vk-repair-action";
		  repairBtn.textContent = "🛠️";           // or "↻" if you want consistency
		  repairBtn.title = "Repair: reset HP to base";
		  repairBtn.style.cursor = "pointer";
		  repairBtn.style.fontSize = "1.1em";
		  repairBtn.style.color = "#ffe974";
		  repairBtn.onmouseover = () => repairBtn.style.color = "tomato";
		  repairBtn.onmouseout = () => repairBtn.style.color = "#ffe974";
		
		  repairBtn.onclick = (e) => {
			  e.stopPropagation();
			
			  let stored = loadPowerArmorData(section);
			  ensureArmorBase(stored, true);

			  // Repair = set current HP to max HP and clear manual lock
			  stored.hp = stored.base?.hp ?? stored.hp ?? "";
			  stored.hpManual = false;
			  
			  recalcArmorFromAddons(stored, true);
			  savePowerArmorData(section, stored);
			
			  inputs["hp"].value = stored.hp || "";
			};

		
		  l.appendChild(repairBtn);
		}

        
        let input = document.createElement('input');
        input.className = "vk-field-input";
        input.type = 'text';
        input.style.width = "75%";
        input.style.textAlign = "center";
        input.style.background = "#fde4c9";
        input.style.border = "1px solid #e5c96e";
        input.style.borderRadius = "4px";
        input.style.color = "black";
        inputs[key] = input;
        if (["physdr", "endr", "raddr"].includes(key)) {
          input.addEventListener("focus", () => {
            const fresh = loadPowerArmorData(section);
            input.value = fresh[key] ?? "";
            c.removeAttribute("data-effect-modified");
            c.removeAttribute("title");
          });
          input.addEventListener("blur", () => {
            if (typeof refreshArmorEffectVisuals === "function") refreshArmorEffectVisuals();
          });
        }
        c.appendChild(l); c.appendChild(input);
        statGrid.appendChild(c);
    });
    card.appendChild(statGrid);

    // Apparel (power armor piece) markdown field
	const apparelBar = document.createElement("div");
    apparelBar.className = "vk-armor-item-row";
	apparelBar.style.background = "#142c3f";
	apparelBar.style.color = "#ffe974";
	apparelBar.style.fontWeight = "bold";
	apparelBar.style.padding = "6px";
	apparelBar.style.margin = "0 0 6px 0";
	apparelBar.style.borderRadius = "0 0 7px 7px";
	apparelBar.style.fontSize = "1.13em";
	apparelBar.style.display = "grid";
	apparelBar.style.gridTemplateColumns = "1fr auto";
	apparelBar.style.alignItems = "center";
	
	const apparelName = document.createElement("div");
    apparelName.className = "vk-armor-item-name";
	apparelName.style.textAlign = "center";
	apparelName.style.cursor = "text"; // keep your click-to-edit behavior
	apparelName.innerHTML = '(Click to edit)';
	
	const unequipBtn = document.createElement("button");
    unequipBtn.className = "vk-icon-button vk-unequip-button";
	unequipBtn.textContent = "⇩";
	unequipBtn.title = "Unequip Power Armor to inventory";
	unequipBtn.style.background = "none";
	unequipBtn.style.border = "none";
	unequipBtn.style.cursor = "pointer";
	unequipBtn.style.fontSize = "large";
	unequipBtn.style.color = "#7ee787";
	unequipBtn.style.padding = "0 4px";
	unequipBtn.style.textShadow = "2px 2px 3px black";
	unequipBtn.onclick = async (e) => {
	  e.preventDefault();
	  e.stopPropagation();
	  const current = loadPowerArmorData(section);
	  if (!String(current.apparel || "").trim()) {
	    showSheetNotice("No Power Armor equipped in this slot.", 2500);
	    return;
	  }
	  const itemName = stripWikiLink(current.apparel || "Power Armor");
	  const moved = await unequipPowerArmorSectionToInventory(section);
	  if (moved) {
	    card.replaceWith(renderPowerArmorCard(section));
	    showSheetNotice(`Unequipped ${itemName}.`);
	  }
	};

	const searchBtn = document.createElement("button");
    searchBtn.className = "vk-icon-button vk-search-button";
	searchBtn.textContent = "⌕";
	searchBtn.title = "Search armor";
	searchBtn.style.background = "none";
	searchBtn.style.border = "none";
	searchBtn.style.outline = "none";
	searchBtn.style.boxShadow = "none";
	searchBtn.style.cursor = "pointer";
	searchBtn.style.fontSize = "large";
	searchBtn.style.color = "#ffc200";
	searchBtn.style.padding = "0 6px";
	searchBtn.style.textShadow = "2px 2px 3px black"

    let apparelInput = document.createElement("input");
    apparelInput.type = "text";
    apparelInput.style.width = "100%";
    apparelInput.style.display = "none";
    apparelInput.style.background = "#fde4c9";
    apparelInput.style.textAlign = "center";
    apparelInput.style.color = "#214a72";
    apparelInput.style.borderRadius = "0 0 7px 7px";
    
	const apparelActions = document.createElement("div");
    apparelActions.className = "vk-card-actions";
	apparelActions.style.display = "flex";
	apparelActions.style.alignItems = "center";
	apparelActions.style.gap = "2px";
	apparelActions.append(unequipBtn);

	apparelBar.append(apparelName, apparelActions);
	card.appendChild(apparelBar);
	
	
    function updateApparelDisplay() {
        let fresh = loadPowerArmorData(section);
        let val = (typeof fresh.apparel === "string" ? fresh.apparel : "");
        apparelName.innerHTML = val.trim() !== "" ?
            val.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>') :
            '<span class="vk-empty-equipped">Empty — equip from Inventory</span>';
        apparelInput.value = val;
    }

    // Equipped item names are display-only. Change equipment through Inventory.
    apparelName.style.cursor = "default";
	
	// Direct armor selection removed; equip from Inventory instead.
	// ---- Addons + Value container (Power Armor) ----
	(() => {
	  let stored = loadPowerArmorData(section);
	  ensureArmorBase(stored, true);
	
	  const wrap = document.createElement("div");
      wrap.className = "vk-armor-details";
	  wrap.style.background = "#142c3f";
	  wrap.style.border = "2px solid #223657";
	  wrap.style.borderRadius = "8px";
	  wrap.style.padding = "8px";
	  wrap.style.marginTop = "8px";
	  wrap.style.color = "#ffe974";
	
	  // Row 1: Addons
	  const row1 = document.createElement("div");
      row1.className = "vk-addon-row";
	  row1.style.display = "grid";
	  row1.style.gridTemplateColumns = "auto 1fr auto";
	  row1.style.gap = "8px";
	
	  const lbl = document.createElement("div");
      lbl.className = "vk-field-label";
	  lbl.textContent = "Addons:";
	  lbl.style.fontWeight = "bold";
	  lbl.style.color = "#ffc200";
	
	  const list = document.createElement("div");
      list.className = "vk-addon-list";
	  list.style.display = "flex";
	  list.style.flexWrap = "wrap";
	  list.style.gap = "6px";
	
	  const addBtn = document.createElement("button");
      addBtn.className = "vk-icon-button vk-add-button";
	  addBtn.textContent = "+";
	  addBtn.title = "Add addon";
	  addBtn.style.textShadow = "1px 1px 2px black";
	  addBtn.style.background = '#172a3b';
	  addBtn.style.color = '#ffc200';
	  addBtn.style.fontWeight = 'bold';
	  addBtn.style.border = '1px solid #0000007a';
	  addBtn.style.borderRadius = '6px';
	  addBtn.style.padding = '6px 10px';
	  addBtn.style.cursor = 'pointer';
	
	  const renderList = () => {
	    list.innerHTML = "";
	    stored = loadPowerArmorData(section);
	    ensureArmorBase(stored, true);
	
	    const addons = stored.addons || [];
	    if (!addons.length) {
	      const empty = document.createElement("span");
	      empty.textContent = "None";
	      empty.style.opacity = "0.7";
	      list.appendChild(empty);
	      return;
	    }
	
	    addons.forEach((a) => {
	      const chip = document.createElement("span");
          chip.className = "vk-addon-chip";
	      chip.style =
	        "background:#172a3b;border:1px solid #223657;border-radius:10px;padding:3px 8px;display:inline-flex;align-items:center;gap:6px;";
	
	      // internal link rendering (same style as you use elsewhere)
	      chip.innerHTML = (a.link || "").replace(
	        /\[\[(.*?)\]\]/g,
	        '<a class="internal-link" href="$1">$1</a>'
	      );
	
	      const rm = document.createElement("span");
	      rm.textContent = "🗑️";
	      rm.style.textShadow = "2px 2px 5px black"
	      rm.style.cursor = "pointer";
	      rm.title = "Remove addon";
	      rm.onclick = (e) => {
	        e.preventDefault();
	        e.stopPropagation();
	
	        stored = loadPowerArmorData(section);
	        ensureArmorBase(stored, true);
	
	        stored.addons = (stored.addons || []).filter(x => x.id !== a.id);
	        recalcArmorFromAddons(stored, true);
	        savePowerArmorData(section, stored);
	
	        // sync UI inputs to computed
	        inputs["physdr"].value = stored.physdr || "";
	        inputs["endr"].value = stored.endr || "";
	        inputs["raddr"].value = stored.raddr || "";
	        inputs["hp"].value = stored.hp || "";
	
	        valueInput.value = stored.value ?? "";
	
	        // ensure visual removal even if rerender is delayed
	        chip.remove();
	        renderList();
	      };
	
	      chip.appendChild(rm);
	      list.appendChild(chip);
	    });
	  };
	
	  addBtn.onclick = () => {
	    stored = loadPowerArmorData(section);
	    ensureArmorBase(stored, true);
	
	    openArmorAddonPicker({
	      stored,
	      isPowerArmor: true,
	      onAdded: () => {
	        savePowerArmorData(section, stored);
	
	        inputs["physdr"].value = stored.physdr || "";
	        inputs["endr"].value = stored.endr || "";
	        inputs["raddr"].value = stored.raddr || "";
	        inputs["hp"].value = stored.hp || "";
	
	        valueInput.value = stored.value ?? "";
	        renderList();
	      }
	    });
	  };
	
	  row1.append(lbl, list, addBtn);
	
	  // Row 2: Value (dynamic)
	  const row2 = document.createElement("div");
      row2.className = "vk-armor-meta";
	  row2.style.display = "grid";
	  row2.style.gridTemplateColumns = "auto 120px 1fr";
	  row2.style.alignItems = "center";
	  row2.style.gap = "8px";
	  row2.style.marginTop = "8px";
	
	  const vLbl = document.createElement("div");
      vLbl.className = "vk-field-label";
	  vLbl.textContent = "Value:";
	  vLbl.style.fontWeight = "bold";
	  vLbl.style.color = "#ffc200";
	
	  const valueInput = document.createElement("input");
	  valueInput.type = "text";
      valueInput.className = "vk-field-input";
	  valueInput.placeholder = "Value";
	  valueInput.style.background = '#fde4c9';
	  valueInput.style.color = '#000';
	  valueInput.style.borderRadius = '6px';
	  valueInput.style.border = '1px solid #e5c96e';
	  valueInput.style.padding = '4px 8px';
	  valueInput.style.textAlign = 'center';
	  valueInput.style.maxHeight = '25px';
	  valueInput.style.maxWidth = '55px';
	  valueInput.value = stored.value ?? "";
	
	  valueInput.addEventListener("input", () => {
	    stored = loadPowerArmorData(section);
	    ensureArmorBase(stored, true);
	
	    stored.base.value = valueInput.value.trim();
	    recalcArmorFromAddons(stored, true);
	    savePowerArmorData(section, stored);
	
	    valueInput.value = stored.value ?? "";
	  });
	
	  row2.append(vLbl, valueInput);
	
	  wrap.append(row1, row2);
	  card.appendChild(wrap);
	
	  renderList();
	})();

    // Initial load
	let stored = loadPowerArmorData(section);
	ensureArmorBase(stored, true);
	
	// Only recalc if there are addons that matter
	if (Array.isArray(stored.addons) && stored.addons.length) {
	  recalcArmorFromAddons(stored, true);
	  savePowerArmorData(section, stored);
	}
	
	labels.forEach(([_, key]) => { inputs[key].value = stored[key] || ""; });
	updateApparelDisplay();



    // Storage sync (non-HP fields)
	labels.forEach(([_, key]) => {
	  if (key === "hp") return; // HP handled separately
	
	  inputs[key].addEventListener("input", () => {
	    let stored = loadPowerArmorData(section);
	    ensureArmorBase(stored, true);
	
	    stored[key] = inputs[key].value;
	
	    // If you want manual edits to become the new base for these stats:
	    if (stored.base) {
	      if (key === "physdr") stored.base.physdr = stored[key];
	      if (key === "endr")   stored.base.endr   = stored[key];
	      if (key === "raddr")  stored.base.raddr  = stored[key];
	    }
	
	    savePowerArmorData(section, stored);
	  });
	});
	
	// --- Power Armor HP manual save (attach ONCE) ---
	const hpInput = inputs.hp;
	
	hpInput.addEventListener("input", () => {
	  let stored = loadPowerArmorData(section);
	  ensureArmorBase(stored, true);
	
	  stored.hp = hpInput.value;   // current/damaged HP
	  stored.hpManual = true;      // prevents auto overwrite on recalc/repair logic
	
	  savePowerArmorData(section, stored);
	});
	
	hpInput.addEventListener("blur", () => {
	  let stored = loadPowerArmorData(section);
	  ensureArmorBase(stored, true);
	
	  stored.hp = hpInput.value;
	  stored.hpManual = true;
	
	  savePowerArmorData(section, stored);
	});

    return card;
}

// The grid container for Power Armor, using same UX as normal
function renderPowerArmorSectionGrid() {
    let container = document.createElement('div');
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "flex-start";
    container.style.width = "100%";
    container.style.gap = "8px";
    // Optional: container.appendChild(renderPoisonDRBar());
    let grid = document.createElement('div');
    grid.className = "armor-cards-grid";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(270px, 1fr))";
    grid.style.gap = "10px";
    PA_ARMOR_SECTIONS.forEach(section => grid.appendChild(renderPowerArmorCard(section)));
    container.appendChild(grid);
    return container;
}


/* 
    -- HOW TO SWITCH TO DESKTOP "AROUND VAULT BOY" LAYOUT --
    - Add a .armor-cards-grid class in your CSS for desktop screens that uses absolute positioning, or CSS grid, to place each .armor-card around an image.
    - On mobile, let it stay stacked in a grid as here.
    - All JS remains unchanged!
*/


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

function showCoreChargeEditor({ rowData, unit = null, onSave }) {
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
    guardObsidianClick(input);
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
  saveBtn.textContent = editing ? "Save" : "Add Core";
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
  wrap.style = "display:flex;align-items:center;gap:8px;flex-wrap:wrap;";
  const label = document.createElement("span");
  label.textContent = "Charges:";
  label.style = "color:#efdd6f;font-weight:normal;";
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
    const chip = document.createElement("span");
    const max = coreType === "plasma" ? 500 : Number(unit.maxCharges ?? 0);
    chip.textContent = `${Number(unit.charges ?? 0)} / ${max}`;
    chip.title = "Click to edit charge";
    chip.style = "display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;color:#c5c5c5;background:#383838ab;cursor:pointer;";
    guardObsidianClick(chip);
    chip.onclick = (e) => {
      e.stopPropagation();
      showCoreChargeEditor({ rowData, unit, onSave: (updated) => {
        rowData.chargeUnits[index] = updated;
        syncChargeTrackedCoreQty(rowData);
        saveAndRender();
      }});
    };

    const remove = document.createElement("span");
    remove.textContent = " 🗑️";
    remove.title = "Remove this core";
    remove.style = "cursor:pointer;text-shadow:2px 2px 5px black;";
    guardObsidianClick(remove);
    remove.onclick = (e) => {
      e.stopPropagation();
      rowData.chargeUnits.splice(index, 1);
      syncChargeTrackedCoreQty(rowData);
      saveAndRender();
    };
    chip.appendChild(remove);
    wrap.appendChild(chip);
  });

  const add = document.createElement("span");
  add.textContent = "+";
  add.title = "Add core";
  add.style = "color:#ffc200;font-weight:bold;cursor:pointer;font-size:1.15em;padding:0 6px;text-shadow:2px 2px 5px black;";
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
    let gearFiles = allFiles.filter(file =>
        GEAR_SEARCH_FOLDERS.some(folder => file.path.startsWith(folder))
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

  const baseCostNum = parseFirstNumber(base.cost);
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
    delete rowData.instanceId;
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
  results.style = "background:#fde4c9;border-radius:8px;max-height:280px;overflow:auto;border:1px solid rgba(0,0,0,.2);color:black;";
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
      r.style = `padding:8px 10px;cursor:pointer;display:flex;justify-content:space-between;border-bottom:${idx < filtered.length - 1 ? "1px solid rgba(0,0,0,.15)" : "none"};`;
      const left = document.createElement("div"); left.textContent = def.basename;
      const right = document.createElement("div"); right.style.opacity = ".8";
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
  const wrap = document.createElement("span");
  wrap.style = "display:inline-flex;flex-wrap:wrap;gap:8px;align-items:center;";

  const add = document.createElement("span");
  add.textContent = "+";
  add.title = "Add mod";
  add.style = "color:#ffc200;font-weight:bold;cursor:pointer;padding:0 4px;font-size:1.2em;text-shadow:2px 2px 5px black;";
  add.onclick = e => {
    e.stopPropagation();
    openInventoryModPicker({ rowData, rowIdx, data, saveAndRender });
  };

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
      chip.appendChild(makeInventoryAddonLink(addon.link || `[[${String(addon.id || "").split("/").pop()?.replace(/\.md$/i, "") || "Mod"}]]`));
      const rm = document.createElement("span");
      rm.textContent = "🗑️";
      rm.title = "Remove mod";
      rm.style = "cursor:pointer;text-shadow:2px 2px 5px black;";
      rm.onclick = async e => {
        e.stopPropagation();
        rowData.addons = (rowData.addons || []).filter(x => x.id !== addon.id);
        await recalcInventoryItemFromSources(rowData);
        saveAndRender();
      };
      chip.appendChild(rm);
      wrap.appendChild(chip);
    });
  }

  td.append(label, add, wrap);
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
  const unique = !!copy.instanceId || hasInventoryMods(copy) || isChargeTrackedCore(copy);
  if (unique) {
    copy.qty = isChargeTrackedCore(copy) ? String((copy.chargeUnits || []).length) : "1";
    rows.push(copy);
    return;
  }
  const id = getItemIdentity(copy);
  const existing = rows.find(r => !r.instanceId && !hasInventoryMods(r) && !isChargeTrackedCore(r) && getItemIdentity(r) === id);
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
  if (rowData.instanceId) equipped.instanceId = rowData.instanceId;
  equipped.addons = await fullWeaponAddonsFromInventory(rowData.addons);
  ensureWeaponBaseSnapshot(equipped);
  recalcWeaponFromAddons(equipped);

  if (typeof calculateWeaponStats === "function" && equipped.type) {
    const stats = calculateWeaponStats(equipped.type);
    equipped.TN = stats.TN;
    equipped.Tag = stats.Tag;
  }

  if (getWeaponChargedCoreType(equipped)) {
    const selection = await showWeaponCorePicker(equipped, { actionLabel: "Equip", allowNone: true });
    if (selection.cancelled) return false;
    equipped.loadedCore = selection.loadedCore;
  } else {
    delete equipped.loadedCore;
  }

  const weapons = JSON.parse(localStorage.getItem("fallout_weapon_table") || "[]");
  weapons.push(equipped);
  localStorage.setItem("fallout_weapon_table", JSON.stringify(weapons));
  if (typeof updateWeaponTableDOM === "function") updateWeaponTableDOM();
  return true;
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
  if (rowData.instanceId) item.instanceId = rowData.instanceId;
  else if (addons.length) item.instanceId = makeInventoryInstanceId();
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
  return lightweightInventoryAddons(addons).map(a => {
    const def = defs.find(d => d.id === a.id);
    return def ? JSON.parse(JSON.stringify(def)) : a;
  });
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
    addons
  };
  if (stored.instanceId) item.instanceId = stored.instanceId;
  else if (addons.length) item.instanceId = makeInventoryInstanceId();
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
  if (String(occupied.apparel || "").trim()) {
    const oldItem = await armorStoredToInventory(occupied, section);
    if (oldItem) {
      const rows = getGearRows();
      mergeInventoryRecord(rows, oldItem);
      saveGearRows(rows);
    }
  }

  const stored = {
    physdr: def.physdr,
    raddr: def.raddr,
    endr: def.endr,
    apparel: rowData.name || `[[${def.link}]]`,
    sourcePath: rowData.sourcePath || def.sourcePath || "",
    instanceId: rowData.instanceId || (hasInventoryMods(rowData) ? makeInventoryInstanceId() : ""),
    value: def.value ?? "0",
    weight: def.weight ?? "0",
    base: { physdr:def.physdr, endr:def.endr, raddr:def.raddr, value:def.value ?? "0", weight:def.weight ?? "0" },
    addons: await fullArmorAddonsFromInventory(rowData.addons)
  };
  recalcArmorFromAddons(stored, false);
  saveArmorData(section, stored);
  const oldCard = document.querySelector(`.armor-card[data-section="${section}"]`);
  if (oldCard) oldCard.replaceWith(renderArmorCard(section));
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
  return lightweightInventoryAddons(addons).map(a => {
    const def = defs.find(d => d.id === a.id);
    return def ? JSON.parse(JSON.stringify(def)) : a;
  });
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
    addons,
    powerArmorState: { hp: String(stored.hp ?? "") }
  };

  if (stored.instanceId) item.instanceId = stored.instanceId;
  else item.instanceId = makeInventoryInstanceId();

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
  if (String(occupied.apparel || "").trim()) {
    const oldItem = await powerArmorStoredToInventory(occupied, section);
    if (oldItem) {
      const rows = getGearRows();
      mergeInventoryRecord(rows, oldItem);
      saveGearRows(rows);
    }
  }

  const hasSavedHp = rowData?.powerArmorState && rowData.powerArmorState.hp !== undefined && rowData.powerArmorState.hp !== null;
  const savedHp = hasSavedHp ? String(rowData.powerArmorState.hp) : String(def.hp ?? "");

  const stored = {
    physdr: def.physdr,
    raddr: def.raddr,
    endr: def.endr,
    hp: savedHp,
    apparel: rowData.name || `[[${def.link}]]`,
    sourcePath: rowData.sourcePath || def.sourcePath || "",
    instanceId: rowData.instanceId || makeInventoryInstanceId(),
    value: def.value ?? "0",
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
}

async function equipInventoryItem(rowData, rowIdx, data, saveAndRender) {
  const kind = getInventoryModKind(rowData);
  if (kind === "weapon") {
    const didEquip = await equipWeaponFromInventory(rowData);
    if (!didEquip) return;
    const qty = Math.max(1, parseInt(rowData.qty ?? 1, 10) || 1);
    if (qty > 1 && !rowData.instanceId && !hasInventoryMods(rowData)) rowData.qty = String(qty - 1);
    else data.splice(rowIdx, 1);
    saveAndRender();
    showSheetNotice(`Equipped ${stripWikiLink(rowData.name || "weapon")}.`);
    return;
  }
  if (kind === "armor") {
    const sections = await getCompatibleArmorSections(rowData);
    if (!sections.length) { showSheetNotice("No compatible armor slot found for this item.", 3000); return; }
    showArmorSlotPicker(rowData, sections, async section => {
      try {
        await equipArmorFromInventory(rowData, section);
        const qty = Math.max(1, parseInt(rowData.qty ?? 1, 10) || 1);
        if (qty > 1 && !rowData.instanceId && !hasInventoryMods(rowData)) rowData.qty = String(qty - 1);
        else data.splice(rowIdx, 1);
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
        await equipPowerArmorFromInventory(rowData, section);
        const qty = Math.max(1, parseInt(rowData.qty ?? 1, 10) || 1);
        if (qty > 1 && !rowData.instanceId && !hasInventoryMods(rowData) && !rowData.powerArmorState) rowData.qty = String(qty - 1);
        else data.splice(rowIdx, 1);
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
  return container;
}


function formatGearWeightDisplay(rowData) {
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
        const wrap = document.createElement("div");
        wrap.style = "display:flex;align-items:center;justify-content:center;gap:10px;white-space:nowrap;";

        const equipKind = getInventoryModKind(rowData);
        if (equipKind === "weapon" || equipKind === "armor" || equipKind === "powerArmor") {
          const equip = document.createElement("span");
          equip.textContent = "⇧";
          equip.title = "Equip item";
          equip.style = "cursor:pointer;color:#7ee787;font-size:1.2em;font-weight:bold;text-shadow:2px 2px 5px black;";
          guardObsidianClick(equip);
          equip.onclick = async (e) => {
            e.stopPropagation();
            try { await equipInventoryItem(rowData, rowIdx, data, saveAndRender); }
            catch (err) { console.error(err); showSheetNotice(String(err?.message || err), 3500); }
          };
          wrap.appendChild(equip);
        }

        const transfer = document.createElement("span");
        transfer.textContent = "⇄";
        transfer.title = "Transfer to vehicle";
        transfer.style = "cursor:pointer;color:#ffc200;font-size:1.25em;font-weight:bold;text-shadow:2px 2px 5px black;";
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

        const remove = document.createElement("span");
        remove.textContent = "🗑️";
        remove.title = "Remove item";
        remove.style = "cursor:pointer;text-shadow:2px 2px 5px black;";
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

async function renderMarkdownInto(containerEl, mdText) {
  containerEl.innerHTML = "";

  const md = String(mdText ?? "");

  try {
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
      await window.MarkdownRenderer.render(app, md, containerEl, "", null);
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
	cachedPerkData = null;
    if (cachedPerkData) return cachedPerkData;

    let allFiles = await app.vault.getFiles();
    let perkFiles = allFiles.filter(file => PERK_SEARCH_FOLDERS.some(folder => file.path.startsWith(folder)));

    let perkItems = await Promise.all(perkFiles.map(async (file) => {
        let content = await app.vault.read(file);

        let stats = {
            name: `[[${file.basename}]]`,
            qty: "1", // Default rank
            description: "No description available"
        };

        let rankMatch = content.match(/Ranks?:\s*(\d+)/i);
        if (rankMatch) stats.qty = rankMatch[1];
		
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
    { label: "Name", key: "name", type: "link" },         // Obsidian link, editable on cell except link click
    { label: "Rank", key: "qty", type: "number" },         // Editable
    { label: "Description", key: "description", type: "text" }, // Editable, full text
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

function addGearSearchItem(item) {
  const rows = JSON.parse(localStorage.getItem(GEAR_STORAGE_KEY) || "[]");

  if (isChargeTrackedCore(item)) {
    item.chargeUnits = [];
    showCoreChargeEditor({
      rowData: item,
      onSave: (newUnit) => {
        item.chargeUnits.push(newUnit);
        syncChargeTrackedCoreQty(item);
        rows.push(item);
        saveGearRowsAndRefresh(rows);
      }
    });
    return;
  }

  rows.push(item);
  saveGearRowsAndRefresh(rows);
}

function loadInventoryViewIndex() {
  const saved = String(localStorage.getItem(INVENTORY_VIEW_KEY) || "WEAPONS").toUpperCase();
  const idx = INVENTORY_CATEGORIES.findIndex(category => category.key === saved);
  return idx >= 0 ? idx : 0;
}

function renderGearTableSection() {
  const outer = document.createElement("div");
  outer.className = "vk-inventory-panel";
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

  const addWrap = createSearchBar({
    fetchItems: fetchGearData,
    onSelect: addGearSearchItem
  });
  addWrap.style.marginBottom = "0";
  addWrap.style.flex = "1 1 280px";
  addWrap.style.maxWidth = "520px";
  const addInput = addWrap.querySelector("input");
  if (addInput) addInput.placeholder = "Add Item";

  controls.append(switcher, addWrap);
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


function renderPerkTableSection() {
  return createEditableTable({
    columns: perkColumns,
    storageKey: PERK_STORAGE_KEY,
    fetchItems: fetchPerkData,
    cellOverrides: {
      description: ({ rowData, col, saveAndRender }) => {
        const td = document.createElement("td");
        td.style.textAlign = "left";
        td.style.verticalAlign = "top";
        td.style.whiteSpace = "normal";
        td.style.color = "#c5c5c5"
        td.style.fontSize = "12px"

        const view = document.createElement("div");
        view.style.whiteSpace = "normal";
        view.style.cursor = "pointer";

        function render() {
          renderPerkMarkdown(rowData.description ?? "", view);
        }
        render();

        td.addEventListener("click", (e) => {
          // Let internal links work
          if (e.target.closest("a")) return;
          if (td.querySelector("textarea")) return;

          const ta = document.createElement("textarea");
          ta.value = String(rowData.description ?? "");
          ta.style.width = "98%";
          ta.style.minHeight = "120px";
          ta.style.backgroundColor = "#fde4c9";
          ta.style.color = "black";
          ta.style.caretColor = "black";

          ta.onblur = () => {
            rowData.description = ta.value;
            saveAndRender();
          };

          ta.onkeydown = (ev) => {
            if (ev.key === "Escape") ta.blur();
            if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) ta.blur();
          };

          td.innerHTML = "";
          td.appendChild(ta);
          ta.focus();
        });

        td.appendChild(view);
        return td;
      },
    },
  });
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
  section.className = "vk-injury-panel";
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

  const searchResults = document.createElement("div");
  searchResults.style.position = "absolute";
  searchResults.style.left = "0";
  searchResults.style.right = "0";
  searchResults.style.top = "calc(100% + 3px)";
  searchResults.style.zIndex = "999";
  searchResults.style.background = "#10283a";
  searchResults.style.color = "#000";
  searchResults.style.border = "1px solid #d3b65d";
  searchResults.style.borderRadius = "5px";
  searchResults.style.boxShadow = "0 4px 10px #0005";
  searchResults.style.maxHeight = "220px";
  searchResults.style.overflowY = "auto";
  searchResults.style.display = "none";

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

      const remove = document.createElement("span");
      remove.textContent = "🗑️";
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
      none.style.color = "#555";
      searchResults.appendChild(none);
      searchResults.style.display = "block";
      return;
    }

    matches.forEach((chem, idx) => {
      const row = document.createElement("div");
      row.textContent = chem.displayName;
      row.style.padding = "7px 9px";
      row.style.cursor = "pointer";
      row.style.borderBottom = idx < matches.length - 1 ? "1px solid #0002" : "none";
      row.onmouseenter = () => row.style.background = "#203d55";
      row.onmouseleave = () => row.style.background = "";
      row.onclick = () => addAddiction(chem);
      searchResults.appendChild(row);
    });

    searchResults.style.display = "block";
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

  // Close the result list when clicking elsewhere in this section.
  section.addEventListener("click", (e) => {
    if (!pickerWrap.contains(e.target)) searchResults.style.display = "none";
  });

  pickerWrap.append(chemInput, searchResults);
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
    appendCollapsibleSection(
        sheetcontainer,
        "Equipped Weapons",
        "equipped-weapons",
        weaponTableContainer
    );

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
