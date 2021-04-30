/*
* Created By: Anushree K
* Service for Premium Calculation Service here injecting all services
*/
productCalculator.service(
	'sICalculationService',
	[
	'$q',
    '$log',
	'commonFormulaSvc',
    'commonDBFuncSvc',
	'sIDataService',
    'commonPremiumFormulaService',
	'calculateSiBIService',
	'sIValidationService',
	'commonDbProductCalculation',
	'common_const',

function($q, $log, commonFormulaSvc, commonDBFuncSvc, sIDataService, commonPremiumFormulaService,  calculateSiBIService, sIValidationService, commonDbProductCalculation,common_const) {
      'use strict';

      var sIObj = this;
      /**Define All functions Alphabetically**/
      sIObj.calcBasePremium = calcBasePremium;
      sIObj.calcSumAssured = calcSumAssured;
      sIObj.calculateTotalPremium = calculateTotalPremium;
      sIObj.getGuaranteedMonthlyIncome = getGuaranteedMonthlyIncome;
    //TODO:Uncomment the code once all validation from Db done
      /**EOF defination**/

      /**Implementation of functions Starts Here :
         TODO:move this to commonformula service.
      **/
		 	/**
		 		Calculating Base Premium
				Formula = (sumAssured*premiumRate)/1000;
		 	**/
			function calcBasePremium(prodId, channelId, sumAssured, ppt, laAge) {
        		var q = $q.defer();
				var basePremium;
		        var premiumRate = sIDataService.getSIPremiumRate(prodId, channelId, laAge, ppt)
				.then(function(value){
		          $log.debug("value",value);
		          basePremium = commonFormulaSvc.divide(commonFormulaSvc.multiply(sumAssured,value),common_const.factForCalSumOrPrem);
		          q.resolve(basePremium);
		        });
				return q.promise;
      		}

			/**
		 		Calculating Sum Assured
				Formula = (basePremium*1000)/premiumRate;
        TODO:move this to commonformula service.
		 	**/
			function calcSumAssured(prodId, channelId, basePremium, ppt, laAge) {
        		var q = $q.defer();
				var sumAssured;
				  	sIDataService.getSIPremiumRate(prodId, channelId, laAge, ppt)
					.then(function(value){
            		sumAssured = commonFormulaSvc.divide(commonFormulaSvc.multiply(basePremium,common_const.factForCalSumOrPrem),value);
            		q.resolve(sumAssured);
          			});
				return q.promise;

			}

      /****/
	      function getGuaranteedMonthlyIncome(sumAssured, guaranteedMonthlyIncomeFactor) {
	        return commonFormulaSvc.round(commonFormulaSvc.multiply(sumAssured, guaranteedMonthlyIncomeFactor),0);
	      }


      function calculateTotalPremium(prodId, channelId, policyUserData){
            var q = $q.defer();
            $log.debug('policyUserData',policyUserData);
            /**Guranted value Arrays**/
            var gVals = calculateSiBIService.getSiGSV(prodId, channelId, policyUserData.pt, policyUserData.ppt, policyUserData.basePremium, policyUserData.sumAssured, policyUserData.laAge);
             var premiumVal;
			 if(!isWeb){
			  premiumVal = $q.all([
				 commonDbProductCalculation.getNsapRate(prodId, channelId),
				 commonDbProductCalculation.serviceTaxFirstYear(prodId, channelId),
				 commonDbProductCalculation.serviceTaxSecondYear(prodId, channelId),
				 commonDbProductCalculation.getModalPremiumConvertingFactor(prodId, channelId, policyUserData.premiumMode),
				 sIValidationService.getProductCode(prodId, channelId,policyUserData.ppt)
			 	]);
			}else{

			}
              premiumVal.then(function(values) {
               var premium = {
                  extraModalPremiumDueToNSAP:0,
                  extraPremiumDueToNSAP:0,

              };
               var nSAPFactor = values[0];/*commonFormulaSvc.divide(parseFloat(values[0]),1000);*/
               var serviceTaxFactorForFirstYear = values[1];
               var serviceTaxFactorForSecondYearOnwards = values[2];
               var guaranteedMonthlyIncomeFactor = commonFormulaSvc.divide(0.08,12);
               var premiumToModalFactor = values[3];
			   var prodCode = values[4];
			   $log.debug("sIObj",values);
			   		premium.modalFactor = premiumToModalFactor;
					premium.prodCode = prodCode;
                if (policyUserData.NSAPForLA) {
                   premium.extraPremiumDueToNSAP = commonPremiumFormulaService.calculatePremiumDueToNsap(policyUserData.sumAssured,nSAPFactor);
                   premium.extraModalPremiumDueToNSAP = commonPremiumFormulaService.calculateModalPremiumForNSAP(premium.extraPremiumDueToNSAP,premiumToModalFactor);

                 }
				 if(policyUserData.isBP){
					 premium.base = policyUserData.basePremium;
					 calcSumAssured(prodId, channelId, policyUserData.basePremium, policyUserData.ppt, policyUserData.laAge).then(function(sumA){
						 premium.sumAssured = sumA;
					 });
				 }
				 if(policyUserData.isSA){
					 calcBasePremium(prodId, channelId, policyUserData.sumAssured, policyUserData.ppt, policyUserData.laAge).then(function(bP){
						 premium.base = bP;
						  });
					 premium.sumAssured = policyUserData.sumAssured;
				 }


				   premium.totalAnnualPremium = premium.base + premium.extraPremiumDueToNSAP;

				   premium.baseModal = commonPremiumFormulaService.calculateModalPremium(policyUserData.basePremium,premiumToModalFactor);
                   premium.totalModalPremium = premium.baseModal + premium.extraModalPremiumDueToNSAP;

				   premium.serviceTaxForFirstYear = commonPremiumFormulaService.calculateServiceTax(serviceTaxFactorForFirstYear,premium.totalModalPremium);
                   premium.totalModalPremiumWithServiceTaxForFirstYear = commonFormulaSvc.add(premium.totalModalPremium,premium.serviceTaxForFirstYear);
                   premium.serviceTaxForSecondYear = commonPremiumFormulaService.calculateServiceTax(serviceTaxFactorForSecondYearOnwards,premium.totalModalPremium);
                   premium.totalModalPremiumWithServiceTaxForSecondYear = commonFormulaSvc.add(premium.totalModalPremium,premium.serviceTaxForSecondYear);

				   premium.serviceForAnnualFirstYearTax = commonPremiumFormulaService.calculateServiceTax(serviceTaxFactorForFirstYear,premium.totalAnnualPremium);
                   premium.totalAnnualPremiumWithTaxForFirstYear = commonFormulaSvc.add(premium.totalAnnualPremium,premium.serviceTaxForFirstYear);
                   premium.serviceForAnnualSecondYearTax = commonPremiumFormulaService.calculateServiceTax(serviceTaxFactorForSecondYearOnwards,premium.totalAnnualPremium);
                   premium.totalAnnualPremiumWithTaxForSecondYear = commonFormulaSvc.add(premium.totalAnnualPremium,premium.serviceTaxForSecondYear);


				   premium.GuaranteedMonthlyIncome = sIObj.getGuaranteedMonthlyIncome(policyUserData.sumAssured,guaranteedMonthlyIncomeFactor);
                   premium.BIVal = calculateSiBIService.getBIvalues(prodId, channelId, policyUserData);
                   premium.gVals = gVals;
                   q.resolve(premium);
                  });
                return q.promise;
           }




      /**EOF defination**/




 }]);
