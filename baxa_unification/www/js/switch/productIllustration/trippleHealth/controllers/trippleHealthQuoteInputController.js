switchModule.controller('trippleHealthQuoteInput', ['$log',
  '$scope',
  '$state',
  '$http',
  '$rootScope',
  'eAppServices',
  '$ionicPlatform',
  '$ionicHistory',
  '$cordovaToast',
  '$ionicNavBarDelegate',
  'commonDbProductCalculation',
  'secureIncomeObjectService',
  'switchDataService',
  'calculateTrippleHealthPremiumSvc',
  'tHValidationService',
  'trippleHealthObjectServicePi',
  function($log, $scope, $state, $http, $rootScope, eAppServices,$ionicPlatform,$ionicHistory, $cordovaToast, $ionicNavBarDelegate, commonDbProductCalculation, secureIncomeObjectService, switchDataService, calculateTrippleHealthPremiumSvc, tHValidationService, trippleHealthObjectServicePi) {
    'use strict';
    var vm = this;
    var hospiCashRiderId = 5,
      adbRiderId = 4,
      prodId = 3,
      channelId = 1,
      pwrRiderId = 6,
      pwrOption = 1;
    $scope.fromswitch = true;
    $scope.showDbErrors = false;
    $scope.dbErrors = false;
    $scope.title = "Tripple Health";
    $scope.custId = $state.params.customerId;
    $scope.data = {};
    $scope.inputData = {};
    $scope.outputData = {};
    $scope.calcData = {};
    /*Animation Code*/
    $scope.animateClass = animateNgClass('bounceInUp', 'animationduration25');
    // $http.get('js/eApp/trippleHealth/validationMessage.json').then(function(responce) {
    //   $scope.validationMessage = responce;
    //
    // });

    /*Get validation messgae through json file.*/
    $http.get('js/switch/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
      console.log('responce='+angular.toJson(responce));
      $scope.ageOutofRange=$scope.validationMessage.data.eighteenToSixtyfive;
      console.log('$scope.ageOutofRange'+$scope.ageOutofRange);
    });

    var params = {
      "ui_gender": true,
      "ui_age": true,
      "ui_smoke": true,
      "ui_nsap": false,
      "ui_payType": false,
      "ui_termExtra": false, //{"label": "Flexi Benifit Period", "default": "20-30"}
      "ui_sumAssured": true,
      "ui_anualPreminum": false,
      "ui_modelPreminum": false,
      "ui_presence": false,
      "ui_pmode": [1],
      "switch": true
    };

    $scope.data.laMinAge = 18;
    $scope.data.laMaxAge = 65;
    $scope.inputData = {
      laAge: parseInt(28),
      laMinAge: 18,
      laMaxAge: 65,
      laFirstName: "",
      laLastName: "",
      laGender: 0,
      smoke: "nonsmoke",
      ppt: parseInt(15),
      pt: 15,
      riderPpt: 15,
      mode: "1",
      premiumMode: 1,
      sumAssured: 200456,
      prodId: 3,
      channelId: 1,
      base: 0,
      //  uptoAge:'$scope.inputData.laAge' +' $scope.inputData.ppt'

    };

    var quoteData = switchDataService.getQuoteData();
    if (angular.isUndefined(quoteData) || quoteData == null) {

      var esCustomerData = switchDataService.getProfileData($state.params.customerId);
      esCustomerData.then(function(tripplHelt) {
        $scope.tripplHelt = tripplHelt;
        var gender = $scope.tripplHelt.Gender;
        $scope.inputData.laFirstName = $scope.tripplHelt.FirstName;
        $scope.inputData.laLastName = $scope.tripplHelt.LastName;
        $scope.inputData.laGender = parseInt(gender);
        $scope.inputData.smoke = "nonsmoke";
        $scope.inputData.ppt = parseInt(15);

        $scope.inputData.sumAssured = 1000000;

        var ageCheck = $scope.tripplHelt.Age;
        if (ageCheck > 18 && ageCheck < 65) {

          $scope.inputData.laAge = ageCheck;
        } else {
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
      $scope.inputData.annualPremium = quoteData.annualPremium;
      $scope.inputData.modalPremium = quoteData.modalPremium;
      $scope.inputData.premiumMode = quoteData.premiumMode;
      $scope.inputData.sumAssured = quoteData.sumAssured;
      $scope.inputData.smoke = quoteData.smoke;
      $scope.inputData.basePremium = quoteData.basePremium;

    }
    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "BUYPOLFOR", "PMODE", "PPT", "PAYTYPE"], ["PT", "MPFACTOR", "PREPAYOPN"])
      .then(function(result) {
        $scope.params = params;
        $scope.formData = result[0]; // Form Data from AskGenericMaster
        $scope.formDataCalc = {
          "MPFACTOR": JSON.parse(result[1].MPFACTOR),
        };
        $scope.formDataOut = result[2]; // Form Data from AskGenericMaster for Riders
      });
    $scope.calculate = function(inputData) {
      tHValidationService.validateProduct(prodId, channelId, $scope.inputData)
        .then(function(messages) {
          $scope.dbError = [];
          if (messages.length === 0 && $scope.inputData.pt > 0 && $scope.inputData.premiumMode > 0) {
            $scope.showDbErrors = false;
            calculateTrippleHealthPremiumSvc.calculateTotalPremium(prodId, channelId, $scope.inputData)
              .then(function(baseVal) {
                $scope.inputData.base = baseVal.base;
                switchDataService.setQuoteData($scope.inputData);
                $state.go('app.trippleHealthPi', {
                  customerId: $state.params.customerId,
                });
              });
          } else {
            $scope.showDbErrors = true;
            $scope.dbErrors = [];
            for (var e = 0; e < messages.length; e++) {
              $scope.dbErrors.push(messages[e]);
            }
          }
        });
    };

    /**back routing ***/
    $scope.goBack = function() {
      if ($state.current.name == 'app.trippleHealthQuoteInput') {
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
