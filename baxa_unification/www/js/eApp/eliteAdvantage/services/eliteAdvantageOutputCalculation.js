/*
service for maintaining object for samruddhi
*/
eAppModule.service(
  'eliteAdvantageOutputService', [
    '$q',
    '$log',
    'commonDbProductCalculation',
    'tHValidationService',
    'calculateTrippleHealthPremiumSvc',
    'trippleHealthDataFromUserSvc',
    'calculateAdbRiderPremiumSvc',
    'calculatehospiCashRiderPremiumSvc',
    'pwrRiderDataFromUserSvc',
    'calculatePwrRiderPremiumSvc',
    function($q, $log, commonDbProductCalculation, tHValidationService, calculateTrippleHealthPremiumSvc, trippleHealthDataFromUserSvc, calculateAdbRiderPremiumSvc, calculatehospiCashRiderPremiumSvc, pwrRiderDataFromUserSvc, calculatePwrRiderPremiumSvc) {

      var vm = this;
      var hospiCashRiderId=5,adbRiderId=4, prodId=3, channelId=1,pwrRiderId =6,pwrOption=1;

      vm.adbRiderCalculation  = adbRiderCalculation;
      vm.docalculatePWRPremium = docalculatePWRPremium;


      function adbRiderCalculation(adbRiderId, prodId, channelId, data){
                       var q= $q.defer();
                       var adbRider= calculateAdbRiderPremiumSvc.calculateABDRiderPremium(adbRiderId, prodId, channelId, data);
                       adbRider.then(function(adbData){
                                 if(adbData.annualAdbRiderPremium == 0){
                                  adbDataTrueFalse = false;
                                 var showDbErrors = true;
                                  var dbErrors = "30% Base premium is less than rider";
                                   }else{
                                  adbDataTrueFalse = adbData;
                                 $log.debug('adbDataTrueFalse',adbDataTrueFalse);
                                 var adbPremiumOutput = true;
                               }
                               q.resolve(adbDataTrueFalse);
                             });
                       return q.promise;
             }

      function docalculatePWRPremium(prodId, channelId, data,option){
               var q= $q.defer();
               $log.debug('docalculatePWRPremium',data);
               var pwrInput = pwrRiderDataFromUserSvc.setPWRRiderData(data);

               if(parseInt(option) === 1){
                 var pwrData1 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, data, option);
                 pwrData1.then(function(riderVal){
                      q.resolve(riderVal);
                   if(riderVal.annualPwrPremium == 0){
                     var pwrOutputOption1 = false;
                     var showDbErrors = true;
                     var dbErrors = "30% Base premium is less than rider";
                   }else{
                     var pwrData1 = riderVal;
                     $log.debug('$scope.pwrData1',pwrData1);
                     var pwrOutputOption1 = true;
                     q.resolve(pwrOutputOption1);
                   }
                 });

               }else if(parseInt(option) === 2){
                 var pwrData2 = calculatePwrRiderPremiumSvc.calculatePwrRiderPremium(prodId, channelId, data, option);
                 pwrData2.then(function(riderVal){
                   q.resolve(riderVal);
                     if(riderVal.annualPwrPremium == 0){
                       var pwrOutputOption2 = false;
                       var showDbErrors = true;
                       var dbErrors = "30% Base premium is less than rider";
                     }else{
                       var pwrData2 = riderVal;
                       $log.debug('$scope.pwrData2',pwrData2);
                       var pwrOutputOption2 = true;
                   }
                 });
               }
               return q.promise;
             }


    }
  ]);
