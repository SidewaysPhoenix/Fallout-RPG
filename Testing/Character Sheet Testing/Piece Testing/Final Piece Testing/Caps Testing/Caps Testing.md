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
    CapsContainer.style.maxWidth = "400px";
    CapsContainer.style.maxHeight = "50px";
    CapsContainer.style.gap = "10px";

    const CapsLabel = document.createElement('strong');
    CapsLabel.textContent = 'Caps';
    CapsLabel.style.color = '#EFDD6F';

    const decreaseIcon = document.createElement('span');
    decreaseIcon.textContent = "➖";
    decreaseIcon.style.cursor = "pointer";
    decreaseIcon.style.color = "#FFC200";
    decreaseIcon.style.fontSize = "16px";

    const CapsInput = document.createElement('input');
    CapsInput.type = 'number';
    CapsInput.style.width = '50px';
    CapsInput.style.textAlign = 'center';
    CapsInput.style.backgroundColor = '#fae0be60';
    CapsInput.style.border = '1px solid #fbb4577e';

    const increaseIcon = document.createElement('span');
    increaseIcon.textContent = "➕";
    increaseIcon.style.cursor = "pointer";
    increaseIcon.style.color = "#FFC200";
    increaseIcon.style.fontSize = "16px";

    // ✅ Load stored Caps value
    const CAPS_KEY = 'fallout_Caps';
    CapsInput.value = localStorage.getItem(CAPS_KEY) || '0'; // Default to 0 if no value

    // ✅ Ensure input is always a valid number
    function updateCaps(value) {
        let newValue = parseInt(value, 10);
        if (isNaN(newValue)) newValue = 0;
        CapsInput.value = newValue;
        localStorage.setItem(CAPS_KEY, newValue);
    }

    // ✅ Increase Caps
    increaseIcon.onclick = () => {
        updateCaps(parseInt(CapsInput.value, 10) + 1);
    };

    // ✅ Decrease Caps (Minimum 0)
    decreaseIcon.onclick = () => {
        let newValue = parseInt(CapsInput.value, 10) - 1;
        if (newValue < 0) newValue = 0;
        updateCaps(newValue);
    };

    // ✅ Save manually entered values
    CapsInput.addEventListener('input', () => {
        updateCaps(CapsInput.value);
    });

    // ✅ Assemble UI
    CapsContainer.appendChild(CapsLabel);
    CapsContainer.appendChild(decreaseIcon);
    CapsContainer.appendChild(CapsInput);
    CapsContainer.appendChild(increaseIcon);

    return CapsContainer;
}

// ✅ Return the Caps container so it gets displayed in js-engine
return renderCapsContainer();


// ✅ Return the Caps container so it gets displayed in js-engine
return renderCapsContainer();

```