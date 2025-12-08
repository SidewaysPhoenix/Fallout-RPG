## Fallout RPG Character Sheet

```js-engine
// Fallout RPG Character Sheet - Full Combined Layout
const builder = engine.markdown.createBuilder();

const STORAGE_KEY = 'falloutRPGCharacterSheet';
const inputs = {};

const saveInputs = () => {
    const data = Object.fromEntries(
        Object.keys(inputs).map(key => [key, inputs[key]?.value || null])
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadInputs = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    Object.entries(inputs).forEach(([key, input]) => input.value = data[key] ?? "");
};

const createInput = (label, id, type = 'text', width = '80px', isBold = false, placeholder = '') => {
    const style = isBold ? 'font-weight:bold;' : '';
    builder.createParagraph(`**${label}:** <input id="${id}" type="${type}" placeholder="${placeholder}" style="${style} width:${width}; padding:4px; border:1px solid #ccc; border-radius:4px; background-color:#fde4c9; color:black;">`);
    setTimeout(() => {
        const input = document.getElementById(id);
        if (input) {
            inputs[id] = input;
            input.addEventListener('input', saveInputs);
        }
    }, 0);
};

const createContainer = (location) => {
    builder.createParagraph(
        `<div style="border:1px solid #ccc; border-radius:8px; padding:10px; width:100%; background-color:#FFF7E6;">
            <div style="font-weight:bold; font-size:16px; text-align:center; margin-bottom:10px;">${location}</div>
            <table style="width:100%; border-collapse:collapse;">
                <tr>
                    <td style="font-weight:normal; text-align:left; width:24%;">Phys. DR</td>
                    <td style="width:20%;"><input id="${location}_Phys_DR" type="number" style="width:100%; background-color:#fde4c9; color:black;"></td>
                    <td style="font-weight:normal; text-align:left; width:24%;">Rad. DR</td>
                    <td style="width:20%;"><input id="${location}_Rad_DR" type="number" style="width:100%; background-color:#fde4c9; color:black;"></td>
                </tr>
                <tr>
                    <td style="font-weight:normal; text-align:left;">En. DR</td>
                    <td><input id="${location}_En_DR" type="number" style="width:100%; background-color:#fde4c9; color:black;"></td>
                    <td style="font-weight:normal; text-align:left;">HP</td>
                    <td><input id="${location}_HP" type="number" style="width:100%; background-color:#fde4c9; color:black;"></td>
                </tr>
                <tr>
                    <td colspan="4" style="font-weight:bold; text-align:left;">Apparel Piece: <input id="${location}_Name" type="text" style="width:100%; background-color:#fde4c9; color:black;"></td>
                </tr>
            </table>
        </div>`
    );
    setTimeout(() => {
        ['Name', 'Phys_DR', 'En_DR', 'Rad_DR', 'HP'].forEach(stat => {
            const input = document.getElementById(`${location}_${stat}`);
            if (input) {
                inputs[`${location}_${stat}`] = input;
                input.addEventListener('input', saveInputs);
            }
        });
    }, 0);
};

// Full Layout
builder.createHeading(2, 'Fallout RPG Character Sheet');

// Character Info
builder.createHeading(3, 'Character Info');
['Name', 'Race', 'Gender', 'Age', 'Background', 'Level', 'XP'].forEach(field => createInput(field, field));

// S.P.E.C.I.A.L. Stats
builder.createHeading(3, 'S.P.E.C.I.A.L. Stats');
['Strength', 'Perception', 'Endurance', 'Charisma', 'Intelligence', 'Agility', 'Luck'].forEach(stat => createInput(stat, stat, 'number'));

// Derived Stats
builder.createHeading(3, 'Derived Stats');
['Maximum HP', 'Current HP', 'Luck Points', 'Melee Damage', 'Defense', 'Initiative', 'Current Carry Weight', 'Maximum Carry Weight'].forEach(stat => createInput(stat, stat, 'number'));

// Skills
builder.createHeading(3, 'Skills');
['Athletics', 'Small Guns', 'Energy Weapons', 'Melee Weapons', 'Speech', 'Lockpick', 'Science', 'Survival', 'Barter', 'Big Guns', 'Explosives', 'Medicine', 'Pilot', 'Repair', 'Sneak', 'Throwing', 'Unarmed'].forEach(skill => createInput(skill, skill, 'number'));

// Armor
builder.createHeading(3, 'Armor');
createInput('Poison DR', 'Poison_DR', 'number', '80px', true, ''); // Bold Poison DR at the top with truly blank default
builder.createParagraph('<div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">');
['Left Arm', 'Head', 'Right Arm', 'Left Leg', 'Body (Outfit)', 'Right Leg'].forEach(location => {
    builder.createParagraph('<div>');
    createContainer(location);
    builder.createParagraph('</div>');
});
builder.createParagraph('</div>');

// Load data when script runs
setTimeout(() => {
    loadInputs();
}, 100);

return builder;
```

This version now includes **Character Info**, **S.P.E.C.I.A.L. Stats**, **Derived Stats**, **Skills**, and **Armor**. Let me know if you need Weapons, Ammo, Perks, and Gear added as well.