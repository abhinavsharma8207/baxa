/*
 * Created By: Atul A
 * Wealth Calculator
 */
otherCalculators.service(
  'wealthCalculatorSetGetService', ['$log', function($log) {
    'use strict';
    var _data = {
      currentAge: null,
      fundReqAge: null,
      investmentReq: null,
      wealthGoal: null,
      wealthInYears: null,
      investmentReqPerMnth: null,
      assetCreated: null,
      wealthRoR: null
    };
    return {
      getSelectedData: function() {
        return _data;
      },
      setSelectedData: function(data) {
        $log.debug('settt', data);
        _data.currentAge = data.currentAge;
        _data.fundReqAge = data.fundReqAge;
        _data.investmentReq = data.investmentReq;
        _data.wealthGoal = data.wealthGoal;
        _data.wealthInYears = data.wealthInYears;
        _data.investmentReqPerMnth = data.investmentReqPerMnth;
        _data.assetCreated = data.assetCreated;
        _data.wealthRoR = data.wealthRoR;
      },
    };
  }]
);

otherCalculators.service(
  'wealthCalculatorService', [
    '$log',
    '$q',
    'commonFormulaSvc',
    'utilityService',
    'commonDBFuncSvc',
    'wealthCalculatorSetGetService',
    function($log,
      $q,
      commonFormulaSvc,
      utilityService,
      commonDBFuncSvc,
      wealthCalculatorSetGetService
      ) {
      'use strict';
      var wc = this;
      wc.calcInvestmentRequired = calcInvestmentRequired;
      wc.calcAssetCreated = calcAssetCreated;
      wc.calcRevised = calcRevised;
      wc.calcMnthInvsGap = calcMnthInvsGap;
      var wealthObj = {
        investmentReq: 0,
        wealthGoal: 0,
        wealthInYears: 0,
        investmentReqPerMnth: 0,
        assetCreated: 0,
        wealthRoR: 0
      };
      /*
			* Annual Investment required= -(Rate Of return*Funds required)/(1-(1+Rate of return)^After how many years fund is required);
				dividend/divisor
		 	*/
      function calcInvestmentRequired(inputData) {
        var investmentReq = 0;
        var investmentReqPerMnth = 0;
        var fundReqAge = 0;
        var rateOfR = commonFormulaSvc.divide(inputData.rateOfRtrn, 100);
        fundReqAge = parseInt(inputData.years) + parseInt(inputData.currentAge);
        investmentReq = calcRevised(inputData.rateOfRtrn, inputData.fundsRequired, inputData.years);
        investmentReqPerMnth = commonFormulaSvc.round(investmentReq / 12, 0);
        $log.debug('investmentReq', investmentReq);
        wealthObj.currentAge = inputData.currentAge;
        wealthObj.fundReqAge = fundReqAge;
        wealthObj.wealthGoal = inputData.fundsRequired;
        wealthObj.wealthInYears = inputData.years;
        wealthObj.investmentReq = investmentReq;
        wealthObj.investmentReqPerMnth = investmentReqPerMnth;
        wealthObj.wealthRoR = inputData.rateOfRtrn;
        wealthCalculatorSetGetService.setSelectedData(wealthObj);
      }
      /*
       * LumsumAsset = Current Investment*(1+Rate of return)^ After how many years fund is required
       * Monthly Asset = Current Investment*(1+Rate of return)^ After how many years fund is required
       */
      function calcAssetCreated(investData) {
        var totalInvs = {
          lumSumInvst: 0,
          mnthInvst: 0,
          corpsGap: 0,
          mnthlAssetCreated: 0,
          revisedFunds: 0,
          revisedMnthReq: 0,
          revisedMnthGap: 0,
        };
        var assetCreated = 0;
        var assetCreatedMnth = 0;
        var revisedFunds = 0;
        var revisedMnthReq = 0;
        var lumSumRoR = commonFormulaSvc.divide(investData.lumSumInvstRoR, 100);
        var getData = wealthCalculatorSetGetService.getSelectedData();
        $log.debug(investData.currentLumInvst + ',' + lumSumRoR + ',' + getData.wealthInYears);
        assetCreated = commonFormulaSvc.round(investData.currentLumInvst * Math.pow((1 + lumSumRoR), getData.wealthInYears), 0);
        wealthObj.assetCreated = assetCreated;
        wealthCalculatorSetGetService.setSelectedData(wealthObj);
        var mnthRoR = commonFormulaSvc.divide(investData.currentMnthRoR, 100);
        assetCreatedMnth = commonFormulaSvc.round(investData.currentMnthInv * 12 * Math.pow((1 + mnthRoR), getData.wealthInYears), 0);
        totalInvs.lumSumInvst = assetCreated;
        totalInvs.mnthInvst = investData.currentMnthInv * 12;
        totalInvs.mnthlAssetCreated = assetCreatedMnth;
        totalInvs.corpsGap = getData.wealthGoal - (totalInvs.lumSumInvst + assetCreatedMnth);
        revisedFunds = calcRevised(getData.wealthRoR, totalInvs.corpsGap, getData.wealthInYears);
        revisedMnthReq = revisedFunds / 12;
        totalInvs.revisedMnthGap = calcMnthInvsGap(getData.investmentReqPerMnth, investData.currentMnthInv);
        totalInvs.revisedFunds = revisedFunds;
        totalInvs.revisedMnthReq = revisedMnthReq;
        $log.debug('assetCreated', assetCreated);
        $log.debug('assetCreatedMnth', assetCreatedMnth);
        $log.debug('totalInvs', totalInvs);
        return totalInvs;
      }

      function calcRevised(roR, fundsRequired, years) {
        var investmentReq = 0;
        var multiFactorL = 100000;
        var rateOfR = commonFormulaSvc.divide(roR, 100);
        var investmentDivisor = 1 - (Math.pow((1 + rateOfR), years));
        var investmentDividend = -(rateOfR * fundsRequired);
        investmentReq = commonFormulaSvc.round(commonFormulaSvc.divide(investmentDividend, investmentDivisor), 0);
        if (investmentReq < 0) {
          investmentReq = 0;
        } else {
          investmentReq = investmentReq;
        }
        $log.debug('investmentReq', investmentReq);
        return investmentReq;
      }

      function calcMnthInvsGap(reqMnthlyInvst, currentMnthInv) {
        var mnthlyCorpGap = 0;
        mnthlyCorpGap = reqMnthlyInvst - currentMnthInv;
        if (mnthlyCorpGap < 0) {
          mnthlyCorpGap = 0;
        }
        return mnthlyCorpGap;
      }
    }
  ]
);
