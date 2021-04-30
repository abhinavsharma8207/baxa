/**
Temprory service created for User Input for adb riders
*/
unificationBAXA.service('pwrRiderDataFromUserSvc', [ function() {
    'use strict';
    var pwrRiderUserData = {};
        return {
            setPWRRiderData: function (data) {
            var pwrRiderDataFromUser = {
              PrposerName: data.proposerName,/* la data same as base product*/
              PrposerAge: data.proposerAge,
              PrposerGender: data.proposerGender,
              laName: data.laName,/* la data same as base product*/
              laAge: data.laAge,
              laGender: data.laGender,
              isSelf: false,
              sumAssured: data.sumAssured,/*if base is < than base then only NSAP*/
              riderterm: data.ppt,
              premiumMode: data.premiumMode,
              NSAPForPrposer: data.NSAPForPrposer,
              NSAPForLA: data.NSAPForLA,
          };
                pwrRiderUserData = pwrRiderDataFromUser;
                return pwrRiderDataFromUser;
            },
            getPWRRiderData: function () {
                return pwrRiderUserData;
            },
        };


}]);

/**
  DB service which will fetch data from local storage
*/
unificationBAXA.service('pwrDataFromDBSvc',
[
'$q',
'$log',
'commonDBFuncSvc',
'commonDbProductCalculation',
function($q, $log, commonDBFuncSvc, commonDbProductCalculation) {
    'use strict';

    var pwrObj = this;
    pwrObj.getNSAPFactorForPrposer = getNSAPFactorForPrposer;
    pwrObj.riderFactorCalculation = riderFactorCalculation;
    pwrObj.getNSAPFactorForLA = getNSAPFactorForLA;

    function getNSAPFactorForPrposer(selectedRiderProductId, channelId, ppt){
      var q = $q.defer();

        commonDbProductCalculation.getValueForGivenRange(selectedRiderProductId, channelId, 'NSAPPROTERM', ppt)
        .then(function(val) {
          $log.debug('getNSAPFactorForPrposer :' , val);
          q.resolve(val);
        });
      return q.promise;
    }

    function getNSAPFactorForLA(selectedRiderProductId, channelId){
        var q = $q.defer();

          commonDBFuncSvc.getParamValue(selectedRiderProductId, channelId, 'NSAPRATELA')
          .then(function(val) {
            $log.debug('getNSAPFactorForLA :' , val);
            q.resolve(val);
          });
        return q.promise;

    }

    function riderFactorCalculation(age, policyTem, selectedRiderProductId, channelId){
      var index = '';
      var premiumRate = 0.0;
      var q = $q.defer();
      commonDBFuncSvc.getParamValueName(selectedRiderProductId, channelId, 'PR')
      .then(function(val) {
          var ParamValueJson = JSON.parse(val.ParamValue);
          var paramNameJson = JSON.parse(val.ParamColumn);
          $log.debug("paramNameJson.columnName.indexOf(String(policyTem))-1",policyTem);
           $log.debug(paramNameJson.columnName.indexOf(String(policyTem))-1+"[[[[[]]]]]");
          $log.debug('age',age);
          premiumRate = ParamValueJson["" + age][paramNameJson.columnName.indexOf(String(policyTem))-1];
          premiumRate = parseFloat(premiumRate)/100;
          q.resolve(premiumRate);
        });
      return q.promise;
    }
}]);
