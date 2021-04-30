/**
Temprory service created for User Input
*/

productCalculator.service(
	'samruddhiStaticDataSvc',
	[
	 	function() {
			'use strict';
	    	return {

	    		setItem:function(data){
		    		var samruddhiFormUserInputs = {
				       	laName: data.laName,
				       	laAge: data.laAge,
				       	laGender: data.laGender,
				       	isSelf: data.isSelf,
				       	proposerName:data.proposerName,
				       	proposerAge:data.proposerAge,
				       	proposerGender:0,
				       	sumAssured:data.sumAssured,
				       	basePremium:0,
				       	ppt:parseInt(data.ppt),
				       	NSAPForLA:data.NSAPForLA,
				       	premiumMode:data.premiumMode,
		   			};
		   			return samruddhiFormUserInputs;
	    		},

	    	};

   		}
   	]
);

/**
DB service which will fetch data from local storage
*/
productCalculator.service(
	'samriddhiDataFromDBSvc',
	[
		'$q',
		'$log',
		'commonDBFuncSvc',
		 function($q, $log, commonDBFuncSvc) {

		 	var samriddhiDB = this;

		 	samriddhiDB.guaranteedDeathBenefitFactor = 1.05;
		 	samriddhiDB.getPolicyTerm = getPolicyTerm;
		 	samriddhiDB.getPremiumRate = getPremiumRate;
		 	samriddhiDB.getSurrenderValue = getSurrenderValue;
		 	samriddhiDB.getRevisionaryBonusRateFourPer = getRevisionaryBonusRateFourPer;
		 	samriddhiDB.getRevisionaryBonusRateEightPer = getRevisionaryBonusRateEightPer;
		 	samriddhiDB.getTerminalBonusRate = getTerminalBonusRate;
		 	samriddhiDB.getSurrenderRate = getSurrenderRate;
		 	samriddhiDB.getBonusSurrenderRate = getBonusSurrenderRate;
			samriddhiDB.getProductCode = getProductCode;

			function getProductCode(prodId, channelId, ppt){
				var q = $q.defer();
				/** mobile web provision **/
				var reqData;
				if(!isWeb){
					reqData = commonDBFuncSvc.getParamValue(prodId, channelId, 'PRODCODE');
				}else{
				  /**Provision for webapp code **/
				  /**
					  for web team needs to get promices after webservice call for

				  **/

				  /**return values in array in then function**/
				}
				reqData.then(function(val) {
						var ParamValueJson = JSON.parse(val);
						$log.debug('::getProdCode::',ParamValueJson[ppt][0]);
						var prodCode = ParamValueJson[ppt][0];
						q.resolve(prodCode);
					});
				  return q.promise;
			}

		 	/*
				This will be auto populated based on the Premium paying term provided by the user
	   		*/
	   		function getPolicyTerm(prodId, channelId, ppt){
	   			var q = $q.defer();
				var policyTerm = commonDBFuncSvc.getParamValue(prodId, channelId, 'PT');
				policyTerm.then(function(val) {
					var paramValueJson = JSON.parse(val);
					$log.debug(paramValueJson[ppt]);
					q.resolve(parseInt(paramValueJson[ppt][0]));
				});
   				return q.promise;

	   		}

	   		/**This function will lookup into table called premium rate table
	   			and fetch the value from it on basis of lifeAssurer age & gender.
	   			@param1  : laAge=lifeAssurer age;
	   			@param2  : laGender =lifeAssurer Gender;
	   			@returns : premiumrate
	   		*/
	   		function getPremiumRate(prodId, channelId, laAge, laGender, ppt){
	   			var q = $q.defer();
	   			var DBName = 'PRPPT'+ppt;
				var premiumRate = commonDBFuncSvc.getParamValue(prodId, channelId, DBName);
				premiumRate.then(function(val) {
					var paramValueJson = JSON.parse(val);
					q.resolve(paramValueJson[laAge][laGender]);
				});
   				return q.promise;

			}




			/**
				Get from DB for samruddhi
			*/

			function getSurrenderValue(prodId, channelId, ppt){

				var q = $q.defer();
				var policyTerm = samriddhiDB.getPolicyTerm(prodId, channelId, ppt);
				policyTerm.then(function(pt){
					var surrenderRate = commonDBFuncSvc.getParamValueName(prodId, channelId, 'SURATE');
					surrenderRate.then(function(val) {
						var paramValueJson = JSON.parse(val.ParamValue);
					   	var refArray = JSON.parse(val.ParamColumn);
						var keyIndex = refArray.columnName.indexOf(String(pt))-1;
						var surrenderRateData = [];
						 for(var i = 1; i <= pt; i++){
						 	surrenderRateData.push(paramValueJson[i][keyIndex]);
						 }
						q.resolve(surrenderRateData);
					});
				});

   				return q.promise;

			}

			/*
			   Get from DB Revisionary Bonus Rate @4%
			*/
			function getRevisionaryBonusRateFourPer(prodId, channelId, ppt) {
				var revisionaryBonusRate;
				var q = $q.defer();
				revisionaryBonusRate = commonDBFuncSvc.getParamValue(prodId, channelId, 'REVBORATE4');
				revisionaryBonusRate.then(function(val) {
					var paramValueJson = JSON.parse(val);
					q.resolve(paramValueJson[ppt][0]);
				});
   				return q.promise;

			}

			/*
			   Get from DB Revisionary Bonus Rate @8%
			*/
			function getRevisionaryBonusRateEightPer(prodId, channelId, ppt) {
				var q = $q.defer();
				var revisionaryBonusRate = commonDBFuncSvc.getParamValue(prodId, channelId, 'REVBORATE8');
				revisionaryBonusRate.then(function(val) {
					var paramValueJson = JSON.parse(val);
					q.resolve(paramValueJson[ppt][0]);
				});
   				return q.promise;
			}

			/*
			   Get from DB Terminal Bonus Rate @4%
			*/
			function getTerminalBonusRate(prodId, channelId) {
				var q = $q.defer();
				var terminalBonusRate = commonDBFuncSvc.getParamValue(prodId, channelId, 'TERBORATE');
				terminalBonusRate.then(function(val) {
					var paramValueJson = JSON.parse(val);
					q.resolve(paramValueJson);
				});
   				return q.promise;
			}

			/*
			   Get from DB Surrender Rates table
			   Params Duration,Age
			*/
			function getSurrenderRate(prodId, channelId, age, ppt) {
				var q = $q.defer();
				var DBName;
				var policyTerm = samriddhiDB.getPolicyTerm(prodId, channelId, ppt);
				policyTerm.then(function(pt){
		   			DBName = 'SURATE'+pt;
					var surrenderRate = commonDBFuncSvc.getParamValue(prodId, channelId, DBName);
					surrenderRate.then(function(val) {
						var surrenderRateVal = [];
						var paramValueJson = JSON.parse(val);
						for(var i=1;i<=pt;i++){
							surrenderRateVal.push(paramValueJson[i][age]);
						}
						q.resolve(surrenderRateVal);
					});
				});
   				return q.promise;

			}

			/*
			   Get from DB Bonus Surrender Rates table
			   Params Duration,Age
			*/
			function getBonusSurrenderRate(prodId, channelId, age,ppt) {
				var q = $q.defer();
				var DBName;
				var policyTerm = samriddhiDB.getPolicyTerm(prodId, channelId, ppt);
				policyTerm.then(function(pt){
					DBName = 'BOSURATE'+pt;
		   			var bonussurrenderRate = commonDBFuncSvc.getParamValue(prodId, channelId, DBName);
					bonussurrenderRate.then(function(val) {
						var bsurrenderRateVal = [];
						var paramValueJson = JSON.parse(val);
						for(var i=1;i<=pt;i++){
							bsurrenderRateVal.push(paramValueJson[i][age]);
						}
						q.resolve(bsurrenderRateVal);
					});
				});
   				return q.promise;

			}

		}
	]
);
