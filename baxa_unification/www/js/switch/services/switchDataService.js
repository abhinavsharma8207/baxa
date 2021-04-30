switchModule.service('switchDataService', ['$log',
  '$q',
  '$http',
  'utilityService',
  'commonDBFuncSvc',
  'switchDbService',
  'pceHomeDbService',
  function($log, $q, $http, utilityService, commonDBFuncSvc, switchDbService, pceHomeDbService) {
    'use strict';
    var vm = this;
    vm.getProfileData = getProfileData;
    vm.insertData = insertData;
    vm.getData = getData;
    vm.setProfileData = setProfileData;
    vm.customerDetails = null;
    vm.updatedata = updatedata;
    vm.lifeStageData = lifeStageData;
    vm.updatedataLifeStage = updatedataLifeStage;
    //vm.upDatedCustIdData = upDatedCustIdData;
    vm.getCalculatorData = getCalculatorData;
    vm.deleteCalData = deleteCalData;
    vm.getCalcTotal = getCalcTotal;
    vm.updateLifeStageData = updateLifeStageData;
    vm.updateLifeStageStepsCompleted = updateLifeStageStepsCompleted;
    vm.getMode = getMode;
    vm.getProductRecommmendationList = getProductRecommmendationList;
    vm.deletePiSummary = deletePiSummary;

    vm.getImage = getImage;

    vm.getCustomerPiSummary = getCustomerPiSummary;
    vm.getProductList = getProductList;
    vm.getPi = getPi;
    vm.setProductData = setProductData;
    vm.getProductData = getProductData;

    vm.saveDataPi = saveDataPi;

    var productData;

    /*****common getter and setter for switch app****/
    vm.setQuotecalculatedData = setQuotecalculatedData;
    vm.getQuotecalculatedData = getQuotecalculatedData;
    // save functions
    vm.setCommonData = setCommonData;
    vm.getCommonData = getCommonData;
    vm.getQuoteData = getQuoteData;
    vm.setQuoteData = setQuoteData;
    vm.getCoins = getCoins;
    var commonData;
    var quoteData;
    var calculatedData;


    function insertData(profileData) {
      var q = $q.defer();
      var customerData = switchDbService.createSwitchTable(profileData);
      customerData.then(function(custDetails) {
        $log.debug('customerData', custDetails);
        // vm.customerDetails = custDetails.rows[0];
        q.resolve(custDetails);
      });
      return q.promise;

    }

    function getData() {
      var custDetails = switchDbService.getCustomerDetails();
      $log.debug('the data in the customer details', custDetails);
      return custDetails;
    }

    function getCalculatorData(type, custId) {
      var calculatorDetails = switchDbService.getCalculatorSummary(type, custId);
      $log.debug('getCalculatorDetails details', calculatorDetails);
      return calculatorDetails;
    }

    function lifeStageData(age) {
      var myActiveSlide;
      if (age < 27) {
        myActiveSlide = 0;
      }
      if (age >= 27 && age < 30) {
        myActiveSlide = 1;
      }
      if (age >= 30 && age < 45) {
        myActiveSlide = 2;
      }
      if (age >= 45 && age < 55) {
        myActiveSlide = 3;
      }
      if (age >= 55) {
        myActiveSlide = 4;
      }
      return myActiveSlide;
    }

    function updatedata(data, id, compSteps1) {
      switchDbService.updatepro(data, id, compSteps1);
    }

    function updateLifeStageData(data, id, compSteps) {
      switchDbService.updateLifeStage(data, id, compSteps);
    }

    function updateLifeStageStepsCompleted(id, compSteps) {
      switchDbService.updateLifeStageCompleted(id, compSteps);
    }

    function updatedataLifeStage(id, compSteps) {
      switchDbService.updateLifeStageCompletedInNeed(id, compSteps);
    }

    function deleteCalData(PKSwitchCalculator) {
      var q = $q.defer();
      var deleteData = switchDbService.deleteCalculatorDetails(PKSwitchCalculator);
      deleteData.then(function(PKSwitchCalculator) {
        $log.debug('PKSwitchCalculator', PKSwitchCalculator);
        q.resolve(PKSwitchCalculator);
      });
      return q.promise;
    }

    function getProfileData(custId) {
      $log.debug("getProfileData : custId +++++++++++++ ", custId);
      var q = $q.defer();
      var profileData = switchDbService.getCustProfileByCustId(custId);
      profileData.then(function(profileDetails) {
        $log.debug('profileDetails', profileDetails);
        q.resolve(profileDetails);
      });
      return q.promise;
    }

    function setProfileData(data) {
      return vm.customerDetails = data;
    }

    function getCalcTotal(type, custId) {
      var q = $q.defer();
      var count = switchDbService.getCalcCount(type, custId);
      count.then(function(val) {
        q.resolve(val);
      });
      return q.promise;
    }

    function getMode(mode) {
      var mode;
      if (mode == 1) {
        mode = 'Annual';
      }
      if (mode == 2) {
        mode = 'Half Yearly';
      }
      if (mode == 12) {
        mode = 'Monthly';
      }
      return mode;
    }

    function getImage(age) {
      var userAge;
      if (age <= 35) {
        userAge = 25;
      }
      if (age >= 36 && age <= 50) {
        userAge = 35;
      }
      if (age >= 51 && age <= 70) {
        userAge = 50;
      }
      if (age > 70) {
        userAge = 70;
      }
      return userAge;
    }


    function getCustomerPiSummary(custId) {
      $log.debug('custId', custId);
      var q = $q.defer();
      var products = getProductList();
      var productPi = [];

      products.then(function(productList) {
        angular.forEach(productList, function(items) {
          var piSummary = switchDbService.getPiSummary(items.FkProductId, custId);
          piSummary.then(function(val) {
            items.pi = val;
            items.count = val.length;
          });
          productPi.push(items);
        }, productPi);
        q.resolve(productPi);
      });
      return q.promise;
    }

    function getProductList() {
      var q = $q.defer();

      var channelId = 1;
      var productsList = pceHomeDbService.getAllProductsByChannelId(channelId);
      productsList.then(function(products) {
        q.resolve(products);
      });
      return q.promise;
    }

    function getPi(recId) {
      var parameters = [recId];
      return commonDBFuncSvc.query("SELECT * FROM SwitchProductIllustration WHERE PKSwitchPI = ? ", parameters).then(function(result) {
        var getPiDetails = [];
        getPiDetails = commonDBFuncSvc.getAll(result);
        return getPiDetails[0];
      });

    }

    function getProductRecommmendationList(channelId, calcId) {
      var q = $q.defer();

      var productRecommendations = [];
      var proDetails = [];
      //www/js/switch/productExplanation.json
      $http.get('js/switch/productExplanation.json').then(function(responce) {
        var productExplanation = responce.data[0];
        productRecommendations = switchDbService.getProductRecommmendations(channelId, calcId);
        productRecommendations.then(function(prodVals) {
          //$log.debug('prodVals',prodVals);
          angular.forEach(prodVals, function(prodItem) {
            //$log.debug('prodItem',prodItem);
            prodItem.title = prodItem.Name;
            prodItem.details = productExplanation[prodItem.FkProductId];

            //piItems.annualPremium = parseOp.basePremium;
            proDetails.push(prodItem);
          }, proDetails);
          //$log.debug('productRecommendations',proDetails);
          q.resolve(proDetails);

        });

      });
      return q.promise;
    }

    function deletePiSummary(custId, recId) {
      switchDbService.deletePi(custId, recId);
    }

    /***
        common functions for setter and getter
    */
    function setQuotecalculatedData(data) {
      calculatedData = data;
    }

    function getQuotecalculatedData() {
      return calculatedData;
    }

    function setCommonData(data) {
      commonData = data;
    }

    function getCommonData() {
      return commonData;
    }

    function setQuoteData(data) {
      quoteData = data;
    }

    function getQuoteData() {
      return quoteData;
    }


    function saveDataPi(data) {
      switchDbService.savePI(data);
    }

    /*Product Info Setter and Getter Methods*/
    function setProductData(data) {
      productData = data;
    }

    function getProductData() {
      return productData;
    }

    /****get number  coins***/
    function getCoins(num) {
      var coins = parseInt(num);
      return new Array(coins);
    }
  }
]);
