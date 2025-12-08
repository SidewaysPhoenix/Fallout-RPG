```js-engine

return await (async function () {
// PHASE 3.1 — Fallout 2d20 Manual Leveling Tool with Live Stat Updates
const BASE_PATH = "Fallout-RPG/Creatures and NPCs/Statblocks";
let creatureDamageUpgrades = {};  // attackIndex → number of D6 upgrades
let characterWeaponUpgrades = 0;
let characterArmorUpgrades = 0;

// == UI Setup ==
const container = document.createElement("div");
container.style.padding = "10px";
container.style.backgroundColor = "#325886";
container.style.borderRadius = "8px";
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.gap = "12px";
container.style.color = "#EFDD6F";
container.style.maxWidth = "800px";

const levelInput = createLabeledNumber("Player Level", 1);
const folderSelect = createLabeledDropdown("NPC Category");
const fileSelect = createLabeledDropdown("Choose NPC File");

const upgradeArea = document.createElement("div");
upgradeArea.style.display = "none";
const resultBlock = document.createElement("pre");
resultBlock.style.whiteSpace = "pre-wrap";
resultBlock.style.background = "#012300";
resultBlock.style.color = "#4ee44a";
resultBlock.style.padding = "10px";
resultBlock.style.borderRadius = "6px";

let npc = null;
let upgradedNPC = null;
let original = null;
let upgrades = {};
let skillUpgrades = {};
let availableAttributePoints = 0;
let availableSkillPoints = 0;
let creatureDRUpgrades = {
    phys: 0,
    energy: 0,
    rad: 0
};


function titleCase(str) {
    return str.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
}

const validSkillNames = [
    "athletics", "barter", "big guns", "energy weapons", "explosives",
    "lockpick", "medicine", "melee weapons", "pilot", "repair", "science",
    "small guns", "sneak", "speech", "survival", "throwing", "unarmed"
];

// === INIT ===
const allFiles = app.vault.getFiles();
const folders = new Set();
	for (let f of allFiles) {
	    if (f.path.startsWith(BASE_PATH) && f.path.endsWith(".md")) {
	        folders.add(f.path.split("/").slice(0, -1).join("/"));
	    }
	}
	for (let f of Array.from(folders).sort()) {
	    folderSelect.input.append(new Option(f.replace(BASE_PATH + "/", ""), f));
	}
	folderSelect.input.onchange = updateFileDropdown;
	folderSelect.input.style.backgroundColor = "#fde4c9";
	folderSelect.input.style.color = "black";
	await updateFileDropdown();

const compareButton = createButton("Load NPC", async () => {
    const path = fileSelect.input.value;
    const file = app.vault.getAbstractFileByPath(path);
    const content = await app.vault.read(file);
    const statMatch = content.match(/```statblock([\s\S]*?)```/);
    if (!statMatch) return resultBlock.textContent = "No statblock found.";

    const yaml = statMatch[1].trim();
    npc = parseYAML(yaml);
    original = structuredClone(npc);
    upgrades = {};
	skillUpgrades = {};
    creatureDamageUpgrades = {};
    creatureDRUpgrades = { phys: 0, energy: 0, rad: 0 };
    characterWeaponUpgrades = 0;
	characterArmorUpgrades = 0;
    applyUpgradePlan();
    resetButton.style.display = "";
	upgradeArea.style.display = "";
	yamlDiv.style.display = "";

});
compareButton.style.backgroundColor = "#ffc200";
compareButton.style.color = "black";
compareButton.style.alignSelf = "center";
compareButton.style.width = "60%";

const exportButton = createButton("📋 Export Upgraded YAML", async () => {
    if (!upgradedNPC) {
        exportButton.textContent = "❌ No NPC Loaded";
        return;
    }
    const upgradedYAML = "```statblock\n" + yamlify(upgradedNPC) + "\n```";
    try {
        await navigator.clipboard.writeText(upgradedYAML);
        exportButton.textContent = "✅ Copied!";
        setTimeout(() => {
            exportButton.textContent = "📋 Export Upgraded YAML";
        }, 1500);
    } catch (err) {
        exportButton.textContent = "❌ Failed to Copy";
    }
});
exportButton.style.maxWidth = "40%";
exportButton.style.marginBottom = "1"
exportButton.style.backgroundColor = "#ffc200"
exportButton.style.color = "black";

const toggleView = createButton("Toggle View", () => {
    viewOriginal = !viewOriginal;
    renderUpgrades();
});
toggleView.style.backgroundColor = "#ffc200";
toggleView.style.color = "black";
toggleView.style.maxWidth = "20%";
toggleView.style.marginLeft = "0";

const resetButton = createButton("Reset Upgrades", () => {
    upgrades = {};
    skillUpgrades = {};
    renderUpgrades();
});
resetButton.style.marginTop = "10px"
resetButton.style.color = "black";
resetButton.style.maxWidth = "40%";
resetButton.style.display = "none";
resetButton.style.justifySelf = "right";
resetButton.style.marginLeft = "0";
resetButton.style.backgroundColor = "#b6b6b6";
resetButton.style.border = "1px transparent #ccc";
resetButton.style.marginBottom = "10px";

const yamlDiv = document.createElement("div");
yamlDiv.appendChild(toggleView)
yamlDiv.appendChild(exportButton);
yamlDiv.appendChild(resultBlock);
yamlDiv.style.display = "none";

let viewOriginal = false;
container.append(levelInput.label, levelInput.input, folderSelect.label, folderSelect.input, fileSelect.label, fileSelect.input, compareButton, upgradeArea, yamlDiv);
return container;

// === Functions ===

function parseYAML(text) {
    const lines = text.split("\n");
    const obj = {};
    let currentKey = null;
    let currentListItem = null;

    for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        const line = rawLine.trim();

        // Start of a list item
        if (line.startsWith("- ")) {
            if (!Array.isArray(obj[currentKey])) obj[currentKey] = [];
            const entry = {};
            const [k, ...v] = line.slice(2).split(":");
            if (k && v.length) {
                entry[k.trim()] = v.join(":").trim().replace(/"/g, "");
                obj[currentKey].push(entry);
                currentListItem = entry;
            }
        }

        // Continuation line for a list item
        else if (line.includes(":") && currentListItem && rawLine.startsWith("  ")) {
            const [k, ...v] = line.split(":");
            if (k && v.length) {
                currentListItem[k.trim()] = v.join(":").trim().replace(/"/g, "");
            }
        }

        // New top-level key (not part of list)
        else if (line.includes(":")) {
            const [k, ...v] = line.split(":");
            const key = k.trim().toLowerCase();
            const value = v.join(":").trim().replace(/"/g, "");

            const nextLine = lines[i + 1]?.trim();
            if (nextLine?.startsWith("- ")) {
                obj[key] = [];
                currentKey = key;
                currentListItem = null;
            } else {
                obj[key] = value;
                currentKey = key;
                currentListItem = null;
            }
        }
    }

    return obj;
}





function applyUpgradePlan() {
    const playerLevel = parseInt(levelInput.input.value);
    const npcLevel = parseInt(npc.level || 0);
    const diff = playerLevel - npcLevel;

    availableAttributePoints = Math.floor((diff + 1) / 2);
    availableSkillPoints = npc.type?.toLowerCase().includes("character") ? diff : 0;

    renderUpgrades();
}


// Parse a DR field
function parseDR(raw) {
    if (raw == null) return { value: 0, isImmune: false };
    const str = raw.toString().trim().toLowerCase();

    if (str === "immune") return { value: 0, isImmune: true };
    if (str === "-" || str === "") return { value: 0, isImmune: false };

    return { value: 1, isImmune: false };
}


// Upgrade a DR field
function upgradeDRString(drStr, amount) {
    if (!drStr || drStr.trim() === "-" || drStr.trim() === "") {
        return `${amount} (All)`; // ✅ Upgrade from "-" or blank to "1 (All)"
    }
    if (drStr.toLowerCase().includes("immune")) {
        return drStr; // No change for immune
    }

    return drStr.replace(/(\d+)/g, (_, num) => `${parseInt(num) + amount}`);
}



function renderUpgrades() {
	const isCreature = npc.type?.toLowerCase().includes("creature");


	const statLabels = {
    strength: "STR",
    per: "PER",
    end: "END",
    cha: "CHA",
    int: "INT",
    agi: "AGI",
    lck: "LCK",
    body_attr: "BODY",
    mind: "MIND"
	};
	
	const attrNameMap = {
    STR: "strength",
    PER: "per",
    END: "end",
    CHA: "cha",
    INT: "int",
    AGI: "agi",
    LCK: "lck",
    BODY: "body_attr",
    MIND: "mind"
	};


    if (!npc) return;

    const temp = structuredClone(npc);
    upgradedNPC = temp;
    const stats = ["strength", "per", "end", "cha", "int", "agi", "lck", "body_attr", "mind"];
    const attrContainer = document.createElement("div");
		attrContainer.style.marginTop = "20px";
		
	const attrLabel = document.createElement("div");
	attrLabel.innerHTML = `<strong style = "font-size:14px; color:#FFC200;">Attributes</strong>`;
	attrContainer.appendChild(attrLabel);
	
	const attrPointsLeft = availableAttributePoints - getUsedAttributePoints();
	if (attrPointsLeft > 0) {
	    const attrPointsNote = document.createElement("div");
	    attrPointsNote.innerHTML = `<em style="color:#FFC200">Points Left: ${attrPointsLeft}</em>`;
	    attrContainer.appendChild(attrPointsNote);
	}
	
	// 💠 Grid wrapper
	const attrGrid = document.createElement("div");
	attrGrid.style.display = "grid";
	attrGrid.style.gridTemplateColumns = "repeat(7, 1fr)";
	attrGrid.style.gap = "8px";
	attrGrid.style.marginTop = "8px";
	attrGrid.style.alignItems = "center";
	attrGrid.style.justifyItems = "center";



    for (let stat of stats) {
    if (temp[stat] !== undefined) {
        const base = parseInt(original[stat]);
        const added = upgrades[stat] || 0;
        const current = base + added;
        const label = statLabels[stat] || stat.toUpperCase();

        // Create grid cell
        const cell = document.createElement("div");
        cell.style.display = "flex";
        cell.style.flexDirection = "column";
        cell.style.alignItems = "center";
        cell.style.justifyContent = "center";
        cell.style.gap = "4px";
        cell.style.justifySelf = "center;"
        
        // Label text
        const labelDiv = document.createElement("div");
        labelDiv.innerHTML = (added > 0)
            ? `<strong style="color:#FFC200">${label}: ${base} → ${current}</strong>`
            : `${label}: ${current}`;

        // Buttons in row
        const buttonRow = document.createElement("div");
        buttonRow.style.display = "flex";
        buttonRow.style.gap = "8px";
        buttonRow.style.marginBottom = "20px";
        buttonRow.style.justifyContent = "center"; 
        buttonRow.style.width = "100%";
        

        const plus = createButton("+", () => {
            if (getUsedAttributePoints() < availableAttributePoints) {
                upgrades[stat] = (upgrades[stat] || 0) + 1;
                renderUpgrades();
            }
        });
		plus.style.marginLeft = "0";
		plus.style.width = "24px"
		
        const minus = createButton("-", () => {
            if ((upgrades[stat] || 0) > 0) {
                upgrades[stat]--;
                renderUpgrades();
            }
        });
		minus.style.marginLeft = "0";
		minus.style.width = "24px"
	
        buttonRow.append(plus, minus);
        cell.append(labelDiv, buttonRow);
        attrGrid.appendChild(cell);
        temp[stat] = current;
    }

        attrContainer.appendChild(attrGrid);
    }

    const skillContainer = document.createElement("div");
    skillContainer.style.marginTop = "20px";
    skillContainer.innerHTML = `<strong style = "font-size:14px; color:#FFC200;">Skills</strong>`;

	const skillPointsLeft = availableSkillPoints - getUsedSkillPoints();
		if (skillPointsLeft > 0) {
		    const skillPointsNote = document.createElement("div");
		    skillPointsNote.innerHTML = `<em style="color:#FFC200">Points Left: ${skillPointsLeft}</em>`;
		    skillContainer.appendChild(skillPointsNote);
		}
    
    if (original.skills && Array.isArray(original.skills)) {
	    const skillGrid = document.createElement("div");
		skillGrid.style.display = "grid";
		skillGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
		skillGrid.style.gap = "8px";
		skillGrid.style.marginTop = "8px";
		skillGrid.style.alignItems = "center";
		
		// Mapping existing skills
		const skillMap = Object.fromEntries(
		    (original.skills || []).map(s => [s.name?.toLowerCase(), s])
		);
		
		for (let skillKey of validSkillNames) {
		    const s = skillMap[skillKey] || { name: titleCase(skillKey), desc: "0" };
		    const base = parseInt((s.desc || "").match(/\d+/)?.[0] || "0");
		    const added = skillUpgrades[skillKey] || 0;
		    const total = base + added;
		
		    // Skill row container
		    const row = document.createElement("div");
		    row.style.display = "flex";
		    row.style.justifyContent = "space-between";
		    row.style.alignItems = "center";
		    row.style.borderBottom = "2px solid rgba(255,255,255,0.2)";
		    row.style.padding = "5px 15px"; 
		
		    const labelText = (added > 0)
		        ? `<strong style="color:#FFC200">${s.name}: ${base} → ${total}</strong>`
		        : `${s.name}: ${total}`;
		
		    const labelDiv = document.createElement("div");
		    labelDiv.innerHTML = labelText;
		
		    const buttonRow = document.createElement("div");
		    buttonRow.style.display = "flex";
		    buttonRow.style.gap = "1px";
		
		    const plus = createButton("+", () => {
		        if (getUsedSkillPoints() < availableSkillPoints && total < 6) {
		            skillUpgrades[skillKey] = (skillUpgrades[skillKey] || 0) + 1;
		            renderUpgrades();
		        }
		    });
			plus.style.width = "24px"
		
		    const minus = createButton("-", () => {
		        if ((skillUpgrades[skillKey] || 0) > 0) {
		            skillUpgrades[skillKey]--;
		            renderUpgrades();
		        }
		    });
		    minus.style.width = "24px"
		
		    buttonRow.append(plus, minus);
		    row.append(labelDiv, buttonRow);
		    skillGrid.appendChild(row);
		}
		skillContainer.appendChild(skillGrid);
	}


    const derived = calculateDerived(temp);  // includes isCreature
		const levelGain = derived.levelGain;
		temp.hp = derived.hp.total;
		temp.initiative = derived.initiative;
		temp.defense = derived.defense;
		if (!derived.isCreature) {
		    temp.melee_damage = derived.melee;
		}

	const derivedBlock = document.createElement("div");
		derivedBlock.innerHTML = `
    <strong style="font-size:14px; color:#FFC200;">Derived Stats</strong><br>
    <div style="margin-left:8px;">
        HP: ${derived.hp.base} → ${derived.hp.total}<br>
        Initiative: ${derived.initiative}<br>
        Defense: ${derived.defense}
        ${!derived.isCreature ? `<br>Melee Damage: ${derived.melee}` : ""}
    </div>
