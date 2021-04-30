/*
service for premium Calculation here injecting all services
*/
productCalculator.service(
  'ePValidationService', [
    '$q',
    '$log',
    'commonFormulaSvc',
    'commonDBFuncSvc',
    'riderValidationService',
    'ePDataFromDBSvc',
    'prodValidationService',
    function(
      $q,
      $log,
      commonFormulaSvc,
      commonDBFuncSvc,
      riderValidationService,
      ePDataFromDBSvc,
      prodValidationService
    ) {
      'use strict';
      var ePObj = this;


      ePObj.validateBaseProduct = validateBaseProduct;


      function validateBaseProduct(prodId, channelId, data) {
        var q = $q.defer();
        var isValid = false;
        var prodVal;
        if (!isWeb) {
          prodVal = ePDataFromDBSvc.getProdCodeEP(prodId, channelId, data);

        } else {

        }
        prodVal.then(function(prodBaseCode) {
          var dbErrorMessages = [];
          var errorMessages = [];
          var reqData;
          if (!isWeb) {
            reqData = $q.all([
              prodValidationService.preCalculationValidateAgeService(data, prodId, channelId, prodBaseCode),
              prodValidationService.preCalculationValidatePremiumService(data, prodId, channelId, prodBaseCode),
              riderValidationService.riderPreHCValidateService(data, prodId, channelId, prodBaseCode),
              riderValidationService.riderPreEADBValidateService(data, prodId, channelId, prodBaseCode)
            ]);
          } else {

          }

          reqData.then(function(validations) {
            $log.debug('validations>>>', validations);
            var ageVal = validations[0];
            var sAVal = validations[1];
            var hcRiderVal = validations[2];
            var eAdbRiderVal =  validations[3];

            if (ageVal.length > 0) {
              isValid = false;
              $log.debug('val>>>', ageVal.length);
              dbErrorMessages.push(ageVal);
            }
            if (sAVal.length > 0) {
              isValid = false;
              $log.debug('val>>>', sAVal.length);
              dbErrorMessages.push(sAVal);
            }
            if (ageVal.length == 0 && sAVal.length == 0 &&  data.eADBRider && eAdbRiderVal.length > 0) {
              isValid = false;
              $log.debug('riderVal>>>', validations);
              dbErrorMessages.push(eAdbRiderVal);
          }
            if (ageVal.length == 0 && sAVal.length == 0 && data.hospiCash && hcRiderVal.length > 0) {
              isValid = false;
              $log.debug('hcRiderVal>>>', validations);
              dbErrorMessages.push(hcRiderVal);
            }

            /*before sending data repeat array and fetch error messages*/
            $log.debug("dbErrorMessages", dbErrorMessages);
            $log.debug("dbErrorMessages.length", dbErrorMessages.length);
            var i, item;
            for (i = 0; i < dbErrorMessages.length; i++) {
                $log.debug("inside",dbErrorMessages[i]);

                  $log.debug("iinner",i+"=="+dbErrorMessages[i][0]);
                errorMessages.push(dbErrorMessages[i][0]);

            }
            $log.debug("rroee",errorMessages);
            q.resolve(errorMessages);
          }); /*EOF Q ALL*/
        }); /* EOF get product*/
        return q.promise;
      }








    }
  ]);
