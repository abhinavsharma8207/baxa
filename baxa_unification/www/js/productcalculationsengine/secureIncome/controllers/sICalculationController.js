/**
* Created By: Anushree K
* Secure Income Calculation Controller
*
* @class sICalculationController
* @submodule core-controller
* @constructor
*/
productCalculator.controller(
   'sICalculationController',[
    '$scope',
    '$state',
    '$log',
    'sIDataService',
    'sICalculationService',
    'sIValidationService',
    'adbRiderForASDataFromUserSvc',
    'calculateAdbRiderPremiumSvc',
    'hospiCashRiderDataFromUserSvc',
    'calculatehospiCashRiderPremiumSvc',
    'calculatePwrRiderPremiumSvc',
    'pwrRiderDataFromUserSvc',
    '$http',
    'getSetCommonDataService',
    'commonFormulaSvc',
     function($scope, $state, $log, sIDataService, sICalculationService, sIValidationService, adbRiderForASDataFromUserSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, calculatePwrRiderPremiumSvc, pwrRiderDataFromUserSvc, $http,getSetCommonDataService,commonFormulaSvc){
         'use strict';
         var sICntrlObj = $scope;
         /* set data dynamically */
         var prodData = getSetCommonDataService.getCurrentProdData();
         $log.debug('prodData',prodData);
         var commonData = getSetCommonDataService.getCommonData();
         $log.debug('commonData',commonData);

         /*For Now kept it commented as in web mode page gets refreshed
         & increase testing time*/
         /* var prodId = prodData.prodId;
         // var channelId = commonData.channelId;
         // var adbRiderId = prodData.adbRiderId;
         // var hospicashId = prodData.hospicashId;*/

        /** Define Functions**/
        sICntrlObj.calculateSIPremium = calculateSIPremium;
        sICntrlObj.populateBasePremium = populateBasePremium;
        sICntrlObj.populatePPT = populatePPT;
        sICntrlObj.populateSumAssured = populateSumAssured;
        sICntrlObj.dbValidation = dbValidation;
        sICntrlObj.data = {};
        sICntrlObj.pts = [15,17,20];
        sICntrlObj.validData = [];
        $scope.errorMessages = [];
        var prodId = 9;
        var channelId = 1;
        var adbRiderId = 4;
        var hospicashId = 5;
        /*Get validation messgae through json file.*/
        $http.get('js/secureIncome/controllers/validationMessage.json').then(function(responce){
          $scope.validationMessage = responce;
        });

        $scope.calculate = function(){
            $state.go('sIncomeEstimated');
        };

         $scope.copyTerm = function(){
          $scope.data.riderterm = angular.copy($scope.data.ppt);
          $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
         };
       //TODO:Uncomment the code once all validation from Db done
     /*
        This function will validate the fields useing database credentials.
     */
        function dbValidation(data){
          sIValidationService.validateBaseProduct(prodId, channelId, data)
          .then(function(messages){
                $scope.dbError = "";
                $scope.errorMessages=messages;
                $log.debug("final",messages);
                if(messages.length == 0){
                        $scope.showDbErrors=false;
                        $scope.dbError = "";
                       $scope.calculateSIPremium(prodId, channelId, data);
                }
                else{
                $scope.showDbErrors = true;
                $scope.dbErrors = messages[0];
                }
              });
        }

        function getPt(data){
          switch(data.ppt){
            case "5":return 'TNPE05';
            case "7":return 'TNPE07';
            case "10":return 'TNPE10';
          }
      }

      function getPremiumMode(data){
          switch(data.premiumMode){
            case "1":return 3;
            case "2":return 4;
            case "4":return 5;
            case "12":return 6;
          }
      }

      /*function will calculate BI & Base for this product*/
      function calculateSIPremium(prodId, channelId, data){
        var answer = sICalculationService.calculateTotalPremium(prodId, channelId, data);
                    $log.debug('data.basePremium',data);
                      answer.then(function(basePremiumResult){
                         $log.debug(':premi:',basePremiumResult);
                         var BI = basePremiumResult.BIVal;
                         BI.then(function(res){
                         sICntrlObj.BIData = res;
                         });
                         var guaranteedVals = basePremiumResult.gVals;
                         guaranteedVals.then(function(res){
                          sICntrlObj.gVals = res;
                         });
                        sICntrlObj.answer = basePremiumResult;
                        if(sICntrlObj.answer){
                           if(data.ADBRider){
                            docalculateAdbPremium(prodId, channelId, data);
                           }
                          if(data.hospiCash){
                             docalculateHospiCashPremium(prodId, channelId, data, data.basePremium);
                           }
                          if(data.PWRI || data.PWRII){
                            if(data.PWRI)
                              docalculatePWRPremium(prodId, channelId, data, 1);
                            if(data.PWRII)
                              docalculatePWRPremium(prodId, channelId, data, 2);
                          }
                        }
                        });
                     $scope.biOutput = true;
                     $scope.showOutput = true;
      }


      function populateBasePremium(sumAssured,ppt,laAge){
        if(sumAssured !== undefined){
          sICalculationService.calcBasePremium(prodId, channelId, sumAssured, ppt, laAge).then(function(val){
              $log.debug("hereBP");
            sICntrlObj.data.basePremium = commonFormulaSvc.round(val,0);
          });
        }
      }

      function populatePPT(pt){
        $log.debug('ppt',pt);
        sIDataService.getpremiumPaymentTerm(prodId, channelId, pt).then(function(val){
          sICntrlObj.data.ppt = val;
        });
      }

      function populateSumAssured(basePremium, ppt, laAge){
        if(basePremium !== undefined){
          sICalculationService.calcSumAssured(prodId, channelId, basePremium, ppt, laAge).then(function(val){
              $log.debug("hereSA");
            sICntrlObj.data.sumAssured = commonFormulaSvc.round(val,0);
        });
       }
      }


      $scope.adbData = false;

      function docalculateAdbPremium(prodId, channelId, data){

      var adbInput = adbRiderForASDataFromUserSvc.setADBRiderData(data);

      if(data.ADBRider){
          var adbData = calculateAdbRiderPremiumSvc.calculateABDRiderPremium(adbRiderId, prodId, channelId, data.basePremium);
            adbData.then(function(adbData){
                  if(adbData.annualAdbRiderPremium == 0){
                  $scope.adbData = false;
                  $scope.showDbErrors = true;
                  $scope.dbErrors = "30% Base premium is less than rider";
                    }else{
                  $scope.adbData = adbData;
                  $log.debug('adbData',$scope.adbData);
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

      $scope.pwrOutput=false;
      function docalculatePWRPremium(prodId, channelId, data,option){
        $log.debug('docalculatePWRPremium',data);
        var pwrInput = pwrRiderDataFromUserSvc.setPWRRiderData(data);

        if(parseInt(option) === 1){
          var pwrData1 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, data, option);
          pwrData1.then(function(riderVal){
            if(riderVal.annualPwrPremium == 0){
              $scope.pwrOutputOption1 = false;
              $scope.showDbErrors = true;
              $scope.dbErrors = "30% Base premium is less than rider";
            }else{
              $scope.pwrData1 = riderVal;
              $log.debug('$scope.pwrData1',$scope.pwrData1);
              $scope.pwrOutputOption1 = true;
          }
          });

        }
         if(parseInt(option) === 2){
          var pwrData2 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, data, option);
          pwrData2.then(function(riderVal){
              if(riderVal.annualPwrPremium == 0){
                $scope.pwrOutputOption2 = false;
                $scope.showDbErrors = true;
                $scope.dbErrors = "30% Base premium is less than rider";
              }else{
                $scope.pwrData2 = riderVal;
                $log.debug('$scope.pwrData2',$scope.pwrData2);
                $scope.pwrOutputOption2 = true;
            }
          });
        }
}
    }]);
