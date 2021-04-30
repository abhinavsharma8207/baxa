documentScanAndUpload.service('docScanandUploadService', [
  '$q',
  '$log',
  '$cordovaDevice',
  'commonDBFuncSvc',
  'utilityService',
  'docScanandUploadDbService',
  function(
     $q,
     $log,
     $cordovaDevice,
     commonDBFuncSvc,
     utilityService,
    docScanandUploadDbService) {
    'use strict';

    var vm                  = this;
    vm.getUniqueCaseId      = getUniqueCaseId;
    vm.processSummaryData   = processSummaryData;
    vm.deleteProposalNumber = deleteProposalNumber;

    /**
     * Created By: Amol W
     * Method for geting UniqueCaseId By particular userId
     * e.g. Passing userID and method will generate unique id as per logic mentioned and return UniqueId.
     **/
    function getUniqueCaseId(userID) {
      var uuid;
      try {
        uuid = $cordovaDevice.getUUID();
      } catch (err) {
        uuid = 'testUUID';
      }
      var time = new Date().getTime();
      var uniqueId = userID + uuid + time;
      $log.debug('uniqueId', uniqueId);
      return uniqueId;
    };

    /**
    *Created By Uddhav
    * This method will delete the proposal number.
    **/
    function deleteProposalNumber(caseNo){
      docScanandUploadDbService.deleteProposalNumber(caseNo).then(function(val){
          return val;
      });
    };

    /**
     * Created By: Amol W
     * This method will return all the data that we will able to see on landing page(SummaryData)
     **/
    function processSummaryData() {
      var getVal = function(value) {
        $log.debug('resolved ', value);
        return value;
      };

      var q = $q.defer();
      docScanandUploadDbService.getDistinctCaseIds().then(function(
        distinctCaseIds) {
        var summaryData = [];
        $log.debug('distinctCaseIds', distinctCaseIds);
        for (var i = 0; i < distinctCaseIds.length; i++) {
          $q.all([
              i,
              docScanandUploadDbService.getLatestDateForCaseId(
                distinctCaseIds[i].CaseId).then(getVal),
              docScanandUploadDbService.getDocumentsCountByCaseId(
                distinctCaseIds[i].CaseId).then(getVal),
              docScanandUploadDbService.getDocumentsStatusByCaseId(
                distinctCaseIds[i].CaseId).then(getVal)
            ])
            .then(function(values) {
              var caseData = [];
              $log.debug('caseId', distinctCaseIds[values[0]].CaseId);
              $log.debug('CaseNo', distinctCaseIds[values[0]].CaseNo);
              caseData.caseId = distinctCaseIds[values[0]].CaseId;
              caseData.ProposalNo = distinctCaseIds[values[0]].ProposalNo;
              caseData.Date = values[1];
              caseData.TotalDocs = values[2];
              caseData.Status = values[3];
              caseData.ModifiedDate =  Date.parse(distinctCaseIds[values[0]].ModifiedDate);
              summaryData.push(caseData);
              $log.debug('summaryData', summaryData);
              if (values[0] == distinctCaseIds.length - 1) {
                q.resolve(summaryData);
              }
            });
        }
      });
      return q.promise;
    }

  }
]);
