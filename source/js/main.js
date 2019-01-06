'use strict';

(function () {
  var DEFAULT_CURRENT_NUMBER = '0';

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
  var isLastOperationArithmetic = false;
  var isZeroAvailable = true;
  var isFirstOperation = true;

  var pressedButtonValue;
  var currentNumber = DEFAULT_CURRENT_NUMBER;
  var currentCalculationStr = '';
  var lastNumber = '';

  var operations = {
    arithmetic: function (arithmeticOperation) {
      var currentArithmeticSign = arithmeticOperation.toUpperCase() + '_SIGN';

      if (!isLastOperationArithmetic) {
        setNextCalculationStep(currentArithmeticSign);
      } else {
        changeLastArithmeticOperationSign(currentArithmeticSign);
      }
    },
    segmentation: getArithmeticOperation,
    multiplication: getArithmeticOperation,
    summation: getArithmeticOperation,
    subtraction: getArithmeticOperation,
    clear: function () {
      currentNumber = numberField.value = DEFAULT_CURRENT_NUMBER;
      currentCalculationStr = lastNumber = '';
      clearDisplay(calculationField);
      clearDisplay(lastResultField);
      isFloat = false;
      isNewOperation = true;
      isLastOperationArithmetic = false;
    },
    delete: function () {
      var modifiedByDeletionNumber;

      if (!isNewOperation) {
        if (currentNumber.length > 1) {
          if (currentNumber[currentNumber.length - 1] === '.') {
            isFloat = false;
          }
          modifiedByDeletionNumber = currentNumber.slice(0, -1);
          replaceCurrentNumber(modifiedByDeletionNumber);
          if (currentNumber === '0') {
            startNewOperationAfterDeletion(modifiedByDeletionNumber);
          }
        } else {
          startNewOperationAfterDeletion(modifiedByDeletionNumber);
        }
      } else {
        return;
      }
    },
    float: function () {
      var FLOAT_SIGN = '.';

      if (!isFloat) {
        changeCurrentNumber(FLOAT_SIGN);
        isFloat = true;
        isZeroAvailable = true;
        if (isNewOperation) {
          isNewOperation = false;
        }
      } else {
        return;
      }
    },
    result: function () {
      currentCalculationStr += currentNumber;
      console.log(currentCalculationStr)
      currentNumber = Number(eval(currentCalculationStr).toFixed(10));
      // lastNumber = currentNumber = Number(eval(currentCalculationStr).toFixed(10));
      numberField.value = currentNumber;
      // lastResultField.value = numberField.value = lastNumber;
      clearDisplay(calculationField);
      currentCalculationStr = '';
      isFloat = false;
      isNewOperation = true;
    }
  }

  function resetDisplays() {

  }

  function getArithmeticOperation(currentArithmeticOperationBtnPressed) {
    operations.arithmetic(currentArithmeticOperationBtnPressed);
  }

  function setNextCalculationStep(arithmeticSign) {
    currentCalculationStr += Number(currentNumber) + ArithmeticSigns[arithmeticSign];
    calculationField.value = currentCalculationStr;
    isFloat = false;
    isNewOperation = true;
    isLastOperationArithmetic = true;
    currentNumber = DEFAULT_CURRENT_NUMBER;
  }

  function changeLastArithmeticOperationSign(lastArithmeticSign) {
    currentCalculationStr = currentCalculationStr.slice(0, -3) + ArithmeticSigns[lastArithmeticSign];
    calculationField.value = currentCalculationStr;
  }

  function startNewOperationAfterDeletion(modifiedNumber) {
    modifiedNumber = DEFAULT_CURRENT_NUMBER;
    replaceCurrentNumber(modifiedNumber);
    isNewOperation = true;
    isLastOperationArithmetic = false;
  }

  function clearDisplay(input) {
    input.value = '';
  }

	function changeCurrentNumber(newValue) {
    currentNumber += newValue;
    numberField.value = currentNumber;
  }

	function replaceCurrentNumber(newValue) {
    currentNumber = '';
    changeCurrentNumber(newValue);
  }

  function changeCurrentCalculation(buttonValue) {
    var currentValue = buttonValue;
    if (isNaN(+currentValue)) {
      operations[currentValue](currentValue);
    } else {
      if (isLastOperationArithmetic) {
        isLastOperationArithmetic = false;
      }

      if (+currentValue === 0 && isNewOperation) {
        operations.float();
        return;
      }

      if (isNewOperation) {
        clearDisplay(numberField);
        currentNumber = '';
        isNewOperation = false;
      }

      changeCurrentNumber(currentValue);
    }
  }

  function onButtonClick(evt) {
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
