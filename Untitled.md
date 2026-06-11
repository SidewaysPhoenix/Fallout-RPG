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