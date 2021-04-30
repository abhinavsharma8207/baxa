unificationBAXA.service('utilityService', ['$q', '$filter', '$state', '$log',
  function($q, $filter, $state, $log) {
    'use strict';
    var vm = this;
    vm.getCurrentDateForDisplay = getCurrentDateForDisplay;
    vm.getYesterdayDateForDisplay = getYesterdayDateForDisplay;
    vm.getCurrentDateTimeStamp = getCurrentDateTimeStamp;
    vm.getYesterdayDateTimeStamp = getYesterdayDateTimeStamp;
    vm.getDisplayDate = getDisplayDate;
    vm.getDateTimeStamp = getDateTimeStamp;
    vm.isInRange = isInRange;
    vm.getOneDayTimeStamp = getOneDayTimeStamp;
    vm.arrayObjectIndexOf = arrayObjectIndexOf;
    vm.getEmailData = getEmailData;
    vm.getMPwd = getMPwd;

    function getMPwd(password, passtype) {
      var type;
      if (passtype == "md-5") {
        type = $.md5(password); /**for MD5 if sync server uses MD5 passwords**/
      } else if (passtype == "sha-256") {
        type = new jsSHA(password, "TEXT")
          .getHash("SHA-256", "HEX")
          .toUpperCase(); /*for SHA-256*/
      } else if (passtype == "sha-384") {
        type = new jsSHA(password, "TEXT")
          .getHash("SHA-384", "HEX")
          .toUpperCase(); /* for SHA-256*/
      } else if (passtype == "sha-512") {
        type = new jsSHA(password, "TEXT")
          .getHash("SHA-512", "HEX")
          .toUpperCase(); /* for SHA-256*/
      }
      return type;
    }

    function getCurrentDateForDisplay() {
      var today = $filter('date')(new Date(), 'MM/dd/yyyy');
      $log.debug('today', today);
      return today;
    }

    function getEmailData(inputData) {
      var q = $q.defer();
      var isValidEmail = true;
      var emailType = "";
      var emailData = {};
      var arrEmailCc = [];
      var arrEmailTo = [];
      //var reg = /^[a-z0-9]+[a-z0-9._]+@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      var reg=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (inputData.emailTo) {
        arrEmailTo = inputData.emailTo.split(",");
      }
      if (inputData.emailCc) {
        arrEmailCc = inputData.emailCc.split(",");
      }
      arrEmailTo.forEach(function(item, index) {
        if (!reg.test(item)) {
          isValidEmail = false;
          emailType = "emailTo";
          q.reject(emailType);
        }
      });
      arrEmailCc.forEach(function(item, index) {
        if (!reg.test(item)) {
          isValidEmail = false;
          emailType = "emailCc";
          q.reject(emailType);
        }
      });

      if (isValidEmail) {
        emailData.EmailTo = arrEmailTo.toString();
        emailData.EmailCc = arrEmailCc.toString();
        emailData.isBrochureSelected = inputData.isBrochureSelected;
        emailData.isIllustrationsSelected = inputData.isIllustrationsSelected;
        q.resolve(emailData);
      }
      return q.promise;
    }

    function getYesterdayDateForDisplay() {
      /**Unix timestamp in milliseconds**/
      var todayTimeStamp = new Date().getTime();
      /**Milliseconds in a day**/
      var oneDayTimeStamp = 1000 * 60 * 60 * 24;
      var diff = todayTimeStamp - oneDayTimeStamp;
      var yesterdayDate = new Date(diff);
      var yesterday = $filter('date')(yesterdayDate, 'MM/dd/yyyy');
      $log.debug('yesterday', yesterday);
      return yesterday;
    }

    function getCurrentDateTimeStamp() {
      var today = $filter('date')(new Date(), 'MM/dd/yyyy');
      $log.debug('today', today);
      return new Date(today).getTime();
    }

    function getYesterdayDateTimeStamp() {
      var todayTimeStamp = new Date().getTime();
      var oneDayTimeStamp = 1000 * 60 * 60 * 24;
      var diff = todayTimeStamp - oneDayTimeStamp;
      var yesterdayDate = new Date(diff);
      var yesterday = $filter('date')(yesterdayDate, 'MM/dd/yyyy');
      $log.debug('yesterday', yesterday);
      return new Date(yesterday).getTime();
    }

    function getDisplayDate(date, format) {
      var _date = new Date(date);
      var formatedDate = $filter('date')(_date, format);
      return formatedDate;
    }

    function getDateTimeStamp(date) {
      var _date = new Date(date);
      return _date.getTime();
    }

    function isInRange(min, max, value) {
      $log.debug("min", min);
      $log.debug("max", max);
      $log.debug("val", value);
      if (value >= min && value <= max) {
        return true;
      } else {
        return false;
      }
    }

    function getOneDayTimeStamp() {
      var oneDayTimeStamp = 1000 * 60 * 60 * 24; // Milliseconds in a day
      return oneDayTimeStamp;
    }

    function arrayObjectIndexOf(arr, obj) {
      for (var i = 0; i < arr.length; i++) {
        if (angular.equals(arr[i], obj)) {
          return i;
        }
      }
      return -1;
    }
  }
]);
