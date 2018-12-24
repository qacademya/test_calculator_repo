'use strict';

(function () {
	var DIGIT_ONE = 49;
	var DIGIT_ONE_NUM = 97;

	window.keyEvents = {
		isDigitOneEvent: function (evt, action) {
			if (evt.keyCode === DIGIT_ONE || evt.keyCode === DIGIT_ONE_NUM) {
				action();
			}
		},

	}
})();
