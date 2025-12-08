<%*
const folderPath = "Fallout-RPG/Items/Ammo"; // Adjust folder path
const excludedFolders = ["Syringer Ammo"]; // Folders to exclude if needed
const priorityFolders = []; // Higher priority folders (only used if randomizeSelection = true)

const raritySortOrder = "asc"; // "asc" for ascending, "desc" for descending
const nameSortOrder = "asc"; // Always sort names in ascending order

const minRarity = 0; // Minimum rarity filter
const maxRarity = 3; // Maximum rarity filter (adjust as needed)
const maxItems = 20; // Number of items to display
const randomizeSelection = true; // Set to true for random, false to keep sorted order

// Get all markdown files in the folder, excluding specified folders
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
        let qtyFound = parsedData["qty found"] || "N/A";
        let costRaw = parsedData["cost"] || "0";
        let rarityRaw = parsedData["rarity"] || "0";

        let costMatch = costRaw.match(/\d+/);
        let cost = costMatch ? parseInt(costMatch[0], 10) : 0;

        let rarityMatch = rarityRaw.match(/\d+/);
        let rarity = rarityMatch ? parseInt(rarityMatch[0], 10) : 0;

        if (rarity >= minRarity && rarity <= maxRarity) {
            let itemData = { name, qtyFound, cost, rarity };

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

let output = "| # | File | Qty Found | Cost | Rarity |\n|---|------|-----------|------|--------|\n";
items.forEach((item, index) => {
    output += `| ${index + 1} | [[${item.name}]] | ${item.qtyFound} | ${item.cost} | ${item.rarity} |\n`;
});

tR += output;
%>
