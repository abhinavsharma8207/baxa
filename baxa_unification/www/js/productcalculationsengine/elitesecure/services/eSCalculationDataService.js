/*
* Created By: Atul A
* Elte Secure Database Service
*/
productCalculator.service(
	'eSDataFromDBSvc',
	[
		'$q',
    	'$log',
		'commonFormulaSvc',
    	'commonDBFuncSvc',
    	function($q, $log, commonFormulaSvc, commonDBFuncSvc) {
		 	'use strict';
			var esd = this;
			esd.getBasePremiumRate = getBasePremiumRate;
			esd.getProductCode = getProductCode;
			function getBasePremiumRate(prodId, channelId, data) {
		 		var q = $q.defer();
		 		var ageBackFactor = false;
		 		var premiumRate;
		 		var DBName;
		 		if(data.uptoAge > 0){
		 			DBName = (data.laGender == 0)? "PRTA75MALE" : "PRTA75FEMALE";
		 		} else {
		 			if(data.laGender == 1){
		 				ageBackFactor = true;
		 			}
					DBName = 'PRTERM'+parseInt(data.ppt);

		    }

				$log.debug('parseInt(data.ppt)',data.ppt+"===="+data);

				var basePremiumRate = commonDBFuncSvc.getParamValue(prodId, channelId, DBName);
				basePremiumRate.then(function(basePremiumRateVal) {
					var paramValueJson = JSON.parse(basePremiumRateVal);

					if(ageBackFactor){
						if(paramValueJson[data.laAge - 3]){
							premiumRate = paramValueJson[data.laAge - 3];
						} else {
							premiumRate = paramValueJson[18];
						}
					} else {
						premiumRate = paramValueJson[data.laAge];
					}
					$log.debug('lagender',ageBackFactor);
					$log.debug('basePremiumRateVal',premiumRate);
		 			q.resolve(premiumRate);
		 		});
		 		return q.promise;
		 	}

			/*Method for getting the productcode*/
			function getProductCode(prodId, channelId, ppt) {
			  var q = $q.defer();
			  /** mobile web provision **/
			  var reqData;
			  if(!isWeb){
				  reqData = commonDBFuncSvc.getParamValue(prodId, channelId, 'PRODCODE');
			  }else{
				/**Provision for webapp code **/


				/**return values in array in then function**/
			  }

				reqData.then(function(val) {
				  var ParamValueJson = JSON.parse(val);
				  $log.debug('::getProdCode::', ParamValueJson[ppt][0]);
				  var prodCode = ParamValueJson[ppt][0];
				  q.resolve(prodCode);
				});

			  return q.promise;
			}



		}
	]
);
