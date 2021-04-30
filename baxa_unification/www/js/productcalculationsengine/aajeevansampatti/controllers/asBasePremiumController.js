productCalculator.controller('as.calculatePremiumCntrl',
  [
    '$scope',
    '$log',
    '$rootScope',
    'calculatePremiumSvc',
    'calculateAdbRiderPremiumSvc',
    'calculatehospiCashRiderPremiumSvc',
    'calculatePwrRiderPremiumSvc',
    'calculateBISvc',
    'adbRiderForASDataFromUserSvc' ,
    'hospiCashRiderDataFromUserSvc',
    'pwrRiderDataFromUserSvc',
    'commonDBFuncSvc',
    'getSetCommonDataService',
    'asValidationService',
	function($scope, $log, $rootScope, calculatePremiumSvc, calculateAdbRiderPremiumSvc, calculatehospiCashRiderPremiumSvc, calculatePwrRiderPremiumSvc, calculateBISvc, adbRiderForASDataFromUserSvc, hospiCashRiderDataFromUserSvc, pwrRiderDataFromUserSvc, commonDBFuncSvc, getSetCommonDataService,asValidationService) {
        'use strict';

      $scope.showOutput=false;
      $scope.data = {};

      /*Temprory product code it will be dynamic once new flow is implemented*/



      var prodData = getSetCommonDataService.getCurrentProdData();
      $log.debug('prodData',prodData);
      var commonData = getSetCommonDataService.getCommonData();
      $log.debug('commonData',commonData);


      /* var prodId = prodData.prodId;
      // var channelId = commonData.channelId;
      // var adbRiderId = prodData.adbRiderId;
      // var hospicashId = prodData.hospicashId;*/
      var prodId = 1;
      var channelId = 1;
      var adbRiderId = 4;
      var hospicashId = 5;

      $scope.data = {
          laName: "ABC",
          laAge: 25,
          laGender: 0,
          isSelf: true,
          proposerName: "ABC",
          proposerAge: 25,
          proposerGender: 0,
          sumAssured: 700000,
          basePremium: 146888,
          ppt: 11,
          NSAPForLA: false,
          premiumMode: 1
        };

            var staticVal = calculatePremiumSvc.getInputValues(prodId, channelId);
            staticVal.then(function(staticVal){
                  $scope.genders = staticVal.GENDER;
                  $scope.pModes = staticVal.PMODE;
                  $scope.pPts = staticVal.PPT;
                  $scope.upToAges = staticVal.UPTOAGE;
            });

            $scope.validateBaseProduct = function(data){
               asValidationService.validateBaseProduct(prodId, channelId, data).then(function(messages){
                $scope.dbError = "";
                  $log.debug("final",messages);
                  if(messages.length == 0){
                      $scope.showDbErrors = false;
                      $scope.dbError = "";
                      $scope.docalculatePremium(prodId, channelId, data);
                  }else{
                      $scope.showDbErrors = true;
                      $scope.dbErrors = messages;

                      }
               });

            };


            $scope.docalculatePremium = function(prodId, channelId, data) {
              $rootScope.userFormData = data;
              var answer  = calculatePremiumSvc.calculateTotalPremium(prodId, channelId, data);
               answer.then(function(basePremiumResult){
                  $log.debug('premi',basePremiumResult.bIValue);
                  var BI = basePremiumResult.bIValue;
                  BI.then(function(res){
                    $log.debug('B::I');
                    $scope.BIData = res;
                    $log.debug($scope.BIData);
                  });
                   $scope.answer = basePremiumResult;
                 });
              $scope.biOutput = true;
              $scope.showOutput = true;
            };

            $scope.calculateSum = function(gp,benfitAgeSelected){
                var sumA = calculatePremiumSvc.calculateSum(prodId, channelId, gp, benfitAgeSelected);
                sumA.then(function(sumAssuredval){
                  $scope.data.sumAssured = sumAssuredval;
                });
            };

            $scope.calculateGp = function(sum,benfitAgeSelected){
               var gp = calculatePremiumSvc.calculateGp(prodId, channelId, sum, benfitAgeSelected);
                gp.then(function(gpval){
                  $scope.data.gp = gpval;
                });
            };

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

                $scope.pwrOutput = false;
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

                $scope.biOutput=false;
                $scope.docalculateBI = function(benfitAgeSelected,
                                                  laAge,
                                                  basePremium,
                                                  sumAssured,
                                                  ppt){

                $scope.BIData = calculateBISvc.getBIvalues(benfitAgeSelected,
                                                  laAge,
                                                  basePremium,
                                                  sumAssured,
                                                  ppt);
                $scope.biOutput=true;
                };

   }]);
