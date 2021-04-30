switchModule.controller('switchSuperSeriesPi', ['$log',
  '$scope',
  '$state',
  '$http',
  '$rootScope',
  'commonDbProductCalculation',
  'switchDataService',
  '$cordovaFile',
  '$ionicModal',
  '$ionicHistory',
  'commonFileFunctionFactory',
  'common_const',
  'getSetCommonDataService',
  'switchDbService',
  'eAppServices',
  'quoteProposalNosDataService',
  'utilityService',
  'pceHomeDataService',
  function($log, $scope, $state, $http, $rootScope, commonDbProductCalculation, switchDataService, $cordovaFile, $ionicModal, $ionicHistory,commonFileFunctionFactory,common_const, getSetCommonDataService,switchDbService, eAppServices, quoteProposalNosDataService,utilityService, pceHomeDataService) {
    'use strict';
    $scope.custId = $state.params.customerId;
    $scope.stepsCompleted = 1;
    $scope.trippleHealthData = null;
    $scope.saveResult = true;
    $scope.isIllustrationsSelected=true;
    $scope.isBrochureSelected=false;

    /*Animation Code*/
    $scope.setNowAnimate = function() {
      setAnimate($ionicHistory);
    };
  var selProductData = switchDataService.getProductData();
    var switchSuperSeriesPi = switchDataService.getProfileData($state.params.customerId);
      switchSuperSeriesPi.then(function(switchSuperSeriesPi) {
      $scope.switchSuperSeriesPi = switchSuperSeriesPi;
      $scope.stepsCompleted = $scope.switchSuperSeriesPi.StepCompleted;
    });

    if($state.params.recId > 0){
        var piSummaryData = switchDataService.getPi($state.params.recId);
        piSummaryData.then(function(piDetails){
          $log.debug("piDetails",piDetails);
        switchDataService.setQuoteData(JSON.parse(piDetails.Output));
        var getcaldata = JSON.parse(piDetails.Input);
        $scope.outputResultdata  = JSON.parse(piDetails.Output);
        $log.debug("getcaldata",getcaldata);

        $scope.userCurrentImg = switchDataService.getImage(getcaldata.laAge);
        $scope.getcaldata =getcaldata;
        $scope.userCurrentImg = switchDataService.getImage(getcaldata.laAge);
        $scope.userFutureImg = switchDataService.getImage(parseInt($scope.getcaldata.laAge) + parseInt($scope.getcaldata.riderPpt));
        //$log.debug("userFutureImg::",userFutureImg);
        $scope.premiumMode = switchDataService.getMode(getcaldata.base);
        $scope.Gender=$scope.getcaldata.laGender;
        $scope.userFutureImg = switchDataService.getImage(parseInt($scope.getcaldata.laAge) + parseInt($scope.getcaldata.ppt));
        $log.debug("Gender::",$scope.laGender);
        $scope.uptoAges =parseInt($scope.getcaldata.laAge) + parseInt($scope.getcaldata.riderPpt);
        $scope.coinsCount = switchDataService.getCoins($scope.getcaldata.ppt);

      });
    }
    else{
      $scope.getcaldata = switchDataService.getQuoteData();
      $scope.outputResultdata = switchDataService.getQuotecalculatedData();
      $log.debug("outputResultdata", $scope.outputResultdata);
      $log.debug("else:",$scope.getcaldata);
      $scope.userCurrentImg = switchDataService.getImage($scope.getcaldata.laAge);
      $log.debug("userCurrentImg:",$scope.userCurrentImg);
      $scope.Gender=$scope.getcaldata.laGender;
      $scope.userFutureImg = switchDataService.getImage(parseInt($scope.getcaldata.laAge) + parseInt($scope.getcaldata.ppt));
      $log.debug("Gender::",$scope.laGender);
      $scope.uptoAges =parseInt($scope.getcaldata.laAge) + parseInt($scope.getcaldata.riderPpt);
      $scope.coinsCount = switchDataService.getCoins($scope.getcaldata.ppt);
    }


    $scope.onClickGreenBar = function() {
      $scope.coinsShowGreen = !$scope.coinsShowGreen;
    };
    $scope.onClickBlueBar = function() {
      $scope.coinsShowBlue = !$scope.coinsShowBlue;
    };

    $scope.backToProduct = function() {
        var gettripplData = switchDataService.getQuotecalculatedData();
        var piData = {
        custId: $state.params.customerId,
        productId: common_const.ProductId_SS,
        input:JSON.stringify($scope.getcaldata),
        output:JSON.stringify(gettripplData),
        annualPremium:$scope.getcaldata.basePremium,
        isActive: 1
      };

      switchDbService.savePI(piData);

      $state.go('app.productRecommendation', {
        customerId: $state.params.customerId,
      });
    };

    $scope.goToEapp = function() {
      var gettripplData = switchDataService.getQuotecalculatedData();
    //  $log.debug("gettripplData",gettripplData);
      var switchSuperSeriesPi = switchDataService.getQuoteData();
      $log.debug("switchSuperSeriesPi",switchSuperSeriesPi);
      /*Setting data for Eapp*/
      var buyingForData = {
          BuyingFor:'Self',
          liFirstName:switchSuperSeriesPi.laFirstName,
          liLastName:switchSuperSeriesPi.laLastName,
          laGender:switchSuperSeriesPi.laGender,
      };
      eAppServices.setBuyForDetails(buyingForData);
      var quoteInputData = {
        laGender:switchSuperSeriesPi.laGender,
        laAge:switchSuperSeriesPi.laAge,
        pt:switchSuperSeriesPi.pt,
        ppt:switchSuperSeriesPi.ppt,
        sumAssured:switchSuperSeriesPi.sumAssured,
        annualPremium:gettripplData.basePremium
      };
      $log.debug("quoteInputData",quoteInputData);
      eAppServices.setInputDetails(quoteInputData);

      /*Setting data for Eapp*/
      var userData = getSetCommonDataService.getCommonData();

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
        productId: common_const.ProductId_SS,
        input:JSON.stringify($scope.getcaldata),
        output:JSON.stringify(gettripplData),
        annualPremium:gettripplData.basePremium,
        isActive: 1
      };
      switchDbService.savePI(piData);
      quoteProposalNosDataService.resetTempBiJsonTbl();
      $state.go('app.superSeries-LAAndProposer', {
          customerId: $state.params.customerId,
        });
      });
    };

    $scope.showCalculatorPopup = function(PKSwitchCalculator) {
      $scope.showPlusPopup = !$scope.showPlusPopup;
    };
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
          seviceSuperSeries.tHSendMail(emailData).then(function(){
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
  }]);
