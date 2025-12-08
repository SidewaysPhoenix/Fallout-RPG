<%*
const folderPath = "Fallout-RPG/Items/Apparel"; // Adjust folder path
const raritySortOrder = "asc"; // "asc" for ascending, "desc" for descending
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
            const keyValueMatch = line.match(/^([\w\s]+):\s*(?:"([^"]+)"|([^"\n]+))$/);
            if (keyValueMatch) {
                const key = keyValueMatch[1].trim();
                const value = keyValueMatch[2] ? keyValueMatch[2].trim() : keyValueMatch[3].trim();
                parsedData[key] = value;
            }
        }

        let name = parsedData["name"] || "Unknown"; 
        let cost = parsedData["cost"] || "0"; 
        let rarity = parsedData["rarity"] || "0"; 
        let category = parsedData["category"] || "Uncategorized"; // Extract category

        cost = parseInt(cost.replace(/\D/g, ""), 10) || 0; 
        rarity = parseInt(rarity.replace(/\D/g, ""), 10) || 0; 

        items.push({ name, cost, rarity, category });
    }
}

// Sort items by category first, then rarity, then name
items.sort((a, b) => {
    let categoryDiff = a.category.localeCompare(b.category);
    if (categoryDiff !== 0) return categoryDiff;

    let rarityDiff = a.rarity - b.rarity;
    if (rarityDiff !== 0) return raritySortOrder === "asc" ? rarityDiff : -rarityDiff;

    return nameSortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
});

// Group items by category
let categorizedItems = {};
items.forEach(item => {
    if (!categorizedItems[item.category]) {
        categorizedItems[item.category] = [];
    }
    categorizedItems[item.category].push(item);
});

// Generate the sorted output with category headers
let output = "";
for (const category in categorizedItems) {
    output += `\n**${category}**\n\n`;
    output += "| Name | Cost | Rarity |\n|------|------|--------|\n";
    
    categorizedItems[category].forEach(item => {
        output += `| [[${item.name}]] | ${item.cost} | ${item.rarity} |\n`;
    });
}

tR += output;
%>
