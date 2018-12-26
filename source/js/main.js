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
  var isFloat = false;
  var isNewOperation = true;
  var pressedButtonValue;
  var currentNumber = '';
  var currentCalculationStr = '';
  // var lastResult;
  var operations = {
    arithmetic: function (arithmeticOperation) {
      if (currentNumber[currentNumber.length - 1] === '.') {
        currentNumber = currentNumber.slice(0, -1);
      }
      var currentArithmeticSign = arithmeticOperation.toUpperCase() + '_SIGN';
      currentCalculationStr = currentNumber + ArithmeticSigns[currentArithmeticSign];
      calculationField.value += currentCalculationStr;
      isFloat = false;
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
      currentCalculationStr = '';
      numberField.value = 0;
      clearDisplay(calculationField);
      clearDisplay(lastResultField);
      isFloat = false;
      isNewOperation = true;
    },
    delete: function () {
      var changedNumber = currentNumber.slice(0, -1);

      if (changedNumber.length <= 0) {
        changedNumber = 0;
        isNewOperation = true;
      }
      currentNumber = '';
      changeNumberFieldValue(changedNumber);
    },
    float: function () {
      if (!isFloat) {
        var changedNumber = currentNumber + '.';
        currentNumber = '';
        changeNumberFieldValue(changedNumber)
        isFloat = true;
      } else {
        return;
      }
    },
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
    currentNumber += newValue;
    numberField.value = currentNumber;
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

    pressedButtonValue = target.dataset.type;

    if (isNewOperation) {
      clearDisplay(numberField);
      currentNumber = '';
      isNewOperation = false;
    }

    changeCurrentCalculation(pressedButtonValue);
  }

  operations.clear();
  buttons.addEventListener('click', onButtonClick);
})();
