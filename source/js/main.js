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
  var isLastOperationArithmetic = true;
  var pressedButtonValue;
  var currentNumber = numberField.value;
  var currentCalculationStr = '';
  var lastNumber = '';
  // var lastResult;
  var operations = {
    arithmetic: function (arithmeticOperation) {
      var currentNumberLastSimbol = currentNumber[currentNumber.length - 1];
      var currentArithmeticSign = arithmeticOperation.toUpperCase() + '_SIGN';
      if (!isNewOperation) {
        if (!isLastOperationArithmetic) {
          if (currentNumberLastSimbol === '.') {
            currentNumber = currentNumber.slice(0, -1);
          }
          lastNumber = currentNumber;
          currentCalculationStr += currentNumber + ArithmeticSigns[currentArithmeticSign];
          calculationField.value = currentCalculationStr;
          isFloat = false;
          isNewOperation = true;
          isLastOperationArithmetic = true;
        } else {
          currentNumber = '';
          changeCurrentNumberAndNumberFieldValue(lastNumber);
          isNewOperation = true;
        }
      } else {
        currentCalculationStr = currentCalculationStr.slice(0, -3) + ArithmeticSigns[currentArithmeticSign];
        calculationField.value = currentCalculationStr;
      }
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
      currentNumber = '0';
      currentCalculationStr = '';
      lastNumber = '';
      numberField.value = 0;
      clearDisplay(calculationField);
      clearDisplay(lastResultField);
      isFloat = false;
      isNewOperation = true;
      isLastOperationArithmetic = true;
    },
    delete: function () {
      if (!isNewOperation) {
        var changedNumber = lastNumber = currentNumber.slice(0, -1);
        if (changedNumber.length === 0) {
          changedNumber = lastNumber = 0;
          isNewOperation = true;
          isLastOperationArithmetic = true;
        }

        currentNumber = '';
        changeCurrentNumberAndNumberFieldValue(changedNumber);

      }
      else {
        return;
      }
    },
    float: function () {
      if (!isFloat) {
        var changedNumber = currentNumber + '.';
        currentNumber = '';
        changeCurrentNumberAndNumberFieldValue(changedNumber);
        isFloat = true;
      } else {
        return;
      }
    },
    result: operationSegmentation,
  }

  function operationSegmentation() {
  }

  function clearDisplay(input) {
    input.value = '';
  }

	function changeCurrentNumberAndNumberFieldValue(newValue) {
    if (isNewOperation) {
      clearDisplay(numberField);
      currentNumber = '';
      isNewOperation = false;
    }
    currentNumber += newValue;
    numberField.value = currentNumber;
  }

  function changeCurrentCalculation(buttonValue) {
    if (isNaN(+buttonValue)) {
      operations[buttonValue](buttonValue);
    } else {
      if (+buttonValue === 0 && isNewOperation) {
        return;
      }
      isLastOperationArithmetic = false;
      changeCurrentNumberAndNumberFieldValue(buttonValue);
    }
  }

  function onButtonClick(evt) {
    console.log(isNewOperation)
    evt.preventDefault();
    var target = evt.target;

    if (target.tagName !== 'BUTTON') {
      return;
    }

    pressedButtonValue = target.dataset.type;

    changeCurrentCalculation(pressedButtonValue);
  }

  clearDisplay(calculationField);
  clearDisplay(lastResultField);
  buttons.addEventListener('click', onButtonClick);
})();
