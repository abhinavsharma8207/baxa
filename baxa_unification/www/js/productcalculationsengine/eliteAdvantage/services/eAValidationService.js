
/*
service for premium Calculation here injecting all services
*/
productCalculator.service(
	'eAValidationService',
	[
	'$q',
    '$log',
	'commonFormulaSvc',
    'commonDBFuncSvc',
	'commonPremiumFormulaService',
    'riderValidationService',
	'eADataFromDBSvc',
	'prodValidationService',
		function(
            $q,
          	$log,
          	commonFormulaSvc,
          	commonDBFuncSvc,
          	commonPremiumFormulaService,
          	riderValidationService,
			eADataFromDBSvc,
			prodValidationService
              ) {
				'use strict';
				var eAObj = this;

			  eAObj.validationVal = {};


				eAObj.preEACalculationValidateService = preEACalculationValidateService;
				eAObj.validateBaseProduct = validateBaseProduct;
				eAObj.validateProduct = validateProduct;
				eAObj.validateADBRider = validateADBRider;
				eAObj.getProductCode = getProductCode;
				eAObj.validateHospiCashRider = validateHospiCashRider;
				eAObj.pwrRiderValidation = pwrRiderValidation;




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
								NSAPFactor
								serviceTaxFactor
								premiumRate
								ModalFactor
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



				function validateBaseProduct(prodId, channelId, data){
						var q = $q.defer();
						var isValid = false;
						eADataFromDBSvc.getEAProductCode(prodId, channelId, data.ppt, data.maturityPremiumMode)
		          			.then(function(prodCode){

									var prodBaseCode = prodCode;
									var dbErrorMessages = [];
									/** mobile web provision **/
									var reqData;
									if(!isWeb){
									    reqData = $q.all([
											prodValidationService.preCalculationValidateService(data, prodId, channelId, prodBaseCode),
											riderValidationService.riderPreADBValidateService(data, prodId, channelId, prodBaseCode),
											riderValidationService.riderPreHCValidateService(data, prodId, channelId, prodBaseCode),
											riderValidationService.riderPrePWRValidateService(data, prodId, channelId, prodBaseCode)
										]);
									}else{
									  /**Provision for webapp code **/
									  /**
									      for web team needs to get promices after webservice call for
									      NSAPFactor
									      serviceTaxFactor
									      premiumRate
									      ModalFactor
									  **/

									  /**return values in array in then function**/
									}
									reqData.then(function(validations) {
										$log.debug('validations>>>',validations);
										var val = validations[0];
										var adbRiderVal = validations[1];
										var hcRiderVal = validations[2];
										var pwrRiderVal = validations[3];
										if(val.length > 0){
			                				isValid = false;
											$log.debug('val>>>',validations);
			                				dbErrorMessages.push(val[0]);
			                			}
										if(val.length == 0 && data.ADBRider && adbRiderVal.length>0){
											isValid = false;
											$log.debug('riderVal>>>',validations);
											dbErrorMessages.push(adbRiderVal[0]);
										}
										if(val.length == 0 && data.hospiCash && hcRiderVal.length>0){
											isValid = false;
											$log.debug('hcRiderVal>>>',validations);
											dbErrorMessages.push(hcRiderVal[0]);
										}
										if(val.length == 0 && (data.PWRI || data.PWRII) && pwrRiderVal.length>0){
											isValid = false;
											$log.debug('pwrRiderVal>>>',validations);
											dbErrorMessages.push(pwrRiderVal[0]);
										}
											q.resolve(dbErrorMessages);
									});/*EOF Q ALL*/
							});/* EOF get product*/
						return q.promise;
			}



			function validateProduct(prodId, channelId, data){
					var q = $q.defer();
					var isValid = false;
					eADataFromDBSvc.getEAProductCode(prodId, channelId, data.ppt, data.maturityPremiumMode)
									.then(function(prodCode){
								var prodBaseCode = prodCode;
								var dbErrorMessages = [];
								/** mobile web provision **/
								var reqData;
								if(!isWeb){
										reqData = $q.all([
										//preEACalculationValidateService(data, prodId, channelId, prodBaseCode)
										prodValidationService.preCalculationValidateService(data, prodId, channelId, prodBaseCode)
									]);
								}else{
									/**Provision for webapp code **/
									/**
											for web team needs to get promices after webservice call for
											NSAPFactor
											serviceTaxFactor
											premiumRate
											ModalFactor
									**/
									/**return values in array in then function**/
								}
				  				reqData.then(function(validations) {
									$log.debug('validations>>>',validations);
									var val = validations[0];

									if(val.length > 0){
														isValid = false;
										$log.debug('val>>>',validations);
														dbErrorMessages.push(val);
													}
									q.resolve(dbErrorMessages);
								});/*EOF Q ALL*/
						});/* EOF get product*/
					return q.promise;
				}


			function preEACalculationValidateService(data, prodId, channelId, prodBaseCode){
					var q = $q.defer();
					var errorMessage = [];
					$log.debug("getCode:::",prodBaseCode+"=="+data.ppt+"=="+data.maturityPremiumMode);
					/** mobile web provision **/
					var reqData;
					if(!isWeb){
						reqData = $q.all([
														commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode,'ENTAGE',data.laAge),
												//		commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode,'SA',data.sumAssured),
														commonDBFuncSvc.isInRange(prodId, channelId, prodBaseCode,'ANNPRE',data.basePremium)
													]);
					}else{
					  /**Provision for webapp code **/
					  /**
						  for web team needs to get promices after webservice call for
						  NSAPFactor
						  serviceTaxFactor
						  premiumRate
						  ModalFactor
					  **/

					  /**return values in array in then function**/
					}
			    			reqData.then(function(messages){
											$log.debug('messages',messages);
												var isValidage = messages[0];
												var isValidPremium = messages[1];
									//			var isValidSA = messages[2];
												$log.debug(isValidage+"|||"+isValidPremium);
												$log.debug(isValidage.length+"|||"+isValidPremium.length);
												if(isValidage.length>0)
												errorMessage.push(isValidage[0]);
												if(isValidPremium.length>0)
												errorMessage.push(isValidPremium[0]);
												// if(isValidSA.length>0)
												// errorMessage.push(isValidSA[0]['ErrorMessage']);

													q.resolve(errorMessage);
												});

												return q.promise;
						 				}



      /*getProductcode
        @param1 : prodId
        @param2 : channelId
        @param3 : key
      */

			//
      // function getEAProductCode(prodId, channelId, ppt, mPMode){
      //   var q = $q.defer();
			// 	var dbName;
			// 	var ref;
			// 	$log.debug('::getProdCode::',ppt+"==="+mPMode);
			// 	switch (parseInt(mPMode)) {
			// 						case 1:
			// 								dbName = 'PCAMPF';
			// 								break;
			// 						case 2:
			// 								dbName = 'PCSAMPF';
			// 								break;
			// 						case 4:
			// 								dbName = 'PCQMPF';
			// 								break;
			// 				}
			// 				$log.debug('::getProdCode::',dbName);
      //     					commonDBFuncSvc.getParamValueName(prodId, channelId, dbName)
		  //             		.then(function(val) {
			// 							var paramValueJson = JSON.parse(val.ParamValue);
			// 				   			var paramNameJson = JSON.parse(val.ParamColumn);
			// 							$log.debug('::getProdCode::',[paramNameJson.columnName.indexOf(String(mPMode))-1]);
		  //               				var prodCode = paramValueJson[ppt][paramNameJson.columnName.indexOf(String(mPMode))-1];
			// 							$log.debug('::prodCode::',prodCode);
			// 							q.resolve(prodCode);
      //           				});
			//
      //         				return q.promise;
      // }


			/*Adb rider validation*/
			function validateADBRider(prodId, channelId, data){
						var q = $q.defer();
							var isValid = false;



						var productC;
						if(!isWeb){
							productC = eADataFromDBSvc.getEAProductCode(prodId, channelId, data.ppt, data.maturityPremiumMode);
						}else{

						}

						productC.then(function(prodCode){
						var prodBaseCode = prodCode;
											var dbErrorMessages = [];
											/** mobile web provision **/
											var reqData;
											if(!isWeb){
													reqData = $q.all([
													riderValidationService.riderPreADBValidateService(data, prodId, channelId, prodBaseCode)
												]);
											}else{
												/**Provision for webapp code **/
												/**return values in array in then function**/
											}
										reqData.then(function(validations) {
											$log.debug('validations>>>',validations[0]);
											q.resolve(validations[0]);
										});/*EOF Q ALL*/
								});/* EOF get product*/
							return q.promise;
				}


						/*hospicash rider validation */
						function validateHospiCashRider(prodId, channelId, data){
											var q = $q.defer();
												var isValid = false;
												var productC;
												if(!isWeb){
													productC = eADataFromDBSvc.getEAProductCode(prodId, channelId, data.ppt, data.maturityPremiumMode);
												}else{

												}

													productC.then(function(prodCode){
														var prodBaseCode = prodCode;
																var dbErrorMessages = [];
																/** mobile web provision **/
																var reqData;
																if(!isWeb){
																    reqData = $q.all([
																		riderValidationService.riderPreHCValidateService(data, prodId, channelId, prodBaseCode)
																	/*	riderValidationService.riderPreADBValidateService(data, prodId, channelId, prodBaseCode),*/
																]);
																}else{
																  /**Provision for webapp code **/


																  /**return values in array in then function**/
																}
															reqData.then(function(validations) {
																$log.debug('validations>>>',validations);
																q.resolve(validations[0]);
															});/*EOF Q ALL*/
													});/* EOF get product*/
												return q.promise;
									}



									/*PWR rider validation */
									function pwrRiderValidation(prodId, channelId, data){
												var q = $q.defer();
												var isValid = false;
												var productC;
												if(!isWeb){
													productC = eADataFromDBSvc.getEAProductCode(prodId, channelId, data.ppt, data.maturityPremiumMode);
												}else{

												}
												productC.then(function(prodCode){
												var prodBaseCode = prodCode;
																	var dbErrorMessages = [];
																	/** mobile web provision **/
																	var reqData;
																	if(!isWeb){
																	    reqData = $q.all([
																			riderValidationService.riderPrePWRValidateService(data, prodId, channelId, prodBaseCode)
																		/*	riderValidationService.riderPreADBValidateService(data, prodId, channelId, prodBaseCode),*/
																	]);
																	}else{
																	  /**Provision for webapp code **/
																	  /**return values in array in then function**/
																	}
																reqData.then(function(validations) {
																	$log.debug('validations>>>',validations);
																	q.resolve(validations[0]);
																});/*EOF Q ALL*/
														});/* EOF get product*/
													return q.promise;
										}



}]);
