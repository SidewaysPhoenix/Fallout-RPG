```js-engine
let salvageNumber = 0;
let AP = 0;
let scrapper = 0;
let totalDice = 0;
let result = ""

const diceConversion = {1:"1", 2:"2", 3:"blank", 4:"blank", 5:"effect", 6:"effect"};

const instructions = "Salvaging items takes 10 minutes per item being salvaged and requires an INT + Repair test with a difficulty of 0. Roll 1 D6 for each junk item salvaged: you receive common materials equal to the total rolled. <br><br> You may roll +1 D6 for every AP spent after succeeding on this test, as you salvage more efficiently and secure more materials. <br><br> <pre>If you have the Scrapper perk, you also receive one <strong>Uncommon Material</strong> for each effect rolled. <br><br>If you have two ranks in the Scrapper perk, you’ll also receive one <strong>Rare Material</strong> for every <strong>TWO</strong> Effects rolled.</pre>"

const invalidItems = "<h6>Invalid Items</h6> <br> ■ Consumable items cannot be salvaged: you cannot unmix chems, nor uncook meat. <br><br> ■ You cannot salvage ammunition: the means to do so requires tools that are nearly impossible to find in the wasteland."


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
		return `You spent <span style="color:#f3c64d;">${totalMinutes} minutes</span> salvaging`
	} else {
		return `You spent <span style="color:#f3c64d;">${Math.floor((salvageNumber * 10)/60)} hours</span> and <span style="color:#f3c64d;">${minutes} minutes</span> salvaging`
	}
}


function rollsMessage(rolls) {
	return `and rolled <span style="color:#f3c64d;">${totalDice} dice</span> <br><br> 1's: <span style="color:#f3c64d;">${rolls["1"]}</span> <br> 2's: <span style="color:#f3c64d;">${rolls["2"]}</span> <br> Effects: <span style="color:#f3c64d;">${rolls["effect"]}</span> <br> Blanks: <span style="color:#f3c64d;">${rolls["blank"]}</span>`
}

function materialsMessage(rolls) {
	let commonMaterialsValue = rolls["1"] + (rolls["2"] * 2) + rolls["effect"]
	let uncommonMaterialsValue = rolls["effect"];
	let rareMaterialsValue = Math.floor(rolls["effect"]/2)
	
	
	if (scrapper === 0) {
		uncommonMaterialsValue = 0
		rareMaterialsValue = 0
		return `Succesfully salvaged <span style="color:#f3c64d;">${commonMaterialsValue} Common Material</span> !!!`;
	} else if (scrapper === 1) {
		rareMaterialsValue = 0
		return `Succesfully salvaged <span style="color:#f3c64d;">${commonMaterialsValue} Common Material, ${uncommonMaterialsValue} Uncommon Material</span> !!!`;
	} else if (scrapper === 2) {
		return `Succesfully salvaged <span style="color:#f3c64d;">${commonMaterialsValue} Common Material, ${uncommonMaterialsValue} Uncommon Material, ${rareMaterialsValue} Rare Material</span> !!!`;
	}
	
	
}


function resultMessage(rolls) {
	return `${timeSpentMessage()} ${rollsMessage(rolls)} <br><br> ${materialsMessage(rolls)}`
}
//--------------------------------------------------End of Message Generation---------------------------------//



//--------------Style Functions------------//


function styleInput(input) {
	input.type = "number";
	input.value = 0;
	input.style.maxWidth = "50px";
	input.style.borderRadius = "7px";
	input.style.border = "1px solid #537f9b57";
	input.style.background = "#07121b42";
}


function styleLabel(label) {
	label.style.marginRight = "5px";
	label.style.alignContent = "center";
	label.style.padding = "5px";
}


//Universal Button Styling
function styleButton(button) {
	button.style.borderRadius = "3px";
	button.style.background = "#f3c64d";
	button.style.color = "black";
	button.style.justifySelf = "center";
}


//-------------------------------------------------------------Containers---------------------------------------------//


let mainContainer = document.createElement("div");
mainContainer.style.background = "radial-gradient(circle at top right, #2c57772e, transparent 28rem), linear-gradient(180deg, #0e1821, #0b1219)";
mainContainer.style.border = "1px solid #537f9b61"
mainContainer.style.borderRadius = "12px";
mainContainer.style.width = "100%";
mainContainer.style.minHeight = "80vh";
mainContainer.style.padding = "12px";
mainContainer.style.margin = "0";
mainContainer.style.overflow = "hidden";
mainContainer.style.display = "grid";

let headerContainer = document.createElement("div");
headerContainer.style.display = "grid";
headerContainer.style.gridTemplateColumns = "minmax(0, 1fr) auto";
headerContainer.style.alignItems = "end";
headerContainer.style.gap = "18px";
headerContainer.style.padding = "18px 20px";
headerContainer.style.marginBottom = "10px";
headerContainer.style.border = "1px solid #365d78";
headerContainer.style.borderLeft = "5px solid #f3c64d";
headerContainer.style.borderRadius = "10px";
headerContainer.style.background = "linear-gradient(135deg, #142536 0%, #1d3d57 62%, #183149 100%)";
headerContainer.style.boxShadow = "0 10px 28px rgba(0,0,0,.22)";
headerContainer.style.overflow = "hidden";
headerContainer.style.position = "relative";

const overlay = document.createElement("div");
overlay.style.position = "absolute";
overlay.style.inset = "0";
overlay.style.pointerEvents = "none";
overlay.style.background =
  "repeating-linear-gradient(90deg, transparent 0 54px, rgba(255,255,255,.018) 55px 56px)";

headerContainer.appendChild(overlay);

let left = document.createElement("div");

let kicker = document.createElement("div");
kicker.className = "vk-kicker";
kicker.textContent = "VAULT-KIT // TOOLS";
kicker.style.color = "#f3c64d";
kicker.style.fontSize = ".72rem";
kicker.style.fontWeight = "800";
kicker.style.letterSpacing = ".20em";
kicker.style.textTransform = "uppercase";
kicker.style.opacity = ".92";

let toolName = document.createElement("div");
toolName.textContent = "Salvage"
toolName.style.color = "#dce6eb";
toolName.style.fontSize = "clamp(1.6rem, 3vw, 2.45rem)";
toolName.style.fontWeight = "850";
toolName.style.letterSpacing = ".02em";
toolName.style.marginTop = "4px";
toolName.style.textShadow = "0 2px 10px rgba(0,0,0,.35)";

let subtitle = document.createElement("div");
subtitle.className = "vk-character-subtitle";
subtitle.textContent = "Fallout 2d20 Salvaging Helper";
subtitle.style.color = "#98aab5";
subtitle.style.fontSize = ".9rem";
subtitle.style.marginTop = "5px";

let detailsContainer = document.createElement("div");
detailsContainer.style.display = "flex";
detailsContainer.style.padding = "10px";
detailsContainer.style.gap = "15px"

left.append(kicker,toolName,subtitle);
headerContainer.append(left);



//----------------Selections Container--------------//
let selectionsContainer = document.createElement("div");
selectionsContainer.style.display = "grid";
selectionsContainer.style.gap = "10px";
selectionsContainer.style.border = "1px solid #537f9b61";
selectionsContainer.style.borderRadius = "8px";
selectionsContainer.style.padding = "12px";
selectionsContainer.style.maxHeight = "250px";
selectionsContainer.style.minWidth = "150px";
selectionsContainer.style.background = "linear-gradient(180deg,#1b3347 0%,#172a3b 100%)";

 


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
//instructionsContainer.style.whiteSpace = "pre-line";
instructionsContainer.style.minWidth = "300px";

instructionsContainer.querySelectorAll("strong").forEach(strong => { 
	strong.style.color = "#f3c64d"; 
});
instructionsContainer.querySelectorAll("h6").forEach(h6 => { 
	h6.style.color = "#f3c64d";
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
//resultsContainer.style.whiteSpace = "pre-line";


resultsContainer.style.display = "block";
resultsContainer.style.border = "2px solid gray";
resultsContainer.style.padding = "10px";
resultsContainer.style.margin = "12px";
resultsContainer.style.minHeight = "40vh";
resultsContainer.style.maxHeight = "60vh";
resultsContainer.style.background = "#142536";
resultsContainer.style.border = "1px solid #537f9b61";
resultsContainer.style.borderRadius = "8px";
resultsContainer.style.background = "linear-gradient(180deg,#1b3347 0%,#172a3b 100%)";
resultsContainer.style.fontSize = "small";
resultsContainer.style.color = "#dce6eb";

//-------------------------------End of Results Container---------------------------------------//


//---------------------------------End of Containers-----------------------------------------------//

mainContainer.appendChild(headerContainer);
detailsContainer.appendChild(selectionsContainer);
detailsContainer.appendChild(instructionsContainer);
mainContainer.appendChild(detailsContainer);
mainContainer.appendChild(salvageButton);
mainContainer.appendChild(resultsContainer);


return mainContainer;

```