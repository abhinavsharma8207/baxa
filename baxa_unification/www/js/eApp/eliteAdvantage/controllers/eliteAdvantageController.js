eAppModule.controller('eliteAdvantageController', ['$log',
  '$scope',
  '$state',
  '$http',
  '$ionicHistory',
  '$ionicPlatform',
  '$ionicNavBarDelegate',
  '$ionicLoading',
  '$cordovaDatePicker',
  'eAppServices',
  'eAValidationService',
  'eACalculationService',
  'eliteAdvantageOutputService',
  'calculatehospiCashRiderPremiumSvc',
  'hospiCashRiderDataFromUserSvc',
  'eADataFromDBSvc',
  'getSetCommonDataService',
  'quoteProposalNosDataService',
  'utilityService',
  '$filter',
  'riderValidationService',
  'calculateAdbRiderPremiumSvc',
  'pwrRiderDataFromUserSvc',
  'calculatePwrRiderPremiumSvc',
  'prodValidationService',
  'sendBIEmailService',
  function($log, $scope, $state, $http, $ionicHistory, $ionicPlatform, $ionicNavBarDelegate, $ionicLoading,$cordovaDatePicker, eAppServices,
     eAValidationService, eACalculationService, eliteAdvantageOutputService, calculatehospiCashRiderPremiumSvc ,
     hospiCashRiderDataFromUserSvc ,eADataFromDBSvc ,getSetCommonDataService ,quoteProposalNosDataService ,utilityService,$filter,riderValidationService
    ,calculateAdbRiderPremiumSvc,pwrRiderDataFromUserSvc,calculatePwrRiderPremiumSvc,prodValidationService,sendBIEmailService) {
    'use strict';
    var vm = this;
    var hospiCashRiderId = 5,
      adbRiderId = 4,
      prodId = 12,
      channelId = 1,
      pwrRiderId = 6,
      pwrOption = 1;

    $scope.title = "Elite Advantage ";
    $scope.data = {};
    $scope.inputData = {};
    $scope.outputData = {};
    $scope.calcData = {};

    $scope.data.BuyingFor = 'Self';
    $scope.data.laGender = 0;
    $scope.data.liFirstName = "";
    $scope.data.liLastName = "";
    $scope.data.proposerGender                  = 0;
    $scope.data.propFirstName                   = "";
    $scope.data.propLastName                    = "";
    $scope.data.pwrRiderOption2                  = true;
    $scope.validationMessage                    = {};
    $scope.premiumWithTaxes                     = false;
    $scope.showPopupToGoForLAAndProposerDetails = false;
    /*Output page flags*/
    $scope.riders                               = false;
    $scope.hospiCashRider                       = false;
    $scope.adbRider                             = false;
    $scope.pwrRider                             = false;
    $scope.premiumWithTaxes                     = false;
    //To toggle the chart.
    //$scope.showHideChart                        = true;

    $scope.riderSelectAlert                   = false;
    $scope.pwrSelectAlert                     = false;
    $scope.isIllustrationsSelected = true;
    $scope.isBrochureSelected = false;
    

    //** Back Button Funtionality **//
    $scope.goBack = function() {
      if ($state.current.name == 'app.eliteAdvantage-home') {
          $state.go("app.eliteAdvantage-LAAndProposer");
      } else if ($state.current.name == 'app.eliteAdvantage-LAAndProposer') {
          $state.go("app.eApp");
      } else if ($state.current.name == 'app.eliteAdvantage-estimated') {
          $state.go("app.eliteAdvantage-home");
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
    $http.get('js/eApp/eliteAdvantage/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
    });
    /*Get validation messgae through json file.*/

    //** Get Data Variables **//
    //** Get Generic Options for Form Elements **//
    var params = {
      "ui_color": 'grenlinethree',
      "ui_gender"                   : true,
      "ui_age"                      : true,
      "ui_nsap"                     : true,
      "ui_sumAssured"               : false,
      "ui_anualPreminum"            : true,
      "ui_modelPreminum"            : true,
      "switch"                      : false,
      "ui_maturityPayoutFrequency"  : true,

    };
    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "BUYPOLFOR", "PMODE", "PPT", "SA" , "MPF"], ["PT","MPFACTOR"])
      .then(function(result) {
        $scope.params       = params;
        $scope.formData     = result[0];
        $scope.formDataCalc = {"PT":JSON.parse(result[1].PT),"MPFACTOR":JSON.parse(result[1].MPFACTOR)/*,"PREPAYOPN":JSON.parse(result[1].PREPAYOPN)*/};
        $scope.formDataOut  = result[2];

        var calcData     = eAppServices.getCalcDetails();
        var outputData   = eAppServices.getOutputDetails();
        //outputData.sumAssuredForADBRiders = outputData.sumAssured;
        var inputData    = eAppServices.getInputDetails();
        var data         = eAppServices.getBuyForDetails();

        if (Object.keys(outputData).length > 0) {
          $scope.outputData = outputData;
          $scope.adbRiderInitialisevalues();
          if (Object.keys(calcData).length > 0) { $scope.calcData = calcData; }
          if(Object.keys(data).length > 0){ $scope.data = data; }
          if(Object.keys(inputData).length > 0){ $scope.inputData  = inputData; }
        } else if (Object.keys(inputData).length > 0) {
          $scope.inputData = inputData;
          $scope.outputData = inputData;
          if(Object.keys(data).length > 0){ $scope.data = data; }
        } else if(Object.keys(data).length > 0){
          if(data.length > 0){ $scope.data = data; }
        } else {
          $state.go('app.eliteAdvantage-LAAndProposer');
        }

        //***** COPY PASTE - DATE MIN MAX FUNCTION *****//
        eAppServices.getLaAge(prodId, channelId)
          .then(function(result) {
            $scope.data.laMinAge      = result.MinAge;
            $scope.data.laMaxAge      = result.MaxAge;
            $scope.data.laMinAgeYear  = result.MinDate;
            $scope.data.laMaxAgeYear  = result.MaxDate;
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
      $scope.inputData.laName     = data.liFirstName + " " + data.liLastName;
      $scope.inputData.laAge      = $scope.getAge(data.labfAge);
      $scope.inputData.laGender   = parseInt(data.laGender);
      // $scope.inputData.sumAssured = 1000000;
      $scope.inputData.isSelf         = (data.BuyingFor == 'Self') ? (true) : (false);
      $scope.inputData.smoke          = 'nonsmoke';
      $scope.inputData.premiumMode    = ($scope.inputData.premiumMode)?($scope.inputData.premiumMode):(1); //default Value to select
      $scope.inputData.pt             = ($scope.inputData.pt)?($scope.inputData.pt):(12);
      $scope.inputData.ppt            = ($scope.inputData.ppt)?($scope.inputData.ppt):(12);
      $scope.inputData.annualPremium  = ($scope.inputData.annualPremium)?($scope.inputData.annualPremium):(50000);
      $scope.inputData.annualPremiumMinLength = 4;
      $scope.inputData.annualPremiumMaxLength = 10;
      $scope.inputData.maturityPremiumMode = ($scope.inputData.maturityPremiumMode)?($scope.inputData.maturityPremiumMode):(1);
      $scope.inputData.NSAPForLA           = ($scope.inputData.NSAPForLA)?($scope.inputData.NSAPForLA):(false);
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
      $state.go('app.eliteAdvantage-home');
    };




    /*
    Input page data calculation.
    */
    $scope.calculate = function(inputData) {
      $scope.inputData.basePremium       = $scope.inputData.annualPremium;
      $scope.outputData.pt              = eAppServices.getPolyOrPreminumTerm(inputData.ppt, $scope.formDataCalc.PT);
      $scope.populatePT(inputData.ppt);
      inputData.mp = $scope.data.mp;
      $scope.outputData.modalPremium    = eAppServices.getModalPremiumFromAnnualPremium(inputData.premiumMode, inputData.annualPremium, $scope.formDataCalc.MPFACTOR);
      $log.debug("input file details", inputData);
      eAppServices.setOutputDetails(inputData);
      //** Calculation **//
      $scope.outputData.pt                       = inputData.pt;
      $scope.outputData.ppt                      = inputData.ppt;
      $scope.outputData.smoke                    = inputData.smoke;
      $scope.outputData.NSAPForLA                = (inputData.NSAPForLA !== undefined) ? (inputData.NSAPForLA) : (false);

      if($scope.data.BuyingFor == "Self"){
        $scope.outputData.NSAPForPrposer         = $scope.outputData.NSAPForLA;
      }else{
        $scope.outputData.NSAPForPrposer         = false;
      }
      $scope.outputData.premiumMode              = inputData.premiumMode;
      $scope.outputData.basePremium              = inputData.annualPremium;
      $scope.outputData.maturityPremiumMode      = inputData.maturityPremiumMode;

      eACalculationService.calcEASumAssured(prodId, channelId, $scope.outputData.basePremium,$scope.outputData.ppt,$scope.outputData.laGender,$scope.outputData.laAge).then(function(sumAssured){
      var inputdetails = eAppServices.getOutputDetails();
      inputdetails.sumAssured       = sumAssured;
      $scope.outputData.sumAssured  = sumAssured;

      eAValidationService.validateProduct(prodId, channelId, $scope.outputData)
        .then(function(messages) {

          if (messages.length === 0 && $scope.outputData.pt > 0 && $scope.outputData.premiumMode > 0) {
            $scope.showDbErrors = false;
            eACalculationService.calculateEATotalPremium(prodId, channelId,  $scope.outputData)
            //calculateTrippleHealthPremiumSvc.calculateTotalPremium(prodId, channelId, $scope.outputData)
              .then(function(baseVal) {


                eACalculationService.calculateEABI(prodId, channelId, inputdetails).then(function(biCalculation){
                $log.debug("biCalculation", biCalculation);
                $scope.showOutput = true;
                $scope.calcData.mp = $scope.data.mp;
                $scope.calcData.basePremium = inputdetails.basePremium;
                $scope.calcData = $scope.outputData;
                $scope.calcData.sumAssured                = sumAssured;
                $scope.calcData.sumAssuredForADBRiders =sumAssured;
                $scope.calcData.serviceTax = parseFloat(baseVal.serviceForFirstYearTax);
                $scope.calcData.baseCalculation = baseVal;
                $scope.calcData.totalModalPremium = parseFloat(baseVal.totalModalPremium);
                $scope.calcData.extraPremiumDueToNSAP = parseFloat(baseVal.extraPremiumDueToNSAP);
                $scope.calcData.extraModalPremiumDueToNSAP = parseFloat(baseVal.extraModalPremiumDueToNSAP);
                $scope.calcData.biCalculation = biCalculation;
                $scope.calcData.outputData = calculationAsperPPTSelected($scope.calcData.biCalculation);
                $log.debug("calculation data", $scope.calcData);
                eAppServices.setCalcDetails($scope.calcData);

                /**Chart Code**/
                $scope.endOfPolicyYear =$scope.calcData.biCalculation.policyYearArr;
               var guaranteedVals = $scope.calcData.biCalculation.gMaturityBenfit;

               $scope.gsb = guaranteedVals;
               $log.debug("gsb value" , +$scope.gsb);
               $log.debug("endof policy year value" , +$scope.endOfPolicyYear);
               var y = 200;
               $scope.gsb.push(y);
               y = 160;
               $scope.gsb.push(y);
               $scope.data.finalArray=[];
               for (var i = 0; i < $scope.gsb.length; i++) {
                 if(i == $scope.gsb.length - 1 || i == $scope.gsb.length - 2){
                   var x = {
                     key: $scope.endOfPolicyYear[i],
                     value: $scope.gsb[$scope.endOfPolicyYear[i] - 1],
                     height: 150,//Math.floor((Math.random() * 100) + 1),
                     checked: false
                   };
                 }
                 else{
                   var x = {
                     key: $scope.endOfPolicyYear[i],
                     value: $scope.gsb[$scope.endOfPolicyYear[i] - 1],
                     height: 60,//Math.floor((Math.random() * 100) + 1),
                     checked: false
                   };
                 }
                 if(i == 17){
                   x.checked = true;
                   $scope.data.selected = $scope.gsb[$scope.endOfPolicyYear[i] - 1];
                 }
                 $scope.data.finalArray.push(x);
               }
                /**Chart Code**/

                $state.go('app.eliteAdvantage-estimated');
                  });
                });

          } else {
            $scope.showDbErrors = true;
            $scope.dbErrors = [];
            for (var e = 0; e < messages.length; e++) {
              $scope.dbErrors.push(messages[e][0]);
            }
          }
        });
        });
      //** Calculation **//
    };



    /*Animation code
      To roll down the home page when  user redirect from output page to home page  through click on input button.
    */
      $scope.animateClass = animateNgClass('bounceInDown', 'animationduration25');





    $scope.goToHomePage = function(){
        /*Animation Code*/
        setAnimate($ionicHistory);
        $state.go("app.eliteAdvantage-home");
    };




    /**Chart Function**/
    $scope.hightLightBar = function(label, index) {
      for (var i = 0; i < $scope.data.finalArray.length; i++) {
        if (i != index - 1) {
          $scope.data.finalArray[i].checked = false;
        } else {
          $scope.data.finalArray[i].checked = true;
        }
      }
      $scope.data.selected = label.value;
    };
    /**Chart Function**/


    function calculationAsperPPTSelected(biCalculation){
      $log.debug("XXxxxxxxxxxxxxxxxxxxxxxxxxxx",biCalculation);
      $scope.outputBiCal=[];
      $scope.outputBiCal.ppt5=calculationForPPT5(biCalculation);
      $scope.outputBiCal.ppt7=calculationForPPT7(biCalculation);
      $scope.outputBiCal.ppt12=calculationForPPT12(biCalculation);
      return $scope.outputBiCal;
    }



        function calculationForPPT5(biCalculation){
          var anualBenfitsForppt5  = 0;
          for(var i=10;i<=19;i++){
            anualBenfitsForppt5= anualBenfitsForppt5 + biCalculation.gMaturityBenfit[i]
          }
          return anualBenfitsForppt5;
        }

        function calculationForPPT7(biCalculation){
          var anualBenfitsForppt7 = 0;
          for(var i=12;i<=19;i++){
            anualBenfitsForppt7= anualBenfitsForppt7 + biCalculation.gMaturityBenfit[i]
          }
          return anualBenfitsForppt7;
        }

        function calculationForPPT12(biCalculation){
          var anualBenfitsForppt12 = 0;
          for(var i=12;i<=19;i++){
            anualBenfitsForppt12= anualBenfitsForppt12 + biCalculation.gMaturityBenfit[i]
          }
          return anualBenfitsForppt12;
        }



        $scope.populatePT = function(ppt){
          $log.debug('pt',ppt);
          eADataFromDBSvc.getEAPaymentTerm(prodId, channelId, ppt).then(function(val){
              eADataFromDBSvc.getMaturityPeriod(prodId, channelId, val).then(function(mp){
                   $scope.data.mp = mp;
              });
           $scope.data.pt = val;
          });
      };


    /**/
    $scope.updateRiderSA = function(data) {
      $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
    };

    $scope.adbRiderInitialisevalues = function(){
      $scope.outputData.sumAssuredForADBRiders = $scope.outputData.sumAssured;
    }



    /*Rider selection And calculation Funcion*/


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
        $scope.dbErrors =[];
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
            calcData.riderPpt            = calcData.hospiCashTerm;
            calcData.hospiCash           = true;
            //calcData.ppt = calcData.hospiCashTerm;
            hospiCashRiderDataFromUserSvc.setHospiCashData([]);
            var hospiInput = hospiCashRiderDataFromUserSvc.setHospiCashData(calcData);
            eAValidationService.validateHospiCashRider(prodId, channelId, calcData).then(function(messages) {
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
        if ($scope.riders.isHCActive) {
          $scope.dbErrors =[];
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
        $scope.calcData.basePremium = $scope.calcData.annualPremium;
        if ($scope.riders.isHCActive || $scope.riders.isADBActive) {
          $scope.riderSelectAlert = true;
        } else /*if($scope.riders.isPWRActive)*/ {
          eADataFromDBSvc.getEAProductCode(prodId, channelId, calcData.ppt , calcData.maturityPremiumMode)
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
                        $scope.calcData.basePremium = $scope.calcData.annualPremium;
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
                        $scope.calcData.basePremium = $scope.calcData.annualPremium;
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
          eADataFromDBSvc.getEAProductCode(prodId, channelId, $scope.outputData.ppt, calcData.maturityPremiumMode)
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
        if ($scope.riders.isADBActive) {
          $scope.riders.dbErrorADB = [];
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


    /*Enf of Rider selection and calculation funcuntion.*/



      $scope.getHCRTerm = function(ppt,term){
        return Number(ppt) >= Number(term);
      } ;

      /*
      Open popup on outpt page for calculations of premium with taxes.
      */
      $scope.openPopupPremiumWithTaxes   = function(){
          $scope.premiumWithTaxes  = true;
      }

      /*
      Close popup on outpt page for calculations of premium with taxes.
      */
      $scope.closePopupPremiumWithTaxes = function(){
          $scope.premiumWithTaxes  = false;
      }

      /*
      To show and hise the chart. this function can toggle the UI.
      */
      $scope.toggleChart = function(){
        $scope.showHideChart = !$scope.showHideChart;
      }



          /*
          Email quote for samriddhi.
          */

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


                var userData    = getSetCommonDataService.getCommonData();
                var currentData = getSetCommonDataService.getCurrentProdData();

                quoteProposalNosDataService.getBIQuoteNumber(userData.agentId)
                  .then(function(biRefNo) {
                    var eliteAdvantageQuoteData = {};
                    var eliteAdvantageRidersData = [
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
                    eliteAdvantageQuoteData.PkQuotationId = biRefNo.BiQuoteNo;
                    /**2 - >  1 = Eapp, 2 = OLS **/
                    eliteAdvantageQuoteData.ReferenceSystemTypeId = "1";
                    /**3 - > Selected Product ID**/
                    eliteAdvantageQuoteData.FkProductId = currentData.prodId;
                    /**4 - > Selected Product Plan Code**/
                    eliteAdvantageQuoteData.ProductPlanCode = $scope.calcData.baseCalculation.prodCode;
                    /**5-> Logged in Agent Id**/
                    eliteAdvantageQuoteData.FkAgentCode = "" + userData.agentId;
                    /**Buying For Screen**/
                    eliteAdvantageQuoteData.BuyingFor = $scope.data.BuyingFor;
                    eliteAdvantageQuoteData.LAFirstName = $scope.data.liFirstName;
                    eliteAdvantageQuoteData.LALastName = $scope.data.liLastName;
                    eliteAdvantageQuoteData.LAGender = "" + $scope.data.laGender==0?"Male":"Female";
                    eliteAdvantageQuoteData.LADOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
                    if (eliteAdvantageQuoteData.BuyingFor != "Self") {
                      eliteAdvantageQuoteData.ProposerFirstName = $scope.data.propFirstName;
                      eliteAdvantageQuoteData.ProposerLastName = $scope.data.propLastName;
                      eliteAdvantageQuoteData.ProposerGender = "" + $scope.data.proposerGender==0?"Male":"Female";
                      eliteAdvantageQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.proposerAge), 'MM/dd/yyyy');
                    } else {
                      eliteAdvantageQuoteData.ProposerFirstName = $scope.data.liFirstName;
                      eliteAdvantageQuoteData.ProposerLastName = $scope.data.liLastName;
                      eliteAdvantageQuoteData.ProposerGender = "" + $scope.data.laGender==0?"Male":"Female";
                      eliteAdvantageQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
                    }
                    /**Input/Output Screen**/
                    if ($scope.calcData.smoke != undefined) {
                      eliteAdvantageQuoteData.IsSmoker = ($scope.calcData.smoke == "nonsmoke") ? "" + 0 : "" + 1;
                    } else {
                      eliteAdvantageQuoteData.IsSmoker = "" + 0;
                    }
                    /**benfitUptoAge**/
                    if ($scope.calcData.benfitUptoAge != undefined) {
                      eliteAdvantageQuoteData.UptoAge = "" + $scope.outputData.ppt + $scope.inputData.laAge;
                    } else {
                      eliteAdvantageQuoteData.UptoAge = null;
                    }
                    /**PayType - (Limited/Regular) if applicable **/
                    eliteAdvantageQuoteData.PayType = null;
                    /**BenefitType - (Endowment/Money Back)(Fixed Monthly Payout/Lumpsum + Increasing Payout) if applicable **/
                    eliteAdvantageQuoteData.BenefitType = null;
                    /**PremiumPaymentTerm**/
                    eliteAdvantageQuoteData.PremiumPaymentTerm = "" + $scope.inputData.ppt;
                    /**Policy Term**/
                    eliteAdvantageQuoteData.PolicyTerm = "" + $scope.outputData.pt;
                    /**SumAssured/Life Cover**/
                    eliteAdvantageQuoteData.SumAssured = $scope.calcData.sumAssured;
                    eliteAdvantageQuoteData.GuaranteedIncomePeriod = null;
                    eliteAdvantageQuoteData.MaturityPayoutPeriod = $scope.data.mp;
                    eliteAdvantageQuoteData.MaturityPayoutFrequency = $scope.inputData.maturityPremiumMode;
                    eliteAdvantageQuoteData.FlexiBenefitPeriod = null;
                    eliteAdvantageQuoteData.AnnualBasePremium = $scope.calcData.basePremium;
                    eliteAdvantageQuoteData.Mode = "" + $scope.inputData.premiumMode;
                    eliteAdvantageQuoteData.ModalFactor = $scope.calcData.baseCalculation.modalFactor;
                    eliteAdvantageQuoteData.ModalPremium = $scope.calcData.modalPremium;
                    /**NSAPForLA**/
                    if ($scope.inputData.NSAPForLA != undefined) {
                      eliteAdvantageQuoteData.IsNSAP = "" + $scope.inputData.NSAPForLA;
                    } else {
                      eliteAdvantageQuoteData.IsNSAP = "" + 0;
                    }
                    eliteAdvantageQuoteData.ServiceTax = $scope.calcData.baseCalculation.serviceForAnnualFirstYearTax;
                    eliteAdvantageQuoteData.PremiumPayable = $scope.outputData.PremiumPayable;
                    eliteAdvantageQuoteData.IsInYourPresence = null;
                    eliteAdvantageQuoteData.EstimatedReturnRate = null;

                    /**Default value is 0, For email functionality**/
                    /*if (isFromEmail) {
                      eliteAdvantageQuoteData.IsEmail = "" + 1;
                      eliteAdvantageQuoteData.ToRecipients = emailData.To;
                      eliteAdvantageQuoteData.CcRecipients = emailData.Cc;
                    } else {
                      eliteAdvantageQuoteData.IsEmail = "" + 0;
                      eliteAdvantageQuoteData.ToRecipients = null;
                      eliteAdvantageQuoteData.CcRecipients = null;
                    }*/

                    /**create JSON for IRDA **/
                    eliteAdvantageQuoteData.Json = createEliteAdvantageIRDAQuotePDFJson(biRefNo.BiQuoteNo);
                    $log.debug("eliteAdvantageQuoteData...........", eliteAdvantageQuoteData);
                    quoteCustomJson.quoteData.push({
                      ReferenceSystemTypeId: eliteAdvantageQuoteData.ReferenceSystemTypeId,
                      FkProductId:           eliteAdvantageQuoteData.FkProductId,
                      ProductPlanCode:       eliteAdvantageQuoteData.ProductPlanCode,
                      FkAgentCode:           eliteAdvantageQuoteData.FkAgentCode,
                      BuyingFor:             eliteAdvantageQuoteData.BuyingFor,
                      LAFirstName:           eliteAdvantageQuoteData.LAFirstName,
                      LALastName:            eliteAdvantageQuoteData.LALastName,
                      LAGender:              eliteAdvantageQuoteData.LAGender,
                      LADOB:                 eliteAdvantageQuoteData.LADOB,
                      ProposerFirstName:     eliteAdvantageQuoteData.ProposerFirstName,
                      ProposerLastName:      eliteAdvantageQuoteData.ProposerLastName,
                      ProposerGender:        eliteAdvantageQuoteData.ProposerGender,
                      ProposerDOB:           eliteAdvantageQuoteData.ProposerDOB,
                      IsSmoker:              eliteAdvantageQuoteData.IsSmoker,
                      UptoAge:               $scope.outputData.ppt + $scope.inputData.laAge,
                      PayType:               eliteAdvantageQuoteData.PayType,
                      BenefitType:           eliteAdvantageQuoteData.BenefitType,
                      PremiumPaymentTerm:    eliteAdvantageQuoteData.PremiumPaymentTerm,
                      PolicyTerm:            eliteAdvantageQuoteData.PolicyTerm,
                      SumAssured:            eliteAdvantageQuoteData.SumAssured,
                      GuaranteedIncomePeriod:eliteAdvantageQuoteData.GuaranteedIncomePeriod,
                      MaturityPayoutPeriod:  eliteAdvantageQuoteData.MaturityPayoutPeriod,
                      MaturityPayoutFrequency: eliteAdvantageQuoteData.MaturityPayoutFrequency,
                      FlexiBenefitPeriod:    eliteAdvantageQuoteData.FlexiBenefitPeriod,
                      AnnualBasePremium:     eliteAdvantageQuoteData.AnnualBasePremium,
                      Mode:                  eliteAdvantageQuoteData.Mode,
                      ModalFactor:           eliteAdvantageQuoteData.ModalFactor,
                      ModalPremium:          eliteAdvantageQuoteData.ModalPremium,
                      IsNSAP:                eliteAdvantageQuoteData.IsNSAP,
                      ServiceTax:            eliteAdvantageQuoteData.ServiceTax,
                      PremiumPayable:        eliteAdvantageQuoteData.PremiumPayable,
                      IsInYourPresence:      eliteAdvantageQuoteData.IsInYourPresence,
                      EstimatedReturnRate:   eliteAdvantageQuoteData.EstimatedReturnRate
                    });

                    $log.debug("quoteCustomJson...........", quoteCustomJson);
                    // $scope.riderSelectAlert = false;
                    // $scope.hospiCashRider       = false;
                    // $scope.adbRider             = false;

                    $log.debug("$scope.riderHospi...........", $scope.hospiCashRider);
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


                    $log.debug("quoteCustomJson******...........", quoteCustomJson);

                    if (selectedRiderIds.length > 0) {
                      eliteAdvantageRidersData = [
                        []
                      ];
                      eliteAdvantageRidersData = $scope.createRidersData(userData, currentData, biRefNo.BiQuoteNo, selectedRiderIds);
                    }
                      //if same quote no need to save the data again - method will check is Quote save required
                    quoteProposalNosDataService.isQuoteDataInsertRequired(JSON.stringify(quoteCustomJson)).
                    then(function(isRequired) {
                      if (isRequired) {
                        quoteProposalNosDataService.updateBIQuoteNumberUsedStatus(biRefNo.BiQuoteNo).then(function() {
                          quoteProposalNosDataService.insertQuoteData(eliteAdvantageQuoteData);
                          if ($scope.riderHospi) {
                            quoteProposalNosDataService.insertRidersData(eliteAdvantageRidersData);
                          }
                        });
                        if (isFromEmail) {
                          if (isOnlineEmailRequired) {
                            $scope.hidesendEmailPopup();
                            quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, eliteAdvantageQuoteData.Json,eliteAdvantageQuoteData.FkProductId);
                          } else {
                            quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,eliteAdvantageQuoteData.Json,eliteAdvantageQuoteData.FkProductId);
                          }
                        }
                      } else {
                        $log.debug("Same Quote ****************");
                        if (isFromEmail) {
                          if (isOnlineEmailRequired) {
                            quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, eliteAdvantageQuoteData.Json,eliteAdvantageQuoteData.FkProductId);
                          } else {
                            quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,eliteAdvantageQuoteData.Json,eliteAdvantageQuoteData.FkProductId);
                          }
                          $scope.hidesendEmailPopup();
                        }
                      }
                    });

                    //  }
                  });
              };




              $scope.createRidersData = function(userData, currentData, biQuoteNo, selectedRiderIds) {
                var eliteAdvantageRidersData = [
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
                    eliteAdvantageRidersData[i] = hospiCashArray;
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
                    adbRiderArray.Term = "";
                    adbRiderArray.SumAssured = $scope.outputData.sumAssuredForADBRiders;
                    adbRiderArray.IsNSAPProposer = "" + 0;
                    adbRiderArray.ModalPremium = $scope.calcData.adbRiderCalculation.modalAdbRiderPremium;
                    adbRiderArray.ServiceTaxPayable = $scope.calcData.adbRiderCalculation.serviceTaxForModalFirstYear;
                    adbRiderArray.PremiumPayable = $scope.calcData.adbRiderCalculation.totalModalPremiumWithTaxForFirstYear;
                    eliteAdvantageRidersData[i] = adbRiderArray;
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
                      eliteAdvantageRidersData[i] = pwr1Array;
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
                    eliteAdvantageRidersData[i] = pwr2Array;
                  }

                }
                return eliteAdvantageRidersData;
              };

              function createEliteAdvantageIRDAQuotePDFJson(BiQuoteNo) {
                $log.debug("calcData",$scope.calcData);
                var userData = getSetCommonDataService.getCommonData();
                var currentData = getSetCommonDataService.getCurrentProdData();

                var selectedRiderData={};
                var eliteAdvantageIRDAQuotePDFJson = {"PDF":{}};
                eliteAdvantageIRDAQuotePDFJson.PDF.quoteNo = BiQuoteNo;
                eliteAdvantageIRDAQuotePDFJson.PDF.proposalNo = "";
                eliteAdvantageIRDAQuotePDFJson.PDF.policyNo = "";
                eliteAdvantageIRDAQuotePDFJson.PDF.uin = currentData.prodUIN;
                eliteAdvantageIRDAQuotePDFJson.PDF.productCode = $scope.calcData.baseCalculation.prodCode;
                eliteAdvantageIRDAQuotePDFJson.PDF.riderCode = [];
                eliteAdvantageIRDAQuotePDFJson.PDF.illustrationGeneratedBy = userData.channelName;
                eliteAdvantageIRDAQuotePDFJson.PDF.illustrationDate = utilityService.getDisplayDate(new Date(), 'dd-MM-yyyy');

                eliteAdvantageIRDAQuotePDFJson.PDF.lifeAssuredDetail = {
                  name: $scope.data.liFirstName + " " + $scope.data.liLastName,
                  gender: $scope.data.laGender==0?"Male":"Female",
                  age: $scope.getAge($scope.data.labfAge),
                };
                eliteAdvantageIRDAQuotePDFJson.PDF.proposerDetail = {};
                if ($scope.data.BuyingFor!="Self") {
                  eliteAdvantageIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.propFirstName + " " + $scope.data.propLastName;
                  eliteAdvantageIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.proposerGender==0?"Male":"Female";
                  eliteAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.proposerAge);
                } else {
                  eliteAdvantageIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.liFirstName + " " + $scope.data.liLastName;
                  eliteAdvantageIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.laGender==0?"Male":"Female";
                  eliteAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.labfAge);
                }
                eliteAdvantageIRDAQuotePDFJson.PDF.benefitAndPremiumDetail = {
                  planName: "" + currentData.prodLbl,
                  policyTerm: "" + $scope.outputData.pt,
                  premiumPaymentTerm: "" + $scope.inputData.ppt,
                  premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
                  benefitUptoAge:eliteAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age + parseInt($scope.outputData.pt),
                  maturityPayoutFrequency:$scope.inputData.maturityPremiumMode,
                  sumAssured: $scope.calcData.sumAssured,
                  annualPremium: $scope.calcData.basePremium,
          			  modalPremium: $scope.calcData.modalPremium,
                  nsapExtra:$scope.calcData.baseCalculation.modalNSAPPremium,
                  serviceTax1stYear: $scope.calcData.baseCalculation.serviceForAnnualFirstYearTax,
                  serviceTax2ndYear:$scope.calcData.baseCalculation.serviceForAnnualSecondYearTax,
                  rider: [],
                  totalPremium1stYear: $scope.calcData.baseCalculation.totalAnnualPremiumWithTaxForFirstYear,
                  totalPremium2ndYear:$scope.calcData.baseCalculation.totalAnnualPremiumWithTaxForSecondYear
                };
                if ($scope.hospiCashRider) {
                  eliteAdvantageIRDAQuotePDFJson.PDF.riderCode.push($scope.calcData.hospicashRiderCalculation.prodCode);
                  eliteAdvantageIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
                    planName: $filter('filter')(currentData.ridersData, { FkRiderId: hospiCashRiderId.toString()}, true)[0].Label,
                    policyTerm: "" + $scope.outputData.ppt,
                    premiumPaymentTerm: "" + $scope.outputData.riderPpt,
                    premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
                    sumAssured: $scope.calcData.hospicashRiderCalculation.sumAssured,
                    benefitUptoAge: eliteAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age +  parseInt($scope.outputData.pt),
                    maturityPayoutFrequency:"-",
                    nsapExtra:"" + 0,
                    annualPremium: $scope.calcData.hospicashRiderCalculation.annualHospiCashPremium,
                    modalPremium: $scope.calcData.hospicashRiderCalculation.modalHospiCashPremium,
                    serviceTax1stYear: $scope.calcData.hospicashRiderCalculation.serviceForAnnualFirstYearTax,
                    serviceTax2ndYear:$scope.calcData.hospicashRiderCalculation.serviceForAnnualFirstYearTax
                  });
                }

                if ($scope.adbRider) {
                  eliteAdvantageIRDAQuotePDFJson.PDF.riderCode.push($scope.calcData.adbRiderCalculation.prodCode);
                  eliteAdvantageIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
                    planName: $filter('filter')(currentData.ridersData, { FkRiderId: adbRiderId.toString()}, true)[0].Label,
                    policyTerm: "" + $scope.outputData.pt,
                    premiumPaymentTerm: "" + $scope.outputData.ppt,
                    premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
                    sumAssured: $scope.outputData.sumAssuredForADBRiders,
                    benefitUptoAge: eliteAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age +  parseInt($scope.outputData.pt),
                    maturityPayoutFrequency:"-",
                    nsapExtra:"" + 0,
                    annualPremium:  $scope.calcData.adbRiderCalculation.abdRiderPremium,
                    modalPremium: $scope.calcData.adbRiderCalculation.modalAdbRiderPremium,
                    serviceTax1stYear:$scope.calcData.adbRiderCalculation.serviceTaxForAnnualFirstYear,
                    serviceTax2ndYear:$scope.calcData.adbRiderCalculation.serviceTaxForAnnualFirstYear

                  });
                }
                if ($scope.pwrRider && $scope.outputData.PWRI) {
                  eliteAdvantageIRDAQuotePDFJson.PDF.riderCode.push($scope.calcData.pwrRiderCalculation.prodCode);
                  eliteAdvantageIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
                    planName: $filter('filter')(currentData.ridersData, { FkRiderId: pwrRiderId.toString()}, true)[0].Label,
                    policyTerm: "" + $scope.outputData.pt,
                    premiumPaymentTerm: "" + $scope.outputData.ppt,
                    premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
                    sumAssured: $scope.outputData.sumAssuredForADBRiders,
                    benefitUptoAge: eliteAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age +  parseInt($scope.outputData.pt),
                    maturityPayoutFrequency:"-",
                    nsapExtra:$scope.calcData.pwrRiderCalculation.extraModalPremiumDueToNSAP,
                    annualPremium: $scope.calcData.pwrRiderCalculation.totalModalRiderWithoutServiceTax,
                    modalPremium: $scope.calcData.pwrRiderCalculation.modalPwrPremium,
                    serviceTax1stYear: $scope.calcData.pwrRiderCalculation.serviceTaxForAnnualFirstYear,
                    serviceTax2ndYear:$scope.calcData.pwrRiderCalculation.serviceTaxForAnnualFirstYear
                  });
                }
                if ($scope.pwrRider && $scope.outputData.PWRII) {
                  eliteAdvantageIRDAQuotePDFJson.PDF.riderCode.push($scope.calcData.pwrRiderCalculation.prodCode);
                  eliteAdvantageIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
                    planName: $filter('filter')(currentData.ridersData, { FkRiderId: pwrRiderId.toString()}, true)[0].Label,
                    policyTerm: "" + $scope.outputData.pt,
                    premiumPaymentTerm: "" + $scope.outputData.ppt,
                    premiumMode: $filter('filter')($scope.formData.PMODE, { id: $scope.inputData.premiumMode.toString()}, true)[0].name,
                    sumAssured: $scope.outputData.sumAssuredForADBRiders,
                    benefitUptoAge: eliteAdvantageIRDAQuotePDFJson.PDF.proposerDetail.age +  parseInt($scope.outputData.pt),
                    maturityPayoutFrequency:"-",
                    nsapExtra:$scope.calcData.pwrRiderCalculation.extraModalPremiumDueToNSAP,
                    annualPremium: $scope.calcData.pwrRiderCalculation.totalModalRiderWithoutServiceTax,
                    modalPremium: $scope.calcData.pwrRiderCalculation.modalPwrPremium,
                    serviceTax1stYear: $scope.calcData.pwrRiderCalculation.serviceTaxForAnnualFirstYear,
                    serviceTax2ndYear:$scope.calcData.pwrRiderCalculation.serviceTaxForAnnualFirstYear
                  });
                }


                $log.debug("benefitIllustration",$scope.calcData.biCalculation);
                eliteAdvantageIRDAQuotePDFJson.PDF.benefitIllustration =$scope.calcData.biCalculation;
                return JSON.stringify(eliteAdvantageIRDAQuotePDFJson);
                //return eliteAdvantageIRDAQuotePDFJson;
              }


    /*** Age calculation from DOB ***/
    $scope.getAge = function(datestring) {
      var c_date = new Date();
      var c_year = c_date.getFullYear();
      var c_month = c_date.getMonth();
      var c_day = c_date.getDate();
      var age = c_year - datestring.getFullYear();

      if (c_month < (datestring.getMonth() - 1)) {
        age--;
      }
      if (((datestring.getMonth() - 1) == c_month) && (c_day < datestring.getDate())) {
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
      $state.go("app.eliteAdvantage-LAAndProposer");
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




    $scope.addRiders = function(){
      if ($scope.riders.isADBActive == true || $scope.riders.isPWRActive == true || $scope.riders.isHCActive == true) {

      }else{
      $scope.data.term                         = 0;
      $scope.data.Dhcb                         = 0;
      $scope.outputData.sumAssuredForADBRiders = $scope.calcData.sumAssured;
      $scope.outputData.pwrRiderOption         = 2;
      $scope.outputData.NSAPForPrposer         = 0;
      $scope.data.pwrRiderOption1              = false;
      $scope.data.pwrRiderOption2              = true;
      $scope.toggleRiders                            = !$scope.toggleRiders;
      }
    }


  }
]);
