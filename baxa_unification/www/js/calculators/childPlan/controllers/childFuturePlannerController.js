otherCalculators.controller('childFuturePlannerController', [
  '$rootScope',
  '$scope',
  '$log',
  '$state',
  '$cordovaFile',
  '$ionicModal',
  '$ionicPopup',
  '$ionicHistory',
  '$ionicPlatform',
  '$ionicNavBarDelegate',
  'retChildStudy',
  '$filter',
  '$http',
  'commonFileFunctionFactory',
  'utilityService',
  function($rootScope,
    $scope,
    $log,
    $state,
    $cordovaFile,
    $ionicModal,
    $ionicPopup,
    $ionicHistory,
    $ionicPlatform,
    $ionicNavBarDelegate,
    retChildStudy,
    $filter,
    $http,
    commonFileFunctionFactory,
    utilityService) {
    'use strict';
    $scope.formInvalid = false;
    $scope.ageDiffHighLow = 25;
    $scope.fundageDiffHighLow = 25;
    $scope.cageVError = false;
    $scope.fundageVError = false;

    $scope.activecourse = [];
    $rootScope.reloadCalculatorDefault = 'No';
    $scope.childstudyobj = retChildStudy.retCorpusObjfunc();
    console.log($scope.childstudyobj);
    $scope.childFuturePlanObj = retChildStudy.retCorpusObjfunc();
    if (!$rootScope.InvestmentPage) {
      $scope.childFuturePlanObj.courseCost = $scope.childFuturePlanObj.courseCost;
    }

    if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
      $ionicNavBarDelegate.showBackButton(false);
    } else { 
      $ionicNavBarDelegate.showBackButton(false);
    }
    /*Animation Code*/
    $scope.setNowAnimate = function() {
      setAnimate($ionicHistory);
    }

    $scope.setactive = function(item) {
      for (var i = 0; i < $scope.activecourse.length; i++) {
        if ($scope.activecourse[i].id == item) {
          $scope.activecourse[i].active = true;
        } else {
          $scope.activecourse[i].active = false;
        }
      }
      $scope.childFuturePlanObj.courseId = item;
    };

    $scope.investment = function() {
      $state.go('app.childFuturePlannerDetailsView');
    }

    if ($scope.childFuturePlanObj.coursePlace == "" && $scope.childFuturePlanObj.courseId == "MBA") {
      $scope.gradButtoncheck = false;
      $scope.postGradButtoncheck = true;
      $scope.indiaButtoncheck = true;
      $scope.abroadButtoncheck = false;
      $scope.indiaPostGrad = true;
    }

    if ($scope.childFuturePlanObj.coursePlace == "India" && $scope.childFuturePlanObj.eduMilestone == "PostGrad") {
      $scope.gradButtoncheck = false;
      $scope.postGradButtoncheck = true;
      $scope.indiaButtoncheck = true;
      $scope.abroadButtoncheck = false;
      $scope.indiaPostGrad = true;
    }

    if ($scope.childFuturePlanObj.coursePlace == "Abroad" && $scope.childFuturePlanObj.eduMilestone == "PostGrad") {
      $scope.gradButtoncheck = false;
      $scope.postGradButtoncheck = true;
      $scope.indiaButtoncheck = true;
      $scope.abroadButtoncheck = true;
      $scope.abroadPostGrad = true;
    }

    if ($scope.childFuturePlanObj.coursePlace == "India" && $scope.childFuturePlanObj.eduMilestone == "Grad") {
      $scope.gradButtoncheck = true;
      $scope.postGradButtoncheck = false;
      $scope.indiaButtoncheck = true;
      $scope.abroadButtoncheck = false;
      $scope.indiaGrad = true;
    }

    if ($scope.childFuturePlanObj.coursePlace == "Abroad" && $scope.childFuturePlanObj.eduMilestone == "Grad") {
      $scope.gradButtoncheck = true;
      $scope.postGradButtoncheck = false;
      $scope.indiaButtoncheck = false;
      $scope.abroadButtoncheck = true;
      $scope.abroadGrad = true;
    }

    $scope.proceed = function() {
      $state.go('productRecommendation');
    }

    if (screen.width > screen.height) {
      console.log($scope.childstudyobj);
      $rootScope.tabInclude = true;
      if($scope.childstudyobj.eduMilestone =="PostGrad")
      {
        $scope.gradButtoncheck = false;
        $scope.postGradButtoncheck = true;
      }
      if($scope.childstudyobj.eduMilestone =="Grad")
      {
        $scope.gradButtoncheck = true;
        $scope.postGradButtoncheck = false;
      }

    } else {
      var myEl = angular.element(document.querySelector('#inputDiv'));
      myEl.remove();
      var myEl2 = angular.element(document.querySelector('#chartDiv'));
      myEl2.removeClass("rightPanel");
      myEl2.addClass("leftPanel");
    }

    $scope.abroadButtoncheck = false;
    $scope.indiaButtoncheck = true;
    $scope.activecourse = [];
    $scope.gradindiaactive = [];
    $scope.getStudyCost = function(place, milestone, title) {
      $http.get('js/calculators/childPlan/controllers/specialization.json').then(function(response) {
        var CourseObjectsList = response.data;
        var retChildStudyobj = $filter('getByCourseandPlace')(CourseObjectsList, title, place, milestone);
        $scope.childFuturePlanObj.courseCost = retChildStudyobj.courseCost;

        $scope.childFuturePlanObj.courseTitle = retChildStudyobj.courseTitle;
        $scope.childFuturePlanObj.eduMilestone = retChildStudyobj.eduMilestone;
        $scope.childFuturePlanObj.coursePlace = retChildStudyobj.coursePlace;
      });
    };

    $http.get('js/calculators/childPlan/controllers/specialization.json').then(function(response) {
      $scope.indiaPostGradlist = $filter('getByCoursePlaceandMile')(response.data, "India", "PostGrad");
      $scope.indiaGradlist = $filter('getByCoursePlaceandMile')(response.data, "India", "Grad");
      $scope.abroadPostGradlist = $filter('getByCoursePlaceandMile')(response.data, "Abroad", "PostGrad");
      $scope.abroadGradlist = $filter('getByCoursePlaceandMile')(response.data, "Abroad", "Grad");
      $scope.activecourse = response.data;
      $scope.setactive($scope.childFuturePlanObj.courseId)
    });

    $scope.numDifferentiation = function(val) {
      if (val >= 10000000) val = (val / 10000000).toFixed(2) + ' Cr';
      else if (val >= 100000) val = (val / 100000).toFixed(1);
      else if (val >= 1000) val = (val / 100000).toFixed(2);
      return val;
    };

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

    $scope.$watch('childFuturePlanObj.cagevalue', function() {
      if ($rootScope.tabInclude) {
        var value = "" + $scope.childFuturePlanObj.cagevalue;
        if (value.indexOf('.') !== -1) {
          $scope.childFuturePlanObj.cagevalue = parseInt(value);
        }
        if ($scope.childFuturePlanObj.cagevalue > 0 && $scope.childFuturePlanObj.cagevalue <= 25 &&
          $scope.childFuturePlanObj.fundagevalue > 5 && $scope.childFuturePlanObj.fundagevalue <= 30 && $scope.childFuturePlanObj.inflationvalue > 0 &&
          $scope.childFuturePlanObj.inflationvalue < 50 && $scope.childFuturePlanObj.rateofReturnvalue > 0 &&
          $scope.childFuturePlanObj.rateofReturnvalue < 100 && $scope.childFuturePlanObj.cagevalue < $scope.childFuturePlanObj.fundagevalue) {

          retChildStudy.calChildStudyCost($scope.childFuturePlanObj);
          $scope.childstudyobj = retChildStudy.retCorpusObjfunc();
          $scope.childFuturePlanObj = retChildStudy.retCorpusObjfunc();
          $scope.childFuturePlanObj.courseCost = $scope.childFuturePlanObj.courseCost;
          $scope.formInvalid = false;
        }
        if ($scope.childFuturePlanObj.cagevalue > $scope.childFuturePlanObj.fundagevalue) {
          $scope.childFuturePlanObj.cagevalue = 0;
          $scope.cageVError = true;
          $scope.formInvalid = true;
        }
        if ($scope.childFuturePlanObj.cagevalue == undefined) {
          $scope.formInvalid = true;
        } else {
          $scope.cageVError = false;
          $scope.formInvalid = false;
        }
      }
    }, true);

    $scope.$watch('childFuturePlanObj.fundagevalue', function() {
      if ($rootScope.tabInclude) {
        var value = "" + $scope.childFuturePlanObj.fundagevalue;
        if (value.indexOf('.') !== -1) {
          $scope.childFuturePlanObj.fundagevalue = parseInt(value);
        }
        if ($scope.childFuturePlanObj.cagevalue > 0 && $scope.childFuturePlanObj.cagevalue <= 25 &&
          $scope.childFuturePlanObj.fundagevalue > 5 && $scope.childFuturePlanObj.fundagevalue <= 30 && $scope.childFuturePlanObj.inflationvalue > 0 &&
          $scope.childFuturePlanObj.inflationvalue < 50 && $scope.childFuturePlanObj.rateofReturnvalue > 0 &&
          $scope.childFuturePlanObj.rateofReturnvalue < 100) {

          retChildStudy.calChildStudyCost($scope.childFuturePlanObj);
          $scope.childstudyobj = retChildStudy.retCorpusObjfunc();
          $scope.childFuturePlanObj = retChildStudy.retCorpusObjfunc();
          $scope.childFuturePlanObj.courseCost = $scope.childFuturePlanObj.courseCost;
        }
        if ($scope.childFuturePlanObj.fundagevalue == undefined) {
          $scope.formInvalid = true;
        }
        if ($scope.childFuturePlanObj.cagevalue > $scope.childFuturePlanObj.fundagevalue) {
          $scope.childFuturePlanObj.cagevalue = 0;
          $scope.cageVError = true;
          $scope.formInvalid = true;
        } else {
          $scope.cageVError = false;
          $scope.formInvalid = false;
        }
      }
    }, true);

    $scope.$watch('childFuturePlanObj.inflationvalue', function() {
      if ($rootScope.tabInclude) {
        var value = "" + $scope.childFuturePlanObj.inflationvalue;
        if (value.indexOf('.') !== -1) {
          $scope.childFuturePlanObj.inflationvalue = parseInt(value);
        }
        if ($scope.childFuturePlanObj.cagevalue > 0 && $scope.childFuturePlanObj.cagevalue <= 25 &&
          $scope.childFuturePlanObj.fundagevalue > 5 && $scope.childFuturePlanObj.fundagevalue <= 30 && $scope.childFuturePlanObj.inflationvalue > 0 &&
          $scope.childFuturePlanObj.inflationvalue < 50 && $scope.childFuturePlanObj.rateofReturnvalue > 0 &&
          $scope.childFuturePlanObj.rateofReturnvalue < 100) {

          retChildStudy.calChildStudyCost($scope.childFuturePlanObj);
          $scope.childstudyobj = retChildStudy.retCorpusObjfunc();
          $scope.childFuturePlanObj = retChildStudy.retCorpusObjfunc();
          $scope.childFuturePlanObj.courseCost = $scope.childFuturePlanObj.courseCost;
          $scope.formInvalid = false;
        } else {
          $scope.formInvalid = true;
        }
        if ($scope.childFuturePlanObj.inflationvalue == undefined) {
          $scope.formInvalid = true;
        }
      }
    }, true);

    $scope.$watch('childFuturePlanObj.rateofReturnvalue', function() {
      if ($rootScope.tabInclude) {
        var value = "" + $scope.childFuturePlanObj.rateofReturnvalue;
        if (value.indexOf('.') !== -1) {
          $scope.childFuturePlanObj.rateofReturnvalue = parseInt(value);
        }
        if ($scope.childFuturePlanObj.cagevalue > 0 && $scope.childFuturePlanObj.cagevalue <= 25 &&
          $scope.childFuturePlanObj.fundagevalue > 5 && $scope.childFuturePlanObj.fundagevalue <= 30 && $scope.childFuturePlanObj.inflationvalue > 0 &&
          $scope.childFuturePlanObj.inflationvalue < 50 && $scope.childFuturePlanObj.rateofReturnvalue > 0 &&
          $scope.childFuturePlanObj.rateofReturnvalue < 100) {

          retChildStudy.calChildStudyCost($scope.childFuturePlanObj);
          $scope.childstudyobj = retChildStudy.retCorpusObjfunc();
          $scope.childFuturePlanObj = retChildStudy.retCorpusObjfunc();
          $scope.childFuturePlanObj.courseCost = $scope.childFuturePlanObj.courseCost;
          $scope.formInvalid = false;
        } else {
          $scope.formInvalid = true;
        }
        if ($scope.childFuturePlanObj.rateofReturnvalue == undefined) {
          $scope.formInvalid = true;
        }
      }
    }, true);

    $scope.$watch('childFuturePlanObj.rateofReturnvalue', function() {
      if ($rootScope.tabInclude) {
        var value = "" + $scope.childFuturePlanObj.rateofReturnvalue;
        if (value.indexOf('.') !== -1) {
          $scope.childFuturePlanObj.rateofReturnvalue = parseInt(value);
        }
        if ($scope.childFuturePlanObj.cagevalue > 0 && $scope.childFuturePlanObj.cagevalue <= 25 &&
          $scope.childFuturePlanObj.fundagevalue > 5 && $scope.childFuturePlanObj.fundagevalue <= 30 && $scope.childFuturePlanObj.inflationvalue > 0 &&
          $scope.childFuturePlanObj.inflationvalue < 50 && $scope.childFuturePlanObj.rateofReturnvalue > 0 &&
          $scope.childFuturePlanObj.rateofReturnvalue < 100) {

          retChildStudy.calChildStudyCost($scope.childFuturePlanObj);
          $scope.childstudyobj = retChildStudy.retCorpusObjfunc();
          $scope.childFuturePlanObj = retChildStudy.retCorpusObjfunc();
          $scope.childFuturePlanObj.courseCost = $scope.childFuturePlanObj.courseCost;
          $scope.formInvalid = false;
        } else {
          $scope.formInvalid = true;
        }
      }
    }, true);

    $scope.$watch('childFuturePlanObj.courseCost', function() {

      if ($rootScope.tabInclude) {
        var value = "" + $scope.childFuturePlanObj.courseCost;
        if ($scope.childFuturePlanObj.cagevalue > 0 && $scope.childFuturePlanObj.cagevalue <= 25 &&
          $scope.childFuturePlanObj.fundagevalue > 5 && $scope.childFuturePlanObj.fundagevalue <= 30 && $scope.childFuturePlanObj.inflationvalue > 0 &&
          $scope.childFuturePlanObj.inflationvalue < 50 && $scope.childFuturePlanObj.rateofReturnvalue > 0 &&
          $scope.childFuturePlanObj.rateofReturnvalue < 100) {

          retChildStudy.calChildStudyCost($scope.childFuturePlanObj);
          $scope.childstudyobj = retChildStudy.retCorpusObjfunc();
          $scope.childFuturePlanObj = retChildStudy.retCorpusObjfunc();
          $scope.childFuturePlanObj.courseCost = $scope.childFuturePlanObj.courseCost;
          $scope.formInvalid = false;
        } else {
          $scope.formInvalid = true;
        }
        if ($scope.childFuturePlanObj.courseCost == undefined) {
          $scope.formInvalid = true;
        }
      }
    }, true);


    $scope.showCalculatorPopup = function(PKSwitchCalculator) {
      $scope.showPlusPopup = !$scope.showPlusPopup;
    };

    $scope.cameraFun = function() {
      var imagePath = "MyDocuments/Switch/" + $rootScope.calCustId + "/Images";
      $cordovaFile.getFreeDiskSpace().then(function(success) {
        var exists = commonFileFunctionFactory.checkDir(cordova.file.externalApplicationStorageDirectory, imagePath);
        if (!exists) {
          commonFileFunctionFactory.createDir(cordova.file.externalApplicationStorageDirectory, imagePath,
            function(sucess) {
              commonFileFunctionFactory.savePicture(cordova.file.externalApplicationStorageDirectory + imagePath,
                function(succ) {
                  $log.debug("image saved successfuly");
                },
                function(err) {
                  $log.debug("image not saved");
                }
              );
            },
            function(error) {
              $log.debug("error");
            }
          );
        }
      }, function(error) {
        $scope.showAlert = function() {
          var alertPopup = $ionicPopup.alert({
            title: 'Device Memory Full!',
            template: 'Ooops! Your device memory is full, please remove some data or else your notes will not be saved.'
          });
          alertPopup.then(function(res) {
            $log.debug('Device Memory : Confirmed!');
          });
        };
      });
    };

    $scope.addNotes = function() {
      $ionicModal.fromTemplateUrl("js/common/templates/add-note.html", {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.createNote = function(note) {
      var notePath = "MyDocuments/Switch/" + $rootScope.calCustId + "/Notes";
      var fileName = "" + new Date().getTime() + ".json";
      $cordovaFile.getFreeDiskSpace().then(function(success) {
        var exists = commonFileFunctionFactory.checkDir(cordova.file.externalApplicationStorageDirectory, notePath);
        if (!exists) {
          commonFileFunctionFactory.createDir(cordova.file.externalApplicationStorageDirectory, notePath,
            function(sucess) {
              $log.debug("created dir successfuly");
              commonFileFunctionFactory.createNote(note, cordova.file.externalApplicationStorageDirectory + notePath, fileName,
                function(succ) {
                  $log.debug("notes saved successfuly");
                  $scope.modal.hide();
                },
                function(err) {
                  $log.debug("notes not saved");
                }
              );
            },
            function(error) {
              $log.debug("error");
            }
          );
        }
      }, function(error) {
        $scope.showAlert = function() {
          var alertPopup = $ionicPopup.alert({
            title: 'Device Memory Full!',
            template: 'Ooops! Your device memory is full, please remove some data or else your notes will not be saved.'
          });
          alertPopup.then(function(res) {
            $log.debug('Device Memory : Confirmed!');
          });
        };
      });
    };

    $scope.email=function(){
      $scope.showPlusPopup=false;
      $scope.showSendEmailPopup=true;
    };

    $scope.hidesendEmailPopup=function(){
      $scope.showPlusPopup=true;
      $scope.showSendEmailPopup=false;
    };

  /*Funtion for send email and store email details in emailData*/

    $scope.sendEmailPopupOnOk= function()
    {
      $scope.isValidateEmailTo=false;
      $scope.isValidateEmailCc=false;
      var emailTo=$scope.email_To;
      var inputData={
        emailTo:$scope.email_To,
        emailCc:$scope.email_Cc,
        isBrochureSelected:$scope.isBrochureSelected,
        isIllustrationsSelected:$scope.isIllustrationsSelected
      };

      utilityService.getEmailData(inputData).then(function(emailData){
          $log.debug("emailData",emailData);
          trippleHealthObjectServicePi.tHSendMail(emailData).then(function(){
              $scope.hidesendEmailPopup();
              $scope.showPlusPopup=false;
          });
      },function(errorMsg){
        if(errorMsg=="emailTo"){
            $scope.isValidateEmailTo=true;
        }
        if(errorMsg=="emailCc"){
            $scope.isValidateEmailCc=true;
        }
      });
    };
  }
]);
