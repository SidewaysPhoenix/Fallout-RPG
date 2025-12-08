```js-engine
const ARMOR_STORAGE_KEY = "fallout_armor_data";

function matchesSection(locations, section) {
    const mapping = {
        "Arms": ["Left Arm", "Right Arm"],
        "Legs": ["Left Leg", "Right Leg"],
        "Torso": ["Torso"],
        "Main Body": ["Torso"],
        "Head": ["Head"],
        "Optics": ["Head"],
        "Thruster": ["Head", "Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Outfit"],
        "All": ["Head", "Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Outfit"]
    };
    
    for (let key in mapping) {
        if (locations.includes(key) && mapping[key].includes(section)) {
            return true;
        }
    }
    return false;
}


async function fetchArmorData(section) {
    const ARMOR_FOLDERS = [
        "Fallout-RPG/Items/Apparel/Armor",
        "Fallout-RPG/Items/Apparel/Clothing",
        "Fallout-RPG/Items/Apparel/Headgear",
        "Fallout-RPG/Items/Apparel/Outfits",
        "Fallout-RPG/Items/Apparel/Power Armor",
        "Fallout-RPG/Items/Apparel/Robot Armor"
    ];
    let allFiles = await app.vault.getFiles();
    let armorFiles = allFiles.filter(file => ARMOR_FOLDERS.some(folder => file.path.startsWith(folder)));

    let armors = await Promise.all(armorFiles.map(async (file) => {
        let content = await app.vault.read(file);
        let stats = {
            link: file.basename, physdr: "0", raddr: "0", endr: "0", hp: "0", locations: "Unknown"
        };

        let statblockMatch = content.match(/```statblock([\s\S]*?)```/);
        if (!statblockMatch) return stats;

        let statblockContent = statblockMatch[1].trim();

        function extractStat(pattern) {
            let match = statblockContent.match(pattern);
            return match ? match[1].trim() : "0";
        }

        stats.hp = extractStat(/hp:\s*(\d+)/i);
        stats.locations = extractStat(/locations:\s*"([\w\s\-]+)"/i);

        let lines = statblockContent.split("\n");
        let insideDmgResist = false;
        let currentDRType = "";

        for (let line of lines) {
            line = line.trim();

            if (line.startsWith("dmg resistances:")) {
                insideDmgResist = true;
                continue;
            }

            if (insideDmgResist) {
                let nameMatch = line.match(/- name:\s*"?(Physical|Energy|Radiation)"?/i);
                if (nameMatch) {
                    currentDRType = nameMatch[1];
                    continue;
                }

                let descMatch = line.match(/desc:\s*"?(.*?)"?$/i);
                if (descMatch && currentDRType) {
                    let value = descMatch[1].trim() || "0";

                    if (currentDRType === "Physical") stats.physdr = value;
                    if (currentDRType === "Energy") stats.endr = value;
                    if (currentDRType === "Radiation") stats.raddr = value;

                    currentDRType = "";
                }
            }
        }

        return stats;
    }));

    return armors.filter(a => matchesSection(a.locations, section));
}

function saveArmorData(section, newData) {
    let storageKey = `${ARMOR_STORAGE_KEY}_${section}`;
    localStorage.setItem(storageKey, JSON.stringify(newData));
    console.log(`✅ Saved data for ${section}:`, newData);
}

function loadArmorData(section) {
    let storageKey = `${ARMOR_STORAGE_KEY}_${section}`;
    let storedData = localStorage.getItem(storageKey);
    return storedData ? JSON.parse(storedData) : { physdr: "", raddr: "", endr: "", hp: "", apparel: "" };
}

function updateFields(section, inputs, apparelInput) {
    let storedData = loadArmorData(section);
    console.log(`🔄 Applying stored data to UI for ${section}:`, storedData);

    ['physdr', 'raddr', 'endr', 'hp'].forEach(key => {
        if (inputs[key]) {
            inputs[key].value = storedData[key] || "";
        }
    });

    if (apparelInput) {
        apparelInput.value = storedData.apparel || "";
    }
}

function renderArmorSection(section) {
    let sectionContainer = document.createElement('div');
    sectionContainer.style.backgroundColor = '#325886';
    sectionContainer.style.border = '2px solid #e0c9a0';
    sectionContainer.style.borderRadius = '8px';
    sectionContainer.style.padding = '10px';

    let title = document.createElement('h2');
    title.textContent = section;
    title.style.color = '#d8ca0a';
    title.style.textAlign = 'center';
    sectionContainer.appendChild(title);

    let searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = `Search ${section} Armor...`;
    searchInput.style.width = '100%';
    searchInput.style.marginBottom = '10px';
    sectionContainer.appendChild(searchInput);

    let searchResults = document.createElement('div');
    searchResults.style.display = 'none';
    searchResults.style.border = '1px solid #ccc';
    searchResults.style.backgroundColor = '#fde4c9';
    searchResults.style.padding = '5px';
    sectionContainer.appendChild(searchResults);

    let gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    gridContainer.style.gap = '5px';

    let labels = { 'Phys. DR': 'physdr', 'Rad. DR': 'raddr', 'En. DR': 'endr', 'HP': 'hp' };
    let inputs = {};

    Object.entries(labels).forEach(([label, key]) => {
        let fieldContainer = document.createElement('div');
        let input = document.createElement('input');
        input.type = 'text';
        inputs[key] = input;

        fieldContainer.innerHTML = `<strong>${label}</strong><br>`;
        fieldContainer.appendChild(input);
        gridContainer.appendChild(fieldContainer);
    });

    sectionContainer.appendChild(gridContainer);

    let apparelLabel = document.createElement('div');
    apparelLabel.innerHTML = '<strong>Apparel Piece:</strong>';
    sectionContainer.appendChild(apparelLabel);

    let apparelInput = document.createElement('input');
    apparelInput.type = 'text';
    apparelInput.style.width = '100%';
    sectionContainer.appendChild(apparelInput);

    setTimeout(() => updateFields(section, inputs, apparelInput), 200);

    Object.entries(labels).forEach(([label, key]) => {
        inputs[key].addEventListener('input', () => {
            let storedData = loadArmorData(section);
            storedData[key] = inputs[key].value;
            saveArmorData(section, storedData);
        });
    });

    apparelInput.addEventListener('input', () => {
        let storedData = loadArmorData(section);
        storedData.apparel = apparelInput.value;
        saveArmorData(section, storedData);
    });

    searchInput.addEventListener('input', async () => {
        let query = searchInput.value.toLowerCase();
        searchResults.innerHTML = '';
        searchResults.style.display = query ? 'block' : 'none';

        let matchingArmor = await fetchArmorData(section);
        let filteredArmor = matchingArmor.filter(a => a.link.toLowerCase().includes(query));

        filteredArmor.forEach(armor => {
            let div = document.createElement('div');
            div.textContent = armor.link;
            div.style.padding = '5px';
            div.style.cursor = 'pointer';
            div.addEventListener('click', () => {
                searchInput.value = '';

                inputs.physdr.value = armor.physdr;
                inputs.raddr.value = armor.raddr;
                inputs.endr.value = armor.endr;
                inputs.hp.value = armor.hp;
                apparelInput.value = `[[${armor.link}]]`;

                let newData = {
                    physdr: armor.physdr,
                    raddr: armor.raddr,
                    endr: armor.endr,
                    hp: armor.hp,
                    apparel: `[[${armor.link}]]`
                };
                saveArmorData(section, newData);

                searchResults.style.display = 'none';
            });
            searchResults.appendChild(div);
        });
    });

    return sectionContainer;
}

async function renderArmorSections() {
    const sections = ["Head", "Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Outfit"];
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
    container.style.gap = '15px';

    sections.forEach(section => {
        container.appendChild(renderArmorSection(section));
    });

    return container;
}

return renderArmorSections();


```