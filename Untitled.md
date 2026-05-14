```js-engine
{
let inputTime = 60
let timeRemaining = 60;
let addTimeAmount = 6


//Main Container 
let mainContainer = document.createElement("div");


//Timer Functions
function startTimer(timeRemaining) {
	timeRemaining = 59;
	timeHeader.textContent = `Time Remaining: ${timeRemaining}`;
	startButton.textContent = `Pause timer`;
}

function addTime(timeRemaining) {
	timeRemaining += addTimeAmount;
	timeHeader.textContent = `Time Remaining: ${timeRemaining}`;
}





//Universal Button Styling
function styleButton(button) {
	button.style.marginRight = "5px";
}

//TimeHeader Container
let timeHeader = document.createElement("div");
timeHeader.textContent = `Time Remaining: ${timeRemaining}`;

// Button creations
let startButton = document.createElement("button");
styleButton(startButton);
startButton.textContent = `Start ${timeRemaining} sec timer`;

let addButton = document.createElement("button");
styleButton(addButton);
addButton.textContent = `+${addTimeAmount} Sec`;


startButton.addEventListener("click", startTimer(timeRemaining));
addButton.addEventListener("click", addTime(timeRemaining));

//Adding Pieces to mainContainer
mainContainer.appendChild(timeHeader)
mainContainer.appendChild(startButton);
mainContainer.appendChild(addButton);



//Render everything
return mainContainer;
}
```