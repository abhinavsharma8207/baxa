/**
 * Created By: Abhinav Sharma
 * EliteSecure Calculation Controller
 *
 * @class elitesecureController
 * @submodule core-controller
 * @constructor
 */
eAppModule.controller('elitesecureController', ['$rootScope',
  '$scope',
  '$q',
  '$state',
  'eSCalculationService',
  '$http',
  'eliteSecureSwitchService',
  '$log',
  'commonDbProductCalculation',
  'elitesecureObjectService',
  'adbRiderForASDataFromUserSvc',
  'calculateAdbRiderPremiumSvc',
  'samriddhiEappDbService',
  'samriddhiCalculationEAppService',
  'eSValidationService',
  'riderValidationService',
  'eAppServices',
  'switchDataService',
  '$ionicPlatform',
  '$ionicHistory',
  '$ionicNavBarDelegate',
  '$ionicLoading',
  'getSetCommonDataService',
  'quoteProposalNosDataService',
  'eSDataFromDBSvc',
  'utilityService',
  '$filter',
  'sendBIEmailService',
  function($rootScope, $scope, $q, $state, eSCalculationService, $http,
    eliteSecureSwitchService, $log, commonDbProductCalculation,
    elitesecureObjectService, calculateAdbRiderPremiumSvc,
    adbRiderForASDataFromUserSvc, samriddhiEappDbService, samriddhiCalculationEAppService,
    eSValidationService, riderValidationService, eAppServices, switchDataService,
    $ionicPlatform, $ionicHistory, $ionicNavBarDelegate, $ionicLoading, getSetCommonDataService,
    quoteProposalNosDataService, eSDataFromDBSvc, utilityService, $filter, sendBIEmailService) {
    'use strict';

    $scope.data = elitesecureObjectService.getLAandProposerDetails();
    $scope.title = "Elite Secure";
    var prodId = 8;
    var channelId = 1;
    var adbRiderId = 4;
    var hospicashId = 5;
    $scope.adbRiderToggle = false;
    $scope.addRiders = false;
    $scope.defaultriderPpt = 5;
    $scope.defaultsumAssuredForRiders = "1000";
    $scope.errorMessage = [];
    $scope.hospiCashRider = false;
    $scope.adbRider = false;
    $scope.errormessagesForADBRider = [];
    $scope.errormessagesForHOSPICASHRider = [];
    $scope.data = {};
    $scope.data.laName = "ABC";
    $scope.data.laAge = 35;
    $scope.data.laGender = 1;
    $scope.data.proposerName = "ABC";
    $scope.data.proposerAge = 35;
    $scope.data.proposerGender = 0;
    $scope.data.sumAssured = 2500000;
    $scope.data.basePremium = 0;
    $scope.data.ppt = "20";
    $scope.data.uptoAge = null;
    $scope.data.NSAPForLA = false;
    $scope.data.premiumMode = 4;
    $scope.data.smoke = "nonsmoke";
    $scope.data.mode = "1";
    $scope.data.pt = "20";
    $scope.data.ptupto = null;
    $scope.data.sumAssuredForADBRiders = 2500000;
    $scope.data.laMinAge = 0;
    $scope.data.laMaxAge = 0;
    $scope.data.laMinAgeYear = 0;
    $scope.data.laMaxAgeYear = 0;
    $scope.data.propMinAgeYear = 0;
    $scope.data.propMaxAgeYear = 0;
    $scope.showHospicashError = false;
    $scope.data.BuyingFor = "Self";
    $scope.data.maxLaFirstLastLength = 30;
    $scope.data.maxLaFirstLastLength = 30;
    $scope.data.minPropFirstLastLength = 1;
    $scope.data.minPropFirstLastLength = 1;

    $scope.isIllustrationsSelected = true;
    $scope.isBrochureSelected = false;
    $scope.collOptions = {};



    $scope.params = {
      "ui_color": 'trblueline'
    }

    $scope.callCollFunc = function() {
      $scope.collOptions.collapseFunction();
    };

    $scope.collOptions2 = {};
    $scope.callCollFunc2 = function() {
      $scope.collOptions2.collapseFunction();
    };

    if ($state.params.customerId) {
      var samriddhiPi = switchDataService.getProfileData($state.params.customerId);
      samriddhiPi.then(function(samriddhi) {
        $scope.data.liFirstName = samriddhi.FirstName;
        $scope.data.liLastName = samriddhi.LastName;
        $scope.data.laGender = samriddhi.Gender;
        var inputData = eAppServices.getInputDetails();
        if (inputData != null && inputData != undefined && Object.prototype.toString.call(inputData) != '[object Array]') {

          $rootScope.switchData = inputData;
          eAppServices.resetScreenData();
        }
        if ($rootScope.switchData != null && $rootScope.switchData != undefined) {

          $scope.data.pt = $rootScope.switchData.pt;
          $scope.data.laswitchpt = $rootScope.switchData.pt;
          $scope.data.ppt = $rootScope.switchData.ppt;
          $scope.data.smoke = $rootScope.switchData.smoke;
          $scope.data.sumAssured = $rootScope.switchData.sumAssured;
          $scope.data.laGender = $rootScope.switchData.laGender;
          $scope.data.laswitchgender = $rootScope.switchData.laGender;
          $scope.data.mode = $rootScope.switchData.premiumMode;
          $scope.data.laswitchppt = $rootScope.switchData.ppt;
          if ($rootScope.switchData.ptupto != null) {

            $scope.data.uptoAge = $rootScope.switchData.ptupto;
            $scope.data.pt = null;
            $scope.data.ptupto = 75;
            $scope.data.ppt = 75 - $scope.data.laAge;
            $rootScope.ptUptoAge = 75 - $scope.data.laAge;
          }

        }
      });
    }

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

    $scope.choice = "nonsmoke";
    $scope.showPopupToGoForLAAndProposerDetails = false;
    $scope.premiumWithTaxes = false;

    commonDbProductCalculation.getAllStaticValuesByArray(8, 1, ["GENDER", "BUYPOLFOR", "PMODE"]).then(function(result) {
      $scope.formData = result;
      $scope.formData.PMODE.splice(2, 1);
    }).then(function() {
      if (elitesecureObjectService.getLAandProposerDetails() !== null && elitesecureObjectService.getLAandProposerDetails() !== undefined) {

        var formData = elitesecureObjectService.getLAandProposerDetails();

        if (formData !== null && formData !== undefined) {

          $scope.data = formData;

          if ($scope.data.laswitchgender != null && $scope.data.laswitchgender != undefined) {
            $scope.data.laGender = $scope.data.laswitchgender;
            $scope.data.laswitchgender = null;
          }
          if ($rootScope.ptUptoAge != null) {
            $scope.data.ppt = $rootScope.ptUptoAge;

          }

          if ($rootScope.switchData != null && $rootScope.switchData != undefined) {

            $scope.data.pt = $rootScope.switchData.pt;
            $scope.data.ppt = $rootScope.switchData.ppt;
            $scope.data.mode = $rootScope.switchData.premiumMode;
            $scope.data.smoke = $rootScope.switchData.smoke;
            $scope.data.sumAssured = $rootScope.switchData.sumAssured;
            $rootScope.switchData = null;
          }




        }
      }
    });



    $http.get('js/eApp/eliteSecure/validationMessage.json').then(function(responce) {

      $scope.validationMessage = responce;
      $log.debug("validation messages ", responce);
    });


    /*Proceed to get LA and Proposer page*/
    $scope.ProceedForLAAndProposerDetails = function(dataobj) {

      dataobj.laGender = dataobj.laGender;
      dataobj.laName = dataobj.liFirstName + " " + dataobj.liLastName;
      dataobj.laAge = CalculateAge(dataobj.labfAge);
      if (dataobj.sumAssured == null) {
        dataobj.sumAssured = 2500000;
      }
      if (dataobj.ptupto != null) {

        dataobj.ppt = "20";

      }

      if ($scope.data.pt == null) {
        dataobj.ppt = 75 - dataobj.laAge;

      }
      $scope.data.laName = dataobj.liFirstName + " " + dataobj.liLastName;



      if (dataobj.BuyingFor == 'Self') {
        dataobj.isSelf = true;
        dataobj.propFirstName = null;
        dataobj.propLastName = null;
        dataobj.proposerGender = null;
        dataobj.proposerAge = null;
      } else {
        $scope.data.isSelf = false;
        $scope.data.proposerName = dataobj.propFirstName + " " + dataobj.propLastName;
        dataobj.proposerName = dataobj.propFirstName + " " + dataobj.propLastName;
      }
      dataobj.isSelf = false;
      elitesecureObjectService.setLAandProposerDetails(dataobj);

      $state.go('app.elitesecure-home');
    };


    /*Function for calculating base Premium */
    $scope.calculate = function(data) {
      $scope.data.sumAssuredForADBRiders = $scope.data.sumAssured;
      data.premiumMode = data.mode;
      var productCode = "";
      var calData = data;
      if ($scope.data.uptoAge !== null && $scope.data.uptoAge !== undefined) {

        calData.uptoAge = $scope.data.uptoAge;
        calData.ppt = $scope.data.uptoAge;

      }

      eSDataFromDBSvc.getProductCode(prodId, channelId, calData.ppt).then(function(prodCode) {
        productCode = prodCode;
        $scope.data.productCode = productCode;
        eSValidationService.validateProduct(prodId, channelId, productCode, calData).then(function(messages) {
          $scope.dbError = "";
          $log.debug("final", calData);
          if (messages.length == 0) {
            $scope.showDbErrors = false;
            $scope.dbError = "";
            $scope.docalcBasePremium(prodId, channelId, calData);
          } else {
            $scope.showDbErrors = true;
            $scope.dbErrors = [];
            for (var e = 0; e < messages.length; e++) {
              var key = messages[e].Name;
              $scope.dbErrors[key] = messages[e].ErrorMessage;

            }
          }
        });
      });
    };
    $scope.getPt = function(prodId, channelId) {

      eliteSecureSwitchService.getAllPolicyTerm(prodId, channelId).then(function(val) {
        $log.debug('pts Values', val);
        $scope.pts = val;
        if ($scope.data.ptupto != null) {
          $scope.data.pt = null;
          $scope.data.ppt = 75 - $scope.data.laAge;
        }
      });
    };
    $scope.getUptoAge = function(prodId, channelId) {
      commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'UPTOAGE').then(function(val) {
        $log.debug('UPTOAGE 75', val);
        $scope.uptoage = val;

      });
    };

    $scope.getPt(prodId, channelId);
    $scope.getUptoAge(prodId, channelId);


    $scope.populatePPT = function(data, pt) {
      if (parseInt(pt) == 75) {
        $log.debug("the value of the pt is", pt);
        var uptoAge = 75 - data.laAge;
        $scope.data.uptoAge = 75;
        $scope.data.ppt = uptoAge;
        $log.debug("uptoAge", $scope.data.ppt);
        $rootScope.ptUptoAge = uptoAge;
      } else {
        $scope.data.ppt = pt;
        $scope.data.uptoAge = null;
        $scope.data.ptupto = null;
        $rootScope.ptUptoAge = null;
      }

    };



    $scope.toggleAdb = function() {

      $scope.adbRider = !$scope.adbRider;
      if ($scope.adbRider == true) {
        $scope.calculateAdbRider();
      } else {
        $scope.callCollFunc();

      }

    };

    $scope.calculateAdbRider = function() {
      if ($scope.data.sumAssuredForADBRiders <= $scope.data.sumAssured) {


        if (!$scope.isEmpty($scope.data.sumAssuredForADBRiders)) {
          var calData = {
            laGender: $scope.data.laGender,
            laAge: $scope.data.laAge,
            uptoAge: $scope.data.ptupto,
            ppt: $scope.data.pt,
            premiumMode: $scope.data.mode,
            sumAssured: $scope.data.sumAssured,
            sumAssuredForADBRiders: $scope.data.sumAssuredForADBRiders,
            ADBRider: true,
            riderterm: $scope.data.pt,
            pt: $scope.data.pt
          };

          if ($rootScope.ptUptoAge != null) {
            calData.ppt = "75";
            calData.riderterm = $rootScope.ptUptoAge;
            calData.uptoAge = 75;
          } else {

            calData.uptoAge = parseInt($scope.data.laAge) + parseInt($scope.data.pt);

          }

          var eliteSecureData = calData;
          console.log(calData);
          validateADBRider(prodId, channelId, eliteSecureData).then(function(messages) {
            console.log(messages);
            //
            // if (messages.length != 0) {
            //   if (messages[0].ErrorMessage == "Life Assured Maximum Maturity Age Should Be 75 Years") {
            //     messages = [];
            //
            //   }
            // }
            if (messages.length == 0) {
              elitesecureObjectService.adbRiderCalculation(adbRiderId, prodId, channelId, eliteSecureData).then(function(result) {
                $log.debug("ADB rider calculation", result);

                if (result.annualAdbRiderPremium == 0) {
                  $scope.errormessagesForADBRider = $scope.validationMessage.data.ThityPrecentofBasePremium;
                  $scope.adbRider = false;
                  var setservicedata = elitesecureObjectService.getEliteData();
                  setservicedata.setabdRider = false;
                  elitesecureObjectService.setEliteData(setservicedata);

                } else {
                  $scope.data.annualAdbRiderPremium = result.annualAdbRiderPremium;
                  $scope.data.modalAdbRiderPremium = result.modalAdbRiderPremium;
                  $scope.data.adbServiceTaxForModalFirstYear = result.serviceTaxForModalFirstYear;
                  $scope.data.adbserviceTaxForAnnualFirstYear = result.serviceTaxForAnnualFirstYear;
                  $scope.data.adbTotalModalPremiumWithTaxForFirstYear = result.totalModalPremiumWithTaxForFirstYear;
                  $scope.data.adbTotalAnnualPremiumWithTaxForFirstYear = result.totalAnnualPremiumWithTaxForFirstYear;
                  $scope.adbRider = true;
                  $scope.adbRiderProdCode = result.prodCode;
                  var setservicedata = elitesecureObjectService.getEliteData();
                  setservicedata.annualAdbRiderPremium = result.annualAdbRiderPremium;
                  setservicedata.modalAdbRiderPremium = result.modalAdbRiderPremium;
                  setservicedata.adbServiceTaxForModalFirstYear = result.serviceTaxForModalFirstYear;
                  setservicedata.adbserviceTaxForAnnualFirstYear = result.serviceTaxForAnnualFirstYear;
                  setservicedata.adbTotalModalPremiumWithTaxForFirstYear = result.totalModalPremiumWithTaxForFirstYear;
                  setservicedata.adbTotalAnnualPremiumWithTaxForFirstYear = result.totalAnnualPremiumWithTaxForFirstYear;
                  setservicedata.setabdRider = true;
                  setservicedata.sumAssuredForADBRiders = $scope.data.sumAssuredForADBRiders;
                  setservicedata.adbRiderProdCode = result.prodCode;
                  //  setservicedata.totalModalPremium =  $scope.data.modalPremium + result.abdRiderPremium ;
                  setservicedata.adbRiderId = adbRiderId
                  elitesecureObjectService.setEliteData(setservicedata);

                  if ($scope.hospiCashRider == true) {

                    var sumofriders = result.modalAdbRiderPremium + $scope.data.modalHospiCashPremium;
                    var thirtypercentofbasepremium = $scope.data.modalPremium * 30 / 100;
                    if (sumofriders > thirtypercentofbasepremium) {
                      $scope.adbRider = false;
                      setservicedata.annualAdbRiderPremium = null;
                      setservicedata.modalAdbRiderPremium = null;
                      setservicedata.adbServiceTaxForModalFirstYear = null;
                      setservicedata.adbserviceTaxForAnnualFirstYear = null;
                      setservicedata.adbTotalModalPremiumWithTaxForFirstYear = null;
                      setservicedata.adbTotalAnnualPremiumWithTaxForFirstYear = null;
                      setservicedata.adbRiderId = null;
                      elitesecureObjectService.setEliteData(setservicedata);
                      $scope.showAdbError = true;
                      $scope.AdbError = "sum of all rider premiums should not exceed 30% base plan premium";

                    } else {
                      $scope.showAdbError = false;

                    }

                  }

                }
              });
            } else {

              $scope.adbRider = false;
              $scope.errormessagesForADBRider = messages;

            }
          });
        }
      } else {
        $scope.adbRider = false;
      }
    };


    $scope.togglehospiCash = function(data) {

      $scope.hospiCashRider = !$scope.hospiCashRider;
      if ($scope.hospiCashRider == true) {
        $scope.calculateHospiCashRider(data);
      }

      if ($scope.hospiCashRider == false) {
        $scope.data.term = null;
        $scope.data.Dhcb = null;
        $scope.callCollFunc2();
      }
    };

    $scope.goToHomePage = function() {
      $state.go('app.elitesecure-home');
    };

    $scope.calculateHospiCashRider = function(data) {

      var caldata = {
        BuyingFor: data.BuyingFor,
        NSAPForLA: 'false',
        NSAPForPrposer: 'false',
        basePremium: data.basePremium,
        isSelf: data.isSelf,
        laAge: data.laAge,
        laGender: data.laGender,
        laName: data.laName,
        modelPremium: data.modalPremium,
        ppt: data.ppt,
        premiumMode: data.mode,
        premiumPaymentTerm: data.ppt,

        pt: data.pt,
        riderPpt: data.riderPpt,
        sumAssured: data.sumAssured,
        sumAssuredForRiders: data.sumAssuredForRiders,
      };

      if ($rootScope.ptUptoAge != null) {
        caldata.pt = $rootScope.ptUptoAge;
        caldata.ppt = "75";

      }


      if (data.propAge !== null && data.propAge !== undefined) {
        caldata.propAge = CalculateAge(data.propAge);

      }
      var hospicashData = caldata;


      if (data.uptoAge !== null && data.uptoAge !== undefined) {
        hospicashData.uptoAge = data.uptoAge;
        hospicashData.ppt = data.uptoAge;
      }

      if (data.Dhcb != undefined && data.term != undefined) {
        hospicashData.sumAssuredForRiders = data.Dhcb.name;
        hospicashData.riderPpt = data.term.name;
        hospicashData.hospiCash = true;
        validateHospiCashRider(prodId, channelId, hospicashData).then(function(messages) {
          // if (messages.length != 0) {
          //   if (messages[0].ErrorMessage == "Life Assured Maximum Maturity Age Should Be 75 Years") {
          //     messages = [];
          //
          //   }
          // }
          if (messages.length == 0) {
            elitesecureObjectService.HospicashRiderCalculation(prodId, channelId, hospicashData, hospicashData.basePremium).then(function(result) {
              if (result.annualHospiCashPremium == undefined) {
                var setservicedata = elitesecureObjectService.getEliteData();
                setservicedata.setHospicashRider = false;
                $scope.hospiCashRider = false;
                var hospiCashData = {};
                var showDbErrors = true;
                $scope.showHospicashError = true;
                elitesecureObjectService.setEliteData(setservicedata);
                $scope.hospiCashError = "sum of all rider premiums should not exceed 30% base plan premium";
              } else {

                var setservicedata = elitesecureObjectService.getEliteData();
                $scope.data.annualHospiCashPremium = result.annualHospiCashPremium;
                $scope.data.modalHospiCashPremium = result.modalHospiCashPremium;
                $scope.data.hospicashServiceTaxForModalFirstYear = result.serviceTaxForModalFirstYear;
                $scope.data.hospicashserviceTaxForAnnualFirstYear = result.serviceTaxForAnnualFirstYear;
                $scope.data.hospicashTotalModalPremiumWithTaxForFirstYear = result.totalModalPremiumWithTaxForFirstYear;
                $scope.data.hospicashtotalAnnualPremiumWithTaxForFirstYear = result.totalAnnualPremiumWithTaxForFirstYear;
                $scope.data.benfitUptoAge = result.benfitUptoAge;

                //  $scope.data.modalHospiRiderWithServiceTax = result.modalHospiRiderWithServiceTax;
                $scope.data.HospiRiderProdCode = result.prodCode;
                $scope.data.percentOfBasePremium = result.percentOfBasePremium;
                //  $scope.data.riderPremium = parseInt(result.riderPremium);
                //  $scope.data.modalHospiRiderWithServiceTax = result.serviceTaxFactorForFirstAndSecondYear;
                //    $scope.data.totalPremium = result.totalPremium;
                $scope.hospiCashRider = true;
                $scope.showHospicashError = false;
                setservicedata.annualHospiCashPremium = result.annualHospiCashPremium;
                setservicedata.modalHospiCashPremium = result.modalHospiCashPremium;
                setservicedata.hospicashServiceTaxForModalFirstYear = result.serviceTaxForModalFirstYear;
                setservicedata.hospicashserviceTaxForAnnualFirstYear = result.serviceTaxForAnnualFirstYear;
                setservicedata.hospicashTotalModalPremiumWithTaxForFirstYear = result.totalModalPremiumWithTaxForFirstYear;
                setservicedata.hospicashtotalAnnualPremiumWithTaxForFirstYear = result.totalAnnualPremiumWithTaxForFirstYear;


                setservicedata.HospiRiderProdCode = result.prodCode;
                //  setservicedata.totalModalPremium = $scope.data.modalPremium + result.modalHospiCashPremium;
                setservicedata.setHospicashRider = true;
                elitesecureObjectService.setEliteData(setservicedata);
                if ($scope.adbRider == true) {

                  var sumofriders = $scope.data.modalAdbRiderPremium + $scope.data.modalHospiCashPremium;
                  var thirtypercentofbasepremium = $scope.data.modalPremium * 30 / 100;
                  if (sumofriders > thirtypercentofbasepremium) {
                    $scope.hospiCashRider = false;
                    setservicedata.benfitUptoAge = null;
                    setservicedata.annualHospiCashPremium = null;
                    setservicedata.modalHospiCashPremium = null;
                    setservicedata.hospicashServiceTaxForModalFirstYear = null;
                    setservicedata.hospicashserviceTaxForAnnualFirstYear = null;
                    setservicedata.hospicashTotalModalPremiumWithTaxForFirstYear = null;
                    setservicedata.hospicashtotalAnnualPremiumWithTaxForFirstYear = null;
                    setservicedata.HospiRiderProdCode = null;
                    setservicedata.setHospicashRider = false;
                    elitesecureObjectService.setEliteData(setservicedata);
                    $scope.showHospicashError = true;
                    $scope.hospiCashError = "sum of all rider premiums should not exceed 30% base plan premium";
                    $scope.data.term = null;
                    $scope.data.Dhcb = null;

                  } else {
                    $scope.showHospicashError = false;

                  }

                }
              }
            });
          }

        });
      } else {
        $scope.hospiCashRider = false;


      }
    };

    function CalculateAge(laAge) {
      var today_date = new Date();
      var today_year = today_date.getFullYear();
      var today_month = today_date.getMonth();
      var today_day = today_date.getDate();
      var age = today_year - laAge.getFullYear();

      if (today_month < (laAge.getMonth() - 1)) {
        age--;
      }
      if (((laAge.getMonth() - 1) == today_month) && (today_day < laAge.getDate())) {
        age--;
      }
      return age;
    }

    $scope.openPopupForChangeDetails = function() {
      $scope.showPopupToGoForLAAndProposerDetails = true;
    };

    $scope.goToLAAndProposer = function() {
      $state.go("app.elitesecure-LAAndProposer");
    };

    $scope.closePopupForChangeDetails = function() {
      $scope.showPopupToGoForLAAndProposerDetails = false;
    };

    samriddhiEappDbService.getAllStaticValuesByArray(hospicashId, channelId, ["DHCB", "RTERM"]).then(function(result) {
      $rootScope.HospicashformData = result;


    });

    $scope.showPopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = true;
    };


    $scope.closePopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = false;
    };

    $scope.docalcBasePremium = function(prodId, channelId, data) {
      var basePremium = eSCalculationService.calcTotalBasePremium(prodId, channelId, data);
      basePremium.then(function(result) {

        console.log(result.modalFactor);
        $log.debug('cal-basePremium', result);

        $scope.data.basePremium = result.basePremium;
        $scope.data.sumAssuredForRiders = $scope.defaultsumAssuredForRiders;
        $scope.data.riderPpt = $scope.defaultriderPpt;
        $scope.data.modalPremium = result.modalPremium;
        $scope.data.serviceTax = result.serviceTax;
        $scope.data.totalModalPremium = result.modalPremium;
        $scope.data.serviceTaxEduCess = result.serviceTaxEduCess;
        $scope.data.modalFactor = result.modalFactor;
        $scope.data.serviceForAnnualFirstYearTax = result.serviceForAnnualFirstYearTax;
        $scope.data.totalAnnualPremiumWithTaxForFirstYear = result.totalAnnualPremiumWithTaxForFirstYear;
        elitesecureObjectService.setEliteData(result);
        elitesecureObjectService.setLAandProposerDetails($scope.data);



        $state.go('app.elitesecure-estimated');
      });

    };

    $scope.toggleADBRider = function() {

      $scope.adbRider = !$scope.adbRider;
    };

    $scope.toggleHospiCashRider = function() {

      $scope.hospiCashRider = !$scope.hospiCashRider;
    };

    $scope.closeError = function() {
      $scope.errorMessage = [];
    };



    function validateADBRider(prodId, channelId, data) {
      var q = $q.defer();
      var isValid = false;
      eSDataFromDBSvc.getProductCode(prodId, channelId, data.ppt)
        .then(function(prodCode) {
          var prodBaseCode = prodCode;
          var dbErrorMessages = [];
          $q.all([
            riderValidationService.riderPreADBValidateService(data, prodId, channelId, prodBaseCode)
          ]).then(function(validations) {
            $log.debug('validations>>>', validations[0]);
            q.resolve(validations[0]);
          }); //EOF Q ALL
        }); // EOF get product
      return q.promise;
    }



    function validateHospiCashRider(prodId, channelId, data) {
      var q = $q.defer();
      var isValid = false;
      eSDataFromDBSvc.getProductCode(prodId, channelId, data.ppt)
        .then(function(prodCode) {
          var prodBaseCode = prodCode;
          var dbErrorMessages = [];
          $q.all([
            riderValidationService.riderPreHCValidateService(data, prodId, channelId, prodBaseCode)
            //	riderValidationService.riderPreADBValidateService(data, prodId, channelId, prodBaseCode),
          ]).then(function(validations) {
            $log.debug('validations>>>', validations);
            q.resolve(validations[0]);

          }); //EOF Q ALL
        }); // EOF get product
      return q.promise;
    }

    $scope.saveQuote = function() {
      /** parameters sendEmail false and email data null **/
      $scope.createQuoteData(false, null, false);
    };

    $scope.proceedToFormFilling = function() {
      /** parameters sendEmail false and email data null **/
      $scope.createQuoteData(false, null, false);
    };

    $scope.isEmpty = function(str) {
      return (!str || 0 === str.length);
    };

    $scope.validateadb = function() {
      if ($scope.isEmpty($scope.data.sumAssuredForADBRiders)) {
        $scope.data.sumAssuredForADBRiders = $scope.data.sumAssured;

      }

    };



    $scope.createQuoteData = function(isFromEmail, emailData, isOnlineEmailRequired) {

      //isOnlineEmailRequired=false;
      if (isFromEmail && isOnlineEmailRequired) {
        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner><p>Sending Email..!</p>'
        });
      }

      var eliteSecureQuoteData = {};
      var userData = getSetCommonDataService.getCommonData();
      var currentData = getSetCommonDataService.getCurrentProdData();
      $log.debug("####################userData############", userData);
      $log.debug("####################currentData############", currentData);
      var eliteSecureRidersData = [
        []
      ];
      var elitedata = elitesecureObjectService.getLAandProposerDetails();
      var elitequotedata = elitesecureObjectService.getEliteData();
      quoteProposalNosDataService.getBIQuoteNumber(userData.agentId)
        .then(function(biRefNo) {
          console.log(biRefNo);
          var flexiSaveQuoteData = {};
          var flexiSaveRidersData = [
            []
          ];
          var quoteCustomJson = {
            quoteData: [],
            adbRiderData: [],
            hospiRiderData: [],
            pwRiderIData: [],
            pwRiderIIData: []
          };



          /**BI Ref No**/
          eliteSecureQuoteData.PkQuotationId = biRefNo.BiQuoteNo;
          /**2 - >  1 = Eapp, 2 = OLS **/
          eliteSecureQuoteData.ReferenceSystemTypeId = "1";
          // /**Selected Product ID**/
          eliteSecureQuoteData.FkProductId = currentData.prodId;
          // /**Selected Product Plan Code**/
          eliteSecureQuoteData.ProductPlanCode = $scope.data.productCode;
          // /**Logged in Agent Id**/
          eliteSecureQuoteData.FkAgentCode = userData.agentId;
          // /**Buying For Screen**/
          eliteSecureQuoteData.BuyingFor = elitedata.BuyingFor;
          /**7 -> liFirstName**/
          eliteSecureQuoteData.LAFirstName = elitedata.liFirstName;
          /**8 -> liLastName**/
          eliteSecureQuoteData.LALastName = elitedata.liLastName;
          /**10 -> LADOB**/
          eliteSecureQuoteData.LAGender = elitedata.laGender == 0 ? "Male" : "Female";
          eliteSecureQuoteData.LADOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          /**11 -> propFirstName**/
          /**12 -> propLastName**/
          /**13 -> proposerGender**/
          /**14 -> ProposerDOB**/

          if (elitedata.BuyingFor != "Self") {
            eliteSecureQuoteData.ProposerFirstName = elitedata.propFirstName;
            eliteSecureQuoteData.ProposerLastName = elitedata.propLastName;
            eliteSecureQuoteData.ProposerGender = elitedata.proposerGender == 0 ? "Male" : "Female";
            eliteSecureQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.proposerAge), 'MM/dd/yyyy');
          } else {
            eliteSecureQuoteData.ProposerFirstName = elitedata.liFirstName;
            eliteSecureQuoteData.ProposerLastName = elitedata.liLastName;
            eliteSecureQuoteData.ProposerGender = elitedata.laGender == 0 ? "Male" : "Female";
            eliteSecureQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          }
          /**Input/Output Screen**/
          /**15 -> IsSmoker**/
          if (elitedata.smoke != undefined) {
            eliteSecureQuoteData.IsSmoker = (elitedata.smoke == "nonsmoke") ? "" + 0 : "" + 1;
          } else {
            eliteSecureQuoteData.IsSmoker = "" + 0;
          }

          /**16->benfitUptoAge**/
          if (elitedata.uptoAge != undefined) {
            eliteSecureQuoteData.UptoAge = "" + elitedata.uptoAge;
            elitedata.pt = 75;
          } else {
            eliteSecureQuoteData.UptoAge = null;
          }
          /**17-> PayType - (Limited/Regular) if applicable **/
          eliteSecureQuoteData.PayType = null;
          //(Endowment/Money Back)(Fixed Monthly Payout/Lumpsum + Increasing Payout)
          eliteSecureQuoteData.BenefitType = null;
          /**19->PremiumPaymentTerm**/
          eliteSecureQuoteData.PremiumPaymentTerm = elitedata.ppt;
          /**20->Policy Term**/
          eliteSecureQuoteData.PolicyTerm = elitedata.pt;
          /**21->SumAssured/Life Cover**/
          eliteSecureQuoteData.SumAssured = elitedata.sumAssured;
          /**22->GuaranteedIncomePeriod**/
          eliteSecureQuoteData.GuaranteedIncomePeriod = null;
          /**23->GuaranteedIncomePeriod**/
          eliteSecureQuoteData.MaturityPayoutPeriod = null;
          /**24->MaturityPayoutFrequency**/
          eliteSecureQuoteData.MaturityPayoutFrequency = null;
          /**25->FlexiBenefitPeriod**/
          eliteSecureQuoteData.FlexiBenefitPeriod = null;
          /**26->AnnualBasePremium**/
          eliteSecureQuoteData.AnnualBasePremium = elitequotedata.basePremium;
          /**27->Mode**/
          eliteSecureQuoteData.Mode = elitedata.premiumMode;
          /**28->ModalFactor**/
          eliteSecureQuoteData.ModalFactor = elitequotedata.modalFactor;
          /**29->ModalPremium**/
          eliteSecureQuoteData.ModalPremium = elitequotedata.modalPremium;
          /**30->NSAPForLA**/
          eliteSecureQuoteData.IsNSAP = elitedata.NSAPForLA;
          /**31->ServiceTax**/
          eliteSecureQuoteData.ServiceTax = elitequotedata.serviceTax;
          /**32->PremiumPayable**/
          eliteSecureQuoteData.PremiumPayable = $scope.data.modalPremium + $scope.data.serviceTax;
          /**33->PremiumPayable**/
          eliteSecureQuoteData.IsInYourPresence = null;
          /**33->PremiumPayable**/
          eliteSecureQuoteData.EstimatedReturnRate = null;
          /**Default value is 0, For email functionality**/
          /**35-IsEmail**/
          /**36-ToRecipients**/
          /**37-CcRecipients**/
          /*  if (isFromEmail) {
              eliteSecureQuoteData.IsEmail = "" + 1;
              eliteSecureQuoteData.ToRecipients = emailData.To;
              eliteSecureQuoteData.CcRecipients = emailData.Cc;
            } else {
              eliteSecureQuoteData.IsEmail = "" + 0;
              eliteSecureQuoteData.ToRecipients = null;
              eliteSecureQuoteData.CcRecipients = null;
            }*/
          /**38-> create JSON for IRDA **/
          eliteSecureQuoteData.Json = createEliteSecureIRDAQuotePDFJson(biRefNo.BiQuoteNo);

          $log.debug("eliteSecureQuoteData...........", eliteSecureQuoteData);

          /**************************************************************************************/
          /**custom json creation for quote cpmparison***/

          quoteCustomJson.quoteData.push({
            ReferenceSystemTypeId: eliteSecureQuoteData.ReferenceSystemTypeId,
            FkProductId: eliteSecureQuoteData.FkProductId,
            ProductPlanCode: eliteSecureQuoteData.ProductPlanCode,
            FkAgentCode: eliteSecureQuoteData.FkAgentCode,
            BuyingFor: eliteSecureQuoteData.BuyingFor,
            LAFirstName: eliteSecureQuoteData.LAFirstName,
            LALastName: eliteSecureQuoteData.LALastName,
            LAGender: eliteSecureQuoteData.LAGender,
            LADOB: eliteSecureQuoteData.LADOB,
            ProposerFirstName: eliteSecureQuoteData.ProposerFirstName,
            ProposerLastName: eliteSecureQuoteData.ProposerLastName,
            ProposerGender: eliteSecureQuoteData.ProposerGender,
            ProposerDOB: eliteSecureQuoteData.ProposerDOB,
            IsSmoker: eliteSecureQuoteData.IsSmoker,
            UptoAge: eliteSecureQuoteData.UptoAge,
            PayType: eliteSecureQuoteData.PayType,
            BenefitType: eliteSecureQuoteData.BenefitType,
            PremiumPaymentTerm: eliteSecureQuoteData.PremiumPaymentTerm,
            PolicyTerm: eliteSecureQuoteData.PolicyTerm,
            SumAssured: eliteSecureQuoteData.SumAssured,
            GuaranteedIncomePeriod: eliteSecureQuoteData.GuaranteedIncomePeriod,
            MaturityPayoutPeriod: eliteSecureQuoteData.MaturityPayoutPeriod,
            MaturityPayoutFrequency: eliteSecureQuoteData.MaturityPayoutFrequency,
            FlexiBenefitPeriod: eliteSecureQuoteData.FlexiBenefitPeriod,
            AnnualBasePremium: eliteSecureQuoteData.AnnualBasePremium,
            Mode: eliteSecureQuoteData.Mode,
            ModalFactor: eliteSecureQuoteData.ModalFactor,
            ModalPremium: eliteSecureQuoteData.ModalPremium,
            IsNSAP: eliteSecureQuoteData.IsNSAP,
            ServiceTax: eliteSecureQuoteData.ServiceTax,
            PremiumPayable: eliteSecureQuoteData.PremiumPayable,
            IsInYourPresence: eliteSecureQuoteData.IsInYourPresence,
            EstimatedReturnRate: eliteSecureQuoteData.EstimatedReturnRate
          });
          var selectedRiderIds = [];


          if (elitequotedata.setHospicashRider) {
            selectedRiderIds.push(hospicashId);
            quoteCustomJson.hospiRiderData.push({
              FkAgentCode: "" + userData.agentId,
              FkRiderId: "" + hospicashId,
              RiderPlanCode: elitedata.HospiRiderProdCode,
              ReferenceSystemTypeId: "1",
              Term: "" + $scope.data.term.name,
              SumAssured: $scope.data.sumAssuredForRiders,
              IsNSAPProposer: "" + 0,
              ModalPremium: $scope.data.modalHospiCashPremium,
              ServiceTaxPayable: $scope.data.hospicashServiceTaxForModalFirstYear,
              PremiumPayable: $scope.data.modalHospiCashPremium + $scope.data.hospicashServiceTaxForModalFirstYear
            });
          }
          if (elitequotedata.setabdRider) {
            selectedRiderIds.push(adbRiderId);
            //added hospi cash rider data in custom code json
            quoteCustomJson.adbRiderData.push({
              FkAgentCode: "" + userData.agentId,
              FkRiderId: "" + adbRiderId,
              RiderPlanCode: $scope.adbRiderProdCode,
              ReferenceSystemTypeId: "1",
              Term: "" + $scope.data.pt,
              SumAssured: $scope.data.sumAssuredForADBRiders,
              IsNSAPProposer: "" + 0,
              ModalPremium: $scope.data.modalAdbRiderPremium,
              ServiceTaxPayable: $scope.data.adbServiceTaxForModalFirstYear,
              PremiumPayable: $scope.data.modalAdbRiderPremium + $scope.data.adbServiceTaxForModalFirstYear
            });

          }
          if (selectedRiderIds.length > 0) {

            eliteSecureRidersData = [
              []
            ];
            eliteSecureRidersData = $scope.createRidersData(userData, currentData, biRefNo.BiQuoteNo, selectedRiderIds);
            $log.debug("*******eliteSecureQuoteData*******", eliteSecureRidersData);
          }

          quoteProposalNosDataService.isQuoteDataInsertRequired(JSON.stringify(quoteCustomJson)).
          then(function(isRequired) {
            if (isRequired) {
              quoteProposalNosDataService.updateBIQuoteNumberUsedStatus(biRefNo.BiQuoteNo).then(function() {
                quoteProposalNosDataService.insertQuoteData(eliteSecureQuoteData);
                if (elitequotedata.setabdRider || elitequotedata.setHospicashRider) {
                  $log.debug("########eliteSecureQuoteData########", eliteSecureRidersData);
                  quoteProposalNosDataService.insertRidersData(eliteSecureRidersData);
                }
              });
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  $scope.hidesendEmailPopup();
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, eliteSecureQuoteData.Json, eliteSecureQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData, eliteSecureQuoteData.Json, eliteSecureQuoteData.FkProductId);
                }
              }
            } else {
              $log.debug("*******Same Quote Data already available*******");
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, eliteSecureQuoteData.Json, eliteSecureQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData, eliteSecureQuoteData.Json, eliteSecureQuoteData.FkProductId);
                }
                $scope.hidesendEmailPopup();
              }
            }
          });

        });
    };


    $scope.createRidersData = function(userData, currentData, biQuoteNo, selectedRiderIds) {

      var elitequotedata = elitesecureObjectService.getEliteData();
      var eliteSecureRidersData = [
        []
      ];
      for (var i = 0; i < selectedRiderIds.length; i++) {

        if (selectedRiderIds[i] == adbRiderId && elitequotedata.setabdRider) {

          var adbArray = {};
          //user selected Hospicash Rider
          adbArray.FkAgentCode = "" + userData.agentId;
          adbArray.FkQuotationId = biQuoteNo;
          adbArray.FkRiderId = "" + selectedRiderIds[i];
          adbArray.RiderPlanCode = $scope.adbRiderProdCode;
          /** 1 = Eapp, 2 = OLS **/
          adbArray.ReferenceSystemTypeId = "1";
          adbArray.Term = "" + $scope.data.pt;
          adbArray.SumAssured = $scope.data.sumAssuredForADBRiders;
          adbArray.IsNSAPProposer = "" + 0;
          adbArray.ModalPremium = $scope.data.modalAdbRiderPremium;
          adbArray.ServiceTaxPayable = $scope.data.adbServiceTaxForModalFirstYear;
          adbArray.PremiumPayable = $scope.data.modalAdbRiderPremium + $scope.data.adbServiceTaxForModalFirstYear;
          $log.debug("premiumpayeble ", ($scope.data.modalAdbRiderPremium + $scope.data.adbServiceTaxForModalFirstYear));
          eliteSecureRidersData[i] = adbArray;
        }
        if (selectedRiderIds[i] == hospicashId && elitequotedata.setHospicashRider) {
          var hospiArray = {};
          hospiArray.FkAgentCode = userData.agentId;
          hospiArray.FkQuotationId = biQuoteNo;
          hospiArray.FkRiderId = selectedRiderIds[i];
          hospiArray.RiderPlanCode = $scope.data.HospiRiderProdCode;
          hospiArray.Term = $scope.data.term.name;
          hospiArray.SumAssured = $scope.data.sumAssuredForRiders;
          hospiArray.IsNSAPProposer = "";
          hospiArray.ModalPremium = $scope.data.modalHospiCashPremium;
          hospiArray.ServiceTaxPayable = $scope.data.hospicashServiceTaxForModalFirstYear;
          hospiArray.PremiumPayable = $scope.data.modalHospiCashPremium + $scope.data.hospicashServiceTaxForModalFirstYear;
          eliteSecureRidersData[i] = hospiArray;

        }

      }
      return eliteSecureRidersData;
    };



    function createEliteSecureIRDAQuotePDFJson(BiQuoteNo) {
      var elitedata = elitesecureObjectService.getLAandProposerDetails();
      var elitequotedata = elitesecureObjectService.getEliteData();
      $log.debug("calcData", $scope.calcData);
      var userData = getSetCommonDataService.getCommonData();
      var currentData = getSetCommonDataService.getCurrentProdData();

      var selectedRiderData = {};
      var eliteSecureIRDAQuotePDFJson = {
        "PDF": {}
      };
      eliteSecureIRDAQuotePDFJson.PDF.quoteNo = BiQuoteNo;
      eliteSecureIRDAQuotePDFJson.PDF.proposalNo = "";
      eliteSecureIRDAQuotePDFJson.PDF.policyNo = "";
      eliteSecureIRDAQuotePDFJson.PDF.uin = currentData.prodUIN;
      eliteSecureIRDAQuotePDFJson.PDF.productCode = $scope.data.productCode;
      eliteSecureIRDAQuotePDFJson.PDF.riderCode = [];
      eliteSecureIRDAQuotePDFJson.PDF.illustrationGeneratedBy = userData.channelName;
      eliteSecureIRDAQuotePDFJson.PDF.illustrationDate = utilityService.getDisplayDate(new Date(), 'dd-MM-yyyy');

      eliteSecureIRDAQuotePDFJson.PDF.lifeAssuredDetail = {
        name: elitedata.liFirstName + " " + elitedata.liLastName,
        gender: elitedata.laGender == 0 ? "Male" : "Female",
        age: $scope.getAge($scope.data.labfAge),
      };
      eliteSecureIRDAQuotePDFJson.PDF.proposerDetail = {};
      if ($scope.data.BuyingFor != "Self") {
        eliteSecureIRDAQuotePDFJson.PDF.proposerDetail.name = elitedata.propFirstName + " " + elitedata.propLastName;
        eliteSecureIRDAQuotePDFJson.PDF.proposerDetail.gender = elitedata.proposerGender == 0 ? "Male" : "Female";
        eliteSecureIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge(elitedata.proposerAge);
      } else {
        eliteSecureIRDAQuotePDFJson.PDF.proposerDetail.name = elitedata.liFirstName + " " + elitedata.liLastName;
        eliteSecureIRDAQuotePDFJson.PDF.proposerDetail.gender = elitedata.laGender == 0 ? "Male" : "Female";
        eliteSecureIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.labfAge);
      }
      eliteSecureIRDAQuotePDFJson.PDF.benefitAndPremiumDetail = {
        planName: "" + currentData.prodLbl,
        policyTerm: "" + elitedata.pt,
        premiumPaymentTerm: "" + elitedata.ppt,
        premiumMode: $filter('filter')($scope.formData.PMODE, {
          id: elitedata.premiumMode.toString()
        }, true)[0].name,
        benefitUptoAge: eliteSecureIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt(elitedata.pt),
        sumAssured: elitedata.sumAssured,
        annualPremium: elitequotedata.basePremium,
        modalPremium: elitequotedata.modalPremium,
        serviceTax1stYear: elitequotedata.serviceTax,
        rider: [],
        totalPremium1stYear: elitequotedata.modalPremium + elitequotedata.serviceTax
      };
      if ($scope.hospiCashRider) {
        eliteSecureIRDAQuotePDFJson.PDF.riderCode.push($scope.data.HospiRiderProdCode);
        eliteSecureIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, {
            FkRiderId: hospicashId.toString()
          }, true)[0].Label,
          sumAssured: $scope.data.sumAssuredForRiders,
          benefitUptoAge: eliteSecureIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt(elitedata.pt),
          annualPremium: $scope.data.annualHospiCashPremium,
          modalPremium: $scope.data.modalHospiCashPremium,
          serviceTax1stYear: $scope.data.hospicashServiceTaxForModalFirstYear
        });
      }
      $log.debug("$scope.data", $scope.data)
      if ($scope.adbRider) {
        eliteSecureIRDAQuotePDFJson.PDF.riderCode.push($scope.adbRiderProdCode);
        eliteSecureIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, {
            FkRiderId: adbRiderId.toString()
          }, true)[0].Label,
          sumAssured: $scope.data.sumAssuredForADBRiders,
          benefitUptoAge: eliteSecureIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt(elitedata.pt),
          annualPremium: $scope.data.annualAdbRiderPremium,
          modalPremium: $scope.data.modalAdbRiderPremium,
          serviceTax1stYear: $scope.data.adbServiceTaxForModalFirstYear
        });
      }

      return JSON.stringify(eliteSecureIRDAQuotePDFJson);
      //return eliteSecureIRDAQuotePDFJson;
    }

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

    /**back routing ***/
    $scope.goBack = function() {
      if (1 < 0) {

      } else {
        $ionicHistory.goBack();
      }
    };

    $scope.email = function() {
      $scope.showPlusPopup = false;
      $scope.showSendEmailPopup = true;
      $scope.email_To = "";
      $scope.email_Cc = "";
    }

    $scope.hidesendEmailPopup = function() {
      $scope.showPlusPopup = false;
      $scope.showSendEmailPopup = false;
    }


    $scope.getHCRTerm = function(ppt, term) {
      return Number(ppt) >= Number(term);
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

    //** Back Button

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
