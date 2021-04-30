/*
service for maintaining object for samruddhi
*/
eAppModule.service(
  'secureIncomeObjectService', [
    '$q',
    '$log',
    'commonDbProductCalculation',
    'sIValidationService',
    'sICalculationService',
    'sIDataService',
    'calculateAdbRiderPremiumSvc',
    'calculatehospiCashRiderPremiumSvc',
    'pwrRiderDataFromUserSvc',
    'calculatePwrRiderPremiumSvc',
    'hospiCashRiderDataFromUserSvc',
    function($q, $log, commonDbProductCalculation, sIValidationService, sICalculationService, sIDataService, calculateAdbRiderPremiumSvc, calculatehospiCashRiderPremiumSvc, pwrRiderDataFromUserSvc, calculatePwrRiderPremiumSvc, hospiCashRiderDataFromUserSvc) {

      var vm = this;
      var hospiCashRiderId=5,adbRiderId=4, prodId=9, channelId=1,pwrRiderId =6,pwrOption=1,hospicashId = 5;
      vm.getLAandProposerDetails  = getLAandProposerDetails;
      vm.setLAandProposerDetails  = setLAandProposerDetails;
      vm.getInputDetails          = getInputDetails;
      vm.setInputDetails          = setInputDetails;
      vm.getOutputDetails         = getOutputDetails;
      vm.setOutputDetails         = setOutputDetails;
      vm.HospicashRiderCalculation = HospicashRiderCalculation;
      vm.pwrRiderCalculation      = pwrRiderCalculation;
      vm.resetScreenData          = resetScreenData;

      var lAandProposerDetails, inputDetails, outputDetails;

      //Set la and proposer details
      function getLAandProposerDetails() {
        return lAandProposerDetails;
      }
      //Get la and proposer details
      function setLAandProposerDetails(data) {
        lAandProposerDetails = data;
      }

      //Set Secure Income input page values
      function getInputDetails() {
        return inputDetails;
      }
      //Get Secure Income input page values
      function setInputDetails(data) {
        inputDetails = data;
      }

      //Set Secure Income input page values
      function getOutputDetails() {
        return outputDetails;
      }
      //Get Secure Income input page values
      function setOutputDetails(data) {
        outputDetails = data;
      }

      function resetScreenData(){
         lAandProposerDetails = null;
         secureIncomeQuoteData = null;
         return true;
      }

      function HospicashRiderCalculation(prodId, channelId, data, basePremium) {
        var q = $q.defer();
        hospiCashRiderDataFromUserSvc.setHospiCashData(data);
        var hospiCashService = calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospicashId, prodId, channelId, basePremium);
        var hospiCashData = {};
        hospiCashService.then(function(hospiCashDataVal) {
          //$log.debug("<<<>>>>",hospiCashDataVal);
          if (hospiCashDataVal.annualHospiCashPremium == 0) {
            hospicashOutputTrueFalse = false;
            $log.debug("<<<>>>>", hospiCashDataVal.annualHospiCashPremium);
            var showDbErrors = true;
            var dbErrors = "30% Base premium is less than rider";

          } else {
            hospiCashData = hospiCashDataVal;
            hospicashOutputTrueFalse = true;
          }
          q.resolve(hospiCashData);
        });
        return q.promise;
      }

      function pwrRiderCalculation(prodId, channelId, data, option) {
        var q = $q.defer();
        var pwrOutputOption2;
        var pwrData2;
        var pwrOutputTrue=false;
        var pwrInput = pwrRiderDataFromUserSvc.setPWRRiderData(data);
        var pwrService = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, data, option);
        var pwrData = {};
        pwrService.then(function(riderVal) {
          //$log.debug("<<<RiderVal>>>>",riderVal);
          if (riderVal.annualPwrPremium == 0) {
            hospicashOutputTrueFalse = false;
            //$log.debug("<<<>>>>", riderVal.annualPwrPremium);
            var pwrOutputOption1 = false;
            var showDbErrors = true;
            var dbErrors = "30% Base premium is less than rider";
          } else {
            var pwrData1 = riderVal;
            $log.debug('$scope.pwrData1',pwrData1);
            var pwrOutputOption1 = true;
            q.resolve(pwrData1);
          }
          //q.resolve(hospiCashData);
        });
        return q.promise;
      }

    }
  ]);
