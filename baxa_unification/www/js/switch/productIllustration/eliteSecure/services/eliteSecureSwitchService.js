switchModule.service(
  'eliteSecureSwitchService', [
    '$q',
    '$log',
    'commonFormulaSvc',
    'commonDBFuncSvc',
    'common_const',
    'commonDbProductCalculation',
    'eSCalculationService',
    'switchDataService',
    'switchDbService',
    function($q, $log, commonFormulaSvc, commonDBFuncSvc, common_const, commonDbProductCalculation, eSCalculationService, switchDataService, switchDbService) {
      'use strict';

      var eS = this;
      eS.getAllPolicyTerm = getAllPolicyTerm;
      eS.getEliteData = getEliteData;
      eS.setEliteData = setEliteData;
      eS.setQuoteData = setQuoteData;
      eS.getQuoteData = getQuoteData;
      eS.getImage = getImage;
      eS.saveEliteSecurePi = saveEliteSecurePi;
      eS.esSendMail = esSendMail;
      //eS.deathBenifit = deathBenifit;
      var eliteQuoteData = {};
      var eliteQuoteData1 = {};
      var data = {};
      var elitedata;


      /*Implementation starts*/
      /*This function will get pt for given payment term*/
      function getAllPolicyTerm(prodId, channelId) {
        //  alert("in the policy term");
        var q = $q.defer();
        var policyTerm = commonDbProductCalculation.getAllStaticValuesByName(prodId, channelId, 'PT');
        policyTerm.then(function(val) {
          $log.debug('kkk', val);
          q.resolve(val);
        });
        return q.promise;
      }

      function getEliteData() {
        return eliteQuoteData;
      }

      function setEliteData(quoteData) {
        eliteQuoteData = quoteData;
      }

      function setQuoteData(data) {
        elitedata = data;
      }

      function getQuoteData() {
        return elitedata;
      }

      function getImage(age) {
        var userAge;
        if (age <= 35) {
          userAge = 25;
        }
        if (age >= 36 && age <= 50) {
          userAge = 35;
        }
        if (age >= 51 && age <= 70) {
          userAge = 50;
        }
        if (age >= 70) {
          userAge = 70;
        }
        return userAge;
      }


      function saveEliteSecurePi(eliteSecurePiData) {
        switchDbService.savePI(eliteSecurePiData);
      }
      /*floating button send email DB action*/
      function esSendMail(mailData) {
        var q = $q.defer();

        var geteliteQuoteData = eS.getQuoteData();
        var getData = eS.getEliteData();
        var productData = switchDataService.getProductData();
        $log.debug("geteliteQuoteData", geteliteQuoteData);
        $log.debug("getData", getData);
        $log.debug('productData', switchDataService.getProductData());
        mailData.productId = productData.FkProductId;
        mailData.mailJson = {
          "pdf": {
            "gender": geteliteQuoteData.laGender,
            "currentAge": geteliteQuoteData.laAge,
            "policyTerm": geteliteQuoteData.pt,
            "premiumPaymentTerm": geteliteQuoteData.ppt,
            "premiumMode": switchDataService.getMode(geteliteQuoteData.premiumMode),
            "modalPremium": getData.modalPremium,
            "annualPremium": getData.totalAnnualPremium,
            "lifeCover": geteliteQuoteData.sumAssured,
            "ageAtDeath": getData.bi.benefitUptoAge,
            "agentName": "",
            "agentDesignation": "",
            "agentChannel": "",
            "agentMobileNo": ""
          }
        };
        $log.debug('mailData', mailData);
        switchDbService.sendMail(mailData).then(function(mail) {
          q.resolve(true);
        });

        return q.promise;


      }




    }
  ]);
