/*
* Created By: Atul A
* Service for Premium Calculation Service here injecting all services
*/
productCalculator.service(
	'eSCalculationService',
	[
		'$q',
    	'$log',
		'commonFormulaSvc',
    	'commonDBFuncSvc',
    	'eSDataFromDBSvc',
    	'adbRiderForASDataFromUserSvc',
    	'calculateAdbRiderPremiumSvc',
    	'hospiCashRiderDataFromUserSvc',
    	'calculatehospiCashRiderPremiumSvc',
		'commonDbProductCalculation',
		 function($q, $log, commonFormulaSvc, commonDBFuncSvc, eSDataFromDBSvc, adbRiderForASDataFromUserSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, commonDbProductCalculation) {
		 	'use strict';

		 	var es = this;

		 	es.calcBenefitUptoAge = calcBenefitUptoAge;
        	es.calcPolicyTerm = calcPolicyTerm;
        	es.getPremiumBand = getPremiumBand;
        	es.calcBasePremium = calcBasePremium;
        	es.calcTotalBasePremium = calcTotalBasePremium;
        	es.calcModalPremium = calcModalPremium;
        	es.calcServiceTax = calcServiceTax;
        	es.calcTotalPremium = calcTotalPremium;
        	es.generateEsBI = generateEsBI;


		 	/*Calulating Benefit Upto Age */
			function calcBenefitUptoAge (data) {
	            var benefitUptoAge;
	            if(data.uptoAge > 0){
	                benefitUptoAge = data.uptoAge;
	            }else{
	                benefitUptoAge = commonFormulaSvc.add(parseInt(data.laAge),parseInt(data.ppt));
	            }
	            return benefitUptoAge;
	        }

		 	/*Calulating Policy Term */

	        function calcPolicyTerm(data) {
	            var policyTerm;
	            if(data.uptoAge > 0){
	                policyTerm = commonFormulaSvc.subtract(data.uptoAge,data.laAge);
	            }else{
	                policyTerm = data.ppt;
	            }
	            return policyTerm;
	        }

		 	function  getPremiumBand(prodId, channelId, sumAssured) {
				var q = $q.defer();
				commonDbProductCalculation.getValueForGivenRange(prodId, channelId,'PRBAND', sumAssured).
				then(function(band){
					q.resolve(band.slice(-1));
				});
				return q.promise;


		 	}

		 	/*
				Base Premium = ( Base Premium Rate- Volume Discount)* Sum Assured/1000
		 	*/

		 	function calcBasePremium(prodId, channelId, premiumRate, sumAssured) {
				var q = $q.defer();
				getPremiumBand(prodId, channelId, sumAssured).then(function(band){
					var basePremium = {};
					var basePremiumRate = premiumRate[0];
					var volumeDiscount = premiumRate[band - 1];

					basePremium = commonFormulaSvc.round(((basePremiumRate - volumeDiscount) * sumAssured) / 1000 , 0);

					q.resolve(basePremium);

				});
		 		return q.promise;

		 	}

		 	/*
				Modal Premium = Base Premium*Factor for converting Modal premium
				Round the number, no decimal
		 	*/
		 	function calcModalPremium (basePremium,modalPremiumFactor) {
		 		return commonFormulaSvc.round(commonFormulaSvc.multiply(basePremium,modalPremiumFactor),0);
		 	}

		 	/*
				Service Tax = Round(modalPremium *14.5%,0)
		 	*/

		 	function calcServiceTax (modalPremium,serviceTax) {
		 		return commonFormulaSvc.roundUp(commonFormulaSvc.multiply(modalPremium,serviceTax),0);
		 	}

		 	/*
				Total Annual Premium = Modal Premium +Service Tax
		 	*/

		 	function calcTotalPremium (modalPremium,serviceTax) {
		 		return commonFormulaSvc.add(modalPremium,serviceTax);
		 	}

			function calcTotalBasePremium(prodId, channelId, data) {
 		 		var totalBasePremium = {};
 				var reqBP;
 				var q = $q.defer();
 				/** mobile web provision **/
 				var reqData;
 				if(!isWeb){
 				    reqData = $q.all([
 						eSDataFromDBSvc.getBasePremiumRate(prodId, channelId, data),
 						commonDbProductCalculation.getModalPremiumConvertingFactor(prodId, channelId, data.premiumMode),
 						commonDbProductCalculation.serviceTaxFactorForFirstAndSecondYear(prodId, channelId),
 						eSDataFromDBSvc.getProductCode(prodId, channelId, data.ppt)

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
 				reqData.then(function(basePremiumValues) {
 				 	$log.debug('basePremiumValues',basePremiumValues);
 					var premiumRate = basePremiumValues[0];
 					var modalFactor = basePremiumValues[1];
 					var servicetax = basePremiumValues[2];

 					totalBasePremium.modalFactor = modalFactor;
 					totalBasePremium.prodCode = basePremiumValues[3];
 					if(!isWeb){
 						reqBP = calcBasePremium(prodId, channelId, premiumRate, data.sumAssured);
 					}else{
 						/*web provision*/
 					}
 					reqBP.then(function(basePremium){
 						totalBasePremium.basePremium = basePremium;


 				 	totalBasePremium.totalAnnualPremium = totalBasePremium.basePremium;
 				 	totalBasePremium.modalPremium = es.calcModalPremium(totalBasePremium.basePremium,modalFactor);
 				 	totalBasePremium.serviceTax = es.calcServiceTax(totalBasePremium.modalPremium,servicetax);
 					totalBasePremium.serviceForAnnualFirstYearTax = es.calcServiceTax(totalBasePremium.totalAnnualPremium,servicetax);
 					totalBasePremium.totalAnnualPremiumWithTaxForFirstYear = es.calcTotalPremium(totalBasePremium.basePremium,totalBasePremium.serviceForAnnualFirstYearTax);
 					totalBasePremium.totalModalPremium = es.calcTotalPremium(totalBasePremium.modalPremium,totalBasePremium.serviceTax);
 				 	totalBasePremium.bi = es.generateEsBI(data,totalBasePremium);
 					$log.debug('totalBasePremium', totalBasePremium);
 				 	q.resolve(totalBasePremium);
 					});

 				});
 				return q.promise;
 		 	}

		 	function generateEsBI (data, totalBasePremium) {

		 		var esbi = {};
		 		esbi.benefitUptoAge = es.calcBenefitUptoAge(data);
		 		esbi.policyTerm = es.calcPolicyTerm(data);
		 		esbi.ppt = esbi.policyTerm;
		 		esbi.premiumMode = data.premiumMode;
		 		esbi.sumAssured = data.sumAssured;
		 		esbi.regularAnnualPremium = totalBasePremium.basePremium;
		 		esbi.premiumModeChosen = totalBasePremium.modalPremium;
		 		esbi.serviceTaxEduCess = totalBasePremium.serviceTax;
		 		esbi.totalPremiumPayable = totalBasePremium.totalModalPremium;
		 		return esbi;

		 	}


		 }
	]
);
