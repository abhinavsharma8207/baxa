switchModule.controller('needPrioritisationController', ['$scope',
  '$rootScope',
  '$log',
  '$state',
  '$ionicPlatform',
  '$ionicHistory',
  '$ionicNavBarDelegate',
  'switchDataService',
  function($scope, $rootScope, $log, $state,
    $ionicPlatform, $ionicHistory, $ionicNavBarDelegate,
    switchDataService) {
    'use strict';
    $scope.stepsCompleted = 1;
    $scope.myActiveSlide = "";
    $scope.custId = $state.params.customerId;

    $log.debug("customerId", $state.params.customerId);
    $log.debug("tabThreeFlg", $state.params.tabThreeFlg);
    $scope.tabThreeFlg = true;
    var caseStr;
    var lifestageData = switchDataService.getProfileData($state.params.customerId);
    if ($state.params.tabThreeFlg !== undefined) {
      $scope.tabThreeFlg = $state.params.tabThreeFlg;
    }
    lifestageData.then(function(profileDetails) {
      //$log.debug("the profile data is as fallws___ +++", profileDetails);
      $scope.stepsCompleted = profileDetails.StepCompleted;
      caseStr = switchDataService.lifeStageData(profileDetails.Age);
      //  $log.debug("the caseStr is +++", caseStr);
      $scope.currentCustId = profileDetails.Cust_ID;
      $scope.profiledetils = profileDetails.LifeStagePriority;
      $scope.profiledetilslist = profileDetails.LifeStagePriority;
      if (parseInt($scope.stepsCompleted) > 2) {
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
      } else {
        $log.debug("inside else");
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
      }
      if ($scope.profiledetils == null || $scope.profiledetils == "undefined") {
        /****Define life stage array **/
        var lifeStageArray=[{
          id: 1,
          name: 'Retirement Planning',
          class: ' yw',
          src: 'img/icon-retirement-planning.png'
        },{
          id: 2,
          name: 'Wealth Creation',
          class: ' bl',
          src: 'img/icon-wealth-creation.png'
        },{
          id: 3,
          name: 'Child’s Future',
          class: ' gp',
          src: 'img/icon-child-planner.png'
        },{
          id: 4,
          name: 'Protection',
          class: ' gn',
          src: 'img/icon-protection.png'
        }];
/***Final sorted array***/
     var sequence=[];
       /***Default Needs Prioritisation sequence defined**/
        switch (caseStr) {
          case 0:
          case 1:
          sequence=[2,4,1,3];
            break;
          case 2:
               sequence=[3,4,2,1];
              break;
          case 3:
               sequence=[3,1,4,2];
               break;
          case 4:
              sequence=[3,1,4,2];
              break;
          default:
              sequence=[3,2,1,4];
        }
        $scope.items=[];
        /****push values into $scope.items array as per defined sequence ***/
        for(var i=0;i<sequence.length;i++){
          $scope.items.push(lifeStageArray.splice(sequence[1]-1,1));
        }
        /*delete sequence array from memory*/
        sequence=null;
      } else {
        var priority = JSON.parse($scope.profiledetilslist);
        var priorityItem = [];
        angular.forEach(priority, function(items) {
          var calcCount = switchDataService.getCalcTotal(items.id, $state.params.customerId);
          calcCount.then(function(val) {
            items.count = val; //'4';
          });
          priorityItem.push(items);
        }, priorityItem);
        $scope.items = priorityItem;
      }
    });

    $scope.calculaterPageRedriect = function(id, pageType) {
      $log.debug("the value coming from the calculaterPageRedriect", id);
      switchDataService.updatedata($scope.items, id);
      switch (pageType) {
        case 1:
          $state.go('app.switchRetirement', {
            fromSwitch: id,
          });
          break;
        case 2:
          $state.go('app.switchWealth', {
            fromSwitch: id,
          });
          break;
        case 3:
          $state.go('app.switchChildplan', {
            fromSwitch: id,
          });
          break;
        case 4:
          $state.go('', {
            fromSwitch: id,
          });
          break;
      }
    };
    $scope.moveItem = function(item, fromIndex, toIndex) {
      $scope.items.splice(fromIndex, 1);
      $scope.items.splice(toIndex, 0, item);
    };
    $scope.productRecPage = function(id) {
      $log.debug('$scope.items', $scope.items);
      switchDataService.updatedata($scope.items, id);
      switchDataService.updatedataLifeStage(id, $scope.stepsCompleted);
      $state.go('app.productRecommendation', {
        customerId: $state.params.customerId,
      });
    };

    /**back routing ***/
    $scope.goBack = function() {
      if ($state.current.name == "app.needPrioritisation") {
        $state.go("app.lifestage", {
          customerId: $state.params.customerId,
        });
      } else if ($state.current.name == 'app.lifestage') {
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
