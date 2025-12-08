```js-engine
const ARMOR_STORAGE_KEY = "fallout_armor_data";

function matchesSection(locations, section) {
    const mapping = {
        "Arms": ["Left Arm", "Right Arm"],
        "Arm": ["Left Arm", "Right Arm"],
        "Legs": ["Left Leg", "Right Leg"],
        "Leg": ["Left Leg", "Right Leg"],
        "Torso": ["Torso"],
        "Main Body": ["Torso"],
        "Head": ["Head"],
        "Optics": ["Head"],
        "Thruster": ["Head", "Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Outfit"],
        "All": ["Head", "Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Outfit"],
        "Arms, Legs, Torso": ["Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Outfit"],
        "Head, Arms, Legs, Torso": ["Head","Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Outfit"]
         // ✅ Fully controlled mapping
    };

    // ✅ Ensure `locations` is a string and compare it exactly
    if (typeof locations !== "string") return false;

    // ✅ Check if `locations` is an exact key in mapping
    if (mapping.hasOwnProperty(locations.trim())) {
        return mapping[locations.trim()].includes(section);
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
    let armorFiles = allFiles.filter(file => 
    ARMOR_FOLDERS.some(folder => file.path.startsWith(folder) || file.path === folder)
);


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
        stats.locations = extractStat(/locations:\s*"([^"]+)"/i);



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
    
}

function loadArmorData(section) {
    let storageKey = `${ARMOR_STORAGE_KEY}_${section}`;
    let storedData = localStorage.getItem(storageKey);
    return storedData ? JSON.parse(storedData) : { physdr: "", raddr: "", endr: "", hp: "", apparel: "" };
}

function updateFields(section, inputs, apparelInput) {
    let storedData = loadArmorData(section);
   

    ['physdr', 'raddr', 'endr', 'hp'].forEach(key => {
        if (inputs[key]) {
            inputs[key].value = storedData[key] || "";
        }
    });

    if (apparelInput) {
        apparelInput.value = storedData.apparel ? storedData.apparel : "";

    }
}

function renderArmorSection(section) {
    let sectionContainer = document.createElement('div');
    sectionContainer.style.backgroundColor = '#325886';
    sectionContainer.style.border = '2px solid #e0c9a0';
    sectionContainer.style.borderRadius = '8px';
    sectionContainer.style.padding = '10px';
    sectionContainer.style.maxWidth = '400px'
    sectionContainer.style.alignItems = 'left'
    sectionContainer.style.display = 'flex'
    sectionContainer.style.flexDirection = 'column'

    let title = document.createElement('h2');
    title.textContent = section;
    title.style.color = '#EFDD6F';
    title.style.textAlign = 'left';
    title.style.marginTop = '1px';
    title.style.marginBottom = '30px';
     
	
    sectionContainer.appendChild(title);

    let searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = `Search ${section} Armor...`;
    searchInput.style.width = '100%';
    searchInput.style.marginBottom = '10px';
    searchInput.style.backgroundColor = '#fde4c9'
    sectionContainer.appendChild(searchInput);

    let searchResults = document.createElement('div');
    searchResults.style.display = 'none';
    searchResults.style.border = '1px solid #ccc';
    searchResults.style.backgroundColor = '#fde4c9';
    searchResults.style.padding = '5px';
    searchResults.style.color = 'black'
    sectionContainer.appendChild(searchResults);

    let gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    gridContainer.style.gap = '5px';

    let labels = { 'Phys. DR': 'physdr','En. DR': 'endr','Rad. DR': 'raddr', 'HP': 'hp' };
    let inputs = {};

    Object.entries(labels).forEach(([label, key]) => {
        let fieldContainer = document.createElement('div');
        let input = document.createElement('input');
        input.type = 'text';
        input.style.marginBottom = '10px';
        input.style.width = "60%"; // 70% width of the container
        input.style.textAlign = 'center';
        inputs[key] = input; 
       
        fieldContainer.innerHTML = `<strong style="color:#FFC200;">${label}</strong><br>`;
        fieldContainer.appendChild(input);
	    fieldContainer.style.display = 'center';
	    fieldContainer.style.flexDirection = 'column';
	    fieldContainer.style.alignItems = 'center';
	    fieldContainer.style.textAlign = 'center';
        gridContainer.appendChild(fieldContainer);
    });

    sectionContainer.appendChild(gridContainer);

    let apparelLabel = document.createElement('div');
    apparelLabel.innerHTML = '<strong>Apparel Piece:</strong>';
    sectionContainer.appendChild(apparelLabel);

// ✅ Ensure `storedData` is loaded BEFORE use
let storedData = loadArmorData(section);

let apparelContainer = document.createElement('div');
apparelContainer.style.position = "relative"; // Keeps alignment


// ✅ Create the input field (starts hidden)
let apparelInput = document.createElement('input');
apparelInput.type = 'text';
apparelInput.style.width = '100%';
apparelInput.style.border = '1px solid #ccc';
apparelInput.style.display = "none"; // ✅ Starts hidden

// ✅ Create the display div (shown by default)
let apparelDisplay = document.createElement('div');
apparelDisplay.style.cursor = 'text';
apparelDisplay.style.width = '100%';
apparelDisplay.style.padding = '5px';
apparelDisplay.style.border = "1px solid #fbb4577e";
apparelDisplay.style.backgroundColor = "#fae0be60";
apparelDisplay.style.display = "block"; // ✅ Starts visible


// ✅ Function to update display with markdown (No extra brackets)
function updateApparelDisplay() {
    let freshData = loadArmorData(section); // ✅ Always get fresh data
    let apparelValue = freshData.apparel;

    // ✅ Ensure `apparelValue` is always a string
    if (typeof apparelValue !== "string") {
        apparelValue = "";
    }

    // ✅ Update display with markdown link (or default message)
    apparelDisplay.innerHTML = apparelValue.trim() !== ""
        ? apparelValue.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>')
        : "(Click to edit)";

    apparelInput.value = apparelValue; // ✅ Ensure input has correct value
}



// ✅ Clicking the display switches to input mode
apparelDisplay.addEventListener('click', () => {
    apparelDisplay.style.display = "none";
    apparelInput.style.display = "block";
    apparelInput.focus();
});

// ✅ When input loses focus, save and switch to markdown view
apparelInput.addEventListener('blur', () => {
    let freshData = loadArmorData(section); // ✅ Get latest stored data
    freshData.apparel = apparelInput.value.trim(); // ✅ Save new input

    saveArmorData(section, freshData); // ✅ Store new value
    updateApparelDisplay(); // ✅ Refresh display with new value

    // ✅ Only switch to markdown mode if there's a value
    if (freshData.apparel !== "") {
        apparelInput.style.display = "none";
        apparelDisplay.style.display = "block";
    }
});



// ✅ Initialize the display
updateApparelDisplay();

// ✅ Append both elements
apparelContainer.appendChild(apparelInput);
apparelContainer.appendChild(apparelDisplay);
sectionContainer.appendChild(apparelContainer);





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

    // ✅ Ensure it renders as a markdown link
    apparelDisplay.innerHTML = storedData.apparel.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');

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

        // ✅ Update input fields
        inputs.physdr.value = armor.physdr;
        inputs.raddr.value = armor.raddr;
        inputs.endr.value = armor.endr;
        inputs.hp.value = armor.hp;
        apparelInput.value = armor.link;

        // ✅ Update storage
        let newData = {
            physdr: armor.physdr,
            raddr: armor.raddr,
            endr: armor.endr,
            hp: armor.hp,
            apparel: `[[${armor.link}]]`
        };

        saveArmorData(section, newData);

        // ✅ Refresh markdown display immediately
        updateApparelDisplay();

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
    container.style.display = 'flex';
    container.style.flexDirection = 'column'; // Ensures vertical stacking
    container.style.alignItems = 'left'; // Centers content
    container.style.color = '#EFDD6F';

    // ✅ Poison DR field (global)
    const poisonDRContainer = document.createElement('div');
    poisonDRContainer.style.padding = '10px';
    poisonDRContainer.style.border = '2px solid #e0c9a0';
    poisonDRContainer.style.borderRadius = '8px';
    poisonDRContainer.style.backgroundColor = '#325886';
    poisonDRContainer.style.display = 'flex';
    poisonDRContainer.style.flexDirection = 'row';
    poisonDRContainer.style.alignItems = 'center';
    poisonDRContainer.style.marginBottom = '10px'; // ✅ Ensures spacing below
    poisonDRContainer.style.width = "100%";
    poisonDRContainer.style.maxWidth = "400px";
    poisonDRContainer.style.maxHeight = "50px";
    poisonDRContainer.style.gap = "10px";

    const poisonDRLabel = document.createElement('strong');
    poisonDRLabel.textContent = 'Poison DR';
    poisonDRLabel.style.color = '#EFDD6F';

    const poisonDRInput = document.createElement('input');
    poisonDRInput.type = 'text';
    poisonDRInput.style.width = '50%';
    poisonDRInput.style.textAlign = 'center';
    poisonDRInput.style.backgroundColor = '#fae0be60';
    poisonDRInput.style.border = '1px solid #fbb4577e';

    // ✅ Load stored Poison DR value
    const POISON_DR_KEY = 'fallout_poison_dr';
    poisonDRInput.value = localStorage.getItem(POISON_DR_KEY) || '';

    // ✅ Save value when edited
    poisonDRInput.addEventListener('input', () => {
        localStorage.setItem(POISON_DR_KEY, poisonDRInput.value);
    });

    poisonDRContainer.appendChild(poisonDRLabel);
    poisonDRContainer.appendChild(poisonDRInput);

    // ✅ Armor sections container (keeps them separate from Poison DR)
    const armorSectionsContainer = document.createElement('div');
    armorSectionsContainer.style.display = 'grid';
    armorSectionsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
    armorSectionsContainer.style.gap = '10px';
    armorSectionsContainer.style.width = '100%';

    // ✅ Append Poison DR first
    container.appendChild(poisonDRContainer);

    // ✅ Append all armor sections inside armorSectionsContainer
    sections.forEach(section => {
        armorSectionsContainer.appendChild(renderArmorSection(section));
    });

    // ✅ Append the armor sections **after** Poison DR container
    container.appendChild(armorSectionsContainer);

    return container;
}

return renderArmorSections();



```