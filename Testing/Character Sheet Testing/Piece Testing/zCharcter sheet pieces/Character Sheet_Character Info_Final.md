## Fallout-RPG Character Sheet

```js-engine
// Fallout-RPG Character Sheet - Updated Character Info Section
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

const createInput = (label, id, type = 'text', width = '150px', placeholder = '') => {
    builder.createParagraph(
        `<label for="${id}" style="font-weight:bold; color:#efddf6; text-align:left;">${label}:</label> <input id="${id}" type="${type}" placeholder="${placeholder}" 
        style="width:${width}; padding:4px; border:1px solid #ccc; border-radius:4px; background-color:#fde4c9; color:black;">`
    );
    setTimeout(() => {
        const input = document.getElementById(id);
        if (input) {
            inputs[id] = input;
            input.addEventListener('input', saveInputs);
        }
    }, 0);
};

const createCharacterInfo = () => {
    builder.createParagraph(
        `<div style="border:1px solid #ccc; border-radius:8px; padding:15px; width:100%; max-width:350px; background-color:#325886; text-align:left;">
            <div style="font-weight:bold; font-size:20px; color:#efdd6f; margin-bottom:10px; text-align:center;">Character Info</div>
            <div style="display:grid; grid-template-columns: auto auto; gap:15px;">
                <div style="grid-column: span 2;"><label for="Name" style="font-weight:bold; color:#efdd6f;">Name:</label> <input id="Name" type="text" style="width:90%; background-color:#fde4c9; color:black;"></div>
                <div><label for="Origin" style="font-weight:bold; color:#efdd6f;">Origin:</label> <input id="Origin" type="text" style="width:75%; background-color:#fde4c9; color:black;"></div>
                <div><label for="Level" style="font-weight:bold; color:#efdd6f;">Level:</label> <input id="Level" type="number" style="width:50%; background-color:#fde4c9; color:black;"></div>
                <div><label for="XPEarned" style="font-weight:bold; color:#efdd6f;">XP Earned:</label> <input id="XPEarned" type="number" style="width:80%; background-color:#fde4c9; color:black;"></div>
                <div><label for="XPNext" style="font-weight:bold; color:#efdd6f;">XP to Next Level:</label> <input id="XPNext" type="number" style="width:100%; background-color:#fde4c9; color:black;"></div>
            </div>
        </div>`
    );
    ['Name', 'Origin', 'Level', 'XPEarned', 'XPNext'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            inputs[id] = input;
            input.addEventListener('input', saveInputs);
        }
    });
};

// Full Layout
builder.createHeading(2, 'Fallout-RPG Character Sheet');

// Character Info
createCharacterInfo();

// Load data when script runs
setTimeout(() => {
    loadInputs();
}, 100);

return builder;
```

The **Character Info** section now places **XP Earned** and **XP to Next Level** side by side, maintaining proper alignment and spacing.