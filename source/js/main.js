'use strict';

(function () {
  var DEFAULT_CURRENT_NUMBER = '0';
  var FLOAT_PRECISION = 11;
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

  var isFirstOperation = true;
  var isFloat = false;
  var isLastOperationArithmetic = false;
  var isNewOperation = true;
  var isResultReceived = false;
  var isSpecialOperations = false;

  var currentNumber = DEFAULT_CURRENT_NUMBER;
  var currentCalculationStr = '';
  var currentOperationStr = '';
  var lastOperationStr = '';
  var currentResult = '';

  var operations = {
    arithmetic: performArithmeticOperation,
    special: performSpecialOpertaion,
    segmentation: getArithmeticOperation,
    multiplication: getArithmeticOperation,
    summation: getArithmeticOperation,
    subtraction: getArithmeticOperation,
    square: getSpecialOperation,
    root: getSpecialOperation,
    fraction: getSpecialOperation,
    reset: resetCalculation,
    clear: clearCurrentNumber,
    delete: deleteCurrentNumberSimbol,
    float: setFloatingPointNumber,
    result: getCalculationResult,
  };

  function setBooleansDefault() {
    isFirstOperation = true;
    isFloat = false;
    isLastOperationArithmetic = false;
    isNewOperation = true;
    isResultReceived = false;
    isSpecialOperations = false;
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

  function getArithmeticOperationResult(operationStr) {
    return Number(eval(operationStr).toFixed(FLOAT_PRECISION));
  }

  function getSpecialOperation(currentSpecialOperationBtnPressed) {
    operations.special(currentSpecialOperationBtnPressed);
  }

  function performSpecialOpertaion(specialOpertaion) {
    var operationNumber;
    if (isLastOperationArithmetic) {
      operationNumber = currentResult;
    } else {
      operationNumber = currentNumber;
    }
    
    if (specialOpertaion === 'square') {
      currentResult = getSquare(operationNumber);
    } else if (specialOpertaion === 'root') {
      currentResult = getRoot(operationNumber);
    } else if (specialOpertaion === 'fraction') {
      currentResult = getFraction(operationNumber);
    }
    replaceCurrentNumber(currentResult);
    isLastOperationArithmetic = false;
    isNewOperation = true;
    isSpecialOperations = true;
  }

  function getSquare(operationNumber) {
    return Number((Number(operationNumber) * Number(operationNumber)).toFixed(FLOAT_PRECISION));
  }

  function getRoot(operationNumber) {
    return Number((Math.sqrt(Number(operationNumber))).toFixed(FLOAT_PRECISION));
  }

  function getFraction(operationNumber) {
    return Number(1 / (Number(operationNumber)).toFixed(FLOAT_PRECISION));
  }

  function setNextCalculationStep() {
    isFloat = false;
    isLastOperationArithmetic = true;
    isNewOperation = true;
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
        currentResult = currentNumber;
      } else {
        currentOperationStr += currentNumber;
        currentResult = getArithmeticOperationResult(currentOperationStr);
        numberField.value = currentResult;
        currentOperationStr = currentResult + ArithmeticSigns[currentArithmeticSign];
      }
      isResultReceived = false;
      changeCurrentCalculationStr(currentArithmeticSign);
      setNextCalculationStep();
    } else {
      changeNextArithmeticOperation(currentArithmeticSign);
    }

    if (isFirstOperation) {
      isFirstOperation = false;
    }
    isSpecialOperations = false;
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

  function getCalculationResult() {
    if (isResultReceived) {
      var lastOperationArr = lastOperationStr.split(' ');
      lastOperationArr[0] = currentResult;
      lastOperationStr = lastOperationArr.join(' ');
      currentResult = getArithmeticOperationResult(lastOperationStr);
      replaceCurrentNumber(currentResult);
      isFloat = false;
      isNewOperation = true;
    } else {
      if (isLastOperationArithmetic) {
        currentOperationStr += currentResult;
      } else {
        currentOperationStr += currentNumber;
      }
      currentResult = getArithmeticOperationResult(currentOperationStr);
      replaceCurrentNumber(currentResult);
      clearDisplay(calculationField);
      lastOperationStr = currentOperationStr;
      currentOperationStr = '';
      currentCalculationStr = '';
      setBooleansDefault();
      isResultReceived = true;
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
