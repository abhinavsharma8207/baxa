switchModule.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    'use strict';
    /*Switch Routing */
    $stateProvider
      .state('app.switch', {
        cache: false,
        url: "/switch",
        views: {
          'menuContent': {
            templateUrl: "js/switch/templates/switch-summary.html",
            controller: 'switchSummaryController'
          }
        }
      })

    .state('app.customer-summary', {
      cache: false,
      url: '/customer-summary/:customerId',
      views: {
        'menuContent': {
          templateUrl: "js/switch/templates/customer-summary.html",
          controller: 'customerSummaryController'
        }
      }
    })

    .state('app.switch-customer-profile', {
      cache: false,
      url: '/switch-customer-profile',
      views: {
        'menuContent': {
          templateUrl: "js/switch/templates/switch-customer-profile.html",
          controller: 'switchCusrtomerProfileController'
        }
      }
    })

    .state('app.Vymo', {
      cache: false,
      url: '/Vymo/:flagShowPopup',
      views: {
        'menuContent': {
          templateUrl: "js/switch/templates/switch-summary.html",
          controller: 'switchSummaryController'
        }
      }
    })

    .state('switchtab', {
      url: '/switchtab',
      abstract: true,
      templateUrl: "js/switch/templates/switchTaps.html"
    })

    .state('app.lifestage', {
      cache: false,
      url: '/lifestage/:customerId',
      views: {
        'menuContent': {
          templateUrl: "js/switch/templates/lifestage.html",
          controller: 'lifeStageController'
        }
      }
    })

    .state('app.needPrioritisation', {
      cache: false,
      url: '/needPrioritisation/:customerId/:tabThreeFlg',
      views: {
        'menuContent': {
          templateUrl: "js/switch/templates/needPrioritisation.html",
          controller: 'needPrioritisationController'
        }
      }
    })

    .state('app.productRecommendation', {
      cache: false,
      url: '/productRecommendation/:customerId',
      views: {
        'menuContent': {
          templateUrl: "js/switch/templates/productRecommendation.html",
          controller: 'productRecommendationController'
        }
      }
    })

    .state('app.switchEliteSecureQuote', {    
      url: "/switchEliteSecureQuote/:customerId",
      cache: false,
      views: {
        'menuContent': {        
          templateUrl: "js/switch/templates/quote-input.html",
          controller: 'eliteSecureQuoteController'
        }
      }
    })

    .state('app.switchEliteSecurePi', { 
      cache: false,
      url: "/switchEliteSecurePi/:customerId/:recId",
      views: {
        'menuContent': {    
          templateUrl: "js/switch/productIllustration/eliteSecure/templates/eliteSecurePi.html",
          controller: 'eliteSecurePiController'
        }
      }
    })

    .state('app.switchSamriddhiQuote', {    
      url: "/switchSamriddhiQuote/:customerId",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "js/switch/templates/quote-input.html",
          controller: 'switchSamriddhiQuoteController'
        }
      }
    })

    .state('app.switchSamriddhiPi', {  
        cache: false,
        url: "/switchSamriddhiPi/:customerId/:recId",
        views: {
          'menuContent': {    
            templateUrl: "js/switch/productIllustration/Samriddhi/templates/SamriddhiPi.html",
            controller: 'switchSamriddhiPiController'
          }
        }
      })
      .state('app.trippleHealthQuoteInput', {    
        url: "/trippleHealthQuoteInput/:customerId",
        cache: false,
        views: {
          'menuContent': {  
            templateUrl: "js/switch/templates/quote-input.html",
            controller: 'trippleHealthQuoteInput' 
          }
        }  
      })

    .state('app.trippleHealthPi', {    
      url: "/trippleHealthPi/:customerId/:recId",
      cache: false,
      views: {
        'menuContent': { 
          templateUrl: "js/switch/productIllustration/trippleHealth/templates/switchtrippleHealthPi.html",
          controller: 'switchTrippleHealthPi'  
        }
      } 
    })


    .state('app.FlexiSaveQuoteInput', {    
      url: "/FlexiSaveQuoteInput/:customerId",
      cache: false,
      views: {
        'menuContent': {  
          templateUrl: "js/switch/templates/quote-input.html",
          controller: 'flexiSaveQuoteController' 
        }
      }  
    })


    .state('app.switchFlexiSavePi', {  
      cache: false,
      url: "/switchFlexiSavePi/:customerId/:recId",
      views: {
        'menuContent': {    
          templateUrl: "js/switch/productIllustration/flexiSave/templates/flexiSavePi.html",
          controller: 'flexiSavePiController'
        }
      }
    })

    .state('app.switchSecureIncomeQuote', {    
      url: "/switchSecureIncomeQuote/:customerId",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "js/switch/templates/quote-input.html",
          controller: 'switchSecureIncomQuoteController'
        }
      }
    })

    .state('app.switchSecureIncomePi', {  
      cache: false,
      url: "/switchSecureIncomePi/:customerId/:recId",
      views: {
        'menuContent': {    
          templateUrl: "js/switch/productIllustration/SecureIncome/templates/secureIncomePi.html",
          controller: 'switchSecureIncomePiComtroller'
        }
      }
    })

    .state('app.switchChildAdvantageQuote', {  
      cache: false,
      url: "/switchChildAdvantageQuote/:customerId",
      views: {
        'menuContent': {    
          templateUrl: "js/switch/templates/quote-input.html",
          controller: 'switchChildAdvantageQuoteController'
        }
      }
    })

    .state('app.switchChildAdvantagePi', {  
      cache: false,
      url: "/switchChildAdvantagePi/:customerId/:recId",
      views: {
        'menuContent': {    
          templateUrl: "js/switch/productIllustration/childAdvantage/templates/childAdvantagePi.html",
          controller: 'switchChildAdvantagePiController'
        }
      }
    })

    .state('app.onTapCalcualtor', {
      url: "/onTapCalcualtor/:customerId/:typeId",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "js/switch/templates/onTapCalcualtor.html",
          controller: 'onTapCalcualtorController'
        }
      }
    })

    .state('app.switchWealth', {
      url: "/switchWealth/:fromSwitch",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "js/calculators/wealth/templates/wealth-home.html",
          controller: 'wealthCalculatorController'
        }
      }
    })

    .state('app.switchChildplan', {
      url: "/switchChildplan/:fromSwitch",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "js/calculators/childPlan/templates/childFuturePlan.html",
          controller: 'childFuturePlanController'
        }
      }
    })

    .state('app.switchChildOutput', {
      url: "/switchChildOutput/:customerId/:recId",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "js/calculators/childPlan/templates/childFuturePlannerDetailsView.html",
          controller: 'childPlanInvestmentController'
        }
      }
    })

    .state('app.switchWealthOutput', {    
      url: "/switchWealthOutput/:customerId/:recId",
      cache: false,
      views: {
        'menuContent': {    
          templateUrl: "js/calculators/wealth/templates/enter-investment.html",
          controller: 'wealthChartController'   
        }
      }
    })

    .state('app.switchRetirement', {    
      url: "/switchRetirement/:fromSwitch",
          cache: false,
      views: {
        'menuContent': {    
          templateUrl: "js/calculators/retirement/templates/retirement-home.html",
              controller: 'retirementCalculatorController'   
        }
      }
    })

    .state('app.switchRetirementOutput', {    
      url: "/switchRetirementOutput/:customerId/:recId",
          cache: false,
      views: {
        'menuContent': {    
          templateUrl: "js/calculators/retirement/templates/add-retirement-investments.html",
              controller: 'retirementCalculatorInvestController' 
        }
      }  
    })

    .state('app.switchEliteAdvantagePi', {    
      url: "/switchEliteAdvantagePi/:customerId/:recId",
          cache: false,
      views: {
        'menuContent': {    
          templateUrl: "js/switch/productIllustration/eliteAdvantage/templates/eliteAdvantagePi.html",
              controller: 'switchEliteAdvantagePi' 
        }
      }  
    })

    .state('app.switchEliteAdvantageInpute', {    
      url: "/switchEliteAdvantageInpute/:customerId",
          cache: false,
      views: {
        'menuContent': {    
          templateUrl: "js/switch/templates/quote-input.html",
              controller: 'switchEliteAdvantageInpute' 
        }
      }  

    })

    .state('app.switchAajeevanSampattiQuote', {    
      url: "/AajeevanSampattiQuoteInpute/:customerId",
      cache: false,
      views: {
        'menuContent': {  
          templateUrl: "js/switch/templates/quote-input.html",
          controller: 'switchAajeevanSampattiQuoteController' 
        }
      }  
    })
