'use strict';

var calculator = window.data.calculator;
var calculationField = calculator.querySelector('#screen_calculation');
var numberField = calculator.querySelector('#screen_number');

var specialStr = '';
var lastArithmeticOperationStr = '';
var oldLastElementValue;

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
    if (window.data.isLastOperationMath || window.data.isNegativeStr) {
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

  function changeCalculationStrByNegative() {
    var arrLastElementIndex;
    if (window.data.isResultReceived) {
      arrLastElementIndex = 0;
      window.data.calculationStrElementsArr[arrLastElementIndex] = window.utils.toggleNegativeSign(window.data.currentNumber);
    } else {
      arrLastElementIndex = window.data.calculationStrElementsArr.length - 1;
    }

    if (window.data.isNegative) {
      if (window.data.isLastOperationMath || window.data.isResultReceived) {
        oldLastElementValue = (window.data.isResultReceived) ? '' : window.data.calculationStrElementsArr[arrLastElementIndex];

        specialStr = 'negate(' + window.data.calculationStrElementsArr[arrLastElementIndex] + ')';

        toggleNegateStrOnCalculationStr(arrLastElementIndex, specialStr);
      } else {
        return;
      }
    } else {
      if (window.data.isLastOperationMath || window.data.isResultReceived) {
        toggleNegateStrOnCalculationStr(arrLastElementIndex, oldLastElementValue);
      } else {
        return;
      }
    }
  }

  function toggleNegateStrOnCalculationStr(arrIndex, newValue) {
    window.data.calculationStrElementsArr[arrIndex] = newValue;
    displayNewCalculationStr();
    window.data.isNegativeStr = (window.data.isNegativeStr) ? false : true;
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
    if (window.data.isNegative) {
      clearSpecialStrFromCalculation();
      window.data.isNegative = false;
    }
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
    changeCalculationStrByNegative: changeCalculationStrByNegative,
    repeatLastArithmeticOperation: repeatLastArithmeticOperation,
    getCurrentArithmeticOperationResult: getCurrentArithmeticOperationResult,
  };
})();
