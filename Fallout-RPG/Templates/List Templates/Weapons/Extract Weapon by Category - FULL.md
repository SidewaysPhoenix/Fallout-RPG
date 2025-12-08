<%*
const folderPath = "Fallout-RPG/Items/Weapons"; // Change to match your folder
const raritySortOrder = "asc"; // Use "asc" for ascending, "desc" for descending
const nameSortOrder = "asc"; // Always sort names in ascending order

// Get all markdown files in the folder
const files = app.vault.getMarkdownFiles().filter(f => f.path.startsWith(folderPath));

let items = [];

for (const file of files) {
    const content = await app.vault.read(file);
    const match = content.match(/```statblock([\s\S]*?)```/);
    
    if (match) {
        const statblockContent = match[1].trim().split("\n");
        let parsedData = {};

        for (const line of statblockContent) {
            const keyValueMatch = line.match(/^([\w_]+):\s*"(.*)"$/);
            if (keyValueMatch) {
                parsedData[keyValueMatch[1]] = keyValueMatch[2];
            }
        }

        // Extract relevant data
        let name = parsedData["name"] || "Unknown";
        let cost = parsedData["cost"] || "0"; // Default to 0 if missing
        let rarity = parsedData["rarity"] || "0"; // Default to 0 if missing
        let type = parsedData["type"] || "Uncategorized"; // Extract type

        // Convert cost and rarity to numbers for sorting
        cost = isNaN(parseInt(cost)) ? 0 : parseInt(cost);
        rarity = isNaN(parseInt(rarity)) ? 0 : parseInt(rarity);

        items.push({ name, cost, rarity, type });
    }
}

// Sort items by type first, then rarity, then name
items.sort((a, b) => {
    let typeDiff = a.type.localeCompare(b.type);
    if (typeDiff !== 0) return typeDiff;

    let rarityDiff = a.rarity - b.rarity; // Default to ascending
    if (raritySortOrder === "desc") rarityDiff = b.rarity - a.rarity; // Descending if set

    if (rarityDiff !== 0) return rarityDiff;

    return nameSortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
});


// Group items by type
let categorizedItems = {};
items.forEach(item => {
    if (!categorizedItems[item.type]) {
        categorizedItems[item.type] = [];
    }
    categorizedItems[item.type].push(item);
});

// Generate the sorted output with type headers
let output = "";
for (const type in categorizedItems) {
    output += `\n**${type}**\n\n`;
    output += "| Name | Cost | Rarity |\n|------|------|--------|\n";
    
    categorizedItems[type].forEach(item => {
        output += `| [[${item.name}]] | ${item.cost} | ${item.rarity} |\n`;
    });
}

tR += output;
%>
