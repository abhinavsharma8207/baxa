productCalculator.controller('trippleHealth.calculatePremiumCntrl', ['$scope',
  '$rootScope',
  '$log',
  '$http',
  'calculateTrippleHealthPremiumSvc',
  'calculatehospiCashRiderPremiumSvc',
  'trippleHealthDataFromUserSvc',
  'hospiCashRiderDataFromUserSvc',
  'tHValidationService',
  'getSetCommonDataService',
  function($scope, $rootScope, $log, $http, calculateTrippleHealthPremiumSvc, calculatehospiCashRiderPremiumSvc, trippleHealthDataFromUserSvc, hospiCashRiderDataFromUserSvc, tHValidationService, getSetCommonDataService) {
    'use strict';
    /* set data dynamically */
    var prodData = getSetCommonDataService.getCurrentProdData();
    $log.debug('prodData', prodData);
    var commonData = getSetCommonDataService.getCommonData();
    $log.debug('commonData', commonData);

    /*For Now kept it commented as in web mode page gets refreshed
    & increase testing time*/
    /* var prodId = prodData.prodId;
    // var channelId = commonData.channelId;
    // var adbRiderId = prodData.adbRiderId;
    // var hospicashId = prodData.hospicashId;*/
    var prodId = 3;
    var channelId = 1;
    var hospicashId = 5;
    $scope.showOutput = false;
    $scope.hospicashOutput = false;

    /*Get validation messgae through json file.*/
    $http.get('js/secureIncome/controllers/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
    });
    $scope.calculate = function() {
      $state.go('trippleHealth-estimated');
    };





    /*DB validation service*/
    $scope.dbValidation = function(data) {
      $log.debug("the data coming is", data);
      tHValidationService.validateBaseProduct(prodId, channelId, data).then(function(messages) {
        $scope.dbError = "";
        $scope.errorMessages = messages;
        $log.debug("final validation message", messages.length);
        if (messages.length == 0) {
          $scope.docalculatePremium(prodId, channelId, data);
          $scope.showDbErrors = false;
          $scope.dbError = "";
        } else {
          //  $scope.showDbErrors = true;
          $scope.dbErrors = messages[0];
        }
      });
    };

    $scope.docalculatePremium = function(prodId, channelId, data) {
      $rootScope.userFormData = data;
      $scope.showOutput = false;
      $scope.hospicashOutput = false;
      var answer = calculateTrippleHealthPremiumSvc.calculateTotalPremium(prodId, channelId, data);
      answer.then(function(baseVal) {
        $scope.showOutput = true;
        $scope.answer = baseVal;
        $log.debug('baseVal', baseVal);

        if (data.hospiCash) {
          docalculateHospiCashPremium(prodId, channelId, baseVal.base);
        } else {

        }
      });
    };

    $scope.hospicashOutput = false;

    function docalculateHospiCashPremium(prodId, channelId, basePremium) {
      $log.debug('baseVal', basePremium);
      var hospiInput = hospiCashRiderDataFromUserSvc.setHospiCashData($rootScope.userFormData);
      var hospiCashData = calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospicashId, prodId, channelId, basePremium);
      hospiCashData.then(function(hospiCashDataVal) {
        $log.debug("hospiCashDataVal", hospiCashDataVal);
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

  }
]);
