/*
service for premium Calculation here injecting all services
*/
productCalculator.service(
  'fSValidationService', [

    '$q',
    '$log',
    'commonFormulaSvc',
    'commonDBFuncSvc',
    'fSDataFromDBSvc',
    'riderValidationService',
    function(
      $q,
      $log,
      commonFormulaSvc,
      commonDBFuncSvc,
      fSDataFromDBSvc,
      riderValidationService
    ) {

      'use strict';

      var fSObj = this;
      fSObj.getProductCode = getProductCode;
      fSObj.validateBaseProduct = validateBaseProduct;
      fSObj.getFsProductCode = getFsProductCode;
      fSObj.validateProduct = validateProduct;

      /*Method for Getting product code*/
      function getProductCode(prodId, channelId, ppt) {
        var q = $q.defer();
        /** mobile web provision **/
        var reqData;
        if(!isWeb){
            reqData = commonDBFuncSvc.getParamValue(prodId, channelId, 'PRODCODE');
        }else{
          /**Provision for webapp code **/


          /**return values in array in then function**/
        }

          reqData.then(function(val) {
            var ParamValueJson = JSON.parse(val);
            $log.debug('::::::::', ppt);
            var prodCode = ParamValueJson[ppt][0];
            $log.debug('::getProdCode is::', prodCode);
            q.resolve(prodCode);
          });

        return q.promise;
      }

      function validateBaseProduct(prodId, channelId, prodCode, data) {
        var q = $q.defer();
        var isValid = false;
        var prodBaseCode = prodCode;
        var dbErrorMessages = [];

        /** mobile web provision **/
        var reqData;
        if(!isWeb){
            reqData = $q.all([
              validateProduct(prodId, channelId, prodBaseCode, data),
              riderValidationService.riderPreADBValidateService(data, prodId, channelId, prodBaseCode),
              riderValidationService.riderPreHCValidateService(data, prodId, channelId, prodBaseCode),
              riderValidationService.riderPrePWRValidateService(data, prodId, channelId, prodBaseCode)
          ]);
        }else{
          /**Provision for webapp code **/


          /**return values in array in then function**/
        }
        reqData.then(function(validations) {

          $log.debug('validations>>>', validations);
          var val = validations[0];
          var adbRiderVal = validations[1];
          var hcRiderVal = validations[2];
          var pwrRiderVal = validations[3];
          if (val.length > 0) {
            isValid = false;
            $log.debug('val>>>', validations);
            dbErrorMessages.push(val);
          }
          if (val.length == 0 && data.ADBRider && adbRiderVal.length > 0) {
            isValid = false;
            dbErrorMessages.push(adbRiderVal);
          }
          if (val.length == 0 && data.hospiCash && hcRiderVal.length > 0) {
            isValid = false;
            dbErrorMessages.push(hcRiderVal);
          }
          if (val.length == 0 && (data.PWRI || data.PWRII) && pwrRiderVal.length > 0) {
            isValid = false;
            dbErrorMessages.push(pwrRiderVal);
          }

          q.resolve(dbErrorMessages);

        }); /*EOF Q ALL*/

        return q.promise;
      }

      /*Method for getting productcode for ppt 5 with H & L*/
      function getFsProductCode(prodId, channelId, prodCode, userInput) {
        $log.debug('the value of prodecode is99999', prodCode);
        var q = $q.defer();
        /** mobile web provision **/
        var reqData;
        if(!isWeb){
            reqData = commonDBFuncSvc.getHlProductCode(userInput.laAge, prodId, channelId, prodCode);
        }else{
          /**Provision for webapp code **/


          /**return values in array in then function**/
        }

          reqData.then(function(values) {
            q.resolve(values);
          });

        return q.promise;

      }

      /*Method for Basevalidation*/
      function validateProduct(prodId, channelId, prodCode, data) {
        var q = $q.defer();
        //$log.debug("the value of product code is ====", prodCode);
        var errorMessage = [];
        /** mobile web provision **/
        var reqData;
        if(!isWeb){
            reqData = $q.all([
                commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'ENTAGE', data.laAge),
                commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'ANNPRE', data.basePremium)
                //commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'SA', data.sumAssured),
            ]);
        }else{
          /**Provision for webapp code **/


          /**return values in array in then function**/
        }
        reqData.then(function(values) {
            //$log.debug("response from base validation", values);
            var entAgeMessage = values[0];
            var saMessage = values[1];

            if (entAgeMessage.length > 0)
              errorMessage.push(entAgeMessage[0]);
            if (saMessage.length > 0)
              errorMessage.push(saMessage[0]);
            q.resolve(errorMessage);
          });
        return q.promise;
      }

    }
  ]);
