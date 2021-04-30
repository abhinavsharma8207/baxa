otherCalculators.controller(
  'retirementCalculatorChartController', [
    '$rootScope',
    '$scope',
    '$state',
    '$log',
    '$ionicHistory',
    '$ionicPlatform',
    '$ionicNavBarDelegate',
    '$cordovaFile',
    '$ionicModal',
    '$ionicPopup',
    'fSDataFromDBSvc',
    'retCalSvc',
    '$timeout',
    'retirement_const',
    'commonFileFunctionFactory',
    'utilityService',
    function($rootScope,
      $scope,
      $state,
      $log,
      $ionicHistory,
      $ionicPlatform,
      $ionicNavBarDelegate,
      $cordovaFile,
      $ionicModal,
      $ionicPopup,
      fSDataFromDBSvc,
      retCalSvc,
      $timeout,
      retirement_const,
      commonFileFunctionFactory,
      utilityService) {
      'use strict';
      $rootScope.reloadCalculatorDefault = 'No';
      $scope.collapsed = true;
      $scope.uncollapsed = false;
      $scope.rateOfCorpusVError = false;
      $scope.lifeExpectancyVError = false;
      $scope.differenceExpensePercentage = 0;
      $scope.validationCheckfortab = true;
      $scope.isIllustrationsSelected=true;
      $scope.isBrochureSelected=false;

      $scope.lifeExpectancy = {
        min: 70,
        max: 100,
        value: 80
      };
      $scope.corpusReturn = {
        min: 0,
        max: 50,
        value: 7
      };

      if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
        $ionicNavBarDelegate.showBackButton(false);
      } else { 
        $ionicNavBarDelegate.showBackButton(false);
      }

      /*Animation Code*/
      $scope.setNowAnimate = function() {
        setAnimate($ionicHistory);
      }


      if (screen.width > screen.height) {
        $rootScope.tabInclude = true;
      } else {
        var myEl = angular.element(document.querySelector('#inputDiv'));
        myEl.remove();
        var myEl2 = angular.element(document.querySelector('#chartDiv'));
        myEl2.removeClass("rightPanel");
        myEl2.addClass("leftPanel");
      }

      $scope.collapsed = true;
      $scope.uncollapsed = false;
      $scope.ageVError = false;
      $scope.retageVError = false;
      $scope.monthExpVError = false;
      $scope.inflationVError = false;
      $scope.oldAgeExpenseVError = false;
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

      $scope.ageDiffHighLow = retirement_const.AgeDiffHighLow;
      $scope.retageDiffHighLow = retirement_const.RetAgeDiffHighLow;
      $scope.minMnthlExp = true;
      $scope.retirementObj = {};
      $scope.currentMonthlyExpensesFirstRangeMax = retirement_const.currentMonthlyExpensesFirstRangeMax;
      $scope.inflationRange = {
        min: retirement_const.inflationMin,
        max: retirement_const.inflationMax
      };
      $scope.retirementObj.oldAgeExpensePercent = retirement_const.oldAgeExpensePercent;

      $scope.validationHandle = function(validfor) {
        if (validfor == "corpusReturn") {
          $scope.rateOfCorpusVError = true;
          $timeout(function() {
            $scope.rateOfCorpusVError = false;
          }, 5000);
        }
        if (validfor == "lifeExpectancy") {
          $scope.lifeExpectancyVError = true;
          // $timeout(function() {
          //   $scope.lifeExpectancyVError = false;
          // }, 5000);
        }
      };

      $scope.minmax = function(validfor, lifeExpectancy, min, max, corpusreturn, investorretage) {
        if (validfor == "corpusReturn") {
          if (parseInt(corpusreturn) < min || isNaN(corpusreturn) || corpusreturn == "") {
            $scope.validationHandle("corpusReturn");
            //$scope.corpusReturn.value = min;
            $scope.validationCheckfortab = false;
          } else if (parseInt(corpusreturn) > max) {
            $scope.validationHandle("corpusReturn");
            //$scope.corpusReturn.value = max;
            $scope.validationCheckfortab = false;
          } else {
            $scope.validationCheckfortab = true;
            $scope.refreshCorpus(corpusreturn, investorretage);
          }
        }

        if (validfor == "lifeExpectancy") {
          if (parseInt(lifeExpectancy) < min || isNaN(lifeExpectancy) || lifeExpectancy == "") {
            $scope.validationHandle("lifeExpectancy");
            $scope.lifeExpectancy.value = "";
          } else if (parseInt(lifeExpectancy) > max) {
            $scope.validationHandle("lifeExpectancy");
            $scope.lifeExpectancy.value = "";
          } else {
            $scope.refreshCorpus(corpusreturn, investorretage);
          }
        }
      }

      $scope.numDifferentiation = function(val) {
        if (val >= 10000000) val = (val / 10000000).toFixed(3) + ' Cr';
        else if (val >= 100000) val = (val / 100000).toFixed(3) + ' Lac';
        else if (val >= 1000) val = $scope.numberWithCommas(val.toFixed(0)) + ' K';
        return val;
      }

      $scope.numberWithCommas = function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      $scope.getCorpus = function() {
        var corpusObj = retCalSvc.retCorpusObjfunc();
        if (corpusObj != null) {
          $scope.retirementObj.retirementAgeValue = corpusObj.retirementAge;
          $scope.retExpenses = $scope.numDifferentiation(corpusObj.expenses);
          $scope.corpus = $scope.numDifferentiation(corpusObj.corpus);
          $scope.monthlyInvestNeeded = $scope.numDifferentiation(corpusObj.monthlyInvestNeeded);
          $scope.retirementObj.currentAgeValue = corpusObj.age;
          $scope.retirementObj.monthlyExpensesValue = corpusObj.currentMonthlyExpenses;
          $scope.retirementObj.inflation = corpusObj.inflation;
          $scope.retirementObj.oldAgeExpensePercent = corpusObj.retExpensesPercent;
          $scope.corpusReturn.value = corpusObj.rateOfCorpus;
          $scope.chartretExpenses = corpusObj.expenses;
        }
        $scope.differenceExpensePercentage = Math.floor($scope.currentMonthlyExpenses * 100 / $scope.chartretExpenses);
      };

      $scope.getCorpus();

      if ($rootScope.corpusReturn != null) {
        $scope.corpusReturn.value = $rootScope.corpusReturn;
      }

      if ($rootScope.lifeExpectancy != null) {
        $scope.lifeExpectancy.value = $rootScope.lifeExpectancy;
      }

      $scope.addInvestments = function() {
        $state.go('app.add-retirement-investments');
      };

      $scope.refreshCorpus = function(corpusReturn, investorretage) {
        $rootScope.corpusReturn = corpusReturn;
        retCalSvc.calCorpus($scope.retirementObj.currentAgeValue, $scope.retirementObj.retirementAgeValue, $scope.retirementObj.monthlyExpensesValue, $scope.retirementObj.inflation, $scope.retirementObj.oldAgeExpensePercent, corpusReturn, investorretage);
        var corpusObj = retCalSvc.retCorpusObjfunc();
        if (corpusObj != null) {
          $scope.retirementObj.retirementAgeValue = corpusObj.retirementAge;
          $scope.retExpenses = $scope.numDifferentiation(corpusObj.expenses);
          $scope.corpus = $scope.numDifferentiation(corpusObj.corpus);
          $scope.monthlyInvestNeeded = $scope.numDifferentiation(corpusObj.monthlyInvestNeeded);
          $scope.retirementObj.monthlyExpensesValue = corpusObj.currentMonthlyExpenses;
          $scope.chartretExpenses = corpusObj.expenses;
        }
        $scope.differenceExpensePercentage = Math.floor($scope.currentMonthlyExpenses * 100 / $scope.chartretExpenses);
      };

      $scope.$watch('retirementObj.currentAgeValue', function() {
        if ($rootScope.tabInclude) {
          if (!isInteger($scope.retirementObj.currentAgeValue)) {
            $scope.validationCheckfortab = false;
          } else {
            $scope.validationCheckfortab = true;
          }
          if ($scope.retirementObj.currentAgeValue > retirement_const.ageMin - 1 && $scope.retirementObj.currentAgeValue < retirement_const.ageMax + 1 && $scope.retirementObj.retirementAgeValue > retirement_const.retageMin - 1 && $scope.retirementObj.retirementAgeValue < retirement_const.retageMax + 1 && $scope.retirementObj.monthlyExpensesValue > retirement_const.MonthlyExpensesValueMin - 1 && $scope.retirementObj.monthlyExpensesValue < retirement_const.MonthlyExpensesValueMax + 1 && $scope.corpusReturn.value > 0 && $scope.corpusReturn.value < 50 && $scope.lifeExpectancy.value > 70 && $scope.lifeExpectancy.value < 100) {
            $scope.refreshCorpus($scope.corpusReturn.value, $scope.lifeExpectancy.value)
          }
          var str1 = "" + $scope.retirementObj.currentAgeValue;
          if (str1.indexOf('.') !== -1) {
            $scope.retirementObj.currentAgeValue = 25;
          }
        }
      }, true);

      $scope.$watch('retirementObj.retirementAgeValue', function() {
        if ($rootScope.tabInclude) {
          if (!isInteger($scope.retirementObj.retirementAgeValue)) {
            $scope.validationCheckfortab = false;
          } else {
            $scope.validationCheckfortab = true;
          }
          if ($scope.retirementObj.currentAgeValue > retirement_const.ageMin - 1 && $scope.retirementObj.currentAgeValue < retirement_const.ageMax + 1 && $scope.retirementObj.retirementAgeValue > retirement_const.retageMin - 1 && $scope.retirementObj.retirementAgeValue < retirement_const.retageMax + 1 && $scope.retirementObj.monthlyExpensesValue > retirement_const.MonthlyExpensesValueMin - 1 && $scope.retirementObj.monthlyExpensesValue < retirement_const.MonthlyExpensesValueMax + 1 && $scope.corpusReturn.value > 0 && $scope.corpusReturn.value < 50 && $scope.lifeExpectancy.value > 70 && $scope.lifeExpectancy.value < 100) {
            $scope.refreshCorpus($scope.corpusReturn.value, $scope.lifeExpectancy.value)
          }
          var value = "" + $scope.retirementObj.retirementAgeValue;
          if (value.indexOf('.') !== -1) {
            $scope.retirementObj.retirementAgeValue = 30;
          }
        }
      }, true);

      $scope.$watch('retirementObj.monthlyExpensesValue', function() {
        if ($rootScope.tabInclude) {
          if (!isInteger($scope.retirementObj.monthlyExpensesValue)) {
            $scope.validationCheckfortab = false;
          } else {
            $scope.validationCheckfortab = true;
          }
          if ($scope.retirementObj.currentAgeValue > retirement_const.ageMin - 1 && $scope.retirementObj.currentAgeValue < retirement_const.ageMax + 1 && $scope.retirementObj.retirementAgeValue > retirement_const.retageMin - 1 && $scope.retirementObj.retirementAgeValue < retirement_const.retageMax + 1 && $scope.retirementObj.monthlyExpensesValue > retirement_const.MonthlyExpensesValueMin - 1 && $scope.retirementObj.monthlyExpensesValue < retirement_const.MonthlyExpensesValueMax + 1 && $scope.corpusReturn.value > 0 && $scope.corpusReturn.value < 50 && $scope.lifeExpectancy.value > 70 && $scope.lifeExpectancy.value < 100) {
            $scope.refreshCorpus($scope.corpusReturn.value, $scope.lifeExpectancy.value)
          }
          var value = "" + $scope.retirementObj.monthlyExpensesValue;
          if (value.indexOf('.') !== -1) {
            $scope.retirementObj.monthlyExpensesValue = 20000;
          }
        }
      }, true);

      $scope.$watch('retirementObj.inflation', function() {
        if ($rootScope.tabInclude) {
          if (!isInteger($scope.retirementObj.inflation)) {
            $scope.validationCheckfortab = false;
          } else {
            $scope.validationCheckfortab = true;
          }
          if ($scope.retirementObj.currentAgeValue > retirement_const.ageMin - 1 && $scope.retirementObj.currentAgeValue < retirement_const.ageMax + 1 && $scope.retirementObj.retirementAgeValue > retirement_const.retageMin - 1 && $scope.retirementObj.retirementAgeValue < retirement_const.retageMax + 1 && $scope.retirementObj.monthlyExpensesValue > retirement_const.MonthlyExpensesValueMin - 1 && $scope.retirementObj.monthlyExpensesValue < retirement_const.MonthlyExpensesValueMax + 1 && $scope.corpusReturn.value > 0 && $scope.corpusReturn.value < 50 && $scope.lifeExpectancy.value > 70 && $scope.lifeExpectancy.value < 100) {
            $scope.refreshCorpus($scope.corpusReturn.value, $scope.lifeExpectancy.value)
          }
          var value = "" + $scope.retirementObj.inflation;
          if (value.indexOf('.') !== -1) {
            $scope.retirementObj.inflation = 10;
          }
        }
      }, true);

      $scope.$watch('lifeExpectancy.value', function() {
        $rootScope.lifeExpectancy = $scope.lifeExpectancy.value;
      }, true);

      $scope.toggle = function() {
        $scope.collapsed = !$scope.collapsed;
        $scope.uncollapsed = !$scope.uncollapsed;
        $scope.minMnthlExp = !$scope.minMnthlExp;
        if ($scope.collapsed) {
          $scope.retirementObj.monthlyExpensesValue = 1000;
        }
      };

      $scope.toggleNotes = function(divId) {
        if (divId == 'CurrentMnth') {
          $scope.showNoteCurrentMnth = !$scope.showNoteCurrentMnth;
        }
      };

      function isInteger(x) {
        return x % 1 === 0;
      };

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
        $scope.email_To="";
        $scope.email_Cc="";
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
            //trippleHealthObjectServicePi.tHSendMail(emailData).then(function(){
                $scope.hidesendEmailPopup();
                $scope.showPlusPopup=false;
            //});
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
