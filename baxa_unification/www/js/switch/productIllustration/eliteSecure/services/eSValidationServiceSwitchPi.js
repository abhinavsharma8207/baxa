switchModule.service('eSValidationServiceSwitchPi', ['$log',
  '$q',
  'utilityService',
  'commonDBFuncSvc',
  function($log, $q, utilityService, commonDBFuncSvc) {
    'use strict';

    var vm = this;

    vm.EaDbValidationData = EaDbValidationData;
    vm.getESProductCode = getESProductCode;
    vm.preEACalculationValidateService = preEACalculationValidateService;

    function EaDbValidationData(prodId, channelId, data, pt) {
      $log.debug("the value of the ppttt", pt);
      $log.debug("the value of the currentage is", data.laAge);

      var q = $q.defer();
      var isValid = false;
      getESProductCode(prodId, channelId, pt)
        .then(function(prodCode) {
          $log.debug('the value of the prodeCode is', prodCode);
          var prodBaseCode = prodCode;
          var dbErrorMessages = [];
          $q.all([
            preEACalculationValidateService(data, prodId, channelId, prodBaseCode),
          ]).then(function(validations) {
            $log.debug('the validation value is as fallows', validations[0]);
            var val = validations[0];
            if (val.length > 0) {
              isValid = false;
              $log.debug('val>>>', validations);
              dbErrorMessages.push(val);
            }
            q.resolve(dbErrorMessages);
          });
        });
      return q.promise;
    };

    function preEACalculationValidateService(data, prodId, channelId, prodBaseCode) {
      var q = $q.defer();
      var errorMessage = [];
      $log.debug("getCode:::", prodBaseCode + "==" + data.ppt + "==" + data.laAge);
      // var validationMessages = $q.all([
      //     commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode, 'ENTAGE', data.laAge),
      //     commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode, 'SA', data.sumAssured)
      //   ])
      //   .then(function(messages) {
      //     $log.debug('messages', messages);
      //     $log.debug('the validation value is as fallows', messages);
      //     var isValidage = messages[0];
      //     var isValidSA = messages[1];
      //
      //     $log.debug(isValidage + "|||" + isValidSA + "|||");
      //     if (isValidage.length > 0)
      //       errorMessage.push(isValidage[0]['ErrorMessage']);
      //     if (isValidSA.length > 0)
      //       errorMessage.push(isValidSA[0]['ErrorMessage']);
      //     q.resolve(errorMessage);
      //   });
      var reqData;
      if (!isWeb) {
        reqData = $q.all([
          commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode, 'ENTAGE', data.laAge),
          commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode, 'SA', data.sumAssured)
        ]);
      } else {
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



    // function validateProduct(prodId, channelId, prodCode, data) {
    //   var q = $q.defer();
    //   //$log.debug("the value of product code is ====", prodCode);
    //   var errorMessage = [];
    //   /** mobile web provision **/
    //   var reqData;
    //   if(!isWeb){
    //       reqData = $q.all([
    //           commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'ENTAGE', data.laAge),
    //           commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'ANNPRE', data.basePremium)
    //           //commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'SA', data.sumAssured),
    //       ]);
    //   }else{
    //     /**Provision for webapp code **/
    //
    //
    //     /**return values in array in then function**/
    //   }
    //   reqData.then(function(values) {
    //       //$log.debug("response from base validation", values);
    //       var entAgeMessage = values[0];
    //       var saMessage = values[1];
    //
    //       if (entAgeMessage.length)
    //         errorMessage.push(entAgeMessage[0]);
    //       if (saMessage.length > 0)
    //         errorMessage.push(saMessage[0]);
    //       q.resolve(errorMessage);
    //     });
    //   return q.promise;
    // }




    function getESProductCode(prodId, channelId, ppt) {
      var q = $q.defer();
      var temp = commonDBFuncSvc.getParamValue(prodId, channelId, 'PRODCODE')
        .then(function(val) {
          var ParamValueJson = JSON.parse(val);
          $log.debug('::getProdCode::', ParamValueJson[ppt][0]);
          var prodCode = ParamValueJson[ppt][0];
          q.resolve(prodCode);
        });

      return q.promise;
    }


  }
]);
