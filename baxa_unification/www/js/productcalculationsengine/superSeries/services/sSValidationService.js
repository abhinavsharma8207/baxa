/*
service for premium Calculation here injecting all services
*/
productCalculator.service(
	'sSValidationService',
	[
	'$q',
    '$log',
	'commonFormulaSvc',
    'commonDBFuncSvc',
	'riderValidationService',
	'sSCalculationService',
	'prodValidationService',
		 function(
              $q,
              $log,
              commonFormulaSvc,
              commonDBFuncSvc,
              riderValidationService,
              sSCalculationService,
			  prodValidationService
              ) {
				'use strict';
				var sSObj = this;
      			sSObj.validateBaseProduct = validateBaseProduct;



				function validateBaseProduct(prodId, channelId, data){
                    $log.debug("::data",data);
					var q = $q.defer();
					var isValid = false;
					/** mobile web provision **/
					var reqData;
					if(!isWeb){
					    reqData = 	sSCalculationService.sSGetProdCode(prodId,channelId,data);
					}else{
					  /**Provision for webapp code **/


					  /**return values in array in then function**/
					}

	          		reqData.then(function(prodCode){


									var prodBaseCode = prodCode;
									var dbErrorMessages = [];
									var errorMessages = [];

									/** mobile web provision **/
									var queryData;
									if(!isWeb){
									    reqData = $q.all([
											prodValidationService.preCalculationValidateService(data, prodId, channelId, prodBaseCode),
											riderValidationService.riderPreHCValidateService(data, prodId, channelId, prodBaseCode),
											riderValidationService.riderPrePWRValidateService(data, prodId, channelId, prodBaseCode)
										]);
									}else{
									  /**Provision for webapp code **/
									  /**
									      for web team needs to get promices after webservice call for

									  **/

									  /**return values in array in then function**/
									}
									reqData.then(function(validations) {
										$log.debug('validations>>>',validations);
										var val = validations[0];
										var hcRiderVal = validations[1];
										var pwrRiderVal = validations[2];
										if(val.length > 0){
			                				isValid = false;
											$log.debug('val>>>',validations);
			                				dbErrorMessages.push(val[0]);
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
										$log.debug("dbErrorMessages",dbErrorMessages);
		                                $log.debug("dbErrorMessages.length",dbErrorMessages.length);
		                                var i, item;
		                                for (i = 0; i < dbErrorMessages.length; i++) {
											//for (item in dbErrorMessages[i]) {
		                                        errorMessages.push(dbErrorMessages[i].ErrorMessage);
		                                    //}
		                                }
										$log.debug("errorMessages",errorMessages);
											q.resolve(dbErrorMessages);

									});/*EOF Q ALL*/


							});/* EOF get product*/
						return q.promise;
			}

















    }]);
