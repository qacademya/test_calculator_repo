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
    window.data.isNegativeStr = false;
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
    window.data.isNegativeStr = false;
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

  function toggleNegativeSign(number) {
    return getOperationResult(0 - Number(number));
  }

  window.utils = {
    setBooleansDefault: setBooleansDefault,
    setNextCalculationStep: setNextCalculationStep,
    clearScreen: clearScreen,
    createStr: createStr,
    getOperationResult: getOperationResult,
    toggleNegativeSign: toggleNegativeSign,
  };
})();
