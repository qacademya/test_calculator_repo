'use strict';

(function () {
  window.data = {
    calculator: document.querySelector('.calculator'),
    isBigNumber: false,
    isFirstOperation: true,
    isFloat: false,
    isLastOperationArithmetic: false,
    isLastOperationPercent: false,
    isLastOperationMath: false,
    isNewStep: true,
    isResultReceived: false,
    FLOAT_PRECISION: 11,
    currentArithmeticOperationStr: '',
  };
})();
