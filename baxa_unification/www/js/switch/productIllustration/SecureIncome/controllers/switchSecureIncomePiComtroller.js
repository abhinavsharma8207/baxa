switchModule.controller('switchSecureIncomePiComtroller', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$ionicPlatform',
  '$ionicHistory',
  '$cordovaFile',
  '$ionicModal',
  '$ionicNavBarDelegate',
  'common_const',
  'switchDataService',
  'secureIncomeSwitchservice',
  'commonFileFunctionFactory',
  'eAppServices',
  'getSetCommonDataService',
  'pceHomeDataService',
  'quoteProposalNosDataService',
  'utilityService',
  function($scope, $rootScope, $log, $state, $ionicPlatform, $ionicHistory, $cordovaFile, $ionicModal, $ionicNavBarDelegate, common_const, switchDataService, secureIncomeSwitchservice, commonFileFunctionFactory, eAppServices, getSetCommonDataService, pceHomeDataService, quoteProposalNosDataService,utilityService) {
    'use strict';

    $scope.custId = $state.params.customerId;
    $scope.stepsCompleted = 1;
    $scope.saveResult = true;
    $scope.isIllustrationsSelected = true;
    $scope.isBrochureSelected = false;
    /*Animation Code*/
    $scope.setNowAnimate = function() {
      setAnimate($ionicHistory);
    };

    var secureIPi = switchDataService.getProfileData($state.params.customerId);
    secureIPi.then(function(secureI) {
      $log.debug('secureI', secureI);
      $scope.secureIncomePiData = secureI;
      $scope.stepsCompleted = $scope.secureIncomePiData.StepCompleted;
    });

    if ($state.params.recId > 0) {
      var piSummaryData = switchDataService.getPi($state.params.recId);
      piSummaryData.then(function(piDetails) {
        switchDataService.setQuoteData(JSON.parse(piDetails.Input));
        switchDataService.setQuotecalculatedData(JSON.parse(piDetails.Output));
        $log.debug('piDetails', piDetails.Output);

        var sIQuoteData = switchDataService.getQuoteData();
        $scope.sIQuoteData = sIQuoteData;
        $scope.Gender = $scope.sIQuoteData.laGender;
        $scope.lifeAssuredAge = parseInt($scope.sIQuoteData.laAge) + parseInt($scope.sIQuoteData.pt);
        $scope.ageOfInsured = parseInt($scope.sIQuoteData.laAge) + parseInt($scope.sIQuoteData.ppt) + 2;
        $scope.ageOfInsuredInAbsence = parseInt($scope.sIQuoteData.laAge) + parseInt($scope.sIQuoteData.ppt);
        $scope.userCurrentImg = switchDataService.getImage(sIQuoteData.laAge);
        $scope.userFutureImg = switchDataService.getImage($scope.lifeAssuredAge);
        $scope.greencoinsCount = switchDataService.getCoins((sIQuoteData.pt) - (sIQuoteData.ppt));
        $scope.coinsCount = switchDataService.getCoins(sIQuoteData.ppt);
        var getData = switchDataService.getQuotecalculatedData();
        $log.debug('getData', getData);
        $scope.guaranteedAdditionsMaturity = getData.guaranteedAdditionsMaturity;
        $scope.sumAssuredpaidMaturity = getData.sumAssuredpaidMaturity;
        $scope.sumofBenefits = getData.sumofBenefits;
        $scope.deathBenefit = getData.deathBenefit;
        $scope.totalModalPremium = getData.totalModalPremium;
        $scope.GuaranteedMonthlyIncome = getData.GuaranteedMonthlyIncome;
        $scope.sumGAI = getData.sumGAI;
        $log.debug('getData++++', getData.guaranteedAdditionsMaturity);

      });
    } else {
      var sIQuoteData = switchDataService.getQuoteData();
      $scope.sIQuoteData = sIQuoteData;
      $scope.Gender = $scope.sIQuoteData.laGender;
      $scope.lifeAssuredAge = parseInt($scope.sIQuoteData.laAge) + parseInt($scope.sIQuoteData.pt);
      $scope.ageOfInsured = parseInt($scope.sIQuoteData.laAge) + parseInt($scope.sIQuoteData.ppt) + 2;
      $scope.ageOfInsuredInAbsence = parseInt($scope.sIQuoteData.laAge) + parseInt($scope.sIQuoteData.ppt);
      $scope.userCurrentImg = switchDataService.getImage(sIQuoteData.laAge);
      $scope.userFutureImg = switchDataService.getImage($scope.lifeAssuredAge);
      $scope.greencoinsCount = switchDataService.getCoins((sIQuoteData.pt) - (sIQuoteData.ppt));
      $scope.coinsCount = switchDataService.getCoins(sIQuoteData.ppt);
      $scope.premiumMode = switchDataService.getMode(sIQuoteData.premiumMode);
      var getData = switchDataService.getQuotecalculatedData();
      $scope.guaranteedAdditionsMaturity = getData.guaranteedAdditionsMaturity;
      $scope.sumAssuredpaidMaturity = getData.sumAssuredpaidMaturity;
      $scope.sumofBenefits = getData.sumofBenefits;
      $scope.deathBenefit = getData.deathBenefit;
      $scope.totalModalPremium = getData.totalModalPremium;
      $scope.GuaranteedMonthlyIncome = getData.GuaranteedMonthlyIncome;
      $scope.sumGAI = getData.sumGAI;

    }

    $scope.backToProduct = function() {
      var sIQuoteData = switchDataService.getQuoteData();
      var getData = switchDataService.getQuotecalculatedData();
      $log.debug('totalModalPremium getData', getData);

      var piData = {
        custId: $state.params.customerId,
        productId: common_const.ProductId_SI,
        input: JSON.stringify(sIQuoteData),
        output: JSON.stringify(getData),
        annualPremium: sIQuoteData.annualPremium,
        isActive: 1
      };
      $log.debug('piData+++', piData);
      switchDataService.saveDataPi(piData);
      $state.go('app.productRecommendation', {
        customerId: $state.params.customerId,
      });
    };

    $scope.goToEapp = function() {
      var sIQuoteData = switchDataService.getQuoteData();
      var getData = switchDataService.getQuotecalculatedData();

      /*Setting data for Eapp*/
      var userData = getSetCommonDataService.getCommonData();
      var selProductData = switchDataService.getProductData();
      pceHomeDataService.getRiderDetails(selProductData.FkProductId).then(function(ridersData) {
        var prodData = {
          prodId: selProductData.FkProductId,
          prodLbl: selProductData.Label,
          prodUIN: selProductData.UIN,
          ridersData: ridersData
        };
        $log.debug("prodData :::", prodData);
        getSetCommonDataService.setCurrentProdData(prodData);
        $rootScope.selectedProductIdForCalculation = selProductData.FkProductId;
        var piData = {
          custId: $state.params.customerId,
          productId: common_const.ProductId_SI,
          input: JSON.stringify(sIQuoteData),
          output: JSON.stringify(getData),
          annualPremium: sIQuoteData.annualPremium,
          isActive: 1
        };
        switchDataService.saveDataPi(piData);
        quoteProposalNosDataService.resetTempBiJsonTbl();
        var buyingForData = {
          liFirstName: $scope.secureIncomePiData.FirstName,
          liLastName: $scope.secureIncomePiData.LastName,
          laGender: $scope.sIQuoteData.laGender,
          BuyingFor: 'Self'
        };
        $log.debug('buyingForData', buyingForData);
        eAppServices.setBuyForDetails(buyingForData);
        var quoteInputData = {
          laGender: sIQuoteData.laGender,
          pt: sIQuoteData.pt,
          ppt: sIQuoteData.ppt,
          annualPremium: sIQuoteData.annualPremium,
          premiumMode: sIQuoteData.premiumMode

        };
        eAppServices.setInputDetails(quoteInputData);
        $state.go('app.secureincome-LAAndProposer', {
          customerId: $state.params.customerId,
        });
      });
    };


    $scope.showCalculatorPopup = function(PKSwitchCalculator) {
      $scope.showPlusPopup = !$scope.showPlusPopup;
    };
    $scope.onClickGreenBar = function() {
      $scope.coinsShowGreen = !$scope.coinsShowGreen;
      $scope.coinsShowBlue = false;
    };
    $scope.onClickBlueBar = function() {
      $scope.coinsShowBlue = !$scope.coinsShowBlue;
      $scope.coinsShowGreen = false;
    };
    $scope.showAssumtion = function() {
      $scope.showAssumtionPopup = true;
    };
    $scope.hideAssumtionPopup = function() {
      $scope.showAssumtionPopup = false;
    };
    /**back routing ***/
    //   $scope.goBack = function() {
    //     if ($state.current.name == 'app.switchSecureIncomePi') {
    //       $state.go("app.switchSecureIncomeQuote");
    //     } else {
    //       $ionicHistory.goBack();
    //     }
    //   };
    //   if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
    //     $ionicNavBarDelegate.showBackButton(false);
    //   } else {
    //     $ionicNavBarDelegate.showBackButton(true);
    //   }
    //   $ionicPlatform.registerBackButtonAction(function() {
    //     $scope.goBack();
    //   }, 100);
    //
    /*floating Buttion Start*/
    $scope.cameraFun = function() {
      var imagePath = "MyDocuments/Switch/" + $scope.custId + "/Images";
      $cordovaFile.getFreeDiskSpace().then(function(success) {
        var exists = commonFileFunctionFactory.checkDir(cordova.file.externalApplicationStorageDirectory, imagePath);
        if (!exists) {
          commonFileFunctionFactory.createDir(cordova.file.externalApplicationStorageDirectory, imagePath,
            function(sucess) {
              commonFileFunctionFactory.savePicture(cordova.file.externalApplicationStorageDirectory + imagePath,
                function(succ) {
                  $log.debug("image saved successfuly");
                },
                function(err) {
                  $log.debug("image not saved");
                }
              );
            },
            function(error) {
              $log.debug("error");
            }
          );
        }
      }, function(error) {
        $scope.showAlert = function() {
          var alertPopup = $ionicPopup.alert({
            title: 'Device Memory Full!',
            template: 'Ooops! Your device memory is full, please remove some data or else your notes will not be saved.'
          });
          alertPopup.then(function(res) {
            $log.debug('Device Memory : Confirmed!');
          });
        };
      });
    };

    $scope.addNotes = function() {
      $ionicModal.fromTemplateUrl("js/common/templates/add-note.html", {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.createNote = function(note) {
      var notePath = "MyDocuments/Switch/" + $scope.custId + "/Notes";
      var fileName = "" + new Date().getTime() + ".json";
      $cordovaFile.getFreeDiskSpace().then(function(success) {
        var exists = commonFileFunctionFactory.checkDir(cordova.file.externalApplicationStorageDirectory, notePath);
        if (!exists) {
          commonFileFunctionFactory.createDir(cordova.file.externalApplicationStorageDirectory, notePath,
            function(sucess) {
              $log.debug("created dir successfuly");
              commonFileFunctionFactory.createNote(note, cordova.file.externalApplicationStorageDirectory + notePath, fileName,
                function(succ) {
                  $log.debug("notes saved successfuly");
                  $scope.modal.hide();
                },
                function(err) {
                  $log.debug("notes not saved");
                }
              );
            },
            function(error) {
              $log.debug("error");
            }
          );
        }
      }, function(error) {
        $scope.showAlert = function() {
          var alertPopup = $ionicPopup.alert({
            title: 'Device Memory Full!',
            template: 'Ooops! Your device memory is full, please remove some data or else your notes will not be saved.'
          });
          alertPopup.then(function(res) {
            $log.debug('Device Memory : Confirmed!');
          });
        };
      });
    };
    $scope.email = function() {
      $scope.showPlusPopup = false;
      $scope.showSendEmailPopup = true;
    };

    $scope.hidesendEmailPopup = function() {
      $scope.showPlusPopup = true;
      $scope.showSendEmailPopup = false;
    };

    /*Funtion for send email and store email details in emailData*/

    $scope.sendEmailPopupOnOk = function() {
      $scope.isValidateEmailTo = false;
      $scope.isValidateEmailCc = false;
      var emailTo = $scope.email_To;
      var inputData = {
        emailTo: $scope.email_To,
        emailCc: $scope.email_Cc,
        isBrochureSelected: $scope.isBrochureSelected,
        isIllustrationsSelected: $scope.isIllustrationsSelected
      };
      utilityService.getEmailData(inputData).then(function(emailData) {
        $log.debug("emailData", emailData);
      }, function(errorMsg) {
        if (errorMsg == "emailTo") {
          $scope.isValidateEmailTo = true;
        }
        if (errorMsg == "emailCc") {
          $scope.isValidateEmailCc = true;
        }
      });
    };

    $scope.brochure = function() {
      alert("brochure");
    };
    /*floating Buttion end*/

}]);
