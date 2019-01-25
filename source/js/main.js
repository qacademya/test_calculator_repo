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

  var MathSigns = {
    SQUARE: 'sqr',
    ROOT: '√',
    FRACTION: '1/',
  };

  var isBigNumber = false;
  var isFirstOperation = true;
  var isFloat = false;
  var isLastOperationArithmetic = false;
  var isLastOperationPercent = false;
  var isLastOperationMath = false;
  var isNewStep = true;
  var isResultReceived = false;

  var currentNumber = DEFAULT_CURRENT_NUMBER;
  var calculationStringElementsArr = [];
  var currentArithmeticOperationStr = '';
  var lastArithmeticOperationStr = '';
  var currentResult = '';
  var specialString = '';

  var mainOperations = {
    arithmetic: performArithmeticOperation,
    math: performMathOpertaion,
    segmentation: getArithmeticOperation,
    multiplication: getArithmeticOperation,
    summation: getArithmeticOperation,
    subtraction: getArithmeticOperation,
    percent: getMathOperation,
    square: getMathOperation,
    root: getMathOperation,
    fraction: getMathOperation,
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
    isNewStep = true;
    isResultReceived = false;
    isLastOperationMath = false;
  }

  function clearScreen(input) {
    input.value = '';
  }

  function getScreenDefaultFontSize() {
    return window.getComputedStyle(numberField, null).getPropertyValue('font-size');
  }

  function getScreenSmallerFontSize() {
    return (parseInt(DEFAULT_FONT_SIZE, 10) - FONT_SIZE_STEP) + 'px';
  }

  function getArithmeticOperation(currentArithmeticOperationBtnPressed) {
    mainOperations.arithmetic(currentArithmeticOperationBtnPressed);
  }

  function getMathOperation(currentMathOperationBtnPressed) {
    mainOperations.math(currentMathOperationBtnPressed);
  }

  function getOperationResult(operationStr) {
    return Number(eval(operationStr).toFixed(FLOAT_PRECISION));
  }

  function getPerсent(operationNumber) {
    var MAX_PERCENT = 100;

    if (isFirstOperation) {
      return 0;
    }

    var operationArr = currentArithmeticOperationStr.split(' ');
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

  function performMathOpertaion(mathOpertaion) {
    var MATH_SIGN = MathSigns[mathOpertaion.toUpperCase()];
    var operationNumber;
    if (isLastOperationArithmetic) {
      operationNumber = currentResult;
    } else {
      operationNumber = currentNumber;
    }

    if (isLastOperationMath) {
      clearSpecialStringFromCalculation();
    }

    isLastOperationMath = true;

    if (mathOpertaion === 'percent') {
      currentResult = getPerсent(operationNumber);
      isLastOperationPercent = true;
    } else if (mathOpertaion === 'square') {
      currentResult = getSquare(operationNumber);
    } else if (mathOpertaion === 'root') {
      currentResult = getRoot(operationNumber);
    } else if (mathOpertaion === 'fraction') {
      currentResult = getFraction(operationNumber);
    }

    if (!isLastOperationPercent) {
      changeCalculationStrByMath(operationNumber, MATH_SIGN);
    } else {
      changeCalculationStrByPercent(currentResult);
    }
    replaceCurrentNumber(currentResult);

    isLastOperationArithmetic = false;
    isNewStep = true;
  }

  // function getIntermediateCalculationResult() {
  //   currentResult = getOperationResult(currentArithmeticOperationStr);
  //   numberField.value = currentResult;
  // }

  function performArithmeticOperation(arithmeticOperation) {
    var currentArithmeticSign = arithmeticOperation.toUpperCase() + '_SIGN';

    if (!isLastOperationArithmetic) {
      if (isFirstOperation) {
        changeCalculationStrByArithmetic(currentArithmeticSign, currentNumber);
        currentArithmeticOperationStr += currentNumber + ArithmeticSigns[currentArithmeticSign];
        currentResult = currentNumber;
      } else {
        changeCalculationStrByArithmetic(currentArithmeticSign, currentNumber);
        currentArithmeticOperationStr += currentNumber;
        currentResult = getOperationResult(currentArithmeticOperationStr);
        replaceCurrentNumber(currentResult);
        currentArithmeticOperationStr = currentResult + ArithmeticSigns[currentArithmeticSign];
      }

      isResultReceived = false;
      setNextCalculationStep();
    } else {
      changeNextArithmeticOperation(currentArithmeticSign);
    }

    isFirstOperation = false;
    isLastOperationPercent = false;
    isLastOperationMath = false;
  }

  function setNextCalculationStep() {
    isFloat = false;
    isLastOperationArithmetic = true;
    isNewStep = true;
  }

  function createString(arr, isWithSpace) {
    return (isWithSpace) ? arr.join(' ') : arr.join('');
  }

  function displayNewCalculationString() {
    calculationField.value = createString(calculationStringElementsArr);
  }

  function addElementForCalculationString(element) {
    calculationStringElementsArr.push(element);
  }

  function changeCalculationStrByArithmetic(sign, number) {
    if (isLastOperationMath) {
      addElementForCalculationString(ArithmeticSigns[sign]);
    } else {
      addElementForCalculationString(Number(number));
      addElementForCalculationString(ArithmeticSigns[sign]);
    }
    displayNewCalculationString();
  }

  function changeCalculationStrByMath(number, sign) {
    specialString = sign + '(' + Number(number) + ')';
    addElementForCalculationString(specialString);
    displayNewCalculationString();
  }

  function changeCalculationStrByPercent(number) {
    if (isFirstOperation) {
      addElementForCalculationString(0);
    } else {
      specialString = Number(number);
      addElementForCalculationString(specialString);
    }
    displayNewCalculationString();
  }

  function changeNextArithmeticOperation(lastArithmeticSign) {
    calculationStringElementsArr.pop();
    calculationStringElementsArr.push(ArithmeticSigns[lastArithmeticSign]);
    currentArithmeticOperationStr = currentArithmeticOperationStr.slice(0, -3) + ArithmeticSigns[lastArithmeticSign];
    displayNewCalculationString();
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
    displayNewCalculationString();
    resetSpecialString();
    isLastOperationMath = false;
    isLastOperationPercent = false;
  }

  function resetCalculation() {
    currentArithmeticOperationStr = currentResult = specialString = '';
    calculationStringElementsArr = [];

    if (isBigNumber) {
      numberField.style.fontSize = '';
    }

    replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
    clearScreen(calculationField);
    setBooleansDefault();
  }

  function clearCurrentNumber() {
    if (isLastOperationMath) {
      clearSpecialStringFromCalculation();
    }
    replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
    currentResult = DEFAULT_CURRENT_NUMBER;
    isFloat = false;
    isNewStep = true;
  }

  function startNewOperationAfterTotalDeletion(modifiedNumber) {
    modifiedNumber = DEFAULT_CURRENT_NUMBER;
    replaceCurrentNumber(modifiedNumber);
    isNewStep = true;
  }

  function deleteCurrentNumberSimbol() {
    var modifiedByDeletionNumber;
    var currentNumberLastSimbol = currentNumber[currentNumber.length - 1];

    if (!isNewStep) {
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
      if (isNewStep) {
        if (isLastOperationMath) {
          clearSpecialStringFromCalculation();
        }
        replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
        currentResult = currentNumber;
      } else {
        if (isCurrentNumberMoreMaxLength()) {
          return;
        }
      }

      changeCurrentNumber(FLOAT_SIGN);

      isFloat = true;
      isLastOperationArithmetic = false;
      isNewStep = false;
    } else {
      return;
    }
  }

  function getOperationStringForRepeating() {
    var isWithSpace = true;
    var lastOperationArr = lastArithmeticOperationStr.split(' ');
    lastOperationArr[0] = currentResult;
    lastArithmeticOperationStr = createString(lastOperationArr, isWithSpace);
    return lastArithmeticOperationStr;
  }

  function repeatLastArithmeticOperation() {
    currentResult = getOperationResult(getOperationStringForRepeating());
    replaceCurrentNumber(currentResult);
    isFloat = false;
    isNewStep = true;
  }

  function getCurrentArithmeticOperationResult() {
    if (isLastOperationArithmetic) {
      currentArithmeticOperationStr += currentResult;
    } else {
      currentArithmeticOperationStr += currentNumber;
    }
    lastArithmeticOperationStr = currentArithmeticOperationStr;
    currentResult = getOperationResult(currentArithmeticOperationStr);
    replaceCurrentNumber(currentResult);
    clearScreen(calculationField);
    currentArithmeticOperationStr = '';
    calculationStringElementsArr = [];
  }

  function getCalculationResult() {
    if (isResultReceived) {
      repeatLastArithmeticOperation();
    } else {
      getCurrentArithmeticOperationResult();
      setBooleansDefault();
      isResultReceived = true;
    }
  }

  function performMainOperation(pressedButtonValue) {
    mainOperations[pressedButtonValue](pressedButtonValue);
  }

  function performNumberOperation(pressedButtonValue) {
    if (isLastOperationMath || isLastOperationPercent) {
      clearSpecialStringFromCalculation();
    }

    isLastOperationArithmetic = false;

    if (isCurrentNumberMoreMaxLength()) {
      return;
    }

    if (isNewStep) {
      if (Number(pressedButtonValue) === 0) {
        replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
        currentResult = currentNumber;
        return;
      } else {
        currentNumber = '';
        isNewStep = false;
      }
    }

    changeCurrentNumber(pressedButtonValue);

    if (isResultReceived) {
      currentResult = currentNumber;
    }
  }

  function isNumberPressedButton(button) {
    return isNaN(button) ? false : true;
  }

  function getAction(pressedButton) {
    if (isNumberPressedButton(pressedButton)) {
      performNumberOperation(pressedButton);
    } else {
      performMainOperation(pressedButton);
    }
    controlScreenFontSize();
  }

  function isCurrentNumberMoreMaxLength() {
    return (numberField.value.length > NUMBER_MAX_LENGTH && !isNewStep) ? true : false;
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

    getAction(pressedButton);
  }

  DEFAULT_FONT_SIZE = getScreenDefaultFontSize();
  SMALLER_FONT_SIZE = getScreenSmallerFontSize();
  clearScreen(calculationField);
  buttons.addEventListener('click', onButtonClick);
})();
