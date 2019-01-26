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
