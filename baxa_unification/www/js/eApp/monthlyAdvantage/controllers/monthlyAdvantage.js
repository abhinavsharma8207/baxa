eAppModule.controller('monthlyAdvantageController', ['$log',
  '$scope',
  '$state',
  '$http',
  '$rootScope',
  '$ionicHistory',
  '$ionicPlatform',
  '$cordovaDatePicker',
  '$ionicNavBarDelegate',
  '$ionicLoading',
  'eAppServices',
  'utilityService',
  'commonFormulaSvc',
  'getSetCommonDataService',
  'quoteProposalNosDataService',
  'riderValidationService',
  'pwrRiderDataFromUserSvc',
  'calculatePwrRiderPremiumSvc',
  'calculateAdbRiderPremiumSvc',
  'hospiCashRiderDataFromUserSvc',
  'calculatehospiCashRiderPremiumSvc',
  'mACalculationService',
  'mAValidationService',
  'mADataFromDBSvc',
  '$filter',
  'sendBIEmailService',
  function($log,
    $scope,
    $state,
    $http,
    $rootScope,
    $ionicHistory,
    $ionicPlatform,
    $cordovaDatePicker,
    $ionicNavBarDelegate,
    $ionicLoading,
    eAppServices,
    utilityService,
    commonFormulaSvc,
    getSetCommonDataService,
    quoteProposalNosDataService,
    riderValidationService,
    pwrRiderDataFromUserSvc,
    calculatePwrRiderPremiumSvc,
    calculateAdbRiderPremiumSvc,
    hospiCashRiderDataFromUserSvc,
    calculatehospiCashRiderPremiumSvc,
    mACalculationService,
    mAValidationService,
    mADataFromDBSvc,
    $filter,
    sendBIEmailService) {
    'use strict';
    var vm = this;
    var hospiCashRiderId = 5,
      adbRiderId = 4,
      prodId = 15,
      channelId = 1,
      pwrRiderId = 6,
      pwrRiderCiId = 7,
      pwrOption = 1;
    $scope.inputData = {};
    $scope.outputData = {};
    $scope.calcData = {};
    $scope.dbErrors = [];
    $scope.prodBaseCode = "";
    $scope.title = "Monthly Advantage";
    $scope.data = {};
    $scope.data.BuyingFor = 'Self';
    $scope.data.laGender = 0;
    $scope.data.liFirstName = "";
    $scope.data.liLastName = "";
    $scope.data.proposerGender = 0;
    $scope.data.propFirstName = "";
    $scope.data.propLastName = "";
    $scope.validationMessage = {};
    $scope.premiumWithTaxes = false;
    $scope.showPopupToGoForLAAndProposerDetails = false;
    $scope.isIllustrationsSelected = true;
    $scope.isBrochureSelected = false;
    //** Back Button Funtionality **//
    $scope.goBack = function() {
      if ($state.current.name == 'app.monthlyAdvantage-home') {
        $state.go("app.monthlyAdvantage-LAAndProposer");
      } else if ($state.current.name == 'app.monthlyAdvantage-LAAndProposer') {
        $scope.data = eAppServices.getBuyForDetails();
        $state.go("app.eApp");
      } else if ($state.current.name == 'app.monthlyAdvantage-estimated') {
        $state.go("app.monthlyAdvantage-home");
      } else {
        $ionicHistory.goBack();
      }
    };
    if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
      $ionicNavBarDelegate.showBackButton(false);
    } else {
      $ionicNavBarDelegate.showBackButton(true);
    }
    /*Animation Code*/
    $scope.animateClass = animateNgClass('bounceInDown', 'animationduration25');
    $ionicPlatform.registerBackButtonAction(function() {
      $scope.goBack();
    }, 100);
    //** Back Button Funtionality **//

    /*Get validation messgae through json file.*/
    $http.get('js/eApp/monthlyAdvantage/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
    });
    /*Get validation messgae through json file.*/

    //** Get Data Variables **//

    //** Get Generic Options for Form Elements **//
    var params = {
      "ui_color": 'purple',
      "ui_gender": true,
      "ui_age": true,
      "ui_smoke": false,
      "ui_nsap": true,
      "ui_payType": false,
      "ui_termExtra": {
        "label": "Monthly Income Period",
        "default": "20-30",
        "terms": {}
      },
      /*"ui_pmode"          : true,*/
      "ui_sumAssured": false,
      "ui_anualPreminum": true,
      "ui_modelPreminum": true,
      "switch": false,
    };

    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "BUYPOLFOR", "PMODE", "PPT"], ["PT", "MPFACTOR", "MIBPERIOD"])
      .then(function(result) {
        $scope.params = params;
        $scope.formData = result[0];
        $scope.formData.PPT = {
          0: {
            id: "12",
            name: "6"
          },
          1: {
            id: "16",
            name: "8"
          },
          2: {
            id: "24",
            name: "12"
          }
        };
        //$scope.formData.PPT = {12:["6"],16:["8"],24:["12"]};
        $scope.formDataCalc = {
          //"PT": {0:{id:"0",name:"12"},1:{id:"1",name:"16"},2:{id:"1",name:"24"}},
          "PT": JSON.parse(result[1].PT),//{6: ["12"],8: ["16"],12: ["24"]},
          "MPFACTOR": JSON.parse(result[1].MPFACTOR),
          "BENEFITPERIOD": JSON.parse(result[1].MIBPERIOD)
        };

        $scope.params.ui_termExtra.terms = {
          6: ["6"],
          8: ["8"],
          12: ["12"]
        };
        $scope.formDataOut = result[2];
        //***** COPY PASTE - DATE MIN MAX FUNCTION *****//
        eAppServices.getLaAge(prodId, channelId, true)
          .then(function(result) {
            $scope.data.laMinAgeDays = result.MinAgeDays;
            $scope.data.laMaxAgeDays = result.MaxAgeDays;
            $scope.data.laMinAge = result.MinAge;
            $scope.data.laMaxAge = result.MaxAge;
            $scope.data.laMinAgeYear = result.MinDate;
            $scope.data.laMaxAgeYear = result.MaxDate;
          });
        eAppServices.getPropAge(prodId, channelId)
          .then(function(result) {
            $scope.data.propMinAgeDays = result.MinAgeDays;
            $scope.data.propMaxAgeDays = result.MaxAgeDays;
            $scope.data.propMinAgeYear = result.MinDate;
            $scope.data.propMaxAgeYear = result.MaxDate;
          });
        //***** COPY PASTE - DATE MIN MAX FUNCTION *****//
        var calcData = eAppServices.getCalcDetails();
        var outputData = eAppServices.getOutputDetails();
        var inputData = eAppServices.getInputDetails();
        var data = eAppServices.getBuyForDetails();

        if (Object.keys(outputData).length > 0) {
          $scope.outputData = outputData;
          if (calcData) {
            $scope.calcData = calcData;
          } else {
            $scope.calcData = outputData;
          }
          if (Object.keys(data).length > 0) {
            $scope.data = data;
          }
          if (Object.keys(inputData).length > 0) {
            $scope.inputData = inputData;
          }
        } else if (Object.keys(inputData).length > 0) {
          $scope.inputData = inputData;
          $scope.outputData = inputData;
          if (Object.keys(data).length > 0) {
            $scope.data = data;
          }
        } else if (Object.keys(data).length > 0) {
          if (data.length > 0) {
            $scope.data = data;
          }
        } else {
          $state.go('app.monthlyAdvantage-LAAndProposer');
        }
      });
    //** Get Data Variables **//

    //** Handle Form Submit for LA Proposer Details Form **//
    $scope.ProceedForLAAndProposerDetails = function(data) {
      $scope.inputData.laName = data.liFirstName + " " + data.liLastName;
      $scope.inputData.laAgeDays = $scope.getAge(data.labfAge, 'days'); /** Calculate age in days **/
      $scope.inputData.laAge = $scope.getAge(data.labfAge);
      $scope.inputData.laGender = parseInt(data.laGender);
      $scope.inputData.annualPremium = ($scope.inputData.annualPremium) ? ($scope.inputData.annualPremium) : (50000);
      $scope.inputData.annualPremiumMinLength = 4;
      $scope.inputData.annualPremiumMaxLength = 10;
      $scope.inputData.isSelf = (data.BuyingFor == "Self") ? (true) : (false);
      $scope.inputData.premiumMode = ($scope.inputData.premiumMode) ? ($scope.inputData.premiumMode) : (1);
      $scope.inputData.pt = ($scope.inputData.pt) ? ($scope.inputData.pt) : (24);
      $scope.inputData.ppt = ($scope.inputData.ppt) ? ($scope.inputData.ppt) : (12);
      $scope.inputData.payType = 'REGULAR';
      $scope.inputData.NSAPForLA = ($scope.inputData.NSAPForLA)?($scope.inputData.NSAPForLA):(false);

      if (data.BuyingFor != "Self") {
        $scope.inputData.proposerName = data.propFirstName + " " + data.propLastName;
        $scope.inputData.proposerGender = data.proposerGender;
        $scope.inputData.proposerAge = $scope.getAge(data.proposerAge);
      } else if (data.BuyingFor == "Self") {
        $scope.inputData.proposerName = data.liFirstName + " " + data.liLastName;
        $scope.inputData.proposerGender = data.laGender;
        $scope.inputData.proposerAge = $scope.getAge(data.labfAge);
      }
      $log.debug("******************************$scope.inputData", $scope.inputData);
      eAppServices.setInputDetails($scope.inputData);
      eAppServices.setBuyForDetails(data);
      $state.go('app.monthlyAdvantage-home');
    };
    //** Handle Form Submit for LA Proposer Details Form **//

    //** Calculation **//
    $scope.calculate = function(inputData) {
      //** Calculation **//
      $scope.riders.isHCActive = true;
      $scope.riders.resetHC();
      $scope.riders.resetADB();

      $scope.inputData.isBP = true;
      $scope.inputData.isSA = false;
      $scope.inputData.laAge = (inputData.laAge === undefined) ? (0) : (inputData.laAge);
      $scope.inputData.monthlyIncomePeriod = $scope.inputData.benefitPeriod;
      $scope.outputData.ppt = inputData.ppt;
      $scope.outputData.premiumMode = inputData.premiumMode;
      $scope.outputData.basePremium = parseInt(inputData.annualPremium);
      $scope.outputData.pt = inputData.pt;
      $scope.outputData.modalPremium = inputData.modalPremium;
      $scope.outputData.NSAPForLA = (inputData.NSAPForLA !== undefined) ? (inputData.NSAPForLA) : (false);
      $scope.outputData.NSAPForPrposer = false;
      if($scope.data.BuyingFor == "Self"){
        $scope.outputData.NSAPForPrposer         = $scope.outputData.NSAPForLA;
      }else{
        $scope.outputData.NSAPForPrposer         = false;
      }

      //$log.debug("INPUTDATA>>><<<<<",inputData);
      $scope.dbErrors = [];
      mACalculationService.calcMASumAssured(prodId, channelId, inputData)
        .then(function(result) {
          if (result) {
            var sumA = commonFormulaSvc.round(result, 0);
            $scope.inputData.sumAssured = sumA;
            $scope.outputData.sumAssured = sumA;
            $scope.outputData.sumAssuredForADBRiders = sumA;
          } else {
            $scope.inputData.sumAssured = 341507;
            $scope.outputData.sumAssured = 341507;
            $scope.outputData.sumAssuredForADBRiders = 341507;
          }

          //$scope.outputData.laAge = 195;


          mAValidationService.validateProduct(prodId, channelId, $scope.inputData)
            .then(function(messages) {
              $log.debug("ErrorMessage<<<<<>>>>>>", messages);
              if (messages.length === 0) {
                $scope.showDbErrors = false;
                $scope.dbErrors = "";
                $scope.doCalcBasePremium(prodId, channelId, $scope.inputData);
              } else {
                /*remove below line after DB validation done*/
                //$scope.doCalcBasePremium(prodId, channelId, $scope.inputData);
                $scope.showDbErrors = true;
                for (var e = 0; e < messages.length; e++) {
                  $scope.dbErrors.push(messages[e][0]);
                }
              }
            });

        });

      $log.debug("-----------DB VALIDATIONS------------", $scope.dbErrors);
      //** Calculation **//
    };

    $scope.doCalcBasePremium = function(prodId, channelId, userInput) {
      mACalculationService.calculateMATotalPremium(prodId, channelId, userInput)
        .then(function(totalBasePremiumVals) {
          $log.debug("------------------------------totalBasePremiumVals", totalBasePremiumVals);
          $scope.outputData.premium = totalBasePremiumVals;
          $scope.outputData.premium.sumAssured = $scope.outputData.sumAssured;
          $scope.outputData.basePremium = totalBasePremiumVals.basePremium;
          $scope.outputData.modalFactor = totalBasePremiumVals.modalFactor;
          $scope.outputData.modalNsapPremium = totalBasePremiumVals.modalNsapPremium;
          $scope.outputData.modalPremium = totalBasePremiumVals.modalPremium;
          //$scope.outputData.nsapPremium = totalBasePremiumVals.nsapPremium;
          $scope.outputData.prodCode = totalBasePremiumVals.prodCode;
          //$scope.outputData.serviceTaxFactorForFirstYear = totalBasePremiumVals.serviceTaxFactorForFirstYear;
          //$scope.outputData.serviceTaxFactorForSecondYear = totalBasePremiumVals.serviceTaxFactorForSecondYear;

          $scope.outputData.serviceForAnnualFirstYearTax = totalBasePremiumVals.serviceForAnnualFirstYearTax;
          $scope.outputData.serviceForModalFirstYearTax = totalBasePremiumVals.serviceForFirstYearTax;
          $scope.outputData.sumAssured = userInput.sumAssured;
          $scope.outputData.sumAssuredForADBRiders = parseInt(userInput.sumAssured);
          $scope.outputData.totalAnnualPremium = totalBasePremiumVals.totalAnnualPremium;
          $scope.outputData.totalAnnualPremiumWithTaxForFirstYear = totalBasePremiumVals.totalAnnualPremiumWithTaxForFirstYear;
          //$scope.outputData.totalAnnualPremiumWithTaxForSecondYear = totalBasePremiumVals.totalModalPremiumWithServiceTaxForSecondYear;
          $scope.outputData.totalModalPremium = totalBasePremiumVals.totalModalPremium;
          $scope.outputData.totalModalPremiumWithTaxForFirstYear = totalBasePremiumVals.totalModalPremiumWithTaxForFirstYear;
          $scope.outputData.totalModalPremiumWithTaxForSecondYear = totalBasePremiumVals.totalModalPremiumWithTaxForSecondYear;

          $scope.outputData.mABasePremiumOutput = true;
          //var monthlyAdvantageBi = doGenarateFSBi(prodId, channelId, userInput, totalBasePremiumVals.basePremium, totalBasePremiumVals.sumAssured);
          var BI = totalBasePremiumVals.bi;
          BI.then(function(biVal) {
            //$scope.endOfPolicyYear = biVal.gSB;
            //var guaranteedMonthlyIncome = biVal.gSB;

            /*Guaranteed Monthly Income till maturity(a) */
            if (biVal.gSB.length > 0) {
              var guaranteedMonthlyIncome = 0;
              for (var n = 0; n < biVal.gSB.length; n++) {
                guaranteedMonthlyIncome += biVal.gSB[n];
              }
            }

            /* 8% Non-Guaranteed Bonuses at Maturity (b) */
            if (biVal.nMB8.length > 0) {
              var nonGuaranteedBonuseMaturity8 = biVal.nMB8[biVal.nMB8.length-1];
              /*for (var n = 0; n < biVal.nMB8.length; n++) {
                nonGuaranteedBonuseMaturity8 += biVal.nMB8[n];
              }*/
            }

            /* 4% Non-Guaranteed Bonuses at Maturity (b) */
            if (biVal.nMB4.length > 0) {
              var nonGuaranteedBonuseMaturity4 = biVal.nMB4[biVal.nMB4.length-1];
              /*for (var n = 0; n < biVal.nMB4.length; n++) {
                nonGuaranteedBonuseMaturity4 += biVal.nMB4[n];
              }*/
            }

            /**Chart Code **/
            $scope.gsb = biVal.gSB;
            //$scope.gVals = res;

            //var y = 200;
            //$scope.gsb.push(y);
            //y = 160;
            //$scope.gsb.push(y);
            $scope.outputData.finalArray = [];
            for (var i = 0; i < $scope.gsb.length; i++) {
              if (i == $scope.gsb.length - 1) {
                var x = {
                  key: biVal.policyYearArr[i],
                  value: $scope.gsb[biVal.policyYearArr[i] - 1],
                  height: 150, //Math.floor((Math.random() * 100) + 1),
                  checked: false
                };
              } else {
                var x = {
                  key: biVal.policyYearArr[i],
                  value: $scope.gsb[biVal.policyYearArr[i] - 1],
                  height: 60, //Math.floor((Math.random() * 100) + 1),
                  checked: false
                };
              }
              if (i == 14) {
                x.checked = true;
                $scope.data.selected = $scope.gsb[biVal.policyYearArr[i] - 1];
              }
              $scope.outputData.finalArray.push(x);
            }
            /**Chart Code**/

            $scope.outputData.precent = 8;
            $scope.monthlyAdvantageBiOutput = true;
            $scope.outputData.guaranteedMonthlyIncome = guaranteedMonthlyIncome;
            $scope.outputData.nonGuaranteedBonuseMaturity8 = nonGuaranteedBonuseMaturity8;
            $scope.outputData.nonGuaranteedBonuseMaturity4 = nonGuaranteedBonuseMaturity4;

            eAppServices.setOutputDetails($scope.outputData);
            eAppServices.setCalcDetails($scope.outputData);
            $state.go("app.monthlyAdvantage-estimated");

          });

        });
    };

    /*Riders*/
    $scope.riders = {
      'dbErrorPWR': [],
      'dbErrorHC': [],
      'dbErrorADB': [],
      'isHCActive': false,
      'isPWRActive': false,
      'isADBActive': false,
      'PWRI': false,
      'PWRII': true,
      'alertPWR': function() {
        $scope.riders.resetPWR();
        $scope.pwrSelectAlert = false;
      },
      'alertADBHS': function() {
        $scope.riders.resetHC();
        $scope.riders.resetADB();
        $scope.riderSelectAlert = false;
      },
      'HC': function(calcData) {
        $scope.riders.dbErrorHC = [];
        if ($scope.riders.isPWRActive) {
          $scope.pwrSelectAlert = true;
        } else if (calcData.hospiCashTerm > 0 && calcData.hospiCashDHCB > 0) {
          var validations = riderValidationService.riderPreHCValidateService(calcData, prodId, channelId, $scope.prodBaseCode);
          if (validations.length > 0) {
            $scope.showDbErrors = true;
            for (var s = 0; s < validations.length; s++) {
              $scope.riders.dbErrorHC.push(validations[s][0]);
            }
          } else {
            calcData.sumAssuredForRiders = calcData.hospiCashDHCB;
            calcData.riderPpt = calcData.hospiCashTerm;
            //calcData.ppt = calcData.hospiCashTerm;
            hospiCashRiderDataFromUserSvc.setHospiCashData([]);
            var hospiInput = hospiCashRiderDataFromUserSvc.setHospiCashData(calcData);
            $scope.showDbErrors = false;
            $scope.dbError = "";
            $scope.showDbErrors = false;
            calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospiCashRiderId, prodId, channelId, calcData.base)
              .then(function(result) {
                $scope.hcData = result;
                $scope.riders.isHCActive = true;
                $scope.calcData.benfitUptoAgeHC = parseFloat(result.benfitUptoAge);
                $scope.calcData.modalFactorHospiCash = result.modalFactor;
                $scope.calcData.prodCodeHospiCash = result.prodCode;
                $scope.calcData.sumAssuredHospiCash = result.sumAssured;
                $scope.calcData.modalHospiCashPremium = parseFloat(result.modalHospiCashPremium);
                $scope.calcData.annualHospiCashPremium = parseFloat(result.annualHospiCashPremium);
                $scope.calcData.percentOfBasePremiumHC = parseFloat(result.percentOfBasePremium);
                $scope.calcData.serviceTaxHospiCashForModalFirstYear = parseFloat(result.serviceTaxForModalFirstYear);
                $scope.calcData.serviceTaxHospiCashForAnnualFirstYear = parseFloat(result.serviceTaxForAnnualFirstYear);
                $scope.calcData.totalModalPremiumHospiCashWithTaxForFirstYear = parseFloat(result.totalModalPremiumWithTaxForFirstYear);
                $scope.calcData.totalAnnualPremiumHospiCashWithTaxForFirstYear = parseFloat(result.totalAnnualPremiumWithTaxForFirstYear);
              });
          }
        }
      },
      'resetHC': function() {
        $scope.riders.dbErrorHC = [];
        if ($scope.riders.isHCActive) {
          $scope.hcData = "";
          $scope.calcData.hospiCashTerm = "";
          $scope.calcData.hospiCashDHCB = "";
          $scope.riders.isHCActive = false;
          $scope.calcData.benfitUptoAgeHC = 0;
          $scope.calcData.modalHospiCashPremium = 0;
          $scope.calcData.annualHospiCashPremium = 0;
          $scope.calcData.percentOfBasePremiumHC = 0;
          $scope.calcData.serviceTaxHospiCashForModalFirstYear = 0;
          $scope.calcData.serviceTaxHospiCashForAnnualFirstYear = 0;
          $scope.calcData.totalModalPremiumHospiCashWithTaxForFirstYear = 0;
          $scope.calcData.totalAnnualPremiumHospiCashWithTaxForFirstYear = 0;
        }
      },
      'ADB': function(calcData) {
        $scope.riders.dbErrorADB = [];
        if ($scope.riders.isPWRActive) {
          $scope.pwrSelectAlert = true;
        } else if (calcData.sumAssuredForADBRiders > 0 && calcData.pt > 0) {
          mADataFromDBSvc.getProdCodeMA(prodId, channelId, $scope.outputData.sumAssured, $scope.outputData.pt)
            .then(function(prodCode) {
              $scope.riders.dbErrorADB = [];
              $scope.calcData.riderterm = $scope.outputData.ppt;
              $scope.calcData.ADBRider = true;
              $scope.calcData.riderterm = calcData.ppt;
              riderValidationService.riderPreADBValidateService($scope.calcData, prodId, channelId, prodCode)
                .then(function(message) {
                  if (message.length > 0) {
                    $scope.calcData.ADBRider = false;
                    $scope.riders.isADBActive = false;
                    $scope.showDbErrors = true;
                    for (var d = 0; d < message.length; d++) {
                      $scope.riders.dbErrorADB.push(message[d]);
                    }
                    $scope.calcData.annualAdbRiderPremium = 0;
                    $scope.calcData.modalAdbRiderPremium = 0;
                    $scope.calcData.serviceTaxAdbForModalFirstYear = 0;
                    $scope.calcData.serviceTaxAdbForAnnualFirstYear = 0;
                    $scope.calcData.totalAnnualPremiumAdbWithTaxForFirstYear = 0;
                    $scope.calcData.totalModalPremiumAdbWithTaxForFirstYear = 0;
                    $scope.calcData.benfitUptoAgeADB = 0;
                    $scope.calcData.percentOfBasePremiumADB = 0;
                  } else {
                    $scope.riders.isADBActive = true;
                    $scope.calcData.ADBRider = true;
                    $scope.calcData.riderterm = calcData.pt;
                    var adbData = calculateAdbRiderPremiumSvc.calculateABDRiderPremium(adbRiderId, prodId, channelId, calcData);
                    adbData.then(function(result) {
                      if (adbData.annualAdbRiderPremium === 0) {
                        $scope.adbData = false;
                        $scope.showDbErrors = true;
                        $scope.riders.dbErrorADB.push({
                          "Name": "ADB",
                          "ErrorMessage": "30% Base premium is less than rider!"
                        });
                      } else {
                        $scope.adbData = result;
                        $scope.adbPremiumOutput = true;

                        $scope.calcData.annualAdbRiderPremium = parseFloat(result.annualAdbRiderPremium);
                        $scope.calcData.modalAdbRiderPremium = parseFloat(result.modalAdbRiderPremium);
                        $scope.calcData.serviceTaxAdbForModalFirstYear = parseFloat(result.serviceTaxForModalFirstYear);
                        $scope.calcData.serviceTaxAdbForAnnualFirstYear = parseFloat(result.serviceTaxForAnnualFirstYear);
                        $scope.calcData.totalAnnualPremiumAdbWithTaxForFirstYear = parseFloat(result.totalAnnualPremiumWithTaxForFirstYear);
                        $scope.calcData.totalModalPremiumAdbWithTaxForFirstYear = parseFloat(result.totalModalPremiumWithTaxForFirstYear);
                        $scope.calcData.benfitUptoAgeADB = parseFloat(result.benfitUptoAge);
                        $scope.calcData.percentOfBasePremiumADB = parseFloat(result.percentOfBasePremium);
                      }
                    });
                  }
                });
            });
        }
      },
      'resetADB': function() {
        $scope.riders.dbErrorADB = [];
        if ($scope.riders.isADBActive) {
          $scope.adbData = "";
          $scope.riders.isADBActive = false;
          $scope.calcData.annualAdbRiderPremium = 0;
          $scope.calcData.modalAdbRiderPremium = 0;
          $scope.calcData.serviceTaxAdbForModalFirstYear = 0;
          $scope.calcData.serviceTaxAdbForAnnualFirstYear = 0;
          $scope.calcData.totalAnnualPremiumAdbWithTaxForFirstYear = 0;
          $scope.calcData.totalModalPremiumAdbWithTaxForFirstYear = 0;
          $scope.calcData.benfitUptoAgeADB = 0;
          $scope.calcData.percentOfBasePremiumADB = 0;
        }
      }
    };
    /*Riders*/

    $scope.getAge = function(datestring, days) {
      var cDate = new Date();
      var cYear = cDate.getFullYear();
      var cMonth = cDate.getMonth();
      var cDay = cDate.getDate();
      var age = cYear - datestring.getFullYear();
      //$log.debug("*************------------------days", days);
      if (days) {
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var diffDays = Math.round(Math.abs((cDate.getTime() - datestring.getTime()) / (oneDay)));
        return diffDays;
      } else {
        if (cMonth < (datestring.getMonth() - 1)) {
          age--;
        }
        if (((datestring.getMonth() - 1) == cMonth) && (cDay < datestring.getDate())) {
          age--;
        }

        //$log.debug("********************************age", age);
        return age;
      }
    };

    <!--QuoteData-->
    /**Save Buttons**/
    $scope.saveQuote = function() {
      /** parameters sendEmail false and email data null **/
      $scope.createQuoteData(false, null, false);
    };

    $scope.proceedToFormFilling = function() {
      /** parameters sendEmail false and email data null **/
      $scope.createQuoteData(false, null, false);
    };

    $scope.createQuoteData = function(isFromEmail, emailData, isOnlineEmailRequired) {

      //isOnlineEmailRequired=false;
      if (isFromEmail && isOnlineEmailRequired) {
        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner><p>Sending Email..!</p>'
        });
      }

      var userData = getSetCommonDataService.getCommonData();
      var currentData = getSetCommonDataService.getCurrentProdData();
      $log.debug("####################userData############",userData);
      $log.debug("####################currentData############",currentData);
      quoteProposalNosDataService.getBIQuoteNumber(userData.agentId)
        .then(function(biRefNo) {
          var monthlyAdvantageQuoteData = {};
          var monthlyAdvantageRidersData = [[]];
          var quoteCustomJson = {
            quoteData: [],
            adbRiderData: [],
            hospiRiderData: [],
            pwRiderIData: [],
            pwRiderIIData: []
          };
          $scope.data.guaranteedIncome=$scope.inputData.monthlyIncomePeriod;
          /**1.BI Ref No**/
          monthlyAdvantageQuoteData.PkQuotationId = biRefNo.BiQuoteNo;
          /**2 - >  1 = Eapp, 2 = OLS **/
          monthlyAdvantageQuoteData.ReferenceSystemTypeId = "1";
          /**3 - > Selected Product ID**/
          monthlyAdvantageQuoteData.FkProductId = currentData.prodId;
          /**4 - > Selected Product Plan Code**/
          monthlyAdvantageQuoteData.ProductPlanCode = $scope.outputData.prodCode;
          /**5-> Logged in Agent Id**/
          monthlyAdvantageQuoteData.FkAgentCode = "" + userData.agentId;
          /**Buying For Screen**/
          /**6 -> Buying For Screen**/
          monthlyAdvantageQuoteData.BuyingFor = $scope.data.BuyingFor;
          /**7 -> liFirstName**/
          monthlyAdvantageQuoteData.LAFirstName = $scope.data.liFirstName;
          /**8 -> liLastName**/
          monthlyAdvantageQuoteData.LALastName = $scope.data.liLastName;
          /**9 -> LAGender**/
          monthlyAdvantageQuoteData.LAGender = "" + (($scope.data.laGender == 0) ? "Male" : "Female");
          /**10 -> LADOB**/
          monthlyAdvantageQuoteData.LADOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          /**11 -> propFirstName**/
          /**12 -> propLastName**/
          /**13 -> proposerGender**/
          /**14 -> ProposerDOB**/
          if (monthlyAdvantageQuoteData.BuyingFor != "Self") {
            monthlyAdvantageQuoteData.ProposerFirstName = $scope.data.propFirstName;
            monthlyAdvantageQuoteData.ProposerLastName = $scope.data.propLastName;
            monthlyAdvantageQuoteData.ProposerGender = "" + (($scope.data.proposerGender == 0) ? "Male" : "Female");
            monthlyAdvantageQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.proposerAge), 'MM/dd/yyyy');
          } else {
            monthlyAdvantageQuoteData.ProposerFirstName = $scope.data.liFirstName;
            monthlyAdvantageQuoteData.ProposerLastName = $scope.data.liLastName;
            monthlyAdvantageQuoteData.ProposerGender = "" + (($scope.data.laGender == 0) ? "Male" : "Female");
            monthlyAdvantageQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          }
          /**Input/Output Screen**/
          /**15 -> IsSmoker**/
          if ($scope.calcData.smoke != undefined) {
            monthlyAdvantageQuoteData.IsSmoker = ($scope.calcData.smoke == "nonsmoke") ? "" + 0 : "" + 1;
          } else {
            monthlyAdvantageQuoteData.IsSmoker = "" + 0;
          }
          /**16->benfitUptoAge**/
          if ($scope.calcData.benfitUptoAge != undefined) {
            monthlyAdvantageQuoteData.UptoAge = "" + $scope.calcData.benfitUptoAge;
          } else {
            monthlyAdvantageQuoteData.UptoAge = null;
          }
          /**17-> PayType - (Limited/Regular) if applicable **/
          monthlyAdvantageQuoteData.PayType = null;
          /**18-> BenefitType - (Endowment/Money Back)(Fixed Monthly Payout/Lumpsum + Increasing Payout) if applicable **/
          monthlyAdvantageQuoteData.BenefitType = null;
          /**19->PremiumPaymentTerm**/
          monthlyAdvantageQuoteData.PremiumPaymentTerm = "" + $scope.calcData.ppt;
          /**20->Policy Term**/
          monthlyAdvantageQuoteData.PolicyTerm = "" + $scope.calcData.pt;
          /**21->SumAssured/Life Cover**/
          monthlyAdvantageQuoteData.SumAssured = $scope.outputData.premium.sumAssured;
          /**22->GuaranteedIncomePeriod**/
          monthlyAdvantageQuoteData.GuaranteedIncomePeriod = $scope.data.guaranteedIncome;
          /**23->GuaranteedIncomePeriod**/
          monthlyAdvantageQuoteData.MaturityPayoutPeriod = null;
          /**24->MaturityPayoutFrequency**/
          monthlyAdvantageQuoteData.MaturityPayoutFrequency = null;
          /**25->FlexiBenefitPeriod**/
          monthlyAdvantageQuoteData.FlexiBenefitPeriod = null;//$scope.outputData.benefitPeriod;
          /**26->AnnualBasePremium**/
          monthlyAdvantageQuoteData.AnnualBasePremium = $scope.outputData.premium.totalAnnualPremium;
          /**27->Mode**/
          monthlyAdvantageQuoteData.Mode = "" + $scope.calcData.premiumMode;
          /**28->ModalFactor**/
          monthlyAdvantageQuoteData.ModalFactor = $scope.outputData.premium.modalFactor;
          /**29->ModalPremium**/
          monthlyAdvantageQuoteData.ModalPremium = $scope.outputData.premium.totalModalPremium;
          /**30->NSAPForLA**/
          if ($scope.calcData.NSAPForLA !== undefined) {
            monthlyAdvantageQuoteData.IsNSAP = "" + $scope.calcData.NSAPForLA;
          } else {
            monthlyAdvantageQuoteData.IsNSAP = "" + 0;
          }
          /**31->ServiceTax**/
          monthlyAdvantageQuoteData.ServiceTax = $scope.calcData.premium.totalAnnualPremiumWithTaxForFirstYear - $scope.outputData.premium.totalAnnualPremium;
          /**32->PremiumPayable**/
          monthlyAdvantageQuoteData.PremiumPayable = $scope.outputData.premium.totalModalPremiumWithTaxForFirstYear;
          /**33->PremiumPayable**/
          monthlyAdvantageQuoteData.IsInYourPresence = null;
          /**34->PremiumPayable**/
          monthlyAdvantageQuoteData.EstimatedReturnRate = null;
          /**Default value is 0, For email functionality**/
          /**35-IsEmail**/
          /**36-ToRecipients**/
          /**37-CcRecipients**/
          /*if (isFromEmail) {
            monthlyAdvantageQuoteData.IsEmail = "" + 1;
            monthlyAdvantageQuoteData.ToRecipients = emailData.To;
            monthlyAdvantageQuoteData.CcRecipients = emailData.Cc;
          } else {
            monthlyAdvantageQuoteData.IsEmail = "" + 0;
            monthlyAdvantageQuoteData.ToRecipients = null;
            monthlyAdvantageQuoteData.CcRecipients = null;
          }*/
          /**38-> create JSON for IRDA **/
          monthlyAdvantageQuoteData.Json = createmonthlyAdvantageIRDAQuotePDFJson(biRefNo.BiQuoteNo);
          $log.debug("monthlyAdvantageQuoteData...........", monthlyAdvantageQuoteData);
    /**************************************************************************************/
    /**custome json creation for quote cpmparison***/
          quoteCustomJson.quoteData.push({
            ReferenceSystemTypeId: monthlyAdvantageQuoteData.ReferenceSystemTypeId,
            FkProductId: monthlyAdvantageQuoteData.FkProductId,
            ProductPlanCode: monthlyAdvantageQuoteData.ProductPlanCode,
            FkAgentCode: monthlyAdvantageQuoteData.FkAgentCode,
            BuyingFor: monthlyAdvantageQuoteData.BuyingFor,
            LAFirstName: monthlyAdvantageQuoteData.LAFirstName,
            LALastName: monthlyAdvantageQuoteData.LALastName,
            LAGender: monthlyAdvantageQuoteData.LAGender,
            LADOB: monthlyAdvantageQuoteData.LADOB,
            ProposerFirstName: monthlyAdvantageQuoteData.ProposerFirstName,
            ProposerLastName: monthlyAdvantageQuoteData.ProposerLastName,
            ProposerGender: monthlyAdvantageQuoteData.ProposerGender,
            ProposerDOB: monthlyAdvantageQuoteData.ProposerDOB,
            IsSmoker: monthlyAdvantageQuoteData.IsSmoker,
            UptoAge: monthlyAdvantageQuoteData.UptoAge,
            PayType: monthlyAdvantageQuoteData.PayType,
            BenefitType: monthlyAdvantageQuoteData.BenefitType,
            PremiumPaymentTerm: monthlyAdvantageQuoteData.PremiumPaymentTerm,
            PolicyTerm: monthlyAdvantageQuoteData.PolicyTerm,
            SumAssured: monthlyAdvantageQuoteData.SumAssured,
            GuaranteedIncomePeriod: monthlyAdvantageQuoteData.GuaranteedIncomePeriod,
            MaturityPayoutPeriod: monthlyAdvantageQuoteData.MaturityPayoutPeriod,
            MaturityPayoutFrequency: monthlyAdvantageQuoteData.MaturityPayoutFrequency,
            FlexiBenefitPeriod: monthlyAdvantageQuoteData.FlexiBenefitPeriod,
            AnnualBasePremium: monthlyAdvantageQuoteData.AnnualBasePremium,
            Mode: monthlyAdvantageQuoteData.Mode,
            ModalFactor: monthlyAdvantageQuoteData.ModalFactor,
            ModalPremium: monthlyAdvantageQuoteData.ModalPremium,
            IsNSAP: monthlyAdvantageQuoteData.IsNSAP,
            ServiceTax: monthlyAdvantageQuoteData.ServiceTax,
            PremiumPayable: monthlyAdvantageQuoteData.PremiumPayable,
            IsInYourPresence: monthlyAdvantageQuoteData.IsInYourPresence,
            EstimatedReturnRate: monthlyAdvantageQuoteData.EstimatedReturnRate
          });

          $log.debug("$scope.riderHospi...........", $scope.hcData);
          $log.debug("$scope.pwrData2...........", $scope.pwrData2);
          $log.debug("$scope.pwrData1...........", $scope.pwrData1);
          var selectedRiderIds = [];
          if ($scope.hcData && $scope.riders.isHCActive) {
            //if selected rider id is hospicash - push into selectedRiderId
            selectedRiderIds.push(hospiCashRiderId);
            //added hospi cash rider data in custom code json
            quoteCustomJson.hospiRiderData.push({
              FkAgentCode: "" + userData.agentId,
              FkRiderId: "" + hospiCashRiderId,
              RiderPlanCode: $scope.hcData.prodCode,
              ReferenceSystemTypeId: "1",
              Term:  "" + $scope.calcData.hospiCashTerm,
              SumAssured: $scope.calcData.sumAssuredForRiders,
              IsNSAPProposer: "" + 0,
              ModalPremium: $scope.hcData.modalHospiCashPremium,
              ServiceTaxPayable: $scope.hcData.serviceTaxForModalFirstYear,
              PremiumPayable: $scope.hcData.totalModalPremiumWithTaxForFirstYear
            });
          }
          if ($scope.adbData && $scope.riders.isADBActive) {
            //if selected rider id is hospicash - push into selectedRiderId
            selectedRiderIds.push(adbRiderId);
            //added hospi cash rider data in custom code json
            quoteCustomJson.adbRiderData.push({
              FkAgentCode: "" + userData.agentId,
              FkRiderId: "" + adbRiderId,
              RiderPlanCode: $scope.adbData.prodCode,
              ReferenceSystemTypeId: "1",
              Term:  "" + $scope.calcData.pt,
              SumAssured: $scope.calcData.sumAssuredForADBRiders,
              IsNSAPProposer: "" + 0,
              ModalPremium:  $scope.adbData.modalAdbRiderPremium,
              ServiceTaxPayable: $scope.adbData.serviceTaxForModalFirstYear,
              PremiumPayable: $scope.adbData.totalModalPremiumWithTaxForFirstYear
            });
          }
          if ($scope.pwrData1 && $scope.riders.isPWRActive) {
              //if selected rider id is hospicash - push into selectedRiderId
              selectedRiderIds.push(pwrRiderId);
              //added hospi cash rider data in custom code json
              quoteCustomJson.pwRiderIData.push({
                FkAgentCode: "" + userData.agentId,
                FkRiderId: "" + pwrRiderId,
                RiderPlanCode: $scope.pwrData1.prodCode,
                ReferenceSystemTypeId: "1",
                Term:  "" + $scope.calcData.pt,
                SumAssured: $scope.outputData.sumAssured,
                IsNSAPProposer: "" + 0,
                ModalPremium:  $scope.pwrData1.modalPWRRiderPremium,
                ServiceTaxPayable: $scope.pwrData1.serviceTaxForModalFirstYear,
                PremiumPayable: $scope.pwrData1.totalModalPremiumWithTaxForFirstYear
              });
          }
          if ($scope.pwrData2 && $scope.riders.isPWRActive) {
              //if selected rider id is hospicash - push into selectedRiderId
              selectedRiderIds.push(pwrRiderCiId);
              //added hospi cash rider data in custom code json
              quoteCustomJson.pwRiderIIData.push({
                FkAgentCode: "" + userData.agentId,
                FkRiderId: "" + pwrRiderCiId,
                RiderPlanCode: $scope.pwrData2.prodCode,
                ReferenceSystemTypeId: "1",
                Term:  "" + $scope.calcData.pt,
                SumAssured: $scope.outputData.sumAssured,
                IsNSAPProposer: "" + 0,
                ModalPremium:  $scope.pwrData2.modalPWRRiderPremium,
                ServiceTaxPayable: $scope.pwrData2.serviceTaxForModalFirstYear,
                PremiumPayable: $scope.pwrData2.totalModalPremiumWithTaxForFirstYear
              });
          }
          /**if user selected any rider riders data needs to save in DB**/
          if (selectedRiderIds.length > 0) {
            monthlyAdvantageRidersData = [[]];
            monthlyAdvantageRidersData = $scope.createRidersData(userData, currentData, biRefNo.BiQuoteNo, selectedRiderIds);
              $log.debug("*******monthlyAdvantageRidersData*******",monthlyAdvantageRidersData);
          }
          //if same quote no need to save the data again - method will check is Quote save required
          quoteProposalNosDataService.isQuoteDataInsertRequired(JSON.stringify(quoteCustomJson)).
          then(function(isRequired) {
            if (isRequired) {
              quoteProposalNosDataService.updateBIQuoteNumberUsedStatus(biRefNo.BiQuoteNo).then(function() {
                quoteProposalNosDataService.insertQuoteData(monthlyAdvantageQuoteData);
                if ($scope.hcData || $scope.adbData || $scope.pwrData1 || $scope.pwrData2) {
                    $log.debug("########monthlyAdvantageRidersData########",monthlyAdvantageRidersData);
                  quoteProposalNosDataService.insertRidersData(monthlyAdvantageRidersData);
                }
              });
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  $scope.hidesendEmailPopup();
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, monthlyAdvantageQuoteData.Json,monthlyAdvantageQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,monthlyAdvantageQuoteData.Json,monthlyAdvantageQuoteData.FkProductId);
                }
              }
            } else {
              $log.debug("*******Same Quote Data already available*******");
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, monthlyAdvantageQuoteData.Json,monthlyAdvantageQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,monthlyAdvantageQuoteData.Json,monthlyAdvantageQuoteData.FkProductId);
                }
                $scope.hidesendEmailPopup();
              }
            }
          });
        });
    };

    $scope.createRidersData = function(userData, currentData, biQuoteNo, selectedRiderIds) {
      var monthlyAdvantageRidersData = [
        []
      ];
      for (var i = 0; i < selectedRiderIds.length; i++) {
        if (selectedRiderIds[i] == adbRiderId && $scope.riders.isADBActive) {
          var adbArray = {};
          //user selected Hospicash Rider
          adbArray.FkAgentCode = "" + userData.agentId;
          adbArray.FkQuotationId = biQuoteNo;
          adbArray.FkRiderId = "" + selectedRiderIds[i];
          adbArray.RiderPlanCode = $scope.adbData.prodCode;
          /** 1 = Eapp, 2 = OLS **/
          adbArray.ReferenceSystemTypeId = "1";
          adbArray.Term = "" + $scope.calcData.pt;
          adbArray.SumAssured = $scope.calcData.sumAssuredForADBRiders;
          adbArray.IsNSAPProposer = "" + 0;
          adbArray.ModalPremium = $scope.adbData.modalAdbRiderPremium;
          adbArray.ServiceTaxPayable = $scope.adbData.serviceTaxForModalFirstYear;
          adbArray.PremiumPayable = $scope.adbData.totalModalPremiumWithTaxForFirstYear;
          monthlyAdvantageRidersData[i] = adbArray;
        }
        if (selectedRiderIds[i] == hospiCashRiderId && $scope.riders.isHCActive) {
          var hospiArray = {};
          //user selected Hospicash Rider
          hospiArray.FkAgentCode = "" + userData.agentId;
          hospiArray.FkQuotationId = biQuoteNo;
          hospiArray.FkRiderId = "" + selectedRiderIds[i];
          hospiArray.RiderPlanCode = $scope.hcData.prodCode;
          /** 1 = Eapp, 2 = OLS **/
          hospiArray.ReferenceSystemTypeId = "1";
          hospiArray.Term = "" + $scope.calcData.hospiCashTerm;
          hospiArray.SumAssured = $scope.calcData.sumAssuredForRiders;
          hospiArray.IsNSAPProposer = "" + 0;
          hospiArray.ModalPremium = $scope.hcData.modalHospiCashPremium;
          hospiArray.ServiceTaxPayable = $scope.hcData.serviceTaxForModalFirstYear;
          hospiArray.PremiumPayable = $scope.hcData.totalModalPremiumWithTaxForFirstYear;
          monthlyAdvantageRidersData[i] = hospiArray;
        }
        if (selectedRiderIds[i] == pwrRiderCiId && $scope.riders.isPWRActive && $scope.pwrData2) {
          var pwr2Array = {};
          //user selected Hospicash Rider
          pwr2Array.FkAgentCode = "" + userData.agentId;
          pwr2Array.FkQuotationId = biQuoteNo;
          pwr2Array.FkRiderId = "" + selectedRiderIds[i];
          pwr2Array.RiderPlanCode = $scope.pwrData2.prodCode;
          /** 1 = Eapp, 2 = OLS **/
          pwr2Array.ReferenceSystemTypeId = "1";
          pwr2Array.Term = "" + $scope.calcData.pt;
          pwr2Array.SumAssured = $scope.calcData.sumAssuredForRiders;
          pwr2Array.IsNSAPProposer = "" + 0;
          pwr2Array.ModalPremium = $scope.pwrData2.modalPWRRiderPremium;
          pwr2Array.ServiceTaxPayable = $scope.pwrData2.serviceTaxForModalFirstYear;
          pwr2Array.PremiumPayable = $scope.pwrData2.totalModalPremiumWithTaxForFirstYear;
          monthlyAdvantageRidersData[i] = pwr2Array;
        }
        if (selectedRiderIds[i] == pwrRiderId && $scope.riders.isPWRActive && $scope.pwrData1) {
          var pwr1Array = {};
          //user selected Hospicash Rider
          pwr1Array.FkAgentCode = "" + userData.agentId;
          pwr1Array.FkQuotationId = biQuoteNo;
          pwr1Array.FkRiderId = "" + selectedRiderIds[i];
          pwr1Array.RiderPlanCode = $scope.pwrData1.prodCode;
          /** 1 = Eapp, 2 = OLS **/
          pwr1Array.ReferenceSystemTypeId = "1";
          pwr1Array.Term = "" + $scope.calcData.pt;
          pwr1Array.SumAssured = $scope.calcData.sumAssuredForRiders;
          pwr1Array.IsNSAPProposer = "" + 0;
          pwr1Array.ModalPremium = $scope.pwrData1.modalPWRRiderPremium;
          pwr1Array.ServiceTaxPayable = $scope.pwrData1.serviceTaxForModalFirstYear;
          pwr1Array.PremiumPayable = $scope.pwrData1.totalModalPremiumWithTaxForFirstYear;
          monthlyAdvantageRidersData[i] = pwr1Array;
        }
      }
      return monthlyAdvantageRidersData;
    };

    function createmonthlyAdvantageIRDAQuotePDFJson(BiQuoteNo) {
      $log.debug("calcData",$scope.calcData);
      var userData = getSetCommonDataService.getCommonData();
      var currentData = getSetCommonDataService.getCurrentProdData();

      var selectedRiderData={};
      var monthlyAdvantageIRDAQuotePDFJson = {"PDF":{}};
      monthlyAdvantageIRDAQuotePDFJson.PDF.quoteNo = BiQuoteNo;
      monthlyAdvantageIRDAQuotePDFJson.PDF.proposalNo = "";
      monthlyAdvantageIRDAQuotePDFJson.PDF.policyNo = "";
      monthlyAdvantageIRDAQuotePDFJson.PDF.uin = currentData.prodUIN;
      monthlyAdvantageIRDAQuotePDFJson.PDF.productCode = $scope.outputData.prodCode;
      monthlyAdvantageIRDAQuotePDFJson.PDF.riderCode = [];
      monthlyAdvantageIRDAQuotePDFJson.PDF.illustrationGeneratedBy = userData.channelName;
      monthlyAdvantageIRDAQuotePDFJson.PDF.illustrationDate = utilityService.getDisplayDate(new Date(), 'dd-MM-yyyy');

      monthlyAdvantageIRDAQuotePDFJson.PDF.lifeAssuredDetail = {
        name: $scope.data.liFirstName + " " + $scope.data.liLastName,
        gender: $scope.data.laGender==0?"Male":"Female",
        age: $scope.getAge($scope.data.labfAge),
      };
      monthlyAdvantageIRDAQuotePDFJson.PDF.proposerDetail = {};
      if ($scope.data.BuyingFor!="Self") {
        monthlyAdvantageIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.propFirstName + " " + $scope.data.propLastName;
        monthlyAdvantageIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.proposerGender==0?"Male":"Female";
        monthlyAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.proposerAge);
      } else {
        monthlyAdvantageIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.liFirstName + " " + $scope.data.liLastName;
        monthlyAdvantageIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.laGender==0?"Male":"Female";
        monthlyAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.labfAge);
      }
      monthlyAdvantageIRDAQuotePDFJson.PDF.benefitAndPremiumDetail = {
        planName: "" + currentData.prodLbl,
        policyTerm: "" + $scope.outputData.pt,
        premiumPaymentTerm: "" + $scope.inputData.ppt,
        premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
        guaranteedMonthlyIncome:$scope.calcData.GuaranteedMonthlyIncome,
        guaranteedIncomeBenefitPeriod:$scope.data.guaranteedIncome,
        //deathBenefit:$scope.data.biCalculation.deathBenifit[0],
        benefitUptoAge:monthlyAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
        sumAssured: $scope.calcData.sumAssured,
        annualPremium: $scope.calcData.basePremium,
        modalPremium: $scope.calcData.modalPremium,
        nsapExtra:$scope.outputData.extraModalPremiumDueToNSAP,
        serviceTax1stYear: $scope.calcData.serviceForAnnualFirstYearTax,
        serviceTax2ndYear:$scope.calcData.serviceForAnnualSecondYearTax,
        rider: [],
        totalPremium1stYear: $scope.calcData.totalAnnualPremiumWithTaxForFirstYear,
        totalPremium2ndYear:$scope.calcData.totalAnnualPremiumWithTaxForSecondYear

      };
      if ($scope.hcData && $scope.riders.isHCActive) {
        monthlyAdvantageIRDAQuotePDFJson.PDF.riderCode.push($scope.hcData.prodCode);
        monthlyAdvantageIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: hospiCashRiderId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.ppt,
          premiumPaymentTerm: "" + $scope.outputData.riderPpt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          guaranteedMonthlyIncome:$scope.calcData.GuaranteedMonthlyIncome,
          guaranteedIncomeBenefitPeriod:0,
          //deathBenefit:$scope.data.biCalculation.deathBenifit[0],
          sumAssured: $scope.calcData.sumAssuredForRiders,
          benefitUptoAge: monthlyAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:"" + 0,
          annualPremium: $scope.calcData.annualHospiCashPremium,
          modalPremium:  $scope.hcData.modalHospiCashPremium,
          serviceTax1stYear: $scope.hcData.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.hcData.serviceTaxForModalFirstYear
        });
      }

      if ($scope.adbData && $scope.riders.isADBActive) {
        monthlyAdvantageIRDAQuotePDFJson.PDF.riderCode.push($scope.adbData.prodCode);
        monthlyAdvantageIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: adbRiderId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          guaranteedMonthlyIncome:$scope.calcData.GuaranteedMonthlyIncome,
          guaranteedIncomeBenefitPeriod:0,
          //deathBenefit:$scope.data.biCalculation.deathBenifit[0],
          sumAssured: $scope.calcData.sumAssuredForADBRiders,
          benefitUptoAge: monthlyAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:"" + 0,
          annualPremium:  $scope.calcData.annualAdbRiderPremium ,
          modalPremium:$scope.adbData.modalAdbRiderPremium,
          serviceTax1stYear:$scope.adbData.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.adbData.serviceTaxForModalFirstYear

        });
      }

      $log.debug("benefitIllustration",$scope.data.biCalculation);
      monthlyAdvantageIRDAQuotePDFJson.PDF.benefitIllustration =$scope.data.biCalculation;
      return JSON.stringify(monthlyAdvantageIRDAQuotePDFJson);
      //return monthlyAdvantageIRDAQuotePDFJson;
    }
    <!--QuoteData-->

    $scope.updateRiderSA = function(data) {
      $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
    };
    $scope.getHCRTerm = function(ppt, term) {
      return Number(ppt) >= Number(term);
    };
    $scope.openPopupForChangeDetails = function() {
      $scope.showPopupToGoForLAAndProposerDetails = true;
    };

    $scope.closePopupForChangeDetails = function() {
      $scope.showPopupToGoForLAAndProposerDetails = false;
    };

    $scope.goToLAAndProposer = function() {
      $state.go("app.monthlyAdvantage-LAAndProposer");
    };

    $scope.showPopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = true;
    };

    $scope.closePopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = false;
    };

    $scope.email = function() {
      $scope.showPlusPopup = false;
      $scope.showSendEmailPopup = true;
      $scope.email_To="";
      $scope.email_Cc="";
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
        if (window.cordova) {
          if ($cordovaNetwork.isOffline()) {
            $cordovaToast.showLongBottom('You are offline.').then(function(success) {
              $scope.createQuoteData(true, emailData, false);
            }, function(error) {
              // error
            });
          } else {
            $cordovaToast.showLongBottom('Email Send Successfully').then(function(success) {
              $scope.createQuoteData(true, emailData, true);
            }, function(error) {
              // error
            });
          }
        } else {
          $scope.createQuoteData(true, emailData, true);
        }

      }, function(errorMsg) {
        if (errorMsg == "emailTo") {
          $scope.isValidateEmailTo = true;
        }
        if (errorMsg == "emailCc") {
          $scope.isValidateEmailCc = true;
        }
      });
    };

    $scope.hidesendEmailPopup = function() {
      $scope.showPlusPopup = true;
      $scope.showSendEmailPopup = false;
    }

    $scope.toggleChart = function() {
      $scope.showHideChart = !$scope.showHideChart;
    }

    $scope.goToHomePage = function() {
      /*Animation Code*/
      setAnimate($ionicHistory);
      $state.go('app.monthlyAdvantage-home');
    };
    /**Chart Function**/
    $scope.hightLightBar = function(label, index) {
      for (var i = 0; i < $scope.outputData.finalArray.length; i++) {
        if (i != index) {
          $scope.outputData.finalArray[i].checked = false;
        } else {
          $scope.outputData.finalArray[i].checked = true;
        }
      }
      $scope.outputData.selected = label.value;
    };
    /**Chart Function**/

  }
]);
