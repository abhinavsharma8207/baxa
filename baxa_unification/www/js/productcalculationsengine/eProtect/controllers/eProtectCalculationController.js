/**
* Created By: Anushree
* eProtect Calculation Service
*
* @class ePCalculationController
* @submodule core-controller
* @constructor
*/
productCalculator.controller(
  'ePCalculationController',
  [
    '$scope',
    '$log',
    'ePCalculationService',
    'ePDataFromDBSvc',
    'hospiCashRiderDataFromUserSvc',
    'calculatehospiCashRiderPremiumSvc',
    'commonDbProductCalculation',
    'getSetCommonDataService',
    'commonFormulaSvc',
    'ePValidationService',
    'calculateEAdbRiderPremiumSvc',
    'eAdbRiderDataFromUserSvc',

    function($scope, $log, ePCalculationService, ePDataFromDBSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, commonDbProductCalculation, getSetCommonDataService, commonFormulaSvc, ePValidationService, calculateEAdbRiderPremiumSvc,eAdbRiderDataFromUserSvc){
        'use strict';


        $scope.cABasePremiumOutput = false;
        $scope.cABIOutput = false;
        $scope.showDbErrors = false;
        $scope.dbErrors = false;
        $scope.showOutput = false;
        $scope.biOutput = false;

        /*Temprory product code it will be dynamic once new flow is implemented*/
        //var prodData = {prodId:14,adbRiderId:4,hospicashId: 5};


        var prodData = getSetCommonDataService.getCurrentProdData();
        $log.debug('prodData',prodData);
        var commonData = getSetCommonDataService.getCommonData();
        $log.debug('commonData',commonData);


        /* var prodId = prodData.prodId;
        // var channelId = commonData.channelId;
        // var adbRiderId = prodData.adbRiderId;
        // var hospicashId = prodData.hospicashId;*/
        var prodId = 16;
        var channelId = 1;
        var eAdbRiderId = 18;
        var hospicashId = 5;

        $log.debug('prodId',prodId);
        $log.debug('channelId',channelId);
        /*show output false*/
        $scope.adbPremiumOutput = false;
        $scope.showOutput = false;
        $scope.biOutput = false;
        $scope.hospicashOutput = false;
        $scope.isValidSA = true;

        /*Temporary data for User Input*/
        $scope.data = {
            laName: "ABC",
            laAge: 27,
            laGender: 0,
            isSelf: false,
            proposerName: "ABC",
            proposerAge: 30,
            proposerGender: 1,
            sumAssured: 0,
            basePremium: 75000,
            //ppt: 8,
            //pt: 16,
            NSAPForLA: false,
            premiumMode: 2,

                };

                var staticVal = ePCalculationService.getInputValues(prodId, channelId);
                staticVal.then(function(staticVal){
                    $scope.genders = staticVal.GENDER;
                    $scope.pModes = staticVal.PMODE;
                    $scope.pts = staticVal.PT;
                    $scope.categories = staticVal.SMOKINGHABIT;
                    $scope.uptoages = staticVal.UPTOAGE;
                });

          /*Based on premium payment term set premium term*/
        $scope.populatePPT = function(data){


             $scope.data.ppt = angular.copy($scope.data.pt);
             $scope.data.riderterm = angular.copy($scope.data.ppt);

        };

        $scope.populatePPTByUptoAge = function(data){
            $log.debug(commonFormulaSvc.subtract(data.uptoage, data.laAge));
            $scope.data.ppt = $scope.data.pt = commonFormulaSvc.subtract(data.uptoage, data.laAge);
            $scope.data.riderterm = angular.copy($scope.data.ppt);

        };

        $scope.chkValidSA = function(sA){
            $scope.showDbErrors = false;
            $scope.dbErrors = "";

            ePCalculationService.chkValidSA(prodId, channelId, sA)
            .then(function(valMsg){
                $log.debug("valMsg",valMsg);
                if(valMsg === true){
                    $scope.showDbErrors = true;
                    $scope.isValidSA = valMsg;
                    $scope.sAerror = "Sum Assured not in range!!";
                    $scope.data.ePCategory = "";


                }else{
                    $scope.showDbErrors = false;
                    $scope.sAerror = "";
                    $scope.isValidSA = false;
                    $scope.ePCategoryOptn = false;
                    if(valMsg[0].Value == 'PRAGGREGATE'){
                        $scope.data.ePCategory = $scope.categories[2].name;
                        $scope.ePCategoryOptn = true;
                    }else{
                        $scope.data.ePCategory = "";
                        $scope.ePCategoryOptn = false;
                    }


                }

            });
        };




        $scope.validateBaseProduct = function(data){
         ePValidationService.validateBaseProduct(prodId, channelId, data)
         .then(function(messages){
          $scope.dbError = "";
            $log.debug("final",messages);
            if(messages.length == 0){
              $scope.showDbErrors = false;
              $scope.dbError = "";
             $scope.calculateEPPremium(prodId, channelId, data);
                       }else{
                           var error = [];
            $scope.showDbErrors = true;
            for (var j = 0; j < messages.length; j++){

                    if(messages[j].ErrorMessage!== undefined)
                error.push(messages[j].ErrorMessage);

            }
            $scope.dbErrors = error;

                       }
        });

      };



       $scope.copyTerm = function(){
          $scope.data.riderterm = angular.copy($scope.data.ppt);
          $scope.data.sumAssuredForEADBRiders = angular.copy($scope.data.sumAssured);
         };

       /*function will calculate BI & Base for this product*/
      $scope.calculateEPPremium = function(prodId, channelId, data){
        $log.debug('calculateEPPremium');
        var answer  = ePCalculationService.calculateEPTotalPremium(prodId, channelId, data);
            $log.debug('data.basePremium',data);
                answer.then(function(basePremiumResult){
                    $log.debug(':premi:',basePremiumResult);
                    $scope.answer = basePremiumResult;

                    if($scope.answer){
                        if(data.eADBRider){
                            docalculateEAdbPremium(prodId, channelId, data);
                        }
                        if(data.hospiCash){
                            docalculateHospiCashPremium(prodId, channelId, data, data.basePremium);
                        }

                    }
                });

            $scope.showOutput = true;
            $scope.biOutput = true;


      };

      $scope.eAdbData = false;

      function docalculateEAdbPremium(prodId, channelId, data){

      var eAdbInput = eAdbRiderDataFromUserSvc.setEADBRiderData(data);

      if(data.eADBRider){
          var eAdbData = calculateEAdbRiderPremiumSvc.calculateEABDRiderPremium(eAdbRiderId, prodId, channelId,data);
            eAdbData.then(function(eAdbData){
                  if(eAdbData.annualAdbRiderPremium == 0){
                  $scope.eAdbData = false;
                  $scope.showDbErrors = true;
                  $scope.dbErrors = "30% Base premium is less than rider";
                   $scope.adbPremiumOutput = false;
                    }else{
                  $scope.eAdbData = eAdbData;
                  $log.debug('adbData',$scope.eAdbData);
                  $scope.adbPremiumOutput = true;
                }
            });
        }
      }

        $scope.hospicashOutput = false;
       function docalculateHospiCashPremium(prodId, channelId, data,basePremium){
            var hospiInput = hospiCashRiderDataFromUserSvc.setHospiCashData(data);
            var hospiCashData = calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospicashId, prodId, channelId,basePremium);
            hospiCashData.then( function(hospiCashDataVal) {
              if(hospiCashDataVal.annualHospiCashPremium == 0){
              $scope.hospicashOutput = false;
              $scope.hospiCashData = {};
              $scope.showDbErrors = true;
              $scope.dbErrors = "30% Base premium is less than rider";
            }else{
                $scope.hospiCashData = hospiCashDataVal;
                $scope.hospicashOutput = true;
              }
            });

        }



    }
  ]
);
