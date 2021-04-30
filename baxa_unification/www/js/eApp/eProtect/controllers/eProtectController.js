eAppModule.controller('eProtectController', ['$log',
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
  'sSValidationService',
  'sSCalculationService',
  'riderValidationService',
  'calculatePwrRiderPremiumSvc',
  'calculateAdbRiderPremiumSvc',
  'hospiCashRiderDataFromUserSvc',
  'calculatehospiCashRiderPremiumSvc',
  'getSetCommonDataService',
  'quoteProposalNosDataService',
  'switchDataService',
  'utilityService',
  '$filter',
  'sendBIEmailService',
  function($log, $scope, $state, $http, $rootScope, $ionicHistory, $ionicPlatform, $cordovaDatePicker, $ionicNavBarDelegate,$ionicLoading, eAppServices, commonFormulaSvc, sSValidationService, sSCalculationService, riderValidationService, calculatePwrRiderPremiumSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, getSetCommonDataService, quoteProposalNosDataService, switchDataService, utilityService,$filter,sendBIEmailService) {
    'use strict';
    var vm = this;
    var hospiCashRiderId = 5,
      adbRiderId = 18,
      prodId = 16,
      channelId = 1;

    $scope.inputData = {};
    $scope.outputData = {};
    $scope.calcData = {};
    $scope.dbErrors = [];
    $scope.prodBaseCode = "";

    $scope.title = "eProtect";
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
      if ($state.current.name == 'app.eProtect-home') {
        $state.go("app.eProtect-LAAndProposer");
      } else if ($state.current.name == 'app.eProtect-LAAndProposer') {
        $scope.data = eAppServices.getBuyForDetails();
        $state.go("app.eApp");
      } else if ($state.current.name == 'app.eProtect-estimated') {
        $state.go("app.eProtect-home");
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
    $http.get('js/eApp/eProtect/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
    });
    /*Get validation messgae through json file.*/

    //** Get Data Variables **//
    //** Get Generic Options for Form Elements **//
    var params = {
      "ui_color" : 'grenlinethree',
      "ui_gender": true,
      "ui_age": true,
      "ui_smoke": true,
      "ui_nsap": false,
      "ui_payType": false,
      "ui_sumAssured": true,
      "ui_anualPreminum": false,
      "ui_modelPreminum": false,
      "switch": false,
      "ui_eprotect": true,
    };

    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "BUYPOLFOR", "UPTOAGE", "PT"], ["MPFACTOR"])
      .then(function(result) {
        $scope.params = params;
        $scope.formData = result[0];
        $scope.formData.BUYPOLFOR = {
          0: {
            id: "1",
            name: "Self"
          },
        };
        /*$scope.formDataCalc = {
          "PT": JSON.parse(result[1].PT),
          "MPFACTOR": JSON.parse(result[1].MPFACTOR)
        };*/
        $scope.formDataOut = result[2];

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
          $state.go('app.eProtect-LAAndProposer');
        }

        //***** COPY PASTE - DATE MIN MAX FUNCTION *****//
        eAppServices.getLaAge(prodId, channelId)
          .then(function(result) {
            $scope.data.laMinAge = 18;//result.MinAge;
            $scope.data.laMaxAge = 65;//result.MaxAge;
            $scope.data.laMinAgeYear = '1951-08-24';//result.MinDate;
            $scope.data.laMaxAgeYear = '1998-08-24';//result.MaxDate;
          });
        eAppServices.getPropAge(prodId, channelId)
          .then(function(result) {
            $scope.data.propMinAgeYear = result.MinDate;
            $scope.data.propMaxAgeYear = result.MaxDate;
          });
        //***** COPY PASTE - DATE MIN MAX FUNCTION *****//

      });
    //** Get Data Variables **//

    //** Handle Form Submit for LA Proposer Details Form **//
    $scope.ProceedForLAAndProposerDetails = function(data) {
      $scope.inputData.laName = data.liFirstName + " " + data.liLastName;
      $scope.inputData.laAge = $scope.getAge(data.labfAge);
      $scope.inputData.laGender = parseInt(data.laGender);
      $scope.inputData.sumAssured = ($scope.inputData.sumAssured)?($scope.inputData.sumAssured):(10000000);
      $scope.inputData.smoke = false;
      $scope.inputData.isSelf = (data.BuyingFor == "Self") ? (true) : (false);
      //$scope.inputData.premiumMode = ($scope.inputData.premiumMode)?($scope.inputData.premiumMode):(1);
      //$scope.inputData.pt = ($scope.inputData.pt)?($scope.inputData.pt):(20);
      //$scope.inputData.ppt = ($scope.inputData.ppt)?($scope.inputData.ppt):(10);
      //$scope.inputData.payType = 'REGULAR';
      $scope.inputData.isBP = true;
      $scope.inputData.annualPremiumMinLength = 5;
      $scope.inputData.annualPremiumMaxLength = 10;
      //$scope.inputData.NSAPForLA           = ($scope.inputData.NSAPForLA)?($scope.inputData.NSAPForLA):(false);


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
      $state.go('app.eProtect-home');
    };
    //** Handle Form Submit for LA Proposer Details Form **//

    $scope.riders = {
      'dbErrorPWR'  : [],
      'dbErrorHC'   : [],
      'dbErrorADB'  : [],
      'isHCActive'  : false,
      'isPWRActive' : false,
      'isADBActive' : false,
      'PWRI'        : false,
      'PWRII'       : true,
      'pModeValidation' : false,
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
        $scope.riders.dbErrorHC  = [];
        if ($scope.riders.isPWRActive) {
          $scope.pwrSelectAlert = true;
        } else if (calcData.hospiCashTerm > 0 && calcData.hospiCashDHCB > 0) {
          var validations = riderValidationService.riderPreHCValidateService(calcData, prodId, channelId, $scope.prodBaseCode);
          if(validations.length > 0){
            $scope.showDbErrors = true;
            for(var s=0; s<validations.length; s++){
              $scope.riders.dbErrorHC.push(validations[s][0]);
            }
          }
          else{
            calcData.sumAssuredForRiders = calcData.hospiCashDHCB;
            calcData.riderPpt = calcData.hospiCashTerm;
            //calcData.ppt = calcData.hospiCashTerm;
            hospiCashRiderDataFromUserSvc.setHospiCashData([]);
            var hospiInput = hospiCashRiderDataFromUserSvc.setHospiCashData(calcData);
            //sSValidationService.validateRiderHCProduct(prodId, channelId, calcData).then(function(messages) {
              $scope.showDbErrors = false;
              $scope.dbError = "";
              //if (messages.length === 0) {
                $scope.showDbErrors = false;
                calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospiCashRiderId, prodId, channelId, calcData.base)
                  .then(function(result) {
                    console.log("HC-RIDER-DATA", result);
                    if (result.annualHospiCashPremium === 0 || result.annualHospiCashPremium == undefined) {
                      $scope.showDbErrors = true;
                      $scope.riders.isHCActive = false;
                      $scope.riders.dbErrorHC.push({
                        "Name": "HC",
                        "ErrorMessage": "sum of all rider premiums should not exceed 30% base plan premium"
                      });
                      $scope.dbErrors.push.push({
                        "Name": "HC",
                        "ErrorMessage": "sum of all rider premiums should not exceed 30% base plan premium"
                      });
                      $scope.calcData.riderPremium = "";
                    }
                    else {
                      $scope.hcData = result;
                      $scope.riders.isHCActive = true;
                      $scope.calcData.riderHCPremium = parseFloat(result.riderPremium);
                      $scope.calcData.hcRiderProdCode = result.prodCode;
                      $scope.calcData.hcRidersumAssured = result.sumAssured;
                      $scope.calcData.hcRidermodalFactor = result.modalFactor;
                      $scope.calcData.hcServiceForAnnualFirstYearTax = parseFloat(result.serviceForAnnualFirstYearTax);
                      $scope.calcData.totalHCPremium = parseFloat(result.totalPremium);
                      $scope.calcData.benfitUptoAgeHC = parseFloat(result.benfitUptoAge);
                      $scope.calcData.percentOfBasePremiumHC = parseFloat(result.percentOfBasePremium);
                      $scope.calcData.modalHospiRiderWithServiceTax = parseFloat(result.serviceTaxFactorForFirstAndSecondYear);
                      /*Updated New Key*/
                      $scope.calcData.modalHospiCashPremium = parseFloat(result.modalHospiCashPremium);
                      $scope.calcData.annualHospiCashPremium = parseFloat(result.annualHospiCashPremium);
                      $scope.calcData.hcServiceTaxForModalFirstYear = parseFloat(result.serviceTaxForModalFirstYear);
                      $scope.calcData.hcServiceTaxForAnnualFirstYear = parseFloat(result.serviceTaxForAnnualFirstYear);
                      $scope.calcData.hcTotalModalPremiumWithTaxForFirstYear = parseFloat(result.totalModalPremiumWithTaxForFirstYear);
                      $scope.calcData.hcTotalAnnualPremiumWithTaxForFirstYear = parseFloat(result.totalAnnualPremiumWithTaxForFirstYear);
                    }
                  });
          }
        }
      },
      'resetHC': function() {
        $scope.riders.dbErrorHC  = [];
        if ($scope.riders.isHCActive) {
          $scope.hcData                 = null;
          $scope.riders.isHCActive      = false;
          $scope.calcData               = $scope.outputData;
          $scope.calcData.hospiCashTerm = null;
          $scope.calcData.hospiCashDHCB = null;

          $scope.calcData.modalHospiCashPremium           = null;
          $scope.calcData.annualHospiCashPremium          = null;
          $scope.calcData.hcServiceTaxForModalFirstYear   = null;
          $scope.calcData.hcServiceTaxForAnnualFirstYear  = null;
          $scope.calcData.hcTotalModalPremiumWithTaxForFirstYear = null;
        }
      },
      'PWR': function(calcData) {
        $scope.riders.dbErrorPWR = [];
        if ($scope.riders.isHCActive || $scope.riders.isADBActive) {
          $scope.riderSelectAlert = true;
        } else {
            $scope.calcData.prodCodePWRII ="";$scope.calcData.riderPWRIIPremium =0;$scope.calcData.totalPWRIIPremium =0;$scope.calcData.benfitUptoAgePWRII =0;$scope.calcData.percentOfBasePremiumPWRII =0;$scope.calcData.modalPWRIIPremium =0;$scope.calcData.annualPWRPIIremium =0;$scope.calcData.modalPWRIIWithServiceTax = 0;
            $scope.calcData.prodCodePWRI ="";$scope.calcData.riderPWRIPremium =0;$scope.calcData.totalPWRIPremium =0;$scope.calcData.benfitUptoAgePWRI =0;$scope.calcData.percentOfBasePremiumPWRI =0;$scope.calcData.modalPWRIPremium =0;$scope.calcData.annualPWRPIremium =0;$scope.calcData.modalPWRIWithServiceTax = 0;

            if($scope.riders.PWRI || $scope.riders.PWRII){
              calcData.PWRI = $scope.riders.PWRI;
              calcData.PWRII= $scope.riders.PWRII;
              riderValidationService.riderPrePWRValidateService(calcData, prodId, channelId, $scope.outputData.prodCode)
              .then(function(validation){
                if (validation.length > 0 && $scope.outputData.pwrRiderOption) {
                  $scope.showDbErrors = true;
                  for(var v=0; v<validation.length; v++){
                    $scope.riders.dbErrorPWR.push(validation[v]);
                  }
                }
                else{
                  $scope.riders.isPWRActive = true;
                  var pwrInput = pwrRiderDataFromUserSvc.setPWRRiderData(calcData);
                  $scope.calcData.prodCodePWRII ="";$scope.calcData.riderPWRIIPremium =0;$scope.calcData.totalPWRIIPremium =0;$scope.calcData.benfitUptoAgePWRII =0;$scope.calcData.percentOfBasePremiumPWRII =0;$scope.calcData.modalPWRIIPremium =0;$scope.calcData.annualPWRPIIremium =0;$scope.calcData.modalPWRIIWithServiceTax = 0;
                  $scope.calcData.prodCodePWRI ="";$scope.calcData.riderPWRIPremium =0;$scope.calcData.totalPWRIPremium =0;$scope.calcData.benfitUptoAgePWRI =0;$scope.calcData.percentOfBasePremiumPWRI =0;$scope.calcData.modalPWRIPremium =0;$scope.calcData.annualPWRPIremium =0;$scope.calcData.modalPWRIWithServiceTax = 0;
                  if ($scope.riders.PWRII) {
                    var pwrData1 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, calcData, 2);
                    pwrData1.then(function(result) {
                      console.log('PWR-II-CALCULATION--*-*-*-*>>>>>>>', result);
                      if (result.annualPwrPremium === 0) {
                        $scope.pwrOutputOption1   = false;
                        $scope.showDbErrors       = true;
                        $scope.riders.dbErrorPWR.push({"Name": "PREM", "ErrorMessage": "30% Base of premium is less than rider!"});
                      } else {
                        $scope.pwrData1 = result;
                        $scope.pwrOutputOption1 = true;
                        $scope.riders.isPWRActive = true;
                        $scope.calcData.prodCodePWRII = result.prodCode;
                        $scope.calcData.riderPWRIIageToCalculate = result.ageToCalculate;
                        $scope.calcData.riderPWRIIextraModalPremiumDueToNSAP = result.extraModalPremiumDueToNSAP;
                        $scope.calcData.riderPWRIIextraPremiumDueToNSAP = result.extraPremiumDueToNSAP;
                        $scope.calcData.riderPWRIIextraPremiumDueToNSAPForPrposer = result.extraPremiumDueToNSAPForPrposer;
                        $scope.calcData.riderPWRIIextraPremiumDueToNSAPLA = result.extraPremiumDueToNSAPLA;
                        $scope.calcData.riderPWRIIriderMaturityAge = result.riderMaturityAge;
                        $scope.calcData.riderPWRIIriderPremiumFromTable = result.riderPremiumFromTable;
                        $scope.calcData.riderPWRIItotalModalRiderWithoutServiceTax = result.totalModalRiderWithoutServiceTax;
                        $scope.calcData.riderPWRIIPremium = parseFloat(result.modalPwrPremium);
                        $scope.calcData.totalPWRIIPremium = parseFloat(result.totalModalRiderPremium);
                        $scope.calcData.benfitUptoAgePWRII = parseFloat(result.benfitUptoAge);
                        $scope.calcData.percentOfBasePremiumPWRII = parseFloat(result.percentOfBasePremium);
                        $scope.calcData.annualPWRIIPremium = parseFloat(result.annualPwrPremium);
                        $scope.calcData.PWRIIWithServiceTax = parseFloat(result.modalPwrRiderWithServiceTax);

                        $scope.calcData.annualPWRIIRiderPremium = parseFloat(result.annualPWRRiderPremium);
                        $scope.calcData.riderPWRIIfactorForCal = result.factorForCal;
                        $scope.calcData.riderPWRIImodalFactor = result.modalFactor;
                        $scope.calcData.modalPWRIIRiderPremium = parseFloat(result.modalPWRRiderPremium);
                        $scope.calcData.riderPWRIIserviceTaxForAnnualFirstYear = parseFloat(result.serviceTaxForAnnualFirstYear);
                        $scope.calcData.riderPWRIIserviceTaxForModalFirstYear = parseFloat(result.serviceTaxForModalFirstYear);
                        $scope.calcData.riderPWRIItotalAnnualPremiumWithTaxForFirstYear = parseFloat(result.totalAnnualPremiumWithTaxForFirstYear);
                        $scope.calcData.riderPWRIItotalModalPremiumWithTaxForFirstYear = parseFloat(result.totalModalPremiumWithTaxForFirstYear);
                      }
                    });
                  }
                  if ($scope.riders.PWRI) {
                    var pwrData2 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, calcData, 1);
                    pwrData2.then(function(result) {
                      console.log('PWR-I-CALCULATION--*-*-*-*>>>>>>>', result);
                      if (result.annualPwrPremium === 0) {
                        $scope.pwrOutputOption2 = false;
                        $scope.showDbErrors = true;
                        $scope.riders.dbErrorPWR.push({"Name": "PREM", "ErrorMessage": "30% Base of premium is less than rider!"});
                      } else {
                        $scope.pwrData2 = result;
                        $scope.pwrOutputOption2 = true;
                        $scope.riders.isPWRActive = true;
                        $scope.calcData.prodCodePWRI = result.prodCode;

                        $scope.calcData.riderPWRIageToCalculate = result.ageToCalculate;
                        $scope.calcData.riderPWRIextraModalPremiumDueToNSAP = result.extraModalPremiumDueToNSAP;
                        $scope.calcData.riderPWRIextraPremiumDueToNSAP = result.extraPremiumDueToNSAP;
                        $scope.calcData.riderPWRIextraPremiumDueToNSAPForPrposer = result.extraPremiumDueToNSAPForPrposer;
                        $scope.calcData.riderPWRIextraPremiumDueToNSAPLA = result.extraPremiumDueToNSAPLA;
                        $scope.calcData.riderPWRIriderMaturityAge = result.riderMaturityAge;
                        $scope.calcData.riderPWRIriderPremiumFromTable = result.riderPremiumFromTable;
                        $scope.calcData.riderPWRItotalModalRiderWithoutServiceTax = result.totalModalRiderWithoutServiceTax;

                        $scope.calcData.riderPWRIfactorForCal = result.factorForCal;
                        $scope.calcData.riderPWRImodalFactor = result.modalFactor;
                        $scope.calcData.riderPWRIPremium = parseFloat(result.modalPwrPremium);
                        $scope.calcData.totalPWRIPremium = parseFloat(result.totalModalRiderPremium);
                        $scope.calcData.benfitUptoAgePWRI = parseFloat(result.benfitUptoAge);
                        $scope.calcData.percentOfBasePremiumPWRI = parseFloat(result.percentOfBasePremium);
                        $scope.calcData.modalPWRIPremium = parseFloat(result.modalPwrPremium);
                        $scope.calcData.annualPWRIPremium = parseFloat(result.annualPwrPremium);
                        $scope.calcData.PWRIWithServiceTax = parseFloat(result.modalPwrRiderWithServiceTax);

                        /*New Key*/
                        $scope.calcData.annualPWRIRiderPremium = parseFloat(result.annualPWRRiderPremium);
                        $scope.calcData.modalPWRIRiderPremium = parseFloat(result.modalPWRRiderPremium);
                        $scope.calcData.riderPWRIserviceTaxForAnnualFirstYear = parseFloat(result.serviceTaxForAnnualFirstYear);
                        $scope.calcData.riderPWRIserviceTaxForModalFirstYear = parseFloat(result.serviceTaxForModalFirstYear);
                        $scope.calcData.riderPWRItotalAnnualPremiumWithTaxForFirstYear = parseFloat(result.totalAnnualPremiumWithTaxForFirstYear);
                        $scope.calcData.riderPWRItotalModalPremiumWithTaxForFirstYear = parseFloat(result.totalModalPremiumWithTaxForFirstYear);
                      }
                    });
                  }
                }
              });
            }
            else{
              $scope.riders.isPWRActive = false;
            }
        }
      },
      'resetPWR': function() {
        $scope.riders.dbErrorPWR = [];
        if ($scope.riders.isPWRActive) {
          $scope.pwrData1             =   null;
          $scope.pwrData2             =   null;
          $scope.riders.isPWRActive   =   false;
          $scope.riders.PWRI          =   false;
          $scope.riders.PWRII         =   true;
          $scope.calcData = $scope.outputData;

          $scope.calcData.modalPWRIRiderPremium = null;
          $scope.calcData.modalPWRIIRiderPremium = null;
          $scope.calcData.annualPWRIRiderPremium = null;
          $scope.calcData.annualPWRIIRiderPremium = null;
          $scope.calcData.riderPWRIserviceTaxForModalFirstYear = null;
          $scope.calcData.riderPWRIIserviceTaxForModalFirstYear = null;
          $scope.calcData.riderPWRIserviceTaxForAnnualFirstYear = null;
          $scope.calcData.riderPWRIIserviceTaxForAnnualFirstYear = null;
        }
      },
      'ADB': function(calcData) {
        $scope.riders.dbErrorADB = [];
        if ($scope.riders.isPWRActive) {
          $scope.pwrSelectAlert = true;
        } else if (calcData.sumAssuredForADBRiders <= calcData.premium.sumAssured && calcData.sumAssuredForADBRiders > 0 && calcData.pt > 0) {
          sSValidationService.getsSProductCode(prodId, channelId, calcData.ppt, calcData.premiumMode)
          .then(function(prodCode) {
            var validations = riderValidationService.riderPreADBValidateService(calcData, prodId, channelId, prodCode);
            if(validations.length > 0){
              $scope.showDbErrors = true;
              for(var d=0; d<validations.length; d++){
                $scope.riders.dbErrorADB.push(validations[d][0]);
              }
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
                  $scope.riders.dbErrorADB.push({ "Name":"ADB","ErrorMessage":"30% Base premium is less than rider!"});
                } else {
                  $scope.adbData = result;
                  $scope.adbPremiumOutput = true;
                  $scope.calcData.riderADBPremium = commonFormulaSvc.round(parseFloat(result.abdRiderPremium), 2);
                  $scope.calcData.totalADBPremium = commonFormulaSvc.round(parseFloat(result.totalAdbPremium), 2);
                  $scope.calcData.benfitUptoAgeADB = parseFloat(result.benfitUptoAge);
                  $scope.calcData.percentOfBasePremiumADB = parseFloat(result.percentOfBasePremium);
                  $scope.calcData.modalAdbRiderPremium = parseFloat(result.modalAdbRiderPremium);
                  $scope.calcData.annualAdbRiderPremium = parseFloat(result.annualAdbRiderPremium);
                  $scope.calcData.modalAdbRiderPremiumWithServiceTax = parseFloat(result.modalAdbRiderPremiumWithServiceTax);
                }
              });
            }
          });
        }
      },
      'resetADB': function() {
        $scope.riders.dbErrorADB = [];
        if ($scope.riders.isADBActive) {
          $scope.riders.isADBActive = false;
          $scope.calcData = $scope.outputData;
        }
      }
    };

    /**/
    $scope.calculate = function(inputData) {
      //** Calculation **//
      $scope.dbErrors = [];
      $scope.calcData.hospiCashTerm = null;
      $scope.calcData.hospiCashDHCB = null;
      sSCalculationService.calcsSSumAssured(prodId, channelId, inputData.annualPremium, inputData.ppt, inputData.laGender, inputData.laAge, inputData.isBP)
      .then(function(result){
        if(result){
          $scope.inputData.sumAssured    = result;
          $scope.outputData.sumAssured = result;
        }
        else{
          $scope.inputData.sumAssured    = 205770;
          $scope.outputData.sumAssured = 205770;
        }
    });
      console.log("INPUTDATAAAAAAAAAAAA>>>>>>>>>>>>",$scope.inputData);
      $scope.outputData.ppt = inputData.ppt;
      $scope.outputData.premiumMode = inputData.premiumMode;
      $scope.outputData.basePremium = parseInt(inputData.annualPremium);
      $scope.outputData.pt = eAppServices.getPolyOrPreminumTerm(inputData.ppt, $scope.formDataCalc.PT);
      $scope.outputData.modalPremium = eAppServices.getModalPremiumFromAnnualPremium(inputData.premiumMode, inputData.annualPremium, $scope.formDataCalc.MPFACTOR);
      $scope.outputData.NSAPForLA = (inputData.NSAPForLA !== undefined) ? (inputData.NSAPForLA) : (false);
      $scope.outputData.NSAPForPrposer = false;

      if($scope.data.BuyingFor == "Self"){
        $scope.outputData.NSAPForPrposer         = $scope.outputData.NSAPForLA;
      }else{
        $scope.outputData.NSAPForPrposer         = false;
      }

      sSValidationService.validateBaseProduct(prodId, channelId, inputData)
        .then(function(messages) {
          if (messages.length === 0) {
            $scope.showDbErrors = false;
            $scope.doCalcBasePremium(prodId, channelId, inputData);
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
      //** Calculation **//
    };
    $scope.doCalcBasePremium = function(prodId, channelId, userInput) {
      sSCalculationService.calculateSsTotalPremium(prodId, channelId, userInput)
        .then(function(totalBasePremiumVals) {
          console.log("totalBasePremiumVals>::>>::>>", totalBasePremiumVals);
          var BI = totalBasePremiumVals.bi;
          BI.then(function(res){
              $scope.data.biCalculation=res;
            //var guaranteedAnnualBenefits = totalBasePremiumVals.gVals;
            /**Chart Code **/
            $scope.outputData.sB = res.sB;

            /*Min Max value*/
            $scope.minimum=arrayMin($scope.outputData.sB);
              $scope.maximum=arrayMax($scope.outputData.sB);
            /*****Find out minimum and maximum from given array*****/
              function arrayMin(arr) {
              var len = arr.length, min = Infinity;
              while (len--) {
                if (arr[len] < min) {
                  min = arr[len];
                }
              }
              return min;
            };

            function arrayMax(arr) {
              var len = arr.length, max = -Infinity;
              while (len--) {
                if (arr[len] > max) {
                  max = arr[len];
                }
              }
              return max;
            };

            $scope.outputData.policyYearArr = res.policyYearArr;
            if(res.sB.length > 0){
              $scope.outputData.guaranteedAnnualBenefits = 0;
              for(var n=0; n < res.sB.length; n++){
                if(res.sB[n] != '-'){
                  $scope.outputData.guaranteedAnnualBenefits += res.sB[n];
                }
              }
            }
            if(res.gMaturityBenfit.length > 0){
              $scope.outputData.gMaturityBenfit = 0;
              for(var n=0; n < res.gMaturityBenfit.length; n++){
                if(res.gMaturityBenfit[n] != '-'){
                  $scope.outputData.gMaturityBenfit += res.gMaturityBenfit[n];
                }
              }
            }
            if(res.gMaturityAdditions.length > 0){
              $scope.outputData.gMaturityAdditions = 0;
              for(var n=0; n < res.gMaturityAdditions.length; n++){
                if(res.gMaturityAdditions[n] != '-'){
                  $scope.outputData.gMaturityAdditions += res.gMaturityAdditions[n];
                }
              }
            }


               var y = 200;
               $scope.outputData.sB.push(y);
               y = 160;
               $scope.outputData.sB.push(y);
               $scope.outputData.finalArray=[];

              var getCalulatedHeight=function(mi,ma,currentValue){

              var ageDiffHighLow=Number(ma)-Number(mi);
            /***Covert the values between 0 to 100****/
              if(Number((currentValue - mi) / ageDiffHighLow * 100) <= 100 &&  Number((currentValue - mi) / ageDiffHighLow * 100)>0){
                return (currentValue - mi) / ageDiffHighLow * 100;
              }
              else if(Number((currentValue - mi) / ageDiffHighLow * 100)<=1) {
                return  2;
              }
            };

              for (var i = 0; i < $scope.outputData.sB.length; i++) {
                if(angular.isNumber($scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1]) ||i == $scope.outputData.sB.length - 1||i == $scope.outputData.sB.length - 2){
                  if($scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1] > 0 ||i == $scope.outputData.sB.length - 1||i == $scope.outputData.sB.length - 2){
                if(i == $scope.outputData.sB.length - 1 || i == $scope.outputData.sB.length - 2){
                  var x = {
                    key: $scope.outputData.policyYearArr[i],
                    value: 85,//$scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1],
                    height: 150,//Math.floor((Math.random() * 100) + 1),
                    checked: false
                  };
                }
                else{
                  var x = {
                    key: $scope.outputData.policyYearArr[i],
                    value: $scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1],
                    height: getCalulatedHeight($scope.minimum,$scope.maximum,$scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1]),
                    checked: false
                  };
                }
                if($scope.inputData.pt == 20){
                  if(i == 16){
                    x.checked = true;
                    $scope.outputData.selected = $scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1];
                  }
                }
                if($scope.inputData.pt == 12){
                  if(i == 8){
                    x.checked = true;
                    $scope.outputData.selected = $scope.outputData.sB[$scope.outputData.policyYearArr[i] - 1];
                  }
                }
                  $scope.outputData.finalArray.push(x);
                  }
                }
              }
              console.log("finalArray", $scope.outputData.finalArray);
                /**Chart Code**/
          });

          $scope.outputData.premium = totalBasePremiumVals;
          $scope.outputData.premium.sumAssured = $scope.outputData.sumAssured;
          $scope.outputData.basePremium = totalBasePremiumVals.basePremium;
          $scope.outputData.modalFactor = totalBasePremiumVals.modalFactor;
          $scope.outputData.modalNsapPremium = totalBasePremiumVals.modalNSAPPremium;
          $scope.outputData.modalPremium = totalBasePremiumVals.modalPremium;
          //$scope.outputData.nsapPremium = totalBasePremiumVals.nsapPremium;
          $scope.outputData.prodCode  = totalBasePremiumVals.prodCode;
          $scope.outputData.serviceForAnnualFirstYearTax = totalBasePremiumVals.serviceForAnnualFirstYearTax;
          $scope.outputData.serviceForAnnualSecondYearTax = totalBasePremiumVals.serviceForAnnualSecondYearTax;
          $scope.outputData.serviceForFirstYearTax = totalBasePremiumVals.serviceForFirstYearTax;
          $scope.outputData.serviceForSecondYearTax = totalBasePremiumVals.serviceForSecondYearTax;
          $scope.outputData.sumAssured = totalBasePremiumVals.sumAssured;
          $scope.outputData.totalAnnualPremium = totalBasePremiumVals.totalAnnualPremium;
          $scope.outputData.totalAnnualPremiumWithTaxForFirstYear = totalBasePremiumVals.totalAnnualPremiumWithTaxForFirstYear;
          $scope.outputData.totalAnnualPremiumWithTaxForSecondYsSr = totalBasePremiumVals.totalAnnualPremiumWithTaxForSecondYsSr;
          $scope.outputData.totalModalPremium = totalBasePremiumVals.totalModalPremium;
          $scope.outputData.totalModalPremiumWithTaxForFirstYear = totalBasePremiumVals.totalModalPremiumWithTaxForFirstYear;
          $scope.outputData.totalModalPremiumWithTaxForSecondYsSr = totalBasePremiumVals.totalModalPremiumWithTaxForSecondYsSr;

          $scope.outputData.fsBasePremiumOutput = true;
          //var eProtectBi = doGenarateFSBi(prodId, channelId, userInput, totalBasePremiumVals.basePremium, totalBasePremiumVals.sumAssured);
          $scope.eProtectBiOutput = true;
          eAppServices.setOutputDetails($scope.outputData);
          eAppServices.setCalcDetails($scope.outputData);
          $state.go('app.eProtect-estimated');
        });
    };

    /**/
    $scope.updateRiderSA = function(data) {
      $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
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
      $state.go("app.eProtect-LAAndProposer");
    };

    $scope.showPopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = true;
    };

    $scope.closePopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = false;
    };

    $scope.goToHomePage = function() {
      setAnimate($ionicHistory);
      $state.go('app.eProtect-home');
    };

    /*Toggle Chart*/
    $scope.showHideChart = false;
    $scope.toggleChart = function(){
      $scope.showHideChart = !$scope.showHideChart;
    }
    $scope.getHCRTerm = function(ppt,term){
      return Number(ppt) >= Number(term);
    }

    /**HCRider Validation for annual payment mode**/
    $scope.checkPremiumMode = function(pMode, calData){
      if(pMode != 1){
        $scope.riders.isHCActive = false;
        $scope.riders.pModeValidation = true;
      }
      else{
        $scope.riders.HC(calData);
      }
    }

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
          var eProtectQuoteData = {};
          var eProtectRidersData = [[]];
          var quoteCustomJson = {
            quoteData: [],
            adbRiderData: [],
            hospiRiderData: [],
            pwRiderIData: [],
            pwRiderIIData: []
          };
          /**1.BI Ref No**/
          eProtectQuoteData.PkQuotationId = biRefNo.BiQuoteNo;
          /**2 - >  1 = Eapp, 2 = OLS **/
          eProtectQuoteData.ReferenceSystemTypeId = "1";
          /**3 - > Selected Product ID**/
          eProtectQuoteData.FkProductId = currentData.prodId;
          /**4 - > Selected Product Plan Code**/
          eProtectQuoteData.ProductPlanCode = $scope.calcData.prodCode;
          /**5-> Logged in Agent Id**/
          eProtectQuoteData.FkAgentCode = "" + userData.agentId;
          /**Buying For Screen**/
          /**6 -> Buying For Screen**/
          eProtectQuoteData.BuyingFor = $scope.data.BuyingFor;
          /**7 -> liFirstName**/
          eProtectQuoteData.LAFirstName = $scope.data.liFirstName;
          /**8 -> liLastName**/
          eProtectQuoteData.LALastName = $scope.data.liLastName;
          /**9 -> LAGender**/
          eProtectQuoteData.LAGender = "" + (($scope.data.laGender == 0) ? "Male" : "Female");
          /**10 -> LADOB**/
          eProtectQuoteData.LADOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          /**11 -> propFirstName**/
          /**12 -> propLastName**/
          /**13 -> proposerGender**/
          /**14 -> ProposerDOB**/
          if (eProtectQuoteData.BuyingFor != "Self") {
            eProtectQuoteData.ProposerFirstName = $scope.data.propFirstName;
            eProtectQuoteData.ProposerLastName = $scope.data.propLastName;
            eProtectQuoteData.ProposerGender = "" + (($scope.data.proposerGender == 0) ? "Male" : "Female");
            eProtectQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.proposerAge), 'MM/dd/yyyy');
          } else {
            eProtectQuoteData.ProposerFirstName = $scope.data.liFirstName;
            eProtectQuoteData.ProposerLastName = $scope.data.liLastName;
            eProtectQuoteData.ProposerGender = "" + (($scope.data.laGender == 0) ? "Male" : "Female");
            eProtectQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          }
          /**Input/Output Screen**/
          /**15 -> IsSmoker**/
          if ($scope.calcData.smoke != undefined) {
            eProtectQuoteData.IsSmoker = ($scope.calcData.smoke == "nonsmoke") ? "" + 0 : "" + 1;
          } else {
            eProtectQuoteData.IsSmoker = "" + 0;
          }
          /**16->benfitUptoAge**/
          if ($scope.calcData.benfitUptoAge != undefined) {
            eProtectQuoteData.UptoAge = "" + $scope.calcData.benfitUptoAge;
          } else {
            eProtectQuoteData.UptoAge = null;
          }
          /**17-> PayType - (Limited/Regular) if applicable **/
          eProtectQuoteData.PayType = null;
          /**18-> BenefitType - (Endowment/Money Back)(Fixed Monthly Payout/Lumpsum + Increasing Payout) if applicable **/
          eProtectQuoteData.BenefitType = null;
          /**19->PremiumPaymentTerm**/
          eProtectQuoteData.PremiumPaymentTerm = "" + $scope.calcData.ppt;
          /**20->Policy Term**/
          eProtectQuoteData.PolicyTerm = "" + $scope.calcData.pt;
          /**21->SumAssured/Life Cover**/
          eProtectQuoteData.SumAssured = $scope.outputData.premium.sumAssured;
          /**22->GuaranteedIncomePeriod**/
          eProtectQuoteData.GuaranteedIncomePeriod = null;
          /**23->GuaranteedIncomePeriod**/
          eProtectQuoteData.MaturityPayoutPeriod = null;
          /**24->MaturityPayoutFrequency**/
          eProtectQuoteData.MaturityPayoutFrequency = null;
          /**25->FlexiBenefitPeriod**/
          eProtectQuoteData.FlexiBenefitPeriod = null;//$scope.outputData.benefitPeriod;
          /**26->AnnualBasePremium**/
          eProtectQuoteData.AnnualBasePremium = $scope.outputData.premium.totalAnnualPremium;
          /**27->Mode**/
          eProtectQuoteData.Mode = "" + $scope.calcData.premiumMode;
          /**28->ModalFactor**/
          eProtectQuoteData.ModalFactor = $scope.outputData.premium.modalFactor;
          /**29->ModalPremium**/
          eProtectQuoteData.ModalPremium = $scope.outputData.premium.modalPremium;
          /**30->NSAPForLA**/
          if ($scope.calcData.NSAPForLA !== undefined) {
            eProtectQuoteData.IsNSAP = "" + $scope.calcData.NSAPForLA;
          } else {
            eProtectQuoteData.IsNSAP = "" + 0;
          }
          /**31->ServiceTax**/
          eProtectQuoteData.ServiceTax = $scope.outputData.premium.serviceForFirstYearTax;
          /**32->PremiumPayable**/
          eProtectQuoteData.PremiumPayable = $scope.outputData.premium.totalModalPremiumWithTaxForFirstYear;
          /**33->PremiumPayable**/
          eProtectQuoteData.IsInYourPresence = null;
          /**34->PremiumPayable**/
          eProtectQuoteData.EstimatedReturnRate = null;
          /**Default value is 0, For email functionality**/
          /**35-IsEmail**/
          /**36-ToRecipients**/
          /**37-CcRecipients**/
        /*  if (isFromEmail) {
            eProtectQuoteData.IsEmail = "" + 1;
            eProtectQuoteData.ToRecipients = emailData.To;
            eProtectQuoteData.CcRecipients = emailData.Cc;
          } else {
            eProtectQuoteData.IsEmail = "" + 0;
            eProtectQuoteData.ToRecipients = null;
            eProtectQuoteData.CcRecipients = null;
          }*/
          /**38-> create JSON for IRDA **/
          eProtectQuoteData.Json = createeProtectIRDAQuotePDFJson(biRefNo.BiQuoteNo);
          $log.debug("eProtectQuoteData...........", eProtectQuoteData);
    /**************************************************************************************/
    /**custome json creation for quote cpmparison***/
          quoteCustomJson.quoteData.push({
            ReferenceSystemTypeId: eProtectQuoteData.ReferenceSystemTypeId,
            FkProductId: eProtectQuoteData.FkProductId,
            ProductPlanCode: eProtectQuoteData.ProductPlanCode,
            FkAgentCode: eProtectQuoteData.FkAgentCode,
            BuyingFor: eProtectQuoteData.BuyingFor,
            LAFirstName: eProtectQuoteData.LAFirstName,
            LALastName: eProtectQuoteData.LALastName,
            LAGender: eProtectQuoteData.LAGender,
            LADOB: eProtectQuoteData.LADOB,
            ProposerFirstName: eProtectQuoteData.ProposerFirstName,
            ProposerLastName: eProtectQuoteData.ProposerLastName,
            ProposerGender: eProtectQuoteData.ProposerGender,
            ProposerDOB: eProtectQuoteData.ProposerDOB,
            IsSmoker: eProtectQuoteData.IsSmoker,
            UptoAge: eProtectQuoteData.UptoAge,
            PayType: eProtectQuoteData.PayType,
            BenefitType: eProtectQuoteData.BenefitType,
            PremiumPaymentTerm: eProtectQuoteData.PremiumPaymentTerm,
            PolicyTerm: eProtectQuoteData.PolicyTerm,
            SumAssured: eProtectQuoteData.SumAssured,
            GuaranteedIncomePeriod: eProtectQuoteData.GuaranteedIncomePeriod,
            MaturityPayoutPeriod: eProtectQuoteData.MaturityPayoutPeriod,
            MaturityPayoutFrequency: eProtectQuoteData.MaturityPayoutFrequency,
            FlexiBenefitPeriod: eProtectQuoteData.FlexiBenefitPeriod,
            AnnualBasePremium: eProtectQuoteData.AnnualBasePremium,
            Mode: eProtectQuoteData.Mode,
            ModalFactor: eProtectQuoteData.ModalFactor,
            ModalPremium: eProtectQuoteData.ModalPremium,
            IsNSAP: eProtectQuoteData.IsNSAP,
            ServiceTax: eProtectQuoteData.ServiceTax,
            PremiumPayable: eProtectQuoteData.PremiumPayable,
            IsInYourPresence: eProtectQuoteData.IsInYourPresence,
            EstimatedReturnRate: eProtectQuoteData.EstimatedReturnRate
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
            eProtectRidersData = [[]];
            eProtectRidersData = $scope.createRidersData(userData, currentData, biRefNo.BiQuoteNo, selectedRiderIds);
              $log.debug("*******eProtectRidersData*******",eProtectRidersData);
          }
          //if same quote no need to save the data again - method will check is Quote save required
          quoteProposalNosDataService.isQuoteDataInsertRequired(JSON.stringify(quoteCustomJson)).
          then(function(isRequired) {
            if (isRequired) {
              quoteProposalNosDataService.updateBIQuoteNumberUsedStatus(biRefNo.BiQuoteNo).then(function() {
                quoteProposalNosDataService.insertQuoteData(eProtectQuoteData);
                if ($scope.hcData || $scope.adbData || $scope.pwrData1 || $scope.pwrData2) {
                    $log.debug("########eProtectRidersData########",eProtectRidersData);
                  quoteProposalNosDataService.insertRidersData(eProtectRidersData);
                }
              });
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  $scope.hidesendEmailPopup();
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, eProtectQuoteData.Json,eProtectQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,eProtectQuoteData.Json,eProtectQuoteData.FkProductId);
                }
              }
            } else {
              $log.debug("*******Same Quote Data already available*******");
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, eProtectQuoteData.Json,eProtectQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,eProtectQuoteData.Json,eProtectQuoteData.FkProductId);
                }
                $scope.hidesendEmailPopup();
              }
            }
          });
        });
    };

    $scope.createRidersData = function(userData, currentData, biQuoteNo, selectedRiderIds) {
      var eProtectRidersData = [
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
          eProtectRidersData[i] = adbArray;
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
          eProtectRidersData[i] = hospiArray;
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
          eProtectRidersData[i] = pwr2Array;
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
          eProtectRidersData[i] = pwr1Array;
        }
      }
      return eProtectRidersData;
    };

    function createeProtectIRDAQuotePDFJson(BiQuoteNo) {
      $log.debug("CalcData",$scope.calcData);
      var userData = getSetCommonDataService.getCommonData();
      var currentData = getSetCommonDataService.getCurrentProdData();

      var selectedRiderData={};
      var eProtectIRDAQuotePDFJson = {"PDF":{}};
      eProtectIRDAQuotePDFJson.PDF.quoteNo = BiQuoteNo;
      eProtectIRDAQuotePDFJson.PDF.proposalNo = "";
      eProtectIRDAQuotePDFJson.PDF.policyNo = "";
      eProtectIRDAQuotePDFJson.PDF.uin = currentData.prodUIN;
      eProtectIRDAQuotePDFJson.PDF.productCode = $scope.calcData.prodCode;
      eProtectIRDAQuotePDFJson.PDF.riderCode = [];
      eProtectIRDAQuotePDFJson.PDF.illustrationGeneratedBy = userData.channelName;
      eProtectIRDAQuotePDFJson.PDF.illustrationDate = utilityService.getDisplayDate(new Date(), 'dd-MM-yyyy');

      eProtectIRDAQuotePDFJson.PDF.lifeAssuredDetail = {
        name: $scope.data.liFirstName + " " + $scope.data.liLastName,
        gender: $scope.data.laGender==0?"Male":"Female",
        age: $scope.getAge($scope.data.labfAge),
      };
      eProtectIRDAQuotePDFJson.PDF.proposerDetail = {};
      if ($scope.data.BuyingFor!="Self") {
        eProtectIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.propFirstName + " " + $scope.data.propLastName;
        eProtectIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.proposerGender==0?"Male":"Female";
        eProtectIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.proposerAge);
      } else {
        eProtectIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.liFirstName + " " + $scope.data.liLastName;
        eProtectIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.laGender==0?"Male":"Female";
        eProtectIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.labfAge);
      }
      eProtectIRDAQuotePDFJson.PDF.benefitAndPremiumDetail = {
        planName: "" + currentData.prodLbl,
        policyTerm: "" + $scope.outputData.pt,
        premiumPaymentTerm: "" + $scope.inputData.ppt,
        premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
        benefitUptoAge:eProtectIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
        sumAssured: $scope.calcData.sumAssured,
        annualPremium: $scope.calcData.basePremium,
        modalPremium: $scope.calcData.modalPremium,
        nsapExtra:$scope.calcData.modalNsapPremium,
        serviceTax1stYear: $scope.calcData.serviceForAnnualFirstYearTax,
        serviceTax2ndYear:$scope.calcData.serviceForAnnualSecondYearTax,
        rider: [],
        totalPremium1stYear: $scope.calcData.totalAnnualPremiumWithTaxForFirstYear,
        totalPremium2ndYear:$scope.calcData.totalAnnualPremiumWithTaxForSecondYsSr

      };
      if ($scope.hcData && $scope.riders.isHCActive) {
        eProtectIRDAQuotePDFJson.PDF.riderCode.push($scope.hcData.prodCode);
        eProtectIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: hospiCashRiderId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.ppt,
          premiumPaymentTerm: "" + $scope.outputData.riderPpt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          sumAssured: "-",
          benefitUptoAge: eProtectIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:"" + 0,
          annualPremium: $scope.calcData.annualHospiCashPremium,
          modalPremium:  $scope.hcData.modalHospiCashPremium,
          serviceTax1stYear: $scope.hcData.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.hcData.serviceTaxForModalFirstYear
        });
      }

      if ($scope.adbData && $scope.riders.isADBActive) {
        eProtectIRDAQuotePDFJson.PDF.riderCode.push($scope.adbData.prodCode);
        eProtectIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: adbRiderId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          sumAssured: "-",
          benefitUptoAge: eProtectIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:"" + 0,
          annualPremium:  $scope.calcData.annualAdbRiderPremium ,
          modalPremium:$scope.adbData.modalAdbRiderPremium,
          serviceTax1stYear:$scope.adbData.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.adbData.serviceTaxForModalFirstYear

        });
      }
      if ($scope.pwrData1 && $scope.riders.isPWRActive) {
        eProtectIRDAQuotePDFJson.PDF.riderCode.push($scope.pwrData1.prodCode);
        eProtectIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: pwrRiderId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          sumAssured: "-",
          benefitUptoAge: eProtectIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:$scope.calcData.riderPWRIIextraPremiumDueToNSAPLA,
          annualPremium: $scope.pwrData1.annualPWRRiderPremium,
          modalPremium: $scope.pwrData1.modalPWRRiderPremium,
          serviceTax1stYear: $scope.pwrData1.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.pwrData1.serviceTaxForModalFirstYear
        });
      }
      if ($scope.pwrData2 && $scope.riders.isPWRActive) {
        eProtectIRDAQuotePDFJson.PDF.riderCode.push($scope.pwrData2.prodCode);
        eProtectIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, { FkRiderId: pwrRiderCiId.toString()}, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
          sumAssured: "-",
          benefitUptoAge: eProtectIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
          nsapExtra:$scope.calcData.riderPWRIIextraPremiumDueToNSAPLA,
          annualPremium: $scope.calcData.annualPWRIRiderPremium,
          modalPremium: $scope.pwrData2.modalPWRRiderPremium,
          serviceTax1stYear: $scope.pwrData2.serviceTaxForModalFirstYear,
          serviceTax2ndYear:$scope.pwrData2.serviceTaxForModalFirstYear
        });
      }

      $log.debug("benefitIllustration",$scope.data.biCalculation);
      eProtectIRDAQuotePDFJson.PDF.benefitIllustration ={
        endOfPolicyYear:$scope.data.biCalculation.policyYearArr,
        annualPremium:$scope.data.biCalculation.annualisedPrem,
        guaranteedDeathBenefit:$scope.data.biCalculation.deathBenfit,
        guaranteedMaturityBenefit:$scope.data.biCalculation.gMaturityBenfit,
        guaranteedMaturityAddition:$scope.data.biCalculation.gMaturityAdditions,
        guaranteedSurvivalBenefit:$scope.data.biCalculation.sB,
        guaranteedSurrenderValue:$scope.data.biCalculation.sv,
        specialSurrenderValue:$scope.data.biCalculation.splSv,
      };
      return JSON.stringify(eProtectIRDAQuotePDFJson);
      //return eProtectIRDAQuotePDFJson;
    }

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

    $scope.populatePPT = function(inputdata){
        if(inputdata.laAge && inputdata.pt){
          if(inputdata.pt >= 60){
            $scope.inputData.ppt  = Number(inputdata.pt) - inputdata.laAge;
          }
          else{
            $scope.inputData.ppt  = inputdata.pt;
          }
        }
    }


  }
]);
