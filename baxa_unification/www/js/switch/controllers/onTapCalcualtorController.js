switchModule.controller('onTapCalcualtorController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$q',
  '$ionicPlatform',
  '$ionicHistory',
  '$ionicNavBarDelegate',
  'switchDataService',
  function($scope, $rootScope, $log, $state, $q,
    $ionicPlatform, $ionicHistory, $ionicNavBarDelegate,
    switchDataService) {
    'use strict';
    $log.debug('urlparams', $state.params.customerId);
    $log.debug('urlparams', $state.params.typeId);
    $scope.typeId = $state.params.typeId;
    $scope.pageTitle = calcLink(parseInt($state.params.typeId));
    $log.debug('title', $scope.pageTitle);
    var calDetails = switchDataService.getCalculatorData($state.params.typeId, $state.params.customerId).then(function(result) {
      $scope.calculatorData = [];
      for (var j = 0; j < result.length; j++) {
        var valArr = {};
        valArr.FKCust_ID = result[j].FKCust_ID;
        valArr.CreatedBy = result[j].CreatedBy;
        valArr.Type = result[j].Type;
        valArr.PKSwitchCalculator = result[j].PKSwitchCalculator;
        valArr.CreatedDate = new Date(result[j].CreatedDate).getTime();
        valArr.link = calcLink(result[j].Type); //'#/switchWealthOutput/';
        $scope.calculatorData.push(valArr);
      }
      $log.debug('result', result);
      $log.debug('calculatorData', $scope.calculatorData);
    });

    /**Hide popup for deleting calculator.**/
    $scope.hideCalculatorPopup = function() {
      $scope.showDeleteCalculatorPopup = false;
    };

    /**show popup for deleting CalculatorPopup.**/
    $scope.showCalculatorPopup = function(PKSwitchCalculator) {
      $scope.showDeleteCalculatorPopup = true;
      $scope.deletePKSwitchCalculator = PKSwitchCalculator;
    };

    $scope.deleteCalculatorPopupOnOk = function() {
      switchDataService.deleteCalData($scope.deletePKSwitchCalculator)
        .then(function(result) {
          $scope.showDeleteCalculatorPopup = false;
          var calDetails = switchDataService.getCalculatorData($state.params.typeId, $state.params.customerId).then(function(result) {
            $scope.calculatorData = [];
            for (var j = 0; j < result.length; j++) {
              var valArr = {};
              valArr.FKCust_ID = result[j].FKCust_ID;
              valArr.CreatedBy = result[j].CreatedBy;
              valArr.Type = result[j].Type;
              valArr.PKSwitchCalculator = result[j].PKSwitchCalculator;
              valArr.CreatedDate = result[j].CreatedDate;
              valArr.CreatedDate = new Date(result[j].CreatedDate).getTime();
              valArr.link = calcLink(result[j].Type);
              $scope.calculatorData.push(valArr);
            }
          });
        });
    };

    function calcLink(typeId) {
      var cal = {
        link: null,
        title: null
      };
      switch (typeId) {
        case 1:
          cal.link = '#/app/switchRetirementOutput/' + $state.params.customerId;
          cal.title = 'Retirement Summary';
          break;
        case 2:
          cal.link = '#/app/switchWealthOutput/' + $state.params.customerId;
          cal.title = 'Wealth Summary';
          break;
        case 3:
          cal.link = '#/app/switchChildOutput/' + $state.params.customerId;
          cal.title = 'Child Summary';
          break;
        case 4:
          cal.link = '#/app/switchWealthOutput/' + $state.params.customerId;
          cal.title = 'HLV Summary';
          break;
      }
      return cal;
    }

    $scope.loadLink = "";
    $log.debug('$state.params.isClicked ::' + $state.params.recId);
    if (screen.width > screen.height) {
      $scope.isTablet = true;

      if ($rootScope.selectedRecId != undefined || $rootScope.selectedRecId != null) {
        $scope.isShow = true;
      } else {
        $scope.isShow = false;
      }
    } else {
      $scope.isTablet = false;
    }

    $scope.goToCalOutput = function(typeId, link, PKSwitchCalculator) {
      $log.debug('typeId ::' + typeId);
      $log.debug('link ::' + link);
      $log.debug('PKSwitchCalculator::' + PKSwitchCalculator);
      $log.debug('$scope.isTablet::' + $scope.isTablet);
      $scope.loadLink = link + "/" + PKSwitchCalculator;
      $log.debug('$scope.loadLink ::' + $scope.loadLink);
      $log.debug(" $state.current.name :", $state.current.name);
      $rootScope.selectedRecId = PKSwitchCalculator;
      $scope.isShow = true;
      $state.transitionTo($state.$current, {
        customerId: $state.params.customerId,
        typeId: $state.params.typeId,
        recId: PKSwitchCalculator
      }, {
        reload: true
      });
    };

    /**back routing ***/
    $scope.goBack = function() {
      if (screen.width > screen.height) {
        $state.go('app.switch', {
          customerId: $state.params.customerId
        });
      } else {
        $state.go('app.customer-summary', {
          customerId: $state.params.customerId
        });
      }
    };

    if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
      $ionicNavBarDelegate.showBackButton(false);
    } else {
      $ionicNavBarDelegate.showBackButton(true);
    }

    $ionicPlatform.registerBackButtonAction(function() {
      $scope.goBack();
    }, 100);

  }
]);
