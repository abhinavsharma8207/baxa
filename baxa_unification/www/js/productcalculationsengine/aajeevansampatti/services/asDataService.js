/**
	*	DB service which will fetch data from local storage
	*/
productCalculator.service('policyDataFromDBSvc',
	[
		'$q',
		'$log',
		'commonDBFuncSvc',
		'commonDbProductCalculation',
		function($q, $log, commonDBFuncSvc, commonDbProductCalculation) {
			'use strict';
			var policyDataFromDBSvcObj = this;


			/**
			* Following are standard values
			*/
			// policyDataFromDBSvcObj.factorForDeathBenfitThirdRule = 11;
      // 		policyDataFromDBSvcObj.factorForDeathBenfitFirstRule = 1.05;
      // 		policyDataFromDBSvcObj.noCashBonusForYear = 5;
			// policyDataFromDBSvcObj.surrenderStandardValue = 30;
			/*EOF Constants*/

	   		policyDataFromDBSvcObj.getfactorForCalculatingGuranteedPayouts = getfactorForCalculatingGuranteedPayouts;
			policyDataFromDBSvcObj.getpremiumRate = getpremiumRate;
			policyDataFromDBSvcObj.getfactorBasisSA =  getfactorBasisSA;
			policyDataFromDBSvcObj.getSVFactorForNonGuranteed = getSVFactorForNonGuranteed;
			policyDataFromDBSvcObj.getDataFromGSV = getDataFromGSV;
			policyDataFromDBSvcObj.getannualBonus = getannualBonus;
			policyDataFromDBSvcObj.getProdCodeAS = getProdCodeAS;


			function getpremiumRate(prodId, channelId, data){
				var dbName = "BASEPR"+data.ppt;
				var paramName;
				$log.debug('dbName',dbName);
				var q = $q.defer();
				commonDBFuncSvc.getParamValueName(prodId, channelId, dbName)
		          .then(function(val) {

					var paramValueJson = JSON.parse(val.ParamValue);
					var paramNameJson = JSON.parse(val.ParamColumn);
		            $log.debug('PRODCODE>> ::',paramValueJson[data.laAge][paramNameJson.columnName.indexOf(String(data.laGender))-1]);
		            var valueToCompare = paramValueJson[data.laAge][paramNameJson.columnName.indexOf(String(data.laGender))-1];
					if(data.basePremium < valueToCompare){
						paramName = 'PRLT';
					}else{
					if(data.basePremium >= valueToCompare){
						paramName = 'PRGE';
					}
					}
					getPremiumRateByBasePremium(prodId, channelId, data,paramName)
					.then(function(val1){
						q.resolve(val1);
					});

					});
		            return q.promise;


			}

			function getPremiumRateByBasePremium(prodId, channelId, data,paramName){
				var q = $q.defer();
				commonDBFuncSvc.getParamValueName(prodId, channelId, paramName)
				  .then(function(rate) {
					  var rateValueJson = JSON.parse(rate.ParamValue);
					var rateNameJson = JSON.parse(rate.ParamColumn);
					$log.debug('PRODCODE>> ::',rateValueJson[data.laAge][rateNameJson.columnName.indexOf(String(data.laGender))-1]);
					q.resolve(rateValueJson[data.laAge][rateNameJson.columnName.indexOf(String(data.laGender))-1]);

				  });
				  return q.promise;
			}

			function getannualBonus(prodId, channelId, atPercent){
				var q = $q.defer();
				var paramName = "ANNCASHBON"+atPercent;
				commonDBFuncSvc.getParamValue(prodId, channelId, paramName)
				.then(function(val){
					q.resolve(val);
				});
				return q.promise;
			}




			function getfactorForCalculatingGuranteedPayouts(prodId, channelId, benifitUptoAgeSelected) {

					var q = $q.defer();
	   			var factorForCalculatingGuranteedPayouts = commonDBFuncSvc.getParamValue(prodId, channelId,'GPSAFACTOR')
					 	.then(function(val) {
					 			var ParamValueJson = JSON.parse(val);
					 			factorForCalculatingGuranteedPayouts = ParamValueJson[""+ benifitUptoAgeSelected][0];
								q.resolve(factorForCalculatingGuranteedPayouts);
					 		});
	   				return q.promise;
   			}

	   		/**
			Note:Please do not delete below function
			Below function meay be in use when we have to calculate base premium based on SA
			for now it is notin use
			This function will lookup into table called premium rate table
	   			and fetch the value from it on basis of lifeAssurer age & gender.
	   			@param1  : laAge=lifeAssurer age;
	   			@param2  : laGender =lifeAssurer Gender;
	   			@returns : premiumrate
	   		*/

			/* function getpremiumRate(prodId, channelId, laAge,laGender){
			// 		$log.debug('laAge :' + laAge);
			// 		$log.debug('laGender :' + laGender);
			// 		var premiumRate = 0.0;
			// 		var q = $q.defer();
			// 		premiumRate = commonDBFuncSvc.getParamValue(prodId, channelId,'PR')
			// 			.then(function(val) {
			// 				var ParamValueJson = JSON.parse(val);
			// 				premiumRate = ParamValueJson["" + laAge]["" + laGender];
			// 				q.resolve(premiumRate);
			// 			});
			// 		return q.promise;
			// }*/



     		 function getfactorBasisSA(prodId, channelId, sumAssured) {
				/**
					* TBD with Anil and Anushree
					*/
					var q = $q.defer();
					commonDbProductCalculation.getValueForGivenRange(prodId, channelId,'PERFACTSA', sumAssured).
					then(function(factorBasisSA){
						q.resolve(factorBasisSA);
					});
					return q.promise;
				//    		if(sumAssured > policyDataFromDBSvcObj.factorBasisSaAmountToBeCompared){
	      // 			factorBasisSA = 0.98;
				//    		}
				//    		if(sumAssured < policyDataFromDBSvcObj.factorBasisSaAmountToBeCompared){
	      // 			factorBasisSA = 1;
				//    		}
	      	//	return factorBasisSA;
      		}

      	/**
         *	Depends on two params
         *	@param1 : premium term
         *	@param2 : age at entry
         *	@param3 : benfit upto age selected [85 OR 100] for AS.
         * 	@return  : column of table matching
      	 **/
        function getSVFactorForNonGuranteed(prodId, channelId, premiumTerm, ageAtEntry, benfitUptoAgeSelected){
					 /**
					 	 *  Scenario1 : premiumTerm is 10 and benfitUptoAgeSelected is 100  //SVP10A100
						 *	Scenario2 : premiumTerm is 10 and benfitUptoAgeSelected is 85   //SVP10A85
						 *  Scenario3 : premiumTerm is 15 and benfitUptoAgeSelected is 100  //SVP15A100
						 *  Scenario4 : premiumTerm is 15 and benfitUptoAgeSelected is 85		//SVP15A85
					 	 */
						 	var paramName = 'SVP'+premiumTerm+'A'+benfitUptoAgeSelected ;
							var svFactorForNonGuranteed = [];
							$log.debug('paramName ::' + paramName);
							$log.debug("inside getSVFactorForNonGuranteed ");
							var q = $q.defer();
						  	commonDBFuncSvc.getParamValue(prodId, channelId,"" + paramName)
								.then(function(val) {
										var ParamValueJson = JSON.parse(val);
										var count = Object.keys(ParamValueJson).length;
										$log.debug('count**** ::' + count);
										for (var i = 0; i < count; i++) {
											svFactorForNonGuranteed.push(ParamValueJson[""+(i+1)][""+ageAtEntry]);
										}
										$log.debug(svFactorForNonGuranteed);
										q.resolve(svFactorForNonGuranteed);
							 		});
			   				return q.promise;
			}

          /*
            get values from look up table for calculating Garnteed SV.
            @param1 : premiumTerm
            @return column of table matching premium term
          */
        function getDataFromGSV(prodId, channelId, premiumTerm) {
						/*if premiumTerm is 10 years - need to get first coloumn value
						if premiumTerm is 15 years - need to get second coloumn value*/

						var guaranteedSurrenderValues = [];
						var q = $q.defer();
						commonDBFuncSvc.getParamValue(prodId, channelId,'GSV')
							.then(function(val) {
									var ParamValueJson = JSON.parse(val);
									var count = Object.keys(ParamValueJson).length;
									$log.debug('count ::' + count);
									for (var i = 0; i < count; i++) {
										if(parseInt(premiumTerm) === 10){
 							     		guaranteedSurrenderValues.push(ParamValueJson[""+(i+1)][0]);
										}else if(parseInt(premiumTerm) === 15){
											guaranteedSurrenderValues.push(ParamValueJson["" + (i+1)][1]);
										}
 							    }
									$log.debug(guaranteedSurrenderValues);
									q.resolve(guaranteedSurrenderValues);
								});
							return q.promise;
        }

		function getProdCodeAS(prodId, channelId, benfitsUptoAgeSelected,ppt){
			var q = $q.defer();
	        commonDBFuncSvc.getParamValueName(prodId, channelId, 'PRODCODE')
	          .then(function(val) {

				var paramValueJson = JSON.parse(val.ParamValue);
				var paramNameJson = JSON.parse(val.ParamColumn);
	            $log.debug('PRODCODE ::',paramValueJson[ppt][paramNameJson.columnName.indexOf(String(benfitsUptoAgeSelected))-1]);
	            q.resolve(paramValueJson[ppt][paramNameJson.columnName.indexOf(String(benfitsUptoAgeSelected))-1]);
	          });
	            return q.promise;

		}
}]);
