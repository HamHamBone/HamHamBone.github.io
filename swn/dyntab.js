function DynTab(parentElement) {
	this.parentElement = parentElement;
	
	this.tabElements = Array.from(parentElement.childNodes);
	this.tabElements = this.tabElements.filter(function(element) {
		return element.nodeType == Node.ELEMENT_NODE;
	});
	parentElement.innerHTML = "";	
	
	this.headerElement = document.createElement('div');
	this.bodyElement = document.createElement('div');
	
	parentElement.appendChild(this.headerElement);
	parentElement.appendChild(this.bodyElement);
	
	this.visibleIndex = 0;
	this.nameMap = new Map();
	
	for (var i = 0; i < this.tabElements.length; i++) {
		var tabElement = this.tabElements[i];
		this.bodyElement.appendChild(tabElement);
		
		tabElement.classList.add(i == this.visibleIndex ? 'dyntab-visible' : 'dyntab-hidden');
		
		var buttonElement = document.createElement('button');
		buttonElement.innerText = tabElement.dataset.title;
		buttonElement.addEventListener('click', makeButtonCallback(this, i));
		this.headerElement.appendChild(buttonElement);
		
		buttonElement.classList.add('dyntab-button');
		buttonElement.classList.add(i == this.visibleIndex ? 'dyntab-visible' : 'dyntab-hidden');
	}
	
	this.buttonElements = Array.from(this.headerElement.childNodes);
	
	function makeButtonCallback(self, index) {
		return (function() { self.setVisibleTab(index); })
	}
}

DynTab.prototype.setVisibleTab = function(index) {
	this.visibleIndex = index;
	for (var i = 0; i < this.tabElements.length; i++) {
		this.tabElements[i].classList.add(i == this.visibleIndex ? 'dyntab-visible' : 'dyntab-hidden');
		this.tabElements[i].classList.remove(i == this.visibleIndex ? 'dyntab-hidden' : 'dyntab-visible');
		
		this.buttonElements[i].classList.add(i == this.visibleIndex ? 'dyntab-visible' : 'dyntab-hidden');
		this.buttonElements[i].classList.remove(i == this.visibleIndex ? 'dyntab-hidden' : 'dyntab-visible');
	}	
}