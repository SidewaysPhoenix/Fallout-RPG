```js-engine

// Fallout-RPG Character Sheet - Combined Layout 

// 🔹 Ensure skillToSpecial is globally available 
const skillToSpecial = { 
	"Athletics": "STR", "Small Guns": "AGI", "Energy Weapons": "PER", 
	"Melee Weapons": "STR", "Speech": "CHA", "Lockpick": "PER", 
	"Science": "INT", "Survival": "END", "Barter": "CHA", 
	"Big Guns": "END", "Explosives": "PER", "Medicine": "INT", 
	"Pilot": "PER", "Repair": "INT", "Sneak": "AGI", 
	"Throwing": "AGI", "Unarmed": "STR" 
};
 
const builder = engine.markdown.createBuilder();
 
const STORAGE_KEY = 'falloutRPGCharacterSheet'; 
const inputs = {};
 
const saveInputs = () => { 
	const data = Object.fromEntries( 
		Object.keys(inputs).map(key => { 
			if (!inputs[key]) return null; // Avoid errors for missing inputs 
			
			if (inputs[key].type === "checkbox") { 
				return [key, inputs[key].checked]; // Store checkbox state 
			} 
			return [key, inputs[key].value || null]; 
		}).filter(entry => entry !== null) // Remove null values 
); 

	localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); 
	console.log("💾 Data saved to localStorage:", data); 
}; 

const loadInputs = () => { 
	const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); 
	console.log("📂 Loading from localStorage:", data); // ✅ Debugging log 
	
	Object.entries(inputs).forEach(([key, input]) => { 
		if (input.type === "checkbox") { 
			input.checked = data[key] ?? false; 
		} else { 
			input.value = data[key] ?? ""; 
			if (key === "Maximum HP" || key === "Initiative" || key === "MeleeDamage" || key === "Defense") { 
			if (input.value.trim() !== "") { 
				input.dataset.manual = "true"; 
			} 
			} 
		} 
	}); 
	updateDerivedStats(); 
	saveInputs(); 
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
		
		inputs['MeleeDamage'].value = meleeDamage; } 
		
		console.log("Updated Values - Maximum HP:", 
		
		inputs['Maximum HP']?.value, "Initiative:", 
		inputs['Initiative']?.value, "Melee Damage:", 
		inputs['MeleeDamage']?.value); 
		
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

function registerInputs() { 
	document.querySelectorAll("input").forEach(input => { 
		inputs[input.id] = input; 
		console.log(`📌 Registered input: ${input.id}`); // ✅ Debugging log 
	}); 
} 
	
// Build Character Sheet 
builder.createHeading(2, 'Fallout-RPG Character Sheet'); 
createCharacterSheet(); 

	// Ensure all inputs exist before attaching listeners 
	
		setTimeout(() => { 
			document.querySelectorAll("input").forEach(input => { 
			const key = input.getAttribute("id"); 
			inputs[key] = input; input.addEventListener("input", () => { 
				saveInputs(); 
			}); 
			
			// 🔹 Ensure checkboxes also trigger `saveInputs()` on change 
			if (input.type === "checkbox") { 
				input.addEventListener("change", saveInputs); 
				} 
			}); 
			
			// 🔹 Ensure SPECIAL stats trigger save + table update 
			["STR", "PER", "END", "CHA", "INT", "AGI", "LCK"].forEach(stat => { 
				document.getElementById(stat)?.addEventListener("input", () => { 
					updateDerivedStats(); 
					saveInputs(); // ✅ Ensures SPECIAL stats are saved 
					renderWeaponTableUI(); 
				}); 
			}); 
			
			// Attach manual override handlers
    ["Maximum HP", "Initiative", "Defense", "MeleeDamage"].forEach(id => attachManualOverride(id))
			
			
			// 🔹 Ensure SKILLS trigger save 
			Object.keys(skillToSpecial).forEach(skill => { 
				let skillInput = document.getElementById(skill); 
				let skillTagInput = document.getElementById(`${skill}Tag`); 
				if (skillInput) { 
					skillInput.addEventListener("input", () => { saveInputs(); // ✅ Save skill changes 
					
				renderWeaponTableUI(); 
			}); 
		} 
		if (skillTagInput) { 
			skillTagInput.addEventListener("change", () => { 
				saveInputs(); // ✅ Save skill tag changes 
				renderWeaponTableUI(); 
			}); 
		} 
	}); // Load saved inputs and initialize derived stats
    loadInputs();
    updateDerivedStats();
}, 
100); 

// Attach manual override handlers for MaxHP and Initiative 
attachManualOverride("Maximum HP"); 
attachManualOverride("Initiative"); 
attachManualOverride("Defense"); 
attachManualOverride("MeleeDamage"); 
		
		setTimeout(() => { 
			registerInputs(); 
			loadInputs(); 
			setTimeout(() => { 
				if (typeof renderWeaponTableUI === "function") { 
					console.log("🔄 Re-rendering Weapon Table on Load..."); 
					renderWeaponTableUI(); 
					} else { 
						console.warn("⚠️ renderWeaponTableUI is not available on load."); 
					} 
				}, 500); 
			}, 100); 

return builder; 
```


