var DynSpoiler = {};

DynSpoiler.create = function(headerElem, bodyElem) {
	headerElem.classList.add('dynspoiler');
	headerElem.classList.add('dynspoiler-header');
	headerElem.classList.add('dynspoiler-hidden');
	bodyElem.classList.add('dynspoiler');
	bodyElem.classList.add('dynspoiler-body');
	bodyElem.classList.add('dynspoiler-hidden');
	
	var hidden = true;
	
	headerElem.addEventListener('click', function(event) {
		hidden = !hidden;
		
		if (hidden) {
			headerElem.classList.add('dynspoiler-hidden');
			bodyElem.classList.add('dynspoiler-hidden');
		} else {
			headerElem.classList.remove('dynspoiler-hidden');
			bodyElem.classList.remove('dynspoiler-hidden');			
		}
	});
}