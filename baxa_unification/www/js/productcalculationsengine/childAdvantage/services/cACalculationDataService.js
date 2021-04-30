/*
* Created By: Anushree
* Elte Secure Database Service
*/
productCalculator.service(
	'cADataFromDBSvc',
	[
		'$q',
    	'$log',
		'commonFormulaSvc',
    	'commonDBFuncSvc',
    	'commonDbProductCalculation',
		 function($q, $log, commonFormulaSvc, commonDBFuncSvc,  commonDbProductCalculation) {
		 	'use strict';

		 	var cA = this;

			cA.populatePT = populatePT;
			cA.getBandForSA = getBandForSA;
			cA.getCAPremiumRateBYSA = getCAPremiumRateBYSA;
			cA.getCABandForPremium = getCABandForPremium;
			cA.getCAPremiumRateBYPremium = getCAPremiumRateBYPremium;
			cA.getDBFactor = getDBFactor;
			cA.getMBFactor = getMBFactor;
			cA.getSBForMB = getSBForMB;
			cA.getGSV = getGSV;
			cA.getMBforNonGuranteed = getMBforNonGuranteed;
		//	cA.getSurrenderValueAtGivenPercent = getSurrenderValueAtGivenPercent;
			cA.getSurrenderFactor = getSurrenderFactor;
			cA.getSurrenderFactorBonus = getSurrenderFactorBonus;
			cA.getProdCodeCA = getProdCodeCA;



			function getSurrenderFactorBonus(prodId, channelId,data) {
				var q = $q.defer();
				var paramName;
				var paymentType = data.benfitType.slice(0,1);
				paramName = 'BOSURATE'+paymentType+'P'+data.pt;
				$log.debug("BOSURATE",paramName);
					getSurrenderValueArray(prodId, channelId, paramName, data)
						.then(function(arrVal){
						 	q.resolve(arrVal);
						});
					return q.promise;
				}

			function getSurrenderFactor(prodId, channelId,data) {
				var q = $q.defer();
				var paramName;
				var initials;
				var paymentType = data.benfitType.slice(0,1);
				//SURATELPEN21
				if(data.maturityOption == "Money Back"){
					initials = 'MB';
				}else{
					initials = 'EN';
				}
				paramName = 'SURATE'+paymentType+'P'+initials+""+data.pt;
				$log.debug("SURATE",paramName);
					getSurrenderValueArray(prodId, channelId, paramName, data)
						.then(function(arrVal){
						 	q.resolve(arrVal);
						});
					return q.promise;
			}

			function getSurrenderValueArray(prodId, channelId, paramName, data){
				var q = $q.defer();
				commonDBFuncSvc.getParamValueName(prodId, channelId, paramName)
					.then(function(val){
						$log.debug('val',val);
						var outPut = [];
						 var paramValueJson = JSON.parse(val.ParamValue);
						var paramNameJson = JSON.parse(val.ParamColumn);
						 		$log.debug('paramValueJson::BOSURATE',paramValueJson);
						 		$log.debug('paramNameJson::BOSURATE',paramNameJson);

						 	for (var i = 1; i <= data.pt; i++) {
								$log.debug("paramNameJson.columnName.indexOf(data.laAge)-1]",paramNameJson.columnName.indexOf(String(data.laAge)));
							 	outPut.push(paramValueJson[i][paramNameJson.columnName.indexOf(String(data.laAge))-1]);
			              		$log.debug("+++",paramValueJson[i][paramNameJson.columnName.indexOf(String(data.laAge))-1]);
			             	}

						 $log.debug("ppp", outPut);
						 q.resolve(outPut);

				});
				return q.promise;
			}

			function  getMBforNonGuranteed(prodId, channelId, pt, sumAssured,  maturityOption, benfitType, atPercent){
				var q = $q.defer();
			var paramName;
			var initials;
			getBandForSA(prodId, channelId, sumAssured).then(function(band){

				var paymentType = benfitType.slice(0,1)+"P";

				switch (atPercent) {
					case 8:
						paramName = 'BORATE8';
						break;
					case 4:
						if(maturityOption == "Money Back"){
							initials = 'MB';
						}else{
							initials = 'EN';
						}
						paramName = 'BORATE'+initials+'4BAND'+band;
						break;

				}
				$log.debug("<<>>>",paramName);
				commonDBFuncSvc.getParamValueName(prodId, channelId, paramName)
					.then(function(val){
						var outPut = [];
						var paramValueJson = JSON.parse(val.ParamValue);
						var paramNameJson = JSON.parse(val.ParamColumn);
				 		$log.debug('paramValueJson::SURATE',paramValueJson);
				 		$log.debug('paramNameJson::SURATE',paramNameJson);
					 	$log.debug("===",paramNameJson.columnName.indexOf(paymentType));

							outPut.push(paramValueJson[pt][paramNameJson.columnName.indexOf(paymentType)-1]);
				  			$log.debug("ppp", paramValueJson[pt][paramNameJson.columnName.indexOf(paymentType)-1]);
				 			q.resolve(paramValueJson[pt][paramNameJson.columnName.indexOf(paymentType)-1]);

			 		});
				});
				return q.promise;
			}

			function getGSV(prodId, channelId, pt, benfitType){
				var q = $q.defer();
				var paymentType = benfitType.slice(0,1)+"P";
				var paramName = 'SURATE'+paymentType;
				commonDBFuncSvc.getParamValueName(prodId, channelId, paramName)
					.then(function(val){
						$log.debug('val',val);
						var outPut = [];
						 var paramValueJson = JSON.parse(val.ParamValue);
						var paramNameJson = JSON.parse(val.ParamColumn);
						 $log.debug('paramValueJson::SURATE',paramValueJson);
						 $log.debug('paramNameJson::SURATE',paramNameJson);
							 $log.debug("===",paramValueJson.length);
						 for (var i = 1; i <= pt; i++) {
							 outPut.push(paramValueJson[i][paramNameJson.columnName.indexOf(pt)-1]);
			              $log.debug("+++",paramValueJson[i][paramNameJson.columnName.indexOf(pt)-1]);
			             }

						 $log.debug("ppp", outPut);
						 q.resolve(outPut);

				});
					return q.promise;
			}


			function getSBForMB(prodId, channelId, pt){
				var q = $q.defer();
				//SUBENEFIT
				commonDBFuncSvc.getParamValueName(prodId, channelId, 'SUBENEFIT')
					.then(function(val){
						var paramValueJson = JSON.parse(val.ParamValue);
					   	var paramNameJson = JSON.parse(val.ParamColumn);
						$log.debug('SUBENEFIT::::>>',paramValueJson);
						q.resolve(paramValueJson);

				});
					return q.promise;

			}

			function getDBFactor(prodId, channelId, maturityOptn){
				var q = $q.defer();
				var paramName;
				switch (maturityOptn) {
					case "Money Back":
						paramName = 'DBFACTORMB';
						break;
					case "Endowment":
						paramName = 'DBFACTOREN';
						break;

				}
				commonDBFuncSvc.getParamValue(prodId, channelId, paramName)
					.then(function(val){
						$log.debug('DB::::',val);
					 	q.resolve(val);

				});
					return q.promise;

			}

			function getMBFactor(prodId, channelId, maturityOptn){
				var q = $q.defer();
				var paramName;
				switch (maturityOptn) {
					case "Money Back":
						paramName = 'MBFACTORMB';
						break;
					case "Endowment":
						paramName = 'MBFACTOREN';
						break;

				}
				commonDBFuncSvc.getParamValue(prodId, channelId, paramName)
					.then(function(val){
						$log.debug('DB::::',val);
					 	q.resolve(val);

				});
					return q.promise;

			}

			function getBandForSA(prodId, channelId, valueToCompare){
				var q = $q.defer();
				commonDbProductCalculation.getValueForGivenRange(prodId, channelId, 'SABAND', valueToCompare)
				.then(function(value){
					q.resolve(value);
				});

				return q.promise;
			}

			function populatePT(prodId, channelId, pt, benfitType){
				var q = $q.defer();
				var paramName;
				var paymentType = benfitType.slice(0,1);
				paramName = 'PPT'+paymentType+'P';

				commonDBFuncSvc.getParamValue(prodId, channelId, paramName)
					.then(function(val){
						var paramValueJson = JSON.parse(val);
					 	$log.debug('pt::::',pt);
					 	q.resolve(paramValueJson[pt][0]);

					});
					return q.promise;
			}

			function getPremiumRate(prodId, channelId, data, band){
				var q = $q.defer();
			var benfitType = data.benfitType;
			var minAge = 18;
			var ageSetBack = 3;
			var paymentType = benfitType.slice(0,1);
			$log.debug("paymentType",paymentType+"=="+band);
			var paramName = "PR"+paymentType+"PSABAND"+band;
			$log.debug("paramName>>>",paramName);
			var age;
			if(data.laGender == 0){
				age = data.laAge;
			}else {
				if(data.laAge == 18 || data.laAge == 19 || data.laAge == 20){
					age = minAge;
				}else{
					age = commonFormulaSvc.subtract(data.laAge, ageSetBack);
				}

			}
			commonDBFuncSvc.getParamValueName(prodId, channelId, paramName)
				.then(function(val){
					$log.debug('val',val);
					 var paramValueJson = JSON.parse(val.ParamValue);
					var paramNameJson = JSON.parse(val.ParamColumn);
					 $log.debug('paramValueJson',data.pt);
					 $log.debug('paramNameJson',paramNameJson.columnName.indexOf(data.pt)-1);
					 q.resolve(paramValueJson[age][paramNameJson.columnName.indexOf(data.pt)-1]);

				});
				return q.promise;
			}

			function getCAPremiumRateBYSA (prodId, channelId, data){
				var q = $q.defer();
				getBandForSA(prodId, channelId, data.sumAssured).then(function(band){
					getPremiumRate(prodId, channelId, data, band).then(function(val){
						$log.debug("----",val);
						q.resolve(val);
					});


				});
				return q.promise;
			}

			function getCAPremiumRateBYPremium(prodId, channelId, data){
				var q = $q.defer();

				getCABandForPremium(prodId, channelId, data).then(function(band){
					$log.debug("+++BYPremium",band);
					getPremiumRate(prodId, channelId, data, band).then(function(val){
						$log.debug("+++BYPremium",val);
						q.resolve(val);
					});
				});
				return q.promise;
			}

			function getCABandForPremium (prodId, channelId, data){
				var q = $q.defer();

					/*get paramName by i/p PRRPSABAND1*/
					var benfitType = data.benfitType;
					var paymentType = benfitType.slice(0,1);
					var bandName;


					/*First compare basePremium with fetched data*/
					var paramNameL = "BASEPR"+paymentType+"P1";
					var paramNameH = "BASEPR"+paymentType+"P2";
					$log.debug("paymentType",paramNameL+"=="+paramNameH);
					$q.all([
							commonDBFuncSvc.getParamValueName(prodId, channelId, paramNameL),
							commonDBFuncSvc.getParamValueName(prodId, channelId, paramNameH),
					]).then(function(val){
								$log.debug('val',val);
								var paramValueJsonL = JSON.parse(val[0].ParamValue);
								var paramNameJsonL = JSON.parse(val[0].ParamColumn);
								var paramValueJsonH = JSON.parse(val[1].ParamValue);
								var paramNameJsonH = JSON.parse(val[1].ParamColumn);
								$log.debug("===L",paramValueJsonL[data.laAge][paramNameJsonL.columnName.indexOf(data.pt)-1]);
								$log.debug("===H",paramValueJsonH[data.laAge][paramNameJsonH.columnName.indexOf(data.pt)-1]);
								$log.debug("===v",data.basePremium);

								if((paramValueJsonL[data.laAge][paramNameJsonL.columnName.indexOf(data.pt)-1]) > data.basePremium){
									  	q.resolve(1);
								}else{
									if(((paramValueJsonL[data.laAge][paramNameJsonL.columnName.indexOf(data.pt)-1]) == data.basePremium) || ((paramValueJsonH[data.laAge][paramNameJsonH.columnName.indexOf(data.pt)-1]) > data.basePremium)){
												q.resolve(2);
											}else{
												if(paramValueJsonH[data.laAge][paramNameJsonH.columnName.indexOf(data.pt)-1] <= data.basePremium){
													q.resolve(3);
												}

											}
								 		}


						});

				return q.promise;
			}

			function getProdCodeCA(prodId, channelId, ppt,benfitType, maturityOption){
				var q = $q.defer();
				var paymentType = benfitType.slice(0,1);
				var dbName = "PRODCODE"+paymentType+"P";
				$log.debug("dbName",dbName);
				commonDBFuncSvc.getParamValueName(prodId, channelId, dbName)
		          .then(function(val) {

					var paramValueJson = JSON.parse(val.ParamValue);
					var paramNameJson = JSON.parse(val.ParamColumn);
		            $log.debug('PRODCODE ::',paramValueJson[ppt][paramNameJson.columnName.indexOf(maturityOption)-1]);
		            q.resolve(paramValueJson[ppt][paramNameJson.columnName.indexOf(maturityOption)-1]);
		          });
				  return q.promise;

			}


		}
	]
);
