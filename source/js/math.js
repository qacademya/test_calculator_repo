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
