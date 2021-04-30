/**
Calculate ADB rider premium
*/
unificationBAXA.service('calculatePwrRiderPremiumSvc', [
  '$q',
  '$log',
  'commonFormulaSvc',
  'commonFormulasForRidersSvc',
  'pwrRiderDataFromUserSvc',
  'pwrDataFromDBSvc',
  'commonDbProductCalculation',
  'riderValidationService',
  function($q,
		$log,
		commonFormulaSvc,
		commonFormulasForRidersSvc,
		pwrRiderDataFromUserSvc,
		pwrDataFromDBSvc,
		commonDbProductCalculation,
		riderValidationService) {
    'use strict';
    var calculatePwrRiderPremiumSvcObj = this;
    /*
    	Rule Says: If Gender is female deduct age by 3
    	Function checks is gender is female if yes then will deduct
    	3yrs from age to be calculated & returns updated age.
    	@param1 : gender
    	@param2 : age
    	@param3 : age to be deducted
    	@returns : updated age for female.
    */
    calculatePwrRiderPremiumSvcObj.calculateFemaleAgeForCalculations = calculateFemaleAgeForCalculations;
    calculatePwrRiderPremiumSvcObj.calculatePwrRiderPremium = calculatePwrRiderPremium;

    function calculateFemaleAgeForCalculations(age, ageToDeduct) {
      $log.debug("here:::", age);
      if (age == 18 || age == 19 || age == 20 || age == 21) {
        age = 18;
        return age;
      } else {
        return age - ageToDeduct;
      }
    }

    function calculatePwrRiderPremium(prodId, channelId, data, option,basePremium) {
      var q = $q.defer();
      var userData = pwrRiderDataFromUserSvc.getPWRRiderData();
      $log.debug("basePremiumPWR",basePremium);
      $log.debug("userData", userData);
      var selectedRiderProductId = 0;
      var age = 0;
      var gender = 0;
      if (parseInt(option) === 1) { /* 1 for user input rider*/
        selectedRiderProductId = 6;
        age = userData.PrposerAge;
        gender = userData.PrposerGender;
      } else if (parseInt(option) === 2) {
        selectedRiderProductId = 7;
        if (userData.isSelf) {
          age = userData.laAge;
          gender = userData.laGender;
        } else {
          age = userData.PrposerAge;
          gender = userData.PrposerGender;
        }
      }
      var pwrPremium = {
        extraPremiumDueToNSAPForPrposer: 0,
        extraPremiumDueToNSAPLA: 0,
        extraPremiumDueToNSAP: 0,
        extraModalPremiumDueToNSAP: 0
      };
      pwrPremium.benfitUptoAge = commonFormulasForRidersSvc.getBenifitUptoAge(age, userData.riderterm);
      pwrPremium.ageToCalculate = age;
      if (gender == 1) {
        pwrPremium.ageToCalculate = calculateFemaleAgeForCalculations(age, 3);
      }
      $log.debug('selectedRiderProductId ::: ', selectedRiderProductId);

      /** mobile web provision **/
      var reqData;
      if (!isWeb) {
        reqData = $q.all([
          commonDbProductCalculation.serviceTaxFirstYear(selectedRiderProductId, channelId),
          pwrDataFromDBSvc.getNSAPFactorForLA(selectedRiderProductId, channelId),
          pwrDataFromDBSvc.riderFactorCalculation(pwrPremium.ageToCalculate, userData.riderterm, selectedRiderProductId, channelId),
          commonDbProductCalculation.getModalPremiumConvertingFactor(prodId, channelId, userData.premiumMode),
          pwrDataFromDBSvc.getNSAPFactorForPrposer(selectedRiderProductId, channelId, userData.riderterm),
          riderValidationService.getPWRProdCode(channelId, data)
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
        var serviceTaxFactorForFirstAndSecondYear = values[0];
        var NSAPFactorForLA = parseFloat(values[1]) / 1000;
        var riderFactor = values[2];
        var modalPremiumConvertingFactor = values[3];
        var NSAPFactorForPrposer = parseFloat(values[4]) / 1000;
        var prodCode = values[5];
        var bp;
        if(basePremium === undefined){
            bp = data.basePremium;
        }else{
            bp = basePremium;
        }
        pwrPremium.prodCode = prodCode;
        pwrPremium.modalFactor = modalPremiumConvertingFactor;
        pwrPremium.riderMaturityAge = commonFormulasForRidersSvc.getBenifitUptoAge(age, userData.riderterm);
        pwrPremium.percentOfBasePremium = commonFormulasForRidersSvc.getPercentOfBasePremium(30,bp ); /* for now its 30% do this value come from DB?*/
        /*DB*/
        pwrPremium.factorForCal = riderFactor;
        pwrPremium.riderPremiumFromTable = commonFormulaSvc.multiply(pwrPremium.factorForCal, bp);
        pwrPremium.annualPwrPremium = commonFormulaSvc.round(commonFormulasForRidersSvc.getAnnualRider(pwrPremium.riderPremiumFromTable, pwrPremium.percentOfBasePremium), 0);
        /*DB*/
        pwrPremium.modalPwrPremium = commonFormulaSvc.round(commonFormulasForRidersSvc.getModalRiderPremium(pwrPremium.annualPwrPremium, modalPremiumConvertingFactor), 0);
        /*chk for NSAP for LA*/
        if (userData.NSAPForLA) {
          /*DB*/
          pwrPremium.extraPremiumDueToNSAPLA = commonFormulaSvc.round(commonFormulaSvc.multiply(userData.sumAssured, NSAPFactorForLA), 0);
        }
        /*chk for NSAP for Prposer*/
        if (userData.NSAPForPrposer) {
          /*DB*/
          pwrPremium.extraPremiumDueToNSAPForPrposer = commonFormulaSvc.round(commonFormulaSvc.multiply(userData.sumAssured, NSAPFactorForPrposer), 0);
        }
        pwrPremium.extraPremiumDueToNSAP = commonFormulaSvc.add(pwrPremium.extraPremiumDueToNSAPLA, pwrPremium.extraPremiumDueToNSAPForPrposer);
        if (pwrPremium.extraPremiumDueToNSAP) {
          /*DB*/
          pwrPremium.extraModalPremiumDueToNSAP = commonFormulasForRidersSvc.getModalRiderPremium(pwrPremium.extraPremiumDueToNSAP, modalPremiumConvertingFactor);
        }
        pwrPremium.totalModalRiderWithoutServiceTax = commonFormulaSvc.round(commonFormulaSvc.add(pwrPremium.modalPwrPremium, pwrPremium.extraModalPremiumDueToNSAP), 0);
        pwrPremium.modalPWRRiderPremium = commonFormulaSvc.round(commonFormulaSvc.add(pwrPremium.modalPwrPremium, pwrPremium.extraModalPremiumDueToNSAP), 0);
        pwrPremium.annualPWRRiderPremium = commonFormulaSvc.round(commonFormulaSvc.add(pwrPremium.annualPwrPremium, pwrPremium.extraPremiumDueToNSAP), 0);
        pwrPremium.serviceTaxForAnnualFirstYear = commonFormulasForRidersSvc.getmodalPremiumWithServiceTax(serviceTaxFactorForFirstAndSecondYear, pwrPremium.annualPWRRiderPremium);
        pwrPremium.serviceTaxForModalFirstYear = commonFormulasForRidersSvc.getmodalPremiumWithServiceTax(serviceTaxFactorForFirstAndSecondYear, pwrPremium.modalPWRRiderPremium);
        /*pwr*/
        pwrPremium.modalPwrRiderWithServiceTax = commonFormulasForRidersSvc.getmodalPremiumWithServiceTax(serviceTaxFactorForFirstAndSecondYear, pwrPremium.modalPWRRiderPremium);
        pwrPremium.totalAnnualPremiumWithTaxForFirstYear = commonFormulaSvc.add(pwrPremium.annualPWRRiderPremium, pwrPremium.serviceTaxForAnnualFirstYear);
        pwrPremium.totalModalPremiumWithTaxForFirstYear = commonFormulaSvc.add(pwrPremium.modalPWRRiderPremium, pwrPremium.serviceTaxForModalFirstYear);
        pwrPremium.totalModalRiderPremium = commonFormulaSvc.add(pwrPremium.modalPWRRiderPremium, pwrPremium.modalPwrRiderWithServiceTax);
        q.resolve(pwrPremium);
      });
      return q.promise;
    }
  }
]);
