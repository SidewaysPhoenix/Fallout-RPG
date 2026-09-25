```js-engine
let salvageNumber = 0;
let AP = 0;
let scrapper = 0;
let totalDice = 0;
let result = ""

const diceConversion = {1:"1", 2:"2", 3:"blank", 4:"blank", 5:"effect", 6:"effect"};

const instructions = "Salvaging items takes 10 minutes per item being salvaged and requires an INT + Repair test with a difficulty of 0. Roll 1 D6 for each junk item salvaged: you receive common materials equal to the total rolled. \n\n You may roll +1 D6 for every AP spent after succeeding on this test, as you salvage more efficiently and secure more materials. \n\n <pre>If you have the Scrapper perk, you also receive one <strong>Uncommon Material</strong> for each effect rolled. \n\nIf you have two ranks in the Scrapper perk, you’ll also receive one <strong>Rare Material</strong> for every <strong>TWO</strong> Effects rolled.</pre>"

const invalidItems = "<h6>Invalid Items</h6> \n ■ Consumable items cannot be salvaged: you cannot unmix chems, nor uncook meat. \n\n\ ■ You cannot salvage ammunition: the means to do so requires tools that are nearly impossible to find in the wasteland."


//--------------------------------------------------Event Listener Functions-------------------------//

function reset() {
	salvageNumber = 0;
	AP = 0;
	scrapper = 0;
	totalDice = 0;
	result = ""
	
	salvageQtyInput.value = 0;
	additionalAPInput.value = 0;
	scrapperRankInput.value = 0;
	resultsContainer.innerHTML = ""
}


function slvgQTY(event) {
	salvageNumber = Number(event.target.value);
	totalDice = salvageNumber + AP;
}


function addAP(event) {
	AP = Number(event.target.value);
	totalDice = salvageNumber + AP;
}


function scrapRank(event) {
	scrapper = Number(event.target.value);
}

function salvage() {
	let rolls = rollAllDice();
	result = resultMessage(rolls);
	resultsContainer.innerHTML = result
}


//--------------------------------------------------End of Event Listener Functions-------------------------//

//-----------------------------------------Dice Roll Functions---------------------------------------//
function singleDiceRoll() {
	return Number(Math.floor(Math.random() * 6) + 1);
}

function rollAllDice() {
	let rolls = {"1":0, "2":0, "blank":0, "effect":0};
	
	for (let i = 0; i < totalDice; i++) {
		rollResult = singleDiceRoll();
		rolls[diceConversion[rollResult]] += 1;
	}
	return rolls
}
//-----------------------------------------End of Dice Roll Functions---------------------------------------//


//---------------------------------------------Message Generation-----------------------------------//
function timeSpentMessage() {
	let totalMinutes = salvageNumber * 10;
	let hours = Math.floor(totalMinutes / 60);
	let minutes = totalMinutes % 60;
	
	if (salvageNumber < 6) {
		return `You spent ${totalMinutes} minutes salvaging`
	} else {
		return `You spent ${Math.floor((salvageNumber * 10)/60)} hours and ${minutes} minutes salvaging`
	}
}


function rollsMessage(rolls) {
	return `and rolled ${totalDice} dice \n\n 1's: ${rolls["1"]} \n 2's: ${rolls["2"]} \n Effects: ${rolls["effect"]} \n Blanks: ${rolls["blank"]}`
}

function materialsMessage(rolls) {
	let commonMaterialsValue = rolls["1"] + (rolls["2"] * 2) + rolls["effect"]
	let uncommonMaterialsValue = rolls["effect"];
	let rareMaterialsValue = Math.floor(rolls["effect"]/2)
	
	
	if (scrapper === 0) {
		uncommonMaterialsValue = 0
		rareMaterialsValue = 0
		return `Succesfully salvaged ${commonMaterialsValue} Common Material !!!`;
	} else if (scrapper === 1) {
		rareMaterialsValue = 0
		return `Succesfully salvaged ${commonMaterialsValue} Common Material, ${uncommonMaterialsValue} Uncommon Material !!!`;
	} else if (scrapper === 2) {
		return `Succesfully salvaged ${commonMaterialsValue} Common Material, ${uncommonMaterialsValue} Uncommon Material, ${rareMaterialsValue} Rare Material !!!`;
	}
	
	
}


function resultMessage(rolls) {
	return `${timeSpentMessage()} ${rollsMessage(rolls)} \n\n ${materialsMessage(rolls)}`
}
//--------------------------------------------------End of Message Generation---------------------------------//



//--------------Style Functions------------//


function styleInput(input) {
	input.type = "number";
	input.value = 0;
	input.style.maxWidth = "50px";
	input.style.borderRadius = "3px";
}


function styleLabel(label) {
	label.style.marginRight = "5px";
	label.style.alignContent = "center";
	label.style.padding = "5px";
}


//Universal Button Styling
function styleButton(button) {
	button.style.borderRadius = "3px";
	button.style.background = "#ffc200";
	button.style.color = "black";
	button.style.justifySelf = "center";
}


//-------------------------------------------------------------Containers---------------------------------------------//


let mainContainer = document.createElement("div");
mainContainer.style.background = "#325886";
mainContainer.style.borderRadius = "5px";
mainContainer.style.width = "100%";
mainContainer.style.minHeight = "80vh";
mainContainer.style.padding = "0";
mainContainer.style.margin = "0";
mainContainer.style.overflow = "hidden";
mainContainer.style.display = "grid";



let headerContainer = document.createElement("div");
headerContainer.style.display = "flex";
headerContainer.style.padding = "10px";
headerContainer.style.gap = "15px"



//----------------Selections Container--------------//
let selectionsContainer = document.createElement("div");
selectionsContainer.style.display = "grid";
selectionsContainer.style.gap = "10px";
selectionsContainer.style.border = "2px solid #ffc200";
selectionsContainer.style.borderRadius = "8px"
selectionsContainer.style.padding = "12px";
selectionsContainer.style.maxHeight = "250px";
selectionsContainer.style.minWidth = "150px";

 


//Salvage Qty
let salvageQty = document.createElement("div");
salvageQty.style.display = "flex"
salvageQty.style.justifyContent = "space-between"; salvageQty.style.alignItems = "center";
let salvageQtyLabel = document.createElement("label");
styleLabel(salvageQtyLabel);
salvageQty.textContent = "Qty to Salvage";
let salvageQtyInput = document.createElement("input")
styleInput(salvageQtyInput);

salvageQtyInput.addEventListener("change", slvgQTY);

salvageQty.appendChild(salvageQtyLabel);
salvageQty.appendChild(salvageQtyInput);



//Additional AP
let additionalAP = document.createElement("div");
additionalAP.style.display = "flex"
additionalAP.style.justifyContent = "space-between"; additionalAP.style.alignItems = "center";
let additionalAPLabel = document.createElement("label");
styleLabel(additionalAPLabel);
additionalAP.textContent = "AP Spent";
let additionalAPInput = document.createElement("input");
styleInput(additionalAPInput);

additionalAPInput.addEventListener("change", addAP);

additionalAP.appendChild(additionalAPLabel);
additionalAP.appendChild(additionalAPInput);


//ScrapperRank
let scrapperRank = document.createElement("div");
scrapperRank.style.display = "flex"
scrapperRank.style.justifyContent = "space-between"; scrapperRank.style.alignItems = "center";
let scrapperRankLabel = document.createElement("label");
styleLabel(scrapperRankLabel);
scrapperRank.textContent = "Scrapper Rank";
let scrapperRankInput = document.createElement("input");
styleInput(scrapperRankInput);

scrapperRankInput.addEventListener("change", scrapRank);

scrapperRank.appendChild(scrapperRankLabel);
scrapperRank.appendChild(scrapperRankInput);


//Reset
let resetButton = document.createElement("button");
styleButton(resetButton);
resetButton.textContent = `Reset`;
resetButton.style.alignSelf = "bottom";
resetButton.style.width = "65%";


resetButton.addEventListener("click", reset);


selectionsContainer.appendChild(salvageQty);
selectionsContainer.appendChild(additionalAP);
selectionsContainer.appendChild(scrapperRank);
selectionsContainer.appendChild(resetButton);

//--------------End of SelectionsContainer------------------//


//-----------------------------Instructions Container-----------------------------------//

let instructionsContainer = document.createElement("div");
instructionsContainer.innerHTML = instructions;
instructionsContainer.style.whiteSpace = "pre-line";
instructionsContainer.style.minWidth = "300px";

instructionsContainer.querySelectorAll("strong").forEach(strong => { 
	strong.style.color = "#ffc200"; 
});
instructionsContainer.querySelectorAll("h6").forEach(h6 => { 
	h6.style.color = "#ffc200";
	h6.style.marginBottom = "0px"; 
});


//------------------------End of Instructions Container----------------------------------//

//---------------------Salvage Button--------------------------------//
let salvageButton = document.createElement("button");
styleButton(salvageButton);
salvageButton.textContent = "Begin Salvage";
salvageButton.style.width = "65%";
salvageButton.style.margin = "12px";

salvageButton.addEventListener("click", salvage);

//---------------------End of Salvage Button--------------------------------//

//-------------------------------Results Container---------------------------------------//
let resultsContainer = document.createElement("div");
resultsContainer.innerHTML = result;
resultsContainer.style.whiteSpace = "pre-line";


resultsContainer.querySelectorAll("strong").forEach(strong => { 
	strong.style.color = "#ffc200"; 
});
resultsContainer.querySelectorAll("h6").forEach(h6 => { 
	h6.style.color = "#ffc200";
	h6.style.marginBottom = "0px"; 
});


resultsContainer.style.display = "grid";
resultsContainer.style.border = "2px solid gray";
resultsContainer.style.padding = "10px";
resultsContainer.style.margin = "12px";
resultsContainer.style.minHeight = "60vh";
//-------------------------------End of Results Container---------------------------------------//


//---------------------------------End of Containers-----------------------------------------------//


headerContainer.appendChild(selectionsContainer);
headerContainer.appendChild(instructionsContainer);
mainContainer.appendChild(headerContainer);
mainContainer.appendChild(salvageButton);
mainContainer.appendChild(resultsContainer);


return mainContainer;

```