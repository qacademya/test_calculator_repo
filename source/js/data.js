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
    isNegativeStr: false,
    isNewStep: true,
    isResultReceived: false,
    FLOAT_PRECISION: 11,
    currentNumber: '',
    currentArithmeticOperationStr: '',
    currentResult: '',
    calculationStrElementsArr: [],
  };
})();