---


 # Weapons 
 

```js-engine 
 
const STORAGE_KEY = "fallout_weapon_table"; 

window.renderWeaponTableUI = async function() { 
	
	const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.border = '1px solid #e0c9a0';
    container.style.borderRadius = '8px';
    container.style.backgroundColor = '#325886';
    container.style.overflowX = 'auto';
    container.style.width = '100%';



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
    ["Name", "Type", "Damage", "Effects", "Damage Type", "Rate", "Range", "Qualities", "Ammo", "Weight", "Cost", "TN", "Tag", "Remove"].forEach(headerText => {
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
	console.log("🔥 Loaded weapons before rendering table:", weapons); // Debug log

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

const skillToSpecial = { 
	"Athletics": "STR", "Small Guns": "AGI", "Energy Weapons": "PER", 
	"Melee Weapons": "STR", "Speech": "CHA", "Lockpick": "PER", 
	"Science": "INT", "Survival": "END", "Barter": "CHA", 
	"Big Guns": "END", "Explosives": "PER", "Medicine": "INT", 
	"Pilot": "PER", "Repair": "INT", "Sneak": "AGI", 
	"Throwing": "AGI", "Unarmed": "STR" 
}; 

function getCharacterStats() { 
	let stats = {}; 
	["STR", "PER", "END", "CHA", "INT", "AGI", "LCK"].forEach(stat => { 
		let value = parseInt(document.getElementById(stat)?.value) || 0; 
		stats[stat] = value; }); 
		let skills = {}; 
		Object.keys(skillToSpecial).forEach(skill => { 
			let skillValue = parseInt(document.getElementById(skill)?.value) || 0; 
			let tagged = document.getElementById(`${skill}Tag`)?.checked || false; skills[skill] = { 
				value: skillValue, tagged: tagged 
			};
		}); 
		console.log("🔎 Character Stats Loaded:", { stats, skills }); // ✅ Debugging log 
		return { stats, skills }; 
} 


function calculateWeaponStats(weaponSkill) {
    let { stats, skills } = getCharacterStats();

    if (!skills[weaponSkill]) return { TN: "N/A", Tag: false };

    let skillValue = skills[weaponSkill].value;
    let specialStat = skillToSpecial[weaponSkill];
    let specialValue = stats[specialStat] || 0;

    let calculatedTN = skillValue + specialValue;
    let calculatedTag = skills[weaponSkill].tagged;

    console.log(`⚙️ Calculating stats for ${weaponSkill}: Skill = ${skillValue}, SPECIAL(${specialStat}) = ${specialValue}, TN = ${calculatedTN}, Tag = ${calculatedTag}`);

    return {
        TN: calculatedTN,
        Tag: calculatedTag
    };
} 
			
			
async function fetchWeaponData() { 
	const WEAPONS_FOLDER = "Fallout-RPG/Items/Weapons"; 
	let allFiles = await app.vault.getFiles(); 
	let weaponFiles = allFiles.filter(file => file.path.startsWith(WEAPONS_FOLDER)); 
	
	let weapons = await Promise.all(weaponFiles.map(async (file) => { 
		let content = await app.vault.read(file); 
		
		let stats = { 
			link: `[[${file.basename}]]`, type: "N/A", damage: "N/A", damage_effects: "N/A", dmgtype: "Unknown", fire_rate: "N/A", range: "N/A", qualities: "N/A", ammo: "N/A", weight: "N/A", cost: "N/A", rate: "N/A" 
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
    let storedWeapons = weapons.map(w => ({
        ...w,
        TN: w.TN ?? calculateWeaponStats(w.type).TN,  
        Tag: w.Tag ?? calculateWeaponStats(w.type).Tag 
    }));
    console.log("💾 Saving to localStorage:", storedWeapons); // Debugging log
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedWeapons)); 
}
 

function loadWeaponTableState() { 
    let data = localStorage.getItem(STORAGE_KEY); 
    let weapons = data ? JSON.parse(data) : [];
    
    weapons.forEach(w => {
        if (!w.TN) w.TN = calculateWeaponStats(w.type).TN; 
        if (w.Tag === undefined) w.Tag = calculateWeaponStats(w.type).Tag;
    });

    console.log("📂 Loaded and processed weapons:", weapons); // Debugging log
    return weapons;
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
			
			let tagTd = document.createElement('td'); 
			let tagCheckbox = document.createElement('input'); 
			tagCheckbox.type = 'checkbox'; 
			tagCheckbox.checked = weapon.Tag ?? calculatedStats.Tag; // 🔹 Use saved value or default calculation 
			tagCheckbox.addEventListener('change', () => { 
				weapon.Tag = tagCheckbox.checked; 
				saveWeaponTableState(weapons); 
			}); 
			tagTd.appendChild(tagCheckbox); 
			row.appendChild(tagTd); // 🔹 Add the row to the table 
			tbody.appendChild(row); 
			input.focus(); 
		}; 
		
		console.log("Added edit icon to table cell:", td.innerHTML); // Debugging log 
		td.innerHTML += value.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>'); 
		td.prepend(editIcon); // Move edit icon to the front 
		row.appendChild(td); 
	}); 
	
	// 🔹 Fetch calculated TN and Tag values 
	let calculatedStats = calculateWeaponStats(weapon.type); 
	// 🔹 Add TN Column 
	let tnTd = document.createElement('td'); 
	let tnInput = document.createElement('input'); 
	tnInput.type = 'number'; 
	tnInput.value = weapon.TN ?? calculatedStats.TN; 
	tnInput.style.width = '50px'; 
	tnInput.addEventListener('input', () => {
		weapon.TN = tnInput.value; 
		saveWeaponTableState(weapons); 
	}); 
	tnTd.appendChild(tnInput); 
	row.appendChild(tnTd); 
	
	// 🔹 Add Tag Column (Checkbox) 
	let tagTd = document.createElement('td'); 
	let tagCheckbox = document.createElement('input'); 
	tagCheckbox.type = 'checkbox'; 
	tagCheckbox.checked = weapon.Tag ?? calculatedStats.Tag; 
	tagCheckbox.addEventListener('change', () => { 
		weapon.Tag = tagCheckbox.checked; 
		saveWeaponTableState(weapons); 
	}); 
	tagTd.appendChild(tagCheckbox); 
	row.appendChild(tagTd); 
	
	// Create remove icon instead of a button 
	const removeTd = document.createElement('td'); 
	removeTd.style.border = '1px solid #ccc'; 
	removeTd.style.padding = '8px'; 
	removeTd.style.textAlign = 'center'; // Center icon in the cell 
	removeTd.style.verticalAlign = 'middle'; // Center vertically 
	removeTd.style.height = '100%'; // Ensures full height for vertical centering 
	
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



return renderWeaponTableUI();

 ```

