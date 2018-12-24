'use strict';

(function () {
	var calculator = document.querySelector('.calculator');
	var operationsField = calculator.querySelector('#screen_operation');
	var lastResultField = calculator.querySelector('#screen_result');

	function changeOperationsFieldValue() {
		operationsField.value = 1;
	}
	
	function onDigitOnePress(evt) {
		evt.preventDefault();
    window.keyEvents.isDigitOneEvent(evt, changeOperationsFieldValue);
	}
	
	document.addEventListener('keydown', onDigitOnePress);
})();
