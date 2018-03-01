let DynModal = {};

DynModal._stack = [];

DynModal.show = function(callback=null) {
	let body = document.body;
	
	let modalBackground = document.createElement('div');
	modalBackground.className = 'dynmodal-background';
	let modalContainer = document.createElement('div');
	modalContainer.className = 'dynmodal-container';
	
	body.appendChild(modalBackground);
	modalBackground.appendChild(modalContainer);
	
	let modal = {container:modalContainer, background:modalBackground, callback:callback, locked:false};
	
	DynModal._stack.push(modal);
	
	return modal;
}

DynModal.hide = function(modal) {
	document.body.removeChild(modal.background);
	DynModal._stack.splice(DynModal._stack.indexOf(modal));
}

document.addEventListener('keyup', function(event) {
	if (event.key == 'Escape') {
		if (DynModal._stack.length <= 0) {
			return;
		}
		
		let modal = DynModal._stack[DynModal._stack.length-1];
		if (modal.locked) {
			return;
		}
		
		if (modal.callback != null) { modal.callback(); }
		
		DynModal.hide(modal);
	}
});