'use strict';

(function () {
  var DEFAULT_CURRENT_NUMBER = '0';
  // var FLOAT_PRECISION = 11;
  var DEFAULT_FONT_SIZE;
  var SMALLER_FONT_SIZE;
  var FONT_SIZE_STEP = 10;
  var NUMBER_MAX_LENGTH = 15;

  var calculator = window.data.calculator;
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

  var currentNumber = DEFAULT_CURRENT_NUMBER;
  var calculationStringElementsArr = [];
  // var currentArithmeticOperationStr = '';
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

  function getArithmeticOperation(currentArithmeticOperationBtnPressed) {
    mainOperations.arithmetic(currentArithmeticOperationBtnPressed);
  }

  function getMathOperation(currentMathOperationBtnPressed) {
    mainOperations.math(currentMathOperationBtnPressed);
  }

  function performMathOpertaion(mathOpertaion) {
    var MATH_SIGN = MathSigns[mathOpertaion.toUpperCase()];
    var operationNumber;

    if (window.data.isLastOperationArithmetic) {
      operationNumber = currentResult;
    } else {
      operationNumber = currentNumber;
    }

    if (window.data.isLastOperationMath) {
      clearSpecialStringFromCalculation();
    }

    window.data.isLastOperationMath = true;

    currentResult = window.mathOperations.getMathOperationResult(mathOpertaion, operationNumber);
    changeCalculationStrByMath(operationNumber, MATH_SIGN);
    replaceCurrentNumber(currentResult);

    window.data.isLastOperationArithmetic = false;
    window.data.isNewStep = true;
  }

  function getArithmeticOperationResult(operationStr) {
    currentResult = window.utils.getOperationResult(operationStr);
    replaceCurrentNumber(currentResult);
  }

  function performArithmeticOperation(arithmeticOperation) {
    var currentArithmeticSign = arithmeticOperation.toUpperCase() + '_SIGN';

    if (!window.data.isLastOperationArithmetic) {
      if (window.data.isFirstOperation) {
        changeCalculationStrByArithmetic(currentArithmeticSign, currentNumber);
        window.data.currentArithmeticOperationStr += currentNumber + ArithmeticSigns[currentArithmeticSign];
        currentResult = currentNumber;
      } else {
        changeCalculationStrByArithmetic(currentArithmeticSign, currentNumber);
        window.data.currentArithmeticOperationStr += currentNumber;
        getArithmeticOperationResult(window.data.currentArithmeticOperationStr);
        window.data.currentArithmeticOperationStr = currentResult + ArithmeticSigns[currentArithmeticSign];
      }

      setNextCalculationStep();
    } else {
      changeNextArithmeticOperation(currentArithmeticSign);
    }
  }

  function setNextCalculationStep() {
    window.data.isFirstOperation = false;
    window.data.isFloat = false;
    window.data.isLastOperationArithmetic = true;
    window.data.isLastOperationMath = false;
    window.data.isLastOperationPercent = false;
    window.data.isNewStep = true;
    window.data.isResultReceived = false;
  }

  function displayNewCalculationString() {
    calculationField.value = window.utils.createString(calculationStringElementsArr);
  }

  function addElementForCalculationString(element) {
    calculationStringElementsArr.push(element);
  }

  function changeCalculationStrByArithmetic(sign, number) {
    if (window.data.isLastOperationMath) {
      addElementForCalculationString(ArithmeticSigns[sign]);
    } else {
      addElementForCalculationString(Number(number));
      addElementForCalculationString(ArithmeticSigns[sign]);
    }
    displayNewCalculationString();
  }

  function changeCalculationStrByMath(number, sign) {
    if (window.data.isLastOperationPercent) {
      if (window.data.isFirstOperation) {
        specialString = '0';
      } else {
        specialString = Number(currentResult).toString();
      }
    } else {
      specialString = sign + '(' + Number(number) + ')';
    }
    addElementForCalculationString(specialString);
    displayNewCalculationString();
  }

  function changeNextArithmeticOperation(lastArithmeticSign) {
    calculationStringElementsArr.pop();
    calculationStringElementsArr.push(ArithmeticSigns[lastArithmeticSign]);
    window.data.currentArithmeticOperationStr = window.data.currentArithmeticOperationStr.slice(0, -3) + ArithmeticSigns[lastArithmeticSign];
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
    window.data.isLastOperationMath = false;
    window.data.isLastOperationPercent = false;
  }

  function resetCalculation() {
    window.data.currentArithmeticOperationStr = currentResult = specialString = '';
    calculationStringElementsArr = [];

    if (window.data.isBigNumber) {
      numberField.style.fontSize = '';
    }

    replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
    window.utils.clearScreen(calculationField);
    window.utils.setBooleansDefault();
  }

  function clearCurrentNumber() {
    if (window.data.isLastOperationMath) {
      clearSpecialStringFromCalculation();
    }
    replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
    currentResult = DEFAULT_CURRENT_NUMBER;
    window.data.isFloat = false;
    window.data.isNewStep = true;
  }

  function startNewOperationAfterTotalDeletion(modifiedNumber) {
    modifiedNumber = DEFAULT_CURRENT_NUMBER;
    replaceCurrentNumber(modifiedNumber);
    window.data.isNewStep = true;
  }

  function deleteCurrentNumberSimbol() {
    var modifiedByDeletionNumber;
    var currentNumberLastSimbol = currentNumber[currentNumber.length - 1];

    if (!window.data.isNewStep) {
      if (currentNumber.length > 1) {
        if (currentNumberLastSimbol === '.') {
          window.data.isFloat = false;
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

    if (!window.data.isFloat) {
      if (window.data.isNewStep) {
        if (window.data.isLastOperationMath) {
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

      window.data.isFloat = true;
      window.data.isLastOperationArithmetic = false;
      window.data.isNewStep = false;
    } else {
      return;
    }
  }

  function getOperationStringForRepeating() {
    var isWithSpace = true;
    var lastOperationArr = lastArithmeticOperationStr.split(' ');
    lastOperationArr[0] = currentResult;
    lastArithmeticOperationStr = window.utils.createString(lastOperationArr, isWithSpace);
    return lastArithmeticOperationStr;
  }

  function repeatLastArithmeticOperation() {
    getArithmeticOperationResult(getOperationStringForRepeating());
    window.data.isFloat = false;
    window.data.isNewStep = true;
  }

  function getCurrentArithmeticOperationResult() {
    if (window.data.isLastOperationArithmetic) {
      window.data.currentArithmeticOperationStr += currentResult;
    } else {
      window.data.currentArithmeticOperationStr += currentNumber;
    }
    lastArithmeticOperationStr = window.data.currentArithmeticOperationStr;
    getArithmeticOperationResult(window.data.currentArithmeticOperationStr);
    window.utils.clearScreen(calculationField);
    window.data.currentArithmeticOperationStr = '';
    calculationStringElementsArr = [];
  }

  function getCalculationResult() {
    if (window.data.isResultReceived) {
      repeatLastArithmeticOperation();
    } else {
      getCurrentArithmeticOperationResult();
      window.utils.setBooleansDefault();
      window.data.isResultReceived = true;
    }
  }

  function performMainOperation(pressedButtonValue) {
    mainOperations[pressedButtonValue](pressedButtonValue);
  }

  function performNumberOperation(pressedButtonValue) {
    if (window.data.isLastOperationMath || window.data.isLastOperationPercent) {
      clearSpecialStringFromCalculation();
    }

    window.data.isLastOperationArithmetic = false;

    if (isCurrentNumberMoreMaxLength()) {
      return;
    }

    if (window.data.isNewStep) {
      if (Number(pressedButtonValue) === 0) {
        replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
        currentResult = currentNumber;
        return;
      } else {
        currentNumber = '';
        window.data.isNewStep = false;
      }
    }

    changeCurrentNumber(pressedButtonValue);

    if (window.data.isResultReceived) {
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
    return (numberField.value.length > NUMBER_MAX_LENGTH && !window.data.isNewStep) ? true : false;
  }

  function changeScreenFontSize(fontSize) {
    numberField.style.fontSize = fontSize;
  }

  function controlScreenFontSize() {
    if (numberField.value.length > NUMBER_MAX_LENGTH + 1) {
      changeScreenFontSize(SMALLER_FONT_SIZE);
      window.data.isBigNumber = true;
    }
    if (window.data.isBigNumber && numberField.value.length <= NUMBER_MAX_LENGTH - 1) {
      changeScreenFontSize(DEFAULT_FONT_SIZE);
      window.data.isBigNumber = false;
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

  function getScreenDefaultFontSize() {
    return window.getComputedStyle(numberField, null).getPropertyValue('font-size');
  }

  function getScreenSmallerFontSize() {
    return (parseInt(DEFAULT_FONT_SIZE, 10) - FONT_SIZE_STEP) + 'px';
  }

  DEFAULT_FONT_SIZE = getScreenDefaultFontSize();
  SMALLER_FONT_SIZE = getScreenSmallerFontSize();
  window.utils.clearScreen(calculationField);
  buttons.addEventListener('click', onButtonClick);
})();
