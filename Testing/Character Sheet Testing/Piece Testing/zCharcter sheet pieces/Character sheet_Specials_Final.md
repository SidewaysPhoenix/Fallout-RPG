## Fallout RPG Character Sheet

```js-engine
// Fallout RPG Character Sheet - Special Stats Section (Horizontal Layout)
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

const createSpecialStats = () => {
    const labels = ['STR', 'PER', 'END', 'CHA', 'INT', 'AGI', 'LCK'];
    const ids = ['Strength', 'Perception', 'Endurance', 'Charisma', 'Intelligence', 'Agility', 'Luck'];

    builder.createParagraph(
        `<div style="border:1px solid #ccc; border-radius:8px; padding:15px; width:100%; max-width:500px; background-color:#325886; text-align:left;">
            <div style="font-weight:bold; font-size:20px; color:#efdd6f; margin-bottom:10px; text-align:center;">S.P.E.C.I.A.L.</div>
            <div style="display:flex; justify-content:space-between; gap:10px;">
                ${labels.map((label, index) => 
                    `<div style="text-align:center;">
                        <label for="${ids[index]}" style="font-weight:bold; color:#efdd6f;margin-bottom:1px;">${label}</label>
                        <input id="${ids[index]}" type="number" style="width:40px; padding:px; border:1px solid #ccc; border-radius:8px; background-color:#fde4c9; color:black;">
                    </div>`
                ).join('')}
            </div>
        </div>`
    );

    ids.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            inputs[id] = input;
            input.addEventListener('input', saveInputs);
        }
    });
};

// Full Layout
builder.createHeading(2, 'Fallout RPG Character Sheet');

// Special Stats
createSpecialStats();

// Load data when script runs
setTimeout(() => {
    loadInputs();
}, 100);

return builder;
```

The **S.P.E.C.I.A.L. Stats** section now displays all attributes horizontally in a single row with compact labels and aligned input fields.