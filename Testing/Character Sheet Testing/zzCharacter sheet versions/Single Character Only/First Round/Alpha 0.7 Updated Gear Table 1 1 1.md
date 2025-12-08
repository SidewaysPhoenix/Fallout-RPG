```js-engine

// Fallout RPG Character Sheet - Combined Layout 

// 🔹 Ensure skillToSpecial is globally available 
const skillToSpecial = { 
	"Athletics": "STR", "Barter": "CHA", "Big Guns": "END", 
	"Energy Weapons": "PER", "Explosives": "PER", "Lockpick": "PER", 
	"Medicine": "INT", "Melee Weapons": "STR", "Pilot": "PER", 
	"Repair": "INT", "Science": "INT", "Small Guns": "AGI", 
	"Sneak": "AGI", "Speech": "CHA", "Survival": "END", 
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

    weapons.forEach((weapon, index) => {
        let calculatedStats = calculateWeaponStats(weapon.type);

        // Only update TN if it has not been manually entered
        if (weapon.manualTN === undefined) {
            weapon.TN = calculatedStats.TN;
        }

        weapon.Tag = calculatedStats.Tag;
    });

    console.log("📂 Weapons after update (before saving):", weapons);
    localStorage.setItem("fallout_weapon_table", JSON.stringify(weapons));

    // Ensure `weapon-table-container` exists before rendering
    let container = document.getElementById("weapon-table-container");
    if (!container) {
        console.warn("⚠️ weapon-table-container not found. Creating it...");
        container = document.createElement("div");
        container.id = "weapon-table-container";
        document.body.appendChild(container);
    }

    // 🔄 Force Re-render
    console.log("🔄 Clearing and re-rendering weapon table...");
    container.innerHTML = "";

    setTimeout(() => {
        let newTable = renderWeaponTableUI();
        if (newTable instanceof Node) {
            container.appendChild(newTable);
            console.log("✅ Weapon table successfully re-rendered!");
        } else {
            console.error("❌ renderWeaponTableUI() did not return a valid Node.");
        }
    }, 100);
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
	    `<div style="
	        display:grid; 
	        grid-template-columns: 1fr; 
	        gap:20px;  
	        min-width:700px; 
	        background-color:#325886; 
	        padding:15px; 
	        border-radius:8px;
	        caret-color:black;
	        border:3px solid #2e4663;
	        margin-bottom: 5;
	    ">
            
    <!-- Character Info & Derived Stats (Side-by-Side) -->
            
		<div style="
			display:grid; 
			grid-template-columns: 1fr 1fr; 
			gap:20px;  
			align-items:start; 
		">
                
        <div style="
	        border:1px solid #ccc; 
	        padding:10px; 
	        border-radius:8px;
	    ">
        
        <div style="
	        font-weight:bold; 
	        font-size:22px; 
	        color:#efdd6f; 
	        text-align:center; 
	        padding-bottom:5px;
	    ">
	    Character Info</div>
                    
        <div style="
	        display:grid; 
	        grid-template-columns: auto 1fr; 
	        gap:5px; 
	        align-items:center;
	    ">
            
            <label style="color:#FFC200">Name:</label> 
            
            <input id="Name" type="text" style="
	            width:100%; 
	            background-color:#fde4c9; 
	            border-radius:5px; 
	            color:black;"
	        >
                        
            <label style="color:#FFC200">Origin:</label> 
            
            <input id="Origin" type="text" style="
	            width:100%; 
	            background-color:#fde4c9; 
	            border-radius:5px; 
	            color:black;"
	        >
                        
            <label style="color:#FFC200">Level:</label> 
            
            <input id="Level" type="number" style="
	            width:50px; 
	            background-color:#fde4c9; 
	            border-radius:5px; 
	            color:black;"
	        >
                        
            <label style="color:#FFC200">XP Earned:</label> 
            
            <input id="XPEarned" type="number" style="
	            width:80px; 
	            background-color:#fde4c9; 
	            border-radius:5px; 
	            color:black;"
	        >
                        
            <label style="color:#FFC200">XP to Next Level:</label> 
            
            <input id="XPNext" type="number" style="
	            width:80px; 
	            background-color:#fde4c9; 
	            border-radius:5px; 
	            color:black;"
	        >
	</div>
