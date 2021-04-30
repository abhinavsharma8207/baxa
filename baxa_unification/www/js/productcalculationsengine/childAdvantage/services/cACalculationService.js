/*
* Created By: Anushree
* Service for Premium Calculation Service here injecting all services
*/
productCalculator.service(
	'cACalculationService',
	[
		'$q',
    	'$log',
		'commonFormulaSvc',
    	'commonDBFuncSvc',
    	'cADataFromDBSvc',
    	'adbRiderForASDataFromUserSvc',
    	'calculateAdbRiderPremiumSvc',
    	'hospiCashRiderDataFromUserSvc',
    	'calculatehospiCashRiderPremiumSvc',
		'commonDbProductCalculation',
		'commonPremiumFormulaService',
		'common_const',
		 function($q, $log, commonFormulaSvc, commonDBFuncSvc, cADataFromDBSvc, adbRiderForASDataFromUserSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, commonDbProductCalculation, commonPremiumFormulaService,common_const) {
		 	'use strict';
			var cA = this;

			cA.calcCABasePremium = calcCABasePremium;
			cA.calcCASumAssured = calcCASumAssured;
			cA.calculateCATotalPremium = calculateCATotalPremium;
			cA.calculateCABI = calculateCABI;
			cA.calcSurrenderValueAtGivenPercent = calcSurrenderValueAtGivenPercent;


				function calcCABasePremium(prodId, channelId, data) {
				   var q = $q.defer();
				   var basePremium;
				   /** mobile web provision **/
				   var reqData;
				   if(!isWeb){
				       reqData = cADataFromDBSvc.getCAPremiumRateBYSA(prodId, channelId, data);

				   }else{
				     /**Provision for webapp code **/
				     /**
				         for web team needs to get promices after webservice call for

				     **/

				     /**return values in array in then function**/
				   }
				   reqData.then(function(value){
						$log.debug("value:::>>",value);
					 	var firstVal = commonFormulaSvc.multiply(data.sumAssured,value);
						basePremium = commonFormulaSvc.multiply(firstVal,0.001);
					 	q.resolve(basePremium);
				   	});
					   return q.promise;
			   	}

				function calcCASumAssured(prodId, channelId, data) {
				   var q = $q.defer();
				   var sA = 0;
				   var premiumRate = cADataFromDBSvc.getCAPremiumRateBYPremium(prodId, channelId, data)
				   .then(function(value){
						$log.debug("value:::",value);
						var firstVal = commonFormulaSvc.multiply(data.basePremium,1000);
						sA = commonFormulaSvc.divide(firstVal,value);
					 	q.resolve(sA);
				   	});
					   return q.promise;
			   	}

					function calcSurrenderValueAtGivenPercent(prodId, channelId, data){
						var q = $q.defer();
						/** mobile web provision **/
						var reqData;
						if(!isWeb){
						    reqData = $q.all([
									cADataFromDBSvc.getSurrenderFactorBonus(prodId, channelId, data),
									cADataFromDBSvc.getSurrenderFactor(prodId, channelId, data)
							]);
						}else{
						  /**Provision for webapp code **/
						  /**
						      for web team needs to get promices after webservice call for

						  **/

						  /**return values in array in then function**/
						}
						reqData.then(function(value){
							$log.debug('getSurrenderFactorBonus', value[0]);
							$log.debug('getSurrenderFactor', value[1]);

						});

						/* get value from cv bonus by benfitType and maturity option type and band */


						/* get Bonus at 4% for calculating Surrender bonus at 4%
							BOSURATERP11
						*/

						/* Min of Policy year and PT
							* Calculated Bonus at 4% from Table
							* Sum Assured
						**/

						/*
						Surrender Value at 4% Bonus rate=
						  Surrender factor
						* Bonus rate at 4% for last Policy Year
						  SURATERPMB11
						*/

					}

    function calculateCABI(prodId, channelId, data){
      		var BIVal = {};
			var q = $q.defer();
			var factorForDeathBenfitFirstRule = common_const.factorForDeathBenfitFirstRule;
			var factorForDeathBenfitSecondRule = commonFormulaSvc.multiply(common_const.factorForDeathBenfitThirdRule,data.basePremium);
			var policyYear = commonFormulaSvc.add(parseInt(data.pt),1);
			$log.debug('policyYear',policyYear);
			var policyYearArr = [];
			var annualisedPrem = [];
			var gSB = [];/**This array will be used for all three values guranteed,Non-guranteed(@8% & @4%)**/
			var gMB = [];
			var premiumPaidTillDate = 0;
			var gDeathBenfit = [];/**This array will be used for all three values guranteed,Non-guranteed(@8% & @4%)**/
			var gDeathBenfitDiplay = [];
			var sv = [];
			var splSv = [];
			var gMaturityBenfit = [];
			var gSBTillDate = 0;
			var gSBArr = [];
			var gSBDisplay = [];
			var gSV = [];
			var gSVal = 0;
			var gSBVal = 0;
			var bonusAt8ForCalculatingSurrenderBonusAt8 = [];
			var bonusAt4ForCalculatingSurrenderBonusAt4 = [];
			var finalSurrenderAt4 = [];
			var finalSurrenderAt8 = [];
			var ngMB8 = [];
			var ngMB4 = [];
			/** mobile web provision **/
			var reqData;
			if(!isWeb){
			    reqData = $q.all([
						cADataFromDBSvc.getDBFactor(prodId, channelId, data.maturityOption),
						cADataFromDBSvc.getSBForMB(prodId, channelId, data.pt),
						cADataFromDBSvc.getMBFactor(prodId, channelId, data.maturityOption),
						cADataFromDBSvc.getGSV(prodId, channelId, data.pt,data.benfitType),
						cADataFromDBSvc.getMBforNonGuranteed(prodId, channelId, data.pt, data.sumAssured, data.maturityOption, data.benfitType, 4),
						cADataFromDBSvc.getMBforNonGuranteed(prodId, channelId, data.pt, data.sumAssured, data.maturityOption, data.benfitType, 8),
						cADataFromDBSvc.getSurrenderFactorBonus(prodId, channelId, data),
						cADataFromDBSvc.getSurrenderFactor(prodId, channelId, data)

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
			reqData.then(function(biDbVals){
					var dbFactor = biDbVals[0];
					var sBForMBFactorArray = biDbVals[1];
					var gMBFact = biDbVals[2];
					var gSVFactArr =  biDbVals[3];
					var nGMBAt4 = biDbVals[4];
					var nGMBAt8 = biDbVals[5];
					var surrenderFactorBonus =  biDbVals[6];
					var surrenderFactor =  biDbVals[7];
					$log.debug("Arr1", biDbVals[6] );
					$log.debug("Arr2", biDbVals[7] );

					$log.debug('nGMBAt4',nGMBAt4);
					$log.debug('nGMBAt8',nGMBAt8);
					var ind = data.pt-11;

					//var payOut = biDbVals[2];
					$log.debug('sBForMBFactorArray>>',biDbVals[1]);
					var factorForDeathBenfitThirdRuleVal = commonFormulaSvc.multiply(dbFactor,data.sumAssured);
					var gMaturityBenfitval = commonFormulaSvc.multiply(gMBFact,data.sumAssured);
					/*Maturity Benfit @4 MB
						(0.0065*500000*11*1.1)+Guaranteed Maturity benefit
					*/
					var gMaturityBenfitAt4 = ((nGMBAt4 * data.sumAssured * data.pt * 1.1) + gMaturityBenfitval);

					/*Maturity Benfit @4 MB*/
					var gMaturityBenfitAt8 = ((nGMBAt8 * data.sumAssured * data.pt * 1.1) + gMaturityBenfitval);

					$log.debug("gMaturityBenfitAt4",gMaturityBenfitAt4);
					$log.debug("gMaturityBenfitAt8",gMaturityBenfitAt8);

					for (var i = 1; i < policyYear; i++) {
						policyYearArr.push(i);
						/*BQ5*BR5*BP5

						*/
						bonusAt8ForCalculatingSurrenderBonusAt8.push(nGMBAt8*i*data.sumAssured);
						bonusAt4ForCalculatingSurrenderBonusAt4.push(nGMBAt4*i*data.sumAssured);
						if(bonusAt8ForCalculatingSurrenderBonusAt8[i-2] === undefined){
							bonusAt8ForCalculatingSurrenderBonusAt8[i-2] = 0;
						}
						if(bonusAt4ForCalculatingSurrenderBonusAt4[i-2] === undefined){
							bonusAt4ForCalculatingSurrenderBonusAt4[i-2] = 0;
						}
						/* Final Surrender value at 4 & 8 % */
						var surrenderValAt8 = commonFormulaSvc.divide(commonFormulaSvc.multiply(bonusAt8ForCalculatingSurrenderBonusAt8[i-2], surrenderFactorBonus[i-1]),1000) ;
						var surrenderValAt4 = commonFormulaSvc.divide(commonFormulaSvc.multiply(bonusAt4ForCalculatingSurrenderBonusAt4[i-2], surrenderFactorBonus[i-1]),1000) ;
							$log.debug('surrenderValAt4'+surrenderValAt4);

						var X = commonFormulaSvc.divide(commonFormulaSvc.multiply(surrenderFactor[i-1],data.sumAssured),1000);
						$log.debug(X+"=="+surrenderValAt8+"=="+surrenderValAt4+">>");
						finalSurrenderAt4.push(commonFormulaSvc.round(commonFormulaSvc.add(surrenderValAt4,X),0));
						finalSurrenderAt8.push(commonFormulaSvc.round(commonFormulaSvc.add(surrenderValAt8,X),0));

						/*Ends here*/
						/* If Moneyback then Survival benfit else 0*/



						if(data.maturityOption == 'Money Back'){
							var sBFact = sBForMBFactorArray[i];
								$log.debug("sBForMBFactorArray",sBFact +"==");

								$log.debug("index",ind );
							if(sBFact !== undefined){
								sBFact = sBForMBFactorArray[i][ind];
								gSB.push(commonFormulaSvc.multiply(sBFact, data.sumAssured));
								gSBDisplay.push(commonFormulaSvc.round(commonFormulaSvc.multiply(sBFact, data.sumAssured),0));
								}else{
								gSB.push('-');
								gSBDisplay.push('-');
							}
						}else{
							gSB.push('-');
							gSBDisplay.push('-');
						}

						if(gSB[i-2] == '-' || gSB[i-2] === undefined){
							gSBVal = 0;
						}else{
							gSBVal = gSB[i-2];
						}
						$log.debug(gSBTillDate+"=============="+gSB[i-2]+"======"+gSBVal);
						gSBTillDate = commonFormulaSvc.add(gSBTillDate,gSBVal);
						gSBArr.push(gSBTillDate);
						/*formula for guranteed sv
						Surrender Factor*
						Min of Policy Year and PPT*
						Base Premium -
						Sum of survival benefit paid till last year
						Applicable till policy term

						*/
						/*
						Min of Policy Year and PPT
						*/
						var minOfPyANDPPT = Math.min(parseInt(i),parseInt(data.ppt));
						$log.debug( "==="+gSVFactArr[i-1]+"==="+i+"==="+data.basePremium+"==="+gSBArr[i-1]+"===");
						gSVal = gSVFactArr[i-1]*minOfPyANDPPT*data.basePremium-gSBArr[i-1];
						gSV.push(commonFormulaSvc.round(gSVal,0));
						if(i<= data.pt){
							if(i<= data.ppt){
								premiumPaidTillDate = commonFormulaSvc.add(premiumPaidTillDate,data.basePremium);
								$log.debug('premiumPaidTillDate',premiumPaidTillDate);
								annualisedPrem.push(commonFormulaSvc.round(data.basePremium,0));
							}else{
								annualisedPrem.push(0);
							}


						/** Death Benfit**/
		        		/*Values Needed:
						1.Premium
		      			2.Sum Assured
		      			3. Year:Min of policy year or policy paying term
						**/
						var premiumDeathBenfitFirstRule =  factorForDeathBenfitFirstRule*premiumPaidTillDate;
						$log.debug("+++++++>",premiumDeathBenfitFirstRule, factorForDeathBenfitSecondRule, factorForDeathBenfitThirdRuleVal);
						gDeathBenfit.push(Math.max.apply(Math, [premiumDeathBenfitFirstRule, factorForDeathBenfitSecondRule, factorForDeathBenfitThirdRuleVal]));
						/*since value is having one rupee diff while calculating we are taking decimal value & while showing we are showing round value*/
						$log.debug("===>gDeathBenfit[i]",gDeathBenfit[i-1]);
						gDeathBenfitDiplay.push(commonFormulaSvc.round(gDeathBenfit[i-1],0));

						/*Maturity benfit only for last year of payment term*/
							if(i == parseInt(data.pt)){
								gMB.push(commonFormulaSvc.round(gMaturityBenfitval,0));
								ngMB4.push(commonFormulaSvc.round(gMaturityBenfitAt4,0));
								ngMB8.push(commonFormulaSvc.round(gMaturityBenfitAt8,0));
							}else{
								gMB.push(0);
								ngMB4.push(0);
								ngMB8.push(0);
							}
						}else{

						}/*EOF if pt*/

					}
					$log.debug('policyYearArr',policyYearArr);
					$log.debug('deathBenfit',gDeathBenfit);
					$log.debug('gMB',gMB);
					$log.debug('sB',gSB);
					$log.debug('gSBArr',gSBArr);
					$log.debug('gSV',gSV);
					$log.debug('bonusAt8ForCalculatingSurrenderBonusAt8',bonusAt8ForCalculatingSurrenderBonusAt8);
					$log.debug('bonusAt4ForCalculatingSurrenderBonusAt4',bonusAt4ForCalculatingSurrenderBonusAt4);
					$log.debug('finalSurrenderAt4',finalSurrenderAt4);
					$log.debug('finalSurrenderAt8',finalSurrenderAt8);
					BIVal.policyYearArr = policyYearArr;
					BIVal.deathBenfit = gDeathBenfitDiplay;
					BIVal.deathBenfitAt4 = gDeathBenfitDiplay;
					BIVal.deathBenfitAt8 = gDeathBenfitDiplay;
					BIVal.sB = gSBDisplay;
					BIVal.sBAt4 = gSBDisplay;
					BIVal.sBAt8 = gSBDisplay;
					BIVal.gMB = gMB;
					BIVal.gMaturityBenfitAt4 = ngMB4;
					BIVal.gMaturityBenfitAt8 = ngMB8;
					BIVal.gSV = gSV;
					BIVal.finalSurrenderAt4 = finalSurrenderAt4;
					BIVal.finalSurrenderAt8 = finalSurrenderAt8;
					BIVal.annualisedPrem = annualisedPrem;
					q.resolve(BIVal);
				});
				return q.promise;

      	}
      function calculateCATotalPremium(prodId, channelId, data){
      	$log.debug('data:::',data);
      	var q = $q.defer();
      	var totalBasePremium = {};
		/** mobile web provision **/
		var reqData;
		if(!isWeb){
		    reqData = $q.all([
						commonDbProductCalculation.getNsapRate(prodId, channelId),
						commonDbProductCalculation.getModalPremiumConvertingFactor(prodId, channelId, parseInt(data.premiumMode)),
						commonDbProductCalculation.serviceTaxFirstYear(prodId, channelId),
						commonDbProductCalculation.serviceTaxSecondYear(prodId, channelId),
                        cADataFromDBSvc.getProdCodeCA(prodId, channelId, parseInt(data.ppt),data.benfitType, data.maturityOption)
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
					var nsapFact = basePremiumValues[0];
					var mpFact =  basePremiumValues[1];
					var stax1 =  basePremiumValues[2];
					var stax2 =  basePremiumValues[3];
                    totalBasePremium.prodCode = basePremiumValues[4];
					totalBasePremium.modalFactor = mpFact;
				 	totalBasePremium.NSAPPremium = 0;
				 	totalBasePremium.modalNSAPPremium = 0;
				 	if(data.NSAPForLA){
				 		totalBasePremium.NSAPPremium = commonPremiumFormulaService.calculatePremiumDueToNsap(data.sumAssured,nsapFact);
				 		totalBasePremium.modalNSAPPremium = commonPremiumFormulaService.calculateModalPremium(totalBasePremium.NSAPPremium,mpFact);
				 	}
				 	totalBasePremium.basePremium = commonFormulaSvc.round(data.basePremium,0);
				 	totalBasePremium.modalPremium = commonPremiumFormulaService.calculateModalPremium(data.basePremium,mpFact);
					totalBasePremium.totalAnnualPremium = commonFormulaSvc.add(totalBasePremium.NSAPPremium,data.basePremium);
					totalBasePremium.totalModalPremium = commonFormulaSvc.add(totalBasePremium.modalNSAPPremium,totalBasePremium.modalPremium);

					totalBasePremium.serviceForFirstYearTax = commonPremiumFormulaService.calculateServiceTax(totalBasePremium.totalModalPremium,stax1);
				 	totalBasePremium.serviceForSecondYearTax = commonPremiumFormulaService.calculateServiceTax(totalBasePremium.totalModalPremium,stax2);

					totalBasePremium.serviceForAnnualFirstYearTax = commonPremiumFormulaService.calculateServiceTax(data.basePremium,stax1);
				 	totalBasePremium.serviceForAnnualSecondYearTax = commonPremiumFormulaService.calculateServiceTax(data.basePremium,stax2);


					totalBasePremium.totalAnnualPremiumWithTaxForFirstYear = commonFormulaSvc.add(totalBasePremium.totalAnnualPremium,totalBasePremium.serviceForAnnualFirstYearTax);
				 	totalBasePremium.totalAnnualPremiumWithTaxForSecondYear = commonFormulaSvc.add(totalBasePremium.totalAnnualPremium,totalBasePremium.serviceForAnnualSecondYearTax);

					totalBasePremium.totalModalPremiumWithTaxForFirstYear = commonFormulaSvc.add(totalBasePremium.totalModalPremium,totalBasePremium.serviceForFirstYearTax);
				 	totalBasePremium.totalModalPremiumWithTaxForSecondYear =commonFormulaSvc.add(totalBasePremium.totalModalPremium,totalBasePremium.serviceForSecondYearTax);

					totalBasePremium.bi = cA.calculateCABI(prodId, channelId, data);
				 	$log.debug('totalBasePremium',totalBasePremium);
				 	q.resolve(totalBasePremium);
				});
				return q.promise;

      }


		 }
	]
);
