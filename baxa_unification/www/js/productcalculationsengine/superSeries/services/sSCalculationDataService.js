/*
* Created By: Anushree
* Super Series Database Service
*/
productCalculator.service(
	'sSDataFromDBSvc',
	[
		'$q',
    	'$log',
		'commonFormulaSvc',
    	'commonDBFuncSvc',
		'commonDbProductCalculation',
		 function($q, $log, commonFormulaSvc, commonDBFuncSvc, commonDbProductCalculation) {
		 	'use strict';

		 	var sS = this;

		 	sS.getAllsSPaymentTerm = getAllsSPaymentTerm;
		 	sS.getSsPremiumRate = getSsPremiumRate;
		 	sS.getsSPaymentTerm = getsSPaymentTerm;
		 	sS.getPremiumRateByBand = getPremiumRateByBand;
		 	sS.getsSSv = getsSSv;
		 	sS.getBandForSS = getBandForSS;
			sS.getBandSSBasedOnBp = getBandSSBasedOnBp;
			sS.getXFactorForDeathBenifit = getXFactorForDeathBenifit;
			sS.getsSSb = getsSSb;
			sS.getSpecialSvFactor = getSpecialSvFactor;
			sS.getsSProductCode = getsSProductCode;


			/*Implementation starts*/
			function getXFactorForDeathBenifit(prodId, channelId, ppt){
				var q = $q.defer();
			 	var xFactor = commonDBFuncSvc.getParamValue(prodId,channelId,'XFACTOR');
			 xFactor.then(function(val) {
				var paramValueJson = JSON.parse(val);
				$log.debug('pt::::',paramValueJson[ppt][0]);
				q.resolve(paramValueJson[ppt][0]);
			 });
				return q.promise;
			}
		 	/*This function will get ppt for given payment term*/
		 	function getAllsSPaymentTerm(prodId, channelId){
		 		var q = $q.defer();
				 var policyTerm = commonDBFuncSvc.getParamValue(prodId,channelId,'PPT');
				 policyTerm.then(function(val) {
				 	$log.debug('kkk',val);
				 	var p = JSON.parse(val);
				 	var arr = [];
				 	for (var prop in p) {
					  if( p.hasOwnProperty( prop ) ) {
					    var obj = {};
					    obj.id=prop;
					    obj.name = p[prop][0];
					    arr.push(obj);
					  }
					}
					$log.debug("Object:::" , arr);
					q.resolve(arr);
				 });
   	 			return q.promise;

	   		}
	   		function getsSPaymentTerm(prodId, channelId, pt){
	   			var q = $q.defer();
				 var policyTerm = commonDBFuncSvc.getParamValue(prodId,channelId,'PPT');
				 policyTerm.then(function(val) {
				 	var paramValueJson = JSON.parse(val);
				 	$log.debug('pt::::',paramValueJson[pt][0]);
				 	q.resolve(paramValueJson[pt][0]);
				 });
   	 			return q.promise;

	   		}
			function getBandSSBasedOnBp(prodId, channelId, age, ppt, bp){
					$log.debug("getBandSSBasedOnBp",prodId+"==="+channelId+"==="+age+"==="+ppt+"==="+bp);

					var q = $q.defer();
					commonDBFuncSvc.getParamValueName(prodId,channelId,'BASEPR')
						.then(function(val) {
							var ref;
							var ParamValueJson = JSON.parse(val.ParamValue);
   								var paramNameJson = JSON.parse(val.ParamColumn);
								$log.debug("+++++>>>",ParamValueJson[age][ref]+"==="+bp+"==="+ref);
								var bPRateFromTable = parseFloat(ParamValueJson[age][paramNameJson.columnName.indexOf(String(ppt))-1]);
								if(bp<bPRateFromTable){
									q.resolve('PRBAND1');
								}else{
									q.resolve('PRBAND2');
								}

						});
						return q.promise;
				}

				function isFemaleSS(age,gender,ppt){
						var ageToCal;
						if(gender == 1){
						if(ppt == 6){
							if(age == 6 || age == 7 || age == 8){
								ageToCal = 6;
							}else{
								ageToCal = age-3;
							}
						}
						if(ppt == 10){
							if(age == 0 || age == 1 || age == 2){
								ageToCal = 0;
							}else{
								ageToCal = age-3;
							}

						}
					}else{
						ageToCal = age;
					}
						return ageToCal;
					}

					function getPremiumRateByBand(prodId, channelId, bandName, age, gender, ppt){

						var ageToCal = isFemaleSS(age, gender, ppt);
						$log.debug("===++Age",ageToCal);
						var q = $q.defer();
						commonDBFuncSvc.getParamValueName(prodId, channelId, bandName)
							.then(function(val) {
								var ref;
								var ParamValueJson = JSON.parse(val.ParamValue);
							   	var paramNameJson = JSON.parse(val.ParamColumn);
								$log.debug("+++++>>>pr",ParamValueJson[ageToCal][ref]+"==="+ref);
								var pRateFromTable = parseFloat(ParamValueJson[ageToCal][paramNameJson.columnName.indexOf(String(ppt))-1]);
								q.resolve(pRateFromTable);
							});
							return q.promise;
				}

				function getBandForSS(prodId, channelId, paramName, isBp, valueToCompare, ppt,age){
					var q = $q.defer();
					var band;
					if(isBp){
						band = getBandSSBasedOnBp(prodId, channelId, age, ppt, valueToCompare);
						band.then(function(val){
							$log.debug('pt::::>>',val);

								q.resolve(val);


						});
					}else{
						band = commonDbProductCalculation.getBand(prodId, channelId, valueToCompare, paramName);
						band.then(function(val){
							$log.debug('pt::::',val);
								q.resolve(val);

						});

					}
					return q.promise;
				}
	   		/*Based on gender & ppt premium rate is retrived*/
		 	 function getSsPremiumRate(prodId,channelId, laGender, ppt, laAge, isBp, valueToCompare) {
				 var q = $q.defer();
				 /*get Band as per condition for base premium & sumassured*/
				 getBandForSS(prodId,channelId,'PRBAND',isBp,valueToCompare,ppt,laAge).then(function(val){
					 $log.debug("======",val);
					 if(val !== undefined){
						 getPremiumRateByBand(prodId,channelId, val, laAge, laGender, ppt).then(function(premRate){
							 if(premRate != 'undefined'){
								 q.resolve(premRate);
							 }

						 });
					 }


				 });


				return q.promise;

		 	 }


			function getsSSb(prodId, channelId, ppt){
						var q = $q.defer();
						var sbFactorGuranteed = [];
						var refName = "SBFACTOR"+ppt;
						var sbPer = commonDBFuncSvc.getParamValue(prodId,channelId,refName);
					 	sbPer.then(function(val) {

					 	var p = JSON.parse(val);
						q.resolve(p);
					 });
					 return q.promise;

			}

				function getsSSv(prodId, channelId, ppt){
					var q = $q.defer();
					var svFactorGuranteed = [];
					var ref;

					var svPer = commonDBFuncSvc.getParamValueName(prodId,channelId,'GSVFACTOR');
				 svPer.then(function(val) {

				 	var p = JSON.parse(val.ParamValue);
				   	var paramNameJson = JSON.parse(val.ParamColumn);
				 	var count = Object.keys(p).length;
						$log.debug('count**** ::' + count+"=="+ref);
						for (var i = 1; i <= count; i++) {
						svFactorGuranteed.push(p[i][paramNameJson.columnName.indexOf(String(ppt))-1]);
						}
						q.resolve(svFactorGuranteed);
				 });
				 return q.promise;
				}

				function getSpecialSvFactor(prodId, channelId, pt){
					var q = $q.defer();
					var refName = "SSVFACTOR"+pt;
					var svPer = commonDBFuncSvc.getParamValue(prodId,channelId,refName);
				 	svPer.then(function(val) {

				 	var p = JSON.parse(val);

				 	q.resolve(p);
				 });
				  return q.promise;
				}

				function getsSProductCode(prodId, channelId, ppt, band){
					var q = $q.defer();
					commonDBFuncSvc.getParamValueName(prodId, channelId, "PRODCODE")
					.then(function(val) {
							var paramValueJson = JSON.parse(val.ParamValue);
							var paramNameJson = JSON.parse(val.ParamColumn);
							$log.debug("paramValueJson",paramValueJson);
							$log.debug("ppt",ppt);
							$log.debug('::getProdCode::',[paramNameJson.columnName.indexOf(String(band))-1]);
							var prodCode = paramValueJson[ppt][paramNameJson.columnName.indexOf(String(band))-1];
							$log.debug('::prodCode::',prodCode);
							q.resolve(prodCode);
					});
					return q.promise;
				}



		}
	]
);