productCalculator.service('calculateSiBIService',
[
 '$q',
 '$log',
 'commonDBFuncSvc',
 'commonFormulaSvc',
 'sIDataService',
'common_const',
    function(
              $q,
              $log,
              commonDBFuncSvc,
              commonFormulaSvc,
              sIDataService,
			  common_const
              ) {
				  	'use strict';
  		  			var calculateBISvcObj = this;
					  /*Define functions*/
					  calculateBISvcObj.getBIvalues = getBIvalues;
					  calculateBISvcObj.getSiGSV = getSiGSV;
					  /*EOF Define functions*/

		   /*Implementation of functions*/
		  function getBIvalues(prodId, channelId, policyUserData){
		      var BIVal = {};
		      var q = $q.defer();
		      var BIValuesThenFn = function(value){
		          $log.debug('resolved ', value);
		          return value;
		        };
		      var endOfPolicyYear = [];
		      var premiumPaid = [];
		      var deathBenifit = [];
		      var gSumAssured=[];
		      var gSumAdditions=[];
		      var guranteedValues = [];
		      var cumalativePremiumPaid = 0;
		      var cumalativeSVPaid = 0;
		      var premiumDeathBenfitFirstRule =  0;
		      var premiumDeathBenfitSecondRule =0;
		      var lastTerm = parseInt(policyUserData.pt)-1;
			  var premiumVal;
			  	if(!isWeb){
		      premiumVal = $q.all([
		              sIDataService.getfactorForDeathBenfitSecondRule(prodId, channelId, policyUserData.pt),
		              sIDataService.factorForDeathBenfitFirstRule,
		              sIDataService.getGurrantedAdditionFactor(prodId, channelId, policyUserData.pt)
				  ]);
				  }else{
					  /*web data*/
				  }
		             premiumVal .then(function(values) {
		                calculateBISvcObj.factorForDeathBenfitSecondRule = values[0];
		                calculateBISvcObj.factorForDeathBenfitFirstRule = values[1];
		                calculateBISvcObj.gAFact = values[2];
		                for (var i = 0, len = parseInt(policyUserData.pt); i !== len; i++) {
		                /*Death benfit secon rule*/
		                premiumDeathBenfitSecondRule = commonFormulaSvc.multiply(calculateBISvcObj.factorForDeathBenfitSecondRule,policyUserData.basePremium);
		                endOfPolicyYear.push(i+1);
		                if(i< policyUserData.ppt){

		                  premiumPaid.push(commonFormulaSvc.round(policyUserData.basePremium,0));
		                  cumalativePremiumPaid = policyUserData.basePremium + cumalativePremiumPaid;
		                  premiumDeathBenfitFirstRule =  commonFormulaSvc.multiply(calculateBISvcObj.factorForDeathBenfitFirstRule,cumalativePremiumPaid);
		                  deathBenifit.push(commonFormulaSvc.maxValue(premiumDeathBenfitFirstRule,premiumDeathBenfitSecondRule));
		                }else{
		                  premiumPaid.push(0);
		                  deathBenifit.push(commonFormulaSvc.maxValue(premiumDeathBenfitFirstRule,premiumDeathBenfitSecondRule));
		                }
		                $log.debug('parseInt(policyUserData.pt)',lastTerm);
		                if(i == lastTerm){
		                  gSumAdditions.push(commonFormulaSvc.round(commonFormulaSvc.multiply(policyUserData.sumAssured,calculateBISvcObj.gAFact),0));
		                  gSumAssured.push(commonFormulaSvc.round(policyUserData.sumAssured,0));
		                }else{
		                  gSumAdditions.push(0);
		                  gSumAssured.push(0);
		                }

		           }/*EOF for loop*/
		              BIVal.premiumPaid = premiumPaid;
		              BIVal.endOfPolicyYear = endOfPolicyYear;
		              BIVal.deathBenifit = deathBenifit;
		              BIVal.gSumAdditions = gSumAdditions;
		              BIVal.gSumAssured = gSumAssured;
		              q.resolve(BIVal);

		            /*$log.debug('premiumPaid ', premiumPaid);
		            //$log.debug('endOfPolicyYear ', endOfPolicyYear);
		            //$log.debug('deathBenifit ', deathBenifit);
		            //$log.debug('gSumAdditions ', gSumAdditions);
		            //$log.debug('gSumAssured ', gSumAssured);*/
		       });
		        return q.promise;
		      }

		      function getSiGSV(prodId, channelId, pt, ppt, basePremium, sumAssured, laAge){
		       var q = $q.defer();
		       var cumalativePremiumPaid = 0;
		       var cumalativeSvVal = 0;
		       var gSurvivalBenifit = [];
		       var gSurrenderValue = [];
		       var gSpclSV =[];
		       var guranteedValues = [];
		       var factForgSplSv = commonFormulaSvc.divide(sumAssured,common_const.factForCalSumOrPrem);
		       $log.debug('factForgSplSv',factForgSplSv);
			   var premiumVal;
			   if(!isWeb){
		       		premiumVal = $q.all([
		              (sIDataService.getSiDataForGSV(prodId, channelId, pt)),
		              (sIDataService.getRateForSplSV(prodId, channelId, ppt, laAge)),
		              (sIDataService.getGSurvivalBenfitFactor(prodId, channelId))
				  ]);
			  }
		              premiumVal.then(function(values) {
		                var factGsv = values[0];
		                var splSV = values[1];
		                var gSbFact = values[2];
		                var gSurvivalBenifitValue = commonFormulaSvc.multiply(sumAssured,gSbFact);

		                 for(var i = 0, len = parseInt(pt);  i !== len; i++){
		                  if(i< ppt){
		                    gSurvivalBenifit.push(0);
		                    cumalativeSvVal = 0 + cumalativeSvVal;
		                    cumalativePremiumPaid = basePremium + cumalativePremiumPaid;
		                    gSurrenderValue.push(commonFormulaSvc.round(cumalativePremiumPaid*factGsv[i]-cumalativeSvVal,0));
												$log.debug("Special Surrender Value",commonFormulaSvc.subtract(commonFormulaSvc.multiply(splSV[i],factForgSplSv),0));
		                    gSpclSV.push(commonFormulaSvc.round(commonFormulaSvc.subtract(commonFormulaSvc.multiply(splSV[i],factForgSplSv),0),0));

		                  }else{
		                    gSurvivalBenifit.push(commonFormulaSvc.round(gSurvivalBenifitValue,0));
		                    cumalativeSvVal = gSurvivalBenifitValue + cumalativeSvVal;
		                    gSurrenderValue.push(commonFormulaSvc.round(cumalativePremiumPaid*factGsv[i]-cumalativeSvVal,0));
												$log.debug("Special Surrender Value",commonFormulaSvc.subtract(commonFormulaSvc.multiply(splSV[i],factForgSplSv),gSurvivalBenifitValue));
		                    gSpclSV.push(commonFormulaSvc.round(commonFormulaSvc.subtract(commonFormulaSvc.multiply(splSV[i],factForgSplSv),gSurvivalBenifitValue),0));
		                  }

		                 }
		                guranteedValues.gsb = gSurvivalBenifit;
		                guranteedValues.gsv = gSurrenderValue;
		                guranteedValues.gSpclSV = gSpclSV;
		                q.resolve(guranteedValues);

		          });
		        return q.promise;
		      }

   }]);
