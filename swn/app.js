let App = {};

App.legendaryNames = null;
TextLoad.load('generators/data/legends.txt', function(data) { App.legendaryNames = data; });

App.greekLetters = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega'];

App.start = function() {
	document.getElementById('export-url-gm').addEventListener('click', function(event) { this.select(); });
	document.getElementById('export-url-player').addEventListener('click', function(event) { this.select(); });
	
	let modal = DynModal.show();
	let loadingElement = document.createElement('p');
	loadingElement.innerHTML = 'Loading, please wait...';
	modal.container.appendChild(loadingElement);
	
	let generatorContainerElement = document.getElementById('generator-container');
	
	TextLoad.onAllLoad(function() {
		DynModal.hide(modal);
		
		generatorContainerElement.classList.remove('hide-section');
		
		App.initialize();
	});
}

App.initialize = function() {
	let viewerContainerElement = document.getElementById('viewer-container');
	let generatorContainerElement = document.getElementById('generator-container');
	
	let tabElement = document.getElementById('viewer-tabs');
	let tabs = new DynTab(tabElement);
	tabs.setVisibleTab(1); // set the visible tab to the galaxy generator
	
	// ---------------------------------------------------------------------- //
	// set up 'load json file' button
	
	let fileInputElement = document.getElementById('file-input');
	fileInputElement.addEventListener('change', function(event) {	
		let reader = new FileReader();
		reader.onload = function(e) {
			generatorContainerElement.classList.add('hide-section');
			
			try {
				let data = e.target.result;
				let sector = JSON.parse(data);
				App.displaySector(sector);
				tabs.setVisibleTab(1); // set the visible tab to the galaxy generator
				viewerContainerElement.classList.remove('hide-section');
				App.setURL(sector);
			} catch (error) {
				window.alert('Error loading sector from file: ' + error);
				console.warn(error.stack);
				viewerContainerElement.classList.add('hide-section');
				
				generatorContainerElement.classList.remove('hide-section');				
			}
		}
		reader.readAsText(fileInputElement.files[0]);
	});
	
	// ---------------------------------------------------------------------- //
	// set up 'generate sector' button
	
	let generateButtonElement = document.getElementById('generate-button');
	generateButtonElement.addEventListener('click', function(event) {
		generatorContainerElement.classList.add('hide-section');
		
		let sector = App.generateSector();
		App.displaySector(sector);
		tabs.setVisibleTab(1); // set the visible tab to the galaxy generator
		
		viewerContainerElement.classList.remove('hide-section');
		
		App.setURL(sector);
	});
	
	// ---------------------------------------------------------------------- //
	// set up 'back to generator' button
	
	let backLinkElement = document.getElementById('back-button');
	backLinkElement.addEventListener('click', function(event) {
		viewerContainerElement.classList.add('hide-section');
		
		URLParam.clear();
		
		generatorContainerElement.classList.remove('hide-section');	
	});
	
	// ------------------------------------------------------------------------ //
	// check url parameters

	decodeURL();
	
	URLParam.onChange = function() {
		decodeURL();
	}
	
	function decodeURL() {
		let params = URLParam.decode();
		
		if (params.hasOwnProperty('data')) {
			generatorContainerElement.classList.add('hide-section');
			
			try {
				let sector = App.decompressSector(params.data);
				App.displaySector(sector);
				
				tabs.setVisibleTab(1); // set the visible tab to the galaxy generator
				
				viewerContainerElement.classList.remove('hide-section');
			} catch (error) {
				window.alert('Error loading sector via URL: ' + error.message);
				console.trace();
				
				viewerContainerElement.classList.add('hide-section');
				generatorContainerElement.classList.remove('hide-section');
			}		
		}	
	}
}

// ************************************************************************** //

App.compressSector = function(sector) {
	urlString = LZString.compressToEncodedURIComponent(JSON.stringify(sector));
	
	return urlString;
}

App.decompressSector = function(data) {
	let sector = JSON.parse(LZString.decompressFromEncodedURIComponent(data));
	
	return sector;
}

App.setURL = function(sector) {
	URLParam.encode({data:App.compressSector(sector)});
}

// ************************************************************************** //

