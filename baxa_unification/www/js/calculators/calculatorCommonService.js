otherCalculators.service(
  'calculatorCommonService', [
    '$log',
    '$q',
    'commonFormulaSvc',
    'utilityService',
    'commonDBFuncSvc',
    function($log, $q, commonFormulaSvc, utilityService, commonDBFuncSvc) {
      'use strict';
      var wc = this;
      wc.saveCalc = saveCalc;
      wc.getCalcInputs = getCalcInputs;
      wc.getCalculators = getCalculators;

      function getCalculators(type) {
        var q = $q.defer();
        var parameters = [type];
        commonDBFuncSvc.query("SELECT * FROM AskSwitchMstCalculator WHERE Code = ? AND IsActive = 1", parameters)
          .then(function(calcs) {
            var getCalculators;
            getCalculators = commonDBFuncSvc.getAll(calcs);
            $log.debug('getCalculators', getCalculators);
            q.resolve(getCalculators[0]);
          });
        return q.promise;
      }


      function saveCalc(calData) {
        var q = $q.defer();
        var selectParameters = [
          ""+calData.Input,
          ""+calData.Cust_Id,
          ""+calData.Type
        ];

        commonDBFuncSvc.query("SELECT Input FROM SwitchCalculator WHERE Input = ? AND FKCust_ID = ? AND Type = ?",selectParameters)
          .then(function(selectData) {
            var checkRecord = commonDBFuncSvc.getAll(selectData);
            if (checkRecord.length <= 0) {
              var parameters = [
                calData.Cust_Id,
                calData.Type,
                calData.Input,
                calData.Output,
                calData.IsActive,
                utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss'),
                calData.Cust_Id,
                utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss'),
                calData.Cust_Id
              ];
              commonDBFuncSvc.query("INSERT INTO SwitchCalculator (FKCust_ID,Type,Input,Output,IsActive,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy) VALUES (?,?,?,?,?,?,?,?,?)",
                  parameters)
                .then(function(result) {
                  $log.debug(result);
                  return q.promise;

                });
            } else {
              return q.promise;
            }

          });
      }

      function getCalcInputs(custId, recId) {
        var q = $q.defer();
        var parameters = [custId, recId];
        commonDBFuncSvc.query("SELECT Input,Output FROM SwitchCalculator WHERE FKCust_ID = ? AND PKSwitchCalculator = ?", parameters)
          .then(function(calcData) {
            var getCalculatorOutput;
            getCalculatorOutput = commonDBFuncSvc.getAll(calcData);
            $log.debug('calcData', getCalculatorOutput);
            q.resolve(getCalculatorOutput[0]);
          });
        return q.promise;
      }
    }
  ]
);
