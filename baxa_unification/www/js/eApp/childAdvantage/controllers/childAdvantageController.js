eAppModule.controller('childAdvantageController', ['$log',
  '$scope',
  '$state',
  '$http',
  '$rootScope',
  '$ionicHistory',
  '$ionicPlatform',
  '$ionicLoading',
  '$cordovaDatePicker',
  '$ionicNavBarDelegate',
  'eAppServices',
  'cADataFromDBSvc',
  'commonFormulaSvc',
  'cAValidationService',
  'cACalculationService',
  'riderValidationService',
  'utilityService',
  'getSetCommonDataService',
  'quoteProposalNosDataService',
  'pwrRiderDataFromUserSvc',
  'calculatePwrRiderPremiumSvc',
  'calculateAdbRiderPremiumSvc',
  'hospiCashRiderDataFromUserSvc',
  'calculatehospiCashRiderPremiumSvc',
  '$filter',
  'sendBIEmailService',
  function($log, $scope, $state, $http, $rootScope, $ionicHistory, $ionicPlatform,$ionicLoading, $cordovaDatePicker, $ionicNavBarDelegate, eAppServices, cADataFromDBSvc, commonFormulaSvc, cAValidationService, cACalculationService, riderValidationService, utilityService, getSetCommonDataService, quoteProposalNosDataService, pwrRiderDataFromUserSvc, calculatePwrRiderPremiumSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc,$filter,sendBIEmailService) {
    'use strict';
    var vm = this;
    var hospiCashRiderId = 5,
      adbRiderId = 4,
      prodId = 14,
      channelId = 1,
      pwrRiderId = 6,
      pwrRiderCiId = 7,
      pwrOption = 1;

    $scope.inputData = {};
    $scope.outputData = {};
    $scope.calcData = {};
    $scope.dbErrors = [];
    $scope.prodBaseCode = "";

    $scope.title = "Child Advantage";
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
      if ($state.current.name == 'app.childAdvantage-home') {
        $state.go("app.childAdvantage-LAAndProposer");
      } else if ($state.current.name == 'app.childAdvantage-LAAndProposer') {
        $scope.data = eAppServices.getBuyForDetails();
        $state.go("app.eApp");
      } else if ($state.current.name == 'app.childAdvantage-estimated') {
        $state.go("app.childAdvantage-home");
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
    $scope.animateClass = animateNgClass('bounceInDown', 'animationduration25');
    //** Back Button Funtionality **//

    /*Get validation messgae through json file.*/
    $http.get('js/eApp/flexiSave/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
    });
    /*Get validation messgae through json file.*/

    //** Get Data Variables **//

    //** Get Generic Options for Form Elements **//
    var params = {
      "ui_color": 'blue',
      "ui_gender": true,
      "ui_age": true,
      "ui_smoke": false,
      "ui_nsap": true,
      "ui_payType": true,
      "ui_payTypeDisable": false,
      "ui_benefitType": true,
      "ui_termExtra": false,
      /*"ui_pmode" : true,*/
      "ui_sumAssured": false,
      "ui_anualPreminum": true,
      "ui_modelPreminum": true,
      "switch": false
    };

    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "BUYPOLFOR", "PMODE", "PT", "BENEFITTYPE", "MATURITYOPTION"], ["PPTRP", "PPTLP", "MPFACTOR"])
      .then(function(result) {
        $scope.params = params;
        $scope.formData = result[0];
        $scope.formDataCalc = {
          /*"PT": JSON.parse(result[1].PT),*/
          "PPTLP": JSON.parse(result[1].PPTLP),
          "PPTRP": JSON.parse(result[1].PPTRP),
          "MPFACTOR": JSON.parse(result[1].MPFACTOR) /*,"PREPAYOPN":JSON.parse(result[1].PREPAYOPN)*/
        };
        $scope.formDataOut = result[2];

        if (result[0].PT.length > 0) {
          var pts = [];
          for (var d = 0; d < result[0].PT.length; d++) {
            pts.push(parseInt(result[0].PT[d].name));
          }
          $scope.formData.PTMin = Math.min.apply(Math, pts);
          $scope.formData.PTMax = Math.max.apply(Math, pts);
        }

        //***** COPY PASTE - DATE MIN MAX FUNCTION *****//
        eAppServices.getLaAge(prodId, channelId)
          .then(function(result) {
            $scope.data.laMinAge = result.MinAge;
            $scope.data.laMaxAge = result.MaxAge;
            $scope.data.laMinAgeYear = result.MinDate;
            $scope.data.laMaxAgeYear = result.MaxDate;
          });
        eAppServices.getPropAge(prodId, channelId)
          .then(function(result) {
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
          $state.go('app.childAdvantage-LAAndProposer');
        }

        if ($scope.inputData.laAge >= 51) {
          $scope.inputData.benfitType = 'LIMITED';
          $scope.params.ui_payTypeDisable = true;
        } else {
          $scope.inputData.benfitType = 'REGULAR';
        }
      });
    //** Get Data Variables **//

    //** Handle Form Submit for LA Proposer Details Form **//
    $scope.ProceedForLAAndProposerDetails = function(data) {
      $scope.inputData.laName = data.liFirstName + " " + data.liLastName;
      $scope.inputData.laAge = $scope.getAge(data.labfAge);
      $scope.inputData.laGender = parseInt(data.laGender);
      $scope.inputData.annualPremium = ($scope.inputData.annualPremium)?($scope.inputData.annualPremium):(500000);
      $scope.inputData.isSelf = (data.BuyingFor == "Self") ? (true) : (false);
      $scope.inputData.premiumMode = ($scope.inputData.premiumMode)?($scope.inputData.premiumMode):(1); /*default Value to select*/
      $scope.inputData.annualPremiumMinLength = 4;
      $scope.inputData.annualPremiumMaxLength = 10;
      $scope.inputData.pt = ($scope.inputData.pt)?($scope.inputData.pt):(21);
      $scope.inputData.ppt = ($scope.inputData.ppt)?($scope.inputData.ppt):(11);
      $scope.inputData.NSAPForLA = false;
      $scope.inputData.maturityOption = "Money Back";

      if (data.BuyingFor != "Self") {
        $scope.inputData.proposerName = data.propFirstName + " " + data.propLastName;
        $scope.inputData.proposerGender = data.proposerGender;
        $scope.inputData.proposerAge = $scope.getAge(data.proposerAge);
      } else if (data.BuyingFor == "Self") {
        $scope.inputData.proposerName = data.liFirstName + " " + data.liLastName;
        $scope.inputData.proposerGender = data.laGender;
        $scope.inputData.proposerAge = $scope.getAge(data.labfAge);
      }
      eAppServices.setInputDetails($scope.inputData);
      eAppServices.setBuyForDetails(data);
      $state.go('app.childAdvantage-home');
    };
    //** Handle Form Submit for LA Proposer Details Form **//

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
        if ($scope.riders.isPWRActive) {
          $scope.pwrSelectAlert = true;
        } else if (calcData.hospiCashTerm > 0 && calcData.hospiCashDHCB > 0) {
          cADataFromDBSvc.getProdCodeCA(prodId, channelId, calcData.ppt, calcData.benfitType, calcData.maturityOption)
            .then(function(prodCode) {
              var validations = riderValidationService.riderPreHCValidateService(calcData, prodId, channelId, prodCode);
              if (validations.length > 0) {
                $scope.showDbErrors = true;
                for (var s = 0; s < validations.length; s++) {
                  $scope.riders.dbErrorHC.push(validations[s][0]);
                }
              } else {
                calcData.sumAssuredForRiders = calcData.hospiCashDHCB;
                calcData.riderPpt = calcData.hospiCashTerm;
                hospiCashRiderDataFromUserSvc.setHospiCashData([]);
                var hospiInput = hospiCashRiderDataFromUserSvc.setHospiCashData(calcData);
                calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospiCashRiderId, prodId, channelId, calcData.base)
                  .then(function(result) {
                    $log.debug("****************$scope.hcData**************", result);

                    $scope.hcData = result;
                    $scope.riders.isHCActive = true;
                    $scope.calcData.benfitUptoAgeHC = parseFloat(result.benfitUptoAge);
                    $scope.calcData.modalHospiCashPremium = parseFloat(result.modalHospiCashPremium);
                    $scope.calcData.annualHospiCashPremium = parseFloat(result.annualHospiCashPremium);
                    $scope.calcData.percentOfBasePremiumHC = parseFloat(result.percentOfBasePremium);
                    $scope.calcData.serviceTaxHospiCashForModalFirstYear = parseFloat(result.serviceTaxForModalFirstYear);
                    $scope.calcData.serviceTaxHospiCashForAnnualFirstYear = parseFloat(result.serviceTaxForAnnualFirstYear);
                    $scope.calcData.totalModalPremiumHospiCashWithTaxForFirstYear = parseFloat(result.totalModalPremiumWithTaxForFirstYear);
                    $scope.calcData.totalAnnualPremiumHospiCashWithTaxForFirstYear = parseFloat(result.totalAnnualPremiumWithTaxForFirstYear);
                  });
              }
            });
        }
      },
      'resetHC': function() {
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
      'PWR': function(calcData) {
        if ($scope.riders.isHCActive || $scope.riders.isADBActive) {
          $scope.riderSelectAlert = true;
        } else /*if($scope.riders.isPWRActive)*/ {
          cADataFromDBSvc.getProdCodeCA(prodId, channelId, calcData.ppt, calcData.benfitType, calcData.maturityOption)
            .then(function(prodCode) {
              if (!$scope.riders.PWRI || !$scope.riders.PWRII) {
                $scope.calcData.annualPWRIIRiderPremium = 0;
                $scope.calcData.modalPWRIIRiderPremium = 0;
                $scope.calcData.serviceTaxPWRIIForAnnualFirstYear = 0;
                $scope.calcData.serviceTaxPWRIIForModalFirstYear = 0;
                $scope.calcData.totalAnnualPremiumPWRIIWithTaxForFirstYear = 0;
                $scope.calcData.totalModalPremiumPWRIIWithTaxForFirstYear = 0;
                $scope.calcData.annualPWRIRiderPremium = 0;
                $scope.calcData.modalPWRIRiderPremium = 0;
                $scope.calcData.serviceTaxPWRIForAnnualFirstYear = 0;
                $scope.calcData.serviceTaxPWRIForModalFirstYear = 0;
                $scope.calcData.totalAnnualPremiumPWRIWithTaxForFirstYear = 0;
                $scope.calcData.totalModalPremiumPWRIWithTaxForFirstYear = 0;
              }

              if ($scope.riders.PWRI || $scope.riders.PWRII) {
                calcData.PWRI = $scope.riders.PWRI;
                calcData.PWRII = $scope.riders.PWRII;
                riderValidationService.riderPrePWRValidateService(calcData, prodId, channelId, prodCode)
                  .then(function(validation) {
                    if (validation.length > 0 && $scope.outputData.pwrRiderOption) {
                      $scope.showDbErrors = true;
                      for (var v = 0; v < validation.length; v++) {
                        $scope.riders.dbErrorPWR.push(validation[v]);
                      }
                    } else {
                      $scope.riders.isPWRActive = true;
                      var pwrInput = pwrRiderDataFromUserSvc.setPWRRiderData(calcData);
                      if ($scope.riders.PWRII) {
                        if (!$scope.riders.PWRI) {
                          $scope.calcData.annualPWRIRiderPremium = 0;
                          $scope.calcData.modalPWRIRiderPremium = 0;
                          $scope.calcData.serviceTaxPWRIForAnnualFirstYear = 0;
                          $scope.calcData.serviceTaxPWRIForModalFirstYear = 0;
                          $scope.calcData.totalAnnualPremiumPWRIWithTaxForFirstYear = 0;
                          $scope.calcData.totalModalPremiumPWRIWithTaxForFirstYear = 0;
                        }
                        var pwrData1 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, calcData, 2);
                        pwrData1.then(function(result) {
                          if (result.annualPwrPremium === 0) {
                            $scope.pwrOutputOption1 = false;
                            $scope.showDbErrors = true;
                            $scope.pwrData2 = "";
                            $scope.riders.dbErrorPWR.push({
                              "Name": "PREM",
                              "ErrorMessage": "30% Base of premium is less than rider!"
                            });
                          } else {
                            $scope.pwrData2 = result;
                            $scope.pwrOutputOption1 = true;
                            $scope.riders.isPWRActive = true;
                            $scope.calcData.prodCodePWRII = result.prodCode;

                            $scope.calcData.annualPWRIIRiderPremium = parseFloat(result.annualPWRRiderPremium);
                            $scope.calcData.modalPWRIIRiderPremium = parseFloat(result.modalPWRRiderPremium);
                            $scope.calcData.serviceTaxPWRIIForAnnualFirstYear = parseFloat(result.serviceTaxForAnnualFirstYear);
                            $scope.calcData.serviceTaxPWRIIForModalFirstYear = parseFloat(result.serviceTaxForModalFirstYear);
                            $scope.calcData.totalAnnualPremiumPWRIIWithTaxForFirstYear = parseFloat(result.totalAnnualPremiumWithTaxForFirstYear);
                            $scope.calcData.totalModalPremiumPWRIIWithTaxForFirstYear = parseFloat(result.totalModalPremiumWithTaxForFirstYear);

                            $scope.calcData.benfitUptoAgePWRII = parseFloat(result.benfitUptoAge);
                            $scope.calcData.percentOfBasePremiumPWRII = parseFloat(result.percentOfBasePremium);
                          }
                        });
                      }
                      if ($scope.riders.PWRI) {
                        if (!$scope.riders.PWRII) {
                          $scope.calcData.annualPWRIIRiderPremium = 0;
                          $scope.calcData.modalPWRIIRiderPremium = 0;
                          $scope.calcData.serviceTaxPWRIIForAnnualFirstYear = 0;
                          $scope.calcData.serviceTaxPWRIIForModalFirstYear = 0;
                          $scope.calcData.totalAnnualPremiumPWRIIWithTaxForFirstYear = 0;
                          $scope.calcData.totalModalPremiumPWRIIWithTaxForFirstYear = 0;
                        }
                        var pwrData2 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, calcData, 1);
                        pwrData2.then(function(result) {
                          if (result.annualPwrPremium === 0) {
                            $scope.pwrOutputOption2 = false;
                            $scope.showDbErrors = true;
                            $scope.pwrData1 = "";
                            $scope.riders.dbErrorPWR.push({
                              "Name": "PREM",
                              "ErrorMessage": "30% Base of premium is less than rider!"
                            });
                          } else {
                            $scope.pwrData1 = result;
                            $scope.pwrOutputOption2 = true;
                            $scope.riders.isPWRActive = true;
                            $scope.calcData.prodCodePWRI = result.prodCode;
                            $scope.calcData.annualPWRIRiderPremium = parseFloat(result.annualPWRRiderPremium);
                            $scope.calcData.modalPWRIRiderPremium = parseFloat(result.modalPWRRiderPremium);
                            $scope.calcData.serviceTaxPWRIForAnnualFirstYear = parseFloat(result.serviceTaxForAnnualFirstYear);
                            $scope.calcData.serviceTaxPWRIForModalFirstYear = parseFloat(result.serviceTaxForModalFirstYear);
                            $scope.calcData.totalAnnualPremiumPWRIWithTaxForFirstYear = parseFloat(result.totalAnnualPremiumWithTaxForFirstYear);
                            $scope.calcData.totalModalPremiumPWRIWithTaxForFirstYear = parseFloat(result.totalModalPremiumWithTaxForFirstYear);

                            $scope.calcData.benfitUptoAgePWRI = parseFloat(result.benfitUptoAge);
                            $scope.calcData.percentOfBasePremiumPWRI = parseFloat(result.percentOfBasePremium);
                          }
                        });
                      }
                    }
                  });
              } else {
                $scope.riders.isPWRActive = false;
              }
            });

        }
      },
      'resetPWR': function() {
        if ($scope.riders.isPWRActive) {
          $scope.riders.isPWRActive = false;
          $scope.riders.PWRI = false;
          $scope.riders.PWRII = true;
          $scope.pwrData2 = "";
          $scope.pwrData1 = "";

          $scope.calcData.annualPWRIRiderPremium = 0;
          $scope.calcData.modalPWRIRiderPremium = 0;
          $scope.calcData.serviceTaxPWRIForAnnualFirstYear = 0;
          $scope.calcData.serviceTaxPWRIForModalFirstYear = 0;
          $scope.calcData.totalAnnualPremiumPWRIWithTaxForFirstYear = 0;
          $scope.calcData.totalModalPremiumPWRIWithTaxForFirstYear = 0;
          $scope.calcData.benfitUptoAgePWRI = 0;
          $scope.calcData.percentOfBasePremiumPWRI = 0;

          $scope.calcData.annualPWRIIRiderPremium = 0;
          $scope.calcData.modalPWRIIRiderPremium = 0;
          $scope.calcData.serviceTaxPWRIIForAnnualFirstYear = 0;
          $scope.calcData.serviceTaxPWRIIForModalFirstYear = 0;
          $scope.calcData.totalAnnualPremiumPWRIIWithTaxForFirstYear = 0;
          $scope.calcData.totalModalPremiumPWRIIWithTaxForFirstYear = 0;
          $scope.calcData.benfitUptoAgePWRII = 0;
          $scope.calcData.percentOfBasePremiumPWRII = 0;
        }
      },
      'ADB': function(calcData) {
        if ($scope.riders.isPWRActive) {
          $scope.pwrSelectAlert = true;
        } else if (calcData.sumAssuredForADBRiders <= calcData.sumAssured && calcData.sumAssuredForADBRiders > 0 && calcData.ppt > 0) {
          cADataFromDBSvc.getProdCodeCA(prodId, channelId, calcData.ppt, calcData.benfitType, calcData.maturityOption)
            .then(function(prodCode) {
              $scope.riders.dbErrorADB = [];
              $scope.calcData.riderterm = $scope.outputData.ppt;
              $scope.calcData.ADBRider = true;
              $scope.calcData.riderterm = calcData.ppt;
              riderValidationService.riderPreADBValidateService(calcData, prodId, channelId, prodCode)
                .then(function(message) {
                  if (message.length > 0) {
                    $scope.riders.isADBActive = false;
                    $scope.calcData.ADBRider = false;
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
                        $scope.riders.dbErrorADB.push({"Name": "ADB", "ErrorMessage": "30% Base premium is less than rider!"});
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

    /**/
    $scope.calculate = function(inputData) {
      //** Calculation **//
      $scope.outputData.ppt = inputData.ppt;
      $scope.outputData.premiumMode = inputData.premiumMode;
      $scope.outputData.maturityPremiumMode = inputData.premiumMode;
      $scope.outputData.basePremium = parseInt(inputData.annualPremium);
      $scope.outputData.pt = "" + inputData.pt;
      $scope.outputData.modalPremium = inputData.modalPremium;
      $scope.outputData.NSAPForLA = (inputData.NSAPForLA !== undefined) ? (inputData.NSAPForLA) : (false);
      $scope.outputData.NSAPForPrposer = false;

      cACalculationService.calcCASumAssured(prodId, channelId, $scope.outputData)
        .then(function(sumassured) {
          $log.debug("*****************************************sumassured :", sumassured);
          $scope.outputData.sumAssured = sumassured;

          cAValidationService.validateProduct(prodId, channelId, $scope.outputData)
            .then(function(messages) {
              if (messages.length === 0) {
                $scope.showDbErrors = false;
                var answer = cACalculationService.calculateCATotalPremium(prodId, channelId, $scope.outputData);
                answer.then(function(basePremiumResult) {
                  $log.debug(':premi:', basePremiumResult);
                  $scope.outputData.premium = basePremiumResult;
                  $scope.outputData.sumAssuredForADBRiders = parseInt(basePremiumResult.sumAssured);
                  var BI = basePremiumResult.bi;
                  BI.then(function(res) {
                    $log.debug(":Bi:----------", res);
                    $scope.outputData.bi = res;
                    $scope.data.biCalculation=res;
                    if (res.sBAt4.length > 0 && res.sBAt8.length > 0 && res.gMaturityBenfitAt4.length > 0 && res.gMaturityBenfitAt8.length > 0) {
                      var gMB = res.gMB[res.gMB.length - 1];
                      var sBAt4ca = 0;
                      var sBAt8ca = 0;
                      for(var key in res.sBAt4){
                        sBAt4ca += (typeof res.sBAt4[key] != "string") ? (parseInt(res.sBAt4[key])) : (0);
                      }
                      for(var xk in res.sBAt8){
                        sBAt8ca += (typeof res.sBAt8[xk] != "string") ? (parseInt(res.sBAt8[xk])) : (0);
                      }
                      var nGMB4 = res.gMaturityBenfitAt4[res.gMaturityBenfitAt4.length - 1] - res.gMB[res.gMB.length - 1];
                      var nGMB8 = res.gMaturityBenfitAt8[res.gMaturityBenfitAt8.length - 1] - res.gMB[res.gMB.length - 1];

                      $scope.outputData.precent = 8;
                      $scope.outputData.pwrRiderOption = 1;
                      $scope.outputData.p4 = {
                        "sumAssuredAtMaturity": commonFormulaSvc.round(sBAt4ca, 2),
                        "nonGuaranteedMaturityBenefit": commonFormulaSvc.round(nGMB4, 2)
                      };
                      $scope.outputData.p8 = {
                        "sumAssuredAtMaturity": commonFormulaSvc.round(sBAt8ca, 2),
                        "nonGuaranteedMaturityBenefit": commonFormulaSvc.round(nGMB8, 2)
                      };

                      /**Chart Code **/
                      $scope.outputData.sB = res.sB;
                      if (!angular.isNumber($scope.outputData.sB[20])) {
                        $scope.outputData.sB[20] = 1;
                      }
                      $scope.outputData.policyYearArr = res.policyYearArr;

                      /*****Find out minimum and maximum from given array*****/
                      $scope.arrayMin = function(arr) {
                        var len = arr.length,
                          min = Infinity;
                        while (len--) {
                          if (arr[len] < min) {
                            min = arr[len];
                          }
                        }
                        return min;
                      };

                      $scope.arrayMax = function(arr) {
                        var len = arr.length,
                          max = -Infinity;
                        while (len--) {
                          if (arr[len] > max) {
                            max = arr[len];
                          }
                        }
                        return max;
                      };

                      /*Min Max value*/
                      $scope.minimum = $scope.arrayMin($scope.outputData.sB);
                      $scope.maximum = $scope.arrayMax($scope.outputData.sB);

                      $scope.outputData.finalArray = [];
                      var getCalulatedHeight = function(mi, ma, currentValue) {

                        var ageDiffHighLow = Number(ma) - Number(mi);
                        /***Covert the values between 0 to 100****/
                        if (Number((currentValue - mi) / ageDiffHighLow * 100) <= 100 && Number((currentValue - mi) / ageDiffHighLow * 100) > 0) {
                          return (currentValue - mi) / ageDiffHighLow * 100;
                        } else if (Number((currentValue - mi) / ageDiffHighLow * 100) <= 1) {
                          return 2;
                        }
                      };

                      for (var i = 0; i < $scope.outputData.sB.length; i++) {
                        if (angular.isNumber($scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1]) || i == $scope.outputData.sB.length - 1 || i == $scope.outputData.sB.length - 2) {
                          if ($scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1] > 0 || i == $scope.outputData.sB.length - 1 || i == $scope.outputData.sB.length - 2) {
                            if (i == $scope.outputData.sB.length - 1 || i == $scope.outputData.sB.length - 2) {
                              var x = {
                                key: $scope.outputData.policyYearArr[i],
                                value: 85, /*$scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1],*/
                                height: 150, /*Math.floor((Math.random() * 100) + 1),*/
                                checked: false
                              };
                            } else {
                              var x = {
                                key: $scope.outputData.policyYearArr[i],
                                value: $scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1],
                                height: getCalulatedHeight($scope.minimum, $scope.maximum, $scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1]),
                                checked: false
                              };
                            }
                            if ($scope.inputData.pt == 20) {
                              if (i == 16) {
                                x.checked = true;
                                $scope.outputData.selected = $scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1];
                              }
                            }
                            if ($scope.inputData.pt == 12) {
                              if (i == 8) {
                                x.checked = true;
                                $scope.outputData.selected = $scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1];
                              }
                            }
                            $scope.outputData.finalArray.push(x);
                          }
                        }
                      }
                      /**Chart Code**/

                      eAppServices.setOutputDetails($scope.outputData);
                      eAppServices.setCalcDetails($scope.outputData);

                      $state.go('app.childAdvantage-estimated');
                    }
                  });
                });
              } else {
                $scope.showDbErrors = true;
                for (var s = 0; s < messages.length; s++) {
                  $scope.dbErrors.push(messages[s][0]);
                }
              }
            });
        });
      //** Calculation **//
    };

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
      $log.debug("****************************currentData", currentData);

      quoteProposalNosDataService.getBIQuoteNumber(userData.agentId)
        .then(function(biRefNo) {
          var childAdvantageQuoteData = {};
          var childAdvantageRidersData = [
            []
          ];
          var quoteCustomJson = {
            quoteData: [],
            adbRiderData: [],
            hospiRiderData: [],
            pwRiderIData: [],
            pwRiderIIData: []
          };

          /**1.BI Ref No**/
          childAdvantageQuoteData.PkQuotationId = biRefNo.BiQuoteNo;
          /**2 - >  1 = Eapp, 2 = OLS **/
          childAdvantageQuoteData.ReferenceSystemTypeId = "1";
          /**3 - > Selected Product ID**/
          childAdvantageQuoteData.FkProductId = currentData.prodId;
          /**4 - > Selected Product Plan Code**/
          childAdvantageQuoteData.ProductPlanCode = $scope.outputData.premium.prodCode;
          /**5-> Logged in Agent Id**/
          childAdvantageQuoteData.FkAgentCode = "" + userData.agentId;
          /**Buying For Screen**/
          childAdvantageQuoteData.BuyingFor = $scope.data.BuyingFor;
          childAdvantageQuoteData.LAFirstName = $scope.data.liFirstName;
          childAdvantageQuoteData.LALastName = $scope.data.liLastName;
          childAdvantageQuoteData.LAGender = $scope.data.laGender == 0 ? "Male" : "Female";
          childAdvantageQuoteData.LADOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          if (childAdvantageQuoteData.BuyingFor != "Self") {
            childAdvantageQuoteData.ProposerFirstName = $scope.data.propFirstName;
            childAdvantageQuoteData.ProposerLastName = $scope.data.propLastName;
            childAdvantageQuoteData.ProposerGender = $scope.data.proposerGender == 0 ? "Male" : "Female";
            childAdvantageQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.proposerAge), 'MM/dd/yyyy');
          } else {
            childAdvantageQuoteData.ProposerFirstName = $scope.data.liFirstName;
            childAdvantageQuoteData.ProposerLastName = $scope.data.liLastName;
            childAdvantageQuoteData.ProposerGender = $scope.data.laGender == 0 ? "Male" : "Female";
            childAdvantageQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          }
          /**Input/Output Screen**/
          if ($scope.calcData.smoke != undefined) {
            childAdvantageQuoteData.IsSmoker = ($scope.calcData.smoke == "nonsmoke") ? "" + 0 : "" + 1;
          } else {
            childAdvantageQuoteData.IsSmoker = "" + 0;
          }
          /**benfitUptoAge**/
          if ($scope.calcData.benfitUptoAge != undefined) {
            childAdvantageQuoteData.UptoAge = "" + $scope.calcData.benfitUptoAge;
          } else {
            childAdvantageQuoteData.UptoAge = null;
          }
          /**PayType - (Limited/Regular) if applicable **/
          childAdvantageQuoteData.PayType = $scope.calcData.benfitType;
          /**BenefitType - (Endowment/Money Back)(Fixed Monthly Payout/Lumpsum + Increasing Payout) if applicable **/
          childAdvantageQuoteData.BenefitType = $scope.calcData.maturityOption;
          /**PremiumPaymentTerm**/
          childAdvantageQuoteData.PremiumPaymentTerm = "" + $scope.calcData.ppt;
          /**Policy Term**/
          childAdvantageQuoteData.PolicyTerm = "" + $scope.calcData.pt;
          /**SumAssured/Life Cover**/
          childAdvantageQuoteData.SumAssured = $scope.outputData.sumAssured;
          childAdvantageQuoteData.GuaranteedIncomePeriod = null;
          childAdvantageQuoteData.MaturityPayoutPeriod = null;
          childAdvantageQuoteData.MaturityPayoutFrequency = null;
          childAdvantageQuoteData.FlexiBenefitPeriod = null;
          childAdvantageQuoteData.AnnualBasePremium = $scope.outputData.premium.totalAnnualPremium;
          childAdvantageQuoteData.Mode = "" + $scope.calcData.premiumMode;
          childAdvantageQuoteData.ModalFactor = $scope.outputData.premium.modalFactor;
          childAdvantageQuoteData.ModalPremium = $scope.outputData.premium.modalPremium;
          /**NSAPForLA**/
          if ($scope.calcData.NSAPForLA !== undefined) {
            childAdvantageQuoteData.IsNSAP = "" + $scope.calcData.NSAPForLA;
          } else {
            childAdvantageQuoteData.IsNSAP = "" + 0;
          }
          childAdvantageQuoteData.ServiceTax = $scope.outputData.premium.serviceForFirstYearTax;
          childAdvantageQuoteData.PremiumPayable = $scope.outputData.premium.totalModalPremiumWithTaxForFirstYear;
          childAdvantageQuoteData.IsInYourPresence = null;
          childAdvantageQuoteData.EstimatedReturnRate = null;

          /**Default value is 0, For email functionality**/
          if (isFromEmail) {
            childAdvantageQuoteData.IsEmail = "" + 1;
            childAdvantageQuoteData.ToRecipients = emailData.To;
            childAdvantageQuoteData.CcRecipients = emailData.Cc;
          } else {
            childAdvantageQuoteData.IsEmail = "" + 0;
            childAdvantageQuoteData.ToRecipients = null;
            childAdvantageQuoteData.CcRecipients = null;
          }

          /**create JSON for IRDA **/
          var selectedRiderIds = [];
          childAdvantageQuoteData.Json = createChildAdvantageIRDAQuotePDFJson(biRefNo.BiQuoteNo);
          $log.debug("childAdvantageQuoteData...........", childAdvantageQuoteData);
          quoteCustomJson.quoteData.push({
            ReferenceSystemTypeId: childAdvantageQuoteData.ReferenceSystemTypeId,
            FkProductId: childAdvantageQuoteData.FkProductId,
            ProductPlanCode: childAdvantageQuoteData.ProductPlanCode,
            FkAgentCode: childAdvantageQuoteData.FkAgentCode,
            BuyingFor: childAdvantageQuoteData.BuyingFor,
            LAFirstName: childAdvantageQuoteData.LAFirstName,
            LALastName: childAdvantageQuoteData.LALastName,
            LAGender: childAdvantageQuoteData.LAGender,
            LADOB: childAdvantageQuoteData.LADOB,
            ProposerFirstName: childAdvantageQuoteData.ProposerFirstName,
            ProposerLastName: childAdvantageQuoteData.ProposerLastName,
            ProposerGender: childAdvantageQuoteData.ProposerGender,
            ProposerDOB: childAdvantageQuoteData.ProposerDOB,
            IsSmoker: childAdvantageQuoteData.IsSmoker,
            UptoAge: childAdvantageQuoteData.UptoAge,
            PayType: childAdvantageQuoteData.PayType,
            BenefitType: childAdvantageQuoteData.BenefitType,
            PremiumPaymentTerm: childAdvantageQuoteData.PremiumPaymentTerm,
            PolicyTerm: childAdvantageQuoteData.PolicyTerm,
            SumAssured: childAdvantageQuoteData.SumAssured,
            GuaranteedIncomePeriod: childAdvantageQuoteData.GuaranteedIncomePeriod,
            MaturityPayoutPeriod: childAdvantageQuoteData.MaturityPayoutPeriod,
            MaturityPayoutFrequency: childAdvantageQuoteData.MaturityPayoutFrequency,
            FlexiBenefitPeriod: childAdvantageQuoteData.FlexiBenefitPeriod,
            AnnualBasePremium: childAdvantageQuoteData.AnnualBasePremium,
            Mode: childAdvantageQuoteData.Mode,
            ModalFactor: childAdvantageQuoteData.ModalFactor,
            ModalPremium: childAdvantageQuoteData.ModalPremium,
            IsNSAP: childAdvantageQuoteData.IsNSAP,
            ServiceTax: childAdvantageQuoteData.ServiceTax,
            PremiumPayable: childAdvantageQuoteData.PremiumPayable,
            IsInYourPresence: childAdvantageQuoteData.IsInYourPresence,
            EstimatedReturnRate: childAdvantageQuoteData.EstimatedReturnRate
          });

          if ($scope.hcData && $scope.riders.isHCActive) {
            /*if selected rider id is hospicash - push into selectedRiderId*/
            selectedRiderIds.push(hospiCashRiderId);
            /*added hospi cash rider data in custom code json*/
            quoteCustomJson.hospiRiderData.push({
              FkAgentCode: "" + userData.agentId,
              FkRiderId: "" + hospiCashRiderId,
              RiderPlanCode: $scope.hcData.prodCode,
              ReferenceSystemTypeId: "1",
              Term: "" + $scope.calcData.hospiCashTerm,
              SumAssured: $scope.calcData.sumAssuredForRiders,
              IsNSAPProposer: "" + 0,
              ModalPremium: $scope.hcData.modalHospiCashPremium,
              ServiceTaxPayable: $scope.hcData.serviceTaxForModalFirstYear,
              PremiumPayable: $scope.hcData.totalModalPremiumWithTaxForFirstYear
            });
          }
          if ($scope.adbData && $scope.riders.isADBActive) {
            /*if selected rider id is hospicash - push into selectedRiderId*/
            selectedRiderIds.push(adbRiderId);
            /*added hospi cash rider data in custom code json*/
            quoteCustomJson.adbRiderData.push({
              FkAgentCode: "" + userData.agentId,
              FkRiderId: "" + adbRiderId,
              RiderPlanCode: $scope.adbData.prodCode,
              ReferenceSystemTypeId: "1",
              Term: "" + $scope.calcData.pt,
              SumAssured: $scope.calcData.sumAssuredForADBRiders,
              IsNSAPProposer: "" + 0,
              ModalPremium: $scope.adbData.modalAdbRiderPremium,
              ServiceTaxPayable: $scope.adbData.serviceTaxForModalFirstYear,
              PremiumPayable: $scope.adbData.totalModalPremiumWithTaxForFirstYear
            });
          }
          if ($scope.pwrData1 && $scope.riders.isPWRActive) {
            /*if selected rider id is hospicash - push into selectedRiderId*/
            selectedRiderIds.push(pwrRiderId);
            /*added hospi cash rider data in custom code json*/
            quoteCustomJson.pwRiderIData.push({
              FkAgentCode: "" + userData.agentId,
              FkRiderId: "" + pwrRiderId,
              RiderPlanCode: $scope.pwrData1.prodCode,
              ReferenceSystemTypeId: "1",
              Term: "" + $scope.calcData.pt,
              SumAssured: $scope.outputData.sumAssured,
              IsNSAPProposer: "" + 0,
              ModalPremium: $scope.pwrData1.modalPWRRiderPremium,
              ServiceTaxPayable: $scope.pwrData1.serviceTaxForModalFirstYear,
              PremiumPayable: $scope.pwrData1.totalModalPremiumWithTaxForFirstYear
            });
          }
          if ($scope.pwrData2 && $scope.riders.isPWRActive) {
            /*if selected rider id is hospicash - push into selectedRiderId*/
            selectedRiderIds.push(pwrRiderCiId);
            /*added hospi cash rider data in custom code json*/
            quoteCustomJson.pwRiderIIData.push({
              FkAgentCode: "" + userData.agentId,
              FkRiderId: "" + pwrRiderCiId,
              RiderPlanCode: $scope.pwrData2.prodCode,
              ReferenceSystemTypeId: "1",
              Term: "" + $scope.calcData.pt,
              SumAssured: $scope.outputData.sumAssured,
              IsNSAPProposer: "" + 0,
              ModalPremium: $scope.pwrData2.modalPWRRiderPremium,
              ServiceTaxPayable: $scope.pwrData2.serviceTaxForModalFirstYear,
              PremiumPayable: $scope.pwrData2.totalModalPremiumWithTaxForFirstYear
            });
          }

          /**if user selected any rider riders data needs to save in DB**/
          if (selectedRiderIds.length > 0) {
            childAdvantageRidersData = [
              []
            ];
            childAdvantageRidersData = $scope.createRidersData(userData, currentData, biRefNo.BiQuoteNo, selectedRiderIds);
            $log.debug("*******childAdvantageRidersData*******", childAdvantageRidersData);
          }
          /*if same quote no need to save the data again - method will check is Quote save required*/
          quoteProposalNosDataService.isQuoteDataInsertRequired(JSON.stringify(quoteCustomJson)).
          then(function(isRequired) {
            if (isRequired) {
              quoteProposalNosDataService.updateBIQuoteNumberUsedStatus(biRefNo.BiQuoteNo).then(function() {
                $log.debug("########childAdvantageQuoteData########", childAdvantageQuoteData);
                quoteProposalNosDataService.insertQuoteData(childAdvantageQuoteData);
                if ($scope.hcData || $scope.adbData || $scope.pwrData1 || $scope.pwrData2) {
                  quoteProposalNosDataService.insertRidersData(childAdvantageRidersData);
                }
              });
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  $scope.hidesendEmailPopup();
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, childAdvantageQuoteData.Json,childAdvantageQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,childAdvantageQuoteData.Json,childAdvantageQuoteData.FkProductId);
                }
              }
            } else {
              $log.debug("*******Same Quote Data already available*******");
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, childAdvantageQuoteData.Json,childAdvantageQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,childAdvantageQuoteData.Json,childAdvantageQuoteData.FkProductId);
                }
                $scope.hidesendEmailPopup();
              }
            }
          });
        });
    };

    $scope.createRidersData = function(userData, currentData, biQuoteNo, selectedRiderIds) {
      var flexiSaveRidersData = [
        []
      ];
      for (var i = 0; i < selectedRiderIds.length; i++) {
        if (selectedRiderIds[i] == adbRiderId && $scope.riders.isADBActive) {
          var adbArray = {};
          /*user selected Hospicash Rider*/
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
          flexiSaveRidersData[i] = adbArray;
        }
        if (selectedRiderIds[i] == hospiCashRiderId && $scope.riders.isHCActive) {
          var hospiArray = {};
          //*user selected Hospicash Rider*/
          hospiArray.FkAgentCode = "" + userData.agentId;
          hospiArray.FkQuotationId = biQuoteNo;
          hospiArray.FkRiderId = "" + selectedRiderIds[i];
          hospiArray.RiderPlanCode = $scope.hcData.prodCode;
          /** 1 = Eapp, 2 = OLS **/
          hospiArray.ReferenceSystemTypeId = "1";
          hospiArray.Term = "" + $scope.calcData.hospiCashTerm;
          hospiArray.SumAssured = $scope.calcData.sumAssuredForRiders;
          hospiArray.IsNSAPProposer = "" + 0;
          hospiArray.ModalPremium = $scope.hcData.annualHospiCashPremium;
          hospiArray.ServiceTaxPayable = $scope.hcData.serviceTaxFactorForFirstAndSecondYear;
          hospiArray.PremiumPayable = $scope.hcData.totalPremium;
          flexiSaveRidersData[i] = hospiArray;
        }
        if (selectedRiderIds[i] == pwrRiderCiId && $scope.riders.isPWRActive && $scope.pwrData2) {
          var pwr2Array = {};
          /*user selected Hospicash Rider*/
          pwr2Array.FkAgentCode = "" + userData.agentId;
          pwr2Array.FkQuotationId = biQuoteNo;
          pwr2Array.FkRiderId = "" + selectedRiderIds[i];
          pwr2Array.RiderPlanCode = $scope.pwrData2.prodCode;
          /** 1 = Eapp, 2 = OLS **/
          pwr2Array.ReferenceSystemTypeId = "1";
          pwr2Array.Term = "" + $scope.calcData.pt;
          pwr2Array.SumAssured = $scope.calcData.sumAssured;
          pwr2Array.IsNSAPProposer = "" + 0;
          pwr2Array.ModalPremium = $scope.calcData.modalPWRIIRiderPremium;
          pwr2Array.ServiceTaxPayable = $scope.calcData.serviceTaxPWRIIForModalFirstYear;
          pwr2Array.PremiumPayable = $scope.calcData.totalModalPremiumPWRIIWithTaxForFirstYear;
          flexiSaveRidersData[i] = pwr2Array;
        }
        if (selectedRiderIds[i] == pwrRiderCiId && $scope.riders.isPWRActive && $scope.pwrData1) {
          var pwr1Array = {};
          /*user selected Hospicash Rider*/
          pwr1Array.FkAgentCode = "" + userData.agentId;
          pwr1Array.FkQuotationId = biQuoteNo;
          pwr1Array.FkRiderId = "" + selectedRiderIds[i];
          pwr1Array.RiderPlanCode = $scope.pwrData2.prodCode;
          /** 1 = Eapp, 2 = OLS **/
          pwr1Array.ReferenceSystemTypeId = "1";
          pwr1Array.Term = "" + $scope.calcData.pt;
          pwr1Array.SumAssured = $scope.calcData.sumAssured;
          pwr1Array.IsNSAPProposer = "" + 0;
          pwr1Array.ModalPremium = $scope.calcData.modalPWRIRiderPremium;
          pwr1Array.ServiceTaxPayable = $scope.calcData.serviceTaxPWRIForModalFirstYear;
          pwr1Array.PremiumPayable = $scope.calcData.totalModalPremiumPWRIWithTaxForFirstYear;
          flexiSaveRidersData[i] = pwr1Array;
        }
      }
      return flexiSaveRidersData;
    };

    /**/
    $scope.updateRiderSA = function(data) {
      $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
    };
    $scope.getHCRTerm = function(ppt, term) {
      return Number(ppt) >= Number(term);
    };

    /*** Age calculation from DOB ***/
    $scope.getAge = function(datestring) {
      var cDate = new Date();
      var cYear = cDate.getFullYear();
      var cMonth = cDate.getMonth();
      var cDay = cDate.getDate();
      var age = cYear - datestring.getFullYear();

      if (cMonth < (datestring.getMonth() - 1)) {
        age--;
      }
      if (((datestring.getMonth() - 1) == cMonth) && (cDay < datestring.getDate())) {
        age--;
      }
      return age;
    };

    function createChildAdvantageIRDAQuotePDFJson(BiQuoteNo) {
      $log.debug("CalcData",$scope.calcData);
      var userData = getSetCommonDataService.getCommonData();
      var currentData = getSetCommonDataService.getCurrentProdData();

      var selectedRiderData={};
      var childAdvantageIRDAQuotePDFJson = {"PDF":{}};
      childAdvantageIRDAQuotePDFJson.PDF.quoteNo = BiQuoteNo;
      childAdvantageIRDAQuotePDFJson.PDF.proposalNo = "";
      childAdvantageIRDAQuotePDFJson.PDF.policyNo = "";
      childAdvantageIRDAQuotePDFJson.PDF.uin = currentData.prodUIN;
      childAdvantageIRDAQuotePDFJson.PDF.productCode = $scope.calcData.premium.prodCode;
      childAdvantageIRDAQuotePDFJson.PDF.riderCode = [];
      childAdvantageIRDAQuotePDFJson.PDF.illustrationGeneratedBy = userData.channelName;
      childAdvantageIRDAQuotePDFJson.PDF.illustrationDate = utilityService.getDisplayDate(new Date(), 'dd-MM-yyyy');

      childAdvantageIRDAQuotePDFJson.PDF.lifeAssuredDetail = {
        name: $scope.data.liFirstName + " " + $scope.data.liLastName,
        gender: $scope.data.laGender==0?"Male":"Female",
        age: $scope.getAge($scope.data.labfAge),
      };
      childAdvantageIRDAQuotePDFJson.PDF.proposerDetail = {};
      if ($scope.data.BuyingFor!="Self") {
        childAdvantageIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.propFirstName + " " + $scope.data.propLastName;
        childAdvantageIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.proposerGender==0?"Male":"Female";
        childAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.proposerAge);
      } else {
        childAdvantageIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.liFirstName + " " + $scope.data.liLastName;
        childAdvantageIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.laGender==0?"Male":"Female";
        childAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.labfAge);
      }
      childAdvantageIRDAQuotePDFJson.PDF.benefitAndPremiumDetail = {
        planName: "" + currentData.prodLbl,
        policyTerm: "" + $scope.outputData.pt,
        premiumPaymentTerm: "" + $scope.inputData.ppt,
        premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
        benefitUptoAge:childAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
        sumAssured: $scope.calcData.sumAssured,
        annualPremium: $scope.calcData.basePremium,
        modalPremium: $scope.calcData.modalPremium,
        nsapExtra:$scope.calcData.premium.modalNSAPPremium,
        serviceTax1stYear: $scope.calcData.premium.serviceForAnnualFirstYearTax,
        serviceTax2ndYear:$scope.calcData.premium.serviceForAnnualSecondYearTax,
        rider: [],
        totalPremium1stYear: $scope.calcData.premium.totalAnnualPremiumWithTaxForFirstYear,
        totalPremium2ndYear:$scope.calcData.premium.totalAnnualPremiumWithTaxForSecondYear

      };
      if ($scope.hcData && $scope.riders.isHCActive) {
        childAdvantageIRDAQuotePDFJson.PDF.riderCode.push($scope.hcData.prodCode);
        childAdvantageIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: hospiCashRiderId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.ppt,
          premiumPaymentTerm: "" + $scope.outputData.riderPpt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          sumAssured: $scope.calcData.sumAssuredForRiders,
          benefitUptoAge: childAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:"" + 0,
          annualPremium: $scope.calcData.annualHospiCashPremium,
          modalPremium:  $scope.hcData.modalHospiCashPremium,
          serviceTax1stYear: $scope.hcData.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.hcData.serviceTaxForModalFirstYear
        });
      }

      if ($scope.adbData && $scope.riders.isADBActive) {
        childAdvantageIRDAQuotePDFJson.PDF.riderCode.push($scope.adbData.prodCode);
        childAdvantageIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: adbRiderId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          sumAssured: $scope.calcData.sumAssuredForADBRiders,
          benefitUptoAge: childAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:"" + 0,
          annualPremium:  $scope.calcData.annualAdbRiderPremium ,
          modalPremium:$scope.adbData.modalAdbRiderPremium,
          serviceTax1stYear:$scope.adbData.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.adbData.serviceTaxForModalFirstYear

        });
      }
      if ($scope.pwrData1 && $scope.riders.isPWRActive) {
        childAdvantageIRDAQuotePDFJson.PDF.riderCode.push($scope.pwrData1.prodCode);
        childAdvantageIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: pwrRiderId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          sumAssured: $scope.calcData.sumAssuredForRiders,
          benefitUptoAge: childAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:$scope.calcData.riderPWRIIextraPremiumDueToNSAPLA,
          annualPremium: $scope.calcData.annualPWRIRiderPremium,
          modalPremium: $scope.pwrData1.modalPWRRiderPremium,
          serviceTax1stYear: $scope.pwrData1.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.pwrData1.serviceTaxForModalFirstYear
        });
      }
      if ($scope.pwrData2 && $scope.riders.isPWRActive) {
        childAdvantageIRDAQuotePDFJson.PDF.riderCode.push($scope.pwrData2.prodCode);
        childAdvantageIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: pwrRiderCiId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          sumAssured: $scope.calcData.sumAssuredForRiders,
          benefitUptoAge: childAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:$scope.calcData.riderPWRIIextraPremiumDueToNSAPLA,
          annualPremium: $scope.calcData.annualPWRIRiderPremium,
          modalPremium: $scope.pwrData2.modalPWRRiderPremium,
          serviceTax1stYear: $scope.pwrData2.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.pwrData2.serviceTaxForModalFirstYear
        });
      }

      $log.debug("benefitIllustration",$scope.data.biCalculation);
      childAdvantageIRDAQuotePDFJson.PDF.benefitIllustration =$scope.data.biCalculation;
      //return JSON.stringify(childAdvantageIRDAQuotePDFJson);
      return childAdvantageIRDAQuotePDFJson;

    }

    $scope.openPopupForChangeDetails = function() {
      $scope.showPopupToGoForLAAndProposerDetails = true;
    };

    $scope.closePopupForChangeDetails = function() {
      $scope.showPopupToGoForLAAndProposerDetails = false;
    };

    $scope.goToLAAndProposer = function() {
      $state.go("app.childAdvantage-LAAndProposer");
    };

    $scope.showPopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = true;
    };

    $scope.closePopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = false;
    };

    $scope.goToHomePage = function() {
      setAnimate($ionicHistory);
      $state.go('app.childAdvantage-home');
    };

    $scope.showHideChart = false;
    $scope.toggleChart = function() {
      $scope.showHideChart = !$scope.showHideChart;
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
