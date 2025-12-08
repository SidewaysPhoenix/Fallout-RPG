```js-engine
const BASE_PATH = "Fallout RPG/Creatures and NPCs/Statblocks";

async function renderLevelComparisonUI() {
    const container = document.createElement("div");
    container.style.padding = "10px";
    container.style.border = "3px solid #2e4663";
    container.style.borderRadius = "8px";
    container.style.backgroundColor = "#325886";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    container.style.maxWidth = "600px";
    container.style.color = "#EFDD6F";

    const levelInputLabel = document.createElement("label");
    levelInputLabel.textContent = "Player Level:";
    levelInputLabel.style.color = "#FFC200";

    const levelInput = document.createElement("input");
    levelInput.type = "number";
    levelInput.min = "1";
    levelInput.value = "1";
    levelInput.style.backgroundColor = "#fde4c9";
    levelInput.style.color = "black";
    levelInput.style.borderRadius = "5px";
    levelInput.style.padding = "5px";
    levelInput.style.width = "80px";
    levelInput.style.caretColor = "black";

    const folderSelectLabel = document.createElement("label");
    folderSelectLabel.textContent = "Choose NPC Category (folder):";
    folderSelectLabel.style.color = "#FFC200";

    const folderSelect = document.createElement("select");
    folderSelect.style.padding = "5px";

    const fileSelectLabel = document.createElement("label");
    fileSelectLabel.textContent = "Choose Creature/Character:";
    fileSelectLabel.style.color = "#FFC200";

    const fileSelect = document.createElement("select");
    fileSelect.style.padding = "5px";

    const compareButton = document.createElement("button");
    compareButton.textContent = "Compare Level";
    compareButton.style.backgroundColor = "#FFC200";
    compareButton.style.color = "black";
    compareButton.style.padding = "5px 10px";
    compareButton.style.border = "none";
    compareButton.style.borderRadius = "5px";
    compareButton.style.cursor = "pointer";

    const resultOutput = document.createElement("div");
    resultOutput.style.color = "#fde4c9";
    resultOutput.style.whiteSpace = "pre-wrap";
    resultOutput.style.marginTop = "10px";

    // === Populate Folder Dropdown ===
    const allFiles = app.vault.getFiles();
    const allFolders = new Set();

    allFiles.forEach(file => {
        if (file.path.startsWith(BASE_PATH) && file.path.endsWith(".md")) {
            const parts = file.path.split("/");
            if (parts.length > 1) {
                allFolders.add(parts.slice(0, -1).join("/"));
            }
        }
    });

    const sortedFolders = Array.from(allFolders).sort();
    for (const folder of sortedFolders) {
        const opt = document.createElement("option");
        opt.value = folder;
        opt.textContent = folder.replace(BASE_PATH + "/", "");
        folderSelect.appendChild(opt);
    }

    // === Update File Dropdown on Folder Change ===
    async function updateFileDropdown(folderPath) {
        fileSelect.innerHTML = "";
        const filesInFolder = allFiles.filter(f => f.path.startsWith(folderPath) && f.path.endsWith(".md"));

        for (const file of filesInFolder) {
            const opt = document.createElement("option");
            opt.value = file.path;
            opt.textContent = file.basename;
            fileSelect.appendChild(opt);
        }
    }

    folderSelect.onchange = () => updateFileDropdown(folderSelect.value);
    updateFileDropdown(folderSelect.value); // initial

    // === Compare Logic ===
    compareButton.onclick = async () => {
        const playerLevel = parseInt(levelInput.value);
        if (isNaN(playerLevel)) {
            resultOutput.textContent = "⚠️ Please enter a valid player level.";
            return;
        }

        const file = app.vault.getAbstractFileByPath(fileSelect.value);
        const content = await app.vault.read(file);
        const statblockMatch = content.match(/```statblock([\s\S]*?)```/);

        if (!statblockMatch) {
            resultOutput.textContent = "❌ No statblock found in selected file.";
            return;
        }

        const yaml = statblockMatch[1].trim();
        const lines = yaml.split("\n");
        const levelLine = lines.find(l => l.toLowerCase().startsWith("level:"));
        if (!levelLine) {
            resultOutput.textContent = "⚠️ No 'level:' field found in statblock.";
            return;
        }

        const npcLevel = parseInt(levelLine.split(":")[1].replace(/"/g, "").trim());
        const diff = playerLevel - npcLevel;

        if (diff === 0) {
            resultOutput.textContent = `🟡 ${file.basename} is equal to player level (${npcLevel}). No changes needed.`;
        } else if (diff > 0) {
            resultOutput.textContent = `🟢 ${file.basename} is ${diff} levels below player level (${playerLevel}). Upgrades needed.`;
        } else {
            resultOutput.textContent = `🔴 ${file.basename} is ${Math.abs(diff)} levels above player level (${playerLevel}).`;
        }
    };

    // === Assemble UI ===
    container.appendChild(levelInputLabel);
    container.appendChild(levelInput);
    container.appendChild(folderSelectLabel);
    container.appendChild(folderSelect);
    container.appendChild(fileSelectLabel);
    container.appendChild(fileSelect);
    container.appendChild(compareButton);
    container.appendChild(resultOutput);

    return container;
}

return await renderLevelComparisonUI();

```