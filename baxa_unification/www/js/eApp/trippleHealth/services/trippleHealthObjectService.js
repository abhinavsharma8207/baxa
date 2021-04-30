/*
service for maintaining object for samruddhi
*/
eAppModule.service(
  'trippleHealthObjectService', [
    '$q',
    '$log',
    'commonDbProductCalculation',
    'tHValidationService',
    'calculateTrippleHealthPremiumSvc',
    'trippleHealthDataFromUserSvc',
    'calculateAdbRiderPremiumSvc',
    'calculatehospiCashRiderPremiumSvc',
    'pwrRiderDataFromUserSvc',
    'calculatePwrRiderPremiumSvc',
    function($q, $log, commonDbProductCalculation, tHValidationService, calculateTrippleHealthPremiumSvc, trippleHealthDataFromUserSvc, calculateAdbRiderPremiumSvc, calculatehospiCashRiderPremiumSvc, pwrRiderDataFromUserSvc, calculatePwrRiderPremiumSvc) {

      var vm = this;
      var hospiCashRiderId=5,adbRiderId=4, prodId=3, channelId=1,pwrRiderId =6,pwrOption=1;

      vm.getLAandProposerDetails  = getLAandProposerDetails;
      vm.setLAandProposerDetails  = setLAandProposerDetails;
      vm.getInputDetails          = getInputDetails;
      vm.setInputDetails          = setInputDetails;
      vm.getOutputDetails         = getOutputDetails;
      vm.setOutputDetails         = setOutputDetails;
      vm.resetData                = resetData;

      var lAandProposerDetails, inputDetails, outputDetails;

      //Set la and proposer details
      function getLAandProposerDetails() {
        return lAandProposerDetails;
      }
      //Get la and proposer details
      function setLAandProposerDetails(data) {
        lAandProposerDetails = data;
      }

      //Set samruddhi input page values
      function getInputDetails() {
        return inputDetails;
      }
      //Get samruddhi input page values
      function setInputDetails(data) {
        inputDetails = data;
      }

      //Set samruddhi input page values
      function getOutputDetails() {
        return outputDetails;
      }
      //Get samruddhi input page values
      function setOutputDetails(data) {
        outputDetails = data;
      }
      function resetData(){
         setLAandProposerDetails([]);
         setQuoteInput([]);
         setQuoteOutput([]);
      }
    }
  ]);
