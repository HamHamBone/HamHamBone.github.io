let DynModal = {};

DynModal.show = function() {
	let modalBackground = document.getElementById('modal-background');
	let modalContainer = document.getElementById('modal-container');
		
	modalBackground.classList.remove('hide');
	
	return modalContainer;
}

DynModal.hide = function() {
	let modalBackground = document.getElementById('modal-background');
	let modalContainer = document.getElementById('modal-container');
	
	modalBackground.classList.add('hide');
	modalContainer.innerHTML = '';
}