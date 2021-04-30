/******
@Author:Mayur Gawande
Date:25 july 2016
Controller for Flexi save Quote input
Back button functuions
****/
switchModule.controller('flexiSaveQuoteController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$ionicPlatform',
  '$ionicNavBarDelegate',
  '$ionicHistory',
  '$cordovaToast',
  'eAppServices',
  'switchDataService',
  'fSValidationService',
  'fSCalculationService',
  'commonDbProductCalculation',
  'fSDataFromDBSvc',
  '$http',
  function($scope, $rootScope, $log, $state, $ionicPlatform, $ionicNavBarDelegate, $ionicHistory, $cordovaToast,eAppServices, switchDataService, fSValidationService, fSCalculationService, commonDbProductCalculation, fSDataFromDBSvc, $http) {
    'use strict';
    var vm = this;
    var prodId = 10;
    var channelId = 1;
    /*Get validation messgae through json file.*/
    $http.get('js/switch/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
      $scope.ageOutofRange=$scope.validationMessage.data.zeroToSixtyfive;
    });
    $scope.title = "Flexi Save";

    $scope.data = {};
    $scope.outputData = {};
    $scope.inputData = {};
    $scope.dbErrors = [];
    $scope.validationMessage = {};
   /*****Object to show required UI on quote input page****/
    var params = {
      "ui_color": 'purple',
      "ui_gender": true,
      "ui_age": true,
      "ui_anualPreminum": true,
      "ui_modelPreminum": true,
      "ui_termExtra": {
        "label": "Flexi Benefit Period",
        "default": "20-30",
        "terms": {}
      },
      "ui_nsap": true,
      "ui_presence": true,
      "switch": true
    };
/***Default values****/
    $scope.inputData = {
      laAge: 35,
      ppt: "12",
      pt: "30",
      annualPremium: 50000,
      modalPremium: 26000,
      premiumMode: 1,
      inYour:'PRESENCE'
    };
    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "PMODE", "PPT"], ["PT", "MPFACTOR", "BENEFITPERIOD"])
      .then(function(result) {
        $scope.formData = result[0];
        /*Hiding the quartly mode in PPT*/
        $scope.formData.PMODE.splice(2, 1);
        $scope.formDataCalc = {
          "BENEFITPERIOD": JSON.parse(result[1].BENEFITPERIOD),
          "PT": JSON.parse(result[1].PT),
          "MPFACTOR": JSON.parse(result[1].MPFACTOR) /*,"PREPAYOPN":JSON.parse(result[1].PREPAYOPN)*/
        };
        params.ui_termExtra.terms = JSON.parse(result[1].BENEFITPERIOD);
        $scope.params = params;
      });
    //***** COPY PASTE - DATE MIN MAX FUNCTION *****//
    eAppServices.getLaAge(prodId, channelId)
      .then(function(result) {
        $scope.data.laMinAge = result.MinAge;
        $scope.data.laMaxAge = result.MaxAge;
        $scope.data.laMinAgeYear = result.MinDate;
        $scope.data.laMaxAgeYear = result.MaxDate;
      });

   var quoteData=switchDataService.getQuoteData();
   if(angular.isUndefined(quoteData) || quoteData==null ){
    var customerData = switchDataService.getProfileData($state.params.customerId);
    //console.log('get---------------QuoteData'+angular.toJson(switchDataService.getQuoteData()));
    customerData.then(function(custData) {
      $scope.flexiSaveCustData = custData;
      var gender = $scope.flexiSaveCustData.Gender;
      $scope.inputData.laGender = gender;
      var ageCheck = $scope.flexiSaveCustData.Age;
      if (ageCheck >= 0 && ageCheck <= 65) {
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
  }
  else{
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

  }

    $scope.calculate = function(inputData) {
      //** Calculation **//
      var FlexiSaveData = {
        laAge: inputData.laAge,
        laGender: inputData.laGender,
        ppt: inputData.ppt,
        pt: inputData.pt,
        premiumMode: inputData.premiumMode,
        basePremium: inputData.annualPremium,
        modalPremium: inputData.modalPremium,
        NSAPForLA: inputData.NSAPForLA
      };
      $scope.inputData.basePremium = inputData.annualPremium;
      $scope.outputData.pt = eAppServices.getPolyOrPreminumTerm(inputData.ppt, $scope.formDataCalc.PT);
      $scope.outputData.modalPremium = eAppServices.getModalPremiumFromAnnualPremium(inputData.premiumMode, inputData.annualPremium, $scope.formDataCalc.MPFACTOR);
      $scope.outputData.NSAPForLA = (inputData.NSAPForLA !== undefined) ? (inputData.NSAPForLA) : (0);
      // $scope.outputData.NSAPForPrposer = 0;
      if (inputData.ppt == 5) {
        fSDataFromDBSvc.getProductCode(prodId, channelId, inputData.ppt)
          .then(function(prodCode) {
            if (inputData.laAge >= 8) {
              fSValidationService.getFsProductCode(prodId, channelId, prodCode, inputData)
                .then(function(value) {
                  fSValidationService.validateBaseProduct(prodId, channelId, value, inputData)
                    .then(function(messages) {
                      if (messages.length === 0) {
                        $scope.showDbErrors = false;
                        var data = switchDataService.setQuoteData(inputData);
                        var calculatedData = fSCalculationService.calcPremium(prodId, channelId, FlexiSaveData);
                        calculatedData.then(function(calcPremiumResult) {
                        //  switchDataService.setQuotecalculatedData(calcPremiumResult);
                          var getCalculation = fSCalculationService.generateFlexiSaveBi(prodId, channelId, FlexiSaveData, calcPremiumResult.basePremium, calcPremiumResult.sumAssured);
                         getCalculation.then(function(sCalcResult) {
                          var fsPiData = {
                            sumAssured:sCalcResult.guaranteedMaturityBenefit[sCalcResult.guaranteedMaturityBenefit.length-1],
                            nonguaranteedBenefitAtMaturity:sCalcResult.nonguaranteedMaturityBenefit8Per[sCalcResult.nonguaranteedMaturityBenefit8Per.length-1] - sCalcResult.guaranteedMaturityBenefit[sCalcResult.guaranteedMaturityBenefit.length-1],
                            sumofBenefits:sCalcResult.guaranteedMaturityBenefit[sCalcResult.guaranteedMaturityBenefit.length-1] + sCalcResult.nonguaranteedMaturityBenefit8Per[sCalcResult.nonguaranteedMaturityBenefit8Per.length-1] - sCalcResult.guaranteedMaturityBenefit[sCalcResult.guaranteedMaturityBenefit.length-1],
                            deathBenefit:sCalcResult.guaranteedDeathBenefit[sCalcResult.guaranteedDeathBenefit.length-3],
                            totalModalPremium:calcPremiumResult.totalModalPremium,
                            deathBenefitInAbsense:parseInt(sCalcResult.nonguaranteedDeathBenefit8Per[sCalcResult.nonguaranteedDeathBenefit8Per.length - 3]) - parseInt(sCalcResult.guaranteedDeathBenefit[sCalcResult.guaranteedDeathBenefit.length-3])
                          };

                          switchDataService.setQuotecalculatedData(fsPiData);
                          $state.go('app.switchFlexiSavePi', {
                               customerId: $state.params.customerId,
                               recId: null
                             });
                        });
                        });
                      } else {
                        $scope.showDbErrors = true;
                        for (var e = 0; e < messages.length; e++) {
                          $scope.dbErrors.push(messages[e][0]);
                        }
                      }
                    });
                });
            } else {
              $scope.showDbErrors = true;
              $scope.dbErrors.push({
                "Name": "ENTAGE",
                "ErrorMessage": "Entry Age must be more then 8 years!"
              });
            }
          });
      } else {
        fSDataFromDBSvc.getProductCode(prodId, channelId, inputData.ppt)
          .then(function(prodCode) {

            fSValidationService.validateBaseProduct(prodId, channelId, prodCode, inputData)
              .then(function(messages) {
                $scope.dbErrors = {};
                if (messages.length === 0) {
                  $scope.dbError = "";
                  $scope.showDbErrors = false;
                  var data = switchDataService.setQuoteData(inputData);
                  var calculatedData = fSCalculationService.calcPremium(prodId, channelId, FlexiSaveData);
                  calculatedData.then(function(calcPremiumResult) {
                  var getCalculation = fSCalculationService.generateFlexiSaveBi(prodId, channelId, FlexiSaveData, calcPremiumResult.basePremium, calcPremiumResult.sumAssured);
                   getCalculation.then(function(sCalcResult) {
                    var fsPiData = {
                      sumAssured:sCalcResult.guaranteedMaturityBenefit[sCalcResult.guaranteedMaturityBenefit.length-1],
                      nonguaranteedBenefitAtMaturity:sCalcResult.nonguaranteedMaturityBenefit8Per[sCalcResult.nonguaranteedMaturityBenefit8Per.length-1] - sCalcResult.guaranteedMaturityBenefit[sCalcResult.guaranteedMaturityBenefit.length-1],
                      sumofBenefits:sCalcResult.guaranteedMaturityBenefit[sCalcResult.guaranteedMaturityBenefit.length-1] + sCalcResult.nonguaranteedMaturityBenefit8Per[sCalcResult.nonguaranteedMaturityBenefit8Per.length-1] - sCalcResult.guaranteedMaturityBenefit[sCalcResult.guaranteedMaturityBenefit.length-1],
                      deathBenefit:sCalcResult.guaranteedDeathBenefit[sCalcResult.guaranteedDeathBenefit.length-3],
                      totalModalPremium:calcPremiumResult.totalModalPremium,
                      deathBenefitInAbsense:parseInt(sCalcResult.nonguaranteedDeathBenefit8Per[sCalcResult.nonguaranteedDeathBenefit8Per.length - 3]) - parseInt(sCalcResult.guaranteedDeathBenefit[sCalcResult.guaranteedDeathBenefit.length-3])
                    };

                    switchDataService.setQuotecalculatedData(fsPiData);
                    $state.go('app.switchFlexiSavePi', {
                         customerId: $state.params.customerId,
                         recId: null
                       });
                  });
                  });
               }
                else {
                  $scope.showDbErrors = true;
                  $scope.dbErrors = [];
                  for (var e = 0; e < messages[0].length; e++) {
                    //var key = messages[0][e].Name;
                    $scope.dbErrors.push(messages[0][e]);
                  }
                }
              });
          });
      }
    };

    /*Animation Code*/
    $scope.animateClass = animateNgClass('bounceInUp', 'animationduration25');

    /**back routing ***/
    $scope.goBack=function() {
      if ($state.current.name == 'app.FlexiSaveQuoteInput') {
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
  }]);
