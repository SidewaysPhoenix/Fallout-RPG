```js-engine
const vault = app.vault;
const dv = app.plugins.plugins.dataview?.api;

if (!dv) {
    throw new Error("Dataview plugin is not available. Please ensure Dataview is enabled.");
}

const STORAGE_KEY = 'fallout_ammo_filter_inputs';
const TABLE_KEY = 'fallout_ammo_table_results';

const saveInputs = () => {
    const data = {};
    Object.keys(inputs).forEach(key => {
        data[key] = inputs[key].value;
    });
    data.sortField = sortFieldSelect.value;
    data.sortOrder = sortOrderSelect.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadInputs = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    Object.keys(inputs).forEach(key => {
        if (data[key] !== undefined) inputs[key].value = data[key];
    });
    if (data.sortField) sortFieldSelect.value = data.sortField;
    if (data.sortOrder) sortOrderSelect.value = data.sortOrder;
};

const saveTableData = (data) => {
    const cleanData = data.map(({ name, rarity, cost, file }) => ({
        name,
        rarity,
        cost,
        filePath: file?.path || null
    }));
    localStorage.setItem(TABLE_KEY, JSON.stringify(cleanData));
};

const loadTableData = () => {
    const data = JSON.parse(localStorage.getItem(TABLE_KEY) || '[]');
    const allFiles = app.vault.getFiles();

    return data.map(entry => {
        const file = entry.filePath
            ? allFiles.find(f => f.path === entry.filePath)
            : null;

        return {
            name: entry.name,
            rarity: entry.rarity,
            cost: entry.cost,
            file
        };
    });
};

const mainContainer = document.createElement('div');
mainContainer.style.display = 'flex';
mainContainer.style.flexDirection = 'column';
mainContainer.style.gap = '10px';
mainContainer.style.padding = '10px';
mainContainer.style.border = '1px solid #ccc';
mainContainer.style.borderRadius = '10px';
mainContainer.style.backgroundColor = '#FFF3E0';

const inputs = {};
const fields = [
    { label: 'Rarity (Min)', key: 'minRarity', type: 'number' },
    { label: 'Rarity (Max)', key: 'maxRarity', type: 'number' },
    { label: 'Max Items', key: 'maxItems', type: 'number' },
    { label: 'Randomize Selection', key: 'randomizeSelection', type: 'select', options: ['true', 'false'] },
    { label: 'Include Folders', key: 'includeFolders', type: 'text' },
    { label: 'Exclude Folders', key: 'excludeFolders', type: 'text' }
];

fields.forEach(field => {
    const fieldContainer = document.createElement('div');
    fieldContainer.style.display = 'flex';
    fieldContainer.style.alignItems = 'center';
    fieldContainer.style.gap = '10px';

    const label = document.createElement('label');
    label.textContent = field.label;
    label.style.width = '150px';
    label.style.color = 'black';
    fieldContainer.appendChild(label);

    let input;
    if (field.type === 'select') {
        input = document.createElement('select');
        field.options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            input.appendChild(opt);
            input.style.color = 'black';
            input.style.border = '1px solid black';
        });
    } else {
        input = document.createElement('input');
        input.type = field.type;
        input.style.width = '200px';
    }
    input.style.borderRadius = '4px';
    input.style.color = 'black';
    input.style.caretColor = 'black';
	input.style.backgroundColor = '#fde4c9';
    input.addEventListener('input', saveInputs);
    inputs[field.key] = input;
    fieldContainer.appendChild(input);
    mainContainer.appendChild(fieldContainer);
});

const sortContainer = document.createElement('div');
sortContainer.style.display = 'flex';
sortContainer.style.alignItems = 'center';
sortContainer.style.gap = '10px';
sortContainer.style.marginTop = '20px';

const sortLabel = document.createElement('label');
sortLabel.textContent = 'Sort:';
sortLabel.style.fontWeight = 'bold';
sortLabel.style.color = 'black';
sortContainer.appendChild(sortLabel);

const sortFieldSelect = document.createElement('select');
['Name', 'Rarity'].forEach(option => {
    const opt = document.createElement('option');
    opt.value = option.toLowerCase();
    opt.textContent = option;
    sortFieldSelect.appendChild(opt);
    sortFieldSelect.style.color = 'black';
    sortFieldSelect.style.border = '1px solid black';
});
sortFieldSelect.style.borderRadius = '4px';
sortFieldSelect.style.backgroundColor = '#fde4c9';
sortFieldSelect.addEventListener('change', saveInputs);
sortContainer.appendChild(sortFieldSelect);

const sortOrderSelect = document.createElement('select');
['Ascending', 'Descending'].forEach(order => {
    const opt = document.createElement('option');
    opt.value = order.toLowerCase();
    opt.textContent = order;
    sortOrderSelect.appendChild(opt);
    sortOrderSelect.style.color = 'black';
    sortOrderSelect.style.border = '1px solid black';
});
sortOrderSelect.style.borderRadius = '4px';
sortOrderSelect.style.backgroundColor = '#fde4c9';
sortOrderSelect.addEventListener('change', saveInputs);
sortContainer.appendChild(sortOrderSelect);

mainContainer.appendChild(sortContainer);

const resultsContainer = document.createElement('div');
mainContainer.appendChild(resultsContainer);

const renderTable = (data) => {
    resultsContainer.innerHTML = '';
    if (data.length === 0) {
        resultsContainer.textContent = "No ammo match the selected filters.";
        resultsContainer.style.color = 'black';
        return;
    }
    
    const table = document.createElement('table');
    
    
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>#</th><th>Name</th><th>Cost</th><th>Rarity</th>';
    table.appendChild(headerRow);
    
    data.forEach((p, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
	        <td style="text-align: left;">${index + 1}</td>
	        <td style="text-align: left;"><a class="internal-link" href="${p.file?.path || '#'}">${p.name || '-'}</a></td>
	        <td style="text-align: left;">${p.cost ?? '-'}</td>
	        <td style="text-align: left;">${p.rarity ?? '-'}</td>`;
        table.appendChild(row);
    });
    resultsContainer.appendChild(table);
};

