```js-engine
function renderCapsContainer() {
    // ✅ Caps field (global)
    const CapsContainer = document.createElement('div');
    CapsContainer.style.padding = '10px';
    CapsContainer.style.border = '2px solid #e0c9a0';
    CapsContainer.style.borderRadius = '8px';
    CapsContainer.style.backgroundColor = '#325886';
    CapsContainer.style.display = 'flex';
    CapsContainer.style.flexDirection = 'row';
    CapsContainer.style.alignItems = 'center';
    CapsContainer.style.marginBottom = '10px'; // ✅ Ensures spacing below
    CapsContainer.style.width = "100%";
    CapsContainer.style.maxWidth = "200px";
    CapsContainer.style.maxHeight = "50px";
    CapsContainer.style.gap = "15px";

    const CapsLabel = document.createElement('strong');
    CapsLabel.textContent = 'Caps';
    CapsLabel.style.color = '#EFDD6F';

    const decreaseIcon = document.createElement('span');
    decreaseIcon.textContent = "−";
    decreaseIcon.style.cursor = "pointer";
    decreaseIcon.style.color = "#ffc200";
    decreaseIcon.style.fontSize = "25px";
    decreaseIcon.style.marginLeft = "15px"
    

    const increaseIcon = document.createElement('span');
    increaseIcon.textContent = "+";
    increaseIcon.style.cursor = "pointer";
    increaseIcon.style.color = "#ffc200";
    increaseIcon.style.fontSize = "25px";

    // ✅ Load stored Caps value
    const CAPS_KEY = 'fallout_Caps';
    let storedValue = localStorage.getItem(CAPS_KEY) || '0';

    // ✅ Displayed number (Click to edit)
    const CapsDisplay = document.createElement('span');
    CapsDisplay.textContent = storedValue;
    CapsDisplay.style.minWidth = "30px";
    CapsDisplay.style.textAlign = "center";
    CapsDisplay.style.color = "#fde4c9";
    CapsDisplay.style.cursor = "pointer";
    
    

    // ✅ Editable input field (hidden initially)
    const CapsInput = document.createElement('input');
    CapsInput.type = 'number';
    CapsInput.style.width = '50px';
    CapsInput.style.textAlign = 'center';
    CapsInput.style.backgroundColor = '#fae0be60';
    CapsInput.style.border = '1px solid #fbb4577e';
    CapsInput.style.display = 'none';

    function updateCaps(value) {
        let newValue = parseInt(value, 10);
        if (isNaN(newValue) || newValue < 0) newValue = 0;
        localStorage.setItem(CAPS_KEY, newValue);
        CapsDisplay.textContent = newValue;
        CapsInput.value = newValue;
    }

    // ✅ Handle clicking the CapsDisplay to enter edit mode
    CapsDisplay.onclick = () => {
        CapsInput.value = CapsDisplay.textContent;
        CapsDisplay.style.display = "none";
        CapsInput.style.display = "inline-block";
        CapsInput.focus();
    };

    // ✅ Handle exit from editing
    function exitEditMode(save) {
        if (save) updateCaps(CapsInput.value);
        CapsInput.style.display = "none";
        CapsDisplay.style.display = "inline-block";
    }

    CapsInput.addEventListener("blur", () => exitEditMode(true)); // Save on blur
    CapsInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") exitEditMode(true); // Save on Enter
        if (e.key === "Escape") exitEditMode(false); // Cancel on Escape
    });

    // ✅ Increase/Decrease icons functionality
    decreaseIcon.onclick = () => {
        let newValue = parseInt(CapsDisplay.textContent, 10) - 1;
        if (newValue < 0) newValue = 0;
        updateCaps(newValue);
    };

    increaseIcon.onclick = () => {
        let newValue = parseInt(CapsDisplay.textContent, 10) + 1;
        updateCaps(newValue);
    };

    // ✅ Assemble UI
    CapsContainer.appendChild(CapsLabel);
    CapsContainer.appendChild(decreaseIcon);
    CapsContainer.appendChild(CapsDisplay);
    CapsContainer.appendChild(CapsInput);
    CapsContainer.appendChild(increaseIcon);

    return CapsContainer;
}


// ✅ Return the Caps container so it gets displayed in js-engine
return renderCapsContainer();

```