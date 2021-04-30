/******
@Author:Gitaram Kanawade
Date:17 August 2016
Controller for Monthly Advantage input
****/
switchModule.controller('monthlyAdvController', ['$scope',
    '$log',
    '$state',
    '$ionicPlatform',
    '$ionicNavBarDelegate',
    '$ionicHistory',
    '$cordovaToast',
    'eAppServices',
    'switchDataService',
    'mAValidationService',
    'fSCalculationService',
    '$http',
    '$filter',
    'mACalculationService',
    'commonFormulaSvc',
    function($scope, $log, $state, $ionicPlatform, $ionicNavBarDelegate, $ionicHistory, $cordovaToast, eAppServices, switchDataService, mAValidationService, fSCalculationService, $http, $filter, mACalculationService, commonFormulaSvc) {
        'use strict';
        var vm = this;
        var prodId = 15;
        var channelId = 1;
        /*Get validation messgae through json file.*/
        $http.get('js/switch/validationMessage.json').then(function(responce) {
            $scope.validationMessage = responce;
            $scope.ageOutofRange = $scope.validationMessage.data.oneToSixtyfive;
        });
        /*Title on header***/
        $scope.title = "Monthly Advantage";

        $scope.data = {};
        $scope.outputData = {};
        $scope.inputData = {};
        $scope.dbErrors = [];
        $scope.validationMessage = {};
        $scope.ageSecondSlider = false;

        /*****Object to show required UI on quote input page****/
        var params = {
            "ui_color": 'purple',
            "ui_gender": true,
            "ui_age": true,
            "ui_anualPreminum": true,
            "ui_modelPreminum": true,
            "ui_termExtra": {
                "label": "Monthly Income Period",
                "default": "12",
                "terms": {}
            },
            "ui_nsap": true,
            "ui_presence": true,
            "switch": true,
            "isAgeDoubleSlider": true,//If there are two slider for age in days and years
        };
        /***Default values****/
        $scope.inputData = {
            laAge: 35,
            ppt: "12",
            pt: "30",
            annualPremium: 50000,
            modalPremium: 26000,
            premiumMode: 1,
            laGender: 0,
            sumAssured: 0,
            basePremium: 0,
            inYour: 'PRESENCE',
            benefitPeriod: 12,
            NSAPForLA: false
        };

        /******Get PT and MPFACTOR ****/
        var returnObj = eAppServices.renderInputScreen(prodId, channelId, ["GENDER", "PMODE", "PPT"], ["PT", "MPFACTOR", "MIBPERIOD"])
            .then(function(result) {
                $scope.params = angular.copy(params);
                $scope.formData = result[0];
                /*Hiding the quartly mode in PPT*/
                $scope.formData.PMODE.splice(2, 1);
                /*Premium Payment Term*/
                $scope.formDataCalc = {
                    "PT": JSON.parse(result[1].PT),
                    "MPFACTOR": JSON.parse(result[1].MPFACTOR),
                };
                /****Calculate monthly income period***/
                $scope.params.ui_termExtra.terms = result[1].MIBPERIOD;
            });

        /****For default age min and max for product****/
        var defaultMinAge;
        var defaultMaxAge;
        eAppServices.getLaAge(prodId, channelId)
            .then(function(result) {
                /******Convert age years into days by multiplying 365days=~0.0027397260273973  factor***/
                result.MinAge = result.MinAge * 0.0027397260273973;
                result.MaxAge = result.MaxAge * 0.0027397260273973;
                /****age when in case of 0***/
                if (result.MinAge < 1)
                    result.MinAge = 1;
                /*****Convert fractional number into decimal**/
                $scope.data.laMinAge = $filter('number')(result.MinAge, 0);
                $scope.data.laMaxAge = $filter('number')(result.MaxAge, 0);
                defaultMinAge = $filter('number')(result.MinAge, 0);
                defaultMaxAge = $filter('number')(result.MaxAge, 0);
            });

        /*****get last enter data and prepopulate on screen ****/
        var quoteData = switchDataService.getQuoteData();
        if (angular.isUndefined(quoteData) || quoteData == null) {//if data is empty then it is from product page
            var customerData = switchDataService.getProfileData($state.params.customerId);
            customerData.then(function(custData) {
                var gender = custData.Gender;
                $scope.inputData.laGender = gender;
                var ageCheck = custData.Age;
                if (ageCheck >= 1 && ageCheck <= 65) {
                    $scope.inputData.laAge = ageCheck;
                } else {
                    $scope.inputData.laAge = 35;
                    $scope.AgeOutofRange = false;
                    if (!isWeb) {
                        $cordovaToast
                            .show("" + $scope.ageOutofRange, 'long', 'bottom')
                            .then(function(success) {
                                // success
                            }, function(error) {
                                // error
                            });
                    } else {
                        $scope.AgeOutofRange = true;
                    }
                }
            });
        } else {/****If click on back button from PI page or click on input on PI page***/
            $scope.inputData.laGender = quoteData.laGender;
            $scope.inputData.laAge = quoteData.laAge;
            $scope.inputData.ppt = quoteData.ppt;
            $scope.inputData.pt = quoteData.pt;
            $scope.inputData.annualPremium = quoteData.annualPremium;
            $scope.inputData.modalPremium = quoteData.modalPremium;
            $scope.inputData.premiumMode = quoteData.premiumMode;
            $scope.inputData.benefitPeriod = quoteData.benefitPeriod;
            $scope.inputData.basePremium = quoteData.basePremium;
            $scope.ageSecondSlider = quoteData.ageSecondSlider;
            if ($scope.ageSecondSlider) {
                $scope.showDbErrors = false;
                $scope.inputData.laAge = quoteData.laDays;
                $scope.currentAgeValue = quoteData.laDays;
                $scope.showDbErrors = false;
            }
            $scope.data.laMinAge = quoteData.laMinAge;
            $scope.data.laMaxAge = quoteData.laMaxAge;
            if (quoteData.hasOwnProperty('NSAPForLA'));
            $scope.inputData.NSAPForLA = quoteData.NSAPForLA;
            if (quoteData.hasOwnProperty('inYour'));
            $scope.inputData.inYour = quoteData.inYour;
        }
        /*****Toggle the slider for age in days and years****/
        $scope.toggle = function() {
                $scope.ageSecondSlider = !$scope.ageSecondSlider;
                if ($scope.ageSecondSlider) {
                    $scope.showDbErrors = false;
                    $scope.currentAgeValue = 91;
                    $scope.inputData.laAge = 91;
                    $scope.data.laMinAge = 91;
                    $scope.data.laMaxAge = 364;
                } else {
                    $scope.showDbErrors = false;
                    $scope.currentAgeValue = 35;
                    $scope.inputData.laAge = 35;
                    $scope.data.laMinAge = defaultMinAge;
                    $scope.data.laMaxAge = defaultMaxAge;
                }
            }
        /*Based on base premium entered set sumassured value*/
        $scope.populateSumAssured = function() {
            $scope.inputData.basePremium = $scope.inputData.annualPremium;
            if ($scope.inputData.basePremium !== undefined) {
                mACalculationService.calcMASumAssured(prodId, channelId, $scope.inputData)
                    .then(function(val) {
                        $scope.inputData.sumAssured = commonFormulaSvc.round(val, 0);
                    });
            }
        };
        $scope.populateSumAssured();
        /*****When click on calculate button****/
        $scope.calculate = function(inputData) {
            //** Calculation **//
            var monthlyAdvData = {};
            var age;
            /*****Object require for calculations***/
            monthlyAdvData = {
                NSAPForLA: inputData.NSAPForLA,
                isSA: true,
                laGender: parseInt(inputData.laGender),
                ppt: parseInt(inputData.ppt),
                pt: inputData.pt,
                sumAssured: inputData.sumAssured,
                premiumMode: inputData.premiumMode,
                basePremium: inputData.annualPremium,
                modalPremium: inputData.modalPremium,

            };

            if (inputData.laAge >= 91 && inputData.laAge <= 364) {/*****If age is in days**/
                /****when age in days*****/
                monthlyAdvData.laAgeDays = parseInt(inputData.laAge);
                monthlyAdvData.laAge = 0;
            } else
            if (inputData.laAge >= 1 && inputData.laAge <= 65) { /****when age in years*****/
                monthlyAdvData.laAge = parseInt(inputData.laAge);
            }
            /****Call DB validation as per input quote****/
            mAValidationService.validateBaseProduct(prodId, channelId, monthlyAdvData)
                .then(function(messages) {
                    $scope.dbErrors = {};
                    if (messages.length === 0) {/***If no error from DB***/
                        $scope.dbError = "";
                        $scope.showDbErrors = false;
                        inputData.ageSecondSlider = $scope.ageSecondSlider;
                        inputData.laMinAge = $scope.data.laMinAge;
                        inputData.laMaxAge = $scope.data.laMaxAge;
                        switchDataService.setQuoteData(inputData);
                        var calculatedData = mACalculationService.calculateMATotalPremium(prodId, channelId, monthlyAdvData);
                        calculatedData.then(function(calcPremiumResult) {
                            var getCalculation = mACalculationService.calculateMABI(prodId, channelId, monthlyAdvData, calcPremiumResult);
                            getCalculation.then(function(sCalcResult) {
                                /**Calculate the sum of guranted till maturity ****/
                                var sumAssured = 0;
                                var absenceA = 0;
                                /***sume assured sumofBenefits ****/
                                for (var i = 0; i < sCalcResult.gSB.length; i++) {
                                    if (angular.isNumber(sCalcResult.gSB[i]))
                                        sumAssured = sumAssured + sCalcResult.gSB[i];
                                }
                                /*******In case of absence Sum of Guaranteed Monthly Income received, till loss of life *******/
                                for (var i = 0; i < sCalcResult.gSB.length - 3; i++) {
                                    if (angular.isNumber(sCalcResult.gSB[i]))
                                        absenceA = absenceA + sCalcResult.gSB[i];
                                }
                                /***PI calculation in presence and absence*****/
                                var MAPiData = {
                                    sumAssured: sumAssured,
                                    nonguaranteedBenefitAtMaturity: sCalcResult.nMB8[sCalcResult.nMB8.length - 1],
                                    sumofBenefits: sumAssured + sCalcResult.nMB8[sCalcResult.nMB8.length - 1],
                                    survivalBenefit: sCalcResult.gSB[sCalcResult.gSB.length - 1],
                                    totalModalPremium: calcPremiumResult.totalModalPremium,
                                    absenceA: absenceA,
                                    absenceB: sCalcResult.accuredAt8[sCalcResult.accuredAt8.length - 4],
                                    absenceC: sCalcResult.gDB[sCalcResult.gDB.length - 3],
                                };
                                /****Set data to service to get in PI page****/
                                switchDataService.setQuotecalculatedData(MAPiData);
                                $state.go('app.monthlyAdvantagePi', {
                                    customerId: $state.params.customerId,
                                    recId: null
                                });
                            });
                        });
                    } else {/******If any DB error**/
                        $scope.showDbErrors = true;
                        $scope.dbErrors = [];
                        for (var e = 0; e < messages[0].length; e++) {
                            $scope.dbErrors.push(messages[0][e]);
                        }
                    }
                });
        };

        /*Animation Code*/
        $scope.animateClass = animateNgClass('bounceInUp', 'animationduration25');

        /**back routing ***/
        $scope.goBack = function() {
            if ($state.current.name == 'app.FlexiSaveQuoteInput') {
                $state.go("app.productRecommendation", {
                    customerId: $state.params.customerId,
                });
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
