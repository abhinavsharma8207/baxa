eAppModule.controller('secureincomeController', ['$log',
  '$scope',
  '$q',
  '$state',
  '$http',
  '$rootScope',
  '$cordovaDatePicker',
  '$ionicHistory',
  '$ionicPlatform',
  '$ionicLoading',
  '$ionicNavBarDelegate',
  'eAppServices',
  'commonFormulaSvc',
  'sIValidationService',
  'secureIncomeObjectService',
  'commonDbProductCalculation',
  'sICalculationService',
  'hospiCashRiderDataFromUserSvc',
  'calculatehospiCashRiderPremiumSvc',
  'calculateAdbRiderPremiumSvc',
  'riderValidationService',
  'getSetCommonDataService',
  'quoteProposalNosDataService',
  'switchDataService',
  'pwrRiderDataFromUserSvc',
  'calculatePwrRiderPremiumSvc',
  'utilityService',
  '$filter',
  'sendBIEmailService',
  function($log, $scope, $q, $state, $http, $rootScope, $cordovaDatePicker, $ionicHistory, $ionicPlatform, $ionicLoading,$ionicNavBarDelegate, eAppServices, commonFormulaSvc, sIValidationService, secureIncomeObjectService, commonDbProductCalculation, sICalculationService, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, calculateAdbRiderPremiumSvc, riderValidationService, getSetCommonDataService, quoteProposalNosDataService, switchDataService, pwrRiderDataFromUserSvc, calculatePwrRiderPremiumSvc, utilityService,$filter,sendBIEmailService) {
    'use strict';
    var vm = this;
    var hospiCashRiderId = 5,
      adbRiderId = 4,
      prodId = 9,
      channelId = 1,
      pwrRiderId = 6,
      pwrRiderCiId = 7,
      pwrOption = 1;


          $scope.inputData = {};
          $scope.outputData = {};
          $scope.calcData = {};
          $scope.dbErrors = [];
          $scope.prodBaseCode = "";

          $scope.title = "Secure Income";
          $scope.data = {};
          $scope.data.BuyingFor = 'Self';
          $scope.data.laGender = 0;
          $scope.data.liFirstName = "";
          $scope.data.liLastName = "";
          $scope.data.proposerGender = 0;
          $scope.data.propFirstName = "";
          $scope.data.propLastName = "";
          $scope.data.minLaFirstLastLength = 1;
          $scope.data.maxLaFirstLastLength = 50;

          $scope.validationMessage = {};
          $scope.premiumWithTaxes = false;
          $scope.showPopupToGoForLAAndProposerDetails = false;
          $scope.isIllustrationsSelected = true;
          $scope.isBrochureSelected = false;
          //** Back Button Funtionality **//
          $scope.goBack = function() {
            if ($state.current.name == 'app.secureIncome-home') {
              $state.go("app.secureIncome-LAAndProposer");
            } else if ($state.current.name == 'app.secureIncome-LAAndProposer') {
              $scope.data = eAppServices.getBuyForDetails();
              $state.go("app.eApp");
            } else if ($state.current.name == 'app.secureIncome-estimated') {
                $state.go("app.secureIncome-home");
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
          $http.get('js/eApp/secureIncome/validationMessage.json').then(function(responce) {
            $scope.validationMessage = responce;
          });
          /*Get validation messgae through json file.*/

          //** Get Data Variables **//
          //** Get Generic Options for Form Elements **//
          var params = {
            "ui_color": 'lilacline',
            "ui_gender": true,
            "ui_age": true,
            "ui_smoke": false,
            "ui_nsap": true,
            "ui_payType": false,
            "ui_termExtra": {
              "label": "Guaranteed Income Period",
              "default": "10",
              "terms": {}
            },
            //"ui_pmode"          : true,
            "ui_sumAssured": false,
            "ui_anualPreminum": true,
            "ui_modelPreminum": true,
            "switch": false
          };

          var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "BUYPOLFOR", "PMODE", "PPT"], ["PT", "MPFACTOR","GIBPERIOD"])
            .then(function(result) {
              $scope.params = params;
              $scope.formData = result[0];
              $scope.formDataCalc = {
                "GIBPERIOD":  JSON.parse(result[1].GIBPERIOD),
                "PT": JSON.parse(result[1].PT),
                "MPFACTOR": JSON.parse(result[1].MPFACTOR)
              };

              /**for now taken hardcoded values once anil change mappinfg in DB will remove hardcoding result[1].GIBPERIOD**/
              var GIBPERIOD = {"5":["10"],"7":["10"],"10":["10"]};
              $scope.params.ui_termExtra.terms = GIBPERIOD;
              $log.debug("the response coming from the result",   params.ui_termExtra.terms);
              $scope.params = params;

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
                $state.go('app.secureincome-LAAndProposer');
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

            });
          //** Get Data Variables **//

          //** Handle Form Submit for LA Proposer Details Form **//
          $scope.ProceedForLAAndProposerDetails = function(data) {
            $scope.inputData.laName = data.liFirstName + " " + data.liLastName;
            $scope.inputData.laAge = $scope.getAge(data.labfAge);
            $scope.inputData.laGender = parseInt(data.laGender);
            $scope.inputData.annualPremium = ($scope.inputData.annualPremium)?($scope.inputData.annualPremium):(50000);
            $scope.inputData.isSelf = (data.BuyingFor == "Self") ? (true) : (false);
            $scope.inputData.premiumMode = ($scope.inputData.premiumMode)?($scope.inputData.premiumMode):(1);
            $scope.inputData.pt = ($scope.inputData.pt)?($scope.inputData.pt):(20);
            $scope.inputData.ppt = ($scope.inputData.ppt)?($scope.inputData.ppt):(10);
            $scope.inputData.payType = 'REGULAR';
            $scope.inputData.isBP = true;
            $scope.inputData.annualPremiumMinLength = 5;
            $scope.inputData.annualPremiumMaxLength = 10;
            $scope.inputData.NSAPForLA = ($scope.inputData.NSAPForLA)?($scope.inputData.NSAPForLA):(false);

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
            $state.go('app.secureincome-home');
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
              $scope.riders.dbErrorHC = [];
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
                    $scope.showDbErrors = false;
                    $scope.dbError = "";
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
                            $scope.calcData.totalHCPremium = parseFloat(result.totalPremium);
                            $scope.calcData.benfitUptoAgeHC = parseFloat(result.benfitUptoAge);
                            $scope.calcData.percentOfBasePremiumHC = parseFloat(result.percentOfBasePremium);
                            $scope.calcData.modalHospiCashPremium = parseFloat(result.modalHospiCashPremium);
                            $scope.calcData.annualHospiCashPremium = parseFloat(result.annualHospiCashPremium);
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
              $scope.riders.dbErrorHC = [];
              if ($scope.riders.isHCActive) {
                $scope.riders.isHCActive = false;
                $scope.calcData = $scope.outputData;
                $scope.calcData.hospiCashTerm = null;
                $scope.calcData.hospiCashDHCB = null;

                $scope.calcData.modalHospiCashPremium = null;
                $scope.calcData.annualHospiCashPremium = null;
                $scope.calcData.hcServiceTaxForModalFirstYear = null;
                $scope.calcData.hcServiceTaxForAnnualFirstYear = null;
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
                            console.log('PWR-CALCULATION--*-*-*-*>>>>>>>', result);
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
                              /*New Key*/
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
                $scope.riders.isPWRActive = false;
                $scope.riders.PWRI  = false;
                $scope.riders.PWRII = true;
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
              } else if (calcData.sumAssuredForADBRiders > 0 && calcData.pt > 0) {
                sIValidationService.getProductCode(prodId, channelId, calcData.ppt)
                .then(function(prodCode) {
                  $scope.calcData.ADBRider = true;
                  $scope.calcData.riderterm = calcData.ppt;
                riderValidationService.riderPreADBValidateService($scope.calcData, prodId, channelId, prodCode)
                .then(function(message){
                  if(message.length > 0){
                    $scope.riders.dbErrorADB = [];
                    $scope.showDbErrors = true;
                    $scope.calcData.ADBRider = false;
                    for(var d = 0; d < message.length; d++){
                      $scope.riders.dbErrorADB.push(message[d]);
                    }

                    $scope.calcData.modalAdbRiderPremium = null;
                    $scope.calcData.annualAdbRiderPremium = null;
                    $scope.calcData.riderADBserviceTaxForModalFirstYear = null;
                    $scope.calcData.riderADBserviceTaxForAnnualFirstYear = null;
                    $scope.calcData.riderADBtotalAnnualPremiumWithTaxForFirstYear = null;
                    $scope.calcData.riderADBtotalModalPremiumWithTaxForFirstYear = null;
                  }
                  else{
                    $scope.riders.isADBActive = true;
                    $scope.calcData.ADBRider = true;
                    $scope.calcData.riderterm = calcData.pt;
                    var adbData = calculateAdbRiderPremiumSvc.calculateABDRiderPremium(adbRiderId, prodId, channelId, calcData);
                    adbData.then(function(result) {
                      console.log("ADB RIDERS DATA:>>>>", result);
                      if (result.annualAdbRiderPremium === 0) {
                        $scope.riders.dbErrorADB = [];
                        //$scope.riders.isADBActive = false;
                        $scope.adbData = false;
                        $scope.showDbErrors = true;
                        $scope.riders.dbErrorADB.push({ "Name":"ADB","ErrorMessage":"Rider sum sssured can not be greater than the sum assured of the base policy!"});
                      } else {
                        $scope.riders.dbErrorADB = [];
                        $scope.showDbErrors = false;
                        $scope.adbData = result;
                        $scope.adbPremiumOutput = true;
                        $scope.calcData.riderADBPremium = commonFormulaSvc.round(parseFloat(result.abdRiderPremium), 2);
                        $scope.calcData.totalADBPremium = commonFormulaSvc.round(parseFloat(result.totalAdbPremium), 2);
                        $scope.calcData.benfitUptoAgeADB = parseFloat(result.benfitUptoAge);
                        $scope.calcData.riderADBmodalFactor = result.modalFactor;
                        $scope.calcData.riderADBprodCode = result.prodCode;
                        $scope.calcData.riderADBserviceForAnnualFirstYearTax = result.serviceForAnnualFirstYearTax;
                        $scope.calcData.percentOfBasePremiumADB = parseFloat(result.percentOfBasePremium);
                        $scope.calcData.modalAdbRiderPremiumWithServiceTax = parseFloat(result.modalAdbRiderPremiumWithServiceTax);
                        /*New Key*/
                        $scope.calcData.modalAdbRiderPremium = parseFloat(result.modalAdbRiderPremium);
                        $scope.calcData.annualAdbRiderPremium = parseFloat(result.annualAdbRiderPremium);
                        $scope.calcData.riderADBserviceTaxForModalFirstYear = parseFloat(result.serviceTaxForModalFirstYear);
                        $scope.calcData.riderADBserviceTaxForAnnualFirstYear = parseFloat(result.serviceTaxForAnnualFirstYear);
                        $scope.calcData.riderADBtotalAnnualPremiumWithTaxForFirstYear = result.totalAnnualPremiumWithTaxForFirstYear;
                        $scope.calcData.riderADBtotalModalPremiumWithTaxForFirstYear = result.totalModalPremiumWithTaxForFirstYear;
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
                $scope.riders.isADBActive = false;
                $scope.calcData = $scope.outputData;

                $scope.calcData.modalAdbRiderPremium = null;
                $scope.calcData.annualAdbRiderPremium = null;
                $scope.calcData.riderADBserviceTaxForModalFirstYear = null;
                $scope.calcData.riderADBserviceTaxForAnnualFirstYear = null;
                $scope.calcData.riderADBtotalAnnualPremiumWithTaxForFirstYear = null;
                $scope.calcData.riderADBtotalModalPremiumWithTaxForFirstYear = null;
              }
            }
          };

          /**/
          $scope.calculate = function(inputData) {
            //** Calculation **//
            $scope.dbErrors = [];
            sICalculationService.calcSumAssured(prodId, channelId, inputData.annualPremium, inputData.ppt, inputData.laAge)
            .then(function(result){
              if(result){
                $scope.inputData.sumAssured    = Math.round(result);
                $scope.outputData.sumAssured = Math.round(result);
                $scope.outputData.sumAssuredForADBRiders = Math.round(result);
              }
              else{
                $scope.inputData.sumAssured    = 308737;
                $scope.outputData.sumAssured = 308737;
                $scope.outputData.sumAssuredForADBRiders = 308737;
              }
          });
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

            sIValidationService.validateBaseProduct(prodId, channelId, inputData)
              .then(function(messages) {
                if (messages.length === 0) {
                  $scope.showDbErrors = false;
                  $scope.doCalcBasePremium(prodId, channelId, inputData);
                } else {
                  $scope.showDbErrors = true;
                  console.log("ErrorMessage:::",messages);
                  for (var e = 0; e < messages[0].length; e++) {
                    $scope.dbErrors.push(messages[e][0]);
                  }
                  console.log("ErrorMessage:::",$scope.dbErrors);
                }
              });
            $log.debug("-----------DB VALIDATIONS------------", $scope.dbErrors);
            //** Calculation **//
          };
          $scope.doCalcBasePremium = function(prodId, channelId, userInput) {
            sICalculationService.calculateTotalPremium(prodId, channelId, userInput)
              .then(function(totalBasePremiumVals) {
                console.log("totalBasePremiumVals>::>>::>>", totalBasePremiumVals);
                var BI = totalBasePremiumVals.BIVal;
                BI.then(function(res) {
                  /* Save data for BI Calculation By Suresh Chouksey*/
                  $scope.data.biCalculation=res;
                  $scope.endOfPolicyYear = res.endOfPolicyYear;
                  var guaranteedVals = totalBasePremiumVals.gVals;

                  /*Guaranteed Additions at Maturity (b)*/
                  if (res.gSumAdditions.length > 0) {
                    var gSumAdditions = 0;
                    for (var n = 0; n < res.gSumAdditions.length; n++) {
                      gSumAdditions += res.gSumAdditions[n];
                    }
                  }

                  /**Chart Code **/
                  guaranteedVals.then(function(res) {
                    $scope.gsb = res.gsb;
                    $scope.gVals = res;

                    /*Sum of Guaranteed Annual Income (a)*/
                    if (res.gsb.length > 0) {
                      var guaranteedAnnualIncome = 0;
                      for (var n = 0; n < res.gsb.length; n++) {
                        guaranteedAnnualIncome += res.gsb[n];
                      }
                    }
                    var y = 200;
                    $scope.gsb.push(y);
                    y = 160;
                    $scope.gsb.push(y);
                    $scope.outputData.finalArray = [];
                    for (var i = 0; i < $scope.gsb.length; i++) {
                      if (i == $scope.gsb.length - 1 || i == $scope.gsb.length - 2) {
                        var x = {
                          key: $scope.endOfPolicyYear[i],
                          value: $scope.gsb[$scope.endOfPolicyYear[i] - 1],
                          height: 150, //Math.floor((Math.random() * 100) + 1),
                          checked: false
                        };
                      } else {
                        var x = {
                          key: $scope.endOfPolicyYear[i],
                          value: $scope.gsb[$scope.endOfPolicyYear[i] - 1],
                          height: 60, //Math.floor((Math.random() * 100) + 1),
                          checked: false
                        };
                      }
                      if (i == 17) {
                        x.checked = true;
                        $scope.data.selected = $scope.gsb[$scope.endOfPolicyYear[i] - 1];
                      }
                      $scope.outputData.finalArray.push(x);
                      /**Chart Code**/

                    }

                    //console.log("...............................", $scope.data.finalArray);
                    $scope.outputData.premium = totalBasePremiumVals;
                    $scope.outputData.premium.sumAssured = $scope.outputData.sumAssured;
                    $scope.outputData.guaranteedAnnualIncome = guaranteedAnnualIncome;
                    $scope.outputData.gSumAdditions = gSumAdditions;
                    $scope.outputData.totalModalPremium = totalBasePremiumVals.totalModalPremium;
                    $scope.outputData.modalFactor  = totalBasePremiumVals.modalFactor;
                    $scope.outputData.prodCode     = totalBasePremiumVals.prodCode;
                    $scope.outputData.serviceForAnnualFirstYearTax = totalBasePremiumVals.serviceForAnnualFirstYearTax;
                    $scope.outputData.serviceForAnnualSecondYearTax = totalBasePremiumVals.serviceForAnnualSecondYearTax;
                    $scope.outputData.totalAnnualPremium = Math.round(totalBasePremiumVals.totalAnnualPremium);
                    $scope.outputData.totalAnnualPremiumWithTaxForFirstYear = totalBasePremiumVals.totalAnnualPremiumWithTaxForFirstYear;
                    $scope.outputData.totalAnnualPremiumWithTaxForSecondYear = totalBasePremiumVals.totalAnnualPremiumWithTaxForSecondYear;


                    $scope.outputData.GuaranteedMonthlyIncome = totalBasePremiumVals.GuaranteedMonthlyIncome;
                    $scope.outputData.extraModalPremiumDueToNSAP = totalBasePremiumVals.extraModalPremiumDueToNSAP;
                    $scope.outputData.serviceTaxForFirstYear = totalBasePremiumVals.serviceTaxForFirstYear;
                    $scope.outputData.serviceTaxForSecondYear = totalBasePremiumVals.serviceTaxForSecondYear;
                    $scope.outputData.totalModalPremiumWithServiceTaxForFirstYear = totalBasePremiumVals.totalModalPremiumWithServiceTaxForFirstYear;
                    $scope.outputData.totalModalPremiumWithServiceTaxForSecondYear = totalBasePremiumVals.totalModalPremiumWithServiceTaxForSecondYear;

                    $scope.outputData.fsBasePremiumOutput = true;
                    //var secureIncomeBi = doGenarateFSBi(prodId, channelId, userInput, totalBasePremiumVals.basePremium, totalBasePremiumVals.sumAssured);
                    $scope.secureIncomeBiOutput = true;
                    eAppServices.setOutputDetails($scope.outputData);
                    eAppServices.setCalcDetails($scope.outputData);
                    $state.go('app.secureincome-estimated');

                  });
                });
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
            $state.go("app.secureincome-LAAndProposer");
          };

          $scope.showPopupPremiumWithTaxes = function() {
            $scope.premiumWithTaxes = true;
          };

          $scope.closePopupPremiumWithTaxes = function() {
            $scope.premiumWithTaxes = false;
          };

          $scope.goToHomePage = function() {
            setAnimate($ionicHistory);
            $state.go('app.secureincome-home');
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
                var secureIncomeQuoteData = {};
                var secureIncomeRidersData = [[]];
                var quoteCustomJson = {
                  quoteData: [],
                  adbRiderData: [],
                  hospiRiderData: [],
                  pwRiderIData: [],
                  pwRiderIIData: []
                };
                $scope.data.guaranteedIncome=10;
                /**1.BI Ref No**/
                secureIncomeQuoteData.PkQuotationId = biRefNo.BiQuoteNo;
                /**2 - >  1 = Eapp, 2 = OLS **/
                secureIncomeQuoteData.ReferenceSystemTypeId = "1";
                /**3 - > Selected Product ID**/
                secureIncomeQuoteData.FkProductId = currentData.prodId;
                /**4 - > Selected Product Plan Code**/
                secureIncomeQuoteData.ProductPlanCode = $scope.calcData.prodCode;
                /**5-> Logged in Agent Id**/
                secureIncomeQuoteData.FkAgentCode = "" + userData.agentId;
                /**Buying For Screen**/
                /**6 -> Buying For Screen**/
                secureIncomeQuoteData.BuyingFor = $scope.data.BuyingFor;
                /**7 -> liFirstName**/
                secureIncomeQuoteData.LAFirstName = $scope.data.liFirstName;
                /**8 -> liLastName**/
                secureIncomeQuoteData.LALastName = $scope.data.liLastName;
                /**9 -> LAGender**/
                secureIncomeQuoteData.LAGender = "" + (($scope.data.laGender == 0) ? "Male" : "Female");
                /**10 -> LADOB**/
                secureIncomeQuoteData.LADOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
                /**11 -> propFirstName**/
                /**12 -> propLastName**/
                /**13 -> proposerGender**/
                /**14 -> ProposerDOB**/
                if (secureIncomeQuoteData.BuyingFor != "Self") {
                  secureIncomeQuoteData.ProposerFirstName = $scope.data.propFirstName;
                  secureIncomeQuoteData.ProposerLastName = $scope.data.propLastName;
                  secureIncomeQuoteData.ProposerGender = "" + (($scope.data.proposerGender == 0) ? "Male" : "Female");
                  secureIncomeQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.proposerAge), 'MM/dd/yyyy');
                } else {
                  secureIncomeQuoteData.ProposerFirstName = $scope.data.liFirstName;
                  secureIncomeQuoteData.ProposerLastName = $scope.data.liLastName;
                  secureIncomeQuoteData.ProposerGender = "" + (($scope.data.laGender == 0) ? "Male" : "Female");
                  secureIncomeQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
                }
                /**Input/Output Screen**/
                /**15 -> IsSmoker**/
                if ($scope.calcData.smoke != undefined) {
                  secureIncomeQuoteData.IsSmoker = ($scope.calcData.smoke == "nonsmoke") ? "" + 0 : "" + 1;
                } else {
                  secureIncomeQuoteData.IsSmoker = "" + 0;
                }
                /**16->benfitUptoAge**/
                if ($scope.calcData.benfitUptoAge != undefined) {
                  secureIncomeQuoteData.UptoAge = "" + $scope.calcData.benfitUptoAge;
                } else {
                  secureIncomeQuoteData.UptoAge = null;
                }
                /**17-> PayType - (Limited/Regular) if applicable **/
                secureIncomeQuoteData.PayType = null;
                /**18-> BenefitType - (Endowment/Money Back)(Fixed Monthly Payout/Lumpsum + Increasing Payout) if applicable **/
                secureIncomeQuoteData.BenefitType = null;
                /**19->PremiumPaymentTerm**/
                secureIncomeQuoteData.PremiumPaymentTerm = "" + $scope.calcData.ppt;
                /**20->Policy Term**/
                secureIncomeQuoteData.PolicyTerm = "" + $scope.calcData.pt;
                /**21->SumAssured/Life Cover**/
                secureIncomeQuoteData.SumAssured = $scope.outputData.premium.sumAssured;
                /**22->GuaranteedIncomePeriod**/
                secureIncomeQuoteData.GuaranteedIncomePeriod = $scope.data.guaranteedIncome;
                /**23->GuaranteedIncomePeriod**/
                secureIncomeQuoteData.MaturityPayoutPeriod = null;
                /**24->MaturityPayoutFrequency**/
                secureIncomeQuoteData.MaturityPayoutFrequency = null;
                /**25->FlexiBenefitPeriod**/
                secureIncomeQuoteData.FlexiBenefitPeriod = null;//$scope.outputData.benefitPeriod;
                /**26->AnnualBasePremium**/
                secureIncomeQuoteData.AnnualBasePremium = $scope.outputData.premium.totalAnnualPremium;
                /**27->Mode**/
                secureIncomeQuoteData.Mode = "" + $scope.calcData.premiumMode;
                /**28->ModalFactor**/
                secureIncomeQuoteData.ModalFactor = $scope.outputData.premium.modalFactor;
                /**29->ModalPremium**/
                secureIncomeQuoteData.ModalPremium = $scope.outputData.premium.totalModalPremium;
                /**30->NSAPForLA**/
                if ($scope.calcData.NSAPForLA !== undefined) {
                  secureIncomeQuoteData.IsNSAP = "" + $scope.calcData.NSAPForLA;
                } else {
                  secureIncomeQuoteData.IsNSAP = "" + 0;
                }
                /**31->ServiceTax**/
                secureIncomeQuoteData.ServiceTax = $scope.calcData.premium.totalAnnualPremiumWithTaxForFirstYear - $scope.outputData.premium.totalAnnualPremium;
                /**32->PremiumPayable**/
                secureIncomeQuoteData.PremiumPayable = $scope.outputData.premium.totalModalPremiumWithServiceTaxForFirstYear;
                /**33->PremiumPayable**/
                secureIncomeQuoteData.IsInYourPresence = null;
                /**34->PremiumPayable**/
                secureIncomeQuoteData.EstimatedReturnRate = null;
                /**Default value is 0, For email functionality**/
                /**35-IsEmail**/
                /**36-ToRecipients**/
                /**37-CcRecipients**/
                /*if (isFromEmail) {
                  secureIncomeQuoteData.IsEmail = "" + 1;
                  secureIncomeQuoteData.ToRecipients = emailData.To;
                  secureIncomeQuoteData.CcRecipients = emailData.Cc;
                } else {
                  secureIncomeQuoteData.IsEmail = "" + 0;
                  secureIncomeQuoteData.ToRecipients = null;
                  secureIncomeQuoteData.CcRecipients = null;
                }*/
                /**38-> create JSON for IRDA **/
                secureIncomeQuoteData.Json = createsecureIncomeIRDAQuotePDFJson(biRefNo.BiQuoteNo);
                $log.debug("secureIncomeQuoteData...........", secureIncomeQuoteData);
          /**************************************************************************************/
          /**custome json creation for quote cpmparison***/
                quoteCustomJson.quoteData.push({
                  ReferenceSystemTypeId: secureIncomeQuoteData.ReferenceSystemTypeId,
                  FkProductId: secureIncomeQuoteData.FkProductId,
                  ProductPlanCode: secureIncomeQuoteData.ProductPlanCode,
                  FkAgentCode: secureIncomeQuoteData.FkAgentCode,
                  BuyingFor: secureIncomeQuoteData.BuyingFor,
                  LAFirstName: secureIncomeQuoteData.LAFirstName,
                  LALastName: secureIncomeQuoteData.LALastName,
                  LAGender: secureIncomeQuoteData.LAGender,
                  LADOB: secureIncomeQuoteData.LADOB,
                  ProposerFirstName: secureIncomeQuoteData.ProposerFirstName,
                  ProposerLastName: secureIncomeQuoteData.ProposerLastName,
                  ProposerGender: secureIncomeQuoteData.ProposerGender,
                  ProposerDOB: secureIncomeQuoteData.ProposerDOB,
                  IsSmoker: secureIncomeQuoteData.IsSmoker,
                  UptoAge: secureIncomeQuoteData.UptoAge,
                  PayType: secureIncomeQuoteData.PayType,
                  BenefitType: secureIncomeQuoteData.BenefitType,
                  PremiumPaymentTerm: secureIncomeQuoteData.PremiumPaymentTerm,
                  PolicyTerm: secureIncomeQuoteData.PolicyTerm,
                  SumAssured: secureIncomeQuoteData.SumAssured,
                  GuaranteedIncomePeriod: secureIncomeQuoteData.GuaranteedIncomePeriod,
                  MaturityPayoutPeriod: secureIncomeQuoteData.MaturityPayoutPeriod,
                  MaturityPayoutFrequency: secureIncomeQuoteData.MaturityPayoutFrequency,
                  FlexiBenefitPeriod: secureIncomeQuoteData.FlexiBenefitPeriod,
                  AnnualBasePremium: secureIncomeQuoteData.AnnualBasePremium,
                  Mode: secureIncomeQuoteData.Mode,
                  ModalFactor: secureIncomeQuoteData.ModalFactor,
                  ModalPremium: secureIncomeQuoteData.ModalPremium,
                  IsNSAP: secureIncomeQuoteData.IsNSAP,
                  ServiceTax: secureIncomeQuoteData.ServiceTax,
                  PremiumPayable: secureIncomeQuoteData.PremiumPayable,
                  IsInYourPresence: secureIncomeQuoteData.IsInYourPresence,
                  EstimatedReturnRate: secureIncomeQuoteData.EstimatedReturnRate
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
                  secureIncomeRidersData = [[]];
                  secureIncomeRidersData = $scope.createRidersData(userData, currentData, biRefNo.BiQuoteNo, selectedRiderIds);
                    $log.debug("*******secureIncomeRidersData*******",secureIncomeRidersData);
                }
                //if same quote no need to save the data again - method will check is Quote save required
                quoteProposalNosDataService.isQuoteDataInsertRequired(JSON.stringify(quoteCustomJson)).
                then(function(isRequired) {
                  if (isRequired) {
                    quoteProposalNosDataService.updateBIQuoteNumberUsedStatus(biRefNo.BiQuoteNo).then(function() {
                      quoteProposalNosDataService.insertQuoteData(secureIncomeQuoteData);
                      if ($scope.hcData || $scope.adbData || $scope.pwrData1 || $scope.pwrData2) {
                          $log.debug("########secureIncomeRidersData########",secureIncomeRidersData);
                        quoteProposalNosDataService.insertRidersData(secureIncomeRidersData);
                      }
                    });
                    if (isFromEmail) {
                      if (isOnlineEmailRequired) {
                        $scope.hidesendEmailPopup();
                        quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, secureIncomeQuoteData.Json,secureIncomeQuoteData.FkProductId);
                      } else {
                        quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,secureIncomeQuoteData.Json,secureIncomeQuoteData.FkProductId);
                      }
                    }
                  } else {
                    $log.debug("*******Same Quote Data already available*******");
                    if (isFromEmail) {
                      if (isOnlineEmailRequired) {
                        quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, secureIncomeQuoteData.Json,secureIncomeQuoteData.FkProductId);
                      } else {
                        quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,secureIncomeQuoteData.Json,secureIncomeQuoteData.FkProductId);
                      }
                      $scope.hidesendEmailPopup();
                    }
                  }
                });
              });
          };

          $scope.createRidersData = function(userData, currentData, biQuoteNo, selectedRiderIds) {
            var secureIncomeRidersData = [
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
                secureIncomeRidersData[i] = adbArray;
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
                secureIncomeRidersData[i] = hospiArray;
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
                secureIncomeRidersData[i] = pwr2Array;
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
                secureIncomeRidersData[i] = pwr1Array;
              }
            }
            return secureIncomeRidersData;
          };

          function createsecureIncomeIRDAQuotePDFJson(BiQuoteNo) {
            $log.debug("calcData",$scope.calcData);
            var userData = getSetCommonDataService.getCommonData();
            var currentData = getSetCommonDataService.getCurrentProdData();

            var selectedRiderData={};
            var secureIncomeIRDAQuotePDFJson = {"PDF":{}};
            secureIncomeIRDAQuotePDFJson.PDF.quoteNo = BiQuoteNo;
            secureIncomeIRDAQuotePDFJson.PDF.proposalNo = "";
            secureIncomeIRDAQuotePDFJson.PDF.policyNo = "";
            secureIncomeIRDAQuotePDFJson.PDF.uin = currentData.prodUIN;
            secureIncomeIRDAQuotePDFJson.PDF.productCode = $scope.calcData.prodCode;
            secureIncomeIRDAQuotePDFJson.PDF.riderCode = [];
            secureIncomeIRDAQuotePDFJson.PDF.illustrationGeneratedBy = userData.channelName;
            secureIncomeIRDAQuotePDFJson.PDF.illustrationDate = utilityService.getDisplayDate(new Date(), 'dd-MM-yyyy');

            secureIncomeIRDAQuotePDFJson.PDF.lifeAssuredDetail = {
              name: $scope.data.liFirstName + " " + $scope.data.liLastName,
              gender: $scope.data.laGender==0?"Male":"Female",
              age: $scope.getAge($scope.data.labfAge),
            };
            secureIncomeIRDAQuotePDFJson.PDF.proposerDetail = {};
            if ($scope.data.BuyingFor!="Self") {
              secureIncomeIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.propFirstName + " " + $scope.data.propLastName;
              secureIncomeIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.proposerGender==0?"Male":"Female";
              secureIncomeIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.proposerAge);
            } else {
              secureIncomeIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.liFirstName + " " + $scope.data.liLastName;
              secureIncomeIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.laGender==0?"Male":"Female";
              secureIncomeIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.labfAge);
            }
            secureIncomeIRDAQuotePDFJson.PDF.benefitAndPremiumDetail = {
              planName: "" + currentData.prodLbl,
              policyTerm: "" + $scope.outputData.pt,
              premiumPaymentTerm: "" + $scope.inputData.ppt,
              premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
              guaranteedMonthlyIncome:$scope.calcData.GuaranteedMonthlyIncome,
              guaranteedIncomeBenefitPeriod:$scope.data.guaranteedIncome,
              deathBenefit:$scope.data.biCalculation.deathBenifit[0],
              benefitUptoAge:secureIncomeIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
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
              secureIncomeIRDAQuotePDFJson.PDF.riderCode.push($scope.hcData.prodCode);
              secureIncomeIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
                planName: $filter('filter')(currentData.ridersData, { FkRiderId: hospiCashRiderId.toString()}, true)[0].Label,
                policyTerm: "" + $scope.outputData.ppt,
                premiumPaymentTerm: "" + $scope.outputData.riderPpt,
                premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
                guaranteedMonthlyIncome:$scope.calcData.GuaranteedMonthlyIncome,
                guaranteedIncomeBenefitPeriod:0,
                deathBenefit:$scope.data.biCalculation.deathBenifit[0],
                sumAssured: $scope.calcData.sumAssuredForRiders,
                benefitUptoAge: secureIncomeIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
                nsapExtra:"" + 0,
                annualPremium: $scope.calcData.annualHospiCashPremium,
                modalPremium:  $scope.hcData.modalHospiCashPremium,
                serviceTax1stYear: $scope.hcData.serviceTaxForModalFirstYear,
                serviceTax2ndYear:$scope.hcData.serviceTaxForModalFirstYear
              });
            }

            if ($scope.adbData && $scope.riders.isADBActive) {
              secureIncomeIRDAQuotePDFJson.PDF.riderCode.push($scope.adbData.prodCode);
              secureIncomeIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
                planName: $filter('filter')(currentData.ridersData, { FkRiderId: adbRiderId.toString()}, true)[0].Label,
                policyTerm: "" + $scope.outputData.pt,
                premiumPaymentTerm: "" + $scope.outputData.ppt,
                premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
                guaranteedMonthlyIncome:$scope.calcData.GuaranteedMonthlyIncome,
                guaranteedIncomeBenefitPeriod:0,
                deathBenefit:$scope.data.biCalculation.deathBenifit[0],
                sumAssured: $scope.calcData.sumAssuredForADBRiders,
                benefitUptoAge: secureIncomeIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
                nsapExtra:"" + 0,
                annualPremium:  $scope.calcData.annualAdbRiderPremium ,
                modalPremium:$scope.adbData.modalAdbRiderPremium,
                serviceTax1stYear:$scope.adbData.serviceTaxForModalFirstYear,
                serviceTax2ndYear:$scope.adbData.serviceTaxForModalFirstYear

              });
            }
            if ($scope.pwrData1 && $scope.riders.isPWRActive) {
              secureIncomeIRDAQuotePDFJson.PDF.riderCode.push($scope.pwrData1.prodCode);
              secureIncomeIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
                planName: $filter('filter')(currentData.ridersData, { FkRiderId: pwrRiderId.toString()}, true)[0].Label,
                policyTerm: "" + $scope.outputData.pt,
                premiumPaymentTerm: "" + $scope.outputData.ppt,
                premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
                guaranteedMonthlyIncome:$scope.calcData.GuaranteedMonthlyIncome,
                guaranteedIncomeBenefitPeriod:0,
                deathBenefit:$scope.data.biCalculation.deathBenifit[0],
                sumAssured: $scope.calcData.sumAssuredForRiders,
                benefitUptoAge: secureIncomeIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
                nsapExtra:$scope.calcData.riderPWRIIextraPremiumDueToNSAPLA,
                annualPremium: $scope.calcData.annualPWRIRiderPremium,
                modalPremium: $scope.pwrData1.modalPWRRiderPremium,
                serviceTax1stYear: $scope.pwrData1.serviceTaxForModalFirstYear,
                serviceTax2ndYear:$scope.pwrData1.serviceTaxForModalFirstYear
              });
            }
            if ($scope.pwrData2 && $scope.riders.isPWRActive) {
              secureIncomeIRDAQuotePDFJson.PDF.riderCode.push($scope.pwrData2.prodCode);
              secureIncomeIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
                planName: $filter('filter')(currentData.ridersData, { FkRiderId: pwrRiderCiId.toString()}, true)[0].Label,
                policyTerm: "" + $scope.outputData.pt,
                premiumPaymentTerm: "" + $scope.outputData.ppt,
                premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
                guaranteedMonthlyIncome:$scope.calcData.GuaranteedMonthlyIncome,
                guaranteedIncomeBenefitPeriod:0,
                deathBenefit:$scope.data.biCalculation.deathBenifit[0],
                sumAssured: $scope.calcData.sumAssuredForRiders,
                benefitUptoAge: secureIncomeIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
                nsapExtra:$scope.calcData.riderPWRIIextraPremiumDueToNSAPLA,
                annualPremium: $scope.calcData.annualPWRIRiderPremium,
                modalPremium: $scope.pwrData2.modalPWRRiderPremium,
                serviceTax1stYear: $scope.pwrData2.serviceTaxForModalFirstYear,
                serviceTax2ndYear:$scope.pwrData2.serviceTaxForModalFirstYear
              });
            }

            $log.debug("benefitIllustration",$scope.data.biCalculation);
            secureIncomeIRDAQuotePDFJson.PDF.benefitIllustration =$scope.data.biCalculation;
            return JSON.stringify(secureIncomeIRDAQuotePDFJson);
            //return secureIncomeIRDAQuotePDFJson;
          }


          $scope.email = function() {
            $scope.showPlusPopup = false;
            $scope.showSendEmailPopup = true;
            $scope.email_To="";
            $scope.email_Cc="";
          };

          $scope.hidesendEmailPopup = function() {
            $scope.showPlusPopup = false;
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
