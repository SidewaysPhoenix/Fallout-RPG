```js-engine
const STORAGE_KEY = "fallout_weapon_table";

async function fetchWeaponData() {
    const WEAPONS_FOLDER = "Fallout RPG/Items/Weapons";
    let allFiles = await app.vault.getFiles();
    let weaponFiles = allFiles.filter(file => file.path.startsWith(WEAPONS_FOLDER));
    
    let weapons = await Promise.all(weaponFiles.map(async (file) => {
        let content = await app.vault.read(file);
        
        let stats = {
            link: `[[${file.basename}]]`,
            type: "N/A", damage: "N/A", damage_effects: "N/A", dmgtype: "Unknown",
            fire_rate: "N/A", range: "N/A", qualities: "N/A", ammo: "N/A", weight: "N/A", cost: "N/A", rate: "N/A"
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
    return weapons.filter(w => w);
}

function saveWeaponTableState(weapons) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weapons));
}

function loadWeaponTableState() {
    let data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function addWeaponToTable(weapon, tbody, weapons) {
    let row = document.createElement('tr');
    
    [weapon.link, weapon.type, weapon.damage, weapon.damage_effects, weapon.dmgtype, weapon.rate, weapon.range, weapon.qualities, weapon.ammo, weapon.weight, weapon.cost].forEach((value, index) => {
        const td = document.createElement('td');
        td.style.border = '1px solid #ccc';
        td.style.padding = '8px';
        
        let editIcon = document.createElement('span');
        editIcon.textContent = ' ✏️';
        editIcon.style.cursor = 'pointer';
        editIcon.onclick = () => {
            let input = document.createElement('input');
            input.type = 'text';
            input.value = value;
            input.addEventListener('blur', () => {
                let newValue = input.value;
                td.innerHTML = newValue.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
                td.appendChild(editIcon);
                let key = Object.keys(weapon)[index];
                weapon[key] = newValue;
                saveWeaponTableState(weapons);
            });
            td.textContent = '';
            td.appendChild(input);
            input.focus();
        };
        
        td.innerHTML = value.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
        td.appendChild(editIcon);
        row.appendChild(td);
    });
    
    const removeTd = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '🗑️';
    removeBtn.style.cursor = 'pointer';
    removeBtn.onclick = () => {
        tbody.removeChild(row);
        let index = weapons.findIndex(w => w.name === weapon.name);
        if (index !== -1) {
            weapons.splice(index, 1);
        }
        saveWeaponTableState(weapons);
    };
    removeTd.appendChild(removeBtn);
    row.appendChild(removeTd);
    
    tbody.appendChild(row);
}

async function renderWeaponTableUI() {
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.border = '1px solid #e0c9a0';
    container.style.borderRadius = '8px';
    container.style.backgroundColor = '#FFF7E6';
    container.style.overflowX = 'auto';
    container.style.width = '100%';

    const title = document.createElement('h2');
    title.textContent = "Fallout RPG Weapon Search Table";
    container.appendChild(title);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search by name...';
    searchInput.style.marginBottom = '10px';
    searchInput.style.padding = '5px';
    searchInput.style.width = '100%';
    container.appendChild(searchInput);

    const searchResults = document.createElement('div');
    searchResults.style.border = '1px solid #ccc';
    searchResults.style.backgroundColor = '#fde4c9';
    searchResults.style.padding = '5px';
    searchResults.style.display = 'none';
    container.appendChild(searchResults);

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ["Name", "Type", "Damage", "Effects", "Damage Type", "Rate", "Range", "Qualities", "Ammo", "Weight", "Cost", "Remove"].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid #ccc';
        th.style.padding = '8px';
        th.style.textAlign = 'left';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    container.appendChild(table);
    
    let weapons = loadWeaponTableState();
    weapons.forEach(weapon => addWeaponToTable(weapon, tbody, weapons));

    searchInput.addEventListener('input', async () => {
        let query = searchInput.value.toLowerCase();
        searchResults.innerHTML = '';
        searchResults.style.display = query ? 'block' : 'none';
        
        let allWeapons = await fetchWeaponData();
        let matches = allWeapons.filter(w => w.name.toLowerCase().includes(query));
        
        matches.forEach(weapon => {
            let div = document.createElement('div');
            div.textContent = weapon.name;
            div.style.padding = '5px';
            div.style.cursor = 'pointer';
            div.addEventListener('click', () => {
                addWeaponToTable(weapon, tbody, weapons);
                weapons.push(weapon);
                saveWeaponTableState(weapons);
                searchInput.value = '';
                searchResults.style.display = 'none';
            });
            searchResults.appendChild(div);
        });
    });
    
    return container;
}

return renderWeaponTableUI();

```