'use strict';

(function () {
  var DEFAULT_CURRENT_NUMBER = '0';
  var FLOAT_PRECISION = 10;
  var DEFAULT_FONT_SIZE;
  var SMALLER_FONT_SIZE;
  var FONT_SIZE_STEP = 10;

  var calculator = document.querySelector('.calculator');
  var buttons = calculator.querySelector('.buttons');
  var calculationField = calculator.querySelector('#screen_calculation');
  var numberField = calculator.querySelector('#screen_number');

  var ArithmeticSigns = {
    SEGMENTATION_SIGN: ' / ',
    MULTIPLICATION_SIGN: ' * ',
    SUMMATION_SIGN: ' + ',
    SUBTRACTION_SIGN: ' - ',
  };

  var isFloat = false;
  var isNewOperation = true;
  var isLastOperationArithmetic = false;
  var isFirstOperation = true;
  var isResultReceived = false;

  var currentNumber = DEFAULT_CURRENT_NUMBER;
  var currentCalculationStr = '';
  var currentOperationStr = '';
  var lastOperationStr = '';
  var currentResult = '';

  var operations = {
    arithmetic: performArithmeticOperation,
    segmentation: getArithmeticOperation,
    multiplication: getArithmeticOperation,
    summation: getArithmeticOperation,
    subtraction: getArithmeticOperation,
    square: getSquare,
    reset: resetCalculation,
    clear: clearCurrentNumber,
    delete: deleteCurrentNumberSimbol,
    float: setFloatingPointNumber,
    result: getCalculationResult,
  };

  function setBooleansDefault() {
    isFloat = false;
    isNewOperation = true;
    isLastOperationArithmetic = false;
    isFirstOperation = true;
    isResultReceived = false;
  }

  function getDisplayDefaultFontSize() {
    return window.getComputedStyle(numberField, null).getPropertyValue('font-size');
  }

  function getDisplaySmallerFontSize() {
    return (parseInt(DEFAULT_FONT_SIZE, 10) - FONT_SIZE_STEP) + 'px';
  }

  function getArithmeticOperation(currentArithmeticOperationBtnPressed) {
    operations.arithmetic(currentArithmeticOperationBtnPressed);
  }

  function getResult(operationStr) {
    return Number(eval(operationStr).toFixed(FLOAT_PRECISION));
  }

  function getSquare() {
    var squareOfNumber = currentNumber * currentNumber;
    replaceCurrentNumber(squareOfNumber);
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

  function changeDisplayFontSize(fontSize) {
    numberField.style.fontSize = fontSize;
  }

  function changeCurrentNumber(newValue) {
    currentNumber += newValue;
    numberField.value = currentNumber;
  }

  function replaceCurrentNumber(newValue) {
    currentNumber = '';
    changeCurrentNumber(newValue);
  }

  function performArithmeticOperation(arithmeticOperation) {
    var currentArithmeticSign = arithmeticOperation.toUpperCase() + '_SIGN';

    if (!isLastOperationArithmetic) {
      if (isFirstOperation) {
        currentOperationStr += currentNumber + ArithmeticSigns[currentArithmeticSign];
      } else {
        currentOperationStr += currentNumber;
        currentResult = getResult(currentOperationStr);
        numberField.value = currentResult;
        currentOperationStr = currentResult + ArithmeticSigns[currentArithmeticSign];
      }
      if (isResultReceived) {
        isResultReceived = false;
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
    currentCalculationStr = currentOperationStr = currentResult = lastOperationStr = '';
    numberField.style.fontSize = '';
    replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
    clearDisplay(calculationField);
    setBooleansDefault();
  }

  function clearCurrentNumber() {
    replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
    currentResult = DEFAULT_CURRENT_NUMBER;
    isFloat = false;
    isNewOperation = true;
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
      } else {
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
          currentResult = currentNumber;
          return;
        } else {
          clearDisplay(numberField);
          currentNumber = '';
          isNewOperation = false;
        }
      }
      changeCurrentNumber(pressedButtonValue);
      if (isResultReceived) {
        currentResult = currentNumber;
      }
    }
    if (numberField.value.length > 15) {
      changeDisplayFontSize(SMALLER_FONT_SIZE);
    } else {
      changeDisplayFontSize(DEFAULT_FONT_SIZE);
    }
  }

  function getCalculationResult() {
    if (!isFirstOperation) {
      currentOperationStr += currentNumber;
      currentResult = getResult(currentOperationStr);
      lastOperationStr = currentOperationStr;
      currentOperationStr = '';
      currentCalculationStr = '';
      replaceCurrentNumber(currentResult);
      clearDisplay(calculationField);
      setBooleansDefault();
      isResultReceived = true;
    } else {
      if (isResultReceived) {
        var lastOperationArr = lastOperationStr.split(' ');
        lastOperationArr[0] = currentResult;
        lastOperationStr = lastOperationArr.join(' ');
        currentResult = getResult(lastOperationStr);
        replaceCurrentNumber(currentResult);
        isNewOperation = true;
        isFloat = false;
      } else {
        return;
      }
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

  DEFAULT_FONT_SIZE = getDisplayDefaultFontSize();
  SMALLER_FONT_SIZE = getDisplaySmallerFontSize();
  clearDisplay(calculationField);
  buttons.addEventListener('click', onButtonClick);
})();
