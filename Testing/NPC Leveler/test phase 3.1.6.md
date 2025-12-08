```js-engine

return await (async function () {
// PHASE 3.1 — Fallout 2d20 Manual Leveling Tool with Live Stat Updates
const BASE_PATH = "Fallout RPG/Creatures and NPCs/Statblocks";

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
const resultBlock = document.createElement("pre");
resultBlock.style.whiteSpace = "pre-wrap";
resultBlock.style.background = "#1a1a1a";
resultBlock.style.color = "#fde4c9";
resultBlock.style.padding = "10px";
resultBlock.style.borderRadius = "6px";

let npc = null;
let original = null;
let upgrades = {};
let skillUpgrades = {};
let availableAttributePoints = 0;
let availableSkillPoints = 0;

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
    applyUpgradePlan();
});

const toggleView = createButton("Toggle View", () => {
    viewOriginal = !viewOriginal;
    renderUpgrades();
});
const resetButton = createButton("Reset Upgrades", () => {
    upgrades = {};
    skillUpgrades = {};
    renderUpgrades();
});

let viewOriginal = false;
container.append(levelInput.label, levelInput.input, folderSelect.label, folderSelect.input, fileSelect.label, fileSelect.input, compareButton, toggleView, resetButton, upgradeArea, resultBlock);
return container;

// === Functions ===

function parseYAML(text) {
    const lines = text.split("\n");
    const obj = {};
    let currentKey = null;
    let currentListItem = null;

    for (let rawLine of lines) {
        const line = rawLine.trim();

        // Handle - name: X under a list
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

        // Handle continuation lines (e.g., desc: under list item)
        else if (line.includes(":") && currentListItem) {
            const [k, ...v] = line.split(":");
            if (k && v.length) {
                currentListItem[k.trim()] = v.join(":").trim().replace(/"/g, "");
            }
        }

        // Handle top-level key: value or start of a list
        else if (line.includes(":")) {
            const [k, ...v] = line.split(":");
            const key = k.trim().toLowerCase();
            const value = v.join(":").trim().replace(/"/g, "");

            const nextLine = lines[lines.indexOf(rawLine) + 1]?.trim();
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


function renderUpgrades() {

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

    if (!npc) return;

    const temp = structuredClone(npc);
    const stats = ["strength", "per", "end", "cha", "int", "agi", "lck", "body_attr", "mind"];
    const attrContainer = document.createElement("div");

	const attrLabel = document.createElement("div");
	attrLabel.innerHTML = `<strong>Attributes</strong>`;
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

        // Label text
        const labelDiv = document.createElement("div");
        labelDiv.innerHTML = (added > 0)
            ? `<strong style="color:#FFC200">${label}: ${base} → ${current}</strong>`
            : `${label}: ${current}`;

        // Buttons in row
        const buttonRow = document.createElement("div");
        buttonRow.style.display = "flex";
        buttonRow.style.gap = "4px";
        buttonRow.style.marginBottom = "20px";

        const plus = createButton("+", () => {
            if (getUsedAttributePoints() < availableAttributePoints) {
                upgrades[stat] = (upgrades[stat] || 0) + 1;
                renderUpgrades();
            }
        });

        const minus = createButton("-", () => {
            if ((upgrades[stat] || 0) > 0) {
                upgrades[stat]--;
                renderUpgrades();
            }
        });

        buttonRow.append(plus, minus);
        cell.append(labelDiv, buttonRow);
        attrGrid.appendChild(cell);
        temp[stat] = current;
    }

        attrContainer.appendChild(attrGrid);
    }

    const skillContainer = document.createElement("div");
    skillContainer.innerHTML = `<strong>Skills</strong>`;

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
		
		    const minus = createButton("-", () => {
		        if ((skillUpgrades[skillKey] || 0) > 0) {
		            skillUpgrades[skillKey]--;
		            renderUpgrades();
		        }
		    });
		
		    buttonRow.append(plus, minus);
		    row.append(labelDiv, buttonRow);
		    skillGrid.appendChild(row);
		}
		skillContainer.appendChild(skillGrid);
		
	}


    const derived = calculateDerived(temp);  // includes isCreature

const derivedBlock = document.createElement("div");
derivedBlock.innerHTML = `<strong>Derived Stats</strong><br>
    HP: ${derived.hp.base} → ${derived.hp.total}<br>
    Initiative: ${derived.initiative}<br>
    Defense: ${derived.defense}`;

// ✅ Only show melee damage for characters
if (!derived.isCreature) {
    derivedBlock.innerHTML += `<br>Melee Damage: ${derived.melee}`;
}

upgradeArea.innerHTML = "";
upgradeArea.append(attrContainer, skillContainer, derivedBlock);

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
	    // ✅ Use original.hp as base
	    hp.total = hp.base + levelGain;
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

    return { hp, initiative, defense: def, melee, isCreature };
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
    } else if (typeof obj === "object") {
        return Object.entries(obj).map(([k, v]) => {
            return typeof v === "object"
                ? `${indent}${k}:\n${yamlify(v, indent + "  ")}`
                : `${indent}${k}: ${v}`;
        }).join("\n");
    }
    return `${indent}${obj}`;
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
    const options = allFiles.filter(f => f.path.startsWith(val) && f.path.endsWith(".md"));
    for (const f of options) {
        fileSelect.input.append(new Option(f.basename, f.path));
    }
}

function createButton(text, handler) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.marginLeft = "8px";
    btn.style.backgroundColor = "#FFC200";
    btn.style.color = "black";
    btn.style.padding = "3px 8px";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.onclick = handler;
    return btn;
}

return container;
})();

```