

```js-engine
// Fallout-RPG Character Sheet - Updated Armor Section with Compact Grid Layout and Bold Poison DR (Truly Blank Default)
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
        `<div style="border:1px solid #ccc; border-radius:8px; padding:10px; width:100%; background-color:#325886;">
            <div style="font-weight:bold; font-size:24px; text-align:center; width:100%; display:block; margin-bottom:1px;">${location}</div>
            <table style="width:100%; border-collapse:collapse;">
                <tr>
                    <td style="font-weight:normal; text-align:left; width:24%;">Phys. DR</td>
                    <td style="width:20%;"><input id="${location}_Phys_DR" type="number" style="width:80%; background-color:#fde4c9; color:black;"></td>
                    <td style="font-weight:normal; text-align:left; width:24%;">Rad. DR</td>
                    <td style="width:20%;"><input id="${location}_Rad_DR" type="number" style="width:80%; background-color:#fde4c9; color:black;"></td>
                </tr>
                <tr>
                    <td style="font-weight:normal; text-align:left;">En. DR</td>
                    <td><input id="${location}_En_DR" type="number" style="width:80%; background-color:#fde4c9; color:black;"></td>
                    <td style="font-weight:normal; text-align:left;">HP</td>
                    <td><input id="${location}_HP" type="number" style="width:80%; background-color:#fde4c9; color:black;"></td>
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

// Armor
builder.createHeading(1, 'Armor');
builder.createParagraph('<div style="margin-bottom: 10px;">');
createInput('Poison DR', 'Poison_DR', 'number', '80px', true, ''); // Bold Poison DR at the top with truly blank default

builder.createParagraph('<div style="display:grid; grid-template-columns: 1fr 1fr ; gap:5px; color:#EFDD6F;">');
['Head', 'Torso','Left Arm', 'Right Arm', 'Left Leg', 'Right Leg','Body (Outfit)'].forEach(location => {
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