/*****Router for monthly advantage**/


.state('app.monthlyAdvInput', {    
  url: "/switchMonthlyAdvantageInput/:customerId",
  cache: false,
  views: {
    'menuContent': {  
      templateUrl: "js/switch/templates/quote-input.html",
      controller: 'monthlyAdvController' 
    }
  }  
})
       .state('app.monthlyAdvantagePi', {    
          url: "/switchMonthlyAdvantageInput/:customerId/:recId",
              cache: false,
          views: {
            'menuContent': {    
              templateUrl: "js/switch/productIllustration/monthlyAdvantage/templates/monthlyAdv.html",
                  controller: 'MAPiController' 
            }
          }  

    })

        .state('app.switchSuperSeriesPi', {    
      url: "/switchSuperSeriesPi/:customerId/:recId",
          cache: false,
      views: {
        'menuContent': {    
          templateUrl: "js/switch/productIllustration/superSeries/templates/switchSuperSeriesPi.html",
              controller: 'switchSuperSeriesPi' 
        }
      }  
    })

    .state('app.switchSuperSeriesQuote', {    
      url: "/switchSuperSeriesQuote/:customerId",
          cache: false,
      views: {
        'menuContent': {    
          templateUrl: "js/switch/templates/quote-input.html",
              controller: 'switchSuperSeriesQuote' 
        }
      }  
    });

  }
]);
