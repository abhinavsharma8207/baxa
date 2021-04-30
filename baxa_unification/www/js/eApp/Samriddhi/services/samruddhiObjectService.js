/*
service for maintaining object for samruddhi
*/
eAppModule.service(
	'samruddhiObjectService',[
	    '$q',
	    '$log',
			'commonDbProductCalculation',
      'samriddhiCalculationSvc',
			'calculateAdbRiderPremiumSvc',
			'calculatehospiCashRiderPremiumSvc',
			'pwrRiderDataFromUserSvc',
			'pwrRiderDataFromUserSvc',
			'calculatePwrRiderPremiumSvc',
		  function($q, $log,
				commonDbProductCalculation,samriddhiCalculationSvc,calculateAdbRiderPremiumSvc,calculatehospiCashRiderPremiumSvc,pwrRiderDataFromUserSvc,pwrRiderDataFromUserSvc,calculatePwrRiderPremiumSvc) {
			 var vm=this;
       vm.getLAandProposerDetails=getLAandProposerDetails;
       vm.setLAandProposerDetails=setLAandProposerDetails;
       vm.getSamruddhiInput = getSamruddhiInput;
       vm.setSamruddhiInput = setSamruddhiInput;
			 vm.getSamruddhiCalculations=getSamruddhiCalculations;
			 vm.setSamruddhiCalculations=setSamruddhiCalculations;
			 vm.resetData = resetData;
       var lAandProposerDetails;
			 var samruddhiInput;
			 var samruddhiCalculations;

       //Set la and proposer details
       function getLAandProposerDetails() {
           return  lAandProposerDetails;
       }

       //Get la and proposer details
       function setLAandProposerDetails(data) {
              lAandProposerDetails=data;
       }

       //Set samruddhi input page values
       function getSamruddhiInput() {
           return  samruddhiInput;
       }
       //Get samruddhi input page values
       function setSamruddhiInput(data) {
              samruddhiInput=data;
       }
			 //Set samruddhi input page values
       function getSamruddhiCalculations() {
           return  samruddhiCalculations;
       }
       //Get samruddhi input page values
       function setSamruddhiCalculations(data) {
              samruddhiCalculations=data;
       }
			 function resetData(){
				 			setLAandProposerDetails([]);
							setSamruddhiInput([]);
							setSamruddhiCalculations([]);
			 }
}]);
