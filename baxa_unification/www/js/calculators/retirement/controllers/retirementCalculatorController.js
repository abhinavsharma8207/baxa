otherCalculators.controller(
  'retirementCalculatorController', [
    '$rootScope',
    '$scope',
    '$state',
    '$log',
    '$ionicHistory',
    '$ionicPlatform',
    '$ionicNavBarDelegate',
    '$cordovaFile',
    '$ionicModal',
    'retCalSvc',
    'retirement_const',
    'commonFileFunctionFactory',
    'switchDataService',
    function($rootScope,
      $scope,
      $state,
      $log,
      $ionicHistory,
      $ionicPlatform,
      $ionicNavBarDelegate,
      $cordovaFile,
      $ionicModal,
      retCalSvc,
      retirement_const,
      commonFileFunctionFactory,
      switchDataService) {
      'use strict';
      $scope.formValid = true;
      $rootScope.tabInclude = false;
      $scope.collapsed = true;
      $scope.uncollapsed = false;
      $scope.ageVError = false;
      $scope.retageVError = false;
      $scope.monthExpVError = false;
      $scope.inflationVError = false;
      $scope.oldAgeExpenseVError = false;
      $rootScope.saveResult = false;
      $scope.AgeRange = {
        min: retirement_const.ageMin,
        max: retirement_const.ageMax
      };
      $scope.RetAgeRange = {
        min: retirement_const.retageMin,
        max: retirement_const.retageMax
      };
      $scope.monthlyExpenseRange = {
        min: retirement_const.MonthlyExpensesValueMin,
        max: retirement_const.MonthlyExpensesValueMax
      };
      $scope.inflationRange = {
        min: 0,
        max: 50
      };
      $scope.ageDiffHighLow = retirement_const.AgeDiffHighLow;
      $scope.retageDiffHighLow = retirement_const.RetAgeDiffHighLow;
      $scope.minMnthlExp = true;
      $scope.retirementObj = {
        currentAgeValue: retirement_const.CurrentAgeValueDefault,
        retirementAgeValue: retirement_const.RetirementAgeValueDefault,
        monthlyExpensesValue: retirement_const.MonthlyExpensesValueDefault,
        inflation: retirement_const.Inflation,
        oldAgeExpensePercent: retirement_const.oldAgeExpensePercent
      };
      $scope.currentMonthlyExpensesFirstRangeMax = retirement_const.currentMonthlyExpensesFirstRangeMax;
      $scope.inflationRange = {
        min: retirement_const.inflationMin,
        max: retirement_const.inflationMax
      };

      if ($state.params.fromSwitch) {   
        $rootScope.saveResult = true;   
        $rootScope.calCustId = $state.params.fromSwitch; 
        var retirementProfileData = switchDataService.getProfileData($state.params.fromSwitch);
        retirementProfileData.then(function(profileDetails) {
          if (profileDetails.Age >= 25 && profileDetails.Age <= 60) {
            $scope.retirementObj.currentAgeValue = profileDetails.Age;
          }
        });
      }

      if ($rootScope.reloadCalculatorDefault != null) {
        if ($rootScope.reloadCalculatorDefault == "No") {
          var corpusObj = retCalSvc.retCorpusObjfunc();
          if (corpusObj != null) {
            $scope.retirementObj.currentAgeValue = corpusObj.age;
            $scope.retirementObj.inflation = corpusObj.inflation;
            $scope.retirementObj.retirementAgeValue = corpusObj.retirementAge;
            $scope.retirementObj.monthlyExpensesValue = corpusObj.currentMonthlyExpenses;
            $scope.retirementObj.oldAgeExpensePercent = corpusObj.retExpensesPercent;
          }
        }
      }

      $scope.numDifferentiation = function(val) {
        if (val >= 10000000) val = (val / 10000000).toFixed(2) + ' Cr';
        else if (val >= 100000) val = (val / 100000).toFixed(2) + ' Lac';
        else if (val >= 1000) val = (val / 1000).toFixed(2) + ' K';
        return val;
      };

      if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
        $ionicNavBarDelegate.showBackButton(false);
      } else { 
        $ionicNavBarDelegate.showBackButton(false);
      }

      /*Animation Code*/
      $scope.animateClass = animateNgClass('bounceInDown', 'animationduration25');

      $scope.onClickBack1 = function() {
        if ($rootScope.calCustId != null) {
          $state.go('app.needPrioritisation', {
            customerId: $rootScope.calCustId
          });
        } else {
          $state.go('app.calculators');
        }
      };

      /**android back button functionality**/
      $scope.goBack = function() {
        $log.debug("wilth:>", $state.current.name);
        if ($state.current.name == 'switchRetirement') {
          $state.go("app.needPrioritisation", {
            customerId: $rootScope.calCustId
          });
        } else if ($state.current.name == 'app.retirement-calculator') {
          $log.debug($rootScope.saveResult);
          $log.debug("wilth::", $state.current.name);
          if ($rootScope.saveResult == true) {
            $state.go("app.switchRetirement", {
              customerId: $rootScope.calCustId
            });
          } else {
            $state.go('app.retirement-home');
          }
        } else if ($state.current.name == 'app.add-retirement-investments') {
          if ($rootScope.saveResult == true) {
            $state.go("app.retirement-calculator", {
              customerId: $rootScope.calCustId
            });
          } else {
            $state.go('app.retirement-calculator');
          }
        } else if ($state.current.name  == "app.switchRetirement") {
          $state.go("app.needPrioritisation", {
            customerId: $rootScope.calCustId
          });
        } else {
          $ionicHistory.goBack();
        }
      };
      if (ionic.Platform.isAndroid()) {   
        $ionicPlatform.registerBackButtonAction(function(event) {
          $scope.goBack();
        }, 100);
      }

      $scope.toggleNotes = function(divId) {
        if (divId == 'CurrentMnth') {
          $scope.showNoteCurrentMnth = !$scope.showNoteCurrentMnth;
        }
      };

      $scope.calculateInvestments = function() {
        var rateofreturncorpus = retirement_const.RateOfReturnCorpus;
        if ($scope.retirementObj.monthlyExpensesValue != 0) {
          retCalSvc.calCorpus($scope.retirementObj.currentAgeValue, $scope.retirementObj.retirementAgeValue, $scope.retirementObj.monthlyExpensesValue, $scope.retirementObj.inflation, $scope.retirementObj.oldAgeExpensePercent, rateofreturncorpus);
          $state.go('app.retirement-calculator');
        }
      }

      $scope.toggle = function() {
        $scope.collapsed = !$scope.collapsed;
        $scope.uncollapsed = !$scope.uncollapsed;
        $scope.minMnthlExp = !$scope.minMnthlExp;
        if ($scope.collapsed) {
          $scope.retirementObj.monthlyExpensesValue = 1000;
        }
      };

      $scope.$watch('retirementObj.currentAgeValue', function() {
        var str1 = "" + $scope.retirementObj.currentAgeValue;
        if (str1.indexOf('.') !== -1) {
          $scope.retirementObj.currentAgeValue = 25;
        }
        if ($scope.retirementObj.currentAgeValue < 25 || $scope.retirementObj.currentAgeValue > 60) {
          $scope.formValid = false;
        } else {
          $scope.formValid = true;
        }
      }, true);

      $scope.$watch('retirementObj.retirementAgeValue', function() {
        var value = "" + $scope.retirementObj.retirementAgeValue;
        if (value.indexOf('.') !== -1) {
          $scope.retirementObj.retirementAgeValue = 30;
        }
        if ($scope.retirementObj.retirementAgeValue < 30 || $scope.retirementObj.retirementAgeValue > 70) {
          $scope.formValid = false;
        } else {
          $scope.formValid = true;
        }
      }, true);

      $scope.$watch('retirementObj.monthlyExpensesValue', function() {
        var value = "" + $scope.retirementObj.monthlyExpensesValue;
        if (value.indexOf('.') !== -1) {
          $scope.retirementObj.monthlyExpensesValue = 20000;
        }
        if ($scope.retirementObj.monthlyExpensesValue > 50000) {
          $scope.collapsed = false;
          $scope.uncollapsed = true;
          $scope.minMnthlExp = false;
        }
        if ($scope.retirementObj.monthlyExpensesValue <= 50000) {
          $scope.collapsed = true;
          $scope.uncollapsed = false;
          $scope.minMnthlExp = true;
        }
        if ($scope.retirementObj.monthlyExpensesValue < 1000 || $scope.retirementObj.monthlyExpensesValue > 100000) {
          $scope.formValid = false;
        } else {
          $scope.formValid = true;
        }
      }, true);

      $scope.$watch('retirementObj.inflation', function() {
        var value = "" + $scope.retirementObj.inflation;
        if (value.indexOf('.') !== -1) {
          $scope.retirementObj.inflation = 10;
        }
        if ($scope.retirementObj.inflation < 0 || $scope.retirementObj.inflation > 50) {
          $scope.formValid = false;
        } else {
          $scope.formValid = true;
        }
      }, true);

    }
  ]);
