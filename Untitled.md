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

function stopTimer() { //come back later to set a default to reset remaining to
	clearInterval(intervalID);
	isRunning = false;
	//timeRemaining = Number(timeInput.value);
	timeHeader.textContent = `Time Remaining: ${timeInput.value}`;
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
	timeHeader.textContent = `Time Remaining: ${timeRemainingBreakdown()}`;
}

function timeRemaining() {
	hours = Number(hourInput.value)
	if (hours === 0) {
		hours = 1
	}
	min = Number(minInput.value)
	if (min === 0) {
		min = 1
	}
	sec = Number(secInput.value)
	if (sec === 0) {
		sec = 1
	}
	rawTimeRemaining = (hours*3600)+(min*60)+(sec)
	renderTimer();
}

function timeRemainingBreakdown() {
	hours = Math.floor(rawTimeRemaining/3600)
	remaining = rawTimeRemaining % 3600
	min = Math.floor(remaining/60)
	sec = remaining % 60
	
	return `${hours} Hours, ${min} Minutes, ${sec} Seconds`
}



//Universal Button Styling
function styleButton(button) {
	button.style.marginRight = "5px";
}

//Universal Button Styling
function styleLabel(label) {
	label.style.marginRight = "5px";
	label.style.alignContent = "center"
	label.style.padding = "5px"
}

//TimeHeader Container
let timeHeader = document.createElement("div");
timeHeader.textContent = `Time Remaining: ${timeRemainingBreakdown()}`;

// Button creations
let startButton = document.createElement("button");
styleButton(startButton);
startButton.textContent = `Start timer`;

let subButton = document.createElement("button");
styleButton(subButton);
subButton.textContent = `-${subTimeAmount} Sec`;

let stopButton = document.createElement("button");
styleButton(stopButton);
stopButton.textContent = `Stop Timer`;






let hourInputLabel = document.createElement("div");
styleLabel(hourInputLabel)
hourInputLabel.textContent = "Hours";
let minInputLabel = document.createElement("div");
styleLabel(minInputLabel)
minInputLabel.textContent = "Minutes";
minInputLabel.style.marginLeft = "20px"
let secInputLabel = document.createElement("div");
styleLabel(secInputLabel)
secInputLabel.textContent = "Seconds";
secInputLabel.style.marginLeft = "20px"


let hourInput = document.createElement("input");
hourInput.type = "number";
hourInput.value = 0
hourInput.style.maxWidth = "50px"
let minInput = document.createElement("input");
minInput.type = "number";
minInput.value = 0
minInput.style.maxWidth = "50px"
let secInput = document.createElement("input");
secInput.type = "number";
secInput.value = 0
secInput.style.maxWidth = "50px"




startButton.addEventListener("click", startPauseClick);
subButton.addEventListener("click", subTime);
stopButton.addEventListener("click", stopTimer);
hourInput.addEventListener("change", timeRemaining);
minInput.addEventListener("change", timeRemaining);
secInput.addEventListener("change", timeRemaining);

let timeSetContainer = document.createElement("div")
timeSetContainer.style.display = "flex";
timeSetContainer.style.flexDirection = "row";
timeSetContainer.style.padding = "15px"

timeSetContainer.appendChild(hourInputLabel)
timeSetContainer.appendChild(hourInput)
timeSetContainer.appendChild(minInputLabel)
timeSetContainer.appendChild(minInput)
timeSetContainer.appendChild(secInputLabel)
timeSetContainer.appendChild(secInput)


//Adding Pieces to mainContainer
mainContainer.appendChild(timeSetContainer)
mainContainer.appendChild(timeHeader);
mainContainer.appendChild(startButton);
mainContainer.appendChild(subButton);
mainContainer.appendChild(stopButton);



//Render everything
return mainContainer;
}
```