/*
* Created By: Anushree
* Monthly Database Service
*/
productCalculator.service(
	'mADataFromDBSvc',
	[
		'$q',
    	'$log',
		'commonFormulaSvc',
    	'commonDBFuncSvc',
    	'commonDbProductCalculation',
		 function($q, $log, commonFormulaSvc, commonDBFuncSvc, commonDbProductCalculation) {
		 	'use strict';

		 	var mA = this;

			mA.populatePPT = populatePPT;
			mA.populateMIBPERIOD = populateMIBPERIOD;
			mA.getSBForMB = getSBForMB;
			mA.getSurrenderFactor = getSurrenderFactor;
			mA.getGuranteedSurrenderValueArray = getGuranteedSurrenderValueArray;
			mA.getBandForSA = getBandForSA;
			mA.getDBFactor = getDBFactor;
			mA.getMAPremiumRateBYSA = getMAPremiumRateBYSA;
			mA.getMABandForPremium = getMABandForPremium;
			mA.getBonusFactAtPercent = getBonusFactAtPercent;
			mA.getMAPremiumRateBYPremium = getMAPremiumRateBYPremium;
			mA.getSpecialSV = getSpecialSV;
			mA.getProdCodeMA = getProdCodeMA;

			function getProdCodeMA(prodId, channelId, sumAssured,pt){
				var q = $q.defer();
				 getBandForSA (prodId, channelId, sumAssured).
				 then(function(band){
					 $log.debug("band::Pt",band,pt);
					 commonDBFuncSvc.getParamValueName(prodId, channelId, 'PRODCODE')
 						.then(function(val){
 								var paramValueJson = JSON.parse(val.ParamValue);
 								var paramNameJson = JSON.parse(val.ParamColumn);
 								//$log.debug("+++",paramValueJson[pt][paramNameJson.columnName.indexOf(String(band))-1]);
								//$log.debug('paramValueJson='+paramValueJson+'paramNameJson='+paramNameJson)
 								q.resolve(paramValueJson[pt][paramNameJson.columnName.indexOf(String(band))-1]);
 							});
				 });

						return q.promise;
			}

			function getSpecialSV(prodId, channelId, data){
				var q = $q.defer();
				var outPut = [];
				/*SSVBFACTOR*/
				commonDBFuncSvc.getParamValueName(prodId, channelId, 'SSVBFACTOR')
					.then(function(val){
						for (var i = 1; i <= data.pt; i++) {
							var paramValueJson = JSON.parse(val.ParamValue);
							var paramNameJson = JSON.parse(val.ParamColumn);
							$log.debug("paramNameJson.columnName.indexOf(data.ppt)-1]",paramNameJson.columnName.indexOf(String(data.ppt)));
							outPut.push(paramValueJson[i][paramNameJson.columnName.indexOf(String(data.ppt))-1]);
					        $log.debug("+++",paramValueJson[i][paramNameJson.columnName.indexOf(String(data.ppt))-1]);

					    }
						q.resolve(outPut);
					});
					return q.promise;
			}

			function getBonusFactAtPercent(prodId, channelId, pt, percentAt){
				var q = $q.defer();
				commonDBFuncSvc.getParamValueName(prodId, channelId, 'BOFACTOR')
					.then(function(val){
						$log.debug('val',val);
						var outPut = [];
						var paramValueJson = JSON.parse(val.ParamValue);
						var paramNameJson = JSON.parse(val.ParamColumn);
						q.resolve(paramValueJson[pt][paramNameJson.columnName.indexOf(String(percentAt))-1]);

					});
					return q.promise;

			}

			/*Band based on sumAssured*/
			function getBandForSA (prodId, channelId, sumAssured){
				var q = $q.defer();
				commonDBFuncSvc.getBandSS(prodId, channelId, "SABAND",sumAssured)
				.then(function(band){
						$log.debug('band',band);
						q.resolve(band[0]);
					});
					return q.promise;
		  		}


			function getGuranteedSurrenderValueArray(prodId, channelId,data) {
				var q = $q.defer();
				var outPut = [];
					commonDBFuncSvc.getParamValueName(prodId, channelId, 'GSVFACTOR')
					.then(function(val){
						$log.debug('val',val);
						var outPut = [];
						var paramValueJson = JSON.parse(val.ParamValue);
						var paramNameJson = JSON.parse(val.ParamColumn);
						for (var i = 1; i <= data.pt; i++) {
							outPut.push(paramValueJson[i][paramNameJson.columnName.indexOf(String(data.ppt))-1]);
						}
						q.resolve(outPut);

						});
					return q.promise;

				}

			function getSurrenderFactor(prodId, channelId,data,band) {

				var q = $q.defer();
				var paramName;
				var outPut = [];
				paramName = 'SVFACTOR'+data.ppt+'BAND'+band;
				$log.debug("SVFACTOR :: ",paramName);
					commonDBFuncSvc.getParamValueName(prodId, channelId, paramName)
						.then(function(arrVal){
							for (var i = 1; i <= data.pt; i++) {
								var paramValueJson = JSON.parse(arrVal.ParamValue);
								var paramNameJson = JSON.parse(arrVal.ParamColumn);
								$log.debug('paramValueJson',paramValueJson);
								$log.debug("paramNameJson.columnName.indexOf(data.laAge)-1]",paramNameJson.columnName.indexOf(String(data.laAge)));
								outPut.push(paramValueJson[i][paramNameJson.columnName.indexOf(String(data.laAge))-1]);
						        $log.debug("+++",paramValueJson[i][paramNameJson.columnName.indexOf(String(data.laAge))-1]);
						    }
							q.resolve(outPut);
						});
					return q.promise;

			}




			function getSBForMB(prodId, channelId, ppt){
				var q = $q.defer();
				/*SBFACTOR*/
				commonDBFuncSvc.getParamValue(prodId, channelId, 'SBFACTOR')
					.then(function(val){
						var paramValueJson = JSON.parse(val);
						$log.debug('DB::::',paramValueJson);
 					   q.resolve(paramValueJson[ppt][0]);

				});
					return q.promise;


			}

			function getDBFactor(prodId, channelId, ppt){
				var q = $q.defer();
				var paramName;

				commonDBFuncSvc.getParamValue(prodId, channelId, 'DBFACTOR')
					.then(function(val){
						var paramValueJson = JSON.parse(val);
						$log.debug('DB::::',paramValueJson);
					 	q.resolve(paramValueJson[ppt][0]);

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

			function populateMIBPERIOD(prodId, channelId, ppt){
				 var q = $q.defer();

				 commonDBFuncSvc.getParamValue(prodId, channelId, "MIBPERIOD")
					.then(function(val){
						var paramValueJson = JSON.parse(val);
					 	$log.debug('pt::::',ppt);
					 	q.resolve(paramValueJson[ppt][0]);

					});
					return q.promise;
			}

			function getPremiumRate(prodId, channelId, data, band){
			var q = $q.defer();
			var gender;

			switch (parseInt(data.laGender)) {
				case 0:
					gender = 'MALE';
					break;
				case 1:
					gender = 'FEMALE';
					break;

			}

			var paramName = "PR"+gender+"BAND"+band;

			commonDBFuncSvc.getParamValueName(prodId, channelId, paramName)
				.then(function(val){
					$log.debug('val',val);
					var paramValueJson = JSON.parse(val.ParamValue);
					var paramNameJson = JSON.parse(val.ParamColumn);
					$log.debug('paramValueJson',data.ppt);
					$log.debug('paramNameJson',paramNameJson.columnName.indexOf(String(data.ppt))-1);
					q.resolve(paramValueJson[data.laAge][paramNameJson.columnName.indexOf(String(data.ppt))-1]);

				});
				return q.promise;

			}

			function getMAPremiumRateBYSA (prodId, channelId, data){
				var q = $q.defer();
				getBandForSA(prodId, channelId, data.sumAssured)
					.then(function(band){
						getPremiumRate(prodId, channelId, data, band)
							.then(function(val){
								$log.debug("----",val);
								q.resolve(val);
							});
						});
					return q.promise;

			}

			function getMAPremiumRateBYPremium(prodId, channelId, data){

				var q = $q.defer();

				getMABandForPremium(prodId, channelId, data).then(function(band){
					getPremiumRate(prodId, channelId, data, band).then(function(val){
						$log.debug("+++??",val);
						q.resolve(val);
					});
				});
				return q.promise;

			}

			function getMABandForPremium (prodId, channelId, data){
				var q = $q.defer();
				var gender;
				switch (parseInt(data.laGender)) {
					case 0:
						gender = 'MALE';
						break;
					case 1:
						gender = 'FEMALE';
						break;

				}

				var paramName = "BASEPR"+gender;

				commonDBFuncSvc.getParamValueName(prodId, channelId, paramName)
					.then(function(val){
						$log.debug('val',val);
						var paramValueJson = JSON.parse(val.ParamValue);
						var paramNameJson = JSON.parse(val.ParamColumn);
						$log.debug('paramValueJson',data.ppt);
						$log.debug('paramNameJson',paramNameJson.columnName.indexOf(String(data.ppt))-1);
						/*Check if value of premium is greater if yes then Band 1 else Band 2*/
						if(data.basePremium < paramValueJson[data.laAge][paramNameJson.columnName.indexOf(String(data.ppt))-1]){
							q.resolve(1);
						}else {
							q.resolve(2);
						}

					});


				return q.promise;

			}


		}
	]
);