`;

		derivedBlock.style.marginTop = "20px"
		derivedBlock.style.border = "1px solid grey";
		derivedBlock.style.width = "150px";
		derivedBlock.style.borderRadius = "5px";
		derivedBlock.style.padding = "5px"
		derivedBlock.style.backgroundColor = "#2e4663"
		
		upgradeArea.innerHTML = "";
		upgradeArea.appendChild(attrContainer);
		
		if (!isCreature) {
		    upgradeArea.appendChild(skillContainer);
		}
		
		upgradeArea.appendChild(resetButton);
		upgradeArea.appendChild(derivedBlock);

	if (!temp.skills) temp.skills = [];

	const skillMap = Object.fromEntries(
	    (temp.skills || []).map(s => [s.name?.toLowerCase(), s])
	);

	for (let skillKey of Object.keys(skillUpgrades)) {
	    const added = skillUpgrades[skillKey] || 0;
	    if (added === 0) continue;
	
	    const existing = skillMap[skillKey];
	    const base = existing ? parseInt((existing.desc || "0").match(/\d+/)?.[0] || "0") : 0;
	    const updatedDesc = `${base + added}` + (existing?.desc?.includes("⬛") ? " ⬛" : "");
	
	    if (existing) {
	        existing.desc = updatedDesc;
	    } else {
	        temp.skills.push({ name: titleCase(skillKey), desc: updatedDesc });
	    }
	}

		if (temp.attacks && Array.isArray(temp.attacks)) {
	    for (let attack of temp.attacks) {
	        let match = attack.name?.match(/text\((.*?):\s*(\w+)\s*\+\s*([\w\s]+)\s*\(TN\s*(\d+)\)\)/i);
	        if (match) {
	            const [, attackName, attrKey, skillKey] = match;
	
	            const attr = parseInt(temp[attrNameMap[attrKey.toUpperCase()] || ""] || "0");
	            const skillKeyNorm = skillKey.trim().toLowerCase();
	            let skill = 0;

	// Character: get from skills[]
				const skillObj = (temp.skills || []).find(s => s.name?.toLowerCase() === skillKeyNorm);
				if (skillObj) {
				    skill = parseInt((skillObj.desc || "0").match(/\d+/)?.[0] || "0");
				} else if (["melee", "guns", "other"].includes(skillKeyNorm)) {
				    // Creature: use direct stat fields
				    skill = parseInt(temp[skillKeyNorm] || "0");
				}

	
	            const newTN = attr + skill;
	
	            // Rebuild the attack name with updated TN
	            attack.name = attack.name.replace(/\(TN\s*\d+\)/, `(TN ${newTN})`);
	        }
	    }
	}
	
		if (isCreature && levelGain >= 2 && Array.isArray(temp.attacks)) {
	    const bonusDice = Math.floor(levelGain / 2);
	    const upgradeTitle = document.createElement("div");
upgradeTitle.innerHTML = `<strong style="font-size:14px; color:#FFC200;">Damage Upgrades</strong>`;
upgradeTitle.style.marginTop = "20px";
upgradeArea.appendChild(upgradeTitle);

// Remaining count
const usedDice = Object.values(creatureDamageUpgrades).reduce((a, b) => a + b, 0);
const remainingDice = bonusDice - usedDice;

if (remainingDice > 0) {
    const note = document.createElement("div");
    note.innerHTML = `<em style="color:#FFC200">D6s Left: ${remainingDice}</em>`;
    upgradeArea.appendChild(note);
}

	
	    temp.attacks.forEach((atk, i) => {
	        const row = document.createElement("div");
	        row.style.display = "flex";
	        row.style.justifyContent = "space-between";
	        row.style.alignItems = "center";
	        row.style.marginBottom = "4px";
	
	        const label = document.createElement("div");
			const atkName = atk.name?.match(/text\(([^:]+):/i)?.[1] ?? "Attack";
			const bonus = creatureDamageUpgrades[i] || 0;
			
			label.innerHTML = bonus > 0
			    ? `<strong style="color:#FFC200">Upgrade "${atkName}" → +${bonus}D6</strong>`
			    : `Upgrade "${atkName}"`;

	
	        const buttonRow = document.createElement("div");
	        buttonRow.style.display = "flex";
	        buttonRow.style.gap = "4px";
	
	        const plus = createButton("+", () => {
	            const used = Object.values(creatureDamageUpgrades).reduce((a, b) => a + b, 0);
	            if (used < bonusDice) {
	                creatureDamageUpgrades[i] = (creatureDamageUpgrades[i] || 0) + 1;
	                renderUpgrades();
	            }
	        });
	
	        const minus = createButton("-", () => {
	            if ((creatureDamageUpgrades[i] || 0) > 0) {
	                creatureDamageUpgrades[i]--;
	                renderUpgrades();
	            }
	        });
	
	        buttonRow.append(plus, minus);
	        row.append(label, buttonRow);
	        upgradeArea.appendChild(row);
	    });
	}
		if (isCreature && Array.isArray(temp.attacks)) {
	    for (let [i, amount] of Object.entries(creatureDamageUpgrades)) {
	        const atk = temp.attacks[i];
	        atk.desc = atk.desc.replace(
	            /(\d+)\s*D6/i,
	            (match, num) => `${parseInt(num) + amount} D6`
	        );
	    }
	}

	if (isCreature && levelGain >= 2) {
    const bonusDR = Math.floor(levelGain / 2);

    const upgradeTitle = document.createElement("div");
    upgradeTitle.innerHTML = `<strong style="font-size:14px; color:#FFC200;">DR Upgrades</strong>`;
    upgradeTitle.style.marginTop = "20px";
    upgradeArea.appendChild(upgradeTitle);

    const used = Object.values(creatureDRUpgrades).reduce((a, b) => a + b, 0);
    const remaining = bonusDR - used;

    if (remaining > 0) {
        const note = document.createElement("div");
        note.innerHTML = `<em style="color:#FFC200">Upgrades Left: ${remaining}</em>`;
        upgradeArea.appendChild(note);
    }

	    // DR types to upgrade
	    const drTypes = ["Physical", "Energy", "Radiation"];
		const keyMap = {
		    "Physical": "phys",
		    "Energy": "energy",
		    "Radiation": "rad"
		};
		
		drTypes.forEach(type => {
		    const typeKey = keyMap[type];
		
		    // ✅ Skip showing if Immune
		    const fieldName = typeKey === "phys" ? "phys_dr" :
		                      typeKey === "energy" ? "energy_dr" :
		                      "rad_dr";
		
		    const fieldValue = original[fieldName] ?? "-";
		    if (fieldValue.toString().toLowerCase().includes("immune")) {
		        return; // ⬅️ Skip creating buttons for Immune types
		    }
		
		    // 🔽 [Create the normal label/button UI as you already do]
		    const row = document.createElement("div");
		    row.style.display = "flex";
		    row.style.justifyContent = "space-between";
		    row.style.alignItems = "center";
		    row.style.marginBottom = "4px";
		
		    const label = document.createElement("div");
		    const bonus = creatureDRUpgrades[typeKey] || 0;
		    label.innerHTML = bonus > 0
		        ? `<strong style="color:#FFC200">${type} DR → +${bonus}</strong>`
		        : `${type} DR`;
		
		    const buttonRow = document.createElement("div");
		    buttonRow.style.display = "flex";
		    buttonRow.style.gap = "4px";
		
		    const plus = createButton("+", () => {
		        const used = Object.values(creatureDRUpgrades).reduce((a, b) => a + b, 0);
		        if (used < bonusDR) {
		            creatureDRUpgrades[typeKey] = (creatureDRUpgrades[typeKey] || 0) + 1;
		            renderUpgrades();
		        }
		    });
		
		    const minus = createButton("-", () => {
		        if ((creatureDRUpgrades[typeKey] || 0) > 0) {
		            creatureDRUpgrades[typeKey]--;
		            renderUpgrades();
		        }
		    });
		
		    buttonRow.append(plus, minus);
		    row.append(label, buttonRow);
		    upgradeArea.appendChild(row);
		});
}

		if (isCreature) {
	    if (original.phys_dr !== undefined) {
	        temp.phys_dr = upgradeDRString(original.phys_dr, creatureDRUpgrades.phys || 0);
	    }
	    if (original.energy_dr !== undefined) {
	        temp.energy_dr = upgradeDRString(original.energy_dr, creatureDRUpgrades.energy || 0);
	    }
	    if (original.rad_dr !== undefined) {
	        temp.rad_dr = upgradeDRString(original.rad_dr, creatureDRUpgrades.rad || 0);
	    }
	}
	
		if (!isCreature && levelGain >= 2) {
	    const bonusGear = Math.floor(levelGain / 2);
	
	    const upgradeTitle = document.createElement("div");
	    upgradeTitle.innerHTML = `<strong style="font-size:14px; color:#FFC200;">Gear Upgrades</strong>`;
	    upgradeTitle.style.marginTop = "20px";
	    upgradeArea.appendChild(upgradeTitle);
	
	    const gearTypes = ["Weapon", "Armor"];
	    gearTypes.forEach(type => {
	        const used = (type === "Weapon") ? characterWeaponUpgrades : characterArmorUpgrades;
	        const remaining = bonusGear - used;
	
	        const row = document.createElement("div");
	        row.style.display = "flex";
	        row.style.flexDirection = "column"; // ✅ Stack label and note vertically
		    row.style.alignItems = "flex-start";
		    row.style.marginBottom = "8px";
		    row.style.marginLeft = "8px";
	
	        const label = document.createElement("div");
	        label.innerHTML = remaining >= 0
	            ? `${type} Upgrade${bonusGear > 1 ? "s" : ""}: <strong style="color:#FFC200">${remaining} left</strong>`
	            : `${type} Upgrades: 0 left`;
			
			 const note = document.createElement("div");
			    note.style.fontSize = "12px";
			    note.style.color = "#FFC200";
			    note.style.marginBottom = "5px";
			    note.textContent = (type === "Weapon")
			        ? "Replace or mod a weapon."
			        : "Replace or mod a piece of armor or clothing.";
			
	        const buttonRow = document.createElement("div");
		        buttonRow.style.display = "flex";
		        buttonRow.style.gap = "4px";
		        buttonRow.style.marginBottom = "10px";
	        const plus = createButton("+", () => {
	            if (used < bonusGear) {
	                if (type === "Weapon") characterWeaponUpgrades++;
	                else characterArmorUpgrades++;
	                renderUpgrades();
	            }
	        });
	        plus.style.marginLeft ="0px"
	
	        const minus = createButton("-", () => {
	            if (type === "Weapon" && characterWeaponUpgrades > 0) {
	                characterWeaponUpgrades--;
	                renderUpgrades();
	            } else if (type === "Armor" && characterArmorUpgrades > 0) {
	                characterArmorUpgrades--;
	                renderUpgrades();
	            }
	        });
			minus.style.marginLeft ="0px"
	
	        buttonRow.append(plus, minus);
	        row.append(label,note, buttonRow);
	        
	        // ✅ New: Add Reminder Note
   
    
   
	        
	        
	        upgradeArea.appendChild(row);
	    });
	}


	if (!viewOriginal) {
		resultBlock.textContent = "```statblock\n" + yamlify(temp) + "\n```";
	} else {
		resultBlock.textContent = "```statblock\n" + yamlify(original) + "\n```";
	}
}

	function calculateDerived(npc) {
	    const playerLevel = parseInt(levelInput.input.value);
		const npcLevel = parseInt(original.level || "0");
		const levelGain = Math.max(playerLevel - npcLevel, 0);
	
		const isCreature = npc.type?.toLowerCase().includes("creature");
		const hp = { base: parseInt(original.hp || "0"), total: 0 };
	
		if (isCreature) {
	    const body = parseInt(npc.body_attr || "0");
	    const baseHP = parseInt(original.hp || "0");
	    hp.base = baseHP;
	
	    // ✅ Re-check BIG/LITTLE on the original statblock
	    const specials = original.special_abilities || [];
	    const big = specials.some(e =>
	        e.name?.toLowerCase().trim().replace(":", "") === "big"
	    );
	    const little = specials.some(e =>
	        e.name?.toLowerCase().trim().replace(":", "") === "little"
	    );
	
	    const bonus = (big ? levelGain : 0) - (little ? levelGain : 0);
	    hp.total = baseHP + levelGain + bonus;
		
		} else {
		    const end = parseInt(npc.end || "0");
		    const baseHP = end + npcLevel;
		    hp.base = baseHP;
		    hp.total = baseHP + levelGain;
		}

	    const initiative = isCreature
	        ? parseInt(npc.body_attr || "0") + parseInt(npc.mind || "0")
	        : parseInt(npc.per || "0") + parseInt(npc.agi || "0");
	
	    const def = parseInt(npc.agi || "0") >= 9 ? 2 : 1;
	    const str = parseInt(npc.strength || npc.body || "0");
	    let melee = "";
	    if (str >= 11) melee = "+3D6";
	    else if (str >= 9) melee = "+2D6";
	    else if (str >= 7) melee = "+1D6";
	    else melee = "+0";
	
	return { hp, initiative, defense: def, melee, isCreature, levelGain };
}




function getUsedAttributePoints() {
    return Object.values(upgrades).reduce((a, b) => a + b, 0);
}
function getUsedSkillPoints() {
    return Object.values(skillUpgrades).reduce((a, b) => a + b, 0);
}

function yamlify(obj, indent = "") {
    if (Array.isArray(obj)) {
        return obj.map(e => `${indent}- ${yamlify(e, indent + "  ").trimStart()}`).join("\n");
    } else if (typeof obj === "object" && obj !== null) {
        return Object.entries(obj).map(([k, v]) => {
            return typeof v === "object"
                ? `${indent}${k}:\n${yamlify(v, indent + "  ")}`
                : `${indent}${k}: ${quoteIfNeeded(v)}`;
        }).join("\n");
    }
    return `${indent}${quoteIfNeeded(obj)}`;
}

function quoteIfNeeded(value) {
    if (typeof value === "string") {
        // Always quote strings that aren't pure numbers or booleans
        const needsQuotes = /[^a-zA-Z0-9_]/.test(value) || value === "" || !isNaN(value);
        if (needsQuotes) {
            return `"${value.replace(/"/g, '\\"')}"`; // escape inner quotes
        }
    }
    return value;
}


