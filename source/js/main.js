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
  var currentOperationStr = '';
  var currentResult = '';

  var operations = {
    arithmetic: function (arithmeticOperation) {
      var currentArithmeticSign = arithmeticOperation.toUpperCase() + '_SIGN';

      if (!isLastOperationArithmetic) {
        if (isFirstOperation) {
          currentOperationStr += currentNumber + ArithmeticSigns[currentArithmeticSign];
        } else {
          currentOperationStr += currentNumber;
          currentResult = getResult();
          numberField.value = currentResult;
          currentOperationStr = currentResult + ArithmeticSigns[currentArithmeticSign];
        }
        changeCurrentCalculationStr(currentArithmeticSign);
        setNextCalculationStep();
      } else {
        changeNextArithmeticOperation(currentArithmeticSign);
      }

      if (isFirstOperation) {
        isFirstOperation = false;
      }
    },
    segmentation: getArithmeticOperation,
    multiplication: getArithmeticOperation,
    summation: getArithmeticOperation,
    subtraction: getArithmeticOperation,
    clear: function () {
      currentNumber = numberField.value = DEFAULT_CURRENT_NUMBER;
      currentCalculationStr = currentOperationStr = currentResult = '';
      clearDisplay(calculationField);
      clearDisplay(lastResultField);
      isFloat = false;
      isNewOperation = true;
      isLastOperationArithmetic = false;
      isFirstOperation = true;
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

  function getOperands() {
    var operands = currentOperationStr.split(' ').slice(0, 3);
    return operands;
  }

  function getResult() {
    var result = Number(eval(getOperands().join(' ')).toFixed(10));
    return result;

  }

  function getArithmeticOperation(currentArithmeticOperationBtnPressed) {
    operations.arithmetic(currentArithmeticOperationBtnPressed);
  }

  function setNextCalculationStep() {
    isFloat = false;
    isNewOperation = true;
    isLastOperationArithmetic = true;
    currentNumber = DEFAULT_CURRENT_NUMBER;
  }

  function changeCurrentCalculationStr(arithmeticSign) {
    currentCalculationStr += Number(currentNumber) + ArithmeticSigns[arithmeticSign];
    calculationField.value = currentCalculationStr;
  }

  function changeNextArithmeticOperation(lastArithmeticSign) {
    currentCalculationStr = currentCalculationStr.slice(0, -3) + ArithmeticSigns[lastArithmeticSign];
    currentOperationStr = currentOperationStr.slice(0, -3) + ArithmeticSigns[lastArithmeticSign];
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
      // isReady = true;

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
