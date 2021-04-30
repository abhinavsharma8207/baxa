documentScanAndUpload.controller('docScanandUploadController', [
  '$state',
  '$scope',
  '$rootScope',
  '$log',
  '$ionicPlatform',
  '$ionicHistory',
  '$ionicLoading',
  '$ionicNavBarDelegate',
  '$ionicScrollDelegate',
  '$cordovaCamera',
  '$cordovaFile',
  '$cordovaImagePicker',
  '$cordovaToast',
  '$cordovaNetwork',
  '$timeout',
  'documenttypes',
  'docScanandUploadDbService',
  'commonDBFuncSvc',
  'utilityService',
  'selectedCaseDetailsService',
  'Base64',
  'camQuality',
  'dsuMaxImagesCount',
  function(
    $state,
    $scope,
    $rootScope,
    $log,
    $ionicPlatform,
    $ionicHistory,
    $ionicLoading,
    $ionicNavBarDelegate,
    $ionicScrollDelegate,
    $cordovaCamera,
    $cordovaFile,
    $cordovaImagePicker,
    $cordovaToast,
    $cordovaNetwork,
    $timeout,
    documenttypes,
    docScanandUploadDbService,
    commonDBFuncSvc,
    utilityService,
    selectedCaseDetailsService,
    Base64,
    camQuality,
    dsuMaxImagesCount) {
    'use strict';
    var tempReviewImagesArray = [];
    $scope.title = "Scan & Upload";
    $scope.showPreviewPopup = false;
    $scope.selectedProposalNo = "";
    $scope.selectedCaseId = "";
    $scope.showOtherDocuments = false;
    $scope._isEnableSubmitBtn = false;
    $scope.blockChooseDocument = false;
    $scope.cannotEditthisCase = false;
    $rootScope.showChooseDocPopup = false;
    $rootScope.proposerOrLifeAssured = 0;
    $rootScope.currentDocumentForVal = 0;
    $rootScope.thumbanilsForAllDocumentTypes = [];

    //Added watch for the data which sent from summery Page.
    $scope.$watch(function() {
      return selectedCaseDetailsService.getSelectedData();
    }, function(newValue, oldValue) {
      if (newValue != null) {
        $scope.selectedProposalNo = newValue.proposalNo;
        $scope.selectedCaseId = newValue.caseId;
        /**get thumbnails of selected proposal number.**/
        var thumbnails = docScanandUploadDbService.getThumbnailsByDocumentTypeId($rootScope.selectedProof, $scope.selectedCaseId);
        thumbnails.then(function(result) {
          $rootScope.thumbanilsForAllSubtypes = result;
          /**Get the thumbnails of document type to check weather the document type imagedata is synced or not.**/
          var thumbnailsForDocumentTypes = docScanandUploadDbService.getThumbnailsByDocumentTypeId1($scope.selectedCaseId);
          thumbnailsForDocumentTypes.then(function(result1) {
            $rootScope.thumbanilsForAllDocumentTypes = result1;
          });
        });

        /**initialise document types to work in filters.**/
        $scope.tabs = [];
        for (var i = 0; i < documenttypes.length; i++) {
          $scope.tabs.push(documenttypes[i]);
        }

        /**get the subtypes of document type.**/
        var documentSubtypes = docScanandUploadDbService.getDocumentSubtypesByDocumentTypeId($rootScope.selectedProof);
        documentSubtypes.then(function(result) {
          $rootScope.showChooseDocPopup = false;
          $rootScope.otherFrequentlyUploadedDocuments = result;
        });

        /**Get sync status of document.**/
        var checkIsSync = docScanandUploadDbService.getisSyncDocumentStatus($scope.selectedCaseId)
          .then(function(syncData) {
            var keepGoing = true;
            syncData.forEach(function(element) {
              if (keepGoing) {
                if (element.DocumentStatus == '0.0' || element.DocumentStatus ==
                  '0') {
                  $scope._isEnableSubmitBtn = true;
                  $scope.blockChooseDocument = false;
                  keepGoing = false;
                } else {
                  $scope._isEnableSubmitBtn = false;
                  $scope.blockChooseDocument = true;
                }
              }
            }, this);
          });
      }
    }, true);

    /**Set records for seelcted document type.**/
    $scope.onClickChooseDocument = function(documentSubType) {
      //$scope.showCamera = true;
      $scope.documentSubType = documentSubType.FkDocumentSubTypeId;
      /**Get the  proposalNo,caseNo,categoryNo,subTypeNo frm service**/
      $scope.$watch(function() {
        return selectedCaseDetailsService.getSelectedData();
      }, function(newValue, oldValue) {
        if (newValue != null) {
          var data = {
            'proposalNo': newValue.proposalNo,
            'caseId': newValue.caseId,
            'categoryNo': newValue.categoryNo,
            'proposerOrLifeAssured': $rootScope.proposerOrLifeAssured,
            'subTypeNo': documentSubType.FkDocumentSubTypeId,
            'documentSubType': documentSubType
          };
          selectedCaseDetailsService.setDataForThumbnail(data);
        }
      }, true);

      /**Get images Data**/
      var checkImageData = docScanandUploadDbService.getImageData($rootScope.selectedProof, $scope.documentSubType, $rootScope.proposerOrLifeAssured, $scope.selectedCaseId);
      checkImageData.then(function(imageData) {
        if (imageData.length > 0) {
          var tempImgArr = [];
          imageData.forEach(function(element) {
            var nowVar = element.DocumentData;
            var nowArr = nowVar.split(',');
            nowArr.forEach(function(element2) {
              tempImgArr.push({
                'src': Base64.decode(element2)
              });
            }, this);
          }, this);
          var imageGroup = {
            'isForUpdate': 'True',
            'imageArray': tempImgArr
          };
          selectedCaseDetailsService.setScanAndUploadImage(imageGroup);
          $state.go('app.document-images-review');
        } else {
          $rootScope.showChooseDocPopup = true;
        }
      });
    };

    /**close the popup**/
    $scope.hideChooseDocPopup = function() {
      // $scope.showCamera = false;
      $rootScope.showChooseDocPopup = false;
    };

    /**get image**/
    $scope.getImageFromCamera = function() {
      if (window.cordova) {
        var options = {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions,
          quality: camQuality,
          width: 800,
          height: 800,
          correctOrientation : true
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
          $log.debug("imageData",imageData);
          if(imageData!== null && imageData !== undefined && imageData !== ""){
              $ionicLoading.show({
                template: 'Loading...'
              });
              tempReviewImagesArray.push({
                'src': imageData
              });
              /** $scope.showChooseDocPopup = false;**/
              var imageGroup = {
                'isForUpdate': 'False',
                'imageArray': tempReviewImagesArray,
              };

              selectedCaseDetailsService.setScanAndUploadImage(imageGroup);
              $ionicLoading.hide();
              $state.go('app.document-images-review');
            }else{
                $log.debug("No image selected");
            }
            }, function(err) {
              $log.debug(err);
            });

      } else {
        var imageData =
          'http://farm9.staticflickr.com/8042/7918423710_e6dd168d7c_b.jpg';
        tempReviewImagesArray.push({
          'src': imageData
        });
        /** $scope.showChooseDocPopup = false;**/
        var imageGroup = {
          'isForUpdate': 'False',
          'imageArray': tempReviewImagesArray,
        };
        selectedCaseDetailsService.setScanAndUploadImage(imageGroup);
        $state.go('app.document-images-review');
      }
    };

    /**Select image from gallery**/
    $scope.getImageFromGallery = function() {
      var options = {
        maximumImagesCount: dsuMaxImagesCount,
        //encodingType: Camera.EncodingType.JPEG,
        quality: 80,
        width: 800,
        height: 800,
        correctOrientation : true
      };
      $cordovaImagePicker.getPictures(options).then(function(results) {
        if(results.length > 0){
          for (var i = 0; i < results.length; i++) {
            tempReviewImagesArray.push({
              'src': results[i]
            });
          }
          $rootScope.showChooseDocPopup = false;
          var imageGroup = {
            'isForUpdate': 'False',
            'imageArray': tempReviewImagesArray,
          };
          selectedCaseDetailsService.setScanAndUploadImage(imageGroup);
          $state.go('app.document-images-review');
        }else{
          $log.debug("No image selected");
        }
        }, function(error) {
          $log.debug('Error: ' + JSON.stringify(error));
        });

    };

    /**Close preview**/
    $scope.hidePreviewPopup = function() {
      $scope.showPreviewPopup = false;
    };

    /**Toggle for selection proposer or life assured.**/
    $scope.setActive = function(isProposer) {
      $scope.showLoading();
      $rootScope.currentDocumentForVal = isProposer;
      /**Get thumbnails by document subtypes.**/
      var thumbnails = docScanandUploadDbService.getThumbnailsByDocumentTypeId($rootScope.selectedProof, $scope.selectedCaseId);
      thumbnails.then(function(result) {
        $rootScope.thumbanilsForAllSubtypes = result;
      });

      /**Get subtypes of document type.**/
      var documentSubtypes = docScanandUploadDbService.getDocumentSubtypesByDocumentTypeId($rootScope.selectedProof);
      documentSubtypes.then(function(result) {
        $rootScope.otherFrequentlyUploadedDocuments = result;
        $scope.hideLoading();
      });
      $rootScope.proposerOrLifeAssured = isProposer;
    };

    /**If selected documents are greater than six then show through this function.**/
    $scope.otherOptions = function() {
      $scope.showOtherDocuments = true;
    };

    /**Show document selection popup**/
    $scope.showCanNotEditThisCase = function() {
      $scope.cannotEditthisCase = true;
    };

    /**Hide document selection popup**/
    $scope.hideCanNotEditThisCase = function() {
      $scope.cannotEditthisCase = false;
    };

    /**Select the document type and update thumbnails and subtype**/
    $scope.selectedTab = function(tab) {
      $rootScope.positionHorizontalScroll = $ionicScrollDelegate.$getByHandle('proofTypeScroll').getScrollPosition().left;
      $scope.showLoading();
      $rootScope.selectedProof = tab.value;
      /**Get thumbnails**/
      var thumbnails = docScanandUploadDbService.getThumbnailsByDocumentTypeId($rootScope.selectedProof, $scope.selectedCaseId);
      thumbnails.then(function(result) {
        $rootScope.thumbanilsForAllSubtypes = result;
      });
      /**Get subtypes**/
      var subtype = docScanandUploadDbService.getDocumentSubtypesByDocumentTypeId($rootScope.selectedProof);
      subtype.then(function(result) {
        $rootScope.otherFrequentlyUploadedDocuments = result;
        $scope.hideLoading();
      });
      /**Hide the documents subtypes if greater then six.**/
      $scope.showOtherDocuments = false;
    };

    /**Close popup**/
    $scope.closePopup = function() {
      $scope.documentUploadFlag = false;
    };

    /**Land to Today page.**/
    $scope.onBack = function() {
      $state.go('app.tabs-landing-dsu.today');
    };

    /**Show Loading**/
    $scope.showLoading = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };

    /**hide loading**/
    $scope.hideLoading = function() {
      $ionicLoading.hide();
    };

    /**submit image data.**/
    $scope.submitDocuments = function() {
      $log.debug("submitDocuments : ", $scope.selectedCaseId);
      docScanandUploadDbService.updateDocumentsStatusByCaseId($scope.selectedCaseId);
      $scope._isEnableSubmitBtn = false;
      $scope.blockChooseDocument = true;
      if(window.cordova){
        if ($cordovaNetwork.isOffline()) {
          $cordovaToast.showLongBottom('You are offline.Documents Submitted Successfully!!').then(function(success) {
            //success
          }, function(error) {
            // error
          });
        } else {
          commonDBFuncSvc.processRequiredDataForSync()
            .then(function(val) {

              commonDBFuncSvc.initiateSync().then(function(result){
                if(result){
                  $cordovaToast.showLongBottom('Documents Submitted Successfully!!').then(function(success) {
                    $state.transitionTo($state.current, $state.$current.params, { reload: true, inherit: true, notify: true });
                  }, function(error) {
                    // error
                  });
                }
              });
            });
        }
      }else{
        commonDBFuncSvc.processRequiredDataForSync()
          .then(function(val) {
            commonDBFuncSvc.initiateSync().then(function(result){
              $log.debug("Documents Submitted Successfully!!");
            });
          });
      }
    };

    //** Back Button Funtionality **//
    $scope.goBack = function() {
      if ($state.current.name == 'app.document-scan-and-upload' && $scope.showChooseDocPopup == false) {
        $state.go("app.tabs-landing-dsu.today");
      } else if ($state.current.name == 'app.document-scan-and-upload' && $scope.showChooseDocPopup == true) {
        $scope.hideChooseDocPopup();
        $scope.$apply();
      } else {
        $ionicHistory.goBack();
      }
    };

    if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
      $ionicNavBarDelegate.showBackButton(false);
    } else {
      $ionicNavBarDelegate.showBackButton(true);
    }
    $ionicPlatform.registerBackButtonAction(function() {
      $scope.goBack();
    }, 100);

    $timeout(scrollHorizontal, 150);

    function scrollHorizontal() {
      if ($rootScope.positionHorizontalScroll) {
        var position_left = $rootScope.positionHorizontalScroll;
        $ionicScrollDelegate.$getByHandle('proofTypeScroll').scrollTo(position_left, 0, true);
      }
    }
  }
]);
