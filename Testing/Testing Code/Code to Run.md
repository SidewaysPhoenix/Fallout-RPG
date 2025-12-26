```js-engine
//pull function here
const lib = await engine.importJs("Testing/Testing Code/JS Files to import/foo.js");

//code to run here, use -- variable.function(); to call
const result = lib.testSharedFunction("Vault Dweller");
return engine.markdown.create(result);
```