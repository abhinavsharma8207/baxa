/**
 * Created By: Atul A
 * Elite Secure Calculation Service
 *
 * @class esCalculationController
 * @submodule core-controller
 * @constructor
 */
productCalculator.controller(
  'eSCalculationController', [
    '$scope',
    '$log',
    'eSCalculationService',
    'adbRiderForASDataFromUserSvc',
    'calculateAdbRiderPremiumSvc',
    'hospiCashRiderDataFromUserSvc',
    'calculatehospiCashRiderPremiumSvc',
    'eSValidationService',
    'getSetCommonDataService',
    function($scope, $log, eSCalculationService, adbRiderForASDataFromUserSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, eSValidationService,getSetCommonDataService) {
      'use strict';
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
      /*Temprory product code it will be dynamic once new flow is implemented*/

      var prodId = 8;
      var channelId = 1;
      var adbRiderId = 4;
      var hospicashId = 5;
      $scope.esBasePremiumOutput = false;
      $scope.eliteSecureBIOutput = false;

      /*Temporary data for User Input*/
      $scope.data = {
        laName: "ABC",
        laAge: 35,
        laGender: 0,
        isSelf: true,
        proposerName: "ABC",
        proposerAge: 35,
        proposerGender: 0,
        sumAssured: 2500000,
        basePremium: 0,
        ppt: 0,
        uptoAge: 0,
        NSAPForLA: false,
        premiumMode: 4
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



      $scope.updateRiderSA = function() {
        $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
      };
      $scope.copyTerm = function() {
        $scope.data.riderterm = angular.copy($scope.data.ppt);
        $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
      };


      $scope.docalcBasePremium = function(prodId, channelId, inputData) {
        var basePremium = eSCalculationService.calcTotalBasePremium(prodId, channelId, inputData);
        basePremium.then(function(val) {
          $scope.basePremium = val;
          if (inputData.ADBRider) {
            $log.debug("++++", val);
            docalculateAdbPremium(prodId, channelId, inputData, val.basePremium);
          }
          if (inputData.hospiCash) {
            $log.debug("++++", val.basePremium);
            docalculateHospiCashPremium(prodId, channelId, inputData, val.basePremium);
          }
          $scope.esBasePremiumOutput = true;
          $scope.eliteSecureBIOutput = true;
        });

      };


      $scope.adbPremiumOutput = false;

      function docalculateAdbPremium(prodId, channelId, data, basePremium) {

        var adbInput = adbRiderForASDataFromUserSvc.setADBRiderData(data);
var userData = adbRiderForASDataFromUserSvc.getADBRiderData();
        if (data.ADBRider) {
          var adbData = calculateAdbRiderPremiumSvc.calculateABDRiderPremium(adbRiderId, prodId, channelId, data);
          adbData.then(function(adbData) {
            $log.debug("======", basePremium);
            if (adbData.annualAdbRiderPremium == 0) {
              $scope.adbPremiumOutput = false;
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

      /*
         This function will validate the fields useing database credentials.
      */
      $scope.dbValidation = function(data) {
        eSValidationService.validateBaseProduct(prodId, channelId, data).then(function(messages) {
          $scope.dbError = "";
          $log.debug("final", data);
          if (messages.length == 0) {
            $scope.showDbErrors = false;
            $scope.dbError = "";
            $scope.docalcBasePremium(prodId, channelId, data);
          } else {
            $scope.showDbErrors = true;
            $scope.dbErrors = messages[0];

          }
        });
      };

    }
  ]);
