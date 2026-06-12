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

//stringCount = 0
//let newLineCount = text.split("\n").length - 1;

//if (newLineCount > 22) {
//	
//}

```