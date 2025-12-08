```js-engine
const STORAGE_KEY = "fallout_ammo_table";
const SEARCH_FOLDERS = [
    "Fallout-RPG/Items/Ammo"
];
const DESCRIPTION_LIMIT = 100; // Character limit for descriptions

let cachedAmmoData = null; // Global cache for ammo data

async function fetchAmmoData() {
    if (cachedAmmoData) return cachedAmmoData; // ✅ Use cache if available

    let allFiles = await app.vault.getFiles();
    let ammoFiles = allFiles.filter(file => SEARCH_FOLDERS.some(folder => file.path.startsWith(folder)));

    let ammoItems = await Promise.all(ammoFiles.map(async (file) => {
        let content = await app.vault.read(file);

        let stats = {
            name: `[[${file.basename}]]`,
            qty: "1", // Default quantity
            description: "No description available"
        };

        let statblockMatch = content.match(/```statblock([\s\S]*?)```/);
        if (!statblockMatch) return stats;

        let statblockContent = statblockMatch[1].trim();

        let descMatch = statblockContent.match(/(?:description:|desc:)\s*(.+)/i);
        if (descMatch) {
            stats.description = descMatch[1].trim().replace(/\"/g, '');
            if (stats.description.length > DESCRIPTION_LIMIT) {
                stats.description = stats.description.substring(0, DESCRIPTION_LIMIT) + "...";
            }
        }
        return stats;
    }));

    cachedAmmoData = ammoItems.filter(g => g); // ✅ Store results in cache
    return cachedAmmoData;
}

function saveAmmoTableState(ammo) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ammo));
}

function loadAmmoTableState() {
    let data = localStorage.getItem(STORAGE_KEY);
    let ammoList = data ? JSON.parse(data) : [];

    // Ensure all ammo objects have a qty field
    ammoList.forEach(ammo => {
        if (!ammo.hasOwnProperty('qty')) {
            ammo.qty = "1"; // Default quantity
        }
    });

    return ammoList;
}


function addAmmoToTable(ammo, tbody, ammoList) {
    let row = document.createElement('tr');

    ["name", "qty", "description"].forEach((key, index) => {
        const td = document.createElement('td');
        td.style.border = '1px solid #ccc';
        td.style.padding = '8px';

        let value = ammo[key] || (key === "qty" ? "1" : ""); // Ensure default qty

        let editIcon = document.createElement('span');
        editIcon.textContent = '✎';
        editIcon.style.cursor = 'pointer';
        editIcon.style.color = '#d7d7d782';
        editIcon.style.marginRight = '5px';

        function enableEditing() {
            let ammoIndex = ammoList.findIndex(g => g.name === ammo.name);
            let currentValue = ammoList[ammoIndex][key]; // Fetch latest value

            let input = document.createElement('input');
            input.type = key === "qty" ? "number" : "text"; // Numeric input for qty
            input.value = currentValue;
            if (key === "qty") input.min = "1"; // Prevent negative qty

            input.addEventListener('blur', () => {
                let newValue = input.value;
                if (key === "description" && newValue.length > DESCRIPTION_LIMIT) {
                    newValue = newValue.substring(0, DESCRIPTION_LIMIT) + "...";
                }
                if (key === "qty" && (isNaN(newValue) || newValue < 1)) {
                    newValue = "1"; // Prevent invalid qty
                }

                ammoList[ammoIndex][key] = newValue; // Update ammoList
                saveAmmoTableState(ammoList);

                // Clear the cell and re-add the edit icon and updated text
                td.innerHTML = '';
                td.appendChild(editIcon);
                let displayText = document.createElement('span');
                displayText.innerHTML = newValue.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
                displayText.style.cursor = 'pointer';
                displayText.onclick = enableEditing;
                td.appendChild(displayText);
            });

            td.innerHTML = '';
            td.appendChild(input);
            input.focus();
        }

        editIcon.onclick = enableEditing;

        let displayText = document.createElement('span');
        displayText.innerHTML = value.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
        displayText.style.cursor = 'pointer';
        displayText.onclick = enableEditing;

        td.appendChild(editIcon);
        td.appendChild(displayText);
        row.appendChild(td);
    });

    let removeTd = document.createElement('td');
    removeTd.style.border = '1px solid #ccc';
    removeTd.style.padding = '8px';
    removeTd.style.textAlign = 'center';

    let removeIcon = document.createElement('span');
    removeIcon.textContent = '🗑️';
    removeIcon.style.cursor = 'pointer';
    removeIcon.onclick = () => {
        tbody.removeChild(row);
        let index = ammoList.findIndex(g => g.name === ammo.name);
        if (index !== -1) ammoList.splice(index, 1);
        saveAmmoTableState(ammoList);
    };

    removeTd.appendChild(removeIcon);
    row.appendChild(removeTd);
    tbody.appendChild(row);
}


async function renderAmmoTableUI() {
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.border = '1px solid #e0c9a0';
    container.style.backgroundColor = '#325886';
    container.style.overflowX = 'auto';
    container.style.width = '100%';

    const title = document.createElement('h2');
    title.textContent = "Ammo";
    title.style.color = "#efdd6f";
    container.appendChild(title);
    
        // Search Input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for ammo...';
    searchInput.style.marginBottom = '10px';
    searchInput.style.padding = '5px';
    searchInput.style.width = '100%';
    searchInput.style.backgroundColor = '#fde4c9';
    container.appendChild(searchInput);

    const searchResults = document.createElement('div');
    searchResults.style.border = '1px solid #ccc';
    searchResults.style.backgroundColor = '#fde4c9';
    searchResults.style.padding = '5px';
    searchResults.style.display = 'none';
    container.appendChild(searchResults);

    // Search Functionality
    searchInput.addEventListener('input', async () => {
        let query = searchInput.value.toLowerCase();
        searchResults.innerHTML = '';
        searchResults.style.display = query ? 'block' : 'none';

        let allAmmo = await fetchAmmoData();
        let matches = allAmmo.filter(g => g.name.toLowerCase().includes(query));

        matches.forEach(ammo => {
            let div = document.createElement('div');
            div.textContent = ammo.name.replace(/\[\[(.*?)\]\]/g, '$1');
            div.style.padding = '5px';
            div.style.cursor = 'pointer';
            div.style.borderBottom = '1px solid #ccc';

            div.addEventListener('click', () => {
                addAmmoToTable(ammo, tbody, ammoList);
                ammoList.push(ammo);
                saveAmmoTableState(ammoList);
                searchInput.value = '';
                searchResults.style.display = 'none';
            });

            searchResults.appendChild(div);
        });
    });


    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ["Name", "Qty", "Description", "Remove"].forEach(headerText => {
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

    let ammoList = loadAmmoTableState();
    ammoList.forEach(ammo => addAmmoToTable(ammo, tbody, ammoList));

    return container;
}

return renderAmmoTableUI();

```