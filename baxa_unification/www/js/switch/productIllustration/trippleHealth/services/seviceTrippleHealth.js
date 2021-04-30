/*
service for maintaining object for samruddhi
*/
switchModule.service(
  'trippleHealthObjectServicePi', [
    '$q',
    '$log',
    'commonDbProductCalculation',
    'tHValidationService',
    'calculateTrippleHealthPremiumSvc',
    'trippleHealthDataFromUserSvc',
    'common_const',
    'switchDataService',
    'switchDbService',
    function($q, $log, commonDbProductCalculation, tHValidationService, calculateTrippleHealthPremiumSvc, trippleHealthDataFromUserSvc, common_const, switchDataService, switchDbService) {

      var vm = this;
      var hospiCashRiderId=5,adbRiderId=4, prodId=3, channelId=1,pwrRiderId =6,pwrOption=1;


    //  vm.setTrippData = setTrippData;
    //  vm.getTrippData = getTrippData;

      vm.setCalData=setCalData;
      vm.getCalData=getCalData;
      vm.tHSendMail = tHSendMail;
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

        /*floating button send email DB action*/
        function tHSendMail(mailData){
          var q = $q.defer();

          var getTrippleHQuoteData = vm.getTrippData();
          var getData = vm.getCalData();
          var productData = switchDataService.getProductData();
            $log.debug("getTrippleHQuoteData",getTrippleHQuoteData);
            $log.debug("getData",getData);
            $log.debug('productData',switchDataService.getProductData());
            mailData.productId = productData.FkProductId;

            mailData.mailJson = {
              	"pdf": {
              		"gender": getData.laGender,
              		"currentAge": getData.laAge,
              		"policyTerm": getData.pt,
              		"premiumPaymentTerm": getData.ppt,
              		"premiumMode": getData.mode,
              		"modalPremium": getTrippleHQuoteData.totalModalPremium,
              		"annualPremium": getTrippleHQuoteData.totalAnnualPremium,
              		"lifeCover": getData.sumAssured,
              		"ageAtMaturity": parseInt(getData.laAge) + parseInt(getData.ppt),
                  "agentName": "",
                  "agentDesignation": "",
                  "agentChannel": "",
                  "agentMobileNo": ""
              	}
            };


          $log.debug('mailData',mailData);
          switchDbService.sendMail(mailData).then(function(mail){
            q.resolve(true);
          });
          return q.promise;
        }
    }
  ]);
