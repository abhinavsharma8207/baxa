unificationBAXA.controller('menuController', ['$scope',
  '$log',
  '$state',
  '$ionicHistory',
  function($scope, $log, $state, $ionicHistory) {
    'use strict';
    $scope.gotoModule = function(moduleName) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      if (moduleName == "pce") {
        $state.go('app.home');
      } else if (moduleName == "dsu") {
        $state.go('app.tabs-landing-dsu.today');
      } else if (moduleName == "cal") {
        $state.go('app.calculators');
      } else if (moduleName == "switch") {
        $state.go('app.switch');
      } else if (moduleName == "eapp") {
        $state.go('app.eApp');
      } else if (moduleName == "appForm") {
        $state.go('app.appForm');
      } else if (moduleName == "vymo") {
        $state.go('app.Vymo', {
          flagShowPopup: 1
        });
      }
    };
  }
]);
