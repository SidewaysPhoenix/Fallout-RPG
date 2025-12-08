<%*
const folderPath = "Fallout-RPG/Items/Consumables/Food"; // Adjust folder path
const excludedFolders = ["RottenFood", "JunkFood"]; // Folders to exclude
const priorityFolders = ["GourmetMeals", "PreWarFoods"]; // Higher priority folders (only used if randomizeSelection = true)

const raritySortOrder = "asc"; // "asc" for ascending, "desc" for descending
const nameSortOrder = "asc"; // Always sort names in ascending order

const minRarity = 0; // Minimum rarity filter
const maxRarity = 3; // Maximum rarity filter
const maxItems = 40; // Number of items to display
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
            // Improved regex to handle both quoted and unquoted values
            const keyValueMatch = line.match(/^([\w\s]+):\s*(?:"([^"]+)"|([^\n]+))$/);
            if (keyValueMatch) {
                const key = keyValueMatch[1].trim().toLowerCase(); // Normalize key
                const value = keyValueMatch[2] ? keyValueMatch[2].trim() : keyValueMatch[3].trim();
                parsedData[key] = value;
            }
        }

        // 🔍 Debugging: Log extracted data
        console.log(`Extracted Data from ${file.name}:`, parsedData);

        // Extract relevant data
        let name = parsedData["consumables name"] || parsedData["name"] || "Unknown"; 
        let costRaw = parsedData["cost"] || "MISSING";  
        let rarityRaw = parsedData["item rarity"] || parsedData["rarity"] || "0"; 

        // 🔍 Debugging: Show extracted values
        console.log(`Processing: ${name}, Cost Raw: ${costRaw}, Rarity Raw: ${rarityRaw}`);

        // ✅ Extract numbers from cost field
        let costMatch = costRaw.match(/\d+/);
        let cost = costMatch ? parseInt(costMatch[0], 10) : 0;

        // ✅ Extract numbers from rarity field
        let rarityMatch = rarityRaw.match(/\d+/);
        let rarity = rarityMatch ? parseInt(rarityMatch[0], 10) : 0;

        // 🔥 Log warning if cost is missing
        if (costRaw === "MISSING") {
            console.warn(`⚠️ Cost field missing for: ${name} in file ${file.path}`);
        }

        if (rarity >= minRarity && rarity <= maxRarity) {
            let itemData = { name, cost, rarity };

            // ✅ Only apply priority folders if randomization is enabled
            if (randomizeSelection && priorityFolders.some(priority => file.path.includes(priority))) {
                priorityItems.push(itemData, itemData); // Add twice for more weight
            } else {
                items.push(itemData);
            }
        }
    }
}

// Merge items with priority items if randomization is enabled
items = randomizeSelection ? [...items, ...priorityItems] : items;

// Remove duplicates before sorting (ensures unique results)
items = items.filter((item, index, self) => 
    index === self.findIndex(i => i.name === item.name)
);

// Sort first by rarity, then by name
items.sort((a, b) => {
    let rarityDiff = a.rarity - b.rarity;
    if (rarityDiff !== 0) return raritySortOrder === "asc" ? rarityDiff : -rarityDiff;

    return nameSortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
});

// Apply randomization if enabled
if (randomizeSelection) {
    items = items.sort(() => Math.random() - 0.5);
}

// Pick only the first maxItems items (or all if fewer exist)
items = items.slice(0, maxItems);

// Generate the numbered table
let output = "| # | Name | Cost | Rarity |\n|---|------|------|--------|\n";
items.forEach((item, index) => {
    output += `| ${index + 1} | [[${item.name}]] | ${item.cost} | ${item.rarity} |\n`;
});

tR += output;
%>
