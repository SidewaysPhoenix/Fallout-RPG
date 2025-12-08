<%* 
// 📝 Specify the path of the note with frontmatter
const configNotePath = "Fallout-RPG/Test Table 2"; // Path to the config note

// ✅ Read the frontmatter of the config note
const configFile = app.vault.getAbstractFileByPath(configNotePath + ".md");
let configFrontmatter = {};

if (configFile) {
    const configContent = await app.vault.read(configFile);
    const frontmatterMatch = configContent.match(/^---\s*([\s\S]*?)\s*---/m);

    if (frontmatterMatch) {
        const frontmatterText = frontmatterMatch[1].trim();
        const frontmatterLines = frontmatterText.split("\n");

        frontmatterLines.forEach(line => {
            const [key, value] = line.split(":").map(item => item.trim());
            if (value) {
                const cleanedValue = value.replace(/^"(.*)"$/, "$1"); // Remove surrounding quotes
                if (cleanedValue === "true") configFrontmatter[key] = true;
                else if (cleanedValue === "false") configFrontmatter[key] = false;
                else if (!isNaN(cleanedValue) && cleanedValue !== "") configFrontmatter[key] = parseFloat(cleanedValue);
                else configFrontmatter[key] = cleanedValue;
            }
        });
    }
}

const raritySortOrder = configFrontmatter["raritySortOrder"] || "asc";
const nameSortOrder = configFrontmatter["nameSortOrder"] || "asc";
const minRarity = parseInt(configFrontmatter["minRarity"] || "0", 10);
const maxRarity = parseInt(configFrontmatter["maxRarity"] || "3", 10);
const maxItems = parseInt(configFrontmatter["maxItems"] || "40", 10);
const randomizeSelection = configFrontmatter["randomizeSelection"] !== undefined 
    ? configFrontmatter["randomizeSelection"] 
    : false;

// ✅ Main Item Generation Logic
const folderPath = "Fallout-RPG/Items/Weapons"; 
const excludedFolders = ["Automatron Melee Weapons", "Unique Items"]; 
const priorityFolders = ["LegendaryWeapons", "PrototypeWeapons"]; 

const files = app.vault.getMarkdownFiles().filter(f => 
    f.path.startsWith(folderPath) && 
    !excludedFolders.some(excluded => f.path.includes(excluded))
);

let items = [];
let priorityItems = [];

for (const file of files) {
    const content = await app.vault.read(file);
    const match = content.match(/```statblock([\s\S]*?)```/);

    if (match) {
        const statblockContent = match[1].trim().split("\n");
        let parsedData = {};

        for (const line of statblockContent) {
            const keyValueMatch = line.match(/^([\w\s]+):\s*(?:"([^"]+)"|([^\n]+))$/);
            if (keyValueMatch) {
                const key = keyValueMatch[1].trim().toLowerCase();
                const value = keyValueMatch[2] ? keyValueMatch[2].trim() : keyValueMatch[3].trim();
                parsedData[key] = value;
            }
        }

        let name = parsedData["name"] || "Unknown";
        let costRaw = parsedData["cost"] || "MISSING";  
        let rarityRaw = parsedData["rarity"] || "0"; 

        let costMatch = costRaw.match(/\d+/);
        let cost = costMatch ? parseInt(costMatch[0], 10) : 0;

        let rarityMatch = rarityRaw.match(/\d+/);
        let rarity = rarityMatch ? parseInt(rarityMatch[0], 10) : 0;

        if (rarity >= minRarity && rarity <= maxRarity) {
            let itemData = { name, cost, rarity };

            if (randomizeSelection && priorityFolders.some(priority => file.path.includes(priority))) {
                priorityItems.push(itemData, itemData);
            } else {
                items.push(itemData);
            }
        }
    }
}

items = randomizeSelection ? [...items, ...priorityItems] : items;

items = items.filter((item, index, self) => 
    index === self.findIndex(i => i.name === item.name)
);

items.sort((a, b) => {
    let rarityDiff = a.rarity - b.rarity;
    if (rarityDiff !== 0) return raritySortOrder === "asc" ? rarityDiff : -rarityDiff;
    return nameSortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
});

if (randomizeSelection) {
    items = items.sort(() => Math.random() - 0.5);
}

items = items.slice(0, maxItems);

let output = "| # | Name | Cost | Rarity |\n|---|------|------|--------|\n";
items.forEach((item, index) => {
    output += `| ${index + 1} | [[${item.name}]] | ${item.cost} | ${item.rarity} |\n`;
});

tR += `\n${output}`;
%>