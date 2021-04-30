switchModule.controller('switchChildAdvantagePiController', ['$scope',
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
  'utilityService',
  'commonFileFunctionFactory',
  'getSetCommonDataService',
  'pceHomeDataService',
  'quoteProposalNosDataService',
  'eAppServices',
  function($scope, $rootScope, $log, $state, $ionicPlatform, $ionicHistory, $cordovaFile, $ionicModal, $ionicNavBarDelegate, common_const, switchDataService, utilityService, commonFileFunctionFactory, getSetCommonDataService, pceHomeDataService, quoteProposalNosDataService, eAppServices) {
    'use strict';

    $scope.custId = $state.params.customerId;
    $scope.stepsCompleted = 1;
    $scope.saveResult = true;

    var childPi = switchDataService.getProfileData($state.params.customerId);
    childPi.then(function(child) {
      $scope.childAdvantagePiData = child;
      $scope.stepsCompleted = $scope.childAdvantagePiData.StepCompleted;
    });
    var selProductData = switchDataService.getProductData();

    if ($state.params.recId > 0) {
      var piSummaryData = switchDataService.getPi($state.params.recId);
      piSummaryData.then(function(piDetails) {
        switchDataService.setQuoteData(JSON.parse(piDetails.Input));
        switchDataService.setQuotecalculatedData(JSON.parse(piDetails.Output));
        $log.debug('piDetails', piDetails.Output);

        var cAQuoteData = switchDataService.getQuoteData();
        $scope.cAQuoteData = cAQuoteData;
        $scope.Gender = $scope.cAQuoteData.laGender;
        /**Upper Section**/
        $scope.lifeAssuredAge = parseInt($scope.cAQuoteData.laAge) + parseInt($scope.cAQuoteData.pt);
        $scope.LifeAssuredAgeatdeath = parseInt($scope.cAQuoteData.laAge) + parseInt($scope.cAQuoteData.pt) - 2;
        $scope.userCurrentImg = switchDataService.getImage(cAQuoteData.laAge);
        $scope.userFutureImg = switchDataService.getImage($scope.lifeAssuredAge);
        /**Middle Section**/
        $scope.guaranteedBenefitsAge = parseInt(cAQuoteData.laAge) + parseInt(cAQuoteData.pt) - 5;
        $scope.guaranteedBenefitsPaid = cAQuoteData.pt - 5;
        $scope.premiumMode = switchDataService.getMode(cAQuoteData.premiumMode);
        var getData = switchDataService.getQuotecalculatedData();
        $scope.getData = getData;
      });
    } else {
      var cAQuoteData = switchDataService.getQuoteData();
      $scope.cAQuoteData = cAQuoteData;
      $scope.Gender = $scope.cAQuoteData.laGender;
      /**Upper Section**/
      $scope.lifeAssuredAge = parseInt($scope.cAQuoteData.laAge) + parseInt($scope.cAQuoteData.pt);
      $scope.LifeAssuredAgeatdeath = parseInt($scope.cAQuoteData.laAge) + parseInt($scope.cAQuoteData.pt) - 2;
      $scope.MiddleLabelppt = $scope.cAQuoteData.pt - 2;
      $scope.userCurrentImg = switchDataService.getImage(cAQuoteData.laAge);
      $scope.userFutureImg = switchDataService.getImage($scope.lifeAssuredAge);
      /**Middle Section**/
      $scope.guaranteedBenefitsAge = parseInt(cAQuoteData.laAge) + parseInt(cAQuoteData.pt) - 5;
      $scope.guaranteedBenefitsPaid = cAQuoteData.pt - 5;
      $scope.premiumMode = switchDataService.getMode(cAQuoteData.premiumMode);
      var getData = switchDataService.getQuotecalculatedData();
      $scope.getData = getData;
      $log.debug("MiddleLabelppt :::", $scope.MiddleLabelppt );
    }

    $scope.backToProduct = function() {
      var cAQuoteData = switchDataService.getQuoteData();
      var getData = switchDataService.getQuotecalculatedData();
      var piData = {
        custId: $state.params.customerId,
        productId: selProductData.FkProductId,
        input: JSON.stringify(cAQuoteData),
        output: JSON.stringify(getData),
        annualPremium: cAQuoteData.annualPremium,
        isActive: 1
      };
      switchDataService.saveDataPi(piData);
      $state.go('app.productRecommendation', {
        customerId: $state.params.customerId,
      });
    };

    $scope.goToEapp = function() {
      var cAQuoteData = switchDataService.getQuoteData();
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
          productId: selProductData.FkProductId,
          input: JSON.stringify(cAQuoteData),
          output: JSON.stringify(getData),
          annualPremium: cAQuoteData.annualPremium,
          isActive: 1
        };
        switchDataService.saveDataPi(piData);
        quoteProposalNosDataService.resetTempBiJsonTbl();
        var buyingForData = {
          liFirstName: $scope.childAdvantagePiData.FirstName,
          liLastName: $scope.childAdvantagePiData.LastName,
          laGender: $scope.cAQuoteData.laGender,
          BuyingFor: 'Self'
        };
        $log.debug('buyingForData', buyingForData);
        eAppServices.setBuyForDetails(buyingForData);
        var quoteInputData = {
          laGender: cAQuoteData.laGender,
          pt: cAQuoteData.pt,
          ppt: cAQuoteData.ppt,
          annualPremium: cAQuoteData.annualPremium,
          premiumMode: cAQuoteData.premiumMode,
          NSAPForLA: cAQuoteData.NSAPForLA,
          benfitType: cAQuoteData.benfitType,
          maturityOption: cAQuoteData.maturityOption
        };
        $log.debug('sett quoteInputData +++', quoteInputData);
        $log.debug('sett quoteInputData +++', cAQuoteData.benfitType);
        eAppServices.setInputDetails(quoteInputData);
        $state.go('app.childAdvantage-LAAndProposer', {
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
    $scope.blueArrowup = function() {
      $scope.showblueArrowPopup = true;
      //  $scope.showblueArrowPopupup = true;
    };
    $scope.blueArrowdown = function() {
      $scope.showblueArrowPopup = false;
      //  $scope.showblueArrowPopupup = true;
    };
    $scope.showAssumtion = function() {
      $scope.showAssumtionPopup = true;
    };
    $scope.hideAssumtionPopup = function() {
      $scope.showAssumtionPopup = false;
    };
    /**back routing ***/
    $scope.goBack = function() {
      if ($state.current.name == 'app.switchChildAdvantagePi') {
        $state.go("app.switchChildAdvantageQuote", {
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
    //  $scope.showPlusPopup = false;
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
        trippleHealthObjectServicePi.tHSendMail(emailData).then(function() {
          $scope.hidesendEmailPopup();
          $scope.showPlusPopup = false;
        });
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



  }
]);
