/**
 * Service for common database functions
 */
unificationBAXA.service('commonDBFuncSvc', [
  '$q',
  '$log',
  '$ionicPlatform',
  '$ionicLoading',
  '$cordovaSQLite',
  'utilityService',
  'apiUrl',
  function($q, $log, $ionicPlatform, $ionicLoading, $cordovaSQLite, utilityService, apiUrl) {
    'use strict';
    var vm = this;
    vm.query = query;
    vm.getAll = getAll;
    vm.getById = getById;
    vm.getCount = getCount;
    vm.getQuotes = getQuotes;
    vm.getParamValue = getParamValue;
    vm.getParamDynamicValue = getParamDynamicValue;
    vm.isInRange = isInRange;
    vm.processRequiredDataForSync = processRequiredDataForSync;
    vm.createClientDbTables = createClientDbTables;
    vm.getParamValueForFutureInvest = getParamValueForFutureInvest;
    vm.getHlProductCode = getHlProductCode;
    vm.getBandSS = getBandSS;
    vm.getAgeValidationData = getAgeValidationData;
    vm.getParamValueByArray = getParamValueByArray;
    vm.getParamValueName = getParamValueName;
    vm.getAllMapedFunds = getAllMapedFunds;
    vm.initiateSync = initiateSync;
    vm.getProductRiders = getProductRiders;


    function initiateSync() {
      var q = $q.defer();
      var isFirstTime = localStorage.getItem('isFirstTime');
      if (isFirstTime == null) {
        localStorage.setItem('isFirstTime', 1);
        isFirstTime = 1;
        $log.debug('User Login to application First Time');
      }
      $('#sync')
        .gsync({
          user_name: localStorage.getItem("userName"),
          mpwd: localStorage.getItem("mPwd"),
          pwd: localStorage.getItem("mPwd"),
          max_db_size: 2 * 1024 * 1024,
          base_url: apiUrl + 'gsync.jsp',
          upld_url: apiUrl + 'gupld.jsp',
          AI: '1.0',
          /**your app info version**/
          D4S: '',
          on_complete: sync_done,
          on_notify: notify,
          verbose: false,
          _myDB: db
        });

      if (isFirstTime == 0) {
        vm.processRequiredDataForSync().then(function(val) {
          $.fn.gsync.start_sync();
        });
      } else {
        vm.createClientDbTables().then(function(val) {
          $.fn.gsync.start_sync();
        });
      }
      function sync_done(success, msg) {
        $log.debug("sync done successfully");
        localStorage.setItem('isFirstTime', 0);
        isFirstTime = 0;
        q.resolve(true);
      }
      function notify(stage, msg) {
        $log.debug(stage + ' => ' + msg);
      }
      return q.promise;
    }
    /**generic function query execution and returning the result**/
    function query(query, parameters) {
      $log.debug("query ::" + query);
      $log.debug("parameters ::" + parameters);

      parameters = parameters || [];
      var q = $q.defer();
      $ionicPlatform.ready(function() {
        $cordovaSQLite.execute(db, query, parameters)
          .then(function(result) {
              q.resolve(result);
            },
            function(error) {
              $log.warn('I found an error');
              $log.warn(error);
              q.reject(error);
            });
      });
      return q.promise;
    }

    /** Proces a result set**/
    function getAll(result) {
      var output = [];
      for (var i = 0; i < result.rows.length; i++) {
        output.push(result.rows.item(i));
      }
      return output;
    }

    /** Proces a single result**/
    function getById(result) {
      var output = null;
      output = angular.copy(result.rows.item(0));
      return output;
    }

    function getCount(result) {
      var _count = result.rows.length;
      return _count;
    }
    /**return parameter value from PceMstParameter tbl**/
    function getParamValueByArray(FkProductId, FkChannelId, params) {
      var _currentDate = utilityService.getDisplayDate(new Date(), "yyyy-MM-dd HH:mm:ss");
      var inVars = "";
      for (var x = 0; x < params.length; x++) {
        inVars += (inVars === "") ? ('"' + params[x] + '"') : (',"' + params[x] + '"');
      }
      var parameters = ["" + FkProductId, "" + FkChannelId, "" + 1, _currentDate];
      $log.debug('parameters', parameters);
      var queryStr =
        "SELECT Name, ParamValue FROM PceMstParameter AS parameter WHERE FkProductId=? AND FkChannelId=? AND Name IN (" + inVars + ") AND IsActive=?" +
        " AND ? BETWEEN " +
        "strftime('%Y-%m-%d %H:%M:%S',substr(parameter.StartDate,7,4) || '-' || " +
        "substr(parameter.StartDate,1,2) || '-' || " +
        "substr(parameter.StartDate,4,2) || substr(parameter.StartDate, 11,9))" +
        " AND " +
        "strftime('%Y-%m-%d %H:%M:%S',substr(parameter.EndDate,7,4) || '-' || " +
        "substr(parameter.EndDate,1,2) || '-' || " +
        "substr(parameter.EndDate,4,2) || substr(parameter.EndDate, 11,9))";
      return vm
        .query(queryStr, parameters)
        .then(function(result) {
          var paramValueResult = [];
          paramValueResult = vm.getAll(result);

          var newArr  = [];
          for (var s = 0; s < params.length; s++) {
            for (var props in paramValueResult) {
              if (paramValueResult.hasOwnProperty(props) && paramValueResult[props].Name == params[s]) {
                newArr[params[s]] = paramValueResult[props].ParamValue;
              }
            }
          }
          return newArr;
        });
    }

    function getParamValue(FkProductId, FkChannelId, paramName) {
      var _currentDate = utilityService.getDisplayDate(new Date(), "yyyy-MM-dd HH:mm:ss");
      var parameters = ["" + FkProductId, "" + FkChannelId, "" + paramName, "" + 1, _currentDate];
      $log.debug('parameters', parameters);
      var queryStr =
        "SELECT ParamValue FROM PceMstParameter AS parameter WHERE FkProductId=? AND FkChannelId=? AND Name=? AND IsActive=?" +
        " AND ? BETWEEN " +
        "strftime('%Y-%m-%d %H:%M:%S',substr(parameter.StartDate,7,4) || '-' || " +
        "substr(parameter.StartDate,1,2) || '-' || " +
        "substr(parameter.StartDate,4,2) || substr(parameter.StartDate, 11,9))" +
        " AND " +
        "strftime('%Y-%m-%d %H:%M:%S',substr(parameter.EndDate,7,4) || '-' || " +
        "substr(parameter.EndDate,1,2) || '-' || " +
        "substr(parameter.EndDate,4,2) || substr(parameter.EndDate, 11,9))";
      return vm
        .query(queryStr, parameters)
        .then(function(result) {
          var paramValueResult = vm.getById(result);
          var paramValue = paramValueResult.ParamValue;
          return paramValue;
        });
    }

    /**return parameter value from PceMstParameter tbl**/
    function getParamValueName(FkProductId, FkChannelId, paramName) {
      var _currentDate = utilityService.getDisplayDate(new Date(), "yyyy-MM-dd HH:mm:ss");
      var parameters = ["" + FkProductId, "" + FkChannelId, "" + paramName, "" + 1, _currentDate];
      $log.debug('parameters.length', parameters);
      var queryStr =
        "SELECT ParamValue,ParamColumn FROM PceMstParameter AS parameter WHERE FkProductId=? AND FkChannelId=? AND Name=? AND IsActive=?" +
        " AND ? BETWEEN " +
        "strftime('%Y-%m-%d %H:%M:%S',substr(parameter.StartDate,7,4) || '-' || " +
        "substr(parameter.StartDate,1,2) || '-' || " +
        "substr(parameter.StartDate,4,2) || substr(parameter.StartDate, 11,9))" +
        " AND " +
        "strftime('%Y-%m-%d %H:%M:%S',substr(parameter.EndDate,7,4) || '-' || " +
        "substr(parameter.EndDate,1,2) || '-' || " +
        "substr(parameter.EndDate,4,2) || substr(parameter.EndDate, 11,9))";
      return vm
        .query(queryStr, parameters)
        .then(function(result) {
          var paramValueResult = vm.getById(result);
          return paramValueResult;
        });
    }

    function getParamDynamicValue(fkProductId, fkChannelId, tableName, paramValue, paramName) {
      var parameters = ["" + fkProductId, "" + fkChannelId, "" + paramName, "" + 1];

      return vm
        .query("SELECT " + paramValue + " FROM " + tableName + " WHERE FkProductId=?  AND FkChannelId=? AND  Name=?  AND IsActive=?",
          parameters)
        .then(function(result) {
          var paramValueResult = vm.getAll(result);
          return paramValueResult[0];
        });
    }

    function getQuotes() {
      var parameters = ["" + 1];

      return vm
        .query("SELECT * FROM AskQuotation WHERE IsActive=?",
          parameters)
        .then(function(result) {
          var paramValueResult = vm.getAll(result);
          return paramValueResult[0];
        });
    }

    function getAllMapedFunds(fkProductId) {
      return vm
        .query("SELECT pm.PkFundId as id ,pm.Name, pm.FMC FROM PceMstFund as pm INNER JOIN PceMapProductFund as pmp ON pm.PkFundId = pmp.FkFundId WHERE pmp.FkProductId=" + fkProductId)
        .then(function(result) {
          var paramValueResult = vm.getAll(result);
          $log.debug("param<>", paramValueResult);
          return paramValueResult;
        });
    }

    function getHlProductCode(value, FkProductId, FkChannelId, paramName) {
      $log.debug(value + "===" + FkProductId + "===" + FkChannelId + "===" + paramName);
      return vm.query("SELECT Name FROM PceMstValidation WHERE FkValidationTypeId = 1 AND FkProductId=" + FkProductId + " AND FkChannelId =" + FkChannelId + " AND Name LIKE '" + paramName + "%' AND " + value + "  BETWEEN MinValue AND MaxValue")
        .then(function(result) {
          var paramValueResult = vm.getById(result);
          var paramValue =  paramValueResult.Name;
          return paramValue;
        });
    }

    function getAgeValidationData(fkProductId, fkChannelId, additionalCondition, days){
      return vm.query("SELECT Name, MIN(MinValue) MinValue, MAX(MaxValue) MaxValue, ErrorMessage FROM PceMstValidation WHERE FkProductId="+fkProductId+" AND FkChannelId="+fkChannelId+" AND "+additionalCondition+" AND IsActive = 1")
      .then(function(result) {
        var resultset = vm.getById(result);
        var rDate = {};
        var cd      = new Date();
        var ma      = new Date();
        cd.setMonth(cd.getMonth()+1);
        ma.setMonth(ma.getMonth()+1);
        var cDate   = (cd.getDate().toString().length === 2)?(cd.getDate()):("0"+cd.getDate());
        var cMonth  = (cd.getMonth().toString().length === 2)?(cd.getMonth()):("0"+cd.getMonth());
        var mxMonth  = (ma.getMonth().toString().length === 2)?(ma.getMonth()):("0"+ma.getMonth());
        var laMinAgeYear = "";
        var laMaxAgeYear = "";
        if(days){
          var nd          = ma.setDate(-Math.abs(resultset.MinValue));
          var ndd         = new Date(nd);
          var nmxMonth    = (ndd.getMonth().toString().length === 2)?(ndd.getMonth()):("0"+ndd.getMonth());
          var ncDate      = (ndd.getDate().toString().length === 2)?(ndd.getDate()):("0"+ndd.getDate());

          laMinAgeYear    = parseInt(cd.getFullYear() - resultset.MaxValue/365) + "-" + cMonth + "-" + cDate;
          laMaxAgeYear    = parseInt(ndd.getFullYear()) + "-" + nmxMonth + "-" + cDate;
          return {"MinDate":laMinAgeYear,"MaxDate":laMaxAgeYear,"MinAgeDays":resultset.MinValue,"MinAge":Math.round(resultset.MinValue/365),"MaxAgeDays":resultset.MaxValue,"MaxAge":resultset.MaxValue/365};
        }
        else{
          laMinAgeYear    = parseInt(cd.getFullYear() - resultset.MaxValue) + "-" + cMonth + "-" + cDate;
          laMaxAgeYear    = parseInt(ma.getFullYear() - resultset.MinValue) + "-" + mxMonth + "-" + cDate;
          return {"MinDate":laMinAgeYear,"MaxDate":laMaxAgeYear,"MinAge":resultset.MinValue,"MaxAge":resultset.MaxValue};
        }
      });
    }

    function isInRange(fkProductId, fkChannelId, productCode, validationName, valueToCompare , additionValue) {
      var addStr = "";
      if(additionValue != undefined){
            addStr = "And Value = "+additionValue;
      }
      $log.debug("validationName", validationName);
      return vm.query("SELECT pt.Name, pv.ErrorMessage FROM PceMstValidation as pv INNER JOIN PceMstValidationType as pt ON pv.FkValidationTypeId = pt.PkValidationTypeId WHERE pv.FkProductId=" + fkProductId + " AND pv.FkChannelId=" + fkChannelId + " AND pv.Name='" + productCode + "' AND pt.Name='" + validationName + "' "+addStr+" AND " + valueToCompare + " NOT BETWEEN pv.MinValue AND pv.MaxValue")
        .then(function(result) {
          return vm.getAll(result);
        });
    }



    function getProductRiders(fkProductId,channelId){
      var _currentDate = utilityService.getDisplayDate(new Date(), "yyyy-MM-dd HH:mm:ss");
      var parameters = ["" + fkProductId, _currentDate];
      $log.debug("parameters",parameters);
      var queryStr =
        "SELECT GROUP_CONCAT(FkRiderId) Rider FROM PceMapProductRider As parameter WHERE FkProductId = ? AND IsActive = 1" +
        " AND ? BETWEEN " +
        "strftime('%Y-%m-%d %H:%M:%S',substr(parameter.StartDate,7,4) || '-' || " +
        "substr(parameter.StartDate,1,2) || '-' || " +
        "substr(parameter.StartDate,4,2) || substr(parameter.StartDate, 11,9))" +
        " AND " +
        "strftime('%Y-%m-%d %H:%M:%S',substr(parameter.EndDate,7,4) || '-' || " +
        "substr(parameter.EndDate,1,2) || '-' || " +
        "substr(parameter.EndDate,4,2) || substr(parameter.EndDate, 11,9))";
      return vm.query(queryStr, parameters)
      .then(function(result) {
        $log.debug("getProductRiders result",result);
        return vm.getById(result);
      });
    }

    function processRequiredDataForSync() {
      $log.debug("inside processRequiredDataForSync");
      var q = $q.defer();
      return $q.all([
        vm.query("delete from gsynchelper where tblname= 'AskDocument' and recnum in (select rowid from AskDocument where DocumentStatus=0)"),
        vm.query("create table if not exists SwitchCustomerProfile(PKSwitchCustomerProfile INTEGER PRIMARY KEY AUTOINCREMENT,Cust_ID smallint NOT NULL,MobileNo int NOT NULL,Gender smallint NOT NULL, Age smallint NOT NULL,FirstName varchar(50) NOT NULL,LastName varchar(50) NOT NULL,Email varchar(50) NOT NULL,LifeStage int,LifeStagePriority varchar(100),StepCompleted int,IsActive varchar(0)  NOT NULL ,CreatedDate varchar(23)  NOT NULL ,CreatedBy varchar(50)  NOT NULL,ModifiedDate varchar(23)  NOT NULL,ModifiedBy varchar(50)  NOT NULL,ModifiedTimestamp varchar(8))"),
        vm.query("create table if not exists SwitchCalculator(PKSwitchCalculator INTEGER PRIMARY KEY AUTOINCREMENT,FKCust_ID smallint NOT NULL,Type int NOT NULL,Input varchar(-1), Output varchar(-1),IsActive varchar(0)  NOT NULL ,CreatedDate varchar(23)  NOT NULL ,CreatedBy varchar(50)  NOT NULL,ModifiedDate varchar(23)  NOT NULL,ModifiedBy varchar(50)  NOT NULL,ModifiedTimestamp varchar(8))"),
        vm.query("create table if not exists SwitchProductIllustration(PKSwitchPI INTEGER PRIMARY KEY AUTOINCREMENT,FKCust_ID smallint NOT NULL,FkProductId int NOT NULL,ProductIllustrationId smallint NOT NULL,Input varchar(-1), Output varchar(-1),AnnualPremium smallint NOT NULL,IsActive varchar(0)  NOT NULL ,CreatedDate varchar(23)  NOT NULL ,CreatedBy varchar(50)  NOT NULL,ModifiedDate varchar(23)  NOT NULL,ModifiedBy varchar(50)  NOT NULL,ModifiedTimestamp varchar(8))"),
        vm.query("create table if not exists BiRefNos(AgentID varchar(50) NOT NULL,BiQuoteNo varchar(50) NOT NULL,BiQuoteNoUsedStatus int NOT NULL)"),
        vm.query("create table if not exists ProposalRefNos(AgentID varchar(50) NOT NULL,ProposalNO varchar(50) NOT NULL, ProposalNoUsedStatus int NOT NULL)"),
        vm.query("create table if not exists TempBiJson(TempJson varchar(-1))")
      ]).then(
        function(result) {
          return q.resolve(result);
        },
        function(error) {
          $log.warn('I found an error');
          $log.warn(error);
          q.reject(error);
        });
    }

    function createClientDbTables() {
      $log.debug("inside createClientDbTables");
      var q = $q.defer();
      return $q.all([
        vm.query("delete from gsynchelper where tblname= 'AskDocument' and recnum in (select rowid from AskDocument where DocumentStatus=0)"),
        vm.query("create table if not exists SwitchCustomerProfile(PKSwitchCustomerProfile INTEGER PRIMARY KEY AUTOINCREMENT,Cust_ID smallint NOT NULL,MobileNo int NOT NULL,Gender smallint NOT NULL, Age smallint NOT NULL,FirstName varchar(50) NOT NULL,LastName varchar(50) NOT NULL,Email varchar(50) NOT NULL,LifeStage int,LifeStagePriority varchar(100),StepCompleted int,IsActive varchar(0)  NOT NULL ,CreatedDate varchar(23)  NOT NULL ,CreatedBy varchar(50)  NOT NULL,ModifiedDate varchar(23)  NOT NULL,ModifiedBy varchar(50)  NOT NULL,ModifiedTimestamp varchar(8))"),
        vm.query("create table if not exists SwitchCalculator(PKSwitchCalculator INTEGER PRIMARY KEY AUTOINCREMENT,FKCust_ID smallint NOT NULL,Type int NOT NULL,Input varchar(-1), Output varchar(-1),IsActive varchar(0)  NOT NULL ,CreatedDate varchar(23)  NOT NULL ,CreatedBy varchar(50)  NOT NULL,ModifiedDate varchar(23)  NOT NULL,ModifiedBy varchar(50)  NOT NULL,ModifiedTimestamp varchar(8))"),
        vm.query("create table if not exists SwitchProductIllustration(PKSwitchPI INTEGER PRIMARY KEY AUTOINCREMENT,FKCust_ID smallint NOT NULL,FkProductId int NOT NULL,ProductIllustrationId smallint NOT NULL,Input varchar(-1), Output varchar(-1),AnnualPremium smallint NOT NULL,IsActive varchar(0)  NOT NULL ,CreatedDate varchar(23)  NOT NULL ,CreatedBy varchar(50)  NOT NULL,ModifiedDate varchar(23)  NOT NULL,ModifiedBy varchar(50)  NOT NULL,ModifiedTimestamp varchar(8))"),
        vm.query("create table if not exists BiRefNos(AgentID varchar(50) NOT NULL,BiQuoteNo varchar(50) NOT NULL,BiQuoteNoUsedStatus int NOT NULL)"),
        vm.query("create table if not exists ProposalRefNos(AgentID varchar(50) NOT NULL,ProposalNO varchar(50) NOT NULL, ProposalNoUsedStatus int NOT NULL)"),
        vm.query("create table if not exists TempBiJson(TempJson varchar(-1))")
      ]).then(
        function(result) {
          return q.resolve(result);
        },
        function(error) {
          $log.warn('I found an error');
          $log.warn(error);
          q.reject(error);
        });
    }

    /*future invest*/
    function getParamValueForFutureInvest(fkProductId, channelId, value, payType) {
      var parameters = ["" + fkProductId, "" + payType];
      return vm
        .query("SELECT value FROM PceMstValidation WHERE " + value + " BETWEEN MinValue AND MaxValue AND FkProductId=? AND Name =?", parameters)
        .then(function(result) {
          var paramValueResult = vm.getAll(result);
          var paramValue;
          for (var i = 0; i < paramValueResult.length; i++) {
            if (paramValueResult[i].Value.length > 0) {
              paramValue = paramValueResult[i].Value;
            }
          }
          return paramValue;
        });
    }

    function getBandSS(FkProductId, FkChannelId, paramName, valueToCompare) {
      var parameters = ["" + FkProductId, "" + FkChannelId, "" + paramName, "" + valueToCompare];
      return vm.query("SELECT Value FROM PceMstValidation WHERE FkProductId=? AND FkChannelId=? AND Name=?  AND ? Between MinValue AND MaxValue", parameters)
        .then(function(result) {
          var paramValueResult = [];
          paramValueResult = vm.getAll(result);
          $log.debug('result::SS', paramValueResult);

          return paramValueResult[0].Value;
        });
    }
  }
]);

