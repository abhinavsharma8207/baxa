documentScanAndUpload.controller('documentImagesReviewController', ['$rootScope',
  '$scope',
  '$state',
  '$q',
  '$log',
  '$ionicLoading',
  '$ionicPlatform',
  '$ionicHistory',
  '$ionicNavBarDelegate',
  '$cordovaCamera',
  '$cordovaImagePicker',
  'Base64',
  'selectedCaseDetailsService',
  'docScanandUploadDbService',
  'camQuality',
  'noOfProofs',
  'dsuMaxImagesCount',
  function(
    $rootScope,
    $scope,
    $state,
    $q,
    $log,
    $ionicLoading,
    $ionicPlatform,
    $ionicHistory,
    $ionicNavBarDelegate,
    $cordovaCamera,
    $cordovaImagePicker,
    Base64,
    selectedCaseDetailsService,
    docScanandUploadDbService,
    camQuality,
    noOfProofs,
    dsuMaxImagesCount) {
    'use strict';
    var vm = this;
    var reviewBase64ImageList = [];
    var documentSourceId = 0;
    var isUpdateScanAndUpload = false;
    $scope.showChooseDocPopup = false;
    $scope.showPreviewPopup = false;
    $scope.reviewImagesArray = [];
    $scope.checkboxPopup = false;
    $scope.DoneButton = false;
    $scope.selectedDocumentSubType = "";
    $scope.selectedProposalNo = "";
    $scope.showCategorisePopup = "";
    $scope.addImageBtnStatus = true;
    $scope._isEnablePreviewSubmitBtn = true;
    $scope.proof1 = "";
    $scope.proof2 = "";
    vm.updateDocumentUpload = updateDocumentUpload;
    /**To maintain next and previous buttons for image preview.**/
    $scope._Index = 0;

    /**Get values to show proposer number on screen.**/
    $scope.$watch(function() {
      return selectedCaseDetailsService.getDataForThumbnail();
    }, function(newValue, oldValue) {
      if (newValue != null) {
        $scope.selectedDocumentSubType = newValue.subTypeNo;
        $scope.selectedProposalNo = newValue.proposalNo;
        $scope.showCategorisePopup = newValue.documentSubType;
        $scope.proposerObject = newValue;
        if (newValue.documentSubType.FkReuse1DocumentTypeId.length > 0) $scope.proof1 = true;
        else $scope.proof1 = false;
        if (newValue.documentSubType.FkReuse2DocumentTypeId.length > 0) $scope.proof2 = true;
        else $scope.proof2 = false;
        /**Get sync status of isSynced.**/
        var checkIsSync = docScanandUploadDbService.getisSyncDocumentStatus(
          $scope.proposerObject.caseId);
        checkIsSync.then(function(syncData) {
          var keepGoing = true;
          syncData.forEach(function(element) {
            if (keepGoing) {
              if (element.DocumentStatus == '0.0' || element.DocumentStatus ==
                '0') {
                $scope._isEnablePreviewSubmitBtn = true;
                /**$scope.addImageBtnStatus = true;**/
                $scope.checkboxPopup = false;
                keepGoing = false;
              } else {
                $scope._isEnablePreviewSubmitBtn = false;
                $scope.addImageBtnStatus = false;
              }
            }
          }, this);
        });
      }
    }, true);

    /*Get document source if by Label to store image in database.*/
    docScanandUploadDbService.getDocumentSourceId().then(function(result) {
      documentSourceId = result;
    });

    /*Change selected checkbox values.*/
    $scope.toggleValue = function(value, proof) {
      if (proof == 1) {
        $scope.proof1 = !value;
      }
      if (proof == 2) {
        $scope.proof2 = !value;
      }
    };

    $scope.$watch(function() {
      return selectedCaseDetailsService.getScanAndUploadImage();
    }, function(imageGroup) {
      if (reviewBase64ImageList.length <= 0) {
        if (imageGroup.isForUpdate == 'True') {
          isUpdateScanAndUpload = true;
        }
        $scope.reviewImagesArray = imageGroup.imageArray;
        if ($scope.reviewImagesArray.length > 0) {
          var tempImageArray = imageGroup.imageArray;
          tempImageArray.forEach(function(element) {
            reviewBase64ImageList.push(Base64.encode(element.src));
            if ($scope.reviewImagesArray.length >= noOfProofs) {
              $scope.addImageBtnStatus = false;
            }
          }, this);
        }
      } else {
        $rootScope.enableSubmitBtn = 0;
      }
    }, true);

    /** Get image from camera.**/
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
          height: 800
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
          $ionicLoading.show({
            template: 'Loading...'
          });
          $scope.reviewImagesArray.push({
            'src': imageData
          });
          reviewBase64ImageList.push(Base64.encode(imageData));
          if ($scope.reviewImagesArray.length >= noOfProofs) {
            $scope.addImageBtnStatus = false;
          }
          $scope.showChooseDocPopup = false;
          $ionicLoading.hide();
        }, function(err) {
          $log.debug(err);
        });
      } else {
        var imageData =
          'http://farm9.staticflickr.com/8449/7918424278_4835c85e7a_b.jpg';
        $scope.reviewImagesArray.push({
          'src': imageData
        });
        reviewBase64ImageList.push(Base64.encode(imageData));
        if ($scope.reviewImagesArray.length >= noOfProofs) {
          $scope.addImageBtnStatus = false;
        }
        $scope.showChooseDocPopup = false;
      }
    };

    /**Get image from gallery.**/
    $scope.getImageFromGallery = function() {
      var options = {
        maximumImagesCount: dsuMaxImagesCount,
        //encodingType: Camera.EncodingType.JPEG,
        quality: 80,
        width: 800,
        height: 800
      };

      $cordovaImagePicker.getPictures(options).then(function(results) {
        for (var i = 0; i < results.length; i++) {
          if (reviewBase64ImageList.length < noOfProofs) {
            $scope.reviewImagesArray.push({
              'src': results[i]
            });
            reviewBase64ImageList.push(Base64.encode(results[i]));
          }
        }

        if ($scope.reviewImagesArray.length >= noOfProofs) {
          $scope.addImageBtnStatus = false;
        }

        $scope.showChooseDocPopup = false;
      }, function(error) {
        $log.debug('Error: ' + JSON.stringify(error));
      });
    };

    /**Show document selection popup**/
    $scope.showChooseDocPopupDialog = function() {
      $scope.showChooseDocPopup = true;
    };

    /**Hide document selection popup**/
    $scope.hideChooseDocPopup = function() {
      $scope.showChooseDocPopup = false;
    };

    /**Show preview of selected image.**/
    $scope.showPreviewPopupDialog = function(index) {
      $scope.showPreviewPopup = true;
      $scope.imgURL = $scope.reviewImagesArray[index].src;
      $scope._Index = index;
    };

    /**Hide preview popup.**/
    $scope.hidePreviewPopup = function() {
      $scope.showPreviewPopup = false;
    };

    /**Show categories popup.**/
    $scope.showChooseCategorisePopup = function() {
      if ($scope.proposerObject.documentSubType.FkReuse1DocumentTypeId.length >
        0 || $scope.proposerObject.documentSubType.FkReuse2DocumentTypeId.length >
        0) {
        $scope.showCategorisePopup = true;
        $scope.checkboxPopup = true;
      } else {
        $scope.DoneButton(false, false);
      }
    };

    /**Hide popup**/
    $scope.hideCategorisePopup = function() {
      $scope.checkboxPopup = false;
    };

    /**Update in base 64 format.**/
    $scope.submitDocumentBase64 = function(IdProof, AgeProof) {
      $scope.proposerObject.imageData = reviewBase64ImageList;
      docScanandUploadDbService.insertDocumentsData($scope.proposerObject);
      vm.updateDocumentUpload($scope.proposerObject);
    };

    /**Update document if document sub type already contains imagedata.**/
    function updateDocumentUpload(data) {
      $scope.proposerObject.imageData = reviewBase64ImageList;
      docScanandUploadDbService.modifyDocumentsData(data);
    }

    /**Show previous image.**/
    $scope.showPrevImage = function() {
      $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.reviewImagesArray
        .length - 1;
      $scope.imgURL = $scope.reviewImagesArray[$scope._Index].src;
    };

    /**Show next image**/
    $scope.showNextImage = function() {
      $scope._Index = ($scope._Index < $scope.reviewImagesArray.length - 1) ?
        ++$scope._Index : 0;
      $scope.imgURL = $scope.reviewImagesArray[$scope._Index].src;
    };

    /** Delete image from image data. **/
    $scope.deleteSelectedImage = function() {
      $scope.reviewImagesArray.splice($scope._Index, 1);
      reviewBase64ImageList.splice($scope._Index, 1);
      $scope.proposerObject.imageData = reviewBase64ImageList;
      docScanandUploadDbService.modifyDocumentsData($scope.proposerObject);
      $scope.showPreviewPopup = false;
    };

    /**Done button function check weather same image required for other documents and if required then add through service.**/
    $scope.DoneButton = function(proof1, proof2) {
      for (var i = 0; i < reviewBase64ImageList.length; i++)
        var imageData = reviewBase64ImageList[i];
      if (reviewBase64ImageList.length > 0) {
        $scope.proposerObject.imageData = reviewBase64ImageList;
        docScanandUploadDbService.insertDocumentsData($scope.proposerObject, documentSourceId).then(
          function(value) {
            if ((proof1 == undefined || proof1 == false) && (proof2 != undefined && proof2 != false)) {
              if ($scope.proposerObject.documentSubType.FkReuse2DocumentTypeId != "") {
                $scope.proposerObject.documentSubType.FkDocumentTypeId =
                  $scope.proposerObject.documentSubType.FkReuse2DocumentTypeId;
                docScanandUploadDbService.insertDocumentsData($scope.proposerObject, documentSourceId)
                  .then(function(value) {});
                $scope.updateThumbnails();
                $state.go('app.document-scan-and-upload');
              }
            }
            if ((proof2 == undefined || proof2 == false) && (proof1 != undefined && proof1 != false)) {
              if ($scope.proposerObject.documentSubType.FkReuse1DocumentTypeId != "") {
                $scope.proposerObject.documentSubType.FkDocumentTypeId =
                  $scope.proposerObject.documentSubType.FkReuse1DocumentTypeId;
                docScanandUploadDbService.insertDocumentsData($scope.proposerObject, documentSourceId)
                  .then(function(value) {
                    $scope.updateThumbnails();
                    $state.go('app.document-scan-and-upload');
                  });
              }
            }
            if ((proof2 != undefined && proof2 != false) && (proof1 != undefined && proof1 != false)) {
              if ($scope.proposerObject.documentSubType.FkReuse1DocumentTypeId != "") {
                $scope.proposerObject.documentSubType.FkDocumentTypeId =
                  $scope.proposerObject.documentSubType.FkReuse1DocumentTypeId;
                docScanandUploadDbService.insertDocumentsData($scope.proposerObject, documentSourceId)
                  .then(function(value) {
                    if ($scope.proposerObject.documentSubType.FkReuse2DocumentTypeId !=
                      "") {
                      $scope.proposerObject.documentSubType.FkDocumentTypeId =
                        $scope.proposerObject.documentSubType.FkReuse2DocumentTypeId;
                      docScanandUploadDbService.insertDocumentsData(
                        $scope.proposerObject, documentSourceId).then(function(value) {
                        $scope.updateThumbnails();
                        $state.go('app.document-scan-and-upload');
                      });
                    }
                  });
              }
            }
            if ((proof2 == undefined || proof2 == false) && (proof1 == undefined || proof1 == false)) {
              $state.go('app.document-scan-and-upload');
            }
          });
      } else {
        if ((proof1 == undefined || proof1 == false) && (proof2 != undefined && proof2 != false)) {
          if ($scope.proposerObject.documentSubType.FkReuse2DocumentTypeId != "") {
            $scope.proposerObject.documentSubType.FkDocumentTypeId =
              $scope.proposerObject.documentSubType.FkReuse2DocumentTypeId;
            docScanandUploadDbService.modifyDocumentsData($scope.proposerObject)
              .then(function(value) {});
            $scope.updateThumbnails();
            $state.go('app.document-scan-and-upload');
          }
        }
        if ((proof2 == false || proof2 == undefined) && (proof1 != undefined && proof1 != false)) {
          if ($scope.proposerObject.documentSubType.FkReuse1DocumentTypeId != "") {
            $scope.proposerObject.documentSubType.FkDocumentTypeId = $scope.proposerObject.documentSubType.FkReuse1DocumentTypeId;
            docScanandUploadDbService.modifyDocumentsData($scope.proposerObject)
              .then(function(value) {
                $scope.updateThumbnails();
                $state.go('app.document-scan-and-upload');
              });
          }
        }
        if ((proof2 != undefined && proof2 != false) && (proof1 != undefined && proof1 != false)) {
          if ($scope.proposerObject.documentSubType.FkReuse1DocumentTypeId != "") {
            $scope.proposerObject.documentSubType.FkDocumentTypeId = $scope.proposerObject.documentSubType.FkReuse1DocumentTypeId;
            docScanandUploadDbService.modifyDocumentsData($scope.proposerObject)
              .then(function(value) {
                if ($scope.proposerObject.documentSubType.FkReuse2DocumentTypeId != "") {
                  $scope.proposerObject.documentSubType.FkDocumentTypeId = $scope.proposerObject.documentSubType.FkReuse2DocumentTypeId;
                  docScanandUploadDbService.modifyDocumentsData(
                    $scope.proposerObject).then(function(value) {
                    $scope.updateThumbnails();
                    $state.go('app.document-scan-and-upload');
                  });
                }
              });
          }
        }
        if ((proof2 == undefined || proof2 == false) || (proof1 == undefined && proof1 == false)) {
          $state.go('app.document-scan-and-upload');
        }
      }
    };

    /**Redirect to scan and uplaod.**/
    $scope.backtoScanAndUpload = function() {
      $state.go('app.document-scan-and-upload');
    };

    /**Update the thumbnails of subtypes.**/
    $scope.updateThumbnails = function() {
      /**get thumbnails of selected proposal number.**/
      var thumbnails = docScanandUploadDbService.getThumbnailsByDocumentTypeId(
        $rootScope.selectedProof, $scope.proposerObject.caseId);
      thumbnails.then(function(result) {
        $rootScope.thumbanilsForAllSubtypes = result;
      });
    };

    //** Back Button Funtionality **//
    $scope.goBack = function() {
      if ($scope.checkboxPopup == true) {
        $scope.checkboxPopup = false;
        $scope.$apply();
      } else if ($scope.showPreviewPopup == true) {
        $scope.showPreviewPopup = false;
        $scope.$apply();
      } else if($scope.showChooseDocPopup == true){
        $scope.showChooseDocPopup = false;
        $scope.$apply();
      }else {
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

  }
]);
