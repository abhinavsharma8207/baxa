/*
services for common formulas
*/
unificationBAXA.service('commonFormulaSvc', [ function() {
  'use strict';
  var commonObj = this;
  /*DEfine*/
  commonObj.add = add;
  commonObj.subtract = subtract;
  commonObj.multiply = multiply;
  commonObj.multiplyArray = multiplyArray;
  commonObj.divide = divide;
  commonObj.roundUp = roundUp;
  commonObj.roundDown = roundDown;
  commonObj.round = round;
  commonObj.percentOf = percentOf;
  commonObj.minValue = minValue;
  commonObj.maxValue = maxValue;
  commonObj.calcIRR = calcIRR;

  /*Implement*/
  /**
		@params1:
		@params2:
		@return:
		*/
  function add(a, b) {
    return a + b;
  }
  /**
		@params1:
		@params2:
		@return:
		*/
  function subtract(a, b) {
    return a - b;
  }
  /**
		@params1:
		@params2:
		@return:
		*/
  function multiply(a, b) {
    return a * b;
  }

  function multiplyArray(array) {
    var total = array.reduce(function(a, b) {
      return a * b;
    });
    return total;
  }
  /**
		@params1:
		@params2:
		@return:
		*/
  function divide(a, b) {
    return a / b;
  }
  /*
        roundUp willupward to it's nearest integer
        @params1:Number for rounding up
        @params1 : Upto decimal points
      	*/
  function roundUp(number, noOfDecimal) {
    return +(Math.ceil(number + "e+" + noOfDecimal) + "e-" + noOfDecimal);
  }

 

  function roundDown(number, noOfDecimal) {
    return +(Math.floor(number + "e+" + noOfDecimal) + "e-" + noOfDecimal);
  }
  /**
    round willupward to it's nearest integer
    @params1:Number for rounding up
    @params1 : Upto decimal points
  */
  function round(number, noOfDecimal) {
    return +(Math.round(number + "e+" + noOfDecimal) + "e-" + noOfDecimal);
  }

  function percentOf(percent, value) {
    return value * percent * 0.01;
  }

  function minValue(number1, number2) {
    return Math.min(number1, number2);
  }

  function maxValue(number1, number2) {
    return Math.max(number1, number2);
  }

  function calcIRR(cArray) {
    var guest = 0.001;
    var j;
    var inc = 0.0001;
    if (!guest) {
      guest = 110.00;
    }
    do {
      guest += inc;
      var NPV = 0; /*As it is formula for Irr need to declare NPV within loop*/
      for (j = 0; j < cArray.length; j++) {
        NPV += cArray[j] / Math.pow((1 + guest), j);
      }
    } while (NPV > 0);
    return guest * 100;
  }
}]);

unificationBAXA.service('commonPremiumFormulaService', [
  'commonFormulaSvc',
  'common_const',
  function(commonFormulaSvc,common_const) {
    'use strict';
    var commonPremiumObject = this;
    commonPremiumObject.calculateModalPremium = calculateModalPremium;
    commonPremiumObject.calculateModalPremiumForNSAP = calculateModalPremiumForNSAP;
    commonPremiumObject.calculatePremiumDueToNsap = calculatePremiumDueToNsap;
    commonPremiumObject.calculateServiceTax = calculateServiceTax;
    commonPremiumObject.calculateSumAssured = calculateSumAssured;
    commonPremiumObject.calculatePremium = calculatePremium;

    function calculateSumAssured(premiumRate,basePremium){
        var firstVal = commonFormulaSvc.multiply(basePremium,common_const.factForCalSumOrPrem);
        var sumAssured = commonFormulaSvc.divide(firstVal,premiumRate);
        return sumAssured;

    }

    function calculatePremium(premiumRate,sumAssured){
        var firstVal = commonFormulaSvc.multiply(premiumRate,sumAssured);
        var premium = commonFormulaSvc.divide(firstVal,common_const.factForCalSumOrPrem);
        return premium;

    }

    function calculateModalPremium(premium, premiumToModalFactor) {
      var baseModalPremium = commonFormulaSvc.round(premiumToModalFactor * premium, 0);
      return baseModalPremium;
    }

    /*formula for nsap
    Round/RoundUP/ROUNDDOWN
    product wise*/
    function calculatePremiumDueToNsap(sumAssured, nsapFactor) {
        var factor = commonFormulaSvc.divide(nsapFactor,common_const.factForCalSumOrPrem);
        return commonFormulaSvc.multiply(sumAssured,factor);
    }

    function calculateModalPremiumForNSAP(extraPremiumDueToNSAP, premiumToModalFactor) {
      return commonFormulaSvc.round(commonFormulaSvc.multiply(extraPremiumDueToNSAP, premiumToModalFactor), 0);
    }

    function calculateServiceTax(factorForCal, totalModalPremium) {
            var sTax = commonFormulaSvc.multiply(factorForCal, totalModalPremium);
            return commonFormulaSvc.round(sTax, 0);
    }
  }
]);
