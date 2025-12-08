## Fallout-RPG Character Sheet

```js-engine
// Fallout-RPG Character Sheet - Derived Stats Section (Grid and Table Layout)
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

const createDerivedStats = () => {
    builder.createParagraph(
        `<div style="border:1px solid #ccc; border-radius:8px; padding:15px; width:100%; max-width:500px; background-color:#325886; text-align:left;">
            
            <div style="display:grid; grid-template-columns: auto 1fr; gap:10px;">
                <div>
                    <div><label for="MeleeDamage" style="font-weight:bold; color:#efdd6f;  margin-bottom:1px;">Melee Damage:</label> <input id="MeleeDamage" type="number" style="width:80%; background-color:#fde4c9; color:black; margin-bottom:10px;"></div>
                    <div><label for="Defense" style="font-weight:bold; color:#efdd6f; margin-bottom:1px;">Defense:</label> <input id="Defense" type="number" style="width:80%; background-color:#fde4c9; color:black; margin-bottom:10px;"></div>
                    <div><label for="Initiative" style="font-weight:bold; color:#efdd6f;  margin-bottom:1px;">Initiative:</label> <input id="Initiative" type="number" style="width:80%; background-color:#fde4c9; color:black; margin-bottom:10px;"></div>
                </div>
                <div>
                    <div><label for="LuckPoints" style="font-weight:bold; color:#efdd6f;  margin-bottom:1px;">Luck Points:</label> <input id="LuckPoints" type="number" style="width:100%; background-color:#fde4c9; color:black;"></div>
                    <table style="width:100%; border-collapse:collapse; margin-top:10px;">
                        <tr>
                            <td style="font-weight:bold; color:#efdd6f; text-align:center; vertical-align:middle;">Maximum HP:</td>
                            <td><input id="MaxHP" type="number" style="width:100%; background-color:#fde4c9; color:black;"></td>
                        </tr>
                        <tr>
                            <td style="font-weight:bold; color:#efdd6f; text-align:center; vertical-align:middle;">Current HP:</td>
                            <td><input id="CurrentHP" type="number" style="width:100%; background-color:#fde4c9; color:black;"></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>`
    );

    ['MeleeDamage', 'Defense', 'Initiative', 'LuckPoints', 'MaxHP', 'CurrentHP'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            inputs[id] = input;
            input.addEventListener('input', saveInputs);
        }
    });
};

// Full Layout
builder.createHeading(2, 'Fallout-RPG Character Sheet');

// Derived Stats
createDerivedStats();

// Load data when script runs
setTimeout(() => {
    loadInputs();
}, 100);

return builder;
```

The **Derived Stats** section has been updated to display **Luck Points** above the table, with **Melee Damage**, **Defense**, and **Initiative** aligned vertically on the left side of the table for improved readability and design.