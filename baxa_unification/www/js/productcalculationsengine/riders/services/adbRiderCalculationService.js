unificationBAXA.service('commonFormulasForRidersSvc', [
    'commonFormulaSvc',
function (commonFormulaSvc) {
	'use strict';
	var common = this;
	common.getBenifitUptoAge = getBenifitUptoAge;
	common.getmodalPremiumWithServiceTax = getmodalPremiumWithServiceTax;
	common.getPercentOfBasePremium = getPercentOfBasePremium;
	common.getAnnualRider = getAnnualRider;
	common.getModalRiderPremium = getModalRiderPremium;

	function getBenifitUptoAge(currentAge, riderPpt) {
		return commonFormulaSvc.add(parseInt(currentAge),parseInt(riderPpt));
	}

	function getPercentOfBasePremium(percent, basePremium) {
		return commonFormulaSvc.percentOf(percent, basePremium);
	}

	function getAnnualRider(RiderPremium, percentOfBasePremium) {
		if (RiderPremium > percentOfBasePremium) {
		 return 0 ;
		} else {
		 return RiderPremium ;
		}
	}

	function getModalRiderPremium(riderPremium, modalFactor) {
		return commonFormulaSvc.round(commonFormulaSvc.multiply(riderPremium, modalFactor),0);
	}

	function getmodalPremiumWithServiceTax(serviceTax, premium) {
		return commonFormulaSvc.round(commonFormulaSvc.multiply(serviceTax, premium),0);
	}
}]);

/**
Calculate ADB rider premium
*/
unificationBAXA.service ('calculateAdbRiderPremiumSvc',
		[
		'$q',
		'$log',
		'commonFormulaSvc',
		'commonFormulasForRidersSvc',
		'adbRiderPremiumDataFromDBSvc',
		'adbRiderForASDataFromUserSvc',
		'commonDbProductCalculation',
		function( $q, $log, commonFormulaSvc, commonFormulasForRidersSvc, adbRiderPremiumDataFromDBSvc, adbRiderForASDataFromUserSvc, commonDbProductCalculation) {
		'use strict';
		var calculateAdbRiderPremiumSvcObj = this;

		calculateAdbRiderPremiumSvcObj.calculateABDRiderPremium = calculateABDRiderPremium;
		function calculateABDRiderPremium(prodId, baseProdId, channelId, data){
		          var q = $q.defer();
                  adbRiderForASDataFromUserSvc.setADBRiderData(data);
				/*
					Get user input data
				*/
				var userData = adbRiderForASDataFromUserSvc.getADBRiderData();
				$log.debug('userData<>',userData);
				var adbPremium = {};
                /** mobile web provision **/
                var reqData;
                if(!isWeb){
                    reqData = $q.all([
    						adbRiderPremiumDataFromDBSvc.riderRateForCalculation(prodId, channelId),
    						commonDbProductCalculation.serviceTaxFirstYear(prodId, channelId),
    						commonDbProductCalculation.getModalPremiumConvertingFactor(baseProdId, channelId, userData.premiumMode),
                            adbRiderPremiumDataFromDBSvc.getProdCodeADB(prodId, channelId)
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
				reqData.then (function(values) {
						var  riderRateForCalculation = values[0];
						var serviceTaxFactorForFirstAndSecondYear = values[1];
						var premiumToModalFactor = values[2];
                        var prodCode =  values[3];
                        adbPremium.prodCode = prodCode;
                        adbPremium.modalFactor = premiumToModalFactor;
						adbPremium.benfitUptoAge = commonFormulasForRidersSvc.getBenifitUptoAge(userData.laAge,userData.riderterm);
						adbPremium.abdRiderPremium = commonFormulaSvc.round(commonFormulaSvc.multiply(userData.sumAssuredForADBRiders,riderRateForCalculation),0);
						adbPremium.percentOfBasePremium = commonFormulasForRidersSvc.getPercentOfBasePremium(30,data.basePremium);/*for now its 30% do this value come from DB?*/

                        adbPremium.annualAdbRiderPremium = commonFormulaSvc.round(commonFormulasForRidersSvc.getAnnualRider(adbPremium.abdRiderPremium,adbPremium.percentOfBasePremium),0);
						adbPremium.modalAdbRiderPremium = commonFormulaSvc.round(commonFormulasForRidersSvc.getModalRiderPremium(adbPremium.annualAdbRiderPremium,premiumToModalFactor),0);

                        adbPremium.modalAdbRiderPremiumWithServiceTax = commonFormulasForRidersSvc.getmodalPremiumWithServiceTax(serviceTaxFactorForFirstAndSecondYear,adbPremium.modalAdbRiderPremium);

                        adbPremium.serviceTaxForModalFirstYear = commonFormulasForRidersSvc.getmodalPremiumWithServiceTax(serviceTaxFactorForFirstAndSecondYear,adbPremium.modalAdbRiderPremium);
                        adbPremium.serviceTaxForAnnualFirstYear = commonFormulasForRidersSvc.getmodalPremiumWithServiceTax(serviceTaxFactorForFirstAndSecondYear,adbPremium.annualAdbRiderPremium);

                        adbPremium.totalAnnualPremiumWithTaxForFirstYear = commonFormulaSvc.add(adbPremium.abdRiderPremium,adbPremium.serviceTaxForAnnualFirstYear);
                        adbPremium.totalModalPremiumWithTaxForFirstYear = commonFormulaSvc.add(adbPremium.modalAdbRiderPremium,adbPremium.serviceTaxForModalFirstYear);

                        adbPremium.totalAdbPremium = commonFormulaSvc.add(adbPremium.modalAdbRiderPremium,adbPremium.modalAdbRiderPremiumWithServiceTax);
						/* $log.debug('RIDERRATE',adbPremium);*/
						q.resolve(adbPremium);

				});
						return q.promise;
			}
}]);
