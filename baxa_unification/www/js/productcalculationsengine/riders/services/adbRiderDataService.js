/**
Temprory service created for User Input for adb riders
Developer Anushree
*/
 unificationBAXA.service(
  'adbRiderForASDataFromUserSvc',
  [
     function() {
       	'use strict';
        var adbRiderDataForASPolicyUserData = {};
        return {
            setADBRiderData: function (data) {
                var adbRiderDataForASPolicyUserInputs = {
                    laName : data.laName,
                    laAge : data.laAge,
                    laGender : data.laGender,
                    isSelf : data.isSelf,
                    sumAssured : data.sumAssured,
                    sumAssuredForADBRiders : data.sumAssuredForADBRiders,
                    riderterm : data.ppt,/*same as base ppt*/
                    premiumMode : data.premiumMode,
                    NSAPForPrposer : data.NSAPForPrposer,
                    NSAPForLA : data.NSAPForLA
                };
                adbRiderDataForASPolicyUserData = adbRiderDataForASPolicyUserInputs;
              return adbRiderDataForASPolicyUserInputs;
            },
            getADBRiderData: function () {
              return adbRiderDataForASPolicyUserData;
            },
        };

    	}
  ]
);

/**
DB service which will fetch data from local storage
*/
unificationBAXA.service ('adbRiderPremiumDataFromDBSvc',
[
'$q',
'$log',
'commonDBFuncSvc',
function ($q,$log,commonDBFuncSvc) {
    'use strict';
    var adbObj = this;
    adbObj.riderRateForCalculation = riderRateForCalculation;
    adbObj.getProdCodeADB = getProdCodeADB;

    function riderRateForCalculation(prodId, channelId) {
       var q = $q.defer();
       commonDBFuncSvc.getParamValue(prodId, channelId, 'RIDERRATE')
         .then(function(val) {
           var paramValueJson = JSON.parse(val);
           $log.debug('serviceTaxTermPolicy ::',paramValueJson);
           q.resolve(paramValueJson);
         });
           return q.promise;
    }

    function getProdCodeADB(prodId, channelId) {
       var q = $q.defer();
       commonDBFuncSvc.getParamValue(prodId, channelId, 'PRODCODE')
         .then(function(val) {
             $log.debug("ADBProdCode::",val);
           q.resolve(val);
         });
           return q.promise;
    }

}]);
