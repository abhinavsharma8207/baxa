switchModule.service('switchDbService', ['$log',
  '$q',
  'utilityService',
  'commonDBFuncSvc',
  'getSetCommonDataService',
  function($log, $q, utilityService, commonDBFuncSvc, getSetCommonDataService) {
    'use strict';
    var vm = this;
    vm.createSwitchTable = createSwitchTable;
    vm.createUniqueCustomerId = createUniqueCustomerId;
    vm.getRowCount = getRowCount;
    vm.getCustomerDetails = getCustomerDetails;
    vm.updatepro = updatepro;
    vm.updateLifeStage = updateLifeStage;
    vm.getCustProfileByCustId = getCustProfileByCustId;
    vm.getCalculatorSummary = getCalculatorSummary;
    vm.deleteCalculatorDetails = deleteCalculatorDetails;
    vm.getCalcCount = getCalcCount;
    vm.updateLifeStageCompleted = updateLifeStageCompleted;
    vm.updateLifeStageCompletedInNeed = updateLifeStageCompletedInNeed;
    vm.savePI = savePI;
    vm.getPiSummary = getPiSummary;
    vm.getProductRecommmendations = getProductRecommmendations;
    vm.deletePi = deletePi;
    vm.sendMail = sendMail;

    function createSwitchTable(custData) {
      var q = $q.defer();
      var custId = createUniqueCustomerId();
      var parameters = [
        "" + custId,
        "" + custData.mobileNo,
        "" + custData.Gender,
        "" + custData.age,
        "" + custData.firstName,
        "" + custData.lastName,
        "" + custData.email,
        "" + '1',
        "" + '1',
        "" + utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss a'),
        "" + custId,
        "" + utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss a'),
        "" + custId
      ];

      commonDBFuncSvc.query("INSERT INTO SwitchCustomerProfile (Cust_Id,MobileNo,Gender,Age,FirstName,LastName,Email,StepCompleted,IsActive,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
          parameters)
        .then(function(result) {
          $log.debug("data inserted success");
          q.resolve(parameters[0]);
          // getCustProfileById(result.insertId).then(function(customerInfo) {
          //   q.resolve(customerInfo);
          // });
        });
      return q.promise;
    }

    function updateLifeStage(data, id, compSteps) {
      $log.debug('updateLifeStage :: compSteps ', compSteps);
      var steps = compSteps;
      if (2 > parseInt(compSteps)) {
        steps = 2;
      }
      if(!angular.isUndefined(data) && data!=null){
      return commonDBFuncSvc.query("UPDATE   SwitchCustomerProfile SET  LifeStage= " + data + " , ModifiedDate= '" + utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss') + "', StepCompleted= '" + steps + "' WHERE Cust_ID = '" + id + "' ").then(function(result) {});
    }
      else {
        return;
      }
    }

    function updateLifeStageCompleted(id, compSteps) {
      $log.debug('updateLifeStageCompleted :: compSteps ', compSteps);
      var steps = compSteps;
      if (2 > parseInt(compSteps)) {
        steps = 2;
      }
      return commonDBFuncSvc.query("UPDATE SwitchCustomerProfile SET StepCompleted= '" + steps + "' WHERE Cust_ID = '" + id + "' ").then(function(result) {});
    }

    function getCustProfileById(insertId) {
      var q = $q.defer();
      var parameters = [insertId];
      commonDBFuncSvc.query("SELECT * FROM SwitchCustomerProfile WHERE PKSwitchCustomerProfile = ?", parameters)
        .then(function(profileData) {
          //$log.debug('Insert result ',profileData);
          q.resolve(profileData);
        });
      return q.promise;
    }

    function getCustProfileByCustId(custId) {
      $log.debug('getCustProfileByCustId >>>>>', custId);
      var q = $q.defer();
      var parameters = [custId];
      commonDBFuncSvc.query("SELECT * FROM SwitchCustomerProfile WHERE Cust_ID = ?", parameters)
        .then(function(profileData1) {
          var profileData;
          profileData = commonDBFuncSvc.getAll(profileData1);
          //$log.debug('Insert result ',profileData);
          q.resolve(profileData[0]);
        });
      return q.promise;
    }

    function getRowCount() {
      var parameters = [];
      return commonDBFuncSvc.query("Select Cust_Id from SwitchCustomerProfile",
          parameters)
        .then(function(result) {
          var _count = commonDBFuncSvc.getCount(result);
          return _count;
        });
    }

    function getCustomerDetails() {
      return commonDBFuncSvc.query("SELECT * FROM SwitchCustomerProfile").then(function(result) {
        var getCustomerDetails = [];
        getCustomerDetails = commonDBFuncSvc.getAll(result);
        $log.debug('SwitchCustomerDetailsAreAsFallows', getCustomerDetails);
        return getCustomerDetails;
      });
    }

    function updatepro(data, id) {
      if(!angular.isUndefined(data) && data!=null){
      //$log.debug('updatepro :: compSteps ', compSteps);
      var query = "UPDATE SwitchCustomerProfile SET LifeStagePriority='" + JSON.stringify(data) + "' , ModifiedDate= '" + utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss') + "' WHERE Cust_ID='" + id + "' ";

      $log.debug("updatepro query", query);
      return commonDBFuncSvc.query(query).then(function(result) {
        $log.debug("data updated sucessfuly");
      });
    }
    else return;
    }

    function updateLifeStageCompletedInNeed(id, compSteps) {
      var steps = compSteps;
      if (3 > parseInt(compSteps)) {
        steps = 3;
      }
      var query = "UPDATE SwitchCustomerProfile SET  StepCompleted= '" + steps + "' WHERE Cust_ID='" + id + "' ";
      return commonDBFuncSvc.query(query).then(function(result) {
        //  $log.debug("data updated sucessfuly");
      });
    }

    function getCalcCount(type, custId) {
      var parameters = [type, custId];
      var _count = 0;
      return commonDBFuncSvc.query("Select PKSwitchCalculator from SwitchCalculator WHERE Type = ? AND FKCust_ID = ?",
          parameters)
        .then(function(result) {
          _count = commonDBFuncSvc.getCount(result);
          return _count;
        });
    }

    function createUniqueCustomerId() {
      var userData = getSetCommonDataService.getCommonData();
      var TestUserId = userData.agentId;
      var appendStr = "-";
      var uniqueId = TestUserId + appendStr + new Date().getTime();
      return uniqueId;
    }

    function getCalculatorSummary(type, custId) {
      var parameters = [type, custId];
      return commonDBFuncSvc.query("SELECT * FROM SwitchCalculator WHERE Type = ? AND FKCust_ID = ? ORDER BY CreatedDate DESC", parameters).then(function(result) {
        var getCalculatorDetails = [];
        getCalculatorDetails = commonDBFuncSvc.getAll(result);
        $log.debug('!getCalculatorSummary!', getCalculatorDetails);
        return getCalculatorDetails;
      });
    }
    /**Delete the CalculatorDetails.**/
    function deleteCalculatorDetails(PKSwitchCalculator) {
      var parameters = ["" + PKSwitchCalculator];
      return commonDBFuncSvc.query("delete from SwitchCalculator where PKSwitchCalculator = ?", parameters)
        .then(function(result) {
          $log.debug('delete CalculatorDetails result => ', result);
        });
    }

    function createUniquePiId() {
      var uuid;
      try {
        uuid = $cordovaDevice.getUUID();
      } catch (err) {
        uuid = 'PI';
      }
      var userData = getSetCommonDataService.getCommonData();
      var agentId = userData.agentId;
      var appendStr = "-";
      var uniqueId = uuid + appendStr + agentId + appendStr + new Date().getTime();
      return uniqueId;
    }


    function savePI(pIData) {
      $log.debug('pIData', pIData);

      var q = $q.defer();
      var selectParameters = [
        pIData.productId,
        pIData.custId,
        pIData.input,
        pIData.output
      ];
      $log.debug('countPiselectParameters', selectParameters);

      commonDBFuncSvc.query("SELECT Input FROM SwitchProductIllustration WHERE FkProductId = ? AND FKCust_ID = ? AND Input = ? AND Output = ?", selectParameters).then(function(selectData) {
        var checkRecord = commonDBFuncSvc.getAll(selectData);
        $log.debug('countPi', selectData);
        if (checkRecord.length <= 0) {
          var parameters = [
            pIData.custId,
            pIData.productId,
            createUniquePiId(),
            pIData.input,
            pIData.output,
            pIData.annualPremium,
            '1',
            utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss'),
            pIData.custId,
            utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss'),
            pIData.custId
          ];
          commonDBFuncSvc.query("INSERT INTO SwitchProductIllustration (FKCust_ID,FkProductId,ProductIllustrationId,Input,Output,AnnualPremium,IsActive,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
              parameters)
            .then(function(result) {
              $log.debug(result);
            });
          return q.promise;
        } else {
          return q.promise;

        }
      });
    }

    function getPiSummary(productId, custId) {
      var parameters = [productId, custId];
      return commonDBFuncSvc.query("SELECT PKSwitchPI,FKCust_ID,FkProductId,ProductIllustrationId,Output,CreatedDate,AnnualPremium FROM SwitchProductIllustration WHERE FkProductId = ? AND FKCust_ID = ? ORDER BY CreatedDate DESC", parameters).then(function(result) {
        var getPiDetails = [];
        var piDetails = [];
        getPiDetails = commonDBFuncSvc.getAll(result);
        angular.forEach(getPiDetails, function(piItems) {
          var parseOp = JSON.parse(piItems.Output);
          piItems.createdDate = new Date(piItems.CreatedDate).getTime();
          //piItems.annualPremium = parseOp.basePremium;
          piDetails.push(piItems);
        }, piDetails);
        return getPiDetails;
      });
    }

    function getProductRecommmendations(channelId, calcId) {
      var parameters = ["" + channelId, "" + calcId];
      return commonDBFuncSvc.query("SELECT * FROM PceMstProduct as PCP INNER JOIN AskSwitchMapProductRecommendation as ASMPR ON PCP.PkProductId = ASMPR.FkProductId WHERE ASMPR.FkChannelId= ? AND ASMPR.FkCalculatorId = ? AND ASMPR.IsActive = 1  ORDER BY CAST(ASMPR.OrderKey as integer) ASC", parameters).then(function(result) {
        var getProductDetails = [];
        getProductDetails = commonDBFuncSvc.getAll(result);
        $log.debug('calcId', calcId);
        return getProductDetails;
      });
    }

    function deletePi(customerId,recId){
      var parameters = [customerId,recId];
      return commonDBFuncSvc.query("DELETE FROM SwitchProductIllustration where FKCust_ID = ? AND PKSwitchPI = ?", parameters)
        .then(function(result) {
          $log.debug('delete Summary result => ', result);
        });
    }

    function sendMail(mailData){
      var q = $q.defer();

      var userData = getSetCommonDataService.getCommonData();


     var insertParameters = [
            createUniquePiId(),
            userData.agentId,
            "" + 2,
            mailData.productId,
            mailData.isBrochureSelected,
            mailData.EmailTo,
            mailData.EmailCc,
            JSON.stringify(mailData.mailJson),
            "" + 1,
            "" + utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss'),
            userData.userName,
            "" + utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss'),
            userData.userName
          ];
          $log.debug('insertParameters', insertParameters);

          commonDBFuncSvc.query("INSERT INTO AskSwitchEmail (PkRowId,FkAgentCode,OutputType,FkProductId,IsBrochure,ToRecipients,CCRecipients,Json,IsActive,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
              insertParameters)
            .then(function(result) {
              q.resolve(result);
            });

          return q.promise;


    }
  }
]);
