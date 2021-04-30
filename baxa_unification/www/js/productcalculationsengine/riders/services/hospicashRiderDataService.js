/**
Temprory service created for User Input for hospicash riders
*/
unificationBAXA.service('hospiCashRiderDataFromUserSvc', [ function() {
    'use strict';
    var hospiCashPolicyUserData = {};
      return {
        setHospiCashData: function (data) {
              var hospiCashPolicyUserDataInputs = {
              laName: data.laName,/* la data same as base product*/
              laAge: data.laAge,
              laGender: data.laGender,
              isSelf: data.isSelf,
              sumAssured: data.sumAssured,
              sumAssuredForRiders: data.sumAssuredForRiders,
              riderterm: data.riderPpt,/*same as base ppt*/
              premiumMode: data.premiumMode,
              NSAPForPrposer: data.NSAPForPrposer,
              NSAPForLA: data.NSAPForLA,
            };
              hospiCashPolicyUserData = hospiCashPolicyUserDataInputs;
              return hospiCashPolicyUserDataInputs;
        },

        getHospiCashData: function () {

          return hospiCashPolicyUserData;

        },

    };
}]);

 /**
   * DB service which will fetch data from local storage
   */
unificationBAXA.service('hospiCashRiderDataFromDBSvc',
    [
      '$q',
      '$log',
      'commonDBFuncSvc',
    function($q,$log,commonDBFuncSvc) {
    'use strict';

    /**
    * This function will get modal premium conversion factor for given premium mode
    * @param  : premium mode user Input.
    * @return : premiumModalfactor from db
    */
    var hcObj = this;
    hcObj.getAnnualRiderPremium = getAnnualRiderPremium;
    hcObj.getHCBProdCode = getHCBProdCode;

    /*getting annual rider benifit from table*/

    function getAnnualRiderPremium(prodId, channelId, laAge, riderterm, sumAssuredForRiders, gender){
        var paramName = '';
        var genderLabel = '';

        switch (parseInt(gender)) {
            case 0:
                genderLabel = 'MALE';
                break;
            case 1:
                genderLabel = 'FEMALE';

                break;
        }
        paramName = 'PRTERM'+riderterm+genderLabel;
        $log.debug('paramName',paramName);
        var q = $q.defer();
        commonDBFuncSvc.getParamValueName(prodId, channelId, paramName)
        .then(function(val) {
            $log.debug('val>',val);
            var ParamValueJson = JSON.parse(val.ParamValue);
           var paramNameJson = JSON.parse(val.ParamColumn);
           /*Providing solution for age less than 1 as we don't have entry
           TODO: this code could be removed id we add entry for 0 age*/
           if(laAge == 0){
            laAge = 1;
           }
           /*end of provision*/
            var annualRiderPremium = ParamValueJson[""+laAge][paramNameJson.columnName.indexOf(String(sumAssuredForRiders))-1];
            $log.debug('annualRiderPremium',annualRiderPremium);
            q.resolve(annualRiderPremium);
        });
        return q.promise;
    }

    function getHCBProdCode(prodId, channelId ,sumAssuredForRiders, term){

        var q = $q.defer();
        commonDBFuncSvc.getParamValueName(prodId, channelId, 'PRODCODE')
        .then(function(val) {
            $log.debug('val>',val);
            var ParamValueJson = JSON.parse(val.ParamValue);
           var paramNameJson = JSON.parse(val.ParamColumn);
            var annualRiderPremium = ParamValueJson[""+term][paramNameJson.columnName.indexOf(String(sumAssuredForRiders))-1];
            $log.debug('PRODCODE::HCB',annualRiderPremium);
            q.resolve(annualRiderPremium);
        });
        return q.promise;
    }


}]);
