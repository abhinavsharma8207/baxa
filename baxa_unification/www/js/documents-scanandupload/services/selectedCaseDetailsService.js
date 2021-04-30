documentScanAndUpload.service('selectedCaseDetailsService', ['$log', function(
  $log) {
  'use strict';
  var _data = {};
  var _thumbnails = {};
  var _imageData = {};
  return {
    getSelectedData: function() {
      return _data;
    },
    setSelectedData: function(data) {
      _data = data;
    },
    getDataForThumbnail: function() {
      return _thumbnails;
    },
    setDataForThumbnail: function(data) {
      _thumbnails = data;
    },
    getScanAndUploadImage: function() {
      return _imageData;
    },
    setScanAndUploadImage: function(imageData) {
      _imageData = imageData;
    }
  };
}]);
