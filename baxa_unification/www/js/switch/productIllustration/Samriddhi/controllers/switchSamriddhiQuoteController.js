switchModule.controller('switchSamriddhiQuoteController', ['$scope',
  '$q',
  '$state',
  '$http',
  '$log',
  '$rootScope',
  '$ionicPlatform',
  '$ionicHistory',
  '$cordovaToast',
  '$ionicNavBarDelegate',
  'samriddhiValidationService',
  'samriddhiCalculationSvc',
  'switchDataService',
  'samriddhiSwitchService',
  'eAppServices',
  function($scope, $q, $state, $http, $log, $rootScope, $ionicPlatform, $ionicHistory, $cordovaToast, $ionicNavBarDelegate, samriddhiValidationService, samriddhiCalculationSvc, switchDataService, samriddhiSwitchService, eAppServices) {
    'use strict';
    $scope.fromSwitch = true;
    var vm = this;
    var prodId = 2;
    var channelId = 1;

    /*Animation Code*/
    $scope.animateClass = animateNgClass('bounceInUp', 'animationduration25');

    $scope.title = "Samriddhi";
    $scope.data = {};
    $scope.inputData = {};
    $scope.custId = $state.params.customerId;

    /* userInputsData*/
    var params = {
      "ui_gender": true,
      "ui_age": true,
      "ui_smoke": false,
      "ui_nsap": true,
      "ui_payType": true,
      "ui_termExtra": false, //{"label": "Flexi Benifit Period", "default": "20-30"}
      "ui_sumAssured": false,
      "ui_anualPreminum": true,
      "ui_modelPreminum": true,
      "switch": true,
      "ui_presence": true
    };
    $scope.inputData = {
      laMinAge: "0",
      laMaxAge: "55",
      laAge: 35,
      premiumMode: 1,
      annualPremium: 50000,
      ppt: 25,
      pt: 25,
      ptupto: null,
      inYour:'PRESENCE',
      payType:'REGULAR'
    };
    eAppServices.getLaAge(prodId, channelId)
      .then(function(result) {
        $scope.data.laMinAge = result.MinAge;
        $scope.data.laMaxAge = result.MaxAge;
        $scope.data.laMinAgeYear = result.MinDate;
        $scope.data.laMaxAgeYear = result.MaxDate;
      });


    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "BUYPOLFOR", "PMODE", "PPT", "PAYTYPE"], ["PT", "MPFACTOR", "PREPAYOPN"])
      .then(function(result) {
        $scope.params = params;
        $scope.formData = result[0]; // Form Data from AskGenericMaster
        $scope.formDataCalc = {
          "PT": JSON.parse(result[1].PT),
          "MPFACTOR": JSON.parse(result[1].MPFACTOR),
          "PREPAYOPN": JSON.parse(result[1].PREPAYOPN)
        };
        $scope.formDataOut = result[2]; // Form Data from AskGenericMaster for Riders

      });

    /*Get validation messgae through json file.*/
    $http.get('js/switch/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
      $scope.ageOutofRange=$scope.validationMessage.data.zeroToFiftyfive;
    });

      var quoteData=switchDataService.getQuoteData();
      if(angular.isUndefined(quoteData) || quoteData===null ){
          var customerData = switchDataService.getProfileData($state.params.customerId);
          customerData.then(function(samriddhi) {
            $scope.samriddhiData = samriddhi;
            var gender = $scope.samriddhiData.Gender;
            $scope.inputData.laGender = gender;
            var ageCheck = $scope.samriddhiData.Age;
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
          }else{
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

    $scope.calculate = function(inputData) {
      $log.debug('inputData====',inputData);
      $scope.inputData.pt = eAppServices.getPolyOrPreminumTerm(inputData.ppt, $scope.formDataCalc.PT);
      $scope.inputData.modalPremium = eAppServices.getModalPremiumFromAnnualPremium(inputData.premiumMode, inputData.annualPremium, $scope.formDataCalc.MPFACTOR);
      var samridhiData = {
        laAge: inputData.laAge,
        laGender: inputData.laGender,
        ppt: inputData.ppt,
        pt: inputData.pt,
        premiumMode: inputData.premiumMode,
        basePremium: inputData.annualPremium,
        sumAssured: 0,
        NSAPForLA:inputData.NSAPForLA
      };
      samriddhiValidationService.validateBaseProduct(prodId, channelId, samridhiData).then(function(messages) {
        $log.debug('messages', messages[0]);
        $scope.dbError = [];
        if (messages.length === 0) {
          $scope.showDbErrors = false;
          switchDataService.setQuoteData(inputData);
          var calculatedData = samriddhiCalculationSvc.calculatePremium(prodId, channelId, samridhiData);
          calculatedData.then(function(result) {
            $scope.calculatedData = result;
            var getCalculation = samriddhiCalculationSvc.generateSamriddhiBI(prodId, channelId, samridhiData, $scope.calculatedData.basePremium, $scope.calculatedData.sumAssured);
            getCalculation.then(function(sCalcResult) {
              $log.debug('samriddhiResult',result);
              $log.debug('samriddhiResult+++',sCalcResult.nonguaranteedDeathBenefit8Per[sCalcResult.nonguaranteedDeathBenefit8Per.length-3]);
              $log.debug('samriddhiResult+++',sCalcResult.guaranteedDeathBenefit[sCalcResult.guaranteedDeathBenefit.length-1]);
              var samridhiPiData = {
                sumAssured:sCalcResult.guaranteedMaturityBenefit[sCalcResult.guaranteedMaturityBenefit.length-1],
                sumofNonGuaranteedBonuses:sCalcResult.nonguaranteedDeathBenefit8Per[sCalcResult.nonguaranteedDeathBenefit8Per.length-3] - sCalcResult.guaranteedDeathBenefit[sCalcResult.guaranteedDeathBenefit.length-1],
                nonGuaranteedBonusesMaturity:sCalcResult.nonguaranteedMaturityBenefit8Per[sCalcResult.nonguaranteedMaturityBenefit8Per.length-1] - sCalcResult.guaranteedDeathBenefit[sCalcResult.guaranteedMaturityBenefit.length-1],
                sumofBenefits:sCalcResult.guaranteedMaturityBenefit[sCalcResult.guaranteedMaturityBenefit.length-1] + sCalcResult.nonguaranteedMaturityBenefit8Per[sCalcResult.nonguaranteedMaturityBenefit8Per.length-1] - sCalcResult.guaranteedMaturityBenefit[sCalcResult.guaranteedMaturityBenefit.length-1],
                deathBenefit:sCalcResult.guaranteedDeathBenefit[sCalcResult.guaranteedDeathBenefit.length-3],
                totalModalPremium:$scope.calculatedData.totalModalPremium
              };
              $log.debug('samridhiPiData',samridhiPiData);
              switchDataService.setQuotecalculatedData(samridhiPiData);
              $state.go('app.switchSamriddhiPi', {
                customerId: $state.params.customerId,
                recId: null
              });
            });
          });
        } else {
          $scope.showDbErrors = true;
          $scope.dbErrors = [];
          for (var e = 0; e < messages[0].length; e++) {
            $scope.dbErrors.push(messages[0][e]);
          }
        }
      });
    };

    /*******Get selected pay type and assign default values according*****/
    $scope.getSelectPayType=function(type){
           $scope.inputData.payType=type;
           if(type=='LIMITED'){
             $scope.inputData.pt=0;
             $scope.inputData.ppt=0;

           }
           else if(type=='REGULAR'){
             $scope.inputData.pt=25;
             $scope.inputData.ppt=25;
           }
    }
    /**back routing ***/
    $scope.goBack = function() {
      if ($state.current.name == 'app.switchSamriddhiQuote') {
        $state.go("app.productRecommendation");
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
