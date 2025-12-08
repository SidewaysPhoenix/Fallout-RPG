```js-engine
const STORAGE_KEY = "fallout_perk_table";
const SEARCH_FOLDERS = [
    "Fallout RPG/Perks/Core Rulebook",
    "Fallout RPG/Perks/Settlers",
    "Fallout RPG/Perks/Wanderers",
    "Fallout RPG/Perks/Weapons",
    "Fallout RPG/Perks/Book Perks"
];
const DESCRIPTION_LIMIT = 250; // Character limit for descriptions

async function fetchPerkData() {
    let allFiles = await app.vault.getFiles();
    let perkFiles = allFiles.filter(file => SEARCH_FOLDERS.some(folder => file.path.startsWith(folder)));

    let perkItems = await Promise.all(perkFiles.map(async (file) => {
        let content = await app.vault.read(file);

        let stats = {
            name: `[[${file.basename}]]`,
            qty: "1", // Default quantity
            description: "No description available"
        };

        // Extract Ranks
        let rankMatch = content.match(/Ranks:\s*(\d+)/);
        let rankValue = rankMatch ? rankMatch[1] : "1"; // Default rank to 1

        // Extract Description (everything after Ranks:)
        let descStart = content.indexOf("Ranks:");
        if (descStart !== -1) {
            let descContent = content.substring(descStart).split("\n").slice(1).join(" ").trim();
            stats.description = descContent.length > DESCRIPTION_LIMIT 
                ? descContent.substring(0, DESCRIPTION_LIMIT) + "..."
                : descContent;
        }

        return stats;
    }));

    return perkItems.filter(g => g);
}


function savePerkTableState(perk) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(perk));
}

function loadPerkTableState() {
    let data = localStorage.getItem(STORAGE_KEY);
    let perkList = data ? JSON.parse(data) : [];

    // Ensure all perk objects have a qty field
    perkList.forEach(perk => {
        if (!perk.hasOwnProperty('qty')) {
            perk.qty = "1"; // Default quantity
        }
    });

    return perkList;
}


function addPerkToTable(perk, tbody, perkList) {
    let row = document.createElement('tr');

    ["name", "qty", "description"].forEach((key, index) => {
        const td = document.createElement('td');
        td.style.border = '1px solid #ccc';
        td.style.padding = '8px';

        let value = perk[key] || (key === "qty" ? "1" : ""); // Ensure default qty

        let editIcon = document.createElement('span');
        editIcon.textContent = '✎';
        editIcon.style.cursor = 'pointer';
        editIcon.style.color = '#d7d7d782';
        editIcon.style.marginRight = '5px';

        function enableEditing() {
            let perkIndex = perkList.findIndex(g => g.name === perk.name);
            let currentValue = perkList[perkIndex][key]; // Fetch latest value

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

                perkList[perkIndex][key] = newValue; // Update perkList
                savePerkTableState(perkList);

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
        let index = perkList.findIndex(g => g.name === perk.name);
        if (index !== -1) perkList.splice(index, 1);
        savePerkTableState(perkList);
    };

    removeTd.appendChild(removeIcon);
    row.appendChild(removeTd);
    tbody.appendChild(row);
}


async function renderPerkTableUI() {
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.border = '1px solid #e0c9a0';
    container.style.backgroundColor = '#325886';
    container.style.overflowX = 'auto';
    container.style.width = '100%';

    const title = document.createElement('h2');
    title.textContent = "Perks and Traits";
    title.style.color = "#efdd6f";
    container.appendChild(title);
    
        // Search Input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for perk...';
    searchInput.style.marginBottom = '10px';
    searchInput.style.padding = '5px';
    searchInput.style.width = '100%';
    searchInput.style.backgroundColor = '#fde4c9'
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

        let allPerk = await fetchPerkData();
        let matches = allPerk.filter(g => g.name.toLowerCase().includes(query));

        matches.forEach(perk => {
            let div = document.createElement('div');
            div.textContent = perk.name.replace(/\[\[(.*?)\]\]/g, '$1');
            div.style.padding = '5px';
            div.style.cursor = 'pointer';
            div.style.borderBottom = '1px solid #ccc';

            div.addEventListener('click', () => {
                addPerkToTable(perk, tbody, perkList);
                perkList.push(perk);
                savePerkTableState(perkList);
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
    ["Name", "Rank", "Description", "Remove"].forEach(headerText => {
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

    let perkList = loadPerkTableState();
    perkList.forEach(perk => addPerkToTable(perk, tbody, perkList));

    return container;
}

return renderPerkTableUI();

```