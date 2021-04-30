/*
service for premium Calculation here injecting all services
*/
eAppModule.service(
	'samriddhiCalculationEAppService',
	[
	    '$q',
	    '$log',
			'commonDbProductCalculation',
      'samriddhiCalculationSvc',
			'calculateAdbRiderPremiumSvc',
			'calculatehospiCashRiderPremiumSvc',
			'pwrRiderDataFromUserSvc',
			'calculatePwrRiderPremiumSvc',
			'hospiCashRiderDataFromUserSvc',
		    function($q, $log,commonDbProductCalculation,samriddhiCalculationSvc,calculateAdbRiderPremiumSvc,calculatehospiCashRiderPremiumSvc,pwrRiderDataFromUserSvc,calculatePwrRiderPremiumSvc,hospiCashRiderDataFromUserSvc) {

			var vm=this;

			vm.getGender=getGender;
			vm.getPolicyTerm=getPolicyTerm;
			vm.getBUYPOLFOR=getBUYPOLFOR;
			vm.getUPTOAGE=getUPTOAGE;
			vm.getPMODE=getPMODE;
			vm.adbRiderCalculation=adbRiderCalculation;
			vm.HospicashRiderCalculation=HospicashRiderCalculation;
			vm.docalculatePWRPremium=docalculatePWRPremium;
			vm.getCalculations=getCalculations;
			var hospicashId=5;
			var hospiCashRiderId=5,adbRiderId=4, prodId=2, channelId=1,pwrRiderId =6,pwrOption=1;

			function getGender(prodId, channelId) {
					 var q = $q.defer();
					 var gender = commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'GENDER');
					 gender.then(function(val) {
						 q.resolve(val);
					 });
					 return q.promise;
		 }

		 function getPolicyTerm(prodId, channelId) {
		 					 var q = $q.defer();
		 					 var policyTerm  = commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'PPT');
		 					 policyTerm .then(function(val) {
		 						 q.resolve(val);
		 					 });
		 					 return q.promise;
		  }

			function getUPTOAGE(prodId, channelId) {
								var q = $q.defer();
								var policyTerm  = commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'UPTOAGE');
								policyTerm .then(function(val) {
									q.resolve(val);
								});
								return q.promise;
			 }

			 function getPMODE(prodId, channelId) {
								 var q = $q.defer();
								 var policyTerm  = commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'PMODE');
								 policyTerm .then(function(val) {
									 q.resolve(val);
								 });
								 return q.promise;
				}

				function getBUYPOLFOR(prodId, channelId) {
									var q = $q.defer();
									var policyTerm  = commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'BUYPOLFOR');
									policyTerm .then(function(val) {
										q.resolve(val);
									});
									return q.promise;
				 }


  		 	 var adbDataTrueFalse = false;
				 function adbRiderCalculation(adbRiderId, prodId, channelId, data){
					          var q= $q.defer();
				 				    var adbRider= calculateAdbRiderPremiumSvc.calculateABDRiderPremium(adbRiderId, prodId, channelId, data);
										adbRider.then(function(adbData){
															if(adbData.annualAdbRiderPremium == 0){
															 adbDataTrueFalse = false;
															var showDbErrors = true;
															 var dbErrors = "30% Base premium is less than rider";
																}else{
															 adbDataTrueFalse = adbData;
															$log.debug('adbDataTrueFalse',adbDataTrueFalse);
															var adbPremiumOutput = true;
														}
														q.resolve(adbDataTrueFalse);
													});
										return q.promise;
				  }


					var hospicashOutputTrueFalse = false;
					function HospicashRiderCalculation(hospicashId, prodId, channelId, basePremium){
						  var q= $q.defer();

		           var hospiCashData = calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospicashId, prodId, channelId,basePremium);
		           hospiCashData.then( function(hospiCashDataVal) {
				             if(hospiCashDataVal.annualHospiCashPremium == 0){
				             hospicashOutputTrueFalse = false;
				             var hospiCashData = {};
				             var showDbErrors = true;
				             var dbErrors = "30% Base premium is less than rider";
				           }else{
				               var hospiCashData = hospiCashDataVal;
				               hospicashOutputTrueFalse = true;
				           }
									q.resolve(hospiCashData);
		           });
							 return q.promise;
		       }

					 var pwrOutputOption2;
					 var pwrData2;
					 var pwrOutputTrue=false;
					 function docalculatePWRPremium(prodId, channelId, data,option){
						 var q= $q.defer();
						 $log.debug('docalculatePWRPremium',data);
						 var pwrInput = pwrRiderDataFromUserSvc.setPWRRiderData(data);

						 if(parseInt(option) === 1){
							 var pwrData1 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, data, option);
							 pwrData1.then(function(riderVal){
								  	q.resolve(riderVal);
								 if(riderVal.annualPwrPremium == 0){
									 var pwrOutputOption1 = false;
									 var showDbErrors = true;
									 var dbErrors = "30% Base premium is less than rider";
								 }else{
									 var pwrData1 = riderVal;
									 $log.debug('$scope.pwrData1',pwrData1);
									 var pwrOutputOption1 = true;
									 q.resolve(pwrOutputOption1);
							   }
							 });

						 }else if(parseInt(option) === 2){
							 var pwrData2 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, data, option);
							 pwrData2.then(function(riderVal){
								 q.resolve(riderVal);
									 if(riderVal.annualPwrPremium == 0){
										 var pwrOutputOption2 = false;
										 var showDbErrors = true;
										 var dbErrors = "30% Base premium is less than rider";
									 }else{
										 var pwrData2 = riderVal;
										 $log.debug('$scope.pwrData2',pwrData2);
										 var pwrOutputOption2 = true;
								 }
							 });
						 }
						 return q.promise;
					 }

					 function getCalculations(prodId,channelId,data,sumAssured){
						 var q = $q.defer();
											 $q.all([
														samriddhiCalculationSvc.generateSamriddhiBI(prodId, channelId, data, data.basePremium,sumAssured)
														//  adbRiderCalculation(adbRiderId, prodId, channelId, data),
														// 	HospicashRiderCalculation(prodId, channelId, data, data.basePremium),
														// docalculatePWRPremium(prodId, channelId, data,2),
														//samriddhiCalculationSvc.calculatePremium(prodId, channelId, data)
											]).then(function(values) {
														$log.debug("Calculated value For Samruddhi",values);
																 q.resolve(values);
															});
											 return q.promise;
					 }
}]);
