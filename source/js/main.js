'use strict';

(function () {
  var DEFAULT_CURRENT_NUMBER = '0';
  var DEFAULT_FONT_SIZE;
  var NUMBER_MAX_LENGTH = 11;

  var calculator = window.data.calculator;
  var buttons = calculator.querySelector('.buttons');
  var calculationField = calculator.querySelector('#screen_calculation');
  var numberField = calculator.querySelector('#screen_number');

  var MathSigns = {
    SQUARE: 'sqr',
    ROOT: '√',
    FRACTION: '1/',
  };

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
    negative: setNegativeNumber,
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

    if (mathOpertaion === 'percent' && window.data.isResultReceived) {
      return;
    }

    if (window.data.isLastOperationArithmetic) {
      operationNumber = window.data.currentResult;
    } else {
      operationNumber = window.data.currentNumber;
    }

    if (window.data.isLastOperationMath) {
      window.calculation.clearSpecialStrFromCalculation();
    }

    window.data.isLastOperationMath = true;

    window.data.currentResult = window.math.getMathOperationResult(mathOpertaion, operationNumber);
    window.calculation.changeCalculationStrByMath(operationNumber, MATH_SIGN);
    window.calculation.replaceCurrentNumber(window.data.currentResult);

    window.data.isLastOperationArithmetic = false;
    window.data.isNewStep = true;
  }

  function performArithmeticOperation(arithmeticOperation) {
    var currentArithmeticSign = arithmeticOperation.toUpperCase() + '_SIGN';

    if (!window.data.isLastOperationArithmetic) {
      if (window.data.isFirstOperation) {
        window.calculation.changeCalculationStrByArithmetic(currentArithmeticSign, window.data.currentNumber);
        window.data.currentArithmeticOperationStr += window.data.currentNumber + window.data.ArithmeticSigns[currentArithmeticSign];
        window.data.currentResult = window.data.currentNumber;
      } else {
        window.calculation.changeCalculationStrByArithmetic(currentArithmeticSign, window.data.currentNumber);
        window.data.currentArithmeticOperationStr += window.data.currentNumber;
        window.calculation.getArithmeticOperationResult(window.data.currentArithmeticOperationStr);
        window.data.currentArithmeticOperationStr = window.data.currentResult + window.data.ArithmeticSigns[currentArithmeticSign];
      }

      window.utils.setNextCalculationStep();
    } else {
      window.calculation.changeNextArithmeticOperation(currentArithmeticSign);
    }
  }

  function resetCalculation() {
    window.data.currentArithmeticOperationStr = window.data.currentResult = '';
    window.data.calculationStrElementsArr = [];

    if (window.data.isBigNumber) {
      numberField.style.fontSize = '';
    }

    window.calculation.replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
    window.utils.clearScreen(calculationField);
    window.utils.setBooleansDefault();
  }

  function clearCurrentNumber() {
    if (window.data.isLastOperationMath) {
      window.calculation.clearSpecialStrFromCalculation();
    }
    window.calculation.replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
    window.data.currentResult = DEFAULT_CURRENT_NUMBER;
    window.data.isFloat = false;
    window.data.isNegative = false;
    window.data.isNegativeStr = false;
    window.data.isNewStep = true;
  }

  function startNewOperationAfterTotalDeletion() {
    window.calculation.replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
    window.data.isNegative = false;
    window.data.isNewStep = true;
  }

  function deleteCurrentNumberSimbol() {
    var modifiedByDeletionNumber;
    var currentNumberLastSimbol = window.data.currentNumber[window.data.currentNumber.length - 1];
    var currentNumberFirstSimbol = window.data.currentNumber[0];

    if (!window.data.isNewStep) {
      if (window.data.currentNumber.length > 1) {
        if (currentNumberLastSimbol === '.') {
          window.data.isFloat = false;
        }

        modifiedByDeletionNumber = window.data.currentNumber.slice(0, -1);
        window.calculation.replaceCurrentNumber(modifiedByDeletionNumber);

        if (window.data.currentNumber === DEFAULT_CURRENT_NUMBER || (window.data.currentNumber.length === 1 && currentNumberFirstSimbol === '-')) {
          startNewOperationAfterTotalDeletion();
        }
      } else {
        startNewOperationAfterTotalDeletion();
      }
    } else {
      return;
    }
  }

  function setNegativeNumber() {
    var negativeNumber;
    if (Number(window.data.currentNumber) !== 0 && (!window.data.isNewStep || window.data.isLastOperationMath || window.data.isResultReceived)) {
      negativeNumber = window.utils.toggleNegativeSign(window.data.currentNumber);
      window.calculation.replaceCurrentNumber(negativeNumber);
      window.data.currentResult = window.data.currentNumber;
      window.data.isNegative = (window.data.isNegative) ? false : true;
      window.calculation.changeCalculationStrByNegative();
    } else {
      return;
    }
  }

  function setFloatingPointNumber() {
    var FLOAT_SIGN = '.';

    if (!window.data.isFloat) {
      if (window.data.isNewStep) {
        if (window.data.isLastOperationMath) {
          window.calculation.clearSpecialStrFromCalculation();
        }
        window.calculation.replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
        window.data.currentResult = window.data.currentNumber;
      } else {
        if (isCurrentNumberMoreMaxLength()) {
          return;
        }
      }

      window.calculation.changeCurrentNumber(FLOAT_SIGN);

      window.data.isFloat = true;
      window.data.isLastOperationArithmetic = false;
      window.data.isNewStep = false;
    } else {
      return;
    }
  }

  function getCalculationResult() {
    if (window.data.isResultReceived) {
      window.calculation.repeatLastArithmeticOperation();
    } else {
      window.calculation.getCurrentArithmeticOperationResult();
      window.utils.setBooleansDefault();
      window.data.isResultReceived = true;
    }
  }

  function performMainOperation(pressedButtonValue) {
    mainOperations[pressedButtonValue](pressedButtonValue);
  }

  function performNumberOperation(pressedButtonValue) {
    if (window.data.isLastOperationMath || window.data.isLastOperationPercent || window.data.isNegative) {
      window.calculation.clearSpecialStrFromCalculation();
      window.data.isNegative = false;
    }

    window.data.isLastOperationArithmetic = false;

    if (isCurrentNumberMoreMaxLength()) {
      return;
    }

    if (window.data.isNewStep) {
      if (Number(pressedButtonValue) === 0) {
        window.calculation.replaceCurrentNumber(DEFAULT_CURRENT_NUMBER);
        window.data.currentResult = window.data.currentNumber;
        return;
      } else {
        window.data.currentNumber = '';
        window.data.isNewStep = false;
      }
    }

    window.calculation.changeCurrentNumber(pressedButtonValue);

    if (window.data.isResultReceived) {
      window.data.currentResult = window.data.currentNumber;
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
    return (numberField.value.length === NUMBER_MAX_LENGTH && !window.data.isNewStep) ? true : false;
  }

  function changeScreenFontSize(fontSize) {
    numberField.style.fontSize = fontSize;
  }

  function controlScreenFontSize() {
    if (numberField.value.length > NUMBER_MAX_LENGTH + 1) {
      changeScreenFontSize(getScreenSmallerFontSize());
      window.data.isBigNumber = true;
    }
    if (window.data.isBigNumber && numberField.value.length <= NUMBER_MAX_LENGTH) {
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
    return (parseInt(DEFAULT_FONT_SIZE, 10) - numberField.value.length) + 'px';
  }

  DEFAULT_FONT_SIZE = getScreenDefaultFontSize();
  window.utils.clearScreen(calculationField);
  buttons.addEventListener('click', onButtonClick);
})();
