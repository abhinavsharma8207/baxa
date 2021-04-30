/*
service for validation here injecting all services
*/
productCalculator.service(
  'tHValidationService', [
    '$q',
    '$log',
    'commonFormulaSvc',
    'commonDBFuncSvc',
    'trippleHealthDataFromUserSvc',
    'trippleHealthDataFromDBSvc',
    'riderValidationService',

    function(
      $q,
      $log,
      commonFormulaSvc,
      commonDBFuncSvc,
      trippleHealthDataFromUserSvc,
      trippleHealthDataFromDBSvc,
      riderValidationService
    ) {
      'use strict';
      var tHObj = this;
      var reqData = "";
      tHObj.getProductCode = getProductCode;
      tHObj.validateBaseProduct = validateBaseProduct;
      tHObj.validateProduct = validateProduct;
      tHObj.minimumPremiumValidation = minimumPremiumValidation;
      tHObj.validateRiderHCProduct = validateRiderHCProduct;
      tHObj.postTHCalculationValidateService = tHObj.postTHCalculationValidateService;

      /*Function for getting productcode*/
      function getProductCode(prodId, channelId, ppt) {
        var q = $q.defer();
        if (!isWeb) {
          reqData = commonDBFuncSvc.getParamValue(prodId, channelId, 'PRODCODE');
        } else {
          /**Provision for webapp code **/


          /**return values in array in then function**/
        }

        reqData.then(function(val) {
          var prodCode = val;
          /*  $log.debug('::getProdCode is::', val);*/
          q.resolve(prodCode);
        });

        return q.promise;
      }

      function validateRiderHCProduct(prodId, channelId, data) {
        var q = $q.defer();
        var isValid = false;
        /** mobile web provision **/
        var reqData;
        if (!isWeb) {
          reqData = getProductCode(prodId, channelId, data.ppt);
        } else {
          /**Provision for webapp code **/
          /**return values in array in then function**/
        }

        reqData.then(function(prodCode) {
          var prodBaseCode = prodCode;
          var dbErrorMessages = [];


          var validationQuery;
          if (!isWeb) {
            validationQuery = $q.all([
              riderValidationService.riderPreHCValidateService(data, prodId, channelId, prodBaseCode)
            ]);
          } else {
            /**Provision for webapp code **/


            /**return values in array in then function**/
          }

          validationQuery.then(function(validations) {
            $log.debug('validations>>>', validations);
            var hcRiderVal = validations[0];
            if (hcRiderVal.length > 0) {
              isValid = false;
              dbErrorMessages.push(hcRiderVal);
            }
            q.resolve(dbErrorMessages);
          }); /*EOF Q ALL*/
        }); /* EOF get product*/
        return q.promise;
      }

      function validateBaseProduct(prodId, channelId, data) {
        var q = $q.defer();
        var isValid = false;
        /** mobile web provision **/
        var reqData;
        if (!isWeb) {
          reqData = getProductCode(prodId, channelId, data.ppt);
        } else {
          /**Provision for webapp code **/


          /**return values in array in then function**/
        }

        reqData.then(function(prodCode) {
          var prodBaseCode = prodCode;
          var dbErrorMessages = [];

          var validationQuery;
          if (!isWeb) {
            validationQuery = $q.all([
              validateProduct(prodId, channelId, data),
              //  riderValidationService.riderPreHCValidateService(data, prodCode, channelId, prodBaseCode)
              validateRiderHCProduct(prodId, channelId, data)
            ]);
          } else {
            /**Provision for webapp code **/


            /**return values in array in then function**/
          }

          validationQuery.then(function(validations) {
            /*  $log.debug('validations>>>', validations);*/
            var val = validations[0];
            var hcRiderVal = validations[1];
            if (val.length > 0) {
              isValid = false;
              dbErrorMessages.push(val);
            }
            if (val.length === 0 && data.hospiCash && hcRiderVal.length > 0) {
              isValid = false;
              dbErrorMessages.push(hcRiderVal);
            }
            q.resolve(dbErrorMessages);
          }); /*EOF Q ALL*/
        }); /* EOF get product*/
        return q.promise;
      }

      function validateProduct(prodId, channelId, data) {
        var q = $q.defer();
        var errorMessage = [];
        /** mobile web provision **/
        var reqData;
        if (!isWeb) {
          reqData = getProductCode(prodId, channelId, data.ppt);
        } else {
          /**Provision for webapp code **/
          /**return values in array in then function**/
        }

        reqData.then(function(prodCode) {
          var prodBaseCode = prodCode;

          /** mobile web provision **/
          var validationQuery;
          if (!isWeb) {
            validationQuery = $q.all([
              commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'ENTAGE', data.laAge),
              commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'SA', data.sumAssured)
            ]);
          } else {
            /**Provision for webapp code **/
            /**return values in array in then function**/
          }

          validationQuery.then(function(values) {
            var entAgeMessage = values[0];
            var saMessage = values[1];

            if (entAgeMessage.length)
              errorMessage.push(entAgeMessage[0]);
            if (saMessage.length > 0)
              errorMessage.push(saMessage[0]);
            q.resolve(errorMessage);
          });
        });
        return q.promise;
      }

      /*function for getting minimumPremium */
      function minimumPremiumValidation(prodId, channelId, premiumbase) {
        var q = $q.defer();
        var ppt;
        var prodCode;
        /** mobile web provision **/
        var reqData;
        if (!isWeb) {
          reqData = getProductCode(prodId, channelId, ppt);
        } else {
          /**Provision for webapp code **/


          /**return values in array in then function**/
        }
        reqData.then(function(values) {
          var prodCode = values;
          /** mobile web provision **/
          var validationQuery;
          if (!isWeb) {
            validationQuery = commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'ANNPRE', premiumbase);
          } else {
            /**Provision for webapp code **/


            /**return values in array in then function**/
          }

          validationQuery.then(function(values) {
            /*  $log.debug('values of baseanuual is', values);*/
            q.resolve(values);
          });
          return q.promise;

        });


      }

    }
  ]);
