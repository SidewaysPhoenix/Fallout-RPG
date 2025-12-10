```js-engine

const mainContainer = document.createElement('div');
mainContainer.style.display = 'flex';
mainContainer.style.flexDirection = 'column';
mainContainer.style.gap = '10px';
mainContainer.style.padding = '10px';
mainContainer.style.border = '1px solid #ccc';
mainContainer.style.borderRadius = '10px';
mainContainer.style.backgroundColor = '#FFF3E0';

const tableContainer = document.createElement('div');
mainContainer.append(tableContainer);

const renderTable = () => {
	tableContainer.innerHTML = '';
	
	const table = document.createElement('table');
	
	const headerRow = document.createElement('tr');
	headerRow.innerHTML = '<th>#</th><th>Name</th><th>Cost</th><th>Rarity</th>';
	table.appendChild(headerRow);
	
	const row = document.createElement('tr');
	row.innerHTML = `
		<td style="text-align: left;">${"test1"}</td>
		<td style="text-align: left;">${"test2"}</td>
		<td style="text-align: left;">${"test3"}</td>
		<td style="text-align: left;">${"test4"}</td>`;
	table.appendChild(row);

	tableContainer.appendChild(table);
};


container.appendChild(mainContainer);
renderTable();
```
