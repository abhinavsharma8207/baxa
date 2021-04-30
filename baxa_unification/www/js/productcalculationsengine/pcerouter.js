productCalculator.config(
  function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    'use strict';
    /**productcalculationsengine home page**/
    $stateProvider
      .state('app.home', {
        url: "/home",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/productcalculationsengine/pcehome.html",
            controller: 'pceHomeController'
          }
        }
      });

    /**pce aajeevansampatti routing**/
    $stateProvider
      .state('aajeevansampatti', {
        url: "/aajeevansampatti",
        cache: false,
        templateUrl: "js/productcalculationsengine/aajeevansampatti/templates/as-home.html",
        controller: 'as.calculatePremiumCntrl'
      });

    /**pce samriddhi routing**/
    $stateProvider
      .state('samriddhi', {
        url: "/samriddhi",
        cache: false,
        templateUrl: "js/productcalculationsengine/samriddhi/templates/samriddhi-home.html",
        controller: 'samriddhi.calculatePremiumCtrl'
      });

    /**pce trippleHealth routing**/
    $stateProvider
      .state('trippleHealth', {
        url: "/trippleHealth",
        cache: false,
        templateUrl: "js/productcalculationsengine/trippleHealth/templates/trippleHealth-home.html",
        controller: 'trippleHealth.calculatePremiumCntrl'
      });

    /**pce eliteSecure routing**/
    $stateProvider
      .state('eliteSecure', {
        url: "/eliteSecure",
        cache: false,
        templateUrl: "js/productcalculationsengine/elitesecure/templates/esHome.html",
        controller: 'eSCalculationController'
      });

    /**pce secureIncome routing**/
    $stateProvider
      .state('secureIncome', {
        url: "/secureIncome",
        cache: false,
        templateUrl: "js/productcalculationsengine/secureIncome/templates/sIncomeHome.html",
        controller: 'sICalculationController'
      });

    /**pce flexiSave routing**/
    $stateProvider
      .state('flexiSave', {
        url: "/flexiSave",
        cache: false,
        templateUrl: "js/productcalculationsengine/flexiSave/templates/fSHome.html",
        controller: 'fSCalculationController'
      });

    /**pce fSEstimated routing**/
    $stateProvider
      .state('fSEstimated', {
        url: "/fSEstimated",
        cache: false,
        templateUrl: "js/productcalculationsengine/flexiSave/templates/fSEstimated.html",
      });

    /**pce eliteAdvantage routing**/
    $stateProvider
      .state('eliteAdvantage', {
        url: "/eliteAdvantage",
        cache: false,
        templateUrl: "js/productcalculationsengine/eliteAdvantage/templates/eAHome.html",
        controller: 'eACalculationController'
      });

    /**pce futureInvest routing**/
    $stateProvider
      .state('futureInvest', {
        url: "/futureInvest",
        cache: false,
        templateUrl: "js/productcalculationsengine/futureInvest/templates/fi-home.html",
        controller: 'fICalculationController'
      });

    /**pce superSeries routing**/
    $stateProvider
      .state('superSeries', {
        url: "/superSeries",
        cache: false,
        templateUrl: "js/productcalculationsengine/superSeries/templates/sSHome.html",
        controller: 'sSCalculationController'
      });


  /**pce childAdvantage routing**/
  $stateProvider
    .state('childAdvantage', {
      url: "/childAdvantage",
      cache: false,
      templateUrl: "js/productcalculationsengine/childAdvantage/templates/cAHome.html",
      controller: 'cACalculationController'
    });

    /**pce monthlyAdvantage routing**/
    $stateProvider
      .state('monthlyAdvantage', {
        url: "/monthlyAdvantage",
        cache: false,
        templateUrl: "js/productcalculationsengine/monthlyAdvantage/templates/mAHome.html",
        controller: 'mACalculationController'
      });

      /**pce eProtect routing**/
      $stateProvider
        .state('eProtect', {
          url: "/eProtect",
          cache: false,
          templateUrl: "js/productcalculationsengine/eProtect/templates/eProtectHome.html",
          controller: 'ePCalculationController'
        });
});
