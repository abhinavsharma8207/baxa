/*
service for premium Calculation here injecting all services
*/
productCalculator.service(
	'samriddhiCalculationSvc',
	[
	    '$q',
	    '$log',
		'commonFormulaSvc',
	    'samriddhiDataFromDBSvc',
		'samruddhiStaticDataSvc',
		'commonDbProductCalculation',
		function($q, $log, commonFormulaSvc, samriddhiDataFromDBSvc, samruddhiStaticDataSvc, commonDbProductCalculation) {
			 'use strict';
			  var samriddhiCalc = this;
			  samriddhiCalc.calcBasePremium = calcBasePremium;
		      samriddhiCalc.calcSumAssured = calcSumAssured;
		      samriddhiCalc.calcNsapPremium = calcNsapPremium;
		      samriddhiCalc.calcModalPremium = calcModalPremium;
		      samriddhiCalc.calcModalNsapPremium = calcModalNsapPremium;
		      samriddhiCalc.calcTotalModalPremium = calcTotalModalPremium;
		      samriddhiCalc.calcServiceTaxFirstYear = calcServiceTaxFirstYear;
		      samriddhiCalc.calcServiceTaxSecondYearOnwards = calcServiceTaxSecondYearOnwards;
		      samriddhiCalc.calcTotalPremiumFirstYear = calcTotalPremiumFirstYear;
		      samriddhiCalc.calcTotalPremiumSecondYearOnwards = calcTotalPremiumSecondYearOnwards;
		      samriddhiCalc.calculatePremium = calculatePremium;
		      samriddhiCalc.endOfPolicyYear = endOfPolicyYear;
		      samriddhiCalc.annualPremium = annualPremium;
		      samriddhiCalc.GuaranteedDeathBenefit = GuaranteedDeathBenefit;
		      samriddhiCalc.GuaranteedMaturityBenefit = GuaranteedMaturityBenefit;
		      samriddhiCalc.GuaranteedSurrenderValue = GuaranteedSurrenderValue;
		      samriddhiCalc.NonGuaranteedDeathBenefitFourPer = NonGuaranteedDeathBenefitFourPer;
		      samriddhiCalc.NonGuaranteedMaturityBenefitFourPer = NonGuaranteedMaturityBenefitFourPer;
		      samriddhiCalc.NonGuaranteedSurrenderValueFourPer = NonGuaranteedSurrenderValueFourPer;
		      samriddhiCalc.NonGuaranteedDeathBenefitEightPer = NonGuaranteedDeathBenefitEightPer;
		      samriddhiCalc.NonGuaranteedMaturityBenefitEightPer = NonGuaranteedMaturityBenefitEightPer;
		      samriddhiCalc.NonGuaranteedSurrenderValueEightPer = NonGuaranteedSurrenderValueEightPer;
		      samriddhiCalc.calculateNonGuaranteedBenefitEightPer = calculateNonGuaranteedBenefitEightPer;
		      samriddhiCalc.generateSamriddhiBI = generateSamriddhiBI;

		 	/**
		 		Calculating Base Premium
				Formula = (sumAssured*premiumRate)/1000;
		 	**/
			function calcBasePremium(data, premiumRate) {
				var basePremium;
				if(data.sumAssured > 0) {
            		basePremium = commonFormulaSvc.round(commonFormulaSvc.divide(commonFormulaSvc.multiply(data.sumAssured,premiumRate),1000),0);
	           	} else {
					basePremium = data.basePremium;
				}
				return basePremium;
      		}

			/**
		 		Calculating Sum Assured
				Formula = (basePremium*1000)/premiumRate;
		 	**/
			function calcSumAssured(data, premiumRate) {
        		var sumAssured;
				if(data.basePremium > 0) {
					sumAssured = commonFormulaSvc.round(commonFormulaSvc.divide(commonFormulaSvc.multiply(data.basePremium,1000),premiumRate),0);
            	} else {
					sumAssured = data.sumAssured;
	          	}
				return sumAssured;
			}

		    /**
		 		Calculating NSAP Premium
				Formula = sumAssured * NSAP rate/1000;
		 	**/
			function calcNsapPremium (nsapPremRate, sumAssured,data) {
				var nsapPremiumValues = {};
        		var nsapPremium = 0;
				nsapPremRate = commonFormulaSvc.multiply(nsapPremRate,0.001);
				if(data.NSAPForLA == true) {
          			nsapPremium = commonFormulaSvc.round(commonFormulaSvc.multiply(sumAssured,nsapPremRate),0);
          			$log.debug('nsapPremium',nsapPremium);
	          	}
        		return  nsapPremium;
			}

           /**
		 		Calculating Modal Premium
				Formula = Base Premium * Modal Factor;
		 	**/
      		function calcModalPremium (modalFactor, basePremium){
         	var modalPremium = commonFormulaSvc.round(basePremium*modalFactor,0);
              $log.debug('modalPremium',modalPremium);
              return modalPremium;

        	}

           /**
		 		Calculating Modal NSAP  Premium
				Modal NSAP Premium= NSAP premium * Modal Factor
		 	**/
	        function calcModalNsapPremium(modalFactor, nsapPremium){
	           	var modalNsapPremium = commonFormulaSvc.round(modalFactor*nsapPremium,0);
           		return modalNsapPremium;

           }

           /**
		 		Calculating Total Modal Premium
				Formula = Modal Premium + NSAP Extra premium Round the premium. Without decimal.
		 	**/
	        function calcTotalModalPremium (modalPremium, modalNsapPremium,data){
	        	var totalModalPremium;
	        	if(data.NSAPForLA == true) {
	                totalModalPremium = commonFormulaSvc.round(modalPremium + modalNsapPremium,0);
	                $log.debug('totalModalPremium',totalModalPremium);
	           	} else {
	                totalModalPremium = modalPremium;
	           	}
           		return totalModalPremium;

          	}


           /*
            Calculating Service tax for 1st year
            Formula Service tax for 1st year = Premium Payable  ( including NSAP)* Service tax
           */
           function calcServiceTaxFirstYear(serviceTaxFactorForFirstYear, totalModalPremium){
				 return commonFormulaSvc.round(serviceTaxFactorForFirstYear*totalModalPremium,0);
            }

            /*
            Calculating Service tax for 1st year
            Formula Service tax for 2nd year onwards = Premium Payable  ( including NSAP)* Service tax
           */
           function calcServiceTaxSecondYearOnwards(serviceTaxFactorFor2Year, totalModalPremium){
              return commonFormulaSvc.round(serviceTaxFactorFor2Year*totalModalPremium,0);
            }

            /*
            Calculating Total Premium payable in 1st year
            Formula Total Premium payable in 1st year = Premium payable+ service tax for 1st year
           */
           function calcTotalPremiumFirstYear(totalModalPremium, serviceTaxFirstYear){
				      return commonFormulaSvc.round(totalModalPremium + serviceTaxFirstYear,0);
            }

            /*
            Calculating Total Premium payable in 2nd year
            Formula Total Premium payable in 2nd year = Premium payable+ service tax for 2nd year
           */
           function calcTotalPremiumSecondYearOnwards(totalModalPremium, serviceTaxSecondYear){
				      return commonFormulaSvc.round(totalModalPremium + serviceTaxSecondYear,0);
            }


           function calculatePremium(prodId, channelId, data){
	           		var premium = {};
              		var q = $q.defer();
					/** mobile web provision **/
					var reqData;
					if(!isWeb){
						reqData= $q.all([
			                samriddhiDataFromDBSvc.getPremiumRate(prodId, channelId, data.laAge, data.laGender, data.ppt),
			                commonDbProductCalculation.getNsapRate(prodId, channelId),
			                commonDbProductCalculation.getModalPremiumConvertingFactor(prodId, channelId, data.premiumMode),
			                commonDbProductCalculation.serviceTaxFirstYear(prodId, channelId),
			                commonDbProductCalculation.serviceTaxSecondYear(prodId, channelId),
							samriddhiDataFromDBSvc.getProductCode(prodId, channelId, data.ppt)
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
						var premiumRate = values[0];
						var nSAPFactor = values[1];
						var modalFact = values[2];
						var stax1 = values[3];
						var stax2 = values[4];
						var prodCode = values[5];
						premium.modalFact = modalFact;
						premium.prodCode = prodCode;

		                premium.basePremium = calcBasePremium(data,premiumRate);
		                premium.sumAssured = calcSumAssured(data,premiumRate);
		                premium.nsapPremium  = calcNsapPremium(nSAPFactor,premium.sumAssured,data);
		                premium.modalPremium = calcModalPremium(modalFact,premium.basePremium);
		                premium.modalNsapPremium = calcModalNsapPremium(modalFact,premium.nsapPremium);
		                premium.totalModalPremium = calcTotalModalPremium(premium.modalPremium,premium.modalNsapPremium,data);
						premium.totalAnnualPremium = calcTotalModalPremium(premium.basePremium,premium.nsapPremium,data);

						premium.serviceTaxFactorForFirstYear = calcServiceTaxFirstYear(stax1,premium.totalModalPremium);
		                premium.serviceTaxFactorForSecondYear = calcServiceTaxSecondYearOnwards(stax2,premium.totalModalPremium);

						premium.serviceForAnnualFirstYearTax = calcServiceTaxFirstYear(stax1,premium.totalAnnualPremium);
		                premium.serviceForAnnualSecondYearTax = calcServiceTaxSecondYearOnwards(stax2,premium.totalAnnualPremium);

						premium.totalAnnualPremiumWithTaxForFirstYear = calcTotalPremiumFirstYear(premium.totalAnnualPremium,premium.serviceForAnnualFirstYearTax);
		                premium.totalAnnualPremiumWithTaxForSecondYear = calcTotalPremiumSecondYearOnwards(premium.totalAnnualPremium,premium.serviceForAnnualSecondYearTax);

						premium.totalPremiumFirstYear = calcTotalPremiumFirstYear(premium.totalModalPremium,premium.serviceTaxFactorForFirstYear);
		                premium.totalPremiumSecondYearOnwards = calcTotalPremiumSecondYearOnwards(premium.totalModalPremium,premium.serviceTaxFactorForSecondYear);
		                q.resolve(premium);

              		});

                return q.promise;

           }



           function endOfPolicyYear(policyTerm) {
           		var policyYear = [];
              	for(var i = 1;i <= policyTerm; i++){
                  policyYear.push(i);
                }
                return policyYear;

           	}


           function annualPremium(policyTerm,basePremium,ppt) {
           		var annualPremium = [];
           		for(var i =1;i <= policyTerm; i++){
	                if(i<=ppt) {
	           			annualPremium.push(basePremium);
	                } else {
	                  annualPremium.push(0);
	                }
           		}
           		return annualPremium;
           }

           /*
			       Calculating GuaranteedDeathBenefit
           */

           function GuaranteedDeathBenefit(policyTerm,basePremium,premiumMode,sumAssured) {
           		/*
				 1st Rule - 105% * Sum of Premiums paid till date/premium mode (Mode = 12 in this example)
           		*/
           		var ruleFirst = function (year) {
           			return commonFormulaSvc.divide(commonFormulaSvc.multiplyArray([samriddhiDataFromDBSvc.guaranteedDeathBenefitFactor,year,basePremium]),premiumMode);
           		};
           		// Sum Assured
           		var ruleSecond = function (sumAssured) {
           			return sumAssured;
           		};
           		// Premium*11
           		var ruleThird = function (basePremium) {
           			return basePremium*11;
           		};
           		// Maximum of rule 1,2,3
	       		var totalGuaranteedDeathBenefit = function() {
	       			var guaranteedBenefit = [];
	       		 	for(var i = 1;i <= policyTerm; i++){
	       		 		guaranteedBenefit.push(Math.max(ruleFirst(i),ruleSecond(sumAssured),ruleThird(basePremium)));
	       		 	}

	       		 	return guaranteedBenefit;

	       		};
           		return totalGuaranteedDeathBenefit();

           }
           /*
				Shown in BI for only in the last policy yea
				Maturity Benefit = Sum Assured
           */

           function GuaranteedMaturityBenefit (policyTerm,sumAssured) {
	           	var totalGuaranteedMaturityBenefit = function() {
		       			var guaranteedMaturityBenefit = [];
		       		 	for(var i = 1;i <= policyTerm; i++){
		       		 		if(i == policyTerm){
		       		 			guaranteedMaturityBenefit.push(sumAssured);
		       		 		}else {
		       		 			guaranteedMaturityBenefit.push(0);
		       		 		}
		       		 	}

		       		 	return guaranteedMaturityBenefit;

		       	};
           	return totalGuaranteedMaturityBenefit();


           }

           // Surrender Value = Sum of Premium Paid till date * Surrender Rate

           function GuaranteedSurrenderValue(surrenderRate,policyTerm,basePremium) {

         			var surrenderValue = [];

                for(var i = 0;i < policyTerm; i++){
                  surrenderValue.push(commonFormulaSvc.round(commonFormulaSvc.multiplyArray([basePremium,i+1,surrenderRate[i]]),0));
                }
                return surrenderValue;
           }


           /*
			Calculate Non Guaranteed Benefit 4 percent
			Formula = ((Guaranteed Death Benefit + Revisionary Bonus Rate @4% * SA * End of Policy Year) * (1 + Terminal Bonus Rate @ 4%))
           */
           function NonGuaranteedDeathBenefitFourPer(policyTerm, sumAssured, revBonusRate4Per, guaranteedDeathBenefit, terBonusRate4Per) {
           		var totalNonGuaranteedDeathBenefit4Per = [];
           		var revisionaryBonusRateFourPer = revBonusRate4Per;
           		//var guaranteedDeathBenefit = this.GuaranteedDeathBenefit(data);
           		var terminalBonusRateFourPer = terBonusRate4Per[4];
           		//var sumAssured = this.calcSumAssured(data);

           		for(var i = 1;i <= policyTerm; i++){
           			var result = (guaranteedDeathBenefit[i-1] + revisionaryBonusRateFourPer * sumAssured * i * (1 + 0.1));
		       		totalNonGuaranteedDeathBenefit4Per.push(commonFormulaSvc.roundDown(result,0));
		       	}
		       	return totalNonGuaranteedDeathBenefit4Per;
           }

           /*
           Formula = Revisionary Bonus Rate @ 4%*SA*Policy Term + SA + Revisionary Bonus Rate @ 4% * SA * Policy Term * Terminal Bonus Rate @ 4%
		   ( Policy Term is 20 in this example)
		   Calculated for only last policy year
           */
           function NonGuaranteedMaturityBenefitFourPer(policyTerm,revBonusRate4Per,terBonusRate4Per,sumAssured) {
           	var nonGuaranteedMaturityBenefitFourPer = [];
           		var revisionaryBonusRateFourPer = revBonusRate4Per;
           		var terminalBonusRateFourPer = terBonusRate4Per[4];

           		for(var i = 1;i <= policyTerm; i++){

             		if(i == policyTerm) {
             				var result = revisionaryBonusRateFourPer * sumAssured * policyTerm + sumAssured + revisionaryBonusRateFourPer * sumAssured * policyTerm * terminalBonusRateFourPer;
  		       			nonGuaranteedMaturityBenefitFourPer.push(commonFormulaSvc.roundDown(result,0));
  		       		}else{
  		       			nonGuaranteedMaturityBenefitFourPer.push(0);
  		       		}
		       	  }

		       	return nonGuaranteedMaturityBenefitFourPer;

           }

           /*
			Formula = (Surrender Rate * SA/1000)+ (Bonus Surrender Rate * Revisionary Bonus Rate @ 4% * (End of Policy Year - 1) * SA/1000)
           */
           function NonGuaranteedSurrenderValueFourPer(policyTerm,revBonusRate4Per,terBonusRate4Per,surrenderRate,bonusSurrenderRate,sumAssured) {
           	var nonGuaranteedSurrenderValue = [];
           	var revisionaryBonusRateFourPer = revBonusRate4Per;
           	var sumAssuredCal = commonFormulaSvc.divide(sumAssured,1000);
           	for(var i = 1;i <= policyTerm; i++){
           		var surrenderValue = (surrenderRate[i-1] * sumAssuredCal) + (bonusSurrenderRate[i-1] * revisionaryBonusRateFourPer * (i - 1) * sumAssuredCal);
		       	    nonGuaranteedSurrenderValue.push(commonFormulaSvc.roundDown(surrenderValue,0));
		        }

		    return nonGuaranteedSurrenderValue;

           }


           /*
			Calculate Non Guaranteed Death Benefit 8 percent
			Formula = ((Guaranteed Death Benefit + Revisionary Bonus Rate @8% * SA * End of Policy Year) * (1 + Terminal Bonus Rate @ 8%))
           */
           function NonGuaranteedDeathBenefitEightPer(policyTerm, sumAssured, revBonusRate8Per, guaranteedDeathBenefit, terBonusRate8Per) {
           		var totalNonGuaranteedDeathBenefitEightPer = [];
              var revisionaryBonusRateEightPer = revBonusRate8Per;
              var terminalBonusRateEightPer = terBonusRate8Per[8];

              for(var i = 1;i <= policyTerm; i++){
                var result = (guaranteedDeathBenefit[i-1] + revisionaryBonusRateEightPer * sumAssured * i * (1+0.1));
                totalNonGuaranteedDeathBenefitEightPer.push(commonFormulaSvc.roundDown(result,0));
              }
		       	return totalNonGuaranteedDeathBenefitEightPer;
           }

           /*
           Calculating Non-Guaranteed Maturity Benefit @ 8%
           Formula = Revisionary Bonus Rate @ 8%*SA*Policy Term + SA + Revisionary Bonus Rate @ 8% * SA * Policy Term * Terminal Bonus Rate @ 8%
		   ( Policy Term is 20 in this example)
			Calculated for only last policy year
           */
           function NonGuaranteedMaturityBenefitEightPer(policyTerm,revBonusRate8Per,terBonusRate8Per,sumAssured) {
           	  var nonGuaranteedMaturityBenefitEightPer = [];
              var revisionaryBonusRateEightPer = revBonusRate8Per;
              var terminalBonusRateEightPer = terBonusRate8Per[8];

              for(var i = 1;i <= policyTerm; i++){

                if(i == policyTerm) {
                  var result = revisionaryBonusRateEightPer * sumAssured * policyTerm + sumAssured + revisionaryBonusRateEightPer * sumAssured * policyTerm * terminalBonusRateEightPer;
                  nonGuaranteedMaturityBenefitEightPer.push(commonFormulaSvc.roundDown(result,0));
                }else{
                  nonGuaranteedMaturityBenefitEightPer.push(0);
                }
              }
		       	return nonGuaranteedMaturityBenefitEightPer;

           }

           /*
			Formula = (Surrender Rate * SA/1000)+ (Bonus Surrender Rate * Revisionary Bonus Rate @ 8% * (End of Policy Year - 1) * SA/1000)
           */
           function NonGuaranteedSurrenderValueEightPer(policyTerm,revBonusRate8Per,terBonusRate8Per,surrenderRate,bonusSurrenderRate,sumAssured) {
           	var nonGuaranteedSurrenderValue = [];

            var revisionaryBonusRateEightPer = revBonusRate8Per;
            var sumAssuredCal = commonFormulaSvc.divide(sumAssured,1000);
            for(var i = 1;i <= policyTerm; i++){
              var surrenderValue = (surrenderRate[i-1] * sumAssuredCal) + (bonusSurrenderRate[i-1] * revisionaryBonusRateEightPer * (i - 1) * sumAssuredCal);
                nonGuaranteedSurrenderValue.push(commonFormulaSvc.round(surrenderValue,0));
            }
		          return nonGuaranteedSurrenderValue;
           }


           /*
			Non Guaranteed Benefit@8%

           */

           function calculateNonGuaranteedBenefitEightPer(data) {
           		var nonguaranteedBenefitEightPer = {};
           		nonguaranteedBenefitEightPer.deathBenefitEightPer = samriddhiBI.NonGuaranteedDeathBenefitEightPer(data);
           		nonguaranteedBenefitEightPer.maturityBenefit = samriddhiBI.NonGuaranteedMaturityBenefitEightPer(data);
           		nonguaranteedBenefitEightPer.surrenderValue = samriddhiBI.NonGuaranteedSurrenderValueEightPer(data);

           		return nonguaranteedBenefitEightPer;
           }

           function generateSamriddhiBI(prodId, channelId, data, basePremium, sumAssured){
              var q = $q.defer();
              var samriddhiBI = {};
			  /** mobile web provision **/
			  var reqData;
			  if(!isWeb){
			      reqData = $q.all([
	                  samriddhiDataFromDBSvc.getPolicyTerm(prodId, channelId, data.ppt),
	                  samriddhiDataFromDBSvc.getSurrenderValue(prodId, channelId, data.ppt),
	                  samriddhiDataFromDBSvc.getRevisionaryBonusRateFourPer(prodId, channelId, data.ppt),
	                  samriddhiDataFromDBSvc.getTerminalBonusRate(prodId, channelId),
	                  samriddhiDataFromDBSvc.getSurrenderRate(prodId, channelId, data.laAge, data.ppt),/*TODO Return from frront end SurrenderRateTableCol*/
	                  samriddhiDataFromDBSvc.getBonusSurrenderRate(prodId, channelId, data.laAge, data.ppt),/*TODO Return from frrontgetBonusSurrenderRate*/
	                  samriddhiDataFromDBSvc.getRevisionaryBonusRateEightPer(prodId, channelId, data.ppt)
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
                    $log.debug('bi',values);
                    samriddhiBI.policyYear = endOfPolicyYear(values[0]);
                    samriddhiBI.annualPremium = annualPremium(values[0],basePremium,data.ppt);
                    samriddhiBI.guaranteedDeathBenefit = GuaranteedDeathBenefit(values[0],basePremium,data.premiumMode,sumAssured);
                    samriddhiBI.guaranteedMaturityBenefit = GuaranteedMaturityBenefit(values[0],sumAssured);
                    samriddhiBI.guaranteedSurrenderValue = GuaranteedSurrenderValue(values[1],values[0],basePremium);

                    samriddhiBI.nonguaranteedDeathBenefit4Per = NonGuaranteedDeathBenefitFourPer(values[0],sumAssured,values[2],samriddhiBI.guaranteedDeathBenefit,values[3]);//policyTerm, sumAssured, revBonusRate4Per, guaranteedDeathBenefit, terBonusRate4Per
                    samriddhiBI.nonguaranteedMaturityBenefit4Per = NonGuaranteedMaturityBenefitFourPer(values[0],values[2],values[3],parseInt(sumAssured));//policyTerm,revBonusRate4Per,terBonusRate4Per,sumAssured
                    samriddhiBI.nonguaranteedSurrenderValue4Per = NonGuaranteedSurrenderValueFourPer(values[0],values[2],values[3],values[4],values[5],sumAssured);//policyTerm,revBonusRate4Per,terBonusRate4Per,surrenderRate,sumAssured

                    samriddhiBI.nonguaranteedDeathBenefit8Per = NonGuaranteedDeathBenefitEightPer(values[0],sumAssured,values[6],samriddhiBI.guaranteedDeathBenefit,values[3]);
                    samriddhiBI.nonguaranteedMaturityBenefit8Per = NonGuaranteedMaturityBenefitEightPer(values[0],values[6],values[3],parseInt(sumAssured));
                    samriddhiBI.nonguaranteedSurrenderValue8Per = NonGuaranteedSurrenderValueEightPer(values[0],values[6],values[3],values[4],values[5],sumAssured);

                    q.resolve(samriddhiBI);
                    $log.debug('BI',samriddhiBI);
                  }
                );
                    return q.promise;
           }




 }]);
