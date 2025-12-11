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
mainContainer.appendChild(tradeContainer);


//Player Section
const playerContainer = document.createElement('div');
playerContainer.style.padding = '6px';
playerContainer.style.backgroundColor = '#325886';
playerContainer.style.borderRadius = '8px';

const playerheaderContainer = document.createElement('div');
playerheaderContainer.style.display = 'grid';
playerheaderContainer.style.gridTemplateColumns = '1fr 1fr';
playerheaderContainer.style.padding = '6px 6px 0px 6px';
playerheaderContainer.style.margingBottom = '0px';
playerContainer.appendChild(playerheaderContainer)

const playerHeader = document.createElement('div');
playerHeader.textContent = "Player";
playerHeader.style.color = '#ffc200';
playerHeader.style.marginLeft = '6px';
playerHeader.style.fontSize = 'large';
playerHeader.style.fontWeight = 'bold';

const playercapsHeader = document.createElement('div');
playercapsHeader.textContent = "Caps: 50";
playercapsHeader.style.textAlign = 'right';
playercapsHeader.style.marginRight = '6px';
playercapsHeader.style.color = '#ffc200';
playercapsHeader.style.fontSize = 'large';
playercapsHeader.style.fontWeight = 'bold';

playerheaderContainer.append(playerHeader, playercapsHeader);



//Exchange Section
const exchangeContainer = document.createElement('div');
exchangeContainer.textContent = "<- 30 caps";
exchangeContainer.style.color = 'black';
exchangeContainer.style.padding = '10px';



//Vendor Section
const vendorContainer = document.createElement('div');
vendorContainer.style.padding = '6px';
vendorContainer.style.backgroundColor = '#325886';
vendorContainer.style.borderRadius = '8px';

const vendorheaderContainer = document.createElement('div');
vendorheaderContainer.style.display = 'grid';
vendorheaderContainer.style.gridTemplateColumns = '1fr 1fr';
vendorheaderContainer.style.padding = '6px 6px 0px 6px';
vendorheaderContainer.style.margingBottom = '0px';
vendorContainer.appendChild(vendorheaderContainer)

const vendorHeader = document.createElement('div');
vendorHeader.textContent = "Vendor";
vendorHeader.style.color = '#ffc200';
vendorHeader.style.marginLeft = '6px';
vendorHeader.style.fontSize = 'large';
vendorHeader.style.fontWeight = 'bold';

const vendorcapsHeader = document.createElement('div');
vendorcapsHeader.textContent = "Caps: 50";
vendorcapsHeader.style.textAlign = 'right';
vendorcapsHeader.style.marginRight = '6px';
vendorcapsHeader.style.color = '#ffc200';
vendorcapsHeader.style.fontSize = 'large';
vendorcapsHeader.style.fontWeight = 'bold';

vendorheaderContainer.append(vendorHeader, vendorcapsHeader);




tradeContainer.append(playerContainer, exchangeContainer, vendorContainer)



//Building the tables
const playerTable = () => {

	const table = document.createElement('table');
	table.style.marginTop = '0px';
	table.style.padding = '0px 6px 6px 6px';
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
	table.style.marginTop = '0px';
	table.style.padding = '0px 6px 6px 6px';
	
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
