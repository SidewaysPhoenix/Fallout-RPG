```js-engine
const vault = app.vault;
const dv = app.plugins.plugins.dataview?.api;

if (!dv) {
    throw new Error("Dataview plugin is not available. Please ensure Dataview is enabled.");
}

const inputs = {};
const compSelectors = {};
const attributes = ['LEVEL', 'STR', 'PER', 'END', 'CHA', 'INT', 'AGI', 'LCK'];
const comparators = ['<=', '=', '>='];
const STORAGE_KEY = 'fallout_perks_filter_inputs';

const folders = [
    "Fallout RPG/Perks/Core Rulebook/",
    "Fallout RPG/Perks/Settlers/",
    "Fallout RPG/Perks/Wanderers/"
];

const saveInputs = () => {
    const data = Object.fromEntries(
        Object.keys(inputs).map(key => [key, inputs[key]?.value || null])
    );
    Object.entries(compSelectors).forEach(([key, selector]) => data[`comp_${key}`] = selector?.value || null);
    data.sortField = sortFieldSelect.value;
    data.sortOrder = sortOrderSelect.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadInputs = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    Object.entries(inputs).forEach(([key, input]) => input.value = data[key] ?? "");
    Object.entries(compSelectors).forEach(([key, selector]) => selector.value = data[`comp_${key}`] ?? "=");
    if (data.sortField) sortFieldSelect.value = data.sortField;
    if (data.sortOrder) sortOrderSelect.value = data.sortOrder;
};

const compare = (val, op, num) => {
    if (val == null || val === "") return false;
    switch (op) {
        case "<=": return val <= num;
        case "=": return val == num;
        case ">=": return val >= num;
        default: return false;
    }
};

const parseNumericLevel = (value) => {
    const numericPart = value.match(/\d+/);
    return numericPart ? parseInt(numericPart[0], 10) : 0;
};

const readPages = async () => {
    const files = vault.getFiles().filter(file => folders.some(folder => file.path.startsWith(folder)));
    const pages = await Promise.all(
        files.map(async file => {
            const page = dv.page(file.path);
            if (!page) return null;

            const content = await vault.cachedRead(file);
            const levelMatch = content.match(/Level\s*::\s*(.*)/i);
            const levelValue = levelMatch && levelMatch[1].trim() !== "" && !levelMatch[1].trim().startsWith('STR') ? levelMatch[1].trim() : "-";

            return {
                ...page,
                file,
                LEVEL: levelValue,
                NUMERIC_LEVEL: parseNumericLevel(levelValue),
                PERK_NAME: file.name.replace(/\.md$/i, '').toLowerCase()
            };
        })
    );
    return pages.filter(Boolean);
};

const applyFilters = async () => {
    const pages = await readPages();
    let filteredPages = [...pages];

    attributes.forEach(attr => {
        const value = inputs[attr]?.value?.trim();
        const comparator = compSelectors[attr]?.value;

        if (value) {
            filteredPages = filteredPages.filter(p => {
                const fieldValue = String(p[attr] ?? "").trim();

                if (attr === "LEVEL") {
                    const numericLevel = parseNumericLevel(fieldValue);
                    return compare(numericLevel, comparator, Number(value));
                } else {
                    return compare(Number(fieldValue || 0), comparator, Number(value));
                }
            });
        }
    });

    const sortField = sortFieldSelect.value;
    const sortOrder = sortOrderSelect.value;

    filteredPages.sort((a, b) => {
        let valA, valB;
        if (sortField === 'Level') {
            valA = a.NUMERIC_LEVEL;
            valB = b.NUMERIC_LEVEL;
            return sortOrder === "Ascending" ? valA - valB : valB - valA;
        } else {
            valA = a.PERK_NAME;
            valB = b.PERK_NAME;
            return sortOrder === "Ascending" ? valA.localeCompare(valB, undefined, { sensitivity: 'base' }) : valB.localeCompare(valA, undefined, { sensitivity: 'base' });
        }
    });

    displayResults(filteredPages);
    saveInputs();
};

const mainContainer = document.createElement('div');
mainContainer.style.padding = '20px';
mainContainer.style.border = '1px solid #e0c9a0';
mainContainer.style.borderRadius = '8px';
mainContainer.style.backgroundColor = '#FFF7E6';
mainContainer.style.overflowX = 'auto';
mainContainer.style.width = '100%';

const gridContainer = document.createElement('div');
gridContainer.style.display = 'grid';
gridContainer.style.gridTemplateColumns = '80px 60px 120px';
gridContainer.style.gap = '8px';

const createField = (labelText, key) => {
    const label = document.createElement('label');
    label.textContent = labelText;
    
    const select = document.createElement('select');
    comparators.forEach(comp => {
        const option = document.createElement('option');
        option.value = comp;
        option.textContent = comp;
        select.appendChild(option);
    });
     select.style.padding = '6px';
    select.style.border = '1px solid #e0c9a0';
    select.style.borderRadius = '5px';
    select.style.backgroundColor = '#fde4c9';
    select.addEventListener('change', saveInputs);
    compSelectors[key] = select;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = labelText;
    input.style.width = '100px';
    input.style.padding = '6px';
    input.style.border = '1px solid #e0c9a0';
    input.style.borderRadius = '5px';
    input.style.backgroundColor = '#fde4c9';
    input.addEventListener('input', saveInputs);
    inputs[key] = input;

    gridContainer.appendChild(label);
    gridContainer.appendChild(select);
    gridContainer.appendChild(input);
};

attributes.forEach(attr => createField(attr, attr));
mainContainer.appendChild(gridContainer);

const sortContainer = document.createElement('div');
sortContainer.style.marginTop = '12px';
sortContainer.style.display = 'flex';
sortContainer.style.alignItems = 'center';
sortContainer.style.gap = '8px';

const sortLabel = document.createElement('label');
sortLabel.textContent = 'Sort:';
sortLabel.style.fontWeight = 'bold';
sortContainer.appendChild(sortLabel);

const sortFieldSelect = document.createElement('select');
['Perk', 'Level'].forEach(field => {
    const option = document.createElement('option');
    option.value = field;
    option.textContent = field;
    sortFieldSelect.appendChild(option);
});
sortFieldSelect.addEventListener('change', saveInputs);
sortFieldSelect.style.padding = '6px';
sortFieldSelect.style.border = '1px solid #e0c9a0';
sortFieldSelect.style.borderRadius = '5px';
sortFieldSelect.style.backgroundColor = '#fde4c9';
sortFieldSelect.style.width = '80px';

const sortOrderSelect = document.createElement('select');
['Ascending', 'Descending'].forEach(order => {
    const option = document.createElement('option');
    option.value = order;
    option.textContent = order;
    sortOrderSelect.appendChild(option);
});
sortOrderSelect.addEventListener('change', saveInputs);
sortOrderSelect.style.padding = '6px';
sortOrderSelect.style.border = '1px solid #e0c9a0';
sortOrderSelect.style.borderRadius = '5px';
sortOrderSelect.style.backgroundColor = '#fde4c9';
sortOrderSelect.style.width = '100px';

sortContainer.appendChild(sortFieldSelect);
sortContainer.appendChild(sortOrderSelect);
mainContainer.appendChild(sortContainer);

const applyButton = document.createElement('button');
applyButton.textContent = 'Apply Filters';
applyButton.style.padding = '10px';
applyButton.style.marginTop = '20px';
applyButton.style.backgroundColor = '#4CAF50';
applyButton.style.color = 'white';
applyButton.style.border = 'none';
applyButton.style.borderRadius = '5px';
applyButton.style.cursor = 'pointer';
applyButton.style.width = '100%';
applyButton.addEventListener('click', applyFilters);
mainContainer.appendChild(applyButton);

const resultsContainer = document.createElement('div');
resultsContainer.style.marginTop = '12px';
resultsContainer.style.overflowX = 'auto';
resultsContainer.style.width = '100%';
mainContainer.appendChild(resultsContainer);

const displayResults = (filteredPages) => {
    resultsContainer.innerHTML = "";
    if (!filteredPages.length) {
        resultsContainer.textContent = "No perks match the selected filters.";
        return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.tableLayout = 'auto';

    const headerRow = document.createElement('tr');
    ['Perk', ...attributes].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.border = '1px solid #ccc';
        th.style.padding = '8px';
        th.style.textAlign = header === 'Perk' ? 'left' : 'center';
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    filteredPages.forEach(p => {
        const row = document.createElement('tr');

        const fileCell = document.createElement('td');
        const link = document.createElement('a');
        link.classList.add('internal-link');
        link.href = p.file.path;
        link.textContent = p.file.name.replace(/\.md$/i, '');
        link.onclick = (e) => {
            e.preventDefault();
            app.workspace.openLinkText(p.file.name, p.file.path, false);
        };
        fileCell.appendChild(link);
        fileCell.style.border = '1px solid #ccc';
        fileCell.style.padding = '8px';
        row.appendChild(fileCell);

        attributes.forEach(attr => {
            const td = document.createElement('td');
            td.textContent = p[attr] !== undefined && p[attr] !== null && p[attr] !== "" ? String(p[attr]).trim() : '-';
            td.style.border = '1px solid #ccc';
            td.style.padding = '8px';
            td.style.textAlign = 'center';
            row.appendChild(td);
        });

        table.appendChild(row);
    });

    resultsContainer.appendChild(table);
};

loadInputs();
applyFilters();
return mainContainer;


```