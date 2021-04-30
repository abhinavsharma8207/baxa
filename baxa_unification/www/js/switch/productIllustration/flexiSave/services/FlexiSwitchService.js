switchModule.service('flexiSwitchService', ['$q', '$log','switchDbService',
  function($q, $log,switchDbService) {
    'use strict';

    var vm = this;



    //flexi save functions

    vm.fsSendMail = fsSendMail;


     /*floating button send email DB action*/
     function fsSendMail(mailData){
       var q = $q.defer();

       var getfSQuoteData = switchDataService.getQuoteData();
       var getData = switchDataService.getQuotecalculatedData();
       var productData = switchDataService.getProductData();
         $log.debug("getfSQuoteData",getfSQuoteData);
         $log.debug("getData",getData);
         $log.debug('productData',productData);
         mailData.productId = productData.FkProductId;
         mailData.mailJson = {};
       $log.debug('mailData',mailData);
       switchDbService.sendMail(mailData).then(function(mail){
         q.resolve(true);
       });
       return q.promise;


     }

  }
]);
