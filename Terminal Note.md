```js-engine
{


//---------------------------------------
//---------------------------------------
let mainString = "ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM\n\n COPYRIGHT 2075-2077 ROBCO INDUSTRIES\n > MEMORY CHECK........OK\n > HOLOTAPE DRIVE......OK\n > USER AUTHORIZATION..PENDING\n\n WELCOME, OVERSEER"; //Austin text goes here
//---------------------------------------
//---------------------------------------


let currentIndex = 0;
let junkCharacters = ["#", "@", "%", "&", "/", "\\", "_", "█"];
let hasSkipped = false
//Cursor setup---------------------------
//---------------------------------------
let cursor = document.createElement("span");
cursor.textContent = "█";
let cursorVisible = true;

setInterval(function () {
	if (cursorVisible === true) {
		cursor.style.visibility = "hidden";
		cursorVisible = false;
	} else {
		cursor.style.visibility = "visible";
		cursorVisible = true;
	}
}, 500);
//---------------------------------------
//---------------------------------------






function typeNextCharacter() {
	if (currentIndex >= mainString.length) {  
		return;  
	}
	
	let currentCharacter = mainString[currentIndex];
	let delay = 65;
	
	if (currentCharacter === ".") {  
		delay = 300;  
	}  
	  
	if (currentCharacter === "\n") {  
		delay = 500;  
	}
	
	//Junk Characters setup------------------
	//---------------------------------------
	let randomIndex = Math.floor(Math.random() * junkCharacters.length);
	let junkCharacter = junkCharacters[randomIndex];
	let shouldGlitch = Math.random() < 0.15;
	let glitchDelay = 120;
	
	if (shouldGlitch) {
		textOutput.textContent += junkCharacter;
		setTimeout(function () {
			if (currentIndex >= mainString.length) {  
				return;  
			}
			textOutput.textContent = textOutput.textContent.slice(0, -1);
			textOutput.textContent += currentCharacter;
			currentIndex++;
			
			setTimeout(typeNextCharacter, delay);
		}, glitchDelay);
		
		
	} else {
		if (currentIndex >= mainString.length) {  
			return;  
		}
		textOutput.textContent += currentCharacter;
		currentIndex++;
		
		setTimeout(typeNextCharacter, delay);
	}
	//---------------------------------------
	//---------------------------------------
	
	
}


function textSkip() {
	let lastCharacter = textOutput.textContent[textOutput.textContent.length - 1];
	
	if (junkCharacters.includes(lastCharacter)) {
			textOutput.textContent = textOutput.textContent.slice(0, -1);
		}
	textOutput.textContent += mainString.slice(currentIndex, mainString.length);
	currentIndex = mainString.length + 1
}



let mainContainer = document.createElement("div");
mainContainer.style.whiteSpace = "pre-wrap"
mainContainer.style.backgroundColor = "#071b0c";  
mainContainer.style.color = "#39ff6a";  
mainContainer.style.fontFamily = "monospace";  
mainContainer.style.padding = "16px";  
mainContainer.style.border = "2px solid #39ff6a";  
mainContainer.style.borderRadius = "4px";  
mainContainer.style.height = "50vh";
mainContainer.style.backgroundImage = "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)";
mainContainer.style.textShadow = "0 0 3px currentColor";

//setInterval(function () {
//	mainContainer.style.opacity = 0.94 + Math.random() * 0.06;
//}, 100);

window.addEventListener("keydown", function (event) {
	if (event.key === " ") {
		textSkip()
	}
});



//window.addEventListener("click", textSkip);

let textOutput = document.createElement("span");

mainContainer.appendChild(textOutput);
mainContainer.appendChild(cursor)



typeNextCharacter();

return mainContainer;
}
```