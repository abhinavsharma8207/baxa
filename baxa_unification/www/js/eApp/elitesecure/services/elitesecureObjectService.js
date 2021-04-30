/*
service for maintaining object for eliteSecure
*/
eAppModule.service(
  'elitesecureObjectService', [
    '$q',
    '$log',
    'commonDbProductCalculation',
    'eSCalculationService',
    'calculateAdbRiderPremiumSvc',
    'calculatehospiCashRiderPremiumSvc',
    'pwrRiderDataFromUserSvc',
    'pwrRiderDataFromUserSvc',
    'calculatePwrRiderPremiumSvc',
    'hospiCashRiderDataFromUserSvc',
    function($q, $log, commonDbProductCalculation, eSCalculationService, calculateAdbRiderPremiumSvc, calculatehospiCashRiderPremiumSvc, pwrRiderDataFromUserSvc, pwrRiderDataFromUserSvc, calculatePwrRiderPremiumSvc, hospiCashRiderDataFromUserSvc) {

      var vm = this;
      vm.getLAandProposerDetails = getLAandProposerDetails;
      vm.getLAandProposerDetails = getLAandProposerDetails;
      vm.setLAandProposerDetails = setLAandProposerDetails;
      vm.getEliteData = getEliteData;
      vm.setEliteData = setEliteData;
      vm.adbRiderCalculation = adbRiderCalculation;
      vm.HospicashRiderCalculation = HospicashRiderCalculation;
      vm.resetScreenData = resetScreenData;
      var lAandProposerDetails;
      var eliteQuoteData;
      var hospicashId = 5;
      var hospiCashRiderId = 5,
        adbRiderId = 4,
        prodId = 2,
        channelId = 1;
      //Set la and proposer details
      function getLAandProposerDetails(data) {
        return lAandProposerDetails;
      }
      //Get la and proposer details
      function setLAandProposerDetails(data) {
        lAandProposerDetails = data;
      }

      //Set eliteSecure input page values
      function getEliteData(data) {
        return eliteQuoteData;
      }
      //Get eliteSecure input page values
      function setEliteData(data) {
        eliteQuoteData = data;
      }

      function resetScreenData(){
         lAandProposerDetails = null;
         eliteQuoteData = null;
         return true;
      }


      function adbRiderCalculation(adbRiderId, prodId, channelId, data) {
        var q = $q.defer();
        var adbRider = calculateAdbRiderPremiumSvc.calculateABDRiderPremium(adbRiderId, prodId, channelId, data);
        adbRider.then(function(adbData) {
          if (adbData.annualAdbRiderPremium == 0) {
            adbDataTrueFalse = false;
            var showDbErrors = true;
            var dbErrors = "30% Base premium is less than rider";
          } else {
            adbDataTrueFalse = adbData;
            $log.debug('adbDataTrueFalse', adbDataTrueFalse);
            var adbPremiumOutput = true;
          }
          q.resolve(adbDataTrueFalse);
        });
        return q.promise;
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


    }
  ]);