App.generateSector = function() {
	let sector = {};
	
	let sectorName = App.generateSectorName();
	
	sector.name = sectorName;
	sector.gmMode = true;
	
	sector.systems = WorldGenerator.generate();
	sector.corporations = CorporationGenerator.generate();
	sector.religions = ReligionGenerator.generate();
	sector.politicalGroups = PoliticalGroupGenerator.generate();
	sector.aliens = AlienGenerator.generate();
	
	return sector;
}

App.generateSectorName = function() {
	let name = GenUtil.pickRandom(App.legendaryNames) + " " + GenUtil.pickRandom(App.greekLetters);
	name = GenUtil.capitalize(name);
	return name;
}

App.censorSector = function(sector) {
	let newSector = {};
	
	newSector.name = sector.name;
	newSector.gmMode = false;
	
	newSector.systems = App.censorObjects(sector.systems, ['pointsOfInterest', 'bodies']);
	for (let i = 0; i < newSector.systems.length; i++) {
		let system = newSector.systems[i];
		system.planets = App.censorObjects(system.planets, ['privateNotes', 'tag1', 'tag2', 'terrain']);
	}
	
	newSector.corporations = App.censorObjects(sector.corporations, ['markets', 'strategy', 'valuation']);
	newSector.aliens = App.censorObjects(sector.aliens, ['lenses', 'government', 'body']);
	newSector.religions = App.censorObjects(sector.religions, ['doctrine']);
	newSector.politicalGroups = App.censorObjects(sector.politicalGroups, ['leadership']);
	
	return newSector;
}

// create a clone of the given object, removing the given attributes
App.censorObject = function(object, attributes) {
	let newObject = {};
	
	for (let attribute in object) {
		if (attributes.indexOf(attribute) < 0) {
			newObject[attribute] = object[attribute];
		}
	}
	
	return newObject;
}

App.censorObjects = function(objects, attributes) {
	let newObjects = [];
	
	for (let i = 0; i < objects.length; i++) {
		newObjects.push(App.censorObject(objects[i], attributes));
	}
	
	return newObjects;
}

// ************************************************************************** //

App.displaySector = function(sector) {
	// set up edit mode
	if (sector.gmMode) {
		document.body.classList.remove('no-edit');
	} else {
		document.body.classList.add('no-edit');
	}
	
	// display sector name
	App.displaySectorName(sector);
	
	// set up the export tab
	App.createDownloadLink(sector);
	
	// display the sector hexmap
	App.displayHexmap(sector);
	
	// display the worlds table
	App.displayWorlds(sector);
	
	// create corporations table
	let corporationsOutput = document.getElementById('corporations-output');
	corporationsOutput.innerHTML = '';
	let corporationsTable = new DynTable([
		DynTable.basicColumn('Corporation', 'name'),
		DynTable.basicColumn('Markets', 'markets'),
		DynTable.basicColumn('Ownership', 'ownership'),
		DynTable.basicColumn('Strategy', 'strategy'),
		DynTable.basicColumn('Valuation', 'valuation'),
	]);
	corporationsOutput.appendChild(corporationsTable.getElement());
	corporationsTable.enableEditing(
		{},
		function() {
			App.setURL(sector);
			App.createDownloadLink(sector);
		}
	);
	
	corporationsTable.addRows(sector.corporations);
	corporationsTable.sort(0);
	
	// create religions table
	let religionsOutput = document.getElementById('religions-output');
	religionsOutput.innerHTML = '';
	let religionsTable = new DynTable([
		DynTable.basicColumn('Religion', 'name'),
		DynTable.basicColumn('Leadership', 'leadership'),
		DynTable.basicColumn('Doctrine', 'doctrine'),
	]);
	religionsOutput.appendChild(religionsTable.getElement());
	religionsTable.enableEditing(
		{},
		function() {
			App.setURL(sector);
			App.createDownloadLink(sector);
		}
	);
	
	religionsTable.addRows(sector.religions);
	religionsTable.sort(0);
	
	// create political groups table
	let politicalGroupsOutput = document.getElementById('political-groups-output');
	politicalGroupsOutput.innerHTML = '';
	let politicalGroupsTable = new DynTable([
		DynTable.basicColumn('Political Group', 'name'),
		DynTable.basicColumn('Leadership', 'leadership')
	]);
	politicalGroupsOutput.appendChild(politicalGroupsTable.getElement());
	politicalGroupsTable.enableEditing(
		PoliticalGroupGenerator.template,
		function() {
			App.setURL(sector);
			App.createDownloadLink(sector);
		}
	);	
	
	politicalGroupsTable.addRows(sector.politicalGroups);
	politicalGroupsTable.sort(0);
	
	// create aliens table
	let aliensOutput = document.getElementById('aliens-output');
	aliensOutput.innerHTML = '';
	let aliensTable = new DynTable([
		DynTable.basicColumn('Alien', 'name'),
		DynTable.basicColumn('Type', 'type'),
		DynTable.basicColumn('Body', 'body'),
		DynTable.basicColumn('Lenses', 'lenses'),
		DynTable.basicColumn('Government', 'government'),
	]);
	aliensTable.enableEditing(
		AlienGenerator.template,
		function() {
			App.setURL(sector);
			App.createDownloadLink(sector);
		}
	);	
	aliensOutput.appendChild(aliensTable.getElement());
	
	aliensTable.addRows(sector.aliens);
	aliensTable.sort(0);
}

