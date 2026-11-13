```js-engine
let mainContainer = document.createElement("div");
let optionsContainer = document.createElement("div");


const diceType = document.createElement("select");
const effectType = document.createElement("div");

function createLabelStyling(label) {
	label.style.width = "fit-content"
	label.style.padding = "2px"
	label.style.minHeight = "30px"
	label.style.alignContent = "center"
}

function createInputFieldStying(inputField) {
	inputField.style.minHeight = "32px"
	inputField.style.width = "50px"
	inputField.style.marginLeft = "8px"
	inputField.style.padding = "2px"
	inputField.style.borderRadius = "6px" 
	inputField.style.background = "#f3e6c9"
	inputField.style.color = "#17212a"
	inputField.style.caretColor = "#17212a"
	inputField.style.textAlign = "center"
	inputField.style.justifyText = "center"
}

function checkboxStying(checkbox) {
	checkbox.style.height = "16px"
	checkbox.style.width = "16px"
	checkbox.style.borderRadius = "4px"
	checkbox.style.position = "relative";
	checkbox.style.top = "3px"; 
}

//DICE SELECTION
["D6 (Combat Die)", "D20 (Tests)"].forEach(text => {
	const option = document.createElement("option");
	  option.value = text;
	  option.textContent = text;
	  diceType.appendChild(option);
});

//DAMAGE EFFECTS
const effectTypeLegend = document.createElement("legend");
effectType.textContent = "Please select all damage effects for the roll.";
effectType.appendChild(effectTypeLegend);

const effectFields = {};

["Arc", "Breaking", "Burst", "Freeze", "Persistent", "Piercing", "Radioactive", "Spread", "Stun", "Vicious", "None"].forEach(text => {
	const label = document.createElement("label");
	  createLabelStyling(label);
	  label.style.display = "block";
	  
	const checkbox = document.createElement("input");
		checkboxStying(checkbox)
		checkbox.type = "checkbox";
		checkbox.value = text;
		effectFields[text] = checkbox;
	  
	label.appendChild(checkbox);
	label.appendChild(document.createTextNode(` ${text}`));
	if (text === "Piercing") {
		const piercingRankLabel = document.createElement("label")
		piercingRankLabel.textContent = "Piercing Rank";
		piercingRankLabel.style.display = "none"
		
		
		const piercingInput = document.createElement("input");
		createInputFieldStying(piercingInput);
		piercingRankLabel.appendChild(piercingInput);
		piercingRankLabel.hidden = true;
		
		effectFields.Piercing.addEventListener("change", () => {
			piercingRankLabel.hidden = !effectFields.Piercing.checked;
			piercingRankLabel.style.display = effectFields.Piercing.checked ? "block" : "none";
			piercingInput.focus();
		});

		
		label.appendChild(piercingRankLabel);
	};
	effectType.appendChild(label);
});

//D20 OPTIONS
const d20Options = document.createElement("div")
d20Options.style.display = "none";


const tnLabel = document.createElement("label");
tnLabel.textContent = "TN (Attribute + Skill)"
createLabelStyling(tnLabel);
const tnInput = document.createElement("input");
createInputFieldStying(tnInput);
tnLabel.appendChild(tnInput);
d20Options.appendChild(tnLabel);

const tagLabel = document.createElement("label");
tagLabel.textContent = "TN (Attribute + Skill)"
createLabelStyling(tagLabel);
const tagInput = document.createElement("input");
createInputFieldStying(tagInput);
tagLabel.appendChild(tagInput);
d20Options.appendChild(tagLabel);

const complicationsLabel = document.createElement("label");
complicationsLabel.textContent = "Minimum Complication Amount"
createLabelStyling(complicationsLabel);
const complicationsInput = document.createElement("input");
createInputFieldStying(complicationsInput);
complicationsInput.value = 20
complicationsLabel.appendChild(complicationsInput);
d20Options.appendChild(complicationsLabel);

//SELECTION LISTENER
diceType.addEventListener("change", () => {
	effectType.hidden = diceType.value !== "D6 (Combat Die)";
	d20Options.style.display =
	    diceType.value === "D20 (Tests)" ? "grid" : "none";
});

const rollQTYLabel = document.createElement("label");
rollQTYLabel.textContent = "Quantity of dice to roll";
createLabelStyling(rollQTYLabel);
const rollQTYInput = document.createElement("input");
createInputFieldStying(rollQTYInput);
rollQTYLabel.appendChild(rollQTYInput);



optionsContainer.appendChild(diceType);
optionsContainer.appendChild(effectType);
optionsContainer.appendChild(d20Options);
optionsContainer.appendChild(rollQTYLabel)
mainContainer.appendChild(optionsContainer);

return mainContainer;
```



	mainContainer
		optionsContainer
			diceTypeContainer //SELECTION BOX
				D6 (Combat Die)
					damageEffectsContainer //CHECKBOXES
						piercingInputContainer //INPUT FIELD used if Piercing is selected
				D20 (Tests)
					complicationsContainer //INPUT FIELD for minimum complication amount
					tnContainer// INPUT FIELD for test TN
					tagContainer// INPUT FIELD for test critical max
			rollQtyContainer //INPUT FIELD
			selectionSummaryContainer // DISPLAY TEXT 
			rollButton //BUTTON
		resultsContainer
			rolledResultsContainer //DISPLAY TEXT
			rerollContainer //CHECKBOXES, select from list of rolled die results to reroll
					d6RerollCounterContainer //INPUT FIELD used to input the amount of d6 wished to reroll
				rollButton //BUTTON shows if an option is selected rolls amount of selected dice again and updates rolledResultsContainer







	selectionSummaryContainer // text ex: 'Rolling 3d20 with a Complication Range of 18-20 and Successes of 16 or lower. Critical Success of 3 or lower.' OR 'Rolling 6d6 with Piercing 3, Breaking, Radioactive'
	
	rolledResultsContainer //text ex: 'Rolled 2 Successes and 1 Complication. [18 *Complication*, 3 *Critical*, 17]' OR 'Rolled \n 1's : 1 \n 2's : 1 \n Effects : 1 \n Blanks :  3 \n\n Resulting in [append effects text after]`