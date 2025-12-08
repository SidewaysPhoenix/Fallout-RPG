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


function updateWeaponStats() {
    console.log("🔄 Running updateWeaponStats()...");

    let weapons = JSON.parse(localStorage.getItem("fallout_weapon_table") || "[]");
    console.log("📂 Weapons before update:", weapons);

    weapons.forEach((weapon, index) => {
        let calculatedStats = calculateWeaponStats(weapon.type);
        weapon.TN = calculatedStats.TN;
        weapon.Tag = calculatedStats.Tag;
    });

    console.log("📂 Weapons after update (before saving):", weapons);
    localStorage.setItem("fallout_weapon_table", JSON.stringify(weapons));

    // Ensure `weapon-table-container` exists
    let container = document.getElementById("weapon-table-container");
    if (!container) {
        console.warn("⚠️ weapon-table-container not found. Creating it...");
        container = document.createElement("div");
        container.id = "weapon-table-container";
        document.body.appendChild(container);
    }

    // 🔄 Force Re-render
    console.log("🔄 Clearing and re-rendering weapon table...");
    container.innerHTML = ""; // Clear old content

    setTimeout(() => {
        let newTable = renderWeaponTableUI();
        if (newTable instanceof Node) {
            container.appendChild(newTable);
            console.log("✅ Weapon table successfully re-rendered!");
        } else {
            console.error("❌ renderWeaponTableUI() did not return a valid Node.");
        }
    }, 100); // Small delay ensures DOM updates correctly
}









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
        saveInputs(); 
        setTimeout(updateWeaponStats, 100); // 🔄 Ensure table updates after UI
    }); 
});

Object.keys(skillToSpecial).forEach(skill => { 
    let skillInput = document.getElementById(skill); 
    let skillTagInput = document.getElementById(`${skill}Tag`); 

    if (skillInput) { 
        skillInput.addEventListener("input", () => { 
            saveInputs();
            setTimeout(updateWeaponStats, 100); // 🔄 Ensure TN & Tag refresh in the table
        });
    } 
    if (skillTagInput) { 
        skillTagInput.addEventListener("change", () => { 
            saveInputs();
            setTimeout(updateWeaponStats, 100);
        });
    } 
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

window.renderWeaponTableUI = function() { 
    let container = document.createElement("div");
    container.id = "weapon-table-container";
    container.style.padding = '20px';
    container.style.border = '1px solid #e0c9a0';
    container.style.borderRadius = '8px';
    container.style.backgroundColor = '#325886';
    container.style.overflowX = 'auto';
    container.style.width = '100%';

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
    
    let weapons = loadWeaponTableState();
    weapons.forEach(weapon => addWeaponToTable(weapon, tbody, weapons));

    console.log("🔥 Loaded weapons before rendering table:", weapons);

    container.appendChild(table);

    // ✅ Return the correct DOM Node
    return container;
};



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


window.calculateWeaponStats = function(weaponSkill) {
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
        let newStats = calculateWeaponStats(w.type); // 🔹 Always recalculate
        w.TN = newStats.TN;  
        w.Tag = newStats.Tag;
    });

    console.log("📂 Loaded and recalculated weapons:", weapons); 
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
	tnInput.addEventListener('input', () => { weapon.TN = parseInt(tnInput.value) || 0; saveWeaponTableState(weapons); updateWeaponStats(); // 🔄 Ensure TN updates & table refreshes 
	});
	tnTd.appendChild(tnInput); 
	row.appendChild(tnTd); 
	
	// 🔹 Add Tag Column (Checkbox) 
	let tagTd = document.createElement('td'); 
	let tagCheckbox = document.createElement('input'); 
	tagCheckbox.type = 'checkbox'; 
	tagCheckbox.checked = weapon.Tag ?? calculatedStats.Tag; 
	tagCheckbox.addEventListener('change', () => { weapon.Tag = tagCheckbox.checked; saveWeaponTableState(weapons); updateWeaponStats(); // 🔄 Ensure Tag updates & table refreshes 
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