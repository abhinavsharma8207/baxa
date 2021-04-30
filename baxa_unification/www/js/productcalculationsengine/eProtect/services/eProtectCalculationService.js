/*
* Created By: Anushree
* Service for Premium Calculation Service here injecting all services
*/
productCalculator.service(
	'ePCalculationService',
	[
		'$q',
    	'$log',
		'commonFormulaSvc',
    	'commonDBFuncSvc',
    	'ePDataFromDBSvc',
    	'hospiCashRiderDataFromUserSvc',
    	'calculatehospiCashRiderPremiumSvc',
		'commonDbProductCalculation',
		'commonPremiumFormulaService',
		 function($q, $log, commonFormulaSvc, commonDBFuncSvc, ePDataFromDBSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, commonDbProductCalculation, commonPremiumFormulaService) {
		 	'use strict';
			var eP = this;


			eP.getInputValues = getInputValues;
			eP.calculateEPTotalPremium = calculateEPTotalPremium;
			eP.chkValidSA = chkValidSA;

				function getInputValues (prodId, channelId){
					var q = $q.defer();
					var params  = ["GENDER","SMOKINGHABIT","PMODE","PT","UPTOAGE"];
					var reqData;
				  	if(!isWeb){
					  reqData = commonDbProductCalculation.getAllStaticValuesByArray(prodId, channelId, params);
				  	}else{
					  /*All static Input Values*/
				  	}
					reqData.then(function(value){
						$log.debug("reqData",value);
						q.resolve(value);
					});
					return q.promise;
				}

				function chkValidSA(prodId,channelId,sA){
					var q = $q.defer();
					ePDataFromDBSvc.isValidSA(prodId,channelId,sA)
					.then(function(val){
						//if(val === true){
							q.resolve(val);
						// }else{
						// 	$log.debug("{}",val[0].Value);
						// 	q.resolve(false);
						// }



					});
					return q.promise;
				}







			    function calculateEPTotalPremium(prodId, channelId, data){
					    	$log.debug('data:::',data);
					    	var q = $q.defer();
						//	ePDataFromDBSvc.getPremiumRateEP(prodId, channelId, data);
					var totalBasePremium = {};
					/** mobile web provision **/
					var reqData;
					if(!isWeb){
				    reqData = $q.all([

								commonDbProductCalculation.getModalPremiumConvertingFactor(prodId, channelId, data.premiumMode),
								commonDbProductCalculation.serviceTaxFirstYear(prodId, channelId),
								commonDbProductCalculation.serviceTaxSecondYear(prodId, channelId),
								ePDataFromDBSvc.getPremiumRateEP(prodId, channelId, data),
								ePDataFromDBSvc.getProdCodeEP(prodId, channelId, data)

								]);
						}else{
					  	/**Provision for webapp code **/


					  	/**return values in array in then function**/
						}
					    	reqData.then(function(basePremiumValues) {

								var modalFact = basePremiumValues[0];
								var stax1 = basePremiumValues[1];
								var stax2 = basePremiumValues[2];
								var premiumRate =  basePremiumValues[3];


								totalBasePremium.prodcode = basePremiumValues[4];
								totalBasePremium.modalFactor = modalFact;
								/*totalBasePremium.prodcode */

							 	totalBasePremium.basePremium = commonPremiumFormulaService.calculatePremium(premiumRate, data.sumAssured);
							 	totalBasePremium.modalPremium = commonPremiumFormulaService.calculateModalPremium(totalBasePremium.basePremium, modalFact);

								totalBasePremium.serviceTaxForAnnualFirstYear = commonPremiumFormulaService.calculateServiceTax(stax1,totalBasePremium.basePremium);
								totalBasePremium.serviceTaxForModalFirstYear = commonPremiumFormulaService.calculateServiceTax(stax1,totalBasePremium.modalPremium);

								totalBasePremium.serviceTaxForAnnualSecondYear = commonPremiumFormulaService.calculateServiceTax(stax2,totalBasePremium.basePremium);
								totalBasePremium.serviceTaxForModalSecondYear = commonPremiumFormulaService.calculateServiceTax(stax2,totalBasePremium.modalPremium);


								totalBasePremium.totalAnnualPremium = totalBasePremium.basePremium;
								totalBasePremium.totalModalPremium = totalBasePremium.modalPremium;
								totalBasePremium.totalAnnualPremiumWithTaxForFirstYear = commonFormulaSvc.add(totalBasePremium.totalAnnualPremium,totalBasePremium.serviceForAnnualFirstYearTax);
								totalBasePremium.totalModalPremiumWithTaxForFirstYear = commonFormulaSvc.add(totalBasePremium.totalModalPremium,totalBasePremium.serviceTaxForModalFirstYear);
								totalBasePremium.totalAnnualPremiumWithTaxForSecondYear = commonFormulaSvc.add(totalBasePremium.totalAnnualPremium,totalBasePremium.serviceTaxForModalSecondYear);
								totalBasePremium.totalModalPremiumWithTaxForSecondYear = commonFormulaSvc.add(totalBasePremium.totalModalPremium,totalBasePremium.serviceTaxForModalSecondYear);


								$log.debug('totalBasePremium',totalBasePremium);
							 	q.resolve(totalBasePremium);
							});
							return q.promise;

			      }


		 }
	]
);
