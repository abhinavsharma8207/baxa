unificationBAXA.service('quoteProposalNosDataService', [
  '$q',
  '$log',
  '$ionicLoading',
  'commonDBFuncSvc',
  'AuthenticationService',
  'quoteProposalRefNosFactory',
  'getSetCommonDataService',
  'utilityService',
  'sendBIEmailService',
  function($q, $log, $ionicLoading, commonDBFuncSvc, AuthenticationService, quoteProposalRefNosFactory,
    getSetCommonDataService, utilityService, sendBIEmailService) {
    'use strict';
    var vm = this;
    vm.insertBIQuoteNumbers = insertBIQuoteNumbers;
    vm.insertProposalNumbers = insertProposalNumbers;
    vm.updateBIQuoteNumberUsedStatus = updateBIQuoteNumberUsedStatus;
    vm.updateProposalNumberUsedStatus = updateProposalNumberUsedStatus;
    vm.isBiQuoteRefNosDownloadRequired = isBiQuoteRefNosDownloadRequired;
    vm.isProposalRefNosDownloadRequired = isProposalRefNosDownloadRequired;
    vm.getBIQuoteNumber = getBIQuoteNumber;
    vm.getProposalNumber = getProposalNumber;
    vm.getBIProposalRefNoData = getBIProposalRefNoData;
    vm.insertQuoteData = insertQuoteData;
    vm.insertRidersData = insertRidersData;
    vm.isQuoteDataInsertRequired = isQuoteDataInsertRequired;
    vm.resetTempBiJsonTbl = resetTempBiJsonTbl;
    vm.saveQuoteEmailData = saveQuoteEmailData;
    vm.sendQuoteEmailData = sendQuoteEmailData;

    function getBIProposalRefNoData() {
      var usersData = {
        agentId: localStorage.getItem("agentId"),
        channelId: localStorage.getItem("channelId"),
        channelName: localStorage.getItem("channelName"),
        mPwd: localStorage.getItem("mPwd"),
        userName: localStorage.getItem("userName")
      };
      AuthenticationService.getAuthToken()
        .success(function(responcedata, status, headers, config) {
          isBiQuoteRefNosDownloadRequired(usersData.agentId)
            .then(function(isRequired) {
              $log.debug('isBiQuoteRefNosDownloadRequired :', isRequired);
              if (isRequired) {
                quoteProposalRefNosFactory.getBIQuoteNumbers(usersData.agentId, responcedata.token)
                  .success(function(respData, status, headers, config) {
                    if (respData.output[0].errorCode == 1000) {
                      insertBIQuoteNumbers(usersData.agentId, respData.output[0].startCount, respData.output[0].endCount)
                        .then(function(response) {
                          $log.debug('insertBIQuoteNumbers response :', response);
                        });
                    }
                  })
                  .error(function(respData, status, headers, config) {
                    $log.debug('error respData :', respData);
                  });
              }
            });

          isProposalRefNosDownloadRequired(usersData.agentId)
            .then(function(isRequired) {
              if (isRequired) {
                if (isRequired) {
                  quoteProposalRefNosFactory.getProposalNumbers(usersData.agentId, responcedata.token)
                    .success(function(respData, status, headers, config) {
                      if (respData.output[0].errorCode == 1000) {
                        insertProposalNumbers(usersData.agentId, respData.output[0].startCount, respData.output[0].endCount)
                          .then(function(response) {
                            $log.debug('insertProposalNumbers response :', response);
                          });
                      }
                    })
                    .error(function(respData, status, headers, config) {
                      $log.debug('error respData :', respData);
                    });
                }
              }
            });
        })
        .error(function(data, status, headers, config) {
          //error
          $log.debug("inside error getAuthToken : ", data);
          $log.debug("inside sucess getAuthToken status : ", status);
        });
    }

    /**
     * insertBIQuoteNumbers is method for inserting
     * BI Quote Numbers in BiProposalRefNos table.
     * @Parameters : agentId , quoteNumbers
     */
    function insertBIQuoteNumbers(agentId, quoteNumbersStartCount, quoteNumbersEndCount) {
      var q = $q.defer();
      var query = "INSERT INTO BiRefNos (AgentID, BiQuoteNo,BiQuoteNoUsedStatus) VALUES ";
      var data = [];
      var rowArgs = [];
      for (var i = quoteNumbersStartCount; i <= quoteNumbersEndCount; i++) {
        rowArgs.push("(?, ?, ?)");
        data.push("" + agentId);
        data.push("" + i);
        data.push(0);
      }
      query += rowArgs.join(", ");
      commonDBFuncSvc.query(query, data)
        .then(function(result) {
          q.resolve("success");
        });
      return q.promise;
    }

    /**
     * insertProposalNumbers is method for inserting
     * proposal Numbers in ProposalRefNos table.
     * @Parameters : agentId , proposalNumbers
     */
    function insertProposalNumbers(agentId, proposalNumbersStartCount, proposalNumbersEndCount) {
      var q = $q.defer();
      var query = "INSERT INTO ProposalRefNos (AgentID, ProposalNO,ProposalNoUsedStatus) VALUES ";
      var data = [];
      var rowArgs = [];
      for (var i = proposalNumbersStartCount; i <= proposalNumbersEndCount; i++) {
        rowArgs.push("(?, ?, ?)");
        data.push("" + agentId);
        data.push("" + i);
        data.push(0);
      }
      query += rowArgs.join(", ");
      commonDBFuncSvc.query(query, data)
        .then(function(result) {
          q.resolve("success");
        });
      return q.promise;
    }

    /**
     * updateBIQuoteNumberUsedStatus is method for updating
     * biQuoteNumber used status from 0 to 1 in BiProposalRefNos table.
     * @Parameters : biQuoteNumber
     */
    function updateBIQuoteNumberUsedStatus(biQuoteNumber) {
      $log.debug("biQuoteNumber", biQuoteNumber);
      var q = $q.defer();
      var query = "UPDATE BiRefNos SET BiQuoteNoUsedStatus=1 WHERE BiQuoteNo=" + biQuoteNumber;
      $log.debug("updateBIQuoteNumberUsedStatus Query :", query);
      commonDBFuncSvc.query(query)
        .then(function(result) {
          q.resolve("success");
        });
      return q.promise;
    }

    /**
     * updateProposalNumberUsedStatus is method for updating
     * proposalNumber used status from 0 to 1 in ProposalRefNos table.
     * @Parameters : proposalNumber
     */
    function updateProposalNumberUsedStatus(proposalNumber) {
      var q = $q.defer();
      var query = "UPDATE ProposalRefNos SET ProposalNoUsedStatus   = '" + 1 + "', WHERE ProposalNO = " + proposalNumber + " ;";
      $log.debug("updateProposalNumberUsedStatus Query :", query);
      commonDBFuncSvc.query(query)
        .then(function(result) {
          q.resolve("success");
        });
      return q.promise;
    }

    /**
     * getBIQuoteNumbersUnusedCount is method for
     * getting count of unused quote numbers
     * from BiProposalRefNos table.
     * @Parameters : agentId
     */
    function isBiQuoteRefNosDownloadRequired(agentId) {
      var q = $q.defer();
      var query = "Select BiQuoteNo From BiRefNos WHERE agentId= " + agentId + " AND BiQuoteNoUsedStatus=0";
      $log.debug("getBIQuoteNumbersUnusedCount query :" + query);
      commonDBFuncSvc.query(query)
        .then(function(result) {
          var count = commonDBFuncSvc.getCount(result);
          if (parseInt(count) < 5) {
            q.resolve(true);
          } else {
            q.resolve(false);
          }
        });
      return q.promise;
    }

    /**
     * getProposalNumbersUnusedCount is method for
     * getting count of unused proposal numbers
     * from BiProposalRefNos table.
     * @Parameters : agentId
     */
    function isProposalRefNosDownloadRequired(agentId) {
      var q = $q.defer();
      var query = "Select ProposalNO From ProposalRefNos WHERE agentId= " + agentId + " AND ProposalNoUsedStatus=0";
      commonDBFuncSvc.query(query)
        .then(function(result) {
          var count = commonDBFuncSvc.getCount(result);
          if (parseInt(count) < 5) {
            q.resolve(true);
          } else {
            q.resolve(false);
          }
        });
      return q.promise;
    }

    /**
     * getBIQuoteNumber is method for
     * getting unused bi Quote Number
     * from BiProposalRefNos table.
     * @Parameters : agentId
     */
    function getBIQuoteNumber(agentId) {
      var q = $q.defer();
      var query = "Select BiQuoteNo From BiRefNos WHERE agentId= " + agentId + " AND BiQuoteNoUsedStatus=0";
      commonDBFuncSvc.query(query)
        .then(function(result) {
          var biQuoteNumber = commonDBFuncSvc.getById(result);
          q.resolve(biQuoteNumber);
        });
      return q.promise;
    }

    /**
     * getProposalNumber is method for
     * getting unused proposal Number
     * from BiProposalRefNos table.
     * @Parameters : agentId
     */
    function getProposalNumber(agentId) {
      var q = $q.defer();
      var query = "Select ProposalNO From ProposalRefNos WHERE agentId= " + agentId + " AND ProposalNoUsedStatus=0";
      commonDBFuncSvc.query(query)
        .then(function(result) {
          var proposalNumber = commonDBFuncSvc.getById(result);
          q.resolve(biQuoteNumber);
        });
      return q.promise;
    }

    function insertQuoteData(quoteData) {
      var userData = getSetCommonDataService.getCommonData();
      var q = $q.defer();
      var parameters = [
        quoteData.PkQuotationId,
        quoteData.ReferenceSystemTypeId,
        quoteData.FkProductId,
        quoteData.ProductPlanCode,
        quoteData.FkAgentCode,
        quoteData.BuyingFor,
        quoteData.LAFirstName,
        quoteData.LALastName,
        quoteData.LAGender,
        quoteData.LADOB,
        quoteData.ProposerFirstName,
        quoteData.ProposerLastName,
        quoteData.ProposerGender,
        quoteData.ProposerDOB,
        quoteData.IsSmoker,
        "" + quoteData.UptoAge,
        "" + quoteData.PayType,
        "" + quoteData.BenefitType,
        quoteData.PremiumPaymentTerm,
        quoteData.PolicyTerm,
        quoteData.SumAssured,
        quoteData.GuaranteedIncomePeriod,
        quoteData.MaturityPayoutPeriod,
        quoteData.MaturityPayoutFrequency,
        quoteData.FlexiBenefitPeriod,
        quoteData.AnnualBasePremium,
        quoteData.Mode,
        quoteData.ModalFactor,
        quoteData.ModalPremium,
        quoteData.IsNSAP,
        quoteData.ServiceTax,
        quoteData.PremiumPayable,
        quoteData.IsInYourPresence,
        quoteData.EstimatedReturnRate,
        quoteData.Json,
        "" + 1,
        "" + utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss'),
        userData.userName,
        "" + utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss'),
        userData.userName
      ];

      commonDBFuncSvc
        .query(
          "INSERT INTO AskQuotation " +
          "(" +
          "PkQuotationId,ReferenceSystemTypeId,FkProductId,ProductPlanCode,FkAgentCode," +
          "BuyingFor,LAFirstName,LALastName,LAGender,LADOB," +
          "ProposerFirstName,ProposerLastName,ProposerGender,ProposerDOB,IsSmoker," +
          "UptoAge,PayType,BenefitType,PremiumPaymentTerm,PolicyTerm," +
          "SumAssured,GuaranteedIncomePeriod,MaturityPayoutPeriod,MaturityPayoutFrequency,FlexiBenefitPeriod," +
          "AnnualBasePremium,Mode,ModalFactor,ModalPremium,IsNSAP," +
          "ServiceTax,PremiumPayable,IsInYourPresence,EstimatedReturnRate," +
          "Json,IsActive,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy" +
          ") " +
          "VALUES " +
          "(" +
          "?,?,?,?,?," +
          "?,?,?,?,?," +
          "?,?,?,?,?," +
          "?,?,?,?,?," +
          "?,?,?,?,?," +
          "?,?,?,?,?," +
          "?,?,?,?,?," +
          "?,?,?,?,?" +
          ")",
          parameters)
        .then(function(result) {
          $log.debug('Insert result ', result);
          q.resolve(result);
        });
      return q.promise;
    }

    function insertRidersData(riderData) {
      var userData = getSetCommonDataService.getCommonData();
      var q = $q.defer();
      var promises = [];
      for (var i = 0; i < riderData.length; i++) {
        var parameters = [
          riderData[i].FkAgentCode,
          riderData[i].FkQuotationId,
          riderData[i].FkRiderId,
          riderData[i].RiderPlanCode,
          //riderData[i].ReferenceSystemTypeId,
          riderData[i].Term,
          riderData[i].SumAssured,
          riderData[i].IsNSAPProposer,
          riderData[i].ModalPremium,
          riderData[i].ServiceTaxPayable,
          riderData[i].PremiumPayable,
          "" + 1,
          "" + utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss'),
          userData.userName,
          "" + utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss'),
          userData.userName
        ];
        promises.push(
          commonDBFuncSvc
          .query(
            "INSERT INTO AskRiderDetail " +
            "(" +
            "FkAgentCode,FkQuotationId,FkRiderId,RiderPlanCode," +
            "Term,SumAssured,IsNSAPProposer,ModalPremium,ServiceTaxPayable," +
            "PremiumPayable," +
            "IsActive,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy" +
            ") " +
            "VALUES " +
            "(" +
            "?,?,?,?," +
            "?,?,?,?,?," +
            "?," +
            "?,?,?,?,?" +
            ")",
            parameters));
      }
      $q.all(promises).then(function() {
        q.resolve("success");
      });
      return q.promise;
    }

    function isQuoteDataInsertRequired(tempBiJson) {
      var q = $q.defer();
      var query = "Select TempJson From TempBiJson WHERE TempJson= '" + tempBiJson + "'";
      commonDBFuncSvc.query(query)
        .then(function(result) {
          var count = commonDBFuncSvc.getCount(result);
          $log.debug("count************", count);
          if (count > 0) {
            q.resolve(false);
          } else {
            $log.debug("inserting data");
            var parameters = ["" + tempBiJson];
            var insertquery = "Insert into TempBiJson (TempJson) VALUES (?)";
            commonDBFuncSvc.query(insertquery, parameters)
              .then(function(result) {
                q.resolve(true);
              });
          }
        });
      return q.promise;
    }

    function resetTempBiJsonTbl() {
      var q = $q.defer();
      var query = "delete from TempBiJson";
      commonDBFuncSvc.query(query)
        .then(function(result) {
          q.resolve(true);
        });
      return q.promise;
    }

    /**Save Email Data on click on sendEmail button in offline mode **/
    function saveQuoteEmailData(biRefNo, emailData, irdaJson,productId) {
      $log.debug(' biRefNo :', biRefNo);
      $log.debug(' emailData :', emailData);
      $log.debug(' productId :', productId);
      var q = $q.defer();
      var userData = getSetCommonDataService.getCommonData();
      var insertParameters = [
            biRefNo,//ReferenceId ReferenceId = QuotationId when OutputType = 3,
            userData.agentId + "-" + new Date().getTime(),//CaseId
            userData.agentId,//FkAgentCode
            "" + 3,//OutputType  3 = Benefit Illustration
            null,//FkCalculatorId
            productId,//FkProductId
            "0",//IsBrochure 0 = Do not send brochure
            emailData.EmailTo,//ToRecipients
            emailData.EmailCc,//CCRecipients
            irdaJson,//Json
            "" + 1,//IsActive
            "" + utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss'),//CreatedDate
            userData.userName,//CreatedBy
            "" + utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy hh:mm:ss'),//ModifiedBy
            userData.userName//ModifiedDate
          ];
          $log.debug('insertParameters', insertParameters);
          commonDBFuncSvc.query("INSERT INTO AskEmail (ReferenceId,CaseId,FkAgentCode,OutputType,FkCalculatorId,FkProductId,IsBrochure,ToRecipients,CCRecipients,Json,IsActive,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy)" +
          " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              insertParameters)
            .then(function(result) {
              q.resolve(result);
            });
          return q.promise;
    }

    /** Send Email On the fly**/
    function sendQuoteEmailData(biRefNo, emailData, irdaJson,productId) {
      $log.debug(' biRefNo :', biRefNo);
      $log.debug(' emailData :', emailData);
      $log.debug(' irdaJson :', irdaJson);
      $log.debug(' productId :', productId);

      sendBIEmailService.sendBIEmail(biRefNo, emailData, irdaJson)
        .then(function(responcedata, status, headers, config) {
          $ionicLoading.hide();
          $log.debug(' Success Data :', responcedata);
        });
        // .error(function(respData, status, headers, config) {
        //   $ionicLoading.hide();
        //   $log.debug('error respData :', respData);
        // });
    }
  }
]);
