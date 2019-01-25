'use strict';

(function () {
  function setBooleansDefault() {
    window.data.isBigNumber = false;
    window.data.isFirstOperation = true;
    window.data.isFloat = false;
    window.data.isLastOperationArithmetic = false;
    window.data.isLastOperationMath = false;
    window.data.isLastOperationPercent = false;
    window.data.isNewStep = true;
    window.data.isResultReceived = false;
  }

  function clearScreen(input) {
    input.value = '';
  }

  function createString(arr, isWithSpace) {
    return (isWithSpace) ? arr.join(' ') : arr.join('');
  }

  function getOperationResult(operationStr) {
    return Number(eval(operationStr).toFixed(window.data.FLOAT_PRECISION));
  }

  window.utils = {
    setBooleansDefault: setBooleansDefault,
    clearScreen: clearScreen,
    createString: createString,
    getOperationResult: getOperationResult,
  };
})();
