/*
* Created By: Anushree
* Secure Income Database Service
*/
productCalculator.service(
	'fIDataService',
	[
		'$q',
		'$log',
		'commonDBFuncSvc',
		 function($q, $log, commonDBFuncSvc) {
		 	'use strict';
		 	var fIDb = this;

		 	/*Define Functions*/
		 	fIDb.getAllPremiumPaymentTerm = getAllPremiumPaymentTerm;
		 	fIDb.getpaymentTerm = getpaymentTerm;
		 	fIDb.getFiPremiumRate = getFiPremiumRate;
		 	fIDb.getAllFunds = getAllFunds;
		 	fIDb.getAdminFeeFactor = getAdminFeeFactor;
		 	fIDb.getCOIRate = getCOIRate;
		 	fIDb.getFMCCharge = getFMCCharge;
		 	fIDb.getInvestMentReturn = getInvestMentReturn;
		 	fIDb.getSurrenderChargeFactors = getSurrenderChargeFactors;
		 	fIDb.getCommisionFactor = getCommisionFactor;
			fIDb.getProdCodeFI = getProdCodeFI;

			function getProdCodeFI(fkProductId, fkChannelId, value, payType) {
				$log.debug("++++",fkProductId, fkChannelId, value, payType);
			  var q = $q.defer();
			  var pay ;
			  switch (parseInt(payType)) {
			  		case 1:
			  			pay = "SINGLEPAY";
			  		break;
					case 5:
				  		pay = "REGULARPAY";
				  	break;

			  }
		      var parameters = ["" + fkProductId, "" + fkChannelId, "" + '', "" + pay];
		       commonDBFuncSvc
		        .query("SELECT Value FROM PceMstValidation WHERE " + value + " BETWEEN MinValue AND MaxValue AND FkProductId=? AND FkChannelId=?  AND Value IS NOT NULL AND Value !=? AND Name =? ", parameters)
		        .then(function(result) {
		          var paramValueResult = commonDBFuncSvc.getById(result);
		         $log.debug('paramValueResult',paramValueResult);
				 q.resolve(paramValueResult.Value);
		        });
				return q.promise;
		    }

		 	/*EOF Define Functions*/
		 	/*Implementation starts*/
		 	/*This function will get ppt for given payment term*/
		 	function getAllPremiumPaymentTerm(prodId, channelId){
	   			var q = $q.defer();
				 var policyTerm = commonDBFuncSvc.getParamDynamicValue(prodId, channelId, 'PceMstParameter', 'ParamValue', 'PPT');
				 policyTerm.then(function(val) {
				 	var p = JSON.parse(val.ParamValue);
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

	   		/*This function will get ppt for given payment term*/
		 	function getpaymentTerm(prodId, channelId, pt){
	   			var q = $q.defer();
				 var policyTerm = commonDBFuncSvc.getParamValue(prodId, channelId, 'PT');
				 policyTerm.then(function(val) {
				 	var paramValueJson = JSON.parse(val);
				 	$log.debug('pt::::',paramValueJson[pt][0]);
				 	q.resolve(paramValueJson[pt][0]);
				 });
   	 			return q.promise;
	   		}
	   		/*Premium rate from table*/
	   		function getFiPremiumRate(prodId, channelId, ppt){
				$log.debug(">>>",prodId, channelId);
	   			$log.debug('ppt ::',ppt );
	   			var paramName = 'SAFACTOR'+ppt+'PAY';
	   			var q = $q.defer();
	   			commonDBFuncSvc.getParamValue(prodId, channelId, paramName)
					.then(function(val) {
							var ParamValueJson = JSON.parse(val);

							 $log.debug('rateFactor ::',ParamValueJson );
							 q.resolve(ParamValueJson);
						});
        		return q.promise;
	   		}



		 	/**
		 	getFunds
		 	**/
		 	function getAllFunds(prodId, channelId){
		 		var q = $q.defer();
		 		 var funds = commonDBFuncSvc.getAllMapedFunds(prodId, channelId);
				 funds.then(function(val) {
				 	/*$log.debug("Object:::" , JSON.stringify(val));*/
					q.resolve(val);
				 });
		 		return q.promise;
		 	}

     		 function getAdminFeeFactor(prodId, channelId, ppt){
     		 	var q = $q.defer();
						var colRef;
						var adminFeeFactor = [];
						commonDBFuncSvc.getParamValueName(prodId, channelId, 'ADMINFEE')
							.then(function(val) {
									var ParamValueJson = JSON.parse(val.ParamValue);
		   							var paramNameJson = JSON.parse(val.ParamColumn);
									var count = Object.keys(ParamValueJson).length;
									$log.debug('count ::' + count);
									for (var i = 0; i < count; i++) {
										adminFeeFactor.push(ParamValueJson[""+(i+1)][paramNameJson.columnName.indexOf(ppt)-1]);
									}
									$log.debug('FActors::Admin',adminFeeFactor);
									q.resolve(adminFeeFactor);
								});
							return q.promise;
     		 }

     		function getCOIRate(prodId, channelId, age, gender){
     			var q = $q.defer();
     			var cOIRate = [];
     			var matureAge = age+10;
     			commonDBFuncSvc.getParamValue(prodId, channelId, 'CIORATEFACTOR')
							.then(function(val) {
									var ParamValueJson = JSON.parse(val);
									var count = Object.keys(ParamValueJson).length;
									for (var i=age; i < matureAge; i++) {
									 	cOIRate.push(ParamValueJson[i][gender]);
									 }
									$log.debug('COIRate::',cOIRate);
									q.resolve(cOIRate);
								});
							return q.promise;

     		}


		 	/**/
		 	function getFMCCharge(prodId, channelId){
		 		var q = $q.defer();
		 		commonDBFuncSvc.getParamValue(prodId, channelId, 'FMCCHARGE')
							.then(function(val) {
								var ParamValueJson = JSON.parse(val);
								$log.debug('FMCCHARGE::',val);
								q.resolve(val);

								});
							return q.promise;
		 	}
		 	function getInvestMentReturn(prodId, channelId, rate){
		 		var q = $q.defer();
		 		var ir ;
		 		commonDBFuncSvc.getParamValue(prodId, channelId,'INVRETURN')
							.then(function(val) {
								var ParamValueJson = JSON.parse(val);
								ir =ParamValueJson[""+rate][0];
								$log.debug('getInvestMentReturn::',ir);
								q.resolve(ir);

								});
							return q.promise;
		 	}

		 	function getSurrenderChargeFactors(prodId, channelId){
		 		var q = $q.defer();
		 		var suCharge = [];
		 		commonDBFuncSvc.getParamValue(prodId, channelId, 'SUCHARGE')
							.then(function(val) {
									var ParamValueJson = JSON.parse(val);
									var count = Object.keys(ParamValueJson).length+1;
									for (var i=1; i < count; i++) {
									 	suCharge.push(ParamValueJson[i]);
									 }
									$log.debug('SUCHARGE::',suCharge);
									q.resolve(suCharge);
								});
							return q.promise;
		 	}
		 	function getCommisionFactor(prodId, channelId, ppt){
		 		var q =$q.defer();
		 		var colRef;
		 		commonDBFuncSvc.getParamValueName(prodId, channelId, 'COMMISSION')
							.then(function(val) {

								var commisionRate = [];
								var ParamValueJson = JSON.parse(val.ParamValue);
								var paramNameJson = JSON.parse(val.ParamColumn);
									var count = Object.keys(ParamValueJson).length;
									for (var i=1; i < count; i++) {
										commisionRate.push(ParamValueJson[""+i][paramNameJson.columnName.indexOf(ppt)-1]);
									 }
								q.resolve(commisionRate);

								});
							return q.promise;

		 	}
		}

 	]
);
