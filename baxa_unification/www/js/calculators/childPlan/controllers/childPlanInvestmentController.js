otherCalculators.controller(
  'childPlanInvestmentController', ['$rootScope',
    '$scope',
    '$state',
    '$log',
    'fSDataFromDBSvc',
    'retChildStudy',
    '$timeout',
    '$cordovaFile',
    '$ionicPopup',
    '$ionicModal',
    '$ionicHistory',
    '$ionicPlatform',
    '$ionicNavBarDelegate',
    'calculatorCommonService',
    'commonFileFunctionFactory',
    'utilityService',
    function($rootScope,
      $scope,
      $state,
      $log,
      fSDataFromDBSvc,
      retChildStudy,
      $timeout,
      $cordovaFile,
      $ionicPopup,
      $ionicModal,
      $ionicHistory,
      $ionicPlatform,
      $ionicNavBarDelegate,
      calculatorCommonService,
      commonFileFunctionFactory,
      utilityService) {
      'use strict';
      $rootScope.InvestmentPage = true;
      $scope.collapsed = true;
      $scope.uncollapsed = false;
      $scope.minLumInvst = true;
      $scope.minCurrentMnthly = true;
      $scope.collapsedInvest = true;
      $scope.uncollapsedInvest = false;
      $scope.IsVisible = false;
      $scope.monthlyDiffHighLow = 500000 - 51000;
      $scope.yearlyDiffHighLow = 100000000 - 5100000;
    //  $scope.lumsumrateVError = false;
      //$scope.monthlyrateVError = false;
      $scope.currentLumpsumFirstrangeMax = 5000000;
      $scope.currentMonthlyInvestmentsFirstrangeMax = 50000;
      $scope.isIllustrationsSelected=true;
      $scope.isBrochureSelected=false;

      $scope.currentLumpsumrateOfReturn = {
        min: 0,
        max: 99,
        value: 10
      };
      $scope.currentMonthlyrateOfReturn = {
        min: 0,
        max: 99,
        value: 10
      };
      $scope.currentLumpsumInvestments1 = {
        min: 0,
        max: 100000000,
        value: 0
      };
      $scope.currentMonthlyInvestments1 = {
        min: 0,
        max: 500000,
        value: 0
      };

      $scope.currentLumpsumInvestments1.value = 0;

      if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
        $ionicNavBarDelegate.showBackButton(false);
      } else { 
        $ionicNavBarDelegate.showBackButton(false);
      }

      /*Animation Code*/
      $scope.setNowAnimate = function() {
        setAnimate($ionicHistory);
      }

      /*  $scope.validationHandle = function(validfor) {
        if (validfor == "lumsumrate") {
          $scope.lumsumrateVError = true;
          $timeout(function() {
            $scope.lumsumrateVError = false;
          }, 5000);
        }
      if (validfor == "monthlyrate") {
          $scope.monthlyrateVError = true;
         $timeout(function() {
            $scope.monthlyrateVError = false;
          }, 5000);
        }
      };*/

      $scope.minmax = function(validfor, min, max, currentLumpsumInvestments1, currentLumpsumrateOfReturn, currentMonthlyInvestments1, currentMonthlyrateOfReturn) {
        if (validfor == "lumsumrate") {
          if (parseInt(currentLumpsumrateOfReturn) < min || isNaN(currentLumpsumrateOfReturn) || currentLumpsumrateOfReturn === "") {
          //  $scope.validationHandle("lumsumrate");
          //  $scope.currentLumpsumrateOfReturn.value = 0;
          } else if (parseInt(currentLumpsumrateOfReturn) > max) {
          //  $scope.validationHandle("lumsumrate");
          //  $scope.currentLumpsumrateOfReturn.value = 99;
          } else {
            $scope.refreshCorpus(currentLumpsumInvestments1, currentLumpsumrateOfReturn, currentMonthlyInvestments1, currentMonthlyrateOfReturn);
          }
        }
        if (validfor == "monthlyrate") {
          if (parseInt(currentMonthlyrateOfReturn) < min || isNaN(currentMonthlyrateOfReturn) || currentMonthlyrateOfReturn === "") {
          //  $scope.validationHandle("monthlyrate");
          //  $scope.currentMonthlyrateOfReturn.value = 0;
          } else if (parseInt(currentMonthlyrateOfReturn) > max) {
          //  $scope.validationHandle("monthlyrate");
            //$scope.currentMonthlyrateOfReturn.value = 99;
          } else {
            $scope.refreshCorpus(currentLumpsumInvestments1, currentLumpsumrateOfReturn, currentMonthlyInvestments1, currentMonthlyrateOfReturn);
            $scope.monthlyrenewinvestmentrequired(currentMonthlyInvestments1);
          }
        }
      };

      $scope.numDifferentiation = function(val) {
        if (val >= 10000000) val = (val / 10000000).toFixed(2) + ' Cr';
        else if (val >= 100000) val = (val / 100000).toFixed(2) + ' Lac';
        else if (val >= 1000) val = (val / 1000).toFixed(2) + ' K';
        return val;
      };
      if ($state.params.customerId) {
        $scope.fromSwitchSummary = true;
        $log.debug('$state.params.recId', $state.params.recId);
        $rootScope.saveResult = true;
        $rootScope.calCustId = $state.params.customerId;
        if ($state.current.name == "onTapCalcualtor") {
          $state.params.recId = $rootScope.selectedRecId;
        }
        var calcData = calculatorCommonService.getCalcInputs($state.params.customerId, $state.params.recId);
        calcData.then(function(vals) {
          $log.debug('childvals', vals);
          var inputData = JSON.parse(vals.Input);
          var outputData = JSON.parse(vals.Output);
          $log.debug('inputData', inputData);
          retChildStudy.calChildStudyCost(inputData);
          var corpusObj = retChildStudy.retCorpusObjfunc();
          $scope.ChildStudyobj = inputData;
          $log.debug('$scope.ChildStudyobj', $scope.ChildStudyobj);
          $scope.corpus = $scope.ChildStudyobj.futureCostofEducation;
          $scope.monthlyInvestNeeded = $scope.ChildStudyobj.monthlyInvestMentRequired;
          $scope.corpusgap = outputData[0].revisedNewCorpus;
          $log.debug($scope.corpusgap);
          if (parseInt($scope.corpusgap) < 0) {
            $scope.corpusgap = 0.00;
          }
          $scope.revisedmonthlygap = $scope.monthlyInvestNeeded - $scope.currentMonthlyInvestments1.value;
          $scope.totalLumpsumAssetsCreated = outputData[0].totalLumpsumAssetsCreated;
          $scope.totalMonthlyAssetsCreated = outputData[0].totalMonthlyAssetsCreated;
          $scope.revisedMonthlyInvestmentNeeded = outputData[0].revisedMonthlyInvestmentNeeded;
          var totalLumpsumAssetsCreatedBarPercent = outputData[0].totalLumpsumAssetsCreated * 100 / $scope.corpus;
          var monthlyInvestmentRequiredBarPercent = $scope.currentMonthlyInvestments1.value * 1000 * 100 / outputData[0].revisedMonthlyInvestmentNeeded;
          var totalMonthlyAssetsCreatedBarPercent = outputData[0].totalMonthlyAssetsCreated * 100 / $scope.corpus;
          $log.debug('totalLumpsumAssetsCreated', $scope.totalLumpsumAssetsCreated);
          $scope.addlumpsuminvestment(totalLumpsumAssetsCreatedBarPercent, totalMonthlyAssetsCreatedBarPercent);
          $scope.monthlyrenewinvestmentrequired(outputData[0].currentMonthlyInvestment);
          if (outputData[0].currentLumpsumInvestments > 5000000) {
            $scope.collapsed = false;
            $scope.uncollapsed = true;
          }
          if (outputData[0].currentMonthlyInvestments > 50000) {
            $scope.collapsedInvest = false;
            $scope.uncollapsedInvest = true;
          }
        });
      } else {
        var corpusObj = retChildStudy.retCorpusObjfunc();
        if (corpusObj != null) {
          $scope.ChildStudyobj = corpusObj;
          $scope.corpus = $scope.ChildStudyobj.futureCostofEducation;
          $scope.monthlyInvestNeeded = $scope.ChildStudyobj.monthlyInvestMentRequired;
          $scope.corpusgap = $scope.corpus;
          if (parseInt($scope.corpusgap) < 0) {
            $scope.corpusgap = 0.00;
          }
          $scope.revisedmonthlygap = $scope.monthlyInvestNeeded - $scope.currentMonthlyInvestments1.value;
        }
      }

      $scope.refreshCorpus = function(currentLumpsumInvestments, currentLumpsumrateOfReturn, currentMonthlyInvestments, currentMonthlyrateOfReturn) {
        retChildStudy.calrevisedCorpus(currentLumpsumInvestments, currentMonthlyInvestments, currentLumpsumrateOfReturn, currentMonthlyrateOfReturn, $scope.ChildStudyobj.yearsToAchieveGoal, $scope.corpus);
        var refreshcorpusObj = retChildStudy.retRevisedCorpusObjfunc();
        $scope.corpusgap = refreshcorpusObj[0].revisedNewCorpus;
        if (parseInt($scope.corpusgap) < 0) {
          $scope.corpusgap = 0.00;
        }
        $scope.totalLumpsumAssetsCreated = refreshcorpusObj[0].totalLumpsumAssetsCreated;
        $scope.totalMonthlyAssetsCreated = refreshcorpusObj[0].totalMonthlyAssetsCreated;
        $scope.revisedMonthlyInvestmentNeeded = refreshcorpusObj[0].revisedMonthlyInvestmentNeeded;
        var totalLumpsumAssetsCreatedBarPercent = refreshcorpusObj[0].totalLumpsumAssetsCreated * 100 / $scope.corpus;
        var monthlyInvestmentRequiredBarPercent = $scope.currentMonthlyInvestments1.value * 1000 * 100 / refreshcorpusObj[0].revisedMonthlyInvestmentNeeded;
        var totalMonthlyAssetsCreatedBarPercent = refreshcorpusObj[0].totalMonthlyAssetsCreated * 100 / $scope.corpus;
        $scope.addlumpsuminvestment(totalLumpsumAssetsCreatedBarPercent, totalMonthlyAssetsCreatedBarPercent);
        if (currentLumpsumInvestments > 5000000) {
          $scope.collapsed = false;
          $scope.uncollapsed = true;
        }
        if (currentMonthlyInvestments > 50000) {
          $scope.collapsedInvest = false;
          $scope.uncollapsedInvest = true;
        }
      };

      $scope.addlumpsuminvestment = function(BarPercent, totalMonthlyAssetsCreatedBarPercent) {
        $log.debug('BarPercent', BarPercent);
        $log.debug('totalMonthlyAssetsCreatedBarPercent', totalMonthlyAssetsCreatedBarPercent);
        var n = Math.round(BarPercent * 31 / 100);
        var j = Math.round(totalMonthlyAssetsCreatedBarPercent * 31 / 100);
        var o = j + n;
        var k = 31 - o;
        if ($scope.corpusgap > 0) {
          var myElumbar = angular.element(document.querySelector('#lumpsuminvest'));
          myElumbar.empty();
          myElumbar = angular.element(document.querySelector('#lumpsuminvest'));
          for (var i = 0; i < n; i++) {
            myElumbar.append('<div class="smlbx2">&nbsp;</div>');
          }
          var monthlyInvest = angular.element(document.querySelector('#monthlyinvest'));
          monthlyInvest.empty();
          monthlyInvest = angular.element(document.querySelector('#monthlyinvest'));
          for (var m = 0; m < j; m++) {
            monthlyInvest.append('<div class="smlbx1">&nbsp;</div>');
          }
          var corpus = angular.element(document.querySelector('#corpusgap'));
          corpus.empty();
          corpus = angular.element(document.querySelector('#corpusgap'));
          for (var q = 0; q < k; q++) {
            corpus.append('<div class="corpusgap">&nbsp;</div>');
          }
        }
        if (o > 31) {
          var differ = o - 31;
          var equaldist = differ / 2;
          n = n - equaldist;
          j = j - equaldist;
          var myEl = angular.element(document.querySelector('#lumpsuminvest'));
          myEl.empty();
          myEl = angular.element(document.querySelector('#lumpsuminvest'));
          for (var l = 0; l < n; l++) {
            myEl.append('<div class="smlbx2">&nbsp;</div>');
          }
          var monthlyInvest1 = angular.element(document.querySelector('#monthlyinvest'));
          monthlyInvest1.empty();
          monthlyInvest1 = angular.element(document.querySelector('#monthlyinvest'));
          for (var t = 0; t < j; t++) {
            monthlyInvest1.append('<div class="smlbx1">&nbsp;</div>');
          }
        }
      }

      $scope.monthlyrenewinvestmentrequired = function(monthlyinvestments) {
        if (!$scope.isEmpty(monthlyinvestments)) {
          $scope.revisedmonthlygap = $scope.monthlyInvestNeeded - $scope.currentMonthlyInvestments1.value;
          if ($scope.revisedmonthlygap < 0) {
            $scope.revisedmonthlygap = 0;
          }
          var monthlybarpercent = monthlyinvestments / $scope.monthlyInvestNeeded * 100;
          var n = Math.round(monthlybarpercent * 31 / 100);
          var j = 31 - n;
          if (monthlybarpercent < 100) {
            var monthlyInvestGap_1 = angular.element(document.querySelector('#reqinvest'));
            monthlyInvestGap_1.empty();
            for (var f = 0; f < n; f++) {
              monthlyInvestGap_1.append('<div class="smlbx1">&nbsp;</div>');
            }
          } else {
            var monthlyInvestGap_1 = angular.element(document.querySelector('#reqinvest'));
            monthlyInvestGap_1.empty();
            for (var c = 0; c < 31; c++) {
              monthlyInvestGap_1.append('<div class="smlbx1">&nbsp;</div>');
            }
          }
        }
      };

      $scope.isEmpty = function(str) {
        return (!str || 0 === str.length);
      };

      $scope.toggle = function() {
        $scope.collapsed = !$scope.collapsed;
        $scope.uncollapsed = !$scope.uncollapsed;
        $scope.minLumInvst = !$scope.minLumInvst;
        if ($scope.collapsed) {
          $scope.currentLumpsumInvestments1.value = $scope.currentLumpsumFirstrangeMax;
        }
      };

      $scope.toggle2 = function() {
        $scope.collapsedInvest = !$scope.collapsedInvest;
        $scope.uncollapsedInvest = !$scope.uncollapsedInvest;
        $scope.minCurrentMnthly = !$scope.minCurrentMnthly;
        if ($scope.collapsedInvest) {
          $scope.currentMonthlyInvestments1.value = $scope.currentMonthlyInvestmentsFirstrangeMax;
        }
      };

      $scope.toggleNotes = function(divId) {      
        if (divId == 'LumSum') {        
          $scope.showNoteLumSum = !$scope.showNoteLumSum;      
        }      
        if (divId == 'CurrentMnth') {        
          $scope.showNoteCurrentMnth = !$scope.showNoteCurrentMnth;      
        }    
      };

      $scope.$watch('currentMonthlyInvestments1.value', function() {
        if ($scope.currentMonthlyInvestments1.value > 50000) {
          $scope.collapsedInvest = false;
          $scope.uncollapsedInvest = true;
          $scope.minCurrentMnthly = false;
        }
        if ($scope.currentMonthlyInvestments1.value <= 50000) {
          $scope.collapsedInvest = true;
          $scope.uncollapsedInvest = false;
          $scope.minCurrentMnthly = true;
        }
      }, true);

      $scope.$watch('currentLumpsumInvestments1.value', function() {
        var value = "" + $scope.currentLumpsumInvestments1.value;
        if (value.indexOf('.') !== -1) {
          $scope.currentLumpsumInvestments1.value = parseInt(value);
        }
        if ($scope.currentLumpsumInvestments1.value > 5000000) {
          $scope.collapsed = false;
          $scope.uncollapsed = true;
          $scope.minLumInvst = false;
        }
        if ($scope.currentLumpsumInvestments1.value <= 5000000) {
          $scope.collapsed = true;
          $scope.uncollapsed = false;
          $scope.minLumInvst = true;
        }

        if ($scope.currentLumpsumInvestments1.value == undefined) {
          $scope.currentLumpsumInvestments1.value = 0;
          var myEl = angular.element(document.querySelector('#lumpsuminvest'));
          myEl.empty();
          $scope.totalLumpsumAssetsCreated = 0;
          $scope.corpusgap = $scope.corpus - $scope.totalMonthlyAssetsCreated;
        }
      }, true);

      /* Switch O/p Integration*/
      $scope.viewAnotherCal = function() {
        saveResult();
        $state.go('app.needPrioritisation', {
          customerId: $rootScope.calCustId
        });
      };

      $scope.proceedToProd = function() {
        saveResult();
        $state.go('app.productRecommendation', {
          customerId: $rootScope.calCustId
        });
      };

      $scope.showCalculatorPopup = function(PKSwitchCalculator) {
        $scope.showPlusPopup = !$scope.showPlusPopup;
      };

      function saveResult() {
        var calData = {};
        var calcInput = null;
        var calcResult = null;
        if (retChildStudy.retRevisedCorpusObjfunc() && Object.keys(retChildStudy.retRevisedCorpusObjfunc()).length) {
          calcResult = retChildStudy.retRevisedCorpusObjfunc();
        }
        calData.Cust_Id = $rootScope.calCustId;
        calData.Type = '3';
        calData.Input = JSON.stringify(retChildStudy.retCorpusObjfunc());
        calData.Output = JSON.stringify(calcResult);
        calData.IsActive = '1';
        calculatorCommonService.saveCalc(calData);
        $rootScope.saveResult = false;
      }

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
