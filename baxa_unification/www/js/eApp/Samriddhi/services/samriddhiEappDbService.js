


    /*
    service for premium Calculation here injecting all services
    */
    eAppModule.service(
    	'samriddhiEappDbService',
    	[
    	    '$q',
    	    '$log',
    			'commonDBFuncSvc',
          'samriddhiCalculationSvc',
    			'calculateAdbRiderPremiumSvc',
    			'calculatehospiCashRiderPremiumSvc',
    			'pwrRiderDataFromUserSvc',
    			'calculatePwrRiderPremiumSvc',
    			'hospiCashRiderDataFromUserSvc',
    		    function($q, $log,commonDBFuncSvc,samriddhiCalculationSvc,calculateAdbRiderPremiumSvc,calculatehospiCashRiderPremiumSvc,pwrRiderDataFromUserSvc,calculatePwrRiderPremiumSvc,hospiCashRiderDataFromUserSvc) {



          var vm= this;
          vm.getAllStaticValuesByArray = getAllStaticValuesByArray;
          vm.getAgeValidation = getAgeValidation;
          vm.getpaymentTerm=getpaymentTerm;

    // function getPolicyTerm= function(){
    //   PceMstParameter
    // }

    function getAgeValidation(prodId,channelId,propertyName){
      var q = $q.defer();
      commonDBFuncSvc.query("SELECT MinValue , MaxValue FROM PceMstValidation where FkProductId="+prodId+" AND FkChannelId ="+channelId+" AND NAME ='"+propertyName+"' ")
        .then(function(result) {
          	q.resolve(result.rows[0]);
        });
      	return q.promise;
    }


    function getpaymentTerm(prodId, channelId, ppt){
        var q = $q.defer();
        var policyTerm = commonDBFuncSvc.getParamValue(prodId, channelId, 'PT');
        policyTerm.then(function(val) {
            var paramValueJson = JSON.parse(val);
            $log.debug('pt::::',paramValueJson[ppt][0]);
            q.resolve(paramValueJson[ppt][0]);
        });
      return q.promise;
    }


    function getAllStaticValuesByArray(prodId, channelId, params){
        if(params.length > 0 && prodId !== "" && channelId !== ""){
          var returnVar = {};
          var q = $q.defer();
          var inVars = "";
          for(var x = 0; x<params.length; x++){
            inVars += (inVars === "")?('"' + params[x] + '"'):(',"' + params[x] + '"');
          }
          var parameters = ["" + prodId, "" + channelId];
          commonDBFuncSvc.query("SELECT MasterValue, MasterKey, Name FROM AskMstGenericMaster WHERE FkProductId="+prodId+" AND FkChannelId="+channelId+" AND Name IN ("+inVars+")  AND IsActive = 1")
            .then(function(result) {

              var paramValueResult = [];
              paramValueResult = commonDBFuncSvc.getAll(result);
              $log.debug("Result --- :: ",result);
              $log.debug('result::SS', paramValueResult);

              var arr = [];
              var newArr = [];
              for(var s=0; s<params.length; s++){
                arr = [];
                for (var props in paramValueResult) {
                  if (paramValueResult.hasOwnProperty(props)) {
                    var obj = {};
                    if(paramValueResult[props].Name == params[s]){
                      obj.id = paramValueResult[props].MasterKey;
                      obj.name = paramValueResult[props].MasterValue;
                      arr.push(obj);
                    }
                  }
                }
                newArr[params[s]] = arr;
              }

              q.resolve(newArr);
            });
          return q.promise;
        }
        else{
          return false;
        }
      }

    }]);
