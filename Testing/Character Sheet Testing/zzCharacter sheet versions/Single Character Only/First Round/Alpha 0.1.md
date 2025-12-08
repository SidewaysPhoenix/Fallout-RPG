```js-engine
// Fallout RPG Character Sheet - JS-Engine Compatible
const builder = engine.markdown.createBuilder();
const STORAGE_KEY = 'falloutRPGCharacterSheet';
const inputs = {};

// Inject CSS dynamically into the page
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .fallout-container {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            background-color: #325886;
            text-align: left;
            width: 100%;
            max-width: 500px;
        }
        .fallout-heading {
            font-weight: bold;
            font-size: 20px;
            color: #efdd6f;
            text-align: center;
            margin-bottom: 10px;
        }
        .fallout-label {
            font-weight: bold;
            color: #efdd6f;
        }
        .fallout-input {
            width: 100%;
            padding: 4px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #fde4c9;
            color: black;
        }
    </style>
`);

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

const createInput = (label, id, type = 'text') => {
    builder.createParagraph(
        `<label for="${id}" class="fallout-label">${label}:</label> 
        <input id="${id}" type="${type}" class="fallout-input">`
    );
    setTimeout(() => {
        const input = document.getElementById(id);
        if (input) {
            inputs[id] = input;
            input.addEventListener('input', saveInputs);
        }
    }, 0);
};

const createSection = (title, contentGenerator) => {
    builder.createParagraph(
        `<div class="fallout-container">
            <div class="fallout-heading">${title}</div>`
    );
    contentGenerator();
    builder.createParagraph('</div>');
};

// Character Info
createSection('Character Info', () => {
    createInput('Name', 'Name');
    createInput('Origin', 'Origin');
    createInput('Level', 'Level', 'number');
    createInput('XP Earned', 'XPEarned', 'number');
    createInput('XP to Next Level', 'XPNext', 'number');
});

// SPECIAL Stats
createSection('S.P.E.C.I.A.L.', () => {
    ['Strength', 'Perception', 'Endurance', 'Charisma', 'Intelligence', 'Agility', 'Luck']
        .forEach(stat => createInput(stat, stat, 'number'));
});

// Derived Stats
createSection('Derived Stats', () => {
    createInput('Melee Damage', 'MeleeDamage', 'number');
    createInput('Defense', 'Defense', 'number');
    createInput('Initiative', 'Initiative', 'number');
    createInput('Luck Points', 'LuckPoints', 'number');
    createInput('Maximum HP', 'MaxHP', 'number');
    createInput('Current HP', 'CurrentHP', 'number');
});

// Armor Section
createSection('Armor', () => {
    createInput('Poison DR', 'PoisonDR', 'number');
    ['Left Arm', 'Head', 'Right Arm', 'Left Leg', 'Body (Outfit)', 'Right Leg'].forEach(location => {
        createInput(`${location} Name`, `${location}_Name`);
        createInput(`${location} Phys DR`, `${location}_PhysDR`, 'number');
        createInput(`${location} En DR`, `${location}_EnDR`, 'number');
        createInput(`${location} Rad DR`, `${location}_RadDR`, 'number');
        createInput(`${location} HP`, `${location}_HP`, 'number');
    });
});

// Skills Section
createSection('Skills', () => {
    ['Athletics', 'Small Guns', 'Energy Weapons', 'Melee Weapons', 'Speech', 'Lockpick', 'Science', 'Survival', 'Barter', 'Big Guns', 'Explosives', 'Medicine', 'Pilot', 'Repair', 'Sneak', 'Throwing', 'Unarmed']
        .forEach(skill => {
            createInput(skill, skill, 'number');
            createInput(`${skill} (Tag)`, `${skill}Tag`, 'checkbox');
        });
});

// Load data when script runs
setTimeout(() => {
    loadInputs();
}, 100);

return builder;
```
