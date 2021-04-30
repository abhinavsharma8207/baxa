switchModule.controller('productRecommendationController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$ionicPlatform',
  '$ionicHistory',
  '$ionicNavBarDelegate',
  'switchDataService',
  function($scope, $rootScope, $log, $state,
    $ionicPlatform, $ionicHistory, $ionicNavBarDelegate,
    switchDataService) {
    'use strict';
    var channelId = 1;
    $scope.custId = $state.params.customerId;
    var product = null;
    var caseProductRec;
    $scope.stepsCompleted = 3;

    if($rootScope.profileGender){
      $scope.Gender = $rootScope.profileGender;
    }else{
      $scope.Gender = localStorage.getItem('Gender');
    }

    var productData = switchDataService.getProfileData($state.params.customerId);
    productData.then(function(val) {
      $log.debug('productData', val);
      $scope.stepsCompleted = val.StepCompleted;
      product = val;
      var productPriority = JSON.parse(product.LifeStagePriority);
      caseProductRec = productPriority[0].id;
      var link;
      var productRec = switchDataService.getProductRecommmendationList(channelId, caseProductRec);
      productRec.then(function(prodsRecm) {
        $log.debug('$scope.ProductRec', prodsRecm);
        $scope.ProductRec = prodsRecm;
      //  var desc=$sce.trustAshtml($scope.ProductRec)

        var pagesShown = 1;
        var pageSize = 4;

        $scope.paginationLimit = function() {
          if (caseProductRec == 4) {
            pageSize = 2;
          }
          return pageSize * pagesShown;

        };
        $scope.hasMoreItemsToShow = function() {
          return pagesShown < ($scope.ProductRec.length / pageSize);
        };
        $scope.showMoreItems = function() {
          pagesShown = $scope.ProductRec.length;
        };
      });
    });

    $scope.productQuote = function(productData) {

      var link;
      switch (parseInt(productData.FkProductId)) {
        case 8:
          link = 'app.switchEliteSecureQuote';
          break;
        case 2:
          link = 'app.switchSamriddhiQuote';
          break;
        case 3:
          link = 'app.trippleHealthQuoteInput';
          break;
        case 12:
          link = 'app.switchEliteAdvantageInpute';
          break;

        case 10:
          link = 'app.FlexiSaveQuoteInput';
          break;

        case 9:
          link = 'app.switchSecureIncomeQuote';
          break;

        case 14:
          link = 'app.switchChildAdvantageQuote';
          break;

        case 15:
          link = 'app.monthlyAdvInput';
          break;

        case 13:
          link = 'app.switchSuperSeriesQuote';
          break;
      }
      switchDataService.setProductData(productData);//Set Product Data
      switchDataService.setQuoteData(null);
      $state.go(link, {
        customerId: $state.params.customerId,
      });
    };

    $log.debug('stepsCompleted333', $scope.stepsCompleted);
    if (parseInt($scope.stepsCompleted) > 3) {
      $scope.pageFlow1 = {
        disableOtherTabsLife: false
      };
      $scope.pageFlow2 = {
        disableOtherTabsNeeds: false
      };
      $scope.pageFlow3 = {
        disableOtherTabsProducts: false
      };
      $scope.pageFlow4 = {
        disableOtherTabsProducts: true
      };
    } else {
      $scope.pageFlow1 = {
        disableOtherTabsLife: false
      };
      $scope.pageFlow2 = {
        disableOtherTabsNeeds: false
      };
      $scope.pageFlow3 = {
        disableOtherTabsProducts: false
      };
      $scope.pageFlow4 = {
        disableOtherTabsProducts: true
      };
    }

    /**back routing ***/
    $scope.goBack = function() {
      if ($state.current.name == 'app.productRecommendation') {
        $state.go("app.needPrioritisation", {
          customerId: $state.params.customerId
        });
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
  }
]);
