/**
* Created By: Atul A
* Samriddhi Calculation Controller
*
* @class samriddhi.calculatePremiumCtrl
* @submodule core-controller
* @constructor
*/
productCalculator.controller(
  'samriddhi.calculatePremiumCtrl',
  [
    '$rootScope',
    '$scope',
    '$state',
    '$log',
    'samriddhiCalculationSvc',
    'calculateAdbRiderPremiumSvc',
    'calculatehospiCashRiderPremiumSvc',
    'calculatePwrRiderPremiumSvc',
    'samruddhiStaticDataSvc',
    'adbRiderForASDataFromUserSvc',
    'hospiCashRiderDataFromUserSvc',
    'pwrRiderDataFromUserSvc',
    'samriddhiValidationService',
    'sIValidationService',
    'getSetCommonDataService',
    'riderValidationService',

    function($rootScope, $scope, $state, $log, samriddhiCalculationSvc, calculateAdbRiderPremiumSvc, calculatehospiCashRiderPremiumSvc, calculatePwrRiderPremiumSvc, samruddhiStaticDataSvc,adbRiderForASDataFromUserSvc,hospiCashRiderDataFromUserSvc,pwrRiderDataFromUserSvc,samriddhiValidationService,sIValidationService,getSetCommonDataService,riderValidationService ) {
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
        var prodId = 2;
        var channelId = 1;
        var adbRiderId = 4;
        var hospicashId = 5;


      $scope.calculate = function(){
          $state.go('samriddhi-estimated');
        };

      $scope.samriddhiBasePremiumOutput = false;
      $scope.adbPremiumOutput = false;
      $scope.pwrOutput = false;
      $scope.hospiCashOutput = false;
      $scope.samriddhiBIOutput = false;
      $scope.nsapPrposer = false;

      $scope.data={
            laName: "ABC",
            laAge: 45,
            laGender: 1,
            isSelf: true,
            proposerName: "ABC",
            proposerAge: 45,
            proposerGender: 0,
            sumAssured: 700000,
            basePremium: 0,
            ppt: 0,
            NSAPForLA: true,
            premiumMode: 12,
      };
      /*Temprory product code it will be dynamic once new flow is implemented*/
    $scope.policyTermVals=[5,10,12,15,20,25,30,35];
      $scope.errorMessages=[];

      $scope.populatePPT = function (pt){
          samriddhiDataFromDBSvc.getPremiumPaymentTerm(pt).then(function(val){
              $scope.data.ppt = parseInt(val);
          });
      };

      $scope.updateRiderSA = function(){
            $scope.data.sumAssuredForADBRiders = angular.copy($scope.data.sumAssured);
      };

      $scope.isNSAPPrposer = function(isPwrII,isSelf,sumAssured){
          $log.debug("==>>",isPwrII+"=="+isSelf+"=="+sumAssured);

          if(isPwrII && !isSelf){
              alert("isPwrII",isPwrII+"=="+isSelf+"=="+sumAssured);
              $scope.nsapPrposer = riderValidationService.isNSAPForPropser(sumAssured);
              $log.debug("nsapPrposer",riderValidationService.isNSAPForPropser(sumAssured));
            }
      };

      $scope.doCalcSamriddhiBasePremium = function(prodId, channelId, data) {
          $log.debug("++++",data);
        var dataOut = data;
        $scope.samriddhiBasePremiumOutput = true;
          var answer = samriddhiCalculationSvc.calculatePremium(prodId, channelId, data);
          answer.then(function(basePremiumResult){
            $log.debug('premi',basePremiumResult);
            $scope.answer = basePremiumResult;
            $rootScope.userFormData = dataOut;
            doGenerateSamriddhiBI(prodId, channelId, $scope.answer.basePremium,$scope.answer.sumAssured);


            if(data.ADBRider){
                $log.debug("here");
             docalculateAdbPremium(prodId, channelId, data);
            }
           if(data.hospiCash){
              docalculateHospiCashPremium(prodId, channelId, data, $scope.answer.basePremium);
            }
           if(data.PWRI || data.PWRII){
             if(data.PWRI)
               docalculatePWRPremium(prodId, channelId, data, 1,$scope.answer.basePremium);
             if(data.PWRII){
               docalculatePWRPremium(prodId, channelId, data, 2,$scope.answer.basePremium);

             }

           }
          });
      };

      /*
        This function will validate the fields useing database credentials.
     */
        $scope.dbValidation= function(data){
          sIValidationService.validateBaseProduct(data).then(function(messages){
                $scope.dbError = "";
                $scope.errorMessages = messages;
                if(messages.length == 0){
                                $scope.showDbErrors = false;
                                $scope.dbError = "";
                                $scope.doCalcSamriddhiBasePremium(prodId, channelId, data);
                            }else{
                               $scope.showDbErrors = true;
                               $scope.dbErrors = messages[0];
                            }
              });
        };



        $scope.adbData = false;

        function docalculateAdbPremium(prodId, channelId, data){

        adbRiderForASDataFromUserSvc.setADBRiderData(data);

        if(data.ADBRider){
            var adbData = calculateAdbRiderPremiumSvc.calculateABDRiderPremium(adbRiderId, prodId, channelId, data);
              adbData.then(function(adbData){
                  $log.debug(")))))))",adbData);
                    if(adbData.annualAdbRiderPremium == 0){
                    $scope.adbData = false;
                    $scope.showDbErrors = true;
                    $scope.dbErrors = ["30% Base premium is less than rider"];
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
          hospiCashRiderDataFromUserSvc.setHospiCashData(data);
          var hospiCashData = calculatehospiCashRiderPremiumSvc.calculateHospiCashRiderPremium(hospicashId, prodId, channelId,basePremium);
          hospiCashData.then( function(hospiCashDataVal) {
            if(hospiCashDataVal.annualHospiCashPremium == 0){
            $scope.hospicashOutput = false;
            $scope.hospiCashData = {};
            $scope.showDbErrors = true;
            $scope.dbErrors = ["30% Base premium is less than rider"];
          }else{
              $scope.hospiCashData = hospiCashDataVal;
              $scope.hospicashOutput = true;
            }
          });

      }


      $scope.pwrOutput=false;
      function docalculatePWRPremium(prodId, channelId, data, option, bp){
        $log.debug('docalculatePWRPremium',data);
        var pwrInput = pwrRiderDataFromUserSvc.setPWRRiderData(data);

        if(parseInt(option) === 1){
          var pwrData1 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, data, option,bp);
          pwrData1.then(function(riderVal){
              $log.debug("===1",riderVal);
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
          var pwrData2 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, data, option,bp);
          pwrData2.then(function(riderVal){
               $log.debug("===2",riderVal);
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


      var doGenerateSamriddhiBI = function (prodId, channelId, basePremium,sumAssured) {
        $scope.samriddhi = {};
        $scope.samriddhiBIOutput=true;

        var samriddhi = samriddhiCalculationSvc.generateSamriddhiBI(prodId, channelId, $rootScope.userFormData,basePremium,sumAssured);
        samriddhi.then(function(samriddhiBI){
          $scope.samriddhi = samriddhiBI;
          return $scope.samriddhi;
        });

    };


    }
  ]
);
