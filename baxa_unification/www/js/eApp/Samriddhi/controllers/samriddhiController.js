eAppModule.controller('samriddhiController', ['$scope',
  '$q',
  '$state',
  '$http',
  '$log',
  '$rootScope',
  '$ionicPlatform',
  '$ionicHistory',
  '$ionicNavBarDelegate',
  '$ionicLoading',
  'commonDBFuncSvc',
  'samriddhiValidationService',
  'samriddhiCalculationSvc',
  'samriddhiCalculationEAppService',
  'commonDbProductCalculation',
  'samruddhiObjectService',
  'samriddhiEappDbService',
  'calculatehospiCashRiderPremiumSvc',
  'hospiCashRiderDataFromUserSvc',
  'eAppServices',
  'switchDataService',
  'getSetCommonDataService',
  'quoteProposalNosDataService',
  'utilityService',
  '$filter',
  'riderValidationService',
  'calculateAdbRiderPremiumSvc',
  'pwrRiderDataFromUserSvc',
  'calculatePwrRiderPremiumSvc',
  'sendBIEmailService',
  function($scope, $q, $state, $http, $log, $rootScope,
    $ionicPlatform, $ionicHistory, $ionicNavBarDelegate,$ionicLoading,
    commonDBFuncSvc, samriddhiValidationService, samriddhiCalculationSvc, samriddhiCalculationEAppService,
    commonDbProductCalculation, samruddhiObjectService, samriddhiEappDbService, calculatehospiCashRiderPremiumSvc,
    hospiCashRiderDataFromUserSvc, eAppServices, switchDataService, getSetCommonDataService, quoteProposalNosDataService, utilityService, $filter,riderValidationService
    ,calculateAdbRiderPremiumSvc
    ,pwrRiderDataFromUserSvc,calculatePwrRiderPremiumSvc, sendBIEmailService) {
    'use strict';
    var vm = this;
    var hospiCashRiderId = 5,
      adbRiderId = 4,
      prodId = 2,
      channelId = 1,
      pwrRiderId = 6,
      pwrOption = 1;

    $scope.title = "Samriddhi";
    $scope.data = {};
    $scope.inputData = {};
    $scope.outputData = {};
    $scope.calcData = {};
    $scope.data.BuyingFor = 'Self';
    $scope.data.laGender = 0;
    $scope.data.liFirstName = "";
    $scope.data.liLastName = "";
    $scope.data.proposerGender = 0;
    $scope.data.propFirstName = "";
    $scope.data.propLastName = "";
    $scope.data.pwrRiderOption2 = true;
    $scope.validationMessage = {};
    $scope.premiumWithTaxes = false;
    $scope.showPopupToGoForLAAndProposerDetails = false;
    /*Output page flags*/
    $scope.hospiCashRider = false;
    $scope.adbRider = false;
    $scope.pwrRider = false;
    $scope.premiumWithTaxes = false;
    //$scope.sumAssured = 1000000;

    $scope.riderSelectAlert = false;
    $scope.pwrSelectAlert = false;
    $scope.isIllustrationsSelected = true;
    $scope.isBrochureSelected = false;
    $scope.errormessagesForHOSPICASHRider = [];
    $scope.errormessagesForADBRider = [];
    $scope.errormessagesForPWRRider = [];


    //** Back Button Funtionality **//
    $scope.goBack = function() {
      //alert(data.labfAge);
      if ($state.current.name == 'app.samriddhi-home') {
        $state.go("app.eApp");
      } else if ($state.current.name == 'app.samriddhi-LAAndProposer') {
        $state.go("app.eliteAdvantage-home");
      } else if ($state.current.name == 'app.samriddhi-estimated') {
        $state.go("app.samriddhi-LAAndProposer");
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
    $http.get('js/eApp/Samriddhi/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
    });
    /*Get validation messgae through json file.*/

    //** Get Data Variables **//
    //** Get Generic Options for Form Elements **//
    var params = {
      "ui_gender": true,
      "ui_age": true,
      "ui_nsap": true,
      "ui_sumAssured": false,
      "ui_anualPreminum": true,
      "ui_modelPreminum": true,
      "switch": false,
      "ui_payType": true,
      "ui_color":"bronline"
    };

    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "BUYPOLFOR", "PMODE", "PPT", "SA", "PAYTYPE"], ["PT", "MPFACTOR", "PREPAYOPN"])
      .then(function(result) {
        $scope.params = params;
        $scope.formData = result[0];
        $log.debug("result", result);
        $scope.formDataCalc = {
          "PT": JSON.parse(result[1].PT),
          "MPFACTOR": JSON.parse(result[1].MPFACTOR),
          "PREPAYOPN": JSON.parse(result[1].PREPAYOPN)
        };
        $scope.formDataOut = result[2];


        var calcData = eAppServices.getCalcDetails();
        var outputData = eAppServices.getOutputDetails();
        var inputData = eAppServices.getInputDetails();
        var data = eAppServices.getBuyForDetails();

        if (Object.keys(outputData).length > 0) {
          $scope.outputData = outputData;
          $scope.outputData.sumAssuredForADBRiders = calcData.sumAssured;
          if (Object.keys(calcData).length > 0) {
            $scope.calcData = calcData;
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
          //var dobAge=  angular.element("#dob");
            $log.debug("Data for Buying",$scope.inputData);
          if (Object.keys(data).length > 0) {
            $scope.data = data;
          }
        } else if (Object.keys(data).length > 0) {
          if (data.length > 0) {
            $scope.data = data;

          }
        } else {
          $state.go('app.samriddhi-LAAndProposer');
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

    /*******user All data******* Switch function */
    $scope.custId = $state.params.customerId;
    var samriddhiPi = switchDataService.getProfileData($state.params.customerId);
    samriddhiPi.then(function(samriddhi) {
      if (samriddhi !== undefined) {
        $scope.data.liFirstName = samriddhi.FirstName;
        $scope.data.liLastName = samriddhi.LastName;
        $scope.data.laGender = samriddhi.Gender;
      }
    });

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
            $scope.calcData.hospiCash = true;
            calcData.sumAssuredForRiders = calcData.hospiCashDHCB;
            calcData.riderPpt = calcData.hospiCashTerm;
            //calcData.ppt = calcData.hospiCashTerm;
            hospiCashRiderDataFromUserSvc.setHospiCashData([]);
            var hospiInput = hospiCashRiderDataFromUserSvc.setHospiCashData(calcData);
             samriddhiValidationService.validateHospiCashRider(prodId, channelId, calcData).then(function(messages) {
              $scope.showDbErrors = false;
              $scope.dbError = "";
              if (messages.length === 0) {
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
              } else {
                $scope.showDbErrors = true;
                for (var e = 0; e < messages.length; e++) {
                  $scope.dbErrors.push(messages[e][0]);
                }
              }
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
        $scope.calcData.basePremium  = $scope.outputData.basePremium;
        if ($scope.riders.isHCActive || $scope.riders.isADBActive) {
          $scope.riderSelectAlert = true;
        } else /*if($scope.riders.isPWRActive)*/ {
           samriddhiValidationService.getProductCode(prodId, channelId, calcData.ppt)
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
                        $scope.calcData.basePremium  = $scope.outputData.basePremium;
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
                        $scope.calcData.basePremium  = $scope.outputData.basePremium;
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
           samriddhiValidationService.getProductCode(prodId, channelId, $scope.outputData.ppt)
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

    //** Handle Form Submit for LA Proposer Details Form **//
    $scope.ProceedForLAAndProposerDetails = function(data) {
      //alert(data.labfAge);
      $scope.inputData.laName = data.liFirstName + " " + data.liLastName;
      $scope.inputData.laAge = $scope.getAge(data.labfAge);
      $scope.inputData.laGender = parseInt(data.laGender);
      // $scope.inputData.sumAssured = 1000000;
      $scope.inputData.isSelf = (data.BuyingFor == 'Self') ? (true) : (false);
      $scope.inputData.smoke = 'nonsmoke';
      $scope.inputData.premiumMode = ($scope.inputData.premiumMode) ? ($scope.inputData.premiumMode) : (1); //default Value to select
      $scope.inputData.pt = ($scope.inputData.pt) ? ($scope.inputData.pt) : (25);
      $scope.inputData.ppt = ($scope.inputData.ppt) ? ($scope.inputData.ppt) : (25);
      $scope.inputData.payType = ($scope.inputData.payType) ? ($scope.inputData.payType) : ('REGULAR');
      $scope.inputData.annualPremium = ($scope.inputData.annualPremium) ? ($scope.inputData.annualPremium) : (50000);
      $scope.inputData.annualPremiumMinLength = 4;
      $scope.inputData.annualPremiumMaxLength = 10;
      $scope.inputData.NSAPForLA = ($scope.inputData.NSAPForLA) ? ($scope.inputData.NSAPForLA) : (false);
      $scope.inputData.NSAPForPrposer = false;
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
      $state.go('app.samriddhi-home');
    };

    /*
    Do base product calculation.
    */
    $scope.calculate = function(inputData) {

      if($scope.data.BuyingFor == "Self"){
        inputData.NSAPForPrposer         = inputData.NSAPForLA;
        $scope.inputData.NSAPForPrposer  = inputData.NSAPForLA;
      }else{
        inputData.NSAPForPrposer         = false;
        $scope.inputData.NSAPForPrposer  = false;
      }
      $scope.inputData.pwrRiderOption1 = false;
      $scope.inputData.pwrRiderOption2 = true;
      inputData.basePremium = inputData.annualPremium;
      samriddhiValidationService.validateBaseProduct(prodId, channelId, inputData).then(function(messages) {
        $log.debug("validation For Samruddhi", messages);
        if (messages.length == 0) {
          $scope.errorMessage = [];
          samriddhiCalculationSvc.calculatePremium(prodId, channelId, inputData).then(function(result) {
            $log.debug("calculationValues", result);
            $scope.calcData = result;
            $scope.inputData.sumAssured = $scope.calcData.sumAssured;
            eAppServices.setInputDetails($scope.inputData);
            eAppServices.setOutputDetails($scope.inputData);
            /*base product calculation is done*/
            samriddhiCalculationEAppService.getCalculations(prodId, channelId, inputData, $scope.calcData.sumAssured).then(function(result) {
              $log.debug("Req Calculations", result);
              //  $scope.calcData.calculateModelPremium  = result[1];
              $scope.calcData.biCalculation = result[0];
              $scope.calcData.pt          = $scope.inputData.pt;
              $scope.calcData.laAge       = $scope.inputData.laAge;
              $scope.calcData.premiumMode = $scope.inputData.premiumMode;
              $scope.calcData.laGender    = $scope.inputData.laGender;
              $scope.calcData.NSAPForLA    = $scope.inputData.NSAPForLA;
              $scope.calcData.NSAPForPrposer    = $scope.inputData.NSAPForPrposer;
              $scope.calcData.isSelf    = $scope.inputData.isSelf;
              if($scope.calcData.isSelf == true){
                  $scope.calcData.proposerAge = $scope.inputData.laAge;
              }
              else{
                $scope.calcData.proposerAge = $scope.inputData.proposerAge;
              }
              $scope.calcData.laGender    = $scope.inputData.laGender;




              eAppServices.setCalcDetails($scope.calcData);
              $state.go('app.samriddhi-estimated');
            });
          });
        } else {
          $log.error("Samruddhi Db validation Error", messages);
          $scope.showDbErrors = true;
          $scope.dbErrors = [];
          for (var e = 0; e < messages.length; e++) {
            $scope.dbErrors.push(messages[e][0]);
          }
        }
      });
    };

    /*Animation code
      To roll down the home page when  user redirect from output page to home page  through click on input button.
    */
    $scope.animateClass = animateNgClass('bounceInDown', 'animationduration25');
    /*
    This is popup Ok button event . to get back to la proposer details page to update records.
    */
    $scope.goToHomePage = function() {
      /*Animation Code*/
      setAnimate($ionicHistory);
      $state.go("app.samriddhi-home");
    };
    /*
    Update rider sumassured.
    */
    $scope.updateRiderSA = function(data) {
      $scope.data.sumAssuredForADBRiders = angular.copy($rootScope.calculationValues.sumAssured);
    };
    /*this function will navigate to home of samriddhi eapp page.To do the base product calculation.*/
    $scope.goToSamriddhi = function(data) {
      $rootScope.BuyingProductFor = data;
      $state.go('app.samriddhi-home');
    };
    /** out put page functions *****/

    $scope.getHCRTerm = function(ppt, term) {
      return Number(ppt) >= Number(term);
    };
    /*Riders*/

    //** Handle Form Submit for LA Proposer Details Form **//
    $scope.closePwrAlert = function() {
      $scope.riderSelectAlert = false;
      $scope.hospiCashRider = false;
      $scope.adbRider = false;
    };

    /* Open popup on outpt page for calculations of premium with taxes. */
    $scope.openPopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = true;
    };

    /* Close popup on outpt page for calculations of premium with taxes. */
    $scope.closePopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = false;
    };

    /*Html set functions**/
    /*set active*/
    $scope.setPaytype = function(paytype) {
      $scope.samriddhi.paytype = paytype;
    };
    /* end of Html set functions**/

    /*This function will do the Calculation of base product.*/
    $scope.calculateModelPremium = function(data) {

      var q = $q.defer();
      /*base product calculation is done.*/
      samriddhiValidationService.validateBaseProduct(prodId, channelId, data).then(function(messages) {
        $log.debug("validation For Samruddhi", messages);
        if (messages.length == 0) {
          $scope.errorMessage = [];
          samriddhiCalculationSvc.calculatePremium(prodId, channelId, data).then(function(result) {
            $log.debug("calculationValues", result);
            $scope.calcData.calculateModelPremium = result;
            q.resolve($scope.calcData.calculateModelPremium.sumAssured);
          });
        } else {
          $log.error("Samruddhi Db validation Error", messages);
          $scope.errorMessage = messages;
        }
      });
      q.promise();
    };

    $scope.calculationForSumAssuredOnMaturity = function(data) {

    };

    $scope.calculateSumassuredByMode = function(premiumMode, data) {
      data.premiumMode = premiumMode;
      data.ppt = data.premiumPaymentTerm;
      $scope.calculateModelPremium(data);
    };

    $scope.openPopupForChangeDetails = function() {
      $scope.showPopupToGoForLAAndProposerDetails = true;
    };

    $scope.goToLAAndProposer = function() {
      $state.go("app.samriddhi-LAAndProposer");
    };

    $scope.closePopupForChangeDetails = function() {
      $scope.showPopupToGoForLAAndProposerDetails = false;
    };

    $scope.showPopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = true;
      /*$scope.totalpayablePremiumCalculation = $rootScope.calculationValues.modalPremium + $rootScope.calculations[1]["modalAdbRiderPremium"] + $rootScope.calculations[1]["modalAdbRiderPremiumWithServiceTax"] + $rootScope.calculations[2]["serviceTaxFactorForFirstAndSecondYear"] + $rootScope.calculations[3]["modalPwrRiderWithServiceTax"] + $rootScope.calculationValues.serviceTaxFactorForFirstYear + $rootScope.calculations[2]["riderPremium"] + $rootScope.calculations[3]["annualPwrPremium"];*/
    };

    $scope.closePopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = false;
    };

    /*
     Add riders button even to reset all riders.
    */
    $scope.addRiders = function() {
      if ($scope.riders.isADBActive == true || $scope.riders.isPWRActive == true || $scope.riders.isHCActive == true) {

      } else {
        $scope.data.term = 0;
        $scope.data.Dhcb = 0;
        $scope.calcData.sumAssuredForADBRiders = $scope.calcData.sumAssured;
        $scope.calcData.ppt = $scope.outputData.ppt;
        $scope.outputData.pwrRiderOption = 2;
        $scope.outputData.NSAPForPrposer = false;
        $scope.addriders = !$scope.addriders;
      }
    };

    $scope.saveQuote = function() {
      /** parameters sendEmail false and email data null **/
      $scope.createQuoteData(false, null, false);
    };

    $scope.proceedToFormFilling = function() {
      /** parameters sendEmail false and email data null **/
      $scope.createQuoteData(false, null, false);
    };

    /*
    Email quote for samriddhi.
    */
    $scope.createQuoteData = function(isFromEmail, emailData, isOnlineEmailRequired) {
      //isOnlineEmailRequired=false;
      if (isFromEmail && isOnlineEmailRequired) {
        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner><p>Sending Email..!</p>'
        });
      }

      var userData = getSetCommonDataService.getCommonData();
      var currentData = getSetCommonDataService.getCurrentProdData();
      $log.debug("#############userData#############", userData);
      $log.debug("#############currentData#############", currentData);

      quoteProposalNosDataService.getBIQuoteNumber(userData.agentId)
        .then(function(biRefNo) {
          var samriddhiQuoteData = {};
          var samriddhiRidersData = [
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
          samriddhiQuoteData.PkQuotationId = biRefNo.BiQuoteNo;
          /**2 - >  1 = Eapp, 2 = OLS **/
          samriddhiQuoteData.ReferenceSystemTypeId = "1";
          /**3 - > Selected Product ID**/
          samriddhiQuoteData.FkProductId = currentData.prodId;
          /**4 - > Selected Product Plan Code**/
          samriddhiQuoteData.ProductPlanCode = $scope.calcData.prodCode;
          $log.debug("samriddhiQuoteData ProductPlanCode ...........", samriddhiQuoteData.ProductPlanCode);
          /**5-> Logged in Agent Id**/
          samriddhiQuoteData.FkAgentCode = "" + userData.agentId;
          /**Buying For Screen**/
          samriddhiQuoteData.BuyingFor = $scope.data.BuyingFor;
          samriddhiQuoteData.LAFirstName = $scope.data.liFirstName;
          samriddhiQuoteData.LALastName = $scope.data.liLastName;
          samriddhiQuoteData.LAGender = "" + $scope.data.laGender == 0 ? "Male" : "Female";
          samriddhiQuoteData.LADOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');

          if (samriddhiQuoteData.BuyingFor != "Self") {
            samriddhiQuoteData.ProposerFirstName = $scope.data.propFirstName;
            samriddhiQuoteData.ProposerLastName = $scope.data.propLastName;
            samriddhiQuoteData.ProposerGender = "" + $scope.data.proposerGender == 0 ? "Male" : "Female";
            samriddhiQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.proposerAge), 'MM/dd/yyyy');
          } else {
            samriddhiQuoteData.ProposerFirstName = $scope.data.liFirstName;
            samriddhiQuoteData.ProposerLastName = $scope.data.liLastName;
            samriddhiQuoteData.ProposerGender = "" + $scope.data.laGender == 0 ? "Male" : "Female";
            samriddhiQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          }
          /**Input/Output Screen**/
          if ($scope.calcData.smoke != undefined) {
            samriddhiQuoteData.IsSmoker = ($scope.calcData.smoke == "nonsmoke") ? "" + 0 : "" + 1;
          } else {
            samriddhiQuoteData.IsSmoker = "" + 0;
          }
          /**benfitUptoAge**/
          if ($scope.calcData.benfitUptoAge != undefined) {
            samriddhiQuoteData.UptoAge = "" + $scope.calcData.benfitUptoAge;
          } else {
            samriddhiQuoteData.UptoAge = null;
          }

          /**PayType - (Limited/Regular) if applicable **/
          samriddhiQuoteData.PayType = $scope.inputData.payType;
          /**BenefitType - (Endowment/Money Back)(Fixed Monthly Payout/Lumpsum + Increasing Payout) if applicable **/
          samriddhiQuoteData.BenefitType = null;
          /**PremiumPaymentTerm**/
          samriddhiQuoteData.PremiumPaymentTerm = "" + $scope.inputData.ppt;
          /**Policy Term**/
          samriddhiQuoteData.PolicyTerm = "" + $scope.outputData.pt;
          /**SumAssured/Life Cover**/
          samriddhiQuoteData.SumAssured = $scope.calcData.sumAssured;
          samriddhiQuoteData.GuaranteedIncomePeriod = null;
          samriddhiQuoteData.MaturityPayoutPeriod = null;
          samriddhiQuoteData.MaturityPayoutFrequency = null;
          samriddhiQuoteData.FlexiBenefitPeriod = null;
          samriddhiQuoteData.AnnualBasePremium = $scope.calcData.basePremium;
          samriddhiQuoteData.Mode = "" + $scope.inputData.premiumMode;
          samriddhiQuoteData.ModalFactor = $scope.calcData.modalFact;
          samriddhiQuoteData.ModalPremium = $scope.calcData.modalPremium;
          /**NSAPForLA**/
          if ($scope.inputData.NSAPForLA != undefined) {
            samriddhiQuoteData.IsNSAP = "" + $scope.inputData.NSAPForLA;
          } else {
            samriddhiQuoteData.IsNSAP = "" + 0;
          }
          samriddhiQuoteData.ServiceTax = $scope.calcData.serviceTaxFactorForFirstYear;
          samriddhiQuoteData.PremiumPayable = $scope.calcData.PremiumPayable;
          samriddhiQuoteData.IsInYourPresence = null;
          samriddhiQuoteData.EstimatedReturnRate = null;

          /**Default value is 0, For email functionality**/
          /*if (isFromEmail) {
            samriddhiQuoteData.IsEmail = "" + 1;
            samriddhiQuoteData.ToRecipients = emailData.To;
            samriddhiQuoteData.CcRecipients = emailData.Cc;
          } else {
            samriddhiQuoteData.IsEmail = "" + 0;
            samriddhiQuoteData.ToRecipients = null;
            samriddhiQuoteData.CcRecipients = null;
          }*/

          /**create JSON for IRDA **/
          samriddhiQuoteData.Json = createSamriddhiIRDAQuotePDFJson(biRefNo.BiQuoteNo);
          $log.debug("samriddhiQuoteData...........", samriddhiQuoteData);

          quoteCustomJson.quoteData.push({
            ReferenceSystemTypeId: samriddhiQuoteData.ReferenceSystemTypeId,
            FkProductId: samriddhiQuoteData.FkProductId,
            ProductPlanCode: samriddhiQuoteData.ProductPlanCode,
            FkAgentCode: samriddhiQuoteData.FkAgentCode,
            BuyingFor: samriddhiQuoteData.BuyingFor,
            LAFirstName: samriddhiQuoteData.LAFirstName,
            LALastName: samriddhiQuoteData.LALastName,
            LAGender: samriddhiQuoteData.LAGender,
            LADOB: samriddhiQuoteData.LADOB,
            ProposerFirstName: samriddhiQuoteData.ProposerFirstName,
            ProposerLastName: samriddhiQuoteData.ProposerLastName,
            ProposerGender: samriddhiQuoteData.ProposerGender,
            ProposerDOB: samriddhiQuoteData.ProposerDOB,
            IsSmoker: samriddhiQuoteData.IsSmoker,
            UptoAge: $scope.getAge($scope.data.labfAge) + parseInt(samriddhiQuoteData.PolicyTerm),
            PayType: samriddhiQuoteData.PayType,
            BenefitType: samriddhiQuoteData.BenefitType,
            PremiumPaymentTerm: samriddhiQuoteData.PremiumPaymentTerm,
            PolicyTerm: samriddhiQuoteData.PolicyTerm,
            SumAssured: samriddhiQuoteData.SumAssured,
            GuaranteedIncomePeriod: samriddhiQuoteData.GuaranteedIncomePeriod,
            MaturityPayoutPeriod: samriddhiQuoteData.MaturityPayoutPeriod,
            MaturityPayoutFrequency: samriddhiQuoteData.MaturityPayoutFrequency,
            FlexiBenefitPeriod: samriddhiQuoteData.FlexiBenefitPeriod,
            AnnualBasePremium: samriddhiQuoteData.AnnualBasePremium,
            Mode: samriddhiQuoteData.Mode,
            ModalFactor: samriddhiQuoteData.ModalFactor,
            ModalPremium: samriddhiQuoteData.ModalPremium,
            IsNSAP: samriddhiQuoteData.IsNSAP,
            ServiceTax: samriddhiQuoteData.ServiceTax,
            PremiumPayable: samriddhiQuoteData.PremiumPayable,
            IsInYourPresence: samriddhiQuoteData.IsInYourPresence,
            EstimatedReturnRate: samriddhiQuoteData.EstimatedReturnRate
          });
          $log.debug("quoteCustomJson...........", quoteCustomJson);
          /*****************************************************************************************/

          $log.debug("$scope.riderHospi...........", $scope.hospiCashRider);
          $log.debug("$scope.adbRider...........", $scope.adbRider);
          $log.debug("$scope.PWR1...........", ($scope.pwrRider && $scope.outputData.PWRI));
          $log.debug("$scope.PWR2...........", ($scope.pwrRider && $scope.outputData.PWRII));

          var selectedRiderIds = [];
          if ($scope.hospiCashRider) {
            selectedRiderIds.push(hospiCashRiderId);
            quoteCustomJson.hospiRiderData.push({
              FkAgentCode: "" + userData.agentId,
              FkRiderId: "" + hospiCashRiderId,
              RiderPlanCode: $scope.calcData.hospicashRiderCalculation.prodCode,
              ReferenceSystemTypeId: "1",
              Term: "" + $scope.outputData.riderPpt,
              SumAssured: $scope.calcData.hospicashRiderCalculation.sumAssured,
              IsNSAPProposer: "" + 0,
              ModalPremium: $scope.calcData.hospicashRiderCalculation.modalHospiCashPremium,
              ServiceTaxPayable: $scope.calcData.hospicashRiderCalculation.serviceTaxForModalFirstYear,
              PremiumPayable: $scope.calcData.hospicashRiderCalculation.totalModalPremiumWithTaxForFirstYear
            });
          }

          if ($scope.adbRider) {
            selectedRiderIds.push(adbRiderId);
            quoteCustomJson.adbRiderData.push({
              FkAgentCode: "" + userData.agentId,
              FkRiderId: "" + adbRiderId,
              RiderPlanCode: $scope.calcData.adbRiderCalculation.prodCode,
              ReferenceSystemTypeId: "1",
              Term: "" + $scope.outputData.ppt,
              SumAssured: $scope.outputData.sumAssuredForADBRiders,
              IsNSAPProposer: "" + 0,
              ModalPremium: $scope.calcData.adbRiderCalculation.modalAdbRiderPremium,
              ServiceTaxPayable: $scope.calcData.adbRiderCalculation.serviceTaxForModalFirstYear,
              PremiumPayable: $scope.calcData.adbRiderCalculation.totalModalPremiumWithTaxForFirstYear
            });
          }


          if ($scope.pwrRider && $scope.outputData.PWRI) {
            selectedRiderIds.push($scope.outputData.selectedPwrRiderID);
            quoteCustomJson.pwRiderIData.push({
              FkAgentCode: "" + userData.agentId,
              FkRiderId: "" + $scope.outputData.selectedPwrRiderID,
              RiderPlanCode: $scope.calcData.pwrRiderCalculation.prodCode,
              ReferenceSystemTypeId: "1",
              Term: "" + $scope.outputData.ppt,
              SumAssured: $scope.outputData.sumAssured,
              IsNSAPProposer: "" + $scope.outputData.NSAPForPrposer,
              ModalPremium: $scope.calcData.pwrRiderCalculation.modalPWRRiderPremium,
              ServiceTaxPayable: $scope.calcData.pwrRiderCalculation.serviceTaxForModalFirstYear,
              PremiumPayable: $scope.calcData.pwrRiderCalculation.totalModalPremiumWithTaxForFirstYear
            });
          }


          if ($scope.pwrRider && $scope.outputData.PWRII) {
            selectedRiderIds.push($scope.outputData.selectedPwrRiderID);
            quoteCustomJson.pwRiderIIData.push({
              FkAgentCode: "" + userData.agentId,
              FkRiderId: "" + $scope.outputData.selectedPwrRiderID,
              RiderPlanCode: $scope.calcData.pwrRiderCalculation.prodCode,
              ReferenceSystemTypeId: "1",
              Term: "" + $scope.outputData.ppt,
              SumAssured: $scope.outputData.sumAssured,
              IsNSAPProposer: "" + $scope.outputData.NSAPForPrposer,
              ModalPremium: $scope.calcData.pwrRiderCalculation.modalPWRRiderPremium,
              ServiceTaxPayable: $scope.calcData.pwrRiderCalculation.serviceTaxForModalFirstYear,
              PremiumPayable: $scope.calcData.pwrRiderCalculation.totalModalPremiumWithTaxForFirstYear
            });
          }




          if (selectedRiderIds.length > 0) {
            samriddhiRidersData = [
              []
            ];
            samriddhiRidersData = $scope.createRidersData(userData, currentData, biRefNo.BiQuoteNo, selectedRiderIds);
          }
          //if (quoteProposalNosDataService.isQuoteDataInsertRequired(JSON.stringify(quoteCustomJson))) {
          quoteProposalNosDataService.isQuoteDataInsertRequired(JSON.stringify(quoteCustomJson)).
          then(function(isRequired) {
            if (isRequired) {
              quoteProposalNosDataService.updateBIQuoteNumberUsedStatus(biRefNo.BiQuoteNo).then(function() {
                quoteProposalNosDataService.insertQuoteData(samriddhiQuoteData);
                if (selectedRiderIds.length > 0) {
                  quoteProposalNosDataService.insertRidersData(samriddhiRidersData);
                }
              });
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  $scope.hidesendEmailPopup();
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, samriddhiQuoteData.Json,samriddhiQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,samriddhiQuoteData.Json,samriddhiQuoteData.FkProductId);
                }
              }
            } else {
              $log.debug("*******Same Quote Data already available*******");
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, samriddhiQuoteData.Json,samriddhiQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,samriddhiQuoteData.Json,samriddhiQuoteData.FkProductId);
                }
                $scope.hidesendEmailPopup();
              }
            }
          });

          //  }
        });
    };

    $scope.createRidersData = function(userData, currentData, biQuoteNo, selectedRiderIds) {
      var samriddhiRidersData = [
        []
      ];
      for (var i = 0; i < selectedRiderIds.length; i++) {
        if (selectedRiderIds[i] == hospiCashRiderId) {
          //user selected Hospicash Rider
          var hospiCashArray = {};
          hospiCashArray.FkAgentCode = "" + userData.agentId;
          hospiCashArray.FkQuotationId = biQuoteNo;
          hospiCashArray.FkRiderId = "" + selectedRiderIds[i];
          hospiCashArray.RiderPlanCode = $scope.calcData.hospicashRiderCalculation.prodCode;
          /** 1 = Eapp, 2 = OLS **/
          hospiCashArray.ReferenceSystemTypeId = "1";
          hospiCashArray.Term = "" + $scope.outputData.riderPpt;
          hospiCashArray.SumAssured = $scope.calcData.hospicashRiderCalculation.sumAssured;
          hospiCashArray.IsNSAPProposer = "" + 0;
          hospiCashArray.ModalPremium = $scope.calcData.hospicashRiderCalculation.modalHospiCashPremium;
          hospiCashArray.ServiceTaxPayable = $scope.calcData.hospicashRiderCalculation.serviceTaxForModalFirstYear;
          hospiCashArray.PremiumPayable = $scope.calcData.hospicashRiderCalculation.totalModalPremiumWithTaxForFirstYear;
          samriddhiRidersData[i] = hospiCashArray;

        }





        if (selectedRiderIds[i] == adbRiderId) {
          //user selected Hospicash Rider
          var adbRiderArray = {};
          adbRiderArray.FkAgentCode = "" + userData.agentId;
          adbRiderArray.FkQuotationId = biQuoteNo;
          adbRiderArray.FkRiderId = "" + selectedRiderIds[i];
          adbRiderArray.RiderPlanCode = $scope.calcData.adbRiderCalculation.prodCode;
          /** 1 = Eapp, 2 = OLS **/
          adbRiderArray.ReferenceSystemTypeId = "1";
          adbRiderArray.Term = $scope.outputData.ppt;
          adbRiderArray.SumAssured = $scope.outputData.sumAssuredForADBRiders;
          adbRiderArray.IsNSAPProposer = "" + 0;
          adbRiderArray.ModalPremium = $scope.calcData.adbRiderCalculation.modalAdbRiderPremium;
          adbRiderArray.ServiceTaxPayable = $scope.calcData.adbRiderCalculation.serviceTaxForModalFirstYear;
          adbRiderArray.PremiumPayable = $scope.calcData.adbRiderCalculation.totalModalPremiumWithTaxForFirstYear;
          samriddhiRidersData[i] = adbRiderArray;
        }





        if (selectedRiderIds[i] == $scope.outputData.selectedPwrRiderID && $scope.outputData.PWRI && $scope.pwrRider) {
          //user selected RWR Rider.
          var pwr1Array = {};
          pwr1Array.FkAgentCode = "" + userData.agentId;
          pwr1Array.FkQuotationId = biQuoteNo;
          pwr1Array.FkRiderId = "" + selectedRiderIds[i];
          pwr1Array.RiderPlanCode = $scope.calcData.pwrRiderCalculation.prodCode;
          /** 1 = Eapp, 2 = OLS **/
          pwr1Array.ReferenceSystemTypeId = "1";
          pwr1Array.Term = $scope.outputData.ppt;
          pwr1Array.SumAssured = $scope.outputData.sumAssuredForADBRiders;
          pwr1Array.IsNSAPProposer = "" + $scope.outputData.NSAPForPrposer;
          pwr1Array.ModalPremium = $scope.calcData.pwrRiderCalculation.modalPWRRiderPremium;
          pwr1Array.ServiceTaxPayable = $scope.calcData.pwrRiderCalculation.serviceTaxForModalFirstYear;
          pwr1Array.PremiumPayable = $scope.calcData.pwrRiderCalculation.totalModalPremiumWithTaxForFirstYear;
          samriddhiRidersData[i] = pwr1Array;
        }





        if (selectedRiderIds[i] == $scope.outputData.selectedPwrRiderID && $scope.outputData.PWRII && $scope.pwrRider) {
          //user selected RWR Rider.
          var pwr2Array = {};
          pwr2Array.FkAgentCode = "" + userData.agentId;
          pwr2Array.FkQuotationId = biQuoteNo;
          pwr2Array.FkRiderId = "" + selectedRiderIds[i];
          pwr2Array.RiderPlanCode = $scope.calcData.pwrRiderCalculation.prodCode;
          /** 1 = Eapp, 2 = OLS **/
          pwr2Array.ReferenceSystemTypeId = "1";
          pwr2Array.Term = "" + $scope.outputData.ppt;
          pwr2Array.SumAssured = $scope.outputData.sumAssured;
          pwr2Array.IsNSAPProposer = "" + $scope.outputData.NSAPForPrposer;
          pwr2Array.ModalPremium = $scope.calcData.pwrRiderCalculation.modalPWRRiderPremium;
          pwr2Array.ServiceTaxPayable = $scope.calcData.pwrRiderCalculation.serviceTaxForModalFirstYear;
          pwr2Array.PremiumPayable = $scope.calcData.pwrRiderCalculation.totalModalPremiumWithTaxForFirstYear;
          samriddhiRidersData[i] = pwr2Array;
        }

      }
      return samriddhiRidersData;
    };

    function createSamriddhiIRDAQuotePDFJson(BiQuoteNo) {
      $log.debug("calcData", $scope.calcData);
      var userData = getSetCommonDataService.getCommonData();
      var currentData = getSetCommonDataService.getCurrentProdData();

      var selectedRiderData = {};
      var samriddhiIRDAQuotePDFJson = {
        "PDF": {}
      };
      samriddhiIRDAQuotePDFJson.PDF.quoteNo = BiQuoteNo;
      samriddhiIRDAQuotePDFJson.PDF.proposalNo = "";
      samriddhiIRDAQuotePDFJson.PDF.policyNo = "";
      samriddhiIRDAQuotePDFJson.PDF.uin = currentData.prodUIN;
      samriddhiIRDAQuotePDFJson.PDF.productCode = $scope.calcData.prodCode;
      samriddhiIRDAQuotePDFJson.PDF.riderCode = [];
      samriddhiIRDAQuotePDFJson.PDF.illustrationGeneratedBy = userData.channelName;
      samriddhiIRDAQuotePDFJson.PDF.illustrationDate = utilityService.getDisplayDate(new Date(), 'dd-MM-yyyy');

      samriddhiIRDAQuotePDFJson.PDF.lifeAssuredDetail = {
        name: $scope.data.liFirstName + " " + $scope.data.liLastName,
        gender: $scope.data.laGender == 0 ? "Male" : "Female",
        age: $scope.getAge($scope.data.labfAge),
      };
      samriddhiIRDAQuotePDFJson.PDF.proposerDetail = {};
      if ($scope.data.BuyingFor != "Self") {
        samriddhiIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.propFirstName + " " + $scope.data.propLastName;
        samriddhiIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.proposerGender == 0 ? "Male" : "Female";
        samriddhiIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.proposerAge);
      } else {
        samriddhiIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.liFirstName + " " + $scope.data.liLastName;
        samriddhiIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.laGender == 0 ? "Male" : "Female";
        samriddhiIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.labfAge);
      }
      samriddhiIRDAQuotePDFJson.PDF.benefitAndPremiumDetail = {
        planName: "" + currentData.prodLbl,
        policyTerm: "" + $scope.outputData.pt,
        premiumPaymentTerm: "" + $scope.inputData.ppt,
        premiumMode: $filter('filter')($scope.formData.PMODE, {
          id: $scope.inputData.premiumMode.toString()
        }, true)[0].name,
        benefitUptoAge: samriddhiIRDAQuotePDFJson.PDF.proposerDetail.age + $scope.outputData.pt,
        sumAssured: $scope.calcData.sumAssured,
        annualPremium: $scope.calcData.basePremium,
        modalPremium: $scope.calcData.modalPremium,
        nsapExtra: $scope.calcData.modalNsapPremium,
        serviceTax1stYear: $scope.calcData.serviceForAnnualFirstYearTax,
        serviceTax2ndYear: $scope.calcData.serviceForAnnualSecondYearTax,
        rider: [],
        totalPremium1stYear: $scope.calcData.totalAnnualPremiumWithTaxForFirstYear,
        totalPremium2ndYear: $scope.calcData.totalAnnualPremiumWithTaxForSecondYear


      };
      if ($scope.hospiCashRider) {
        samriddhiIRDAQuotePDFJson.PDF.riderCode.push($scope.calcData.hospicashRiderCalculation.prodCode);
        samriddhiIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, {
            FkRiderId: hospiCashRiderId.toString()
          }, true)[0].Label,
          policyTerm: "" + $scope.outputData.ppt,
          premiumPaymentTerm: "" + $scope.outputData.riderPpt,
          premiumMode: $filter('filter')($scope.formData.PMODE, {
            id: $scope.inputData.premiumMode.toString()
          }, true)[0].name,
          sumAssured: $scope.calcData.hospicashRiderCalculation.sumAssured,
          benefitUptoAge: samriddhiIRDAQuotePDFJson.PDF.proposerDetail.age + $scope.outputData.pt,
          nsapExtra: "" + 0,
          annualPremium: $scope.calcData.hospicashRiderCalculation.annualHospiCashPremium,
          modalPremium: $scope.calcData.hospicashRiderCalculation.modalHospiCashPremium,
          serviceTax1stYear: $scope.calcData.hospicashRiderCalculation.serviceForAnnualFirstYearTax,
          serviceTax2ndYear: $scope.calcData.hospicashRiderCalculation.serviceForAnnualFirstYearTax
        });
      }

      if ($scope.adbRider) {
        samriddhiIRDAQuotePDFJson.PDF.riderCode.push($scope.calcData.adbRiderCalculation.prodCode);
        samriddhiIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, {
            FkRiderId: adbRiderId.toString()
          }, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, {
            id: $scope.inputData.premiumMode.toString()
          }, true)[0].name,
          sumAssured: $scope.outputData.sumAssuredForADBRiders,
          benefitUptoAge: samriddhiIRDAQuotePDFJson.PDF.proposerDetail.age + $scope.outputData.pt,
          nsapExtra: "" + 0,
          annualPremium: $scope.calcData.adbRiderCalculation.abdRiderPremium,
          modalPremium: $scope.calcData.adbRiderCalculation.modalAdbRiderPremium,
          serviceTax1stYear: $scope.calcData.adbRiderCalculation.serviceTaxForAnnualFirstYear,
          serviceTax2ndYear: $scope.calcData.adbRiderCalculation.serviceTaxForAnnualFirstYear

        });
      }
      if ($scope.pwrRider && $scope.outputData.PWRI) {
        samriddhiIRDAQuotePDFJson.PDF.riderCode.push($scope.calcData.pwrRiderCalculation.prodCode);
        samriddhiIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, {
            FkRiderId: pwrRiderId.toString()
          }, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, {
            id: $scope.inputData.premiumMode.toString()
          }, true)[0].name,
          sumAssured: $scope.outputData.sumAssuredForADBRiders,
          benefitUptoAge: samriddhiIRDAQuotePDFJson.PDF.proposerDetail.age + $scope.outputData.pt,
          nsapExtra: $scope.calcData.pwrRiderCalculation.extraModalPremiumDueToNSAP,
          annualPremium: $scope.calcData.pwrRiderCalculation.totalModalRiderWithoutServiceTax,
          modalPremium: $scope.calcData.pwrRiderCalculation.modalPwrPremium,
          serviceTax1stYear: $scope.calcData.pwrRiderCalculation.serviceForAnnualFirstYearTax,
          serviceTax2ndYear: $scope.calcData.pwrRiderCalculation.serviceForAnnualFirstYearTax
        });
      }
      if ($scope.pwrRider && $scope.outputData.PWRII) {
        samriddhiIRDAQuotePDFJson.PDF.riderCode.push($scope.calcData.pwrRiderCalculation.prodCode);
        samriddhiIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, {
            FkRiderId: pwrRiderId.toString()
          }, true)[0].Label,
          policyTerm: "" + $scope.outputData.pt,
          premiumPaymentTerm: "" + $scope.outputData.ppt,
          premiumMode: $filter('filter')($scope.formData.PMODE, {
            id: $scope.inputData.premiumMode.toString()
          }, true)[0].name,
          sumAssured: $scope.outputData.sumAssuredForADBRiders,
          benefitUptoAge: samriddhiIRDAQuotePDFJson.PDF.proposerDetail.age + $scope.outputData.pt,
          nsapExtra: $scope.calcData.pwrRiderCalculation.extraModalPremiumDueToNSAP,
          annualPremium: $scope.calcData.pwrRiderCalculation.totalModalRiderWithoutServiceTax,
          modalPremium: $scope.calcData.pwrRiderCalculation.modalPwrPremium,
          serviceTax1stYear: $scope.calcData.pwrRiderCalculation.serviceForAnnualFirstYearTax,
          serviceTax2ndYear: $scope.calcData.pwrRiderCalculation.serviceForAnnualFirstYearTax
        });
      }

      $log.debug("benefitIllustration", $scope.calcData.biCalculation);
      samriddhiIRDAQuotePDFJson.PDF.benefitIllustration = $scope.calcData.biCalculation;
      /*samriddhiIRDAQuotePDFJson.PDF.benefitIllustration = {
        endOfPolicyYear:[],
        annualPremium:[],
        guaranteedDeathBenefit:[],
        guaranteedMaturityBenefit:[],
        guaranteedSurrenderValue:[],
        nonGuaranteed4DeathBenefit:[],
        nonGuaranteed4MaturityBenefit:[],
        nonGuaranteed4SurrenderValue:[],
        nonGuaranteed8DeathBenefit:[],
        nonGuaranteed8MaturityBenefit:[],
        nonGuaranteed8SurrenderValue:[]

      };*/
      return JSON.stringify(samriddhiIRDAQuotePDFJson);
      //return samriddhiIRDAQuotePDFJson;
    }

    /* set sumassured of base = adbrider  sumassured. */
    $scope.adbRiderInitialisevalues = function() {
        $scope.outputData.sumAssuredForADBRiders = $scope.calcData.sumAssured;
    };

    /**Calculate age method is used to validate age as per date of birth*/
    $scope.getAge = function(datestring) {
      $log.debug("datestring", datestring);
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

    /* Funtion for show Email Popup*/
    $scope.email = function() {
        $scope.showPlusPopup = false;
        $scope.showSendEmailPopup = true;
        $scope.email_To="";
        $scope.email_Cc="";
    };

    /* Funtion for hide Email Popup*/
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
    /**back routing ***/
    $scope.goBack = function() {
      $log.debug("CUrrent state : ", $state.current.name);
      if ($state.current.name == 'app.samriddhi-home') {
        $state.go("app.samriddhi-LAAndProposer");
      } else if ($state.current.name == 'app.samriddhi-LAAndProposer') {
        $state.go("app.eApp");
      } else if ($state.current.name == 'app.samriddhi-estimated') {
        $state.go("app.samriddhi-home");
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
