/**
 * Created By: Atul A
 * Wealth Creation Calculation Service
 *
 * @class wealthCalculatorController
 * @submodule core-controller
 * @constructor
 */
otherCalculators.controller(
  'wealthChartController', [
    '$rootScope',
    '$scope',
    '$log',
    '$state',
    '$ionicHistory',
    '$cordovaFile',
    '$ionicModal',
    '$ionicNavBarDelegate',
    'wealthCalculatorService',
    'wealthCalculatorSetGetService',
    'calculatorCommonService',
    'commonFileFunctionFactory',
    'utilityService',
    function($rootScope, $scope, $log, $state, $ionicHistory,
      $cordovaFile, $ionicModal, $ionicNavBarDelegate,
      wealthCalculatorService, wealthCalculatorSetGetService, calculatorCommonService, commonFileFunctionFactory,  utilityService) {
      'use strict';
      $ionicNavBarDelegate.showBackButton(false);
      $scope.wealth = wealthCalculatorSetGetService.getSelectedData();
      $scope.wealth.fundsRequired = $scope.wealth.wealthGoal;
      $scope.wealth.years = $scope.wealth.fundReqAge - $scope.wealth.currentAge;
      $scope.wealth.rateOfRtrn = $rootScope.ror;
      $scope.wealth.minAge = 25;
      $scope.wealth.maxAge = 60;
      $scope.wealth.minFunds = 100000;
      $scope.wealth.maxFunds = 5000000;
      $scope.wealth.minFundsP = 5100000;
      $scope.wealth.maxFundsP = 100000000;
      $scope.wealth.minYears = 0;
      $scope.wealth.maxYears = 20;
      $scope.fundRangeMin = true;
      $scope.extraFundsRange = false;
      $scope.extraFundsAdd = true;
      $scope.extraFundsMin = false;
      $scope.isIllustrationsSelected=true;
      $scope.isBrochureSelected=false;

      /*Animation Code*/
      $scope.setNowAnimate = function() {
        setAnimate($ionicHistory);
      }


      if ($state.params.fromSwitch) {
        $rootScope.saveResult = true;
        $rootScope.calCustId = $state.params.fromSwitch;
      }


      $scope.showExtra = function() {
        if ($scope.wealth.fundsRequired > 5000000) {
          $scope.extraFundsRange = true;
          $scope.extraFundsAdd = false;
          $scope.extraFundsMin = true;
          $scope.fundRangeMin = false;

        }
        if ($scope.wealth.fundsRequired < 5000000) {
          $scope.extraFundsRange = false;
          $scope.extraFundsAdd = true;
          $scope.extraFundsMin = false;
          $scope.fundRangeMin = true;

        }
        if ($scope.wealth.fundsRequired > 100000000) {
          $scope.wealth.fundsRequired = 100000000;
        }
      };

      $scope.addFundsRange = function() {
        $scope.fundRangeMin = !$scope.fundRangeMin;
        $scope.extraFundsRange = !$scope.extraFundsRange;
        $scope.extraFundsAdd = !$scope.extraFundsAdd;
        $scope.extraFundsMin = !$scope.extraFundsMin;
        if (!$scope.extraFundsMin) {
          $scope.wealth.fundsRequired = "1000";
        }
        if ($scope.extraFundsRange) {
          $scope.wealth.fundsRequired = "5100000";
        }

      };

      $scope.numDifferentiation = function(val) {    
        if (val >= 10000000) val = (val / 1000000000).toFixed(2) + ' Cr';    
        else if (val >= 100000) val = (val / 10000000).toFixed(2) + ' Lakh';    
        else if (val >= 1000) val = (val / 100000).toFixed(2) + ' K';    
        return val; 
      };

      $scope.rangePercentage = function(input, range_min, range_max, range_2ndMax) {
        var percentage = ((input - range_min) * 100) / (range_max - range_min);
        if (percentage > 100) {
          if (typeof range_2ndMax !== 'undefined') {
            percentage = ((range_2ndMax - input) * 100) / (range_2ndMax - range_max);
            if (percentage < 0) {
              percentage = 0;
            }
          } else {
            percentage = 100;
          }

        } else if (percentage < 0) {
          percentage = 0;
        }
        $log.debug(percentage);
        $scope.rangePer = Math.round(percentage);
        return percentage;
      };

      if (screen.width > screen.height) {
        $rootScope.tabInclude = true;
      } else {
        var myEl = angular.element(document.querySelector('#inputDiv'));
        myEl.remove();
        var myEl2 = angular.element(document.querySelector('#chartDiv'));
        myEl2.removeClass("rightPanel");
        myEl2.addClass("leftPanel");
      }
      $scope.wData = {};
      $scope.totalWealth = {};
      if ($state.params.customerId) {
        $rootScope.fromSwitchSummary = true;
        $log.debug('$state.params.recId', $state.params.recId);
        $rootScope.saveResult = true;
        $rootScope.calCustId = $state.params.customerId;
        if ($state.current.name == "onTapCalcualtor") {
          $state.params.recId = $rootScope.selectedRecId;
        }
        var calcData = calculatorCommonService.getCalcInputs($state.params.customerId, $state.params.recId);
        calcData.then(function(vals) {
          $log.debug('vals', vals);
          $log.debug(" $state.current.name************ :", $state.current.name);
          $log.debug('$state.params.customerId', $state.params.customerId);
          $log.debug('$state.params.recId', $state.params.recId);
          var data = JSON.parse(vals.Input);
          wealthCalculatorSetGetService.setSelectedData(data);
          var outData = JSON.parse(vals.Output);
          $scope.investmentData = outData.investmentData;
          $scope.netCorposBar = outData.netCorposBar;
        });
      }
      $scope.wData = wealthCalculatorSetGetService.getSelectedData();
      $scope.netCorposBar = {
        lumSumInvst: 0,
        netCorposBar: 0,
        mthlyInvst: 0,
        mthlyInvstGap: $scope.wData.investmentReqPerMnth,
        totalMthlyInvst: 0,
      };
      $scope.minInvstRange = true;
      $scope.minMonthRange = true;
      $scope.showNoteLumSum = false;
      $scope.showNoteCurrentMnth = false;
      $scope.extraInvstRange = false;
      $scope.extraInstAdd = true;
      $scope.extraInstMin = false;
      $scope.extraMonthRange = false;
      $scope.extraMonthAdd = true;
      $scope.extraMonthMin = false;
      $scope.investmentData = {
        currentLumInvst: "0",
        minLumInvst: "0",
        maxLumInvst: "5000000",
        minLumInvstExt: "5100000",
        maxLumInvstExt: "50000000",
        lumSumInvstRoR: "10",
        currentMnthInv: "0",
        minMnthInv: "0",
        maxMnthInv: "50000",
        minMnthExtrInv: "51000",
        maxMnthExtrInv: "500000",
        currentMnthRoR: "10",
        wealthGoal: $scope.wData.wealthGoal,
        investmentReqPerMnth: $scope.wData.investmentReqPerMnth
      };

      $scope.labels = [$scope.wData.currentAge, "", "", "", "", "", $scope.wData.fundReqAge];
      $scope.series = ['Age'];
      $scope.data = [
        [$scope.wData.investmentReqPerMnth, , , , , , $scope.wData.wealthGoal * 1000]
      ];

      $scope.doCalculateInvestment = function() {
        $state.go('app.enterInvestment');
      };

      $scope.lumSumAstCreated = function(invstData) {
        $scope.totalWealth = wealthCalculatorService.calcAssetCreated(invstData);
        $scope.netCorposBar.investmentReqPerMnth = $scope.totalWealth.revisedMnthReq;
        $scope.netCorposBar.wealthGoal = $scope.totalWealth.revisedFunds;
        /**Actuall Amt * 100/Total Amt**/
        $scope.netCorposBar.lumSumInvst = ($scope.totalWealth.lumSumInvst * 100) / ($scope.wData.wealthGoal);
        $scope.netCorposBar.mthlyInvst = ($scope.investmentData.currentMnthInv * 100 * 12) / ($scope.wData.wealthGoal);
        $scope.netCorposBar.mthlyInvstGap = $scope.totalWealth.revisedMnthGap;
        $scope.netCorposBar.totalMthlyInvst = $scope.totalWealth.mnthInvst;
        var corposGap = $scope.wData.wealthGoal - ($scope.totalWealth.lumSumInvst + $scope.netCorposBar.totalMthlyInvst);
        if (corposGap < 0) {
          $scope.corposGap = 0;
        } else {
          $scope.corposGap = corposGap;
        }
        $log.debug('$scope.totalWealth', $scope.totalWealth);
      };

      $scope.genBars = function(n) {
        var calPer = 0;
        if (n < 100) {
          calPer = (n / 100) * 30;
          if (calPer > 0 && calPer <= 1) {
            calPer = 1;
          }
        } else {
          calPer = 30;
        }
        return new Array(Math.round(calPer));
      };

      $scope.genMnthlyBars = function(n) {
        var calPer = 0;
        var calMnthPer = (n / $scope.wData.investmentReqPerMnth) * 100;
        calPer = (calMnthPer / 100) * 30;
        if (Math.round(calPer) > 30) {
          calPer = 30;
        } else {
          calPer = calPer;
        }
        if (calPer > 0) {
          return new Array(Math.round(calPer));
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

      $scope.addExtInvstRange = function() {
        $scope.minInvstRange = !$scope.minInvstRange;
        $scope.extraInvstRange = !$scope.extraInvstRange;
        $scope.extraInstAdd = !$scope.extraInstAdd;
        $scope.extraInstMin = !$scope.extraInstMin;
        if (!$scope.extraInstMin) {
          $scope.investmentData.currentLumInvst = "0";
        }
        if ($scope.extraInvstRange) {
          $scope.investmentData.currentLumInvst = "5100000";
        }
      };

      $scope.showExtraAddExtInvst = function() {
        if ($scope.investmentData.currentLumInvst > 5000000) {
          $scope.extraInvstRange = !$scope.extraInvstRange;
          $scope.extraInstAdd = !$scope.extraInstAdd;
          $scope.extraInstMin = !$scope.extraInstMin;
          $scope.minInvstRange = !$scope.minInvstRange;
        }
        if ($scope.investmentData.currentLumInvst < 5000000) {
          $scope.extraInvstRange = false;
          $scope.extraInstAdd = true;
          $scope.extraInstMin = false;
          $scope.minInvstRange = true;
        }
      };

      $scope.addExtrMonthRange = function() {
        $scope.minMonthRange = !$scope.minMonthRange;
        $scope.extraMonthRange = !$scope.extraMonthRange;
        $scope.extraMonthAdd = !$scope.extraMonthAdd;
        $scope.extraMonthMin = !$scope.extraMonthMin;
        if (!$scope.extraMonthMin) {
          $scope.investmentData.currentMnthInv = "0";
        }
        if ($scope.extraMonthRange) {
          $scope.investmentData.currentMnthInv = "51000";
        }
      };

      $scope.showExtraAddExtrMonthRange = function() {
        if ($scope.investmentData.currentMnthInv > 50000) {
          $scope.extraMonthRange = !$scope.extraMonthRange;
          $scope.extraMonthAdd = !$scope.extraMonthAdd;
          $scope.extraMonthMin = !$scope.extraMonthMin;
          $scope.minMonthRange = !$scope.minMonthRange;
        }
        if ($scope.investmentData.currentMnthInv < 50000) {
          $scope.extraMonthRange = false;
          $scope.extraMonthAdd = true;
          $scope.extraMonthMin = false;
          $scope.minMonthRange = true;
        }
      };

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

      $scope.backToSummary = function() {
        $state.go('app.switch');
      };

      $scope.showCalculatorPopup = function(PKSwitchCalculator) {
        $scope.showPlusPopup = !$scope.showPlusPopup;
      };

      function saveResult() {
        var calData = {};
        var calcResult = null;
        if (Object.keys($scope.netCorposBar).length) {
          calcResult = {
            investmentData: $scope.investmentData,
            netCorposBar: $scope.netCorposBar,
          };
        }

        calData.Cust_Id = $rootScope.calCustId;
        calData.Type = '2';
        calData.Input = JSON.stringify($scope.wData);
        calData.Output = JSON.stringify(calcResult);
        calData.IsActive = '1';
        $log.debug($scope.wData);
        calculatorCommonService.saveCalc(calData);
        $rootScope.saveResult = false;
      }

      $scope.$watch('wealth.years', function() {
        if ($rootScope.tabInclude) {
          if ($scope.wealth.currentAge > 25 && $scope.wealth.currentAge < 60 && $scope.wealth.years > 0 && $scope.wealth.years < 20 && $scope.wealth.rateOfRtrn > 0 && $scope.wealth.rateOfRtrn < 99) {
            var op = wealthCalculatorService.calcInvestmentRequired($scope.wealth);
            $scope.wData = wealthCalculatorSetGetService.getSelectedData();
          }
        }
      }, true);

      $scope.$watch('wealth.fundsRequired', function() {
        if ($rootScope.tabInclude) {

          if ($scope.wealth.currentAge > 25 && $scope.wealth.currentAge < 60 && $scope.wealth.years > 0 && $scope.wealth.years < 20 && $scope.wealth.rateOfRtrn > 0 && $scope.wealth.rateOfRtrn < 99) {
            var op = wealthCalculatorService.calcInvestmentRequired($scope.wealth);
            $scope.wData = wealthCalculatorSetGetService.getSelectedData();
          }
        }
      }, true);

      $scope.$watch('wealth.rateOfRtrn', function() {
        if ($rootScope.tabInclude) {
          if ($scope.wealth.currentAge > 25 && $scope.wealth.currentAge < 60 && $scope.wealth.years > 0 && $scope.wealth.years < 20 && $scope.wealth.rateOfRtrn > 0 && $scope.wealth.rateOfRtrn < 99) {
            var op = wealthCalculatorService.calcInvestmentRequired($scope.wealth);

            $scope.wData = wealthCalculatorSetGetService.getSelectedData();
          }
        }
      }, true);

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
              console.log('Device Memory : Confirmed!');
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

      $scope.email = function() {
        $log.debug("email");
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
  ]
);
