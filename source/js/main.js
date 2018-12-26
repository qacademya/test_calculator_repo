'use strict';

(function () {
  var calculator = document.querySelector('.calculator');
  var buttons = calculator.querySelector('.buttons');
	var calculationField = calculator.querySelector('#screen_calculation');
	var numberField = calculator.querySelector('#screen_number');
  var lastResultField = calculator.querySelector('#screen_result');
  // var specialOperations = ['segmentation', 'multiplication', 'summation', 'subtraction', 'clear', 'delete', 'float', 'result'];
  var ArithmeticSigns = {
    SEGMENTATION_SIGN: ' / ',
    MULTIPLICATION_SIGN: ' * ',
    SUMMATION_SIGN: ' + ',
    SUBTRACTION_SIGN: ' - '
  }
  var isNewOperation;
  var btnValue;
  var lastNumber;
  var operations = {
    arithmetic: function (arithmeticOperation) {
      var currentArithmeticSign = arithmeticOperation.toUpperCase() + '_SIGN';
      lastNumber = numberField.value;
      calculationField.value += lastNumber + ArithmeticSigns[currentArithmeticSign];
      isNewOperation = true;
    },
    segmentation: function (operation) {
      operations.arithmetic(operation)
    },
    multiplication: function (operation) {
      operations.arithmetic(operation)
    },
    summation: function (operation) {
      operations.arithmetic(operation)
    },
    subtraction: function (operation) {
      operations.arithmetic(operation)
    },
    clear: function () {
      numberField.value = 0;
      clearDisplay(calculationField);
      clearDisplay(lastResultField);
      isNewOperation = true;
    },
    delete: function () {
      lastNumber.slice();
    },
    float: operationSegmentation,
    result: operationSegmentation,
  }

  function operationSegmentation() {
    // lastNumber = numberField.value;
    // calculationField.value += lastNumber + ' / ';
    // isNewOperation = true;
  }

  function clearDisplay(input) {
    input.value = '';
  }

	function changeNumberFieldValue(newValue) {
		numberField.value += newValue;
  }

  function changeCurrentCalculation(buttonValue) {
    if (isNaN(+buttonValue)) {
      return operations[buttonValue](buttonValue);
    }
    return changeNumberFieldValue(+buttonValue);
  }

  function onButtonClick(evt) {
    evt.preventDefault();
    var target = evt.target;

    if (target.tagName !== 'BUTTON') {
      return;
    }

    btnValue = target.dataset.type;

    if (isNewOperation) {
      clearDisplay(numberField);
      isNewOperation = false;
    }

    changeCurrentCalculation(btnValue);
  }

  operations.clear();
  buttons.addEventListener('click', onButtonClick);
})();
