'use strict';

(function () {
  window.data = {
    ArithmeticSigns: {
      SEGMENTATION_SIGN: ' / ',
      MULTIPLICATION_SIGN: ' * ',
      SUMMATION_SIGN: ' + ',
      SUBTRACTION_SIGN: ' - ',
    },
    calculator: document.querySelector('.calculator'),
    isBigNumber: false,
    isFirstOperation: true,
    isFloat: false,
    isLastOperationArithmetic: false,
    isLastOperationPercent: false,
    isLastOperationMath: false,
    isNegative: false,
    isNewStep: true,
    isResultReceived: false,
    FLOAT_PRECISION: 11,
    currentNumber: '',
    currentArithmeticOperationStr: '',
    currentResult: '',
    calculationStrElementsArr: [],
  };
})();

'use strict';

(function () {
  function setBooleansDefault() {
    window.data.isBigNumber = false;
    window.data.isFirstOperation = true;
    window.data.isFloat = false;
    window.data.isLastOperationArithmetic = false;
    window.data.isLastOperationMath = false;
    window.data.isLastOperationPercent = false;
    window.data.isNegative = false;
    window.data.isNewStep = true;
    window.data.isResultReceived = false;
  }

  function setNextCalculationStep() {
    window.data.isFirstOperation = false;
    window.data.isFloat = false;
    window.data.isLastOperationArithmetic = true;
    window.data.isLastOperationMath = false;
    window.data.isLastOperationPercent = false;
    window.data.isNegative = false;
    window.data.isNewStep = true;
    window.data.isResultReceived = false;
  }

  function clearScreen(input) {
    input.value = '';
  }

  function createStr(arr, isWithSpace) {
    return (isWithSpace) ? arr.join(' ') : arr.join('');
  }

  function getOperationResult(operationStr) {
    return Number(eval(operationStr).toFixed(window.data.FLOAT_PRECISION));
  }

  function deleteNegativeSign() {
    return window.data.currentNumber.slice(1);
  }

  window.utils = {
    setBooleansDefault: setBooleansDefault,
    setNextCalculationStep: setNextCalculationStep,
    clearScreen: clearScreen,
    createStr: createStr,
    getOperationResult: getOperationResult,
    deleteNegativeSign: deleteNegativeSign,
  };
})();

'use strict';

(function () {
  function getPerсent(percentNumber) {
    var MAX_PERCENT = 100;

    if (window.data.isFirstOperation) {
      return 0;
    }

    var operationArr = window.data.currentArithmeticOperationStr.split(' ');
    operationArr[2] = percentNumber;
    return Number(operationArr[0]) / MAX_PERCENT * Number(operationArr[2]);
  }

  function getSquare(operationNumber) {
    return Number((Number(operationNumber) * Number(operationNumber)).toFixed(window.data.FLOAT_PRECISION));
  }

  function getRoot(operationNumber) {
    return Number((Math.sqrt(Number(operationNumber))).toFixed(window.data.FLOAT_PRECISION));
  }

  function getFraction(operationNumber) {
    return Number(1 / (Number(operationNumber)).toFixed(window.data.FLOAT_PRECISION));
  }

  function getMathOperationResult(mathOpertaion, operationNumber) {
    switch (mathOpertaion) {
      case 'percent':
        window.data.isLastOperationPercent = true;
        return getPerсent(operationNumber);
      case 'square':
        return getSquare(operationNumber);
      case 'root':
        return getRoot(operationNumber);
      case 'fraction':
        return getFraction(operationNumber);
    }
  }

  window.math = {
    getMathOperationResult: getMathOperationResult,
  };
})();

'use strict';

var calculator = window.data.calculator;
var calculationField = calculator.querySelector('#screen_calculation');
var numberField = calculator.querySelector('#screen_number');

var specialStr = '';
var lastArithmeticOperationStr = '';

