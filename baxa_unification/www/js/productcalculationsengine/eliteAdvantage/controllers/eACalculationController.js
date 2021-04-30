/**
* Created By: Anushree
* Elite Advantage Calculation Service
*
* @class esCalculationController
* @submodule core-controller
* @constructor
*/
productCalculator.controller(
  'eACalculationController',
  [
    '$scope',
    '$log',
    'eACalculationService',
    'eADataFromDBSvc',
    'eAValidationService',
    'adbRiderForASDataFromUserSvc',
    'calculateAdbRiderPremiumSvc',
    'hospiCashRiderDataFromUserSvc',
    'calculatehospiCashRiderPremiumSvc',
    'pwrRiderDataFromUserSvc',
    'calculatePwrRiderPremiumSvc',
    'commonDbProductCalculation',
    'getSetCommonDataService',
    function($scope, $log, eACalculationService, eADataFromDBSvc, eAValidationService, adbRiderForASDataFromUserSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, pwrRiderDataFromUserSvc, calculatePwrRiderPremiumSvc, commonDbProductCalculation, getSetCommonDataService){
        'use strict';

        $scope.eABasePremiumOutput = false;
        $scope.eABIOutput = false;
        $scope.showDbErrors = false;
        $scope.dbErrors = false;
        $scope.showOutput=false;
        $scope.biOutput=false;

        /*Temprory product code it will be dynamic once new flow is implemented*/
        var prodData = getSetCommonDataService.getCurrentProdData();
        $log.debug('prodData',prodData);
        var commonData = getSetCommonDataService.getCommonData();
        $log.debug('commonData',commonData);
        var prodId = prodData.prodId;
        var channelId = commonData.channelId;
        var adbRiderId = 4;/*prodData.adbRiderId;*/
        var hospicashId = 5; /*prodData.hospicashId;*/


        /*Temporary data for User Input*/
        $scope.data = {
            laName: "ABC",
            laAge: 35,
            laGender: 0,
            isSelf: true,
            proposerName: "ABC",
            proposerAge: 35,
            proposerGender: 0,
            sumAssured: 700000,
            basePremium: 146888,
            ppt: 5,
            pt: 10,
            NSAPForLA: true,
            premiumMode: 1,
            maturityPayoutPeriod: 10,
            maturityPremiumMode:1
                };

        /*Set dropdown of premium payment term*/
        $scope.getPpt= function(prodId, channelId){
            var ppt = eADataFromDBSvc.getAlleAPremiumPaymentTerm(prodId, channelId);
                ppt.then(function(val){
                    $log.debug("val",val);
                    $scope.ppts = val;
                });
        };
        $scope.getPpt(prodId, channelId);
          /*Based on premium payment term set premium term*/
        $scope.populatePT = function(ppt){
            $log.debug('pt',ppt);
            eADataFromDBSvc.getEAPaymentTerm(prodId, channelId, ppt).then(function(val){
                eADataFromDBSvc.getMaturityPeriod(prodId, channelId, val).then(function(mp){
                     $scope.data.mp = mp;
                });
             $scope.data.pt = val;
            });

        };

        $scope.getAllGenders = function(prodId, channelId){
            commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'GENDER').then(function(val){
                $log.debug('genders', val);
                $scope.genders = val;

            });
        };
        $scope.getAllGenders(prodId, channelId);

        $scope.getAllHcbSA = function(hospicashId, channelId){
            commonDbProductCalculation.getAllStaticValuesByName(hospicashId, channelId, 'DHCB').then(function(val){
                $log.debug('hCSA', val);
                $scope.hCSA = val;

            });
        };
        $scope.getAllHcbSA(hospicashId, channelId);

        $scope.getPremiumMode = function(prodId, channelId){
            commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'PMODE').then(function(val){
                $log.debug('pmode', val);
                $scope.pModes = val;

            });
        };
        $scope.getPremiumMode(prodId, channelId);

        $scope.getMaturityMode = function(prodId, channelId){
            commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'MPF').then(function(val){
                $log.debug('mModes', val);
                $scope.mModes = val;

            });
        };
        $scope.getMaturityMode(prodId, channelId);


        $scope.validateBaseProduct = function(data){
         eAValidationService.validateBaseProduct(prodId, channelId, data).then(function(messages){
          $scope.dbError = "";
            $log.debug("final",messages);
            if(messages.length == 0){
                $scope.showDbErrors = false;
                $scope.dbError = "";
                $scope.calculateEAPremium(prodId, channelId, data);
            }else{
                $scope.showDbErrors = true;
                $scope.dbErrors = messages[0];
            }
         });

      };

         /*Based on base premium entered set sumassured value*/
        $scope.populateSumAssured = function(basePremium,ppt,laGender,laAge){
            if(basePremium !== undefined){
                eACalculationService.calcEASumAssured(prodId, channelId, basePremium, ppt, laGender, laAge).then(function(val){
                    $scope.data.sumAssured = val;
                });
            }
        };

        /*Based on sumassured entered set base premium value*/
        $scope.populateBasePremium = function(sumAssured,ppt,laGender,laAge){
            if(sumAssured !== undefined){
                eACalculationService.calcEABasePremium(prodId, channelId, sumAssured, ppt, laGender, laAge).then(function(val){
                    $scope.data.basePremium = val;
                });
            }
        };

       $scope.copyTerm = function(){
          $scope.data.riderterm = angular.copy($scope.data.ppt);
          $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
         };

        /*function will calculate BI & Base for this product*/
        $scope.calculateEAPremium = function(prodId, channelId, data){
            $scope.eABasePremiumOutput = false;
            $scope.eABIOutput = false;
            $scope.showDbErrors = false;
            $scope.dbErrors = false;
            $scope.showOutput = false;
            $scope.biOutput = false;
            $scope.hospicashOutput = false;
            $scope.adbData = false;
            $scope.pwrOutput = false;
            $scope.pwrOutputOption1 = false;
            $scope.pwrOutputOption2 = false;

            $log.debug('calculateEAPremium');
            var answer  = eACalculationService.calculateEATotalPremium(prodId, channelId, data);
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
                        if(data.ADBRider){
                            docalculateAdbPremium(prodId, channelId, data);
                        }
                        if(data.hospiCash){
                            docalculateHospiCashPremium(prodId, channelId, data, data.basePremium);
                        }
                        if(data.PWRI || data.PWRII){
                            if(data.PWRI)
                                docalculatePWRPremium(prodId, channelId, data, 1);
                            if(data.PWRII){
                                docalculatePWRPremium(prodId, channelId, data, 2);
                                $scope.pwrOutputOption2 = true;
                            }

                        }
                    }
                });

                $scope.showOutput = true;
                $scope.biOutput = true;


            };

            $scope.adbData = false;

            function docalculateAdbPremium(prodId, channelId, data){

                var adbInput = adbRiderForASDataFromUserSvc.setADBRiderData(data);

                if(data.ADBRider){
                    var adbData = calculateAdbRiderPremiumSvc.calculateABDRiderPremium(adbRiderId, prodId, channelId, data);
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

        }
    ]
);
