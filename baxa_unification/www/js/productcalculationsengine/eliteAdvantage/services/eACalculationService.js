/*
* Created By: Anushree
* Service for Premium Calculation Service here injecting all services
*/
productCalculator.service(
	'eACalculationService',
	[
		'$q',
    	'$log',
		'commonFormulaSvc',
    	'commonDBFuncSvc',
    	'eADataFromDBSvc',
    	'adbRiderForASDataFromUserSvc',
    	'calculateAdbRiderPremiumSvc',
    	'hospiCashRiderDataFromUserSvc',
    	'calculatehospiCashRiderPremiumSvc',
		'commonDbProductCalculation',
		'common_const',
		 function($q, $log, commonFormulaSvc, commonDBFuncSvc, eADataFromDBSvc, adbRiderForASDataFromUserSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, commonDbProductCalculation,common_const) {
		 	'use strict';



			var eA = this;

		 	eA.calcEABasePremium = calcEABasePremium;
		 	eA.calcEASumAssured = calcEASumAssured;
		 	eA.calculateEATotalPremium = calculateEATotalPremium;
		 	eA.calEAModal = calEAModal;
		 	eA.calEANSAP = calEANSAP;
		 	eA.calcServiceTax = calcServiceTax;
		 	eA.calculateEABI = calculateEABI;
		/**
		 		Calculating Base Premium
				Formula = (premiumRate*sumAssured*0.001)
		**/
			function calcEABasePremium(prodId, channelId, sumAssured,ppt,lAgender,lAage) {
		        var q = $q.defer();
				/** mobile web provision **/
				var reqData;
				if(!isWeb){
				    reqData =  eADataFromDBSvc.getEAPremiumRate(prodId, channelId, lAgender, ppt, lAage);

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
			          	$log.debug("value",value);
			          	var firstVal = commonFormulaSvc.multiply(sumAssured,value);
			         	var basePremium = commonFormulaSvc.round(commonFormulaSvc.multiply(firstVal,0.001),0);
			          	q.resolve(basePremium);
		        	});
					return q.promise;
	     	}
      		/**
		 		Calculating Base Premium
				Formula = (basePremium*1000/premiumRate)
			**/
		 	function calcEASumAssured(prodId, channelId, basePremium,ppt,lAgender,lAage) {
	        	var q = $q.defer();
				var reqData;
				if(!isWeb){
				    reqData =  eADataFromDBSvc.getEAPremiumRate(prodId, channelId, lAgender, ppt, lAage);

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
	          			$log.debug("value",value);
	          			var firstVal = commonFormulaSvc.multiply(basePremium,1000);
	          			var sumAssured = commonFormulaSvc.round(commonFormulaSvc.divide(firstVal,value),0);
	          			q.resolve(sumAssured);
	        		});
				return q.promise;
      	}

      	function calEANSAP(sa,nsapRate){
      		var firstVal = commonFormulaSvc.multiply(sa,nsapRate);
      		$log.debug("===",firstVal);
      		return commonFormulaSvc.divide(firstVal,1000);

      	}

      	function calEAModal(basePremium,modalFact){
      		var firstVal = commonFormulaSvc.multiply(basePremium,modalFact);
      		return commonFormulaSvc.round(firstVal,0);
      	}

      	function calcServiceTax(premium,taxRate){
      		return commonFormulaSvc.round(commonFormulaSvc.multiply(premium,taxRate),0);

      	}

    	function calculateEABI(prodId, channelId, data){
				$log.debug('calculateEABI',data);
      		var BIVal = {};
			var q = $q.defer();
			var policyYear = 21;
			var factorForDeathBenfitSecondRuleValue = commonFormulaSvc.multiply(common_const.factorForDeathBenfitThirdRule,data.basePremium);/*confusionmay occur but common_const.factorForDeathBenfitThirdRule value is 11 hence using constant*/
			var policyYearArr = [];
			var annualisedPrem = [];
			var premiumPaidTillDate = 0;
			var deathBenfit = [];
			var sv = [];
			var splSv = [];
			var gMaturityBenfit = [];
			/** mobile web provision **/
			var reqData;
			if(!isWeb){
			    reqData = $q.all([
					eADataFromDBSvc.getEASv(prodId, channelId, data.ppt),
					eADataFromDBSvc.getSplSv(prodId, channelId, data.laAge,data.ppt),
					eADataFromDBSvc.getPayoutRatesByBand(prodId, channelId, data.basePremium)
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
					var svper = biDbVals[0];
					var splSvRate = biDbVals[1];
					var payOut = biDbVals[2];
					var mp = commonFormulaSvc.subtract(20,data.mp);
					$log.debug('mp::',splSvRate);
					var totalMBVal = 0;

					var gMaturityBenfitval = commonFormulaSvc.round(commonFormulaSvc.multiply(payOut, data.sumAssured),0);

					for (var i = 1; i < policyYear; i++) {
						policyYearArr.push(i);
						if(i<= data.pt){
							if(i<= data.ppt){
								annualisedPrem.push(data.basePremium);
								premiumPaidTillDate = commonFormulaSvc.add(premiumPaidTillDate, data.basePremium);
								$log.debug('premiumPaidTillDate',premiumPaidTillDate);
							}else{
								annualisedPrem.push(0);
							}


						/** Death Benfit**/
		        		/*Values Needed:
						1.Premium
		      			2.Sum Assured
		      			3. Year:Min of policy year or policy paying term
						**/
						var premiumDeathBenfitFirstRule =  commonFormulaSvc.round(common_const.factorForDeathBenfitFirstRule*premiumPaidTillDate,0);
						deathBenfit.push(Math.max.apply(Math, [premiumDeathBenfitFirstRule, data.sumAssured, factorForDeathBenfitSecondRuleValue]));
						sv.push(commonFormulaSvc.round(commonFormulaSvc.multiply(premiumPaidTillDate,svper[i-1]),0));
						var splSVTemp = commonFormulaSvc.divide(commonFormulaSvc.multiply(data.sumAssured,splSvRate[i]),1000);
						splSv.push(commonFormulaSvc.round(splSVTemp,0));
						}else{
							annualisedPrem.push(0);
							deathBenfit.push("-");

							sv.push("-");
						}//EOF if pt
						if(i < mp){
							gMaturityBenfit.push(0);
						}else{
							if(i<20){
								gMaturityBenfit.push(gMaturityBenfitval);
							}else{
								gMaturityBenfit.push(data.sumAssured);
							}
							$log.debug('gMaturityBenfit[i]',mp);
							totalMBVal = commonFormulaSvc.add(totalMBVal,gMaturityBenfit[i-1]);
						}
					}
					$log.debug('deathBenfit',deathBenfit);
					$log.debug('annualisedPrem',annualisedPrem);
					$log.debug('policyYearArr',policyYearArr);
					$log.debug('sv',sv);
					$log.debug('splSv',splSv);
					$log.debug('gMaturityBenfit',gMaturityBenfit);
					$log.debug('premiumPaidTillDate',premiumPaidTillDate);
					$log.debug('totalMBVal',totalMBVal);

					BIVal.deathBenfit = deathBenfit;
					BIVal.annualisedPrem = annualisedPrem;
					BIVal.policyYearArr = policyYearArr;
					BIVal.sv = sv;
					BIVal.splSv = splSv;
					BIVal.gMaturityBenfit = gMaturityBenfit;
					BIVal.premiumPaidTillDate = premiumPaidTillDate;
					BIVal.totalMBVal = totalMBVal;
					q.resolve(BIVal);
				});
				return q.promise;

      	}
      	function calculateEATotalPremium(prodId, channelId, data){
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
						eADataFromDBSvc.getEAProductCode(prodId, channelId, data.ppt, data.maturityPremiumMode)

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
					var nSAPFactor = basePremiumValues[0];
					var modalFact = basePremiumValues[1];
					var stax1 = basePremiumValues[2];
					var stax2 = basePremiumValues[3];
					var prodCode = basePremiumValues[4];
					totalBasePremium.modalFactor = modalFact;
					totalBasePremium.prodCode = prodCode;
				 	totalBasePremium.NSAPPremium = 0;
				 	totalBasePremium.modalNSAPPremium = 0;
				 	if(data.NSAPForLA){
				 		totalBasePremium.NSAPPremium = eA.calEANSAP(data.sumAssured,nSAPFactor);
				 		totalBasePremium.modalNSAPPremium = eA.calEAModal(totalBasePremium.NSAPPremium,basePremiumValues[1]);
				 	}
				 	totalBasePremium.basePremium = data.basePremium;
				 	totalBasePremium.modalPremium = eA.calEAModal(data.basePremium,basePremiumValues[1]);
					totalBasePremium.totalAnnualPremium = commonFormulaSvc.add(totalBasePremium.NSAPPremium,totalBasePremium.basePremium);

					totalBasePremium.totalModalPremium = commonFormulaSvc.add(totalBasePremium.modalNSAPPremium,totalBasePremium.modalPremium);

					totalBasePremium.serviceForFirstYearTax = eA.calcServiceTax(totalBasePremium.totalModalPremium,basePremiumValues[2]);
				 	totalBasePremium.serviceForSecondYearTax = eA.calcServiceTax(totalBasePremium.totalModalPremium,basePremiumValues[3]);

					totalBasePremium.serviceForAnnualFirstYearTax = eA.calcServiceTax(totalBasePremium.totalAnnualPremium,basePremiumValues[2]);
				 	totalBasePremium.serviceForAnnualSecondYearTax = eA.calcServiceTax(totalBasePremium.totalAnnualPremium,basePremiumValues[3]);


					totalBasePremium.totalAnnualPremiumWithTaxForFirstYear = commonFormulaSvc.add(totalBasePremium.totalAnnualPremium,totalBasePremium.serviceForAnnualFirstYearTax);
				 	totalBasePremium.totalAnnualPremiumWithTaxForSecondYear = commonFormulaSvc.add(totalBasePremium.totalAnnualPremium,totalBasePremium.serviceForAnnualSecondYearTax);

					totalBasePremium.totalModalPremiumWithTaxForFirstYear = commonFormulaSvc.add(totalBasePremium.totalModalPremium,totalBasePremium.serviceForFirstYearTax);
				 	totalBasePremium.totalModalPremiumWithTaxForSecondYear = commonFormulaSvc.add(totalBasePremium.totalModalPremium,totalBasePremium.serviceForSecondYearTax);
				 	totalBasePremium.bi = eA.calculateEABI(prodId, channelId, data,totalBasePremium);
				 	$log.debug('totalBasePremium',totalBasePremium);
				 	q.resolve(totalBasePremium);
				});
				return q.promise;

      	}


		}
	]
);
