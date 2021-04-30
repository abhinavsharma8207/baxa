/*
service for premium Calculation here injecting all services
developer Anushree k
*/
productCalculator.service('calculatePremiumSvc',
	[
	'calculateBISvc',
	'$q',
	'commonDBFuncSvc',
	'commonFormulaSvc',
	'policyDataFromDBSvc',
	'$log',
	'commonDbProductCalculation',
	'commonPremiumFormulaService',
		function(
				calculateBISvc,
				$q,
				commonDBFuncSvc,
				commonFormulaSvc,
				policyDataFromDBSvc,
				$log,
				commonDbProductCalculation,
				commonPremiumFormulaService){
					'use strict';
				var calculatePremiumSvcObj = this;
				calculatePremiumSvcObj.calculateTotalPremium = calculateTotalPremium;
			   	calculatePremiumSvcObj.calculateSum = calculateSum;
				calculatePremiumSvcObj.calculateGp = calculateGp;
				calculatePremiumSvcObj.calculateBasicPremium = calculateBasicPremium;
				calculatePremiumSvcObj.getInputValues = getInputValues;

				/**
				get all values from DB for input options
				**/
				function getInputValues (prodId, channelId){


					var q = $q.defer();
					var params  = ["GENDER","UPTOAGE","PMODE","PPT"];
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

				/*Benefit Period is calculated*/
				var getPolicyBenefitPeriod = function(benifitUptoAgeSelected, age) {
		    			return commonFormulaSvc.subtract(benifitUptoAgeSelected, age);
		    	};

				/*function will calculate sumAssured*/
				function calculateSum(prodId, channelId, gp, benfitUptoAgeSelected) {
		    		var q = $q.defer();
		    		$log.debug('benfitUptoAgeSelected',benfitUptoAgeSelected);
		    		$log.debug('gp',gp);
					policyDataFromDBSvc.getfactorForCalculatingGuranteedPayouts(prodId, channelId, benfitUptoAgeSelected)
					.then(function(val) {
					 			$log.debug('check',val);
					 			var sumAssured = commonFormulaSvc.divide(gp,val);
					 			q.resolve(sumAssured);
					 		});
							return q.promise;

  				}
				/*function will calculate Guranteed payouts*/
				function calculateGp(prodId, channelId, sumA,benfitUptoAgeSelected){
			    		var q = $q.defer();
			    		$log.debug('benfitUptoAgeSelected',benfitUptoAgeSelected);
			    		$log.debug('sumA',sumA);
						var factor = (policyDataFromDBSvc.getfactorForCalculatingGuranteedPayouts(prodId, channelId, benfitUptoAgeSelected)).then(function(val) {
						 			$log.debug('check1',val);
						 			var gp = commonFormulaSvc.multiply(sumA,val);
						 			q.resolve(gp);
						 		});
					return q.promise;


	  			}

				/**
				basic premium is calculatd
				Note: Not in use as there is change in requirment but in future will be used when we need to calculate premium
				basis on sumAssured
				**/
				function calculateBasicPremium(prodId,channelId,benfitsUptoAgeSelected,laAge,sumAssured,gp,premiumRate) {
						var policyBenefitPeriod = getPolicyBenefitPeriod(benfitsUptoAgeSelected , laAge);
						var factorBasisSA = policyDataFromDBSvc.getfactorBasisSA(prodId,channelId,sumAssured);
						var factorForCalculatingBasePremium = commonFormulaSvc.roundUp(premiumRate *  factorBasisSA,2);
    					var basePremium = commonFormulaSvc.round(factorForCalculatingBasePremium * sumAssured * 0.001,0);
						return basePremium;
				}


				function calculateTotalPremium(prodId, channelId,policyUserData){
					$log.debug('policyUserData ', policyUserData);
					var q = $q.defer();
					var reqGPVal;
					var premium = {
							extraModalPremiumDueToNSAP:0,
							extraPremiumDueToNSAP:0,
						};
						/** mobile web provision **/
					var reqData;
					if(!isWeb){
						reqData = $q.all([
										commonDbProductCalculation.getNsapRate(prodId, channelId),
										commonDbProductCalculation.serviceTaxFirstYear(prodId, channelId),
										commonDbProductCalculation.serviceTaxSecondYear(prodId, channelId),
										policyDataFromDBSvc.getannualBonus(prodId, channelId, 4),
										policyDataFromDBSvc.getannualBonus(prodId, channelId, 8),
										policyDataFromDBSvc.getpremiumRate(prodId, channelId,policyUserData),
										commonDbProductCalculation.getModalPremiumConvertingFactor(prodId, channelId, policyUserData.premiumMode),
										policyDataFromDBSvc.getProdCodeAS(prodId, channelId, policyUserData.benfitsUptoAgeSelected, policyUserData.ppt),

									]);
								}else{
						  		/**Provision for webapp code **/
						  		/**

						  		**/

						  		/**return values in array in then function**/
								}

                        		reqData.then(function(values) {
															$log.debug("values",values);
															var nSAPFactor = values[0];
															var serviceTaxFactorForFirstYear = values[1];
															var serviceTaxFactorForSecondYearOnwards = values[2];
															calculatePremiumSvcObj.ANNCASHBON4 = values[3];
															calculatePremiumSvcObj.ANNCASHBON8 = values[4];
															var premiumRate = values[5];
															var premiumToModalFactor = values[6];
															var prodCode = values[7];
															$log.debug("premiumRate",premiumRate);
															premium.modalFactor = premiumToModalFactor;
															premium.prodCode = prodCode;

															$log.debug("calculatePremiumSvcObj.premiumToModalFactor :" + premiumToModalFactor);
															/*
															premium.base = calculatePremiumSvcObj.calculateBasicPremium(prodId, channelId,policyUserData.benfitsUptoAgeSelected,policyUserData.laAge,policyUserData.sumAssured,policyUserData.gp,premiumRate);
															premium.baseModal = calculatePremiumSvcObj.calculateModalPremium(premium.base,premiumToModalFactor);
															*/
															premium.base = policyUserData.basePremium;
															premium.baseModal = commonPremiumFormulaService.calculateModalPremium(premium.base,premiumToModalFactor);
															premium.sumAssuredWithoutRound = commonFormulaSvc.round(commonPremiumFormulaService.calculateSumAssured(premiumRate,policyUserData.basePremium),0);
															premium.sumAssured = commonPremiumFormulaService.calculateSumAssured(premiumRate,policyUserData.basePremium);
															if(!isWeb){
															reqGPVal = calculateGp(prodId, channelId, premium.sumAssured, policyUserData.benfitsUptoAgeSelected);
															}else{

															}
															reqGPVal.then(function(val){
																premium.guranteedPay = val;
															});
															$log.debug("premium.base :" + premium.base);
															if (policyUserData.NSAPForLA) {
																premium.extraPremiumDueToNSAP = commonFormulaSvc.roundUp(commonPremiumFormulaService.calculatePremiumDueToNsap(premium.sumAssured,nSAPFactor),2);
																premium.extraModalPremiumDueToNSAP = commonPremiumFormulaService.calculateModalPremiumForNSAP(premium.extraPremiumDueToNSAP,premiumToModalFactor);
																$log.debug("premium.extraPremiumDueToNSAP :" + premium.extraPremiumDueToNSAP);
																$log.debug("premium.extraModalPremiumDueToNSAP :" + premium.extraModalPremiumDueToNSAP);
															}
																premium.totalModalPremium = premium.baseModal+premium.extraModalPremiumDueToNSAP;
																premium.serviceTaxForFirstYear = commonPremiumFormulaService.calculateServiceTax(serviceTaxFactorForFirstYear,premium.totalModalPremium);
																premium.totalModalPremiumWithServiceTaxForFirstYear = commonFormulaSvc.add(premium.totalModalPremium,premium.serviceTaxForFirstYear);
																premium.serviceTaxForSecondYear = commonPremiumFormulaService.calculateServiceTax(serviceTaxFactorForSecondYearOnwards,premium.totalModalPremium);
																premium.totalModalPremiumWithServiceTaxForSecondYear = commonFormulaSvc.add(premium.totalModalPremium,premium.serviceTaxForSecondYear);

																premium.totalAnnualPremium = premium.baseModal+premium.extraPremiumDueToNSAP;
																premium.serviceForAnnualFirstYearTax = commonPremiumFormulaService.calculateServiceTax(serviceTaxFactorForFirstYear,premium.totalAnnualPremium);
																premium.totalModalPremiumWithServiceTaxForFirstYear = commonFormulaSvc.add(premium.totalAnnualPremium,premium.serviceForAnnualFirstYearTax);
																premium.serviceForAnnualSecondYearTax = commonPremiumFormulaService.calculateServiceTax(serviceTaxFactorForSecondYearOnwards,premium.totalAnnualPremium);
																premium.totalModalPremiumWithServiceTaxForSecondYear = commonFormulaSvc.add(premium.totalAnnualPremium,premium.serviceForAnnualSecondYearTax);



																premium.bIValue = calculateBISvc.getBIvalues(prodId, channelId,policyUserData.benfitsUptoAgeSelected, policyUserData.laAge, premium.base, premium.sumAssured, policyUserData.ppt, premium.sumAssuredWithoutRound);
																$log.debug('premium.bIValue');
																$log.debug(premium);

																q.resolve(premium);

                        						});
							return q.promise;
           }
 }]);

productCalculator.service('calculateBISvc',
[
	'$q',
	'commonDBFuncSvc',
	'$log',
	'commonFormulaSvc',
	'policyDataFromDBSvc',
	'common_const',
	function($q, commonDBFuncSvc, $log, commonFormulaSvc, policyDataFromDBSvc,common_const) {

	calculateBISvcObj = this;

	calculateBISvcObj.getBIvalues = getBIvalues;
	calculateBISvcObj.minOfPolicyYearAndTerm = minOfPolicyYearAndTerm;
	calculateBISvcObj.getSVForNonGuranteed = getSVForNonGuranteed;
	calculateBISvcObj.getSVForGuranteed = getSVForGuranteed;


	function minOfPolicyYearAndTerm(currentPolicyYear, policyTerm){
          return commonFormulaSvc.minValue(currentPolicyYear,policyTerm);
  	}


			/**Calculate surnder value for Non Guranteed**/
	function getSVForNonGuranteed(premiumTerm,sumAssured,benfitUptoAgeSelected){
					var SVFromTable = calculateBISvcObj.SVForNonGuranteed;
					$log.debug('SVFromTable ::: ' + SVFromTable.length);
					$log.debug(SVFromTable);
					var sVForNonGuranteed = [];
					var factorsvCal = (parseInt(sumAssured)/1000);
					/*Loop for sv*/
					for (var i = 0, len = SVFromTable.length; i !== len; i++) {
						sVForNonGuranteed.push(commonFormulaSvc.multiply(parseInt(SVFromTable[i]),factorsvCal));
		      		}
						$log.debug('sVForNonGuranteed ::::');
						$log.debug(sVForNonGuranteed);
				      	return sVForNonGuranteed;
			}


	function getSVForGuranteed(policyTerm, basePremium, sumAssured) {
				total = 0;
					//***//
	     		var Gsv = calculateBISvcObj.SVForGuranteed;
				$log.debug("==policyTerm",policyTerm);
				var sVForGuranteed = [];
	     		var survivalBenfitAndMaturity =0;
	     		for (var i = 0, len = Gsv.length; i !== len; i++) {
	     				var temp = i+1;
	     				if(temp <= policyTerm){
	     					yearForCalculations = temp;
	     					}else{
	     						yearForCalculations = policyTerm;
	     					}

			          if(i!=len){
			          	if(i<=8){
			          			survivalBenfitAndMaturity = 0;
			          		}else{
			          			survivalBenfitAndMaturity = parseInt(sumAssured*0.055);
										}
			        	}else{
			          		survivalBenfitAndMaturity = sumAssured;
			          }

			          total = survivalBenfitAndMaturity + total;
			          total2 = yearForCalculations*basePremium*Gsv[i];
			          finalval = total2-total;
					  $log.debug("==Gsv[i]",Gsv[i]);
					if(finalval>= 0){
		          		sVForGuranteed.push(finalval);
						}
		          }
	      			return sVForGuranteed;
	     		}

	function getBIvalues(prodId, channelId, benfitAgeSelected, laAge, basePremium, sumAssured, ppt,sumAssuredWithoutRound){
			$log.debug("param",prodId, channelId, benfitAgeSelected, laAge, basePremium, sumAssured, ppt);
			var BIVal = {};
			var q = $q.defer();

			/** mobile web provision **/
			var reqData;
			if(!isWeb){
			    reqData = $q.all([
					policyDataFromDBSvc.getannualBonus(prodId, channelId, 4),
					policyDataFromDBSvc.getannualBonus(prodId, channelId, 8),
					policyDataFromDBSvc.getSVFactorForNonGuranteed(prodId, channelId, ppt, laAge, benfitAgeSelected),
			  		policyDataFromDBSvc.getDataFromGSV(prodId, channelId, ppt),
					policyDataFromDBSvc.getfactorForCalculatingGuranteedPayouts(prodId, channelId, benfitAgeSelected),
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
					$log.debug("BIDB",values);
					calculateBISvcObj.factorForCashBonus4 = values[0];
					calculateBISvcObj.factorForCashBonus8 = values[1];
					calculateBISvcObj.SVForNonGuranteed = values[2];
					calculateBISvcObj.SVForGuranteed = values[3];
					calculateBISvcObj.guranteedPayFact = values[4];

					var premiumPaid = [];
					var endOfPolicyYr = benfitAgeSelected - laAge;

					var cashBonus4 = commonFormulaSvc.round(commonFormulaSvc.multiply(calculateBISvcObj.factorForCashBonus4, sumAssured),0);
					var cashBonus8 = commonFormulaSvc.round(commonFormulaSvc.multiply(calculateBISvcObj.factorForCashBonus8, sumAssured),0);

					var NGSV = calculateBISvcObj.getSVForNonGuranteed(ppt,sumAssured,basePremium);
					var GSV = calculateBISvcObj.getSVForGuranteed(ppt,basePremium,sumAssuredWithoutRound);
					$log.debug("GSV",GSV);
					var endOfPolicyAge = [];
			    	var deathBenfit = [];
			    	var survivalBenfitAndMaturity = [];
			    	var nonGuranteedCashBonus4 = [];
			    	var nonGuranteedCashBonus8 = [];
			    	var sumAssuredArray = [];
			    	var guaranteedAddition3 = [];
			    	var valueGuaranteedAddition3 = 0;
			    	var specialInterestBonus = [];
			    	var valueSpecialInterestBonus = 0;
			    	var svlength = len-1;

					for (var i = 0, len = endOfPolicyYr; i !== len; i++) {
				 		endOfPolicyAge.push(i+1);
			          	sumAssuredArray.push(sumAssured);
			          	guaranteedAddition3.push(valueGuaranteedAddition3);
			          	specialInterestBonus.push(valueSpecialInterestBonus);
			        	if(i< ppt ){
				          	premiumPaid.push(basePremium);
				          	currentPolicyYear = i+1;
			        	}else{
			       		    premiumPaid.push(0);
			       		    currentPolicyYear = ppt;
		       			}

	      			/*Survival and maturity benfit*/
	      			/*Rule1: for first 9 year it will be zero*/
	      			/*Rule2: if 100 then 0.055
	      			if 85 then 0.06 */
	      			/*Rule3 : if last year then sum assured */

		      if(i != len-1){
				      if(i <= 8){
				        survivalBenfitAndMaturity.push(0);
							}else{
				        survivalBenfitAndMaturity.push(parseInt(sumAssured*calculateBISvcObj.guranteedPayFact));
							}
			     }else{
			          survivalBenfitAndMaturity.push(sumAssured);
			     }

		        /** Death Benfit
		        //Values Needed:
				//1.Premium
		      	//2.Sum Assured
		      	//3. Year:Min of policy year or policy paying term**/
						//***//
						var premiumDeathBenfitFirstRule =  calculateBISvcObj.minOfPolicyYearAndTerm(currentPolicyYear,15)*common_const.factorForDeathBenfitFirstRule*basePremium;
						var premiumDeathBenfitThirdRule = commonFormulaSvc.multiply(parseInt(common_const.factorForDeathBenfitThirdRule), parseInt(basePremium));

						deathBenfit.push(commonFormulaSvc.roundDown(Math.max.apply(Math, [premiumDeathBenfitFirstRule, sumAssured, premiumDeathBenfitThirdRule]),0));
							/***Non Guranteed benfit***/
							/**
									Rule1: Cash bonus @4% & 8% for first 5 years will be 0.
									Rule2 : Cash bonus @8% factor is 0.0635
									Rule3 : Cash bonus @ 4% factor is 0.0035
							**/

							//***//
							if(i > common_const.noCashBonusForYear){
								nonGuranteedCashBonus4.push(cashBonus4);
								nonGuranteedCashBonus8.push(cashBonus8);
							}else{
								nonGuranteedCashBonus4.push(0);
								nonGuranteedCashBonus8.push(0);
							}
						}//**EOF LOOP*//

						/**/
						BIVal.endOfPolicyAge = endOfPolicyAge;
						BIVal.premiumPaid = premiumPaid;
						BIVal.sumAssured = sumAssuredArray;

						/*Guranteed*/
						BIVal.survivalBenfitAndMaturity = survivalBenfitAndMaturity;
						BIVal.guaranteedAddition3 = guaranteedAddition3;
						BIVal.deathBenfit = deathBenfit;
						BIVal.GSV = GSV;

						/*EOF Guranteed*/
						/*NonGuranteed*/
						BIVal.nonGuranteedCashBonus8 = nonGuranteedCashBonus8;
						BIVal.nonGuranteedCashBonus4 = nonGuranteedCashBonus4;
						BIVal.specialInterestBonus = specialInterestBonus;
						BIVal.NGSV= NGSV;
						q.resolve(BIVal);
						/*EOF Non Guranteed*/

				});
				return q.promise;
		}
}]);
