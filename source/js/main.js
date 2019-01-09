'use strict';

(function () {
  var DEFAULT_CURRENT_NUMBER = '0';
  var FLOAT_PRECISION = 10;

  var calculator = document.querySelector('.calculator');
  var buttons = calculator.querySelector('.buttons');
	var calculationField = calculator.querySelector('#screen_calculation');
	var numberField = calculator.querySelector('#screen_number');

  var ArithmeticSigns = {
    SEGMENTATION_SIGN: ' / ',
    MULTIPLICATION_SIGN: ' * ',
    SUMMATION_SIGN: ' + ',
    SUBTRACTION_SIGN: ' - ',
  }

  var isFloat = false;
  var isNewOperation = true;
  var isLastOperationArithmetic = false;
  var isFirstOperation = true;

  var currentNumber = DEFAULT_CURRENT_NUMBER;
  var currentCalculationStr = '';
  var currentOperationStr = '';
  var currentResult = '';

  var operations = {
    arithmetic: doArithmeticOperation,
    segmentation: getArithmeticOperation,
    multiplication: getArithmeticOperation,
    summation: getArithmeticOperation,
    subtraction: getArithmeticOperation,
    clear: resetCalculation,
    delete: deleteCurrentNumberSimbol,
    float: setFloatingPointNumber,
    result: getCalculationResult,
  }

  function setBooleansDefault() {
    isFloat = false;
    isNewOperation = true;
    isLastOperationArithmetic = false;
    isFirstOperation - true;
  }

  function getArithmeticOperation(currentArithmeticOperationBtnPressed) {
    operations.arithmetic(currentArithmeticOperationBtnPressed);
  }

  function getResult() {
    return Number(eval(currentOperationStr).toFixed(FLOAT_PRECISION));
  }

  function setNextCalculationStep() {
    isFloat = false;
    isNewOperation = true;
    isLastOperationArithmetic = true;
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

  function startNewOperationAfterTotalDeletion(modifiedNumber) {
    modifiedNumber = DEFAULT_CURRENT_NUMBER;
    replaceCurrentNumber(modifiedNumber);
    isNewOperation = true;
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

  function doArithmeticOperation(arithmeticOperation) {
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
  }

  function resetCalculation() {
    currentNumber = numberField.value = DEFAULT_CURRENT_NUMBER;
    currentCalculationStr = currentOperationStr = currentResult = '';
    clearDisplay(calculationField);
    setBooleansDefault();
  }

  function deleteCurrentNumberSimbol() {
    var modifiedByDeletionNumber;
    var currentNumberLastSimbol = currentNumber[currentNumber.length - 1];

    if (!isNewOperation) {
      if (currentNumber.length > 1) {
        if (currentNumberLastSimbol === '.') {
          isFloat = false;
        }
        modifiedByDeletionNumber = currentNumber.slice(0, -1);
        replaceCurrentNumber(modifiedByDeletionNumber);
        if (currentNumber === DEFAULT_CURRENT_NUMBER) {
          startNewOperationAfterTotalDeletion(modifiedByDeletionNumber);
        }
      }
      else {
        startNewOperationAfterTotalDeletion(modifiedByDeletionNumber);
      }
    } else {
      return;
    }
  }

  function setFloatingPointNumber() {
    var FLOAT_SIGN = '.';

    if (!isFloat) {
      if (isNewOperation) {
        replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
      }
      changeCurrentNumber(FLOAT_SIGN);
      isFloat = true;
      isNewOperation = false;
    } else {
      return;
    }
  }

  function changeCurrentCalculation(pressedButton) {
    var pressedButtonValue = Number(pressedButton);
    if (isNaN(pressedButtonValue)) {
      operations[pressedButton](pressedButton);
    } else {
      if (isLastOperationArithmetic) {
        isLastOperationArithmetic = false;
      }

      if (isNewOperation) {
        if (pressedButtonValue === 0) {
          replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
          return;
        } else {
          clearDisplay(numberField);
          currentNumber = '';
          isNewOperation = false;
        }
      }
      changeCurrentNumber(pressedButtonValue);
    }
  }

  function getCalculationResult() {
    if (!isFirstOperation) {
      currentOperationStr += currentNumber;
      currentResult = getResult();
      currentOperationStr = '';
      currentCalculationStr = '';
      replaceCurrentNumber(currentResult);
      clearDisplay(calculationField);
      setBooleansDefault();
    } else {
      return;
    }
  }

  function onButtonClick(evt) {
    evt.preventDefault();
    var target = evt.target;

    if (target.tagName !== 'BUTTON') {
      return;
    }

    var pressedButton = target.dataset.type;

    changeCurrentCalculation(pressedButton);
  }

  clearDisplay(calculationField);
  buttons.addEventListener('click', onButtonClick);
})();
