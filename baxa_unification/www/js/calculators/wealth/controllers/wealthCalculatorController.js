/**
 * Created By: Atul A
 * Wealth Creation Calculation Service
 *
 * @class wealthCalculatorController
 * @submodule core-controller
 * @constructor
 */
otherCalculators.controller(
  'wealthCalculatorController', [
    '$rootScope',
    '$scope',
    '$log',
    '$state',
    '$ionicHistory',
    '$ionicPlatform',
    '$ionicNavBarDelegate',
    'wealthCalculatorService',
    'wealthCalculatorSetGetService',
    'amtunitFilter',
    'switchDataService',
    function($rootScope,
      $scope,
      $log,
      $state,
      $ionicHistory,
      $ionicPlatform,
      $ionicNavBarDelegate,
      wealthCalculatorService,
      wealthCalculatorSetGetService,
      amtunitFilter,
      switchDataService) {
       'use strict';
        $scope.tabInclude = false;
        $scope.wealth = {
        minAge: "25",
        maxAge: "60",
        currentAge: "35",
        minFunds: "100000",
        maxFunds: "5000000",
        minFundsP: "5100000",
        maxFundsP: "100000000",
        fundsRequired: "5000000",
        minYears: "1",
        maxYears: "20",
        years: "10",
        rateOfRtrn: "10",
      };
      $scope.fundRangeMin = true;
      $scope.extraFundsRange = false;
      $scope.extraFundsAdd = true;
      $scope.extraFundsMin = false;

      if ($state.params.fromSwitch) {
        $rootScope.saveResult = true;
        $rootScope.calCustId = $state.params.fromSwitch;
        var wealthProfileData = switchDataService.getProfileData($state.params.fromSwitch);
        wealthProfileData.then(function(profileDetails) {
          $log.debug("the customerprofile details is as fallows", profileDetails.Age);
          if (profileDetails.Age >= 25 && profileDetails.Age <= 60) {
            $scope.wealth.currentAge = profileDetails.Age;
          }
        });
        $log.debug('saveResult', $rootScope.saveResult);
        $log.debug('calCustId', $rootScope.calCustId);
      }
      $log.debug('$state', $state.previous);
      /*Get user added data*/
      $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;
      });
      if ($rootScope.previousState == 'app.calculators') {
        var setData = {
          currentAge: null,
          fundReqAge: null,
          investmentReq: null,
          wealthGoal: null,
          wealthInYears: null,
          investmentReqPerMnth: null,
          assetCreated: null,
          wealthRoR: null
        };
        wealthCalculatorSetGetService.setSelectedData(setData);
      } else {
        var userFormData = wealthCalculatorSetGetService.getSelectedData();
        if (userFormData.currentAge != null) {
          $scope.wealth.currentAge = userFormData.currentAge;
          $scope.wealth.fundsRequired = userFormData.wealthGoal;
          $scope.wealth.years = userFormData.wealthInYears;
          $scope.wealth.rateOfRtrn = userFormData.wealthRoR;
          if ($scope.wealth.fundsRequired > 5000000) {
            $scope.extraFundsRange = !$scope.extraFundsRange;
            $scope.extraFundsAdd = !$scope.extraFundsAdd;
            $scope.extraFundsMin = !$scope.extraFundsMin;
            $scope.fundRangeMin = !$scope.fundRangeMin;
          }
        }
      }

      $scope.doCalculate = function(userInput) {
        $log.debug(userInput);
        $rootScope.ror = userInput.rateOfRtrn;
        $rootScope.investmentRequired = wealthCalculatorService.calcInvestmentRequired(userInput);
        $state.go('app.calcWealth');
      };

      $scope.showExtra = function() {
        if ($scope.wealth.fundsRequired > 5000000) {
          $scope.extraFundsRange = true;//!$scope.extraFundsRange;
          $scope.extraFundsAdd = false;//!$scope.extraFundsAdd;
          $scope.extraFundsMin = true;//!$scope.extraFundsMin;
          $scope.fundRangeMin = false;//!$scope.fundRangeMin;
        }
        if ($scope.wealth.fundsRequired < 5000000) {
          $scope.extraFundsRange = false;
          $scope.extraFundsAdd = true;
          $scope.extraFundsMin = false;
          $scope.fundRangeMin = true;
        }
        /*if ($scope.wealth.fundsRequired > 100000000) {
          $scope.wealth.fundsRequired = 100000000;
        }*/
      };

      $scope.addFundsRange = function() {
        $scope.fundRangeMin = !$scope.fundRangeMin;
        $scope.extraFundsRange = !$scope.extraFundsRange;
        $scope.extraFundsAdd = !$scope.extraFundsAdd;
        $scope.extraFundsMin = !$scope.extraFundsMin;
        if (!$scope.extraFundsMin) {
          $scope.wealth.fundsRequired = "100000";
        }
        if ($scope.extraFundsRange) {
          $scope.wealth.fundsRequired = "5100000";
        }
      };

      $scope.numDifferentiation = function(val) {    
        if (val >= 10000000) val = (val / 1000000000).toFixed(2) + ' Cr';    
        else if (val >= 100000) val = (val / 10000000).toFixed(2) + ' Lakh';    
        else if (val >= 1000) val = (val / 100000).toFixed(2) + ' K';    
        return val; 
      };

      $scope.rangePercentage = function(input, range_min, range_max, range_2ndMax) {
        var percentage = ((input - range_min) * 100) / (range_max - range_min);
        if (percentage > 100) {
          if (typeof range_2ndMax !== 'undefined') {
            percentage = ((range_2ndMax - input) * 100) / (range_2ndMax - range_max);
            if (percentage < 0) {
              percentage = 0;
            }
          } else {
            percentage = 100;
          }
        } else if (percentage < 0) {
          percentage = 0;
        }
        $log.debug(percentage);
        $scope.rangePer = Math.round(percentage);
        return percentage;
      };

      if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
        $ionicNavBarDelegate.showBackButton(false);
      } else { 
        $ionicNavBarDelegate.showBackButton(false);
      }
      /*Animation Code*/
      $scope.animateClass = animateNgClass('bounceInDown', 'animationduration25');

      $scope.goBack = function() {
        $log.debug("current state" + $state.current.name);
        if ($state.current.name == 'app.switchWealth') {
          $state.go("app.needPrioritisation", {
            customerId: $rootScope.calCustId
          });
        } else if ($state.current.name == 'app.calcWealth') {
          if ($rootScope.saveResult == true) {
            $state.go("app.switchWealth", {
              customerId: $rootScope.calCustId
            });
          } else {
            $state.go('app.wealth');
          }
        } else if ($state.current.name == 'app.enterInvestment') {
          if ($rootScope.saveResult == true) {
            $state.go("app.calcWealth", {
              customerId: $rootScope.calCustId
            });
          } else {
            $state.go('app.calcWealth');
          }
        } else if ($rootScope.saveResult == false) {
          $state.go('app.calculators');
        } else {
          $ionicHistory.goBack();
        }
      };

      if (ionic.Platform.isAndroid()) {   
        $ionicPlatform.registerBackButtonAction(function(event) {
          $scope.goBack();
        }, 100);
      }

    }
  ]);
