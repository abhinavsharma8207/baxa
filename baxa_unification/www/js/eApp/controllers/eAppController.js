eAppModule.controller('eAppController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$ionicHistory',
  '$ionicPlatform',
  '$ionicNavBarDelegate',
  'eAppServices',
  'pceHomeDataService',
  'samruddhiObjectService',
  'secureIncomeObjectService',
  'trippleHealthObjectService',
  'elitesecureObjectService',
  'quoteProposalNosDataService',
  'getSetCommonDataService',
  function($scope, $rootScope, $log, $state, $ionicHistory, $ionicPlatform, $ionicNavBarDelegate,
    eAppServices, pceHomeDataService, samruddhiObjectService,
    secureIncomeObjectService, trippleHealthObjectService, elitesecureObjectService,
    quoteProposalNosDataService, getSetCommonDataService) {
    'use strict';

    //** Back Button Funtionality **//
    $scope.goBack = function() {
      if ($state.current.name == 'app.eApp-products') {
        $state.go("app.eApp");
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
    $scope.animateClass = animateNgClass('bounceInDown', 'animationduration25');
    //** Back Button Funtionality **//

    $ionicHistory.clearHistory();
    $scope.products = pceHomeDataService.getProductsByChannelId(1)
      .then(function(value) {
        $log.debug('productsListData ', value);
        $scope.products = value;
        return value;
      });

    $scope.checkSelectedProduct = function(selProductData) {

      var userData = getSetCommonDataService.getCommonData();
      pceHomeDataService.getRiderDetails(selProductData.FkProductId).then(function(ridersData) {
        var prodData = {
          prodId: selProductData.FkProductId,
          prodLbl: selProductData.Label,
          prodUIN: selProductData.UIN,
          ridersData: ridersData
        };
        $log.debug("prodData :::", prodData);
        getSetCommonDataService.setCurrentProdData(prodData);
        $rootScope.selectedProductIdForCalculation = selProductData.FkProductId;
        quoteProposalNosDataService.resetTempBiJsonTbl();
        switch (selProductData.FkProductId) {
          case '1':
            eAppServices.resetScreenData();
            $state.go('app.aajeevansampatti-LAAndProposer');
            break;
          case '2':
            eAppServices.resetScreenData();
            $state.go('app.samriddhi-LAAndProposer');
            break;
          case '3':
            eAppServices.resetScreenData();
            $state.go('app.tripplehealth-LAAndProposer');
            break;
          case '8':
            elitesecureObjectService.resetScreenData();
            $state.go('app.elitesecure-LAAndProposer');
            break;
          case '9':
            eAppServices.resetScreenData();
            $state.go('app.secureincome-LAAndProposer');
            break;
          case '10':
            eAppServices.resetScreenData();
            $state.go('app.flexiSave-LAAndProposer');
            break;
          case '11':
              eAppServices.resetScreenData();
              $state.go('app.futureInvest-LAAndProposer');
              break;
          case '12':
            eAppServices.resetScreenData();
            $state.go('app.eliteAdvantage-LAAndProposer');
            break;
          case '13':
            eAppServices.resetScreenData();
            $state.go('app.superSeries-LAAndProposer');
            break;
          case '14':
            eAppServices.resetScreenData();
            $state.go('app.childAdvantage-LAAndProposer');
            break;
          case '15':
            eAppServices.resetScreenData();
            $state.go('app.monthlyAdvantage-LAAndProposer');
            break;
          case '16':
            eAppServices.resetScreenData();
            $state.go('app.eProtect-LAAndProposer');
            break;

          default:
              break;
        }
      });
    };
  }
]);

eAppModule.controller('eAppDashboard', ['$q','$scope',
  '$rootScope',
  '$log',
  '$state',
  '$ionicHistory',
  'eAppServices',
  'eAppDataServices',
  function($q, $scope, $rootScope, $log, $state, $ionicHistory, eAppServices, eAppDataServices){
    'use strict';
    $scope.listQuoteData      = [];
    $scope.listPendingData    = [];
    $scope.listIncompleteData = [];

    var q = $q.defer();
    $q.all([
      eAppDataServices.getQuoteData(),
      eAppDataServices.getPendingQuoteData(),
      eAppDataServices.getIncompleteQuoteData()
    ]).then(function(result){
      $scope.listQuoteData      = result[0];
      $scope.listPendingData    = result[1];
      $scope.listIncompleteData = result[2];
    });

    $scope.productsListing = function(){
      $state.go('app.eApp-products');
    };
  }]);