(function () {
  function changeCurrentNumber(newValue) {
    window.data.currentNumber += newValue;
    numberField.value = window.data.currentNumber;
  }

  function replaceCurrentNumber(newValue) {
    window.data.currentNumber = '';
    changeCurrentNumber(newValue);
  }

  function getArithmeticOperationResult(operationStr) {
    window.data.currentResult = window.utils.getOperationResult(operationStr);
    replaceCurrentNumber(window.data.currentResult);
  }

  function displayNewCalculationStr() {
    calculationField.value = window.utils.createStr(window.data.calculationStrElementsArr);
  }

  function addElementForCalculationStr(element) {
    window.data.calculationStrElementsArr.push(element);
  }

  function changeCalculationStrByArithmetic(sign, number) {
    if (window.data.isLastOperationMath) {
      addElementForCalculationStr(window.data.ArithmeticSigns[sign]);
    } else {
      addElementForCalculationStr(Number(number));
      addElementForCalculationStr(window.data.ArithmeticSigns[sign]);
    }
    displayNewCalculationStr();
  }

  function changeCalculationStrByMath(number, sign) {
    if (window.data.isLastOperationPercent) {
      if (window.data.isFirstOperation) {
        specialStr = '0';
      } else {
        specialStr = Number(window.data.currentResult).toString();
      }
    } else {
      specialStr = sign + '(' + Number(number) + ')';
    }
    addElementForCalculationStr(specialStr);
    displayNewCalculationStr();
  }

  function changeNextArithmeticOperation(lastArithmeticSign) {
    window.data.calculationStrElementsArr.pop();
    window.data.calculationStrElementsArr.push(window.data.ArithmeticSigns[lastArithmeticSign]);
    window.data.currentArithmeticOperationStr = window.data.currentArithmeticOperationStr.slice(0, -3) + window.data.ArithmeticSigns[lastArithmeticSign];
    displayNewCalculationStr();
  }

  function resetSpecialStr() {
    specialStr = '';
  }

  function clearSpecialStrFromCalculation() {
    window.data.calculationStrElementsArr.pop();
    displayNewCalculationStr();
    resetSpecialStr();
    window.data.isLastOperationMath = false;
    window.data.isLastOperationPercent = false;
  }

  function getOperationStrForRepeating() {
    var isWithSpace = true;
    var lastOperationArr = lastArithmeticOperationStr.split(' ');
    lastOperationArr[0] = window.data.currentResult;
    lastArithmeticOperationStr = window.utils.createStr(lastOperationArr, isWithSpace);
    return lastArithmeticOperationStr;
  }

  function repeatLastArithmeticOperation() {
    window.calculation.getArithmeticOperationResult(getOperationStrForRepeating());
    window.data.isFloat = false;
    window.data.isNewStep = true;
  }

  function getCurrentArithmeticOperationResult() {
    if (window.data.isLastOperationArithmetic) {
      window.data.currentArithmeticOperationStr += window.data.currentResult;
    } else {
      window.data.currentArithmeticOperationStr += window.data.currentNumber;
    }
    lastArithmeticOperationStr = window.data.currentArithmeticOperationStr;
    window.calculation.getArithmeticOperationResult(window.data.currentArithmeticOperationStr);
    window.utils.clearScreen(calculationField);
    window.data.currentArithmeticOperationStr = '';
    window.data.calculationStrElementsArr = [];
  }


  window.calculation = {
    changeCurrentNumber: changeCurrentNumber,
    replaceCurrentNumber: replaceCurrentNumber,
    getArithmeticOperationResult: getArithmeticOperationResult,
    clearSpecialStrFromCalculation: clearSpecialStrFromCalculation,
    changeCalculationStrByArithmetic: changeCalculationStrByArithmetic,
    changeNextArithmeticOperation: changeNextArithmeticOperation,
    changeCalculationStrByMath: changeCalculationStrByMath,
    repeatLastArithmeticOperation: repeatLastArithmeticOperation,
    getCurrentArithmeticOperationResult: getCurrentArithmeticOperationResult,
  };
})();

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
    if (!window.data.isNewStep) {
      if (!window.data.isNegative) {
        window.data.currentNumber = '-' + window.data.currentNumber;
        window.data.isNegative = true;
      } else {
        window.data.currentNumber = window.utils.deleteNegativeSign();
        window.data.isNegative = false;
      }
      window.calculation.replaceCurrentNumber(window.data.currentNumber);
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
    if (window.data.isLastOperationMath || window.data.isLastOperationPercent) {
      window.calculation.clearSpecialStrFromCalculation();
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
