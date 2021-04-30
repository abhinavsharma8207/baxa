/*
service for maintaining object for samruddhi
*/
switchModule.service(
  'seviceSuperSeries', [
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
    'common_const',
    function($q, $log, commonDbProductCalculation, tHValidationService, calculateTrippleHealthPremiumSvc, trippleHealthDataFromUserSvc, calculateAdbRiderPremiumSvc, calculatehospiCashRiderPremiumSvc, pwrRiderDataFromUserSvc, calculatePwrRiderPremiumSvc,common_const) {

      var vm = this;
      var hospiCashRiderId=5,adbRiderId=4, prodId=3, channelId=1,pwrRiderId =6,pwrOption=1;


    //  vm.setTrippData = setTrippData;
    //  vm.getTrippData = getTrippData;

      vm.setCalData=setCalData;
      vm.getCalData=getCalData;
      var lAandProposerDetails;
      var trippData ={};
      var data={};
      var calData={};
      var Data={};


      // function setTrippData(data) {
      //   trippData = data;
      //       }
      // function getTrippData() {
      //   return trippData;
      // }
      function setCalData(Data) {
        calData = Data;
        }
        function getCalData() {
          return calData;
        }
    }
  ]);
