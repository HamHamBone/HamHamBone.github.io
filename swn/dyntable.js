var DynTable = function(columns) {
	this.tableElement = document.createElement("table");
	this.tableElement.classList.add('dyntable');
	this.colgroupElement = document.createElement('colgroup');
	this.headElement = document.createElement("thead");
	this.bodyElement = document.createElement("tbody");
	
	this.tableElement.appendChild(this.colgroupElement);
	this.tableElement.appendChild(this.headElement);
	this.tableElement.appendChild(this.bodyElement);
	
	this.columns = columns;
	this.rowData = [];
	
	this.editTemplate = null;
	this.editCallback = null;
	this.editPath = null;
	
	for (var i = 0; i < columns.length; i++) {
		var colElement = document.createElement('col');
		this.colgroupElement.appendChild(colElement);
		
		this.columns[i].element = colElement;
		this.columns[i].index = i;
	}
	
	this.editColumn = document.createElement('col');
	this.editColumn.classList.add('edit-column');
	this.colgroupElement.appendChild(this.editColumn);
	
	for (var i = 0; i < columns.length; i++) {
		var cellElement = document.createElement('td');
		cellElement.innerText = columns[i].name.toString();
		var self = this;
		cellElement.addEventListener('click', makeSortCallback(i, this));
		this.headElement.appendChild(cellElement);
	}
	
	function makeSortCallback(index, self) {
		return (function(event) { self.sort(index); });
	}
}

// *****************************************************************************

DynTable.validateHasAttribute = function(object, key) {
	let attributeChain = key.split('.');

	for (let i = 0; i < attributeChain.length; i++) {
		if (attributeChain[i] in object) {
			object = object[attributeChain[i]];
		} else {
			return false;
		}
	}
	return true;
}

DynTable.setAttributeByString = function(object, key, value) {
	let attributeChain = key.split('.');
	
	for (let i = 0; i < attributeChain.length; i++) {
		if (attributeChain[i] in object) {
			object = object[attributeChain[i]];
		} else {
			let next = i < attributeChain.length-1 ? {} : value;
			object[attributeChain[i]] = next;
			object = next;
		}
	}
}

DynTable.getAttributeByString = function(object, key) {
	let attributeChain = key.split('.');
	
	for (let i = 0; i < attributeChain.length; i++) {
		if (attributeChain[i] in object) {
			object = object[attributeChain[i]];
		} else {
			return undefined;
		}
	}
		
	return object;	
}

DynTable.basicColumn = function(name, key) {
	return {
		name:name,
		get:function(object) { return DynTable.getAttributeByString(object, key); },
		set:function(object, value) { DynTable.setAttributeByString(object, key, value); },
		validate:function(object) { return DynTable.validateHasAttribute(object, key); }
	};
}

// *****************************************************************************

DynTable.prototype.getElement = function() {
	return this.tableElement;
}

DynTable.prototype.enableEditing = function(template, callback, path=null) {
	this.editTemplate = template;
	this.editCallback = callback;
	this.editPath = path;
}

DynTable.prototype.setEditFunction = function(func) {
	this.getEditObject = func;
}

DynTable.prototype.addRow = function(object) {
	this._addRowNoValidate(object);
	this._validateColumns();
}

DynTable.prototype._addRowNoValidate = function(object) {
	this.rowData.push(object);
	
	var rowElement = document.createElement('tr');
	this.bodyElement.appendChild(rowElement);	
	
	let self = this;
	
	constructRow();
	
	function constructRow() {
		rowElement.innerHTML = '';
		
		for (var i = 0; i < self.columns.length; i++) {
			var cellElement = document.createElement('td');
			
			if (self.columns[i].validate === undefined || self.columns[i].validate(object)) {
				cellElement.innerText = self.columns[i].get(object);
			}
			
			rowElement.appendChild(cellElement);
		}
		
		let editCellElement = document.createElement('td');
		editCellElement.classList.add('edit-cell');
		let editElement = document.createElement('div');
		editElement.innerText = 'edit';
		editElement.className = 'textbutton';
		
		editCellElement.appendChild(editElement);
		
		editElement.addEventListener('click', function(event) {
			
			let editObject = object;
			if (self.editPath && DynTable.validateHasAttribute(editObject, self.editPath)) {
				editObject = DynTable.getAttributeByString(editObject, self.editPath);
			}
			
			DynEdit.edit('Editing', editObject, self.editTemplate, function() {
				constructRow();
				self._validateColumns();
				
				if (self.editCallback) {
					self.editCallback();
				}
			});
		});
		
		rowElement.appendChild(editCellElement);
	}
}

DynTable.prototype.setColumnVisible = function(index, isVisible) {
	let rows = this.bodyElement.childNodes;
	
	for (let row of rows) {
		setNthCell(row);
	}
	
	setNthCell(this.headElement);
	
	function setNthCell(row) {
		let cells = row.childNodes;
		
		if (cells.length <= index) {
			return;
		}
		
		let cell = cells[index];
		
		if (isVisible) {
			cell.classList.remove('dyntable-hidden');
		} else {
			cell.classList.add('dyntable-hidden');
		}		
	}
}

DynTable.prototype.addRows = function(objects) {
	for (var i = 0; i < objects.length; i++) {
		this._addRowNoValidate(objects[i]);
	}
	this._validateColumns();
}

DynTable.prototype.sort = function(rowIndex, reverse=false) {
	var rowElements = Array.from(this.bodyElement.childNodes);
	
	this.bodyElement.innerHTML = '';
	
	rowElements = rowElements.sort(function(rowA, rowB) {
		var cellA = Array.from(rowA.childNodes)[rowIndex].innerText;
		var cellB = Array.from(rowB.childNodes)[rowIndex].innerText;
		if (cellA == cellB) { return 0; }
		return ((cellA < cellB) != reverse) ? -1 : 1;
	});
	
	for (var i = 0; i < rowElements.length; i++) {
		this.bodyElement.appendChild(rowElements[i]);
	}
}

DynTable.prototype._validateColumns = function() {
	
	for (var i = 0; i < this.columns.length; i++) {
		var column = this.columns[i];
		
		var visibleColumn = false;
		
		if (column.validate === undefined) {
			visibleColumn = true;
		} else {			
			for (var j = 0; j < this.rowData.length; j++) {
				var rowObj = this.rowData[j];
				
				if (column.validate(rowObj)) {
					visibleColumn = true;
					break;
				}
			}
		}

		this.setColumnVisible(column.index, visibleColumn);
	}
}