/**
Temprory service created for User Input for adb riders
Developer Anushree
*/
 unificationBAXA.service(
  'eAdbRiderDataFromUserSvc',
  [
     function() {
       	'use strict';
        var eAdbRiderData = {};
        return {
            setEADBRiderData: function (data) {
                var eadbRiderDataPolicyUserInputs = {
                    laName : data.laName,
                    laAge : data.laAge,
                    laGender : data.laGender,
                    isSelf : data.isSelf,
                    sumAssured : data.sumAssured,
                    sumAssuredForEADBRiders : data.sumAssuredForEADBRiders,
                    riderterm : data.riderterm,/*same as base ppt*/
                    premiumMode : data.premiumMode

                };
                eAdbRiderData = eadbRiderDataPolicyUserInputs;
              return eAdbRiderData;
            },
            getADBRiderData: function () {
              return eAdbRiderData;
            },
        };

    	}
  ]
);

/**
DB service which will fetch data from local storage
*/
unificationBAXA.service ('eAdbRiderPremiumDataFromDBSvc',
[
'$q',
'$log',
'commonDBFuncSvc',
function ($q,$log,commonDBFuncSvc) {
    'use strict';
    var eAdbObj = this;
    eAdbObj.riderRateForCalculation = riderRateForCalculation;
    eAdbObj.getProdCodeEADB = getProdCodeEADB;

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

    function getProdCodeEADB(prodId, channelId) {
       var q = $q.defer();
       commonDBFuncSvc.getParamValue(prodId, channelId, 'PRODCODE')
         .then(function(val) {
             $log.debug("ADBProdCode::",val);
           q.resolve(val);
         });
           return q.promise;
    }

}]);
