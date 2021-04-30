/******
@Author:Mayur Gawande
Date:25 july 2016
Controller for Flexi save Quote input
Back button functuions
****/
switchModule.controller('switchAajeevanSampattiQuoteController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$http',
  'eAppServices',
  'switchDataService',
  'commonDbProductCalculation',
  'fSDataFromDBSvc',
  function($scope, $rootScope, $log, $state, $http, eAppServices, switchDataService, commonDbProductCalculation, fSDataFromDBSvc) {
    'use strict';
    var vm = this;
    var prodId = 1;
    var channelId = 1;


    $scope.title = "Aajeevan Sampatti";

    $scope.data = {};
    $scope.outputData = {};
    $scope.inputData = {};
    $scope.custId = $state.params.customerId;
    ///$scope.dbErrors = [];
    // $scope.validationMessage = {};

    //  alert("hiii");

    /*****Object to show required UI on quote input page****/
    var params = {
      //  "ui_color": 'purple',
      "ui_gender": true,
      "ui_age": true,
      "ui_anualPreminum": true,
      "ui_modelPreminum": true,
      "ui_upto": true,
      "ui_nsap": true,
      "ui_presence": true,
      "switch": true
    };

    /***Default values****/
    $scope.inputData = {
      laAge: 35,
      ppt: "15",
      pt: "50",
      annualPremium: 50000,
      modalPremium: 26000,
      premiumMode: 1,
      benefitUptoAge: 100,
      inYour: 'PRESENCE'
    };

    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "PMODE", "UPTOAGE", "PPT"], ["MPFACTOR"])
      .then(function(result) {
        $log.debug("the value coming in the result is+++", result);
        $scope.params = params;
        $scope.formData = result[0];
        /*Hiding the quartly mode in PPT*/
        $scope.formData.PMODE.splice(2, 1);
        //    $scope.inputData.pt = $scope.inputData.benefitUptoAge - $scope.inputData.laAge;
        $scope.formDataCalc = {
          "MPFACTOR": JSON.parse(result[1].MPFACTOR) /*,"PREPAYOPN":JSON.parse(result[1].PREPAYOPN)*/
        };

      });


    //***** COPY PASTE - DATE MIN MAX FUNCTION *****//
    eAppServices.getLaAge(prodId, channelId)
      .then(function(result) {
        $log.debug("the value coming in the result is====", result);
        $scope.data.laMinAge = result.MinAge;
        $scope.data.laMaxAge = result.MaxAge;
        $scope.data.laMinAgeYear = result.MinDate;
        $scope.data.laMaxAgeYear = result.MaxDate;
      });


    $scope.benefitUptoAge = function(inputData) {
      $log.debug("the benefitUptoAge value is", inputData);

    };


    var customerData = switchDataService.getProfileData($state.params.customerId);
    customerData.then(function(custData) {
      $scope.flexiSaveCustData = custData;
      var gender = $scope.flexiSaveCustData.Gender;
      $scope.inputData.laGender = gender;
      var ageCheck = $scope.flexiSaveCustData.Age;
      if (ageCheck >= 18 && ageCheck <= 60) {
        $scope.inputData.laAge = ageCheck;
      } else {
        $scope.inputData.laAge = 35;
        //   $scope.AgeOutofRange = false;
      }

    });
  }
]);