---

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

    let labels = { 'Phys. DR': 'physdr', 'Rad. DR': 'raddr', 'En. DR': 'endr', 'HP': 'hp' };
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

---

```js-engine
const STORAGE_KEY = "fallout_gear_table";
const SEARCH_FOLDERS = [
    "Fallout-RPG/Items/Apparel",
    "Fallout-RPG/Items/Consumables",
    "Fallout-RPG/Items/Tools and Utilities",
    "Fallout-RPG/Items/Weapons",
    "Fallout-RPG/Perks/Book Perks"
];
const DESCRIPTION_LIMIT = 100; // Character limit for descriptions

async function fetchGearData() {
    let allFiles = await app.vault.getFiles();
    let gearFiles = allFiles.filter(file => SEARCH_FOLDERS.some(folder => file.path.startsWith(folder)));

    let gearItems = await Promise.all(gearFiles.map(async (file) => {
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

    return gearItems.filter(g => g);
}

function saveGearTableState(gear) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gear));
}

function loadGearTableState() {
    let data = localStorage.getItem(STORAGE_KEY);
    let gearList = data ? JSON.parse(data) : [];

    // Ensure all gear objects have a qty field
    gearList.forEach(gear => {
        if (!gear.hasOwnProperty('qty')) {
            gear.qty = "1"; // Default quantity
        }
    });

    return gearList;
}


function addGearToTable(gear, tbody, gearList) {
    let row = document.createElement('tr');

    ["name", "qty", "description"].forEach((key, index) => {
        const td = document.createElement('td');
        td.style.border = '1px solid #ccc';
        td.style.padding = '8px';

        let value = gear[key] || (key === "qty" ? "1" : ""); // Ensure default qty

        let editIcon = document.createElement('span');
        editIcon.textContent = '✎';
        editIcon.style.cursor = 'pointer';
        editIcon.style.color = '#d7d7d782';
        editIcon.style.marginRight = '5px';

        function enableEditing() {
            let gearIndex = gearList.findIndex(g => g.name === gear.name);
            let currentValue = gearList[gearIndex][key]; // Fetch latest value

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

                gearList[gearIndex][key] = newValue; // Update gearList
                saveGearTableState(gearList);

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
        let index = gearList.findIndex(g => g.name === gear.name);
        if (index !== -1) gearList.splice(index, 1);
        saveGearTableState(gearList);
    };

    removeTd.appendChild(removeIcon);
    row.appendChild(removeTd);
    tbody.appendChild(row);
}


async function renderGearTableUI() {
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.border = '1px solid #e0c9a0';
    container.style.backgroundColor = '#325886';
    container.style.overflowX = 'auto';
    container.style.width = '100%';

    const title = document.createElement('h2');
    title.textContent = "Gear";
    title.style.color = "#efdd6f";
    container.appendChild(title);
    
        // Search Input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for gear...';
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

    // Search Functionality
    searchInput.addEventListener('input', async () => {
        let query = searchInput.value.toLowerCase();
        searchResults.innerHTML = '';
        searchResults.style.display = query ? 'block' : 'none';

        let allGear = await fetchGearData();
        let matches = allGear.filter(g => g.name.toLowerCase().includes(query));

        matches.forEach(gear => {
            let div = document.createElement('div');
            div.textContent = gear.name.replace(/\[\[(.*?)\]\]/g, '$1');
            div.style.padding = '5px';
            div.style.cursor = 'pointer';
            div.style.borderBottom = '1px solid #ccc';

            div.addEventListener('click', () => {
                addGearToTable(gear, tbody, gearList);
                gearList.push(gear);
                saveGearTableState(gearList);
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

    let gearList = loadGearTableState();
    gearList.forEach(gear => addGearToTable(gear, tbody, gearList));

    return container;
}

return renderGearTableUI();

```


---

```js-engine
const STORAGE_KEY = "fallout_perk_table";
const SEARCH_FOLDERS = [
    "Fallout-RPG/Perks/Core Rulebook",
    "Fallout-RPG/Perks/Settlers",
    "Fallout-RPG/Perks/Wanderers",
    "Fallout-RPG/Perks/Weapons",
    "Fallout-RPG/Perks/Book Perks"
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