otherCalculators.controller('childFuturePlanController', [
  '$rootScope',
  '$scope',
  '$log',
  '$state',
  '$compile',
  '$http',
  '$ionicHistory',
  '$ionicPlatform',
  '$ionicNavBarDelegate',
  'retChildStudy',
  '$filter',
  'switchDataService',
  function($rootScope,
    $scope,
    $log,
    $state,
    $compile,
    $http,
    $ionicHistory,
    $ionicPlatform,
    $ionicNavBarDelegate,
    retChildStudy,
    $filter,
    switchDataService) {
    'use strict';
    $scope.tabInclude = false;
    $scope.ageDiffHighLow = 25;
    $scope.fundageDiffHighLow = 25;
    $scope.cageVError = false;
    $scope.fundageVError = false;
    $scope.indiaPostGrad = true;
    $scope.indiaGrad = false;
    $scope.abroadPostGrad = false;
    $scope.abroadGrad = false;
    $scope.lacunit = 100000;
    $rootScope.InvestmentPage = false;
    $scope.formValid = true;

    if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
      $ionicNavBarDelegate.showBackButton(false);
    } else { 
      $ionicNavBarDelegate.showBackButton(false);
    }
    /*Animation Code*/
    $scope.animateClass = animateNgClass('bounceInDown', 'animationduration25');

    $scope.calculate = function() {
      $scope.childFuturePlanObj.courseCost = $scope.childFuturePlanObj.courseCost;
      retChildStudy.calChildStudyCost($scope.childFuturePlanObj);
      console.log($scope.childFuturePlanObj);
      $state.go('app.childFuturePlanner');
    };
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
      $log.debug("wilth:> ", $state.current.name);
      if ($state.current.name == 'app.switchChildplan') {
        $state.go("app.needPrioritisation", {
          customerId: $rootScope.calCustId
        });
      } else if ($state.current.name == 'app.childFuturePlanner') {
        $log.debug($rootScope.saveResult);
        if ($rootScope.saveResult == true) {
          $state.go("app.switchChildplan", {
            customerId: $rootScope.calCustId
          });
        } else {
           $state.go('app.childplan');
        }
      } else if ($state.current.name == 'app.childFuturePlannerDetailsView') {
        $log.debug($rootScope.saveResult);
        if ($rootScope.saveResult == true) {
          $state.go("app.childFuturePlanner", {
            customerId: $rootScope.calCustId
          });
        } else {
          $state.go('app.childFuturePlanner');
        }
      } else if ($rootScope.saveResult == 'app.childplan') {
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

    $scope.gradButtoncheck = false;
    $scope.postGradButtoncheck = true;
    $scope.abroadButtoncheck = false;
    $scope.indiaButtoncheck = true;
    $scope.activecourse = [];
    $scope.gradindiaactive = [];
    $scope.childFuturePlanObj = {
                                  cagemin: 0,
                                  cagemax: 25,
                                  fundagemin: 5,
                                  fundagemax: 30,
                                  cagevalue: 5,
                                  fundagevalue: 20,
                                  inflationmin: 0,
                                  inflationmax: 50,
                                  inflationvalue: 10,
                                  rateofReturnmin: 0,
                                  rateofReturnmax: 100,
                                  rateofReturnvalue: 8,
                                  courseCost: 1500000,
                                  coursePlace: "India",
                                  courseTitle: "MBA",
                                  eduMilestone: "PostGrad",
                                  futureCostofEducation: 0,
                                  monthlyInvestMentRequired: 0,
                                  yearsToAchieveGoal: 0,
                                  courseId: "inmba"
    };
    $rootScope.saveResult = false;

    if ($state.params.fromSwitch) {
      $rootScope.saveResult = true;
      $rootScope.calCustId = $state.params.fromSwitch;
      var chilePlanProfileData = switchDataService.getProfileData($state.params.fromSwitch);
      chilePlanProfileData.then(function(profileDetails) {
        $log.debug("the customerprofile details is as fallows", profileDetails.Age);
        if (profileDetails.Age <= 25) {
          $scope.childFuturePlanObj.cagevalue = profileDetails.Age;
        }
      });
    }

    $scope.getStudyCost = function(place, milestone, title) {
      $http.get('js/calculators/childPlan/controllers/specialization.json').then(function(response) {
        var CourseObjectsList = response.data;
        var retChildStudyobj = $filter('getByCourseandPlace')(CourseObjectsList, title, place, milestone);
        $scope.childFuturePlanObj.courseCost = retChildStudyobj.courseCost;
        $scope.childFuturePlanObj.courseTitle = title;
        //$scope.childFuturePlanObj = retChildStudyobj;
      });
    };

    $scope.setactive = function(item) {
      for (var i = 0; i < $scope.activecourse.length; i++) {
        if ($scope.activecourse[i].id == item) {
          $scope.activecourse[i].active = true;
          $scope.childFuturePlanObj.coursePlace = $scope.activecourse[i].coursePlace;
        } else {
          $scope.activecourse[i].active = false;
        }
      }
      $scope.childFuturePlanObj.courseId = item;
    };

    $http.get('js/calculators/childPlan/controllers/specialization.json').then(function(response) {
      $scope.indiaPostGradlist = $filter('getByCoursePlaceandMile')(response.data, "India", "PostGrad");
      $scope.indiaGradlist = $filter('getByCoursePlaceandMile')(response.data, "India", "Grad");
      $scope.abroadPostGradlist = $filter('getByCoursePlaceandMile')(response.data, "Abroad", "PostGrad");
      $scope.abroadGradlist = $filter('getByCoursePlaceandMile')(response.data, "Abroad", "Grad");
      $scope.activecourse = response.data;
      if ($rootScope.reloadCalculatorDefault != null) {
        if ($rootScope.reloadCalculatorDefault == "No") {
          $scope.setactive($scope.childFuturePlanObj.courseId);
        }
      }
    });

    if ($rootScope.reloadCalculatorDefault != null) {
      if ($rootScope.reloadCalculatorDefault == "No") {
        var childFutureObj = retChildStudy.retCorpusObjfunc();
        if (childFutureObj != null) {
          $scope.childFuturePlanObj = childFutureObj;
          $scope.setactive($scope.childFuturePlanObj.courseId);
          if (childFutureObj.coursePlace == "India" && childFutureObj.eduMilestone == "Grad") {
            $scope.indiaButtoncheck = true;
            $scope.abroadButtoncheck = false;
            $scope.postGradButtoncheck = false;
            $scope.gradButtoncheck = true;
            $scope.indiaPostGrad = false;
            $scope.indiaGrad = true;
            $scope.abroadPostGrad = false;
            $scope.abroadGrad = false;
          }
          if (childFutureObj.coursePlace == "India" && childFutureObj.eduMilestone == "PostGrad") {
            $scope.indiaButtoncheck = true;
            $scope.abroadButtoncheck = false;
            $scope.postGradButtoncheck = true;
            $scope.gradButtoncheck = false;
            $scope.indiaPostGrad = true;
            $scope.indiaGrad = false;
            $scope.abroadPostGrad = false;
            $scope.abroadGrad = false;
          }
          if (childFutureObj.coursePlace == "Abroad" && childFutureObj.eduMilestone == "Grad") {
            $scope.indiaButtoncheck = false;
            $scope.abroadButtoncheck = true;
            $scope.postGradButtoncheck = false;
            $scope.gradButtoncheck = true;
            $scope.indiaPostGrad = false;
            $scope.indiaGrad = false;
            $scope.abroadPostGrad = false;
            $scope.abroadGrad = true;
          }
          if (childFutureObj.coursePlace == "Abroad" && childFutureObj.eduMilestone == "PostGrad") {
            $scope.indiaButtoncheck = false;
            $scope.abroadButtoncheck = true;
            $scope.postGradButtoncheck = true;
            $scope.gradButtoncheck = false;
            $scope.indiaPostGrad = false;
            $scope.indiaGrad = false;
            $scope.abroadPostGrad = true;
            $scope.abroadGrad = false;
          }
        }
      }
    }

  /*  $scope.numDifferentiation = function(val) {
      if (val >= 10000000) val = (val / 10000000).toFixed(2) + ' Cr';
      else if (val >= 100000) val = (val / 100000).toFixed(1);
      else if (val >= 1000) val = (val / 100000).toFixed(2);
      return val;
    };
*/
    $scope.Active = function(eventButton) {
      if (eventButton == 'gradButton') {

        $scope.childFuturePlanObj.fundagevalue = 17;
        $scope.gradButtoncheck = true;
        $scope.postGradButtoncheck = false;
        if ($scope.indiaButtoncheck == true) {
          $scope.getStudyCost("India", "Grad", "B.com");
          $scope.setactive("inbcom");
          $scope.indiaPostGrad = false;
          $scope.indiaGrad = true;
          $scope.abroadPostGrad = false;
          $scope.abroadGrad = false;
        }
        if ($scope.abroadButtoncheck == true) {
          $scope.setactive("abrbcom");
          $scope.getStudyCost("Abroad", "Grad", "B.com");
          $scope.indiaPostGrad = false;
          $scope.indiaGrad = false;
          $scope.abroadPostGrad = false;
          $scope.abroadGrad = true;
        }

        $scope.childFuturePlanObj.eduMilestone = "Grad";
      }
      if (eventButton == 'postGradButton') {
        $scope.childFuturePlanObj.fundagevalue = 20;
        $scope.gradButtoncheck = false;
        $scope.postGradButtoncheck = true;
        if ($scope.indiaButtoncheck == true) {
          $scope.setactive("inmba");
          $scope.getStudyCost("India", "PostGrad", "MBA");
          $scope.indiaPostGrad = true;
          $scope.indiaGrad = false;
          $scope.abroadPostGrad = false;
          $scope.abroadGrad = false;
        }
        if ($scope.abroadButtoncheck == true) {
          $scope.setactive("abrmba");
          $scope.getStudyCost("Abroad", "PostGrad", "MBA");
          $scope.indiaPostGrad = false;
          $scope.indiaGrad = false;
          $scope.abroadPostGrad = true;
          $scope.abroadGrad = false;
        }
          $scope.childFuturePlanObj.eduMilestone = "PostGrad";
      }
      if (eventButton == 'indiaButton') {
        $scope.indiaButtoncheck = true;
        $scope.abroadButtoncheck = false;
        if ($scope.postGradButtoncheck == true) {
          $scope.setactive("inmba");
          $scope.getStudyCost("India", "PostGrad", "MBA");
          $scope.indiaPostGrad = true;
          $scope.indiaGrad = false;
          $scope.abroadPostGrad = false;
          $scope.abroadGrad = false;
        }
        if ($scope.gradButtoncheck == true) {
          $scope.setactive("inbcom");
          $scope.getStudyCost("India", "Grad", "B.com");
          $scope.indiaPostGrad = false;
          $scope.indiaGrad = true;
          $scope.abroadPostGrad = false;
          $scope.abroadGrad = false;
        }
      }

      if (eventButton == 'abroadButton') {
        $scope.indiaButtoncheck = false;
        $scope.abroadButtoncheck = true;
        if ($scope.postGradButtoncheck == true) {
          $scope.setactive("abrmba");
          $scope.getStudyCost("Abroad", "PostGrad", "MBA");
          $scope.indiaPostGrad = false;
          $scope.indiaGrad = false;
          $scope.abroadPostGrad = true;
          $scope.abroadGrad = false;
        }
        if ($scope.gradButtoncheck == true) {
          $scope.setactive("abrbcom");
          $scope.getStudyCost("Abroad", "Grad", "B.com");
          $scope.indiaPostGrad = false;
          $scope.indiaGrad = false;
          $scope.abroadPostGrad = false;
          $scope.abroadGrad = true;
        }
      }
    };

    $scope.isEmpty = function(str) {
      return (!str || 0 === str.length);
    };

    $scope.$watch('childFuturePlanObj.cagevalue', function() {
      var value = "" + $scope.childFuturePlanObj.cagevalue;
      if (value.indexOf('.') !== -1) {
        $scope.childFuturePlanObj.cagevalue = parseInt(value);
      }
      if (!$scope.isEmpty($scope.childFuturePlanObj.cagevalue)) {
        $scope.formValid = true;
      } else {
        $scope.formValid = false;
      }
      if ($scope.childFuturePlanObj.cagevalue > $scope.childFuturePlanObj.fundagevalue) {
        $scope.cageVError = true;
        $scope.cageVError = true;
      } else {
        $scope.cageVError = false;
      }
    }, true);

    $scope.$watch('childFuturePlanObj.fundagevalue', function() {
      var value = "" + $scope.childFuturePlanObj.fundagevalue;
      if (value.indexOf('.') !== -1) {
        $scope.childFuturePlanObj.fundagevalue = parseInt(value);
      }
      if (!$scope.isEmpty($scope.childFuturePlanObj.fundagevalue)) {
        $scope.formValid = true;
      } else {
        $scope.formValid = false;
      }
    }, true);

    $scope.$watch('childFuturePlanObj.inflationvalue', function() {
      var value = "" + $scope.childFuturePlanObj.inflationvalue;
      if (value.indexOf('.') !== -1) {
        $scope.childFuturePlanObj.inflationvalue = parseInt(value);
      }
      if (!$scope.isEmpty($scope.childFuturePlanObj.inflationvalue)) {
        $scope.formValid = true;
      } else {
        $scope.formValid = false;
      }
    }, true);

    $scope.$watch('childFuturePlanObj.rateofReturnvalue', function() {
      var value = "" + $scope.childFuturePlanObj.rateofReturnvalue;
      if (value.indexOf('.') !== -1) {
        $scope.childFuturePlanObj.rateofReturnvalue = parseInt(value);
      }
      if (!$scope.isEmpty($scope.childFuturePlanObj.rateofReturnvalue)) {
        $scope.formValid = true;
      } else {
        $scope.formValid = false;
      }
    }, true);

    $scope.$watch('childFuturePlanObj.courseCost', function() {
      if (!$scope.isEmpty($scope.childFuturePlanObj.courseCost)) {
        $scope.formValid = true;
      } else {
        $scope.formValid = false;
      }
    }, true);
  }
]);
