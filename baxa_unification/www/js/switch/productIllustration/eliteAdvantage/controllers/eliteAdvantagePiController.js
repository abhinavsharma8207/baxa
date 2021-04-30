unificationBAXA.controller('switchEliteAdvantagePi', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$http',
  'eSValidationServiceSwitchPi',
  'eliteSecureSwitchService',
  'eSCalculationService',
  'commonDbProductCalculation',
  '$cordovaFile',
  '$ionicModal',
  'switchDataService',
  'eAppServices',
  'eliteAdvantageSwitchService',
  'commonFileFunctionFactory',
  'common_const',
  'switchDbService',
  'pceHomeDataService',
  'getSetCommonDataService',
  'quoteProposalNosDataService',
  function($scope, $rootScope, $log, $state, $http, eSValidationServiceSwitchPi, eliteSecureSwitchService, eSCalculationService, commonDbProductCalculation, $cordovaFile, $ionicModal, switchDataService, eAppServices, eliteAdvantageSwitchService, commonFileFunctionFactory, common_const, switchDbService, pceHomeDataService, getSetCommonDataService, quoteProposalNosDataService) {

    $scope.isIllustrationsSelected = true;
    $scope.isBrochureSelected = false;

    var switchTrippleHealthPi = switchDataService.getProfileData($state.params.customerId);
    switchTrippleHealthPi.then(function(switchTrippleHealthPi) {
      $scope.trippleHealthData = switchTrippleHealthPi;
      $scope.stepsCompleted = $scope.trippleHealthData.StepCompleted;
    });

    $scope.custId = $state.params.customerId;

    var vm = this;
    var prodId = 8;
    var channelId = 1;
    if ($state.params.recId > 0) {

      var piSummaryData = switchDataService.getPi($state.params.recId);
      piSummaryData.then(function(piDetails) {
        switchDataService.getQuoteData(JSON.parse(piDetails.Input));
        switchDataService.getQuotecalculatedData(JSON.parse(piDetails.Output));
        $scope.inputData = JSON.parse(piDetails.Input);
        $scope.outputResultdata = JSON.parse(piDetails.Output);

        $log.debug("outputResultdata", $scope.outputResultdata);
        $scope.userCurrentImg = switchDataService.getImage($scope.inputData.laAge);
        $scope.userFutureImg = switchDataService.getImage($scope.outputResultdata.maturityAge);
        $scope.userFutureImgs=switchDataService.getImage($scope.outputResultdata.deathBenfitAge );
        $scope.maturityPayoutPeriod=$scope.outputResultdata.maturityPayoutPeriod;
        $scope.coinsCount = switchDataService.getCoins($scope.inputData.ppt);
        $scope.coinsCounts = switchDataService.getCoins($scope.outputResultdata.maturityPayoutPeriod);
        $log.debug("??",$scope.outputResultdata.maturityPayoutPeriod);
      });
    } else {
      var inputData = switchDataService.getQuoteData();
      switchDataService.getQuotecalculatedData();
      $scope.inputData = inputData;
      $scope.outputResultdata = switchDataService.getQuotecalculatedData();
      $log.debug("outputResultdata", $scope.outputResultdata);
      $scope.userCurrentImg = switchDataService.getImage($scope.inputData.laAge);
      $scope.userFutureImg = switchDataService.getImage($scope.outputResultdata.maturityAge);
      $scope.userFutureImgs=switchDataService.getImage($scope.outputResultdata.deathBenfitAge );
      $scope.coinsCount = switchDataService.getCoins($scope.inputData.ppt);
      $scope.coinsCounts = switchDataService.getCoins($scope.outputResultdata.maturityPayoutPeriod);
      $log.debug("??",$scope.outputResultdata.maturityPayoutPeriod);
          }
    $scope.onClickGreenBar = function() {
      $scope.coinsShowGreen = !$scope.coinsShowGreen;
    };
    $scope.onClickBlueBar = function() {
      $scope.coinsShowBlue = !$scope.coinsShowBlue;
    };
    $scope.showAssumtion = function() {
      $scope.showAssumtionPopup = true;
    };
    $scope.hideAssumtionPopup = function() {
      $scope.showAssumtionPopup = false;
    };

    $scope.goToEapp = function() {
      var getEliteInputata = switchDataService.getQuoteData();
      var getEliteResultOutput = switchDataService.getQuotecalculatedData();
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
        /*Setting data for Eapp*/
        var buyingForData = {
          BuyingFor: 'Self',
          liFirstName: getEliteInputata.laFirstName,
          liLastName: getEliteInputata.laLastName,
          laGender: getEliteInputata.laGender,
        };
        eAppServices.setBuyForDetails(buyingForData);

        var quoteInputData = {
          laGender: getEliteInputata.laGender,
          laAge: getEliteInputata.laAge,
          smoke: getEliteInputata.smoke,
          pt: getEliteInputata.pt,
          ppt: getEliteInputata.ppt,
          sumAssured: getEliteInputata.sumAssured,
          annualPremium: getEliteInputata.base,
          NSAPForLA: getEliteInputata.NSAPForLA
        };
        eAppServices.setInputDetails(quoteInputData);

        var piData = {
          custId: $state.params.customerId,
          productId: common_const.ProductId_EA,
          input: JSON.stringify(getEliteInputata),
          output: JSON.stringify(getEliteResultOutput),
          annualPremium: getEliteInputata.annualPremium,
          isActive: 1
        };
        switchDbService.savePI(piData);
        quoteProposalNosDataService.resetTempBiJsonTbl();
        $state.go('app.eliteAdvantage-LAAndProposer', {
          customerId: $state.params.customerId,
        });
      });
    };


    $scope.backToProduct = function() {

      var getEliteInputata = switchDataService.getQuoteData();
      var getEliteResultOutput = switchDataService.getQuotecalculatedData();
      $log.debug("saniyaysaniyaaaaaaaaaaaaaaaaa", getEliteResultOutput);

      var piData = {
        custId: $state.params.customerId,
        productId: common_const.ProductId_EA,
        input: JSON.stringify(getEliteInputata),
        output: JSON.stringify(getEliteResultOutput),
        annualPremium: getEliteInputata.annualPremium,
        isActive: 1
      };
      switchDbService.savePI(piData);
      $state.go('app.productRecommendation', {
        customerId: $state.params.customerId,
      });
    };


    $scope.showCalculatorPopup = function(PKSwitchCalculator) {
      $scope.showPlusPopup = !$scope.showPlusPopup;
    };

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
            console.log('Device Memory : Confirmed!');
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
            console.log('Device Memory : Confirmed!');
          });
        };
      });
    };
    $scope.email = function() {
      $scope.showPlusPopup = false;
      $scope.showSendEmailPopup = true;
    }

    $scope.hidesendEmailPopup = function() {
      $scope.showPlusPopup = true;
      $scope.showSendEmailPopup = false;
    }

    /*Funtion for send email and store email details in emailData*/

    $scope.sendEmailPopupOnOk = function() {
      $scope.isValidateEmailTo = false;
      $scope.isValidateEmailCc = false;
      var emailTo = $scope.email_To;
      var emailData = {
        emailTo: $scope.email_To,
        emailCc: $scope.email_Cc,
        isBrochureSelected: $scope.isBrochureSelected,
        isIllustrationsSelected: $scope.isIllustrationsSelected
      };
      $log.debug("emailData", emailData);
    }
    $scope.brochure = function() {
      alert("brochure");
    };

  }
]);
