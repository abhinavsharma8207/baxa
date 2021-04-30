/*
* Created By: Anushree
* Elte Secure Database Service
*/
productCalculator.service(
	'eADataFromDBSvc',
	[
		'$q',
    	'$log',
		'commonFormulaSvc',
    	'commonDBFuncSvc',
    	'commonDbProductCalculation',
		 function($q, $log, commonFormulaSvc, commonDBFuncSvc, commonDbProductCalculation) {
		 	'use strict';

		 	var eA = this;

		 	eA.getAlleAPremiumPaymentTerm = getAlleAPremiumPaymentTerm;
		 	eA.getEAPremiumRate = getEAPremiumRate;
		 	eA.getEAPaymentTerm = getEAPaymentTerm;
		 	eA.getEASv = getEASv;
		 	eA.getSplSv = getSplSv;
		 	eA.getPayoutRatesByBand = getPayoutRatesByBand;
		 	eA.getMaturityPeriod = getMaturityPeriod;
			eA.getEAProductCode = getEAProductCode;

		 	/*Implementation starts*/
		 	/*This function will get ppt for given payment term*/
		 	function getAlleAPremiumPaymentTerm(prodId, channelId){
		 		var q = $q.defer();
				 var policyTerm = commonDBFuncSvc.getParamValue(prodId, channelId, 'PT');
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

	   		function getEAPaymentTerm(prodId, channelId, pt){
	   			var q = $q.defer();
				 var policyTerm = commonDBFuncSvc.getParamValue(prodId, channelId, 'PT');
				 policyTerm.then(function(val) {
				 	var paramValueJson = JSON.parse(val);
				 	$log.debug('pt::::',paramValueJson[pt][0]);
				 	q.resolve(paramValueJson[pt][0]);
				 });
   	 			return q.promise;

	   		}

	   		/*Based on gender & ppt premium rate is retrived*/
		 	 function getEAPremiumRate(prodId, channelId, laGender,ppt,laAge) {
		 	 	var paramName = (parseInt(laGender) == 0)? "PRMALE" : "PRFEMALE";

		 	 	var q = $q.defer();
		 	 	var policyTerm = commonDBFuncSvc.getParamValueName(prodId,channelId,paramName);
					policyTerm.then(function(val) {
				 		var paramValueJson = JSON.parse(val.ParamValue);
						var paramNameJson = JSON.parse(val.ParamColumn);
				 		$log.debug('pt::::>',paramValueJson+"=="+ppt+"=="+[paramNameJson.columnName.indexOf(String(ppt))-1]);
				 		q.resolve(paramValueJson[String(laAge)][paramNameJson.columnName.indexOf(String(ppt))-1]);
				 	});
   	 			return q.promise;

		 	 }

			function getEASv(prodId, channelId, ppt){
		 		var q = $q.defer();
		 		var svFactorGuranteed = [];
		 		var ref;
				var svPer = commonDBFuncSvc.getParamValueName(prodId, channelId, 'SURATE');
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

		 	function getSplSv(prodId, channelId, age, ppt){
		 		var q = $q.defer();
		 		var svFactorGuranteed = [];
		 		var refName = "SURATE"+ppt;

		 		$log.debug("age",age);

		 		var svPer = commonDBFuncSvc.getParamValue(prodId, channelId, refName);
				 	svPer.then(function(val) {
						var p = JSON.parse(val);
				 		$log.debug("p:::",p+"==="+age);
				 		$log.debug("p>>>",p[age]);
				 		q.resolve(p[age]);
				 	});
				  return q.promise;
		 	}


		 	function getPayoutRatesByBand(prodId, channelId, basePremium){
		 			var q = $q.defer();
		 			$log.debug("sumA<<<",basePremium);
		 			commonDbProductCalculation.getBand(prodId, channelId, basePremium).then(function(band){
						$log.debug("band8888",band);
			 			var payOut = commonDBFuncSvc.getParamValue(prodId, channelId, 'PAYOUTRATE');
					 		payOut.then(function(val) {
								var p = JSON.parse(val);
					 			$log.debug("****",p);
					 			q.resolve(p[band][0]);
					 	});
					});

					return q.promise;
		 	}

		 	function getMaturityPeriod(prodId, channelId, pt){
		 		var q = $q.defer();
		 		var mP = commonDBFuncSvc.getParamValue(prodId, channelId, 'MPP');
				 mP.then(function(val) {

				 	var p = JSON.parse(val);
				 	$log.debug("****",p[pt][0]);
				 	q.resolve(p[pt][0]);
				 });
				  return q.promise;
		 	}

			function getEAProductCode(prodId, channelId, ppt, mPMode){
	          var q = $q.defer();
	  				var dbName;
	  				var ref;
	  				$log.debug('::getProdCode::',ppt+"==="+mPMode);
	  				switch (parseInt(mPMode)) {
	  									case 1:
	  											dbName = 'PCAMPF';
	  											break;
	  									case 2:
	  											dbName = 'PCSAMPF';
	  											break;
	  									case 4:
	  											dbName = 'PCQMPF';
	  											break;
	  							}
	  							$log.debug('::getProdCode::',dbName);
	            					commonDBFuncSvc.getParamValueName(prodId, channelId, dbName)
	  		              		.then(function(val) {
	  										var paramValueJson = JSON.parse(val.ParamValue);
	  							   			var paramNameJson = JSON.parse(val.ParamColumn);
	  										$log.debug('::getProdCode::',[paramNameJson.columnName.indexOf(String(mPMode))-1]);
	  		                				var prodCode = paramValueJson[ppt][paramNameJson.columnName.indexOf(String(mPMode))-1];
	  										$log.debug('::prodCode::',prodCode);
	  										q.resolve(prodCode);
	                  				});

	                				return q.promise;
	        }

		}
	]
);
