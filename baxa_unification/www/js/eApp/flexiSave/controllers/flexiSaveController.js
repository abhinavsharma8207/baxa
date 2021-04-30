eAppModule.controller('flexiSaveController', ['$log',
  '$scope',
  '$state',
  '$http',
  '$rootScope',
  '$ionicHistory',
  '$ionicPlatform',
  '$ionicLoading',
  '$cordovaDatePicker',
  '$ionicNavBarDelegate',
  'eAppForms',
  'eAppServices',
  'utilityService',
  'commonFormulaSvc',
  'getSetCommonDataService',
  'quoteProposalNosDataService',
  'fSValidationService',
  'fSCalculationService',
  'riderValidationService',
  'pwrRiderDataFromUserSvc',
  'calculatePwrRiderPremiumSvc',
  'calculateAdbRiderPremiumSvc',
  'hospiCashRiderDataFromUserSvc',
  'calculatehospiCashRiderPremiumSvc',
  '$filter',
  'sendBIEmailService',
  function($log, $scope, $state, $http, $rootScope, $ionicHistory, $ionicPlatform,$ionicLoading, $cordovaDatePicker, $ionicNavBarDelegate, eAppForms, eAppServices, utilityService, commonFormulaSvc, getSetCommonDataService, quoteProposalNosDataService, fSValidationService, fSCalculationService, riderValidationService, pwrRiderDataFromUserSvc, calculatePwrRiderPremiumSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc,$filter,sendBIEmailService) {

    'use strict';
    var vm = this;
    var hospiCashRiderId = 5,
      adbRiderId = 4,
      prodId = 10,
      channelId = 1,
      pwrRiderId = 6,
      pwrRiderCiId = 7,
      pwrOption = 1;

    $scope.inputData = {};
    $scope.outputData = {};
    $scope.calcData = {};
    $scope.dbErrors = [];
    $scope.prodBaseCode = "";

    $scope.title = "Flexi Save";
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

    /*var formData = eAppForms.renderFields({'firstName':{'dependent':'gender'},'maritalStatus':true});
    $log.debug("************************************************formData", formData);*/

    //** Back Button Funtionality **//
    $scope.goBack = function() {
      if ($state.current.name == 'app.flexiSave-home') {
        $state.go("app.flexiSave-LAAndProposer");
      } else if ($state.current.name == 'app.flexiSave-LAAndProposer') {
        $scope.data = eAppServices.getBuyForDetails();
        $state.go("app.eApp");
      } else if ($state.current.name == 'app.flexiSave-estimated') {
        $state.go("app.flexiSave-home");
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
    $http.get('js/eApp/flexiSave/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
    });
    /*Get validation messgae through json file.*/

    //** Get Data Variables **//

    //** Get Generic Options for Form Elements **//
    var params = {
      "ui_color": 'purpleline',
      "ui_gender": true,
      "ui_age": true,
      "ui_smoke": false,
      "ui_nsap": true,
      "ui_payType": false,
      "ui_termExtra": {
        "label": "Flexi Benifit Period",
        "default": "20-30",
        "terms": {}
      },
      /*"ui_pmode"          : true,*/
      "ui_sumAssured": false,
      "ui_anualPreminum": true,
      "ui_modelPreminum": true,
      "switch": false,
    };

    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "BUYPOLFOR", "PMODE", "PPT"], ["PT", "MPFACTOR", "BENEFITPERIOD"])
      .then(function(result) {
        $scope.params = params;
        $scope.formData = result[0];
        $scope.formDataCalc = {
          "BENEFITPERIOD": JSON.parse(result[1].BENEFITPERIOD),
          "PT": JSON.parse(result[1].PT),
          "MPFACTOR": JSON.parse(result[1].MPFACTOR) /*,"PREPAYOPN":JSON.parse(result[1].PREPAYOPN)*/
        };
        $scope.params.ui_termExtra.terms = JSON.parse(result[1].BENEFITPERIOD);
        $scope.formDataOut = result[2];

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
          $state.go('app.flexiSave-LAAndProposer');
        }
      });
    //** Get Data Variables **//

    //** Handle Form Submit for LA Proposer Details Form **//
    $scope.ProceedForLAAndProposerDetails = function(data) {
      $scope.inputData.laName = data.liFirstName + " " + data.liLastName;
      $scope.inputData.laAge = $scope.getAge(data.labfAge);
      $scope.inputData.laGender = parseInt(data.laGender);
      $scope.inputData.annualPremium = ($scope.inputData.annualPremium)?($scope.inputData.annualPremium):(50000);
      $scope.inputData.annualPremiumMinLength = 4;
      $scope.inputData.annualPremiumMaxLength = 10;
      $scope.inputData.isSelf = (data.BuyingFor == "Self") ? (true) : (false);
      $scope.inputData.premiumMode = ($scope.inputData.premiumMode)?($scope.inputData.premiumMode):(1);
      $scope.inputData.pt = ($scope.inputData.pt)?($scope.inputData.pt):(20);
      $scope.inputData.ppt = ($scope.inputData.ppt)?($scope.inputData.ppt):(12);
      $scope.inputData.payType = 'REGULAR';
      $scope.inputData.NSAPForLA = false;

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
      $state.go('app.flexiSave-home');
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
            $scope.dbError = "";
            $scope.showDbErrors = false;
            calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospiCashRiderId, prodId, channelId, calcData.base)
            .then(function(result) {
              $scope.hcData = result;
              $scope.riders.isHCActive = true;
              $scope.calcData.benfitUptoAgeHC                       = parseFloat(result.benfitUptoAge);
              $scope.calcData.modalHospiCashPremium                 = parseFloat(result.modalHospiCashPremium);
              $scope.calcData.annualHospiCashPremium                = parseFloat(result.annualHospiCashPremium);
              $scope.calcData.percentOfBasePremiumHC                = parseFloat(result.percentOfBasePremium);
              $scope.calcData.serviceTaxHospiCashForModalFirstYear  = parseFloat(result.serviceTaxForModalFirstYear);
              $scope.calcData.serviceTaxHospiCashForAnnualFirstYear = parseFloat(result.serviceTaxForAnnualFirstYear);
              $scope.calcData.totalModalPremiumHospiCashWithTaxForFirstYear  = parseFloat(result.totalModalPremiumWithTaxForFirstYear);
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
          $scope.calcData.benfitUptoAgeHC                       = 0;
          $scope.calcData.modalHospiCashPremium                 = 0;
          $scope.calcData.annualHospiCashPremium                = 0;
          $scope.calcData.percentOfBasePremiumHC                = 0;
          $scope.calcData.serviceTaxHospiCashForModalFirstYear  = 0;
          $scope.calcData.serviceTaxHospiCashForAnnualFirstYear = 0;
          $scope.calcData.totalModalPremiumHospiCashWithTaxForFirstYear  = 0;
          $scope.calcData.totalAnnualPremiumHospiCashWithTaxForFirstYear = 0;
        }
      },
      'PWR': function(calcData) {
        $scope.riders.dbErrorPWR = [];
        if ($scope.riders.isHCActive || $scope.riders.isADBActive) {
          $scope.riderSelectAlert = true;
        } else /*if($scope.riders.isPWRActive)*/ {
          fSValidationService.getProductCode(prodId, channelId, calcData.ppt)
            .then(function(prodCode) {
              if(!$scope.riders.PWRI && !$scope.riders.PWRII){
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
                        if(!$scope.riders.PWRI){
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
                            $scope.riders.dbErrorPWR.push({ "Name": "PREM", "ErrorMessage": "30% Base of premium is less than rider!" });
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
                        if(!$scope.riders.PWRII){
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
        $scope.riders.dbErrorPWR = [];
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
        $scope.riders.dbErrorADB = [];
        if ($scope.riders.isPWRActive) {
          $scope.pwrSelectAlert = true;
        } else if (calcData.sumAssuredForADBRiders > 0 && calcData.pt > 0) {
          fSValidationService.getProductCode(prodId, channelId, $scope.outputData.ppt)
            .then(function(prodCode) {
              $scope.riders.dbErrorADB = [];
              $scope.calcData.riderterm = $scope.outputData.ppt;
              $scope.calcData.ADBRider = true;
              $scope.calcData.riderterm = calcData.ppt;
              riderValidationService.riderPreADBValidateService($scope.calcData, prodId, channelId, prodCode)
              .then(function(message){
                if(message.length > 0){
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
                }
                else{
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

    /**/
    $scope.calculate = function(inputData) {
      //** Calculation **//
      $scope.dbErrors = [];
      //$scope.outputData.laAge = 195;
      $scope.outputData.ppt = inputData.ppt;
      $scope.outputData.premiumMode = inputData.premiumMode;
      $scope.outputData.basePremium = parseInt(inputData.annualPremium);
      $scope.outputData.pt = inputData.pt;
      $scope.outputData.modalPremium = inputData.modalPremium;
      $scope.outputData.NSAPForLA = (inputData.NSAPForLA !== undefined) ? (inputData.NSAPForLA) : (false);
      if($scope.data.BuyingFor == "Self"){
        $scope.outputData.NSAPForPrposer         = $scope.outputData.NSAPForLA;
      }else{
        $scope.outputData.NSAPForPrposer         = false;
      }


      if (inputData.ppt == 5) {
        fSValidationService.getProductCode(prodId, channelId, inputData.ppt)
          .then(function(prodCode) {
            if ($scope.outputData.laAge >= 8) {
              fSValidationService.getFsProductCode(prodId, channelId, prodCode, $scope.outputData)
                .then(function(value) {
                  fSValidationService.validateProduct(prodId, channelId, value, $scope.outputData)
                    .then(function(messages) {
                      if (messages.length === 0) {
                        $scope.showDbErrors = false;
                        $scope.doCalcBasePremium(prodId, channelId, $scope.outputData);
                      } else {
                        $scope.showDbErrors = true;
                        for (var e = 0; e < messages.length; e++) {
                          $scope.dbErrors.push(messages[e]);
                        }
                      }
                    });
                });
            } else {
              $scope.showDbErrors = true;
              $scope.dbErrors.push({
                "Name": "ENTAGE",
                "ErrorMessage": "Entry Age must be more then 8 years!"
              });
            }
          });
      } else {
        fSValidationService.getProductCode(prodId, channelId, inputData.ppt)
          .then(function(prodCode) {
            fSValidationService.validateProduct(prodId, channelId, prodCode, inputData)
              .then(function(messages) {
                if (messages.length === 0) {
                  $scope.showDbErrors = false;
                  $scope.dbErrors = "";
                  $scope.doCalcBasePremium(prodId, channelId, inputData);
                } else {
                  $scope.showDbErrors = true;
                  for (var e = 0; e < messages.length; e++) {
                    $scope.dbErrors.push(messages[e]);
                  }
                }
              });
          });
      }
      $log.debug("-----------DB VALIDATIONS------------", $scope.dbErrors);
      //** Calculation **//
    };

    function doGenarateFSBi(prodId, channelId, userInput, basePremium, sumAssured) {
      $scope.flexiSaveBi = {};
      fSCalculationService.generateFlexiSaveBi(prodId, channelId, userInput, basePremium, sumAssured)
        .then(function(val) {
          /* Save data for BI Calculation By Suresh Chouksey*/
            $scope.data.biCalculation=val;
          if (val.guaranteedMaturityBenefit.length > 0 && val.nonguaranteedMaturityBenefit4Per.length > 0) {
            var sumAssuredAtMaturity = val.guaranteedMaturityBenefit[val.guaranteedMaturityBenefit.length - 1];
            var nonguaranteedMaturityBenefit4Per = val.nonguaranteedMaturityBenefit4Per[val.nonguaranteedMaturityBenefit4Per.length - 1] - sumAssuredAtMaturity;
            var nonguaranteedMaturityBenefit8Per = val.nonguaranteedMaturityBenefit8Per[val.nonguaranteedMaturityBenefit8Per.length - 1] - sumAssuredAtMaturity;

            $scope.outputData.precent = 8;
            $scope.outputData.pwrRiderOption = 1;
            $scope.outputData.p4 = {
              "sumAssuredAtMaturity": sumAssuredAtMaturity,
              "nonGuaranteedMaturityBenefit": nonguaranteedMaturityBenefit4Per
            };
            $scope.outputData.p8 = {
              "sumAssuredAtMaturity": sumAssuredAtMaturity,
              "nonGuaranteedMaturityBenefit": nonguaranteedMaturityBenefit8Per
            };

            eAppServices.setOutputDetails($scope.outputData);
            eAppServices.setCalcDetails($scope.outputData);
            $state.go('app.flexiSave-estimated');
          }
        });
    }

    $scope.doCalcBasePremium = function(prodId, channelId, userInput) {
      fSCalculationService.calcPremium(prodId, channelId, userInput)
        .then(function(totalBasePremiumVals) {
          $log.debug("------------------------------totalBasePremiumVals", totalBasePremiumVals);
          $scope.outputData.premium = totalBasePremiumVals;
          $scope.outputData.basePremium = totalBasePremiumVals.basePremium;
          $scope.outputData.modalFactor = totalBasePremiumVals.modalFactor;
          $scope.outputData.modalNsapPremium = totalBasePremiumVals.modalNsapPremium;
          $scope.outputData.modalPremium = totalBasePremiumVals.modalPremium;
          $scope.outputData.nsapPremium = totalBasePremiumVals.nsapPremium;
          $scope.outputData.prodCode = totalBasePremiumVals.prodCode;
          $scope.outputData.serviceTaxFactorForFirstYear = totalBasePremiumVals.serviceTaxFactorForFirstYear;
          $scope.outputData.serviceTaxFactorForSecondYear = totalBasePremiumVals.serviceTaxFactorForSecondYear;
          $scope.outputData.sumAssured = totalBasePremiumVals.sumAssured;
          $scope.outputData.sumAssuredForADBRiders = parseInt(totalBasePremiumVals.sumAssured);
          $scope.outputData.totalAnnualPremium = totalBasePremiumVals.totalAnnualPremium;
          $scope.outputData.totalAnnualPremiumWithTaxForFirstYear = totalBasePremiumVals.totalAnnualPremiumWithTaxForFirstYear;
          $scope.outputData.totalAnnualPremiumWithTaxForSecondYear = totalBasePremiumVals.totalModalPremiumWithServiceTaxForSecondYear;
          $scope.outputData.totalModalPremium = totalBasePremiumVals.totalModalPremium;
          $scope.outputData.totalModalPremiumWithTaxForFirstYear = totalBasePremiumVals.totalModalPremiumWithTaxForFirstYear;
          $scope.outputData.totalModalPremiumWithTaxForSecondYear = totalBasePremiumVals.totalModalPremiumWithTaxForSecondYear;

          $scope.outputData.fsBasePremiumOutput = true;
          var flexiSaveBi = doGenarateFSBi(prodId, channelId, userInput, totalBasePremiumVals.basePremium, totalBasePremiumVals.sumAssured);
          $scope.flexiSaveBiOutput = true;
        });
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
      quoteProposalNosDataService.getBIQuoteNumber(userData.agentId)
        .then(function(biRefNo) {
          var flexiSaveQuoteData = {};
          var flexiSaveRidersData = [[]];
          var quoteCustomJson = {
            quoteData: [],
            adbRiderData: [],
            hospiRiderData: [],
            pwRiderIData: [],
            pwRiderIIData: []
          };
          /**1.BI Ref No**/
          flexiSaveQuoteData.PkQuotationId = biRefNo.BiQuoteNo;
          /**2 - >  1 = Eapp, 2 = OLS **/
          flexiSaveQuoteData.ReferenceSystemTypeId = "1";
          /**3 - > Selected Product ID**/
          flexiSaveQuoteData.FkProductId = currentData.prodId;
          /**4 - > Selected Product Plan Code**/
          flexiSaveQuoteData.ProductPlanCode = $scope.calcData.prodCode;
          /**5-> Logged in Agent Id**/
          flexiSaveQuoteData.FkAgentCode = "" + userData.agentId;
          /**Buying For Screen**/
          /**6 -> Buying For Screen**/
          flexiSaveQuoteData.BuyingFor = $scope.data.BuyingFor;
          /**7 -> liFirstName**/
          flexiSaveQuoteData.LAFirstName = $scope.data.liFirstName;
          /**8 -> liLastName**/
          flexiSaveQuoteData.LALastName = $scope.data.liLastName;
          /**9 -> LAGender**/
          flexiSaveQuoteData.LAGender = "" + $scope.data.laGender;
          /**10 -> LADOB**/
          flexiSaveQuoteData.LADOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          /**11 -> propFirstName**/
          /**12 -> propLastName**/
          /**13 -> proposerGender**/
          /**14 -> ProposerDOB**/
          if (flexiSaveQuoteData.BuyingFor != "Self") {
            flexiSaveQuoteData.ProposerFirstName = $scope.data.propFirstName;
            flexiSaveQuoteData.ProposerLastName = $scope.data.propLastName;
            flexiSaveQuoteData.ProposerGender = "" + $scope.data.proposerGender;
            flexiSaveQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.proposerAge), 'MM/dd/yyyy');
          } else {
            flexiSaveQuoteData.ProposerFirstName = $scope.data.liFirstName;
            flexiSaveQuoteData.ProposerLastName = $scope.data.liLastName;
            flexiSaveQuoteData.ProposerGender = "" + $scope.data.laGender;
            flexiSaveQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          }
          /**Input/Output Screen**/
          /**15 -> IsSmoker**/
          if ($scope.calcData.smoke != undefined) {
            flexiSaveQuoteData.IsSmoker = ($scope.calcData.smoke == "nonsmoke") ? "" + 0 : "" + 1;
          } else {
            flexiSaveQuoteData.IsSmoker = "" + 0;
          }
          /**16->benfitUptoAge**/
          if ($scope.calcData.benfitUptoAge != undefined) {
            flexiSaveQuoteData.UptoAge = "" + $scope.calcData.benfitUptoAge;
          } else {
            flexiSaveQuoteData.UptoAge = null;
          }
          /**17-> PayType - (Limited/Regular) if applicable **/
          flexiSaveQuoteData.PayType = null;
          /**18-> BenefitType - (Endowment/Money Back)(Fixed Monthly Payout/Lumpsum + Increasing Payout) if applicable **/
          flexiSaveQuoteData.BenefitType = null;
          /**19->PremiumPaymentTerm**/
          flexiSaveQuoteData.PremiumPaymentTerm = "" + $scope.calcData.ppt;
          /**20->Policy Term**/
          flexiSaveQuoteData.PolicyTerm = "" + $scope.calcData.pt;
          /**21->SumAssured/Life Cover**/
          flexiSaveQuoteData.SumAssured = $scope.outputData.premium.sumAssured;
          /**22->GuaranteedIncomePeriod**/
          flexiSaveQuoteData.GuaranteedIncomePeriod = null;
          /**23->GuaranteedIncomePeriod**/
          flexiSaveQuoteData.MaturityPayoutPeriod = null;
          /**24->MaturityPayoutFrequency**/
          flexiSaveQuoteData.MaturityPayoutFrequency = null;
          /**25->FlexiBenefitPeriod**/
          flexiSaveQuoteData.FlexiBenefitPeriod = $scope.outputData.benefitPeriod;
          /**26->AnnualBasePremium**/
          flexiSaveQuoteData.AnnualBasePremium = $scope.outputData.premium.totalAnnualPremium;
          /**27->Mode**/
          flexiSaveQuoteData.Mode = "" + $scope.calcData.premiumMode;
          /**28->ModalFactor**/
          flexiSaveQuoteData.ModalFactor = $scope.outputData.premium.modalFactor;
          /**29->ModalPremium**/
          flexiSaveQuoteData.ModalPremium = $scope.outputData.premium.modalPremium;
          /**30->NSAPForLA**/
          if ($scope.calcData.NSAPForLA !== undefined) {
            flexiSaveQuoteData.IsNSAP = "" + $scope.calcData.NSAPForLA;
          } else {
            flexiSaveQuoteData.IsNSAP = "" + 0;
          }
          /**31->ServiceTax**/
          flexiSaveQuoteData.ServiceTax = $scope.calcData.premium.totalAnnualPremiumWithTaxForFirstYear - $scope.outputData.premium.totalAnnualPremium;
          /**32->PremiumPayable**/
          flexiSaveQuoteData.PremiumPayable = $scope.calcData.premium.totalModalPremiumWithTaxForFirstYear;
          /**33->PremiumPayable**/
          flexiSaveQuoteData.IsInYourPresence = null;
          /**34->PremiumPayable**/
          flexiSaveQuoteData.EstimatedReturnRate = null;
          /**Default value is 0, For email functionality**/
          /**35-IsEmail**/
          /**36-ToRecipients**/
          /**37-CcRecipients**/
          /*if (isFromEmail) {
            flexiSaveQuoteData.IsEmail = "" + 1;
            flexiSaveQuoteData.ToRecipients = emailData.To;
            flexiSaveQuoteData.CcRecipients = emailData.Cc;
          } else {
            flexiSaveQuoteData.IsEmail = "" + 0;
            flexiSaveQuoteData.ToRecipients = null;
            flexiSaveQuoteData.CcRecipients = null;
          }*/
          /**38-> create JSON for IRDA **/
          flexiSaveQuoteData.Json = createFlexiSaveIRDAQuotePDFJson(biRefNo.BiQuoteNo);
          $log.debug("flexiSaveQuoteData...........", flexiSaveQuoteData);
    /**************************************************************************************/
    /**custome json creation for quote cpmparison***/
          quoteCustomJson.quoteData.push({
            ReferenceSystemTypeId: flexiSaveQuoteData.ReferenceSystemTypeId,
            FkProductId: flexiSaveQuoteData.FkProductId,
            ProductPlanCode: flexiSaveQuoteData.ProductPlanCode,
            FkAgentCode: flexiSaveQuoteData.FkAgentCode,
            BuyingFor: flexiSaveQuoteData.BuyingFor,
            LAFirstName: flexiSaveQuoteData.LAFirstName,
            LALastName: flexiSaveQuoteData.LALastName,
            LAGender: flexiSaveQuoteData.LAGender,
            LADOB: flexiSaveQuoteData.LADOB,
            ProposerFirstName: flexiSaveQuoteData.ProposerFirstName,
            ProposerLastName: flexiSaveQuoteData.ProposerLastName,
            ProposerGender: flexiSaveQuoteData.ProposerGender,
            ProposerDOB: flexiSaveQuoteData.ProposerDOB,
            IsSmoker: flexiSaveQuoteData.IsSmoker,
            UptoAge: $scope.inputData.laAge + parseInt(flexiSaveQuoteData.PolicyTerm),
            PayType: flexiSaveQuoteData.PayType,
            BenefitType: flexiSaveQuoteData.BenefitType,
            PremiumPaymentTerm: flexiSaveQuoteData.PremiumPaymentTerm,
            PolicyTerm: flexiSaveQuoteData.PolicyTerm,
            SumAssured: flexiSaveQuoteData.SumAssured,
            GuaranteedIncomePeriod: flexiSaveQuoteData.GuaranteedIncomePeriod,
            MaturityPayoutPeriod: flexiSaveQuoteData.MaturityPayoutPeriod,
            MaturityPayoutFrequency: flexiSaveQuoteData.MaturityPayoutFrequency,
            FlexiBenefitPeriod: flexiSaveQuoteData.FlexiBenefitPeriod,
            AnnualBasePremium: flexiSaveQuoteData.AnnualBasePremium,
            Mode: flexiSaveQuoteData.Mode,
            ModalFactor: flexiSaveQuoteData.ModalFactor,
            ModalPremium: flexiSaveQuoteData.ModalPremium,
            IsNSAP: flexiSaveQuoteData.IsNSAP,
            ServiceTax: flexiSaveQuoteData.ServiceTax,
            PremiumPayable: flexiSaveQuoteData.PremiumPayable,
            IsInYourPresence: flexiSaveQuoteData.IsInYourPresence,
            EstimatedReturnRate: flexiSaveQuoteData.EstimatedReturnRate
          });

          $log.debug("$scope.riderHospi...........", $scope.hcData);
          $log.debug("$scope.pwrData2...........", $scope.pwrData2);
          $log.debug("$scope.pwrData1...........", $scope.pwrData1);
          var selectedRiderIds = [];
          if ($scope.hcData && $scope.riders.isHCActive) {
            /*if selected rider id is hospicash - push into selectedRiderId*/
            selectedRiderIds.push(hospiCashRiderId);
            /*added hospi cash rider data in custom code json*/
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
            /*if selected rider id is hospicash - push into selectedRiderId*/
            selectedRiderIds.push(adbRiderId);
            /*added hospi cash rider data in custom code json*/
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
              /*if selected rider id is hospicash - push into selectedRiderId*/
              selectedRiderIds.push(pwrRiderId);
              /*added hospi cash rider data in custom code json*/
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
              /*if selected rider id is hospicash - push into selectedRiderId*/
              selectedRiderIds.push(pwrRiderCiId);
              /*added hospi cash rider data in custom code json*/
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
            flexiSaveRidersData = [[]];
            flexiSaveRidersData = $scope.createRidersData(userData, currentData, biRefNo.BiQuoteNo, selectedRiderIds);
              $log.debug("*******flexiSaveRidersData*******",flexiSaveRidersData);
          }
          /*if same quote no need to save the data again - method will check is Quote save required*/
          quoteProposalNosDataService.isQuoteDataInsertRequired(JSON.stringify(quoteCustomJson)).
          then(function(isRequired) {
            if (isRequired) {
              quoteProposalNosDataService.updateBIQuoteNumberUsedStatus(biRefNo.BiQuoteNo).then(function() {
                quoteProposalNosDataService.insertQuoteData(flexiSaveQuoteData);
                if ($scope.hcData || $scope.adbData || $scope.pwrData1 || $scope.pwrData2) {
                    $log.debug("########flexiSaveRidersData########",flexiSaveRidersData);
                  quoteProposalNosDataService.insertRidersData(flexiSaveRidersData);
                }
              });
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  $scope.hidesendEmailPopup();
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, flexiSaveQuoteData.Json,flexiSaveQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,flexiSaveQuoteData.Json,flexiSaveQuoteData.FkProductId);
                }
              }
            } else {
              $log.debug("*******Same Quote Data already available*******");
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, flexiSaveQuoteData.Json,flexiSaveQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,flexiSaveQuoteData.Json,flexiSaveQuoteData.FkProductId);
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
          /*user selected Hospicash Rider*/
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
          pwr2Array.SumAssured = $scope.calcData.sumAssuredForRiders;
          pwr2Array.IsNSAPProposer = "" + 0;
          pwr2Array.ModalPremium = $scope.pwrData2.modalPWRRiderPremium;
          pwr2Array.ServiceTaxPayable = $scope.pwrData2.serviceTaxForModalFirstYear;
          pwr2Array.PremiumPayable = $scope.pwrData2.totalModalPremiumWithTaxForFirstYear;
          flexiSaveRidersData[i] = pwr2Array;
        }
        if (selectedRiderIds[i] == pwrRiderCiId && $scope.riders.isPWRActive && $scope.pwrData1) {
          var pwr1Array = {};
          /*user selected Hospicash Rider*/
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
          flexiSaveRidersData[i] = pwr1Array;
        }
      }
      return flexiSaveRidersData;
    };

    function createFlexiSaveIRDAQuotePDFJson(BiQuoteNo) {

      $log.debug("calcData",$scope.calcData);
      var userData = getSetCommonDataService.getCommonData();
      var currentData = getSetCommonDataService.getCurrentProdData();

      var selectedRiderData={};
      var flexiSaveIRDAQuotePDFJson = {"PDF":{}};
      flexiSaveIRDAQuotePDFJson.PDF.quoteNo = BiQuoteNo;
      flexiSaveIRDAQuotePDFJson.PDF.proposalNo = "";
      flexiSaveIRDAQuotePDFJson.PDF.policyNo = "";
      flexiSaveIRDAQuotePDFJson.PDF.uin = currentData.prodUIN;
      flexiSaveIRDAQuotePDFJson.PDF.productCode = $scope.calcData.prodCode;
      flexiSaveIRDAQuotePDFJson.PDF.riderCode = [];
      flexiSaveIRDAQuotePDFJson.PDF.illustrationGeneratedBy = userData.channelName;
      flexiSaveIRDAQuotePDFJson.PDF.illustrationDate = utilityService.getDisplayDate(new Date(), 'dd-MM-yyyy');

      flexiSaveIRDAQuotePDFJson.PDF.lifeAssuredDetail = {
        name: $scope.data.liFirstName + " " + $scope.data.liLastName,
        gender: $scope.data.laGender==0?"Male":"Female",
        age: $scope.getAge($scope.data.labfAge),
      };
      flexiSaveIRDAQuotePDFJson.PDF.proposerDetail = {};
      if ($scope.data.BuyingFor!="Self") {
        flexiSaveIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.propFirstName + " " + $scope.data.propLastName;
        flexiSaveIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.proposerGender==0?"Male":"Female";
        flexiSaveIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.proposerAge);
      } else {
        flexiSaveIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.liFirstName + " " + $scope.data.liLastName;
        flexiSaveIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.laGender==0?"Male":"Female";
        flexiSaveIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.labfAge);
      }
      flexiSaveIRDAQuotePDFJson.PDF.benefitAndPremiumDetail = {
        planName: "" + currentData.prodLbl,
        policyTerm: "" + $scope.outputData.pt,
        premiumPaymentTerm: "" + $scope.inputData.ppt,
        premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
        benefitUptoAge:flexiSaveIRDAQuotePDFJson.PDF.proposerDetail.age + $scope.outputData.pt,
        sumAssured: $scope.calcData.sumAssured,
        annualPremium: $scope.calcData.basePremium,
        modalPremium: $scope.calcData.modalPremium,
        nsapExtra:$scope.calcData.modalNsapPremium,
        serviceTax1stYear: $scope.calcData.premium.serviceForAnnualFirstYearTax,
        serviceTax2ndYear:$scope.calcData.premium.serviceForAnnualSecondYearTax,
        rider: [],
        totalPremium1stYear: $scope.calcData.premium.totalAnnualPremiumWithTaxForFirstYear,
        totalPremium2ndYear:$scope.calcData.premium.totalAnnualPremiumWithTaxForSecondYear

      };
      if ($scope.hcData && $scope.riders.isHCActive) {
        flexiSaveIRDAQuotePDFJson.PDF.riderCode.push($scope.hcData.prodCode);
        flexiSaveIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: hospiCashRiderId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.ppt,
          premiumPaymentTerm: "" + $scope.outputData.riderPpt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          sumAssured: $scope.calcData.sumAssuredForRiders,
          benefitUptoAge: flexiSaveIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:"" + 0,
          annualPremium: $scope.calcData.annualHospiCashPremium,
          modalPremium:  $scope.hcData.modalHospiCashPremium,
          serviceTax1stYear: $scope.hcData.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.hcData.serviceTaxForModalFirstYear
        });
      }

      if ($scope.adbData && $scope.riders.isADBActive) {
        flexiSaveIRDAQuotePDFJson.PDF.riderCode.push($scope.adbData.prodCode);
        flexiSaveIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: adbRiderId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          sumAssured: $scope.calcData.sumAssuredForADBRiders,
          benefitUptoAge: flexiSaveIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:"" + 0,
          annualPremium:  $scope.calcData.annualAdbRiderPremium ,
          modalPremium:$scope.adbData.modalAdbRiderPremium,
          serviceTax1stYear:$scope.adbData.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.adbData.serviceTaxForModalFirstYear

        });
      }
      if ($scope.pwrData1 && $scope.riders.isPWRActive) {
        flexiSaveIRDAQuotePDFJson.PDF.riderCode.push($scope.pwrData1.prodCode);
        flexiSaveIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: pwrRiderId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          sumAssured: $scope.calcData.sumAssuredForADBRiders,
          benefitUptoAge: flexiSaveIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:$scope.calcData.modalNsapPremium,
          annualPremium: $scope.calcData.annualPWRIRiderPremium,
          modalPremium: $scope.pwrData1.modalPWRRiderPremium,
          serviceTax1stYear: $scope.pwrData1.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.pwrData1.serviceTaxForModalFirstYear
        });
      }
      if ($scope.pwrData2 && $scope.riders.isPWRActive) {
        flexiSaveIRDAQuotePDFJson.PDF.riderCode.push($scope.pwrData2.prodCode);
        flexiSaveIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: pwrRiderCiId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          sumAssured: $scope.calcData.sumAssuredForADBRiders,
          benefitUptoAge: flexiSaveIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:$scope.calcData.modalNsapPremium,
          annualPremium: $scope.calcData.annualPWRIIRiderPremium,
          modalPremium: $scope.pwrData2.modalPWRRiderPremium,
          serviceTax1stYear: $scope.pwrData2.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.pwrData2.serviceTaxForModalFirstYear
        });
      }


      $log.debug("benefitIllustration",$scope.data.biCalculation);
      flexiSaveIRDAQuotePDFJson.PDF.benefitIllustration =$scope.data.biCalculation;
      return JSON.stringify(flexiSaveIRDAQuotePDFJson);
    //  return flexiSaveIRDAQuotePDFJson;
    }
    /**/
    $scope.updateRiderSA = function(data) {
      $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
    };
    $scope.getHCRTerm = function(ppt,term){
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

    $scope.openPopupForChangeDetails = function() {
      $scope.showPopupToGoForLAAndProposerDetails = true;
    };

    $scope.closePopupForChangeDetails = function() {
      $scope.showPopupToGoForLAAndProposerDetails = false;
    };

    $scope.goToLAAndProposer = function() {
      $state.go("app.flexiSave-LAAndProposer");
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

    $scope.goToHomePage = function() {
      /*Animation Code*/
      setAnimate($ionicHistory);
      $state.go('app.flexiSave-home');
    };

  }
]);
