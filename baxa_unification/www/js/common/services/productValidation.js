/*
service for premium Calculation here injecting all services
*/
unificationBAXA.service('prodValidationService', [
  '$q',
  '$log',
  'commonFormulaSvc',
  'commonDBFuncSvc',
  'riderValidationService',
  function(
    $q,
    $log,
    commonFormulaSvc,
    commonDBFuncSvc,
    riderValidationService
  ) {
    'use strict';
    var pObj = this;
    pObj.preCalculationValidateService = preCalculationValidateService;
    pObj.preCalculationValidateAgeService = preCalculationValidateAgeService;
    pObj.preCalculationValidatePremiumService = preCalculationValidatePremiumService;
    pObj.preCalculationValidateSAService = preCalculationValidateSAService;

    function preCalculationValidateService(data, prodId, channelId, prodBaseCode) {
      var q = $q.defer();
      var errorMessage = [];
      $log.debug("getCode:::", prodBaseCode + "==" + data.ppt + "==" + data.maturityPremiumMode);
      /** mobile web provision **/
      var reqData;
      var paramNameForPrem;
      var benfitUptoBase;
      var age;
      var laAge;


      switch (parseInt(data.premiumMode)) {
        case 1:
          paramNameForPrem = 'ANNPRE';
          break;
        case 2:
          paramNameForPrem = 'SANPRE';
          break;
        case 4:
          paramNameForPrem = 'QUAPRE';
          break;
        case 12:
          paramNameForPrem = 'MONPRE';
          break;
        default:

      }
      switch (parseInt(prodId)) {
        case 1:
        $log.debug("************-----------------------**********************data", data);
          laAge = (data.laAgeDays) ? (data.laAgeDays) : (commonFormulaSvc.multiply(parseInt(data.laAge), 365));
          age = laAge;/*commonFormulaSvc.multiply(parseInt(laAge), 365);*/
          /*var pptInDays = commonFormulaSvc.multiply(parseInt(data.ppt), 365);*/
          benfitUptoBase = parseInt(data.benfitsUptoAgeSelected); /*commonFormulaSvc.add(age, pptInDays);*/
          break;
        case 15:

          laAge = (data.laAgeDays)?(data.laAgeDays):(commonFormulaSvc.multiply(parseInt(data.laAge), 365));
          age = laAge;/*commonFormulaSvc.multiply(parseInt(laAge), 365);*/
          /*var ptInDays = commonFormulaSvc.multiply(parseInt(data.pt), 365);*/
          benfitUptoBase = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.pt));
          break;
        default:
          age = parseInt(data.laAge);
          benfitUptoBase = commonFormulaSvc.add(age, parseInt(data.pt));

      }
      $log.debug("data.CA", data.laAge + "====" + data.pt + "===" + benfitUptoBase);



      if (!isWeb) {
        reqData = $q.all([
          commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode, 'ENTAGE', age),
          commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode, 'EXPAGE', benfitUptoBase),
          commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode, 'SA', data.sumAssured),
          commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode, paramNameForPrem, data.basePremium)
        ]);
      } else {
        /**Provision for webapp code **/
        /**
            for web team needs to get promices after webservice call for
        **/
        /**return values in array in then function**/
      }
      reqData.then(function(messages) {
        $log.debug('messages', messages);
        var isValidBaseEntAge = messages[0];
        var isValidBaseExpAge = messages[1];
        var isValidSA = messages[2];
        var isValidPremium = messages[3];
        $log.debug(isValidBaseEntAge + "|||" + isValidPremium);
        $log.debug(isValidBaseEntAge.length + "|||" + isValidPremium.length);
        if (isValidBaseEntAge.length > 0)
          errorMessage.push(isValidBaseEntAge[0]);
        if (isValidBaseExpAge.length > 0)
          errorMessage.push(isValidBaseExpAge[0]);
        if (isValidSA.length > 0)
          errorMessage.push(isValidSA[0]);
        if (isValidPremium.length > 0)
          errorMessage.push(isValidPremium[0]);
        q.resolve(errorMessage);
      });
      return q.promise;
    }
    function preCalculationValidateAgeService(data, prodId, channelId, prodBaseCode) {
      var q = $q.defer();
      var errorMessage = [];
      /** mobile web provision **/
      var reqData;
      var benfitUptoBase;
      var age;
      var laAge;



      switch (parseInt(prodId)) {
        case 1:
        $log.debug("************-----------------------**********************data", data);
          laAge = (data.laAgeDays) ? (data.laAgeDays) : (commonFormulaSvc.multiply(parseInt(data.laAge), 365));
          age = laAge;/*commonFormulaSvc.multiply(parseInt(laAge), 365);*/
          /*var pptInDays = commonFormulaSvc.multiply(parseInt(data.ppt), 365);*/
          benfitUptoBase = parseInt(data.benfitsUptoAgeSelected); /*commonFormulaSvc.add(age, pptInDays);*/
          break;
        case 15:
          laAge = (data.laAgeDays)?(data.laAgeDays):(commonFormulaSvc.multiply(parseInt(data.laAge), 365));
          age = laAge;/*commonFormulaSvc.multiply(parseInt(laAge), 365);*/
          /*var ptInDays = commonFormulaSvc.multiply(parseInt(data.pt), 365);*/
          benfitUptoBase = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.pt));
          break;
          
        default:
          age = parseInt(data.laAge);
          benfitUptoBase = commonFormulaSvc.add(age, parseInt(data.pt));

      }
      $log.debug("data.CA", data.laAge + "====" + data.pt + "===" + benfitUptoBase);



      if (!isWeb) {
        reqData = $q.all([
          commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode, 'ENTAGE', age),
          commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode, 'EXPAGE', benfitUptoBase)

        ]);
      } else {
        /**Provision for webapp code **/
        /**
            for web team needs to get promices after webservice call for
        **/
        /**return values in array in then function**/
      }
      reqData.then(function(messages) {
        $log.debug('messages-Age', messages);
        var isValidBaseEntAge = messages[0];
        var isValidBaseExpAge = messages[1];
        $log.debug("isValidBaseExpAge.length", isValidBaseExpAge.length);
        $log.debug("isValidBaseEntAge.length", isValidBaseEntAge.length);

        if (isValidBaseEntAge.length > 0)
          errorMessage.push(isValidBaseEntAge[0]);
        if (isValidBaseExpAge.length > 0)
          errorMessage.push(isValidBaseExpAge[0]);
        q.resolve(errorMessage);
      });
      return q.promise;
    }
    function preCalculationValidatePremiumService(data, prodId, channelId, prodBaseCode) {
      var q = $q.defer();
      var errorMessage = [];
      /** mobile web provision **/
      var reqData;
      var paramNameForPrem;
      var benfitUptoBase;



      switch (parseInt(data.premiumMode)) {
        case 1:
          paramNameForPrem = 'ANNPRE';
          break;
        case 2:
          paramNameForPrem = 'SANPRE';
          break;
        case 4:
          paramNameForPrem = 'QUAPRE';
          break;
        case 12:
          paramNameForPrem = 'MONPRE';
          break;
        default:

      }


      if (!isWeb) {
        reqData = $q.all([
          commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode, paramNameForPrem, data.basePremium)
        ]);
      } else {
        /**Provision for webapp code **/
        /**
            for web team needs to get promices after webservice call for
        **/
        /**return values in array in then function**/
      }
      reqData.then(function(messages) {
        $log.debug('messages-Prem', messages[0]);
        var isValidPremium = messages[0];
        if (isValidPremium.length > 0)
          errorMessage.push(isValidPremium);
        q.resolve(errorMessage);
      });
      return q.promise;
    }
    function preCalculationValidateSAService(data, prodId, channelId, prodBaseCode) {
      var q = $q.defer();
      var errorMessage = [];
      $log.debug("getCode:::", prodBaseCode + "==" + data.ppt + "==" + data.maturityPremiumMode);
      /** mobile web provision **/
      var reqData;
      var laAge;


      if (!isWeb) {
        reqData = commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode, 'SA', data.sumAssured);
        } else {
        /**Provision for webapp code **/
        /**
            for web team needs to get promices after webservice call for
        **/
        /**return values in array in then function**/
      }
      reqData.then(function(messages) {
        $log.debug('messages-SA', messages[0]);
        var isValidSA = messages[0];
        $log.debug(isValidBaseEntAge + "|||" + isValidPremium);
        $log.debug(isValidBaseEntAge.length + "|||" + isValidPremium.length);
        if (isValidSA.length > 0)
          errorMessage.push(isValidSA);

        q.resolve(errorMessage);
      });
      return q.promise;
    }
  }
]);
