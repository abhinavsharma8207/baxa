/*
 * Created By: Uddhav
 * Service for common database functions
 */
productCalculator.service(
  'fIValidationService', [
    '$q',
    '$log',
    'commonDBFuncSvc',
    'riderValidationService',
    function($q, $log, commonDBFuncSvc, riderValidationService) {


      var fIObj = this;
      fIObj.getProductCode = getProductCode;
      fIObj.validateBaseProduct = validateBaseProduct;

      /*Get Product code for future invest through pay type and sumAssured*/
      function getProductCode(prodId, channelId, basePremium, payType) {
        var q = $q.defer();
        /** mobile web provision **/
        var reqData;
        if(!isWeb){
            reqData = commonDBFuncSvc.getParamValueForFutureInvest(prodId, channelId, basePremium, payType);
        }else{
          /**Provision for webapp code **/


          /**return values in array in then function**/
        }
        reqData.then(function(prodCode) {
            q.resolve(prodCode);
          });
        return q.promise;
      }





      function validateBaseProduct(prodId, channelId, data, payType) {

        var q = $q.defer();
        var isValid = false;
        getProductCode(prodId, channelId, data.basePremium, payType)
          .then(function(prodCode) {
            var prodBaseCode = prodCode;
            var dbErrorMessages = [];
            /** mobile web provision **/
            var reqData;
            if(!isWeb){
                reqData = $q.all([
                  validateProduct(prodId, channelId, prodCode, data),
                  riderValidationService.riderPreADBValidateService(data, prodId, channelId, prodBaseCode),
                  riderValidationService.riderPreHCValidateService(data, prodId, channelId, prodBaseCode),
                  riderValidationService.riderPrePWRValidateService(data, prodId, channelId, prodBaseCode)
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
                $log.debug('riderVal>>>', validations);
                dbErrorMessages.push(adbRiderVal);
              }
              if (val.length == 0 && data.hospiCash && hcRiderVal.length > 0) {
                isValid = false;
                $log.debug('hcRiderVal>>>', validations);
                dbErrorMessages.push(hcRiderVal);
              }
              if (val.length == 0 && (data.PWRI || data.PWRII) && pwrRiderVal.length > 0) {
                isValid = false;
                $log.debug('pwrRiderVal>>>', validations);
                dbErrorMessages.push(pwrRiderVal);
              }

              q.resolve(dbErrorMessages);

            }); /*EOF Q ALL*/


          }); /*EOF get product*/
        return q.promise;
      }

      /*Calculation validation service*/

      function validateProduct(prodId, channelId, prodCode, data) {
        var q = $q.defer();
        $log.debug("the value of product code is ====", data);
        var errorMessage = [];
        /** mobile web provision **/
        var reqData;
        if(!isWeb){
            reqData =  $q.all([
                commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'ENTAGE', data.laAge),
                commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'SA', data.sumAssured),
                commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'ANNPRE', data.basePremium)
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
            $log.debug("response from base validation", values);
            if (values[0].length > 0)
              errorMessage.push(values[0][0]["ErrorMessage"]);
            if (values[1].length > 0)
              errorMessage.push(values[1][0]["ErrorMessage"]);
            q.resolve(errorMessage);
            if (values[2].length > 0)
              errorMessage.push(values[2][0]["ErrorMessage"]);
            q.resolve(errorMessage);
          });
        return q.promise;
      }




    }
  ]);