</div>
                
			<div style="
				border-left: 2px solid rgba(255,255,255,0.2); 
				padding-left:20px; 
				border:1px solid #ccc; 
				padding:15px; 
				border-radius:8px; 
				display:grid; 
				grid-template-columns: 1fr 1fr; 
				gap:10px;">
                    <div>
                    
            <div style="
	            font-weight:bold; 
	            font-size:22px; 
	            color:#efdd6f; 
	            text-align:center; 
	            padding-bottom:5px;
	        ">
	        
	    Derived Stats</div>
	    
            <label style="color:#FFC200">Melee Damage:</label> 
            
            <input id="MeleeDamage" type="text" style="
	            width:90%; 
	            background-color:#fde4c9; 
	            border-radius:5px; 
	            color:black;
	        ">
                        
            <label style="color:#FFC200">Defense:</label> 
            
            <input id="Defense" type="number" style="
	            width:90%; 
	            background-color:#fde4c9; 
	            border-radius:5px; 
	            color:black;
	        ">
                        
            <label style="color:#FFC200">Initiative:</label> 
            
            <input id="Initiative" type="number" style="
	            width:90%; 
	            background-color:#fde4c9; 
	            border-radius:5px; 
	            color:black;
	        ">
        </div>
                    
            <div style="
	            display:grid; 
	            grid-template-rows: auto auto; 
	            gap:5px; 
	            align-items:center;
	        ">
                        
            <div style="
	            border:1px solid #efdd6f; 
	            padding:5px; 
	            display:grid; 
	            grid-template-columns: auto 1fr; 
	            align-items:center;
	        ">
                            
                <label style="
	                color:#FFC200;
	                margin-right:5;
	            ">Luck Points:</label> 
                
                <input id="LuckPoints" type="number" style="
	                min-width:30px; 
	                max-width:75px; 
	                background-color:#fde4c9; 
	                border-radius:5px; 
	                color:black;
	            ">
            </div>
            
            <div style="
	            border:1px solid #efdd6f; 
	            padding:5px; 
	            display:grid; 
	            grid-template-columns: auto auto; 
	            align-items:center;
	            min-height:100px
	        ">
                           
				<label style="
					grid-column: 1 / span 2; 
					text-align:center; 
					color:#efdd6f; 
					font-weight:bold;
					font-size:13
				">HP</label>
                
                <label style="
	                color:#FFC200; 
	                margin-right:5;
                ">Maximum HP:</label> 
                
                <input id="Maximum HP" type="text" style="
	                min-width:20px; 
	                max-width:50px;  
	                background-color:#fde4c9; 
	                border-radius:5px; 
	                color:black;
	            ">
                
                <label style="color:#FFC200">Current HP:</label> 
                <input id="CurrentHP" type="text" style="
	                min-width:20px; 
	                max-width:50px; 
	                background-color:#fde4c9; 
	                border-radius:5px; 
	                color:black;
	            ">
                       
						
				</div>
			</div>
		</div>
	</div>
            
            <!-- S.P.E.C.I.A.L. Stats -->
            <div style="
	            grid-column: span 1; 
	            border:1px solid #ccc; 
	            padding:10px; 
	            border-radius:8px; 
	            text-align:center; 
	        ">
                
            <div style="
	            font-weight:bold; 
	            font-size:22px; 
	            color:#efdd6f; 
	            text-align:center; 
	            padding-bottom:5px;
	        ">S.P.E.C.I.A.L.</div>
                
            <div style="
	            display:flex; 
	            justify-content:space-around; 
	            gap:10px;
	        ">
                    
${['STR', 'PER', 'END', 'CHA', 'INT', 'AGI', 'LCK'].map(stat => 
	`<div style="
		display:flex; 
		flex-direction:column; 
		align-items:center;
	">
					
			<label style="
				color:#FFC200; 
				font-weight:bold;
			">${stat}</label>
			
			<input id="${stat}" type="number" style="
				width:40px; 
				text-align:center; 
				background-color:#fde4c9; 
				color:black; 
				border-radius:5px; 
				border:1px solid #black;
			">
				</div>`
	).join('')
}
		
		</div>
	</div>           
            <!-- Skills Section -->
		<div style="
			grid-column: span 1; 
			border:1px solid #ccc; 
			padding:5px; 
			border-radius:8px; 
			text-align:left;
		">
	    <div style="
		    font-weight:bold; 
		    font-size:22px; 
		    color:#efdd6f; 
		    text-align:center; 
		    padding-bottom:5px;
		">Skills</div>
    
	    <div style="
		    display:grid; 
		    grid-template-columns: repeat(3, 1fr); 
		    gap:5px;
		">
		
    ${Object.keys(skillToSpecial).map(skill => 
        `<div style="
	        display:flex; 
	        align-items:center; 
	        gap:1px; 
	        justify-content:space-between; 
	        border-bottom:1px solid rgba(255,255,255,0.2); 
	        padding:5px 15px; 
	        transition:background-color 0.3s;
	    ">
            <label style="
	            color:#FFC200; 
	            text-align:left;
	        ">${skill}</label>
	        
    <span style="flex:2;color:white; font-size:0.8em;">
        
        [${skillToSpecial[skill]}]</span>
			
			<input type="checkbox" id="${skill}Tag">
			<input id="${skill}" type="number" style="
				max-width:40px; 
				background-color:#fde4c9; 
				color:black; 
				text-align:center; 
				border-radius:5px; 
				
			">
         </div>`
        ).join('')}
    </div>
</div> `
    );
}; 



 


	
	
// Build Character Sheet  
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

```js-engine
function renderCapsContainer() {
    // ✅ Caps field (global)
    const CapsContainer = document.createElement('div');
    CapsContainer.style.padding = '10px';
    CapsContainer.style.border = '3px solid #2e4663';
    CapsContainer.style.borderRadius = '8px';
    CapsContainer.style.backgroundColor = '#325886';
    CapsContainer.style.display = 'flex';
    CapsContainer.style.flexDirection = 'row';
    CapsContainer.style.alignItems = 'center';
    CapsContainer.style.marginBottom = '10px'; // ✅ Ensures spacing below
    CapsContainer.style.width = "100%";
    CapsContainer.style.maxWidth = "200px";
    CapsContainer.style.maxHeight = "50px";
    CapsContainer.style.gap = "15px";

    const CapsLabel = document.createElement('strong');
    CapsLabel.textContent = 'Caps';
    CapsLabel.style.color = '#EFDD6F';

    const decreaseIcon = document.createElement('span');
    decreaseIcon.textContent = "−";
    decreaseIcon.style.cursor = "pointer";
    decreaseIcon.style.color = "#ffc200";
    decreaseIcon.style.fontSize = "25px";
    decreaseIcon.style.marginLeft = "15px"
    

    const increaseIcon = document.createElement('span');
    increaseIcon.textContent = "+";
    increaseIcon.style.cursor = "pointer";
    increaseIcon.style.color = "#ffc200";
    increaseIcon.style.fontSize = "25px";

    // ✅ Load stored Caps value
    const CAPS_KEY = 'fallout_Caps';
    let storedValue = localStorage.getItem(CAPS_KEY) || '0';

    // ✅ Displayed number (Click to edit)
    const CapsDisplay = document.createElement('span');
    CapsDisplay.textContent = storedValue;
    CapsDisplay.style.minWidth = "30px";
    CapsDisplay.style.textAlign = "center";
    CapsDisplay.style.color = "#fde4c9";
    CapsDisplay.style.cursor = "pointer";
    
    

    // ✅ Editable input field (hidden initially)
    const CapsInput = document.createElement('input');
    CapsInput.type = 'number';
    CapsInput.style.width = '50px';
    CapsInput.style.textAlign = 'center';
    CapsInput.style.backgroundColor = '#fde4c9';
    CapsInput.style.border = '1px solid #fbb4577e';
    CapsInput.style.display = 'none';
    CapsInput.style.caretColor='black';
    CapsInput.style.color='black';

    function updateCaps(value) {
        let newValue = parseInt(value, 10);
        if (isNaN(newValue) || newValue < 0) newValue = 0;
        localStorage.setItem(CAPS_KEY, newValue);
        CapsDisplay.textContent = newValue;
        CapsInput.value = newValue;
    }

    // ✅ Handle clicking the CapsDisplay to enter edit mode
    CapsDisplay.onclick = () => {
        CapsInput.value = CapsDisplay.textContent;
        CapsDisplay.style.display = "none";
        CapsInput.style.display = "inline-block";
        CapsInput.focus();
    };

    // ✅ Handle exit from editing
    function exitEditMode(save) {
        if (save) updateCaps(CapsInput.value);
        CapsInput.style.display = "none";
        CapsDisplay.style.display = "inline-block";
    }

    CapsInput.addEventListener("blur", () => exitEditMode(true)); // Save on blur
    CapsInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") exitEditMode(true); // Save on Enter
        if (e.key === "Escape") exitEditMode(false); // Cancel on Escape
    });

    // ✅ Increase/Decrease icons functionality
    decreaseIcon.onclick = () => {
        let newValue = parseInt(CapsDisplay.textContent, 10) - 1;
        if (newValue < 0) newValue = 0;
        updateCaps(newValue);
    };

    increaseIcon.onclick = () => {
        let newValue = parseInt(CapsDisplay.textContent, 10) + 1;
        updateCaps(newValue);
    };

    // ✅ Assemble UI
    CapsContainer.appendChild(CapsLabel);
    CapsContainer.appendChild(decreaseIcon);
    CapsContainer.appendChild(CapsDisplay);
    CapsContainer.appendChild(CapsInput);
    CapsContainer.appendChild(increaseIcon);

    return CapsContainer;
}


