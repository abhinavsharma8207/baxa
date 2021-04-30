/**
Temprory service created for User Input
*/
productCalculator.service('trippleHealthDataFromUserSvc', [function() {
  'use strict';
  var trippleHealthPolicyUserInputs = {
    laName: 'XYZ',
    laAge: 45,
    laGender: 0,
    isSelf: false,
    prposerName: 'ABC',
    prposerAge: 60,
    prposerGender: 'Male',
    sumAssured: 500000,
    policyBenfitPeriod: 15,
    /*Only 15 is applicable & premium payment term is same as policyBenfit period */
    ppt: 15,
    premiumMode: 1,
    NSAPForPrposer: true,
    NSAPForLA: true,
  };

  /*
   */
  return trippleHealthPolicyUserInputs;
}]);
/**
DB service which will fetch data from local storage
*/
productCalculator.service('trippleHealthDataFromDBSvc',
[
'$q',
'commonDBFuncSvc',
'commonDbProductCalculation',
'$log', function( $q, commonDBFuncSvc, commonDbProductCalculation,$log) {
'use strict';
  var tDb = this;
  tDb.getpremiumRate = getpremiumRate;
  /**This function will lookup into table called premium rate table
  	and fetch the value from it on basis of lifeAssurer age & gender.
  	@param1  : laAge=lifeAssurer age;
  	@param2  : laGender =lifeAssurer Gender;
  	@returns : premiumrate
  */
  function getpremiumRate(prodId, channelId, laAge, laGender, sumAssured) {
    var q = $q.defer();
    commonDbProductCalculation.getValueForGivenRange(prodId, channelId,'PRBAND' ,sumAssured)
    .then(function(bandVal){
    $log.debug('::DB::', bandVal);
    commonDBFuncSvc.getParamValue(prodId, channelId,  bandVal)
      .then(function(val) {
        var ParamValueJson = JSON.parse(val);
        $log.debug('getpremiumRate', ParamValueJson[laAge][laGender]);
        q.resolve(ParamValueJson[laAge][laGender]);
      });
    });
    return q.promise;
  }
}]);
