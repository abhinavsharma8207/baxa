/*
service for premium Calculation here injecting all services
validations of PCS sheet
developer Anushree k
*/
productCalculator.service(
  'asValidationService', [
    '$q',
    '$log',
    'commonFormulaSvc',
    'commonDBFuncSvc',
    'riderValidationService',
    'policyDataFromDBSvc',
    'prodValidationService',
    function(
      $q,
      $log,
      commonFormulaSvc,
      commonDBFuncSvc,
      riderValidationService,
      policyDataFromDBSvc,
      prodValidationService
    ) {
      'use strict';
      var asObj = this;
      asObj.validateBaseProduct = validateBaseProduct;
			asObj.validateProduct = validateProduct;

			function validateProduct(prodId, channelId, data) {
        var q = $q.defer();
        var isValid = false;
        var prodVal;

        if (!isWeb) {
          prodVal = policyDataFromDBSvc.getProdCodeAS(prodId, channelId, data.benfitsUptoAgeSelected, data.ppt);
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
              dbErrorMessages.push(val[0]);
            }

            /*before sending data repeat array and fetch error messages*/
            $log.debug("dbErrorMessages", dbErrorMessages);
            $log.debug("dbErrorMessages.length", dbErrorMessages.length);
            var i, item;
            for (i = 0; i < dbErrorMessages.length; i++) {
              /*for (item in dbErrorMessages[i]) {*/
              errorMessages.push(dbErrorMessages[i]);
              /*}*/
            }
            q.resolve(errorMessages);
          }); /*EOF Q ALL*/
        }); /* EOF get product*/
        return q.promise;
      }

      function validateBaseProduct(prodId, channelId, data) {
        var q = $q.defer();
        var isValid = false;
        var prodVal;

        if (!isWeb) {
          prodVal = policyDataFromDBSvc.getProdCodeAS(prodId, channelId, data.benfitsUptoAgeSelected, data.ppt);
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
              riderValidationService.riderPrePWRValidateService(data, prodId, channelId, prodBaseCode)
            ]);
          } else {

          }

          reqData.then(function(validations) {
            $log.debug('validations>>>', validations);
            var val = validations[0];
            var adbRiderVal = validations[1];
            var hcRiderVal = validations[2];
            var pwrRiderVal = validations[3];
            if (val.length > 0) {
              isValid = false;
              $log.debug('val>>>', val.length);
              dbErrorMessages.push(val[0]);
            }
            if (val.length == 0 && data.ADBRider && adbRiderVal.length > 0) {
              isValid = false;
              $log.debug('riderVal>>>', validations);
              dbErrorMessages.push(adbRiderVal[0]);
            }
            if (val.length == 0 && data.hospiCash && hcRiderVal.length > 0) {
              isValid = false;
              $log.debug('hcRiderVal>>>', validations);
              dbErrorMessages.push(hcRiderVal[0]);
            }
            if (val.length == 0 && (data.PWRI || data.PWRII) && pwrRiderVal.length > 0) {
              isValid = false;
              $log.debug('pwrRiderVal>>>', validations);
              dbErrorMessages.push(pwrRiderVal);
            }

            /*before sending data repeat array and fetch error messages*/
            $log.debug("dbErrorMessages", dbErrorMessages);
            $log.debug("dbErrorMessages.length", dbErrorMessages.length);
            var i, item;
            for (i = 0; i < dbErrorMessages.length; i++) {
              /*for (item in dbErrorMessages[i]) {*/
              errorMessages.push(dbErrorMessages[i].ErrorMessage);
              /*}*/
            }
            q.resolve(errorMessages);
          }); /*EOF Q ALL*/
        }); /* EOF get product*/
        return q.promise;
      }






    }
  ]);
