/*
* Created By: Anushree
* Secure Income Database Service
*/
productCalculator.service(
	'sIDataService',
	[

		'$q',
		'$log',
		'commonDBFuncSvc',
		'common_const',
		 function( $q, $log, commonDBFuncSvc, common_const) {
		 	'use strict';
		 	var sIDb = this;

		 	sIDb.factorForDeathBenfitFirstRule = common_const.factorForDeathBenfitFirstRule;
		 	/*Define Functions*/
		 	sIDb.getfactorForDeathBenfitSecondRule = getfactorForDeathBenfitSecondRule;
		 	sIDb.getpremiumPaymentTerm = getpremiumPaymentTerm;
		 	sIDb.getSIPremiumRate = getSIPremiumRate;
		 	sIDb.getSiDataForGSV = getSiDataForGSV;
		 	sIDb.getRateForSplSV = getRateForSplSV;
		 	sIDb.getGSurvivalBenfitFactor = getGSurvivalBenfitFactor;
		 	sIDb.getGurrantedAdditionFactor = getGurrantedAdditionFactor;
		 	/*EOF Define Functions*/
		 	/*Implementation starts*/
		 	/*benfit Factor will be fetch from table*/
		 	function getGSurvivalBenfitFactor(productId, channelId){
		 		var q = $q.defer();
     		 	commonDBFuncSvc.getParamValue(productId, channelId, 'GSBFACTOR')
							.then(function(val) {
								var ParamValueJson = JSON.parse(val);
								//$log.debug('::GSBFACTOR',val);
								q.resolve(val);

								});
							return q.promise;
		 	}
		 	function getGurrantedAdditionFactor(productId, channelId, pt){
		 		var q = $q.defer();
     		 	commonDBFuncSvc.getParamValue(productId, channelId, 'GAFACTOR')
							.then(function(val) {
								var ParamValueJson = JSON.parse(val);
								$log.debug('::GAFACTOR',ParamValueJson[pt][0]);
								q.resolve(ParamValueJson[pt][0]);

								});
							return q.promise;
		 	}


		 	/*This function will get ppt for given payment term*/
		 	function getpremiumPaymentTerm(productId, channelId, pt){
	   			var q = $q.defer();
				 var policyTerm = commonDBFuncSvc.getParamValue(productId, channelId, 'PPT');
				 policyTerm.then(function(val) {
				 	var paramValueJson = JSON.parse(val);
				 	$log.debug('ppt::::',paramValueJson[pt]);
				 	q.resolve(paramValueJson[pt][0]);
				 });
   	 			return q.promise;
	   		}
	   		/*Premium rate from table*/
	   		function getSIPremiumRate(productId, channelId, laAge, ppt){
	   			$log.debug('laAge ::',laAge );
	   			$log.debug('ppt ::',ppt );
	   			var colRef;
	   			var q = $q.defer();
	   			/*switch (parseInt(ppt)) {
	 		            case 5:
	 		                colRef = 0;
	 		                break;
	 		            case 7:
	 		                colRef = 1;
	 		                break;
	 		            case 10:
	 		                colRef = 2;
	 		                break;

						}*/
        		commonDBFuncSvc.getParamValueName(productId, channelId, 'PR')
					.then(function(val) {
							var ParamValueJson = JSON.parse(val.ParamValue);
							var paramNameJson = JSON.parse(val.ParamColumn);
							 var rateFactor = ParamValueJson[""+laAge][paramNameJson.columnName.indexOf(String(ppt))-1];
							 $log.debug('rateFactor ::',rateFactor );
							 q.resolve(rateFactor);
						});
        		return q.promise;
	   		}


     		 /*Factor for DeathBenifit second rule*/
			function getfactorForDeathBenfitSecondRule(productId, channelId, pt){
     		 	var q = $q.defer();
     		 	commonDBFuncSvc.getParamValue(productId, channelId, 'GDBFACTOR')
							.then(function(val) {
								var ParamValueJson = JSON.parse(val);
								q.resolve(ParamValueJson[pt][0]);
								$log.debug('::val::',ParamValueJson[pt][0]);
								});
							return q.promise;
			}
     		 /*
            get values from look up table for calculating Garnteed SV.
            @param1 : premiumTerm
            @return column of table matching premium term
          */
        	function getSiDataForGSV(productId, channelId, premiumTerm){
						var q = $q.defer();
						var colRef;
						var guaranteedSurrenderValues = [];
						// switch (parseInt(premiumTerm)) {
						//           case 15:
	 		              //   colRef = 0;
	 		              //   break;
						//           case 17:
	 		              //   colRef = 1;
	 		              //   break;
						//           case 20:
	 		              //   colRef = 2;
	 		              //   break;
						//
						// }
						commonDBFuncSvc.getParamValueName(productId, channelId, 'SURATE')
							.then(function(val) {
									var ParamValueJson = JSON.parse(val.ParamValue);
		   							var paramNameJson = JSON.parse(val.ParamColumn);
									var count = Object.keys(ParamValueJson).length;
									$log.debug('count ::' + count);
									for (var i = 0; i < count; i++) {
										guaranteedSurrenderValues.push(ParamValueJson[""+(i+1)][paramNameJson.columnName.indexOf(String(premiumTerm))-1]);
									}
									$log.debug('gsv',guaranteedSurrenderValues);
									q.resolve(guaranteedSurrenderValues);
								});
							return q.promise;

        }

        	/**This function will lookup into table called  rate table
 	   			and fetch the value from it on basis of lifeAssurer age .
 	   			@param1  : laAge=lifeAssurer age;
 	   			@returns : premiumrate
 	   		*/
 	   		function getRateForSplSV(productId, channelId, ppt, laAge){
 	   			$log.debug('ppt',ppt);
 	   			var q = $q.defer();
 	   			var svSpl = [];
 	   			var DBName = 'SURATE'+ppt;

				$log.debug('DBName',DBName);
				var premiumRate = commonDBFuncSvc.getParamValue(productId, channelId, DBName);
				premiumRate.then(function(val) {
					var paramValueJson = JSON.parse(val);
					var count = Object.keys(paramValueJson).length;
										for (var i = 0; i < count; i++) {
											svSpl.push(paramValueJson[""+(i+1)][""+laAge]);
										}
										$log.debug(svSpl);
										q.resolve(svSpl);
				});
   				return q.promise;

 			}




		}
 	]
);