App.displaySectorName = function(sector) {
	let nameElem = document.createElement('span')
	nameElem.className = 'sector-name';
	nameElem.innerText = "Sector " + sector.name;
	
	let editButtonContainer = document.createElement('span');
	editButtonContainer.className = 'edit-zone';
	
	let editButtonElem = document.createElement('span');
	editButtonElem.innerText = 'edit';
	editButtonElem.className = 'textbutton';
	
	let sectorNameContainer = document.getElementById('sector-name-container')
	sectorNameContainer.innerHTML = '';
	sectorNameContainer.appendChild(nameElem);
	sectorNameContainer.appendChild(editButtonContainer);
	editButtonContainer.appendChild(document.createTextNode(' '));
	editButtonContainer.appendChild(editButtonElem);
	
	editButtonElem.addEventListener('click', function() {
		let title = 'Editing: Sector ' + sector.name;		
		DynEdit.edit(
			title,
			sector,
			{lists:{},generators:{name:() => App.generateSectorName()},hide:['gmMode']},
			function() {
				App.setURL(sector);
				App.createDownloadLink(sector);
				
				App.displaySectorName(sector);
			}
		);
	});
}

App.displayHexmap = function(sector, selectedSystem=null) {
	// clear hexmap tab HTML and then create hexmap tab HTML
	let mapContainerElement = document.getElementById('map-container');
	mapContainerElement.innerHTML = '';
	
	let hexmapInspectorElement = document.createElement('div');
	hexmapInspectorElement.id = 'inspector';
	mapContainerElement.appendChild(hexmapInspectorElement);
	
	let hexmapCanvasElement = document.createElement('canvas');
	hexmapCanvasElement.id = 'hexmap';
	mapContainerElement.appendChild(hexmapCanvasElement);
	
	// draw the hexmap and set up hexmap inspector
	if (selectedSystem == null) { selectedSystem = sector.systems[0]; }
	Hexmap.draw(hexmapCanvasElement, sector, selectedSystem);
	App.displaySystemInspector(hexmapInspectorElement, selectedSystem, sector);
	
	Hexmap.onClickHex(document.getElementById('hexmap'), sector, function(system) {
		App.displaySystemInspector(hexmapInspectorElement, system, sector);
	});	
}

