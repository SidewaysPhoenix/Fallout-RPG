```js-engine

// Fallout-RPG Character Sheet - Combined Layout
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

const createCharacterSheet = () => {
    builder.createParagraph(
        `<div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:20px; width:100%; max-width:800px; background-color:#325886; padding:15px; border-radius:8px;">
            
            <!-- Character Info -->
            <div style="grid-column: span 2; border:1px solid #ccc; padding:15px; border-radius:8px;">
                <div style="font-weight:bold; font-size:22px; color:#efdd6f; text-align:center;">Character Info</div>
                <label>Name:</label> <input id="Name" type="text" style="width:90%; background-color:#fde4c9; color:black;"><br>
                <label>Origin:</label> <input id="Origin" type="text" style="width:75%; background-color:#fde4c9; color:black;">
                <label>Level:</label> <input id="Level" type="number" style="width:50px; background-color:#fde4c9; color:black;">
                <br>
                <label>XP Earned:</label> <input id="XPEarned" type="number" style="width:80px; background-color:#fde4c9; color:black;">
                <label>XP to Next Level:</label> <input id="XPNext" type="number" style="width:100px; background-color:#fde4c9; color:black;">
            </div>
            
            <!-- Skills (Fixed Checkbox Alignment) -->
            <div style="grid-column: span 2; border:1px solid #ccc; padding:15px; border-radius:8px; text-align:left;">
                <div style="font-weight:bold; font-size:22px; color:#efdd6f; text-align:center; padding-bottom:5px;">Skills</div>
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px;">
                    ${[
                        'Athletics', 'Small Guns', 'Energy Weapons',
                        'Melee Weapons', 'Speech', 'Lockpick',
                        'Science', 'Survival', 'Barter',
                        'Big Guns', 'Explosives', 'Medicine',
                        'Pilot', 'Repair', 'Sneak',
                        'Throwing', 'Unarmed'
                    ].map(skill => 
                        `<div style="display:flex; align-items:center; gap:10px; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.2); padding:5px 0; transition:background-color 0.3s;">
                            <label style="flex:2; text-align:left;">${skill}</label>
                            <input type="checkbox" id="${skill}Tag" style="width:16px; height:16px; margin:0;">
                            <input id="${skill}" type="number" style="width:50px; background-color:#fde4c9; color:black; text-align:center; border-radius:5px; border:1px solid #ddd;">
                        </div>`
                    ).join('')}
                </div>
            </div>
        </div>`
    );
    
    const ids = ['Name', 'Origin', 'Level', 'XPEarned', 'XPNext', 'STR', 'PER', 'END', 'CHA', 'INT', 'AGI', 'LCK'].concat(
        ['Athletics', 'Small Guns', 'Energy Weapons', 'Melee Weapons', 'Speech', 'Lockpick', 'Science', 'Survival', 'Barter', 'Big Guns', 'Explosives', 'Medicine', 'Pilot', 'Repair', 'Sneak', 'Throwing', 'Unarmed'].flatMap(skill => [skill, `${skill}Tag`])
    );
    
    ids.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            inputs[id] = input;
            input.addEventListener('input', saveInputs);
        }
    });
};

// Build Character Sheet
builder.createHeading(2, 'Fallout-RPG Character Sheet');
createCharacterSheet();
setTimeout(() => loadInputs(), 100);

return builder;

```