switchModule.service('samriddhiSwitchService', [
  '$q',
  '$log',
  'switchDbService',
  'switchDataService',
  function($q, $log, switchDbService, switchDataService) {
    'use strict';

    var vm = this;
    vm.setsamriddhiData = setsamriddhiData;
    vm.getsamriddhiData = getsamriddhiData;
    vm.setQuoteData = setQuoteData;
    vm.getQuoteData = getQuoteData;
    vm.setQuotecalculatedData = setQuotecalculatedData;
    vm.getQuotecalculatedData = getQuotecalculatedData;
    vm.getImage = getImage;
    vm.saveSamriddhiPi = saveSamriddhiPi;
    vm.setsamriddhiData = setsamriddhiData;
    vm.sSendMail = sSendMail;



    var samriddhiQuoteData;
    var quoteData;
    var samriddhidata;
    var data;
    var calculatedData;
    //flexi save data


    function getsamriddhiData() {
      //$log.debug('getsamriddhiData',samriddhiQuoteData);
      return samriddhiQuoteData;
    }

    function setsamriddhiData(quoteData) {
      samriddhiQuoteData = quoteData;
      //$log.debug('setsamriddhiData',samriddhiQuoteData);
    }

    function setQuoteData(data) {
      samriddhidata = data;
    }

    function getQuoteData() {
      return samriddhidata;
    }

    function setQuotecalculatedData(data) {
      calculatedData = data;
    }

    function getQuotecalculatedData() {
      return calculatedData;
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

    function saveSamriddhiPi(samriddhiPiData) {
      switchDbService.savePI(samriddhiPiData);
    }

    /*floating button send email DB action*/
    function sSendMail(mailData){
      var q = $q.defer();

      var getSamriddhiQuoteData = switchDataService.getQuoteData();
      var getData = switchDataService.getQuotecalculatedData();
      var productData = switchDataService.getProductData();
        $log.debug("getSamriddhiQuoteData",getSamriddhiQuoteData);
        $log.debug("getData",getData);
        $log.debug('productData',switchDataService.getProductData());
        mailData.productId = productData.FkProductId;

        mailData.mailJson = {
          	"pdf": {
              "gender": getSamriddhiQuoteData.laGender,
              "currentAge": getSamriddhiQuoteData.laAge,
              "policyTerm": getSamriddhiQuoteData.pt,
              "premiumPaymentTerm": getSamriddhiQuoteData.ppt,
              "premiumMode": switchDataService.getMode(getSamriddhiQuoteData.premiumMode),
              "modalPremium": getData.totalModalPremium,
          		"inYourPresence": {
          			"sumAssured": getData.sumAssured,
          			"nonGuaranteedBonus": getData.nonGuaranteedBonusesMaturity,
          			"totalBenefit": getData.sumofBenefits,
          			"ageAtMaturity": parseInt(getSamriddhiQuoteData.laAge) + parseInt(getSamriddhiQuoteData.pt)
          		},
          		"inYourAbsence": {
          			"nonGuaranteedBonus": getData.nonGuaranteedBonusesMaturity,
          			"deathBenefit": getData.deathBenefit,
          			"ageAtDeath": parseInt(getSamriddhiQuoteData.laAge) + parseInt(getSamriddhiQuoteData.pt) - 2,
          			"premiumPaymentTerm": getSamriddhiQuoteData.ppt
          		},
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
