/*
* Created By: Anushree K
* Service for Premium Calculation Service here injecting all services
*/
productCalculator.service(
	'fICalculationService',
	[
		'$q',
	    '$log',
		'commonFormulaSvc',
	    'commonDBFuncSvc',
		'fIDataService',
	    'commonPremiumFormulaService',
	    'calculateFiBIService',
		'commonDbProductCalculation',
			function($q, $log, commonFormulaSvc, commonDBFuncSvc, fIDataService, commonPremiumFormulaService, calculateFiBIService, commonDbProductCalculation) {
      			'use strict';

		      	var fIObj = this;
		      	/**Define All functions Alphabetically**/
		      	fIObj.calcfISumAssured = calcfISumAssured;
		      	fIObj.calcfIBasePremium = calcfIBasePremium;
		      	fIObj.calculateTotalPremium = calculateTotalPremium;

		      /**EOF defination**/

    		/**Implementation of functions Starts Here :
         		TODO:move this to commonformula service.
      		**/
		 	/**
		 		Calculating Base Premium
				Formula = (sumAssured/premiumRate)
		 	**/
			function calcfIBasePremium(prodId, channelId, sumAssured, ppt) {
        		var q = $q.defer();
				var basePremium;
				/** mobile web provision **/
				var reqData;
				if(!isWeb){
				    reqData = fIDataService.getFiPremiumRate(prodId, channelId, ppt);
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
				          $log.debug("value", value);
				          basePremium = commonFormulaSvc.round(commonFormulaSvc.divide(sumAssured, value),0);
				          q.resolve(basePremium);
			        });
					return q.promise;
      			}

			/**
		 		Calculating Sum Assured
				Formula = (sumAssured*premiumRate)

		 	**/
			function calcfISumAssured(prodId, channelId, basePremium, ppt) {
        		var q = $q.defer();
				/** mobile web provision **/
				var reqData;
				if(!isWeb){
				    reqData = fIDataService.getFiPremiumRate(prodId, channelId, ppt);

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
				var sumAssured;
				  reqData.then(function(value){
			            sumAssured = commonFormulaSvc.round(commonFormulaSvc.multiply(basePremium,value),0);
			            q.resolve(sumAssured);
		          });
					return q.promise;

				}

			      /**
			      Calualtion of modal,base premium
			      **/


		    function calculateTotalPremium(prodId, channelId, policyUserData){
		            var q = $q.defer();
		            $log.debug('policyUserData',policyUserData);
					/** mobile web provision **/
					var reqData;
					if(!isWeb){
					    reqData = $q.all([
							commonDbProductCalculation.getNsapRate(prodId, channelId),
		 					commonDbProductCalculation.getModalPremiumConvertingFactor(prodId, channelId, policyUserData.premiumMode),
							fIDataService.getProdCodeFI(prodId, channelId, policyUserData.basePremium, policyUserData.ppt)
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
		               var premium ={
		                  extraModalPremiumDueToNSAP:0,
		                  extraPremiumDueToNSAP:0,

		              };
		                var nSAPFactor = values[0]/1000;
		                var premiumToModalFactor = 1/values[1];
						var prodCode = values[2];
						premium.ModalFactor = premiumToModalFactor;
						premium.prodCode = prodCode;
						$log.debug("<<<>>>",values[2]);
		                premium.baseModal = commonPremiumFormulaService.calculateModalPremium(policyUserData.basePremium,premiumToModalFactor);
		                 if (policyUserData.NSAPForLA) {
		                    premium.extraPremiumDueToNSAP = commonPremiumFormulaService.calculatePremiumDueToNsap(policyUserData.sumAssured,nSAPFactor);
		                    premium.extraModalPremiumDueToNSAP = commonPremiumFormulaService.calculateModalPremiumForNSAP(premium.extraPremiumDueToNSAP,premiumToModalFactor);
		                    }
		                    premium.base = policyUserData.basePremium;
							premium.totalAnnualPremium = premium.baseModal+premium.extraPremiumDueToNSAP;
		                    premium.totalModalPremium = premium.baseModal+premium.extraModalPremiumDueToNSAP;
		                    premium.BIVal = calculateFiBIService.calculateBi(prodId, channelId, policyUserData,premium.baseModal);

		                    q.resolve(premium);
		                  });
		                return q.promise;
		           }




      /**EOF defination**/




 }]);

productCalculator.service('calculateFiBIService',
[
 '$q',
 '$log',
 'commonDBFuncSvc',
 'commonFormulaSvc',
 'commonDbProductCalculation',
 'fIDataService',

    function(
              $q,
              $log,
              commonDBFuncSvc,
              commonFormulaSvc,
			  commonDbProductCalculation,
              fIDataService
              ) {
      'use strict';
      var calculateBISvcObj = this;


      calculateBISvcObj.months = 120;

      /*Define functions*/
      calculateBISvcObj.getFiBIvalues = getFiBIvalues;
      calculateBISvcObj.getCalculatedFMCCharge = getCalculatedFMCCharge;
	  calculateBISvcObj.calculateBi = calculateBi;

      /*EOF Define functions*/

   /*Implementation of functions*/
   function getCalculatedFMCCharge(allFund){
     var fMCCharge = 0;
     angular.forEach(allFund, function(value, key) {
      angular.forEach(value, function(v, k) {
        fMCCharge =fMCCharge + commonFormulaSvc.multiply(k,commonFormulaSvc.divide(v,100));
       /* $log.debug('fMCCharge',commonFormulaSvc.divide(v,100)+"==="+k+"==="+fMCCharge);*/
        });
    });

    return fMCCharge;
   }

   function calculateBi(prodId, channelId, policyUserData, modalPremium){
           var q = $q.defer();
          /*Show OutPut*/
          var oPolicyYear = [];
          var oAnnulisedPrem = [];
          var oPremAllocationCharges = [];/*Always 0*/
          var oAmntAvailableForInvestment = [];
          var oAnnualAdminFee = [];
          var o10COICharge = [];
          var o6COICharge = [];
          var o10FundAfterDeduction = [];/*At begining of year*/
          var o6FundAfterDeduction = [];
          var o10FundManagmentCharges = [];
          var o6FundManagmentCharges = [];
          var o10AdditionToFund = [];
          var o6AdditionToFund = [];
          var o10AllStax = [];
          var o6AllStax = [];
          var o10fundAtTheEndOfTheYear = [];/*fund after bonus @ end of year*/
          var o6fundAtTheEndOfTheYear = [];
          var o10Sv = [];/*calc @ EOY*/
          var o6Sv = [];
          var o10DeathBenfit = [];/*calc @ EOY*/
          var o6DeathBenfit = [];
          var oCommision = [];
          var Bi = {};
			$log.debug("chkData",policyUserData);
			/** mobile web provision **/
			var reqData;
			if(!isWeb){
			    reqData = $q.all([
	              (getFiBIvalues(prodId, channelId, policyUserData, modalPremium, 10, 'cal')),
	              (getFiBIvalues(prodId, channelId, policyUserData, modalPremium, 6, 'cal')),
	              (getFiBIvalues(prodId, channelId, policyUserData, modalPremium, 10, 'irr')),
	              (getFiBIvalues(prodId, channelId, policyUserData, modalPremium, 6, 'irr')),
	              (fIDataService.getCommisionFactor(prodId, channelId, policyUserData.ppt))
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
          /*Cal Bi @ 10*/
          reqData.then(function(values) {
                var biAt10Cal = values[0];
                var biAt6Cal= values[1];
                var biAt10Irr= values[2];
                var biAt6Irr= values[3];
                var commisionFactor = values[4];
                $log.debug('commisionFactor',commisionFactor);
                var sumAdminFee = 0;
                var sum10CoiCharge = 0;
                var sum6CoiCharge = 0;
                var sum10AllStax = 0;
                var sum6AllStax = 0;
                var sum10FundManagementCharge = 0;
                var sum6FundManagementCharge = 0;
                var count = 0;
				for(var i = 0, len = calculateBISvcObj.months;  i !== len; i++){
                   var yr = i+1;
                   /*Add cumulative Admin Fee*/
                   sumAdminFee = sumAdminFee + biAt10Cal.adminFee[i];
                   sum10CoiCharge = sum10CoiCharge + biAt10Cal.coiCharge[i];
                   sum6CoiCharge = sum6CoiCharge + biAt6Cal.coiCharge[i];
                   sum10FundManagementCharge = sum10FundManagementCharge + biAt10Cal.fundManagmentCharge[i];
                   sum6FundManagementCharge = sum6FundManagementCharge + biAt6Cal.fundManagmentCharge[i];
                   /*$log.debug("uuu",sum10AllStax+"==="+biAt10Cal.coiServiceTax[i]+"==="+biAt10Cal.serviceTaxOnAdminFee[i]+"==="+biAt10Cal.fundManagmentSTCharge[i]);*/
                   sum10AllStax = sum10AllStax + biAt10Cal.coiServiceTax[i] + biAt10Cal.serviceTaxOnAdminFee[i] + biAt10Cal.fundManagmentSTCharge[i];
                   sum6AllStax = sum6AllStax + biAt6Cal.coiServiceTax[i] + biAt6Cal.serviceTaxOnAdminFee[i] + biAt6Cal.fundManagmentSTCharge[i];

                   /*EOF*/

                   if( (((yr % 12 == 0)&& yr!=0 ))) {
                    oPolicyYear.push(biAt10Cal.policyYear[i]);
                    oAnnulisedPrem.push(biAt10Cal.premiumArr[yr-12]);/*will it be total*/
                    oCommision.push(commisionFactor[count] * oAnnulisedPrem[count]);
                    oPremAllocationCharges.push(0);
                    o10AdditionToFund.push(0);
                    o6AdditionToFund.push(0);
                    oAmntAvailableForInvestment.push(biAt10Cal.premiumArr[yr-12]);
                    o10FundAfterDeduction.push(commonFormulaSvc.round(biAt10Cal.fundAfterDeduction[yr-12],0));
                    o6FundAfterDeduction.push(commonFormulaSvc.round(biAt6Cal.fundAfterDeduction[yr-12],0));
                    oAnnualAdminFee.push(sumAdminFee);
                    sumAdminFee = 0;
                    if(sum10CoiCharge < 0){
                     sum10CoiCharge = 0;
                    }
                    if(o6COICharge < 0){
                     sum6CoiCharge = 0;
                    }
                    o10COICharge.push(commonFormulaSvc.round(sum10CoiCharge, 0));
                    o6COICharge.push(commonFormulaSvc.round(sum6CoiCharge, 0));
                    sum10CoiCharge = 0;
                    sum6CoiCharge = 0;
                    o10FundManagmentCharges.push(commonFormulaSvc.round(sum10FundManagementCharge, 0));
                    sum10FundManagementCharge = 0;
                    o6FundManagmentCharges.push(commonFormulaSvc.round(sum6FundManagementCharge, 0));
                    sum6FundManagementCharge = 0;
                    o10AllStax.push(commonFormulaSvc.round(sum10AllStax,0));
                    sum10AllStax = 0;
                    o6AllStax.push(commonFormulaSvc.round(sum6AllStax,0));
                    sum6AllStax = 0;
                    o10fundAtTheEndOfTheYear.push(commonFormulaSvc.round(biAt10Cal.fundAfterBonus[i], 0));
                    o6fundAtTheEndOfTheYear.push(commonFormulaSvc.round(biAt6Cal.fundAfterBonus[i], 0));
                    o10Sv.push(biAt10Cal.sv[i]);
                    o6Sv.push(biAt6Cal.sv[i]);
                    o10DeathBenfit.push(biAt10Cal.deathBenifit[i]);
                    o6DeathBenfit.push(biAt6Cal.deathBenifit[i]);
					count++;

                   }
                 }
                 Bi.oPolicyYear = oPolicyYear;
                 Bi.oAnnulisedPrem = oAnnulisedPrem;
                 Bi.oAnnualAdminFee = oAnnualAdminFee;
                 Bi.o10COICharge = o10COICharge;
                 Bi.o6COICharge = o6COICharge;
                 Bi.o10FundAfterDeduction = o10FundAfterDeduction;
                 Bi.o6FundAfterDeduction = o6FundAfterDeduction;
                 Bi.o10DeathBenfit = o10DeathBenfit;
                 Bi.o6DeathBenfit = o6DeathBenfit;
                 Bi.o10FundManagmentCharges = o10FundManagmentCharges;
                 Bi.o6FundManagmentCharges = o6FundManagmentCharges;
                 Bi.o10Sv = o10Sv;
                 Bi.o6Sv = o10Sv;
                 Bi.o10fundAtTheEndOfTheYear = o10fundAtTheEndOfTheYear;
                 Bi.o6fundAtTheEndOfTheYear = o6fundAtTheEndOfTheYear;
                 Bi.o10AllStax = o10AllStax;
                 Bi.o6AllStax = o6AllStax;
                 Bi.oCommision = oCommision;
                 q.resolve(Bi);
                 /* $log.debug("oPolicyYear",oPolicyYear);
                 // $log.debug("oAnnulisedPrem",oAnnulisedPrem);
                 // $log.debug("oPolicyYear",oPolicyYear);
                 // $log.debug("oAnnualAdminFee",oAnnualAdminFee);
                 // $log.debug("o10COICharge",o10COICharge);
                 // $log.debug("o6COICharge",o6COICharge);
                 //  $log.debug("o10FundAfterDeduction",o10FundAfterDeduction);
                 // $log.debug("o6FundAfterDeduction",o6FundAfterDeduction );
                 // $log.debug("o10FundManagmentCharges",o10FundManagmentCharges);
                 // $log.debug("o6FundManagmentCharges",o6FundManagmentCharges );
                 // $log.debug("o10DeathBenfit",o10DeathBenfit);
                 //  $log.debug("o6DeathBenfit",o6DeathBenfit);
                 //   $log.debug("o10Sv",o10Sv);
                 //  $log.debug("o6Sv",o6Sv);
                 //  $log.debug("o10fundAtTheEndOfTheYear",o10fundAtTheEndOfTheYear);
                 //  $log.debug("o6fundAtTheEndOfTheYear",o6fundAtTheEndOfTheYear);
                 //  $log.debug("o10AllStax",o10AllStax);
                 //  $log.debug("o6AllStax",o6AllStax);
                 //  $log.debug("oCommision",oCommision);
                   $log.debug('Bi',Bi);*/


              });
         return q.promise;
          /*EOF Show Output*/


   }


  function getFiBIvalues(prodId, channelId, policyUserData, modalPremium, atPercent, calValName){
      /*Values to be keep as zero while calculating IRR*/
      /* 1.coiRate
      2.serviceTaxOnPremCharge
      3.premiumChargeOnTopUpPremium
      4.coiCharge
      5.coiServiceTax
      6.serviceTaxOnAdminFee
      7.fundManagmentSTCharge
      */
      var q = $q.defer();
	  var yearOfPolicy=1;
      var policyTermFlag = [];
      var policyYear = [];
      var policyMonth = [];
      var adminFee = [];
      var serviceTaxOnAdminFee=[];
      var ageAtEntryArr = [];
      var coiRate = [];
      var premiumArr = [];
      var constToCompForAdminFee = 6000/12;
      var coiConstFactor = 12;
      var constFMC = (1/12);
      var count =0;
      var ageAtEntry = policyUserData.laAge;
      var ppt = policyUserData.ppt; $log.debug('ppt>>',ppt);
      var premiumMode = policyUserData.premiumMode;
      var sumAssuredVal = policyUserData.sumAssured;

      var regularTopUp = [];
      var lumpsumTopUp = [];
      var premiumCharge = [];/* Premium * Regular Premium Charge %*/
      var serviceTaxOnPremCharge = [];/* Premium Charge * Service Tax (Assuming 14%)Since premium charge is zero, this is also zero*/
      var premiumChargeOnTopUpPremium =[];/*(Regular top up + Lumpsum top up) * Top up premium %*/
      var allocatedPremium = [];
      var sumAssured=[];
      var bonus=[];/*Will be 0*/
      var partialWithdrawl =[];/*OOS*/
      var withDrawlFee = [];/*OOS*/
      var fundBeforeDeduction = [];
      var sumAtRisk = [];
      var x = 1;
      var temp = [];
      var coiCharge = [];
      var totalDeductions = [];
      var fundAfterDeduction = [];
      var coiServiceTax = [];
      var fundManagmentCharge = [];
      var coiChargeVal = 0;
      var sumAtRiskVal = 0;
      var fbd = 0;
      var fundAfterDeductionVal = 0;
      var totalDeductionsVal= 0;
      var fundReturnval = 0;
      var fundManagmentChargeVal = 0;
      var fundManagmentSTChargeVal = 0;
      var fundBeforeBonusVal= 0;

      var fundReturn = [];
      var fundBeforeBonus = [];
      var fundManagmentSTCharge = [];

      var averageFundAmountForBonus =[];
      var fundAfterBonus = [];
      var absoluteSurrenderAmount = [];
      var sv =[];
      var deathBenifit = [];
      var netCashFlow = [];
	  var suChargePer;
	  var suChargeAmnt;
      if(ppt == 5){
          var premiumFrequency;
          if(premiumMode == 1){
            premiumFrequency = 12;
          }
          if(premiumMode == 12){
            premiumFrequency = 1;
          }
          if(premiumMode == 4){
            premiumFrequency = 3;
          }
          if(premiumMode == 2){
            premiumFrequency = 6;
          }
$log.debug('premiumFrequency',premiumFrequency);
        }
      var fundManagmentChargeFactor = getCalculatedFMCCharge(policyUserData.allFund);
      $log.debug('fundManagmentChargeFactor',fundManagmentChargeFactor);
	  /** mobile web provision **/
	  var reqData;
	  if(!isWeb){
	      reqData = $q.all([
	              (fIDataService.getAdminFeeFactor(prodId, channelId, policyUserData.ppt)),
	              (fIDataService.getCOIRate(prodId, channelId, policyUserData.laAge, policyUserData.laGender)),
	              (commonDbProductCalculation.serviceTaxFactorForFirstAndSecondYear(prodId, channelId)),
	              (fIDataService.getFMCCharge(prodId, channelId)),
	              (fIDataService.getInvestMentReturn(prodId, channelId, atPercent)),
	              (fIDataService.getSurrenderChargeFactors(prodId, channelId))
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
                var adminFact = values[0];
                var coiFact = values[1];
                var sTAX = values[2];
                var fMCCharge = parseFloat(values[3]);
                var invReturn = parseFloat(values[4]);
                var suChargeArr = values[5];
                $log.debug("suChargeArr:::",coiFact);
			      for(var i = 0, len = calculateBISvcObj.months;  i !== len; i++){
			        /*based on ppt*/
			        policyTermFlag.push(1);
			        policyYear.push(yearOfPolicy);
			        var yr = i+1;
			        policyMonth.push(yr);
			        ageAtEntryArr.push(ageAtEntry);

			        regularTopUp.push(0);
			        lumpsumTopUp.push(0);
			        premiumCharge.push(0);
			        bonus.push(0);
			        partialWithdrawl.push(0);
			        withDrawlFee.push(0);
			        averageFundAmountForBonus.push(0);
			        premiumChargeOnTopUpPremium.push(0);
			        serviceTaxOnPremCharge.push(0);
			        sumAssured.push(sumAssuredVal);
			        /**Admin Fee**/
			        /*$log.debug("i",i+"==="+count+"===="+adminFact[count]);*/

			        var firstRuleAdmin = commonFormulaSvc.multiply(policyUserData.basePremium,adminFact[count]);
			        var adminFeeVal = commonFormulaSvc.minValue(firstRuleAdmin,constToCompForAdminFee);
			        adminFee.push(adminFeeVal);
			        if(calValName == "cal"){
			          var adminFeeWithServiceTax = commonFormulaSvc.multiply(sTAX,adminFeeVal);
			          serviceTaxOnAdminFee.push(commonFormulaSvc.round(adminFeeWithServiceTax,0));
			        }else{
			          serviceTaxOnAdminFee.push(0);
			        }
        			/**EOF Admin Fee**/
			        /**COI Rate**/
			        if(calValName == "cal"){
								var coiMid = commonFormulaSvc.divide(coiFact[count],coiConstFactor);
								$log.debug('temp123>>>',coiMid);
			        			coiRate.push(commonFormulaSvc.roundUp(commonFormulaSvc.divide(coiMid,1000),6));
			        		}else{
			        			coiRate.push(0);
			        }
			        /**EOF COI Rate**/
        				/** Premium **/
			        /*single Pay Always value will Once*/
			        if(ppt == 1){
			          if(i==0){
			            premiumArr.push(modalPremium);
			            allocatedPremium.push(modalPremium);
			        }else{
			            premiumArr.push(0);
			            allocatedPremium.push(0);
			        }

			        }
        /*5th Pay Always value will depend on premium mode*/
		            if(ppt == 5){
		            if(yr%premiumFrequency == 0){
		              x = x+premiumFrequency;
		            }
		            if((yr == x) || (premiumFrequency == 1)){
									if(yearOfPolicy <= 5){
		                premiumArr.push(modalPremium);
		                allocatedPremium.push(modalPremium);
									}else{
										premiumArr.push(0);
										allocatedPremium.push(0);
									}
		              }else{
		                premiumArr.push(0);
		                allocatedPremium.push(0);
		              }
		            }
		        /** EOF Premium**/
		        /*Fund Before deduction*/
		          if(i == 0){
		            	fbd = commonFormulaSvc.add(allocatedPremium[i],bonus[i]);
		            	fundBeforeDeduction.push(commonFormulaSvc.round(fbd,2));
		          }
		           else{
		            	var prevfund = i-1;
		            	fbd = commonFormulaSvc.add(allocatedPremium[i],commonFormulaSvc.multiply(fundAfterBonus[prevfund],policyTermFlag[i]));
		           		$log.debug("fundAfterBonus[i-0]",fundAfterBonus[prevfund]+"=="+policyTermFlag[i]+"==="+fundAfterBonus[prevfund]*policyTermFlag[i]);
		           		/*$log.debug("fundAfterBonus[i-0]",tmp+"=="+fbd);*/
		          		fundBeforeDeduction.push(commonFormulaSvc.round(fbd,2));
           		}

        		/** EOF Fund Before deduction**/
        		/*Sum At Risk*/
		            sumAtRiskVal = sumAssured[i]-fundBeforeDeduction[i];
		            sumAtRisk.push(commonFormulaSvc.round(sumAtRiskVal,2));
        		/*EOF Sum at risk*/
        		/*COI Charge*/
	            if(calValName == "cal"){
	              coiChargeVal = commonFormulaSvc.multiply(sumAtRisk[i],coiRate[i]);

	              coiCharge.push(commonFormulaSvc.round(coiChargeVal,2));
	              coiServiceTax.push(commonFormulaSvc.multiply(coiChargeVal,sTAX));
	            }else{
	              coiCharge.push(0);
	              coiServiceTax.push(0);
	            }

        /*EOF Charge*/
        /*fundAfterDeduction*/
            fundAfterDeductionVal = fundBeforeDeduction[i] - coiCharge[i] - coiServiceTax[i] - adminFee[i] - serviceTaxOnAdminFee[i] - partialWithdrawl[i] - withDrawlFee[i];
            //$log.debug('fundBeforeDeduction',fundBeforeDeduction[i]+"=="+coiCharge[i]+"=="+coiServiceTax[i]+"=="+adminFee[i]+"=="+serviceTaxOnAdminFee[i]+"=="+partialWithdrawl[i]+"=="+withDrawlFee[i]);
            fundAfterDeduction.push(commonFormulaSvc.round(fundAfterDeductionVal,2));

        /*EOF fundAfterDeduction*/
        // Fund return
            var firstFundReturnStep = commonFormulaSvc.add(1,invReturn);
            var midFundReturnStep = Math.pow(firstFundReturnStep,constFMC);
            fundReturnval = fundAfterDeduction[i]*(midFundReturnStep-1);

            /*$log.debug('fundReturnval',firstFundReturnStep +"===="+fundReturnval+"===="+midFundReturnStep+"==="+(midFundReturnStep-1));*/
            fundReturn.push(commonFormulaSvc.round(fundReturnval,2));
        // EOF Fund return
        /*fundManagmentCharge*/
            fundManagmentChargeVal = (fundAfterDeduction[i]+fundReturn[i])*(Math.pow((1+fundManagmentChargeFactor),constFMC)-1);
            /*$log.debug('fundManagmentChargeVal',fundAfterDeduction[i] +"===="+fundReturn[i]+"===="+Math.pow((1+fundManagmentChargeFactor),constFMC)+"==="+(Math.pow((1+fundManagmentChargeFactor),constFMC)-1)+"==="+fundManagmentChargeFactor);*/
            fundManagmentCharge.push(commonFormulaSvc.round(fundManagmentChargeVal,2));
            if(calValName == "cal"){
            fundManagmentSTChargeVal=(fundAfterDeduction[i] + fundReturn[i]) * (Math.pow((1+fMCCharge),constFMC)-1) * sTAX;
            fundManagmentSTCharge.push(commonFormulaSvc.round(fundManagmentSTChargeVal,2));
            }else{
            fundManagmentSTCharge.push(0);
            }
        /* EOF fundManagmentCharge*/


        /*totalDeductions*/
            totalDeductionsVal = premiumCharge[i]+coiCharge[i]+adminFee[i]+withDrawlFee[i]+fundManagmentCharge[i];
            totalDeductions.push(totalDeductionsVal);
        /*EOF totalDeductions*/

         /*Fund before bonus*/
            fundBeforeBonusVal =fundAfterDeduction[i] + fundReturn[i] - fundManagmentCharge[i] - fundManagmentSTCharge[i];
            fundBeforeBonus.push(commonFormulaSvc.round(fundBeforeBonusVal,2));
          /*EOF Fund before bonus*/
          /*Fund after bonus*/
            fundAfterBonus.push(commonFormulaSvc.add(fundBeforeBonus[i],bonus[i]));
          /*EOF Fund after bonus*/
          /*Surrender Value*/
          /*First Value to compare*/
          if(suChargeArr[i]===undefined){
            suChargePer = 0;
            suChargeAmnt = 0;
          }else{
            suChargePer = suChargeArr[i][0];
            suChargeAmnt = suChargeArr[i][1];
          }
          //$log.debug("==",suChargePer+"===="+suChargeAmnt);
          /*Min of regular premium and fund after bonus*/
          var minRPremFAB = commonFormulaSvc.minValue(fundAfterBonus[i],modalPremium);
           //$log.debug('minRPremFAB',minRPremFAB+"--"+fundAfterBonus[i]+"---"+modalPremium);
          var firstSV = commonFormulaSvc.multiply(minRPremFAB,suChargePer);
           /*$log.debug('firstSV',firstSV);*/
           /*$log.debug('suChargeAmnt',suChargeAmnt);*/
           /*Take min*/
          var minOfFirstSVAbsolute = commonFormulaSvc.minValue(firstSV,suChargeAmnt);
          sv.push(commonFormulaSvc.subtract(fundAfterBonus[i],minOfFirstSVAbsolute));
           /*$log.debug('minOfFirstSVAbsolute',minOfFirstSVAbsolute);*/

          /*EOF Surrender Value*/
          /*Death Benifit*/
          /*Max of sumAssured fund after bonus*/
          deathBenifit.push(commonFormulaSvc.maxValue(sumAssuredVal,fundAfterBonus[i]));
          /*EOF death benifit*/
          /*Net Cash Flow*/
          if(calValName == "irr"){
          netCashFlow.push(-premiumArr[i]-regularTopUp[i]-lumpsumTopUp[i]);
          }
          /*EOF Net Cash Flow*/
        if( ((yr % 12 == 0)&& yr!=0 ) ) {
          ageAtEntry++;
          yearOfPolicy++;
          count++;

        }
      }
      $log.debug('ageAtEntry',ageAtEntry);
      $log.debug('policyTermFlag',policyTermFlag);
      $log.debug('policyYear',policyYear);
      $log.debug('policyMonth',policyMonth);
      $log.debug('ageAtEntryArr',ageAtEntryArr);
      $log.debug('coiRate',coiRate);
	  $log.debug('coiCharge',coiCharge);
      $log.debug('serviceTaxOnAdminFee',serviceTaxOnAdminFee);
      $log.debug('premiumArr',premiumArr);
      $log.debug('adminFee',adminFee);
      $log.debug('fundReturn',fundReturn);
      $log.debug('fundManagmentCharge',fundManagmentCharge);
      $log.debug('fundAfterDeduction',fundAfterDeduction);
      $log.debug('fundManagmentSTCharge',fundManagmentSTCharge);
      $log.debug('fundBeforeBonus',fundBeforeBonus);
      $log.debug('totalDeductions',totalDeductions);
      $log.debug('fundAfterBonus',fundAfterBonus);
      $log.debug('sv',sv);
      $log.debug('deathBenifit',deathBenifit);
      $log.debug('fundBeforeDeduction',fundBeforeDeduction);
	  $log.debug('sumAtRisk',sumAtRisk);
	  $log.debug('sumAssured',sumAssured);

      if(calValName == "cal"){
      var BIVal = {};
      BIVal.ageAtEntry = ageAtEntry;
      BIVal.policyTermFlag = policyTermFlag;
      BIVal.policyYear = policyYear;
      BIVal.policyMonth = policyMonth;
      BIVal.ageAtEntryArr = ageAtEntryArr;
      BIVal.coiRate = coiRate;
      BIVal.serviceTaxOnAdminFee = serviceTaxOnAdminFee;
      BIVal.premiumArr = premiumArr;
      BIVal.adminFee = adminFee;
      BIVal.fundReturn = fundReturn;
      BIVal.fundManagmentCharge = fundManagmentCharge;
      BIVal.fundAfterDeduction = fundAfterDeduction;
      BIVal.fundManagmentCharge = fundManagmentCharge;
      BIVal.fundBeforeBonus = fundBeforeBonus;
      BIVal.totalDeductions = totalDeductions;
      BIVal.fundAfterBonus = fundAfterBonus;
      BIVal.sv = sv;
      BIVal.coiCharge = coiCharge;
      BIVal.deathBenifit = deathBenifit;
      BIVal.coiServiceTax = coiServiceTax;
      BIVal.fundManagmentSTCharge = fundManagmentSTCharge;

       q.resolve(BIVal);
     }else{
		 var irrRate;
      netCashFlow.push(sv[119]);
      $log.debug("Cal",calValName);

      $log.debug("netCashFlow",netCashFlow);
      if(netCashFlow.length!= 0)
      irrRate = commonFormulaSvc.calcIRR(netCashFlow);
      var netPay = commonFormulaSvc.multiply((Math.pow((1+commonFormulaSvc.divide(irrRate,100)),12)-1),100);
      $log.debug("irrRate",irrRate);
      $log.debug("netPay",netPay);
       q.resolve(netPay);
      }
    });
     return q.promise;
  }
}]);
