```js-engine
const ARMOR_STORAGE_KEY = "fallout_armor_data";

async function fetchArmorData(section) {
    const ARMOR_FOLDERS = [
        "Fallout RPG/Items/Apparel/Armor",
        "Fallout RPG/Items/Apparel/Clothing",
        "Fallout RPG/Items/Apparel/Headgear",
        "Fallout RPG/Items/Apparel/Outfits",
        "Fallout RPG/Items/Apparel/Power Armor",
        "Fallout RPG/Items/Apparel/Robot Armor"
    ];
    let allFiles = await app.vault.getFiles();
    let armorFiles = allFiles.filter(file => ARMOR_FOLDERS.some(folder => file.path.startsWith(folder)));
    
    let armors = await Promise.all(armorFiles.map(async (file) => {
        let content = await app.vault.read(file);
        let stats = {
            link: `[[${file.basename}]]`, physDR: "N/A", radDR: "N/A", enDR: "N/A", hp: "N/A", locations: "Unknown"
        };
        
        let statblockMatch = content.match(/```statblock([\s\S]*?)```/);
        if (!statblockMatch) return stats;
        let statblockContent = statblockMatch[1].trim();

        const patterns = {
            physDR: /- name: \"Physical\"\s+desc:\s*\"(.*?)\"/i,
            radDR: /- name: \"Radiation\"\s+desc:\s*\"(.*?)\"/i,
            enDR: /- name: \"Energy\"\s+desc:\s*\"(.*?)\"/i,
            hp: /hp:\s*(.+)/i,
            locations: /locations:\s*\"(.*?)\"/i,
        };
        
        for (const [key, pattern] of Object.entries(patterns)) {
            let result = statblockContent.match(pattern);
            if (result) stats[key] = result[1].trim();
        }
        return stats;
    }));
    
    return armors.filter(a => matchesSection(a.locations, section));
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
                searchInput.value = armor.link;
                searchResults.style.display = 'none';
            });
            searchResults.appendChild(div);
        });
    });
    
    let gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    gridContainer.style.gap = '5px';
    
    let labels = ['Phys. DR', 'Rad. DR', 'En. DR', 'HP'];
    labels.forEach(label => {
        let fieldContainer = document.createElement('div');
        fieldContainer.innerHTML = `<strong>${label}</strong><br><input type='text'/>`;
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

    let removeIcon = document.createElement('span');
    removeIcon.textContent = '🗑️';
    removeIcon.style.cursor = 'pointer';
    removeIcon.onclick = () => {
        apparelInput.value = '';
    };
    sectionContainer.appendChild(removeIcon);

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