```js-engine
// Fallout RPG Character Sheet - Combined Layout
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
        `<div style="display:grid; grid-template-columns: 1fr; gap:20px; width:100%; max-width:800px; background-color:#325886; padding:15px; border-radius:8px;">
            
            <!-- Character Info & Derived Stats (Side-by-Side) -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; align-items:start;">
                
                <div style="border:1px solid #ccc; padding:15px; border-radius:8px;">
                    <div style="font-weight:bold; font-size:22px; color:#efdd6f; text-align:center; padding-bottom:5px;">Character Info</div>
                    <div style="display:grid; grid-template-columns: auto 1fr; gap:5px; align-items:center;">
                        <label>Name:</label> <input id="Name" type="text" style="width:100%; background-color:#fde4c9; color:black;">
                        <label>Origin:</label> <input id="Origin" type="text" style="width:100%; background-color:#fde4c9; color:black;">
                        <label>Level:</label> <input id="Level" type="number" style="width:50px; background-color:#fde4c9; color:black;">
                        <label>XP Earned:</label> <input id="XPEarned" type="number" style="width:80px; background-color:#fde4c9; color:black;">
                        <label>XP to Next Level:</label> <input id="XPNext" type="number" style="width:80px; background-color:#fde4c9; color:black;">
                    </div>
                </div>
                
                <div style="border-left: 2px solid rgba(255,255,255,0.2); padding-left:20px; border:1px solid #ccc; padding:15px; border-radius:8px; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <div>
                        <div style="font-weight:bold; font-size:22px; color:#efdd6f; text-align:center; padding-bottom:5px;">Derived Stats</div>
                        <label>Melee Damage:</label> <input id="MeleeDamage" type="number" style="width:100%; background-color:#fde4c9; color:black;">
                        <label>Defense:</label> <input id="Defense" type="number" style="width:100%; background-color:#fde4c9; color:black;">
                        <label>Initiative:</label> <input id="Initiative" type="number" style="width:100%; background-color:#fde4c9; color:black;">
                    </div>
                    <div style="display:grid; grid-template-rows: auto auto; gap:5px; align-items:center;">
                        <div style="border:1px solid #efdd6f; padding:5px; display:grid; grid-template-columns: auto 1fr; align-items:center;">
                            <label>Luck Points:</label> <input id="LuckPoints" type="number" style="width:100px; background-color:#fde4c9; color:black;">
                        </div>
                        <div style="border:1px solid #efdd6f; padding:5px; display:grid; grid-template-columns: auto auto; align-items:center;">
                            <label style="grid-column: 1 / span 2; text-align:center; color:#efdd6f; font-weight:bold;">HP</label>
                            <label>Maximum HP:</label> <input id="MaxHP" type="number" style="width:80px; background-color:#fde4c9; color:black;">
                            <label>Current HP:</label> <input id="CurrentHP" type="number" style="width:80px; background-color:#fde4c9; color:black;">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- S.P.E.C.I.A.L. Stats -->
            <div style="grid-column: span 1; border:1px solid #ccc; padding:10px; border-radius:8px; text-align:center;">
                <div style="font-weight:bold; font-size:22px; color:#efdd6f; text-align:center; padding-bottom:5px;">S.P.E.C.I.A.L.</div>
                <div style="display:flex; justify-content:space-around; gap:10px;">
                    ${['STR', 'PER', 'END', 'CHA', 'INT', 'AGI', 'LCK'].map(stat => 
                        `<div style="display:flex; flex-direction:column; align-items:center;">
                            <label style="color:#efdd6f; font-weight:bold;">${stat}</label>
                            <input id="${stat}" type="number" style="width:40px; text-align:center; background-color:#fde4c9; color:black; border-radius:5px; border:1px solid #ddd;">
                        </div>`
                    ).join('')}
                </div>
            </div>
        </div>`
    );
};

// Build Character Sheet
builder.createHeading(2, 'Fallout RPG Character Sheet');
createCharacterSheet();
setTimeout(() => loadInputs(), 100);

return builder;

```