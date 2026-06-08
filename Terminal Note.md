```js-engine

let textString = "test";

let mainContainer = document.createElement("div");

let textContainer = document.createElement("div");
textContainer.textContent = `${textString}`

mainContainer.appendChild(textContainer);

return mainContainer;

```