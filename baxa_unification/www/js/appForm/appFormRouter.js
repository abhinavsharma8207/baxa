appForm.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$ionicConfigProvider',
  function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    'use strict';
    $stateProvider
      .state('app.appForm', {
        url: "/appForm",
        cache: false,
        views: {
          'menuContent': {
            //templateUrl: "js/appForm/templates/app-Form-input.html",
            templateUrl: "js/appForm/templates/app-form-dashboard.html",
            controller: 'appFormController'
          }
        }
      });

    /** Sandip Edited started**/



  }
]);
