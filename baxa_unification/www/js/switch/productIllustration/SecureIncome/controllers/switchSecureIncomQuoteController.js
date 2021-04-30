switchModule.controller('switchSecureIncomQuoteController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$ionicPlatform',
  '$ionicHistory',
  '$cordovaToast',
  '$ionicNavBarDelegate',
  '$http',
  'common_const',
  'switchDataService',
  'eAppServices',
  'secureIncomeSwitchservice',
  'sICalculationService',
  'sIValidationService',
  function($scope, $rootScope, $log, $state, $ionicPlatform, $ionicHistory, $cordovaToast, $ionicNavBarDelegate, $http, common_const, switchDataService, eAppServices, secureIncomeSwitchservice, sICalculationService, sIValidationService) {
    'use strict';

    $scope.fromSwitch = true;
    var vm = this;
    var prodId = 9;
    var channelId = 1;

    $scope.title = "Secure Income";
    $scope.data = {};
    $scope.inputData = {};
    $scope.sIData = {};
    $scope.custId = $state.params.customerId;

    /*Animation Code*/
    $scope.animateClass = animateNgClass('bounceInUp', 'animationduration25');

    /* userInputsData*/
    var params = {
      "ui_gender": true,
      "ui_age": true,
      "ui_smoke": false,
      "ui_nsap": true,
      "ui_payType": false,
      "ui_termExtra": {
        "label": "Guaranteed Income Period",
        "default": "10",
        "terms": {}
      },
      "ui_sumAssured": false,
      "ui_anualPreminum": true,
      "ui_modelPreminum": true,
      "switch": true,
      "ui_presence": true
    };
    $scope.inputData = {
      laMinAge: "0",
      laMaxAge: "65",
      laAge: 35,
      premiumMode: 1,
      annualPremium: 50000,
      ppt: 10,
      pt: 20,
      inYour:'PRESENCE',
      ptupto: null
    };
    eAppServices.getLaAge(prodId, channelId)
      .then(function(result) {
        $scope.data.laMinAge = result.MinAge;
        $scope.data.laMaxAge = result.MaxAge;
        $scope.data.laMinAgeYear = result.MinDate;
        $scope.data.laMaxAgeYear = result.MaxDate;
      });

    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "BUYPOLFOR", "PMODE", "PPT"], ["PT", "MPFACTOR","GIBPERIOD"])
      .then(function(result) {
        $log.debug("the response coming from the result+++",result);
        $scope.params = params;
        $scope.formData = result[0]; /* Form Data from AskGenericMaste*/
        $scope.formData.PMODE.splice(2, 1);
        $scope.formDataCalc = {
          "GIBPERIOD":  JSON.parse(result[1].GIBPERIOD),
          "PT": JSON.parse(result[1].PT),
          "MPFACTOR": JSON.parse(result[1].MPFACTOR),
        /*  "PREPAYOPN": JSON.parse(result[1].PREPAYOPN)*/
      };
        /**for now taken hardcoded values once anil change mappinfg in DB will remove hardcoding result[1].GIBPERIOD**/
        var GIBPERIOD = {"5":["10"],"7":["10"],"10":["10"]};
        $scope.params.ui_termExtra.terms = GIBPERIOD;
            $log.debug("the response coming from the result",   params.ui_termExtra.terms);
        $scope.params = params;
        $scope.formDataOut = result[2]; // Form Data from AskGenericMaster for Riders
      });

    /*Get validation messgae through json file.*/
    $http.get('js/switch/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
      $scope.ageOutofRange=$scope.validationMessage.data.zeroToSixtyfive;
    });

    var quoteData=switchDataService.getQuoteData();
    if(angular.isUndefined(quoteData) || quoteData===null ){
    var customerData = switchDataService.getProfileData($state.params.customerId);
    customerData.then(function(samriddhi) {
      $scope.secureIncomeData = samriddhi;
      var gender = $scope.secureIncomeData.Gender;
      $scope.inputData.laGender = gender;
      var ageCheck = $scope.secureIncomeData.Age;
      if (ageCheck > 0 && ageCheck < 65) {
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
    }  else{
        $scope.inputData.laGender = quoteData.laGender;
        $scope.inputData.laAge = quoteData.laAge;
        $scope.inputData.ppt = quoteData.ppt;
        $scope.inputData.pt = quoteData.pt;
        $scope.inputData.annualPremium = quoteData.annualPremium;
        $scope.inputData.modalPremium = quoteData.modalPremium;
        $scope.inputData.premiumMode = quoteData.premiumMode;
        $scope.inputData.benefitPeriod = quoteData.benefitPeriod;
        $scope.inputData.basePremium = quoteData.basePremium;
        if(quoteData.hasOwnProperty('NSAPForLA'));
        $scope.inputData.NSAPForLA = quoteData.NSAPForLA;
        if(quoteData.hasOwnProperty('inYour'));
        $scope.inputData.inYour= quoteData.inYour;
        if(quoteData.hasOwnProperty('payType'));
        $scope.inputData.payType= quoteData.payType;
      }
    /**calculate button functionality**/
    $scope.calculate = function(inputData) {
      $log.debug('the value of inputData', inputData);
      $scope.inputData.pt = eAppServices.getPolyOrPreminumTerm(inputData.ppt, $scope.formDataCalc.PT);
      $scope.inputData.modalPremium = eAppServices.getModalPremiumFromAnnualPremium(inputData.premiumMode, inputData.annualPremium, $scope.formDataCalc.MPFACTOR);
      var sIdata = {
        laAge: inputData.laAge,
        laGender: inputData.laGender,
        ppt: inputData.ppt,
        pt: inputData.pt,
        premiumMode: inputData.premiumMode,
        basePremium: inputData.annualPremium,
      };
      /*** calculate sumAssured ***/
      sICalculationService.calcSumAssured(prodId, channelId, sIdata.basePremium, sIdata.ppt, sIdata.laAge).then(function(val) {
        $scope.sumAssuredData = val;
        sIData.sumAssured = $scope.sumAssuredData;
      });
      var sIData = {
        laAge: inputData.laAge,
        laGender: inputData.laGender,
        ppt: inputData.ppt,
        pt: inputData.pt,
        premiumMode: inputData.premiumMode,
        basePremium: inputData.annualPremium,
        NSAPForLA:inputData.NSAPForLA
      };
      sIValidationService.validateBaseProduct(prodId, channelId, sIData) /** validation service **/
        .then(function(messages) {
          $scope.dbError = "";
          $log.debug("messages", messages);
          if (messages.length === 0) {
            $scope.showDbErrors = false;
            switchDataService.setQuoteData(inputData);/** set inputData**/
            /*** calculat BI data****/
            var answer = sICalculationService.calculateTotalPremium(prodId, channelId, sIData).then(function(basePremiumResult) {$log.debug('basePremiumResult',basePremiumResult);
              var BI = basePremiumResult.BIVal;
              BI.then(function(sICalcResult) {
                var guaranteedVals = basePremiumResult.gVals;
                guaranteedVals.then(function(val) {
                  var guaranteedAnnualIncome = 0;
                  for (var n = 0; n < val.gsb.length; n++) {
                    if (typeof val.gsb[n] == 'number' || val.gsb[n] > 0)
                    guaranteedAnnualIncome = parseInt(guaranteedAnnualIncome) + parseInt(val.gsb[n]);
                  }
                  $log.debug('guaranteedAnnualIncome',guaranteedAnnualIncome);
                  var secureIPiData = {
                      guaranteedAdditionsMaturity:sICalcResult.gSumAdditions[sICalcResult.gSumAdditions.length - 1],
                      sumAssuredpaidMaturity:sICalcResult.gSumAssured[sICalcResult.gSumAssured.length - 1],
                      sumofBenefits:guaranteedAnnualIncome + sICalcResult.gSumAdditions[sICalcResult.gSumAdditions.length - 1] + sICalcResult.gSumAssured[sICalcResult.gSumAssured.length - 1],
                      deathBenefit:sICalcResult.deathBenifit[sICalcResult.deathBenifit.length - 1],
                      sumGAI:guaranteedAnnualIncome,
                      totalModalPremium:basePremiumResult.totalModalPremium,
                      GuaranteedMonthlyIncome:basePremiumResult.GuaranteedMonthlyIncome
                  };
                  $log.debug('secureIPiData+++',secureIPiData);
                  switchDataService.setQuotecalculatedData(secureIPiData); /** set calculated data**/
                  $state.go('app.switchSecureIncomePi', {
                    customerId: $state.params.customerId,
                  });
                });
              });
            });
          } else { /** show error messages**/
            $scope.showDbErrors = true;
            $scope.dbErrors = [];
            for (var e = 0; e < messages[0].length; e++) {
              $scope.dbErrors.push(messages[0][e]);
            }
          }
        });

    }; /** close calculate function**/
    /**back routing ***/
    $scope.goBack = function() {
      if ($state.current.name == 'app.switchSecureIncomeQuote') {
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