unificationBAXA.service('commonDbProductCalculation', [
  '$q',
  '$log',
  'commonDBFuncSvc',
  function($q, $log, commonDBFuncSvc) {
    var vm = this;
    vm.getModalPremiumConvertingFactor = getModalPremiumConvertingFactor;
    vm.serviceTaxFactorForFirstAndSecondYear = serviceTaxFactorForFirstAndSecondYear;
    vm.getValueForGivenRange = getValueForGivenRange;
    vm.getNsapRate = getNsapRate;
    vm.serviceTaxFirstYear = serviceTaxFirstYear;
    vm.serviceTaxSecondYear = serviceTaxSecondYear;
    vm.getBand = getBand;
    vm.getAllStaticValuesByName = getAllStaticValuesByName;

    vm.getAllStaticValuesByArray = getAllStaticValuesByArray;
    vm.getMinValueOfBand = getMinValueOfBand;

    /* TODO:remove this comment once refactoring & testing is done
    below comment will be removed once development done
    this function will be used commonly as fetching MP factor logic is same almost over all products
    list is as follows
    *ADB
    */
    function serviceTaxFactorForFirstAndSecondYear(prodId, channelId) {
      var q = $q.defer();
      commonDBFuncSvc.getParamValue(prodId, channelId, 'STAX')
        .then(function(val) {
          var paramValueJson = JSON.parse(val);
          $log.debug('serviceTaxTermPolicy ::', paramValueJson);
          q.resolve(paramValueJson);
        });
      return q.promise;
    }

    /* TODO:remove this comment once refactoring & testing is done
    below comment will be removed once development done
    this function will be used commonly as fetching MP factor logic is same almost over all products
    list is as follows
    *ADB
    */
    function getModalPremiumConvertingFactor(prodId, channelId, premiumMode) {
        $log.debug("===>>"+premiumMode);
      var q = $q.defer();
      var premiumToModalFactor;
      commonDBFuncSvc.getParamValue(prodId, channelId, 'MPFACTOR')
        .then(function(val) {
          var paramValueJson = JSON.parse(val);
          $log.debug('premiumToModalFactor ::', paramValueJson[premiumMode][0]+"==="+premiumMode);
          q.resolve(paramValueJson[premiumMode][0]);
        });
      return q.promise;
    }

    function getValueForGivenRange(prodId, channelId, paramName, valueToCompare) {
      var parameters = ["" + prodId, "" + channelId, "" + paramName, "" + valueToCompare];
      $log.debug('parameters******** ::', parameters);
      return commonDBFuncSvc.query("SELECT Value FROM PceMstValidation WHERE FkProductId=? AND FkChannelId=? AND Name=?  AND ? Between MinValue AND MaxValue", parameters)
        .then(function(result) {
          var paramValueResult = [];
          paramValueResult = commonDBFuncSvc.getAll(result);
          $log.debug('result::SS', paramValueResult);
          if (paramValueResult.length > 0) {
            return paramValueResult[0].Value;
          } else {
            return 0;
          }
        });
    }

    function getNsapRate(prodId, channelId) {
      var q = $q.defer();
      commonDBFuncSvc.getParamValue(prodId, channelId, 'NSAPRATE')
        .then(function(val) {
          var ParamValueJson = JSON.parse(val);
          $log.debug('getFiNsapRate', val);
          q.resolve(val);

        });
      return q.promise;
    }

    function serviceTaxFirstYear(prodId, channelId) {
      var q = $q.defer();
      var serviceTax;
      commonDBFuncSvc.getParamValue(prodId, channelId, 'STAXY1')
        .then(function(val) {
          var paramValueJson = JSON.parse(val);
          $log.debug('serviceTaxTermPolicy ::', paramValueJson);
          q.resolve(paramValueJson);
        });
      return q.promise;
    }

    function serviceTaxSecondYear(prodId, channelId) {
      var q = $q.defer();
      var serviceTax;
      commonDBFuncSvc.getParamValue(prodId, channelId, 'STAXY2')
        .then(function(val) {
          var paramValueJson = JSON.parse(val);
          $log.debug('serviceTaxTermPolicy ::', paramValueJson);
          q.resolve(paramValueJson);
        });
      return q.promise;
    }

    function getBand(prodId, channelId, valueToCompare, paramName) {
      var q = $q.defer();
      if (!paramName) {
        paramName = 'PBAND';
      }
      getValueForGivenRange(prodId, channelId, paramName, valueToCompare)
        .then(function(val) {
          $log.debug('getEABand :', val);
          q.resolve(val);
        });
      return q.promise;
    }

    function getAllStaticValuesByArray(prodId, channelId, params) {
      if (params.length > 0 && prodId !== "" && channelId !== "") {
        var returnVar = {};
        var q = $q.defer();
        var inVars = "";
        for (var x = 0; x < params.length; x++) {
          inVars += (inVars === "") ? ('"' + params[x] + '"') : (',"' + params[x] + '"');
        }
        var parameters = ["" + prodId, "" + channelId];
        commonDBFuncSvc.query("SELECT MasterValue, MasterKey, Name FROM AskMstGenericMaster WHERE FkProductId=? AND FkChannelId=? AND Name IN (" + inVars + ")  AND IsActive = 1", parameters)
          .then(function(result) {
            var paramValueResult = [];
            paramValueResult = commonDBFuncSvc.getAll(result);

            var arr     = [];
            var newArr  = [];
            for (var s = 0; s < params.length; s++) {
              arr = [];
              for (var props in paramValueResult) {
                if (paramValueResult.hasOwnProperty(props)) {
                  var obj = {};
                  if (paramValueResult[props].Name == params[s]) {
                    obj.id = paramValueResult[props].MasterKey;
                    obj.name = paramValueResult[props].MasterValue;
                    arr.push(obj);
                  }
                }
              }
              newArr[params[s]] = arr;
            }

            q.resolve(newArr);
          });
        return q.promise;
      } else {
        return false;
      }
    }

    function getAllStaticValuesByName(prodId, channelId, paramName) {
      var q = $q.defer();
      var parameters = ["" + prodId, "" + channelId, "" + paramName];
      commonDBFuncSvc.query("SELECT MasterValue, MasterKey FROM AskMstGenericMaster WHERE FkProductId=? AND FkChannelId=? AND Name=?  AND IsActive = 1", parameters)
        .then(function(result) {

          var paramValueResult = [];
          paramValueResult = commonDBFuncSvc.getAll(result);
          $log.debug('result::SS', paramValueResult);

          var arr = [];
          for (var prop in paramValueResult) {
            if (paramValueResult.hasOwnProperty(prop)) {
              var obj = {};
              obj.id = paramValueResult[prop].MasterKey;
              obj.name = paramValueResult[prop].MasterValue;
              arr.push(obj);
            }
          }
          $log.debug("getAllStaticValuesByName:::", arr);
          q.resolve(arr);

        });
      return q.promise;
    }
function getMinValueOfBand(prodId, channelId, valueToCompare){
    var q = $q.defer();

    var parameters = ["" + prodId, "" + channelId, "" + valueToCompare];
    commonDBFuncSvc.query("SELECT * FROM PceMstValidation WHERE Name='PRBAND' AND FkProductId=? AND FkChannelId=? AND IsActive = 1 AND ? BETWEEN MinValue AND MaxValue", parameters)

      .then(function(result) {
          paramValueResult = commonDBFuncSvc.getAll(result);
          $log.debug("result===",paramValueResult.length);
          if(paramValueResult.length ===  0){

              q.resolve(true);
          }else{
              q.resolve(paramValueResult);
          }

      });
      return q.promise;
    }





  }
]);
