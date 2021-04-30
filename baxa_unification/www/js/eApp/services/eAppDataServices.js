eAppModule.service(
  'eAppDataServices', [
    '$q',
    '$log',
    'commonDBFuncSvc',
    'commonDbProductCalculation',
    function($q, $log, commonDBFuncSvc, commonDbProductCalculation) {
      var obj = this;

      /** Get Quote Listing Data **/
      obj.getQuoteData = function(){
        commonDBFuncSvc.getQuotes()
        .then(function(result){
          console.log("*******************************", result);
        });
      };

      /** Get Incomplete Forms Listing Data **/
      obj.getIncompleteQuoteData = function(){
        commonDBFuncSvc.getQuotes()
        .then(function(result){
          console.log("*******************************", result);
        });
      };

      /** Get Pending for Login listing Data **/
      obj.getPendingQuoteData = function(){
        commonDBFuncSvc.getQuotes()
        .then(function(result){
          console.log("*******************************", result);
        });
      };

    }]);
