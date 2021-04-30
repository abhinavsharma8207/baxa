switchModule.controller('switchEliteAdvantageInpute', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$http',
  '$ionicPlatform',
  '$ionicHistory',
  '$cordovaToast',
  '$ionicNavBarDelegate',
  'common_const',
  'switchDataService',
  'eliteSecureSwitchService',
  'eAppServices',
  'eACalculationService',
  'eliteAdvantageSwitchService',
  'eADataFromDBSvc',
  'eAValidationService',
  function($scope, $rootScope, $log, $state, $http, $ionicPlatform,$ionicHistory, $cordovaToast, $ionicNavBarDelegate, common_const, switchDataService, eliteSecureSwitchService, eAppServices, eACalculationService, eliteAdvantageSwitchService, eADataFromDBSvc, eAValidationService) {

    var vm = this;
    var hospiCashRiderId = 5,
      adbRiderId = 4,
      prodId = 12,
      channelId = 1;

    $scope.fromswitch = true;
    $scope.showDbErrors = false;
    $scope.dbErrors = false;
    $scope.title = "Elite Advantage";
    $scope.custId = $state.params.customerId;
    $scope.data = {};
    $scope.inputData = {};
    $scope.outputData = {};
    $scope.calcData = {};
    var params = {
      "ui_color": '#008c72',
      "ui_gender": true,
      "ui_age": true,
      "ui_nsap": true,
      "ui_anualPreminum": true,
      "ui_modelPreminum": true,
      "switch": true,
      "ui_presence": true,
      "ui_maturityPayoutFrequency": true
    };

    /*Get validation messae through json file.*/
    $http.get('js/switch/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
      $scope.ageOutofRange=$scope.validationMessage.data.sixToSixtyfive;
    });
    //***** COPY PASTE - DATE MIN MAX FUNCTION *****//
    eAppServices.getLaAge(prodId, channelId)
      .then(function(result) {
        $scope.data.laMinAge = result.MinAge;
        $scope.data.laMaxAge = result.MaxAge;
        $scope.data.laMinAgeYear = result.MinDate;
        $scope.data.laMaxAgeYear = result.MaxDate;
      });

      $scope.inputData = {
        laAge: parseInt(28),
        laFirstName: "",
        laLastName: "",
        laGender: 0,
        ppt: 15,
        pt: 10,
        base: 0,
        premiumMode: 1,
        maturityPayoutPeriod: 12,
        maturityPremiumMode: 1,
        basePremium: 50000,
        inYour:'PRESENCE',
      };
      var quoteData=switchDataService.getQuoteData();
      console.log('quoteData++++++++++',angular.toJson(quoteData));
      if(angular.isUndefined(quoteData) || quoteData==null ){
    var esCustomerData = switchDataService.getProfileData($state.params.customerId);
    esCustomerData.then(function(tripplHelt) {
      $scope.tripplHelt = tripplHelt;

      var gender = $scope.tripplHelt.Gender;
      $scope.inputData.laFirstName = $scope.tripplHelt.FirstName;
      $scope.inputData.laLastName = $scope.tripplHelt.LastName;
      $scope.inputData.laGender = gender;
      $scope.inputData.ppt = 12;

      $scope.inputData.annualPremium = $scope.inputData.basePremium;
      var ageCheck = $scope.tripplHelt.Age;
      if (ageCheck > 6 && ageCheck < 65) {

        $scope.inputData.laAge = ageCheck;
      } else {
        //alert("age out of range");
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

    //$scope.inputData.basePremium=$scope.inputData.annualPremium;


    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "PMODE", "UPTOAGE", "PPT", "MPF"], ["PT", "MPFACTOR"])
      .then(function(result) {
        $log.debug("the value coming in the result is", result);
        $scope.params = params;
        $scope.formData = result[0];
        $scope.formDataCalc = {
          "PT": JSON.parse(result[1].PT),
          "MPFACTOR": JSON.parse(result[1].MPFACTOR) /*,"PREPAYOPN":JSON.parse(result[1].PREPAYOPN)*/
        };
      });
    $scope.calculate = function(inputData) {
      eACalculationService.calcEASumAssured(prodId, channelId, inputData.annualPremium, inputData.ppt, inputData.laGender, inputData.laAge).then(function(val) {
        $scope.inputData.sumAssured = val;
      });
      $scope.inputData.basePremium = inputData.annualPremium;
      eAValidationService.validateProduct(prodId, channelId, inputData)
        .then(function(messages) {
          $scope.dbError = "";
          if (messages.length == 0) {
            $scope.showDbErrors = false;
            $scope.dbError = "";
            // $scope.calculateEAPremium(prodId, channelId, data);
            switchDataService.setQuoteData(inputData);
            $scope.inputData.pt = eAppServices.getPolyOrPreminumTerm(inputData.ppt, $scope.formDataCalc.PT);
            $scope.inputData.modalPremium = eAppServices.getModalPremiumFromAnnualPremium(inputData.premiumMode, inputData.annualPremium, $scope.formDataCalc.MPFACTOR);

            eADataFromDBSvc.getEAPaymentTerm(prodId, channelId, inputData.ppt).then(function(val) {
              eADataFromDBSvc.getMaturityPeriod(prodId, channelId, val).then(function(mp) {
                $scope.inputData.maturityPayoutPeriod = mp;
              });
            });
            eACalculationService.calculateEATotalPremium(prodId, channelId, inputData)
              .then(function(result) {
                var BI = result.bi;
                BI.then(function(res) {
                  $log.debug("Res",res);
                  $scope.sumAssuredMat =res.gMaturityBenfit[res.gMaturityBenfit.length - 1];
                //  alert($scope.sumAssuredMat);
                  $log.debug("INPUT",inputData);
                  $scope.gpayout=res.gMaturityBenfit[0];
                  if (inputData.maturityPayoutPeriod==8)
                  {
                    var anualBenfitsForppt5 =0;
                    for(var i=11;i<=18;i++){
                    anualBenfitsForppt5= anualBenfitsForppt5 + res.gMaturityBenfit[i] ;
                    $scope.sumGuranteedBenefits=anualBenfitsForppt5;

                    }
                    $scope.deathBenfit=res.deathBenfit[res.deathBenfit.length - 13];
                    $log.debug("////////////////////",$scope.deathBenfit);
                  }
                  else {
                    //alert("12");
                    //alert(res.gMaturityBenfit);
                    var anualBenfitsForppt12 =0;
                    for(var j=9;j<=18;j++){
                    anualBenfitsForppt12= anualBenfitsForppt12 + res.gMaturityBenfit[j];
                    $scope.sumGuranteedBenefits=anualBenfitsForppt12;
                    $log.debug(anualBenfitsForppt12);
                    }
                     //$scope.returni= anualBenfitsForppt5;
                      $scope.deathBenfit=res.deathBenfit[res.deathBenfit.length - 11];

                      $log.debug("@@@@@@@",res);

                  }
                  var secureIPiData = {
                  maturityAge : parseInt(inputData.laAge) + 20,
                  endPremium :parseInt(inputData.laAge) + parseInt(inputData.ppt),
                  deathBenfitAge:parseInt(inputData.laAge) + parseInt(inputData.pt)-2 ,
                  coinsCount:switchDataService.getCoins(inputData.maturityPayoutPeriod),
                  maturityPayoutPeriod :inputData.maturityPayoutPeriod,
                  userCurrentImg : eliteAdvantageSwitchService.getImage(inputData.laAge),
                  deathBenfit:$scope.deathBenfit,
                  sumGuranteedBenefits:$scope.sumGuranteedBenefits,
                  TotalSum: $scope.deathBenfit + $scope.sumGuranteedBenefits,
                  gpayout:$scope.gpayout

                };


                //  alert($scope.inputdadada);
                    $log.debug("////////////////////::",secureIPiData);

                //  eliteAdvantageSwitchService.setEliteCal(res);
                switchDataService.setQuotecalculatedData(secureIPiData);
                  $state.go('app.switchEliteAdvantagePi', {
                    customerId: $state.params.customerId,
                  });
                });
              });
          } else {
            $scope.showDbErrors = true;
            $scope.dbErrors = messages[0];
          }
        });

    };
    /**back routing ***/
    $scope.goBack = function() {
      if ($state.current.name == 'app.switchEliteAdvantageInpute') {
        $state.go("app.productRecommendation",{
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
