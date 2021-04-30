switchModule.controller('eliteSecurePiController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$cordovaFile',
  '$ionicModal',
  '$ionicHistory',
  'common_const',
  'getSetCommonDataService',
  'commonFileFunctionFactory',
  'pceHomeDataService',
  'switchDataService',
  'eliteSecureSwitchService',
  'eAppServices',
  'utilityService',
  'quoteProposalNosDataService',
  'elitesecureObjectService',
  function($scope, $rootScope, $log, $state,$cordovaFile,$ionicModal, $ionicHistory, common_const, getSetCommonDataService,commonFileFunctionFactory, pceHomeDataService, switchDataService, eliteSecureSwitchService, eAppServices,utilityService, quoteProposalNosDataService,elitesecureObjectService) {
    'use strict';
    $scope.custId = $state.params.customerId;
    $scope.stepsCompleted = 1;
    $scope.elitData = null;
    $scope.saveResult = true;
    $scope.isIllustrationsSelected=true;
    $scope.isBrochureSelected=false;

    /*Animation Code*/
    $scope.setNowAnimate = function() {
      setAnimate($ionicHistory);
    };

    var eliteSecurePi = switchDataService.getProfileData($state.params.customerId);
    eliteSecurePi.then(function(eliteSecure) {
      $scope.elitData = eliteSecure;
      $scope.stepsCompleted = $scope.elitData.StepCompleted;
    });
    if ($state.params.recId > 0) {
      var piSummaryData = switchDataService.getPi($state.params.recId);
      piSummaryData.then(function(piDetails) {
        eliteSecureSwitchService.setQuoteData(JSON.parse(piDetails.Input));
        eliteSecureSwitchService.setEliteData(JSON.parse(piDetails.Output));
        var geteliteQuoteData = eliteSecureSwitchService.getQuoteData();
        $scope.laAge = geteliteQuoteData.laAge;
        $scope.Gender = geteliteQuoteData.laGender;
        $scope.userCurrentImg = eliteSecureSwitchService.getImage(geteliteQuoteData.laAge);
        var getData = eliteSecureSwitchService.getEliteData();
        $scope.getData = getData;
        $scope.premiumMode = switchDataService.getMode(getData.bi.premiumMode);
        $scope.userFutureImg = eliteSecureSwitchService.getImage(getData.bi.benefitUptoAge);
        /****Get number of coins according to ppt***/
        $scope.coinsCount = switchDataService.getCoins(getData.bi.policyTerm);
      });
    } else {
      var geteliteQuoteData = eliteSecureSwitchService.getQuoteData();
      $scope.laAge = geteliteQuoteData.laAge;
      $scope.Gender = geteliteQuoteData.laGender;
      $scope.userCurrentImg = eliteSecureSwitchService.getImage(geteliteQuoteData.laAge);
      var getData = eliteSecureSwitchService.getEliteData();
      $scope.getData = getData;
      $log.debug($scope.getData);
      $scope.premiumMode = switchDataService.getMode(getData.bi.premiumMode);
      $scope.userFutureImg = eliteSecureSwitchService.getImage(getData.bi.benefitUptoAge);
      /****Get number of coins according to ppt***/
      $scope.coinsCount = switchDataService.getCoins(getData.bi.policyTerm);
    }

    $scope.backToProduct = function() {
      var geteliteQuoteData = eliteSecureSwitchService.getQuoteData();
      var getData = eliteSecureSwitchService.getEliteData();

      var piData = {
        custId: $state.params.customerId,
        productId: common_const.ProductId_EliteSecure,
        input: JSON.stringify(geteliteQuoteData),
        output: JSON.stringify(getData),
        annualPremium: getData.basePremium,
        isActive: 1
      };
      $log.debug('backToProduct', piData);
      eliteSecureSwitchService.saveEliteSecurePi(piData);

      $state.go('app.productRecommendation', {
        customerId: $state.params.customerId,
      });
    };
    $scope.goToEapp = function() {
      var geteliteQuoteData = eliteSecureSwitchService.getQuoteData();
      var getData = eliteSecureSwitchService.getEliteData();
      $log.debug('geteliteQuoteData',geteliteQuoteData);
      /*Setting data for Eapp Buying for form*/
      var buyingForData = {
          liFirstName:$scope.elitData.FirstName,
          liLastName:$scope.elitData.LastName,
          laGender:geteliteQuoteData.laGender,
      };
      eAppServices.setBuyForDetails(buyingForData);

      var quoteInputData = {
        laGender:geteliteQuoteData.laGender,
        laAge:geteliteQuoteData.laAge,
        smoke:geteliteQuoteData.smoke,
        pt:geteliteQuoteData.pt,
        ppt:geteliteQuoteData.ppt,
        ptupto:geteliteQuoteData.ptupto,
        sumAssured:geteliteQuoteData.sumAssured,
        annualPremium:getData.basePremium,
        premiumMode: geteliteQuoteData.premiumMode

      };
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
        quoteProposalNosDataService.resetTempBiJsonTbl();

        var piData = {
          custId: $state.params.customerId,
          productId: selProductData.FkProductId,
          input: JSON.stringify(geteliteQuoteData),
          output: JSON.stringify(getData),
          annualPremium: getData.basePremium,
          isActive: 1
        };
        eliteSecureSwitchService.saveEliteSecurePi(piData);
        elitesecureObjectService.resetScreenData();
        $state.go('app.elitesecure-LAAndProposer', {
          customerId: $state.params.customerId,
        });
      });
    };
    $scope.showCalculatorPopup = function(PKSwitchCalculator) {
      $scope.showPlusPopup = !$scope.showPlusPopup;
    };

/*

    $scope.email=function(){
      $scope.showPlusPopup=false;
      $scope.showSendEmailPopup=true;
    };

    $scope.hidesendEmailPopup=function(){
      $scope.showPlusPopup=true;
      $scope.showSendEmailPopup=false;
    };



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

          eliteSecureSwitchService.esSendMail(emailData).then(function(){
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

    };*/
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
              eliteSecureSwitchService.esSendMail(emailData).then(function(){
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
          alert("brochure");
        };
    /*floating Buttion Start*/
  }
]);
