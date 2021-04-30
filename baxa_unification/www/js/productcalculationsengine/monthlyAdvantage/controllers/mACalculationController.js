/**
* Created By: Anushree
* Monthly Advantage Calculation Service
*
* @class mACalculationController
* @submodule core-controller
* @constructor
*/
productCalculator.controller(
  'mACalculationController',
  [
    '$scope',
    '$log',
    'mACalculationService',
    'mADataFromDBSvc',
    'adbRiderForASDataFromUserSvc',
    'calculateAdbRiderPremiumSvc',
    'hospiCashRiderDataFromUserSvc',
    'calculatehospiCashRiderPremiumSvc',
    'commonDbProductCalculation',
    'getSetCommonDataService',
    'commonFormulaSvc',
    'mAValidationService',

    function($scope, $log, mACalculationService, mADataFromDBSvc,  adbRiderForASDataFromUserSvc, calculateAdbRiderPremiumSvc, hospiCashRiderDataFromUserSvc, calculatehospiCashRiderPremiumSvc, commonDbProductCalculation, getSetCommonDataService, commonFormulaSvc, mAValidationService){
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
        var prodId = 15;
        var channelId = 1;
        var adbRiderId = 4;
        var hospicashId = 5;

        $log.debug('prodId',prodId);
        $log.debug('channelId',channelId);
        /*show output false*/
        $scope.adbPremiumOutput = false;
        $scope.showOutput = false;
        $scope.biOutput = false;
        $scope.hospicashOutput = false;

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
            ppt: 8,
            pt: 16,
            NSAPForLA: false,
            premiumMode: 2
                };

                var staticVal = mACalculationService.getInputValues(prodId, channelId);
                staticVal.then(function(staticVal){
                    $scope.genders = staticVal.GENDER;
                    $scope.pModes = staticVal.PMODE;
                    $scope.pts = staticVal.PT;
                });

          /*Based on premium payment term set premium term*/
        $scope.populatePPT = function(pt){

             mADataFromDBSvc.populatePPT(prodId, channelId, pt)
                .then(function(val){
                    $scope.data.ppt = val;
                    mADataFromDBSvc.populateMIBPERIOD(prodId, channelId, val)
                       .then(function(MIBP){
                           $scope.data.MIBP = MIBP;

                    });
             });

        };

        /*Based on base premium entered set sumassured value*/
        $scope.populateSumAssured = function(data) {
            $log.debug("data",data);
            if(data.basePremium !== undefined){
                mACalculationService.calcMASumAssured(prodId, channelId, data)
                    .then(function (val) {
                        $log.debug("pop", val);
                        $scope.data.sumAssured = commonFormulaSvc.round(val,0);
                        $scope.data.sumAssuredToShow = val;
                });
            }
        };
     /*Based on sumassured entered set base premium value*/
        $scope.populateBasePremium =function(data){
            if(data.sumAssured !== undefined){
                mACalculationService.calcMABasePremium(prodId, channelId, data)
                    .then(function (val) {
                        $log.debug("calcsSSumAssured", val);
                        $scope.data.basePremium = val;
                        $scope.data.sumAssuredToShow = data.sumAssured;
                    });
                }
            };



        $scope.validateBaseProduct = function(data){
         mAValidationService.validateBaseProduct(prodId, channelId, data).then(function(messages){
          $scope.dbError = "";
            $log.debug("final",messages);
            if(messages.length == 0){
              $scope.showDbErrors = false;
              $scope.dbError = "";
             $scope.calculateMAPremium(prodId, channelId, data);
                       }else{
            $scope.showDbErrors = true;
            $scope.dbErrors = messages[0];

                       }
         });

      };



       $scope.copyTerm = function(){
          $scope.data.riderterm = angular.copy($scope.data.ppt);
          $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
         };

       /*function will calculate BI & Base for this product*/
      $scope.calculateMAPremium = function(prodId, channelId, data){
        $log.debug('calculateMAPremium');
        var answer  = mACalculationService.calculateMATotalPremium(prodId, channelId, data);
            $log.debug('data.basePremium',data);
                answer.then(function(basePremiumResult){
                    $log.debug(':premi:',basePremiumResult);
                    $scope.answer = basePremiumResult;
                    var BI = basePremiumResult.bi;
                    BI.then(function(res){
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

      function docalculateAdbPremium(prodId, channelId, data){

      var adbInput = adbRiderForASDataFromUserSvc.setADBRiderData(data);

      if(data.ADBRider){
          var adbData = calculateAdbRiderPremiumSvc.calculateABDRiderPremium(adbRiderId, prodId, channelId, data);
            adbData.then(function(adbData){
                  if(adbData.annualAdbRiderPremium == 0){
                  $scope.adbData = false;
                  $scope.showDbErrors = true;
                  $scope.dbErrors = "30% Base premium is less than rider";
                   $scope.adbPremiumOutput = false;
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
