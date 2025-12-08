```js-engine
// Fallout RPG Character Sheet - Skills Section (Vertical Table Layout with Headers)
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

const createSkills = () => {
    const skills = ['Athletics', 'Small Guns', 'Energy Weapons', 'Melee Weapons', 'Speech', 'Lockpick', 'Science', 'Survival', 'Barter', 'Big Guns', 'Explosives', 'Medicine', 'Pilot', 'Repair', 'Sneak', 'Throwing', 'Unarmed'];

    builder.createParagraph(
        `<div style="border:1px solid #ccc; border-radius:8px; padding:15px; width:100%; max-width:350px; background-color:#325886; text-align:left;">
            <div style="font-weight:bold; font-size:20px; color:#efdd6f; margin-bottom:10px; text-align:center;">Skills</div>
            <table style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr>
                        <th style="color:#efdd6f; text-align:left; padding:5px; font-size:16;">Name</th>
                        <th style="color:#efdd6f; text-align:center; padding:5px; font-size:16;">Tag</th>
                        <th style="color:#efdd6f; text-align:center; padding:5px; font-size:16;">Rank</th>
                    </tr>
                </thead>
                <tbody>
                    ${skills.map(skill => 
                        `<tr>
                            <td style="font-weight:bold; font-size:15; color:#efdd6f; padding:5px; vertical-align:middle;">${skill}</td>
                            <td style="text-align:center; padding:5px; vertical-align:middle;"><input type="checkbox" id="${skill}Tag"></td>
                            <td style="text-align:center; padding:5px;"><input id="${skill}" type="number" style="width:50px; background-color:#fde4c9; color:black;"></td>
                        </tr>`
                    ).join('')}
                </tbody>
            </table>
        </div>`
    );

    skills.forEach(skill => {
        const input = document.getElementById(skill);
        const checkbox = document.getElementById(`${skill}Tag`);
        if (input) {
            inputs[skill] = input;
            input.addEventListener('input', saveInputs);
        }
        if (checkbox) {
            inputs[`${skill}Tag`] = checkbox;
            checkbox.addEventListener('change', saveInputs);
        }
    });
};



// Skills
createSkills();

// Load data when script runs
setTimeout(() => {
    loadInputs();
}, 100);

return builder;
```

