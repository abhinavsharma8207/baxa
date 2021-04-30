documentScanAndUpload.service('docScanandUploadDbService', [
  '$log',
  '$q',
  '$rootScope',
  'utilityService',
  'commonDBFuncSvc',
  'getSetCommonDataService',
  function(
    $log,
    $q,
    $rootScope,
    utilityService,
    commonDBFuncSvc,
    getSetCommonDataService) {
    'use strict';
    var vm = this;
    vm.getDocumentSubtypesByDocumentTypeId = getDocumentSubtypesByDocumentTypeId;
    vm.getThumbnailsByDocumentTypeId = getThumbnailsByDocumentTypeId;
    vm.getImageData = getImageData;
    vm.getisSyncDocumentStatus = getisSyncDocumentStatus;
    vm.insertDocumentsData = insertDocumentsData;
    vm.modifyDocumentsData = modifyDocumentsData;
    vm.updateDocumentsStatusByCaseId = updateDocumentsStatusByCaseId;
    vm.getThumbnailsByDocumentTypeId1 = getThumbnailsByDocumentTypeId1;
    vm.getSubmitisSyncStatus = getSubmitisSyncStatus;
    vm.deleteProposalNumber = deleteProposalNumber;
    vm.getDocumentsStatusByCaseId = getDocumentsStatusByCaseId;
    vm.getDocumentsCountByCaseId = getDocumentsCountByCaseId;
    vm.getLatestDateForCaseId = getLatestDateForCaseId;
    vm.getDistinctCaseIds = getDistinctCaseIds;
    vm.getDocumentSourceId = getDocumentSourceId;

    /**
     * Created By: Amol W
     * Method for geting doucument subtypes by DocumentTypeId
     * e.g. passing Address Proof Category Id  as  documentTypeId and getting result of all its subtypes id (Passport,Voter ID etc.)
     **/
    function getDocumentSubtypesByDocumentTypeId(documentTypeId) {
      var parameters = ["" + documentTypeId];
      /**ORDER BY AskMapDocument.OrderKey ASC**/
      return commonDBFuncSvc
        .query(
          "SELECT AskMapDocument.FkDocumentSubTypeId, AskMapDocument.FkDocumentTypeId,AskMapDocument.FkReuse1DocumentTypeId,(SELECT NAME FROM AskMstDocumentType WHERE AskMstDocumentType.PkDocumentTypeId  = AskMapDocument.FkReuse1DocumentTypeId) AS Reuse1Name , AskMapDocument.FkReuse2DocumentTypeId ,(SELECT NAME FROM AskMstDocumentType WHERE AskMstDocumentType.PkDocumentTypeId  = AskMapDocument.FkReuse2DocumentTypeId) AS Reuse2Name , AskMapDocument.OrderKey , AskMstDocumentSubType.name FROM AskMapDocument INNER JOIN AskMstDocumentSubType ON AskMapDocument.FkDocumentSubTypeId = AskMstDocumentSubType.PkDocumentSubTypeId WHERE AskMapDocument.FkDocumentTypeId=?;",
          parameters)
        .then(function(result) {
          var paramValueResult = [];
          paramValueResult = commonDBFuncSvc.getAll(result);
          $log.debug('paramValueResult', paramValueResult);
          return paramValueResult;
        });
    }

    /**
     * Created By: Amol W
     * Method for getting Thumbnails  By DocumentTypeId
     * e.g. passing Address Proof Category Id  as  documentTypeId && ProposalNo as selectedProposalNo getting result of image data.
     **/
    function getThumbnailsByDocumentTypeId(documentTypeId, caseId) {
      /**ORDER BY AskMapDocument.OrderKey ASC**/
      var parameters = ["" + documentTypeId, "" + caseId, "" + $rootScope.currentDocumentForVal];
      $log.debug("issue", parameters);
      return commonDBFuncSvc
        .query(
          "SELECT * FROM AskDocument WHERE AskDocument.FkDocumentTypeId=? AND AskDocument.CaseId=? AND AskDocument.DocumentFor=?;",
          parameters)
        .then(function(result) {
          var paramValueResult = [];
          paramValueResult = commonDBFuncSvc.getAll(result);
          $log.debug('paramThumbnailsValueResult', paramValueResult);
          return paramValueResult;
        });
    }

    /* Method for getting Thumbnails  By IsSynced caseId */
    function getThumbnailsByDocumentTypeId1(caseId) {
      /**ORDER BY AskMapDocument.OrderKey ASC**/
      var parameters = ["" + caseId];
      return commonDBFuncSvc
        .query("SELECT * FROM AskDocument WHERE AskDocument.CaseId=?;",
          parameters)
        .then(function(result) {
          var paramValueResult = [];
          paramValueResult = commonDBFuncSvc.getAll(result);
          $log.debug('paramThumbnailsValueResult', paramValueResult);
          return paramValueResult;
        });
    }

    /**
     * Created By: Amol W
     * Method for getting Thumbnails DocumentTypeId ,subtypeId ,proposer Or LifeAssured
     * e.g. passing Address Proof Category Id  as  documentTypeId and documentSubType id as subtypeId and proposer Or LifeAssured id as proposerOrLifeAssured  for getting documents related to three parameters
     **/
    function getImageData(documentTypeId, subtypeId, proposerOrLifeAssured,
      caseId) {
      var parameters = ["" + documentTypeId,
        "" + subtypeId,
        "" + proposerOrLifeAssured,
        "" + caseId
      ];
      /**ORDER BY AskMapDocument.OrderKey ASC**/
      return commonDBFuncSvc
        .query(
          "SELECT * FROM AskDocument WHERE AskDocument.FkDocumentTypeId=? AND AskDocument.FkDocumentSubTypeId=? AND AskDocument.DocumentFor =? AND AskDocument.CaseId=?;",
          parameters)
        .then(function(result) {
          var paramValueResult = [];
          paramValueResult = commonDBFuncSvc.getAll(result);
          $log.debug('paramThumbnailsValueResult', paramValueResult);
          return paramValueResult;
        });
    }

    /**
     * Created By: Amol W
     * Method for getting syncDocument status By caseId .
     * e.g. passing ProposalNo as  caseId and getting the result In the form of 0 and 1.Where 0 is for save and 1 for submitted.
     **/
    function getisSyncDocumentStatus(caseId) {
      var parameters = ["" + caseId];
      /**ORDER BY AskMapDocument.OrderKey ASC**/
      return commonDBFuncSvc
        .query("SELECT DocumentStatus FROM AskDocument WHERE CaseId=?;",
          parameters)
        .then(function(result) {
          var paramValueResult = [];
          paramValueResult = commonDBFuncSvc.getAll(result);
          $log.debug('getisSyncDocumentStatus : ', paramValueResult);
          return paramValueResult;
        });
    }

    /**
     * Created By: Amol W
     * Method for getting Insert Documents Data By Proposer object .
     * e.g. passing Proposer object (proposalNo,ProposalNo etc.) as  data and Inserting records relating to CaseId and ProposalNo.
     **/
    function insertDocumentsData(data, documentSourceId) {
      var userData = getSetCommonDataService.getCommonData();
      var q = $q.defer();
      var parameters1 = [
        "" + data.caseId,
        "" + data.documentSubType.FkDocumentTypeId,
        "" + data.documentSubType.FkDocumentSubTypeId,
        "" + $rootScope.currentDocumentForVal
      ];
      q.resolve(commonDBFuncSvc
        .query(
          "select * from AskDocument where CaseId=? AND FkDocumentTypeId=? AND FkDocumentSubTypeId=? AND DocumentFor=?",
          parameters1)
        .then(function(result) {
          $log.debug('Select result length => ', result.rows.length);
          if (result.rows.length == "1" || result.rows.length == 1) {
            var parameters2 = [
              "" + data.imageData,
              "" + utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy HH:mm:ss'),
              "Modified User",
              "" + data.caseId,
              "" + data.documentSubType.FkDocumentTypeId,
              "" + data.documentSubType.FkDocumentSubTypeId,
              "" + $rootScope.currentDocumentForVal
            ];
            $log.debug('Updating Document : ' + JSON.stringify(
              parameters2));
            commonDBFuncSvc
              .query(
                "update AskDocument set DocumentData=?,ModifiedDate=?,ModifiedBy=? where CaseId=? AND FkDocumentTypeId=? AND FkDocumentSubTypeId=? AND DocumentFor=?",
                parameters2)
              .then(function(result) {
                $log.debug('Updated result => ', result);
              });
          } else {
            var parameters3 = [
              "" + data.proposalNo,
              "" + data.caseId,
              "" + data.documentSubType.FkDocumentTypeId,
              "" + data.documentSubType.FkDocumentSubTypeId,
              "" + data.proposerOrLifeAssured,
              "" + new Date().getTime(),
              "" + data.imageData,
              "" + 0,
              "" + 0,
              "" + 1,
              "" + utilityService.getDisplayDate(new Date(),
                'MM/dd/yyyy HH:mm:ss'),
              "" + userData.userName,
              "" + utilityService.getDisplayDate(new Date(),
                'MM/dd/yyyy HH:mm:ss'),
              "" + userData.userName,
              "" + userData.agentId,
              "" + documentSourceId,
              "" + "2", //jpeg
              "" + 1
            ];
            $log.debug('Inserting Document : ' + JSON.stringify(
              parameters3));
            commonDBFuncSvc
              .query(
                "INSERT INTO AskDocument (ProposalNo,CaseId,FkDocumentTypeId,FkDocumentSubTypeId,DocumentFor,DocumentName,DocumentData,DocumentStatus,IsSynced,IsActive,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy,FkAgentCode,FkDocumentSourceId,FkFileExtensionId,ReferenceSystemTypeId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                parameters3)
              .then(function(result) {
                $log.debug('Insert result ', result);
                q.resolve(result);
              });
          }
        }));
      return q.promise;
    }

    /*Get scan upload source id feom table to store image data in table.*/
    function getDocumentSourceId() {
      var q = $q.defer();
      commonDBFuncSvc
        .query("SELECT PkDocumentSourceId FROM AskMstDocumentSource WHERE Name='SCANUPLOAD'").then(function(result) {
          var documentSourceId = commonDBFuncSvc.getById(result);
          q.resolve(documentSourceId.PkDocumentSourceId);
        });
      return q.promise;
    }

    /**
     * Created By: Amol W
     * Method for  Modifying Documents Data By CaseId and Date.
     updating image data of proposers subtype using documenttype
     * e.g.
     **/
    function modifyDocumentsData(data) {
      if (data.imageData.length != 0) {
        var parameters2 = [
          "" + data.imageData,
          utilityService.getDisplayDate(new Date(), 'MM/dd/yyyy h:mm:ss'),
          "Logged in User",
          "" + data.caseId,
          "" + data.documentSubType.FkDocumentTypeId,
          "" + data.documentSubType.FkDocumentSubTypeId,
          "" + $rootScope.currentDocumentForVal
        ];
        $log.debug('Updating Document : ' + JSON.stringify(parameters2));
        return commonDBFuncSvc
          .query(
            "update AskDocument set DocumentData=?,ModifiedDate=?,ModifiedBy=? where CaseId=? AND FkDocumentTypeId=? AND FkDocumentSubTypeId=? AND DocumentFor=?",
            parameters2)
          .then(function(result) {
            $log.debug('Updated result => ', result);
          });
      } else {
        var parameters3 = [
          "" + data.caseId,
          "" + data.documentSubType.FkDocumentTypeId,
          "" + data.documentSubType.FkDocumentSubTypeId,
          "" + $rootScope.currentDocumentForVal
        ];
        return commonDBFuncSvc
          .query(
            "delete from AskDocument  where CaseId=? AND FkDocumentTypeId=? AND FkDocumentSubTypeId=? AND DocumentFor=?",
            parameters3)
          .then(function(result) {
            $log.debug('Updated result => ', result);
          });
      }
    }

    /**
     * change the document status to one with respect to CaseId.
     eg.change status of document on submit.
     **/
    function updateDocumentsStatusByCaseId(caseId) {
      var parameters = ["" + caseId];
      var queryString =
        "UPDATE AskDocument SET DocumentStatus = 1 WHERE CaseId = ?;";
      return commonDBFuncSvc
        .query(queryString, parameters)
        .then(function(result) {
          $log.debug('updateDocumentsStatusByCaseId : ', result);
        });
    }

    /**
     * statrt document syncing
     **/
    function getSubmitisSyncStatus(caseId) {
      var parameters = ["" + caseId];
      /**ORDER BY AskMapDocument.OrderKey ASC**/
      return commonDBFuncSvc
        .query("SELECT IsSynced FROM AskDocument WHERE CaseId=?;",
          parameters)
        .then(function(result) {
          var paramValueResult = [];
          paramValueResult = commonDBFuncSvc.getAll(result);
          $log.debug('getSubmitisSyncStatus : ', paramValueResult);
          return paramValueResult;
        });
    }

    /*changes in refactoring**/
    /**
     * Created By: Amol W
     * Method for geting DistinctCaseIds By particular userId
     * e.g. Passing userID and method will return UniqueId.
     **/
    function getDistinctCaseIds() {
      var userData = getSetCommonDataService.getCommonData();
      var q = $q.defer();
      commonDBFuncSvc
        .query("SELECT tbl.* FROM (SELECT * FROM AskDocument where FkAgentCode=?) as tbl order by (strftime('%Y-%m-%d %H:%M:%S',substr(tbl.ModifiedDate,7,4) || '-' || substr(tbl.ModifiedDate,1,2) || '-' || substr(tbl.ModifiedDate,4,2) || substr(tbl.ModifiedDate, 11,9))) DESC ", ["" + userData.agentId])
        .then(function(result) {
          var distinctCaseIds = [];
          var finaldistinctCaseIds = [];
          distinctCaseIds = commonDBFuncSvc.getAll(result);

          function removeDuplicates(originalArray, prop) {
            var newArray = [];
            var lookupObject = {};
            for (var i in originalArray) {
              lookupObject[originalArray[i][prop]] = originalArray[i];
            }
            for (i in lookupObject) {
              newArray.push(lookupObject[i]);
            }
            return newArray;
          }
          finaldistinctCaseIds = removeDuplicates(distinctCaseIds, "CaseId");
          console.warn(distinctCaseIds.length);
          console.warn(finaldistinctCaseIds.length);


          $log.debug('finaldistinctCaseIds', finaldistinctCaseIds);
          q.resolve(finaldistinctCaseIds);
        });
      return q.promise;
    }

    /**
     * Created By: Amol W
     * Method for geting LatestDateForCaseId By CaseId
     * e.g. Passing CaseId and method will return lates date.
     **/
    function getLatestDateForCaseId(caseId) {
      var parameters = ["" + caseId];
      return commonDBFuncSvc
        .query(
          "select ModifiedDate from AskDocument where CaseId=? group by ModifiedDate",
          parameters)
        .then(function(result) {
          var output = null;
          output = angular.copy(result.rows.item(0));
          $log.debug('getLatestDateForCaseId', output.ModifiedDate);
          var _date = utilityService.getDisplayDate(output.ModifiedDate,
            'dd/MM/yyyy');
          return _date;
        });
    }

    /**
     * Created By: Amol W
     * Method for geting DocumentsCount By CaseId
     * e.g. It will return number of Documents counts on summary page against particular Case
     **/
    function getDocumentsCountByCaseId(caseId) {
      var parameters = ["" + caseId];
      return commonDBFuncSvc
        .query("select FkDocumentSubTypeId from AskDocument where CaseId=?",
          parameters)
        .then(function(result) {
          $log.debug('count', result.rows.length);
          return result.rows.length;
        });
    }

    /**
     * Created By: Amol W
     * Method for geting DocumentsStatus By CaseId
     * e.g. This Method will return weather Documents are sync Or not.If documents are sync with serve it will return success If document not sync return Pending.
     **/
    function getDocumentsStatusByCaseId(caseId) {
      var parameters = ["" + caseId];
      return commonDBFuncSvc
        .query(
          "select DocumentStatus,IsSynced from AskDocument where CaseId=?",
          parameters)
        .then(function(result) {
          var documentsStatus = [];
          var syncStatus = [];
          var output = [];
          output = commonDBFuncSvc.getAll(result);

          for (var i = 0; i < output.length; i++) {
            documentsStatus.push(output[i].DocumentStatus);
            syncStatus.push(output[i].IsSynced);
          }

          if ((utilityService.arrayObjectIndexOf(syncStatus, '1.0') != -1) ||
            (utilityService.arrayObjectIndexOf(syncStatus, '1') != -1)) {
            return 'Synced';
          } else if ((utilityService.arrayObjectIndexOf(documentsStatus,
              '1.0') != -1) || (utilityService.arrayObjectIndexOf(
              documentsStatus, '1') != -1)) {
            return 'Submitted';
          } else {
            return 'Pending';
          }
        });
    }

    /**Delete the proposer numeber.**/
    function deleteProposalNumber(caseId) {
      var q = $q.defer();
      var parameters = ["" + caseId];
      commonDBFuncSvc
        .query("delete from AskDocument where CaseId =?", parameters)
        .then(function(result) {
          $log.debug('delete proposal number result => ', result);
          q.resolve(result);
        });
      return q.promise;
    }
  }
]);
