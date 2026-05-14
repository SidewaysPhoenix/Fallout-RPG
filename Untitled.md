```js-engine
{
let timeRemaining = 0;
let addTimeAmount = 6;
let intervalID = 0;
let isRunning = false;


//Main Container 
let mainContainer = document.createElement("div");


//Timer Functions
function countDown() {
	if (timeRemaining <= 0) {
		clearInterval(intervalID);
		isRunning = false;
		renderTimer();
	} else {
		timeRemaining -= 1;
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
	startButton.textContent = `Start ${timeRemaining} second timer`;
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
	timeRemaining = Number(timeInput.value);
	timeHeader.textContent = `Time Remaining: ${timeInput.value} seconds`;
	startButton.textContent = `Start ${timeInput.value} second timer`;
}

function addTime() {
	timeRemaining += addTimeAmount;
	renderTimer()
	if (isRunning === false) {
		startButton.textContent = `Start ${timeRemaining} second timer`;
	}
	
}

function timeEntry() {
	timeRemaining = Number(timeInput.value)
	renderTimer();
	startButton.textContent = `Start ${timeRemaining} second timer`;
}

function renderTimer() {
	timeHeader.textContent = `Time Remaining: ${timeRemaining} seconds`;
}



//Universal Button Styling
function styleButton(button) {
	button.style.marginRight = "5px";
}

//TimeHeader Container
let timeHeader = document.createElement("div");
timeHeader.textContent = `Time Remaining: ${timeRemaining} seconds`;

// Button creations
let startButton = document.createElement("button");
styleButton(startButton);
startButton.textContent = `Start ${timeRemaining} second timer`;

let addButton = document.createElement("button");
styleButton(addButton);
addButton.textContent = `+${addTimeAmount} Sec`;

let stopButton = document.createElement("button");
styleButton(stopButton);
stopButton.textContent = `Stop Timer`;

let timeInput = document.createElement("input");
timeInput.id = "timeToInput"
timeInput.type = "number";
timeInput.value = 0


startButton.addEventListener("click", startPauseClick);
addButton.addEventListener("click", addTime);
stopButton.addEventListener("click", stopTimer);
timeInput.addEventListener("change", timeEntry);



//Adding Pieces to mainContainer
mainContainer.appendChild(timeInput);
mainContainer.appendChild(timeHeader);
mainContainer.appendChild(startButton);
mainContainer.appendChild(addButton);
mainContainer.appendChild(stopButton);



//Render everything
return mainContainer;
}
```