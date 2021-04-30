/*
* Created By: Anushree
* Monthly Database Service
*/
productCalculator.service(
	'ePDataFromDBSvc',
	[
		'$q',
    	'$log',
		'$filter',
		'commonFormulaSvc',
    	'commonDBFuncSvc',
    	'commonDbProductCalculation',
		'common_const',
		 function($q, $log,$filter, commonFormulaSvc, commonDBFuncSvc, commonDbProductCalculation,common_const) {
		 	'use strict';

		 	var eP = this;
			eP.isValidSA = isValidSA;
			eP.populatePPT = populatePPT;
			eP.getBandEP = getBandEP;
			eP.getPremiumRateEP = getPremiumRateEP;

			function isValidSA(prodId,channelId,sA){
				var q = $q.defer();
				commonDbProductCalculation.getMinValueOfBand(prodId,channelId,sA)
				.then(function(val){
					$log.debug("===",val);
					q.resolve(val);
				});
				return q.promise;
			}

			function getBandEP(prodId,channelId,sA){
				var q = $q.defer();
				commonDbProductCalculation.getBand(prodId,channelId,sA,'PRBAND')
				.then(function(val){
					$log.debug("===getBandEP",val);
					q.resolve(val);
				});
				return q.promise;

			}

			function getPremiumRateEP(prodId, channelId, data){
				var q = $q.defer();
				var dbName;
				var refIndex;
				var age;
				var genderVal = (parseInt(data.laGender)) ? "Female":"Male";
				$log.debug("(data.ePCategory).trim()",(data.ePCategory).replace(/\s/g, "") );
				getBandEP(prodId,channelId,data.sumAssured)
				.then(function(val){
					$log.debug("==getFiPremiumRateEP",val);
					if(val.indexOf("AGGREGATE") !== -1){
						dbName = val;
					}else{
						dbName = $filter('uppercase')((data.ePCategory).replace(/\s/g, ""))+val;/*Removes spaces*/
					}
					if(data.isPT){
						/*If PT is input then age set back for female*/
						if(data.laGender == 1){
							age = commonFormulaSvc.subtract(parseInt(data.laAge),common_const.ageSetBack);

						}else{
							age = parseInt(data.laAge);

						}
						refIndex = String(data.pt);
						//paramNameJson.columnName.indexOf(String(band))-1]
					}else{
						age = parseInt(data.laAge);
						var refString = genderVal+" Upto Age "+data.uptoage;
						refIndex = String(refString);
					}
					$log.debug('refIndex',refIndex);
					commonDBFuncSvc.getParamValueName(prodId, channelId, dbName)
		 						.then(function(val){
		 								var paramValueJson = JSON.parse(val.ParamValue);
		 								var paramNameJson = JSON.parse(val.ParamColumn);

		 								$log.debug("+++",paramValueJson[age][paramNameJson.columnName.indexOf(refIndex)-1]);
		 								q.resolve(paramValueJson[age][paramNameJson.columnName.indexOf(refIndex)-1]);
		 							});

					$log.debug('dbName',dbName);

				});
				return q.promise;
			}

			eP.getProdCodeEP = getProdCodeEP;

			function getProdCodeEP(prodId, channelId, data){
				var q = $q.defer();
				var refIndex;
				if(data.isPT){

					refIndex = String(data.pt);
					//paramNameJson.columnName.indexOf(String(band))-1]
				}else{
					var refString = "Upto Age "+data.uptoage;
					refIndex = String(refString);
				}
				$log.debug('refIndex++',refIndex);
					 commonDBFuncSvc.getParamValueName(prodId, channelId, 'PRODCODE')
 						.then(function(val){
 								var paramValueJson = JSON.parse(val.ParamValue);
 								var paramNameJson = JSON.parse(val.ParamColumn);
 								$log.debug("+++",paramValueJson[data.ePCategory]);
								$log.debug("indexval",paramNameJson.columnName.indexOf(refIndex)-1);
								$log.debug("==>>>>",paramValueJson[data.ePCategory][paramNameJson.columnName.indexOf(refIndex)-1]);
 								q.resolve(paramValueJson[data.ePCategory][paramNameJson.columnName.indexOf(refIndex)-1]);
 							});


						return q.promise;
			}




			function populatePPT(prodId, channelId, pt){
				 var q = $q.defer();

				 commonDBFuncSvc.getParamValue(prodId, channelId, "PPT")
					.then(function(val){
						var paramValueJson = JSON.parse(val);
					 	$log.debug('pt::::',pt);
					 	q.resolve(paramValueJson[pt][0]);

					});
					return q.promise;
			}




		}
	]
);
