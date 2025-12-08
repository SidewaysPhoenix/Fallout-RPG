```js-engine
// Fallout RPG Character Sheet - JS-Engine Compatible
const builder = engine.markdown.createBuilder();
const STORAGE_KEY = 'falloutRPGCharacterSheet';
const inputs = {};

// Inject CSS dynamically into the page
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .fallout-container {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            background-color: #325886;
            text-align: left;
            width: 100%;
            max-width: 500px;
        }
        .fallout-heading {
            font-weight: bold;
            font-size: 20px;
            color: #efdd6f;
            text-align: center;
            margin-bottom: 10px;
        }
        .fallout-label {
            font-weight: bold;
            color: #efdd6f;
            text-align: left;
            display: block;
        }
        .fallout-label-special {
            font-weight: bold;
            color: #efdd6f;
            text-align: center;
            display: block;
        }
        .fallout-input {
            padding: 6px;
            border: 2px solid #ccc;
            border-radius: 8px;
            background-color: #fde4c9 !important;
            color: black;
            width: 100%;
            display: block;
        }
        .fallout-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            align-items: center;
        }
        .fallout-grid-special {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 10px;
            align-items: center;
        }
        .fallout-grid-full {
            grid-column: span 2;
        }
        .fallout-input-small { width: 50px; }
        .fallout-input-medium { width: 120px; }
        .fallout-input-large { width: 100%; }
        .fallout-grid-vertical {
            display: grid;
            grid-template-columns: 1fr;
            gap: 5px;
            text-align: left;
        }
    </style>
`);

const saveInputs = () => {
    const data = Object.fromEntries(
        Object.keys(inputs).map(key => [key, inputs[key]?.value || null])
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadInputs = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    Object.entries(inputs).forEach(([key, input]) => input.value = data[key] ?? "");
};

const createInput = (label, id, type = 'text', extraClass = '', labelClass = 'fallout-label') => {
    builder.createParagraph(
        `<div class="${extraClass}" style="text-align: center;">
            <label for="${id}" class="${labelClass}">${label}</label>
            <input id="${id}" type="${type}" class="fallout-input ${extraClass}">
        </div>`
    );
    setTimeout(() => {
        const input = document.getElementById(id);
        if (input) {
            inputs[id] = input;
            input.addEventListener('input', saveInputs);
        }
    }, 0);
};

const createSection = (title, contentGenerator) => {
    builder.createParagraph(
        `<div class="fallout-container">
            <div class="fallout-heading">${title}</div>`
    );
    contentGenerator();
    builder.createParagraph('</div>');
};

// Character Info
createSection('Character Info', () => {
    builder.createParagraph('<div class="fallout-grid">');
    createInput('Name', 'Name', 'text', 'fallout-grid-full fallout-input-large');
    createInput('Origin', 'Origin', 'text', 'fallout-input-medium');
    createInput('Level', 'Level', 'number', 'fallout-input-small');
    createInput('XP Earned', 'XPEarned', 'number', 'fallout-input-medium');
    createInput('XP to Next Level', 'XPNext', 'number', 'fallout-input-medium');
    builder.createParagraph('</div>');
});

// SPECIAL Stats - Horizontal Layout
createSection('S.P.E.C.I.A.L.', () => {
    builder.createParagraph('<div class="fallout-grid-special">');
    ['STR', 'PER', 'END', 'CHA', 'INT', 'AGI', 'LCK']
        .forEach(stat => createInput(stat, stat, 'number', 'fallout-input-small', 'fallout-label-special'));
    builder.createParagraph('</div>');
});

// Derived Stats - Vertical Layout
createSection('Derived Stats', () => {
    builder.createParagraph('<div class="fallout-grid-vertical">');
    createInput('Melee Damage', 'MeleeDamage', 'number', 'fallout-input-medium');
    createInput('Defense', 'Defense', 'number', 'fallout-input-medium');
    createInput('Initiative', 'Initiative', 'number', 'fallout-input-medium');
    createInput('Luck Points', 'LuckPoints', 'number', 'fallout-input-medium');
    createInput('Maximum HP', 'MaxHP', 'number', 'fallout-input-medium');
    createInput('Current HP', 'CurrentHP', 'number', 'fallout-input-medium');
    builder.createParagraph('</div>');
});

// Load data when script runs
setTimeout(() => {
    loadInputs();
}, 100);

return builder;
```
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
        editIcon.textContent = '✎';
        editIcon.style.cursor = 'pointer';
        editIcon.style.color = '#d7d7d782'; 
        editIcon.style.marginRight = '5px';
        
        editIcon.onclick = () => {
            let input = document.createElement('input');
            input.type = 'text';
            input.value = value;
            
            input.addEventListener('blur', () => {
                let newValue = input.value;
                td.innerHTML = '';
                td.appendChild(editIcon);
                td.innerHTML += newValue.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
                let key = Object.keys(weapon)[index];
                weapon[key] = newValue;
                saveWeaponTableState(weapons);
            });
            td.textContent = '';
            td.appendChild(input);
            input.focus();
        };

        
        console.log("Added edit icon to table cell:", td.innerHTML); // Debugging log
        td.innerHTML += value.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
        td.prepend(editIcon); // Move edit icon to the front
        row.appendChild(td);
    });

    // Create remove icon instead of a button
    const removeTd = document.createElement('td'); 
    removeTd.style.border = '1px solid #ccc'; 
    removeTd.style.padding = '8px'; 
    removeTd.style.textAlign = 'center'; // Center icon in the cell
    removeTd.style.verticalAlign = 'middle'; // Center vertically removeTd.style.height = '100%'; // Ensures full height for vertical centering
     
    
    let removeIcon = document.createElement('span'); 
    removeIcon.textContent = '🗑️'; 
    removeIcon.style.cursor = 'pointer'; 
    removeIcon.style.display = 'inline-block'; // Helps with centering 
    removeIcon.style.lineHeight = '1';
    removeIcon.style.fontSize = '1.2em'; // Optional: makes it slightly larger
    removeIcon.style.verticalAlign = 'middle' 
    removeIcon.onclick = () => { 
	    tbody.removeChild(row); 
	    let index = weapons.findIndex(w => w.name === weapon.name); 
	    if (index !== -1) { 
		    weapons.splice(index, 1); 
		} 
		saveWeaponTableState(weapons); 
	}; 
	
	removeTd.appendChild(removeIcon); 
	row.appendChild(removeTd); 
	tbody.appendChild(row); 
}



async function renderWeaponTableUI() {
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.border = '1px solid #e0c9a0';
    container.style.borderRadius = '8px';
    container.style.backgroundColor = '#325886';
    container.style.overflowX = 'auto';
    container.style.width = '100%';

    const title = document.createElement('h1');
    title.textContent = "Weapons";
    title.style.color = "#d8ca0a";
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
