eAppModule.service(
  'eAppServices', [
    '$q',
    '$log',
    'eAppDataServices',
    'commonDBFuncSvc',
    'commonDbProductCalculation',
    function($q, $log, eAppDataServices, commonDBFuncSvc, commonDbProductCalculation) {
      var obj = this;
      obj.getLaAge = getLaAge;
      obj.getPropAge = getPropAge;
      obj.setRiderHCData = setRiderHCData;
      obj.getRiderHCData = getRiderHCData;
      obj.setRiderADBData = setRiderADBData;
      obj.getRiderADBData = getRiderADBData;
      obj.setRiderPWRData = setRiderPWRData;
      obj.getRiderPWRData = getRiderPWRData;
      obj.getParamValue = getParamValue;
      obj.getGenericValue = getGenericValue;
      obj.getCalcDetails = getCalcDetails;
      obj.setCalcDetails = setCalcDetails;
      obj.getBuyForDetails = getBuyForDetails;
      obj.setBuyForDetails = setBuyForDetails;
      obj.getInputDetails = getInputDetails;
      obj.setInputDetails = setInputDetails;
      obj.getOutputDetails = getOutputDetails;
      obj.setOutputDetails = setOutputDetails;
      obj.resetScreenData = resetScreenData;
      obj.renderInputScreen = renderInputScreen;
      obj.getPolyOrPreminumTerm = getPolyOrPreminumTerm;
      obj.getModalPremiumFromSumAssured = getModalPremiumFromSumAssured;
      obj.getModalPremiumFromAnnualPremium = getModalPremiumFromAnnualPremium;

      var riderHSData = {},
        riderADBData = {},
        riderPWRData = {},
        buyForScreenData = {},
        inputScreenData = {},
        outputScreenData = {},
        caclScreenData = {};
      var hospiCashRiderId = 5,
        adbRiderId = 4,
        pwrRiderId = 6;

      function setRiderHCData(data) {
        riderHSData = data;
      }

      function getRiderHCData() {
        return riderHSData;
      }

      function setRiderPWRData(data) {
        riderPWRData = data;
      }

      function getRiderPWRData() {
        return riderPWRData;
      }

      function setRiderADBData(data) {
        riderADBData = data;
      }

      function getRiderADBData() {
        return riderADBData;
      }
      //*** BuyingFor Screen Validation based on ProductID and ChannelID ***//
      function getLaAge(prodId, channelId, days) {
        days = (!days) ? (false) : (days);
        if (prodId !== "" && channelId !== "") {
          var returnVar = {};
          var q = $q.defer();
          var parameters = ["" + prodId, "" + channelId, ""];
          commonDBFuncSvc.getAgeValidationData(prodId, channelId, "FkValidationTypeId = 1", days)
            .then(function(result) {
              $log.debug("+++++++++++++++++++++++++++", result);
              q.resolve(result);
            });
          return q.promise;
        } else {
          return false;
        }
      }

      function getPropAge(prodId, channelId, days) {
        days = (!days) ? (false) : (days);
        if (prodId !== "" && channelId !== "") {
          var returnVar = {};
          var q = $q.defer();
          var parameters = ["" + prodId, "" + channelId];
          commonDBFuncSvc.getAgeValidationData(prodId, channelId, "NAME = 'PROPAGE'", days)
            .then(function(result) {
              q.resolve(result);
            });
          return q.promise;
        } else {
          return false;
        }
      }
      //*** BuyingFor Screen Validation based on ProductID and ChannelID ***//

      //** Screen Based Page Data Service **//
      function getBuyForDetails() {
        return buyForScreenData;
      }

      function setBuyForDetails(data) {
        buyForScreenData = data;
      }

      function getInputDetails() {
        return inputScreenData;
      }

      function setInputDetails(data) {
        inputScreenData = data;
      }

      function getOutputDetails() {
        return outputScreenData;
      }

      function setOutputDetails(data) {
        outputScreenData = data;
      }

      function getCalcDetails() {
        return caclScreenData;
      }

      function setCalcDetails(data) {
        caclScreenData = data;
      }

      function resetScreenData() {
        setBuyForDetails([]);
        setInputDetails([]);
        setOutputDetails([]);
        return true;
      }
      //** Screen Based Page Data Service **//

      //** Get Poly Terms or Preminum Terms **//
      function getPolyOrPreminumTerm(ppt, factor) {
        if (factor && ppt in factor) {
          return factor[parseInt(ppt)][0];
        } else {
          return 0;
        }
      }
      //** Get Poly Terms or Preminum Terms **//

      //** Get Modal Preminum From SumAssured or Anual Preminum **//
      function getModalPremiumFromAnnualPremium(mode, annual, factor) {
        if (annual > 0 && mode in factor) {
          return (parseInt(annual) * parseFloat(factor[parseInt(mode)][0]));
        } else {
          return 0;
        }
      }

      function getModalPremiumFromSumAssured(annual, factor) {
        var q = $q.defer();
        if (annual > 0 && annual in factor) {
          q.resolve(parseInt(annual) * parseFloat(factor[parseInt(annual)][0]));
        } else {
          q.resolve(0);
        }

        return q.promise;
      }
      //** Get Modal Preminum From SumAssured or Anual Preminum **//

      //** Riders Calculation **//
      function riderCalculationHospiCash() {
        var q = $q.defer();
        var showDbErrors = false;
        var dbError = "";

        tHValidationService.validateRiderHCProduct(prodId, channelId, data)
          .then(function(messages) {
            if (messages.length === 0) {
              showDbErrors = false;
              calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospiCashRiderId, prodId, channelId, data.base)
                .then(function(result) {
                  data.riderPremium = parseFloat(result.riderPremium);
                  data.annualHospiCashPremium = parseFloat(result.annualHospiCashPremium);
                  data.benfitUptoAge = parseFloat(result.benfitUptoAge);
                  data.modalHospiCashPremium = parseFloat(result.modalHospiCashPremium);
                  data.modalHospiRiderWithServiceTax = parseFloat(result.modalHospiRiderWithServiceTax);
                  data.percentOfBasePremium = parseFloat(result.percentOfBasePremium);
                  data.totalPremium = parseFloat(result.totalPremium);
                });
              q.resolve({
                'error': false,
                'data': data
              });
            } else {
              showDbErrors = true;
              dbErrors = [];
              for (var e = 0; e < messages.length; e++) {
                var key = messages[e].Name;
                dbErrors[key] = messages[e].ErrorMessage;
              }
              q.resolve({
                'error': true,
                'data': dbErrors
              });
            }
          });
        return q.promise;
      }
      //** Riders Calculation **//

      //** Input Screen **//
      function renderInputScreen(prodId, channelId, params, mstparams) {
        var q = $q.defer();
        var returnVars = [];
        params = (params && params.length > 0) ? (params) : (["GENDER", "BUYPOLFOR", "PMODE", "PPT", "PT", "MPP", "MPF"]);

        //=======> Get All Product Riders
        commonDBFuncSvc.getProductRiders(prodId, channelId)
          .then(function(result) {
            var prodRiders = [];
            $log.debug("getProductRiders Result", result);
            if (result.Rider) {
              prodRiders = result.Rider.split(",");
            }
            $q.all([
                commonDbProductCalculation.getAllStaticValuesByArray(prodId, channelId, params),
                commonDBFuncSvc.getParamValueByArray(prodId, channelId, mstparams),
              ])
              .then(function(result) {
                $log.debug("getAllStaticValuesByArray", result);
                var buyForInputOptions = result[0];
                var riderHCOptions = result[1];
                returnVars.push(buyForInputOptions);
                returnVars.push(riderHCOptions);

                //==========> If Product is HospiCash
                if (prodRiders.indexOf("" + hospiCashRiderId) !== -1) {
                  commonDbProductCalculation.getAllStaticValuesByArray(hospiCashRiderId, channelId, ["DHCB", "RTERM"])
                    .then(function(hReturn) {
                      returnVars.push(hReturn);
                      q.resolve(returnVars);
                    });
                } else {
                  q.resolve(returnVars);
                }
              });
          });
        return q.promise;
      }

      function getParamValue(prodId, channelId, paramName) {
        var q = $q.defer();
        commonDBFuncSvc.getParamValue(prodId, channelId, paramName)
          .then(function(result) {
            q.resolve(result);
          });
        return q.promise;
      }

      function getGenericValue(prodId, channelId, paramName) {
        var q = $q.defer();
        commonDBFuncSvc.getParamValueByArray(prodId, channelId, paramName)
          .then(function(result) {
            q.resolve(result);
          });
        return q.promise;
      }
      //** Input Screen **//
    }
  ]);
