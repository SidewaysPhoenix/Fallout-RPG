```js-engine
const vault = app.vault;
const dv = app.plugins.plugins.dataview?.api;

if (!dv) {
    throw new Error("Dataview plugin is not available. Please ensure Dataview is enabled.");
}

const STORAGE_KEY = 'fallout_chems_filter_inputs';

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

// Create Main Container
const mainContainer = document.createElement('div');
mainContainer.style.display = 'flex';
mainContainer.style.flexDirection = 'column';
mainContainer.style.gap = '10px';
mainContainer.style.padding = '10px';
mainContainer.style.border = '1px solid #ccc';
mainContainer.style.borderRadius = '10px';
mainContainer.style.backgroundColor = '#FFF3E0';

const inputs = {};

// Input Fields
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
    fieldContainer.appendChild(label);

    let input;
    if (field.type === 'select') {
        input = document.createElement('select');
        field.options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            input.appendChild(opt);
        });
    } else {
        input = document.createElement('input');
        input.type = field.type;
        input.style.width = '200px';
    }

    input.addEventListener('input', saveInputs);
    inputs[field.key] = input;
    fieldContainer.appendChild(input);
    mainContainer.appendChild(fieldContainer);
});

// Sort Section
const sortContainer = document.createElement('div');
sortContainer.style.display = 'flex';
sortContainer.style.alignItems = 'center';
sortContainer.style.gap = '10px';
sortContainer.style.marginTop = '20px';

const sortLabel = document.createElement('label');
sortLabel.textContent = 'Sort:';
sortLabel.style.fontWeight = 'bold';
sortContainer.appendChild(sortLabel);

const sortFieldSelect = document.createElement('select');
['Name', 'Rarity'].forEach(option => {
    const opt = document.createElement('option');
    opt.value = option.toLowerCase();
    opt.textContent = option;
    sortFieldSelect.appendChild(opt);
});
sortFieldSelect.addEventListener('change', saveInputs);
sortContainer.appendChild(sortFieldSelect);

const sortOrderSelect = document.createElement('select');
['Ascending', 'Descending'].forEach(order => {
    const opt = document.createElement('option');
    opt.value = order.toLowerCase();
    opt.textContent = order;
    sortOrderSelect.appendChild(opt);
});
sortOrderSelect.addEventListener('change', saveInputs);
sortContainer.appendChild(sortOrderSelect);

mainContainer.appendChild(sortContainer);

const folderPath = "Fallout-RPG/Items/Consumables/Chems";
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
                    name: statblock["chem name"] || file.name,
                    rarity: parseInt(statblock["item rarity"]?.match(/\d+/)?.[0] || "0", 10),
                    cost: parseInt(statblock["cost"]?.match(/\d+/)?.[0] || "0", 10)
                };
            }
            return null;
        })
);

pages = pages.filter(Boolean);

// Add Button
const button = document.createElement('button');
button.textContent = "Apply Filters";
button.style.marginTop = '20px';
button.style.padding = '10px 20px';
button.style.backgroundColor = '#4CAF50';
button.style.color = '#fff';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';
mainContainer.appendChild(button);

// Results Container
const resultsContainer = document.createElement('div');
resultsContainer.style.marginTop = '20px';
mainContainer.appendChild(resultsContainer);

const createTableHeader = (text, align = 'center') => {
    const th = document.createElement('th');
    th.textContent = text;
    th.style.border = '1px solid #ccc';
    th.style.padding = '8px';
    th.style.textAlign = align;
    return th;
};

// Button Click Event - Apply Filters
button.addEventListener('click', () => {
    resultsContainer.innerHTML = '';
    
    let filteredPages = [...pages];
    const minRarity = Number(inputs['minRarity'].value) || 0;
    const maxRarity = Number(inputs['maxRarity'].value) || 10;
    const maxItems = Number(inputs['maxItems'].value) || 1000;
    const randomizeSelection = inputs['randomizeSelection'].value === 'true';
    const includeFolders = inputs['includeFolders'].value.split(',').map(folder => folder.trim()).filter(Boolean);
    const excludeFolders = inputs['excludeFolders'].value.split(',').map(folder => folder.trim()).filter(Boolean);

    if (includeFolders.length > 0) {
        filteredPages = filteredPages.filter(p => includeFolders.some(folder => p.file.path.split('/').includes(folder)));
    }

    if (excludeFolders.length > 0) {
        filteredPages = filteredPages.filter(p => !excludeFolders.some(folder => p.file.path.split('/').includes(folder)));
    }

    filteredPages = filteredPages.filter(p => {
        const rarity = p.rarity || 0;
        return rarity >= minRarity && rarity <= maxRarity;
    });

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

    if (filteredPages.length === 0) {
        resultsContainer.textContent = "No chems match the selected filters.";
        return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const headerRow = document.createElement('tr');
    headerRow.appendChild(createTableHeader('#'));
    headerRow.appendChild(createTableHeader('Name', 'left'));
    headerRow.appendChild(createTableHeader('Cost'));
    headerRow.appendChild(createTableHeader('Rarity'));
    table.appendChild(headerRow);

    filteredPages.slice(0, maxItems).forEach((p, index) => {
        const row = document.createElement('tr');

        const numberCell = document.createElement('td');
        numberCell.textContent = index + 1;
        numberCell.style.border = '1px solid #ccc';
        numberCell.style.padding = '8px';
        numberCell.style.textAlign = 'center';
        row.appendChild(numberCell);

        const nameCell = document.createElement('td');
        const link = document.createElement('a');
        link.classList.add('internal-link');
        link.href = p.file.path;
        link.textContent = p.name || p.file.name;
        link.onclick = (e) => {
            e.preventDefault();
            app.workspace.openLinkText(p.file.name, p.file.path, false);
        };
        nameCell.appendChild(link);
        nameCell.style.border = '1px solid #ccc';
        nameCell.style.padding = '8px';
        row.appendChild(nameCell);

        [(p.cost ?? '-'), (p.rarity ?? '-')].forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            td.style.border = '1px solid #ccc';
            td.style.padding = '8px';
            td.style.textAlign = 'center';
            row.appendChild(td);
        });

        table.appendChild(row);
    });

    resultsContainer.appendChild(table);
});

// Append to container
if (typeof container !== 'undefined') {
    container.appendChild(mainContainer);
} else {
    document.body.appendChild(mainContainer);
}

// Load saved inputs
loadInputs();

```