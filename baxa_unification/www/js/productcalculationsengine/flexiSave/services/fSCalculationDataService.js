/*
 * Created By: Atul A
 * Flexi Save Database Service
 */
productCalculator.service(
  'fSDataFromDBSvc', [
    '$q',
    '$log',
    'commonFormulaSvc',
    'commonDBFuncSvc',
    'common_const',
    function($q, $log, commonFormulaSvc, commonDBFuncSvc, common_const) {
      'use strict';

      var fsd = this;

      fsd.getPremiumPaymentTerm = getPremiumPaymentTerm;
      fsd.getPremiumRate = getPremiumRate;

      fsd.guaranteedDeathBenefitFactor = 1.05;
      fsd.getSurrenderValue = getSurrenderValue;
      fsd.getTerminalDeathBonus4Per = getTerminalDeathBonus4Per;
      fsd.getTerminalDeathBonus8Per = getTerminalDeathBonus8Per;
      fsd.getRevisionaryBonusRateFourPer = getRevisionaryBonusRateFourPer;
      fsd.getRevisionaryBonusRateEightPer = getRevisionaryBonusRateEightPer;
      fsd.getTerminalBonusRateFourPer = getTerminalBonusRateFourPer;
      fsd.getTerminalBonusRateEightPer = getTerminalBonusRateEightPer;
      fsd.getSurrenderRate = getSurrenderRate;
      fsd.getBonusSurrenderRate = getBonusSurrenderRate;
      fsd.getProductCode = getProductCode;

      /*Method for Getting product code*/
      function getProductCode(prodId, channelId, ppt) {
        var q = $q.defer();
        /** mobile web provision **/
        var reqData;
        if(!isWeb){
            reqData = commonDBFuncSvc.getParamValue(prodId, channelId, 'PRODCODE');
        }else{
          /**Provision for webapp code **/


          /**return values in array in then function**/
        }

          reqData.then(function(val) {
            var ParamValueJson = JSON.parse(val);
            $log.debug('::::::::', ppt);
            var prodCode = ParamValueJson[ppt][0];
            $log.debug('::getProdCode is::', prodCode);
            q.resolve(prodCode);
          });

        return q.promise;
      }


      /*This function will get ppt for given payment term*/
      function getPremiumPaymentTerm(prodId, channelId, pt) {
        var q = $q.defer();
        var policyTerm = commonDBFuncSvc.getParamValue(prodId, channelId, 'PPT');
        policyTerm.then(function(val) {
          var paramValueJson = JSON.parse(val);
          $log.debug('ppt::::', paramValueJson[pt]);
          q.resolve(parseInt(paramValueJson[pt][0]));
        });
        return q.promise;
      }

      function getPremiumRate(prodId, channelId, laAge, laGender, ppt) {
        var q = $q.defer();
        var DBName;
        var premiumRateVal;

        var premiumRate = commonDBFuncSvc.getParamValueName(prodId, channelId, 'PR');
        premiumRate.then(function(val) {
          var paramValueJson = JSON.parse(val.ParamValue);

          var refArray = JSON.parse(val.ParamColumn);

          var keyIndex = refArray.columnName.indexOf(String(ppt)) - 1;
          $log.debug('keyIndex', keyIndex);
          if (laGender == 1) {
            if (ppt == 5 && laAge <= 10) {
              premiumRateVal = paramValueJson[8][keyIndex];
            } else if (ppt == 7 && laAge <= 5) {
              premiumRateVal = paramValueJson[3][keyIndex];
            } else if (ppt == 12 && laAge <= 2) {
              premiumRateVal = paramValueJson[0][keyIndex];
            } else {
              premiumRateVal = paramValueJson[laAge - 3][keyIndex];
            }
          } else {
            premiumRateVal = paramValueJson[laAge][keyIndex];
          }
          $log.debug('pr', premiumRateVal);
          q.resolve(premiumRateVal);
        });
        return q.promise;
      }



      /**
      	Get from DB for samruddhi
      */

      function getSurrenderValue(prodId, channelId, policyTerm) {

        var q = $q.defer();
        var ppt = fsd.getPremiumPaymentTerm(prodId, channelId, policyTerm);
        ppt.then(function(pt) {
          $log.debug('keyIndex+pt', pt);
          var surrenderRate = commonDBFuncSvc.getParamValueName(prodId, channelId, 'SURATE');
          surrenderRate.then(function(val) {
            var paramValueJson = JSON.parse(val.ParamValue);
            var refArray = JSON.parse(val.ParamColumn);
            var keyIndex = refArray.columnName.indexOf(String(pt)) - 1;
            $log.debug('keyIndex', keyIndex);
            var surrenderRateData = [];
            for (var i = 1; i <= policyTerm; i++) {
              surrenderRateData.push(paramValueJson[i][keyIndex]);
            }
            q.resolve(surrenderRateData);
          });
        });

        return q.promise;

      }

      /*
         Get from DB Revisionary Bonus Rate @4%
      */
      function getRevisionaryBonusRateFourPer(prodId, channelId) {
        var revisionaryBonusRate; // = 0.0085;
        var q = $q.defer();
        revisionaryBonusRate = commonDBFuncSvc.getParamValue(prodId, channelId, 'REVBORATE4');
        revisionaryBonusRate.then(function(val) {
          var paramValueJson = JSON.parse(val);
          q.resolve(paramValueJson);
        });
        return q.promise;

        /*return revisionaryBonusRate;*/
      }

      /*
         Get from DB Revisionary Bonus Rate @8%
      */
      function getRevisionaryBonusRateEightPer(prodId, channelId) {
        var q = $q.defer();
        var revisionaryBonusRate = commonDBFuncSvc.getParamValue(prodId, channelId, 'REVBORATE8');
        revisionaryBonusRate.then(function(val) {
          var paramValueJson = JSON.parse(val);
          q.resolve(paramValueJson);
        });
        return q.promise;
      }

      /*
         Get from DB Terminal Bonus Rate @4%
      */
      function getTerminalBonusRateFourPer(prodId, channelId) {
        var q = $q.defer();
        var terminalBonusRate = commonDBFuncSvc.getParamValue(prodId, channelId, 'TERBORATE4');
        terminalBonusRate.then(function(val) {
          var paramValueJson = JSON.parse(val);
          q.resolve(paramValueJson);
        });
        return q.promise;
      }

      /*
         Get from DB Terminal Bonus Rate @8%
      */
      function getTerminalBonusRateEightPer(prodId, channelId, ppt) {
        var q = $q.defer();
        var terminalBonusRate = commonDBFuncSvc.getParamValue(prodId, channelId, 'TERBORATE8');
        terminalBonusRate.then(function(val) {
          var paramValueJson = JSON.parse(val);
          q.resolve(paramValueJson);
        });
        return q.promise;
      }


      /*
      * Terminal Bonus on Death@ 8%
      	Formula = (Revisionary Bonus rate @8%* End of Policy Year* SA * Terminal Bonus Rate @ 8% * (11-(Policy Term- End of policy year)))
      	Show Terminal bonus till end of policy term only
      */

      function getTerminalDeathBonus4Per(prodId, channelId, policyTerm, sumAssured) {
        var q = $q.defer();
        var terminalDeathBonus = [];
        $q.all([
          fsd.getRevisionaryBonusRateFourPer(prodId, channelId),
          fsd.getTerminalBonusRateFourPer(prodId, channelId)
        ]).then(function(vals) {
          $log.debug('dbvals', vals);
          $log.debug('policyTerm', policyTerm);
          for (var i = 1; i <= policyTerm; i++) {
            var deathbonusRate;
            deathbonusRate = (vals[0][policyTerm] * i * sumAssured * vals[1][policyTerm] * (11 - (policyTerm - i)));
            //$log.debug('deathbonusRate',deathbonusRate);
            if (deathbonusRate <= 0) {
              terminalDeathBonus.push(0);
            } else {
              terminalDeathBonus.push(deathbonusRate);
            }
          }
          q.resolve(terminalDeathBonus);
        });
        return q.promise;
      }

      /*
      * Terminal Bonus on Death@ 8%
      	Formula = (Revisionary Bonus rate @8%* End of Policy Year* SA * Terminal Bonus Rate @ 8% * (11-(Policy Term- End of policy year)))
      	Show Terminal bonus till end of policy term only
      */

      function getTerminalDeathBonus8Per(prodId, channelId, policyTerm, sumAssured) {
        var q = $q.defer();
        var terminalDeath8Bonus = [];
        $q.all([
          fsd.getRevisionaryBonusRateEightPer(prodId, channelId),
          fsd.getTerminalBonusRateEightPer(prodId, channelId)
        ]).then(function(vals) {
          $log.debug('dbvals', vals);
          $log.debug('policyTerm', policyTerm);
          for (var i = 1; i <= policyTerm; i++) {
            var deathbonusRate;
            deathbonusRate = (vals[0][policyTerm] * i * sumAssured * vals[1][policyTerm] * (11 - (policyTerm - i)));
            if (deathbonusRate <= 0) {
              terminalDeath8Bonus.push(0);
            } else {
              terminalDeath8Bonus.push(deathbonusRate);
            }
          }
          q.resolve(terminalDeath8Bonus);
        });
        return q.promise;
      }



      /*
			   Get from DB Surrender Rates table
			   Params Duration,Age
			*/
      function getSurrenderRate(prodId, channelId, age, policyTerm) {
        var q = $q.defer();
        var DBName;
        var ppt = fsd.getPremiumPaymentTerm(prodId, channelId, policyTerm);
        ppt.then(function(pptVal) {
          DBName = 'SURATE' + pptVal;

          var surrenderRate = commonDBFuncSvc.getParamValue(prodId, channelId, DBName);
          surrenderRate.then(function(val) {
            var surrenderRateVal = [];
            var paramValueJson = JSON.parse(val);
            for (var i = 1; i <= policyTerm; i++) {
              surrenderRateVal.push(paramValueJson[i][age]);
            }
            q.resolve(surrenderRateVal);
          });
        });
        return q.promise;

      }

      /*
         Get from DB Bonus Surrender Rates table
         Params Duration,Age
      */
      function getBonusSurrenderRate(prodId, channelId, age, policyTerm) {
        var q = $q.defer();
        var DBName;
        var ppt = fsd.getPremiumPaymentTerm(prodId, channelId, policyTerm);
        ppt.then(function(pptVal) {
          DBName = 'BOSURATE' + pptVal;

          var bonussurrenderRate = commonDBFuncSvc.getParamValue(prodId, channelId, DBName);
          bonussurrenderRate.then(function(val) {
            var bsurrenderRateVal = [];
            var paramValueJson = JSON.parse(val);
            for (var i = 1; i <= policyTerm; i++) {
              bsurrenderRateVal.push(paramValueJson[i][age]);
            }
            q.resolve(bsurrenderRateVal);
          });
        });
        return q.promise;

      }
    }
  ]
);
