switchModule.controller('switchTabsController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$ionicPlatform',
  '$ionicHistory',
  '$ionicNavBarDelegate',
  '$ionicSlideBoxDelegate',
  function($scope, $rootScope, $log, $state,
    $ionicPlatform, $ionicHistory, $ionicNavBarDelegate, $ionicSlideBoxDelegate) {
    'use strict';
    $rootScope.popupopn = false;
    if ($state.current.name == 'app.lifestage') {
      $scope.selected = 1;
    }
    if ($state.current.name == 'app.needPrioritisation') {
      $scope.selected = 2;
    }
    if ($state.current.name == 'app.productRecommendation') {
      $scope.selected = 3;
    }
    if ($state.current.name == 'app.switchSamriddhiPi' || $state.current.name == 'app.switchEliteSecurePi' || $state.current.name == 'app.trippleHealthPi' ||
      $state.current.name == 'app.switchSecureIncomePi' || $state.current.name == 'app.switchFlexiSavePi' || $state.current.name == 'app.switchEliteAdvantagePi' ||
      $state.current.name == 'app.switchChildAdvantagePi') {
      $scope.selected = 4;
    }
    $scope.showData = function() {
      $scope.datalists = [{
        "id": 1,
        "name": "Life Stage"
      }, {
        "id": 2,
        "name": "Needs Prioritisation"
      }, {
        "id": 3,
        "name": "Products Recommendation"
      }, {
        "id": 4,
        "name": "Customised Illustration"
      }];
      // $scope.select = function(item) {
      // 	       $scope.selected = item;
      // 	};
      // $scope.isActive = function(item) {
      // 	       return $scope.selected === item;
      // 	};
      $scope.selectedtab = function(id, custId) {
        //alert(id +','+custId);
        if (id == 1) {
          $state.go('app.lifestage', {
            customerId: custId
          });
        }

        if (id == 2) {
          if ($rootScope.slideChangedSave == true) {
            $rootScope.popupopn = true;
          } else {
            $rootScope.slideChangedSave = false;
            $state.go('app.needPrioritisation', {
              customerId: custId,
            });
          }
        }

        if (id == 3) {
          if ($rootScope.slideChangedSave == true) {
            $rootScope.popupopn = true;
          } else {
            $rootScope.slideChangedSave = false;
            $state.go('app.productRecommendation', {
              customerId: custId,
            });
          }
        }

        if (id == 4) {
          $state.go('', {
            customerId: custId,
          });
        }
      };
    };
  }
]);