App.displayWorlds = function(sector) {
	// unroll list of systems into list of worlds;
	let worlds = [];
	for (let i = 0; i < sector.systems.length; i++) {
		let system = sector.systems[i];
		for (let j = 0; j < system.planets.length; j++) {
			let planet = system.planets[j];
			worlds.push({system:system, planet:planet});
		}
	}
	
	// create world table
	let worldOutput = document.getElementById('worlds-output');
	worldOutput.innerHTML = '';
	let worldTable = new DynTable([
		{
			name:'XXYY',
			get:function(world) { return '0'+world.system.x+'0'+world.system.y; },
			set:function(world, value) { world.system.x = 0; world.system.y = 0; },
			validate:function(world) { return DynTable.validateHasAttribute(world, 'system.x') && DynTable.validateHasAttribute(world, 'system.y'); }
		},
		DynTable.basicColumn('System', 'system.name'),
		DynTable.basicColumn('World', 'planet.name'),
		DynTable.basicColumn('Atmosphere', 'planet.atmosphere'),
		DynTable.basicColumn('Gravity', 'planet.gravity'),
		DynTable.basicColumn('Temperature', 'planet.temperature'),
		DynTable.basicColumn('Biosphere', 'planet.biosphere'),
		DynTable.basicColumn('Population', 'planet.population'),
		DynTable.basicColumn('Tech Level', 'planet.techLevel'),
		DynTable.basicColumn('Tag', 'planet.tag1'),
		DynTable.basicColumn('Tag', 'planet.tag2'),
		DynTable.basicColumn('Terrain', 'planet.terrain'),
	]);
	worldTable.enableEditing(
		WorldGenerator.planetTemplate,
		function() {
			App.displayHexmap(sector);
			App.setURL(sector);
			App.createDownloadLink(sector);
		},
		'planet'
	);
	worldOutput.appendChild(worldTable.getElement());
		
	worldTable.addRows(worlds);
	worldTable.sort(0);	
}

App.showConfirmation = function(title, callback) {
	let modal = DynModal.show();
	
	let titleNode = document.createElement('p');
	titleNode.innerText = title;
	
	let buttonRowNode = document.createElement('p');
	
	let okButtonNode = document.createElement('span');
	okButtonNode.className = 'textbutton';
	okButtonNode.innerText = 'OK'
	
	let cancelButtonNode = document.createElement('span');
	cancelButtonNode.className = 'textbutton';
	cancelButtonNode.innerText = 'Cancel'
	
	modal.container.appendChild(titleNode);
	modal.container.appendChild(buttonRowNode);
	buttonRowNode.appendChild(okButtonNode);
	buttonRowNode.appendChild(document.createTextNode(' | '));
	buttonRowNode.appendChild(cancelButtonNode);
	
	okButtonNode.addEventListener('click', function(event) {
		DynModal.hide(modal);
		callback(true);
	});
	
	cancelButtonNode.addEventListener('click', function(event) {
		DynModal.hide(modal);
		callback(false);
	});
}

