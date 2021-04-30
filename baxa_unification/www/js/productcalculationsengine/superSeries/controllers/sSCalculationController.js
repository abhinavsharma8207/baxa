/**
* Created By: Anushree
* Secure Income Calculation Service
*
* @class sSCalculationController
* @submodule core-controller
* @constructor
*/
productCalculator.controller(
    'sSCalculationController',
    [
        '$scope',
        '$log',
        'sSCalculationService',
        'sSDataFromDBSvc',
        'sSValidationService',
        'hospiCashRiderDataFromUserSvc',
        'calculatehospiCashRiderPremiumSvc',
        'pwrRiderDataFromUserSvc',
        'calculatePwrRiderPremiumSvc',
        'getSetCommonDataService',
        function ($scope, $log, sSCalculationService, sSDataFromDBSvc, sSValidationService, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, pwrRiderDataFromUserSvc, calculatePwrRiderPremiumSvc,getSetCommonDataService) {
            'use strict';
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
            $scope.sSBasePremiumOutput = false;
            $scope.sSBIOutput = false;
            $scope.showDbErrors = false;
            $scope.dbErrors = false;
            $scope.showOutput = false;
            $scope.biOutput = false;

            var prodId = 13;
            var channelId = 1;
            var adbRiderId = 4;
            var hospicashId = 5;
            var pwrI = 6;
            var pwrIIId = 7;

            /*Temporary data for User Input*/
            $scope.data = {
                laName : "ABC",
                laAge : 30,
                laGender : 1,
                isSelf : true,
                proposerName: "ABC",
                proposerAge: 30,
                proposerGender: 1,
                sumAssured: 207022,
                basePremium: 50000,
                ppt: 10,
                pt: 20,
                NSAPForLA: true,
                premiumMode: 4,
                isBP: false,
                isSA: false

            };

        /*Set dropdown of premium payment term*/
            $scope.getPt = function() {
                var ppt = sSDataFromDBSvc.getAllsSPaymentTerm(prodId, channelId);
                ppt.then (function (val) {
                    $log.debug("val", val);
                $scope.pts = val;
           });
   };
        $scope.getPt (prodId, channelId);
          /*Based on premium payment term set premium term*/
        $scope.populatePPT = function (pt) {
            $log.debug('pt', pt);
            sSDataFromDBSvc.getsSPaymentTerm(prodId, channelId, pt).then(function (val) {
             $scope.data.ppt = val;
            });

        };


        $scope.validateBaseProduct = function(data) {


          sSValidationService.validateBaseProduct(prodId, channelId, data)
          .then(function(messages){
          $scope.dbError="";
            $log.debug("final",messages);
            if(messages.length == 0){
              $scope.showDbErrors=false;
              $scope.dbError = "";
              $scope.calculateSsPremium(prodId, channelId, data);
                      }else{
                          $scope.showDbErrors = true;
                          $scope.dbErrors = messages;

                       }
          });

      };

         /*Based on base premium entered set sumassured value*/
      $scope.populateSumAssured = function(basePremium, ppt, laGender, laAge, isBp) {
        if(basePremium !== undefined){
          sSCalculationService.calcsSSumAssured(prodId, channelId, basePremium, ppt,laGender,laAge, isBp)
          .then(function (val) {
            $log.debug("pop", val);
            $scope.data.sumAssured = val;
        });
      }
      };
      /*Based on sumassured entered set base premium value*/
      $scope.populateBasePremium =function(sumAssured,ppt,laGender,laAge,isBp){
        if(sumAssured !== undefined){
          sSCalculationService.calcsSBasePremium(prodId, channelId, sumAssured, ppt, laGender, parseInt(laAge), isBp)
          .then(function (val) {
                        $log.debug("calcsSSumAssured", val);
                        $scope.data.basePremium = val;
                    });
                }
            };

            $scope.copyTerm = function () {
                $scope.data.riderterm = angular.copy($scope.data.ppt);
                $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
            };

       /*function will calculate BI & Base for this product*/
            $scope.calculateSsPremium=function(prodId, channelId, data){
                $log.debug('calculateSsPremium');
                $scope.sSBasePremiumOutput = false;
                $scope.sSBIOutput = false;
                $scope.showDbErrors = false;
                $scope.dbErrors = false;
                $scope.showOutput = false;
                $scope.biOutput = false;
                $scope.pwrOutputOption1 = false;
                $scope.pwrOutputOption2 = false;
                var answer  = sSCalculationService.calculateSsTotalPremium(prodId, channelId, data);
                $log.debug('data.basePremium',data);
                answer.then(function(basePremiumResult){
                    $log.debug(':premi:',basePremiumResult);
                    $scope.answer = basePremiumResult;
                    var BI = basePremiumResult.bi;
                        BI.then(function(res){
                                // $log.debug('B::I');
                                    $scope.BIData = res;
                                    $log.debug("==",$scope.BIData);
                                });
                                if($scope.answer){

                                    if(data.hospiCash){
                                        docalculateHospiCashPremium(prodId, channelId, data,data.basePremium);
                                    }
                                  if(data.PWRI || data.PWRII){
                                    if(data.PWRI)
                                      docalculatePWRPremium(prodId, channelId, data, 1);
                                    if(data.PWRII){
                                      docalculatePWRPremium(prodId, channelId, data, 2);
                                      $scope.pwrOutputOption2=true;
                                    }

                                }
                            }
                        });

            $scope.showOutput=true;
            $scope.biOutput=true;


      };



       function docalculateHospiCashPremium(prodId, channelId, data,basePremium){
            var hospiInput= hospiCashRiderDataFromUserSvc.setHospiCashData(data);
            var hospiCashData = calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospicashId, prodId, channelId, basePremium);
            hospiCashData.then(function(hospiCashDataVal){
                $scope.hospiCashData = hospiCashDataVal;
            });
            $scope.hospicashOutput=true;
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

    }
  ]
);
