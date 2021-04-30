/*
service for premium Calculation here injecting all services
*/
productCalculator.service('calculateTrippleHealthPremiumSvc', [
  'commonFormulaSvc',
  'trippleHealthDataFromUserSvc',
  'trippleHealthDataFromDBSvc',
  'commonDBFuncSvc',
  'tHValidationService',
  'commonDbProductCalculation',
  '$log',
  '$q',
  function(
    commonFormulaSvc,
    trippleHealthDataFromUserSvc,
    trippleHealthDataFromDBSvc,
    commonDBFuncSvc,
    tHValidationService,
    commonDbProductCalculation,
    $log,
    $q) {
    'use strict';
    var serviceObj = this;
    /*Definition*/
    serviceObj.calculateBasicPremium = calculateBasicPremium;
    serviceObj.calculateModalPremium = calculateModalPremium;
    serviceObj.calculatePremiumDueToNsap = calculatePremiumDueToNsap;
    serviceObj.calculateModalPremiumForNSAP = calculateModalPremiumForNSAP;
    serviceObj.calculateServiceTax = calculateServiceTax;
    serviceObj.calculateTotalPremium = calculateTotalPremium;

    /*EOF Definition
     Implementation
    */
    function calculateBasicPremium(ppt, laAge, laGender, sumAssured) {
      $log.debug("serviceObj.premiumRate::", serviceObj.premiumRate);
      serviceObj.policyBenefitPeriod = ppt;
      serviceObj.basePremium = commonFormulaSvc.round((serviceObj.premiumRate * sumAssured * 0.001), 0);
      return serviceObj.basePremium;
    }

    function calculateModalPremium(premium, premiumMode) {
      serviceObj.baseModalPremium = commonFormulaSvc.round(serviceObj.ModalFactor * premium, 0);
      return serviceObj.baseModalPremium;
    }
    /**
			NSAP Calculations
		   */
    function calculatePremiumDueToNsap(sumAssured, nsapFactor) {
      return commonFormulaSvc.roundUp(commonFormulaSvc.multiply(sumAssured, nsapFactor), 2);
    }
    /**
     */
    function calculateModalPremiumForNSAP(premiumMode, extraPremiumDueToNSAP) {
      return extraPremiumDueToNSAP * serviceObj.ModalFactor;
    }
    /*
     */
    function calculateServiceTax(factorForCal, totalModalPremium) {
      return commonFormulaSvc.round(factorForCal * totalModalPremium, 0);
    }
    /*Function to fetch value*/

    function calculateTotalPremium(prodId, channelId, userData) {
      $log.debug("===PPP", prodId + "======" + channelId);
      var q = $q.defer();
      var premium = {
        extraModalPremiumDueToNSAP: 0,
        extraPremiumDueToNSAP: 0,
      };

      /** mobile web provision **/
      var reqData;
      if(!isWeb){
        reqData = $q.all([
            commonDbProductCalculation.getNsapRate(prodId, channelId),
            commonDbProductCalculation.serviceTaxFactorForFirstAndSecondYear(prodId, channelId),
            trippleHealthDataFromDBSvc.getpremiumRate(prodId, channelId, userData.laAge, userData.laGender, userData.sumAssured),
            commonDbProductCalculation.getModalPremiumConvertingFactor(prodId, channelId, userData.premiumMode),
            tHValidationService.getProductCode(prodId, channelId,userData.ppt )
          ]);
      }else{
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
          serviceObj.NSAPFactor = parseFloat(values[0] / 1000);
          serviceObj.serviceTaxFactor = parseFloat(values[1]);
          serviceObj.premiumRate = parseFloat(values[2]);
          serviceObj.ModalFactor = parseFloat(values[3]);
          premium.prodCode = values[4];
          $log.debug("values>>", values);

          /*Calculate Base & Modal Premium*/
          premium.base = serviceObj.calculateBasicPremium(userData.ppt, userData.laAge, userData.laGender, userData.sumAssured);
          tHValidationService.minimumPremiumValidation(prodId, channelId, premium.base);
          premium.baseModal = serviceObj.calculateModalPremium(premium.base, trippleHealthDataFromUserSvc.premiumMode);

          /*Calculate Base & Modal Extra Premium due to NSAP*/
          if (userData.NSAPForLA) {
            premium.extraPremiumDueToNSAP = serviceObj.calculatePremiumDueToNsap(userData.sumAssured, serviceObj.NSAPFactor);
            premium.extraModalPremiumDueToNSAP = serviceObj.calculateModalPremiumForNSAP(userData.premiumMode, premium.extraPremiumDueToNSAP);
          }

          /*Total Premium Without Service Tax*/
          premium.totalModalPremium = premium.baseModal + premium.extraModalPremiumDueToNSAP;
          premium.totalAnnualPremium = premium.base + premium.extraPremiumDueToNSAP;

          premium.ModalFactor = serviceObj.ModalFactor;
          /*Service tax for First Year*/
          premium.serviceTax = serviceObj.calculateServiceTax(serviceObj.serviceTaxFactor, premium.totalModalPremium);
          premium.serviceTaxForAnnualPremFirstYear = serviceObj.calculateServiceTax(serviceObj.serviceTaxFactor, premium.totalAnnualPremium);

          premium.totalWithTax = commonFormulaSvc.round(commonFormulaSvc.add(premium.totalModalPremium, premium.serviceTax), 0);
          premium.totalAnnualPremiumWithTaxForFirstYear = commonFormulaSvc.round(commonFormulaSvc.add(premium.totalAnnualPremium, premium.serviceTaxForAnnualPremFirstYear), 0);

          $log.debug("=========", premium.base);

          q.resolve(premium);
        });
      return q.promise;
    }
  }
]);
