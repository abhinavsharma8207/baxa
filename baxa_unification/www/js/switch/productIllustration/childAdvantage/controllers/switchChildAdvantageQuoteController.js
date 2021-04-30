switchModule.controller('switchChildAdvantageQuoteController', ['$scope',
  '$q',
  '$state',
  '$http',
  '$log',
  '$rootScope',
  '$ionicPlatform',
  '$ionicHistory',
  '$cordovaToast',
  '$ionicNavBarDelegate',
  'switchDataService',
  'eAppServices',
  'cACalculationService',
  'cAValidationService',
  function($scope, $q, $state, $http, $log, $rootScope, $ionicPlatform, $ionicHistory, $cordovaToast, $ionicNavBarDelegate, switchDataService, eAppServices, cACalculationService, cAValidationService) {
    'use strict';

    $scope.fromSwitch = true;
    var vm = this;
    var prodId = 14;
    var channelId = 1;

    $scope.title = "Child Advantage";
    $scope.data = {};
    $scope.inputData = {};
    $scope.custId = $state.params.customerId;

    /* userInputsData*/
    var params = {
      "ui_color": 'purple',
      "ui_gender": true,
      "ui_age": true,
      "ui_smoke": false,
      "ui_nsap": true,
      "ui_payType": true,
      "ui_benefitType": true,
      "ui_termExtra": false, //{"label": "Flexi Benifit Period", "default": "20-30"}
      "ui_sumAssured": false,
      "ui_anualPreminum": true,
      "ui_modelPreminum": true,
      "switch": true,
      "ui_presence": true
    };
    $scope.inputData = { /* Defoalt selected data*/
      laMinAge: "18",
      laMaxAge: "55",
      laAge: 35,
      premiumMode: 1,
      annualPremium: 50000,
      ppt: 21,
      pt: 21,
      ptupto: null,
      inYour: 'PRESENCE',
      maturityOption: "Money Back",
      benfitType:"REGULAR"
    };

    eAppServices.getLaAge(prodId, channelId)
      .then(function(result) {
        $scope.data.laMinAge = result.MinAge;
        $scope.data.laMaxAge = result.MaxAge;
        $scope.data.laMinAgeYear = result.MinDate;
        $scope.data.laMaxAgeYear = result.MaxDate;
      });

    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "BUYPOLFOR", "PMODE", "PT", "BENEFITTYPE", "MATURITYOPTION"], ["PPTRP", "PPTLP", "MPFACTOR"])
      .then(function(result) {
        $scope.params = params;
        $scope.formData = result[0]; /* Form Data from AskGenericMaster*/
        $scope.formData.PMODE.splice(2, 1);
        $scope.formDataCalc = {
          /*"PT": JSON.parse(result[1].PT),*/
          "PPTLP": JSON.parse(result[1].PPTLP),
          "PPTRP": JSON.parse(result[1].PPTRP),
          "MPFACTOR": JSON.parse(result[1].MPFACTOR) /*,"PREPAYOPN":JSON.parse(result[1].PREPAYOPN)*/
        };
        $scope.formDataOut = result[2]; /* Form Data from AskGenericMaster for Riders*/

        if (result[0].PT.length > 0) {
          var pts = [];
          for (var d = 0; d < result[0].PT.length; d++) {
            pts.push(parseInt(result[0].PT[d].name));
          }
          $scope.formData.PTMin = Math.min.apply(Math, pts);
          $scope.formData.PTMax = Math.max.apply(Math, pts);
        }
        /****When value of age is changed then ptupto should be change accroding*****/
      /*  if ($scope.inputData.laAge >= 51) {
          $scope.inputData.benfitType = 'LIMITED';
        //  $scope.params.ui_payTypeDisable = true;
        } else {
          $scope.inputData.benfitType = 'REGULAR';
        }*/
      });


    /*Get validation messgae through json file.*/
    $http.get('js/switch/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
      $scope.ageOutofRange = $scope.validationMessage.data.eighteenToSixtyfive;
    });
    /** prepopuleted data for user creation**/
    var quoteData = switchDataService.getQuoteData();
    if (angular.isUndefined(quoteData) || quoteData === null) {
      var customerData = switchDataService.getProfileData($state.params.customerId);
      customerData.then(function(childAdvantage) {
        $scope.childAdvantageData = childAdvantage;
        var gender = $scope.childAdvantageData.Gender;
        $scope.inputData.laGender = gender;
        var ageCheck = $scope.childAdvantageData.Age;
        if (ageCheck > 18 && ageCheck < 55) {
          $scope.inputData.laAge = ageCheck;
        } else {
          $scope.inputData.laAge = 35;
          $scope.AgeOutofRange = false;
          if (!isWeb) {
            $cordovaToast
              .show("" + $scope.ageOutofRange, 'long', 'bottom')
              .then(function(success) {
                // success
              }, function(error) {
                // error
              });
          } else {
            $scope.AgeOutofRange = true;
          }
        }
      });
      /****When value of age is changed then ptupto should be change accroding*****/
   $scope.$watch('inputData.laAge', function(newValue, oldValue) {
        if (newValue) {
          if ($scope.inputData.laAge >= 51) {
            $scope.inputData.benfitType = 'LIMITED';
          //  $scope.params.ui_payTypeDisable = true;
          } else {
            $scope.inputData.benfitType = 'REGULAR';
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
        if (quoteData.hasOwnProperty('premiumMode'));
      $scope.inputData.premiumMode = quoteData.premiumMode;
        if (quoteData.hasOwnProperty('benefitPeriod'));
      $scope.inputData.benefitPeriod = quoteData.benefitPeriod;
      if (quoteData.hasOwnProperty('basePremium'));
      $scope.inputData.basePremium = quoteData.basePremium;
      if (quoteData.hasOwnProperty('NSAPForLA'));
      $scope.inputData.NSAPForLA = quoteData.NSAPForLA;
      if (quoteData.hasOwnProperty('inYour'));
      $scope.inputData.inYour = quoteData.inYour;
      if (quoteData.hasOwnProperty('benfitType'));
      $scope.inputData.benfitType = quoteData.benfitType;
      if (quoteData.hasOwnProperty('maturityOption'));
      $scope.inputData.maturityOption = quoteData.maturityOption;

      console.log('input data='+angular.toJson($scope.inputData));
    }
    /**calculate button functionality**/
    $scope.calculate = function(inputData) {
      $log.debug('inputData====', inputData);
      switchDataService.setQuoteData(inputData);
      var cAData = {
        laAge: parseInt(inputData.laAge),
        laGender: inputData.laGender,
        ppt: "" + inputData.ppt,
        pt: "" + inputData.pt,
        premiumMode: inputData.premiumMode,
        basePremium: inputData.annualPremium,
        benfitType: inputData.benfitType,
        maturityOption: inputData.maturityOption,
        NSAPForLA: (inputData.NSAPForLA !== undefined) ? (inputData.NSAPForLA) : (0)
      };
      $log.debug("cAData +++", cAData);
      cACalculationService.calcCASumAssured(prodId, channelId, cAData) /** sumassured calculat **/
        .then(function(sumassured) {
          cAData.sumAssured = sumassured;
          $log.debug("sumassured +++", cAData.sumAssured);
          cAValidationService.validateBaseProduct(prodId, channelId, cAData) /** validation service **/
            .then(function(messages) {
              $log.debug("messages +++", messages);
              if (messages.length === 0) {
                $scope.showDbErrors = false;
                var answer = cACalculationService.calculateCATotalPremium(prodId, channelId, cAData); /** calculat BI service **/
                answer.then(function(basePremiumResult) {
                  $log.debug(":basePremiumResult:----------", basePremiumResult);
                  var BI = basePremiumResult.bi;
                  BI.then(function(biCalRes) {
                    $log.debug(":Bi:----------", biCalRes);
                    var survivalBenefit = 0;
                    for (var n = 0; n < biCalRes.sB.length; n++) {
                      if (typeof biCalRes.sB[n] == 'number' || biCalRes.sB[n] > 0)
                        survivalBenefit = parseInt(survivalBenefit) + parseInt(biCalRes.sB[n]);
                    }
                    var survivalBenefitValue = {};
                    survivalBenefitValue = {
                      survivalBenefitValue1: biCalRes.sB[biCalRes.sB.length - 2],
                      survivalBenefitValue2: biCalRes.sB[biCalRes.sB.length - 3],
                      survivalBenefitValue3: biCalRes.sB[biCalRes.sB.length - 4],
                      survivalBenefitValue4: biCalRes.sB[biCalRes.sB.length - 5],
                      survivalBenefitValue5: biCalRes.sB[biCalRes.sB.length - 6]
                    };
                    $log.debug(":survivalBenefit++:----------", survivalBenefitValue);
                    var childAPiData = {
                      sumOfGuaranteedAnnualBenefits: biCalRes.gMB[biCalRes.gMB.length - 1] + parseInt(survivalBenefit),
                      //nonGuaranteedBonusesatMaturity: biCalRes.gMaturityBenfitAt8[biCalRes.gMaturityBenfitAt8.length - 1],
                      sumofBenefits: biCalRes.gMB[biCalRes.gMB.length - 1] + parseInt(survivalBenefit) + biCalRes.gMaturityBenfitAt8[biCalRes.gMaturityBenfitAt8.length - 1] - biCalRes.gMB[biCalRes.gMB.length - 1],
                      nonGuaranteedBonusespaidatMaturity: biCalRes.gMaturityBenfitAt8[biCalRes.gMaturityBenfitAt8.length - 1] - biCalRes.gMB[biCalRes.gMB.length - 1],
                      deathBenefit: biCalRes.deathBenfit[biCalRes.deathBenfit.length - 2],
                      totalModalPremium: basePremiumResult.totalModalPremium,
                      survivalBenefit: survivalBenefitValue,
                      guaranteedAnnualBenefit: biCalRes.gMB[biCalRes.gMB.length - 1],
                      nonGuaranteedBonus: biCalRes.gMaturityBenfitAt8[biCalRes.gMaturityBenfitAt8.length - 1] - biCalRes.gMB[biCalRes.gMB.length - 1]
                    };
                    $log.debug(":childAPiData:----------", childAPiData);
                    switchDataService.setQuotecalculatedData(childAPiData); /** set calculated data**/
                    $state.go('app.switchChildAdvantagePi', {
                      customerId: $state.params.customerId,
                      recId: null
                    });
                  });
                });
              } else { /** show error messages**/
                $scope.showDbErrors = true;
                $scope.dbErrors = [];
                for (var e = 0; e < messages[0].length; e++) {
                  if (messages[0][e].Name == "ANNPRE")
                    $scope.dbErrors.push(messages[0][e]);
                }
              }
            });
        });
      };/** close calculate function**/
      /**back routing ***/
      $scope.goBack = function() {
        if ($state.current.name == 'app.switchChildAdvantageQuote') {
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
