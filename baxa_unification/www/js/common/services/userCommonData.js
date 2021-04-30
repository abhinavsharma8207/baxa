unificationBAXA.service('getSetCommonDataService', [
  '$q',
  '$log',
  'commonDBFuncSvc',
  'commonDbProductCalculation',
  function($q, $log, commonDBFuncSvc, commonDbProductCalculation) {
    'use strict';
    var vm = this;
    var hospiCashPolicyUserData = {};
    var productData = {};
    var commonData = {};
    return {
      setCommonData: function(data) {
        var selectedCommonData = {
          channelId: data.channelId,
          channelName: data.channelName,
          agentId: data.agentId,
          userName: data.userName
        };
        commonData = selectedCommonData;
        return selectedCommonData;
      },

      getCommonData: function() {
        return commonData;
      },

      setCurrentProdData: function(data) {
        var selectedProductData = {
          prodId: data.prodId,
          prodLbl: data.prodLbl,
          prodUIN: data.prodUIN,
          ridersData: data.ridersData
        };
        productData = selectedProductData;
        return selectedProductData;
      },

      getCurrentProdData: function() {
        return productData;
      },

      getInputValues :function(prodId, channelId){
          var q = $q.defer();
          var params  = ["GENDER","UPTOAGE","PMODE","PPT"];
          var reqData;
          if(!isWeb){
              reqData = commonDbProductCalculation.getAllStaticValuesByArray(prodId, channelId, params);
          }else{
               /*All static Input Values*/
          }
          reqData.then(function(value){
              $log.debug("reqData",value);
              q.resolve(value);
          });
          return q.promise;

      },
      getInputValuesForHospicash :function(prodId, channelId){
          var q = $q.defer();
          var params  = ["DHCB","RTERM"];
          var reqData;
          if(!isWeb){
              reqData = commonDbProductCalculation.getAllStaticValuesByArray(prodId, channelId, params);
          }else{
               /*All static Input Values*/
          }
          reqData.then(function(value){
              $log.debug("reqData",value);
              q.resolve(value);
          });
          return q.promise;

      },
    };
  }
]);
