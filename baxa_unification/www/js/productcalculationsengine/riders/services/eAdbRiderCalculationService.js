/**
Calculate ADB rider premium
*/
unificationBAXA.service ('calculateEAdbRiderPremiumSvc',
		[
		'$q',
		'$log',
		'commonFormulaSvc',
		'commonFormulasForRidersSvc',
		'eAdbRiderPremiumDataFromDBSvc',
		'eAdbRiderDataFromUserSvc',
		'commonDbProductCalculation',
		function( $q, $log, commonFormulaSvc, commonFormulasForRidersSvc, eAdbRiderPremiumDataFromDBSvc, eAdbRiderDataFromUserSvc, commonDbProductCalculation) {
		'use strict';
		var calculateEAdbRiderPremiumSvcObj = this;

		calculateEAdbRiderPremiumSvcObj.calculateEABDRiderPremium = calculateEABDRiderPremium;
		function calculateEABDRiderPremium(prodId, baseProdId, channelId, data){
		          var q = $q.defer();
                  $log.debug("eADB<>",data);
                  eAdbRiderDataFromUserSvc.setEADBRiderData(data);
				/*
					Get user input data
				*/
				var userData = eAdbRiderDataFromUserSvc.getADBRiderData();
				$log.debug('userData<>',userData);
				var eAdbPremium = {};
                /** mobile web provision **/
                var reqData;
                if(!isWeb){
                    reqData = $q.all([
    						eAdbRiderPremiumDataFromDBSvc.riderRateForCalculation(prodId, channelId),
    						commonDbProductCalculation.serviceTaxFirstYear(prodId, channelId),
    						commonDbProductCalculation.getModalPremiumConvertingFactor(baseProdId, channelId, userData.premiumMode),
                            eAdbRiderPremiumDataFromDBSvc.getProdCodeEADB(prodId, channelId)
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
                        eAdbPremium.prodCode = prodCode;
                        eAdbPremium.modalFactor = premiumToModalFactor;
						eAdbPremium.benfitUptoAge = commonFormulasForRidersSvc.getBenifitUptoAge(userData.laAge,userData.riderterm);
						eAdbPremium.eAbdRiderPremium = commonFormulaSvc.round(commonFormulaSvc.multiply(userData.sumAssuredForEADBRiders,riderRateForCalculation),0);
						eAdbPremium.percentOfBasePremium = commonFormulasForRidersSvc.getPercentOfBasePremium(30,data.basePremium);/*for now its 30% do this value come from DB?*/

                        eAdbPremium.annualAdbRiderPremium = commonFormulaSvc.round(commonFormulasForRidersSvc.getAnnualRider(eAdbPremium.eAbdRiderPremium,eAdbPremium.percentOfBasePremium),0);
						eAdbPremium.modalAdbRiderPremium = commonFormulaSvc.round(commonFormulasForRidersSvc.getModalRiderPremium(eAdbPremium.annualAdbRiderPremium,premiumToModalFactor),0);

                        eAdbPremium.modalAdbRiderPremiumWithServiceTax = commonFormulasForRidersSvc.getmodalPremiumWithServiceTax(serviceTaxFactorForFirstAndSecondYear,eAdbPremium.modalAdbRiderPremium);

                        eAdbPremium.serviceTaxForModalFirstYear = commonFormulasForRidersSvc.getmodalPremiumWithServiceTax(serviceTaxFactorForFirstAndSecondYear,eAdbPremium.modalAdbRiderPremium);
                        eAdbPremium.serviceTaxForAnnualFirstYear = commonFormulasForRidersSvc.getmodalPremiumWithServiceTax(serviceTaxFactorForFirstAndSecondYear,eAdbPremium.annualAdbRiderPremium);

                        eAdbPremium.totalAnnualPremiumWithTaxForFirstYear = commonFormulaSvc.add(eAdbPremium.eAbdRiderPremium,eAdbPremium.serviceTaxForAnnualFirstYear);
                        eAdbPremium.totalModalPremiumWithTaxForFirstYear = commonFormulaSvc.add(eAdbPremium.modalAdbRiderPremium,eAdbPremium.serviceTaxForModalFirstYear);

                        eAdbPremium.totaleAdbPremium = commonFormulaSvc.add(eAdbPremium.modalAdbRiderPremium,eAdbPremium.modalAdbRiderPremiumWithServiceTax);
						/* $log.debug('RIDERRATE',eAdbPremium);*/
						q.resolve(eAdbPremium);

				});
						return q.promise;
			}
}]);