// ✅ Return the Caps container so it gets displayed in js-engine
return renderCapsContainer();

```

---


 
 

```js-engine 
 
const STORAGE_KEY = "fallout_weapon_table"; 

window.renderWeaponTableUI = function() { 
    let container = document.createElement('div');
    container.id = "weapon-table-container";
    container.style.padding = '10px';
    container.style.border = '3px solid #2e4663';
    container.style.borderRadius = '8px';
    container.style.backgroundColor = '#325886';
    container.style.overflowX = 'auto';

const title = document.createElement('h2');
    title.textContent = "Weapons";
    title.style.color = "#efdd6f";
    container.appendChild(title);

    // 🔍 Create Search Bar
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search by name...';
    searchInput.style.marginBottom = '5px';
    searchInput.style.padding = '5px';
    searchInput.style.width = '100%';
    searchInput.style.border = '1px solid #black';
    searchInput.style.borderRadius = '5px';
    searchInput.style.backgroundColor = '#fde4c9';
    searchInput.style.color = 'black';
    searchInput.style.marginTop = '10px';
    searchInput.style.caretColor='black';
    container.appendChild(searchInput);

    // 🔎 Create Search Results Dropdown
    const searchResults = document.createElement('div');
    searchResults.style.border = '1px solid #ccc';
    searchResults.style.backgroundColor = '#fde4c9';
    searchResults.style.padding = '5px';
    searchResults.style.display = 'none';
    searchResults.style.maxHeight = '200px';
    searchResults.style.overflowY = 'auto';
    searchResults.style.color = 'black';
    container.appendChild(searchResults);

    // Create Table
    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
["Name", "TN", "Tag", "Damage", "Rate", "Effects", "Qualities", "Ammo", "Type", "Damage Type", "Range", "Weight", "Cost", "Remove"].forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    th.style.textAlign = 'center';
    th.style.alignContent = 'center';
    headerRow.appendChild(th);
});
thead.appendChild(headerRow);


    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    container.appendChild(table);

    // 🚀 Ensure `renderWeaponTableUI()` returns the container immediately
    setTimeout(async () => {
        let weapons = loadWeaponTableState();
        weapons.forEach(weapon => addWeaponToTable(weapon, tbody, weapons));

        console.log("🔥 Loaded weapons after async data:", weapons);

        // 🔍 Implement Search Functionality (async)
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
                div.style.borderBottom = '1px solid #ccc';

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
    }, 100); // Short delay to allow immediate return
    
    searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // Optionally auto-select first result or hide results
        let firstResult = searchResults.querySelector('div');
        if (firstResult) firstResult.click();
        searchInput.blur();
    }

    if (event.key === 'Escape') {
        // Clear and close search
        searchInput.value = '';
        searchInput.blur();
        searchResults.style.display = 'none';
    }
    
});

	searchInput.addEventListener('blur', () => {
	    // Delay hiding slightly in case a result was just clicked
	    setTimeout(() => {
	         searchInput.value = '';
	        searchResults.style.display = 'none';
	    }, 200);
	});


    return container; // ✅ Always return a valid Node
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
 
			
			
let cachedWeaponData = null; // Global cache for weapon data

