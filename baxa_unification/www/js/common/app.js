/** BAXA Unification App **/
var db = null;
var isWeb = false;
/**
  angular.module is a global place for creating, registering and retrieving
Angular modules
  'starter' is the name of this angular module example (also set in a <body>
attribute in index.html)
  the 2nd parameter is an array of 'requires'
**/
var unificationBAXA = angular.module('unificationBAXA', [
  'ionic',
  'ngCordova',
  'oc.lazyLoad',
  'documentScanAndUpload',
  'otherCalculators',
  'productCalculator',
  'switchModule',
  'eAppModule',
  'appForm',
  'angAccordion',
  'ngMessages',
  'oc.lazyLoad',
]);

/** Modules **/
var documentScanAndUpload =
  angular.module('documentScanAndUpload', ['tabSlideBox']);

var productCalculator = angular.module('productCalculator', []);
var switchModule = angular.module('switchModule', []);
var eAppModule = angular.module('eAppModule', ['fcsa-number']);
var appForm = angular.module('appForm',[]);

/**Boostraping Manually**/
angular.element(document)
  .ready(function() {
    angular.bootstrap(document, ['unificationBAXA']);
  });

/** main module run **/
unificationBAXA.run(function($ionicPlatform, $log, $ionicPopup, $cordovaSQLite,
  $ionicLoading, $rootScope, apiUrl, commonDBFuncSvc,getSetCommonDataService,quoteProposalNosDataService ) {
  var start;
  var end;
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      /**Hide the accessory bar by default (remove this to show the accessory
      bar above the keyboard
      for form inputs)**/
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      /**Don't remove this line unless you know what you are doing. It stops the
      viewport
      from snapping when text inputs are focused. Ionic handles this internally
      for
      a much nicer keyboard experience.**/
      cordova.plugins.Keyboard.disableScroll(true);
    }
  //  localStorage.clear();
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    if (window.cordova) {
      cordova.getAppVersion(function(version) {
        $rootScope.appVersion = version;
        $log.debug("Version :", version);
      });
    } else {
      $rootScope.appVersion = "0.11.2_dev";
    }
    var c = !!window.cordova;
     $log.debug("iscordova:" + c);
    if (c) {
      isWeb = false;
      if (ionic.Platform.isIOS()) {        
        db = window.openDatabase("syncdb", "1.0", "syncdb", 50 * 1024);
      } else {
        db = window.sqlitePlugin.openDatabase({
          name: "syncdb",
          iosDatabaseLocation: "default",
          androidLockWorkaround: 1
        });
      }
    } else {
      isWeb = false;
      db = window.openDatabase("syncdb", "1.0", "syncdb", 2 * 1024 * 1024);
    }

    /** Temp Code***/

    var userCommonData = {
      agentId: localStorage.getItem("agentId"),
      channelId:localStorage.getItem("channelId"),
      channelName:localStorage.getItem("channelName"),
      mPwd :localStorage.getItem("mPwd"),
      userName:localStorage.getItem("userName")
    };
    localStorage.setItem("agentId",  userCommonData.agentId);
    localStorage.setItem("channelId",  userCommonData.Channel_id);
    localStorage.setItem("channelName", userCommonData.channelName);
    localStorage.setItem("userName", userCommonData.userName);
    localStorage.setItem("mPwd",userCommonData.mPwd);
    getSetCommonDataService.setCommonData(userCommonData);
  /** Temp Code***/

    if (localStorage.getItem('isFirstTime') == 0) {
      commonDBFuncSvc.processRequiredDataForSync().then(function(val) {
        commonDBFuncSvc.initiateSync().then(function(result){
          if(result){
            quoteProposalNosDataService.getBIProposalRefNoData();
          }
        });
      });
    }


    /**
     * goDB Lib integration for test...
     * @class app.js
     * @submodule run
     */
    window.setInterval(function() {
      $log.debug('***start sync***');
      if (localStorage.getItem('isFirstTime') == 0) {
        $log.debug("inside isfirsttime false");
        commonDBFuncSvc.processRequiredDataForSync().then(function(val) {
          commonDBFuncSvc.initiateSync().then(function(result){
            if(result){
              quoteProposalNosDataService.getBIProposalRefNoData();
            }
          });
        });
      }
    }, 300000); /* 5 minutes interval*/
  });
});

/** Debug mode settings **/
unificationBAXA.config(function($logProvider) {
  $logProvider.debugEnabled(false);
});

/**Screen Orientation**/
var app = {
  initialize: function() {
    this.bindEvents();
  },
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  onDeviceReady: function() {
    if (window.isTablet === true) {
      screen.lockOrientation('landscape');
    } else {
      screen.lockOrientation('portrait');
    }
  }
};
app.initialize();