function createLabeledNumber(label, def = "") {
    const input = document.createElement("input");
    input.type = "number";
    input.value = def;
    input.style.padding = "5px";
    input.style.width = "60px";
    input.style.background = "#fde4c9";
    input.style.color = "black";
    const lbl = document.createElement("label");
    lbl.textContent = label;
    lbl.style.color = "#FFC200";
    return { label: lbl, input };
}

function createLabeledDropdown(label) {
    const select = document.createElement("select");
    select.style.padding = "5px";
    const lbl = document.createElement("label");
    lbl.textContent = label;
    lbl.style.color = "#FFC200";
    return { label: lbl, input: select };
}

async function updateFileDropdown() {
    const val = folderSelect.input.value;
    fileSelect.input.innerHTML = "";
    fileSelect.input.style.backgroundColor = "#fde4c9";
	fileSelect.input.style.color = "black";

    const options = allFiles
        .filter(f => f.path.startsWith(val) && f.path.endsWith(".md"))
        .sort((a, b) => a.basename.localeCompare(b.basename)); // ✅ alphabetical sort

    for (const f of options) {
        fileSelect.input.append(new Option(f.basename, f.path));
    }
}


function createButton(text, handler) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.marginLeft = "8px";
    btn.style.backgroundColor = "#2e4663";
    btn.style.color = "#ffc200";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.style.border = "1px solid grey";
    btn.onclick = handler;
    return btn;
}

return container;
})();

```