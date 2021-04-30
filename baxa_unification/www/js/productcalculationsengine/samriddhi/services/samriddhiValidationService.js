/*
service for premium Calculation here injecting all services
*/
productCalculator.service(
	'samriddhiValidationService',
	[
		'$q',
	    '$log',
		'commonFormulaSvc',
	    'commonDBFuncSvc',
		'sIDataService',
	    'commonPremiumFormulaService',
	    'riderValidationService',


		 function(
              $q,
              $log,
              commonFormulaSvc,
              commonDBFuncSvc,
              sIDataService,
              commonPremiumFormulaService,
              riderValidationService
              ) {
					'use strict';
				  	var sIObj = this;
					sIObj.getProductCode = getProductCode;
        			sIObj.validateBaseProduct = validateBaseProduct;
					sIObj.validateADBRider = validateADBRider;
					sIObj.validateHospiCashRider = validateHospiCashRider;
					sIObj.pwrRiderValidation = pwrRiderValidation;

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

					function validateBaseProduct(prodId, channelId, data){
			        	var q = $q.defer();
			          	var isValid = false;
						var productC;
						if(!isWeb){
							productC = getProductCode(prodId, channelId, data.ppt);
						}else{

						}

			            	productC.then(function(prodCode){
								var prodBaseCode = prodCode;
			                  	var dbErrorMessages = [];


							  var reqData;
	  						if(!isWeb){
	  						    reqData = $q.all([
  			                    validateProduct(prodId, channelId, prodCode, data),
  			                    // riderValidationService.riderPreADBValidateService(data, prodId, channelId, prodBaseCode),
  			                    // riderValidationService.riderPreHCValidateService(data, prodId, channelId, prodBaseCode),
  			                    // riderValidationService.riderPrePWRValidateService(data, prodId, channelId, prodBaseCode)
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
			                    // var adbRiderVal = validations[1];
			                    // var hcRiderVal = validations[2];
			                    // var pwrRiderVal = validations[3];
			                    if(val.length > 0){
			                      isValid = false;
			                      $log.debug('val>>>',validations);
			                      dbErrorMessages.push(validations[0]);
			                      }
			                    // if(val.length == 0 && data.ADBRider && adbRiderVal.length>0){
			                    //   isValid = false;
			                    //   $log.debug('riderVal>>>',validations);
			                    //   dbErrorMessages.push(adbRiderVal);
			                    // }
			                    // if(val.length == 0 && data.hospiCash && hcRiderVal.length>0){
			                    //   isValid = false;
			                    //     $log.debug('hcRiderVal>>>',validations);
			                    //   dbErrorMessages.push(hcRiderVal);
			                    // }
			                    // if(val.length == 0 && (data.PWRI || data.PWRII) && pwrRiderVal.length>0){
			                    //   isValid = false;
			                    //   $log.debug('pwrRiderVal>>>',validations);
			                    //   dbErrorMessages.push(pwrRiderVal);
			                    // }

			                      q.resolve(dbErrorMessages);

			                  });/*EOF Q ALL*/


			              });/* EOF get product*/
			            return q.promise;
			      }

      /*Calculation validation service*/

			function validateADBRider(prodId, channelId, data){
						var q = $q.defer();
							var isValid = false;



						var productC;
						if(!isWeb){
							productC = getProductCode(prodId, channelId, data.ppt);
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



				function validateHospiCashRider(prodId, channelId, data){
							var q = $q.defer();
								var isValid = false;
								var productC;
								if(!isWeb){
									productC = getProductCode(prodId, channelId, data.ppt);
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




					function pwrRiderValidation(prodId, channelId, data){
								var q = $q.defer();
								var isValid = false;
								var productC;
								if(!isWeb){
									productC = getProductCode(prodId, channelId, data.ppt);
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



         function validateProduct(prodId, channelId, prodCode, data){
              var q= $q.defer();
              $log.debug("the value of product code is ====",data);
              var errorMessage=[];
			  /** mobile web provision **/

			  var paramNameForPrem = [];
			  var reqData;
			  if(!isWeb){

				  switch (parseInt(data.premiumMode)) {
					  case 1:
						  paramNameForPrem = 'ANNPRE';
					  break;
					  case 2:
						  paramNameForPrem = 'SANPRE';
					  break;
					  case 4:
						  paramNameForPrem = 'QUAPRE';
					  break;
					  case 12:
						  paramNameForPrem = 'MONPRE';
					  break;
					  default:

				  }
			      reqData = $q.all([
	                                          commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'ENTAGE', data.laAge),
	                                          /* commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'SA', data.sumAssured),*/
	                                          commonDBFuncSvc.isInRange(prodId, channelId, prodCode, paramNameForPrem, data.basePremium)
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

                                  reqData.then(function(values){
                                          $log.debug("response from base validation",values);
                                          if(values[0].length>0)
                                            errorMessage.push(values[0][0]);
                                           if(values[1].length>0)
                                            errorMessage.push(values[1][0]);
                                            q.resolve(errorMessage);
                                          /*  if(values[2].length>0)
                                          //   errorMessage.push(values[2][0]["ErrorMessage"]);
                                          //   q.resolve(errorMessage);*/
                                  });
                                   return q.promise;
       }
}]);
