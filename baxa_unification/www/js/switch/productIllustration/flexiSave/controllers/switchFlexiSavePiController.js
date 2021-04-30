/******
@Author:Gitaram Kanawade
Date:25 july 2016
Controller for Flexi save product illustration
Back button functuions
****/
switchModule.controller('flexiSavePiController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$ionicPlatform',
  '$ionicNavBarDelegate',
  '$ionicHistory',
  '$cordovaFile',
  '$ionicModal',
  'common_const',
  'utilityService',
  'switchDataService',
  'switchDbService',
  'eAppServices',
  'getSetCommonDataService',
  'pceHomeDataService',
  'quoteProposalNosDataService',
  'commonFileFunctionFactory',
  function($scope, $rootScope, $log, $state, $ionicPlatform, $ionicNavBarDelegate, $ionicHistory,$cordovaFile,$ionicModal, common_const, utilityService, switchDataService, switchDbService, eAppServices, getSetCommonDataService, pceHomeDataService, quoteProposalNosDataService,commonFileFunctionFactory) {
  'use strict';
    /****Initialise variable**/
    $scope.custId = $state.params.customerId;
    $scope.stepsCompleted = 1;
    $scope.flexiSavePiPiData = null;
    $scope.saveResult = true;
    $scope.isIllustrationsSelected=true;
    $scope.isBrochureSelected=false;


    /***When click on proceed to form first name and ***/
    var flexiSavePi = switchDataService.getProfileData($state.params.customerId);
    flexiSavePi.then(function(flexiSave) {
      $scope.flexiSavePiPiData = flexiSave;
      $scope.stepsCompleted = $scope.flexiSavePiPiData.StepCompleted;
    });
    /******Get all require data***/
    if ($state.params.recId > 0) {/**if user is from Summary page to PI**/
      var piSummaryData = switchDataService.getPi($state.params.recId);
      piSummaryData.then(function(piDetails) {
        switchDataService.setQuoteData(JSON.parse(piDetails.Input));
        var getDbOutput = JSON.parse(piDetails.Output);
        //switchDataService.setCommonData(getDbOutput.biData);
        switchDataService.setQuotecalculatedData(getDbOutput);
        var flexiCustData = switchDataService.getQuoteData();
        $scope.flexiSaveQuoteData = flexiCustData;
        $scope.Gender = flexiCustData.laGender;
        $scope.lifeAssuredAgeMaturity = parseInt(flexiCustData.laAge) + parseInt(flexiCustData.pt);
        $scope.insuredlifeAge = parseInt(flexiCustData.laAge) + parseInt(flexiCustData.ppt);
        $scope.FlexiBenefitPeriod = parseInt($scope.lifeAssuredAgeMaturity) - 10;
        $scope.userCurrentImg = switchDataService.getImage(flexiCustData.laAge);
        var calculatedData = switchDataService.getQuotecalculatedData();

        $scope.nonguaranteedBenefitAtMaturity=calculatedData.nonguaranteedBenefitAtMaturity;
        $scope.deathBenefit8PerInAbsense = calculatedData.deathBenefit;
        $scope.sumOfBenefits =calculatedData.sumofBenefits;
        $scope.sumAssured=calculatedData.sumAssured;
        $scope.totalModalPremium=calculatedData.totalModalPremium;
        $scope.deathBenefitInAbsense = calculatedData.deathBenefitInAbsense;


        //$scope.modalPremium.totalModalPremium=flexiCustData.modalPremium;
      //  $scope.modalPremium.sumAssured = getDbOutput.calData.sumAssured;
        $scope.premiumMode = switchDataService.getMode(flexiCustData.premiumMode);
      //  $scope.nonguaranteedBenefitAtMaturity = parseInt(getData.nonguaranteedMaturityBenefit8Per[getData.nonguaranteedMaturityBenefit8Per.length - 1]) - parseInt(getDbOutput.calData.sumAssured);
      //  $scope.deathBenefit8PerInAbsense = getData.nonguaranteedDeathBenefit8Per[getData.nonguaranteedDeathBenefit8Per.length - 3];

        $scope.sumOfBenefits = parseInt($scope.nonguaranteedBenefitAtMaturity) + parseInt(getDbOutput.sumAssured);

        $scope.userFutureImg = switchDataService.getImage($scope.lifeAssuredAgeMaturity);
        /****Get number of coins according to ppt***/
        $scope.coinsCount = switchDataService.getCoins(flexiCustData.ppt);
        /*****in case of absence***/
        $scope.lifeAssuredAgeDeath = parseInt(flexiCustData.laAge) + parseInt(flexiCustData.pt) - 2;
        $scope.policyTerm = parseInt(flexiCustData.pt) - 2;
      });
    } else {/**if user is from Quote input  page to PI**/
      var flexiCustData = switchDataService.getQuoteData();
      $scope.flexiSaveQuoteData = flexiCustData;
      $scope.Gender = $scope.flexiSaveQuoteData.laGender;
      $scope.lifeAssuredAgeMaturity = parseInt($scope.flexiSaveQuoteData.laAge) + parseInt($scope.flexiSaveQuoteData.pt);
      $scope.insuredlifeAge = parseInt($scope.flexiSaveQuoteData.laAge) + parseInt($scope.flexiSaveQuoteData.ppt);
      $scope.FlexiBenefitPeriod = parseInt($scope.lifeAssuredAgeMaturity) - 10;
      $scope.userCurrentImg = switchDataService.getImage($scope.flexiSaveQuoteData.laAge);
      $scope.premiumMode = switchDataService.getMode($scope.flexiSaveQuoteData.premiumMode);
      /*****Ge calculated from quote****/
      var calculatedData = switchDataService.getQuotecalculatedData();
       $scope.sumofnonguaranteedDeathBenefit8Per = calculatedData.sumofnonguaranteedDeathBenefit8Per;
      $scope.nonguaranteedBenefitAtMaturity=calculatedData.nonguaranteedBenefitAtMaturity;
      $scope.deathBenefit8PerInAbsense = calculatedData.deathBenefit;
       $scope.deathBenefitInAbsense = calculatedData.deathBenefitInAbsense;
      $scope.sumOfBenefits =calculatedData.sumofBenefits;
      $scope.sumAssured=calculatedData.sumAssured;
      $scope.totalModalPremium=calculatedData.totalModalPremium;

      $scope.userFutureImg = switchDataService.getImage($scope.lifeAssuredAgeMaturity);
      /****Get number of coins according to ppt***/
      $scope.coinsCount = switchDataService.getCoins(flexiCustData.ppt);
      /*****in case of absence***/
      $scope.lifeAssuredAgeDeath = parseInt($scope.flexiSaveQuoteData.laAge) + parseInt($scope.flexiSaveQuoteData.pt) - 2;
      $scope.policyTerm = parseInt($scope.flexiSaveQuoteData.pt) - 2;
    }
    /*****show the coins***/
    $scope.showCoin = function() {
      $scope.showCoins = !$scope.showCoins;
      $scope.expnGreen = false;
    };
    /***When click in green bar then show two green colors**/
    $scope.expandGreen = function() {
      $scope.expnGreen = !$scope.expnGreen;
      $scope.showCoins = false;
    };
    /*****Close Assumption popup***/
    $scope.hideAssumtionPopup = function() {
      $scope.showAssumtionPopup = false;
    };
    /*****Close Assumption popup***/
    $scope.showAssumtion = function() {
      $scope.showAssumtionPopup = true;
    };
    /*******When click on Floating button******/
    $scope.showCalculatorPopup = function(PKSwitchCalculator) {
      $scope.showPlusPopup = !$scope.showPlusPopup;
    };
    /*Animation Code*/
    $scope.setNowAnimate = function() {
      setAnimate($ionicHistory);
    }
    /*****When user click on back to product******/
    $scope.backToProduct = function() {
      var getCalData = {};
      var flexiSaveQuoteData = switchDataService.getQuoteData();
      // getCalData = {
      //   calData: switchDataService.getQuotecalculatedData(),
      //   biData: switchDataService.getCommonData()
      // };
      getCalData=switchDataService.getQuotecalculatedData();
       var biData= switchDataService.getCommonData()
      var piData = {
        custId: $state.params.customerId,
        productId: common_const.ProductId_Flexisave,
        input: JSON.stringify(flexiSaveQuoteData),
        output: JSON.stringify(getCalData),
        deathBenefitInAbsense:$scope.deathBenefitInAbsense,
        annualPremium: getCalData.totalModalPremium,
        isActive: 1
      };

      switchDataService.saveDataPi(piData);
      $state.go('app.productRecommendation', {
        customerId: $state.params.customerId,  //Redirerct to to Product page
      });
    };
    /*****When user click on proceed to form filling***/
    $scope.goToEapp = function() {
      var flexiSaveQuoteData = switchDataService.getQuoteData();

        var getCalData = {};
       getCalData=switchDataService.getQuotecalculatedData();
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
        getSetCommonDataService.setCurrentProdData(prodData);
        $rootScope.selectedProductIdForCalculation = selProductData.FkProductId;
        var piData = {
        custId: $state.params.customerId,
        productId: common_const.ProductId_Flexisave,
        input: JSON.stringify(flexiSaveQuoteData),
        output: JSON.stringify(getCalData),
        annualPremium: getCalData.totalModalPremium,
        isActive: 1
      };
      switchDataService.saveDataPi(piData);
      quoteProposalNosDataService.resetTempBiJsonTbl();
      /*Setting data for Eapp*/
      var buyingForData = {
        liFirstName: $scope.flexiSavePiPiData.FirstName,
        liLastName: $scope.flexiSavePiPiData.LastName,
        laGender: $scope.Gender,
        BuyingFor: 'Self'
      };
      eAppServices.setBuyForDetails(buyingForData);
      var quoteInputData = {
        laGender: $scope.Gender,
        laAge: $scope.flexiSaveQuoteData.laAge,
        pt: $scope.flexiSaveQuoteData.pt,
        ppt: $scope.flexiSaveQuoteData.ppt,
        sumAssured: getCalData.sumAssured,
        annualPremium: getCalData.totalModalPremium,
        premiumMode: $scope.flexiSaveQuoteData.premiumMode
      };
      eAppServices.setInputDetails(quoteInputData);
      $state.go('app.flexiSave-LAAndProposer', {
        customerId: $state.params.customerId,  //Redirerct to to Eapp
      });
    });
    };

    /**back routing on mobile devices and Tab***/
    // $scope.goBack=function(){
    //   if ($state.current.name == 'app.switchFlexiSavePi') {
    //       $state.go("app.FlexiSaveQuoteInput");
    //   } else {
    //     $ionicHistory.goBack();
    //   }
    // };
    // if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
    //   $ionicNavBarDelegate.showBackButton(false);
    // } else {
    //   $ionicNavBarDelegate.showBackButton(true);
    // }
    // /*When back button of Mobile device is clicked***/
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

        $scope.sendEmailPopupOnOk= function()
        {
          $scope.isValidateEmailTo=false;
          $scope.isValidateEmailCc=false;
          var emailTo=$scope.email_To;
          var inputData={
            emailTo:$scope.email_To,
            emailCc:$scope.email_Cc,
            isBrochureSelected:$scope.isBrochureSelected,
            isIllustrationsSelected:$scope.isIllustrationsSelected
          };

          utilityService.getEmailData(inputData).then(function(emailData){
              $log.debug("emailData",emailData);
              var getfSQuoteData = switchDataService.getQuoteData();
              var getData = switchDataService.getQuotecalculatedData();
              var productData = switchDataService.getProductData();
                $log.debug("getfSQuoteData",getfSQuoteData);
                $log.debug("getData",getData);
                $log.debug('productData',productData);
                emailData.productId = productData.FkProductId;
                emailData.mailJson = {};
              $log.debug('emailData',emailData);
              switchDbService.sendMail(emailData).then(function(mail){
                $scope.hidesendEmailPopup();
                $scope.showPlusPopup=false;
              });
          },function(errorMsg){
            if(errorMsg=="emailTo"){
                $scope.isValidateEmailTo=true;
            }
            if(errorMsg=="emailCc"){
                $scope.isValidateEmailCc=true;
            }
          });
        };
        $scope.brochure = function() {
          //alert("brochure");
        };
    /*floating Buttion Start*/


  }]);
