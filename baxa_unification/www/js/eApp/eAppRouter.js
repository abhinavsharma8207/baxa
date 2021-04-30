eAppModule.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$ionicConfigProvider',
  function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    'use strict';
    $stateProvider
      .state('app.eApp', {
        url: "/eApp",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/eapp-dashboard.html",
            controller: 'eAppDashboard'
          }
        }
      });

      $stateProvider
        .state('app.eApp-products', {
          url: "/eApp-products",
          cache: false,
          views: {
            'menuContent': {
              templateUrl: "js/eApp/templates/eApp.html",
              controller: 'eAppController'
            }
          }
        });

    /** Sandip Edited started**/

    $stateProvider
      .state('app.aajeevansampatti-LAAndProposer', {
        url: "/aajeevansampatti-LAAndProposer",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/la-proposer-details.html",
            controller: 'aajeevansampattiController'
          }
        }
      });

      /*** eApp Form Temporary routing ***/
      $stateProvider
      .state('app.eapp-forms', {
        cache: false,
        url: '/eapp-forms',
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/eapp-form.html",
            //controller: 'flexiSaveController'
          }
        }
      });
      /*** eApp Form Temporary routing ***/

    $stateProvider
      .state('app.aajeevansampatti-Home', {
        url: "/aajeevansampatti-Home",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/quote-input.html",
            controller: 'aajeevansampattiController',
          }
        }
      });

    $stateProvider
      .state('app.aajeevansampatti-estimated', {
        url: "/aajeevansampatti-estimated",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/aajeevansampatti/templates/aajeevansampatti-quote-output.html",
            controller: 'aajeevansampattiController'
          }
        }
      });
    /** Edit end**/

    $stateProvider
      .state('app.samriddhi-home', {
        url: "/samriddhi-home",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/quote-input.html",
            controller: 'samriddhiController'
          }
        }
      });

    $stateProvider
      .state('app.samriddhi-LAAndProposer', {
        url: "/samriddhi-LAAndProposer/:customerId",
        cache: false,
        views: {
          'menuContent': {
            templateUrl:  "js/eApp/templates/la-proposer-details.html",
            controller: 'samriddhiController'
          }
        }
      });

    $stateProvider
      .state('app.samriddhi-estimated', {
        url: "/samriddhi-estimated",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/Samriddhi/templates/samriddhi-quote-output.html",
            controller: 'samriddhiController'
          }
        }
      });

    $stateProvider
      .state('app.tripplehealth-LAAndProposer', {
        url: "/tripplehealth-LAAndProposer",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/la-proposer-details.html",
            controller: 'tripplehealthController',
          }
        }
      });
    /****elite Advantage ***********/
    $stateProvider
      .state('app.eliteAdvantage-estimated', {
        url: "/eliteAdvantage-estimated",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/eliteAdvantage/templates/eliteAdvantage-quote-output.html",
            controller: 'eliteAdvantageController'
          }
        }
      });

    $stateProvider
      .state('app.eliteAdvantage-home', {
        url: "/eliteAdvantage-home",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/quote-input.html",
            controller: 'eliteAdvantageController'
          }
        }
      });

    $stateProvider
      .state('app.eliteAdvantage-LAAndProposer', {
        url: "/eliteAdvantage-LAAndProposer",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/la-proposer-details.html",
            controller: 'eliteAdvantageController',
          }
        }
      });
    /**** end of elite Advantage ***********/
    $stateProvider
      .state('app.childAdvantage-LAAndProposer', {
        url: "/childAdvantage-LAAndProposer",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/la-proposer-details.html",
            controller: 'childAdvantageController',
          }
        }
      });

    $stateProvider
      .state('app.childAdvantage-home', {
        url: "/childAdvantage-home",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/quote-input.html",
            controller: 'childAdvantageController',
          }
        }
      });

    $stateProvider
      .state('app.tripple-home', {
        url: "/tripple-home",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/quote-input.html",
            controller: 'tripplehealthController',
          }
        }
      });

      $stateProvider
        .state('app.flexiSave-LAAndProposer', {
          url: "/flexiSave-LAAndProposer",
          cache: false,
          views: {
            'menuContent': {
              templateUrl: "js/eApp/templates/la-proposer-details.html",
              controller: 'flexiSaveController',
            }
          }
        });

    $stateProvider
      .state('app.flexiSave-home', {
        url: "/flexiSave-home",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/quote-input.html",
            controller: 'flexiSaveController',
          }
        }
      });

      $stateProvider
        .state('app.flexiSave-estimated', {
          url: "/app.flexiSave-estimated",
          cache: false,
          views: {
            'menuContent': {
              templateUrl: "js/eApp/flexiSave/templates/flexisave-quote-output.html",
              controller: 'flexiSaveController',
            }
          }
        });

    $stateProvider
      .state('app.tripplehealth-estimated', {
        url: "/app.tripplehealth-estimated",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/trippleHealth/templates/tripplehealth-quote-output.html",
            controller: 'tripplehealthController',
          }
        }
      });

      $stateProvider
        .state('app.childAdvantage-estimated', {
          url: "/app.childAdvantage-estimated",
          cache: false,
          views: {
            'menuContent': {
              templateUrl: "js/eApp/childAdvantage/templates/childadvantage-quote-output.html",
              controller: 'childAdvantageController',
            }
          }
        });

    $stateProvider
      .state('app.elitesecure-buying', {
        url: "/elitesecure-buying",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/elitesecure/templates/elitesecure-buying-for.html",
            controller: 'elitesecureController'
          }
        }
      });
    $stateProvider
      .state('app.elitesecure-LAAndProposer', {
        url: "/elitesecure-LAAndProposer/:customerId",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/la-proposer-details.html",
            controller: 'elitesecureController'
          }
        }
      });
    $stateProvider
      .state('app.elitesecure-home', {
        url: "/elitesecure-home",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/elitesecure/templates/elitesecure-quote-input.html",
            controller: 'elitesecureController'
          }
        }
      });
    $stateProvider
      .state('app.elitesecure-estimated', {
        url: "/elitesecure-estimated",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/elitesecure/templates/elitesecure-quote-output.html",
            controller: 'elitesecureController'
          }
        }
      });

    $stateProvider
      .state('app.secureincome-LAAndProposer', {
        url: "/secureincome-LAAndProposer/:customerId",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/la-proposer-details.html",
            controller: 'secureincomeController',
          }
        }
      });

    $stateProvider
      .state('app.secureincome-home', {
        url: "/secureincome-home",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/quote-input.html",
            controller: 'secureincomeController',
          }
        }
      });

    $stateProvider
      .state('app.secureincome-estimated', {
        url: "/app.secureincome-estimated",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/secureIncome/templates/secureincome-quote-output.html",
            controller: 'secureincomeController',
          }
        }
      });

      $stateProvider
        .state('app.superSeries-LAAndProposer', {
          url: "/superSeries-LAAndProposer",
          cache: false,
          views: {
            'menuContent': {
              templateUrl: "js/eApp/templates/la-proposer-details.html",
              controller: 'superSeriesController',
            }
          }
        });

    $stateProvider
      .state('app.superSeries-home', {
        url: "/superSeries-home",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "js/eApp/templates/quote-input.html",
            controller: 'superSeriesController',
          }
        }
      });

      $stateProvider
        .state('app.superSeries-estimated', {
          url: "/app.superSeries-estimated",
          cache: false,
          views: {
            'menuContent': {
              templateUrl: "js/eApp/superSeries/templates/superseries-quote-output.html",
              controller: 'superSeriesController',
            }
          }
        });


        /** Monthly Advantage ****/

        $stateProvider
          .state('app.monthlyAdvantage-LAAndProposer', {
            url: "/monthlyAdvantage-LAAndProposer",
            cache: false,
            views: {
              'menuContent': {
                templateUrl: "js/eApp/templates/la-proposer-details.html",
                controller: 'monthlyAdvantageController',
              }
            }
          });

      $stateProvider
        .state('app.monthlyAdvantage-home', {
          url: "/monthlyAdvantage-home",
          cache: false,
          views: {
            'menuContent': {
              templateUrl: "js/eApp/templates/quote-input.html",
              controller: 'monthlyAdvantageController',
            }
          }
        });

        $stateProvider
          .state('app.monthlyAdvantage-estimated', {
            url: "/app.monthlyAdvantage-estimated",
            cache: false,
            views: {
              'menuContent': {
                templateUrl: "js/eApp/monthlyAdvantage/templates/monthlyAdvantage-quote-output.html",
                controller: 'monthlyAdvantageController',
              }
            }
          });

          /** End of  Monthly Advantage ****/

          /** Future Invest ****/

          $stateProvider
            .state('app.futureInvest-LAAndProposer', {
              url: "/futureInvest-LAAndProposer",
              cache: false,
              views: {
                'menuContent': {
                  templateUrl: "js/eApp/templates/la-proposer-details.html",
                  controller: 'futureInvestController',
                }
              }
            });

        $stateProvider
          .state('app.futureInvest-home', {
            url: "/futureInvest-home",
            cache: false,
            views: {
              'menuContent': {
                templateUrl: "js/eApp/templates/quote-input.html",
                controller: 'futureInvestController',
              }
            }
          });

          $stateProvider
            .state('app.futureInvest-estimated', {
              url: "/app.futureInvest-estimated",
              cache: false,
              views: {
                'menuContent': {
                  templateUrl: "js/eApp/futureInvest/templates/futureInvest-quote-output.html",
                  controller: 'futureInvestController',
                }
              }
            });

            /** End of  Future Invest ****/

            $stateProvider
              .state('app.eProtect-LAAndProposer', {
                url: "/eProtect-LAAndProposer",
                cache: false,
                views: {
                  'menuContent': {
                    templateUrl: "js/eApp/templates/la-proposer-details.html",
                    controller: 'eProtectController',
                  }
                }
              });

          $stateProvider
            .state('app.eProtect-home', {
              url: "/eProtect-home",
              cache: false,
              views: {
                'menuContent': {
                  templateUrl: "js/eApp/templates/quote-input.html",
                  controller: 'eProtectController',
                }
              }
            });

            $stateProvider
              .state('app.eProtect-estimated', {
                url: "/app.eProtect-estimated",
                cache: false,
                views: {
                  'menuContent': {
                    templateUrl: "js/eApp/eProtect/templates/eProtect-quote-output.html",
                    controller: 'eProtectController',
                  }
                }
              });
  }
]);