App.displaySystemInspector = function(inspectorElement, system, sector) {
	inspectorElement.innerHTML = '';
	
	let systemHeader = simpleAppend(inspectorElement, 'p');
	simpleAppend(systemHeader, 'span', system.name + ' System ', 'inspector-system-name');
	simpleAppend(systemHeader, 'span', '(' + '0'+system.x+'0'+system.y + ')', 'secondary');
	
	let systemEditContainer = simpleAppend(inspectorElement, 'span', '', 'edit-zone');
	appendText(systemEditContainer, ' ');
	let editSystemLink = simpleAppend(systemEditContainer, 'span', 'edit', 'edit-link textbutton');
	(function(system) {
		editSystemLink.addEventListener('click', function() {
			let title = 'Editing: ' + system.name;
			DynEdit.edit(title, system, WorldGenerator.systemTemplate, function() {
				App.setURL(sector);
				App.createDownloadLink(sector);
				
				App.displayHexmap(sector, system);
				App.displayWorlds(sector);
			});
		});
	}) (system);
	
	appendText(systemEditContainer, ' | ');
	let deleteSystemLink = simpleAppend(systemEditContainer, 'span', 'delete', 'textbutton');
	deleteSystemLink.addEventListener('click', function() {
		App.showConfirmation('Delete system ' + system.name + '?', function(confirmed) {
			if (!confirmed) { return; }
			
			sector.systems.splice(sector.systems.indexOf(system), 1);
			
			App.setURL(sector);
			App.createDownloadLink(sector);
			
			App.displayHexmap(sector);
			App.displayWorlds(sector);					
		});
	});
	
	appendText(systemEditContainer, ' | ');
	let addPlanetLink = simpleAppend(systemEditContainer, 'span', 'add planet', 'textbutton');
	addPlanetLink.addEventListener('click', function() {
		let planet = WorldGenerator.generatePlanet();
		
		let title = 'Adding planet to the ' + system.name + ' system';
		DynEdit.edit(title, planet, WorldGenerator.planetTemplate, function(saved) {
			if (!saved) {
				return;
			}
			
			system.planets.push(planet);
			
			App.setURL(sector);
			App.createDownloadLink(sector);
			
			App.displayHexmap(sector, system);
			App.displayWorlds(sector);
		});			
	});
	
	if (system.planets.length > 0) {
		simpleAppend(inspectorElement, 'hr');
		simpleAppend(inspectorElement, 'hr');
		simpleAppend(inspectorElement, 'hr');
	}
	
	for (let i = 0; i < system.planets.length; i++) {
		let planet = system.planets[i];
		
		if (i != 0) {
			simpleAppend(inspectorElement, 'hr');
		}
		
		let planetHeaderElement = simpleAppend(inspectorElement, 'p', '', 'inspector-object-header');
		simpleAppend(planetHeaderElement,'span', planet.name + ' ', 'inspector-object-name');
		if ('tag1' in planet && 'tag2' in planet) { simpleAppend(planetHeaderElement,'span', '(' + planet.tag1 + ', ' + planet.tag2 + ')', 'secondary') };
		appendText(planetHeaderElement, ' ');
		
		let editPlanetContainer = simpleAppend(planetHeaderElement, 'span', '', 'edit-zone');
		
		let editPlanetLink = simpleAppend(editPlanetContainer, 'span', 'edit', 'edit-link textbutton');
		(function(planet) {
			editPlanetLink.addEventListener('click', function() {
				let title = 'Editing: ' + planet.name + ', ' + system.name + ' system';
				DynEdit.edit(title, planet, WorldGenerator.planetTemplate, function() {
					App.setURL(sector);
					App.createDownloadLink(sector);
					
					App.displayHexmap(sector, system);
					App.displayWorlds(sector);
				});
			});
		}) (planet);
		
		appendText(editPlanetContainer, ' | ');
		
		let deletePlanetLink = simpleAppend(editPlanetContainer, 'span', 'delete', 'textbutton');
		(function(system, planet) {
			deletePlanetLink.addEventListener('click', function() {
				App.showConfirmation('Delete planet ' + planet.name + '?', function(confirmed) {
					if (!confirmed) { return; }
					
					system.planets.splice(system.planets.indexOf(planet), 1);
					
					App.setURL(sector);
					App.createDownloadLink(sector);
					
					App.displayHexmap(sector, system);
					App.displayWorlds(sector);					
				});
			});
		}) (system, planet);
		
		let planetBodyElement = simpleAppend(inspectorElement, 'span');
		
		let tableElem = simpleAppend(planetBodyElement, 'table');
		if ('atmosphere' in planet) { appendRow(tableElem, ['Atmosphere', planet.atmosphere]); }
		if ('gravity' in planet) { appendRow(tableElem, ['Gravity', planet.gravity]); }
		if ('temperature' in planet) { appendRow(tableElem, ['Temperature', planet.temperature]); }
		if ('biosphere' in planet) { appendRow(tableElem, ['Biosphere', planet.biosphere]); }
		if ('population' in planet) { appendRow(tableElem, ['Population', planet.population]); }
		if ('techLevel' in planet) { appendRow(tableElem, ['Tech Level', planet.techLevel]); }
		if ('terrain' in planet) { appendRow(tableElem, ['Terrain', planet.terrain]); }
		
		if ('notes' in planet) {
			simpleAppend(planetBodyElement, 'p', planet.notes, 'secondary');
		}
		if ('privateNotes' in planet) {
			simpleAppend(planetBodyElement, 'p', planet.privateNotes, 'secondary');
		}
		
		if ('tag1' in planet) {
			let tag = WorldGenerator.tagDictionary.get(planet.tag1);
			createTagSpoiler(planetBodyElement, tag);
		}
		
		if ('tag2' in planet) {
			let tag = WorldGenerator.tagDictionary.get(planet.tag2);
			createTagSpoiler(planetBodyElement, tag);
		}
	}
	
	if ('pointsOfInterest' in system) {
		if (system.pointsOfInterest.length > 0) {
			simpleAppend(inspectorElement, 'hr');
			simpleAppend(inspectorElement, 'hr');
			simpleAppend(inspectorElement, 'hr');
		}
		
		for (let i = 0; i < system.pointsOfInterest.length; i++) {
			if (i != 0) {
				simpleAppend(inspectorElement, 'hr');
			}
		
			let poiHeader = simpleAppend(inspectorElement, 'p', '', 'inspector-object-header');
			let poiBody = simpleAppend(inspectorElement, 'p');
			
			let point = system.pointsOfInterest[i];
			
			simpleAppend(poiHeader, 'span', point.name + ' ', 'inspector-object-name');
			simpleAppend(poiHeader, 'span', '(' + point.type + ')', 'secondary');
			
			let tableElem = simpleAppend(poiBody, 'table');
			appendRow(poiBody, ['Occupants: ', point.occupants]);
			appendRow(poiBody, ['Situation: ', point.situation]);
		}
	}
	
	if ('bodies' in system) {
		simpleAppend(inspectorElement, 'hr');
		simpleAppend(inspectorElement, 'hr');
		simpleAppend(inspectorElement, 'hr');
		
		let systemHeader = simpleAppend(inspectorElement, 'p', '', 'inspector-object-header');
		simpleAppend(systemHeader, 'span', 'System Survey', 'inspector-object-name');
		let editBodyContainer = simpleAppend(systemHeader, 'span', '', 'edit-zone');
		appendText(editBodyContainer, ' ');
		let rerollBodiesButton = simpleAppend(editBodyContainer, 'span', 'reroll', 'textbutton');
		
		rerollBodiesButton.addEventListener('click', function(event) {
			system.bodies = StarSystemGenerator.generate('planets' in system ? system.planets.length : 0);
			
			App.setURL(sector);
			App.createDownloadLink(sector);
			
			App.displayHexmap(sector, system);
			App.displayWorlds(sector);				
		});
		
		let bodyTable = simpleAppend(inspectorElement, 'table');
		for (let i = 0; i < system.bodies.length; i++) {
			let body = system.bodies[i];
			
			let name = body.name;
			if (body.name != '*') {
				name = system.name + body.name;
			} else {
				name = '';
			}
			
			appendRow(bodyTable, [body.type, name]);
		}
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
	
	function createTagSpoiler(parentElem, tag) {
		let tagHeader = simpleAppend(parentElem, 'p', tag.name.toUpperCase());
		let tagBody = simpleAppend(parentElem, 'div', '', 'inspector-tag-body');
		
		simpleAppend(tagBody, 'p', tag.description, 'secondary');
		
		simpleAppend(tagBody, 'p', 'Enemies');
		simpleAppend(tagBody, 'div', '•' + tag.enemies.join('  •'), 'secondary');
		
		simpleAppend(tagBody, 'p', 'Friends');
		simpleAppend(tagBody, 'div', '•' + tag.friends.join('  •'), 'secondary');
		
		simpleAppend(tagBody, 'p', 'Complications');
		simpleAppend(tagBody, 'div', '•' + tag.complications.join('  •'), 'secondary');
		
		simpleAppend(tagBody, 'p', 'Things');
		simpleAppend(tagBody, 'div', '•' + tag.things.join('  •'), 'secondary');
		
		simpleAppend(tagBody, 'p', 'Places');
		simpleAppend(tagBody, 'div', '•' + tag.places.join('  •'), 'secondary');
		
		DynSpoiler.create(tagHeader, tagBody);
	}
}

// ************************************************************************** //

App.createDownloadLink = function(sector) {
	let data = JSON.stringify(sector, null, ' ');
	
	let exportJsonGmElement = document.getElementById('export-json-gm');
	exportJsonGmElement.href = window.URL.createObjectURL(new Blob([data], {type: 'text/plain'}));
	exportJsonGmElement.download = ('Sector'+sector.name).replace(/ /g, '')+'_GM.txt';
	
	let censoredSector = App.censorSector(sector)
	data = JSON.stringify(censoredSector, null, ' ');

	let exportJsonPlayerElement = document.getElementById('export-json-player');
	exportJsonPlayerElement.href = window.URL.createObjectURL(new Blob([data], {type: 'text/plain'}));
	exportJsonPlayerElement.download = ('Sector'+sector.name).replace(/ /g, '')+'_Player.txt';
	
	let exportURLGMElement = document.getElementById('export-url-gm');
	exportURLGMElement.value = URLParam.createURL({data:App.compressSector(sector)});
	
	let exportURLPlayerElement = document.getElementById('export-url-player');
	exportURLPlayerElement.value = URLParam.createURL({data:App.compressSector(censoredSector)});	
}