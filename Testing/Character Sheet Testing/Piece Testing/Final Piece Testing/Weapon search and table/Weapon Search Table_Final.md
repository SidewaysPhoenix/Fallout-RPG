```dataviewjs
// Fallout-RPG - Searchable Weapons Table with Extended Fields
let dvContainer = dv.container || dv.el("div", "", { cls: "weapons-table-container" });
dv.container = dvContainer;
dvContainer.replaceChildren(); // Clear existing elements

const STORAGE_KEY = 'falloutRPGWeaponsTable';
let weaponsTable = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

const extractWeaponStats = async (filePath) => {
    let fileText = await dv.io.load(filePath);
    if (!fileText) return {};

    let statblockMatch = fileText.match(/```statblock([\s\S]*?)```/);
    if (!statblockMatch) return {};

    let statblockContent = statblockMatch[1].trim();
    let stats = {
        dmgtype: "Unknown", damage: "N/A", damage_effects: "N/A", fire_rate: "N/A", 
        range: "N/A", qualities: "N/A", weight: "N/A", cost: "N/A", ammo: "N/A", type: "N/A"
    };

    const fieldPatterns = {
        dmgtype: /damage_type:\s*(.*)/i,
        damage: /damage_rating:\s*(.*)/i,
        damage_effects: /damage_effects:\s*(.*)/i,
        fire_rate: /fire_rate:\s*(.*)/i,
        range: /range:\s*(.*)/i,
        qualities: /qualities:\s*(.*)/i,
        weight: /weight:\s*(.*)/i,
        type: /type:\s*(.*)/i,
        ammo: /ammo:\s*(.*)/i
    };

    for (const [key, pattern] of Object.entries(fieldPatterns)) {
        let match = statblockContent.match(pattern);
        if (match) stats[key] = match[1].trim().replace(/"/g, '');
    }
    return stats;
};

let availableWeapons = await Promise.all(dv.pages().where(p => p.file.path.includes("Fallout-RPG/Items/Weapons")).map(async p => {
    let stats = await extractWeaponStats(p.file.path);
    return {
        name: p.file.name,
        ...stats,
        link: `[[${p.file.name}]]`
    };
}));

const saveWeaponsTable = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weaponsTable));
};

const addWeapon = (weapon) => {
    weaponsTable.push({ ...weapon });
    saveWeaponsTable();
    renderWeaponsTable();
};

const removeWeapon = (index) => {
    weaponsTable.splice(index, 1);
    saveWeaponsTable();
    renderWeaponsTable();
};

const renderWeaponsTable = () => {
    dvContainer.replaceChildren();
    createSearchField();
    
    const createEditableField = (weapon, index, field) => {
    let container = dv.el("span", "", { style: "display: flex; justify-content: space-between; align-items: center; width: 100%;" });

    let textSpan = dv.el("span", weapon[field], { style: "flex-grow: 1; white-space: nowrap;" });

    let editLink = dv.el("a", "✎ ", { 
        style: "cursor: pointer; text-decoration: none; font-size: 12px; color: inherit; margin-left: auto;", 
        attr: { title: "Edit" }
    });

    editLink.onclick = () => {
        let input = dv.el("input", "", { 
            attr: { type: "text", value: weapon[field] }, 
            style: "width: 60px; padding: 2px; font-size: 12px; border: 1px solid #ccc; border-radius: 3px; display: inline;"
        });

        let saveLink = dv.el("a", " ✔", { 
            style: "cursor: pointer; margin-left: 3px; font-size: 12px; text-decoration: none; color: green;"
        });

        saveLink.onclick = () => {
            weapon[field] = input.value;
            saveWeaponsTable();
            renderWeaponsTable();
        };

        container.replaceChildren(input, saveLink);
    };

    container.appendChild(editLink);
    container.appendChild(textSpan);

    return container;
};

    
    let tableData = weaponsTable.map((weapon, index) => [
        createEditableField(weapon, index, "link"),
        createEditableField(weapon, index, "type"),
        createEditableField(weapon, index, "damage"),
        createEditableField(weapon, index, "damage_effects"),
        createEditableField(weapon, index, "dmgtype"),
        createEditableField(weapon, index, "fire_rate"),
        createEditableField(weapon, index, "range"),
        createEditableField(weapon, index, "qualities"),
        createEditableField(weapon, index, "ammo"),
        createEditableField(weapon, index, "weight"),
        
        
		
        (() => {
            let btn = dv.el("a", " 🗑️", { 
    style: "cursor: pointer; text-decoration: none; font-size: 16px; color: red; display: flex; justify-content: center; align-items: center; width: 100%;",
    attr: { title: "Remove" }
});
    btn.onclick = () => removeWeapon(index);
    return btn;
})()

    ]);
    
    dv.table([
        "Name", "Skill", "Damage", "Effects", "Type", "Rate", "Range", "Qualities", "Ammo", "Weight", "Remove"
    ], tableData, dvContainer);
};

const createSearchField = () => {
	let searchBlock = dv.el("div", "", { //added for search highlighting remove if issue for function
        style: "background-color: #007BFF; padding: 15px; border-radius: 5px; margin-bottom: 15px; width: 100%; text-align: center;"
    });
    let searchInput = dv.el("input", "", { cls: "search-input", attr: { type: "text", placeholder: "Type to search..." } });
    let weaponListDiv = dv.el("div", "", { cls: "weapon-list", style: "display:none; background: #fde4c9; border: 1px solid #ccc; padding: 5px; width: 250px; max-height: 200px; overflow-y: auto;" });
    searchInput.addEventListener("input", () => filterWeapons(searchInput, weaponListDiv));
    dvContainer.appendChild(searchInput);
    dvContainer.appendChild(weaponListDiv);
};

const filterWeapons = (searchInput, weaponListDiv) => {
    weaponListDiv.innerHTML = "";
    let searchValue = searchInput.value.toLowerCase().trim();
    if (searchValue.length > 0) {
        let filteredWeapons = availableWeapons.filter(w => w.name.toLowerCase().includes(searchValue));
        if (filteredWeapons.length > 0) {
            weaponListDiv.style.display = "block";
            filteredWeapons.forEach(weapon => {
                let div = dv.el("div", weapon.name, { cls: "search-result", style: "padding: 5px; cursor: pointer; border-bottom: 1px solid #ccc;" });
                div.addEventListener("click", () => {
                    addWeapon(weapon);
                    searchInput.value = "";
                    weaponListDiv.style.display = "none";
                    renderWeaponsTable();
                });
                weaponListDiv.appendChild(div);
            });
        } else {
            weaponListDiv.style.display = "none";
        }
    } else {
        weaponListDiv.style.display = "none";
    }
};

renderWeaponsTable();

```