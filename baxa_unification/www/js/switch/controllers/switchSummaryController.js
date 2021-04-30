switchModule.controller('switchSummaryController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$stateParams',
  '$ionicPlatform',
  '$ionicHistory',
  '$ionicNavBarDelegate',
  'selectedSwitchDetailsService',
  'switchDataService',
  function($scope, $rootScope, $log, $state, $stateParams,
    $ionicPlatform, $ionicHistory, $ionicNavBarDelegate,
    selectedSwitchDetailsService, switchDataService) {
    'use strict';
    $ionicHistory.clearHistory();
    $scope.flagShowPopup = false;
    if ($stateParams.flagShowPopup == 1) {
      $scope.flagShowPopup = true;
      var details = switchDataService.getData().then(function(result) {
        $scope.customerData = result;
      });
    } else {
      $scope.flagShowPopup = false;
      var details1 = switchDataService.getData().then(function(result) {
        $scope.customerData = [];
        for (var j = 0; j < result.length; j++) {
          var valArr = {};
          valArr.FirstName = result[j].FirstName;
          valArr.LastName = result[j].LastName;
          valArr.Cust_ID = result[j].Cust_ID;
          valArr.MobileNo = result[j].MobileNo;
          valArr.CreatedDate = new Date(result[j].CreatedDate);
          $scope.customerData.push(valArr);
        }

      });
    }
    $scope.onClickCustomerData = function(userData) {
      $scope.screenschng = true;
      document.addEventListener("pause", navigatePhone, false);
      function navigatePhone(){
        $rootScope.navigatePhone = true;
      }

      if (screen.width > screen.height) {
        $log.debug("****************************", userData.Cust_ID);
        var customerSummary = switchDataService.getProfileData(userData.Cust_ID);
        customerSummary.then(function(custDetails) {
          var priority = JSON.parse(custDetails.LifeStagePriority);
          var priorityItem = [];
          angular.forEach(priority, function(items) {
            var calcCount = switchDataService.getCalcTotal(items.id, userData.Cust_ID);
            calcCount.then(function(val) {
              items.count = val;
            });
            priorityItem.push(items);
          }, priorityItem);
          $scope.custDetails = custDetails;
          $scope.custDetails.CreatedDate = new Date(custDetails.CreatedDate).getTime();
          $scope.custDetails.ModifiedDate = new Date(custDetails.ModifiedDate).getTime();
          $scope.custDetailsLife = priorityItem;
          $scope.activeMenu = userData;

          var piSummary = switchDataService.getCustomerPiSummary(userData.Cust_ID);
          piSummary.then(function(pI) {
            $log.debug('pI', pI);
            $scope.custPiSummary = pI;
          });
        });


        $scope.needPrioritisationPage = function() {
          $state.go('app.needPrioritisation', {
            customerId: $scope.custDetails.Cust_ID
          });
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
      } else {
        $state.go('app.customer-summary', {
          customerId: userData.Cust_ID
        });
      }
      /*vimo popup*/

      $scope.showYmoPopUp = function() {
        $scope.YmoPopUp = true;
      };
      $scope.hideYmoPopUp = function() {
        $scope.YmoPopUp = false;
        // $state.transitionTo($state.$current, null, {reload : true});
      };

    };
    $scope.reloadState = function() {
      $scope.flagShowPopup = true;
    };
    $scope.onClickYes = function() {
      $scope.flagShowPopup = false;
    };
    $scope.onClickNo = function() {
      var data = $scope.noData;
      selectedSwitchDetailsService.setSelectedData(data);
      $state.go('app.switch-customer-profile');
    };
    $scope.createNewRelationship = function() {
      $state.go('app.switch-customer-profile');
    };
    $scope.closePopup = function() {
      $scope.flagShowPopup = false;
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
