 productCalculator.controller('pceHomeController',
  function($scope, $rootScope, $log, $state, $ionicPlatform, $cordovaCamera, $cordovaFile, pceHomeDataService, getSetCommonDataService) {
  'use strict';
  $scope.productsListData = pceHomeDataService.getProductsByChannelId(1)
  .then(function(value){
      $log.debug('productsListData ', value);
      $scope.productsListData=value;
      return value;
  });

  $scope.setSelectedProduct = function(productId){
    $scope.saveDB();
    var prodData = {prodId: productId,  adbRiderId: 4,hospicashId: 5};
    getSetCommonDataService.setCurrentProdData(prodData);
    $rootScope.selectedProductIdForCalculation = productId;
    $log.debug('productId ', productId);
    switch (parseInt(productId)) {
      case 1:
        $state.go('aajeevansampatti');
      break;
      case 2:
        $state.go('samriddhi');
      break;
      case 3:
        $state.go('trippleHealth');
      break;
      case 4:
      case 5:
      case 6:
      case 7:
      break;
      case 8:
        $state.go('eliteSecure');
      break;
      case 9:
        $state.go('secureIncome');
      break;
      case 10:
        $state.go('flexiSave');
      break;
      case 11:
        $state.go('futureInvest');
      break;
      case 12:
      $state.go('eliteAdvantage');
      break;
      case 13:
      $state.go('superSeries');
      break;
      case 14:
      $state.go('childAdvantage');
      break;
      case 15:
      $state.go('monthlyAdvantage');
      break;
      case 16:
      $state.go('eProtect');
      break;
    }
};

  $scope.saveDB = function(){
    var path = "";
    var targetPath = "";
    if(window.cordova){
      //destination folder path per platform
      if (ionic.Platform.isIOS()) { 
        //iOS non-synch folder
        path = cordova.file.applicationStorageDirectory + "Library/LocalDatabase";
      } else {
        //Android folder
        path = cordova.file.applicationStorageDirectory + "databases/";
      }
      targetPath = path + "syncdb"; //full path to the datafile once downloaded
      $log.debug("targetPath" , targetPath);

      $cordovaFile.copyFile(path, "syncdb", cordova.file.externalApplicationStorageDirectory, "syncdb.db")
      .then(function (success) {
        // success
        $log.debug("inside success");
      }, function (error) {
          // error
      });
    }
};
 });
