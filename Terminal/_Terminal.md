```js-engine
{



let overlayImagePath = "Terminal/Terminal_Overlay.png"

let bootupPath = "Terminal/Screens/Bootup.md"
let mainMenuPath = "Terminal/Screens/Main Menu.md"






let currentIndex = 0;
let junkCharacters = ["#", "@", "%", "&", "/", "\\", "_", "█"];
let hasSkipped = false
let isSkipRequested = false
let terminalMode = "booting"

let userScreensCount = 0
let userScreensList = []



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


async function readNote(path) {
	let file = app.vault.getAbstractFileByPath(path)
	let noteString = await app.vault.read(file)
	return noteString
}


function sleep(ms) {
	return new Promise(function (resolve) {
		setTimeout(resolve, ms)
	})
}



async function typeText(currentString) {
	while (currentIndex < currentString.length) {  
		terminalMode = "typing"
		let currentCharacter = currentString[currentIndex];
		let delay = 5;
		
		//Junk Characters setup------------------
		//---------------------------------------
		let randomIndex = Math.floor(Math.random() * junkCharacters.length);
		let junkCharacter = junkCharacters[randomIndex];
		let shouldGlitch = Math.random() < 0.15;
		let glitchDelay = 45;
		
		if (isSkipRequested) {
			let lastCharacter = textOutput.textContent[textOutput.textContent.length - 1];
			
			textOutput.textContent += currentString.slice(currentIndex, currentString.length);
			currentIndex = currentString.length + 1
			return
		}
		
		if (currentCharacter === ".") {  
			delay = 80;  
		}  
		  
		if (currentCharacter === "\n") {  
			delay = 100;  
		}
		
		if (shouldGlitch) {
			textOutput.textContent += junkCharacter;
			await sleep(glitchDelay)
			
			textOutput.textContent = textOutput.textContent.slice(0, -1);
			textOutput.textContent += currentCharacter;
			currentIndex++;
				
			await sleep(delay)
			
		} else {
			textOutput.textContent += currentCharacter;
			currentIndex++;
			
			await sleep(delay)
		}
	}
}



function handleKeyDown(event) {
	if (event.key === " ") {  
		event.preventDefault()
		isSkipRequested = true;  
		return;  
	}  
		  
	if (terminalMode === "mainMenu") {  
		screenSelection(event);  
	}
	
	if (terminalMode === "userScreen" && event.key === "Escape") {
		showMainMenu()
	}
}

async function screenSelection(event) {
	let selectedNumber = Number(event.key)
	
	if (selectedNumber >=1 && selectedNumber <= userScreensCount) {
		let selectedFile = userScreensList[selectedNumber-1]
		let path = selectedFile.path
		let selectedString = await readNote(path)
		
		clearScreen()
		runningString = selectedString
		await typeText(runningString);
		terminalMode = "userScreen"	
	}
}

async function showBootup() {
	clearScreen()
	terminalMode = "booting"
	
	let bootupString = await readNote(bootupPath)
	runningString = bootupString
	
	await typeText(runningString);	
}

async function showMainMenu() {
	clearScreen()
	
	let mainMenuString = await readNote(mainMenuPath)
	let screensString = getUserScreens()
	mainMenuString = `${mainMenuString}\n\n\n${screensString}`
	runningString = mainMenuString
	
	//Text Output
	await typeText(runningString);
	terminalMode = "mainMenu"
}

function clearScreen() {
	textOutput.textContent = ""
	currentIndex = 0
	isSkipRequested = false	
}

function getUserScreens() {
	let userScreensFolder = app.vault.getFolderByPath("Terminal/Screens/User_Screens")
	userScreensList = userScreensFolder.children
	userScreensCount = userScreensList.length
	let screensString = ""
	
	for (let i = 0; i<userScreensCount; i++) {
		let screenName = userScreensList[i].basename
		screensString += `${i+1}.  ${screenName}\n`
	}
	return screensString
}





let mainContainer = document.createElement("div");
mainContainer.tabIndex = 0
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
textContainer.style.padding = "clamp(15px, 5cqw, 70px)";
textContainer.style.fontSize = "clamp(4px, 1.55cqw, 14px)";
textContainer.style.border = "2px solid #39ff6a";  
textContainer.style.borderRadius = "20px";  

textContainer.style.backgroundImage = "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)";
textContainer.style.textShadow = "0 0 5px currentColor";

setInterval(function () {
	textContainer.style.opacity = 0.94 + Math.random() * 0.06;
}, 100);


let textOutput = document.createElement("span");




textContainer.appendChild(textOutput)
textContainer.appendChild(cursor)

mainContainer.appendChild(overlayImg)
mainContainer.appendChild(textContainer);



async function startTerminal() {
	await showBootup()
	await sleep(1000)
	await showMainMenu()
}

mainContainer.addEventListener("click", function () {
	mainContainer.focus()
})

mainContainer.addEventListener("keydown", handleKeyDown);
startTerminal()


return mainContainer;


}
```

