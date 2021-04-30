eAppModule.controller('aajeevansampattiController', ['$log',
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
  'commonFormulaSvc',
  'asValidationService',
  'calculatePremiumSvc',
  'policyDataFromDBSvc',
  'riderValidationService',
  'pwrRiderDataFromUserSvc',
  'calculatePwrRiderPremiumSvc',
  'calculateAdbRiderPremiumSvc',
  'hospiCashRiderDataFromUserSvc',
  'calculatehospiCashRiderPremiumSvc',
  'tHValidationService',
  'getSetCommonDataService',
  'quoteProposalNosDataService',
  'utilityService',
  '$filter',
  'sendBIEmailService',
  function($log, $scope, $state, $http, $rootScope, $ionicHistory, $ionicPlatform, $cordovaDatePicker, $ionicNavBarDelegate,$ionicLoading, eAppServices, commonFormulaSvc, asValidationService, calculatePremiumSvc, policyDataFromDBSvc, riderValidationService, pwrRiderDataFromUserSvc, calculatePwrRiderPremiumSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, tHValidationService, getSetCommonDataService, quoteProposalNosDataService, utilityService, $filter,sendBIEmailService) {
    'use strict';
    var vm = this;
    var hospiCashRiderId = 5,
      adbRiderId = 4,
      prodId = 1,
      channelId = 1,
      pwrRiderId = 6,
      pwrRiderCiId = 7,
      pwrOption = 1;

    $scope.inputData = {};
    $scope.outputData = {};
    $scope.calcData = {};
    $scope.dbErrors = [];
    $scope.prodBaseCode = "";

    $scope.title = "Aajeevan Sampatti";
    $scope.data = {};
    $scope.data.BuyingFor = 'Self';
    $scope.data.laGender = 0;
    $scope.data.liFirstName = "";
    $scope.data.liLastName = "";
    $scope.data.proposerGender = 0;
    $scope.data.propFirstName = "";
    $scope.data.propLastName = "";
    $scope.showDbErrors = false;
    $scope.validationMessage = {};
    $scope.premiumWithTaxes = false;
    $scope.showPopupToGoForLAAndProposerDetails = false;
    var percent = 8;

    //** Back Button Funtionality **//
    $scope.goBack = function() {
      if ($state.current.name == 'app.aajeevansampatti-Home') {
        $state.go("app.eApp");
      } else if ($state.current.name == 'app.aajeevansampatti-LAAndProposer') {
        $scope.data = eAppServices.getBuyForDetails();
        $state.go("app.aajeevansampatti-Home");
      } else if ($state.current.name == 'app.aajeevansampatti-estimated') {
        $state.go("app.aajeevansampatti-LAAndProposer");
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
    //** Back Button Funtionality **//

    /*Get validation messgae through json file.*/
    $http.get('js/eApp/aajeevansampatti/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
    });
    /*Get validation messgae through json file.*/

    //** Get Generic Options for Form Elements **//
    var params = {
      "ui_gender": true,
      "ui_age": true,
      "ui_smoke": false,
      "ui_nsap": true,
      "ui_payType": false,
      // "ui_termExtra": {
      //   "label": "Flexi Benifit Period",
      //   "default": "20-30"
      // },
      // "ui_pmode"          : true,
      "ui_sumAssured": false,
      "ui_anualPreminum": true,
      "ui_modelPreminum": true,
      "switch": false
    };

    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "UPTOAGE", "BUYPOLFOR", "PMODE", "PPT"], ["MPFACTOR"])
      .then(function(result) {
        $scope.params = params;
        $scope.formData = result[0];
        $scope.formDataCalc = {
          //"PT": JSON.parse(result[1].PT),
          "MPFACTOR": JSON.parse(result[1].MPFACTOR) /*,"PREPAYOPN":JSON.parse(result[1].PREPAYOPN)*/
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
          $state.go('app.aajeevansampatti-LAAndProposer');
        }
      });
    //** Get Data Variables **//

    //** Handle Form Submit for LA Proposer Details Form **//
    $scope.ProceedForLAAndProposerDetails = function(data) {
      $scope.inputData.laName = data.liFirstName + " " + data.liLastName;
      $scope.inputData.laAgeDays = $scope.getAge(data.labfAge, 'days'); /** Calculate age in days **/
      $scope.inputData.laAge = $scope.getAge(data.labfAge);
      $scope.inputData.laGender = parseInt(data.laGender);
      $scope.inputData.annualPremium = 50000;
      $scope.inputData.isSelf = (data.BuyingFor == "Self") ? (true) : (false);
      $scope.inputData.premiumMode = 2; //default Value to select
      $scope.inputData.ppt = 15;
      $scope.inputData.payType = 'REGULAR';
      $scope.inputData.benefitUptoAge = 100;
      $scope.inputData.pt = ($scope.inputData.benefitUptoAge - $scope.inputData.laAge);

      if (data.BuyingFor != "Self") {
        $scope.inputData.proposerName = data.propFirstName + " " + data.propLastName;
        $scope.inputData.proposerGender = data.proposerGender;
        $scope.inputData.proposerAge = $scope.getAge(data.proposerAge);
      }
      else if (data.BuyingFor == "Self"){
        $scope.inputData.proposerName = data.liFirstName + " " + data.liLastName;
        $scope.inputData.proposerGender = data.laGender;
        $scope.inputData.proposerAge = $scope.getAge(data.labfAge);
      }

      eAppServices.setInputDetails($scope.inputData);
      eAppServices.setBuyForDetails(data);
      $state.go('app.aajeevansampatti-Home');
    };
    //** Handle Form Submit for LA Proposer Details Form **//

    /*Riders Calculation*/
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
            $scope.dbError = "";
            $scope.showDbErrors = false;
            calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospiCashRiderId, prodId, channelId, calcData.base)
              .then(function(result) {
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
          policyDataFromDBSvc.getProdCodeAS(prodId, channelId, $scope.outputData.benfitsUptoAgeSelected, $scope.outputData.ppt)
            .then(function(prodCode) {
              if (!$scope.riders.PWRI && !$scope.riders.PWRII) {
                $scope.calcData.annualPWRIRiderPremium = 0;
                $scope.calcData.modalPWRIRiderPremium = 0;
                $scope.calcData.serviceTaxPWRIForAnnualFirstYear = 0;
                $scope.calcData.serviceTaxPWRIForModalFirstYear = 0;
                $scope.calcData.totalAnnualPremiumPWRIWithTaxForFirstYear = 0;
                $scope.calcData.totalModalPremiumPWRIWithTaxForFirstYear = 0;
                $scope.calcData.annualPWRIIRiderPremium = 0;
                $scope.calcData.modalPWRIIRiderPremium = 0;
                $scope.calcData.serviceTaxPWRIIForAnnualFirstYear = 0;
                $scope.calcData.serviceTaxPWRIIForModalFirstYear = 0;
                $scope.calcData.totalAnnualPremiumPWRIIWithTaxForFirstYear = 0;
                $scope.calcData.totalModalPremiumPWRIIWithTaxForFirstYear = 0;
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
                            $scope.pwrData2 = "";
                            $scope.pwrOutputOption1 = false;
                            $scope.showDbErrors = true;
                            $scope.riders.dbErrorPWR.push({
                              "Name": "PREM",
                              "ErrorMessage": "30% Base of premium is less than rider!"
                            });
                          } else {
                            $log.debug("**************************PWRII :", result);
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
                            $scope.pwrData1 = "";
                            $scope.pwrOutputOption2 = false;
                            $scope.showDbErrors = true;
                            $scope.riders.dbErrorPWR.push({
                              "Name": "PREM",
                              "ErrorMessage": "30% Base of premium is less than rider!"
                            });
                          } else {
                            $log.debug("**************************PWRI :", result);
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
          $scope.pwrData1 = "";
          $scope.pwrData2 = "";
          $scope.riders.isPWRActive = false;
          $scope.riders.PWRI = false;
          $scope.riders.PWRII = true;
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
        } else if (calcData.sumAssuredForADBRiders > 0 && calcData.pt > 0) {
          policyDataFromDBSvc.getProdCodeAS(prodId, channelId, $scope.outputData.benfitsUptoAgeSelected, $scope.outputData.ppt)
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
    /*Riders Calculation*/

    /*Calculation*/
    $scope.calculate = function(inputData) {
      //$scope.outputData.laAge = 195;
      $scope.outputData.ppt = inputData.ppt;
      $scope.outputData.premiumMode = inputData.premiumMode;
      $scope.outputData.basePremium = parseInt(inputData.annualPremium);
      $scope.outputData.pt = inputData.pt;
      $scope.outputData.modalPremium = inputData.modalPremium;
      $scope.outputData.NSAPForLA = (inputData.NSAPForLA !== undefined) ? (inputData.NSAPForLA) : (false);
      $scope.outputData.NSAPForPrposer = false;
      $scope.outputData.benfitUptoAge = inputData.benefitUptoAge;
      $scope.outputData.benfitsUptoAgeSelected = inputData.benfitUptoAge;

      /*asValidationService.validateProduct(prodId, channelId, $scope.outputData)
      .then(function(messages){*/ /*** Need to work on validations ***/
        if(/*messages.length === 0*/ true){
          $scope.showDbErrors = false;

          calculatePremiumSvc.calculateTotalPremium(prodId, channelId, $scope.outputData)
          .then(function(totalBasePremiumVals){
            $log.debug("------------------------------totalBasePremiumVals", totalBasePremiumVals);
            $scope.outputData.premium = totalBasePremiumVals;
            $scope.outputData.basePremium = totalBasePremiumVals.basePremium;
            $scope.outputData.modalFactor = totalBasePremiumVals.modalFactor;
            $scope.outputData.modalNsapPremium = totalBasePremiumVals.modalNsapPremium;
            $scope.outputData.modalPremium = totalBasePremiumVals.modalPremium;
            $scope.outputData.nsapPremium = totalBasePremiumVals.nsapPremium;
            $scope.outputData.guranteedPay = totalBasePremiumVals.guranteedPay;
            $scope.outputData.prodCode = totalBasePremiumVals.prodCode;
            $scope.outputData.serviceTaxFactorForFirstYear = totalBasePremiumVals.serviceTaxFactorForFirstYear;
            $scope.outputData.serviceTaxFactorForSecondYear = totalBasePremiumVals.serviceTaxFactorForSecondYear;
            $scope.outputData.sumAssured = totalBasePremiumVals.sumAssured;
            $scope.outputData.sumAssuredForADBRiders = parseInt(totalBasePremiumVals.sumAssured);
            $scope.outputData.totalAnnualPremium = totalBasePremiumVals.totalAnnualPremium;
            $scope.outputData.totalAnnualPremiumWithTaxForFirstYear = totalBasePremiumVals.serviceForAnnualFirstYearTax;
            $scope.outputData.totalAnnualPremiumWithTaxForSecondYear = totalBasePremiumVals.serviceForAnnualSecondYearTax;
            $scope.outputData.totalModalPremium = totalBasePremiumVals.totalModalPremium;
            $scope.outputData.totalModalPremiumWithTaxForFirstYear = totalBasePremiumVals.totalModalPremiumWithServiceTaxForFirstYear;
            $scope.outputData.totalModalPremiumWithTaxForSecondYear = totalBasePremiumVals.totalModalPremiumWithServiceTaxForSecondYear;

            $scope.outputData.fsBasePremiumOutput = true;

            var BI = totalBasePremiumVals.bIValue;
            BI.then(function(res) {
              $log.debug(":Bi:----------", res);
              console.log("Bi:-----------",res);
              $scope.outputData.bi = res;
              if (res.survivalBenfitAndMaturity.length > 0 && res.nonGuranteedCashBonus4.length > 0 && res.nonGuranteedCashBonus8.length > 0) {
                var sumAssuredPaidAtMaturity = res.survivalBenfitAndMaturity[res.survivalBenfitAndMaturity.length - 1];
                var nGMB4 = 0;
                var nGMB8 = 0;
                var sumGAnnualBenefit = 0;
                for(var b=0; b < res.survivalBenfitAndMaturity.length; b++){
                  sumGAnnualBenefit += (typeof res.survivalBenfitAndMaturity[b] != "string") ? (parseFloat(res.survivalBenfitAndMaturity[b])) : (0);
                }
                for (var s = 0; s < res.nonGuranteedCashBonus4.length; s++) {
                  nGMB4 += (typeof res.nonGuranteedCashBonus4[s] != "string") ? (parseFloat(res.nonGuranteedCashBonus4[s])) : (0);
                }
                for (var t = 0; t < res.nonGuranteedCashBonus8.length; t++) {
                  nGMB8 += (typeof res.nonGuranteedCashBonus8[t] != "string") ? (parseFloat(res.nonGuranteedCashBonus8[t])) : (0);
                }

                $scope.outputData.precent = 8;
                $scope.outputData.pwrRiderOption = 1;
                $scope.outputData.p4 = {
                  "sumGuranteedAnnualBenefit": commonFormulaSvc.round(sumGAnnualBenefit, 2),
                  "nonGuaranteedMaturityBenefit": commonFormulaSvc.round(nGMB4, 2),
                  "sumAssuredPaidAtMaturity": commonFormulaSvc.round(sumAssuredPaidAtMaturity, 2)
                };
                $scope.outputData.p8 = {
                  "sumGuranteedAnnualBenefit": commonFormulaSvc.round(sumGAnnualBenefit, 2),
                  "nonGuaranteedMaturityBenefit": commonFormulaSvc.round(nGMB8, 2),
                  "sumAssuredPaidAtMaturity": commonFormulaSvc.round(sumAssuredPaidAtMaturity, 2)
                };
              }

              /**Chart Code **/
              $scope.gsb = $scope.outputData.bi.survivalBenfitAndMaturity;
              $scope.policyYear = $scope.outputData.bi.endOfPolicyAge;

              $scope.outputData.finalArray = [];
              for (var i = 0; i < $scope.gsb.length; i++) {
                if (i == $scope.gsb.length - 1) {
                  var x = {
                    key: $scope.policyYear[i],
                    value: $scope.gsb[$scope.policyYear[i] - 1],
                    height: 150,
                    checked: false
                  };
                } else {
                  var x = {
                    key: $scope.policyYear[i],
                    value: $scope.gsb[$scope.policyYear[i] - 1],
                    height: 60,
                    checked: false
                  };
                }
                if (i == 14) {
                  x.checked = true;
                  $scope.data.selected = $scope.gsb[$scope.policyYear[i] - 1];
                }
                $scope.outputData.finalArray.push(x);
              }
              /**Chart Code**/


              eAppServices.setOutputDetails($scope.outputData);
              eAppServices.setCalcDetails($scope.outputData);
            });


          });
        }
        else{
          $scope.showDbErrors = true;
          for (var e = 0; e < messages.length; e++) {
            $scope.dbErrors.push(messages[e]);
          }
        }
      /*});*/

      $state.go('app.aajeevansampatti-estimated');
    };
    /*Calculation*/

    $scope.updateRiderSA = function(data) {
      $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
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

    /*** Age calculation from DOB ***/
    $scope.getAge = function(datestring, days) {
      var cDate = new Date();
      var cYear = cDate.getFullYear();
      var cMonth = cDate.getMonth();
      var cDay = cDate.getDate();
      var age = cYear - datestring.getFullYear();

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
        return age;
      }
    };
    /*** Age calculation from DOB ***/

    $scope.openPopupForChangeDetails = function() {
      $scope.showPopupToGoForLAAndProposerDetails = true;
    };

    $scope.closePopupForChangeDetails = function() {
      $scope.showPopupToGoForLAAndProposerDetails = false;
    };

    $scope.getHCRTerm = function(ppt,term){
      return Number(ppt) >= Number(term);
    };

    $scope.goToLAAndProposer = function() {
      $state.go("app.aajeevansampatti-LAAndProposer");
    };

    $scope.showPopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = true;
    };

    $scope.closePopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = false;
    };

    /*Toggle Chart*/
    $scope.showHideChart = false;
    $scope.toggleChart = function() {
      $scope.showHideChart = !$scope.showHideChart;
    };

    $scope.goToHomePage = function() {
      $state.go('app.aajeevansampatti-Home');
    };

    $scope.$watch('inputData.benefitUptoAge', function() {
      $scope.inputData.pt = $scope.inputData.benefitUptoAge - $scope.inputData.laAge;
    }, true);

    /* Save Quote */
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
          var aajeevanSampattiQuoteData = {};
          var aajeevanSampattiRidersData = [[]];
          var quoteCustomJson = {
            quoteData: [],
            adbRiderData: [],
            hospiRiderData: [],
            pwRiderIData: [],
            pwRiderIIData: []
          };
          $scope.data.guaranteedIncome=$scope.inputData.monthlyIncomePeriod;
          /**1.BI Ref No**/
          aajeevanSampattiQuoteData.PkQuotationId = biRefNo.BiQuoteNo;
          /**2 - >  1 = Eapp, 2 = OLS **/
          aajeevanSampattiQuoteData.ReferenceSystemTypeId = "1";
          /**3 - > Selected Product ID**/
          aajeevanSampattiQuoteData.FkProductId = currentData.prodId;
          /**4 - > Selected Product Plan Code**/
          aajeevanSampattiQuoteData.ProductPlanCode = $scope.outputData.prodCode;
          /**5-> Logged in Agent Id**/
          aajeevanSampattiQuoteData.FkAgentCode = "" + userData.agentId;
          /**Buying For Screen**/
          /**6 -> Buying For Screen**/
          aajeevanSampattiQuoteData.BuyingFor = $scope.data.BuyingFor;
          /**7 -> liFirstName**/
          aajeevanSampattiQuoteData.LAFirstName = $scope.data.liFirstName;
          /**8 -> liLastName**/
          aajeevanSampattiQuoteData.LALastName = $scope.data.liLastName;
          /**9 -> LAGender**/
          aajeevanSampattiQuoteData.LAGender = "" + (($scope.data.laGender == 0) ? "Male" : "Female");
          /**10 -> LADOB**/
          aajeevanSampattiQuoteData.LADOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          /**11 -> propFirstName**/
          /**12 -> propLastName**/
          /**13 -> proposerGender**/
          /**14 -> ProposerDOB**/
          if (aajeevanSampattiQuoteData.BuyingFor != "Self") {
            aajeevanSampattiQuoteData.ProposerFirstName = $scope.data.propFirstName;
            aajeevanSampattiQuoteData.ProposerLastName = $scope.data.propLastName;
            aajeevanSampattiQuoteData.ProposerGender = "" + (($scope.data.proposerGender == 0) ? "Male" : "Female");
            aajeevanSampattiQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.proposerAge), 'MM/dd/yyyy');
          } else {
            aajeevanSampattiQuoteData.ProposerFirstName = $scope.data.liFirstName;
            aajeevanSampattiQuoteData.ProposerLastName = $scope.data.liLastName;
            aajeevanSampattiQuoteData.ProposerGender = "" + (($scope.data.laGender == 0) ? "Male" : "Female");
            aajeevanSampattiQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          }
          /**Input/Output Screen**/
          /**15 -> IsSmoker**/
          if ($scope.calcData.smoke != undefined) {
            aajeevanSampattiQuoteData.IsSmoker = ($scope.calcData.smoke == "nonsmoke") ? "" + 0 : "" + 1;
          } else {
            aajeevanSampattiQuoteData.IsSmoker = "" + 0;
          }
          /**16->benfitUptoAge**/
          if ($scope.calcData.benfitUptoAge != undefined) {
            aajeevanSampattiQuoteData.UptoAge = "" + $scope.calcData.benfitUptoAge;
          } else {
            aajeevanSampattiQuoteData.UptoAge = null;
          }
          /**17-> PayType - (Limited/Regular) if applicable **/
          aajeevanSampattiQuoteData.PayType = null;
          /**18-> BenefitType - (Endowment/Money Back)(Fixed Monthly Payout/Lumpsum + Increasing Payout) if applicable **/
          aajeevanSampattiQuoteData.BenefitType = null;
          /**19->PremiumPaymentTerm**/
          aajeevanSampattiQuoteData.PremiumPaymentTerm = "" + $scope.calcData.ppt;
          /**20->Policy Term**/
          aajeevanSampattiQuoteData.PolicyTerm = "" + $scope.calcData.pt;
          /**21->SumAssured/Life Cover**/
          aajeevanSampattiQuoteData.SumAssured = $scope.outputData.premium.sumAssured;
          /**22->GuaranteedIncomePeriod**/
          aajeevanSampattiQuoteData.GuaranteedIncomePeriod = null;
          /**23->GuaranteedIncomePeriod**/
          aajeevanSampattiQuoteData.MaturityPayoutPeriod = null;
          /**24->MaturityPayoutFrequency**/
          aajeevanSampattiQuoteData.MaturityPayoutFrequency = null;
          /**25->FlexiBenefitPeriod**/
          aajeevanSampattiQuoteData.FlexiBenefitPeriod = null;//$scope.outputData.benefitPeriod;
          /**26->AnnualBasePremium**/
          aajeevanSampattiQuoteData.AnnualBasePremium = $scope.outputData.premium.totalAnnualPremium;
          /**27->Mode**/
          aajeevanSampattiQuoteData.Mode = "" + $scope.calcData.premiumMode;
          /**28->ModalFactor**/
          aajeevanSampattiQuoteData.ModalFactor = $scope.outputData.premium.modalFactor;
          /**29->ModalPremium**/
          aajeevanSampattiQuoteData.ModalPremium = $scope.outputData.premium.totalModalPremium;
          /**30->NSAPForLA**/
          if ($scope.calcData.NSAPForLA !== undefined) {
            aajeevanSampattiQuoteData.IsNSAP = "" + $scope.calcData.NSAPForLA;
          } else {
            aajeevanSampattiQuoteData.IsNSAP = "" + 0;
          }
          /**31->ServiceTax**/
        //  aajeevanSampattiQuoteData.ServiceTax = $scope.calcData.premium.totalAnnualPremiumWithTaxForFirstYear - $scope.outputData.premium.totalAnnualPremium;
         aajeevanSampattiQuoteData.ServiceTax = 0;
          /**32->PremiumPayable**/
          aajeevanSampattiQuoteData.PremiumPayable = $scope.outputData.premium.totalModalPremiumWithServiceTaxForFirstYear;
          /**33->PremiumPayable**/
          aajeevanSampattiQuoteData.IsInYourPresence = null;
          /**34->PremiumPayable**/
          aajeevanSampattiQuoteData.EstimatedReturnRate = null;
          /**Default value is 0, For email functionality**/
          /**35-IsEmail**/
          /**36-ToRecipients**/
          /**37-CcRecipients**/
        /*  if (isFromEmail) {
            aajeevanSampattiQuoteData.IsEmail = "" + 1;
            aajeevanSampattiQuoteData.ToRecipients = emailData.To;
            aajeevanSampattiQuoteData.CcRecipients = emailData.Cc;
          } else {
            aajeevanSampattiQuoteData.IsEmail = "" + 0;
            aajeevanSampattiQuoteData.ToRecipients = null;
            aajeevanSampattiQuoteData.CcRecipients = null;
          }*/
          /**38-> create JSON for IRDA **/
          aajeevanSampattiQuoteData.Json = createaajeevanSampattiIRDAQuotePDFJson(biRefNo.BiQuoteNo);
          $log.debug("aajeevanSampattiQuoteData...........", aajeevanSampattiQuoteData);
    /**************************************************************************************/
    /**custome json creation for quote cpmparison***/
          quoteCustomJson.quoteData.push({
            ReferenceSystemTypeId: aajeevanSampattiQuoteData.ReferenceSystemTypeId,
            FkProductId: aajeevanSampattiQuoteData.FkProductId,
            ProductPlanCode: aajeevanSampattiQuoteData.ProductPlanCode,
            FkAgentCode: aajeevanSampattiQuoteData.FkAgentCode,
            BuyingFor: aajeevanSampattiQuoteData.BuyingFor,
            LAFirstName: aajeevanSampattiQuoteData.LAFirstName,
            LALastName: aajeevanSampattiQuoteData.LALastName,
            LAGender: aajeevanSampattiQuoteData.LAGender,
            LADOB: aajeevanSampattiQuoteData.LADOB,
            ProposerFirstName: aajeevanSampattiQuoteData.ProposerFirstName,
            ProposerLastName: aajeevanSampattiQuoteData.ProposerLastName,
            ProposerGender: aajeevanSampattiQuoteData.ProposerGender,
            ProposerDOB: aajeevanSampattiQuoteData.ProposerDOB,
            IsSmoker: aajeevanSampattiQuoteData.IsSmoker,
            UptoAge: aajeevanSampattiQuoteData.UptoAge,
            PayType: aajeevanSampattiQuoteData.PayType,
            BenefitType: aajeevanSampattiQuoteData.BenefitType,
            PremiumPaymentTerm: aajeevanSampattiQuoteData.PremiumPaymentTerm,
            PolicyTerm: aajeevanSampattiQuoteData.PolicyTerm,
            SumAssured: aajeevanSampattiQuoteData.SumAssured,
            GuaranteedIncomePeriod: aajeevanSampattiQuoteData.GuaranteedIncomePeriod,
            MaturityPayoutPeriod: aajeevanSampattiQuoteData.MaturityPayoutPeriod,
            MaturityPayoutFrequency: aajeevanSampattiQuoteData.MaturityPayoutFrequency,
            FlexiBenefitPeriod: aajeevanSampattiQuoteData.FlexiBenefitPeriod,
            AnnualBasePremium: aajeevanSampattiQuoteData.AnnualBasePremium,
            Mode: aajeevanSampattiQuoteData.Mode,
            ModalFactor: aajeevanSampattiQuoteData.ModalFactor,
            ModalPremium: aajeevanSampattiQuoteData.ModalPremium,
            IsNSAP: aajeevanSampattiQuoteData.IsNSAP,
            ServiceTax: aajeevanSampattiQuoteData.ServiceTax,
            PremiumPayable: aajeevanSampattiQuoteData.PremiumPayable,
            IsInYourPresence: aajeevanSampattiQuoteData.IsInYourPresence,
            EstimatedReturnRate: aajeevanSampattiQuoteData.EstimatedReturnRate
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
            aajeevanSampattiRidersData = [[]];
            aajeevanSampattiRidersData = $scope.createRidersData(userData, currentData, biRefNo.BiQuoteNo, selectedRiderIds);
              $log.debug("*******aajeevanSampattiRidersData*******",aajeevanSampattiRidersData);
          }
          //if same quote no need to save the data again - method will check is Quote save required
          quoteProposalNosDataService.isQuoteDataInsertRequired(JSON.stringify(quoteCustomJson)).
          then(function(isRequired) {
            if (isRequired) {
              quoteProposalNosDataService.updateBIQuoteNumberUsedStatus(biRefNo.BiQuoteNo).then(function() {
                quoteProposalNosDataService.insertQuoteData(aajeevanSampattiQuoteData);
                if ($scope.hcData || $scope.adbData || $scope.pwrData1 || $scope.pwrData2) {
                    $log.debug("########aajeevanSampattiRidersData########",aajeevanSampattiRidersData);
                  quoteProposalNosDataService.insertRidersData(aajeevanSampattiRidersData);
                }
              });
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  $scope.hidesendEmailPopup();
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, aajeevanSampattiQuoteData.Json,aajeevanSampattiQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,aajeevanSampattiQuoteData.Json,aajeevanSampattiQuoteData.FkProductId);
                }
              }
            } else {
              $log.debug("*******Same Quote Data already available*******");
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, aajeevanSampattiQuoteData.Json,aajeevanSampattiQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,aajeevanSampattiQuoteData.Json,aajeevanSampattiQuoteData.FkProductId);
                }
                $scope.hidesendEmailPopup();
              }
            }
          });
        });
    };

    $scope.createRidersData = function(userData, currentData, biQuoteNo, selectedRiderIds) {
      var aajeevanSampattiRidersData = [
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
          aajeevanSampattiRidersData[i] = adbArray;
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
          aajeevanSampattiRidersData[i] = hospiArray;
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
          aajeevanSampattiRidersData[i] = pwr2Array;
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
          aajeevanSampattiRidersData[i] = pwr1Array;
        }
      }
      return aajeevanSampattiRidersData;
    };

    function createaajeevanSampattiIRDAQuotePDFJson(BiQuoteNo) {
      $log.debug("calcData",$scope.calcData);
      var userData = getSetCommonDataService.getCommonData();
      var currentData = getSetCommonDataService.getCurrentProdData();

      var selectedRiderData={};
      var aajeevanSampattiIRDAQuotePDFJson = {"PDF":{}};
      aajeevanSampattiIRDAQuotePDFJson.PDF.quoteNo = BiQuoteNo;
      aajeevanSampattiIRDAQuotePDFJson.PDF.proposalNo = "";
      aajeevanSampattiIRDAQuotePDFJson.PDF.policyNo = "";
      aajeevanSampattiIRDAQuotePDFJson.PDF.uin = currentData.prodUIN;
      aajeevanSampattiIRDAQuotePDFJson.PDF.productCode = $scope.outputData.prodCode;
      aajeevanSampattiIRDAQuotePDFJson.PDF.riderCode = [];
      aajeevanSampattiIRDAQuotePDFJson.PDF.illustrationGeneratedBy = userData.channelName;
      aajeevanSampattiIRDAQuotePDFJson.PDF.illustrationDate = utilityService.getDisplayDate(new Date(), 'dd-MM-yyyy');

      aajeevanSampattiIRDAQuotePDFJson.PDF.lifeAssuredDetail = {
        name: $scope.data.liFirstName + " " + $scope.data.liLastName,
        gender: $scope.data.laGender==0?"Male":"Female",
        age: $scope.getAge($scope.data.labfAge),
      };
      aajeevanSampattiIRDAQuotePDFJson.PDF.proposerDetail = {};
      if ($scope.data.BuyingFor!="Self") {
        aajeevanSampattiIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.propFirstName + " " + $scope.data.propLastName;
        aajeevanSampattiIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.proposerGender==0?"Male":"Female";
        aajeevanSampattiIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.proposerAge);
      } else {
        aajeevanSampattiIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.liFirstName + " " + $scope.data.liLastName;
        aajeevanSampattiIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.laGender==0?"Male":"Female";
        aajeevanSampattiIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.labfAge);
      }
      aajeevanSampattiIRDAQuotePDFJson.PDF.benefitAndPremiumDetail = {
        planName: "" + currentData.prodLbl,
        policyTerm: "" + $scope.outputData.pt,
        premiumPaymentTerm: "" + $scope.inputData.ppt,
        premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
        guaranteedMonthlyIncome:$scope.calcData.GuaranteedMonthlyIncome,
        guaranteedIncomeBenefitPeriod:$scope.data.guaranteedIncome,
        //deathBenefit:$scope.data.biCalculation.deathBenifit[0],
        benefitUptoAge:aajeevanSampattiIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
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
        aajeevanSampattiIRDAQuotePDFJson.PDF.riderCode.push($scope.hcData.prodCode);
        aajeevanSampattiIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: hospiCashRiderId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.ppt,
          premiumPaymentTerm: "" + $scope.outputData.riderPpt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          guaranteedMonthlyIncome:$scope.calcData.GuaranteedMonthlyIncome,
          guaranteedIncomeBenefitPeriod:0,
          //deathBenefit:$scope.data.biCalculation.deathBenifit[0],
          sumAssured: $scope.calcData.sumAssuredForRiders,
          benefitUptoAge: aajeevanSampattiIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:"" + 0,
          annualPremium: $scope.calcData.annualHospiCashPremium,
          modalPremium:  $scope.hcData.modalHospiCashPremium,
          serviceTax1stYear: $scope.hcData.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.hcData.serviceTaxForModalFirstYear
        });
      }

      if ($scope.adbData && $scope.riders.isADBActive) {
        aajeevanSampattiIRDAQuotePDFJson.PDF.riderCode.push($scope.adbData.prodCode);
        aajeevanSampattiIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: adbRiderId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          guaranteedMonthlyIncome:$scope.calcData.GuaranteedMonthlyIncome,
          guaranteedIncomeBenefitPeriod:0,
          //deathBenefit:$scope.data.biCalculation.deathBenifit[0],
          sumAssured: $scope.calcData.sumAssuredForADBRiders,
          benefitUptoAge: aajeevanSampattiIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:"" + 0,
          annualPremium:  $scope.calcData.annualAdbRiderPremium ,
          modalPremium:$scope.adbData.modalAdbRiderPremium,
          serviceTax1stYear:$scope.adbData.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.adbData.serviceTaxForModalFirstYear

        });
      }

      $log.debug("benefitIllustration",$scope.data.biCalculation);
      aajeevanSampattiIRDAQuotePDFJson.PDF.benefitIllustration =$scope.data.biCalculation;
      return JSON.stringify(aajeevanSampattiIRDAQuotePDFJson);
      //return aajeevanSampattiIRDAQuotePDFJson;
    }
    /* Save Quote*/

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
  }
]);
