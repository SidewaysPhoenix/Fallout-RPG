```js-engine


function showConfirm(message, onYes, onNo) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;
        background:rgba(30,40,50,0.46);z-index:9999;display:flex;align-items:center;justify-content:center;`;

    const modal = document.createElement('div');
    modal.style = `
        background:#325886;padding:24px 22px;border-radius:14px;
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
    noBtn.style = "background:#325886;color:#ffc200;font-weight:bold;padding:6px 18px;border-radius:6px;border:2px solid #ffc200;cursor:pointer;font-size:1em;";

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
        background:#ffc200;color:#2e4663;font-weight:bold;
        padding:13px 38px;border-radius:9px;z-index:99999;
        font-size:1.25em;box-shadow:0 2px 18px #0003;
        border:2px solid #2e4663;text-align:center;
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
        'fallout_terminal_notes'
    ]; 

    const bar = document.createElement('div');
	bar.style.display = "flex"
	bar.style.justifyContent = "space-between"
	bar.style.gap = "8px"
	bar.style.alignItems = "center"
	bar.style.background = "#325886"
	bar.style.padding = "6px 10px 6px 10px"
	bar.style.marginBottom = "18px"
	bar.style.borderRadius = "7px"
	bar.style.border = "1px solid #ffc200"
	bar.style.width = "auto"
	
    // --- Export Button ---
    const exportBtn = document.createElement('button');
    exportBtn.textContent = "Export Character";
    exportBtn.style = "font-weight:bold;color:#2e4663;background:#ffc200;border-radius:5px;padding:6px 16px;cursor:pointer";
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
    importBtn.style = "font-weight:bold;color:#ffc200;background:#2e4663;border-radius:5px;padding:6px 16px;cursor:pointer";
    importBtn.onclick = () => {
    // Build modal elements
    const overlay = document.createElement('div');
    overlay.style = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;
        background:rgba(30,40,50,0.86);z-index:9999;display:flex;align-items:center;justify-content:center;`;

    const modal = document.createElement('div');
    modal.style = `
        background:#325886;padding:24px 22px;border-radius:14px;
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
    importCancel.style = "background:#325886;color:#ffc200;font-weight:bold;padding:6px 16px;border-radius:6px;border:2px solid #ffc200;cursor:pointer;font-size:1em;";
    
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
		        "fallout_terminal_notes"
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


const weaponTableContainer = document.createElement('div');
weaponTableContainer.id = 'weapon-table-container';


function updateWeaponTableDOM() {
    weaponTableContainer.innerHTML = '';
    weaponTableContainer.appendChild(renderWeaponTableSection());
}

// ---- TABLE UTILITIES: DRY Table & Cell Helpers ----

// --- DRY Section Header Utility ---
function createSectionHeader(text, size = "2em", color = "#ffc200", extraStyles = {}) {
    const header = document.createElement("div");
    header.textContent = text;
    header.style.fontWeight = "bold";
    header.style.fontSize = size;
    header.style.color = color;
    header.style.margin = "18px 0 6px 0";
    Object.assign(header.style, extraStyles);
    return header;
}



// 1. Creates a full editable table, with optional search bar to add new rows
function createEditableTable({ columns, storageKey, fetchItems, cellOverrides = {} }) {
    let data = JSON.parse(localStorage.getItem(storageKey) || "[]");

    // --- Sorting State ---
    let sortKey = null;
    let sortAsc = true;

    // DOM setup
    const tablecontainer = document.createElement('div');
    tablecontainer.style.padding = '15px';
    tablecontainer.style.border = '3px solid #2e4663';
    tablecontainer.style.borderRadius = '8px';
    tablecontainer.style.backgroundColor = '#325886';
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
			    data.push(item);
			    saveAndRender();
			}

	    });
	    tablecontainer.appendChild(searchBar);
	}

    // Table and header
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.marginBottom = '10px';
    
    if (storageKey === "fallout_weapon_table") {
	  table.classList.add("fallout-weapon-table");
	}


    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // --- Header + Sorting ---
    columns.forEach(col => {
	    if (col.hidden) return;
        const th = document.createElement('th');
        th.textContent = col.label;
        th.style.textAlign = 'center';
        th.style.cursor = 'pointer';
        th.style.userSelect = 'none';
 
        // Show sort indicator
        th.onclick = () => {
            if (sortKey === col.key) {
                sortAsc = !sortAsc;
            } else {
                sortKey = col.key;
                sortAsc = true;
            }
            saveAndRender();
        };

        // Add arrow for current sort column
        if (col.key === sortKey) {
            th.textContent += sortAsc ? ' ▲' : ' ▼';
            th.style.color = "#ffc200";
        }

        headerRow.appendChild(th);
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
            data.sort((a, b) => {
			  let vA = a[sortKey];
			  let vB = b[sortKey];
			
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

        data.forEach((rowData, rowIdx) => {
		  // ----- main weapon row -----
		  const row = document.createElement('tr');
		  if (storageKey === "fallout_weapon_table") row.classList.add("weapon-main-row");
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
		  
		  
		  
		  // ----- effects secondary row (weapon table only; now ALWAYS shown) -----
		  if (storageKey === "fallout_weapon_table") {
		    const effectsRaw = String(rowData.effects_note ?? "").trim();
		
		    const effectsRow = document.createElement("tr");
		    effectsRow.classList.add("weapon-effects-row");
		
		    // 1) AMMO CELL (first cell)
			const ammoCell = document.createElement("td");
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
			
			if (ammoInfo.mode === "none") {
			  // leave cell empty
			} else if (ammoInfo.mode === "infinite") {
			  const inf = document.createElement("span");
			  inf.textContent = "Anything";
			  inf.style.fontWeight = "normal";
			  inf.style.color = "#efdd6f";
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
			
			    const row = createCompactPlusMinusRow({
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
			      },
			    });
			
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
			modsRow.classList.add("weapon-mods-row");
			
		    // 3-cell layout: | (blank) | Mods list | add button | // turn on below
		    //const blank = document.createElement("td");
		    //blank.textContent = "";
		    //blank.style.width = "1%"; // keeps it tight
		    //blank.style.background = "#06080c60";
		    //blank.style.background = "#383838ab";
		    //blank.style.background = "#325886";
		
		    const modsCell = document.createElement("td");
		    modsCell.colSpan = Math.max(1, columns.length - 1); //set to columns.length - 2 to enable blank cell
		    modsCell.style.textAlign = "left";
		    modsCell.style.padding = "6px 10px";
		    modsCell.style.background = "#383838ab";
			//modsCell.style.background = "#383838ab";
		
		    const label = document.createElement("span");
		    label.textContent = "Addons: ";
		    label.style.fontWeight = "normal";
		    label.style.color = "#efdd6f";
		
		    const modsWrap = document.createElement("span");
		
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
		        chip.style.marginLeft = "6px";
		
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
		
		    modsCell.append(label, modsWrap);
		
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
		  }
		});

        

        // Update headers to show sort indicator after rerender
        // (Clear and recreate header row)
        thead.innerHTML = '';
        const sortedHeaderRow = document.createElement('tr');
        columns.forEach(col => {
	        if (col.hidden) return;
            const th = document.createElement('th');
            th.textContent = col.label;
            th.style.textAlign = 'center';
            th.style.alignContent = "center"
            th.style.cursor = 'pointer';
            th.style.userSelect = 'none';
            th.onclick = () => {
                if (sortKey === col.key) {
                    sortAsc = !sortAsc;
                } else {
                    sortKey = col.key;
                    sortAsc = true;
                }
                saveAndRender();
            };
            if (col.key === sortKey) {
                th.textContent += sortAsc ? ' ▲' : ' ▼';
                th.style.color = "#ffc200";
            }
            sortedHeaderRow.appendChild(th);
        });
        thead.appendChild(sortedHeaderRow);
    }

    function saveAndRender() {
	  save();
	  render();
	
	  // NEW: if gear changed, refresh weapon table so ammo cells update live
	  if (String(storageKey).includes("fallout_gear_table")) {
	    if (typeof updateWeaponTableDOM === "function") updateWeaponTableDOM();
	  }
	}
	
	// ---- external refresh hook (used for ammo->gear live updates) ----
	if (String(storageKey).includes("fallout_gear_table") && !tablecontainer.dataset.extRefreshHook) {
	  tablecontainer.dataset.extRefreshHook = "1";
	  window.addEventListener("fallout:gear-updated", () => {
	    // Re-render the gear table UI from localStorage
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
        input.style.color = "#325886";
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
    wrapper.style.marginBottom = "10px";
    wrapper.style.position = "relative"; // For dropdown positioning

    const input = document.createElement('input');
    input.type = "text";
    input.placeholder = "Search...";
    input.style.width = "100%";
    input.style.padding = "5px";
    input.style.backgroundColor = "#fde4c9";
    input.style.color = "black";
    input.style.borderRadius = "5px";
    input.style.caretColor = 'black';
    wrapper.appendChild(input);

    const results = document.createElement('div');
    results.style.backgroundColor = "#fde4c9";
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
            // Display: remove [[...]]
            let label = (item.name || item.link || "").replace(/\[\[(.*?)\]\]/g, "$1");
            div.textContent = label;
            div.style.cursor = "pointer";
            div.style.padding = "7px 12px";
            div.style.borderBottom = (i < matches.length - 1) ? "1px solid #ccc" : "";
            div.onmouseover = () => div.style.background = "#fdeec2";
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



function createPlusMinusDisplay({ value = 0, min = 0, max = 999, onChange }) {
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
        setValue(Number(num.textContent) - 1);
    };

    plus.onclick = (e) => {
        e.stopPropagation();
        setValue(Number(num.textContent) + 1);
    };

    num.onclick = (e) => {
        e.stopPropagation();
        const input = document.createElement("input");
        input.type = "text";
        input.value = num.textContent;
        input.style.width = "45px";
        input.style.textAlign = "center";
        input.style.backgroundColor = "#fde4c9";
        input.style.color = "#325886";
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



//--------------------------------------------------------------------------------------------

const builder = engine.markdown.createBuilder();
const STORAGE_KEY = 'falloutRPGCharacterSheet'; 
const inputs = {};

const saveInputs = () => {
  // Start from what is already saved so we don't "wipe" keys that are temporarily missing
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  for (const key of Object.keys(inputs)) {
    const el = inputs[key];
    if (!el) continue; // don't delete prior saved values just because element isn't present right now

    if (el.type === "checkbox") existing[key] = !!el.checked;
    else existing[key] = el.value ?? "";
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
        else input.value = data[key] ?? "";
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
    const end = parseInt(inputs['END']?.value) || 0;
    const lck = parseInt(inputs['LCK']?.value) || 0;
    const per = parseInt(inputs['PER']?.value) || 0;
    const agi = parseInt(inputs['AGI']?.value) || 0;
    const str = parseInt(inputs['STR']?.value) || 0;
    const level = parseInt(inputs['Level']?.value) || 0;

    // Defensive: Only set value if input exists!
    if (inputs['LuckPoints'] && (!inputs['LuckPoints'].dataset?.manual || inputs['LuckPoints'].value === "")) {
    inputs['LuckPoints'].value = lck;
}
    if (inputs["Maximum HP"] && !inputs["Maximum HP"].dataset?.manual) {
	  const computed = end + lck + level - 1;
	  if (String(inputs["Maximum HP"].value) !== String(computed)) {
	    inputs["Maximum HP"].value = String(computed);
	    inputs["Maximum HP"].dispatchEvent(new Event("input", { bubbles: true }));
	  }
	}
    if (inputs['Initiative'] && !inputs['Initiative']?.dataset?.manual) inputs['Initiative'].value = per + agi;
    if (inputs['Defense'] && !inputs['Defense']?.dataset?.manual) inputs['Defense'].value = agi >= 9 ? 2 : 1;

    if (inputs['MeleeDamage'] && !inputs['MeleeDamage']?.dataset?.manual) {
        let meleeDamage = "-";
        if (str >= 7 && str <= 8) meleeDamage = "+1d6";
        else if (str >= 9 && str <= 10) meleeDamage = "+2d6";
        else if (str >= 11) meleeDamage = "+3d6";
        inputs['MeleeDamage'].value = meleeDamage;
    }
    saveInputs();
};





// --- Helper: read SPECIAL & skills from DOM
function getCharacterStats() { 
    let stats = {}; 
    ["STR", "PER", "END", "CHA", "INT", "AGI", "LCK"].forEach(stat => { 
        let value = parseInt(document.getElementById(stat)?.value) || 0; 
        stats[stat] = value; 
    }); 
    let skills = {}; 
    Object.keys(skillToSpecial).forEach(skill => { 
        let skillValue = parseInt(document.getElementById(skill)?.value) || 0; 
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
    //section.style.background = "#325886";
    section.style.background = "#2e4663";
    section.style.border = "3px solid #2e4663";
    section.style.marginBottom = "20px";
    section.style.display = "grid";
    section.style.gridTemplateColumns = "1fr 1fr";
    section.style.gap = "20px";
    section.style.minWidth = "700px";
	
	// === Character Info ===
    const charInfo = document.createElement("div");
    //charInfo.style.border = "2px solid #ffc200";
    charInfo.style.padding = "15px";
    charInfo.style.borderRadius = "8px";
    charInfo.style.background = "#325886";

    const charTitle = document.createElement("div");
    charTitle.textContent = "Character Info";
    charTitle.style.fontWeight = "bold";
    charTitle.style.fontSize = "22px";
    charTitle.style.color = "#efdd6f";
    charTitle.style.textAlign = "center";
    charTitle.style.borderBottom = "1px solid #ffc200";
    charTitle.style.marginBottom = "15px";
    charTitle.style.borderRadius = "8px";
    charTitle.style.background = "#002757";
    charInfo.appendChild(charTitle);

    const infoGrid = document.createElement("div");
    infoGrid.style.display = "grid";
    infoGrid.style.gridTemplateColumns = "auto 1fr";
    infoGrid.style.gap = "5px";
    infoGrid.style.alignItems = "center";

	// input fields
    function addRow(labelText, inputId, type="text", width="100%") {
        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.color = "#FFC200";
        infoGrid.appendChild(label);

        const input = document.createElement("input");
        input.type = type;
        input.id = inputId;
        input.style.width = width;
        input.style.backgroundColor = "#fde4c9";
        input.style.borderRadius = "5px";
        input.style.color = "black";
        input.style.caretColor = 'black';
        infoGrid.appendChild(input);
    }
    addRow("Name:", "Name", "text");
    addRow("Origin:", "Origin", "text");
    addRow("Level:", "Level", "number", "50px");
    addRow("XP Earned:", "XPEarned", "number", "80px");
    addRow("XP to Next Level:", "XPNext", "number", "80px");

    charInfo.appendChild(infoGrid);
    section.appendChild(charInfo);
	
	// === Derived Stats ===
    const derivedStats = document.createElement("div");
    //derivedStats.style.border = "2px solid #ffc200";
    derivedStats.style.padding = "15px";
    derivedStats.style.borderRadius = "8px";
    derivedStats.style.background = "#325886";

    const derivedTitle = document.createElement("div");
    derivedTitle.textContent = "Derived Stats";
    derivedTitle.style.fontWeight = "bold";
    derivedTitle.style.fontSize = "22px";
    derivedTitle.style.color = "#efdd6f";
    derivedTitle.style.textAlign = "center";
    derivedTitle.style.borderBottom = "1px solid #ffc200";
    derivedTitle.style.marginBottom = "5px";
    derivedTitle.style.borderRadius = "8px";
    derivedTitle.style.background = "#002757"
    derivedStats.appendChild(derivedTitle);

	// Two-column grid for derived stats and HP/Luck
    const derivedGrid = document.createElement("div");
    derivedGrid.style.display = "grid";
    derivedGrid.style.gridTemplateColumns = ".5fr 1fr";
    derivedGrid.style.gap = "40px";

    // Moon button
	const restBtn = document.createElement("span");
	restBtn.innerHTML = `New Scene🌙`;
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
		
		  // Prevent derived stat recalcs from overwriting GIFTED behavior
		  if (hasGiftedPerk()) {
		    luckInput.dataset.manual = "true";
		  } else {
		    delete luckInput.dataset.manual;
		  }
		
		  luckInput.dispatchEvent(new Event("input", { bubbles: true }));
		}
		
	    const maxHpInput = document.getElementById("Maximum HP");
		const currHpInput = document.getElementById("CurrentHP");
		const radInput = document.getElementById("RadDMG");
		
		if (maxHpInput && currHpInput) {
		    const baseMax = parseInt(maxHpInput.value, 10) || 0;
		    const rad = parseInt(radInput?.value, 10) || 0;
		    const effectiveMax = Math.max(0, baseMax - rad);
		
		    currHpInput.value = String(effectiveMax);
		    currHpInput.dispatchEvent(new Event("input", { bubbles: true }));
		}
				    // For Luck Points
		const luckNum = luckWrapper.querySelector('.plusminus-num');
		if (luckNum) luckNum.textContent = startingLuck;
		
		// For Current HP (target the CurrentHP widget, not RadDMG)
		const hpNum = hpWrapper.querySelector('[data-pm="CurrentHP"] .plusminus-num');
		if (hpNum && maxHpInput) {
		  const baseMax = parseInt(maxHpInput.value, 10) || 0;
		  const rad = parseInt(document.getElementById("RadDMG")?.value, 10) || 0;
		  hpNum.textContent = String(Math.max(0, baseMax - rad));
		}
		
	    if (typeof renderHPBar === "function") renderHPBar();
	    // After updating input values and firing input events:
		if (typeof loadInputs === "function") loadInputs();
	    if (typeof updateDerivedStats === "function") updateDerivedStats();
	};
	
    derivedStats.appendChild(restBtn);
    

	// Left column: Derived Stats
    const leftCol = document.createElement("div");

    function addDerived(labelText, inputId, type="text") {
        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.color = "#FFC200";
        leftCol.appendChild(label);

        const input = document.createElement("input");
        input.type = type;
        input.id = inputId;
        input.style.width = "100%";
        input.style.backgroundColor = "#fde4c9";
        input.style.borderRadius = "5px";
        input.style.color = "black";
        input.style.caretColor = 'black';
        leftCol.appendChild(input);

        leftCol.appendChild(document.createElement("br"));
    }
    // (Add your derived fields)
	addDerived("Melee Damage:", "MeleeDamage");
	addDerived("Defense:", "Defense", "number");
	addDerived("Initiative:", "Initiative", "number");

	
	

    

	// Right column: Luck Points + HP
    const rightCol = document.createElement("div");

	// Luck Points
    const luckWrapper = document.createElement("div");
    luckWrapper.style.border = "1px solid #efdd6f";
    luckWrapper.style.padding = "5px";
    luckWrapper.style.display = "grid";
    luckWrapper.style.gridTemplateColumns = "auto 1fr";
    luckWrapper.style.alignItems = "center";
    luckWrapper.style.marginBottom = "5px";

    const luckLabel = document.createElement("label");
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
        luckHiddenInput.value = val;

        // --- Manual override logic ---
        // Look up current LCK value in the SPECIAL stat field:
        let lckStat = 0;
        const lckInput = document.getElementById("LCK") || document.querySelector("#LCK");
        if (lckInput) lckStat = parseInt(lckInput.value) || 0;

        if (val === "" || Number(val) === lckStat) {
            delete luckHiddenInput.dataset.manual;
        } else {
            luckHiddenInput.dataset.manual = "true";
        }

        let evt = new Event("input", { bubbles: true });
        luckHiddenInput.dispatchEvent(evt);
    }
});
luckWrapper.appendChild(luckField);

rightCol.appendChild(luckWrapper);


	// HP
	const maxHPBlock = document.createElement("div");
	maxHPBlock.style.borderBottom = "2px solid #ffc200"
	maxHPBlock.style.padding = "0px 5px"
	maxHPBlock.style.gridColumn = "1 / span 2";
	maxHPBlock.style.display = "flex";
	maxHPBlock.style.justifyContent = "center";
	
	
    const hpWrapper = document.createElement("div");
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
	  return clampInt(maxHpInput?.value ?? 0, 0, 9999);
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
    
    derivedGrid.appendChild(rightCol);
	derivedGrid.appendChild(leftCol);

    derivedStats.appendChild(derivedGrid);
    section.appendChild(derivedStats);

	// === S.P.E.C.I.A.L. Stats ===
    const specialDiv = document.createElement("div");
    specialDiv.style.gridColumn = "span 2";
    //specialDiv.style.border = "2px solid #ffc200";
    specialDiv.style.padding = "15px";
    specialDiv.style.borderRadius = "8px";
    specialDiv.style.textAlign = "center";
    specialDiv.style.marginTop = "10px";
    specialDiv.style.background = "#325886";

    const specialTitle = document.createElement("div");
    specialTitle.textContent = "S.P.E.C.I.A.L.";
    specialTitle.style.fontWeight = "bold";
    specialTitle.style.fontSize = "22px";
    specialTitle.style.color = "#efdd6f";
    specialTitle.style.textAlign = "center";
    specialTitle.style.borderBottom = "1px solid #ffc200";
    specialTitle.style.marginBottom = "15px";
    specialTitle.style.borderRadius = "8px";
    specialTitle.style.background = "#002757"
    specialDiv.appendChild(specialTitle);

    const specialRow = document.createElement("div");
    specialRow.style.display = "flex";
    specialRow.style.justifyContent = "space-around";
    specialRow.style.gap = "10px";
    //specialRow.style.border = "1px solid #ffc200";
	specialRow.style.borderRadius = "8px";
	specialRow.style.padding = "8px";
	specialRow.style.background = "#325886";


    ["STR", "PER", "END", "CHA", "INT", "AGI", "LCK"].forEach(stat => {
        const statBox = document.createElement("div");
        statBox.style.display = "flex";
        statBox.style.flexDirection = "column";
        statBox.style.alignItems = "center";

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
    section.appendChild(specialDiv);

	// === Skills Section ===
    const skillsDiv = document.createElement("div");
    skillsDiv.style.gridColumn = "span 2";
    //skillsDiv.style.border = "2px solid #ffc200";
    skillsDiv.style.padding = "15px";
    skillsDiv.style.borderRadius = "8px";
    skillsDiv.style.textAlign = "left";
    skillsDiv.style.marginTop = "10px";
    skillsDiv.style.background = "#325886";

    const skillsTitle = document.createElement("div");
    skillsTitle.textContent = "Skills";
    skillsTitle.style.fontWeight = "bold";
    skillsTitle.style.fontSize = "22px";
    skillsTitle.style.color = "#efdd6f";
    skillsTitle.style.textAlign = "center";
    skillsTitle.style.borderBottom = "1px solid #ffc200";
    skillsTitle.style.marginBottom = "15px";
    skillsTitle.style.borderRadius = "8px";
    skillsTitle.style.background = "#002757";
    skillsDiv.appendChild(skillsTitle);

    const skillsGrid = document.createElement("div");
    skillsGrid.style.display = "grid";
    skillsGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
    skillsGrid.style.gap = "5px";

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
        skillRow.style.display = "flex";
        skillRow.style.alignItems = "center";
        skillRow.style.gap = "1px";
        skillRow.style.justifyContent = "space-between";
        skillRow.style.borderBottom = "1px solid rgba(255,255,255,0.2)";
        skillRow.style.padding = "5px 15px";
        skillRow.style.transition = "background-color 0.3s";

        const skillLabel = document.createElement("label");
        skillLabel.textContent = skill;
        skillLabel.style.color = "#FFC200";
        skillLabel.style.textAlign = "left";
        skillRow.appendChild(skillLabel);

        const specialTag = document.createElement("span");
        specialTag.textContent = `[${skillToSpecial[skill]}]`;
        specialTag.style.flex = "2";
        specialTag.style.color = "#c5c5c5";
        specialTag.style.fontSize = "0.8em";
        skillRow.appendChild(specialTag);

        const tagCheckbox = document.createElement("input");
        tagCheckbox.type = "checkbox";
        tagCheckbox.id = `${skill}Tag`;
        skillRow.appendChild(tagCheckbox);

        const skillInput = document.createElement("input");
        skillInput.type = "number";
        skillInput.id = skill;
        skillInput.style.maxWidth = "40px";
        skillInput.style.backgroundColor = "#fde4c9";
        skillInput.style.color = "black";
        skillInput.style.textAlign = "center";
        skillInput.style.borderRadius = "5px";
        skillInput.style.caretColor = 'black';
        skillRow.appendChild(skillInput);

        skillsGrid.appendChild(skillRow);
    });

    skillsDiv.appendChild(skillsGrid);
    section.appendChild(skillsDiv);



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
            input.addEventListener("input", saveInputs);
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
}



//--------------------------------------------------------------------------------------------

function renderCapsContainer() {
    const CAPS_KEY = 'fallout_Caps'; // Future: use getStorageKey('fallout_Caps', currentCharacter)
    let storedValue = localStorage.getItem(CAPS_KEY) || '0';

    const CapsContainer = document.createElement('div');
    CapsContainer.style = "padding:10px;border:3px solid #2e4663;border-radius:8px;background:#325886;display:flex;align-items:center;margin-bottom:10px;max-width:200px;gap:15px;justify-self:right;";

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
    CapsDisplay.textContent = storedValue;
    CapsDisplay.style = "text-align:center;color:#efdd6f;cursor:pointer;fontWeight:bold;font-size:15px;";
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
    { label: "Remove", type: "remove" }
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

        Tag: ({ rowData, col, rowIdx, data, saveAndRender }) => {
            let locked = !!rowData.manualTag;
            let value = locked
                ? rowData.Tag
                : (typeof calculateWeaponStats === "function" && rowData.type
                    ? calculateWeaponStats(rowData.type).Tag
                    : !!rowData.Tag);

            const td = document.createElement('td');
            td.style.textAlign = "center";
            const checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.checked = !!value;
            checkbox.onclick = () => {
                rowData.Tag = checkbox.checked;
                rowData.manualTag = true; // lock
                saveAndRender();
            };
            // Right-click to clear override and return to auto
            td.oncontextmenu = (e) => {
                e.preventDefault();
                delete rowData.manualTag;
                if (rowData.type && typeof calculateWeaponStats === "function") {
                    rowData.Tag = calculateWeaponStats(rowData.type).Tag;
                }
                saveAndRender();
            };
            td.appendChild(checkbox);
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
  overlay.style = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    background:rgba(30,40,50,0.70);z-index:99999;display:flex;
    align-items:center;justify-content:center;`;

  const modal = document.createElement("div");
  modal.style = `
    background:#325886;padding:16px;border-radius:12px;
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
  results.style.background = '#fde4c9';
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
  closeBtn.style = "background:#325886;color:#ffc200;font-weight:bold;padding:6px 16px;border-radius:6px;border:2px solid #ffc200;cursor:pointer;";
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
      row.style = `
        padding:8px 10px;cursor:pointer;display:flex;justify-content:space-between;
        border-bottom:${idx < filtered.length - 1 ? "1px solid rgba(0,0,0,0.15)" : "none"};`;
      const left = document.createElement("div");
      left.textContent = m.basename;
      const right = document.createElement("div");
      right.textContent = m.cost ? `Cost ${m.cost}` : "";
      right.style.opacity = "0.8";

      row.onmouseover = () => row.style.background = "#fdeec2";
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
        fetchItems: fetchWeaponData,
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
		let stats = { link: file.basename, physdr: "0", raddr: "0", endr: "0", hp: "0", locations: "Unknown", value: "0" };
        let statblockMatch = content.match(/```statblock([\s\S]*?)```/);
        if (!statblockMatch) return stats;
        let statblockContent = statblockMatch[1].trim();
        // Parse base Value from cost:
		const costMatch = statblockContent.match(/cost:\s*([^\n\r]+)/i);
		if (costMatch) stats.value = costMatch[1].trim().replace(/"/g, "");
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
}
function loadArmorData(section) {
  let d = localStorage.getItem(`${ARMOR_STORAGE_KEY}_${section}`);
  return d ? JSON.parse(d) : {
    physdr: "", raddr: "", endr: "", hp: "", apparel: "",
    value: "", base: null, addons: []
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
  const out = { phys: 0, en: 0, rad: 0, cost: 0, hp: 0 };

  // cost
  const costMatch = statblockContent.match(/cost:\s*([^\n\r]+)/i);
  if (costMatch) out.cost = parseDelta(costMatch[1].replace(/"/g, ""));

  // hp (mods may have hp: "+1")
  const hpMatch = statblockContent.match(/hp:\s*([^\n\r]+)/i);
  if (hpMatch) out.hp = parseDelta(hpMatch[1].replace(/"/g, ""));

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
        deltas: { phys: 0, en: 0, rad: 0, cost: 0, hp: 0 }
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
      value: stored.value ?? ""
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

  if (!Number.isNaN(bPhys)) stored.physdr = String(bPhys + dPhys);
  if (!Number.isNaN(bEn))   stored.endr   = String(bEn + dEn);
  if (!Number.isNaN(bRad))  stored.raddr  = String(bRad + dRad);

  const bVal = extractFirstInt(stored.base.value);
  if (!Number.isNaN(bVal)) stored.value = String(bVal + dCost);

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
  overlay.style = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    background:rgba(30,40,50,0.70);z-index:99999;display:flex;
    align-items:center;justify-content:center;`;

  const modal = document.createElement("div");
  modal.style = `
    background:#325886;padding:16px;border-radius:12px;
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
  results.style.background = '#fde4c9';
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
  closeBtn.style = "background:#325886;color:#ffc200;font-weight:bold;padding:6px 16px;border-radius:6px;border:2px solid #ffc200;cursor:pointer;";
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
      row.onmouseover = () => row.style.background = "#fdeec2";
      row.onmouseout = () => row.style.background = "";

      const left = document.createElement("div");
      left.textContent = a.basename;

      const right = document.createElement("div");
      if (a.type === "mod") {
        const d = a.deltas;
        right.textContent = `DR +${d.phys}/+${d.en}/+${d.rad}  Val ${d.cost>=0?"+":""}${d.cost}${isPowerArmor && d.hp ? `  HP ${d.hp>=0?"+":""}${d.hp}` : ""}`;
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
  overlay.style = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    background:rgba(30,40,50,0.70);z-index:99999;display:flex;
    align-items:center;justify-content:center;`;

  const modal = document.createElement("div");
  modal.style = `
    background:#325886;padding:16px;border-radius:12px;
    border:3px solid #ffc200;min-width:360px;max-width:92vw;`;

  const title = document.createElement("div");
  title.textContent = isPowerArmor ? "Select Power Armor" : "Select Armor";
  title.style = "color:#ffc200;font-weight:bold;margin-bottom:10px;text-align:center;";
  modal.appendChild(title);

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search items...";
  input.style = `
    width:100%;padding:7px;border-radius:6px;border:1.5px solid #ffc200;
    background:#fde4c9;color:#000;caret-color:#000;margin-bottom:10px;`;
  modal.appendChild(input);

  const results = document.createElement("div");
  results.style.background = "#fde4c9";
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
  closeBtn.style = "background:#325886;color:#ffc200;font-weight:bold;padding:6px 16px;border-radius:6px;border:2px solid #ffc200;cursor:pointer;";
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
      row.onmouseover = () => row.style.background = "#fdeec2";
      row.onmouseout = () => row.style.background = "";

      const left = document.createElement("div");
      left.textContent = item.link || item.basename || "Unknown";

      const right = document.createElement("div");
      right.style.opacity = "0.8";
      right.textContent = isPowerArmor
        ? `DR ${item.physdr}/${item.endr}/${item.raddr}  HP ${item.hp}  Val ${item.value ?? "0"}`
        : `DR ${item.physdr}/${item.endr}/${item.raddr}  Val ${item.value ?? "0"}`;

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
    card.className = "armor-card"; // for future layout CSS!
    card.style.background = "#325886";
    card.style.border = '3px solid #2e4663';
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
    statGrid.style.display = 'grid';
    statGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
    statGrid.style.background = "#325886";
    statGrid.style.padding = "10px 0";
    statGrid.style.borderRadius = "5px 5px 0 0";
    statGrid.style.border = '2px solid #223657'
    statGrid.style.justifyContent = "center";
    
    const resetBtn = document.createElement("span");
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
	title.appendChild(resetBtn);
    

    // Field mapping
    let labels = [ ['Phys. DR','physdr'], ['En. DR','endr'], ['Rad. DR','raddr']];
    let inputs = {};

    labels.forEach(([label, key]) => {
        let c = document.createElement('div');
        c.style.display = "flex";
        c.style.flexDirection = "column";
        c.style.alignItems = "center";
        c.style.justifyContent = "center";
        let l = document.createElement('span');
        l.textContent = label;
        l.style.color = "#ffc200";
        l.style.fontWeight = "bold";
        l.style.marginBottom = "2px";
        l.style.fontSize = "1em";
        let input = document.createElement('input');
        input.type = 'text';
        input.style.width = "75%";
        input.style.textAlign = "center";
        input.style.background = "#fde4c9";
        input.style.border = "1px solid #e5c96e";
        input.style.borderRadius = "4px";
        input.style.color = "black";
        inputs[key] = input;
        c.appendChild(l); c.appendChild(input);
        statGrid.appendChild(c);
    });

    card.appendChild(statGrid);

    // Apparel/armor markdown field (click-to-edit)
	const apparelBar = document.createElement("div");
	apparelBar.style.background = "#2e4663";
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
	apparelName.style.textAlign = "center";
	apparelName.style.cursor = "text"; // keep your click-to-edit behavior
	apparelName.innerHTML = '(Click to edit)';
	
	const searchBtn = document.createElement("button");
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
	
	apparelBar.appendChild(apparelInput);
	apparelBar.append(apparelName, searchBtn);
	card.appendChild(apparelBar);
	
	
    function updateApparelDisplay() {
	  let fresh = loadArmorData(section);
	  let val = (typeof fresh.apparel === "string" ? fresh.apparel : "");
	  apparelName.innerHTML = val.trim() !== ""
	    ? val.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>')
	    : '';
	  apparelInput.value = val;
	}

    apparelName.onclick = () => {
	  apparelName.style.display = "none";
	  apparelInput.style.display = "block";
	  apparelInput.focus();
	};

    apparelInput.onblur = () => {
        let fresh = loadArmorData(section);
        fresh.apparel = apparelInput.value.trim();
        saveArmorData(section, fresh);
        updateApparelDisplay();
        apparelName.style.display = "block";
        apparelInput.style.display = "none";
    };
	
	searchBtn.onclick = (e) => {
	  e.preventDefault();
	  e.stopPropagation();
	
	  openArmorItemPicker({
	    section,
	    isPowerArmor: false,
	    onPick: (armor) => {
	      const linkString = `[[${armor.link}]]`;
	
	      const newData = {
	        physdr: armor.physdr,
	        raddr: armor.raddr,
	        endr: armor.endr,
	        apparel: linkString,
	        value: armor.value ?? "0",
	        base: { physdr: armor.physdr, endr: armor.endr, raddr: armor.raddr, value: armor.value ?? "0" },
	        addons: []
	      };
	
	      saveArmorData(section, newData);
	      card.replaceWith(renderArmorCard(section));
	    }
	  });
	};


 


	// ---- Addons + Value container (Normal Armor) ----
	(() => {
	  let stored = loadArmorData(section);
	  ensureArmorBase(stored, false);
	
	  const wrap = document.createElement("div");
	  wrap.style.background = "#2e4663";
	  wrap.style.border = "2px solid #223657";
	  wrap.style.borderRadius = "8px";
	  wrap.style.padding = "8px";
	  wrap.style.marginTop = "8px";
	  wrap.style.color = "#ffe974";
	
	  // Row 1: Addons
	  const row1 = document.createElement("div");
	  row1.style.display = "grid";
	  row1.style.gridTemplateColumns = "auto 1fr auto";
	  row1.style.gap = "8px";
	
	  const lbl = document.createElement("div");
	  lbl.textContent = "Addons:";
	  lbl.style.fontWeight = "bold";
	  lbl.style.color = "#ffc200";
	
	  const list = document.createElement("div");
	  list.style.display = "flex";
	  list.style.flexWrap = "wrap";
	  list.style.gap = "6px";
	
	  const addBtn = document.createElement("button");
	  addBtn.textContent = "+";
	  addBtn.title = "Add addon";
	  addBtn.style.textShadow = "1px 1px 2px black";
	  addBtn.style.background = '#325886';
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
	      chip.style = "background:#325886;border:1px solid #223657;border-radius:10px;padding:3px 8px;display:inline-flex;align-items:center;gap:6px;";
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
			valueInputRef.value = stored.value ?? "";
	        inputs["physdr"].value = stored.physdr || "";
	        inputs["endr"].value = stored.endr || "";
	        inputs["raddr"].value = stored.raddr || "";
	        renderList();
	      }
	    });
	  };
	
	  row1.append(lbl, list, addBtn);
	
	  // Row 2: Value
	  const row2 = document.createElement("div");
	  row2.style.display = "grid";
	  row2.style.gridTemplateColumns = "auto 120px 1fr";
	  row2.style.alignItems = "center";
	  row2.style.gap = "8px";
	  row2.style.marginTop = "8px";
	
	  const vLbl = document.createElement("div");
	  vLbl.textContent = "Value:";
	  vLbl.style.fontWeight = "bold";
	  vLbl.style.color = "#ffc200";
	
	  const valueInput = document.createElement("input");
	  valueInput.type = "text";
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
	  
	  row2.append(vLbl, valueInput, valueTotal);
	
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
    labels.forEach(([_, key]) => {
	  inputs[key].addEventListener('input', () => {
	    let stored = loadArmorData(section);
	    ensureArmorBase(stored, false);
	
	    stored[key] = inputs[key].value;
	
	    // keep base aligned with manual edits
	    if (key === "physdr") stored.base.physdr = stored[key];
	    if (key === "endr")   stored.base.endr   = stored[key];
	    if (key === "raddr")  stored.base.raddr  = stored[key];

	
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
    wrap.style.display = "flex";
    wrap.style.alignItems = "center";
    wrap.style.background = "#325886";
    wrap.style.border = "2px solid #2e4663";
    wrap.style.borderRadius = "8px";
    wrap.style.padding = "1px 12px 1px 12px";
    wrap.style.margin = "8px";
    wrap.style.maxWidth = "200px";
    
    let label = document.createElement('span');
    label.textContent = "Poison DR";
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
    input.value = localStorage.getItem(POISON_DR_KEY) || "";
    input.style.background = "#fde4c9";
    input.style.color = "black";
    input.style.textAlign = "center";
    input.style.borderRadius = "5px";
    input.style.padding = "2px 12px";
    input.style.maxWidth = "50px"
    input.style.maxHeight = "25px"
    input.style.caretColor = 'black';
    input.addEventListener('input', () => {
        localStorage.setItem(POISON_DR_KEY, input.value);
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
    container.style.marginBottom = "25px";
    container.style.border = "3px solid #2e4663";
    container.style.borderRadius = "8px";
    container.style.padding = "8px 0 0 0";
    container.style.background = "#223657";
	container.style.width = "auto";
	
    // ---- Tabs + Poison DR Row ----
    const topRow = document.createElement('div');
    topRow.style.display = "flex";
    topRow.style.alignItems = "center";
    topRow.style.justifyContent = "space-between";
    topRow.style.gap = "10px";
    topRow.style.padding = "0 8px 0 8px";
	topRow.style.width = "auto"
	topRow.style.flexWrap = "wrap";
    // Tabs Bar
    const tabBar = document.createElement('div');
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
    normalTab.style.color = "#2e4663";
    normalTab.style.cursor = "pointer";
    normalTab.style.padding = "7px 20px 7px 20px";
    normalTab.style.marginRight = "2px";

    const powerTab = document.createElement('button');
    powerTab.textContent = "Power Armor";
    powerTab.style.background = "#325886";
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
    poisonDRBar.style.maxWidth = "50%";
    poisonDRBar.style.flex = "0 0 auto";
    poisonDRBar.style.alighItem = "center";

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
        powerTab.style.background = "#325886";
        normalTab.style.color = "#2e4663";
        powerTab.style.color = "#ffc200";
    };
    powerTab.onclick = () => {
        normalGrid.style.display = "none";
        powerGrid.style.display = "block";
        normalTab.style.background = "#325886";
        powerTab.style.background = "#ffc200";
        normalTab.style.color = "#ffc200";
        powerTab.style.color = "#2e4663";
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
        let stats = { link: file.basename, physdr: "0", raddr: "0", endr: "0", hp: "0", locations: "Unknown", value: "0" };
        let statblockMatch = content.match(/```statblock([\s\S]*?)```/);
        if (!statblockMatch) return stats;
        let statblockContent = statblockMatch[1].trim();
        // Parse base Value from cost:
		const costMatch = statblockContent.match(/cost:\s*([^\n\r]+)/i);
		if (costMatch) stats.value = costMatch[1].trim().replace(/"/g, "");
		
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
    card.className = "armor-card";
    card.style.background = "#325886";
    card.style.border = '3px solid #2e4663';
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
    statGrid.style.display = 'grid';
    statGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
    statGrid.style.background = "#325886";
    statGrid.style.padding = "10px 0";
    statGrid.style.borderRadius = "5px 5px 0 0";
    statGrid.style.border = '2px solid #223657'
    statGrid.style.justifyContent = "center";
    
    // ---- RESET BUTTON ----
	const resetBtn = document.createElement("span");
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

	title.appendChild(resetBtn);

    

    let labels = [ ['Phys. DR','physdr'], ['En. DR','endr'], ['Rad. DR','raddr'], ['HP','hp'] ];
    let inputs = {};

    labels.forEach(([label, key]) => {
        let c = document.createElement('div');
        c.style.display = "flex";
        c.style.flexDirection = "column";
        c.style.alignItems = "center";
        c.style.justifyContent = "center";
        
        let l = document.createElement('span');
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
        input.type = 'text';
        input.style.width = "75%";
        input.style.textAlign = "center";
        input.style.background = "#fde4c9";
        input.style.border = "1px solid #e5c96e";
        input.style.borderRadius = "4px";
        input.style.color = "black";
        inputs[key] = input;
        c.appendChild(l); c.appendChild(input);
        statGrid.appendChild(c);
    });
    card.appendChild(statGrid);

    // Apparel (power armor piece) markdown field
	const apparelBar = document.createElement("div");
	apparelBar.style.background = "#2e4663";
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
	apparelName.style.textAlign = "center";
	apparelName.style.cursor = "text"; // keep your click-to-edit behavior
	apparelName.innerHTML = '(Click to edit)';
	
	const searchBtn = document.createElement("button");
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
    
	apparelBar.appendChild(apparelInput);
	apparelBar.append(apparelName, searchBtn);
	card.appendChild(apparelBar);
	
	
    function updateApparelDisplay() {
        let fresh = loadPowerArmorData(section);
        let val = (typeof fresh.apparel === "string" ? fresh.apparel : "");
        apparelName.innerHTML = val.trim() !== "" ?
            val.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>') :
            '';
        apparelInput.value = val;
    }

    apparelName.onclick = () => {
        apparelName.style.display = "none";
        apparelInput.style.display = "block";
        apparelInput.focus();
    };
    apparelInput.onblur = () => {
        let fresh = loadPowerArmorData(section);
        fresh.apparel = apparelInput.value.trim();
        savePowerArmorData(section, fresh);
        updateApparelDisplay();
        apparelName.style.display = "block";
        apparelInput.style.display = "none";
    };
	
	searchBtn.onclick = (e) => {
	  e.preventDefault();
	  e.stopPropagation();
	
	  openArmorItemPicker({
		  section,
		  isPowerArmor: true,
		  onPick: (armor) => {
		    const linkString = `[[${armor.link}]]`;
		
		    const newData = {
		      physdr: armor.physdr,
		      raddr: armor.raddr,
		      endr: armor.endr,
		      hp: armor.hp,
		      
		      apparel: linkString,
		      value: armor.value ?? "0",
		      
		      base: { 
			      physdr: armor.physdr, 
			      endr: armor.endr, 
			      raddr: armor.raddr, 
			      hp: armor.hp, 
			      value: armor.value ?? "0" 
		      },
		      addons: [],
		      
		      hpManual: false,
		      maxHp: null
		    };
		
		    savePowerArmorData(section, newData);
		    card.replaceWith(renderPowerArmorCard(section));
		  }
		});

	};
	// ---- Addons + Value container (Power Armor) ----
	(() => {
	  let stored = loadPowerArmorData(section);
	  ensureArmorBase(stored, true);
	
	  const wrap = document.createElement("div");
	  wrap.style.background = "#2e4663";
	  wrap.style.border = "2px solid #223657";
	  wrap.style.borderRadius = "8px";
	  wrap.style.padding = "8px";
	  wrap.style.marginTop = "8px";
	  wrap.style.color = "#ffe974";
	
	  // Row 1: Addons
	  const row1 = document.createElement("div");
	  row1.style.display = "grid";
	  row1.style.gridTemplateColumns = "auto 1fr auto";
	  row1.style.gap = "8px";
	
	  const lbl = document.createElement("div");
	  lbl.textContent = "Addons:";
	  lbl.style.fontWeight = "bold";
	  lbl.style.color = "#ffc200";
	
	  const list = document.createElement("div");
	  list.style.display = "flex";
	  list.style.flexWrap = "wrap";
	  list.style.gap = "6px";
	
	  const addBtn = document.createElement("button");
	  addBtn.textContent = "+";
	  addBtn.title = "Add addon";
	  addBtn.style.textShadow = "1px 1px 2px black";
	  addBtn.style.background = '#325886';
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
	      chip.style =
	        "background:#325886;border:1px solid #223657;border-radius:10px;padding:3px 8px;display:inline-flex;align-items:center;gap:6px;";
	
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
	  row2.style.display = "grid";
	  row2.style.gridTemplateColumns = "auto 120px 1fr";
	  row2.style.alignItems = "center";
	  row2.style.gap = "8px";
	  row2.style.marginTop = "8px";
	
	  const vLbl = document.createElement("div");
	  vLbl.textContent = "Value:";
	  vLbl.style.fontWeight = "bold";
	  vLbl.style.color = "#ffc200";
	
	  const valueInput = document.createElement("input");
	  valueInput.type = "text";
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
        return stats;
    }));
    cachedGearData = gearItems.filter(g => g);
    return cachedGearData;
}

// ---- Table columns for gear ----
const gearColumns = [
  { label: "Name", key: "name", type: "link" },
  { label: "Qty", key: "qty", type: "number" },
  { label: "Cost", key: "cost", type: "text" },
  { label: "Category", key: "category", type: "text" },

  // NEW hidden field
  { label: "yamlName", key: "yamlName", type: "text", hidden: true },

  { label: "Remove", type: "remove" },
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
  totalSpan.style.color = "#ffc200";
  totalSpan.style.fontSize = "0.90em";
  totalSpan.style.opacity = "0.8";
  totalSpan.style.marginLeft = "2px";

  container.appendChild(totalSpan);
  return container;
}



// ---- GEAR TABLE SECTION ----
function renderGearTableSection() {
  return createEditableTable({
    columns: gearColumns,
    storageKey: GEAR_STORAGE_KEY,
    fetchItems: fetchGearData, // DRY search bar!
    cellOverrides: {
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
    top: 0; left: 0; width: 100%; height: 100%;
    z-index: 99;
    opacity: 0.17;
    background: repeating-linear-gradient(
        to bottom,
        #18ff55 0px, #18ff5508 2px,
        transparent 3px, transparent 7px
    );
    animation: scanlinesMove 5s linear infinite;
}
@keyframes scanlinesMove {
    0% { background-position-y: 0; }
    100% { background-position-y: 18px; }
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

    textarea.addEventListener('input', () => {
        localStorage.setItem(NOTES_KEY, textarea.value);
    });

    // Blinking prompt
    const prompt = document.createElement('div');
    prompt.className = "fallout-terminal-prompt";
    prompt.innerHTML = '>> <span class="fallout-terminal-cursor"></span>';
    prompt.style.display = "none";

    // Show prompt when textarea is not focused
    textarea.addEventListener("blur", () => {
        prompt.style.display = "";
    });
    textarea.addEventListener("focus", () => {
        prompt.style.display = "none";
    });

    // --- Scanlines overlay ---
    const scanlines = document.createElement('div');
    scanlines.className = "fallout-terminal-scanlines";

    // Boot Text Animation: one line at a time
    let bootIndex = 0;
    function showBootLine() {
        if (bootIndex < bootLines.length) {
            bootDiv.textContent += bootLines[bootIndex] + "\n";
            bootIndex++;
            setTimeout(showBootLine, 420);
        } else {
            // When done, add textarea and prompt
            container.appendChild(textarea);
            container.appendChild(prompt);
        }
    }
    showBootLine();

    container.appendChild(scanlines);

    return container;
}

//--------------------------------------------------------------------------------------------

function refreshSheet() {
    const oldStats = document.getElementById("stats-section");
		if (oldStats) oldStats.remove();

    sheetcontainer.innerHTML = "";

    // --- 1. Render all major sections in order ---
    sheetcontainer.appendChild(renderImportExportBar());
    sheetcontainer.appendChild(renderTerminalNotesSection());
	sheetcontainer.appendChild(renderCapsContainer());
    // --- 2. Render stats section, then initialize its listeners
    sheetcontainer.appendChild(renderStatsSection());
	setTimeout(setupStatsSection, 0);
	
    // --- 3. Render weapons, then update DOM for table
    sheetcontainer.appendChild(createSectionHeader("Equipped Weapons"));
    sheetcontainer.appendChild(weaponTableContainer);
    updateWeaponTableDOM(); // <-- Re-render weapon table

    // --- 4. Render Ammo table (no extra listeners needed if all logic inside table function)
    //sheetcontainer.appendChild(createSectionHeader("Ammo"));
    //sheetcontainer.appendChild(renderAmmoTableSection());

    // --- 5. Armor section (if any listeners are required, call a setup function here)
    sheetcontainer.appendChild(createSectionHeader("Armor"));
    sheetcontainer.appendChild(renderArmorTabsSection());
    // (If you need: setupArmorSection();)

    // --- 6. Gear
    sheetcontainer.appendChild(createSectionHeader("Inventory"));
    sheetcontainer.appendChild(renderGearTableSection());

    // --- 7. Perks
    sheetcontainer.appendChild(createSectionHeader("Perks"));
    sheetcontainer.appendChild(renderPerkTableSection());
	
    // --- (If you need to re-attach listeners to other dynamic elements, do it here!)
    
}





refreshSheet();
return sheetcontainer;


```
