'use strict';

(function () {
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
  var isTotalDeleted;

  var pressedButtonValue;
  var currentNumber = numberField.value;
  var currentCalculationStr = '';
  var lastNumber = '';

  var operations = {
    arithmetic: function (arithmeticOperation) {
      var currentNumberLastSimbol = currentNumber[currentNumber.length - 1];
      var currentArithmeticSign = arithmeticOperation.toUpperCase() + '_SIGN';

      if (!isLastOperationArithmetic) {
        if (currentNumberLastSimbol === '.') {
          currentNumber = currentNumber.slice(0, -1);
        }
        lastNumber = currentNumber;
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
      currentNumber = '0';
      currentCalculationStr = '';
      lastNumber = '';
      numberField.value = 0;
      clearDisplay(calculationField);
      clearDisplay(lastResultField);
      isFloat = false;
      isNewOperation = true;
      isLastOperationArithmetic = false;
    },
    delete: function () {
      var modifiedByDeletionNumber;
      if (!isNewOperation && !isTotalDeleted) {
        if (currentNumber.length > 1) {
          if (currentNumber[currentNumber.length - 1] === '.') {
            isFloat = false;
          }
          modifiedByDeletionNumber = currentNumber.slice(0, -1);
          currentNumber = '';
          changeCurrentNumber(modifiedByDeletionNumber);
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
      if (!isFloat) {
        var changedNumber = currentNumber + '.';
        currentNumber = '';
        changeCurrentNumber(changedNumber);
        isFloat = true;
        isZeroAvailable = true;
      } else {
        return;
      }
    },
    result:function (operation) {
    }
  }

  function startNewOperationAfterDeletion(modifiedNumber) {
    modifiedNumber = 0;
    currentNumber = '';
    changeCurrentNumber(modifiedNumber);
    isNewOperation = true;
    isLastOperationArithmetic = false;
    isTotalDeleted = true;
  }

  function getArithmeticOperation(currentArithmeticOperationBtnPressed) {
    operations.arithmetic(currentArithmeticOperationBtnPressed);
  }

  function setNextCalculationStep(arithmeticSign) {
    currentCalculationStr += currentNumber + ArithmeticSigns[arithmeticSign];
    calculationField.value = currentCalculationStr;
    isFloat = false;
    isNewOperation = true;
    isLastOperationArithmetic = true;
    isZeroAvailable = true;
    currentNumber = '0';
  }

  function changeLastArithmeticOperationSign(lastArithmeticSign) {
    currentCalculationStr = currentCalculationStr.slice(0, -3) + ArithmeticSigns[lastArithmeticSign];
    calculationField.value = currentCalculationStr;
  }

  function clearDisplay(input) {
    input.value = '';
  }

	function changeCurrentNumber(newValue) {
    if (isNewOperation) {
      clearDisplay(numberField);
      currentNumber = '';
      isNewOperation = false;
      isTotalDeleted = false;
    }
    currentNumber += newValue;
    numberField.value = currentNumber;
  }

  function changeCurrentCalculation(buttonValue) {
    var currentValue = buttonValue;
    if (isNaN(+currentValue)) {
      operations[currentValue](currentValue);
    } else {
      if (+currentValue === 0 && !isZeroAvailable) {
        return;
      } else if (+currentValue === 0 && isNewOperation && isZeroAvailable) {
        isZeroAvailable = false;
      }

      if (isLastOperationArithmetic) {
        isLastOperationArithmetic = false;
      }
      if (!isZeroAvailable && !isFloat) {
        currentValue += '.';
        isFloat = true;
        isZeroAvailable = true;
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
