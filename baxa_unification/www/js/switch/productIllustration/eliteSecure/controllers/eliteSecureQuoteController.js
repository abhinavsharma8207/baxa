unificationBAXA.controller('eliteSecureQuoteController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$http',
  '$ionicPlatform',
  '$ionicNavBarDelegate',
  '$ionicHistory',
  '$cordovaToast',
  'eSValidationServiceSwitchPi',
  'eliteSecureSwitchService',
  'eSCalculationService',
  'commonDbProductCalculation',
  'switchDataService',
  'eAppServices',
  function($scope, $rootScope, $log, $state, $http, $ionicPlatform, $ionicNavBarDelegate, $ionicHistory, $cordovaToast, eSValidationServiceSwitchPi, eliteSecureSwitchService, eSCalculationService, commonDbProductCalculation, switchDataService, eAppServices) {
    'use strict';

    var vm = this;
    var prodId = 8;
    var channelId = 1;


    $scope.title = "Elite Secure";
    $scope.data = {};
    $scope.outputData = {};
    $scope.inputData = {};
    $scope.validationMessage = {};

    /*Animation Code*/
    $scope.animateClass = animateNgClass('bounceInUp', 'animationduration25');

    var params = {
      "ui_gender": true,
      "ui_age": true,
      "ui_smoke": true,
      "ui_sumAssured": true,
      "ui_upto": true,
      "switch": true
    };



    $scope.inputData = {
      laAge: 35,
      smoke: 'nonsmoke',
      ppt: "20",
      pt: "20",
      premiumMode: 1,
      sumAssured: 10000000,
      ptupto: null
    };


    /*Get validation messgae through json file.*/
    $http.get('js/switch/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
      $scope.ageOutofRange=$scope.validationMessage.data.eighteenToSixtyfive;
    });



    //***** COPY PASTE - DATE MIN MAX FUNCTION *****//
    eAppServices.getLaAge(prodId, channelId)
      .then(function(result) {
        $log.debug("the value coming in the data is", result);
        $scope.data.laMinAge = result.MinAge;
        $scope.data.laMaxAge = result.MaxAge;
        $scope.data.laMinAgeYear = result.MinDate;
        $scope.data.laMaxAgeYear = result.MaxDate;
      });


    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "PMODE", "UPTOAGE", "PT", ], ["PPT", "MPFACTOR"])
      .then(function(result) {
        $log.debug("the value coming in the result is", result);
        $scope.params = params;
        $scope.formData = result[0];
        $scope.formData.PMODE.splice(2, 1);
        $scope.formDataCalc = {
          "PPT": JSON.parse(result[1].PPT),
          "MPFACTOR": JSON.parse(result[1].MPFACTOR) /*,"PREPAYOPN":JSON.parse(result[1].PREPAYOPN)*/
        };
        //    $scope.formDataOut = result[2];
      });


    var quoteData = eliteSecureSwitchService.getQuoteData();
    if (angular.isUndefined(quoteData) || quoteData == null) {
      var customerData = switchDataService.getProfileData($state.params.customerId);
      customerData.then(function(custData) {
        $scope.eliteCustData = custData;
        var gender = $scope.eliteCustData.Gender;
        $scope.inputData.laGender = gender;
        var ageCheck = $scope.eliteCustData.Age;
        if (ageCheck > 18 && ageCheck < 65) {
          $scope.inputData.laAge = ageCheck;
        } else {
          $scope.inputData.laAge = 35;
          $scope.AgeOutofRange=false;
          if(!isWeb){
            $cordovaToast
               .show("" + $scope.ageOutofRange, 'long', 'bottom')
               .then(function(success) {
                 // success
               }, function (error) {
                 // error
               });
          }else{
            $scope.AgeOutofRange=true;
          }
        }
      });
    } else {
      $scope.inputData.laGender = quoteData.laGender;
      $scope.inputData.laAge = quoteData.laAge;
      $scope.inputData.ppt = quoteData.ppt;
      $scope.inputData.pt = quoteData.pt;
      $scope.inputData.sumAssured = quoteData.sumAssured;
      $scope.inputData.premiumMode = quoteData.premiumMode;
      $scope.inputData.ptupto = quoteData.ptupto;


    }
/****When value of age is changed then ptupto should be change accroding*****/
    $scope.$watch('inputData.laAge', function(newValue, oldValue) {
      if(newValue){
        if ($scope.inputData.ptupto == 75) {   
$scope.inputData.ppt=$scope.inputData.ptupto-$scope.inputData.laAge;
}}
    });

    $scope.populatePPT = function(inputData, pt) {   
      $log.debug("the value of pt iisss", pt);
      if (parseInt(pt) == 75) {    
        var uptoAge = pt - inputData.laAge;    
        $scope.inputData.ppt = uptoAge;    
        $log.debug("uptoAge", $scope.inputData.ppt);   
      } else {
        $scope.inputData.ppt = pt;       
      }
    };



    $scope.calculate = function(inputData) {
      $scope.inputData.ppt = eAppServices.getPolyOrPreminumTerm(inputData.pt, $scope.formDataCalc.PPT);
      var pt = $scope.inputData.ppt;
      if (inputData.ptupto > 0) {
        pt = 75;
      } else {
        pt = inputData.pt;
      }

      eSValidationServiceSwitchPi.EaDbValidationData(prodId, channelId, inputData, pt).then(function(messages) {
        $log.debug("the message __++++++++++", messages[0]);
        $scope.showDbErrors = false;
        $scope.dbError = "";
        if (messages.length == 0) {
          $scope.showDbErrors = false;
          $scope.dbError = "";
          eliteSecureSwitchService.setQuoteData(inputData);
          var calData = {
            laGender: inputData.laGender,
            laAge: inputData.laAge,
            uptoAge: inputData.ptupto,
            ppt: inputData.ppt,
            premiumMode: inputData.premiumMode,
            sumAssured: inputData.sumAssured
          };
          var calculatedData = eSCalculationService.calcTotalBasePremium(prodId, channelId, calData);
          calculatedData.then(function(result) {
            eliteSecureSwitchService.setEliteData(result);
            $state.go('app.switchEliteSecurePi', {
              customerId: $state.params.customerId,
              recId: null
            });
          });
        } else {
          $scope.showDbErrors = true;
          $scope.dbErrors = [];
          for (var e = 0; e < messages[0].length; e++) {
            var key = messages[0][e].Name;
            $scope.dbErrors.push(messages[0][e]);
            //  $scope.dbErrors[key] = messages[0][e].ErrorMessage;

          }
        }
      });
    };

    /**back routing ***/
    $scope.goBack = function() {
      if ($state.current.name == 'app.switchEliteSecureQuote') {
        $state.go("app.productRecommendation", {
          customerId: $state.params.customerId,
        });
      } else {
        $ionicHistory.goBack();
      }
    };
    if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
      $ionicNavBarDelegate.showBackButton(false);
    } else {
      $ionicNavBarDelegate.showBackButton(true);
    }
    $ionicPlatform.registerBackButtonAction(function() {
      $scope.goBack();
    }, 100);

  }
]);
