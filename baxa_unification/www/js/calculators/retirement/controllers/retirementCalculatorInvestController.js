otherCalculators.controller(
  'retirementCalculatorInvestController', [
    '$rootScope',
    '$scope',
    '$state',
    '$log',
    '$window',
    '$ionicHistory',
    '$ionicPlatform',
    '$ionicNavBarDelegate',
    '$cordovaFile',
    '$timeout',
    '$ionicModal',
    'fSDataFromDBSvc',
    'retCalSvc',
    'calculatorCommonService',
    'commonFileFunctionFactory',
    'utilityService',
    function(
      $rootScope,
      $scope,
      $state,
      $log,
      $window,
      $ionicHistory,
      $ionicPlatform,
      $ionicNavBarDelegate,
      $cordovaFile,
      $timeout,
      $ionicModal,
      fSDataFromDBSvc,
      retCalSvc,
      calculatorCommonService,
      commonFileFunctionFactory,
      utilityService
    ) {
      'use strict';
      $scope.collapsed = true;
      $scope.uncollapsed = false;
      $scope.minLumInvst = true;
      $scope.minCurrentMnthly = true;
      $scope.collapsedInvest = true;
      $scope.uncollapsedInvest = false;
      $scope.IsVisible = false;
      $scope.monthlyDiffHighLow = 500000 - 51000;
      $scope.yearlyDiffHighLow = 100000000 - 5100000;
      $scope.lumsumrateVError = false;
      $scope.monthlyrateVError = false;
      $scope.currentLumpsumFirstrangeMax = 5000000;
      $scope.currentMonthlyInvestmentsFirstrangeMax = 50000;
      $scope.fromSwitchSummary = false;
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
      $scope.totalbars = 31;
      $scope.currentMonthlyExpenses = 0;
      $scope.currentLumpsumInvestments1.value = 0;

      if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
        $ionicNavBarDelegate.showBackButton(false);
      } else { 
        $ionicNavBarDelegate.showBackButton(false);
      }

      /*Animation Code*/
      $scope.setNowAnimate = function() {
        setAnimate($ionicHistory);
      };

      $scope.validationHandle = function(validfor) {
        if (validfor === "lumsumrate") {
          $scope.lumsumrateVError = true;
          // $timeout(function() {
          //   $scope.lumsumrateVError = false;
          // }, 5000);
        }
        if (validfor === "monthlyrate") {
          $scope.monthlyrateVError = true;
          // $timeout(function() {
          //   $scope.monthlyrateVError = false;
          // }, 5000);
        }
      };

      $scope.minmax = function(validfor, min, max, currentLumpsumInvestments1, currentLumpsumrateOfReturn, currentMonthlyInvestments1, currentMonthlyrateOfReturn) {
        if (validfor === "lumsumrate") {
          if (parseInt(currentLumpsumrateOfReturn) < min || isNaN(currentLumpsumrateOfReturn) || currentLumpsumrateOfReturn == "") {
            $scope.validationHandle("lumsumrate");
            //$scope.currentLumpsumrateOfReturn.value = $scope.currentLumpsumrateOfReturn.min;
          } else if (parseInt(currentLumpsumrateOfReturn) > max) {
            $scope.validationHandle("lumsumrate");
            //$scope.currentLumpsumrateOfReturn.value = $scope.currentLumpsumrateOfReturn.max;
          } else {
              $scope.lumsumrateVError = false;
            $scope.refreshCorpus(currentLumpsumInvestments1, currentLumpsumrateOfReturn, currentMonthlyInvestments1, currentMonthlyrateOfReturn);
          }
        }
        if (validfor == "monthlyrate") {
          if (parseInt(currentMonthlyrateOfReturn) < min || isNaN(currentMonthlyrateOfReturn) || currentMonthlyrateOfReturn == "") {
            $scope.validationHandle("monthlyrate");
          //  $scope.currentMonthlyrateOfReturn.value = $scope.currentMonthlyrateOfReturn.min;
          } else if (parseInt(currentMonthlyrateOfReturn) > max) {
            $scope.validationHandle("monthlyrate");
          //  $scope.currentMonthlyrateOfReturn.value = $scope.currentMonthlyrateOfReturn.max;
          } else {
              $scope.monthlyrateVError = false;
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

      /*From Calculator Summary*/
      if ($state.params.customerId) {
        $scope.fromSwitchSummary = true;
        $rootScope.saveResult = true;
        $rootScope.calCustId = $state.params.customerId;
        if ($state.current.name == "onTapCalcualtor") {
          $state.params.recId = $rootScope.selectedRecId;
        }
        var calcData = calculatorCommonService.getCalcInputs($state.params.customerId, $state.params.recId);
        calcData.then(function(vals) {
          var inputData = JSON.parse(vals.Input);
          var outputData = JSON.parse(vals.Output);
          //wealthCalculatorSetGetService.setSelectedData(data);
          retCalSvc.calCorpus(inputData.age, inputData.retirementAge, inputData.currentMonthlyExpenses, inputData.inflation, inputData.retExpensesPercent, inputData.rateOfCorpus);
          var corpusObj = retCalSvc.retCorpusObjfunc();
          $log.debug('corpusObj', corpusObj);
          if (corpusObj != null) {
            $scope.investorretage = corpusObj.retirementAge;
            $scope.retExpenses = $scope.numDifferentiation(corpusObj.expenses);
            $scope.corpus = corpusObj.corpus;
            $scope.monthlyInvestNeeded = corpusObj.monthlyInvestNeeded;
            $scope.age = corpusObj.age;
            $scope.currentMonthlyExpenses = corpusObj.currentMonthlyExpenses;
            $scope.inflation = corpusObj.inflation;
            $scope.retExpensesPercent = corpusObj.retExpensesPercent;
            $scope.corpusReturn = corpusObj.rateOfCorpus;
            $scope.yearsToRetire = $scope.investorretage - $scope.age;
            $scope.corpusgap = corpusObj.corpus;
            if (parseInt($scope.corpusgap) < 0) {
              $scope.corpusgap = 0.00;
            }
            $scope.revisedmonthlygap = $scope.monthlyInvestNeeded - $scope.currentMonthlyInvestments1.value;
          }
          $scope.currentLumpsumInvestments1.value = outputData.currentLumpsumInvestment;
          $scope.currentLumpsumrateOfReturn.value = outputData.currentLumpsumrateOfReturn;
          $scope.currentMonthlyInvestments1.value = outputData.currentMonthlyInvestment;
          $scope.currentMonthlyrateOfReturn.value = outputData.currentMonthlyrateOfReturn;
          if (outputData != null) {
            retCalSvc.calrevisedCorpus(outputData.currentLumpsumInvestment, outputData.currentMonthlyInvestment, outputData.currentLumpsumrateOfReturn, outputData.currentMonthlyrateOfReturn, outputData.yearsToRetire, outputData.retirementCorpReqBefInv);
            var refreshcorpusObj = retCalSvc.retRevisedCorpusObjfunc();
            $log.debug('refreshcorpusObj.revisedNewCorpus', refreshcorpusObj.revisedNewCorpus);
            $scope.corpusgap = refreshcorpusObj.revisedNewCorpus;
            if (parseInt($scope.corpusgap) < 0) {
              $scope.corpusgap = 0.00;
            }
            /*Value to set*/
            $scope.totalLumpsumAssetsCreated = outputData.totalLumpsumAssetsCreated;
            $scope.totalMonthlyAssetsCreated = outputData.totalMonthlyAssetsCreated;
            $scope.revisedMonthlyInvestmentNeeded = outputData.revisedMonthlyInvestmentNeeded;
            var totalLumpsumAssetsCreatedBarPercent = outputData.totalLumpsumAssetsCreated * 100 / corpusObj.corpus;
            var monthlyInvestmentRequiredBarPercent = outputData.currentMonthlyInvestment.value * 1000 * 100 / outputData.revisedMonthlyInvestmentNeeded;
            var totalMonthlyAssetsCreatedBarPercent = outputData.totalMonthlyAssetsCreated * 100 / corpusObj.corpus;
            $scope.addlumpsuminvestment(totalLumpsumAssetsCreatedBarPercent, totalMonthlyAssetsCreatedBarPercent);
            $scope.monthlyrenewinvestmentrequired(outputData.currentMonthlyInvestment);
          }
        });
      } else {
        /* end */
        var corpusObj = retCalSvc.retCorpusObjfunc();
        if (corpusObj != null) {
          $scope.investorretage = corpusObj.retirementAge;
          $scope.retExpenses = $scope.numDifferentiation(corpusObj.expenses);
          $scope.corpus = corpusObj.corpus;
          $scope.monthlyInvestNeeded = corpusObj.monthlyInvestNeeded;
          $scope.age = corpusObj.age;
          $scope.currentMonthlyExpenses = corpusObj.currentMonthlyExpenses;
          $scope.inflation = corpusObj.inflation;
          $scope.retExpensesPercent = corpusObj.retExpensesPercent;
          $scope.corpusReturn = corpusObj.rateOfCorpus;
          $scope.yearsToRetire = $scope.investorretage - $scope.age;
          $scope.corpusgap = corpusObj.corpus;
          if (parseInt($scope.corpusgap) < 0) {
            $scope.corpusgap = 0.00;
          }
          $scope.revisedmonthlygap = $scope.monthlyInvestNeeded - $scope.currentMonthlyInvestments1.value;
        }
      }

      $scope.refreshCorpus = function(currentLumpsumInvestments, currentLumpsumrateOfReturn, currentMonthlyInvestments, currentMonthlyrateOfReturn) {
        if (!isNaN(currentLumpsumInvestments)) {
          retCalSvc.calrevisedCorpus(currentLumpsumInvestments, currentMonthlyInvestments, currentLumpsumrateOfReturn, currentMonthlyrateOfReturn, $scope.yearsToRetire, $scope.corpus);
          var refreshcorpusObj = retCalSvc.retRevisedCorpusObjfunc();
          $scope.corpusgap = angular.copy(refreshcorpusObj.revisedNewCorpus);
          if (parseInt($scope.corpusgap) < 0) {
            $scope.corpusgap = 0.00;
          }
          $scope.totalLumpsumAssetsCreated = refreshcorpusObj.totalLumpsumAssetsCreated;
          $scope.totalMonthlyAssetsCreated = refreshcorpusObj.totalMonthlyAssetsCreated;
          $scope.revisedMonthlyInvestmentNeeded = refreshcorpusObj.revisedMonthlyInvestmentNeeded;
          var totalLumpsumAssetsCreatedBarPercent = refreshcorpusObj.totalLumpsumAssetsCreated * 100 / corpusObj.corpus;
          var monthlyInvestmentRequiredBarPercent = $scope.currentMonthlyInvestments1.value * 1000 * 100 / refreshcorpusObj.revisedMonthlyInvestmentNeeded;
          var totalMonthlyAssetsCreatedBarPercent = refreshcorpusObj.totalMonthlyAssetsCreated * 100 / corpusObj.corpus;
          $scope.addlumpsuminvestment(totalLumpsumAssetsCreatedBarPercent, totalMonthlyAssetsCreatedBarPercent);
          if (currentLumpsumInvestments > 5000000) {
            $scope.collapsed = false;
            $scope.uncollapsed = true;
          }
          if (currentMonthlyInvestments > 50000) {
            $scope.collapsedInvest = false;
            $scope.uncollapsedInvest = true;
          }
        }
      };

      $scope.addlumpsuminvestment = function(BarPercent, totalMonthlyAssetsCreatedBarPercent) {
        if ($scope.currentLumpsumInvestments1.value != undefined) {
          var n = Math.round(BarPercent * $scope.totalbars / 100);
          var j = Math.round(totalMonthlyAssetsCreatedBarPercent * 31 / 100);
          var o = j + n;
          var k = $scope.totalbars - o;
          if ($scope.corpusgap > 0) {
            var myEl = angular.element(document.querySelector('#lumpsuminvest'));
            myEl.empty();
            myEl = angular.element(document.querySelector('#lumpsuminvest'));
            for (var i = 0; i < n; i++) {
              myEl.append('<div class="smlbx2">&nbsp;</div>');
            }
            var monthlyinvest = angular.element(document.querySelector('#monthlyinvest'));
            monthlyinvest.empty();
            monthlyinvest = angular.element(document.querySelector('#monthlyinvest'));
            for (var i = 0; i < j; i++) {
              monthlyinvest.append('<div class="smlbx3">&nbsp;</div>');
            }
            var corpus = angular.element(document.querySelector('#corpusgap'));
            corpus.empty();
            corpus = angular.element(document.querySelector('#corpusgap'));
            for (var i = 0; i < k; i++) {
              corpus.append('<div class="corpusgap">&nbsp;</div>');
            }
          }
          if (o > $scope.totalbars) {
            var differ = o - $scope.totalbars;
            var equaldist = differ / 2;
            n = n - equaldist;
            j = j - equaldist;
            var myEl = angular.element(document.querySelector('#lumpsuminvest'));
            myEl.empty();
            myEl = angular.element(document.querySelector('#lumpsuminvest'));
            for (var i = 0; i < n; i++) {
              myEl.append('<div class="smlbx2">&nbsp;</div>');
            }
            var monthlyinvest = angular.element(document.querySelector('#monthlyinvest'));
            monthlyinvest.empty();
            monthlyinvest = angular.element(document.querySelector('#monthlyinvest'));
            for (var i = 0; i < j; i++) {
              monthlyinvest.append('<div class="smlbx3">&nbsp;</div>');
            }
          }
        }
      };

      $scope.monthlyrenewinvestmentrequired = function(monthlyinvestments) {
        var refreshcorpusObj = retCalSvc.retRevisedCorpusObjfunc();
        $log.debug(refreshcorpusObj);
        if (monthlyinvestments) {
          $scope.revisedmonthlygap = $scope.monthlyInvestNeeded - $scope.currentMonthlyInvestments1.value;
          if ($scope.revisedmonthlygap < 0) {
            $scope.revisedmonthlygap = 0;
          }
          var monthlybarpercent = monthlyinvestments / $scope.monthlyInvestNeeded * 100;
          var n = Math.round(monthlybarpercent * 31 / 100);
          var j = 31 - n;
          if (monthlybarpercent < 100) {
            var monthlyInvestGap = angular.element(document.querySelector('#reqinvest'));
            monthlyInvestGap.empty();
            for (var i = 0; i < n; i++) {
              monthlyInvestGap.append('<div class="smlbx5">&nbsp;</div>');
            }
          } else {
            var monthlyInvestGap = angular.element(document.querySelector('#reqinvest'));
            monthlyInvestGap.empty();
            for (var i = 0; i < 31; i++) {
              monthlyInvestGap.append('<div class="smlbx5">&nbsp;</div>');
            }
          }
        }
if(monthlyinvestments == 0 || monthlyinvestments == undefined)
{
  var monthlyInvestGap = angular.element(document.querySelector('#reqinvest'));
  monthlyInvestGap.empty();

}

      };

      $scope.toggle = function() {
        $scope.collapsed = !$scope.collapsed;
        $scope.uncollapsed = !$scope.uncollapsed;
        $scope.minLumInvst = !$scope.minLumInvst;
        if ($scope.collapsed) {
          $scope.currentLumpsumInvestments1.value = 0;
            $scope.refreshCorpus($scope.currentLumpsumInvestments1.value, $scope.currentLumpsumrateOfReturn.value, $scope.currentMonthlyInvestments1.value, $scope.currentMonthlyrateOfReturn.value);
        }
        else{
              $scope.currentLumpsumInvestments1.value = 5100000;
                $scope.refreshCorpus($scope.currentLumpsumInvestments1.value, $scope.currentLumpsumrateOfReturn.value, $scope.currentMonthlyInvestments1.value, $scope.currentMonthlyrateOfReturn.value);

        }
      };

      $scope.toggle2 = function() {
        $scope.collapsedInvest = !$scope.collapsedInvest;
        $scope.uncollapsedInvest = !$scope.uncollapsedInvest;
        $scope.minCurrentMnthly = !$scope.minCurrentMnthly;
        if ($scope.collapsedInvest) {
          $scope.currentMonthlyInvestments1.value = 0;
              $scope.refreshCorpus($scope.currentLumpsumInvestments1.value, $scope.currentLumpsumrateOfReturn.value, $scope.currentMonthlyInvestments1.value, $scope.currentMonthlyrateOfReturn.value);
                 $scope.monthlyrenewinvestmentrequired($scope.currentMonthlyInvestments1.value);
        }
        else{

         $scope.currentMonthlyInvestments1.value = 51000;
            $scope.refreshCorpus($scope.currentLumpsumInvestments1.value, $scope.currentLumpsumrateOfReturn.value, $scope.currentMonthlyInvestments1.value, $scope.currentMonthlyrateOfReturn.value);
             $scope.monthlyrenewinvestmentrequired($scope.currentMonthlyInvestments1.value);
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

      $scope.handleKeyPress = function(keyCode, event) {
        if (keyCode == 46 || keyCode == 0) {
          event.preventDefault();
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

      $scope.$watch('currentLumpsumrateOfReturn.value', function() {
        var value = "" + $scope.currentLumpsumrateOfReturn.value;
        if (value.indexOf('.') !== -1) {
          $scope.currentLumpsumrateOfReturn.value = 0;
        }
      }, true);

      $scope.$watch('currentMonthlyrateOfReturn.value', function() {
        var value = "" + $scope.currentMonthlyrateOfReturn.value;
        if (value.indexOf('.') !== -1) {
          $scope.currentMonthlyrateOfReturn.value = 0;
        }
      }, true);

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

      function saveResult() {
        var calData = {};
        var calcInput = null;
        var calcResult = null;
        if (retCalSvc.retRevisedCorpusObjfunc() && Object.keys(retCalSvc.retRevisedCorpusObjfunc()).length) {
          calcResult = retCalSvc.retRevisedCorpusObjfunc();
        }
        calData.Cust_Id = $rootScope.calCustId;
        calData.Type = '1';
        calData.Input = JSON.stringify(retCalSvc.retCorpusObjfunc());
        calData.Output = JSON.stringify(calcResult);
        calData.IsActive = '1';
        //$log.debug($scope.wData);
        calculatorCommonService.saveCalc(calData);
        $rootScope.saveResult = false;
      }

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
