```js-engine

const mainContainer = document.createElement('div');
mainContainer.style.display = 'flex';
mainContainer.style.flexDirection = 'column';
mainContainer.style.gap = '10px';
mainContainer.style.padding = '10px';
mainContainer.style.border = '1px solid #ccc';
mainContainer.style.borderRadius = '10px';
mainContainer.style.backgroundColor = '#FFF3E0';
mainContainer.style.overflowX = 'auto';

const tradeContainer = document.createElement('div');
tradeContainer.style.display = 'grid';
tradeContainer.style.gridTemplateColumns = '1fr auto 1fr';
tradeContainer.style.gap = '6px';
mainContainer.append(tradeContainer);



const playerContainer = document.createElement('div');
tradeContainer.style.padding = '6px';
tradeContainer.append(playerContainer);

const exchangeContainer = document.createElement('div');
exchangeContainer.textContent = "<- 30 caps"
exchangeContainer.style.color = 'black';
exchangeContainer.style.padding = '10px';
tradeContainer.append(exchangeContainer);

const vendorContainer = document.createElement('div');
vendorContainer.style.padding = '6px';
tradeContainer.append(vendorContainer);

const playerTable = () => {

	const table = document.createElement('table');
	
	const headerRow = document.createElement('tr');
	headerRow.innerHTML = '<th>Name</th><th>Name</th><th>Value</th>';
	table.appendChild(headerRow);
	
	const row = document.createElement('tr');
	row.innerHTML = `
		<td style="text-align: left;">${"test1"}</td>
		<td style="text-align: left;">${"test2"}</td>
		<td style="text-align: left;">${"test3"}</td>`;
	table.appendChild(row);

	playerContainer.appendChild(table);
};

const vendorTable = () => {
	
	const table = document.createElement('table');
	
	const headerRow = document.createElement('tr');
	headerRow.innerHTML = '<th>#</th><th>Name</th><th>Value</th>';
	table.appendChild(headerRow);
	
	const row = document.createElement('tr');
	row.innerHTML = `
		<td style="text-align: left;">${"test1"}</td>
		<td style="text-align: left;">${"test2"}</td>
		<td style="text-align: left;">${"test3"}</td>`;
	table.appendChild(row);

	vendorContainer.appendChild(table);
};


container.appendChild(mainContainer);
playerTable();
vendorTable();
```