async function fetchWeaponData() {
    if (cachedWeaponData) return cachedWeaponData; // ✅ Use cache if available

    const WEAPONS_FOLDER = "Fallout RPG/Items/Weapons";
    let allFiles = await app.vault.getFiles();
    let weaponFiles = allFiles.filter(file => file.path.startsWith(WEAPONS_FOLDER));

    let weapons = await Promise.all(weaponFiles.map(async (file) => {
        let content = await app.vault.read(file);

        let stats = {
            link: `[[${file.basename}]]`, type: "N/A", damage: "N/A", 
            damage_effects: "N/A", dmgtype: "Unknown", fire_rate: "N/A", 
            range: "N/A", qualities: "N/A", ammo: "N/A", weight: "N/A", 
            cost: "N/A", rate: "N/A"
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

    cachedWeaponData = weapons.filter(w => w); // ✅ Store results in cache
    return cachedWeaponData;
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
    
     if (weapon.TN === undefined || weapon.TN === null) {
        weapon.TN = calculateWeaponStats(weapon.type).TN; // Set TN if missing
    }


function createEditableCell(value, key, weapon, weapons) {
    let td = document.createElement('td');
    td.style.position = 'relative'; 

    function updateDisplay() {
        let text = weapon[key] || "";

        // Preserve markdown links, but allow plain text too
        let formattedText = text.toString().replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');

        td.innerHTML = formattedText;
        td.dataset.editing = "false"; 
    }

    updateDisplay();

    td.addEventListener('click', (event) => {
        if (td.dataset.editing === "true") return; 

        if (event.target.tagName === "A" || event.target.tagName === "INPUT") {
            return; 
        }

        td.dataset.editing = "true"; 

        let input = document.createElement('input');
        input.type = (key === "TN") ? "number" : "text";  // TN should use number input
        input.value = weapon[key] || ""; 
        input.style.width = '100%';
        input.style.border = 'none';
        input.style.background = '#fde4c9';
        input.style.color = 'black';
        input.style.caretColor = 'black';

        function saveAndClose() {
            let newValue = input.value.trim();
            if (newValue) {
                weapon[key] = newValue;
            }

            saveWeaponTableState(weapons);
            updateDisplay();
            td.dataset.editing = "false";
        }

        input.addEventListener('keydown', (event) => {
            if (event.key === "Enter") {
                saveAndClose();
            }
        });
        
        input.addEventListener('keydown', (event) => {
            if (event.key === "Escape") {
                saveAndClose();
            }
        });

        input.addEventListener('blur', () => {
            saveAndClose();
        });

        td.innerHTML = '';
        td.appendChild(input);
        input.focus();
    });

    return td;
}


    // 🔹 Name (Now Using Same Editable Logic as Other Fields)
    row.appendChild(createEditableCell(weapon.link, "link", weapon, weapons));

  // 🔹 TN Column (Editable like other fields)
row.appendChild(createEditableCell(weapon.TN, "TN", weapon, weapons));
 

    // 🔹 Tag Column (Checkbox)
    let tagTd = document.createElement('td'); 
    let tagCheckbox = document.createElement('input'); 
    tagCheckbox.type = 'checkbox'; 
    tagCheckbox.checked = weapon.Tag ?? calculateWeaponStats(weapon.type).Tag;

    tagCheckbox.addEventListener('change', () => { 
        weapon.Tag = tagCheckbox.checked; 
        saveWeaponTableState(weapons); 
    }); 
	tagTd.style.alignContent = 'center';
	tagTd.style.textAlign = 'center';
    tagTd.appendChild(tagCheckbox); 
    row.appendChild(tagTd); 

    // 🔹 Other Weapon Stats (Editable with Markdown Formatting)
    ["damage", "rate", "damage_effects", "qualities", "ammo", "type", "dmgtype", "range", "weight", "cost"].forEach(key => { 
        row.appendChild(createEditableCell(weapon[key] || "", key, weapon, weapons));
    });

    // 🔹 Remove Button
    const removeTd = document.createElement('td'); 
    removeTd.style.padding = '8px'; 
    removeTd.style.textAlign = 'center';
    removeTd.style.alignContent = 'center'; 

    let removeIcon = document.createElement('span'); 
    removeIcon.textContent = '🗑️'; 
    removeIcon.style.cursor = 'pointer'; 
    removeIcon.style.fontSize = '1.2em'; 

    removeIcon.onclick = () => { 
        tbody.removeChild(row); 
        let index = weapons.findIndex(w => w.link === weapon.link); 
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
const STORAGE_KEY = "fallout_ammo_table";
const SEARCH_FOLDERS = [
    "Fallout RPG/Items/Ammo"
];
const DESCRIPTION_LIMIT = 999; // Character limit for descriptions

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

    ["name", "qty", "description"].forEach((key) => {
        const td = document.createElement('td');
        td.style.textAlign = 'left';
        td.style.cursor = 'pointer';
        td.dataset.editing = "false";

        let value = ammo[key] || (key === "qty" ? "1" : "");

        if (key === "qty") {
            // Keep quantity logic untouched
            let qtyContainer = document.createElement('div');
            qtyContainer.style.display = "flex";
            qtyContainer.style.alignItems = "center";
            qtyContainer.style.gap = "5px";

            let decreaseIcon = document.createElement('span');
            decreaseIcon.textContent = "−";
            decreaseIcon.style.cursor = "pointer";
            decreaseIcon.style.color = "#ffc200";
            decreaseIcon.style.fontSize = "25px";

            let qtyText = document.createElement('span');
            qtyText.textContent = value;
            qtyText.style.minWidth = "20px";
            qtyText.style.textAlign = "center";
            qtyText.style.color = "#fde4c9";
            qtyText.style.cursor = "pointer";

            let increaseIcon = document.createElement('span');
            increaseIcon.textContent = "+";
            increaseIcon.style.cursor = "pointer";
            increaseIcon.style.color = "#ffc200";
            increaseIcon.style.fontSize = "25px";

            let ammoIndex = ammoList.findIndex(g => g.name === ammo.name);

            decreaseIcon.onclick = () => {
                let newValue = parseInt(qtyText.textContent, 10) - 1;
                if (newValue < 1) newValue = 1;
                qtyText.textContent = newValue;
                ammoList[ammoIndex].qty = newValue.toString();
                saveAmmoTableState(ammoList);
            };

            increaseIcon.onclick = () => {
                let newValue = parseInt(qtyText.textContent, 10) + 1;
                qtyText.textContent = newValue;
                ammoList[ammoIndex].qty = newValue.toString();
                saveAmmoTableState(ammoList);
            };

            qtyText.onclick = () => {
                let input = document.createElement('input');
                input.type = "number";
                input.value = qtyText.textContent;
                input.style.width = "50px";
                input.style.textAlign = "center";
                input.style.backgroundColor = "#fde4c9";
                input.style.color = "#325886";
                input.style.border = "1px solid #efdd6f";

                let originalValue = qtyText.textContent;

                function saveAndExit() {
                    let newValue = parseInt(input.value, 10);
                    if (isNaN(newValue) || newValue < 1) newValue = 1;
                    qtyText.textContent = newValue;
                    ammoList[ammoIndex].qty = newValue.toString();
                    saveAmmoTableState(ammoList);
                    qtyContainer.replaceChild(qtyText, input);
                }

                function cancelAndExit() {
                    qtyContainer.replaceChild(qtyText, input);
                }

                input.addEventListener("blur", saveAndExit);
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") saveAndExit();
                    if (e.key === "Escape") {
                        qtyText.textContent = originalValue;
                        cancelAndExit();
                    }
                });

                qtyContainer.replaceChild(input, qtyText);
                input.focus();
            };

            qtyContainer.appendChild(decreaseIcon);
            qtyContainer.appendChild(qtyText);
            qtyContainer.appendChild(increaseIcon);
            td.appendChild(qtyContainer);
        } else {
            function enableEditing() {
                if (td.dataset.editing === "true") return;

                td.dataset.editing = "true";
                td.innerHTML = '';

                let input = document.createElement('input');
                input.type = "text";
                input.value = ammo[key] || "";
                input.style.width = "100%";
                input.style.border = "none";
                input.style.background = "#fde4c9";
                input.style.color = "black";
                input.style.caretColor = "black";

                function saveAndClose() {
                    let newValue = input.value.trim();
                    if (key === "description" && newValue.length > DESCRIPTION_LIMIT) {
                        newValue = newValue.substring(0, DESCRIPTION_LIMIT) + "...";
                    }

                    ammo[key] = newValue;
                    saveAmmoTableState(ammoList);
                    td.dataset.editing = "false";
                    td.innerHTML = '';

                    renderDisplay();
                }

                input.addEventListener('keydown', (e) => {
                    if (e.key === "Enter" || e.key === "Escape") input.blur();
                });

                input.addEventListener('blur', saveAndClose);
                td.appendChild(input);
                input.focus();
            }

            function renderDisplay() {
                let displayText = document.createElement('span');
                displayText.innerHTML = (ammo[key] || "").replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
                displayText.style.cursor = 'pointer';

                td.addEventListener('click', (e) => {
    if (
        td.dataset.editing !== "true" &&
        e.target.tagName !== "A" &&
        e.target !== displayText
    ) {
        enableEditing();
    }
});


                td.appendChild(displayText);
            }

            renderDisplay();
        }

        row.appendChild(td);
    });

    let removeTd = document.createElement('td');
    removeTd.style.textAlign = 'center';

    let removeIcon = document.createElement('span');
    removeIcon.textContent = '🗑️';
    removeIcon.style.cursor = "pointer";
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
    container.style.border = '3px solid #2e4663';
    container.style.borderRadius = '8px'
    container.style.backgroundColor = '#325886';
    container.style.overflowX = 'auto';
    container.style.width = '100%';
    container.style.caretColor='black';

    const title = document.createElement('h2');
    title.textContent = "Ammo";
    title.style.color = "#efdd6f";
    container.appendChild(title);
    
        // Search Input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for ammo...';
    searchInput.style.borderRadius = '5px';
    searchInput.style.padding = '5px';
    searchInput.style.width = '100%';
    searchInput.style.backgroundColor = '#fde4c9';
    searchInput.style.color = 'black';
    container.appendChild(searchInput);

    const searchResults = document.createElement('div');
    searchResults.style.border = '1px solid #ccc';
    searchResults.style.backgroundColor = '#fde4c9';
    searchResults.style.padding = '5px';
    searchResults.style.display = 'none';
    searchResults.style.color = 'black';
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
            div.style.cursor = 'pointer';

            div.addEventListener('click', () => {
                 ammoList.push(ammo);
                addAmmoToTable(ammo, tbody, ammoList);
                saveAmmoTableState(ammoList);
                searchInput.value = '';
                searchResults.style.display = 'none';
            });

            searchResults.appendChild(div);
        });
    });

	 searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // Optionally auto-select first result or hide results
        let firstResult = searchResults.querySelector('div');
        if (firstResult) firstResult.click();
        searchInput.blur();
    }

    if (event.key === 'Escape') {
        // Clear and close search
        searchInput.value = '';
        searchInput.blur();
        searchResults.style.display = 'none';
    }
    
});

	searchInput.addEventListener('blur', () => {
	    // Delay hiding slightly in case a result was just clicked
	    setTimeout(() => {
	         searchInput.value = '';
	        searchResults.style.display = 'none';
	    }, 200);
	});

    const table = document.createElement('table');
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ["Name", "Qty", "Description", "Remove"].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
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

