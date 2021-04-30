/*
 * Created By: Atul A
 * Elte Secure Database Service
 */
productCalculator.service(
  'eSValidationService', [
    '$q',
    '$log',
    'commonFormulaSvc',
    'commonDBFuncSvc',
    'eSDataFromDBSvc',
    'riderValidationService',
    function($q, $log, commonFormulaSvc, commonDBFuncSvc, eSDataFromDBSvc, riderValidationService) {
      'use strict';

      var eSObj = this;

      eSObj.validateBaseProduct = validateBaseProduct;
      eSObj.validateProduct = validateProduct;
      function validateBaseProduct(prodId, channelId, data) {
        var q = $q.defer();
        var isValid = false;
        eSDataFromDBSvc.getProductCode(prodId, channelId, data.ppt)
          .then(function(prodCode) {
            var prodBaseCode = prodCode;
            var dbErrorMessages = [];
            /** mobile web provision **/
            var reqData;
            if(!isWeb){
                reqData = $q.all([
                  validateProduct(prodId, channelId, prodCode, data),
                  riderValidationService.riderPreADBValidateService(data, prodId, channelId, prodBaseCode),
                  riderValidationService.riderPreHCValidateService(data, prodId, channelId, prodBaseCode)
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
              if (val.length > 0) {
                isValid = false;
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

              q.resolve(dbErrorMessages);

            }); /**EOF Q ALL*/


          }); /**EOF get product*/
        return q.promise;
      }



      /*Method for validating the basecalculation*/
      function validateProduct(prodId, channelId, prodCode, data) {
        var q = $q.defer();
        var errorMessage = [];

          /** mobile web provision **/
          var reqData;
          if(!isWeb){
              reqData = $q.all([
                  commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'ENTAGE', data.laAge),
                  commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'SA', data.sumAssured)
                //  commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'ANNPRE', data.basePremium)

            ]);
          }else{
            /**Provision for webapp code **/

            /**return values in array in then function**/
          }
          reqData.then(function(values) {
            var entAgeMessage = values[0];
            var saMessage = values[1];

            if (entAgeMessage.length)
              errorMessage.push(entAgeMessage[0]);
            if (saMessage.length > 0)
              errorMessage.push(saMessage[0]);
            q.resolve(errorMessage);
          });
          return q.promise;
      }

    }
  ]);
