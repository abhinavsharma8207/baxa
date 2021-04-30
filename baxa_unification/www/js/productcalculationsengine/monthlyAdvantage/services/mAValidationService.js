/*
service for premium Calculation here injecting all services
*/
productCalculator.service(
  'mAValidationService', [
    '$q',
    '$log',
    'commonFormulaSvc',
    'commonDBFuncSvc',
    'riderValidationService',
    'mADataFromDBSvc',
    'prodValidationService',
    function(
      $q,
      $log,
      commonFormulaSvc,
      commonDBFuncSvc,
      riderValidationService,
      mADataFromDBSvc,
      prodValidationService
    ) {
      'use strict';
      var cAObj = this;


      cAObj.validateBaseProduct = validateBaseProduct;
      cAObj.validateProduct     = validateProduct;


      function validateBaseProduct(prodId, channelId, data) {
        var q = $q.defer();
        var isValid = false;
        var prodVal;
        if (!isWeb) {
          prodVal = mADataFromDBSvc.getProdCodeMA(prodId, channelId, data.sumAssured, data.pt);

        } else {

        }
        prodVal.then(function(prodBaseCode) {
          var dbErrorMessages = [];
          var errorMessages = [];
          var reqData;
          if (!isWeb) {
            reqData = $q.all([
              prodValidationService.preCalculationValidateService(data, prodId, channelId, prodBaseCode),
              riderValidationService.riderPreADBValidateService(data, prodId, channelId, prodBaseCode),
              riderValidationService.riderPreHCValidateService(data, prodId, channelId, prodBaseCode),
            ]);
          } else {

          }

          reqData.then(function(validations) {
            $log.debug('validations>>>', validations);
            var val = validations[0];
            var adbRiderVal = validations[1];
            var hcRiderVal = validations[2];

            if (val.length > 0) {
              isValid = false;
              $log.debug('val>>>', val.length);
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

            /*before sending data repeat array and fetch error messages*/
            $log.debug("dbErrorMessages", dbErrorMessages);
            $log.debug("dbErrorMessages.length", dbErrorMessages.length);
            var i, item;
            for (i = 0; i < dbErrorMessages.length; i++) {
              for (item in dbErrorMessages[i]) {
                errorMessages.push(dbErrorMessages[i].ErrorMessage);
              }
            }
            q.resolve(dbErrorMessages);
          }); /*EOF Q ALL*/
        }); /* EOF get product*/
        return q.promise;
      }

      function validateProduct(prodId, channelId, data) {
        var q = $q.defer();
        var isValid = false;
        var prodVal;
        if (!isWeb) {
          prodVal = mADataFromDBSvc.getProdCodeMA(prodId, channelId, data.sumAssured, data.pt);

        } else {

        }
        prodVal.then(function(prodBaseCode) {
          var dbErrorMessages = [];
          var errorMessages = [];
          var reqData;
          if (!isWeb) {
            reqData = $q.all([
              prodValidationService.preCalculationValidateService(data, prodId, channelId, prodBaseCode)
              ]);
          } else {

          }

          reqData.then(function(validations) {
            $log.debug('validations>>>', validations);
            var val = validations[0];


            if (val.length > 0) {
              isValid = false;
              $log.debug('val>>>', val.length);
              dbErrorMessages.push(val);
            }


            /*before sending data repeat array and fetch error messages*/
            $log.debug("dbErrorMessages", dbErrorMessages);
            $log.debug("dbErrorMessages.length", dbErrorMessages.length);
            var i, item;
            for (i = 0; i < dbErrorMessages.length; i++) {
              for (item in dbErrorMessages[i]) {
                errorMessages.push(dbErrorMessages[i].ErrorMessage);
              }
            }
            q.resolve(dbErrorMessages);
          }); /*EOF Q ALL*/
        }); /* EOF get product*/
        return q.promise;
      }






    }
  ]);
