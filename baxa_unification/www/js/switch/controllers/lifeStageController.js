switchModule.controller('lifeStageController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$ionicPlatform',
  '$ionicHistory',
  'switchDataService',
  '$ionicNavBarDelegate',
  function($scope, $rootScope, $log, $state, $ionicPlatform, $ionicHistory, switchDataService, $ionicNavBarDelegate) {
    'use strict';
    $scope.tabItemComplete = false;
    $rootScope.slideChangedSave = false;
    $scope.custId = $state.params.customerId;
    $rootScope.popupopn = false;
    if ($rootScope.profileGender) {
      $scope.Gender = $rootScope.profileGender;
    } else {
      $scope.Gender = localStorage.getItem('Gender');
    }
    //  $scope.Gender = $rootScope.profileGender;
    $scope.stepsCompleted = 1;

    var customerData = switchDataService.getProfileData($state.params.customerId);
    customerData.then(function(custDetails) {
      $log.debug("the value from the customerdata is as fallows++++", custDetails);
      //  $scope.Gender = custDetails.Gender;

      $scope.stepsCompleted = custDetails.StepCompleted;
      if (custDetails.LifeStage != null) {
        $scope.myActiveSlide = custDetails.LifeStage;

      } else {
        $scope.myActiveSlide = switchDataService.lifeStageData(custDetails.Age);
      }
      //  $scope.myActiveSlide = switchDataService.lifeStageData(custDetails.Age);
      $log.debug('stepsCompleted11', $scope.stepsCompleted);
      if (parseInt($scope.stepsCompleted) > 1) {
        if (parseInt($scope.stepsCompleted) == 2) {
          $scope.pageFlow1 = {
            disableOtherTabsLife: false
          };
          $scope.pageFlow2 = {
            disableOtherTabsNeeds: false
          };
          $scope.pageFlow3 = {
            disableOtherTabsProducts: true
          };
          $scope.pageFlow4 = {
            disableOtherTabsProducts: true
          };
        } else if (parseInt($scope.stepsCompleted) == 3) {
          $scope.pageFlow1 = {
            disableOtherTabsLife: false
          };
          $scope.pageFlow2 = {
            disableOtherTabsNeeds: false
          };
          $scope.pageFlow3 = {
            disableOtherTabsProducts: false
          };
          $scope.pageFlow4 = {
            disableOtherTabsProducts: true
          };
        }
      } else {
        $scope.pageFlow1 = {
          disableOtherTabsLife: false
        };
        $scope.pageFlow2 = {
          disableOtherTabsNeeds: true
        };
        $scope.pageFlow3 = {
          disableOtherTabsProducts: true
        };
        $scope.pageFlow4 = {
          disableOtherTabsProducts: true
        };
      }
    });

    $scope.imagesMale = [{
      'id': 0,
      'src': 'img/1.png',
      'title': 'YOUNG AND SINGLE'
    }, {
      'id': 1,
      'src': 'img/2.png',
      'title': 'YOUNG AND MARRIED'
    }, {
      'id': 2,
      'src': 'img/3.png',
      'title': 'MARRIED WITH YOUNG KIDS'
    }, {
      'id': 3,
      'src': 'img/4.png',
      'title': 'MARRIED WITH OLDER KIDS'
    }, {
      'id': 4,
      'src': 'img/5.png',
      'title': 'NEARING RETIREMENT'
    }];
    $scope.imagesFemale = [{
      'id': 0,
      'src': 'img/6.png',
      'title': 'YOUNG AND SINGLE'
    }, {
      'id': 1,
      'src': 'img/7.png',
      'title': 'YOUNG AND MARRIED'
    }, {
      'id': 2,
      'src': 'img/8.png',
      'title': 'MARRIED WITH YOUNG KIDS'
    }, {
      'id': 3,
      'src': 'img/9.png',
      'title': 'MARRIED WITH OLDER KIDS'
    }, {
      'id': 4,
      'src': 'img/10.png',
      'title': 'NEARING RETIREMENT'
    }];

    $scope.slideHasChanged = function(index) {
      $scope.slideIndex = index;
      $rootScope.slideChangedSave = true;
    };
    $scope.onClickNo = function() {
      $rootScope.popupopn = false;
      $state.go('app.needPrioritisation', {
        customerId: $state.params.customerId,
      });
    };

    $scope.lifeStageMale = function(isfromyes) {
      $rootScope.slideChangedSave = false;
      $log.debug("on chnage saving imnage", $rootScope.slideChangedSave);
      switchDataService.updateLifeStageData($scope.slideIndex, $scope.custId, $scope.stepsCompleted);
      switch ($scope.slideIndex) {
        case 0:
        case 1:
          $scope.items = [{
            id: 2,
            name: 'Wealth Creation',
            class: ' bl',
            src: 'img/icon-wealth-creation.png'
          }, {
            id: 4,
            name: 'Protection',
            class: ' gn',
            src: 'img/icon-protection.png'
          }, {
            id: 1,
            name: 'Retirement Planning',
            class: ' yw',
            src: 'img/icon-retirement-planning.png'
          }, {
            id: 3,
            name: 'Child’s Future',
            class: ' gp',
            src: 'img/icon-child-planner.png'
          }];
          break;
        case 2:
          $scope.items = [{
            id: 3,
            name: 'Child’s Future',
            class: ' gp',
            src: 'img/icon-child-planner.png'
          }, {
            id: 4,
            name: 'Protection',
            class: ' gn',
            src: 'img/icon-protection.png'
          }, {
            id: 2,
            name: 'Wealth Creation',
            class: ' bl',
            src: 'img/icon-wealth-creation.png'
          }, {
            id: 1,
            name: 'Retirement Planning',
            class: ' yw',
            src: 'img/icon-retirement-planning.png'
          }];
          break;
        case 3:
          $scope.items = [{
            id: 3,
            name: 'Child’s Future',
            class: ' gp',
            src: 'img/icon-child-planner.png'
          }, {
            id: 1,
            name: 'Retirement Planning',
            class: ' yw',
            src: 'img/icon-retirement-planning.png'
          }, {
            id: 4,
            name: 'Protection',
            class: ' gn',
            src: 'img/icon-protection.png'
          }, {
            id: 2,
            name: 'Wealth Creation',
            class: ' bl',
            src: 'img/icon-wealth-creation.png'
          }];
          break;
        case 4:
          $scope.items = [{
            id: 1,
            name: 'Retirement Planning',
            class: ' yw',
            src: 'img/icon-retirement-planning.png'
          }, {
            id: 2,
            name: 'Wealth Creation',
            class: ' bl',
            src: 'img/icon-wealth-creation.png'
          }, {
            id: 3,
            name: 'Child’s Future',
            class: ' gp',
            src: 'img/icon-child-planner.png'
          }, {
            id: 4,
            name: 'Protection',
            class: ' gn',
            src: 'img/icon-protection.png'
          }];
          break;
      }
      $log.debug("**********************", $scope.items);
      switchDataService.updatedata($scope.items, $scope.custId);
      if (isfromyes) {
        $rootScope.popupopn = false;
      }
      $state.go('app.needPrioritisation', {
        customerId: $state.params.customerId,
      });

    };
    /**back routing ***/
    $scope.goBack = function() {
      if ($state.current.name == 'app.lifestage') {
        $state.go("app.switch");
      } else {
        $ionicHistory.goBack();
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
