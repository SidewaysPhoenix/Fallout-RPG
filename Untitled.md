```js-engine
function getUserScreens() {

	let userScreensFolder = app.vault.getFolderByPath("Terminal/Screens/User_Screens")
	let userScreensList = userScreensFolder.children
	let sortedUserScreensList = userScreensList.sort()
	
	
	let screensCount = userScreensList.length
	let screensString = ""
	
	for (let i = 0; i<screensCount; i++) {
		let screenName = userScreensList[i].basename
		screensString += `${i+1}.  ${screenName}\n`
	}
	console.log(screensString)
	return screensString
}
```

```js-engine
//Height max 22 lines
//Width max 78 characters

//Max characters wall to wall 1,716

function lineSplitting(lines) {
	let checkedLines = [];

	for (let i = 0; i < lines.length; i++) {
		let currentLine = lines[i];

		while (currentLine.length > 78) {
			checkedLines.push(currentLine.slice(0, 78));
			currentLine = currentLine.slice(78);
		}

		checkedLines.push(currentLine);
	}

	return checkedLines;
}


function splitIfPageLarge(string) {  //takes string returns list of pages to be processed
	let stringCount = 0
	let newLineCount = string.split("\n").length - 1;
	let pages = []
	
	if (newLineCount > 22) {
		let lines = string.split("\n")
		let splitLines = lineSplitting(lines)
		let lineCounter = 0
		let currentPage = ""
		
		for (let i = 0; i<splitLines.length; i++) {
			lineCounter += 1
			currentPage += `${splitLines[i]}\n`
			if (lineCounter === 22) {
				currentPage += `${splitLines[i]}\n${" ".repeat(69)}Next Page`
				pages.push(currentPage)
				
				currentPage = ""
				lineCounter = 0
			}
		}
		if (currentPage !== "") {
			pages.push(currentPage);
		}
		return pages
	} else {
		return [string]
	}
}


```