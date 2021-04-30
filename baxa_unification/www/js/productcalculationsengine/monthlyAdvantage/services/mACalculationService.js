/*
* Created By: Anushree
* Service for Premium Calculation Service here injecting all services
*/
productCalculator.service(
	'mACalculationService',
	[
		'$q',
    	'$log',
		'commonFormulaSvc',
    	'commonDBFuncSvc',
    	'mADataFromDBSvc',
    	'adbRiderForASDataFromUserSvc',
    	'calculateAdbRiderPremiumSvc',
    	'hospiCashRiderDataFromUserSvc',
    	'calculatehospiCashRiderPremiumSvc',
		'commonDbProductCalculation',
		'commonPremiumFormulaService',
		'common_const',
		 function($q, $log, commonFormulaSvc, commonDBFuncSvc, mADataFromDBSvc, adbRiderForASDataFromUserSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, commonDbProductCalculation, commonPremiumFormulaService,common_const) {
		 	'use strict';
			var mA = this;

			mA.calcMABasePremium = calcMABasePremium;
			mA.calcMASumAssured = calcMASumAssured;
			mA.calculateMATotalPremium = calculateMATotalPremium;
			mA.calculateMABI = calculateMABI;
			mA.calcSurrenderValueAtGivenPercent = calcSurrenderValueAtGivenPercent;
			mA.getInputValues = getInputValues;


				function getInputValues (prodId, channelId){
					var q = $q.defer();
					var params  = ["GENDER","BUYPOLFOR","PMODE","PT"];
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


				function calcMABasePremium(prodId, channelId, data) {
				   var q = $q.defer();
				   var basePremium;
				   /** mobile web provision **/
				   var reqData;
				   if(!isWeb){
				       reqData = mADataFromDBSvc.getMAPremiumRateBYSA(prodId, channelId, data);

				   }else{
				     /**Provision for webapp code **/


				     /**return values in array in then function**/
				   }
				   reqData.then(function(value){
						$log.debug("value:::",value);
					 	var firstVal = commonFormulaSvc.multiply(data.sumAssured,value);
						basePremium = commonFormulaSvc.round(commonFormulaSvc.multiply(firstVal,0.001),0);
					 	q.resolve(basePremium);
				   	});
					   return q.promise;
			   	}

				function calcMASumAssured(prodId, channelId, data) {
				   var q = $q.defer();
				   var sA = 0;
				   var premiumRate = mADataFromDBSvc.getMAPremiumRateBYPremium(prodId, channelId, data)
				   .then(function(value){
						$log.debug("value:::",value);
						var firstVal = commonFormulaSvc.multiply(data.basePremium,common_const.factForCalSumOrPrem);
						sA =  commonFormulaSvc.divide(firstVal,value); /* commonFormulaSvc.round(,0);
						 */
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
									mADataFromDBSvc.getSurrenderFactorBonus(prodId, channelId, data),
									mADataFromDBSvc.getSurrenderFactor(prodId, channelId, data)
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

    function calculateMABI(prodId, channelId, data,totalBasePremium){
      		var BIVal = {};
			var q = $q.defer();
			//var factorForDeathBenfitFirstRule = 1.05;
			//var factorForDeathBenfitSecondRule = commonFormulaSvc.multiply(11,data.basePremium);
			var policyYear = commonFormulaSvc.add(parseInt(data.pt),1);
			$log.debug('policyYear',policyYear);
			var policyYearArr = [];
			var annualisedPrem = [];
			var gDB = [];
			var gSB = [];/**This array will be used for all three values guranteed,Non-guranteed(@8% & @4%)**/
			/*var gMB = [];
			// var premiumPaidTillDate = 0;
			// var gDeathBenfit = [];/**This array will be used for all three values guranteed,Non-guranteed(@8% & @4%)**/
			// var sv = [];
			// var splSv = [];
			// var gMaturityBenfit = [];
			// var gSBTillDate = 0;
			// var gSBArr = [];
			// var gSV = [];
			// var gSVal = 0;

			// var bonusAt8ForCalculatingSurrenderBonusAt8 = [];
			// var bonusAt4ForCalculatingSurrenderBonusAt4 = [];
			// var finalSurrenderAt4 = [];
			// var finalSurrenderAt8 = [];*/
			var ngDB8 = [];
			var ngDB4 = [];
			var ngSB8 = [];
			var ngSB4 = [];
			var nGSV4 = [];
			var nGSV8 = [];
			var gSV = [];
			var gSBVal = 0;
			var gSBTillDate = 0;
			var nGPartialSV4 = 0;
			var nGPartialSV8 = 0;
			var nGMB4 = [];
			var nGMB8 = [];
			var accuredAt4 = [];
			var accuredAt8 = [];
			/** mobile web provision **/
			var reqData;
			if(!isWeb){
			    reqData = $q.all([
						 	mADataFromDBSvc.getDBFactor(prodId, channelId, parseInt(data.ppt)),
						 	mADataFromDBSvc.getSBForMB(prodId, channelId, parseInt(data.ppt)),
							mADataFromDBSvc.getBonusFactAtPercent(prodId, channelId, data.pt, 4),
							mADataFromDBSvc.getBonusFactAtPercent(prodId, channelId,data.pt, 8),
							mADataFromDBSvc.getGuranteedSurrenderValueArray(prodId, channelId, data),
							mADataFromDBSvc.getSurrenderFactor(prodId, channelId, data, totalBasePremium.band),
						    mADataFromDBSvc.getSpecialSV(prodId, channelId, data)


					]);
			}else{
			  /**Provision for webapp code **/


			  /**return values in array in then function**/
			}
			reqData.then(function(biDbVals){

				var dbFactor = biDbVals[0];
				var sbFactor = biDbVals[1];
				var nGDBFactor4 = biDbVals[2];
				var nGDBFactor8 = biDbVals[3];
				var gSVFact = biDbVals[4];
				var nGSVFact = biDbVals[5];
				var specialSV = biDbVals[6];

				$log.debug("data.sumAssured",data.sumAssured +"=="+ nGSVFact);
				var stdFactNGB = 1.1;
				var constFactForSV = 0.5;

				/* Partial of calculation :: Accured bonus @4 */
				var partialAccuredBonus4 = stdFactNGB * nGDBFactor4 * data.sumAssured;
				/* Partial of calculation :: Accured bonus @8 */
				var partialAccuredBonus8 = stdFactNGB * nGDBFactor8 * data.sumAssured;


				var guranteedDBVal = commonFormulaSvc.multiply(dbFactor, totalBasePremium.basePremium);
				var guranteedSBVal = commonFormulaSvc.multiply(sbFactor, totalBasePremium.basePremium);

				/*Value for maturity benfit @ 4 & 8
				Bonus at 4%
				*Sum Assured
				* Policy Term
				*1.1
				Applicable for only last year

				*/
				var nMB4Val = nGDBFactor4 * data.sumAssured * data.pt * stdFactNGB;
				var nMB8Val = nGDBFactor8 * data.sumAssured * data.pt * stdFactNGB;
				for (var i = 1; i < policyYear; i++) {
					policyYearArr.push(i);
					/*guranteed death Benfit*/
					gDB.push(commonFormulaSvc.round(guranteedDBVal,0));
					/** Non guranteed DB
					Non guaranteed Death benefit at 4%  Formula
					= Standard Value
					* Base Premium
					+ Bonus factor at 4%
					* Sum Assured
					* Policy year
					* 1.1  Applicable till policy term Non guaranteed Death benefit at 4%

					*/
					var nonGuranteedDBVal4 = dbFactor * data.basePremium + nGDBFactor4 * data.sumAssured * i *  stdFactNGB;
					var nonGuranteedDBVal8 = dbFactor * data.basePremium + nGDBFactor8 * data.sumAssured * i *  stdFactNGB;
					ngDB8.push(commonFormulaSvc.round(nonGuranteedDBVal8,0));
					ngDB4.push(commonFormulaSvc.round(nonGuranteedDBVal4,0));

					if(i <= parseInt(data.ppt)){
						annualisedPrem.push(totalBasePremium.basePremium);

						/* guranteed/nonGuranteed4&8 survivalbenfit will be same  /*/
						gSB.push(0);
						ngSB4.push(0);
						ngSB4.push(0);
						/* EOF guranteed/nonGuranteed4&8 survivalbenfit will be same  /*/
					}else{
						annualisedPrem.push(0);

						/* guranteed/nonGuranteed4&8 survivalbenfit will be same  /*/
						gSB.push(commonFormulaSvc.round(guranteedSBVal,0));
						ngSB4.push(commonFormulaSvc.round(guranteedSBVal,0));
						ngSB8.push(commonFormulaSvc.round(guranteedSBVal,0));
						/* EOF guranteed/nonGuranteed4&8 survivalbenfit will be same  /*/
					}


					/*
					  Guaranteed Surrender Value Formula
					  = Surrender factor basis PPT
					  * Base Premium
					  * Min PPT or Policy year
					  - Sum of Survival benefit paid till last year
					  - 0.5
					  *  Survival benefit for paid for current policy year
					  * Show value as zero if Surrender value < 0 or =0
					*/
					/* Factor for guranteed surrender Value
					  It will be min of PPT & policyYear*/
					var X = commonFormulaSvc.minValue(i, parseInt(data.ppt));
					/**
					guranteed Survival benfit paid till date
					**/
					if(gSB[i-2] == 0 || gSB[i-2] === undefined || i <= parseInt(data.ppt)+1 ){
						gSBVal = 0;
						$log.debug("data.ppt",parseInt(data.ppt)+1);
					}else{
						gSBVal = gSB[i-2];
						$log.debug("data.ppt",gSBVal);
					}
					$log.debug("gSBVal==>>",gSBVal);
					gSBTillDate += gSBVal;
					$log.debug("gSBTillDate==>>",gSBTillDate);
					$log.debug("===", gSVFact[i-1] +"=="+ data.basePremium +"=="+ X +"=="+gSBTillDate +"=="+constFactForSV+"=="+gSB[i-1]);
					var gSVData = gSVFact[i-1] * data.basePremium * X - gSBTillDate - constFactForSV * gSB[i-1];
					gSV.push(commonFormulaSvc.round(gSVData,0));

					/*Non guranteed Survival value*/
					var tempValue4 = commonFormulaSvc.round(commonFormulaSvc.multiply(partialAccuredBonus4,i),0);
					accuredAt4.push(tempValue4);
					$log.debug('tempValue',tempValue4);
					nGPartialSV4 = commonFormulaSvc.divide(commonFormulaSvc.multiply(specialSV[i-1],tempValue4),common_const.factForCalSumOrPrem);
					var roundedNGPartialSV4 = commonFormulaSvc.round(nGPartialSV4,0);
					var nGSV4Val = commonFormulaSvc.add(commonFormulaSvc.multiply(commonFormulaSvc.divide(data.sumAssured , common_const.factForCalSumOrPrem),nGSVFact[i-1]),roundedNGPartialSV4);
					nGSV4.push(commonFormulaSvc.round(nGSV4Val,0));
					$log.debug('nGSV4',nGSV4);

					/**/
					/*Non guranteed Survival value*/
					var tempValue8 = commonFormulaSvc.round(commonFormulaSvc.multiply(partialAccuredBonus8,i),0);
					accuredAt8.push(tempValue8);
					$log.debug('tempValue',tempValue8);
					nGPartialSV8 = commonFormulaSvc.divide(commonFormulaSvc.multiply(specialSV[i-1],tempValue8),common_const.factForCalSumOrPrem);
					var roundedNGPartialSV8 = commonFormulaSvc.round(nGPartialSV8,0);
					var nGSV8Val = commonFormulaSvc.add(commonFormulaSvc.multiply(commonFormulaSvc.divide(data.sumAssured , common_const.factForCalSumOrPrem),nGSVFact[i-1]),roundedNGPartialSV8);
					nGSV8.push(commonFormulaSvc.round(nGSV8Val,0));
					$log.debug('nGSV8',nGSV8);

					/**/
					if(i == policyYear-1){
					nGMB4.push(commonFormulaSvc.round(nMB4Val,0));
					nGMB8.push(commonFormulaSvc.round(nMB8Val,0));
					}else{
						nGMB4.push(0);
						nGMB8.push(0);
					}

				}

				BIVal.policyYearArr = policyYearArr;
				BIVal.annualisedPrem = annualisedPrem;
				BIVal.gDB = gDB;
				BIVal.gSB = gSB;
				BIVal.gSV = gSV;
				BIVal.ngDB4 = ngDB4;
				BIVal.nGSB4 = gSB;
				BIVal.nGSV4 = nGSV4;
				BIVal.nMB4 = nGMB4;
				BIVal.ngDB8 = ngDB8;
				BIVal.nGSB8 = gSB;
				BIVal.nGSV8 = nGSV8;
				BIVal.nMB8 = nGMB8;
				BIVal.accuredAt8 = accuredAt8;
				BIVal.accuredAt4 = accuredAt4;
				$log.debug('policyYearArr',policyYearArr);
				$log.debug('annualisedPrem',annualisedPrem);
				$log.debug('gSB',gSB);
				$log.debug("ngDB8",ngDB8);
				$log.debug("ngDB4",ngDB4);
				$log.debug("gDB",gDB);
				$log.debug("gSV", gSV);
				$log.debug("nGSV8", nGSV8);
				$log.debug("nGSV4", nGSV4);
				$log.debug("nMB4",nGMB4);
				$log.debug("nMB8",nGMB8);
				$log.debug("accured",accuredAt4+"===="+accuredAt8);
					q.resolve(BIVal);
				});
				return q.promise;

      	}


      	function calculateMATotalPremium(prodId, channelId, data){
      		$log.debug('data:::',data);
      		var q = $q.defer();
      		var totalBasePremium = {};
			/** mobile web provision **/
			var reqData;
			if(!isWeb){
			    reqData = $q.all([
							commonDbProductCalculation.getNsapRate(prodId, channelId),
							commonDbProductCalculation.getModalPremiumConvertingFactor(prodId, channelId, data.premiumMode),
							commonDbProductCalculation.serviceTaxFirstYear(prodId, channelId),
							commonDbProductCalculation.serviceTaxSecondYear(prodId, channelId),
							mADataFromDBSvc.getProdCodeMA(prodId, channelId, data.sumAssured, data.pt),
							mADataFromDBSvc.getBandForSA(prodId, channelId,data.sumAssured)


						]);
			}else{
		  /**Provision for webapp code **/


		  /**return values in array in then function**/
		}
      	reqData.then(function(basePremiumValues) {

					var nsapFact = basePremiumValues[0];
					var modalFact = basePremiumValues[1];
					var stax1 = basePremiumValues[2];
					var stax2 = basePremiumValues[3];
					totalBasePremium.prodcode = basePremiumValues[4];
					totalBasePremium.band =  basePremiumValues[5];
					totalBasePremium.modalFactor = modalFact;
					/*totalBasePremium.prodcode */
				 	totalBasePremium.NSAPPremium = 0;
				 	totalBasePremium.modalNSAPPremium = 0;
				 	if(data.NSAPForLA){
				 		totalBasePremium.NSAPPremium = commonPremiumFormulaService.calculatePremiumDueToNsap(data.sumAssured,nsapFact);
				 		totalBasePremium.modalNSAPPremium = commonPremiumFormulaService.calculateModalPremium(totalBasePremium.NSAPPremium,modalFact);
				 	}
				 	totalBasePremium.basePremium = data.basePremium;
				 	totalBasePremium.modalPremium = commonPremiumFormulaService.calculateModalPremium(data.basePremium,modalFact);
					totalBasePremium.totalAnnualPremium = commonFormulaSvc.add(totalBasePremium.NSAPPremium,totalBasePremium.basePremium);
					totalBasePremium.totalModalPremium = commonFormulaSvc.add(totalBasePremium.modalNSAPPremium,totalBasePremium.modalPremium);

					totalBasePremium.serviceForFirstYearTax = commonPremiumFormulaService.calculateServiceTax(totalBasePremium.totalModalPremium,stax1);
				 	totalBasePremium.serviceForSecondYearTax = commonPremiumFormulaService.calculateServiceTax(totalBasePremium.totalModalPremium,stax2);

					totalBasePremium.serviceForAnnualFirstYearTax = commonPremiumFormulaService.calculateServiceTax(totalBasePremium.basePremium,stax1);
				 	totalBasePremium.serviceForAnnualSecondYearTax = commonPremiumFormulaService.calculateServiceTax(totalBasePremium.basePremium,stax2);


					totalBasePremium.totalAnnualPremiumWithTaxForFirstYear = commonFormulaSvc.add(totalBasePremium.totalAnnualPremium,totalBasePremium.serviceForAnnualFirstYearTax);
				 	totalBasePremium.totalAnnualPremiumWithTaxForSecondYear = commonFormulaSvc.add(totalBasePremium.totalAnnualPremium,totalBasePremium.serviceForAnnualSecondYearTax);

					totalBasePremium.totalModalPremiumWithTaxForFirstYear = commonFormulaSvc.add(totalBasePremium.totalModalPremium,totalBasePremium.serviceForFirstYearTax);
				 	totalBasePremium.totalModalPremiumWithTaxForSecondYear = commonFormulaSvc.add(totalBasePremium.totalModalPremium,totalBasePremium.serviceForSecondYearTax);

					totalBasePremium.bi = mA.calculateMABI(prodId, channelId, data, totalBasePremium);
				 	$log.debug('totalBasePremium',totalBasePremium);
				 	q.resolve(totalBasePremium);
				});
				return q.promise;

      }


		 }
	]
);
