```js-engine
// Fallout RPG Character Sheet - Combined Layout
const builder = engine.markdown.createBuilder();

const STORAGE_KEY = 'falloutRPGCharacterSheet';
const inputs = {};

const saveInputs = () => {
    const data = Object.fromEntries(
        Object.keys(inputs).map(key => {
            if (inputs[key].type === "checkbox") {
                return [key, inputs[key].checked]; // Store checkbox state
            }
            return [key, inputs[key].value || null];
        })
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log("✅ Data saved to localStorage:", data);
};




const loadInputs = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    console.log("🔄 Loading data from localStorage:", data);

    Object.entries(inputs).forEach(([key, input]) => {
        if (input.type === "checkbox") {
            input.checked = data[key] ?? false; // Restore checkbox state
        } else {
            input.value = data[key] ?? "";

            // Preserve manual input status
            if (key === "Maximum HP" || key === "Initiative" || key === "MeleeDamage" || key === "Defense") {
                if (input.value.trim() !== "") {
                    input.dataset.manual = "true"; 
                }
            }
        }
    });

    updateDerivedStats();
    saveInputs(); // 🔹 Save after loading
};





const updateDerivedStats = () => {
    const end = parseInt(inputs['END']?.value) || 0;
    const lck = parseInt(inputs['LCK']?.value) || 0;
    const per = parseInt(inputs['PER']?.value) || 0;
    const agi = parseInt(inputs['AGI']?.value) || 0;
    const str = parseInt(inputs['STR']?.value) || 0;

    console.log("Updating Derived Stats:", { END: end, LCK: lck, PER: per, AGI: agi, STR: str });

    if (!inputs['Maximum HP']?.dataset?.manual) {
        inputs['Maximum HP'].value = end + lck;
    }
    if (!inputs['Initiative']?.dataset?.manual) {
        inputs['Initiative'].value = per + agi;
    }
    if (!inputs['Defense']?.dataset?.manual) { 
        inputs['Defense'].value = agi >= 9 ? 2 : 1;
    } 

    // 🔹 Preserve manually entered Melee Damage
    if (!inputs['MeleeDamage']?.dataset?.manual) { 
        let meleeDamage = "-"; 
        if (str >= 7 && str <= 8) meleeDamage = "+1d6"; 
        else if (str >= 9 && str <= 10) meleeDamage = "+2d6"; 
        else if (str >= 11) meleeDamage = "+3d6"; 

        inputs['MeleeDamage'].value = meleeDamage;
    }

    console.log("Updated Values - Maximum HP:", inputs['Maximum HP']?.value, "Initiative:", inputs['Initiative']?.value, "Melee Damage:", inputs['MeleeDamage']?.value);

    saveInputs(); // 🔹 Save after updating
};







const attachManualOverride = (id) => {
    if (inputs[id]) { 
        inputs[id].addEventListener("input", (e) => {
            if (e.target.value.trim() === "") {
                delete inputs[id].dataset.manual; 
                updateDerivedStats();
            } else {
                inputs[id].dataset.manual = "true"; 
            }
            console.log(`📥 ${id} changed, saving inputs...`);
            saveInputs();
        });
    } else {
        console.warn(`⚠️ Input element with ID "${id}" not found.`);
    }
};












const createCharacterSheet = () => {
    builder.createParagraph(
        `<div style="display:grid; grid-template-columns: 1fr; gap:20px; width:100%; max-width:800px; background-color:#325886; padding:15px; border-radius:8px;">
            
            <!-- Character Info & Derived Stats (Side-by-Side) -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; align-items:start;">
                
                <div style="border:1px solid #ccc; padding:10px; border-radius:8px;">
                    <div style="font-weight:bold; font-size:22px; color:#efdd6f; text-align:center; padding-bottom:5px;">Character Info</div>
                    <div style="display:grid; grid-template-columns: auto 1fr; gap:5px; align-items:center;">
                        <label style="color:#FFC200">Name:</label> <input id="Name" type="text" style="width:100%; background-color:#fde4c9; border-radius:5px; color:black;">
                        <label style="color:#FFC200">Origin:</label> <input id="Origin" type="text" style="width:100%; background-color:#fde4c9; border-radius:5px; color:black;">
                        <label style="color:#FFC200">Level:</label> <input id="Level" type="number" style="width:50px; background-color:#fde4c9; border-radius:5px; color:black;">
                        <label style="color:#FFC200">XP Earned:</label> <input id="XPEarned" type="number" style="width:80px; background-color:#fde4c9; border-radius:5px; color:black;">
                        <label style="color:#FFC200">XP to Next Level:</label> <input id="XPNext" type="number" style="width:80px; background-color:#fde4c9; border-radius:5px; color:black;">
                    </div>
                </div>
                
                <div style="border-left: 2px solid rgba(255,255,255,0.2); padding-left:20px; border:1px solid #ccc; padding:15px; border-radius:8px; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <div>
                        <div style="font-weight:bold; font-size:22px; color:#efdd6f; text-align:center; padding-bottom:5px;">Derived Stats</div>
                        <label style="color:#FFC200">Melee Damage:</label> <input id="MeleeDamage" type="text" style="width:100%; background-color:#fde4c9; border-radius:5px; color:black;">
                        <label style="color:#FFC200">Defense:</label> <input id="Defense" type="number" style="width:100%; background-color:#fde4c9; border-radius:5px; color:black;">
                        <label style="color:#FFC200">Initiative:</label> <input id="Initiative" type="number" style="width:100%; background-color:#fde4c9; border-radius:5px; color:black;">
                    </div>
                    <div style="display:grid; grid-template-rows: auto auto; gap:5px; align-items:center;">
                        <div style="border:1px solid #efdd6f; padding:5px; display:grid; grid-template-columns: auto 1fr; align-items:center;">
                            <label style="color:#FFC200">Luck Points:</label> <input id="LuckPoints" type="number" style="width:100px; background-color:#fde4c9; border-radius:5px; color:black;">
                        </div>
                        <div style="border:1px solid #efdd6f; padding:5px; display:grid; grid-template-columns: auto auto; align-items:center;">
                            <label style="grid-column: 1 / span 2; text-align:center; color:#efdd6f; font-weight:bold;">HP</label>
                            <label style="color:#FFC200">Maximum HP:</label> <input id="Maximum HP" type="text" style="width:80px; background-color:#fde4c9; border-radius:5px; color:black;">
                            <label style="color:#FFC200">Current HP:</label> <input id="CurrentHP" type="text" style="width:80px; background-color:#fde4c9; border-radius:5px; color:black;">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- S.P.E.C.I.A.L. Stats -->
            <div style="grid-column: span 1; border:1px solid #ccc; padding:10px; border-radius:8px; text-align:center;">
                <div style="font-weight:bold; font-size:22px; color:#efdd6f; text-align:center; padding-bottom:5px;">S.P.E.C.I.A.L.</div>
                <div style="display:flex; justify-content:space-around; gap:10px;">
                    ${['STR', 'PER', 'END', 'CHA', 'INT', 'AGI', 'LCK'].map(stat => 
                        `<div style="display:flex; flex-direction:column; align-items:center;">
                            <label style="color:#FFC200; font-weight:bold;">${stat}</label>
                            <input id="${stat}" type="number" style="width:40px; text-align:center; background-color:#fde4c9; color:black; border-radius:5px; border:1px solid #ddd;">
                        </div>`
                    ).join('')}
                </div>
            </div>           
            <!-- Skills Section -->
            <div style="grid-column: span 1; border:1px solid #ccc; padding:15px; border-radius:8px; text-align:left;">
                <div style="font-weight:bold; font-size:22px; color:#efdd6f; text-align:center; padding-bottom:5px;">Skills</div>
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px;">
                    ${[
                        'Athletics', 'Small Guns', 'Energy Weapons',
                        'Melee Weapons', 'Speech', 'Lockpick',
                        'Science', 'Survival', 'Barter',
                        'Big Guns', 'Explosives', 'Medicine',
                        'Pilot', 'Repair', 'Sneak',
                        'Throwing', 'Unarmed'
                    ].map(skill => 
                        `<div style="display:flex; align-items:center; gap:10px; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.2); padding:5px 0; transition:background-color 0.3s;">
                            <label style="flex:2;color:#FFC200; text-align:left;">${skill}</label>
                            <input type="checkbox" id="${skill}Tag" style="width:16px; height:16px; margin:0;">
                            <input id="${skill}" type="number" style="width:50px; background-color:#fde4c9; color:black; text-align:center; border-radius:5px; border:1px solid #ddd;">
                        </div>`
                    ).join('')}
                </div>
            </div>
        </div>`
    );
};



// Build Character Sheet
builder.createHeading(2, 'Fallout RPG Character Sheet');
createCharacterSheet();
// Ensure all inputs exist before attaching listeners




setTimeout(() => {
    document.querySelectorAll("input").forEach(input => {
        const key = input.getAttribute("id");
        inputs[key] = input;

        input.addEventListener("input", () => {
            console.log(`📥 ${key} changed, saving inputs...`);
            saveInputs();
        });

        // 🔹 Ensure checkboxes also trigger `saveInputs()` on change
        if (input.type === "checkbox") {
            input.addEventListener("change", saveInputs);
        }
    });

    console.log("✅ Registered Inputs:", inputs);

    // Ensure SPECIAL stat changes update derived stats dynamically
    ["END", "LCK", "PER", "AGI", "STR"].forEach(stat => {
        if (inputs[stat]) {
            inputs[stat].addEventListener("input", updateDerivedStats);
        }
    });

    // Attach manual override handlers
    ["Maximum HP", "Initiative", "Defense", "MeleeDamage"].forEach(id => attachManualOverride(id));

    // Load saved inputs and initialize derived stats
    loadInputs();
    updateDerivedStats();
}, 100);






// Attach manual override handlers for MaxHP and Initiative
attachManualOverride("Maximum HP");
attachManualOverride("Initiative");
attachManualOverride("Defense");
attachManualOverride("MeleeDamage");



setTimeout(() => loadInputs(), 100);

return builder;

```