/*
* CrsSted By: Anushree
* Service for Premium Calculation Service here injecting all services
*/
productCalculator.service(
	'sSCalculationService',
	[
		'$q',
    	'$log',
		'commonFormulaSvc',
    	'commonDBFuncSvc',
    	'sSDataFromDBSvc',
    	'adbRiderForASDataFromUserSvc',
    	'calculateAdbRiderPremiumSvc',
    	'hospiCashRiderDataFromUserSvc',
    	'calculatehospiCashRiderPremiumSvc',
		'commonDbProductCalculation',
		 function($q, $log, commonFormulaSvc, commonDBFuncSvc, sSDataFromDBSvc, adbRiderForASDataFromUserSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, commonDbProductCalculation) {
		 	'use strict';

		 	var sS = this;
		 	sS.calcsSBasePremium = calcsSBasePremium;
		 	sS.calcsSSumAssured = calcsSSumAssured;
		 	sS.calculateSsTotalPremium = calculateSsTotalPremium;
		 	sS.calsSModal = calsSModal;
		 	sS.calsSNSAP = calsSNSAP;
		 	sS.calcServiceTax = calcServiceTax;
		 	sS.calculatesSBI = calculatesSBI;
			sS.sSGetProdCode = sSGetProdCode;
		/**
		 		Calculating Base Premium
				Formula = (premiumRate*sumAssured*0.001)
				same for EA & SS
		**/
			 function calcsSBasePremium(prodId, channelId, sumAssured, ppt, lAgender, lAage, isBp) {
		        var q = $q.defer();
				var basePremium;
				var premiumRate;
				/** mobile web provision **/


				var reqData;
				if(!isWeb){
					reqData = sSDataFromDBSvc.getSsPremiumRate(prodId, channelId, lAgender, parseInt(ppt), parseInt(lAage), isBp, parseInt(sumAssured));

				}else{
				}
				reqData.then(function(value){
		          $log.debug("value:::",value);
				  	var firstVal = commonFormulaSvc.multiply(sumAssured,value);
		         	basePremium = commonFormulaSvc.round(commonFormulaSvc.multiply(firstVal,0.001),0);
		          	q.resolve(basePremium);


				});
					return q.promise;
	     	}
      /**
		 		Calculating Base Premium
				Formula = (basePremium*1000/premiumRate)
				same for EA & SS
		**/
		 function calcsSSumAssured(prodId, channelId, basePremium, ppt, lAgender, lAage, isBP) {
	        var q = $q.defer();
			var sumAssured;
			/** mobile web provision **/
			var reqData;
			if(!isWeb){
				reqData = sSDataFromDBSvc.getSsPremiumRate(prodId, channelId, lAgender,parseInt(ppt),parseInt(lAage),isBP,parseInt(basePremium));
	        }else{}
			reqData.then(function(value){
	          $log.debug("value:::",value);

	          	var firstVal = commonFormulaSvc.multiply(basePremium,1000);
	         	sumAssured = commonFormulaSvc.round(commonFormulaSvc.divide(firstVal,value),0);
	          	q.resolve(sumAssured);

	        });
				return q.promise;
      	}
      	function calsSNSAP(sa,nsapRate){
      		var firstVal = commonFormulaSvc.multiply(sa,nsapRate);
      		$log.debug("===",firstVal);
      		return commonFormulaSvc.round(commonFormulaSvc.divide(firstVal,1000),0);

      	}
      	function calsSModal(basePremium,modalFact){
      		var firstVal = commonFormulaSvc.multiply(basePremium,modalFact);
      		return commonFormulaSvc.round(firstVal,0);
      	}
      	function calcServiceTax(premium,taxRate){
      		return commonFormulaSvc.round(commonFormulaSvc.multiply(premium,taxRate),0);

      	}
    function calculatesSBI(prodId, channelId, data, totalPrem){
      		var BIVal = {};
			var q = $q.defer();
			var policyYear = commonFormulaSvc.add(parseInt(data.pt),1);
			var factorForDeathBenfitFirstRule =1.05;
			var policyYearArr = [];
			var annualisedPrem = [];
			var premiumPaidTillDate = 0;
			var sBTillDate = 0;
			var deathBenfit =[];
			var sBTillDateArr = [];
			var sv =[];
			var splSv = [];
			var gMaturityBenfit = [];
			var gMaturityAdditions = [];
			var sB = [];
			var sVX=[];
			var sVXVal = 0;
			var sbVal = 0;
			var percent30 = commonFormulaSvc.percentOf(30,data.sumAssured);
			/** mobile web provision **/
	        var reqData;
	        if(!isWeb){
				reqData = $q.all([
				sSDataFromDBSvc.getXFactorForDeathBenifit(prodId, channelId, data.ppt),
				sSDataFromDBSvc.getsSSb(prodId, channelId, data.ppt),
				sSDataFromDBSvc.getsSSv(prodId, channelId, data.ppt),
				sSDataFromDBSvc.getSpecialSvFactor(prodId, channelId, data.pt)
			]);
			}else{
			  /**Provision for webapp code **/
			  /**
				  for web team needs to get promices after webservice call for

			  **/

			  /**return values in array in then function**/
			}
			reqData.then(function(biDbVals){
					var Xfactor = biDbVals[0];
					var sBArr = biDbVals[1];
					var gsVFactor = biDbVals[2];
					var splSvRate = biDbVals[3];
					//var count = 0;
					$log.debug('gsVFactor',gsVFactor);
					$log.debug('splSvRate',splSvRate);
					var factorForDeathBenfitSecondRule = commonFormulaSvc.multiply(parseInt(Xfactor),data.basePremium);


					for (var i = 1; i < policyYear; i++) {
						policyYearArr.push(i);
						if(i<= data.ppt){
							annualisedPrem.push(data.basePremium);
							premiumPaidTillDate = commonFormulaSvc.add(premiumPaidTillDate,data.basePremium);
							$log.debug('premiumPaidTillDate',premiumPaidTillDate);
							sVXVal++;/*This is X factor to calculate sv which will be same afte ppt*/
							sVX.push(sVXVal);
							sBTillDate = commonFormulaSvc.add(sBTillDate,0);
							sBTillDateArr.push(sBTillDate);

						}else {
							annualisedPrem.push(0);
							sVX.push(sVXVal);
							sBTillDate = commonFormulaSvc.add(sBTillDate,sbVal);
								sBTillDateArr.push(sBTillDate);
						}
						$log.debug("========",sBArr[i]);
						if(sBArr[i] === undefined){
							sB.push("-");

						}else{
							sbVal = commonFormulaSvc.round(commonFormulaSvc.multiply(data.sumAssured,sBArr[i][0]),0);
							sB.push(commonFormulaSvc.round(sbVal,0));

						}
						/*SV*/
						var svStep1 = data.basePremium*sVX[i-1]*gsVFactor[i-1];
						var svStep2 = sBTillDateArr[i-1]; $log.debug("===",svStep1+"+++++"+svStep2);
						var svVal = commonFormulaSvc.subtract(svStep1,svStep2);
						sv.push(commonFormulaSvc.round(svVal,0));
						/*Special SV*/
						var splSvstep1 = commonFormulaSvc.multiply(data.sumAssured,splSvRate[i]);
							var splSvstep2 = commonFormulaSvc.divide(splSvstep1,1000);
							splSv.push(commonFormulaSvc.roundUp(splSvstep2,0));

						/** Death Benfit**/
		        		/*Values Needed:
						//1.Premium
		      			//2.Sum Assured
		      			//3. Year:Min of policy year or policy paying term
						//***/
						var premiumDeathBenfitFirstRule =  commonFormulaSvc.round(factorForDeathBenfitFirstRule*premiumPaidTillDate,0);
						$log.debug("benfit",premiumDeathBenfitFirstRule+"----"+data.sumAssured+"----"+factorForDeathBenfitSecondRule);
						deathBenfit.push(Math.max.apply(Math, [premiumDeathBenfitFirstRule, data.sumAssured, factorForDeathBenfitSecondRule]));

						$log.debug("here",i-1);
						if(policyYearArr[i-1] == data.pt){
							gMaturityBenfit.push(data.sumAssured);
							gMaturityAdditions.push(commonFormulaSvc.round(percent30,0));
						}else{gMaturityBenfit.push(0);
						gMaturityAdditions.push(0);}
					}
					 	$log.debug('deathBenfit',deathBenfit);
					 	$log.debug('annualisedPrem',annualisedPrem);
						$log.debug('gMaturityBenfit',gMaturityBenfit);
						$log.debug('sB',sB);
						$log.debug('sBTillDateArr',sBTillDateArr);
						$log.debug('sVX',sVX);
						$log.debug('sv',sv);
					 	$log.debug('splSv',splSv);

					 BIVal.deathBenfit = deathBenfit;
					 BIVal.annualisedPrem = annualisedPrem;
					 BIVal.policyYearArr = policyYearArr;
					 BIVal.sB = sB;
					 BIVal.sv = sv;
					 BIVal.splSv = splSv;
					 BIVal.gMaturityBenfit = gMaturityBenfit;
					 BIVal.gMaturityAdditions = gMaturityAdditions;

					q.resolve(BIVal);
				});
				return q.promise;

      	}
		function sSGetProdCode(prodId, channelId, data){
			$log.debug("======",data);
			var q = $q.defer();
			sSDataFromDBSvc.getBandForSS(prodId,channelId,'PRBAND',true,data.basePremium,parseInt(data.ppt),parseInt(data.laAge)).
			then(function(val){
				var bandName = val;
				var band = bandName.slice(-1);
				$log.debug('bandName',band);
				sSDataFromDBSvc.getsSProductCode(prodId, channelId, parseInt(data.ppt), band)
				.then(function(val){
					$log.debug("+++",val);
					 q.resolve(val);

				});
			});


			return q.promise;
		}
      function calculateSsTotalPremium(prodId, channelId, data){
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
						sSGetProdCode(prodId,channelId,data)
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
					 var nsapRate = basePremiumValues[0];
					 var mpFactor = basePremiumValues[1];
					 var sTax1 = basePremiumValues[2];
					 var sTax2 = basePremiumValues[3];
					 var prodCode = basePremiumValues[4];

					totalBasePremium.prodCode = prodCode;
					totalBasePremium.modalFactor = mpFactor;
				 	totalBasePremium.NSAPPremium = 0;
				 	totalBasePremium.modalNSAPPremium = 0;
				 	if(data.NSAPForLA){
				 		totalBasePremium.NSAPPremium = sS.calsSNSAP(data.sumAssured,nsapRate);
				 		totalBasePremium.modalNSAPPremium = sS.calsSModal(totalBasePremium.NSAPPremium,mpFactor);
				 	}
					totalBasePremium.sumAssured = data.sumAssured;
				 	totalBasePremium.basePremium = data.basePremium;
				 	totalBasePremium.modalPremium = sS.calsSModal(data.basePremium,mpFactor);
				 	totalBasePremium.totalModalPremium = commonFormulaSvc.add(totalBasePremium.modalNSAPPremium,totalBasePremium.modalPremium);
					totalBasePremium.totalAnnualPremium = commonFormulaSvc.add(totalBasePremium.basePremium,totalBasePremium.NSAPPremium);

					totalBasePremium.serviceForFirstYearTax = sS.calcServiceTax(totalBasePremium.totalModalPremium,sTax1);
				 	totalBasePremium.serviceForSecondYearTax = sS.calcServiceTax(totalBasePremium.totalModalPremium,sTax2);

					totalBasePremium.serviceForAnnualFirstYearTax = sS.calcServiceTax(totalBasePremium.totalAnnualPremium,sTax1);
				 	totalBasePremium.serviceForAnnualSecondYearTax = sS.calcServiceTax(totalBasePremium.totalAnnualPremium,sTax2);

					totalBasePremium.totalAnnualPremiumWithTaxForFirstYear = commonFormulaSvc.add(totalBasePremium.totalAnnualPremium,totalBasePremium.serviceForAnnualFirstYearTax);
				 	totalBasePremium.totalAnnualPremiumWithTaxForSecondYsSr =commonFormulaSvc.add(totalBasePremium.totalAnnualPremium,totalBasePremium.serviceForAnnualSecondYearTax);

					totalBasePremium.totalModalPremiumWithTaxForFirstYear = commonFormulaSvc.add(totalBasePremium.totalModalPremium,totalBasePremium.serviceForFirstYearTax);
				 	totalBasePremium.totalModalPremiumWithTaxForSecondYsSr =commonFormulaSvc.add(totalBasePremium.totalModalPremium,totalBasePremium.serviceForSecondYearTax);

					totalBasePremium.bi = sS.calculatesSBI(prodId, channelId, data, totalBasePremium);
				 	$log.debug('totalBasePremium',totalBasePremium);
				 	q.resolve(totalBasePremium);
				});
				return q.promise;

      }


		 }
	]
);
