switchModule.controller('switchCusrtomerProfileController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$ionicPlatform',
  '$ionicHistory',
  '$ionicNavBarDelegate',
  '$cordovaKeyboard',
  'selectedSwitchDetailsService',
  'switchDataService',
  'lifeStageAgeRanges',
  'lifeStageConstants',
  function($scope, $rootScope, $log, $state,
    $ionicPlatform, $ionicHistory, $ionicNavBarDelegate, $cordovaKeyboard,
    selectedSwitchDetailsService, switchDataService, lifeStageAgeRanges, lifeStageConstants) {
    'use strict';
    $scope.submit = function(data) {
      var selectedCustomerAge = data.age;
      var activeLifeStage;
      if (selectedCustomerAge < lifeStageAgeRanges.ageRange27) {
        activeLifeStage = lifeStageConstants.lifeStageYoungandSingle;
      } else if (selectedCustomerAge >= lifeStageAgeRanges.ageRange27 &&
        selectedCustomerAge < lifeStageAgeRanges.ageRange30) {
        activeLifeStage = lifeStageConstants.lifeStageYoungandMarried;
      } else if (selectedCustomerAge >= lifeStageAgeRanges.ageRange30 &&
        selectedCustomerAge < lifeStageAgeRanges.ageRange45) {
        activeLifeStage = lifeStageConstants.lifeStageMarriedWithYoungerKid;
      } else if (selectedCustomerAge >= lifeStageAgeRanges.ageRange45 &&
        selectedCustomerAge < lifeStageAgeRanges.ageRange55) {
        activeLifeStage = lifeStageConstants.lifeStageMarriedWithOlderKid;
      } else if (selectedCustomerAge >= lifeStageAgeRanges.ageRange55) {
        activeLifeStage = lifeStageConstants.lifeStageNearingRetirement;
      }
      switch (activeLifeStage) {
        case lifeStageConstants.lifeStageYoungandSingle:
        case lifeStageConstants.lifeStageYoungandMarried:
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
        case lifeStageConstants.lifeStageMarriedWithYoungerKid:
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
        case lifeStageConstants.lifeStageMarriedWithOlderKid:
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
        case lifeStageConstants.lifeStageNearingRetirement:
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
        default:
          $scope.items = [{
            id: 3,
            name: 'Child’s Future',
            class: ' gp',
            src: 'img/icon-child-planner.png'
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
          }, {
            id: 4,
            name: 'Protection',
            class: ' gn',
            src: 'img/icon-protection.png'
          }];
      }

      switchDataService.setProfileData(data);
      $rootScope.profileMyActiveSlide = data.Age;
      $rootScope.profileGender = data.Gender;
      var custId = switchDataService.insertData(data);
      custId.then(function(customerData) {

        switchDataService.updatedata($scope.items, customerData);
        $state.go('app.lifestage', {
          customerId: customerData
        });
      });
    };

    /**back routing ***/
    $scope.goBack = function() {
      $state.go('app.switch');
    };
    if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
      $ionicNavBarDelegate.showBackButton(false);
    } else {
      $ionicNavBarDelegate.showBackButton(true);
    }
    $ionicPlatform.registerBackButtonAction(function() {
      $scope.goBack();
    }, 100);
    /*Navigation functions for Android Keyboard*/
      function eventNextFocus(name, next) {
        name.addEventListener('keypress', function(e) {
          var keypressEvent = e || window.event;
          var keypressValue = keypressEvent.keyCode || keypressEvent.which;
          if (keypressValue == 13 || keypressValue == 9) {
            next.focus();
          }
          return true;
        });
      };

      function eventSubmit(name, $state) {
        name.addEventListener('keypress', function(e) {
          var keypressEvent = e || window.event;
          var keypressValue = keypressEvent.keyCode || keypressEvent.which;
          if (keypressValue == 9 || keypressValue == 13) {
            alert('End');
          }
          return true;
        });
      };

      function eventLoseFocus(name, $cordovaKeyboard) {
        name.addEventListener('keypress', function(e) {
          var keypressEvent = e || window.event;
          var keypressValue = keypressEvent.keyCode || keypressEvent.which;
          if (keypressValue == 9 || keypressValue == 13) {
            name.blur();
            $cordovaKeyboard.close();
          }
          return true;
        });
      };

      function initNavigation(){
  var fristName = document.getElementsByName('fristName')[0];
  var lastName = document.getElementsByName('lastName')[0];
  var age = document.getElementsByName('age')[0];
  var mobile = document.getElementsByName('mobile')[0];
  var email = document.getElementsByName('email')[0];
  eventNextFocus(fristName, lastName);
  eventNextFocus(lastName, age);
  eventNextFocus(age, mobile);
  eventNextFocus(mobile, email);
  eventLoseFocus(email, $cordovaKeyboard);
      };
initNavigation();
  }
]);
