```js-engine
{
let rawTimeRemaining = 0; // Time in seconds
let subTimeAmount = 6;
let intervalID = 0;
let isRunning = false;


//Main Container 
let mainContainer = document.createElement("div");


//Timer Functions
function countDown() {
	if (rawTimeRemaining <= 0) {
		clearInterval(intervalID);
		isRunning = false;
		renderTimer();
	} else {
		rawTimeRemaining -= 1;
		renderTimer();
	}
	
	
}

function startTimer() {
	intervalID = setInterval(countDown,1000);
	isRunning = true;
	startButton.textContent = `Pause timer`;
}

function pauseTimer() {
	clearInterval(intervalID);
	isRunning = false;
	renderTimer();
	startButton.textContent = `Start timer`;
}

function startPauseClick () {
	if (isRunning === false) {
		startTimer()
	} else {
		pauseTimer()
	}
}

function resetTimer() { //come back later to set a default to reset remaining to
	clearInterval(intervalID);
	isRunning = false;
	timeRemaining()
	startButton.textContent = `Start timer`;
}

function subTime() {
	rawTimeRemaining -= subTimeAmount;
	renderTimer()
	if (isRunning === false) {
		startButton.textContent = `Start timer`;
	}
	
}

function timeEntry() {
	//rawTimeRemaining = Number(timeInput.value)
	renderTimer();
	startButton.textContent = `Start timer`;
}

function renderTimer() {
	timeHeader.textContent = `${timeRemainingBreakdown()}`;
}

function timeRemaining() {
	hours = Number(hourInput.value)
	min = Number(minInput.value)
	sec = Number(secInput.value)
	
	rawTimeRemaining = (hours*3600)+(min*60)+(sec)
	renderTimer();
}

function timeRemainingBreakdown() {
	hours = String(Math.floor(rawTimeRemaining/3600))
	remaining = rawTimeRemaining % 3600
	min = String(Math.floor(remaining/60))
	sec = String(remaining % 60)
	
	return `${hours.padStart(2,"0")}:${min.padStart(2,"0")}:${sec.padStart(2,"0")}`
}



//Universal Button Styling
function styleButton(button) {
	button.style.marginRight = "5px";
	button.style.borderRadius = "3px"
	button.style.background = "#ffc200"
	button.style.color = "black"
}

//Universal Button Styling
function styleLabel(label) {
	label.style.marginRight = "5px";
	label.style.alignContent = "center"
	label.style.padding = "5px"
}

function styleInput(input) {
	input.type = "number";
	input.value = 0
	input.style.maxWidth = "50px"
	input.style.borderRadius = "3px"
}

//TimeHeader Container
let timeHeader = document.createElement("div");
timeHeader.textContent = `${timeRemainingBreakdown()}`;
timeHeader.style.marginTop = "120px"
timeHeader.style.fontSize = "12em"
timeHeader.style.textAlign = "center"

// Button creations
let startButton = document.createElement("button");
styleButton(startButton);
startButton.textContent = `Start timer`;

let subButton = document.createElement("button");
styleButton(subButton);
subButton.textContent = `-${subTimeAmount} Sec`;
subButton.style.marginLeft = "5px"

let resetButton = document.createElement("button");
styleButton(resetButton);
resetButton.textContent = `Reset Timer`;
resetButton.style.marginLeft = "5px"






let hourInputLabel = document.createElement("div");
styleLabel(hourInputLabel)
hourInputLabel.textContent = "Hours";
let minInputLabel = document.createElement("div");
styleLabel(minInputLabel)
minInputLabel.textContent = "Minutes";
minInputLabel.style.marginLeft = "15px"
let secInputLabel = document.createElement("div");
styleLabel(secInputLabel)
secInputLabel.textContent = "Seconds";
secInputLabel.style.marginLeft = "15px"


let hourInput = document.createElement("input");
styleInput(hourInput)
let minInput = document.createElement("input");
styleInput(minInput)
let secInput = document.createElement("input");
styleInput(secInput)




startButton.addEventListener("click", startPauseClick);
subButton.addEventListener("click", subTime);
resetButton.addEventListener("click", resetTimer);
hourInput.addEventListener("change", timeRemaining);
minInput.addEventListener("change", timeRemaining);
secInput.addEventListener("change", timeRemaining);

let timeSetContainer = document.createElement("div")
timeSetContainer.style.display = "flex";
timeSetContainer.style.flexDirection = "row";
timeSetContainer.style.padding = "15px"
//timeSetContainer.style.justifyContent = "center"

timeSetContainer.appendChild(hourInputLabel)
timeSetContainer.appendChild(hourInput)
timeSetContainer.appendChild(minInputLabel)
timeSetContainer.appendChild(minInput)
timeSetContainer.appendChild(secInputLabel)
timeSetContainer.appendChild(secInput)


let buttonContainer = document.createElement("div")
buttonContainer.style.display = "flex";
buttonContainer.style.flexDirection = "row";
buttonContainer.style.padding = "15px"

buttonContainer.appendChild(startButton);
buttonContainer.appendChild(subButton);
buttonContainer.appendChild(resetButton);

let headerContainer = document.createElement("div")
headerContainer.style.background = "#325886"
headerContainer.style.borderRadius = "5px"

headerContainer.appendChild(timeSetContainer)
headerContainer.appendChild(buttonContainer)


//Adding Pieces to mainContainer
mainContainer.appendChild(headerContainer)



mainContainer.appendChild(timeHeader);

//Render everything
return mainContainer;
}
```