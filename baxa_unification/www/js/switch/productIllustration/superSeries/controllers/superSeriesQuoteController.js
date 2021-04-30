switchModule.controller('switchSuperSeriesQuote', ['$log',
  '$scope',
  '$state',
  '$http',
  '$rootScope',
  'eAppServices',
  '$ionicPlatform',
  '$ionicHistory',
  '$cordovaToast',
  '$ionicNavBarDelegate',
  'commonDbProductCalculation',
  'secureIncomeObjectService',
  'switchDataService',
  'calculateTrippleHealthPremiumSvc',
  'sSCalculationService',
  'sSValidationService',
  'eACalculationService',
  function($log, $scope, $state, $http, $rootScope, eAppServices,$ionicPlatform,$ionicHistory, $cordovaToast, $ionicNavBarDelegate, commonDbProductCalculation, secureIncomeObjectService, switchDataService, calculateTrippleHealthPremiumSvc, sSCalculationService, sSValidationService,eACalculationService) {
    'use strict';
    var vm = this;
    var adbRiderId = 4,
      prodId = 13,
      channelId = 1,
      pwrRiderId = 6,
      pwrOption = 1;

          $scope.fromswitch = true;
          $scope.showDbErrors = false;
          $scope.dbErrors = false;
          $scope.title = "Super Series";
          $scope.custId = $state.params.customerId;
          $scope.data = {};
          $scope.inputData = {};
          $scope.outputData = {};
          $scope.calcData = {};
          var params = {
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
              ppt:10,
              pt: 10,
              premiumMode: 1,
              maturityPayoutPeriod: 12,
              maturityPremiumMode: 1,
              basePremium: 50000,
              inYour:'PRESENCE',
              isBP: true
              //sumAssured:205770,
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
            $scope.inputData.ppt = 10;
            $scope.inputData.isBP = true;

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
            $log.debug("inputData",inputData);
          //  $scope.inputData.basePremium = inputData.annualPremium;
        //  riderValidationService.riderPrePWRValidateService(prodId, channelId, inputData)
          sSValidationService.validateBaseProduct(prodId, channelId, inputData)
          .then(function(messages) {
            if (messages.length === 0) {
              $scope.showDbErrors = false;
              //$scope.doCalcBasePremium(prodId, channelId, inputData);
            } else {
              $scope.showDbErrors = true;
              console.log("ErrorMessage:::",messages);
              for (var e = 0; e < messages.length; e++) {
                $scope.dbErrors.push(messages[e]);
              }
              console.log("ErrorMessage:::",$scope.dbErrors);
            }
          });
        $log.debug("-----------DB VALIDATIONS------------", $scope.dbErrors);
        switchDataService.setQuoteData(inputData);
      $log.debug("sami",inputData.isBP);

       sSCalculationService.calcsSSumAssured(prodId, channelId, inputData.basePremium, inputData.ppt,inputData.laGender,inputData.laAge,inputData.isBP)
     .then(function (val) {
         $log.debug("pop", val);
        $scope.inputData.sumAssured = val;
    });
          sSCalculationService.calculateSsTotalPremium(prodId, channelId, inputData)
          .then(function(totalBasePremiumVals) {
            console.log("totalBasePremiumVals>::>>::>>", totalBasePremiumVals);

            var BI = totalBasePremiumVals.bi;
            BI.then(function(res) {
              $log.debug("Res",res);
              if (inputData.ppt==10)
              {
              var anualBenfitsForppt5 =0;
              for(var i=9;i<=18;i++){
              anualBenfitsForppt5= anualBenfitsForppt5 + res.sB[i] ;
              $scope.sumGuranteedBenefits=anualBenfitsForppt5;
              $log.debug("sumGuranteedBenefits",$scope.sumGuranteedBenefits);
            }
          }
          else {
            for(var i=5;i<=10;i++){
            anualBenfitsForppt5= anualBenfitsForppt5 + res.sB[i] ;
            $scope.sumGuranteedBenefits=anualBenfitsForppt5;
            $log.debug("sumGuranteedBenefits",$scope.sumGuranteedBenefits);
          }
        }

        $scope.gMaturityAdditions=res.gMaturityAdditions[res.gMaturityAdditions.length - 1];
        $scope.deathBenfit=res.deathBenfit[0];
        $log.debug("deathBenfit",$scope.deathBenfit);
            var secureIPiData = {
            sumAssured:totalBasePremiumVals.sumAssured,
            maturityAge : parseInt(inputData.laAge) + parseInt(inputData.pt),
            endPremium :parseInt(inputData.laAge) + parseInt(inputData.ppt),
            deathBenfitAge:parseInt(inputData.laAge) + parseInt(inputData.pt)-2 ,
            coinsCount:switchDataService.getCoins(inputData.maturityPayoutPeriod),
            maturityPayoutPeriod :inputData.maturityPayoutPeriod,
            deathBenfit:$scope.deathBenfit,
            sumGuranteedBenefits:$scope.sumGuranteedBenefits,
            gpayout:$scope.gpayout,
            basePremium:$scope.inputData.basePremium,
            gMaturityAdditions:$scope.gMaturityAdditions,
            TotalSum: parseInt($scope.sumGuranteedBenefits) + parseInt($scope.gMaturityAdditions) + parseInt(totalBasePremiumVals.sumAssured),
            inAbes:parseInt(inputData.ppt)-2
          };
          //  alert($scope.inputdadada);
              $log.debug("////////////////////::",secureIPiData);
              switchDataService.setQuotecalculatedData(secureIPiData);
                $state.go('app.switchSuperSeriesPi', {
                  customerId: $state.params.customerId,
                });
          });
  });

        };
    //  };

      //
      //
      //
       //
      //        var BI = totalBasePremiumVals.bi;
      //        BI.then(function(res){
      //            $scope.data.biCalculation=res;
      //          //var guaranteedAnnualBenefits = totalBasePremiumVals.gVals;
      //          /**Chart Code **/
      //          $scope.outputData.sB = res.sB;
       //
      //          /*Min Max value*/
      //          $scope.minimum=arrayMin($scope.outputData.sB);
      //            $scope.maximum=arrayMax($scope.outputData.sB);
      //          /*****Find out minimum and maximum from given array*****/
      //            function arrayMin(arr) {
      //            var len = arr.length, min = Infinity;
      //            while (len--) {
      //              if (arr[len] < min) {
      //                min = arr[len];
      //              }
      //            }
      //            return min;
      //      });
  //  });
            /*      eACalculationService.calculateEATotalPremium(prodId, channelId, inputData)
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
                          $scope.inputdadada=anualBenfitsForppt5;

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
                          $scope.inputdadada=anualBenfitsForppt12;
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
                        sumGuranteedBenefits:$scope.inputdadada,
                        TotalSum:parseInt($scope.deathBenfit) + parseInt($scope.inputdadada),
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

          };*/
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

        }]);
