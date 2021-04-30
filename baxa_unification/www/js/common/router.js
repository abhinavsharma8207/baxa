unificationBAXA.config(
  function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    'use strict';
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $stateProvider
      .state('login', {
        url: "/login",
        cache: false,
        templateUrl: "js/common/templates/login.html",
        controller: 'loginController'
      });

    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: "js/common/templates/menu.html",
        controller: 'menuController'
      });

    $stateProvider
      .state('piSwitch', {
        url: "/piSwitch",
        cache: false,
        templateUrl: "js/common/templates/switchpi.html"
      });

    /** if none of the above states are matched, use this as the fallback**/
    $urlRouterProvider.otherwise('/login');
  });
