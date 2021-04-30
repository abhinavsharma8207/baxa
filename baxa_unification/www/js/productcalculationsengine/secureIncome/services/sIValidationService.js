/*
service for premium Calculation here injecting all services
*/
productCalculator.service(
	'sIValidationService',
	[
	'$q',
    '$log',
	'commonFormulaSvc',
    'commonDBFuncSvc',
	'sIDataService',
    'commonPremiumFormulaService',
	'riderValidationService',
    function($q,
              $log,
              commonFormulaSvc,
              commonDBFuncSvc,
              sIDataService,
              commonPremiumFormulaService,
			  riderValidationService
              ) {
	   'use strict';
	    var sIObj = this;
      sIObj.validationVal = {};
      sIObj.getProductCode = getProductCode;
      sIObj.validateBaseProduct = validateBaseProduct;
      sIObj.sICalculationValidateService = sICalculationValidateService;
			sIObj.validateADBRider	=	validateADBRider;
      /*uddhav validation services */
      function validateBaseProduct(prodId, channelId, data){ $log.debug("dataa::",prodId+'--'+channelId);
        var q = $q.defer();
          var isValid = false;
        getProductCode(prodId, channelId,data.ppt)
            .then(function(prodCode){
                  var prodBaseCode = prodCode;
                  var dbErrorMessages = [];
                  $q.all([
					  sICalculationValidateService(prodId, channelId, prodCode, data),
  					riderValidationService.riderPreADBValidateService(data, prodId, channelId, prodBaseCode),
  					riderValidationService.riderPreHCValidateService(data, prodId, channelId, prodBaseCode),
  					riderValidationService.riderPrePWRValidateService(data, prodId, channelId, prodBaseCode)
                  ]).then(function(validations) {
                    $log.debug('validations>>>',validations);
                    var val = validations[0];
                    var adbRiderVal = validations[1];
                    var hcRiderVal = validations[2];
                    var pwrRiderVal = validations[3];
                    if(val.length > 0){
                      isValid = false;
                      $log.debug('val>>>',validations);
                      dbErrorMessages.push(val);
                      }
                    if(val.length == 0 && data.ADBRider && adbRiderVal.length>0){
                      isValid = false;
                      $log.debug('riderVal>>>',validations);
                      dbErrorMessages.push(adbRiderVal);
                    }
                    if(val.length == 0 && data.hospiCash && hcRiderVal.length>0){
                      isValid = false;
                        $log.debug('hcRiderVal>>>',validations);
                      dbErrorMessages.push(hcRiderVal);
                    }
                    if(val.length == 0 && (data.PWRI || data.PWRII) && pwrRiderVal.length>0){
                      isValid = false;
                      $log.debug('pwrRiderVal>>>',validations);
                      dbErrorMessages.push(pwrRiderVal);
                    }
                      q.resolve(dbErrorMessages);
                  });/*EOF Q ALL*/

              });/* EOF get product*/
            return q.promise;
      }


	  function validateADBRider(prodId, channelId, data){
		  var q = $q.defer();
			  var isValid = false;
		  getProductCode(prodId, channelId, data.ppt)
				  .then(function(prodCode){
							  var prodBaseCode = prodCode;
							  var dbErrorMessages;
							  $q.all([

								  riderValidationService.riderPreADBValidateService(data, prodId, channelId, prodBaseCode)

							  ]).then(function(validations) {
								  $log.debug('validations>>>',validations);
								  //var val = validations[0];

									  q.resolve(validations[0]);
							  });/*EOF Q ALL*/

					  });/* EOF get product*/
				  return q.promise;
	  }

	  /*Calculation validation service*/
	  function sICalculationValidateService(prodId, channelId, prodCode, data){
		 var q= $q.defer();
		 $log.debug("the value of product code is ====",data);
		 var errorMessage=[];
		/** mobile web provision **/
		var reqData;
		if(!isWeb){
			reqData = $q.all([
											 commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'ENTAGE', data.laAge),
										//	 commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'SA', data.sumAssured),
											 commonDBFuncSvc.isInRange(prodId, channelId, prodCode, 'ANNPRE', data.basePremium)
										 ]);

		}else{
		  /**Provision for webapp code **/


		  /**return values in array in then function**/
		}

								  reqData.then(function(values){ $log.debug("the value of product code is ====",values);
									   var entAgeMessage = values[0];
													//	   var saMessage = values[1];
																		   var basePremiumMessage = values[1];

														   if (entAgeMessage.length)
															 errorMessage.push(entAgeMessage[0]);
														  //  if (saMessage.length > 0)
															//  errorMessage.push(saMessage[0]);
																		   if (basePremiumMessage.length > 0)
															 errorMessage.push(basePremiumMessage[0]);
														   q.resolve(errorMessage);
								  });
								   return q.promise;
	  }
	  /*getProductcode
		@param1 : prodId
		@param2 : channelId
		@param3 : key
	  */
	  function getProductCode(prodId, channelId, ppt){
			$log.debug("==>>>",prodId, channelId);
		var q = $q.defer();
	   /** mobile web provision **/
	   var reqData;
	   if(!isWeb){
		   reqData = commonDBFuncSvc.getParamValue(prodId, channelId, 'PRODCODE');
	   }else{
		 /**Provision for webapp code **/


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
	}]);
