/******
@Author:Gitaram Kanawade
Date:22 august 2016
Controller for Monthly Advantage product illustration
Back button functuions
****/
switchModule.controller('MAPiController', ['$scope',
    '$rootScope',
    '$log',
    '$state',
    '$ionicPlatform',
    '$ionicNavBarDelegate',
    '$ionicHistory',
    '$cordovaFile',
    '$ionicModal',
    'common_const',
    'utilityService',
    'switchDataService',
    'eAppServices',
    'getSetCommonDataService',
    'pceHomeDataService',
    'quoteProposalNosDataService',
    'commonFileFunctionFactory',
    function($scope, $rootScope, $log, $state, $ionicPlatform, $ionicNavBarDelegate, $ionicHistory, $cordovaFile, $ionicModal, common_const, utilityService, switchDataService, eAppServices, getSetCommonDataService, pceHomeDataService, quoteProposalNosDataService, commonFileFunctionFactory) {
        'use strict';
        /****Initialise variable**/
        $scope.custId = $state.params.customerId;
        $scope.stepsCompleted = 1;
        $scope.MAPiData = null;
        $scope.saveResult = true;
        $scope.isIllustrationsSelected = true;

        /***When click on proceed to form first name and ***/
        var MAPi = switchDataService.getProfileData($state.params.customerId);
        MAPi.then(function(data) {
            $scope.MAPiData = data;
            $scope.stepsCompleted = $scope.MAPiData.StepCompleted;
        });
        /******Get all require data***/
        if ($state.params.recId > 0) { /**if user is from Summary page to PI**/
            var piSummaryData = switchDataService.getPi($state.params.recId);
            piSummaryData.then(function(piDetails) {
                switchDataService.setQuoteData(JSON.parse(piDetails.Input));
                var getDbOutput = JSON.parse(piDetails.Output);
                switchDataService.setQuotecalculatedData(getDbOutput);
                var data = switchDataService.getQuoteData();
                $scope.MAQuoteData = data;
                $scope.Gender = $scope.MAQuoteData.laGender;
                if ($scope.MAQuoteData.laAge > 65) {
                    $scope.MAQuoteData.laDays = $scope.MAQuoteData.laAge;
                    $scope.MAQuoteData.laAge = 0;
                }
                $scope.lifeAssuredAgeMaturity = parseInt($scope.MAQuoteData.laAge) + parseInt($scope.MAQuoteData.pt);
                $scope.insuredlifeAge = parseInt($scope.MAQuoteData.laAge) + parseInt($scope.MAQuoteData.ppt);
                $scope.userCurrentImg = switchDataService.getImage($scope.MAQuoteData.laAge);
                $scope.premiumMode = switchDataService.getMode($scope.MAQuoteData.premiumMode);
                $scope.userFutureImg = switchDataService.getImage($scope.lifeAssuredAgeMaturity);

                var calculatedData = switchDataService.getQuotecalculatedData();
                $scope.totalModalPremium = calculatedData.totalModalPremium;
                $scope.sumAssured = calculatedData.sumAssured;
                $scope.nonguaranteedBenefitAtMaturity = calculatedData.nonguaranteedBenefitAtMaturity;
                $scope.sumOfBenefits = calculatedData.sumofBenefits;
                $scope.survivalBenefit = calculatedData.survivalBenefit / 12;
                $scope.payoutPeriodNextMonth = $scope.MAQuoteData.ppt * 12;
                /*********In case of absence calculations**********/
                $scope.absenceA = calculatedData.absenceA;
                $scope.absenceB = calculatedData.absenceB;
                $scope.absenceC = calculatedData.absenceC;
                /****Get number of coins according to ppt***/
                $scope.coinsCount = switchDataService.getCoins(data.ppt);
                /*****in case of absence***/
                $scope.lifeAssuredAgeDeath = parseInt($scope.MAQuoteData.laAge) + parseInt($scope.MAQuoteData.pt) - 2;
                $scope.endOfPayouts = parseInt($scope.lifeAssuredAgeDeath) + parseInt($scope.MAQuoteData.ppt);
                $scope.moDeadBenefit = Math.ceil(parseInt($scope.absenceC) / (12 * parseInt($scope.MAQuoteData.ppt)));
            });
        } else { /**if user is from Quote input  page to PI**/
            var data = switchDataService.getQuoteData();
            $scope.MAQuoteData = data;
            $scope.Gender = $scope.MAQuoteData.laGender;
            if ($scope.MAQuoteData.laAge > 65) {
                $scope.MAQuoteData.laDays = $scope.MAQuoteData.laAge;
                $scope.MAQuoteData.laAge = 0;
            }
            $scope.lifeAssuredAgeMaturity = parseInt($scope.MAQuoteData.laAge) + parseInt($scope.MAQuoteData.pt);
            $scope.insuredlifeAge = parseInt($scope.MAQuoteData.laAge) + parseInt($scope.MAQuoteData.ppt);
            $scope.userCurrentImg = switchDataService.getImage($scope.MAQuoteData.laAge);
            $scope.premiumMode = switchDataService.getMode($scope.MAQuoteData.premiumMode);
            $scope.userFutureImg = switchDataService.getImage($scope.lifeAssuredAgeMaturity);
            /*****Ge calculated from quote****/
            var calculatedData = switchDataService.getQuotecalculatedData();
            $scope.totalModalPremium = calculatedData.totalModalPremium;
            $scope.sumAssured = calculatedData.sumAssured;
            $scope.nonguaranteedBenefitAtMaturity = calculatedData.nonguaranteedBenefitAtMaturity;
            $scope.sumOfBenefits = calculatedData.sumofBenefits;
            $scope.survivalBenefit = calculatedData.survivalBenefit / 12;
            $scope.payoutPeriodNextMonth = $scope.MAQuoteData.ppt * 12;
            /*********In case of absence calculations**********/
            $scope.absenceA = calculatedData.absenceA;
            $scope.absenceB = calculatedData.absenceB;
            $scope.absenceC = calculatedData.absenceC;
            /****Get number of coins according to ppt***/
            $scope.coinsCount = switchDataService.getCoins(data.ppt);
            /*****in case of absence***/
            $scope.lifeAssuredAgeDeath = parseInt($scope.MAQuoteData.laAge) + parseInt($scope.MAQuoteData.pt) - 2;
            $scope.endOfPayouts = parseInt($scope.lifeAssuredAgeDeath) + parseInt($scope.MAQuoteData.ppt);
            $scope.moDeadBenefit = Math.ceil(parseInt($scope.absenceC) / (12 * parseInt($scope.MAQuoteData.ppt)));
        }
        /*****show the coins***/
        $scope.showCoin = function() {
            $scope.showCoins = !$scope.showCoins;
            $scope.expnGreen = false;
        };
        /***When click in green bar then show two green colors**/
        $scope.expandGreen = function() {
            $scope.expnGreen = !$scope.expnGreen;
            $scope.showCoins = false;
        };
        /*****Close Assumption popup***/
        $scope.hideAssumtionPopup = function() {
            $scope.showAssumtionPopup = false;
        };
        /*****Close Assumption popup***/
        $scope.showAssumtion = function() {
            $scope.showAssumtionPopup = true;
        };
        /*******When click on Floating button******/
        $scope.showCalculatorPopup = function(PKSwitchCalculator) {
            $scope.showPlusPopup = !$scope.showPlusPopup;
        };
        /*Animation Code*/
        $scope.setNowAnimate = function() {
                setAnimate($ionicHistory);
            }
            /*****When user click on back to product******/
        $scope.backToProduct = function() {
            var getCalData = {};
            var MAQuoteData = switchDataService.getQuoteData();
            /******get calculated data***/
            getCalData = switchDataService.getQuotecalculatedData();
            var biData = switchDataService.getCommonData()
            var piData = {
                custId: $state.params.customerId,
                productId: common_const.ProductId_MonthlyAdv,
                input: JSON.stringify(MAQuoteData),
                output: JSON.stringify(getCalData),
                deathBenefitInAbsense: $scope.deathBenefitInAbsense,
                annualPremium: getCalData.totalModalPremium,
                isActive: 1
            };
            switchDataService.saveDataPi(piData);
            $state.go('app.productRecommendation', {
                customerId: $state.params.customerId, //Redirerct to to Product page
            });
        };
        /*****When user click on proceed to form filling***/
        $scope.goToEapp = function() {
            var MAQuoteData = switchDataService.getQuoteData();
            var getCalData = {};
            getCalData = switchDataService.getQuotecalculatedData();
            /*Setting data for Eapp*/
            var userData = getSetCommonDataService.getCommonData();
            var selProductData = switchDataService.getProductData();
            pceHomeDataService.getRiderDetails(selProductData.FkProductId).then(function(ridersData) {
                var prodData = {
                    prodId: selProductData.FkProductId,
                    prodLbl: selProductData.Label,
                    prodUIN: selProductData.UIN,
                    ridersData: ridersData
                };
                getSetCommonDataService.setCurrentProdData(prodData);
                $rootScope.selectedProductIdForCalculation = selProductData.FkProductId;
                var piData = {
                    custId: $state.params.customerId,
                    productId: common_const.ProductId_MonthlyAdv,
                    input: JSON.stringify(MAQuoteData),
                    output: JSON.stringify(getCalData),
                    annualPremium: getCalData.totalModalPremium,
                    isActive: 1
                };
                switchDataService.saveDataPi(piData);
                quoteProposalNosDataService.resetTempBiJsonTbl();
                /*Setting data for Eapp*/
                var buyingForData = {
                    liFirstName: $scope.MAPiData.FirstName,
                    liLastName: $scope.MAPiData.LastName,
                    laGender: $scope.Gender,
                    BuyingFor: 'Self'
                };
                eAppServices.setBuyForDetails(buyingForData);
                var quoteInputData = {
                    laGender: $scope.Gender,
                    laAge: $scope.MAQuoteData.laAge,
                    pt: $scope.MAQuoteData.pt,
                    ppt: $scope.MAQuoteData.ppt,
                    sumAssured: getCalData.sumAssured,
                    annualPremium: getCalData.totalModalPremium,
                    premiumMode: $scope.MAQuoteData.premiumMode
                };
                eAppServices.setInputDetails(quoteInputData);
                $state.go('app.monthlyAdvantage-LAAndProposer', {
                    customerId: $state.params.customerId, //Redirerct to to Eapp
                });
            });
        };


        $scope.email = function() {
            $scope.showPlusPopup = false;
            $scope.showSendEmailPopup = true;
        };

        $scope.hidesendEmailPopup = function() {
            $scope.showPlusPopup = true;
            $scope.showSendEmailPopup = false;
        };

        /*Funtion for send email and store email details in emailData*/

        $scope.sendEmailPopupOnOk = function() {
            $scope.isValidateEmailTo = false;
            $scope.isValidateEmailCc = false;
            var emailTo = $scope.email_To;
            var inputData = {
                emailTo: $scope.email_To,
                emailCc: $scope.email_Cc,
                isBrochureSelected: $scope.isBrochureSelected,
                isIllustrationsSelected: $scope.isIllustrationsSelected
            };

            utilityService.getEmailData(inputData).then(function(emailData) {

            }, function(errorMsg) {
                if (errorMsg == "emailTo") {
                    $scope.isValidateEmailTo = true;
                }
                if (errorMsg == "emailCc") {
                    $scope.isValidateEmailCc = true;
                }
            });

        };
        /**back routing on mobile devices and Tab***/
        // $scope.goBack=function(){
        //   if ($state.current.name == 'app.switchFlexiSavePi') {
        //       $state.go("app.FlexiSaveQuoteInput");
        //   } else {
        //     $ionicHistory.goBack();
        //   }
        // };
        // if (ionic.Platform.isAndroid() || ionic.Platform.isWebView()) { 
        //   $ionicNavBarDelegate.showBackButton(false);
        // } else {
        //   $ionicNavBarDelegate.showBackButton(true);
        // }
        // /*When back button of Mobile device is clicked***/
        // $ionicPlatform.registerBackButtonAction(function() {
        //   $scope.goBack();
        // }, 100);

        /*floating Buttion Start*/
        $scope.cameraFun = function() {
            var imagePath = "MyDocuments/Switch/" + $scope.custId + "/Images";
            $cordovaFile.getFreeDiskSpace().then(function(success) {
                var exists = commonFileFunctionFactory.checkDir(cordova.file.externalApplicationStorageDirectory, imagePath);
                if (!exists) {
                    commonFileFunctionFactory.createDir(cordova.file.externalApplicationStorageDirectory, imagePath,
                        function(sucess) {
                            commonFileFunctionFactory.savePicture(cordova.file.externalApplicationStorageDirectory + imagePath,
                                function(succ) {},
                                function(err) {}
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
            var notePath = "MyDocuments/Switch/" + $scope.custId + "/Notes";
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
            $scope.showPlusPopup = false;
            $scope.showSendEmailPopup = true;
        };

        $scope.hidesendEmailPopup = function() {
            $scope.showPlusPopup = true;
            $scope.showSendEmailPopup = false;
        };

        /*Funtion for send email and store email details in emailData*/

        $scope.sendEmailPopupOnOk = function() {
            $scope.isValidateEmailTo = false;
            $scope.isValidateEmailCc = false;
            var emailTo = $scope.email_To;
            var inputData = {
                emailTo: $scope.email_To,
                emailCc: $scope.email_Cc,
                isBrochureSelected: $scope.isBrochureSelected,
                isIllustrationsSelected: $scope.isIllustrationsSelected
            };

            utilityService.getEmailData(inputData).then(function(emailData) {
                $log.debug("emailData", emailData);
                trippleHealthObjectServicePi.tHSendMail(emailData).then(function() {
                    $scope.hidesendEmailPopup();
                    $scope.showPlusPopup = false;
                });
            }, function(errorMsg) {
                if (errorMsg == "emailTo") {
                    $scope.isValidateEmailTo = true;
                }
                if (errorMsg == "emailCc") {
                    $scope.isValidateEmailCc = true;
                }
            });
        };
        $scope.brochure = function() {};
        /*floating Buttion Start*/


    }
]);
