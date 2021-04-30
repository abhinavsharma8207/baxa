eAppModule.controller('futureInvestController', ['$log',
  '$scope',
  '$filter',
  '$state',
  '$http',
  '$rootScope',
  '$ionicHistory',
  '$ionicPlatform',
  '$ionicNavBarDelegate',
  '$ionicLoading',
  '$cordovaDatePicker',
  '$cordovaToast',
  '$cordovaNetwork',
  'eAppServices',
  'fIValidationService',
  'futureInvestObjectService',
  'commonDbProductCalculation',
  'fICalculationService',
  'hospiCashRiderDataFromUserSvc',
  'calculatehospiCashRiderPremiumSvc',
  'getSetCommonDataService',
  'quoteProposalNosDataService',
  'utilityService',
  'sendBIEmailService',
  'fIDataService',
  function($log, $scope, $filter, $state, $http, $rootScope,
    $ionicHistory, $ionicPlatform, $ionicNavBarDelegate, $ionicLoading,
    $cordovaDatePicker, $cordovaToast, $cordovaNetwork,
    eAppServices, fIValidationService, futureInvestObjectService,
    commonDbProductCalculation, fICalculationService,
    hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc,
    getSetCommonDataService, quoteProposalNosDataService, utilityService, sendBIEmailService,fIDataService) {
    'use strict';
    var vm = this;
    var hospiCashRiderId = 5,
      adbRiderId = 4,
      prodId = 11,
      channelId = 1,
      pwrRiderId = 6,
      pwrOption = 1;
    $scope.title = "Future Invest";
    $scope.myData="abc";
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
    $scope.validationMessage = {};
    $scope.premiumWithTaxes = false;
    $scope.showPopupToGoForLAAndProposerDetails = false;
    $scope.isIllustrationsSelected = true;
    $scope.isBrochureSelected = false;
    /*Get validation messgae through json file.*/
    $http.get('js/eApp/futureInvest/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
    });
    /*Get validation messgae through json file.*/
    //** Get Data Variables **//
    //** Get Generic Options for Form Elements **//
    var params = {
      "ui_gender": true,
      "ui_age": true,
      "ui_smoke": false,
      "ui_nsap": true,
      //"ui_termExtra"      : {"label": "Flexi Benifit Period", "default": "20-30"},
      "ui_sumAssured": false,
      "ui_anualPreminum": true,
      "ui_modelPreminum": true,
      "ui_modelPreminumDivide":true,
      "ui_typeFund":true,
      "switch": false,
      "ui_pmode":false,
      "ui_typesOfFund": true
    };

    function getPPTValues(formDataPPT){
      var objPPT=JSON.parse(formDataPPT);
      var arrTemp=[];
      for(var key in objPPT){
        var objTemp={};
        objTemp.id=key;
        objTemp.name=objPPT[key][0];
        arrTemp.push(objTemp);
      }
      return arrTemp;
    }

    $scope.getFunds = function(prodId, channelId) {
        var fund = futureInvestObjectService.getAllFunds(prodId, channelId);
        fund.then(function(val){
          $scope.inputData = [];
            $scope.funds = val;
            $log.debug("Funds",prodId, channelId,val);
            for(var i=0;i < $scope.funds.length; i++){
              if(i==0){
                 $scope.totalFunds = "inputData.allFund" + $scope.funds[i].id + $scope.funds[i].FMC;
               }else{
                $scope.totalFunds = $scope.totalFunds +  "+" +  "inputData.allFund"  + $scope.funds[i].id + $scope.funds[i].FMC;
               }
            }
        });


    };

    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "BUYPOLFOR", "PMODERP","PMODESP", "SA"], ["PPT", "PT", "MPFACTOR"])
      .then(function(result) {

        $scope.params = params;
        $scope.formData = result[0];
        $scope.formData.PPT=getPPTValues(result[1].PPT);
        $scope.formData.PMODE=$scope.formData.PMODESP;

        $scope.formDataCalc = {
          "PT": JSON.parse(result[1].PT),
          "MPFACTOR": JSON.parse(result[1].MPFACTOR)
        };

      //  $scope.formData.PT=result[1].PT;
        $scope.formDataOut = result[2];
        var calcData = eAppServices.getCalcDetails();
        var outputData = eAppServices.getOutputDetails();
        var inputData = eAppServices.getInputDetails();
        var data = eAppServices.getBuyForDetails();
        if (Object.keys(outputData).length > 0) {
          $scope.outputData = outputData;
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
          if (Object.keys(data).length > 0) {
            $scope.data = data;
          }
        } else if (Object.keys(data).length > 0) {
          if (data.length > 0) {
            $scope.data = data;
          }
        } else {

          $state.go('app.futureInvest-LAAndProposer');
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

        $scope.getFunds(prodId, channelId);

      });
    //** Get Data Variables **//

    //** Handle Form Submit for LA Proposer Details Form **//
    $scope.ProceedForLAAndProposerDetails = function(data) {


      $scope.inputData.annualPremium = ($scope.inputData.annualPremium) ? ($scope.inputData.annualPremium) : (1000000);
    //  $scope.inputData.modalPremium = ($scope.inputData.modalPremium) ? ($scope.inputData.modalPremium) : (1000000);
      $scope.inputData.laName = data.liFirstName + " " + data.liLastName;
      $scope.inputData.laAge = $scope.getAge(data.labfAge);
      $scope.inputData.laGender = parseInt(data.laGender);
      $scope.inputData.sumAssuredMinLength = 4;
      $scope.inputData.sumAssuredMaxLength = 10;
      $scope.inputData.sumAssured = ($scope.inputData.sumAssured) ? ($scope.inputData.sumAssured) : (1000000);
      $scope.inputData.isSelf = (data.BuyingFor == 'Self') ? (true) : (false);
      $scope.inputData.smoke = 'nonsmoke';
      $scope.inputData.premiumMode = ($scope.inputData.premiumMode) ? ($scope.inputData.premiumMode) : (1); //default Value to select
      $scope.inputData.pt = ($scope.inputData.pt) ? ($scope.inputData.pt) : (10);
      $scope.inputData.ppt = ($scope.inputData.ppt) ? ($scope.inputData.ppt) :(1);
      if (data.BuyingFor != "Self") {
        $scope.inputData.proposerName = data.propFirstName + " " + data.propLastName;
        $scope.inputData.proposerGender = data.proposerGender;
        $scope.inputData.proposerAge = $scope.getAge(data.proposerAge);
      } else if (data.BuyingFor == "Self") {
        $scope.inputData.proposerName = data.liFirstName + " " + data.liLastName;
        $scope.inputData.proposerGender = data.laGender;
        $scope.inputData.proposerAge = $scope.getAge(data.labfAge);
      }
      $log.debug("FormData",$scope.formData);
      eAppServices.setInputDetails($scope.inputData);
      eAppServices.setBuyForDetails(data);
      $state.go('app.futureInvest-home');
    };
    //** Handle Form Submit for LA Proposer Details Form **//
    $log.debug("inputData.ppt",$scope.inputData.ppt)
    $scope.$watch('inputData.ppt', function() {
      if($scope.inputData.ppt==5){
        $scope.formData.PMODE= $scope.formData.PMODERP;
      }
      else {
        $scope.formData.PMODE= $scope.formData.PMODESP;
      }
    }, true);

    $scope.populateSumAssured = function(basePremium, ppt){
        $log.debug("====",basePremium);
        if(basePremium !== undefined){
            fICalculationService.calcfISumAssured(prodId, channelId, basePremium, ppt)
            .then( function(val) {
                $log.debug("====",val);
                $scope.outputData.sumAssured = val;
            });
        }
    };

    /**/
    $scope.calculate = function(inputData) {
      eAppServices.setOutputDetails(inputData);
      $scope.mySalary="10000";
      $scope.myData="suresh";
      //** Calculation **//
      $scope.outputData.pt = inputData.pt;
      $scope.outputData.ppt = $scope.formData.PPT[0].id;
      $scope.outputData.smoke = inputData.smoke;
      $scope.outputData.NSAPForLA = (inputData.NSAPForLA !== undefined) ? (inputData.NSAPForLA) : (false);
      $scope.outputData.sumAssured = inputData.sumAssured;
      $scope.outputData.premiumMode = inputData.premiumMode;
      $scope.outputData.allFund={1:{0.0135:20},2:{0.0125:20},3:{0.01:20},4:{0.01:20},5:{0.0135:20},6:{0.0135:20}};
      //$scope.outputData.NSAPForPrposer = false;
    //  $scope.outputData.NSAPForLA = false;
      $scope.outputData.basePremium=inputData.annualPremium;
    //  $scope.populateSumAssured(inputData.annualPremium,$scope.outputData.ppt);
      fICalculationService.calcfISumAssured(prodId, channelId, inputData.annualPremium, $scope.outputData.ppt)
      .then( function(val) {

        $scope.outputData.sumAssured = val;
      fIValidationService.validateBaseProduct(prodId, channelId, $scope.outputData,  $scope.outputData.ppt)
        .then(function(messages) {
          $scope.dbError = [];
          if (messages.length === 0 && $scope.outputData.pt > 0 && $scope.outputData.premiumMode > 0) {
            $scope.showDbErrors = false;
            fICalculationService.calculateTotalPremium(prodId, channelId, $scope.outputData)
              .then(function(baseVal) {
                $log.debug("baseVal**********", baseVal);

                var BI = baseVal.BIVal;
                BI.then(function(res) {
                  $scope.calcData.biCalculation=res;

                  console.log("$scope.calcData.biCalculation**********", $scope.calcData.biCalculation);
                  $scope.calcData.maturityAtFour=$scope.calcData.biCalculation.o6fundAtTheEndOfTheYear[$scope.calcData.biCalculation.o6fundAtTheEndOfTheYear.length-1];
                  $scope.calcData.maturityAtEight=$scope.calcData.biCalculation.o10fundAtTheEndOfTheYear[$scope.calcData.biCalculation.o10fundAtTheEndOfTheYear.length-1];
                //  console.log("Fund Value at Maturity at 4%", $scope.calcData.biCalculation);
                //  console.log("Fund Value at Maturity length", $scope.calcData.biCalculation.o10fundAtTheEndOfTheYear[$scope.calcData.biCalculation.o10fundAtTheEndOfTheYear.length-1]);

                  $scope.showOutput = true;
                  $scope.calcData = $scope.outputData;
                  $scope.calcData.base = parseFloat(baseVal.base);
                  $scope.calcData.baseModal = parseFloat(baseVal.baseModal);
                //  $scope.calcData.serviceTax = parseFloat(baseVal.serviceTax);
                  //$scope.calcData.totalWithTax = parseFloat(baseVal.totalWithTax);
                //  $scope.calcData.serviceTaxForAnnualPremFirstYear = parseFloat(baseVal.serviceTaxForAnnualPremFirstYear);
                //  $scope.calcData.totalAnnualPremiumWithTaxForFirstYear = parseFloat(baseVal.totalAnnualPremiumWithTaxForFirstYear);
                  $scope.calcData.totalModalPremium = parseFloat(baseVal.totalModalPremium);
                  $scope.calcData.extraPremiumDueToNSAP = parseFloat(baseVal.extraPremiumDueToNSAP);
                  $scope.calcData.extraModalPremiumDueToNSAP = parseFloat(baseVal.extraModalPremiumDueToNSAP);
                  $scope.calcData.ModalFactor = parseFloat(baseVal.ModalFactor);
                  $scope.calcData.prodCode = baseVal.prodCode;
                  eAppServices.setCalcDetails($scope.calcData);
                  console.log("$scope.calcData",$scope.calcData);
                  $state.go('app.futureInvest-estimated');

                });

              });
          } else {
            $scope.showDbErrors = true;
            $scope.dbErrors = [];
            for (var e = 0; e < messages.length; e++) {
              var key = messages[e].Name;
              $log.debug("ERROR : ", messages);
              $scope.dbErrors.push({
                "Name": key,
                "ErrorMessage": messages[e].ErrorMessage
              });
            }

            if (data.premiumMode === 0) {
              var pm = "PMODE";
              $scope.dbErrors.push({
                "Name": pm,
                "ErrorMessage": $scope.validationMessage.data.PremiumMode
              });
            }
          }
        });
        });
      //** Calculation **/
    };
    /*Animation Code*/
    $scope.animateClass = animateNgClass('bounceInDown', 'animationduration25');

    /**/

    $scope.goToHomePage = function() {
      /*Animation Code*/
      setAnimate($ionicHistory);
      $state.go('app.tripple-home');
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
      $state.go("app.tripplehealth-LAAndProposer");
    };

    $scope.showPopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = true;
    };

    $scope.closePopupPremiumWithTaxes = function() {
      $scope.premiumWithTaxes = false;
    };

    $scope.saveQuote = function() {
      /** parameters sendEmail false and email data null **/
      $scope.createQuoteData(false, null, false);
    };

    $scope.proceedToFormFilling = function() {
      /** parameters sendEmail false and email data null **/
      $scope.createQuoteData(false, null, false);
    };

    $scope.isEmpty = function(obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
          return false;
      }
      return true;
    };

    $scope.createQuoteData = function(isFromEmail, emailData, isOnlineEmailRequired) {
    //  isOnlineEmailRequired=false;
      if (isFromEmail && isOnlineEmailRequired) {
        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner><p>Sending Email..!</p>'
        });
      }

      var userData = getSetCommonDataService.getCommonData();
      var currentData = getSetCommonDataService.getCurrentProdData();
      quoteProposalNosDataService.getBIQuoteNumber(userData.agentId)
        .then(function(biRefNo) {
          var futureInvestQuoteData = {};
          var quoteCustomJson = {
            quoteData: [],
            adbRiderData: [],
            hospiRiderData: [],
            pwRiderIData: [],
            pwRiderIIData: []
          };
          /**1.BI Ref No**/
          futureInvestQuoteData.PkQuotationId = biRefNo.BiQuoteNo;
          /**2 - >  1 = Eapp, 2 = OLS **/
          futureInvestQuoteData.ReferenceSystemTypeId = "1";
          /**3 - > Selected Product ID**/
          futureInvestQuoteData.FkProductId = currentData.prodId;
          /**4 - > Selected Product Plan Code**/
          futureInvestQuoteData.ProductPlanCode = $scope.calcData.prodCode;
          /**5-> Logged in Agent Id**/
          futureInvestQuoteData.FkAgentCode = "" + userData.agentId;
          /**Buying For Screen**/
          /**6 -> Buying For Screen**/
          futureInvestQuoteData.BuyingFor = $scope.data.BuyingFor;
          /**7 -> liFirstName**/
          futureInvestQuoteData.LAFirstName = $scope.data.liFirstName;
          /**8 -> liLastName**/
          futureInvestQuoteData.LALastName = $scope.data.liLastName;
          /**9 -> LAGender**/
          futureInvestQuoteData.LAGender = $scope.data.laGender == 0 ? "Male" : "Female";
          /**10 -> LADOB**/
          futureInvestQuoteData.LADOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          /**11 -> propFirstName**/
          /**12 -> propLastName**/
          /**13 -> proposerGender**/
          /**14 -> ProposerDOB**/
          if (futureInvestQuoteData.BuyingFor != "Self") {
            futureInvestQuoteData.ProposerFirstName = $scope.data.propFirstName;
            futureInvestQuoteData.ProposerLastName = $scope.data.propLastName;
            futureInvestQuoteData.ProposerGender = $scope.data.proposerGender == 0 ? "Male" : "Female";
            futureInvestQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.proposerAge), 'MM/dd/yyyy');
          } else {
            futureInvestQuoteData.ProposerFirstName = $scope.data.liFirstName;
            futureInvestQuoteData.ProposerLastName = $scope.data.liLastName;
            futureInvestQuoteData.ProposerGender = $scope.data.laGender == 0 ? "Male" : "Female";
            futureInvestQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          }
          /**Input/Output Screen**/
          /**15 -> IsSmoker**/
          if ($scope.calcData.smoke != undefined) {
            futureInvestQuoteData.IsSmoker = ($scope.calcData.smoke == "nonsmoke") ? "" + 0 : "" + 1;
          } else {
            futureInvestQuoteData.IsSmoker = "" + 0;
          }
          /**16->benfitUptoAge**/
          if ($scope.calcData.benfitUptoAge != undefined) {
            futureInvestQuoteData.UptoAge = "" + $scope.calcData.benfitUptoAge;
          } else {
            futureInvestQuoteData.UptoAge = null;
          }

          /**17-> PayType - (Limited/Regular) if applicable **/
          futureInvestQuoteData.PayType = null;
          /**18-> BenefitType - (Endowment/Money Back)(Fixed Monthly Payout/Lumpsum + Increasing Payout) if applicable **/
          futureInvestQuoteData.BenefitType = null;
          /**19->PremiumPaymentTerm**/
          futureInvestQuoteData.PremiumPaymentTerm = "" + $scope.calcData.ppt;
          /**20->Policy Term**/
          futureInvestQuoteData.PolicyTerm = "" + $scope.calcData.pt;
          /**21->SumAssured/Life Cover**/
          futureInvestQuoteData.SumAssured = $scope.calcData.sumAssured;
          /**22->GuaranteedIncomePeriod**/
          futureInvestQuoteData.GuaranteedIncomePeriod = null;
          /**23->GuaranteedIncomePeriod**/
          futureInvestQuoteData.MaturityPayoutPeriod = null;
          /**24->MaturityPayoutFrequency**/
          futureInvestQuoteData.MaturityPayoutFrequency = null;
          /**25->FlexiBenefitPeriod**/
          futureInvestQuoteData.FlexiBenefitPeriod = null;
          /**26->AnnualBasePremium**/
          futureInvestQuoteData.AnnualBasePremium = $scope.calcData.base;
          /**27->Mode**/
          futureInvestQuoteData.Mode = "" + $scope.calcData.premiumMode;
          /**28->ModalFactor**/
          futureInvestQuoteData.ModalFactor = $scope.calcData.ModalFactor;
          /**29->ModalPremium**/
          futureInvestQuoteData.ModalPremium = $scope.calcData.baseModal;
          /**30->NSAPForLA**/
          if ($scope.calcData.NSAPForLA != undefined) {
            futureInvestQuoteData.IsNSAP = "" + $scope.calcData.NSAPForLA;
          } else {
            futureInvestQuoteData.IsNSAP = "" + 0;
          }
          /**31->ServiceTax**/
        //  futureInvestQuoteData.ServiceTax = $scope.calcData.serviceTax;
          /**32->PremiumPayable**/
          futureInvestQuoteData.PremiumPayable = $scope.calcData.totalModalPremium ;
          /**33->PremiumPayable**/
          futureInvestQuoteData.IsInYourPresence = null;
          /**34->PremiumPayable**/
          futureInvestQuoteData.EstimatedReturnRate = null;
          // /**35-IsEmail**/
          // /**36-ToRecipients**/
          // /**37-CcRecipients**/
          // futureInvestQuoteData.IsEmail = "" + 0;
          // futureInvestQuoteData.ToRecipients = null;
          // futureInvestQuoteData.CcRecipients = null;
          /**38-> create JSON for IRDA **/
          futureInvestQuoteData.Json = createFutureInvestIRDAQuotePDFJson(biRefNo.BiQuoteNo);
          $log.debug("futureInvestQuoteData.Json...........", futureInvestQuoteData.Json);
          console.log("futureInvestQuoteData.Json...........", futureInvestQuoteData);
          /**custome json creation for quote cpmparison***/
          quoteCustomJson.quoteData.push({
            ReferenceSystemTypeId: futureInvestQuoteData.ReferenceSystemTypeId,
            FkProductId: futureInvestQuoteData.FkProductId,
            ProductPlanCode: futureInvestQuoteData.ProductPlanCode,
            FkAgentCode: futureInvestQuoteData.FkAgentCode,
            BuyingFor: futureInvestQuoteData.BuyingFor,
            LAFirstName: futureInvestQuoteData.LAFirstName,
            LALastName: futureInvestQuoteData.LALastName,
            LAGender: futureInvestQuoteData.LAGender,
            LADOB: futureInvestQuoteData.LADOB,
            ProposerFirstName: futureInvestQuoteData.ProposerFirstName,
            ProposerLastName: futureInvestQuoteData.ProposerLastName,
            ProposerGender: futureInvestQuoteData.ProposerGender,
            ProposerDOB: futureInvestQuoteData.ProposerDOB,
            IsSmoker: futureInvestQuoteData.IsSmoker,
            UptoAge: futureInvestQuoteData.UptoAge,
            PayType: futureInvestQuoteData.PayType,
            BenefitType: futureInvestQuoteData.BenefitType,
            PremiumPaymentTerm: futureInvestQuoteData.PremiumPaymentTerm,
            PolicyTerm: futureInvestQuoteData.PolicyTerm,
            SumAssured: futureInvestQuoteData.SumAssured,
            GuaranteedIncomePeriod: futureInvestQuoteData.GuaranteedIncomePeriod,
            MaturityPayoutPeriod: futureInvestQuoteData.MaturityPayoutPeriod,
            MaturityPayoutFrequency: futureInvestQuoteData.MaturityPayoutFrequency,
            FlexiBenefitPeriod: futureInvestQuoteData.FlexiBenefitPeriod,
            AnnualBasePremium: futureInvestQuoteData.AnnualBasePremium,
            Mode: futureInvestQuoteData.Mode,
            ModalFactor: futureInvestQuoteData.ModalFactor,
            ModalPremium: futureInvestQuoteData.ModalPremium,
            IsNSAP: futureInvestQuoteData.IsNSAP,
          //  ServiceTax: futureInvestQuoteData.ServiceTax,
            PremiumPayable: futureInvestQuoteData.PremiumPayable,
            IsInYourPresence: futureInvestQuoteData.IsInYourPresence,
            EstimatedReturnRate: futureInvestQuoteData.EstimatedReturnRate
          });
          console.log("quoteCustomJson...........", quoteCustomJson);
          //if same quote no need to save the data again - method will check is Quote save required
          quoteProposalNosDataService.isQuoteDataInsertRequired(JSON.stringify(quoteCustomJson)).
          then(function(isRequired) {
            if (isRequired) {
              quoteProposalNosDataService.updateBIQuoteNumberUsedStatus(biRefNo.BiQuoteNo).then(function() {
                quoteProposalNosDataService.insertQuoteData(futureInvestQuoteData);
              });
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  $scope.hidesendEmailPopup();
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, futureInvestQuoteData.Json,futureInvestQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,futureInvestQuoteData.Json,futureInvestQuoteData.FkProductId);
                }
              }
            } else {
              $log.debug("*******Same Quote Data already available*******");
              console.log("*******Same Quote Data already available*******");
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, futureInvestQuoteData.Json,futureInvestQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,futureInvestQuoteData.Json,futureInvestQuoteData.FkProductId);
                }
                $scope.hidesendEmailPopup();
              }
            }
          });
        });
    };

    function createFutureInvestIRDAQuotePDFJson(BiQuoteNo) {
      var userData = getSetCommonDataService.getCommonData();
      var currentData = getSetCommonDataService.getCurrentProdData();

      var selectedRiderData = {};
      var futureInvestIRDAQuotePDFJson = {
        "PDF": {}
      };
      futureInvestIRDAQuotePDFJson.PDF.quoteNo = BiQuoteNo;
      futureInvestIRDAQuotePDFJson.PDF.proposalNo = "";
      futureInvestIRDAQuotePDFJson.PDF.policyNo = "";
      futureInvestIRDAQuotePDFJson.PDF.uin = currentData.prodUIN;
      futureInvestIRDAQuotePDFJson.PDF.productCode = $scope.calcData.prodCode;
      //futureInvestIRDAQuotePDFJson.PDF.riderCode = [];
      futureInvestIRDAQuotePDFJson.PDF.illustrationGeneratedBy = userData.channelName;
      futureInvestIRDAQuotePDFJson.PDF.illustrationDate = utilityService.getDisplayDate(new Date(), 'dd-MM-yyyy');

      futureInvestIRDAQuotePDFJson.PDF.lifeAssuredDetail = {
        name: $scope.data.liFirstName + " " + $scope.data.liLastName,
        gender: $scope.data.laGender == 0 ? "Male" : "Female",
        age: $scope.getAge($scope.data.labfAge),
      };
      futureInvestIRDAQuotePDFJson.PDF.proposerDetail = {};
      if (!$scope.calcData.isSelf) {
        futureInvestIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.propFirstName + " " + $scope.data.propLastName;
        futureInvestIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.proposerGender == 0 ? "Male" : "Female";
        futureInvestIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.proposerAge);
      } else {
        futureInvestIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.liFirstName + " " + $scope.data.liLastName;
        futureInvestIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.laGender == 0 ? "Male" : "Female";
        futureInvestIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.labfAge);
      }
      futureInvestIRDAQuotePDFJson.PDF.benefitAndPremiumDetail = {
        planName: "" + currentData.prodLbl,
        policyTerm: "" + $scope.calcData.pt,
        premiumPaymentTerm: "" + $scope.calcData.ppt,
        premiumMode: $filter('filter')($scope.formData.PMODE, {
          id: $scope.calcData.premiumMode.toString()
        }, true)[0].name,
        sumAssured: $scope.calcData.sumAssured,
        productOption: "WithOut return of Premium",
        maturityBenefit: "No Maturity Benefit Under This Option",
        annualPremium: $scope.calcData.base,
        modalPremium: $scope.calcData.baseModal,
        serviceTax1stYear: $scope.calcData.serviceTax,
        //rider: [],
        totalPremium1stYear: $scope.calcData.totalModalPremiumHospiCashWithTaxForFirstYear,
        healthBenefitPremium: $scope.calcData.totalWithTax,
        lifeBenefitPremium: 0
      };
      return JSON.stringify(futureInvestIRDAQuotePDFJson);
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

    //** Back Button Funtionality **//
    $scope.goBack = function() {
      if ($state.current.name == 'app.trippleHealth-home') {
        $state.go("app.trippleHealth-LAAndProposer");
      } else if ($state.current.name == 'app.trippleHealth-LAAndProposer') {
        $state.go("app.eApp");
      } else if ($state.current.name == 'app.trippleHealth-estimated') {
        $state.go("app.trippleHealth-home");
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
  }
]);
