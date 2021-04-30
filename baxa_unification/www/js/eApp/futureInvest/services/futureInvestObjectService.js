/*
service for maintaining object for samruddhi
*/
eAppModule.service(
  'futureInvestObjectService', [
    '$q',
    '$log',
    'commonDbProductCalculation',
    'fIValidationService',
    'fICalculationService',
    'fIDataService',
    'calculateAdbRiderPremiumSvc',
    'calculatehospiCashRiderPremiumSvc',
    'pwrRiderDataFromUserSvc',
    'calculatePwrRiderPremiumSvc',
    'commonDBFuncSvc',

    function($q, $log, commonDbProductCalculation, fIValidationService, fICalculationService, fIDataService, calculateAdbRiderPremiumSvc, calculatehospiCashRiderPremiumSvc, pwrRiderDataFromUserSvc, calculatePwrRiderPremiumSvc,commonDBFuncSvc) {

      var vm = this;
      var hospiCashRiderId=5,adbRiderId=4, prodId=3, channelId=1,pwrRiderId =6,pwrOption=1;

      vm.getLAandProposerDetails  = getLAandProposerDetails;
      vm.setLAandProposerDetails  = setLAandProposerDetails;
      vm.getInputDetails          = getInputDetails;
      vm.setInputDetails          = setInputDetails;
      vm.getOutputDetails         = getOutputDetails;
      vm.setOutputDetails         = setOutputDetails;
      vm.resetData                = resetData;
      vm.getAllFunds            = getAllFunds;
      var lAandProposerDetails, inputDetails, outputDetails;

      function getAllFunds(prodId, channelId){
		 		var q = $q.defer();
		 		 var funds = commonDBFuncSvc.getAllMapedFunds(prodId, channelId);
				 funds.then(function(val) {
				 	/*$log.debug("Object:::" , JSON.stringify(val));*/
					q.resolve(val);
				 });
		 		return q.promise;
		 	}

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
