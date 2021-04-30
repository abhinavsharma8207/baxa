var otherCalculators = angular.module('otherCalculators', ['oc.lazyLoad']);
otherCalculators.controller('calculatorHomeController', [
  '$rootScope',
  '$ionicHistory',
  function($rootScope,$ionicHistory) {
  'use strict';
  $rootScope.reloadCalculatorDefault = 'Yes';
  $rootScope.saveResult = false;
  $rootScope.fromSwitchSummary = false;
  $rootScope.calCustId = null;
  $ionicHistory.clearHistory();
}]);
