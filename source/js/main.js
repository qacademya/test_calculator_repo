'use strict';

(function () {
  var calculator = document.querySelector('.calculator');
  var buttons = calculator.querySelector('.buttons');
	var calculationField = calculator.querySelector('#screen_calculation');
	var numberField = calculator.querySelector('#screen_number');
  var lastResultField = calculator.querySelector('#screen_result');
  var mathOperations = ['segmentation', 'multiplication', 'summation', 'subtraction'];
  var specialOperations = ['clear', 'delete', 'float', 'result'];
  var isNewOperation;
  var btnValue;

  function operationReset() {
    numberField.value = 0;
    calculationField.value ='';
    lastResultField.value ='';
    isNewOperation = true;
  }

  function clearDisplayValue(input) {
    input.value = '';
  }

	function changeNumberFieldValue(newValue) {
		numberField.value += newValue;
  }

  function onButtonClick(evt) {
    var target = evt.target;

    if (target.tagName !== 'BUTTON') {
      return;
    }

    btnValue = target.dataset.type;

    if (isNewOperation) {
      clearDisplayValue(numberField);
      isNewOperation = false;
    }

    changeNumberFieldValue(btnValue);
  }

  operationReset();
  buttons.addEventListener('click', onButtonClick);
})();
