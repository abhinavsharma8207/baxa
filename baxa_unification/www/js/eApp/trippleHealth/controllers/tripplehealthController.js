eAppModule.controller('tripplehealthController', ['$log',
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
  'tHValidationService',
  'trippleHealthObjectService',
  'commonDbProductCalculation',
  'calculateTrippleHealthPremiumSvc',
  'hospiCashRiderDataFromUserSvc',
  'calculatehospiCashRiderPremiumSvc',
  'getSetCommonDataService',
  'quoteProposalNosDataService',
  'utilityService',
  'sendBIEmailService',
  function($log, $scope, $filter, $state, $http, $rootScope,
    $ionicHistory, $ionicPlatform, $ionicNavBarDelegate, $ionicLoading,
    $cordovaDatePicker, $cordovaToast, $cordovaNetwork,
    eAppServices, tHValidationService, trippleHealthObjectService,
    commonDbProductCalculation, calculateTrippleHealthPremiumSvc,
    hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc,
    getSetCommonDataService, quoteProposalNosDataService, utilityService, sendBIEmailService) {
    'use strict';
    var vm = this;
    var hospiCashRiderId = 5,
      adbRiderId = 4,
      prodId = 3,
      channelId = 1,
      pwrRiderId = 6,
      pwrOption = 1;
    $scope.title = "Triple Health";
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
    $http.get('js/eApp/trippleHealth/validationMessage.json').then(function(responce) {
      $scope.validationMessage = responce;
    });
    /*Get validation messgae through json file.*/
    //** Get Data Variables **//
    //** Get Generic Options for Form Elements **//
    var params = {
      "ui_gender": true,
      "ui_age": true,
      "ui_smoke": true,
      "ui_nsap": false,
      //"ui_termExtra"      : {"label": "Flexi Benifit Period", "default": "20-30"},
      "ui_sumAssured": true,
      "ui_anualPreminum": false,
      "ui_modelPreminum": false,
      "switch": false
    };
    var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "BUYPOLFOR", "PMODE", "PPT", "PT", "SA"], [])
      .then(function(result) {
        $scope.params = params;
        $scope.formData = result[0];
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
          $state.go('app.tripplehealth-LAAndProposer');
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
      $scope.inputData.sumAssuredMinLength = 4;
      $scope.inputData.sumAssuredMaxLength = 10;
      $scope.inputData.sumAssured = ($scope.inputData.sumAssured) ? ($scope.inputData.sumAssured) : (1000000);
      $scope.inputData.isSelf = (data.BuyingFor == 'Self') ? (true) : (false);
      $scope.inputData.smoke = 'nonsmoke';
      $scope.inputData.premiumMode = ($scope.inputData.premiumMode) ? ($scope.inputData.premiumMode) : (1); //default Value to select
      $scope.inputData.pt = ($scope.inputData.pt) ? ($scope.inputData.pt) : (15);

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
      $state.go('app.tripple-home');
    };
    //** Handle Form Submit for LA Proposer Details Form **//

    $scope.calculateHCRiderPremium = function(calcData) {
      $scope.calcData.sumAssuredForRiders = calcData.hospiCashDHCB;
      $scope.calcData.riderPremium = calcData.hospiCashDHCB;
      $scope.calcData.riderPpt = calcData.hospiCashTerm;
      $scope.calcData.ppt = calcData.hospiCashTerm;
      $scope.calcData.hospiCash = true;

      if (calcData.hospiCashDHCB > 0 && calcData.hospiCashTerm > 0) {
        var hospiInput = hospiCashRiderDataFromUserSvc.setHospiCashData($scope.calcData);
        tHValidationService.validateRiderHCProduct(prodId, channelId, $scope.calcData).then(function(messages) {
          $scope.showDbErrors = false;
          $scope.dbErrors = [];
          if (messages.length === 0) {
            calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospiCashRiderId, prodId, channelId, calcData.base)
              .then(function(result) {
                if (result.annualHospiCashPremium === 0) {
                  $scope.showDbErrors = true;
                  $scope.riderHospi = false;
                  $scope.dbErrors.push({
                    "Name": "HC",
                    "ErrorMessage": "30% Base premium is less than rider"
                  });
                  $scope.calcData.riderPremium = "";
                } else {
                  $scope.hospiCashData = result;
                  $scope.showDbErrors = false;
                  $scope.riderHospi = true;
                  $log.debug("result**********", result);
                  $scope.calcData.premium = result;

                  $scope.calcData.benfitUptoAgeHC = parseFloat(result.benfitUptoAge);
                  $scope.calcData.modalHospiCashPremium = parseFloat(result.modalHospiCashPremium);
                  $scope.calcData.annualHospiCashPremium = parseFloat(result.annualHospiCashPremium);
                  $scope.calcData.percentOfBasePremiumHC = parseFloat(result.percentOfBasePremium);
                  $scope.calcData.serviceTaxHospiCashForModalFirstYear = parseFloat(result.serviceTaxForModalFirstYear);
                  $scope.calcData.serviceTaxHospiCashForAnnualFirstYear = parseFloat(result.serviceTaxForAnnualFirstYear);
                  $scope.calcData.totalModalPremiumHospiCashWithTaxForFirstYear = parseFloat(result.totalModalPremiumWithTaxForFirstYear);
                  $scope.calcData.totalAnnualPremiumHospiCashWithTaxForFirstYear = parseFloat(result.totalAnnualPremiumWithTaxForFirstYear);
                  $scope.calcData.riderProdCode = result.prodCode;
                }
              });
          } else {
            $scope.showDbErrors = true;
            $scope.riderHospi = false;
            for (var e = 0; e < messages.length; e++) {
              $scope.dbErrors.push(messages[e][0]);
            }
            $scope.calcData.riderPremium = "";
          }
        });
      } else {
        $scope.calcData.riderPremium = "";
      }
    };

    /**/
    $scope.calculate = function(inputData) {
      eAppServices.setOutputDetails(inputData);
      //** Calculation **//
      $scope.outputData.pt = inputData.pt;
      $scope.outputData.ppt = $scope.formData.PPT[0].name;
      $scope.outputData.smoke = inputData.smoke;
      $scope.outputData.NSAPForLA = (inputData.NSAPForLA !== undefined) ? (inputData.NSAPForLA) : (false);
      $scope.outputData.sumAssured = inputData.sumAssured;
      $scope.outputData.premiumMode = inputData.premiumMode;
      $scope.outputData.NSAPForPrposer = false;
      $scope.outputData.NSAPForLA = false;
      tHValidationService.validateProduct(prodId, channelId, $scope.outputData)
        .then(function(messages) {
          $scope.dbError = [];
          if (messages.length === 0 && $scope.outputData.pt > 0 && $scope.outputData.premiumMode > 0) {
            $scope.showDbErrors = false;
            calculateTrippleHealthPremiumSvc.calculateTotalPremium(prodId, channelId, $scope.outputData)
              .then(function(baseVal) {
                $log.debug("outputData**********", baseVal);
                $scope.showOutput = true;
                $scope.calcData = $scope.outputData;
                $scope.calcData.base = parseFloat(baseVal.base);
                $scope.calcData.baseModal = parseFloat(baseVal.baseModal);
                $scope.calcData.serviceTax = parseFloat(baseVal.serviceTax);
                $scope.calcData.totalWithTax = parseFloat(baseVal.totalWithTax);
                $scope.calcData.serviceTaxForAnnualPremFirstYear = parseFloat(baseVal.serviceTaxForAnnualPremFirstYear);
                $scope.calcData.totalAnnualPremiumWithTaxForFirstYear = parseFloat(baseVal.totalAnnualPremiumWithTaxForFirstYear);
                $scope.calcData.totalModalPremium = parseFloat(baseVal.totalModalPremium);
                $scope.calcData.extraPremiumDueToNSAP = parseFloat(baseVal.extraPremiumDueToNSAP);
                $scope.calcData.extraModalPremiumDueToNSAP = parseFloat(baseVal.extraModalPremiumDueToNSAP);
                $scope.calcData.ModalFactor = parseFloat(baseVal.ModalFactor);
                $scope.calcData.prodCode = baseVal.prodCode;
                eAppServices.setCalcDetails($scope.calcData);

                $state.go('app.tripplehealth-estimated');
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
            if (data.riderPpt === 0) {
              var pt = "PT";
              $scope.dbErrors.push({
                "Name": pt,
                "ErrorMessage": $scope.validationMessage.data.PolicyTerms
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
      //** Calculation **//
    };
    /*Animation Code*/
    $scope.animateClass = animateNgClass('bounceInDown', 'animationduration25');

    /**/

    $scope.updateRiderSA = function(data) {
      $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
    };
    $scope.getHCRTerm = function(ppt, term) {
      return Number(ppt) >= Number(term);
    };

    $scope.goToHomePage = function() {
      /*Animation Code*/
      setAnimate($ionicHistory);
      $state.go('app.tripple-home');
    };

    $scope.riderHospiCashReset = function(calcData) {
      if ($scope.riderHospi) {
        $scope.riderHospi = false;
        $scope.calcData.riderPremium = 0;
        $scope.calcData.annualHospiCashPremium = 0;
        $scope.calcData.benfitUptoAge = 0;
        $scope.calcData.modalHospiCashPremium = 0;
        $scope.calcData.modalHospiRiderWithServiceTax = 0;
        $scope.calcData.percentOfBasePremium = 0;
        $scope.calcData.totalPremium = 0;
      }
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
          var trippleHealthQuoteData = {};
          var trippleHealthRidersData = [
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
          trippleHealthQuoteData.PkQuotationId = biRefNo.BiQuoteNo;
          /**2 - >  1 = Eapp, 2 = OLS **/
          trippleHealthQuoteData.ReferenceSystemTypeId = "1";
          /**3 - > Selected Product ID**/
          trippleHealthQuoteData.FkProductId = currentData.prodId;
          /**4 - > Selected Product Plan Code**/
          trippleHealthQuoteData.ProductPlanCode = $scope.calcData.prodCode;
          /**5-> Logged in Agent Id**/
          trippleHealthQuoteData.FkAgentCode = "" + userData.agentId;
          /**Buying For Screen**/
          /**6 -> Buying For Screen**/
          trippleHealthQuoteData.BuyingFor = $scope.data.BuyingFor;
          /**7 -> liFirstName**/
          trippleHealthQuoteData.LAFirstName = $scope.data.liFirstName;
          /**8 -> liLastName**/
          trippleHealthQuoteData.LALastName = $scope.data.liLastName;
          /**9 -> LAGender**/
          trippleHealthQuoteData.LAGender = $scope.data.laGender == 0 ? "Male" : "Female";
          /**10 -> LADOB**/
          trippleHealthQuoteData.LADOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          /**11 -> propFirstName**/
          /**12 -> propLastName**/
          /**13 -> proposerGender**/
          /**14 -> ProposerDOB**/
          if (trippleHealthQuoteData.BuyingFor != "Self") {
            trippleHealthQuoteData.ProposerFirstName = $scope.data.propFirstName;
            trippleHealthQuoteData.ProposerLastName = $scope.data.propLastName;
            trippleHealthQuoteData.ProposerGender = $scope.data.proposerGender == 0 ? "Male" : "Female";
            trippleHealthQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.proposerAge), 'MM/dd/yyyy');
          } else {
            trippleHealthQuoteData.ProposerFirstName = $scope.data.liFirstName;
            trippleHealthQuoteData.ProposerLastName = $scope.data.liLastName;
            trippleHealthQuoteData.ProposerGender = $scope.data.laGender == 0 ? "Male" : "Female";
            trippleHealthQuoteData.ProposerDOB = utilityService.getDisplayDate(new Date($scope.data.labfAge), 'MM/dd/yyyy');
          }
          /**Input/Output Screen**/
          /**15 -> IsSmoker**/
          if ($scope.calcData.smoke != undefined) {
            trippleHealthQuoteData.IsSmoker = ($scope.calcData.smoke == "nonsmoke") ? "" + 0 : "" + 1;
          } else {
            trippleHealthQuoteData.IsSmoker = "" + 0;
          }
          /**16->benfitUptoAge**/
          if ($scope.calcData.benfitUptoAge != undefined) {
            trippleHealthQuoteData.UptoAge = "" + $scope.calcData.benfitUptoAge;
          } else {
            trippleHealthQuoteData.UptoAge = null;
          }

          /**17-> PayType - (Limited/Regular) if applicable **/
          trippleHealthQuoteData.PayType = null;
          /**18-> BenefitType - (Endowment/Money Back)(Fixed Monthly Payout/Lumpsum + Increasing Payout) if applicable **/
          trippleHealthQuoteData.BenefitType = null;
          /**19->PremiumPaymentTerm**/
          trippleHealthQuoteData.PremiumPaymentTerm = "" + $scope.calcData.ppt;
          /**20->Policy Term**/
          trippleHealthQuoteData.PolicyTerm = "" + $scope.calcData.pt;
          /**21->SumAssured/Life Cover**/
          trippleHealthQuoteData.SumAssured = $scope.calcData.sumAssured;
          /**22->GuaranteedIncomePeriod**/
          trippleHealthQuoteData.GuaranteedIncomePeriod = null;
          /**23->GuaranteedIncomePeriod**/
          trippleHealthQuoteData.MaturityPayoutPeriod = null;
          /**24->MaturityPayoutFrequency**/
          trippleHealthQuoteData.MaturityPayoutFrequency = null;
          /**25->FlexiBenefitPeriod**/
          trippleHealthQuoteData.FlexiBenefitPeriod = null;
          /**26->AnnualBasePremium**/
          trippleHealthQuoteData.AnnualBasePremium = $scope.calcData.base;
          /**27->Mode**/
          trippleHealthQuoteData.Mode = "" + $scope.calcData.premiumMode;
          /**28->ModalFactor**/
          trippleHealthQuoteData.ModalFactor = $scope.calcData.ModalFactor;
          /**29->ModalPremium**/
          trippleHealthQuoteData.ModalPremium = $scope.calcData.baseModal;
          /**30->NSAPForLA**/
          if ($scope.calcData.NSAPForLA != undefined) {
            trippleHealthQuoteData.IsNSAP = "" + $scope.calcData.NSAPForLA;
          } else {
            trippleHealthQuoteData.IsNSAP = "" + 0;
          }
          /**31->ServiceTax**/
          trippleHealthQuoteData.ServiceTax = $scope.calcData.serviceTax;
          /**32->PremiumPayable**/
          trippleHealthQuoteData.PremiumPayable = $scope.calcData.totalWithTax;
          /**33->PremiumPayable**/
          trippleHealthQuoteData.IsInYourPresence = null;
          /**34->PremiumPayable**/
          trippleHealthQuoteData.EstimatedReturnRate = null;
          // /**35-IsEmail**/
          // /**36-ToRecipients**/
          // /**37-CcRecipients**/
          // trippleHealthQuoteData.IsEmail = "" + 0;
          // trippleHealthQuoteData.ToRecipients = null;
          // trippleHealthQuoteData.CcRecipients = null;
          /**38-> create JSON for IRDA **/
          trippleHealthQuoteData.Json = createTrippleHealthIRDAQuotePDFJson(biRefNo.BiQuoteNo);
          $log.debug("trippleHealthQuoteData.Json...........", trippleHealthQuoteData.Json);
          /**custome json creation for quote cpmparison***/
          quoteCustomJson.quoteData.push({
            ReferenceSystemTypeId: trippleHealthQuoteData.ReferenceSystemTypeId,
            FkProductId: trippleHealthQuoteData.FkProductId,
            ProductPlanCode: trippleHealthQuoteData.ProductPlanCode,
            FkAgentCode: trippleHealthQuoteData.FkAgentCode,
            BuyingFor: trippleHealthQuoteData.BuyingFor,
            LAFirstName: trippleHealthQuoteData.LAFirstName,
            LALastName: trippleHealthQuoteData.LALastName,
            LAGender: trippleHealthQuoteData.LAGender,
            LADOB: trippleHealthQuoteData.LADOB,
            ProposerFirstName: trippleHealthQuoteData.ProposerFirstName,
            ProposerLastName: trippleHealthQuoteData.ProposerLastName,
            ProposerGender: trippleHealthQuoteData.ProposerGender,
            ProposerDOB: trippleHealthQuoteData.ProposerDOB,
            IsSmoker: trippleHealthQuoteData.IsSmoker,
            UptoAge: trippleHealthQuoteData.UptoAge,
            PayType: trippleHealthQuoteData.PayType,
            BenefitType: trippleHealthQuoteData.BenefitType,
            PremiumPaymentTerm: trippleHealthQuoteData.PremiumPaymentTerm,
            PolicyTerm: trippleHealthQuoteData.PolicyTerm,
            SumAssured: trippleHealthQuoteData.SumAssured,
            GuaranteedIncomePeriod: trippleHealthQuoteData.GuaranteedIncomePeriod,
            MaturityPayoutPeriod: trippleHealthQuoteData.MaturityPayoutPeriod,
            MaturityPayoutFrequency: trippleHealthQuoteData.MaturityPayoutFrequency,
            FlexiBenefitPeriod: trippleHealthQuoteData.FlexiBenefitPeriod,
            AnnualBasePremium: trippleHealthQuoteData.AnnualBasePremium,
            Mode: trippleHealthQuoteData.Mode,
            ModalFactor: trippleHealthQuoteData.ModalFactor,
            ModalPremium: trippleHealthQuoteData.ModalPremium,
            IsNSAP: trippleHealthQuoteData.IsNSAP,
            ServiceTax: trippleHealthQuoteData.ServiceTax,
            PremiumPayable: trippleHealthQuoteData.PremiumPayable,
            IsInYourPresence: trippleHealthQuoteData.IsInYourPresence,
            EstimatedReturnRate: trippleHealthQuoteData.EstimatedReturnRate
          });

          //selected rider ids needs to push in  selectedRiderIds arrays
          var selectedRiderIds = [];
          if ($scope.riderHospi) {
            //if selected rider id is hospicash - push into selectedRiderId
            selectedRiderIds.push(hospiCashRiderId);
            //added hospi cash rider data in custom code json
            quoteCustomJson.hospiRiderData.push({
              FkAgentCode: "" + userData.agentId,
              FkRiderId: "" + hospiCashRiderId,
              RiderPlanCode: $scope.calcData.riderProdCode,
              ReferenceSystemTypeId: "1",
              Term: "" + $scope.calcData.hospiCashTerm,
              SumAssured: $scope.calcData.sumAssuredForRiders,
              IsNSAPProposer: "" + 0,
              ModalPremium: $scope.calcData.riderPremium,
              ServiceTaxPayable: $scope.calcData.modalHospiRiderWithServiceTax,
              PremiumPayable: $scope.calcData.totalPremium
            });
          }
          /**if user selected any rider riders data needs to save in DB**/
          if (selectedRiderIds.length > 0) {
            trippleHealthRidersData = [
              []
            ];
            trippleHealthRidersData = $scope.createRidersData(userData, currentData, biRefNo.BiQuoteNo, selectedRiderIds);
          }
          //if same quote no need to save the data again - method will check is Quote save required
          quoteProposalNosDataService.isQuoteDataInsertRequired(JSON.stringify(quoteCustomJson)).
          then(function(isRequired) {
            if (isRequired) {
              quoteProposalNosDataService.updateBIQuoteNumberUsedStatus(biRefNo.BiQuoteNo).then(function() {
                quoteProposalNosDataService.insertQuoteData(trippleHealthQuoteData);
                if ($scope.riderHospi) {
                  quoteProposalNosDataService.insertRidersData(trippleHealthRidersData);
                }
              });
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  $scope.hidesendEmailPopup();
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, trippleHealthQuoteData.Json,trippleHealthQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,trippleHealthQuoteData.Json,trippleHealthQuoteData.FkProductId);
                }
              }
            } else {
              $log.debug("*******Same Quote Data already available*******");
              if (isFromEmail) {
                if (isOnlineEmailRequired) {
                  quoteProposalNosDataService.sendQuoteEmailData(biRefNo.BiQuoteNo, emailData, trippleHealthQuoteData.Json,trippleHealthQuoteData.FkProductId);
                } else {
                  quoteProposalNosDataService.saveQuoteEmailData(biRefNo.BiQuoteNo, emailData,trippleHealthQuoteData.Json,trippleHealthQuoteData.FkProductId);
                }
                $scope.hidesendEmailPopup();
              }
            }
          });
        });
    };

    function createTrippleHealthIRDAQuotePDFJson(BiQuoteNo) {
      var userData = getSetCommonDataService.getCommonData();
      var currentData = getSetCommonDataService.getCurrentProdData();

      var selectedRiderData = {};
      var trippleHealthIRDAQuotePDFJson = {
        "PDF": {}
      };
      trippleHealthIRDAQuotePDFJson.PDF.quoteNo = BiQuoteNo;
      trippleHealthIRDAQuotePDFJson.PDF.proposalNo = "";
      trippleHealthIRDAQuotePDFJson.PDF.policyNo = "";
      trippleHealthIRDAQuotePDFJson.PDF.uin = currentData.prodUIN;
      trippleHealthIRDAQuotePDFJson.PDF.productCode = $scope.calcData.prodCode;
      trippleHealthIRDAQuotePDFJson.PDF.riderCode = [];
      trippleHealthIRDAQuotePDFJson.PDF.illustrationGeneratedBy = userData.channelName;
      trippleHealthIRDAQuotePDFJson.PDF.illustrationDate = utilityService.getDisplayDate(new Date(), 'dd-MM-yyyy');

      trippleHealthIRDAQuotePDFJson.PDF.lifeAssuredDetail = {
        name: $scope.data.liFirstName + " " + $scope.data.liLastName,
        gender: $scope.data.laGender == 0 ? "Male" : "Female",
        age: $scope.getAge($scope.data.labfAge),
      };
      trippleHealthIRDAQuotePDFJson.PDF.proposerDetail = {};
      if (!$scope.calcData.isSelf) {
        trippleHealthIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.propFirstName + " " + $scope.data.propLastName;
        trippleHealthIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.proposerGender == 0 ? "Male" : "Female";
        trippleHealthIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.proposerAge);
      } else {
        trippleHealthIRDAQuotePDFJson.PDF.proposerDetail.name = $scope.data.liFirstName + " " + $scope.data.liLastName;
        trippleHealthIRDAQuotePDFJson.PDF.proposerDetail.gender = $scope.data.laGender == 0 ? "Male" : "Female";
        trippleHealthIRDAQuotePDFJson.PDF.proposerDetail.age = $scope.getAge($scope.data.labfAge);
      }
      trippleHealthIRDAQuotePDFJson.PDF.benefitAndPremiumDetail = {
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
        rider: [],
        totalPremium1stYear: $scope.calcData.totalModalPremiumHospiCashWithTaxForFirstYear,
        healthBenefitPremium: $scope.calcData.totalWithTax,
        lifeBenefitPremium: 0
      };
      if ($scope.riderHospi) {
        $log.debug("selectedRiderData", selectedRiderData);
        trippleHealthIRDAQuotePDFJson.PDF.riderCode.push($scope.calcData.riderProdCode);
        trippleHealthIRDAQuotePDFJson.PDF.benefitAndPremiumDetail.rider.push({
          planName: $filter('filter')(currentData.ridersData, {
            FkRiderId: hospiCashRiderId.toString()
          }, true)[0].Label,
          policyTerm: $scope.calcData.pt,
          premiumPaymentTerm: $scope.calcData.riderPpt,
          premiumMode: $scope.calcData.premiumMode,
          sumAssured: $scope.calcData.premium.sumAssured,
          productOption: "-",
          maturityBenefit: "-",
          annualPremium: $scope.calcData.premium.annualHospiCashPremium,
          modalPremium: $scope.calcData.premium.modalHospiCashPremium,
          serviceTax1stYear: $scope.calcData.premium.serviceForAnnualFirstYearTax
        });
      }
      return JSON.stringify(trippleHealthIRDAQuotePDFJson);
    }

    $scope.createRidersData = function(userData, currentData, biQuoteNo, selectedRiderIds) {
      var trippleHealthRidersData = [
        []
      ];
      for (var i = 0; i < selectedRiderIds.length; i++) {
        if (selectedRiderIds[i] == hospiCashRiderId) {
          //user selected Hospicash Rider
          trippleHealthRidersData[i].FkAgentCode = "" + userData.agentId;
          trippleHealthRidersData[i].FkQuotationId = biQuoteNo;
          trippleHealthRidersData[i].FkRiderId = "" + selectedRiderIds[i];
          trippleHealthRidersData[i].RiderPlanCode = $scope.calcData.riderProdCode;
          /** 1 = Eapp, 2 = OLS **/
          trippleHealthRidersData[i].ReferenceSystemTypeId = "1";
          trippleHealthRidersData[i].Term = "" + $scope.calcData.hospiCashTerm;
          trippleHealthRidersData[i].SumAssured = $scope.calcData.sumAssuredForRiders;
          trippleHealthRidersData[i].IsNSAPProposer = "" + 0;
          trippleHealthRidersData[i].ModalPremium = $scope.calcData.modalHospiCashPremium;
          trippleHealthRidersData[i].ServiceTaxPayable = $scope.calcData.serviceTaxHospiCashForModalFirstYear;
          trippleHealthRidersData[i].PremiumPayable = $scope.calcData.totalModalPremiumHospiCashWithTaxForFirstYear;
        }
      }
      return trippleHealthRidersData;
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
