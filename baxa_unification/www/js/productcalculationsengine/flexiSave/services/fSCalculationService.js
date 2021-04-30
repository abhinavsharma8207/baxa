/*
 * Created By: Atul A
 * Service for Premium Calculation Service here injecting all services
 */
productCalculator.service(
  'fSCalculationService', [
    '$q',
    '$log',
    'commonFormulaSvc',
    'commonDBFuncSvc',
    'fSDataFromDBSvc',
    'adbRiderForASDataFromUserSvc',
    'calculateAdbRiderPremiumSvc',
    'hospiCashRiderDataFromUserSvc',
    'calculatehospiCashRiderPremiumSvc',
    'commonDbProductCalculation',
    'commonPremiumFormulaService',
    'common_const',
    function($q, $log, commonFormulaSvc, commonDBFuncSvc, fSDataFromDBSvc, adbRiderForASDataFromUserSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, commonDbProductCalculation, commonPremiumFormulaService, common_const) {
      'use strict';
      var fsCal = this;
      fsCal.calcBasePremium = calcBasePremium;
      fsCal.calcSumAssured = calcSumAssured;
      fsCal.calcPremium = calcPremium;
      fsCal.calcNsapPremium = calcNsapPremium;
      fsCal.calcModalNsapPremium = calcModalNsapPremium;
      //  fsCal.calculateModalPremium = calculateModalPremium;
      fsCal.calcTotalModalPremium = calcTotalModalPremium;
      fsCal.calcServiceTaxFirstYear = calcServiceTaxFirstYear;
      fsCal.calcServiceTaxSecondYearOnwards = calcServiceTaxSecondYearOnwards;
      fsCal.calcTotalPremiumFirstYear = calcTotalPremiumFirstYear;
      fsCal.calcTotalPremiumSecondYearOnwards = calcTotalPremiumSecondYearOnwards;
      fsCal.endOfPolicyYear = endOfPolicyYear;
      fsCal.annualPremium = annualPremium;
      fsCal.guaranteedDeathBenefit = guaranteedDeathBenefit;
      fsCal.guaranteedMaturityBenefit = guaranteedMaturityBenefit;
      fsCal.nonGuaranteedDeathBenefitFourPer = nonGuaranteedDeathBenefitFourPer;
      fsCal.guaranteedSurrenderValue = guaranteedSurrenderValue;
      fsCal.nonGuaranteedMaturityBenefitFourPer = nonGuaranteedMaturityBenefitFourPer;
      fsCal.nonGuaranteedMaturityBenefitFourPer = nonGuaranteedMaturityBenefitFourPer;
      fsCal.nonGuaranteedSurrenderValueFourPer = nonGuaranteedSurrenderValueFourPer;
      fsCal.nonGuaranteedDeathBenefitEightPer = nonGuaranteedDeathBenefitEightPer;
      fsCal.nonGuaranteedMaturityBenefitEightPer = nonGuaranteedMaturityBenefitEightPer;
      fsCal.nonGuaranteedSurrenderValueEightPer = nonGuaranteedSurrenderValueEightPer;
      fsCal.generateFlexiSaveBi = generateFlexiSaveBi;
      fsCal.calcPremiumRate = calcPremiumRate;


      function calcPremiumRate(prodId, channelId, data) {
        var q = $q.defer();
        /** mobile web provision **/
        var premiumRate;
        if (!isWeb) {
          premiumRate = fSDataFromDBSvc.getPremiumRate(prodId, channelId, data.laAge, data.laGender, data.ppt);
        } else {
          /**Provision for webapp code **/
          /**
              for web team needs to get promices after webservice call for

          **/

          /**return values in array in then function**/
        }
        premiumRate.then(function(val) {
          q.resolve(val);
        });
        return q.promise;
      }
      /**
        Calculating Base Premium
        Formula = (sumAssured*premiumRate)/1000;
        **/
      function calcBasePremium(data, premiumRate, actualVals) {
        var basePremium;
        if (typeof(actualVals)==='undefined') actualVals = false;//Using this for getting actual values for calculation.
        if (data.sumAssured > 0) {
          if(actualVals){
            basePremium = commonFormulaSvc.divide(commonFormulaSvc.multiply(data.sumAssured, premiumRate), 1000);
          } else {
            basePremium = commonFormulaSvc.round(commonFormulaSvc.divide(commonFormulaSvc.multiply(data.sumAssured, premiumRate), 1000), 0);
          }
          $log.debug('the basepremium is as follows', basePremium);
        } else {
          basePremium = data.basePremium;
        }
        $log.debug('the basepremium is as follows', basePremium);

        return basePremium;
      }

      /**
        Calculating Sum Assured
        Formula = (basePremium*1000)/premiumRate;
        **/
      function calcSumAssured(data, premiumRate, actualVals) {
        var sumAssured;
        if (typeof(actualVals)==='undefined') actualVals = false;//Using this for getting actual values for calculation.
        if (data.basePremium > 0) {
          if(actualVals){
            sumAssured = commonFormulaSvc.divide(commonFormulaSvc.multiply(data.basePremium, 1000), premiumRate);
          } else {
            sumAssured = commonFormulaSvc.roundUp(commonFormulaSvc.divide(commonFormulaSvc.multiply(data.basePremium, 1000), premiumRate), 0);
          }
        } else {
          sumAssured = data.sumAssured;
        }
        $log.debug('the sumAssured is as follows', sumAssured);

        return sumAssured;
      }

      /**
          Calculating NSAP Premium
          Formula = sumAssured * NSAP rate/1000;
      **/
      function calcNsapPremium(data, nsapPremRate, sumAssured) {
        var nsapPremiumValues = {};
        var nsapPremium = 0;
        if (data.NSAPForLA == true) {
          nsapPremium = commonFormulaSvc.multiply(sumAssured, 0.0025); //TODO:
          $log.debug('nsapPremium', nsapPremium);
        }
        return nsapPremium;
      }


      /**
         Calculating Modal NSAP  Premium
         Modal NSAP Premium= NSAP premium * Modal Factor
         **/
      function calcModalNsapPremium(modalFactor, nsapPremium) {
        /*get factor from DB for now using static value.*/
        var modalNsapPremium = modalFactor * nsapPremium;
        return modalNsapPremium;

      }

      /**
         Calculating Total Modal Premium
         Formula = Modal Premium + NSAP Extra premium Round the premium. Without decimal.
      **/
      function calcTotalModalPremium(data, modalPremium, modalNsapPremium) {
        var totalModalPremium;
        var totalModalPremiumVal = {};
        if (data.NSAPForLA == true) {
          totalModalPremium = modalPremium + modalNsapPremium;
          $log.debug('totalModalPremium', totalModalPremium);
        } else {
          totalModalPremium = modalPremium;
        }
        return totalModalPremium;

      }


      /*
          Calculating Service tax for 1st year
          Formula Service tax for 1st year = Premium Payable  ( including NSAP)* Service tax
      */
      function calcServiceTaxFirstYear(serviceTaxFactorForFirstYear, totalModalPremium) {
        return commonFormulaSvc.round(serviceTaxFactorForFirstYear * totalModalPremium, 0);
      }

      /*
            Calculating Service tax for 1st year
            Formula Service tax for 2nd year onwards = Premium Payable  ( including NSAP)* Service tax
           */
      function calcServiceTaxSecondYearOnwards(serviceTaxFactorFor2Year, totalModalPremium) {
        return commonFormulaSvc.round(serviceTaxFactorFor2Year * totalModalPremium, 0);
      }

      /*
          Calculating Total Premium payable in 1st year
          Formula Total Premium payable in 1st year = Premium payable+ service tax for 1st year
      */
      function calcTotalPremiumFirstYear(totalModalPremium, serviceTaxFirstYear) {
        return commonFormulaSvc.round(totalModalPremium + serviceTaxFirstYear, 0);
      }

      /*
          Calculating Total Premium payable in 2nd year
          Formula Total Premium payable in 2nd year = Premium payable+ service tax for 2nd year
      */
      function calcTotalPremiumSecondYearOnwards(totalModalPremium, serviceTaxSecondYear) {
        return commonFormulaSvc.round(totalModalPremium + serviceTaxSecondYear, 0);
      }

      function calcPremium(prodId, channelId, data) {
        var premiumVals = {};
        var q = $q.defer();
        /** mobile web provision **/
        var reqData;
        if (!isWeb) {
          reqData = $q.all([
            fSDataFromDBSvc.getPremiumRate(prodId, channelId, data.laAge, data.laGender, data.ppt),
            commonDbProductCalculation.getNsapRate(prodId, channelId),
            commonDbProductCalculation.getModalPremiumConvertingFactor(prodId, channelId, data.premiumMode),
            commonDbProductCalculation.serviceTaxFirstYear(prodId, channelId),
            commonDbProductCalculation.serviceTaxSecondYear(prodId, channelId),
            fSDataFromDBSvc.getProductCode(prodId, channelId, data.ppt)
          ]);
        } else {
          /**Provision for webapp code **/
          /**
              for web team needs to get promices after webservice call for
              NSAPFactor
              serviceTaxFactor
              premiumRate
              ModalFactor
          **/

          /**return values in array in then function**/
        }
        reqData.then(function(values) {
          $log.debug('valsss', values);
          var premium = {};

          var premiumRate = values[0];
          var nsapFactor = values[1];
          var modalFactor = values[2];
          var servicetax1 = values[3];
          var servicetax2 = values[4];
          var prodCode = values[5];

          premium.modalFactor = modalFactor;
          premium.prodCode = prodCode;
          premium.basePremium = fsCal.calcBasePremium(data, premiumRate, true);
          premium.sumAssured = fsCal.calcSumAssured(data, premiumRate, true);
          premium.nsapPremium = fsCal.calcNsapPremium(data, nsapFactor, premium.sumAssured);
          premium.modalPremium = commonPremiumFormulaService.calculateModalPremium(premium.basePremium, modalFactor);
          premium.modalNsapPremium = fsCal.calcModalNsapPremium(modalFactor, premium.nsapPremium);
          premium.totalAnnualPremium = fsCal.calcTotalModalPremium(data, premium.basePremium, premium.nsapPremium);
          premium.totalModalPremium = fsCal.calcTotalModalPremium(data, premium.modalPremium, premium.modalNsapPremium);

          premium.serviceTaxFactorForFirstYear = fsCal.calcServiceTaxFirstYear(servicetax1, premium.totalModalPremium);
          premium.serviceTaxFactorForSecondYear = fsCal.calcServiceTaxSecondYearOnwards(servicetax2, premium.totalModalPremium);

          premium.serviceForAnnualFirstYearTax = fsCal.calcServiceTaxFirstYear(servicetax1, premium.totalAnnualPremium);
          premium.serviceForAnnualSecondYearTax = fsCal.calcServiceTaxSecondYearOnwards(servicetax2, premium.totalAnnualPremium);


          premium.totalAnnualPremiumWithTaxForFirstYear = fsCal.calcTotalPremiumFirstYear(premium.totalAnnualPremium, premium.serviceForAnnualFirstYearTax);
          premium.totalAnnualPremiumWithTaxForSecondYear = fsCal.calcTotalPremiumSecondYearOnwards(premium.totalAnnualPremium, premium.serviceForAnnualSecondYearTax);

          premium.totalModalPremiumWithTaxForFirstYear = fsCal.calcTotalPremiumFirstYear(premium.totalModalPremium, premium.serviceTaxFactorForFirstYear);
          premium.totalModalPremiumWithTaxForSecondYear = fsCal.calcTotalPremiumSecondYearOnwards(premium.totalModalPremium, premium.serviceTaxFactorForSecondYear);


          q.resolve(premium);

        });

        return q.promise;
      }

      function endOfPolicyYear(policyTerm) {
        var policyYear = [];
        for (var i = 1; i <= policyTerm; i++) {
          policyYear.push(i);
        }
        return policyYear;
      }

      function annualPremium(ppt, policyTerm, basePremium) {
        var annualPremium = [];
        for (var i = 1; i <= ppt; i++) {
          if (i <= policyTerm) {
            annualPremium.push(commonFormulaSvc.round(basePremium,0));
          } else {
            annualPremium.push(0);
          }
        }
        return annualPremium;
      }

      function guaranteedDeathBenefit(policyTerm, basePremium, premiumMode, sumAssured, laAge, ppt) {
        /*
        1st Rule - 105% * Sum of Premiums paid till date/premium mode (Mode = 12 in this example)
        */
        var ruleFirst = function(year) {
          if(year <= ppt){
            return commonFormulaSvc.divide(commonFormulaSvc.multiplyArray([common_const.factorForDeathBenfitFirstRule, year, basePremium]), premiumMode);
          } else {
            return 0;
          }
        };
        var ruleSecond = function(sumAssured) {
          return sumAssured;
        };
        /* Premium*11*/
        var ruleThird = function(basePremium) {
          if (laAge > 44 && ppt == 5) {
            return basePremium * 7;
          } else {
            return basePremium * 11;
          }

        };
        /* Maximum of rule 1,2,3*/
        var totalGuaranteedDeathBenefit = function() {
          var guaranteedBenefit = [];
          for (var i = 1; i <= policyTerm; i++) {
            guaranteedBenefit.push(commonFormulaSvc.roundUp(Math.max(ruleFirst(i), ruleSecond(sumAssured), ruleThird(basePremium)),0));
          }

          return guaranteedBenefit;

        };
        return totalGuaranteedDeathBenefit();

      }

      /*
      Shown in BI for only in the last policy yea
      Maturity Benefit = Sum Assured
      */

      function guaranteedMaturityBenefit(policyTerm, sumAssured) {
        var totalGuaranteedMaturityBenefit = function() {
          var guaranteedMaturityBenefit = [];
          for (var i = 1; i <= policyTerm; i++) {
            if (i == policyTerm) {
              guaranteedMaturityBenefit.push(commonFormulaSvc.roundUp(sumAssured,0));
            } else {
              guaranteedMaturityBenefit.push(0);
            }
          }

          return guaranteedMaturityBenefit;

        };
        return totalGuaranteedMaturityBenefit();


      }

      /* Surrender Value = Sum of Premium Paid till date * Surrender Rate*/

      function guaranteedSurrenderValue(surrenderRate, policyTerm, basePremium, ppt, actualVals) {
        if (typeof(actualVals)==='undefined') actualVals = false;//Using this for getting actual values for calculation.
        var surrenderValue = [];
        var premiumPaid;
        for (var i = 0; i < policyTerm; i++) {
          if (i < ppt) {
            premiumPaid = basePremium * (i + 1);
          } else {
            premiumPaid = basePremium * ppt;
          }
          if(actualVals){
            surrenderValue.push(commonFormulaSvc.multiplyArray([premiumPaid, surrenderRate[i]]));
          } else {
            surrenderValue.push(commonFormulaSvc.round(commonFormulaSvc.multiplyArray([premiumPaid, surrenderRate[i]]), 0));
          }
        }
        return surrenderValue;
      }


      /*
      Calculate Non Guaranteed Benefit 4 percent
      Formula = (Guaranteed Death Benefit + Revisionary Bonus Rate @4% * SA * End of Policy Year + Terminal Death Bonus @ 4%)
      */
      function nonGuaranteedDeathBenefitFourPer(policyTerm, sumAssured, revBonusRate4Per, guaranteedDeathBenefit, terDeathBonusRate4Per, actualVals) {
        if (typeof(actualVals)==='undefined') actualVals = false;//Using this for getting actual values for calculation.
        var totalNonGuaranteedDeathBenefit4Per = [];
        var revisionaryBonusRateFourPer = revBonusRate4Per[policyTerm][0];
        for (var i = 1; i <= policyTerm; i++) {
          var result = (guaranteedDeathBenefit[i - 1] + revisionaryBonusRateFourPer * sumAssured * i + terDeathBonusRate4Per[i - 1]);
          if(actualVals){
            totalNonGuaranteedDeathBenefit4Per.push(result);
          }else{
            totalNonGuaranteedDeathBenefit4Per.push(commonFormulaSvc.round(result, 0));
          }
        }
        return totalNonGuaranteedDeathBenefit4Per;
      }

      /*
      Calculate Non Guaranteed Benefit 8 percent
      Formula = (Guaranteed Death Benefit + Revisionary Bonus Rate @4% * SA * End of Policy Year + Terminal Death Bonus @ 4%)
      */
      function nonGuaranteedDeathBenefitEightPer(policyTerm, sumAssured, revBonusRate8Per, guaranteedDeathBenefit, terDeathBonusRate8Per, actualVals) {
        var totalNonGuaranteedDeathBenefit8Per = [];
        if (typeof(actualVals)==='undefined') actualVals = false;//Using this for getting actual values for calculation.
        var revisionaryBonusRateEightPer = revBonusRate8Per[policyTerm][0];
        for (var i = 1; i <= policyTerm; i++) {
          var result = (guaranteedDeathBenefit[i - 1] + revisionaryBonusRateEightPer * sumAssured * i + terDeathBonusRate8Per[i - 1]);
          if(actualVals){
            totalNonGuaranteedDeathBenefit8Per.push(result);
          } else {
            totalNonGuaranteedDeathBenefit8Per.push(commonFormulaSvc.round(result, 0));
          }
        }
        return totalNonGuaranteedDeathBenefit8Per;
      }

      /*
      ( Policy Term is 20 in this example)
      Calculated for only last policy year
      Formula = Revisionary Bonus Rate @ 4%*SA*Policy Term + SA + Revisionary Bonus Rate @ 4% * SA * Policy Term * Terminal Bonus Rate @ 4% * 11
      */
      function nonGuaranteedMaturityBenefitFourPer(policyTerm, revBonusRate4Per, terBonusRate4Per, sumAssured, actualVals) {
        var nonGuaranteedMaturityBenefitFourPer = [];
        if (typeof(actualVals)==='undefined') actualVals = false;//Using this for getting actual values for calculation.

        var revisionaryBonusRateFourPer = revBonusRate4Per[policyTerm][0];
        var terminalBonusRateFourPer = terBonusRate4Per[policyTerm][0];

        for (var i = 1; i <= policyTerm; i++) {

          if (i == policyTerm) {
            var result = revisionaryBonusRateFourPer * sumAssured * policyTerm + sumAssured + revisionaryBonusRateFourPer * sumAssured * policyTerm * terminalBonusRateFourPer * 11;
            if(actualVals){
              nonGuaranteedMaturityBenefitFourPer.push(result);
            } else {
              nonGuaranteedMaturityBenefitFourPer.push(commonFormulaSvc.round(result, 0));
            }
          } else {
            nonGuaranteedMaturityBenefitFourPer.push(0);
          }
        }

        return nonGuaranteedMaturityBenefitFourPer;

      }

      /*
      ( Policy Term is 20 in this example)
      Calculated for only last policy year
      Formula = Revisionary Bonus Rate @ 4%*SA*Policy Term + SA + Revisionary Bonus Rate @ 4% * SA * Policy Term * Terminal Bonus Rate @ 4% * 11
      */
      function nonGuaranteedMaturityBenefitEightPer(policyTerm, revBonusRate8Per, terBonusRate8Per, sumAssured, actualVals) {
        var nonGuaranteedMaturityBenefitEightPer = [];
        if (typeof(actualVals)==='undefined') actualVals = false;//Using this for getting actual values for calculation.
        var revisionaryBonusRateEightPer = revBonusRate8Per[policyTerm][0];
        var terminalBonusRateEightPer = terBonusRate8Per[policyTerm][0];

        for (var i = 1; i <= policyTerm; i++) {

          if (i == policyTerm) {
            var result = revisionaryBonusRateEightPer * sumAssured * policyTerm + sumAssured + revisionaryBonusRateEightPer * sumAssured * policyTerm * terminalBonusRateEightPer * 11;
            if(actualVals){
              nonGuaranteedMaturityBenefitEightPer.push(result);
            } else {
              nonGuaranteedMaturityBenefitEightPer.push(commonFormulaSvc.round(result, 0));
            }
          } else {
            nonGuaranteedMaturityBenefitEightPer.push(0);
          }
        }

        return nonGuaranteedMaturityBenefitEightPer;

      }

      /*
      Formula = Surrender Rate * SA/1000 + Bonus Surrender Rate * Revisionary Bonus Rate @ 4% * End of Policy Year * SA/1000 +  Terminal Bonus on Surrender Value @ 4%
      */

      function nonGuaranteedSurrenderValueFourPer(policyTerm, revBonusRate4Per, terDeathBonusRate4Per, surrenderRate, bonusSurrenderRate, sumAssured, actualVals) {
        var nonGuaranteedSurrenderValue = [];
        if (typeof(actualVals)==='undefined') actualVals = false;//Using this for getting actual values for calculation.
        var revisionaryBonusRateFourPer = revBonusRate4Per[policyTerm][0];
        var sumAssuredCal = commonFormulaSvc.divide(sumAssured, 1000);
        for (var i = 1; i <= policyTerm; i++) {
          var surrenderValue = (surrenderRate[i - 1] * sumAssuredCal) + (bonusSurrenderRate[i - 1] * revisionaryBonusRateFourPer * i * sumAssuredCal) + terDeathBonusRate4Per[i - 1];
          if(actualVals){
            nonGuaranteedSurrenderValue.push(surrenderValue);
          } else {
            nonGuaranteedSurrenderValue.push(commonFormulaSvc.round(surrenderValue, 0));
          }
        }

        return nonGuaranteedSurrenderValue;

      }

      /*
      Formula = Surrender Rate * SA/1000 + Bonus Surrender Rate * Revisionary Bonus Rate @ 4% * End of Policy Year * SA/1000 +  Terminal Bonus on Surrender Value @ 4%
      */

      function nonGuaranteedSurrenderValueEightPer(policyTerm, revBonusRate8Per, terDeathBonusRate8Per, surrenderRate, bonusSurrenderRate, sumAssured, actualVals) {
        var nonGuaranteedSurrenderValue = [];
        if (typeof(actualVals)==='undefined') actualVals = false;//Using this for getting actual values for calculation.
        var revisionaryBonusRateEightPer = revBonusRate8Per[policyTerm][0];
        var sumAssuredCal = commonFormulaSvc.divide(sumAssured, 1000);
        for (var i = 1; i <= policyTerm; i++) {
          var surrenderValue = (surrenderRate[i - 1] * sumAssuredCal) + (bonusSurrenderRate[i - 1] * revisionaryBonusRateEightPer * i * sumAssuredCal) + terDeathBonusRate8Per[i - 1];
          if(actualVals){
            nonGuaranteedSurrenderValue.push(surrenderValue);
          } else {
            nonGuaranteedSurrenderValue.push(commonFormulaSvc.round(surrenderValue, 0));
          }
        }

        return nonGuaranteedSurrenderValue;

      }

      function generateFlexiSaveBi(prodId, channelId, data, basePremium, sumAssured) {
        $log.debug('prodid is _____=====', prodId);
        var flexiSave = {};
        var q = $q.defer();
        /** mobile web provision **/
        var reqData;
        if (!isWeb) {
          reqData = $q.all([
            fSDataFromDBSvc.getPremiumPaymentTerm(prodId, channelId, data.pt),
            fSDataFromDBSvc.getSurrenderValue(prodId, channelId, data.pt),
            fSDataFromDBSvc.getTerminalDeathBonus4Per(prodId, channelId, data.pt, sumAssured),
            fSDataFromDBSvc.getRevisionaryBonusRateFourPer(prodId, channelId),
            fSDataFromDBSvc.getTerminalBonusRateFourPer(prodId, channelId),
            fSDataFromDBSvc.getSurrenderRate(prodId, channelId, data.laAge, data.pt),
            fSDataFromDBSvc.getBonusSurrenderRate(prodId, channelId, data.laAge, data.pt),
            fSDataFromDBSvc.getTerminalDeathBonus8Per(prodId, channelId, data.pt, sumAssured),
            fSDataFromDBSvc.getRevisionaryBonusRateEightPer(prodId, channelId),
            fSDataFromDBSvc.getTerminalBonusRateEightPer(prodId, channelId),
          ]);
        } else {
          /**Provision for webapp code **/
          /**
              for web team needs to get promices after webservice call for
              NSAPFactor
              serviceTaxFactor
              premiumRate
              ModalFactor
          **/

          /**return values in array in then function**/
        }
        reqData.then(function(fsVals) {
          $log.debug('fsVals', fsVals[1]);
          flexiSave.policyYear = fsCal.endOfPolicyYear(data.pt);
          flexiSave.premiumPaid = fsCal.annualPremium(data.pt, fsVals[0], basePremium);

          flexiSave.guaranteedDeathBenefit = fsCal.guaranteedDeathBenefit(data.pt, basePremium, data.premiumMode, sumAssured, data.laAge, fsVals[0]); //policyTerm,basePremium,premiumMode,sumAssured
          flexiSave.guaranteedMaturityBenefit = fsCal.guaranteedMaturityBenefit(data.pt, sumAssured);
          flexiSave.guaranteedSurrenderValue = fsCal.guaranteedSurrenderValue(fsVals[1], data.pt, basePremium, fsVals[0]);

          flexiSave.nonguaranteedDeathBenefit4Per = fsCal.nonGuaranteedDeathBenefitFourPer(data.pt, sumAssured, fsVals[3], flexiSave.guaranteedDeathBenefit, fsVals[2]); //policyTerm, sumAssured, revBonusRate4Per, guaranteedDeathBenefit, terBonusRate4Per
          flexiSave.nonguaranteedMaturityBenefit4Per = fsCal.nonGuaranteedMaturityBenefitFourPer(data.pt, fsVals[3], fsVals[4], sumAssured); //policyTerm,revBonusRate4Per,terBonusRate4Per,sumAssured
          flexiSave.nonguaranteedSurrenderValue4Per = fsCal.nonGuaranteedSurrenderValueFourPer(data.pt, fsVals[3], fsVals[2], fsVals[5], fsVals[6], sumAssured); //policyTerm,revBonusRate4Per,terBonusRate4Per,surrenderRate,sumAssured

          flexiSave.nonguaranteedDeathBenefit8Per = fsCal.nonGuaranteedDeathBenefitEightPer(data.pt, sumAssured, fsVals[8], flexiSave.guaranteedDeathBenefit, fsVals[7]); //policyTerm, sumAssured, revBonusRate4Per, guaranteedDeathBenefit, terBonusRate4Per
          flexiSave.nonguaranteedMaturityBenefit8Per = fsCal.nonGuaranteedMaturityBenefitEightPer(data.pt, fsVals[8], fsVals[9], sumAssured); //policyTerm,revBonusRate4Per,terBonusRate4Per,sumAssured
          flexiSave.nonguaranteedSurrenderValue8Per = fsCal.nonGuaranteedSurrenderValueEightPer(data.pt, fsVals[8], fsVals[7], fsVals[5], fsVals[6], sumAssured); //policyTerm,revBonusRate4Per,terBonusRate4Per,surrenderRate,sumAssured
          q.resolve(flexiSave);

        });
        return q.promise;
      }
    }
  ]
);