let cachedArmorData = {}; // Global cache for armor data

async function fetchArmorData(section) {
    // ✅ Return cached data if it exists
    if (cachedArmorData[section]) return cachedArmorData[section];

    const ARMOR_FOLDERS = [
        "Fallout RPG/Items/Apparel/Armor",
        "Fallout RPG/Items/Apparel/Clothing",
        "Fallout RPG/Items/Apparel/Headgear",
        "Fallout RPG/Items/Apparel/Outfits",
        "Fallout RPG/Items/Apparel/Power Armor",
        "Fallout RPG/Items/Apparel/Robot Armor"
    ];
    
    let allFiles = await app.vault.getFiles();
    let armorFiles = allFiles.filter(file => 
        ARMOR_FOLDERS.some(folder => file.path.startsWith(folder) || file.path === folder)
    );

    let armors = await Promise.all(armorFiles.map(async (file) => {
        let content = await app.vault.read(file);
        let stats = {
            link: file.basename, 
            physdr: "0", 
            raddr: "0", 
            endr: "0", 
            hp: "0", 
            locations: "Unknown"
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

    // ✅ Cache the filtered armor data for this section
    cachedArmorData[section] = armors.filter(a => matchesSection(a.locations, section));

    return cachedArmorData[section];
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
    sectionContainer.style.border = '3px solid #2e4663';
    sectionContainer.style.borderRadius = '8px';
    sectionContainer.style.padding = '10px';
    sectionContainer.style.maxWidth = '400px'
    sectionContainer.style.alignItems = 'left'
    sectionContainer.style.display = 'flex'
    sectionContainer.style.flexDirection = 'column'
    sectionContainer.style.position = 'relative';
    sectionContainer.style.caretColor = 'black';

    let title = document.createElement("div");
    title.textContent = section;
    title.style.color = '#EFDD6F';
    title.style.textAlign = 'center';
    title.style.marginBottom = '10px';
    title.style.fontSize = '20px';
    title.style.fontWeight = 'bold';
    
    
	
    sectionContainer.appendChild(title);

    let mainContainer = document.createElement('div');
    mainContainer.style.display = 'grid';
    mainContainer.style.gridTemplateColumns = 'repeat(1, 1fr)';
    mainContainer.style.border = '2px solid #2e4663'
    mainContainer.style.borderRadius = '5px'

    let gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
  

let apparelContainer = document.createElement('div');
apparelContainer.style.position = "relative"; // Keeps alignment


// ✅ Create the input field (starts hidden)
let apparelInput = document.createElement('input');
apparelInput.type = 'text';
apparelInput.style.width = '100%';
apparelInput.style.display = "none"; // ✅ Starts hidden
apparelInput.style.borderBottomLeftRadius = '5px'
apparelInput.style.borderBottomRightRadius = '5px'

// ✅ Create the display div (shown by default)
let apparelDisplay = document.createElement('div');
apparelDisplay.style.cursor = 'text';
apparelDisplay.style.width = '100%';
apparelDisplay.style.padding = '5px';
apparelDisplay.style.borderBottomLeftRadius = '5px'
apparelDisplay.style.borderBottomRightRadius = '5px'
apparelDisplay.style.backgroundColor = "#2e4663";
apparelDisplay.style.display = "block"; // ✅ Starts visible
apparelDisplay.style.textAlign = 'center';
apparelDisplay.style.fontSize = '16px';

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


  

    let labels = { 'Phys. DR': 'physdr','En. DR': 'endr','Rad. DR': 'raddr', 'HP': 'hp' }; 
    
    let inputs = {};

    Object.entries(labels).forEach(([label, key]) => {
        let fieldContainer = document.createElement('div');
        let input = document.createElement('input');
        input.type = 'text';
        input.style.backgroundColor = '#fde4c9';
        input.style.borderRadius = '5px';
        input.style.marginBottom = '10px';
        input.style.width = "60%"; // 70% width of the container
        input.style.textAlign = 'center';
        input.style.color = 'black';
        inputs[key] = input; 
       
        fieldContainer.innerHTML = `<strong style="color:#FFC200;">${label}</strong><br>`;
        fieldContainer.appendChild(input);
	    fieldContainer.style.display = 'center';
	    fieldContainer.style.flexDirection = 'column';
	    fieldContainer.style.alignItems = 'center';
	    fieldContainer.style.textAlign = 'center';
	    fieldContainer.style.marginTop = '5px'
        gridContainer.appendChild(fieldContainer);
    });

    mainContainer.appendChild(gridContainer);
    mainContainer.appendChild(apparelContainer);
    sectionContainer.appendChild(mainContainer);
    
    
    let searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = `Search ${section} Armor...`;
    searchInput.style.borderRadius = '5px';
    searchInput.style.border = '1px solid black';
    searchInput.style.width = '100%';
    searchInput.style.marginBottom = '5px';
    searchInput.style.marginTop = '20px';
    searchInput.style.backgroundColor = '#fde4c9'
    searchInput.style.color = 'black';
    sectionContainer.appendChild(searchInput);

    // Ensure the parent is position: relative so the absolutely positioned child is scoped
sectionContainer.style.position = 'relative';

let searchResults = document.createElement('div');
searchResults.style.display = 'none';
searchResults.style.position = 'absolute'; // Key to make it float
searchResults.style.top = '91%'; // Place it just below the input/search bar
searchResults.style.left = '10';
searchResults.style.zIndex = '1000'; // Ensures it floats above other content
searchResults.style.backgroundColor = '#fde4c9';
searchResults.style.padding = '5px';
searchResults.style.color = 'black';
searchResults.style.width = '94%'; // Optional: match the width of the container
sectionContainer.appendChild(searchResults);


    

// ✅ Ensure `storedData` is loaded BEFORE use
let storedData = loadArmorData(section);




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
    
    searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // Optionally auto-select first result or hide results
        let firstResult = searchResults.querySelector('div');
        if (firstResult) firstResult.click();
        searchInput.blur();
    }

    if (event.key === 'Escape') {
        // Clear and close search
        searchInput.value = '';
        searchInput.blur();
        searchResults.style.display = 'none';
    }
    
});

	searchInput.addEventListener('blur', () => {
	    // Delay hiding slightly in case a result was just clicked
	    setTimeout(() => {
	         searchInput.value = '';
	        searchResults.style.display = 'none';
	    }, 200);
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
    poisonDRContainer.style.border = '3px solid #2e4663';
    poisonDRContainer.style.borderRadius = '8px';
    poisonDRContainer.style.backgroundColor = '#325886';
    poisonDRContainer.style.display = 'flex';
    poisonDRContainer.style.flexDirection = 'row';
    poisonDRContainer.style.alignItems = 'center';
    poisonDRContainer.style.marginBottom = '10px'; // ✅ Ensures spacing below
    poisonDRContainer.style.width = "40%";
    poisonDRContainer.style.maxWidth = "400px";
    poisonDRContainer.style.maxHeight = "50px";
    poisonDRContainer.style.gap = "10px";
    poisonDRContainer.style.caretColor = 'black';

    const poisonDRLabel = document.createElement('strong');
    poisonDRLabel.textContent = 'Poison DR';
    poisonDRLabel.style.color = '#EFDD6F';

    const poisonDRInput = document.createElement('input');
    poisonDRInput.type = 'text';
    poisonDRInput.style.width = '50%';
    poisonDRInput.style.textAlign = 'center';
    poisonDRInput.style.backgroundColor = '#fde4c9';
    poisonDRInput.style.border = '1px solid black';
    poisonDRInput.style.borderRadius = '5px';
    poisonDRInput.style.color = 'black';

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
    armorSectionsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
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
    "Fallout RPG/Items/Apparel",
    "Fallout RPG/Items/Consumables",
    "Fallout RPG/Items/Tools and Utilities",
    "Fallout RPG/Items/Weapons",
    "Fallout RPG/Perks/Book Perks"
];
const DESCRIPTION_LIMIT = 100; // Character limit for descriptions

let cachedGearData = null; // Global cache for gear data

async function fetchGearData() {
    if (cachedGearData) return cachedGearData; // ✅ Use cache if available

    let allFiles = await app.vault.getFiles();
    let gearFiles = allFiles.filter(file => SEARCH_FOLDERS.some(folder => file.path.startsWith(folder)));

    let gearItems = await Promise.all(gearFiles.map(async (file) => {
        let content = await app.vault.read(file);

        let stats = {
            name: `[[${file.basename}]]`,
            qty: "1", // Default quantity
            description: "No description available",
            selected: false // Default selected state

        };

        let statblockMatch = content.match(/```statblock([\s\S]*?)```/);
        if (!statblockMatch) return stats;

        let statblockContent = statblockMatch[1].trim();

        let costMatch = statblockContent.match(/cost:\s*(.+)/i);
			if (costMatch) {
			    stats.cost = costMatch[1].trim().replace(/\"/g, '');
			}
		
        return stats;
    }));

    cachedGearData = gearItems.filter(g => g); // ✅ Store results in cache
    return cachedGearData;
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
            if (!gear.hasOwnProperty('selected')) {
    gear.selected = false; // Default selected state
}

        }
    });

    return gearList;
}


function addGearToTable(gear, tbody, gearList) {
    let row = document.createElement('tr');

    // ✅ Create a cell for the checkbox
    let checkboxTd = document.createElement('td');
    checkboxTd.style.textAlign = 'center';

    let selectCheckbox = document.createElement('input');
    selectCheckbox.type = 'checkbox';
    selectCheckbox.checked = gear.selected;

    selectCheckbox.addEventListener('change', () => {
        gear.selected = selectCheckbox.checked;
        saveGearTableState(gearList);
    });

    checkboxTd.appendChild(selectCheckbox);
    row.appendChild(checkboxTd); // ✅ Append checkbox column first

    ["name", "qty", "cost"].forEach((key) => {
        const td = document.createElement('td');
        td.style.textAlign = 'left';
        td.style.cursor = 'pointer';
        td.dataset.editing = "false";

        const value = gear[key] || (key === "qty" ? "1" : "");

        td.addEventListener('click', (event) => {
            if (event.target.tagName === "A" || event.target.tagName === "INPUT") return;
            enableEditing(td, key, gear, gearList);
        });

        function enableEditing(td, key, gear, gearList) {
            if (td.dataset.editing === "true") return;

            td.dataset.editing = "true";

            let input = document.createElement('input');
            input.type = key === "qty" ? "number" : "text";
            input.value = gear[key] || "";
            input.style.width = '100%';
            input.style.border = 'none';
            input.style.background = '#fde4c9';
            input.style.color = 'black';
            input.style.caretColor = 'black';
            if (key === "qty") input.min = "1";

            function saveAndClose() {
                let newValue = input.value.trim();
                if (key === "qty" && (isNaN(newValue) || newValue < 1)) {
                    newValue = "1";
                }

                gear[key] = newValue;
                saveGearTableState(gearList);
                td.dataset.editing = "false";

                td.innerHTML = '';
                renderDisplay();
            }

            input.addEventListener('keydown', (event) => {
                if (event.key === "Enter" || event.key === "Escape") {
                    input.blur();
                }
            });

            input.addEventListener('blur', saveAndClose);

            td.innerHTML = '';
            td.appendChild(input);
            input.focus();
        }

        function renderDisplay() {
            let displayText = document.createElement('span');
            displayText.innerHTML = value.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
            displayText.style.cursor = 'pointer';

            displayText.addEventListener('click', (event) => {
                if (event.target.tagName !== "A") {
                    enableEditing(td, key, gear, gearList);
                }
            });

            td.appendChild(displayText);
        }

        renderDisplay();
        row.appendChild(td);
    });

    let removeTd = document.createElement('td');
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
    container.style.border = '3px solid #2e4663';
    container.style.borderRadius = '8px';
    container.style.backgroundColor = '#325886';
    container.style.overflowX = 'auto';
    container.style.width = '100%';
    container.style.whiteSpace = "nowrap";
    container.style.caretColor = 'black';

    const title = document.createElement('h2');
    title.textContent = "Gear";
    title.style.color = "#efdd6f";
    container.appendChild(title);
    
        // Search Input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for gear...';
    searchInput.style.padding = '5px';
    searchInput.style.width = '100%';
    searchInput.style.backgroundColor = '#fde4c9';
    searchInput.style.borderRadius = '5px';
    searchInput.style.border = '1px solid black'
    searchInput.style.color = 'black';
    container.appendChild(searchInput);

    const searchResults = document.createElement('div');
    searchResults.style.border = '1px solid #ccc';
    searchResults.style.backgroundColor = '#fde4c9';
    searchResults.style.padding = '5px';
    searchResults.style.display = 'none';
    searchResults.style.color = 'black';
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

	searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // Optionally auto-select first result or hide results
        let firstResult = searchResults.querySelector('div');
        if (firstResult) firstResult.click();
        searchInput.blur();
    }

    if (event.key === 'Escape') {
        // Clear and close search
        searchInput.value = '';
        searchInput.blur();
        searchResults.style.display = 'none';
    }
    
});

	searchInput.addEventListener('blur', () => {
	    // Delay hiding slightly in case a result was just clicked
	    setTimeout(() => {
	         searchInput.value = '';
	        searchResults.style.display = 'none';
	    }, 200);
	});

    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ["","Name", "Qty", "Cost", "Remove"].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
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
    "Fallout RPG/Perks/Core Rulebook",
    "Fallout RPG/Perks/Settlers",
    "Fallout RPG/Perks/Wanderers",
    "Fallout RPG/Perks/Weapons",
    "Fallout RPG/Perks/Book Perks"
];
const DESCRIPTION_LIMIT = 999999; // Character limit for descriptions

