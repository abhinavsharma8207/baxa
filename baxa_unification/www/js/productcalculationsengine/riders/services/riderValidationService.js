/*
service for premium Calculation here injecting all services
*/
unificationBAXA.service(
  'riderValidationService', [
    '$q',
    '$log',
    'commonFormulaSvc',
    'commonDBFuncSvc',
    'common_const',
    function(
      $q,
      $log,
      commonFormulaSvc,
      commonDBFuncSvc,
      common_const
    ) {
      'use strict';
      var rObj = this;
      rObj.riderPreADBValidateService = riderPreADBValidateService;
      rObj.riderPreEADBValidateService = riderPreEADBValidateService;
      rObj.riderPreHCValidateService = riderPreHCValidateService;
      rObj.riderPrePWRValidateService = riderPrePWRValidateService;
      rObj.getPWRProdCode = getPWRProdCode;
      rObj.isNSAPForPropser = isNSAPForPropser;
      function isNSAPForPropser(sumAssured){
          if(sumAssured <= common_const.constantToCompareSAForNSAPPrposer){
              return true;
          }else{
              return false;
          }
      }


      function getPWRProdCode(baseprodChannel, data) {
        var prodId;
        var option;
        var ref;
        if (data.PWRI) {
          option = 1;
          ref = 0;
          prodId = 6;
          $log.debug("PWRI");
        }
        if (data.PWRII) {
          option = 2;
          if (data.isSelf) {
            prodId = 7;
            ref = 0;
            $log.debug("PWRII-self");
          } else {
            prodId = 6;
            ref = 1;
            $log.debug("PWRII-nonself");
          }
        }
        if (data.PWRI && data.PWRII) {
          option = 1;
          ref = 1;
          prodId = 6;
          $log.debug("both");
        }
        if (data.PWRI || data.PWRII) {

          var q = $q.defer();
          var prodCode;
          /** mobile web provision **/
          var reqData;
          if (!isWeb) {
            reqData = commonDBFuncSvc.getParamValue(prodId, baseprodChannel, 'PRODCODE');
          } else {
            /**Provision for webapp code **/


            /**return values in array in then function**/
          }

          reqData.then(function(val) {
            $log.debug("prodId,channelId,data", prodId + "===" + 1 + "===" + option + "===" + ref);
            var ParamValueJson = JSON.parse(val);
            if (data.isSelf) {
              $log.debug('::getProdCode::', ParamValueJson);
              prodCode = ParamValueJson[data.ppt][0];
            } else {
              $log.debug('::getProdCode::', ParamValueJson[option][ref]);
              prodCode = ParamValueJson[option][ref];
            }
            $log.debug('::getProdCode::', prodCode);
            q.resolve(prodCode);
          });
          return q.promise;
        } else {
          return false;
        }
      }

      function riderPreADBValidateService(data, baseprodId, baseprodChannel, prodCode) {
        var q = $q.defer();
        $log.debug("data.ADBRider----", data);
        if (data.ADBRider) {

          var riderId = 4;
          var riderAge = 0;
          var errorMessage = [];
          var age;
          var benfitUptoBase;
          switch (parseInt(baseprodId)) {
            case 1:
              age = (data.laAgeDays) ? (data.laAgeDays) : (data.laAge);
              /*commonFormulaSvc.multiply(parseInt(data.laAge), 365);*/
              /*var pptInDays = commonFormulaSvc.multiply(parseInt(data.ppt), 365);*/
              benfitUptoBase = parseInt(data.benfitsUptoAgeSelected); /*commonFormulaSvc.add(age, pptInDays);*/
              riderAge = data.laAge;
              break;
            case 8:
              age = parseInt(data.laAge);
              if (data.uptoAge > 0) {
                benfitUptoBase = data.uptoAge;
              } else {
                benfitUptoBase = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.ppt));
              }
              riderAge = age;
              break;
            case 15:
              age = (data.laAgeDays) ? (data.laAgeDays) : (data.laAge);
              /*commonFormulaSvc.multiply(parseInt(laAge), 365);*/
              /*var ptInDays = commonFormulaSvc.multiply(parseInt(data.pt), 365);*/
              riderAge = parseInt(data.laAge);
              benfitUptoBase = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.ppt));
              break;
            default:
              age = parseInt(data.laAge);
              riderAge = age;
              benfitUptoBase = commonFormulaSvc.add(age, parseInt(data.pt));
          }
          /* var benfitUptoBase = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.ppt));*/
          $log.debug('benfitUptoBase', benfitUptoBase);
          var benfitUptoRider = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.riderterm));
          $log.debug('benfitUptoRider', benfitUptoRider);
          /** mobile web provision **/
          var reqData;
          if (!isWeb) {
            reqData = $q.all([
              commonDBFuncSvc.isInRange(baseprodId, baseprodChannel, prodCode, 'ENTAGE', age),
              commonDBFuncSvc.isInRange(baseprodId, baseprodChannel, prodCode, 'EXPAGE', benfitUptoBase),
              commonDBFuncSvc.isInRange(riderId, baseprodChannel, 'ADB', 'ENTAGE', riderAge),
              commonDBFuncSvc.isInRange(riderId, baseprodChannel, 'ADB', 'EXPAGE', benfitUptoRider),
              commonDBFuncSvc.isInRange(riderId, baseprodChannel, 'ADB', 'SA', data.sumAssuredForADBRiders),
              commonDBFuncSvc.isInRange(riderId, baseprodChannel, 'ADB', 'PPT', data.riderterm)
            ]);
          } else {
            /**Provision for webapp code **/


            /**return values in array in then function**/
          }
          reqData.then(function(messages) {
            $log.debug("+++++ADB", messages);
            var isValidBaseEntAge = messages[0];
            var isValidBaseExpAge = messages[1];
            var isValidRiderEntAge = messages[2];
            var isValidRiderExpAge = messages[3];
            var isValidRiderSA = messages[4];
            var isValidRiderPPt = messages[5];
            /* Age validation*/
            if (isValidBaseEntAge.length > 0 || isValidBaseExpAge.length > 0 || isValidRiderEntAge.length > 0 || isValidRiderExpAge.length > 0) {
              if (isValidBaseEntAge.length > 0)
                errorMessage.push(isValidBaseEntAge[0]);
              if (isValidBaseExpAge.length > 0)
                errorMessage.push(isValidBaseExpAge[0]);
              if (isValidRiderEntAge.length > 0)
                errorMessage.push(isValidRiderEntAge[0]);
              if (isValidRiderExpAge.length > 0)
                errorMessage.push(isValidRiderExpAge[0]);
            }
            /* EOF Age validation*/
            /*Sum Assured*/
            if (isValidRiderSA.length > 0) {
              errorMessage.push(isValidRiderSA[0]);
            }
            /*EOF Sum Assured*/
            /*ppt */
            if (isValidRiderPPt.length > 0) {
              errorMessage.push(isValidRiderPPt[0]);
            }
            /* EOF ppt*/
            $log.debug("+++++errorMessage", errorMessage);
            q.resolve(errorMessage);
          });
          //return q.promise;
        } else {
          q.resolve(false);
        }
        return q.promise;
      }

      function riderPreEADBValidateService(data, baseprodId, baseprodChannel, prodCode) {
        var q = $q.defer();
        $log.debug("data.EADBRider----", data);
        if (data.eADBRider) {

          var riderId = 18;
          var riderAge = 0;
          var errorMessage = [];
          var age;
          var benfitUptoBase;

              age = parseInt(data.laAge);
              riderAge = age;
              benfitUptoBase = commonFormulaSvc.add(age, parseInt(data.pt));

          /* var benfitUptoBase = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.ppt));*/
          $log.debug('benfitUptoBase', benfitUptoBase);
          var benfitUptoRider = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.riderterm));
          $log.debug('benfitUptoRider', benfitUptoRider);
          /** mobile web provision **/
          var reqData;
          if (!isWeb) {
            reqData = $q.all([
              commonDBFuncSvc.isInRange(baseprodId, baseprodChannel, prodCode, 'ENTAGE', age),
              commonDBFuncSvc.isInRange(baseprodId, baseprodChannel, prodCode, 'EXPAGE', benfitUptoBase),
              commonDBFuncSvc.isInRange(riderId, baseprodChannel, 'eADB', 'ENTAGE', riderAge),
              commonDBFuncSvc.isInRange(riderId, baseprodChannel, 'eADB', 'EXPAGE', benfitUptoRider),
              commonDBFuncSvc.isInRange(riderId, baseprodChannel, 'eADB', 'SA', data.sumAssuredForEADBRiders),
              commonDBFuncSvc.isInRange(riderId, baseprodChannel, 'eADB', 'PPT', data.riderterm)
            ]);
          } else {
            /**Provision for webapp code **/


            /**return values in array in then function**/
          }
          reqData.then(function(messages) {
            $log.debug("+++++ADB", messages);
            var isValidBaseEntAge = messages[0];
            var isValidBaseExpAge = messages[1];
            var isValidRiderEntAge = messages[2];
            var isValidRiderExpAge = messages[3];
            var isValidRiderSA = messages[4];
            var isValidRiderPPt = messages[5];
            /* Age validation*/
            if (isValidBaseEntAge.length > 0 || isValidBaseExpAge.length > 0 || isValidRiderEntAge.length > 0 || isValidRiderExpAge.length > 0) {
              if (isValidBaseEntAge.length > 0)
                errorMessage.push(isValidBaseEntAge[0]);
              if (isValidBaseExpAge.length > 0)
                errorMessage.push(isValidBaseExpAge[0]);
              if (isValidRiderEntAge.length > 0)
                errorMessage.push(isValidRiderEntAge[0]);
              if (isValidRiderExpAge.length > 0)
                errorMessage.push(isValidRiderExpAge[0]);
            }
            /* EOF Age validation*/
            /*Sum Assured*/
            if (isValidRiderSA.length > 0) {
              errorMessage.push(isValidRiderSA[0]);
            }
            /*EOF Sum Assured*/
            /*ppt */
            if (isValidRiderPPt.length > 0) {
              errorMessage.push(isValidRiderPPt[0]);
            }
            /* EOF ppt*/
            $log.debug("+++++errorMessage", errorMessage);
            q.resolve(errorMessage);
          });
          //return q.promise;
        } else {
          q.resolve(false);
        }
        return q.promise;
      }

      function riderPreHCValidateService(data, baseprodId, baseprodChannel, prodCode) {
        if (data.hospiCash) {
          var age;
          var benfitUptoBase;
          switch (parseInt(baseprodId)) {
            case 1:
              age = commonFormulaSvc.multiply(parseInt(data.laAge), 365);
              /*var pptInDays = commonFormulaSvc.multiply(parseInt(data.ppt), 365);*/
              benfitUptoBase = parseInt(data.benfitsUptoAgeSelected); /*commonFormulaSvc.add(age, pptInDays);*/
              break;
            case 8:
              age = parseInt(data.laAge);
              if (data.uptoAge > 0) {
                benfitUptoBase = data.uptoAge;
              } else {
                benfitUptoBase = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.ppt));
              }
              break;
            case 15:
              var laAge = (data.laAgeDays) ? (data.laAgeDays) : (data.laAge);
              age = laAge; /*commonFormulaSvc.multiply(parseInt(laAge), 365);*/
              /*var ptInDays = commonFormulaSvc.multiply(parseInt(data.pt), 365);*/
              benfitUptoBase = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.ppt));
              break;
            case 3:
              var laAge = (data.laAgeDays) ? (data.laAgeDays) : (data.laAge);
              age = laAge; /*commonFormulaSvc.multiply(parseInt(laAge), 365);*/
              /*var ptInDays = commonFormulaSvc.multiply(parseInt(data.pt), 365);*/
              benfitUptoBase = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.ppt));
              break;
            default:
              age = parseInt(data.laAge);
              benfitUptoBase = commonFormulaSvc.add(age, parseInt(data.pt));

          }
          var q = $q.defer();
          var riderId = 5;
          var errorMessage = [];
          /*var benfitUptoBase = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.ppt));*/
          $log.debug("data.hos", data.laAge + "====" + data.ppt);
          var benfitUptoRider = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.riderterm));
          var ageInDays = commonFormulaSvc.multiply(age, 365);
          /** mobile web provision **/
          var reqData;
          if (!isWeb) {
            reqData = $q.all([
              commonDBFuncSvc.isInRange(baseprodId, baseprodChannel, prodCode, 'ENTAGE', age),
              commonDBFuncSvc.isInRange(baseprodId, baseprodChannel, prodCode, 'EXPAGE', benfitUptoBase),
              commonDBFuncSvc.isInRange(riderId, baseprodChannel, 'HCRIDER', 'ENTAGE', ageInDays)
            ]);
          } else {
            /**Provision for webapp code **/


            /**return values in array in then function**/
          }
          reqData.then(function(messages) {
            $log.debug("+++++", messages);
            var isValidBaseEntAge = messages[0];
            var isValidBaseExpAge = messages[1];
            var isValidRiderEntAge = messages[2];
            /* Age validation*/
            if (isValidBaseEntAge.length > 0 || isValidBaseExpAge.length > 0 || isValidRiderEntAge.length > 0) {
              if (isValidBaseEntAge.length > 0)
                errorMessage.push(isValidBaseEntAge[0]);
              if (isValidBaseExpAge.length > 0)
                errorMessage.push(isValidBaseExpAge[0]);
              if (isValidRiderEntAge.length > 0)
                errorMessage.push(isValidRiderEntAge[0]);
            }
            /* EOF Age validation*/

            /*ppt
            if(isValidRiderPPt.length>0){
            	errorMessage.push(isValidRiderPPt[0]['ErrorMessage']);
            }
             EOF ppt*/
            q.resolve(errorMessage);
          });
          return q.promise;
        } else {
          return false;
        }
      }

      function riderPrePWRValidateService(data, baseprodId, baseprodChannel, prodCode) {
        var age;
        var benfitUptoBase;
        switch (parseInt(baseprodId)) {
          case 1:
            age = commonFormulaSvc.multiply(parseInt(data.proposerAge), 365);
            /*var pptInDays = commonFormulaSvc.multiply(parseInt(data.ppt), 365);*/
            benfitUptoBase = parseInt(data.benfitsUptoAgeSelected); /*commonFormulaSvc.add(age, pptInDays);*/
            break;
          case 8:
            age = parseInt(data.laAge);
            if (data.uptoAge > 0) {
              benfitUptoBase = data.uptoAge;
            } else {
              benfitUptoBase = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.ppt));
            }
            break;
          case 15:
            var laAge = (data.laAgeDays) ? (data.laAgeDays) : (data.laAge);
            age = laAge; /*commonFormulaSvc.multiply(parseInt(laAge), 365);*/
            /*var ptInDays = commonFormulaSvc.multiply(parseInt(data.pt), 365);*/
            benfitUptoBase = commonFormulaSvc.add(parseInt(data.laAge), parseInt(data.ppt));
            break;
          default:
            age = parseInt(data.proposerAge);
            benfitUptoBase = commonFormulaSvc.add(age, parseInt(data.ppt));
        }
        if (data.PWRI || data.PWRII) {
          var q = $q.defer();
          var errorMessage = [];
          getPWRProdCode(baseprodChannel, data)
            .then(function(pwrProdCode) {
              var riderProdCode = pwrProdCode;
              var riderId;
              if (data.PWRI) {
                riderId = 6;
              }
              if (data.PWRII) {
                if (data.isSelf) {
                  riderId = 7;
                } else {
                  riderId = 6;
                }
              }
              if (data.PWRI && data.PWRII) {
                riderId = 6;
              }
              //var q = $q.defer();
              //var benfitUptoBase = commonFormulaSvc.add(parseInt(data.proposerAge), parseInt(data.ppt));
              $log.debug('datarider::', data);
              var benfitUptoRider = commonFormulaSvc.add(parseInt(data.proposerAge), parseInt(data.ppt));
              /** mobile web provision **/
              var pptForValidation;
              if (riderId == 6) {
                pptForValidation = data.ppt;
              } else {
                //pptForValidation =  data.isSelf;
              }
              var reqData;
              if (!isWeb) {
                reqData = $q.all([
                  commonDBFuncSvc.isInRange(baseprodId, baseprodChannel, prodCode, 'ENTAGE', age),
                  commonDBFuncSvc.isInRange(baseprodId, baseprodChannel, prodCode, 'EXPAGE', benfitUptoBase),
                  commonDBFuncSvc.isInRange(riderId, baseprodChannel, riderProdCode, 'ENTAGE', data.proposerAge, pptForValidation),
                  commonDBFuncSvc.isInRange(riderId, baseprodChannel, riderProdCode, 'EXPAGE', benfitUptoRider, pptForValidation),
                  commonDBFuncSvc.isInRange(riderId, baseprodChannel, riderProdCode, 'RIDERTERM', data.ppt)

                ]);
              } else {
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
              reqData.then(function(messages) {
                $log.debug("pwr+++++", messages);
                var isValidBaseEntAge = messages[0];
                var isValidBaseExpAge = messages[1];
                var isValidRiderEntAge = messages[2];
                var isValidRiderExpAge = messages[3];
                var isValidRiderTerm = messages[4];
                /* Age validation*/
                if (isValidBaseEntAge.length > 0 || isValidBaseExpAge.length > 0 || isValidRiderEntAge.length > 0 || isValidRiderExpAge.length > 0) {
                  if (isValidBaseEntAge.length > 0)
                    errorMessage.push(isValidBaseEntAge[0]);
                  if (isValidBaseExpAge.length > 0)
                    errorMessage.push(isValidBaseExpAge[0]);
                  if (isValidRiderEntAge.length > 0)
                    errorMessage.push(isValidRiderEntAge[0]);
                  if (isValidRiderExpAge.length > 0)
                    errorMessage.push(isValidRiderExpAge[0]);
                  if (isValidRiderTerm.length > 0)
                    errorMessage.push(isValidRiderTerm[0]);
                }
                /* EOF Age validation*/
                q.resolve(errorMessage);
              });

            });
          return q.promise;

        } else {
          return false;
        }
      }

    }
  ]);
