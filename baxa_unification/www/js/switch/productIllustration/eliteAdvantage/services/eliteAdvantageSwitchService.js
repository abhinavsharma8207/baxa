switchModule.service(
  'eliteAdvantageSwitchService', [
    '$q',
    '$log',
    'commonFormulaSvc',
    'commonDBFuncSvc',
    'common_const',
    'commonDbProductCalculation',
    'eSCalculationService',
    'switchDbService',
    function($q, $log, commonFormulaSvc, commonDBFuncSvc, common_const, commonDbProductCalculation ,eSCalculationService,switchDbService) {
      'use strict';

      var eS = this;
      eS.setEliteInputata = setEliteInputata;
      eS.getEliteInputata = getEliteInputata;
      eS.setEliteResultOutputPi=setEliteResultOutputPi;
      eS.getEliteResultOutput=getEliteResultOutput;
      // eS.setEliteCal=setEliteCal;
      // eS.getEliteCal=getEliteCal;
      eS.getImage=getImage;
       var setEliteResultOutput = {};
      var setInputdata ={};
      var setOutput;
      // function setEliteCal(datac){
      //   getEliteCal =datac;
      // }
      // function getEliteCal(){
      //   return getEliteCal;
      // }

      function setEliteInputata(data){
        setInputdata =data;
      }
      function getEliteInputata(){
        return setInputdata;
      }

      function setEliteResultOutputPi(output){
        setOutput =output;
      }
      function getEliteResultOutput(){
        return setOutput;
      }

      function getImage(age) {
        var userAge;
        if (age < 35) {
          userAge = 25;
        }
        if (age >= 35 && age < 50) {
          userAge = 35;
        }
        if (age >= 50 && age < 70) {
          userAge = 50;
        }
        if (age >= 70) {
          userAge = 70;
        }
        return userAge;
      }

    /*  eS.setEliteData = setEliteData;
      eS.setQuoteData = setQuoteData;
      eS.getQuoteData = getQuoteData;
      eS.getImage = getImage;
      eS.saveEliteSecurePi = saveEliteSecurePi;
      //eS.deathBenifit = deathBenifit;
      var eliteQuoteData = {};
      var eliteQuoteData1 = {};
      var data = {};
      var elitedata = {};


      /*Implementation starts*/
      /*This function will get pt for given payment term*/
    /*  function getAllPolicyTerm(prodId, channelId) {
      //  alert("in the policy term");
        var q = $q.defer();
        var policyTerm = commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'PT');
        policyTerm.then(function(val) {
          $log.debug('kkk', val);
          q.resolve(val);
        });
        return q.promise;
      }

      function getEliteData(){
        return  eliteQuoteData;
      }

      function setEliteData(quoteData){
        eliteQuoteData = quoteData;
      }

      function setQuoteData(data){
          elitedata = data;
      }
      function getQuoteData(){
        return  elitedata;
      }

      function getImage(age) {
        var userAge;
        if (age < 35) {
          userAge = 25;
        }
        if (age >= 35 && age < 50) {
          userAge = 35;
        }
        if (age >= 50 && age < 70) {
          userAge = 50;
        }
        if (age >= 70) {
          userAge = 70;
        }
        return userAge;
      }

      function saveEliteSecurePi(eliteSecurePiData){
        switchDbService.savePI(eliteSecurePiData);
      }


*/

  }]);
