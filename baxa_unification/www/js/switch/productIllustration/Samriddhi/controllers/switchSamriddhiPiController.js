switchModule.controller('switchSamriddhiPiController', ['$scope',
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
  'samriddhiSwitchService',
  'commonFileFunctionFactory',
  'utilityService',
  'getSetCommonDataService',
  'pceHomeDataService',
  'quoteProposalNosDataService',
  'eAppServices',
  function($scope, $rootScope, $log, $state, $ionicPlatform, $ionicHistory,$cordovaFile,$ionicModal, $ionicNavBarDelegate, common_const, switchDataService, samriddhiSwitchService,commonFileFunctionFactory, utilityService, getSetCommonDataService, pceHomeDataService, quoteProposalNosDataService, eAppServices) {
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


    var samriddhiPi = switchDataService.getProfileData($state.params.customerId);
    samriddhiPi.then(function(samriddhi) {
      $scope.samriddhiPiData = samriddhi;
      $scope.stepsCompleted = $scope.samriddhiPiData.StepCompleted;
    });

    if ($state.params.recId > 0) {
      var piSummaryData = switchDataService.getPi($state.params.recId);
      piSummaryData.then(function(piDetails) {
        switchDataService.setQuoteData(JSON.parse(piDetails.Input));
        switchDataService.setQuotecalculatedData(JSON.parse(piDetails.Output));

        var samriddhiQuoteData = switchDataService.getQuoteData();
        $scope.samriddhiQuoteData = samriddhiQuoteData;
        $scope.Gender = $scope.samriddhiQuoteData.laGender;
        $scope.lifeAssuredAge = parseInt($scope.samriddhiQuoteData.laAge) + parseInt($scope.samriddhiQuoteData.pt);
        $scope.lifeAssuredAgeDeath = parseInt($scope.samriddhiQuoteData.laAge) + parseInt($scope.samriddhiQuoteData.pt) - 2;
        // $scope.policyTerm = parseInt($scope.samriddhiQuoteData.ppt) - 2;
        $scope.userCurrentImg = samriddhiSwitchService.getImage(samriddhiQuoteData.laAge);
        var getData = switchDataService.getQuotecalculatedData();
        $scope.sumAssured = getData.sumAssured;
        $scope.sumofNonGuaranteedBonuses = getData.sumofNonGuaranteedBonuses;
        $scope.nonGuaranteedBonusesMaturity = getData.nonGuaranteedBonusesMaturity;
        $scope.sumofBenefits = getData.sumofBenefits;
        $scope.deathBenefit = getData.deathBenefit;
        $scope.premiumMode = switchDataService.getMode(samriddhiQuoteData.premiumMode);
        $scope.modalPremium = getData.totalModalPremium;
        $scope.userFutureImg = samriddhiSwitchService.getImage($scope.lifeAssuredAge);
        $scope.coinsCount = switchDataService.getCoins(samriddhiQuoteData.ppt);
        $log.debug('samriddhiQuoteData', samriddhiQuoteData.ppt);
      });
    } else {
      var samriddhiQuoteData = switchDataService.getQuoteData();
      $scope.samriddhiQuoteData = samriddhiQuoteData;
      $scope.Gender = $scope.samriddhiQuoteData.laGender;
      $scope.lifeAssuredAge = parseInt($scope.samriddhiQuoteData.laAge) + parseInt($scope.samriddhiQuoteData.pt);
      $scope.lifeAssuredAgeDeath = parseInt($scope.samriddhiQuoteData.laAge) + parseInt($scope.samriddhiQuoteData.pt) - 2;
      // $scope.policyTerm = parseInt($scope.samriddhiQuoteData.pt) - 2;
      $scope.userCurrentImg = samriddhiSwitchService.getImage(samriddhiQuoteData.laAge);
      //var getData = samriddhiSwitchService.getsamriddhiData();
      $log.debug('switchDataService.getQuotecalculatedData()',switchDataService.getQuotecalculatedData());
      var getData = switchDataService.getQuotecalculatedData();
      $scope.sumAssured = getData.sumAssured;
      $scope.sumofNonGuaranteedBonuses = getData.sumofNonGuaranteedBonuses;
      $scope.nonGuaranteedBonusesMaturity = getData.nonGuaranteedBonusesMaturity;
      $scope.sumofBenefits = getData.sumofBenefits;
      $scope.deathBenefit = getData.deathBenefit;
      $scope.premiumMode = switchDataService.getMode(samriddhiQuoteData.premiumMode);
      $scope.modalPremium = getData.totalModalPremium;
      $scope.userFutureImg = samriddhiSwitchService.getImage($scope.lifeAssuredAgeDeath);
      $scope.coinsCount = switchDataService.getCoins(samriddhiQuoteData.ppt);
    }

    $scope.backToProduct = function() {
      var samriddhiQuoteData = switchDataService.getQuoteData();
      var getData = switchDataService.getQuotecalculatedData();
      $log.debug('samriddhiQuoteData',samriddhiQuoteData);
      var piData = {
        custId: $state.params.customerId,
        productId: common_const.ProductId_Samriddhi,
        input: JSON.stringify(samriddhiQuoteData),
        output: JSON.stringify(getData),
        annualPremium: samriddhiQuoteData.annualPremium,
        isActive: 1
      };
      samriddhiSwitchService.saveSamriddhiPi(piData);
      $state.go('app.productRecommendation', {
        customerId: $state.params.customerId,
      });
    };
    $scope.goToEapp = function() {
      var samriddhiQuoteData = switchDataService.getQuoteData();
      var getData = switchDataService.getQuotecalculatedData();
      $log.debug('samriddhiQuoteData',samriddhiQuoteData);
      $log.debug('getData',getData);

      /*Setting data for Eapp Buying for form*/
      var buyingForData = {
          BuyingFor: 'Self',
          liFirstName:$scope.samriddhiPiData.FirstName,
          liLastName:$scope.samriddhiPiData.LastName,
          laGender:$scope.samriddhiPiData.laGender,
      };
      $log.debug('sambuyingForData',buyingForData);
      eAppServices.setBuyForDetails(buyingForData);

      var quoteInputData = {
        laGender:samriddhiQuoteData.laGender,
        laAge:samriddhiQuoteData.laAge,
        smoke:samriddhiQuoteData.smoke,
        pt:samriddhiQuoteData.pt,
        ppt:samriddhiQuoteData.ppt,
        sumAssured:samriddhiQuoteData.sumAssured,
        annualPremium:samriddhiQuoteData.annualPremium,
        premiumMode: samriddhiQuoteData.premiumMode,
        payType:samriddhiQuoteData.payType,
        NSAPForLA:samriddhiQuoteData.NSAPForLA

      };
      $log.debug('samquoteInputData',quoteInputData);

      eAppServices.setInputDetails(quoteInputData);
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
          input: JSON.stringify(samriddhiQuoteData),
          output: JSON.stringify(getData),
          annualPremium: samriddhiQuoteData.annualPremium,
          isActive: 1
        };
        samriddhiSwitchService.saveSamriddhiPi(piData);
      quoteProposalNosDataService.resetTempBiJsonTbl();
      $state.go('app.samriddhi-LAAndProposer', {
        customerId: $state.params.customerId,
      });
    });
    };
    $scope.onClickBlueBar = function() {
      $scope.coinsShow = !$scope.coinsShow;
    };
    $scope.hideAssumtionPopup = function() {
      $scope.showAssumtionPopup = false;
    };
    $scope.showAssumtion = function() {
      $scope.showAssumtionPopup = true;
    };
    $scope.showCalculatorPopup = function(PKSwitchCalculator) {
      $scope.showPlusPopup = !$scope.showPlusPopup;
    };




    // $scope.email = function() {
    //   $scope.showPlusPopup = false;
    //   $scope.showSendEmailPopup = true;
    // };
    //
    // $scope.hidesendEmailPopup = function() {
    //   $scope.showPlusPopup = true;
    //   $scope.showSendEmailPopup = false;
    // }
    //
    // /*Funtion for send email and store email details in emailData*/
    //
    //
    // $scope.sendEmailPopupOnOk= function()
    // {
    //   $scope.isValidateEmailTo=false;
    //   $scope.isValidateEmailCc=false;
    //   var emailTo=$scope.email_To;
    //   var inputData={
    //     emailTo:$scope.email_To,
    //     emailCc:$scope.email_Cc,
    //     isBrochureSelected:$scope.isBrochureSelected,
    //     isIllustrationsSelected:$scope.isIllustrationsSelected
    //   };
    //
    //   utilityService.getEmailData(inputData).then(function(emailData){
    //       $log.debug("emailData",emailData);
    //       samriddhiSwitchService.sSendMail(emailData).then(function(){
    //           $scope.hidesendEmailPopup();
    //           $scope.showPlusPopup=false;
    //
    //       });
    //   },function(errorMsg){
    //     if(errorMsg=="emailTo"){
    //         $scope.isValidateEmailTo=true;
    //     }
    //     if(errorMsg=="emailCc"){
    //         $scope.isValidateEmailCc=true;
    //     }
    //   });
    // };


    /**back routing ***/
    // $scope.goBack = function() {
    //   if ($state.current.name == 'app.switchSamriddhiPi') {
    //     $state.go("app.switchSamriddhiQuote");
    //   } else {
    //     $ionicHistory.goBack();
    //   }
    // };
    // if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
    //   $ionicNavBarDelegate.showBackButton(false);
    // } else {
    //   $ionicNavBarDelegate.showBackButton(true);
    // }
    // $ionicPlatform.registerBackButtonAction(function() {
    //   $scope.goBack();
    // }, 100);
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
        $scope.email=function(){
          $scope.showPlusPopup=false;
          $scope.showSendEmailPopup=true;
        };

        $scope.hidesendEmailPopup=function(){
          $scope.showPlusPopup=true;
          $scope.showSendEmailPopup=false;
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
    /*floating Buttion Start*/
  }
]);
