/**
 * Created By: Atul A
 * Flexi Save Calculation Controller
 *
 * @class fSCalculationController
 * @submodule core-controller
 * @constructor
 */
productCalculator.controller(
  'fSCalculationController', [
    '$scope',
    '$state',
    '$log',
    'fSDataFromDBSvc',
    'fSCalculationService',
    'adbRiderForASDataFromUserSvc',
    'calculateAdbRiderPremiumSvc',
    'hospiCashRiderDataFromUserSvc',
    'calculatehospiCashRiderPremiumSvc',
    'pwrRiderDataFromUserSvc',
    'calculatePwrRiderPremiumSvc',
    'fSValidationService',
    'getSetCommonDataService',
    function($scope, $state, $log, fSDataFromDBSvc, fSCalculationService, adbRiderForASDataFromUserSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, pwrRiderDataFromUserSvc, calculatePwrRiderPremiumSvc, fSValidationService,getSetCommonDataService) {
      'use strict';

      $scope.fsBasePremiumOutput = false;

      var prodId = 10;
      var channelId = 1;
      var adbRiderId = 4;
      var hospicashId = 5;
      /* set data dynamically */
      var prodData = getSetCommonDataService.getCurrentProdData();
      $log.debug('prodData',prodData);
      var commonData = getSetCommonDataService.getCommonData();
      $log.debug('commonData',commonData);

      /*For Now kept it commented as in web mode page gets refreshed
      & increase testing time*/
      /* var prodId = prodData.prodId;
      // var channelId = commonData.channelId;
      // var adbRiderId = prodData.adbRiderId;
      // var hospicashId = prodData.hospicashId;*/
      $scope.calculate = function() {
        $state.go('fSEstimated');
      };

      /*Temporary data for USer Input*/
      $scope.data = {
        laName: "ABC",
        laAge: 35,
        laGender: 1,
        isSelf: true,
        proposerName: "ABC",
        proposerAge: 35,
        proposerGender: 0,
        sumAssured: 777182,
        basePremium: 0,
        ppt: 0,
        NSAPForLA: true,
        premiumMode: 12
      };


      $scope.validationMessage = [{
        SpaceAndDot: "Space and Dot at starting position is not allowed in Life Assurer Name."
      }, {
        length: "Life Assurer Name length between 1 to 50."
      }, {
        Selfselection: "For self selection LA name = to Proposer so gender , age and name shoould be same."
      }, {
        LifeAssurrerName: "Life Assurer Name length is 10."
      }];



      $scope.policyTermVals = [20, 25, 30];



      $scope.populatePPT = function(pt) {
        fSDataFromDBSvc.getPremiumPaymentTerm(prodId, channelId, pt)
          .then(function(val) {
            $scope.data.ppt = parseInt(val);
          });
      };

      $scope.updateRiderSA = function() {
        $scope.data.riderterm = angular.copy($scope.data.ppt);
        $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
      };

      $scope.docalculateBasicPremium = function(data) {
        var premiumRate = fSCalculationService.calcPremiumRate(prodId, channelId, data);
        premiumRate.then(function(val) {
          var basicPremium = fSCalculationService.calcBasePremium(data, val);
          $log.debug('the value of the basepremium is', basicPremium);
          $scope.data.basePremium = basicPremium;
        });
      };

      $scope.docalculateSumAssured = function(data) {
        var premiumRate = fSCalculationService.calcPremiumRate(prodId, channelId, data);
        premiumRate.then(function(val) {
          var sumAssured = fSCalculationService.calcSumAssured(data, val);
          $log.debug('the value of the sumAssured is', sumAssured);
          $scope.data.sumAssured = sumAssured;
        });
      }


      $scope.dbValidation = function(data) {
        if (data.ppt == 5) {
          fSValidationService.getProductCode(prodId, channelId, data.ppt)
            .then(function(prodCode) {
              fSValidationService.getFsProductCode(prodId, channelId, prodCode, data)
                .then(function(value) {
                  $log.debug('value',value);
                  fSValidationService.validateBaseProduct(prodId, channelId, value, data)
                    .then(function(messages) {
                      $scope.dbError = "";
                      /*  $log.debug("final", messages);*/
                      if (messages.length == 0) {
                        $scope.showDbErrors = false;
                        $scope.dbError = "";
                        $scope.doCalcBasePremium(prodId, channelId, data);
                      } else {
                        $scope.showDbErrors = true;
                        $scope.dbErrors = messages[0];

                      }

                    });

                });
            });
        } else {
          fSValidationService.getProductCode(prodId, channelId, data.ppt)
            .then(function(prodCode) {
              fSValidationService.validateBaseProduct(prodId, channelId, prodCode, data)
                .then(function(messages) {
                  $scope.dbError = "";
                  /*$log.debug("final", messages);*/
                  if (messages.length == 0) {
                    $scope.showDbErrors = false;
                    $scope.dbError = "";
                    $scope.doCalcBasePremium(prodId, channelId, data);
                  } else {
                    $scope.showDbErrors = true;
                    $scope.dbErrors = messages[0];

                  }
                });
            });
        }
      };

      $scope.doCalcBasePremium = function(prodId, channelId, userInput) {
        fSCalculationService.calcPremium(prodId, channelId, userInput)
          .then(function(totalBasePremiumVals) {
            $scope.basePremium = totalBasePremiumVals;
            $scope.fsBasePremiumOutput = true;
            var flexiSaveBi = doGenarateFSBi(prodId, channelId, userInput, totalBasePremiumVals.basePremium, totalBasePremiumVals.sumAssured);
            $scope.flexiSaveBiOutput = true;
            if (data.ADBRider) {
              docalculateAdbPremium(prodId, channelId, userInput);
            }
            if (data.hospiCash) {
              docalculateHospiCashPremium(prodId, channelId, userInput, totalBasePremiumVals.basePremium);
            }

            if (data.PWRI || data.PWRII) {
              if (data.PWRI)
                docalculatePWRPremium(prodId, channelId, userInput, 1);
              if (data.PWRII) {
                docalculatePWRPremium(prodId, channelId, userInput, 2);
                $scope.pwrOutputOption2 = true;
              }

            }

          });
      };

      function doGenarateFSBi(prodId, channelId, userInput, basePremium, sumAssured) {
        $scope.flexiSaveBi = {};
        fSCalculationService.generateFlexiSaveBi(prodId, channelId, userInput, basePremium, sumAssured)
          .then(function(val) {
            $scope.flexiSaveBi = val;
          });
      }

      $scope.adbData = false;

      function docalculateAdbPremium(prodId, channelId, data) {

        var adbInput = adbRiderForASDataFromUserSvc.setADBRiderData(data);

        if (data.ADBRider) {
          var adbData = calculateAdbRiderPremiumSvc.calculateABDRiderPremium(adbRiderId, prodId, channelId, data.basePremium);
          adbData.then(function(adbData) {
            if (adbData.annualAdbRiderPremium == 0) {
              $scope.adbData = false;
              $scope.showDbErrors = true;
              $scope.dbErrors = "30% Base premium is less than rider";
            } else {
              $scope.adbData = adbData;
              $log.debug('adbData', $scope.adbData);
              $scope.adbPremiumOutput = true;
            }
          });
        }
      }


      $scope.hospicashOutput = false;

      function docalculateHospiCashPremium(prodId, channelId, data, basePremium) {
        var hospiInput = hospiCashRiderDataFromUserSvc.setHospiCashData(data);
        var hospiCashData = calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospicashId, prodId, channelId, basePremium);
        hospiCashData.then(function(hospiCashDataVal) {
          if (hospiCashDataVal.annualHospiCashPremium == 0) {
            $scope.hospicashOutput = false;
            $scope.hospiCashData = {};
            $scope.showDbErrors = true;
            $scope.dbErrors = "30% Base premium is less than rider";
          } else {
            $scope.hospiCashData = hospiCashDataVal;
            $scope.hospicashOutput = true;
          }
        });

      }

      $scope.pwrOutput = false;

      function docalculatePWRPremium(prodId, channelId, data, option) {
        $log.debug('docalculatePWRPremium', data);
        var pwrInput = pwrRiderDataFromUserSvc.setPWRRiderData(data);

        if (parseInt(option) === 1) {
          var pwrData1 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, data, option);
          pwrData1.then(function(riderVal) {
            if (riderVal.annualPwrPremium == 0) {
              $scope.pwrOutputOption1 = false;
              $scope.showDbErrors = true;
              $scope.dbErrors = "30% Base premium is less than rider";
            } else {
              $scope.pwrData1 = riderVal;
              $log.debug('$scope.pwrData1', $scope.pwrData1);
              $scope.pwrOutputOption1 = true;
            }
          });

        }
        if (parseInt(option) === 2) {
          var pwrData2 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, data, option);
          pwrData2.then(function(riderVal) {
            if (riderVal.annualPwrPremium == 0) {
              $scope.pwrOutputOption2 = false;
              $scope.showDbErrors = true;
              $scope.dbErrors = "30% Base premium is less than rider";
            } else {
              $scope.pwrData2 = riderVal;
              $log.debug('$scope.pwrData2', $scope.pwrData2);
              $scope.pwrOutputOption2 = true;
            }
          });
        }

      }
    }
  ]
);
