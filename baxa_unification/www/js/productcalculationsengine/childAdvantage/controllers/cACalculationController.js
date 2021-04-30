/**
* Created By: Anushree
* Child Advantage Calculation Service
*
* @class esCalculationController
* @submodule core-controller
* @constructor
*/
productCalculator.controller(
  'cACalculationController',
  [
    '$scope',
    '$log',
    'cACalculationService',
    'cADataFromDBSvc',
    'cAValidationService',
    'adbRiderForASDataFromUserSvc',
    'calculateAdbRiderPremiumSvc',
    'hospiCashRiderDataFromUserSvc',
    'calculatehospiCashRiderPremiumSvc',
    'commonDbProductCalculation',
    'getSetCommonDataService',

    function($scope, $log, cACalculationService, cADataFromDBSvc, cAValidationService,adbRiderForASDataFromUserSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, commonDbProductCalculation, getSetCommonDataService){
        'use strict';


        $scope.cABasePremiumOutput = false;
        $scope.cABIOutput = false;
        $scope.showDbErrors = false;
        $scope.dbErrors = false;
        $scope.showOutput = false;
        $scope.biOutput = false;
        $scope.hospicashOutput = false;
        $scope.adbPremiumOutput = false;
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
        var prodId = 14;
        var channelId = 1;
        var adbRiderId = 4;
        var hospicashId = 5;
        $log.debug('prodId',prodId);
            $log.debug('channelId',channelId);
        /*Temporary data for User Input*/
        $scope.data = {
            laName: "ABC",
            laAge: 47,
            laGender: 0,
            isSelf: true,
            proposerName: "ABC",
            proposerAge: 47,
            proposerGender: 0,
            sumAssured: 500000,
            basePremium: 146888,
            ppt: 11,
            pt: 11,
            NSAPForLA: false,
            premiumMode: 1
                };


        /*Set dropdown of premium payment term*/
        $scope.getPt= function(prodId, channelId){
            commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'PT').then(function(val){
                $log.debug('PT', val);
                 $scope.pts = val;

            });

        };

        $scope.getPt(prodId, channelId);

          /*Based on premium payment term set premium term*/
        $scope.populatePT = function(pt, benfitType){
             $log.debug('benfitType',benfitType);
             cADataFromDBSvc.populatePT(prodId, channelId, pt, benfitType).then(function(val){
                 $scope.data.ppt = val;
             });

        };
        $scope.resetPPT = function(){
            $scope.data.ppt = "";
            $scope.data.pt = "";
        };
        $scope.getAllGenders = function(prodId, channelId){
            commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'GENDER').then(function(val){
                $log.debug('genders', val);
                $scope.genders = val;

            });
        };
        $scope.getAllGenders(prodId, channelId);

        $scope.getAllPmodes = function(prodId, channelId){
            commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'PMODE').then(function(val){
                $log.debug('pModes', val);
                $scope.pModes = val;

            });
        };
        $scope.getAllPmodes(prodId, channelId);

        $scope.getAllHcbSA = function(hospicashId, channelId){
            commonDbProductCalculation.getAllStaticValuesByName(hospicashId, channelId, 'DHCB').then(function(val){
                $log.debug('hCSA', val);
                $scope.hCSA = val;

            });
        };
        $scope.getAllHcbSA(hospicashId, channelId);

        $scope.populateMaturityOption = function(prodId, channelId){
            commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'MATURITYOPTION').then(function(val){
                $log.debug('mOptns', val);
                $scope.mOptns = val;

            });
        };
        $scope.populateMaturityOption(prodId, channelId);

        $scope.populateBenfitOption = function(prodId, channelId){
            commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'BENEFITTYPE').then(function(val){
                $log.debug('bOptns', val);
                $scope.bOptns = val;

            });
        };

        /*Based on base premium entered set sumassured value*/
        $scope.populateSumAssured = function(data) {
            $log.debug("data",data);
            if(data.basePremium !== undefined){
                cACalculationService.calcCASumAssured(prodId, channelId, data).then(function (val) {
                    $log.debug("pop", val);
                    $scope.data.sumAssured = val;
                });
            }
        };
     /*Based on sumassured entered set base premium value*/
        $scope.populateBasePremium =function(data){
            if(data.sumAssured !== undefined){
                cACalculationService.calcCABasePremium(prodId, channelId, data).then(function (val) {
                    $log.debug("calcsSSumAssured", val);
                    $scope.data.basePremium = val;
                   });
               }
        };

        $scope.populateBenfitOption(prodId, channelId);

        $scope.validateBaseProduct = function(data){
         cAValidationService.validateBaseProduct(prodId, channelId, data).then(function(messages){
          $scope.dbError = "";
            $log.debug("final",messages);
            if(messages.length == 0){
                $scope.showDbErrors = false;
                $scope.dbError = "";
                $scope.calculateCAPremium(prodId, channelId, data);
            }else{
                $scope.showDbErrors = true;
                $scope.dbErrors = messages;

                }
         });

      };



       $scope.copyTerm = function(){
          $scope.data.riderterm = angular.copy($scope.data.ppt);
          $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
         };

        $scope.getBenfitOptionByAge = function(laAge){

            if(laAge >50){

                $log.debug("50", $scope.bOptns);
            }else{
                $log.debug("505", $scope.bOptns);
            }

        };
       /*function will calculate BI & Base for this product*/
      $scope.calculateCAPremium = function(prodId, channelId, data){
          $scope.hospicashOutput = false;
          $scope.adbPremiumOutput = false;
          $scope.showOutput = false;
          $scope.biOutput = false;
        $log.debug('calculateEAPremium');
       var answer  = cACalculationService.calculateCATotalPremium(prodId, channelId, data);
         $log.debug('data.basePremium',data);
          answer.then(function(basePremiumResult){
              $log.debug(':premi:',basePremiumResult);
              $scope.answer = basePremiumResult;
              var BI = basePremiumResult.bi;
              BI.then(function(res){
              // $log.debug('B::I');
               $scope.BIData = res;
               $log.debug("==Bi",$scope.BIData);
             });
              if($scope.answer){
               if(data.ADBRider){
                docalculateAdbPremium(prodId, channelId, data);
               }
              if(data.hospiCash){
                 docalculateHospiCashPremium(prodId, channelId, data, data.basePremium);
               }

            }
            });

            $scope.showOutput = true;
            $scope.biOutput = true;


      };

      $scope.adbData = false;
      $scope.adbPremiumOutput = false;
      function docalculateAdbPremium(prodId, channelId, data){

      var adbInput = adbRiderForASDataFromUserSvc.setADBRiderData(data);

      if(data.ADBRider){
          $log.debug('adbData',data.ADBRider);
          var adbData = calculateAdbRiderPremiumSvc.calculateABDRiderPremium(adbRiderId, prodId, channelId, data);
            adbData.then(function(adbData){
                $log.debug('adbData',adbData);
                  if(adbData.annualAdbRiderPremium == 0){
                  $scope.adbData = false;
                  $scope.adbPremiumOutput = false;
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



    }
  ]
);