let cachedPerkData = null;
async function fetchPerkData() {
    if (cachedPerkData) return cachedPerkData; // Use cached data

    let allFiles = await app.vault.getFiles();
    let perkFiles = allFiles.filter(file => SEARCH_FOLDERS.some(folder => file.path.startsWith(folder)));

    let perkItems = await Promise.all(perkFiles.map(async (file) => {
        let content = await app.vault.read(file);

        let stats = {
            name: `[[${file.basename}]]`,
            qty: "1",
            description: "No description available"
        };

        let rankMatch = content.match(/Ranks:\s*(\d+)/);
        let rankValue = rankMatch ? rankMatch[1] : "1";

        let descStart = content.indexOf("Ranks:");
        if (descStart !== -1) {
            let descContent = content.substring(descStart).split("\n").slice(1).join(" ").trim();
            stats.description = descContent.length > DESCRIPTION_LIMIT 
                ? descContent.substring(0, DESCRIPTION_LIMIT) + "..."
                : descContent;
        }

        return stats;
    }));

    cachedPerkData = perkItems.filter(g => g); // Cache the result
    return cachedPerkData;
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

    ["name", "qty", "description"].forEach((key) => {
        const td = document.createElement('td');
        td.style.textAlign = 'left';
        td.style.cursor = 'pointer';
        td.dataset.editing = "false";

        const value = perk[key] || (key === "qty" ? "1" : "");

    td.addEventListener('click', (event) => {
        if (event.target.tagName === "A" || event.target.tagName === "INPUT") return;
        enableEditing(td, key, perk, perkList);
    });



    function enableEditing(td, key, perk, perkList) {
    if (td.dataset.editing === "true") return;

    td.dataset.editing = "true";

    let input = document.createElement('input');
    input.type = key === "qty" ? "number" : "text";
    input.value = perk[key] || "";
    input.style.width = '100%';
    input.style.border = 'none';
    input.style.background = '#fde4c9';
    input.style.color = 'black';
    input.style.caretColor = 'black';
    if (key === "qty") input.min = "1";

    function saveAndClose() {
        let newValue = input.value.trim();
        if (key === "qty" && (isNaN(newValue) || newValue < 1)) {
            newValue = "1";
        }
        if (key === "description" && newValue.length > DESCRIPTION_LIMIT) {
            newValue = newValue.substring(0, DESCRIPTION_LIMIT) + "...";
        }

        perk[key] = newValue;
        savePerkTableState(perkList);
        td.dataset.editing = "false";

        // Re-render the cell content
        td.innerHTML = newValue.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
        td.style.cursor = 'pointer';
    }

    input.addEventListener('keydown', (event) => {
        if (event.key === "Enter" || event.key === "Escape") {
            input.blur();
        }
    });

    input.addEventListener('blur', saveAndClose);

    td.innerHTML = '';
    td.appendChild(input);
    input.focus();
}

	

	
	        let displayText = document.createElement('span');
	        displayText.innerHTML = value.replace(/\[\[(.*?)\]\]/g, '<a class="internal-link" href="$1">$1</a>');
	        displayText.style.cursor = 'pointer';
	        displayText.onclick = enableEditing;
	
			td.style.textAlign = 'left';
	     
	        td.appendChild(displayText);
	        row.appendChild(td);
	    });
	
	    let removeTd = document.createElement('td');
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
    container.style.border = '3px solid #2e4663';
    container.style.borderRadius = '8px'
    container.style.backgroundColor = '#325886';
    container.style.overflowX = 'auto';
    container.style.width = '100%';
    container.style.caretColor = 'black';

    const title = document.createElement('h2');
    title.textContent = "Perks and Traits";
    title.style.color = "#efdd6f";
    container.appendChild(title);
    
        // Search Input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for perk...';
    searchInput.style.padding = '5px';
    searchInput.style.width = '100%';
    searchInput.style.backgroundColor = '#fde4c9'
    searchInput.style.color = 'black';
    searchInput.style.borderRadius = '5px';
    searchInput.style.border = '1px solid black'
    container.appendChild(searchInput);

    const searchResults = document.createElement('div');
    searchResults.style.border = '1px solid #ccc';
    searchResults.style.backgroundColor = '#fde4c9';
    searchResults.style.padding = '5px';
    searchResults.style.display = 'none';
    searchResults.style.color = 'black';
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

	searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // Optionally auto-select first result or hide results
        let firstResult = searchResults.querySelector('div');
        if (firstResult) firstResult.click();
        searchInput.blur();
    }

    if (event.key === 'Escape') {
        // Clear and close search
        searchInput.value = '';
        searchInput.blur();
        searchResults.style.display = 'none';
    }
    
});

	searchInput.addEventListener('blur', () => {
	    // Delay hiding slightly in case a result was just clicked
	    setTimeout(() => {
	         searchInput.value = '';
	        searchResults.style.display = 'none';
	    }, 200);
	});

    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ["Name", "Rank", "Description", "Remove"].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
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