let DynEdit = {};

DynEdit.edit = function(title, object, template=null, callback=null) {
	let modal = DynModal.show();
	
	let parentElem = document.createElement('div');
	parentElem.className = 'dynedit';
	modal.container.appendChild(parentElem);
	
	let data = {};
	
	simpleAppend(parentElem, 'p', title, 'dynedit-title');
	
	let buttonRowElem = simpleAppend(parentElem, 'p');
	let randomizeAllButton = simpleAppend(buttonRowElem, 'span', '(Randomize All)', 'textbutton');
	randomizeAllButton.addEventListener('click', onRandomizeAll);
	appendText(buttonRowElem, ' ');
	let revertAllButton = simpleAppend(buttonRowElem, 'span', '(Revert All)', 'textbutton');
	revertAllButton.addEventListener('click', onRevertAll);
	
	let tableElem = simpleAppend(parentElem, 'table');
	
	for (property in object) {
		let value = object[property];
		
		if (template && template.hide) {
			if (template.hide.indexOf(property) >= 0) {
				continue;
			}
		}
		
		if (!(typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean')) {
			continue;
		}
		
		let propertyData = {
			originalValue:value,
			inputElem:null,
			generator:null,
			type:typeof value
		};
		data[property] = propertyData;
		
		let rowElem = simpleAppend(parentElem, 'p');
		let inputElem = null;
		
		if (template && template.lists) {
			let list = template.lists[property];
			if (list) {		
				inputElem = simpleAppend(rowElem, 'select');
				list = GenUtil.unique(list);
				
				for (let i = 0; i < list.length; i++) {
					let optionElem = document.createElement('option');
					optionElem.text = optionElem.value = list[i];
					inputElem.add(optionElem);
				}
			}
		}
		
		if (inputElem == null) {
			inputElem = simpleAppend(rowElem, 'input');
			
			if (typeof value == 'number') {
				inputElem.type = 'number';
			}
			
			if (typeof value == 'boolean') {
				inputElem.type = 'checkbox'
				inputElem.checked = value;
			}
		}
		
		inputElem.value = object[property];
		propertyData.inputElem = inputElem;
		
		let randomizeButton = '';
		
		if (template && template.generators) {
			let generator = template.generators[property];
			if (generator) {
				propertyData.generator = generator;
				randomizeButton = simpleAppend(rowElem, 'span', '↺', 'dynedit-randomize');
				randomizeButton.title = 'randomize this value';
				
				function addRandomize(generatorFunction, inputElement) {
					randomizeButton.addEventListener('click', function(event) {
						let originalValue = inputElement.value;
						let value = originalValue;
						let count = 10;
						while (count > 0 && value == originalValue) {
							value = generatorFunction();
						}
						inputElement.value = value;
					});
				}
				
				addRandomize(generator, inputElem);
			}
		}
		
		revertButton = simpleAppend(rowElem, 'span', '↩', 'dynedit-randomize');
		revertButton.title = 'revert this value';
		(function(originalValue, inputElement) {
			revertButton.addEventListener('click', function(event) {
				inputElement.value = originalValue;
			});
		})(propertyData.originalValue, inputElem);
		
		appendRow(tableElem, [property + ':' , inputElem, randomizeButton, revertButton]);
	}
	
	buttonRowElem = simpleAppend(parentElem, 'p');
	let saveButton = simpleAppend(buttonRowElem, 'span', '(Save)', 'textbutton');
	saveButton.addEventListener('click', onSave);
	appendText(buttonRowElem, ' ');
	let cancelButton = simpleAppend(buttonRowElem, 'span', '(Cancel)', 'textbutton');
	cancelButton.addEventListener('click', onCancel);
	
	/* ======================================================================== */
	
	function onRandomizeAll() {
		for (property in data) {
			let propertyData = data[property];
			
			if (propertyData.generator !== null) {
				propertyData.inputElem.value = propertyData.generator();
			}
		}
	}
	
	function onRevertAll() {
		for (property in data) {
			let propertyData = data[property];
			propertyData.inputElem.value = propertyData.originalValue;
		}
	}
	
	function onSave() {
		DynModal.hide(modal);
		if (callback) {
			for (property in data) {
				let propertyData = data[property];
				let value = propertyData.inputElem.value;
				if (propertyData.type == 'boolean') {
					value = propertyData.inputElem.checked;
				}
				if (propertyData.type == 'number') {
					console.log(value);
					
					if (!isNaN(value)) {
						value = parseFloat(value);
					} else {
						value = propertyData.originalValue;
					}
					
					console.log(value);
				}
				
				object[property] = value;
			}
			callback(true);
		}
	}
	
	function onCancel() {
		DynModal.hide(modal);
		if (callback) {
			callback(false);
		}
	}
	
	/* ======================================================================== */
	
	function simpleAppend(parent, tag, text='', classes='') {
		let element = document.createElement(tag);
		element.innerText = text;
		element.className = classes;
			
		parent.appendChild(element);
		
		return element;
	}
	
	function appendText(parentElem, content) {
		var textElem = document.createTextNode(content);
		parentElem.appendChild(textElem);
	}
	
	function appendRow(tableElem, rows) {
		let rowElem = simpleAppend(tableElem, 'tr');
		
		
		for (let i = 0; i < rows.length; i++) {
			if (typeof rows[i] == 'string') {
				simpleAppend(rowElem, 'td', rows[i]);
			} else {
				let cellElem = simpleAppend(rowElem, 'td');
				cellElem.appendChild(rows[i]);
			}
		}
		
		return rowElem;
	}
}