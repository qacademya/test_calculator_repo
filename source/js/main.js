'use strict';

(function () {
  var DEFAULT_CURRENT_NUMBER = '0';
  var FLOAT_PRECISION = 11;
  var DEFAULT_FONT_SIZE;
  var SMALLER_FONT_SIZE;
  var FONT_SIZE_STEP = 10;
  var NUMBER_MAX_LENGTH = 15;

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

  var SpecialSigns = {
    SQUARE: 'sqr',
    ROOT: '√',
    FRACTION: '1/',
  };

  var isBigNumber = false;
  var isFirstOperation = true;
  var isFloat = false;
  var isLastOperationArithmetic = false;
  var isLastOperationPercent = false;
  var isLastOperationSpecial = false;
  var isNewOperation = true;
  var isResultReceived = false;

  var currentNumber = DEFAULT_CURRENT_NUMBER;
  var calculationStringElementsArr = [];
  var currentOperationStr = '';
  var lastOperationStr = '';
  var currentResult = '';
  var specialString = '';

  var operations = {
    arithmetic: performArithmeticOperation,
    special: performSpecialOpertaion,
    segmentation: getArithmeticOperation,
    multiplication: getArithmeticOperation,
    summation: getArithmeticOperation,
    subtraction: getArithmeticOperation,
    percent: getSpecialOperation,
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
    isBigNumber = false;
    isFirstOperation = true;
    isFloat = false;
    isLastOperationArithmetic = false;
    isLastOperationPercent = false;
    isNewOperation = true;
    isResultReceived = false;
    isLastOperationSpecial = false;
  }

  function getScreenDefaultFontSize() {
    return window.getComputedStyle(numberField, null).getPropertyValue('font-size');
  }

  function getScreenSmallerFontSize() {
    return (parseInt(DEFAULT_FONT_SIZE, 10) - FONT_SIZE_STEP) + 'px';
  }

  function getArithmeticOperation(currentArithmeticOperationBtnPressed) {
    operations.arithmetic(currentArithmeticOperationBtnPressed);
  }

  function getSpecialOperation(currentSpecialOperationBtnPressed) {
    operations.special(currentSpecialOperationBtnPressed);
  }

  function getOperationResult(operationStr) {
    return Number(eval(operationStr).toFixed(FLOAT_PRECISION));
  }

  function getPerсent(operationNumber) {
    var MAX_PERCENT = 100;

    if (isFirstOperation) {
      return 0;
    }

    var operationArr = currentOperationStr.split(' ');
    operationArr[2] = operationNumber;
    var operationStr = Number(operationArr[0]) / MAX_PERCENT * Number(operationArr[2]);
    var result = getOperationResult(operationStr);
    return result.toString();
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

  function performSpecialOpertaion(specialOpertaion) {
    var SPECIAL_SIGN = SpecialSigns[specialOpertaion.toUpperCase()];
    var operationNumber;
    if (isLastOperationArithmetic) {
      operationNumber = currentResult;
    } else {
      operationNumber = currentNumber;
    }

    if (isLastOperationSpecial) {
      clearSpecialStringFromCalculation();
    }

    isLastOperationSpecial = true;

    if (specialOpertaion === 'percent') {
      currentResult = getPerсent(operationNumber);
      isLastOperationPercent = true;
    } else if (specialOpertaion === 'square') {
      currentResult = getSquare(operationNumber);
    } else if (specialOpertaion === 'root') {
      currentResult = getRoot(operationNumber);
    } else if (specialOpertaion === 'fraction') {
      currentResult = getFraction(operationNumber);
    }

    if (!isLastOperationPercent) {
      changeCalculationStrBySpecial(operationNumber, SPECIAL_SIGN);
    } else {
      changeCalculationStrByPercent(currentResult);
    }
    replaceCurrentNumber(currentResult);

    isLastOperationArithmetic = false;
    isNewOperation = true;
  }

  function performArithmeticOperation(arithmeticOperation) {
    var currentArithmeticSign = arithmeticOperation.toUpperCase() + '_SIGN';

    if (!isLastOperationArithmetic) {
      if (isFirstOperation) {
        currentOperationStr += currentNumber + ArithmeticSigns[currentArithmeticSign];
        currentResult = currentNumber;
      } else {
        currentOperationStr += currentNumber;
        currentResult = getOperationResult(currentOperationStr);
        numberField.value = currentResult;
        currentOperationStr = currentResult + ArithmeticSigns[currentArithmeticSign];
      }
      isResultReceived = false;
      if (isLastOperationSpecial) {
        changeCalculationStrByArithmetic(currentArithmeticSign);
      } else {
        changeCalculationStrByArithmetic(currentArithmeticSign, currentNumber);
      }
      setNextCalculationStep();
    } else {
      changeNextArithmeticOperation(currentArithmeticSign);
    }

    isFirstOperation = false;
    isLastOperationPercent = false;
    isLastOperationSpecial = false;
  }

  function setNextCalculationStep() {
    isFloat = false;
    isLastOperationArithmetic = true;
    isNewOperation = true;
  }

  function createString(arr) {
    return arr.join('');
  }

  function displayCalculationString() {
    calculationField.value = createString(calculationStringElementsArr);
  }

  function changeCalculationStrByArithmetic(sign, number) {
    if (isLastOperationSpecial) {
      calculationStringElementsArr.push(ArithmeticSigns[sign]);
    } else {
      calculationStringElementsArr.push(Number(number));
      calculationStringElementsArr.push(ArithmeticSigns[sign]);
    }
    displayCalculationString();
  }

  function changeCalculationStrBySpecial(number, sign) {
    specialString = sign + '(' + Number(number) + ')';
    calculationStringElementsArr.push(specialString);
    displayCalculationString();
  }

  function changeCalculationStrByPercent(number) {
    if (isFirstOperation) {
      calculationStringElementsArr.push(0);
    } else {
      specialString = Number(number);
      calculationStringElementsArr.push(specialString);
    }
    displayCalculationString();
  }

  function changeNextArithmeticOperation(lastArithmeticSign) {
    calculationStringElementsArr.pop();
    calculationStringElementsArr.push(ArithmeticSigns[lastArithmeticSign]);
    currentOperationStr = currentOperationStr.slice(0, -3) + ArithmeticSigns[lastArithmeticSign];
    displayCalculationString();
  }

  function clearScreen(input) {
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

  function resetSpecialString() {
    specialString = '';
  }

  function clearSpecialStringFromCalculation() {
    calculationStringElementsArr.pop();
    displayCalculationString();
    resetSpecialString();
    isLastOperationSpecial = false;
    isLastOperationPercent = false;
  }

  function resetCalculation() {
    currentOperationStr = currentResult = lastOperationStr = specialString = '';
    calculationStringElementsArr = [];
    numberField.style.fontSize = '';
    replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
    clearScreen(calculationField);
    setBooleansDefault();
  }

  function clearCurrentNumber() {
    if (isLastOperationSpecial) {
      clearSpecialStringFromCalculation();
    }
    replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
    currentResult = DEFAULT_CURRENT_NUMBER;
    isFloat = false;
    isNewOperation = true;
  }

  function startNewOperationAfterTotalDeletion(modifiedNumber) {
    modifiedNumber = DEFAULT_CURRENT_NUMBER;
    replaceCurrentNumber(modifiedNumber);
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
      if (isCurrentNumberMoreMaxLength()) {
        return;
      }

      if (isNewOperation) {
        replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
      }

      if (isLastOperationSpecial) {
        clearSpecialStringFromCalculation();
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
      currentResult = getOperationResult(lastOperationStr);
      replaceCurrentNumber(currentResult);
      isFloat = false;
      isNewOperation = true;
    } else {
      if (isLastOperationArithmetic) {
        currentOperationStr += currentResult;
      } else {
        currentOperationStr += currentNumber;
      }
      currentResult = getOperationResult(currentOperationStr);
      replaceCurrentNumber(currentResult);
      clearScreen(calculationField);
      lastOperationStr = currentOperationStr;
      currentOperationStr = '';
      calculationStringElementsArr = [];
      setBooleansDefault();
      isResultReceived = true;
    }
  }

  function changeCurrentCalculation(pressedButton) {
    var pressedButtonValue = Number(pressedButton);
    if (isNaN(pressedButtonValue)) {
      operations[pressedButton](pressedButton);
    } else {
      if (isLastOperationSpecial || isLastOperationPercent) {
        clearSpecialStringFromCalculation();
      }

      isLastOperationArithmetic = false;

      if (isCurrentNumberMoreMaxLength()) {
        return;
      }

      if (isNewOperation) {
        if (pressedButtonValue === 0) {
          replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
          currentResult = currentNumber;
          return;
        } else {
          currentNumber = '';
          isNewOperation = false;
        }
      }

      changeCurrentNumber(pressedButtonValue);

      if (isResultReceived) {
        currentResult = currentNumber;
      }
    }
    controlScreenFontSize();
  }

  function isCurrentNumberMoreMaxLength() {
    return (numberField.value.length > NUMBER_MAX_LENGTH && !isNewOperation) ? true : false;
  }

  function changeScreenFontSize(fontSize) {
    numberField.style.fontSize = fontSize;
  }

  function controlScreenFontSize() {
    if (numberField.value.length > NUMBER_MAX_LENGTH + 1) {
      changeScreenFontSize(SMALLER_FONT_SIZE);
      isBigNumber = true;
    }
    if (isBigNumber && numberField.value.length <= NUMBER_MAX_LENGTH - 1) {
      changeScreenFontSize(DEFAULT_FONT_SIZE);
      isBigNumber = false;
    }
  }

  function onButtonClick(evt) {
    evt.preventDefault();
    var target = evt.target.closest('.button');

    if (target === null) {
      return;
    }

    var pressedButton = target.dataset.type;

    changeCurrentCalculation(pressedButton);
  }

  DEFAULT_FONT_SIZE = getScreenDefaultFontSize();
  SMALLER_FONT_SIZE = getScreenSmallerFontSize();
  clearScreen(calculationField);
  buttons.addEventListener('click', onButtonClick);
})();
