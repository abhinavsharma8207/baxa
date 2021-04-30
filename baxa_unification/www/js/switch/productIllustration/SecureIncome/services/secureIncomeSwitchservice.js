switchModule.service('secureIncomeSwitchservice', ['$q','$log','switchDbService',
    function($q, $log, switchDbService) {
      'use strict';

      var vm = this;
      vm.setQuoteData = setQuoteData;
      vm.getQuoteData = getQuoteData;
      vm.setSIData = setSIData;
      vm.getSIData = getSIData;
      vm.setGsbData = setGsbData;
      vm.getGsbData = getGsbData;
      vm.setBIData = setBIData;
      vm.getBIData = getBIData;
      vm.saveSecureIncomePi = saveSecureIncomePi;
      var securedata;
      var data;
      var sidata;
      var gsbData;
      var bIData;

      function getQuoteData(){
        return  securedata;
      }
      function setQuoteData(data){
        securedata = data;
      }

      function setSIData(data){
        sidata = data;
      }
      function getSIData(){
        return  sidata;
      }
      function setGsbData(data){
        gsbData = data;
      }
      function getGsbData(){
        return  gsbData;
      }
      function setBIData(data){
        bIData = data;
      }
      function getBIData(){
        return  bIData;
      }


      function saveSecureIncomePi(samriddhiPiData) {
        switchDbService.savePI(samriddhiPiData);
      }



    }]);
