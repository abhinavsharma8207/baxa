/**
Calculate Hospicash premium
developer:Anushree
*/
unificationBAXA.service('calculatehospiCashRiderPremiumSvc',
		[
		'$q',
		'$log',
		'commonFormulaSvc',
		'commonFormulasForRidersSvc',
		'hospiCashRiderDataFromUserSvc',
		'hospiCashRiderDataFromDBSvc',
		'commonDbProductCalculation',
		function( $q, $log, commonFormulaSvc, commonFormulasForRidersSvc, hospiCashRiderDataFromUserSvc, hospiCashRiderDataFromDBSvc, commonDbProductCalculation) {
		'use strict';
		var calculatehospiCashRiderPremiumSvcObj = this;
		calculatehospiCashRiderPremiumSvcObj.calculateHospiCashRiderPremium = calculateHospiCashRiderPremium;
		function calculateHospiCashRiderPremium(hospicashId, prodId, channelId, basePremium){
				var q = $q.defer();
				var hospiCashPremium = {};
				var userData = hospiCashRiderDataFromUserSvc.getHospiCashData();
				$log.debug('::userData :: ', userData);
				/** mobile web provision **/
				var reqData;
				if(!isWeb){
				    reqData = $q.all([
							commonDbProductCalculation.serviceTaxFirstYear(hospicashId, channelId),
							commonDbProductCalculation.getModalPremiumConvertingFactor(hospicashId, channelId, userData.premiumMode),
							hospiCashRiderDataFromDBSvc.getAnnualRiderPremium(hospicashId, channelId, userData.laAge,userData.riderterm,userData.sumAssuredForRiders,userData.laGender),
							hospiCashRiderDataFromDBSvc.getHCBProdCode(hospicashId, channelId,userData.sumAssuredForRiders,userData.riderterm)
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
						$log.debug('::values :: ', values);
						var serviceTaxFactorForFirstAndSecondYear = values[0];
						var modalPremiumConvertingFactor = values[1];
						var annualRiderPremium = values[2];
						hospiCashPremium.prodCode = values[3];
						hospiCashPremium.modalFactor = modalPremiumConvertingFactor;
						hospiCashPremium.sumAssured = userData.sumAssuredForRiders;
						hospiCashPremium.benfitUptoAge = commonFormulasForRidersSvc.getBenifitUptoAge(parseInt(userData.laAge),parseInt(userData.riderterm));
						hospiCashPremium.riderPremium = annualRiderPremium;/*As per the table*/
						hospiCashPremium.percentOfBasePremium = commonFormulasForRidersSvc.getPercentOfBasePremium(30,basePremium);/* for now its 30% do this value come from DB?*/
						/*This is validation if annual premium is greater than 30 % ofbase premium system will send zero and validations to be handeled on frontend side*/
						hospiCashPremium.annualHospiCashPremium = commonFormulaSvc.round(commonFormulasForRidersSvc.getAnnualRider(hospiCashPremium.riderPremium,hospiCashPremium.percentOfBasePremium),0);
						hospiCashPremium.modalHospiCashPremium = commonFormulaSvc.round(commonFormulasForRidersSvc.getModalRiderPremium(hospiCashPremium.annualHospiCashPremium,modalPremiumConvertingFactor),0);
						hospiCashPremium.serviceTaxFactorForFirstAndSecondYear = commonFormulasForRidersSvc.getmodalPremiumWithServiceTax( serviceTaxFactorForFirstAndSecondYear,hospiCashPremium.modalHospiCashPremium);
						hospiCashPremium.serviceTaxForModalFirstYear = commonFormulasForRidersSvc.getmodalPremiumWithServiceTax( serviceTaxFactorForFirstAndSecondYear,hospiCashPremium.modalHospiCashPremium);
						hospiCashPremium.serviceTaxForAnnualFirstYear = commonFormulasForRidersSvc.getmodalPremiumWithServiceTax( serviceTaxFactorForFirstAndSecondYear,hospiCashPremium.riderPremium);
						hospiCashPremium.serviceForAnnualFirstYearTax = commonFormulasForRidersSvc.getmodalPremiumWithServiceTax( serviceTaxFactorForFirstAndSecondYear,hospiCashPremium.riderPremium);
						hospiCashPremium.totalPremium = commonFormulaSvc.add(hospiCashPremium.modalHospiCashPremium,hospiCashPremium.serviceTaxFactorForFirstAndSecondYear);
						hospiCashPremium.totalModalPremiumWithTaxForFirstYear = commonFormulaSvc.add(hospiCashPremium.modalHospiCashPremium,hospiCashPremium.serviceTaxForModalFirstYear);
						hospiCashPremium.totalAnnualPremiumWithTaxForFirstYear = commonFormulaSvc.add(hospiCashPremium.annualHospiCashPremium,hospiCashPremium.serviceTaxForAnnualFirstYear);
						$log.debug('hospiCashPremium',hospiCashPremium);
						$log.debug('hospiCashPremium.annualHospiCashPremium',hospiCashPremium.annualHospiCashPremium+"==="+hospiCashPremium.riderPremium+"===="+hospiCashPremium.percentOfBasePremium);
						q.resolve(hospiCashPremium);

				});
        		return q.promise;
		}
}]);
