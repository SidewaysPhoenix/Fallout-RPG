```js-engine
{



let overlayImagePath = "Terminal/Terminal_Overlay.png"
let bootupPath = app.vault.getAbstractFileByPath("Terminal/Screens/Bootup.md")


let bootString = await app.vault.read(bootupPath);



let currentIndex = 0;
let junkCharacters = ["#", "@", "%", "&", "/", "\\", "_", "█"];
let hasSkipped = false
let runningString = null





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






function typeNextCharacter(currentString) {
	if (currentIndex >= currentString.length) {  
		return;  
	}
	
	let currentCharacter = currentString[currentIndex];
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
			if (currentIndex >= currentString.length) {  
				return;  
			}
			textOutput.textContent = textOutput.textContent.slice(0, -1);
			textOutput.textContent += currentCharacter;
			currentIndex++;
			
			setTimeout(function () {
				typeNextCharacter(currentString)
			}, delay);
		}, glitchDelay);
		
		
	} else {
		if (currentIndex >= currentString.length) {  
			return;  
		}
		textOutput.textContent += currentCharacter;
		currentIndex++;
		
		setTimeout(function () {
			typeNextCharacter(currentString)
		}, delay);
	}
	//---------------------------------------
	//---------------------------------------
		
}


function textSkip(runningString) {
	let lastCharacter = textOutput.textContent[textOutput.textContent.length - 1];
	
	if (junkCharacters.includes(lastCharacter)) {
			textOutput.textContent = textOutput.textContent.slice(0, -1);
		}
	textOutput.textContent += runningString.slice(currentIndex, runningString.length);
	currentIndex = runningString.length + 1
}


window.addEventListener("keydown", function (event) {
	if (event.key === " ") {
		event.preventDefault();
		textSkip(runningString)
	}
});


let mainContainer = document.createElement("div");
mainContainer.style.position = "relative";  
mainContainer.style.width = "100%";  
mainContainer.style.maxWidth = "calc(90vh * 1.177)";  
mainContainer.style.aspectRatio = "1361 / 1156";  
mainContainer.style.margin = "0 auto";  
mainContainer.style.boxSizing = "border-box";  
mainContainer.style.whiteSpace = "pre-wrap";

let overlayImg = document.createElement("img")
let imageFile = app.vault.getAbstractFileByPath(overlayImagePath);
overlayImg.src = app.vault.adapter.getResourcePath(imageFile.path);
overlayImg.style.position = "absolute";
overlayImg.style.left = "0";
overlayImg.style.top = "0";
overlayImg.style.width = "100%";
overlayImg.style.height = "100%";
overlayImg.style.objectFit = "contain";
overlayImg.style.zIndex = "2";
overlayImg.style.pointerEvents = "none";

let textContainer = document.createElement("div")  
textContainer.style.position = "absolute";
textContainer.style.left = "8%";
textContainer.style.top = "10%";
textContainer.style.width = "83%";
textContainer.style.height = "70%";
textContainer.style.zIndex = "1";

textContainer.style.backgroundColor = "#071b0c";  
textContainer.style.color = "#39ff6a";  
textContainer.style.fontFamily = "monospace";  
textContainer.style.padding = "clamp(15px, 5cqw, 42px)";
textContainer.style.fontSize = "clamp(4px, 1.55cqw, 14px)";
textContainer.style.border = "2px solid #39ff6a";  
textContainer.style.borderRadius = "20px";  

textContainer.style.backgroundImage = "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)";
textContainer.style.textShadow = "0 0 3px currentColor";

setInterval(function () {
	textContainer.style.opacity = 0.94 + Math.random() * 0.06;
}, 100);


let textOutput = document.createElement("span");




textContainer.appendChild(textOutput)
textContainer.appendChild(cursor)

mainContainer.appendChild(overlayImg)
mainContainer.appendChild(textContainer);



runningString = bootString
typeNextCharacter(runningString);


return mainContainer;
}
```