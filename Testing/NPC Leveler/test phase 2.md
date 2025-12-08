```js-engine
const BASE_PATH = "Fallout RPG/Creatures and NPCs/Statblocks";

async function renderLevelUpgradeUI() {
    const container = document.createElement("div");
    container.style.padding = "10px";
    container.style.border = "3px solid #2e4663";
    container.style.borderRadius = "8px";
    container.style.backgroundColor = "#325886";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    container.style.maxWidth = "700px";
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
    compareButton.textContent = "Compare & Show Upgrades";
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

    // === Get folders ===
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
    updateFileDropdown(folderSelect.value);

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
        const stat = Object.fromEntries(
            yaml.split('\n').map(line => {
                if (line.includes(':')) {
                    const [k, ...v] = line.split(":");
                    return [k.trim().toLowerCase(), v.join(":").trim().replace(/"/g, "")];
                }
                return null;
            }).filter(Boolean)
        );

        const npcLevel = parseInt(stat.level);
        const diff = playerLevel - npcLevel;

        if (diff === 0) {
            resultOutput.textContent = `🟡 ${file.basename} is already level ${npcLevel}. No changes needed.`;
            return;
        } else if (diff < 0) {
            resultOutput.textContent = `🔴 ${file.basename} is already above player level by ${Math.abs(diff)} levels.`;
            return;
        }

        let upgrades = [`🟢 ${file.basename} is ${diff} levels below player level.`];
        upgrades.push(`Recommended Upgrades:`);

        // Attributes
        const oddLevels = Math.floor((diff + 1) / 2);
        upgrades.push(`• +${oddLevels} to random attributes`);

        // Skills (Characters only)
        if (stat.type?.toLowerCase().includes("character")) {
            upgrades.push(`• +${diff} to skills (1 per level)`);
            upgrades.push(`• Weapon upgrade OR mod every 2 levels: ${Math.floor(diff / 2)} time(s)`);
            upgrades.push(`• Armor upgrade OR mod every 2 levels: ${Math.floor(diff / 2)} time(s)`);
            upgrades.push(`• +${Math.floor(diff / 3)} to Wealth`);
        }

        // Creatures
        if (stat.type?.toLowerCase().includes("creature")) {
            upgrades.push(`• +${diff} HP`);
            if (yaml.toLowerCase().includes("name: big")) upgrades.push(`• +${diff} more HP from Big`);
            upgrades.push(`• +1D6 to one attack every 2 levels: ${Math.floor(diff / 2)} time(s)`);
            upgrades.push(`• +1 to one DR type every 2 levels: ${Math.floor(diff / 2)} time(s)`);
        }

        resultOutput.textContent = upgrades.join("\n");
    };

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

return await renderLevelUpgradeUI();


```