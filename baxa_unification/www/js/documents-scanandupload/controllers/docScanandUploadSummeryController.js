documentScanAndUpload.controller('docScanandUploadSummeryController', ['$scope',
  '$q',
  '$log',
  '$http',
  '$rootScope',
  '$state',
  '$filter',
  '$ionicHistory',
  '$ionicNavBarDelegate',
  '$ionicTabsDelegate',
  '$ionicListDelegate',
  'selectedCaseDetailsService',
  'docScanandUploadService',
  'docScanandUploadDbService',
  'utilityService',
  function(
    $scope,
    $q,
    $log,
    $http,
    $rootScope,
    $state,
    $filter,
    $ionicHistory,
    $ionicNavBarDelegate,
    $ionicTabsDelegate,
    $ionicListDelegate,
    selectedCaseDetailsService,
    docScanandUploadService,
    docScanandUploadDbService,
    utilityService) {
    'use strict';
    $ionicHistory.clearHistory();

    /**variable & flags**/
    $scope.title = "Scan & Upload";
    $scope.flagShowPopup = false;
    $scope.proposalNumberErrorMessage = "";
    $scope.reEnterProposalNmberErrorMessage = "";
    $scope.proposerIdPresentMessage = "";
    $scope.proposerIdPresent = "";
    $scope.cannotEditthisCase = false;
    $scope.showDeleteProposalNumber = false;
    $scope.deleteProposalNumber = "";
    $scope.response = "";
    $scope.showdocumentpage = false;
    $scope.selectedProposalNumber = 0;
    $scope.selectedCaseId = "";
    $scope.validationMessages = "";
    $scope.isTablet = false;
    $rootScope.positionHorizontalScroll = 0;

    /*Get validation messages */
    $http.get('js/documents-scanandupload/dsuValidationMessages.json').then(function(messages) {
      $scope.validationMessages = messages.data;
    });

    /*Check tablet or mobile in angular*/
    if (screen.width > screen.height) {
      $scope.isTablet = true;
    } else {
      $scope.isTablet = false;
    }

    /**Get summery data.**/
    $scope.objectForProposalNumbers = docScanandUploadService.processSummaryData()
      .then(function(value) {
        $log.debug('objectForProposalNumbers ', value);
        $scope.objectForProposalNumbers = value;
        return value;
      });

    /**When Tabs chnaged then  set seleted proposal number to 0 */
    $scope.tabChnaged = function() {
      $scope.selectedProposalNumber = 0;
      $scope.selectedCaseId = 0;
    };

    /**Date format for filtering records**/
    var date = new Date();
    $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
    $scope.ddMMMMyyyy = $filter('date')(new Date(), 'dd MMMM, yyyy');
    $scope.HHmmss = $filter('date')(new Date(), 'HH:mm:ss');
    $scope.hhmmsstt = $filter('date')(new Date(), 'hh:mm:ss a');

    /**Yesterdays date**/
    var lastDate = date.setDate(date.getDate() - 1);
    $scope.previousDay = $filter('date')(lastDate, 'dd/MM/yyyy');
    var docSUObj = $scope;

    /**Show popup to enter proposal number.**/
    docSUObj.showPopup = function() {
      $scope.proposalNumberErrorMessage = "";
      $scope.reEnterProposalNmberErrorMessage = "";
      $scope.flagShowPopup = true;
    };

    /**save proposal details in service and redirect to scan and uplaod.**/
    docSUObj.loadSelectedProposalDetails = function(selectedProposalNoData) {
      $scope.selectedCaseId = selectedProposalNoData.caseId;
      $scope.selectedProposalNumber = selectedProposalNoData.ProposalNo;
      var data = {
        'proposalNo': selectedProposalNoData.ProposalNo,
        'caseId': selectedProposalNoData.caseId,
        'categoryNo': selectedProposalNoData.categoryNo,
        'subTypeNo': selectedProposalNoData.subTypeNo
      };

      /**setting data in service to pass in scan and upload controller**/
      selectedCaseDetailsService.setSelectedData(data);
      $rootScope.selectedProof = 1;
      $scope.showdocumentpage = true;
      $rootScope.selProposalNo = selectedProposalNoData.ProposalNo;
      if (screen.width > screen.height) {
        $log.debug(" $state.current.name :", $state.current.name);
        $rootScope.selectedProof = 1;
        /*Load thumbnails as per document type */
        var thumbnails = docScanandUploadDbService.getThumbnailsByDocumentTypeId($rootScope.selectedProof, $scope.selectedCaseId);
        thumbnails.then(function(result) {
          $rootScope.thumbanilsForAllSubtypes = result;

          /*Load document type as per document type */
          var documentSubtypes = docScanandUploadDbService.getDocumentSubtypesByDocumentTypeId($rootScope.selectedProof);
          documentSubtypes.then(function(result) {
            $rootScope.showChooseDocPopup = false;
            $rootScope.otherFrequentlyUploadedDocuments = result;

            /**Get the thumbnails of document type to check weather the document type imagedata is synced or not.**/
            var thumbnailsForDocumentTypes = docScanandUploadDbService.getThumbnailsByDocumentTypeId1($scope.selectedCaseId);
            thumbnailsForDocumentTypes.then(function(result1) {
              $rootScope.thumbanilsForAllDocumentTypes = result1;
              $state.transitionTo($state.$current, null, null);

            });
          });
        });

      } else {
        $state.go('app.document-scan-and-upload');
      }
    };

    /**Refresh the proposal number records.**/
    docSUObj.refreshProposalNumbers = function() {
      $scope.selectedCaseId = 0;
      $scope.showdocumentpage = false;
      $scope.objectForProposalNumbers = docScanandUploadService.processSummaryData()
        .then(function(value) {
          $log.debug('objectForProposalNumbers ', value);
          $scope.objectForProposalNumbers = value;
          return value;
        });
    };

    /**Show popup for deleting proposal number.**/
    docSUObj.showDeleteProposalPopup = function(proposalNumber) {
      $scope.showDeleteProposalNumber = true;
      $scope.deleteProposalNumber = proposalNumber;
    };

    /**Hide popup for deleting proposal number.**/
    docSUObj.hideDeleteProposalPopup = function() {
      $scope.showDeleteProposalNumber = false;
    };
    /*Delete proposal number and refresh the proposal number*/
    $scope.deleteProposalNumberOnOk = function() {
      docScanandUploadDbService.deleteProposalNumber($scope.deleteProposalNumber)
        .then(function(value) {
          $scope.showDeleteProposalNumber = false;
          $scope.objectForProposalNumbers = docScanandUploadService.processSummaryData()
            .then(function(value) {
              $log.debug('objectForProposalNumbers ', value);
              $scope.objectForProposalNumbers = value;
              return value;
            });

        });
    };

    /**Check proposal number already present or not.**/
    docSUObj.checkProposalNumber = function(proposalNumber, reEnterProposalNmber) {
      var errorMessage = $scope.validation(proposalNumber);
      if (errorMessage != true) {
        $scope.proposalNumberErrorMessage = errorMessage;
      } else {
        $scope.proposalNumberErrorMessage = "";
        errorMessage = $scope.validation(reEnterProposalNmber);
        if (errorMessage != true) {
          $scope.reEnterProposalNmberErrorMessage = errorMessage;
        } else {
          $scope.reEnterProposalNmberErrorMessage = "";
          if (docSUObj.compareString(proposalNumber, reEnterProposalNmber) == true) {
            $scope.alreadyPresent = docSUObj.checkProposalNumberInDatabase(proposalNumber);
            if ($scope.alreadyPresent != null) {
              $scope.flagShowPopup = false;
              $scope.proposerIdPresent = true;
              $scope.proposerIdPresentMessage = "Proposal No. already exist";
            } else {
              $scope.setCaseId(proposalNumber);
              /**setting data in service to pass in scan and upload controller**/
              $rootScope.selectedProof = 1;
              $rootScope.selProposalNo = proposalNumber;
              $state.go('app.document-scan-and-upload');
            }
          } else {
            $scope.reEnterProposalNmberErrorMessage = $scope.validationMessages.proposalnomatcherr;
            //  "Proposal number and re enter proposal number not matching.";
          }
        }
      }
    };

    /**search proposal number.**/
    docSUObj.checkProposalNumberInDatabase = function(proposalNumber) {
      for (var i = 0; i < $scope.objectForProposalNumbers.length; i++) {
        if ($scope.objectForProposalNumbers[i].ProposalNo == proposalNumber && $scope.objectForProposalNumbers[i].Status == "Pending") {
          return $scope.objectForProposalNumbers[i];
        }
      }
    };

    /**Proposal number validation.**/
    docSUObj.validation = function(value) {
      if (docSUObj.lengthGreaterThan0(value) == true) {
        if ($scope.lengthValidation(value) == true) {
          return true;
        } else {
          return $scope.validationMessages.proposalnolength;
        }
      } else {
        return $scope.validationMessages.proposalnoinvalid;
      }
    };

    /**Close popup.**/
    docSUObj.closePopup = function() {
      $scope.flagShowPopup = false;
      $scope.proposerIdPresent = false;
    };

    /**Highlight proposal number on summery page.**/
    docSUObj.highlightProposalNumberOnSummeryPage = function(proposalNumber) {
      if ($scope.alreadyPresent.Date == $scope.ddMMyyyy) {
        $ionicTabsDelegate.select(0);
      } else if ($scope.alreadyPresent.Date == $scope.previousDay) {
        $ionicTabsDelegate.select(1);
      } else {
        $ionicTabsDelegate.select(2);
      }
      $scope.setCaseId(proposalNumber);
      $scope.proposerIdPresent = false;
    };

    /**Check yeaterdays date.**/
    docSUObj.dateLessThanYesterday = function(date) {
      var yesterdaysDate = docSUObj.previousDay;
      yesterdaysDate = yesterdaysDate.split("/");
      var proposalDate = date;
      proposalDate = proposalDate.split("/");
      if (yesterdaysDate[2] > proposalDate[2]) {
        return true;
      } else {
        if (yesterdaysDate[2] == proposalDate[2]) {
          if (yesterdaysDate[1] > proposalDate[1]) {
            return true;
          } else {
            if (yesterdaysDate[1] == proposalDate[1]) {
              if (yesterdaysDate[0] > proposalDate[0]) {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          }
        } else {
          return false;
        }
      }
    };

    /**Set Object For proposal number.**/
    $scope.setCaseId = function(proposalNumber) {
      $scope.proposerIdPresent = false;
      var data = {
        'proposalNo': proposalNumber,
        'caseId': docScanandUploadService.getUniqueCaseId(''),
        'categoryNo': 1
      };
      selectedCaseDetailsService.setSelectedData(data);
    };

    /**functions used in Validation.**/
    docSUObj.compareString = function(proposalNumber, reEnteredProposalNmber) {
      if (proposalNumber === reEnteredProposalNmber) {
        return true;
      } else {
        return $scope.validationMessages.proposalnomatcherr;
      }
    };

    /**Check length of Proposal number.**/
    docSUObj.lengthValidation = function(value) {
      if (value.length < 7 || value.length > 10) {
        return $scope.validationMessages.proposalnolength;
      } else {
        return true;
      }
    };

    /**Check the proposal number entered or not.**/
    docSUObj.lengthGreaterThan0 = function(value) {
      var error = "";
      if (value == undefined || value == null) {
        return $scope.validationMessages.proposalnoinvalid;
      } else if (value.length <= 0) {
        return $scope.validationMessages.proposalnoinvalid;
      } else {
        return true;
      }
    };

    /**Show document selection popup**/
    $scope.showCanNotEditThisCase = function(proposerData) {
      $scope.selectedProposalNumber = proposerData.ProposalNo;
      $scope.selectedCaseId = proposerData.caseId;
      $scope.showdocumentpage = false;
      $scope.cannotEditthisCase = true;
    };

    /**Hide document selection popup**/
    $scope.hideCanNotEditThisCase = function() {
      $scope.cannotEditthisCase = false;
      // $state.transitionTo($state.$current, null, {reload : true});
    };

    /*Tab Controller*/
    $scope.onTabSelectedToday = function() {
      $ionicListDelegate.closeOptionButtons();
      
    };
    $scope.onTabSelectedYesterday = function() {
      $ionicListDelegate.closeOptionButtons();
    };
    $scope.onTabSelectedOlder = function() {
      $ionicListDelegate.closeOptionButtons();
    };


  }
]);