const folderPath = "Fallout-RPG/Items/Ammo/";
let pages = await Promise.all(
    vault.getFiles()
        .filter(file => file.path.startsWith(folderPath))
        .map(async file => {
            const content = await vault.read(file);
            const statblockMatch = content.match(/```statblock([\s\S]*?)```/);

            if (statblockMatch) {
                const statblock = {};
                statblockMatch[1].split('\n').forEach(line => {
                    const match = line.match(/^([\w\s]+):\s*(.+)$/);
                    if (match) {
                        const key = match[1].trim().toLowerCase();
                        const value = match[2].trim().replace(/^"|"$/g, '');
                        statblock[key] = value;
                    }
                });

                return {
                    file,
                    name: (statblock["name"] || file.name).replace(/\.md$/, ''),
                    rarity: parseInt(statblock["rarity"]?.match(/\d+/)?.[0] || "0", 10),
                    cost: parseInt(statblock["cost"]?.match(/\d+/)?.[0] || "0", 10)
                };
            }
            return null;
        })
);
pages = pages.filter(Boolean);

const applyFilters = () => {
    let filteredPages = [...pages];
    const minRarity = Number(inputs['minRarity'].value) || 0;
    const maxRarity = inputs['maxRarity'].value.trim() === '' 
	    ? 10 
	    : Number(inputs['maxRarity'].value);
    const maxItems = Number(inputs['maxItems'].value) || 1000;
    const randomizeSelection = inputs['randomizeSelection'].value === 'true';
    const includeFolders = inputs['includeFolders'].value.split(',').map(folder => folder.trim()).filter(Boolean);
    const excludeFolders = inputs['excludeFolders'].value.split(',').map(folder => folder.trim()).filter(Boolean);
    
    if (includeFolders.length > 0) {
        filteredPages = filteredPages.filter(p => includeFolders.some(folder => p.file.path.includes(folder)));
    }
    
    if (excludeFolders.length > 0) {
        filteredPages = filteredPages.filter(p => !excludeFolders.some(folder => p.file.path.includes(folder)));
    }
    
    filteredPages = filteredPages.filter(p => p.rarity >= minRarity && p.rarity <= maxRarity);
    
    if (randomizeSelection) {
        filteredPages.sort(() => Math.random() - 0.5);
    } else {
        const field = sortFieldSelect.value;
        const order = sortOrderSelect.value === 'ascending' ? 1 : -1;
        
        filteredPages.sort((a, b) => {
            if (field === 'name') return order * a.name.localeCompare(b.name);
            if (field === 'rarity') return order * (a.rarity - b.rarity);
            return 0;
        });
    }
    
    filteredPages = filteredPages.slice(0, maxItems);
    saveTableData(filteredPages);
    renderTable(filteredPages);
};

const button = document.createElement('button');
button.textContent = "Apply Filters";
button.style.padding = '10px 20px';
button.style.backgroundColor = '#FFC200';
button.style.color = 'black';
button.style.border = 'solid 1px';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';
button.addEventListener('click', applyFilters);
mainContainer.insertBefore(button, sortContainer.nextSibling);

if (typeof container !== 'undefined') {
    container.appendChild(mainContainer);
} else {
    document.body.appendChild(mainContainer);
}

loadInputs();
renderTable(loadTableData());

```