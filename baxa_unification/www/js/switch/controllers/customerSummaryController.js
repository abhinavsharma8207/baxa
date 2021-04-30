unificationBAXA.controller('customerSummaryController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$stateParams',
  '$ionicPlatform',
  '$ionicHistory',
  '$ionicNavBarDelegate',
  'switchDataService',
  function($scope, $rootScope, $log, $state, $stateParams,
    $ionicPlatform, $ionicHistory, $ionicNavBarDelegate,
    switchDataService) {
    'use strict';
    $scope.custDetails = "";
    $scope.stepsCompleted = 1;
    $scope.YmoPopUp = false;
    var customerSummary = switchDataService.getProfileData($state.params.customerId);
    customerSummary.then(function(custDetails) {
      var priority = JSON.parse(custDetails.LifeStagePriority);
      var priorityItem = [];
      angular.forEach(priority, function(items) {
        var calcCount = switchDataService.getCalcTotal(items.id, $state.params.customerId);
        calcCount.then(function(val) {
          items.count = val;
        });
        priorityItem.push(items);
      }, priorityItem);
      $scope.custDetails = custDetails;
      $scope.custDetails.CreatedDate = new Date(custDetails.CreatedDate).getTime();
      $scope.custDetails.ModifiedDate = new Date(custDetails.ModifiedDate).getTime();
      $scope.custDetailsLife = priorityItem;
      $scope.stepsCompleted = custDetails.StepCompleted;
      /*Get Customer Product Illustration Summary*/
      $log.debug('$state.params.customerId', $state.params.customerId);
      var piSummary = switchDataService.getCustomerPiSummary($state.params.customerId);
      piSummary.then(function(pI) {
        $log.debug('pI', pI);
        $scope.custPiSummary = pI;
      });

      //$scope.pISummary =
    });

    $scope.needPrioritisationPage = function() {
      localStorage.removeItem('Gender');
      localStorage.setItem('Gender', $scope.custDetails.Gender);
      $log.debug("inside needPrioritisationPage $scope.stepsCompleted :: " + $scope.stepsCompleted);
      var b = true;
      $state.go('app.needPrioritisation', {
        customerId: $scope.custDetails.Cust_ID,
        tabThreeFlg: true,
      });
      switchDataService.updateLifeStageStepsCompleted($scope.custDetails.Cust_ID, $scope.stepsCompleted);
    };
    $scope.onClickCalculators = function(a, b) {
      if (b == 0) {
        $scope.popupopn = true;
      } else {
        $rootScope.selectedRecId = null;
        $state.go('app.onTapCalcualtor', {
          customerId: $scope.custDetails.Cust_ID,
          typeId: a
        });
      }

    };
    /*no record popup*/
    $scope.hidepopupopn = function() {
      $scope.popupopn = false;
    };
    /*vimo popup*/
    $scope.showYmoPopUp = function() {
      $scope.YmoPopUp = true;
    };
    $scope.hideYmoPopUp = function() {
      $scope.YmoPopUp = false;
    };

    /*Display Product Illustration from Summary*/

    $scope.goToProdPi = function(prodData, recId, customerId) {
      var piLink;
      switch (prodData.FkProductId) {
        case 8:
          piLink = 'app.switchEliteSecurePi';
          break;
        case 3:
          piLink = 'app.trippleHealthPi';
          break;
        case 2:
          piLink = 'app.switchSamriddhiPi';
          break;
        case 9:
          piLink = 'app.switchSecureIncomePi';
          break;
        case 12:
          piLink = 'app.switchEliteAdvantagePi';
          break;
        case 10:
          piLink = 'app.switchFlexiSavePi';
          break;
        case 14:
          piLink = 'app.switchChildAdvantagePi';
          break;
        case 13:
          piLink = 'app.switchSuperSeriesPi';
          break;
        case 15:
          piLink = 'app.monthlyAdvantagePi';
          break;
        default:

      }
      //Set Product data
      switchDataService.setProductData(prodData); //Set Product Data

      $state.go(piLink, {
        customerId: customerId,
        recId: recId
      });

    };


    $scope.deleteSummary = function(custId, recId) {
      $scope.showDeleteSummaryPopup = !$scope.showDeleteSummaryPopup;
      $scope.setCustId = custId;
      $scope.setRecId = recId;
    };

    $scope.confirmDelete = function(custId, recId) {
      switchDataService.deletePiSummary(custId, recId);
      $scope.showDeleteSummaryPopup = !$scope.showDeleteSummaryPopup;
      var piSummary = switchDataService.getCustomerPiSummary($state.params.customerId);
      piSummary.then(function(pI) {
        $log.debug('pI', pI);
        $scope.custPiSummary = pI;
      });

    };

    /**back routing ***/
    $scope.goBack = function() {
      if ($state.current.name == 'app.customer-summary') {
        $state.go("app.switch");
      } else if ($state.current.name == 'app.lifestage') {
        $state.go("app.switch");
      } else if ($state.current.name == 'app.needPrioritisation') {
        $state.go("app.lifestage");
      } else if ($state.current.name == 'switchWealthOutput') {
        $state.go("app.customer-summary", {
          customerId: $scope.custDetails.Cust_ID
        });
      } else if ($state.current.name == 'switchChildOutput') {
        $state.go("app.customer-summary", {
          customerId: $scope.custDetails.Cust_ID
        });
      } else if ($state.current.name == 'switchRetirementOutput') {
        $state.go("app.customer-summary", {
          customerId: $scope.custDetails.Cust_ID
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

    document.addEventListener("resume", goToVymo, false);

    function goToVymo() {
      if ($rootScope.navigatePhone == true && $state.current.name == 'app.customer-summary') {
        $state.go('app.Vymo');
        $rootScope.navigatePhone = false;
      }
    }

  }
]);
