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

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // --- Header + Sorting ---
    columns.forEach(col => {
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
                let vA = a[sortKey], vB = b[sortKey];
                // Numeric sort if both numbers
                if (!isNaN(Number(vA)) && !isNaN(Number(vB))) {
                    return sortAsc ? (Number(vA) - Number(vB)) : (Number(vB) - Number(vA));
                }
                // Fallback: string compare
                return sortAsc
                    ? String(vA).localeCompare(String(vB))
                    : String(vB).localeCompare(String(vA));
            });
        }

        data.forEach((rowData, rowIdx) => {
		  // ----- main weapon row -----
		  const row = document.createElement('tr');
		
		  // Ensure mods array exists for weapons
		  if (storageKey === "fallout_weapon_table" && !Array.isArray(rowData.addons)) {
		    rowData.addons = [];
		  }
		
		  columns.forEach(col => {
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
		
		  // ----- mods secondary row (weapon table only) -----
		  if (storageKey === "fallout_weapon_table") {
		    const modsRow = document.createElement("tr");
		
		    // 3-cell layout: | (blank) | Mods list | add button |
		    const blank = document.createElement("td");
		    blank.textContent = "";
		    blank.style.width = "1%"; // keeps it tight
		
		    const modsCell = document.createElement("td");
		    modsCell.colSpan = Math.max(1, columns.length - 2);
		    modsCell.style.textAlign = "left";
		    modsCell.style.padding = "6px 10px";
		    modsCell.style.opacity = "0.95";
		
		    const label = document.createElement("span");
		    label.textContent = "Addons: ";
		    label.style.fontWeight = "bold";
		    label.style.color = "#efdd6f";
		
		    const modsWrap = document.createElement("span");
		
		    // Render mods as internal links + remove buttons
		    const addons = Array.isArray(rowData.addons) ? rowData.addons : [];
		    if (!addons.length) {
		      const empty = document.createElement("span");
		      empty.textContent = "None";
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
		        rm.title = "Remove mod";
		        rm.onclick = (e) => {
				  e.stopPropagation();
				  rowData.addons = rowData.addons.filter(a => a.id !== m.id);
				  recalcWeaponCostFromMods(rowData);
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
		
		    const addBtn = document.createElement("button");
		    addBtn.textContent = "+";
		    addBtn.title = "Add mod";
		    addBtn.style = "background:#ffc200;color:#2e4663;font-weight:bold;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;";
		    addBtn.onclick = () => {
		      openWeaponModPicker({
		        rowData,
		        onAdded: () => saveAndRender()
		      });
		    };
		
		    addCell.appendChild(addBtn);
		
		    modsRow.append(blank, modsCell, addCell);
		    tbody.appendChild(modsRow);
		  }
		});

        

        // Update headers to show sort indicator after rerender
        // (Clear and recreate header row)
        thead.innerHTML = '';
        const sortedHeaderRow = document.createElement('tr');
        columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col.label;
            th.style.textAlign = 'center';
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

    // Plus icon (unstyled)
    const increaseIcon = document.createElement("span");
    increaseIcon.textContent = "+";
    increaseIcon.style.cursor = "pointer";
    increaseIcon.style.fontSize = "1.15em";
    increaseIcon.style.padding = "2px 6px";
    increaseIcon.style.userSelect = "none";
	increaseIcon.style.color = "tomato";
	
    // Qty text (unstyled, editable on click)
    const qtyText = document.createElement("span");
    qtyText.textContent = rowData[col.key] ?? 1;
    qtyText.style.cursor = "pointer";
    qtyText.style.minWidth = "22px";
    qtyText.style.textAlign = "center";
    qtyText.style.fontWeight = "bold";
    qtyText.style.color = "#efdd6f";
    qtyText.title = "Click to edit";

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
        btn.style.cursor = "pointer";
        btn.onclick = () => onChange();
        td.appendChild(btn);
        return td;
    }

    // --- Checkbox, generic ---
    if (col.type === "checkbox") {
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = !!rowData[col.key];
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
        input.onblur = () => onChange(input.value.trim());
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



function createPlusMinusDisplay({ value = 0, min = 0, max = 999, onChange }) {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.gap = "6px";

    // Minus
    const minus = document.createElement("span");
    minus.textContent = "−";
    minus.style.cursor = "pointer";
    minus.style.fontSize = "1.15em";
    minus.style.padding = "2px 6px";
    minus.style.userSelect = "none";
    minus.style.color = "cyan";

    // Plus
    const plus = document.createElement("span");
    plus.textContent = "+";
    plus.style.cursor = "pointer";
    plus.style.fontSize = "1.15em";
    plus.style.padding = "2px 6px";
    plus.style.userSelect = "none";
	plus.style.color = "tomato";

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

        const origVal = num.textContent;

        function saveAndExit() {
		    let val = input.value.trim();
		    num.textContent = val;
		    if (typeof onChange === "function") onChange(val);
		    // If value is now blank (auto mode), immediately show LCK stat value
			if (val === "" && typeof inputs !== "undefined" && inputs.LCK) {
			    num.textContent = inputs.LCK.value;
			}

		    container.replaceChild(num, input);
		}


        function cancelAndExit() {
            num.textContent = origVal;
            container.replaceChild(num, input);
        }

        input.addEventListener("blur", saveAndExit);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") saveAndExit();
            if (e.key === "Escape") cancelAndExit();
        });

        container.replaceChild(input, num);
        input.focus();
    };

    container.appendChild(minus);
    container.appendChild(num);
    container.appendChild(plus);

    return container;
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
    const data = Object.fromEntries(
        Object.keys(inputs).map(key => {
            if (!inputs[key]) return null;
            if (inputs[key].type === "checkbox") return [key, inputs[key].checked];
            return [key, inputs[key].value || null];
        }).filter(entry => entry !== null)
    );
    if (inputs.LuckPoints && inputs.LuckPoints.dataset.manual === "true") {
        data.LuckPointsManual = true;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); 
};

const loadInputs = () => { 
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    Object.entries(inputs).forEach(([key, input]) => { 
        if (input.type === "checkbox") input.checked = data[key] ?? false;
        else input.value = data[key] ?? "";
        if (["Maximum HP", "Initiative", "MeleeDamage", "Defense"].includes(key) && input.value.trim() !== "") {
            input.dataset.manual = "true";
        }
    });
    // --- Luck Points manual flag ---
    if (inputs.LuckPoints) {
        if (data.LuckPointsManual) {
            inputs.LuckPoints.dataset.manual = "true";
        } else {
            delete inputs.LuckPoints.dataset.manual;
        }
    }
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
    if (inputs['Maximum HP'] && !inputs['Maximum HP']?.dataset?.manual) inputs['Maximum HP'].value = end + lck + level - 1;
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
    if (inputs[id]) {
        inputs[id].addEventListener("input", (e) => { 
            if (e.target.value.trim() === "") {
                delete inputs[id].dataset.manual; 
                updateDerivedStats(); 
            } else {
                inputs[id].dataset.manual = "true"; 
            }
            saveInputs();
        });
    }
};


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
    charTitle.style.background = "#2e4663";
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
    derivedTitle.style.background = "#2e4663"
    derivedStats.appendChild(derivedTitle);

	// Two-column grid for derived stats and HP/Luck
    const derivedGrid = document.createElement("div");
    derivedGrid.style.display = "flex";
    derivedGrid.style.gridTemplateColumns = "1fr 1fr";
    derivedGrid.style.gap = "10px";

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
	restBtn.style.justifyContent = "right"
	restBtn.style.textShadow = "2px 2px 5px navy"
	restBtn.style.color = "#ffc200"
	restBtn.onmouseover = () => { restBtn.style.transform = "scale(1.2)"; };
	restBtn.onmouseout = () => { restBtn.style.transform = "scale(1)"; };
	
	restBtn.onclick = () => {
		        // Read LCK and compute starting Luck Points (LCK - 1, not below 0)
	    const lckInput = document.getElementById("LCK");
	    const lck = parseInt(lckInput?.value) || 0;
	    const startingLuck = Math.max(0, lck - 1);
	
	    // Reset Luck Points hidden input
	    const luckInput = document.getElementById("LuckPoints");
	    if (luckInput) {
	        luckInput.value = startingLuck;
	
	        // Mark as manual so updateDerivedStats won't overwrite this scene start
	        luckInput.dataset.manual = "true";
	
	        const evt = new Event("input", { bubbles: true });
	        luckInput.dispatchEvent(evt);
	    }
	
	    // Reset Current HP to Maximum HP
	    const maxHpInput = document.getElementById("Maximum HP");
	    const currHpInput = document.getElementById("CurrentHP");
	    if (maxHpInput && currHpInput) {
	        currHpInput.value = maxHpInput.value;
	        const evt = new Event("input", { bubbles: true });
	        currHpInput.dispatchEvent(evt);
	    }
	
	    // Update Luck Points plus/minus display (renamed variable to avoid redeclare)
	    const luckDisplayNum = luckWrapper.querySelector('.plusminus-num');
	    if (luckDisplayNum) {
	        luckDisplayNum.textContent = startingLuck;
	    }
	
	    // Update HP plus/minus display
	    const hpDisplayNum = hpWrapper.querySelector('.plusminus-num');
	    if (hpDisplayNum && maxHpInput) {
	        hpDisplayNum.textContent = maxHpInput.value;
	    }
	
	    // No need to reload from localStorage here; values were just updated + saved.
	    // If you still want to recalc other derived stats, keep this:
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
        input.style.width = "90%";
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

	
	

    derivedGrid.appendChild(leftCol);

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
    const hpWrapper = document.createElement("div");
    hpWrapper.style.border = "1px solid #efdd6f";
    hpWrapper.style.padding = "5px";
    hpWrapper.style.display = "grid";
    hpWrapper.style.gridTemplateColumns = "auto auto";
    hpWrapper.style.alignItems = "center";
    hpWrapper.style.minHeight = "100px";

	// HP Title
    const hpTitle = document.createElement("label");
    hpTitle.textContent = "HP";
    hpTitle.style.gridColumn = "1 / span 2";
    hpTitle.style.textAlign = "center";
    hpTitle.style.color = "#efdd6f";
    hpTitle.style.fontWeight = "bold";
    hpTitle.style.fontSize = "13px";
    hpTitle.style.borderBottom = "2px solid #ffc200"
    hpTitle.style.marginBottom = "5px"
    hpWrapper.appendChild(hpTitle);

	// Max HP
    const maxHpLabel = document.createElement("label");
    maxHpLabel.textContent = "Maximum HP:";
    maxHpLabel.style.color = "#FFC200";
    maxHpLabel.style.marginBottom = "5px";
    hpWrapper.appendChild(maxHpLabel);

    const maxHpInput = document.createElement("input");
    maxHpInput.type = "text";
    maxHpInput.id = "Maximum HP";
    maxHpInput.style.minWidth = "20px";
    maxHpInput.style.maxWidth = "50px";
    maxHpInput.style.backgroundColor = "#fde4c9";
    maxHpInput.style.borderRadius = "5px";
    maxHpInput.style.color = "black";
    maxHpInput.style.caretColor = 'black';
    maxHpInput.style.justifySelf = "right";
    maxHpInput.style.justifyItems = "center";
    maxHpInput.style.marginBottom = "5px";
    hpWrapper.appendChild(maxHpInput);

	// Current HP
    const currHpLabel = document.createElement("label");
    currHpLabel.textContent = "Current HP:";
    currHpLabel.style.color = "#FFC200";
    hpWrapper.appendChild(currHpLabel);

    const currentHpInitial = (() => {
	    let d = localStorage.getItem("falloutRPGCharacterSheet");
	    if (d) try { return JSON.parse(d).CurrentHP || 0; } catch {}
	    return 0;
	})();
	const currentHpHiddenInput = document.createElement("input");
		currentHpHiddenInput.type = "hidden";
		currentHpHiddenInput.id = "CurrentHP";
		currentHpHiddenInput.value = currentHpInitial;
		hpWrapper.appendChild(currentHpHiddenInput);
		
		const currentHpField = createPlusMinusDisplay({
		    value: currentHpInitial,
		    min: 0,
		    onChange: (val) => {
		        currentHpHiddenInput.value = val;
		        let evt = new Event("input", { bubbles: true });
		        currentHpHiddenInput.dispatchEvent(evt);
		    }
		});
		hpWrapper.appendChild(currentHpField);



    rightCol.appendChild(hpWrapper);
    derivedGrid.appendChild(rightCol);

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
    specialTitle.style.background = "#2e4663"
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
    skillsTitle.style.background = "#2e4663";
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
        specialTag.style.color = "white";
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
    decreaseIcon.style = "cursor:pointer;color:cyan;font-size:15px;margin-left:15px";

    const increaseIcon = document.createElement('span');
    increaseIcon.textContent = "+";
    increaseIcon.style = "cursor:pointer;color:tomato;font-size:15px;";

    const CapsDisplay = document.createElement('span');
    CapsDisplay.textContent = storedValue;
    CapsDisplay.style = "text-align:center;color:#efdd6f;cursor:pointer;fontWeight:bold;font-size:15px;";

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
            link: `[[${file.basename}]]`, type: "N/A", damage: "N/A",
            damage_effects: "N/A", dmgtype: "Unknown", fire_rate: "N/A",
            range: "N/A", qualities: "N/A", ammo: "N/A", weight: "N/A",
            cost: "N/A", rate: "N/A"
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

// ---------------- Weapon Mods (cost-only) ----------------

// IMPORTANT: Set this to your actual mods folder(s)
const WEAPON_MOD_FOLDERS = [
  "Fallout-RPG/Items/Mods/Weapon Mods"];

const LEGENDARY_PROP_FOLDER = "Fallout-RPG/Legendary Item Creation/Legendary Weapons/Legendary Weapon Properties";

let cachedWeaponModData = null;

function extractFirstInt(s) {
  if (s == null) return NaN;
  const m = String(s).match(/-?\d+/);
  return m ? parseInt(m[0], 10) : NaN;
}

function ensureWeaponBaseCost(rowData) {
  // Preserve original weapon cost so cost can be recalculated repeatedly
  if (rowData.baseCost === undefined) rowData.baseCost = rowData.cost ?? "";
}

function recalcWeaponCostFromMods(rowData) {
  // preserve original cost once
  if (rowData.baseCost === undefined) rowData.baseCost = rowData.cost ?? "";

  const baseNum = extractFirstInt(rowData.baseCost);
  if (Number.isNaN(baseNum)) return;

  const addons = Array.isArray(rowData.addons) ? rowData.addons : [];
  const delta = addons.reduce((sum, a) => sum + (extractFirstInt(a.cost) || 0), 0);

  rowData.cost = String(baseNum + delta);
}


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

    // Legendary: add, but cost is always +0 (no statblock required)
    if (isLegendary) {
      return {
		  id: file.path,
		  basename: file.basename,
		  link: `[[${file.basename}]]`,
		  cost: "+0",
		  type: "legendary",      // <-- add this
		  isLegendary: true       // <-- optional; keep if you want
		};
    }

    // Mod: parse cost from statblock (your existing behavior)
    const content = await app.vault.read(file);
    const statblockMatch = content.match(/```statblock([\s\S]*?)```/);
    if (!statblockMatch) return null;

    const block = statblockMatch[1].trim();
    const get = (re) => {
      const m = block.match(re);
      return m ? m[1].trim().replace(/"/g, "") : "";
    };

    const cost = get(/cost:\s*(.+)/i) || "+0";

    return {
	  id: file.path,
	  basename: file.basename,
	  link: `[[${file.basename}]]`,
	  cost,
	  type: "mod",            // <-- add this
	  isLegendary: false      // <-- optional
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

        rowData.addons.push({ id: m.id, link: m.link, cost: m.cost });

        // cost-only recalculation
        recalcWeaponCostFromMods(rowData);

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
  // Base snapshot prevents stat drift when adding/removing
  if (!stored.base) {
    stored.base = {
      physdr: stored.physdr ?? "",
      endr: stored.endr ?? "",
      raddr: stored.raddr ?? "",
      hp: isPowerArmor ? (stored.hp ?? "") : undefined,
      value: stored.value ?? ""
    };
  }
  if ((stored.value == null || String(stored.value).trim() === "") && stored.base && stored.base.value != null) {
  stored.value = String(stored.base.value);
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
    if (!Number.isNaN(bHp)) stored.hp = String(bHp + dHP);
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
    title.style.background = "#2e4663";
    title.style.padding = "5px 1px 5px 15px";
    title.style.display = 'grid';
    title.style.gridTemplateColumns = '90%  10%';
    card.appendChild(title);

    // DR + HP grid
    let statGrid = document.createElement('div');
    statGrid.style.display = 'grid';
    statGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
    statGrid.style.background = "#325886";
    statGrid.style.padding = "10px 0";
    statGrid.style.borderRadius = "5px 5px 0 0";
    statGrid.style.border = '2px solid #2e4663'
    statGrid.style.justifyContent = "center";
    
    const resetBtn = document.createElement("button");
	resetBtn.textContent = "↻";
	resetBtn.title = "Reset this card to blank";
	// Remove all default button styles:
	resetBtn.style.background = "none";
	resetBtn.style.border = "none";
	resetBtn.style.outline = "none";
	resetBtn.style.boxShadow = "none";

	resetBtn.style.fontSize = ".8em";
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
	    : '(Click to edit)';
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
	  addBtn.style.background = '#ffc200';
	  addBtn.style.color = '#2e4663';
	  addBtn.style.fontWeight = 'bold';
	  addBtn.style.border = 'none';
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
    title.style.background = "#2e4663";
    title.style.padding = "5px 1px 5px 15px";
    title.style.display = 'grid';
    title.style.gridTemplateColumns = '90%  10%';
    card.appendChild(title);

    // DR + HP grid
    let statGrid = document.createElement('div');
    statGrid.style.display = 'grid';
    statGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
    statGrid.style.background = "#325886";
    statGrid.style.padding = "10px 0";
    statGrid.style.borderRadius = "5px 5px 0 0";
    statGrid.style.border = '2px solid #2e4663'
    statGrid.style.justifyContent = "center";
    
    // ---- RESET BUTTON ----
	const resetBtn = document.createElement("button");
	resetBtn.textContent = "↻";
	resetBtn.title = "Reset this card to blank";
	// Remove all default button styles:
	resetBtn.style.background = "none";
	resetBtn.style.border = "none";
	resetBtn.style.outline = "none";
	resetBtn.style.boxShadow = "none";
	
	resetBtn.style.fontSize = ".8em";
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
		      base: { physdr: armor.physdr, endr: armor.endr, raddr: armor.raddr, hp: armor.hp, value: armor.value ?? "0" },
		      addons: []
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
	  addBtn.style.background = '#ffc200';
	  addBtn.style.color = '#2e4663';
	  addBtn.style.fontWeight = 'bold';
	  addBtn.style.border = 'none';
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
	recalcArmorFromAddons(stored, true);
	savePowerArmorData(section, stored);
	
	labels.forEach(([_, key]) => { inputs[key].value = stored[key] || ""; });
	updateApparelDisplay();


    // Storage sync
    labels.forEach(([_, key]) => {
	  inputs[key].addEventListener('input', () => {
	    let stored = loadPowerArmorData(section);
	    ensureArmorBase(stored, true);
	
	    stored[key] = inputs[key].value;
	
	    // keep base aligned with manual edits
	    if (key === "physdr") stored.base.physdr = stored[key];
	    if (key === "endr")   stored.base.endr   = stored[key];
	    if (key === "raddr")  stored.base.raddr  = stored[key];
	    if (key === "hp")     stored.base.hp     = stored[key];
	
	    savePowerArmorData(section, stored);
	  });
	});

    apparelInput.addEventListener('input', () => {
        let stored = loadPowerArmorData(section);
        stored.apparel = apparelInput.value;
        apparelDisplay.innerHTML = stored.apparel.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
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
            qty: "1",
            cost: "",
            selected: false
        };
        let statblockMatch = content.match(/```statblock([\s\S]*?)```/);
        if (!statblockMatch) return stats;
        let statblockContent = statblockMatch[1].trim();

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
    { label: "", key: "selected", type: "checkbox" }, // Equipped/important
    { label: "Name", key: "name", type: "link" },
    { label: "Qty", key: "qty", type: "number" },
    { label: "Cost", key: "cost", type: "text" },
    { label: "Remove", type: "remove" }
];

// ---- GEAR TABLE SECTION ----
function renderGearTableSection() {
    return createEditableTable({
        columns: gearColumns,
        storageKey: GEAR_STORAGE_KEY,
        fetchItems: fetchGearData   // DRY search bar!
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

let cachedPerkData = null;
async function fetchPerkData() {
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

        let descMatch = content.match(/(?:description:|desc:)\s*["']?([^"\n]+)["']?/i);
        if (descMatch) {
            stats.description = descMatch[1].trim();
        } else {
            // Fallback: get everything after "Ranks:"
            let descStart = content.indexOf("Ranks:");
            if (descStart !== -1) {
                let descContent = content.substring(descStart).split("\n").slice(1).join(" ").trim();
                stats.description = descContent.length > PERK_DESCRIPTION_LIMIT 
                    ? descContent.substring(0, PERK_DESCRIPTION_LIMIT) + "..."
                    : descContent;
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
    { label: "Description", key: "description", type: "link" }, // Editable, full text
    { label: "Remove", type: "remove" }                    // Remove button
];

function renderPerkTableSection() {
    return createEditableTable({
        columns: perkColumns,
        storageKey: PERK_STORAGE_KEY,
        fetchItems: fetchPerkData
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
    sheetcontainer.appendChild(createSectionHeader("Weapons"));
    sheetcontainer.appendChild(weaponTableContainer);
    updateWeaponTableDOM(); // <-- Re-render weapon table

    // --- 4. Render Ammo table (no extra listeners needed if all logic inside table function)
    sheetcontainer.appendChild(createSectionHeader("Ammo"));
    sheetcontainer.appendChild(renderAmmoTableSection());

    // --- 5. Armor section (if any listeners are required, call a setup function here)
    sheetcontainer.appendChild(createSectionHeader("Armor"));
    sheetcontainer.appendChild(renderArmorTabsSection());
    // (If you need: setupArmorSection();)

    // --- 6. Gear
    sheetcontainer.appendChild(createSectionHeader("Gear"));
    sheetcontainer.appendChild(renderGearTableSection());

    // --- 7. Perks
    sheetcontainer.appendChild(createSectionHeader("Perks"));
    sheetcontainer.appendChild(renderPerkTableSection());
	
    // --- (If you need to re-attach listeners to other dynamic elements, do it here!)
    
}





refreshSheet();
return sheetcontainer;


```
