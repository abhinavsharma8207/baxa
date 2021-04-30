otherCalculators.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$ionicConfigProvider',
  function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    'use strict';
    $stateProvider
      .state('app.calculators', {
        url: "/calculators",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/calculators/calculators.html",
            controller: 'calculatorHomeController'
          }
        }
      })

    .state('app.retirement-home', {
      url: "/retirement-home",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "js/calculators/retirement/templates/retirement-home.html",
          controller: 'retirementCalculatorController'
        }
      }
    })

    .state('app.retirement-calculator', {
      url: "/retire-calculator",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "js/calculators/retirement/templates/retire-calculator.html",
          controller: 'retirementCalculatorChartController'
        }
      }
    })

    .state('app.add-retirement-investments', {
      url: "/add-retirement-investments",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "js/calculators/retirement/templates/add-retirement-investments.html",
          controller: 'retirementCalculatorInvestController'
        }
      }
    })

    .state('app.wealth', {
      url: "/wealth",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "js/calculators/wealth/templates/wealth-home.html",
          controller: 'wealthCalculatorController'
        }
      }
    })

    .state('app.calcWealth', {
      url: "/calcWealth",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "js/calculators/wealth/templates/calc-wealth.html",
          controller: 'wealthChartController'
        }
      }
    })

    .state('app.enterInvestment', {
      url: "/enterInvestment",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "js/calculators/wealth/templates/enter-investment.html",
          controller: 'wealthChartController'
        }
      }
    })

    .state('app.childplan', {
      url: "/childplan",
      cache: false,
      views: {
        'menuContent': {
      templateUrl: "js/calculators/childPlan/templates/childFuturePlan.html",
      controller: 'childFuturePlanController'
    }
  }
    })

    .state('app.childFuturePlanner', {
      url: "/childFuturePlanner",
      cache: false,
      views: {
        'menuContent': {
      templateUrl: "js/calculators/childPlan/templates/childFuturePlanner.html",
      controller: 'childFuturePlannerController'
    }
  }
    })

    .state('app.childFuturePlannerDetailsView', {
      url: "/childFuturePlannerDetailsView",
      cache: false,
      views: {
        'menuContent': {
      templateUrl: "js/calculators/childPlan/templates/childFuturePlannerDetailsView.html",
      controller: 'childPlanInvestmentController'
    }
  }
    })

    .state('humanLifeCalculator', {
      url: "/hlv",
      cache: false,
      templateUrl: "js/calculators/hlv/templates/humanLifeCalculator.html",
      controller: 'humanLifeCalculatorController'
    })

    .state('humanLifeCalculatorOutput', {
      url: "/humanLifeCalculatorOutput",
      cache: false,
      templateUrl: "js/calculators/hlv/templates/humanLifeCalculatorOutput.html"
    });
  }
]);
